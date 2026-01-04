// ==UserScript==
// @name         饭饭百度文库一键纯净
// @namespace    http://your.homepage/
// @version      0.4
// @description  只是可以将百度文库没用的垃圾组件全部清除（例如广告，侧边栏），只留下文档，还你一个纯净的页面啦啦啦啦
// @author       小凡宝宝
// @match        https://wenku.baidu.com/view/476ebd705e0e7cd184254b35eefdc8d376ee14b6.html
// @include      *://wenku.baidu.com/*,"*://www.baidu.com/*"
// @grant        none
// @license      AGPL License
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418627/%E9%A5%AD%E9%A5%AD%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%80%E9%94%AE%E7%BA%AF%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/418627/%E9%A5%AD%E9%A5%AD%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%80%E9%94%AE%E7%BA%AF%E5%87%80.meta.js
// ==/UserScript==
$(function(){
    var frame = "<div style='position:fixed;z-index:999999;background-color:yellow;cursor:pointer;top:20%;left:0px;width:28px;height:36px'>"+
       				 "<div id='ff' style='font-size:13px;;font-weight:bold' >一键纯净</div>"+
				 "</div>";
  	    $("body").append(frame);
            $("#ff").click(function(){
  		document.getElementById("right-wrapper-id").style.display="none";
		document.getElementsByClassName("header-wrapper")[0].style.display="none";
		document.getElementsByClassName("hx-recom-wrapper")[0].style.display="none";	
		var m = document.getElementsByClassName("no-full-screen");
		for(var i=0;i<m.length;i++) m[i].style.display="none";
		var x = document.getElementsByClassName("hx-warp");
		for(var i=0;i<x.length;i++) x[i].style.display="none";
		var y = document.getElementsByClassName("lazy-load");
		for(var i=0;i<y.length;i++) y[i].style.display="none";
		//document.getElementsByClassName("try-end-fold-page")[0].style.display="none"; //这个是文档最后阅读结束的位置，打开注释就把最下面的那个阅读结束也隐藏掉
                document.getElementsByClassName("fufei-activity-bar")[0].style.display="none";  //这个语句是之前右边的发红包那个广告的框框，现在没有了，放在这里也没什么关系
 	 });
})


