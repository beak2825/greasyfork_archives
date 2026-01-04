// ==UserScript==
// @name         ItsLearningLogin
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A scipt for auto login in, designed for use with lastpass.
// @author       Laxybaxy
// @match        https://idp.feide.no/*
// @match        https://*.itslearning.com/*
// @match        https://itslearning.com/*
// @downloadURL https://update.greasyfork.org/scripts/423256/ItsLearningLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/423256/ItsLearningLogin.meta.js
// ==/UserScript==

var credentialsInterval, loginInterval;

function pressCredentials(){
    try{
        var loginbtn = document.querySelector("button[type='submit']");
        //for(var userbtn of loginbtns)
        if(loginbtn.innerText == "Logg inn" && document.readyState == "complete" && document.getElementById("username").value != "")
        {
            clearInterval(credentialsInterval);
            loginbtn.click();
        }
    }catch(e){
        console.log(e);
    }
}

function pressLogin()
{
    try{
        var a = document.querySelectorAll("a.itsl-native-login-button")
        for(var i = 0; i < a.length; i++){
            let e = a[i];
            if(e.innerHTML.includes("Feide") && document.readyState == "complete"){
                clearInterval(loginInterval);
                e.click();
            }
        }
    }catch(e){
        console.log(e);
    }
    try{
        if(document.querySelector(".l-menu-icons"))
        {
            clearInterval(loginInterval);
            console.log("stopped");
        }
    }catch(e){
        console.log(e);

    }
}

window.onload = function(){
    if(String(window.location).includes("idp.feide.no")){
        credentialsInterval = setInterval(pressCredentials,100);
    }else if(String(window.location).includes("itslearning.com")){
        loginInterval = setInterval(pressLogin,100);
    }
}