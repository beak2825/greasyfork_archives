// ==UserScript==
// @name         WME Status
// @description  Show map build information
// @namespace    https://greasyfork.org/users/gad_m/wme_status
// @version      0.1.18
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @connect      storage.googleapis.com
// @grant        GM_xmlhttpRequest
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/36050/WME%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/36050/WME%20Status.meta.js
// ==/UserScript==

/* global jQuery */
/* global W */
/* global I18n */

/******************************************
 *******************************************
 Based on WME Map Tiles Update (by Sebiseba)
 *******************************************
 ******************************************/

(function() {

    let locationCode;
    let dateOptions = {year: '2-digit', month: '2-digit',day: '2-digit', hour:'numeric', minute:'2-digit'};
    const regionToURL = {'il':'il','usa':'na','row':'intl'};

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isReady']) {
        console.debug('wme-status: WME is ready.');
        init();
    } else {
        console.debug('wme-status: WME is not ready. adding event listener.');
        document.addEventListener("wme-ready", function () {
            console.info('wme-status: Got "wme-ready" event.');
            init();
        }, {
            once: true,
        });
    }

    function init() {
        console.debug("wme-status: init()");
        locationCode = W['app'].getAppRegionCode();
        console.info("wme-status: init() Location Code: '" + locationCode + "' url parameter: '" + regionToURL[locationCode] + "'");
        let url = 'https://storage.googleapis.com/waze-tile-build-public/current-build/' + regionToURL[locationCode] + '-status.json';
        console.debug('wme-status: init() Status URL: ' + url);
        GM_xmlhttpRequest({
            method: 'GET',
            synchronous: false,
            timeout: 5000,
            url: url,
            onerror: function (res) {
                console.error('wme-status: init() error reading status feed URL: ' + url + ' responseText: ' + res.responseText + ' statusText: ' + res.statusText);
            },
            ontimeout: function () {
                console.error('wme-status: init() timeout reading status feed URL: ' + url);
            },
            onload: function (res) {
                // per IL request - always display he format
                let localeBy = (W['app'].getAppRegionCode() === 'il')?'he':I18n.locale;
                console.debug("wme-status: init() localeBy: " + localeBy);
                let asJSON = JSON.parse(res.responseText);
                let previousBuild = asJSON['previous_build'];
                let mapReleaseAsDate = new Date(previousBuild['release_time']);
                console.info("wme-status: init() mapReleaseAsDate: " + mapReleaseAsDate);
                let lastEditStr = previousBuild['last_edit_time'];
                console.debug("wme-status: init() lastEditStr: '" + lastEditStr + "'");
                let lastEditTimeAsDate = new Date(lastEditStr);
                console.info("wme-status: init() lastEditTimeAsDate: '" + lastEditTimeAsDate + "'");
                let gapInMs = Date.now() - lastEditTimeAsDate.getTime();
                // add UI
                let topBar = jQuery('.topbar')[0];
                let lastEditDiv = document.createElement('div');
                lastEditDiv.id = "wme_last_edit";
                lastEditDiv.style.backgroundColor = "#3d3d3d";
                lastEditDiv.style.color = "white";
                let additionalText = ''; //  default: no text (less than 24 hours) - OK
                if (gapInMs > 1000*60*60*24*3) { // 3 days
                    console.info("wme-status: init() last edit time older than 3 days.");
                    lastEditDiv.style.backgroundColor = "#3d3d3d";
                    lastEditDiv.style.color = "red";
                    lastEditDiv.style.fontWeight = "bold";
                    additionalText = ' (older than 3 days)';
                } else if (gapInMs > 1000*60*60*(24+8)) { // 1 day + 8 hours between build start and status updated
                    console.info("wme-status: init() last edit time older than 1 day.");
                    lastEditDiv.style.backgroundColor = "#3d3d3d";
                    lastEditDiv.style.color = "yellow";
                    lastEditDiv.style.fontWeight = "bold";
                    additionalText = ' (1-3 days old)';
                }
                lastEditDiv.style.float = "left";
                lastEditDiv.style.paddingLeft = "10px";
                lastEditDiv.innerHTML = "Last Edit: " + lastEditTimeAsDate.toLocaleString(localeBy, dateOptions) + additionalText;
                topBar.appendChild(lastEditDiv);

                let releaseDiv = document.createElement('div');
                releaseDiv.id = "wme_status_release";
                releaseDiv.style.float = "left";
                releaseDiv.style.paddingLeft = "10px";
                releaseDiv.style.backgroundColor = "#3d3d3d";
                releaseDiv.style.color = "white";
                releaseDiv.innerHTML = "Map Release: " + mapReleaseAsDate.toLocaleString(localeBy, dateOptions);
                topBar.appendChild(releaseDiv);
                if (asJSON['current_build']) {
                    let inProgressMsg = "Build In Progress: " + asJSON['current_build']['progress_percent'] + "%";
                    console.info("wme-status: init() " + inProgressMsg);
                    let currentBuildingDiv = document.createElement('div');
                    currentBuildingDiv.id = "wme_current_building";
                    currentBuildingDiv.style.backgroundColor = "#3d3d3d";
                    currentBuildingDiv.style.color = "lightgreen";
                    currentBuildingDiv.style.fontWeight = "bold";
                    currentBuildingDiv.style.float = "left";
                    currentBuildingDiv.style.paddingLeft = "10px";
                    currentBuildingDiv.innerHTML = inProgressMsg;
                    topBar.appendChild(currentBuildingDiv);
                } else {
                    let nextBuild = asJSON['next_build'];
                    let nextBuildAsDate = new Date(nextBuild['estimated_start_time']);
                    let nextBuildWillStartInMinutes = Math.ceil((nextBuildAsDate.getTime() - Date.now())/1000/60);
                    console.info("wme-status: init() Next build in " + nextBuildWillStartInMinutes + " minutes");
                    if (nextBuildWillStartInMinutes < 60) {
                        let nextBuildDiv = document.createElement('div');
                        nextBuildDiv.id = "wme_next_build";
                        nextBuildDiv.style.backgroundColor = "#3d3d3d";
                        nextBuildDiv.style.color = (nextBuildWillStartInMinutes<10)?"red":"yellow";
                        nextBuildDiv.style.fontWeight = "bold";
                        nextBuildDiv.style.float = "left";
                        nextBuildDiv.style.paddingLeft = "10px";
                        nextBuildDiv.innerHTML = "Next build in: " + nextBuildWillStartInMinutes + " minutes";
                        topBar.appendChild(nextBuildDiv);
                    }
                }
            } // end onload
        }); // end http request
    } // end init()
}.call(this));
