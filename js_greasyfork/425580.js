// ==UserScript==
// @name         去除outlook使用了广告屏蔽软件的提示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MAGA!
// @author       xe5700
// @match        https://outlook.live.com/mail/*/inbox
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/425580/%E5%8E%BB%E9%99%A4outlook%E4%BD%BF%E7%94%A8%E4%BA%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E8%BD%AF%E4%BB%B6%E7%9A%84%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/425580/%E5%8E%BB%E9%99%A4outlook%E4%BD%BF%E7%94%A8%E4%BA%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E8%BD%AF%E4%BB%B6%E7%9A%84%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fuckoutlooktask = setInterval(()=>{
        try{
          let fucking_parent=$("[href='https://windows.microsoft.com/outlook/ad-free-outlook']").parent().parent().parent().parent();
          if(fucking_parent[0] != null){
            fucking_parent.remove();
          }else{
            return;
          }
          if($("[href='https://windows.microsoft.com/outlook/ad-free-outlook']")[0] == null){
            clearInterval(fuckoutlooktask);
            console.log("广告清理完成!");
          }
        }catch(e){

        }
    },500);
    // Your code here...
})();