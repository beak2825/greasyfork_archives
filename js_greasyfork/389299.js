// ==UserScript==
// @name              极速解析
// @namespace         https://github.com/qiusunshine/movienow
// @version           1.1.0
// @icon              https://www.baidu.com/favicon.ico
// @description       VIP接口解析
// @author            一叶飘零
// @license           MIT
// @supportURL        https://github.com/qiusunshine/movienow
// @match             *.le.com/*
// @match             *.iqiyi.com/*
// @match             *.youku.com/*
// @match             *.letv.com/*
// @match             *v.qq.com/*
// @match             *.tudou.com/*
// @match             *.mgtv.com/*
// @match             *.sohu.com/*
// @run-at            document-idle
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/389299/%E6%9E%81%E9%80%9F%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/389299/%E6%9E%81%E9%80%9F%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function() {
    var apis = [
    {"name": "89免费解析","url":"http://www.ka61b.cn/jx.php?url="},
    {"name": "芒果蓝光解析", "url": "http://www.guandianzhiku.com/v/s/?url="},
    {"name": "智能解析", "url": "https://api.smq1.com/?url="},
    {"name": "够买解析", "url": "http://jx.vipshares.xyz/index1.php?url="},
    {"name": "极速解析", "url": "http://jx.iztyy.com/svip/?url="},
    {"name": "17K解析", "url": "http://17kyun.com/api.php?url="},
    {"name": "小白兔解析", "url": "https://vip.bljiex.com/?v="},
    {"name": "优酷专属", "url": "http://p.p40.top/?v="},
    {"name": "豪华解析", "url": "http://api.xyingyu.com/?url="},
    {"name": "AT解析", "url": "http://at520.cn/jx/?url=http://www.cmys.tv/?url="},
    {"name": "神马解析", "url": "http://beaacc.com/api.php?url="},
    {"name": "猫猫爱解析", "url": "http://baidu.com.miaomiaoai.cn/vip/index.php?url="},
    {"name": "紫云解析", "url": "http://api.smq1.com/?url="},
    {"name": "吾爱解析", "url": "https://www.fantee.net/fantee/?url="},
    {"name": "紫陌解析", "url": "http://jx.598110.com/zuida.php?url="},
    {"name": "初心解析", "url": "http://jx.bwcxy.com/?v="},
    {"name": "科技解析", "url": "http://ka61b.cn/jx.php?url="},
    {"name": "1907影视", "url": "https://z1.m1907.cn/?jx="},
    {"name": "清风明月", "url": "http://fateg.xyz/?url="},
	{"name": "万能", "url": "http://api.lkdmkj.com/jx/jx00/index.php?url="},
	{"name": "vip多线路", "url": "http://api.ledboke.com/vip/?url="},
    {"name": "618G", "url": "https://jx.618g.com/?url="}];
    loadVipFunc();

	function loadVipFunc(){
	    var domain = location.href.split("?");
	    var ye = "<span style='display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;'>★</span>";
	    if (domain[0].match(".iqiyi.com") || domain[0].match(".youku.com") || domain[0].match(".le.com") || domain[0].match(".letv.com") || domain[0].match("v.qq.com") || domain[0].match(".tudou.com") || domain[0].match(".mgtv.com") || domain[0].match(".sohu.com")) {
    		var myBtn = document.createElement("div");
	    	myBtn.id = "myBtn2019";
    		myBtn.innerHTML = "☆";
    		myBtn.setAttribute("style", "width:12vw;height:12vw;position:fixed;bottom:25vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:12vw;box-shadow:0px 1px 3px rgba(0,0,0,0.3);font-size:4.5vw;background:#fafafa;");
    		myBtn.onclick = function() {
			    loadVip(location.href);
		    };
	    	document.body.appendChild(myBtn);
    		var myul = document.createElement("ul");
		    myul.id = "myul2019";
	    	myul.setAttribute("style", "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:35vh;right:12vw;z-index:99999;height:60vh;overflow:scroll;border-radius:1.26vw;");
	    	for (var i = 0; i < apis.length; i++) {
	    		var myli = document.createElement("li");
	    		var that = this;
    			myli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
    			(function(num) {
			    	myli.onclick = function() {
			    		window.open(apis[num].url + tryGetRealUrl(location.href), '_blank');
		    		};
		    		myli.ontouchstart = function() {
				    	this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
			    	};
			    	myli.ontouchend = function() {
				    	this.style.cssText += "color:black;background:transparent;border-radius:0;";
			    	};
		    	})(i);
		    	myli.innerHTML = apis[i].name;
		    	myul.appendChild(myli);
	    	}
	    	document.body.appendChild(myul);
    		//让视频区域显示文字，直接解析
		    showVipTitle(location.href);
	    }
	}
	function showVipTitle(url) {
		var titleStr = "视频连接成功！点击选择解析接口";
		if (url.indexOf("iqiyi.com") != -1) {
			var iframe = document.getElementById('_if');
			if (iframe) {
				window.location.reload();
				return;
			}
			var i = document.getElementsByClassName('m-video-player-wrap')[0];
			if (typeof(i) != 'undefined') {
				i.style.height = '220px';
				i.style.color = '#fff';
				i.style.lineHeight = '15';
				i.style.position = 'static';
				i.style.paddingTop = '0%';
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('tap',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("v.qq.com") != -1) {
			var g = document.getElementsByClassName('site_player')[0];
			if (typeof(g) != 'undefined') {
				g.style.height = '210px';
				g.style.background = '#000000';
				g.style.textAlign = 'center';
				g.style.color = '#fff';
				g.style.lineHeight = '14';
				g.innerHTML = '<div>' + titleStr + '</div>';
				g.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("m.le.com") != -1) {
			var f = document.getElementsByClassName('playB')[0];
			if (typeof(f) != 'undefined') {
				f.style.background = '#000000';
				f.innerHTML = '<div>' + titleStr + '</div>';
				f.style.width = '100%';
				f.style.textAlign = 'center';
				f.style.lineHeight = '14';
				f.style.color = '#fff';
				f.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("youku.com") != -1) {
			var e = document.getElementById('playerBox');
			if (typeof(e) != 'undefined') {
				e.style.background = '#000000';
				e.style.color = '#fff';
				e.style.textAlign = 'center';
				e.style.lineHeight = '15';
				e.innerHTML = '<div>' + titleStr + '</div>';
				e.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
			
		} else if (url.indexOf("youku.com") != -1) {
			var d = document.getElementById('playerBox');
			if (typeof(d) != 'undefined') {
				d.style.background = '#000000';
				d.style.color = '#fff';
				d.style.textAlign = 'center';
				d.style.lineHeight = '15';
				d.innerHTML = '<div>' + titleStr + '</div>';
				d.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("mgtv.com") != -1) {
			var c = document.getElementsByClassName('video-area')[0];
			if (typeof(c) != 'undefined') {
				c.style.background = '#000000';
				c.style.color = '#fff';
				c.style.textAlign = 'center';
				c.style.lineHeight = '16';
				c.innerHTML = '<div>' + titleStr + '</div>';
				c.addEventListener('click',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("sohu.com") != -1) {
			var b = document.getElementsByClassName('x-player')[0];
			var x = document.getElementById('top-poster');
			if (typeof(b) != 'undefined') {
				b.style.background = '#000000';
				b.style.color = '#fff';
				b.style.textAlign = 'center';
				b.style.lineHeight = '13';
				b.innerHTML = '<div>' + titleStr + '</div>';
				b.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			} else if (typeof(x) != 'undefined') {
				x.style.background = '#000000';
				x.style.color = '#fff';
				x.style.height = '210px';
				x.style.textAlign = 'center';
				x.style.lineHeight = '13';
				x.innerHTML = '<div>' + titleStr + '</div>';
				x.addEventListener('click',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("baofeng.com") != -1) {
			var myVideo = document.getElementsByTagName('video')[0];
			myVideo.pause();
			var a = document.getElementById('videoplayer');
			if (typeof(a) != 'undefined') {
				a.style.background = '#000000';
				a.style.textAlign = 'center';
				a.style.color = '#fff';
				a.style.lineHeight = '17';
				a.innerHTML = '<div>' + titleStr + '</div>';
				a.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		}
	}
	function tryGetRealUrl(url) {
		var realUrl = url;
		try {
			realUrl = getRealUrl(url);
		} catch(err) {
			console.log(err);
		}
		return realUrl;
	}
	function getYoukuRealUrl(url) {
		var li = document.getElementsByClassName('hot-row-bottom')[0].children[0];
		var data = li.getAttribute('data-param');
		var s = data.split('svid=');
		if (s.length > 1) {
			var svid = s[1].split('&')[0];
			return 'https://v.youku.com/v_show/id_' + svid + '.html';
		}
		return url;
	}
	function getRealUrl(url) {
		var dataurl2 = url;
		var txurlc = dataurl2.split(":");
		var txurl = txurlc[1].slice(0, 12);
		var ykurl = txurlc[1].slice(0, 13);
		var ykdata = txurlc[1].slice(13);
		var funurl = txurlc[1].slice(0, 11);
		if (ykurl == '//m.youku.com') {
			return getYoukuRealUrl(url);
		}
		if (ykurl == '//m.youku.com') {
			var txurlc0 = dataurl2.split(":");
			var ykurl0 = txurlc[1].slice(0, 13);
			var ykdata0 = txurlc[1].slice(13);
			dataurl2 = 'http://www.youku.com' + ykdata;
		} else if (ykurl == '//m.iqiyi.com') {
			var txurl0 = dataurl2.split(":");
			var ykurl00 = txurlc[1].slice(0, 13);
			var ykdata00 = txurlc[1].slice(13);
			dataurl2 = 'https://www.iqiyi.com' + ykdata;
		} else if (txurl == '//m.v.qq.com') {
			var vid = getParam(dataurl2, "vid");
			var cid = getParam(dataurl2, "cid");
			var txdata2 = dataurl2.split("?");
			var str = "play.html";
			if (txdata2[0].slice(txdata2[0].length - str.length) == str) {
				if (cid.length > 1) {
					dataurl2 = "https://v.qq.com/x/cover/" + cid + ".html";
					return dataurl2;
				} else if (vid.length == 11) {
					return "https://v.qq.com/x/page/" + vid + ".html";
				}
			}
			cid = txdata2[0].slice( - 20, -5);
			if (vid.length == 11) {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '/' + vid + '.html';
			} else {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '.html';
			}
		} else if (ykurl == '//m.le.com/vp') {
			var leurlc = dataurl2.split("_");
			var leurl = leurlc[1];
			dataurl2 = 'http://www.le.com/ptv/vplay/' + leurl;
		}
		return dataurl2;
	}
	function getParam(dataurl2, name) {
		return dataurl2.match(new RegExp('[?&]' + name + '=([^?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
	}
	function loadVip(url) {
		var myBtn = document.getElementById("myBtn2019");
		var myul = document.getElementById("myul2019");
		if (myul.style.display == "none") {
			myul.style.display = "block";
			myBtn.innerHTML = "➕";
			myBtn.style.transform = "rotateZ(45deg)";
		} else {
			myul.style.display = "none";
			myBtn.innerHTML = "☆";
			myBtn.style.transform = "rotateZ(0deg)";
		}
	}
})();// ==UserScript==
// @name              极速解析
// @namespace         https://github.com/qiusunshine/movienow
// @version           1.1.0
// @icon              https://www.baidu.com/favicon.ico
// @description       VIP接口解析
// @author            一叶飘零
// @license           MIT
// @supportURL        https://github.com/qiusunshine/movienow
// @match             *.le.com/*
// @match             *.iqiyi.com/*
// @match             *.youku.com/*
// @match             *.letv.com/*
// @match             *v.qq.com/*
// @match             *.tudou.com/*
// @match             *.mgtv.com/*
// @match             *.sohu.com/*
// @run-at            document-idle
// @grant             unsafeWindow
// ==/UserScript==
(function() {
    var apis = [
    {"name": "89免费解析","url":"http://www.ka61b.cn/jx.php?url="},
    {"name": "芒果蓝光解析", "url": "http://www.guandianzhiku.com/v/s/?url="},
    {"name": "智能解析", "url": "https://api.smq1.com/?url="},
    {"name": "够买解析", "url": "http://jx.vipshares.xyz/index1.php?url="},
    {"name": "极速解析", "url": "http://jx.iztyy.com/svip/?url="},
    {"name": "17K解析", "url": "http://17kyun.com/api.php?url="},
    {"name": "小白兔解析", "url": "https://vip.bljiex.com/?v="},
    {"name": "优酷专属", "url": "http://p.p40.top/?v="},
    {"name": "豪华解析", "url": "http://api.xyingyu.com/?url="},
    {"name": "AT解析", "url": "http://at520.cn/jx/?url=http://www.cmys.tv/?url="},
    {"name": "神马解析", "url": "http://beaacc.com/api.php?url="},
    {"name": "猫猫爱解析", "url": "http://baidu.com.miaomiaoai.cn/vip/index.php?url="},
    {"name": "紫云解析", "url": "http://api.smq1.com/?url="},
    {"name": "吾爱解析", "url": "https://www.fantee.net/fantee/?url="},
    {"name": "紫陌解析", "url": "http://jx.598110.com/zuida.php?url="},
    {"name": "初心解析", "url": "http://jx.bwcxy.com/?v="},
    {"name": "科技解析", "url": "http://ka61b.cn/jx.php?url="},
    {"name": "1907影视", "url": "https://z1.m1907.cn/?jx="},
    {"name": "清风明月", "url": "http://fateg.xyz/?url="},
	{"name": "万能", "url": "http://api.lkdmkj.com/jx/jx00/index.php?url="},
	{"name": "vip多线路", "url": "http://api.ledboke.com/vip/?url="},
    {"name": "618G", "url": "https://jx.618g.com/?url="}];
    loadVipFunc();

	function loadVipFunc(){
	    var domain = location.href.split("?");
	    var ye = "<span style='display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;'>★</span>";
	    if (domain[0].match(".iqiyi.com") || domain[0].match(".youku.com") || domain[0].match(".le.com") || domain[0].match(".letv.com") || domain[0].match("v.qq.com") || domain[0].match(".tudou.com") || domain[0].match(".mgtv.com") || domain[0].match(".sohu.com")) {
    		var myBtn = document.createElement("div");
	    	myBtn.id = "myBtn2019";
    		myBtn.innerHTML = "☆";
    		myBtn.setAttribute("style", "width:12vw;height:12vw;position:fixed;bottom:25vh;right:10vw;z-index:100000;border-radius:100%;text-align:center;line-height:12vw;box-shadow:0px 1px 3px rgba(0,0,0,0.3);font-size:4.5vw;background:#fafafa;");
    		myBtn.onclick = function() {
			    loadVip(location.href);
		    };
	    	document.body.appendChild(myBtn);
    		var myul = document.createElement("ul");
		    myul.id = "myul2019";
	    	myul.setAttribute("style", "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:35vh;right:12vw;z-index:99999;height:60vh;overflow:scroll;border-radius:1.26vw;");
	    	for (var i = 0; i < apis.length; i++) {
	    		var myli = document.createElement("li");
	    		var that = this;
    			myli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
    			(function(num) {
			    	myli.onclick = function() {
			    		window.open(apis[num].url + tryGetRealUrl(location.href), '_blank');
		    		};
		    		myli.ontouchstart = function() {
				    	this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
			    	};
			    	myli.ontouchend = function() {
				    	this.style.cssText += "color:black;background:transparent;border-radius:0;";
			    	};
		    	})(i);
		    	myli.innerHTML = apis[i].name;
		    	myul.appendChild(myli);
	    	}
	    	document.body.appendChild(myul);
    		//让视频区域显示文字，直接解析
		    showVipTitle(location.href);
	    }
	}
	function showVipTitle(url) {
		var titleStr = "视频连接成功！点击选择解析接口";
		if (url.indexOf("iqiyi.com") != -1) {
			var iframe = document.getElementById('_if');
			if (iframe) {
				window.location.reload();
				return;
			}
			var i = document.getElementsByClassName('m-video-player-wrap')[0];
			if (typeof(i) != 'undefined') {
				i.style.height = '220px';
				i.style.color = '#fff';
				i.style.lineHeight = '15';
				i.style.position = 'static';
				i.style.paddingTop = '0%';
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('tap',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("v.qq.com") != -1) {
			var g = document.getElementsByClassName('site_player')[0];
			if (typeof(g) != 'undefined') {
				g.style.height = '210px';
				g.style.background = '#000000';
				g.style.textAlign = 'center';
				g.style.color = '#fff';
				g.style.lineHeight = '14';
				g.innerHTML = '<div>' + titleStr + '</div>';
				g.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("m.le.com") != -1) {
			var f = document.getElementsByClassName('playB')[0];
			if (typeof(f) != 'undefined') {
				f.style.background = '#000000';
				f.innerHTML = '<div>' + titleStr + '</div>';
				f.style.width = '100%';
				f.style.textAlign = 'center';
				f.style.lineHeight = '14';
				f.style.color = '#fff';
				f.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("youku.com") != -1) {
			var e = document.getElementById('playerBox');
			if (typeof(e) != 'undefined') {
				e.style.background = '#000000';
				e.style.color = '#fff';
				e.style.textAlign = 'center';
				e.style.lineHeight = '15';
				e.innerHTML = '<div>' + titleStr + '</div>';
				e.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
			
		} else if (url.indexOf("youku.com") != -1) {
			var d = document.getElementById('playerBox');
			if (typeof(d) != 'undefined') {
				d.style.background = '#000000';
				d.style.color = '#fff';
				d.style.textAlign = 'center';
				d.style.lineHeight = '15';
				d.innerHTML = '<div>' + titleStr + '</div>';
				d.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("mgtv.com") != -1) {
			var c = document.getElementsByClassName('video-area')[0];
			if (typeof(c) != 'undefined') {
				c.style.background = '#000000';
				c.style.color = '#fff';
				c.style.textAlign = 'center';
				c.style.lineHeight = '16';
				c.innerHTML = '<div>' + titleStr + '</div>';
				c.addEventListener('click',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("sohu.com") != -1) {
			var b = document.getElementsByClassName('x-player')[0];
			var x = document.getElementById('top-poster');
			if (typeof(b) != 'undefined') {
				b.style.background = '#000000';
				b.style.color = '#fff';
				b.style.textAlign = 'center';
				b.style.lineHeight = '13';
				b.innerHTML = '<div>' + titleStr + '</div>';
				b.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			} else if (typeof(x) != 'undefined') {
				x.style.background = '#000000';
				x.style.color = '#fff';
				x.style.height = '210px';
				x.style.textAlign = 'center';
				x.style.lineHeight = '13';
				x.innerHTML = '<div>' + titleStr + '</div>';
				x.addEventListener('click',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("baofeng.com") != -1) {
			var myVideo = document.getElementsByTagName('video')[0];
			myVideo.pause();
			var a = document.getElementById('videoplayer');
			if (typeof(a) != 'undefined') {
				a.style.background = '#000000';
				a.style.textAlign = 'center';
				a.style.color = '#fff';
				a.style.lineHeight = '17';
				a.innerHTML = '<div>' + titleStr + '</div>';
				a.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		}
	}
	function tryGetRealUrl(url) {
		var realUrl = url;
		try {
			realUrl = getRealUrl(url);
		} catch(err) {
			console.log(err);
		}
		return realUrl;
	}
	function getYoukuRealUrl(url) {
		var li = document.getElementsByClassName('hot-row-bottom')[0].children[0];
		var data = li.getAttribute('data-param');
		var s = data.split('svid=');
		if (s.length > 1) {
			var svid = s[1].split('&')[0];
			return 'https://v.youku.com/v_show/id_' + svid + '.html';
		}
		return url;
	}
	function getRealUrl(url) {
		var dataurl2 = url;
		var txurlc = dataurl2.split(":");
		var txurl = txurlc[1].slice(0, 12);
		var ykurl = txurlc[1].slice(0, 13);
		var ykdata = txurlc[1].slice(13);
		var funurl = txurlc[1].slice(0, 11);
		if (ykurl == '//m.youku.com') {
			return getYoukuRealUrl(url);
		}
		if (ykurl == '//m.youku.com') {
			var txurlc0 = dataurl2.split(":");
			var ykurl0 = txurlc[1].slice(0, 13);
			var ykdata0 = txurlc[1].slice(13);
			dataurl2 = 'http://www.youku.com' + ykdata;
		} else if (ykurl == '//m.iqiyi.com') {
			var txurl0 = dataurl2.split(":");
			var ykurl00 = txurlc[1].slice(0, 13);
			var ykdata00 = txurlc[1].slice(13);
			dataurl2 = 'https://www.iqiyi.com' + ykdata;
		} else if (txurl == '//m.v.qq.com') {
			var vid = getParam(dataurl2, "vid");
			var cid = getParam(dataurl2, "cid");
			var txdata2 = dataurl2.split("?");
			var str = "play.html";
			if (txdata2[0].slice(txdata2[0].length - str.length) == str) {
				if (cid.length > 1) {
					dataurl2 = "https://v.qq.com/x/cover/" + cid + ".html";
					return dataurl2;
				} else if (vid.length == 11) {
					return "https://v.qq.com/x/page/" + vid + ".html";
				}
			}
			cid = txdata2[0].slice( - 20, -5);
			if (vid.length == 11) {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '/' + vid + '.html';
			} else {
				dataurl2 = 'https://v.qq.com/x/cover/' + cid + '.html';
			}
		} else if (ykurl == '//m.le.com/vp') {
			var leurlc = dataurl2.split("_");
			var leurl = leurlc[1];
			dataurl2 = 'http://www.le.com/ptv/vplay/' + leurl;
		}
		return dataurl2;
	}
	function getParam(dataurl2, name) {
		return dataurl2.match(new RegExp('[?&]' + name + '=([^?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
	}
	function loadVip(url) {
		var myBtn = document.getElementById("myBtn2019");
		var myul = document.getElementById("myul2019");
		if (myul.style.display == "none") {
			myul.style.display = "block";
			myBtn.innerHTML = "➕";
			myBtn.style.transform = "rotateZ(45deg)";
		} else {
			myul.style.display = "none";
			myBtn.innerHTML = "☆";
			myBtn.style.transform = "rotateZ(0deg)";
		}
	}
})();