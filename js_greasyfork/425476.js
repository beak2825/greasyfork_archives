// ==UserScript==
// @name         LiFan is lazy but we got Tampermonkey
// @name:zh-CN   LiFan懒到爆？Tampermonkey有妙招！
// @name:zh-TW   LiFan懶到爆？Tampermonkey有妙招！
// @name:zh-HK   LiFan懶到爆？Tampermonkey有妙招！
// @name:zh-JP   LiFan　イス　レイジ　バット　ウィー　ゴット　テンパーモンキー
// @namespace    https://intoyour.space
// @version      114.514
// @description        Fix script-imported sample data copy problem caused by LiFan's bad bot
// @description:zh-CN  修复因为LiFan爬虫写的丑而造成的复制问题
// @description:zh-TW  修復由於LiFan的爬蟲寫的太醜而導致的複製問題
// @description:zh-HK  修復由於LiFan的爬蟲寫的太醜而導致的複製問題
// @author       potatopotat0
// @match        http://222.180.160.110:1024/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425476/LiFan%20is%20lazy%20but%20we%20got%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/425476/LiFan%20is%20lazy%20but%20we%20got%20Tampermonkey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ele = document.getElementsByClassName("sampledata");
    for(var i = ele.length - 1; i >= 0; --i) {
        var tar = ele[i];
        var text = tar.innerHTML;
        text = text.replace(/<br\s*[\/]?>/gi, "\n");
        tar.parentNode.parentNode.innerHTML = text;
    }
})();