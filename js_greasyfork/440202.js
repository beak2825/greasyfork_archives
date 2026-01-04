// ==UserScript==
// @name         CanvasLogin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A scipt for auto login, designed for use with lastpass.
// @author       H3rl
// @license MIT
// @match        https://idp.feide.no/*
// @downloadURL https://update.greasyfork.org/scripts/440202/CanvasLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/440202/CanvasLogin.meta.js
// ==/UserScript==

var credentialsInterval;

function pressCredentials(){
    try{
        var loginbtn = document.querySelector("button[type='submit']");
        //for(var userbtn of loginbtns)
        if(document.readyState == "complete" && document.getElementById("username").value != "")
        {
            clearInterval(credentialsInterval);
            loginbtn.click();
        }
    }catch(e){
        console.log(e);
    }
}

window.onload = function(){
    credentialsInterval = setInterval(pressCredentials,100);
}