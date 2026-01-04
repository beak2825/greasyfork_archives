// ==UserScript==
// @name Vzacz God's Membean Auto-Answer
// @namespace https://www.facebook.com/pages/Membean-Autoanswer/814773558607255
// @version 1
// @description Membean Auto-Answer
// @author Vzacz God
// @match *://membean.com/training_sessions/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/37217/Vzacz%20God%27s%20Membean%20Auto-Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/37217/Vzacz%20God%27s%20Membean%20Auto-Answer.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.httpEquiv = "refresh";
meta.content = "6";
document.getElementsByTagName('head')[0].appendChild(meta);
setTimeout(function(){
if(document.getElementsByClassName("choice answer").length > 0){
    document.getElementsByClassName("choice answer")[0].click();
}

if(document.getElementById("next-btn")){
    document.getElementById("next-btn").click()
}
var choice = Math.floor(Math.random()*100) < 93;
if(choice){
    document.querySelectorAll("input[value=Pass]")[0].click();
}else{
    document.querySelectorAll("input[value=Fail]")[0].click();
}
}, 1000);