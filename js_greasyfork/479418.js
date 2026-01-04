// ==UserScript==
// @name         windows电脑15.6寸屏幕CC修改B站播放器样式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CC修改B站播放器大小
// @author       com from star xby
// @match        *://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479418/windows%E7%94%B5%E8%84%91156%E5%AF%B8%E5%B1%8F%E5%B9%95CC%E4%BF%AE%E6%94%B9B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/479418/windows%E7%94%B5%E8%84%91156%E5%AF%B8%E5%B1%8F%E5%B9%95CC%E4%BF%AE%E6%94%B9B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("xby----------------------------------------:")
    setTimeout(function() {
        // 在这里添加你想要执行的代码
        document.querySelector('#viewbox_report').style.display = 'none';
        document.querySelector('.left-container').style.width = '1100px';
        document.querySelector('#bilibili-player').style.width = '1100px';
        document.querySelector('#bilibili-player').style.height = '700px';

  }, 2000);

})();