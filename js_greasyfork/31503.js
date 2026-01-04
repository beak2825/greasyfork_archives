// ==UserScript==
// @name         viggle tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  viggle
// @author       Bboy tech
// @match        http://viggle.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31503/viggle%20tv.user.js
// @updateURL https://update.greasyfork.org/scripts/31503/viggle%20tv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var refreshPageTimer = setInterval (function() {refreshPage(); }, Math.floor(Math.random() * 900000) + 1200000);
    var fastForwardTimer = setInterval (function() {fastForward(); }, Math.floor(Math.random() * 3000) + 7000);
    //var autoLoginTimer = setInterval (function() {autoLogin(); }, Math.floor(Math.random() * 3000)); //NOTE: For this to work, you have to disable the password autofill (it's the thing that saves your password and puts it in automatically) if you enabled it on whatever browser you're using. For whatever reason, the login button doesn't work when it's enabled.
    var onHomeTimer = setInterval (function() {onHome(); }, Math.floor(Math.random() * 3000));
    var AreYouStillwatchingTimer= setInterval (function() {AreYouStillwatching(); }, Math.floor(Math.random() * 300000)+ 420000);
    //var closepopupadTimer = setInterval (function() {closepopupad(); }, Math.floor(Math.random() * 3000) + 7000);

    function onHome() {
        if(window.location.href == "http://viggle.tv/home") {
            var x = Math.floor((Math.random() * 4) + 1);
            if (x == 1)
            {
                location.href = "http://viggle.tv/video/5714e626-de3e-4852-b197-df5c5ddb0c95";
            }
            else if (x == 2)
            {
                location.href = "http://viggle.tv/video/5e832aee-a963-4e70-884d-203d3ac88ba1";
            }
            else if (x == 3)
            {
                location.href = "http://viggle.tv/video/3b6db241-2aca-4247-9bc6-765f7ca4973d";
            }
            else if (x == 4)
            {
                location.href = "http://viggle.tv/video/065c13fa-179a-4b16-b48f-27442eaf882a ";
            }

        }
    }

    /*function autoLogin() {
        var email = "DISABLE";      //NOTE: This type of storage is very insecure. Make sure your Perk password isn't shared with any other services or don't use this feature. To disable this, set the text field to DISABLE.
        var  password = "DISABLE";      //NOTE: This type of storage is very insecure. Make sure your Perk password isn't shared with any other services or don't use this feature. To disable this, set the text field to DISABLE.

        if(email == "DISABLE" || password == "DISABLE") {
        }
        else {
            if(document.getElementsByClassName("login")[0] != "none") {
                document.getElementsByClassName("login")[0].click();
            }

            document.getElementsByClassName("panel-element-input panel-element-input--email")[0].value = email;
            document.getElementsByClassName("panel-element-input panel-element-input--password")[0].value = password;

            document.getElementsByClassName("panel-element-button flex-column")[0].disabled = false;
            document.getElementsByClassName("panel-element-button flex-column")[0].click();
        }
    } */

    function fastForward () {
        var duration = jwplayer().getDuration();
        var targetPos = duration - Math.random();

        jwplayer().seek(targetPos);
    }

    function refreshPage(){
        location.href = "http://viggle.tv/home";
    }
    
    function AreYouStillwatching(){
        document.getElementsByClassName("recaptcha-checkbox-checkmark")[0].click();
        document.getElementsByClassName("btn")[0].click();
    }

    //function closepopupad() {
        
    //}
})();
