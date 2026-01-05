// ==UserScript==
// @name         Perk TV Automator
// @namespace    Perk TV Automator
// @include      *perk.tv/*
// @supportURL   https://greasyfork.org/scripts/18031-perk-tv-automator/
// @version      3.0
// @description  This script does things like refreshing the page and pressing the play button so that you can have a Perk TV server.
// @author       Byte11
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18031/Perk%20TV%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/18031/Perk%20TV%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var refreshPageTimer = setInterval (function() {refreshPage(); }, Math.floor(Math.random() * 900000));
    var fastForwardTimer = setInterval (function() {fastForward(); }, Math.floor(Math.random() * 3000) + 7000);
    var autoLoginTimer = setInterval (function() {autoLogin(); }, Math.floor(Math.random() * 3000)); //NOTE: For this to work, you have to disable the password autofill (it's the thing that saves your password and puts it in automatically) if you enabled it on whatever browser you're using. For whatever reason, the login button doesn't work when it's enabled.
    var onHomeTimer = setInterval (function() {onHome(); }, Math.floor(Math.random() * 3000));

    function onHome() {
        if(window.location.href == "http://perk.tv/home") {
            location.href = "http://perk.tv/video/c2621eeb-be27-11e5-91e5-0025902deae0";
        }
    }

    function autoLogin() {
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
    }

    function fastForward () {
        var duration = jwplayer().getDuration();
        var targetPos = duration - Math.random();

        jwplayer().seek(targetPos);
    }

    function refreshPage(){
        location.href = "http://perk.tv/video/c2621eeb-be27-11e5-91e5-0025902deae0";
    }
})();