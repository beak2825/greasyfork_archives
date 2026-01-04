// ==UserScript==
// @name         资源网插件
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  实现资源采集网站的m3u8播放。
// @author       xiaoya123
// @require      https://unpkg.com/hls.js@latest
// @license      Disclose source
// @match        *://cj.lzcaiji.com/*
// @match        *://www.lzizy7.com/*
// @match        *://tkzy1.com/*
// @match        *://yhzy.cc/*
// @include      /.*hongniu.*/
// @include      /.*lzizy.*/
// @include      /.*ckzy.*/
// @include      /.*wujinzy.*/
// @include      /.*wolongzy.*/
// @include      /.*wlzyw.*/
// @include      /.*jinying.*/
// @include      /.*jyzy.*/
// @include      /.*guangsuzy.*/
// @include      /.*23\.224\.101\.30.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzcaiji.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487975/%E8%B5%84%E6%BA%90%E7%BD%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/487975/%E8%B5%84%E6%BA%90%E7%BD%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 按钮样式style
    var style = document.createElement('style');
    var theHead = document.head || document.getElementsByTagName('head')[0];
    style.appendChild(document.createTextNode('#main{width:100%;display:flex;flex-direction:column}#main .left{display:flex;flex-wrap:wrap}button{background-color:#1795bb;border-radius:10px;border:0;color:white;padding:8px 16px;text-align:center;text-decoration:none;font-size:16px;margin:4px 2px;cursor:pointer}video{width:100%}#dataTitle{text-align: center;font-size: 30px;color: blue;padding:25px}'));
    theHead.appendChild(style);

    let contentMap = [
        'document.querySelectorAll("#content")[1]',
        'document.querySelectorAll(".playBox")[1]',
        'document.querySelectorAll("#playlist")[0]',
        'document.querySelectorAll(".dy-collect")[0]'
    ]
    let rag_href = /https*.{0,100}\.[Mm]3[Uu]8/g;
    let str = "";
    let content;
    for (let i = 0; i < contentMap.length; i++) {
        content = eval(contentMap[i]);
        if (undefined != content) {
            break;
        }
    }
    // 获取a标签中的网址
    let href_list = content.innerText;
    findHref(href_list);
    content.innerHTML = '<div id="dataTitle"></div><div id="main"><div class="dataRight"><video id="video" controls preload="auto"></video></div><div class="left" id="buttonContainer"></div></div>';
    function findHref(html) {
        let list = html.match(rag_href);
        if (list === null) {
            str = "链接为空！";
            return;
        }
        let i=0;
        list.forEach(k => {
            str += `<button data-href="${k}">第${i+=1}集</button>`;
        })
    }
    document.querySelector('#main .left').innerHTML = str;
    var video = document.getElementById('video');
    let videoHLS = {
        // 启用多线程缓冲
        enableWorker: true,
        // 禁用ABR（避免码率切换影响缓冲）
        enableSoftwareAES: true,
        // 设置极高的缓冲限制
        maxBufferLength: 3600, // 1小时
        maxMaxBufferLength: 10800, // 3小时
        backBufferLength: 900, // 15分钟的后向缓冲区

        // 超时设置
        fragLoadingTimeOut: 60000, // 片段加载超时60秒
        manifestLoadingTimeOut: 30000, // 清单加载超时30秒
        levelLoadingTimeOut: 60000, // 级别加载超时60秒

        // 重试设置
        fragLoadingRetryDelay: 1000, // 片段加载重试延迟1秒
        fragLoadingMaxRetry: 10, // 片段加载最大重试次数
        manifestLoadingRetryDelay: 1000,
        manifestLoadingMaxRetry: 10,
        levelLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 10,

        // 缓冲策略
        maxBufferSize: 0, // 0表示无限制
        maxBufferHole: 0.5, // 允许的缓冲空洞大小

        // 启动设置
        startLevel: -1, // 自动选择最佳质量
        autoStartLoad: true, // 自动开始加载
        startPosition: -1, // 从开始位置播放

        // 性能优化
        stretchShortVideoTrack: true,
        forceKeyFrameOnDiscontinuity: true,

        // 网络优化
        lowLatencyMode: false, // 关闭低延迟模式以获得更好缓冲
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10
    };
    var currentHls;
    function play(url) {
        if (Hls.isSupported()) {
            // 如果 Hls 实例已存在，则重用它
            if (currentHls) {
                currentHls.loadSource(url);
                currentHls.attachMedia(video);
            } else {
                // 否则，创建新的 Hls 实例
                currentHls = new Hls(videoHLS);
                currentHls.loadSource(url);
                currentHls.attachMedia(video);
            }
            currentHls.on(Hls.Events.MANIFEST_PARSED,() => {
                video.playbackRate = 2;
                video.play();
            });
        }
    }
    // 在事件监听器外部获取 #dataTitle 元素
    let dataTitle = document.querySelector("#dataTitle");

    // 如果您的所有按钮都在某个父元素中，例如一个叫做 #buttonContainer 的 div
    let buttonContainer = document.querySelector("#buttonContainer");

    buttonContainer.addEventListener('click', function (event) {
        let url=event.target.getAttribute('data-href');
        console.log("url---"+url);
        // 检查确保点击的是按钮
        if (url) {
            dataTitle.innerText = event.target.innerText;
            play(url);
        }
    });

})();