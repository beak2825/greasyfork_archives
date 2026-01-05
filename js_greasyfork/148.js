// ==UserScript==
// @name           tieba_hide_someone
// @description    屏蔽某些人的帖子
// @include        http://tieba.baidu.com/*
// @exclude        http://tieba.baidu.com/tb*
// @exclude        http://tieba.baidu.com/mo/*
// @icon           http://imgsrc.baidu.com/forum/pic/item/6fd108fb43166d229cb84fac452309f79152d2e2.png
// @author         congxz6688
// @version        2014.8.14.2
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @namespace https://greasyfork.org/scripts/148
// @downloadURL https://update.greasyfork.org/scripts/148/tieba_hide_someone.user.js
// @updateURL https://update.greasyfork.org/scripts/148/tieba_hide_someone.meta.js
// ==/UserScript==


//脚本双存储相互恢复
if (!localStorage.tiebaHideBlackList && GM_getValue("tiebaHideBlackList", "") != "") {
	localStorage.tiebaHideBlackList = GM_getValue("tiebaHideBlackList");
}
if (GM_getValue("tiebaHideBlackList", "") == "" && localStorage.tiebaHideBlackList) {
	GM_setValue("tiebaHideBlackList", localStorage.tiebaHideBlackList);
}
if (!localStorage.whiteUserIds && GM_getValue("whiteUserIds", "") != "") {
	localStorage.whiteUserIds = GM_getValue("whiteUserIds");
}
if (GM_getValue("whiteUserIds", "") == "" && localStorage.whiteUserIds) {
	GM_setValue("whiteUserIds", localStorage.whiteUserIds);
}

//从存储的数据中提取黑白名单
var getBlackList = GM_getValue("tiebaHideBlackList", "") != "" ? GM_getValue("tiebaHideBlackList").split(",") : [];
var whiteUsIds = GM_getValue("whiteUserIds", "") != "" ? GM_getValue("whiteUserIds").split(",") : [];

//今天的日期
var yuy = new Date();
var fulltime = yuy.toLocaleDateString();
var $ = unsafeWindow.$;

//当前日期、用户、已屏蔽之数据
var userData = unsafeWindow.PageData;
var userName = userData.user.name ? userData.user.name : userData.user.user_name;
var HideToday = JSON.parse((localStorage["HideToday"]) ? localStorage["HideToday"] : "{}");
HideToday[userName] = HideToday[userName] ? HideToday[userName] : [];

function addStyle(css) {
	document.head.appendChild(document.createElement("style")).textContent = css;
}

