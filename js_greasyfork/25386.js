// ==UserScript==
// @name        gazellegames fuckingSceenshotFix
// @namespace   IDK
// @description better screenshot handling for ggn | Greasemonkey 4.1: ✔ Tampermonkey 4.4: ✔ 
// @include     https://gazellegames.net/upload.php*
// @include     https://gazellegames.net/torrents.php?action=editgroup*
// @version     3.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25386/gazellegames%20fuckingSceenshotFix.user.js
// @updateURL https://update.greasyfork.org/scripts/25386/gazellegames%20fuckingSceenshotFix.meta.js
// ==/UserScript==

var screens;
function getFuckingLinks(){
  
screens = document.getElementsByName("screens[]");
screen_box=document.getElementById('screen_box');
	
if(/upload.php/.test(window.location)){

 screen_box.value=document.getElementById('image').value+'\n';}
else{
  screen_box.value=document.getElementsByName('image')[0].value+'\n';} 
	
	
for(var i=0;i<screens.length;i++){
  screen_box.value=screen_box.value+screens[i].value+'\n';
  
}}



function postFuckingLinks(){


var screen_box=document.getElementById('screen_box'); 

var splitScreen = screen_box.value.split("\n"); 
screens = document.getElementsByName("screens[]");
  
if(/upload.php/.test(window.location)){

  document.getElementById('image').value=splitScreen[0];}
else{
  document.getElementsByName('image')[0].value=splitScreen[0];}
	
	
	
for(var i=0;i<screens.length;i++){

  screens[i].value=""+splitScreen[i+1];
  
}}

function clickAllPtp(){
	
    var list = document.querySelectorAll("input");
    for (var i = 0; i < list.length; i++) { if(list[i].value=='PTPImg It'){list[i].click()}}
}


document.getElementById('image_block').innerHTML = '<a href="javascript:;" id="get_all_screen">[get all screenshot links]</a><a href="javascript:;" id="put_all_screen">[put all screenshot links]</a><a href="javascript:;" id="click_ptp">[click all ptp]</a> <br> <textarea style="width:400px;height:400px" id="screen_box"></textarea>' + document.getElementById('image_block').innerHTML;
document.getElementById('get_all_screen').addEventListener('click', getFuckingLinks, false);
document.getElementById('put_all_screen').addEventListener('click', postFuckingLinks, false);
document.getElementById('click_ptp').addEventListener('click', clickAllPtp, false);
