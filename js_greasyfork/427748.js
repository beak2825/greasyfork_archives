// ==UserScript==
// @name         手机端vip视频
// @namespace    手机端vip视频
// @version      0.2
// @description  手机端 腾讯视频vip解析自用脚本
// @author       Inspire
// @match        *://m.v.qq.com/*


// @grant        GM_xmlhttpRequest
// @connect      *	

// @downloadURL https://update.greasyfork.org/scripts/427748/%E6%89%8B%E6%9C%BA%E7%AB%AFvip%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/427748/%E6%89%8B%E6%9C%BA%E7%AB%AFvip%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//以下为 Jquery插件


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//以上为 Jquery插件


(function () {
	//动态js加载插件 函数
	function loadJS(url, callback) {

		var script = document.createElement('script'),

			fn = callback || function () {};

		script.type = 'text/javascript';

		//IE

		if (script.readyState) {

			script.onreadystatechange = function () {

				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					fn();
				}

			};
		} else {
			//其他浏览器
			script.onload = function () {
				fn();
			};
		}
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	// loadJS('https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js',function(){
	// 	if (typeof jQuery != 'undefined') {
	// 		alert("jquery加载成功！");
	// 	}
	// 	else {
	// 		alert("jquery加载失败！");
	// 	}
	// });

	window.onbeforeunload = function () {
		return "";
	};


	var play_line_json = [{
			"name": "纯净1",
			"url": "https://z1.m1907.cn/?jx="
		},
		{
			"name": "久播",
			"url": "https://jx.wlssys.xyz/vip.php?url="
		},

		{
			"name": "丝瓜",
			"url": "http://www.asys.vip/jx/?url="
		},

		{
			"name": "月亮云",
			"url": "https://api.yueliangjx.com/?url="
		},

		{
			"name": "全网解析",
			"url": "https://jx.elwtc.com/vip/?url="
		},
		{
			"name": "ckmov",
			"url": "https://www.ckmov.vip/api.php?url="
		},


		{
			"name": "九八看",
			"url": "http://jx.ejiafarm.com/dy.php?url= "
		},

		{
			"name": "旧城",
			"url": "https://jx.9eng.cn/?url="
		},


		{
			"name": "奇米",
			"url": "https://qimihe.com/?url="
		},

		{
			"name": "mpos",
			"url": "https://vip.mpos.ren/v/?url="
		},
		{
			"name": "927jx",
			"url": "https://api.927jx.com/vip/?url="
		},
		{
			"name": "mw0",
			"url": "https://jx.mw0.cc/?url="
		},
		{
			"name": "180超清",
			"url": "https://jx.000180.top/jx/?url="
		},
		{
			"name": "hackmg",
			"url": "https://vip.hackmg.com/jx/index.php?url="
		},
		{
			"name": "B站1",
			"url": "https://vip.parwix.com:4433/player/?url="
		},

		{
			"name": "广告-BL",
			"url": "https://vip.bljiex.com/?v="
		},
		{
			"name": "广告-CK",
			"url": "https://www.ckplayer.vip/jiexi/?url="
		},
		{
			"name": "CHok",
			"url": "https://www.gai4.com/?url="
		},
		{
			"name": "大侠",
			"url": "https://api.10dy.net/?url="
		},

		{
			"name": "爱跟",
			"url": "https://vip.2ktvb.com/player/?url="
		},
		{
			"name": "冰豆",
			"url": "https://api.qianqi.net/vip/?url="
		},
		{
			"name": "百域",
			"url": "https://jx.618g.com/?url="
		},


		{
			"name": "迪奥",
			"url": "https://123.1dior.cn/?url="
		},
		{
			"name": "福星",
			"url": "https://jx.popo520.cn/jiexi/?url="
		},
		{
			"name": "跟剧",
			"url": "https://www.5igen.com/dmplayer/player/?url="
		},
		{
			"name": "RDHK",
			"url": "https://jx.rdhk.net/?v="
		},
		{
			"name": "H8",
			"url": "https://www.h8jx.com/jiexi.php?url="
		},
		{
			"name": "豪华",
			"url": "https://api.lhh.la/vip/?url="
		},
		{
			"name": "黑云",
			"url": "https://jiexi.380k.com/?url="
		},
		{
			"name": "蝴蝶",
			"url": "https://api.hdworking.top/?url="
		},

		{
			"name": "解析la",
			"url": "https://api.jiexi.la/?url="
		},
		{
			"name": "久播1",
			"url": "https://jx.jiubojx.com/vip.php?url="
		},

		{
			"name": "久播2",
			"url": "https://jx.jiubojx.com/vip/?url="
		},

		{
			"name": "九八",
			"url": "https://jx.youyitv.com/?url="
		},
		{
			"name": "老板",
			"url": "https://vip.laobandq.com/jiexi.php?url="
		},
		{
			"name": "乐喵",
			"url": "https://jx.hao-zsj.cn/vip/?url="
		},
		{
			"name": "M3U8",
			"url": "https://jx.m3u8.tv/jiexi/?url="
		},
		{
			"name": "MUTV",
			"url": "https://jiexi.janan.net/jiexi/?url="
		},
		{
			"name": "明日",
			"url": "https://jx.yingxiangbao.cn/vip.php?url="
		},
		{
			"name": "磨菇",
			"url": "https://jx.wzslw.cn/?url="
		},

		{
			"name": "诺讯",
			"url": "https://www.nxflv.com/?url="
		},
		{
			"name": "OK",
			"url": "https://okjx.cc/?url="
		},
		{
			"name": "PM",
			"url": "https://www.playm3u8.cn/jiexi.php?url="
		},
		{
			"name": "思云",
			"url": "https://jx.ap2p.cn/?url="
		},
		{
			"name": "思古",
			"url": "https://api.sigujx.com/?url="
		},
		{
			"name": "思古2",
			"url": "https://api.bbbbbb.me/jx/?url="
		},
		{
			"name": "思古3",
			"url": "https://jsap.attakids.com/?url="
		},
		{
			"name": "tv920",
			"url": "https://api.tv920.com/vip/?url="
		},
		{
			"name": "维多",
			"url": "https://jx.ivito.cn/?url="
		},
		{
			"name": "我爱",
			"url": "https://vip.52jiexi.top/?url="
		},
		{
			"name": "无名",
			"url": "https://www.administratorw.com/video.php?url="
		},
		{
			"name": "小蒋",
			"url": "https://www.kpezp.cn/jlexi.php?url="
		},
		{
			"name": "小狼",
			"url": "https://jx.yaohuaxuan.com/?url="
		},
		{
			"name": "智能",
			"url": "https://vip.kurumit3.top/?v="
		},
		{
			"name": "星驰",
			"url": "https://vip.cjys.top/?url="
		},
		{
			"name": "星空",
			"url": "http://60jx.com/?url="
		},
		{
			"name": "云端",
			"url": "https://jx.ergan.top/?url="
		},
		{
			"name": "云析",
			"url": "https://jx.yparse.com/index.php?url="
		},
		{
			"name": "17云",
			"url": "https://www.1717yun.com/jx/ty.php?url="
		},
		{
			"name": "33t",
			"url": "https://www.33tn.cn/?url="
		},
		{
			"name": "41",
			"url": "https://jx.f41.cc/?url="
		},
		{
			"name": "66",
			"url": "https://api.3jx.top/vip/?url="
		},
		{
			"name": "116",
			"url": "https://jx.116kan.com/?url="
		},
		{
			"name": "200",
			"url": "https://vip.66parse.club/?url="
		},
		{
			"name": "4080",
			"url": "https://jx.urlkj.com/4080/?url="
		},
		{
			"name": "973",
			"url": "https://jx.973973.xyz/?url="
		},
		{
			"name": "8090",
			"url": "https://www.8090g.cn/?url="
		}
	];


	(function () {

		// 初始化点击显示列表
		(function () {
			var showbutton = '<div id=showClick style="position:fixed;top:5%;left:0;background-color:rgba(100,100,100,.6);width:40px;height:40px;z-index:9999;border-radius:50%;color:red;line-height:40px;vertical-align:middle;text-align:center;border:1px #fff solid; box-shadow:0 0 10px 10px rgba(48,55,66,.2);"><span>V</span></div>'
			$('body').append((showbutton));

			var showView_A = '<ul id=showJieXilist style=background-color:rgba(100,100,100,.4);position:fixed;width:100px;height:60%;top:20%;left:0;overflow:scroll;border-radius:3px;padding:0;z-index:999;max-height: 200px;overflow-y:scroll; box-shadow:0 0 10px 10px rgba(48,55,66,.2);></ul>'
			$('body').append((showView_A));


			$('#showJieXilist').hide();


			$('#showClick').bind('click', function (e) {

				$('#showJieXilist').toggle();

			})

			var aView = '  <li style="border: 1px red solid;border-radius: 5px;margin: 3px;color: red;text-align: center;list-style: none;">'
			var bView = '</li>'
			var appendView = ''
			for (let index = 0; index < play_line_json.length; index++) {
				appendView = appendView + aView + play_line_json[index].name + bView
			}
			$('#showJieXilist').append((appendView));



		})();

		(function () {

			var play_url = window.location.href;
			var arr = new Array();
			arr = play_url.split('?')
			var get_url = arr[0];

			var host = location.host;
			var node = "";
			var player_nodes = [{
					url: "v.qq.com",
					node: ".mod_player"
				},
				{
					url: "www.iqiyi.com",
					node: "#flashbox"
				},
				{
					url: "v.youku.com",
					node: "#player"
				},
				{
					url: "w.mgtv.com",
					node: "#mgtv-player-wrap"
				},
				{
					url: "www.mgtv.com",
					node: "#mgtv-player-wrap"
				},
				{
					url: "tv.sohu.com",
					node: "#player"
				},
				{
					url: "film.sohu.com",
					node: "#playerWrap"
				},
				{
					url: "www.le.com",
					node: "#le_playbox"
				},
				{
					url: "video.tudou.com",
					node: ".td-playbox"
				},
				{
					url: "v.pptv.com",
					node: "#pptv_playpage_box"
				},
				{
					url: "vip.pptv.com",
					node: ".w-video"
				},
				{
					url: "www.wasu.cn",
					node: "#flashContent"
				},
				{
					url: "www.acfun.cn",
					node: "#ACPlayer"
				},
				{
					url: "vip.1905.com",
					node: "#player"
				},
				{
					url: "play.tudou.com",
					node: "#player"
				},
				{
					url: "www.bilibili.com/video",
					node: "#bilibiliPlayer"
				},
				{
					url: "www.bilibili.com/bangumi",
					node: "#player_module"
				},

			];

			for (var m in player_nodes) {

				if (get_url.indexOf(player_nodes[m].url) != -1) {
					node = player_nodes[m].node;
				}
			}
			$('#showJieXilist>li').bind('click', function (e) {

				for (let index = 0; index < play_line_json.length; index++) {
					if (play_line_json[index].name === $(this).text()) {
						var iframe_src = play_line_json[index].url + play_url;
					}
				};
				console.log(iframe_src);

				var r = confirm("是否跳转播放？");
				if (r) {
					window.open(iframe_src);

				} else {
					var play_html = "<div style='width:100%;height:150%;margin-top:15%'><iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='playIframe' ; box-shadow:0 0 10px 10px rgba(48,55,66,.2);></iframe> </div>";
					($(node).html());
					$(node).html(play_html);
					$("#playIframe").attr("src", '');
					$("#playIframe").attr("src", iframe_src);

				}
				$('#showJieXilist').toggle();
			})

			if (get_url.indexOf('m.v.qq.com') != -1) { //&& get_url.indexOf('/play') != -1 
				$('body').css({
					'padding': 0,
					'background-color': '#ffffffee'
				})
				$(".site_title >a").removeClass('vip_logo').removeClass('js_logo').removeClass('logo').css(
					{
						'color': '#eeee',
						'font-weight': '800'
					}
				).html('返回首页')


				$('.site_header').css({
					'background-color': '#33333366',
				})

				// $('.mod_source').remove()
				$("[data-index='2']").remove()

				$("[data-index='11']").remove()
				$('.mod_app_banner').remove()
				$("[data-index='10']").remove()
				$('.at-app-banner').remove()
				// $('.site_header').remove()
				// $('.mod_box mod_sideslip_privileges U_box_bg_a').remove()
				// $('.mod_box mod_game_rec').remove()
				$("[data-index='12']").remove()


			}


		})();

	})();


})();