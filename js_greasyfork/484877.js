// ==UserScript==
// @name         apple的Mac bookpro 15.6寸浏览器CC修改B站播放器样式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CC修改B站播放器大小
// @author       com from star xby
// @match        *://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484877/apple%E7%9A%84Mac%20bookpro%20156%E5%AF%B8%E6%B5%8F%E8%A7%88%E5%99%A8CC%E4%BF%AE%E6%94%B9B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484877/apple%E7%9A%84Mac%20bookpro%20156%E5%AF%B8%E6%B5%8F%E8%A7%88%E5%99%A8CC%E4%BF%AE%E6%94%B9B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("xby----------------------------------------:")
    setTimeout(function() {
        // 在这里添加你想要执行的代码
        document.querySelector('#viewbox_report').style.display = 'none';
        document.querySelector('.left-container').style.width = '1250px';
        document.querySelector('#bilibili-player').style.width = '1250px';
        document.querySelector('#bilibili-player').style.height = '875px';
        document.querySelector('#arc_toolbar_report').style.marginTop = '280px';
  }, 5000);

})();