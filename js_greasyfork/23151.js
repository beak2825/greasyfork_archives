// ==UserScript==
// @name         Auto Login for ODTU CLASS
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  none
// @author       Kenan
// @include      https://odtuclass.metu.edu.tr*
// @grant        none
// @exclude      none
// @downloadURL https://update.greasyfork.org/scripts/23151/Auto%20Login%20for%20ODTU%20CLASS.user.js
// @updateURL https://update.greasyfork.org/scripts/23151/Auto%20Login%20for%20ODTU%20CLASS.meta.js
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

    usernameInput = document.getElementById("username");
    passwordInput = document.getElementById("password"); 
    loginButton = document.getElementById("loginbtn");

    var oU = LS.get('oUser'); // should be a stored Obj

    var isMailBox = window.location.href.includes("https://odtuclass.metu.edu.tr/my");
    var wasMailBox = document.referrer.includes("https://odtuclass.metu.edu.tr/my");
    var isLoginPage = (window.location.href == "https://odtuclass.metu.edu.tr/login/index.php");

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
            oU.wasMailBox = false;
        }

        yourEmailAddress = oU.name;
        yourPassword = oU.password;

        usernameInput.value = yourEmailAddress; 
        passwordInput.value = yourPassword;

        var temp = oU.wasMailBox;
        if(wasMailBox)
        {
            oU.wasMailBox = false;
        }
        LS.set('oUser', oU); // Store back the whole object**************

        if(!temp)
            loginButton.click();
    }
    else //if(is start page)
    {
        console.log("oU.success:  " +  oU.success);
        oU.wasMailBox = wasMailBox;
        LS.set('oUser', oU); // Store back the whole object*******************************
        window.location.href = "https://odtuclass.metu.edu.tr/login/index.php";
    }


}
// Start on load
document.addEventListener('DOMContentLoaded', main() );


