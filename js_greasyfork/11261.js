// ==UserScript==
// @name           Mturk Image Audior
// @version        0.4
// @description  opens in new window
// @author         ikarma
// @include        https://mturk.com/*
// @include        https://www.mturkcontent.com/dynamic/*
// @copyright     1012+, You
// @namespace https://greasyfork.org/users/9054
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11261/Mturk%20Image%20Audior.user.js
// @updateURL https://update.greasyfork.org/scripts/11261/Mturk%20Image%20Audior.meta.js
// ==/UserScript==
// https://www.mturkcontent.com/dynamic/hit?assignmentId=3IKZ72A5B5TQHZIZJ6EXHLH85Z9FNI&hitId=3QGHA0EA0JDN5SH4G3EM6U8UZ47WBK&workerId=A1XSTWO3EUJ937&turkSubmitTo=https%3A%2F%2Fwww.mturk.com
// to work properly in firefox:  about:config  dom.disable_window_flip = false

var page = document.getElementById('mturk_form');
var imagy = page.getElementsByTagName('img')[0];
// var popup = window.open(imagy.src, "name", 'left=1200, scrollbars=1,'); 

$('img[alt="image_url"]').height(200).width(300);

var $j = jQuery.noConflict(true);

document.addEventListener( "keydown", kas, false);


function kas(i) {   
if (i.keyCode == 65 ) { //A or npad 1
    $j('input[name="Q1Gender"]').eq(0).click(); //Mturk Image Auditor  
       }
if (i.keyCode == 83 ) { //S or npad 2
    $j('input[name="Q2Gender"]').eq(0).click(); //Mturk Image Auditor  
       }
if (i.keyCode == 68 ) { //D or npad 3
    $j('input[name="Q3Gender"]').eq(0).click(); //Mturk Image Auditor  
       }
if (i.keyCode == 70 ) { //F or npad 4
    $j('input[name="Q4Gender"]').eq(0).click(); //Mturk Image Auditor  
       }
if (i.keyCode == 71 ) { //G or npad 5
    $j('input[name="Q5Gender"]').eq(0).click(); //Mturk Image Auditor  
       } 
if (i.keyCode == 81 ) { //Q or npad 6
    $j('input[name="Q6Gender"]').eq(0).click(); //Mturk Image Auditor  
       }
if ( i.keyCode == 13) { //Enter or Numpad Enter   
    $j('input[id="submitButton"]').eq(0).click(); // SET Master
    }
   }

myWindow = window.open(imagy.src, "name", 'left=1200, scrollbars=1,'); 
window.onbeforeunload = function () {myWindow.close();};
myWindow.blur();
self.flocus();

