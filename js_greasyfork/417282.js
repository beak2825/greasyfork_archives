// ==UserScript==
// @name         百度盘分享提取码自动跳转
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @update       2020.10.25
// @description  通过附加url参数pwd来自动跳转，为其他脚本作为接口使用。接口链接https://pan.baidu.com/share/init?surl=[链接/s/1后面的字符串]&pwd=[提取码] 如：https://pan.baidu.com/s/1SreJxiY_iHRI8n2_XgH8TA ,提取码:hmp2 则接口链接为https://pan.baidu.com/share/init?surl=SreJxiY_iHRI8n2_XgH8TA&pwd=hmp2
// @author       charghet
// @run-at       document-start
// @license GPL
// @include https://pan.baidu.com/share/*
// @require https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/417282/%E7%99%BE%E5%BA%A6%E7%9B%98%E5%88%86%E4%BA%AB%E6%8F%90%E5%8F%96%E7%A0%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/417282/%E7%99%BE%E5%BA%A6%E7%9B%98%E5%88%86%E4%BA%AB%E6%8F%90%E5%8F%96%E7%A0%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    var pwd = getUrlValue("pwd");
    var url = "https://pan.baidu.com/share/verify?surl="+getUrlValue("surl");
    if(pwd){
        $(window).bind("load",function (){
            $.post(url,{'pwd':pwd},function(data){
                if(data['errno'] == 0){
                    window.location.replace("https://pan.baidu.com/s/1"+getUrlValue("surl"));
                }});
        });
    }
})();
//获取url参数
function getUrlValue(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for(var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return null;
}