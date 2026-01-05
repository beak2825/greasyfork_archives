// ==UserScript==
// @name        haiku_spam_hidden
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   haiku_spam_hidden
// @description はてなハイクのスパムを非表示します。
// @include     http://h.hatena.ne.jp/*
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5424/haiku_spam_hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/5424/haiku_spam_hidden.meta.js
// ==/UserScript==

$(function() {
//スパマーのID
var su = [];
//スパムキーワード
var sk = [];

setInterval(function() {
	//spamだと見なすパターン
	//キーワード
	var km = new RegExp(/http|free|movie|w.?a.?t.?c.?h|s.?t.?r.?e.?a.?m|l.?i.?v.?e|justin|tv|izle|online|ver|purdue|n.?u.?d.?e|kidia|zynga|forum|Nordic|get|asistida|онлайн|смотреть|Александр|Солнечный|full|video|pastebin|ℯ|sgh|costa|fast income|business discussions|www\..*\.com|voir|The V Groove|Eva3drs|gratis/i);
	//本文
	var bm = new RegExp(/amigomedico|justineskye|goodsie|heartofamericahospice|educavie|wkdy|willistonfirst|wetwebmediaforum|oxfordyouthexpression/i);
	//例外（idページ）
	var nop = new RegExp(/id\:/i);
	
	//timeline上（キーワード）
	$('body').find('a.title-anchor').each(function() {
		if (!$(this).html().match(nop)) {
			if ($(this).html().match(km)) {
				$(this).parent().parent().parent().css('display','none');
				
				//スパマーの判別
				var userid = $(this).parent().parent().parent().find('span.username').children('a').attr('href');
				if (su.indexOf(userid) == -1) {
					su.push(userid);
				}
			}
		}
	});

	//timeline上（本文）
	$('body').find('div.entry-body-content').each(function() {		
		if ($(this).html().match(bm)) {
			$(this).parent().parent().parent().css('display','none');
			
			//キーワードを認識してスパムキーワードに加える
			sk.push($(this).parent().parent().find('a.title-anchor').html());
			
			//スパマーの判別
			var userid = $(this).parent().parent().parent().find('span.username').children('a').attr('href');
			if (su.indexOf(userid) == -1) {
				su.push(userid);
			}
		}
	});

	//注目キーワード
	$('body').find('a.keyword').each(function() {
		if ($(this).html().match(km)) {
			$(this).parent().css('display','none');
		}
	});

	//検出したスパマーに目印をつける
	$('body').find('li.user').each(function() {
		for (i = 0; i < su.length; i++) {
			if ($(this).find('a').attr('href') == su[i]) {
				$(this).children().children().children().css('border','solid 2px').css('color','black');
			}
		}
	});
},350);
});