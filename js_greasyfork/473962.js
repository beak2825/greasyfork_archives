// ==UserScript==
// @name         Custom CDN URL 
// @namespace    https://greasyfork.org/en/scripts/473962-custom-cdn-url
// @version      1.5.2
// @description  自定义cdn，国内/国外可以换成合适的cdn
// @author       freenzoo
// @match        https://*.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473962/Custom%20CDN%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/473962/Custom%20CDN%20URL.meta.js
// ==/UserScript==
// 判断是否在指定的网址范围内
function isSupportedURL(url) {
    return url.startsWith('https://www.bilibili.com/video/') ||
           url.startsWith('https://www.bilibili.com/bangumi/play/') ||
           url.startsWith('https://www.bilibili.com/blackboard/');
}

// 获取随机的 CDN 域名
const cdnDomains = [
  "upos-sz-mirrorhw.bilivideo.com",
  "upos-sz-mirrorcos.bilivideo.com",
  "upos-sz-mirrorali.bilivideo.com",
  "upos-sz-mirroralib.bilivideo.com"
];

const getRandomCdnDomain = () => {
  return cdnDomains[Math.floor(Math.random() * cdnDomains.length)];
};

// 替换 P2P URL
const replaceP2PUrl = url => {
    try {
        const urlObj = new URL(url);
        const hostName = urlObj.hostname;
        const supportedDomainsRegex = /\.bilivideo\.com$|\.akamaized\.net$|\.szbdyd\.com$/;
        if (supportedDomainsRegex.test(hostName)) {
            urlObj.host = getRandomCdnDomain();
            urlObj.port = 443;
            // console.warn(`更换视频源: ${hostName} -> ${urlObj.host}`);
            return urlObj.toString();
        }
        return url;
    } catch(e) {
        return url;
    }
};


// 递归替换对象中的 URL
const replaceP2PUrlDeep = obj => {
    for (const key in obj) {
        if (key === 'baseUrl' || key === 'base_url') {
            obj[key] = replaceP2PUrl(obj[key]);
        } else if (typeof obj[key] === 'array' || typeof obj[key] === 'object') {
            replaceP2PUrlDeep(obj[key]);
        }
    }
}

// 在合适的 URL 范围内进行操作
if (isSupportedURL(location.href)) {
    replaceP2PUrlDeep(unsafeWindow.__playinfo__);
    (function (open) {
        unsafeWindow.XMLHttpRequest.prototype.open = function () {
            try {
                arguments[1] = replaceP2PUrl(arguments[1]);
            } finally {
                return open.apply(this, arguments);
            }
        }
    })(unsafeWindow.XMLHttpRequest.prototype.open);
}
