// ==UserScript==
// @name         自动领取喵币
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动领取淘宝的喵币，PC端需要进入开发者工具调整为手机模式
// @author       Lee
// @match        https://pages.tmall.com/wow/a/act/tmall/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386023/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%96%B5%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/386023/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E5%96%B5%E5%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.write('<iframe width=100% height=100% frameborder=0 scrolling=yes>');
    frames[0].location.href = location.href;
    var idx = 1; var o = document.createElement('div');
    o.innerHTML = '第1次'; o.setAttribute('id', 'setTimes');
    o.setAttribute('style', 'text-align: center;font-size: 14px;background: #000;color: #fff;padding: 10px 0;');
    document.body.insertBefore(o, document.body.childNodes[0]);
    var timer = setInterval(function () {
        if (idx > 70) { clearInterval(timer);
        document.getElementById('setTimes').innerHTML = '已结束'
        }
        else
        {
            document.getElementById('setTimes').innerHTML = '第' + idx + '次';
            t()
        }
    }, 13000);
    function t() {
        setTimeout(function () {
            frames[0].document.getElementsByClassName('svelte-qr71gg')[1].click();
            setTimeout(function () {
                frames[0].location.reload()
            }, 1000)
        }, 12000);
        idx++
    }
    t();
})();