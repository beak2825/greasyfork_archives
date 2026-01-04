// ==UserScript==
// @name         AC-CSDN自动展开全文
// @version      2.1
// @description  避免CSDN阅读文章需要点击按钮，非常的方便
// @author       AC
// @namespace    1353464539@qq.com
// @include      /https?://blog.csdn.net/[^/]+/article/details/.*/
// @note         2018.3.24-V2.1 修复在HTTPS上没有正确的调用的问题
// @note         2017.11.2-V2.0 修复在上次使用过程中HOST写错了的BUG
// @note         2017.11.1-V1.0 第一版，移除CSDN的点击阅读文章按钮
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34712/AC-CSDN%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/34712/AC-CSDN%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==
function addStyle(css) { //添加CSS的代码--copy的
    var pi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
}
if(location.host == "blog.csdn.net"){
    var actaobaoT = setInterval(function(){
        if(document.querySelector(".readall_box").style.display == ""){
            clearInterval(actaobaoT);
            addStyle("#article_content{height:auto !important;}.readall_box{display:none !important;}");
        }
    }, 100);
}