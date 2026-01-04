// ==UserScript==
// @name            bilibili.com B站地址bv号自动跳转回av号 自动去掉/s
// @description     略
// @language        zh-CN
// @version         1.1
// @icon            https://www.bilibili.com/favicon.ico
// @match           *://*.bilibili.com/*
// @author          acbetter
// @run-at          document-start
// @grant           unsafeWindow
// @namespace       https://greasyfork.org/scripts/408684
// @license         MIT? idk
// @downloadURL https://update.greasyfork.org/scripts/408684/bilibilicom%20B%E7%AB%99%E5%9C%B0%E5%9D%80bv%E5%8F%B7%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%9B%9Eav%E5%8F%B7%20%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89s.user.js
// @updateURL https://update.greasyfork.org/scripts/408684/bilibilicom%20B%E7%AB%99%E5%9C%B0%E5%9D%80bv%E5%8F%B7%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%9B%9Eav%E5%8F%B7%20%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89s.meta.js
// ==/UserScript==

// this script is a fork from: https://greasyfork.org/en/scripts/398811

const table='fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF',
    s=[11,10,3,8,4,6],
    xor=177451812,
    add=8728348608;

switch([/www\.bilibili\.com\/s\/video\/BV/,
        /(search|space)\.bilibili\.com/]
       .findIndex(e => e.test(location.href))){
    case 0:
        location.pathname = `/video/${dec(location.pathname.replace('/s/video/', ''))}`;
        break;
    case 1:
        unsafeWindow.onload = function() {
            document.querySelectorAll('a[href*="/BV"]').forEach(e => {
                var url = new URL(e.href);
                url.pathname = `/video/${dec(url.pathname.replace('/s/video/', ''))}`;
                e.href = url.href;
            });
        };
        break;
    case -1:
}

switch([/www\.bilibili\.com\/video\/BV/,
        /(search|space)\.bilibili\.com/]
       .findIndex(e => e.test(location.href))){
    case 0:
        location.pathname = `/video/${dec(location.pathname.replace('/video/', ''))}`;
        break;
    case 1:
        unsafeWindow.onload = function() {
            document.querySelectorAll('a[href*="/BV"]').forEach(e => {
                var url = new URL(e.href);
                url.pathname = `/video/${dec(url.pathname.replace('/video/', ''))}`;
                e.href = url.href;
            });
        };
        break;
    case -1:
}

function dec(x){
	var i, r = 0;
	for(i of Array(6).keys())
		r += table.indexOf(x[s[i]])*58**i;
	return `av${(r-add)^xor}`;
}

function enc(x){
	x=(parseInt(x)^xor)+add;
    var i, r=[...'BV1  4 1 7  '];
	for(i of Array(6).keys())
		r[s[i]]=table[Math.floor(x/58**i)%58]
	return r.join('')
}