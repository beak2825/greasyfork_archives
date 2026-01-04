// ==UserScript==
// @name ab站背景更改css
// @version 2.0.0-alpha
// @description ab站背景更改css样式表2.0
// @author 桜ミク
// @license MIT
// @namespace https://greasyfork.org/users/599643
// @grant GM_addStyle
// @run-at document-start
// @include *www.bilibili.com/*
// @include *://*.bilibili.com/*
// @include *message.bilibili.com/*
// @include *t.bilibili.com/*
// @include *manga.bilibili.com/*
// @include *live.bilibili.com/blackboard/*
// @include *www.bilibili.com/page-proxy/*
// @include *www.acfun.cn/*
// @include *://*.acfun.cn/*
// ==/UserScript==

(function() {
    let css = "";
    css += `
    li,
        a {
            list-style-type: none;
            text-decoration: none;
        }
        
        #sakuraBackgroundBox {
            width: auto;
            height: auto;
        }
        
        #sakuraBackgroundBox .clickButton {
            position: absolute;
            background-color: #f45a8d;
            border: none;
            font-size: 1em;
            font-weight: 700;
            border-radius: 0px 1rem 0px 0px;
            width: 80px;
            height: 30px;
            bottom: 0;
            left: 0;
            position: fixed;
            z-index: 10000;
        }
        
        #sakuraBackgroundBox .ChangeBox {
            width: 400px;
            height: 360px;
            background-color: skyblue;
            border: none;
            border-radius: 0px 1rem 1rem 0px;
            position: absolute;
            left: 0;
            bottom: 30px;
            text-align: center;
            align-items: center;
            display: none;
            position: fixed;
            z-index: 10000;
        }
        
        #sakuraBackgroundBox .ChangeBox>h4 {
            font-weight: 700;
            color: aqua;
            user-select: none;
        }
        
        #sakuraBackgroundBox .ChangeBox ul {
            width: 90%;
            height: 100px;
            align-items: center;
            text-align: center;
        }
        
        #sakuraBackgroundBox .ChangeBox .defaultImage {
            margin-top: 10px;
            width: 30%;
            height: 100px;
            display: inline-block;
        }
        
        #sakuraBackgroundBox .ChangeBox .diyBox {
            width: 100%;
        }
        
        #sakuraBackgroundBox .ChangeBox .diyBox #diyInput {
            width: 70%;
            border: none;
            border-radius: 0.5rem;
        }
        
        #sakuraBackgroundBox .ChangeBox .diyBox #diySubmit {
            margin-top: 20px;
            width: 20%;
            border: none;
            color: #2ca53c;
            font-weight: 700;
            background-color: rgb(221, 97, 75);
            border-radius: 1rem;
        }
        `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();