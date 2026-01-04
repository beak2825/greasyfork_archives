// ==UserScript==
// @name block
// @namespace http://tampermonkey.net/
// @version 0.1.3
// @description 阻止chatgpt审查
// @author DarkFaMaster
// @match https://chat.openai.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/457011/block.user.js
// @updateURL https://update.greasyfork.org/scripts/457011/block.meta.js
// ==/UserScript==

(function() {
    if (!window.unsafeWindow){
        window.unsafeWindow = window;
    }
    // alert(window.unsafeWindow);
    const originFetch = fetch;
    window.unsafeWindow.fetch = (...arg) => {
        if (arg[0].indexOf('moderations') > -1) {
            // alert('拦截 moderations');
            return new Promise(() => {throw new Error();});
        } else {
            return originFetch(...arg);
        }
    }
})();