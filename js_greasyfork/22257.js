// ==UserScript==
// @name         Auto Login for Webmail
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  none
// @author       Kenan
// @include      https://webmail.bilkent.edu.tr/*
// @grant        none
// @exclude      https://webmail.bilkent.edu.tr/?_task=logout/* 
// @downloadURL https://update.greasyfork.org/scripts/22257/Auto%20Login%20for%20Webmail.user.js
// @updateURL https://update.greasyfork.org/scripts/22257/Auto%20Login%20for%20Webmail.meta.js
// ==/UserScript==

var yourEmailAddress;
var yourPassword;

var stringElements = "";
var passwordElement;
var passwordID;
var buttons;
var button;

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
    
     
    var oU = LS.get('oUser'); // should be a stored Obj
    
    var isMailBox = (window.location.href.includes("https://webmail.bilkent.edu.tr/?_task=mail") || window.location.href.includes("https://webmail.bilkent.edu.tr/skins/larry/watermark.html"));
    var wasMailBox = (document.referrer == "https://webmail.bilkent.edu.tr/?_task=mail&_mbox=INBOX");
    
    if(isMailBox){
        oU.success = true;
    }
    
    if((!oU.name && !isMailBox && !wasMailBox) || (!oU.success)){
        oU.name = prompt("Enter your email address: " + window.location.href);
        oU.password = prompt("Enter your password: ");
        oU.success = false;
        oU.date = new Date().toUTCString();
        
        // Chrome 1+
        /*var isChrome = !!window.chrome && !!window.chrome.webstore;
        if(isChrome)
        {
            location.reload();
        }*/
        
    }else{
        //alert ("Hi " + oU.name + " Welcome back!" + " Date: " + oU.date);
        console.log("elseeeeee");
    }
    //read
    yourEmailAddress = oU.name;
    yourPassword = oU.password;
    //write
    
    LS.set('oUser', oU); // Store back the whole object
    
   
    if (!wasMailBox && yourPassword && yourEmailAddress)
    {
        //LoginForm_username.value = yourEmailAddress;
        $( "#rcmloginuser" ).val( yourEmailAddress );

        passwordID = "LoginForm_password";
        passwordElement = document.getElementById(passwordID);
        //$( "#passwordID" ).val( "feyyaz" );
        //passwordElement.type = "visible"; 
        passwordElement.value = yourPassword;


        button = document.getElementById("rcmloginsubmit");
        button.click();
        //alert(document.referrer);
    }
}
// Start on load
document.addEventListener('DOMContentLoaded', main() );

