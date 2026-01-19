// ==UserScript==
// @name         Edit Last.fm Scrobbles
// @version      0.5.0
// @description  Adds an "Edit scrobble" entry to the context menu of Last.fm
// @author       CennoxX
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
                        console.error("Error in fetching contents: " + response.responseText);
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

        var track = trackinfo.querySelector(".chartlist-name > a")?.title || "";
        var artist = trackinfo.querySelector(".chartlist-artist > a")?.title || "";
        var timestamp = trackinfo.querySelector('[name="timestamp"]')?.value || "";

        showEditModal(trackinfo, track, artist, "Loading...", "Loading...", timestamp);
        fetchScrobbleInfo(artist, track, timestamp, (scrobbleInfo) => {
            var modal = document.querySelector(".modal-album-input")?.closest("div").parentNode;
            if (!modal) return;
            modal.querySelector(".modal-album-input").value = scrobbleInfo.album || "";
            modal.querySelector(".modal-albumartist-input").value = scrobbleInfo.albumArtist || "";
        });
    }

    function escapeHtml(text) {
        var div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML.replace(/"/g, "&quot;");
    }

    function fetchScrobbleInfo(artist, track, timestamp, callback) {
        var from = Number(timestamp) - 1;
        var to = Number(timestamp) + 1;
        var data = "api_key=" + api_key + "&sk=" + sessionKey + "&method=user.getRecentTracks" + "&user=" + encodeURIComponent(username) + "&from=" + from + "&to=" + to + "&limit=5";
        data = data + "&api_sig=" + lfmmd5(data) + "&format=json";
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://ws.audioscrobbler.com/2.0/?" + data + "&format=json",
            onload: function(response) {
                var result = { album: "", albumArtist: "" };
                try {
                    var json = JSON.parse(response.responseText);
                    var tracks = json?.recenttracks?.track || [];
                    if (!Array.isArray(tracks)) {
                        tracks = [tracks];
                    }
                    var match = tracks.find(t => t.name?.toLowerCase() === track.toLowerCase() &&
                                            t.artist?.["#text"]?.toLowerCase() === artist.toLowerCase() &&
                                            String(t.date?.uts) === String(timestamp));
                    if (match) {
                        result.album = match.album?.["#text"] || "";
                        result.albumArtist = match.artist?.["#text"] || "";
                    }
                } catch (e) {
                    console.error("Error parsing recent tracks: " + e);
                }

                callback(result);
            },
            onerror: function(response) {
                console.error("Error fetching recent tracks: " + response.responseText);
                callback({ album: "", albumArtist: "" });
            }
        });
    }

    function showEditModal(trackinfo, track, artist, album, albumArtist, timestamp) {
        var overlay = document.createElement("div");
        overlay.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000000;display:flex;align-items:center;justify-content:center;";

        var modal = document.createElement("div");
        modal.className = "modal-body";
        modal.style = "border-radius:8px;width:500px;max-width:90%;position:relative;";

        function inputField(label, value, cls) {
            return `<div style="margin-bottom:16px;">
            <h4>${label}</h4>
            <input type="text" class="${cls}" value="${escapeHtml(value)}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
        </div>`;
        }

        modal.innerHTML = `
        <div style="text-align:center;margin-bottom:20px;position:relative;">
            <h2 style="margin:0;">Edit Scrobble</h2>
            <button class="modal-close" style="position:absolute;top:-4px;right:-4px;font-size:24px;cursor:pointer;color:#999;width:24px;height:24px;">&times;</button>
        </div>
        ${inputField("Track", track, "modal-track-input")}
        ${inputField("Artist", artist, "modal-artist-input")}
        ${inputField("Album", album, "modal-album-input")}
        ${inputField("Album Artist", albumArtist, "modal-albumartist-input")}
        <div style="margin-bottom:24px;">
            <h4>Timestamp</h4>
            <div style="padding:8px;background:#f5f5f5;border-radius:4px;color:#666;">${formatTimestamp(timestamp)}</div>
        </div>
        <div style="text-align:center;">
            <button class="modal-cancel-btn btn-secondary" style="margin-right:12px;">Cancel</button>
            <button class="modal-save-btn btn-primary">Save edit</button>
        </div>
    `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        modal.querySelector(".modal-track-input").focus();

        var modalClosed = false;
        function closeModal() {
            if (modalClosed) return;
            modalClosed = true;
            document.removeEventListener("keydown", handleKeydown);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }

        function handleKeydown(e) {
            if (modalClosed) return;
            if (e.key === "Escape") closeModal();
            else if (e.key === "Enter" && e.target.tagName.toUpperCase() === "INPUT") modal.querySelector(".modal-save-btn").click();
        }

        modal.querySelector(".modal-close").addEventListener("click", closeModal);
        modal.querySelector(".modal-cancel-btn").addEventListener("click", closeModal);
        modal.querySelector(".modal-save-btn").addEventListener("click", function() {
            scrobbleSong(
                trackinfo,
                modal.querySelector(".modal-track-input").value,
                modal.querySelector(".modal-artist-input").value,
                modal.querySelector(".modal-album-input").value,
                modal.querySelector(".modal-albumartist-input").value,
                timestamp, track, artist, album, albumArtist
            );
            closeModal();
        });

        document.addEventListener("keydown", handleKeydown);
        overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    }

    function formatTimestamp(timestamp) {
        if (!timestamp) return "";
        return new Date(timestamp * 1000).toLocaleString([], { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function scrobbleSong(trackinfo, track, artist, album, albumArtist, timestamp, oldTrack, oldArtist, oldAlbum, oldAlbumArtist){
        var mainItemsSame = artist.toLowerCase() == oldArtist.toLowerCase() && track.toLowerCase() == oldTrack.toLowerCase();
        if (mainItemsSame && album.toLowerCase() == (oldAlbum || "").toLowerCase() && albumArtist.toLowerCase() == (oldAlbumArtist || "").toLowerCase())
            return;

        var encodedArtist = encodeURIComponent(artist);
        var encodedTrack = encodeURIComponent(track);
        var encodedAlbum = encodeURIComponent(album);
        var encodedAlbumArtist = encodeURIComponent(albumArtist);

        var data = "api_key=" + api_key + "&sk=" + sessionKey + "&method=track.scrobble&artist=" + encodedArtist + "&track=" + encodedTrack + "&timestamp=" + timestamp;

        if (album)
            data += "&album=" + encodedAlbum;
        if (albumArtist)
            data += "&albumartist=" + encodedAlbumArtist;

        if (mainItemsSame)
            trackinfo.querySelector(".more-item--delete").click();
        setTimeout(()=>{
            GM.xmlHttpRequest({
                method: "POST",
                url: "https://ws.audioscrobbler.com/2.0/",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                data: data + "&api_sig=" + lfmmd5(data),
                onload: function(response) {
                    if (response.responseText.length > 0 && response.responseText.includes('<lfm status="ok">')) {
                        if (!mainItemsSame)
                            trackinfo.querySelector(".more-item--delete").click();
                        setTimeout(function() {location.reload()}, 300);
                    }
                    else if (response.responseText.includes('<error code="9">'))
                    {
                        localStorage.removeItem("sessionKey");
                        authenticate();
                    }
                    else
                    {
                        console.error("Error from Last.fm: " + response.responseText);
                    }
                },
                onerror: function(response) {
                    console.error("Error in fetching contents: " + response.responseText);
                }
            });
        }, mainItemsSame ? 500 : 0);
    }

    function lfmmd5(f){for(var k=[],i=0;64>i;)k[i]=0|4294967296*Math.sin(++i%Math.PI);var c,d,e,h=[c=1732584193,d=4023233417,~c,~d],g=[],b=decodeURIComponent(unescape(f=f.split("&").sort().join("").replace(/=/g,"")+atob("ZmY4MmMzNTkzZWI3Zjg5OGMzMjhjZmIwN2JiNjk2ZWM=")))+"\u0080",a=b.length;f=--a/4+2|15;for(g[--f]=8*a;~a;)g[a>>2]|=b.charCodeAt(a)<<8*a--;for(i=b=0;i<f;i+=16){for(a=h;64>b;a=[e=a[3],c+((e=a[0]+[c&d|~c&e,e&c|~e&d,c^d^e,d^(c|~e)][a=b>>4]+k[b]+~~g[i|[b,5*b+1,3*b+5,7*b][a]&15])<<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+b++%4])|e>>>-a),c,d])c=a[1]|0,d=a[2];for(b=4;b;)h[--b]+=a[b]}for(f="";32>b;)f+=(h[b>>3]>>4*(1^b++)&15).toString(16);return f;};
})();