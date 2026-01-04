// ==UserScript==
// @name         删除天使动漫广告自写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在加载完页面后删除广告
// @author       You
// @match        https://www.sbdm.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sbdm.net
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451213/%E5%88%A0%E9%99%A4%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E5%B9%BF%E5%91%8A%E8%87%AA%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/451213/%E5%88%A0%E9%99%A4%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E5%B9%BF%E5%91%8A%E8%87%AA%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //播放界面的img广告删除
    while(document.getElementById("topbanimg") != null)
    {
       document.getElementById("topbanimg").remove();
    }
    //首页界面的img广告删除
    if(document.getElementsByClassName("page_content")[1] != null){
    document.getElementsByClassName("page_content")[1].remove();
    }

    if(document.getElementById("content_box_300250") != null){
    document.getElementById("content_box_300250").remove();
    }
    if(document.getElementById("content_box_72890") != null){
    document.getElementById("content_box_72890").remove();
    }
    setTimeout(() => {
      document.getElementsByClassName("jjjjasdasd")[0].remove();
    },500);
    setTimeout(() => {
      document.getElementsByClassName("jjjjasdasd")[0].remove();
    },500);
    setTimeout(() => {
      document.getElementById("HMRichBox").remove();
    },500);
    //要加载完才出现的元素

    $(document).ready(function(){

    if(document.getElementById("HMRichBox") != null){
      document.getElementById("HMRichBox").remove();
    }
    if(document.getElementById("HMcoupletDivleft") != null){
     document.getElementById("HMcoupletDivleft").remove();
    }
    if(document.getElementById("HMcoupletDivright") != null){
    document.getElementById("HMcoupletDivright").remove();
    }
      document.getElementsByClassName("jjjjasdasd")[0].remove();
      document.getElementsByClassName("jjjjasdasd")[1].remove();
    });
})();