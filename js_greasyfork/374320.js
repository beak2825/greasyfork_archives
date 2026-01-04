// ==UserScript==
// @name         cytube_remain
// @namespace    https://cytube.xyz/
// @version      1.13
// @description  いつ再生されるか大体予測できる
// @author       toniste
// @match        https://cytube.xyz/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374320/cytube_remain.user.js
// @updateURL https://update.greasyfork.org/scripts/374320/cytube_remain.meta.js
// ==/UserScript==

function toHms(t) {
	var hms = "";
	var h = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;
	if (h != 0) {
		hms = h + "時間" + padZero(m) + "分" + padZero(s) + "秒";
	} else if (m != 0) {
		hms = m + "分" + padZero(s) + "秒";
	} else {
		hms = s + "秒";
	}
	return hms;
	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}
$("#queue").on("click", ".qe_time", function(){
    let remainingTimeSum = 0;
    $(this).parent().prevAll().each(function(){
        let songLength = $(this).find(".qe_time").text().split(":");
        if(parseInt(songLength[0]) >= 5){
            remainingTimeSum = remainingTimeSum + 300;
        } else {
            remainingTimeSum = remainingTimeSum + parseInt(songLength[0]) * 60 + parseInt(songLength[1]);
        }
    });
    let now = new Date();
    let unixTime = now.getTime();
    let objectTime = unixTime + remainingTimeSum * 1000;
    let objectDate = new Date(objectTime);
    alert(toHms(remainingTimeSum) + "後、" + objectDate.toLocaleString() + "くらい");
});