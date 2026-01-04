// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.heroeswm.ru/map.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398706/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/398706/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delay = randomInteger(1, 3)*1000;
    pause(delay);
    function pause(ms)
    {
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < ms);
    }

    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }



var str = document.documentElement.innerHTML;



var result1 = str.match(/Dragons' Caves/g);
if (result1) {
location.href = 'https://www.heroeswm.ru/move_sector.php?id=1';}


var result2 = str.match(/Empire Capital/g);
if (result2) {
location.href = 'https://www.heroeswm.ru/move_sector.php?id=2';}

var result3 = str.match(/East River/g);
if (result3) {
location.href = 'https://www.heroeswm.ru/move_sector.php?id=11';}



})();