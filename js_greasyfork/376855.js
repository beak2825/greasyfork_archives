// ==UserScript==
// @name         Twitch PNP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitch PNP!
// @author       You
// @match        https://www.twitch.tv/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376855/Twitch%20PNP.user.js
// @updateURL https://update.greasyfork.org/scripts/376855/Twitch%20PNP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $(window).on('load', function() {
        $('.player-buttons-right .player-button.qa-fullscreen-button').attr('class', 'player-button qa-fullscreen-button');
        $('.player-buttons-right').append('<button class="player-button qa-pip-button pl-mg-r-1 pl-button__fullscreen--tooltip-left" tabindex="-1" type="button"><span><span class="player-tip" data-tip="Picture in Picture"></span><span class=""><svg id="icon_pip" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M20.8,14.2h-6.7v5h6.7V14.2z M24.2,20.8V9.1c0-0.9-0.7-1.6-1.7-1.6h-15c-0.9,0-1.7,0.7-1.7,1.6v11.7c0,0.9,0.8,1.7,1.7,1.7 h15C23.4,22.5,24.2,21.8,24.2,20.8z M22.5,20.9h-15V9.1h15V20.9z"></path></svg></span></span></button>');
        $('.player-buttons-right').on('click', '.player-button.qa-pip-button', function(){
            document.querySelector('div.player-video video').requestPictureInPicture();
        });
    });
})();