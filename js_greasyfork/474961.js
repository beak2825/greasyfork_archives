// ==UserScript==
// @name         LZT_TwistTheRoot
// @namespace    MeloniuM/LZT
// @version      0.1
// @description  Twist the root button to contest
// @author       MeloniuM
// @license MIT
// @match        https://zelenka.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474961/LZT_TwistTheRoot.user.js
// @updateURL https://update.greasyfork.org/scripts/474961/LZT_TwistTheRoot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!$('.LztContest--Participate').length) return;
    if(!$('.LolzteamEditorSimple').length) return;//если нельзя писать под розыгрыш

    $(document).ready(function(){
        const button = $('<span class="LztContest--twistTheRoot button primary marginBlock" style="margin-left: 5px;"><span>Root подкрути</span></span>');
        button.insertAfter('.LztContest--Participate.button');
        const id = $('.messageList .firstPost').attr('id').substr(5);
        button.on('click', function(){
            button.remove();
            XenForo.ajax(`/posts/${id}/comment`, {message_html: "<p>[IMG]https://i.imgur.com/JsGCeLz.gif[/IMG]&nbsp;</p>"});
        });
    });
})();