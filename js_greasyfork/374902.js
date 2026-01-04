// ==UserScript==
// @name        AtCoder Permanent Contests
// @description beta.atcoder.jpにおいて、常設されているコンテストを他のコンテストと分けて表示します
// @version     1.0
// @author      euglenese
// @match       beta.atcoder.jp
// @match       beta.atcoder.jp/?*
// @namespace https://greasyfork.org/users/201019
// @downloadURL https://update.greasyfork.org/scripts/374902/AtCoder%20Permanent%20Contests.user.js
// @updateURL https://update.greasyfork.org/scripts/374902/AtCoder%20Permanent%20Contests.meta.js
// ==/UserScript==


// 日本語

var permanent_contests = $("h4").filter(function(){
	return $(this).text() == "開催中のコンテスト";
}).next().find("tr").filter(function(){
	var contest_name = $(this).find("a").text();
	return contest_name == "6/25(月) 00:00practice contest" || contest_name == "12/13(水) 21:00AtCoder Programming Guide for beginners (APG4b)" || contest_name == "3/14(水) 12:00AtCoder Beginners Selection";
});

$("h4").filter(function(){
	return $(this).text() == "開催中のコンテスト";
}).next().next().after('<h4>常設されているコンテスト</h4><div class="table-responsive"><table class="table table-default table-striped table-hover table-condensed small" style="margin-bottom:0;"><thead><th width="36%">開始時刻</th><th>コンテスト名</th></tr></thead><tbody></tbody></table></div><hr>');

var permanent_contests_table = $("h4").filter(function(){
	return $(this).text() == "常設されているコンテスト";
}).next().find("tbody");

for(var i = 0; i < permanent_contests.length; i++){
	permanent_contests_table.append(permanent_contests[i]);
}

// English

var permanent_contests = $("h4").filter(function(){
	return $(this).text() == "Active Contests";
}).next().find("tr").filter(function(){
	var contest_name = $(this).find("a").text();
	return contest_name == "6/25(Mon) 00:00practice contest";
});

$("h4").filter(function(){
	return $(this).text() == "Active Contests";
}).next().next().after('<h4>Permanent Contests</h4><div class="table-responsive"><table class="table table-default table-striped table-hover table-condensed small" style="margin-bottom:0;"><thead><th width="36%">Start Time</th><th>Contest Name</th></tr></thead><tbody></tbody></table></div><hr>');

var permanent_contests_table = $("h4").filter(function(){
	return $(this).text() == "Permanent Contests";
}).next().find("tbody");

for(var i = 0; i < permanent_contests.length; i++){
	permanent_contests_table.append(permanent_contests[i]);
}