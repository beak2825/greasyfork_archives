// ==UserScript==
// @name         干掉B站直播P2P传输
// @namespace    https://bbs.nga.cn/read.php?&tid=25285579&pid=490022087&to=1
// @version      0.1
// @description  每60秒清理一次P2P相关函数
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422764/%E5%B9%B2%E6%8E%89B%E7%AB%99%E7%9B%B4%E6%92%ADP2P%E4%BC%A0%E8%BE%93.user.js
// @updateURL https://update.greasyfork.org/scripts/422764/%E5%B9%B2%E6%8E%89B%E7%AB%99%E7%9B%B4%E6%92%ADP2P%E4%BC%A0%E8%BE%93.meta.js
// ==/UserScript==

const funcs = [
    'RTCPeerConnection',
    'mozRTCPeerConnection',
    'webkitRTCPeerConnection',
    'RTCDataChannel',
    'DataChannel',
];

const clear = () => {
    console.log("clear P2P functions!");
    for (const i in funcs) {
        const fname = funcs[i];
        if (window[fname] !== undefined) {
            console.log(`${fname} been cleared!`);
            delete window[fname]
        }
    }
};

const interval = 60; // 间隔时间，秒

(function() {
    clear();
    setInterval(clear, interval * 1000);
})();