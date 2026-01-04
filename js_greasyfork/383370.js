// ==UserScript==
// @name Aaron's Membean Autoanswer
// @namespace https://www.facebook.com/pages/Membean-Autoanswer/814773558607255
// @version 1
// @description Aaron's Membean Hack
// @author Aaron
// @match *://membean.com/training_sessions/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/383370/Aaron%27s%20Membean%20Autoanswer.user.js
// @updateURL https://update.greasyfork.org/scripts/383370/Aaron%27s%20Membean%20Autoanswer.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.httpEquiv = "refresh";
meta.content = "7";
document.getElementsByTagName('head')[0].appendChild(meta);
setTimeout(function(){
if(document.getElementsByClassName("choice answer").length > 0){
    document.getElementsByClassName("choice answer")[0].click();
}

if(document.getElementById("next-btn")){
    document.getElementById("next-btn").click()
}
var choice = Math.floor(Math.random()*100) < 89;
if(choice){
    document.querySelectorAll("input[value=Pass]")[0].click();
}else{
    document.querySelectorAll("input[value=Fail]")[0].click();
}
}, 1000);