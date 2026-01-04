// ==UserScript==
// @name         网页里面简单的侦听网址变化
// @namespace    https://leochan.me
// @version      1.0.0
// @description  网页侦听网址变化
// @author       Leo
// @license      GPLv2
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @grant        unsafeWindow
// ==/UserScript==
 
function webPageWatchUrl(watchCallback){
    watchCallback();
    var originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        watchCallback();
    };
    var originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        watchCallback();
    };
    window.addEventListener('popstate', () => {
        watchCallback();
    });
}