// ==UserScript==
// @name         cc直播弹幕透明
// @namespace    https://github.com/Lycreal/UserScripts
// @version      0.1.1
// @description  将网易cc直播间的弹幕透明度设置为50%
// @author       Lycreal
// @match        *://cc.163.com/*
// @supportURL   https://github.com/Lycreal/UserScripts/issues
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447227/cc%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E9%80%8F%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/447227/cc%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E9%80%8F%E6%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let codeBlockStyle = document.createElement('style');
    codeBlockStyle.innerText = `
      .cc-h5player-container .comment-canvas{
        opacity: 0.5;
      }`;
    document.body.appendChild(codeBlockStyle);
})();
