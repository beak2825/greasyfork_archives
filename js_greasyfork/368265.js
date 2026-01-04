// ==UserScript==
// @name         Attack Marker Filter
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Helps filtering Travian incoming attacks
// @author       Gabbot96
// @include      *://*.travian.*/build.php?id=39*
// @include      *://*.travian.*/build.php?tt=1&id=39*
// @include      *://*.travian.*/build.php?newdid=*&id=39&tt=1&gid=16
// @include      *://*.travian.*/build.php?newdid=*&id=39&gid=16
// @include      *://*.travian.*/build.php?newdid=*&id=39&tt=1*
// @include      *://*.travian.*/build.php?gid=16*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/368265/Attack%20Marker%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/368265/Attack%20Marker%20Filter.meta.js
// ==/UserScript==

function AMF () {

    $("div.filterContainer:last").append ( `
    </div><div id="custom filters">
    <button type="button" class="iconFilter" id="green_toggle" >
           <img id="filter_green" src="http://i68.tinypic.com/bjano9.png" height="16" width="16">
    </button>
    <button type="button" class="iconFilter" id="orange_toggle">
           <img id="filter_orange" src="http://i66.tinypic.com/vq5rtk.png" height="16" width="16">
    </button>
    <button type="button" class="iconFilter" id="red_toggle">
           <img id="filter_red" src="http://i68.tinypic.com/2vxm047.png" height="16" width="16">
    </button>
    <button type="button" class="iconFilter" id="gray_toggle">
           <img id="filter_gray" src="http://i67.tinypic.com/20igun9.png" height="16" width="16">
    </button>
` );

var i=0;
var j=0;
var k=0;
var l=0;

    $("#green_toggle").click (function(){
        if(i==0){
            $(this).css("background-color", "#99c01a");
            i=1;
        }
        else{
            $(this).css("background-color", "#ffffff"); 
            i=0; 
        }
        $("table thead tr td a img.markAttack1").parentsUntil("div.data").toggle();    
    });
    $("#orange_toggle").click (function(){
        if(j==0){
            $(this).css("background-color", "#99c01a");
            j=1;
        }
        else{
            $(this).css("background-color", "#ffffff"); 
            j=0; 
        }
        $("table thead tr td a img.markAttack2").parentsUntil("div.data").toggle();
    });
    $("#red_toggle").click (function(){
        if(k==0){
            $(this).css("background-color", "#99c01a");
            k=1;
        }
        else{
            $(this).css("background-color", "#ffffff"); 
            k=0; 
        }
        $("table thead tr td a img.markAttack3").parentsUntil("div.data").toggle();
    });
    $("#gray_toggle").click (function(){
        if(l==0){
            $(this).css("background-color", "#99c01a");
            l=1;
        }
        else{
            $(this).css("background-color", "#ffffff"); 
            l=0; 
        }
        $("table thead tr td a img.markAttack0").parentsUntil("div.data").toggle();
    });


}

AMF();