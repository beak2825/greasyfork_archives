// ==UserScript==
// @name         Google APIs CDN Replacer
// @version      1.0.0
// @description  Replace ajax.googleapis.com
// @author       ShingekiNoRex
// @match        https://ajax.googleapis.com/
// @namespace    https://github.com/justjavac/ReplaceGoogleCDN
// @run-at       document-body
// @grant        unsafeWindow
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/504594/Google%20APIs%20CDN%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/504594/Google%20APIs%20CDN%20Replacer.meta.js
// ==/UserScript==
// 判断是否在指定的网址范围内
function isSupportedURL(url) {
    return url.startsWith('https://ajax.googleapis.com/');
}
 
// 获取随机的 CDN 域名
const cdnDomains = [
  "ajax.loli.net"
];
 
const getRandomCdnDomain = () => {
  return cdnDomains[Math.floor(Math.random() * cdnDomains.length)];
};
 
// 替换 P2P URL
const replaceP2PUrl = url => {
    try {
        const urlObj = new URL(url);
        urlObj.host = cdnDomains[0];
        return urlObj.toString();
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