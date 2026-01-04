// ==UserScript==
// @name         happy read webpack-book
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description clear modal!
// @author       houn
// @match        http://webpack.wuhaolin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369736/happy%20read%20webpack-book.user.js
// @updateURL https://update.greasyfork.org/scripts/369736/happy%20read%20webpack-book.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn = document.createElement('button');
    btn.innerText = 'clear';
    btn.id = 'clear-happy';
    btn.style.position = 'fixed';
    btn.style.right = '10px';
    btn.style.top = '10px';
    document.body.appendChild(btn);
    document.querySelector('#clear-happy').onclick = function () {
        document.querySelector('.gitbook-plugin-modal').style.width= '0px';
        document.querySelector('.gitbook-plugin-modal-content').style.padding= '0px';
    }
    let timeCount = setInterval(function() {
        if (document.querySelector('.gitbook-plugin-modal')) {
            document.querySelector('.gitbook-plugin-modal').style.width= '0px';
            document.querySelector('.gitbook-plugin-modal-content').style.padding= '0px';
            clearInterval(timeCount);
        }
    }, 200)
})();