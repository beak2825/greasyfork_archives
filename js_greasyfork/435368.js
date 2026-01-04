// ==UserScript==
// @name         bypassUserFocusDetect
// @namespace    http://github.com/iamwwc
// @version      0.6
// @description  绕过关注检测
// @author       iamwwc
// @match        *://*/*
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435368/bypassUserFocusDetect.user.js
// @updateURL https://update.greasyfork.org/scripts/435368/bypassUserFocusDetect.meta.js
// ==/UserScript==

(function () {
    'use strict';
Object.defineProperty(window.document,'visibilityState',{get:function(){return 'visible';},configurable:true});
Object.defineProperty(window.document,'hidden',{get:function(){return false;},configurable:true});
    const events = ['visibilitychange', 'webkitvisibilitychange'];
    [window, document].forEach(x => {
        let original = x.addEventListener.bind(x);
        x.addEventListener = (...args) => {
            if(events.includes(args[0])) {
                return;
            }
            return original.apply(this, args);
        }
    });
})();