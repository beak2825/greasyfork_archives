// ==UserScript==
// @name         monnsutogatya_tool
// @namespace    http://qqboxy.blogspot.com/
// @version      0.9.3
// @description  ADBlock Reborn and Refresh tool.
// @author	     QQBoxy
// @match        http://tw.monnsutogatya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12760/monnsutogatya_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/12760/monnsutogatya_tool.meta.js
// ==/UserScript==

// Install https://greasyfork.org/zh-TW/scripts/12760-monnsutogatya-tool

(function() {
	function $(id) {
		switch(id.substr(0,1)) {
			case '#':
				return document.getElementById(id.substr(1));
			case '.':
				var elems = document.body.getElementsByTagName('*');
				var target = id.substr(1);
				var result=[];
				for(i=0;j=elems[i];i++) {
					if((j.className).indexOf(target)!=-1) result.push(j);
				}
				return result;
			default:
				return document.getElementsByTagName(id);
		}
	}
	
	var getCookie = function(name) {
		var n = name + "=";
		var nlen = n.length;
		var clen = document.cookie.length;
		var i = 0;
		while(i < clen) {
			var j = i + nlen;
			if(document.cookie.substring(i, j) == n) {
				var endstr = document.cookie.indexOf(";", j);
				if(endstr == -1)
					endstr = clen;
				return unescape(document.cookie.substring(j, endstr));
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if(i == 0) break;
		}
		return null;
	};
	
	//----- Clear other
	
	var other = function() {
		var i = 0;
		var j = 0;
		var adclass = ["adsbygoogle", "adsense", "facebook-bnr"];
		for(i=0;i<adclass.length;i++) {
			var ads = $("."+adclass[i]);
			for(j=0;j<ads.length;j++) {
				ads[j].parentNode.removeChild(ads[j]);
			}
		}
	};
	
	//----- Control Bar-----
	var controlbar = function() {
		var tbox = document.getElementById("t-box");
		var ctrl = document.createElement("div");
		ctrl.setAttribute("style",
			"width: 950px;"+
			"white-space: nowrap;"+
			"text-align: center;"+
			"background-color: #848280;"+
			"border-bottom-style: solid;"+
			"border-bottom-width: 1px;"+
			"padding: 10px 0;"
		);
		
		ctrl.setAttribute("id", "ctrlboxy");
		
		var start = document.createElement("button");
		start.setAttribute("id", "startboxy");
		start.setAttribute("style",
			"font-size: 20px;"+
			"margin: 0 10px;"
		);
		
		var sec = document.createElement("input");
		sec.setAttribute("style",
			"width: 50px;"+
			"font-size: 20px;"+
			"margin-right: 10px;"
		);
		sec.setAttribute("id", "secboxy");
		
		var txt1 = document.createElement("span");
		txt1.setAttribute("style",
			"font-size: 20px;"+
			"margin-right: 10px;"+
			"color: #f0f0a9"
		);
		txt1.innerHTML = "秒, 同時抽到";
		
		var count = document.createElement("input");
		count.setAttribute("style",
			"width: 50px;"+
			"font-size: 20px;"+
			"margin-right: 10px;"
		);
		count.setAttribute("id", "countboxy");
		
		var txt2 = document.createElement("span");
		txt2.setAttribute("style",
			"font-size: 20px;"+
			"color: #f0f0a9"
		);
		txt2.innerHTML = "隻☆5時提醒";
		
		ctrl.appendChild(start);
		ctrl.appendChild(sec);
		ctrl.appendChild(txt1);
		ctrl.appendChild(count);
		ctrl.appendChild(txt2);
		
		tbox.parentNode.insertBefore(ctrl, tbox);
	};
	
	//----- Refresh Tool -----
	
	var refresh_tool = function() {
		var ms = null;
		var started = null;
		var refreshTimmer = null;
		var keyTimer = null;
		
		var set = function() {
			var c_started = getCookie("c_started");
			var c_ms = getCookie("c_ms");
			if(c_ms && ms==null) {
				ms = c_ms;
			} else if(!c_ms && ms==null) {
				ms = 60000;
			}
			document.cookie = "c_ms=" + escape(ms);
			document.getElementById('secboxy').value = ms/1000;

			if(c_started && started==null) {
				if(c_started=="true") {
					started = true;
				} else if(c_started=="false") {
					started = false;
				}
			} else if(!c_started && started==null) {
				started = false;
			}
			document.cookie = "c_started=" + escape(started);
			clearTimeout(refreshTimmer);
			if(started) {
				document.getElementById('startboxy').innerHTML = "自動重新整理(啟用中)";
				refreshTimmer = setTimeout(function(){
					location.reload();
				}, ms);
			} else {
				document.getElementById('startboxy').innerHTML = "自動重新整理(停止中)";
			}
		};
		
		var startboxy = document.getElementById("startboxy");
		startboxy.onclick = function() {
			if(started) {
				started = false;
			} else {
				started = true;
			}
			set();
		};
		
		var secboxy = document.getElementById("secboxy");
		secboxy.onkeyup = function() {
			if(keyTimer) clearTimeout(keyTimer);
			keyTimer = setTimeout(function() {
				ms = parseInt(document.getElementById('secboxy').value, 10) * 1000;
				if(ms>=5000) {
					set();
				} else {
					alert("不允許小於5秒");
				}
			}, 500);
		};
		
		set();
	};
	
	//----- Alert Tool -----
	
	var alert_tool = function() {
		var mp3 = "https://dl.dropboxusercontent.com/u/12316009/ms/StrikeShot.mp3";
		var i = 0;
		var j = 0;
		var c = 0;
		var cardtime = {};
		var tp = /☆5\s(\d+)\:(\d+)/;
		var cards = $("#c-box").getElementsByTagName("h1");
		for(i=0;i<cards.length;i++) {
			var m = cards[i].innerHTML.match(tp);
			if(m) {
				var n = parseInt(m[1], 10)*60+parseInt(m[2], 10);
				if(cardtime[n]) {
					cardtime[n]++;
				} else {
					cardtime[n] = 1;
				}
			} else {
				cards[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
			}
		}
		//console.log(JSON.stringify(cardtime));
		
		var countboxy = document.getElementById("countboxy");
		countboxy.onkeyup = function() {
			c = parseInt(document.getElementById('countboxy').value, 10);
			document.cookie = "c_count=" + escape(c);
		};
		
		var c_count = getCookie("c_count");
		if(c_count) {
			c = parseInt(c_count, 10);
		} else {
			c = 3; //預設值
			document.cookie = "c_count=" + escape(c);
		}
		countboxy.value = c;
		
		var c_cardtime = getCookie("c_cardtime");
	   	
		if(c_cardtime != JSON.stringify(cardtime)) {
			var c_cardtime_obj = JSON.parse(c_cardtime);
			document.cookie = "c_cardtime=" + escape(JSON.stringify(cardtime));
			
			for(p in c_cardtime_obj) {
				for(q in cardtime) {
					if(q == p) {
						delete cardtime[p];
					}
				}
			}
			
			for(j in cardtime) {
				//console.log(parseInt((j/60), 10), ":", j%60);
				if(cardtime[j] >= c) {
					var audio = document.createElement('audio');
					audio.autoplay = "autoplay";
					var source = document.createElement('source');
					source.src = mp3;
					source.type = "audio/mpeg";
					audio.appendChild(source);
					document.getElementsByTagName("body")[0].appendChild(audio);
					break;
				}
			}
			
		}
	};
	
	// Remove AD
	var del = function() {
		var remove = function(obj) {
			obj.parentNode.removeChild(obj);
		};
		
		for(var i = 1; i < 100; i++) {
			clearTimeout(i);
		}
		$("#for-ad-blocker").style.display="none";
		$("#site-box").style.display="";
		$("#a-box").style.marginBottom = "-15px";
		$("#ypaAdWrapper-monst_2a").innerHTML="";
		$("#ypaAdWrapper-monst_2b").innerHTML="";
	};
	
	//主函式
	if(navigator.userAgent.match("Firefox")) {
		del();
		controlbar();
		refresh_tool();
		alert_tool();
		window.onload = function() {
			other();
		};
	} else {
		del();
		controlbar();
		other();
		refresh_tool();
		alert_tool();
	}
})();