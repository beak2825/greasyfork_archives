// ==UserScript==
// @name        IT之家新闻生成UBB代码
// @namespace   http://www.mapaler.com/
// @description 快速将本页IT之家新闻生成Discuz! X论坛用UBB代码
// @include     http://www.ithome.com/html/*.htm*
// @version     1.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11971/IT%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E7%94%9F%E6%88%90UBB%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/11971/IT%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E7%94%9F%E6%88%90UBB%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
	var runButton = document.createElement("a");
	runButton.id = "build-ubb"
	runButton.type = "button";
	runButton.className = "app";
	runButton.innerHTML = "UBB代码";
	runButton.href = "javascript:;";
	runButton.onclick = function(){buildUBB();}
	var buttonParent = document.getElementById("side_func");
	buttonParent.appendChild(runButton);
	
	//开始构建工作
	function buildUBB()
	{
		buildWindow();
		buildCode();
	}
	
	//构建输出窗口
	function buildWindow()
	{
		var main,con,txt,cls;
		if(document.getElementById("dzx-ubb")){
			return false;
		}
		if(!window.FormData){
			return false;        
		}
		
		con = document.createElement('div');
		con.style.cssText = [
			''
			,'width:180px'
			,''
		].join(';');
		var txt = document.createElement('textarea');
		txt.id = 'ubb-code';
		txt.className = 'ubb-code';
		txt.style.cssText = [
			''
			,'width:180px'
			,'height:180px'
			,''
		].join(';');
		con.appendChild(txt);
		
		cls = document.createElement('div');
		cls.innerHTML = '关闭';
		cls.style.cssText = [
			''
			,'width:40px'
			,'box-shadow:0 0 2px #333'
			,'position:absolute'
			,'top:0'
			,'left:-40px'
			,'line-height:25px'
			,'padding:0'
			,'margin:0'
			,'border-radius:0'
			,'border:none'
			,'background:#515151'
			,'z-index:99999'
			,'text-align:center'
			,'color:#aaa'
			,'cursor:pointer'
			,''
		].join(';');
		cls.onclick = function(){main.parentNode && document.body.removeChild(main);}
		
		main = document.createElement('div');
		main.id = "dzx-ubb";
		main.style.cssText = [
			''
			,'box-shadow:0 0 10px #333'
			,'position:fixed'
			,'top:0'
			,'right:0'
			,'z-index:1000000'
			,'font-family:arial,sans-serif'
			,'padding:5px'
			,'margin:0'
			,'border-radius: 0 0 0 5px'
			,'background:#F5F8FA'
			,''
		].join(';');
		main.appendChild(cls);
		main.appendChild(con);
		document.body.appendChild(main);
		return true;
	}
	
	//构建页面代码
	function buildCode()
	{
		var outTextarea = document.getElementById("ubb-code");
		var ubb='';
		ubb += toubbcode(document);
		ubb += '\r\n[hr]▲原文地址：[url]'+document.URL+'[/url]';
		outTextarea.value = ubb;
	}
	//将一个页面转换为UBB代码
	function toubbcode(doc){
		var ubb='';
	/*	var pt_info = document.getElementsByClassName("pt_info")[0].cloneNode(true);
		pt_info.removeChild(pt_info.getElementById("hitcount")); //去除人气
		pt_info.removeChild(pt_info.getElementsByClassName("pti_comm")[0]); //去除评论
	*/
		var title = document.getElementsByClassName("post_title")[0].getElementsByTagName("h1")[0];
		var postdate = document.getElementById("pubtime_baidu");
		var newssource = document.getElementById("source_baidu");
		var newsauthor = document.getElementById("author_baidu");
		var newseditor = document.getElementById("editor_baidu");
		ubb += '[align=center]';
		ubb += '[size=19.8pt][color=#272a30]';
		ubb += domMakeUBB(title);
		ubb += '[/color][/size]\r\n';
		ubb += '[size=9pt][color=#888888]';
		ubb += domMakeUBB(postdate) + " ";
		ubb += domMakeUBB(newssource) + " ";
		ubb += domMakeUBB(newsauthor) + " ";
		ubb += domMakeUBB(newseditor) + " ";
		ubb += '[/color][/size]';
		ubb += '[/align]';
		ubb += '\r\n';
		var paragraph = document.getElementById("paragraph");
		ubb += domMakeUBB(paragraph);
		return ubb;
	}
	//将一个DOM转换为UBB代码
	function domMakeUBB(dom){
		var domc = dom.cloneNode(true);
		var ubb = '';
		//删除所有script
		var atp = domc.getElementsByTagName("script");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].parentNode.removeChild(atp[dmi]);
		}
		//对链接进行转换
		var atp = domc.getElementsByTagName("a");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if(atp[dmi].innerHTML=="") //没有内容的链接
				atp[dmi].parentNode.removeChild(atp[dmi]);
			else if (atp[dmi].href == "") //没有链接的链接
				atp[dmi].outerHTML = atp[dmi].innerHTML;
			else if (atp[dmi].href.replace(document.URL,"").indexOf('#') == 0) //当前页面跳转链接
				atp[dmi].outerHTML = atp[dmi].innerHTML;
			else if (isAutoURL(atp[dmi])) //自动生成的链接
				atp[dmi].outerHTML = atp[dmi].innerHTML;
			else
				atp[dmi].outerHTML = '[url='+atp[dmi].href+']'+atp[dmi].innerHTML+'[/url]';
		}
		//对换行进行转换
		var atp = domc.getElementsByTagName("br");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].outerHTML = '\r\n';
		}
		//对水平分隔符进行转换
		var atp = domc.getElementsByTagName("hr");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].outerHTML = '[hr]';
		}
		//对图片进行转换
		var atp = domc.getElementsByTagName("img");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if(atp[dmi].className=="lazy"){
				atp[dmi].src = atp[dmi].getAttribute("data-original");
			}
			if(atp[dmi].width==0 || atp[dmi].height==0){
				atp[dmi].outerHTML = '[img]'+atp[dmi].src+'[/img]';
			}else{
				atp[dmi].outerHTML = '[img='+ atp[dmi].width +','+atp[dmi].height+']'+atp[dmi].src+'[/img]';
			}
		}
		//对Flash进行转换
		var atp = domc.getElementsByTagName("embed");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if(atp[dmi].width==0 || atp[dmi].height==0){
				atp[dmi].outerHTML = '[Flash]'+atp[dmi].src + '?'+ atp[dmi].getAttribute("flashvars") +'&fn=a.swf[/Flash]';
			}else{
				atp[dmi].outerHTML = '[Flash='+ atp[dmi].width +','+atp[dmi].height+']'+atp[dmi].src + '?'+ atp[dmi].getAttribute("flashvars") +'&fn=a.swf[/Flash]';
			}
		}
		//对段落进行转换
		var atp = domc.getElementsByTagName("p");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if(atp[dmi].className == "weixin"){ //去除微信推广
				atp[dmi].parentNode.removeChild(atp[dmi]);
				continue;
			}
			if (atp[dmi].style.textAlign)
				atp[dmi].outerHTML = '[p=30, 2, '+atp[dmi].style.textAlign+']'+atp[dmi].innerHTML+'[/p]';
			else
				atp[dmi].outerHTML = '[p=30, 2, left]'+atp[dmi].innerHTML+'[/p]';
		}
		//对div进行转换
		var atp = domc.getElementsByTagName("div");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if(atp[dmi].className == "wximg"){ //去除微信推广
				atp[dmi].parentNode.removeChild(atp[dmi]);
				continue;
			}
			if (atp[dmi].style.textAlign)
				atp[dmi].outerHTML = '[p=30, 2, '+atp[dmi].style.textAlign+']'+atp[dmi].innerHTML+'[/p]';
			else
				atp[dmi].outerHTML = '[p=30, 2, left]'+atp[dmi].innerHTML+'[/p]';
		}
		//对粗体进行转换
		var atp = domc.getElementsByTagName("strong");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].outerHTML = '[b]'+atp[dmi].innerHTML+'[/b]';
		}
		//对下划线进行转换
		var atp = domc.getElementsByTagName("u");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].outerHTML = '[u]'+atp[dmi].innerHTML+'[/u]';
		}
		//对斜体进行转换
		var atp = dom.getElementsByTagName("em");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			atp[dmi].outerHTML = '[i]'+atp[dmi].innerHTML+'[/i]';
		}
		//对颜色进行转换
		var atp = domc.getElementsByTagName("span");
		for (var dmi=atp.length-1;dmi>=0;dmi--){
			if (atp[dmi].style.color)
				atp[dmi].outerHTML = '[color='+changeRgbToHex(atp[dmi].style.color)+']'+atp[dmi].innerHTML+'[/color]';
			else if (atp[dmi].style.textDecoration == "underline")
				atp[dmi].outerHTML = '[u]'+atp[dmi].innerHTML+'[/u]';
		}
		ubb += domc.textContent;
		ubb = ubb.replace(/^\s*(.+?)\s*$/gim,"$1"); //去除两段多余空格
		return ubb;
	}
	//颜色rgb代码转换为16进制代码
	function changeRgbToHex(str)
	{
		var reg = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/igm;
		var re = reg.exec(str);
		if(re)
		{
			return "#"
				+upTo2Hex(parseInt(re[1]).toString(16))
				+upTo2Hex(parseInt(re[2]).toString(16))
				+upTo2Hex(parseInt(re[3]).toString(16))
				;
		}
		else
		{
			return str;
		}
	}
	//16进制提升到2位
	function upTo2Hex(str)
	{
		if (str.length < 2) str = "0" + str;
		return str;
	}
	//判断是否是自动生成的无意义链接
	function isAutoURL(adom)
	{
		var objReg = /http:\/\/www.ithome.com\/tags\/.*/gi;
		if (objReg.test(adom.href))return true;
		
		if(adom.innerHTML == '软媒' && adom.href == 'http://www.ruanmei.com/') return true;
		if(adom.innerHTML == 'IT之家' && adom.href == 'http://www.ithome.com/') return true;
		if(adom.innerHTML == '魔方电脑大师' && adom.href == 'http://mofang.ithome.com/') return true;
		if(adom.innerHTML == '浏览器' && adom.href == 'http://www.saayaa.com/') return true;
		if(adom.innerHTML == 'Win10' && adom.href == 'http://win10.ithome.com/') return true;
		if(adom.innerHTML == 'Win8.1' && adom.href == 'http://win8.ithome.com/') return true;
		if(adom.innerHTML == 'Win8' && adom.href == 'http://www.win8china.com/') return true;
		if(adom.innerHTML == 'Win7' && adom.href == 'http://www.win7china.com/') return true;
		if(adom.innerHTML == 'Vista' && adom.href == 'http://www.vista123.com/') return true;
		if(adom.href == 'http://iphone.ithome.com/') return true;
		if(adom.href == 'http://ipad.ithome.com/') return true;
		if(adom.href == 'http://android.ithome.com/') return true;
		if(adom.href == 'http://chrome.ithome.com/') return true;
		if(adom.href == 'http://qq.ithome.com/') return true;
		if(adom.innerHTML == 'QQ下载' && adom.href == 'http://qq.ithome.com/qqxiazai/') return true;
		if(adom.href == 'http://office.ithome.com/') return true;
		if(adom.href == 'http://ie.ithome.com/') return true;
		if(adom.href == 'http://wp.ithome.com/') return true;
		
		return false;
	}
})();