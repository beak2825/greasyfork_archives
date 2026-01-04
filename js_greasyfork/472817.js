// ==UserScript==
// @name         qq空间去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  qq空间去广告哈哈
// @author       You
// @match        https://user.qzone.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472817/qq%E7%A9%BA%E9%97%B4%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/472817/qq%E7%A9%BA%E9%97%B4%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
    let ads = document.querySelectorAll(".f-single-biz");
    for(let ad of ads){
        ad.remove();
    }
    },500)
    // Your code here...
})();