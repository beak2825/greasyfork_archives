// ==UserScript==
// @name         Add calibrate button autodarts
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds calibrate button!
// @author       Sennevds
// @license      MIT
// @match        *//:autodarts.io/lobbies/*
// @match        *autodarts.io/lobbies/*
// @match        *autodarts.io/*
// @match        *play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM.xmlHttpRequest

// @downloadURL https://update.greasyfork.org/scripts/488518/Add%20calibrate%20button%20autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/488518/Add%20calibrate%20button%20autodarts.meta.js
// ==/UserScript==



const ICON = true;
const URL = '10.5.65.156:3180'

const svg = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="#DAE9FF" d="M862.3 498.6h-57.8C794 359.8 682.9 248.8 544.2 238.3v-57.8h-42.9v57.8C362.5 248.8 251.5 359.8 241 498.6h-57.8v42.9H241c10.5 138.8 121.5 249.8 260.3 260.3v57.8h42.9v-57.8C682.9 791.3 794 680.2 804.4 541.5h57.8v-42.9zm-100.8 0h-65.3c-9.7-79.4-72.6-142.3-152-152v-65.3c115.1 10.2 207 102.2 217.3 217.3zM501.3 281.3v65.3c-79.4 9.7-142.3 72.6-152 152H284c10.2-115.1 102.2-207.1 217.3-217.3zM284 541.5h65.3c9.7 79.4 72.6 142.3 152 152v65.3C386.2 748.5 294.2 656.6 284 541.5zm260.2 217.3v-65.3c79.4-9.7 142.3-72.6 152-152h65.3c-10.3 115.1-102.2 207-217.3 217.3z"/><path fill="#3889FF" d="M840.8 482.5H783c-10.5-138.8-121.5-249.8-260.3-260.3v-57.8h-42.9v57.8C341.1 232.7 230 343.8 219.6 482.5h-57.8v42.9h57.8C230 664.2 341.1 775.2 479.8 785.7v57.8h42.9v-57.8C661.5 775.2 772.5 664.2 783 525.4h57.8v-42.9zm-100.8 0h-65.3c-9.7-79.4-72.6-142.3-152-152v-65.3C637.8 275.5 729.8 367.4 740 482.5zM479.8 265.2v65.3c-79.4 9.7-142.3 72.6-152 152h-65.3c10.3-115.1 102.2-207 217.3-217.3zM262.5 525.4h65.3c9.7 79.4 72.6 142.3 152 152v65.3c-115.1-10.3-207-102.2-217.3-217.3zm260.2 217.3v-65.3c79.4-9.7 142.3-72.6 152-152H740c-10.2 115.1-102.2 207-217.3 217.3z"/><path fill="#DAE9FF" d="M594.7 488H549c-2.2 0-4.3.5-6.3 1.3.8-1.9 1.3-4 1.3-6.3v-45.7c0-8.6-7-15.6-15.6-15.6H517c-8.6 0-15.6 7-15.6 15.6V483c0 2.2.5 4.3 1.3 6.3-1.9-.8-4-1.3-6.3-1.3h-45.7c-8.6 0-15.6 7-15.6 15.6V515c0 8.6 7 15.6 15.6 15.6h45.7c2.2 0 4.3-.5 6.3-1.3-.8 1.9-1.3 4-1.3 6.3v45.7c0 8.6 7 15.6 15.6 15.6h11.4c8.6 0 15.6-7 15.6-15.6v-45.7c0-2.2-.5-4.3-1.3-6.3 1.9.8 4 1.3 6.3 1.3h45.7c8.6 0 15.7-7 15.7-15.6v-11.4c0-8.6-7-15.6-15.7-15.6zm-66.3 32H517c-2.2 0-4.3.5-6.3 1.3.8-1.9 1.3-4 1.3-6.3v-11.4c0-2.2-.5-4.3-1.3-6.3 1.9.8 4 1.3 6.3 1.3h11.4c2.2 0 4.3-.5 6.3-1.3-.8 1.9-1.3 4-1.3 6.3V515c0 2.2.5 4.3 1.3 6.3-1.9-.9-4-1.3-6.3-1.3z"/><path fill="#FFF" d="M573.3 482.6h-45.7c-2.2 0-4.3.5-6.3 1.3.8-1.9 1.3-4 1.3-6.3v-45.7c0-8.6-7-15.6-15.6-15.6h-11.4c-8.6 0-15.6 7-15.6 15.6v45.7c0 2.2.5 4.3 1.3 6.3-1.9-.8-4-1.3-6.3-1.3h-45.7c-8.6 0-15.6 7-15.6 15.6v11.4c0 8.6 7 15.6 15.6 15.6H475c2.2 0 4.3-.5 6.3-1.3-.8 1.9-1.3 4-1.3 6.3V576c0 8.6 7 15.6 15.6 15.6H507c8.6 0 15.6-7 15.6-15.6v-45.7c0-2.2-.5-4.3-1.3-6.3 1.9.8 4 1.3 6.3 1.3h45.7c8.6 0 15.7-7 15.7-15.6v-11.4c0-8.7-7.1-15.7-15.7-15.7zm-66.3 32h-11.4c-2.2 0-4.3.5-6.3 1.3.8-1.9 1.3-4 1.3-6.3v-11.4c0-2.2-.5-4.3-1.3-6.3 1.9.8 4 1.3 6.3 1.3H507c2.2 0 4.3-.5 6.3-1.3-.8 1.9-1.3 4-1.3 6.3v11.4c0 2.2.5 4.3 1.3 6.3-2-.8-4.1-1.3-6.3-1.3z"/></svg>'

function sending_xml(endpoints) {
    console.log("SENDING DATA");
    function createCal(counter) {
        if (counter < endpoints.length) {
            let endpoint = endpoints[counter];
            GM.xmlHttpRequest({
                method: endpoint['type'],
                url: `http://${URL}/api/${endpoint['endpoint']}`,
                synchronous: true,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    createCal(counter+1);
                }
            });
        }
        else{
            alert("Calibrated!");
        }
    }
    createCal(0)
}

(function () {
    "use strict";

    const documentObserver = new MutationObserver((mutationRecords) => {
        if (mutationRecords[0]?.target.classList.contains("css-tkevr6")) {
            let buttonRow = $(".css-1uodvt1")
            let firstButton = buttonRow.children('button').first();
            let classNames = firstButton.attr('class')
            let content = ICON ? svg : "Calibrate";
            buttonRow.prepend(`<button id="calibrate" type="button" class="${classNames}">${content}</button>`)
            $("#calibrate").on("click", function () {
                sending_xml([{ "type": "PUT", "endpoint": "start" }, { "type": "POST", "endpoint": "config/calibration/auto" }, { "type": "PUT", "endpoint": "config/calibration" }]);
            })
        }
    });

    documentObserver.observe(document, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["class"],
    });
})();