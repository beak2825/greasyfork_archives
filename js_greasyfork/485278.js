// ==UserScript==
// @name         Edit Last.fm Scrobbles
// @version      0.4.6
// @description  Adds an "Edit scrobble" entry to the context menu of Last.fm
// @author       CennoxX, nicoleahmed
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Edit%20Last.fm%20Scrobbles]%20
// @match        https://www.last.fm/*user*
// @match        https://www.last.fm/api?*
// @connect      ws.audioscrobbler.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485278/Edit%20Lastfm%20Scrobbles.user.js
// @updateURL https://update.greasyfork.org/scripts/485278/Edit%20Lastfm%20Scrobbles.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* eslint curly: "off" */

(function main() {
    "use strict";
    var api_key = "7bfc3993e87eb839bd1567bd2622dd56";
    var username = localStorage.getItem("username");
    var sessionKey = localStorage.getItem("sessionKey");
    authenticate();
    reloadOnPageChange();
    addEditButtonToMenu();

    function authenticate(){
        if (!sessionKey){
            var token = location.href.split("?token=")[1];
            if (token){
                document.querySelector(".error-page-marvin").style = "display: none";
                setSuccessPage("Connecting …", "", "");
                var data = "api_key=" + api_key + "&token=" + token + "&method=auth.getsession";
                GM.xmlHttpRequest({
                    method: "GET",
                    url: "https://ws.audioscrobbler.com/2.0/?" + data + "&api_sig=" + lfmmd5(data) + "&format=json",
                    onload: function(response) {
                        if (response.responseText.length > 0) {
                            var jsonObj = JSON.parse(response.responseText);
                            username = jsonObj.session.name;
                            localStorage.setItem("username", username);
                            sessionKey = jsonObj.session.key;
                            localStorage.setItem("sessionKey", sessionKey);
                            setSuccessPage("Connected", "Access allowed!", "The Edit scrobble feature of Edit Last.fm Scrobbles is now enabled.");
                        }
                    },
                    onerror: function(response) {
                        console.log("Error in fetching contents: " + response.responseText);
                    }
                });
            }
            else
            {
                window.location.replace("https://www.last.fm/api/auth?api_key=" + api_key + "&cb=https://www.last.fm/api");
            }
        }
    }

    function setSuccessPage(title, intro, description){
        document.title = title + " | Last.fm";
        document.querySelector("h1").innerHTML = title;
        document.querySelector(".page-content p").innerHTML = intro;
        document.querySelector(".page-content p~p").innerHTML = description;
    }

    function reloadOnPageChange(){
        var oldChartlist = document.querySelector(".chartlist");
        var observer = new MutationObserver(mutations => {
            if ((mutations?.[0]?.addedNodes?.[0]?.tagName == "TR") || oldChartlist != document.querySelector(".chartlist")) {
                oldChartlist = document.querySelector(".chartlist");
                if (!document.querySelector(".edit-selected-scrobbles-btn"))
                    main();
            }
        });
        observer.observe(document.querySelector("body"), { childList: true, subtree: true });
    }

    function addEditButtonToMenu(){
        var moreMenu = document.querySelectorAll(".chartlist-more-menu");
        moreMenu.forEach((menu) => {
            var fourteenDaysAgo = new Date().getTime() - (14 * 24 * 60 * 60 * 1000);
            if ((menu.querySelector('[name="timestamp"]')?.value ?? 0) * 1000 < fourteenDaysAgo)
                return;
            var listItem = document.createElement("li");
            var editButton = document.createElement("button");
            var editIcon = document.createElement("img");
            editButton.className = "mimic-link dropdown-menu-clickable-item edit-selected-scrobbles-btn";
            editButton.addEventListener("click", addInput);
            editIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQElEQVQ4T5WSMS9EQRRGdxOFYolCI/EDlCQKjYROo1NQSAii1SusSqsTUVDQKRSKFRKFQkm5BZ2eQqHjnJc7ycvbeSv7kpM3c2e+796Zuc3GYN8k27dgGq7gujmAfoq9jzAMXZiDTQ3G4AhWY5w8XxnMxCSJ3WtMg3toaXAC23ABH6WK3hlfQlls9mM4hSfoaPDpWWAnc5wkdmkRdmEPfuAL5jX4hTYcVgyqYss29hJiDbt1BgssHsBo/G/5p5j3YLIbE+YMhog/g09WZInMvoBfihWTnIHPo8E6lC+xR1xnYOltmAAb5rySeYX5PhRPnKvA7LPgTbfgDZbjKGpSgqIJ6wzGWevAHTyEWRTyv0HaWPfvqaBfI+VMzgja9iPpCLbyBnjj5VbOiX1axfbFWjKwMXRdikvrd4TvENv2jht/CXpR/3sr35MAAAAASUVORK5CYII=";
            editIcon.style = "padding-right: 14px;";
            editButton.appendChild(editIcon);
            editButton.appendChild(document.createTextNode("Edit scrobble"));
            listItem.appendChild(editButton);
            menu.insertBefore(listItem, menu.firstChild);
        });
    }

    function addInput(){
        var editButton = this;
        var trackinfo = editButton.closest("tr");
        addInputContainer(trackinfo, "artist");
        var nameContainer = addInputContainer(trackinfo, "name");
        nameContainer.style = "margin-left: 0.5em; margin-right: 8em;";

        trackinfo.querySelector(".chartlist-buylinks").style = "display:none";
        trackinfo.querySelector(".chartlist-more-button").style = "display:none";

        var saveContainer = document.createElement("td");
        saveContainer.style = "margin-left: 1em; margin-right: -2.4em; z-index: 1; opacity: 0.3;";
        saveContainer.classList.add("chartlist-save");
        var saveButton = document.createElement("button");
        saveButton.addEventListener("click", scrobbleSong);
        saveButton.style = `padding: 8px 7px; margin: 8px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAA2UlEQVQoU2NkIBMwAvWZAPFkILbAY8YfoNwaIC4E4hcgdSCNx4FYACrgAKQb0AwAiYHwFyB+AsSOILUgjf+RFIM0gcSQQT1U3hZIb4dpJkUjSK0NVPMWZI1/gYLNaLYhc2EuaQcKFiBrnAsUSABiZiyaHwLFFkDFwU5H1tiIxzYMP+PSCIsikIZSID6CpBOvjeuBCgOgircBaW9iNW4CKvSFKt4BpD2J1QgK9n6o4kogvYdYjfjCCe5HWJJbQWSoZgDVPYGlBpCzQCFJDDgDVFSJni6J0QhWAwAcqzvPSVZJyQAAAABJRU5ErkJggg==");`;
        saveContainer.appendChild(saveButton);
        trackinfo.insertBefore(saveContainer, trackinfo.querySelector(".chartlist-timestamp"));
        var style = document.createElement("style");
        style.textContent = ".chartlist-save:hover { opacity: 1.0! important; }";
        document.head.appendChild(style);
    }

    function addInputContainer(trackinfo, containerName){
        var container = trackinfo.querySelector(".chartlist-" + containerName);
        var oldInput = container.firstElementChild.title;
        var inputElement = document.createElement("input");
        inputElement.value = oldInput;
        inputElement.classList.add(containerName + "-input");
        container.firstElementChild.style = "display:none;";
        container.appendChild(inputElement);
        container.classList.remove("chartlist-" + containerName);
        container.classList.add("chartlist" + containerName);
        inputElement.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                scrobbleSong.bind(trackinfo)();
            }
            else if (event.key === "Escape"){
                removeInput(trackinfo);
            }
        });
        return container;
    }

    function scrobbleSong(){
        var trackinfo = this.closest("tr");
        var artist = encodeURIComponent(trackinfo.querySelector(".artist-input").value);
        var track = encodeURIComponent(trackinfo.querySelector(".name-input").value);
        var timestamp = trackinfo.querySelector('[name="timestamp"]').value;
        var oldTrack = encodeURIComponent(trackinfo.querySelector(".chartlistname > a").title);
        var oldArtist = encodeURIComponent(trackinfo.querySelector(".chartlistartist > a").title);
        if (artist.toLowerCase() == oldArtist.toLowerCase() && track.toLowerCase() == oldTrack.toLowerCase()) {
            removeInput(trackinfo);
            return;
        }
        var data = "api_key=" + api_key + "&sk=" + sessionKey + "&method=track.scrobble&artist=" + artist + "&track=" + track + "&timestamp=" + timestamp;
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://ws.audioscrobbler.com/2.0/",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: data + "&api_sig=" + lfmmd5(data),
            onload: function(response) {
                if (response.responseText.length > 0 && response.responseText.includes('<lfm status="ok">')) {
                    trackinfo.querySelector(".more-item--delete").click();
                    removeInput(trackinfo, decodeURIComponent(artist), decodeURIComponent(track));
                    setTimeout(function() {location.reload();}, 300);
                }
				else if (response.responseText.includes('<error code="9">'))
				{
                    localStorage.removeItem("sessionKey");
					authenticate();
				}
                else
                {
					console.log("Error from Last.fm: " + response.responseText);
                }
            },
            onerror: function(response) {
                console.log("Error in fetching contents: " + response.responseText);
            }
        });
    }

    function removeInput(trackinfo, artist = null, track = null){
        trackinfo.style = "opacity: 1.0;";
        removeInputContainer(trackinfo, track, "name");
        removeInputContainer(trackinfo, artist, "artist");
        trackinfo.querySelector(".chartlist-buylinks").style = "display:initial";
        trackinfo.querySelector(".chartlist-more-button").style = "display:initial";
        trackinfo.querySelector(".chartlist-save").remove();
    }

    function removeInputContainer(trackinfo, newInput, containerName){
        var container = trackinfo.querySelector(".chartlist" + containerName);
        container.querySelector("." + containerName + "-input").remove();
        container.classList.remove("chartlist" + containerName);
        container.classList.add("chartlist-" + containerName);
        container.style = "";
        var linkElement = container.firstElementChild;
        linkElement.style = "display:initial;";
        if (newInput){
            linkElement.title = newInput;
            linkElement.innerHTML = newInput;
        }
    }

    function lfmmd5(f){for(var k=[],i=0;64>i;)k[i]=0|4294967296*Math.sin(++i%Math.PI);var c,d,e,h=[c=1732584193,d=4023233417,~c,~d],g=[],b=decodeURIComponent(unescape(f=f.split("&").sort().join("").replace(/=/g,"")+atob("ZmY4MmMzNTkzZWI3Zjg5OGMzMjhjZmIwN2JiNjk2ZWM=")))+"\u0080",a=b.length;f=--a/4+2|15;for(g[--f]=8*a;~a;)g[a>>2]|=b.charCodeAt(a)<<8*a--;for(i=b=0;i<f;i+=16){for(a=h;64>b;a=[e=a[3],c+((e=a[0]+[c&d|~c&e,e&c|~e&d,c^d^e,d^(c|~e)][a=b>>4]+k[b]+~~g[i|[b,5*b+1,3*b+5,7*b][a]&15])<<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+b++%4])|e>>>-a),c,d])c=a[1]|0,d=a[2];for(b=4;b;)h[--b]+=a[b]}for(f="";32>b;)f+=(h[b>>3]>>4*(1^b++)&15).toString(16);return f;};
})();