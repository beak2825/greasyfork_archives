// ==UserScript==
// @name         屏蔽html5播放器p2p上传
// @version      0.1.4
// @description  屏蔽html5播放器使用WebRTC技术进行p2p上传，以及防止通过p2p泄露ip，如斗鱼直播后台上传等。需要注意默认屏蔽所有网站html5的p2p功能，需要使用p2p的网站请自行加入排除列表，如网易uu语音、twitch等。嫌麻烦的请勿用。
// @author       binsee
// @namespace    https://github.com/binsee/tampermonkey-scripts
// @supportURL   https://github.com/binsee/tampermonkey-scripts/issues
// @license      GPL
// @run-at       document-start
// @match        *://*.douyu.com/*
// @match        *://*.qq.com/*
// @match        *://*.huya.com/*
// @match        *://*/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://*.discord.com/*
// @exclude      *://*.twitch.tv/*
// @exclude      *://*.ext-twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417216/%E5%B1%8F%E8%94%BDhtml5%E6%92%AD%E6%94%BE%E5%99%A8p2p%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/417216/%E5%B1%8F%E8%94%BDhtml5%E6%92%AD%E6%94%BE%E5%99%A8p2p%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==
let HookFlag = false

let debugFlag = true
let jsName = '屏蔽html5播放器p2p上传'
let logger = {
    debug: createDebugMethod('debug'),
    info: createDebugMethod('info'),
    warn: createDebugMethod('warn'),
    error: createDebugMethod('error')
};

function createDebugMethod(name) {
    const bgColorMap = {
        debug: '#0070BB',
        info: '#009966',
        warn: '#BBBB23',
        error: '#bc0004'
    };
    name = bgColorMap[name] ? name : 'info';
    return function () {
        const args = Array.from(arguments);
        args.unshift(`color: white; background-color: ${bgColorMap[name] || '#FFFFFF'}`);
        args.unshift(`【${jsName}】 %c[${name.toUpperCase()}]:`);
        console[name].apply(console, args);
    }
}


(function () {
    'use strict';
    let funNameList = [
        'RTCPeerConnection',
        'webkitRTCPeerConnection',
        'mozRTCPeerConnection',
        'msRTCPeerConnectio',
    ]
    funNameList.forEach(name => {
        if (typeof window._RTCPeerConnection === "undefined") window._RTCPeerConnection = window[name];
        if (typeof window[name] !== "undefined") window[name] = debugFlag ? MyPeerConnection : undefined;
    })
    logger.info('已屏蔽p2p上传功能')

    function MyPeerConnection(args) {
        logger.debug(`PeerConnection() 被调用！
当前页面尝试建立p2p连接！
调用参数: ${JSON.stringify(args)}`)
        return HookFlag ? new window._RTCPeerConnection(args) : undefined
    }
})();


