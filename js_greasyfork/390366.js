// ==UserScript==
// @name         淘口令搜索自动解密
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浏览器添加搜索引擎：关键字“淘口令”，网址格式“https://taodaxiang.com/taopass?key=%s”，即可在浏览器地址栏输入“淘口令”+空格+你的淘口令，回车直达解密地址
// @author       销锋镝铸
// @include      http*taodaxiang.com/taopass*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390366/%E6%B7%98%E5%8F%A3%E4%BB%A4%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%A7%A3%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/390366/%E6%B7%98%E5%8F%A3%E4%BB%A4%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E8%A7%A3%E5%AF%86.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        var key = decodeURI(document.location.search.replace(/\?key=(.*?)/,"$1"));
        if(key.length>0){
            $("#taopass_form > div.row.id_q > div > textarea").val(key);
            $("#row-btn > input").click();
            var interbal = setInterval(function(){
                var url = $("#result > div > div > p.column-url > a").attr("href");
                console.log(url);
                if(url!="javascript:void(0)"){
                    clearInterval(interbal);
                    document.location = url;
                }
            },500);
        }},1000);
})();