// ==UserScript==
// @name         DDRK跳过广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DDRK.com 低端影视 跳过广告 去除ADBlock检测 跳过10秒广告 添加下载按钮
// @author       Birkhoff
// @match        https://ddrk.me/*
// @icon         https://www.google.com/s2/favicons?domain=ddrk.me
// @grant        none
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/coco-message@1.1.12/coco-message.js
// @require      https://unpkg.com/clipboard@2.0.8/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/432977/DDRK%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/432977/DDRK%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const skipVideoAD = () => {
        const video = document.getElementsByTagName('video')[0];
        if (!video) {
            clearInterval(window.vInterval);
            return ;
        }
        if (video && video.duration>=11 && video.duration<=12) {
            video.currentTime = video.duration;
            video.play();
            // clearInterval(window.vInterval);
        }
        return ;
    };
    $(document).ready(() => {
        // 手动注入cocoMessage样式
        var style = "[class|=coco],[class|=coco]::after,[class|=coco]::before{box-sizing:border-box;outline:0}.coco-msg-progress{width:14px;height:14px}.coco-msg__circle{stroke-width:2;stroke-linecap:square;fill:none;transform:rotate(-90deg);transform-origin:center}.coco-msg-stage:hover .coco-msg__circle{-webkit-animation-play-state:paused!important;animation-play-state:paused!important}.coco-msg__background{stroke-width:2;fill:none}.coco-msg-stage{position:fixed;top:20px;left:50%;width:auto;transform:translate(-50%,0);z-index:3000}.coco-msg-wrapper{position:relative;left:50%;transform:translate(-50%,0);transition:height .25s ease-out,padding .25s ease-out;transition:height .35s ease-out,padding .35s ease-out;padding:8px 0;will-change:transform,opacity}.coco-msg-content,.coco-msg-icon,.coco-msg-wait{display:inline-block}.coco-msg-icon{position:relative;width:13px;height:13px;border-radius:100%;display:flex;justify-content:center;align-items:center;opacity:.8}.coco-msg-icon svg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:11px;height:11px;box-sizing:content-box}.coco-msg-wait{width:20px;height:20px;position:relative}.coco-msg-wait svg{position:absolute;top:50%;right:-4px;transform:translate(0,-50%);fill:#b3b9b9}.coco-msg-close{width:16px;height:16px}.coco-msg-content{margin:0 10px;min-width:220px;text-align:left;font-size:14px;font-weight:400}.coco-msg.error .coco-msg-icon,.coco-msg.info .coco-msg-icon,.coco-msg.success .coco-msg-icon,.coco-msg.warning .coco-msg-icon{background-color:currentColor}.coco-msg{padding:13px 25px;border-radius:2px;position:relative;left:50%;transform:translate(-50%,0);display:flex;align-items:center}.coco-msg.info,.coco-msg.loading{color:#635f6b;background-color:#f3f3f4;box-shadow:0 0 1px 0 rgba(239,238,240,.3)}.coco-msg.success{color:#68c43b;background-color:#f0faeb;box-shadow:0 0 1px 0 rgba(145,194,126,.3)}.coco-msg.warning{color:#be820a;background-color:#faf4e1;box-shadow:0 0 1px 0 rgba(212,198,149,.3)}.coco-msg.error{color:#f74e60;background-color:#fee2e5;box-shadow:0 0 1px 0 rgba(218,163,163,.3)}.coco-msg.loading .coco-msg-icon{background-color:transparent}@keyframes coco-msg__circle{0%{stroke:#b3b9b9;stroke:currentColor}to{stroke:#b3b9b9;stroke:currentColor;stroke-dasharray:0 100}}.coco-msg_loading{flex-shrink:0;width:20px;height:20px;position:relative}.coco-msg-circular{-webkit-animation:coco-msg-rotate 2s linear infinite both;animation:coco-msg-rotate 2s linear infinite both;transform-origin:center center;height:18px!important;width:18px!important}.coco-msg-path{stroke-dasharray:1,200;stroke-dashoffset:0;stroke:currentColor;-webkit-animation:coco-msg-dash 1.5s ease-in-out infinite;animation:coco-msg-dash 1.5s ease-in-out infinite;stroke-linecap:round}@-webkit-keyframes coco-msg-rotate{100%{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes coco-msg-rotate{100%{transform:translate(-50%,-50%) rotate(360deg)}}@-webkit-keyframes coco-msg-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes coco-msg-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}100%{stroke-dasharray:89,200;stroke-dashoffset:-124px}}.coco-msg-pointer{cursor:pointer}.coco-msg-fade-in{-webkit-animation:coco-msg-fade .22s ease-out both;animation:coco-msg-fade .22s ease-out both}.coco-msg-fade-out{animation:coco-msg-fade .22s linear reverse both}@-webkit-keyframes coco-msg-fade{0%{opacity:0;transform:translate(-50%,0)}to{opacity:1;transform:translate(-50%,0)}}@keyframes coco-msg-fade{0%{opacity:0;transform:translate(-50%,-80%)}to{opacity:1;transform:translate(-50%,0)}}";
        var stylesheet=document.createElement("style");
        stylesheet.innerText = style;
        document.head.appendChild(stylesheet);
        // 添加获取链接按钮
        const aimP = $($('video').parents()[1]).siblings('p')[0];
        if (aimP) {
            aimP.innerHTML = aimP.innerHTML + '<span style="float:right;color:deeppink;margin-right:10px; cursor: pointer; user-select: none; " id="rh-getlink">获取链接</span>';
            const rhGetLink = $('#rh-getlink');
            console.log(rhGetLink);
            rhGetLink.click(() => {
                const linkText = document.getElementsByTagName('video')[0].src;
                if (linkText) {
                    console.log(linkText);
                    const clipboard = new ClipboardJS('#rh-getlink', {text: function (trigger) {return linkText;}});
                    cocoMessage.success('视频链接已经复制到剪切板');
                } else {
                    cocoMessage.error('请先播放视频');
                }
            });
        }
        // 启动定时器检查广告状态
        const vInterval = setInterval(() => {skipVideoAD()}, 100);
        window.vInterval = vInterval;
    });
})();
