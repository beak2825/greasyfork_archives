// ==UserScript==
// @name         去你妈的秒懂-优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本脚本是对【去你妈的秒懂(https://greasyfork.org/zh-CN/scripts/430869-%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%A7%92%E6%87%82/code)】的一些优化。去除百度系网站的秒懂百科/视频，目前支持百度百科、百度知道
// @author       PRO, juqkai
// @include /^https?://(baike|jingyan)\.baidu\.com/
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430985/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%A7%92%E6%87%82-%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430985/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%A7%92%E6%87%82-%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let map = {
    "baike.baidu.com": () => clear([document.querySelector(".secondsknow-large-container")])
    ,"jingyan.baidu.com": () => clear([document.querySelector(".feeds-video-box"), document.querySelector(".feeds-video-one-view")])
}

function clear(doms) {
    if (!doms) {
        console.log('[去你妈的秒懂]暂不支持此站点，请提交适配反馈！');
        return;
    }
    let log = "[去你妈的秒懂]未发现视频，如确实有请反馈！";
    for (let index in doms) {
        if (doms[index]) {
            doms[index].remove();
            log = "[去你妈的秒懂]视频移除成功！";
        }
    }
    console.log(log);
}

(function () {
    'use strict';
    map[document.domain]();
})();