// ==UserScript==
// @name         Scroll to Bottom Button
// @namespace    https://greasyfork.org/en/users/2329-killerbadger
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://psarips.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25680/Scroll%20to%20Bottom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/25680/Scroll%20to%20Bottom%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function goDown() {
        var episodes = document.getElementsByClassName("sp-wrap sp-wrap-default");
        var Ydest = episodes[episodes.length-1].getBoundingClientRect().top + window.scrollY; 
        var halfHeight = screen.height/3;
        Ydest = Math.round(Ydest - 200); 
        window.scrollTo(1,Ydest);
    }
    var zNode       = document.createElement ('li');
    zNode.innerHTML = '<img src="http://www.clker.com/cliparts/C/C/t/u/L/0/arrow-down-gray-hi.png" alt="Scroll down to latest link" style="width:60px;height:38px;">';
    zNode.setAttribute ('id', 'downButton');
    zNode.addEventListener("click",goDown,false);
    document.getElementById('menu-item-455').parentNode.appendChild (zNode);

})();