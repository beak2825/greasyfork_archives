// ==UserScript==
// @name         bing搜索去广告
// @namespace    gstsgy
// @version      0.0.3
// @description  bing搜索去广告,优化bing搜索
// @author       You
// @match        https://*.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470518/bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/470518/bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setTimeout(()=>{
     console.log(111)
        let ads = document.querySelectorAll(".sb_adTA")
        for(let ad of ads){
            ad.remove()
        }
        ads = document.querySelectorAll(".b_ad")
        for(let ad of ads){
            ad.remove()
        }
        ads = document.querySelectorAll(".sb_add")
        for(let ad of ads){
            ad.parentNode.remove()
        }
    },500);
})();