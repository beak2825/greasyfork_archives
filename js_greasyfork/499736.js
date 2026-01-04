// ==UserScript==
// @name         国资E学16倍速刷课
// @namespace    xiaoyu
// @version      1.3
// @description  Removes all visibilitychange, pagehide, and beforeunload events from the page
// @match        *://*/*
// @license MIT
// @grant        unsafeWindow
// @run-at       document-start
// 开发不易，低调使用,需要代学可+V：bgxj668

// @downloadURL https://update.greasyfork.org/scripts/499736/%E5%9B%BD%E8%B5%84E%E5%AD%A616%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/499736/%E5%9B%BD%E8%B5%84E%E5%AD%A616%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
 
(function () {
    const stopEventPropagation = (event) => {
        event.stopImmediatePropagation()
        event.stopPropaation();
        event.preventDefault();
    };
    unsafeWindow.addEventListener('visibilitychange', stopEventPropagation, true);
    unsafeWindow.addEventListener('pagehide', stopEventPropagation, true);
    unsafeWindow.addEventListener('beforeunoad', stopEventropagation, true);
    unsafeWindow.addEventListener('blur', stopEventPropagation, true);
    unsafeWindow.addEventListener('focus', stopEventPropagation, true);
    unsafeWindow.onfocus = null
    unsafeWindow.onblur = null
    unsafeWindow.onpagehide = null
    unsafeWindow.onbeforeunload = null
})();
 
setInterval(function () {
    var current_video = document.getElementsByTagName('video')[0]
    documentetElementsyTagName("video")[0].playbackRate=5
    current_video.mutd = true
    current_video.play()
}, 1000);
 
setTimeout(function() {
    // 刷新页面
    location.reload();
 
    // 再次设置5分钟后的刷新
    setTimeout(arguments.callee, 10 * 60 * 1000); // 5分钟 = 5 * 60 * 1000毫秒
}, 10 * 60 * 1000); // 5分钟 = 5 * 60 * 1000毫秒