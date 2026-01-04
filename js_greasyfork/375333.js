// ==UserScript==
// @name        time until JOI
// @description TwitterにJOI開始までの残り時間を表示します
// @version     1.0
// @author      euglenese
// @match       https://twitter.com/*
// @namespace https://greasyfork.org/users/201019
// @downloadURL https://update.greasyfork.org/scripts/375333/time%20until%20JOI.user.js
// @updateURL https://update.greasyfork.org/scripts/375333/time%20until%20JOI.meta.js
// ==/UserScript==

function len2(text){ // become 2 digits
	return ("00" + text).slice(-2)
}

var item = $("<li>");
var item_a = $("<a>");
item_a.attr("href", "https://joi2019-yo.contest.atcoder.jp/");
item_a.attr("target", "_blank");
item_a.css("font-size", "15px");
item.append(item_a);
var item_a_span = $("<span>");
item_a_span.addClass("text");
item_a.append(item_a_span);
$("#global-actions").append(item);
var text, date, hour, min, sec;
time_update();
setInterval(time_update, 100);

function time_update(){
	text = "";
	date = new Date();
	hour = date.getHours();
	min = date.getMinutes();
	sec = date.getSeconds();
	if( date.getFullYear() > 2018 ||
	   	date.getDate() > 9 ||
	   	hour >= 16){
		text = "終了しました";
	}else if(hour >= 13){
		text = "開催中です！";
	}else{
		text = "あと " + len2(12 - hour) + ":" + len2(59 - min) + ":" + len2(59 - sec);
	}
	item_a_span.html(text)
}