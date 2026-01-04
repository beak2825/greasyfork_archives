// ==UserScript==
// @name         bangumi ep linker
// @name:zh-CN   Bangumi ep linker
// @namespace    http://xuefer.win/
// @version      0.4
// @description  "link episode to torrent web"
// @description:zh-CN "链接每集到 BT 下载网站"
// @author       Xuefer
// @include      http://bangumi.tv/ep/*
// @include      https://bangumi.tv/ep/*
// @include      http://bgm.tv/ep/*
// @include      https://bgm.tv/ep/*
// @include      http://chii.in/ep/*
// @include      https://chii.in/ep/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382354/bangumi%20ep%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/382354/bangumi%20ep%20linker.meta.js
// ==/UserScript==

String.prototype.trim = function() {
	return this.replace(/^[ \t]+|[ \t]+$/g, "");
};

Number.prototype.zeroPad = function(length) {
	var s = (this||"0").toString();
	while (s.length < length) {
		s = "0" + s;
	}
	return s;
};


function changeLayout() {
	// wait for element to finish
	var unsafeWindow = self.unsafeWindow||window;
	if (!unsafeWindow.$ || !document.getElementById("columnEpB")) {
		setTimeout(changeLayout, 1);
		return;
	}
	console.log("Changing layout");
	var $ = unsafeWindow.$;

	var ep = (function() {
		var ep = $("#columnEpA h2.title").text();
		var m;
		if ((m = ep.match(/ep\.(\d*)/))) {
			return Number(m[1]);
		}
		console.log("ep not found");
	})();

	var title = (function() {
		var title = $(".nameSingle a").text();
		var m;
		if ((m = title.match(/(.*)\((?:Season|Series)(.*)\)/i)) ||
			(m = title.match(/(.*)Season(.*)/i)) ||
			(m = title.match(/(.*)(\d*)/))) {
			console.log(m);
			title = m[1].trim();
			var season = Number(m[2]) || 1;
			return [title, season];
		}
		return [title, 1];
	})();

	var season = title[1];
	title = title[0];

	var keyword = title + " S" + season.zeroPad(2) + "E" + ep.zeroPad(2);
	var links = {
		'[TPB]': "https://thepiratebay.org/search/" + encodeURIComponent(keyword) + "/0/99/0",
		'[RARBG]': "https://rarbg.to/torrents.php?order=seeders&by=DESC&search=" + encodeURIComponent(keyword),
		'[1377x]': "https://www.1377x.to/sort-search/" + encodeURIComponent(keyword) + "/seeders/desc/1/",
		'[M-TEAM]': "https://tp.m-team.cc/torrents.php?search=" + encodeURIComponent(keyword) + "&sort=7&type=desc",
	};

	var titleElement = $("#columnEpA h2.title");
	$('<br>').appendTo(titleElement);
	for (var text in links) {
		$('<a>', { text: text, href: links[text], class: 'l', }).appendTo(titleElement);
	}
}

changeLayout();
