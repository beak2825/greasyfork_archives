// ==UserScript==
// @name         Shein Size Filter
// @namespace    http://tampermonkey.net/
// @version      2025-04-23
// @description  Displays shirt length on tab title
// @author       Hammad Arif
// @match        *://au.shein.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537757/Shein%20Size%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/537757/Shein%20Size%20Filter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log("Tampermonkey script loaded");

    var sleepDurationMs=5000;
    var idealLengthMax=70;
    var sizeAttribute="M";

    let hasRun = false;

    function safeRunScript() {
        if (!hasRun) {
            hasRun = true;
            runScript();
        }
    }

      // Helper sleep function that returns a Promise
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getLengthValueWithRetries(sizeDiv, maxRetries = 3, sleepDurationMs = 2000) {

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`Attempt ${attempt}: finding gbRawData`);
            if (gbRawData != null) {
                var lengthItem= gbRawData?.modules?.saleAttr?.sizeInfo?.sizeInfo?.find(s=>s?.attr_value_name==sizeAttribute)["Length "]
                if (lengthItem!=null)
                    break;
            }
            await sleep(sleepDurationMs);
        }

        if (lengthItem) {
            const value = parseFloat(lengthItem);
            console.log(`✅ Found Length: ${value}`);
            return value;
        }

        console.error("🚫 Failed to find Length item after all attempts.");
        return null;
    }

    async function runScript() {

        console.log("runScript executing on load");

        const lengthValue = await getLengthValueWithRetries();

        if (lengthValue!=null)
        {
            const originalTitle = document.title;

            if (lengthValue <=idealLengthMax) {
                document.title = `💖️ Length ${lengthValue} | ${originalTitle}`;}
            else {
                document.title = `Length ${lengthValue} | ${originalTitle}`;}
        }
        else
        {
            console.warn("Length value not found!");
        }

    }

    // Run when page fully loads
    window.addEventListener('load', safeRunScript);

    // Or run after 10 seconds anyway
    setTimeout(safeRunScript, 10000);

})();

