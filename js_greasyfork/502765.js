// ==UserScript==
// @name         百度搜狗必应添加秘塔搜索面板
// @namespace    meta_right_span
// @version      1.0
// @description  在百度、搜狗、必应的搜索结果页面加载完后，在右侧添加秘塔搜索，只支持pc端。
// @author       Your Name
// @match        *://www.baidu.com/*
// @match        *://www.sogou.com/*
// @match        *://*.bing.com/*
// @match        *://metaso.cn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502765/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%8B%97%E5%BF%85%E5%BA%94%E6%B7%BB%E5%8A%A0%E7%A7%98%E5%A1%94%E6%90%9C%E7%B4%A2%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/502765/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%8B%97%E5%BF%85%E5%BA%94%E6%B7%BB%E5%8A%A0%E7%A7%98%E5%A1%94%E6%90%9C%E7%B4%A2%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addIframe() {
    const url = location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
        let targetDiv = document.getElementById('content_right');
        let wdValue = params.get('wd');
        if(location.href.indexOf("bing.com")>-1){
            targetDiv = document.getElementById('b_context');
            wdValue = params.get('q');
        }else if(location.href.indexOf("sogou.com")>-1){
            targetDiv = document.getElementById('right');
            wdValue = params.get('query');
        }
         if (targetDiv) {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://icon2.yjllq.com/meta.php?q='+wdValue;
            iframe.style.width = '100%';
            iframe.style.height = '500px';
            iframe.style.border = 'none';
            iframe.style.boxShadow = '0px -1px 5px #e8e8e8';

            targetDiv.insertBefore(iframe, targetDiv.firstChild);
        }
    }
if(location.href.indexOf('metaso.cn')>-1){
    debugger;
    if(window.top!=window){
      setInterval(()=>{ document.querySelector(".left-menu").style.display="none";},500)
    }

}else{
    // Wait for the DOM to fully load
    addIframe();
}

})();
