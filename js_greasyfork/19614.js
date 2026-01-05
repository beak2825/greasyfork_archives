// ==UserScript==
// @name Jake Eck's Membean HACK
// @namespace none
// @version 1.1.1
// @description Membean hack coded by Jake Eck. For tech support, send me a message on Skype: mjakee-99
// @author Jake Eck
// @match *://membean.com/training_sessions/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/19614/Jake%20Eck%27s%20Membean%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/19614/Jake%20Eck%27s%20Membean%20HACK.meta.js
// ==/UserScript==

//will answer a question every 25 seconds.
setInterval(function(){
if(document.getElementsByClassName("choice answer").length > 0){
    document.getElementsByClassName("choice answer")[0].click();
}

if(document.getElementById("next-btn")){
    document.getElementById("next-btn").click();
}

var choice = Math.floor(Math.random()*100) < 80;
if(choice){
    document.querySelectorAll("input[value=Pass]")[0].click();
}else{
    document.querySelectorAll("input[value=Fail]")[0].click();
}
}, 25000);