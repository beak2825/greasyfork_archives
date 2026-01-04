// ==UserScript==
// @name         自动开启网页全屏
// @namespace    https://github.com/idcpj
// @version      0.8
// @description  网页加载完4秒后,启动网页全屏
// @author       idcpj
// @match        *v.qq.com/x/cover/*
// @match        *live.bilibili.com/*
// @match        *www.bilibili.com/video*
// @match        *www.youtube.com/watch?v=*
// @match        *www.iqiyi.com/*
// @match        *pan.baidu.com/play/video*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39163/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/39163/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {

    var doubleClickEvent = new MouseEvent("dblclick", {
        bubbles: true,  // 如果希望事件冒泡，请设置为 true
        cancelable: true,  // 如果希望事件可取消，请设置为 true
        view: window  // 视图窗口，通常是 window
    });

     window.setTimeout(function(){
            document.querySelector('[aria-label="网页全屏"]')?.click(); //b站
            document.querySelector('#businessContainerElement').dispatchEvent(doubleClickEvent); // b站

            document.querySelector(".txp_btn_fake")?.click(); //腾讯
            document.querySelector(".ytp-size-button")?.click(); //youtube
            document.querySelector("a[data-player-hook='webfullscreen']")?.click(); //爱奇艺
    }, 4000);


})();