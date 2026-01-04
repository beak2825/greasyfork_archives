// ==UserScript==
// @name         naifei+
// @namespace    https://greasyfork.org/zh-CN/users/176664
// @version      20.08.15.13
// @description  在打开别人分享的百度网盘链接时，显示一个直达pan.naifei.cc的下载按钮，支持提取码链接，可配合自动填写提取码脚本使用
// @author       cnhong
// @match        *://pan.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.naifei.cc/*
// @grant        none
// @run-at       document-idle
// @modified	 20.08.15.13 手动进入新版页面，不显示等待提示
// @modified	 20.07.14.18 修复提取码bug
// @modified	 20.07.11.19 优化提取码相关提示
// @modified	 20.07.11.18 增加提取码暂存失败提示
// @modified	 20.07.11.17 修复带提取码链接无法自动识别提取码的bug
// @downloadURL https://update.greasyfork.org/scripts/406851/naifei%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/406851/naifei%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
	try{loadJq();}catch(e){log("error:", e);}
	function main(){
		log("开始初始化");
		switch(document.domain){
			case "pan.baidu.com":
				baidu();
				break;
			case "pan.naifei.cc":
				naifei();
				break;
		}
		log("初始化完成");
	}
	function getShare(){
		var h = location.href, s="";
		if(h.indexOf('com/s/')>0){
			s = h.split("com/s/")[1];
		}else if(GET('surl')){
			s = GET('surl');
		}
		if(s&& s.indexOf('#')>0){
			s = s.split("#")[0];
		}
		return s;
	}
	function getPwd(share){
		var pwd = '';
		if(location.hash !="" && location.hash.length==5){
			pwd = location.hash.replace("#","");
		}else{
			pwd = getCookie(share)||getCookie(share.substring(1));
		}
		if(pwd && pwd !=="****"){
			log("发现提取码:"+pwd);
			return pwd;
		}
		log("未发现提取码");
	}
	function GET(key) {
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return '';
	}
	function baidu(){
		var pwdBtn = $('#submitBtn');
		
		var share = getShare(), pwd;
		if(!share){alert("解析shareId失败！可联系脚本作者");return false;}
		pwd = getPwd(share);
		if(pwdBtn.length>0){ 
			if(pwd){
				$('.pickpw input').val(pwd);
				setCookie(share, pwd,30);
				setTimeout(function(){
					$("#submitBtn").trigger("click");
				},1000);
			}
			$(".pickpw input").on("change",function(){
				pwd = $('.pickpw input').val().trim();
				setCookie(share, pwd,30);
			});
			return;
		}
		var url = share;
		
		if(pwd){url += "&pwd="+pwd;}
		if(url){
			var btn = '<a class="g-button" data-button-id="b8" data-button-index="2" href="http://pan.naifei.cc/?share='+url+'" target="_blank" title="直达naifei"><span class="g-button-right"><em class="icon icon-save-disk" title="直达naifei"></em><span class="text" style="width: auto;">直达naifei</span></span></a>';
			$(".x-button-box").prepend(btn);
			$('a[data-button-id="b7"]').hide();
			$('a[data-button-id="b5"]').hide();
		}
	}
	function loadJq(){
		if(typeof($)=="undefined"){
			loadJS("https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js", main);
		}else{
			main();
		}
	}
	function loadJS( url, callback ){
		var script = document.createElement('script'),
			fn = callback || function(){};
		script.type = 'text/javascript';
		script.onload = function(){
			fn();
		};
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function loadCSS(url){
		var script = document.createElement('link');
		script.rel = 'stylesheet';
		script.href = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	function setCookie(n,v,t)
	{
		var d = new Date();
		d.setTime(d.getTime()+(t*24*60*60*1000));
		t = "expires="+d.toGMTString();
		document.cookie = n + "=" + v + "; " + t+"; path=/;";
	}
	function getCookie(n)
	{
		n = n + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(n)==0) return c.substring(n.length,c.length);
		}
		return "";
	}
	function naifei(){
		loadCSS('https://cdn.staticfile.org/weui/1.1.2/style/weui.min.css');
		loadCSS('https://cdn.staticfile.org/jquery-weui/1.2.0/css/jquery-weui.min.css');
		loadJS('https://cdn.staticfile.org/jquery-weui/1.2.0/js/jquery-weui.min.js',wait);
	}
	function wait(){
		if(location.href.indexOf("/new")>0){
            return ;
        }
		$.showLoading("解析中...");
		var interval = setInterval(function(){
			var flag = $("tr").length;
			if(flag>=1){
				$.hideLoading();
				clearInterval(interval);
				if(flag>1){
					$.toast("解析成功");
					return;
				}else{
					// if(GET("pwd")&&GET("pwd").length==4){
						// $.toast("解析失败<br>建议刷新", "cancel");
					// }else{
						inputCode();
					// }
				}
			}	
		}, 1000);
	}
	function inputCode(){
		$.prompt({
          text: "<section style='text-align:left;'>1.可能解析失败,点击“取消”自动刷新<br>2.可能需要输提取码,输入后点击”确定“</section>",
          title: "解析内容为空!",
          onOK: function(text) {
			  var url=location.href;
			  if(GET('pwd')){
				  url=url.replace(/&pwd=[0-9a-zA-Z]+/, "&pwd="+text);
			  }else{
				  url=url.replace("&pwd=","")+"&pwd="+text;
			  }
			location.href=url;
          },
          onCancel: function() {
			location.reload();
			log("取消了");
			$.showLoading("正在刷新");
          },
          input: GET("pwd")
        });
	}
	function log(s){
		console.group('[naifei+]');
		console.log(s);
		console.groupEnd();
	}
})();