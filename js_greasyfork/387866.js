// ==UserScript==
// @name         启用NGA快速爬楼模式
// @namespace    https://yuyuyzl.github.io/
// @version      0.4.1
// @description  在进入页面时自动往前展开到显示10页，之后按点赞过滤0赞水楼
// @author       yuyuyzl
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.0/jquery.min.js
// @match        *://nga.178.com/read.php?tid=*&page=*
// @match        *://bbs.nga.cn/read.php?tid=*&page=*
// @match        *://bbs.ngacn.cc/read.php?tid=*&page=*
// @match        *://ngabbs.com/read.php?tid=*&page=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387866/%E5%90%AF%E7%94%A8NGA%E5%BF%AB%E9%80%9F%E7%88%AC%E6%A5%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/387866/%E5%90%AF%E7%94%A8NGA%E5%BF%AB%E9%80%9F%E7%88%AC%E6%A5%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.noConflict();
    var jq=jQuery;
    var prevadd;
    jq("#pagebtop td a").each(function(i,obj){if(jq(obj).text()=="<")prevadd=obj});
    var interval=setInterval(function(){
        var pagelong=parseInt(jq("#pagebbtm td a.invert").text().replace(".",""))-parseInt(jq("#pagebtop td a.invert").text().replace(".",""));
        var toppage=parseInt(jq("#pagebtop td a.invert").text().replace(".",""));
        if(pagelong<9 && toppage!=1){
            commonui.loadReadHidden(0,4);
        }else {
            clearInterval(interval);
            jq(".small_colored_text_btn.block_txt_c2.stxt>span.white").each(function(i,obj){if (!(jq(obj).text().length>0&&parseInt(jq(obj).text())>=1)){
                jq(obj).parents(".forumbox").hide();
            }});
            jq(".avatar").hide();
            jq("#pagebtop td a").each(function(i,obj){if(jq(obj).text()=="前页"){
                jq("#pagebbtm tr").append(jq(obj).parent());
            }});
            //<td><a href="/read.php?tid=17741491&amp;page=611" class=" uitxt1" title="最后页">&nbsp;611.</a></td>
            console.log("[NGA FastClimb] Filter Finished")
        }
    },100);
})();