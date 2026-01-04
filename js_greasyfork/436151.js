// ==UserScript==
// @name ab站背景更改css
// @version 1.0.2-alpha
// @description ab站背景更改css样式表
// @author 桜ミク
// @license MIT
// @namespace https://greasyfork.org/users/599643
// @grant GM_addStyle
// @run-at document-start
// @include https://www.bilibili.com/*
// @include *://*.bilibili.com/*
// @include https://message.bilibili.com/*
// @include https://t.bilibili.com/*
// @include https://manga.bilibili.com/*
// @include https://live.bilibili.com/blackboard/*
// @include https://www.bilibili.com/page-proxy/*
// @include https://www.acfun.cn/*
// @include *://*.acfun.cn/*
// ==/UserScript==

(function() {
    let css = "";
    css += `
    li {
        list-style-type: none;
    }
    
    .SakuraBackground {
        background-repeat: no-repeat;
        bckground-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
        zoom: 1;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-background-size: cover;
        /z-index: -1;

    }
    
    .sakuraSpanRoller {
        user-select: none;
        width: auto;
        font-size: 1.4em;
        font-weight: bold;
        left: 0;
        bottom: 0;
        z-index: 1001;
        background-color: rgb(45, 209, 173, 0.5);
        border-top-right-radius: 1vw;
        position: fixed;
    }
    
    .divBackgroundSettingsBox {
        background-color: rgba(255, 192, 203, 0.911);
        border-top-right-radius: 2vw;
        z-index : 1000;
        left: 0px;
        bottom: 0px;
        width: auto;
        height: 240px;
        position: fixed;
        display: none;
    }
    
    .divBackgroundSettingsBox .firstBox {
        width: 100%;
        height: auto;
    }
    
    .divBackgroundSettingsBox .firstBox .changeBoxOne span {
        user-select: none;
    }
    
    .divBackgroundSettingsBox .firstBox .changeBoxOne .backgroundDefaultClickToChange {
        display: flex;
    }
    
    .divBackgroundSettingsBox .firstBox .changeBoxOne .backgroundDefaultClickToChange li {
        margin: 0 10px 0 0;
    }
    
    .divBackgroundSettingsBox .firstBox .changeBoxOne .backgroundDefaultClickToChange li img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }`;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();