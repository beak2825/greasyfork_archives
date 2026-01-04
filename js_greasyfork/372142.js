// ==UserScript==
// @name         segmentfault.com编辑面板优化
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  编辑高度提高到800px，历史版本添加滚动条，屏蔽广告
// @author       https://github.com/1uokun
// @match        https://segmentfault.com/n/*/edit
// @match        https://segmentfault.com/record
// @match        https://segmentfault.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372142/segmentfaultcom%E7%BC%96%E8%BE%91%E9%9D%A2%E6%9D%BF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/372142/segmentfaultcom%E7%BC%96%E8%BE%91%E9%9D%A2%E6%9D%BF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var defaultHeight = document.documentElement.clientHeight
    /**
    var observer = new ResizeObserver(function(entries) {
        entries.forEach(function(entry) {
            defaultHeight = entry.contentRect.height
        });
    });
    observer.observe(noteText);
    **/

    var _url = window.location.href;
    //编辑面板高度auto
    if(_url.indexOf('record')>-1 || _url.indexOf('edit')>-1){
        noteText.style.minHeight = defaultHeight+'px'
        revisionList.style.maxHeight = defaultHeight+'px'
        revisionList.style.overflowY = 'auto'
    }else {
    //去广告
        let arr = Array.prototype.slice.call(document.querySelectorAll('a'))
        arr.map(a=>{
            if(a.href.indexOf('sponsor')>-1){
                a.style.display = 'none'
            }
            if(a.href.indexOf('googleyndication')>-1){
                a.style.visibility='hidden'
            }
        })
        document.querySelector('ins').style.visibility='hidden'
    }


    //去iframe类型(google)的广告
    window.addEventListener('DOMContentLoaded',function(){
        if($('iframe')){
            window.stop()
        }
    })
    if($('iframe')){
        window.stop()
    }
})();