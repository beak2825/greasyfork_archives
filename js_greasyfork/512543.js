// ==UserScript==
// @name         wlmqcol hacker
// @namespace    https://gitee.com/gux/t_script/
// @version      2024-10-14
// @description  wlmqcol hacker blur!
// @author       Gux
// @match        https://www.wlmqcol.com/video*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512543/wlmqcol%20hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/512543/wlmqcol%20hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(this==window){
            return;
        }
        oldadd.call(this,...args)
    }
})();