// ==UserScript==
// @name         WebRTC禁用脚本
// @version      1.1
// @description  尝试禁止WebRTC泄露真实ip
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @namespace https://viayoo.com/
// @downloadURL https://update.greasyfork.org/scripts/495166/WebRTC%E7%A6%81%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495166/WebRTC%E7%A6%81%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 在这里添加不禁用WebRTC的站点 Add your whitelist URLs here
const whitelist = [
  "https://example.com",
  "https://example.net"
];

function isWhitelisted(url) {
  return whitelist.some((whitelistedUrl) => url.startsWith(whitelistedUrl));
}

// Block WebRTC on non-whitelisted pages
if (!isWhitelisted(window.location.href)) {
    const killWebRTC = () => {
        unsafeWindow['RTCPeerConnection'] = null;
        unsafeWindow['webkitRTCPeerConnection'] = null;
        unsafeWindow['mozRTCPeerConnection'] = null;
    };
    killWebRTC();
}