// ==UserScript==
// @name         RandSpeak
// @version      1000000000000000000
// @description  Adds some functionality to the Solar Crusaders Alpha
// @author       @BitteWenden
// @match     http://forum.spiderlinggames.co.uk/*
//@grant GM_xmlhttpRequest
//@require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js

// @namespace https://greasyfork.org/users/18854
// @downloadURL https://update.greasyfork.org/scripts/16214/RandSpeak.user.js
// @updateURL https://update.greasyfork.org/scripts/16214/RandSpeak.meta.js
// ==/UserScript==

$('document').ready(function speak() {   
    console.log("test");
    /*$.get( "https://webknox.com/api/jokes/random?maxLength=100&apiKey=befchagejfhiwckdoxcllwtgvchbcwr", function( data ) {
        console.log("data");
    });*/
    GM_xmlhttpRequest({
    method: "GET",
    url: "http://tambal.azurewebsites.net/joke/random",         
    onload: function(response) {  
        console.log(response);
        var myresponse = JSON.parse(response['response']);
        var msg = new SpeechSynthesisUtterance(myresponse['joke']);
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    }
    });
    
    
});

