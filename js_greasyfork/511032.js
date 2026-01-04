// ==UserScript==
// @name         Panopto Transcript
// @namespace    http://tampermonkey.net/
// @version      2024-10-01
// @description  Adds a button to copy a full video transcript from Panopto
// @author       ioc
// @match        https://*.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panopto.eu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511032/Panopto%20Transcript.user.js
// @updateURL https://update.greasyfork.org/scripts/511032/Panopto%20Transcript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement("button");
    btn.innerHTML = "Copy transcript";
    btn.onclick = function(event) {
        event.preventDefault();

        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        const textArr = [];
        const largeSet = document.getElementsByClassName("index-event");

        for (let i=0; i<largeSet.length; i++) {
            const e = largeSet[i];
            try {
                if (e.id.toLowerCase().includes("transcript")) {
                    textArr.push(e.children[1].children[1].children[0].innerText);
                }
            } catch (error) {}
        }

        let res = textArr.join(" ");
        res = res.replaceAll(". ", ".\n");

        const type = "text/plain";
        const blob = new Blob([res], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        window.navigator.clipboard.write(data);
    }
    document.getElementById("eventTabControl").appendChild(btn);
})();