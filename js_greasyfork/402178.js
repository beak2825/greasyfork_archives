// ==UserScript==
// @name         考试题库网显示跳转答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       LiuYuHong
// @grant        none
// @match        *://www.ppkao.com/tiku/shiti/*
// @include      *://www.ppkao.com/tiku/shiti/*
// @namespace    https://liuyuhong.ml
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/402178/%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E7%BD%91%E6%98%BE%E7%A4%BA%E8%B7%B3%E8%BD%AC%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/402178/%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E7%BD%91%E6%98%BE%E7%A4%BA%E8%B7%B3%E8%BD%AC%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var url = window.location.href
     var reg = /[1-9][0-9]*/g
     var num = url.match(reg)
     window.location.href = 'https://newapi.ppkao.com/mnkc/tiku/?id='+num
})();