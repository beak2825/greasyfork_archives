// ==UserScript==
// @name         bilibili 播放视频章节宽度
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  播放视频章节宽度
// @author       You
// @match         *://*.bilibili.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443401/bilibili%20%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E7%AB%A0%E8%8A%82%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/443401/bilibili%20%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E7%AB%A0%E8%8A%82%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==
/* global $, jQuery */

(function() {
    'use strict';
    /**
     chrome控制台引入jquery
     var importJs=document.createElement('script');importJs.setAttribute("type","text/javascript");
     importJs.setAttribute("src", "https://cdn.bootcdn.net/ajax/libs/jquery/1.8.0/jquery-1.8.0.min.js");
     document.getElementsByTagName("head")[0].appendChild(importJs);
    **/

    var itemLength=$('.video-episode-card').length;
    var height= itemLength * 40 > 750 ? 750 :itemLength * 40;

    var itemmultiLength=$('.multi-page-v1.small-mode .cur-list .list-box li').length;
    var heightmulti= itemmultiLength * 40 > 750 ? 750 :itemmultiLength * 40;

    var style = document.createElement('style')
    style.textContent = [
        'div.video-sections-content-list{max-height:'+ (height) +'px !important;}',
        'div.video-sections-content-list{height:'+ (height) +'px !important;}',
        'div.base-video-sections-v1{width:145% !important;}',

        '.cur-list{max-height:'+ (heightmulti) +'px !important;}',
        'div.video-episode-card__info-title{width:500px !important;}',
        '#multi_page{width:600px !important;}',
        '.multi-page-v1.small-mode .cur-list .list-box li{width:580px !important;}'
    ].join('');
    document.head.appendChild(style);
    $(".bili-video-card__info--ad").parent().parent().parent().parent().parent().parent().parent().remove();
    // 定义一个观察器
    const observer = new MutationObserver(function(mutationsList) {
        // 对每个突变进行处理
        mutationsList.forEach(mutation => {
            // 重置或再次应用你的逻辑
            processDOMChanges();
        });
    });

    // 配置观察器选项
    const config = { childList: true, subtree: true };

    // 选择要观察的DOM节点，这里以body为例，根据实际情况调整
    const targetNode = document.body;

    // 开始观察目标节点
    observer.observe(targetNode, config);

    // 初始化执行一次
    processDOMChanges();

    function processDOMChanges() {
        // 原脚本逻辑
        $(".bili-video-card__info--ad").parent().parent().parent().parent().parent().parent().parent().remove();
    }

    // 当脚本卸载时，停止观察
    window.addEventListener('beforeremove', function(e) {
        if (e.target === document.getElementById('your-script-id')) { // 替换 'your-script-id' 为你的脚本ID（如果有的话）
            observer.disconnect();
        }
    }, true);
})();