// ==UserScript==
// @name         Torn Crimes Accessibility
// @namespace    http://mathias.host/
// @version      1.0.0
// @description  readability deluxe
// @author       Mathiaas [1918010]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/469191/Torn%20Crimes%20Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/469191/Torn%20Crimes%20Accessibility.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForEl(selector) {
        return new Promise(resolve => {
            if(document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if(document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForEl("[class^='crimeOptionSection']").then((el) => {
        console.log("Fixing accessibility.. hopefully :-)");
        let eventEnter = new Event("mouseenter"), eventLeave = new Event("mouseleave");
        let crimes = document.querySelectorAll("[class^='crimeOptionGroup'] [id^='tooltip-trigger-'");
        let tooltipPortal = null;
        crimes.forEach((e, i) => {
            if(e.querySelector("img") === null) {
                e.dispatchEvent(eventEnter);
                if(tooltipPortal === null)
                    tooltipPortal = document.querySelector(".ToolTipPortal");
                let container = e.parentNode.parentNode.querySelector("[class^='crimeOptionSection']");
                container.innerHTML += `<br />${tooltipPortal.innerText}`;
                e.dispatchEvent(eventLeave);
            }
        });
    });
})();