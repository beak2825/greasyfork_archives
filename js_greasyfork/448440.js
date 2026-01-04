// ==UserScript==
// @name           Light Linux.org.ru
// @description    The light and clean theme for Linux.org.ru without login to the site.
// @description:ru Светлая и очищенная тема для сайта Linux.org.ru без логина на сайт.
// @namespace      https://www.tampermonkey.net/
// @match          https://www.linux.org.ru/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version        1.8
// @author         Nikolay Raspopov
// @homepage       https://www.cherubicsoft.com/
// @license        MIT
// @icon           https://www.google.com/s2/favicons?domain=linux.org.ru
// @grant          none
// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/448440/Light%20Linuxorgru.user.js
// @updateURL https://update.greasyfork.org/scripts/448440/Light%20Linuxorgru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $('link[rel="stylesheet"]').attr('href','/white2/combined.css');
    document.head.insertAdjacentHTML('beforeend', `<style>
    body {
    font-family: Consolas;
    font-size: 0.9em;
    background-color: white;
    color: black;
    }
    #hd, #bd, .messages, .message-table tbody, .msg, .group-item, .tracker-item, .grid-row {
    background-color: white !important;
    color: black !important;
    }
    .title {
    background-color: white !important;
    color: gray !important;
    font-size: 0.8em !important;
    }
    .msg {
    padding: 0.5em !important;
    }
    .msg_body {
    padding-bottom: 0.3em !important;
    }
    .tag {
    background-color: whitesmoke !important;
    color: dimgray !important;
    font-size: 0.8em !important;
    padding: 0.1em !important;
    }
    .tag::before, .tag::after {
    content: "" !important;
    }
    code, .tag, .btn, .infoblock, .page-number, .msg, .group-item, .tracker-item, .message-table td, .photo {
    border: 1px solid lightgray !important;
    border-radius: 0.3em !important;
    font-family: Consolas;
    }
    .sign, .reply {
    color: gray !important;
    display: inline;
    margin: 0 !important;
    font-size: 0.8em;
    }
    .photo {
    height: 60px !important;
    width: 60px !important;
    }
    .userpic {
    height: 64px !important;
    width: 64px !important;
    margin: 8px !important;
    filter: saturate(0) opacity(0.5) !important;
    }
    .message-w-userpic {
    padding-left: 80px !important;
    }
    a {
    color: cadetblue;
    text-decoration: none;
    }
    </style>`);
    $('#yandex_rtb').remove();
    $('#interpage').remove();
    $('noscript').remove();
    $('script').remove();
    $('.reactions-form').remove();
    $(document).ready( function(){
        $('#yandex_rtb').remove();
        $('#interpage').remove();
        $('noscript').remove();
        $('script').remove();
        $('.reactions-form').remove();
        // Selection of user posts
        var user = $('div[id="topProfile"] > a');
        if ( user && user.text() ) {
            $('.sign > a').each( function() {
                if ( $(this).text() == user.text() ) {
                    $(this).parent().parent().parent().css({'background-color':'azure'});
                }
            });
        }
    });
})();
