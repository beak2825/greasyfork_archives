// ==UserScript==
// @name         柒番美化
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  柒番（www.qifun.cc）个人向美化。
// @author       CTBlue
// @license      MIT
// @match        https://www.qifun.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qifun.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534880/%E6%9F%92%E7%95%AA%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534880/%E6%9F%92%E7%95%AA%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 顶栏阴影
    const style = document.createElement('style');
    style.textContent =`.site-header::before {box-shadow:none!important;}`;
    document.head.appendChild(style);
    document.querySelector('.site-header .search').style.background = '#F2F2F8';

    document.querySelector('.site-header').style.backgroundColor = '#F2F2F8';
    document.querySelector('.site-header').style.boxShadow = '5px 5px 10px rgba( 48, 64,130, 0.3)';

    const lines = document.querySelectorAll('.lines>div');
    lines.forEach(function (imgBox) {
        imgBox.style.background = '#000000';
    });

    // 顶栏字体颜色
    const navAs = document.querySelectorAll('.nav-item a');
    navAs.forEach(function (navA) {
        navA.style.color = 'black';
    });

    // 整体背景
    document.body.style.background = '#F2F2F8';

    // 图片
    const imgBoxElements = document.querySelectorAll('.img-box');
    imgBoxElements.forEach(function (imgBox) {
        imgBox.style.borderRadius = '8px';
        imgBox.style.border = '1px solid gray';
    });

    const thumbBoxElements = document.querySelectorAll('.thumb');
    thumbBoxElements.forEach(function (imgBox) {
        imgBox.style.borderRadius = '8px';
        imgBox.style.border = '1px solid gray';
    });

    // 滚动条
    const style1 = document.createElement('style');
    style1.textContent = `
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar - thumb {
            background - color: #888;
            border - radius: 4px;
        }
        ::-webkit-scrollbar - track {
            background - color: #f1f1f1;
        }
        `;
    document.head.appendChild(style1);

})();