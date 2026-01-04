// ==UserScript==
// @icon            https://github.githubassets.com/favicon.ico
// @name            GitHub 镜像加速下载-码酷博客
// @namespace       [url=mailto:13731177267@163.com]13731177267@163.com[/url]
// @author          码酷博客
// @description     加速GitHub克隆和下载
// @match           *://github.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.0.0
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383577/GitHub%20%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD-%E7%A0%81%E9%85%B7%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/383577/GitHub%20%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD-%E7%A0%81%E9%85%B7%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==

(function () {
 'use strict';
 var yuan =  window.location.href+'.git';
 var a = yuan.split("/");
 var str1 = 'https://'+'i.codeku.me/'+a[3]+'/'+a[4]; 
 var str3 = 'https://'+'v2.github.codeku.me/'+a[3]+'/'+a[4]; 
 var qc = a[4].split(".")
 var str2 = 'https://'+'ws.codeku.me/'+a[3]+'/'+qc[0]+'/zip/master'; 
  //$('.mt-2').append('快速克隆通道:<input value="'+str1+'">')
 
  var info = `
<div style="height:200px;border:2px dashed ;">
            <center><h3>这是一条国内快速通道</h3></center>
            <center>  
             <ul style="left:150px">
                    <li>博客：www.codeku.me <a href="https://www.codeku.me">点我进入作者博客</a></li>          
            </ul>
        </center>
        <br>
       <center><div>快速克隆通道A1：<input style="width:300px;height:30px" value="${str1}"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;快速下载通道：<a href="${str2}" id="down">点我下载</div></a>
      快速克隆通道A2：<input style="width:300px;height:30px" value="${str3}"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;快速下载通道：<a href="${str2}" id="down">点我下载</div></a></div>
</div>
      </center>
    </div>
 `;
  
  $('.repository-content').prepend(info);
})();
