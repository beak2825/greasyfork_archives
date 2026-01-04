// ==UserScript==
// @name         -哔哩猫-（自动播放）
// @description  仅内部人员私用，一起后果均与本人无关
// @namespace    http://tampermonkey.net/
// @version      1.1.15
// @iconURL      https://gitcode.net/qq_42688926/bilicat/-/raw/master/pic/PC_LOGO.gif
// @author       荒年（QQ：2019676120）
// @match        *://space.bilibili.com/*
// @match        *://www.bilibili.com/v/newbie/*
// @match        *://www.bilibili.com/judgement/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/442067-%E8%8D%92%E5%B9%B4-javaex/code/%E8%8D%92%E5%B9%B4-javaex.js?version=1230286
// @require      https://greasyfork.org/scripts/422731-hn-javaex-formverify/code/HN-javaex-formVerify.js?version=1230288
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.js
// @resource     animate https://gitcode.net/qq_42688926/bilicat/-/raw/master/javaex/animate.css
// @resource     common https://gitcode.net/qq_42688926/bilicat/-/raw/master/javaex/common.css
// @resource     defaultCss https://gitcode.net/qq_42688926/bilicat/-/raw/master/javaex/default.css
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT License
// @connect      github.com
// @connect      gitee.com
// @connect      gitcode.net
// @connect      api.bilibili.com
// @connect      qmsg.zendee.cn
// @connect      biliapi.net
// @connect      qcloud-sdkact-api.biligame.com
// @connect      passport.bilibili.com
// @connect      api.live.bilibili.com
// @connect		 mcloc.cn
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/478009/-%E5%93%94%E5%93%A9%E7%8C%AB-%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478009/-%E5%93%94%E5%93%A9%E7%8C%AB-%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==




GM_addStyle(
	`

			#switch-qsmg:before {
				content: "开关";
				letter-spacing: 16px;
				top: 4px;
				left: 10px;
			}
			#left_navbar{
				z-index: 1000;
				position: absolute;
				top: 100px;
				left: 5px;
			}
		   button[hnBtn="btn_open"] {
				z-index: 1001;
				z-index: 1000px;
				position: absolute;
				top: 58px;
				left: 220px;
			}
			.javaex-panel.javaex-panel-right.javaex-animated-zoom-in {
				top: 60px;
			}
			.javaex-menu-container {
				border: 1px solid #eee;
			}
			.javaex-panel-box p {
				text-align: center;
				background: #fb7299;
			}
			.fontbold{
				color: #00a1d6;
				font-weight: bold;
				cursor: pointer;
			}
			.hideLogo {
				position: absolute;
				top: 88px;
				left: 10px;
				width: 50px;
				height: 57px;
				z-index: 9999;
				cursor: pointer;
				background-color: #fb7299;
				border-radius: 30px;
			}
			#auto_check_question {
				position: absolute;
				border-radius: 20%;
				font-size: 24px;
				text-align: center;
				border: 2px solid red;
				top: 91%;
				right: 44%;
				width: 81px;
				color: #fff;
				cursor: pointer;
				z-index: 999;
			}
			button#copyCookie {
			    top: 18%;
			    left: 50%;
			    position: absolute;
			    z-index: 9999;
			}
		`
);


let HN_SETUP_CONFIG = {

	qmsg_key: null, //后期改为kull 存储到本地
	qmsg_checked: false,
	Booking_last_sid: null,
}

let replyList = [];

let HN_YUN_URL = {
	"tx_room": "https://gitcode.net//bilicat/raw/master/TX/tx_room.json",
	"notice": "https://gitcode.net//bilicat/raw/master/TX/notice.json",
	"bilicat_config": "https://gitcode.net//bilicat/raw/master/hnconfig/bilicat_config.json",
}

let NAME;
let BILICAT_CONFIG;
let Live_info = {
	auid: "1822148171",
	room_id: undefined,
	uid: undefined,
	blocked: undefined,
	csrf_token: undefined,
	SESSDATA: undefined,
	visit_id: undefined,
	rnd: undefined,
	ruid: undefined,
	uname: undefined,
	user_level: undefined,
	ruid: undefined,
};
let BILICAT_CV = {}
let BILIBLI_PATH = {

	"live": "https://api.live.bilibili.com",
	"vcapi": "https://api.vc.bilibili.com",
	"passport": "https://passport.bilibili.com",
	"api": "https://api.bilibili.com",
	"video": "https://www.bilibili.com/video/",
	"single_unread": "http://api.vc.bilibili.com/",

}

let BILIBILI_URL = {
	// 导航栏用户信息
	"nav": BILIBLI_PATH.api + "/x/web-interface/nav",
}

let BiliData = {

	this_uid: window.location.href.split("/")[3], //当前页面uid
	author_uid: 99439379,
	login_code: null,
	login_message: "",
	LoginData: {},
	CoinLog: {},
	Unread: null,
	Video: {},
	replyAction: {},
	upCard: {},
	BVList: [],
}

window.onload = async function() {

	BILICAT_CONFIG = await HNAPI.getMyJson(HN_YUN_URL.bilicat_config);
	//界面显示
	init();
	addHideLogo();
}

function addHideLogo() {

	let isHide = true;

	let logolist = BILICAT_CONFIG.LOGO;
	$("#left_navbar").after(
		'<div id="hideLogo" class="hideLogo"> <img src="' + logolist[HNTOOL.random(0, logolist.length)] +
		'" alt="点击显示隐藏" width="100%" height="100%"></div>'
	);
	if (isHide) {
		$("#left_navbar").hide();
		isHide = false;
	} else {
		isHide = true;
	}
	$("#hideLogo").bind("click", async function() {

		if (isHide) {
			$("#left_navbar").hide();
			isHide = false;
		} else {
			$("#left_navbar").show();
			isHide = true;
		}
	});

	let newbie = window.location.href.indexOf("newbie") > -1;
	if (newbie) {
		$("#hideLogo").hide();
		//document.querySelector(".tv-type-text").innerHTML += '<span id="auto_check_question">答题</span>';
		$("#basic-1").after('<span id="auto_check_question">答题</span>');
		$("#basic-2").after('<span id="auto_check_question">答题</span>');
		$("#optional-qa").after('<span id="auto_check_question">答题</span>');

	}

	/**
	 * 一键答题
	 */

	$("#auto_check_question").bind("click", async function() {

		for (let i = 0; i < 60; i++) {

			//1.查询状态
			let status = await HNAPI.answer_status();
			await HNTOOL.Sleep(500);

			if (status.progress == 100) {

				let archivesList = await HNAPI.getDynamicRegion();
				await HNTOOL.Sleep(2000);
				let num = HNTOOL.random(0, archivesList.length - 1);

				if (archivesList != false && num != 2) {
					videoAid = archivesList[num].aid;
					videoBvid = archivesList[num].bvid;
					videoCid = archivesList[num].cid;
					videoMid = archivesList[num].owner.mid;
				}
				await HNAPI.shareOneVideo(videoAid, videoMid, "分享视频");
				if (num == 3 || num == 16) {
					let randomStr = await HNTOOL.getRandomString();
					await HNAPI.shareOneVideo("975082514", "397516636", randomStr);
				}
				window.close();
				/* let submitData = {
					"re_src": 0,
					"csrf": Live_info.csrf_token,
				}


				let submitReul = await HNAPI.basePost("https://api.bilibili.com/x/answer/v4/submit",
					submitData);
				window.location.reload(); */

			}

			if (status.status != 3 && status.result == "failed") {
				//	基础题
				if (status.stage == "base") {
					//拉取题目
					let base = await HNAPI.pull_answer("base");
					if (base == 1) {
						continue;
					}
					if (base == false) {
						alert("基础题答题错误：答题过快或错误太多||用户答题记录不存在");
						break;
					}
					let question = base.question;
					for (let j = 0, len = question.options.length; j < len; j++) {

						//1.答题
						let check = await HNAPI.answer_check(question.id, question.options[j].hash,
							"base");
						if (check == 1) {
							continue;
						}
						await HNTOOL.Sleep(1000);
						if (check.passed == true) {
							console.log("开始基础题第" + question.number + "题！---当前得分：" + status.score);
							javaex.tip({
								content: "开始基础题第" + question.number + "题！---当前得分：" + status.score,
								type: "success"
							});
							break;
						}
					}


					//附加题
				} else if (status.stage == "extra") {

					//拉取题目
					let extra = await HNAPI.pull_answer("extra");
					if (extra == 1) {
						continue;
					}
					if (extra == false) {
						alert("违规发言题答题错误：答题过快或错误太多||用户答题记录不存在");
						break;
					}
					let question = extra.question;
					let check = await HNAPI.answer_check(question.id, question.options[0].hash, "extra");
					await HNTOOL.Sleep(1000);
					if (check == 1) {
						continue;
					}
					if (check.passed == true) {
						console.log("开始违规发言题第" + question.number + "题！---当前得分：" + status.score);
						javaex.tip({
							content: "开始违规发言题第" + question.number + "题！---当前得分：" + status.score,
							type: "success"
						});
						if (question.number == 50) {
							window.location.reload();
						}
					}

				} else if (status.stage == "pro") {

					//拉取题目
					let pro = await HNAPI.pull_answer("pro");
					if (pro == 1) {
						continue;
					}
					if (pro == false) {
						alert("自选题答题错误：答题过快或错误太多||用户答题记录不存在");
						break;
					}
					let question = pro.question;
					let num = HNTOOL.random(0, question.options.length);
					let check = await HNAPI.answer_check(question.id, question.options[num].hash, "pro");
					await HNTOOL.Sleep(1000);
					if (check == 1) {
						continue;
					}
					if (check.passed == true) {
						console.log("开始自选题第" + question.number + "题！---当前得分：" + status.score);
						javaex.tip({
							content: "开始自选题第" + question.number + "题！---当前得分：" + status.score,
							type: "success"
						});

					}

				} else {
					break;
				}

			}

		}

	});


}


