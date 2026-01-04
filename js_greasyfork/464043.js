// ==UserScript==
// @name         钢琴吧当前页面打开
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  将钢琴吧下的所有页面的链接设置为当前页面打开，而不是新增一个标签页
// @author       yehuda
// @icon         http://www.tan8.com/static/tan8/style/img/Icon-80@2x.png
// @match        http://www.tan8.com/*
// @match      *://http://www.tan8.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464043/%E9%92%A2%E7%90%B4%E5%90%A7%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/464043/%E9%92%A2%E7%90%B4%E5%90%A7%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        links[i].removeAttribute('target');
    }
    document.addEventListener('click', function(event) {
        var target = event.target;
        if (target.tagName.toLowerCase() === 'a' && target.getAttribute('href')) {
            event.preventDefault();
            location.href = target.getAttribute('href');
        }
    });
})();
