// ==UserScript==
// @name         “百度简洁工具”
// @namespace
// @version      1.1.5
// @description  能让百度简洁的小插件
// @author       嘎嘎叫的青蛙
// @match        *://*.baidu.com/*
// @icon         https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png
// @grant        none
// @license      MIT
// @namespace https://shequ.codemao.cn/user/12068139
// @downloadURL https://update.greasyfork.org/scripts/455294/%E2%80%9C%E7%99%BE%E5%BA%A6%E7%AE%80%E6%B4%81%E5%B7%A5%E5%85%B7%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/455294/%E2%80%9C%E7%99%BE%E5%BA%A6%E7%AE%80%E6%B4%81%E5%B7%A5%E5%85%B7%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bbuuttoonn = document.querySelector('.s_btn')
    var tteexxtt = document.querySelector('.toindex')
    var ttiittllee = document.querySelector('title')
    var llooggoo = document.querySelector('.index-logo-src')
    var lliinnkk = document.querySelector('.c-link')
    var lliisstt = document.querySelector('.s-hotsearch-wrapper')
    var toplliisstt = document.querySelector('#s-top-left')
    var downlliisstt = document.querySelector('.s-bottom-layer-content')
    var sousoututubbttnn = document.querySelector('.soutu-btn')
    var qqrrccooddeeandsss = document.querySelector('#s_side_wrapper')
    var u1u1u1u = document.querySelector('#u1')
    bbuuttoonn.setAttribute('value','搜索')
    tteexxtt.innerHTML='<a class="toindex" href="/">←</a>'
    ttiittllee.innerHTML='百度'
    llooggoo.setAttribute('style','display:none;')
    lliinnkk.setAttribute('style','color:#ff0000;')
    lliisstt.innerHTML=""
    toplliisstt.innerHTML=""
    downlliisstt.innerHTML=""
    sousoututubbttnn.setAttribute('style','display:none;')
    qqrrccooddeeandsss.setAttribute('style','display:none;')
    u1u1u1u.setAttribute('style','display:none;')
})();