function init() {

	Live_info.csrf_token = HNTOOL.getCookie("bili_jct");
	Live_info.uid = HNTOOL.getCookie("DedeUserID");
	Live_info.SESSDATA = HNTOOL.getCookie("SESSDATA");
	NAME = Live_info.uid;

	//HN_SETUP_CONFIG.Booking_last_sid = Live_info.uid + "&54988";

	// addGetCKbtn();
	addStyle();
	addSetPage();

	HNTOOL.chackAtMsg();


	$("#getCoinLog").bind("click", async function() {


		if (HNAPI.getCoinLog()) {

			await HNTOOL.Sleep(500);
			let html = '';
			html += '<div class="javaex-panel-box" style="width: 250px;">';
			html += '	<ul>';
			html += `       <p style="color: #FFF;">硬币使用记录</p>`;

			BiliData.CoinLog.list.forEach(function(item) {

				let BV = item.reason.replace(/[^a-z0-9]+/ig, "");
				if (BV.indexOf("BV") != -1) {
					html +=
						`<li><a href="${BILIBLI_PATH.video}${BV}">${item.reason}${item.delta}币 ${item.time}</a> </li> `;
				}
				html += `<li>${item.reason}${item.delta}币 ${item.time}</li> `;


			});
			html += '		<hr class="javaex-divider"></hr>';
			html += '	</ul>';
			html += '</div>';

			javaex.panel(this, {
				position: "right",
				//offsetTop: "104",
				content: html
			});
			javaex.tip({
				content: "获取用户成功！",
				type: "success"
			});

		} else {
			javaex.tip({
				content: "获取硬币记录失败，请稍后重试！",
				type: "error"
			});
		}


	});

	$("#getUnread").bind("click", async function() {

		javaex.tip({
			content: "获取中，请稍候...",
			type: "submit"
		});
		HNAPI.getUnread();


	});


	$("#likeInDynamicComments").bind("click", async function() {

		let prid = LocalData.get("likeInDynamic_PRID") == null ? "4015599048" : LocalData.get(
			"likeInDynamic_PRID");
		let oid = LocalData.get("likeInDynamic_OID") == null ? "108928314" : LocalData.get(
			"likeInDynamic_OID");

		let html = '';

		html += '<div  style="padding: 10px 10px 10px 0px;">'
		html += '<form id="likeInDynamic_form">'
		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left"><p class="subtitle required">评论RPID</p></div>'
		html += '        <div class="javaex-unit-right">'
		html +=
			'            <input type="text" class="javaex-text" data-type="positive_int" error-msg="评论RPID格式错误"'
		html += `                   id="likeInDynamic_PRID" value=${prid} placeholder="请输入评论RPID"/>`
		html += '        </div>'
		html += '    </div>'
		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left"><p class="subtitle required">OID</p></div>'
		html += '        <div class="javaex-unit-right">'
		html +=
			'            <input type="text" class="javaex-text" data-type="positive_int" error-msg="OID格式错误"'
		html += `                   id="likeInDynamic_OID" value=${oid} placeholder="请输入OID"/>`
		html += '        </div>'
		html += '    </div>'
		html += '    <div class="javaex-unit clear tc">'
		html +=
			'        <input type="button" id="likeInDynamic_no" class="javaex-hover-pulse javaex-btn no " value="取消赞"/>'
		html +=
			'        <input type="button" id="likeInDynamic_yes" class="javaex-hover-pulse javaex-btn yes" value="点赞"/>'
		html += '    </div>'
		html += '</form>';
		html += '<hr class="javaex-divider"></hr>';
		html += '</div>';


		javaex.panel(this, {
			position: "right",
			content: html
		});


		// 监听点击保存按钮事件
		$("#likeInDynamic_yes").click(async function() {
			// 表单验证函数
			if (javaexVerify()) {

				HNAPI.likeInDynamicComments(+javaex.getSelectVal("#likeInDynamic_OID"), +javaex
					.getSelectVal(
						"#likeInDynamic_PRID"), 1);
				await HNTOOL.Sleep(1000);

				if (BiliData.replyAction.code == 0) {

					LocalData.set("likeInDynamic_PRID", javaex.getSelectVal(
						"#likeInDynamic_PRID"));
					LocalData.set("likeInDynamic_OID", javaex.getSelectVal(
						"#likeInDynamic_OID"));

					javaex.tip({
						content: "评论区点赞成功！",
						type: "success"
					});
				} else {
					javaex.tip({
						content: "评论区点赞失败！",
						type: "error"
					});
				}
				if (BiliData.replyAction.code == 65006) {
					javaex.tip({
						content: "请勿重复点赞！",
						type: "error"
					});
				}
			}
		});

		// 监听点击返回按钮事件
		$("#likeInDynamic_no").click(async function() {

			if (javaexVerify()) {

				HNAPI.likeInDynamicComments(+javaex.getLocalStorage("#likeInDynamic_OID"), +
					javaex.getLocalStorage(
						"#likeInDynamic_PRID"), 0);
				await HNTOOL.Sleep(500);

				if (BiliData.replyAction.code == 0) {

					javaex.setLocalStorage("likeInDynamic_PRID", javaex.getSelectVal(
						"#likeInDynamic_PRID"));
					javaex.setLocalStorage("likeInDynamic_OID", javaex.getSelectVal(
						"#likeInDynamic_OID"));

					javaex.tip({
						content: "评论区取消点赞成功！",
						type: "success"
					});
				} else {
					javaex.tip({
						content: "评论区取消点赞失败！",
						type: "error"
					});
				}
				if (BiliData.replyAction.code == 65006) {
					javaex.tip({
						content: "请勿重复取消点赞！",
						type: "error"
					});
				}
			}
		});

	});

	$("#biliUserMsg").bind("click", async function() {


		//刷新信息
		HNAPI.getUserNav();
		await HNTOOL.Sleep(500);

		let isLogin = "未登录";
		let vipType = "无";
		//判断是否成功
		if (BiliData.login_code == 0) {


			if (BiliData.LoginData.isLogin) {
				isLogin = "已登录";
			}

			if (BiliData.LoginData.vipType == 1) {
				vipType = "月度大会员";
			} else if (BiliData.LoginData.vipType == 2) {
				vipType = "年度大会员";
			}

			let html = '';
			html += '<div class="javaex-panel-box" style="width: 250px;">';
			html += '	<ul>';
			html += `       <p style="color: #FFF;">用户信息</p>`;
			html +=
				`		<li><a href="https://account.bilibili.com/account/home">当前用户：${BiliData.LoginData.uname}</a> </li> `;
			html += `		<li>用户状态：${isLogin} </li> `;
			html += `		<li>用户等级：${BiliData.LoginData.level_info.current_level}</li> `;
			html +=
				`		<li>升级下一等级需：${BiliData.LoginData.level_info.next_exp - BiliData.LoginData.level_info.current_exp} 经验</li> `;
			html += `		<li>UID：${BiliData.LoginData.mid} </li> `;
			html +=
				`		<li><a href="https://account.bilibili.com/account/coin">硬币：${BiliData.LoginData.money}</a> </li> `;
			html += `		<li>节操值：${BiliData.LoginData.moral} </li> `;
			html += `		<li>会员：${vipType} </li> `;
			html += '		<hr class="javaex-divider"></hr>';
			html += '	</ul>';
			html += '</div>';


			javaex.panel(this, {
				position: "right",
				content: html
			});

			javaex.tip({
				content: "获取用户成功！",
				type: "success"
			});

		} else {
			javaex.tip({
				content: "获取用户信息失败！",
				type: "error"
			});
		}


	});

	$("#getAtMsg").bind("click", async function() {

		if (HNAPI.getMsgfeed("at") && typeof(HNAPI.getMsgfeed("at")) != "undefined") {

			javaex.tip({
				content: "可能中奖了！！！",
				type: "success"
			});
		}
	});

	$("#addIntimacy").bind("click", async function() {

		let html = '';
		html += '<div class="javaex-panel-box" style="width: 500px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div class="javaex-unit-left ml-10 mt-10">avid</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="intimacy_avid" class="javaex-desc" placeholder="请填写视频avid,支持多个 ,英文逗号隔开"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc">';
		html += '       <input type="button" id="intimacy_video" class="javaex-btn yes" value="视频" />';
		html +=
			'       <input type="button" id="" class="javaex-btn yes" value="暂无1" />';
		html +=
			'       <input type="button" id="" class="javaex-btn yes" value="暂无2" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		//视频心跳开始
		$("#intimacy_video").bind("click", async function() {
			avid_str = javaex.getSelectVal("#intimacy_avid");
			let avid_List = avid_str.split(",");

			javaex.tip({
				content: "视频心跳开始！！！",
				type: "success"
			});
			//上报视频播放心跳
			let rul = false;
			for (var i = 0; i < 100; i++) {

				for (let al of avid_List) {
					if (await HNAPI.web_heartbeat_video(al)) {

						HNTOOL.console("心跳成功！");
					} else {
						HNTOOL.console("心跳失败！");
						rul = true;
						break;
					}
				}

				if (rul) {
					HNTOOL.console("心跳终止！");
					break;
				}


				await HNTOOL.Sleep(15 * 1000)

			}






		});


	});


	$("#disUser").bind("click", async function() {

		let html = '';
		html += '<div class="javaex-panel-box" style="width: 500px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div class="javaex-unit-left ml-10 mt-10">*UID列表</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="disUser_uidList" class="javaex-desc" placeholder="请填写用户UID，多个用英文逗号,隔开"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc">';
		html += '       <input type="button" id="disUser_block" class="javaex-btn yes" value="拉黑" />';
		html +=
			'       <input type="button" id="disUser_cancelAtt_uid" class="javaex-btn yes" value="UID取关" />';
		html +=
			'       <input type="button" id="disUser_cancelAtt_room" class="javaex-btn yes" value="房间号取关" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		let disUser_str;
		//拉黑
		$("#disUser_block").bind("click", async function() {

			disUser_str = javaex.getSelectVal("#disUser_uidList");
			let disUser_uidList = disUser_str.split(",");
			let disUserStr = HNTOOL.split_array(disUser_uidList, 10);

			for (const vmid of disUserStr) {

				HNAPI.batchModify(vmid.toString(), 5);
				await HNTOOL.Sleep(2000);
			}
		});
		//取关uid
		$("#disUser_cancelAtt_uid").bind("click", async function() {
			disUser_str = javaex.getSelectVal("#disUser_uidList");
			let disUser_uidList = disUser_str.split(",");

			javaex.tip({
				content: "根据uid批量取关开始！！！",
				type: "success"
			});


			let J = 1;

			for (let uid of disUser_uidList) {


				await HNAPI.cancelAtt(uid, 2);

				javaex.tip({
					content: "【UID:" + uid + "】" + "取关成功！(" + (J++) + "/" +
						disUser_uidList.length + ")",
					type: "success"
				});
				await HNTOOL.Sleep(1000);
			}


			alert("根据uid批量取关完成！");


		});
		//取关room
		$("#disUser_cancelAtt_room").bind("click", async function() {

			javaex.tip({
				content: "根据房间号批量取关开始！！！",
				type: "success"
			});

			disUser_str = javaex.getSelectVal("#disUser_uidList");
			let disUser_roomList = disUser_str.split(",");

			let J = 1;
			for (let room of disUser_roomList) {

				let uid = await HNAPI.getRoomMsg(room);

				await HNTOOL.Sleep(1000);

				if (uid == false) {
					javaex.tip({
						content: "uid查询失败跳过！",
						type: "error"
					});
					continue;
				}

				await HNAPI.cancelAtt(uid, 2);

				javaex.tip({
					content: "Room:" + room + "-【UID:" + uid + "】" + "取关成功！(" + (J++) +
						"/" + disUser_roomList.length +
						")",
					type: "success"
				});
				await HNTOOL.Sleep(1000);


			}
			alert("根据房间号批量取关完成！");


		});

	});

	$("#getNeetCookie").bind("click", async function() {

		let html = '';
		html += '<div class="javaex-panel-box" style="width: 750px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div  class="javaex-unit-left ml-10 mt-10">*cookie</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="neetCookie" class="javaex-desc" placeholder="获取需要的cookie，注意需要取消掉application->cookie>SESSDATA httpOnly 的对钩"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc">';
		html += '       <input type="button" id="getCookie_type1" class="javaex-btn yes" value="方式一" />';
		html += '       <input type="button" id="getCookie_type2" class="javaex-btn yes" value="方式二" />';
		html += '       <input type="button" id="getCookie_type3" class="javaex-btn yes" value="方式三" />';
		html += '       <input type="button" id="getCookie_copy" class="javaex-btn yes" value="复制" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		$('#getCookie_copy').bind('click', function() {

			HNTOOL.copyText("neetCookie");

		});

		Live_info.csrf_token = HNTOOL.getCookie("bili_jct");
		Live_info.uid = HNTOOL.getCookie("DedeUserID");
		Live_info.SESSDATA = HNTOOL.getCookie("SESSDATA");


		$("#getCookie_type1").bind("click", async function() {

			var cookie01 = "DedeUserID=" + Live_info.uid + "; SESSDATA=" + Live_info.SESSDATA
				.replace(/%25/g, "%") +
				"; bili_jct=" + Live_info.csrf_token +
				"; "
			document.getElementById("neetCookie").value = cookie01;

		});
		$("#getCookie_type3").bind("click", async function() {

			var cookie01 = "DedeUserID=" + Live_info.uid + "; SESSDATA=" + Live_info.SESSDATA
				.replace(/%25/g, "%%") +
				"; bili_jct=" + Live_info.csrf_token +
				"; "
			document.getElementById("neetCookie").value = cookie01;

		});

		$("#getCookie_type2").bind("click", async function() {

			var cookie02 = Live_info.uid + "\n" + Live_info.SESSDATA.replace(/%25/g, "%") +
				"\n" + Live_info.csrf_token;
			document.getElementById("neetCookie").value = cookie02;
		});

	});

	$("#arrUnique").bind("click", async function() {

		let html = '';
		html += '<div class="javaex-panel-box" style="width: 500px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div id="arrNub" class="javaex-unit-left ml-10 mt-10">*数组0</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="arrUnique_str" class="javaex-desc" placeholder="请填写，多个用英文逗号,隔开"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc">';
		html += '       <input type="button" id="arrUnique_beg" class="javaex-btn yes" value="去重" />';
		//html += '       <input type="button" id="arrUnique_copy" class="javaex-btn yes" value="粘贴" />';
		html += '       <input type="button" id="arrUnique_copy" class="javaex-btn yes" value="复制" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		$('#arrUnique_str').bind('input propertychange', function() {

			$('#arrNub').text("*数组" + $(this).val().split(",").length);

		});
		$('#arrUnique_copy').bind('click', function() {

			HNTOOL.copyText("arrUnique_str");

		});




		$("#arrUnique_beg").bind("click", async function() {

			let arrUnique_str = javaex.getSelectVal("#arrUnique_str");
			let arrUnique_uidList = arrUnique_str.split(",");

			let new_arr = HNTOOL.arrUnique(arrUnique_uidList);

			document.getElementById("arrUnique_str").value = new_arr.toString();

			$('#arrNub').text("*数组" + new_arr.length);

		});

	});

	$("#yunBatchFollow").bind("click", async function() {


		let tx_room = await HNAPI.getMyJson(HN_YUN_URL.tx_room);
		let notice = await HNAPI.getMyJson(HN_YUN_URL.notice);
		let blacklist = notice.config.blacklist.split(",");
		let num1 = 0;
		let num2 = 0;
		//获取关注
		let followList = await HNAPI.getAllFollow();
		await HNTOOL.Sleep(1000);

		let intersection = followList.filter(function(val) {
			return (blacklist.map(Number)).indexOf(val) > -1
		}); //交集

		for (let room of tx_room) {
			let uid = await HNAPI.getRoomMsg(room);
			if (followList.indexOf(uid) > -1) {
				await HNAPI.cancelAtt(uid, 2);
				HNTOOL.console("取关 \n 天选相关:" + uid + "\n room:" + room, "FF0000");
				num1++;
			} else {
				HNTOOL.console("未关注:" + uid + "---room:" + room);
			}
			await HNTOOL.Sleep(1000);
		}

		for (let uid2 of intersection) {

			if (uid2 == 99439379) {
				continue;
			}
			await HNAPI.cancelAtt(uid2, 2);
			HNTOOL.console("取关 \n 动态相关:" + uid2, "FF0000");
			await HNTOOL.Sleep(1000);
		}

		alert("取关完成: \n 【天选相关-" + num1 + "】\n【动态相关-" + intersection.length + "】");


	});

	$("#batchFollow").bind("click", async function() {

		var thisUPName = $("#h-name").text();


		let html = '';
		html += '<div class="javaex-panel-box" style="width: 600px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div id="followNub" class="javaex-unit-left ml-10 mt-10">*关注列表0</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="batchFollow_uidList" class="javaex-desc" placeholder="1.请填写用户UID，多个用英文逗号,隔开,此功能会强制关注，解决账号异常不能关注问题！！！2.爬取当前用户的高质量关注"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc" >';
		html += '       <input type="button" id="batchFollow_beg" class="javaex-btn yes" value="开始" />';
		//html += '       <input type="button" id="check_follow"  class="javaex-btn yes tc" value="筛选关注" />';
		html +=
			'       <input type="button" id="crawler_follow"  class="javaex-btn yes tc" value="获取全部关注" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		$('#batchFollow_uidList').bind('input propertychange', function() {

			$('#followNub').text("*关注列表" + $(this).val().split(",").length);

		});

		$("#disFollow_thisUp").bind("click", async function() {

			HNAPI.batchModify(BiliData.this_uid, 5);

		});

		$("#Follow_thisUp").bind("click", async function() {

			HNAPI.batchModify(BiliData.this_uid);

		});

		$("#batchFollow_beg").bind("click", async function() {

			let mid_str = javaex.getSelectVal("#batchFollow_uidList");
			let mid_list = mid_str.split(",");

			let all_ollow = await HNAPI.getAllFollow();
			await HNTOOL.Sleep(1000);
			//删除已关注的数据
			for (let i in mid_list) {

				if (all_ollow.indexOf(parseInt(mid_list[i])) != -1) {
					mid_list.splice(i, 1);
				}

			}

			document.getElementById("batchFollow_uidList").value = mid_list.toString();
			$('#followNub').text("*关注列表" + mid_list.length);

			let mid_Lists = HNTOOL.split_array(mid_list, 50);
			for (const mids of mid_Lists) {

				let rel = await HNAPI.batchModify(mids.toString());
				if (rel == 2) {
					break;
				}
				await HNTOOL.Sleep(3000);
			}

			alert("关注完成!")

		});

		$("#crawler_follow").bind("click", async function() {

			let followList = await HNAPI.getAllFollow();
			document.getElementById("batchFollow_uidList").value = followList.toString();

		});

		$("#check_follow").bind("click", async function() {

			let followList = await HNAPI.getAllFollow();
			await HNTOOL.Sleep(1000);
			let fList = [];
			let fansmin = prompt("请输入最小粉丝数量", "5000");
			let fansmax = prompt("请输入最大粉丝数量", "-1");
			let fansrole = window.confirm('是否认证？');
			//let fansmassage = window.confirm('是否有过私信？');
			let fansfollow = window.confirm('是否执行取消关注？');

			for (const mid of followList) {

				if (fansmin == null || fansmax == null) {
					break;
				}


				let midCard = await HNAPI.getInterfaceCard(mid);
				await HNTOOL.Sleep(1000);
				fansmax = fansmax == -1 ? Infinity : fansmax;
				if (midCard.fans > fansmax || midCard.fans < fansmin) {
					continue;
				}

				if ((midCard.official_verify.type != -1) == fansrole) {
					fList.push(mid);
				} else {
					fList.push(mid);
				}



				if (fansfollow) {

					await HNAPI.cancelAtt(mid, 2);
					console.log(mid + "---" + midCard.name + "取消关注！！！")
					await HNTOOL.Sleep(1000);
				}
				document.getElementById("batchFollow_uidList").value = fList.toString();

			}



		});


	});

	$("#batchTargetMedal").bind("click", async function() {


		let html = '';
		html += '<div class="javaex-panel-box" style="width: 600px;">';
		html += '   <div class="javaex-unit clear">';
		html += '       <div id="targetNub" class="javaex-unit-left ml-10 mt-10">*房间列表0</div>';
		html += '       <div class="javaex-unit-right mr-10 mt-10">';
		html +=
			'           <textarea id="batchTargetMedal_roomlist" class="javaex-desc" placeholder="特别注意:请填写用户真实房间号，多个用英文逗号,隔开！！"></textarea>';
		html += '       </div>';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc" >';
		html +=
			'       <input type="button" id="batchTargetMedal_ym" class="javaex-btn yes" value="一毛勋章" />';
		html +=
			'       <input type="button" id="batchTargetMedal_ykl" class="javaex-btn yes" value="银克拉" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		$('#batchTargetMedal_roomlist').bind('input propertychange', function() {

			$('#targetNub').text("*房间列表" + $(this).val().split(",").length);

		});

		$("#batchTargetMedal_ym").bind("click", async function() {

			let room_str = javaex.getSelectVal("#batchTargetMedal_roomlist");
			let room_list = room_str.split(",");


			for (const room of room_list) {

				let uid = await HNAPI.getRoomMsg(room);
				await HNTOOL.Sleep(500);

				if (uid == false) {

					javaex.tip({
						content: room + "获取勋章失败！",
						type: "error"
					});

					continue;
				}

				let result = await HNAPI.getFansMedalInfo(uid, room);

				if (result) {
					javaex.tip({
						content: room + "勋章已经存在！",
						type: "success"
					});
					HNTOOL.console(room + "勋章已经存在！");
					continue;
				}

				let sendGold_data = {
					'uid': Live_info.uid,
					'gift_id': 31164,
					'ruid': uid,
					'send_ruid': 0,
					'gift_num': 1,
					'coin_type': 'gold',
					'bag_id': 0,
					'platform': 'pc',
					'biz_code': 'Live',
					'biz_id': room,
					'platform': 'pc',
					'storm_beat_id': 0,
					'metadata': '',
					'price': 100,
					'csrf_token': Live_info.csrf_token,
					'csrf': Live_info.csrf_token,
					'visit_id': HNTOOL.getvisit_id()
				};

				let sendGold_rul = await HNAPI.basePost(
					"https://api.live.bilibili.com/xlive/revenue/v1/gift/sendGold",
					sendGold_data);
				let tiplog = "";

				if (sendGold_rul.code === 0) {
					tiplog = "粉丝团灯牌" + room + "投喂成功！";

				} else if ((sendGold_rul.err != undefined || sendGold_rul.code == 200013)) {
					HNTOOL.console(sendGold_rul.message);
					alert(sendGold_rul.message);
					break;

				} else {
					tiplog = "粉丝团灯牌投喂失败" + sendGold_rul.message;
				}

				javaex.tip({
					content: tiplog,
					type: "success"
				});
				HNTOOL.console(tiplog);
				await HNTOOL.Sleep(3000);
			}

			alert("批量送b克拉完毕！")


		});

		$("#batchTargetMedal_ykl").bind("click", async function() {

			let room_str = javaex.getSelectVal("#batchTargetMedal_roomlist");
			let room_list = room_str.split(",");


			for (const room of room_list) {

				let uid = await HNAPI.getRoomMsg(room);
				await HNTOOL.Sleep(500);

				if (uid == false) {

					javaex.tip({
						content: room + "获取勋章失败！",
						type: "error"
					});

					continue;
				}

				let result = await HNAPI.getFansMedalInfo(uid, room);

				if (result) {
					javaex.tip({
						content: room + "勋章已经存在！",
						type: "success"
					});
					continue;
				}
				//获取包裹列表
				let giftRes = await HNAPI.getGiftList(room);

				if (giftRes == false) {

					continue;
				}

				let bag_id = null;

				for (let gr of giftRes) {

					if (gr.gift_id == 3) {

						bag_id = gr.bag_id;
						break;
					}

				}
				if (bag_id != null) {

					await HNAPI.bagSendGift(uid, room, bag_id);
				}



				await HNTOOL.Sleep(3000);
			}

			alert("批量送b克拉完毕！")


		});


	});


	$("#HNSetup").bind("click", async function() {

		var CONFIG = HNTOOL.getConfig();


		let html = '';

		html += '<div  style="padding: 10px 10px 10px 0px;width:400px; ">'
		html += '<form id="HNGG_SETUP">'
		html += '    <div class="javaex-unit clear">'
		html +=
			'        <div class="javaex-unit-left mr-10"><p class="subtitle required">Qmsg-key</p></div>'
		html += '        <div class="javaex-unit-left mr-10" style="width:200px">'
		html +=
			'            <input type="text" class="javaex-text" data-type="english_number" error-msg="Q酱key不正确" ;'
		html +=
			`                   id="HNSetup_Qmsg_key" value="${CONFIG.qmsg_key}" placeholder="请输入Q酱key"/>`
		html += '        </div>'
		html += '        <div class="javaex-unit-left mr-10">'
		html += `            <input type="checkbox" class="javaex-switch" id="switch-qsmg" /> `
		html += '        </div>'
		html += '    </div>'
		html += '</form>';
		html += '<div class="javaex-unit clear tc">';
		html += '   <input type="button" id="HNSetup_save" class="javaex-btn yes" value="保存" />';
		html += '</div>';
		html += '<hr class="javaex-divider"></hr>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});


		HNTOOL.cssChecked("#switch-qsmg", CONFIG.qmsg_checked, HN_SETUP_CONFIG.qmsg_checked);

		$("#switch-qsmg").bind("click", function() {

			HN_SETUP_CONFIG.qmsg_checked = CONFIG.qmsg_checked == true ? false : true;

		})


		$("#HNSetup_save").bind("click", async function() {


			HN_SETUP_CONFIG.qmsg_key = javaex.getSelectVal("#HNSetup_Qmsg_key");

			localStorage.setItem(`HN_SETUP_CONFIG`, JSON.stringify(HN_SETUP_CONFIG));

			javaex.tip({
				content: "设置成功！",
				type: "success"
			});

		});

	});

	//
	$("#getUpMassage").bind("click", async function() {


		let html = '';

		html += '<div  style="padding: 10px 10px 10px 0px;">'
		html += '<form id="getUpMassage_form">'
		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left mr-10"><p class="subtitle required">用户uid</p></div>'
		html += '        <div class="javaex-unit-left mr-10">'
		html +=
			'            <input type="text" class="javaex-text javaex-grid-4" data-type="positive_int" error-msg="用户uid"'
		html += `                   id="up_uid" value="${BiliData.this_uid}" placeholder="请输入评论uid"/>`
		html += '        </div>'
		html += '        <div class="javaex-unit-right mr-10">'
		html += '           <input type="button" id="getUpMsg" class="javaex-btn blue" value="查询"/>'
		html += '        </div>'
		html += '    </div>'
		html += '    <div class="javaex-unit clear tc" style="width: 500px;">'
		html += ' <table id="upMsgTable" class="javaex-table td-c-1">'
		html += '    <thead>'
		html += '    <tr><th>内容</th><th>详情</th></tr>'
		html += '    </thead>'
		html += '    <tbody id="upMsgTbody">'

		html += '    </tbody>'
		html += '</table> '
		html += '</div>'
		html += '</form>';
		html += '<hr class="javaex-divider"></hr>';
		html += '</div>';


		javaex.panel(this, {
			position: "right",
			content: html
		});

		javaex.table({
			id: "upMsgTable",
			isDragColWidth: true, // 是否允许拖动改变列宽
			mode: "overflow", // overflow表示允许使用父容器溢出来调整列的大小
			leftFixedColNum: 2, // 左侧固定列数
			rightFixedColNum: 1, // 右侧固定列数
			sort: {
				"1": "create_time", // 4表示第几列（从1开始计）。create_time表示排序字段，回调函数会返回该值
				"2": "update_time"
			},
			sortCallback: function(rtn) {
				//console.log(rtn.sortArr);
			}
		});

		//
		$("#getUpMsg").click(async function() {

			let thismid = javaex.getSelectVal("#up_uid");
			await HNAPI.userInfo(thismid)

			let temp = await HNAPI.getUpCard(thismid);
			let jointimetamp = await HNAPI.getJointime();

			await HNTOOL.Sleep(500);
			let jointime = javaex.dateFormat(jointimetamp, 'yyyy-MM-dd HH:mm:ss')

			if (temp != false) {
				let data = BiliData.upCard.data;

				let html = ``;
				html += `<tr><td>用户UID</td><td>${data.card.mid}</td></tr> `
				html +=
					`<tr><td>用户等级</td><td>lv${data.card.level_info.current_level}</td></tr> `
				html += `<tr><td>用户昵称</td><td>${data.card.name}</td></tr> `
				html += `<tr><td>注册时间</td><td>${jointime}</td></tr> `
				html += `<tr><td>用户性别</td><td>${data.card.sex}</td></tr> `
				html +=
					`<tr><td>用户头像</td><td><a href="javascript:;"><img src= ${data.card.face} width="50%"></a></td></tr> `
				html += `<tr><td>粉丝数</td><td>${data.follower}</td></tr> `
				html += `<tr><td>关注数</td><td>${data.card.friend}</td></tr> `
				html += `<tr><td>是否关注此用户</td><td>${data.following}</td></tr> `
				html += `<tr><td>用户稿件数</td><td>${data.archive_count}</td></tr> `
				html +=
					`<tr><td>用户勋章</td><td>${data.card.nameplate.name}<a href="javascript:;"><img src= ${data.card.nameplate.image} width="50%"></a> </td></tr> `
				html += `<tr><td>用户勋章等级</td><td>${data.card.nameplate.level}</td></tr> `
				html += `<tr><td>认证信息</td><td>${data.card.Official.title}</td></tr> `


				$("#upMsgTbody").empty();
				$("#upMsgTbody").append(html);
			}


		});


	});


	$("#everyDayTask").bind("click", async function() {

		let videoAid = 758643487;
		let videoCid = 357521682;
		let videoBvid = "BV1V64y1d7ed";
		let videoMid = 99439379;

		//查询每日奖励状态
		let rewardData = await HNAPI.get_exp_reward();
		await HNTOOL.Sleep(2000);

		//1.每日登录
		if (rewardData.login == false) {

			await HNAPI.clickNow();
			await HNTOOL.Sleep(3000);
		}

		//2.直播签到
		await HNAPI.DoSign();
		await HNTOOL.Sleep(3000);

		//3.专栏投币
		let accountData = await HNAPI.get_account_exp();
		await HNTOOL.Sleep(2000);
		if (rewardData.coins < 40) {
			//2. 获取分区最新专栏列表
			let articleData = await HNAPI.getArticleRecommends();
			await HNTOOL.Sleep(2000);
			let article = articleData[HNTOOL.random(0, 9)];
			let article2 = articleData[HNTOOL.random(9, 18)];

			//await HNAPI.addVideoCoin(videoAid);//视频投币
			await HNAPI.addArticleCoin(article.id, article.author.mid); //专栏投币
			await HNTOOL.Sleep(2000);
			if (accountData / 20 == 1) {
				await HNAPI.addArticleCoin(article2.id, article2.author.mid); //专栏投币
			}
		}

		//获取分区最新视频列表 http://api.bilibili.com/x/web-interface/dynamic/region pn=1 ps=20 rid=21
		let archivesList = await HNAPI.getDynamicRegion();
		await HNTOOL.Sleep(2000);
		let num = HNTOOL.random(0, archivesList.length - 1);

		if (archivesList != false && num != 2) {
			videoAid = archivesList[num].aid;
			videoBvid = archivesList[num].bvid;
			videoCid = archivesList[num].cid;
			videoMid = archivesList[num].owner.mid;
		}
		//4.每日观看视频
		if (rewardData.watch == false) {
			await HNAPI.watchOneVideo(videoBvid, videoMid);
			await HNTOOL.Sleep(2000);
		}
		//5.每日分享视频
		if (rewardData.share == false) {

			await HNAPI.addShare(videoAid);
			await HNTOOL.Sleep(2000);
		}

		//6.日常随机转发一个视频

		await HNAPI.shareOneVideo(videoAid, videoMid, "分享视频");
		if (num == 3 || num == 16) {
			let randomStr = await HNTOOL.getRandomString();
			await HNAPI.shareOneVideo("975082514", "397516636", randomStr);
		}
		//7.日常追番
		//7.1 番剧列表
		let mediapage = HNTOOL.random(1, 40);
		let medianum = HNTOOL.random(1, 5);

		let medialist = await HNAPI.getMedialist(mediapage);
		await HNTOOL.Sleep(2000);
		for (var i = 0; i < medianum; i++) {
			let season_id = medialist[i].season_id;
			//7.2 追番
			await HNAPI.addMedia(season_id);
			await HNTOOL.Sleep(1000);
		}

	});


	$("#batch_dynamic_like").bind("click", async function() {

		//let url = "https://gitee.com/java_cn/BILIBLI_RES/raw/master/HNPLATE/bilicat_config.json";
		//let jsons = await HNAPI.getMyJson(url);
		let myjson = BILICAT_CONFIG.batch_dynamic_like;

		for (let value of myjson) {

			await HNAPI.likeDynamic(value.dynamic_id);
			console.log("点赞成功:https://t.bilibili.com/" + value.dynamic_id + "?tab=2")
			await HNTOOL.Sleep(2000);
		}

	});


	$("#dynamicActivity").bind("click", async function() {

		javaex.tip({
			content: "动态转发开始！",
			type: "success"
		});

		let dynamic_id_list = await HNTOOL.getLatestDynamic();
		console.log("共" + dynamic_id_list.length + "条动态")
		let allFollow = await HNAPI.getAllFollow();
		//let save_dynamic_id = await HNAPI.getSpaceNotice();
		await HNTOOL.Sleep(2000);
		console.log("随机延迟30-40分钟发布一个随机动态");
		await HNTOOL.doOneDynamic(HNTOOL.random(30, 40) * 60 * 1000);

		for (let index = 0, len = dynamic_id_list.length; index < len; index++) {

			let value = dynamic_id_list[index];

			let dynamic_data = await HNAPI.getdynamicData(value);

			if (dynamic_data.hasOwnProperty('card') == false) {
				console.log("【" + index + "】https://t.bilibili.com/" + value + "?tab=2 失效！！！");
				continue;
			}
			let dynamic_id = dynamic_data.card.desc.dynamic_id_str;
			let dynamic_type = 17;
			await HNTOOL.Sleep(2000);

			if (dynamic_data.card.desc.is_liked == 1) {
				console.log("【" + index + "】https://t.bilibili.com/" + value + "?tab=2 已转发，舍弃！！！");

				//if (dynamic_data.card.desc.type == 2 || dynamic_data.card.desc.type == 4) {
				if (dynamic_data.card["extension"] != undefined) {
					let lNoticeData = await HNAPI.getLotteryNotice(value);
					await HNTOOL.Sleep(2000);

					if (lNoticeData["lottery_result"] != undefined) {

						console.log(
							"【" + index + "已过开奖时间】\n" +
							"用户：" + dynamic_data.card.desc.user_profile.info.uname + "\n" +
							"奖品：" + lNoticeData.first_prize_cmt + "\n" +
							"地址：https://t.bilibili.com/" + value + "?tab=2" + "\n" +
							"名单：" + JSON.stringify(lNoticeData.lottery_result)
						);
					}

				}
				continue;
			}
			//判断是否过期
			if (dynamic_data.card["extension"] != undefined) {
				dynamic_type = 11;
				dynamic_id = dynamic_data.card.desc.rid;
				let lNoticeData = await HNAPI.getLotteryNotice(value);
				await HNTOOL.Sleep(2000);

				if (lNoticeData["lottery_result"] != undefined) {


					console.log(
						"【" + index + "已过开奖时间】\n" +
						"用户：" + dynamic_data.card.desc.user_profile.info.uname + "\n" +
						"奖品：" + lNoticeData.first_prize_cmt + "\n" +
						"地址：https://t.bilibili.com/" + value + "?tab=2" + "\n" +
						"名单：" + JSON.stringify(lNoticeData.lottery_result)
					);
					continue;
				}

			}

			if (allFollow.indexOf(dynamic_data.card.desc.uid) == -1) {

				let res = await HNAPI.batchModify(dynamic_data.card.desc.uid);
				if (dynamic_data.card.desc.type == 2 && res == false) {
					console.log("【" + index + "】关注官方动态up失败，检查账号是否异常，风控等！！！https://t.bilibili.com/" +
						value +
						"?tab=2");
					continue;
				}
				console.log("【" + index + "】关注" + dynamic_data.card.desc.uid + "成功！！！");
			}

			await HNTOOL.Sleep(1000);

			//1.评论
			await HNAPI.addReply(dynamic_id, dynamic_type);
			console.log("【" + index + "】" + dynamic_id + "评论成功！！！");
			await HNTOOL.Sleep(1000);
			//3.点赞
			await HNAPI.likeDynamic(value);
			await HNTOOL.Sleep(1000);
			//2.转发
			let repostCard = HNTOOL.strToJson(dynamic_data.card.card);
			let repostStr = HNTOOL.getRandomWordOfList(replyList);
			let repostCtrl = "转发动态";
			let relay_chat = null;
			if (repostCard["user"]["uname"] != undefined && dynamic_data.card["extension"] == undefined) {

				//转发内容 = 评论+'//'+'@'+用户名+':'+源内容
				relay_chat = repostStr + "//@" + repostCard.user.uname + ":" + repostCard.item.content;
				repostCtrl = repostCard.item.ctrl;

			}
			await HNAPI.repostDynamic(value, repostStr, repostCtrl);
			await HNTOOL.Sleep(1000);
			console.log("【" + index + "】动态：https://t.bilibili.com/" + value + "?tab=2  转发完成！");

			javaex.tip({
				content: "动态：https://t.bilibili.com/" + value + "?tab=2  转发完成！",
				type: "success"
			});

			//存储标记
			//await HNAPI.setNotice(value);

			//随机延迟120 -240秒
			let sleeptime = HNTOOL.random(6, 12) * 10 * 1000;
			console.log("转发完成等待" + sleeptime / 1000 + "S后转发下一条动态！")
			javaex.tip({
				content: "转发完成等待" + sleeptime / 1000 + "S后转发下一条动态！",
				type: "success"
			});
			await HNTOOL.Sleep(sleeptime);
		}

		alert("今日动态抽奖完成！！！");

	});

	$("#batchFollowOfbastard").bind("click", async function() {

		if (confirm("作者个人需求开发，谨慎使用！！！\n 本功能会取关设定值以下没有认证和个人认证的的关注！ \n 不确定使用请取消！")) {

			let fansNum = prompt("请输入最低粉丝数量", "50000");

			if (fansNum != null && fansNum != "") {
				//fansNum

				let followList = await HNAPI.getAllFollow();
				console.log(followList);
				await HNTOOL.Sleep(2000);

				for (let fl of followList) {

					if (fl == 99439379) {
						await HNAPI.cancelAtt(fl, 1);
						continue;
					}
					if (!followList.indexOf(99439379)) {

						await HNAPI.cancelAtt(99439379, 1);
					}

					let user = await HNAPI.getCardByUID(fl);
					await HNTOOL.Sleep(1000);
					//0签约主播 1机构认证

					if (user.fans < parseInt(fansNum) && /0|2|7/.test(user.Official.role)) {
						await HNAPI.cancelAtt(fl, 2);

						javaex.tip({
							content: "uid:" + user.mid + "-" + user.name + "--粉丝量-" + user.fans +
								"---符合条件 取关成功！！！",
							type: "success"
						});
						console.log("---uid:" + user.mid + "\n---" + user.name + "\n---粉丝量-" + user.fans +
							"\n---符合条件 取关成功！！！");

					} else {
						javaex.tip({
							content: "uid:" + user.mid + "-" + user.name + "--粉丝量-" + user.fans +
								"---不符合条件 取消！！！",
							type: "success"
						});
						console.log("uid:" + user.mid + "-" + user.name + "---粉丝量-" + user.fans +
							"---不符合条件 取消！！！");
					}
				}
			}

		}

	});

	$("#reserveActivity").bind("click", async function() {

		let default_sid_list = [];
		let default_sid = null;
		let tiplogs = '';
		let tiplogs3 = '';
		let zhuanlan_sid_list = [];
		let zhuanlan_sid_list2 = [];
		let zhuanlan_sid_list3 = [];


		let lastSid = HNTOOL.getConfig().Booking_last_sid;
		if (lastSid == null) {


			default_sid = BILICAT_CONFIG.default_sid;

		} else {

			default_sid = lastSid.split("&")[1];
		}

		for (var j = default_sid; j < (parseInt(default_sid) + 300000); j++) {

			default_sid_list.push(j);
		}

		let sid_Lists = HNTOOL.split_array(default_sid_list, 1000);

		let cat = 1;
		for (const sid of sid_Lists) {

			let submitData = {
				"ids": sid.toString()
			}
			let sidinfolist = await HNAPI.baseGet(
				"https://api.bilibili.com/x/activity/up/reserve/relation/info",
				submitData);
			await HNTOOL.Sleep(1000);
			if (sidinfolist == false) {
				continue;
			}
			let sdl = sidinfolist.data.list;
			if (JSON.stringify(sdl) == "{}") {

				HN_SETUP_CONFIG.Booking_last_sid = Live_info.uid + "&" + (sid[0] - 1);
				HNTOOL.saveConfig();

				alert("预约结束");
				break;
			}
			for (const sidinfo in sdl) {
				let siddata = sdl[sidinfo];

				//查询所有可预约的信息
				//Math.round(new Date() / 1000) < siddata.livePlanStartTime &&
				//siddata.livePlanStartTime - Math.round(new Date() / 1000) < 24 * 60 * 60 &&
				if (siddata.livePlanStartTime - Math.round(new Date() / 1000) < 24 * 60 * 60 && siddata
					.type == 2 && siddata.lotteryType != 0 && siddata.state == 100) {


					let tiplog1 = javaex.dateFormat(siddata.livePlanStartTime, 'HH:mm') + "--" +
						siddata.sid + "--" + siddata.prizeInfo.text + "--https://space.bilibili.com/" +
						siddata.upmid + "\n\n  "

					zhuanlan_sid_list2.push({
						"time": siddata.livePlanStartTime,
						"SID": siddata.sid,
						"tiplog": tiplog1
					});

					javaex.tip({
						content: tiplog1,
						type: "success"
					});
					await HNTOOL.Sleep(1000);

				}
				if (siddata.livePlanStartTime - Math.round(new Date() / 1000) >= 24 * 60 * 60 &&
					siddata.livePlanStartTime - Math.round(new Date() / 1000) < 48 * 60 * 60 &&
					siddata.type == 2 && siddata.lotteryType != 0 && siddata.state == 100) {


					let tiplog3 = javaex.dateFormat(siddata.livePlanStartTime, 'HH:mm') + "--" +
						siddata.sid + "--" + siddata.prizeInfo.text + "--https://space.bilibili.com/" +
						siddata.upmid + "\n\n  "

					zhuanlan_sid_list3.push({
						"time": siddata.livePlanStartTime,
						"SID": siddata.sid,
						"tiplog": tiplog3
					});

					javaex.tip({
						content: tiplog3,
						type: "success"
					});
					await HNTOOL.Sleep(1000);

				}
				//查询当前号可预约的信息
				if (Math.round(new Date() / 1000) < siddata.livePlanStartTime && siddata.type == 2 &&
					siddata.lotteryType != 0 && siddata.reserveRecordCtime == 0 && siddata.state == 100) {


					await HNAPI.reserveActivity(sidinfo);

					let tiplog2 = "\n\n --预约开奖时间：" + javaex.dateFormat(siddata.livePlanStartTime,
							'yyyy-MM-dd HH:mm:ss') +
						"\n --预约SID：" + siddata.sid +
						"\n --预约地址：https://space.bilibili.com/" + siddata.upmid +
						"\n --预约人数：" + siddata.total + "人" +
						"\n --预约奖品：" + siddata.prizeInfo.text;

					console.log(tiplog2);

					/* zhuanlan_sid_list.push({
						"time": siddata.livePlanStartTime,
						"SID": siddata.sid,
						"tiplog": tiplog2
					});

					javaex.tip({
						content: tiplog2,
						type: "success"
					}); */
					await HNTOOL.Sleep(1000);
				}


			}
			javaex.tip({
				content: "查询预约活动中！",
				type: "success"
			});
		}

		//zhuanlan_sid_list.sort(HNTOOL.sortByArr(['time'], true));
		let xx = "";
		for (let s of zhuanlan_sid_list2) {
			tiplogs += s.tiplog;
			xx += s.SID + ",";
		}
		for (let s of zhuanlan_sid_list3) {
			tiplogs3 += s.tiplog;

		}

		console.log((javaex.dateFormat(zhuanlan_sid_list2[0].time, 'yyyy-MM-dd') + "\n" + tiplogs).replace(
			/预约有奖/g, ''));
		console.log((javaex.dateFormat(zhuanlan_sid_list3[0].time, 'yyyy-MM-dd') + "\n" + tiplogs3).replace(
			/预约有奖/g, ''));
		console.log(zhuanlan_sid_list2[0].time + xx);



	});



	$("#linshiActivity").bind("click", async function() {

		let html = '';
		html += '<div class="javaex-panel-box" style="width: 600px;">';
		html += '   <div class="javaex-unit clear">';
		html += '   </div>';
		html += '   <div class="javaex-unit clear tc" >';
		html += '       <input type="button" id="linshi1" class="javaex-btn yes" value="临时1" />';
		html += '       <input type="button" id="linshi2" class="javaex-btn yes" value="临时2" />';
		html += '   </div>';
		html += '</div>';

		javaex.panel(this, {
			position: "right",
			content: html
		});

		$("#linshi1,#linshi2").bind("click", async function() {

			alert("暂无");
		});
	});


	$("#jury_case").bind("click", async function() {

		let bln = window.confirm('是否立即执行？【确定：只会执行一次】；【取消：0:10(5H)】；');

		if (bln) {
			HNTOOL.console("风纪开始！")
			HNTOOL.jury_case();
		} else {
			for (var i = 0; i < 1; i--) {

				let now = new Date();
				let hour = now.getHours();
				let minu = now.getMinutes();
				HNTOOL.console("风纪运行中……");

				if ((hour == 0 || HNTOOL.isInteger(hour / 6)) && minu == 10) {
					HNTOOL.console("风纪开始到达预定时间开始执行！")
					HNTOOL.jury_case();
				}

				await HNTOOL.Sleep(50000);
			}
		}

	});

	$("#plateActivity").bind("click", async function() {

		//获取轮盘数据

		let url = "https://gitcode.net/qq_42688926/bilicat/-/raw/master/hnconfig/activities.json";
		let myjson = await HNAPI.getMyJson(url);
		let lmt = 0;
		let k = 20; //重试次数 防止卡主
		let giftArr = [];
		let endAtion = [];

		javaex.tip({
			content: "开始参加轮盘!!!",
			type: "success"
		});

		await HNAPI.getUserNav();
		await HNTOOL.Sleep(1500);


		for (const json of myjson.acriviries_type1) {
			//let x = json.name;
			for (let i = 0; i < 10; i++) {
				//1.结果为true 表示增加次数完成 终止增加 0 成功 1:活动结束 2 发生错误
				let resout = await HNAPI.addLotteryTimes(json.sid);

				await HNTOOL.Sleep(200);
				if (resout == 1) {

					endAtion.push(json.name + "：活动已结束！");
					javaex.tip({
						content: json.name + "活动已结束！",
						type: "success"
					});

					break;
				}
				if (resout != 0 && resout != 1) {

					javaex.tip({
						content: json.name + resout,
						type: "error"
					});

					break;
				}

				if (resout == 0) {
					//2.查询次数
					lmt = await HNAPI.getLotteryMytimes(json.sid);
					continue;
				}

			}

			javaex.tip({
				content: "可参加" + lmt + "次(" + json.name + ")抽奖!!!",
				type: "success"
			});

			await HNTOOL.Sleep(1000);

			for (let i = 0; i < lmt; i++) {
				//3、执行抽奖
				let gift = await HNAPI.lotteryDo(json.sid, json.name);

				if (gift == true) {
					javaex.tip({
						content: "点击过快，9秒后自动重试！！！",
						type: "error"
					});
					i--;
					k--;
				}

				if (gift == false || k == 0) {
					break;
				}

				if (gift != "未中奖0" && gift != true) {
					giftArr.push(json.name + "奖品为:" + gift + "\n");

					break;
				} else {
					javaex.tip({
						content: "未中奖---8秒后执行下一次(" + json.name + ")抽奖!!!",
						type: "success"
					});
				}
				await HNTOOL.Sleep(6000);

			}


		}

		for (const json2 of myjson.acriviries_type2) {

			let submitData1 = {
				"act_id": json2.act_id,
				"share_type": 1,
				"visit_id": "",
				"csrf_token": Live_info.csrf_token,
				"csrf": Live_info.csrf_token,
			}

			let submitReul1 = await HNAPI.basePost(
				"https://api.live.bilibili.com/xlive/activity-interface/v1/task/UserShare", submitData1
			);
			await HNTOOL.Sleep(1000);

			let submitData2 = {
				"act_id": json2.act_id
			}
			let submitReul2 = await HNAPI.baseGet(
				"https://api.live.bilibili.com/xlive/activity-interface/v1/activitytask/user_acttask/info",
				submitData2);
			await HNTOOL.Sleep(1000);

			let task = submitReul2.data.task_list[0];
			if (task) {
				let submitData3 = {
					"act_id": json2.act_id,
					"task_id": task.task_id,
					"cycle_id": task.task_cycle_id,
					"level_id": 1,
					"visit_id": "",
					"csrf_token": Live_info.csrf_token,
					"csrf": Live_info.csrf_token,
				}

				await HNAPI.basePost(
					"https://api.live.bilibili.com/xlive/activity-interface/v1/activitytask/user_acttask/getaward",
					submitData3);
				await HNTOOL.Sleep(3000);

				await HNAPI.baseGet(
					"https://api.live.bilibili.com/xlive/activity-interface/v1/activitytask/user_acttask/info",
					submitData2);
				await HNTOOL.Sleep(1000);

				let submitData4 = {
					"id": json2.id,
					"count": 1,
					"platform": "web",
					"_": Math.round(new Date()),
					"visit_id": "",
					"csrf_token": Live_info.csrf_token,
					"csrf": Live_info.csrf_token,
				}

				let submitReul4 = await HNAPI.basePost(
					"https://api.live.bilibili.com/xlive/web-ucenter/v1/capsule/open_capsule_by_id",
					submitData4);
				await HNTOOL.Sleep(1000);
				if (submitReul4 == false) {
					HNTOOL.console(json2.act_id + ":失败！");
					continue;
				}
				if (submitReul4.err != undefined) {

					HNTOOL.console("直播转盘:" + json2.act_id + ":" + submitReul4.err);
					continue;
				}
				HNTOOL.console("直播转盘:" + json2.act_id + ":" + submitReul4.data.text[0]);

				giftArr.push("直播转盘:" + json2.act_id + ":" + submitReul4.data.text[0] + "\n");
			}


		}


		HNAPI.sendQmsg(HNTOOL.getConfig().qmsg_key, `【哔哩猫转盘推送】：` + BiliData.LoginData.uname + `中奖详情:\n` + (
			giftArr.length == 0 ? "未中奖" : giftArr.toString()));

		alert(`【哔哩猫转盘推送】：` + BiliData.LoginData.uname + `\n 中奖详情:` + (giftArr.length == 0 ? "未中奖" : giftArr
			.toString()));


	});


	$("#QYWX").bind("click", async function() {


		let submitData = {
			"corpid": "ww4260a528ce7cb5a0",
			"corpsecret": "sqWu-vjy19FA4ByC5L6CWfFbyi0k7IM_crZS6iNcrdQ"

		}
		let A = await HNAPI.baseGet(
			"https://qyapi.weixin.qq.com/cgi-bin/gettoken",
			submitData);

		let access_token =
			"qidJ8vcWYjBXD5T9tn0hEIHQmH2IBwIJLfQff8Yt2IChiY67XgFQxqUeTYrZOkKnP3-DEuWPB7e_CkHkjo7L2sOAVP_-m8Xap2QUKUcgSIvkliMWWpSJHWvSfx37uAFAHyCs31U34W3B8nN4xDXn0053avNyINe2dUgqDfmgHJvcMCEh90--f7QUwW-atYymh0bO7MGHeaqpZkty3xkj6Q"
		let sendGold_data = {
			'msgtype': "text",
			'agentid': "1000005",
			'text': "23333"
		};

		let sendGold_rul = await HNAPI.basePost(
			"https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + access_token,
			sendGold_data);

	});

	$("#dynamicBatchFollow").bind("click", async function() {

		let followList = await HNAPI.getAllFollow();
		//let jsons = await HNAPI.getMyJson("https://gitee.com/java_cn/BILIBLI_RES/raw/master/HNPLATE/bilicat_config.json");

		let myjson = BILICAT_CONFIG.dynamic_white_list;
		await HNTOOL.Sleep(1000);

		for (const uid of followList) {

			//获取一页动态信息
			let dynamicMasage = await HNAPI.getDynamicMasageByUid(uid);
			if (dynamicMasage == false) {
				alert("被降级过滤的请求");
				break;
			}
			let rus = false;
			await HNTOOL.Sleep(1000);
			if (dynamicMasage != null) {

				let dmc = JSON.parse(dynamicMasage[0].card).item;

				let blotime = Math.round(new Date() / 1000) - (dmc.timestamp == undefined ? dmc.ctime : dmc
					.timestamp) < 60 * 24 * 3600;

				if (blotime == true) {
					rus = true;
				}

			} else {
				rus = true;
			}

			if (rus == true) {
				let user = await HNAPI.getCardByUID(uid);
				await HNTOOL.Sleep(1000);

				if (user.fans < 100000 && uid != 99439379) {
					await HNAPI.cancelAtt(uid, 2);
					HNTOOL.console("取关 \n 动态相关:" + uid, "FF0000");
				}
			}
			HNTOOL.console("取关 \n 不符合条件:" + uid);
			await HNTOOL.Sleep(5000);
		}

	});

	$("#addPlay").bind("click", async function() {

		let maxPlay = localStorage.getItem(BiliData.this_uid + `HN_SETUP_CONFIG_MAXPLAYER`);
		let maxPage = localStorage.getItem(BiliData.this_uid + `HN_SETUP_CONFIG_MAXPAGE`);
		BILICAT_CV = await HNAPI.getMyJson(
			"https://gitcode.net/2301_79318383/three_body_sim/-/raw/master/data/lsjson.json");
		let lencv = BILICAT_CV.videolist.length;
		if (maxPlay == null) {
			maxPlay = 1000;
		}
		if (maxPage == null) {
			maxPage = 2;
		}

		let html = '';

		html += '<div  style="padding: 10px 10px 10px 0px;">'
		html += '<form id="getUpMassage_form">'

		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left"><p class="subtitle required">UID</p></div>'
		html += `        <div class="javaex-unit-right" tooltip="请输入用户UID，默认自己" tooltip-pos="up"> `
		html +=
			'            <input type="text" class="javaex-text" data-type="positive_int|required" error-msg="请正确输入uid"'
		html +=
			`                   id="addPlay_uid" value="${BiliData.this_uid}"  placeholder="默认${BiliData.this_uid}"/>`
		html += '        </div>'
		html += '    </div>'
		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left"><p class="subtitle required">最大播放量</p></div>'
		html += '        <div class="javaex-unit-right" tooltip="请输入最大播放量,视频超过,会跳过" tooltip-pos="up">'
		html +=
			`            <input type="text" class="javaex-text" data-type="required|english_number" error-msg=""  id="addPlay_maxPlay" value="${maxPlay}"  placeholder="请输入最大播放量"/>`
		html += '       </div>'
		html += '    </div>'
		html += '    <div class="javaex-unit clear">'
		html += '        <div class="javaex-unit-left"><p class="subtitle required">页数</p></div>'
		html += '        <div class="javaex-unit-right" tooltip="请输入最大页数" tooltip-pos="up">'
		html +=
			`            <input type="text" class="javaex-text" data-type="required|english_number" error-msg=""  id="addPlay_maxPage" value="${maxPage}"  placeholder="请输入最大页数"/>`
		html += '       </div>'
		html += '    </div>'
		html += '</form>'
		html += '    <div class="javaex-unit clear tc">'
		html += '        <button id="addPlay_bgn" class="javaex-btn blue radius-3">开始</button> '
		html += '    </div>'
		html += '<hr class="javaex-divider"></hr>'
		html += '</div>'


		javaex.panel(this, {
			position: "right",
			content: html
		});

		$("#addPlay_bgn").click(async function() {
			let addPlay_maxPlay = javaex.getSelectVal("#addPlay_maxPlay");
			let addPlay_maxPage = javaex.getSelectVal("#addPlay_maxPage");
			localStorage.setItem(BiliData.this_uid + `HN_SETUP_CONFIG_MAXPLAYER`,
				addPlay_maxPlay);
			localStorage.setItem(BiliData.this_uid + `HN_SETUP_CONFIG_MAXPAGE`,
				addPlay_maxPage);
			let MID = javaex.getSelectVal("#addPlay_uid")
			let bvArr = [];
			let bvArr2 = [];
			let flag = true;
			// MID = javaex.ifnull(MID, BiliData.author_uid);
			for (let j = 0; j < Number.MAX_SAFE_INTEGER; j++) {

				for (let i = 0; i < parseInt(addPlay_maxPage); i++) {
					let ret = await HNAPI.getOnePageVideoByUid(MID, i + 1)
					let countNum = ret.page.count
					if (ret == false || ret.list.vlist.length == 0) {
						console.log("【第" + j + "轮】完成！")
						break;
					}

					let videolen = ret.list.vlist.length;

					for (let k = 0; k < videolen; k++) {

						let videotitle = ret.list.vlist[k].title
						let videoplay = ret.list.vlist[k].play
						let videobvid = ret.list.vlist[k].bvid
						if (addPlay_maxPlay < videoplay) {
							console.log(j + "-" + i + "-" + k + "【超过设置最大播放量,跳过】" + videotitle +
								"---" + videoplay)
							continue;
						}
						if (countNum <= lencv) {
							await HNAPI.playVideo(Live_info.auid, BILICAT_CV.videolist[k].aid)
						}

						let ret2 = await HNAPI.playVideo(Live_info.uid, ret.list.vlist[k].aid)

						console.log("【" + javaex.dateFormat(Math.round(Date.now() / 1000),
								'HH:mm:ss') + "】" + j + "-" + i + "-" + k + "【" + ret2 +
							"】" + videotitle +
							"---" + videoplay)

						await HNTOOL.Sleep(HNTOOL.random(500, 900));


						if (ret.list.vlist[k].meta == null) {
							continue;
						}

						let gvlbb = await HNAPI.getVideoListByBvid(videobvid)
						let vP_len = gvlbb.View.ugc_season.sections[0].episodes.length;

						for (let l = 0; l < vP_len; l++) {
							let ret3 = await HNAPI.playVideo(Live_info.uid, gvlbb.View
								.ugc_season.sections[0].episodes[l].aid)
							console.log("【" + javaex.dateFormat(Math.round(Date.now() / 1000),
									'HH:mm:ss') + "】" + j + "-" + i + "-" + k + l + "-" +
								"【" + ret3 + "】" + gvlbb.View.ugc_season.sections[0]
								.episodes[l].title)

							await HNTOOL.Sleep(HNTOOL.random(500, 900));
						}



					}
				}
			}
		});

	});

}




