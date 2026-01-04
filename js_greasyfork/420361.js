// ==UserScript==
// @name           Chaturbate | CSS APPEND
// @version        2.0
// @namespace      chaturbate-css-append
// @description    chaturbate CSS append
// @include        https://m.chaturbate.com/*
// @include         https://chaturbate.com/male-cams/*
// @require        https://code.jquery.com/jquery-3.1.0.js
// @run-at         document-start
// @icon               https://www.google.com/s2/favicons?domain=chaturbate.com
// @downloadURL https://update.greasyfork.org/scripts/420361/Chaturbate%20%7C%20CSS%20APPEND.user.js
// @updateURL https://update.greasyfork.org/scripts/420361/Chaturbate%20%7C%20CSS%20APPEND.meta.js
// ==/UserScript==

$(function(){

    console.log('=============||||| RUNNING CHATURBATE CSS APPEND  - Media Queries |||||==============');



    function appendCSS() {
        console.log('----===-=-=- appendCSS - Media Queries ----===-=-=-');

        $('head').append('<style>@media(max-width:900px) and (min-width:414px) and (orientation:landscape){ .profile{width: 32.5% !important;} } #header-links {display:none !important;} .pushmenu {display:none !important;}</style>');
    }
    appendCSS();






    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('@media(max-width:900px) and (min-width:414px) and (orientation:landscape){ .profile{width: 32.5% !important;} } #header-links {display:none !important;} .pushmenu {display:none !important;}');


});


