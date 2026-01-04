// ==UserScript==
// @name         91tvg 低配版屏蔽广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  低配去广告 浏览舒服即可
// @author       乐心网友
// @match        *://*.91tvg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91tvg.com
// @grant        none
// @license      无
// @downloadURL https://update.greasyfork.org/scripts/442006/91tvg%20%E4%BD%8E%E9%85%8D%E7%89%88%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/442006/91tvg%20%E4%BD%8E%E9%85%8D%E7%89%88%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
/**
91tvg 广告真恶心啊 该脚本只是实现将广告元素移除勉强去除广告功能
*/
(function() {
    'use strict';

    var t1 = window.setInterval(function() {
        var cl =document.querySelector('.a_cn');
        if(cl != null){
            cl.remove();
        }

        var note = document.querySelector('#note');
        if(note != null){
            note.previousElementSibling.remove();
            note.remove();
        }
        if(note == null && cl == null){
            console.log("完事");
            window.clearInterval(t1)
        }
    },100)

})();