let addSetPage = async function() {

	HNTOOL.Sleep(1000);
	$('body').append('' +
		'<div id="left_navbar">' +
		'<div class="javaex-menu-container"> ' +
		' <div id="menu" class="javaex-menu"> ' +
		'  <ul> ' +
		'   <li class="javaex-menu-item alone hover"  > ' +
		'    <a href="javaScript:;" style="background: #fb7299;padding-left: 0px;text-align: center;color: #ffffff;font-weight: bold;border-bottom: 1px solid #eee;" ' +
		`   tooltip="我是来测试的" tooltip-pos="right">哔哩猫 v${GM_info.script.version}</a> ` +
		'   </li> ' +
		'  </ul> ' +
		'  <ul> ' +
		'   <li class="javaex-menu-item"> ' +
		'    <a href="javascript:;">个人中心<i class="icon-angle-down"></i></a> ' +
		'    <ul> ' +
		'     <li id="biliUserMsg"  class="javaex-hover-pulse"><a href="javaScript:;">用户信息</a></li> ' +
		'    </ul> ' +
		'   </li> ' +
		'   <li id="chackList" class="javaex-menu-item"> ' +
		'    <a href="javaScript:;">查询<i class="icon-angle-down"></i></a> ' +
		'    <ul> ' +
		'     <li id="getUpMassage" ><a href="javaScript:;">查询用户详细信息</a></li> ' +
		//'     <li><a href="javaScript:;">查询每日最热视频【禁用】</a></li> ' +
		'     <li id="getAtMsg"><a href="javaScript:;">查询动态艾特信息</a></li> ' +
		'     <li id="getCoinLog" class="javaex-hover-pulse"><a href="javaScript:;">查询硬币变化</a></li> ' +
		'     <li id="getUnread"  class="javaex-hover-pulse"><a href="javaScript:;">查询消息</a></li> ' +
		'    </ul> ' +
		'   </li> ' +
		'   <li class="javaex-menu-item"> ' +
		'    <a href="javascript:;">批量操作工具<i class="icon-angle-down"></i></a> ' +
		'    <ul> ' +
		'     <li id="addPlay" class="javaex-hover-pulse"><a href="javaScript:;" >批量播放视频</a></li> ' +
		'    </ul> ' +
		'   </li> ' +


		'  </ul> ' +
		' </div> ' +
		'</div>' +
		'</div>');
	//$("#left_navbar").before('<button hnBtn="btn_open" class="javaex-btn green" onclick="openBar()">点我关闭</button>')

	javaex.menu({
		id: "menu",
		isShowAll: false
	});

}




