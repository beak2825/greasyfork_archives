// ==UserScript==
// @name           tieba_filter_someone
// @description    贴吧循环封
// @include        http://tieba.baidu.com/*
// @exclude        http://tieba.baidu.com/tb*
// @icon           http://imgsrc.baidu.com/forum/pic/item/6fd108fb43166d229cb84fac452309f79152d2e2.png
// @author         congxz6688
// @version        2015.7.19.0
// @grant          none
// @namespace https://greasyfork.org/scripts/156
// @downloadURL https://update.greasyfork.org/scripts/156/tieba_filter_someone.user.js
// @updateURL https://update.greasyfork.org/scripts/156/tieba_filter_someone.meta.js
// ==/UserScript==


//脚本的实际运行条件：
//1、只在你指定的贴吧执行；
//2、你的登录ID与脚本里指定的吧主ID一致，才会执行；
//3、日期与上次执行时不同，才会执行；（确保在黑名单没有改动的情况下，每天只执行一次）
//4、脚本中的黑名单与上一次执行的名单不一致时，再次执行。（方便你随时添加和更改）
//所以，脚本中的示例，即使不作修改也不会造成任何负担，因为你的登录ID与其不符，所以它不会执行。
//这样设计的目的，就是避免脚本在不符合条件的贴吧里执行，毕竟对任何人来说，在绝大多数的贴吧里我们都不是吧主。


//这里是修改区，请按相同格式修改或添加即可
someOne = {
	"雨滴在心头" : { //此为贴吧名
		"BaZhu_ID" : "坐怀则乱", //吧主ID
		"blackList" : ["jstester", "度娘的节操"] //黑名单 这里末尾不要标点
	}, //这里的逗号用于隔开两个吧的数据，很重要，如果要添加更多的吧，同样要用逗号隔开，不能漏掉
	"firefox" : { //此为贴吧名
		"BaZhu_ID" : "文科980195412", //吧主ID
		"blackList" : ["文科", "ABC"] //黑名单 这里末尾不要标点
	}
};




//*********!!!!以下部分，请不要修改!!!!*********


//今天的日期
var yuy = new Date();
var fulltime = yuy.toLocaleString().replace(/\s.*/, "");

//当前用户
var userData = unsafeWindow.PageData;
var userName = userData.user.name ? userData.user.name : userData.user.user_name;

//当前吧的Fid和Fname
var forum_id = unsafeWindow.PageData.forum.id;
var forum_name = unsafeWindow.PageData.forum.name;

//读取localStorage
var filterToday = JSON.parse((localStorage["filterToday"]) ? localStorage["filterToday"] : "{}");
if (!filterToday[forum_name]) {
	filterToday[forum_name] = {};
	filterToday[forum_name].blackList = [];
	filterToday[forum_name].BaZhu_ID = "";
}

//逐一屏蔽函数
function goFilterOneByOne(nn, lp) {
	var postData = encodeURI("day=1&fid=" + forum_id + "&tbs="+userData.tbs+"&ie=gbk&user_name[]=" + someOne[forum_name].blackList[nn] + "&reason=辱骂吧务，对吧务工作造成干扰，给予封禁处罚。");
	var urll = "http://tieba.baidu.com/pmc/blockid";
	setTimeout(function () {
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
					console.log(fulltime + " 封禁 " + someOne[forum_name].blackList[nn] + " " + reTextTxt.errmsg);
					if (nn == lp) {
						filterToday.date = fulltime;
						filterToday[forum_name].BaZhu_ID = userName;
						filterToday[forum_name].blackList = someOne[forum_name].blackList;
						localStorage["filterToday"] = JSON.stringify(filterToday);
						console.log(fulltime + " 坏蛋全部封禁完毕！");
					} else {
						ns = nn + 1;
						goFilterOneByOne(ns, lp); //自调用，顺序循环
					}
				}
			}
		}
	}, 1000);
}

if (someOne[forum_name] && someOne[forum_name].BaZhu_ID == userName && (filterToday.date != fulltime || filterToday[forum_name].blackList.toString() != someOne[forum_name].blackList.toString())) {
	goFilterOneByOne(0, someOne[forum_name].blackList.length - 1);
}
