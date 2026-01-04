// ==UserScript==
// @name         吾爱代码块支持
// @namespace    wuai_copy
// @version      0.1.0
// @description  吾爱代码块隐藏/显示切换+md复制按钮支持
// @author       涛之雨
// @match        https://www.52pojie.cn/*
// @grant	     none
// @note         吾爱代码块隐藏/显示切换+md复制按钮支持
// @icon         https://www.52pojie.cn/favicon.ico
// @home         https://greasyfork.org/zh-CN/scripts/416512
// @downloadURL https://update.greasyfork.org/scripts/416512/%E5%90%BE%E7%88%B1%E4%BB%A3%E7%A0%81%E5%9D%97%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/416512/%E5%90%BE%E7%88%B1%E4%BB%A3%E7%A0%81%E5%9D%97%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
window.onscroll=function(){
	document.querySelectorAll(".viewsource").forEach((a)=>{
	    var b=a.parentElement;
	    if(b.lastChild.className=="hideCode"||b.lastChild.className=="showCode"){
	    	return;
	    }
	    var c = document.createElement('em');
	    c.setAttribute("class","hideCode");
	    c.style="cursor:pointer;font-size:12px;color:#369 !important;";
	    c.innerHTML=" 隐藏代码";
		c.onclick=function(){
			var a=this;
			if(a.className=="hideCode"){
				a.parentElement.parentElement.lastChild.style.height="0";
				a.parentElement.parentElement.lastChild.style.overflow="hidden";
			    a.setAttribute("class","showCode");
		    	a.innerHTML=" 显示代码";
		    }else if(a.className=="showCode"){
				a.parentElement.parentElement.lastChild.style.height="";
				a.parentElement.parentElement.lastChild.style.overflow=""
			    a.setAttribute("class","hideCode");
			    a.innerHTML=" 隐藏代码";
		    }
		};
	    b.appendChild(c);
	});
	document.querySelectorAll("pre").forEach((a)=>{
	    if(a.firstChild.className=="hideCode"||a.firstChild.className=="CopyMyCode"||a.firstChild.className=="showCode"){
	    	return;
	    }else{
		    var c = document.createElement('em');
		    c.setAttribute("class","hideCode");
		    c.style="cursor:pointer;font-size:12px;color:#369 !important;";
		    c.innerHTML=" 隐藏代码";
		    a.insertBefore(c,a.firstChild);
			c.onclick=function(){
				var a=this;
				if(a.className=="hideCode"){
					a.parentElement.lastChild.style.height="0";
					a.parentElement.lastChild.style.overflow="hidden";
				    a.setAttribute("class","showCode");
			    	a.innerHTML=" 显示代码";
			    }else if(a.className=="showCode"){
					a.parentElement.lastChild.style.height="";
					a.parentElement.lastChild.style.overflow="";
				    a.setAttribute("class","hideCode");
				    a.innerHTML=" 隐藏代码";
			    }
			};
		    c = document.createElement('em');
		    c.setAttribute("class","CopyMyCode");
		    c.style="cursor:pointer;font-size:12px;color:#369 !important;";
		    c.innerHTML=" 复制代码";
		    a.insertBefore(c,a.firstChild);
			c.onclick=function(){
	            var container = this.parentElement.lastChild;
	            var lines = container.childNodes;
	            var code = [];
	            for (var i = 0; i < lines.length; i++) {
	                code.push(lines[i].innerText || lines[i].textContent);
	            }
	            code = code.join('');
            	setCopy(code, '代码已复制到剪贴板');
			};
		}
	});
}
})();