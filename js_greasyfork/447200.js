// ==UserScript==
// @name         MagicEden Auto-refresh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script for auto-refresh
// @author       @Qwinty
// @match        https://magiceden.io/marketplace/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magiceden.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447200/MagicEden%20Auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/447200/MagicEden%20Auto-refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function loop () {
        const refresh_status = getElementByXpath("//span[contains(text(),'refreshing')]");
        // console.log(refresh_status);

        if (refresh_status === null) {
            el.click()
        }
    }



    var cycle = false
    var interval, el
    document.addEventListener('keydown', function(e) {
        if (e.keyCode == 82) {
            el = getElementByXpath("//*[name()='svg' and @stroke='#F5F3F7' and @stroke-linejoin='round']/*[name()='polyline']/../..")
            // console.log(el)
            // el.click()
            cycle = !cycle
            if (cycle){
                console.log("Auto-refresh started")
                // interval = setInterval(loop(),100);
                interval = setInterval(() => {loop();},100);
            }
            else {
                console.log("Auto-refresh ended")
                clearInterval(interval)
            }
        }
    });
})();