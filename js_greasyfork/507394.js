// ==UserScript==
// @name         禁用 WebRTC
// @version      1.3
// @description  禁用 WebRTC 防止泄露真实ip，默认禁用 WebRTC，脚本菜单选项用于启用/禁用当前域名的 WebRTC
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/507394/%E7%A6%81%E7%94%A8%20WebRTC.user.js
// @updateURL https://update.greasyfork.org/scripts/507394/%E7%A6%81%E7%94%A8%20WebRTC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enabledSites = GM_getValue('enabledSites', []);
    const currentURL = window.location.hostname;

    // 简化的禁用函数
    const disableWebRTC = () => {
        ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection']
            .forEach(intf => window[intf] = null);
    };

    // 保留菜单逻辑
    GM_registerMenuCommand(
        enabledSites.includes(currentURL) 
            ? '设置当前域名禁用WebRTC' 
            : '设置当前域名启用WebRTC',
        () => {
            const newList = enabledSites.includes(currentURL)
                ? enabledSites.filter(site => site !== currentURL)
                : [...enabledSites, currentURL];
            GM_setValue('enabledSites', newList);
            location.reload();
        }
    );

    // 执行判断
    if (!enabledSites.includes(currentURL)) {
        disableWebRTC();
    }
})();