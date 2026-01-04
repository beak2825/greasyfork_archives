// ==UserScript==
// @name         pixiv 解決圖片403禁止訪問
// @namespace    https://greasyfork.org/scripts/439130
// @version      1.6
// @description  pixiv默認禁止直接訪問圖片，會顯示403 Forbidden，安裝腳本解決。
// @author       fmnijk
// @match        https://www.pixiv.net/*
// @match        https://i.pximg.net/*
// @match        https://img-comic.pximg.net/*
// @match        http://i.pximg.net/*
// @match        http://img-comic.pximg.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439130/pixiv%20%E8%A7%A3%E6%B1%BA%E5%9C%96%E7%89%87403%E7%A6%81%E6%AD%A2%E8%A8%AA%E5%95%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/439130/pixiv%20%E8%A7%A3%E6%B1%BA%E5%9C%96%E7%89%87403%E7%A6%81%E6%AD%A2%E8%A8%AA%E5%95%8F.meta.js
// ==/UserScript==

(function() {
	'use strict'

    if (window.location.href.startsWith('https://www.pixiv.net')) {
        return false;
    }

    if (location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
	if (document.title === '403 Forbidden') {
        window.location.reload();
	}
})();
