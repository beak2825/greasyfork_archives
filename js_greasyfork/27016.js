// ==UserScript==
// @name         change font size if too small
// @namespace    https://greasyfork.org/zh-CN/scripts/27016-change-font-size-if-too-small
// @version      0.1
// @description  change font size if too small.
// @author       FxDash
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27016/change%20font%20size%20if%20too%20small.user.js
// @updateURL https://update.greasyfork.org/scripts/27016/change%20font%20size%20if%20too%20small.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fontSize = 16;
    for(let item of document.querySelectorAll("*")){
        let currentFontSize = window.getComputedStyle(item).getPropertyValue("font-size").match(/\d+/);
        if(currentFontSize && currentFontSize[0] < fontSize){
            item.style.fontSize = fontSize + 'px';
        }
    }
})();