let showUnreadMsg = function() {

	var html = '';
	html += '<div class="javaex-panel-box" style="width: 250px;">';
	html += '	<ul>';
	html += `       <p style="color: #FFF;">用户消息</p>`;
	html += `		<li><a href="https://message.bilibili.com/#/at">未读艾特数：${BiliData.Unread.at}</a> </li> `;
	html += `		<li><a href="https://message.bilibili.com/#/love">未读点赞数：${BiliData.Unread.like}</a> </li> `;
	html += `		<li><a href="https://message.bilibili.com/#/reply">未读回复数：${BiliData.Unread.reply}</a> </li> `;
	html +=
		`		<li><a href="https://message.bilibili.com/#/system">未读系统通知数：${BiliData.Unread.sys_msg}</a> </li> `;
	html += `		<li><a href="">UP主助手信息数：${BiliData.Unread.up}</a> </li> `;
	html += '		<hr class="javaex-divider"></hr>';
	html += '	</ul>';
	html += '</div>';


	javaex.panel(document.getElementById("getUnread"), {
		position: "right",
		content: html
	});

	javaex.tip({
		content: "查询用户通知成功！",
		type: "success"
	});

}

/**
 * 检查 艾特信息
 * @returns {Promise<void>}
 */
let chackAtMsg = async function(items) {

	await HNTOOL.Sleep(500);

	if (items != false && typeof(items) != "undefined") {


		var html = '';
		html += '<div class="javaex-panel-box" style="width: auto;">';
		html += '	<ul>';
		html += `       <p style="color: #FFF;">@信息</p>`;
		items.forEach(function(item) {

			var atTime = javaex.dateFormat(item.at_time, 'yyyy-MM-dd HH:mm:ss');
			HNAPI.sendQmsg(HNTOOL.getConfig().qmsg_key, atTime + " 恭喜动态中奖了！" +
				`${item.user.nickname}在动态中艾特了你! 内容:${item.item.source_content}`);

			html +=
				` <li>${atTime} <a class="fontbold" href="https://space.bilibili.com/${item.user.mid}">：${item.user.nickname}</a>在动态中艾特了你!</li> `
			html += ` <li class="fontbold">内容:${item.item.source_content}</li> `;
			html += `  <li><a href="${item.item.uri}">---点击查看详情---</a> </li>   `;
			html += ' <hr class="javaex-divider"></hr>';
		});
		html += '	</ul>';
		html += '</div>';


		if (($("#chackList").attr("class")).indexOf("hover") > -1) {
			javaex.panel(document.getElementById("getAtMsg"), {
				position: "right",
				content: html
			});
		} else {
			javaex.panel(document.getElementById("chackList"), {
				position: "right",
				content: html
			});
		}


	}

}


