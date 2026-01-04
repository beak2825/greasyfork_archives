// ==UserScript==
// @icon  https://www.kuaishou.com/favicon.ico
// @name  快手弹幕语音助手
// @namespace  [url=mailto:1031993596@qq.com]1031993596@qq.com[/url]
// @author 文超
// @description  获取快手弹幕转语音 朗读弹幕
// @match  https://live.kuaishou.com/u/*
// @version  2.1.4
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378566/%E5%BF%AB%E6%89%8B%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/378566/%E5%BF%AB%E6%89%8B%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
	'use strict';
	setInterval(DelayGet, 50); //定时器 1s 10次=1000ms/100
	//document.documentElement.webkitRequestFullscreen(); //chrome 全屏
	var LastLiNum = 0;

	//删除无用元素 延时点击流程
	setTimeout(del_elm, 3000);
	//自动点亮红心
	//setInterval(lightHearts, 1000);
	//弹幕转语音
	function DelayGet() {
		//console.log("======================================");
		var chatUI = document.getElementsByClassName("chat-info");

		for (var i = LastLiNum; i < chatUI.length; i++) {
			LastLiNum = chatUI.length;

			var elmName = chatUI[i].getElementsByClassName("username");

			var chatHtml = chatUI[i].innerHTML;
			var giftNum = chatUI[i].getElementsByClassName("comment")[1];
			var nameTxt = elmName[0].innerText;
			var tmp_Data = chatUI[i].innerText;
			var tmp_Text = tmp_Data.replace(nameTxt, "");
			nameTxt = nameMake(nameTxt); //用户名处理
			var readTxt = '';
			if (tmp_Text.search("点亮了") != -1) { //*********点亮红心
				readTxt = '感谢 ' + nameTxt + '点亮小红心';
			} else if (tmp_Text.search("送") != -1) { //*********送礼物
				if (chatHtml.search(fans[0]) != -1) { //加入粉丝团
					readTxt = '感谢 ' + nameTxt + fans[1];
				} else { //礼物
					var giftNumTxt = "";
					if (giftNum) {
						giftNumTxt = ChinaCost(giftNum.innerText.replace("×", ""));
					}

					var knowGift = false;
					for (var j = 0; j < giftLink.length; j++) {
						if (chatHtml.search(giftLink[j]) != -1) { //已知礼物
							readTxt = '感谢 ' + nameTxt + '送的' + giftNumTxt + giftName[j];
							knowGift = true;
							break;
						}
					}
					if (!knowGift) { //未知礼物
						readTxt = '感谢 ' + nameTxt + giftNumTxt + '送的礼物';
					}
				}
			} else if (tmp_Text === '一') {
				readTxt = nameTxt + '扣一';
			} else {
				tmp_Text = txt_make(tmp_Text); //弹幕内容处理
				readTxt = nameTxt + '说:' + tmp_Text;
			}
			if (nameTxt.search("快手官方") != -1) {
				readTxt = "";
			}

			console.log(readTxt); //输出控制台
			console.log("============================");
			TTSread(readTxt); //文字转TTS语音
		}

	}; //弹幕转语音
	//功能函数
	function del_elm() { //删除无用元素
		//移除元素
		document.querySelector("#app > div.live-detail > div.sidebar").remove(); //左边栏
		document.querySelector("#app > div.live-detail > div.live-detail-container > div.more-recommend-live").remove(); //直播推荐
		document.querySelector("#app > div.live-detail > div.live-detail-container > div.work-list").remove(); //主播作品
		//document.querySelector("#app > div.live-detail > div.header-placeholder").remove();	//顶边栏
		document.querySelector("#app > div.live-detail > div.header-placeholder > header > div > div.left-part > ul").remove(); //顶栏>导航
		document.querySelector("#app > div.live-detail > div.header-placeholder > header > div > div.right-part > div.search-input.search.pl-input-container.readonly.placeholder-center").remove(); //顶栏>搜索框
		document.querySelector("#app > div.live-detail > div.header-placeholder > header > div > div.right-part > span.follow-item").remove(); //顶栏>关注
		document.querySelector("#app > div.live-detail > div.header-placeholder > header > div > div.right-part > span.history-item").remove(); //顶栏>观看历史
		document.getElementsByClassName('live-detail-player')[0].remove(); //视频框
		//修改样式-聊天室宽度
		var Fstyle = document.createElement('style');
		var Fcss = '';
		Fcss += '.liveroom-sidebar[data-v-267931b0]{top:80px;width:100%}'; //聊天框
		Fcss += '.profile[data-v-4e9b4918]{width:80px;height:80px}'; //在线观众 头像
		Fcss += '.billboard h3[data-v-4e9b4918]{font-size:36px}'; //'在线观众'字体
		Fcss += '.chat h3[data-v-267931b0]{font-size:36px}'; //'聊天室' 字体
		Fcss += '.username[data-v-1adf6c6d]{font-size:42px}'; //用户名 字体
		Fcss += '.comment[data-v-1adf6c6d]{font-size:42px}'; //聊天内容 字体
		Fcss += '.chat-info[data-v-67866bb7]{line-height:36px}'; //聊天 行距
		Fcss += '.emoji[data-v-9631c5fc]{width:42px}'; //聊天内容 红心大小
		Fcss += '.gift-comment .gift-img[data-v-1adf6c6d]{width:42px;height:42px}'; //礼物大小
		Fcss += '.textarea[data-v-7e0b9386]{font-size:42px;max-height:200px;line-height:50px;width:80%}'; //聊天输入框
		Fcss += '.filter-gift-show[data-v-2d9bf7e0],.filter-gift[data-v-2d9bf7e0],.filter-thumbup[data-v-2d9bf7e0]{height:50px;line-height:50px}'; //聊天室 设置面板 行距
		Fcss += '.filter-gift span[data-v-2d9bf7e0],.filter-gift-show span[data-v-2d9bf7e0],.filter-thumbup span[data-v-2d9bf7e0]{font-size:42px}'; //聊天室 设置面板 字体
		Fcss += '.chat-setting-panel[data-v-2d9bf7e0]{width:500px}'; //聊天室 设置面板 宽度
		Fcss += '.submit-button[data-v-7e0b9386]{font-size:42px;line-height:42px;width:20%}'; //聊天室 发送按钮
		Fcss += '.header-main[data-v-48567108] .user-info-name-display{font-size:42px;display:inline}'; //顶栏 用户名
		Fcss += '.user-info-profile[data-v-4064f1ec]{width:64px;height:64px;border-radius:50%;vertical-align:middle;margin:10px}'; //顶栏 用户头像
		Fcss += '.header-adapt[data-v-48567108] .header-main .right-part{margin-right:30% !important}'; //顶栏 右栏
		Fcss += '.user-info img[data-v-521ea27d]{margin-right:50px;width:200px;height:200px;border-radius:12%}'; //用户信息 头像
		Fcss += '.user-info-intro[data-v-521ea27d]{width:300px;font-size:25px}'; //用户信息 用户名字体
		Fcss += '.user-detail-name[data-v-521ea27d]{font-size:42px;line-height:42px}'; //用户信息 关注数字体
		Fcss += '.user-card-tooltip[data-v-521ea27d]{width:600px}'; //用户信息 宽度
		Fcss += '.otherdetail-cc[data-v-521ea27d]{font-size:24px}'; //用户信息 地域
		Fcss += '.otherdetail-desc[data-v-521ea27d]{font-size:24px}'; //用户信息 签名
		Fcss += '';
		Fcss += '';
		Fstyle.innerHTML = Fcss;
		console.log(Fstyle);
		document.body.appendChild(Fstyle);

		document.querySelector("#app > div.live-detail > div.liveroom-sidebar.light > div.chat > div.chat-actions > div.chat-input > div > textarea").style.height = '50px';

	}; //删除无用元素
	function txt_make(txt) { //弹幕内容处理
		txt = txt.replace(/1/g, '一');
		txt = txt.replace(/2/g, '二');
		txt = txt.replace(/3/g, '三');
		txt = txt.replace(/4/g, '四');
		txt = txt.replace(/5/g, '五');
		txt = txt.replace(/6/g, '六');
		txt = txt.replace(/7/g, '七');
		txt = txt.replace(/8/g, '八');
		txt = txt.replace(/9/g, '九');

		txt = txt.replace(/(😂|🤣)+/g, '哭笑哭笑');
		txt = txt.replace(/(😀|😃|😄|😁|😆|😊|😇|🙂|😉)+/g, '哈哈');
		txt = txt.replace(/(😘|😗|😙)+/g, '么么哒');

		return txt;
	}; //弹幕内容处理
	function nameMake(txt) { //用户名处理 去掉名字中特殊符号
		txt = txt.replace(/[0-9]/g, '');
		txt = txt.replace(/[😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛]/g, '');
		txt = txt.replace(/[△▽○◇□☆▷◁♤♡♢♧▲▼●◆■★▶◀♠♥♦♣☼☽♀☺◐☑√✔☜☝☞㏂☀☾♂☹◑☒×✘☚☟☛㏘▪•‥…▁▂▃▄▅▆▇█∷※░▒▓▏▎▍▌▋▊▉]/g, '');
		txt = txt.replace(/[♩♪♫♬§〼◎¤۞℗®©♭♯♮‖¶卍卐▬〓℡™㏇☌☍☋☊㉿◮◪◔◕@㈱№♈♉♊♋♌♎♏♐♑♓♒♍]/g, '');
		txt = txt.replace(/[↖↑↗▨▤▧◤㊤◥☴☲☷←㊣→▩▦▥㊧㊥㊨☳☯☱↙↓↘▫◈▣◣㊦◢☶☵☰↕↔⊱⋛⋌⋚⊰¬￢▔†‡]/g, '');
		txt = txt.replace(/[*＊✲❈❉✿❀❃❁☸✖✚✪❤ღ❦❧ி₪✎✍✌✁✄☁☂☃☄♨☇☈☡➷⊹✉☏]/g, '');
		txt = txt.replace(/[@$&☢✈♟♙〠☣☠۩♜♖✙☭☄♨❂✟♞♘☤☪☮☥♝♗☦〄➹☧♛♕☨☩ஐ☫♚♔☬☎]/g, '');
		txt = txt.replace(/丨/g, '');
		txt = txt.replace(/：/g, '');
		txt = txt.replace(/ /g, '');
		txt = txt.replace(/，/g, '');

		return txt;
	}; //用户名处理
	function TTSread(txt) { //文字转TTS语音
		var tts = new SpeechSynthesisUtterance(txt);
		tts.rate = 1.2;
		window.speechSynthesis.speak(tts);
	}; //文字转TTS语音
	function ChinaCost(numberValue) { //数字转中文
		var numberValue = new String(Math.round(numberValue * 100)); // 数字金额
		var chineseValue = ""; // 转换后的汉字金额
		var String1 = "零壹贰叁肆伍六柒捌玖"; // 汉字数字
		var String2 = "万仟佰拾亿仟佰拾万仟佰拾个  "; // 对应单位
		var len = numberValue.length; // numberValue 的字符串长度
		var Ch1; // 数字的汉语读法
		var Ch2; // 数字位的汉字读法
		var nZero = 0; // 用来计算连续的零值的个数
		var String3; // 指定位置的数值
		if (len > 15) {
			//alert("超出计算范围");
			return "";
		}
		/*
		if (numberValue == 0) {
			chineseValue = "零元整";
			return chineseValue;
		}
	*/
		String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
		for (var i = 0; i < len; i++) {
			String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
			if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
				if (String3 == 0) {
					Ch1 = "";
					Ch2 = "";
					nZero = nZero + 1;
				} else if (String3 != 0 && nZero != 0) {
					Ch1 = "零" + String1.substr(String3, 1);
					Ch2 = String2.substr(i, 1);
					nZero = 0;
				} else {
					Ch1 = String1.substr(String3, 1);
					Ch2 = String2.substr(i, 1);
					nZero = 0;
				}
			} else { // 该位是万亿，亿，万，元位等关键位
				if (String3 != 0 && nZero != 0) {
					Ch1 = "零" + String1.substr(String3, 1);
					Ch2 = String2.substr(i, 1);
					nZero = 0;
				} else if (String3 != 0 && nZero == 0) {
					Ch1 = String1.substr(String3, 1);
					Ch2 = String2.substr(i, 1);
					nZero = 0;
				} else if (String3 == 0 && nZero >= 3) {
					Ch1 = "";
					Ch2 = "";
					nZero = nZero + 1;
				} else {
					Ch1 = "";
					Ch2 = String2.substr(i, 1);
					nZero = nZero + 1;
				}
				if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
					Ch2 = String2.substr(i, 1);
				}
			}
			chineseValue = chineseValue + Ch1 + Ch2;
		}
		/*
		if (String3 == 0) { // 最后一位（分）为0时，加上“整”
			chineseValue = chineseValue + "整";
		}
	*/
		if (chineseValue.substr(0, 2) == "壹拾") { // 如果 以"壹拾"开头 去掉"壹"
			chineseValue = chineseValue.substr(1);
		}

		return chineseValue;
	}; //数字转汉字
	function lightHearts() { //点亮小红心
		document.getElementsByClassName('like-btn')[0].click();
	}; //点亮小红心
	//变量
	var giftLink = new Array("2019/12/31/14/BMjAxOTEyMzExNDExMDNfMF9nNjNfbHY", "2019/12/31/14/BMjAxOTEyMzExNDA5MjVfMF9nMTU4X2x2", "2019/01/11/15/BMjAxOTAxMTExNTAxMzRfMF9nMTQ3X2x2", "2018/12/27/17/BMjAxODEyMjcxNzU5MDNfMF9nMTUwX2x2", "2018/12/27/17/BMjAxODEyMjcxNzU5MDRfMF9nMTQ5X2x2", "2019/01/11/14/BMjAxOTAxMTExNDI4MzhfMF9nMTQ1X2x2", "2019/01/09/15/BMjAxOTAxMDkxNTA5MTdfMF9nN19sdg==", "2019/01/03/15/BMjAxOTAxMDMxNTU4NTdfMF9nOV9sdg==", "2019/10/31/15/BMjAxOTEwMzExNTA0MTNfMF9nMjM1X2x2", "2019/10/24/11/BMjAxOTEwMjQxMTI0MDFfMF9nMjI2X2x2", "2019/08/22/15/BMjAxOTA4MjIxNTM4NDdfMF9nMl9sdg==", "2019/10/16/10/BMjAxOTEwMTYxMDE2NTJfMF9nMjE3X2x2", "2019/01/11/15/BMjAxOTAxMTExNTAyMzdfMF9nMTE0X2x2", "2019/01/23/15/BMjAxOTAxMjMxNTE5NDRfMF9nMTY4X2x2", "2019/01/16/17/BMjAxOTAxMTYxNzIxMjlfMF9nMTZfbHY=", "2018/01/05/15/BMjAxODAxMDUxNTE1MzdfMF9nMzNfbHY=", "2018/07/27/14/BMjAxODA3MjcxNDE3NTRfMF9nMTQ2X2x2", "2017/09/29/09/BMjAxNzA5MjkwOTUwNDNfMF9nMjVfbHY=", "2018/04/18/14/BMjAxODA0MTgxNDU0MDJfMF9nMTEzX2x2", "2019/09/05/14/BMjAxOTA5MDUxNDUxNDhfMF9nNDFfbHY=", "2018/03/22/14/BMjAxODAzMjIxNDA2NTlfMF9nOTRfbHY=", "2019/04/11/11/BMjAxOTA0MTExMTU4NDVfMF9nMTY0X2x2", "2019/11/19/10/BMjAxOTExMTkxMDE0NThfMF9nMjQ5X2x2", "2019/11/12/10/BMjAxOTExMTIxMDAxMDBfMF9nMjQxX2x2", "2019/11/01/14/BMjAxOTExMDExNDQwMjVfMF9nMTBfbHY=", "2019/11/19/10/BMjAxOTExMTkxMDE2MjVfMF9nMjQ4X2x2", "2019/11/19/10/BMjAxOTExMTkxMDE1NDdfMF9nMjQ3X2x2", "2019/01/23/15/BMjAxOTAxMjMxNTExMjZfMF9nMTY1X2x2", "2019/11/19/10/BMjAxOTExMTkxMDE2MDVfMF9nMjQ2X2x2");
	var giftName = new Array("发财", "鼠钱啦", "赞", "carry全场", "血瓶", "西瓜", "么么哒", "啤酒", "爆单", "金话筒", "棒棒糖", "辛苦了", "玫瑰花", "爱的信号", "皇冠", "烟花", "怦然心动", "凤冠", "火箭", "跑车", "穿云箭", "猫粮", "巧克力", "四叶草", "甜甜圈", "铃铛", "福袋", "爱心", "金莲");
	var fans = new Array("2019/11/06/10/BMjAxOTExMDYxMDQ4MzFfMF9nMjM2X2x2", "加入粉丝团!直播间因为有你而精彩");

})();

/*
		//刷新网页
		if (LastLiNum > 200) {
			window.location.reload(true);
		}
*/
