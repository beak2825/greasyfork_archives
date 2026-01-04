// ==UserScript==
// @name         哔哩哔哩专栏解除限制
// @namespace    https://greasyfork.org/scripts/398011-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6/code/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @version      2004140
// @description  bilibili专栏文档允许选择复制
// @author       CNGEGE
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/read/*
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/398011/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/398011/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let Const = 0;
    $(document).ready(function() {
        unbind();
    });

    let times = setInterval(function(){
        Const++;
        if(unbind().length || Const > 20){
          clearInterval(times);
        }//clearInterval
    },1000);


    function unbind(){
          let a = $(".article-holder.unable-reprint");
          a.unbind();//取消事件绑定，允许复制（防止复制无效）
          a.removeClass("unable-reprint");//移除禁止分享的类
        return a;
    }

})();