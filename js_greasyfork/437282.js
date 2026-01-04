// ==UserScript==
// @name         向 latexlive.com 添加复制按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  向 latexlive.com 添加复制按钮，方便快速复制 latex
// @author       Cesaryuan
// @match        https://*.latexlive.com/*
// @icon         https://www.google.com/s2/favicons?domain=latexlive.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437282/%E5%90%91%20latexlivecom%20%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437282/%E5%90%91%20latexlivecom%20%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // create a new button
    var btn = document.createElement('button');
    btn.innerHTML = '复制';
    // add class to btn
    btn.className = 'btn btn-light theme-fill';
    // set id
    btn.id = 'copy-btn';
    // add click handler
    btn.onclick = function () {
        // get the selected element
        var selected = document.querySelector('#txta_input');
        // copy the text
        navigator.clipboard.writeText(selected.value);
        toast('复制成功');
    };
    var CONTAINER = "#wrap_immediate > row > div.col-5.col-sm-5.col-md-5.col-lg-5.col-xl-5";
    // wait container appear and add btn
    var interval = setInterval(function () {
        var wrap = document.querySelector(CONTAINER);
        if (wrap) {
            wrap.appendChild(btn);
            clearInterval(interval);
        }


    }, 100);

    function toast(msg) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = msg;
        toast.style.position = 'fixed';
        toast.style.bottom = '10px';
        toast.style.right = '10px';
        toast.style.zIndex = '9999';
        toast.style.backgroundColor = '#fff';
        toast.style.color = '#000';
        toast.style.padding = '10px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 0 5px #000';
        toast.style.fontSize = '16px';
        toast.style.fontWeight = 'bold';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '1';
        }, 100);
        setTimeout(function () {
            toast.style.opacity = '0';
        }, 2000);
        setTimeout(function () {
            toast.remove();
        }, 3000);
    }
})();