// ==UserScript==
// @name         审核页面提示错误的一号表述
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  本脚本用于在审核员在审核时，对一号的错误描述进行强提示。
// @author       WJX问卷星
// @match        https://www.wjx.cn/customerservices/previewq.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435989/%E5%AE%A1%E6%A0%B8%E9%A1%B5%E9%9D%A2%E6%8F%90%E7%A4%BA%E9%94%99%E8%AF%AF%E7%9A%84%E4%B8%80%E5%8F%B7%E8%A1%A8%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/435989/%E5%AE%A1%E6%A0%B8%E9%A1%B5%E9%9D%A2%E6%8F%90%E7%A4%BA%E9%94%99%E8%AF%AF%E7%9A%84%E4%B8%80%E5%8F%B7%E8%A1%A8%E8%BF%B0.meta.js
// ==/UserScript==
(function() {
    var zdyScript1 = document.createElement('script');
    zdyScript1.setAttribute('src', '//cdn.staticfile.org/jquery/1.10.2/jquery.min.js');
    document.body.appendChild(zdyScript1);
    zdyScript1.onload=function(){
        $.get("https://app.paperol.cn/keyword.txt?v="+new Date().getTime(), function (data, textStauts) {
            if (!data) return;
            var keywords = data.split("\n");

            for (var i=0;i<keywords.length;i++) {
                if(!keywords[i])continue;
                document.body.innerHTML = document.body.innerHTML.replaceAll(keywords[i],"<span style='background-color: red;color:white;font-size: 20px;'>"+keywords[i]+"</span>");
            }
        });
    }
})();