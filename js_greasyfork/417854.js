// ==UserScript==
// @name         小王视频解析
// @namespace    baiwudu.com
// @version      1.1.2
// @description  各大视频网站VIP会员视频免费看，支持各大视频网站，操作更加便捷
// @author       作者：王总
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.wasu.cn/Play/show/id/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/*
// @match        *://v.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://kuhuiv.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/417854/%E5%B0%8F%E7%8E%8B%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/417854/%E5%B0%8F%E7%8E%8B%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
 var url=location.href;
if(url.match(/(.*?):\/\/v.youku.com\/v_show\/id_(.*?)/)||url.match(/(.*?):\/\/v.qq.com\/x\/cover\/(.*?)/)||url.match(/(.*?):\/\/v.qq.com\/variety\/p\/topic\/(.*?)/)||url.match(/(.*?):\/\/w.mgtv.com\/b\/(.*?)/)||url.match(/(.*?):\/\/www.mgtv.com\/b\/(.*?)/)||url.match(/(.*?):\/\/tw.iqiyi.com\/v_(.*?)/)||url.match(/(.*?):\/\/www.iqiyi.com\/v_(.*?)/)||url.match(/(.*?):\/\/www.iqiyi.com\/a_(.*?)/)||url.match(/(.*?):\/\/tv.sohu.com\/v\/(.*?)/)||url.match(/(.*?):\/\/film.sohu.com\/album\/(.*?)/)||url.match(/(.*?):\/\/www.le.com\/ptv\/vplay\/(.*?)/)||url.match(/(.*?):\/\/v.pptv.com\/show\/(.*?)/)||url.match(/(.*?):\/\/vip.1905.com\/play\/(.*?)/)||url.match(/(.*?):\/\/www.wasu.cn\/Play\/show\/id\/(.*?)/)||url.match(/(.*?):\/\/www.miguvideo.com\/mgs\/website\/prd\/detail.html?cid=(.*?)/)||url.match(/(.*?):\/\/www.fun.tv\/vplay\/g-(.*?)/)||url.match(/(.*?):\/\/www.bilibili.com\/bangumi\/play\/(.*?)/)||url.match(/(.*?):\/\/www.bilibili.com\/blackboard\/(.*?)/)||url.match(/(.*?):\/\/www.bilibili.com\/(.*?)video\/(.*?)/)||url.match(/(.*?):\/\/player.bilibili.com\/(.*?)/)||url.match(/(.*?):\/\/(.*?).tudou.com\/v\/(.*?)/)||url.match(/(.*?):\/\/(.*?).tudou.com\/(.*?)\/id_(.*?)/)||url.match(/(.*?):\/\/v-wb.youku.com\/v_show\/id_(.*?)/)||url.match(/(.*?):\/\/vku.youku.com\/live\/(.*?)/)||url.match(/(.*?):\/\/w.mgtv.com\/l\/(.*?)/)||url.match(/(.*?):\/\/w.mgtv.com\/s\/(.*?)/)||url.match(/(.*?):\/\/www.mgtv.com\/l\/(.*?)/)||url.match(/(.*?):\/\/www.mgtv.com\/s\/(.*?)/)||url.match(/(.*?):\/\/www.mgtv.com\/act\/(.*?)/)||url.match(/(.*?):\/\/haokan.baidu.com\/v(.*?)/)||url.match(/(.*?):\/\/www.asys.vip\/kuaishou(.*?)/)||url.match(/(.*?):\/\/tieba.baidu.com\/p\/(.*?)/)||url.match(/(.*?):\/\/www.zuidazy4.com\/index.php(.*?)/)||url.match(/(.*?):\/\/www.zuidazy4.com\/?m=vod-detail-id-(.*?)/)||url.match(/(.*?):\/\/movie.douban.com\/subject\/(.*?)/)||url.match(/(.*?):\/\/www.acfun.cn\/(.*?)\/ac(.*?)/)||url.match(/(.*?):\/\/www.cupfox.com\/search(.*?)/)||url.match(/(.*?):\/\/www.bumimi.top\/search\/(.*?)/)||url.match(/(.*?):\/\/www.youtube.com\/(.*?)/)||url.match(/(.*?):\/\/blueconvert.com\/?id=(.*?)/)||url.match(/(.*?):\/\/(.*?)\/htm_data\/(.*?).html/)||url.match(/(.*?):\/\/www.wasu.cn\/wap\/(.*?)\/show\/id\/(.*?)/)||url.match(/(.*?):\/\/m.youku.com\/(.*?)\/id_(.*?)/)||url.match(/(.*?):\/\/m.mgtv.com\/b\/(.*?)/)||url.match(/(.*?):\/\/m.pptv.com\/show\/(.*?)/)||url.match(/(.*?):\/\/m.tv.sohu.com\/v(.*?)/)||url.match(/(.*?):\/\/m.tv.sohu.com\/u\/(.*?)/)||url.match(/(.*?):\/\/m.tv.sohu.com\/phone_play_film(.*?)/)||url.match(/(.*?):\/\/m.le.com\/vplay_(.*?)/)||url.match(/(.*?):\/\/m.iqiyi.com\/v_(.*?)/)||url.match(/(.*?):\/\/m.v.qq.com\/(.*?)/)||url.match(/(.*?):\/\/3g.v.qq.com\/(.*?)/)){

 

if (document.querySelector("script#jiangxiaobai-sobj")) {} else { 	

// ==UserScript==
// @version 4.0
// ==/UserScript==

(function() {
	if (self != top) {
		return false;
	} else {
		var pchttpsjk, vipzdjx, vipjxtb, vipjxss, vipjxkjj, gbdmobj, jstgggobj, pdssgjcobj, mgzdgq, lkzdzt, zdbfqp;
		var obj = window.location.href;
		var tcdpaichuobj = obj.match(/^https?:\/\/(?:[^\/]+?\.cupfox\.|www\.zuidazy\d\.com(?!\/\?m=vod-detail-id-)|.+?\/htm_data\/)/);
		var ttblwobj = obj.match(/^https?:\/\/(?:w(?:ww)?\.mgtv\.com\/(?!b)[a-z]\/|(?:player|live)\.bilibili\.com|www\.bilibili\.com\/(?:cheese\/play|.*?video|blackboard)\/)/);
		var pcliwaiobj = obj.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\/|w(?:ww)?\.mgtv\.com\/(?:b|act)\/|www\.iqiyi\.com\/[av]_|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|v\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.wasu\.cn\/Play\/show\/id\/|www\.bilibili\.com\/bangumi\/play\/|www\.fun\.tv\/vplay\/g-|www\.miguvideo\.com\/mgs\/website\/prd\/detail\.html\?cid=)/);
		var sjliwaiobj = obj.match(/^https?:\/\/(?:m\.youku\.com\/.+?\/id_|m\.mgtv\.com\/b\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|m\.le\.com\/vplay_|m\.iqiyi\.com\/v_|www\.wasu\.cn\/wap\/.+?\/show\/id\/|(?:3g|m)\.v\.qq\.com\/.+?(?:cid=|cover\/))/);
		var bilibilipcliwaiobj = obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//) && document.title.indexOf("（僅限台灣地區）") > 0;
		var iqiyiapcliwaiobj = obj.match(/^https?:\/\/www\.iqiyi\.com\/a_/) && document.getElementsByTagName('video')[0] == null;
		var jxjkobj = obj.match(/^https?:\/\/.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:\w+?_\w+?|search|jx|url|id|v|&[^\/]+?|\w+?\.html\?\w+?)[#=\?]https?:\/\/[^\/]+?\.(?:youku|mgtv|sohu|pptv|wasu|1905|iqiyi|le|qq|bilibili|fun|miguvideo)\.)/);
		var cssremoveobj = iqiyiapcliwaiobj || jxjkobj;
		var vipzdjxwzobj = (pcliwaiobj && !bilibilipcliwaiobj && !iqiyiapcliwaiobj) || sjliwaiobj;
		var jxbpcobj = !/(?:phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(window.navigator.userAgent);
		var youtubespxzobj = obj.match(/^https?:\/\/www\.youtube\.com\//);
		(function() {
			let sobj = document.createElement('script');
			sobj.type = 'text/javascript';
			sobj.id = 'jiangxiaobai-sobj';
			document.head.appendChild(sobj);
		})();

		function jqjs() {
			(function() {
				try {
					if (document.getElementById('jiangxiaobaijqjs')) {
						return
					}
					if (typeof jQuery == 'undefined') {
						let s = document.createElement('script');
						s.type = 'text/javascript';
						s.src = 'https://cdn.jsdelivr.net/gh/btjson/player@latest/js/jquery.min.js';
						s.id = 'jiangxiaobaijqjs';
						s.onload = s.onreadystatechange = function() {
							if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
								this.onload = this.onreadystatechange = null
							}
						};
						document.head.appendChild(s)
					} else {}
				} catch (e) {
					return false;
				}
			})();
		};
		var remove = function(selector) {
				if (!document.querySelectorAll) {
					return;
				}
				var nodes = document.querySelectorAll(selector);
				if (nodes) {
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i] && nodes[i].parentNode) {
							nodes[i].parentNode.removeChild(nodes[i]);
						}
					}
				}
			};

		function removeobj(targetSelector, rootSelector = 'body', wait) {
			const rootElement = document.querySelector(rootSelector);
			const targetElement = rootElement.querySelector(targetSelector);
			if (targetElement) {
				return Promise.resolve(targetElement)
			}
			return new Promise((resolve, reject) => {
				const callback = function(matationList, observer) {
					const targetElement = rootElement.querySelector(targetSelector);
					if (targetElement) {
						resolve(targetElement);
						observer.disconnect()
					}
				};
				const observer = new MutationObserver(callback);
				observer.observe(rootElement, {
					subtree: true,
					childList: true
				});
				if (wait !== undefined) {
					setTimeout(() => {
						observer.disconnect()
					}, wait)
				}
			})
		};
		async function removeall(targetSelector, rootSelector, now = false) {
			if (now) {
				const parent = rootSelector ? document.querySelector(rootSelector) : document;
				if (parent) {
					const target = parent.querySelector(targetSelector);
					if (target) {
						target.remove();
						return true
					}
				}
				return false
			}
			const target = await removeobj(targetSelector, rootSelector);
			target.remove()
		};

		function cssobj(css) {
			document.head.insertAdjacentHTML("beforeend", '<style class="cssobj-jiangxiaobai" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
		};

		function dssxaobj() {
			setTimeout(function() {
				window.location.reload();
			}, 666);
		};

		function mgzdgqobj() {
			if (localStorage.getItem("mgzdgq") != null) {
				mgzdgq = localStorage.getItem("mgzdgq")
			} else {
				localStorage.setItem("mgzdgq", "1");
				dssxaobj();
			}
		};

		function bdzdjxobj() {
			if (localStorage.getItem("vipzdjx") != null) {
				vipzdjx = localStorage.getItem("vipzdjx")
			} else {
				localStorage.setItem("vipzdjx", "2");
				dssxaobj();
			}
		};

		function bdzdjxbyobj() {
			if (localStorage.getItem("vipzdjx") != null) {
				vipzdjx = localStorage.getItem("vipzdjx")
			} else {
				localStorage.setItem("vipzdjx", "1");
				dssxaobj();
			}
		};

		function bdjkobj() {
			if (localStorage.getItem("pchttpsjk") != null) {
				pchttpsjk = localStorage.getItem("pchttpsjk")
			} else {
				if (jxbpcobj) {
					if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
						pchttpsjk = '4';
						localStorage.setItem("pchttpsjk", "4");
					} else if (obj.match(/^https?:\/\/www\.fun\.tv\/vplay\/g-/)) {
						pchttpsjk = '4';
						localStorage.setItem("pchttpsjk", "4");
					} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
						pchttpsjk = '9';
						localStorage.setItem("pchttpsjk", "9");
					} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
						pchttpsjk = '6';
						localStorage.setItem("pchttpsjk", "6");
					} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
						pchttpsjk = '6';
						localStorage.setItem("pchttpsjk", "6");
					} else {
						pchttpsjk = '7';
						localStorage.setItem("pchttpsjk", "7");
					}
				} else {
					if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/v\//)) {
						pchttpsjk = '9';
						localStorage.setItem("pchttpsjk", "9");
					} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
						pchttpsjk = '9';
						localStorage.setItem("pchttpsjk", "9");
					} else {
						pchttpsjk = '7';
						localStorage.setItem("pchttpsjk", "7");
					}
				}
			}
		};

		function bdtbobj() {
			if (localStorage.getItem("vipjxtb") != null) {
				vipjxtb = localStorage.getItem("vipjxtb")
			} else {
				localStorage.setItem("vipjxtb", "1");
			}
			vipjxss = '1';
		};

		function zdjyobj() {
			if (localStorage.getItem("pchttpjk") != null) {
				localStorage.clear();
				dssxaobj();
			} else {}
			bdjkobj();
			bdtbobj();
		};

		function jxbzdjxobj() {
			bdzdjxobj();
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxli{display:block!important}1128059');
		};

		function bdvipzdjxobj() {
			if ((localStorage.getItem("vipzdjx") != null || localStorage.getItem("vipzdjx") === "1")) {
				vipzdjx = localStorage.getItem("vipzdjx");
			} else {
				localStorage.setItem("vipzdjx", "2");
				dssxaobj();
			}
		};

		function zdgbdmobj() {
			cssobj('div.maomibtn li#gbdmobjli{display:block!important}1128059');
			if (localStorage.getItem("gbdmobj") != null) {
				gbdmobj = localStorage.getItem("gbdmobj");
			} else {
				localStorage.setItem("gbdmobj", "1");
				dssxaobj();
			}
		};

		function jxbzdjxhyobj() {
			bdvipzdjxobj();
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxhyli{display:block!important}1128059');
		};

		function jxqtwzobj() {
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli{display:block!important}1128059');
		};

		function jxqtwzhyobj() {
			bdtbobj();
			cssobj('div.maomibtn li#vipjxtbli{display:block!important}div.maomibtn li>a[target="_blank"]:not([class="maomi"]):not([href*="//wpa.qq.com/msgrd"]):not([href*="/00/raw/master/"])');
		};

		function apddjobj() {
			let pdssgjcobj_counter = 0;
			let pdssgjcobj_jiankong = setInterval(function() {
				let pdssgjcobj_btn = $(pdssgjcobj).length == 1;
				if (pdssgjcobj_btn) {
					window.open(document.querySelector(pdssgjcobj + ':first-child').href, "_blank");
					window.close();
					clearInterval(pdssgjcobj_jiankong);
					return false
				}++pdssgjcobj_counter;
				if (pdssgjcobj_counter > 10) {
					clearInterval(pdssgjcobj_jiankong);
					return false
				}
			}, 456)
		};

		function jxbvolumeobj() {
			(function() {
				let videovolumea_counter = 0;
				let videovolumea_jiankong = setInterval(function() {
					try {
						if (document.getElementsByTagName('video')[0].volume == 0) {
							document.getElementsByTagName('video')[0].volume = 1;
							clearInterval(videovolumea_jiankong);
							return false
						}++videovolumea_counter;
						if (videovolumea_counter > 20) {
							clearInterval(videovolumea_jiankong);
							return false
						}
					} catch (e) {}
				}, 789)
			})();
			(function() {
				let videovolumeb_counter = 0;
				let videovolumeb_jiankong = setInterval(function() {
					try {
						if (document.getElementsByTagName('video')[0].volume == 0) {
							document.getElementsByTagName('video')[0].volume = 1;
							clearInterval(videovolumeb_jiankong);
							return false
						}++videovolumeb_counter;
						if (videovolumeb_counter > 20) {
							clearInterval(videovolumeb_jiankong);
							return false
						}
					} catch (e) {}
				}, 987)
			})();
			(function() {
				let videovolumec_counter = 0;
				let videovolumec_jiankong = setInterval(function() {
					try {
						if (document.getElementsByTagName("video")[0]) {
							let v_player = document.getElementsByTagName("video");
							for (let i = 0, length = v_player.length; i < length; i++) {
								v_player[i].muted = false;
								v_player[i].volume = 1;
								break;
								return
							}
							clearInterval(videovolumec_jiankong);
							return false
						}++videovolumec_counter;
						if (videovolumec_counter > 20) {
							clearInterval(videovolumec_jiankong);
							return false
						}
					} catch (e) {}
				}, 1234)
			})();
		};

		function shipingquanpingobj() {
			+(function() {
				let MO = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				if (MO) {
					let d = document;
					let f = d.getElementsByTagName('iframe');
					let a = "allowFullScreen";
					for (let i = 0; i < f.length; i++) {
						if (!f[i].getAttribute(a)) {
							f[i].setAttribute("data-ad", "false");
							f[i].setAttribute("autoLoad", "true");
							f[i].setAttribute("autoplay", "true");
							f[i].setAttribute("loading", "lazy");
							f[i].setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
							f[i].setAttribute("marginwidth", "0");
							f[i].setAttribute("marginheight", "0");
							f[i].setAttribute("allowfullscreen", "allowfullscreen");
							f[i].setAttribute("mozallowfullscreen", "mozallowfullscreen");
							f[i].setAttribute("msallowfullscreen", "msallowfullscreen");
							f[i].setAttribute("oallowfullscreen", "oallowfullscreen");
							f[i].setAttribute("webkitallowfullscreen", "webkitallowfullscreen");
							f[i].setAttribute("allowTransparency", "allowTransparency");
							f[i].src = f[i].src
						}
					};
					let dd = document;
					let ff = d.getElementsByTagName('video');
					let aa = "allowFullScreen";
					for (let j = 0; j < ff.length; j++) {
						ff[j].play();
						if (!ff[j].getAttribute(aa)) {
							ff[j].src = ff[j].src
						}
					}
				} else {}
			})();
		};

		function lkzdztobj() {
			if (localStorage.getItem("lkzdzt") != null) {
				lkzdzt = localStorage.getItem("lkzdzt")
			} else {
				localStorage.setItem("lkzdzt", "1");
				dssxaobj();
			}
			cssobj('div.maomibtn li#lkzdztbyli{display:block!important}1128059');
		};

		function waitForElement(targetSelector, rootSelector = 'body', wait) {
			const rootElement = document.querySelector(rootSelector);
			const targetElement = rootElement.querySelector(targetSelector);
			if (targetElement) {
				return Promise.resolve(targetElement)
			}
			return new Promise((resolve, reject) => {
				const callback = function(matationList, observer) {
					const targetElement = rootElement.querySelector(targetSelector);
					if (targetElement) {
						resolve(targetElement);
						observer.disconnect()
					}
				};
				const observer = new MutationObserver(callback);
				observer.observe(rootElement, {
					subtree: true,
					childList: true
				});
				if (wait !== undefined) {
					setTimeout(() => {
						observer.disconnect()
					}, wait)
				}
			})
		};
		async function autoClickElement(targetSelector, rootSelector, now = false) {
			if (now) {
				const parent = rootSelector ? document.querySelector(rootSelector) : document;
				if (parent) {
					const target = parent.querySelector(targetSelector);
					if (target) {
						target.click();
						return true
					}
				}
				return false
			}
			const target = await waitForElement(targetSelector, rootSelector);
			target.click()
		};

		function zdztsp() {
			(function() {
				setTimeout(function() {
					try {
						var pauseOnLeaveTab = true;
						var allowAutoPlayWithinMillisecondsOfClick = 500;
						var autoPlaySitesWhitelist = [];
						var autoPlaySourcesWhitelist = [];
						var handlePlayingInAdditionToPlayEvent = false;
						var allowPauseAgainAfterFirstFound = false;
						var treatPlayingLikeOnPlay = false;
						var hasAutoPlaySourcesWhitelist = autoPlaySourcesWhitelist.length > 0;
						var hasAutoPlaySitesWhitelist = autoPlaySitesWhitelist.length > 0;
						var lastClickTimeMs = 0;

						function isUrlMatch(url, pattern) {
							var regex = "https?\:\/\/[a-zA-Z0-9\.\-]*?\.?" + pattern.replace(/\./, "\.") + "\/";
							var reg = new RegExp(regex, "i");
							return url.match(reg) !== null
						}
						function isAutoPlayAllowedForSite(url) {
							if (hasAutoPlaySitesWhitelist) {
								for (var i = 0; i < autoPlaySitesWhitelist.length; i++) {
									if (isUrlMatch(url, autoPlaySitesWhitelist[i])) return true
								}
							}
							return false
						}
						if (isAutoPlayAllowedForSite(document.url)) {
							return
						}
						var tabHiddenPropertyName, tabVisibleChangedEventName;
						if ("undefined" !== typeof document.hidden) {
							tabHiddenPropertyName = "hidden";
							tabVisibleChangedEventName = "visibilitychange"
						} else if ("undefined" !== typeof document.webkitHidden) {
							tabHiddenPropertyName = "webkitHidden";
							tabVisibleChangedEventName = "webkitvisibilitychange"
						} else if ("undefined" !== typeof document.msHidden) {
							tabHiddenPropertyName = "msHidden";
							tabVisibleChangedEventName = "msvisibilitychange"
						}
						function safeAddHandler(element, event, handler) {
							element.removeEventListener(event, handler);
							element.addEventListener(event, handler)
						}
						function getVideos() {
							return document.getElementsByTagName("video")
						}
						function isPlaying(vid) {
							return !!(vid.currentTime > 0 && !vid.paused && !vid.ended && vid.readyState > 2)
						}
						function onTabVisibleChanged() {
							var videos = getVideos();
							if (document[tabHiddenPropertyName]) {
								document.wasPausedOnChangeTab = true;
								for (var i = 0; i < videos.length; i++) {
									var vid = videos[i];
									pauseVideo(vid, true)
								}
							} else {
								document.wasPausedOnChangeTab = false
							}
						}
						if (pauseOnLeaveTab) {
							safeAddHandler(document, tabVisibleChangedEventName, onTabVisibleChanged)
						}
						function isAutoPlayAllowedForSource(url) {
							if (hasAutoPlaySourcesWhitelist) {
								for (var i = 0; i < autoPlaySitesWhitelist.length; i++) {
									if (isUrlMatch(url, hasAutoPlaySourcesWhitelist[i])) return true
								}
							}
							return false
						}
						function onPaused(e) {
							e.target.isPlaying = false
						}
						function pauseVideo(vid, isLeavingTab) {
							var eventName = "auto-play";
							if (isLeavingTab == true) {
								vid.wasPausedOnChangeTab = true;
								eventName = "on leaving tab"
							}
							vid.isPlaying = false;
							vid.pause()
						}
						function onPlay(e) {
							onPlayOrLoaded(e, true)
						}
						function onPlaying(e) {
							onPlayOrLoaded(e, false)
						}
						function onPlayOrLoaded(e, isPlayConfirmed) {
							var msSinceLastClick = Date.now() - lastClickTimeMs;
							var vid = e.target;
							if (msSinceLastClick > allowAutoPlayWithinMillisecondsOfClick && !isAutoPlayAllowedForSource(vid.currentSrc)) {
								pauseVideo(vid)
							} else {
								vid.isPlaying = isPlayConfirmed || treatPlayingLikeOnPlay
							}
						}
						function addListenersToVideo(vid, srcChanged) {
							var pauseNow = false;
							if (vid.hasAutoPlayHandlers != true) {
								vid.hasAutoPlayHandlers = true;
								safeAddHandler(vid, "play", onPlay);
								if (handlePlayingInAdditionToPlayEvent) safeAddHandler(vid, "playing", onPlaying);
								safeAddHandler(vid, "pause", onPaused);
								safeAddHandler(vid, "ended", onPaused);
								pauseNow = true
							}
							if (pauseNow || srcChanged == true) {
								pauseVideo(vid);
								if (allowPauseAgainAfterFirstFound) {
									vid.isPlaying = false
								}
							}
						}
						function addListeners() {
							var videos = getVideos();
							for (var i = 0; i < videos.length; i++) {
								var vid = videos[i];
								addListenersToVideo(vid)
							}
						}
						safeAddHandler(document, "click", function() {
							lastClickTimeMs = Date.now()
						});
						var observer = new MutationObserver(function(mutations) {
							mutations.forEach(function(mutation) {
								if (mutation.type == "attributes" && mutation.target.tagName == "VIDEO") {
									try {
										videoAdded = true;
										addListenersToVideo(mutation.target, true)
									} catch (e) {}
								}
								if (mutation.addedNodes.length > 0) {
									addListeners()
								}
							})
						});
						observer.observe(document, {
							attributes: true,
							childList: true,
							subtree: true,
							characterData: false,
							attributeFilter: ['src']
						});
						addListeners();
					} catch (e) {
						return false;
					}
				}, 123)
			})();
			(function() {
				setTimeout(function() {
					try {
						if (document.getElementsByTagName("video")[0]) {
							var v_player = document.getElementsByTagName("video");
							for (var i = 0, length = v_player.length; i < length; i++) {
								try {
									v_player[i].muted = true;
									v_player[i].volume = 0;
									v_player[i].pause();
									v_player[i].offsetParent.innerHTML = '';
								} catch (e) {}
							}
						} else if (document.getElementsByTagName("object")[0]) {
							var v_player = document.getElementsByTagName("object");
							for (var i = 0, length = v_player.length; i < length; i++) {
								v_player[i].parentNode.removeChild(v_player[i])
							}
						}
					} catch (e) {
						return false;
					}
				}, 1234)
			})();
		};
		if (cssremoveobj || youtubespxzobj) {} else {
			cssobj('[class*="app"][class*="-ad-view-box"],[id*="app"][id*="-ad-view-box"],[class*="app-topbanner"],[id*="app-topbanner"],[class*="_bg_ad"],[id*="_bg_ad"],[class*="advertise"],[id*="advertise"],[class^="bd_ad"],[id^="bd_ad"],[class*=" area ad"],[id*=" area ad"],[class*="ad"][class*="banner"],[id*="ad"][id*="banner"],[class^="ad_inner"],[id^="ad_inner"],[class^="slide-gg"],[id^="slide-gg"],[class^="side_gg"],[id^="side_gg"],[class^="slide_ad"],[id^="slide_ad"],[class^="side_ad"],[id^="side_ad"],[class^="mod_ad"],[id^="mod_ad"],[class^="ad-client"],[id^="ad-client"],[class*="play-tips-ad"],[id*="play-tips-ad"],[class^="ad-slider"],[class^="ad-festival"],[id^="ad-slider"],[id^="ad-festival"],[class^="ad-"][class*="fixed"],[id^="ad-"][id*="fixed"],[class*="modAdv"],[id*="modAdv"],[class*="boxAdv"],[id*="boxAdv"],[class*="-ad-bottom"],[id*="-ad-bottom"]');
			cssobj('ad,ads,foot,footer,div[class^="adv "],div[id^="adv "],div[class*="corneradv "],div[id*="corneradv "],div[class$="-browser"][style*="fixed"],[class*="qinfan"],[id*="qinfan"],[class*="qianfan"],[id*="qianfan"],[class*="header"][class*="ownload"],[id*="header"][id*="ownload"],[class*="app"][class*="ownload"],[id*="app"][id*="ownload"],[class$="-fullscreen-tip"],[_stat*="浮层"],div[class*="foot"],div[id*="foot"],div[class*="bottom"][class*="recommend"],div[id*="bottom"][id*="recommend"],div[class^="right-activity"],div[id^="right-activity"],[data-adpid-checked],[data-ad-client],[data-adext],[ad-status],div[class*="pause"]:not([aria-label]):not([class*="bilibili"]):not([class*="auto"]):not([class*="hide"]):not([class*="shadow"]):not([class*="icon"]):not([class*="btn"]):not([class*="svg"]):not([class*="definition"]),div[id*="pause"]:not([aria-label]):not([id*="bilibili"]):not([id*="auto"]):not([id*="hide"]):not([id*="shadow"]):not([id*="icon"]):not([id*="btn"]):not([id*="svg"]):not([id*="definition"]),[data-role*="pause"]');
			remove('[class$="-ie-tips"],[id$="-ie-tips"]');
			remove('iframe[src*="/game/"],iframe[width="1"][height="1"]');
			remove('[class*="-ad-"][id*="banner"],[id*="-ad-"][id*="banner"]');
			removeall('[class*="miaozhenad"],[id*="miaozhenad"]', undefined, false);
			removeall('[class*="google"],[id*="google"],[name*="google"]', undefined, false);
		}
		if (jxbpcobj) {
			if (obj.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|vku\.youku\.com\/live\/)/)) {
				if (obj.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
					jxbzdjxhyobj();
					zdgbdmobj();
					jxbvolumeobj();
					lkzdztobj();
					cssobj('.control-icon.control-phonewatch,.control-scroll-info.active,div[class^="u-app_"],div[class^="u-vip_"],.h5-ext-layer iframe,.h5-ext-layer iframe+div[style*="margin-left:"],.h5-ext-layer iframe,.h5-ext-layer iframe+div [style*="cursor"][style*="pointer"],li[class^="g-view_"][class*="top-nav-more-large_"]:last-of-type,.vip_limit_content_sid p,.vip_limit_content_sid em,[data-spm*="shoujikan"],[class^="panel_"][class*=" u-panel_"],[class^="logout-header_"],div.youku-layer-logo,#right-title-ad-banner');
					cssobj('div[class*="-position-"][style*="fixed"],div[class^="change-skin"],div[class^="top_area"],.control-scroll-infotop,.h5-ext-layer>div[style*="left:50%"][style*="top:50%"],.h5-ext-layer>div[style*="left: 50%"][style*="top: 50%"],span[class="iconfont iconshoucang"],div[class^="ab_"],div[id^="ab_"],.h5-ext-layer img,div[class^="switch-img"][class*="setconfig"],div[id^="Boh"]:not([id*="mment"]),div[class^="boh"]:not([class*="mment"]),div[class^="leftarea_"],[class*="foot"],[class^="fixed_bar_"] a[target*="_blank"],ul.play-fn,.js-top-icon');
					cssobj('div[class^="rightarea_"]{margin-left:auto!important;}[class^="fixed_bar_"]{background-color:transparent!important;}div.barrage-normal-container{float:left!important;width:100%!important;text-align:center;}div#ykPlayer{z-index:999999999!important}div[data-spm*="login"]>div[style*="block"][style*="fixed"]{z-index:2147483647!important;}div[id^="header-contain"]{position:absolute!important;}1128059');
				} else {
					jxqtwzhyobj();
					lkzdztobj();
					cssobj('h2.caption{margin-left:calc(100vw/4)!important;width:auto!important;text-align:center;}.content{margin-top:auto!important;}body{background-image:none!important;background-color:#333333!important;}::-webkit-scrollbar{width:0px!important;height:0px!important;}div.description,div.outlets,div.action');
				}
			} else if (obj.match(/^https?:\/\/[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)/)) {
				jxbzdjxhyobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('div[class^="u-app_"],div[class^="top_area"],.td-interactbox,.td-play__baseinfo,[class*="playbase"],[data-spm*="foot"],[data-js*="Down"],[class*="td-side-bar"] li:not([data-js-gotop*="gotop"])');
				cssobj('[class*="login"][class*="pop"],[id*="login"][id*="pop"]{z-index:2147483648!important}1128059');
			} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\//)) {
				jxbzdjxhyobj();
				zdgbdmobj();
				lkzdztobj();
				cssobj('.quick_vip.quick_item>.quick_link,.video_score,._site_channel_more,.txp_popup_download,txpdiv.txp_shadow,.icon_vip_pic,.quick_tips_inner,.video_info_wrap,[_r-component="c-mood"],.tips_promotion,[_hot*="客户端"],[class*="txp_ad_link"],[class*="txp_ad_more"],[data-role*="ad"][data-role*="pause"],.txp_comment_hot,.mod_action .action_wrap,div[_r-component="c-cover-recommend"],.txp-watermark-action,txpdiv.txp-watermark,[class*="_bg_ad"],[id*="_bg_ad"],[class^="mod_ad "],[data-role="txp-ui-favorite"],#mask_layer,.site_footer,._player_helper.player_helper,#shortcut');
				cssobj('[data-role^="txp-ui-title-mod"],[data-role^="txp-ui-screen-percent-wrap"],[data-role^="txp-ui-clock"],div[class="mod_row_box _movie_contact"],div[class="mod_row_box mod_row_loading"],.x_layer_card,.mod_row_box_casts.mod_row_box,div[class="mod_row_box"]:not([class*="forCommentsEntry"]):not([id*="forCommentsEntry"]),[_wind^="columnname="][_wind*="热区"],[_wind^="columnname="][_wind*="图片"],[_r-component="c-player-helper"],.mod_client_bubble.mod_quick_tips,div[_r-component="c-new-tv-preheat"],.container_short .txp_mod_barrage,.site_channel a:not([_stat*="电"]):not([_stat*="动"]):not([_stat*="综艺"]):not([_stat*="会员"]):not([_stat*="全部"])');
				cssobj('.player_headline{text-align:center;}.player_container .txp_mod_barrage{left:0!important;text-align:center;}div.mod_hanger{background-color:transparent!important;}div.site_container.container_main{background-color:#0f0f1e;}.wrapper_side .mod_title .title,div.figure_detail_row{color:#d8d4d3;}1128059');
				removeall('div[_r-component="c-new-tv-preheat"],div.figure_video', undefined, false);
				if (obj.match(/\/variety\/p\/topic\//)) {
					cssobj('body::-webkit-scrollbar{width:0!important;height:0!important}div[class*="module"][_wind="columnname=播放器"]{top:2.5vh!important}div[data-index="3"][_wind="columnname=视频列表"]{top:50vh!important}div[class="mod_column"]{margin-top:-50px}html,body,div[class*="background"]{background-color:#2e2e36!important}div[class*="background"] div{background:none!important;height:auto!important}div[class^="main-container"]{height:auto!important}.jimu-module .module-video_list .btn_change{top:-25%}.jimu-module .module-video_list .figures_list li.list_item a,.jimu-module .module-video_list .figures_list li.list_item a:active,.jimu-module .module-video_list .figures_list li.list_item a:hover,.jimu-module .module-video_list .figures_list li.list_item a:visited{color:aliceblue!important}.jimu-module .module-video_list .btn_change .icon-a{top:75%}div[class="mod_text_tabs"]{visibility:hidden!important}[_wind^="columnname="]:not([_wind*="播放器"]):not([_wind*="列表"]):not([_wind*="往期"]),div[data-index][_wind="columnname=视频列表"]:not([data-index="3"]),.txp_btn_loop.txp_btn');
					(function() {
						try {
							let b = document.querySelectorAll('ul[class*="list"] a[href*="/x/"][target*="_blank"]');
							for (let i = 0, len = b.length; i < len; i++) {
								b[i].setAttribute('target', '_top')
							}
						} catch (e) {
							return false
						}
					})();
				} else {}(function() {
					setInterval(() => {
						let txp_btn_volume = $(".txp_btn_volume");
						if (txp_btn_volume.attr("data-status") === "mute") {
							$(".txp_popup_volume").css("display", "block");
							txp_btn_volume.click();
							$(".txp_popup_volume").css("display", "none")
						}
					}, 500);
				})();
			} else if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\//)) {
				if (!obj.match(/^https?:\/\/www\.mgtv\.com\/act\//)) {
					mgzdgqobj();
					jxbvolumeobj();
					lkzdztobj();
				} else {
					jxqtwzobj();
					cssobj('html,body{background:none!important;background-color:#1b1b1b!important;}div.wp-main.wp.page-section{margin-top:calc(10vh);}a.u-post{width:auto!important;}div.screen-top,[class*="qrcode"],div.mitem-index.mitem,div[class="c-header-panel-mod"]:not([id="honey-header-user"])');
					(function() {
						$("body").on('mouseover', 'a[class*="listbox"][href*=".mgtv.com/"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
							let jxbzqxjobj = $(this), href = jxbzqxjobj.attr('href') || jxbzqxjobj.data("href");
							jxbzqxjobj.off('click.chrome');
							jxbzqxjobj.on('click.chrome', function() {
								window.location.href = href
							}).attr('data-href', href).css({
								cursor: 'pointer'
							}).removeAttr('href')
						})
					})();
				}
				cssobj('mango-control-status,.m-report-tipoff-dialog,[class*="footer"],[class*="mgad_"],[id*="mgad_"],ul.menu.clearfix a:not([href*="/show/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"]):not([href*="/vip/"]),[class*="rightnav"] ul li:not([mg-stat-mod*="history"]):not([class*="user"])');
				cssobj('div.mms-wrap,.control-right,[style*="top: 0px;left:0px;bottom:0px;right:0px"],[style*="top: 0px; left: 0px; bottom: 0px; right: 0px"],span[class$="bg"],.video-info.enable,.play-control .control-left .dos,.g-play .g-container-playcet .mod-wrap-side,.big-poster-conent,ul.honey-feedback-list li:not([class*="backtop"])');
				cssobj('.u-control-danmu-control.state-bottom{right:25%!important;text-align:center;}div.maomibtn li#mgzdgqli{display:block!important}div.login-main{z-index:2147483647!important;}1128059');
				if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\/b\//)) {
					jxbzdjxhyobj();
					zdgbdmobj();
				} else {
					if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\/s\//)) {
						zdgbdmobj();
					} else {} if (!obj.match(/^https?:\/\/www\.mgtv\.com\/act\//)) {
						jxqtwzhyobj();
					} else {}
				}
			} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/[av]_/)) {
				if (iqiyiapcliwaiobj) {} else {
					jqjs();
					zdgbdmobj();
					jxbvolumeobj();
					lkzdztobj();
					cssobj('[data-player-hook*="top"],div#iProgress,div#userdata_el,#titleRow,[data-player-hook*="follow"],.vippay-btn-tip,[class*="-adv-under"],[id*="-adv-under"],[class^="100000"],[id^="100000"],[data-player-hook*="logo"],iqpdiv.iqp-logo-box,.pca-bg.qy-player-pca,div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id),div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id)');
					cssobj('[id^="nav_renewBtn"],[data-player-hook="blankarea"],[rseat*="feedback"],.vip-btn .link-wrap,[data-player-hook*="scoretask"],[class*="footer"],[id="block-F"],[id="block-G"],[id="block-BD"],[id="block-JJ"],[class="qy-mod-wrap"][data-asyn-pb="true"],[id*="appDown"],[id*="game"],.qy-flash-func,[class*="-ai-"][data-player-hook],[class*="hot"][data-player-hook],div.nav-channel a:not([rseat*="dian"]):not([rseat*="zongyi"]):not([rseat*="dongman"]),li[class^="anchor-list"]:not([class="anchor-list"])');
					cssobj('[data-barrage*="BarrageVue"]{text-align:center;margin-left:25%!important;}div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"]){z-index:2147483647!important;}.flash-box.videoWindow{top:0!important;left:0!important;position:relative!important;z-index:300!important;width:100%!important;height:100%!important}iqpdiv[class*="img"][data-player-hook="progress-imageWrapper"]{bottom:20px!important;}iqpdiv[data-player-hook="progress-line"],iqpdiv[data-player-hook="heatmap"],[data-player-hook="pca"]');
					removeall('div[class^="qy-header-login-pop-"][class$="selected"]', undefined, false);
					if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
						jxbzdjxhyobj();
					} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/a_/)) {
						jxbzdjxhyobj();
						document.head.insertAdjacentHTML('beforeend', '<style>[lequ-comid][lequ-componenttitle]:not([lequ-componenttitle*="播放"]):not([lequ-componenttitle*="完整"]):not([lequ-componenttitle*="正片"])>[cpnm]:not([cpnm*="播放"]):not([cpnm*="完整"]):not([cpnm*="正片"]),div[class^="videoBackGround"],div[class^="lequ-component lequ-comId"][data-block="PCW_lequ_code"][cpnm]>div.section0#section0,div[class*="weiboreyi-component"][data-block*="pinlun"],div[class^="banner"][class$="-outer"],div[id^="banner"][id$="-outer"],div.album-head-btn>a.qy-album-collect.J_collect_data,[class*="download"],[j-role*="scrollDiamondSign"],[class*="signin-btn"],#J-header-upload,#widget-playhistory-new,div.header-sideItem.header-vip,div.header-sideItem.header-download,div.header-sideItem.header-info,[class$=" cms-component-blank"][style="margin-bottom:0px;"]>*:not([class^="sec-"]):not([id^="sec-"]),[class*="sec-head-ad"],[class="relatedWork"],.slider-bar,[class*="djgm"],[class*="lhzz"],[class="sec-head show"] *:not([class*="title"]) img,[class="mod-footer-editor"],[class^="dhome"],[class="heat-info"],[class="episodePlot"][data-series-ele="juqing"],[id="widget-albumQiyu"],[class="albumRanklist"],[class="rank-num rank-active fl"],[data-tab-type="albumcomment"],[class="intro-effect clearfix"],[class="albumFocus-container"],[class^="top-"]>img[src*=".iqiyipic.com/common/20"][alt=""][class],li[class^="nav-L nav-"][data-nav-to^="#section"]:not([data-nav-to="#section1"]),[class="_mask_"],[class="vote-banner-box"],[class^="section"][class*=" section"],[class="nav-L nav-L2 nav_D"],div[class^="section2"],div[class^="section3"],div[class^="section4"],div[class^="section5"],div[class^="section6"],div[class^="section7"],div[class^="section8"],div[class^="section9"],[class^="footer"],div[class^="cms-component com-"][com-type="default"][style="margin-bottom:0px;"],div[class^="section"][id^="section-"]>img,.cms-wrapper>.layout-1020.cms-layout>.cms-row>.col-12.cms-block>.cms-component>.sec-head{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}::-webkit-scrollbar{width:0!important;height:0!important}.cms-wrapper{background:none!important;background-color:black!important}[lequ-componenttitle*="看点"],[lequ-componenttitle$="花絮"],[lequ-componenttitle*="周边"],[lequ-componenttitle*="泡泡"],[lequ-componenttitle][data-block^="PC"][cpnm],[lequ-componenttitle][data-block*="code"],[style^="display:block;float:right"],[style^="display: block; float: right"],.lequ-component-box>[class^="lequ-component lequ-comId"][class*=" com-"] [class^="show"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}html,.lequ-component-box{background-color:#232325!important}.lequ-content{text-align:center;margin-left:25%}.lequ-header{margin-left:-25%!important}</style>');
					}(function() {
						try {
							let aElement = document.querySelectorAll('div[class*="list"] a[href*="/v_"][href*=".html"][target="_blank"]');
							for (let i = 0; i < aElement.length; i++) {
								aElement[i].getAttributeNode('target').value = "_top"
							}
						} catch (e) {
							return false
						}
					})();
				};
			} else if (obj.match(/^https?:\/\/tw\.iqiyi\.com\/v_/)) {
				jqjs();
				jxqtwzobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('.main-content{padding-bottom:inherit;}[class*="vip-side-wrap"],[id*="vip-side-wrap"],.tw-play-con,.tw-play-side,.tw-play-tag,.tw-play-num,.tw-play-intro,.collect');
			} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
				jxbzdjxhyobj();
				zdgbdmobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('[class*="foot"],[id*="foot"],[data-pb-txid*="qianfan"],[class*="zhibo"],#tvphb,div.left,span.btn-tips,a[class*="-adv-"][target*="_blank"],a[id*="-adv-"][target*="_blank"],.ad,.adv,#ad,#adv,.x-hdr-btn,.x-fox-btn,#leftBar,div.side-set div,div.side-set a:not([class*="top"]),div#navLocker div:not([class*="history"]):not([class*="upload"]):not([class*="user"]):not([class*="login"])');
				cssobj('[class^="x-"][class*="hot"][class$="-btn"],[class^="x-clock"],[class^="x-webg"],[class^="x-pugc-title"],[class^="x-gradient-top"],[class^="x-info-panel"],#newplayNavCrumbs,.seeBox,div#content,.x_poster_card,.side-set,div.mod-column-main.l,[class*="share"],[id*="share"],div[class^="vBox vBox-"]');
				cssobj('html{background-color:#313136;}div.mod-column-side.r,div.right{width:inherit!important;}div#dmbar{margin-left:-25%!important;text-align:center;}div[class^="globallogin"]{z-index:2147483647!important;}1128059');
				cssobj('#player{z-index:999999999!important;}1128059');
				remove('iframe[src*="//tv.sohu."][width="0"][height="0"]');
			} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
				jxbzdjxhyobj();
				cssobj('#go-top,.visible.J_vip_buttons_info.movie-info-vip-wrap,i.nav-new,a[href*="film.sohu.com/vip.html"],a[href*="film.sohu.com/vipAct.html"],div.player-content-bg,div.top_template,div.tm-wel1,.x-info-panel,.x-gradient-top,.x-hdr-btn,.x-fox-btn,div.content_main_hasrank,div.bg_main,.footer');
				cssobj('#vip_iframe__ {position:relative!important;}div[class^="globallogin"]{z-index:2147483647!important;}1128059');
			} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
				jxbzdjxhyobj();
				zdgbdmobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('[style^="position:"][style*="hidden"],.hv_topbar,.vipTabBanner,[data-statectn*="right"],.hv_buy,.tj_title,#j-hotguess,div.rank_box,.Foot,.user_bar .user_vip,.player-content-bg,.pop-operates,.QR_code,[class^="Banner_"],[id^="Banner_"],[class^="JS_banner_"],[id^="JS_banner_"],[id^="JS_banner_"]+div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body,[id^="JS_banner_"]+div.column_title~div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body~div.column_body');
				cssobj('div#LEPass_LOGIN_IFRAME{z-index:2147483647!important;}1128059');
				remove('.rightFix_tool,iframe[onload*="union"],[style^="position:"][style*="hidden"]');
				removeall('[style^="position:"][style*="hidden"]', undefined, false);
			} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
				jxbzdjxhyobj();
				zdgbdmobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('.buy_vod.down.login-a-tryover,.module-video2016-program .hd,.focusPeople,div#wxPop,[tj_id^="sb_"],[class*="download"],[class^="module-video"][class$="-ops cf"],div.sus-cont a,div.sus-cont li:not([class*="top"]),div.hot.cf a:not([href*="tv.pptv."]):not([href*="movie.pptv."]):not([href*="zongyi.pptv."]):not([href*="cartoon.pptv."])');
				cssobj('a#update_btn,.button-box .right,img[class^="roll-"],img[id^="roll-"],a[tj_id],[class^="module-video"][class$="newupload"],[class*="copyright"],[class*="banneradv"],#video-maincont,[id*="game"],[class*="side-adv"],[class^="afp-"],[id^="afp-"],[class^="afp_"],[id^="afp_"]');
				cssobj('div[class^="layer loginlayer"]{z-index:2147483647!important;}');
			} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
				jxbzdjxhyobj();
				cssobj('div[class="qrcode_r fl"],ul.ecope_emailsuggest,iframe#bubbleMsg,.pay-mod-notlogin,.playerBox-info-rightPart,#zhichiBtnBox,[class^="fl popBox ele_uc ticket hidden"],figure,footer,#sideBar_help_webSite,[class*="-adver"],[id*="-adver"]');
				cssobj('div[class^="common-popup"]{z-index:2147483647!important;}');
			} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
				jxbzdjxobj();
				jxbvolumeobj();
				lkzdztobj();
				cssobj('form#postFrameData,div[style^="position:absolute; right:0;"],div#play_mask,.playli_momey,.playli_erwm,.open_vip,.wasu_jh,.play_video_b,ws-postershot,[class*="postershot"],[id*="AD_POP_"],iframe[src*="adload"],.play_global,.footer,.sidebar,[class*="_ad"],[id*="_ad"],[class*="ad_"]:not([class*="head"]),[id*="ad_"]:not([id*="head"])');
				cssobj('table[class^="boxy-wrapper"]{z-index:2147483647!important;}1128059');
			} else if (obj.match(/^https?:\/\/(?:www|player|live)\.bilibili\.com\//)) {
				lkzdztobj();
				cssobj('[class*="-player-video-btn-jump"][class$="-player-video-btn-bilibili-logo"],[class*="-suspension-bar"],[class*="qrcode"],[class^="flip-view p-relative over-hidden"],[class*="player-video-top"],div#heimu,.bilibili-player-video-top.bilibili-player-video-top-pgc,[class*="-app-download"],.expand-more,#toolbar_module,div.clearfix.recom-item:nth-child(n+10),li.nav-link-item a[href*="/app.bilibili.com"],li.nav-link-item a[href*="/game.bilibili.com"]');
				if (!obj.match(/^https?:\/\/live\.bilibili\.com\//)) {
					zdgbdmobj();
				}
				if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
					jxbzdjxhyobj();
				} else {
					jxqtwzhyobj();
				}
			} else if (obj.match(/^https?:\/\/www\.fun\.tv\/vplay\/g-/)) {
				jqjs();
				jxqtwzobj();
				lkzdztobj();
				cssobj('.fxp-video-cover,#mark-,#main-rt,.fix.rightBtn,span.tit-btn-icon,[class*="downlaod"]');
				cssobj('a.orange-btn.js-pay-open{text-align:center!important}div[class^="dialog-view"]{z-index:2147483647!important;}1128059');
			} else if (obj.match(/^https?:\/\/www\.miguvideo\.com\/mgs\/website\/prd\/detail\.html\?cid=/)) {
				jxqtwzobj();
				lkzdztobj();
				cssobj('div.bulletScreen,div.recoment_to_you,[class*="download"],[class="float-btn"]>div:not([class*="top-btn"])');
			} else if (obj.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
				zdgbdmobj();
				jxqtwzhyobj();
				lkzdztobj();
			} else if (obj.match(/^https?:\/\/haokan\.baidu\.com\/v/)) {
				jxqtwzhyobj();
				lkzdztobj();
				cssobj('li.land-item:nth-child(n+10),[class*="ownload"],[id*="ownload"],div[class="videoinfo-text clearfix"]>div,div[class="videoinfo-text clearfix"]>span:not([class*="left"])');
			} else if (obj.match(/^https?:\/\/www\.asys\.vip\/kuaishou/)) {
				jxqtwzhyobj();
				lkzdztobj();
			} else if (obj.match(/^https?:\/\/tieba\.baidu\.com\/p\//)) {
				if (document.querySelector("video")) {
					jxqtwzhyobj();
					lkzdztobj();
				} else {}
			} else if (obj.match(/^https?:\/\/movie\.douban\.com\/subject\//)) {
				(function() {
					let myScriptStyle = document.createElement("style");
					myScriptStyle.innerHTML = '[class*="ticket"],[id*="download"],.gray_ad,#footer{display:none!important;}.c-aside.site_online {margin-top:-65px;}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{text-decoration:line-through;color:#000}.c-aside-body a.available{background-color:#5ccccc;color:#006363;border-radius:10px;font-weight:bold;}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}';
					document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
					let aside_html = '<div class=c-aside > <h2><i class=""></i> · · · · · · </h2> <div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';
					if (!document.getElementById("seBwhA") && document.title.indexOf('豆瓣') !== -1) {
						var seBwhA = document.createElement("a");
						seBwhA.id = "seBwhA";
						document.getElementsByTagName("html")[0].appendChild(seBwhA);
						$(document).ready(function() {
							let parseURL = function(url) {
								return {}
							};
							var site_online, site_sub, update_site_offline_sites;
							site_online = $(aside_html);
							update_site_online_sites = function(title, en) {
								var i, l, link, link_parsed, n, name, site_online_sites;
								title = encodeURI(title);
								site_online_sites = {
									'最大网': 'http://www.zuidazy4.com/index.php?m=vod-search&wd=' + title,
									'布米米': 'http://www.bumimi.top/search/' + title,
									'宅看影视': 'https://www.zhaikanys.com/vodsearch/-------------.html?wd=' + title + '&submit',
									'完美看看': 'https://www.wanmeikk.me/so/-------------.html?wd=' + title + '&submit',
									'麻花影视': 'https://www.jiaomh.com/search.php?searchword=' + title,
									'茶杯狐': 'https://www.cupfox.com/search?key=' + title
								};
								for (name in site_online_sites) {
									link = site_online_sites[name];
									link_parsed = parseURL(link);
									link = $('<a></a>').attr('href', link);
									link.attr('data-host', link_parsed.host);
									link.attr('target', '_blank').attr('rel', 'nofollow');
									link.addClass('available');
									link.html(name);
									$('#content div.site-online-body ul').append(link)
								}
							};
							site_online.addClass('site_online');
							site_online.find('div.c-aside-body').addClass('site-online-body');
							site_online.find('h2 i').text('搜索播放');
							$('#content div.tags').before(site_online);
							var title, title_en, title_sec;
							title = title_sec = $('#content > h1 > span')[0].textContent.split(' ');
							title = title.shift();
							title_sec = title_sec.join(' ').trim();
							title_en = '';
							update_site_online_sites(title)
						})
					}
				})();
			} else if (obj.match(/^https?:\/\/www\.bumimi\.top\/search\//)) {
				pdssgjcobj = 'ul#result>li>a';
				apddjobj();
			} else if (obj.match(/^https?:\/\/(?:www\.youtube\.com\/watch\?v=|blueconvert.com\/\?id=)/)) {
				if (obj.match(/\/watch\?v=/)) {
					cssobj('ytd-compact-video-renderer[class="style-scope ytd-watch-next-secondary-results-renderer"]:nth-child(n+20)');
				} else {
					document.title = 'Youtube 视频下载';
					(function(b) {
						document.querySelectorAll(b)[0] && (document.querySelectorAll(b)[0].innerHTML = '<font color="#007bff">Youube</font>视频下载')
					})('h1');
					document.head.insertAdjacentHTML('beforeend', '<style>footer,header,h1+div[class^="input-group mb-"],div[class^="album py-"],div[class^="alert alert-danger"],p[class^="lead text-muted"],p[class^="card-text"]{display:none!important}html,section{background:url(https://gitee.com/)no-repeat fixed center/cover!important}[id^="videoDetail"]{background-color:transparent;border:none!important}[id^="videoTitle"]{color:initial;background-color:#cfceb063}button{background-color:#4CAF50!important}.input-group>.custom-select:not(:last-child),.input-group>.form-control:not(:last-child){background-color:#03a9f44f;color:black;font-weight:bold;border:1px outset buttonface;text-decoration:none;text-align:center}*{border:none!important;outline:none!important}</style>');
				}
			} else if (obj.match(/^https?:\/\/(?:greasyfork|sleazyfork)\.org\/.+?\/(?:users\/|scripts(?:\/by-site\/|\?))/)) {
				(function() {
					'use strict';

					function addScore(script) {
						let separator = script.querySelector('h2>span.name-description-separator');
						let description = script.querySelector('h2>span.description');
						if (separator) {
							let score = document.createElement("strong");
							score.style.color = "darkgreen";
							score.innerHTML = script.getAttribute("data-script-rating-score");
							separator.parentNode.insertBefore(score, separator)
						}
						let installArea = script.querySelector("#install-area");
						if (installArea) {
							script.onmouseover = function(e) {
								installArea.style.display = "block"
							};
							script.onmouseout = function(e) {
								installArea.style.display = "none"
							}
						}
					};
					let sortDiv = document.querySelector("#script-list-sort");
					if (sortDiv) {
						let switchFilter = document.createElement("div");
						let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
						let observer = new MutationObserver(function(records) {
							records.map(function(record) {
								for (let i = 0; i < record.addedNodes.length; i++) {
									let curNode = record.addedNodes[i];
									if (curNode.className == "script-list") {
										let scripts = curNode.querySelectorAll('li');
										for (let i = 0; i < scripts.length; i++) {
											let script = scripts[i];
											addScore(script)
										}
									}
								}
							})
						});
						let option = {
							'childList': true
						};
						observer.observe(document.querySelector("body>.width-constraint .sidebarred-main-content"), option);
						let scripts = document.querySelectorAll('ol.script-list>li');
						for (let i = 0; i < scripts.length; i++) {
							let script = scripts[i];
							addScore(script)
						}
					}
				})();
			} else if (obj.match(/^https?:\/\/t6{2}y\.com\/htm_data\//)) {
				shipingquanpingobj();
				(function() {
					try {
						var table = document.querySelectorAll('.sptable_do_not_remove');
						if (document.querySelectorAll('.sptable_do_not_remove span').length > 0) {
							var str = document.querySelectorAll('.sptable_do_not_remove span')[0].className;
							for (var j = 0; j < table.length; j++) {
								var td = table[j].querySelectorAll('td');
								for (var i = 0; i < td.length; i++) {
									td[i].innerHTML = '<span class=' + str + '>&nbsp;</span>'
								}
							}
						} else {
							for (var k = 0; k < table.length; k++) {
								table[k].style.display = 'none'
							}
						}
						document.querySelector("div.tpc_content.do_not_catch>a:last-of-type").click();
					} catch (e) {
						return false;
					}
				})();
			} else if (jxjkobj) {
				let titleTime;
				if (obj.match(/\.youku\./)) {
					document.title = '优酷视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '优酷 视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.mgtv\./)) {
					document.title = '芒果视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '芒果 视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.sohu\./)) {
					document.title = '搜狐视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '搜狐视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.pptv\./)) {
					document.title = 'PPTV视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = 'PPTV视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.wasu\./)) {
					document.title = '华数视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '华数视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.1905\./)) {
					document.title = '1905视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '1905视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.iqiyi\./)) {
					document.title = '奇艺视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '奇艺视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.le\./)) {
					document.title = '乐视视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '乐视视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.qq\./)) {
					document.title = '腾讯视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '腾讯视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.bilibili\./)) {
					document.title = 'B站视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = 'B站视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.fun\./)) {
					document.title = '风行视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '风行视频解析中'
							}, 2000)
						}
					})
				} else if (obj.match(/\.miguvideo\./)) {
					document.title = '咪咕视频解析中';
					document.addEventListener('visibilitychange', function() {
						if (document.hidden) {
							document.title = '≥△≤ 已自动隐藏 ≥△≤';
							clearTimeout(titleTime)
						} else {
							document.title = '欢迎回来继续看视频';
							titleTime = setTimeout(function() {
								document.title = '咪咕视频解析中'
							}, 2000)
						}
					})
				} else {}
			} else {
				bdtbobj();
			}
		} else {
			cssobj('div#jxbhttps{opacity:1!important;}1128059');
			if (obj.match(/^https?:\/\/m\.youku\.com\/.+?\/id_/)) {
				if (!obj.match(/\/id_[^==]+?==\.html/)) {
					(function() {
						try {
							let host = document.domain;
							let ystr = location.href;
							let pos = ystr.indexOf('?');
							if (pos > -1) {
								ystr = ystr.substring(0, pos)
							}
							ystr = ystr.replace("/alipay_video/", "/video/");
							if (host.indexOf('youku.com') > -1 && ystr.indexOf(".html") > -1 && ystr.length > 53 && ystr.indexOf("=") == -1) {
								let xm = document.querySelector("DIV.anthologyStageStyle0.stageActive");
								if (xm) {
									xm.click()
								}
								xm = document.querySelector("DIV.stageStyle1ImgContainer");
								if (xm) {
									xm.click()
								}
							}
						} catch (e) {
							return false
						}
					})();
				} else {
					jqjs();
					jxbzdjxhyobj();
				}
				cssobj('.showMore,.brief-more,[class^="h5-detail-feed"],div.x-trigger,div.uplader,#ykPlayer,.Push-container,.Corner-container,.h5-detail-ad,.h5-detail-guide.clipboard,.h5-detail-recommend,#comment-frame,.yk-footer,.brief-btm,#YKComment');
			} else if (obj.match(/^https?:\/\/m\.mgtv\.com\/b\//)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('div.m-vip-list,div.mg-app-swip,.mgui-btn-nowelt.mgui-btn,.clearfix.bd,[class^="mgui-card"]:not([class*="xuanji"]),.m-vip-list+div,.video-about.mg-stat,div#comment-id,[class*="footer"],.more,div#nav-bar a:not([href*="/show/"]):not([href*="/vip/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"])');
			} else if (obj.match(/^https?:\/\/m\.pptv\.com\/show\//)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('.openapp-bg.player-info,#pgotop,.trivia-wrap.trivia,.plist-w.plist6.plist,.comment-container,.m_copyright,.footbanner,.hide.vod-intor.player-info,.download,.star-page-enter');
			} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('#app_store,.wakeAppBtn.fl,.openMembershipBtn,.downLoadBtn.commonPic,.open-app,.no-marg.f_song,.ad,.iconList');
			} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)/)) {
				if (!obj.match(/^https?:\/\/m\.tv\.sohu\.com\/u\//)) {
					jqjs();
					jxbzdjxhyobj();
				} else {
					cssobj('.main-rec-view-box.main-view-box.app-view-box,.app-commentJS-box.app-vbox,.t_titlearrowup,.btn-xz-app');
				}
				if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/v/)) {
					cssobj('.app-vbox-head a.extra,.app-vbox.app-star-vbox,.winbox-mask.__mask,.G-browser,.js-app-topbanner.actv-banner,.btn-xz-app,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.main-rec-view-box.main-view-box.app-view-box,#CommentTarget,footer,.twinfo_iconwrap,.t_titlearrowup,.js-btn-newhy.btn-new-hy');
				} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/phone_play_film\?aid=/)) {
					cssobj('.player_film_bg,.p_f_pannel,.btn-xz-app,.twinfo_iconwrap,#film_top_banner,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.foot.sohu-swiper,#CommentTarget,footer,.player_film_cover,.t_titlearrowup');
				}
			} else if (obj.match(/^https?:\/\/m\.le\.com\/vplay_/)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('[class*="Daoliu"],[class^="j-Banner"],[id^="j-Banner"],[class*="Daoliu"],#j-leappMore,#j-zhoubian,#j-spoiler,#j-recommend,.leapp_btn,#j-toolbar>.animate1.column_box,.gamePromotionTxt,section#j-recommend,#j-comment,section.search_top,.footer,.intro_cnt dd,.up-letv');
			} else if (obj.match(/^https?:\/\/m\.iqiyi\.com\/v_/)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('section>a:first-child[href^="javascript:"]+a[href^="javascript:"],[name="m-vipWatch"]+div[class="m-box"],.m-title-anthology.m-title>.c-des,.m-linkMore,.m-hotSpot-update,.m-dom-loading-gray,[name="m-paopao"],[name="m-videoRec"]+div[class="m-box"],section.m-videoPlay-toolBar,.vue-portal-target,.m-iqylink-guide,.videoInfoFold-data,#openDesc,#comment,.page-c-items,.m-pp-entrance,.m-videoUser-spacing,[name="m-aroundVideo"],[name="m-videoRec"]');
				cssobj('section.m-hotWords-bottom,section.m-loading-info,[name="m-extendBar"]+div+div[class="m-box"],section.m-recommend-player,section.m-recommend-player+div[class="m-box-items m-box-items-full"],[name="m-extendBar"],.m-video-player .playCount-time,section.sourceHandle,div[is-call-app="true"]~div[class="m-box"],[class*="-banner"],[name="m-movieRec"],[name="m-movieHot"],[name="m-vipWatch"],[name="m-vipRights"],.video-data,.m-video-extendBar,.m-ipRelation-spacing.m-ipRelation-home.m-ipRelation');
			} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/wap\/.+?\/show\/id\//)) {
				jqjs();
				jxbzdjxhyobj();
				cssobj('.appdown,.clearfix.player_menu_con,#gotop,.movie_title>.clearfix,.tele-play-rec.clearfix.ws_row.recommend,.hot-vcr,.ws_footer,div.navlist a:not([data-aliitemname*="电"]):not([data-aliitemname*="动"]):not([data-aliitemname="综艺"]):not([data-aliitemname="VIP"])');
			} else if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com/)) {
				if (!obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.+?(?:cid=|cover\/)/)) {
					(function() {
						let qqasxobj_counter = 0;
						let qqasxobj_jiankong = setInterval(function() {
							let qqasxobj_btn = document.querySelector('a[href*="/x/"]');
							if (qqasxobj_btn) {
								(function() {
									try {
										let b = document.querySelectorAll('a[href*="/x/"]');
										for (let i = 0, len = b.length; i < len; i++) {
											b[i].setAttribute('target', '_blank')
										}
									} catch (e) {
										return false
									}
								})();
								clearInterval(qqasxobj_jiankong);
								return false
							}++qqasxobj_counter;
							if (qqasxobj_counter > 50) {
								clearInterval(qqasxobj_jiankong);
								return false
							}
						}, 666)
					})();
				} else {
					jqjs();
					jxbzdjxhyobj();
					cssobj('[dt-params*="推荐"],[dt-params*="会员特权"],[open-app]:not(li),.mod_source,.U_color_b.video_types_new.video_types,.mod_video_info_bottom.mod_video_info,.mod_promotion,.mod_recommend.mod_box,.mod_clips.mod_box,.mod_comment.mod_box,.mod_multi_figures_h.mod_sideslip_h.mod_box,.mod_game_rec.mod_box');
				}
			} else {
				bdtbobj();
			}
		}
		if (vipzdjxwzobj) {
			(function() {
				let aa = 1, bb = '<span><a1 style="display:none"></a1><a2 style="display:none">', cc = '<span><a1 style="color:darkgreen">搜索</a1><a2 style="display:none">', dd = '<span><a1 style="color:darkgreen">跳转</a1><a2 style="display:none">', ee = '<span><a1 style="color:darkgreen">小窗</a1><a2 style="display:none">', ff = '<span><a1 style="color:darkgreen">大窗</a1><a2 style="display:none">', ii = '<span style="background-color:hotpink"><a1 style="color:darkgreen"></a1><a2 style="display:none">', kk = '<span style="display:grid"><a1 style="color:darkgreen">自用</a1><a2 style="display:none">', jj = '<span style="background-color:darkorange"><a1 style="color:darkgreen"></a1><a2 style="display:none">', gg = '</a2><a3 style="color:#2196F3;zoom:0.8;font-weight:bold;">➽</a3><a4>', hh = '</a2><a3 style="display:none"></a3><a4>', https = [{
					name: cc + aa+++gg + "最大网",
					vip: "最大网"
				}, {
					name: cc + aa+++gg + "布米米",
					vip: "布米米"
				}, {
					name: ii + aa+++hh + "m1907",
					url: "https://z1.m1907.cn/?jx="
				}, {
					name: jj + aa+++hh + "B站专用①",
					url: "https://api.tv920.com/jx/?url="
				}, {
					name: jj + aa+++hh + "B站专用②",
					url: "https://jiexi.q-q.wang/?url="
				}, {
					name: jj + aa+++hh + "B站专用③",
					url: "https://jiexi.380k.com/?url="
				}, {
					name: bb + aa+++hh + "纯白",
					url: "https://www.chunbaix.top/cbai/ys?url="
				}, {
					name: ii + aa+++hh + "久播",
					url: "https://vip.jiubojx.com/vip/?url="
				}, {
					name: ii + aa+++hh + "悟空",
					url: "https://static.jsapre.com/player/analysis.php?v="
				}, {
					name: ii + aa+++hh + "思古①",
					url: "https://api.sigujx.com/?url="
				}, {
					name: ii + aa+++hh + "思古②",
					url: "https://jsap.attakids.com/?url="
				}, {
					name: ii + aa+++hh + "思云",
					url: "https://jx.ap2p.cn/?url="
				}, {
					name: ii + aa+++hh + "萝卜",
					url: "https://jx.lbe4.co/?url="
				}, {
					name: ii + aa+++hh + "小蒋",
					url: "https://www.kpezp.cn/jlexi.php?url="
				}, {
					name: ii + aa+++hh + "云解析",
					url: "https://jx.mw0.cc/vip.php?v="
				}, {
					name: ii + aa+++hh + "蘑菇",
					url: "https://jx.wzslw.cn/?url="
				}, {
					name: ii + aa+++hh + "星驰",
					url: "https://vip.cjys.top/?url="
				}, {
					name: ii + aa+++hh + "福星",
					url: "https://jx.popo520.cn/jiexi/?url="
				}, {
					name: ii + aa+++hh + "大师",
					url: "https://jx.ergan.top/?url="
				}, {
					name: ii + aa+++hh + "爱看",
					url: "https://jx.ikancloud.cn/?url="
				}, {
					name: ii + aa+++hh + "365",
					url: "https://jx.ljtv365.com/?url="
				}, {
					name: ii + aa+++hh + "加速",
					url: "https://www.cuan.la/m3u8.php?url="
				}, {
					name: bb + aa+++hh + "8090",
					url: "https://www.8090g.cn/?url="
				}, {
					name: bb + aa+++hh + "H8",
					url: "https://www.h8jx.com/jiexi.php?url="
				}, {
					name: bb + aa+++hh + "M3u8",
					url: "https://jiexi.janan.net/jiexi/?url="
				}, {
					name: bb + aa+++hh + "月亮",
					url: "https://api.yueliangjx.com/?url="
				}, {
					name: bb + aa+++hh + "蝴蝶",
					url: "https://api.hdworking.top/?url="
				}, {
					name: bb + aa+++hh + "618G",
					url: "https://jx.618g.com/?url="
				}, {
					name: bb + aa+++hh + "盘古",
					url: "https://pangu.yilans.net/yun/?url="
				}, {
					name: bb + aa+++hh + "迪奥",
					url: "https://jx.idc126.net/jx/?url="
				}, {
					name: ee + aa+++gg + "17云",
					url: "http://17kyun.com/api.php?url=",
					vip: "强制弹小窗"
				}, {
					name: ee + aa+++gg + "大白",
					url: "http://api.myzch.cn/?url=",
					vip: "强制弹小窗"
				}, {
					name: ee + aa+++gg + "电影盒子",
					url: "http://jx5.178du.com/p1/?url=",
					vip: "强制弹小窗"
				}];

				function createSelecthttps(https) {
					let httpsvipul = document.createElement("ul");
					httpsvipul.id = "httpsvipul";
					if (jxbpcobj) {
						httpsvipul.setAttribute("style", "display:none");
					} else {
						httpsvipul.setAttribute("style", "display:none;background:#18222d;width:99vw;max-width:728px;height:150px;margin:0;padding:0;position:fixed;bottom:7px;left:50%;transform:translateX(-50%);z-index:99999;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;");
					}
					for (var i = 0; i < https.length; i++) {
						let httpsvipli = document.createElement("li");
						let that = this;
						if (jxbpcobj) {} else {
							httpsvipli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;float:left;font-size:16px;color:#999 !important;font-weight:900;width:14.285%;height:47.5px;text-align:center;line-height:63.5px;letter-spacing:0;border-bottom:0.5px solid #333;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;cursor:pointer;");
						}
						if (jxbpcobj) {
							(function(num) {
								httpsvipli.onclick = function() {
									let arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"], bxjImg = Math.floor(Math.random() * arr.length), jxbimg = "https://gitee.com/qq1128059/" + arr[bxjImg] + ".jpg";
									var remove = function(selector) {
											if (!document.querySelectorAll) {
												return;
											}
											var nodes = document.querySelectorAll(selector);
											if (nodes) {
												for (var i = 0; i < nodes.length; i++) {
													if (nodes[i] && nodes[i].parentNode) {
														nodes[i].parentNode.removeChild(nodes[i]);
													}
												}
											}
										};
									var jxbjxurl, jjxxbb, jxb;

									function zddjjk() {
										let jihao1 = 'ul#httpsvipul>li:nth-child(' + pchttpsjk + ')';
										let jihaoa = [jihao1];
										for (i = 0; i < jihaoa.length; i++) {
											if (exist(jihaoa[i])) {
												exist(jihaoa[i]).click();
												console.log("%c电脑会员视频自动判断-原网页-成功点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px")
											}
										}
										function exist(jihaoa) {
											if (document.querySelector(jihaoa)) {
												return document.querySelector(jihaoa)
											} else {
												return false
											}
										}
									};

									function sddj() {
										try {
											if (pcliwaiobj) {
												$(function() {
													var qjsdjk_counter = 0;
													var qjsdjk_jiankong = setInterval(function() {
														var qjsdjk_btn = $("ul#httpsvipul>li");
														if (qjsdjk_btn) {
															zddjjk();
															clearInterval(qjsdjk_jiankong);
															return false
														}++qjsdjk_counter;
														if (qjsdjk_counter > 50) {
															clearInterval(qjsdjk_jiankong);
															return false
														}
													}, 500)
												})
											} else {}
										} catch (e) {
											return false;
										}
									};

									function jxqzsxobj() {
										let url = window.location.href;
										setInterval(function() {
											let newUrl = window.location.href;
											if (newUrl != url) {
												url = window.location.href;
												location.reload();
											}
										});
									};

									function zdztsp() {
										(function() {
											setTimeout(function() {
												if (document.getElementsByTagName("video")[0]) {
													var v_player = document.getElementsByTagName("video");
													for (var i = 0, length = v_player.length; i < length; i++) {
														try {
															v_player[i].muted = true;
															v_player[i].volume = 0;
															v_player[i].pause();
														} catch (e) {
															return false;
														}
													}
												} else if (document.getElementsByTagName("object")[0]) {
													var v_player = document.getElementsByTagName("object");
													for (var i = 0, length = v_player.length; i < length; i++) {
														v_player[i].parentNode.removeChild(v_player[i])
													}
												}
											}, 500)
										})()
									};
									zdztsp();
									let tctha = '<div style="text-shadow:0 0 2px #eee!important;letter-spacing:-1px!important;font-weight:bold!important;padding:0!important;font-family:arial,sans-serif!important;font-size:30px!important;color:#ccc!important;width:auto!important;height:52px!important;border:4px solid #ccc!important;border-radius:12px!important;position:absolute!important;top:50%!important;left:45%!important;margin:-30px 0 0 -80px!important;text-align:center!important;line-height:52px!important;">\u6211\u662f\u6c5f\u5c0f\u767d\uff0c\u751f\u6d3b\u5f88\u7b80\u5355</div>';
									let tcthb = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:1128859;"><img id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" loading="lazy" allowtransparency="true" frameborder="0" scrolling="no" sandbox="allow-scripts allow-same-origin allow-forms" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" src="' + jxbimg + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:1128059;"></img></div>';
									if (location.host.indexOf('youku') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/id_([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#player');
										ggobj('.youku-film-player');
										cssobj('#ykPlayer,.nav-mamu');
									} else if (location.host.indexOf('tudou') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/v\/([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^.+?\/id_([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html");
										vipobj('.td-playbox');
										vipobj('#player');
										remove('.td-interactbox');
									} else if (location.host.indexOf('qq') > 0) {
										if (location.href.indexOf('/x/cover/') > 0) {
											jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										} else if (location.href.indexOf('/variety/p/topic/') > 0) {
											jxbjxurl = document.querySelector(".current .figure_title").offsetParent.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
											(function() {
												try {
													let aElement = document.querySelectorAll('[_wind*="列表"] ul li a[href*="/x/"][target]');
													for (let i = 0; i < aElement.length; i++) {
														aElement[i].getAttributeNode('target').value = "_top"
													}
												} catch (e) {
													return false
												}
											})();
										}
										function qqdszx() {
											vipobj('#mod_player');
											ggobj('#dark_layer');
											ggallobj('div[class*="_vip_popup"]');
											remove('txpdiv,[class*="poplay"],[id*="poplay"],[class^="x_"],[id^="x_"],[class^="mod_action "],[id^="mod_action "],[class*="_vip_popup"],[class*="_vip_popup"],[id*="_vip_popup"],script[crossorigin="anonymous"],[_r-component="player"],[_r-component="c-popups"]');
											cssobj('.mod_player_section.cf{background-color:transparent}.mod_vip_popup.wrapper,.cf.mod_action');
										};
										setTimeout(qqdszx, 888);
									} else if (location.host.indexOf('mgtv') > 0) {
										if (location.href.indexOf('mgtv.com/b/') > 0) {
											jxbjxurl = window.location.href.replace(/^.+?\/b\/(.+?)\.html.*$/, "http://www.mgtv.com/b/$1.html");
											vipobj('#mgtv-player-wrap');
											ggobj("#mgtv-player-wrap container");
											cssobj("outer-bottom,container");
										} else if (location.href.indexOf('mgtv.com/act/') > 0) {
											function iqiyiurltxobj() {
												jxbjxurl = document.querySelector('li[class^="play-item is-full is-"][class$=" on"]').getAttribute("data-vurl").replace(/^.*?\/b\/(.+?)\.html.*$/ig, "http://www.mgtv.com/b/$1.html");
												vipobj('.c-player-video');
											};
											iqiyiurltxobj();
											remove('[class^="frag-list-box"]');
											if (!document.querySelector("#vip_iframe__") && document.querySelector("ul.v-lists")) {
												let qisdjxa = document.querySelector("ul.v-lists");
												qisdjxa.onclick = function(e) {
													setTimeout(iqiyiurltxobj, 777);
												};
											} else {}
										}
									} else if (location.host.indexOf('iqiyi') > 0) {
										function iqiyidszx() {
											jxbjxurl = window.location.href.replace(/^https?:\/\/(?:t|ww)w\./, "http://www.").replace(/html[\W_].*?$/, "html");
											vipobj('#flashbox');
											ggobj('#secondFrame');
											remove('div#scrollTip,.qy-glide,#qy-glide,[class^="qy-glide"],[id^="qy-glide"],svg[display="none"][aria-hidden="true"],div[class*="player-side-ear"],div[class^="player-mnb"][data-asyn-pb]');
											removeall('div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"])', undefined, false);
											cssobj('div[class*="player-side-ear"],div[class^="player-mnb"][data-asyn-pb]');
										};
										setTimeout(iqiyidszx, 888);
										if (location.href.indexOf('iqiyi.com/v_') > 0) {
											(function() {
												$("body").on('mouseover', 'ul li [href*="/v_"][href*=".html"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
													let jxbzqxjobj = $(this), href = jxbzqxjobj.attr('href') || jxbzqxjobj.data("href");
													jxbzqxjobj.off('click.chrome');
													jxbzqxjobj.on('click.chrome', function() {
														window.location.href = href
													}).attr('data-href', href).css({
														cursor: 'pointer'
													}).removeAttr('href')
												})
											})();
										} else if (location.href.indexOf('iqiyi.com/a_') > 0) {
											try {
												cssobj('div.lequPlayer{height:' + document.querySelector("div.play-dianbo").offsetHeight + 'px!important;width:' + document.querySelector("div.play-dianbo").offsetWidth + 'px!important;}');
											} catch (e) {}
											remove('div[class*="-list-box"][class*="-lianboList"],div[class$="-side-icon"],div[id*="scrollBox"],div[class*="tem_voteEnter"]');
										} else {}
									} else if (location.href.indexOf('tv.sohu.com/v/') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#player');
										cssobj('#player_vipTips,#toolBar');
									} else if (location.href.indexOf('film.sohu.com/album/') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#playerWrap');
										ggobj('#detail_btn_play');
										remove('.player-content-bg,.pop-operates');
									} else if (location.host.indexOf('.le') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#fla_box');
									} else if (location.host.indexOf('pptv') > 0) {
										jxbjxurl = window.location.href.replace(/^^https?:\/\/\w+?\./, "http://www.").replace(/\.html\?.+$/, ".html");
										vipobj('#pptv_playpage_box');
										ggobj('.sidebarbtn');
										cssobj('div[class^="module-video"][class*="-ops"]');
									} else if (location.host.indexOf('1905.com') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#playBox');
										ggobj('object');
										remove('.sc-content,.sc-paper,.sc-error');
										cssobj('.player-widget');
									} else if (location.host.indexOf('wasu') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('#player');
										vipobj('.player');
										ggobj('.qp');
										cssobj('div#pcplayer{height:100%;}.play_video_b');
									} else if (location.host.indexOf('bilibili') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/\?spm_id_.*?$/, "");
										vipobj('#player_module');
										ggobj('#player_mask_module');
									} else if (location.host.indexOf('.fun.tv') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('#html-video-player-layout');
									} else if (location.host.indexOf('.miguvideo.com') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('.play');
										cssobj('div.episodeInfo+div.title,div.leftImgRightText');
									} else {}
									function cssobj(css) {
										document.head.insertAdjacentHTML("beforeend", '<style class="ywy-cssobj-jiangxiaobai" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
									};

									function ggobj(gg) {
										setTimeout(function() {
											if (document.querySelector(gg)) {
												try {
													document.querySelector(gg).remove()
												} catch (e) {}
											} else {}
										}, 250)
									};

									function ggallobj(all) {
										setTimeout(function() {
											if (document.querySelectorAll(all)) {
												try {
													document.querySelectorAll(all)[0].remove()
												} catch (e) {}
											} else {}
										}, 345)
									};

									function vipobj(vip) {
										jjxxbb = https[num].url + jxbjxurl + https[num].vip;
										jxb = jjxxbb.replace(/^(.+?)undefined$/, "$1");
										setTimeout(function() {
											if (document.querySelector(vip)) {
												if (document.getElementsByTagName('video')) {
													try {
														if (document.getElementsByTagName('video')) {
															document.getElementsByTagName('video')[0].remove();
														} else {} if (document.getElementsByTagName('object')) {
															document.getElementsByTagName('object')[0].remove();
														} else {}
													} catch (e) {}
												} else {} if (jxb.match(new RegExp("^https:\/\/(?!.+?强制(?:弹[小大]窗|跳转))")) && !jxb.match(new RegExp("(?:最大网|布米米)"))) {
													document.querySelector(vip).innerHTML = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:1128059;"><iframe id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" loading="lazy" allowtransparency="true" frameborder="0" scrolling="no" sandbox="allow-scripts allow-same-origin allow-forms" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" src="' + jxb + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:1128059;"></iframe></div>';
													jxqzsxobj();
												} else {
													function tcthaobj() {
														document.querySelector(vip).innerHTML = tctha;
														jxqzsxobj();
													};

													function tcthbobj() {
														document.querySelector(vip).innerHTML = tcthb;
														jxqzsxobj();
													};
													if (jxb.match(new RegExp("最大网"))) {
														tcthaobj();
														(function() {
															try {
																let jxmmss_counter = 0;
																let jxmmss_jiankong = setInterval(function() {
																	let jxmmss_btn = document.querySelector("div.maomibtn");
																	if (jxmmss_btn) {
																		try {
																			window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.zuidazy"]').href, "_blank")
																		} catch (e) {}
																		clearInterval(jxmmss_jiankong);
																		return false
																	}++jxmmss_counter;
																	if (jxmmss_counter > 10) {
																		clearInterval(jxmmss_jiankong);
																		return false
																	}
																}, 500)
															} catch (e) {
																return false;
															}
														})();
													} else if (jxb.match(new RegExp("布米米"))) {
														tcthaobj();
														(function() {
															try {
																let jxmmss_counter = 0;
																let jxmmss_jiankong = setInterval(function() {
																	let jxmmss_btn = document.querySelector("div.maomibtn");
																	if (jxmmss_btn) {
																		try {
																			window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]').href, "_blank")
																		} catch (e) {}
																		clearInterval(jxmmss_jiankong);
																		return false
																	}++jxmmss_counter;
																	if (jxmmss_counter > 10) {
																		clearInterval(jxmmss_jiankong);
																		return false
																	}
																}, 500)
															} catch (e) {
																return false;
															}
														})();
													} else {
														tcthbobj();
														if (jxb.match(new RegExp("^https?:\/\/.+?强制跳转"))) {
															window.open(jxb.replace(/强制跳转.*?$/, ""), "bkmk_popup");
														} else if (jxb.match(new RegExp("^https?:\/\/.+?强制弹大窗"))) {
															let tmpobj = window.open(jxb.replace(/强制弹大窗.*?$/, ""), "bkmk_popup", "fullscreen=1");
															tmpobj.resizeTo(screen.width, screen.height);
														} else if (jxb.match(new RegExp("^https?:\/\/(?:.+?强制弹小窗)?"))) {
															window.open(jxb.replace(/强制弹小窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
														}
													}
												}
											} else {}
										}, 500);
									};
								};
							})(i);
						} else {
							(function(num) {
								httpsvipli.onclick = function() {
									var jxbjxurl, jjxxbb, jxb;
									var qp = 'data-ad="false" marginwidth="0" marginheight="0" autoplay="ture" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" allowTransparency="allowTransparency" border="0" frameborder="0" scrolling="no" marginwidth="0"';
									var style = "border:none;outline:none;margin:0;padding:0;";
									var remove = function(selector) {
											if (!document.querySelectorAll) {
												return;
											}
											var nodes = document.querySelectorAll(selector);
											if (nodes) {
												for (var i = 0; i < nodes.length; i++) {
													if (nodes[i] && nodes[i].parentNode) {
														nodes[i].parentNode.removeChild(nodes[i]);
													}
												}
											}
										};

									function jxqzsxobj() {
										let url = window.location.href;
										setInterval(function() {
											let newUrl = window.location.href;
											if (newUrl != url) {
												url = window.location.href;
												location.reload();
											}
										});
									};
									if (location.host.indexOf('youku') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/id_([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#player');
									} else if (location.host.indexOf('mgtv') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/b\/(.+?)\.html.*$/, "http://www.mgtv.com/b/$1.html");
										vipobj('.video-area');
									} else if (location.host.indexOf('pptv') > 0) {
										jxbjxurl = window.location.href.replace(/^^https?:\/\/\w+?\./, "http://www.").replace(/\.html\?.+$/, ".html");
										vipobj('#playerbox');
									} else if (location.host.indexOf('1905.com') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/\.shtml\?.+$/, ".shtml");;
										vipobj('#player');
									} else if (location.href.indexOf('tv.sohu.com') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/^.+?vid=(\w+).*$/, "http://m.tv.sohu.com/v$1.shtml").replace(/\.shtml\?.*$/, ".shtml");
										vipobj('.player');
									} else if (location.host.indexOf('.le') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/vplay_(.+?)\.html.*$/, "http://www.le.com/ptv/vplay/$1.html");
										vipobj('#j-player');
										vipobj('.column.play');
									} else if (location.host.indexOf('iqiyi') > 0) {
										jxbjxurl = window.location.href.replace(/^.+?\/v_(.+?)\.html.*$/, "http://www.iqiyi.com\/v_$1.html");
										vipobj('.m-video-player');
										cssobj('[name="m-videoInfo"]{margin-top:5%;}.m-video-player{background:black!important;}.m-video-player-wrap{top:-202px!important}1128059');
										remove('[id*="open_app_iframe"],[style*="hidden"][style*="absolute"]');
									} else if (location.host.indexOf('wasu') > 0) {
										jxbjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/\/wap\/play\/show\/id\//, "/play/show/id/");
										vipobj('.ws_play.relative');
										vipobj('#pop');
									} else if (location.host.indexOf('qq.com') > 0) {
										if (location.href.match(/[cv]id/)) {
											jxbjxurl = window.location.href.replace(/^.+?cid=(\w+)(?:&vid=)?$/, "http://v.qq.com/x/cover/$1.html").replace(/^.+?cid=(\w+)&vid=(\w+).*$/, "http://v.qq.com/x/cover/$1/$2.html");
											vipobj('#player');
											vipobj('.player_viptips');
										} else {
											setTimeout(function() {
												jxbjxurl = window.location.href.replace(/^https?:\/\/(?!.+?[cv]id).{1,}\/(\w+?)\.html.*$/, "http://v.qq.com/x/cover/$1.html");
												vipobj('section.mod_player');
											}, 2345);
										}
									} else {}
									function cssobj(css) {
										document.head.insertAdjacentHTML("beforeend", '<style class="ywy-cssobj-jiangxiaobai" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
									};

									function ggobj(gg) {
										setTimeout(function() {
											if (document.querySelector(gg)) {
												try {
													document.querySelector(gg).remove()
												} catch (e) {}
											} else {}
										}, 250)
									};

									function ggallobj(all) {
										setTimeout(function() {
											if (document.querySelectorAll(all)) {
												try {
													document.querySelectorAll(all)[0].remove()
												} catch (e) {}
											} else {}
										}, 345)
									};

									function vipobj(vip) {
										jjxxbb = https[num].url + jxbjxurl + https[num].vip;
										jxb = jjxxbb.replace(/^(.+?)undefined$/, "$1");
										setTimeout(function() {
											if (document.querySelector(vip)) {
												if (document.getElementsByTagName('video')) {
													try {
														if (document.getElementsByTagName('video')) {
															document.getElementsByTagName('video')[0].remove();
														} else {} if (document.getElementsByTagName('object')) {
															document.getElementsByTagName('object')[0].remove();
														} else {}
													} catch (e) {}
												} else {} if (jxb.match(new RegExp("^https:\/\/"))) {
													document.querySelector(vip).innerHTML = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;"><iframe id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" loading="lazy" style="' + style + '" width="100%" height="100%"' + qp + ' src="' + https[num].url + jxbjxurl + '"></iframe></div>';
													jxqzsxobj();
												} else if (jxb.match(new RegExp("^http:\/\/"))) {
													window.open(https[num].url + jxbjxurl, "_blank");
												}
											}
										}, 500);
									};
								};
							})(i);
						}
						httpsvipli.innerHTML = https[i].name;
						httpsvipul.appendChild(httpsvipli)
					};
					document.body.appendChild(httpsvipul)
				};
				if (jxbpcobj) {
					let vipjxzstb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADyUlEQVRYhc2UbWhbVRjHf7dpZzXGBemmU2FtM1uEZssoOOhmXbsXXLPVidqydTiZzQfpGPhlH2T95GKKzDGwijgdTJlbohXUdU5aypbqHDIYKih1rg4VphtoJY1U23L8cM7NufcmWe6tRX3gcF7+z3Oe33nOuRf+R3YIuAAI4DfgA+BupTUAo0oTauycrwaOAuOWdau+B1hyo+TOIEFoi+CZMYFh5GtzaIZhTKjD5NkFQHx5GZERiJ8nVZCvUhB9WQAifkBqGYHY2yt1c95/WCcZ/0Wvm23oEx0D/F6oEocA8WZKB8V6LFVAbmJqofriAM7k1paDMBacNBOXyW7hVYD3BzTRiogaXBkCIKzm5z+Fy2PFblLb0dchYEB0HWSzcm3Hk0r0L41ya+fjEsDf9hCJiT58lQwktXPj/cp5dopYD/j9cvr5+dLJrZYegXePy3FNrVqcvAQdz6ao6tpexr7BjwCo3gDAZ6PSp2E5hOrlOFcN4MhhbwAAty0sIrTvPVaWm6zcJgHOaf3RDtk3t8rebfmtFuuBjW06HoBgOKdrgJr1ALzwnA5uCMsqmKXzUv6d3ZARcLBfXl82C6++pMR7owUAAovgriYbaaQRWtfrTT8+5R7AtOvXYPg0dLTDQBII1EN4WwEAgJVdgD5pTa2+/+/H5YOiKoIbM7+C2jvgkU1m7Cpo67f52QHq5HGtJ93ZLfv0iFoItbgCyFnFIli6GdbEof018C8uAjALLK6DqgjpEXliq6XUp0Sk0xtAw3ZYF4e6zXJu2GUNUKl6dcLciXGUv3qVNwCnCeCWcgvA/i1dNgd1wt0xeYcBA5aH7HDmYzX13TEdnre2pNEO4C+HP2bk+MMX9/iY/vYrzgxfpHWXfJrBe2DZJrj6NWR+lI5VEflytx6U8+rV8MNFrQfD0HoArn8HU9fsa3eu0MmDFZBRyVPxp5l4+xV9I74HouxPn8SLCeDKGExPgWHc2DdYARPTcvxOopvMiTfA9ghHB9n3YLRg8FzNZCqS3A4AMJs+NW8QBrJCty8omjwfYL4gzOQAv/6lksefciYvDGBC9K7daFv70wOAcMyTiSfIpI4Uci0MADBzdsgGcZNHCGvy7Im3isnFAeYDokTy0gA5iJYNniGSz+8oldwdAMDMmWF6m9fmQRhmc/wDUn2dZJPH3GztDgBgZvRsHsQUMO0oR6qvk8njKbfbugcoBFHp0D0m/wfW1ExCCBJCsOsL2W5++LF/IbHVAk05AO7bOtddyku7FLPMuRbfe2t+CvuDl/hmcO77/Mf2N6TgrX4E/h5BAAAAAElFTkSuQmCC";
					let zbzsgd = "120";
					let zbzszy = "25";
					let zbzsdx = "0.6";
					let ywylbkd = "350";
					let ywylbgd = "125";
					let ywylbzy = "5";
					let ywylbdx = "1";
					let ywylbjl = "33.3";

					function createMenuhttps() {
						let jxbhttps = document.createElement("div");
						jxbhttps.id = "jxbhttps";
						jxbhttps.title = "点击 此按钮 弹出 原网页解析 接口选择";
						jxbhttps.setAttribute('style', 'top:' + zbzsgd + 'px!important;left:' + zbzszy + 'px!important;zoom:' + zbzsdx + '!important;font-size:15px;width:35px;height:35px;line-height:35px;text-align:center;background-size:100% 100%;background-image:url(' + vipjxzstb + ');text-align:center;background-color:transparent;overflow:hidden;user-select:none;position:absolute;z-index:1128059;bottom:280px;border-radius:10px');
						jxbhttps.onclick = function() {
							let httpsvipul = document.getElementById("httpsvipul");
							httpsvipul.setAttribute('tabindex', '1');
							let redHide = document.getElementById('httpsvipul');
							redHide.onblur = (() => {
								redHide.style.display = 'none';
								this.style.transform = "rotateZ(0deg)";
							});
							if (httpsvipul.style.display == "none") {
								httpsvipul.style.display = "block";
								this.style.transform = "rotateZ(-90deg)";
							} else {
								httpsvipul.style.display = "none";
								this.style.transform = "rotateZ(0deg)";
							}
						};
						document.body.appendChild(jxbhttps);
					};
					createSelecthttps(https);
					createMenuhttps();
					document.head.insertAdjacentHTML('beforeend', '<style>ul#httpsvipul>li{margin:-4px 0px}ul#httpvipul>li{margin:-4px 0px}ul#httpsvipul{width:' + ywylbkd + 'px!important;top:' + ywylbgd + 'px!important;left:' + ywylbzy + 'px!important;zoom:' + ywylbdx + '!important;position:fixed;z-index:2147483647!important;font-size:13px;user-select:none;color:black;transition:all .5s ease 0s;overflow:hidden}ul#httpsvipul>li{width:' + ywylbjl + '%!important}ul#httpsvipul>li{color:black;display:flex;cursor:pointer;float:left;line-height:25px;padding:0;font-size:17px;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize;text-decoration:none;vertical-align:baseline;position:relative;zoom:.6}ul#httpsvipul>li>span{text-align:center;font-weight:bold;color:black;display:inline-block;padding:5px;margin:5px;font-size:18px;line-height:1;border:1px solid #fcfcfc;border-radius:3px;text-decoration:none;background-color:blanchedalmond;width:100%;box-shadow:1px 1px 4px #444,inset -2px -2px 4px #fff,inset 2px 2px 4px #aaa}ul#httpsvipul>li>span:hover{border-style:dashed!important;background:rebeccapurple!important;color:red!important}wsjxbshhjd#wsjxbshhjd>sapn:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul>a:hover{border-style:dashed!important;background-color:rebeccapurple!important;color:aliceblue!important}ul#httpsvipul>a:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul .wsjxbshhjd{color:red!important;background-color:darkblue!important;box-shadow:rgba(255,254,255,0.6) 0 .3em .3em inset,rgba(0,0,0,0.15) 0 -0.1em .3em inset,darkblue 0 .1em 3px,darkblue 0 .3em 1px,rgba(0,0,0,0.2) 0 .5em 5px!important}ul#httpsvipul .wsjxbshhjd a1{color:cyan!important}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold;}</style>');
				} else {
					function createMenuhttps() {
						var jxbhttps = document.createElement("div");
						jxbhttps.id = "jxbhttps";
						jxbhttps.innerHTML = '<div title="点击 此按钮 弹出 原网页解析 接口选择"><svg style="width:40px;height:40px;position:fixed;bottom:200px;right:0.5vmin;z-index:100000;text-align:center;line-height:48.5px;font-size:20.8px;border-radius:10.3px;cursor:pointer;"</svg>;<svg viewBox="128 128 256 256"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6z"/><path d="M222.2 303.4v-94.6l90.7 47.3L222.2 303.4z" fill="#18222d"/></svg>';
						jxbhttps.setAttribute("style", "color:#008000;fill:#008000;");
						jxbhttps.onclick = function() {
							let httpsvipul = document.getElementById("httpsvipul");
							httpsvipul.setAttribute('tabindex', '1');
							let redHide = document.getElementById('httpsvipul');
							if (httpsvipul.style.display == "none") {
								try {
									document.querySelector("#jxbewanobj").click();
								} catch (e) {}
							} else {
								try {
									document.querySelector("#jxbewanobj").click();
								} catch (e) {}
							}(function() {
								let pdjqjssfczobj_counter = 0;
								let pdjqjssfczobj_jiankong = setInterval(function() {
									let pdjqjssfczobj_btn = document.querySelector("script#jiangxiaobaijqjs");
									if (pdjqjssfczobj_btn) {
										try {
											$('ul#httpsvipul>li').click(function() {
												if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
													let pchttpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
													localStorage.setItem("pchttpsjk", pchttpsjksz)
												}
											});
										} catch (e) {
											return false
										}
										clearInterval(pdjqjssfczobj_jiankong);
										return false
									}++pdjqjssfczobj_counter;
									if (pdjqjssfczobj_counter > 100) {
										clearInterval(pdjqjssfczobj_jiankong);
										return false
									}
								}, 50)
							})();
							redHide.onblur = (() => {
								document.querySelector("#jxbhttps").click();
							});
							if (httpsvipul.style.display == "none") {
								httpsvipul.style.display = "block";
								this.style.cssText += "color:#cd7f32;fill:#cd7f32;background:0"
							} else {
								httpsvipul.style.display = "none";
								this.style.cssText += "color:#fff;fill:#008000;background:0"
							}
						};
						document.body.appendChild(jxbhttps)
					};
					createMenuhttps();
					createSelecthttps(https);
					(function() {
						const jxbqcsjjk = document.querySelectorAll('ul#httpsvipul li');
						for (let jxbqcsjjki = 0; jxbqcsjjki < jxbqcsjjk.length; jxbqcsjjki++) {
							const jxbqcsjjkmsa = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a1');
							for (let jxbqcsjjkia = 0; jxbqcsjjkia < jxbqcsjjkmsa.length; jxbqcsjjkia++) {
								if (jxbqcsjjkmsa[jxbqcsjjkia].innerText.match(/(?:搜索|跳转|[小大]窗)/g)) {
									jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
								}
							};
							const jxbqcsjjkmsb = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a4');
							for (let jxbqcsjjkib = 0; jxbqcsjjkib < jxbqcsjjkmsb.length; jxbqcsjjkib++) {
								if (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(/(?:m1907|专用|思[古云]|蘑菇|OK|小狼云|悟空|迪奥|618G|云端|老版|猫视频|365|1717|4080|8090|星驰|月亮|我爱|黑云|小蒋|九八看|金桥|赤兔|诺讯)/ig)) {
									jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
								}
							}
						}
					})();
					document.head.insertAdjacentHTML('beforeend', '<style>wsjxbshhjd#wsjxbshhjd>sapn:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul>a:hover{border-style:dashed!important;background-color:rebeccapurple!important;color:aliceblue!important}ul#httpsvipul>a:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul .wsjxbshhjd{color:red!important;background-color:darkblue!important;box-shadow:rgba(255,254,255,0.6) 0 .3em .3em inset,rgba(0,0,0,0.15) 0 -0.1em .3em inset,darkblue 0 .1em 3px,darkblue 0 .3em 1px,rgba(0,0,0,0.2) 0 .5em 5px!important}ul#httpsvipul .wsjxbshhjd a1{color:cyan!important}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold}ul#httpsvipul span[style^="background-color"]{background-color:transparent!important}::-webkit-scrollbar{width:0px!important;height:0px!important;}</style>');
					(function() {
						let jxbewj = '', jxbhttpsew = [{
							name: jxbewj + '<a style="float:left;border-radius:3.5px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px,rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;padding:5px 5px 5px 5px;border:4px outset buttonface;text-decoration:none;background-color:#4CAF50;margin-top:1px;" href="https://gitee.com/q2257227289/00/raw/master/817" target="_blank">\u53cb\u60c5\u8d5e\u52a9</a>'
						}, {
							name: jxbewj + '<a style="float:right;border-radius:3.5px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px,rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;padding:5px 5px 5px 5px;border:4px outset buttonface;text-decoration:none;background-color:#4CAF50;margin-top:1px;" href="https://qm.qq.com/cgi-bin/qm/qr?k=L-jw-xEQb3sV1HzirtcLjkl0vQpclyHR&noverify=0" target="_blank">联系作者</a>'
						}, {
							name: jxbewj + '<span id="vipzdjxhy" style="float:right;border-radius:3.5px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px,rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;padding:5px 5px 5px 5px;border:4px outset buttonface;text-decoration:none;background-color:#4CAF50;margin-top:1px;">开启自动</span>'
						}];

						function createSelectew(jxbhttpsew) {
							let jxbewjul = document.createElement("ul");
							jxbewjul.id = "jxbewjul";
							jxbewjul.setAttribute("style", "display:none;background:#18222d;width:99vw;max-width:728px;height:auto;margin:0;padding:0;position:fixed;bottom:150px;left:50%;transform:translateX(-50%);z-index:102030;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;white-space:nowrap;text-align:center;");
							for (let i = 0; i < jxbhttpsew.length; i++) {
								let jxbewjli = document.createElement("li");
								let that = this;
								jxbewjli.setAttribute("style", "margin:0px 5px;padding:0px 5px;display:inline-block;height:40px;text-align:center;");
								(function(jxbewj) {
									jxbewjli.onclick = function() {
										jxbhttpsew[jxbewj]
									}
								})(i);
								jxbewjli.innerHTML = jxbhttpsew[i].name;
								jxbewjul.appendChild(jxbewjli)
							}
							document.body.appendChild(jxbewjul)
						}
						function createMenuew() {
							let jxbewjBtn = document.createElement("div");
							jxbewjBtn.id = "jxbewanobj";
							jxbewjBtn.onclick = function() {
								let jxbewjul = document.getElementById("jxbewjul");
								if (jxbewjul.style.display == "none") {
									jxbewjul.style.display = "block"
								} else {
									jxbewjul.style.display = "none"
								}
							};
							document.body.appendChild(jxbewjBtn)
						}
						createMenuew();
						createSelectew(jxbhttpsew)
					})();

					function dssxbobj() {
						setTimeout(function() {
							window.location.reload();
						}, 666)
					};
					(function() {
						if (localStorage.getItem("vipzdjx") == '0') {
							document.getElementById('vipzdjxhy').innerText = '开启自动';
							document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd'
						} else if (localStorage.getItem("vipzdjx") == '2') {
							document.getElementById('vipzdjxhy').innerText = '关闭自动';
							document.querySelector("#vipzdjxhy").style.backgroundColor = '#4CAF50'
						}
						document.getElementById('vipzdjxhy').onclick = function() {
							if (this.innerHTML == '开启自动') {
								localStorage.setItem("vipzdjx", "2");
								this.innerText = '关闭自动';
								document.querySelector("#vipzdjxhy").style.backgroundColor = '#4CAF50';
								dssxbobj()
							} else if (this.innerHTML == '关闭自动') {
								localStorage.setItem("vipzdjx", "0");
								this.innerText = '开启自动';
								document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
								dssxbobj()
							}
						}
					})();
				}
				setTimeout(() => {
					try {
						document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("pchttpsjk") + ")>span").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAMAAACHgmeRAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURX//AIH8BobyGoT/CZP/J4nxIIL5C5T8LJj0PW2hJpgAAAAeSURBVAjXY2BlY4QABiZGBiigNouVGQoYONhZIAAAEpYAdsB2b4AAAAAASUVORK5CYII=)";
					} catch (e) {}
					let a = document.querySelectorAll('ul#httpsvipul>li>span');
					let l = a.length;
					for (let i = 0; i < l; i++) {
						a[i].onclick = function() {
							for (let j = 0; j < l; j++) {
								if (this == a[j]) {
									try {
										$("ul#httpsvipul>li>span").css("backgroundImage", "");
									} catch (e) {}
									this.className = "wsjxbshhjd"
								} else {
									a[j].className = ""
								}
							}
						}
					}
				}, 2345)
			})();
		} else {}
		function zdbt() {
			if (jxbpcobj) {
				let jxbzdws = document.title.replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1");
				let jxbzdwsjs = document.title.replace(/\s+?/, "").replace(/会员\w+?版/, "").replace(/^(?!.*?(?:(?:\s*?[\-\—\_<《\(（]\s*?)?[^\s:：]+?\d{1,3}?\s*?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?)|(?:第\s*?.{1,3}|20\d{4,})\s*?[部季集话部期]|第\s*?\d{4}-\d{2}-\d{2}\s*?[部季集话部期]|先导片|彩蛋|看点|花絮|预告|神剧亮了)).*?$/, "").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|神剧亮了|[部季集话部期]\s*?[上下]|第\s*?.{1,3}\s*?[部季].*?第\s*?\d{4}-\d{2}-\d{2}\s*?期)).*((?:(?:第\s*?.{1,3}|(?:第\s*?|\s+?)20\d{4,})\s*?(?<![\-_])[部季集话部期])).*?$/i, "$1").replace(/.+?(先导片|彩蛋|看点|花絮|预告|神剧亮了|第\s*?.{1,3}\s*?[部季集话部期]\s*?[上下][部季集话部期]?).*?$/, "$1").replace(/^[^:：]+?(20\d{6})\s*?(期).*$/, "第$1$2").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|神剧亮了|[部季集话部期]\s*?[上下])).+?(第)\s*?(\d{4})-(\d{2})-(\d{2})\s*?([期]).*?$/, "$1$2$3$4$5").replace(/20\d{2}(\d{4}期)/, "$1");
				if (jxbzdwsjs == null || jxbzdwsjs == undefined || jxbzdwsjs == '') {
					document.title = jxbzdws + jxbzdwsjs;
				} else {
					document.title = jxbzdws + '：' + jxbzdwsjs;
				}
			} else {}
		};

		function zddjjk() {
			let jihao1 = 'ul#httpsvipul>li:nth-child(' + pchttpsjk + ')';
			let jihaoa = [jihao1];
			for (i = 0; i < jihaoa.length; i++) {
				if (exist(jihaoa[i])) {
					exist(jihaoa[i]).click();
					console.log("%c会员视频自动判断--成功点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px")
				}
			}
			function exist(jihaoa) {
				if (document.querySelector(jihaoa)) {
					return document.querySelector(jihaoa)
				} else {
					return false
				}
			}
		};

		function zddj() {
			zdbt();
			if (vipzdjx == 1 || vipzdjx == 2 || vipjxss == 0) {
				if (vipzdjx == 2 || vipjxss == 0) {
					zddjjk()
				} else if (vipzdjx == 1) {
					$(function() {
						var qjzdjk_counter = 0;
						var qjzdjk_jiankong = setInterval(function() {
							var qjzdjk_btn = $("ul#httpsvipul>li");
							if (qjzdjk_btn) {
								zddjjk();
								clearInterval(qjzdjk_jiankong);
								return false
							}++qjzdjk_counter;
							if (qjzdjk_counter > 50) {
								clearInterval(qjzdjk_jiankong);
								return false
							}
						}, 500)
					})
				}
			}
			return false
		};

		function ggobj(jxbggobj) {
			setTimeout(function() {
				if (document.querySelector(jxbggobj)) {
					try {
						document.querySelector(jxbggobj).remove()
					} catch (e) {}
				} else {}
			}, 234)
		};
		if (obj.match(/^https?:\/\/[^\/]+?\.(?:bilibili|acfun|youku|qq|iqiyi|mgtv|sohu|le|pptv)\./)) {
			if (gbdmobj == 1) {
				if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
					let iqiyidanmu = 'div[class^="iqp-barrage"],div[id^="iqp-barrage"],div[class^="player-mnb-mid"],div[id^="player-mnb-mid"]';
					remove(iqiyidanmu);
					removeall(iqiyidanmu, undefined, false);
				} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
					let sohudanmu = '[class^="x-danmu-panel"],[id^="x-danmu-panel"],div[class^="toolBar"],div[id^="toolBar"]';
					remove(sohudanmu);
					removeall(sohudanmu, undefined, false);
				} else if (obj.match(/^https?:\/\/[^\/]+?\.bilibili\./)) {
					(function() {
						const SELECTOR_NATIVE = {
							on: "input[class='bui-switch-input']:checked[style='pointer-events: initial;']",
							off: "input[class='bui-switch-input']:not(:checked)",
						};
						const SELECTOR_EMBED = {
							on: "div[class~='bilibili-player-video-btn-danmaku'][data-text='打开弹幕']",
							off: "div[class~='bilibili-player-video-btn-danmaku'][data-text='关闭弹幕']",
						};
						const SELECTOR = document.location.hostname === "player.bilibili.com" ? SELECTOR_EMBED : SELECTOR_NATIVE;

						function disableDanmaku() {
							let buttonOn = document.querySelector(SELECTOR.on);
							if (buttonOn !== null) {
								buttonOn.click()
							}
							setTimeout(() => {
								if (document.querySelector(SELECTOR.off) === null) {
									disableDanmaku()
								}
							}, 500)
						}
						function detectPJAX() {
							let prevButtonOn = null;
							setInterval(() => {
								let buttonOn = document.querySelector(SELECTOR.on);
								if (buttonOn !== null && prevButtonOn !== buttonOn) {
									disableDanmaku();
									prevButtonOn = buttonOn
								}
							}, 500)
						}
						detectPJAX();
					})();
				} else {
					(function() {
						"use strict";
						let selector;
						const selectoracfuna = {
							on: "div[data-bind-key='danmaku_enabled'][data-bind-attr='true']",
							off: "div[data-bind-key='danmaku_enabled'][data-bind-attr='false']",
						};
						const selectoryoukua = {
							on: 'div[id="barrage-controller"] [class^="switch-img_"][class*="turn-on_"]',
							off: 'div[id="barrage-controller"] [class^="switch-img_"][class*="turn-off_"]',
						};
						const selectorqqa = {
							on: 'div[class*="barrage_switch"][class*="open"]',
							off: 'div[class*="barrage_switch"]:not([class*="open"])',
						};
						const selectormgtva = {
							on: 'div[class*="danmu-switcher"][class*="on"]',
							off: 'div[class*="danmu-switcher"]:not([class*="on"])',
						};
						const selectorlea = {
							on: 'label[class*="switch-btn"][class*="active"]',
							off: 'label[class*="switch-btn"]:not([class*="active"])',
						};
						const selectorpptva = {
							on: 'div[class*="w-barrage-open"]:not([class*="close"]',
							off: 'div[class*="w-barrage-close"]:not([class*="open"])',
						};
						if (window.location.href.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
							selector = selectoracfuna;
						} else if (window.location.href.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
							selector = selectoryoukua;
						} else if (window.location.href.match(/^https?:\/\/v\.qq\.com\/x\/cover\//)) {
							selector = selectorqqa;
						} else if (window.location.href.match(/^https?:\/\/www\.mgtv\.com\/[bs]\//)) {
							selector = selectormgtva;
						} else if (window.location.href.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
							selector = selectorlea;
						} else if (window.location.href.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
							selector = selectorpptva;
						} else {}
						function disableDanmaku() {
							let buttonOn = document.querySelector(selector.on);
							if (buttonOn !== null) {
								buttonOn.click();
							}
							setTimeout(() => {
								if (document.querySelector(selector.off) === null) {
									disableDanmaku()
								}
							}, 500)
						}
						function detectPJAX() {
							let prevButtonOn;
							setInterval(() => {
								try {
									let buttonOn = document.querySelector(selector.on);
									if (buttonOn !== null && prevButtonOn !== buttonOn) {
										disableDanmaku();
										prevButtonOn = buttonOn
									}
								} catch (e) {
									return false;
								}
							}, 500)
						}
						detectPJAX();
					})();
				}
			} else if (gbdmobj == 0) {}
		} else {} if (mgzdgq == 0 || mgzdgq == 1 || mgzdgq == 2 || vipzdjx == 2) {
			const ZDVIP = MutationObserver || WebKitMutationObserver || MozMutationObserver;
			if (ZDVIP) {
				let observer = new ZDVIP(function(records) {
					records.map(function(record) {
						if (record.addedNodes.length) {
							[].forEach.call(record.addedNodes, function(addedNode) {
								zdvip(addedNode);
							});
						};
					});
				});
				let option = {
					'childList': true,
					'subtree': true
				};
				observer.observe(document, option);
			};
			if (jxbpcobj) {
				function pcyouku() {
					zdztsp();
					autoClickElement("div.control-icon.control-play-icon.control-pause-icon>span.iconfont.icon-pause", undefined, true);
					remove('#toast_text,#vip_limit_content,#vip_limit_content>div.vip_limit_button_box,.vip_player_payment_toast,div.drm-error-layer,div.drm-error-layer div.note_normal_tit,div.preplay-layer>img[src*="/"],div.note_error_item_title');
					zddj();
				};

				function pcqq() {
					zdztsp();
					remove('.mod_vip_popup.wrapper,div[class*="vip"][class*="popup"][style*="fixed"],div[id*="vip"][id*="popup"][id*="fixed"],txpdiv.txp_alert_info txpdiv,div.wrapper.mod_vip_popup div.mod_hd,txpdiv.txp_ad_inner,#_vip_player_sec,txpdiv.txp_video_error,.content h1,txpdiv[data-role*="tips"][data-role*="text"],[data-role*="txp-ui-tips"]');
					zddj();
				};

				function pcmgtv() {
					zdztsp();
					remove('mango-control-wrap-left,mango-control-tip,.m-player-paytips-wrapper,mango-center-state-payment,mango-control-tip,[class*="player-paytips-locale"]');
					zddj();
				};

				function pciqiyi() {
					zdztsp();
					remove('.qy-player-vippay-popup,#flashbox>iqpdiv iqpdiv.iqp-bottom,#flashbox>iqpdiv iqpdiv.iqp-layer,[data-player-hook="error"],iqpspan');
					zddj();
				};

				function pctvsohu() {
					zdztsp();
					remove('#player_vipTips');
					zddj();
				};

				function pcfilmsohu() {
					zdztsp();
					remove('div.x-dash-tip-panel,[class="x-tip-btn x-tip-vip"]');
					zddj();
				};

				function pcle() {
					zdztsp();
					remove('div.playbox_vip_tip_bg.j-vipTip,div.hv_tip1.js-tip');
					zddj();
				};

				function pcpptv() {
					zdztsp();
					remove('.w-tips-content');
					zddj();
				};

				function pcyjlw() {
					zdztsp();
					setTimeout(function() {
						autoClickElement("div.sb-close");
					}, 1500);
					remove('div.sc-content.clearfix,.sc-content,div.pay-mod-notlogin>div.notlogin-login,#pDialog,div.hintInfo.memberTip.show');
					zddj();
				};

				function pcwasu() {
					zdztsp();
					remove('#flashContent ws-tipinfo');
					zddj();
				};

				function pcbilibili() {
					zdztsp();
					remove('#player_mask_module,.bilibili-player-video-toast-item,.mask-body');
					zddj();
				};

				function pctudou() {
					zdztsp();
					remove('div.information-tips,div.vip_info');
					zddj();
				};

				function zdvip(ele) {
					if (!document.querySelector('div#vip_iframe__')) {
						for (i = 0; i < 1; i++) {
							if (i = 1) {
								try {
									if (obj.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
										if ($("#toast_text:contains('看'):contains('会员')")[0]) {
											pcyouku();
											console.log("%c江小白-优酷会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#vip_limit_content:contains('看'):contains('完整')")[0] && $("#vip_limit_content>div.vip_limit_button_box>a:contains('开通')")[0]) {
											pcyouku();
											console.log("%c江小白-优酷会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#toast_text:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c江小白-优酷会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#vip_limit_content:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c江小白-优酷会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".vip_player_payment_toast p:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c江小白-优酷会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("#ykPlayer>div.youku-film-player>video") && !document.querySelector("div.youku-layer-logo") && document.querySelector('div.preplay-layer>img[src*=".ykimg.com/"][style^="display:"][style*="block"]')) {
											if ($("div.drm-error-layer div.note_normal_tit:contains('版权'):contains('加密'):contains('不支持')")[0] && document.querySelector('div.preplay-layer>img[src*="/"]') && $("div.note_error_item_title:contains('换'):contains('浏览器')")[0]) {
												pcyouku();
												console.log("%c江小白-优酷会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else {}
										} else {}
									} else if (obj.match(/^https?:\/\/video\.tudou\.com\/v\//)) {
										if ($("div.information-tips:contains('看'):contains('会员')")[0]) {
											pctudou();
											console.log("%c江小白-土豆会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("div.vip_info:contains('看'):contains('会员')")[0]) {
											pctudou();
											console.log("%c江小白-土豆会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\//)) {
										if ($("txpdiv.txp_alert_info txpdiv:contains('试看')")[0] && $("txpdiv.txp_alert_info txpdiv a:contains('会员')")[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("div.wrapper.mod_vip_popup") && $("div.wrapper.mod_vip_popup div.mod_hd>h1:contains('会员'):contains('看')")[0] && $("div.wrapper.mod_vip_popup div.mod_bd div.mod_pay a:contains('会员')")[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("#video_scroll_wrap div.mod_episode") && $("txpdiv.txp_ad_inner txpdiv.txp_ad_control txpdiv.txp_ad_skip_text:contains('关闭'):contains('广告')")[0] && $("#_vip_player_sec a:contains('会员'):contains('看')")[0]) {
											let qqggbtn = document.querySelector("txpdiv.txp_ad_inner txpdiv.txp_ad_control button");
											if (qqggbtn) {
												qqggbtn.click();
												qqggbtn.remove();
												pcqq();
											} else {}
											console.log("%c江小白-腾讯会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!(document.querySelector("#video_scroll_wrap div.mod_episode") || $("#video_scroll_wrap>div.mod_text_tabs>a.tab_item.current:contains('往期')")[0]) && $("#_vip_player_sec a:contains('会员')")[0] && $("#_vip_player_sec a:contains('购买')")[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("txpdiv.txp_video_error>txpdiv.txp_error_title>span:contains('版权'):contains('加密'):contains('不支持'):contains('播放')")[0] && $("txpdiv.txp_video_error>txpdiv.txp_error_code:contains('错误'):contains('反馈')")[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".content h1:contains('会员'):contains('超前'):contains('点播')")[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('txpdiv[data-role*="tips"][data-role*="text"]:contains("试看"):contains("分钟")')[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-07-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[data-role*="txp-ui-tips"]:contains("版权"):contains("购买")')[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-08-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[data-role^="txp-ui-tips"]:contains("会员"):contains("看")')[0]) {
											pcqq();
											console.log("%c江小白-腾讯会员自动解析-09-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/(?:ww)?w\.mgtv\.com\/[a-z]\//)) {
										if ((mgzdgq == 1 || mgzdgq == 2) && document.querySelector(".m-player-h5-new .u-control-clarity .btn") && document.querySelector(".m-player-h5-new .u-control-clarity .btn").innerText.match(/^\s*?自动\s*?$/)) {
											if (mgzdgq == 1) {
												if (document.querySelector('a[data-name="超清"][data-purview="true"]')) {
													document.querySelector('a[data-name="超清"][data-purview="true"]').click();
													console.log("%c江小白-芒果自动选择超清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
													document.querySelector('a[data-name="高清"][data-purview="true"]').click();
													console.log("%c江小白-芒果自动选择高清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else {
													document.querySelector('a[data-name="标清"][data-purview="true"]').click();
													console.log("%c江小白-芒果自动选择标清清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												}
											} else if (mgzdgq == 2) {
												if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
													document.querySelector('a[data-name="高清"][data-purview="true"]').click();
													console.log("%c江小白-芒果自动选择高清-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else {
													document.querySelector('a[data-name="标清"][data-purview="true"]').click();
													console.log("%c江小白-芒果自动选择标清清-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												}
											}
										} else if (mgzdgq == 0) {}
										if (vipzdjx == 2 && obj.match(/^https?:\/\/(?:ww)?w\.mgtv\.com\/b\//)) {
											if ($("div.control-tips-line>p:contains('费'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state>mango-center-state-error h2:contains('版权'):contains('限制')")[0] && $("mango-center-state>mango-center-state-error p:contains('扫码'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state div.m-player-paytips-title:contains('费'):contains('看')")[0] && $("mango-center-state div.m-player-paytips-buttons.onerow a:contains('费'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-control-tip p:contains('看'):contains('分钟')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($(".m-player-paytips-wrapper div.m-player-paytips-title:contains('会员'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state-payment:contains('购买')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-control-tip:contains('完整')")[0]) {
												pcmgtv();
												console.log("%c江小白-芒果TV会员自动解析-07-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else {}
										} else {}
									} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
										if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i+a")) {
											pciqiyi();
											console.log("%c江小白-爱奇艺会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv>a") && document.querySelector("#rightPlayList>div.side-content>article a")) {
											pciqiyi();
											console.log("%c江小白-爱奇艺会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("div.qy-player-vippay-popup div.popup-main>p") && document.querySelector("div.qy-player-vippay-popup a.vippay-btn")) {
											pciqiyi();
											console.log("%c江小白-爱奇艺会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("iqpspan:contains('试看')")[0] || $("iqpspan:contains('完整')")[0] || $("iqpspan:contains('开通')")[0] || $("iqpspan:contains('购买')")[0]) {
											pciqiyi();
											console.log("%c江小白-爱奇艺会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
										if (!$("#player_vipTips:contains('以上画质')")[0] && $("#player_vipTips p:contains('会员'):contains('看')")[0]) {
											pctvsohu();
											console.log("%c江小白-搜狐电视会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
										if ($("div.x-dash-tip-panel>span:contains('看'):contains('分钟')")[0]) {
											pcfilmsohu();
											console.log("%c江小白-搜狐电影会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[class="x-tip-btn x-tip-vip"]:contains("购买")')[0]) {
											pcfilmsohu();
											console.log("%c江小白-搜狐电影会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
										if ($("div.playbox_vip_tip_bg.j-vipTip:contains('会员'):contains('看')")[0]) {
											pcle();
											console.log("%c江小白-乐视会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("div.hv_tip1.js-tip:contains('看'):contains('会员')")[0]) {
											pcle();
											console.log("%c江小白-乐视会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
										if ($(".w-tips-content span:contains('费'):contains('看')")[0]) {
											pcpptv();
											console.log("%c江小白-PPTV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
										if ($("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("div.pay-mod-notlogin>div.notlogin-login:contains('会员'):contains('看')")[0]) {
											pcyjlw();
											console.log("%c江小白-1905会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("#pDialog") && $("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("#pSidebar>div.sb-content>div.sb-mod-pay p:contains('版权'):contains('二维码'):contains('下载'):contains('看')")[0]) {
											pcyjlw();
											console.log("%c江小白-1905会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("div.sc-content.clearfix.hidden") && $("div.clearfix.rightCon_player>div.style_one.clearfix>p>a:contains('开通'):contains('会员')")[0] && $("div.sc-content.clearfix:contains('看'):contains('会员'):contains('完整')")[0]) {
											pcyjlw();
											console.log("%c江小白-1905会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										}
										if ($("div.hintInfo.memberTip.show:contains('费')")[0] || $("div.hintInfo.memberTip.show:contains('升级')")[0]) {
											pcyjlw();
											console.log("%c江小白-1905会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
										if ($("#flashContent ws-tipinfo :contains('费'):contains('看')")[0]) {
											pcwasu();
											console.log("%c江小白-华数TV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
										if ($("#player_mask_module div.twp-title:contains('会员'):contains('看')")[0] && $("#player_mask_module div.twp-btns:contains('会员')")[0]) {
											pcbilibili();
											console.log("%c江小白-哔哩哔哩会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".bilibili-player-video-toast-item .video-float-hint-text:contains('会员'):contains('看')")[0]) {
											pcbilibili();
											console.log("%c江小白-哔哩哔哩会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else {}
								} catch (e) {}
							}
						}
					} else {}
				}
			} else {
				function zdvip(ele) {
					if (!document.querySelector('div#vip_iframe__')) {
						for (i = 0; i < 1; i++) {
							if (i = 1) {
								try {
									function sjyouku() {
										zdztsp();
										remove('div.x-video-title');
										zddj();
									};

									function sjmgtv() {
										zdztsp();
										remove('div.video-area-bar');
										zddj();
									};

									function sjpptv() {
										zdztsp();
										remove('div.m-top-banner');
										zddj();
									};

									function sjyjlw() {
										zdztsp();
										remove('section.openMembershipBtn,[data-appurlios],.nonVIP.floatMark');
										zddj();
									};

									function sjtvsohu() {
										zdztsp();
										remove('div.app-view-box');
										zddj();
									};

									function sjle() {
										zdztsp();
										remove('section.gamePromotion,div.app-tips');
										zddj();
									};

									function sjiqiyi() {
										zdztsp();
										remove('div.vue-portal-target');
										zddj();
									};

									function sjwasu() {
										zdztsp();
										remove('#pop .vip');
										zddj();
									};

									function sjqq() {
										zdztsp();
										remove('[dt-params*="推荐"][data-modid*="banner"],a[open-app],[class^="txp_overlay_error"],[data-report*="付费面板"]');
										zddj();
									};
									if (obj.match(/^https?:\/\/m\.youku\.com\/.+?\/id_[^==]+?==\.html/)) {
										if (document.querySelector("div.x-video-title")) {
											sjyouku();
										} else {}
									} else if (obj.match(/^https?:\/\/m\.mgtv\.com\/b\//)) {
										if (document.querySelector("div.video-area-bar")) {
											sjmgtv();
										} else {}
									} else if (obj.match(/^https?:\/\/m\.pptv\.com\/show\//)) {
										if (document.querySelector("div.m-top-banner")) {
											sjpptv();
										} else {}
									} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
										if (document.querySelector("section.openMembershipBtn")) {
											sjyjlw();
										} else if (document.querySelector("[data-appurlios]")) {
											sjyjlw();
										} else if (document.querySelector(".nonVIP.floatMark")) {
											sjyjlw();
										} else {}
									}
									if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)/)) {
										if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/v/)) {
											if (document.querySelector("div.app-view-box")) {
												sjtvsohu();
											} else {}
										} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/phone_play_film\?aid=/)) {
											if (document.querySelector("div.app-view-box")) {
												sjtvsohu();
											} else {}
										}
									} else if (obj.match(/^https?:\/\/m\.le\.com\/vplay_/)) {
										if (document.querySelector("section.gamePromotion")) {
											sjle();
										} else if (document.querySelector("div.app-tips")) {
											sjle();
										} else {}
									} else if (obj.match(/^https?:\/\/m\.iqiyi\.com\/v_/)) {
										if (document.querySelector("div.vue-portal-target")) {
											sjiqiyi();
										} else {}
									} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/wap\/.+?\/show\/id\//)) {
										if (document.querySelector("#pop .vip")) {
											sjwasu();
										} else {}
									} else if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.+?(?:cid=|cover\/)/)) {
										if (document.querySelector('[dt-params*="推荐"][data-modid*="banner"]')) {
											sjqq();
										} else if (document.querySelector('a[open-app]')) {
											sjqq();
										} else if (document.querySelector('[class^="txp_overlay_error"]')) {
											sjqq();
										} else if (document.querySelector('[data-report*="付费面板"]')) {
											sjqq();
										} else {}
									} else {}
								} catch (e) {}
							}
						}
					} else {}
				}
			}
		}
		document.onreadystatechange = function() {
			"complete" == document.readyState && setTimeout(function() {
				if (lkzdzt == 1) {
					(function() {
						let titleTime;
						let OriginTitile = document.title;
						document.addEventListener('visibilitychange', function() {
							let videoaobj = document.querySelector("video"), videobobj = document.querySelector('div#vip_iframe__');
							if (document.hidden && videoaobj && !videobobj) {
								videoaobj.pause();
								document.title = '自动暂停';
								clearTimeout(titleTime);
							} else if (videoaobj && !videobobj) {
								videoaobj.play();
								document.title = '恢复播放';
								titleTime = setTimeout(function() {
									document.title = OriginTitile;
								}, 1234);
							} else {}
						});
					})();
				} else if (lkzdzt == 0) {}
				if (pcliwaiobj) {
					(function() {
						let zdjkhttpsjk_counter = 0;
						let zdjkhttpsjk_jiankong = setInterval(function() {
							let zdjkhttpsjk_btn = document.querySelector("ul#httpsvipul>li:last-of-type");
							if (zdjkhttpsjk_btn) {
								try {
									$('ul#httpsvipul>li').click(function() {
										if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
											let pchttpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
											localStorage.setItem("pchttpsjk", pchttpsjksz)
										}
									})
								} catch (e) {
									return false
								}
								clearInterval(zdjkhttpsjk_jiankong);
								return false
							}++zdjkhttpsjk_counter;
							if (zdjkhttpsjk_counter > 20) {
								clearInterval(zdjkhttpsjk_jiankong);
								return false
							}
						}, 500)
					})();
				} else {} if (vipzdjx == 1 && jxbpcobj) {
					if (!document.querySelector('div#vip_iframe__')) {
						if (obj.match(/^https?:\/\/v\.youku\.com\/v_show\/id_/)) {
							zdztsp();
							autoClickElement("div.control-icon.control-play-icon.control-pause-icon>span.iconfont.icon-pause", undefined, true);
							zddj();
							console.log("%c江小白-优酷全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/v\.qq\.com\/x\/cover\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-腾讯全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.mgtv\.com\/b\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-芒果TV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/[av]_/)) {
							zdztsp();
							zddj();
							console.log("%c江小白-爱奇艺全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-搜狐电视全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-搜狐电影全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-乐视全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-PPTV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-1905全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-华数TV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
							zdztsp();
							zddj();
							console.log("%c江小白-哔哩哔哩全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.fun\.tv\/vplay\/g-/)) {
							zdztsp();
							zddj();
							console.log("%c江小白-风行全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.miguvideo\.com\/mgs\/website\/prd\/detail\.html\?cid=/)) {
							zdztsp();
							zddj();
							console.log("%c江小白-咪咕全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else {}
					}
				} else if (vipzdjx == 0) {}
				if (vipjxss == 1 && jxbpcobj && !tcdpaichuobj && !bilibilipcliwaiobj && !youtubespxzobj) {
					(function() {
						let jxbzdwss = document.title.replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1");
						let maomibtn = document.createElement("div");
						maomibtn.innerHTML = '<div class="maomibtn"><ul><li><a class="maomi">弹</a><ul><li id="jxbqyjxli"><hr><a href="https://gitee.com/q2257227289/" target="_blank" style="border-radius:1px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px, rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;text-decoration:none;background-color:#4CAF50;margin-top:1px;">\u53cb\u60c5\u8d5e\u52a9</a></li><br><li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1128059"><img border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAAWCAMAAACynuG2AAACClBMVEWFzvGs4vun4v6s5P4fSV2p4v6Z1vRqvu625/4LMkWc3v6v5P2Y2vqa3fyx5f3I7f+g2vao3fad2PWj4P256P+W1vSS0/Of4P4VPVGv3/ak4f6z5v6p3/gpVGmj2vVGdo2s3vaX2fiV1/au4vuy4PbB6/+T1fWs3/in3vi15fz///+Hw+AgHSe86f+w5Pyc1/Sg3/2i3Piu5f4yX3U8aoFkmrOq4PqU1POm4Pyx4fltwO9bjaak2/XG6vu14fa04/keSF3F7P/C5vh7yPCk3fe85PeSyOOq3faa2fdXi6N3r8mLxuO54veg3fqy5f1il7FpmrKEu9Zgj6Z0xO+BzPGd2vjA5fdyq8am2/b09/mp3PSk3vmj3vud3fv6+vomIipVg5qx5v6Ny+nNKBlto74/RFArKziY0euW1PNPgJlglrB9uNS6dDrp7fGNscVba3o9O0jQfCn8SCjEwLsCAgJ+ssqBoLOS0O01Mz3OjDDyFA6KMyqgGA7qTjmp1euukHT7hwSZKRT7uxRmn7pSYG3O8P9MLSXoOCHiop5vhZi6MiNne4/c5e73MxTBsZvGx8nO1+CwHRPCmm7/3FD5X0PNhEP2qQT/0y7/zRdela+cxdqWelrnyshFT1ji4uOy1ertjX3t8vaJjp2igUy1ijbcmTV2Z1355uazs7bfpUzmrlC5e1D/lwToiAiDw+jaAAADxklEQVQ4y63S6VfaWBjAYZiJTq9aC7VgGIlBoIIBt0kAY1TSahkhRYTqIGjEAuq4L3Xfqna673uns+/7/zjvTQh42q/93ZyTb89533uujtF9uMC6dPPMu13QOn/hfKlmfAqd0zpVqrlPpxu62XzqZHVqV6Hqz3AfFyqDPlL6FFcD1ZaqqKiobQbtTIFZXMp4p75abMLWwEA1VIl7D9MoqK1Nk5Tqitq5+8tTXmhyo4hVn8Q0rQPStDZcbaCiqA1p2uLW5DVmjbnm/e4ttloqS4OVFcJQByA+SpUighyRZB8hy77TSgNDul5Fq1uaWmbW7q4x3szSQGHHysoEgRA1iKUJhBAbrwn5BuGQgg9qkwjBR0gCJbGcqlVrWhPsqM6WmbzaouRwTKCEXj+Bkv4yiljvaGXJUJ4oFZDjlCxEWDY/o2KnW3p1vd1NkOWW9783r18fvzrMbKmUwxFCg3qIJsoGUQhvSdA1Y2MhOjomcVJUlnyxTVmOkTQRA6kKKmo/3Hu6d3j86t/Dvb17PKYcen0C6fV+v38dxTlWuTOBBIwQotHoDBGJxmnkiVFkLJ8XOWxVNRS1n3M7ud2jo6OnuZ3duyqmTxAY84fQOkuDNTrqQ2NxggNNIjgyInuQZ5b2xMSqzdmidqW7KRjcmNrdebj6YnX14e1cZmsDL6j3J5Dfb7Va4yjEse5RSCCilDANDk3JkfAwaGG6Kiw2zFENkN3uwFowGFzyLt/J5fZf/Hjn2wV4wgrmgnsDzEoTbri3vr6+doJubzcYBCJGzg1DoPVTNzgyKc7alfgrWOP5jPf3P27vp8bHmdTCLe+y3uVygTNBJtzuCZQ39lFUpH2aJSWDwTA8zKKZfpwHhcPJJMlyX9tPakGH9/4v46v7DMOMpxa+WZx0qZo1QeL35oa5aHhvXBywzRhLciQ9p2iiJylyWZHOFrXObp7nDw5+fZIax9iD77fTYNlsVqvbaDROU0QEduyqr4+LlGTwsKQY9pz10KQ40z9HJSlEm+wekbxhtzc2Nro6QXM6ef7R9l9PFlKpnx48/m3bBn0OGUdG0iMjAkI0YAbDNIdQLBw5i2vNhmfLy8tN4aTJZApkw1mwAmasXQTMsvL8zctnfz5+9Pfx85UVI1BpgHBdXUCBhVMcqFzJpBaAzGb4zGabqln46/Pz8/9cP4DfystnMJaKdb1rgVb+nhVQqILW3WOxWHiX02Kx2dLpNJZwClavVLBaW0uDQV9CRQgX6AHN0n2x1BeFLmld1urRcmpZitmUnOZOHfPJh4v5HwOrLNQznBGfAAAAAElFTkSuQmCC" style="width:101%;height:100%;"></a></li><li><a href="http://www.zuidazy4.com/index.php?m=vod-search&wd=' + jxbzdwss + '" target="_blank">最大网</a></li><li><a href="http://www.bumimi.top/search/' + jxbzdwss + '" target="_blank">布米米</a></li>' + '<li><a href="https://www.cupfox.com/search?key=' + encodeURIComponent(jxbzdwss) + '" target="_blank">茶杯狐</a></li>' + '<li><a href="https://www.jiaomh.com/search.php?searchword=' + encodeURIComponent(jxbzdwss) + '" target="_blank">麻花影视</a></li>' + '<li><a href="http://www.redbean.top/search?key=' + encodeURIComponent(jxbzdwss) + '" target="_blank">红豆影视</a></li>' + '<li><a href="http://ivi.bupt.edu.cn/" target="_blank" style="background-color:yellow;">电视直播</a></li>' + '<li><a href="http://www.asys.vip/kuaishou/" target="_blank" style="background-color:yellow;">随机小姐姐</a></li>' + '<hr><li id="vipjxtbli" style="display:none;"><a id="vipjxtb" style="color:beige;">显示图标</a></li><li id="mgzdgqli" style="display:none;"><a id="mgzdgq" style="color:beige;">超清画质</a></li><li id="gbdmobjli" style="display:none;"><a id="gbdmobj" style="color:beige;">关闭弹幕</a></li><li id="vipzdjxli" style="display:none;"><a id="vipzdjx" style="color:beige;">解析会员</a></li><li id="vipzdjxhyli" style="display:none;"><a id="vipzdjxhy" style="color:beige;">解析会员</a></li><li id="zdwbffsli" style="display:none;"><a id="zdwbffs" style="color:beige;">直链播放</a></li><li id="zdwbyjkli" style="display:none;"><a id="zdwbyjk" style="color:beige;">默认接口</a></li><li id="lkzdztbyli" style="display:none;"><a id="lkzdztby" style="color:beige;">自动暂停</a></li></ul></li></ul></div>';
						document.body.appendChild(maomibtn);
						let style = document.createElement("style");
						style.type = "text/css";
						style.innerHTML = ".maomibtn{font-family:arial,sans-serif;padding:0;margin:50px;z-index:817;position:absolute;top:35px!important;zoom:0.8!important;right:-45px;font-size:30px}.maomibtn ul{padding:0;margin:0;list-style-type:none}.maomibtn ul li{float:left;position:relative;list-style-type:none}.maomibtn ul li a,.maomibtn ul li a:visited{display:block;text-align:center;text-decoration:none;width:100px;height:30px;color:#000;border:2px solid #4CAF50;background:#c9c9a7;line-height:30px;font-size:20px}.maomibtn ul li ul{display:none}.maomibtn ul li:hover ul{display:block;position:absolute;top:30px;right:0;width:105px}.maomibtn ul li:hover ul li a{display:block;background:#faeec7;color:#000}.maomibtn ul li:hover ul li a:hover{background:#dfc184!important;color:#000!important}a.maomi{width:25px!important;height:auto!important;border-radius:10px}";
						document.querySelector(".maomibtn").appendChild(style);

						function dssxbobj() {
							setTimeout(function() {
								window.location.reload();
							}, 666);
						};
						(function() {
							if (localStorage.getItem("lkzdzt") == '0') {
								document.getElementById('lkzdztby').innerText = '暂停默认';
								document.querySelector("#lkzdztby").style.backgroundColor = '#268dcd';
							} else if (localStorage.getItem("lkzdzt") == '1') {
								document.getElementById('lkzdztby').innerText = '自动暂停';
								document.querySelector("#lkzdztby").style.backgroundColor = '#005200';
							}
							document.getElementById('lkzdztby').onclick = function() {
								if (this.innerHTML == '暂停默认') {
									localStorage.setItem("lkzdzt", "1");
									this.innerText = '自动暂停';
									document.querySelector("#lkzdztby").style.backgroundColor = '#005200';
									dssxbobj();
								} else if (this.innerHTML == '自动暂停') {
									localStorage.setItem("lkzdzt", "0");
									this.innerText = '暂停默认';
									document.querySelector("#lkzdztby").style.backgroundColor = '#268dcd';
									dssxbobj();
								}
							}
						})();
						(function() {
							if (localStorage.getItem("mgzdgq") == '0') {
								document.getElementById('mgzdgq').innerText = '默认画质';
								document.querySelector("#mgzdgq").style.backgroundColor = '#268dcd'
							} else if (localStorage.getItem("mgzdgq") == '1') {
								document.getElementById('mgzdgq').innerText = '强制超清';
								document.querySelector("#mgzdgq").style.backgroundColor = '#005200'
							} else if (localStorage.getItem("mgzdgq") == '2') {
								document.getElementById('mgzdgq').innerText = '强制高清';
								document.querySelector("#mgzdgq").style.backgroundColor = 'brown'
							}
							document.getElementById('mgzdgq').onclick = function() {
								if (this.innerHTML == '默认画质') {
									localStorage.setItem("mgzdgq", "1");
									this.innerText = '强制超清';
									document.querySelector("#mgzdgq").style.backgroundColor = '#005200';
									if (document.querySelector('a[data-name="超清"][data-purview="true"]')) {
										document.querySelector('a[data-name="超清"][data-purview="true"]').click()
									} else if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
										document.querySelector('a[data-name="高清"][data-purview="true"]').click()
									} else {
										document.querySelector('a[data-name="高清"][data-purview="true"]').click()
									}
									dssxbobj()
								} else if (this.innerHTML == '强制超清') {
									localStorage.setItem("mgzdgq", "2");
									this.innerText = '强制高清';
									document.querySelector("#mgzdgq").style.backgroundColor = 'brown';
									if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
										document.querySelector('a[data-name="高清"][data-purview="true"]').click()
									} else {
										document.querySelector('a[data-name="高清"][data-purview="true"]').click()
									}
									dssxbobj()
								} else if (this.innerHTML == '强制高清') {
									localStorage.setItem("mgzdgq", "0");
									this.innerText = '默认画质';
									document.querySelector("#mgzdgq").style.backgroundColor = '#268dcd';
									dssxbobj()
								}
							}
						})();
						(function() {
							if (localStorage.getItem("vipzdjx") == '0') {
								document.getElementById('vipzdjx').innerText = '关闭自动';
								document.querySelector("#vipzdjx").style.backgroundColor = '#268dcd';
							} else if (localStorage.getItem("vipzdjx") == '1') {
								document.getElementById('vipzdjx').innerText = '解析全部';
								document.querySelector("#vipzdjx").style.backgroundColor = '#005200';
							} else if (localStorage.getItem("vipzdjx") == '2') {
								document.getElementById('vipzdjx').innerText = '解析会员';
								document.querySelector("#vipzdjx").style.backgroundColor = 'brown';
							}
							document.getElementById('vipzdjx').onclick = function() {
								if (this.innerHTML == '关闭自动') {
									localStorage.setItem("vipzdjx", "1");
									this.innerText = '解析全部';
									document.querySelector("#vipzdjx").style.backgroundColor = '#005200';
									dssxbobj();
								} else if (this.innerHTML == '解析全部') {
									localStorage.setItem("vipzdjx", "2");
									this.innerText = '解析会员';
									document.querySelector("#vipzdjx").style.backgroundColor = 'brown';
								} else if (this.innerHTML == '解析会员') {
									localStorage.setItem("vipzdjx", "0");
									this.innerText = '关闭自动';
									document.querySelector("#vipzdjx").style.backgroundColor = '#268dcd';
								}
							};
						})();
						(function() {
							if (localStorage.getItem("vipzdjx") == '0') {
								document.getElementById('vipzdjxhy').innerText = '关闭自动';
								document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
							} else if (localStorage.getItem("vipzdjx") == '2') {
								document.getElementById('vipzdjxhy').innerText = '解析会员';
								document.querySelector("#vipzdjxhy").style.backgroundColor = '#005200';
							}
							document.getElementById('vipzdjxhy').onclick = function() {
								if (this.innerHTML == '关闭自动') {
									localStorage.setItem("vipzdjx", "2");
									this.innerText = '解析会员';
									document.querySelector("#vipzdjxhy").style.backgroundColor = '#005200';
									dssxbobj();
								} else if (this.innerHTML == '解析会员') {
									localStorage.setItem("vipzdjx", "0");
									this.innerText = '关闭自动';
									document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
									dssxbobj();
								}
							}
						})();
						(function() {
							if (localStorage.getItem("gbdmobj") == '0') {
								document.getElementById('gbdmobj').innerText = '默认弹幕';
								document.querySelector("#gbdmobj").style.backgroundColor = '#268dcd'
							} else if (localStorage.getItem("gbdmobj") == '1') {
								document.getElementById('gbdmobj').innerText = '关闭弹幕';
								document.querySelector("#gbdmobj").style.backgroundColor = '#005200'
							}
							document.getElementById('gbdmobj').onclick = function() {
								if (this.innerHTML == '关闭弹幕') {
									localStorage.setItem("gbdmobj", "0");
									this.innerText = '默认弹幕';
									document.querySelector("#gbdmobj").style.backgroundColor = '#005200';
									dssxbobj()
								} else if (this.innerHTML == '默认弹幕') {
									localStorage.setItem("gbdmobj", "1");
									this.innerText = '关闭弹幕';
									document.querySelector("#gbdmobj").style.backgroundColor = '#268dcd';
									dssxbobj()
								}
							}
						})();
						(function() {
							if (localStorage.getItem("zdwbffs") == '0') {
								document.getElementById('zdwbffs').innerText = '直链播放';
								document.querySelector("#zdwbffs").style.backgroundColor = '#268dcd'
							} else if (localStorage.getItem("zdwbffs") == '1') {
								document.getElementById('zdwbffs').innerText = '解析播放';
								document.querySelector("#zdwbffs").style.backgroundColor = '#005200'
							}
							document.getElementById('zdwbffs').onclick = function() {
								if (this.innerHTML == '直链播放') {
									localStorage.setItem("zdwbffs", "1");
									this.innerText = '解析播放';
									document.querySelector("#zdwbffs").style.backgroundColor = '#005200';
									setTimeout(function() {
										window.location.reload();
									}, 666)
								} else if (this.innerHTML == '解析播放') {
									localStorage.setItem("zdwbffs", "0");
									this.innerText = '直链播放';
									document.querySelector("#zdwbffs").style.backgroundColor = '#268dcd';
									setTimeout(function() {
										window.location.reload();
									}, 666)
								}
							}
						})();
						(function() {
							if (localStorage.getItem("zdwbyjk") == '0') {
								document.getElementById('zdwbyjk').innerText = '默认接口';
								document.querySelector("#zdwbyjk").style.backgroundColor = '#268dcd'
							} else if (localStorage.getItem("zdwbyjk") == '1') {
								document.getElementById('zdwbyjk').innerText = '备用接口';
								document.querySelector("#zdwbyjk").style.backgroundColor = '#005200'
							}
							document.getElementById('zdwbyjk').onclick = function() {
								if (this.innerHTML == '默认接口') {
									localStorage.setItem("zdwbyjk", "1");
									this.innerText = '备用接口';
									document.querySelector("#zdwbyjk").style.backgroundColor = '#005200';
									setTimeout(function() {
										window.location.reload();
									}, 666)
								} else if (this.innerHTML == '备用接口') {
									localStorage.setItem("zdwbyjk", "0");
									this.innerText = '默认接口';
									document.querySelector("#zdwbyjk").style.backgroundColor = '#268dcd';
									setTimeout(function() {
										window.location.reload();
									}, 666)
								}
							}
						})();
						(function() {
							function vipjxtbxs() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps,div.maomibtn{opacity:1}</style>');
							};

							function vipjxtbgb() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>');
							};

							function vipjxtbzs() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps{opacity:1}div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
							};
							if (localStorage.getItem("vipjxtb") == '0') {
								document.getElementById('vipjxtb').innerText = '关闭图标';
								document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd'
							} else if (localStorage.getItem("vipjxtb") == '1') {
								document.getElementById('vipjxtb').innerText = '显示图标';
								document.querySelector("#vipjxtb").style.backgroundColor = '#005200'
							} else if (localStorage.getItem("vipjxtb") == '2' && (pcliwaiobj)) {
								document.getElementById('vipjxtb').innerText = '只显钻石';
								document.querySelector("#vipjxtb").style.backgroundColor = '#0087ff'
							} else if (localStorage.getItem("vipjxtb") == '2' && ttblwobj) {
								document.getElementById('vipjxtb').innerText = '显示图标';
								document.querySelector("#vipjxtb").style.backgroundColor = '#005200'
							}
							document.getElementById('vipjxtb').onclick = function() {
								if (pcliwaiobj || ttblwobj) {
									if (this.innerHTML == '关闭图标') {
										if (pcliwaiobj) {
											localStorage.setItem("vipjxtb", "2");
											this.innerText = '只显钻石';
											document.querySelector("#vipjxtb").style.backgroundColor = '#0087ff';
											vipjxtbzs()
										} else if (ttblwobj) {
											localStorage.setItem("vipjxtb", "1");
											this.innerText = '显示图标';
											document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
											vipjxtbxs()
										}
									} else if (this.innerHTML == '只显钻石') {
										localStorage.setItem("vipjxtb", "1");
										this.innerText = '显示图标';
										document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
										vipjxtbxs()
									} else if (this.innerHTML == '显示图标') {
										localStorage.setItem("vipjxtb", "0");
										this.innerText = '关闭图标';
										document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd';
										vipjxtbgb()
									}
								} else {
									if (this.innerHTML == '关闭图标') {
										localStorage.setItem("vipjxtb", "1");
										this.innerText = '显示图标';
										document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
										vipjxtbxs()
									} else if (this.innerHTML == '显示图标') {
										localStorage.setItem("vipjxtb", "0");
										this.innerText = '关闭图标';
										document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd';
										vipjxtbgb()
									}
								}
							}
						})()
					})();
				} else if (vipjxss == 0) {}
			}, 666);
		};
		if (vipjxtb == 0) {
			try {
				function viptbjiangxiaobaia() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaia" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbjiangxiaobaia()
				} catch (err) {
					viptbjiangxiaobaia()
				};

				function viptbjiangxiaobaiadsq() {
					if (!document.querySelector("head>style.viptb-jiangxiaobaia")) {
						viptbjiangxiaobaia()
					} else {}
				};
				setTimeout(viptbjiangxiaobaiadsq, 3333)
			} catch (e) {
				function viptbjiangxiaobaia() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaia" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbjiangxiaobaia()
				} catch (err) {
					viptbjiangxiaobaia()
				};

				function viptbjiangxiaobaiadsq() {
					if (!document.querySelector("head>style.viptb-jiangxiaobaia")) {
						viptbjiangxiaobaia()
					} else {}
				};
				setTimeout(viptbjiangxiaobaiadsq, 3333)
			}
		} else if (vipjxtb == 2) {
			try {
				function viptbjiangxiaobaib() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaib" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbjiangxiaobaib()
				} catch (err) {
					viptbjiangxiaobaib()
				};

				function viptbjiangxiaobaibdsq() {
					if (!document.querySelector("head>style.viptb-jiangxiaobaib")) {
						viptbjiangxiaobaib()
					} else {}
				};
				setTimeout(viptbjiangxiaobaibdsq, 3333)
			} catch (e) {
				function viptbjiangxiaobaib() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaib" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbjiangxiaobaib()
				} catch (err) {
					viptbjiangxiaobaib()
				};

				function viptbjiangxiaobaibdsq() {
					if (!document.querySelector("head>style.viptb-jiangxiaobaib")) {
						viptbjiangxiaobaib()
					} else {}
				};
				setTimeout(viptbjiangxiaobaibdsq, 3333)
			}
		} else if (vipjxtb == 1) {}
		if (pcliwaiobj || youtubespxzobj) {
			function detectIsInputing() {
				const activeElement = document.activeElement;
				return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement
			}
			document.addEventListener('keypress', async(event) => {
				const isInputing = detectIsInputing();
				if (isInputing) {
					return
				}
				switch (event.key) {
				case 'y':
					return ytbspxz();
					break;
				case ',':
					return zdbmm();
					break;
				case '.':
					return zdzdw();
					break;
				case '/':
					return sddj();
					break;
				case ';':
					return ywyjklb();
					break;
				case '\'':
					return pyspqp();
					break;
				case '\\':
					return ptsphzh();
					break;
				case '-':
					return sjsyjkjxa();
					break;
				case '=':
					return sjsyjkjxb();
					break;
				default:
					break;
				}

				function ytbspxz() {
					if (youtubespxzobj) {
						if (document.querySelector("#upnext") && document.querySelector("#autoplay")) {
							(function() {
								try {
									if (document.getElementsByTagName("video")[0]) {
										var v_player = document.getElementsByTagName("video");
										for (var i = 0, length = v_player.length; i < length; i++) {
											v_player[i].pause()
										}
									} else if (document.querySelectorAll("embed,video,object,iframe[frameborder]")[0]) {
										var v_player = document.querySelectorAll("embed,video,object,iframe[frameborder]");
										for (var i = 0, length = v_player.length; i < length; i++) {
											v_player[i].parentNode.removeChild(v_player[i])
										}
									};
									window.open("https://blueconvert.com/?id=" + window.location.href.replace(/^.+?\/watch\?v=(.+)$/, "$1"), "_bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
								} catch (e) {
									return false;
								}
							})();
						} else {}
					} else {}
				};

				function zdbmm() {
					if (!youtubespxzobj) {
						(function() {
							try {
								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]').href, "_blank");
								window.close();
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function zdzdw() {
					if (!youtubespxzobj) {
						(function() {
							try {
								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.zuidazy"]').href, "_blank");
								window.close();
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function sddj() {
					if (!youtubespxzobj && pcliwaiobj) {
						(function() {
							try {
								$(function() {
									var qjsdjk_counter = 0;
									var qjsdjk_jiankong = setInterval(function() {
										var qjsdjk_btn = $("ul#httpsvipul>li");
										if (qjsdjk_btn) {
											zddjjk();
											clearInterval(qjsdjk_jiankong);
											return false
										}++qjsdjk_counter;
										if (qjsdjk_counter > 50) {
											clearInterval(qjsdjk_jiankong);
											return false
										}
									}, 500)
								})
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function ywyjklb() {
					if (!youtubespxzobj) {
						(function() {
							try {
								document.querySelector("div#jxbhttps").click();
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function pyspqp() {
					if (!youtubespxzobj) {
						(function() {
							try {
								let element = document.querySelector("video");
								if (element.requestFullScreen) {
									element.requestFullScreen()
								} else if (element.mozRequestFullScreen) {
									element.mozRequestFullScreen()
								} else if (element.webkitRequestFullScreen) {
									element.webkitRequestFullScreen()
								}
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function ptsphzh() {
					(function() {
						try {
							(async() => {
								const videos = Array.from(!document.querySelector("#vip_iframe__") && document.querySelectorAll('video')).filter(video => video.readyState != 0).filter(video => video.disablePictureInPicture == false).sort((v1, v2) => {
									const v1Rect = v1.getClientRects()[0];
									const v2Rect = v2.getClientRects()[0];
									return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height))
								});
								if (videos.length === 0) return;
								const video = videos[0];
								if (video.hasAttribute('__pip__')) {
									await document.exitPictureInPicture()
								} else {
									await video.requestPictureInPicture();
									video.setAttribute('__pip__', true);
									video.addEventListener('leavepictureinpicture', event => {
										video.removeAttribute('__pip__')
									}, {
										once: true
									})
								}
							})();
						} catch (e) {
							return false;
						}
					})();
				};

				function sjsyjkjxa() {
					if (!youtubespxzobj) {
						(function() {
							try {
								function createRandom(num, from, to) {
									let arr = [];
									for (let i = from; i <= to; i++) arr.push(i);
									arr.sort(function() {
										return 0.5 - Math.random()
									});
									arr.length = num;
									return arr
								}
								function createRandom2(num, from, to) {
									let arr = [];
									let json = {};
									while (arr.length < num) {
										let ranNum = Math.ceil(Math.random() * (to - from)) + from;
										if (!json[ranNum]) {
											json[ranNum] = 1;
											arr.push(ranNum)
										}
									}
									return arr
								}
								localStorage.setItem("pchttpsjk", createRandom2(1, document.querySelectorAll("ul#httpsvipul>li").length - 3, document.querySelectorAll("ul#httpsvipul>li").length));
								setTimeout(function() {
									try {
										$("ul#httpsvipul>li>span").css("backgroundImage", "");
										document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("pchttpsjk") + ")>span").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAMAAACHgmeRAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURX//AIH8BobyGoT/CZP/J4nxIIL5C5T8LJj0PW2hJpgAAAAeSURBVAjXY2BlY4QABiZGBiigNouVGQoYONhZIAAAEpYAdsB2b4AAAAAASUVORK5CYII=)";
									} catch (e) {}
									document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("pchttpsjk") + ")").click()
								}, 567)
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};

				function sjsyjkjxb() {
					if (!youtubespxzobj) {
						(function() {
							try {
								function createRandom(num, from, to) {
									let arr = [];
									for (let i = from; i <= to; i++) arr.push(i);
									arr.sort(function() {
										return 0.5 - Math.random()
									});
									arr.length = num;
									return arr
								}
								function createRandom2(num, from, to) {
									let arr = [];
									let json = {};
									while (arr.length < num) {
										let ranNum = Math.ceil(Math.random() * (to - from)) + from;
										if (!json[ranNum]) {
											json[ranNum] = 1;
											arr.push(ranNum)
										}
									}
									return arr
								}
								localStorage.setItem("pchttpsjk", createRandom2(1, 3, document.querySelectorAll("ul#httpsvipul>li").length - 3));
								setTimeout(function() {
									try {
										$("ul#httpsvipul>li>span").css("backgroundImage", "");
										document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("pchttpsjk") + ")>span").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAMAAACHgmeRAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURX//AIH8BobyGoT/CZP/J4nxIIL5C5T8LJj0PW2hJpgAAAAeSURBVAjXY2BlY4QABiZGBiigNouVGQoYONhZIAAAEpYAdsB2b4AAAAAASUVORK5CYII=)";
									} catch (e) {}
									document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("pchttpsjk") + ")").click()
								}, 567)
							} catch (e) {
								return false;
							}
						})();
					} else {}
				};
			});
		} else {} if (obj.match(/^https?:\/\/www\.zuidazy\d\.com\/index\.php/)) {
			setTimeout(function() {
				document.head.insertAdjacentHTML('beforeend', '<style>[id*="copy"],li[class^="xing_top_"]:not([class*="center"]),[class^="search-inner"]+[class*="right"],[class*="foot"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar{width:0px!important;height:0px!important}.search{margin-left:200px}</style>');
				if ($("div.xing_vb>ul>li>span>a").length == 1) {
					window.location.href = document.querySelector("div.xing_vb>ul>li>span>a:first-child").href
				} else {}
			}, 500);
		} else if (obj.match(/^https?:\/\/www\.zuidazy\d\.com\/\?m=vod-detail-id-/)) {
			(function() {
				if (self != top) {} else {
					function dssxcobj() {
						setTimeout(function() {
							window.location.reload();
						}, 666);
					};
					if (localStorage.getItem("zdwbffs") != null) {
						zdwbffs = localStorage.getItem("zdwbffs")
					} else {
						localStorage.setItem("zdwbffs", "0");
						localStorage.setItem("zdwbyjk", "0");
						dssxcobj();
					}
					if (localStorage.getItem("zdwbyjk") != null) {
						zdwbyjk = localStorage.getItem("zdwbyjk")
					} else {
						localStorage.setItem("zdwbyjk", "0");
						localStorage.setItem("zdwbyjk", "0");
						dssxcobj();
					}
					if (zdwbyjk == 0) {
						m3u8 = "https://liuliuyy.com/player/play.html?url=";
					} else if (zdwbyjk == 1) {
						m3u8 = "https://www.mhbofang.com/?url=";
					}
					document.head.insertAdjacentHTML('beforeend', '<style>li#vipjxtbli{display:block!important;}li#jxbqyjxli{display:none!important;}</style>');
					let img = document.querySelector("div.vodImg>img").src;
					let title = document.title.replace(/^(.+)剧情介绍.*$/, "$1");
					document.querySelector("body>div.xing_top").remove();
					document.querySelector("body>div.sddm").remove();
					document.querySelector("body>div.container").remove();
					document.querySelector("body>div.foot").remove();
					$("body>div.warp>div>div.playBar.liketitle").remove();
					document.head.insertAdjacentHTML('beforeend', '<style>div.maomibtn{position:fixed!important;}li#zdwbffsli{display:block!important;}div.maomibtn ul li a[target="_blank"],#play_1>ul>li>input{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar{width:0px!important;height:0px!important}.ibox{border:none!important;margin-bottom:0!important;background-color:transparent!important}</style>');

					function zuidall() {
						if (document.querySelector("#play_2>ul>li:first-child").innerText.match(/\.m3u8$/i)) {
							document.head.insertAdjacentHTML('beforeend', '<style>li#zdwbyjkli{display:block!important;}</style>')
						} else {}
						document.querySelector('body>div.warp>div[class="ibox"]:first-child').remove();
						document.querySelector("#play_1").remove();
						$("#play_2>h3").remove();
						$("#play_2 input").remove();
						document.onclick = function(e) {
							if (!document.querySelector("#play_2>ul>li:first-child").innerText.match(/\.m3u8$/i)) {
								const linka = /^([^$]+?)\$\s*?(https?:\/\/[^\/]+?\/share\/\w+)$/i;
								if (!e.target.innerHTML.match(/<jiangxiaobai /) && !e.target.innerHTML.match(/<iframe /) && e.target.innerText.match(linka) && e.path.length > 4) {
									if ($("#jiangxiaobai")) {
										$("#jiangxiaobai").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linka, '<jiangxiaobai id="jiangxiaobai" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#jiangxiaobai\')){$(\'#jiangxiaobai\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></jiangxiaobai>');
									window.scrollTo(0, document.querySelector("#jiangxiaobai").offsetTop);
									return false
								}
							} else {
								const linkb = /^([^$]+?)\$\s*?(https?:\/\/.+?\.m3u8)$/i;
								if (!e.target.innerHTML.match(/<jiangxiaobai /) && !e.target.innerHTML.match(/<iframe/) && e.target.innerText.match(linkb) && e.path.length > 4) {
									if ($("#jiangxiaobai")) {
										$("#jiangxiaobai").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linkb, '<jiangxiaobai id="jiangxiaobai" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#jiangxiaobai\')){$(\'#jiangxiaobai\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="' + m3u8 + '$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></jiangxiaobai>');
									window.scrollTo(0, document.querySelector("#jiangxiaobai").offsetTop);
									return false
								}
							}
						};
						setTimeout(function() {
							window.scrollTo(0, document.body.scrollHeight);
							document.head.insertAdjacentHTML('beforeend', '<style>body{background-color:#585858}#down_1{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar{width:0px!important;height:0px!important}.ibox{border:none!important;margin-bottom:0!important;background-color:transparent!important}div#play_2 li{color:#fff;font-weight:700;font-size:16px;text-decoration:none}div#play_2 li:hover{color:chartreuse}div#play_2{text-align:center}body>div.warp>div.ibox.playBox:nth-child(1)>div.vodplayinfo{text-align:center;font-size:16px;border:4px darkred;text-decoration:none;border-style:dashed;margin-top:20px;background-color:wheat!important;color:black!important}body>div.warp>div.ibox.playBox:nth-child(1)>div.vodplayinfo *{color:steelblue!important;background:#27282F!important;background-color:#27282F!important}</style>');
							if ($("div#play_2 ul li").length == 1) {
								document.querySelector("div#play_2 ul li:first-child").click()
							} else {}
						}, 500)
					};

					function zuidam3u8() {
						if (document.querySelector("#play_1>ul>li:first-child").innerText.match(/\.m3u8$/i)) {
							document.head.insertAdjacentHTML('beforeend', '<style>li#zdwbyjkli{display:block!important;}</style>')
						} else {}
						document.querySelector("body>div.warp>div:nth-child(4)>div").remove();
						$("#play_1>h3").remove();
						$("#play_1 input").remove();
						document.onclick = function(e) {
							if (!document.querySelector("#play_1>ul>li:first-child").innerText.match(/\.m3u8$/i)) {
								const linka = /^([^$]+?)\$\s*?(https?:\/\/[^\/]+?\/share\/\w+)$/i;
								if (!e.target.innerHTML.match(/<jiangxiaobai /) && !e.target.innerHTML.match(/<iframe /) && e.target.innerText.match(linka) && e.path.length > 4) {
									if ($("#jiangxiaobai")) {
										$("#jiangxiaobai").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linka, '<jiangxiaobai id="jiangxiaobai" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#jiangxiaobai\')){$(\'#jiangxiaobai\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></jiangxiaobai>');
									window.scrollTo(0, document.querySelector("#jiangxiaobai").offsetTop);
									return false
								}
							} else {
								const linkb = /^([^$]+?)\$\s*?(https?:\/\/.+?\.m3u8)$/i;
								if (!e.target.innerHTML.match(/<jiangxiaobai /) && !e.target.innerHTML.match(/<iframe/) && e.target.innerText.match(linkb) && e.path.length > 4) {
									if ($("#jiangxiaobai")) {
										$("#jiangxiaobai").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linkb, '<jiangxiaobai id="jiangxiaobai" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#jiangxiaobai\')){$(\'#jiangxiaobai\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="' + m3u8 + '$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></jiangxiaobai>');
									window.scrollTo(0, document.querySelector("#jiangxiaobai").offsetTop);
									return false
								}
							}
						};
						setTimeout(function() {
							window.scrollTo(0, document.body.scrollHeight);
							document.head.insertAdjacentHTML('beforeend', '<style>body{background-color:#585858}#play_2,div#play_1>h3,#down_1,div.ibox:nth-of-type(1),div.playBox.ibox:nth-of-type(4){display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar{width:0px!important;height:0px!important}.ibox{border:none!important;margin-bottom:0!important;background-color:transparent!important}div#play_1 li{color:#fff;font-weight:700;font-size:16px;text-decoration:none}div#play_1 li:hover{color:chartreuse}div#play_1{text-align:center}body>div.warp>div.ibox.playBox:nth-child(2)>div.vodplayinfo{text-align:center;font-weight:bold;font-size:16px;border:4px outset buttonface;color:steelblue;text-decoration:none;border-style:dotted;border-radius:20%;margin-top:20px}body>div.warp>div.ibox.playBox:nth-child(2)>div.vodplayinfo *{color:steelblue!important;background:#27282F!important;background-color:#27282F!important}</style>');
							if ($("div#play_1 ul li").length == 1) {
								document.querySelector("div#play_1 ul li:first-child").click()
							} else {}
						}, 500)
					};
					if (zdwbffs == 0) {
						if ($("span:contains('zuidall')")[0]) {
							zuidall()
						} else {
							zuidam3u8()
						}
					} else if (zdwbffs == 1) {
						if ($("span:contains('zuidam3u8')")[0]) {
							zuidam3u8()
						} else {
							zuidall()
						}
					}
				}
			})();
		} else if (obj.match(/^https?:\/\/www\.cupfox\.com\/search/)) {
			document.head.insertAdjacentHTML('beforeend', '<style>@media screen and (min-width:1200px){img,div.search-other-names,div[class^="jsx-"][class*=" bottom"],img[class*="logo"],div[class*=" search-box jsx-"]+[class*=" navs"],div[class*="main"]+div[class*="sidebar"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}div[class^="jsx-"][class*=" search-box jsx-"]{text-align:center;margin-left:calc(23.5%)}ul[class^="jsx-"][class*=" search-result-list"]{text-align:center;margin-left:calc(75%)}}</style>');
		} else {}
	}
	return false;
})();


}


}
})();