// ==UserScript==
// @name        自动加载调试工具包
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   比如lodash jquery moment dayjs
// @author       You
// @match       https://*/*
// @match       http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461034/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/461034/%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function load(path){
        path.map((it)=>{
            const para = document.createElement('script');
            para.setAttribute('src', "https://unpkg.com/"+it);
            document.head.appendChild(para);
        })
    }
    load(['lodash','moment','dayjs'])
})();