// ==UserScript==
// @name         Generals Killer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generals滚粗 我要专心写代码
// @author       VitamineC
// @match        https://generals.io/
// @match        https://generals.io/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435743/Generals%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/435743/Generals%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var buttons=document.getElementsByTagName('button');
    for(var i=0;i<buttons.length;i++){
    buttons[i].parentNode.removeChild(buttons[i]);
    }
})();