// ==UserScript==
// @name         解除电信知识中心的复制粘贴限制和切屏检测
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  切屏检测和复制粘贴解除
// @author       酷企鹅Link
// @match        https://kc.zhixueyun.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463822/%E8%A7%A3%E9%99%A4%E7%94%B5%E4%BF%A1%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E7%9A%84%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E5%92%8C%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463822/%E8%A7%A3%E9%99%A4%E7%94%B5%E4%BF%A1%E7%9F%A5%E8%AF%86%E4%B8%AD%E5%BF%83%E7%9A%84%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E5%92%8C%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {

    window.addEventListener("DOMContentLoaded", (event) => {
        var MutationObserver = window.MutationObserver ||
            window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(i){
                if(document.querySelector('.preview-content')){
                    observer.disconnect();
                    setTimeout(()=>{
                        const content = document.querySelector('.preview-content');
                        content.setAttribute('oncontextmenu','');
                        content.setAttribute('oncopy','');
                        console.log(document.querySelector('.preview-content'));
                    },1000);
                    return;
                }
            });
        });
        var config = { childList: true, subtree: true, characterData: true };
        observer.observe(document.body, config);
    });

    const stopEventPropagation = (event) => {
        event.stopImmediatePropagation()
        event.stopPropagation();
        event.preventDefault();
    };
    unsafeWindow.addEventListener('visibilitychange', stopEventPropagation, true);
    unsafeWindow.addEventListener('pagehide', stopEventPropagation, true);
    unsafeWindow.addEventListener('beforeunload', stopEventPropagation, true);
    unsafeWindow.addEventListener('blur', stopEventPropagation, true);
    unsafeWindow.addEventListener('focus', stopEventPropagation, true);
    unsafeWindow.onfocus = null
    unsafeWindow.onblur = null
    unsafeWindow.onpagehide = null
    unsafeWindow.onbeforeunload = null
})();