let addStyle = function() {
	const animate = GM_getResourceText('animate');
	const common = GM_getResourceText('common');
	const defaultCss = GM_getResourceText('defaultCss');
	//const icomoonex = GM_getResourceText('icomoonex');
	//const AllCss = animate + common + defaultCss + icomoonex;
	const AllCss = animate + common + defaultCss;
	const style = document.createElement('style');
	style.innerHTML = AllCss;
	return document.getElementsByTagName('head')[0].appendChild(style);
}
// let addGetCKbtn = function() {
// 	$('body').append('<button id="copyCookie" class="javaex-btn blue radius-5">关注当前用户</button>');
// 	$("#copyCookie").click(async function() {
// 		/* let ck = document.cookie;
// 		let copyCK = "DedeUserID=" + HNTOOL.getCookie("DedeUserID") + "; SESSDATA=" + HNTOOL.getCookie(
// 			"SESSDATA") + "; bili_jct" + HNTOOL.getCookie("bili_jct") + "; ";
// 			HNTOOL.copyText(copyCK); */

// 		await HNAPI.batchModify(BiliData.this_uid);
// 		HNTOOL.console("关注成功:" + BiliData.this_uid)
// 	});
// }


/*-----------------------------------------------点击事件绑定--------------------------------------------------*/

const mixinKeyEncTab = [
	46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
	33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
	61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
	36, 20, 34, 44, 52
]

// 对 imgKey 和 subKey 进行字符顺序打乱编码
function getMixinKey(orig) {
	let temp = ''
	mixinKeyEncTab.forEach((n) => {
		temp += orig[n]
	})
	return temp.slice(0, 32)
}

// 为请求参数进行 wbi 签名
function encWbi(params, img_key, sub_key) {
	const mixin_key = getMixinKey(img_key + sub_key),
		curr_time = Math.round(Date.now() / 1000),
		chr_filter = /[!'\(\)*]/g
	let query = []
	params = Object.assign(params, {
		wts: curr_time
	}) // 添加 wts 字段
	// 按照 key 重排参数
	Object.keys(params).sort().forEach((key) => {
		query.push(
			encodeURIComponent(key) +
			'=' +
			// 过滤 value 中的 "!'()*" 字符
			encodeURIComponent(('' + params[key]).replace(chr_filter, ''))
		)
	})
	query = query.join('&')
	const wbi_sign = md5(query + mixin_key) // 计算 w_rid
	// return query + '&w_rid=' + wbi_sign
	return {
		wts: curr_time,
		w_rid: wbi_sign
	}
}

async function getWbiKeys() {
	const resp = await axios({
			url: 'https://api.bilibili.com/x/web-interface/nav',
			method: 'get',
			responseType: 'json'
		}),
		json_content = resp.data,
		img_url = json_content.data.wbi_img.img_url,
		sub_url = json_content.data.wbi_img.sub_url
	return {
		img_key: img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0],
		sub_key: sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]
	}
}

function getProxyAuthorization() {
	const timestamp = Math.round(Date.now() / 1000);

	const txt = "orderno=DT20230801220856EKxPzBUN,secret=e57c7ce528c4fd09c59e1068c1d3a16b,timestamp=" + timestamp
	const sign = md5(txt).toUpperCase();

	return "sign=" + sign + "&orderno=DT20230801220856EKxPzBUN&timestamp=" + timestamp + "&change=true"


}

const wbi_keys = getWbiKeys()
// const query = encWbi(
//     {
//         foo: '114',
//         bar: '514',
//         baz: 1919810
//     },
//     wbi_keys.img_key,
//     wbi_keys.sub_key
// )

/*-----------------------------------------------常用API--------------------------------------------------*/

