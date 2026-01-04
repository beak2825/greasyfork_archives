// ==UserScript==
// @name         EBonus.gg Video lite
// @namespace    https://greasyfork.org/en/users/306626-charlescraft50
// @version      1.3
// @description  Click the next video button and the circles/bubbles coins automatically. It also skip the captcha!
// @author       CharlesCraft50
// @copyright    2019, CharlesCraft50 (https://openuserjs.org/users/CharlesCraft50)
// @license      MIT
// @include      https://ebonus.gg/*
// @match        https://www.google.com/recaptcha/api2/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/384690/EBonusgg%20Video%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/384690/EBonusgg%20Video%20lite.meta.js
// ==/UserScript==

$(document).ready(function(){
    //Functions

    function simulateClick(a) {
        var event = new MouseEvent('click');
        a.dispatchEvent(event);
    }

    window.ClickOnBubble = function(){
        if ($(".coins_popup.circle.adsbox").length > 0 || $('div.adsbox:contains("COINS")').length > 0) {
            setTimeout(function(){simulateClick(document.querySelector('.coins_popup.circle.adsbox'));}, 10);
        }
    };

    window.ClickNext = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 0) {
            console.log("videos clicked");
            $(".confirm").click();
            setTimeout(function(){window.location.href = 'https://ebonus.gg/earn-coins/watch/';}, 5000);
        }
    };

    function iframeRef( frameRef ) {
        return frameRef.contentWindow
            ? frameRef.contentWindow.document
        : frameRef.contentDocument
    }

    //Captcha Funtion
    if (location.href.indexOf('google.com/recaptcha') > -1) {
        var clickCheck = setInterval(function() {
            if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                clearInterval(clickCheck);
                document.querySelector('.recaptcha-checkbox-checkmark').click();
            }
        }, 2000);
    } else {
        var forms = document.forms;
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].innerHTML.indexOf('google.com/recaptcha') > -1) {
                var rc_form = forms[i];
                var solveCheck = setInterval(function() {
                    if (grecaptcha.getResponse().length > 0) {
                        clearInterval(solveCheck);
                        $('input[value="Continue"]').click();
                    }
                }, 100);
            }
        }
    }

    setTimeout(function(){
        if(window.location.href.indexOf("ebonus.gg/earn-coins/watch") > -1) {
            window.location.reload();
        }
    }, 120000);

    if($('p:contains("Please complete this captcha to continue watching videos.")').length > 0) {
        console.log("Captcha Alert");
    } else {
        //Start
        var coinsclicker = setInterval(function() {
            ClickNext();
            ClickOnBubble();
        }, 1000);
        $('li:contains("144")').click();

        var muteVideo = setInterval(function(){
            if($('.vjs-mute-control[title="Mute"]').length > 0) {
               $('.vjs-mute-control').click();
            } else {
                clearInterval(muteVideo);
            }
        }, 1000);

        var playVideo = setInterval(function(){
            if($('.vjs-play-control.vjs-control.vjs-button[title="Play"]').length == 1) {
               $('.vjs-play-control.vjs-control.vjs-button').click();
            }
        }, 1000);
        setTimeout(function(){clearInterval(playVideo);}, 15000);
    }
});