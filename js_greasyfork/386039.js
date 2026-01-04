// ==UserScript==
// @name 天猫退款查询快速设置申请时间
// @namespace Violentmonkey Scripts
// @grant none
// @match      https://refund2.tmall.com/*
// @description:zh-cn 天猫退款查询页面快速设置申请时间
// @version 0.0.1.20190614072552
// @description 天猫退款查询页面快速设置申请时间
// @downloadURL https://update.greasyfork.org/scripts/386039/%E5%A4%A9%E7%8C%AB%E9%80%80%E6%AC%BE%E6%9F%A5%E8%AF%A2%E5%BF%AB%E9%80%9F%E8%AE%BE%E7%BD%AE%E7%94%B3%E8%AF%B7%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/386039/%E5%A4%A9%E7%8C%AB%E9%80%80%E6%AC%BE%E6%9F%A5%E8%AF%A2%E5%BF%AB%E9%80%9F%E8%AE%BE%E7%BD%AE%E7%94%B3%E8%AF%B7%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

function AjaxLoadJquerylibrary()  
        {  
            var d = document, s = d.getElementById('firebug-lite');  
            if (s !== null)  
                return;  
            s = d.createElement('script');  
            s.type = 'text/javascript';  
            s.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js';  
            d.body.appendChild(s);  
        }  
AjaxLoadJquerylibrary();  



function dd(xx){
				var curDate=new Date();				
				var a = new Date(curDate.getTime() + xx*24*60*60*1000)
				var y=a.getFullYear();
				var m=a.getMonth()+1;
				m<10?m="0"+m:m=m;
				var d=a.getDate();
				d<10?d="0"+d:d=d;
				return y+"-"+m+"-"+d&" 00:00:00";
			}

alert(document.querySelector("div.mod-datetimepickerpc:nth-child(1)>div.picker>span:nth-child(3)>input").value);
document.querySelector("div.mod-datetimepickerpc:nth-child(1)>div.picker>span:nth-child(3)>input").value=dd(-1);
