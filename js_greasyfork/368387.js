// ==UserScript==
// @name         Farm List Filter
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Get rid of those satisfying green swords!
// @author       Gabbot96
// @include      *://*.travian.*/build.php*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/368387/Farm%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/368387/Farm%20List%20Filter.meta.js
// ==/UserScript==

function FLF () {

if($('div.active div.content').hasClass('favorKey99') && $("div#build").hasClass("gid16")){
    $("div.contentNavi").after ( `
<div class="clear"></div>
<div id="FLF_Box" class="filter" style="float:right; margin-bottom: 10px;">
	<div class="boxes boxesColor gray">
		<div class="boxes-tl"></div>
		<div class="boxes-tr"></div>
		<div class="boxes-tc"></div>
		<div class="boxes-ml"></div>
		<div class="boxes-mr"></div>
		<div class="boxes-mc"></div>
		<div class="boxes-bl"></div>
		<div class="boxes-br"></div>
		<div class="boxes-bc"></div>
		<div class="boxes-contents cf">
    	    <div class="filterContainer">
    	        <div id="custom filters">
    	            <button type="button" class="iconFilter" id="green_sword" >
    	                <img id="filter_green" class="iReport iReport1" src="img/x.gif" >
    	            </button>
    	            <button type="button" class="iconFilter" id="orange_sword">
    	               <img id="filter_orange" class="iReport iReport2" src="img/x.gif" >
    	            </button>
    	            <button type="button" class="iconFilter" id="red_sword">
    	               <img id="filter_red" class="iReport iReport3" src="img/x.gif" >
    	            </button>
    	        </div>
    	    </div>
    	    <div class="clear"></div>
    	</div>
	</div>
</div>
<div class="clear"></div>
` );

var i=0;
var j=0;
var k=0;


    
    $("#green_sword").click (function(){
        if(i==0){
            $(this).css("background-color", "#99c01a");
            i=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            i=0;
        }
        $("td.lastRaid img.iReport1").parentsUntil("tbody").toggle();
    });
    $("#orange_sword").click (function(){
        if(j==0){
            $(this).css("background-color", "#99c01a");
            j=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            j=0;
        }
        $("td.lastRaid img.iReport2").parentsUntil("tbody").toggle();
    });
    $("#red_sword").click (function(){
        if(k==0){
            $(this).css("background-color", "#99c01a");
            k=1;
        }
        else{
            $(this).css("background-color", "#ffffff");
            k=0;
        }
        $("td.lastRaid img.iReport3").parentsUntil("tbody").toggle();
    });



}
}
FLF();