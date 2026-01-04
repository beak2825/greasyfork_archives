// ==UserScript==
// @name         Hotpot.ai Unlimited
// @namespace    https://leaked.wiki
// @version      0.1
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once! + 1000ft
// @author       wolftdb
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472014/Hotpotai%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/472014/Hotpotai%20Unlimited.meta.js
// ==/UserScript==

(function() {
    'use strict';
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


window.addEventListener('load', function() {
  var select = document.querySelector('div#controlBox > div:nth-child(7) > select');
  var option = document.createElement('option');
  option.value = '1000';
  option.text = '1000';
  select.appendChild(option);
}, false);