// ==UserScript==
// @name wd
// @version 2.5
// @namespace https://greasyfork.org/users/694396
// @description wd（库）
// @match *://v.youku.com/v_show/id_*
// @match *://video.tudou.com/v/*
// @match *://v.qq.com/x/cover/*
// @match *://v.qq.com/variety/p/topic/*
// @match *://w.mgtv.com/b/*
// @match *://www.mgtv.com/b/*
// @match *://tw.iqiyi.com/v_*
// @match *://www.iqiyi.com/v_*
// @match *://www.iqiyi.com/a_*
// @match *://tv.sohu.com/v/*
// @match *://film.sohu.com/album/*
// @match *://www.le.com/ptv/vplay/*
// @match *://v.pptv.com/show/*
// @match *://vip.1905.com/play/*
// @match *://www.wasu.cn/Play/show/id/*
// @match *://www.miguvideo.com/mgs/website/prd/detail.html?cid=*
// @match *://www.fun.tv/vplay/g-*
// @match *://player.bilibili.com/*
// @match *://www.bilibili.com/bangumi/play/*
// @match *://www.bilibili.com/blackboard/*
// @match *://www.bilibili.com/*video/*
// @match *://www.zuidazy4.com/index.php*
// @match *://www.zuidazy4.com/?m=vod-detail-id-*
// @match *://movie.douban.com/subject/*
// @match *://www.acfun.cn/*/ac*
// @match *://www.cupfox.com/search*
// @match *://www.bumimi.top/search/*
// @match *://www.zhenbuka.com/vodsearch/*
// @match *://www.duboku.co/vodsearch/*
// @match *://*/htm_data/*.html
// @match *://m.youku.com/*/id_*
// @match *://m.mgtv.com/b/*
// @match *://m.pptv.com/show/*
// @match *://m.tv.sohu.com/v*
// @match *://m.tv.sohu.com/phone_play_film*
// @match *://m.le.com/vplay_*
// @match *://m.iqiyi.com/v_*
// @match *://www.wasu.cn/wap/*/show/id/*
// @match *://m.v.qq.com/*
// @match *://3g.v.qq.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/415076/wd.user.js
// @updateURL https://update.greasyfork.org/scripts/415076/wd.meta.js
// ==/UserScript==

