// ==UserScript==
// @name         银杏去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  银杏app网页端去广告
// @author       You
// @match        https://yx.meitubb.xyz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458772/%E9%93%B6%E6%9D%8F%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458772/%E9%93%B6%E6%9D%8F%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let int = setInterval(function(){
        //获取广告栏id
        let swiperInList = document.getElementById("swiperInList").style.display="none";
        console.log("正在运行");
        //if(swiperInList.display=="none"){
            //停止计时器
            //int = window.clearInterval(int);
        //}
    },1000);

    console.log("运行结束");
})();