// ==UserScript==
// @name         Coursera Translator
// @namespace    jiaowobanxianer.com
// @version      1.0
// @description  coursera课程翻译
// @author       JiaoWoBanXianEr
// @match        https://www.coursera.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463270/Coursera%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/463270/Coursera%20Translator.meta.js
// ==/UserScript==
//字幕颜色RGB
let color = '#ffff22';
//字幕背景颜色ARGB
let bgColor = "#7f7f7f7f";
//字幕大小PX
let fontSize = 60
//字幕距底部距离Percent
let up = 10;


let t;

function translate() {
    if (document.getElementById('sub_container') == null) {
        init();
    }
    if (t == null) {
        return;
    }
    let text = document.querySelector('.rc-Phrase.active.css-ugczj4');
    if (text == null) {
        return;
    }
    t.textContent = text.outerText;
}
var i = setInterval(function () { translate(); }, 100);

function init() {
    if (document.querySelector('.vjs-react.c-video.vjs-fluid.vjs-circle-play-centered') == null) { return; }
    t = document.createElement("div");
    t.id = "sub_container";
    t.style.position = 'absolute';
    t.style.margin = 'auto';
    t.style.textAlign = 'center';
    t.style.zIndex = 99;
    t.style.height = fontSize + 'px';
    t.style.left = 0;
    t.style.right = 0;
    t.style.top = up + '%';
    t.style.backgroundColor = bgColor;
    t.style.fontSize = fontSize + 'px';
    t.style.color = color;
    //t.innerHTML = '<div id="sub_container" style="z-index: 99; position: absolute; top: 10%; left: auto; right: auto; height: 60px; margin: auto; text-align: center; background-color: rgb(127, 127, 127); font-size: 60px; color: rgb(255, 255, 34);">初始化</div>'
    document.querySelector('.vjs-react.c-video.vjs-fluid.vjs-circle-play-centered').appendChild(t);
}
(function () {
    'use strict';

    // Your code here...
})();