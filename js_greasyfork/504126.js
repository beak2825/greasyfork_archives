// ==UserScript==
// @name         Toggle Switch For Reddit Post Insights
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  Add toggle for post insights
// @author       Hared
// @match        htps://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504126/Toggle%20Switch%20For%20Reddit%20Post%20Insights.user.js
// @updateURL https://update.greasyfork.org/scripts/504126/Toggle%20Switch%20For%20Reddit%20Post%20Insights.meta.js
// ==/UserScript==

(function() {
    'use strict';

     function toggleSwitch() {
        let el = document.getElementsByTagName("div");
        for(let i = 0; i < el.length; i++) {
            if(el[i].hasAttribute("slot")){
                if(el[i].getAttribute("slot") == "post-insights-panel") {
                    let pi = el[i].getElementsByClassName("font-semibold text-neutral-content-strong");
                    let sw = document.createElement("faceplate-switch-input");
                    sw.setAttribute("class", "toggle-insights")
                    sw.setAttribute("faceplate-validity", "valid");
                    sw.setAttribute("role", "checkbox");
                    sw.setAttribute("tabindex", "0");
                    sw.setAttribute("aria-disabled", "false");
                    sw.setAttribute("style", "float: right;");
                    pi[0].insertBefore(sw, pi[0].firstChild);
                    sw.addEventListener('change', function() {
                        let pe = pi[0].parentElement;
                        if (sw.getAttribute('aria-checked') === 'true') {
                            pi[0].childNodes[pi[0].childNodes.length-2].style.display = 'none';
                            pe.childNodes[pe.childNodes.length-2].style.display = 'none';
                        } else {
                            pi[0].childNodes[pi[0].childNodes.length-2].style.display = '';
                            pe.childNodes[pe.childNodes.length-2].style.display = '';
                        }
                    });
                    sw.addEventListener('click', function() {
                        let checked = sw.getAttribute('aria-checked') === 'true';
                        sw.setAttribute('aria-checked', !checked);
                        sw.dispatchEvent(new Event('change'));
                    });
                    let checked = sw.getAttribute('aria-checked') === 'true';
                        sw.setAttribute('aria-checked', !checked);
                        sw.dispatchEvent(new Event('change'));
                }
            }
        }
    }
    toggleSwitch();


setInterval(function()
{
    let ex = document.getElementsByClassName("toggle-insights");
    if(ex.length == 0)
        toggleSwitch();
}, 500);
})();