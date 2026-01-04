// ==UserScript==
// @name         ls
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  label studio keymap
// @author       You
// @match        http://192.168.3.222:8080/*
// @match        http://hzdev.ddns.net:8888/*
// @match        https://label.i.ljyun.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3.105
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472235/ls.user.js
// @updateURL https://update.greasyfork.org/scripts/472235/ls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 81) { // Q
            e.preventDefault(); // 阻止默认的操作
            foldingPage(); // 展开/折叠
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 88) { // X
            e.preventDefault(); // 阻止默认的操作
            skipPage(); // 跳过
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 67) { // C
            e.preventDefault(); // 阻止默认的操作
            submitPage(); // 提交
        }
    });

    function foldingPage() {
        console.log('Page QQQ!');
        var elements = document.getElementsByClassName('lsf-button lsf-button_type_text lsf-button_look_primary lsf-button_withIcon lsf-topbar__button');
        if (elements.length > 0) {
            elements[0].click();
            console.log("折叠")
        } else{
            elements = document.getElementsByClassName('lsf-button lsf-button_type_text lsf-button_look_ lsf-button_withIcon lsf-topbar__button');
            if (elements.length > 0) {
                elements[0].click();
                console.log("展开")
            }
        }
    }

    function skipPage() {
        console.log('Page ZZZ!');
        var elements = document.getElementsByClassName('lsf-button lsf-button_look_');
        if (elements.length > 0) {
            elements[6].click();
            console.log("skip")
        }
    }

    function submitPage() {
        console.log('Page CCC!');
        var elements = document.getElementsByClassName('lsf-button lsf-button_look_primary');
        if (elements.length > 0) {
            elements[0].click();
            console.log("submit")
        }
    }
})();