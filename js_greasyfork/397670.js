// ==UserScript==
// @name              新方圆VIP解析插件
// @namespace         https://github.com/qiusunshine/movienow
// @version           1.0.6
// @icon              https://www.baidu.com/favicon.ico
// @description       新方圆插件，VIP接口解析
// @author            小棉袄66
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
// @downloadURL https://update.greasyfork.org/scripts/397670/%E6%96%B0%E6%96%B9%E5%9C%86VIP%E8%A7%A3%E6%9E%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/397670/%E6%96%B0%E6%96%B9%E5%9C%86VIP%E8%A7%A3%E6%9E%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    var apis = [
	{"name": "初心解析", "url": "http://jx.bwcxy.com/?v="},
    {"name": "芒果蓝光解析", "url": "http://www.guandianzhiku.com/v/s/?url="},
    {"name": "1907影视", "url": "https://z1.m1907.cn/?jx="},
    {"name": "清风明月", "url": "http://fateg.xyz/?url="},
    {"name": "爱看碟解析", "url": "http://jx.ikandie.cn/?url="},
    {"name": "调试", "url": "https://vip.mpos.ren/v/?url="},
    {"name": "人人解析", "url": "https://cdn.yangju.vip/k/?url="},
	{"name": "初见解析", "url": "http://chujian.xiaoyule-app.cn/?url="},
	{"name": "黑米解析", "url": "https://www.heimijx.com/jx/api/?url="},
	{"name": "33解析", "url": "http://www.33tn.cn/?url="},
	{"name": "55解析", "url": "http://55jx.top/?url="},
	{"name":"128sp","url":"https://jx.128sp.com/jxjx/?url="},
	{"name":"607p","url":"http://607p.com/?url="},
	{"name":"69p","url":"http://69p.top/?url="},
	{"name":"74t","url":"http://74t.top/?url="},
	{"name":"55jx","url":"http://55jx.top/?url="},
	{"name":"playx","url":"http://playx.top/?url="},
	{"name":"泥潭9","url":"http://nitian9.com/?url="},
	{"name":"19g","url":"http://19g.top/?url="},
	{"name":"52088","url":"http://52088.online/?url="},
	{"name":"bofang","url":"http://bofang.online/?url="},
	{"name":"play1","url":"http://play1.online/?url="},
	{"name":"ckplay","url":"http://ckplay.online/?url="},
	{"name":"880看","url":"http://880kan.com/?url="},
	{"name":"95uv","url":"http://59uv.com/?url="},
	{"name":"优奇解析","url":"https://jx.youqi.tw/?v="},
	{"name":"1969解析","url":"http://ys.1969com.cn/?url="},
	{"name":"58解析","url":"https://jx.km58.top/jx/?url="},
	{"name":"快视宝3号解析","url":"http://jx.q73w.cn/jx03/?rl="},
    {"name":"快视宝4号解析","url":"http://jx.q73w.cn/jx04/?url="},
	{"name": "福祥影视", "url": "http://jx.hao0606.com/?url="},
	{"name": "地久天长", "url": "http://www.lexiangsj.xyz/?v="},
	{"name": "无广告秒播", "url": "http://jx.98a.ink/?v="},
	{"name": "无极速", "url": "http://jx.6666txt.com/?url="},
    {"name": "XYZ视频解析（二次）", "url": "http://vipjx.pyhj.net/?url="},
	{"name": "kh38解析", "url": "http://jx.kh38.cn/?url="},
	{"name":"云解析","url":"http://gege.ha123.club/gege1234/index.php?url="},
    {"name": "猪蹄无广告", "url": "http://jx.iztyy.com/svip/?url="},
	{"name": "猪蹄无广告1", "url": "https://jx.iztyy.com/svip/?url="},
	{"name": "青山解析", "url": "http://api.cypay.me/?v="},
    {"name": "云渡", "url": "http://yy.6tc.top/jx/?url="},
    {"name": "解析吧", "url": "http://jx.jxba.cc/?url="},
    {"name": "花语有你", "url": "http://api.huahuay.com/?url="},
    {"name": "771解析", "url": "https://vip.qi71.cn/jiexi.php?url="},
    {"name": "狂野解析", "url": "https://api.653520.top/vip/?url="},
	{"name": "神农解析", "url": "http://zx.asys520.top/?url="},
	{"name": "傻猫解析", "url": "http://www.sillycat.xyz/jx/?url="},
	{"name": "黑云解析", "url": "http://jx.daheiyun.com/?url="},
    {"name": "叮咚", "url": "http://jiexi.exdnd.com/?url="},
    {"name": "蛋壳", "url": "http://www.58danke.top/jx/xin?url="},
	{"name": "1616解析", "url": "https://www.1616jx.com/jx/api.php?url="},
    {"name": "Beaacc", "url": "https://beaacc.com/api.php?url="},
	{"name": "我爱解析", "url": "http://jx.52a.ink/?url="},
	{"name": "超能解析", "url": "http://jiexi.44cn.net/byg/index.php?url="},
	{"name": "瑞特解析", "url": "http://jx.0421v.pw/index.php?url="},
	{"name": "360dy解析", "url": "http://yun.360dy.wang/jx.php?url="},
	{"name": "久久云解析", "url": "http://jx.99yyw.com/api/?url="},
	{"name": "芽芽智能", "url": "http://jx.yayaol.xyz/?url="},
	{"name": "A.xinVIP解析", "url": "http://tv.cuione.cn/?url="},
	{"name": "范特尔", "url": "http://jx.79it.cn/?url="},
	{"name": "OK解析", "url": "http://okjx.cc/?url="},
	{"name": "玩得嗨", "url": "http://tv.wandhi.com/go.html?url="},
	{"name": "船长解析", "url": "http://czjx8.com/?url="},
	{"name": "万能", "url": "http://api.lkdmkj.com/jx/jx00/index.php?url="},
	{"name": "免VIP智能", "url": "https://v.mvipsp.top/?v="},
	{"name": "17K云", "url": "http://17kyun.com/api.php?url="},
	{"name": "高端解析", "url": "http://api.51ckm.com/jx.php?url="},
	{"name": "高端解析1", "url": "http://api.hlglwl.com/jx.php?url="},
	{"name": "vip多线路", "url": "http://api.ledboke.com/vip/?url="},
	{"name": "AT520", "url": "http://at520.cn/jx/?url="},
	{"name": "酷博", "url": "http://jx.x-99.cn/api.php?id="},
	{"name": "金桥解析", "url": "http://jqaaa.com/jx.php?url="},
	{"name": "石头云", "url": "http://jiexi.071811.cc/jx.php?url="},
	{"name": "1717云", "url": "http://www.1717yun.com/jx/ty.php?url="},
	{"name": "牛巴巴", "url": "http://mv.688ing.com/player?url="},
	{"name": "FlvPS", "url": "https://api.flvsp.com/?url="},
	{"name": "660e", "url": "https://660e.com/?url="},
	{"name": "WoCao", "url": "https://www.wocao.xyz/index.php?url="},
	{"name": "思古解析", "url": "https://api.sigujx.com/?url="},
	{"name": "神马解析", "url": "http://baidukan.top/jx.php?url="},
	{"name": "超清干货", "url": "http://k8aa.com/jx/index.php?url="},
	{"name": "影院解析", "url": "http://52jx.top/?url="},
	{"name": "快视宝", "url": "http://jx.q73w.cn/jx05/?url="},
	{"name": "智能解析", "url": "http://jx.lache.me/cc/?url="},
	{"name": "流氓凡解析", "url": "https://jx.wslmf.com/?url="},
    {"name": "618G", "url": "https://jx.618g.com/?url="}];
    loadVipFunc();

	function loadVipFunc(){
	    var domain = location.href.split("?");
	    var ye = "<span style='display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;'>★</span>";
	    if (domain[0].match(".iqiyi.com") || domain[0].match(".youku.com") || domain[0].match(".le.com") || domain[0].match(".letv.com") || domain[0].match("v.qq.com") || domain[0].match(".tudou.com") || domain[0].match(".mgtv.com") || domain[0].match(".sohu.com")) {
    		var myBtn = document.createElement("div");
	    	myBtn.id = "myBtn2019";
    		myBtn.innerHTML = "➿‍";
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
		    	myul.appendChild(myli)
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
			};
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
				})
			};
		} else if (url.indexOf("v.qq.com") != -1) {
			var i = document.getElementsByClassName('site_player')[0];
			if (typeof(i) != 'undefined') {
				i.style.height = '210px';
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.style.color = '#fff';
				i.style.lineHeight = '14';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				})
			};
		} else if (url.indexOf("m.le.com") != -1) {
			var i = document.getElementsByClassName('playB')[0];
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.style.width = '100%';
				i.style.textAlign = 'center';
				i.style.lineHeight = '14';
				i.style.color = '#fff';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("youku.com") != -1) {
			var i = document.getElementById('playerBox');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '15';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("mgtv.com") != -1) {
			var i = document.getElementsByClassName('video-area')[0];
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '16';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('click',
				function(e) {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("sohu.com") != -1) {
			var i = document.getElementsByClassName('x-player')[0];
			var x = document.getElementById('top-poster');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.color = '#fff';
				i.style.textAlign = 'center';
				i.style.lineHeight = '13';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
				function(e) {
					loadVip(window.location.href);
				})
			} else if (typeof(x) != 'undefined') {
				x.style.background = '#000000';
				x.style.color = '#fff';
				x.style.height = '210px';
				x.style.textAlign = 'center';
				x.style.lineHeight = '13';
				i.innerHTML = '<div>' + titleStr + '</div>';
				x.addEventListener('click',
				function() {
					loadVip(window.location.href);
				});
			}
		} else if (url.indexOf("baofeng.com") != -1) {
			var myVideo = document.getElementsByTagName('video')[0];
			myVideo.pause();
			var i = document.getElementById('videoplayer');
			if (typeof(i) != 'undefined') {
				i.style.background = '#000000';
				i.style.textAlign = 'center';
				i.style.color = '#fff';
				i.style.lineHeight = '17';
				i.innerHTML = '<div>' + titleStr + '</div>';
				i.addEventListener('touchstart',
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
			var txurlc = dataurl2.split(":");
			var ykurl = txurlc[1].slice(0, 13);
			var ykdata = txurlc[1].slice(13);
			dataurl2 = 'http://www.youku.com' + ykdata;
		} else if (ykurl == '//m.iqiyi.com') {
			var txurlc = dataurl2.split(":");
			var ykurl = txurlc[1].slice(0, 13);
			var ykdata = txurlc[1].slice(13);
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
			myBtn.innerHTML = "➿";
			myBtn.style.transform = "rotateZ(0deg)";
		}
	}
})();