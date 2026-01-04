// ==UserScript==
// @name         TheTVDB All Seasons - Mark as Watched
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Mark episodes as watched/unwatched on All Seasons pages on TheTVDB.com
// @author       xdpirate
// @license      GPLv3
// @match        https://thetvdb.com/series/*/allseasons/*
// @match        https://www.thetvdb.com/series/*/allseasons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thetvdb.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490224/TheTVDB%20All%20Seasons%20-%20Mark%20as%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/490224/TheTVDB%20All%20Seasons%20-%20Mark%20as%20Watched.meta.js
// ==/UserScript==

function colorEpisodes() {
    for(let i = 0; i < episodeListItems.length; i++) {
        let id = episodeListItems[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];

        if(seriesArr.includes(id)) {
            episodeListItems[i].style.backgroundColor = "darkgreen";
        } else {
            episodeListItems[i].style.backgroundColor = "maroon";
        }
    }
}

function isEntireShowWatched() {
    for(let i = 0; i < episodeListItems.length; i++) {
        let id = episodeListItems[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];

        if(!seriesArr.includes(id)) {
            return false;
        }
    }

    return true;
}

function isEntireSeasonWatched(seasonHeader) {
    let seasonEps = seasonHeader.nextElementSibling.querySelectorAll("li.list-group-item");
    for(let i = 0; i < seasonEps.length; i++) {
        let id = seasonEps[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];

        if(!seriesArr.includes(id)) {
            return false;
        }
    }

    return true;
}

function populateCheckboxes() {
    for(let i = 0; i < episodeListItems.length; i++) {
        let checkbox = document.createElement("span");
        checkbox.classList.add("aomaw-episode-checkbox");
        checkbox.style.cursor = "pointer";
        checkbox.title = "Click to mark this episode as watched";
        checkbox.innerText = "👀";
        checkbox.style.marginRight = "0.5em";
        checkbox.episodeID = episodeListItems[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];

        if(seriesArr.includes(checkbox.episodeID)) {
            checkbox.innerText = "✅";
            checkbox.title = "Click to mark this episode as unwatched";
        }

        checkbox.addEventListener("click", function() {
            if(seriesArr.includes(this.episodeID)) {
                seriesArr.splice(seriesArr.indexOf(this.episodeID), 1);
                this.closest("li").style.backgroundColor = "maroon";
                this.innerText = "👀";
                this.title = "Click to mark this episode as watched";
            } else {
                seriesArr.push(this.episodeID);
                this.closest("li").style.backgroundColor = "darkgreen";
                checkbox.innerText = "✅";
                this.title = "Click to mark this episode as unwatched";
            }

            let completeCheckbox = document.querySelector("span#aomaw-show-checkbox");
            if(isEntireShowWatched()) {
                completeCheckbox.innerText = "✅";
                completeCheckbox.title = "Click to mark every episode in this show as unwatched";
            } else {
                completeCheckbox.innerText = "👀";
                completeCheckbox.title = "Click to mark every episode in this show as watched";
            }

            let seasonCheckbox = this.closest("ul.list-group").previousElementSibling.querySelector("span.aomaw-season-checkbox");
            if(isEntireSeasonWatched(this.closest("ul.list-group").previousElementSibling)) {
                seasonCheckbox.innerText = "✅";
                seasonCheckbox.title = "Click to mark this season as unwatched";
            } else {
                seasonCheckbox.innerText = "👀";
                seasonCheckbox.title = "Click to mark this season as watched";
            }

            GM_setValue(seriesID, seriesArr);
        });

        let headerElement = episodeListItems[i].querySelector("h4.list-group-item-heading");
        headerElement.insertAdjacentElement("afterbegin", checkbox);
    }
}

