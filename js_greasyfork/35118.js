// ==UserScript==
// @name         TYT Clans Dual Extention
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Slasher
// @match        http://dual-agar.me/
// @match        http://dual-agar.online/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35118/TYT%20Clans%20Dual%20Extention.user.js
// @updateURL https://update.greasyfork.org/scripts/35118/TYT%20Clans%20Dual%20Extention.meta.js
// ==/UserScript==
alert("Thanks for using TYT clans extention");
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}



  setInterval (function() {
    $(".header").replaceWith("<div class='header' id='lb_caption' style='color: rgb(8, 73, 212);'>TYT CLAN</div>"); },100);
    $( "#canvas" ).after( "<div style='z-index: 10000000; border-radius: 4px;position: fixed; top: 300px; left: 10px; text-align: center; width: 200px; background-color: #000; opacity: 0.9; padding: 7px;'> <div style='border-radius: 25px; text-indent:0; border:3px solid #fff; display:inline-block; color:#000; font-family:arial; font-size:15px; font-weight:bold; font-style:normal; height:30px; -webkit-box-shadow: 0px 0px 52px -6px rgba(46,204,113,1); -moz-box-shadow: 0px 0px 52px -6px rgba(46,204,113,1); box-shadow: 0px 0px 52px -6px rgb(202, 202, 202); line-height:1.5em; text-decoration:none; text-align:center; width: 190px; color: #fff;'>  W E L C O M E  </div><br>  <img src='https://i.imgur.com/4LTNzv2.png'; <br> <a style='color: #fff; font-family: arial;' id='minionCount'></a><br> Thanks for using TYT clans extention <a style='color: #fff; font-family: arial;'>  </a><a style='color: #fff; font-family: arial;'id='gh45nmvsy'></a><br><br><a style='color: #fff; font-family: arial;'> Ultrafast W Macro: </a><br><a style='color: #fff; font-family: arial;'> W </a> <br><a style='color: #fff; font-family: arial;'> Made By: </a><br><a style='color: #fff; font-family: arial;'> Slasher </a></div>" );