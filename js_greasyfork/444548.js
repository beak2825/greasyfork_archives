// ==UserScript==
// @name         edusrc个人主页数据统计
// @namespace    https://www.shikangsi.com
// @version      0.1
// @description  统计edusrc个人主页漏洞信息，在线查询：https://data.shikangsi.com
// @author       墨雪飘影
// @match        https://src.sjtu.edu.cn/profile/*
// @icon         https://src.sjtu.edu.cn/static/img/main.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      data.shikangsi.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444548/edusrc%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/444548/edusrc%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    var css=".lowcolor{background-color: #3BB4F2;}.midcolor{background-color: #0E90D2;}.highcolor{background-color: #F37B1D;}.criticalcolor{background-color: #DD514C;}.lowcolor,.midcolor,.highcolor,.criticalcolor{color: white;font-size: 17px;margin-left:5px;}";
    var url = window.location.pathname.replace('profile','');
    var id=url.replaceAll('/','');
     GM_xmlhttpRequest({
                method: "get",
                url: "http://data.shikangsi.cn:8088/api/user?id="+id,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },

                onload: function(response){
                    var data=response.responseText;
                    data=JSON.parse(data);
                    console.log(data);
                    GM_addStyle(css);
                    var tag = document.getElementsByClassName('am-g');
                    var content=document.createElement("div");
                    content.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;<font class="lowcolor">低危:'+data.low+'</font><font class="midcolor">中危:'+data.mid+'</font><font class="highcolor">高危:'+data.high+'</font><font class="criticalcolor">严重:'+data.critical+'</font>&nbsp;&nbsp;&nbsp;&nbsp;<a href="'+data.msg.website+'" target="_blank">'+data.msg.author+'</a>';
                    tag[3].prepend(content);
                },
                onerror: function(response){
                    console.log("请求失败");
                }
            });

    // Your code here...
})();