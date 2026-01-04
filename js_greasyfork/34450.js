// ==UserScript==
// @name         扇贝单词拼写检查
// @namespace    liyutze.seikiri@gmail.com
// @version      1.0.1
// @description  Quick Review Words by Respelling
// @author       Li Yutze
// @include      https://www.shanbay.com/bdc/review/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34450/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E6%8B%BC%E5%86%99%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/34450/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E6%8B%BC%E5%86%99%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

list_of_test = [];
enter_cont = 1;

$("body").prepend([
	'<div id="re-test" class="well" ',
	'style="position:fixed; right:15px; top:65px; width:220px; z-index:2000; background-color:#eee">',
		'<div id="test-listed"></div>',
		'<div style="position:relative">',
			'<input id="test-a" type="text" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="off">',
			'<span id="test-tell-c" style="position:absolute; top:5px; right:7px; color:#209e85; display:none">&#x2714;</span>',
			'<span id="test-tell-r" style="position:absolute; top:5px; right:7px; color:#d2672e; display:none">&#x2718;</span>',
			'<small id="test-tell-o" style="position:absolute; top:5px; right:7px;display:none">成功添加</small>',
			'<small id="test-tell-p" style="position:absolute; top:5px; right:7px;display:none">无法在页面上定位单词</small>',
		'</div>',
		'<div class="btn-group">',
			'<button id="test-check" class="btn">检查</button>',
			'<button id="test-hint" class="btn">提示</button>',
			'<button id="test-top" class="btn">置顶</button>',
			'<button id="test-next" class="btn" style="padding-left:8.5px;padding-right:8.5px;">下一个</button>',
		'</div>',
		'<br/><br/>',
		'<input id="test-h" type="text" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="off" placeholder="补充提示">',
		'<div class="btn-group">',
			'<button id="test-add" class="btn">添加</button>',
			'<button id="search-wi" class="btn" style="padding-left:9.5px;padding-right:9.5px;">WordInfo</button>',
			'<button id="search-et" class="btn" style="padding-left:9.5px;padding-right:9.5px;">Etymonline</button>',
		'</div>',
		'<br/><br/>',
		'<div style="position:relative">',
			'<input type="number" value=3 id="test-list-b" style="display:inline-block;width:93px">',
			'<input type="number" value=4 id="test-list-r" style="display:inline-block;width:93px">',
			'<small style="position:absolute; top:5px; right:140px">词后着重</small>',
			'<small style="position:absolute; top:5px; right:29px">词后提示</small>',
		'</div>',
	'</div>'].join(""));

function updateWordList() {
	len = list_of_test.length;
	blk = len - $("#test-list-b").val();
	red = blk - $("#test-list-r").val();
	$("#test-listed").children().remove();
	for (i = 0; i < list_of_test.length; i++) {
		col = "#999";
		if (i < red) {
			col = "#d50";
		} else if (i < blk) {
			col = "#000";
		}
		$("#test-listed").prepend('<p style="overflow:hidden;color:' + col + '">' + list_of_test[i][1] + "</p>");
	}
}
function tellAnswer(what) {
	if (what == "correct") {
		$("#test-tell-c").show();
		$("#test-tell-c").fadeOut("slow");
	} else {
		$("#test-tell-r").show();
		$("#test-tell-r").fadeOut("slow");
	}
}
function tellAdd(what) {
	if (what == "ok") {
		$("#test-tell-o").show();
		$("#test-tell-o").fadeOut("slow");
	} else {
		$("#test-tell-p").show();
		$("#test-tell-p").fadeOut("slow");
	}
}

$("#test-add").click(function() {
	if ($("h1.content").length) {
		wo = $("h1.content").clone().children().remove().end().text().trim();
		an = $("#review-definitions span.text").text().trim().replace("\n", " | ");
		hi = $("#test-h").val();
		list_of_test.push([wo, an, hi, 1]);
		tellAdd("ok");
		updateWordList();
	} else {
		tellAdd("problem");
	}
	$("#test-h").val("");
});
$(document).keyup(function(e){
	if (e.which == 192) {
		$("#test-add").click();
	} else if (e.which == 27) {
		if ($("#test-a").is(":focus")) {
			$("#test-a").blur();
		} else {
			$("#test-a").focus();
		}
	}
});
$("#test-check").click(function() {
	if ($("#test-a").val() == list_of_test[0][0]) {
		tellAnswer("correct");
		enter_cont = 0;
	} else {
		tellAnswer("wrong");
	}
});
$("#test-a").keyup(function(e){
	if (e.which == 13) {
		if (enter_cont == 1) {
			$("#test-check").click();
		} else {
			$("#test-next").click();
		}
	} else if (e.which == 39) {
		$("#test-hint").click();
	} else if (e.which == 38) {
		$("#test-top").click();
	}
});
$("#test-hint").click(function() {
	if (list_of_test[0][2] == "") {
		$("#test-a").val(list_of_test[0][0].substring(0, list_of_test[0][3]));
		list_of_test[0][3]++;
	} else {
		$("#test-listed").append('<p style="overflow:hidden; color:#209e85">' + list_of_test[0][2] + "</p>");
		list_of_test[0][2] = "";
	}
});
$("#test-top").click(function() {
	list_of_test[0][3] = 1;
	list_of_test.push(list_of_test[0]);
	list_of_test.shift();
	updateWordList();
	$("#test-a").val("");
	enter_cont = 1;
});
$("#test-next").click(function() {
	list_of_test.shift();
	updateWordList();
	$("#test-a").val("");
	enter_cont = 1;
});
$("#search-wi").click(function() {
	what = $("h1.content").clone().children().remove().end().text().trim().replace(" ", "+");
	window.open("http://wordinfo.info/results?searchString=" + what, "_blank");
});
$("#search-et").click(function() {
	what = $("h1.content").clone().children().remove().end().text().trim().replace(" ", "+");
	window.open("http://www.etymonline.com/search?q=" + what, "_blank");
});
