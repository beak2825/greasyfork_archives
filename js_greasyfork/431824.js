// ==UserScript==
// @name        职教云助手 最新防封可用
// @namespace   Violentmonkey Scripts
// @match       https://zjy2.icve.com.cn/*
// @grant       none
// @version     4.3.4
// @author      Q群470674459 长期版本，持续更新
// @run-at      document-end
// @description 刷课+答题2021/8/30 最新可用 积累使用人数5000+
// @require     https://greasyfork.org/scripts/401377-pixelmatch/code/pixelmatch.js?version=794438
// @require     https://greasyfork.org/scripts/374845-layer%E7%9A%84%E5%B0%8F%E5%BA%93/code/layer%E7%9A%84%E5%B0%8F%E5%BA%93.js?version=648537
// @require     https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=688332
// @require     https://greasyfork.org/scripts/431823-layer-css/code/layer-css.js?version=966716
// @require     https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=688332
// @require     https://greasyfork.org/scripts/23181-colorpicker/code/colorPicker.js?version=147862
// @require     https://greasyfork.org/scripts/399879-%E5%BC%B9%E7%AA%97/code/%E5%BC%B9%E7%AA%97.js?version=792823
// @downloadURL https://update.greasyfork.org/scripts/431824/%E8%81%8C%E6%95%99%E4%BA%91%E5%8A%A9%E6%89%8B%20%E6%9C%80%E6%96%B0%E9%98%B2%E5%B0%81%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431824/%E8%81%8C%E6%95%99%E4%BA%91%E5%8A%A9%E6%89%8B%20%E6%9C%80%E6%96%B0%E9%98%B2%E5%B0%81%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==


window.onload = () => {
    if (location.href.indexOf('zjy2.icve.com.cn/study/homework/do.html') > 0 || location.href.indexOf('zjy2.icve.com.cn/study/onlineExam/preview.html') > 0) {
        setTimeout(dt.start, 1000);
    }else{
        setTimeout(sk.start, 1000);
    }
};
