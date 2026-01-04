// ==UserScript==
// @name 桃花族
// @namespace Violentmonkey Scripts
// @grant none
// @include      http://thz9.net/thread-*
// @version 0.0.1.20190426133234
// @description 桃花族论坛的下载链接自定义
// @downloadURL https://update.greasyfork.org/scripts/30433/%E6%A1%83%E8%8A%B1%E6%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/30433/%E6%A1%83%E8%8A%B1%E6%97%8F.meta.js
// ==/UserScript==

function AjaxLoadJquerylibrary()  
        {  
            var d = document, s = d.getElementById('firebug-lite');  
            if (s != null)  
                return;  
            s = d.createElement('script');  
            s.type = 'text/javascript';  
            s.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js';  
            d.body.appendChild(s);  
        }  
AjaxLoadJquerylibrary();  

var sitestr="http://thz9.net/"
var str=document.querySelector("p.attnm>a").href;
var str2=str.substring(str.indexOf("=")+1,str.length)
var	incstr=sitestr+"forum.php?mod=attachment&aid="+str2
document.querySelector("p.attnm>a").href=incstr
document.querySelector("p.attnm>a").onclick=null;
document.querySelector("p.attnm>a").target="_self"
