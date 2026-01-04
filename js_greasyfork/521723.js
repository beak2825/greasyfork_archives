// ==UserScript==
// @name         书香门第签到，我爱吃喝玩乐签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click specific elements on 52ch.net
// @license MIT
// @author       Zhougang
// @match        https://www.52ch.net/dsu_paulsign-sign.html
// @match        http://www.txtnovel.vip/plugin.php?id=dsu_paulsign:sign
// @icon         https://www.google.com/s2/favicons?sz=64&domain=txtnovel.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521723/%E4%B9%A6%E9%A6%99%E9%97%A8%E7%AC%AC%E7%AD%BE%E5%88%B0%EF%BC%8C%E6%88%91%E7%88%B1%E5%90%83%E5%96%9D%E7%8E%A9%E4%B9%90%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/521723/%E4%B9%A6%E9%A6%99%E9%97%A8%E7%AC%AC%E7%AD%BE%E5%88%B0%EF%BC%8C%E6%88%91%E7%88%B1%E5%90%83%E5%96%9D%E7%8E%A9%E4%B9%90%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 对于 52ch.net
    if (window.location.hostname.includes("txtnovel")) {
        // 查找指定的 <img> 元素
        console.log("识别进入书香门第");
        const targetImage = document.querySelector('img[src="source/plugin/dsu_paulsign/img/qdtb.gif"]')
        if (targetImage) {
        const targetBQ = document.querySelector('img[src="source/plugin/dsu_paulsign/img/1/kx.gif"]')
            // 如果找到目标图片，则点击它
            targetBQ.click();
            targetImage.click();
            console.log("目标元素找到，进行签到。");
            //document.forms[""].submit();
        } else {
            console.log("目标元素未找到，已经签过到了。");
        }
    }

    // 对于 52ch.net
    if (window.location.hostname.includes("www.52ch.net")) {
        console.log("识别进入52ch.net");
        // 查找指定的 <img> 元素
        const targetImage = document.querySelector('img[src="source/plugin/dsu_paulsign/img/emot/kx.gif"]')
        if (targetImage) {
            // 如果找到目标图片，则点击它
            targetImage.click();
            document.forms[1].submit();
            console.log("目标元素找到，进行签到。");
        } else {
            console.log("目标元素未找到，脚本停止执行。");
        }
    }
})();
