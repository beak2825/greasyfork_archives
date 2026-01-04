// ==UserScript==
// @name         Restaurant Streets Add More Friends
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can now send friend request to all users on the page in one click
// @author       zzdev
// @match        *://game.streets.cafe/search/*
// @downloadURL https://update.greasyfork.org/scripts/404624/Restaurant%20Streets%20Add%20More%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/404624/Restaurant%20Streets%20Add%20More%20Friends.meta.js
// ==/UserScript==
'use strict'

var btns = document.querySelectorAll('.btn');
var div = document.getElementsByClassName('newsletter');

var btn = document.createElement("BUTTON");
btn.innerHTML = "Send friend request to all";
btn.className = "btn btn-primary pull-right btn-block"
"btn btn-primary pull-right btn-block"
btn.style = "margin-top: 20px; margin-bottom: 20px;"
div[0].appendChild(btn);

btn.addEventListener("click", function(){
  alert("Sent friend request to all.");
  btns.forEach(item => clickOnAdd(item))
});

function clickOnAdd(item){
    if(item.innerText === "Add to friends"){
        item.click();
    }
}