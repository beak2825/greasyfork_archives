// ==UserScript==
// @name         修复微博https裂图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  替换微博sinaimg.com域名的图片为sinaimg.cn
// @author       You
// @match        https://weibo.com/*
// @grant        none
// @require      http://libs.baidu.com/jquery/1.9.0/jquery.js
// @connect           sinaimg.cn
// @connect           sinaimg.com
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/33992/%E4%BF%AE%E5%A4%8D%E5%BE%AE%E5%8D%9Ahttps%E8%A3%82%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/33992/%E4%BF%AE%E5%A4%8D%E5%BE%AE%E5%8D%9Ahttps%E8%A3%82%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Your code here...
    setInterval(changeimg,2000);


})();

function changeimg(){
    $("li.WB_pic").find("img").each(function(){
        if(this.currentSrc.length>20 && this.currentSrc.indexOf(".com")!=-1){
            console.log(this.currentSrc);
            this.src=this.currentSrc.replace(".com",".cn");
        }
    });
}


