// ==UserScript==
// @name         FM skill colors for TrophyManager
// @namespace    http://gitare.info/
// @version      0.2 beta
// @description  Football manager colors
// @author       Gordan S. aka Mansfield
// @match        https://trophymanager.com/players/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372156/FM%20skill%20colors%20for%20TrophyManager.user.js
// @updateURL https://update.greasyfork.org/scripts/372156/FM%20skill%20colors%20for%20TrophyManager.meta.js
// ==/UserScript==

// it works on single player page
(function() {
    'use strict';

    function find_color(br){
       switch(br){
           case 1:
           case 2:
           case 3:
           case 4:
           case 5:
               return "#fffdd0"
               break;
           case 6:
           case 7:
           case 8:
               return "#fcf4a3"
               break;
           case 9:
           case 10:
               return "#fcf4a3"
           case 11:
           case 12:
               return "#f7fca3"
               break;
           case 13:
           case 14:
               return "#f8de7e"
               break;
           case 15:
           case 16:
               return "#fcd12a"
               break
           case 17:
           case 18:
               return "yellow"
               break;
           default:
               return ""
       }
    }
    var table = document.getElementsByClassName("skill_table zebra");

    for(var i=0; i<table[0].rows.length;i++){
       var broj= parseInt(table[0].rows[i].firstChild.nextElementSibling.nextSibling.innerText)
        var color = find_color(broj);
       table[0].rows[i].firstChild.nextElementSibling.nextSibling.style.color= color;

        var broj2 = parseInt(table[0].rows[i].firstChild.nextElementSibling.firstChild.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstChild.data);
        var color2 = find_color(broj2);
        table[0].rows[i].firstChild.nextElementSibling.firstChild.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.style.color= color2;
       }

})();