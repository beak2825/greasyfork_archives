// ==UserScript==
// @name         Middleclick everywhere
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Lets you use middle-click to open a new tab on all sites
// @author       NKay
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34124/Middleclick%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/34124/Middleclick%20everywhere.meta.js
// ==/UserScript==

window.addEventListener('click', function(e){
if(e.button == 1 || (e.button === 0 && e.ctrlKey)){
    e.stopPropagation();
}
}, true);