// ==UserScript==
// @name 洛谷屏蔽西方不buy菌
// @namespace https://www.luogu.com.cn/
// @version      0.1
// @description 目前支持在讨论区屏蔽该人，看不到他的信息
// @author       HARAKI
// @match        https://www.luogu.com.cn/discuss/*
// @downloadURL https://update.greasyfork.org/scripts/417045/%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E8%A5%BF%E6%96%B9%E4%B8%8Dbuy%E8%8F%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/417045/%E6%B4%9B%E8%B0%B7%E5%B1%8F%E8%94%BD%E8%A5%BF%E6%96%B9%E4%B8%8Dbuy%E8%8F%8C.meta.js
// ==/UserScript==


//讨论
cnt=0;
a=document.querySelectorAll(".lg-table-row a.center");
f=document.querySelectorAll(".lg-table-row");
for(var i=0;i<a.length;i++){

   	b=a[i].href;
	if(b=="https://www.luogu.com.cn/user/372653"){
		f[i].setAttribute("style","display:none;");
        cnt++;
	}
	if(b=="https://www.luogu.com.cn/user/378346"){
		f[i].setAttribute("style","display:none;");
        cnt++;
	}
	if(b=="https://www.luogu.com.cn/user/311921"){
		f[i].setAttribute("style","display:none;");
        cnt++;
	}

}
//回复
d=document.querySelectorAll(".am-comment-primary");
p=document.querySelectorAll(".am-comment-primary .am-comment-meta a:nth-child(2)");
for(var i=0;i<d.length;i++){

   	k=p[i].href;
	if(k=="https://www.luogu.com.cn/user/372653"){
		d[i].setAttribute("style","display:none;");
        cnt++;
	}
	if(k=="https://www.luogu.com.cn/user/378346"){
		d[i].setAttribute("style","display:none;");
        cnt++;
	}
	if(k=="https://www.luogu.com.cn/user/311921"){
		d[i].setAttribute("style","display:none;");
        cnt++;
	}
}
console.log("clear "+cnt+" discussion");