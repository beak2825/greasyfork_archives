// ==UserScript==
// @name        Report to news
// @description Allow you to make a quick report to the news by pressing the "News report" link at the top-right.
// @namespace   HF
// @author      Hash G.
// @include     *hackforums.net*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.03
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14071/Report%20to%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/14071/Report%20to%20news.meta.js
// ==/UserScript==

$(document).ready(function() {
	
	postkey = $("head > script:contains('<!--')").html();
	postkey = postkey.split("\n")[10];
	postkey = postkey.split('"')[1];
	console.log(postkey);
	event = "";
	link = "";
	
	if (!location.href.match(/index.php/i) || !location.href.match(/hackforums.net/i)) {
		link = document.location.href.replace(/\#$/, '');
		
		if (location.href.match(/member.php/i)) {
			name = $("span.largetext > strong:nth-child(1) > span").html();
			userClass = $("span.largetext > strong:nth-child(1) > span[class*='group']").attr("class");
			color = classToColor(userClass);
			uid = document.location.href.substr(52).replace(/\#$/, '');
			event = "[url=http://hackforums.net/member.php?action=profile&uid=" + uid + "][color=" + color + "][b]" + name + "[/b][/color][/url]";
			
		} else if (location.href.match(/myawards.php/i)) {
			name = $("#content a[href*='action=profile&uid=']").html();
			uid = document.location.href.substr(39).replace(/\#$/, '');
			award = $("tbody tr").last().children().html().substr(8).split("</strong>")[0];
			imageaward = $("img[src*='uploads/awards']:last").attr("src");
			event = "[url=http://hackforums.net/member.php?action=profile&uid=" + uid + "][color=#EFEFEF][b]" + name + "[/b][/color][/url] got the " + award + " award [img]http://hackforums.net" + imageaward + "[/img]";
		
		} else if (location.href.match(/showthread.php/i)) {
			event = "";
		}
	}
	

	$("body").append("<div id='popup_news' style='background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'><span style='float: right; margin-right: 1%; margin-top: 0.5%;'><a href='http://hackforums.net/showthread.php?tid=4992602&action=lastpost' target='_blank'>News thread</a></span><br><h4>Briefly describe the event: </h4><input id='step1' style='width: 70%' type='text' value='"+event+"'><br><h4>Any important links: </h4><input id='step2' style='width: 70%' type='text' value="+link+"><br><br><br><button class='bitButton' id='sendNews' onclick='sendNews()'>Send!</button> <button class='bitButton' id='closeNews'>Close</button><br><br><span id='status'></span></div>");
	$(".links").append(" | <a href='#' id='showNews'>News report</a>");

	$("#sendNews").on("click", function() {
		$("#status").html("Sending...");
		step1 = $("#step1").val();
		step2 = $("#step2").val();
		report = "[b][color=#ffde98]Briefly describe the event: [/color][/b] " + step1 + "\n[b][color=#ffde98]Any important links: [/color][/b] " + step2;
		$.post("http://hackforums.net/newreply.php", {
			"my_post_key": postkey,
			"action": "do_newreply",
			"tid": "4992602",
			"message": report,
			"modoptions[stickthread]" : 1
		},
			function (data, status) {
				console.log("Sent: " + status);
				$("#status").html("Sent!");
				setTimeout(function() { $("#popup_news").css("display", "none"); $("#status").html(""); }, 350);
		});
	});

	$("#showNews").on("click", function() {
		$("#popup_news").css("display", "block");
	});
	
	$("#closeNews").on("click", function() {
		$("#popup_news").css("display", "none");
	});
	
	function classToColor(userClass) {
		if (!userClass) {
			return '#383838';
		} else if (userClass == "group4"){
			return '#FF66FF';
		} else if (userClass == "group3"){
			return '#9999FF';
		} else if (userClass == "group9"){
			return '#99FF00';
		} else if (userClass == "group29"){
			return '#00AAFF';
		} else if (userClass == "group7"){
			return 'black';
		} else {
			return '#EFEFEF';
		} // Credits to Emylbus for this
	}
	
});