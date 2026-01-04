// ==UserScript==
// @name         MouseHunt Hyperspeed Travel
// @description  Because regular travel isn't nearly fast enough
// @author       LethalVision
// @version      1.1
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/448542/MouseHunt%20Hyperspeed%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/448542/MouseHunt%20Hyperspeed%20Travel.meta.js
// ==/UserScript==

(function () {
    const PREF_TAG = 'fast-travel-cache'
    const TRAVEL_TAG = 'fast-travel-list'
    const LINK_TAG = 'fast-travel-link'

    var currentLoc = {};
    currentLoc.envName = user.environment_name;
    currentLoc.envType = user.environment_type;

    var recall = {};
    var locationList = {};

    // == local storage ==
    function loadPref() {
        var prefJson = window.localStorage.getItem(PREF_TAG);
        if (prefJson){
            try{
                //console.log('Loaded preference: ' + prefJson);
                var loadedPref = JSON.parse(prefJson);
                locationList = loadedPref.locationList || {};
                recall = loadedPref.recall || {};
            } catch (err) {
                console.log('Preference parse error: ' + err);
            }
        }
    }

    function savePref() {
        const preferences = {};
        preferences.locationList = locationList;
        preferences.recall = recall;
        var jsonString = JSON.stringify(preferences);
        window.localStorage.setItem(PREF_TAG, jsonString);
        //console.log('Saved preference: ' + jsonString);
    }

    function initAjaxHooks() {
        const pageUrl = 'managers/ajax/pages/page.php';
        const travelUrl = 'managers/ajax/users/changeenvironment.php';

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                if ( this.responseURL.indexOf(pageUrl) != -1) {
                    updateTravelLinks();
                } else if (this.responseURL.indexOf(travelUrl) != -1) {
                    updateRecall();
                }
            });
            originalOpen.apply(this, arguments);
        };
        // in case the window is refreshed in travel.php
        if (window.location.href.includes("travel.php")) {
            updateTravelLinks();
        }
    }

    function updateTravelTab() {
        const travelTab = document.querySelector('.travel');
        if (!travelTab) {
            return;
        }
        // remove stale listbody before start
        document.querySelectorAll(`.${TRAVEL_TAG}`).forEach(item => item.remove());
        // create new listbody
        const listBody = document.createElement("ul");
        listBody.classList.add(TRAVEL_TAG);
        travelTab.appendChild(listBody);
        // add recall
        if (!recall.envName || !recall.envType) { // set recall to current loc if empty
            recall.envName = currentLoc.envName;
            recall.envType = currentLoc.envType;
            savePref();
        }
        const recallItem = document.createElement("li");
        recallItem.innerHTML = getListHtml(`<b>Recall</b> - ${recall.envName}`);
        recallItem.onclick = function(){
            app.pages.TravelPage.travel(recall.envType);
        };
        listBody.appendChild(recallItem);
        // add clear prefs
        const clearItem = document.createElement("li");
        clearItem.innerHTML = getListHtml('<div style="color: red;"><b>Clear Saved Locations</b></div>');
        clearItem.onclick = function(){
            locationList = {};
            saveAndRefresh();
        };
        listBody.appendChild(clearItem);
        // add the rest
        for (var key in locationList) {
            const listItem = document.createElement("li");
            listItem.innerHTML = getListHtml(locationList[key]);
            const envType = key;
            listItem.onclick = function(){
                app.pages.TravelPage.travel(envType);
            };
            listBody.appendChild(listItem);
        }
    }

    function getListHtml(textElemStr) {
        return `<a href="#" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"><div class="icon"></div>${textElemStr}</a>`;
    }

    function updateTravelLinks() {
        // remove stale links before start
        document.querySelectorAll(`.${LINK_TAG}`).forEach(item => item.remove());
        // update links
        const detailList = document.querySelectorAll('.travelPage-map-environment-detail');
        detailList.forEach(item => {
            const descElem = item.querySelector('.travelPage-map-environment-detail-shops');
            if (!descElem) return;
            const envType = item.getAttribute('data-environment-type');
            if (!envType) return;
            const travelLink = document.createElement("p");
            travelLink.classList.add(LINK_TAG);
            var linkElem = document.createElement("a");
            if (locationList[envType]) {
                // location already registered
                linkElem.innerText = 'Remove from Fast Travel';
                linkElem.style.color = 'red';
                linkElem.onclick = function() {removeLocation(envType);};
            } else {
                const envTitle = item.querySelector('.travelPage-map-environment-detail-title');
                if (!envTitle) return;
                // extract location name from title
                const envName = envTitle.innerText.replace(/\([^\)]+\)/g, '').trim();
                linkElem.innerText = 'Add to Fast Travel';
                linkElem.onclick = function() {addLocation(envType, envName);};
            }
            travelLink.appendChild(linkElem);
            descElem.appendChild(travelLink);
        });
    }

    function removeLocation(envType) {
        //console.log('removeLocation');
        delete locationList[envType];
        saveAndRefresh();
    }

    function addLocation(envType, envName) {
        //console.log('addLocation: ' + envName);
        locationList[envType] = envName;
        saveAndRefresh();
    }

    function updateRecall() {
        // save previous location
        recall.envName = currentLoc.envName;
        recall.envType = currentLoc.envType;
        // refresh current location
        currentLoc.envName = user.environment_name;
        currentLoc.envType = user.environment_type;
        saveAndRefresh();
    }

    function saveAndRefresh() {
        savePref();
        updateTravelTab();
        updateTravelLinks();
    }

    // init
    loadPref();
    initAjaxHooks();
    updateTravelTab();
})();