function addNodeInsertedListener(elCssPath, handler, executeOnce, noStyle) {
	var animName = "anilanim",
	prefixList = ["-o-", "-ms-", "-khtml-", "-moz-", "-webkit-", ""],
	eventTypeList = ["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"],
	forEach = function (array, func) {
		for (var i = 0, l = array.length; i < l; i++) {
			func(array[i]);
		}
	};
	if (!noStyle) {
		var css = elCssPath + "{",
		css2 = "";
		forEach(prefixList, function (prefix) {
			css += prefix + "animation-duration:.001s;" + prefix + "animation-name:" + animName + ";";
			css2 += "@" + prefix + "keyframes " + animName + "{from{opacity:.9;}to{opacity:1;}}";
		});
		css += "}" + css2;
		addStyle(css);
	}
	if (handler) {
		var bindedFunc = function (e) {
			var els = document.querySelectorAll(elCssPath),
			tar = e.target,
			match = false;
			if (els.length !== 0) {
				forEach(els, function (el) {
					if (tar === el) {
						if (executeOnce) {
							removeNodeInsertedListener(bindedFunc);
						}
						handler.call(tar, e);
						return;
					}
				});
			}
		};
		forEach(eventTypeList, function (eventType) {
			document.addEventListener(eventType, bindedFunc, false);
		});
		return bindedFunc;
	}
}
//移除精确监听
function removeNodeInsertedListener(bindedFunc) {
	var eventTypeList = ["animationstart", "webkitAnimationStart", "MSAnimationStart", "oAnimationStart"],
	forEach = function (array, func) {
		for (var i = 0, l = array.length; i < l; i++) {
			func(array[i]);
		}
	};
	forEach(eventTypeList, function (eventType) {
		document.removeEventListener(eventType, bindedFunc, false);
	});
}
//逐一屏蔽函数
function goHideOneByOne(nn, lp) {
	if (whiteUsIds.indexOf(userName) == -1) {
		if (HideToday.date != fulltime) {
			HideToday = {};
			HideToday.date = fulltime;
			HideToday[userName] = [];
		}
		getHiddenList = (HideToday[userName]) ? HideToday[userName] : [];
		if (getHiddenList.indexOf(getBlackList[nn]) == -1) {
			var postData = encodeURI("type=1&hide_un=" + getBlackList[nn] + "&ie=utf-8");
			var urll = "http://tieba.baidu.com/tphide/add";
			onebyone = new XMLHttpRequest();
			onebyone.open("POST", urll, true);
			onebyone.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			onebyone.setRequestHeader("Content-length", postData.length);
			onebyone.setRequestHeader("Connection", "close");
			onebyone.send(postData);
			onebyone.onreadystatechange = function () {
				if (onebyone.readyState == 4) {
					if (onebyone.status == 200) {
						var reTextTxt = JSON.parse(onebyone.responseText);
						console.log(fulltime + " 屏蔽 " + getBlackList[nn] + " " + reTextTxt.msg);
						ssw = HideToday[userName].push(getBlackList[nn]);
						if (nn == lp) {
							HideToday[userName] = getBlackList;
							localStorage["HideToday"] = JSON.stringify(HideToday);
							console.log(fulltime + " 眼中钉全部屏蔽完毕！");
						} else {
							localStorage["HideToday"] = JSON.stringify(HideToday);
							ns = nn + 1;
							setTimeout(function () {
								goHideOneByOne(ns, lp); //自调用，顺序循环
							}, 1000);
						}
					}
				}
			}
		} else {
			console.log(getBlackList[nn] + " 今天已经屏蔽过了。");
			if (nn == lp) {
				HideToday[userName] = getBlackList;
				localStorage["HideToday"] = JSON.stringify(HideToday);
				console.log(fulltime + " 眼中钉全部屏蔽完毕！");
			} else {
				ns = nn + 1;
				goHideOneByOne(ns, lp); //自调用，顺序循环
			}
		}
	}
}
//以用户脚本命令输入黑名单
function hideSomeOneBlackSet() {
	if (getBlackList.toString() == "") {
		mess = "请输入屏蔽黑名单，以小写的逗号相互隔开，可带小写空格，或者是小写的引号：";
		caseShow = "坏人甲,坏人乙";
	} else {
		mess = "请修改屏蔽黑名单，以小写的逗号相互隔开，可带小写空格，或者是小写的引号：";
		caseShow = getBlackList.toString();
	}
	var getSetData = prompt(mess, caseShow);
	getBlackList = (getSetData == "坏人甲,坏人乙" || getSetData == "") ? [] : getSetData.replace(/，/g, ",").replace(/\s/g, "").replace(/["']/g, "").split(",");
	localStorage.tiebaHideBlackList = getBlackList.toString();
	GM_setValue("tiebaHideBlackList", getBlackList.toString());
	goHideOneByOne(0, getBlackList.length - 1);
}
//以用户脚本命令输入马甲白名单
function hideSomeOneWhiteSet() {
	if (whiteUsIds.toString() == "") {
		mess = "请输入不执行本脚本的小号名单，以小写逗号相分隔，可带小写空格或小写引号，比如\r\n文科980195412是我的一个小号，当我用她登录时，不执行屏蔽：";
		caseShow = "文科980195412,xyz";
	} else {
		mess = "请修改不执行脚本的小号名单，以小写逗号相分隔，可带小写空格或小写引号：";
		caseShow = whiteUsIds.toString();
	}
	var getSetData = prompt(mess, caseShow);
	whiteUsIds = (getSetData == "文科980195412,xyz" || getSetData == "") ? [] : getSetData.replace(/，/g, ",").replace(/\s/g, "").replace(/["']/g, "").split(",");
	localStorage.whiteUserIds = whiteUsIds.toString();
	GM_setValue("whiteUserIds", whiteUsIds.toString());
}
GM_registerMenuCommand("tieba_Hide_SomeOne黑名单设置", hideSomeOneBlackSet);
GM_registerMenuCommand("tieba_Hide_SomeOne白名单设置", hideSomeOneWhiteSet);

//判断条件 执行屏蔽动作

if (whiteUsIds.indexOf(userName) == -1 && (HideToday.date != fulltime || HideToday[userName].toString() != getBlackList.toString())) {
	goHideOneByOne(0, getBlackList.length - 1);
}

if (whiteUsIds.indexOf(userName) == -1) {
	addNodeInsertedListener(".j_thread_list", function () { //帖子列表
		var Lhtml = $(this).find(".tb_icon_author").attr("title").match(/.*[:：]\s?(.*)/)[1];
		if (getBlackList.indexOf(Lhtml) != -1) {
			$(this).remove();
		}
	});
	addNodeInsertedListener(".lzl_single_post", function () { //楼中楼
		var iUserIdhtml = $(this).find(".j_user_card").attr("username");
		if (getBlackList.indexOf(iUserIdhtml) != -1) {
			$(this).remove();
		}
	});
	addNodeInsertedListener(".j_feed_replyme", function () { //回复我的
		var iUserIdhtml = $(this).find(".replyme_user").text().replace("：", "");
		if (getBlackList.indexOf(iUserIdhtml) != -1) {
			$(this).remove();
		}
	});
}
