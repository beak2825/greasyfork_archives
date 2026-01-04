// ==UserScript==
// @icon         http://www.fanlisky.cn/favicon.ico
// @name         精易论坛去除全站广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  本脚本用于精易论坛去除全站广告
// @author       LiGe
// @match        *://*.125.la/*
// @grant        none
// @email        357078415@qq.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/378512/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E5%8E%BB%E9%99%A4%E5%85%A8%E7%AB%99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/378512/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E5%8E%BB%E9%99%A4%E5%85%A8%E7%AB%99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

var bbs = "https://bbs.125.la/"; //精易的地址

(function() {
    'use strict';
    var currentUrl = window.location.href;
    if(currentUrl.includes(bbs)){
        //中部广告
        var centerElement = document.getElementsByClassName("wp a_t")[0];
        //头部广告
        var headAD = document.getElementsByClassName("wp a_h")[0];
        //帖子上部广告
        var formContent = document.getElementsByClassName("ptn xg2")[0];
        //页脚广告
        var footerAD = document.getElementsByClassName("wp a_f")[0];
        if(footerAD!==null && typeof(footerAD)!="undefined"){
            footerAD.remove();
        }
         if(centerElement!==null && typeof(centerElement)!="undefined"){
            centerElement.remove();
        }
         if(formContent!==null && typeof(formContent)!="undefined"){
            formContent.remove();
        }
         if(headAD!==null && typeof(headAD)!="undefined"){
            headAD.remove();
        }
        //删除帖子内页小广告
        for(let i = 0;i <= 10 ;i++){
          var tieAD = document.getElementsByClassName("a_pt")[i];
           if(tieAD!==null && typeof(tieAD)!="undefined"){
            tieAD.remove();
           i--;
        }
}
       

    }

})();