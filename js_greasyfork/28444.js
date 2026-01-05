// ==UserScript==
// @name         打印投友圈账本数据
// @namespace    http://tampermonkey.net/
// @version      20170601
// @description  print touyouquan invest data
// @author       You
// @match        https://www.touyouquan.com/invests/items/?pid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28444/%E6%89%93%E5%8D%B0%E6%8A%95%E5%8F%8B%E5%9C%88%E8%B4%A6%E6%9C%AC%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/28444/%E6%89%93%E5%8D%B0%E6%8A%95%E5%8F%8B%E5%9C%88%E8%B4%A6%E6%9C%AC%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var baseAry = [];
    $("tr.itemser").each(function(i,item){
        var base=$(item).attr("base");
        baseAry.push(base);
    });
    if(baseAry.length>0){
        var str1="";
        for (var i = 0; i < baseAry.length-1; i++) {
            str1+=baseAry[i]+",";
        }
        str1+=baseAry[baseAry.length-1];
        var str2="["+"\r\n"+str1+"\r\n"+"]";
        var texthtml='<p>JSON转EXCEL软件在G:\LocalProjects\WinForm\TouyouquanDataExport，转出多个EXCEL后用MergeExcel软件合并！<br/><b>在投和已投的JSON不要混入一个TEXT无法转换，要分开放。</b></p><textarea id="basetext" rows="8" cols="100"></textarea>';
        $(".user_main").after(texthtml);
        $("#basetext").val(str2);
    }
    // Your code here...
})();