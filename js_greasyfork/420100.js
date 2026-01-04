// ==UserScript==
// @name         NordnetAutoLogin
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  A scipt for auto login in, designed for use with lastpass.
// @author       Laxybaxy
// @licence      MIT
// @match        https://www.nordnet.no/*
// @match        https://classic.nordnet.no/*
// @downloadURL https://update.greasyfork.org/scripts/420100/NordnetAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/420100/NordnetAutoLogin.meta.js
// ==/UserScript==

var credentialsInterval, loginInterval, isLoggedinInterval, reloadHandler;

function pressCredentials(){
    try{
        var loginbtns = document.querySelectorAll("button");
        //for(var userbtn of loginbtns)
        for (var i = 0; i < loginbtns.length; i++){
            var userbtn = loginbtns[i];
            if(userbtn.innerText == "innloggingsmetode")
            {
                userbtn.click();
            }
            if(userbtn.innerText == "brukernavn og passord")
            {
                clearInterval(credentialsInterval);
                userbtn.click();
                loginInterval = setInterval(pressActualLogin,100)
            }
        }
    }catch(e){
        console.log(e);
    }
}

function pressActualLogin(){
    try{
        if(document.getElementsByName("username")[0].value != "")
        {
            clearInterval(loginInterval);
            var loginbtn = document.querySelector("button[type='submit']");
            if(loginbtn){
                loginbtn.click();
            }
        }
    }catch(e){
        console.log(e);
    }
}

function isLoggedin()
{
    try{
        var a = document.querySelector("a[href*='/login']");
        if(a){
            clearInterval(isLoggedinInterval);
            a.click();
        }
        var b = document.querySelector("a[href*='/logout']");
        if(b){
            console.log("user logged in");
            clearInterval(isLoggedinInterval);
        }
    }catch(e){
        console.log(e);
    }
}

window.onload = function(){
    if(String(window.location).includes("/login-next")){
        credentialsInterval = setInterval(pressCredentials,100);
    }else{
        isLoggedinInterval = setInterval(isLoggedin,100);
        window.addEventListener("keydown",function(e){
            console.log(e);
            if(e.code=="ArrowRight"){
                location.reload();
            }
        });
    }
}