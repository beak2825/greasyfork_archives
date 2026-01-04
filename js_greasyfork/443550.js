// ==UserScript==
// @name         B站 WASM 软解动态屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  动态屏蔽哔哩哔哩 WASM HEVC 解码器（需要浏览器支持HEVC才管用）
// @author       TGSAN
// @exclude      https://live.bilibili.com/*
// @exclude      http://live.bilibili.com/*
// @match        https://*.bilibili.com/*
// @match        http://*.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/443550/B%E7%AB%99%20WASM%20%E8%BD%AF%E8%A7%A3%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443550/B%E7%AB%99%20WASM%20%E8%BD%AF%E8%A7%A3%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const useEdgeMode = false;

    function GetUrlRelativePath()
    {
        let url = document.location.toString();
        let arrurl = url.split("//");

        let start = arrurl[1].indexOf("/");
        let relurl = arrurl[1].substring(start);

        if(relurl.indexOf("?") != -1){
            relurl = relurl.split("?")[0];
        }
        return relurl;
    }

    function HookUA(uastr)
    {
        Object.defineProperty(navigator, 'userAgent', {
            value: uastr
        });
    }

    if (MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L93"') || MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L93"')) {
        // 检测是否支持HEVC
        if (document.domain == "live.bilibili.com") {
            // 直播
            HookUA(navigator.userAgent.replace(/\s+Edg\/(\d+\.)*\d+\s*/, ""));
        } else if (document.domain == "www.bilibili.com" || document.domain == "bilibili.com") {
            // 主站
            if (GetUrlRelativePath() == "/") {
                // 首页
            } else {
                // 点播
                if (useEdgeMode) {
                    HookUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/100.0.3538.102 Safari/605.1.15 Edge/18.22000');
                } else {
                    HookUA("Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15");
                }
            }
        }
    } else {
        // 不支持的
        let userAgent = navigator.userAgent;
        let isEdge = userAgent.indexOf("Edge") > -1;
        let isEdgeChromium = userAgent.indexOf("Edg") > -1;
        let isWindows = userAgent.indexOf("Windows NT") > -1;
        if (isWindows && (isEdge || isEdgeChromium)) {
            GM_registerMenuCommand("（未启用）点击安装 HEVC 扩展", function() {
                window.open('ms-windows-store://pdp?productId=9n4wgh0z6vhq&mode=mini', '_self')
            });
        } else {
            GM_registerMenuCommand("（未启用）此浏览器不支持 HEVC", function() {
                alert("此插件尚未生效\r\n因为此浏览器不支持 HEVC\r\n\r\n推荐使用 Windows 版 Microsoft Edge 浏览器");
            });
        }
    }
})();