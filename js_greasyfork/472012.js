// ==UserScript==
// @name         Hotpot.ai Unlimiter
// @namespace    https://leaked.wiki
// @version      0.2
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once! + add options 
// @author       wolftdb
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472012/Hotpotai%20Unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/472012/Hotpotai%20Unlimiter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add 1000 images option
    const selectElement = document.querySelector('div#controlBox > div:nth-child(7) > select');
    const newOption = document.createElement('option');
    newOption.value = '1000';
    newOption.text = '1000';
    selectElement.add(newOption);

    // The existing script
    var css = ".disabled { pointer-events: all; opacity: 1; }";
    var js = "localStorage.setItem('ai.hotpot.helpers.requestCounter.8', '{\"lastRequestTime\":\"2023-03-12T03:24:37.586Z\",\"numRequests\":-69420}');";

    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.text = js;
    document.body.appendChild(script);
})();