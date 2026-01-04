// ==UserScript==
// @name         QOL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quality of Life
// @author       You
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/ob
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453396/QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/453396/QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vridlist = [];
    if (document.readyState != 'complete') {
        window.addEventListener('load', windowLoadedCallback);
    } else {
        windowLoadedCallback();
    }

    function windowLoadedCallback() {
        console.log('windowLoadListener');
        const observer = new MutationObserver(elemChangeCallback);
        const obsConfig = { attributes: true, attributeFilter:["class"], attributeOldValue: true };
        const targetNode = document.getElementById('block-ui-container');
        observer.observe(targetNode, obsConfig);
        //addBulkSearchButton();
        // Set up mutation observer to watch when refresh dialog is shown & cleared
        function elemChangeCallback (mutationsList, observer) {
            addqol();
            for (let mutation of mutationsList) {
                if (mutation.target.classList.contains('hidden') && mutation.oldValue == '') {

                }
            }
        }

        function addqol()
        {
            //gets rid of progress bar
            var progressexist = document.getElementsByClassName("loadFullnessBar percentageBar stackablePercentageBarWrapper")[0];
            var progexist = document.getElementsByClassName("progress-bar progressRemaining")[0];
            if(progressexist || progexist)
            {
                var rp = document.getElementsByClassName("ui-button-icon-secondary ui-icon ui-icon-triangle-1-s")[0];
                rp.click();
                var progress = document.querySelectorAll('li[id="c-3"]')[0];
                progress.click();
                document.body.click();
            }
            //shows 100 routes
            var dl = document.querySelector('select[name="dashboard_length"]');
            dl.value = "100"
            dl.dispatchEvent(new Event("change"))
        }

    }
})();