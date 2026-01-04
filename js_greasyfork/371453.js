// ==UserScript==
// @name         绕过Unipus的插件检测
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.1
// @description  通过更改变量值来禁用Unipus的检测
// @author       BackRunner
// @include      *://nhce*.edu*/login/*
// @include      *://nhce*.edu*/book/*
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371453/%E7%BB%95%E8%BF%87Unipus%E7%9A%84%E6%8F%92%E4%BB%B6%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371453/%E7%BB%95%E8%BF%87Unipus%E7%9A%84%E6%8F%92%E4%BB%B6%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    console.log("plugin mod script loaded");
    var chivox = 1;
    window.chivox = chivox;
    console.log("plugin check moded #1");
    if (typeof("learnXcheck") === undefined && learnXcheck){
        console.log("plugin check moded #2");
        learnXcheck=false;
    }
    var learnXcheck = false;
    window.learnXcheck = learnXcheck = false;
})();