function populateBatchElements() {
    let showHeader = document.querySelector("div.page-toolbar > h1");
    let completeCheckbox = document.createElement("span");
    completeCheckbox.id = "aomaw-show-checkbox";
    completeCheckbox.style.cursor = "pointer";
    completeCheckbox.style.marginRight = "0.4em";

    if(isEntireShowWatched()) {
        completeCheckbox.innerText = "✅";
        completeCheckbox.title = "Click to mark every episode in this show as unwatched";
    } else {
        completeCheckbox.innerText = "👀";
        completeCheckbox.title = "Click to mark every episode in this show as watched";
    }

    completeCheckbox.addEventListener("click", function() {
        if(isEntireShowWatched()) {
            seriesArr = [];

            let episodeCheckboxes = document.querySelectorAll("span.aomaw-episode-checkbox");
            for(let i = 0; i < episodeCheckboxes.length; i++) {
                episodeCheckboxes[i].innerText = "👀";
                episodeCheckboxes[i].title = "Click to mark this episode as watched";
                episodeCheckboxes[i].closest("li").style.backgroundColor = "maroon";
            }

            let seasonCheckboxes = document.querySelectorAll("span.aomaw-season-checkbox");
            for(let i = 0; i < seasonCheckboxes.length; i++) {
                seasonCheckboxes[i].innerText = "👀";
                seasonCheckboxes[i].title = "Click to mark this season as watched";
            }

            this.innerText = "👀";
            this.title = "Click to mark every episode in this show as watched";
        } else {
            let episodeCheckboxes = document.querySelectorAll("span.aomaw-episode-checkbox");
            for(let i = 0; i < episodeCheckboxes.length; i++) {
                if(!seriesArr.includes(episodeCheckboxes[i].episodeID)) {
                   seriesArr.push(episodeCheckboxes[i].episodeID);
                }

                episodeCheckboxes[i].innerText = "✅";
                episodeCheckboxes[i].closest("li").style.backgroundColor = "darkgreen";
            }

            let seasonCheckboxes = document.querySelectorAll("span.aomaw-season-checkbox");
            for(let i = 0; i < seasonCheckboxes.length; i++) {
                seasonCheckboxes[i].innerText = "✅";
                seasonCheckboxes[i].title = "Click to mark this season as unwatched";
            }

            this.innerText = "✅";
            this.title = "Click to mark every episode in this show as unwatched";
        }

        GM_setValue(seriesID, seriesArr);
    });

    showHeader.insertAdjacentElement("afterbegin", completeCheckbox);


    let seasonHeaders = document.querySelectorAll("h3.mt-4");
    for(let i = 0; i < seasonHeaders.length; i++) {
        let seasonCheckbox = document.createElement("span");
        seasonCheckbox.classList.add("aomaw-season-checkbox");
        seasonCheckbox.style.cursor = "pointer";
        seasonCheckbox.style.marginRight = "0.4em";

        if(isEntireSeasonWatched(seasonHeaders[i])) {
            seasonCheckbox.innerText = "✅";
            seasonCheckbox.title = "Click to mark this season as unwatched";
        } else {
            seasonCheckbox.innerText = "👀";
            seasonCheckbox.title = "Click to mark this season as watched";
        }

        seasonCheckbox.addEventListener("click", function() {
            let seasonEps = this.closest("h3.mt-4").nextElementSibling.querySelectorAll("li.list-group-item");

            if(isEntireSeasonWatched(this.closest("h3.mt-4"))) {
                for(let i = 0; i < seasonEps.length; i++) {
                    let id = seasonEps[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];
                    if(seriesArr.includes(id)) {
                        seriesArr.splice(seriesArr.indexOf(id), 1);
                    }
                }

                let episodeCheckboxes = this.closest("h3.mt-4").nextElementSibling.querySelectorAll("span.aomaw-episode-checkbox");
                for(let i = 0; i < episodeCheckboxes.length; i++) {
                    episodeCheckboxes[i].innerText = "👀";
                    episodeCheckboxes[i].title = "Click to mark this episode as watched";
                    episodeCheckboxes[i].closest("li").style.backgroundColor = "maroon";
                }

                this.innerText = "👀";
                this.title = "Click to mark this season as watched";
            } else {
                for(let i = 0; i < seasonEps.length; i++) {
                    let id = seasonEps[i].querySelector("a").href.match(/\/([0-9]+)$/)[1];
                    if(!seriesArr.includes(id)) {
                        seriesArr.push(id);
                    }
                }

                let episodeCheckboxes = this.closest("h3.mt-4").nextElementSibling.querySelectorAll("span.aomaw-episode-checkbox");
                for(let i = 0; i < episodeCheckboxes.length; i++) {
                    episodeCheckboxes[i].innerText = "✅";
                    episodeCheckboxes[i].title = "Click to mark this episode as unwatched";
                    episodeCheckboxes[i].closest("li").style.backgroundColor = "darkgreen";
                }

                this.innerText = "✅";
                this.title = "Click to mark this season as unwatched";
            }

            let completeCheckbox = document.querySelector("span#aomaw-show-checkbox");
            if(isEntireShowWatched()) {
                completeCheckbox.innerText = "✅";
                completeCheckbox.title = "Click to mark every episode in this show as unwatched";
            } else {
                completeCheckbox.innerText = "👀";
                completeCheckbox.title = "Click to mark every episode in this show as watched";
            }

            GM_setValue(seriesID, seriesArr);
        });

        seasonHeaders[i].insertAdjacentElement("afterbegin", seasonCheckbox);
    }
}

let seriesID = location.href.match(/^https:\/\/(?:www\.)?thetvdb\.com\/series\/(.+)\/allseasons\/(.+)/)[1];
let seriesArr = GM_getValue(seriesID, []);
let episodeListItems = document.querySelectorAll("li.list-group-item");

populateBatchElements();
populateCheckboxes();
colorEpisodes();
