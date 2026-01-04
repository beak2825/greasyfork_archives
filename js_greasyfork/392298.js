// ==UserScript==
// @name         kouyu100
// @namespace    http://weixin.kouyu100.com/
// @version      1.6
// @description  kouyu100成绩预览
// @author       pwxwabcd
// @icon         https://www.wandhi.com/favicon.ico
// @include      *://weixin.kouyu100.com/*
// @license      GPL License
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/392298/kouyu100.user.js
// @updateURL https://update.greasyfork.org/scripts/392298/kouyu100.meta.js
// ==/UserScript==
function getScore(row,data) {
	var readId = row.readId;
	var rscore = row.rscore;
	var rscore2 = row.read_score2;
	var readMaxScore2 = row.readMaxScore2;
	var readType = row.read_type;
	var maxOrAvg = data.maxOrAvg;
	var html = "";
	if(readId ==0){
		html = "--";
	}else
	if (rscore >= 85) {
		html += "<span  style='color:#7FCE81;'>" + rscore + "</span>";
	} else if (rscore >= 70 && rscore < 85) {
		html += "<span style='color:#fdb800;'>" + rscore + "</span>";
	} else if (rscore >= 60 && rscore < 70) {
		html += "<span style='color:#ff6000;'>"	+ rscore + "</span>";
	} else if (rscore >= 0) {
		html += "<span style='color:#c8c8c8;'>"	+ rscore + "</span>";
	} else if (rscore == -97 || rscore == -98) {
		if (rscore == -97) {
			html += "<span class='fail'>";
		} else if (rscore == -98) {
			html += "<span class='pass'>";
		}
		html +=((maxOrAvg!=0)?(readMaxScore2 > 0 ? readMaxScore2 : ""):(rscore2 > 0 ? rscore2 : "")) + "<span>(背)</span></span>";
	} else if (rscore == -99) {
		if (rscore2 < 70) {
			html += "<span class='fail'>"	+ rscore2 + "</span>";
		} else {
			html += "<span class='pass'>"	+ rscore2 + "</span>";
		}
		if (readType == 0) {
			html += "<span>(录)</span>";
		} else {
			if (readType == 1) {
				html += "<span>(领)</span>";
			} else {
				html += "<span>(录)</span>";
			}
		}
	}
	return html;
}

function loadData(){
    var pos = window.location.href.indexOf("?");
    var paramStr = window.location.href.substring(pos);
    console.log(paramStr);
	$.ajax({
		type: "GET",
		url: 'getShareCourseReadData.action' + paramStr,
		dataType:"json",
		success: function(data){
			teamBuying = data.teamBuying;
			domain = data.domainId;
			serverUrl = data.serverUrl;
			var lessonId = data.lessonId;

			var html = '';
			html += '<div>' + data.bookName + '</div>';
			html += '<div>' + data.className + '</div>';
			var datas = data.allResult;
			if(datas) {
				for(var i in datas) {
					var row = datas[i];
					html += '<div class="item">';
					html += '	<div>'+row.studentName+'</div>';
					html += '	<div>'+getScore(row,data)+'</div>';
					html += '	<div>'+getPlayInfo(row,lessonId)+'</div>';
					html += '</div>';
				}
			}

			$("#if").append(html);

			$(".canPlay").bind('click',function(){
				playMedia(this);
			});
		}
	});
}

setTimeout(function(){
  $("#if").empty()
  loadData();
}, 1000);