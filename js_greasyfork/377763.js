// ==UserScript==
// @name graphColour
// @namespace http://tampermonkey.net/
// @version 1.0
// @description try to take over the world!
// @author You
// @match https://github.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377763/graphColour.user.js
// @updateURL https://update.greasyfork.org/scripts/377763/graphColour.meta.js
// ==/UserScript==

// target element : ContributionCalendar-day
// attribute to change: fill
// Contributors:
// https://github.com/AlphaPy

var elem = document.getElementsByClassName("ContributionCalendar-day");

var LEVEL4 = '#216e39';
var LEVEL3 = '#30a14e';
var LEVEL2 = '#40c463';
var LEVEL1 = '#9be9a8';
var LEVEL0 = '#ebedf0';

(function() {
'use strict';

// Your code here...
for(var i=0; i<elem.length; i++){
    var currElem = elem[i];
    var count = parseInt(currElem.getAttribute("data-count"));

    if (count>=18){
            currElem.style.fill = LEVEL4;
        }else if (count>=11){
            currElem.style.fill = LEVEL3;
        }else if (count>=5){
            currElem.style.fill = LEVEL2;
        }else if (count>=1){
            currElem.style.fill = LEVEL1;
        }else if (count<1) {
            currElem.style.fill = LEVEL0;
        }
    }

for(var x=0; x<elem.length; x++){
    var xcurrElem = elem[x];
    var xcount = parseInt(xcurrElem.getAttribute("data-level"));

    if (xcount === 4){
            xcurrElem.style.fill = LEVEL4;
        }else if (xcount === 3){
            xcurrElem.style.fill = LEVEL3;
        }else if (xcount === 2){
            xcurrElem.style.fill = LEVEL2;
        }else if (xcount === 1){
            xcurrElem.style.fill = LEVEL1;
        }else if (xcount === 0){
            xcurrElem.style.fill = LEVEL0;
        }
    }
})();