let HNAPI = {


	// addMedia: async function(season_id) {
	// 	return new Promise((resolve) => {
	// 		Ajax.post({
	// 			url: BILIBLI_PATH.api + "/pgc/web/follow/add",
	// 			hasCookies: true,
	// 			dataType: 'application/x-www-form-urlencoded',
	// 			data: {

	// 				season_id: season_id,
	// 				csrf: Live_info.csrf_token

	// 			},
	// 			success: responseText => {
	// 				let res = HNTOOL.strToJson(responseText);
	// 				if (res.code === 0) {
	// 					HNTOOL.console("追番" + res.message)
	// 					resolve(true);
	// 				} else {
	// 					HNTOOL.console("追番" + res.message)
	// 					resolve(false);
	// 				}
	// 			}
	// 		})
	// 	});
	// },
	// /**
	//  * 番剧列表
	//  * @param {Object} page
	//  */
	// getMedialist: async function(page) {
	// 	return new Promise((resolve) => {

	// 		Ajax.get({
	// 			url: "https://api.bilibili.com/pgc/season/index/result",
	// 			queryStringsObj: {
	// 				"page": page,
	// 				"season_type": 1,
	// 				"pagesize": 20,
	// 				"type": 1,
	// 			},
	// 			hasCookies: true,
	// 			success: responseText => {
	// 				let res = HNTOOL.strToJson(responseText);
	// 				if (res.code === 0) {

	// 					resolve(res.data.list);
	// 				} else {

	// 					resolve(false);
	// 				}
	// 			}
	// 		})
	// 	});
	// },


	getJointime: async function(visitor_uid) {
		return new Promise((resolve) => {

			Ajax.get({
				url: "https://member.bilibili.com/x2/creative/h5/calendar/event",
				queryStringsObj: {
					"ts": 0
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.pfs.profile.jointime);
					} else {

						resolve(false);
					}
				}
			})
		});
	},


	// web_heartbeat_video: async function(avid) {
	// 	return new Promise((resolve) => {
	// 		Ajax.post({
	// 			url: BILIBLI_PATH.api + "/x/click-interface/web/heartbeat",
	// 			hasCookies: true,
	// 			dataType: 'application/x-www-form-urlencoded',
	// 			data: {

	// 				avid: avid,

	// 			},
	// 			success: responseText => {
	// 				let res = HNTOOL.strToJson(responseText);
	// 				if (res.code === 0) {

	// 					resolve(true);
	// 				} else {

	// 					resolve(false);
	// 				}
	// 			}
	// 		})
	// 	});
	// },

	/**
	 * 获取该用户动态抽奖信息
	 * @param {Object} visitor_uid
	 */
	// getDynamicMasageByUid: async function(visitor_uid) {
	// 	return new Promise((resolve) => {

	// 		Ajax.get({
	// 			url: BILIBLI_PATH.api + "/x/space/dynamic/search",
	// 			queryStringsObj: {
	// 				'mid': visitor_uid,
	// 				'keyword': "抽奖",
	// 				'pn': 1,
	// 				'ps': 30

	// 			},
	// 			hasCookies: true,
	// 			success: responseText => {
	// 				let res = HNTOOL.strToJson(responseText);
	// 				if (res.code === 0) {

	// 					resolve(res.data.cards);
	// 				} else {

	// 					resolve(false);
	// 				}
	// 			}
	// 		})
	// 	});
	// },

	basePost: async function(api, data) {
		return new Promise((resolve) => {
			Ajax.post({
				url: api,
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: data,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res);
					} else {
						HNTOOL.console(res.message);

						resolve({
							err: res.message
						});
					}
				}
			})
		});
	},



	baseGet: async function(api, queryObj) {
		return new Promise((resolve) => {

			Ajax.get({
				url: api,
				queryStringsObj: queryObj,
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res);
					} else {

						resolve(false);
					}
				}
			})
		});
	},

	exchange_chance: async function(activity_id) {
		return new Promise((resolve) => {

			Ajax.get({
				url: "https://qcloud-sdkact-api.biligame.com/exchange/chance",
				queryStringsObj: {
					't': Math.round(new Date()),
					'activity_id': activity_id,

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {

						resolve(false);
					}
				}
			})
		});
	},
	wwjdg_inform: async function(activity_id) {
		return new Promise((resolve) => {

			Ajax.get({
				url: "https://qcloud-sdkact-api.biligame.com/wwjdg/inform",
				queryStringsObj: {
					't': Math.round(new Date()),
					'activity_id': activity_id,

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {

						resolve(false);
					}
				}
			})
		});
	},
	wwjdg_inform_off: async function(activity_id, info_no) {
		return new Promise((resolve) => {
			Ajax.post({
				url: "https://qcloud-sdkact-api.biligame.com/wwjdg/inform/off?t=" + Math
					.round(
						new Date()),
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {

					activity_id: activity_id,
					info_no: info_no,

				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {

						resolve(false);
					}
				}
			})
		});
	},

	exchange_prize: async function(activity_id) {
		return new Promise((resolve) => {

			Ajax.get({
				url: "https://qcloud-sdkact-api.biligame.com/wwjdg/exchange_prize",
				queryStringsObj: {
					't': Math.round(new Date()),
					'activity_id': activity_id,
					'prize_id': 5629853426288896,
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {

						resolve(false);
					}
				}
			})
		});
	},

	jury_case_opinion: async function(case_id) {
		return new Promise((resolve) => {

			Ajax.get({
				url: BILIBLI_PATH.api + "/x/credit/v2/jury/case/opinion",
				queryStringsObj: {
					'case_id': case_id,
					'pn': 1,
					'ps': 5,

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(true);
					} else {

						HNTOOL.console("获取案件详情发生错误！" + res.message, "error");

						resolve(false);
					}
				}
			})
		});
	},
	/**
	 *
	 */
	jury_case_info: async function(case_id) {
		return new Promise((resolve) => {

			Ajax.get({
				url: BILIBLI_PATH.api + "/x/credit/v2/jury/case/info",
				queryStringsObj: {
					'case_id': case_id
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						let comment_content = "";
						let itemlist = [1, 1, 1, 1, 2, 2, 2, 2, 3, 0];
						let x = itemlist[HNTOOL.random(0, 10)];

						let vote_item = res.data.vote_items[x];
						let case_type = res.data.case_type;
						if (case_type == 4) {
							//4：截屏内弹幕
							comment_content = "截屏内弹幕";

						} else {
							comment_content = res.data.case_info.comment.content;
						}


						HNTOOL.console(
							"\n 案号：" + case_id +
							"\n 详情:" + comment_content +
							"\n 选择:" + vote_item.vote_text
						);
						resolve(vote_item.vote);
					} else {

						HNTOOL.console("获取案件详情发生错误！" + res.message, "error");

						resolve(false);
					}
				}
			})
		});
	},

	/**
	 *
	 */
	jury_case_next: async function() {
		return new Promise((resolve) => {

			Ajax.get({
				url: BILIBLI_PATH.api + '/x/credit/v2/jury/case/next',
				queryStringsObj: {

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.case_id);
					} else if (res.code === 25014 || res.code === 25008) {

						HNTOOL.console(res.message);


					} else {
						HNTOOL.console("今日风纪已完成&暂时无案子！");
						resolve(false);
					}
				}
			})
		});
	},

	answer_check: async function(question_id, ans_hash, type) {
		return new Promise((resolve) => {
			Ajax.post({

				url: "https://api.bilibili.com/x/answer/v4/" + type + "/check",
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {
					question_id: question_id,
					ans_hash: ans_hash,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						console.log("答题成功");
						resolve(res.data);
					} else if (res.code === 41020) {
						resolve(1);
					} else {
						javaex.tip({
							content: "错误！",
							type: "error"
						});
						resolve(false);
					}
				}
			})
		});
	},

	


	/**
	 * 查询每日投币数量
	 */
	get_account_exp: async function() {
		return new Promise((resolve) => {
			Ajax.get({
				url: 'http://www.bilibili.com/plus/account/exp.php',
				queryStringsObj: {

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.number);

					} else {
						console.log("查询每日投币数量失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},
	/**
	 * 查询每日奖励状态
	 */
	get_exp_reward: async function() {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.api + '/x/member/web/exp/reward',
				queryStringsObj: {

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data);

					} else {
						console.log("查询每日奖励状态失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},

	diary_upload: async function(activity_id, game_part) {
		return new Promise((resolve) => {
			Ajax.post({
				url: "https://qcloud-sdkact-api.biligame.com/rabbit/diary/upload",
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {
					t: Math.round(new Date()),
					activity_id: activity_id,
					game_part: game_part
				},
				payload: '{"activity_id":"' + activity_id + '","game_part":' + game_part +
					'}',

				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						console.log("成功：");
						resolve(true);
					} else {
						javaex.tip({
							content: "错误！",
							type: "error"
						});
						resolve(false);
					}
				}
			})
		});
	},
	lottery_draw: async function(activity_id) {
		return new Promise((resolve) => {
			Ajax.post({
				url: "https://qcloud-sdkact-api.biligame.com/activity/lottery/draw",
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {
					t: Math.round(new Date()),
					activity_id: activity_id,
				},
				payload: '{"activity_id":"' + activity_id + '","t":' + Math.round(
						new Date()) +
					'}',

				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						console.log("成功");
						resolve(true);
					} else {
						javaex.tip({
							content: "错误！",
							type: "error"
						});
						resolve(false);
					}
				}
			})
		});
	},
	lottery_record: async function(activity_id) {
		return new Promise((resolve) => {
			Ajax.get({
				url: 'https://qcloud-sdkact-api.biligame.com/common/lottery/record',
				queryStringsObj: {
					t: Math.round(new Date()),
					activity_id: activity_id,
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						let str = "";
						for (let s of res.data) {
							str += s.name
						}

						resolve(str);

					} else {
						console.log("查询每日奖励状态失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},
	get_draw_chance: async function(activity_id) {
		return new Promise((resolve) => {
			Ajax.get({
				url: 'https://qcloud-sdkact-api.biligame.com/activity/lottery/get_draw_chance',
				queryStringsObj: {
					t: Math.round(new Date()),
					activity_id: activity_id,
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);

					} else {
						console.log("查询每日奖励状态失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},
	/**
	 * 转发一个视频
	 * @param {Object} videoAid
	 * @param {Object} videoMid
	 * @param {Object} randomStr
	 */

	

	
	/**
	 * @param {num} mid
	 * 用户详细信息2 (用于名片)
	 */
	getInterfaceCard: async function(mid) {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.api + '/x/web-interface/card',
				queryStringsObj: {
					"mid": mid
				},

				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.card);

					} else {
						console.log("获取用户详细信息失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},


	getLotteryNotice: async function(dynamic_id) {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.vcapi + '/lottery_svr/v1/lottery_svr/lottery_notice',
				queryStringsObj: {
					"dynamic_id": dynamic_id
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data);

					} else {
						console.log("获取开奖信息失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},


	likeDynamic: async function(dynamic_id) {

		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.vcapi + '/dynamic_like/v1/dynamic_like/thumb',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {
					uid: Live_info.uid,
					dynamic_id: dynamic_id,
					up: 1,
					csrf: Live_info.csrf_token,
					csrf_token: Live_info.csrf_token,
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "动态点赞成功！",
							type: "success"
						});

						resolve(true);
					} else {

						console.log("动态点赞发生错误！" + res.message);

						javaex.tip({
							content: "动态点赞发生错误！" + res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	repostDynamic: async function(dynamic_id, content, ctrl) {

		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.vcapi + '/dynamic_repost/v1/dynamic_repost/repost',
				dataType: 'application/x-www-form-urlencoded',
				hasCookies: true,
				data: {
					uid: Live_info.uid,
					dynamic_id: dynamic_id,
					content: content,
					extension: '{"emoji_type":1}',
					at_uids: "",
					ctrl: ctrl == null || ctrl == "转发动态" ? "[]" : ctrl,
					csrf_token: Live_info.csrf_token,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "动态转发成功！",
							type: "success"
						});

						resolve(true);
					} else {

						console.log("动态转发发生错误！" + res.message);

						javaex.tip({
							content: "动态转发发生错误！" + res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	addReply: async function(oid, type) {

		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/v2/reply/add',
				dataType: 'application/x-www-form-urlencoded',
				hasCookies: true,
				data: {
					"oid": oid,
					"type": type, //11官方  17 加码
					"ordering": 'time',
					"message": HNTOOL.getRandomWordOfList(replyList) == undefined ?
						"不错[鼓掌]" : HNTOOL.getRandomWordOfList(
							replyList),
					"jsonp": 'jsonp',
					"plat": 1,
					"csrf": Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						javaex.tip({
							content: "'自动评论成功'！",
							type: "success"
						});
						resolve(0);
					} else if (res.code === -404) {
						console.log('自动评论原动态已删除');
						resolve(0);
					} else if (res.code === 12002) {
						console.log('自动评论评论区已关闭');
						resolve(0);
					} else if (res.code === 12015) {
						console.log('自动评论需要输入验证码');
						resolve(1);
					} else {
						console.log('自动评论', `评论失败\n${responseText}`);
						resolve(0);
					}
				}
			})
		});
	},


	setNotice: async function(notice) {

		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/space/notice/set',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					notice: notice,
					jsonp: 'jsonp',
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "动态标记保存到个人公告成功！",
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	getSpaceNotice: async function() {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.api + '/x/space/notice',
				queryStringsObj: {
					"mid": Live_info.uid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data);

					} else {
						console.log("获取公告信息失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},

	getdynamicData: async function(dynamic_id_str) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.vcapi + '/dynamic_svr/v1/dynamic_svr/get_dynamic_detail',
				queryStringsObj: {
					"dynamic_id": dynamic_id_str
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data);

					} else {
						console.log("获取动态信息失败：" + res.message);
						resolve(false);
					}
				}
			})
		});
	},

	getAllFollow: async function() {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.vcapi + '/feed/v1/feed/get_attention_list',
				queryStringsObj: {
					"uid": Live_info.uid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.list);

					} else {
						console.log("查询失败！" + res.message);
						resolve(false);
					}
				}
			})
		});
	},

	getCardByUID: async function(UID) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/web-interface/card',
				queryStringsObj: {
					"mid": UID
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.card);

					} else {
						console.log("查询失败！" + res.message);
						resolve(false);
					}
				}
			})
		});
	},


	/**
	 *
	 *
	 */

	getTodayDynamicList: async function(mid, index) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/space/article',
				queryStringsObj: {
					"mid": mid,
					"pn": 1,
					"ps": 12,
					"sort": 'publish_time'
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						let artlist = false;
						let articlesList = [];
						let articles = res.data.articles;
						for (var i = 0, len = articles.length; i < index; i++) {
							articlesList[i] = articles[i];
						}

						resolve(articlesList);
					} else {


						console.log("查询失败！" + res.message);
						resolve(false);
					}
				}
			})
		});
	},

	getDataByLiveSid: async function(ids) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/activity/up/reserve/relation/info',
				queryStringsObj: {
					"ids": ids
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0 && Object.keys(res.data.list).length != 0) {

						resolve(res.data.list);
					} else {

						/* javaex.tip({
							content: "查询失败！" + res.message,
							type: "error"
						}); */
						console.log("查询失败！" + res.message);

						resolve(false);
					}
				}
			})
		});
	},

	/**
	 * 每日登录  https://api.bilibili.com/x/report/click/now                    : "jsonp"
	 */
	clickNow: async function() {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/report/click/now',
				queryStringsObj: {
					jsonp: "jsonp"
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "每日登录" + res.data.text,
							type: "success"
						});
						resolve(true);

					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	/**
	 * 每日分享视频(客户端) psot  https://api.bilibili.com/x/web-interface/share/add  aid csrf
	 * @param {number} videoAid
	 */
	addShare: async function(videoAid) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/web-interface/share/add',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					aid: videoAid,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "每日分享视频成功",
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},



	/**
	 * 每日视频投币  post https://api.bilibili.com/x/web-interface/coin/add
	 * @param {number} videoAid
	 */
	addArticleCoin: async function(cvID, mid) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/web-interface/coin/add',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					aid: cvID,
					upid: mid,
					multiply: 2,
					avtype: 2,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: '专栏:' + cvID + "投币成功",
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						console.log('专栏投币失败:' + cvID + res.message);

						resolve(false);
					}
				}
			})
		});
	},

	/**
	 * 每日视频投币  post https://api.bilibili.com/x/web-interface/coin/add
	 * @param {number} videoAid
	 */
	addVideoCoin: async function(videoAid) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/web-interface/coin/add',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					aid: videoAid,
					multiply: 2,
					select_like: 0,
					cross_domain: true,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "投币成功",
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},


	//1.直播签到 https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign

	DoSign: async function() {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.live + '/xlive/web-ucenter/v1/sign/DoSign',
				queryStringsObj: {

				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "签到成功:" + res.data.text,
							type: "success"
						});
						resolve(true);

					} else if (res.code === 1011040) {

						javaex.tip({
							content: res.message,
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},


	/**
	 * // 获取分区最新专栏列表  https://api.bilibili.com/x/article/recommends?cid=0&pn=1
	 */
	getArticleRecommends: async function() {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/article/recommends',
				queryStringsObj: {
					"cid": 0,
					"pn": 1
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "获取最新专栏成功！",
							type: "success"
						});
						resolve(res.data);

					} else {

						javaex.tip({
							content: "获取最新专栏失败！" + res.message,
							type: "error"
						});

						console.log(res.message);

						resolve(false);
					}
				}
			})
		});
	},
	/**
	 * // 获取分区最新视频列表
	 */
	getDynamicRegion: async function() {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/web-interface/dynamic/region',
				queryStringsObj: {
					"pn": 1,
					"ps": 20,
					"rid": 21
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: "获取分区最新视频成功",
							type: "success"
						});
						resolve(res.data.archives);

					} else {

						javaex.tip({
							content: "获取分区最新视频失败" + res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	/*
	 * 预约抽奖 https://api.bilibili.com/x/space/reserve sid jsonp=jsonp csrf
	 * @param {Object} sid
	 */
	reserveActivity: async function(sid) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/space/reserve',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					sid: sid, //当前用户
					jsonp: "jsonp",
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {
						javaex.tip({
							content: res.message,
							type: "error"
						});
						resolve(false);
					}
				}
			})
		});
	},
	/**
	reserveActivity: async function(sid, reserve_total) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.vcapi + '/dynamic_mix/v1/dynamic_mix/reserve_attach_card_button',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					reserve_id: sid,
					cur_btn_status: 1,
					reserve_total: reserve_total,
					csrf: Live_info.csrf_token
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	}, */

	getGiftList: async function(room) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.live + '/xlive/web-room/v1/gift/bag_list',
				queryStringsObj: {
					"room_id": room
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(res.data.list);
					} else {

						javaex.tip({
							content: "查询包裹失败！" + res.message,
							type: "error"
						});

						resolve(false)
					}
				}
			})
		});
	},

	/**
	 * 送银B克拉
	 * @param {Object} ruid
	 * @param {Object} roomid
	 */
	bagSendGift: async function(ruid, roomid, bag_id) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.live + '/gift/v2/live/bag_send',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					uid: Live_info.uid, //当前用户
					gift_id: 3,
					ruid: ruid,
					send_ruid: 0,
					gift_num: 1,
					bag_id: bag_id,
					//rnd: Math.round(new Date() / 1000); //时间戳,
					platform: 'pc',
					biz_code: 'Live',
					biz_id: roomid,
					storm_beat_id: 0,
					price: 0,
					csrf_token: Live_info.csrf_token,
					csrf: Live_info.csrf_token

				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						javaex.tip({
							content: roomid + "赠送b克拉成功！" + res.message,
							type: "success"
						});

						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},


	/**
	 * 判断是否有勋章
	 * @param {Object} uid
	 * @param {Object} room
	 */

	getFansMedalInfo: async function(uid, room) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.live + '/xlive/app-ucenter/v1/fansMedal/fans_medal_info',
				queryStringsObj: {
					"target_id": uid,
					"room_id": room
				},
				//dataType:'application/json, text/plain, */*',
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						if (res.data.my_fans_medal.level == 0) {
							resolve(false)
						} else {
							resolve(true)
						}

					} else {

						javaex.tip({
							content: "查询勋章失败！" + res.message,
							type: "error"
						});

						resolve(false)
					}
				}
			})
		});
	},




	getDisuidList: async function(re_version, pn) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/relation/blacks',
				queryStringsObj: {
					"re_version": re_version,
					"pn": pn
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data.list)
					} else {

						javaex.tip({
							content: "查询黑名单失败！" + res.message,
							type: "error"
						});

						resolve(null)
					}
				}
			})
		});
	},

	/**
	 * @param {Object} uid
	 * @param {Object} act 1关注,2取关,3悄悄关注,4取消悄悄关注,5拉黑,6取消拉黑,7踢出粉丝;
	 */
	cancelAtt: async function(uid, act, re_src) {
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + '/x/relation/modify',
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {
					fid: uid,
					act: act,
					re_src: re_src == undefined ? 11 : 116,
					jsonp: "jsonp",
					csrf: Live_info.csrf_token,
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						//HNAPI.cancelAtt(uid, 6);

						javaex.tip({
							content: "取关成功！" + res.message,
							type: "success"
						});

						resolve(true);
					} else if (res.code === 22003) {

						HNAPI.cancelAtt(uid, 6);

						javaex.tip({
							content: "取消拉黑" + res.message,
							type: "success"
						});
						resolve(true);
					} else {

						javaex.tip({
							content: res.message,
							type: "error"
						});

						resolve(false);
					}
				}
			})
		});
	},

	getRoomMsg: async function(roomid) {
		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.live + '/live_user/v1/UserInfo/get_anchor_in_room',
				queryStringsObj: {
					"roomid": roomid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data.info.uid)
					} else {
						resolve(false)
					}
				}
			})
		});
	},

	/**
	 *
	 * @param sid
	 * @returns {Promise<unknown>}
	 */
	lotteryDo: async function(sid, name) {
		return new Promise((resolve) => {
			let func_url = BILIBLI_PATH.api + '/x/activity/lottery/do';
			if (sid.indexOf("newLottery") != -1) {
				func_url = BILIBLI_PATH.api + "/x/lottery/do";
			}
			Ajax.post({
				url: func_url,
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {

					sid: sid,
					type: 1,
					csrf: Live_info.csrf_token,
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						HNTOOL.console("活动转盘:" + name + "\n " + (res.data)[0]
							.gift_name);
						resolve((res.data)[0].gift_name);

					} else if (res.code ===
						75400) { // || res.code === 75003  || res.code === 75403

						resolve(true);
					} else {
						javaex.tip({
							content: "本次抽奖失败！" + res.message,
							type: "error"
						});
						resolve(false);
					}
				}
			})
		});
	},


	getLotteryMytimes: async function(sid) {
		let func_url = BILIBLI_PATH.api + '/x/activity/lottery/mytimes';
		if (sid.indexOf("newLottery") != -1) {
			func_url = BILIBLI_PATH.api + "/x/lottery/mytimes";
		}
		return new Promise((resolve) => {
			Ajax.get({
				url: func_url,
				queryStringsObj: {
					sid: sid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data.times)
					} else {
						resolve(0)
					}
				}
			})
		});
	},

	/**
	 * 增加抽奖次数一般是分享
	 * @param sid 活动sid
	 * @returns {Promise<unknown>} 0 成功 1:活动结束
	 */
	addLotteryTimes: async function(sid) {
		let func_url = BILIBLI_PATH.api + '/x/activity/lottery/addtimes';
		if (sid.indexOf("newLottery") != -1) {
			func_url = BILIBLI_PATH.api + "/x/lottery/addtimes";
		}

		return new Promise((resolve) => {
			Ajax.post({
				url: func_url,
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
				data: {

					sid: sid,
					action_type: 3,
					csrf: Live_info.csrf_token,
				},
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(0)
					} else if (res.code === 75003 || res.code === 170405 || res.code ===
						75001 || res.code === 170001 || res.code === 75405) {

						resolve(1)

					} else {

						resolve(res.message);
					}
				}
			})
		});
	},
	/**
	 * 查询用户关注 默认一次查询50
	 * @param vmid 用户uid
	 * @param pn 页码
	 * @returns {Promise<unknown>}
	 */
	getMyFollow: async function(vmid, pn) {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.api + '/x/relation/followings',
				queryStringsObj: {
					vmid: vmid,
					pn: pn
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data)
					} else {
						resolve(null)
					}
				}
			})
		});
	},


	getMyinfo: function() {
		return new Promise((resolve) => {
			Ajax.get({
				url: BILIBLI_PATH.api + '/x/space/myinfo',
				queryStringsObj: {},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data)
					} else {
						resolve(null)
					}
				}
			})
		});
	},

	getMyJson: function(url) {
		return new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: function(response) {
					const res = HNTOOL.strToJson((response || {}).responseText)
					resolve(res);
				}
			});
		})
	},


	userInfo: function(mid) {

		Ajax.get({
			url: BILIBLI_PATH.api + '/x/space/acc/info',
			queryStringsObj: {
				mid: mid
			},
			hasCookies: true,
			success: responseText => {

				var json = JSON.parse(responseText);

				if (json.code != 0) {


				}
			}
		});

	},

	sendQmsg: async function(key, msg) {

		$.ajax({
			url: "https://qmsg.zendee.cn/send/" + key + "?msg=" + msg,

			success: function(result) {

			}
		});


		/*GM_xmlhttpRequest({
			method: "GET",
			url: `https://qmsg.zendee.cn/send/${key}?msg=${msg}`,
			onload: function (response) {

				let json = JSON.parse(response.response);
				if (json.code == 0) {

					javaex.tip({
						content: "自动动态中奖提醒成功！" + json.reason,
						type: "success"
					});
				} else {
					console.log("自动动态中奖提醒失败！" + json.reason);
					javaex.tip({
						content: "自动动态中奖提醒失败！" + json.reason,
						type: "error"
					});
				}

			}
		});*/

	},

	/**
	 * //https://api.bilibili.com/x/relation/modify
	 *
	 * @param UID
	 */
	disUserByUid: function(vmid) {

		Ajax.post({
			url: BILIBLI_PATH.api + '/x/relation/modify',
			data: {
				fid: parseInt(vmid),
				re_src: 11,
				act: 5,
				jsonp: "jsonp",
				csrf: Live_info.csrf_token,
			},
			hasCookies: true,
			dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
			success: responseText => {

				var json = JSON.parse(responseText);

				if (json.code != 0) {

					console.log("拉黑用户失败uid:" + vmid + " 错误信息" + json.message);
					javaex.tip({
						content: "拉黑用户失败uid:" + vmid + " 错误信息" + json.message,
						type: "error"
					});

				} else {
					console.log("拉黑用户成功 uid:" + vmid);
					javaex.tip({
						content: "拉黑用户成功 uid:" + vmid,
						type: "success"
					});
				}
			}
		});

	},
	/**
	 * http://api.bilibili.com/x/web-interface/view
	 * @param BV
	 * 心跳间隔15秒
	 */
	watchOneVideo: function(BV, MID) {

		//1.调用点击播放接口 https://api.bilibili.com/x/click-interface/click/web/h5
		Ajax.post({
			url: BILIBLI_PATH.api + "/x/click-interface/click/web/h5",
			hasCookies: true,
			dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data: {

				"bvid": BV,
				"part": 1,
				"mid": Live_info.uid,
				"lv": 2,
				"jsonp": "jsonp",
				"type": 3,
				"sub_type": 0
			},
			success: responseText => {

				let json = JSON.parse(responseText);

				if (/^{"code":0/.test(responseText)) {
					//发送一次心跳
					HNAPI.sendHeartbeat(BV, MID);

				} else {
					javaex.tip({
						content: "视频" + data.bvid + "播放失败！" + json.message,
						type: "error"
					});
				}
			}
		})


	},

	//上报视频播放心跳（web端）
	/**
	 * http://api.bilibili.com/x/click-interface/web/heartbeat
	 * @param json
	 */
	sendHeartbeat: function(bvid, MID) {

		Ajax.post({
			url: BILIBLI_PATH.api + "/x/click-interface/web/heartbeat",
			hasCookies: true,
			dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
			//aid=756988764&bvid=BV1wr4y1P782&cid=304166326&page=1
			data: {
				"bvid": bvid,
				"type": 3,
				"dt": 2,
				"played_time": HNTOOL.random(12, 40),
				"realtime": HNTOOL.random(12, 40),
				"play_type": 0
			},
			success: responseText => {

				if (/^{"code":0/.test(responseText) && MID != BiliData.author_uid) {

					javaex.tip({
						content: "视频BV" + bvid + "播放一次！",
						type: "success"
					});
				}
			}
		})

	},
	/**
	 * 视频播放
	 * https://api.bilibili.com/x/click-interface/click/web/h5
	 */
	playVideo: async function(mid, aid) {
		// Proxy_Authorization = getProxyAuthorization()
		return new Promise((resolve) => {
			Ajax.post({
				url: BILIBLI_PATH.api + "/x/click-interface/click/web/h5",
				hasCookies: true,
				dataType: 'application/x-www-form-urlencoded',
				data: {

					mid: mid,
					aid: aid,
					ftime: Math.round(Date.now() / 1000 - HNTOOL.random(10, 30)),
					stime: Math.round(Date.now() / 1000),
					csrf: Live_info.csrf_token

				},
				// Proxy_Authorization: Proxy_Authorization,
				// Proxy: 'dtbf.xiongmaodaili.com:8089',

				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {

						resolve(true);
					} else {

						resolve(false);
					}
				}
			})
		});
	},

	/**
	 * 根据视频bv获取分P
	 * https://api.bilibili.com/x/web-interface/wbi/view/detail?&w_rid=ef21cf2d0bc6bf712d00cddd9e7d0aec&wts=1691055303
	 */
	getVideoListByBvid: async function(BVID) {
		const query = encWbi({
				bvid: BVID
			},
			wbi_keys.img_key,
			wbi_keys.sub_key);

		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/web-interface/wbi/view/detail',
				queryStringsObj: {
					bvid: BVID,
					wts: query.wts,
					w_rid: query.w_rid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data)
					} else {
						resolve(false)
					}
				}
			})
		});
	},


	/**
	 * 获取up所有投稿视频
	 * https://api.bilibili.com/x/space/wbi/arc/search?mid=2097682198&pn=1&w_rid=ef21cf2d0bc6bf712d00cddd9e7d0aec&wts=1691055303
	 */
	getOnePageVideoByUid: async function(mid, pn) {
		const query = encWbi({
				mid: mid,
				pn: pn
			},
			wbi_keys.img_key,
			wbi_keys.sub_key);

		return new Promise((resolve) => {
			Ajax.get({

				url: BILIBLI_PATH.api + '/x/space/wbi/arc/search',
				queryStringsObj: {
					mid: mid,
					pn: pn,
					wts: query.wts,
					w_rid: query.w_rid
				},
				hasCookies: true,
				success: responseText => {
					let res = HNTOOL.strToJson(responseText);
					if (res.code === 0) {
						resolve(res.data)
					} else {
						resolve(false)
					}
				}
			})
		});
	},

	/**
	 *
	 * @param path
	 * @param data
	 * @param saveObj
	 * @param Func
	 */
	publicGet: function(path, queryStringsObj) {

		if (typeof(queryStringsObj) != "undefined") {
			queryStringsObj = {};
		}
		Ajax.get({
			url: BILIBLI_PATH.api + path,
			queryStringsObj: queryStringsObj,
			hasCookies: true,
			success: responseText => {

				let json = JSON.parse(responseText);
				if (chackCode(json.code) && json.code == 0) {

					return json.data;
				}

				return false;

			}
		})

	},

	/**
	 * 导航栏用户信息
	 */
	getUserNav: async function() {

		GM_xmlhttpRequest({
			method: "GET",
			url: BILIBLI_PATH.api + "/x/web-interface/nav",
			//timeout:3000,
			onload: function(response) {

				let json = JSON.parse(response.response);
				console.log(json);
				BiliData.login_code = json.code;
				BiliData.login_message = json.message;
				BiliData.LoginData = json.data;

			}
		});

	},

	/**
	 * 获取某up详细信息
	 * http://api.bilibili.com/x/web-interface/card
	 */
	getUpCard: function(mid) {

		Ajax.get({
			url: BILIBLI_PATH.api + '/x/web-interface/card',
			queryStringsObj: {
				mid: mid,
				photo: false
			},
			hasCookies: true,
			success: responseText => {

				var json = JSON.parse(responseText);

				if (json.code != 0) {

					javaex.tip({
						content: "查询失败！" + json.message,
						type: "success"
					});
					return false;
				} else {
					BiliData.upCard = json;

				}


			}
		})

	},

	/**
	 *
	 * @param uid 用户uid
	 * @param ps 每页视频个数 默认30个
	 * @param pn 第几页
	 */
	getUpAllVideo: function(uid, ps, pn) {

	},
	getChallenge: async function() {


	},
	/**
	 * 硬币记录
	 * @returns {Promise<void>}
	 */
	getCoinLog: async function() {

		GM_xmlhttpRequest({
			method: "GET",
			url: BILIBLI_PATH.api + "/x/member/web/coin/log",
			//url: "http://api.bilibili.com/x/member/web/coin/log",
			onload: function(response) {

				let json = JSON.parse(response.response);
				if (json.code == 0) {

					console.log("硬币记录" + json);
					BiliData.CoinLog = json.data;

					return true;
				}

			}
		});
	},
	/**
	 * 未读消息数 http://api.bilibili.com/x/msgfeed/unread
	 * @returns {Promise<void>}
	 */
	getUnread: async function() {

		Ajax.get({
			url: BILIBLI_PATH.api + "/x/msgfeed/unread",
			hasCookies: true,
			success: responseText => {

				let json = JSON.parse(responseText);
				if (chackCode(json.code) && json.code == 0) {

					BiliData.Unread = json.data;
					showUnreadMsg();
				}

				return false;

			}
		})

		/* GM_xmlhttpRequest({
			 method: "GET",
			 url: BILIBLI_PATH.api + "/x/msgfeed/unread",
			 onload: function (response) {

				 let json = JSON.parse(response.response);

				 if (chackCode(json.code) && json.code == 0) {

					 BiliData.Unread = json.code;
					 showUnreadMsg();

				 }

			 }
		 });*/
	},
	/**
	 *
	 * @param type reply:回复我的 at @我的
	 */
	getMsgfeed: function(type) {
		Ajax.get({
			url: BILIBLI_PATH.api + '/x/msgfeed/' + type,
			queryStringsObj: {
				build: 0,
				mobi_app: 'web'
			},
			hasCookies: true,
			success: responseText => {

				var json = JSON.parse(responseText);

				if (json.code != 0 || !json.data.cursor.is_end || json.data.items == null) {
					return false;
				} else {
					chackAtMsg(json.data.items);

					return true;
				}


			}
		})

	},

	/** 未读消息数 http://api.bilibili.com/x/space/arc/search?mid=99439379&pn=1&ps=5
	 * @returns {Promise<void>}
	 */
	getUnrewad: async function() {

		GM_xmlhttpRequest({
			method: "GET",
			data: {
				"mid": 99439379,
				"pn": 1,
				"ps": 5,
			},
			url: BILIBLI_PATH.api + "/x/space/arc/search",
			onload: function(response) {

				let json = JSON.parse(response.response);
				if (json.code == 0) {

					BiliData.Video = json.data;
					console.log("未读消息数" + json);
				}

			}
		});
	},

	/** 动态评论区点赞 https://api.bilibili.com/x/v2/reply/action
	 * @param {number} oid
	 * @param {nbumber} rpid
	 * @param {number} action
	 * @returns {Promise<void>}
	 * type: 11
	 * ordering: heat
	 * jsonp: jsonp
	 * csrf: 54a******* CSRF Token（位于cookie）
	 */

	likeInDynamicComments: async function(latestDynamic) {


		Ajax.post({
			url: BILIBLI_PATH.api + "/x/v2/reply/action",
			hasCookies: true,
			dataType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data: {
				"oid": oid,
				"type": 11,
				"rpid": rpid,
				"action": action,
				"ordering": "heat",
				"jsonp": "jsonp",
				"csrf": Live_info.csrf_token,
			},
			success: responseText => {

				if (/^{"code":0/.test(responseText)) {

					BiliData.replyAction = JSON.parse(responseText);
					console.log("点赞成功！" + responseText);
				}
			}
		})

	}


}

