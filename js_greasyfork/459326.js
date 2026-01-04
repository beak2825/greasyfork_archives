// ==UserScript==
// @name         LokiExplore
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @author       ye
// @description  solve chrome grafana loki explore bug without updating, for detail: https://github.com/grafana/grafana/issues/54535 
// @include /^https:\/\/grafana\.[^\/]*/explore\?.*Loki.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459326/LokiExplore.user.js
// @updateURL https://update.greasyfork.org/scripts/459326/LokiExplore.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var f = function() {
        if (document.querySelectorAll("div[aria-label='Query field'] > div").length == 0) {
            console.log("not found")
        } else {
            document.querySelectorAll("div[aria-label='Query field'] > div")[0].style.removeProperty('-webkit-user-modify')
        }
        setTimeout(f, 200)
    }
    window.addEventListener("load", f);
    // Your code here...
})();