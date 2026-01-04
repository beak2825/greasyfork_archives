// ==UserScript==
// @icon         http://exam.bdqn.cn/testing/favicon.ico
// @name         课工厂题库助手
// @namespace    https://my.oschina.net/liuh1988
// @version      0.2
// @description  refresh bad img!
// @author       liuh
// @match        *://exam.bdqn.cn/testing/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419927/%E8%AF%BE%E5%B7%A5%E5%8E%82%E9%A2%98%E5%BA%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419927/%E8%AF%BE%E5%B7%A5%E5%8E%82%E9%A2%98%E5%BA%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#refresh_img_btn{right:305px;}');
    var $ = unsafeWindow.jQuery;

    // 刷新按钮html代码
    var refresh_btn_html='<a href="javascript:void(0);" id="refresh_img_btn" title="刷新加载图片" class="mark">刷新</a>';

    // 刷新按钮的html代码插入网页
    var biaoji = $("a.mark");
    if(biaoji){
        biaoji.parent().append(refresh_btn_html);
    }

    $(function () {
        biaoji.parent().on('click','#refresh_img_btn',function(){
            var subject=$(this).parent().find("img");
            subject.attr("src", subject.attr("src"));
            console.log("subject--"+subject.attr("src"));
        })
    });


})();