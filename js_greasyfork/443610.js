// ==UserScript==
// @name         云学堂编辑框限制去除
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @author       fcwys
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @description  云学堂考试编辑框许复制、粘贴、限制、右键菜单限制去除。
// @license      MIT
// @match        *://*.yunxuetang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443610/%E4%BA%91%E5%AD%A6%E5%A0%82%E7%BC%96%E8%BE%91%E6%A1%86%E9%99%90%E5%88%B6%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/443610/%E4%BA%91%E5%AD%A6%E5%A0%82%E7%BC%96%E8%BE%91%E6%A1%86%E9%99%90%E5%88%B6%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    //循环检测
    var disyxtTimer = setInterval(disyxt(),300);
    function disyxt(){
        //判断是否取到textarea节点并排除id=txtPress01的编辑框
        if(document.querySelectorAll("textarea").length>0 && document.querySelectorAll("textarea")[0].id!="txtPress01"){
            document.querySelectorAll('textarea').forEach(function(item){
                //重写编辑框复制、粘贴、剪切、选中、右键菜单事件
                item.onpaste="";item.oncopy="";item.oncut="";item.oncontextmenu="";item.onselectstart="";console.log("已去除编辑框限制");         
            });
        }else{
            console.log("当前页面无编辑框");
            clearInterval(disyxtTimer);
        }
    }
})();
