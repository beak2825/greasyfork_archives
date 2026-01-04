// ==UserScript==
// @name         中小学党校、学习公社五倍速学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不要看视频播放速度，看学习进度变化！！！
// @author       moxiaoying
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1198733
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471238/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%85%9A%E6%A0%A1%E3%80%81%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E4%BA%94%E5%80%8D%E9%80%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/471238/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%85%9A%E6%A0%A1%E3%80%81%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E4%BA%94%E5%80%8D%E9%80%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ajaxHooker.hook(request => {
        if (request.url.includes('studyLog.do')&& request.method=='POST'){
            //debugger
            request.data += "&studyMins=10"
            //const a = JSON.parse(request.data)
            // request.data = JSON.stringify(a)
            // alert('aaa')
        }
    });
    // Your code here...
})();