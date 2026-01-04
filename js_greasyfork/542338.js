// ==UserScript==
// @name         WME Open Street View in New Window
// @namespace    https://github.com/WazeDev/wme-open-sv-in-new-window
// @version      0.0.1
// @description  Opens Street View in a new window.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542338/WME%20Open%20Street%20View%20in%20New%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/542338/WME%20Open%20Street%20View%20in%20New%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let wmeSdk;
    window.SDK_INITIALIZED.then(initialize)

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function initialize() {
        wmeSdk = await getWmeSdk({
            scriptId: 'wme-open-sv-in-new-window',
            scriptName: 'WME Open Street View in New Window'
        })

        let svImg = document.createElement("img");
        svImg.src = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Google_Street_View_icon.svg";
        svImg.style = "margin-right: 10px;margin-left: 10px;width: 22px;";
        svImg.title = "Open Street View"
        svImg.addEventListener("click", openGoogleStreetView);

        waitForElm('.secondary-toolbar-actions').then((elm) => {
            let toolbar = document.getElementsByClassName("secondary-toolbar-actions")[0];
            toolbar.insertBefore(svImg, toolbar.children[0]);
        });
    }
    async function openGoogleStreetView() {
        let point;
        let link;
        try {
            point = await wmeSdk.Map.drawPoint({
                snapTo: "segment"
            });
            link = `http://maps.google.com/maps?q=&layer=c&cbll=${point.coordinates[1]},${point.coordinates[0]}`
            window.open(link, '_blank', 'height=540,width=960,popup');
        } catch {
            console.log("wme-open-sv-in-new-window: User canceled draw");
        }
    }

})();
