// ==UserScript==
// @name         1M+ Gold on refresh
// @namespace    http://tampermonkey.net/
// @version      1.4.18
// @description  changes gold on refresh to 1M+
// @author       EXOTIC_Scripting
// @match        https://www.kogama.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411531/1M%2B%20Gold%20on%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/411531/1M%2B%20Gold%20on%20refresh.meta.js
// ==/UserScript==
 
function start() {
    var gold = document.getElementById("nav-robux-amount");
    robux.innerHTML = "1M+";
      setTimeout(start, 0);
      
      
}
start();