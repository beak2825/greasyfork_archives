// ==UserScript==
// @name         baiduReplacer
// @name:zh-CN   我不想让你用百度
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  replace Baidu with Google or Bing
// @description:zh-cn 使用Google或Bing替代百度
// @author       maniacata
// @match        http*://www.baidu.com/*
// @match        http*://m.baidu.com/*
// @run-at document-start
//
// @downloadURL https://update.greasyfork.org/scripts/377431/baiduReplacer.user.js
// @updateURL https://update.greasyfork.org/scripts/377431/baiduReplacer.meta.js
// ==/UserScript==

document.write('');

const https = 'https://';
const hostGoogle = 'www.google.com';
const hostBing = 'www.bing.com';
const hostname = location.hostname;
const keyword = (hostname !== 'm.baidu.com')?getUrlQuery('wd'):getUrlQuery('word');

const googleIcon = document.createElement('img');

googleIcon.src = 'https://www.google.com/favicon.ico';
googleIcon.style.display = 'none';
googleIcon.addEventListener('error', err => jump(hostBing));
googleIcon.addEventListener('load', data => jump(hostGoogle));
document.body.appendChild(googleIcon);

function getUrlQuery(key) {
    const keyVaules = window.location.search.substring(1).split("&");
    let res = false;
    keyVaules.forEach(kvStr => {
        let kv = kvStr.split("=");
        if (kv[0] == key) { res = kv[1]; }
    });
    return (res);
}
function jump(host) {
    location.href = (keyword) ? `${https}${host}/search?q=${keyword}` : location.href = `${https}${host}`
} 