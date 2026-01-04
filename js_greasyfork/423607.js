// ==UserScript==
// @name         Filtering Petio
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Filter out available/requested items
// @author       u/lifthrasir6
// @match        http://192.168.2.6:7777/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423607/Filtering%20Petio.user.js
// @updateURL https://update.greasyfork.org/scripts/423607/Filtering%20Petio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let i=0;
    function init() {
        console.log("init")
        i++
        for (let item of document.getElementsByClassName("on-server")) {
            //item.style.opacity = 0.05
            item.style.display = "none"
        }
        for (let item of document.getElementsByClassName("requested")) {
            //item.style.opacity = 0.05
            item.style.display = "none"
        }
        if(i<5){
            setTimeout(init, 1500);
        }
    }

    setTimeout(init, 1000);

})();