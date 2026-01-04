// ==UserScript==
// @name         Shopee ChatWindow Bigger 
// @namespace    https://greasyfork.org/zh-CN/scripts/435141-shopee-chatwindow-bigger
// @version      0.2.3-beta
// @description  oversea test
// @author       samzong.lu
// @match        https://shopee.ph/*
// @match        https://shopee.tw/*
// @match        https://shopee.sg/*
// @match        https://shopee.vn/*
// @match        https://shopee.th/*
// @match        https://shopee.id/*
// @match        https://shopee.com.my/*
// @icon         https://www.google.com/s2/favicons?domain=shopee.ph
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435141/Shopee%20ChatWindow%20Bigger.user.js
// @updateURL https://update.greasyfork.org/scripts/435141/Shopee%20ChatWindow%20Bigger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css=`
    .src-pages-ChatWindow-index__container--1qoj1 {
        position: relative;
        width: 800px !important;
        height: 800px !important;
        background-color: #fff;
        box-sizing: border-box;
        border: 1px solid #dcdce0;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 4px 20px 0 rgba(74,74,78,.16);
        transform: translateX(0);
        transition: width .25s cubic-bezier(.4,.8,.74,1),height .25s cubic-bezier(.4,.8,.74,1)
    }

    .src-modules-conversationDetail-component-index__zone--Xa4RW {
        position: relative;
        width: 100%;
        height: 660px !important;
    }

    .src-pages-ChatWindow-index__windows--3KL4n {
        display: flex;
        height: 90% !important;
        opacity: 1;
        transform: translateX(0);
        transition: all .25s cubic-bezier(.4,.8,.74,1);
        font-size: xx-large;
    }

    .src-modules-conversationDetail-component-MessageSection-ConversationMessages-BaseMessage-MetaInfo-index__meta-info--10N_d {
        font-size: 16px !important;
        margin-top: .667em;
        text-align: center;
        color: #bbb;
    }

    #shopee-mini-chat-embedded,#shopee-mini-chat-embedded button,#shopee-mini-chat-embedded pre {
    font-family: Helvetica,Helvetica Neue,RobotoRegular,Droid Sans,Arial,sans-serif;
    height: 820px;
    width: -280px;
    }`;

    GM_addStyle(css);
})();