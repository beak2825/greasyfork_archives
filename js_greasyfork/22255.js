// ==UserScript==
// @name         Auto Login for Stars
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  none
// @author       Kenan
// @include      https://stars.bilkent.edu.tr/*
// @grant        none
// @exclude      none
// @downloadURL https://update.greasyfork.org/scripts/22255/Auto%20Login%20for%20Stars.user.js
// @updateURL https://update.greasyfork.org/scripts/22255/Auto%20Login%20for%20Stars.meta.js
// ==/UserScript==

var yourEmailAddress;
var yourPassword;

var usernameInput;
var passwordInput;
var loginButton;

function main() {
    'use strict';

    var LS = {
        get : function( id ) {
            var item = localStorage.getItem( id );
            if(item){
                return item.charAt(0)=='{' ? JSON.parse(item) : item;
            }else{
                return {}; 
            }
        },	
        set : function( id, key ) {
            var k = typeof key=="object" ? JSON.stringify( key ) : key;
            console.log( k );
            return localStorage.setItem( id, k );
        },
        del : function( id ){
            return localStorage.removeItem( id );
        }
    };

    //start
    usernameInput = document.getElementById("LoginForm_username");
    passwordInput = document.getElementById("LoginForm_password"); 
    //loginButton = document.getElementById("loginbtn");
    var buttons = document.getElementsByClassName("btn btn-bilkent");
    loginButton = buttons[0];

    var oU = LS.get('oUser'); // should be a stored Obj

    var isMailBox = window.location.href.includes("https://stars.bilkent.edu.tr/srs");
    var wasMailBox = document.referrer.includes("https://stars.bilkent.edu.tr/srs");
    var isLoginPage = window.location.href.includes("stars.bilkent.edu.tr/accounts/login");
    
    //sms:  https://stars.bilkent.edu.tr/accounts/site/verifySms
    console.log("isLoginPage: " +  isLoginPage);

    if(isMailBox){
        oU.success = true; // yanlış login bilgisi girerse user
        LS.set('oUser', oU); // Store back the whole object**************
        console.log(" oU.success" +  oU.success);
    }
    else if(isLoginPage)//login page
    { 
        console.log(" oU.success" +  oU.success);

        if(!oU.name || !oU.success){//if registry is absent or wrong  
            oU.name = prompt("Enter your ID: " );
            oU.password = prompt("Enter your password: ");
            oU.success = false; //-*************************
            oU.date = new Date().toUTCString();
        }

        yourEmailAddress = oU.name;
        yourPassword = oU.password;

        usernameInput.value = yourEmailAddress; 
        passwordInput.value = yourPassword;
        
        LS.set('oUser', oU); // Store back the whole object**************
        
        if(!wasMailBox)
            loginButton.click();  
    }
    else //if(verifySMS)
    {
        oU.success = true;
        LS.set('oUser', oU); // Store back the whole object*******************************
    }

}
// Start on load
document.addEventListener('DOMContentLoaded', main() );


