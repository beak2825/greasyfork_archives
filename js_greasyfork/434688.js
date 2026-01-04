// ==UserScript==
// @name         PTA反卷神器|查成分必备😊👏👏 打开排名后刷新一下页面!
// @namespace    zouhy2001@gmail.com
// @version      1.2
// @description  解析PTA的json ①在只有stuid的情况下 显示nickname, ②显示尝试解题次数 ③显示每题提交时间
// @author       zouhy2001
// @match        *://pintia.cn/problem-sets/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @requir       https://code.jquery.com/jquery-latest.js
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/434688/PTA%E5%8F%8D%E5%8D%B7%E7%A5%9E%E5%99%A8%7C%E6%9F%A5%E6%88%90%E5%88%86%E5%BF%85%E5%A4%87%F0%9F%98%8A%F0%9F%91%8F%F0%9F%91%8F%20%E6%89%93%E5%BC%80%E6%8E%92%E5%90%8D%E5%90%8E%E5%88%B7%E6%96%B0%E4%B8%80%E4%B8%8B%E9%A1%B5%E9%9D%A2%21.user.js
// @updateURL https://update.greasyfork.org/scripts/434688/PTA%E5%8F%8D%E5%8D%B7%E7%A5%9E%E5%99%A8%7C%E6%9F%A5%E6%88%90%E5%88%86%E5%BF%85%E5%A4%87%F0%9F%98%8A%F0%9F%91%8F%F0%9F%91%8F%20%E6%89%93%E5%BC%80%E6%8E%92%E5%90%8D%E5%90%8E%E5%88%B7%E6%96%B0%E4%B8%80%E4%B8%8B%E9%A1%B5%E9%9D%A2%21.meta.js
// ==/UserScript==
var url = window.location.href

var args = url.split('/')

var url_exam = "https://pintia.cn/api/problem-sets/" + args[4] + "/exams"
var url_rankings = "https://pintia.cn/api/problem-sets/" + args[4] + '/' + args[5]

setTimeout(task, 700) //等待页面加载完成的毫秒数,不建议小于500
function task() {

	if (url_rankings.indexOf("page") != -1) {
		url_rankings = url_rankings + "&limit=50"
	} else {
		url_rankings = url_rankings + "?limit=50"
	}

	console.log(url_exam);
	console.log(url_rankings)

	showpage(); //不想见到提示悬浮窗可以注释掉
	if (url_rankings.indexOf("rankings") != -1) {
		var startTime = getStarttime();
		var rankingInfo = getRankings();
		console.log(startTime);
		console.log(rankingInfo);
		setInfo(startTime, rankingInfo);
	}

}
function showpage() {
	$("body").append(" <div style='left: 10px;bottom: 50%;background: #1C80F2;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 232px;height: 32px; \
                                     border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>打开每一页排名都记得要刷新 ! ! !</div>");
}
//显示 学号昵称 和提交次数
function setInfo(starttime, data) {
	console.log(data);

	var table = document.getElementsByClassName("DataTable_1vh8W")[0];
	console.log(table);

	var problemlist = data["commonRankings"]["labels"];

	for (var i = 2; i <= table.rows.length - 1; i++) {
		var nickname = data["commonRankings"]["commonRankings"][i - 2]["user"]["user"]["nickname"]
		var stuid = data["commonRankings"]["commonRankings"][i - 2]["user"]["studentUser"]["studentNumber"]
		//学号 昵称
		if (stuid == "") {
			table.rows[i].cells[1].innerText = nickname;
		} else {
			table.rows[i].cells[1].innerText = stuid + "-" + nickname;
		}

		//最近提交时间
		var lastesttime = data["commonRankings"]["commonRankings"][i - 2]["solvingTime"];

		table.rows[i].cells[1].innerText = table.rows[i].cells[1].innerText + '\n' + LastestACTime(starttime, lastesttime);

		//每题的提交次数
		for (var j = 0; j < problemlist.length; j++) {
			if (table.rows[i].cells[3 + j].innerText != "-") {
				var acTime = data["commonRankings"]["commonRankings"][i - 2]["problemScores"][problemlist[j]]["acceptTime"]

				table.rows[i].cells[3 + j].innerText = table.rows[i].cells[3 + j].innerText + "分 提交" + data["commonRankings"]["commonRankings"][i - 2]["problemScores"][problemlist[j]]["submitCountSnapshot"] + "次" + '\n' + LastestACTime(starttime, acTime);
			}
		}
	}
}

//获取开始时间
function getStarttime() {
	var res;
	$.ajax({
		url: url_exam,
		type: 'get',
		async: false,
		dateType: 'json',
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
			"accept-language": "zh-CN",
			"accept": "application/json;charset=UTF-8"
		},
		success: function(data) {
			console.log("getStarttime sucess");
			res = data
		},
		error: function(data) {
			console.log("getStarttime error");
		}
	});
	return res["problemSet"]["startAt"];
}

//获取排名信息
function getRankings() {
	var res;
	$.ajax({
		url: url_rankings,
		type: 'get',
		async: false,
		dateType: 'json',
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
			"accept-language": "zh-CN",
			"accept": "application/json;charset=UTF-8"
		},
		success: function(data) {
			console.log("getRankings sucess");
			res = data
		},
		error: function(data) {
			console.log("getRankings error");
		}
	});
	return res;
}

function LastestACTime(startTime, minutes) {
	minutes = parseInt(minutes);
	var interTimes = minutes * 60 * 1000;
	interTimes = parseInt(interTimes);
	var newdata = new Date(Date.parse(startTime) + interTimes);
	return strTime(newdata)
}

function formatDateToString(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	return year + '/' + month + '/' + day;
}

function strTime(date) {
	var hours = date.getHours();
	var mins = date.getMinutes();
	var secs = date.getSeconds();
	var msecs = date.getMilliseconds();
	if (hours < 10) hours = "0" + hours;
	if (mins < 10) mins = "0" + mins;
	if (secs < 10) secs = "0" + secs;
	if (msecs < 10) secs = "0" + msecs;
	return formatDateToString(date) + ' ' + hours + ':' + mins
}