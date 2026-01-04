// ==UserScript==
// @name         Trakt.tv zero
// @namespace    https://greasyfork.org/users/21515
// @version      0.2.0
// @description  Doing some things
// @author       CennoxX
// @homepage     https://twitter.com/CennoxX
// @match        https://trakt.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trakt.tv
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519905/Trakttv%20zero.user.js
// @updateURL https://update.greasyfork.org/scripts/519905/Trakttv%20zero.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function() {
    "use strict";
    document.body.classList.replace("theme-purple","theme-red");
    GM_addStyle(`.dark-knight .releasesDatesList { background-color: #333; }`);
    if (location.href == "https://trakt.tv/settings"){
        localStorage.setItem("streamServices",[...document.querySelectorAll(".streaming-links a div")].flatMap(i => [...i.classList].filter(i => i.startsWith("btn-"))[0]?.replace("btn-","")).filter(i => i));
    }
    if (location.href.includes("/lists/") || location.href.includes("/watchlist") || location.href.includes("/favorites")){
        var streamServices = localStorage.getItem("streamServices")?.split(",");
        if (!streamServices){
            alert("Opening settings to save favorite streaming services.");
            window. open("https://trakt.tv/settings");
        }
        setTimeout(()=>{
            var streamingFilterNode = document.querySelector("#filter-watchnow-launcher");
            if (streamingFilterNode){
                var streamingFilter = streamingFilterNode.cloneNode(true);
                streamingFilter.classList = ["dropdown filter-dropdown"];
                streamingFilter.id = "filter-stream-launcher";
                streamingFilter.onclick = ()=>{document.querySelector("#filter-stream-launcher").classList.toggle("open")};
                var streamingServices = [...new Set([...document.querySelectorAll(".watch-now.selected")].flatMap(i => JSON.parse(i.dataset.sourceSlugs.replaceAll("'",'"'))[unsafeWindow.watchnowCountry]).sort(i => i).filter(i => i))];
                streamingServices = streamingServices.filter(i => streamServices.includes(i.replaceAll("_","-")));
                var list = `<button class="dropdown-toggle"><span class="icon fa-play fa-thin"> <span class="caret"/></span></button><ul class="dropdown-menu" role="menu">
	<li class="aller"><a class="filter-show-all">Show All</a></li>`;
                list += `<li class="divider hider" role="presentation"></li>
	<li class="dropdown-header hider" role="presentation">HIDE</li>`;
                list += streamingServices.map(i => `<li class="hider"><a class="hide-list-${i}" data-original-title="" title=""><span class="check trakt-icon-check-thick"></span>Not ${unsafeWindow.watchnowAllSources[unsafeWindow.watchnowCountry][i].replace(" (free)","")}</a></li>`).join("");
                list += `<li class="divider fader" role="presentation"></li>
	<li class="dropdown-header fader" role="presentation">FADE</li>`;
                list += streamingServices.map(i => `<li class="fader"><a class="fade-list-${i}" data-original-title="" title=""><span class="check trakt-icon-check-thick"></span>Not ${unsafeWindow.watchnowAllSources[unsafeWindow.watchnowCountry][i].replace(" (free)","")}</a></li>`).join("");

                list += `</ul>`;
                streamingFilter.innerHTML = list;
                streamingFilterNode.parentNode.replaceChild(streamingFilter, streamingFilterNode);
                var fadeFilter = document.querySelector("#filter-fade-hide");
                document.addEventListener("click", function(i) {
                    if (fadeFilter && !fadeFilter.contains(i.target)) {
                        fadeFilter.classList.remove("open");
                    }
                    if (streamingFilter && !streamingFilter.contains(i.target)) {
                        streamingFilter.classList.remove("open");
                    }
                });
                document.querySelectorAll("#filter-stream-launcher li").forEach(i => {
                    i.addEventListener("click", (entry) => {
                        [...document.querySelectorAll("#filter-stream-launcher li a")].forEach(a => a.classList.remove("selected"));
                        i.querySelector("a").classList.add("selected");
                        streamingFilter.classList.remove("selected");
                        var [mode, service] = entry.target.classList[0].split("-list-");
                        [...document.querySelectorAll(".grid-item")].forEach(i => {
                            i.style.display = "initial";
                            i.classList.remove("fade-watched-on");
                        });
                        if (mode == "hide"){
                            streamingFilter.classList.add("selected");
                            [...document.querySelectorAll(".grid-item")].forEach(i => {
                                i.style.display = i.querySelector(".watch-now") && JSON.parse(i.querySelector(".watch-now").dataset.sourceSlugs.replaceAll("'",'"'))[unsafeWindow.watchnowCountry]?.includes(service) ? "initial" : "none";
                            });
                        }
                        if (mode == "fade"){
                            streamingFilter.classList.add("selected");
                            [...document.querySelectorAll(".grid-item")].forEach(i => {
                                if (!i.querySelector(".watch-now") || !JSON.parse(i.querySelector(".watch-now").dataset.sourceSlugs.replaceAll("'",'"'))[unsafeWindow.watchnowCountry]?.includes(service))
                                {
                                    i.classList.add("fade-watched-on");
                                }else{
                                    i.classList.remove("fade-watched-on");
                                }
                            });
                        }
                    });});
            }
        },2000);
    }
})();