/*-----------------------------------------------常用工具函数--------------------------------------------------*/
var http_request = null;

function send_request(url, method) {}

let HNTOOL = {
	/**数组根据数组对象中的某个属性值进行排序的方法
	 * 使用例子：newArray.sort(sortByArr(['number'],false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
	 * @param attr 排序的属性 ['name','sex'...],根据一个字段或者多个字段排序
	 * @param rev true表示升序排列，false降序排序
	 * */

	sortByArr: function(arr, rev) {
		if (rev == undefined) {
			rev = 1;
		} else {
			rev = (rev) ? 1 : -1;
		}
		return function(a, b) {
			for (var i = 0; i < arr.length; i++) {
				let attr = arr[i]
				if (a[attr] != b[attr]) {
					if (a[attr] > b[attr]) {
						return rev * 1;
					} else {
						return rev * -1;
					}
				}
			}
		}
	},


	getvisit_id: function(name = NAME) {

		let str = "xxxxxxxxxxxx".replace(/[x]/g, (function(name) {
			let randomInt = 16 * Math.random() | 0;
			return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toLowerCase();
		}))
		return str

	},
	/**
	 * 判断是否为整数类型方式
	 * @param {Object} obj
	 */
	isInteger: function(obj) {

		return obj % 1 === 0

	},

	jury_case: async function() {

		for (let i = 0; i < 30; i++) {

			//1.获取题号
			let case_id = await HNAPI.jury_case_next();
			await HNTOOL.Sleep(1000);
			if (case_id == false) {
				break;
			}
			//2.获取该题号详情
			let vote = await HNAPI.jury_case_info(case_id);
			await HNTOOL.Sleep(4 * 1000);
			if (vote == false) {
				break;
			}
			let opinion = await HNAPI.jury_case_opinion(case_id);
			await HNTOOL.Sleep(15 * 1000);
			//3.开始答题
			let result = await HNAPI.jury_vote(case_id, vote, 1);
			if (result) {
				HNTOOL.console("第" + (i + 1) + "个案号：" + case_id + "完成！");
			} else {
				alert(result);
			}
			let case_id3 = await HNAPI.jury_case_next();

		}

	},
	console: function(str, color, type) {
		if (color != undefined) {
			console.log(javaex.now() + "\n" + "%c " + str, "color:#" + color + ";font-weight:bold;");
		} else {
			console.log(javaex.now() + "\n" + "%c " + str, "color:#005500;font-weight:bold;");
		}


		javaex.tip({
			content: str,
			type: type == undefined || type == "success" ? "success" : type
		});

	},

	doOneDynamic: async function(randomtime) {

		var myVar = setInterval(async function() {

			let randomStr = await HNTOOL.getRandomString();
			await HNAPI.sendOneDynamic(randomStr);

		}, randomtime);
	},

	getRandomString: function() {

		return new Promise((resolve) => {
			Ajax.get({
				url: "https://api.mcloc.cn/love/",
				//url: 'https://api.mcloc.cn/words/?type=json',//随机一个句子
				//url: 'https://interface.meiriyiwen.com/article/random?dev=1',//随机一个句子
				queryStringsObj: {
					type: "json"
				},
				dataType: "text/html; charset=UTF-8",
				hasCookies: false,
				success: responseText => {

					try {
						let res = HNTOOL.strToJson(responseText);
						resolve(res.data); //随机一句情话
						//resolve(body.data+"---"+body.creator);//随机一个句子
						//resolve(body.data.digest);//随机一个句子
					} catch (e) {

						resolve("你的名字，是我见过最短的情诗。"); //随机一句情话
					}


				}
			})
		});
	},

	getLatestDynamic: async function() {


		let default_data = BILICAT_CONFIG.Dynamic_article_uids;

		let latestDynamic = await HNAPI.getTodayDynamicList(default_data[0], 3);
		await HNTOOL.Sleep(1000);
		let ldList = [];
		let ldList2 = [];
		for (let ld1 of latestDynamic) {

			let ld = await HNTOOL.getDynamicIdList(ld1);
			await HNTOOL.Sleep(1000);
			ldList = ldList.concat(ld);
		}

		let latestDynamic2 = await HNAPI.getTodayDynamicList(default_data[1], 2);
		await HNTOOL.Sleep(1000);

		for (let ld2 of latestDynamic) {

			let ld = await HNTOOL.getDynamicIdList(ld2);
			await HNTOOL.Sleep(1000);
			ldList2 = ldList2.concat(ld);
		}
		ldList.push.apply(ldList, ldList2);

		let result = HNTOOL.arrUnique(ldList, false);

		return result;

	},

	getDynamicIdList: async function(latestDynamic) {



		return new Promise((resolve) => {
			Ajax.get({
				url: "https://www.bilibili.com/read/cv" + latestDynamic.id,
				queryStringsObj: {

				},
				dataType: "text/html; charset=utf-8",
				hasCookies: true,
				success: responseText => {
					let datalist = HNTOOL.httpString(responseText);
					let dls;
					let returnlist = [];
					if (datalist != undefined && datalist.length > 0) {
						for (let dl of datalist) {

							let len = dl.indexOf("?");
							if (len == -1) {
								dl += "?tab=2";
							}
							dls = dl.substring(dl.indexOf("?") - 18, dl.indexOf("?"));
							if (dls == false ||
								dls == null ||
								dl.indexOf("read") > -1 ||
								dl.indexOf("html") > -1 ||
								dl.indexOf("pixiv") > -1 ||
								returnlist.indexOf(dls) > -1) {
								continue;
							}

							returnlist.push(dls);

						}

						resolve(HNTOOL.arrUnique(returnlist, false));
					} else {
						resolve(false);
					}
				}
			})
		});
	},

	httpString: function(s) {
		//var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
		//var reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		//var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
		//var reg=/(http(s)?\:\/\/)?(www\.)?(\w+\:\d+)?(\/\w+)+\.(swf|gif|jpg|bmp|jpeg)/gi;
		var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
		//var reg= /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
		//v = v.replace(reg, "<a href='$1$2'>$1$2</a>"); //这里的reg就是上面的正则表达式
		//s = s.replace(reg, "$1$2"); //这里的reg就是上面的正则表达式
		s = s.match(reg);
		console.log(s)
		return (s)
	},

	saveConfig: function() {

		localStorage.setItem(`HN_SETUP_CONFIG`, JSON.stringify(HN_SETUP_CONFIG));
		/* javaex.tip({
			content: "配置保存成功！",
			type: "success"
		}); */

	},

	copyText: function(domId) {
		let btn = document.getElementById(domId);
		btn.select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
			javaex.tip({
				content: "复制成功！",
				type: "success"
			});
		}

	},
	/**
	 * s数组去重并排序
	 */

	arrUnique: function(ary, isSort) {

		if (isSort == undefined) {
			isSort = true
		}
		let obj = {};
		for (let i = 0; i < ary.length; i++) { //this 指向方法.前的对象ary
			let item = ary[i]
			obj.hasOwnProperty(item) ? (ary[i] = ary[ary.length - 1], ary.pop(), i--) : obj[item] = item
		} //判断对象obj中是否有item元素，如果有 让当前元素等于数组最后一个元素，删除最后一个元素
		//                           如果没有   将这个元素添加到对象中
		if (isSort) {
			ary.sort((a, b) => {
				return a - b
			}) // 数组去重后 按升序排列
		}

		obj = null;

		javaex.tip({
			content: "已去重！",
			type: "success"
		});
		return ary;

	},

	split_array: function(arr, len) {

		let arr_length = arr.length;
		let newArr = [];
		for (let i = 0; i < arr_length; i += len) {
			newArr.push(arr.slice(i, i + len));
		}
		return newArr;
	},
	strToJson: function(params) {
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
	},

	chackAtMsg: function() {

		let config = HNTOOL.getConfig();
		if (config.qmsg_checked == true && config.qmsg_key) {

			document.getElementById("getAtMsg").click();

		}

	},

	cssChecked: function(id, dom) {

		dom == true ? $(id).attr("checked", true) : $(id).removeProp("checked");


	},
	getConfig: function() {

		let CONFIG = JSON.parse(localStorage.getItem(`HN_SETUP_CONFIG`));

		if (CONFIG == null) {
			CONFIG = HN_SETUP_CONFIG;
		}

		return CONFIG;
	},

	/**
	 *  获取cookie 中某个键对应的值
	 * @param name
	 */

	getCookie: function(name) {
		let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) return escape(arr[2]);
		return false;
	},
	/**
	 * 得到一个字符串数组的中随机一个
	 * @param {List} list
	 */


	getRandomWordOfList: function(list) {
		var L = list.length;
		var i = Math.ceil(Math.random() * (L - 1));

		return list[i];
	},
	/**
	 * 随机数
	 * @param {Object} min 最小值
	 * @param {Object} max 最大值
	 */
	random: function(min, max) {

		return Math.floor(Math.random() * (max - min)) + min;
	},

	Sleep: function(ms) {
		return new Promise(resolve => setTimeout(() => resolve('sleep'), ms));
	}

}

