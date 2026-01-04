// ==UserScript==
// @name         KILL BILIBILI LIVE
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove live from bilibili homepage.
// @author       MeursaulT
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419916/KILL%20BILIBILI%20LIVE.user.js
// @updateURL https://update.greasyfork.org/scripts/419916/KILL%20BILIBILI%20LIVE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var obj = document.getElementById('bili_live');
        if(obj != null){
            obj.parentNode.removeChild(obj)
        }
    };

})();