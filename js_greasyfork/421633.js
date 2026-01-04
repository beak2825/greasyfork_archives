// ==UserScript==
// @name         留星网VIP内容破解
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  留星网VIP内容破解脚本
// @author       iceshadows
// @match        https://www.liustar.cn/
// @match        https://www.liustar.cn/index.html
// @match        https://www.liustar.cn/exam/**/list-*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421633/%E7%95%99%E6%98%9F%E7%BD%91VIP%E5%86%85%E5%AE%B9%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/421633/%E7%95%99%E6%98%9F%E7%BD%91VIP%E5%86%85%E5%AE%B9%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==
(function() {
    $(".single-suo").remove();
    $(".m").hide();
    var list =["托福真题","TPO练习","TPO模考"]
    $(".m").children().each(function(index,el){
        var flag = false;
        list.forEach(function(el1,index){
            if($(el).html().search(el1)>-1){
                console.log($(el).parent().attr("style",""))
            }
        })
    })
})();