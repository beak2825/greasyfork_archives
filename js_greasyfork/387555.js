// ==UserScript==
// @icon         http://www.yimuhe.com/favicon.ico
// @name         一木禾/DUFile/乱斗/巴士云净化
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  屏蔽广告/优化下载流程
// @author       Avral
// @match        *://yimuhe.com/*
// @match        *://www.yimuhe.com/*
// @match        *://dufile.com/*
// @match        *://www.dufile.com/*
// @match        *://tadaigou.com/*
// @match        *://www.tadaigou.com/*
// @match        *://ibuspan.com/*
// @match        *://www.ibuspan.com/*
// @match        *://www.66disk.com/*
// @match        *://77file.com/*
// @match        *://www.77file.com/*
// @match        *://89file.com/*
// @match        *://www.89file.com/*
// @match        *://www.meleeyun.com/*
// @match        *://567pan.com/*
// @match        *://www.567pan.com/*
// @match        *://kufile.net/*
// @match        *://www.kufile.net/*
// @match        *://xun-niu.com/*
// @match        *://www.xun-niu.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387555/%E4%B8%80%E6%9C%A8%E7%A6%BEDUFile%E4%B9%B1%E6%96%97%E5%B7%B4%E5%A3%AB%E4%BA%91%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/387555/%E4%B8%80%E6%9C%A8%E7%A6%BEDUFile%E4%B9%B1%E6%96%97%E5%B7%B4%E5%A3%AB%E4%BA%91%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

function KillAd(){
  window.adsbygoogle = [];
  document.onclick = function(){}
  document.onkeydown = function(){}
  document.write = function(){}
  document.writeln = function(){}
  window.__qy_pop_up_tg = {}
}

function AutoRelocation(){
  var url = window.location.href;
  var host = window.location.host;
  if(url.indexOf("/file") != -1){
	if(host.indexOf("dufile.com") != -1){
	  $(document).ready(function(){
		if($('#down_interval_tag')[0]==null){
		  window.location.href = url.replace("/file", "/down");
		}
	  });
	  return true;
	}else{
	  window.location.href = url.replace("/file", "/down");
	  return true;
	}
  }else if(url.indexOf("/s") != -1 && host.indexOf("77file.com") != -1){
	window.location.href = url.replace("/s", "/down") + ".html";
	return true;
  }
  return false;
}

function KillWaiter(){
  /*window.Date_bak = window.Date;
  window.Date = function(code){
	return window.Date_bak(code);
  }
  window.setInterval_bak = window.setInterval;
  window.setInterval = function(code, delay){
	return window.setInterval_bak(code, delay);
  }*/
  window.setTimeout_bak = window.setTimeout;
  window.setTimeout = function(code, delay){
	if (typeof(code) == "string"){
	  if (code.indexOf("update_sec") != -1){
		return;
	  }else if (code.indexOf("checkWait") != -1
				|| code.indexOf("down_file_link") != -1
				|| code.indexOf("pre_down_link") != -1
			   ){
		delay = 1;
	  }
	}
	return window.setTimeout_bak(code, delay);
  }
}

function QuickDownload(){
  $.ajax_bak = $.ajax;
  $.ajax = function(s){
	if(s!=null){
	  var idx = 0;
	  if(s.url == "n_downcode.php"){
		idx = 1;
	  }else if(s.url == "/down_code.php"){
		idx = 2;
	  }else if(s.url == "ajax.php"){
		idx = 3;
	  }
	  var orgcb = s.success;
	  var orgdat = s.data;
	  if(orgcb != null){
		s.success = function(e){
		  if(e==1){
			if(idx == 1){
			  window.down_file = function(e, t, n, r, i, s, o){
				r = r.replace("#", "%23");
				var u = document.createElement("iframe");
				u.style.display = "none";
				u.src = "n_dd.php?file_id=" + e + "&userlogin=" + t + "&p=" + s + "&types=" + o + "&file_key=" + n + "&file_name=" + r + "&ser=" + i;
				var jump = function(){
				  window.location.href = u.contentWindow.document.getElementById("downs").href;
				}
				if (u.attachEvent){
				  u.attachEvent("onload", jump);
				} else {
				  u.onload = jump;
				}
				document.body.appendChild(u);
			  };
			  $("#download a")[0].onclick();
			}else if(idx == 2){
			  window.down_file = function(e, t){
				var u = document.createElement("iframe");
				u.style.display = "none";
				u.src = "/dd.php?file_key=" + e + "&p=" + t;
				var jump = function(){
				  window.location.href = u.contentWindow.document.getElementById("downs").href;
				}
				if (u.attachEvent){
				  u.attachEvent("onload", jump);
				} else {
				  u.onload = jump;
				}
				document.body.appendChild(u);
			  }
			  $("#downbtn a")[0].onclick();
			}else if(idx == 3 && orgdat.action == "load_down_addr1"){
			  orgcb(e);
			  $('#addr_list0').click();
			}
		  }else{
			orgcb(e);
		  }
		}
	  }
	}
	return $.ajax_bak(s);
  };
}

(function() {
  'use strict';
  if(AutoRelocation()) {
	console.log("跳转");
	return;
  }
  KillAd();
  KillWaiter();
  $(document).ready(function(){
	console.log("页面加载完毕");
	QuickDownload();
	setTimeout(function() {
	  window._0x292386 = function(){};
	  window._0x5c5c87 = function(){};
	}, 1000);
	setTimeout(function() { $('#code').focus() }, 1000);
  });
})();