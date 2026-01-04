// ==UserScript==
// @name        atcoder-traffic
// @namespace 	https://greasyfork.org/users/201019
// @description beta.atcoder.jpとatcoder.jpのコンテストサイトを行き来する etc.
// @version     3.1
// @author      euglenese
// @match       https://atcoder.jp/contests/*
// @match       https://*.contest.atcoder.jp/*
// @downloadURL https://update.greasyfork.org/scripts/370878/atcoder-traffic.user.js
// @updateURL https://update.greasyfork.org/scripts/370878/atcoder-traffic.meta.js
// ==/UserScript==

var joi_pdf_number = [
					  	[20, 21, 23, 24], 
				   	  	[20, 21, 22, 24],
				   	  	[20, 21, 22, 23],
				   	  	[20, 21, 22, 23]
				   	 ];

function location_match(regex){
	return location.href.match(new RegExp(regex));
}

function erase(text, regex){
	return text.replace(new RegExp(regex), "");
}

var contest_name, position_name, linked;

function position_name_change(before, after){
	if(position_name == before){
		position_name = after;
	}	
}

var beta_contest_URL = "https\:\/\/atcoder\.jp\/contests\/";
var https = "https\:\/\/";
var contest_URL = "\.contest\.atcoder\.jp\/";
var any_string = "[0-9a-z-_#]+";
var any_string2 = "[0-9a-z-_#]*";
var any_slash = "[0-9a-z-_#/]+";
var any_char = "[0-9a-z-_#]";
var any_digit = "[0-9]";

if(location_match(beta_contest_URL)){
	if(location_match(beta_contest_URL + any_string + "\/" + any_slash)){
		contest_name = erase(location.href, beta_contest_URL).split("/")[0];
		position_name = erase(location.href, beta_contest_URL + contest_name + "/");
		position_name_change("tasks", "assignments");
		position_name_change("submissions", "submissions/all");
		linked = "https://" + contest_name + ".contest.atcoder.jp/" + position_name;
	}else{
		contest_name = erase(location.href, beta_contest_URL).split("/")[0];
		linked = "https://" + contest_name + ".contest.atcoder.jp/";
	}
	$(".contest-title").attr("href", linked);
}else{
	if(location_match(https + any_string + contest_URL + any_slash)){
		contest_name = erase(erase(location.href, https), contest_URL + any_slash);
		position_name = erase(location.href, https + contest_name + contest_URL);
		position_name_change("submissions/all", "submissions");
		linked = "https://atcoder.jp/contests/" + contest_name + "/" + position_name;;
	}else{
		contest_name = erase(erase(location.href, https), contest_URL);
		linked = "https://atcoder.jp/contests/" + contest_name;
	}
	$(".brand").removeAttr("href");
	$(".contest-name").replaceWith(function() {
  		$(this).replaceWith("<span class='contest-name'><a href='" + linked + "'>" + $(this).text() + "</a></span>");
	});
	$(".contest-name a").css("color", "white");
	$(".contest-name a").css("text-decoration", "none");
	for(var i in [0, 1]){
		$("time").eq(i).replaceWith(function() {
			var url = "https://www.timeanddate.com/worldclock/fixedtime.html?iso=" + $(this).text().substr(0, 4) + $(this).text().substr(5, 2) + $(this).text().substr(8, 2) + "T" + $(this).text().substr(11, 2) + $(this).text().substr(14, 2) + "&p1=248";
	  		$(this).replaceWith("<time class='timezone-fixed'><a href='" + url + "'>" + $(this).text() + "</a></time>");
		});
		$("time a").eq(i).css("color", "#ccc");
		$("time a").css("text-decoration", "none");
	}
}

var joi_years = "(2007|2008|2009|2010|2011|2012)";

if(location_match(beta_contest_URL + "joisc" + joi_years + "\/tasks\/joisc" + joi_years + "_") || location_match(https + "joisc" + joi_years + contest_URL + "tasks\/joisc" + joi_years + "_")){
	var this_year;
	if(location_match(beta_contest_URL + "joisc" + joi_years + "\/tasks\/joisc" + joi_years + "_")){
		this_year = erase(erase(location.href, beta_contest_URL + "joisc"), "\/tasks\/joisc" + joi_years + "_" + any_string);
	}else{
		this_year = erase(erase(location.href, https + "joisc"), contest_URL + "tasks\/joisc" + joi_years + "_" + any_string);
	}
	this_year = parseInt(this_year);
	for(var i = 0; i < 4; i++){
		var url;
		if(this_year == 2008 || this_year == 2009){
			url = "https://www.ioi-jp.org/camp/" + this_year + "/" + this_year + "-sp-tasks/" + this_year + "-sp_tr-day" + (i + 1) + "_" + joi_pdf_number[this_year - 2007][i] + ".pdf";
		}else if(this_year <= 2010){
			url = "https://www.ioi-jp.org/camp/" + this_year + "/" + this_year + "-sp-tasks/" + this_year + "-sp-day" + (i + 1) + "_" + joi_pdf_number[this_year - 2007][i] + ".pdf";
		}else{
			url = "https://www.ioi-jp.org/camp/" + this_year + "/" + this_year + "-sp-tasks/" + this_year + "-sp-day" + (i + 1) + ".pdf";
		}
		$("#task-statement").append("<a href='" + url + "'>PDFリンク (Day " + (i + 1) + ")</a><br>");
	}
}