(function() {
	if (self != top) {} else {
		var pchttpsjk, vipzdjx, vipjxtb, vipjxss, vipjxkjj, gbdmobj, jstgggobj, pdssgjcobj, mgzdgq, lkzdzt;
		var obj = window.location.href;
		var tcdpaichuobj = obj.match(/^https?:\/\/(?:[^\/]+?\.cupfox\.|www\.zuidazy\d\.com(?!\/\?m=vod-detail-id-)|.+?\/htm_data\/)/);
		var ttblwobj = obj.match(/^https?:\/\/(?:w(?:ww)?\.mgtv\.com\/(?!b)[a-z]\/|(?:player|live)\.bilibili\.com|www\.bilibili\.com\/(?:cheese\/play|.*?video|blackboard)\/)/);
		var pcliwaiobj = obj.match(/^https?:\/\/(?:v\.youku\.com\/v_show\/id_|video\.tudou\.com\/v\/|v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\/|w(?:ww)?\.mgtv\.com\/b\/|www\.iqiyi\.com\/[av]_|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|v\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.wasu\.cn\/Play\/show\/id\/|www\.bilibili\.com\/bangumi\/play\/|www\.fun\.tv\/vplay\/g-|www\.miguvideo\.com\/mgs\/website\/prd\/detail\.html\?cid=)/);
		var sjliwaiobj = obj.match(/^https?:\/\/(?:m\.youku\.com\/.+?\/id_|m\.mgtv\.com\/b\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|m\.le\.com\/vplay_|m\.iqiyi\.com\/v_|www\.wasu\.cn\/wap\/.+?\/show\/id\/|(?:3g|m)\.v\.qq\.com\/(?:(?:.+?\/)?cover\/\w+?\/(?:(?![^\/]+?[\?&][cv]id=)\w+?\.htm|\w+?\.html\?vid=\w+$)|.+?[\?&](?:cid=[^\/]+?&vid=|cid=\w+?$)))/);
		var bilibilipcliwaiobj = obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//) && document.title.indexOf("（僅限台灣地區）") > 0;
		var iqiyiapcliwaiobj = obj.match(/^https?:\/\/www\.iqiyi\.com\/a_/) && document.getElementsByTagName('video')[0] == null;
		var cssremoveobj = iqiyiapcliwaiobj;
		var vipzdjxwzobj = (pcliwaiobj && !bilibilipcliwaiobj && !iqiyiapcliwaiobj) || sjliwaiobj;
		var wdpcobj = !/(?:phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(window.navigator.userAgent);
		(function() {
			let sobj = document.createElement('script');
			sobj.type = 'text/javascript';
			sobj.id = 'wudan-sobj';
			document.head.appendChild(sobj);
		})();

		function jqjs() {
			(function() {
				if (document.getElementById('wudanjqjs')) {
					return
				}
				if (typeof jQuery == 'undefined') {
					let s = document.createElement('script');
					s.type = 'text/javascript';
					s.src = 'https://cdn.jsdelivr.net/npm/jquery@3.0.0/dist/jquery.min.js';
					s.id = 'wudanjqjs';
					s.onload = s.onreadystatechange = function() {
						if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
							this.onload = this.onreadystatechange = null
						}
					};
					document.head.appendChild(s)
				} else {}
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
			document.head.insertAdjacentHTML("beforeend", '<style class="cssobj-wudan" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
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

		function bdzdwdyobj() {
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
				if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
					pchttpsjk = '6'
				} else {
					pchttpsjk = '9'
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

		function wdzdjxobj() {
			bdzdjxobj();
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxli{display:block!important}170403');
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
			cssobj('div.maomibtn li#gbdmobjli{display:block!important}170403');
			if (localStorage.getItem("gbdmobj") != null) {
				gbdmobj = localStorage.getItem("gbdmobj");
			} else {
				localStorage.setItem("gbdmobj", "1");
				dssxaobj();
			}
		};

		function wdzdjxhyobj() {
			bdvipzdjxobj();
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxhyli{display:block!important}170403');
		};

		function jxqtwzobj() {
			zdjyobj();
			cssobj('div.maomibtn li#vipjxtbli{display:block!important}170403');
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

		function wdvolumeobj() {
			(function() {
				let videovolumea_counter = 0;
				let videovolumea_jiankong = setInterval(function() {
					try {
						if (document.getElementsByTagName('video')[0].volume == 0) {
							document.getElementsByTagName('video')[0].volume = 1;
							console.log("%c柠檬汁凝-设置视频音量-01--100%", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
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
							console.log("%c柠檬汁凝-设置视频音量-02--100%", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
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
								console.log("%c柠檬汁凝-设置视频音量-03--100%", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
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
			cssobj('div.maomibtn li#lkzdztbyli{display:block!important}170403');
		};
		if (cssremoveobj) {} else {
			cssobj('[class^="bd_ad"],[id^="bd_ad"],[class*=" area ad"],[id*=" area ad"],[class*="ad"][class*="banner"],[id*="ad"][id*="banner"],[class^="ad_inner"],[id^="ad_inner"],[class^="slide-gg"],[id^="slide-gg"],[class^="side_gg"],[id^="side_gg"],[class^="slide_ad"],[id^="slide_ad"],[class^="side_ad"],[id^="side_ad"],[class^="mod_ad"],[id^="mod_ad"],[class^="ad-client"],[id^="ad-client"],[class*="play-tips-ad"],[id*="play-tips-ad"],[class^="ad-slider"],[class^="ad-festival"],[id^="ad-slider"],[id^="ad-festival"],[class^="ad-"][class*="fixed"],[id^="ad-"][id*="fixed"],[class*="modAdv"],[id*="modAdv"],[class*="boxAdv"],[id*="boxAdv"],[class*="-ad-bottom"],[id*="-ad-bottom"]');
			cssobj('ad,ads,foot,footer,[class*="header"][class*="ownload"],[id*="header"][id*="ownload"],[class*="app"][class*="ownload"],[id*="app"][id*="ownload"],[class$="-fullscreen-tip"],[_stat*="浮层"],div[class*="foot"],div[id*="foot"],div[class*="bottom"][class*="recommend"],div[id*="bottom"][id*="recommend"],div[class^="right-activity"],div[id^="right-activity"],[data-adpid-checked],[data-ad-client],[data-adext],[ad-status],div[class*="pause"]:not([aria-label]):not([class*="bilibili"]):not([class*="hide"]):not([class*="shadow"]):not([class*="icon"]):not([class*="btn"]):not([class*="svg"]):not([class*="definition"]),div[id*="pause"]:not([aria-label]):not([id*="bilibili"]):not([id*="hide"]):not([id*="shadow"]):not([id*="icon"]):not([id*="btn"]):not([id*="svg"]):not([id*="definition"]),[data-role*="pause"]');
			remove('[style*=" repeat scroll 0 0 "]');
			remove('[class$="-ie-tips"],[id$="-ie-tips"]');
			remove('[class*="localstoreSWF"],[id*="localstoreSWF"]');
			remove('iframe[src*="/game/"],iframe[width="1"][height="1"]');
			remove('[class*="-ad-"][id*="banner"],[id*="-ad-"][id*="banner"]');
			removeall('[class*="miaozhenad"],[id*="miaozhenad"]', undefined, false);
			removeall('[class*="google"],[id*="google"],[name*="google"]', undefined, false);
			removeall('img[style^="display:"][style*="!important"][hidden]', undefined, false);
			removeall('iframe[style^="display:"][style*="none"][style*="!important"]', undefined, false);
			removeall('[style*="width:0px"][style*="overflow:hidden"],[style*="width: 0px"][style*="overflow: hidden"]', undefined, false);
			removeall('[style*="width:1px"][style*="overflow:hidden"],[style*="width: 1px"][style*="overflow: hidden"]', undefined, false);
			removeall('[style^="position:"][style*="top:-"][style*="left:-"],[style^="position:"][style*="top: -"][style*="left: -"]', undefined, false);
			removeall('div[style^="position:absolute"][style*="height:1px"],div[style^="position: absolute;"][style*="height: 1px;"]', undefined, false);
			removeall('[style*="top:0"][style*="width:0"][style*="height:0"],[style*="top: 0"][style*="width: 0"][style*="height: 0"]', undefined, false);
			removeall('div[style^="position:fixed"][style*="top:0"][style*="hidden"],div[style^="position: fixed"][style*="top: 0"][style*="hidden"]', undefined, false);
			removeall('iframe[style*="width:0"][style*="height:0"][style*="display:none"],iframe[style*="width: 0"][style*="height: 0"][style*="display: none"]', undefined, false);
			removeall('[style*="fixed"][style*="top:0"][style*="left:0"][style*="bottom:0"][style*="right:0"][style*="background"],[style*="fixed"][style*="top: 0"][style*="left: 0"][style*="bottom: 0"][style*="right: 0"][style*="background"]', undefined, false);
		}
		if (wdpcobj) {
			if (obj.match(/^https?:\/\/v\.youku\.com\/v_show\/id_/)) {
				wdzdjxhyobj();
				zdgbdmobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('.control-icon.control-phonewatch,.control-scroll-info.active,div[class^="u-app_"],div[class^="u-vip_"],.h5-ext-layer iframe,.h5-ext-layer iframe+div[style*="margin-left:"],.h5-ext-layer iframe,.h5-ext-layer iframe+div [style*="cursor"][style*="pointer"],li[class^="g-view_"][class*="top-nav-more-large_"]:last-of-type,.vip_limit_content_sid p,.vip_limit_content_sid em,[data-spm*="shoujikan"],[class^="panel_"][class*=" u-panel_"],[class^="logout-header_"],div.youku-layer-logo,#right-title-ad-banner');
				cssobj('div[class^="top_area"],.control-scroll-infotop,.h5-ext-layer>div[style*="left:50%"][style*="top:50%"],.h5-ext-layer>div[style*="left: 50%"][style*="top: 50%"],span[class="iconfont iconshoucang"],div[class^="ab_"],div[id^="ab_"],.h5-ext-layer img,div[class^="switch-img"][class*="setconfig"],div[id^="Boh"]:not([id*="mment"]),div[class^="boh"]:not([class*="mment"]),div[class^="leftarea_"],[class*="foot"],[class^="fixed_bar_"] a[target*="_blank"],ul.play-fn,.js-top-icon');
				cssobj('div[class^="rightarea_"]{margin-left:auto!important;}[class^="fixed_bar_"]{background-color:transparent!important;}div.barrage-normal-container{float:left!important;width:100%!important;text-align:center;}div#ykPlayer{z-index:999999999!important}div[data-spm*="login"]>div[style*="block"][style*="fixed"]{z-index:2147483647!important;}div[id^="header-contain"]{position:absolute!important;}170403');
			} else if (obj.match(/^https?:\/\/video\.tudou\.com\/v\//)) {
				wdzdjxhyobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('div[class^="top_area"],.td-interactbox,.td-play__baseinfo,[class*="playbase"],[data-spm*="foot"],[data-js*="Down"],[class*="td-side-bar"] li:not([data-js-gotop*="gotop"])');
				cssobj('[class*="login"][class*="pop"],[id*="login"][id*="pop"]{z-index:2147483648!important}170403');
			} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\//)) {
				wdzdjxhyobj();
				zdgbdmobj();
				lkzdztobj();
				cssobj('.quick_vip.quick_item>.quick_link,.video_score,._site_channel_more,.txp_popup_download,txpdiv.txp_shadow,.icon_vip_pic,.quick_tips_inner,.video_info_wrap,[_r-component="c-mood"],.tips_promotion,[_hot*="客户端"],[class*="txp_ad_link"],[class*="txp_ad_more"],[data-role*="ad"][data-role*="pause"],.txp_comment_hot,.mod_action .action_wrap,div[_r-component="c-cover-recommend"],.txp-watermark-action,txpdiv.txp-watermark,[class*="_bg_ad"],[id*="_bg_ad"],[class^="mod_ad "],[data-role="txp-ui-favorite"],#mask_layer,.site_footer,._player_helper.player_helper,#shortcut');
				cssobj('[_r-component="c-player-helper"],.mod_client_bubble.mod_quick_tips,div[_r-component="c-new-tv-preheat"],.container_short .txp_mod_barrage,.player_container .txp_mod_barrage{left:0!important;text-align:center;}.site_channel a:not([_stat*="电"]):not([_stat*="动"]):not([_stat*="综艺"]):not([_stat*="会员"]):not([_stat*="全部"])');
				cssobj('[data-role^="txp-ui-title-mod"],[data-role^="txp-ui-screen-percent-wrap"],[data-role^="txp-ui-clock"],div[class="mod_row_box _movie_contact"],div[class="mod_row_box mod_row_loading"],.x_layer_card,.mod_row_box_casts.mod_row_box,div[class="mod_row_box"]:not([class*="forCommentsEntry"]):not([id*="forCommentsEntry"])');
				cssobj('div.mod_hanger{background-color:transparent!important;}div.site_container.container_main{background-color:#0f0f1e;}.wrapper_side .mod_title .title,div.figure_detail_row{color:#d8d4d3;}170403');
				removeall('div[_r-component="c-new-tv-preheat"],div.figure_video', undefined, false);
				(function() {
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
				mgzdgqobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('mango-control-status,.m-report-tipoff-dialog,[class*="footer"],[class*="mgad_"],[id*="mgad_"],ul.menu.clearfix a:not([href*="/show/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"]):not([href*="/vip/"]),[class*="rightnav"] ul li:not([mg-stat-mod*="history"]):not([class*="user"])');
				cssobj('.control-right,[style*="top: 0px;left:0px;bottom:0px;right:0px"],[style*="top: 0px; left: 0px; bottom: 0px; right: 0px"],span[class$="bg"],.video-info.enable,.play-control .control-left .dos,.g-play .g-container-playcet .mod-wrap-side,.big-poster-conent,ul.honey-feedback-list li:not([class*="backtop"])');
				cssobj('.u-control-danmu-control.state-bottom{right:25%!important;text-align:center;}div.maomibtn li#mgzdgqli{display:block!important}div.login-main{z-index:2147483647!important;}170403');
				if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\/b\//)) {
					wdzdjxhyobj();
					zdgbdmobj();
				} else {
					jxqtwzobj();
					cssobj('div.maomibtn li>a[target="_blank"]:not([class="maomi"]):not([href*="//wpa.qq.com/msgrd"]):not([href*="/00/raw/master/"])');
				}
			} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/[av]_/)) {
				if (iqiyiapcliwaiobj) {} else {
					jqjs();
					zdgbdmobj();
					wdvolumeobj();
					lkzdztobj();
					cssobj('[data-player-hook*="top"],div#iProgress,div#userdata_el,#titleRow,[data-player-hook*="follow"],.vippay-btn-tip,[class*="-adv-under"],[id*="-adv-under"],[class^="100000"],[id^="100000"],[data-player-hook*="logo"],iqpdiv.iqp-logo-box,.pca-bg.qy-player-pca,div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id),div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id)');
					cssobj('[id^="nav_renewBtn"],[data-player-hook="blankarea"],[rseat*="feedback"],.vip-btn .link-wrap,[data-player-hook*="scoretask"],[class*="footer"],[id="block-F"],[id="block-G"],[id="block-BD"],[id="block-JJ"],[class="qy-mod-wrap"][data-asyn-pb="true"],[id*="appDown"],[id*="game"],.qy-flash-func,[class*="-ai-"][data-player-hook],[class*="hot"][data-player-hook],div.nav-channel a:not([rseat*="dian"]):not([rseat*="zongyi"]):not([rseat*="dongman"]),li[class^="anchor-list"]:not([class="anchor-list"])');
					cssobj('[data-barrage*="BarrageVue"]{text-align:center;margin-left:25%!important;}div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"]){z-index:2147483647!important;}.flash-box.videoWindow{top:0!important;left:0!important;position:relative!important;z-index:300!important;width:100%!important;height:100%!important}170403');
					removeall('div[class^="qy-header-login-pop-"][class$="selected"]', undefined, false);
					if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
						wdzdjxhyobj();
					} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/a_/)) {
						wdzdjxhyobj();
						document.head.insertAdjacentHTML('beforeend', '<style>div[class^="videoBackGround"],div[class^="lequ-component lequ-comId"][data-block="PCW_lequ_code"][cpnm]>div.section0#section0,div[class*="weiboreyi-component"][data-block*="pinlun"],div[class^="banner"][class$="-outer"],div[id^="banner"][id$="-outer"],div.album-head-btn>a.qy-album-collect.J_collect_data,[class*="download"],[j-role*="scrollDiamondSign"],[class*="signin-btn"],#J-header-upload,#widget-playhistory-new,div.header-sideItem.header-vip,div.header-sideItem.header-download,div.header-sideItem.header-info,[class$=" cms-component-blank"][style="margin-bottom:0px;"]>*:not([class^="sec-"]):not([id^="sec-"]),[class*="sec-head-ad"],[class="relatedWork"],.slider-bar,[class*="djgm"],[class*="lhzz"],[class="sec-head show"] *:not([class*="title"]) img,[class="mod-footer-editor"],[class^="dhome"],[class="heat-info"],[class="episodePlot"][data-series-ele="juqing"],[id="widget-albumQiyu"],[class="albumRanklist"],[class="rank-num rank-active fl"],[data-tab-type="albumcomment"],[class="intro-effect clearfix"],[class="albumFocus-container"],[class^="top-"]>img[src*=".iqiyipic.com/common/20"][alt=""][class],li[class^="nav-L nav-"][data-nav-to^="#section"]:not([data-nav-to="#section1"]),[class="_mask_"],[class="vote-banner-box"],[class^="section"][class*=" section"],[class="nav-L nav-L2 nav_D"],div[class^="section2"],div[class^="section3"],div[class^="section4"],div[class^="section5"],div[class^="section6"],div[class^="section7"],div[class^="section8"],div[class^="section9"],[class^="footer"],div[class^="cms-component com-"][com-type="default"][style="margin-bottom:0px;"],div[class^="section"][id^="section-"]>img,.cms-wrapper>.layout-1020.cms-layout>.cms-row>.col-12.cms-block>.cms-component>.sec-head{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}::-webkit-scrollbar{width:0!important;height:0!important}.cms-wrapper{background:none!important;background-color:black!important}[lequ-componenttitle*="精彩看点"],[lequ-componenttitle$="花絮"],[style^="display:block;float:right"],[style^="display: block; float: right"],.lequ-component-box>[class^="lequ-component lequ-comId"][class*=" com-"] [class^="show"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}html,.lequ-component-box{background-color:#232325!important}.lequ-content{text-align:center;margin-left:25%}.lequ-header{margin-left:-25%!important}</style>');
					}
				};
			} else if (obj.match(/^https?:\/\/tw\.iqiyi\.com\/v_/)) {
				jqjs();
				jxqtwzobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('.main-content{padding-bottom:inherit;}[class*="vip-side-wrap"],[id*="vip-side-wrap"],.tw-play-con,.tw-play-side,.tw-play-tag,.tw-play-num,.tw-play-intro,.collect');
			} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
				wdzdjxhyobj();
				zdgbdmobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('[class*="foot"],[id*="foot"],[data-pb-txid*="qianfan"],[class*="zhibo"],#tvphb,div.left,span.btn-tips,a[class*="-adv-"][target*="_blank"],a[id*="-adv-"][target*="_blank"],.ad,.adv,#ad,#adv,.x-hdr-btn,.x-fox-btn,#leftBar,div.side-set div,div.side-set a:not([class*="top"]),div#navLocker div:not([class*="history"]):not([class*="upload"]):not([class*="user"]):not([class*="login"])');
				cssobj('[class^="x-clock"],[class^="x-webg"],[class^="x-pugc-title"],[class^="x-gradient-top"],[class^="x-info-panel"],#newplayNavCrumbs,.seeBox,div#content,.x_poster_card,.side-set,div.mod-column-main.l,[class*="share"],[id*="share"],div[class^="vBox vBox-"]');
				cssobj('html{background-color:#313136;}div.mod-column-side.r,div.right{width:inherit!important;}div#dmbar{margin-left:-25%!important;text-align:center;}div[class^="globallogin"]{z-index:2147483647!important;}170403');
				cssobj('#player{z-index:999999999!important;}170403');
				remove('iframe[src*="//tv.sohu."][width="0"][height="0"]');
			} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
				wdzdjxhyobj();
				cssobj('#go-top,.visible.J_vip_buttons_info.movie-info-vip-wrap,i.nav-new,a[href*="film.sohu.com/vip.html"],a[href*="film.sohu.com/vipAct.html"],div.player-content-bg,div.top_template,div.tm-wel1,.x-info-panel,.x-gradient-top,.x-hdr-btn,.x-fox-btn,div.content_main_hasrank,div.bg_main,.footer');
				cssobj('#vip_iframe__ {position:relative!important;}div[class^="globallogin"]{z-index:2147483647!important;}170403');
			} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
				wdzdjxhyobj();
				zdgbdmobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('[style^="position:"][style*="hidden"],.hv_topbar,.vipTabBanner,[data-statectn*="right"],.hv_buy,.tj_title,#j-hotguess,div.rank_box,.Foot,.user_bar .user_vip,.player-content-bg,.pop-operates,.QR_code,[class^="Banner_"],[id^="Banner_"],[class^="JS_banner_"],[id^="JS_banner_"],[id^="JS_banner_"]+div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body,[id^="JS_banner_"]+div.column_title~div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body~div.column_body');
				cssobj('div#LEPass_LOGIN_IFRAME{z-index:2147483647!important;}170403');
				remove('.rightFix_tool,iframe[onload*="union"],[style^="position:"][style*="hidden"]');
				removeall('[style^="position:"][style*="hidden"]', undefined, false);
			} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
				wdzdjxhyobj();
				zdgbdmobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('.focusPeople,div#wxPop,[tj_id^="sb_"],[class*="download"],[class^="module-video"][class$="-ops cf"],div.sus-cont a,div.sus-cont li:not([class*="top"]),div.hot.cf a:not([href*="tv.pptv."]):not([href*="movie.pptv."]):not([href*="zongyi.pptv."]):not([href*="cartoon.pptv."])');
				cssobj('a#update_btn,.button-box .right,img[class^="roll-"],img[id^="roll-"],a[tj_id],[class^="module-video"][class$="newupload"],[class*="copyright"],[class*="banneradv"],#video-maincont,[id*="game"],[class*="side-adv"],[class^="afp-"],[id^="afp-"],[class^="afp_"],[id^="afp_"]');
				cssobj('div[class^="layer loginlayer"]{z-index:2147483647!important;}');
			} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
				wdzdjxhyobj();
				cssobj('ul.ecope_emailsuggest,iframe#bubbleMsg,.pay-mod-notlogin,.playerBox-info-rightPart,#zhichiBtnBox,[class^="fl popBox ele_uc ticket hidden"],figure,footer,#sideBar_help_webSite,[class*="-adver"],[id*="-adver"]');
				cssobj('div[class^="common-popup"]{z-index:2147483647!important;}');
			} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
				wdzdjxobj();
				wdvolumeobj();
				lkzdztobj();
				cssobj('form#postFrameData,div[style^="position:absolute; right:0;"],div#play_mask,.playli_momey,.playli_erwm,.open_vip,.wasu_jh,.play_video_b,ws-postershot,[class*="postershot"],[id*="AD_POP_"],iframe[src*="adload"],.play_global,.footer,.sidebar,[class*="_ad"],[id*="_ad"],[class*="ad_"]:not([class*="head"]),[id*="ad_"]:not([id*="head"])');
				cssobj('table[class^="boxy-wrapper"]{z-index:2147483647!important;}170403');
			} else if (obj.match(/^https?:\/\/(?:www|player|live)\.bilibili\.com\//)) {
				lkzdztobj();
				cssobj('div[id="AHP_Notice"][style^="height:"],[class^="flip-view p-relative over-hidden"],[class*="player-video-top"],div#heimu,.bilibili-player-video-top.bilibili-player-video-top-pgc,[class*="-app-download"],.expand-more,#toolbar_module,div.clearfix.recom-item:nth-child(n+10),li.nav-link-item a[href*="/app.bilibili.com"],li.nav-link-item a[href*="/game.bilibili.com"]');
				if (!obj.match(/^https?:\/\/live\.bilibili\.com\//)) {
					zdgbdmobj();
				}
				if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
					if (document.title.indexOf("（僅限台灣地區）") > 0) {} else {
						jqjs();
						wdzdjxhyobj();
					}
				} else {
					jxqtwzobj();
					cssobj('div.maomibtn li>a[target="_blank"]:not([class="maomi"]):not([href*="//wpa.qq.com/msgrd"]):not([href*="/00/raw/master/"])');
				}
			} else if (obj.match(/^http?:\/\/www\.fun\.tv\/vplay\/g-/)) {
				jqjs();
				jxqtwzobj();
				lkzdztobj();
				cssobj('.fxp-video-cover,#mark-,#main-rt,.fix.rightBtn,span.tit-btn-icon,[class*="downlaod"]');
				cssobj('a.orange-btn.js-pay-open{text-align:center!important}div[class^="dialog-view"]{z-index:2147483647!important;}170403');
			} else if (obj.match(/^https?:\/\/www\.miguvideo\.com\/mgs\/website\/prd\/detail\.html\?cid=/)) {
				jxqtwzobj();
				lkzdztobj();
				cssobj('div.bulletScreen,div.recoment_to_you,[class*="download"],[class="float-btn"]>div:not([class*="top-btn"])');
			} else if (obj.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
				zdgbdmobj();
				jxqtwzobj();
				lkzdztobj();
				cssobj('div.maomibtn li>a[target="_blank"]:not([class="maomi"]):not([href*="//wpa.qq.com/msgrd"]):not([href*="/00/raw/master/"])');
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
									'真不卡': 'https://www.zhenbuka.com/vodsearch/-------------/?wd=' + title + '&submit',
									'独播库': 'https://www.duboku.co/vodsearch/-------------.html?wd=' + title + '&submit',
									'宅看影视': 'https://www.zhaikanys.com/vodsearch/-------------.html?wd=' + title + '&submit',
									'完美看看': 'https://www.wanmeikk.me/so/-------------.html?wd=' + title + '&submit',
									'1080影视': 'https://www.k1080.net/sou/-------------.html?wd=' + title + '&submit',
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
			} else if (obj.match(/^https?:\/\/www\.zhenbuka\.com\/vodsearch\//)) {
				pdssgjcobj = 'div.detail>h3>a';
				apddjobj();
			} else if (obj.match(/^https?:\/\/www\.duboku\.co\/vodsearch\//)) {
				pdssgjcobj = 'div.detail>h4>a';
				apddjobj();
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
					} catch (e) {}
				})();
			} else {
				jxqtwzobj();
			}
		} else {
			if (obj.match(/^https?:\/\/m\.youku\.com\/.+?\/id_/)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('.showMore,.brief-more,[class^="h5-detail-feed"],div.x-trigger,div.uplader,#ykPlayer,.Push-container,.Corner-container,.h5-detail-ad,.h5-detail-guide.clipboard,.h5-detail-recommend,#comment-frame,.yk-footer,.brief-btm,#YKComment');
			} else if (obj.match(/^https?:\/\/m\.mgtv\.com\/b\//)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('div.m-vip-list,div.mg-app-swip,.mgui-btn-nowelt.mgui-btn,.clearfix.bd,[class^="mgui-card"]:not([class*="xuanji"]),.m-vip-list+div,.video-about.mg-stat,div#comment-id,[class*="footer"],.more,div#nav-bar a:not([href*="/show/"]):not([href*="/vip/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"])');
			} else if (obj.match(/^https?:\/\/m\.pptv\.com\/show\//)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('.openapp-bg.player-info,#pgotop,.trivia-wrap.trivia,.plist-w.plist6.plist,.comment-container,.m_copyright,.footbanner,.hide.vod-intor.player-info,.download,.star-page-enter');
			} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('#app_store,.wakeAppBtn.fl,.openMembershipBtn,.downLoadBtn.commonPic,.open-app,.no-marg.f_song,.ad,.iconList');
			} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)/)) {
				jqjs();
				wdzdjxhyobj();
				if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/v/)) {
					cssobj('.winbox-mask.__mask,.G-browser,.js-app-topbanner.actv-banner,.btn-xz-app,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.main-rec-view-box.main-view-box.app-view-box,#CommentTarget,footer,.twinfo_iconwrap,.t_titlearrowup,.js-btn-newhy.btn-new-hy');
				} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/phone_play_film\?aid=/)) {
					cssobj('.player_film_bg,.p_f_pannel,.btn-xz-app,.twinfo_iconwrap,#film_top_banner,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.foot.sohu-swiper,#CommentTarget,footer,.player_film_cover,.t_titlearrowup');
				}
			} else if (obj.match(/^https?:\/\/m\.le\.com\/vplay_/)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('[class^="j-Banner"],[id^="j-Banner"],[class*="Daoliu"],#j-leappMore,#j-zhoubian,#j-spoiler,#j-recommend,.leapp_btn,#j-toolbar>.animate1.column_box,.gamePromotionTxt,section#j-recommend,#j-comment,section.search_top,.footer,.intro_cnt dd,.up-letv');
			} else if (obj.match(/^https?:\/\/m\.iqiyi\.com\/v_/)) {
				jqjs();
				jqjs();
				wdzdjxhyobj();
				cssobj('[name="m-vipWatch"]+div[class="m-box"],.m-title-anthology.m-title>.c-des,.m-linkMore,.m-hotSpot-update,.m-dom-loading-gray,[name="m-paopao"],[name="m-videoRec"]+div[class="m-box"],section.m-videoPlay-toolBar,.vue-portal-target,.m-iqylink-guide,.videoInfoFold-data,#openDesc,#comment,.page-c-items,.m-pp-entrance,.m-videoUser-spacing,[name="m-aroundVideo"],[name="m-videoRec"]');
				cssobj('section.m-hotWords-bottom,section.m-loading-info,[name="m-extendBar"]+div+div[class="m-box"],section.m-recommend-player,section.m-recommend-player+div[class="m-box-items m-box-items-full"],[name="m-extendBar"],section.m-video-player,.m-video-player .playCount-time,section.sourceHandle,div[is-call-app="true"]~div[class="m-box"],[class*="-banner"],[name="m-movieRec"],[name="m-movieHot"],[name="m-vipWatch"],[name="m-vipRights"],.video-data,.m-video-extendBar,.m-ipRelation-spacing.m-ipRelation-home.m-ipRelation');
			} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/wap\/.+?\/show\/id\//)) {
				jqjs();
				wdzdjxhyobj();
				cssobj('.appdown,.clearfix.player_menu_con,#gotop,.movie_title>.clearfix,.tele-play-rec.clearfix.ws_row.recommend,.hot-vcr,.ws_footer,div.navlist a:not([data-aliitemname*="电"]):not([data-aliitemname*="动"]):not([data-aliitemname="综艺"]):not([data-aliitemname="VIP"])');
			} else if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com/)) {
				if (!obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/(?:(?:.+?\/)?cover\/\w+?\/(?:(?![^\/]+?[\?&][cv]id=)\w+?\.htm|\w+?\.html\?vid=\w+$)|.+?[\?&](?:cid=[^\/]+?&vid=|cid=\w+?$))/)) {
					if (document.querySelector('a[route][href*="/x/"][class*="open"]')) {
						(function() {
							$("body").on('mouseover', 'a[route][href*="/x/"][class*="open"]', function(e) {
								let wdzqxjobj = $(this), href = wdzqxjobj.attr('href') || wdzqxjobj.data("href");
								wdzqxjobj.off('click.chrome');
								wdzqxjobj.on('click.chrome', function() {
									window.location.href = href
								}).attr('data-href', href).css({
									cursor: 'pointer'
								}).removeAttr('href')
							})
						})();
					} else {}
				} else {
					jqjs();
					wdzdjxhyobj();
					cssobj('[dt-params*="会员特权"],[open-app]:not(li),.mod_source,.U_color_b.video_types_new.video_types,.mod_video_info_bottom.mod_video_info,.mod_promotion,.mod_recommend.mod_box,.mod_clips.mod_box,.mod_comment.mod_box,.mod_multi_figures_h.mod_sideslip_h.mod_box,.mod_game_rec.mod_box');
				}
			} else {
				jxqtwzobj();
			}
		}
		if (vipzdjxwzobj) {
			cssobj('ul#httpsvipul>li:nth-child(' + pchttpsjk + ')>span{background-color:chartreuse!important;}170403');
			(function() {
				let aa = 1, bb = '<span><a1 style="display:none"></a1><a2 style="display:none">', cc = '<span><a1 style="color:darkgreen">搜索</a1><a2 style="display:none">', dd = '<span><a1 style="color:darkgreen">跳转</a1><a2 style="display:none">', ee = '<span><a1 style="color:darkgreen">小窗</a1><a2 style="display:none">', ff = '<span><a1 style="color:darkgreen">大窗</a1><a2 style="display:none">', ii = '<span style="background-color:hotpink"><a1 style="color:darkgreen"></a1><a2 style="display:none">', kk = '<span style="display:grid"><a1 style="color:darkgreen">自用</a1><a2 style="display:none">', jj = '<span style="background-color:darkorange"><a1 style="color:darkgreen"></a1><a2 style="display:none">', gg = '</a2><a3 style="color:#2196F3;zoom:0.8;font-weight:bold;">🍋☞</a3><a4>', hh = '</a2><a3 style="display:none"></a3><a4>', https = [{
					name: jj + aa+++hh + "捐献",
					vip: "捐献"
				}, {
					name: jj + aa+++hh + "反馈",
					vip: "反馈"
				}, {
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
					url: "https://jx.688ing.com/?search="
				}, {
					name: jj + aa+++hh + "B站专用②",
					url: "https://jiexi.q-q.wang/?url="
				}, {
					name: jj + aa+++hh + "B站专用③",
					url: "https://api.lhh.la/vip/?url="




				}, {
					name: ii + aa+++hh + "加速",
					url: "https://www.cuan.la/m3u8.php?url="
				}, {
					name: ii + aa+++hh + "久播",
					url: "https://vip.jiubojx.com/vip/?url="
				}, {
					name: ii + aa+++hh + "悟空",
					url: "https://api.longdidi.top/jx/?url="
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
					name: ii + aa+++hh + "咪咪",
					url: "https://api.momimi.cn/?url="
				}, {
					name: ii + aa+++hh + "云解析",
					url: "https://jx.mw0.cc/vip.php?v="
				}, {
					name: ii + aa+++hh + "猫视频",
					url: "https://fy.maosp.me:7788/?url="
				}, {
					name: ii + aa+++hh + "蘑菇",
					url: "https://jx.wzslw.cn/jiexi/?url="
				}, {
					name: ii + aa+++hh + "星驰",
					url: "https://vip.cjys.top/?url="
				}, {
					name: ii + aa+++hh + "福星",
					url: "https://jx.popo520.cn/jiexi/?url="
				}, {
					name: ii + aa+++hh + "大师",
					url: "https://jx.htv009.com/?url="
				}, {
					name: ii + aa+++hh + "200",
					url: "https://vip.66parse.club/?url="
				}, {
					name: ii + aa+++hh + "365",
					url: "https://jx.ljtv365.com/?url="


				}, {
					name: bb + aa+++hh + "OK",
					url: "https://okjx.cc/?url="
				}, {
					name: bb + aa+++hh + "九八看",
					url: "https://jx.youyitv.com/?url="
				}, {
					name: bb + aa+++hh + "8090",
					url: "https://www.8090g.cn/?url="
				}, {
					name: bb + aa+++hh + "H8",
					url: "https://www.h8jx.com/jiexi.php?url="
				}, {
					name: bb + aa+++hh + "小狼云",
					url: "https://jx.dianyingguan.cn/?url="
				}, {
					name: bb + aa+++hh + "月亮",
					url: "https://api.yueliangjx.com/?url="
				}, {
					name: bb + aa+++hh + "我爱",
					url: "https://vip.52jiexi.top/?url="
				}, {
					name: bb + aa+++hh + "黑云",
					url: "https://jiexi.380k.com/?url="
				}, {
					name: bb + aa+++hh + "616G",
					url: "https://jx.618g.com/?url="
				}, {
					name: bb + aa+++hh + "1717",
					url: "https://www.1717yun.com/jx/ty.php?url="
				}, {
					name: bb + aa+++hh + "IUK",
					url: "https://player.iuk.ink/m3u8.php?url="
				}, {
					name: bb + aa+++hh + "Idc126",
					url: "https://jx.idc126.net/jx/?url="
				}, {
					name: bb + aa+++hh + "金桥",
					url: "https://5.nmgbq.com/2/?url="
				}, {
					name: bb + aa+++hh + "M3u8",
					url: "https://jx.m3u8.tv/jiexi/?url="
				}, {
					name: bb + aa+++hh + "赤兔",
					url: "https://jx.taoxianba.net/?url="
				}, {
					name: bb + aa+++hh + "紫胤",
					url: "https://v.ziyinyun.cn/jx/?url="
				}, {
					name: bb + aa+++hh + "诺讯",
					url: "https://www.ckmov.com/?url="
				}, {
					name: bb + aa+++hh + "云端",
					url: "https://jx.ergan.top/?url="
				}, {
					name: bb + aa+++hh + "梦幻",
					url: "https://mh.meng20.cn/by/?url="
				}, {
					name: bb + aa+++hh + "搜伊思",
					url: "https://yun.sooyisi.com/vip/?url="
				}, {
					name: bb + aa+++hh + "老版",
					url: "https://vip.laobandq.com/jiexi.php?url="


				}, {
					name: dd + aa+++gg + "17云",
					url: "http://17kyun.com/api.php?url=",
					vip: "强制跳转"
				}, {
					name: dd + aa+++gg + "音萌",
					url: "http://api.v6.chat/?url=",
					vip: "强制跳转"
				}, {
					name: dd + aa+++gg + "爱看",
					url: "http://dy.maosp.me/jx/?url=",
					vip: "强制跳转"


				}, {
					name: ee + aa+++gg + "4080",
					url: "http://jx.urlkj.com/4080/?url="
				}, {
					name: ee + aa+++gg + "时光",
					url: "http://timeys.maosp.me/jx/?url="
				}, {
					name: ee + aa+++gg + "2090",
					url: "http://m2090.com/?url="
				}, {
					name: ee + aa+++gg + "小野马",
					url: "https://www.xymav.com/?url=",
					vip: "强制弹小窗"
				}, {
					name: ee + aa+++gg + "svip影院",
					url: "http://svip.daidaijx.cn/jiexi/?url="
				}, {
					name: ee + aa+++gg + "大亨影院",
					url: "http://api.oopw.top/jiexi/?url="
				}, {
					name: ee + aa+++gg + "爱看影视",
					url: "http://api.ikancloud.cn/?url="
				}, {
					name: ee + aa+++gg + "久看解析",
					url: "https://9kjx.com/?url=",
					vip: "强制弹小窗"
				}, {
					name: ee + aa+++gg + "电影盒子",
					url: "http://jx5.178du.com/p1/?url=",
					vip: "强制弹小窗"


				}, {
					name: ff + aa+++gg + "69选集",
					url: "https://api.69ne.com/?url=",
					vip: "强制弹大窗"
				}, {
					name: ff + aa+++gg + "123选集",
					url: "http://www.kan123.tv/jx/?v=",
					vip: "强制弹大窗"
				}, {
					name: ff + aa+++gg + "冰豆选集",
					url: "https://api.bingdou.net/?url=",
					vip: "强制弹大窗"
				}, {
					name: ff + aa+++gg + "6U选集",
					url: "http://dy.ataoju.com/svip/?url=",
					vip: "强制弹大窗"
				}, {
					name: ff + aa+++gg + "云网选集",
					url: "https://www.41478.net/?url=",
					vip: "强制弹大窗"
				}, {
					name: ff + aa+++gg + "要搜选集",
					url: "https://www.yaosou.cc/jiexi/?v=",
					vip: "强制弹大窗"
				}];

				function createSelecthttps(https) {
					let httpsvipul = document.createElement("ul");
					httpsvipul.id = "httpsvipul";
					if (wdpcobj) {
						httpsvipul.setAttribute("style", "display:none");
					} else {
						httpsvipul.setAttribute("style", "display:none;background:#18222d;background-size:100% 100%;box-shadow:0px 1px 10px rgba(0,0,0,0.3);width:99vmin;height:200px;margin:0;padding:0;position:fixed;bottom:0.5vw;left:50%;margin-left:-49.5vmin;z-index:99999;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;");
					}
					for (var i = 0; i < https.length; i++) {
						let httpsvipli = document.createElement("li");
						let that = this;
						if (wdpcobj) {} else {
							httpsvipli.setAttribute("style", "margin:0;padding:0;display:block;list-style:none;float:left;font-size:16px;color:#999 !important;font-weight:900;width:14.285%;height:47.5px;text-align:center;line-height:63.5px;letter-spacing:0;border-bottom:0.5px solid #333;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;cursor:pointer;");
						}
						if (wdpcobj) {
							(function(num) {
								httpsvipli.onclick = function() {
									let arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"], bxjImg = Math.floor(Math.random() * arr.length), wdimg = "https://gitee.com/wd170403/my/raw/master/" + arr[bxjImg] + ".jpg";
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
									var wdjxurl, jjxxbb, wd;

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
										} catch (e) {}
									};

									function jxqzsxobj() {
										let url = window.location.href;
										setInterval(function() {
											let newUrl = window.location.href;
											if (newUrl != url) {
												url = window.location.href;
												history.go(0)
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
														} catch (e) {}
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
									let tctha = '<div style="text-shadow:0 0 2px #00ff00	!important;letter-spacing:-1px!important;font-weight:bold!important;padding:0!important;font-family:arial,sans-serif!important;font-size:30px!important;color:#ff0020!important;width:auto!important;height:52px!important;border:4px solid #ff0020!important;border-radius:12px!important;position:absolute!important;top:50%!important;left:35%!important;margin:-30px 0 0 -80px!important;text-align:center!important;line-height:52px!important;">\u5434\u4e39\uff1a\u6709\u5fc3\u5ff5\u60a8\uff0c\u65e0\u5fc3\u4e5f\u662f\u4f60</div>';
									let tcthb = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:170403;"><img id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" allowtransparency="true" frameborder="0" scrolling="no" sandbox="allow-scripts allow-same-origin allow-forms" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" src="' + wdimg + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:170403;"></img></div>';

									if (location.host.indexOf('youku') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#player');
										ggobj('.youku-film-player');
										cssobj('#ykPlayer,.nav-mamu');
									} else if (location.host.indexOf('tudou') > 0) {
										wdjxurl = window.location.href.replace(/^https?:\/\/video\.tudou\.com\/v\/([^\/]+?)(?:==\.html)?\?.*?$/, "http://v.youku.com/v_show/id_$1==.html");
										vipobj('.td-playbox');
										remove('.td-interactbox');
									} else if (location.host.indexOf('qq') > 0) {
										if (location.href.indexOf('/x/cover/') > 0) {
											wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										} else if (location.href.indexOf('/variety/p/topic/') > 0) {
											wdjxurl = document.querySelector(".current .figure_title").offsetParent.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
											(function() {
												$("body").on('mouseover', '[_wind*="列表"] ul li a[href*="/x/"][target]', function(e) {
													let wdzqxjobj = $(this), href = wdzqxjobj.attr('href') || wdzqxjobj.data("href");
													wdzqxjobj.off('click.chrome');
													wdzqxjobj.on('click.chrome', function() {
														window.location.href = href
													}).attr('data-href', href).css({
														cursor: 'pointer'
													}).removeAttr('href')
												})
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
										wdjxurl = window.location.href.replace(/^https?:\/\/w(?:ww)?\./, "http://www.").replace(/html[\W_].*?$/, "html");
										vipobj('#mgtv-player-wrap');
										ggobj("#mgtv-player-wrap container");
										cssobj("outer-bottom,container");
									} else if (location.host.indexOf('iqiyi') > 0) {
										wdjxurl = window.location.href.replace(/^https?:\/\/(?:t|ww)w\./, "http://www.").replace(/html[\W_].*?$/, "html");
										vipobj('#mgtv-player-wrap');
										ggobj("#mgtv-player-wrap container");
										cssobj("outer-bottom,container");
										vipobj('#flashbox');
										ggobj('#secondFrame');
										if (document.querySelector('ul li [href*="/v_"][href*=".html"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])')) {
											(function() {
												$("body").on('mouseover', 'ul li [href*="/v_"][href*=".html"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
													let wdzqxjobj = $(this), href = wdzqxjobj.attr('href') || wdzqxjobj.data("href");
													wdzqxjobj.off('click.chrome');
													wdzqxjobj.on('click.chrome', function() {
														window.location.href = href
													}).attr('data-href', href).css({
														cursor: 'pointer'
													}).removeAttr('href')
												})
											})();
										} else {}
										if (location.href.indexOf('iqiyi.com/a_') > 0) {
											try {
												cssobj('div.lequPlayer{height:' + document.querySelector("div.play-dianbo").offsetHeight + 'px!important;width:' + document.querySelector("div.play-dianbo").offsetWidth + 'px!important;}');
											} catch (e) {}
											remove('div[class*="-list-box"][class*="-lianboList"],div[class$="-side-icon"],div[id*="scrollBox"],div[class*="tem_voteEnter"]');
										} else {}
									} else if (location.href.indexOf('tv.sohu.com/v/') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#player');
										cssobj('#player_vipTips,#toolBar');
									} else if (location.href.indexOf('film.sohu.com/album/') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#playerWrap');
										ggobj('#detail_btn_play');
										remove('.player-content-bg,.pop-operates');
									} else if (location.host.indexOf('.le') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#fla_box');
									} else if (location.host.indexOf('pptv') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#pptv_playpage_box');
										ggobj('.sidebarbtn');
										cssobj('div[class^="module-video"][class*="-ops"]');
									} else if (location.host.indexOf('1905.com') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
										vipobj('#playBox');
										ggobj('object');
										remove('.sc-content,.sc-paper,.sc-error');
										cssobj('.player-widget');
									} else if (location.host.indexOf('wasu') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('#player');
										ggobj('.qp');
										cssobj('div#pcplayer{height:100%;}.play_video_b');
									} else if (location.host.indexOf('bilibili') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://").replace(/\?spm_id_.*?$/, "");
										vipobj('#player_module');
										ggobj('#player_mask_module');
									} else if (location.host.indexOf('.fun.tv') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('#html-video-player-layout');
									} else if (location.host.indexOf('.miguvideo.com') > 0) {
										wdjxurl = window.location.href.replace(/^https:\/\//, "http://");
										vipobj('.play');
										cssobj('div.episodeInfo+div.title,div.leftImgRightText');
									} else {}
									function cssobj(css) {
										document.head.insertAdjacentHTML("beforeend", '<style class="ywy-cssobj-wudan" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
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
										jjxxbb = https[num].url + wdjxurl + https[num].vip;
										wd = jjxxbb.replace(/^(.+?)undefined$/, "$1");
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
												} else {} if (wd.match(new RegExp("^https:\/\/(?!.+?强制(?:弹[小大]窗|跳转))")) && !wd.match(new RegExp("(?:最大网|布米米)"))) {
													document.querySelector(vip).innerHTML = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:170403;"><iframe id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" allowtransparency="true" frameborder="0" scrolling="no" sandbox="allow-scripts allow-same-origin allow-forms" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" src="' + wd + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:170403;"></iframe></div>';
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
													if (wd.match(new RegExp("最大网"))) {
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
															} catch (e) {}
														})();
													} else if (wd.match(new RegExp("布米米"))) {
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
															} catch (e) {}
														})();
													} else {
														tcthbobj();
														if (wd.match(new RegExp("^https?:\/\/.+?强制跳转"))) {
															window.open(wd.replace(/强制跳转.*?$/, ""), "bkmk_popup");
														} else if (wd.match(new RegExp("^https?:\/\/.+?强制弹大窗"))) {
															let tmpobj = window.open(wd.replace(/强制弹大窗.*?$/, ""), "bkmk_popup", "fullscreen=1");
															tmpobj.resizeTo(screen.width, screen.height);
														} else if (wd.match(new RegExp("^https?:\/\/(?:.+?强制弹小窗)?"))) {
															window.open(wd.replace(/强制弹小窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
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
									let url = window.location.href;
									setInterval(function() {
										let newUrl = window.location.href;
										if (newUrl != url) {
											url = window.location.href;
											history.go(0)
										}
									});
									(function() {
										try {
											(function() {
												'use strict';
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
															videoAdded = true;
															addListenersToVideo(mutation.target, true)
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
												addListeners()
											})();
										} catch (e) {
											(function() {
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
											})();
										}
									})();
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
									var wdjxurl;

									function zddjscjk() {
										if (localStorage.getItem("sjhttpsjk") != null || localStorage.getItem("pchttpjk") != null) {} else {
											function scwdsjjx(a, b) {
												return a + Math.round(Math.random() * (b - a))
											};
											let scwdhttpssjjx = scwdsjjx(1, 1);
											document.querySelector("ul#httpsvipul>li:nth-child(" + scwdhttpssjjx + ")>span").click()
										}
									};

									function zddjjk() {
										zddjscjk();
										$('ul#httpsvipul>li').click(function() {
											localStorage.setItem("zdwdjx", "1");
											if (document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2") == null) {} else {
												let sjhttpsjksz = document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2").textContent;
												localStorage.setItem("sjhttpsjk", sjhttpsjksz);
											}
										});
										$('ul#httpvipul>li').click(function() {
											localStorage.setItem("zdwdjx", "2");
											if (document.querySelector("ul#httpvipul>li>span.wswdshhjd>a2") == null) {} else {
												let pchttpjksz = document.querySelector("#httpvipul>li>span.wswdshhjd>a2").textContent;
												localStorage.setItem("pchttpjk", pchttpjksz);
											}
										});
										if (localStorage.getItem("zdwdjx") == 1) {
											let jihao1 = 'ul#httpsvipul>li:nth-child(' + sjhttpsjk + ')';
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
										} else if (localStorage.getItem("zdwdjx") == 2) {
											let jihao2 = 'ul#httpvipul>li:nth-child(' + pchttpjk + ')';
											let jihaob = [jihao2];
											for (i = 0; i < jihaob.length; i++) {
												if (exist(jihaob[i])) {
													exist(jihaob[i]).click();
													console.log("%c电脑会员视频自动判断-弹窗-成功点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px")
												}
											}
											function exist(jihaob) {
												if (document.querySelector(jihaob)) {
													return document.querySelector(jihaob)
												} else {
													return false
												}
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
										} catch (e) {}
									};
									var wdjxurl, jjxxbb, wd;
									var qp = 'data-ad="false" marginwidth="0" marginheight="0" autoplay="ture" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" allowTransparency="allowTransparency" border="0" frameborder="0" scrolling="no" marginwidth="0"';
									var style = "border:none;outline:none;margin:0;padding:0;position:absolute;z-index:999999;";

									if (location.host.indexOf('youku') > 0) {
										vipobj('#player');
										if (window.location.href.match(/^https?:\/\/m\.youku\.com\/.+?\/id_[^==]+?==\.html/)) {
											var youkuurl = window.location.href,
												youkua = document.location.toString().split("/id_"),
												youkuurl = youkua[1].indexOf("/");
											youkua = youkua[1].substring(youkuurl); - 1 != youkua.indexOf(".") && (youkua = youkua.split(".")[0]);
											wdjxurl = 'http://v.youku.com/v_show/id_' + youkua + '.html';
										} else if (window.location.href.match(/^https?:\/\/m\.youku\.com\/.+?\/id_[^\.]+?\.html/)) {
											wdjxurl = window.location.href.replace(/^(.+?\.html)\?.*$/i, "$1");
										}
									} else if (location.host.indexOf('mgtv') > 0) {
										vipobj('.video-area');
										var mgtvurl = window.location.href,
											mgtva = document.location.toString().split("//"),
											mgtvurl = mgtva[1].indexOf("/");
										mgtva = mgtva[1].substring(mgtvurl); - 1 != mgtva.indexOf(".") && (mgtva = mgtva.split(".")[0]);
										wdjxurl = 'http://www.mgtv.com' + mgtva + '.html';
									} else if (location.host.indexOf('pptv') > 0) {
										vipobj('#playerbox');
										var pptvurl = window.location.href,
											pptva = document.location.toString().split("/show/"),
											pptvurl = pptva[1].indexOf("/show/");
										pptva = pptva[1].substring(pptvurl); - 1 != pptva.indexOf(".") && (pptva = pptva.split(".")[0]);
										wdjxurl = 'http://v.pptv.com/show/' + pptva + '.html';
									} else if (location.host.indexOf('1905.com') > 0) {
										vipobj('#player');
										wdjxurl = window.location.href;
									} else if (location.href.indexOf('tv.sohu.com/v') > 0) {
										vipobj('.x-player');
										wdjxurl = window.location.href;
									} else if (location.href.indexOf('tv.sohu.com/phone_play_film?aid=') > 0) {
										vipobj('.player');
										wdjxurl = window.location.href;
									} else if (location.host.indexOf('.le') > 0) {
										vipobj('#j-player');
										var leurl = window.location.href,
											lea = document.location.toString().split("/vplay_"),
											leurl = lea[1].indexOf("/vplay_");
										lea = lea[1].substring(leurl); - 1 != lea.indexOf(".") && (lea = lea.split(".")[0]);
										wdjxurl = 'http://www.le.com/ptv/vplay/' + lea + '.html';
									} else if (location.host.indexOf('iqiyi') > 0) {
										vipobj('.m-video-player-wrap');
										cssobj('[name="m-videoInfo"]{margin-top:5%!important;}.m-video-player-wrap{top:-205px!important}iframe#vip_iframe__ {height:210px!important;}170403');
										var iqiyiurl = window.location.href,
											iqiyia = document.location.toString().split("//"),
											iqiyiurl = iqiyia[1].indexOf("/");
										iqiyia = iqiyia[1].substring(iqiyiurl); - 1 != iqiyia.indexOf(".") && (iqiyia = iqiyia.split(".")[0]);
										wdjxurl = 'http://www.iqiyi.com' + iqiyia + '.html';
									} else if (location.host.indexOf('wasu') > 0) {
										vipobj('.ws_play.relative');
										vipobj('#pop');
										var wasuurl = window.location.href,
											wasua = document.location.toString().split("://"),
											wasuurl = wasua[1].indexOf("/id/");
										wasua = wasua[1].substring(wasuurl); - 1 != wasua && (wasua = wasua);
										wdjxurl = 'http://www.wasu.cn/Play/show' + wasua;
									} else if (location.host.indexOf('v.qq.com') > 0) {
										vipobj('#player');
										if (window.location.href.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/(?:.+?\/)?cover\/\w+?\/(?![^\/]+?[\?&][cv]id=)\w+?\.htm/)) {
											var vqqaurl = window.location.href,
												vqqa = document.location.toString().split("/cover/"),
												vqqaurl = vqqa[1].indexOf("/");
											vqqa = vqqa[1].substring(vqqaurl); - 1 != vqqa.indexOf(".") && (vqqa = vqqa.split(".")[0]);
											wdjxurl = 'http://v.qq.com/x/cover' + vqqa + '.html';
										} else if (window.location.href.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/(?:.+?\/)?cover\/\w+?\/\w+?\.html\?vid=\w+$/)) {
											var vqqburl = window.location.href,
												vqqb = document.location.toString().split("/cover/"),
												vqqburl = vqqb[1].indexOf("/");
											vqqb = vqqb[1].substring(vqqburl); - 1 != vqqb.indexOf(".") && (vqqb = vqqb.split(".")[0]);
											var vqqbburl = window.location.href,
												vqqc = document.location.toString().split("?vid="),
												vqqbburl = vqqc[1].indexOf("?vid=");
											vqqc = vqqc[1].substring(vqqbburl); - 1 != vqqc && (vqqc = vqqc);
											wdjxurl = 'http://v.qq.com/x/cover' + vqqb + '/' + vqqc + '.html';
										} else if (window.location.href.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.+?[\?&]cid=[^\/]+?&vid=(?:&|$)/)) {
											var vqqcurl = window.location.href,
												vqqe = document.location.toString().split("cid="),
												vqqcurl = vqqe[1].indexOf("cid=");
											vqqe = vqqe[1].substring(vqqcurl); - 1 != vqqe.indexOf("&") && (vqqe = vqqe.split("&")[0]);
											wdjxurl = 'http://v.qq.com/x/cover/' + vqqe + '.html';
										} else if (window.location.href.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.+?[\?&]cid=[^\/]+?&vid=/)) {
											if (window.location.href.match(/[\?&]cid=/) && window.location.href.match(/&vid=/)) {
												var vipurl = "";
												if (getvip('vid') == "") {
													vipurl = "http://v.qq.com/x/cover/" + getvip('cid') + ".html"
												} else {
													vipurl = "http://v.qq.com/x/cover/" + getvip('cid') + "/" + getvip('vid') + ".html"
												}
											}
											function getvip(name) {
												var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", "i");
												var r = location.search.substr(1).match(reg);
												if (r != null) return unescape(decodeURI(r[1]));
												return null
											};
											wdjxurl = vipurl;
										} else if (window.location.href.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.+?[\?&]cid=\w+?$/)) {
											var vqqdurl = window.location.href,
												vqqf = document.location.toString().split("?cid="),
												vqqdurl = vqqf[1].indexOf("?cid=");
											vqqf = vqqf[1].substring(vqqdurl); - 1 != vqqf && (vqqf = vqqf);
											wdjxurl = 'http://v.qq.com/x/cover/' + vqqf + '.html';
										}
									} else {}
									function cssobj(css) {
										document.head.insertAdjacentHTML("beforeend", '<style class="ywy-cssobj-wudan" media="screen">' + (css) + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
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
										jjxxbb = https[num].url + wdjxurl + https[num].vip;
										wd = jjxxbb.replace(/^(.+?)undefined$/, "$1");
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
												} else {} if (wd.match(new RegExp("^https?:\/\/(?!.+?(?:捐献|反馈))"))) {
													if (wd.match(new RegExp("^https:\/\/"))) {
														document.querySelector(vip).innerHTML = '<div id="vip_iframe__" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:170403;"><iframe id="vip_iframe__" data-ad="false" autoLoad="true" autoplay="true" style="' + style + '" width="100%" height="100%"' + qp + ' src="' + https[num].url + wdjxurl + '"></iframe></div>';
													} else if (wd.match(new RegExp("^http:\/\/"))) {
														window.open(https[num].url + wdjxurl, "_blank");
													}
												} else if (wd.match(new RegExp("捐献"))) {
													window.open("https://gitee.com/q2257227289/00/raw/master/170403-1.png", "_blank");
												} else if (wd.match(new RegExp("反馈"))) {
													window.open("http://wpa.qq.com/msgrd?v=3&uin=170403&site=qq&menu=yes", "_blank");
												}
											} else {}
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
				if (wdpcobj) {

					let vipjxzstb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAUVBMVEVHcEz20ZvppDoAAAD0rDtYPhbKkDD/tkT/7NX/6MP/szr///8WEQr4rjd7VhvEiSs2JgvpozTs7OxUOhKpdyXZmDBKSkqrq6vKyspqamqBgYGckC4AAAAACnRSTlMAHEb/yDqu8TdN02L+YQAABGVJREFUeNrdm+uCsyoMRaetVceCCOpUff8HPU35KHLR4gXEs39OVdYQSAKEnx9Nl0ue/3pSnl8uP990KMD1miSZZyXJ9ToPkHhufwoAGi8CyQpxORbges2yEE1j3LYYF0WWaQihARIV4H733/0YE1KWVYVQWXIz3O/xAKSp/8brGqHbW1UFRiiKNI0F4H7nf1BFKXmrbSm1/e4uSstSNM5FCMf6Z4TDAewGaBr+MHqpquq6LAlZA0JIVd008WH4McLBAJeLfQoSor8GIEsxmkbtfHUYJskrPPsEwC4AeW53wm1rexUw6toVwt48fINS+D3L8vx4gN9fOwCl9pe5AEJ1NUJjI05+AbXtJgC0EQC5ABS4rm8zgqBCads2TVnWdfURTNimadspE45d0SwAXgyA9gUoirK8fRE4qaW/cDXNGQBmRvFmnQMAYzOM7CWnQXg4gMsw/L8DzDuT9XJzxR4Bbq4A39zx+h5wCMdRAPhyRiIlOwOAHyOItPwMAH6mIg9FZwHY4pAR+nvrhmyTMCAAOgIAoWFg7PESe6nvJURYALYZwDYREer751t698onns+HoudTPrloEO4DwNYDmEu0vz9uW/M/kxqGhyb26PtVjmgegDkDPNYC6I5I/f9BXacjICSeYWwYwFzqcwuCUQQA6lYNQl03sivjDQ2DbiTxBP+Fv8WYAFiQkEQHID8NnQuuFj6tG0E+xYcoNwljr6hweoC+lwC8UfiL7NwPAJND9PkUMUGawDEtNwGGD0A3D/DwBDDuAQgw3OXqAHIa2qfrBhMM4QFURzTuXDkNTVcke0o+K4bgQgA6CcDCAKjbFKojUt3NbDhm42fqeoEr9gFQLQLQUjKXYCSSlq5jb3Wd7P7F4bg4HkA/unDJiOR2JSRt+iQVG90rAXpngNs+ANTYroOUez4pnZOYA84A+GgAeYS35w7ZuQD226ZASCxK4gPAGM8cUlO6x8Y1HPOM29AB8GEAGPPiCn7kxMtMzLxgKwJ0v/rleAD0xYf9cJbSLUNRP+qMDcBcXoIpzOnYNMsNAabVOz82AP5hM2zaXls2GOdLHrwDIFcAUWZGCBxFjzfUVMcBoEvCr/p27ABThUcigYTOXzoNYfCJTUl3AKwAoPAAWvkRTyGXdv63CR0/wNjx1rVZjrYlDTkLgExCIDjtm4qdBWDfAyt5THEmALxrCYNpBId1wcEA+x5dS6d+FgDXxYgoe4WUHgSlbWYp13hReg4AWKx8TzahdI8QvfQZFnmQ3ggYwDOT8tgB5sMvBFm30tbXops6JaWeAPBKgGknDKFpPtFyVxwA9sLmqQHoXtS8CQCHBLAVt9uLmqeWmOs1WV0fFMB2wcFW2g9lzHtffpm8YREYwLzkogNUlc2Rbr/8M3nLJjCAaYSxG/LT+SMDRAGgX3aTm9P2bZp9puDMbbvgACYCLEf5tm1RBGg+AgBASFM/nW1OvzQ1mo8AIMzF58Th5nV20M3r8eV3f3K8fR8S4D/eG/opuPbAOQAAAABJRU5ErkJggg==";

					let zbzsgd = "120";
					let zbzszy = "25";
					let zbzsdx = "0.6";


					let ywylbkd = "350";
					let ywylbgd = "125";
					let ywylbzy = "5";
					let ywylbdx = "1";
					let ywylbjl = "33.3";

					function createMenuhttps() {
						let wdhttps = document.createElement("div");
						wdhttps.id = "wdhttps";
						wdhttps.title = "小主 摸摸我呗 又不会怀孕的"
						wdhttps.setAttribute('style', 'top:' + zbzsgd + 'px!important;left:' + zbzszy + 'px!important;zoom:' + zbzsdx + '!important;font-size:15px;width:35px;height:35px;line-height:35px;text-align:center;background-size:100% 100%;background-image:url(' + vipjxzstb + ');text-align:center;background-color:transparent;overflow:hidden;user-select:none;position:absolute;z-index:170403;bottom:280px;border-radius:10px');
						wdhttps.onclick = function() {
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
						document.body.appendChild(wdhttps);
					};
					createSelecthttps(https);
					createMenuhttps();
					const wdqcsjjk2 = document.querySelectorAll('ul#httpsvipul li');
					for (let wdqcsjjk2i = 0; wdqcsjjk2i < wdqcsjjk2.length; wdqcsjjk2i++) {
						const wdqcsjjk2msa = wdqcsjjk2[wdqcsjjk2i].querySelectorAll('a4');
						for (let wdqcsjjk2ia = 0; wdqcsjjk2ia < wdqcsjjk2msa.length; wdqcsjjk2ia++) {
							if (wdqcsjjk2msa[wdqcsjjk2ia].innerText.match(/(?:捐献|反馈)/g)) {
								wdqcsjjk2[wdqcsjjk2i].setAttribute('style', 'display:none!important');
							}
						};
					};
					document.head.insertAdjacentHTML('beforeend', '<style>ul#httpsvipul>li{margin:-4px 0px}ul#httpvipul>li{margin:-4px 0px}ul#httpsvipul{width:' + ywylbkd + 'px!important;top:' + ywylbgd + 'px!important;left:' + ywylbzy + 'px!important;zoom:' + ywylbdx + '!important;position:fixed;z-index:2147483647!important;font-size:13px;user-select:none;color:black;transition:all .5s ease 0s;overflow:hidden}ul#httpsvipul>li{width:' + ywylbjl + '%!important}ul#httpsvipul>li{color:black;display:flex;cursor:pointer;float:left;line-height:25px;padding:0;font-size:17px;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize;text-decoration:none;vertical-align:baseline;position:relative;zoom:.6}ul#httpsvipul>li>span{text-align:center;font-weight:bold;color:black;display:inline-block;padding:5px;margin:5px;font-size:18px;line-height:1;border:1px solid #fcfcfc;border-radius:3px;text-decoration:none;background-color:blanchedalmond;width:100%;box-shadow:1px 1px 4px #444,inset -2px -2px 4px #fff,inset 2px 2px 4px #aaa}ul#httpsvipul>li>span:hover{border-style:dashed!important;background-color:rebeccapurple!important;color:red!important}wswdshhjd#wswdshhjd>sapn:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul>a:hover{border-style:dashed!important;background-color:rebeccapurple!important;color:aliceblue!important}ul#httpsvipul>a:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul .wswdshhjd{color:red!important;background-color:darkblue!important;box-shadow:rgba(255,254,255,0.6) 0 .3em .3em inset,rgba(0,0,0,0.15) 0 -0.1em .3em inset,darkblue 0 .1em 3px,darkblue 0 .3em 1px,rgba(0,0,0,0.2) 0 .5em 5px!important}ul#httpsvipul .wswdshhjd a1{color:cyan!important}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold;}</style>');
				} else {
					function createMenuhttps() {
						var wdhttps = document.createElement("div");
						wdhttps.id = "wdhttps";
						wdhttps.innerHTML = '<div title="点击 此按钮 弹出 原网页解析 接口选择"><svg style="width:65.5px;height:48.5px;position:fixed;bottom:404px;zoom:0.5;right:0.5vmin;z-index:100000;text-align:center;line-height:48.5px;font-size:20.8px;border-radius:10.3px;cursor:pointer;"</svg>;<svg viewBox="128 128 256 256"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6z"/><path d="M222.2 303.4v-94.6l90.7 47.3L222.2 303.4z" fill="#18222d"/></svg>';
						wdhttps.setAttribute("style", "color:#008000;fill:#008000;");
						wdhttps.onclick = function() {
							let httpsvipul = document.getElementById("httpsvipul");
							httpsvipul.setAttribute('tabindex', '1');
							let redHide = document.getElementById('httpsvipul');
							(function() {
								let pdjqjssfczobj_counter = 0;
								let pdjqjssfczobj_jiankong = setInterval(function() {
									let pdjqjssfczobj_btn = document.querySelector("script#wudanjqjs");
									if (pdjqjssfczobj_btn) {
										$('ul#httpsvipul>li').click(function() {
											if (document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2") == null) {} else {
												let pchttpsjksz = document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2").textContent;
												localStorage.setItem("pchttpsjk", pchttpsjksz)
											}
										});
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
								document.querySelector("#wdhttps").click();
							});
							if (httpsvipul.style.display == "none") {
								httpsvipul.style.display = "block";
								this.style.cssText += "color:#cd7f32;fill:#cd7f32;background:0"
							} else {
								httpsvipul.style.display = "none";
								this.style.cssText += "color:#fff;fill:#008000;background:0"
							}
						};
						document.body.appendChild(wdhttps)
					};
					createMenuhttps();
					createSelecthttps(https);
					const wdqcsjjk1 = document.querySelectorAll('ul#httpsvipul li');
					for (let wdqcsjjk1i = 0; wdqcsjjk1i < wdqcsjjk1.length; wdqcsjjk1i++) {
						const wdqcsjjk1msa = wdqcsjjk1[wdqcsjjk1i].querySelectorAll('a1');
						for (let wdqcsjjk1ia = 0; wdqcsjjk1ia < wdqcsjjk1msa.length; wdqcsjjk1ia++) {
							if (wdqcsjjk1msa[wdqcsjjk1ia].innerText.match(/(?:搜索|跳转|[小大]窗)/g)) {
								wdqcsjjk1[wdqcsjjk1i].setAttribute('style', 'display:none!important');
							}
						};
					};
					if (!obj.match(/^https?:\/\/m\.iqiyi\.com\//)) {
						const wdqcsjjk2 = document.querySelectorAll('ul#httpsvipul li');
						for (let wdqcsjjk2i = 0; wdqcsjjk2i < wdqcsjjk2.length; wdqcsjjk2i++) {
							const wdqcsjjk2msa = wdqcsjjk2[wdqcsjjk2i].querySelectorAll('a4');
							for (let wdqcsjjk2ia = 0; wdqcsjjk2ia < wdqcsjjk2msa.length; wdqcsjjk2ia++) {
								if (wdqcsjjk2msa[wdqcsjjk2ia].innerText.match(/(?:m1907|专用|捐献|反馈)/g)) {
									wdqcsjjk2[wdqcsjjk2i].setAttribute('style', 'display:none!important');
								}
							};
						};
					} else {
						const wdqcsjjk2 = document.querySelectorAll('ul#httpsvipul li');
						for (let wdqcsjjk2i = 0; wdqcsjjk2i < wdqcsjjk2.length; wdqcsjjk2i++) {
							const wdqcsjjk2msa = wdqcsjjk2[wdqcsjjk2i].querySelectorAll('a4');
							for (let wdqcsjjk2ia = 0; wdqcsjjk2ia < wdqcsjjk2msa.length; wdqcsjjk2ia++) {
								if (wdqcsjjk2msa[wdqcsjjk2ia].innerText.match(/(?:m1907|专用)/g)) {
									wdqcsjjk2[wdqcsjjk2i].setAttribute('style', 'display:none!important');
								}
							};
						};
					}
					document.head.insertAdjacentHTML('beforeend', '<style>wswdshhjd#wswdshhjd>sapn:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul>a:hover{border-style:dashed!important;background-color:rebeccapurple!important;color:aliceblue!important}ul#httpsvipul>a:active{box-shadow:none!important;background-color:cornflowerblue!important}ul#httpsvipul .wswdshhjd{color:red!important;background-color:darkblue!important;box-shadow:rgba(255,254,255,0.6) 0 .3em .3em inset,rgba(0,0,0,0.15) 0 -0.1em .3em inset,darkblue 0 .1em 3px,darkblue 0 .3em 1px,rgba(0,0,0,0.2) 0 .5em 5px!important}ul#httpsvipul .wswdshhjd a1{color:cyan!important}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold}ul#httpsvipul span[style^="background-color"]{background-color:transparent!important}</style>');
				}
				setInterval(() => {
					let a = document.querySelectorAll('ul#httpsvipul>li>span');
					let l = a.length;
					for (let i = 0; i < l; i++) {
						a[i].onclick = function() {
							for (let j = 0; j < l; j++) {
								if (this == a[j]) {
									this.className = "wswdshhjd"
								} else {
									a[j].className = ""
								}
							}
						}
					}
				}, 2345)
			})();
		} else {}
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
				try {
					(function() {
						'use strict';
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
						addListeners()
					})();
				} catch (e) {
					(function() {
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
					})();
				}
			})();
		};

		function zdbt() {
			let wdzdws = document.title.replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1");
			let wdzdwsjs = document.title.replace(/\s+?/, "").replace(/会员\w+?版/, "").replace(/^(?!.*?(?:(?:\s*?[\-\—\_<《\(（]\s*?)?[^\s:：]+?\d{1,3}?\s*?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?)|(?:第\s*?.{1,3}|20\d{4,})\s*?[部季集话部期]|第\s*?\d{4}-\d{2}-\d{2}\s*?[部季集话部期]|先导片|彩蛋|看点|花絮|预告|神剧亮了)).*?$/, "").replace(/^(?:\s*?[\-\—\_<《\(（]\s*?)?[^\s:：]+?(\d+?\s*?)(?:\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|神剧亮了|[部季集话部期]\s*?[上下]|第\s*?.{1,3}\s*?[部季].*?第\s*?\d{4}-\d{2}-\d{2}\s*?期)).*((?:(?:第\s*?.{1,3}|(?:第\s*?|\s+?)20\d{4,})\s*?(?<![\-_])[部季集话部期])).*?$/i, "$1").replace(/.+?(先导片|彩蛋|看点|花絮|预告|神剧亮了|第\s*?.{1,3}\s*?[部季集话部期]\s*?[上下][部季集话部期]?).*?$/, "$1").replace(/^[^:：]+?(20\d{6})\s*?(期).*$/, "第$1$2").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|神剧亮了|[部季集话部期]\s*?[上下])).+?(第)\s*?(\d{4})-(\d{2})-(\d{2})\s*?([期]).*?$/, "$1$2$3$4$5");
			if (wdzdwsjs == null || wdzdwsjs == undefined || wdzdwsjs == '') {
				document.title = wdzdws + wdzdwsjs;
			} else {
				document.title = wdzdws + '：' + wdzdwsjs;
			}
		};

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

		function ggobj(wdggobj) {
			setTimeout(function() {
				if (document.querySelector(wdggobj)) {
					try {
						document.querySelector(wdggobj).remove()
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
				} else {
					(function() {
						"use strict";
						let selector;

						const selectorbilibilia = {
							on: "i[name*='off'][data-text='关闭弹幕']",
							off: "i[name*='off'][data-text='打开弹幕']",
						};
						const selectorbilibilib = {
							on: "input[class='bui-switch-input']:checked",
							off: "input[class='bui-switch-input']:not(:checked)",
						};
						const selectorbilibilic = {
							on: "i[name*='close'][data-text='关闭弹幕']",
							off: "i[name*='on'][data-text='打开弹幕']",
						};

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
						if (document.location.hostname === "player.bilibili.com") {
							selector = selectorbilibilia;
						} else if (window.location.href.match(/^https?:\/\/www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|.*?video)\//)) {
							selector = selectorbilibilib;
						} else if (window.location.href.match(/^https?:\/\/www\.bilibili\.com\/blackboard\/html5player\.html\?aid=/)) {
							selector = selectorbilibilic;
						} else if (window.location.href.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
							selector = selectoracfuna;
						} else if (window.location.href.match(/^https?:\/\/v\.youku\.com\/v_show\/id_/)) {
							selector = selectoryoukua;
						} else if (window.location.href.match(/^https?:\/\/v\.qq\.com\/x\/cover\//)) {
							selector = selectorqqa;
						} else if (window.location.href.match(/^https?:\/\/www\.mgtv\.com\/b\//)) {
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

			function iqiyizqxj() {
				function iqiyizdjddj() {
					if (!window.location.href.match(/html$/)) {
						if (document.querySelector("li.select-item.selected>a")) {
							if (document.querySelector("li.select-item.selected>a").href.match(/^http/)) {
								window.location.href = document.querySelector("li.select-item.selected>a").href.replace(/html\?.*?$/, "html");
							} else {
								window.location.href = window.location.href.replace(/html\?.*?$/, "html");
							}
						} else if (document.querySelector("li.select-item.selected div.select-title>a")) {
							if (document.querySelector("li.select-item.selected div.select-title>a").href.match(/^http/)) {
								window.location.href = document.querySelector("li.select-item.selected div.select-title>a").href.replace(/html\?.*?$/, "html");
							} else {
								window.location.href = window.location.href.replace(/html\?.*?$/, "html");
							}
						}
					};
				};
				if (!document.querySelector("#vip_iframe__") && document.querySelector('ul[class$="-episode-txt"]')) {
					var qisdjx = document.querySelector('ul[class$="-episode-txt"]');
					qisdjx.onclick = function(e) {
						setTimeout(iqiyizdjddj, 666);
					};
				} else if (!document.querySelector("#vip_iframe__") && document.querySelector('ul[class$="-episode-num"]')) {
					var qisdjx = document.querySelector('ul[class$="-episode-num"]');
					qisdjx.onclick = function(e) {
						setTimeout(iqiyizdjddj, 666);
					};
				} else if (!document.querySelector("#vip_iframe__") && document.querySelector('ul[class$="-episodes-list"]')) {
					var qisdjx = document.querySelector('ul[class$="-episodes-list"]');
					qisdjx.onclick = function(e) {
						setTimeout(iqiyizdjddj, 666);
					};
				} else {}
			}; if (wdpcobj) {

				function pcyouku() {
					zdztsp();
					autoClickElement("div.control-icon.control-play-icon.control-pause-icon>span.iconfont.icon-pause", undefined, true);
					remove('#toast_text,#vip_limit_content,#vip_limit_content>div.vip_limit_button_box,.vip_player_payment_toast,div.drm-error-layer,div.preplay-layer>img[src*="/"]');
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
					iqiyizqxj();
					zdztsp();
					remove('.qy-player-vippay-popup,#flashbox>iqpdiv iqpdiv.iqp-bottom,#flashbox>iqpdiv iqpdiv.iqp-layer,[data-player-hook="error"]');
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
					remove('div.sc-content.clearfix,.sc-content,div.pay-mod-notlogin>div.notlogin-login,#pDialog');
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
									if (obj.match(/^https?:\/\/v\.youku\.com\/v_show\/id_/)) {
										if ($("#toast_text:contains('看'):contains('会员')")[0]) {
											pcyouku();
											console.log("%c柠檬汁凝-优酷会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#vip_limit_content:contains('看'):contains('完整')")[0] && $("#vip_limit_content>div.vip_limit_button_box>a:contains('开通')")[0]) {
											pcyouku();
											console.log("%c柠檬汁凝-优酷会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#toast_text:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c柠檬汁凝-优酷会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("#vip_limit_content:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c柠檬汁凝-优酷会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".vip_player_payment_toast p:contains('看'):contains('费')")[0]) {
											pcyouku();
											console.log("%c柠檬汁凝-优酷会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("#ykPlayer>div.youku-film-player>video") && !document.querySelector("div.youku-layer-logo") && document.querySelector('div.preplay-layer>img[src*=".ykimg.com/"][style^="display:"][style*="block"]')) {
											if ($("div.drm-error-layer div.note_normal_tit:contains('版权'):contains('加密'):contains('不支持')")[0] && document.querySelector('div.preplay-layer>img[src*="/"]')) {
												pcyouku();
												console.log("%c柠檬汁凝-优酷会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else {}
										} else {}
									} else if (obj.match(/^https?:\/\/video\.tudou\.com\/v\//)) {
										if ($("div.information-tips:contains('看'):contains('会员')")[0]) {
											pctudou();
											console.log("%c柠檬汁凝-土豆会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("div.vip_info:contains('看'):contains('会员')")[0]) {
											pctudou();
											console.log("%c柠檬汁凝-土豆会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\//)) {
										if ($("txpdiv.txp_alert_info txpdiv:contains('试看')")[0] && $("txpdiv.txp_alert_info txpdiv a:contains('会员')")[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("div.wrapper.mod_vip_popup") && $("div.wrapper.mod_vip_popup div.mod_hd>h1:contains('会员'):contains('看')")[0] && $("div.wrapper.mod_vip_popup div.mod_bd div.mod_pay a:contains('会员')")[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("#video_scroll_wrap div.mod_episode") && $("txpdiv.txp_ad_inner txpdiv.txp_ad_control txpdiv.txp_ad_skip_text:contains('关闭'):contains('广告')")[0] && $("#_vip_player_sec a:contains('会员'):contains('看')")[0]) {
											let qqggbtn = document.querySelector("txpdiv.txp_ad_inner txpdiv.txp_ad_control button");
											if (qqggbtn) {
												qqggbtn.click();
												qqggbtn.remove();
												pcqq();
											} else {}
											console.log("%c柠檬汁凝-腾讯会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!(document.querySelector("#video_scroll_wrap div.mod_episode") || $("#video_scroll_wrap>div.mod_text_tabs>a.tab_item.current:contains('往期')")[0]) && $("#_vip_player_sec a:contains('会员')")[0] && $("#_vip_player_sec a:contains('购买')")[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("txpdiv.txp_video_error>txpdiv.txp_error_title>span:contains('版权'):contains('加密'):contains('不支持'):contains('播放')")[0] && $("txpdiv.txp_video_error>txpdiv.txp_error_code:contains('错误'):contains('反馈')")[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".content h1:contains('会员'):contains('超前'):contains('点播')")[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('txpdiv[data-role*="tips"][data-role*="text"]:contains("试看"):contains("分钟")')[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-07-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[data-role*="txp-ui-tips"]:contains("版权"):contains("购买")')[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-08-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[data-role^="txp-ui-tips"]:contains("会员"):contains("看")')[0]) {
											pcqq();
											console.log("%c柠檬汁凝-腾讯会员自动解析-09-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/(?:ww)?w\.mgtv\.com\/b\//)) {
										if ((mgzdgq == 1 || mgzdgq == 2) && document.querySelector(".m-player-h5-new .u-control-clarity .btn") && document.querySelector(".m-player-h5-new .u-control-clarity .btn").innerText.match(/^\s*?自动\s*?$/)) {
											if (mgzdgq == 1) {
												if (document.querySelector('a[data-name="超清"][data-purview="true"]')) {
													document.querySelector('a[data-name="超清"][data-purview="true"]').click();
													console.log("%c柠檬汁凝-芒果自动选择超清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
													document.querySelector('a[data-name="高清"][data-purview="true"]').click();
													console.log("%c柠檬汁凝-芒果自动选择高清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else {
													document.querySelector('a[data-name="标清"][data-purview="true"]').click();
													console.log("%c柠檬汁凝-芒果自动选择标清清-00-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												}
											} else if (mgzdgq == 2) {
												if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
													document.querySelector('a[data-name="高清"][data-purview="true"]').click();
													console.log("%c柠檬汁凝-芒果自动选择高清-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												} else {
													document.querySelector('a[data-name="标清"][data-purview="true"]').click();
													console.log("%c柠檬汁凝-芒果自动选择标清清-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												}
											}
										} else if (mgzdgq == 0) {}
										if (vipzdjx == 2) {
											if ($("div.control-tips-line>p:contains('费'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state>mango-center-state-error h2:contains('版权'):contains('限制')")[0] && $("mango-center-state>mango-center-state-error p:contains('扫码'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state div.m-player-paytips-title:contains('费'):contains('看')")[0] && $("mango-center-state div.m-player-paytips-buttons.onerow a:contains('费'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-control-tip p:contains('看'):contains('分钟')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-04-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($(".m-player-paytips-wrapper div.m-player-paytips-title:contains('会员'):contains('看')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-05-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else if ($("mango-center-state-payment:contains('购买')")[0]) {
												pcmgtv();
												console.log("%c柠檬汁凝-芒果TV会员自动解析-06-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} else {}
										} else {}
									} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
										if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i+a")) {
											pciqiyi();
											console.log("%c柠檬汁凝-爱奇艺会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv>a") && document.querySelector("#rightPlayList>div.side-content>article a")) {
											pciqiyi();
											console.log("%c柠檬汁凝-爱奇艺会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("div.qy-player-vippay-popup div.popup-main>p") && document.querySelector("div.qy-player-vippay-popup a.vippay-btn")) {
											pciqiyi();
											console.log("%c柠檬汁凝-爱奇艺会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
										if (!$("#player_vipTips:contains('以上画质')")[0] && $("#player_vipTips p:contains('会员'):contains('看')")[0]) {
											pctvsohu();
											console.log("%c柠檬汁凝-搜狐电视会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
										if ($("div.x-dash-tip-panel>span:contains('看'):contains('分钟')")[0]) {
											pcfilmsohu();
											console.log("%c柠檬汁凝-搜狐电影会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($('[class="x-tip-btn x-tip-vip"]:contains("购买")')[0]) {
											pcfilmsohu();
											console.log("%c柠檬汁凝-搜狐电影会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
										if ($("div.playbox_vip_tip_bg.j-vipTip:contains('会员'):contains('看')")[0]) {
											pcle();
											console.log("%c柠檬汁凝-乐视会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($("div.hv_tip1.js-tip:contains('看'):contains('会员')")[0]) {
											pcle();
											console.log("%c柠檬汁凝-乐视会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
										if ($(".w-tips-content span:contains('费'):contains('看')")[0]) {
											pcpptv();
											console.log("%c柠檬汁凝-PPTV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
										if ($("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("div.pay-mod-notlogin>div.notlogin-login:contains('会员'):contains('看')")[0]) {
											pcyjlw();
											console.log("%c柠檬汁凝-1905会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (document.querySelector("#pDialog") && $("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("#pSidebar>div.sb-content>div.sb-mod-pay p:contains('版权'):contains('二维码'):contains('下载'):contains('看')")[0]) {
											pcyjlw();
											console.log("%c柠檬汁凝-1905会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if (!document.querySelector("div.sc-content.clearfix.hidden") && $("div.clearfix.rightCon_player>div.style_one.clearfix>p>a:contains('开通'):contains('会员')")[0] && $("div.sc-content.clearfix:contains('看'):contains('会员'):contains('完整')")[0]) {
											pcyjlw();
											console.log("%c柠檬汁凝-1905会员自动解析-03-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
										if ($("#flashContent ws-tipinfo :contains('费'):contains('看')")[0]) {
											pcwasu();
											console.log("%c柠檬汁凝-华数TV会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else {}
									} else if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
										if ($("#player_mask_module div.twp-title:contains('会员'):contains('看')")[0] && $("#player_mask_module div.twp-btns:contains('会员')")[0]) {
											pcbilibili();
											console.log("%c柠檬汁凝-哔哩哔哩会员自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										} else if ($(".bilibili-player-video-toast-item .video-float-hint-text:contains('会员'):contains('看')")[0]) {
											pcbilibili();
											console.log("%c柠檬汁凝-哔哩哔哩会员自动解析-02-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
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
										remove('section.openMembershipBtn');
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
										remove('li.r share statistic');
										zddj();
									};

									function sjqq() {
										zdztsp();
										remove('a[open-app]');
										zddj();
									};
									if (obj.match(/^https?:\/\/m\.youku\.com\/.+?\/id_/)) {
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
										if (document.querySelector("li.r share statistic")) {
											sjwasu();
										} else {}
									} else if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/(?:(?:.+?\/)?cover\/\w+?\/(?:(?![^\/]+?[\?&][cv]id=)\w+?\.htm|\w+?\.html\?vid=\w+$)|.+?[\?&](?:cid=[^\/]+?&vid=|cid=\w+?$))/)) {
										if (document.querySelector('a[open-app]')) {
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
							let zdjkhttpsjk_btn = document.querySelector("#httpsvipul>li:last-of-type");
							if (zdjkhttpsjk_btn) {
								try {
									$('ul#httpsvipul>li').click(function() {
										if (document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2") == null) {} else {
											let pchttpsjksz = document.querySelector("ul#httpsvipul>li>span.wswdshhjd>a2").textContent;
											localStorage.setItem("pchttpsjk", pchttpsjksz)
										}
									})
								} catch (e) {}
								clearInterval(zdjkhttpsjk_jiankong);
								return false
							}++zdjkhttpsjk_counter;
							if (zdjkhttpsjk_counter > 20) {
								clearInterval(zdjkhttpsjk_jiankong);
								return false
							}
						}, 500)
					})();
				} else {} if (vipzdjx == 1) {
					if (!document.querySelector('div#vip_iframe__')) {
						if (obj.match(/^https?:\/\/v\.youku\.com\/v_show\/id_/)) {
							zdztsp();
							autoClickElement("div.control-icon.control-play-icon.control-pause-icon>span.iconfont.icon-pause", undefined, true);
							zddj();
							console.log("%c柠檬汁凝-优酷全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/v\.qq\.com\/x\/cover\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-腾讯全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.mgtv\.com\/b\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-芒果TV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-搜狐电视全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-搜狐电影全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-乐视全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-PPTV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-1905全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.wasu\.cn\/Play\/show\/id\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-华数TV全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
							zdztsp();
							zddj();
							console.log("%c柠檬汁凝-哔哩哔哩全局自动解析-01-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
						} else {}
					}
				} else if (vipzdjx == 0) {}
				if (vipjxss == 1 && wdpcobj && !tcdpaichuobj && !bilibilipcliwaiobj) {
					(function() {
						let wdzdwss = document.title.replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1");
						let maomibtn = document.createElement("div");
						maomibtn.innerHTML = '<div class="maomibtn"><ul><li><a class="maomi">丹</a><ul><li><a href="http://wpa.qq.com/msgrd?v=3&amp;uin=1160554430&amp;site=qq&amp;menu=yes" target="_blank" style="background-color:red;">问题反馈</a></li><li><a href="http://www.zuidazy4.com/index.php?m=vod-search&wd=' + wdzdwss + '" target="_blank">最大网</a></li><li><a href="http://www.bumimi.top/search/' + wdzdwss + '" target="_blank">布米米</a></li>' +

						'<li><a href="https://www.cupfox.com/search?key=' + encodeURIComponent(wdzdwss) + '" target="_blank">茶杯狐</a></li>' + '<li><a href="https://www.zhenbuka.com/vodsearch/-------------/?wd=' + encodeURIComponent(wdzdwss) + '&submit=" target="_blank">真不卡</a></li>' + '<li><a href="https://www.duboku.co/vodsearch/-------------.html?wd=' + encodeURIComponent(wdzdwss) + '&submit=" target="_blank">独播库</a></li>' + '<li><a href="https://www.k1080.net/sou/-------------.html?wd=' + encodeURIComponent(wdzdwss) + '&submit=" target="_blank">1080影视</a></li>' + '<li><a href="https://www.jiaomh.com/search.php?searchword=' + encodeURIComponent(wdzdwss) + '" target="_blank">麻花影视</a></li>' + '<li><a href="http://www.redbean.top/search?key=' + encodeURIComponent(wdzdwss) + '" target="_blank">红豆影视</a></li>' + '<li><a href="http://ivi.bupt.edu.cn/" target="_blank" style="background-color:yellow;">电视直播</a></li>' + '<li><a href="http://www.asys.vip/kuaishou/" target="_blank" style="background-color:yellow;">随机小姐姐</a></li>' +

						'<hr><li id="vipjxtbli" style="display:none;"><a id="vipjxtb" style="color:beige;">显示图标</a></li><li id="mgzdgqli" style="display:none;"><a id="mgzdgq" style="color:beige;">超清画质</a></li><li id="gbdmobjli" style="display:none;"><a id="gbdmobj" style="color:beige;">关闭弹幕</a></li><li id="vipzdjxli" style="display:none;"><a id="vipzdjx" style="color:beige;">解析会员</a></li><li id="vipzdjxhyli" style="display:none;"><a id="vipzdjxhy" style="color:beige;">解析会员</a></li><li id="zdwbffsli" style="display:none;"><a id="zdwbffs" style="color:beige;">直链播放</a></li><li id="zdwbyjkli" style="display:none;"><a id="zdwbyjk" style="color:beige;">默认接口</a></li><li id="lkzdztbyli" style="display:none;"><a id="lkzdztby" style="color:beige;">自动暂停</a></li><li id="wdqyjxli"><hr><a href="http://img.social/2020/10/25/c1963d9b34970.jpg" target="_blank" style="background-color:black;color:aliceblue;">\u53cb\u60c5\u6350\u732e</a></li></ul></li></ul></div>';
						document.body.appendChild(maomibtn);
						let style = document.createElement("style");
						style.type = "text/css";
						style.innerHTML = ".maomibtn{font-family:arial,sans-serif;padding:0;margin:50px;z-index:170403;position:absolute;top:35px!important;zoom:0.8!important;right:-45px;font-size:30px}.maomibtn ul{padding:0;margin:0;list-style-type:none}.maomibtn ul li{float:left;position:relative;list-style-type:none}.maomibtn ul li a,.maomibtn ul li a:visited{display:block;text-align:center;text-decoration:none;width:100px;height:30px;color:#000;border:2px solid #4CAF50;background:#c9c9a7;line-height:30px;font-size:20px}.maomibtn ul li ul{display:none}.maomibtn ul li:hover ul{display:block;position:absolute;top:30px;right:0;width:105px}.maomibtn ul li:hover ul li a{display:block;background:#faeec7;color:#000}.maomibtn ul li:hover ul li a:hover{background:#dfc184!important;color:#000!important}a.maomi{width:25px!important;height:auto!important;border-radius:10px}";
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
										window.location.reload()
									}, 666)
								} else if (this.innerHTML == '解析播放') {
									localStorage.setItem("zdwbffs", "0");
									this.innerText = '直链播放';
									document.querySelector("#zdwbffs").style.backgroundColor = '#268dcd';
									setTimeout(function() {
										window.location.reload()
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
										window.location.reload()
									}, 666)
								} else if (this.innerHTML == '备用接口') {
									localStorage.setItem("zdwbyjk", "0");
									this.innerText = '默认接口';
									document.querySelector("#zdwbyjk").style.backgroundColor = '#268dcd';
									setTimeout(function() {
										window.location.reload()
									}, 666)
								}
							}
						})();
						(function() {
							function vipjxtbxs() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudan" media="screen">div#wdhttps,div.maomibtn{opacity:1}</style>');
							};

							function vipjxtbgb() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudan" media="screen">div#wdhttps,div.maomibtn{opacity:0}div#wdhttps:hover,div.maomibtn:hover{opacity:1}</style>');
							};

							function vipjxtbzs() {
								document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudan" media="screen">div#wdhttps{opacity:1}div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
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
				function viptbwudana() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudana" media="screen">div#wdhttps,div.maomibtn{opacity:0}div#wdhttps:hover,div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbwudana()
				} catch (err) {
					viptbwudana()
				};

				function viptbwudanadsq() {
					if (!document.querySelector("head>style.viptb-wudana")) {
						viptbwudana()
					} else {}
				};
				setTimeout(viptbwudanadsq, 3333)
			} catch (e) {
				function viptbwudana() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudana" media="screen">div#wdhttps,div.maomibtn{opacity:0}div#wdhttps:hover,div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbwudana()
				} catch (err) {
					viptbwudana()
				};

				function viptbwudanadsq() {
					if (!document.querySelector("head>style.viptb-wudana")) {
						viptbwudana()
					} else {}
				};
				setTimeout(viptbwudanadsq, 3333)
			}
		} else if (vipjxtb == 2) {
			try {
				function viptbwudanb() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudanb" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbwudanb()
				} catch (err) {
					viptbwudanb()
				};

				function viptbwudanbdsq() {
					if (!document.querySelector("head>style.viptb-wudanb")) {
						viptbwudanb()
					} else {}
				};
				setTimeout(viptbwudanbdsq, 3333)
			} catch (e) {
				function viptbwudanb() {
					document.head.insertAdjacentHTML("beforeend", '<style class="viptb-wudanb" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
				};
				try {
					viptbwudanb()
				} catch (err) {
					viptbwudanb()
				};

				function viptbwudanbdsq() {
					if (!document.querySelector("head>style.viptb-wudanb")) {
						viptbwudanb()
					} else {}
				};
				setTimeout(viptbwudanbdsq, 3333)
			}
		} else if (vipjxtb == 1) {}
		if (pcliwaiobj) {
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
				default:
					break;
				}

				function zdbmm() {
					try {
						window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]').href, "_blank");
						window.close();
					} catch (e) {}
				};

				function zdzdw() {
					try {
						window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.zuidazy"]').href, "_blank");
						window.close();
					} catch (e) {}
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
					} catch (e) {}
				};

				function ywyjklb() {
					try {
						document.querySelector("div#wdhttps").click();
					} catch (e) {}
				};

				function pyspqp() {
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
						} catch (e) {}
					})();
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
						} catch (e) {}
					})();
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
					document.head.insertAdjacentHTML('beforeend', '<style>li#wdqyjxli{display:none!important;}</style>');
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
								if (!e.target.innerHTML.match(/<wudan /) && !e.target.innerHTML.match(/<iframe /) && e.target.innerText.match(linka) && e.path.length > 4) {
									if ($("#wudan")) {
										$("#wudan").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linka, '<wudan id="wudan" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#wudan\')){$(\'#wudan\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></wudan>');
									window.scrollTo(0, document.querySelector("#wudan").offsetTop);
									return false
								}
							} else {
								const linkb = /^([^$]+?)\$\s*?(https?:\/\/.+?\.m3u8)$/i;
								if (!e.target.innerHTML.match(/<wudan /) && !e.target.innerHTML.match(/<iframe/) && e.target.innerText.match(linkb) && e.path.length > 4) {
									if ($("#wudan")) {
										$("#wudan").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linkb, '<wudan id="wudan" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#wudan\')){$(\'#wudan\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="' + m3u8 + '$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></wudan>');
									window.scrollTo(0, document.querySelector("#wudan").offsetTop);
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
								if (!e.target.innerHTML.match(/<wudan /) && !e.target.innerHTML.match(/<iframe /) && e.target.innerText.match(linka) && e.path.length > 4) {
									if ($("#wudan")) {
										$("#wudan").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linka, '<wudan id="wudan" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#wudan\')){$(\'#wudan\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></wudan>');
									window.scrollTo(0, document.querySelector("#wudan").offsetTop);
									return false
								}
							} else {
								const linkb = /^([^$]+?)\$\s*?(https?:\/\/.+?\.m3u8)$/i;
								if (!e.target.innerHTML.match(/<wudan /) && !e.target.innerHTML.match(/<iframe/) && e.target.innerText.match(linkb) && e.path.length > 4) {
									if ($("#wudan")) {
										$("#wudan").remove()
									} else {}
									e.target.innerHTML = e.target.innerHTML.replace(linkb, '<wudan id="wudan" width="100%" height="500px"><br><div style="background-color:#000"><br><br><div style="display:inline-flex;margin-top:-25px"><h1 style="text-align:center;color:#4caf50;margin-top:75px">正在观看--</h1><a title="点击此图片关闭本视频" href="javascript:void((function(){if($(\'#wudan\')){$(\'#wudan\').remove()}else{}})())"><img style="width:150px;height:150px;border-radius:20px" src="' + img + '"></a><h1 style="text-align:center;color:#4caf50;margin-top:75px">--</h1><h1 style="text-align:center;color:#4caf50;margin-top:75px">资源视频</h1></div><br><br><div style="display:inline-flex"><h1 style="text-align:center;color:magenta">' + title + '</h1><h1 style="text-align:center;color:magenta">$1</h1></div><br><br></div><iframe src="' + m3u8 + '$2" width="100%" height="500px" allowfullscreen="allowfullscreen" data-ad="false" autoLoad="true" autoplay="true" style="border:none!important;outline:none!important"></iframe><br><br></wudan>');
									window.scrollTo(0, document.querySelector("#wudan").offsetTop);
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