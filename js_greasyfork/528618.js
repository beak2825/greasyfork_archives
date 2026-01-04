// ==UserScript==
// @name         Bypass网页调试限制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于绕过限制和调试问题的差价，绕过debugger，绕过移动端检测，绕过ua检测，限制RTC泄露等功能
// @author       arschlochnop
// @license   MIT
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528618/Bypass%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528618/Bypass%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

// 删除RTC相关对象，防止泄露真实IP
["","webkit","moz","ms"].forEach(prefix => {
    [
        "RTCError",
        "RTCRtpSender",
        "RTCDTMFSender",
        "RTCErrorEvent",
        "RTCTrackEvent",
        "RTCCertificate",
        "RTCDataChannel",
        "RTCRtpReceiver",
        "RTCStatsReport",
        "RTCIceCandidate",
        "RTCIceTransport",
        "RTCDtlsTransport",
        "RTCSctpTransport",
        "RTCPeerConnection",
        "RTCRtpTransceiver",
        "RTCDataChannelEvent",
        "RTCEncodedAudioFrame",
        "RTCEncodedVideoFrame",
        "RTCSessionDescription",
        "RTCDTMFToneChangeEvent",
        "RTCPeerConnectionIceEvent",
        "RTCPeerConnectionIceErrorEvent"
    ].forEach(rtc => {
        const obj = prefix + rtc;
        if (unsafeWindow[obj]) delete unsafeWindow[obj];
    });
});

// 修改navigator对象，防止泄露真实信息
const platform = "Android";
const platforms = {
    "HP-UX": "Mozilla/5.0 (HP-UX; HP-UX 11.31)",
    "Linux i686": "Mozilla/5.0 (Linux; i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Linux armv7l": "Mozilla/5.0 (Linux; ARM; Android 4.4.2; Nexus 7 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mac68K": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "MacPPC": "Mozilla/5.0 (Macintosh; PPC Mac OS X 10_15_7)",
    "MacIntel": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "SunOS": "Mozilla/5.0 (SunOS; SunOS 5.11)",
    "Win16": "Mozilla/5.0 (Windows 3.1)",
    "Win32": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "WinCE": "Mozilla/5.0 (Windows CE; IEMobile 10.0)",
    "iPhone": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    "iPod": "Mozilla/5.0 (iPod; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    "iPad": "Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    "Android": "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL Build/QQ1A.200205.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Mobile Safari/537.36",
    "BlackBerry": "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.36 (KHTML, like Gecko) Version/10.3.3.2204 Mobile Safari/537.36",
    "Opera": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2516.0"
};


    Object.defineProperty(navigator, 'platform', { get: function() {console.log("禁止查看浏览器平台"); return platform; } });
    Object.defineProperty(navigator,'userAgent',{get:function(){console.log("禁止查看浏览器UA");return platforms[platform];}});
    Object.defineProperty(navigator,'language',{get:function(){console.log("禁止查看浏览器语言");return 'en-US';}});
    Object.defineProperty(navigator,'languages',{get:function(){console.log("禁止查看浏览器语言集"); return ['en-GB', 'en-US'];}});
    Object.defineProperty(navigator,'userAgentData',{get:function(){console.log("禁止查看userAgentData"); return '';}});
    Object.defineProperty(navigator,'appVersion',{get:function(){console.log("禁止查看appVersion"); return '999';}});
Intl.DateTimeFormat.prototype.resolvedOptions = function() {
    console.log("禁止查看时区");
};


// 绕过debugger防调试功能
console.log("========== my hook start ==========");

function hook_Function() {
    let raw_F_c = Function.prototype.constructor;
    let _constructor = function (params) {
        //注释输出，避免影响性能
        //console.log("调用 Function.prototype.constructor: ", params);
        if (params.includes("debugger")) {
            //console.log("发现 debugger in Function.prototype.constructor");
            params = params.replaceAll("debugger", "");
        }
        return raw_F_c(params);
    }
    Object.defineProperty(window.Function.prototype, "constructor", { value: _constructor })
}

function hook_setInterval() {
    let raw_set = setInterval;
    let _setInterval = function () {
        console.log("调用 setInterval: ", arguments)
        // 直接置空似乎没有什么影响
        return;  // 如果出现问题可以删除该语句

        let s = arguments[0].toString();
        if (s.includes("debugger")) {
            console.log("发现 debugger in setInterval");
            s = s.replaceAll("debugger", "");
            arguments[0] = eval(s);
        }
        raw_set(...arguments);
    }
    Object.defineProperty(window, "setInterval", { value: _setInterval })
}

function hook_eval() {
    let raw_eval = eval;
    let _eval = function(param) {
        console.log("调用 eval: ", param);
        if (param.includes("debugger")) {
            console.log("发现 debugger in eval");
            if (param === "(function() {var a = new Date(); debugger; return new Date() - a > 100;}())") {
                param = "(function() { return false; })()";
            }
            param = param.replaceAll("debugger", "");
        }
        raw_eval(param);
    }
    Object.defineProperty(window, "eval", { value: _eval })
}


hook_setInterval();
hook_eval();

// 如果置空 setInterval 出现了其它问题，可以取消该注释
// 可能会影响一些负责页面的渲染功能，默认关闭，如果无法绕过debugger可以取消注释
//hook_Function();  
