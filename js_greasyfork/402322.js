// ==UserScript==
// @name         7mmtv picture ratio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       AutoComplete
// @match        https://7mmtv.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402322/7mmtv%20picture%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/402322/7mmtv%20picture%20ratio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dom = document.getElementsByClassName('latest-korean-box-img');
    for(var i=0,len=dom.length; i<len; i++){
        dom[i].style.height="auto";
    }
})();