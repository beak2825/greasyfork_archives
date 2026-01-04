// ==UserScript==
// @name         环球网/360doc自动展开全文
// @namespace    http://tampermonkey.net/
// @version      0.5 20200225
// @description  展开全文
// @author       Joblee
// @match        *://*.huanqiu.com/a/*
// @match        *://*.360doc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389431/%E7%8E%AF%E7%90%83%E7%BD%91360doc%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/389431/%E7%8E%AF%E7%90%83%E7%BD%91360doc%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

//环球网自动展开全文
var autoclick = setInterval(function(){
        // 模拟点击“阅读全文”
        document.getElementById('more').click()
        $('body').removeClass('articleMaxH').click()
}, 100);

//360doc自动展开全文
var autoclick = setInterval(function onclick(event) {
  $('body').removeClass('articleMaxH')
}, 100);
