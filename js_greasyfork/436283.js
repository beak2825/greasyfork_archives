	// ==UserScript==
	// @name         战斗吧歌姬！【内群】
	// @homepage     https://greasyfork.org/zh-CN/scripts/436283-%E6%88%98%E6%96%97%E5%90%A7%E6%AD%8C%E5%A7%AC-%E5%86%85%E7%BE%A4
	// @version      8.0.89
	// @description  Bilibili直播间，小心心、天选时刻、实物抽奖、活动抽奖、动态抽奖
	// @author       风绫丨钰袖、荒年、spiritlhl
	// @include      /https?:\/\/live\.bilibili.com/\??.*/
	// @include      /https://www.bilibili.com/blackboard/live/\??.*/
	// @include      /https://space.bilibili.com/\??.*/
	// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
	// @connect      www.bilibili.com
	// @connect      passport.bilibili.com
	// @connect      api.live.bilibili.com
	// @connect      api.bilibili.com
	// @connect      live-trace.bilibili.com
	// @connect      gitee.com
	// @connect      1.117.77.42
	// @connect      1.12.36.165
	// @connect      a.spiritysdx.top
	// @connect      sctapi.ftqq.com
	// @connect      qmsg.zendee.cn
	// @connect      push.ijingniu.cn
	// @connect      api.m.taobao.com
	// @connect      *
	// @require      https://cdn.jsdelivr.net/gh/lzghzr/TampermonkeyJS@55fdb489ce4d3f73c02a4ddec9a6979023b7479c/libBilibiliToken/libBilibiliToken.js
	// @require      https://cdn.jsdelivr.net/gh/lzghzr/TampermonkeyJS@fe2340677328762f9d6e9686603e9781d69cd3c9/libWasmHash/libWasmHash.js
	// @grant        unsafeWindow
	// @grant        GM_notification
	// @grant        GM_getValue
	// @grant        GM_setValue
	// @grant        GM_deleteValue
	// @grant        GM_xmlhttpRequest
	// @grant        GM_openInTab
	// @run-at       document-idle
	// @grant        GM_info
	// @license      MIT License
	// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/436283/%E6%88%98%E6%96%97%E5%90%A7%E6%AD%8C%E5%A7%AC%EF%BC%81%E3%80%90%E5%86%85%E7%BE%A4%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/436283/%E6%88%98%E6%96%97%E5%90%A7%E6%AD%8C%E5%A7%AC%EF%BC%81%E3%80%90%E5%86%85%E7%BE%A4%E3%80%91.meta.js
	// ==/UserScript==

	window.onload =(function ZDBGJ_BLRHH_Plus() {
		if (0) { //1关闭控制台输出0开启
			console.log = () => {};
		}
		var sessions_msg = []
		var qun_server = ['a.spiritysdx.top','1.117.77.42']
		var upupup = []
		var dynamic_lottery_tags_tagid = 0//动态抽奖分组ID
		var tags_mid_list = []//默认分组uid列表
		var XH = 0;
		var parent_area_id = [2,3,6,1,5,9,10,11]//{"网游分区":2},{"手游分区":3},{"单机游戏":6},{"娱乐分区":1},{"电台分区":5},{"虚拟分区":9},{"生活分区":10},{"学习分区":11}
		var MaterialObject = []
		var Xname
		var server_cv_list=[]
		var turn_key_list=[]
		var room_ruid_get = []
		var room_ruid = []
		var tags_name = []
		var tags_tagid = []
		var lowfans_uid = []
		var room_AnchorRecord_time_uid = []//取关uid临时存储
		var space_history_uid = []//取关uid临时存储
		var AnchorRecord_list = []//网络天选数据
		var AnchorRecord_list_msg = []//本地天选数据
		var awardlist_list = []//网络实物数据
		var awardlist_list_msg = []//本地实物数据
		var anchor_name,
			anchor_uid,
			anchor_room,
			award_name,
			end_time,
			anchor_uid1,
			anchor_room1,
			anchor_name1,
			award_name1,
			end_time1,
			anchor_uid2,
			anchor_room2,
			anchor_name2,
			award_name2,
			end_time2
		var guardsListdata = []//大航海数据
		var readConfig = [];
		var Anchor_room_list = [];
		var Anchor_award_id_list = [];
		var Anchor_award_nowdate = [];
		var ALLFollowingList = [];//全部关注
		var medal_sign = true//true则可执行
		var getmsg_mark = true //true则可执行
		var groupmove_mark = true //true则可执行
		var activity_lottery_run_mark = true//true则可执行
		var dynamic_lottery_run_mark = true//true则可执行
		var push_msg_oneday_run_mark = true//true则可执行
		var qq_run_mark = false
		var CZ_delay = true
		var voiceContent_mark = false
		var read_list = []
		var NAME;
		var BAPI;
		var ZBJ;
		var CJ;
		var Lcount; //小心心防异常
		var Live_info = {
			coin: undefined,
			room_id: undefined,
			uid: undefined,
			csrf_token: undefined,
			visit_id: undefined,
			rnd: undefined,
			ruid: undefined,
			uname: undefined,
			user_level: undefined,
			Blever: undefined,
		};
		let getMyJson = function (url) {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					onload: function (response) {
						const res = strToJson((response || {}).responseText)
						resolve(res);
					}
				});
			})
		}
		let strToJson = function (params) {
			const isJSON = (str => {
				if (typeof str === 'string') {
					try {
						const obj = JSON.parse(str);
						return typeof obj === 'object' ? obj : false
					} catch (_) {
						console.log(str);
						return false;
					}
				} else {
					console.log(`${str}\nIt is not a string!`);
					return false;
				}
			})(params);
			return isJSON ? isJSON : {}
		}
		/**
		 * 替换字符串中所有的匹配项
		 * @param oldSubStr 搜索的字符串
		 * @param newSubStr 替换内容
		 */

		const year = () => new Date().getFullYear()
		const month = () => new Date().getMonth() + 1;
		const day = () => new Date().getDate();
		const hour = () => new Date().getHours();
		const minute = () => new Date().getMinutes();
		const second = () => new Date().getSeconds();
		const tz_offset = () => new Date().getTimezoneOffset() + 480;
		const ts_ms = () => Date.now();
		const ts_s = () => Math.round(ts_ms() / 1000);
		const ts_ten_m = () => new Date().getHours() * 6 + Math.round(new Date().getMinutes() / 10) //十分钟误差标记
		const delayCall = (callback, delay = 10e3) => {
			const p = $.Deferred();
			setTimeout(() => {
				const t = callback();
				if (t && t.then)
					t.then((arg1, arg2, arg3, arg4, arg5, arg6) => p.resolve(arg1, arg2, arg3, arg4, arg5, arg6));
				else
					p.resolve();
			}, delay);
			return p;
		};
		function sleep(ms) {
			return new Promise(resolve => setTimeout(() => resolve('sleep'), ms));
		}
		function timestampToTime(timestamp) {
			let date = new Date(timestamp * 1000);
			let Y = date.getFullYear() + '-';
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate() )+ ' ';
			let h = (date.getHours()  < 10 ? '0'+date.getHours() : date.getHours()) + ':';
			let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':';
			let s = (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds());
			return M + D + h + m + s;
		}

		String.prototype.replaceAll = function (oldSubStr, newSubStr) {
			return this.replace(new RegExp(oldSubStr, 'gm'), newSubStr)
		}
		const chatLog = function (text, type = 'info') { //自定义提示
			let div = $("<div class='zdbgjMsg'>");
			let msg = $("<div>");
			let ct = $('#chat-items');
			let myDate = new Date();
			//msg.text(text);
			msg.html(text);
			div.text(myDate.toLocaleString());
			div.append(msg);
			div.css({
				'text-align': 'center',
				'border-radius': '4px',
				'min-height': '30px',
				'width': '256px',
				'color': 'rgb(218, 142, 36)',
				'line-height': '30px',
				'padding': '0 10px',
				'margin': '10px auto',
				'border': '1px solid rgb(203, 195, 255)',
				'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
			});
			msg.css({
				'word-wrap': 'break-word',
				'width': '100%',
				'line-height': '1.5em',
				'margin-bottom': '10px',
			});
			ct.append(div); //向聊天框加入信息
			let ctt = $('#chat-history-list');
			if (GM_getValue('go_down')){
				ctt.animate({
					scrollTop: ctt.prop("scrollHeight")
				}, 0); //滚动到底部
			}
		}
		//手机端删除
		const appToken = new BilibiliToken();
		const baseQuery = `actionKey=appkey&appkey=${BilibiliToken.appKey}&build=5561000&channel=bili&device=android&mobi_app=android&platform=android&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%225.57.0%22%2C%22abtest%22%3A%22%22%7D`;
		let tokenData = JSON.parse(GM_getValue(`${NAME}userToken`, '{}'));
		const setToken = async() => {
			const userToken = await appToken.getToken();
			if (userToken === undefined)
				return console.error(GM_info.script.name, '未获取到token');
			tokenData = userToken;
			GM_setValue(`${NAME}userToken`, JSON.stringify(tokenData));
			return 'OK';
		};
		//手机端删除
		$(function () { //DOM完毕，等待弹幕加载完成
			let space = window.location.href.indexOf('space.bilibili.com') > -1;
			if (space) return console.log('fspace.bilibili.com',new Date())
			let loadInfo = (delay) => {
				if ((typeof BilibiliLive) == "undefined") {
					BilibiliLive = undefined;
				}
				setTimeout(async function () {
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://api.bilibili.com/x/web-interface/nav",
						onload: function(response) {
							let json = JSON.parse(response.response);
							//console.log(json);
							if (!json.data.isLogin) {
								loadInfo(5000);
								chatLog('无账号登陆信息,请先登录或检查网络！');
								console.log('无登陆信息',new Date());
							} else {
								if(BilibiliLive == undefined) return loadInfo(5000);
								if(BilibiliLive.ROOMID == undefined) return loadInfo(5000);
								Live_info.room_id = BilibiliLive.ROOMID;
								Live_info.uid = json.data.mid
								Live_info.coin = json.data.money
								Live_info.Blever = json.data.level_info.current_level
								NAME = Live_info.uid;
								console.log('登陆信息获取成功！',new Date());
								chatLog('登陆信息获取成功！');
								init();
							}
						},
						onerror : function(err){
							loadInfo(5000);
							chatLog('无账号登陆信息,请先登录或检查网络！');
							console.log('无登陆信息',new Date());
						}
					});
				}, delay);
			};
			loadInfo(5000);
		});

		function init() { //API初始化
			$("div.checkin-btn.t-center.pointer").remove()//签到按钮
			let btn7 = $(`<div id='btn7'style="position: absolute; top:55.5px;right:160px;z-index: 999;background-color: #23ade5;color: #fff;border-radius: 4px;border: none;padding: 4.5px;">直播间真实房号：${Live_info.room_id}</div>`);
			$('#head-info-vm').append(btn7);
			if (GM_getValue('2233') == undefined)GM_setValue('2233', true)
			if (GM_getValue('sections') == undefined)GM_setValue('sections', true)

			if(GM_getValue('2233'))$("#my-dear-haruna-vm").remove() //去掉2233 sections-vm
			if(GM_getValue('sections'))$("#sections-vm").remove() //去掉直播画面下方内容

			if (GM_getValue('side_bar') == undefined)GM_setValue('side_bar', true)
			if (GM_getValue('side_bar'))$('.side-bar-cntr').remove()//实验室、关注

			let btn22 = $('<button id="2233" style="position: absolute; top: 415px; right: -60px;z-index:999;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
						  '看板娘</button>');
			$('.chat-history-panel').append(btn22);
			if (!GM_getValue('2233')) {
				$("#2233").css("background-color", "GhostWhite")
			} else {
				$("#2233").css("background-color", "purple")
			}

			btn22.click(function () {
				chatLog('2233显示：灰色显示，紫色关闭显示，刷新生效！');
				if (GM_getValue('2233')) {
					GM_setValue('2233', false)
					$("#2233").css("background-color", "GhostWhite")
				} else {
					GM_setValue('2233', true)
					$("#my-dear-haruna-vm").remove()
					$("#2233").css("background-color", "purple")
				}
			});

			let btn33 = $('<button id="sections" style="position: absolute; top: 445px; right: -60px;z-index:999;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
						  '动态等</button>');
			btn33.click(function () {
				chatLog('直播画面下方内容显示：灰色显示，紫色关闭显示，刷新生效！');
				if (GM_getValue('sections')) {
					GM_setValue('sections', false)
					$("#sections").css("background-color", "GhostWhite")
				} else {
					GM_setValue('sections', true)
					$("#sections-vm").remove()
					$("#sections").css("background-color", "purple")
				}
			});
			$('.chat-history-panel').append(btn33);
			if (!GM_getValue('sections')) {
				$("#sections").css("background-color","GhostWhite")
			} else {
				$("#sections").css("background-color","purple")
			}

			let btn44 = $('<button id="side_bar" style="position: absolute; top: 475px; right: -60px;z-index:999;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
						  '实验室</button>');
			btn44.click(function () {
				chatLog('实验室、关注内容显示：灰色显示，紫色关闭显示，刷新生效！');
				if (GM_getValue('side_bar')) {
					GM_setValue('side_bar', false)
					$("#side_bar").css("background-color", "GhostWhite")
				} else {
					GM_setValue('side_bar', true)
					$('.side-bar-cntr').remove()
					$("#side_bar").css("background-color", "purple")
				}
			});
			$('.chat-history-panel').append(btn44);
			if (!GM_getValue('side_bar')) {
				$("#side_bar").css("background-color","GhostWhite")
			} else {
				$("#side_bar").css("background-color","purple")
			}

			try {
				BAPI = BilibiliAPI;
			} catch (err) {
				console.error(`[${NAME}]`, err);
				return;
			}
			Live_info.csrf_token = BAPI.getCookie('bili_jct');
			Live_info.visit_id = getvisit_id()
			//parent_area_id = [2,3,6,1,5,9,10,11]//{"网游分区":2},{"手游分区":3},{"单机游戏":6},{"娱乐分区":1},{"电台分区":5},{"虚拟分区":9},{"生活分区":10},{"学习分区":11}
			const MY_API = {
				CONFIG_DEFAULT: {
					AUTO_dynamic_create:false,//自动发动态
					AUTO_dynamic_create_ts:0,//时间戳
					AUTO_dynamic_create_flash:30,//分，自动发动态间隔
					detail_by_lid_reset:70000,//直播预约抽奖、动态抽奖起始LID序号
					lottery_result_did_reset:65000,
					detail_by_lid_flash:180,//直播预约抽奖、动态抽奖间隔
					gitee_url:"https://gitee.com/xiaoyyshiye/xiaoyiyi/raw/master/keyword.json",//云屏蔽词数据地址
					AUTO_light:true,//当前佩戴勋章自动勋章点亮
					parent_area_id2:true,
					parent_area_id3:true,
					parent_area_id6:true,
					parent_area_id1:true,
					parent_area_id5:true,
					parent_area_id9:true,
					parent_area_id10:true,
					parent_area_id11:true,
					getmsg_num:1900,//无私信主播取关门槛
					getmsg:false,//无私信主播取关开关
					unignore_to_get_medal_switch:true,//无勋章时，正则关键词，会自动获得勋章，且升级
					bigmoney_switch:false,//无勋章时，奖金多则会自动获得勋章，且升级
					bigmoney:20,//无勋章时，奖金多则开启自动获得勋章，且升级
					do_GOLDBOX:75611,//手动参加实物抽奖
					AUTO_medal_up:true,//有勋章时，自动勋章升级
					AUTO_medal_get_up:false,//无勋章时，自动获得勋章，且升级
					get_following_live:false,//只检索关注的主播
					tags2_min: 0, //低粉下限
					tags4_min: 30, //鸽子下限
					tags5_min: 30, //鸽子下限
					Anchor_danmu_go_r: 0, //手动弹幕抽奖房间号
					Anchor_danmu_go_c: '抽奖', //手动弹幕抽奖内容
					Anchor_danmu_go_check:false,//随机鸡汤
					Anchor_danmu_go_f: 8, //间隔
					Anchor_danmu_go_t: 1, //次数
					fans_switch: false,
					fans_min: 1500,
					money_switch: true,
					money_min: 2,
					medal_ignore_roomid_list: [],
					medal_sign_time_hour: 16,
					medal_sign_time_min: 16,
					AUTO_activity_lottery: true,//自动获取次数
					AUTO_activity_lottery_time_hour: 0,
					AUTO_activity_lottery_time_min: 1,
					GIFT_AUTO: true,
					GIFT_ROOM: 2374828,
					TALK: false, //不显示抽奖反馈
					tu50room: false,
					getroomnum: 30,
					TIMEAREADISABLE: true,
					TIMEAREASTART: 2,
					TIMEAREAEND: 6,
					TOProomnum: 350,
					gift_price: 0,
					Anchor_ignore_keyword: ["大蒜", "点播", "表情", "小游戏", "cos", "看号", "加速器", "优惠", "舰", "抵扣", "返券", "冬日热饮", "一起玩", "星际战甲", "上车", "搭配", "上船", "保温", "写真", "自画像", "自拍", "照", "总督", "提督", "一毛", "禁言", "代金", "通行证", "第五人格", "抵用"],
					Anchor_unignore_keyword:["旗舰手机"],
					Anchor_ignore_uid: [],//手误，这是直播间号
					ignore_room:[],//输入界面存储
					AnchorFLASH: 1000, //天选间隔
					AnchorserverFLASH: 16, //获取服务器天选间隔
					AnchorcheckFLASH: 150, //检索天选间隔
					Anchor_room_send: 0, //手动推送服务器数据房间
					JSMARK: 0, //多开标记
					AUTO_BOX: true, //每日换硬币
					AUTO_COIN: false, //每日视频投币5个
					AUTO_COIN2: false, //每日专栏投币5个
					AUTO_HEART_newmodel: true,
					AUTO_sign_danmu: false, //勋章直播间打卡签到
					medal_level_list: true,//跳过21以上勋章直播间打卡签到
					AUTO_DailyReward: true, //主站登陆、观看、转发经验获取
					materialobject_ts: 0,
					medal_ts: 0,//自动更新勋章数据时间戳
					Following_ts: 0,//自动更新关注数据时间戳
					Anchor_ts: 0,//防止检索停止
					do_lottery_ts: 0,//防止蹭服务器风控停止
					last_aid: 770,
					AUTO_GOLDBOX: false, //金箱子抽奖
					AUTO_GOLDBOX_sever2: false, //金箱子群主的云模式
					AUTO_Anchor: false, //天选时刻抽奖
					dynamic_lottery: false, //关注动态抽奖
					detail_by_lid_live: false, //直播预约抽奖
					detail_by_lid_live_ignore: true, //直播预约抽奖应用屏蔽关键词
					detail_by_lid_dynamic: false, //全部动态抽奖
					COUNT_GOLDBOX: 0, //天选时刻、金箱子抽奖参与次数
					Anchor_cur_gift_num: true, //天选时刻金瓜子参与次数
					switch_sever: false, //服务器服务开关
					sever_modle: true, //天选大号小号伪服务器获取模式开关
					medal_change: false,
					anchor_postdiscuss: 11212391, //屏蔽关键词、屏蔽房间号专栏CV号
					anchor_postdiscuss_switch: false,
					ServerChan_SCKEY: 0, //Server酱微信推送SCKEY
					switch_ServerChan_SCKEY: false, //Server酱微信推送开关
					Qmsg_KEY: 0, //QQ推送开关
					switch_Qmsg_KEY: false, //Qmsg酱推送KEY
					go_cqhttp: '0.0.0.0',//你的架设了qbot的服务器ip地址
					switch_go_cqhttp: false, //开关
					push_KEY: 0, //http://push.ijingniu.cn/微信推送SCKEY
					switch_push_KEY: false, //http://push.ijingniu.cn微信推送开关
					anchor_danmu: false, //天选中奖发弹幕开关
					anchor_danmu_content: ['嘿嘿嘿嘿嘿', 'hahahahaha'], //中奖弹幕
					sign_danmu_content: ['路过', '....', '...', '..', '.'], //中奖弹幕
					anchor_msg: false, //天选中奖发私信开关
					anchor_msg_content: ['嘿嘿嘿嘿嘿中奖了~~', '天选中奖了~~', '天选居然中奖了~~'], //中奖私信
					Anchor_Followings_switch: false,
					Anchor_room_go_switch: false,
					Anchor_room_go: 0,
					Anchor_always_room_switch: false, //常驻天选房开关
					Anchor_always_room_num: 100, //常驻天选房数量上限
					Anchor_always_room_add: 0, //手动加入常驻天选房
					Anchor_room_get: true, //推荐直播间获取、排行榜获取天选房开关
					Anchor_room_get_to_always: true, //推荐直播间获取、排行榜获取天选房开关
					COUNT: 0,//修仙指数
					LCOUNT: 0, //小心心数量
					LOVE_COUNT: 0,//经验
					CLEAR_TS: 0,//
					TTCOUNT: 0,//经验
					TTLOVE_COUNT: 0,//经验
					BPJY: 0,//经验
					BPDJ: 1,//经验
					DJLVMK: 100,//经验
					room_ruid:[],//
					room_AnchorRecord_time:[],//记录天选房间号+开启的时间
					done_id_list:[],//
					aid_number_list:[],//
					done_room_list:[],//
					done_room_time_list:[],//
					updata:[],//
					Anchor_always_room_list:[],//
					id_list:[],//可不保存
					medal_uid_list:[],//
					medal_level_list:[],//
					medal_roomid_list:[],//
					medal_id_list:[],//
					FollowingList:[],//
					ALLFollowingList:[],//
					guardroom:[],//
					guard_level:[],//
					guardroom_activite:[],//
					goldjournal:[],
					freejournal:[],
					freejournal2:[],
					freejournal3:[],
					freejournal4:[],
					freejournal5:[],
					freejournal6:[],
					freejournal7:[],
					freejournal8:[],
					dynamic_id_str_done_list:[],//已参与的动态did//
					space_history_dynamic_id_last:[],//主页最新的动态did//
					last_lottery_id:70000,//
					lottery_id_done_list:[],//参与的动态lid
					congratulations_rpid_ct:[],
					poison_chicken_soup:[],
					showlive_discusss:[],
					key_rpid:[],
					key_ctime:[],
					key_rpid2:[],
					key_ctime2:[],
					key_rpid3:[],
					key_ctime3:[],
					activity_lottery_gone:[],//过期转盘sid
					ignore_room:[],//屏蔽拉黑房
					tags2_checkbox:false,//低粉
					tags4_checkbox:false,//天选鸽子
					tags5_checkbox:false,//动态鸽子
					tags6_checkbox:false,//中奖
					articles_id_done_list:[],//已检查的专栏id
					not_office_dynamic_go:false,
					sever_room_checkbox:false,//群主个人简介
					get_data_from_server:false,//服务器中转数据
					msgfeed_at_id_list:[],//@id
					AUTO_dynamic_del:30,
					space_history_offset_t:0,//已转动态时间戳秒
					business_id:[],//预约抽奖已参加bID
					get_sessions:true,//@信息推送开关
					get_sessions_keyword:["中奖","二维码","恭喜","开奖"],//私信关键词
					sendLiveDanmu_dm_type:false,//表情打卡开关
					sendLiveDanmu_dm_type_value:'official_15',//表情表代号
					push_msg_oneday_check:false,
					push_msg_oneday_hour:21,
					push_msg_oneday_days:1,
					no_money_checkbox:false,
					get_sessions_end_ts:0,//私信提前时间戳ms
					unusual_check:false,//天选关注异常检查
					unusual_uid:17561219,//私信功能测接收UID，默认直播小喇叭
					qqbot:false,
					qq2:0,//私有化接收QQ号
					qq:0,//群专属接收QQ号
					haveMsg_uid_list:[],//有私信uid
					qq_zdy:false,//QQ群通知监控
					qq_dt:false,//QQ通知监控
					dtjk_uid:0,
					dtjk_name:"昵称",
					dtjk_flash:10,
					dtjk_keyword:["关键词"],
					lottery_result_uid_list:[],//API.CONFIG.lottery_result_uid_list  检查的uidlist
					refresh:false,
					refresh_Select1:false,
					refresh_Select2:true,
					refresh_Select1_time:180,
					refresh_Select2_time:23,
					journal_pb:[],//屏蔽日志
				},

				CONFIG: {},
				init: async function () {
					try {
						BAPI.setCommonArgs(BAPI.getCookie('bili_jct')); // 设置token
					} catch (err) {
						console.error(`[${NAME}]`, err);
						return;
					}

					let p = $.Deferred();
					try {
						MY_API.loadConfig().then(async function () {
							MY_API.chatLog('正在初始化系统....', 'success');
							MY_API.chatLog('系统参数配置完成！', 'success');
							MY_API.chatLog('谁才是天选之子！天选众，来战！', 'success');
							if (MY_API.CONFIG.medal_change & MY_API.CONFIG.medal_id_list.length > 0 & MY_API.CONFIG.medal_roomid_list.indexOf(Live_info.room_id) > -1) {
								let nu = MY_API.CONFIG.medal_roomid_list.indexOf(Live_info.room_id)
								BAPI.wear_medal(MY_API.CONFIG.medal_id_list[nu]).then(async(data) => {
									console.log('自动更换勋章反馈数据', data)
									chatLog(`【自动更换勋章】${data.message}`);
								})
							}
							p.resolve();
						});
					} catch (e) {
						console.log('API初始化出错', e);
						MY_API.chatLog('系统初始化出错', 'warning');
						p.reject()
					}
					return p
				},

				loadConfig: async function () {
					let p = $.Deferred();
					try {
						let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
						$.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
						for (let item in MY_API.CONFIG) {
							if (!MY_API.CONFIG.hasOwnProperty(item))
								continue;
							if (config[item] !== undefined && config[item] !== null)
								MY_API.CONFIG[item] = config[item];
						}
						console.log('载入配置', MY_API.CONFIG);
						p.resolve()
					} catch (e) {
						console.log('API载入配置失败，加载默认配置', e);
						MY_API.setDefaults();
						p.reject()
					}
					return p
				},

				saveConfig: function () {
					try {
						localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
						//console.log('配置已保存', MY_API.CONFIG);
						return true
					} catch (e) {
						console.log('API保存出错', e);
						return false
					}
				},
				setDefaults: function () {
					MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
					MY_API.saveConfig();
					MY_API.chatLog(`天选众代号：${NAME}<br/>你好！欢迎来到白嫖怪的修仙世界！`);
					MY_API.chatLog(`未检测到帐号信息，正在创建帐号......`, 'warning');
					MY_API.chatLog(`帐号创建完成，5秒后重新登陆系统！`, 'warning');
					setTimeout(() => {
						window.location.reload()
					}, 5000);
				},
				cjcheck: function () {
					if (MY_API.CONFIG.BPDJ < 100) {
						CJ = '筑基白嫖怪';
					} else if (MY_API.CONFIG.BPDJ < 200) {
						CJ = '旋照白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 300) {
						CJ = '辟谷白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 400) {
						CJ = '结丹白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 500) {
						CJ = '元婴白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 600) {
						CJ = '出窍白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 700) {
						CJ = '分神白嫖怪';
					} else if (MY_API.CONFIG.BPDJ < 800) {
						CJ = '合体白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 900) {
						CJ = '渡劫白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 1000) {
						CJ = '大乘白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 2000) {
						CJ = '仙人白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 5000) {
						CJ = '地仙白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 10000) {
						CJ = '天仙白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 20000) {
						CJ = '玄仙白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 30000) {
						CJ = '神境白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 40000) {
						CJ = '神人白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 60000) {
						CJ = '准神白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 80000) {
						CJ = '主神白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 100000) {
						CJ = '神王白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 200000) {
						CJ = '天尊白嫖怪'
					} else if (MY_API.CONFIG.BPDJ < 300000) {
						CJ = '天尊白嫖怪一重天'
					} else if (MY_API.CONFIG.BPDJ < 400000) {
						CJ = '天尊白嫖怪二重天'
					} else if (MY_API.CONFIG.BPDJ < 500000) {
						CJ = '天尊白嫖怪三重天'
					} else if (MY_API.CONFIG.BPDJ < 600000) {
						CJ = '天尊白嫖怪四重天'
					} else if (MY_API.CONFIG.BPDJ < 700000) {
						CJ = '天尊白嫖怪五重天'
					} else if (MY_API.CONFIG.BPDJ < 800000) {
						CJ = '天尊白嫖怪六重天'
					} else if (MY_API.CONFIG.BPDJ < 900000) {
						CJ = '天尊白嫖怪七重天'
					} else if (MY_API.CONFIG.BPDJ < 1000000) {
						CJ = '天尊白嫖怪八重天'
					} else if (MY_API.CONFIG.BPDJ < 2000000) {
						CJ = '天尊白嫖怪九重天'
					} else if (MY_API.CONFIG.BPDJ >= 2000000) {
						CJ = '天尊白嫖怪大圆满'
					};
				},
				expaddGift: function (count) {
					count = 20 + Math.ceil(Math.random() * 20)
					MY_API.CONFIG.COUNT += count;
					MY_API.CONFIG.TTCOUNT += count;
					let BPJY = MY_API.CONFIG.BPJY
					MY_API.CONFIG.BPJY += count * 4;
					if (MY_API.CONFIG.BPJY >= MY_API.CONFIG.DJLVMK && BPJY < MY_API.CONFIG.DJLVMK) {
						MY_API.CONFIG.BPDJ += 1;
						MY_API.cjcheck();
						MY_API.CONFIG.DJLVMK += 1000
						//MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
					}
					$('#TTgiftCount span:eq(0)').text(MY_API.CONFIG.TTCOUNT);
					$('#giftCount span:eq(2)').text(MY_API.CONFIG.COUNT);
					$('#CJ span:eq()').text(CJ);
					$('#BPJY span:eq(0)').text(MY_API.CONFIG.BPJY);
					$('#BPJY span:eq(1)').text(MY_API.CONFIG.BPDJ);
					$('#clockgift span:eq(0)').text(MY_API.CONFIG.COUNT);
					MY_API.saveConfig();
				},
				expaddLove: function (count) {
					count = 10 + Math.ceil(Math.random() * 20)
					MY_API.CONFIG.LOVE_COUNT += count;
					MY_API.CONFIG.TTLOVE_COUNT += count;
					let BPJY = MY_API.CONFIG.BPJY
					MY_API.CONFIG.BPJY += count * 6;
					if (MY_API.CONFIG.BPJY >= MY_API.CONFIG.DJLVMK && BPJY < MY_API.CONFIG.DJLVMK) {
						MY_API.CONFIG.BPDJ += 1;
						MY_API.cjcheck();
						MY_API.CONFIG.DJLVMK += 1000
						//MY_API.chatLog('恭喜你升级了ヾ(o◕∀◕)ﾉヾ');
					}
					$('#TTgiftCount span:eq(1)').text(MY_API.CONFIG.TTLOVE_COUNT);
					$('#giftCount span:eq(3)').text(MY_API.CONFIG.LOVE_COUNT);
					$('#giftCoun span:eq(1)').text(MY_API.CONFIG.LOVE_COUNT);
					$('#BPJY span:eq(0)').text(MY_API.CONFIG.BPJY);
					$('#BPJY span:eq(1)').text(MY_API.CONFIG.BPDJ);
					MY_API.saveConfig();
				},

				creatSetBox: function () { //创建设置框
					if (GM_getValue('btn1') == undefined)
						GM_setValue('btn1', true)
					if (GM_getValue('btn2') == undefined)
						GM_setValue('btn2', true)
					let btn11 = $('<button id="btn11" style="position: absolute; top: 200px; right: -120px;z-index: 1;background-color: yellow;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								  '显隐专属参数界面</button>');
					btn11.click(function () {
						$('.zdbgjqqrunmark').toggle()
					});
					$('.chat-history-panel').append(btn11);
					$('#btn11').hide()
					let btn1 = $('<button style="position: absolute; top: 223px; right: -120px;z-index: 1;background-color: pink;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								 '显隐插件参数界面</button>');
					btn1.click(function () {
						$('.zdbgjdiv').toggle()
						$('.zdbgjtj').toggle()
						$('.zdbgjohb').toggle()
						$('.zdbgjtpp').toggle()
						if ($(".zdbgjdiv").is(":hidden")) {
							GM_setValue('btn1', true)
						} else {
							GM_setValue('btn1', false)
						};
					});
					$('.chat-history-panel').append(btn1);
					let btn2 = $('<button style="position: absolute; top: 246px; right: -120px;z-index:1;background-color:yellow;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								 '显隐最新中奖信息</button>');
					btn2.click(function () {
						$('.zdbgjaward').toggle()
						if ($(".zdbgjaward").is(":hidden")) {
							GM_setValue('btn2', true)
						} else {
							GM_setValue('btn2', false)
						};
					});
					$('.chat-history-panel').append(btn2);
					let btn3 = $('<button style="position: absolute; top: 269px; right: -120px;z-index:1;background-color:purple;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								 '清空抽奖反馈信息</button>');
					btn3.click(function () {
						$('.zdbgjMsg').hide();
					});
					$('.chat-history-panel').append(btn3);

					if (GM_getValue('read') == undefined)
						GM_setValue('read', false)
					let btn4 = $('<button id="read" style="position: absolute; top: 315px; right: -120px;z-index:1;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								 '中奖语音播报开关</button>');
					btn4.click(function () {
						MY_API.chatLog('中奖语音播报：灰色关闭，紫色开启');
						if (GM_getValue('read')) {
							READ('中奖语音播报已关闭！')
							GM_setValue('read', false)
							$("#read").css("background-color", "GhostWhite")
						} else {
							GM_setValue('read', true)
							READ('中奖语音播报已开启！')
							$("#read").css("background-color", "purple")
						}
					});
					$('.chat-history-panel').append(btn4);
					if (!GM_getValue('read')) {
						$("#read").css("background-color", "GhostWhite")
					} else {
						$("#read").css("background-color", "purple")
					}

					if (GM_getValue('go_down') == undefined)
						GM_setValue('go_down', true)
					let btn5 = $('<button id="go_down" style="position: absolute; top: 292px; right: -120px;z-index:1;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
								 '反馈信息滚动开关</button>');
					btn5.click(function () {
						if (GM_getValue('go_down')) {
							GM_setValue('go_down', false)
							$("#go_down").css("background-color", "GhostWhite")
						} else {
							GM_setValue('go_down', true)
							$("#go_down").css("background-color", "yellow")
						}
						MY_API.chatLog('反馈信息滚动：灰色关闭，黄色开启');

					});
					$('.chat-history-panel').append(btn5);
					if (!GM_getValue('go_down')) {
						$("#go_down").css("background-color", "GhostWhite")
					} else {
						$("#go_down").css("background-color", "yellow")
					}
					let qqrunmark = $("<div class='zdbgjqqrunmark'>");
					qqrunmark.css({
						'width': '260px',
						'height': '190px',
						'position': 'absolute',
						'top': '200px',
						'left': '10px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
					});
					qqrunmark.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">内群中奖推送</legend>
	<div data-toggle="qqbot" style="font-size: 100%;color:blue;">
	<input style="vertical-align: text-top;" type="checkbox" >中奖推送到你的QQ：<br><input class="num" style="width:75px;" type="text"><button data-action="save" style="font-size: 100%;color:  #000000">保存</button><button data-action="save1" style="font-size: 100%;color:  #000000">测试</button>
	</div>
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">动态监控推送</legend>
	<div data-toggle="qq_dt" style="font-size: 100%;color:blue;">
	<input style="vertical-align: text-top;" type="checkbox" >监控半佛动态通知你QQ</div>
	<div data-toggle="qq_zdy" style="font-size: 100%;color:blue;">
	<input style="vertical-align: text-top;" type="checkbox" >监控自定义UP通知你QQ
	<button data-action="save" style="font-size: 100%;color:#000000;">保存</button><br>
	监控UID：<input class="num" style="width:125px;" type="text"><br>
	昵称：<input class="num1" style="width:75px;" type="text">间隔：<input class="num3" style="width:25px;" type="text">秒<br>
	关键词：<input class="num2" style="width:140px;" type="text">
	</div>
	</fieldset>
	`);
					qq_run_mark = GM_info.script.homepage.indexOf("430750")>-1
					$('.chat-history-panel').append(qqrunmark);
					$('.zdbgjqqrunmark').hide()
					if(qq_run_mark)$('#btn11').show()
					if (MY_API.CONFIG.qqbot)qqrunmark.find('div[data-toggle="qqbot"] input:checkbox').attr('checked', '');
					qqrunmark.find('div[data-toggle="qqbot"] input:checkbox').change(function () {
						MY_API.CONFIG.qqbot = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`群主QQ机器人推送设置：${MY_API.CONFIG.qqbot}`);
					});
					if (MY_API.CONFIG.qq_zdy)qqrunmark.find('div[data-toggle="qq_zdy"] input:checkbox').attr('checked', '');
					qqrunmark.find('div[data-toggle="qq_zdy"] input:checkbox').change(function () {
						MY_API.CONFIG.qq_zdy = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`群主QQ机器人推送QQ群设置：${MY_API.CONFIG.qq_zdy}<br>注意！默认10秒监控间隔，可能容易出现动态风控情况！`);
					});
					qqrunmark.find('div[data-toggle="qq_zdy"] .num').val(parseInt(MY_API.CONFIG.dtjk_uid.toString()));
					qqrunmark.find('div[data-toggle="qq_zdy"] .num1').val((MY_API.CONFIG.dtjk_name.toString()));
					qqrunmark.find('div[data-toggle="qq_zdy"] .num2').val((MY_API.CONFIG.dtjk_keyword.toString()));
					qqrunmark.find('div[data-toggle="qq_zdy"] .num3').val(parseInt(MY_API.CONFIG.dtjk_flash.toString()));
					qqrunmark.find('div[data-toggle="qq_zdy"] [data-action="save"]').click(function () {
						MY_API.CONFIG.dtjk_uid = parseInt(qqrunmark.find('div[data-toggle="qq_zdy"] .num').val());
						MY_API.CONFIG.dtjk_flash = parseInt(qqrunmark.find('div[data-toggle="qq_zdy"] .num3').val());
						MY_API.CONFIG.dtjk_name = (qqrunmark.find('div[data-toggle="qq_zdy"] .num1').val());
						let val = (qqrunmark.find('div[data-toggle="qq_zdy"] .num2').val());
						MY_API.CONFIG.dtjk_keyword = val.split(",");
						let word=[]
						for (let i = 0; i < MY_API.CONFIG.dtjk_keyword.length; i++) {//本地去重、去空格、去空、转小写
							if (word.indexOf(MY_API.CONFIG.dtjk_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.dtjk_keyword[i] && Number(MY_API.CONFIG.dtjk_keyword[i]) != 0) {
								word.push(MY_API.CONFIG.dtjk_keyword[i].replaceAll(' ', '').toLowerCase())
							}
						}
						MY_API.CONFIG.dtjk_keyword = word
						MY_API.saveConfig()
						MY_API.chatLog(`UID：${MY_API.CONFIG.dtjk_uid}<br>昵称：${MY_API.CONFIG.dtjk_name}<br>间隔：${MY_API.CONFIG.dtjk_flash}<br>关键词：${MY_API.CONFIG.dtjk_keyword}`);
					});

					if (MY_API.CONFIG.qq_dt)qqrunmark.find('div[data-toggle="qq_dt"] input').attr('checked', '');
					qqrunmark.find('div[data-toggle="qq_dt"] input:checkbox').change(function () {
						MY_API.CONFIG.qq_dt = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`群主QQ机器人推送你QQ设置：${MY_API.CONFIG.qq_dt}<br>注意！监控间隔短，可能容易出现动态风控情况而无法获取数据！`);
					});
					qqrunmark.find('div[data-toggle="qqbot"] .num').val(parseInt(MY_API.CONFIG.qq.toString()));
					qqrunmark.find('div[data-toggle="qqbot"] [data-action="save"]').click(function () {
						MY_API.CONFIG.qq = parseInt(qqrunmark.find('div[data-toggle="qqbot"] .num').val());
						MY_API.saveConfig()
						MY_API.chatLog(`你的QQ号：${MY_API.CONFIG.qq}`);
					});
					let qqbotmark = true
					qqrunmark.find('div[data-toggle="qqbot"] [data-action="save1"]').click(function () {
						if(!qqbotmark)return MY_API.chatLog(`10秒CD中！`);
						if(!MY_API.CONFIG.qqbot)return MY_API.chatLog(`推送没有勾选！`);
						if(MY_API.CONFIG.qq && MY_API.CONFIG.qqbot && qqbotmark){
							qq(MY_API.CONFIG.qq,`【天选众】${Live_info.uname}：群主QQ机器人推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`,qun_server[1]).then(async function (data) {
								if(data.retcode==0){
									MY_API.chatLog(`群主QQ机器人发送成功！`);
								}else{
									MY_API.chatLog(`${data.retmsg}`);
								}
							})
						}
						qqbotmark = false
						setTimeout(() => {
							qqbotmark = true
						}, 10e3);
					});

					let nummsg = $("<div class='zdbgjnummsg'>");
					nummsg.css({
						'width': '99px',
						'height': '15px',
						'position': 'absolute',
						'top': '338px',
						'left': '314px',
						'background': '#00FFFF',
						'padding': '4px',
						'z-index': '99',
						'border-radius': '4px',
						'transition': 'height .3s',
						'overflow': 'hidden',
					});
					nummsg.append(`
	<div id="giftCoun" style="font-size: 100%;color:blue;">
	已抽奖：<span>${MY_API.CONFIG.COUNT_GOLDBOX}</span>次
	</div>
	`);
					var widthmax,
						heightmax;
					widthmax = $('.web-player-ending-panel').width() - 50;
					//heightmax = $('.web-player-ending-panel').height() - 50;
					heightmax = $('.chat-history-panel').height();
					let div = $("<div class='zdbgjdiv'>");
					div.css({
						'width': '330px',
						'height': '630px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '10px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '99',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px'
					});

					let tj = $("<div class='zdbgjtj'>");
					tj.css({
						'width': '400px',
						'height': '630px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '365px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '99',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
					});

					tj.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【抽奖日志】</legend>

	<div id="COUNT_GOLDBOX" style="font-size: 100%;color:blue;">
	已参加抽奖次数：<span>${MY_API.CONFIG.COUNT_GOLDBOX}</span>次</br>
	</div>

	<div data-toggle="medal_change">
	<button data-action="save4" style="font-size: 100%;color:  #000000">天选日志</button>
	<button data-action="save" style="font-size: 100%;color:  #000000">消费类</button>
	<button data-action="save1" style="font-size: 100%;color:  #000000">免费类</button><br>
	<button data-action="save2" style="font-size: 100%;color:  #000000">活动类</button>
	<button data-action="save3" style="font-size: 100%;color:  #000000">金宝箱</button>
	<button data-action="save5" style="font-size: 100%;color:  #000000">动态抽奖</button><br>
	<button data-action="save6" style="font-size: 100%;color:  #000000">直播预约</button>
	<button data-action="save8" style="font-size: 100%;color:  #000000">专栏动态</button>
	<button data-action="save7" style="font-size: 100%;color:  #000000">中奖</button><br>
	<button data-action="save11" style="font-size: 100%;color:  #000000">日志:预约及天选含抽奖屏蔽词</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【中奖推送】</legend>
	<div data-toggle="push_msg_oneday">
	<apend style="font-size: 100%; color:  #000000" title="每日推送中奖信息，防漏信息，备用方案。">
	<input style="vertical-align: text-top;" type="checkbox" >定时推送天选/实物中奖统计：<br>
	<input class="hour" style="width:20px;" type="text">点推送<input class="days" style="width:20px;" type="text">日内中奖信息
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="ServerChan_SCKEY1">
	<apend style="font-size: 100%; color:  #000000" title="从点击按钮测试">推送测试按钮<br>
	<button data-action="save" style="font-size: 100%;color:  #000000">Turbo</button>
	<button data-action="save2" style="font-size: 100%;color:  #000000">Push</button>
	<button data-action="save1" style="font-size: 100%;color:  #000000">Qmsg</button>
	<button data-action="save3" style="font-size: 100%;color:  #000000">Gocq</button>
	</div>

	<div data-toggle="ServerChan_SCKEY">
	<apend style="font-size: 100%; color:  #000000" title="Server酱Turbo版微信推送中奖消息">
	<input style="vertical-align: text-top;" type="checkbox" >Server酱Turbo版<br><input class="num" style="width:61px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	<a target="_blank" href="https://www.bilibili.com/video/BV1S64y1S7p3"><button title="Server酱Turbo版：https://sct.ftqq.com/，填写SendKey,保存"  style="font-size: 100%;color:#000000;">教程</button></a>
	<a target="_blank" href="https://sct.ftqq.com"><button title="Server酱Turbo版：https://sct.ftqq.com/，填写SendKey,保存"  style="font-size: 100%;color:#000000;">注册</button></a>
	</div>

	<div data-toggle="push_KEY">
	<apend style="font-size: 100%; color:  #000000" title="http://push.ijingniu.cn微信推送中奖消息">
	<input style="vertical-align: text-top;" type="checkbox" >PUSH即时达微信推送<br/>KEY<input class="num" style="width:61px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	<a target="_blank" href="https://www.bilibili.com/video/BV1S64y1S7p3"><button title="http://push.ijingniu.cn，填写KEY,保存"  style="font-size: 100%;color:#000000;">教程</button></a>
	<a target="_blank" href="http://push.ijingniu.cn"><button title="http://push.ijingniu.cn，填写KEY,保存"  style="font-size: 100%;color:#000000;">注册</button></a>
	</div>

	<div data-toggle="Qmsg_KEY">
	<apend style="font-size: 100%; color:  #000000" title="Qmsg酱QQ推送中奖消息">
	<input style="vertical-align: text-top;" type="checkbox" >Qmsg扣扣推送<br/>KEY<input class="num" style="width:61px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	<a target="_blank" href="https://www.bilibili.com/video/BV1sX4y1V7aP"><button title="Qmsg酱：https://qmsg.zendee.cn/index.html，填写KEY,保存"  style="font-size: 100%;color:#000000;">教程</button></a>
	<a target="_blank" href="https://qmsg.zendee.cn/index.html"><button title="Qmsg酱：https://qmsg.zendee.cn/index.html，填写KEY,保存"  style="font-size: 100%;color:#000000;">注册</button></a>
	</div>

	<div data-toggle="go_cqhttp">
	<apend style="font-size: 100%; color:  #000000" title="go_cqhttp私有QQ推送中奖消息">
	<input style="vertical-align: text-top;" type="checkbox" >gocq自架私有QQ推送<br/>接收QQ<input class="num1" style="width:75px;" type="text"><br/>IP<input class="num" style="width:75px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	<a target="_blank" href="https://www.bilibili.com/video/BV1sX4y1V7aP"><button title="填写服务器IP地址,保存"  style="font-size: 100%;color:#000000;">教程</button></a>
	<a target="_blank" href="https://wwp.lanzoui.com/imJ8Jwxmo4f"><button style="font-size: 100%;color:#000000;">架设</button></a>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【实物宝箱】</legend>
	<div data-toggle="AUTO_GOLDBOX">
	<apend style="font-size: 100%; color: #000000" title="自动金宝箱实物抽奖，主要是各种厂商官方活动抽奖">
	<input id = "AUTO_GOLDBOX" style="vertical-align: text-top;" type="checkbox" >自动实物宝箱抽奖
	</div>

	<div data-toggle="AUTO_GOLDBOX_sever2">
	<apend style="font-size: 100%; color: #000000" title="依赖群主云服务器数据">
	<input id = "AUTO_GOLDBOX_sever2" style="vertical-align: text-top;" type="checkbox" >群主的云宝箱模式
	</div>

	<div data-toggle="do_GOLDBOX">
	<apend style="font-size: 100%; color:  #000000" title="填写aid*100+number，例如：aid=756 number=11,填入75611！">
	手动实物宝箱：<input class="num" style="width: 36px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">参加</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【动态预约】</legend>
	<div data-toggle="dynamic_lottery">
	<apend style="font-size: 100%; color: #000000" title="自动参与已关注的UP最新的官方抽奖工具的动态抽奖">
	<input id="dynamic_lottery" style="vertical-align: text-top;" type="checkbox">自动参与已关注的官方动态抽奖
	</div>

	<div data-toggle="detail_by_lid_dynamic">
	<apend style="font-size: 100%; color: #000000" title="自动参与全部最新的官方抽奖工具的动态抽奖，会增加关注">
	<input id="detail_by_lid_dynamic" style="vertical-align: text-top;" type="checkbox" >自动参与近期全部官方动态抽奖
	</div>

	<div data-toggle="detail_by_lid_live">
	<apend style="font-size: 100%; color: #000000" title="自动参与直播预约抽奖，不需要关注">
	<input style="vertical-align: text-top;" type="checkbox" >自动参与近期全部直播预约抽奖
	</div>

	<div data-toggle="not_office_dynamic_go">
	<apend style="font-size: 100%; color: #000000" title="自动参与近期大锦鲤专栏的全部动态抽奖，包括官方的非官方的，会增加关注">
	<input style="vertical-align: text-top;" type="checkbox" >参与大锦鲤专栏的全部动态抽奖
	</div>

	<div data-toggle="detail_by_lid_live_ignore">
	<apend style="font-size: 100%; color: #000000" title="勾选使用天选时刻屏蔽词">
	<input style="vertical-align: text-top;" type="checkbox" >预约直播抽奖应用天选抽奖屏蔽
	</div>

	<div data-toggle="detail_by_lid_flash">
	<apend style="font-size: 100%; color:  #000000" title="直播预约抽奖、转发抽奖的最小间隔！">
	转发参与间隔：<input class="num" style="width: 36px;" type="text">秒
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="detail_by_lid_reset">
	<apend style="font-size: 100%; color:  #000000" title="重置直播预约抽奖、转发抽奖的ID序号，批量检查官方中奖的序号！">
	动态预约起始序号：<input class="num" style="width: 40px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">重置</button>
	</div>

	<div data-toggle="AUTO_dynamic_create">
	<apend style="font-size: 100%; color:  #000000" title="自动发动态及间隔">
	<input style="vertical-align: text-top;" type="checkbox" >每隔<input class="num" style="width:20px;" type="text">分发一条动态
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="AUTO_dynamic_del">
	<apend style="font-size: 100%; color:  #000000" title="删除旧动态">
	删除<input class="num" style="width:20px;" type="text">天前的动态
	<button data-action="save" style="font-size: 100%;color:  #000000">立即执行</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【官方抽奖批量检查】</legend>
	<div data-toggle="lottery_result_uid_list">
	<apend style="font-size: 100%; color:  #000000" title="动态抽奖、预约抽奖、动态红包">
	官方抽奖起始序号：<input class="num" style="width: 40px;" type="text">
	<button data-action="save3" style="font-size: 100%;color:  #000000">重置</button><br>
	UID列表：<input class="num1" style="width:120px;" type="text"><br>
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	<button id="jindu" data-action="save1" style="font-size: 100%;color:  #000000">立即执行</button>
	<button data-action="save2" style="font-size: 100%;color:  #000000">显示结果</button>
	</div>

	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【活动抽奖】</legend>
	<div data-toggle="AUTO_activity_lottery">
	<apend style="font-size: 100%; color: #000000" title="自动开始活动抽奖">
	<input style="vertical-align: text-top;" type="checkbox" title="自动开始活动抽奖">自动开始活动抽奖
	<button data-action="save" style="font-size: 100%;color: #000000">立即</button>
	</div>

	<div data-toggle="AUTO_activity_lottery_time">
	<apend style="font-size: 100%; color: #000000" title="定时活动抽奖">
	活动定时：<input class="hour" style="width:19px;" type="text">点
	<input class="min" style="width:19px;" type="text">分
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button><br>
	<apend style="font-size: 100%;color:blue;">注：不勾选也会自动定时获取次数！<br>勾选后启动自动定时抽奖！
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【天选时刻】</legend>
	<div data-toggle="AUTO_Anchor">
	<apend style="font-size: 100%; color: #000000" title="一个关注，即可自动白嫖天选时刻，参加其他请手动点击蓝字直播间链接前往直播间">
	<input id = "AUTO_Anchor" style="vertical-align: text-top;" type="checkbox" >自动天选时刻抽奖
	</div>

	<div data-toggle="switch_sever">
	<apend style="font-size: 100%; color: #000000" title="开启天选检索并互助推送，共享检索到的天选数据，同一IP各号脚本共只可开启一个，否则容易被风控访问拒绝！">
	<input style="vertical-align: text-top;" type="checkbox" >开启天选检索并互助推送
	</div>

	<div data-toggle="get_following_live">
	<apend style="font-size: 100%; color: #000000" title=开启后只检索关注的主播的房间！">
	<input style="vertical-align: text-top;" type="checkbox" >仅检索关注的主播的房间
	</div>

	<div data-toggle="Anchor_Followings_switch">
	<apend style="font-size: 100%; color: #000000" title=开启后只参与关注的主播的抽奖！">
	<input style="vertical-align: text-top;" type="checkbox" >仅参与关注的主播的抽奖
	</div>

	<div data-toggle="sever_modle">
	<apend style="font-size: 100%; color: #000000" title="获取群主专栏天选数据抽奖！">
	<input style="vertical-align: text-top;" type="checkbox" >获取群主专栏天选数据抽奖
	</div>

	<div data-toggle="sever_room_checkbox">
	<apend style="font-size: 100%; color: #000000" title="获取群主简介天选数据抽奖！">
	<input style="vertical-align: text-top;" type="checkbox" >获取群主简介天选数据抽奖
	</div>

	<div data-toggle="get_data_from_server">
	<apend style="font-size: 100%; color: #000000" title="获取群服务器天选数据抽奖！">
	<input style="vertical-align: text-top;" type="checkbox" >获取群服务器天选数据抽奖
	</div>

	<div data-toggle="AnchorFLASH" title="范围：0-">
	<append style="font-size: 100%;color: #000000" ><data-toggle="AnchorFLASH" title="检索天选房间数据间隔/延迟，不含代码运行时间，范围：0-" >检索直播间间隔
	<input class="AnchorFLASH" style="width: 30px;" type="text">毫秒
	<button data-action="save" style="font-size: 100%;color: #000000" title="范围：0-100，">保存</button>
	</div>

	<div data-toggle="AnchorserverFLASH" title="范围：8-50">
	<append style="font-size: 100%;color: #000000" title="获取群主专栏、简介天选数据的间隔，范围：8-50" >获取群主天选数据间隔
	<input class="AnchorserverFLASH" style="width: 30px;" type="text">秒
	<button data-action="save" style="font-size: 100%;color: #000000" title="范围：8-50，">保存</button>
	</div>

	<div data-toggle="AnchorcheckFLASH" title="范围：10-5000">
	<append style="font-size: 100%;color: #000000" title="检索天选房时间间隔，范围：10-5000，建议检索耗时+检索间隔≤300秒，即一个5分钟天选的时间" >检索天选房列表时间间隔
	<input class="AnchorcheckFLASH" style="width: 30px;" type="text">秒
	<button data-action="save" style="font-size: 100%;color: #000000" title="范围：10-5000">保存</button>
	</div>

	<div data-toggle="Anchor_room_send" >
	<append style="font-size: 100%;color: #000000" title="手动推送服务器房间，如果发现漏掉的天选，可以手动推送到专栏" >手动推送天选房
	<input class="Anchor_room_send" style="width: 65px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000">发送</button>
	</div>

	<div data-toggle="Anchor_room_get">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000">获取下列分区加入检索
	</div>
	<div data-toggle="tu50room">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000">分区直播间数增加到50
	</div>

	<div style="font-size: 100%;color: #000000" data-toggle="parent_area_id">
	<input id ="parent_area_id2" style="vertical-align: text-top;" type="checkbox" >网游
	<input id ="parent_area_id3" style="vertical-align: text-top;" type="checkbox" >手游
	<input id ="parent_area_id6" style="vertical-align: text-top;" type="checkbox" >单机
	<input id ="parent_area_id1" style="vertical-align: text-top;" type="checkbox" >娱乐<br>
	<input id ="parent_area_id5" style="vertical-align: text-top;" type="checkbox" >电台
	<input id ="parent_area_id9" style="vertical-align: text-top;" type="checkbox" >虚拟
	<input id ="parent_area_id10" style="vertical-align: text-top;" type="checkbox" >生活
	<input id ="parent_area_id11" style="vertical-align: text-top;" type="checkbox" >学习
	</div>

	<div data-toggle="Anchor_room_get_to_always">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000">把最新天选房加入常驻
	</div>

	<div data-toggle="Anchor_always_room_switch">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000" title="勾选后自动添加有天选的房间到常驻房">启用常驻房（上限：
	<input class="Anchor_always_room_num" style="width: 28px;" type="text">）
	<button data-action="save" style="font-size: 100%;color: #000000">保存</button>
	</div>

	<div data-toggle="Anchor_room_go_switch">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000" title=循环20秒检索加急直播间，不需要时请关闭该选项，以免浪费检索资源，受检索模块限制">添加加急房
	<input class="Anchor_room_go" style="width: 50px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000">保存</button>
	</div>

	<div data-toggle="Anchor_always_room_add" >
	<append style="font-size: 100%;color: #000000" title="手动添加房间号到常驻天选房" >手动添加常驻房
	<input class="Anchor_always_room_add" style="width: 67px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000">添加</button>
	</div>

	<div data-toggle="fans_min">
	<apend style="font-size: 100%; color:  #000000" title="抽奖主播粉丝数下限，低于下限不抽奖">
	<input style="vertical-align: text-top;" type="checkbox">粉丝下限：<input class="num" style="width:50px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="money_min">
	<apend style="font-size: 100%; color:  #000000" title="抽奖奖品金额下限（单位：元），低于下限不抽奖">
	<input style="vertical-align: text-top;" type="checkbox">奖金下限：<input class="num" style="width:30px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="no_money_checkbox">
	<apend style="font-size: 100%; color:  #000000" title="仅现金及正则参与抽奖">
	<input style="vertical-align: text-top;" type="checkbox">仅现金及正则项参与抽奖
	</div>

	<div data-toggle="TOProomnum">
	<apend style="font-size: 100%; color:  #000000" title="范围：200-1000，房间上限过大，可能会造成巡查周期过长，漏掉天选，房间上限过小也可能漏掉！">
	循检房间上限：<input class="num" style="width: 32px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="gift_price">
	<apend style="font-size: 100%; color:  #000000" title="理性消费，1电池=100金瓜子=1毛钱">
	金瓜子上限值：<input class="num" style="width: 32px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="Anchor_cur_gift_num">
	<apend style="font-size: 100%; color: #000000" title="只参加一次抽奖！">
	<input style="vertical-align: text-top;" type="checkbox" >忽略已参加的金瓜子抽奖
	</div>

	<div data-toggle="AUTO_medal_get_up">
	<apend style="font-size: 100%; color: #000000" title="无勋章：自动获得勋章且升级到4级及以下满足天选">
	<input style="vertical-align: text-top;" type="checkbox" >无勋章：自动获得勋章且升级
	</div>

	<div data-toggle="money_big">
	<apend style="font-size: 100%; color:  #000000" title="获取勋章奖品金额下限（单位：元），大于下限则获取">
	<input style="vertical-align: text-top;" type="checkbox">无勋章：奖金下限：<input class="num" style="width:20px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="unignore_to_get_medal_switch">
	<apend style="font-size: 100%; color:  #000000" title="获取勋章开启获得勋章正则参与">
	<input style="vertical-align: text-top;" type="checkbox" >无勋章：获得勋章正则参与<br>
	<apend style="font-size: 100%;color:blue;">注：符合无勋章任一勾选条件即生效！
	</div>

	<div data-toggle="AUTO_medal_up">
	<apend style="font-size: 100%; color: #000000" title="有勋章：自动勋章升级（经验够的情况下投喂小心心）满足天选">
	<input style="vertical-align: text-top;" type="checkbox" >有勋章：自动投喂小心心升级
	</div>

	<div data-toggle="anchor_postdiscuss_switch">
	<apend style="font-size: 100%; color:  #000000" title="从专栏评论自动更新屏蔽关键词，CV号写数字">
	<input style="vertical-align: text-top;" type="checkbox" >从专栏评论自动屏蔽词屏蔽房<br/>专栏号：<input class="num" style="width:60px;" type="text">
	<br/>云地址：<input class="string" style="width:60px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="anchor_danmu_content">
	<apend style="font-size: 100%; color:  #000000" title="中奖自动发送随机弹幕，英文逗号隔开，不会发送弹幕！">
	<input style="vertical-align: text-top;" type="checkbox" >中奖后自动发送随机弹幕<br/><input class="num" style="width:124px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="anchor_msg_content">
	<apend style="font-size: 100%; color:  #000000" title="中奖自动发送随机私信，英文逗号隔开">
	<input style="vertical-align: text-top;" type="checkbox" >中奖后自动发送随机私信<br/><input class="num" style="width:124px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="Anchor_ignore_keyword">
	<apend style="font-size: 100%;color: #000000" title="没兴趣的奖品，可以按格式加进去,注意是英文逗号！">
	奖品名称屏蔽词设置<button data-action="save" style="font-size: 100%;color: #000000">保存</button><input class="keyword" style="width: 156px;" type="text">
	</div>

	<div data-toggle="Anchor_unignore_keyword">
	<apend style="font-size: 100%;color: #000000" title="正则关键词，与屏蔽关键词同时存在时，忽略屏蔽词，可以按格式加进去,注意是英文逗号！">
	奖品名称正则关键词<button data-action="save" style="font-size: 100%;color: #000000">保存</button><input class="keyword" style="width: 156px;" type="text">
	</div>

	<div data-toggle="Anchor_ignore_uid">
	<apend style="font-size: 100%;color: #000000" title="主播黑名单，可以按格式加进去,注意是英文逗号！">
	直播间真实房间号屏蔽列表<button data-action="save" style="font-size: 100%;color: #000000">保存</button><input class="keyword" style="width: 156px;" type="text"><br>
	<apend style="font-size: 100%;color: blue">注：自动参与抽奖只执行一次！
	</div>
	</fieldset>

	`);

					let tpp = $("<div class='zdbgjtpp'>"); //海报
					tpp.css({
						'position': 'absolute',
						'z-index': '88',
						'overflow': 'hidden',
					});

					tpp.append(`
	`);


					let ohb = $("<div class='zdbgjohb'>"); //欧皇榜
					ohb.css({
						'width': '0px',
						'height': '0px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '670px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '99',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '16px'
					});


					div.append(`


	<fieldset>
	<legend append style="font-size: 100%;color: #000000">【日常任务】</legend>
	<div><a target="_blank" href="${GM_info.script.homepage}"><button style="font-size: 100%;color: red" title="点击安装最新脚本">脚本更新！</button></a>
	<a target="_blank" href="https://shang.qq.com/wpa/qunwpa?idkey=6a64d45dd58c63491c2c9a1da8aa3a0b94c09c4eee576ed601b8094b6bf44eb8"><button style="font-size: 100%;color: red" title="点击加入QQ交流群：746790091">加入扣群！</button></a>
	</div>

	<apend id="giftCountsent">
	<div><button data-action="countsent" style="font-size: 100%;color: red" title="点击发送修仙等级、指数弹幕">低调使用！</button>
	<button data-action="countsentt" style="font-size: 100%;color: red" title="NICE!!!">闷声发财！</button>
	</div>

	<div data-toggle="TALK">
	<input style="vertical-align: text-top;" type="checkbox" ><append style="font-size: 100%;color: #000000">隐藏抽奖等反馈信息
	</div>

	<div data-toggle="AUTO_BOX">
	<apend style="font-size: 100%; color: #000000">
	<input style="vertical-align: text-top;" type="checkbox">自动银瓜子兑换硬币
	</div>

	<div data-toggle="AUTO_COIN">
	<apend style="font-size: 100%; color: #000000">
	<input id = "AUTO_COIN" style="vertical-align: text-top;" type="checkbox">自动投视频五币经验
	</div>

	<div data-toggle="AUTO_COIN2">
	<apend style="font-size: 100%; color: #000000">
	<input id = "AUTO_COIN2" style="vertical-align: text-top;" type="checkbox">自动投专栏五币经验
	</div>

	<div data-toggle="AUTO_DailyReward">
	<apend style="font-size: 100%; color: #000000" title="获取主站登陆、观看、转发（不显示在动态）经验">
	<input style="vertical-align: text-top;" type="checkbox" title="获取主站登陆、观看、转发（不显示在动态）经验">主站登陆观看及转发
	</div>

	<div data-toggle="AUTO_HEART_newmodel">
	<apend style="font-size: 100%; color: #000000" title="不占网络内存，加速倍率与勋章数有关，手机端可能无效">
	<input style="vertical-align: text-top;" type="checkbox" title="新模式，不占网络内存，加速倍率与勋章数有关，手机端可能无效">自动加速领取小心心
	</div>

	<div data-toggle="AUTO_sign_danmu">
	<apend style="font-size: 100%; color: #000000" title="自动发送签到弹幕到勋章房">
	<input style="vertical-align: text-top;" type="checkbox" title="自动发送签到弹幕">定时勋章签到
	<button data-action="save" style="font-size: 100%;color: #000000">立即签到</button>
	</div>

	<div data-toggle="medal_level_list">
	<apend style="font-size: 100%; color: #000000" title="跳过21级及以上勋章房间">
	<input style="vertical-align: text-top;" type="checkbox" title="跳过21级以上勋章房间">跳过21级及以上勋章房间
	</div>

	<div data-toggle="medal_change2">
	<apend style="font-size: 100%; color:  #000000" title="自动更换粉丝勋章">
	<input style="vertical-align: text-top;" type="checkbox" >进入直播间自动更换为当前主播勋章
	</div>

	<div data-toggle="AUTO_light">
	<apend style="font-size: 100%; color: #000000" title="自动点亮当前佩戴勋章">
	<input style="vertical-align: text-top;" type="checkbox" title="自动点亮当前佩戴勋章">自动点亮当前佩戴勋章
	</div>

	<div data-toggle="sendLiveDanmu_dm_type">
	<input style="font-size: 100%;color: #000000;vertical-align: text-top;" type="checkbox"><apend style="font-size: 100%; color: #000000">表情包弹幕签到：
	<select class="bqb" onchange="document.x1.src=options[selectedIndex].value">
	<option value="https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png@.webp" id="23333">23333</option>
	<option value="https://i0.hdslb.com/bfs/live/a9e2acaf72b663c6ad9c39cda4ae01470e13d845.png@.webp" id="daraole" selected="selected">打扰了</option>
	<option value="https://i0.hdslb.com/bfs/live/aa48737f877cd328162696a4f784b85d4bfca9ce.png@.webp" id="xiaosi" >笑死</option>
	<option value="https://i0.hdslb.com/bfs/live/61e790813c51eab55ebe0699df1e9834c90b68ba.png@.webp" id="laile">来了</option>
	<option value="https://i0.hdslb.com/bfs/live/343f7f7e87fa8a07df63f9cba6b776196d9066f0.png@.webp" id="niuniuniu">牛牛牛</option>
	<option value="https://i0.hdslb.com/bfs/live/7b7a2567ad1520f962ee226df777eaf3ca368fbc.png@.webp" id="miaoa">妙啊</option>
	<option value="https://i0.hdslb.com/bfs/live/39e518474a3673c35245bf6ef8ebfff2c003fdc3.png@.webp" id="youdiandongxi">有点东西</option>
	<option value="https://i0.hdslb.com/bfs/live/9029486931c3169c3b4f8e69da7589d29a8eadaa.png@.webp" id="lipu">离谱</option>
	</select>
	<img id="bqb_default" width=12% height=12% src="https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png@.webp" name="x1">
	</div>

	<div data-toggle="sign_danmu_content">
	<apend style="font-size: 100%; color:  #000000" title="新一天发送随机签到弹幕，英文逗号隔开">
	签到弹幕<input class="num" style="width:124px;" type="text">
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button></div>
	</div>

	<div data-toggle="AUTO_sign_time">
	<apend style="font-size: 100%; color: #000000" title="自动发送签到弹幕到勋章房">
	定时：<input class="hour" style="width:19px;" type="text">点
	<input class="min" style="width:19px;" type="text">分
	<button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="medal_ignore_roomid_list">
	<apend style="font-size: 100%; color:  #000000" title="勋章签到黑名单，填写真实房号，英文逗号【,】隔开。">
	勋章打卡屏蔽列表（填写真实房号）：<br>
	<input class="num" style="width:160px;" type="text"><button data-action="save" style="font-size: 100%;color:  #000000">保存</button>
	</div>

	<div data-toggle="TIMEAREADISABLE">
	<apend style="font-size: 100%; color: #000000">
	<input style="vertical-align: text-top;" type="checkbox">启用
	<input class="start" style="width: 15px;" type="text">点至
	<input class="end" style="width: 15px;" type="text">点不抽奖（0-23）
	<button data-action="save" style="font-size: 100%;color: #000000">保存</button>
	</div>

	<div data-toggle="onedayLT">
	<apend style="font-size: 100%; color: #000000" title="当天过期辣条、小心心，24点后会自然消失！">
	<input style="vertical-align: text-top;" type="checkbox">当天过期礼物投喂房间号：
	<input class="start" style="width: 75px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000">保存</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【自动刷新设置】</legend>
	<div data-toggle="refresh" style="font-size: 100%;color: #000000;">
	<input style="font-size: 100%;color: #000000;vertical-align: text-top;" type="checkbox">自动刷新直播间
	<button data-action="save" style="font-size: 100%;color: #000000">保存</button>
	</div>
	<div data-toggle="refresh_Select1" style="font-size: 100%;color: #000000">
	<input name="refresh_Select" style="font-size: 100%;color: #000000;vertical-align: text-top;" type="radio">每隔<input class="time1" style="width: 40px;" type="text">分自动刷新直播间
	</div>
	<div data-toggle="refresh_Select2" style="font-size: 100%;color: #000000">
	<input name="refresh_Select" style="font-size: 100%;color: #000000;vertical-align: text-top;" type="radio">每天<input class="time2" style="width: 40px;" type="text">点自动刷新直播间【0-23】
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【天选及私信异常】</legend>
	<div data-toggle="unusual_check" style="font-size: 100%;color: #000000">
	<input style="font-size: 100%;color: #000000;vertical-align: text-top;" type="checkbox">天选关注异常检测并异常时自动尝试关注</div>

	<div data-toggle="unusual" style="font-size: 100%;color: #000000">
	接收UID：<input class="uid" style="width: 80px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000">私信异常测试</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【@信息通知、一键私信已读、7天内私信提取】</legend>
	<div data-toggle="get_sessions" style="font-size: 100%;color: #000000">
	<input style="font-size: 100%;color: #000000;vertical-align: text-top;" type="checkbox">关注的人@信息自动推送<br>
	<button id="get_sessions" data-action="save" style="font-size: 100%;color: #000000;" title="一键取私信已读">一键私信已读及提取</button><button data-action="save1" style="font-size: 100%;color: #000000">查看提取</button></button><button data-action="save3" style="font-size: 100%;color: #000000">已读标记重置</button><br>
	关键词设置：<input class="keyword" style="width: 156px;" type="text"><button data-action="save2" style="font-size: 100%;color: #000000">保存</button>
	</div>
	</fieldset>


	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【一键取关分组】</legend>
	<a target="_blank" href="https://space.bilibili.com/${Live_info.uid}/fans/follow"><button style="font-size: 100%;color: #000000" title="点击前往取关">点击前往一键取关功能简单版</button></a><br>
	<div data-toggle="tags">
	<button data-action="save" style="font-size: 100%;color: #000000;" title="显示一键取关界面">显示一键取关分组功能增强版</button>
	</br><apend style="font-size: 100%;color: blue">注：请尽量支持关注主播！
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【手动发送弹幕抽奖】</legend>
	<div data-toggle="Anchor_danmu_go">
	<input style="font-size: 100%;color: #000000;vertical-align: text-top;" type="checkbox"><apend style="font-size: 100%;color: #000000;">随机鸡汤文弹幕<br>
	<apend style="font-size: 100%;color: #000000;">发送弹幕：
	<input class="start" style="width: 160px;" type="text"><br>到直播间：
	<input class="end" style="width: 80px;" type="text"><br>每
	<input class="number1" style="width: 26px;" type="text">秒，共发送
	<input class="number2" style="width: 26px;" type="text">次
	<button data-action="save" style="font-size: 100%;color: #000000">开始</button>
	<button data-action="save1" style="font-size: 100%;color: #000000">停止</button>
	</div>
	</fieldset>

	<fieldset>
	<legend append style="font-size: 100%;color: #000000;text-align: left;">【配置操作】</legend>
	<button data-action="exportConfig" style="font-size: 100%;color: red" title="导出配置按钮">导出配置参数</button>
	<button data-action="importConfig" style="font-size: 100%;color: red" title="导入配置按钮">导入配置参数</button>
	<button data-action="CONFIG_DEFAULT" style="font-size: 100%;color: red" title="重置为默认参数">重置默认参数</button>
	<input type="file" id="ZDBGJ_config_file" name="json" accept=".json" >
	</fieldset>


	`);

					div.find('button[data-action="CONFIG_DEFAULT"]').click(() => { //重置配置按钮
						MY_API.CONFIG = MY_API.CONFIG_DEFAULT;
						MY_API.saveConfig();
						MY_API.chatLog('重置为默认参数');
						alert('配置重置成功，点击确定刷新页面');
						window.location.reload()
					});
					div.find('button[data-action="exportConfig"]').click(() => { //导出配置按钮
						let CONFIG_OUT = MY_API.CONFIG_DEFAULT;
						let unlist = ["journal_pb","activity_lottery_gone","haveMsg_uid_list","dtjk_name","dtjk_keyword","dtjk_flash","dtjk_uid","qq_zdy","qq_dt","COUNT_GOLDBOX","get_sessions_end_ts","medal_level_list","poison_chicken_soup","last_lottery_id","dynamic_id_str_done_list","medal_id_list","medal_roomid_list","medal_uid_list","Anchor_always_room_list","updata","done_room_time_list","done_room_list","aid_number_list","done_id_list","room_AnchorRecord_time","room_ruid","business_id","space_history_offset_t","msgfeed_at_id_list","articles_id_done_list","ALLFollowingList","COUNT","LCOUNT","LOVE_COUNT","CLEAR_TS","TTCOUNT","TTLOVE_COUNT","BPJY","BPDJ","DJLVMK","FollowingList","guardroom","guard_level","guardroom_activite","goldjournal","freejournal","freejournal2","freejournal3","freejournal4","freejournal5","freejournal6","freejournal7","freejournal8","local_cards_dynamic_id_str_list","strlast_lottery_id","lottery_id_done_list","lidcongratulations_rpid_ct","showlive_discusss","key_rpid","key_ctime","key_rpid2","key_ctime2","key_rpid3","key_ctime3"]
						for (let item in MY_API.CONFIG) {
							//await sleep(200)
							if(unlist.indexOf(item)>-1){
								console.log('导出配置过滤',unlist.indexOf(item), item);
								continue
							}
							CONFIG_OUT[item] = MY_API.CONFIG[item]
						}
						console.log(CONFIG_OUT)
						downFile('ZDBGJ_CONFIG.json', CONFIG_OUT);
						MY_API.chatLog('配置已导出');
					});
					div.find('button[data-action="importConfig"]').click(() => { //导入配置按钮
						let selectedFile = document.getElementById("ZDBGJ_config_file").files[0];
						let reader = new FileReader();
						reader.readAsText(selectedFile);
						reader.onload =async function () {
							try {
								readConfig = JSON.parse(this.result);
								let p = $.Deferred();
								try {
									let config = readConfig;
									$.extend(true, MY_API.CONFIG, readConfig);
									let unlist = ["journal_pb","activity_lottery_gone","haveMsg_uid_list","dtjk_name","dtjk_keyword","dtjk_flash","dtjk_uid","qq_zdy","qq_dt","COUNT_GOLDBOX","get_sessions_end_ts","medal_level_list","poison_chicken_soup","last_lottery_id","dynamic_id_str_done_list","medal_id_list","medal_roomid_list","medal_uid_list","Anchor_always_room_list","updata","done_room_time_list","done_room_list","aid_number_list","done_id_list","room_AnchorRecord_time","room_ruid","business_id","space_history_offset_t","msgfeed_at_id_list","articles_id_done_list","ALLFollowingList","COUNT","LCOUNT","LOVE_COUNT","CLEAR_TS","TTCOUNT","TTLOVE_COUNT","BPJY","BPDJ","DJLVMK","FollowingList","guardroom","guard_level","guardroom_activite","goldjournal","freejournal","freejournal2","freejournal3","freejournal4","freejournal5","freejournal6","freejournal7","freejournal8","local_cards_dynamic_id_str_list","strlast_lottery_id","lottery_id_done_list","lidcongratulations_rpid_ct","showlive_discusss","key_rpid","key_ctime","key_rpid2","key_ctime2","key_rpid3","key_ctime3"]
									for (let item in MY_API.CONFIG) {
										//await sleep(200)
										if(unlist.indexOf(item)>-1){
											console.log('导入配置过滤',unlist.indexOf(item), item);
											continue
										}
										if (!MY_API.CONFIG.hasOwnProperty(item))
											continue;
										if (config[item] !== undefined && config[item] !== null){
											MY_API.CONFIG[item] = config[item];
											console.log('导入配置',item,MY_API.CONFIG[item]);
										}
									}
									p.resolve()
								} catch (e) {
									p.reject()
								};
								console.log('导入配置importConfig：', readConfig);
								alert('配置导入成功，点击确定刷新页面');
								window.location.reload()
							} catch (e) {
								console.log('导入配置importConfig error：', e);
								return alert('文件格式错误')
							}
						};
					});
					let award = $("<div class='zdbgjaward'>");
					award.css({
						'width': '260px',
						'height': '200px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '510px',
						'right': '-295px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'font-size': '5px',
					});

					award.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">最新中奖信息
	<a target="_blank" href="https://message.bilibili.com/#/whisper"><button style="font-size: 100%;color:#000000;position:absolute;right:10%">消息中心-我的消息</button></a></legend>
	<div id="award" style="font-size: 100%;color:#000000;">
	<a target="_blank" href="https://link.bilibili.com/p/center/index#/user-center/my-info/celestial"><button style="font-size: 100%;color:#000000;">天选</button></a></br>

	<span>${anchor_name}</span>：
	<span>${award_name}</span>
	<span>${end_time}</span>
	<a target="_blank" id = 'anchor_uid' href="https://message.bilibili.com/#/whisper/mid${anchor_uid}"><button style="font-size: 100%;color:#000000;">私信</button></a>
	<a target="_blank" id = 'anchor_room' href="https://live.bilibili.com/${anchor_room}"><button style="font-size: 100%;color:#000000;">直播间</button></a>
	</br>
	<span>${anchor_name1}</span>：
	<span>${award_name1}</span>
	<span>${end_time1}</span>
	<a target="_blank" id = 'anchor_uid1' href="https://message.bilibili.com/#/whisper/mid${anchor_uid1}"><button style="font-size: 100%;color:#000000;">私信</button></a>
	<a target="_blank" id = 'anchor_room1' href="https://live.bilibili.com/${anchor_room1}"><button style="font-size: 100%;color:#000000;">直播间</button></a>
	</br>
	<span>${anchor_name2}</span>：
	<span>${award_name2}</span>
	<span>${end_time2}</span>
	<a target="_blank" id = 'anchor_uid2' href="https://message.bilibili.com/#/whisper/mid${anchor_uid2}"><button style="font-size: 100%;color:#000000;">私信</button></a>
	<a target="_blank" id = 'anchor_room2' href="https://live.bilibili.com/${anchor_room2}"><button style="font-size: 100%;color:#000000;">直播间</button></a>
	</br>
	</br>
	<a target="_blank" href="https://link.bilibili.com/p/center/index#/user-center/my-info/award"><button style="font-size: 100%;color:#000000;">实物</button></a></br>
	<span>${awardlist_list[0]}</span>
	</div>
	</fieldset>
	`);

					let sessions = $("<div class='zdbgjsessions'>");
					sessions.css({
						'width': `${widthmax}px`,
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '10px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});
					sessions.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【私信提取列表/官方抽奖批量检查日志】</legend>
	<div id="sessions_msg" style="font-size: 100%;color:#000000;">
	<span>${sessions_msg}</span>
	</div>

	<div data-toggle="journal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(sessions);
					$('.zdbgjsessions').hide()
					sessions.find('div[data-toggle="journal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjsessions').toggle()
					})
					div.find('div[data-toggle="get_sessions"] [data-action="save1"]').click(async function () {
						$('.zdbgjsessions').toggle()
						$('#sessions_msg span:eq(0)').text(sessions_msg)
						let dt = document.getElementById('sessions_msg'); //通过id获取该div
						dt.innerHTML  = sessions_msg
					});
					div.find('div[data-toggle="get_sessions"] [data-action="save3"]').click(async function () {
						MY_API.CONFIG.get_sessions_end_ts = 0
						MY_API.saveConfig()
						MY_API.chatLog(`已读标记重置：${MY_API.CONFIG.get_sessions_end_ts}`);
					});
					let journal = $("<div class='zdbgjjournal'>");
					journal.css({
						'width': '600px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'left': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});


					journal.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【消费天选日志】</legend>
	<div data-toggle="journal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="goldjournal" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.goldjournal}</span>
	</div>

	<div data-toggle="journal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal);
					$('.zdbgjjournal').hide()
					journal.find('div[data-toggle="journal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal').toggle()
					})
					journal.find('div[data-toggle="journal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.goldjournal = []
						MY_API.saveConfig()
						$('#goldjournal span:eq(0)').text(MY_API.CONFIG.goldjournal)
						let dt = document.getElementById('goldjournal'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.goldjournal
					})
					tj.find('div[data-toggle="medal_change"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal').toggle()
						$('#goldjournal span:eq(0)').text(MY_API.CONFIG.goldjournal)
						let dt = document.getElementById('goldjournal'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.goldjournal
					});




					let journal_pb = $("<div class='zdbgjjournal_pb'>");
					journal_pb.css({
						'width': '800px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'left': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});


					journal_pb.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【预约及天选含抽奖屏蔽词日志】</legend>
	<div data-toggle="journal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="journal_pb" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.journal_pb}</span>
	</div>

	<div data-toggle="journal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal_pb);
					$('.zdbgjjournal_pb').hide()
					journal_pb.find('div[data-toggle="journal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal_pb').toggle()
					})
					journal_pb.find('div[data-toggle="journal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.journal_pb = []
						MY_API.saveConfig()
						$('#journal_pb span:eq(0)').text(MY_API.CONFIG.journal_pb)
						let dt = document.getElementById('journal_pb'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.journal_pb
					})
					tj.find('div[data-toggle="medal_change"] [data-action="save11"]').click(async function () {
						$('.zdbgjjournal_pb').toggle()
						$('#journal_pb span:eq(0)').text(MY_API.CONFIG.journal_pb)
						let dt = document.getElementById('journal_pb'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.journal_pb
					});

					let journal1 = $("<div class='zdbgjjournal1'>");
					journal1.css({
						'width': '460px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal1.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【免费天选日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal1);
					$('.zdbgjjournal1').hide()
					journal1.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal1').toggle()
					});
					journal1.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal = []
						MY_API.saveConfig()
						$('#freejournal span:eq(0)').text(MY_API.CONFIG.freejournal)
						let dt = document.getElementById('freejournal'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save1"]').click(async function () {
						$('.zdbgjjournal1').toggle()
						$('#freejournal span:eq(0)').text(MY_API.CONFIG.freejournal)
						let dt = document.getElementById('freejournal'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal
					});

					let journal2 = $("<div class='zdbgjjournal2'>");
					journal2.css({
						'width': '360px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal2.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【活动抽奖日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal2" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal2}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal2);
					$('.zdbgjjournal2').hide()
					journal2.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal2').toggle()
					});
					journal2.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal2 = []
						MY_API.saveConfig()
						$('#freejournal2 span:eq(0)').text(MY_API.CONFIG.freejournal2)
						let dt = document.getElementById('freejournal2'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal2
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save2"]').click(async function () {
						$('.zdbgjjournal2').toggle()
						$('#freejournal2 span:eq(0)').text(MY_API.CONFIG.freejournal2)
						let dt = document.getElementById('freejournal2'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal2
					});

					let journal3 = $("<div class='zdbgjjournal3'>");
					journal3.css({
						'width': '460px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal3.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【实物宝箱抽奖日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal3" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal3}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal3);
					$('.zdbgjjournal3').hide()
					journal3.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal3').toggle()
					});
					journal3.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {

						MY_API.CONFIG.freejournal3 = []
						MY_API.saveConfig()
						$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
						let dt = document.getElementById('freejournal3'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal3
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save3"]').click(async function () {
						$('.zdbgjjournal3').toggle()
						$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
						let dt = document.getElementById('freejournal3'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal3
					});

					let journal4 = $("<div class='zdbgjjournal4'>");
					journal4.css({
						'width': '880px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal4.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【天选信息全日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal4" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal4}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal4);
					$('.zdbgjjournal4').hide()
					journal4.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal4').toggle()
					});
					journal4.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal4 = []
						MY_API.saveConfig()
						$('#freejournal4 span:eq(0)').text(MY_API.CONFIG.freejournal4)
						let dt = document.getElementById('freejournal4'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal4
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save4"]').click(async function () {
						$('.zdbgjjournal4').toggle()
						$('#freejournal4 span:eq(0)').text(MY_API.CONFIG.freejournal4)
						let dt = document.getElementById('freejournal4'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal4
					});


					let journal5 = $("<div class='zdbgjjournal5'>");
					journal5.css({
						'width': '880px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal5.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【动态抽奖日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal5" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal5}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal5);
					$('.zdbgjjournal5').hide()
					journal5.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal5').toggle()
					});
					journal5.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal5 = []
						MY_API.saveConfig()
						$('#freejournal5 span:eq(0)').text(MY_API.CONFIG.freejournal5)
						let dt = document.getElementById('freejournal5'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal5
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save5"]').click(async function () {
						$('.zdbgjjournal5').toggle()
						$('#freejournal5 span:eq(0)').text(MY_API.CONFIG.freejournal5)
						let dt = document.getElementById('freejournal5'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal5
					});


					let journal6 = $("<div class='zdbgjjournal6'>");
					journal6.css({
						'width': '880px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal6.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【直播预约抽奖日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>

	<div id="freejournal6" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal6}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal6);
					$('.zdbgjjournal6').hide()
					journal6.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal6').toggle()
					});
					journal6.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal6 = []
						MY_API.saveConfig()
						$('#freejournal6 span:eq(0)').text(MY_API.CONFIG.freejournal6)
						let dt = document.getElementById('freejournal6'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal6
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save6"]').click(async function () {
						$('.zdbgjjournal6').toggle()
						$('#freejournal6 span:eq(0)').text(MY_API.CONFIG.freejournal6)
						let dt = document.getElementById('freejournal6'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal6
					});

					let journal7 = $("<div class='zdbgjjournal7'>");
					journal7.css({
						'width': '385px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '785px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal7.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【欧皇中奖日志】</legend>

	<div data-toggle="freejournal_mark">
	<input id="freejournal_mark" class="num" style="width:20px;" type="text">
	<button data-action="save" style="font-size: 100%;color: #000000;" >标记</button>
	</div>

	<div id="freejournal7" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal7}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal7);
					$('.zdbgjjournal7').hide()
					journal7.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						for(let i=0;i<MY_API.CONFIG.freejournal7.length;i++){
							if(MY_API.CONFIG.freejournal7[i].indexOf('序号')==-1)MY_API.CONFIG.freejournal7[i] = MY_API.CONFIG.freejournal7[i]+`【序号${i+1}】`
						}
						$('.zdbgjjournal7').toggle()
					});
					for(let i=0;i<MY_API.CONFIG.freejournal7.length;i++){
						if(MY_API.CONFIG.freejournal7[i].indexOf('序号')==-1)MY_API.CONFIG.freejournal7[i] = MY_API.CONFIG.freejournal7[i]+`【序号${i+1}】`
					}
					journal7.find('div[data-toggle="freejournal_mark"] .num').val('1');
					journal7.find('div[data-toggle="freejournal_mark"] [data-action="save"]').click(async function () {
						let val = parseInt(journal7.find('div[data-toggle="freejournal_mark"] .num').val());
						if(val>MY_API.CONFIG.freejournal7.length || val<1)return MY_API.chatLog(`【中奖日志标记】序号输入不正确！`, 'warning');
						if(MY_API.CONFIG.freejournal7[val-1].indexOf('√')==-1){
							MY_API.CONFIG.freejournal7[val-1] = MY_API.CONFIG.freejournal7[val-1] + `【√】`
						}else{
							MY_API.CONFIG.freejournal7[val-1] = MY_API.CONFIG.freejournal7[val-1].replaceAll('【√】', '')
						}
						$('#freejournal7 span:eq(0)').text(MY_API.CONFIG.freejournal7)
						let dt = document.getElementById('freejournal7'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal7
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save7"]').click(async function () {
						for(let i=0;i<MY_API.CONFIG.freejournal7.length;i++){
							if(MY_API.CONFIG.freejournal7[i].indexOf('序号')==-1)MY_API.CONFIG.freejournal7[i] = MY_API.CONFIG.freejournal7[i]+`【序号${i+1}】`
						}
						$('.zdbgjjournal7').toggle()
						$('#freejournal7 span:eq(0)').text(MY_API.CONFIG.freejournal7)
						let dt = document.getElementById('freejournal7'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal7
					});

					let journal8 = $("<div class='zdbgjjournal8'>");
					journal8.css({
						'width': '380px',
						'height': '800px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '50px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
						'user-select': 'text',
					});

					journal8.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【大锦鲤专栏动态抽奖日志】</legend>
	<div data-toggle="freejournal_clear">
	<button data-action="save" style="font-size: 100%;color: #000000;" >清空日志</button>
	</div>
	<append style="font-size: 100%;color: blue;" >注：非官方动态抽奖往往附加很多要求，可能不能达到要求，还存在黑幕黑箱操作，
	详情点击下方动态页，目前仅支持关注、点赞、转发、评论四连。<br>抽奖信息来源：_大锦鲤_专栏
	(第二天或近期开奖的使用非官方工具开奖的动态抽奖，可能会转发包含早前漏掉的部分官方抽奖！)。

	<div id="freejournal8" style="font-size: 100%;color:#000000;">
	<span>${MY_API.CONFIG.freejournal8}</span>
	</div>

	<div data-toggle="freejournal_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:10%" >关闭</button>
	</div>
	</fieldset>
	`);

					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(journal8);
					$('.zdbgjjournal8').hide()
					journal8.find('div[data-toggle="freejournal_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjjournal8').toggle()
					});
					journal8.find('div[data-toggle="freejournal_clear"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.freejournal8 = []
						MY_API.saveConfig()
						$('#freejournal8 span:eq(0)').text(MY_API.CONFIG.freejournal8)
						let dt = document.getElementById('freejournal8'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal8
					});
					tj.find('div[data-toggle="medal_change"] [data-action="save8"]').click(async function () {
						$('.zdbgjjournal8').toggle()
						$('#freejournal8 span:eq(0)').text(MY_API.CONFIG.freejournal8)
						let dt = document.getElementById('freejournal8'); //通过id获取该div
						dt.innerHTML  = MY_API.CONFIG.freejournal8
					});

					let tags = $("<div class='zdbgjtags'>");
					tags.css({
						'width': '460px',
						'height': '600px',
						'max-height': `${heightmax}px`,
						'position': 'absolute',
						'top': '10px',
						'right': '200px',
						'background': 'rgba(255,255,255,.9)',
						'padding': '10px',
						'z-index': '9999',
						'border-radius': '12px',
						'transition': 'height .3s',
						'overflow': 'auto',
						'line-height': '15px',
					});
					var now_num = 0,
						now_p = '无',
						num_length = 0,
						getmsg_now_p = '无',
						getmsg_now_num = 0,
						getmsg_num_length = 0
					tags.append(`
	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【一键分组及取关】</legend>

	<append style="font-size: 100%;color:#000000;">
	&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp同时勾选时：将按优先级顺序天选中奖主播、低粉主播、天选鸽子主播、动态鸽子对默认关注分组依次进行分组！请勿重复点击！<br>
	&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp天选鸽子主播分组依赖本地积累的数据！<br>
	&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp如果有卡住的情况，大多是获取数据过频被限制访问了，可去掉卡住的进度项，刷新后再次尝试！<br>
	<br>
	<div id="now_num" style="font-size: 100%;color:#000000;">
	当前操作：<span>${now_p}</span>进度：<span>${now_num}</span>/<span>${num_length}</span>
	</div>

	<div data-toggle="tags1">
	<button data-action="save" style="font-size: 100%;color: #000000" >对默认关注分组进行一键分组！</button>
	</div>

	<div data-toggle="tags6">
	<input style="vertical-align: text-top;" type="checkbox">天选中奖主播：天选抽奖中过奖的主播<br>
	</div>

	<div data-toggle="tags2">
	<input style="vertical-align: text-top;" type="checkbox">低粉丝量主播：粉丝数量低于<input class="num" style="width: 50px;" type="text">的主播
	<button data-action="save" style="font-size: 100%;color: #000000" >保存</button>
	<button data-action="save1" style="font-size: 100%;color: #000000" >一键取关！</button>
	</div>

	<div data-toggle="tags4">
	<input style="vertical-align: text-top;" type="checkbox">天选鸽子主播：天选时刻超过<input class="num" style="width: 16px;" type="text">天未开的主播
	<button data-action="save" style="font-size: 100%;color: #000000" >保存</button>
	<button data-action="save1" style="font-size: 100%;color: #000000" >一键取关！</button><br>
	</div>

	<div data-toggle="tags5">
	<input style="vertical-align: text-top;" type="checkbox">动态鸽子主播：超过<input class="num" style="width: 16px;" type="text">天未发动态的主播
	<button data-action="save" style="font-size: 100%;color: #000000" >保存</button>
	<button data-action="save1" style="font-size: 100%;color: #000000" >一键取关！</button><br>
	</div>

	<div data-toggle="tags_shutdown">
	<button data-action="save" style="font-size: 100%;color: #000000;position:absolute;top:10px;right:15%" >关闭</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【无私信/关注自动回复一键取关】</legend>
	<append style="font-size: 100%;color:#000000;">
	注：仅操作默认分组！每满50取关，暂停一分钟！

	<div data-toggle="getmsg">
	<apend style="font-size: 100%; color: #000000">
	<input style="vertical-align: text-top;" type="checkbox">关注直播主播数量大于<input class="num" style="width: 50px;" type="text">时自动取关无私信主播
	<button data-action="save1" style="font-size: 100%;color: #000000" >保存</button>
	<button id="getmsg" data-action="save" style="font-size: 100%;color: #000000" >一键取关无私信主播</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【一键取关默认分组】</legend>
	<append style="font-size: 100%;color:#000000;">
	<div data-toggle="tags7">
	<button id = "tags7" data-action="save" style="font-size: 100%;color: #000000" >一键取关默认分组主播</button>
	</div>
	</fieldset>

	<fieldset>
	<legend  style="font-size: 100%;color:#000000;">【一键拉黑及屏蔽主播直播间】</legend>
	<append style="font-size: 100%;color:#000000;">
	<div data-toggle="tags3">
	<button id = "tags3" data-action="save" style="font-size: 100%;color: #000000" >一键拉黑及屏蔽主播直播间！</button>
	填写直播间真实房间号，英文逗号【,】隔开
	</div>
	<br>
	<textarea id="textareainput" rows="12" cols="64" style="position: relative; bottom :10px; left: 0px;z-index:999;color: #00000075;border-radius: 2px;border: solid;border-width: 1px;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">${MY_API.CONFIG.ignore_room}</textarea>
	</fieldset>

	`);

					if (MY_API.CONFIG.AUTO_activity_lottery)
						tj.find('div[data-toggle="AUTO_activity_lottery"] input:checkbox').attr('checked', '');
					tj.find('div[data-toggle="AUTO_activity_lottery"] input:checkbox').change(async function () { //
						MY_API.CONFIG.AUTO_activity_lottery = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`【活动抽奖】开关设置：${MY_API.CONFIG.AUTO_activity_lottery}！`);
					});


					tj.find('div[data-toggle="AUTO_activity_lottery"] [data-action="save"]').click(async function () { //
						if (activity_lottery_run_mark) {
							await MY_API.new_activity_lottery()
							await MY_API.activity_lottery()
						} else {
							MY_API.chatLog(`【活动抽奖】请勿重复操作！`);
						}
					});
					tj.find('div[data-toggle="AUTO_activity_lottery_time"] .hour').val((parseInt(MY_API.CONFIG.AUTO_activity_lottery_time_hour)).toString());
					tj.find('div[data-toggle="AUTO_activity_lottery_time"] .min').val((parseInt(MY_API.CONFIG.AUTO_activity_lottery_time_min)).toString());

					tj.find('div[data-toggle="AUTO_activity_lottery_time"] [data-action="save"]').click(function () {
						MY_API.CONFIG.AUTO_activity_lottery_time_hour = parseInt(tj.find('div[data-toggle="AUTO_activity_lottery_time"] .hour').val());
						if (MY_API.CONFIG.AUTO_activity_lottery_time_hour < 0 || MY_API.CONFIG.AUTO_activity_lottery_time_hour > 23) {
							MY_API.chatLog('请设置0-23');
						}
						MY_API.CONFIG.AUTO_activity_lottery_time_min = parseInt(tj.find('div[data-toggle="AUTO_activity_lottery_time"] .min').val());
						if (MY_API.CONFIG.AUTO_activity_lottery_time_min < 0 || MY_API.CONFIG.AUTO_activity_lottery_time_min > 59) {
							MY_API.chatLog('请设置0-59');
						}
						MY_API.saveConfig()
						MY_API.chatLog(`自动设置【时-分】：${MY_API.CONFIG.AUTO_activity_lottery_time_hour}-${MY_API.CONFIG.AUTO_activity_lottery_time_min}`);
					});

					let ignore_room_array = []
					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(tags);
					$('.zdbgjtags').hide()


					tags.find('div[data-toggle="tags3"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.ignore_room = $("#textareainput").val().split(",");
						if (MY_API.CONFIG.ignore_room == '' || MY_API.CONFIG.ignore_room[0] == 0) {
							MY_API.chatLog(`【一键拉黑】名单为空！`);
							return;
						}
						for (let i = 0; i < MY_API.CONFIG.ignore_room.length; i++) {
							ignore_room_array[i] = Number(MY_API.CONFIG.ignore_room[i])
						}
						for (let i = 0; i < MY_API.CONFIG.ignore_room.length; i++) {
							let num1 = MY_API.CONFIG.Anchor_ignore_uid.indexOf(Number(MY_API.CONFIG.ignore_room[i]))
							if (num1 == -1)MY_API.CONFIG.Anchor_ignore_uid.push(Number(MY_API.CONFIG.ignore_room[i]));
						}
						MY_API.saveConfig();
						MY_API.chatLog(`【一键拉黑取关】一键拉黑名单：${MY_API.CONFIG.ignore_room}！`);
						MY_API.chatLog(`【一键拉黑取关】屏蔽黑名单：${MY_API.CONFIG.Anchor_ignore_uid}！`);
						console.log($("#textareainput").val());
						console.log(ignore_room_array)
						let ignore_max_mark=0
						for (let i = 0; i < ignore_room_array.length; i++) {
							now_p = '【一键拉黑】'
							now_num = i + 1
							num_length = ignore_room_array.length
							$('#now_num span:eq(0)').text(now_p);
							$('#now_num span:eq(1)').text(now_num);
							$('#now_num span:eq(2)').text(num_length);
							await sleep(1000)
							if(ignore_max_mark){//黑名单已满
								if (MY_API.CONFIG.room_ruid.indexOf(ignore_room_array[i]) > -1 ) {
									let num = MY_API.CONFIG.room_ruid.indexOf(ignore_room_array[i])
									BAPI.modify(MY_API.CONFIG.room_ruid[num + 1], 2).then(async(data) => {
										console.log(data)
										if (data.code == 0) {
											MY_API.chatLog(`【一键拉黑取关】UID：${ignore_room_array[i]}取关成功！`);
										} else {
											MY_API.chatLog(`【一键拉黑取关】${data.message}！`);
										}
									})
								} else {
									await BAPI.live_user.get_anchor_in_room(ignore_room_array[i]).then(async(data) => {
										if (data.data.info == undefined)
											return MY_API.chatLog(`【一键拉黑取关】用户不存在！`, 'warning');
										let anchor_uid = data.data.info.uid;
										BAPI.modify(anchor_uid, 2).then(async(data) => {
											console.log(data)
											if (data.code == 0) {
												MY_API.chatLog(`【一键拉黑取关】UID：${ignore_room_array[i]}取关成功！`);
											} else {
												MY_API.chatLog(`【一键拉黑取关】${data.message}！`);
											}
										})
									}, () => {
										MY_API.chatLog(`【一键拉黑取关】anchor_uid获取失败！`, 'warning');
									});
								}

							}else{//黑名单未满
								if (MY_API.CONFIG.room_ruid.indexOf(ignore_room_array[i]) > -1 ) {
									let num = MY_API.CONFIG.room_ruid.indexOf(ignore_room_array[i])
									BAPI.modify(MY_API.CONFIG.room_ruid[num + 1], 5).then(async(data) => {
										console.log(data)
										if (data.code == 0) {
											MY_API.chatLog(`【一键拉黑】${ignore_room_array[i]}拉黑成功！`);
										} else if(data.code ==22008){//黑名单已满
											ignore_max_mark=1
											i--
											MY_API.chatLog(`【一键拉黑】${data.message}！`);
										}else{
											MY_API.chatLog(`【一键拉黑】${data.message}！`);
										}
									})
								} else {
									await BAPI.live_user.get_anchor_in_room(ignore_room_array[i]).then(async(data) => {
										if (data.data.info == undefined)
											return MY_API.chatLog(`【一键拉黑】用户不存在！`, 'warning');
										let anchor_uid = data.data.info.uid;
										BAPI.modify(anchor_uid, 5).then(async(data) => {
											console.log(data)
											if (data.code == 0) {
												MY_API.chatLog(`【一键拉黑】${ignore_room_array[i]}拉黑成功！`);
											} else if(data.code ==22008){//黑名单已满
												ignore_max_mark=1
												i--
												MY_API.chatLog(`【一键拉黑】${data.message}！`);
											}else{
												MY_API.chatLog(`【一键拉黑】${data.message}！`);
											}
										})
									}, () => {
										MY_API.chatLog(`【一键拉黑】anchor_uid获取失败！`, 'warning');
									});
								}
							}
						}
						now_p = '【一键拉黑完成】'
						$('#now_num span:eq(0)').text(now_p);
					});
					let get_tags_mid_list = async function (pn,group_tag_id) {
						await sleep(100)
						if (pn == 1)
							tags_mid_list = [];
						return BAPI.get_tags_mid(Live_info.uid, group_tag_id, pn).then((data) => { //0默认关注分组-10特别关注分组
							let midlist = data.data
							if (midlist.length > 0) {
								now_p = '【获取分组数据】'
								now_num = tags_mid_list.length
								num_length = tags_mid_list.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								for (let i = 0; i < midlist.length; i++) {
									tags_mid_list.push(midlist[i].mid)
								}
								return get_tags_mid_list(pn + 1,group_tag_id)
							}
						}, () => {
							return MY_API.chatLog('获取数据出错！', 'warning');
						})
					}
					let get_tags_data = async function () { //获取分组数据
						await BAPI.get_tags().then(async(data) => {
							console.log(tags_name, tags_tagid)
							let tags_data = data.data
							tags_name = []
							tags_tagid = []
							for (let i = 0; i < tags_data.length; i++) {
								tags_name[i] = tags_data[i].name
								tags_tagid[i] = tags_data[i].tagid
							}
							console.log(tags_name, tags_tagid)
						});
					}
					tags.find('div[data-toggle="tags7"] [data-action="save"]').click(async function () {
						if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
						let r = confirm("点击确定，一键取关默认分组主播!");
						if (r == true) {
							MY_API.chatLog(`【一键取关】开始获取默认分组数据！`);
							await get_tags_mid_list(1,0)//0默认分组
							MY_API.chatLog(`【一键取关】完成获取默认分组数据！`);
							console.log(tags_mid_list)
							groupmove_mark = false
							if (tags_mid_list.length == 0) {
								return MY_API.chatLog(`【一键取关】默认分组无数据！`);
							}
							MY_API.chatLog(`【一键取关】默认分组开始取关！`);
							for (let i = 0; i < tags_mid_list.length; i++) {
								await sleep(1000)
								if(i % 2 == 0){
									$("#tags7").css("color", "red")
								}else{
									$("#tags7").css("color", "#000000")
								}
								now_p = '【一键取关默认分组】'
								now_num = i + 1
								num_length = tags_mid_list.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								BAPI.modify(tags_mid_list[i], 2).then((data) => {
									//console.log('默认分组主播', data)
									if (data.code == 0)
										MY_API.chatLog(`【一键取关】默认分组主播：${tags_mid_list[i]}取关成功`);
								})
							}
							now_p = '【一键取关默认分组完成】'
							$('#now_num span:eq(0)').text(now_p);
							groupmove_mark = true
							$("#tags7").css("color", "#000000")
							MY_API.chatLog(`【一键取关】默认分组取关结束！`);
						}
					})
					div.find('div[data-toggle="tags"] [data-action="save"]').click(async function () {
						$('.zdbgjtags').toggle()
					});
					tags.find('div[data-toggle="tags1"] [data-action="save"]').click(async function () {
						if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
						groupmove_mark = false
						MY_API.chatLog(`【一键分组】同时勾选时：将按优先级顺序天选中奖主播、低粉主播、鸽子主播、动态鸽子对默认关注分组依次进行分组！`);
						await get_tags_data()
						if(tags_name.indexOf('中奖主播')==-1){
							await BAPI.tag_create('中奖主播').then(async(data) => {
								console.log(data)
								if (data.code == 0) {
									MY_API.chatLog(`【一键分组】中奖主播分组创建成功！`);
								}else{
									MY_API.chatLog(`【一键分组】中奖主播分组:${data.message}`);
								}
							});
						}
						if(tags_name.indexOf('低粉主播')==-1){
							await BAPI.tag_create('低粉主播').then(async(data) => {
								await sleep(2000)
								console.log(data)
								if (data.code == 0) {
									MY_API.chatLog(`【一键分组】低粉主播分组创建成功！`);
								}else{
									MY_API.chatLog(`【一键分组】低粉主播分组${data.message}`);
								}
							});
						}
						if(tags_name.indexOf('鸽子主播')==-1){
							await BAPI.tag_create('鸽子主播').then(async(data) => {
								await sleep(2000)
								console.log(data)
								if (data.code == 0) {
									MY_API.chatLog(`【一键分组】鸽子主播分组分组创建成功！`);
								}else{
									MY_API.chatLog(`【一键分组】鸽子主播分组${data.message}`);
								}
							});
						}
						if(tags_name.indexOf('动态鸽子')==-1){
							await BAPI.tag_create('动态鸽子').then(async(data) => {
								await sleep(2000)
								console.log(data)
								if (data.code == 0) {
									MY_API.chatLog(`【一键分组】动态鸽子主播分组分组创建成功！`);
								}else{
									MY_API.chatLog(`【一键分组】动态鸽子主播分组${data.message}`);
								}
							});
						}
						if(MY_API.CONFIG.tags6_checkbox){
							MY_API.chatLog(`【一键分组】正在获取默认关注分组数据`);
							await get_tags_mid_list(1,0)//0默认分组
							console.log('第一次默认分组数据', tags_mid_list)
							MY_API.chatLog(`【一键分组】获取默认关注分组数据已完成`);
							MY_API.chatLog(`【一键分组】正在获取天选中奖数据`);
							let AnchorRecord_uid = []//天选信息uid
							let get_AnchorRecord = async function (pn = 1) {
								now_p = '【获取天选中奖数据】'
								now_num = AnchorRecord_uid.length
								num_length = AnchorRecord_uid.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								await sleep(100)
								if (pn == 1)
									AnchorRecord_uid = [];
								await BAPI.Lottery.anchor.AnchorRecord(pn).then((data) => {
									console.log('AnchorRecord_uid', data)
									let adata = data.data.list
									for (let i = 0; i < adata.length; i++) {
										AnchorRecord_uid.push(adata[i].anchor_uid)
									}
									console.log('获取天选中奖信息', AnchorRecord_uid)
									if (pn < data.data.page_count)
										return get_AnchorRecord(pn + 1)
								}, async() => {
									MY_API.chatLog('【一键分组】获取中奖数据出错，暂停10分钟！', 'warning');
									now_p = '【风控暂停】'
									await sleep(600000)
									return get_AnchorRecord(pn)
								});
							};
							await get_AnchorRecord()
							MY_API.chatLog(`【一键分组】获取天选中奖数据已完成`);
							MY_API.chatLog(`【一键分组】正在移动至天选中奖主播分组`);
							let move_AnchorRecord_uid = async function () {
								let auid = tags_name.indexOf('中奖主播')
								if(auid==-1)return
								for (let i = 0; i < AnchorRecord_uid.length; i++) {
									now_p = '【移动至天选中奖分组】'
									now_num = i + 1
									num_length = AnchorRecord_uid.length
									$('#now_num span:eq(0)').text(now_p);
									$('#now_num span:eq(1)').text(now_num);
									$('#now_num span:eq(2)').text(num_length);
									if (tags_mid_list.indexOf(AnchorRecord_uid[i]) > -1) {
										await sleep(1000)
										BAPI.tags_addUsers(AnchorRecord_uid[i], tags_tagid[auid]).then((data) => {
											console.log('move中奖主播', data)
										})
									}
								}
							}
							await move_AnchorRecord_uid()
							now_p = '【移动至天选中奖分组完成】'
							$('#now_num span:eq(0)').text(now_p);
							MY_API.chatLog(`【一键分组】天选中奖主播分组已完成`);
						}

						if(MY_API.CONFIG.tags2_checkbox && MY_API.CONFIG.tags2_min){
							await get_tags_mid_list(1,0)//0默认分组//刷新默认分组数据
							console.log('刷新默认分组数据', tags_mid_list)
							MY_API.chatLog(`【一键分组】正在获取主播粉丝数量及移动至低粉主播分组`);
							let move_lowfans_uid = async function () {
								if (MY_API.CONFIG.tags2_min == 0)return
								let auid = tags_name.indexOf('低粉主播')
								if(auid==-1)return
								for (let i = 0; i < tags_mid_list.length; i++) {
									now_p = '【获取粉丝数量及移动分组】'
									now_num = i + 1
									num_length = tags_mid_list.length
									$('#now_num span:eq(0)').text(now_p);
									$('#now_num span:eq(1)').text(now_num);
									$('#now_num span:eq(2)').text(num_length);
									await sleep(1000)
									await BAPI.web_interface_card(tags_mid_list[i]).then(async(data) => {
										let fansnum = data.data.follower
										if (fansnum < MY_API.CONFIG.tags2_min) {
											console.log('粉丝数量', fansnum,tags_tagid[auid])
											await BAPI.tags_addUsers(tags_mid_list[i], tags_tagid[auid]).then((data) => {
												lowfans_uid.push(tags_mid_list[i])
												console.log('move低粉主播', data)
											})
										}
									},async() => {
										MY_API.chatLog(`【低粉主播】获取粉丝数据出错，暂停10分钟！`, 'warning');
										now_p = '【低粉主播】暂停中'
										$('#now_num span:eq(0)').text(now_p);
										await sleep(60000)
										i--
									})
								}
							}
							await move_lowfans_uid()
							now_p = '【低粉主播分组完成】'
							$('#now_num span:eq(0)').text(now_p);
							MY_API.chatLog(`【一键分组】低粉主播分组完成`);
						}

						if(MY_API.CONFIG.tags4_checkbox && MY_API.CONFIG.tags4_min){
							await get_tags_mid_list(1,0)//0默认分组//刷新默认分组数据
							console.log('刷新默认分组数据', tags_mid_list)
							MY_API.chatLog(`【一键分组】开始鸽子主播分组`);
							let move_room_AnchorRecord_time = async function () {
								let auid = tags_name.indexOf('鸽子主播')
								if(auid==-1)return
								for (let i = 0; i < MY_API.CONFIG.room_AnchorRecord_time.length; i = i + 2) {
									now_p = '【获取鸽子主播数据及分组】'
									now_num = i + 2
									num_length = MY_API.CONFIG.room_AnchorRecord_time.length
									$('#now_num span:eq(0)').text(now_p);
									$('#now_num span:eq(1)').text(now_num);
									$('#now_num span:eq(2)').text(num_length);
									let rr = MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.room_AnchorRecord_time[i])
									if (ts_s() - MY_API.CONFIG.room_AnchorRecord_time[i + 1] > 3600 * 24 * MY_API.CONFIG.tags4_min && tags_mid_list.indexOf(MY_API.CONFIG.room_ruid[rr + 1]) > -1) {
										await BAPI.tags_addUsers(MY_API.CONFIG.room_ruid[rr + 1], tags_tagid[auid]).then((data) => {
											console.log('move天选鸽子主播', data)
										})
										await sleep(500)
									}
								}
							}
							await move_room_AnchorRecord_time()
							now_p = '【天选鸽子主播分组完成】'
							$('#now_num span:eq(0)').text(now_p);
							MY_API.chatLog(`【一键分组】天选鸽子主播分组完成`);
						}
						if(MY_API.CONFIG.tags5_checkbox && MY_API.CONFIG.tags5_min){//动态鸽子
							await get_tags_mid_list(1,0)//0默认分组//刷新默认分组数据
							console.log('刷新默认分组数据', tags_mid_list)
							MY_API.chatLog(`【一键分组】开始动态鸽子主播分组`);
							for(let i = 0; i < tags_mid_list.length; i++){
								now_p = '【获取动态鸽子主播数据及移动分组】'
								now_num = i + 1
								num_length = tags_mid_list.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								await BAPI.space_history(tags_mid_list[i]).then(function (data) {
									console.log('data',data)
									if(data.data.cards ==undefined || data.data.cards[0].desc ==undefined)return space_history_uid.push(tags_mid_list[i])
									let cards = data.data.cards
									let timestamp = cards[0].desc.timestamp
									if(cards[1] != undefined && cards[1].desc != undefined && timestamp<cards[1].desc.timestamp)return timestamp = cards[1].desc.timestamp
									if(ts_s()-timestamp>MY_API.CONFIG.tags5_min * 3600 *24)space_history_uid.push(tags_mid_list[i])
								})
								await sleep(5000)
							}
							now_p = '【动态鸽子主播分组完成】'
							$('#now_num span:eq(0)').text(now_p);
							MY_API.chatLog(`【一键分组】动态鸽子主播分组完成`);
						}
						groupmove_mark = true
					});

					////鸽子主播
					tags.find('div[data-toggle="tags4"] .num').val(parseInt(MY_API.CONFIG.tags4_min.toString()))
					tags.find('div[data-toggle="tags4"] [data-action="save"]').click(async function () {
						console.log(tags.find('div[data-toggle="tags4"] .num').val())
						MY_API.CONFIG.tags4_min = parseInt(tags.find('div[data-toggle="tags4"] .num').val())
						MY_API.saveConfig()
						MY_API.chatLog(`鸽子主播设置：${MY_API.CONFIG.tags4_min}`);
					});
					tags.find('div[data-toggle="tags4"] [data-action="save1"]').click(async function () {
						let r = confirm("点击确定，一键取关鸽子主播!");
						if (r == true) {
							if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
							groupmove_mark = false
							await get_tags_data()
							let num = tags_name.indexOf('鸽子主播')
							if (room_AnchorRecord_time_uid.length == 0 && num==-1) {
								return MY_API.chatLog(`【一键取关】鸽子主播分组无数据！`);
							}
							await get_tags_mid_list(1,tags_tagid[num])
							for(let i=0;i<tags_mid_list.length;i++){
								if(room_AnchorRecord_time_uid.indexOf(tags_mid_list[i])==-1)room_AnchorRecord_time_uid.push(tags_mid_list[i])
							}
							for (let i = 0; i < room_AnchorRecord_time_uid.length; i++) {
								now_p = '【一键取关】取关鸽子主播'
								now_num = i + 1
								num_length = room_AnchorRecord_time_uid.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								await sleep(1000)
								BAPI.modify(room_AnchorRecord_time_uid[i], 2).then((data) => {
									console.log('鸽子主播取关', data)
									if (data.code == 0)
										MY_API.chatLog(`【一键取关】鸽子主播UID：${room_AnchorRecord_time_uid[i]}取关成功`);
								})
							}
							now_p = '【取关鸽子主播完成】'
							$('#now_num span:eq(0)').text(now_p);
							groupmove_mark = true
						}
					})

					tags.find('div[data-toggle="tags2"] .num').val(parseInt(MY_API.CONFIG.tags2_min.toString()))
					tags.find('div[data-toggle="tags2"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.tags2_min = parseInt(tags.find('div[data-toggle="tags2"] .num').val())
						MY_API.saveConfig()
						MY_API.chatLog(`低粉主播设置：${MY_API.CONFIG.tags2_min}`);
					});
					tags.find('div[data-toggle="tags_shutdown"] [data-action="save"]').click(async function () {
						$('.zdbgjtags').toggle()
					});

					if (MY_API.CONFIG.tags2_checkbox)
						tags.find('div[data-toggle="tags2"] input').attr('checked', '');
					tags.find('div[data-toggle="tags2"] input:checkbox').change(function () {
						MY_API.CONFIG.tags2_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`低粉主播设置：${MY_API.CONFIG.tags2_checkbox}`);
					});

					if (MY_API.CONFIG.tags4_checkbox)
						tags.find('div[data-toggle="tags4"] input').attr('checked', '');

					tags.find('div[data-toggle="tags4"] input:checkbox').change(function () {
						MY_API.CONFIG.tags4_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`天选鸽子设置：${MY_API.CONFIG.tags4_checkbox}`);
					});

					if (MY_API.CONFIG.tags6_checkbox)
						tags.find('div[data-toggle="tags6"] input').attr('checked', '');
					tags.find('div[data-toggle="tags6"] input:checkbox').change(function () {
						MY_API.CONFIG.tags6_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`中奖主播设置：${MY_API.CONFIG.tags6_checkbox}`);
					});

					if (MY_API.CONFIG.tags5_checkbox)
						tags.find('div[data-toggle="tags5"] input').attr('checked', '');
					tags.find('div[data-toggle="tags5"] input:checkbox').change(function () {
						MY_API.CONFIG.tags5_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`动态鸽子设置：${MY_API.CONFIG.tags5_checkbox}`);
					});

					tags.find('div[data-toggle="tags5"] .num').val(parseInt(MY_API.CONFIG.tags5_min.toString()))
					tags.find('div[data-toggle="tags5"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.tags5_min = parseInt(tags.find('div[data-toggle="tags5"] .num').val())
						MY_API.saveConfig()
						MY_API.chatLog(`动态鸽子设置：${MY_API.CONFIG.tags5_min}`);
					});

					tags.find('div[data-toggle="tags5"] [data-action="save1"]').click(async function () {
						let r = confirm("点击确定，一键取关动态鸽子主播!");
						if (r == true) {
							if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
							groupmove_mark = false
							await get_tags_data()
							let num = tags_name.indexOf('动态鸽子')
							if (space_history_uid.length == 0 && num==-1) {
								return MY_API.chatLog(`【一键取关】动态鸽子主播分组无数据！`);
							}
							await get_tags_mid_list(1,tags_tagid[num])
							for(let i=0;i<tags_mid_list.length;i++){
								if(space_history_uid.indexOf(tags_mid_list[i])==-1)space_history_uid.push(tags_mid_list[i])
							}
							for (let i = 0; i < space_history_uid.length; i++) {
								now_p = '【一键取关】取关动态鸽子主播'
								now_num = i + 1
								num_length = space_history_uid.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								await sleep(1000)
								BAPI.modify(space_history_uid[i], 2).then((data) => {
									console.log('动态鸽子主播取关', data)
									if (data.code == 0)
										MY_API.chatLog(`【一键取关】动态鸽子主播UID：${space_history_uid[i]}取关成功`);
								})
							}
							now_p = '【取关动态鸽子主播完成】'
							$('#now_num span:eq(0)').text(now_p);
							groupmove_mark = true
						}
					})

					if (MY_API.CONFIG.getmsg)
						tags.find('div[data-toggle="getmsg"] input').attr('checked', '');
					tags.find('div[data-toggle="getmsg"] input:checkbox').change(function () {
						MY_API.CONFIG.getmsg = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`无私信主播设置：${MY_API.CONFIG.getmsg}`);
					});

					tags.find('div[data-toggle="getmsg"] .num').val(parseInt(MY_API.CONFIG.getmsg_num.toString()))
					tags.find('div[data-toggle="getmsg"] [data-action="save1"]').click(async function () {
						let val = parseInt(tags.find('div[data-toggle="getmsg"] .num').val())
						if(val <= 2000 && val > 1950) {
							MY_API.chatLog('直播主播数量不包含未直播的UP！上限不大于2000，建议1900', 'warning');
							val = 1900
						}
						if(val > 2000 ){
							MY_API.chatLog('直播主播数量不包含未直播的UP！上限不大于2000，建议1900', 'warning');
							val = 1900
						}
						MY_API.CONFIG.getmsg_num = val
						MY_API.saveConfig()
						MY_API.chatLog(`无私信主播设置：${MY_API.CONFIG.getmsg_num}`);
					});

					tags.find('div[data-toggle="getmsg"] [data-action="save"]').click(async function () {
						if(getmsg_mark == false || groupmove_mark == false) return MY_API.chatLog('正在执行中！', 'warning');
						getmsg_mark = false
						groupmove_mark = false
						await get_tags_mid_list(1,0)//0默认分组
						let modify_count = 0
						for (let i = 0; i < tags_mid_list.length; i++) {
							now_p = '【获取私信数据并取关】'
							now_num = i + 1
							num_length = tags_mid_list.length
							$('#now_num span:eq(0)').text(now_p);
							$('#now_num span:eq(1)').text(now_num);
							$('#now_num span:eq(2)').text(num_length);
							if(MY_API.CONFIG.haveMsg_uid_list.indexOf(tags_mid_list[i])>-1)continue
							await sleep(2000)
							await BAPI.getMsg(tags_mid_list[i]).then(async(data) => {
								let msg = data.data.messages
								console.log('无私信主播取关getMsg', msg)
								if (msg == null) {
									if (modify_count && modify_count % 50 == 0) {
										now_p = '【获取私信数据】取关暂停中'
										$('#now_num span:eq(0)').text(now_p);
										await sleep(60000) //取关达到50，暂停一分钟
									}
									modify_count++;
									BAPI.modify(tags_mid_list[i], 2).then((data) => {
										console.log('无私信主播取关', data)
										if (data.code == 0)
											MY_API.chatLog(`【一键取关】无私信UID：${tags_mid_list[i]}取关成功！<br>本次已取关${modify_count}个！`);

									})
								}else{
									MY_API.CONFIG.haveMsg_uid_list.push(tags_mid_list[i])
									MY_API.saveConfig()
								}
							},async() => {
								MY_API.chatLog(`【一键取关】获取私信数据出错，暂停1分钟！`, 'warning');
								now_p = '【获取私信数据并取关】取关暂停中'
								$('#now_num span:eq(0)').text(now_p);
								await sleep(60000)
								i--
							})
						}
						now_p = `【无私信取关完成】本次取关成功${modify_count}个！`
						$('#now_num span:eq(0)').text(now_p);
						getmsg_mark = true
						groupmove_mark = true
					});

					tags.find('div[data-toggle="tags2"] [data-action="save1"]').click(async function () {
						let r = confirm("点击确定，一键取关低粉主播!");
						if (r == true) {
							if(!groupmove_mark) return MY_API.chatLog('正在执行中！', 'warning');
							groupmove_mark = false
							await get_tags_data()
							let num = tags_name.indexOf('低粉主播')
							if (lowfans_uid.length == 0 && num==-1) {
								return MY_API.chatLog(`【一键取关】低粉主播分组无数据！`);
							}
							await get_tags_mid_list(1,tags_tagid[num])
							for(let i=0;i<tags_mid_list.length;i++){
								if(lowfans_uid.indexOf(tags_mid_list[i])==-1)lowfans_uid.push(tags_mid_list[i])
							}
							for (let i = 0; i < lowfans_uid.length; i++) {
								now_p = '【一键取关】取关低粉主播'
								now_num = i + 1
								num_length = lowfans_uid.length
								$('#now_num span:eq(0)').text(now_p);
								$('#now_num span:eq(1)').text(now_num);
								$('#now_num span:eq(2)').text(num_length);
								await sleep(1000)
								BAPI.modify(lowfans_uid[i], 2).then((data) => {
									console.log('低粉主播取关', data)
									if (data.code == 0)
										MY_API.chatLog(`【一键取关】低粉主播UID：${lowfans_uid[i]}取关成功`);
								})
							}
							now_p = '【取关低粉主播完成】'
							$('#now_num span:eq(0)').text(now_p);
							groupmove_mark = true
						}
					})

					$('.chat-history-panel').append(award);
					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(ohb);
					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').prepend(tpp);
					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(tj);
					$('.live-player-ctnr.w-100.h-100.p-absolute.normal').append(div);
					$('.chat-history-panel').append(nummsg);
					//对应配置状态
					if (GM_getValue('btn1'))
						btn1.click()
					if (GM_getValue('btn2'))
						btn2.click()
					let GJTP_Timer = () => {
						let kd = $('.web-player-ending-panel').width();
						let gd = $('.web-player-ending-panel').height();
						$("#img2").width(kd).height(gd);
					};
					GJTP_Timer();
					$("html").scrollLeft(10000);//滚动到右侧
					window.onresize = function(){
						let kd = $('.web-player-ending-panel').width();
						let gd = $('.web-player-ending-panel').height();
						$("#img2").width(kd).height(gd);
						$("html").scrollLeft(10000);//滚动到右侧
						heightmax = $('.chat-history-panel').height()
						ohb.css({
							'max-height': `${heightmax}px`,
						})
						div.css({
							'max-height': `${heightmax}px`,
						})
						tj.css({
							'max-height': `${heightmax}px`,
						})
						tags.css({
							'max-height': `${heightmax}px`,
						})
						journal.css({
							'max-height': `${heightmax}px`,
						})
						journal2.css({
							'max-height': `${heightmax}px`,
						})
						journal3.css({
							'max-height': `${heightmax}px`,
						})
						journal4.css({
							'max-height': `${heightmax}px`,
						})
						journal5.css({
							'max-height': `${heightmax}px`,
						})
						journal6.css({
							'max-height': `${heightmax}px`,
						})
						journal7.css({
							'max-height': `${heightmax}px`,
						})
						journal8.css({
							'max-height': `${heightmax}px`,
						})
					}

					tj.find('div[data-toggle="TOProomnum"] .num').val((parseInt(MY_API.CONFIG.TOProomnum)).toString());
					tj.find('div[data-toggle="do_GOLDBOX"] .num').val((parseInt(MY_API.CONFIG.do_GOLDBOX)).toString());

					tj.find('div[data-toggle="TOProomnum"] [data-action="save"]').click(function () {
						let val = Number(tj.find('div[data-toggle="TOProomnum"] .num').val());
						MY_API.CONFIG.TOProomnum = val;
						MY_API.saveConfig();
						MY_API.chatLog(`天选巡检上限设置：${MY_API.CONFIG.TOProomnum}`);
					});

					tj.find('div[data-toggle="detail_by_lid_flash"] .num').val((parseInt(MY_API.CONFIG.detail_by_lid_flash)).toString());
					tj.find('div[data-toggle="detail_by_lid_flash"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="detail_by_lid_flash"] .num').val());
						MY_API.CONFIG.detail_by_lid_flash = val;
						MY_API.saveConfig()
						MY_API.chatLog(`预约动态抽奖间隔设置：${MY_API.CONFIG.detail_by_lid_flash}`);
					})

					tj.find('div[data-toggle="lottery_result_uid_list"] .num').val((parseInt(MY_API.CONFIG.lottery_result_did_reset)).toString());
					tj.find('div[data-toggle="lottery_result_uid_list"] [data-action="save3"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="lottery_result_uid_list"] .num').val());
						MY_API.CONFIG.lottery_result_did_reset = val;
						MY_API.saveConfig()
						MY_API.chatLog(`【官方抽奖初始序号】${MY_API.CONFIG.lottery_result_did_reset}！`, 'success');
					})


					tj.find('div[data-toggle="detail_by_lid_reset"] .num').val((parseInt(MY_API.CONFIG.detail_by_lid_reset)).toString());
					tj.find('div[data-toggle="detail_by_lid_reset"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="detail_by_lid_reset"] .num').val());
						let ddd = MY_API.CONFIG.last_lottery_id
						MY_API.CONFIG.detail_by_lid_reset = val;
						MY_API.CONFIG.last_lottery_id = MY_API.CONFIG.detail_by_lid_reset
						MY_API.saveConfig()
						MY_API.chatLog(`【动态预约】成功重置动态及预约直播抽奖的检索序号：${ddd}已修改为${MY_API.CONFIG.last_lottery_id}！`, 'success');
						if(!dynamic_lottery_run_mark)MY_API.chatLog(`【动态预约】动态抽奖转发运行中，检索序号重置可能被覆盖，可能未能生效！`, 'warning');
					})

					let do_GOLDBOX_mark=1
					tj.find('div[data-toggle="do_GOLDBOX"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="do_GOLDBOX"] .num').val());
						MY_API.CONFIG.do_GOLDBOX = val;
						MY_API.saveConfig();
						var do_now_Material=async function (aid100_number) {//手动参加实物抽奖特征id：aid*100+number
							let aid=parseInt(aid100_number/100)
							let number = aid100_number - aid*100
							if(!aid | !number)return MY_API.chatLog(`【实物抽奖】数据不符要求，数据要求：aid*100+number！`, 'warning');
							await BAPI.Lottery.MaterialObject.draw(aid, number).then((response) => {
								if (response.code === 0) {
									MY_API.CONFIG.COUNT_GOLDBOX++;
									$('#giftCoun span:eq(0)').text(MY_API.CONFIG.COUNT_GOLDBOX);
									$('#COUNT_GOLDBOX span:eq(0)').text(MY_API.CONFIG.COUNT_GOLDBOX);
									MY_API.chatLog(`【实物宝箱抽奖】成功参加抽奖：(aid=${aid},number=${number})！`, 'success');
									MY_API.CONFIG.aid_number_list.push(aid100_number)
									MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：(aid=${aid},number=${number})`)
									if (MY_API.CONFIG.freejournal3.length > 500) {
										MY_API.CONFIG.freejournal3.splice(400, 100);
									}
									MY_API.saveConfig()
									$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
									let dt = document.getElementById('freejournal3'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal3

								} else if(response.code == -403){
									MY_API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${number})${response.message}`, 'warning');
									MY_API.CONFIG.aid_number_list.push(aid * 100 + number)
									MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：(aid=${aid},number=${number})，${response.message}！`)
									if (MY_API.CONFIG.freejournal3.length > 500) {
										MY_API.CONFIG.freejournal3.splice(400, 100);
									}
									MY_API.saveConfig()
									$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
									let dt = document.getElementById('freejournal3'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal3

								}else {
									MY_API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${number})${response.message}`, 'warning');
								}
							}, () => {
								MY_API.chatLog(`【实物宝箱抽奖】参加(aid=${aid},number=${number})失败，请检查网络`, 'warning');
							});
						}//手动参加实物抽奖特征id：aid*100+number
						if(do_GOLDBOX_mark){
							do_GOLDBOX_mark = 0
							do_now_Material(MY_API.CONFIG.do_GOLDBOX)
							setTimeout(() => {
								do_GOLDBOX_mark = 1
							}, 60e3);
						}else{
							MY_API.chatLog('【手动参加实物抽奖】20秒CD中');
						}
					});


					if (MY_API.CONFIG.anchor_postdiscuss_switch)
						tj.find('div[data-toggle="anchor_postdiscuss_switch"] input').attr('checked', '');
					tj.find('div[data-toggle="anchor_postdiscuss_switch"] input:checkbox').change(function () {
						MY_API.CONFIG.anchor_postdiscuss_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`屏蔽词获取设置：${MY_API.CONFIG.anchor_postdiscuss_switch}`);
					});
					tj.find('div[data-toggle="anchor_postdiscuss_switch"] .num').val((parseInt(MY_API.CONFIG.anchor_postdiscuss)).toString());
					tj.find('div[data-toggle="anchor_postdiscuss_switch"] .string').val((MY_API.CONFIG.gitee_url).toString());

					tj.find('div[data-toggle="anchor_postdiscuss_switch"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="anchor_postdiscuss_switch"] .num').val());
						if (val == '')
							val = 0
						MY_API.CONFIG.anchor_postdiscuss = val;
						let str = tj.find('div[data-toggle="anchor_postdiscuss_switch"] .string').val()
						MY_API.CONFIG.gitee_url = str
						MY_API.saveConfig()
						MY_API.chatLog(`专栏CV号：${MY_API.CONFIG.anchor_postdiscuss}<br>云数据地址：${MY_API.CONFIG.gitee_url}`);
					});


					tj.find('div[data-toggle="money_big"] .num').val((Number(MY_API.CONFIG.bigmoney)).toString());
					tj.find('div[data-toggle="money_big"] [data-action="save"]').click(function () {
						let val = Number(tj.find('div[data-toggle="money_big"] .num').val());
						MY_API.CONFIG.bigmoney = val;
						MY_API.saveConfig();
						MY_API.chatLog(`自动获得勋章设置：${MY_API.CONFIG.bigmoney_switch}-${MY_API.CONFIG.bigmoney}`);
					});
					if (MY_API.CONFIG.bigmoney_switch)
						tj.find('div[data-toggle="money_big"] input').attr('checked', '');
					tj.find('div[data-toggle="money_big"] input:checkbox').change(function () {
						MY_API.CONFIG.bigmoney_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动获得勋章设置：${MY_API.CONFIG.bigmoney_switch}-${MY_API.CONFIG.bigmoney}`);
					});

					if (MY_API.CONFIG.unignore_to_get_medal_switch)
						tj.find('div[data-toggle="unignore_to_get_medal_switch"] input').attr('checked', '');
					tj.find('div[data-toggle="unignore_to_get_medal_switch"] input:checkbox').change(function () {
						MY_API.CONFIG.unignore_to_get_medal_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动获得勋章设置：${MY_API.CONFIG.unignore_to_get_medal_switch}`);
					});


					tj.find('div[data-toggle="AUTO_dynamic_create"] .num').val((parseInt(MY_API.CONFIG.AUTO_dynamic_create_flash)).toString());
					tj.find('div[data-toggle="AUTO_dynamic_create"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="AUTO_dynamic_create"] .num').val());
						if(val < 3) val = 3
						MY_API.CONFIG.AUTO_dynamic_create_flash = val;
						MY_API.saveConfig();
						MY_API.chatLog(`自动发动态间隔已设置：${MY_API.CONFIG.AUTO_dynamic_create}<br>自动发动态间隔为随机：${val}-${1.25 * val}分钟`);
					});
					if (MY_API.CONFIG.AUTO_dynamic_create)tj.find('div[data-toggle="AUTO_dynamic_create"] input').attr('checked', '');
					tj.find('div[data-toggle="AUTO_dynamic_create"] input:checkbox').change(async function () {
						MY_API.CONFIG.AUTO_dynamic_create = $(this).prop('checked');
						if(MY_API.CONFIG.AUTO_dynamic_create && MY_API.CONFIG.poison_chicken_soup.length < 100){
							MY_API.CONFIG.poison_chicken_soup = await getMyJson("https://gitee.com/flyxiu/flyx/raw/master/soup.json");
						}
						MY_API.saveConfig()
						MY_API.chatLog(`自动发动态间隔已设置：${MY_API.CONFIG.AUTO_dynamic_create}`);
					});
					tj.find('div[data-toggle="lottery_result_uid_list"] .num1').val(((MY_API.CONFIG.lottery_result_uid_list)).toString());
					tj.find('div[data-toggle="lottery_result_uid_list"] [data-action="save2"]').click(async function () {
						$('.zdbgjsessions').toggle()
					})
					tj.find('div[data-toggle="lottery_result_uid_list"] [data-action="save"]').click(async function () {
						let val = (tj.find('div[data-toggle="lottery_result_uid_list"] .num1').val());
						if (val == '') {
							MY_API.CONFIG.lottery_result_uid_list = [Live_info.uid]
						}else{
							let word = val.split(",");
							let list = []
							for (let i = 0; i < word.length; i++) {
								if (list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1 && word[i] && Number(word[i]) != 0) {
									list.push(Number(word[i].replaceAll(' ', '')))
								}
							}
							if(list.indexOf(Live_info.uid)==-1)list.push(Live_info.uid)
							MY_API.CONFIG.lottery_result_uid_list = list
						}
						MY_API.saveConfig();
						MY_API.chatLog(`官方抽奖检查设置：<br>${MY_API.CONFIG.lottery_result_uid_list}`);
					})
					let lottery_result_uid_list_runmark = true
					tj.find('div[data-toggle="lottery_result_uid_list"] [data-action="save1"]').click(async function () {
						let jindu = document.getElementById("jindu")
						let val = parseInt(tj.find('div[data-toggle="lottery_result_uid_list"] .num').val());
						if(!lottery_result_uid_list_runmark) return MY_API.chatLog(`官方抽奖检查：运行中！`);
						lottery_result_uid_list_runmark = false
						//官方抽奖检查
						//API.CONFIG.lottery_result_uid_list  检查的uidlist
						//lottery_result_data   已开奖数据临时存储id,data
						let lottery_result_data = []
						let lottery_result_data_new = []
						let data_check =async function(data){
							let business_id = data.business_id
							let lottery_result = data.lottery_result
							let first_prize_cmt = data.first_prize_cmt
							let second_prize_cmt = data.second_prize_cmt
							let third_prize_cmt = data.third_prize_cmt
							if(first_prize_cmt != '' && first_prize_cmt.indexOf("动态红包")==-1)first_prize_cmt = "一等奖：" + first_prize_cmt
							if(second_prize_cmt != '')second_prize_cmt = "二等奖：" + second_prize_cmt
							if(third_prize_cmt != '')third_prize_cmt = "三等奖：" + third_prize_cmt
							let sender_uid = data.sender_uid
							let lottery_time = data.lottery_time
							let lottery_id = data.lottery_id
							let title
							//动态类
							if(business_id>999999999 || business_id ==0) {//business_id == 0 大数字损失精度变0
								if(first_prize_cmt.indexOf("动态红包")>-1){
									title = '【动态红包】'
									let hongbao_result = data.hongbao_result
									for(let t=0;t<hongbao_result.length;t++){
										if(MY_API.CONFIG.lottery_result_uid_list.indexOf(hongbao_result[t].uid) > -1 && hongbao_result[t].hongbao_money > 0){
											sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${hongbao_result[t].name}(UID：${hongbao_result[t].uid})：${hongbao_result[t].hongbao_money/100}元<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
											$('#sessions_msg span:eq(0)').text(sessions_msg)
											let dt = document.getElementById('sessions_msg');
											dt.innerHTML  = sessions_msg
										}
									}
								}else{
									title = '【动态抽奖】'
									if(lottery_result.first_prize_result != undefined){
										for(let t=0;t<lottery_result.first_prize_result.length;t++){
											if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.first_prize_result[t].uid) > -1){
												sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.first_prize_result[t].name}(UID：${lottery_result.first_prize_result[t].uid})：${first_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
												$('#sessions_msg span:eq(0)').text(sessions_msg)
												let dt = document.getElementById('sessions_msg');
												dt.innerHTML  = sessions_msg
											}
										}
									}
									if(lottery_result.second_prize_result!= undefined){
										for(let k=0;k<lottery_result.second_prize_result.length;k++){
											if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.second_prize_result[k].uid) > -1){
												sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.second_prize_result[k].name}(UID：${lottery_result.second_prize_result[k].uid})：${second_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
												$('#sessions_msg span:eq(0)').text(sessions_msg)
												let dt = document.getElementById('sessions_msg');
												dt.innerHTML  = sessions_msg
											}
										}
									}
									if(lottery_result.third_prize_result!= undefined){
										for(let l=0;l<lottery_result.third_prize_result.length;l++){
											if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.third_prize_result[l].uid) > -1){
												sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.third_prize_result[l].name}(UID：${lottery_result.third_prize_result[l].uid})：${third_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
												$('#sessions_msg span:eq(0)').text(sessions_msg)
												let dt = document.getElementById('sessions_msg');
												dt.innerHTML  = sessions_msg
											}
										}
									}
								}
							}
							//动态类
							//预约直播
							if(business_id<999999999 && business_id !=0){
								title = '【预约抽奖】'
								if(lottery_result.first_prize_result != undefined){
									for(let t=0;t<lottery_result.first_prize_result.length;t++){
										if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.first_prize_result[t].uid) > -1){
											sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.first_prize_result[t].name}(UID：${lottery_result.first_prize_result[t].uid})：${first_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`)
											$('#sessions_msg span:eq(0)').text(sessions_msg)
											let dt = document.getElementById('sessions_msg');
											dt.innerHTML  = sessions_msg
										}
									}
								}
								if(lottery_result.second_prize_result!= undefined){
									for(let k=0;k<lottery_result.second_prize_result.length;k++){
										if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.second_prize_result[k].uid) > -1){
											sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.second_prize_result[k].name}(UID：${lottery_result.second_prize_result[k].uid})：${second_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`)
											$('#sessions_msg span:eq(0)').text(sessions_msg)
											let dt = document.getElementById('sessions_msg');
											dt.innerHTML  = sessions_msg
										}
									}
								}

								if(lottery_result.third_prize_result!= undefined){
									for(let l=0;l<lottery_result.third_prize_result.length;l++){
										if(MY_API.CONFIG.lottery_result_uid_list.indexOf(lottery_result.third_prize_result[l].uid) > -1){
											sessions_msg.unshift(`<br>${title}开奖时间：${timestampToTime(lottery_time)}：${lottery_result.third_prize_result[l].name}(UID：${lottery_result.third_prize_result[l].uid})：${third_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lottery_id}">抽奖页</a>`)
											$('#sessions_msg span:eq(0)').text(sessions_msg)
											let dt = document.getElementById('sessions_msg');
											dt.innerHTML  = sessions_msg
										}
									}
								}
							}//预约直播
						}

						let lottery_result_check_by_uid_list = async function (did) {
							if(lottery_result_data.indexOf(did)>-1){//已开奖数据存储id,data
								let num = lottery_result_data.indexOf(did)
								let dat = lottery_result_data[num+1]
								data_check(dat)
								return lottery_result_check_by_uid_list(did+1)
							}else{
								//await sleep(100)
								return BAPI.detail_by_lid(did).then(function (data) {
									jindu.innerHTML = `已检查：${did-val+1}`
									//console.log('批量uid中奖检查',data)
									if(data.code==0){//取消抽奖后无lottery_result
										if(data.data.lottery_time < ts_s()){//已开奖
											if(data.data.lottery_result !=undefined || data.data.hongbao_result !=undefined){//取消抽奖后无lottery_result
												lottery_result_data.push(did,data.data)//已开奖数据存储id,data
												lottery_result_data_new.push(did,data.data)//新的已开奖数据存储id,data
												//console.log('批量uid中奖检查：开奖',did)
												data_check(data.data)
											}
										}
										return lottery_result_check_by_uid_list(did+1)
									}
									if(data.code== -9999){
										console.log('新增的批量uid中奖检查：开奖',did,lottery_result_data_new)
										for (let i = 0; i < Math.ceil(lottery_result_data_new.length/500); i++) {
											console.log(`批量uid中奖检查：开奖【${i}】`,lottery_result_data_new.slice(500*i,500*(i+1)))
										}
										lottery_result_uid_list_runmark = true
										jindu.innerHTML = `立即执行`
										return MY_API.chatLog(`【官方抽奖检查】检查结束！`, 'success');
									}
								}, () => {
									jindu.innerHTML = `立即执行`
									lottery_result_uid_list_runmark = true
									return MY_API.chatLog(`【官方抽奖检查】获取数据失败！`, 'warning');
								})
							}
						}
						MY_API.chatLog('【批量检查官方抽奖】开始加载云开奖数据！')
						sessions_msg = []
						let w_num = await getMyJson(`https://gitee.com/flyxiu/flyx/raw/master/lottery_result_data_num.json`);
						if(w_num[0]== undefined){
							return MY_API.chatLog(`【批量检查官方抽奖】无云数据或获取异常！`);
						}
						for(let i =1;i<w_num[0]+1;i++){
							jindu.innerHTML = `获取云数据：${lottery_result_data.length}`
							let w_lottery_result_data = await getMyJson(`https://gitee.com/flyxiu/flyx/raw/master/lottery_result_data_${i}.json`);
							await sleep(3000)
							if(w_lottery_result_data[0]== undefined){
								MY_API.chatLog(`【批量检查官方抽奖】无云数据或获取异常！`);
							}else{
								lottery_result_data = lottery_result_data.concat(w_lottery_result_data)
								console.log('批量uid中奖检查云数据：开奖',lottery_result_data)
							}
						}
						MY_API.chatLog('【批量检查官方抽奖】云数据加载完成！')
						lottery_result_check_by_uid_list(val)
						//官方抽奖检查
					})


					tj.find('div[data-toggle="AUTO_dynamic_del"] .num').val((parseInt(MY_API.CONFIG.AUTO_dynamic_create_flash)).toString());
					let AUTO_dynamic_del_runmark = true
					tj.find('div[data-toggle="AUTO_dynamic_del"] [data-action="save"]').click(async function () { //money_min save按钮
						let val = parseInt(tj.find('div[data-toggle="AUTO_dynamic_del"] .num').val());
						MY_API.CONFIG.AUTO_dynamic_del = val;
						MY_API.saveConfig();
						MY_API.chatLog(`自动删动态设置：${MY_API.CONFIG.AUTO_dynamic_del}`);
						if(AUTO_dynamic_del_runmark){
							AUTO_dynamic_del_runmark = false
							let get_space_history_dynamic_id_list_to_del = function(host_uid,offset) {//获取已转动态抽奖id：API.CONFIG.dynamic_id_str_done_list
								return BAPI.space_history(host_uid,offset).then(async function (data) {
									await sleep(5000)
									console.log('space_historydata',data,offset)
									if(data.data.cards == undefined)return
									let cards = data.data.cards
									for(let i=0;i<cards.length;i++){
										if(cards[i].desc.timestamp + MY_API.CONFIG.AUTO_dynamic_del * 24 * 3600 < ts_s()){
											await BAPI.rm_dynamic(cards[i].desc.dynamic_id_str).then(async function (data) {
												if(data.code==0){
													MY_API.chatLog(`【清理动态】成功删除一条动态！`);
													await sleep(5000)
												}else{
													MY_API.chatLog(`【清理动态】data：${data}`);
												}
											})
										}
									}
									if(data.data.has_more==1)return get_space_history_dynamic_id_list_to_del(Live_info.uid,cards[cards.length-1].desc.dynamic_id_str)
								}, () => {
									return API.chatLog(`【清理动态】检索动态抽奖数据失败，请检查网络,稍后再试！`, 'warning');
								})
							}
							await get_space_history_dynamic_id_list_to_del(Live_info.uid,0)
							AUTO_dynamic_del_runmark = true
						}else{
							MY_API.chatLog(`【清理动态】正在执行中！`);
						}
					});


					//粉丝，金额
					tj.find('div[data-toggle="fans_min"] .num').val((parseInt(MY_API.CONFIG.fans_min)).toString());
					tj.find('div[data-toggle="money_min"] .num').val((Number(MY_API.CONFIG.money_min)).toString());
					tj.find('div[data-toggle="money_min"] [data-action="save"]').click(function () {
						let val = Number(tj.find('div[data-toggle="money_min"] .num').val());
						MY_API.CONFIG.money_min = val;
						MY_API.saveConfig();
						MY_API.chatLog(`奖金下限设置：${MY_API.CONFIG.money_min}<br>奖金下限设置：${MY_API.CONFIG.money_switch}`);
					});
					tj.find('div[data-toggle="fans_min"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="fans_min"] .num').val());
						MY_API.CONFIG.fans_min = val;
						MY_API.saveConfig();
						MY_API.chatLog(`粉丝下限设置：${MY_API.CONFIG.fans_min}`);
					});
					if (MY_API.CONFIG.fans_switch)
						tj.find('div[data-toggle="fans_min"] input').attr('checked', '');
					if (MY_API.CONFIG.money_switch)
						tj.find('div[data-toggle="money_min"] input').attr('checked', '');
					tj.find('div[data-toggle="fans_min"] input:checkbox').change(function () {
						MY_API.CONFIG.fans_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`粉丝下限设置：${MY_API.CONFIG.fans_switch}`);
					});
					tj.find('div[data-toggle="money_min"] input:checkbox').change(function () {
						MY_API.CONFIG.money_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`奖金下限设置：${MY_API.CONFIG.money_switch}`);
					});

					tj.find('div[data-toggle="gift_price"] .num').val((parseInt(MY_API.CONFIG.gift_price)).toString());
					tj.find('div[data-toggle="Anchor_ignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_ignore_keyword);
					tj.find('div[data-toggle="Anchor_unignore_keyword"] .keyword').val(MY_API.CONFIG.Anchor_unignore_keyword);
					tj.find('div[data-toggle="Anchor_ignore_uid"] .keyword').val(MY_API.CONFIG.Anchor_ignore_uid);
					tj.find('div[data-toggle="gift_price"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="gift_price"] .num').val());
						if (val == '') {
							val = 0
						}
						if (MY_API.CONFIG.gift_price === val) {
							MY_API.chatLog('改都没改保存嘛呢');
							return
						}
						MY_API.CONFIG.gift_price = val;
						MY_API.saveConfig();
						MY_API.chatLog(`【天选时刻】金瓜子投喂上限：${MY_API.CONFIG.gift_price}。<br>理性消费，1电池=100金瓜子=1毛钱`);
					});

					tj.find('div[data-toggle="Anchor_ignore_keyword"] [data-action="save"]').click(function () {
						let val = $(tj).find('div[data-toggle="Anchor_ignore_keyword"] .keyword').val();
						if (val == '') {
							val = '不会吧不会吧居然真有人什么都不过滤'
						}
						MY_API.CONFIG.Anchor_ignore_keyword = val.split(",");
						let word=[]
						for (let i = 0; i < MY_API.CONFIG.Anchor_ignore_keyword.length; i++) {//本地去重、去空格、去空、转小写
							if (word.indexOf(MY_API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.Anchor_ignore_keyword[i] && Number(MY_API.CONFIG.Anchor_ignore_keyword[i]) != 0) {
								word.push(MY_API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase())
							}
						}
						MY_API.CONFIG.Anchor_ignore_keyword = word
						MY_API.saveConfig();
						MY_API.chatLog(`【天选时刻】屏蔽过滤关键词已设置：</br>${MY_API.CONFIG.Anchor_ignore_keyword}`);

					});

					tj.find('div[data-toggle="Anchor_unignore_keyword"] [data-action="save"]').click(function () {
						let val = $(tj).find('div[data-toggle="Anchor_unignore_keyword"] .keyword').val();
						if (val == '') {
							val = '正则关键词'
						}
						MY_API.CONFIG.Anchor_unignore_keyword = val.split(",");
						let word=[]
						for (let i = 0; i < MY_API.CONFIG.Anchor_unignore_keyword.length; i++) {//本地去重、去空格、去空
							if (word.indexOf(MY_API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && MY_API.CONFIG.Anchor_unignore_keyword[i] && Number(MY_API.CONFIG.Anchor_unignore_keyword[i]) != 0) {
								word.push(MY_API.CONFIG.Anchor_unignore_keyword[i].replaceAll(' ', '').toLowerCase())
							}
						}
						MY_API.CONFIG.Anchor_unignore_keyword = word
						MY_API.saveConfig();
						MY_API.chatLog(`【天选时刻】正则关键词已设置：</br>${MY_API.CONFIG.Anchor_unignore_keyword}`);

					});

					tj.find('div[data-toggle="Anchor_ignore_uid"] [data-action="save"]').click(function () {
						let val = $(tj).find('div[data-toggle="Anchor_ignore_uid"] .keyword').val();
						if (val == '') {
							MY_API.CONFIG.Anchor_ignore_uid = [1234567890]
							MY_API.saveConfig();
							MY_API.chatLog(`【天选时刻】主播黑名单已设置：</br>${MY_API.CONFIG.Anchor_ignore_uid}`);
							return
						}
						let word = val.split(",");
						let list = []
						for (let i = 0; i < word.length; i++) {
							if (list.indexOf(Number(word[i].replaceAll(' ', ''))) == -1 && word[i] && Number(word[i]) != 0) {
								list.push(Number(word[i].replaceAll(' ', '')))
							}
						}
						MY_API.CONFIG.Anchor_ignore_uid = list
						MY_API.saveConfig();
						MY_API.chatLog(`【天选时刻】主播黑名单已设置：</br>${MY_API.CONFIG.Anchor_ignore_uid}`);
					});

					if (MY_API.CONFIG.AUTO_GOLDBOX)
						tj.find('div[data-toggle="AUTO_GOLDBOX"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_GOLDBOX_sever2)
						tj.find('div[data-toggle="AUTO_GOLDBOX_sever2"] input').attr('checked', '');

					let AUTO_GOLDBOX_run_mark = true
					tj.find('div[data-toggle="AUTO_GOLDBOX"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_GOLDBOX = $(this).prop('checked');
						if(MY_API.CONFIG.AUTO_GOLDBOX_sever2)document.getElementById("AUTO_GOLDBOX_sever2").click()
						if (MY_API.CONFIG.AUTO_GOLDBOX && AUTO_GOLDBOX_run_mark) {
							AUTO_GOLDBOX_run_mark = false
							setTimeout(() => {
								MY_API.chatLog(`设置已保存，60秒后运行！`);
								AUTO_GOLDBOX_run_mark = true
								MY_API.MaterialObject.run();
							}, 60e3);
						}
						MY_API.saveConfig();
						MY_API.chatLog(`金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX},群主云金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX_sever2}`);
					});

					let AUTO_GOLDBOX_run_mark2 = true
					tj.find('div[data-toggle="AUTO_GOLDBOX_sever2"] input:checkbox').change(async function () {
						MY_API.CONFIG.AUTO_GOLDBOX_sever2 = $(this).prop('checked');
						if(MY_API.CONFIG.AUTO_GOLDBOX)document.getElementById("AUTO_GOLDBOX").click()
						if (MY_API.CONFIG.AUTO_GOLDBOX_sever2 && AUTO_GOLDBOX_run_mark2) {
							AUTO_GOLDBOX_run_mark2 = false
							setTimeout(async() => {
								let get_GOLDBOX = async function () {
									let url = "https://gitee.com/flyxiu/flyx/raw/master/GOLDBOX.json";
									let w_MaterialObject = await getMyJson(url);
									if(w_MaterialObject[0]== undefined){
										MaterialObject = []
										chatLog(`无云数据或获取异常！`);
									}else{
										MaterialObject = w_MaterialObject
									}
									console.log('群主云宝箱数据',MaterialObject)
								}
								await get_GOLDBOX()
								AUTO_GOLDBOX_run_mark2 = true
							}, 60e3);
						}
						MY_API.saveConfig();
						MY_API.chatLog(`金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX},群主云金宝箱：${MY_API.CONFIG.AUTO_GOLDBOX_sever2}`);

					});

					if (MY_API.CONFIG.no_money_checkbox)
						tj.find('div[data-toggle="no_money_checkbox"] input').attr('checked', '');
					tj.find('div[data-toggle="no_money_checkbox"] input:checkbox').change(function () {
						MY_API.CONFIG.no_money_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`仅现金及正则参与抽奖设置：${MY_API.CONFIG.no_money_checkbox}`);
					});

					if (MY_API.CONFIG.AUTO_medal_get_up)
						tj.find('div[data-toggle="AUTO_medal_get_up"] input').attr('checked', '');

					tj.find('div[data-toggle="AUTO_medal_get_up"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_medal_get_up = $(this).prop('checked');
						if (MY_API.CONFIG.AUTO_medal_get_up){
							MY_API.chatLog('无勋章：自动获得勋章及投喂小心心升级勋章（4级以下）满足天选抽奖功能已开启！', 'success');
						}
						if (!MY_API.CONFIG.AUTO_medal_get_up)MY_API.chatLog('无勋章：自动获得勋章及投喂小心心升级勋章（4级以下）满足天选抽奖功能已关闭！', 'success');
						MY_API.saveConfig()
						MY_API.chatLog(`自动获得勋章设置：${MY_API.CONFIG.AUTO_medal_get_up}`);
					});

					if (MY_API.CONFIG.AUTO_medal_up)
						tj.find('div[data-toggle="AUTO_medal_up"] input').attr('checked', '');

					tj.find('div[data-toggle="AUTO_medal_up"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_medal_up = $(this).prop('checked');
						MY_API.saveConfig()
						if (MY_API.CONFIG.AUTO_medal_up)MY_API.chatLog('有勋章：自动投喂小心心升级勋章满足天选抽奖功能已开启！', 'success');
						if (!MY_API.CONFIG.AUTO_medal_up)MY_API.chatLog('有勋章：自动投喂小心心升级勋章满足天选抽奖功能已关闭！', 'success');
					});

					if (MY_API.CONFIG.AUTO_Anchor)
						tj.find('div[data-toggle="AUTO_Anchor"] input').attr('checked', '');

					tj.find('div[data-toggle="AUTO_Anchor"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_Anchor = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动天选设置：${MY_API.CONFIG.AUTO_Anchor}`);
						if (MY_API.CONFIG.AUTO_Anchor) {
							MY_API.chatLog('5秒后刷新页面，载入天选模块', 'success');
							setTimeout(() => {
								window.location.reload();
							}, 5e3);
							if (Live_info.uid != 20842051) {
								////BAPI.modify(20842051, 1)
							}
						}
					});

					if(MY_API.CONFIG.dynamic_lottery)
						tj.find('div[data-toggle="dynamic_lottery"] input').attr('checked', '');

					if(MY_API.CONFIG.detail_by_lid_dynamic)
						tj.find('div[data-toggle="detail_by_lid_dynamic"] input').attr('checked', '');

					tj.find('div[data-toggle="detail_by_lid_dynamic"] input:checkbox').change(async function () {
						MY_API.CONFIG.detail_by_lid_dynamic = $(this).prop('checked');
						if(MY_API.CONFIG.dynamic_lottery)document.getElementById("dynamic_lottery").click()
						if (MY_API.CONFIG.detail_by_lid_dynamic) {
							if(!dynamic_lottery_tags_tagid){
								await BAPI.tag_create('动态抽奖').then(async(data) => {//创建分组
									console.log(data)
									if (data.code == 0) {
										MY_API.chatLog(`【动态抽奖】动态抽奖分组创建成功！`);
									}
									if (data.code == 22106) {
										MY_API.chatLog(`【动态抽奖】动态抽奖分组:${data.message}`);
									}
								});
								dynamic_lottery_tags_tagid = 0
								await BAPI.get_tags().then(async(data) => {//获取分组ID
									let tags_data = data.data
									for (let i = 0; i < tags_data.length; i++) {
										if(tags_data[i].name == '动态抽奖')
											dynamic_lottery_tags_tagid = tags_data[i].tagid
									}
								})
							}
						}
						MY_API.saveConfig();
						MY_API.chatLog(`仅关注动态抽奖：${MY_API.CONFIG.dynamic_lottery}<br>全动态抽奖：${MY_API.CONFIG.detail_by_lid_dynamic}`);
					})

					tj.find('div[data-toggle="dynamic_lottery"] input:checkbox').change(async function () {
						MY_API.CONFIG.dynamic_lottery = $(this).prop('checked');
						if(MY_API.CONFIG.detail_by_lid_dynamic)document.getElementById("detail_by_lid_dynamic").click()
						if (MY_API.CONFIG.dynamic_lottery) {
							if(!dynamic_lottery_tags_tagid){
								await BAPI.tag_create('动态抽奖').then(async(data) => {//创建分组
									console.log(data)
									if (data.code == 0) {
										MY_API.chatLog(`【动态抽奖】动态抽奖分组创建成功！`);
									}
									if (data.code == 22106) {
										MY_API.chatLog(`【动态抽奖】动态抽奖分组:${data.message}`);
									}
								});
								dynamic_lottery_tags_tagid = 0
								await BAPI.get_tags().then(async(data) => {//获取分组ID
									let tags_data = data.data
									for (let i = 0; i < tags_data.length; i++) {
										if(tags_data[i].name == '动态抽奖')
											dynamic_lottery_tags_tagid = tags_data[i].tagid
									}
								})
							}
						}
						MY_API.saveConfig();
						MY_API.chatLog(`仅关注动态抽奖：${MY_API.CONFIG.dynamic_lottery}<br>全动态抽奖：${MY_API.CONFIG.detail_by_lid_dynamic}`);
					})

					if(MY_API.CONFIG.detail_by_lid_live)
						tj.find('div[data-toggle="detail_by_lid_live"] input').attr('checked', '');
					tj.find('div[data-toggle="detail_by_lid_live"] input:checkbox').change(async function () {
						MY_API.CONFIG.detail_by_lid_live = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`预约抽奖设置：${MY_API.CONFIG.detail_by_lid_live}`);
					})

					if(MY_API.CONFIG.not_office_dynamic_go)
						tj.find('div[data-toggle="not_office_dynamic_go"] input').attr('checked', '');
					tj.find('div[data-toggle="not_office_dynamic_go"] input:checkbox').change(async function () {
						MY_API.CONFIG.not_office_dynamic_go = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`专栏动态设置：${MY_API.CONFIG.not_office_dynamic_go}<br>注：非官方动态抽奖往往附加很多要求，可能不能达到要求，目前仅做统一关注、点赞、转发、评论处理。抽奖信息来源：_大锦鲤_专栏。`);
					})

					if(MY_API.CONFIG.detail_by_lid_live_ignore)
						tj.find('div[data-toggle="detail_by_lid_live_ignore"] input').attr('checked', '');
					tj.find('div[data-toggle="detail_by_lid_live_ignore"] input:checkbox').change(async function () {
						MY_API.CONFIG.detail_by_lid_live_ignore = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`预约抽奖屏蔽词/房生效：${MY_API.CONFIG.detail_by_lid_live_ignore}`);
					})

					if (MY_API.CONFIG.switch_sever)
						tj.find('div[data-toggle="switch_sever"] input').attr('checked', '');

					tj.find('div[data-toggle="switch_sever"] input:checkbox').change(function () {
						MY_API.CONFIG.switch_sever = $(this).prop('checked');
						if (MY_API.CONFIG.switch_sever && !MY_API.CONFIG.AUTO_Anchor)document.getElementById("AUTO_Anchor").click()
						MY_API.saveConfig()
						if (MY_API.CONFIG.switch_sever) {
							MY_API.chatLog('5秒后刷新页面，载入天选模块', 'success');
							setTimeout(() => {
								window.location.reload();
							}, 5e3);
							if (Live_info.uid != 20842051) {
								////BAPI.modify(20842051, 1)
							}
						}
						MY_API.chatLog(`自动天选检索设置：${MY_API.CONFIG.switch_sever}`);
						MY_API.chatLog('【天选时刻】小号蹭天选需要关闭此项，否者容易被风控访问拒绝', 'warning');
					});

					if (MY_API.CONFIG.Anchor_cur_gift_num)
						tj.find('div[data-toggle="Anchor_cur_gift_num"] input').attr('checked', '');
					tj.find('div[data-toggle="Anchor_cur_gift_num"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_cur_gift_num = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`金瓜子抽奖设置：${MY_API.CONFIG.Anchor_cur_gift_num}`);
						MY_API.chatLog('【天选时刻】已手动参与的金瓜子抽奖，脚本巡检到将不再次参与！', 'warning');
					});

					if(MY_API.CONFIG.get_following_live)tj.find('div[data-toggle="get_following_live"] input').attr('checked', '');
					tj.find('div[data-toggle="get_following_live"] input:checkbox').change(async function () { //
						MY_API.CONFIG.get_following_live = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`仅检索关注主播设置：${MY_API.CONFIG.get_following_live}`);
					})

					if(MY_API.CONFIG.Anchor_Followings_switch)tj.find('div[data-toggle="Anchor_Followings_switch"] input').attr('checked', '');

					tj.find('div[data-toggle="Anchor_Followings_switch"] input:checkbox').change(async function () { //
						MY_API.CONFIG.Anchor_Followings_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`仅参与关注主播的抽奖设置：${MY_API.CONFIG.Anchor_Followings_switch}`);
					});

					if (MY_API.CONFIG.sever_modle)
						tj.find('div[data-toggle="sever_modle"] input').attr('checked', '');

					tj.find('div[data-toggle="sever_modle"] input:checkbox').change(function () {
						MY_API.CONFIG.sever_modle = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`获取群主专栏天选数据抽奖设置：${MY_API.CONFIG.sever_modle}`);
					});

					if (MY_API.CONFIG.sever_room_checkbox)
						tj.find('div[data-toggle="sever_room_checkbox"] input').attr('checked', '');

					tj.find('div[data-toggle="sever_room_checkbox"] input:checkbox').change(function () {
						MY_API.CONFIG.sever_room_checkbox = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`获取群主简介天选数据抽奖设置：${MY_API.CONFIG.sever_room_checkbox}`);
					});

					if (MY_API.CONFIG.get_data_from_server)
						tj.find('div[data-toggle="get_data_from_server"] input').attr('checked', '');

					tj.find('div[data-toggle="get_data_from_server"] input:checkbox').change(function () {
						MY_API.CONFIG.get_data_from_server = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`获取群服务器天选数据抽奖设置：${MY_API.CONFIG.get_data_from_server}`);
					});

					//parent_area_id = [2,3,6,1,5,9,10,11]//{"网游分区":2},{"手游分区":3},{"单机游戏":6},{"娱乐分区":1},{"电台分区":5},{"虚拟分区":9},{"生活分区":10},{"学习分区":11}
					if (MY_API.CONFIG.parent_area_id2)
						document.getElementById("parent_area_id2").checked = true
					if (MY_API.CONFIG.parent_area_id3)
						document.getElementById("parent_area_id3").checked = true
					if (MY_API.CONFIG.parent_area_id6)
						document.getElementById("parent_area_id6").checked = true
					if (MY_API.CONFIG.parent_area_id1)
						document.getElementById("parent_area_id1").checked = true
					if (MY_API.CONFIG.parent_area_id5)
						document.getElementById("parent_area_id5").checked = true
					if (MY_API.CONFIG.parent_area_id9)
						document.getElementById("parent_area_id9").checked = true
					if (MY_API.CONFIG.parent_area_id10)
						document.getElementById("parent_area_id10").checked = true
					if (MY_API.CONFIG.parent_area_id11)
						document.getElementById("parent_area_id11").checked = true
					tj.find('div[data-toggle="parent_area_id"] input:checkbox').change(function () {
						MY_API.CONFIG.parent_area_id2 = $(document.getElementById("parent_area_id2")).prop('checked')
						MY_API.CONFIG.parent_area_id3 = $(document.getElementById("parent_area_id3")).prop('checked')
						MY_API.CONFIG.parent_area_id6 = $(document.getElementById("parent_area_id6")).prop('checked')
						MY_API.CONFIG.parent_area_id1 = $(document.getElementById("parent_area_id1")).prop('checked')
						MY_API.CONFIG.parent_area_id5 = $(document.getElementById("parent_area_id5")).prop('checked')
						MY_API.CONFIG.parent_area_id9 = $(document.getElementById("parent_area_id9")).prop('checked')
						MY_API.CONFIG.parent_area_id10 = $(document.getElementById("parent_area_id10")).prop('checked')
						MY_API.CONFIG.parent_area_id11 = $(document.getElementById("parent_area_id11")).prop('checked')
						MY_API.saveConfig()
						MY_API.chatLog(`设置：${MY_API.CONFIG.parent_area_id2}-${MY_API.CONFIG.parent_area_id3}-${MY_API.CONFIG.parent_area_id6}-${MY_API.CONFIG.parent_area_id1}-${MY_API.CONFIG.parent_area_id5}-${MY_API.CONFIG.parent_area_id9}-${MY_API.CONFIG.parent_area_id10}-${MY_API.CONFIG.parent_area_id11}`);
					});

					if (MY_API.CONFIG.refresh)
						div.find('div[data-toggle="refresh"] input').attr('checked', '');
					div.find('div[data-toggle="refresh"] input:checkbox').change(function () {
						MY_API.CONFIG.refresh = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh}`);
					});
					div.find('div[data-toggle="refresh"] [data-action="save"]').click(function () {
						MY_API.CONFIG.refresh_Select1_time = parseInt(div.find('div[data-toggle="refresh_Select1"] .time1').val());
						MY_API.CONFIG.refresh_Select2_time = parseInt(div.find('div[data-toggle="refresh_Select2"] .time2').val());
						MY_API.saveConfig()
						MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);

					})
					if (MY_API.CONFIG.refresh_Select1)
						div.find('div[data-toggle="refresh_Select1"] input:radio').attr('checked', '');
					if (MY_API.CONFIG.refresh_Select2)
						div.find('div[data-toggle="refresh_Select2"] input:radio').attr('checked', '');

					div.find('div[data-toggle="refresh_Select1"] .time1').val(parseInt(MY_API.CONFIG.refresh_Select1_time.toString()));
					div.find('div[data-toggle="refresh_Select2"] .time2').val(parseInt(MY_API.CONFIG.refresh_Select2_time.toString()));

					div.find('div[data-toggle="refresh_Select1"] input:radio').change(function () {
						MY_API.CONFIG.refresh_Select1 = $(this).prop('checked');
						MY_API.CONFIG.refresh_Select2 = !MY_API.CONFIG.refresh_Select1
						MY_API.CONFIG.refresh_Select1_time = parseInt(div.find('div[data-toggle="refresh_Select1"] .time1').val());
						MY_API.CONFIG.refresh_Select2_time = parseInt(div.find('div[data-toggle="refresh_Select2"] .time2').val());
						MY_API.saveConfig()
						MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);
					});
					div.find('div[data-toggle="refresh_Select2"] input:radio').change(function () {
						MY_API.CONFIG.refresh_Select2 = $(this).prop('checked');
						MY_API.CONFIG.refresh_Select1 = !MY_API.CONFIG.refresh_Select2
						MY_API.CONFIG.refresh_Select1_time = parseInt(div.find('div[data-toggle="refresh_Select1"] .time1').val());
						MY_API.CONFIG.refresh_Select2_time = parseInt(div.find('div[data-toggle="refresh_Select2"] .time2').val());
						MY_API.saveConfig()
						MY_API.chatLog(`自动刷新设置：${MY_API.CONFIG.refresh_Select1}-${MY_API.CONFIG.refresh_Select1_time}<br>${MY_API.CONFIG.refresh_Select2}-${MY_API.CONFIG.refresh_Select2_time}`);
					});

					if (MY_API.CONFIG.unusual_check)
						div.find('div[data-toggle="unusual_check"] input').attr('checked', '');
					div.find('div[data-toggle="unusual_check"] input:checkbox').change(function () {
						MY_API.CONFIG.unusual_check = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`天选关注异常检测设置：${MY_API.CONFIG.unusual_check}`);
					});

					div.find('div[data-toggle="unusual"] .uid').val(parseInt(MY_API.CONFIG.unusual_uid.toString())); //直播间号
					let unusual_uid_run_mark = true
					div.find('div[data-toggle="unusual"] [data-action="save"]').click(function () {
						MY_API.CONFIG.unusual_uid = parseInt(div.find('div[data-toggle="unusual"] .uid').val());
						MY_API.saveConfig()
						if(!unusual_uid_run_mark)return MY_API.chatLog(`私信测试功能设置：30秒CD中！`);
						unusual_uid_run_mark = false
						setTimeout(() => {
							unusual_uid_run_mark = true
						}, 30e3);
						MY_API.chatLog(`私信测试功能设置：接收UID：${MY_API.CONFIG.unusual_uid}`);
						let send = async function (unusual_uid) {
							const msg = {
								sender_uid: Live_info.uid,
								receiver_id: unusual_uid,
								receiver_type: 1,
								msg_type: 1,
								msg_status: 0,
								content: `{"content":"` + "我要中奖！！" + `"}`,
								dev_id: getMsgDevId()
							}
							BAPI.sendMsg(msg).then((data) => {
								console.log('sendMsg', getMsgDevId())
								console.log('sendMsg', data)
								if(data.code == 0){
									MY_API.chatLog(`【私信测试功能测试】私信发送成功！`);
								}else{
									MY_API.chatLog(`【私信测试功能测试】${data.message}！`);
								}
							})
						}
						send(MY_API.CONFIG.unusual_uid)
					});


					if (MY_API.CONFIG.get_sessions)
						div.find('div[data-toggle="get_sessions"] input').attr('checked', '');
					div.find('div[data-toggle="get_sessions"] .keyword').val(MY_API.CONFIG.get_sessions_keyword.toString());

					div.find('div[data-toggle="get_sessions"] input:checkbox').change(function () {
						MY_API.CONFIG.get_sessions = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`关注的人@信息自动推送设置：${MY_API.CONFIG.get_sessions}`);
					});

					div.find('div[data-toggle="get_sessions"] [data-action="save2"]').click(function () {
						let val = $(div).find('div[data-toggle="get_sessions"] .keyword').val();
						if (val == '') {
							val = '私信提取关键词'
						}
						MY_API.CONFIG.get_sessions_keyword = val.split(",");
						let word=[]
						for (let i = 0; i < MY_API.CONFIG.get_sessions_keyword.length; i++) {//本地去重、去空格、去空
							if (word.indexOf(MY_API.CONFIG.get_sessions_keyword[i].replaceAll(' ', '').toLowerCase()) == -1) {
								word.push(MY_API.CONFIG.get_sessions_keyword[i].replaceAll(' ', '').toLowerCase())
							}
						}
						MY_API.CONFIG.get_sessions_keyword = word
						MY_API.saveConfig();
						MY_API.chatLog(`【天选时刻】私信提取关键词已设置：</br>${MY_API.CONFIG.get_sessions_keyword}`);
					});
					let get_sessions_run_mark = true
					div.find('div[data-toggle="get_sessions"] [data-action="save"]').click(async function () {//一键私信已读及提取
						let sixin = document.getElementById("get_sessions")
						if(!get_sessions_run_mark)return MY_API.chatLog(`【私信已读提取】正在运行中！`);
						let talker_id_list = []
						let get_sessions = function(end_ts=0) {//获取私信列表
							return BAPI.get_sessions(end_ts).then(async function (data) {
								if(data.code==0){
									if(end_ts==0){
										talker_id_list=[]
									}
									await sleep(300)
									if(data.data.session_list == undefined)return console.log('data.data.session_list == undefined')
									let session_list = data.data.session_list
									for(let i=0;i<session_list.length;i++){
										await BAPI.update_ack(session_list[i].talker_id,session_list[i].max_seqno).then(async(data) => {
											if(data.code==0)console.log('私信已读',i+1)
										})
										sixin.innerHTML = `已读（${end_ts}）：${i+1}/${session_list.length}`
										if(ts_ms()*1000-session_list[i].session_ts < 7 * 24 * 3600 * 1000 * 1000)talker_id_list.push(session_list[i].talker_id)
									}
									if(session_list[session_list.length-1].session_ts < MY_API.CONFIG.get_sessions_end_ts * 1000 || data.data.has_more==0){
										console.log('session_list[session_list.length-1].session_ts',session_list[session_list.length-1].session_ts,MY_API.CONFIG.get_sessions_end_ts)
										MY_API.CONFIG.get_sessions_end_ts = ts_ms()
										return
									}
									if(data.data.has_more==1)return get_sessions(session_list[session_list.length-1].session_ts)
								}
							})
						}
						MY_API.chatLog(`【私信已读提取】开始获取数据！`);
						get_sessions_run_mark = false
						if(MY_API.CONFIG.get_sessions_end_ts == 0)MY_API.chatLog(`【私信已读提取】第一次运行，数据较多，请耐心等待！`);
						await get_sessions()
						MY_API.chatLog(`【私信已读提取】正在提取7天内关键词私信私信,共发现对话${talker_id_list.length}个！`);
						sessions_msg = []
						for(let i=0;i<talker_id_list.length;i++){
							await sleep(200)
							sixin.innerHTML = `提取：${i+1}/${talker_id_list.length}`
							await BAPI.getMsg(talker_id_list[i]).then(async(data) => {//私信内容
								if(data.code==0){
									console.log('私信提取',i+1)
									let msg = data.data.messages
									let un_keyword = ['有奖预约通知']//忽略的关键词
									for(let n=0;n<msg.length;n++){
										if(msg[n].sender_uid==talker_id_list[i] && MY_API.CONFIG.get_sessions_keyword.some(v => msg[n].content.toLowerCase().indexOf(v) > -1) && ts_s()-msg[n].timestamp < 7 * 24 *3600 && !un_keyword.some(v => msg[n].content.toLowerCase().indexOf(v) > -1)){
											MY_API.chatLog(`【私信已读提取】：</br>${msg[n].content}</br><a target="_blank" href="https://message.bilibili.com/#/whisper/mid${talker_id_list[i]}">查看私信</a>`);
											sessions_msg.unshift(`<br>${timestampToTime(msg[n].timestamp)}：内容：${msg[n].content}，<a target="_blank" href="https://message.bilibili.com/#/whisper/mid${talker_id_list[i]}">查看私信</a></br>`)
											$('#sessions_msg span:eq(0)').text(sessions_msg)
											let dt = document.getElementById('sessions_msg'); //通过id获取该div
											dt.innerHTML  = sessions_msg
										}
									}
								}
							})
						}
						sixin.innerHTML = `一键私信已读及提取`
						get_sessions_run_mark = true
						MY_API.chatLog(`【私信已读提取】私信已读及提取结束！`);
						if(sessions_msg.length == 0)MY_API.chatLog(`【私信已读提取】未提取到关键词私信！`);
						if(sessions_msg.length > 0)MY_API.chatLog(`【私信已读提取】提取到关键词私信：${sessions_msg.length}个！`);
					})

					if (MY_API.CONFIG.TALK)
						div.find('div[data-toggle="TALK"] input').attr('checked', '');
					if (MY_API.CONFIG.tu50room)
						tj.find('div[data-toggle="tu50room"] input').attr('checked', ''); //tu50room
					if (MY_API.CONFIG.Anchor_room_get)
						tj.find('div[data-toggle="Anchor_room_get"] input').attr('checked', '');
					if (MY_API.CONFIG.Anchor_room_get_to_always)
						tj.find('div[data-toggle="Anchor_room_get_to_always"] input').attr('checked', '');

					if (MY_API.CONFIG.Anchor_always_room_switch)
						tj.find('div[data-toggle="Anchor_always_room_switch"] input').attr('checked', '');
					if (MY_API.CONFIG.Anchor_room_go_switch)
						div.find('div[data-toggle="Anchor_room_go_switch"] input').attr('checked', '');

					if (MY_API.CONFIG.AUTO_COIN)
						div.find('div[data-toggle="AUTO_COIN"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_COIN2)
						div.find('div[data-toggle="AUTO_COIN2"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_BOX)
						div.find('div[data-toggle="AUTO_BOX"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_HEART_newmodel)
						div.find('div[data-toggle="AUTO_HEART_newmodel"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_sign_danmu)
						div.find('div[data-toggle="AUTO_sign_danmu"] input').attr('checked', '');
					if (MY_API.CONFIG.medal_level_list)
						div.find('div[data-toggle="medal_level_list"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_light)
						div.find('div[data-toggle="AUTO_light"] input').attr('checked', '');
					if (MY_API.CONFIG.sendLiveDanmu_dm_type)
						div.find('div[data-toggle="sendLiveDanmu_dm_type"] input').attr('checked', '');
					if (MY_API.CONFIG.AUTO_DailyReward)
						div.find('div[data-toggle="AUTO_DailyReward"] input').attr('checked', '');


					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_13'){
						document.getElementById("23333").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/a98e35996545509188fe4d24bd1a56518ea5af48.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_15'){
						document.getElementById("daraole").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/a9e2acaf72b663c6ad9c39cda4ae01470e13d845.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_23'){
						document.getElementById("xiaosi").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/aa48737f877cd328162696a4f784b85d4bfca9ce.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_25'){
						document.getElementById("laile").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/61e790813c51eab55ebe0699df1e9834c90b68ba.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_26'){
						document.getElementById("niuniuniu").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/343f7f7e87fa8a07df63f9cba6b776196d9066f0.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_17'){
						document.getElementById("miaoa").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/7b7a2567ad1520f962ee226df777eaf3ca368fbc.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_19'){
						document.getElementById("youdiandongxi").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/39e518474a3673c35245bf6ef8ebfff2c003fdc3.png@.webp"
					}
					if(MY_API.CONFIG.sendLiveDanmu_dm_type_value == 'official_20'){
						document.getElementById("lipu").selected = true
						document.getElementById("bqb_default").src="https://i0.hdslb.com/bfs/live/9029486931c3169c3b4f8e69da7589d29a8eadaa.png@.webp"
					}


					$(".bqb").change(function () {
						if(document.getElementById("23333").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_13'
						if(document.getElementById("daraole").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_15'
						if(document.getElementById("xiaosi").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_23'
						if(document.getElementById("laile").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_25'
						if(document.getElementById("niuniuniu").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_26'
						if(document.getElementById("miaoa").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_17'
						if(document.getElementById("youdiandongxi").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_19'
						if(document.getElementById("lipu").selected == true)MY_API.CONFIG.sendLiveDanmu_dm_type_value = 'official_20'
						MY_API.saveConfig()
						MY_API.chatLog(`表情包弹幕设置：${MY_API.CONFIG.sendLiveDanmu_dm_type_value}`);
					});


					if (MY_API.CONFIG.AUTO_Anchor)
						tj.find('div[data-toggle="AUTO_Anchor"] input').attr('checked', '');
					if (MY_API.CONFIG.switch_sever)
						tj.find('div[data-toggle="switch_sever"] input').attr('checked', '');
					if (MY_API.CONFIG.Anchor_Followings_switch)
						tj.find('div[data-toggle="Anchor_Followings_switch"] input').attr('checked', '');
					if (MY_API.CONFIG.sever_modle)
						tj.find('div[data-toggle="sever_modle"] input').attr('checked', '');
					if (MY_API.CONFIG.GIFT_AUTO)
						div.find('div[data-toggle="onedayLT"] input').attr('checked', '');
					if (MY_API.CONFIG.TIMEAREADISABLE)
						div.find('div[data-toggle="TIMEAREADISABLE"] input').attr('checked', '');
					tj.find('div[data-toggle="AnchorFLASH"] .AnchorFLASH').val((parseInt(MY_API.CONFIG.AnchorFLASH)).toString());
					tj.find('div[data-toggle="AnchorserverFLASH"] .AnchorserverFLASH').val((parseInt(MY_API.CONFIG.AnchorserverFLASH)).toString());
					tj.find('div[data-toggle="AnchorcheckFLASH"] .AnchorcheckFLASH').val((parseInt(MY_API.CONFIG.AnchorcheckFLASH)).toString());
					tj.find('div[data-toggle="Anchor_room_send"] .Anchor_room_send').val((parseInt(MY_API.CONFIG.Anchor_room_send)).toString());
					tj.find('div[data-toggle="Anchor_always_room_add"] .Anchor_always_room_add').val((parseInt(MY_API.CONFIG.Anchor_always_room_add)).toString());
					tj.find('div[data-toggle="Anchor_always_room_switch"] .Anchor_always_room_num').val((parseInt(MY_API.CONFIG.Anchor_always_room_num)).toString()); //Anchor_room_go_switch
					tj.find('div[data-toggle="Anchor_room_go_switch"] .Anchor_room_go').val((parseInt(MY_API.CONFIG.Anchor_room_go)).toString()); //Anchor_room_go_switch



					div.find('div[data-toggle="onedayLT"] .start').val(MY_API.CONFIG.GIFT_ROOM.toString());
					div.find('div[data-toggle="TIMEAREADISABLE"] .start').val(MY_API.CONFIG.TIMEAREASTART.toString());
					div.find('div[data-toggle="TIMEAREADISABLE"] .end').val(MY_API.CONFIG.TIMEAREAEND.toString());

					div.find('div[data-toggle="Anchor_danmu_go"] .end').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_r.toString())); //直播间号
					div.find('div[data-toggle="Anchor_danmu_go"] .start').val(MY_API.CONFIG.Anchor_danmu_go_c.toString()); //弹幕内容
					div.find('div[data-toggle="Anchor_danmu_go"] .number1').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_f.toString())); //间隔
					div.find('div[data-toggle="Anchor_danmu_go"] .number2').val(parseInt(MY_API.CONFIG.Anchor_danmu_go_t.toString())); //次数
					if(MY_API.CONFIG.Anchor_danmu_go_check)div.find('div[data-toggle="Anchor_danmu_go"] input').attr('checked', '');
					div.find('div[data-toggle="Anchor_danmu_go"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_danmu_go_check = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`随机鸡汤文弹幕设置：${MY_API.CONFIG.Anchor_danmu_go_check}`);
					});
					var send_i = 0
					div.find('div[data-toggle="Anchor_danmu_go"] [data-action="save"]').click(async function () {
						MY_API.CONFIG.Anchor_danmu_go_r = parseInt(div.find('div[data-toggle="Anchor_danmu_go"] .end').val());
						MY_API.CONFIG.Anchor_danmu_go_c = div.find('div[data-toggle="Anchor_danmu_go"] .start').val();
						MY_API.CONFIG.Anchor_danmu_go_f = parseInt(div.find('div[data-toggle="Anchor_danmu_go"] .number1').val());
						MY_API.CONFIG.Anchor_danmu_go_t = parseInt(div.find('div[data-toggle="Anchor_danmu_go"] .number2').val());

						if(MY_API.CONFIG.Anchor_danmu_go_c.length>20 && Live_info.user_level<20) {
							MY_API.CONFIG.Anchor_danmu_go_c = MY_API.CONFIG.Anchor_danmu_go_c.slice(0,20)
							MY_API.chatLog(`弹幕字数超出限制！`);
						}
						if(MY_API.CONFIG.Anchor_danmu_go_c.length>30 && Live_info.user_level>=20){
							MY_API.CONFIG.Anchor_danmu_go_c = MY_API.CONFIG.Anchor_danmu_go_c.slice(0,30)
							MY_API.chatLog(`弹幕字数超出限制！`);
						}
						MY_API.saveConfig();
						MY_API.chatLog(`自动弹幕设置【房间-内容-间隔-次数】：${MY_API.CONFIG.Anchor_danmu_go_r}-${MY_API.CONFIG.Anchor_danmu_go_c}-${MY_API.CONFIG.Anchor_danmu_go_f}-${MY_API.CONFIG.Anchor_danmu_go_t}`);
						let send = async function (check) {
							let msg
							if(check){
								let check_msg_length = function () {
									msg = MY_API.CONFIG.poison_chicken_soup[Math.ceil(Math.random() * (MY_API.CONFIG.poison_chicken_soup.length-1))]
									if(msg.length>20 && Live_info.user_level<20)return check_msg_length()
									if(msg.length>30 && Live_info.user_level>=20)return check_msg_length()
								}
								await check_msg_length()
							}else{
								msg = MY_API.CONFIG.Anchor_danmu_go_c
							}
							await BAPI.sendLiveDanmu(msg, MY_API.CONFIG.Anchor_danmu_go_r).then(async(data) => {
								if(data.code==0 && data.message != "k"){
									MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】！`);
								}else if(data.message == "k"){
									MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】失败，弹幕被吞了！`);
								}else{
									MY_API.chatLog(`【弹幕抽奖】已发送弹幕【${msg}】到直播间【${MY_API.CONFIG.Anchor_danmu_go_r}】：${data.message}`);
								}
							})
						}
						for(send_i=0;send_i<MY_API.CONFIG.Anchor_danmu_go_t;send_i++){
							if(send_i==0)MY_API.chatLog(`开始发送弹幕！`);
							await send(MY_API.CONFIG.Anchor_danmu_go_check)
							await sleep(MY_API.CONFIG.Anchor_danmu_go_f * 1000)
						}
					});
					div.find('div[data-toggle="Anchor_danmu_go"] [data-action="save1"]').click(async function () {
						send_i = 999999999
						MY_API.chatLog(`发送弹幕已停止！`);
					})

					div.find('div[data-toggle="AUTO_sign_time"] .hour').val((parseInt(MY_API.CONFIG.medal_sign_time_hour)).toString());
					div.find('div[data-toggle="AUTO_sign_time"] .min').val((parseInt(MY_API.CONFIG.medal_sign_time_min)).toString());

					div.find('div[data-toggle="AUTO_sign_time"] [data-action="save"]').click(function () {
						MY_API.CONFIG.medal_sign_time_hour = parseInt(div.find('div[data-toggle="AUTO_sign_time"] .hour').val());
						if (MY_API.CONFIG.medal_sign_time_hour < 0 || MY_API.CONFIG.medal_sign_time_hour > 23) {
							MY_API.chatLog('请设置0-23');
						}
						MY_API.CONFIG.medal_sign_time_min = parseInt(div.find('div[data-toggle="AUTO_sign_time"] .min').val());
						if (MY_API.CONFIG.medal_sign_time_min < 0 || MY_API.CONFIG.medal_sign_time_min > 59) {
							MY_API.chatLog('请设置0-59');
						}
						MY_API.saveConfig()
						MY_API.chatLog(`签到时间设置【时-分】：${MY_API.CONFIG.medal_sign_time_hour}-${MY_API.CONFIG.medal_sign_time_min}`);
					});


					if (MY_API.CONFIG.push_msg_oneday_check)
						tj.find('div[data-toggle="push_msg_oneday"] input').attr('checked', '');
					tj.find('div[data-toggle="push_msg_oneday"] input:checkbox').change(function () {
						MY_API.CONFIG.push_msg_oneday_check = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`ServerChan设置：${MY_API.CONFIG.push_msg_oneday_check}-${MY_API.CONFIG.push_msg_oneday_hour}-${MY_API.CONFIG.push_msg_oneday_days}`);
					});
					tj.find('div[data-toggle="push_msg_oneday"] .hour').val((parseInt(MY_API.CONFIG.push_msg_oneday_hour)).toString());
					tj.find('div[data-toggle="push_msg_oneday"] .days').val((parseInt(MY_API.CONFIG.push_msg_oneday_days)).toString());
					tj.find('div[data-toggle="push_msg_oneday"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="push_msg_oneday"] .hour').val());
						if(val<0 || val>23) return MY_API.chatLog('请设置0-23');
						MY_API.CONFIG.push_msg_oneday_hour = val;
						MY_API.CONFIG.push_msg_oneday_days = parseInt(tj.find('div[data-toggle="push_msg_oneday1"] .days').val());
						MY_API.saveConfig();
						MY_API.chatLog(`设置【时-天】：${MY_API.CONFIG.push_msg_oneday_check}-${MY_API.CONFIG.push_msg_oneday_hour}-${MY_API.CONFIG.push_msg_oneday_days}`);
					});

					tj.find('div[data-toggle="ServerChan_SCKEY"] .num').val((MY_API.CONFIG.ServerChan_SCKEY).toString());
					tj.find('div[data-toggle="ServerChan_SCKEY"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="ServerChan_SCKEY"] .num').val();
						MY_API.CONFIG.ServerChan_SCKEY = val;
						MY_API.saveConfig();
						MY_API.chatLog(`ServerChan设置：${MY_API.CONFIG.switch_ServerChan_SCKEY}-${MY_API.CONFIG.ServerChan_SCKEY}`);
					});
					if (MY_API.CONFIG.switch_ServerChan_SCKEY)
						tj.find('div[data-toggle="ServerChan_SCKEY"] input').attr('checked', '');
					tj.find('div[data-toggle="ServerChan_SCKEY"] input:checkbox').change(function () {
						MY_API.CONFIG.switch_ServerChan_SCKEY = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`ServerChan设置：${MY_API.CONFIG.switch_ServerChan_SCKEY}-${MY_API.CONFIG.ServerChan_SCKEY}`);
					});
					tj.find('div[data-toggle="go_cqhttp"] .num').val((MY_API.CONFIG.go_cqhttp).toString());
					tj.find('div[data-toggle="go_cqhttp"] .num1').val((MY_API.CONFIG.qq2).toString());
					tj.find('div[data-toggle="go_cqhttp"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="go_cqhttp"] .num').val();
						MY_API.CONFIG.go_cqhttp = val;
						val = tj.find('div[data-toggle="go_cqhttp"] .num1').val();
						MY_API.CONFIG.qq2 = val;
						MY_API.saveConfig();
						MY_API.chatLog(`go_cqhttp已设置：${MY_API.CONFIG.switch_go_cqhttp}-${MY_API.CONFIG.qq2}-${MY_API.CONFIG.go_cqhttp}`);
					});

					if (MY_API.CONFIG.switch_go_cqhttp)
						tj.find('div[data-toggle="go_cqhttp"] input:checkbox').attr('checked', '');
					tj.find('div[data-toggle="go_cqhttp"] input:checkbox').change(function () {
						MY_API.CONFIG.switch_go_cqhttp = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`Qmsg_KEY已设置：${MY_API.CONFIG.switch_go_cqhttp}-${MY_API.CONFIG.go_cqhttp}`);
					});

					tj.find('div[data-toggle="Qmsg_KEY"] .num').val((MY_API.CONFIG.Qmsg_KEY).toString());
					tj.find('div[data-toggle="Qmsg_KEY"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="Qmsg_KEY"] .num').val();
						MY_API.CONFIG.Qmsg_KEY = val;
						MY_API.saveConfig();
						MY_API.chatLog(`Qmsg_KEY已设置：${MY_API.CONFIG.switch_Qmsg_KEY}-${MY_API.CONFIG.Qmsg_KEY}`);
					});
					if (MY_API.CONFIG.switch_Qmsg_KEY)
						tj.find('div[data-toggle="Qmsg_KEY"] input:checkbox').attr('checked', '');
					tj.find('div[data-toggle="Qmsg_KEY"] input:checkbox').change(function () {
						MY_API.CONFIG.switch_Qmsg_KEY = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`Qmsg_KEY已设置：${MY_API.CONFIG.switch_Qmsg_KEY}-${MY_API.CONFIG.Qmsg_KEY}`);
					});

					tj.find('div[data-toggle="push_KEY"] .num').val((MY_API.CONFIG.push_KEY).toString());
					tj.find('div[data-toggle="push_KEY"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="push_KEY"] .num').val();
						MY_API.CONFIG.push_KEY = val;
						MY_API.saveConfig();
						MY_API.chatLog(`push_KEY已设置：${MY_API.CONFIG.switch_push_KEY}-${MY_API.CONFIG.push_KEY}`);
					});
					if (MY_API.CONFIG.switch_push_KEY)
						tj.find('div[data-toggle="push_KEY"] input').attr('checked', '');
					tj.find('div[data-toggle="push_KEY"] input:checkbox').change(function () {
						MY_API.CONFIG.switch_push_KEY = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`push_KEY已设置：${MY_API.CONFIG.switch_push_KEY}-${MY_API.CONFIG.push_KEY}`);
					});

					if (MY_API.CONFIG.medal_change)
						div.find('div[data-toggle="medal_change2"] input').attr('checked', '');
					div.find('div[data-toggle="medal_change2"] input:checkbox').change(async function () {
						MY_API.CONFIG.medal_change = $(this).prop('checked');
						if (MY_API.CONFIG.medal_change && MY_API.CONFIG.medal_roomid_list.length > 0 && MY_API.CONFIG.medal_roomid_list.indexOf(Live_info.room_id) > -1) {
							let nu = MY_API.CONFIG.medal_roomid_list.indexOf(Live_info.room_id)
							BAPI.wear_medal(MY_API.CONFIG.medal_id_list[nu]).then(async(data) => {
								console.log('自动更换勋章反馈数据', data)
								chatLog(`【自动更换勋章】${data.message}`);
							})
						}
						MY_API.saveConfig()
						MY_API.chatLog(`自动更换勋章设置：${MY_API.CONFIG.medal_change}`);
					});
					let run_SCKEY_mark1 = 1
					tj.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save"]').click(function () {
						if (!MY_API.CONFIG.ServerChan_SCKEY || !MY_API.CONFIG.switch_ServerChan_SCKEY)
							return MY_API.chatLog(`参数有误：${MY_API.CONFIG.ServerChan_SCKEY}-${MY_API.CONFIG.switch_ServerChan_SCKEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
						if (run_SCKEY_mark1) {
							ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, `【天选众】${Live_info.uname}：ServerChan推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`);
						} else {
							MY_API.chatLog(`CD中！`);
							return
						}
						run_SCKEY_mark1 = 0
						setTimeout(() => {
							run_SCKEY_mark1 = 1;
						}, 10e3);

					});
					let run_SCKEY_mark2 = 1
					tj.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save1"]').click(function () {
						if (!MY_API.CONFIG.Qmsg_KEY || !MY_API.CONFIG.switch_Qmsg_KEY)
							return MY_API.chatLog(`设置有误：${MY_API.CONFIG.Qmsg_KEY}-${MY_API.CONFIG.switch_Qmsg_KEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
						if (run_SCKEY_mark2) {
							qmsg(MY_API.CONFIG.Qmsg_KEY, `【天选众】${Live_info.uname}：Qmsg推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`);
						} else {
							MY_API.chatLog(`CD中！`);
							return
						}
						run_SCKEY_mark2 = 0
						setTimeout(() => {
							run_SCKEY_mark2 = 1;
						}, 10e3);

					});

					let run_SCKEY_mark3 = 1
					tj.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save2"]').click(function () {
						if (!MY_API.CONFIG.push_KEY || !MY_API.CONFIG.switch_push_KEY)
							return MY_API.chatLog(`设置有误：${MY_API.CONFIG.push_KEY}-${MY_API.CONFIG.switch_push_KEY}<br>请检查是否打勾、保存，刷新后重新尝试！`);
						if (run_SCKEY_mark3) {
							pushmsg(MY_API.CONFIG.push_KEY, `【天选众】${Live_info.uname}：Push推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`);
						} else {
							MY_API.chatLog(`CD中！`);
							return
						}
						run_SCKEY_mark3 = 0
						setTimeout(() => {
							run_SCKEY_mark3 = 1;
						}, 10e3);

					});
					let run_SCKEY_mark4 = 1
					tj.find('div[data-toggle="ServerChan_SCKEY1"] [data-action="save3"]').click(function () {
						if (!MY_API.CONFIG.go_cqhttp || !MY_API.CONFIG.switch_go_cqhttp)
							return MY_API.chatLog(`设置有误：${MY_API.CONFIG.go_cqhttp}-${MY_API.CONFIG.switch_go_cqhttp}<br>请检查是否打勾、保存，刷新后重新尝试！`);
						if (run_SCKEY_mark4) {
							qq(MY_API.CONFIG.qq2, `【天选众】${Live_info.uname}：私有QQ推送测试消息！${year()}年${month()}月${day()}日${hour()}点${minute()}分！`,MY_API.CONFIG.go_cqhttp);
						} else {
							MY_API.chatLog(`CD中！`);
							return
						}
						run_SCKEY_mark4 = 0
						setTimeout(() => {
							run_SCKEY_mark4 = 1;
						}, 10e3);

					});
					tj.find('div[data-toggle="anchor_danmu_content"] .num').val((MY_API.CONFIG.anchor_danmu_content).toString());
					tj.find('div[data-toggle="anchor_danmu_content"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="anchor_danmu_content"] .num').val();
						if (val == '') {
							val = '哈哈哈哈哈哈'
						}
						MY_API.CONFIG.anchor_danmu_content = val.split(",");
						MY_API.saveConfig();
						MY_API.chatLog(`中奖自动弹幕设置：</br>${MY_API.CONFIG.anchor_danmu_content}`);
					});

					div.find('div[data-toggle="sign_danmu_content"] .num').val((MY_API.CONFIG.sign_danmu_content).toString()); //签到弹幕
					div.find('div[data-toggle="sign_danmu_content"] [data-action="save"]').click(function () {
						let val = div.find('div[data-toggle="sign_danmu_content"] .num').val();
						if (val == '') {
							val = '签到'
						}
						MY_API.CONFIG.sign_danmu_content = val.split(",");
						MY_API.saveConfig();
						MY_API.chatLog(`自动签到弹幕设置：</br>${MY_API.CONFIG.sign_danmu_content}`);
					});

					if (MY_API.CONFIG.anchor_danmu)
						tj.find('div[data-toggle="anchor_danmu_content"] input').attr('checked', '');
					tj.find('div[data-toggle="anchor_danmu_content"] input:checkbox').change(function () {
						MY_API.CONFIG.anchor_danmu = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`中奖自动弹幕设置：${MY_API.CONFIG.anchor_danmu}`);
					});

					tj.find('div[data-toggle="anchor_msg_content"] .num').val((MY_API.CONFIG.anchor_msg_content).toString());
					tj.find('div[data-toggle="anchor_msg_content"] [data-action="save"]').click(function () {
						let val = tj.find('div[data-toggle="anchor_msg_content"] .num').val();
						if (val == '') {
							val = '天选中奖了~~'
						}
						MY_API.CONFIG.anchor_msg_content = val.split(",");
						MY_API.saveConfig();
						MY_API.chatLog(`中奖自动私信设置：</br>${MY_API.CONFIG.anchor_msg_content}`);
					});
					if (MY_API.CONFIG.anchor_msg)
						tj.find('div[data-toggle="anchor_msg_content"] input').attr('checked', '');
					tj.find('div[data-toggle="anchor_msg_content"] input:checkbox').change(function () {
						MY_API.CONFIG.anchor_msg = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`中奖自动私信设置：${MY_API.CONFIG.anchor_msg}`);
					});

					tj.find('div[data-toggle="AnchorFLASH"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="AnchorFLASH"] .AnchorFLASH').val());
						if (MY_API.CONFIG.AnchorFLASH === val) {
							MY_API.chatLog('改都没改保存嘛呢');
							return
						}
						if (val < 0) {
							MY_API.chatLog('男人不能太快哦ლ(╹◡╹ლ)');
							val = 0
						}
						/*else if(val>100){
						MY_API.chatLog('太慢了Σ( ° △ °|||)︴');
						val=100
						}*/
						MY_API.CONFIG.AnchorFLASH = val;
						MY_API.saveConfig()
						MY_API.chatLog(`天选巡检房间间隔设置：${MY_API.CONFIG.AnchorFLASH}`);
					});

					tj.find('div[data-toggle="AnchorserverFLASH"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="AnchorserverFLASH"] .AnchorserverFLASH').val());
						if (MY_API.CONFIG.AnchorserverFLASH === val) {
							MY_API.chatLog('改都没改保存嘛呢');
							return
						}
						if (val < 8) {
							MY_API.chatLog('男人不能太快哦ლ(╹◡╹ლ)');
							val = 8
						} else if (val > 50) {
							MY_API.chatLog('太慢了Σ( ° △ °|||)︴');
							val = 50
						}
						MY_API.CONFIG.AnchorserverFLASH = val;
						MY_API.saveConfig()
						MY_API.chatLog(`获取专栏/简介天选数据间隔设置：${MY_API.CONFIG.AnchorserverFLASH}`);
					});
					tj.find('div[data-toggle="AnchorcheckFLASH"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="AnchorcheckFLASH"] .AnchorcheckFLASH').val());
						if (MY_API.CONFIG.AnchorcheckFLASH === val) {
							MY_API.chatLog('改都没改保存嘛呢');
							return
						}
						if (val < 10) {
							MY_API.chatLog('男人不能太快哦ლ(╹◡╹ლ)');
							val = 10
						} else if (val > 5000) {
							MY_API.chatLog('太慢了Σ( ° △ °|||)︴');
							val = 5000
						}
						MY_API.CONFIG.AnchorcheckFLASH = val;
						MY_API.saveConfig()
						MY_API.chatLog(`天选巡检周期间隔设置：${MY_API.CONFIG.AnchorcheckFLASH}`);
					});
					tj.find('div[data-toggle="Anchor_room_send"] [data-action="save"]').click(async function () {//手动推送
						let val = parseInt(tj.find('div[data-toggle="Anchor_room_send"] .Anchor_room_send').val());
						MY_API.CONFIG.Anchor_room_send = val;
						MY_API.saveConfig();
						MY_API.chatLog(`天选手动推送设置：${MY_API.CONFIG.Anchor_room_send}`);
						await BAPI.ajax({url:"xlive/lottery-interface/v1/Anchor/Check?roomid=" + `${val}`}).then(async(data) => {
							let roomlist_data = data.data;
							//console.log('当前天选信息', roomlist_data);
							if(!roomlist_data)return MY_API.chatLog(`${roomlist_data}`)
							let time = Number(roomlist_data.time);
							let id = Number(roomlist_data.id);
							let gift_price = Number(roomlist_data.gift_price);
							let gift_id = Number(roomlist_data.gift_id);
							let gift_num = Number(roomlist_data.gift_num);
							let require_type = Number(roomlist_data.require_type)
							let require_text = roomlist_data.require_text
							let award_name = roomlist_data.award_name;
							let require_value = Number(roomlist_data.require_value);
							let cur_gift_num = Number(roomlist_data.cur_gift_num)
							let danmu = roomlist_data.danmu
							let current_time = roomlist_data.current_time

							Anchor_room_list.push(MY_API.CONFIG.Anchor_room_send);
							Anchor_award_id_list.push(id);
							Anchor_award_nowdate.push(ts_ten_m());

							const post_data_stringify = {
								"uid": Live_info.uid,
								"room_id": val,
								"id": id,
								"time":time,
								"gift_price":gift_price,
								"gift_id":gift_id,
								"gift_num":gift_num,
								"require_type":require_type,
								"require_text":require_text,
								"award_name":award_name,
								"require_value":require_value,
								"cur_gift_num":cur_gift_num,
								"danmu":danmu,
								"current_time":current_time
							}
							const post_data = {id:id,room_id:val,data:JSON.stringify(post_data_stringify)}
							post_data_to_server(post_data,qun_server[0]).then((data) => {
								console.log('post_data_to_server',data)
							})
							//上传服务器
						})

						MY_API.chatLog('正在推送手动提交的天选房间到服务器！');
					});

					tj.find('div[data-toggle="Anchor_always_room_add"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="Anchor_always_room_add"] .Anchor_always_room_add').val());
						MY_API.CONFIG.Anchor_always_room_add = val;
						if (MY_API.CONFIG.Anchor_always_room_list.indexOf(val) == -1) {
							MY_API.CONFIG.Anchor_always_room_list.push(val); //记录天选房间
							if (MY_API.CONFIG.Anchor_always_room_list.length > MY_API.CONFIG.Anchor_always_room_num) {
								MY_API.chatLog(`常驻房间数达到${MY_API.CONFIG.Anchor_always_room_num}，超过设置的上限，移出旧房间${MY_API.CONFIG.Anchor_always_room_list.length-MY_API.CONFIG.Anchor_always_room_num}个`, 'warning');
								MY_API.CONFIG.Anchor_always_room_list.splice(0, MY_API.CONFIG.Anchor_always_room_list.length - MY_API.CONFIG.Anchor_always_room_num);
								MY_API.chatLog('手动添加天选房成功！');
							}
							MY_API.saveConfig()
							MY_API.chatLog(`当前房间列表（共${MY_API.CONFIG.Anchor_always_room_list.length}个）：</br>${MY_API.CONFIG.Anchor_always_room_list}`);
						}else {
							MY_API.chatLog('该房间已在常驻天选房列表！');
						}
					});

					tj.find('div[data-toggle="Anchor_always_room_switch"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="Anchor_always_room_switch"] .Anchor_always_room_num').val());
						MY_API.CONFIG.Anchor_always_room_num = val;
						if (MY_API.CONFIG.Anchor_always_room_list.length > MY_API.CONFIG.Anchor_always_room_num) {
							MY_API.chatLog(`常驻房间数达到${MY_API.CONFIG.Anchor_always_room_num}，超过设置的上限，移出旧房间${MY_API.CONFIG.Anchor_always_room_list.length-MY_API.CONFIG.Anchor_always_room_num}个`, 'warning');
							MY_API.chatLog(`当前房间列表（共${MY_API.CONFIG.Anchor_always_room_num}个）：</br>${MY_API.CONFIG.Anchor_always_room_list}`);
							MY_API.CONFIG.Anchor_always_room_list.splice(0, MY_API.CONFIG.Anchor_always_room_list.length - MY_API.CONFIG.Anchor_always_room_num);
						}
						MY_API.saveConfig()
						MY_API.chatLog(`常驻房间设置：${MY_API.CONFIG.Anchor_always_room_num}`);
					});

					tj.find('div[data-toggle="Anchor_room_go_switch"] [data-action="save"]').click(function () {
						let val = parseInt(tj.find('div[data-toggle="Anchor_room_go_switch"] .Anchor_room_go').val());
						if (val == '') {
							val = 0
						}
						MY_API.CONFIG.Anchor_room_go = val;
						MY_API.saveConfig()
						MY_API.chatLog(`加急直播间巡检设置：${MY_API.CONFIG.Anchor_room_go}`);
					});


					div.find('div[data-toggle="TALK"] input:checkbox').change(function () {
						MY_API.CONFIG.TALK = $(this).prop('checked');
						if (MY_API.CONFIG.TALK == true) { //自定义提示开关
							$('.zdbgjMsg').hide(); //隐藏反馈信息
						}
						MY_API.saveConfig()
						MY_API.chatLog(`反馈信息设置：${MY_API.CONFIG.TALK}`);
					});

					tj.find('div[data-toggle="tu50room"] input:checkbox').change(function () {
						MY_API.CONFIG.tu50room = $(this).prop('checked');
						if (MY_API.CONFIG.tu50room == true) {
							MY_API.CONFIG.getroomnum = 50;
						} else {
							MY_API.CONFIG.getroomnum = 30;
						}
						MY_API.saveConfig()
						MY_API.chatLog(`获取推荐房间数量设置：${MY_API.CONFIG.tu50room}`);
					});
					tj.find('div[data-toggle="Anchor_room_get"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_room_get = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`获取分区加入检索设置：${MY_API.CONFIG.Anchor_room_get}`);
					});

					tj.find('div[data-toggle="Anchor_room_get_to_always"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_room_get_to_always = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`天选房加入常驻设置：${MY_API.CONFIG.Anchor_room_get_to_always}`);
					});

					tj.find('div[data-toggle="Anchor_always_room_switch"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_always_room_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`启用常驻房设置：${MY_API.CONFIG.Anchor_always_room_switch}`);
					});

					tj.find('div[data-toggle="Anchor_room_go_switch"] input:checkbox').change(function () {
						MY_API.CONFIG.Anchor_room_go_switch = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`加急房设置：${MY_API.CONFIG.Anchor_room_go_switch}`);
					});

					div.find('div[data-toggle="AUTO_BOX"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_BOX = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动银瓜子兑换硬币设置：${MY_API.CONFIG.AUTO_BOX}`);
						if (MY_API.CONFIG.AUTO_BOX) {
							setTimeout(() => {
								MY_API.Exchange.run();
							}, 3e3);
						}
					});
					let AUTO_COIN_run_mark = true
					div.find('div[data-toggle="AUTO_COIN"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_COIN = $(this).prop('checked');
						if(MY_API.CONFIG.AUTO_COIN2)document.getElementById("AUTO_COIN2").click()
						if (MY_API.CONFIG.AUTO_COIN && AUTO_COIN_run_mark) {
							AUTO_COIN_run_mark = false
							setTimeout(() => {
								MY_API.chatLog(`【自动投币】设置已保存，60秒后运行！`);
								AUTO_COIN_run_mark = true
								MY_API.DailyReward.dynamic()
							}, 60e3);
						}
						MY_API.saveConfig();
						MY_API.chatLog(`视频投币：${MY_API.CONFIG.AUTO_COIN},专栏投币：${MY_API.CONFIG.AUTO_COIN2}`);
					});

					let AUTO_COIN_run_mark2 = true
					div.find('div[data-toggle="AUTO_COIN2"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_COIN2 = $(this).prop('checked');
						if(MY_API.CONFIG.AUTO_COIN)document.getElementById("AUTO_COIN").click()
						if (MY_API.CONFIG.AUTO_COIN2 && AUTO_COIN_run_mark2) {
							AUTO_COIN_run_mark2 = false
							setTimeout(() => {
								MY_API.chatLog(`【自动投币】设置已保存，60秒后运行！`);
								AUTO_COIN_run_mark2 = true
								MY_API.DailyReward.dynamic()
							}, 60e3);
						}
						MY_API.saveConfig();
						MY_API.chatLog(`视频投币：${MY_API.CONFIG.AUTO_COIN},专栏投币：${MY_API.CONFIG.AUTO_COIN2}`);
					});



					div.find('div[data-toggle="AUTO_HEART_newmodel"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_HEART_newmodel = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动加速获取小心心设置：${MY_API.CONFIG.AUTO_HEART_newmodel}`);
						if (MY_API.CONFIG.AUTO_HEART_newmodel) {
							setTimeout(() => {
								//手机端删除
								MY_API.SmallHeart_model_two();
								//手机端删除
							}, 3e3);
						}
					});
					div.find('div[data-toggle="medal_level_list"] input:checkbox').change(function () {
						MY_API.CONFIG.medal_level_list = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`跳过21级及以上勋章房间设置：${MY_API.CONFIG.medal_level_list}`);
					});
					div.find('div[data-toggle="AUTO_light"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_light = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`当前佩戴勋章自动点亮设置：${MY_API.CONFIG.AUTO_light}`);
					});
					div.find('div[data-toggle="sendLiveDanmu_dm_type"] input:checkbox').change(function () {
						MY_API.CONFIG.sendLiveDanmu_dm_type = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`表情包签到弹幕设置：${MY_API.CONFIG.sendLiveDanmu_dm_type}`);
					});
					div.find('div[data-toggle="AUTO_sign_danmu"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_sign_danmu = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`勋章打卡设置：${MY_API.CONFIG.AUTO_sign_danmu}`);
					});

					div.find('div[data-toggle="AUTO_sign_danmu"] [data-action="save"]').click(async function () { //
						if (medal_sign) {
							MY_API.medal_sign_danmu();
						} else {
							MY_API.chatLog(`【勋章打卡】今日已打卡或正在打卡中！`);
						}
					});

					div.find('div[data-toggle="medal_ignore_roomid_list"] .num').val(MY_API.CONFIG.medal_ignore_roomid_list);
					div.find('div[data-toggle="medal_ignore_roomid_list"] [data-action="save"]').click(function () {
						let val = div.find('div[data-toggle="medal_ignore_roomid_list"] .num').val();
						let list = val.split(",");
						for(let i=0;i<list.length;i++){
							if(MY_API.CONFIG.medal_ignore_roomid_list.indexOf(Number(list[i]))==-1)MY_API.CONFIG.medal_ignore_roomid_list.push(Number(list[i]))
						}
						MY_API.saveConfig();
						MY_API.chatLog(`勋章签到黑名单直播间房间号已设置：</br>${MY_API.CONFIG.medal_ignore_roomid_list}`);
					});

					div.find('div[data-toggle="AUTO_DailyReward"] input:checkbox').change(function () {
						MY_API.CONFIG.AUTO_DailyReward = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`自动每日任务设置：${MY_API.CONFIG.AUTO_DailyReward}`);
						if (MY_API.CONFIG.AUTO_DailyReward) {
							setTimeout(async() => {
								MY_API.DailyReward.login();
								MY_API.DailyReward.dynamic();
							}, 3e3);
						}
					});

					div.find('div[data-toggle="onedayLT"] input:checkbox').change(function () {
						MY_API.CONFIG.GIFT_AUTO = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`当天过期礼物设置：${MY_API.CONFIG.GIFT_AUTO}`);
					});

					div.find('div[data-toggle="onedayLT"] [data-action="save"]').click(function () {
						MY_API.CONFIG.GIFT_ROOM = parseInt(div.find('div[data-toggle="onedayLT"] .start').val());
						MY_API.saveConfig()
						MY_API.chatLog(`当天过期礼物设置：${MY_API.CONFIG.GIFT_ROOM}`);
					});

					div.find('div[data-toggle="TIMEAREADISABLE"] input:checkbox').change(function () {
						MY_API.CONFIG.TIMEAREADISABLE = $(this).prop('checked');
						MY_API.saveConfig()
						MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.TIMEAREADISABLE}<br>${MY_API.CONFIG.TIMEAREASTART}-${MY_API.CONFIG.TIMEAREAEND}`);
					});

					div.find('div[data-toggle="TIMEAREADISABLE"] [data-action="save"]').click(function () {
						let TIMEAREASTART = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
						let TIMEAREAEND = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
						if (TIMEAREASTART >= TIMEAREAEND) {
							MY_API.chatLog('起始时间大于结束时间，时间设置错误，请重新输入');
						} else {
							MY_API.CONFIG.TIMEAREASTART = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .start').val());
							MY_API.CONFIG.TIMEAREAEND = parseInt(div.find('div[data-toggle="TIMEAREADISABLE"] .end').val());
							MY_API.saveConfig()
							MY_API.chatLog(`休眠时间设置：${MY_API.CONFIG.TIMEAREADISABLE}<br>${MY_API.CONFIG.TIMEAREASTART}-${MY_API.CONFIG.TIMEAREAEND}`);
						}
					});

					div.find('#giftCountsent [data-action="countsent"]').click(function () {
						BAPI.room.room_entry_action(2374828); //直播间进入记录
						BAPI.sendLiveDanmu(`Lv${MY_API.CONFIG.BPDJ}，${MY_API.CONFIG.COUNT}`, 2374828)

					});

					div.find('#hb [data-action="tpphide"]').click(function () {
						$('.zdbgjtpp').toggle();
					});
				},
				get_medal_lv_do : async(room,lv_to,ruid) => {
					let do_check=false
					let exp_list=[0,201,300,500,700,1000,1500,1600,1700,1900,5500,10000,10000,10000,15000,40000,50000,100000,250000,500000]
					let medal_list_now = []
					let lv_now=0
					let need_num=0//需要送出小心心的量

					let getMedalList = async function (page = 1) { //粉丝勋章数据
						if (page == 1)
							medal_list_now = [];
						return BAPI.live_fans_medal(page, 10).then((data) => {
							medal_list_now = medal_list_now.concat(data.data.fansMedalList);
							if (data.data.pageinfo.curPage < data.data.pageinfo.totalpages)
								return getMedalList(page + 1);
						}, () => {
							return delayCall(() => getMedalList());
						});
					};

					MY_API.CONFIG.medal_ts = ts_ms()
					await getMedalList()
					if(MY_API.CONFIG.medal_uid_list.length == MY_API.CONFIG.medal_level_list.length && MY_API.CONFIG.medal_id_list.length == MY_API.CONFIG.medal_roomid_list.length && MY_API.CONFIG.medal_level_list.length == MY_API.CONFIG.medal_id_list.length){
						//四组数据长度正常
					}else{//四组数据长度异常清空
						console.log('勋章数据长度异常清空');
						MY_API.CONFIG.medal_uid_list = []
						MY_API.CONFIG.medal_level_list = []
						MY_API.CONFIG.medal_id_list = []
						MY_API.CONFIG.medal_roomid_list = []
					}
					for (let i = 0; i < medal_list_now.length; i++) {//新数据时，lv不需要更新替换
						if(MY_API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)>-1){
							let num=MY_API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)
							MY_API.CONFIG.medal_level_list[num]=(medal_list_now[i].level)//更新lv
							MY_API.CONFIG.medal_roomid_list[num]=room//真实roomid
						}
						if(MY_API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)==-1){
							MY_API.CONFIG.medal_uid_list.push(medal_list_now[i].target_id)
							MY_API.CONFIG.medal_level_list.push(medal_list_now[i].level)
							MY_API.CONFIG.medal_id_list.push(medal_list_now[i].medal_id)
							MY_API.CONFIG.medal_roomid_list.push(room)//真实roomid
						}
					}
					//去掉已经删除的勋章的数据
					let medal_uid_list_now=[]
					for(let i = 0; i < medal_list_now.length; i++){
						medal_uid_list_now[i]=medal_list_now[i].target_id
					}
					for(let i = 0; i < MY_API.CONFIG.medal_uid_list.length; i++){
						if(medal_uid_list_now.indexOf(MY_API.CONFIG.medal_uid_list[i])==-1){
							MY_API.CONFIG.medal_uid_list.splice(i,1)
							MY_API.CONFIG.medal_level_list.splice(i,1)
							MY_API.CONFIG.medal_id_list.splice(i,1)
							MY_API.CONFIG.medal_roomid_list.splice(i,1)
							i--
						}
					}
					//去掉已经删除的勋章的数据
					console.log('勋章uid列表', MY_API.CONFIG.medal_uid_list);
					console.log('勋章level列表', MY_API.CONFIG.medal_level_list);
					console.log('勋章id列表', MY_API.CONFIG.medal_id_list);
					console.log('勋章roomid列表', MY_API.CONFIG.medal_roomid_list);
					MY_API.saveConfig()
					if(lv_to==1){
						console.log('1及勋章不需要升级')
						return false
					}
					let intimacy=0//已有经验
					let today_intimacy=0//今日已获得亲密度
					for(let i=0;i<medal_list_now.length;i++){
						if(medal_list_now[i].target_id==ruid){
							today_intimacy=medal_list_now[i].today_intimacy
							lv_now=medal_list_now[i].level
							intimacy=medal_list_now[i].intimacy
							break
						}
					}
					let need_intimacy=0//当前等级到目标等级需要的经验值
					for(let i=lv_now;i<lv_to;i++){
						need_intimacy=need_intimacy+exp_list[i]
					}

					console.log('当前等级到目标等级需要的经验总值',need_intimacy)
					console.log('当前等级已有经验值',intimacy)
					console.log('今日已投喂的经验值',today_intimacy)
					console.log('今日剩余可投喂的经验值',1500-today_intimacy)
					console.log('需要投喂的经验值',need_intimacy-intimacy)
					if(need_intimacy-intimacy>1500 || need_intimacy-intimacy>1500-today_intimacy ){
						MY_API.chatLog('所需亲密度超出每日上限，取消投喂小心心！', 'warning');
						return false
					}
					need_num=Math.ceil((need_intimacy-intimacy)/50)
					console.log('需要送出的小心心数量',need_num)
					let max_num=0
					await BAPI.gift.bag_list().then(async function (bagResult) {
						for(let i=0;i<bagResult.data.list.length;i++){
							if (bagResult.data.list[i].gift_id === 30607) {
								max_num=max_num+bagResult.data.list[i].gift_num
							}
						}
						console.log('拥有的小心心数量',max_num)
						if(max_num>=need_num){
							let count=0
							for(let t=0;t<bagResult.data.list.length;t++){
								if(need_num==count)break
								for(let tt=0;tt<bagResult.data.list[t].gift_num;tt++){
									if (bagResult.data.list[t].gift_name === '小心心') {
										await sleep(200)
										await BAPI.gift.bag_send(Live_info.uid, 30607, ruid, 1, bagResult.data.list[t].bag_id, room, ts_ms()).then(function (result) {
											if (result.code === 0) {
												MY_API.chatLog('【自动勋章】投喂1个'+ result.data.gift_name + '成功！', 'success');
												count++
												console.log('【自动勋章】已送出的小心心数量',count)
											} else {
												MY_API.chatLog('【自动勋章】小心心赠送失败', 'warning');
											}
										});

									}
									if(need_num==count){
										let num2=MY_API.CONFIG.medal_roomid_list.indexOf(room)
										MY_API.CONFIG.medal_level_list[num2]=lv_to
										MY_API.saveConfig()
										do_check=true
										break
									}
								}
							}
						}else{
							do_check=false
							MY_API.chatLog('【自动勋章】自动勋章升级投喂参加天选所需小心心不足，取消投喂小心心升级！', 'warning');
						}
					})
					return do_check
				},
				medal_sign_danmu:async() => {
					medal_sign = false
					if (!MY_API.CONFIG.medal_roomid_list.length)
						await sleep(60000)
					let medal_roomid_list_now = MY_API.CONFIG.medal_roomid_list
					let medal_level_list_now = MY_API.CONFIG.medal_level_list
					for (let i = 0; i < medal_roomid_list_now.length; i++) {
						if (MY_API.CONFIG.medal_ignore_roomid_list.indexOf(medal_roomid_list_now[i]) > -1) {
							MY_API.chatLog(`【勋章打卡】黑名单直播间，舍弃签到！`);
							continue;
						}
						if (MY_API.CONFIG.medal_level_list && medal_level_list_now[i] > 20) {
							MY_API.chatLog(`【勋章打卡】${medal_level_list_now[i]}级勋章，舍弃签到！`);
							continue;
						}
						await sleep(8000)
						await BAPI.ajax({
							url: "xlive/web-room/v1/index/getRoomPlayInfo?room_id=" + `${medal_roomid_list_now[i]}`
						}).then(async(data) => {
							let code = data.code;
							if (code != 0) {
								console.log(`直播间不存在`);
								MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}不存在，打卡失败！`);
							} else {
								console.log(`直播间真实存在`);
								BAPI.room.room_entry_action(medal_roomid_list_now[i]); //直播间进入记录
								if(MY_API.CONFIG.sendLiveDanmu_dm_type){
									BAPI.sendLiveDanmu_dm_type(MY_API.CONFIG.sendLiveDanmu_dm_type_value, medal_roomid_list_now[i]).then(async(data) => {
										if(data.code==0){
											MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}表情包打卡成功！`);
										}else if(data.code ==10201){
											MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}表情包打卡：${data.message}，切换为普通打卡！`);
											let ii = Math.ceil(Math.random() * (MY_API.CONFIG.sign_danmu_content.length))
											BAPI.sendLiveDanmu(MY_API.CONFIG.sign_danmu_content[ii - 1], medal_roomid_list_now[i]).then(async(data) => {
												if(data.code==0){
													MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}打卡成功！`);
												}else{
													MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}打卡：${data.message}`);
												}
											})
										}else{
											MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}表情包打卡：${data.message}`);
										}
									})
								}else{
									let ii = Math.ceil(Math.random() * (MY_API.CONFIG.sign_danmu_content.length))
									BAPI.sendLiveDanmu(MY_API.CONFIG.sign_danmu_content[ii - 1], medal_roomid_list_now[i]).then(async(data) => {
										if(data.code==0){
											MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}打卡成功！`);
										}else{
											MY_API.chatLog(`【勋章打卡】直播间房间号：${medal_roomid_list_now[i]}打卡：${data.message}`);
										}
									})
								}

							}
						})
					}
					setTimeout(async function () {
						MY_API.chatLog(`【勋章打卡】勋章打卡结束！`);
					},3 * 1000)
					setTimeout(async function () {
						medal_sign = true
					},66 * 1000)
				},
				new_activity_lottery:async function(){
					activity_lottery_run_mark = false
					MY_API.chatLog(`【活动抽奖（新）】开始活动抽奖！`);
					let url = "https://gitee.com/flyxiu/flyx/raw/master/new_activities.json";
					//let url2 = "https://gitee.com/flyxiu/flyx/raw/master/new_activities.json";
					let myjson = await getMyJson(url);
					//let myjson2 = await getMyJson(url2);
					if(myjson[0]== undefined)return MY_API.chatLog(`【活动抽奖（新）】云数据获取异常！`);// && myjson2[0]== undefined
					//for(let i = 0; i < myjson2.length; i++){
					//    if(!myjson.some(v => v.sid ==myjson2[i].sid))myjson.push(myjson2[i])
					//}
					let myjson_p=[]
					for(let i = 0; i < myjson.length; i++){
						if(!MY_API.CONFIG.activity_lottery_gone.some(v => v ==myjson[i].sid))myjson_p.push(myjson[i])
					}
					myjson=myjson_p
					console.log('myjson',myjson)
					let sidtimes = []
					for (let i = 0; i < myjson.length; i++) {
						if (i == 0)
							MY_API.chatLog(`【活动抽奖（新）】开始获取抽奖次数！`);
						sidtimes[i] = 0
						for (let t = 0; t < 21; t++) {
							await sleep(200)
							await BAPI.new_activity_lottery.addtimes(myjson[i].sid).then(async(data) => {
								console.log('BAPI.new_activity_lottery.addtimes', data,myjson[i].sid)
								if (data.code == 75001 || data.code == 75003 || data.code == 170001) {
									t = 999
									MY_API.CONFIG.activity_lottery_gone.push(myjson[i].sid)
									MY_API.saveConfig()
									return
								} //活动不存在/活动已结束
								if (data.code == 75405) {
									t = 999
									return
								} //抽奖机会用尽啦
							})
							await BAPI.new_activity_lottery.mytimes(myjson[i].sid).then(async(data) => {
								console.log('BAPI.new_activity_lottery.mytimes', data)
								if (data.data == undefined || data.data.times == 0) {
									MY_API.chatLog(`【活动抽奖（新）】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									t = 999
									return
								}
								if (sidtimes[i] == data.data.times) {
									MY_API.chatLog(`【活动抽奖（新）】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									t = 999
									return
								}
								sidtimes[i] = data.data.times
							})
						}
						if (i == myjson.length-1)
							MY_API.chatLog(`【活动抽奖（新）】获取抽奖次数结束！`);
					}

					for (let t = 0; t < 500; t++) {
						if(!MY_API.CONFIG.AUTO_activity_lottery)break
						if (t == 0)
							MY_API.chatLog(`【活动抽奖（新）】开始抽奖！`);
						for (let i = 0; i < myjson.length; i++) {
							if (sidtimes[i] <= 0)
								continue
							await sleep(1000)
							await BAPI.new_activity_lottery.do(myjson[i].sid).then(async(data) => {
								console.log('BAPI.new_activity_lottery.do', data)
								if (data.code == 75401 || data.code == 75415 || data.code == 170415 ) { //170415、75415次数不足//74501无抽奖资格|| data.data == undefined
									sidtimes[i] = 0
									return
								}
								if (data.code == 75400) {
									i--
									return
								} //75400频繁
								if (data.code == 0) {
									MY_API.chatLog(`【活动抽奖（新）】正在抽奖（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									MY_API.chatLog(`【活动抽奖（新）】（${i+1}/${myjson.length}）${myjson[i].name}：${data.data[0].gift_name}！`);
									sidtimes[i] = sidtimes[i] - 1
									MY_API.CONFIG.freejournal2.unshift(`<br>${timestampToTime(ts_s())}：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>(${sidtimes[i]+1}，${data.data[0].gift_name})`)
									if (MY_API.CONFIG.freejournal2.length > 500) {
										MY_API.CONFIG.freejournal2.splice(400, 100);
									}
									//console.log(freejournal2)
									MY_API.saveConfig()
									$('#freejournal2 span:eq(0)').text(MY_API.CONFIG.freejournal2)
									let dt = document.getElementById('freejournal2'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal2
								}
								if (data.data !== undefined && data.data[0].gift_name != "未中奖0") {
									BAPI.anchor_postdiscuss(`【活动抽奖（新）】${Xname}：${data.data[0].gift_name}`,server_cv_list[3]).then(async(data) => {
										console.log('anchor_postdiscuss',data)
										if(data.code==0){
											MY_API.CONFIG.congratulations_rpid_ct.push(data.data.reply.rpid)
											MY_API.CONFIG.congratulations_rpid_ct.push(data.data.reply.ctime)
											MY_API.saveConfig()
										}
									})

									const post_data = {id:ts_ms(),room_id:Live_info.uid,data:`【活动抽奖（新）】${Xname}：${data.data[0].gift_name}`}
									post_data_to_server(post_data,qun_server[0]).then((data) => {
										console.log('post_data_to_server',data)
									})

									MY_API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：【活动抽奖（新）】：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>：${data.data[0].gift_name}`)
									MY_API.saveConfig()
									$('#freejournal7 span:eq(0)').text(MY_API.CONFIG.freejournal7)
									let dt = document.getElementById('freejournal7'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal7

									tip(`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`)
									MY_API.chatLog(`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`);
									if(MY_API.CONFIG.switch_go_cqhttp && MY_API.CONFIG.go_cqhttp &&MY_API.CONFIG.qq2){
										qq(MY_API.CONFIG.qq2,`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`,MY_API.CONFIG.go_cqhttp);
									}
									if(MY_API.CONFIG.qqbot && qq_run_mark){
										qq(MY_API.CONFIG.qq,`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`,qun_server[1]);
									}
									if (MY_API.CONFIG.switch_Qmsg_KEY) {
										qmsg(MY_API.CONFIG.Qmsg_KEY, `【活动（新）】${Live_info.uname}：${myjson[i].name}获得${data.data[0].gift_name}！`);
									}
									if (MY_API.CONFIG.switch_ServerChan_SCKEY) {
										ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, `【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`)
									}
									if (MY_API.CONFIG.switch_push_KEY) {
										pushmsg(MY_API.CONFIG.push_KEY, `【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`);
									}
								}
							})
						}
						if (t == 499) {
							MY_API.chatLog(`【活动抽奖（新）】抽奖结束！`);
						}
					}
					activity_lottery_run_mark = true
				},
				activity_lottery:async function(){
					activity_lottery_run_mark = false
					MY_API.chatLog(`【活动抽奖】开始活动抽奖！`);
					let url = "https://gitee.com/java_cn/BILIBLI_RES/raw/master/HNPLATE/plateActivity.json";
					let url2 = "https://gitee.com/flyxiu/flyx/raw/master/activities.json";
					let myjson = await getMyJson(url2);
					let myjson2 = await getMyJson(url);
					if(myjson[0]== undefined && myjson2[0]== undefined)return MY_API.chatLog(`【活动抽奖】云数据获取异常！`);
					for(let i = 0; i < myjson2.length; i++){
						if(!myjson.some(v => v.sid ==myjson2[i].sid))myjson.push(myjson2[i])
					}
					let myjson_p=[]
					for(let i = 0; i < myjson.length; i++){
						if(!MY_API.CONFIG.activity_lottery_gone.some(v => v ==myjson[i].sid))myjson_p.push(myjson[i])
					}
					myjson=myjson_p
					console.log('myjson',myjson)
					let sidtimes = []
					for (let i = 0; i < myjson.length; i++) {
						if (i == 0)
							MY_API.chatLog(`【活动抽奖】开始获取抽奖次数！`);
						sidtimes[i] = 0
						for (let t = 0; t < 21; t++) {
							await sleep(200)
							await BAPI.activity_lottery.addtimes(myjson[i].sid).then(async(data) => {
								console.log('BAPI.activity_lottery.addtimes', data,myjson[i].sid)
								if (data.code == 75001 || data.code == 75003 || data.code == 170001) {
									t = 999
									MY_API.CONFIG.activity_lottery_gone.push(myjson[i].sid)
									MY_API.saveConfig()
									return
								} //活动不存在/活动已结束
								if (data.code == 75405) {
									t = 999
									return
								} //抽奖机会用尽啦
							})
							await BAPI.activity_lottery.mytimes(myjson[i].sid).then(async(data) => {
								console.log('BAPI.activity_lottery.mytimes', data)
								if (data.data == undefined || data.data.times == 0) {
									MY_API.chatLog(`【活动抽奖】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									t = 999
									return
								}
								if (sidtimes[i] == data.data.times) {
									MY_API.chatLog(`【活动抽奖】正在获取抽奖次数（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									t = 999
									return
								}
								sidtimes[i] = data.data.times
							})
						}
						if (i == myjson.length-1)
							MY_API.chatLog(`【活动抽奖】获取抽奖次数结束！`);
					}

					for (let t = 0; t < 500; t++) {
						if(!MY_API.CONFIG.AUTO_activity_lottery)break
						if (t == 0)
							MY_API.chatLog(`【活动抽奖】开始抽奖！`);
						for (let i = 0; i < myjson.length; i++) {
							if (sidtimes[i] <= 0)
								continue
							await sleep(1000)
							await BAPI.activity_lottery.do(myjson[i].sid).then(async(data) => {
								console.log('BAPI.activity_lottery.do', data)
								if (data.code == 75401 || data.code == 75415 || data.code == 170415) { //75415次数不足//74501无抽奖资格|| data.data == undefined
									sidtimes[i] = 0
									return
								}
								if (data.code == 75400) {
									i--
									return
								} //75400频繁
								if (data.code == 0) {
									MY_API.chatLog(`【活动抽奖】正在抽奖（${i+1}/${myjson.length}）：${myjson[i].name}(${sidtimes[i]})！`);
									MY_API.chatLog(`【活动抽奖】（${i+1}/${myjson.length}）${myjson[i].name}：${data.data[0].gift_name}！`);
									sidtimes[i] = sidtimes[i] - 1
									MY_API.CONFIG.freejournal2.unshift(`<br>${timestampToTime(ts_s())}：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>(${sidtimes[i]+1}，${data.data[0].gift_name})`)
									if (MY_API.CONFIG.freejournal2.length > 500) {
										MY_API.CONFIG.freejournal2.splice(400, 100);
									}
									//console.log(freejournal2)
									MY_API.saveConfig()
									$('#freejournal2 span:eq(0)').text(MY_API.CONFIG.freejournal2)
									let dt = document.getElementById('freejournal2'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal2
								}
								if (data.data !== undefined && data.data[0].gift_name != "未中奖0") {
									BAPI.anchor_postdiscuss(`【活动抽奖】${Xname}：${data.data[0].gift_name}`,server_cv_list[3]).then(async(data) => {
										console.log('anchor_postdiscuss',data)
										if(data.code==0){
											MY_API.CONFIG.congratulations_rpid_ct.push(data.data.reply.rpid)
											MY_API.CONFIG.congratulations_rpid_ct.push(data.data.reply.ctime)
											MY_API.saveConfig()
										}
									})
									const post_data = {id:ts_ms(),room_id:Live_info.uid,data:`【活动抽奖（新）】${Xname}：${data.data[0].gift_name}`}
									post_data_to_server(post_data,qun_server[0]).then((data) => {
										console.log('post_data_to_server',data)
									})
									MY_API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：【活动抽奖】：<a target="_blank" href="${myjson[i].url}">${myjson[i].name}</a>：${data.data[0].gift_name}`)
									MY_API.saveConfig()
									$('#freejournal7 span:eq(0)').text(MY_API.CONFIG.freejournal7)
									let dt = document.getElementById('freejournal7'); //通过id获取该div
									dt.innerHTML  = MY_API.CONFIG.freejournal7

									tip(`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`)
									MY_API.chatLog(`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`);
									if(MY_API.CONFIG.switch_go_cqhttp && MY_API.CONFIG.go_cqhttp &&MY_API.CONFIG.qq2){
										qq(MY_API.CONFIG.qq2,`【活动抽奖（新）】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`,MY_API.CONFIG.go_cqhttp);
									}
									if(MY_API.CONFIG.qqbot && qq_run_mark){
										qq(MY_API.CONFIG.qq,`【活动抽奖】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`,qun_server[1]);
									}
									if (MY_API.CONFIG.switch_Qmsg_KEY) {
										qmsg(MY_API.CONFIG.Qmsg_KEY, `【活动】${Live_info.uname}：${myjson[i].name}获得${data.data[0].gift_name}！`);
									}
									if (MY_API.CONFIG.switch_ServerChan_SCKEY) {
										ServerChan2(MY_API.CONFIG.ServerChan_SCKEY, `【活动抽奖】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`)
									}
									if (MY_API.CONFIG.switch_push_KEY) {
										pushmsg(MY_API.CONFIG.push_KEY, `【活动抽奖】${Live_info.uname}：恭喜你在${myjson[i].name}获得${data.data[0].gift_name}！`);
									}
								}
							})
						}
						if (t == 499) {
							MY_API.chatLog(`【活动抽奖】抽奖结束！`);
						}
					}
					setTimeout(() => {
						activity_lottery_run_mark = true
					},66 * 1000)
				},
				chatLog: function (text, type = 'info',time=0,room=0,tip=false) { //自定义提示
					let div = $("<div class='zdbgjMsg'>");
					let msg = $("<div>");
					let tips = $("<div>");
					let rooms = $("<div>");
					let t = $("<div>");
					let ct = $('#chat-items');
					let myDate = new Date();
					msg.html(text);
					tips.html(`<a href="https://greasyfork.org/en/scripts/429508-fetchcut" target="_blank">安装省流脚本</a>`);
					rooms.html(`<a href="https://live.bilibili.com/${room}?fetchcut" target="_blank">省流进入直播间</a>`);
					//t.html(`开奖倒计时：${time}秒`);
					//msg.text(text);
					div.text(myDate.toLocaleString());
					div.append(msg);
				  /*  if(time){
						div.append(t);
						for(let i=0,tt=time;tt>=0;i++,tt--){
							setTimeout(() => {
								t.html(`开奖倒计时：${tt}秒`)
							},1000*i)
						}
						setTimeout(() => {
							t.html(`该抽奖已开奖！`)
						},1000*time+100)
					} */
					if(room)div.append(rooms);
					if(tip)div.append(tips);
					div.css({
						'text-align': 'center',
						'border-radius': '4px',
						'min-height': '30px',
						'width': '256px',
						'color': '#00B2EE',
						'line-height': '30px',
						'padding': '0 10px',
						'margin': '10px auto',
					});
					msg.css({
						'word-wrap': 'break-word',
						'width': '100%',
						'line-height': '20px',
						'margin-bottom': '10px',
					});
					t.css({
						'word-wrap': 'break-word',
						'width': '100%',
						'line-height': '10px',
						'margin-bottom': '10px',
					});
					tips.css({
						'word-wrap': 'break-word',
						'width': '100%',
						'line-height': '10px',
						'margin-bottom': '10px',
					});
					rooms.css({
						'word-wrap': 'break-word',
						'width': '100%',
						'line-height': '10px',
						'margin-bottom': '10px',
					});
					switch (type) {
						case 'warning':
							div.css({
								'border': '1px solid rgb(236, 221, 192)',
								'color': 'rgb(218, 142, 36)',
								'background': 'rgb(245, 235, 221) none repeat scroll 0% 0%',
							});
							break;
						case 'success':
							div.css({
								'border': '1px solid rgba(22, 140, 0, 0.28)',
								'color': 'rgb(69, 171, 69)',
								'background': 'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',
							});
							break;
						default:
							div.css({
								'border': '1px solid rgb(203, 195, 255)',
								'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
							});
					}
					if (MY_API.CONFIG.TALK == false ) { //自定义提示开关
						ct.append(div); //向聊天框加入信息
						let ctt = $('#chat-history-list');
						if (GM_getValue('go_down')){
							ctt.animate({
								scrollTop: ctt.prop("scrollHeight")
							}, 0); //滚动到底部
						}
					}
				},
				sendoneday_gift: async function () {
					if (!MY_API.CONFIG.GIFT_AUTO)return
					let rUid
					if (MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.GIFT_ROOM) > -1 ) {
						let num = MY_API.CONFIG.room_ruid.indexOf(MY_API.CONFIG.GIFT_ROOM)
						rUid = MY_API.CONFIG.room_ruid[num + 1]
					} else {
						await BAPI.live_user.get_anchor_in_room(MY_API.CONFIG.GIFT_ROOM).then(async(data) => {
							if (data.data.info == undefined)return MY_API.chatLog(`用户不存在！`, 'warning');
							rUid = data.data.info.uid;
						});
					}
					await BAPI.gift.bag_list().then(async function (bagResult) {
						let list = bagResult.data.list
						for(let i=0;i<list.length;i++){
							if (list[i].corner_mark === '1天') {
								if(list[i].gift_name === '小心心'|| list[i].gift_name === '辣条'){
									await sleep(1000)
									await BAPI.gift.bag_send(Live_info.uid, list[i].gift_id, rUid, list[i].gift_num, list[i].bag_id, MY_API.CONFIG.GIFT_ROOM, ts_ms()).then(async function (data) {
										if (data.code === 0 ) {
											MY_API.chatLog('【自动送礼】投喂当天过期的' + data.data.gift_num + '个'+ data.data.gift_name + '成功！', 'success');
										} else {
											setTimeout(() => {
												MY_API.sendoneday_gift()
											}, 60000);
											i = 99999
											return MY_API.chatLog('[【自动送礼】投喂失败,一分钟后重试！', 'warning');
										}
									});
								}
							}
						}
					});
				},
				//手机端删除
				SmallHeart_model_two: async () => {// @namespace   https://github.com/lzghzr/TampermonkeyJS// @version     0.1.4// @author      lzghzr// @description B站直播客户端心跳
					if (!MY_API.CONFIG.AUTO_HEART_newmodel) {
						return;
					}
					if(MY_API.CONFIG.LCOUNT>=24) {
						MY_API.chatLog(`【小心心加速】小心心已满`);
						return;
					}
					await sleep(5000);
					const W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
					if (W.BilibiliLive === undefined)
						return console.error(GM_info.script.name, '未获取到uid');
					const uid = W.BilibiliLive.UID;
					const tid = W.BilibiliLive.ANCHOR_UID;
					if (uid === 0)
						return console.error(GM_info.script.name, '未获取到uid');
					const getInfo = () => XHR({
						GM: true,
						anonymous: true,
						method: 'GET',
						url: `https://passport.bilibili.com/x/passport-login/oauth2/info?${appToken.signLoginQuery(`access_key=${tokenData.access_token}`)}`,
						responseType: 'json',
						headers: appToken.headers
					});
					const mobileOnline = () => XHR({
						GM: true,
						anonymous: true,
						method: 'POST',
						url: `https://api.live.bilibili.com/heartbeat/v1/OnLine/mobileOnline?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${baseQuery}`)}`,
						data: `room_id=${W.BilibiliLive.ROOMID}&scale=xxhdpi`,
						responseType: 'json',
						headers: appToken.headers
					});
					const RandomHex = (length) => {
						const words = '0123456789abcdef';
						let randomID = '';
						randomID += words[Math.floor(Math.random() * 15) + 1];
						for (let i = 0; i < length - 1; i++)
							randomID += words[Math.floor(Math.random() * 16)];
						return randomID;
					};
					const uuid = () => RandomHex(32).replace(/(\w{8})(\w{4})\w(\w{3})\w(\w{3})(\w{12})/, `$1-$2-4$3-${'89ab'[Math.floor(Math.random() * 4)]}$4-$5`);
					const mobileHeartBeatJSON = {
						platform: 'android',
						uuid: uuid(),
						buvid: appToken.buvid,
						seq_id: '1',
						room_id: '{room_id}',
						parent_id: '6',
						area_id: '283',
						timestamp: '{timestamp}',
						secret_key: 'axoaadsffcazxksectbbb',
						watch_time: '60',
						up_id: '{target_id}',
						up_level: '40',
						jump_from: '30000',
						gu_id: RandomHex(43),
						play_type: '0',
						play_url: '',
						s_time: '0',
						data_behavior_id: '',
						data_source_id: '',
						up_session: 'l:one:live:record:{room_id}:{last_wear_time}',
						visit_id: RandomHex(32),
						watch_status: '%7B%22pk_id%22%3A0%2C%22screen_status%22%3A1%7D',
						click_id: uuid(),
						session_id: '',
						player_type: '0',
						client_ts: '{client_ts}'
					};
					const wasm = new WasmHash();
					await wasm.init();
					const clientSign = (data) => wasm.hash('BLAKE2b512', wasm.hash('SHA3-384', wasm.hash('SHA384', wasm.hash('SHA3-512', wasm.hash('SHA512', JSON.stringify(data))))));
					const getFansMedal = async () => {
						const funsMedals = await XHR({
							GM: true,
							anonymous: true,
							method: 'GET',
							url: `https://api.live.bilibili.com/fans_medal/v1/FansMedal/get_list_in_room?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&target_id=${tid}&uid=${uid}&${baseQuery}`)}`,
							responseType: 'json',
							headers: appToken.headers
						});
						if (funsMedals !== undefined && funsMedals.response.status === 200)
							if (funsMedals.body.code === 0)
								if (funsMedals.body.data.length > 0)
									return funsMedals.body.data;
					};
					const getGiftNum = async () => {
						let count = 0;
						const bagInfo = await XHR({
							GM: true,
							anonymous: true,
							method: 'GET',
							url: `https://api.live.bilibili.com/xlive/app-room/v1/gift/bag_list?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&room_id=${W.BilibiliLive.ROOMID}&${baseQuery}`)}`,
							responseType: 'json',
							headers: appToken.headers
						});
						if (bagInfo !== undefined && bagInfo.response.status === 200 && bagInfo.body.data.list)
							if (bagInfo.body.code === 0)
								if (bagInfo.body.data.list.length > 0)
									for (const giftData of bagInfo.body.data.list)
										if (giftData.gift_id === 30607) {
											const expire = (giftData.expire_at - Date.now() / 1000) / 60 / 60 / 24;
											if (expire > 6 && expire <= 7)
												count += giftData.gift_num;
										}
						return count;
					};
					const mobileHeartBeat = async (postJSON) => {
						const sign = clientSign(postJSON);
						let postData = '';
						for (const i in postJSON)
							postData += `${i}=${encodeURIComponent(postJSON[i])}&`;
						postData += `client_sign=${sign}`;
						const mobileHeartBeat = await XHR({
							GM: true,
							anonymous: true,
							method: 'POST',
							url: 'https://live-trace.bilibili.com/xlive/data-interface/v1/heartbeat/mobileHeartBeat',
							data: BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${postData}&${baseQuery}`),
							responseType: 'json',
							headers: appToken.headers
						});
						if (mobileHeartBeat !== undefined && mobileHeartBeat.response.status === 200)
							if (mobileHeartBeat.body.code === 0)
								return true;
						return false;
					};
					if (await setToken() === undefined)
						return;
					else {
						const userInfo = await getInfo();
						if (userInfo === undefined)
							return console.error(GM_info.script.name, '获取用户信息错误');
						if (userInfo.body.code !== 0 && await setToken() === undefined)
							return;
						else if (userInfo.body.data.mid !== uid && await setToken() === undefined)
							return;
					}
					mobileOnline();
					const giftNum = await getGiftNum();
					MY_API.CONFIG.LCOUNT = await getGiftNum();
					MY_API.saveConfig();
					if (giftNum < 24) {
						MY_API.chatLog(`【小心心加速】开始发送客户端心跳加速获取小心心！`);
						const fansMedal = await getFansMedal();
						if (fansMedal !== undefined) {
							const control = 24 - giftNum;
							const loopNum = Math.ceil(control / fansMedal.length)*10;
							let num=0
							let mobileHeartBeat_postData = async() => {
								num++
								//console.log('tokenData',tokenData)
								//console.log(GM_info.script.name, '开始客户端心跳');
								//MY_API.chatLog(`正在发送客户端心跳获取小心心`);
								for (const funsMedalData of fansMedal) {
									const postData = Object.assign({}, mobileHeartBeatJSON, {
										room_id: funsMedalData.room_id.toString(),
										timestamp: (BilibiliToken.TS - 30).toString(),
										up_id: funsMedalData.target_id.toString(),
										up_session: `l:one:live:record:${funsMedalData.room_id}:${funsMedalData.last_wear_time}`,
										client_ts: BilibiliToken.TS.toString()
									});
									await mobileHeartBeat(postData);
								}
								if(num>loopNum){
									clearInterval(mobileHeartBeat_Timer);
									await sleep(10000)
									MY_API.CONFIG.LCOUNT = await getGiftNum();
									MY_API.saveConfig();
									if(MY_API.CONFIG.LCOUNT>=24){
										MY_API.chatLog(`【小心心加速】小心心已满！`);
									}else{
										return MY_API.SmallHeart_model_two()
									}
								}
							}
							let mobileHeartBeat_Timer=setInterval(mobileHeartBeat_postData, 30e3);
						}else{
							MY_API.chatLog(`【小心心加速】未拥有粉丝牌或获取勋章数据失败！`);
						}
					}else{
						//console.log(GM_info.script.name, '小心心已满');
						MY_API.chatLog(`【小心心加速】小心心已满`);
					}
				},
				//手机端删除
				MaterialObject: {
					list: [],
					ignore_keyword: ['test', 'encrypt', '测试', '钓鱼', '加密', '炸鱼'],
					run: () => {
						if (!MY_API.CONFIG.AUTO_GOLDBOX)
							return;
						try {
							if (MY_API.CONFIG.materialobject_ts) {
								const diff = ts_ms() - MY_API.CONFIG.materialobject_ts;
								const interval = 30 * 60e3;
								if (diff < interval) {
									setTimeout(MY_API.MaterialObject.run, interval - diff);
									return $.Deferred().resolve();
								}
							}
							return MY_API.MaterialObject.check().then((aid) => {
								if (aid) { // aid有效
									MY_API.CONFIG.last_aid = aid;
									MY_API.CONFIG.materialobject_ts = ts_ms();
									MY_API.saveConfig();
								}
								setTimeout(MY_API.MaterialObject.run, 10 * 60e3);
							}, () => delayCall(() => MY_API.MaterialObject.run()));
						} catch (err) {
							MY_API.chatLog('【实物宝箱抽奖】运行时出现异常', 'warning');
							console.error(`[${NAME}]`, err);
							return $.Deferred().reject();
						}
					},
					check: async(aid, valid = 650, rem = 9) => { // TODO
						aid = parseInt(aid || (MY_API.CONFIG.last_aid), 10);
						if (isNaN(aid))
							aid = valid;
						await sleep(1000)
						return BAPI.Lottery.MaterialObject.getStatus(aid).then((response) => {
							if (response.code === 0 && response.data) {
								if (MY_API.MaterialObject.ignore_keyword.some(v => response.data.title.toLowerCase().indexOf(v) > -1)) {
									MY_API.chatLog(`【实物宝箱抽奖】忽略可疑抽奖(aid=${aid})！`, 'warning');
									return MY_API.MaterialObject.check(aid + 1, aid);
								} else {
									return MY_API.MaterialObject.join(aid, response.data.title, response.data.typeB).then(() => MY_API.MaterialObject.check(
										aid + 1, aid));
								}
							} else if (response.code === -400) { // 活动不存在
								if (rem)
									return MY_API.MaterialObject.check(aid + 1, valid, rem - 1);
								return $.Deferred().resolve(valid);
							} else {
								MY_API.chatLog(`【实物宝箱抽奖】${response.msg}`, 'info');
							}
						}, () => {
							MY_API.chatLog(`【实物宝箱抽奖】检查抽奖(aid=${aid})失败，请检查网络`, 'warning');
							return delayCall(() => MY_API.MaterialObject.check(aid, valid));
						});
					},
					join: (aid, title, typeB, i = 0) => {
						if (i >= typeB.length)
							return $.Deferred().resolve();
						MY_API.chatLog(`【${title}】${i+1}/${typeB.length}：${typeB[i].list[0].jp_name}，${typeB[i].startTime}`);
						if (MY_API.MaterialObject.list.some(v => v.aid === aid && v.number === i + 1))
							return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
						const number = i + 1;
						const obj = {
							title: title,
							aid: aid,
							number: number,
							status: typeB[i].status,
							join_start_time: typeB[i].join_start_time,
							join_end_time: typeB[i].join_end_time,
							startTime: typeB[i].startTime,
							jp_name: typeB[i].list[0].jp_name
						};
						switch (obj.status) {
							case -1: // 未开始
								{
									MY_API.MaterialObject.list.push(obj);
									const p = $.Deferred();
									p.then(() => {
										return MY_API.MaterialObject.draw(obj);
									});
									setTimeout(() => {
										p.resolve();
									}, (obj.join_start_time - ts_s() + 1) * 1e3);
								}
								break;
							case 0: // 可参加
								{
									return MY_API.MaterialObject.draw(obj).then(() => {
										return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
									});
								}

							case 1: // 已参加
								{
									MY_API.MaterialObject.list.push(obj);
								}
								break;
						}
						return MY_API.MaterialObject.join(aid, title, typeB, i + 1);
					},
					draw: (obj) => { //obj.aid
						if (!MY_API.CONFIG.AUTO_GOLDBOX)
							return; //实现实时改变不参与实物抽奖，蹭服务器模式AUTO_GOLDBOX_sever
						return BAPI.Lottery.MaterialObject.draw(obj.aid, obj.number).then((response) => {
							if (response.code === 0) {
								$.each(MY_API.MaterialObject.list, (i, v) => {
									if (v.aid === obj.aid && v.number === obj.number) {
										v.status = 1;
										MY_API.MaterialObject.list[i] = v;
										MY_API.CONFIG.COUNT_GOLDBOX++;
										$('#giftCoun span:eq(0)').text(MY_API.CONFIG.COUNT_GOLDBOX);
										$('#COUNT_GOLDBOX span:eq(0)').text(MY_API.CONFIG.COUNT_GOLDBOX);
										MY_API.chatLog(`【实物宝箱抽奖】成功参加抽奖：【${obj.title}】(aid=${obj.aid},number=${obj.number})！`, 'success');

										MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：【${obj.title}】${obj.jp_name}(aid=${obj.aid},number=${obj.number})`)
										if (MY_API.CONFIG.freejournal3.length > 500) {
											MY_API.CONFIG.freejournal3.splice(400, 100);
										}
										MY_API.saveConfig();
										$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
										let dt = document.getElementById('freejournal3'); //通过id获取该div
										dt.innerHTML  = MY_API.CONFIG.freejournal3

										return false;
									}
								});

							} else if(response.code == -403){
								$.each(MY_API.MaterialObject.list, (i, v) => {
									if (v.aid === obj.aid && v.number === obj.number) {
										v.status = 1;
										MY_API.MaterialObject.list[i] = v;
										MY_API.chatLog(`【实物宝箱抽奖】(aid=${obj.aid},number=${obj.number})${response.message}`, 'warning');

										MY_API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：【${obj.title}】${obj.jp_name}(aid=${obj.aid},number=${obj.number})，${response.message}！`)
										if (MY_API.CONFIG.freejournal3.length > 500) {
											MY_API.CONFIG.freejournal3.splice(400, 100);
										}
										MY_API.saveConfig();
										$('#freejournal3 span:eq(0)').text(MY_API.CONFIG.freejournal3)
										let dt = document.getElementById('freejournal3'); //通过id获取该div
										dt.innerHTML  = MY_API.CONFIG.freejournal3

										return false;
									}
								});
							} else {
								MY_API.chatLog(`【实物宝箱抽奖】【${obj.title}】(aid=${obj.aid},number=${obj.number})${response.message}`, 'warning');
							}
						}, () => {
							MY_API.chatLog(`【实物宝箱抽奖】参加【${obj.title}】(aid=${obj.aid},number=${obj.number})失败，请检查网络`, 'warning');
							return delayCall(() => MY_API.MaterialObject.draw(obj));
						});
					},
				},
				DailyReward: {//每日任务：主站登陆、观看、转发
					get_user_info:() => {
						return BAPI.get_user_info().then((re) => {
							if(re.code == 0){
								Live_info.uname = re.data.uname
								Live_info.user_level = re.data.user_level
								if(String(Live_info.uname).length>3){
									Xname = String(Live_info.uname).substr(-2).padStart(String(Live_info.uname).length, "*")
								}else{
									Xname = String(Live_info.uname).substr(-1).padStart(String(Live_info.uname).length, "*")
								}
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日登录]完成失败，请检查网络', 'warning');
							return delayCall(() => MY_API.get_user_info());
						});
					},
					nav:() => {
						return BAPI.nav().then((re) => {
							if(re.code == 0){
								Live_info.uname = re.data.uname;
								Live_info.uid = re.data.mid
								Live_info.coin = re.data.money
								Live_info.Blever = re.data.level_info.current_level
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日登录]完成失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.nav());
						});
					},
					DoSign: () => {
						return BAPI.DoSign().then((response) => {
							console.log('每日直播区签到', response)
							if (response.code === 0) {
								MY_API.chatLog(`[自动每日奖励]直播区签到成功！`, 'success');
							} else if (response.code == 1011040) {
								// 已签到
								MY_API.chatLog('[自动每日奖励]直播区已签到！', 'warning');
							}  else {
								MY_API.chatLog(`[自动每日奖励]${response.message}`, 'warning');
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励]直播区已签到失败，请检查网络！', 'warning');
							return  setTimeout(function () {MY_API.DailyReward.DoSign()},10 * 60 *1000)
						});
					},
					login: () => {
						if (!MY_API.CONFIG.AUTO_DailyReward)
							return;
						return BAPI.DailyReward.login().then(() => {
							MY_API.chatLog('[自动每日奖励][每日登录]完成', 'success');
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日登录]完成失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.login());
						});
					},
					share: (aid) => {
						return BAPI.DailyReward.share(aid).then((response) => {
							console.log('每日分享', response)
							if (response.code === 0) {
								MY_API.chatLog(`[自动每日奖励][每日分享]分享成功(av=${aid})`, 'success');
							} else if (response.code === 71000) {
								// 重复分享
								MY_API.chatLog('[自动每日奖励][每日分享]今日分享已完成', 'info');
							} else if (response.code === 137004) {
								// 账号异常，操作失败
								MY_API.chatLog('[自动每日奖励][每日分享]账号异常，操作失败!', 'warning');
							} else {
								MY_API.chatLog(`[自动每日奖励][每日分享]${response.message}`, 'warning');
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日分享]分享失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.share(aid));
						});
					},
					watch: (aid, cid) => {
						return BAPI.DailyReward.watch(aid, cid, Live_info.uid, ts_s()).then((response) => {
							console.log('每日观看', response)
							if (response.code === 0) {
								MY_API.chatLog(`[自动每日奖励][每日观看]完成(av=${aid})`, 'success');
							} else {
								MY_API.chatLog(`[自动每日奖励][每日观看]${response.message}`, 'caution');
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日观看]完成失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.watch(aid, cid));
						});
					},
					article_coin_add: async () => {
						if(!MY_API.CONFIG.AUTO_COIN2) return
						if(GM_getValue('coins')==50) return
						if(Live_info.coin<1) return
						return BAPI.article_recommends().then(async(response) => {
							let oidlist = response.data
							for(let i = 0;i<5;i++){
								await BAPI.article_coin_add(oidlist[i].id,oidlist[i].author.mid).then(async(response) => {
									console.log('每日专栏投币', response)
									if (response.code === 0) {
										MY_API.chatLog(`[自动每日奖励][每日专栏投币]投币1个成功(av=${oidlist[i].id})`, 'success');
										Live_info.coin--
										if(Live_info.coin<0) return MY_API.chatLog(`[自动每日奖励][每日专栏投币]硬币不足！`, 'warning');
										GM_setValue('coins',GM_getValue('coins')+10)
										if(GM_getValue('coins')==50) MY_API.chatLog(`[自动每日奖励][每日专栏投币]投币5个已完成！`, 'success');
									} else if(response.code == -104){
										i = 9999
										MY_API.chatLog(`[自动每日奖励][每日专栏投币]${response.message}`, 'warning');
									}else{
										MY_API.chatLog(`[自动每日奖励][每日专栏投币]${response.message}`, 'warning');
									}
								}, () => {
									MY_API.chatLog('[自动每日奖励][每日专栏投币]投币失败，请检查网络', 'warning');
									return delayCall(() => MY_API.DailyReward.article_coin_add());
								})
								await sleep(5000)
							}
						})
					},
					coin_add: async (aid,n) => {
						if(!MY_API.CONFIG.AUTO_COIN) return
						if(GM_getValue('coins')==50) return
						await sleep(n * 5000)
						if(Live_info.coin<1) return
						return BAPI.coin_add(aid).then(async(response) => {
							console.log('每日视频投币', response)
							if (response.code === 0) {
								MY_API.chatLog(`[自动每日奖励][每日视频投币]投币1个成功(av=${aid})`, 'success');
								Live_info.coin--
								if(Live_info.coin<0) return MY_API.chatLog(`[自动每日奖励][每日视频投币]硬币不足！`, 'warning');
								GM_setValue('coins',GM_getValue('coins')+10)
								if(GM_getValue('coins')==50) MY_API.chatLog(`[自动每日奖励][每日视频投币]投币5个已完成！`, 'success');
							} else {
								MY_API.chatLog(`[自动每日奖励][每日视频投币]${response.message}`, 'warning');
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励][每日视频投币]投币失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.coin_add(aid));
						});
					},
					dynamic: async() => {
						if(!MY_API.CONFIG.AUTO_DailyReward)return;
						if(GM_getValue('coins') == undefined)GM_setValue('coins', 0)
						await BAPI.exp().then((response) => {
							console.log('今日投币已获经验exp',response.data)
							if (response.code === 0) {
								GM_setValue('coins', response.data)
								if(GM_getValue('coins')==50) {
									MY_API.chatLog(`[自动每日奖励][每日投币]投币5个已完成！`, 'success');
								}else{
									if(Live_info.coin<1) MY_API.chatLog(`[自动每日奖励][每日投币]硬币不足！`, 'warning');
								}
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励]获取动态失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.dynamic());
						})
						return BAPI.dynamic_svr.dynamic_new(Live_info.uid, 8).then(async (response) => {
							console.log('dynamic_svr.dynamic_new',response,response.data.cards.length)
							if (response.code === 0) {
								if (!!response.data.cards) {
									if(response.data.cards.length<5) return MY_API.chatLog('[自动每日奖励]"动态-投稿视频"中暂无动态或不足', 'warning');
									const obj = JSON.parse(response.data.cards[0].card);
									const obj1 = JSON.parse(response.data.cards[1].card);
									const obj2 = JSON.parse(response.data.cards[2].card);
									const obj3 = JSON.parse(response.data.cards[3].card);
									const obj4 = JSON.parse(response.data.cards[4].card);
									const p1 = MY_API.DailyReward.watch(obj.aid, obj.cid);
									const p2 = MY_API.DailyReward.share(obj.aid);
									const p3 = MY_API.DailyReward.article_coin_add()
									const p11 = MY_API.DailyReward.coin_add(obj1.aid,1);
									const p12 = MY_API.DailyReward.coin_add(obj2.aid,2);
									const p13 = MY_API.DailyReward.coin_add(obj3.aid,3);
									const p14 = MY_API.DailyReward.coin_add(obj4.aid,4);
									const p15 = MY_API.DailyReward.coin_add(obj.aid,5);
									return $.when(p1,p2,p3,p11,p12,p13,p14,p15);
								} else {
									MY_API.chatLog('[自动每日奖励]"动态-投稿视频"中暂无动态', 'info');
								}
							} else {
								MY_API.chatLog(`[自动每日奖励]获取"动态-投稿视频"${response.msg}`, 'caution');
							}
						}, () => {
							MY_API.chatLog('[自动每日奖励]获取"动态-投稿视频"失败，请检查网络', 'warning');
							return delayCall(() => MY_API.DailyReward.dynamic());
						});
					},
				}, // Once Run every day "api.live.bilibili.com"

				Exchange: {
					silver2coin: () => {
						if (!MY_API.CONFIG.AUTO_BOX) return;
						return BAPI.Exchange.silver2coin().then((response) => {
							console.log('Exchange.silver2coin: API.SilverCoinExchange.silver2coin', response);
							if (response.code === 0) {
								MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'success'); // 兑换成功
							} else if (response.code === 403) {
								MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'warning'); // 每天最多能兑换 1 个or银瓜子余额不足
							} else {
								MY_API.chatLog(`【银瓜子换硬币】${response.message}`, 'warning');
							}
						}, () => {
							MY_API.chatLog('【银瓜子换硬币】兑换失败，请检查网络', 'warning');
							return delayCall(() => MY_API.Exchange.silver2coin());
						});
					},
					run: () => {
						if (!MY_API.CONFIG.AUTO_BOX)
							return;
						try {
							return MY_API.Exchange.silver2coin().then(() => {}, () => delayCall(() => MY_API.Exchange.run()));
						} catch (err) {
							MY_API.chatLog('【银瓜子换硬币】运行时出现异常，已停止', 'warning');
							console.error(`[${NAME}]`, err);
							return $.Deferred().reject();
						}
					}
				}, // 硬币1
			};
			MY_API.init().then(function () {
				if (parseInt(Live_info.uid) === 0 || isNaN(parseInt(Live_info.uid))) {
					MY_API.chatLog('未登录，请先登录再使用本系统', 'warning');
					return
				}
				if (true) {
					try {
						const promiseInit = $.Deferred();
						const uniqueCheck = () => {
							const t = Date.now();
							if (t - MY_API.CONFIG.JSMARK >= 0 && t - MY_API.CONFIG.JSMARK <= 15e3) {
								// 其他脚本正在运行
								setTimeout(() => {
									MY_API.chatLog('检测到系统已经运行！', 'warning');
								}, 5e3);
								return promiseInit.reject();
							}
							// 没有其他脚本正在运行
							return promiseInit.resolve();
						};
						uniqueCheck().then(() => {
							let timer_unique;
							const uniqueMark = () => {
								timer_unique = setTimeout(uniqueMark, 10e3);
								MY_API.CONFIG.JSMARK = Date.now();
								try {
									localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
									return true
								} catch (e) {
									console.log('API保存出错', e);
									return false
								};
							};
							window.addEventListener('unload', () => {
								if (timer_unique) {
									clearTimeout(timer_unique);
									MY_API.CONFIG.JSMARK = 0;
									try {
										localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
										return true
									} catch (e) {
										console.log('API保存出错', e);
										return false
									};
								}
							});
							uniqueMark();
							StartPlunder(MY_API);
						})
					} catch (e) {
						console.error('重复运行检测错误', e);
					}
				}
			});
		}

		async function StartPlunder(API) {
			API.chatLog('正在载入各种云数据，请稍等......')
			let room_ruid_get_data = async function () {
				let url = "https://gitee.com/flyxiu/flyx/raw/master/room_uid.json";
				room_ruid_get = await getMyJson(url);
				//console.log('room_ruid_get',room_ruid_get);
				for (let i = 0; i < room_ruid_get.length; i++) {
					if (API.CONFIG.room_ruid.indexOf(room_ruid_get[i]) == -1) {
						API.CONFIG.room_ruid.push(room_ruid_get[i])
					}
				}
				API.saveConfig()
			}
			room_ruid_get_data()

			if (GM_getValue('ghost') == undefined)GM_setValue('ghost', [])
			let check_code =async function () {
				let url = "https://gitee.com/flyxiu/flyx/raw/master/ghost.json";
				let ghost = await getMyJson(url);
				if(ghost[0]== undefined)return
				if(GM_getValue('ghost')[0] !== ghost[0]){
					let code=prompt("请输入神秘代码","小鸡炖蘑菇");
					if(ghost == code){
						GM_setValue('ghost', ghost)
					}else{
						await sleep(1000)
						await check_code()
					}
				}
			}
			API.chatLog('正在核对神秘代码！')
			await check_code()
			API.chatLog('神秘代码检查完成！')
			let getversion = async function () {
				API.chatLog('正在检查版本情况！')
				let version_t= GM_info.script.version.split('.')
				let version=version_t[0]*10000+version_t[1]*100+version_t[2]
				let version_weburl = "https://gitee.com/flyxiu/flyx/raw/master/ver.json";
				let version_web = await getMyJson(version_weburl);
				if(version_web[0]== undefined) return chatLog(`版本数据获取异常！`);
				let v1 = parseInt(version_web[0]/1000000)
				let v2 = parseInt((version_web[0] - v1 * 1000000)/10000)
				let v3 = version_web[0] - v1 * 1000000 - v2 * 10000
				if(version_web[0]>version){
					let btn6 = $(`<a target="_blank" href="${GM_info.script.homepage}">` +
								 `<button id='btn6'style="position: absolute; top:173px;left:120px;z-index: 999;background-color: pink;color: red;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">` +
								 `当前Ver：${GM_info.script.version}</br>新版Ver：${v1}.${v2}.${v3}</br>点击更新！</button></a>`);
					$('.chat-history-panel').append(btn6);
					btn6.click(function () {
						API.chatLog('更新完成后记得刷新网页，使新脚本生效！！', 'warning')
					});
					setTimeout(() => {
						API.chatLog(`当前Ver：${GM_info.script.version}</br>新版Ver：${v1}.${v2}.${v3}</br>更新内容：${version_web[1]}`);
					},3000)
				}
				API.chatLog('版本检查完成！')
				if(API.CONFIG.AUTO_dynamic_create || API.CONFIG.not_office_dynamic_go){
					API.chatLog('正在载入鸡汤文！')
					API.CONFIG.poison_chicken_soup = await getMyJson("https://gitee.com/flyxiu/flyx/raw/master/soup.json");
					API.chatLog('载入鸡汤文完成！')
				}
				if(qq_run_mark){
					let kill_room_uid = await getMyJson("https://gitee.com/flyxiu/flyx/raw/master/kill_room_uid.json");
					for(let i=0;i<kill_room_uid.length;i=i+2){
						if(API.CONFIG.ALLFollowingList.indexOf(Number(kill_room_uid[i+1]))>-1){
							BAPI.modify(kill_room_uid[i+1], 2)
							await sleep(1000)
						}
						if(API.CONFIG.Anchor_ignore_uid.indexOf(Number(kill_room_uid[i]))==-1)API.CONFIG.Anchor_ignore_uid.push(Number(kill_room_uid[i]))
					}
				}
				//651039864//37663924
				let get_dt =async function (uid,name,dt_keyword) { //动态
					BAPI.space_history(uid).then(async function (data) {
						console.log('监控',name,uid,data)
						if (data.code == 0) {
							let cards = data.data.cards
							for (let i = 0; i < cards.length; i++) {
								if (ts_s() - cards[i].desc.timestamp <= API.CONFIG.dtjk_flash * 1.5) {//通知1.5倍内的动态
									if (dt_keyword.some(v => cards[i].card.toLowerCase().indexOf(v) > -1)) {
										const card = JSON.parse(cards[i].card)
										if (card.item != undefined && card.item.content != undefined){
											//qqqun(678249337, `${name}：${card.item.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											//qqqun(746790091, `${name}：${card.item.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											qq(API.CONFIG.qq, `${name}：${card.item.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);

										}
										if (card.item != undefined && card.item.description != undefined){
											//qqqun(678249337, `${name}：${card.item.description}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											//qqqun(746790091, `${name}：${card.item.description}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											qq(API.CONFIG.qq, `${name}：${card.item.description}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
										}
										if (card.vest != undefined){
											//qqqun(678249337, `${name}：${card.vest.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											//qqqun(746790091, `${name}：${card.vest.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
											qq(API.CONFIG.qq, `${name}：${card.vest.content}https://t.bilibili.com/${cards[i].desc.dynamic_id_str}`,qun_server[1]);
										}
									}
								}
							}
						}
					})
				}
				setInterval(() => {
					if(API.CONFIG.qq_dt){
						get_dt(651039864,"半佛",["代码","【","感谢"])
						get_dt(37663924,"半佛",["代码","【","感谢"])
					}
					if(API.CONFIG.qq_zdy){
						get_dt(API.CONFIG.dtjk_uid,API.CONFIG.dtjk_name,API.CONFIG.dtjk_keyword)
					}
				}, API.CONFIG.dtjk_flash * 1000);//监控间隔秒
			}
			await getversion()
			let get_GOLDBOX = async function () {
				API.chatLog('正在检查更新云宝箱数据！')
				let url = "https://gitee.com/flyxiu/flyx/raw/master/GOLDBOX.json";
				let w_MaterialObject = await getMyJson(url);
				if(w_MaterialObject[0]== undefined){
					MaterialObject = []
					API.chatLog(`无云数据或获取异常！`);
				}else{
					MaterialObject = w_MaterialObject
					API.chatLog('群主云宝箱数据更新完成！')
					for(let i=0;i<MaterialObject.length;i++){
						if(ts_s()< MaterialObject[i].join_end_time)API.chatLog(`${MaterialObject[i].title}<br>时间：${timestampToTime(MaterialObject[i].join_start_time)}至${timestampToTime(MaterialObject[i].join_end_time)}<br>${MaterialObject[i].jp_name}×${MaterialObject[i].jp_num}`)
					}
				}
				console.log('群主云宝箱数据',MaterialObject)
			}
			if(API.CONFIG.AUTO_GOLDBOX_sever2) get_GOLDBOX()
			setInterval(() => {
				if(API.CONFIG.AUTO_GOLDBOX_sever2) get_GOLDBOX()
			},600000)
			$('.emoticons-guide-panel.secondPos').remove()//弹出的表情
			let get_dtfz =  async function () {
				if (API.CONFIG.dynamic_lottery || API.CONFIG.detail_by_lid_dynamic) {//初始
					await BAPI.get_tags().then(async(data) => {//获取分组ID
						dynamic_lottery_tags_tagid = 0
						let tags_data = data.data
						for (let i = 0; i < tags_data.length; i++) {
							if(tags_data[i].name == '动态抽奖')
								dynamic_lottery_tags_tagid = tags_data[i].tagid
						}
						console.log(`【动态抽奖】动态抽奖分组ID:${dynamic_lottery_tags_tagid}`);
					})

					if(!dynamic_lottery_tags_tagid){
						await BAPI.tag_create('动态抽奖').then(async(data) => {//创建分组
							if (data.code == 0) {
								console.log(`【动态抽奖】动态抽奖分组创建成功！`);
							}
							if (data.code == 22106) {
								console.log(`【动态抽奖】动态抽奖分组:${data.message}`);
							}
						});
						await BAPI.get_tags().then(async(data) => {//获取分组ID
							dynamic_lottery_tags_tagid = 0
							let tags_data = data.data
							for (let i = 0; i < tags_data.length; i++) {
								if(tags_data[i].name == '动态抽奖')
									dynamic_lottery_tags_tagid = tags_data[i].tagid
							}
							console.log(`【动态抽奖】动态抽奖分组ID:${dynamic_lottery_tags_tagid}`);
						})
					}
				}
			}
			get_dtfz()
			let lighte_weared_medal = async function () {
				BAPI.get_weared_medal().then((data) => {
					if(data.code == 0){
						if(data.data.is_lighted == 0){
							API.chatLog(`【佩戴勋章点亮】当前佩戴勋章已灭！`, 'warning');
							if(API.CONFIG.AUTO_light){
								let send = function () {
									BAPI.sendLiveDanmu('啊勋章灰了', data.data.roominfo.room_id).then(async(data) => {
										if(data.code==0 && data.message != "k"){
											API.chatLog(`【佩戴勋章点亮】点亮弹幕发送成功！`);
										}else if(data.message == "k"){//被吞了
											API.chatLog(`【勋章打卡】发送点亮弹幕失败，弹幕被吞！`);
										}else{
											API.chatLog(`【勋章打卡】点亮弹幕：${data.message}`);
										}
									})
								}
								send()
							}
						}
					}
				})
			}
			lighte_weared_medal()
			let get_server = async function () {
				let url = "https://gitee.com/flyxiu/flyx/raw/master/cv_list.json";
				let server_cv = await getMyJson(url);
				if(server_cv[0]== undefined){
					server_cv_list = ["11862592", "11366966", "11872351", "11872360","11872379"]//012服务器3中奖4在线用户数
					API.chatLog(`云数据获取异常,检查网络或刷新重试！`);
				}else{
					server_cv_list = server_cv
					API.chatLog('天选服务相关云数据加载完成！')
				}
				//console.log('server_cv_list',server_cv_list)
				let turn_key = await getMyJson("https://gitee.com/flyxiu/flyx/raw/master/turn.json");
				if(turn_key[0]== undefined){
					API.chatLog(`云数据获取异常,检查网络或刷新重试！`);
				}else{
					turn_key_list = turn_key
					API.chatLog('天选转换相关云数据加载完成！')
				}
				let server_new = await getMyJson("https://gitee.com/flyxiu/flyx/raw/master/server_url.json");
				if(server_new[0]== undefined){
					API.chatLog(`群服务器信息获取异常,使用默认数据！`);
				}else{
					qun_server = server_new
					API.chatLog('群服务器信息加载完成！')
				}
			}
			API.chatLog('正在更新天选服务等相关云数据！')
			await get_server()
			setInterval(get_server, 600e3);//定时更新服务器、中奖、在线用户数
			let showlive = async function () {//在线用户数量统计
				const post_data = {id:ts_ms(),room_id:Live_info.uid,data:"在线打卡"}
				post_data_to_server(post_data,qun_server[0]).then((data) => {
					console.log('post_data_to_server',data)
				})
				let num = Math.ceil(Math.random() * (API.CONFIG.poison_chicken_soup.length-1));
				if(!API.CONFIG.poison_chicken_soup.length) return
				BAPI.anchor_postdiscuss(API.CONFIG.poison_chicken_soup[num],server_cv_list[4]).then(async(data) => {
					console.log('anchor_postdiscuss',data)
					if(data.code==0){//ctime
						API.CONFIG.showlive_discusss.push(data.data.reply.rpid)
						API.CONFIG.showlive_discusss.push(data.data.reply.ctime)
						API.saveConfig()
					}
				})
			}
			setTimeout(showlive, 120e3)
			setInterval(showlive, 3600e3)
			let get_web_ts_ms = async function(){
				let web_ts_ms = false
				await XHR({
					GM: true,
					anonymous: true,
					method: 'GET',
					url: `http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp`,
					responseType: 'json',
				}).then((data) => {
					if(!data.body || !data.body.data || !data.body.data.t){
						return API.chatLog('淘宝时间获取出错！', 'warning')
					}
					web_ts_ms=data.body.data.t
				}, () => {
					API.chatLog('淘宝时间获取出错！', 'warning')
				})
				return web_ts_ms
			}
			let webtime = await get_web_ts_ms()
			if(webtime && Math.abs(webtime-ts_ms())<600000){
				API.chatLog(`当前本地时间与获取的网络淘宝接口时间时差：${Math.abs(webtime-ts_ms())}毫秒！`);
			}else if(Math.abs(webtime-ts_ms())>=600000 && webtime){
				API.chatLog(`当前本地时间与获取的网络淘宝接口时间时差：${Math.abs(webtime-ts_ms())}毫秒！<br>时差已超过10分钟，请检查网络或本地时间与备件时间一致，否则可能导致漏掉天选抽奖等！`);
			}

			if (API.CONFIG.AUTO_GOLDBOX || API.CONFIG.AUTO_Anchor || API.CONFIG.AUTO_GOLDBOX_sever2 || API.CONFIG.dynamic_lottery || API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic) {
				if (Live_info.uid != 20842051 && API.CONFIG.FollowingList.indexOf(20842051) == -1) {
					////BAPI.modify(20842051, 1)
				}
			};
			API.chatLog('温馨提醒：额外收费的中奖（如邮费等），99%是骗子！！！！', 'warning')
			if (Live_info.room_id === 14578426) {
				ZBJ = '中国虚拟偶像天团【战斗吧歌姬！】';
			} else if (Live_info.room_id === 2374828) {
				ZBJ = '【风绫丨钰袖】';
			} else ZBJ = '【可可爱爱】';


			if (GM_getValue('room_AnchorRecord_time') == undefined)GM_setValue('room_AnchorRecord_time', true)

			//room_AnchorRecord_time去重去旧.刷新运行一次
			let room_AnchorRecord_time_dd = []
			let room_AnchorRecord_time_check = async function () {
				room_AnchorRecord_time_dd = []
				for (let i = API.CONFIG.room_AnchorRecord_time.length - 1; i >= 0; i = i - 2) {
					if (room_AnchorRecord_time_dd.indexOf(API.CONFIG.room_AnchorRecord_time[i - 1]) == -1) {
						room_AnchorRecord_time_dd.push(API.CONFIG.room_AnchorRecord_time[i - 1]) //房间号
						room_AnchorRecord_time_dd.push(API.CONFIG.room_AnchorRecord_time[i]) //时间戳
					}
				}
				API.CONFIG.room_AnchorRecord_time = room_AnchorRecord_time_dd
				if(GM_getValue('room_AnchorRecord_time')){
					API.CONFIG.room_AnchorRecord_time = []
					GM_setValue('room_AnchorRecord_time', false)
				}
				API.saveConfig()
			}
			room_AnchorRecord_time_check()
			let refresh_Select1_time_mark = true
			let refresh_Select2_time_mark = true
			let LT_Timer = async() => { //判断是否第二天重置数据
				if(ts_s() - API.CONFIG.AUTO_dynamic_create_ts > API.CONFIG.AUTO_dynamic_create_flash * 60 && API.CONFIG.AUTO_dynamic_create){
					if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
						//休眠时间不发动态
					}else{
						let num = Math.ceil(Math.random() * (API.CONFIG.poison_chicken_soup.length-1));
						let num2 = Math.ceil(Math.random() * API.CONFIG.AUTO_dynamic_create_flash/4);
						if(!API.CONFIG.poison_chicken_soup.length) return
						BAPI.dynamic_create(API.CONFIG.poison_chicken_soup[num]).then((data) => {
							if(data.code == 0){
								API.chatLog(`【自动发动态】成功发送一条动态：${API.CONFIG.poison_chicken_soup[num]}`, 'success');
								API.CONFIG.AUTO_dynamic_create_ts = ts_s() + num2 * 60 //随机延迟1/4间隔
								API.saveConfig();
							}else{
								API.CONFIG.AUTO_dynamic_create_ts = ts_s() + num2 * 60 //随机延迟1/4间隔
								API.saveConfig();
								API.chatLog(`【自动发动态】发送动态失败：${data.msg}`, 'warning');
							}
						})
					}
				}
				if(API.CONFIG.AUTO_GOLDBOX_sever2){//群主云
					let MaterialObject_do = async function(aid,num){
						if (API.CONFIG.aid_number_list.indexOf(aid * 100 + num) > -1)return //实物抽奖特征id：aid*100+number
						await BAPI.Lottery.MaterialObject.draw(aid, num).then((response) => {
							if (response.code === 0) {
								API.CONFIG.COUNT_GOLDBOX++;
								$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
								$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
								API.saveConfig();
								API.chatLog(`【实物宝箱抽奖】成功参加抽奖：(aid=${aid},number=${num})！`, 'success');
								API.CONFIG.aid_number_list.push(aid * 100 + num)

								API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：(aid=${aid},number=${num})`)
								if (API.CONFIG.freejournal3.length > 500) {
									API.CONFIG.freejournal3.splice(400, 100);
								}
								API.saveConfig()
								$('#freejournal3 span:eq(0)').text(API.CONFIG.freejournal3)
								let dt = document.getElementById('freejournal3'); //通过id获取该div
								dt.innerHTML  = API.CONFIG.freejournal3
							}else if(response.code == -403 || response.code == -3){
								API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${num})${response.message}`, 'warning');
								API.CONFIG.aid_number_list.push(aid * 100 + num)

								API.CONFIG.freejournal3.unshift(`<br>${timestampToTime(ts_s())}：(aid=${aid},number=${num})，${response.message}！`)
								if (API.CONFIG.freejournal3.length > 500) {
									API.CONFIG.freejournal3.splice(400, 100);
								}
								API.saveConfig()
								$('#freejournal3 span:eq(0)').text(API.CONFIG.freejournal3)
								let dt = document.getElementById('freejournal3'); //通过id获取该div
								dt.innerHTML  = API.CONFIG.freejournal3
							}else{
								API.chatLog(`【实物宝箱抽奖】(aid=${aid},number=${num})${response.message}`, 'warning');
							}
						}, () => {
							API.chatLog(`【实物宝箱抽奖】参加(aid=${aid},number=${num})失败，请检查网络`, 'warning');
						});
					}
					for(let i=0;i<MaterialObject.length;i++){
						if(ts_s() > MaterialObject[i].join_start_time && ts_s()< MaterialObject[i].join_end_time) MaterialObject_do(MaterialObject[i].aid,MaterialObject[i].num)
					}
				}

				if (API.CONFIG.push_msg_oneday_check && push_msg_oneday_run_mark && hour() == API.CONFIG.push_msg_oneday_hour && minute() == 0 ){
					push_msg_oneday_run_mark = false
					setTimeout(async() => {
						push_msg_oneday_run_mark = true
					},600000)
					let AnchorRecord_list_msg_push = []
					let awardlist_list_msg_push = []
					for(let i=0;i<AnchorRecord_list_msg.length;i++){
						if(turn_time(AnchorRecord_list_msg[i].end_time) + API.CONFIG.push_msg_oneday_days * 24 * 3600 * 1000 > ts_ms())AnchorRecord_list_msg_push.push(AnchorRecord_list_msg[i].end_time,AnchorRecord_list_msg[i].award_name)
					}
					for (let i = 0; i < awardlist_list_msg.length; i++) {
						if(turn_time(awardlist_list_msg[i].create_time) + API.CONFIG.push_msg_oneday_days * 24 * 3600 * 1000 > ts_ms())awardlist_list_msg_push.push(awardlist_list_msg[i].create_time,awardlist_list_msg[i].gift_name)
					}
					console.log('push_msg_oneday_check',AnchorRecord_list_msg,awardlist_list_msg,AnchorRecord_list_msg_push,awardlist_list_msg_push)
					if(AnchorRecord_list_msg_push.length>0){
						if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
							qq(API.CONFIG.qq2,`【天选时刻统计】${Live_info.uname}：${AnchorRecord_list_msg_push}！`,API.CONFIG.go_cqhttp);
						}
						if(API.CONFIG.qqbot && qq_run_mark){
							qq(API.CONFIG.qq,`【天选时刻统计】${Live_info.uname}：${AnchorRecord_list_msg_push}`,qun_server[1]);
						}
						if (API.CONFIG.switch_ServerChan_SCKEY) {
							ServerChan2(API.CONFIG.ServerChan_SCKEY, `【天选时刻统计】${Live_info.uname}：${AnchorRecord_list_msg_push}`);
						}
						if (API.CONFIG.switch_Qmsg_KEY) {
							qmsg(API.CONFIG.Qmsg_KEY, `【天选时刻统计】${Live_info.uname}：${AnchorRecord_list_msg_push}`);
						}
						if (API.CONFIG.switch_push_KEY) {
							pushmsg(API.CONFIG.push_KEY, `【天选时刻统计】${Live_info.uname}：${AnchorRecord_list_msg_push}`);
						}
					}
					if(awardlist_list_msg_push.length>0){
						if(API.CONFIG.qqbot && qq_run_mark){
							qq(API.CONFIG.qq,`【实物宝箱统计】${Live_info.uname}：${awardlist_list_msg_push}`,qun_server[1]);
						}
						if (API.CONFIG.switch_ServerChan_SCKEY) {
							ServerChan2(API.CONFIG.ServerChan_SCKEY, `【实物宝箱统计】${Live_info.uname}：${awardlist_list_msg_push}`);
						}
						if (API.CONFIG.switch_Qmsg_KEY) {
							qmsg(API.CONFIG.Qmsg_KEY, `【实物宝箱统计】${Live_info.uname}：${awardlist_list_msg_push}`);
						}
						if (API.CONFIG.switch_push_KEY) {
							pushmsg(API.CONFIG.push_KEY, `【实物宝箱统计】${Live_info.uname}：${awardlist_list_msg_push}`);
						}
					}
				}

				if (hour() == API.CONFIG.medal_sign_time_hour && minute() == API.CONFIG.medal_sign_time_min && medal_sign && API.CONFIG.AUTO_sign_danmu) {
					API.medal_sign_danmu();
				}
				if (API.CONFIG.refresh && hour() == API.CONFIG.refresh_Select2_time && minute() == 0 && API.CONFIG.refresh_Select2 && refresh_Select2_time_mark) {
					refresh_Select2_time_mark = false
					setTimeout(() => {
						window.location.reload();
					}, 60000);
				}
				if (API.CONFIG.refresh && API.CONFIG.refresh_Select1 && refresh_Select1_time_mark) {
					refresh_Select1_time_mark = false
					setTimeout(() => {
						window.location.reload();
					}, API.CONFIG.refresh_Select1_time * 61000);
				}
				if (hour() == API.CONFIG.AUTO_activity_lottery_time_hour && minute() == API.CONFIG.AUTO_activity_lottery_time_min && activity_lottery_run_mark) {
					await API.new_activity_lottery()
					await API.activity_lottery()
				}

				if (checkNewDay(API.CONFIG.CLEAR_TS)) {
					if (API.CONFIG.AUTO_GOLDBOX || API.CONFIG.AUTO_Anchor || API.CONFIG.AUTO_GOLDBOX_sever2 || API.CONFIG.dynamic_lottery || API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic) {
						if (Live_info.uid != 20842051 && API.CONFIG.FollowingList.indexOf(20842051) == -1) {
							////BAPI.modify(20842051, 1)
						}
					};
					room_AnchorRecord_time_check()
					API.chatLog(`新的一天到来，30分钟后将再次执行每日任务及更新用户数据！`);
					let last_lottery_id_back = async() => {
						if(dynamic_lottery_run_mark){
							API.CONFIG.last_lottery_id = API.CONFIG.last_lottery_id - 500
							API.CONFIG.detail_by_lid_reset = API.CONFIG.last_lottery_id - 5000
							API.saveConfig()
						}else{
							setTimeout(async() => {
								last_lottery_id_back()
							},10 * 60 * 1000)
						}
					}
					if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery)last_lottery_id_back()//回溯序号已出却未生效的抽奖
					getversion()
					lighte_weared_medal()
					$('#giftCount span:eq(0)').text(month());
					$('#giftCount span:eq(1)').text(day());
					Lcount = 0;
					API.CONFIG.LCOUNT = 0;
					API.CONFIG.COUNT = 0;
					API.CONFIG.LOVE_COUNT = 0;
					API.CONFIG.CLEAR_TS = dateNow();
					API.CONFIG.medal_sign = true
					API.saveConfig();
					setTimeout(async() => {
						API.DailyReward.DoSign();
						API.DailyReward.get_user_info();
						API.DailyReward.nav()
						API.DailyReward.login();
						API.DailyReward.dynamic();
						API.Exchange.run();
						//手机端删除
						API.SmallHeart_model_two();
						//手机端删除
						if (API.CONFIG.GIFT_AUTO)API.sendoneday_gift();
					},30 *60 * 1000)
				}
			};

			$("html").scrollLeft(10000);//滚动到右侧
			setTimeout(async() => {
				API.DailyReward.DoSign();
				API.DailyReward.get_user_info();
				API.DailyReward.nav()
				API.DailyReward.login();
				API.DailyReward.dynamic();
				API.Exchange.run();
				//手机端删除
				API.SmallHeart_model_two();
				//手机端删除
				API.MaterialObject.run(); //领金宝箱
				if (API.CONFIG.GIFT_AUTO)API.sendoneday_gift();
			}, 10e3); //脚本加载后10秒执行每日任务

			setInterval(LT_Timer, 20e3);
			setInterval(API.expaddGift, 33e3);
			setInterval(API.expaddLove, 37e3);
			API.cjcheck();
			API.creatSetBox(); //创建设置框
			let LCOUNT_timer = setInterval(() => { //每隔600秒检查心心数量，防止意外情况心心数量判断异常函数一直运行
				if (API.CONFIG.LCOUNT >= 24) {
					clearInterval(LCOUNT_timer);
				}
				if (API.CONFIG.LCOUNT == Lcount && Lcount < 24 && Lcount != 0 && API.CONFIG.AUTO_HEART_newmodel) {
					API.chatLog(`小心心数长时间未变化可能已满，停止发送客户端心跳！`);
					clearInterval(LCOUNT_timer);
					API.CONFIG.LCOUNT = 66;
					API.saveConfig();
					return
				} else {
					Lcount = API.CONFIG.LCOUNT;
				}
			}, 3600e3);

			let medal_list_now = []
			let FollowingList_now = []
			let FollowingList_now_data = []
			let getMedalList = async function (page = 1) { //粉丝勋章数据
				if (page == 1)
					medal_list_now = [];
				return BAPI.live_fans_medal(page, 10).then((data) => {
					medal_list_now = medal_list_now.concat(data.data.fansMedalList);
					if (data.data.pageinfo.curPage < data.data.pageinfo.totalpages)
						return getMedalList(page + 1);
				}, () => {
					return delayCall(() => getMedalList());
				});
			};

			let getFollowingList = async function (page = 1) { //关注直播数据，同时获取room_uid数据
				if (page == 1){
					FollowingList_now = []
					FollowingList_now_data = [];
				}
				await sleep(100)
				await BAPI.Lottery.anchor.getFollowings(page).then((data) => {
					FollowingList_now_data = FollowingList_now_data.concat(data.data.list);
					if (page < data.data.totalPage)
						return getFollowingList(page + 1);
					if(page == data.data.totalPage){
						for(let i=0;i<FollowingList_now_data.length;i++){
							FollowingList_now[i]=FollowingList_now_data[i].uid
							if(API.CONFIG.room_ruid.indexOf(FollowingList_now_data[i].uid)==-1){
								API.CONFIG.room_ruid.push(FollowingList_now_data[i].roomid)
								API.CONFIG.room_ruid.push(FollowingList_now_data[i].uid)
							}
						}
						API.saveConfig()
					}
				}, () => {
					return delayCall(() => getFollowingList());
				});
			};

			let getguardsList = async function (page = 1) { //舰长数据
				if (page == 1)
					guardsListdata = [];
				await sleep(100)
				return BAPI.Lottery.anchor.guards(page, 10).then((data) => {
					guardsListdata = guardsListdata.concat(data.data.list);
					if (data.data.pageinfo.curPage < data.data.pageinfo.totalPage)
						return getguardsList(page + 1);
				}, () => {
					return delayCall(() => getguardsList());
				});
			};

			setTimeout(async() => {
				await getguardsList()//舰长数据
				console.log('大航海数据', guardsListdata);
				if(guardsListdata.length ==API.CONFIG.guardroom.length && API.CONFIG.guard_level.length==API.CONFIG.guardroom_activite.length  && API.CONFIG.guardroom.length == API.CONFIG.guard_level.length){
					//舰长数据
				}else{
					console.log('舰长数据长度异常清空');
					API.CONFIG.guardroom=[]
					API.CONFIG.guard_level=[]
					API.CONFIG.guardroom_activite=[]
				}
				for (let i = 0; i < guardsListdata.length; i++) {
					API.CONFIG.guardroom[i] = guardsListdata[i].room_id
					API.CONFIG.guard_level[i] = guardsListdata[i].guard_level
					API.CONFIG.guardroom_activite[i] = guardsListdata[i].activite
				}
				console.log('大航海房间', API.CONFIG.guardroom);
				console.log('大航海等级', API.CONFIG.guard_level);
				console.log('大航海失效判断', API.CONFIG.guardroom_activite);
				//舰长数据
				//勋章数据
				if (API.CONFIG.medal_ts == 0 | ts_ms() - API.CONFIG.medal_ts > 299 * 1000) { //间隔5分钟
					API.CONFIG.medal_ts = ts_ms()
					API.saveConfig();
					await getMedalList();
					//console.log(medal_list_now)
					console.log('检查更新勋章房间数据', medal_list_now.length);
					if(API.CONFIG.medal_uid_list.length == API.CONFIG.medal_level_list.length && API.CONFIG.medal_id_list.length == API.CONFIG.medal_roomid_list.length && API.CONFIG.medal_level_list.length == API.CONFIG.medal_id_list.length){
						//四组数据长度正常
					}else{//四组数据长度异常清空
						console.log('勋章数据长度异常清空');
						API.CONFIG.medal_uid_list = []
						API.CONFIG.medal_level_list = []
						API.CONFIG.medal_id_list = []
						API.CONFIG.medal_roomid_list = []
					}
					for (let i = 0; i < medal_list_now.length; i++) {//新数据时，lv不需要更新替换
						if(API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)>-1){
							let num1 =API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)
							API.CONFIG.medal_level_list[num1]=(medal_list_now[i].level)//更新lv
							let num2=API.CONFIG.room_ruid.indexOf(medal_list_now[i].target_id)
							if(num2>-1){
								API.CONFIG.medal_roomid_list[num1]=API.CONFIG.room_ruid[num2-1]
							}else{
								console.log('无本地room_ruid数据，需要获取真实房间号');
								await BAPI.room.get_info(medal_list_now[i].roomid).then(async(data) => {
									await sleep(100)
									if(data.data.room_id){
										API.CONFIG.medal_roomid_list[num1]=data.data.room_id//真实roomid
										API.CONFIG.room_ruid.push(data.data.room_id)
										API.CONFIG.room_ruid.push(medal_list_now[i].target_id)
									}
								})
							}
						}
						if(API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)==-1){
							API.CONFIG.medal_uid_list.push(medal_list_now[i].target_id)
							API.CONFIG.medal_level_list.push(medal_list_now[i].level)
							API.CONFIG.medal_id_list.push(medal_list_now[i].medal_id)
							let num = API.CONFIG.room_ruid.indexOf(medal_list_now[i].target_id)
							if(num>-1){
								API.CONFIG.medal_roomid_list.push(API.CONFIG.room_ruid[num-1])
							}else{
								console.log('无本地room_ruid数据，需要获取真实房间号');
								await BAPI.room.get_info(medal_list_now[i].roomid).then(async(data) => {
									await sleep(100)
									if(data.data.room_id){
										API.CONFIG.medal_roomid_list.push(data.data.room_id)//真实roomid
										API.CONFIG.room_ruid.push(data.data.room_id)
										API.CONFIG.room_ruid.push(medal_list_now[i].target_id)
									}
								})
							}
						}

					}
					//去掉已经删除的勋章的数据
					let medal_uid_list_now=[]
					for(let i = 0; i < medal_list_now.length; i++){
						medal_uid_list_now[i]=medal_list_now[i].target_id
					}
					for(let i = 0; i < API.CONFIG.medal_uid_list.length; i++){
						if(medal_uid_list_now.indexOf(API.CONFIG.medal_uid_list[i])==-1){
							API.CONFIG.medal_uid_list.splice(i,1)
							API.CONFIG.medal_level_list.splice(i,1)
							API.CONFIG.medal_id_list.splice(i,1)
							API.CONFIG.medal_roomid_list.splice(i,1)
							i--
						}
					}
					//去掉已经删除的勋章的数据
					console.log('勋章uid列表', API.CONFIG.medal_uid_list.length);
					console.log('勋章level列表', API.CONFIG.medal_level_list.length);
					console.log('勋章id列表', API.CONFIG.medal_id_list.length);
					console.log('勋章roomid列表', API.CONFIG.medal_roomid_list.length);
					API.saveConfig();
				}
				//勋章数据
				//关注数据
				if (API.CONFIG.Following_ts == 0 | ts_ms() - API.CONFIG.Following_ts > 299 * 1000) {
					API.CONFIG.Following_ts = ts_ms()
					await getFollowingList();
					if (FollowingList_now.length>0) {
						API.CONFIG.FollowingList = FollowingList_now
						let list=[]
						for(let i=0;i<API.CONFIG.FollowingList.length;i++){
							if(list.indexOf(API.CONFIG.FollowingList[i])==-1)list.push(API.CONFIG.FollowingList[i])
						}
						API.CONFIG.FollowingList = list
					}
					API.saveConfig();
					console.log('检查更新直播主播关注数据', API.CONFIG.FollowingList.length);
					BAPI.get_attention_list().then(async(data) => {
						if(data.code==0){
							console.log('全部关注数', data.data.list.length);
							API.CONFIG.ALLFollowingList = data.data.list
							API.saveConfig();
							if(data.data.list.length>1900){
								API.chatLog(`直播主播关注数达到${data.data.list.length}，注意满2000关注后，将无法新增关注，会影响中奖！`, 'warning');
							}
							if(API.CONFIG.getmsg &&　data.data.list.length>API.CONFIG.getmsg_num){
								API.chatLog(`直播主播关注数达到${data.data.list.length}，开始取关无私信直播主播！`, 'warning');
								$('#getmsg').click();
							}
						}
					})
				}
			}, 10 * 1000)

			setInterval(async() => {
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				await getguardsList()//舰长数据
				console.log('大航海数据', guardsListdata);
				if(guardsListdata.length ==API.CONFIG.guardroom.length && API.CONFIG.guard_level.length==API.CONFIG.guardroom_activite.length && API.CONFIG.guardroom.length == API.CONFIG.guard_level.length){
					//舰长数据
				}else{
					console.log('舰长数据长度异常清空');
					API.CONFIG.guardroom=[]
					API.CONFIG.guard_level=[]
					API.CONFIG.guardroom_activite=[]
				}
				for (let i = 0; i < guardsListdata.length; i++) {
					API.CONFIG.guardroom[i] = guardsListdata[i].room_id
					API.CONFIG.guard_level[i] = guardsListdata[i].guard_level
					API.CONFIG.guardroom_activite[i] = guardsListdata[i].activite
				}
				console.log('大航海房间', API.CONFIG.guardroom);
				console.log('大航海等级', API.CONFIG.guard_level);
				console.log('大航海失效判断', API.CONFIG.guardroom_activite);
				//舰长数据
				//勋章数据
				if (API.CONFIG.medal_ts == 0 | ts_ms() - API.CONFIG.medal_ts > 299 * 1000) { //间隔5分钟
					API.CONFIG.medal_ts = ts_ms()
					API.saveConfig();
					await getMedalList();
					console.log('检查更新勋章房间数据', medal_list_now.length);
					if(API.CONFIG.medal_uid_list.length == API.CONFIG.medal_level_list.length && API.CONFIG.medal_id_list.length == API.CONFIG.medal_roomid_list.length && API.CONFIG.medal_level_list.length == API.CONFIG.medal_id_list.length){
						//四组数据长度正常
					}else{//四组数据长度异常清空
						console.log('勋章数据长度异常清空');
						API.CONFIG.medal_uid_list = []
						API.CONFIG.medal_level_list = []
						API.CONFIG.medal_id_list = []
						API.CONFIG.medal_roomid_list = []
					}
					for (let i = 0; i < medal_list_now.length; i++) {//新数据时，lv不需要更新替换
						if(API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)>-1){
							let num1 =API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)
							API.CONFIG.medal_level_list[num1]=(medal_list_now[i].level)//更新lv
							let num2=API.CONFIG.room_ruid.indexOf(medal_list_now[i].target_id)
							if(num2>-1){
								API.CONFIG.medal_roomid_list[num1]=API.CONFIG.room_ruid[num2-1]
							}else{
								console.log('无本地room_ruid数据，需要获取真实房间号');
								await BAPI.room.get_info(medal_list_now[i].roomid).then(async(data) => {
									await sleep(100)
									if(data.data.room_id){
										API.CONFIG.medal_roomid_list[num1]=data.data.room_id//真实roomid
										API.CONFIG.room_ruid.push(data.data.room_id)
										API.CONFIG.room_ruid.push(medal_list_now[i].target_id)
									}
								})
							}
						}
						if(API.CONFIG.medal_uid_list.indexOf(medal_list_now[i].target_id)==-1){
							API.CONFIG.medal_uid_list.push(medal_list_now[i].target_id)
							API.CONFIG.medal_level_list.push(medal_list_now[i].level)
							API.CONFIG.medal_id_list.push(medal_list_now[i].medal_id)
							let num = API.CONFIG.room_ruid.indexOf(medal_list_now[i].target_id)
							if(num>-1){
								API.CONFIG.medal_roomid_list.push(API.CONFIG.room_ruid[num-1])
							}else{
								console.log('无本地room_ruid数据，需要获取真实房间号');
								await BAPI.room.get_info(medal_list_now[i].roomid).then(async(data) => {
									await sleep(100)
									if(data.data.room_id){
										API.CONFIG.medal_roomid_list.push(data.data.room_id)//真实roomid
										API.CONFIG.room_ruid.push(data.data.room_id)
										API.CONFIG.room_ruid.push(medal_list_now[i].target_id)
									}
								})
							}
						}
					}
					//去掉已经删除的勋章的数据
					let medal_uid_list_now=[]
					for(let i = 0; i < medal_list_now.length; i++){
						medal_uid_list_now[i]=medal_list_now[i].target_id
					}
					for(let i = 0; i < API.CONFIG.medal_uid_list.length; i++){
						if(medal_uid_list_now.indexOf(API.CONFIG.medal_uid_list[i])==-1){
							API.CONFIG.medal_uid_list.splice(i,1)
							API.CONFIG.medal_level_list.splice(i,1)
							API.CONFIG.medal_id_list.splice(i,1)
							API.CONFIG.medal_roomid_list.splice(i,1)
							i--
						}
					}
					//去掉已经删除的勋章的数据
					console.log('勋章uid列表', API.CONFIG.medal_uid_list.length);
					console.log('勋章level列表', API.CONFIG.medal_level_list.length);
					console.log('勋章id列表', API.CONFIG.medal_id_list.length);
					console.log('勋章roomid列表', API.CONFIG.medal_roomid_list.length);
					API.saveConfig();
				}
				//勋章数据
				//关注数据
				if (API.CONFIG.Following_ts == 0 | ts_ms() - API.CONFIG.Following_ts > 299 * 1000) {
					API.CONFIG.Following_ts = ts_ms()
					API.saveConfig();
					await getFollowingList();
					if (FollowingList_now.length>0) {
						API.CONFIG.FollowingList = FollowingList_now
						let list=[]
						for(let i=0;i<API.CONFIG.FollowingList.length;i++){
							if(list.indexOf(API.CONFIG.FollowingList[i])==-1)list.push(API.CONFIG.FollowingList[i])
						}
						API.CONFIG.FollowingList = list
						API.saveConfig();
					}
					console.log('检查更新直播主播关注数据', API.CONFIG.FollowingList.length);
					BAPI.get_attention_list().then(async(data) => {
						if(data.code==0){
							console.log('全部关注数', data.data.list.length);
							API.CONFIG.ALLFollowingList = data.data.list
							API.saveConfig();
							if(data.data.list.length>1900){
								API.chatLog(`直播主播关注数达到${data.data.list.length}，注意满2000关注后，将无法新增关注，会影响中奖！`, 'warning');
							}
							if(API.CONFIG.getmsg &&　data.data.list.length>API.CONFIG.getmsg_num){
								API.chatLog(`直播主播关注数达到${data.data.list.length}，开始取关无私信直播主播！`, 'warning');
								$('#getmsg').click();
							}
						}
					})
				}
				//关注数据
			}, 300 * 1000);

			//动态抽奖


			let congratulations = function(gift_name,title){
				tip(`${title}${Live_info.uname}：恭喜你获得${gift_name}！`)
				API.chatLog(`${title}${Live_info.uname}：恭喜你获得${gift_name}！`, 'success')
				BAPI.anchor_postdiscuss(`${title}${Xname}：${gift_name}`,server_cv_list[3]).then(async(data) => {
					if(data.code==0){
						API.CONFIG.congratulations_rpid_ct.push(data.data.reply.rpid)
						API.CONFIG.congratulations_rpid_ct.push(data.data.reply.ctime)
						API.saveConfig()
					}
				})
				const post_data = {id:ts_ms(),room_id:Live_info.uid,data:`${title}${Xname}：${gift_name}`}
				post_data_to_server(post_data,qun_server[0]).then((data) => {
					console.log('post_data_to_server',data)
				})
				if (GM_getValue('read'))read_list.push(`${title}${Live_info.uname}：恭喜你获得${gift_name}！`)
				if (API.CONFIG.switch_ServerChan_SCKEY) {
					ServerChan2(API.CONFIG.ServerChan_SCKEY, `${title}${Live_info.uname}：恭喜你获得${gift_name}！`);
				}
				if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
					qq(API.CONFIG.qq2,`${title}${Live_info.uname}：${gift_name}！`,API.CONFIG.go_cqhttp);
				}
				if(API.CONFIG.qqbot && qq_run_mark){
					qq(API.CONFIG.qq,`${title}${Live_info.uname}：${gift_name}！`,qun_server[1]);
				}
				if (API.CONFIG.switch_Qmsg_KEY) {
					qmsg(API.CONFIG.Qmsg_KEY, `${title}${Live_info.uname}：${gift_name}！`);
				}
				if (API.CONFIG.switch_push_KEY) {
					pushmsg(API.CONFIG.push_KEY, `${title}${Live_info.uname}：恭喜你获得${gift_name}！`);
				}
			}

			let dynamic_lottery_btn = $('<button id="dynamic_lottery_btn" style="position: absolute; top: 371px; right: -72px;z-index:999;background-color:GhostWhite;color: #000000;border-radius: 4px;border: none;padding: 5px;cursor: pointer;box-shadow: 1px 1px 2px #00000075;">' +
										'动态抽奖<br>点看序号</button>');
			$('.chat-history-panel').append(dynamic_lottery_btn);
			dynamic_lottery_btn.click(function () {
				API.chatLog(`当前动态序号：${API.CONFIG.last_lottery_id}！`);
			});

			let lottery_id_done_list_check = async function () {
				if(API.CONFIG.lottery_id_done_list.length==0)return
				if(API.CONFIG.lottery_id_done_list[0]>9999999)API.CONFIG.lottery_id_done_list.splice(0, 1);
				//历史遗留错误清理
				let list = []
				for(let i=0;i<API.CONFIG.lottery_id_done_list.length;i=i+2){//LID-TIME
					if(list.indexOf(API.CONFIG.lottery_id_done_list[i])==-1)list.push(API.CONFIG.lottery_id_done_list[i],API.CONFIG.lottery_id_done_list[i+1])
				}
				API.CONFIG.lottery_id_done_list = list
				console.log('lottery_id_done_list中奖检查',API.CONFIG.lottery_id_done_list)
				for(let i=1;i<API.CONFIG.lottery_id_done_list.length;i=i+2){//LID-TIME
					if(API.CONFIG.lottery_id_done_list[i]<ts_s()){//已开奖
						await BAPI.detail_by_lid(API.CONFIG.lottery_id_done_list[i-1]).then(function (data) {
							console.log('已开奖detail_by_lid',data)
							if(data.code==0){//取消抽奖后无lottery_result
								if(data.data.lottery_result !=undefined || data.data.hongbao_result !=undefined){//取消抽奖后无lottery_result
									let business_id = data.data.business_id
									let lottery_result = data.data.lottery_result
									let first_prize_cmt = data.data.first_prize_cmt
									let second_prize_cmt = data.data.second_prize_cmt
									let third_prize_cmt = data.data.third_prize_cmt
									if(first_prize_cmt != '' && first_prize_cmt.indexOf("动态红包")==-1)first_prize_cmt = "一等奖：" + first_prize_cmt
									if(second_prize_cmt != '')second_prize_cmt = "二等奖：" + second_prize_cmt
									if(third_prize_cmt != '')third_prize_cmt = "三等奖：" + third_prize_cmt
									let sender_uid = data.data.sender_uid
									let title
									//动态类
									if(business_id>999999999 || business_id ==0) {//business_id == 0 大数字损失精度变0
										if(first_prize_cmt.indexOf("动态红包")>-1){
											title = '【动态红包】'
											let hongbao_result = data.data.hongbao_result
											for(let t=0;t<hongbao_result.length;t++){
												if(hongbao_result[t].uid == Live_info.uid && hongbao_result[t].hongbao_money > 0){
													API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${hongbao_result[t].hongbao_money/100}元<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
													API.saveConfig()
													$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
													let dt = document.getElementById('freejournal7'); //通过id获取该div
													dt.innerHTML  = API.CONFIG.freejournal7
													congratulations(`${hongbao_result[t].hongbao_money/100}元`,title)
												}
											}
										}else{
											title = '【动态抽奖】'
											if(lottery_result.first_prize_result != undefined){
												for(let t=0;t<lottery_result.first_prize_result.length;t++){
													if(lottery_result.first_prize_result[t].uid == Live_info.uid){
														API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${first_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
														API.saveConfig()
														$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
														let dt = document.getElementById('freejournal7'); //通过id获取该div
														dt.innerHTML  = API.CONFIG.freejournal7
														congratulations(first_prize_cmt,title)
													}
												}
											}
											if(lottery_result.second_prize_result!= undefined){
												for(let k=0;k<lottery_result.second_prize_result.length;k++){
													if(lottery_result.second_prize_result[k].uid == Live_info.uid){
														API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${second_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
														API.saveConfig()
														$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
														let dt = document.getElementById('freejournal7'); //通过id获取该div
														dt.innerHTML  = API.CONFIG.freejournal7
														congratulations(second_prize_cmt,title)
													}
												}
											}
											if(lottery_result.third_prize_result!= undefined){
												for(let l=0;l<lottery_result.third_prize_result.length;l++){
													if(lottery_result.third_prize_result[l].uid == Live_info.uid){
														API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${third_prize_cmt}<a target="_blank" href="https://space.bilibili.com/${sender_uid}/dynamic">动态页</a>`)
														API.saveConfig()
														$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
														let dt = document.getElementById('freejournal7'); //通过id获取该div
														dt.innerHTML  = API.CONFIG.freejournal7
														congratulations(third_prize_cmt,title)
													}
												}
											}
										}
									}
									//动态类
									//预约直播
									if(business_id<999999999 && business_id !=0){
										title = '【预约抽奖】'
										if(lottery_result.first_prize_result != undefined){
											for(let t=0;t<lottery_result.first_prize_result.length;t++){
												if(lottery_result.first_prize_result[t].uid == Live_info.uid){
													API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${first_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${API.CONFIG.lottery_id_done_list[i-1]}">抽奖页</a>`)
													API.saveConfig()
													$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
													let dt = document.getElementById('freejournal7'); //通过id获取该div
													dt.innerHTML  = API.CONFIG.freejournal7
													congratulations(first_prize_cmt,title)
												}
											}
										}
										if(lottery_result.second_prize_result!= undefined){
											for(let k=0;k<lottery_result.second_prize_result.length;k++){
												if(lottery_result.second_prize_result[k].uid == Live_info.uid){
													API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${second_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${API.CONFIG.lottery_id_done_list[i-1]}">抽奖页</a>`)
													API.saveConfig()
													$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
													let dt = document.getElementById('freejournal7'); //通过id获取该div
													dt.innerHTML  = API.CONFIG.freejournal7
													congratulations(second_prize_cmt,title)
												}
											}
										}

										if(lottery_result.third_prize_result!= undefined){
											for(let l=0;l<lottery_result.third_prize_result.length;l++){
												if(lottery_result.third_prize_result[l].uid == Live_info.uid){
													API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：${title}：${third_prize_cmt}<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${API.CONFIG.lottery_id_done_list[i-1]}">抽奖页</a>`)
													API.saveConfig()
													$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
													let dt = document.getElementById('freejournal7'); //通过id获取该div
													dt.innerHTML  = API.CONFIG.freejournal7
													congratulations(third_prize_cmt,title)
												}
											}
										}
									}
									//预约直播
								}
							}
						})
						API.CONFIG.lottery_id_done_list.splice(i-1, 2);
						API.saveConfig()
						i = i -2
					}
				}
			}
			setTimeout(lottery_id_done_list_check, 120e3);
			setInterval(lottery_id_done_list_check,600 *1000)


			let get_msgfeed_at = function() {
				if(!API.CONFIG.get_sessions)return
				BAPI.msgfeed_at().then(async function (data) {
					if(data.code==0){
						let items = data.data.items
						for(let i=0;i<items.length;i++){
							if(API.CONFIG.msgfeed_at_id_list.indexOf(items[i].id)==-1 && API.CONFIG.ALLFollowingList.indexOf(items[i].user.mid)>-1 && items[i].at_time + 7 * 24 * 3600 > ts_s()){
								API.CONFIG.msgfeed_at_id_list.push(items[i].id)
								API.saveConfig()
								API.chatLog(`${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}`,'success')
								if (API.CONFIG.switch_ServerChan_SCKEY) {
									ServerChan2(API.CONFIG.ServerChan_SCKEY, `${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}`);
								}
								if (API.CONFIG.switch_Qmsg_KEY) {
									qmsg(API.CONFIG.Qmsg_KEY, `${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}`);
								}
								if (API.CONFIG.switch_push_KEY) {
									pushmsg(API.CONFIG.push_KEY, `${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}`);
								}
								if(API.CONFIG.qqbot && qq_run_mark){
									qq(API.CONFIG.qq,`${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}`,qun_server[1]);
								}
								if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
									qq(API.CONFIG.qq2,`${Live_info.uname}：你关注的【${items[i].user.nickname}】在【${timestampToTime(items[i].at_time)}】@了你：${items[i].item.title}！`,API.CONFIG.go_cqhttp);
								}
								await sleep(5000)
							}
						}
					}
				})
			}
			setTimeout(get_msgfeed_at, 10e3);
			setInterval(get_msgfeed_at,600 *1000)

			let breakmark = false
			let get_space_history_dynamic_id_list = function(host_uid,offset) {//获取已转动态抽奖id：API.CONFIG.dynamic_id_str_done_list
				return BAPI.space_history(host_uid,offset).then(async function (data) {
					if(data.code==0){
						await sleep(5000)
						let day = 1//只追溯时间戳一天前
						if(API.CONFIG.space_history_offset_t == 0 || parseInt((ts_s() - API.CONFIG.space_history_offset_t)/(24 * 3600) >= 30)){
							day = 30
						}else{
							day = 1 + parseInt((ts_s() - API.CONFIG.space_history_offset_t)/(24 * 3600))
						}
						//第一次追溯时间戳30天前
						API.chatLog(`【动态抽奖】正在更新已转动态数据<br>offset：${offset}`, 'success');
						console.log('space_historydata',data,offset)
						if(data.data.has_more==0 || data.data.cards == undefined){
							API.CONFIG.space_history_offset_t = ts_s()
							API.saveConfig()
							console.log('space_history_offset_t',API.CONFIG.space_history_offset_t)
						}
						if(data.data.cards == undefined)return
						let cards = data.data.cards
						for(let i=0;i<cards.length;i++){
							if(cards[i].desc.origin != undefined){//已转的动态原ID
								await sleep(1000)
								BAPI.dynamic_lottery_notice(cards[i].desc.origin.dynamic_id_str).then(async function (dat) {//判断是否是自动转发的未过期的抽奖，否，则加入中奖检查
									console.log('dynamic_lottery_notice',dat)
									if(data.code==0){
										let lottery_id = dat.data.lottery_id
										let lottery_time = dat.data.lottery_time
										if(lottery_time>ts_s() && API.CONFIG.lottery_id_done_list.indexOf(lottery_id)==-1){
											API.CONFIG.lottery_id_done_list.push(lottery_id)
											API.CONFIG.lottery_id_done_list.push(lottery_time)
											API.saveConfig()
										}
									}
								})
								if(API.CONFIG.dynamic_id_str_done_list.indexOf(cards[i].desc.origin.dynamic_id_str)==-1)API.CONFIG.dynamic_id_str_done_list.push(cards[i].desc.origin.dynamic_id_str)
								if(API.CONFIG.dynamic_id_str_done_list.length>5000)API.CONFIG.dynamic_id_str_done_list.splice(0,1000)
							}
						}
						API.saveConfig()
						if(data.data.has_more==1 && cards[cards.length-1].desc.timestamp + day * 24 * 3600 > ts_s())return get_space_history_dynamic_id_list(Live_info.uid,cards[cards.length-1].desc.dynamic_id_str)
						API.CONFIG.space_history_offset_t = ts_s()
						API.saveConfig()
						console.log('space_history_offset_t',API.CONFIG.space_history_offset_t)
					}else{
						return API.chatLog(`【动态抽奖】获取空间动态：code：${data.code}，msg：${data.msg}`, 'warning');
					}
				}, () => {
					breakmark = true
					setTimeout(async() => {
						breakmark = false
					},20000)
					return API.chatLog(`【动态抽奖】获取抽奖动态信息出错，稍后重新运行！`, 'warning');
				})
			}


			let get_dynamic_id_list = async function(oid) {//提取专栏抽奖动态id
				return new Promise((resolve) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: `https://www.bilibili.com/read/cv${oid}`,
						dataType: "html",
						onload: function(response) {
							let dynamic_id_list = []
							let list = response.responseText
							var reg = /https:\/\/[A-Za-z0-9+/.]+[0-9]/g;
							list = list.match(reg);
							//console.log('dynamic_id_listdynamic_id_list',list);
							for(let i =0;i<list.length;i++){
								if(list[i].indexOf("https://t.bilibili.com/")==-1)continue
								if(list[i]==null)continue
								let str = list[i].substr(23, 18)
								if(dynamic_id_list.indexOf(str)==-1)dynamic_id_list.push(str);
							}
							console.log('dynamic_id_listdynamic_id_list',dynamic_id_list);
							const res = dynamic_id_list
							resolve(res);
						}
					});
				})

			}
			let not_office_dynamic_do = async function (did) {
				API.CONFIG.detail_by_lid_ts = ts_ms()
				let oid,sender_uid,uname,type,content,ctrl//oid,uid,uname
				let discuss = '点赞的人中！'
				let keyword = []
				let num = Math.ceil(Math.random() * (API.CONFIG.poison_chicken_soup.length-1));
				if(API.CONFIG.poison_chicken_soup.length) discuss = API.CONFIG.poison_chicken_soup[num]
				await BAPI.get_dynamic_detail(did).then(async function (data) {
					console.log('not_office_dynamic_do',data)
					if(data.code==0 && data.data.card !=undefined && data.data.card.desc !=undefined && data.data.attentions != undefined){
						oid = data.data.card.desc.rid_str
						sender_uid = data.data.card.desc.uid
						uname = data.data.card.desc.user_profile.info.uname
						ALLFollowingList = data.data.attentions.uids
						API.CONFIG.ALLFollowingList = ALLFollowingList
						if(data.data.card.desc.type == 2){
							type=11
						}else if(data.data.card.desc.type == 4 || data.data.card.desc.type == 1){
							type=17
						}else if(data.data.card.desc.type == 8){
							type=1
						}else {
							type=0
						}
						if(type==17){
							if(data.data.card.desc.origin !=undefined && data.data.card.desc.origin.dynamic_id_str!=undefined){
								console.log('not_office_dynamic_do尝试转发关注原动态',data.data.card.desc.origin.dynamic_id_str)
								if(API.CONFIG.dynamic_id_str_done_list.indexOf(data.data.card.desc.origin.dynamic_id_str)==-1){
									console.log('【专栏动态抽奖】该原动态未转发，尝试转发！')
									await not_office_dynamic_do(data.data.card.desc.origin.dynamic_id_str)
									await sleep(API.CONFIG.detail_by_lid_flash * 1000)//间隔
								}else{
									console.log('【专栏动态抽奖】该原动态已转发！')
								}
							}
							oid = data.data.card.desc.dynamic_id_str
							let msg = JSON.parse(data.data.card.card)
							if(msg.item.content.indexOf("话题")>-1 || msg.item.content.indexOf("带上#")>-1 || msg.item.content.indexOf("带#")>-1 || msg.item.content.indexOf("参与#")>-1){
								await BAPI.getdiscusss_dynamic(oid).then(async (data) => {
									console.log('getdiscusss_dynamic',data)
									if(data.data.replies == undefined)return
									let replies = data.data.replies
									for (let i = 0; i < replies.length; i++) { //拼接
										if(replies[i].content.message.indexOf("#")>-1)keyword = keyword.concat(replies[i].content.message)
									}
								})
								if(keyword.length>0){
									let nu = Math.ceil(Math.random() * (keyword.length-1));
									discuss = keyword[nu] //随机热门带话题复制评论
								}
							}
							let msg_content = "转发动态"+"//@"+uname+":"+msg.item.content
							content = msg_content
							ctrl = msg.item.ctrl
						}else{
							content = "转发动态"
							ctrl = "[]"
						}
						if(API.CONFIG.dynamic_id_str_done_list.indexOf(did) == -1){//未转发
							let modify_mark = false
							if(ALLFollowingList.indexOf(sender_uid) == -1){//未关注
								await BAPI.modify(sender_uid,1).then(function (data) {//关注
									console.log('modify',data)
									if(data.code==0){
										API.chatLog(`UID：${sender_uid}关注成功！`,'success')
										modify_mark = true
									}else{
										API.chatLog(`UID：${sender_uid}关注失败：${data.message}！`,'warning')
									}
								})
							}else{
								API.chatLog(`UID：${sender_uid}已关注！`,'success')
								modify_mark = true
							}
							if(!modify_mark)await sleep(5000)
							if(modify_mark){
								await BAPI.tags_addUsers(sender_uid, dynamic_lottery_tags_tagid).then((data) => {//移动到动态抽奖分组，防止在默认组被取关
									if(data.code==0)API.chatLog(`【专栏动态抽奖】成功转移UP至动态分组！`, 'success');
									console.log('成功转移UP至动态分组', data)
								})
								if(type ==0 ){//

								}else{
									await BAPI.dynamic_postdiscuss(discuss,oid,type).then(async function (data) {//评论
										console.log('专栏动态抽奖评论',data)
										if(data.code==0){
											API.chatLog(`【专栏动态抽奖】专栏动态抽奖评论成功！`,'success')
										}else{
											API.chatLog(`【专栏动态抽奖】专栏动态抽奖评论失败：${data.message}！`,'warning')
										}
									})
									await BAPI.dynamic_like(did).then(async function (data) {//点赞
										if(data.code == 0){
											API.chatLog(`【专栏动态抽奖】成功点赞该条抽奖动态！`, 'success');
										}else{
											API.chatLog(`【专栏动态抽奖】点赞该条抽奖动态失败：${data.data.message}`, 'success');
										}
									})
								}
								await BAPI.repost(did,content,ctrl).then(async function (data) {
									if(data.code == 0){//转发成功
										API.CONFIG.dynamic_id_str_done_list.push(did)
										API.CONFIG.COUNT_GOLDBOX++;
										$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
										$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
										API.chatLog(`【专栏动态抽奖】成功转发一条抽奖动态！`, 'success');

										API.CONFIG.freejournal8.unshift(`<br>${timestampToTime(ts_s())}：用户名：${uname}，<a target="_blank" href="https://t.bilibili.com/${did}">动态页</a>`)
										if (API.CONFIG.freejournal8.length > 1000) {
											API.CONFIG.freejournal8.splice(900, 100);
										}
										API.saveConfig()
										$('#freejournal8 span:eq(0)').text(API.CONFIG.freejournal8);
										let dt = document.getElementById('freejournal8'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.freejournal8

									}else{
										API.chatLog(`【专栏动态抽奖】转发抽奖动态失败：${data.data.errmsg}`, 'warning');
									}
								})
								API.CONFIG.detail_by_lid_ts = ts_ms()
								await sleep(API.CONFIG.detail_by_lid_flash * 1000)//间隔
							}
						}else{
							//API.chatLog(`【专栏动态抽奖】该动态已转发！`, 'warning');
							console.log('【专栏动态抽奖】该动态已转发！')
						}
					}
				})
			}
			let not_office_dynamic_go =async function () {//启动_大锦鲤_抽奖 可能包含一部分漏掉的早前的官方动态抽奖
				await BAPI.article_list().then(async function (data) {
					console.log('data',data.data.articles)
					if(data.code==0){
						let articles = data.data.articles
						for(let i=0;i<articles.length;i++){
							if(articles[i].publish_time + 24 * 3600 > ts_s()) {//24小时内的专栏，可能会修改更新，不过滤
								console.log('articles[i].id',articles[i].id)
								let not_office_dynamic_id_list = await get_dynamic_id_list(articles[i].id)
								console.log('not_office_dynamic_id_list',not_office_dynamic_id_list)
								//console.log('API.CONFIG.dynamic_id_str_done_list',API.CONFIG.dynamic_id_str_done_list)
								if(not_office_dynamic_id_list.length==0)return API.chatLog(`【专栏动态抽奖】专栏${articles[i].id}未获取到新动态数据！`, 'warning');
								for(let n=0;n<not_office_dynamic_id_list.length;n++){
									if(API.CONFIG.dynamic_id_str_done_list.indexOf(not_office_dynamic_id_list[n])==-1){
										await not_office_dynamic_do(not_office_dynamic_id_list[n])
									}else{
										console.log('【专栏动态抽奖】该动态已转发！')
									}
								}
							}
						}
					}
				})
			}

			let detail_by_lid = async function (lid) {//直播预约抽奖+动态抽奖
				if(!API.CONFIG.detail_by_lid_live && !API.CONFIG.detail_by_lid_dynamic && !API.CONFIG.dynamic_lottery)return
				//直播预约------------------------------全部动态
				API.CONFIG.detail_by_lid_ts = ts_ms()
				API.CONFIG.last_lottery_id = lid
				API.saveConfig()
				await BAPI.detail_by_lid(lid).then(async function (data) {
					console.log('detail_by_lid',lid,data)
					if(breakmark)return
					if(data.code==0){
						let lottery_time = data.data.lottery_time
						let business_id = data.data.business_id
						if(data.data.status == 0 && data.data.lottery_time > ts_s()){//有效的抽奖
							if(business_id < 999999999 && API.CONFIG.detail_by_lid_live && business_id !=0 && API.CONFIG.business_id.indexOf(business_id)==-1 && API.CONFIG.lottery_id_done_list.indexOf(lid) == -1){//预约直播抽奖
								let first_prize_cmt = data.data.first_prize_cmt
								let second_prize_cmt = data.data.second_prize_cmt
								let third_prize_cmt = data.data.third_prize_cmt
								if(first_prize_cmt != '')first_prize_cmt = "一等奖：" + first_prize_cmt
								if(second_prize_cmt != '')second_prize_cmt = "，二等奖：" + second_prize_cmt
								if(third_prize_cmt != '')third_prize_cmt = "，三等奖：" + third_prize_cmt
								let sender_uid = Number(data.data.sender_uid)
								let num = API.CONFIG.room_ruid.indexOf(sender_uid)
								let room = 99999999999
								if(num>-1)room = API.CONFIG.room_ruid[num-1]
								let num2 = API.CONFIG.Anchor_ignore_uid.indexOf(room)
								let num3 = API.CONFIG.Anchor_ignore_keyword.some(v => first_prize_cmt.toLowerCase().indexOf(v) > -1 || second_prize_cmt.toLowerCase().indexOf(v) > -1 || third_prize_cmt.toLowerCase().indexOf(v) > -1)
								let num4 = !API.CONFIG.Anchor_unignore_keyword.some(v => first_prize_cmt.toLowerCase().indexOf(v) > -1 || second_prize_cmt.toLowerCase().indexOf(v) > -1 || third_prize_cmt.toLowerCase().indexOf(v) > -1)
								if (num2>-1 || num3 && num4 && API.CONFIG.detail_by_lid_live_ignore){
									//奖品含有屏蔽词或屏蔽的直播间
									if(num2>-1){
										API.chatLog(`【预约抽奖】跳过${lid}预约直播抽奖，屏蔽的直播间${room}！<br><a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lid}">抽奖页</a>`,'warning')
									}else{
										API.CONFIG.journal_pb.unshift(`<br>${timestampToTime(ts_s())}：【预约抽奖】${lid}预约直播抽奖，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}含有屏蔽词！<br><a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lid}">抽奖页</a>`)
										if (API.CONFIG.journal_pb.length > 500) {
											API.CONFIG.journal_pb.splice(400, 100);
										}
										API.saveConfig();
										$('#journal_pb span:eq(0)').text(API.CONFIG.journal_pb)
										let dt = document.getElementById('journal_pb'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.journal_pb
										API.chatLog(`【预约抽奖】跳过${lid}预约直播抽奖，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}含有屏蔽词！<br><a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lid}">抽奖页</a>`,'warning')
									}
								}else{
									await BAPI.reserve_relation_info(business_id).then(async function (data) {
										if(data.code==0 && data.data != undefined && data.data.list[business_id] != undefined && data.data.list[business_id].dynamicId != undefined && data.data.list[business_id].total != undefined){
											console.log('reserve_relation_info',data)
											let list = data.data.list
											console.log('reserve_relation_info',list)
											let dynamicId = list[business_id].dynamicId
											let total = list[business_id].total
											await BAPI.reserve_attach_card_button(business_id,total).then(async function (data) {
												if(data.code==0){
													API.CONFIG.lottery_id_done_list.push(lid)
													API.CONFIG.lottery_id_done_list.push(lottery_time)
													API.CONFIG.business_id.push(business_id)
													if(API.CONFIG.business_id.length>2000)API.CONFIG.business_id.splice(0,500)
													API.chatLog(`【预约抽奖】${lid}预约直播抽奖参与成功！`,'success')
													API.CONFIG.COUNT_GOLDBOX++;
													$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
													$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
													API.CONFIG.freejournal6.unshift(`<br>${timestampToTime(ts_s())}：<a target="_blank" href="https://www.bilibili.com/h5/lottery/result?business_id=${business_id}&business_type=10&lottery_id=${lid}">抽奖页</a>，<a target="_blank" href="https://t.bilibili.com/${dynamicId}">动态页</a>，开奖时间：${timestampToTime(lottery_time)}，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}`)
													if (API.CONFIG.freejournal6.length > 1000) {
														API.CONFIG.freejournal6.splice(900, 100);
													}
													API.CONFIG.detail_by_lid_ts = ts_ms()
													API.saveConfig()
													$('#freejournal6 span:eq(0)').text(API.CONFIG.freejournal6)
													let dt = document.getElementById('freejournal6'); //通过id获取该div
													dt.innerHTML  = API.CONFIG.freejournal6
													await sleep(30 * 1000)//间隔
												}
											})
										}
									})
								}
							}
							if(business_id > 999999999 || business_id == 0){//business_id == 0 大数字精度损失变0
								if(API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
									let sender_uid = data.data.sender_uid
									let cards = []
									await sleep(5000)
									await BAPI.space_history(sender_uid,0).then(async (data) => {
										console.log('space_history',data)
										if (data.code == 0 && data.data.attentions != undefined) {
											ALLFollowingList = data.data.attentions.uids
											API.CONFIG.ALLFollowingList = ALLFollowingList
											console.log('ALLFollowingList',ALLFollowingList)
											//if(API.CONFIG.dynamic_lottery  && ALLFollowingList.indexOf(sender_uid) == -1)return//动态红包不需要关注，不要跳过
											if (!!data.data.cards) {
												cards = data.data.cards
												console.log('cards',cards)
												for(let i=0;i<cards.length;i++){
													console.log('cards[i].extension',cards[i].extension)
													if(cards[i].extension == undefined || cards[i].extension.lott == undefined) continue
													//官方工具抽奖
													if(API.CONFIG.dynamic_id_str_done_list.indexOf(cards[i].desc.dynamic_id_str)>-1) continue
													//已参与的动态ID
													let first_prize_cmt,second_prize_cmt,third_prize_cmt,lottery_time,lottery_id
													await BAPI.dynamic_lottery_notice(cards[i].desc.dynamic_id_str).then(async function (data) {
														console.log('dynamic_lottery_notice',data)
														if(data.code==0){
															lottery_time = data.data.lottery_time
															first_prize_cmt = data.data.first_prize_cmt
															second_prize_cmt = data.data.second_prize_cmt
															third_prize_cmt = data.data.third_prize_cmt
															if(first_prize_cmt != '' && first_prize_cmt.indexOf("动态红包")==-1)first_prize_cmt = "一等奖：" + first_prize_cmt
															if(second_prize_cmt != '')second_prize_cmt = "，二等奖：" + second_prize_cmt
															if(third_prize_cmt != '')third_prize_cmt = "，三等奖：" + third_prize_cmt
															lottery_id = data.data.lottery_id
															if(API.CONFIG.dynamic_lottery  && ALLFollowingList.indexOf(sender_uid) == -1 && first_prize_cmt.indexOf("动态红包")==-1)return
															//动态红包不需要关注，不要跳过
															if(API.CONFIG.dynamic_id_str_done_list.indexOf(cards[i].desc.dynamic_id_str) == -1 && lottery_time > ts_s()){//未转发、未开奖
																let modify_mark = false
																if(first_prize_cmt.indexOf("动态红包")>-1){
																	API.chatLog(`UID：${sender_uid}，动态红包不需要关注！`,'success')
																	modify_mark = true
																}else{
																	if(ALLFollowingList.indexOf(sender_uid) == -1){//未关注
																		await BAPI.modify(sender_uid,1).then(function (data) {//关注
																			console.log('modify',data)
																			if(data.code==0){
																				API.chatLog(`UID：${sender_uid}关注成功！`,'success')
																				modify_mark = true
																			}else{
																				API.chatLog(`UID：${sender_uid}关注失败：${data.message}！`,'warning')
																			}
																		})
																	}else{
																		API.chatLog(`UID：${sender_uid}已关注！`,'success')
																		modify_mark = true
																	}
																}
																if(!modify_mark)await sleep(5000)
																if(modify_mark){
																	await BAPI.tags_addUsers(cards[i].desc.uid, dynamic_lottery_tags_tagid).then((data) => {//移动到动态抽奖分组，防止在默认组被取关
																		if(data.code==0){
																			API.chatLog(`【动态抽奖】成功转移UP至动态分组！`, 'success');
																			console.log('成功转移UP至动态分组', data)
																		}
																	})
																	await BAPI.repost(cards[i].desc.dynamic_id_str,"转发动态","[]").then(async function (data) {
																		if(data.code == 0){//转发成功
																			API.CONFIG.dynamic_id_str_done_list.push(cards[i].desc.dynamic_id_str)
																			API.CONFIG.COUNT_GOLDBOX++;
																			$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
																			$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
																			if(API.CONFIG.lottery_id_done_list.indexOf(lottery_id) == -1){
																				API.CONFIG.lottery_id_done_list.push(lottery_id)
																				API.CONFIG.lottery_id_done_list.push(lottery_time)
																			}
																			API.chatLog(`【动态抽奖】成功转发一条抽奖动态！`, 'success');
																			BAPI.dynamic_like(cards[i].desc.dynamic_id_str).then(async function (data) {
																				if(data.code == 0){
																					API.chatLog(`【动态抽奖】成功点赞该条抽奖动态！`, 'success');
																				}else{
																					API.chatLog(`【动态抽奖】${data.data.message}`, 'success');
																				}
																			})
																			if(first_prize_cmt.indexOf("动态红包")>-1){//动态红包
																				const dthbcmt = JSON.parse(first_prize_cmt)
																				console.log('first_prize_cmt',dthbcmt)
																				const cmt = dthbcmt.lucky_guys_num + '人瓜分' + dthbcmt.total_money/100+ '元'
																				API.CONFIG.freejournal5.unshift(`<br>${timestampToTime(ts_s())}：用户名：${cards[i].desc.user_profile.info.uname}，<a target="_blank" href="https://t.bilibili.com/${cards[i].desc.dynamic_id_str}">动态页</a>，开奖时间：${timestampToTime(lottery_time)}，动态红包：${cmt}`)
																				if (API.CONFIG.freejournal5.length > 1000) {
																					API.CONFIG.freejournal5.splice(900, 100);
																				}
																				API.saveConfig()
																				$('#freejournal5 span:eq(0)').text(API.CONFIG.freejournal5);
																				let dt = document.getElementById('freejournal5'); //通过id获取该div
																				dt.innerHTML  = API.CONFIG.freejournal5
																			}else{
																				API.CONFIG.freejournal5.unshift(`<br>${timestampToTime(ts_s())}：用户名：${cards[i].desc.user_profile.info.uname}，<a target="_blank" href="https://t.bilibili.com/${cards[i].desc.dynamic_id_str}">动态页</a>，开奖时间：${timestampToTime(lottery_time)}，奖品：${first_prize_cmt}${second_prize_cmt}${third_prize_cmt}`)
																				if (API.CONFIG.freejournal5.length > 1000) {
																					API.CONFIG.freejournal5.splice(900, 100);
																				}
																				API.saveConfig()
																				$('#freejournal5 span:eq(0)').text(API.CONFIG.freejournal5);
																				let dt = document.getElementById('freejournal5'); //通过id获取该div
																				dt.innerHTML  = API.CONFIG.freejournal5
																			}


																		}else{
																			API.chatLog(`【动态抽奖】${data.data.errmsg}`, 'warning');
																		}
																	})
																	API.CONFIG.detail_by_lid_ts = ts_ms()
																	await sleep(API.CONFIG.detail_by_lid_flash * 1000)//间隔
																}
															}
														}
													}, () => {
														breakmark = true
														setTimeout(async() => {
															breakmark = false
														},20000)
														return API.chatLog(`【动态抽奖】获取抽奖动态信息出错，稍后重新运行！`, 'warning');
													})
												}
											} else {
												return API.chatLog('【动态抽奖】暂无动态！', 'warning');
											}
										}else{
											return API.chatLog(`【动态抽奖】获取空间动态：code：${data.code}，msg：${data.msg}`, 'warning');
										}
									},() => {
										breakmark = true
										setTimeout(async() => {
											breakmark = false
										},20000)
										return API.chatLog(`【动态抽奖】获取抽奖动态信息出错，稍后重新运行！`, 'warning');
									})
								}
							}
						}
						await sleep(1000)//获取数据间隔
						return detail_by_lid(lid+1)
					}else if(data.code = -9999){
						API.chatLog(`【动态抽奖】全部动态抽奖及直播预约抽奖结束！`, 'success');
						return
					}else{
						API.chatLog(`【动态抽奖】${data.message}`, 'warning');
						return
					}
				}, () => {
					return API.chatLog(`【动态抽奖】检索动态抽奖数据失败，请检查网络`, 'warning');
				})
			}

			var flashit=document.getElementById('dynamic_lottery_btn');
			function blinklink(){
				if(flashit.style.backgroundColor=='rgb(232, 83, 63)'){
					flashit.style.backgroundColor='#485fbd';
				}else{
					flashit.style.backgroundColor='rgb(232, 83, 63)';
				}
			}

			//动态抽奖
			setTimeout(async() => {
				if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
					API.CONFIG.detail_by_lid_ts = ts_ms()
					return
				}; //不抽奖时间段
				if(!dynamic_lottery_run_mark)return//有正在运行的动态抽奖
				dynamic_lottery_run_mark = false
				if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
					var blinklinktimer = setInterval(blinklink,500);
				}
				if(API.CONFIG.detail_by_lid_live)API.chatLog(`【预约抽奖】开始直播预约抽奖！`, 'success');
				if(API.CONFIG.detail_by_lid_dynamic)API.chatLog(`【动态抽奖】开始全动态抽奖！`, 'success');
				if(API.CONFIG.dynamic_lottery)API.chatLog(`【动态抽奖】开始仅关注动态抽奖！`, 'success');
				if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
					API.chatLog(`【动态抽奖】开始更新已转动态抽奖数据！`, 'success');
					await get_space_history_dynamic_id_list(Live_info.uid,0)//获取已转动态id
				}
				await detail_by_lid(API.CONFIG.last_lottery_id)
				if(API.CONFIG.not_office_dynamic_go){
					API.chatLog(`【动态抽奖】开始非官方动态抽奖！`, 'success');
					await not_office_dynamic_go()
					API.chatLog(`【动态抽奖】非官方动态抽奖结束！`, 'success');
				}
				dynamic_lottery_run_mark = true
				clearInterval(blinklinktimer)
				flashit.style.backgroundColor='rgb(248,248,255)'
			},60 * 1000)

			setInterval(async() => {
				if(inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE){
					API.CONFIG.detail_by_lid_ts = ts_ms()
					return
				}; //不抽奖时间段
				if(!dynamic_lottery_run_mark)return//有正在运行的动态抽奖
				dynamic_lottery_run_mark = false
				if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
					var blinklinktimer = setInterval(blinklink,500);
				}
				if(API.CONFIG.detail_by_lid_live)API.chatLog(`【预约抽奖】开始直播预约抽奖！`, 'success');
				if(API.CONFIG.detail_by_lid_dynamic)API.chatLog(`【动态抽奖】开始全动态抽奖！`, 'success');
				if(API.CONFIG.dynamic_lottery)API.chatLog(`【动态抽奖】开始仅关注动态抽奖！`, 'success');
				if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
					API.chatLog(`【动态抽奖】准备更新已转动态抽奖数据！`, 'success');
					await get_space_history_dynamic_id_list(Live_info.uid,0)//获取已转动态id
				}
				await detail_by_lid(API.CONFIG.last_lottery_id)
				if(API.CONFIG.not_office_dynamic_go){
					API.chatLog(`【动态抽奖】开始非官方动态抽奖！`, 'success');
					await not_office_dynamic_go()
					API.chatLog(`【动态抽奖】非官方动态抽奖结束！`, 'success');
				}
				dynamic_lottery_run_mark = true
				clearInterval(blinklinktimer)
				flashit.style.backgroundColor='rgb(248,248,255)'
			},1800 * 1000)


			let get_Anchor_room2 = async() => { //天选获取房间号 方式二
				if (API.CONFIG.get_following_live)return;//只检索关注的主播
				if (!API.CONFIG.AUTO_Anchor)
					return;
				if (!API.CONFIG.switch_sever)
					return;
				if (!API.CONFIG.Anchor_room_get)
					return;
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE)
					return;
				//API.chatLog(`【天选时刻】正在更新分区推荐房间列表......`);

				let Anchor = async function (num) {
					if (!API.CONFIG.switch_sever)
						return;
					if (API.CONFIG.AUTO_Anchor) {
						await $.get(`https://api.live.bilibili.com/room/v3/area/getRoomList?platform=web&parent_area_id=${parent_area_id[num]}&page=1&page_size=${API.CONFIG.getroomnum}&tag_version=1`, function (data) {
							let list = data.data.list; // [{id: ,link:}]
							if (list.length == 0)
								return;
							console.log(`获取分区推荐房间列表${parent_area_id[num]}`, list);
							for (let i = 0; i < list.length; i++) {
								let room = list[i].roomid;
								if (API.CONFIG.id_list.indexOf(room) > -1) {
									//console.log(`${room}，天选列表已有`);
								} else {
									API.CONFIG.id_list.push(room);
									console.log(`${room}，添加至天选列表`);
									if (API.CONFIG.id_list.length > API.CONFIG.TOProomnum) { //直播间房间号数量上限
										API.CONFIG.id_list.splice(0, 50);
										if (XH >= 50) {
											XH = XH - 50;
										} else {
											XH = 0
										}
										API.chatLog(`房间数达到${API.CONFIG.id_list.length+50}，超过设置的上限，移出旧房间-50`, 'warning');
									}

									//API.chatLog(`【天选时刻】列表新增房间号：${room}`);
								}
							};
						});
					}
				}
				for(let i =0;i < 8;i++){//parent_area_id = [2,3,6,1,5,9,10,11]//{"网游分区":2},{"手游分区":3},{"单机游戏":6},{"娱乐分区":1},{"电台分区":5},{"虚拟分区":9},{"生活分区":10},{"学习分区":11}
					setTimeout(async() => {
						if(API.CONFIG.parent_area_id2 && i==0)Anchor(i);
						if(API.CONFIG.parent_area_id3 && i==1)Anchor(i);
						if(API.CONFIG.parent_area_id6 && i==2)Anchor(i);
						if(API.CONFIG.parent_area_id1 && i==3)Anchor(i);
						if(API.CONFIG.parent_area_id5 && i==4)Anchor(i);
						if(API.CONFIG.parent_area_id9 && i==5)Anchor(i);
						if(API.CONFIG.parent_area_id10 && i==6)Anchor(i);
						if(API.CONFIG.parent_area_id11 && i==7)Anchor(i);
					},11000 * i)
				}
			};
			setTimeout(get_Anchor_room2, 5e3);
			setInterval(get_Anchor_room2, 120 * 1000);

			let get_Anchor_room3 = async() => { //天选加急房 方式三
				if (!API.CONFIG.AUTO_Anchor)
					return;
				if (!API.CONFIG.switch_sever)
					return;
				if (!API.CONFIG.Anchor_room_get)
					return;
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE)
					return;
				if (!API.CONFIG.Anchor_room_go_switch | !Number(API.CONFIG.Anchor_room_go))
					return;
				if (Number(API.CONFIG.Anchor_room_go) == API.CONFIG.id_list[API.CONFIG.id_list.length - 1])
					return;
				API.CONFIG.id_list.splice(XH + 3, 0, Number(API.CONFIG.Anchor_room_go));
				API.chatLog(`【天选时刻】加入加急直播间到检索天选房间序列，20秒一次，不需要时请关闭该选项，以免浪费检索资源。`);
			};
			setInterval(get_Anchor_room3, 20 * 1000);


			let following_live_room_list=[]
			let get_following_live = async function (pn = 1) {
				await sleep(100)
				if (pn == 1)following_live_room_list = [];
				return BAPI.Lottery.anchor.following_live(pn).then((data) => {
					//console.log('following_live_room', data)
					let adata = data.data.list
					if(adata[0].live_status==0)return
					for (let i = 0; i < adata.length; i++) {
						if(adata[i].live_status==1)following_live_room_list.push(adata[i].roomid)
						if(adata[i].live_status==0)return
					}
					if (pn < data.data.totalPage)
						return get_following_live(pn + 1)
				}, () => {
					return API.chatLog('获取数据出错！', 'warning');
				});
			};

			let check_Anchor_room = async() => { //检查天选
				if (!API.CONFIG.switch_sever)
					return;
				if (API.CONFIG.AUTO_Anchor) {
					if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
						API.CONFIG.Anchor_ts = ts_ms();
						API.chatLog('当前时间段不检查天选', 'warning');
						setTimeout(async() => {
							check_Anchor_room();
						}, API.CONFIG.AnchorcheckFLASH * 1000);
						return;
					};
					API.chatLog('开始轮查直播间天选时刻信息 ', 'success');
				} else {
					//API.chatLog('未开启天选时刻抽奖 ', 'warning');
					return;
				};
				if (API.CONFIG.Anchor_always_room_switch) { //加入常驻房间列表，开关
					for (let i = 0; i < API.CONFIG.Anchor_always_room_list.length; i++) {
						if (API.CONFIG.id_list.indexOf(API.CONFIG.Anchor_always_room_list[i]) == -1) {
							API.CONFIG.id_list.push(API.CONFIG.Anchor_always_room_list[i]);
						}
					}

				}
				if(API.CONFIG.get_following_live){
					await get_following_live()
					API.CONFIG.id_list=following_live_room_list
					API.chatLog(`【天选时刻】当前关注的且正在直播的房间有${API.CONFIG.id_list.length}个！`, 'success')
				}
				if (!API.CONFIG.id_list.length) await sleep(60000);
				let div = $("<div class='zdbgjMsg'>");
				let msg = $("<div>");
				let aa = $("<div>");
				let bb = $("<div>");
				let ct = $('#chat-items');
				let myDate = new Date();
				div.text(myDate.toLocaleString());
				div.append(msg);
				msg.append(aa);
				msg.append(bb);
				div.css({
					'text-align': 'center',
					'border-radius': '4px',
					'min-height': '30px',
					'width': '256px',
					'color': '#9585FF',
					'line-height': '30px',
					'padding': '0 10px',
					'margin': '10px auto',
				});
				msg.css({
					'word-wrap': 'break-word',
					'width': '100%',
					'line-height': '1em',
					'margin-bottom': '10px',
				});
				div.css({
					'border': '1px solid rgb(203, 195, 255)',
					'background': 'rgb(233, 230, 255) none repeat scroll 0% 0%',
				});
				aa.css({
					'color': 'blue',
					'line-height': '20px',
				});
				bb.css({
					'color': 'blue',
					'line-height': '20px',
				});
				if (API.CONFIG.TALK == false) { //自定义提示开关
					ct.append(div);
					aa.text(`【天选时刻】循环检查，已耗时秒：`);
					bb.text(`序号/共，直播房间号：`);
					let ctt = $('#chat-history-list');
					if (GM_getValue('go_down')){
						ctt.animate({
							scrollTop: ctt.prop("scrollHeight")
						}, 0); //滚动到底部
					}
				}
				XH = 0;
				let time1 = ts_ms();
				let Anchor = async function () {
					if (!API.CONFIG.switch_sever)
						return;
					await sleep(API.CONFIG.AnchorFLASH);
					API.CONFIG.Anchor_ts = ts_ms();
					API.saveConfig();
					if (XH >= API.CONFIG.id_list.length) {
						API.chatLog(`【天选时刻】天选巡检结束，${API.CONFIG.AnchorcheckFLASH}秒后重新开始天选巡检！`, 'success')
						setTimeout(async() => {
							check_Anchor_room();
						}, API.CONFIG.AnchorcheckFLASH * 1000);
						return;
					}
					let time2 = ts_ms();
					if (parseInt((time2 - time1) / 1000) == 300 - API.CONFIG.AnchorcheckFLASH | parseInt((time2 - time1) / 1000) == 310 - API.CONFIG.AnchorcheckFLASH | parseInt((time2 - time1) / 1000) == 320 - API.CONFIG.AnchorcheckFLASH) {
						//API.chatLog(`【天选时刻】请注意【检索耗时+检索间隔≥300秒】，避免漏掉【5分钟的天选】，请开启蹭服务器天选！`, 'warning')
					}
					let checkuid = 0;
					if (API.CONFIG.AUTO_Anchor) {
						if (API.CONFIG.TALK == false) { //自定义提示开关
							ct.append(div); //向聊天框加入信息
						}
						aa.text(`【天选时刻】循环检查，已耗时${parseInt((time2-time1)/1000)}秒：`); ///共${API.CONFIG.id_list.length}
						bb.text(`序号${XH+1}/共${API.CONFIG.id_list.length}，直播房间号：${API.CONFIG.id_list[XH]}`);
						if (API.CONFIG.Anchor_ignore_uid.indexOf(Number(API.CONFIG.id_list[XH])) > -1) {
							console.log(`${API.CONFIG.id_list[XH]}屏蔽的直播间房间号`);
							API.chatLog(`【天选时刻】${API.CONFIG.id_list[XH]}屏蔽的直播间房间号，舍弃！`, 'warning')
							XH++;
							Anchor();
							return;
						}
						let check_verif = false
						await BAPI.ajax({
							url: "//api.live.bilibili.com/room/v1/Room/verify_room_pwd?room_id=" + `${API.CONFIG.id_list[XH]}`
						}).then(async(data) => {
							if (data.code != 0)
								check_verif = true;
							console.log('直播间加密状态', check_verif)
						})
						await sleep(50)
						if (check_verif) {
							API.chatLog(`【天选时刻】${API.CONFIG.id_list[XH]}加密的直播间房间号，舍弃！`, 'warning')
							XH++;
							Anchor();
							return;
						}
						await BAPI.ajax({
							url: "xlive/lottery-interface/v1/Anchor/Check?roomid=" + `${API.CONFIG.id_list[XH]}`
						}).then(async(data) => {
							let roomlist_data = data.data;
							console.log(`当前房号${API.CONFIG.id_list[XH]}，当前序号${XH+1}`);
							console.log('当前天选信息', roomlist_data);
							if (roomlist_data == null) {
								XH++;
								Anchor();
								return;
							} else {
								let time = Number(roomlist_data.time);
								let id = Number(roomlist_data.id);
								let gift_price = Number(roomlist_data.gift_price);
								let gift_id = Number(roomlist_data.gift_id);
								let gift_num = Number(roomlist_data.gift_num);
								let require_type = Number(roomlist_data.require_type)
								let require_text = roomlist_data.require_text
								let award_name = roomlist_data.award_name;
								let require_value = Number(roomlist_data.require_value);
								let cur_gift_num = Number(roomlist_data.cur_gift_num)
								let danmu = roomlist_data.danmu
								let current_time = roomlist_data.current_time
								if (cur_gift_num > 0 && API.CONFIG.Anchor_cur_gift_num) {
									API.chatLog(`【天选时刻】已参与一次抽奖：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning')
									XH++;
									Anchor();
									return;
								}
								if (time == 0) {
									XH++;
									Anchor();
									return;
								}
								if (time > 0) { //抽奖时间限定,原因：考虑网络加载等，延迟20秒点击抽奖Anchor_always_room_list
									let num6 = API.CONFIG.done_id_list.indexOf(id)
									if (num6 > -1) {
										//console.log(`${id}已参与抽奖的序号id`);
										XH++;
										Anchor();
										return;
									}
									API.CONFIG.freejournal4.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}">${API.CONFIG.id_list[XH]}</a>，奖品：${award_name}，条件：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
									if (API.CONFIG.freejournal4.length > 1000) {
										API.CONFIG.freejournal4.splice(900, 100);
									}
									$('#freejournal span:eq(0)').text(API.CONFIG.freejournal4);
									let dt = document.getElementById('freejournal4'); //通过id获取该div
									dt.innerHTML  = API.CONFIG.freejournal4
									API.CONFIG.done_id_list.push(id); //记录已检测到的抽奖id
									if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
									API.CONFIG.room_AnchorRecord_time.push(Number(API.CONFIG.id_list[XH])); //记录开启天选的房间号+时间
									API.CONFIG.room_AnchorRecord_time.push(ts_s());
									API.saveConfig();
									if (API.CONFIG.Anchor_room_get_to_always && API.CONFIG.Anchor_always_room_list.indexOf(API.CONFIG.id_list[XH]) == -1) {
										if(!API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) || API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){//屏蔽的不加入检索
											API.CONFIG.Anchor_always_room_list.push(API.CONFIG.id_list[XH]); //记录天选房间
											if (API.CONFIG.Anchor_always_room_list.length > API.CONFIG.Anchor_always_room_num) {
												API.chatLog(`常驻房间数达到${API.CONFIG.Anchor_always_room_num}，超过设置的上限，移出旧房间${API.CONFIG.Anchor_always_room_list.length-API.CONFIG.Anchor_always_room_num}个`, 'warning');
												API.CONFIG.Anchor_always_room_list.splice(0, API.CONFIG.Anchor_always_room_list.length - API.CONFIG.Anchor_always_room_num);
											}
											API.saveConfig();
										}else{
											console.log('屏蔽的不加入检索');
										}
									}
									//console.log('已参与的抽奖天选ID列表', API.CONFIG.done_id_list);
									if (API.CONFIG.switch_sever) {
										if(!API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) || API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){//屏蔽的不传服务器
											Anchor_room_list.push(API.CONFIG.id_list[XH]);
											Anchor_award_id_list.push(id);
											Anchor_award_nowdate.push(ts_ten_m());
											API.saveConfig();
											//上传服务器
											const post_data_stringify = {
												"uid": Live_info.uid,
												"room_id": API.CONFIG.id_list[XH],
												"id": id,
												"time":time,
												"gift_price":gift_price,
												"gift_id":gift_id,
												"gift_num":gift_num,
												"require_type":require_type,
												"require_text":require_text,
												"award_name":award_name,
												"require_value":require_value,
												"cur_gift_num":cur_gift_num,
												"danmu":danmu,
												"current_time":current_time
											}
											const post_data = {id:id,room_id:API.CONFIG.id_list[XH],data:JSON.stringify(post_data_stringify)}
											post_data_to_server(post_data,qun_server[0]).then((data) => {
												console.log('post_data_to_server',data)
											})
											//上传服务器
										}else{
											console.log('屏蔽的不传服务器');
										}
									}
									API.chatLog(`【天选时刻】<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}"target="_blank">直播间：${API.CONFIG.id_list[XH]}</a>，奖品：${award_name}，要求：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`, 'success',time)
									if (require_type == 3) { //1关注，2粉丝勋章，3大航海:3舰长2提督1总督| console.log('生效大航海房间',guardroom);console.log('生效大航海等级',guard_level);console.log('生效大航海等级',guardroom_activite);
										let guardroom_num = API.CONFIG.guardroom.indexOf(API.CONFIG.id_list[XH])
										if (guardroom_num < 0) {
											API.chatLog(`【天选时刻】无大航海：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
											XH++;
											Anchor();
											return;
										}
										if (guardroom_num > -1 && API.CONFIG.guardroom_activite[guardroom_num] == 1 && API.CONFIG.guard_level[guardroom_num] <= require_value) {
											console.log('大航海数据', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
										} else {
											console.log('大航海数据', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
											API.chatLog(`【天选时刻】大航海身份不符：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
											XH++;
											Anchor();
											return;
										}
									}
									if (require_type == 4 && Live_info.user_level < require_value) { //直播等级
										API.chatLog(`【天选时刻】直播等级不符：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									if (require_type == 5 && Live_info.Blever < require_value) { //5主站等级Live_info.Blever
										API.chatLog(`【天选时刻】主站等级不符：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									if (require_type >= 6) { //未知
										API.chatLog(`【天选时刻】未知要求：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									if (gift_price * gift_num > API.CONFIG.gift_price) { //金瓜子判断
										API.chatLog(`【天选时刻】金瓜子超出设置：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									if (API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										let now_key
										for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
											if(award_name.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
												now_key=API.CONFIG.Anchor_ignore_keyword[i]
												break
											}
										}
										API.CONFIG.journal_pb.unshift(`<br>${timestampToTime(ts_s())}：【天选时刻】过滤关键词：${now_key}：奖品：${award_name}：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间：${API.CONFIG.id_list[XH]}</a>`)
										if (API.CONFIG.journal_pb.length > 500) {
											API.CONFIG.journal_pb.splice(400, 100);
										}
										API.saveConfig();
										$('#journal_pb span:eq(0)').text(API.CONFIG.journal_pb)
										let dt = document.getElementById('journal_pb'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.journal_pb

										API.chatLog(`【天选时刻】过滤关键词：${now_key}：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									let money = []
									if (API.CONFIG.money_switch || API.CONFIG.no_money_checkbox) {
										money = await moneyCheck(award_name);
										console.log('识别到的奖品金额', money)
									}
									if (money[0] && money[1] < API.CONFIG.money_min) {
										API.chatLog(`奖品金额低于设置值：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true);
										XH++;
										Anchor();
										return;
									}
									if (API.CONFIG.no_money_checkbox && money[0]==false && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										API.chatLog(`未识别到现金及正则：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true);
										XH++;
										Anchor();
										return;
									}
									let bigmoney_to_get_medal = 0
									if(API.CONFIG.bigmoney_switch && money[0] && API.CONFIG.bigmoney <= money[1] ){
										bigmoney_to_get_medal = 1
										await sleep(50)
									}
									if(API.CONFIG.unignore_to_get_medal_switch){
										if(API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
											bigmoney_to_get_medal = 1
											await sleep(50)
										}
									}
									await sleep(50)
									let fansnum = 0,
										anchor_uid = 0
									let room_ruid_num = API.CONFIG.room_ruid.indexOf(API.CONFIG.id_list[XH])
									if (API.CONFIG.fans_switch || API.CONFIG.Anchor_Followings_switch || API.CONFIG.AUTO_medal_get_up || API.CONFIG.AUTO_medal_up || API.CONFIG.unusual_check) { //粉丝数量判断、只参与关注的主播抽奖、勋章抽奖需要的
										room_ruid_num = API.CONFIG.room_ruid.indexOf(API.CONFIG.id_list[XH])
										if (room_ruid_num > -1) {
											anchor_uid = API.CONFIG.room_ruid[room_ruid_num + 1]
										}
										if (room_ruid_num < 0) {
											await sleep(500)
											let anchor_uid_mark = 0
											await BAPI.live_user.get_anchor_in_room(API.CONFIG.id_list[XH]).then(async(data) => {
												if(data.code==0 && data.data.info !== undefined){
													anchor_uid = data.data.info.uid;
													API.CONFIG.room_ruid.push(API.CONFIG.id_list[XH])
													API.CONFIG.room_ruid.push(anchor_uid)
													API.saveConfig();
												}else{
													anchor_uid_mark = 1
												}
											}, () => {
												API.chatLog(`【天选时刻】anchor_uid获取失败，跳过当前直播间，可能风控了，可调出控制台错误信息反馈到群里！`, 'warning');
												anchor_uid_mark = 1
											});
											if (anchor_uid_mark) {
												XH++;
												Anchor();
												return;
											}
										}
									}
									if (API.CONFIG.fans_switch) { //粉丝数量判断
										await BAPI.web_interface_card(anchor_uid).then(async(data) => {
											fansnum = data.data.follower
											console.log('粉丝数量', fansnum)
										}, () => {
											API.chatLog(`【天选时刻】粉丝数量获取失败，可能风控了！<br><a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}"target="_blank">直播间：${API.CONFIG.id_list[XH]}</a>，跳过不参加抽奖！`, 'warning',0,API.CONFIG.id_list[XH],true);
										})
									}
									if (API.CONFIG.fans_switch && fansnum == 0) { //粉丝数量风控判断
										XH++;
										Anchor();
										return;
									}
									if (API.CONFIG.fans_switch && fansnum < API.CONFIG.fans_min) { //粉丝数量判断
										API.chatLog(`<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}"target="_blank">直播间：${API.CONFIG.id_list[XH]}</a>抽奖主播粉丝数${fansnum}小于设置${API.CONFIG.fans_min}，不参加抽奖！`, 'warning',0,API.CONFIG.id_list[XH],true);
										XH++;
										Anchor();
										return;
									}
									if (API.CONFIG.Anchor_Followings_switch & API.CONFIG.FollowingList.indexOf(anchor_uid) == -1) { //开启只参与关注的主播抽奖
										XH++;
										API.chatLog(`不参与非关注主播的抽奖!`,  'warning',0,API.CONFIG.id_list[XH],true);
										Anchor();
										return;
									}
									let medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(API.CONFIG.id_list[XH])//是否有勋章
									room_ruid_num = API.CONFIG.room_ruid.indexOf(Number(API.CONFIG.id_list[XH])) //是否有room-uid数据

									if (require_type == 2 && medal_roomid_list_num > -1) { //已有勋章的自动升级
										if (API.CONFIG.medal_level_list[medal_roomid_list_num] < require_value) {
											if(require_value>=20){
												API.chatLog(`【天选时刻】勋章等级要求：${require_value}，小心心无法升级！粉丝勋章等级不符要求：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
												XH++;
												Anchor();
												return;
											}
											if(require_value<20){
												if(API.CONFIG.AUTO_medal_up){
													API.chatLog(`【天选时刻】正在尝试升级粉丝勋章！`, 'success')
													BAPI.sendLiveDanmu(danmu, Number(API.CONFIG.id_list[XH]))//发送抽奖弹幕，亲密度+100
													await sleep(5000)//弹幕延迟
													let do_check = await API.get_medal_lv_do(Number(API.CONFIG.id_list[XH]),require_value,anchor_uid)
													API.CONFIG.medal_ts = ts_ms()
													if(do_check){
														API.chatLog(`【天选时刻】投喂升级成功`, 'success')
														console.log('do_check',do_check)
														await sleep(5000)//延迟
													}else{
														API.chatLog(`【天选时刻】粉丝勋章等级不符要求：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
														XH++;
														Anchor();
														return;
													}
												}
											}
										}
									}
									if (require_type == 2 && medal_roomid_list_num == -1 && require_value<=4) {//无勋章，获取勋章，且目标勋章等级4以下可升级到
										if(API.CONFIG.AUTO_medal_get_up || bigmoney_to_get_medal){//开启自动
											let BKL_coin_num=await get_BKL_num_bagid()//0：银克拉数，1:银克拉bagid
											let fans_medal_info = true
											await BAPI.fans_medal_info(API.CONFIG.room_ruid[room_ruid_num + 1],API.CONFIG.room_ruid[room_ruid_num]).then(async function (data) {
												if(data.code==0){
													fans_medal_info = data.data.has_fans_medal
													console.log('fans_medal_info',fans_medal_info)
												}
											}, () => {
												API.chatLog(`【天选时刻】勋章数据获取失败！`, 'warning');
											})
											if(BKL_coin_num[0]>0 && !fans_medal_info){//有银克拉
												await BAPI.gift.bag_send(Live_info.uid, 3, API.CONFIG.room_ruid[room_ruid_num + 1], 1, BKL_coin_num[1], Number(API.CONFIG.id_list[XH]), ts_ms()).then(async function (result) {
													if (result.code === 0 && result.msg === 'success') {
														API.chatLog('【银克拉】' + result.data.send_tips, 'success');
														API.chatLog(`【天选时刻】成功投喂银克拉获得粉丝勋章！`, 'success')
														await sleep(5000)//勋章获得可能延迟？
														BAPI.sendLiveDanmu(danmu, Number(API.CONFIG.id_list[XH]))//发送抽奖弹幕，亲密度+100
														await sleep(5000)//弹幕延迟
														if (1 < require_value) {//首次获得勋章的自动升级
															API.chatLog(`【天选时刻】正在升级粉丝勋章！`, 'success')
															let do_check=await API.get_medal_lv_do(Number(API.CONFIG.id_list[XH]),require_value,anchor_uid)
															API.CONFIG.medal_ts = ts_ms()
															API.saveConfig();
															if(do_check){
																console.log('do_check',do_check)
																API.chatLog(`【天选时刻】投喂成功`, 'success')
																await sleep(5000)//延迟
															}
														}
													} else {
														API.chatLog('【银克拉】赠送失败', 'warning');
													}
												});
											}else{
												API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
												XH++;
												Anchor();
												return;
											}
										}else{
											API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
											XH++;
											Anchor();
											return;
										}
									}
									if (require_type == 2 && medal_roomid_list_num == -1 &&require_value>4) {//无勋章，目标勋章等级4以上
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}
									medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(API.CONFIG.id_list[XH])//确认判断是否有勋章
									if (require_type == 2 && medal_roomid_list_num == -1){
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}" target="_blank">直播间</a>`, 'warning',0,API.CONFIG.id_list[XH],true)
										XH++;
										Anchor();
										return;
									}

									if (API.CONFIG.done_room_list.indexOf(API.CONFIG.id_list[XH]) == -1) {
										API.CONFIG.done_room_list.push(API.CONFIG.id_list[XH]); //记录已参加抽奖的房间
										API.CONFIG.done_room_time_list.push(time + ts_s()); //记录已参加抽奖的时间
										API.saveConfig();
									}
									BAPI.room.room_entry_action(API.CONFIG.id_list[XH])
									let unusual_mark = false
									if(API.CONFIG.FollowingList.indexOf(anchor_uid) == -1 && require_type && API.CONFIG.unusual_check){
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													unusual_mark = true
												}
											}
										})
									}
									await BAPI.Lottery.anchor.join(id, gift_id, gift_num).then(async(data) => {
										if (data.code == 0) {
											API.chatLog(`【天选时刻】${API.CONFIG.id_list[XH]}参与成功！`, 'success');
										}else{
											API.chatLog(`【天选时刻】${API.CONFIG.id_list[XH]}参与反馈：${data.message}`, 'warning')
										}
										if (data.code == 400 & gift_num * gift_price != 0) {
											API.chatLog(`金瓜子余额不足!`, 'success');
										}
									});
									if(unusual_mark ){
										await sleep(500)
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													API.chatLog(`【天选时刻】天选时刻关注异常，尝试使用普通关注接口关注！`, 'warning');
													await BAPI.modify(anchor_uid, 1).then(async(data) => {
														if (data.code == 0) {
															API.chatLog(`【天选时刻】使用普通关注接口关注成功！`, 'success');
														}else{
															API.chatLog(`【天选时刻】使用普通关注接口关注成功失败！回传信息：${data.message}`, 'warning');
														}
													})
												}
											}
										})
									}
									if (gift_num * gift_price > 0) {
										API.CONFIG.goldjournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}">${API.CONFIG.id_list[XH]}</a>，奖品：${award_name}，花费金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)//https://live.bilibili.com/
										if (API.CONFIG.goldjournal.length > 500) {
											API.CONFIG.goldjournal.splice(400, 100);
										}
										API.saveConfig();
										console.log(API.CONFIG.goldjournal)
										$('#goldjournal span:eq(0)').text(API.CONFIG.goldjournal)
										let dt = document.getElementById('goldjournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.goldjournal
									}
									if (gift_num * gift_price == 0) {
										API.CONFIG.freejournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${API.CONFIG.id_list[XH]}">${API.CONFIG.id_list[XH]}</a>，奖品：${award_name}`)
										if (API.CONFIG.freejournal.length > 500) {
											API.CONFIG.freejournal.splice(400, 100);
										}
										API.saveConfig();
										//console.log(freejournal)
										$('#freejournal span:eq(0)').text(API.CONFIG.freejournal)
										let dt = document.getElementById('freejournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.freejournal
									}
									API.CONFIG.COUNT_GOLDBOX++;
									$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									API.saveConfig();
									XH++;
									setTimeout(() => {
										Anchor();
									}, 1000);
								}
							};
						}, () => {
							API.chatLog(`【天选时刻】天选数据获取失败，可能风控了，请检查网络或可调出控制台错误信息反馈到群里,将于2分钟后重试！`, 'warning');
							return setTimeout(() => {
								API.CONFIG.Anchor_ts = ts_ms();
								API.saveConfig();
								Anchor();
							}, 2 * 60 * 1000);
						});
					}
				}
				Anchor();
			};
			if ((ts_ms() - API.CONFIG.Anchor_ts) > API.CONFIG.AnchorcheckFLASH * 1000) { //刷新后的巡检间隔判断
				if (API.CONFIG.AUTO_Anchor && API.CONFIG.switch_sever) {
					API.chatLog('检索房间库准备中，60秒后开始检索！', 'success')
					setTimeout(check_Anchor_room, 60e3);
					API.CONFIG.Anchor_ts = ts_ms()
					API.saveConfig();
				}
			} else {
				if (API.CONFIG.AUTO_Anchor && API.CONFIG.switch_sever){
					API.chatLog(`检索房间库准备中，${parseInt((API.CONFIG.AnchorcheckFLASH * 1000 - (ts_ms() - API.CONFIG.Anchor_ts))/1000)}秒后开始检索！`, 'success')
					setTimeout(check_Anchor_room, API.CONFIG.AnchorcheckFLASH * 1000 - (ts_ms() - API.CONFIG.Anchor_ts));
				}
			}
			setInterval(async function () { //防止意外停止重新启动
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE)return;
				if (API.CONFIG.AUTO_Anchor && API.CONFIG.switch_sever && API.CONFIG.Anchor_ts && (ts_ms() - API.CONFIG.Anchor_ts) > (API.CONFIG.AnchorcheckFLASH * 1000 + 1800 * 1000)){
					API.chatLog('天选检索函数长时间未运行，稍后刷新！', 'warning')
					setTimeout(() => {
						window.location.reload();
					}, 5e3);
				}
				if (API.CONFIG.do_lottery_ts && API.CONFIG.AUTO_Anchor && (ts_ms() - API.CONFIG.do_lottery_ts) > (API.CONFIG.AnchorserverFLASH * 1000 + 1800 * 1000)){
					if(API.CONFIG.sever_room_checkbox || API.CONFIG.sever_modle ){
						API.chatLog('获取服务器数据函数长时间未运行，稍后刷新！', 'warning')//
						setTimeout(() => {
							window.location.reload();
						}, 5e3);
					}
				}
				if(API.CONFIG.detail_by_lid_live || API.CONFIG.detail_by_lid_dynamic || API.CONFIG.dynamic_lottery){
					if((ts_ms() - API.CONFIG.detail_by_lid_ts) > (API.CONFIG.detail_by_lid_flash * 1000 + 7200 * 1000)){
						API.chatLog('动态抽奖数据函数长时间未运行，稍后刷新！', 'warning')
						setTimeout(() => {
							window.location.reload();
						}, 5e3);
					}
				}

			}, 300 * 1000);


			let get_AnchorRecord = async function () {
				await BAPI.Lottery.anchor.AnchorRecord(1).then(async (data) => { //只获取第一页
					//console.log(data)
					if (data.data.list.length == 0)return//空，不要
					AnchorRecord_list = data.data.list;
					//console.log('获取最新天选中奖信息', AnchorRecord_list)
					if (AnchorRecord_list.length > 0) {
						anchor_uid = AnchorRecord_list[0].anchor_uid
						let num = API.CONFIG.room_ruid.indexOf(anchor_uid)
						document.getElementById("anchor_uid").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid}`
						document.getElementById("anchor_room").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
						anchor_name = AnchorRecord_list[0].anchor_name
						award_name = AnchorRecord_list[0].award_name
						end_time = AnchorRecord_list[0].end_time
						$('#award span:eq(0)').text(anchor_name);
						$('#award span:eq(1)').text(award_name);
						$('#award span:eq(2)').text(end_time);
					}
					if (AnchorRecord_list.length > 1) {
						anchor_uid1 = AnchorRecord_list[1].anchor_uid
						let num = API.CONFIG.room_ruid.indexOf(anchor_uid1)
						document.getElementById("anchor_uid1").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid1}`
						document.getElementById("anchor_room1").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
						anchor_name1 = AnchorRecord_list[1].anchor_name
						award_name1 = AnchorRecord_list[1].award_name
						end_time1 = AnchorRecord_list[1].end_time
						$('#award span:eq(3)').text(anchor_name1);
						$('#award span:eq(4)').text(award_name1);
						$('#award span:eq(5)').text(end_time1);
					}
					if (AnchorRecord_list.length > 2) {
						anchor_uid2 = AnchorRecord_list[2].anchor_uid
						let num = API.CONFIG.room_ruid.indexOf(anchor_uid2)
						document.getElementById("anchor_uid2").href=`https://message.bilibili.com/#/whisper/mid${anchor_uid2}`
						document.getElementById("anchor_room2").href=`https://live.bilibili.com/${API.CONFIG.room_ruid[num-1]}`
						anchor_name2 = AnchorRecord_list[2].anchor_name
						award_name2 = AnchorRecord_list[2].award_name
						end_time2 = AnchorRecord_list[2].end_time
						$('#award span:eq(6)').text(anchor_name2);
						$('#award span:eq(7)').text(award_name2);
						$('#award span:eq(8)').text(end_time2);
					}
				},async() => {
					console.log('获取最新天选中奖信息失败', AnchorRecord_list)

				});
			};
			let get_awardlist_list = async function (page = 1) {
				await BAPI.Lottery.anchor.awardlist(1).then(async (data) => { //只获取第一页
					//console.log(data)
					if (data.data.list.length == 0)return//空，不要
					awardlist_list = data.data.list;
					//console.log('获取最新实物中奖信息', awardlist_list)
					$('#award span:eq(9)').text(awardlist_list[0].gift_name);
				},async() => {
					console.log('获取最新实物中奖信息失败', awardlist_list)
				});
			};
			await get_AnchorRecord() //获取网络数据
			//console.log('AnchorRecord_list11', AnchorRecord_list, AnchorRecord_list_msg)
			AnchorRecord_list_msg = AnchorRecord_list //初始化本地数据

			await get_awardlist_list() //获取网络数据
			//console.log('awardlist_list11', awardlist_list, awardlist_list_msg)
			awardlist_list_msg = awardlist_list //初始化本地数据

			//console.log('AnchorRecord_list22', AnchorRecord_list, AnchorRecord_list_msg)
			//console.log('awardlist_list22', awardlist_list, awardlist_list_msg)

			setInterval(function () { //中奖播报
				if (read_list.length > 0) {
					if (GM_getValue('read'))
						READ(read_list[0])
					read_list.splice(0, 1);
				}
			}, 10000)
			let check_awardlist_AnchorRecord = async function () { //中奖检查、最新中奖实时显示
				//console.log('AnchorRecord_list1', AnchorRecord_list, AnchorRecord_list_msg)
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				await get_AnchorRecord() //获取网络数据
				//console.log('AnchorRecord_list2', AnchorRecord_list, AnchorRecord_list_msg)
				if(AnchorRecord_list.length==0 && awardlist_list.length==0 )return
				let AnchorRecord_list_id = []
				let AnchorRecord_list_msg_id = []
				let AnchorRecord_list_end_time = []
				for (let i = 0; i < AnchorRecord_list.length; i++) { //当前的id
					AnchorRecord_list_id[i] = AnchorRecord_list[i].id
				}
				for (let i = 0; i < AnchorRecord_list.length; i++) { //当前的time
					AnchorRecord_list_end_time[i] = AnchorRecord_list[i].end_time
				}
				for (let i = 0; i < AnchorRecord_list_msg.length; i++) { //纪录的id
					AnchorRecord_list_msg_id[i] = AnchorRecord_list_msg[i].id
				}

				for (let i = 0; i < AnchorRecord_list.length; i++) {
					if (AnchorRecord_list_msg_id.indexOf(AnchorRecord_list_id[i]) == -1 && turn_time(AnchorRecord_list_end_time[i]) + 45 * 1000 > ts_ms()) { //比对纪录
						await sleep(1000)
						let numb = API.CONFIG.room_ruid.indexOf(AnchorRecord_list[i].anchor_uid)
						if(numb==-1){//无房间号数据
							if (GM_getValue('read'))read_list.push(`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`)
							API.chatLog(`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`, 'success')
							tip(`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}！`)
						}
						if(numb>-1){//有房间号数据
							if (GM_getValue('read'))read_list.push(`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`)
							API.chatLog(`【天选时刻】${Live_info.uname}：恭喜你在<a href="https://live.bilibili.com/${API.CONFIG.room_ruid[numb-1]}" target="_blank">直播间</a>获得奖品${AnchorRecord_list[i].award_name}！`, 'success')
							tip(`【天选时刻】${Live_info.uname}：恭喜你在直播间：${API.CONFIG.room_ruid[numb-1]}获得奖品${AnchorRecord_list[i].award_name}！`)
						}
						BAPI.anchor_postdiscuss(`【天选时刻】${Xname}：${AnchorRecord_list[i].award_name}`,server_cv_list[3]).then(async(data) => {
							console.log('anchor_postdiscuss',data)
							if(data.code==0){
								API.CONFIG.congratulations_rpid_ct.push(data.data.reply.rpid)
								API.CONFIG.congratulations_rpid_ct.push(data.data.reply.ctime)
								API.saveConfig()
							}
						})
						const post_data = {id:ts_ms(),room_id:Live_info.uid,data:`【天选时刻】${Xname}：${AnchorRecord_list[i].award_name}`}
						post_data_to_server(post_data,qun_server[0]).then((data) => {
							console.log('post_data_to_server',data)
						})

						API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：【天选时刻】：${AnchorRecord_list[i].award_name}<a target="_blank" href="https://live.bilibili.com/${API.CONFIG.room_ruid[numb-1]}">直播间</a>`)
						API.saveConfig()
						$('#freejournal7 span:eq(0)').text(API.CONFIG.freejournal7)
						let dt = document.getElementById('freejournal7'); //通过id获取该div
						dt.innerHTML  = API.CONFIG.freejournal7
						if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
							qq(API.CONFIG.qq2,`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`,API.CONFIG.go_cqhttp);
						}
						if(API.CONFIG.qqbot && qq_run_mark){
							qq(API.CONFIG.qq,`【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`,qun_server[1]);
						}
						if (API.CONFIG.switch_ServerChan_SCKEY) {
							ServerChan2(API.CONFIG.ServerChan_SCKEY, `【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`);
						}
						if (API.CONFIG.switch_Qmsg_KEY) {
							qmsg(API.CONFIG.Qmsg_KEY, `【天选时刻】${Live_info.uname}：${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）！`);
						}
						if (API.CONFIG.switch_push_KEY) {
							pushmsg(API.CONFIG.push_KEY, `【天选时刻】${Live_info.uname}：恭喜你获得奖品${AnchorRecord_list[i].award_name}（房间号：${API.CONFIG.room_ruid[numb-1]}）`);
						}
						if (API.CONFIG.anchor_danmu && numb>-1) {//有房间号数据
							let ii = Math.ceil(Math.random() * (API.CONFIG.anchor_danmu_content.length))
							BAPI.sendLiveDanmu(API.CONFIG.anchor_danmu_content[ii - 1], API.CONFIG.room_ruid[numb - 1]).then(async(data) => {
								if(data.code==0){
									API.chatLog(`【中奖弹幕】直播间房间号：${API.CONFIG.room_ruid[numb - 1]}发送成功！`, 'success');
								}else{
									API.chatLog(`【中奖弹幕】直播间房间号：${API.CONFIG.room_ruid[numb - 1]}发送：${data.message}`, 'warning');
								}
							})
						}
						if (API.CONFIG.anchor_msg) {
							let anchor_uid = AnchorRecord_list[i].anchor_uid
							let ii = Math.ceil(Math.random() * (API.CONFIG.anchor_msg_content.length))
							let send = async function () {
								const msg = {
									sender_uid: Live_info.uid,
									receiver_id: anchor_uid,
									receiver_type: 1,
									msg_type: 1,
									msg_status: 0,
									content: `{"content":"` + API.CONFIG.anchor_msg_content[ii - 1] + `"}`,
									dev_id: getMsgDevId()
								}
								BAPI.sendMsg(msg).then((data) => {
									console.log('sendMsg', getMsgDevId())
									console.log('sendMsg', data)
									if (data.code == -400)
										return delayCall(() => send());
								})
							}
							send()
						}
					}
				}
				AnchorRecord_list_msg = AnchorRecord_list //更新网络数据到本地数据
				//console.log('awardlist_list1', awardlist_list, awardlist_list_msg)
				await get_awardlist_list() //获取网络数据
				if(awardlist_list.length==0 )return
				//console.log('awardlist_list2', awardlist_list, awardlist_list_msg)
				let awardlist_list_id = []
				let awardlist_list_msg_id = []
				let awardlist_list_create_time = []
				for (let i = 0; i < awardlist_list.length; i++) { //当前的id
					awardlist_list_id[i] = awardlist_list[i].id
				}
				for (let i = 0; i < awardlist_list.length; i++) { //当前的time
					awardlist_list_create_time[i] = awardlist_list[i].create_time
				}
				for (let i = 0; i < awardlist_list_msg.length; i++) { //纪录的id
					awardlist_list_msg_id[i] = awardlist_list_msg[i].id
				}

				for (let i = 0; i < awardlist_list.length; i++) {
					if (awardlist_list_msg_id.indexOf(awardlist_list_id[i]) == -1 && turn_time(awardlist_list_create_time[i]) + 45 * 1000 > ts_ms()) {
						if (GM_getValue('read'))read_list.push(`【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`)
						API.chatLog(`【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`, 'success')
						tip(`【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`)
						BAPI.anchor_postdiscuss(`【实物宝箱】${Xname}：${awardlist_list[0].gift_name}`,server_cv_list[3]).then(async(data) => {
							console.log('anchor_postdiscuss',data)
							if(data.code==0){
								API.CONFIG.congratulations_rpid_ct.push(data.data.reply.rpid)
								API.CONFIG.congratulations_rpid_ct.push(data.data.reply.ctime)
								API.saveConfig()
							}
						})
						const post_data = {id:ts_ms(),room_id:Live_info.uid,data:`【实物宝箱】${Xname}：${awardlist_list[0].gift_name}`}
						post_data_to_server(post_data,qun_server[0]).then((data) => {
							console.log('post_data_to_server',data)
						})
						API.CONFIG.freejournal7.unshift(`<br>${timestampToTime(ts_s())}：【实物宝箱】：${awardlist_list[0].gift_name}<a target="_blank" href="https://link.bilibili.com/p/center/index/user-center/my-info/award#/user-center/my-info/award">页面</a>`)
						API.saveConfig()
						let dt = document.getElementById('freejournal7'); //通过id获取该div
						dt.innerHTML  = API.CONFIG.freejournal7

						if (API.CONFIG.switch_ServerChan_SCKEY) {
							ServerChan2(API.CONFIG.ServerChan_SCKEY, `【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`);
						}
						if (API.CONFIG.switch_Qmsg_KEY) {
							qmsg(API.CONFIG.Qmsg_KEY, `【实物宝箱】${Live_info.uname}：${awardlist_list[0].gift_name}！`);
						}
						if (API.CONFIG.switch_push_KEY) {
							pushmsg(API.CONFIG.push_KEY, `【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`);
						}
						if(API.CONFIG.qqbot && qq_run_mark){
							qq(API.CONFIG.qq,`【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`,qun_server[1]);
						}
						if(API.CONFIG.switch_go_cqhttp && API.CONFIG.go_cqhttp && API.CONFIG.qq2){
							qq(API.CONFIG.qq2,`【实物宝箱】${Live_info.uname}：恭喜你获得${awardlist_list[0].gift_name}！`,API.CONFIG.go_cqhttp);
						}
					}
				}
				awardlist_list_msg = awardlist_list //更新网络数据到本地数据
				//console.log('AnchorRecord_list2', AnchorRecord_list, AnchorRecord_list_msg)
				//console.log('awardlist_list2', awardlist_list, awardlist_list_msg)
			}
			setInterval(async() => check_awardlist_AnchorRecord(), 20 * 1000);

			setInterval(async function () {//自发自删

				if(API.CONFIG.congratulations_rpid_ct.length>0 && API.CONFIG.congratulations_rpid_ct[1]+100<ts_s())
					BAPI.Lottery.anchor.deldiscusss5(API.CONFIG.congratulations_rpid_ct[0],server_cv_list[3]).then(async (data) =>{
						if(data.code==0 || data.code==12022){
							API.CONFIG.congratulations_rpid_ct.splice(0,2)
						}
					})


				if(API.CONFIG.showlive_discusss.length>0 && API.CONFIG.showlive_discusss[1]+100<ts_s())
					BAPI.Lottery.anchor.deldiscusss5(API.CONFIG.showlive_discusss[0],server_cv_list[4]).then(async (data) =>{
						if(data.code==0 || data.code==12022){
							API.CONFIG.showlive_discusss.splice(0,2)
						}
					})

				for(let i = 0; i < API.CONFIG.key_rpid.length; i++) {//服务器上传评论自发自删
					if(API.CONFIG.key_ctime[i]+500<ts_s()){
						BAPI.Lottery.anchor.deldiscusss5(API.CONFIG.key_rpid[i],server_cv_list[0]).then(async (data) =>{
							//console.log('deldiscusss',data)
							if(data.code == 0 || data.code==12022){
								API.CONFIG.key_rpid.splice(i,1)
								API.CONFIG.key_ctime.splice(i,1)
								i--
							}
						})

					}
				}
				for(let i = 0; i < API.CONFIG.key_rpid2.length; i++) {//服务器上传评论自发自删
					if(API.CONFIG.key_ctime2[i]+500<ts_s()){
						BAPI.Lottery.anchor.deldiscusss5(API.CONFIG.key_rpid2[i],server_cv_list[1]).then(async (data) =>{
							//console.log('deldiscusss',data)
							if(data.code == 0 || data.code==12022){
								API.CONFIG.key_rpid2.splice(i,1)
								API.CONFIG.key_ctime2.splice(i,1)
								i--
							}
						})

					}
				}
				for(let i = 0; i < API.CONFIG.key_rpid3.length; i++) {//服务器上传评论自发自删
					if(API.CONFIG.key_ctime3[i]+500<ts_s()){
						BAPI.Lottery.anchor.deldiscusss5(API.CONFIG.key_rpid3[i],server_cv_list[2]).then(async (data) =>{
							//console.log('deldiscusss',data)
							if(data.code == 0 || data.code==12022){
								API.CONFIG.key_rpid3.splice(i,1)
								API.CONFIG.key_ctime3.splice(i,1)
								i--
							}
						})

					}
				}
				API.saveConfig()
			},30e3)


			let get_Anchor_ignore_keyword = async function () {
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				let keyword = []
				let get_gitee_ignore_keyword = async function () {
					if(API.CONFIG.gitee_url == '0' || !API.CONFIG.gitee_url)return API.chatLog(`【屏蔽词/房】无云数据地址！`,'warning');
					let gitee_ignore_keyword = await getMyJson(API.CONFIG.gitee_url);
					if(gitee_ignore_keyword[0]== undefined){
						API.chatLog(`无云数据或获取异常！`,'warning');
					}else{
						keyword = gitee_ignore_keyword
					}
				}

				let get_discusss_ignore_keyword = async function () {
					if(API.CONFIG.anchor_postdiscuss == '0' || !API.CONFIG.anchor_postdiscuss)return API.chatLog(`【屏蔽词/房】无专栏地址！`,'warning');
					BAPI.getdiscusss(API.CONFIG.anchor_postdiscuss).then(async(data) => {
						let replies = data.data.replies
						let uppermid = data.data.upper.mid
						for (let i = 0; i < replies.length; i++) { //拼接
							if (replies[i].mid == uppermid)
								keyword = keyword.concat((replies[i].content.message).split(","))
						}
					})
				}
				//console.log('keyword', keyword)
				await get_gitee_ignore_keyword()
				//console.log('get_gitee_ignore_keyword', keyword)
				await get_discusss_ignore_keyword()
				//console.log('get_discusss_ignore_keyword', keyword)
				for (let i = 0; i < keyword.length; i++) { //评论去重、分类、去空格、去空、转小写
					if (API.CONFIG.Anchor_ignore_keyword.indexOf(keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && isNaN(Number(keyword[i])) && Number(keyword[i])!=0) { //非数字则为屏蔽词
						API.CONFIG.Anchor_ignore_keyword.push(keyword[i].replaceAll(' ', '').toLowerCase())
					}
					if (!isNaN(Number(keyword[i])) && API.CONFIG.Anchor_ignore_uid.indexOf(Number(keyword[i])) == -1 && Number(keyword[i])!=0) { //数字则为屏蔽房
						API.CONFIG.Anchor_ignore_uid.push(Number(keyword[i]))
					}
				}
				if (API.CONFIG.Anchor_ignore_keyword.length > 1 && API.CONFIG.Anchor_ignore_keyword.indexOf('不会吧不会吧居然真有人什么都不过滤') > -1) { //去掉默认值
					API.CONFIG.Anchor_ignore_keyword.splice(API.CONFIG.Anchor_ignore_keyword.indexOf('不会吧不会吧居然真有人什么都不过滤'), 1);
				}
				if (API.CONFIG.Anchor_ignore_uid.length > 1 && API.CONFIG.Anchor_ignore_uid.indexOf(1234567890) > -1) { //去掉默认值
					API.CONFIG.Anchor_ignore_uid.splice(API.CONFIG.Anchor_ignore_uid.indexOf(1234567890), 1);
				}
				let word=[]
				for (let i = 0; i < API.CONFIG.Anchor_ignore_keyword.length; i++) {//本地去重、去空格、去空、转小写
					if (word.indexOf(API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase()) == -1 && API.CONFIG.Anchor_ignore_keyword[i] && Number(API.CONFIG.Anchor_ignore_keyword[i]) != 0) {
						word.push(API.CONFIG.Anchor_ignore_keyword[i].replaceAll(' ', '').toLowerCase())
					}
				}
				API.CONFIG.Anchor_ignore_keyword = word
				word=[]
				for (let i = 0; i < API.CONFIG.Anchor_ignore_uid.length; i++) {//本地去重、去空格、去空
					if (word.indexOf(Number(API.CONFIG.Anchor_ignore_uid[i])) == -1 && API.CONFIG.Anchor_ignore_uid[i] && Number(API.CONFIG.Anchor_ignore_uid[i]) != 0) {
						word.push(Number(API.CONFIG.Anchor_ignore_uid[i]))
					}
				}
				for (let i = 0; i < word.length; i++) {//屏蔽房间取关
					let num = API.CONFIG.room_ruid.indexOf(word[i])
					if (num == -1){
						await BAPI.live_user.get_anchor_in_room(word[i]).then(async(da) => {
							if(da.code==0 && da.data.info !== undefined){
								let anchor_uid = da.data.info.uid;
								API.CONFIG.room_ruid.push(word[i])
								API.CONFIG.room_ruid.push(anchor_uid)
							}else{
								API.chatLog(`【屏蔽词/房】直播间房间号：${word[i]}可能不存在！`, 'warning');
							}
						}, () => {
							API.chatLog(`【屏蔽词/房】直播间用户UID获取失败！`, 'warning');
						})
					}
					if (num > -1 && API.CONFIG.ALLFollowingList.indexOf(API.CONFIG.room_ruid[num+1]) > -1) {
						BAPI.modify(API.CONFIG.room_ruid[num+1], 2)
						API.chatLog(`【屏蔽词/房】屏蔽房取关成功：${word[i]}`, 'success');
						await sleep(1000)
					}
				}
				API.CONFIG.Anchor_ignore_uid = word
				API.saveConfig();
				API.chatLog(`从专栏评论/云数据更新屏蔽词：${API.CONFIG.Anchor_ignore_keyword}`, 'success');
				API.chatLog(`从专栏评论/云数据更新屏蔽房：${API.CONFIG.Anchor_ignore_uid}`, 'success');
			}

			setTimeout(async() => {
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				if (API.CONFIG.anchor_postdiscuss_switch)
					get_Anchor_ignore_keyword()
			}, 20e3);
			setInterval(async() => {
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				if (API.CONFIG.anchor_postdiscuss_switch)
					get_Anchor_ignore_keyword()
			}, 600e3);
			let cv_num=0
			setInterval(async function () { //推送天选，改为可推送多个天选
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					return
				};
				//console.log('当前本地推送数据', updata)
				let pushlist=[]
				for (let i = 0; i < API.CONFIG.updata.length; i=i+3) {
					if(pushlist.indexOf(API.CONFIG.updata[i+1])>-1 || pushlist.indexOf(API.CONFIG.updata[i])>-1 || Math.abs(ts_ten_m() - API.CONFIG.updata[i+2]) > 1 )continue
					pushlist.push(API.CONFIG.updata[i]);
					pushlist.push(API.CONFIG.updata[i+1]);
					pushlist.push(API.CONFIG.updata[i+2]);
				}
				API.CONFIG.updata = pushlist
				if (API.CONFIG.updata.length > 60) {
					API.CONFIG.updata.splice(30, 666);
					console.log('减少推送数据', API.CONFIG.updata)
					API.saveConfig()
				}
				if (Anchor_room_list.length > 0) {
					let title_update = async function (oid,cv_num_mark) {
						if(Anchor_room_list.length ==Anchor_award_id_list.length && Anchor_award_nowdate.length == Anchor_award_id_list.length){
							//上传数据长度正常
						}else{
							console.log('上传数据长度异常')
							Anchor_room_list = []
							Anchor_award_id_list = []
							Anchor_award_nowdate = []
						}
						let len = Anchor_room_list.length; //防止返回检查上传数据的延迟时，误删新加数据
						for (let ww = 0; ww < len; ww++) { //去重复
							if (API.CONFIG.updata.indexOf(Anchor_award_id_list[ww]) > -1)
								continue;
							API.CONFIG.updata.unshift(Anchor_room_list[ww], Anchor_award_id_list[ww], Anchor_award_nowdate[ww]);
						}
						if(API.CONFIG.updata.length % 3 == 0){
							//3整除，正常
						}else{
							console.log('上传数据长度异常')
							API.CONFIG.updata = []
						}
						API.saveConfig()
						let updata_turn = []
						for (let t = 0; t < API.CONFIG.updata.length; t++) {
							let str = API.CONFIG.updata[t]//寅、卯、辰、巳、午、未、申、酉、戌、亥
							let hhh = str.toString().replace(/0/g, "寅").replace(/1/g, "卯").replace(/2/g, "辰").replace(/3/g, "巳").replace(/4/g, "午").replace(/5/g, "未").replace(/6/g, "申").replace(/7/g, "酉").replace(/8/g, "戌").replace(/9/g, "亥")
							updata_turn.push(hhh)
						}

						//console.log('转换后推送', updata_turn)
						API.chatLog(`【天选时刻服务器】正在推送到群主的专栏新增的天选直播间${len}个！`)
						BAPI.anchor_postdiscuss(`${updata_turn}`,oid).then(async(data) => {//5348728
							console.log('anchor_postdiscuss',data)
							if(data.code==0){
								API.chatLog(`【天选时刻服务器】推送到群主的专栏新增的天选直播间${len}个成功！`)
								if(cv_num_mark==1){
									API.CONFIG.key_rpid.push(data.data.reply.rpid)
									API.CONFIG.key_ctime.push(data.data.reply.ctime)
								}
								if(cv_num_mark==2){
									API.CONFIG.key_rpid2.push(data.data.reply.rpid)
									API.CONFIG.key_ctime2.push(data.data.reply.ctime)
								}
								if(cv_num_mark==3){
									API.CONFIG.key_rpid3.push(data.data.reply.rpid)
									API.CONFIG.key_ctime3.push(data.data.reply.ctime)
								}
								API.saveConfig()
							}else{
								API.chatLog(`【天选时刻服务器】群主的专栏【${oid}】异常数据回传：${data.code},${data.message}`)
							}
							Anchor_room_list.splice(0, len);
							Anchor_award_id_list.splice(0, len);
							Anchor_award_nowdate.splice(0, len);
						})
					}
					title_update(server_cv_list[cv_num],cv_num+1);
					if(cv_num<2){
						cv_num++
					}else if(cv_num>=2){
						cv_num=0
					}
				}
			}, 10e3);
			let do_lottery_room_list = []
			let do_lottery_id_list = []
			let do_lottery = async function () {
				API.CONFIG.do_lottery_ts = ts_ms()
				API.saveConfig();
				if (inTimeArea(API.CONFIG.TIMEAREASTART, API.CONFIG.TIMEAREAEND) && API.CONFIG.TIMEAREADISABLE) { //判断时间段
					setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);
					return
				};
				if (!API.CONFIG.AUTO_Anchor)
					return;
				//总开关
				do_lottery_room_list = []
				do_lottery_id_list = []
				await check_data_from_server(qun_server[0])
				await get_lottery(server_cv_list[0],1)
				API.CONFIG.do_lottery_ts = ts_ms()
				await get_lottery(server_cv_list[1],2)
				API.CONFIG.do_lottery_ts = ts_ms()
				await get_lottery(server_cv_list[2],3)
				API.CONFIG.do_lottery_ts = ts_ms()
				if(Live_info.room_id==2374828 && Live_info.uid==20842051 && upupup.length && turn_key_list.length){
					if(upupup.length>300)upupup.splice(300, 66666);
					let str
					for(let i=0;i<upupup.length;i++){
						let hhh = upupup[i]
						let bbb = hhh.toString().replaceAll("0", turn_key_list[0]).replaceAll("1", turn_key_list[1]).replaceAll("2", turn_key_list[2]).replaceAll("3", turn_key_list[3]).replaceAll("4", turn_key_list[4]).replaceAll("5", turn_key_list[5]).replaceAll("6", turn_key_list[6]).replaceAll("7", turn_key_list[7]).replaceAll("8", turn_key_list[8]).replaceAll("9", turn_key_list[9])
						if(i == 0){
							str = bbb
						}else{
							str = str + '，' + bbb
						}
					}
					BAPI.Lottery.anchor.description_update(`${str}`, Live_info.room_id).then(function (data) {
						if(data.code==0){
							upupup = []
							API.chatLog(`【天选时刻】更新到个人简介成功！`)
						}else{
							console.log(`更新到个人简介`,data);
						}
					})
				}else{
					upupup = []
				}
				await do_lottery_two()
				API.CONFIG.do_lottery_ts = ts_ms()
				API.saveConfig();

				setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);
			}
			setTimeout(async() => do_lottery(), API.CONFIG.AnchorserverFLASH * 1000);


			let check_data_from_server = async function (url) {
				if(!API.CONFIG.get_data_from_server)return
				//获取服务器数据
				get_data_from_server(url).then(async(data) => {
					console.log('get_data_from_server',data)
					if(data.length==0 || data[0].id == undefined || data[0].room_id == undefined)return
					for(let i=0;i<data.length;i++){
						if(data[i].id >= 888888888888)continue
						let num9 = API.CONFIG.done_id_list.indexOf(data[i].id)
						if (num9 > -1) {
							//console.log(`${data[i].id}已参与的抽奖的序号id`);
							continue;
						}
						let num1 = API.CONFIG.Anchor_ignore_uid.indexOf(data[i].room_id)
						if ( num1 > -1) {
							//console.log(`${data[i].room_id}屏蔽的直播间房间号`);
							//API.chatLog(`【天选时刻】${data[i].room_id}屏蔽的直播间房间号，舍弃！`)
							continue;
						}

						let roomlist_data = JSON.parse(data[i].data)
						console.log('天选数据',roomlist_data)
						if (ts_s()>roomlist_data.current_time + roomlist_data.time) { //超时
							//console.log(`${roomlist_data.id}已超时的抽奖的序号id`);
							continue;
						}

						let room_id = roomlist_data.room_id
						let id = roomlist_data.id
						let time = roomlist_data.time-(ts_s()-roomlist_data.current_time)
						let gift_price = roomlist_data.gift_price
						let gift_id = roomlist_data.gift_id
						let gift_num = roomlist_data.gift_num
						let require_type = roomlist_data.require_type
						let require_text = roomlist_data.require_text
						let award_name = roomlist_data.award_name;
						let require_value = roomlist_data.require_value
						let cur_gift_num = roomlist_data.cur_gift_num
						let danmu = roomlist_data.danmu
						if(time<=0)continue
						API.CONFIG.freejournal4.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}，条件：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
						if (API.CONFIG.freejournal4.length > 1000) {
							API.CONFIG.freejournal4.splice(900, 100);
						}
						$('#freejournal4 span:eq(0)').text(API.CONFIG.freejournal4);
						let dt = document.getElementById('freejournal4'); //通过id获取该div
						dt.innerHTML  = API.CONFIG.freejournal4

						API.CONFIG.done_id_list.push(id);
						if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
						API.CONFIG.room_AnchorRecord_time.push(room_id); //记录天选开启的时间
						API.CONFIG.room_AnchorRecord_time.push(ts_s());
						API.saveConfig()
						API.chatLog(`【天选时刻】服务器数据：<a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>，奖品：${award_name}，要求：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`,'success',time)
						if (require_type == 3) { //1关注，2粉丝勋章，3大航海:3舰长2提督1总督| console.log('生效大航海房间',guardroom);console.log('生效大航海等级',guard_level);console.log('生效大航海等级',guardroom_activite);
							let guardroom_num = API.CONFIG.guardroom.indexOf(room_id)
							if (guardroom_num < 0) {
								API.chatLog(`【天选时刻】无大航海身份：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
								continue;
							}
							if (guardroom_num > -1 & API.CONFIG.guardroom_activite[guardroom_num] == 1 & API.CONFIG.guard_level[guardroom_num] <= require_value) {
								console.log('大航海', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
							} else {
								API.chatLog(`【天选时刻】大航海身份不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
								continue;
							}
						}
						if (require_type == 4 && Live_info.user_level < require_value) { //直播等级
							API.chatLog(`【天选时刻】直播等级不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						if (require_type == 5 && Live_info.Blever < require_value) { //5主站等级Live_info.Blever
							API.chatLog(`【天选时刻】主站等级不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						if (require_type >= 6) { //未知
							API.chatLog(`【天选时刻】含有未知要求：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						if (gift_price * gift_num > API.CONFIG.gift_price) { //金瓜子判断
							API.chatLog(`【天选时刻】金瓜子超出设置：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						if (API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
							let now_key=''
							for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
								if(award_name.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
									now_key=API.CONFIG.Anchor_ignore_keyword[i]
									break
								}
							}
							API.CONFIG.journal_pb.unshift(`<br>${timestampToTime(ts_s())}：【天选时刻】过滤关键词：${now_key}：奖品：${award_name}：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间：${room_id}</a>`)
							if (API.CONFIG.journal_pb.length > 500) {
								API.CONFIG.journal_pb.splice(400, 100);
							}
							API.saveConfig();
							$('#journal_pb span:eq(0)').text(API.CONFIG.journal_pb)
							let dt = document.getElementById('journal_pb'); //通过id获取该div
							dt.innerHTML  = API.CONFIG.journal_pb
							API.chatLog(`【天选时刻】过滤关键词：${now_key}：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						let money = []
						if (API.CONFIG.money_switch || API.CONFIG.no_money_checkbox) {
							money = await moneyCheck(award_name);
							console.log('识别到的奖品金额', money)
						}
						if (money[0] && money[1] < API.CONFIG.money_min) {
							API.chatLog(`奖品金额低于设置值：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true);
							continue;
						}
						if (API.CONFIG.no_money_checkbox && money[0]==false && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
							API.chatLog(`未识别到现金及正则：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true);
							continue;
						}
						let bigmoney_to_get_medal = 0
						if(API.CONFIG.bigmoney_switch && money[0] && API.CONFIG.bigmoney <= money[1] ){
							bigmoney_to_get_medal = 1
							await sleep(50)
						}
						if(API.CONFIG.unignore_to_get_medal_switch){
							if(API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
								bigmoney_to_get_medal = 1
								await sleep(50)
							}
						}
						await sleep(50)
						let fansnum = 0,
							anchor_uid = 0
						let room_ruid_num = API.CONFIG.room_ruid.indexOf(room_id)
						if (API.CONFIG.fans_switch || API.CONFIG.Anchor_Followings_switch || API.CONFIG.AUTO_medal_get_up || API.CONFIG.AUTO_medal_up || API.CONFIG.unusual_check) { //粉丝数量判断、只参与关注的主播抽奖、勋章抽奖需要的
							if (room_ruid_num > -1) {
								anchor_uid = API.CONFIG.room_ruid[room_ruid_num + 1]
							}
							if (room_ruid_num < 0) {
								await sleep(500)
								let anchor_uid_mark = 0
								await BAPI.live_user.get_anchor_in_room(room_id).then(async(data) => {
									if(data.code==0 && data.data.info !== undefined){
										anchor_uid = data.data.info.uid;
										API.CONFIG.room_ruid.push(room_id)
										API.CONFIG.room_ruid.push(anchor_uid)
										API.saveConfig()
									}else{
										anchor_uid_mark = 1
									}
								}, () => {
									API.chatLog(`【天选时刻】anchor_uid获取失败，跳过当前直播间！`, 'warning');
									anchor_uid_mark = 1
								});
								if (anchor_uid_mark) {
									continue;
								}
							}
						}

						if (API.CONFIG.fans_switch) { //粉丝数量判断
							await BAPI.web_interface_card(anchor_uid).then(async(data) => {
								fansnum = data.data.follower
								console.log('粉丝数量', fansnum)
							}, () => {
								API.chatLog(`【天选时刻】粉丝数量获取失败，可能风控了！<br><a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>，跳过不参加抽奖！`, 'warning',0,room_id,true);
							})
						}
						if (API.CONFIG.fans_switch && fansnum == 0) { //粉丝数量风控判断
							continue
						}
						if (API.CONFIG.fans_switch & fansnum < API.CONFIG.fans_min) { //粉丝数量判断
							API.chatLog(`<a href="https://live.bilibili.com/${room_id}"target="_blank">直播间：${room_id}</a>抽奖主播粉丝数${fansnum}小于设置${API.CONFIG.fans_min}，不参加抽奖！`, 'warning',0,room_id,true);
							continue;
						}
						if (API.CONFIG.Anchor_Followings_switch & API.CONFIG.FollowingList.indexOf(anchor_uid) == -1) { //开启只参与关注的主播抽奖
							API.chatLog(`不参与非关注主播的抽奖!`, 'warning',0,room_id,true);
							continue;
						}

						let medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(room_id)//是否有勋章
						room_ruid_num = API.CONFIG.room_ruid.indexOf(room_id)//是否有room-uid数据

						if (require_type == 2 && medal_roomid_list_num > -1) { //已有勋章的自动升级
							if (API.CONFIG.medal_level_list[medal_roomid_list_num] < require_value) {
								if(require_value>=20){
									API.chatLog(`【天选时刻】勋章等级要求：${require_value}，小心心无法升级！粉丝勋章等级不符要求：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
									continue;
								}
								if(require_value<20){
									if(API.CONFIG.AUTO_medal_up){
										API.chatLog(`【天选时刻】正在尝试升级粉丝勋章！`, 'success')
										BAPI.sendLiveDanmu(danmu, room_id)//发送抽奖弹幕，亲密度+100
										await sleep(5000)//弹幕延迟
										let do_check = await API.get_medal_lv_do(room_id,require_value,anchor_uid)
										API.CONFIG.medal_ts = ts_ms()
										API.saveConfig();
										if(do_check){
											API.chatLog(`【天选时刻】投喂升级成功`, 'success')
											console.log('do_check',do_check)
											await sleep(5000)//延迟
										}else{
											API.chatLog(`【天选时刻】粉丝勋章等级不符：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
											continue;
										}
									}
								}
							}
						}

						if (require_type == 2 && medal_roomid_list_num == -1 && require_value<=4) {//无勋章，获取勋章，且目标勋章等级4以下可升级到
							console.log('bigmoney_to_get_medal',bigmoney_to_get_medal)
							if(API.CONFIG.AUTO_medal_get_up || bigmoney_to_get_medal){//开启自动
								let BKL_coin_num=await get_BKL_num_bagid()//0：银克拉数，1:银克拉bagid
								let fans_medal_info = true
								await BAPI.fans_medal_info(API.CONFIG.room_ruid[room_ruid_num + 1],API.CONFIG.room_ruid[room_ruid_num]).then(async function (data) {
									if(data.code==0){
										fans_medal_info = data.data.has_fans_medal
										console.log('fans_medal_info',fans_medal_info)
									}
								}, () => {
									API.chatLog(`【天选时刻】勋章数据获取失败！`, 'warning');
								})
								if(BKL_coin_num[0]>0 && !fans_medal_info){//有银克拉
									await BAPI.gift.bag_send(Live_info.uid, 3, API.CONFIG.room_ruid[room_ruid_num + 1], 1, BKL_coin_num[1], room_id, ts_ms()).then(async function (result) {
										if (result.code === 0 && result.msg === 'success') {
											API.chatLog('【银克拉】' + result.data.send_tips, 'success');
											API.chatLog(`【天选时刻】成功投喂银克拉获得粉丝勋章！`, 'success')
											await sleep(5000)//勋章获得可能延迟？
											BAPI.sendLiveDanmu(danmu, room_id)//发送抽奖弹幕，亲密度+100
											await sleep(5000)//弹幕延迟
											if (1 < require_value) {//首次获得勋章的自动升级
												API.chatLog(`【天选时刻】正在升级粉丝勋章！`, 'success')
											}
											let do_check=await API.get_medal_lv_do(room_id,require_value,anchor_uid)
											API.CONFIG.medal_ts = ts_ms()
											API.saveConfig();
											if(do_check){
												API.chatLog(`【天选时刻】投喂成功`, 'success')
												console.log('do_check',do_check)
												await sleep(5000)//延迟
											}
										} else {
											API.chatLog('【银克拉】赠送失败', 'warning');
										}
									});
								}else{
									API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
									continue;
								}
							}else{
								API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
								continue;
							}
						}
						if (require_type == 2 && medal_roomid_list_num == -1 &&require_value>4) {//无勋章，目标勋章等级4以上
							API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}

						medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(room_id)//确认判断是否有勋章
						if (require_type == 2 && medal_roomid_list_num == -1){
							API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${room_id}" target="_blank">直播间</a>`, 'warning',0,room_id,true)
							continue;
						}
						if (API.CONFIG.done_room_list.indexOf(room_id) == -1) {
							API.CONFIG.done_room_list.push(room_id); //记录已参加抽奖的房间
							API.CONFIG.done_room_time_list.push(time + ts_s()); //记录已参加抽奖的时间
						}
						//API.chatLog(`【天选时刻】正在参与群主的专栏【${oid}】推送的直播间：${valArray[0]}，奖品：${award_name}的抽奖！`)
						API.CONFIG.COUNT_GOLDBOX++;
						$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
						$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
						API.saveConfig();

						BAPI.room.room_entry_action(room_id)
						await sleep(100)
						let unusual_mark = false
						if(API.CONFIG.FollowingList.indexOf(anchor_uid) == -1 && require_type && API.CONFIG.unusual_check){
							await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
								if (data.code == 0) {
									if(!data.data.follow){
										unusual_mark = true
									}
								}
							})
						}
						await BAPI.Lottery.anchor.join(id, gift_id, gift_num).then(async(data) => {
							if (data.code == 0) {
								API.chatLog(`【天选时刻】${room_id}参与成功！`, 'success');
							}else{
								API.chatLog(`【天选时刻】${room_id}参与反馈：${data.message}`, 'warning')
							}
							if (data.code == 400 & gift_num * gift_price != 0) {
								API.chatLog(`金瓜子余额不足!`, 'warning');
							}
						});
						if(unusual_mark ){
							await sleep(500)
							await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
								if (data.code == 0) {
									if(!data.data.follow){
										API.chatLog(`【天选时刻】天选时刻关注异常，尝试使用普通关注接口关注！`, 'warning');
										await BAPI.modify(anchor_uid, 1).then(async(data) => {
											if (data.code == 0) {
												API.chatLog(`【天选时刻】使用普通关注接口关注成功！`, 'success');
											}else{
												API.chatLog(`【天选时刻】使用普通关注接口关注成功失败！回传信息：${data.message}`, 'warning');
											}
										})
									}
								}
							})
						}
						if (gift_num * gift_price > 0) {
							API.CONFIG.goldjournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}，花费金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
							if (API.CONFIG.goldjournal.length > 500) {
								API.CONFIG.goldjournal.splice(400, 100);
							}
							console.log(API.CONFIG.goldjournal)
							API.saveConfig()
							$('#goldjournal span:eq(0)').text(API.CONFIG.goldjournal)
							let dt = document.getElementById('goldjournal'); //通过id获取该div
							dt.innerHTML  = API.CONFIG.goldjournal
						}
						if (gift_num * gift_price == 0) {
							API.CONFIG.freejournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${room_id}">${room_id}</a>，奖品：${award_name}`)
							if (API.CONFIG.freejournal.length > 500) {
								API.CONFIG.freejournal.splice(400, 100);
							}
							API.saveConfig()
							$('#freejournal span:eq(0)').text(API.CONFIG.freejournal)
							let dt = document.getElementById('freejournal'); //通过id获取该div
							dt.innerHTML  = API.CONFIG.freejournal
						}
					}
					//获取服务器数据
				}, () => {
					API.chatLog(`【天选时刻】服务器数据获取失败，检查网络或服务器状态！`, 'warning');
				})
			}


			var sever_room = 2374828
			let do_lottery_two_stop = true
			let do_lottery_two = async function () {
				if(!do_lottery_two_stop)return
				if(!API.CONFIG.sever_room_checkbox)return
				await BAPI.Lottery.anchor.getRoomBaseInfo(sever_room).then(async(data) => {
					if(data.data.by_room_ids[sever_room] == undefined)return
					let title = data.data.by_room_ids[sever_room].description;
					//console.log(`群主直播间简介:${title}`);
					let valArray_demo = [];
					valArray_demo = title.split("，");//英文,经常失败？？？
					let valArray = [];
					if(turn_key_list.length==0)return
					for (let t = 0; t < valArray_demo.length; t++) {
						let str = valArray_demo[t]
						let hhh = str.toString().replaceAll(turn_key_list[0],"0").replaceAll(turn_key_list[1],"1").replaceAll(turn_key_list[2],"2").replaceAll(turn_key_list[3],"3").replaceAll(turn_key_list[4],"4").replaceAll(turn_key_list[5],"5").replaceAll(turn_key_list[6],"6").replaceAll(turn_key_list[7],"7").replaceAll(turn_key_list[8],"8").replaceAll(turn_key_list[9],"9")
						valArray.push(hhh)
					}
					let pushlist=[]
					for (let i = 0; i < valArray.length; i=i+3) {
						if(!Number(valArray[i+1]))continue
						let num1 = pushlist.indexOf(Number(valArray[i+1]))
						let num2 = pushlist.indexOf(Number(valArray[i]))
						let num3 = API.CONFIG.done_id_list.indexOf(Number(valArray[i+1]))
						let num4 = API.CONFIG.Anchor_ignore_uid.indexOf(Number(valArray[i]))
						if(num1>-1 || num2>-1 || Math.abs(ts_ten_m() - Number(valArray[i+2])) > 1 || num3> -1 ||  num4> -1)continue
						let num5 = do_lottery_room_list.indexOf(Number(valArray[i]))
						let num6 = do_lottery_id_list.indexOf(Number(valArray[i+1]))
						if(num5 >-1 || num6 >-1)continue
						do_lottery_room_list.push(Number(valArray[i]));
						do_lottery_id_list.push(Number(valArray[i+1]));
						pushlist.push(Number(valArray[i]));
						pushlist.push(Number(valArray[i+1]));
						pushlist.push(Number(valArray[i+2]));
					}
					if(pushlist.length % 3 == 0){
						//3整除，正常
					}else{
						console.log('数据长度异常')
						return
					}
					valArray=pushlist
					//console.log('valArray',valArray)
					//API.chatLog(`【天选时刻】正在获取比对0号服务器数据！`)
					if (isNaN(Number(valArray[0])) | valArray.length <= 2) {
						//API.chatLog(`【天选时刻】0号服务器数据格式不符，服务器可能已经关闭，请更换服务器！`)
						return;
					}
					if (Math.abs(ts_ten_m() - Number(valArray[2])) > 3 && Math.abs(ts_ten_m() - Number(valArray[2])) < 141) {
						//API.chatLog(`【天选时刻】0号服务器超过半小时无更新数据，服务器可能已经关闭，请更换服务器！`)
						return;
					}
					for (; valArray.length > 0; valArray.splice(0, 3)) {
						if (Number(valArray[1]) < 99) continue //旧版本实物抽奖蹭服务器模式数据舍弃
						if (Math.abs(ts_ten_m() - Number(valArray[2])) > 1) { //最新数据超过10分钟
							//console.log(`${valArray[1]}已参超时的抽奖的序号id`);
							continue;
						}
						let num9 = API.CONFIG.done_id_list.indexOf(Number(valArray[1]))
						if (num9 > -1) {
							//console.log(`${valArray[1]}已参与的抽奖的序号id`);
							continue;
						}
						let num1 = API.CONFIG.Anchor_ignore_uid.indexOf(Number(valArray[0]))
						if ( num1 > -1) {
							console.log(`${valArray[0]}屏蔽的直播间房间号`);
							//API.chatLog(`【天选时刻】${valArray[0]}屏蔽的直播间房间号，舍弃！`)
							continue;
						}
						let check_verif = false
						await BAPI.ajax({
							url: "//api.live.bilibili.com/room/v1/Room/verify_room_pwd?room_id=" + `${valArray[0]}`
						}).then(async(data) => {
							if (data.code != 0)
								check_verif = true;
							//console.log('直播间加密状态', check_verif)
						})
						await sleep(2000)
						if (check_verif) {
							API.chatLog(`【天选时刻】${valArray[0]}加密的直播间房间号，舍弃！`, 'warning')
							continue;
						}
						await BAPI.ajax({
							url: "xlive/lottery-interface/v1/Anchor/Check?roomid=" + `${valArray[0]}`
						}).then(async(data) => {
							let roomlist_data = data.data;
							if (roomlist_data == null) {
								//console.log('天选数据',null)
								API.CONFIG.done_id_list.push(Number(valArray[1]));
								if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
								return;
							} else {
								//console.log('天选数据',data)
								let time = Number(roomlist_data.time);
								let id = Number(roomlist_data.id);
								let gift_price = Number(roomlist_data.gift_price);
								let gift_id = Number(roomlist_data.gift_id);
								let gift_num = Number(roomlist_data.gift_num);
								let require_type = Number(roomlist_data.require_type)
								let require_text = roomlist_data.require_text
								let award_name = roomlist_data.award_name;
								let require_value = Number(roomlist_data.require_value)
								let cur_gift_num = Number(roomlist_data.cur_gift_num)
								let danmu = roomlist_data.danmu

								if (cur_gift_num > 0 && API.CONFIG.Anchor_cur_gift_num) {
									API.chatLog(`【天选时刻】已参与一次抽奖：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'success')
									return;
								}
								if (time > 0) { //抽奖时间限定,原因：考虑网络加载等，延迟20秒点击抽奖
									let num8 = API.CONFIG.done_id_list.indexOf(id)
									if (num8 > -1) {
										//console.log(`${id}已参与抽奖的序号id`);
										return;
									}
									API.CONFIG.freejournal4.unshift(`<br>${timestampToTime(ts_s())}：房间号：${valArray[0]}，奖品：${award_name}，条件：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
									if (API.CONFIG.freejournal4.length > 1000) {
										API.CONFIG.freejournal4.splice(900, 100);
									}
									$('#freejournal4 span:eq(0)').text(API.CONFIG.freejournal4);
									let dt = document.getElementById('freejournal4'); //通过id获取该div
									dt.innerHTML  = API.CONFIG.freejournal4

									API.CONFIG.done_id_list.push(id);
									if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
									API.CONFIG.room_AnchorRecord_time.push(Number(valArray[0])); //记录天选开启的时间
									API.CONFIG.room_AnchorRecord_time.push(ts_s());
									API.saveConfig()
									API.chatLog(`【天选时刻】简介数据：<a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>，奖品：${award_name}，要求：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`,'success',time)
									if (require_type == 3) { //1关注，2粉丝勋章，3大航海:3舰长2提督1总督| console.log('生效大航海房间',guardroom);console.log('生效大航海等级',guard_level);console.log('生效大航海等级',guardroom_activite);
										let guardroom_num = API.CONFIG.guardroom.indexOf(Number(valArray[0]))
										if (guardroom_num < 0) {
											API.chatLog(`【天选时刻】无大航海身份：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
										if (guardroom_num > -1 & API.CONFIG.guardroom_activite[guardroom_num] == 1 & API.CONFIG.guard_level[guardroom_num] <= require_value) {
											console.log('大航海', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
										} else {
											API.chatLog(`【天选时刻】大航海身份不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
									}
									if (require_type == 4 && Live_info.user_level < require_value) { //直播等级
										API.chatLog(`【天选时刻】直播等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (require_type == 5 && Live_info.Blever < require_value) { //5主站等级Live_info.Blever
										API.chatLog(`【天选时刻】主站等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (require_type >= 6) { //未知
										API.chatLog(`【天选时刻】含有未知要求：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (gift_price * gift_num > API.CONFIG.gift_price) { //金瓜子判断
										API.chatLog(`【天选时刻】金瓜子超出设置：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										let now_key=''
										for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
											if(award_name.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
												now_key=API.CONFIG.Anchor_ignore_keyword[i]
												break
											}
										}
										API.CONFIG.journal_pb.unshift(`<br>${timestampToTime(ts_s())}：【天选时刻】过滤关键词：${now_key}：奖品：${award_name}：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间：${valArray[0]}</a>`)
										if (API.CONFIG.journal_pb.length > 500) {
											API.CONFIG.journal_pb.splice(400, 100);
										}
										API.saveConfig();
										$('#journal_pb span:eq(0)').text(API.CONFIG.journal_pb)
										let dt = document.getElementById('journal_pb'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.journal_pb
										API.chatLog(`【天选时刻】过滤关键词：${now_key}：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									let money = []
									if (API.CONFIG.money_switch || API.CONFIG.no_money_checkbox) {
										money = await moneyCheck(award_name);
										console.log('识别到的奖品金额', money)
									}
									if (money[0] && money[1] < API.CONFIG.money_min) {
										API.chatLog(`奖品金额低于设置值：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true);
										return;
									}
									if (API.CONFIG.no_money_checkbox && money[0]==false && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										API.chatLog(`未识别到现金及正则：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true);
										return;
									}
									let bigmoney_to_get_medal = 0
									if(API.CONFIG.bigmoney_switch && money[0] && API.CONFIG.bigmoney <= money[1] ){
										bigmoney_to_get_medal = 1
										await sleep(50)
									}
									if(API.CONFIG.unignore_to_get_medal_switch){
										if(API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
											bigmoney_to_get_medal = 1
											await sleep(50)
										}
									}
									await sleep(50)
									let fansnum = 0,
										anchor_uid = 0
									let room_ruid_num = API.CONFIG.room_ruid.indexOf(Number(valArray[0]))
									if (API.CONFIG.fans_switch || API.CONFIG.Anchor_Followings_switch || API.CONFIG.AUTO_medal_get_up || API.CONFIG.AUTO_medal_up || API.CONFIG.unusual_check) { //粉丝数量判断、只参与关注的主播抽奖、勋章抽奖需要的
										if (room_ruid_num > -1) {
											anchor_uid = API.CONFIG.room_ruid[room_ruid_num + 1]
										}
										if (room_ruid_num < 0) {
											await sleep(500)
											let anchor_uid_mark = 0
											await BAPI.live_user.get_anchor_in_room(Number(valArray[0])).then(async(data) => {
												if(data.code==0 && data.data.info !== undefined){
													anchor_uid = data.data.info.uid;
													API.CONFIG.room_ruid.push(Number(valArray[0]))
													API.CONFIG.room_ruid.push(anchor_uid)
													API.saveConfig()
												}else{
													anchor_uid_mark = 1
												}
											}, () => {
												API.chatLog(`【天选时刻】anchor_uid获取失败，跳过当前直播间！`, 'warning');
												anchor_uid_mark = 1
											});
											if (anchor_uid_mark) {
												return;
											}
										}
									}

									if (API.CONFIG.fans_switch) { //粉丝数量判断
										await BAPI.web_interface_card(anchor_uid).then(async(data) => {
											fansnum = data.data.follower
											console.log('粉丝数量', fansnum)
										}, () => {
											API.chatLog(`【天选时刻】粉丝数量获取失败，可能风控了！<br><a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>，跳过不参加抽奖！`, 'warning',0,valArray[0],true);
										})
									}
									if (API.CONFIG.fans_switch && fansnum == 0) { //粉丝数量风控判断
										return
									}
									if (API.CONFIG.fans_switch & fansnum < API.CONFIG.fans_min) { //粉丝数量判断
										API.chatLog(`<a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>抽奖主播粉丝数${fansnum}小于设置${API.CONFIG.fans_min}，不参加抽奖！`, 'warning',0,valArray[0],true);
										return;
									}
									if (API.CONFIG.Anchor_Followings_switch & API.CONFIG.FollowingList.indexOf(anchor_uid) == -1) { //开启只参与关注的主播抽奖
										API.chatLog(`不参与非关注主播的抽奖!`, 'warning',0,valArray[0],true);
										return;
									}

									let medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(Number(valArray[0]))//是否有勋章
									room_ruid_num = API.CONFIG.room_ruid.indexOf(Number(valArray[0]))//是否有room-uid数据

									if (require_type == 2 && medal_roomid_list_num > -1) { //已有勋章的自动升级
										if (API.CONFIG.medal_level_list[medal_roomid_list_num] < require_value) {
											if(require_value>=20){
												API.chatLog(`【天选时刻】勋章等级要求：${require_value}，小心心无法升级！粉丝勋章等级不符要求：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
												return;
											}
											if(require_value<20){
												if(API.CONFIG.AUTO_medal_up){
													API.chatLog(`【天选时刻】正在尝试升级粉丝勋章！`, 'success')
													BAPI.sendLiveDanmu(danmu, Number(valArray[0]))//发送抽奖弹幕，亲密度+100
													await sleep(5000)//弹幕延迟
													let do_check = await API.get_medal_lv_do(Number(valArray[0]),require_value,anchor_uid)
													API.CONFIG.medal_ts = ts_ms()
													API.saveConfig();
													if(do_check){
														API.chatLog(`【天选时刻】投喂升级成功`, 'success')
														console.log('do_check',do_check)
														await sleep(5000)//延迟
													}else{
														API.chatLog(`【天选时刻】粉丝勋章等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
														return;
													}
												}
											}
										}
									}


									if (require_type == 2 && medal_roomid_list_num == -1  &&require_value<=4) {//无勋章，获取勋章，且目标勋章等级4以下可升级到
										console.log('bigmoney_to_get_medal',bigmoney_to_get_medal)
										if(API.CONFIG.AUTO_medal_get_up || bigmoney_to_get_medal){//开启自动
											let BKL_coin_num=await get_BKL_num_bagid()//0：银克拉数，1:银克拉bagid
											let fans_medal_info = true
											await BAPI.fans_medal_info(API.CONFIG.room_ruid[room_ruid_num + 1],API.CONFIG.room_ruid[room_ruid_num]).then(async function (data) {
												if(data.code==0){
													fans_medal_info = data.data.has_fans_medal
													console.log('fans_medal_info',fans_medal_info)
												}
											}, () => {
												API.chatLog(`【天选时刻】勋章数据获取失败！`, 'warning');
											})
											if(BKL_coin_num[0]>0 && !fans_medal_info){//有银克拉
												await BAPI.gift.bag_send(Live_info.uid, 3, API.CONFIG.room_ruid[room_ruid_num + 1], 1, BKL_coin_num[1], Number(valArray[0]), ts_ms()).then(async function (result) {
													if (result.code === 0 && result.msg === 'success') {
														API.chatLog('【银克拉】' + result.data.send_tips, 'success');
														API.chatLog(`【天选时刻】成功投喂银克拉获得粉丝勋章！`, 'success')
														await sleep(5000)//勋章获得可能延迟？
														BAPI.sendLiveDanmu(danmu, Number(valArray[0]))//发送抽奖弹幕，亲密度+100
														await sleep(5000)//弹幕延迟
														if (1 < require_value) {//首次获得勋章的自动升级
															API.chatLog(`【天选时刻】正在升级粉丝勋章！`, 'success')
														}
														let do_check=await API.get_medal_lv_do(Number(valArray[0]),require_value,anchor_uid)
														API.CONFIG.medal_ts = ts_ms()
														API.saveConfig();
														if(do_check){
															API.chatLog(`【天选时刻】投喂成功`, 'success')
															console.log('do_check',do_check)
															await sleep(5000)//延迟
														}
													} else {
														API.chatLog('【银克拉】赠送失败', 'warning');
													}
												});
											}else{
												API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
												return;
											}
										}else{
											API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
									}
									if (require_type == 2 && medal_roomid_list_num == -1 &&require_value>4) {//无勋章，目标勋章等级4以上
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}

									medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(Number(valArray[0]))//确认判断是否有勋章
									if (require_type == 2 && medal_roomid_list_num == -1){
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (API.CONFIG.done_room_list.indexOf(Number(valArray[0])) == -1) {
										API.CONFIG.done_room_list.push(Number(valArray[0])); //记录已参加抽奖的房间
										API.CONFIG.done_room_time_list.push(time + ts_s()); //记录已参加抽奖的时间
									}
									//API.chatLog(`【天选时刻】正在参与群主的专栏【${oid}】推送的直播间：${valArray[0]}，奖品：${award_name}的抽奖！`)
									API.CONFIG.COUNT_GOLDBOX++;
									$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									API.saveConfig();

									BAPI.room.room_entry_action(Number(valArray[0]))
									await sleep(100)
									let unusual_mark = false
									if(API.CONFIG.FollowingList.indexOf(anchor_uid) == -1 && require_type && API.CONFIG.unusual_check){
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													unusual_mark = true
												}
											}
										})
									}
									await BAPI.Lottery.anchor.join(id, gift_id, gift_num).then(async(data) => {
										if (data.code == 0) {
											API.chatLog(`【天选时刻】${valArray[0]}参与成功！`, 'success');
										}else{
											API.chatLog(`【天选时刻】${valArray[0]}参与反馈：${data.message}`, 'warning')
										}
										if (data.code == 400 & gift_num * gift_price != 0) {
											API.chatLog(`金瓜子余额不足!`, 'warning');
										}
									});
									if(unusual_mark ){
										await sleep(500)
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													API.chatLog(`【天选时刻】天选时刻关注异常，尝试使用普通关注接口关注！`, 'warning');
													await BAPI.modify(anchor_uid, 1).then(async(data) => {
														if (data.code == 0) {
															API.chatLog(`【天选时刻】使用普通关注接口关注成功！`, 'success');
														}else{
															API.chatLog(`【天选时刻】使用普通关注接口关注成功失败！回传信息：${data.message}`, 'warning');
														}
													})
												}
											}
										})
									}
									if (gift_num * gift_price > 0) {
										API.CONFIG.goldjournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${valArray[0]}">${valArray[0]}</a>，奖品：${award_name}，花费金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
										if (API.CONFIG.goldjournal.length > 500) {
											API.CONFIG.goldjournal.splice(400, 100);
										}
										console.log(API.CONFIG.goldjournal)
										API.saveConfig()
										$('#goldjournal span:eq(0)').text(API.CONFIG.goldjournal)
										let dt = document.getElementById('goldjournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.goldjournal
									}
									if (gift_num * gift_price == 0) {
										API.CONFIG.freejournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${valArray[0]}">${valArray[0]}</a>，奖品：${award_name}`)
										if (API.CONFIG.freejournal.length > 500) {
											API.CONFIG.freejournal.splice(400, 100);
										}
										API.saveConfig()
										$('#freejournal span:eq(0)').text(API.CONFIG.freejournal)
										let dt = document.getElementById('freejournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.freejournal
									}
								}
							};
						});
					}
				}, () => {
					do_lottery_two_stop = false
					setTimeout(async() => {
						do_lottery_two_stop = true
					}, 600e3);
					API.chatLog(`【天选时刻】简介数据获取失败，可能风控了，暂停10分钟！`, 'warning');
				})
			}

			let get_lottery_stop = true
			let get_lottery=async function (oid,n) {//5348728
				if(!get_lottery_stop)return
				if (!API.CONFIG.sever_modle)return;
				let keyword = []
				await BAPI.getdiscusss(oid).then(async (data) => {
					//console.log('replies', data.data.replies)
					let replies = data.data.replies
					if(!replies)return API.chatLog(`【天选时刻】群主的专栏【${oid}】暂无数据！`)
					keyword = []
					for (let i = 0; i < replies.length; i++) { //拼接
						if(ts_s()-replies[i].ctime>600)continue
						keyword = keyword.concat((replies[i].content.message).split(","))
					}

					let title = keyword;
					//console.log('服务器',replies,keyword,title);
					let valArray_demo = [];
					valArray_demo = keyword//title.split(",");
					let valArray = [];
					for (let t = 0; t < valArray_demo.length; t++) {
						let str = valArray_demo[t]
						let hhh = str.toString().replace(/寅/g, "0").replace(/卯/g, "1").replace(/辰/g, "2").replace(/巳/g, "3").replace(/午/g, "4").replace(/未/g, "5").replace(/申/g, "6").replace(/酉/g, "7").replace(/戌/g, "8").replace(/亥/g, "9")
						valArray.push(hhh)
					}
					//console.log('服务器数据',valArray);
					let pushlist=[]
					for (let i = 0; i < valArray.length; i=i+3) {
						if(!Number(valArray[i+1]))continue
						if(Math.abs(ts_ten_m() - Number(valArray[i+2])) <= 1 && upupup.indexOf(Number(valArray[i+1]))==-1 && upupup.indexOf(Number(valArray[i]))==-1){
							upupup.push(Number(valArray[i]),Number(valArray[i+1]),Number(valArray[i+2]))
						}
						let num1 = pushlist.indexOf(Number(valArray[i+1]))
						let num2 = pushlist.indexOf(Number(valArray[i]))
						let num3 = API.CONFIG.done_id_list.indexOf(Number(valArray[i+1]))
						let num4 = API.CONFIG.Anchor_ignore_uid.indexOf(Number(valArray[i]))
						if(num1>-1 || num2>-1 || Math.abs(ts_ten_m() - Number(valArray[i+2])) > 1 ||  num3> -1 ||  num4> -1)continue
						let num5 = do_lottery_room_list.indexOf(Number(valArray[i]))
						let num6 = do_lottery_id_list.indexOf(Number(valArray[i+1]))
						if(num5>-1 || num6>-1)continue
						do_lottery_room_list.push(Number(valArray[i]));
						do_lottery_id_list.push(Number(valArray[i+1]));
						pushlist.push(Number(valArray[i]));
						pushlist.push(Number(valArray[i+1]));
						pushlist.push(Number(valArray[i+2]));
					}
					if(pushlist.length % 3 == 0){
						//3整除，正常
					}else{
						console.log('数据长度异常')
						return
					}
					valArray=pushlist
					//console.log('valArray',valArray)
					//console.log(`正在检查群主的专栏【${n}】`)
					for (; valArray.length > 0; valArray.splice(0, 3)) {
						if (Number(valArray[1]) < 99) continue //旧版本实物抽奖蹭服务器模式数据舍弃
						if (Math.abs(ts_ten_m() - Number(valArray[2])) > 1) { //最新数据超过10分钟
							//console.log(`${valArray[1]}已参超时的抽奖的序号id`);
							continue;
						}
						let num6 = API.CONFIG.done_id_list.indexOf(Number(valArray[1]))
						if (num6 > -1) {
							//console.log(`1、${valArray[1]}已参与抽奖的序号id`);
							continue;
						}
						let num1 = API.CONFIG.Anchor_ignore_uid.indexOf(Number(valArray[0]))
						if (num1 > -1) {
							console.log(`${valArray[0]}屏蔽的直播间房间号`);
							//API.chatLog(`【天选时刻】${valArray[0]}屏蔽的直播间房间号，舍弃！`)
							continue;
						}
						let check_verif = false
						await BAPI.ajax({
							url: "//api.live.bilibili.com/room/v1/Room/verify_room_pwd?room_id=" + `${valArray[0]}`
						}).then(async(data) => {
							if (data.code != 0)
								check_verif = true;
							//console.log('直播间加密状态', check_verif)
						})
						await sleep(2000)
						if (check_verif) {
							API.chatLog(`【天选时刻】${valArray[0]}加密的直播间房间号，舍弃！`, 'warning')
							continue;
						}
						await BAPI.ajax({
							url: "xlive/lottery-interface/v1/Anchor/Check?roomid=" + `${valArray[0]}`
						}).then(async(data) => {
							let roomlist_data = data.data;
							if (roomlist_data == null) {
								//console.log('天选数据',null)
								API.CONFIG.done_id_list.push(Number(valArray[1]));
								if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
								return;
							} else {
								//console.log('天选数据',data)
								let time = Number(roomlist_data.time);
								let id = Number(roomlist_data.id);
								let gift_price = Number(roomlist_data.gift_price);
								let gift_id = Number(roomlist_data.gift_id);
								let gift_num = Number(roomlist_data.gift_num);
								let require_type = Number(roomlist_data.require_type)
								let require_text = roomlist_data.require_text
								let award_name = roomlist_data.award_name;
								let require_value = Number(roomlist_data.require_value)
								let cur_gift_num = Number(roomlist_data.cur_gift_num)
								let danmu = roomlist_data.danmu

								if (cur_gift_num > 0 && API.CONFIG.Anchor_cur_gift_num) {
									API.chatLog(`【天选时刻】已参与一次抽奖：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'success')
									return;
								}
								if (time > 0) { //抽奖时间限定,原因：考虑网络加载等，延迟20秒点击抽奖
									let num7 = API.CONFIG.done_id_list.indexOf(id)
									if (num7 > -1) {
										//console.log(`2、${id}已参与抽奖的序号id`);
										return;
									}
									API.CONFIG.freejournal4.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${valArray[0]}">${valArray[0]}</a>，奖品：${award_name}，条件：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
									if (API.CONFIG.freejournal4.length > 1000) {
										API.CONFIG.freejournal4.splice(900, 100);
									}
									$('#freejournal4 span:eq(0)').text(API.CONFIG.freejournal4);
									let dt = document.getElementById('freejournal4'); //通过id获取该div
									dt.innerHTML  = API.CONFIG.freejournal4

									API.CONFIG.done_id_list.push(id);
									if(API.CONFIG.done_id_list.length>1000)API.CONFIG.done_id_list.splice(0,API.CONFIG.done_id_list.length-500)
									API.CONFIG.room_AnchorRecord_time.push(Number(valArray[0])); //记录天选开启的时间
									API.CONFIG.room_AnchorRecord_time.push(ts_s());
									API.saveConfig()
									API.chatLog(`【天选时刻】专栏【${n}】数据：<a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>，奖品：${award_name}，要求：${require_text}，弹幕：${danmu}，金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`,'success',time)
									if (require_type == 3) { //1关注，2粉丝勋章，3大航海:3舰长2提督1总督| console.log('生效大航海房间',guardroom);console.log('生效大航海等级',guard_level);console.log('生效大航海等级',guardroom_activite);
										let guardroom_num = API.CONFIG.guardroom.indexOf(Number(valArray[0]))
										if (guardroom_num < 0) {
											API.chatLog(`【天选时刻】无大航海身份：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
										if (guardroom_num > -1 & API.CONFIG.guardroom_activite[guardroom_num] == 1 & API.CONFIG.guard_level[guardroom_num] <= require_value) {
											console.log('大航海', API.CONFIG.guardroom[guardroom_num], API.CONFIG.guard_level[guardroom_num], API.CONFIG.guardroom_activite[guardroom_num]);
										} else {
											API.chatLog(`【天选时刻】大航海身份不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
									}
									if (require_type == 4 && Live_info.user_level < require_value) { //直播等级
										API.chatLog(`【天选时刻】直播等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (require_type == 5 && Live_info.Blever < require_value) { //5主站等级Live_info.Blever
										API.chatLog(`【天选时刻】主站等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (require_type >= 6) { //未知
										API.chatLog(`【天选时刻】含有未知要求：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (gift_price * gift_num > API.CONFIG.gift_price) { //金瓜子判断
										API.chatLog(`【天选时刻】金瓜子超出设置：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (API.CONFIG.Anchor_ignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1) && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										let now_key=''
										for(let i=0;i<API.CONFIG.Anchor_ignore_keyword.length;i++){
											if(award_name.toLowerCase().indexOf(API.CONFIG.Anchor_ignore_keyword[i]) > -1){
												now_key=API.CONFIG.Anchor_ignore_keyword[i]
												break
											}
										}
										API.CONFIG.journal_pb.unshift(`<br>${timestampToTime(ts_s())}：【天选时刻】过滤关键词：${now_key}：奖品：${award_name}：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间：${valArray[0]}</a>`)
										if (API.CONFIG.journal_pb.length > 500) {
											API.CONFIG.journal_pb.splice(400, 100);
										}
										API.saveConfig();
										$('#journal_pb span:eq(0)').text(API.CONFIG.journal_pb)
										let dt = document.getElementById('journal_pb'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.journal_pb
										API.chatLog(`【天选时刻】过滤关键词：${now_key}：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									let money = []
									if (API.CONFIG.money_switch || API.CONFIG.no_money_checkbox) {
										money = await moneyCheck(award_name);
										console.log('识别到的奖品金额', money)
									}
									if (money[0] && money[1] < API.CONFIG.money_min) {
										API.chatLog(`奖品金额低于设置值：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true);
										return;
									}
									if (API.CONFIG.no_money_checkbox && money[0]==false && !API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)) {
										API.chatLog(`未识别到现金及正则：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true);
										return;
									}
									let bigmoney_to_get_medal = 0
									if(API.CONFIG.bigmoney_switch && money[0] && API.CONFIG.bigmoney <= money[1] ){
										bigmoney_to_get_medal = 1
										await sleep(50)
									}
									if(API.CONFIG.unignore_to_get_medal_switch){
										if(API.CONFIG.Anchor_unignore_keyword.some(v => award_name.toLowerCase().indexOf(v) > -1)){
											bigmoney_to_get_medal = 1
											await sleep(50)
										}
									}
									await sleep(50)
									let fansnum = 0,
										anchor_uid = 0
									let room_ruid_num = API.CONFIG.room_ruid.indexOf(Number(valArray[0]))
									if (API.CONFIG.fans_switch || API.CONFIG.Anchor_Followings_switch || API.CONFIG.AUTO_medal_get_up || API.CONFIG.AUTO_medal_up || API.CONFIG.unusual_check) { //粉丝数量判断、只参与关注的主播抽奖、勋章抽奖需要的
										if (room_ruid_num > -1) {
											anchor_uid = API.CONFIG.room_ruid[room_ruid_num + 1]
										}
										if (room_ruid_num < 0) {
											await sleep(500)
											let anchor_uid_mark = 0
											await BAPI.live_user.get_anchor_in_room(Number(valArray[0])).then(async(data) => {
												if(data.code==0 && data.data.info !== undefined){
													anchor_uid = data.data.info.uid;
													API.CONFIG.room_ruid.push(Number(valArray[0]))
													API.CONFIG.room_ruid.push(anchor_uid)
													API.saveConfig()
												}else{
													anchor_uid_mark = 1
												}
											}, () => {
												API.chatLog(`【天选时刻】anchor_uid获取失败，跳过当前直播间！`, 'warning');
												anchor_uid_mark = 1
											});
											if (anchor_uid_mark) {
												return;
											}
										}
									}

									if (API.CONFIG.fans_switch) { //粉丝数量判断
										await BAPI.web_interface_card(anchor_uid).then(async(data) => {
											fansnum = data.data.follower
											console.log('粉丝数量', fansnum)
										}, () => {
											API.chatLog(`【天选时刻】粉丝数量获取失败，可能风控了！<br><a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>，跳过不参加抽奖！`, 'warning',0,valArray[0],true);
										})
									}
									if (API.CONFIG.fans_switch && fansnum == 0) { //粉丝数量风控判断
										return
									}
									if (API.CONFIG.fans_switch & fansnum < API.CONFIG.fans_min) { //粉丝数量判断
										API.chatLog(`<a href="https://live.bilibili.com/${valArray[0]}"target="_blank">直播间：${valArray[0]}</a>抽奖主播粉丝数${fansnum}小于设置${API.CONFIG.fans_min}，不参加抽奖！`, 'warning',0,valArray[0],true);
										return;
									}
									if (API.CONFIG.Anchor_Followings_switch & API.CONFIG.FollowingList.indexOf(anchor_uid) == -1) { //开启只参与关注的主播抽奖
										API.chatLog(`不参与非关注主播的抽奖!`, 'warning',0,valArray[0],true);
										return;
									}

									let medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(Number(valArray[0]))//是否有勋章
									room_ruid_num = API.CONFIG.room_ruid.indexOf(Number(valArray[0]))//是否有room-uid数据

									if (require_type == 2 && medal_roomid_list_num > -1) { //已有勋章的自动升级
										if (API.CONFIG.medal_level_list[medal_roomid_list_num] < require_value) {
											if(require_value>=20){
												API.chatLog(`【天选时刻】勋章等级要求：${require_value}，小心心无法升级！粉丝勋章等级不符要求：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
												return;
											}
											if(require_value<20){
												if(API.CONFIG.AUTO_medal_up){
													API.chatLog(`【天选时刻】正在尝试升级粉丝勋章！`, 'success')
													BAPI.sendLiveDanmu(danmu, Number(valArray[0]))//发送抽奖弹幕，亲密度+100
													await sleep(5000)//弹幕延迟
													let do_check = await API.get_medal_lv_do(Number(valArray[0]),require_value,anchor_uid)
													API.CONFIG.medal_ts = ts_ms()
													API.saveConfig();
													if(do_check){
														API.chatLog(`【天选时刻】投喂升级成功`, 'success')
														console.log('do_check',do_check)
														await sleep(5000)//延迟
													}else{
														API.chatLog(`【天选时刻】粉丝勋章等级不符：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
														return;
													}
												}
											}
										}
									}


									if (require_type == 2 && medal_roomid_list_num == -1  &&require_value<=4) {//无勋章，获取勋章，且目标勋章等级4以下可升级到
										console.log('bigmoney_to_get_medal',bigmoney_to_get_medal)
										if(API.CONFIG.AUTO_medal_get_up || bigmoney_to_get_medal){//开启自动
											let BKL_coin_num=await get_BKL_num_bagid()//0：银克拉数，1:银克拉bagid
											let fans_medal_info = true
											await BAPI.fans_medal_info(API.CONFIG.room_ruid[room_ruid_num + 1],API.CONFIG.room_ruid[room_ruid_num]).then(async function (data) {
												if(data.code==0){
													fans_medal_info = data.data.has_fans_medal
													console.log('fans_medal_info',fans_medal_info)
												}
											}, () => {
												API.chatLog(`【天选时刻】勋章数据获取失败！`, 'warning');
											})
											if(BKL_coin_num[0]>0 && !fans_medal_info){//有银克拉
												await BAPI.gift.bag_send(Live_info.uid, 3, API.CONFIG.room_ruid[room_ruid_num + 1], 1, BKL_coin_num[1], Number(valArray[0]), ts_ms()).then(async function (result) {
													if (result.code === 0 && result.msg === 'success') {
														API.chatLog('【银克拉】' + result.data.send_tips, 'success');
														API.chatLog(`【天选时刻】成功投喂银克拉获得粉丝勋章！`, 'success')
														await sleep(5000)//勋章获得可能延迟？
														BAPI.sendLiveDanmu(danmu, Number(valArray[0]))//发送抽奖弹幕，亲密度+100
														await sleep(5000)//弹幕延迟
														if (1 < require_value) {//首次获得勋章的自动升级
															API.chatLog(`【天选时刻】正在升级粉丝勋章！`, 'success')
														}
														let do_check=await API.get_medal_lv_do(Number(valArray[0]),require_value,anchor_uid)
														API.CONFIG.medal_ts = ts_ms()
														API.saveConfig();
														if(do_check){
															API.chatLog(`【天选时刻】投喂成功`, 'success')
															console.log('do_check',do_check)
															await sleep(5000)//延迟
														}
													} else {
														API.chatLog('【银克拉】赠送失败', 'warning');
													}
												});
											}else{
												API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
												return;
											}
										}else{
											API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
											return;
										}
									}
									if (require_type == 2 && medal_roomid_list_num == -1 &&require_value>4) {//无勋章，目标勋章等级4以上
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}

									medal_roomid_list_num = API.CONFIG.medal_roomid_list.indexOf(Number(valArray[0]))//确认判断是否有勋章
									if (require_type == 2 && medal_roomid_list_num == -1){
										API.chatLog(`【天选时刻】未拥有粉丝勋章：<a href="https://live.bilibili.com/${valArray[0]}" target="_blank">直播间</a>`, 'warning',0,valArray[0],true)
										return;
									}
									if (API.CONFIG.done_room_list.indexOf(Number(valArray[0])) == -1) {
										API.CONFIG.done_room_list.push(Number(valArray[0])); //记录已参加抽奖的房间
										API.CONFIG.done_room_time_list.push(time + ts_s()); //记录已参加抽奖的时间
									}
									//API.chatLog(`【天选时刻】正在参与群主的专栏【${oid}】推送的直播间：${valArray[0]}，奖品：${award_name}的抽奖！`)
									API.CONFIG.COUNT_GOLDBOX++;
									$('#giftCoun span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									$('#COUNT_GOLDBOX span:eq(0)').text(API.CONFIG.COUNT_GOLDBOX);
									API.saveConfig();

									BAPI.room.room_entry_action(Number(valArray[0]))
									await sleep(100)
									let unusual_mark = false
									if(API.CONFIG.FollowingList.indexOf(anchor_uid) == -1 && require_type && API.CONFIG.unusual_check){
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													unusual_mark = true
												}
											}
										})
									}
									await BAPI.Lottery.anchor.join(id, gift_id, gift_num).then(async(data) => {
										if (data.code == 0) {
											API.chatLog(`【天选时刻】${valArray[0]}参与成功！`, 'success');
										}else{
											API.chatLog(`【天选时刻】${valArray[0]}参与反馈：${data.message}`, 'warning')
										}
										if (data.code == 400 & gift_num * gift_price != 0) {
											API.chatLog(`金瓜子余额不足!`, 'warning');
										}
									});
									if(unusual_mark ){
										await sleep(500)
										await BAPI.IsUserFollow(anchor_uid).then(async(data) => {
											if (data.code == 0) {
												if(!data.data.follow){
													API.chatLog(`【天选时刻】天选时刻关注异常，尝试使用普通关注接口关注！`, 'warning');
													await BAPI.modify(anchor_uid, 1).then(async(data) => {
														if (data.code == 0) {
															API.chatLog(`【天选时刻】使用普通关注接口关注成功！`, 'success');
														}else{
															API.chatLog(`【天选时刻】使用普通关注接口关注成功失败！回传信息：${data.message}`, 'warning');
														}
													})
												}
											}
										})
									}
									if (gift_num * gift_price > 0) {
										API.CONFIG.goldjournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${valArray[0]}">${valArray[0]}</a>，奖品：${award_name}，花费金瓜子：${gift_num*gift_price}（${gift_num*gift_price/1000}元）`)
										if (API.CONFIG.goldjournal.length > 500) {
											API.CONFIG.goldjournal.splice(400, 100);
										}
										console.log(API.CONFIG.goldjournal)
										API.saveConfig()
										$('#goldjournal span:eq(0)').text(API.CONFIG.goldjournal)
										let dt = document.getElementById('goldjournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.goldjournal
									}
									if (gift_num * gift_price == 0) {
										API.CONFIG.freejournal.unshift(`<br>${timestampToTime(ts_s())}：房间号：<a target="_blank" href="https://live.bilibili.com/${valArray[0]}">${valArray[0]}</a>，奖品：${award_name}`)
										if (API.CONFIG.freejournal.length > 500) {
											API.CONFIG.freejournal.splice(400, 100);
										}
										API.saveConfig()
										$('#freejournal span:eq(0)').text(API.CONFIG.freejournal)
										let dt = document.getElementById('freejournal'); //通过id获取该div
										dt.innerHTML  = API.CONFIG.freejournal
									}
								}
							};
						});
					}
					//console.log(`群主的专栏【${n}】检查结束`),500;

				}, () => {
					get_lottery_stop = false
					setTimeout(async() => {
						get_lottery_stop = true
					}, 600e3);
					API.chatLog(`【天选时刻】专栏数据获取失败，可能风控了，暂停10分钟！`, 'warning');
				});
			}
			}

		var turn_time = function (nowTime) {
			let thisTime = nowTime;
			thisTime = thisTime.replace(/-/g, '/');
			let time = new Date(thisTime);
			time = time.getTime();
			return time;
		}
		var moneyCheck = async function (award_name) {
			const name = award_name.replaceAll(' ', '').toLowerCase(); // 去空格+转小写
			const ignorenameList = ['铁三角'];//特殊名称的物品
			for (const i of ignorenameList) {
				if (name.indexOf(i) > -1)
					return [false]
			}
			let numberArray = name.match(/\d+(\.\d+)?/g); // 提取阿拉伯数字
			let chineseNumberArray = name.match(/([一壹二贰两三叁四肆五伍六陆七柒八捌九玖][千仟]零?[一壹二贰两三叁四肆五伍六陆七柒八捌九玖]?[百佰]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|([一壹二贰两三叁四肆五伍六陆七柒八捌九玖][百佰][一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾]?[一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|([一壹二贰三叁四肆五伍六陆七柒八捌九玖]?[十拾][一壹二贰三叁四肆五伍六陆七柒八捌九玖]?)|[一壹二贰两三叁四肆五伍六陆七柒八捌九玖十拾]/g); // 提取汉字数字
			const chnNumChar = {
				"零": 0,
				"一": 1,
				"壹": 1,
				"二": 2,
				"贰": 2,
				"两": 2,
				"三": 3,
				"叁": 3,
				"四": 4,
				"肆": 4,
				"五": 5,
				"伍": 5,
				"六": 6,
				"陆": 6,
				"七": 7,
				"柒": 7,
				"八": 8,
				"捌": 8,
				"九": 9,
				"玖": 9
			},
				  chnNameValue = {
					  "十": {
						  value: 10,
						  secUnit: false
					  },
					  "拾": {
						  value: 10,
						  secUnit: false
					  },
					  "百": {
						  value: 100,
						  secUnit: false
					  },
					  "佰": {
						  value: 100,
						  secUnit: false
					  },
					  "千": {
						  value: 1e3,
						  secUnit: false
					  },
					  "仟": {
						  value: 1e3,
						  secUnit: false
					  },
					  "万": {
						  value: 1e4,
						  secUnit: true
					  },
					  "亿": {
						  value: 1e8,
						  secUnit: true
					  }
				  };
			if (chineseNumberArray !== null && numberArray === null) { // 只提取出汉字数字
				return chineseFunc();
			} else if (chineseNumberArray === null && numberArray !== null) { // 只提取出阿拉伯数字
				return arabicNumberFunc();
			} else if (chineseNumberArray !== null && numberArray !== null) { // 都提取出来了
				let arr = arabicNumberFunc();
				if (arr[0])
					return arr; // 数组第一项为true则识别成功
				else
					return chineseFunc()
			} else { // 都没提取出来
				return [false]
			}
			function chineseFunc() {
				// 把匹配到的数字由长到段重新排列
				let chineseNumIndexList = [];
				chineseNumberArray.sort(function (a, b) {
					return b.length - a.length;
				});
				for (const n of chineseNumberArray) {
					chineseNumIndexList.push(getIndex(name, n, chineseNumIndexList));
				}
				for (let n = 0; n < chineseNumberArray.length; n++) {
					const chineseNum = chineseNumberArray[n]; // 中文数字
					if (chineseNum !== undefined) {
						const num = ChineseToNumber(chineseNum); // 阿拉伯数字
						const ChineseNumberIndex = chineseNumIndexList[n], // 中文数字下表
							  ChineseNumLength = chineseNum.length, // 中文数字长度
							  nextChineseNumIndex = chineseNumIndexList[n + 1]; // 下一个数字下标
						const unitIndex = ChineseNumberIndex + ChineseNumLength; // 数字后一个中文数字的下标 可能为undefined
						let strAfterNum = ''; // 数字后面的字符串
						if (unitIndex < nextChineseNumIndex) {
							// 如果下一个数字的起始位置不在当前数字所占范围内
							for (let i = unitIndex; i < name.length; i++) {
								if (nextChineseNumIndex !== undefined) {
									if (i < nextChineseNumIndex) // 不能把下一个数字取进去
										strAfterNum = strAfterNum + name[i];
									else
										break;
								} else {
									strAfterNum = strAfterNum + name[i];
								}
							}
						} else {
							strAfterNum = name.slice(unitIndex, name.length);
						}
						let finalMoney = getPrice(num, strAfterNum);
						if (finalMoney === undefined) {
							if (n === chineseNumberArray.length - 1)
								return [false];
							else
								continue;
						} else
							return [true, finalMoney];
					}
				}
			}
			function arabicNumberFunc() {
				// 把匹配到的数字由长到段重新排列
				let numIndexList = [];
				numberArray.sort(function (a, b) {
					return b.length - a.length;
				});
				for (const n of numberArray) { //每个数字在name中的下标
					numIndexList.push(getIndex(name, n, numIndexList));
				}
				for (let n = 0; n < numberArray.length; n++) {
					const num = numberArray[n]; // 数字
					const numberIndex = name.indexOf(num), // 数字下表
						  numLength = num.length, // 数字长度
						  nextNumIndex = numIndexList[n + 1]; // 下一个数字下标
					const unitIndex = numberIndex + numLength; // 数字后一个字符的下标 可能为undefined
					let strAfterNum = ''; // 数字后面的字符串
					if (unitIndex < nextNumIndex) {
						// 如果下一个数字的起始位置不在当前数字所占范围内
						for (let i = unitIndex; i < name.length; i++) {
							if (nextNumIndex !== undefined) {
								if (i < nextNumIndex) // 不能把下一个数字取进去
									strAfterNum = strAfterNum + name[i];
								else
									break;
							} else {
								strAfterNum = strAfterNum + name[i];
							}
						}
					} else {
						strAfterNum = name.slice(unitIndex, name.length);
					}
					let finalMoney = getPrice(num, strAfterNum);
					if (finalMoney === undefined) { // 识别失败
						if (n === numberArray.length - 1)
							return [false];
						else
							continue;
					} else
						return [true, finalMoney]
				}
			}
			function getPrice(num, strAfterNum) {
				const yuan = ['元', 'r', '块','￥'], // 1
					  yuanWords = ['rmb', 'cny', '人民币', '软妹币', '微信红包', '红包', 'qq红包', '现金', 'qb'], // 1
					  dime = ['毛', '角'], // 0.1
					  dimeWords = ['电池'], // 0.1
					  penny = ['分'], // 0.01
					  milliWords = ['金瓜子']; // 0.001
				const firstChar = strAfterNum[0];
				let finalMoney = undefined; // 单位：元
				const number = Number(num);
				for (const w of yuanWords) {
					if (strAfterNum.indexOf(w) > -1) {
						finalMoney = number;
						break;
					}
				}
				for (const w of dimeWords) {
					if (strAfterNum.indexOf(w) > -1) {
						finalMoney = number * 0.1;
						break;
					}
				}
				for (const w of milliWords) {
					if (strAfterNum.indexOf(w) > -1) {
						finalMoney = number * 0.001;
						break;
					}
				}
				if (finalMoney === undefined) {
					if (yuan.indexOf(firstChar) > -1) {
						finalMoney = number
					} else if (dime.indexOf(firstChar) > -1) {
						finalMoney = number * 0.1;
					} else if (penny.indexOf(firstChar) > -1) {
						// 排除特殊奖品名
						const ignoreList = ['分钟'];
						for (const i of ignoreList) {
							if (strAfterNum.indexOf(i) > -1)
								return undefined
						}
						finalMoney = number * 0.01;
					}
				}

				return finalMoney;
			}
			function ChineseToNumber(chnStr) {
				let chineseStr = chnStr[0] === '十' ? "一" + chnStr : chnStr;
				let rtn = 0,
					section = 0,
					number = 0,
					secUnit = false,
					str = chineseStr.split('');
				for (let i = 0; i < str.length; i++) {
					let num = chnNumChar[str[i]];
					if (typeof num !== 'undefined') {
						number = num;
						if (i === str.length - 1) {
							section += number;
						}
					} else {
						if (!chnNameValue.hasOwnProperty(str[i]))
							return undefined;
						let unit = chnNameValue[str[i]].value;
						secUnit = chnNameValue[str[i]].secUnit;
						if (secUnit) {
							section = (section + number) * unit;
							rtn += section;
							section = 0;
						} else {
							section += (number * unit);
						}
						number = 0;
					}
				}
				return rtn + section;
			};
			/**
			 * 获取下标，可处理部分特殊情况，如
			 * 100金瓜子1个
			 * 1份100金瓜子1个
			 * @param str 字符串
			 * @param num 被搜索的数字
			 * @param array 储存已搜索到的数字的下标的数组
			 * @param start 搜索数字的开始下标，初始为0，为了防止重复搜索字符串中的一个子串
			 * @param arrStart 搜索数组的开始下标，初始为0，为了防止重复搜索数组中的某一项
			 * @returns {number} index
			 */
			function getIndex(str, num, array, start = 0, arrStart = 0) {
				let index = str.indexOf(num, start),
					arrayIndex = array.indexOf(index, arrStart);
				if (arrayIndex > -1)
					return getIndex(str, num, array, index + 1, arrayIndex + 1);
				else
					return index
			}
		}
		function getUrlParam(name) {
			let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			let r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		}

		/**
		 * （2,10） 当前是否在两点到十点之间
		 * @param a 整数 起始时间
		 * @param b 整数 终止时间
		 * @returns {boolean}
		 */
		function inTimeArea(a, b) {
			if (a > b || a > 23 || b > 24 || a < 0 || b < 1) {
				//console.log('错误时间段');
				return false
			}
			let myDate = new Date();
			let h = myDate.getHours();
			return h >= a && h < b
		}

		/**
		 * 概率
		 * @param val
		 * @returns {boolean}
		 */
		function probability(val) {
			if (val <= 0)
				return false;
			let rad = Math.ceil(Math.random() * 100);
			return val >= rad
		}

		const dateNow = () => Date.now();

		/**
		 * 检查是否为新一天
		 * @param ts
		 * @returns {boolean}
		 */
		const checkNewDay = (ts) => {
			if (ts === 0)
				return true;
			let t = new Date(ts);
			let d = new Date();
			let td = t.getDate();
			let dd = d.getDate();
			return (dd !== td);
		}
		const get_BKL_num_bagid = async() => {//返回银克拉、bagid
			let BKL_num=0
			let bagid=0
			await BAPI.gift.bag_list().then(function (bagResult) {
				for(let i=0;i<bagResult.data.list.length;i++){
					if (bagResult.data.list[i].gift_id === 3) {
						BKL_num=bagResult.data.list[i].gift_num
						bagid=bagResult.data.list[i].bag_id
					}
				}
			})
			return [BKL_num,bagid]
		}

		function qmsg(key, text) {
			return XHR({
				GM: true,
				anonymous: true,
				method: 'POST',
				url: `https://qmsg.zendee.cn/send/${key}`,
				responseType: 'json',
				data: encodeURI(`msg=${text}`)
			})
		}
		function pushmsg(id, text) {
			return XHR({
				GM: true,
				anonymous: true,
				method: 'POST',
				url: `http://push.ijingniu.cn/send?key=${id}`,
				responseType: 'json',
				data: encodeURI(`head=中奖了！&body=${text}`)
			})
		}

		function ServerChan2(id, text) {
			return XHR({
				GM: true,
				anonymous: true,
				method: 'POST',
				url: `https://sctapi.ftqq.com/${id}.send`,
				responseType: 'json',
				data: encodeURI(`text=中奖了&desp=${text}`)
			})
		}
		/**
		 * 获取msg[dev_id]
		 * @param name
		 * @returns {String} dev_id
		 */
		function getMsgDevId(name = NAME) {
			let deviceid = window.localStorage.getItem("im_deviceid_".concat(name));
			if (!name || !deviceid) {
				let str = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (name) {
					let randomInt = 16 * Math.random() | 0;
					return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase()
				}));
				return function (name, randomInt) {
					Object.keys(localStorage).forEach((function (name) {
						name.match(/^im_deviceid_/) && window.localStorage.removeItem(name)
					})),
						window.localStorage.setItem("im_deviceid_".concat(randomInt), name)
				}
				(str, name),
					str
			}
			return deviceid
		};

		function getvisit_id(name = NAME) {
			let str = "xxxxxxxxxxxx".replace(/[x]/g, (function (name) {
				let randomInt = 16 * Math.random() | 0;
				return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toLowerCase()
			}))
			return str
		};
		function XHR(XHROptions) {
			return new Promise(resolve => {
				const onerror = (error) => {
					console.error(GM_info.script.name, error);
					resolve(undefined);
				};
				if (XHROptions.GM) {
					if (XHROptions.method === 'POST') {
						if (XHROptions.headers === undefined)
							XHROptions.headers = {};
						if (XHROptions.headers['Content-Type'] === undefined)
							XHROptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
					}
					XHROptions.timeout = 30 * 1000;
					XHROptions.onload = res => resolve({
						response: res,
						body: res.response
					});
					XHROptions.onerror = onerror;
					XHROptions.ontimeout = onerror;
					GM_xmlhttpRequest(XHROptions);
				} else {
					const xhr = new XMLHttpRequest();
					xhr.open(XHROptions.method, XHROptions.url);
					if (XHROptions.method === 'POST' && xhr.getResponseHeader('Content-Type') === null)
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
					if (XHROptions.cookie)
						xhr.withCredentials = true;
					if (XHROptions.responseType !== undefined)
						xhr.responseType = XHROptions.responseType;
					xhr.timeout = 30 * 1000;
					xhr.onload = ev => {
						const res = ev.target;
						resolve({
							response: res,
							body: res.response
						});
					};
					xhr.onerror = onerror;
					xhr.ontimeout = onerror;
					xhr.send(XHROptions.data);
				}
			});
		}

		function READ(text) {
			if (voiceContent_mark)
				return
			voiceContent_mark = true
			let url = "http://tts.baidu.com/text2audio?lan=zh&spd=5&ie=UTF-8&text=" + encodeURI(text);
			let voiceContent = new Audio(url);
			voiceContent.src = url;
			voiceContent.play();
			let play = function () {
				console.log(voiceContent_mark)
				voiceContent_mark = false
				voiceContent.removeEventListener('ended', play)
				console.log(voiceContent_mark)
			}
			voiceContent.addEventListener('ended', play)
		};
		/**
		 * 保存文件到本地
		 * @param fileName 文件名
		 * @param fileContent 文件内容
		 */
		function downFile(fileName, fileContent) {
			let elementA = document.createElement("a");
			elementA.setAttribute(
				"href",
				"data:text/plain;charset=utf-8," + JSON.stringify(fileContent));
			elementA.setAttribute("download", fileName);
			elementA.style.display = "none";
			document.body.appendChild(elementA);
			elementA.click();
			document.body.removeChild(elementA);
		}
		/**
		 * 导出配置文件
		 * @param MY_API MY_API
		 * @param nosleepConfig noSleep
		 * @param INVISIBLE_ENTER_config invisibleEnter
		 */
		function exportConfig(MY_API) {
			return downFile('ZDBGJ_CONFIG.json', MY_API);
		}
		/**
		 * 导入配置文件
		 */
		function qq(qq, text,ip) {
			return new Promise((resolve) => {
				let url
				if(ip.indexOf(':')>-1 || ip.indexOf('：')>-1){
					url = ip.replaceAll(' ', '').replaceAll('：', ':')
				}else{
					url = ip + ':80'
				}
				let msg = encodeURI(text)
				GM_xmlhttpRequest({
					method: 'get',
					url: `http://${url}/send_private_msg?user_id=${qq}&message=${msg}`,
					onload: function (response) {
						const res = JSON.parse(response.response);
						resolve(res);
					}
				})
			})
		}
		function qqqun(qqqun, text,ip) {
			return new Promise((resolve) => {
				let url
				if(ip.indexOf(':')>-1 || ip.indexOf('：')>-1){
					url = ip.replaceAll(' ', '').replaceAll('：', ':')
				}else{
					url = ip + ':80'
				}
				let msg = encodeURI(text)
				GM_xmlhttpRequest({
					method: 'get',
					url: `http://${url}/send_group_msg?group_id=${qqqun}&message=${msg}`,
					onload: function (response) {
						const res = JSON.parse(response.response);
						resolve(res);
					}
				})
			})
		}
		function post_data_to_server(da,url) {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					method: 'POST',
					headers:{"Content-Type": "application/json","Connection":"close"},
					url: `http://${url}:1369/sync/input/`,
					data:JSON.stringify(da),
					onload: function (response) {
						const res = JSON.parse(response.response);
						resolve(res);
					}
				})
			})
		}
		function get_data_from_server(url) {
			return new Promise((resolve) => {
				GM_xmlhttpRequest({
					method: 'get',
					headers:{"Content-Type": "application/json","Connection":"close"},
					url: `http://${url}:1369/sync/get_users/?skip=0&limit=200`,
					onload: function (response) {
						const res = JSON.parse(response.response);
						resolve(res);
					}
				})
			})
		}
		function tip(message) {
			GM_notification({
				title:'中奖通知',
				text: message,
				timeout: 10000,
				highlight: true,
			})
		}
		function ArrayIsEqual(arr1, arr2) { //判断2个数组是否相等
			if (arr1 === arr2) { //如果2个数组对应的指针相同，那么肯定相等，同时也对比一下类型
				return true;
			} else {
				if (arr1.length != arr2.length) {
					return false;
				} else { //长度相同
					for (let i in arr1) { //循环遍历对比每个位置的元素
						if (arr1[i] != arr2[i]) { //只要出现一次不相等，那么2个数组就不相等
							return false;
						}
					} //for循环完成，没有出现不相等的情况，那么2个数组相等
					return true;
				}
			}
		}

		/**
		 * SeaLoong BilibiliAPI https://github.com/SeaLoong/BLRHH
		 */
		let csrf_token,
			visit_id;
		let mm = year() + month();
		if (month() < 10) mm = year()+'0'+month();
		var BilibiliAPI = {
			setCommonArgs: (csrfToken = '', visitId = '') => {
				csrf_token = csrfToken;
				visit_id = getvisit_id();
			},
			// 整合常用API
			getWebAreaList: () => {
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/xlive/web-interface/v1/index/getWebAreaList",
					method: "GET",
					data:{
						source_id:2,
					}
				})
			},
			fans_medal_info: async (ruid,rroom_id) => {
				let room_area_id = 371
				let area_parent_id = 9
				await BilibiliAPI.getWebAreaList().then(function (data) {
					if(data.code==0){
						room_area_id = data.data.data[0].list[0].id
						area_parent_id = data.data.data[0].list[0].parent_id
					}
				})
				console.log('area_parent_id',room_area_id,area_parent_id)
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/fans_medal_info",
					method: "GET",
					data:{
						target_id:ruid,
						room_id:rroom_id,
						room_area_id:room_area_id,
						area_parent_id:area_parent_id,
						platform:'pc'
					}
				})
			},
			IsUserFollow: e => BAPI.ajax({//是否关注1关注0非关注
				url: "relation/v1/Feed/IsUserFollow?follow=" + e
			}),
			live_fans_medal: (page,pageSize) => {//获取全部勋章数据
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/fans_medal/v5/live_fans_medal/iApiMedal",
					method: "GET",
					data:{
						page:page,
						pageSize:pageSize
					}
				})
			},
			rm_dynamic: (dynamic_id) => {//删除动态
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
					method: "POST",
					data:{
						dynamic_id:dynamic_id,
						csrf_token: csrf_token,
						csrf: csrf_token
					}
				})
			},
			msgfeed_at: (dynamic_id) => {//获取@信息
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/msgfeed/at",
					method: "GET",
					data:{
						build: 0,
						mobi_app: 'web'
					}
				})
			},
			dynamic_postdiscuss: (discuss,oid,type) => { //动态发送评论
				if (oid == 0)
					return;
				return BilibiliAPI.ajax({
					method: 'POST',
					url: '//api.bilibili.com/x/v2/reply/add',
					data: {
						oid: oid,
						type: type,
						message: discuss,
						plat: 1,
						ordering: 'time',
						jsonp: 'jsonp',
						csrf: csrf_token,
					}
				});
			},
			get_dynamic_detail: (dynamic_id) => {//获取动态详细
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail",
					method: "GET",
					data:{
						dynamic_id:dynamic_id
					}
				})
			},
			article_list: (id = 375855) => {//获取文集信息  大锦鲤文集id：375855
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/article/list/web/articles",
					method: "GET",
					data:{
						id:id,
						jsonp:'jsonp',
					}
				})
			},
			article_recommends: () => {//获取最新专栏信息
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/article/recommends",
					method: "GET",
					data:{
						aid:'',
						cid:3,
						pn:1,
						ps:20,
						jsonp:'jsonp',
						sort:1
					}
				})
			},
			article_favorites_add: (oid,upid) => {//专栏收藏
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/article/favorites/add",
					method: "POST",
					data:{
						id:oid,
						csrf: csrf_token
					}
				})
			},
			article_coin_add: (oid,upid) => {//专栏投币
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/web-interface/coin/add",
					method: "POST",
					data:{
						aid:oid,
						upid: upid,
						multiply: 1,
						avtype: 2,
						csrf: csrf_token
					}
				})
			},
			article_like: (oid) => {//专栏点赞
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/article/like",
					method: "POST",
					data:{
						id:oid,
						type: 1,
						csrf: csrf_token
					}
				})
			},
			get_user_info: () => {//用户信息
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/xlive/web-ucenter/user/get_user_info",
					method: "GET",
				})
			},
			nav: () => {//用户登陆信息等
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/web-interface/nav",
					method: "GET",
				})
			},
			DoSign: () => {//直播区签到
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign",
					method: "GET",
				})
			},
			dynamic_create:(content) => {//文字动态
				const extension = '{"emoji_type":1,"from":{"emoji_type":1},"flag_cfg":{}}'
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create",
					method: "POST",
					data: {
						dynamic_id: 0,
						type: 4,
						rid: 0,
						content:content,
						up_choose_comment: 0,
						up_close_comment: 0,
						extension: extension,
						at_uids:'',
						ctrl: [],
						csrf_token: csrf_token,
						csrf: csrf_token,
					}
				})
			},
			dynamic_like: (dynamic_id) => {//动态点赞
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb",
					method: "POST",
					data: {
						uid:Live_info.uid,
						dynamic_id:dynamic_id,
						up: 1,
						csrf_token: csrf_token,
						csrf: csrf_token,
					}
				})
			},
			space_history: (host_uid,offset_dynamic_id=0) => {//进入个人主页的动态页
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history",
					method: "GET",
					data: {
						visitor_uid: Live_info.uid,
						offset_dynamic_id:offset_dynamic_id,//动态抽奖一般会置顶，嫌麻烦只取近期最近的一组数据
						host_uid:host_uid,
						need_top:1,
						platform:'web'
					}
				})
			},
			reserve_relation_info: (business_id) => {//business_id
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/activity/up/reserve/relation/info",
					method: "GET",
					data: {
						ids:business_id,
						csrf: csrf_token,
					}
				})
			},
			reserve_attach_card_button: (reserve_id,reserve_total) => {//business_id
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_mix/v1/dynamic_mix/reserve_attach_card_button",
					method: "POST",
					data: {
						reserve_id:reserve_id,
						cur_btn_status:1,
						reserve_total:reserve_total,
						csrf: csrf_token,
					}
				})
			},
			detail_by_lid: (lottery_id) => {
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/lottery_svr/v1/lottery_svr/detail_by_lid",
					method: "GET",
					data: {
						lottery_id:lottery_id,
						csrf: csrf_token,
					}
				})
			},
			dynamic_lottery_notice: (dynamic_id) => {
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice",
					method: "GET",
					data: {
						dynamic_id:dynamic_id
					}
				})
			},
			getdiscusss_dynamic: (oid) => {
				if (!oid)
					return
				return BilibiliAPI.ajax({ //获取热门转发评论
					url: "//api.bilibili.com/x/v2/reply/main",
					data: {
						jsonp: 'jsonp',
						next: 0,
						type: 17,
						oid: oid,
						mode: 3,
						_: ts_ms(),
						callback: ""
					}
				})
			},
			dynamic_history: (offset_dynamic_id) => {//自己动态首页刷新的关注的UP的动态
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history",
					method: "GET",
					data: {
						uid: Live_info.uid,
						offset_dynamic_id:offset_dynamic_id,
						type_list:'268435455',
						from:'weball',
						platform:'web'
					}
				})
			},
			dynamic_new: () => {
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new",
					method: "GET",
					data: {
						uid: Live_info.uid,
						type_list:'268435455',
						from:'weball',
						platform:'web'
					}
				})
			},
			repost: (dynamic_id,content,ctrl) => {
				const len = content.length;
				if (len > 233) {
					content = content.slice(0, 233 - len)
				}
				return BilibiliAPI.ajax({
					method: "POST",
					url: "//api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost",
					data: {
						uid: Live_info.uid,
						dynamic_id: dynamic_id,
						content:content,
						at_uids:'',
						ctrl:ctrl,
						csrf_token: csrf_token,
						csrf: csrf_token,
					}
				})
			},
			get_attention_list: () => {
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/feed/v1/feed/get_attention_list",
					method: "GET",
					data: {
						uid: Live_info.uid
					}
				})
			},
			get_weared_medal: () => {
				return BilibiliAPI.ajax({
					url: "//api.live.bilibili.com/live_user/v1/UserInfo/get_weared_medal",
					method: "POST",
					data: {
						source: 1,
						uid: Live_info.uid,
						target_id: Live_info.room_id,
						csrf_token: csrf_token,
						csrf: csrf_token,
						visit_id:''
					}
				})
			},
			exp: () => {//投币经验
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/web-interface/coin/today/exp",
				})
			},
			exp_reward: () => {//经验获取情况,投币经验显示不稳定
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/member/web/exp/reward",
				})
			},
			coin_add: (aid) => {
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/web-interface/coin/add",
					method: "POST",
					data: {
						aid: aid,
						multiply: 1,//投币数量
						select_like: 1,//点赞
						cross_domain: true,
						csrf: csrf_token
					}
				})
			},
			web_interface_card: (ruid) => {
				return BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/web-interface/card",
					data: {
						mid: ruid,
						photo:true
					}
				})
			},
			getdiscusss: (oid) => {
				if (!oid)
					return
				return BilibiliAPI.ajax({ //获取屏蔽词
					url: "//api.bilibili.com/x/v2/reply/main", //https://api.bilibili.com/x/v2/reply/main?callback=jQuery33100497697415878422_1620034684747&jsonp=jsonp&next=0&type=12&oid=5293953&mode=2&plat=1&_=1620034684750 新接口？
					data: {
						jsonp: 'jsonp',
						next: 0,
						type: 12,
						oid: oid,
						mode: 2,
						_: ts_ms(),
						callback: ""
					}
				})
			},
			activity_lottery: {
				addtimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/addtimes",
						method: "POST",
						data: {
							sid: sid,
							action_type: 3,
							csrf: csrf_token
						}
					})
				},
				mytimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/mytimes",
						data: {
							sid: sid,
						}
					})
				},
				do : (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/do",
						method: "POST",
						data: {
							sid: sid,
							type: 1,
							csrf: csrf_token
						}
					})
				},
			},
			new_activity_lottery: {
				addtimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/lottery/addtimes",
						method: "POST",
						data: {
							sid: sid,
							action_type: 3,
							csrf: csrf_token
						}
					})
				},
				mytimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/lottery/mytimes",
						data: {
							sid: sid,
						}
					})
				},
				do : (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/lottery/do",
						method: "POST",
						data: {
							sid: sid,
							type: 1,
							csrf: csrf_token
						}
					})
				},
			},
			activity_lottery: {
				addtimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/addtimes",
						method: "POST",
						data: {
							sid: sid,
							action_type: 3,
							csrf: csrf_token
						}
					})
				},
				mytimes: (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/mytimes",
						data: {
							sid: sid,
						}
					})
				},
				do : (sid) => {
					return BilibiliAPI.ajax({
						url: "//api.bilibili.com/x/activity/lottery/do",
						method: "POST",
						data: {
							sid: sid,
							type: 1,
							csrf: csrf_token
						}
					})
				},
			},
			update_ack : (talker_id,ack_seqno) => {//私信已读1 普通私信，34预约抽奖通知
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/session_svr/v1/session_svr/update_ack",
					method: "POST",
					data: {
						talker_id: talker_id,
						session_type: 1,
						ack_seqno:ack_seqno,
						build: 0,
						mobi_app: 'web',
						csrf_token:  csrf_token,
						csrf: csrf_token
					}
				})
			},
			get_sessions: (end_ts) => {//获取私信列表（显示最后一条私信）
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
					data: {
						session_type: 1,
						group_fold: 1,
						unfollow_fold: 0,
						sort_rule: 2,
						end_ts: end_ts,
						build: 0,
						mobi_app: 'web'
					}
				})
			},
			getMsg: (uid) => {//获取私信内容
				return BilibiliAPI.ajax({
					url: "//api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
					data: {
						sender_device_id: 1,
						talker_id: uid,
						session_type: 1,
						size: 20,
						build: 0,
						mobi_app: 'web'
					}
				})
			},
			modify: (i, e, a = 11) => BilibiliAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "//api.bilibili.com/x/relation/modify",
				data: {
					fid: i,
					act: e,
					re_src: a,
					jsonp: "jsonp",
					callback: ""
				}
			}),
			getInfoByUser: i => BilibiliAPI.ajax({
				url: "xlive/web-room/v1/index/getInfoByUser",
				data: {
					room_id: i
				}
			}),
			get_tags_mid: (i, e, f) => BilibiliAPI.ajax({
				url: "//api.bilibili.com/x/relation/tag",
				data: {
					mid: i,
					tagid: e,
					pn: f,
					ps: '20',
					jsonp: 'jsonp'
				}
			}),
			get_tags: () => BilibiliAPI.ajax({
				url: "//api.bilibili.com/x/relation/tags",
				data: {
					jsonp: 'jsonp',
				}
			}),
			tag_create: (i) => BilibiliAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "//api.bilibili.com/x/relation/tag/create",
				type: "post",
				data: {
					tag: i,
					jsonp: 'jsonp',
					csrf: csrf_token,
				}
			}),
			tags_addUsers: (i, e) => BilibiliAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "//api.bilibili.com/x/relation/tags/addUsers?cross_domain=true",
				type: "post",
				data: {
					fids: i,
					tagids: e,
					csrf: csrf_token,
				}
			}),
			wear_medal: (i) => BilibiliAPI.ajaxWithCommonArgs({
				method: "POST",
				url: "xlive/web-room/v1/fansMedal/wear",
				data: {
					medal_id: i,
				}
			}),
			link_group: {
				my_groups: () => BilibiliAPI.ajax({
					url: "link_group/v1/member/my_groups"
				}),
				sign_in: (i, e) => BilibiliAPI.ajax({
					url: "link_setting/v1/link_setting/sign_in",
					data: {
						group_id: i,
						owner_id: e
					}
				}),
				buy_medal: (i, e = "metal", a = "android") => BilibiliAPI.ajaxWithCommonArgs({
					method: "POST",
					url: "//api.vc.bilibili.com/link_group/v1/member/buy_medal",
					data: {
						master_uid: i,
						coin_type: e,
						platform: a
					}
				})
			},
			DailyReward: {
				login: () => BilibiliAPI.x.now(),
				share: i => BilibiliAPI.x.share_add(i),
				watch: (i, e, a, t, l, r, o, n, s) => BilibiliAPI.x.heartbeat(i, e, a, t, l, r, o, n, s),

			},
			x: {
				getUserSpace: (i, e, a, t, l, r, o) => BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/space/arc/search",
					data: {
						mid: i,
						ps: e,
						tid: a,
						pn: t,
						keyword: l,
						order: r,
						jsonp: o
					}
				}),
				heartbeat: (i, e, a, t, l = 0, r = 0, o = 3, n = 1, s = 2) => BilibiliAPI.ajaxWithCommonArgs({
					method: "POST",
					url: "//api.bilibili.com/x/report/web/heartbeat",
					data: {
						aid: i,
						cid: e,
						mid: a,
						start_ts: t || Date.now() / 1e3,
						played_time: l,
						realtime: r,
						type: o,
						play_type: n,
						dt: s
					}
				}),
				share_add: i => BilibiliAPI.ajaxWithCommonArgs({
					method: "POST",
					url: "//api.bilibili.com/x/web-interface/share/add",
					data: {
						aid: i,
						jsonp: "jsonp"
					}
				}),
				now: () => BilibiliAPI.ajax({
					url: "//api.bilibili.com/x/report/click/now",
					data: {
						jsonp: "jsonp"
					}
				})
			},
			dynamic_svr: {
				dynamic_new: (i, e = 8) => BilibiliAPI.ajax({
					url: "dynamic_svr/v1/dynamic_svr/dynamic_new",
					data: {
						uid: i,
						type: e
					}
				}),
				space_history: (i, e, a, t) => BilibiliAPI.ajax({
					url: "dynamic_svr/v1/dynamic_svr/space_history",
					data: {
						visitor_uid: i,
						host_uid: e,
						offset_dynamic_id: a,
						need_top: t
					}
				})
			},
			Exchange: {
				silver2coin: (platform) => BilibiliAPI.pay.silver2coin(platform),
				silver2coin_old: (platform) => BilibiliAPI.pay.silver2coin_old(platform),
			},
			Lottery: {
				MaterialObject: {
					getRoomActivityByRoomid: (roomid) => BilibiliAPI.lottery.box.getRoomActivityByRoomid(roomid),
					getStatus: (aid, times) => BilibiliAPI.lottery.box.getStatus(aid, times),
					draw: (aid, number) => BilibiliAPI.lottery.box.draw(aid, number),
					getWinnerGroupInfo: (aid, number) => BilibiliAPI.lottery.box.getWinnerGroupInfo(aid, number)
				},
				anchor: {
					deldiscusss5: (rpid,oid) => {//5348728
						let data = {
							oid: oid,
							type: 12,
							jsonp: 'jsonp',
							rpid: rpid,
							csrf:csrf_token,
						};
						return BilibiliAPI.ajaxWithCommonArgs({
							method: "POST",
							url: "//api.bilibili.com/x/v2/reply/del",
							data: data
						})
					},
					join: (id, gift_id, gift_num, t = "pc") => {
						let data = {
							id: id,
							platform: t
						};
						if (gift_id !== undefined && gift_num !== undefined && gift_id !== 0) {
							data.gift_id = gift_id;
							data.gift_num = gift_num;
						};
						return BilibiliAPI.ajaxWithCommonArgs({
							method: "POST",
							url: "xlive/lottery-interface/v1/Anchor/Join",
							data: data
						})
					},
					title_update: (anchor_list, room_id) => {
						let data = {
							room_id: room_id,
							title: anchor_list,
							platform: "pc",
							csrf_token: csrf_token,
							csrf: csrf_token,
							visit_id: getvisit_id(),
						};
						return BilibiliAPI.ajax({
							method: "POST",
							url: "room/v1/Room/update",
							data: data
						})
					},
					description_update: (anchor_list, room_id) => {
						let data = {
							room_id: room_id,
							description: anchor_list,
							csrf_token: csrf_token,
							csrf: csrf_token,
						};
						return BilibiliAPI.ajax({
							method: "POST",
							url: "room/v1/Room/update",
							data: data
						})
					},
					uid_info: (uid) => {//通过uid获取真实roomid，直播状态等
						let data = {
							mid: uid,
						};
						return BilibiliAPI.ajax({
							method: "get",
							url: "//api.bilibili.com/x/space/acc/info",
							data: data
						})
					},
					medal: (i = 1, e = 10) => BilibiliAPI.ajax({
						url: "i/api/medal",
						data: {
							page: i,
							pageSize: e
						}
					}),
					get_home_medals: (page) => BilibiliAPI.ajax({
						url: "fans_medal/v1/fans_medal/get_home_medals",
						data: {
							uid:Live_info.uid,
							source:2,
							need_rank:false,
							master_status:0,
							page: page
						}
					}),
					guards: (i = 1, e = 10) => BilibiliAPI.ajax({
						url: "xlive/web-ucenter/user/guards",
						data: {
							page: i,
							page_size: e
						}
					}),
					getFollowings: (i) => BilibiliAPI.ajax({
						url: "xlive/web-ucenter/user/following",
						data: {
							page: i,
							page_size: 9,
						}
					}),
					getRoomBaseInfo: (i, e = "link-center") => BilibiliAPI.ajax({
						url: "xlive/web-room/v1/index/getRoomBaseInfo",
						data: {
							room_ids: i,
							req_biz: e
						}
					}),
					AnchorRecord: (i = 1) => BilibiliAPI.ajax({ //天选
					url: "xlive/lottery-interface/v1/Anchor/AwardRecord",
					data: {
					page: i,
				}
			}),
			following_live: (i = 1) => BilibiliAPI.ajax({ //关注的正在直播的房间
			url: "xlive//web-ucenter/user/following",
			data: {
			page: i,
			page_size: 9
		}
		}),
		awardlist: (i = 1) => BilibiliAPI.ajax({ //金宝箱
			url: "lottery/v1/Award/award_list",
			data: {
				page: i,
				month: mm,
			},

		}),
			getUserInfo: i => BilibiliAPI.ajax({
				url: "User/getUserInfo?ts=" + i
			}),
	},
	},
		// ajax调用B站API
		runUntilSucceed: (callback, delay = 0, period = 50) => {
			setTimeout(() => {
				if (!callback())
					BilibiliAPI.runUntilSucceed(callback, period, period);
			}, delay);
		},
			processing: 0,
				ajax: (settings) => {
					if (settings.xhrFields === undefined)
						settings.xhrFields = {};
					settings.xhrFields.withCredentials = true;
					jQuery.extend(settings, {
						url: (settings.url.substr(0, 2) === '//' ? '' : '//api.live.bilibili.com/') + settings.url,
						method: settings.method || 'GET',
						crossDomain: true,
						dataType: settings.dataType || 'json'
					});
					const p = jQuery.Deferred();
					BilibiliAPI.runUntilSucceed(() => {
						if (BilibiliAPI.processing > 8)
							return false;
						++BilibiliAPI.processing;
						return jQuery.ajax(settings).then((arg1, arg2, arg3) => {
							--BilibiliAPI.processing;
							p.resolve(arg1, arg2, arg3);
							return true;
						}, (arg1, arg2, arg3) => {
							--BilibiliAPI.processing;
							p.reject(arg1, arg2, arg3);
							return true;
						});
					});
					return p;
				},
					ajaxWithCommonArgs: (settings) => {
						if (!settings.data)
							settings.data = {};
						settings.data.csrf = csrf_token;
						settings.data.csrf_token = csrf_token;
						settings.data.visit_id = getvisit_id();
						return BilibiliAPI.ajax(settings);
					},
						// 以下按照URL分类
						gift: {
							bag_list: () => {
								// 获取包裹礼物列表
								return BilibiliAPI.ajax({
									url: 'gift/v2/gift/bag_list'
								});
							},
								bag_send: (uid, gift_id, ruid, gift_num, bag_id, biz_id, rnd, platform = 'pc', biz_code = 'Live', storm_beat_id = 0, price = 0,send_ruid = 0) => {
									// 送出包裹中的礼物
									return BilibiliAPI.ajaxWithCommonArgs({
										method: 'POST',
										url: 'xlive/revenue/v1/gift/sendBag',
										data: {
											uid: uid,
											gift_id: gift_id,
											ruid: ruid,
											gift_num: gift_num,
											bag_id: bag_id,
											platform: platform,
											biz_code: biz_code,
											biz_id: biz_id, // roomid
											rnd: rnd,
											storm_beat_id: storm_beat_id,
											metadata: '',
											price: price,
											send_ruid:send_ruid
										}
									});
								},
						},

							live_user: {
								get_anchor_in_room: (roomid) => {
									return BilibiliAPI.ajax({
										url: 'live_user/v1/UserInfo/get_anchor_in_room?roomid=' + roomid
									});
								},
									get_info_in_room: i => BilibiliAPI.ajax({
										url: "live_user/v1/UserInfo/get_info_in_room?roomid=" + i
									}),
							},
								pay: {
									silver2coin: (platform = 'pc') => {
										// 银瓜子兑换硬币，700银瓜子=1硬币
										return BilibiliAPI.ajaxWithCommonArgs({
											method: 'POST',
											url: 'xlive/revenue/v1/wallet/silver2coin',
										});
									},
										silver2coin_old: (platform = 'pc') => {
											// 银瓜子兑换硬币，700银瓜子=1硬币
											return BilibiliAPI.ajaxWithCommonArgs({
												method: 'POST',
												url: 'pay/v1/Exchange/silver2coin',
												data: {
													platform: platform
												}
											});
										}
								},
									lottery: {
										box: {
											getRoomActivityByRoomid: (roomid) => {
												// 获取房间特有的活动 （实物抽奖）
												return BilibiliAPI.ajax({
													url: 'lottery/v1/box/getRoomActivityByRoomid?roomid=' + roomid
												});
											},
												getStatus: (aid) => {
													// 获取活动信息/状态
													return BilibiliAPI.ajax({
														url: 'xlive/lottery-interface/v2/Box/getStatus',
														data: {
															aid: aid,
														}
													});
												},
													draw: (aid, number = 1) => {
														// 参加实物抽奖
														return BilibiliAPI.ajax({
															url: 'xlive/lottery-interface/v2/Box/draw',
															data: {
																aid: aid,
																number: number
															}
														});
													},
														getWinnerGroupInfo: (aid, number = 1) => {
															// 获取中奖名单
															return BilibiliAPI.ajax({
																url: 'xlive/lottery-interface/v2/Box/getWinnerGroupInfo',
																data: {
																	aid: aid,
																	number: number
																}
															});
														}
										},
									},

										room: {
											get_info: (room_id, from = 'room') => {
												return BilibiliAPI.ajax({
													url: 'room/v1/Room/get_info',
													data: {
														room_id: room_id,
														from: from
													}
												});
											},
												room_entry_action: (room_id, platform = 'pc') => {
													return BilibiliAPI.ajaxWithCommonArgs({
														method: 'POST',
														url: 'room/v1/Room/room_entry_action',
														data: {
															room_id: room_id,
															platform: platform
														}
													});
												},
										},

											sendLiveDanmu: (msg, roomid) => {
												return BilibiliAPI.ajax({
													method: 'POST',
													url: 'msg/send',
													data: {
														color: '4546550',
														fontsize: '25',
														mode: '1',
														msg: msg,
														rnd: ts_s(),
														roomid: roomid,
														bubble: '0',
														csrf: csrf_token,
														csrf_token: csrf_token,
													}
												});
											},
												sendLiveDanmu_dm_type: (msg, roomid) => {
													return BilibiliAPI.ajax({
														method: 'POST',
														url: 'msg/send',
														data: {
															color: '16777215',
															fontsize: '25',
															mode: '1',
															dm_type:'1',
															msg: msg,
															rnd: ts_s(),
															roomid: roomid,
															bubble: '0',
															csrf: csrf_token,
															csrf_token: csrf_token,
														}
													});
												},
													anchor_postdiscuss: (discuss, oid) => { //发送评论
														if (oid == 0)
															return;
														return BilibiliAPI.ajax({
															method: 'POST',
															url: '//api.bilibili.com/x/v2/reply/add',
															data: {
																oid: oid,
																type: '12',
																message: discuss,
																plat: '1',
																ordering: 'time',
																jsonp: 'jsonp',
																csrf: csrf_token,
															}
														});
													},

														sendMsg: (msg) => {
															return BilibiliAPI.ajax({
																method: "POST",
																url: "//api.vc.bilibili.com/web_im/v1/web_im/send_msg ",
																data: {
																	"msg[sender_uid]": msg.sender_uid,
																	"msg[receiver_id]": msg.receiver_id,
																	"msg[receiver_type]": msg.receiver_type,
																	"msg[msg_type]": msg.msg_type,
																	"msg[msg_status]": msg.msg_status,
																	"msg[content]": msg.content,
																	"msg[timestamp]": ts_s(),
																	"msg[dev_id]": msg.dev_id,
																	build: 0,
																	mobi_app: "web",
																	csrf_token: csrf_token,
																	csrf: csrf_token,
																}
															})
														},

															getCookie: (name) => {
																let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
																if (arr != null)
																	return unescape(arr[2]);
																return false;
															}
							}
	})();
	(function () {
		let space = window.location.href.indexOf('space.bilibili.com') > -1;
		if(space){
			let left = $(window).width() / 2
			let btn = $(`<button id='follow' style="position: absolute;top:350px;left: ${left}px;z-index:999;background-color:Gainsboro;color:#000000;
	border-radius: 4px;border: none;padding: 5px;cursor: pointer;">取关当前页面当前分组的当前列表</button>`);
			$('body').append(btn);
			btn.click(function () {
				let r = confirm("点击确定，取关当前分组当前列表!");
				if (r == true) {
					let uf = $(".be-dropdown-item:contains('取消关注')")
					let l = uf.length;
					for (let i = 0; i < l; i++) {
						setTimeout(() => uf[i].click(), i * 1000)
					}
				}
			});
			$('#follow').hide()
			setInterval(function() {
				let fansfollow = window.location.href.indexOf('fans') > -1 && window.location.href.indexOf('follow') > -1;
				if (fansfollow) {
					$('#follow').show()
				}else{
					$('#follow').hide()
				}
			},200)
		}
	})();
	/**
	https://github.com/turuslan/HackTimer 删减
	 */
	(function (workerScript) {
		let space = window.location.href.indexOf('space.bilibili.com') > -1;
		if (space) return console.log('space.bilibili.com',new Date())
		try {
			var blob = new Blob(["\
	var fakeIdToId = {};\
	onmessage = function (event) {\
	var data = event.data,\
	name = data.name,\
	fakeId = data.fakeId,\
	time;\
	if(data.hasOwnProperty('time')) {\
	time = data.time;\
	}\
	switch (name) {\
	case 'setTimeout':\
	fakeIdToId[fakeId] = setTimeout(function () {\
	postMessage({fakeId: fakeId});\
	if (fakeIdToId.hasOwnProperty (fakeId)) {\
	delete fakeIdToId[fakeId];\
	}\
	}, time);\
	break;\
	case 'clearTimeout':\
	if (fakeIdToId.hasOwnProperty (fakeId)) {\
	clearTimeout(fakeIdToId[fakeId]);\
	delete fakeIdToId[fakeId];\
	}\
	break;\
	}\
	}\
	"]);
			// Obtain a blob URL reference to our worker 'file'.
			workerScript = window.URL.createObjectURL(blob);
		} catch (error) {
			/* Blob is not supported, use external script instead */
		}
		var worker,
			fakeIdToCallback = {},
			lastFakeId = 0,
			maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
			logPrefix = 'HackTimer.js by turuslan: ';
		if (typeof(Worker) !== 'undefined') {
			function getFakeId() {
				do {
					if (lastFakeId == maxFakeId) {
						lastFakeId = 0;
					} else {
						lastFakeId++;
					}
				} while (fakeIdToCallback.hasOwnProperty(lastFakeId));
				return lastFakeId;
			}
			try {
				worker = new Worker(workerScript);
				window.setTimeout = function (callback, time /* , parameters */) {
					var fakeId = getFakeId();
					fakeIdToCallback[fakeId] = {
						callback: callback,
						parameters: Array.prototype.slice.call(arguments, 2),
						isTimeout: true
					};
					worker.postMessage({
						name: 'setTimeout',
						fakeId: fakeId,
						time: time
					});
					return fakeId;
				};
				window.clearTimeout = function (fakeId) {
					if (fakeIdToCallback.hasOwnProperty(fakeId)) {
						delete fakeIdToCallback[fakeId];
						worker.postMessage({
							name: 'clearTimeout',
							fakeId: fakeId
						});
					}
				};
				worker.onmessage = function (event) {
					var data = event.data,
						fakeId = data.fakeId,
						request,
						parameters,
						callback;
					if (fakeIdToCallback.hasOwnProperty(fakeId)) {
						request = fakeIdToCallback[fakeId];
						callback = request.callback;
						parameters = request.parameters;
						if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
							delete fakeIdToCallback[fakeId];
						}
					}
					if (typeof(callback) === 'string') {
						try {
							callback = new Function(callback);
						} catch (error) {
							console.log(logPrefix + 'Error parsing callback code string: ', error);
						}
					}
					if (typeof(callback) === 'function') {
						callback.apply(window, parameters);
					}
				};
				worker.onerror = function (event) {
					console.log(event);
				};
				console.log(logPrefix + 'Initialisation succeeded');
			} catch (error) {
				console.log(logPrefix + 'Initialisation failed');
				console.error(error);
			}
		} else {
			console.log(logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
		}
	})('HackTimerWorker.js');