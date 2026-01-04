
// ==UserScript==
// @name         bilibli 主页-播放页-夜间模式
// @namespace    bilibli_dark
// @version      0.1
// @description  为了激活主页动态iframe,脚本会让窗口弹出一下下
// @author       zusheng
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436136/bilibli%20%E4%B8%BB%E9%A1%B5-%E6%92%AD%E6%94%BE%E9%A1%B5-%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/436136/bilibli%20%E4%B8%BB%E9%A1%B5-%E6%92%AD%E6%94%BE%E9%A1%B5-%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const newStyle = `
            #bilibiliPlayer,
            .bb-comment
            {
                box-shadow: none!important;
                border-radius: 12px!important;
                overflow: hidden!important;
            }

            /* bg */
            body{
                 background-color: rgb(14,14,14)!important;
            }

            /* bg-card */
            .van-popover,
            .bilibili-player-video-sendbar,
            .bui-collapse-header,
            .bilibili-player-video-bottom-area,
            .danmaku-wrap,
            #playerAuxiliary,
            .rec-footer,
            .nav-menu div,
            .bb-comment,
            .comment-send-lite,
            .bui-collapse-body,
            .player-auxiliary-danmaku-management,
            .player-auxiliary-danmaku-management div,
            .player-auxiliary-danmaku-management span,
            .player-auxiliary-danmaku-wrap,
            .player-auxiliary-danmaku-wrap div,
            .player-auxiliary-danmaku-wrap span,
            .player-auxiliary-danmaku-function,
            .player-auxiliary-danmaku-function div,
            .player-auxiliary-danmaku-function span,
            .player-auxiliary-danmaku-btn-footer,
            .player-auxiliary-danmaku-btn-footer div,
            #internationalHeader,
            #internationalHeader div:not(.num):not(.bili-banner):not(.b-logo):not(.animated-banner):not(.taper-line):not(.layer):not(.dynamic-update),
            .mini-header, .mini-header__content,
            #playerAuxiliary .bscroll-vertical-scrollbar {
                background-color: rgb(30,30,30)!important;
            }

            /* color-std */
            .info > a,
            .text,
            .clearfix li,
            #v_desc div, #v_desc span,
            .player-auxiliary-danmaku-wrap span,
            #internationalHeader a, #internationalHeader span,
            .van-popover, .van-popover span, .van-popover div {
                color: rgb(196,197,200)!important;
            }

            /* color-unAct */
            .inside-wrp div,
            .text-con,
            player-auxiliary-danmaku-btn-footer div,
            .player-auxiliary-danmaku-function div,
            .player-auxiliary-danmaku-function span {
                color: rgb(160,161,164)!important;
            }

            /* color-Act */
            .video-title,
            .player-auxiliary-filter-title,
            .rec-footer,
            .mini-upload,
            #internationalHeader div,
            #comment span, #comment div,
            .video-info div,
            .title,
            .ss,
            .name,
            .manga-title {
                color: rgb(230,231,233)!important;
            }

            /* card-std */
            .nav-menu div {
                border: none!important;
                box-shadow: none!important;
            }

            .bb-comment{
                padding: 0 16px!important;
            }

            .con {
                border-top: 1px solid rgba(255,255,255,.4)!important;
            }

            .comment-header, #v_tag{
                border-bottom: 2px solid rgba(255,255,255,.4)!important;
            }

            #activity_vote .inside-wrp{
                border: 1px solid rgba(255,255,255,.3)!important;
            }

            iframe {
                background-color: transparent!important;
            }

            .page-tab .con {
              border: none!important;
            }

           .page-tab .con li{
              border: none!important;
           }
         `

    const iframeStyle = `
        input
        body,
        html,
        .out-container,
        .im-list-box,
        .play-all {
            background-color: transparent!important;
            box-shadow: none!important;
        }

        .tab-bar {
            border-bottom: 1px solid rgba(255,255,255,.4)!important;
        }

        .content, .im-list {
            color: rgb(196,197,200)!important;
        }

        .list-item:hover .content {
            color: rgb(30,30,30)!important;
        }

         .history-tip, .im-root{
            background-color: rgb(30,30,30)!important;
         }
    `


    function navCreateListen() {
        if (document.querySelectorAll('.nav-user-center .signin .item')?.length > 0) {
            document.removeEventListener('DOMNodeInserted', navCreateListen)
            document.querySelectorAll('.nav-user-center .signin .item .nav-item').forEach(item => {
                const event3 = new CustomEvent("mouseenter", {});
                const event2 = new CustomEvent("mousemove", {});
                const event1 = new CustomEvent("mouseover", {});
                const event0 = new CustomEvent("mouseleave", {});
                item.dispatchEvent(event3);
                item.dispatchEvent(event2);
                item.dispatchEvent(event1);
                setTimeout(() => {
                    item.dispatchEvent(event0)
                    addIframeClass(item, event0)
                }, 1000)
            })
        }
    }

    function addIframeClass(itemParent, event0) {
        document.querySelectorAll('.nav-user-center iframe').forEach(item => {
            const if_doc = item.contentWindow.document
            let if_styleEl = if_doc.getElementById('if_style_dark')
            if (!if_styleEl) {
                if_styleEl = if_doc.createElement('style')
                if_styleEl.type = 'text/css'
                if_styleEl.id = 'if_style_dark'
                if_doc.querySelector('head').appendChild(if_styleEl)
            }
            if_styleEl.appendChild(document.createTextNode(iframeStyle))
        })
    }

    function addClass(newClass) {
        document.addEventListener('DOMNodeInserted', navCreateListen)
        let styleEl = document.getElementById('style_dark')
        if (!styleEl) {
            styleEl = document.createElement('style')
            styleEl.type = 'text/css'
            styleEl.id = 'style_dark'
            document.querySelector('head').appendChild(styleEl)
        }
        styleEl.appendChild(document.createTextNode(newClass))
    }

    console.log(document.querySelectorAll('.i-frame'))

    window.onload = (() => addClass(newStyle))
})();