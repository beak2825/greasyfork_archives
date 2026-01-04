// ==UserScript==
// @name         360软件宝库下载地址解析(360软件管家)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  360软件宝库(软件管家)下载地址解析,目前只支持单个软件页面解析
// @author       610100
// @match        http://baoku.360.cn/soft/show/appid/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/392699/360%E8%BD%AF%E4%BB%B6%E5%AE%9D%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90%28360%E8%BD%AF%E4%BB%B6%E7%AE%A1%E5%AE%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392699/360%E8%BD%AF%E4%BB%B6%E5%AE%9D%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E8%A7%A3%E6%9E%90%28360%E8%BD%AF%E4%BB%B6%E7%AE%A1%E5%AE%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var appid=location.href.substring(location.href.lastIndexOf("/")+1,);

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://q.soft.360.cn/get_download_url.php?soft_ids="+appid,
        headers: {
            //"User-Agent": "",// If not specified, navigator.userAgent will be used.
            "Accept": "*/*"// If not specified, browser defaults will be used.
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }
            //上面是发送get请求获取xml数据

            //var xmltext=response.responseText;
            var parser=new DOMParser();
            var xmlDoc=parser.parseFromString(response.responseText,"text/xml");
            //var x=xmlDoc.getElementsByTagName("softs");
            var pdown=xmlDoc.getElementsByTagName("softs")[0].getElementsByTagName("durls")[0].childNodes[0].nodeValue;//解析获取那个xml中pdown节点的数据
            //alert(pdown);
            var str=pdown.substring(pdown.indexOf("|http"),);//分割文本
            //alert(str);
            var n=str.split("|")
            //var str1=str.substring(str.lastIndexOf("|http"),);
            //alert(str1);
            //alert(str2);
            var m=0;
            var downlink=new Array(10);//存放地址，理论上应该够用了
            for(var i=0;i<n.length;i++)
            {
                if(n[i]!="")
                {
                    downlink[m]=n[i];
                    m=m+1;

                }
            }
            //alert(m);
            for(i=0;i<m;i++)
            {
                alert("下载地址"+(i+1)+": "+downlink[i]);
            }
        }
    });
    // Your code here...
})();