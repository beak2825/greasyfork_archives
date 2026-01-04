// ==UserScript==
// @name         爱奇艺防标题剧透
// @description  会自动隐藏播放页及播放列表页面的标题
// @version      1.0.3                         
// @author       You
// @match        https://www.iqiyi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqiyi.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1373035
// @downloadURL https://update.greasyfork.org/scripts/511252/%E7%88%B1%E5%A5%87%E8%89%BA%E9%98%B2%E6%A0%87%E9%A2%98%E5%89%A7%E9%80%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/511252/%E7%88%B1%E5%A5%87%E8%89%BA%E9%98%B2%E6%A0%87%E9%A2%98%E5%89%A7%E9%80%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

       setInterval(() => {
        let titleArr=["iqp-top-title","webHead_title__z7nZL"]
        for(let i=1;i<titleArr.length;i++){
            let titleDIVS = document.getElementsByClassName(titleArr[i])
            if (titleDIVS.length) {
                console.log("识别到标题");
                titleDIVS[0].style.display = "none"
                let titleNavs = document.getElementsByClassName("episodes_title__Fcalw")
                for (let item of titleNavs) {
                    item.style.display = "none"
                }
            }
        }
    }, 500);



})();