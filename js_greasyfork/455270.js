// ==UserScript==
// @name         “百度变千度”
// @namespace
// @version      1.0.7
// @description  能把百度变成“千度”的小插件
// @author       嘎嘎叫的青蛙
// @match        *://*.baidu.com/*
// @icon         http://www.codekpy.site/qiandu.png
// @grant        none
// @license      MIT
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/455270/%E2%80%9C%E7%99%BE%E5%BA%A6%E5%8F%98%E5%8D%83%E5%BA%A6%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/455270/%E2%80%9C%E7%99%BE%E5%BA%A6%E5%8F%98%E5%8D%83%E5%BA%A6%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bbuuttoonn = document.querySelector('.s_btn');
    var tteexxtt = document.querySelector('.toindex');
    var ttiittllee = document.querySelector('title');
    var llooggoo = document.querySelector('.index-logo-src');
    var lliinnkk = document.querySelector('.c-link');
    bbuuttoonn.setAttribute('value','千度一下');
    tteexxtt.innerHTML='<a class="toindex" href="/">千度首页</a>';
    ttiittllee.innerHTML='千度一下，你就知道';
    llooggoo.setAttribute('src','http://www.codekpy.site/qiandu.png');
    lliinnkk.setAttribute('style','color:#ff0000;');
    console.log('本油猴插件由嘎嘎叫的青蛙制作')
    console.log('')
    console.log('本油猴插件由嘎嘎叫的青蛙制作')
    console.log('')
    console.log('本油猴插件由嘎嘎叫的青蛙制作')
    console.log('')
    console.log('本油猴插件由嘎嘎叫的青蛙制作')
    console.log('')
    console.log('本油猴插件由嘎嘎叫的青蛙制作')
    console.log('')
    // Your code here...
})();