let errorMsg = {
	"-1": "应用程序不存在或已被封禁!",
	"-2": "Access Key错误!",
	"-3": "API校验密匙错误!",
	"-4": "调用方对该Method没有权限!",
	"-101": "账号未登录!",
	"-102": "账号被封停!",
	"-103": "积分不足!",
	"-104": "硬币不足!",
	"-105": "验证码错误!",
	"-106": "账号非正式会员或在适应期!",
	"-107": "应用不存在或者被封禁!",
	"-108": "未绑定手机!",
	"-109": "未知!",
	"-110": "未绑定手机!",
	"-111": "csrf 校验失败!",
	"-112": "系统升级中!",
	"-113": "账号尚未实名认证!",
	"-114": "请先绑定手机!",
	"-115": "请先完成实名认证!",
	"-304": "木有改动!",
	"-307": "撞车跳转!",
	"-400": "请求错误!",
	"-401": "未认证!",
	"-403": "访问权限不足!",
	"-404": "啥都木有!",
}

/*-----------------------------------------------CODE 统一检查--------------------------------------------------*/
/**
 *
 * @param code
 * @constructor
 */
let chackCode = function(code) {

	let emsg = errorMsg[code + ""];
	if (emsg != null) {
		javaex.tip({
			content: emsg,
			type: "error"
		});

		return false;
	}

	return true;
}


/*-----------------------------------------------localStorage封装 （本地存储信息）--------------------------------------------------*/
//javaex.setLocalStorage(key, value); var str = javaex.getLocalStorage(key); javaex.deleteLocalStorage(key);

/*window.onbeforeunload = function() {
	if (!canLeavePage()) {
		return ('确认离开当前页面吗？未保存的数据将会丢失！');
	}
};*/


/**
 * Ajax请求对象
 */
const Ajax = (() => {
	/**
	 * 检查options是否符合要求
	 * @param {object} options
	 * @returns {boolean}
	 */
	function checkOptions(options) {
		let result = false;
		if (typeof options !== 'object') {
			console.warn('类型错误: typeof Options !== Object');
			return result;
		} else {
			if (typeof options.url !== 'string') {
				console.warn('类型错误: typeof Link !== Strings');
				return result;
			} else {
				const reg =
					/(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
				//const reg = /^https?:\/\/(?:\w+\.?)+(?:\/.*)*\/?$/i;
				if (!reg.test(options.url)) {
					console.warn('url字符串须为完整http链接');
					return result;
				}
				result = true;
			}
		}
		return result;
	}

	/**
	 * 对象转URL编码
	 * @param {object} data
	 */
	function objToURLCode(data) {
		var _result = [];
		for (var key in data) {
			var value = data[key];
			if (value instanceof Array) {
				value.forEach(function(_value) {
					_result.push(key + "=" + _value);
				});
			} else {
				_result.push(key + '=' + value);
			}
		}
		return _result.join('&');
	}

	/**
	 * 请求
	 * @param {string} method
	 * @param {object} options
	 */
	function request(method, options) {
		if (checkOptions(options)) {
			let xhr = new XMLHttpRequest();
			const {
				url: _url,
				queryStringsObj,
				data,
				dataType,
				payload,
				hasCookies,
				Proxy_Authorization,
				Proxy

			} = options, url = typeof queryStringsObj === 'object' ?
				_url + '?' + objToURLCode(queryStringsObj) : _url;
			switch (method) {
				case 'GET':
					xhr.open("GET", url);
					break;
				case 'POST':
					xhr.open("POST", url);
					xhr.setRequestHeader('Content-Type', dataType);
					// xhr.setRequestHeader('Proxy-Authorization', Proxy_Authorization);
					// xhr.setRequestHeader('X-Forwarded-For', Proxy);

					//xhr.setRequestHeader('Accept-Encoding', "Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30");
					break;
				default:
					break;
			}
			if (hasCookies) xhr.withCredentials = true;
			xhr.timeout = 3000;
			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					options.success(xhr.responseText)
				} else {
					console.error(`status:${xhr.status}`);
					options.success(`{"code":${xhr.status},"msg":"频繁访问"}`);
				}
			})
			xhr.addEventListener('error', () => {
				console.error('ajax请求出错')
				options.success('{"code":-1,"msg":"ajax请求出错"}');
			})
			xhr.addEventListener('timeout', () => {
				console.error('请求超时')
				options.success('{"code":-1,"msg":"请求超时"}');
			})
			switch (method) {
				case 'GET':
					xhr.send()
					break;
				case 'POST':
					xhr.send((/urlencoded/.test(dataType)) ? objToURLCode(data) : data)
					//xhr.send(payload);
					break;
				default:
					break;
			}
		}
	}

	return {
		/**
		 * 发送Get请求
		 * @param {Object} options
		 */
		get(options) {
			request("GET", options);
		},
		/**
		 * 发送Post请求
		 * @param {object} options
		 */
		post(options) {
			request("POST", options);
		}
	}
})()