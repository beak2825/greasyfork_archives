// ==UserScript==
// @name         哗啦啦去除商户中心登录提示
// @namespace    http://tampermonkey.net/
// @version      0.47
// @description  删除商户中心手机绑定提示
// @author       轻度全控
// @match        *://*.hualala.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450612/%E5%93%97%E5%95%A6%E5%95%A6%E5%8E%BB%E9%99%A4%E5%95%86%E6%88%B7%E4%B8%AD%E5%BF%83%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450612/%E5%93%97%E5%95%A6%E5%95%A6%E5%8E%BB%E9%99%A4%E5%95%86%E6%88%B7%E4%B8%AD%E5%BF%83%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // var myVar = setInterval(function(){ dlremoves() }, 1000);
    setTimeout(function () {
               var i=0;
       var sc=["ant-modal-mask","ant-modal-wrap","Notices_opacity__1W11A","Notices_noticesKnow__3pXP0","Notices_opacity__151PC","Notices_noticesKnow__2wojt","Notices_noticesTips__3uas7","Notices_noticesTips_professional__30dMs","Notices_noticesTips_professional__3pbFs"]
       for(i;i<sc.length;i++){
           if(document.getElementsByClassName(sc[i]).length>0){
               document.getElementsByClassName(sc[i])[0].remove();
           }
       }
    }, 3000);//这里为打开网页后等待多少秒后执行，如网络不好打开网页缓慢，可以修改为5000毫秒=5秒，以此类推
})();