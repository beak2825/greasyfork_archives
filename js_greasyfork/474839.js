// ==UserScript==
// @name         LZTClicableUserThreadsUsername
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Made clicable username on userthreads page
// @author       MeloniuM
// @license      MIT
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474840/LZTClicableUserThreadsUsername.user.js
// @updateURL https://update.greasyfork.org/scripts/474840/LZTClicableUserThreadsUsername.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (!$('body.userthreads').length) return;
 
    const title = $('.mainContent .titleBar h1');
    const username = title.text().replace((XenForo.visitor.language_id == 2? 'Темы от ':"'s threads"), '');
    const user_id = $('form.DiscussionListOptions input[name="user_id"]').val();
 
    let html = `<a href="/members/${user_id}">${username}</a>'s threads`;
    if (XenForo.visitor.language_id == 2){
        html = `Темы от <a href="/members/${user_id}">${username}</a>`;
    }
    title.html(html);
})();