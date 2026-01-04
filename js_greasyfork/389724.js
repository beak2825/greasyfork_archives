// ==UserScript==
// @name         youtube - 自动获该页面下的所有视频链接地址
// @namespace    http://tuite.fun
// @version      1.0
// @description  自动获该页面下的所有视频链接地址
// @author       tuite
// @match        https://www.youtube.com/channel/*/videos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389724/youtube%20-%20%E8%87%AA%E5%8A%A8%E8%8E%B7%E8%AF%A5%E9%A1%B5%E9%9D%A2%E4%B8%8B%E7%9A%84%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/389724/youtube%20-%20%E8%87%AA%E5%8A%A8%E8%8E%B7%E8%AF%A5%E9%A1%B5%E9%9D%A2%E4%B8%8B%E7%9A%84%E6%89%80%E6%9C%89%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    var urls = [];
    var urlsStr = '';
    var list = document.querySelectorAll('ytd-grid-video-renderer div[id="meta"] a');
    for (var z in list) {
        if ( !! list[z].href) {
            urls.push(list[z].href)
    		urlsStr += ('\n\n' + list[z].href);
        }
    }
    var jsonStr = JSON.stringify(urls) + '\n\n\n\n\n\n' + urls;
    var mimeType = "text/plain";
    var btn = document.createElement("a");
    btn.style.cssText = "display: block; position: fixed; right:0; top: 40%; font-size: 20px;";
    btn.href = "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(jsonStr);
    btn.innerHTML = "下载视频列表";
    btn.download="code.txt";
    document.getElementsByTagName('ytd-app')[0].appendChild(btn);
})();