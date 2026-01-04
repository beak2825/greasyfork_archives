// ==UserScript==
// @name         52pojie搜索固定导航去除板块
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去掉了规则板块，固定了导航
// @author       You
// @match        https://www.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406415/52pojie%E6%90%9C%E7%B4%A2%E5%9B%BA%E5%AE%9A%E5%AF%BC%E8%88%AA%E5%8E%BB%E9%99%A4%E6%9D%BF%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/406415/52pojie%E6%90%9C%E7%B4%A2%E5%9B%BA%E5%AE%9A%E5%AF%BC%E8%88%AA%E5%8E%BB%E9%99%A4%E6%9D%BF%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    document.onreadystatechange = function(){
        if(document.readyState == "complete"){
            var rule = document.querySelector('div[id^="forum_rules"]');
            if(rule) rule.style.display="none";
        }
    }
    var thred = document.getElementById("threadlisttableid");
    if(thred){
        var child = thred.children;
		for(var i=0,len=child.length;i<len;i++){
			if(child[i+1].getAttribute("id") == "separatorline"){
				break;
			}else{
				child[i].style.display="none";
			}
		}
    }
    window.onscroll=function(e){
        var scroll=document.documentElement.scrollTop || document.body.scrollTop;
        var doc=document.getElementById("scbar");
        if(doc){
            if(scroll>84){
                doc.style.cssText="position:fixed;top:33px;z-index:999;width:100%"
            }else{
                doc.style.cssText=""
            }
        }
    }
    //让页面显示回到顶部按钮
    var pre = document.getElementById("goTopBtn");
    pre.style.display = "block";
    //var goto = document.createElement("li");
})();