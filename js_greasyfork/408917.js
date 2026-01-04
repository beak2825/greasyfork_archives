// ==UserScript==
// @name         大力盘助手v2
// @namespace    https://greasyfork.org/zh-CN/scripts/408917
// @version      2.3
// @description  解除大力盘需要扫码，点击按钮直接跳转百度网盘链接
// @author       linfy
// @match        *://www.dalipan.com/detail/*
// @match        *://dalipan.com/detail/*
// @grant        none
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/408917/%E5%A4%A7%E5%8A%9B%E7%9B%98%E5%8A%A9%E6%89%8Bv2.user.js
// @updateURL https://update.greasyfork.org/scripts/408917/%E5%A4%A7%E5%8A%9B%E7%9B%98%E5%8A%A9%E6%89%8Bv2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var all_scripts = document.scripts;
    var patt = /window.__NUXT__/;
    var l = all_scripts.length;
    for (var i=0; i<l; i++) {
        if (patt.test(all_scripts[i].text) == true) {
            var pan_url = all_scripts[i].text.replace(/.*pan.baidu.com\\u002.s\\u002./, 'https://pan.baidu.com/s/');
            pan_url = pan_url.replace(/".*/,'');
            var button = document.getElementsByClassName('button-inner');
            if (button.length > 0) {
                button[0].innerHTML = '<a href="' + pan_url + '"><button type="button" style="background-color: #f4511e; border: 0; border-radius: 4px; color: white; padding: 6px 10px;text-align: center;font-size: 16px;">前往 百度网盘</button></a>';
            }
            break;
        }
    }
})();