// ==UserScript==
// @name         美化洛谷
// @namespace    http://yuyanmc.top/
// @version      0.1
// @description  啊？
// @author       yuyanMC
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.luogu.com.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473546/%E7%BE%8E%E5%8C%96%E6%B4%9B%E8%B0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/473546/%E7%BE%8E%E5%8C%96%E6%B4%9B%E8%B0%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var settings=`
        html{
            --y-bg:#fffa;
            --y-d-fg:#0008;
            --y-logo-bg:#07c8;
        }
    `;
    var dark=`
        html{
            --y-bg:#000a;
            --y-d-fg:#fff8;
            --y-logo-bg:#07c8;
        }
    `;
    var styles = `
        body{
            background-image:url(https://moe.jitsu.top/api/?sort=pc);
            background-attachment: fixed;
            background-size: cover;
            background-position: center;
        }
        .test-case,.marked>pre,.popup,.mp-editor-container,.dropdown,textarea,.am-comment-bd>pre,.am-comment-bd>pre>code,.am-btn,.editor[data-v-01cd4e24],.dropdown-operations,button,.discuss,.card,.team-right,.user-header-top,.inner-card,.lg-article, .lg-article-sub, .lg-article-nctrl, .am-comment-main,.am-comment-hd{
            border-radius:1rem !important;
        }
        .lfe-form-sz-small,.apps a,.text,.lfe-caption,.frame{
            border-radius:0.3rem !important;
        }
        .user-nav{
            position:fixed !important;
            z-index:1;
            right: 4em;
            top: 1em;
        }
        .header-layout.tiny[data-v-343f8c6f]{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            z-index:1;
        }
        .lfe-form-sz-small,code,input,input.lfe-form-sz-middle{
            background:transparent !important;
        }
        #app-old>.lg-index-content>.am-g>.am-u-md-12>.lg-article>.am-g>.am-u-md-4{
            width:100%;
        }
        #app-old>.lg-index-content>.am-g>.am-u-md-12>.lg-article>.am-g>.am-u-md-8{
            display:none;
        }
        #app-old>.lg-index-content>.am-g>.am-u-md-12{
            width: 33.33333333%;
        }
        nav[data-v-12f19ddc]{
            color: var(--y-d-fg) !important;
            left: 1em;
            top: calc(50% - 12em) !important;
            width: 3.7em;
            height: 24em !important;
            border-radius: 1.85em;
        }
        nav[data-v-12f19ddc] > div:nth-child(1){
            margin:0.3em;
            width:3.1em;
            height:3.1em;
            border-radius:1.55em;
            background:var(--y-logo-bg) !important;
            background-attachment: fixed;
            background-size: cover;
            background-position: center;
        }
        .logo-wrap[data-v-12f19ddc]{
            width:3.1em !important;
            height:3.1em !important;
            padding:0.7em !important;
        }
        .main-container[data-v-343f8c6f]{
            position:absolute;
            left:0;
            top:4em;
            width:calc(100% - 3.7em);
            height:100%;
            margin-left:0;
        }
        nav[data-v-258e49ac],main[data-v-343f8c6f]{
            background:none !important;
        }
        .qr-img[data-v-a3bbe6d6]{
            display:none;
        }
        .wrapper > .background,.side[data-v-0cd59e64]>div[data-v-0a593618]{
            display:none !important;
        }
        .lg-article, .lg-article-sub, .lg-article-nctrl,.marked>pre,.popup,.float-bottom,.user-nav,.lfe-form-sz-middle,.CodeMirror-gutters,.mp-editor-toolbar,.mp-preview-area,.CodeMirror,.dropdown,textarea,.am-comment-bd>pre,.am-comment-bd>pre>code,.ace-clouds,.dropdown-operations,button,.frame[data-v-66fcc50b],.discuss,.inner-card,.card,.main-container>.header-layout.tiny[data-v-343f8c6f],nav[data-v-12f19ddc],.center[data-v-572d3b30],.am-panel,.am-comment-main,.am-comment-hd{
            background:var(--y-bg) !important;
            background-color:var(--y-bg) !important;
        }
        .ace_active-line{
            background-color:#FFFBD177 !important;
        }
        .am-comment-bd{
            background:none;
        }
        blockquote{
            border-left:0 !important;
        }
        button{
            color:var(--y-d-fg) !important;
        }
        .ace_gutter{
            background-color:#ebebeb77 !important;
        }
        .ace_gutter-active-line{
            background-color:#dcdcdc77 !important;
        }
        .mp-editor-menu > li > a{
            border:none !important;
        }
        .float-bottom,.mp-editor-toolbar{
            border-top-left-radius: 1rem !important;
            border-top-right-radius: 1rem !important;
        }
        .mp-editor-ground{
            border-bottom-left-radius: 1rem !important;
            border-bottom-right-radius: 1rem !important;
        }
        .test-case{
            opacity:0.8;
        }
    `;

    var styleSheet = document.createElement("style");
    styleSheet.innerText = settings+styles;
    document.head.appendChild(styleSheet);
})();