// ==UserScript==
// @name         AliExpress mass message deleter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Deletes all messages in your message center
// @author       Robinnaiitor
// @include      https://msg.aliexpress.com/*
// @include      https://message.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?domain=aliexpress.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434959/AliExpress%20mass%20message%20deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/434959/AliExpress%20mass%20message%20deleter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {
    var btn = $("<input type='button' value='Delete all messages'/>");
    var interval = null;

    btn.click(function(){
        interval = setInterval(Delete, 500);
    });

    function Delete() {
        var selector = "[fill='#757575']";
        if(document.querySelector(selector) !== null) {
            FireEvent(selector, 'click');
            ClickButtonWithText("OK");
        } else {
            clearInterval(interval);
        }
    }

    $('.me-ui-main-title').append(btn);

    function ClickButtonWithText(text) {
        var button = document.getElementsByTagName("button");
        for (var i = 0; i < button.length; i++) {
            if (button[i].innerHTML === text) {
                button[i].click();
            }
        }
    }

    function FireEvent(selector, eventname) {
        var evObj = document.createEvent( 'Events' );
        evObj.initEvent( eventname, true, false );
        document.querySelector(selector).dispatchEvent(evObj);
    }
});