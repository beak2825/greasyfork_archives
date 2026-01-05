// ==UserScript==
// @name         Zhihu Answer Sort
// @namespace    http://hi-rain.com/
// @version      0.1
// @description  按照赞同数，从大到小排列答案
// @author       Mr.pc
// @match        http://www.zhihu.com/question/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11566/Zhihu%20Answer%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/11566/Zhihu%20Answer%20Sort.meta.js
// ==/UserScript==

var answerlist = $('.zm-item-answer');
var answerlist1 = [];
var i = answerlist.length;

function str2num (num_str) {
	if (num_str.match(/\d*K/)) {
		num_str = num_str.replace('K','000');
	}
	return parseInt(num_str);
}

while(i>0) {
	var num = 0;
	var maxnum = 0;
	var maxans;
	for (var j = 0; j < i; j++) {
		var c_num = str2num(answerlist[j].getElementsByClassName('count')[0].innerText);
		if (c_num > maxnum) {
			maxnum = c_num;
			num = j;
			maxans = answerlist[j];
		}
	}

	answerlist1.push(maxans);
    console.log(num)
	answerlist.splice(num, 1);
	console.log(answerlist[num])

	i--;
}

answerlist1 = answerlist1.reverse();
$(".zm-item-answer").remove();


for (var i = 0; i < answerlist1.length; i++) {
	$('#zh-question-answer-wrap').prepend(answerlist1[i])
}