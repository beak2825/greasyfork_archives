// ==UserScript==
// @name Get Link Shorten
// @namespace Get Link Script
// @version      1.0
// @description  Help you submit get link button
// @author       Jin
// @match https://ez4linkss.com/*
// @match https://advance-wishingjs.com/*
// @match https://ukshare.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/389295/Get%20Link%20Shorten.user.js
// @updateURL https://update.greasyfork.org/scripts/389295/Get%20Link%20Shorten.meta.js
// ==/UserScript==


function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementsByClassName(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
}


setInterval(function(){
    if(document.getElementsByTagName("h4")[0].textContent == 'Your link is almost ready.') {
        waitForElement("btn btn-success btn-lg get-link", function(){
          document.querySelector(".btn").click();
        });
    } else{
        console.log('Waiting to click!');
    }
}, 10000);