// ==UserScript==
// @name         屏蔽熊猫令&屏蔽顶部底部弹幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽严重遮住视线的熊猫令.新增屏蔽底部和顶部固定弹幕,不需要的删除第22~25行.
// @author       lampwu
// @match        https://www.panda.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36737/%E5%B1%8F%E8%94%BD%E7%86%8A%E7%8C%AB%E4%BB%A4%E5%B1%8F%E8%94%BD%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/36737/%E5%B1%8F%E8%94%BD%E7%86%8A%E7%8C%AB%E4%BB%A4%E5%B1%8F%E8%94%BD%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
};
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
            .h5player-plugins {
               display: none;
               visibility: hidden;
            }
            div[style*="left: 50%"] {
               display: none;
               visibility: hidden;
            }

          */
    });
    var head = document.querySelector('head');
    head.appendChild(style);
};
loadCss();