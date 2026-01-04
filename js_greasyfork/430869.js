// ==UserScript==
// @name         去你妈的秒懂
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @license      gpl-3.0
// @description  去除百度系网站的秒懂百科/视频，目前支持百度百科、百度知道
// @author       PRO
// @match        https://baike.baidu.com/*
// @match        https://jingyan.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430869/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%A7%92%E6%87%82.user.js
// @updateURL https://update.greasyfork.org/scripts/430869/%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%E7%A7%92%E6%87%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const log = (...args) => console.log("[去你妈的秒懂]", ...args);
    const config = { // 添加域名-selector的映射来适配更多网站
        "baike.baidu.com": ['.second-wrapper', '.full-screen-second_prestrain', '[class*="contentBottom_"]', '#J-lemma-video-list'],
        "jingyan.baidu.com": ['.feeds-video-box', '.feeds-video-one-view', '.video-wrapper']
    }
    const names = config[window.location.host];
    if (names) {
        names.forEach((name) => {
            const sb = document.querySelector(name);
            if (sb) {
                sb.remove();
                log(`${name} 元素移除成功！`);
            } else {
                log(`未发现 ${name} 元素！`);
            }
        });
    }
    else {
        log('暂不支持此站点，请提交适配反馈！');
    };
})();