// ==UserScript==
// @name        链接自动跳转
// @author      billypon
// @description 访问分享链接时自动跳转至下载页面或验证页面
// @version     1.13.4
// @namespace   http://www.canaansky.com/
// @match       *://www.123wzwp.com/*
// @match       *://158pan.cn/*
// @match       *://www.678pan.net/*
// @match       *://pan.789xz.com/*
// @match       *://www.88pan.cc/*
// @match       *://*.dfpan.com/*
// @match       *://www.feemoo.com/*
// @match       *://www.fxpan.com/*
// @match       *://hiyp.cc/*
// @match       *://www.pipipan.com/*
// @match       *://www.sju.wang/*
// @match       *://www.wwp5.com/*
// @match       *://www.yousuwp.com/*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25548/%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/25548/%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var domain = location.hostname.match(/\w+\.\w+$/)[0], path=location.pathname;
console.debug("domain", domain);

function ajax(url, callback) {
	console.debug("ajax request", url);
	var request = new XML*Request();
	request.onreadystatechange = function (event) {
		var target = event.currentTarget;
		if (target.readyState != 4)
			return;
		if (target.status == 200)
			callback(target.responseText);
		else
			console.error("ajax response", target.status, target.responseText);
	};
	request.open("GET", url);
	request.send();
}

function jump(final, replace, search) {
	if (!final && final !== null)
		final = "download";
	if (!replace)
		replace = "down";
	if (!search)
		search = "file";
	var url = path.replace(search, replace);
	if (final) {
		ajax(url, function() {
			jumpFromLink(newLink(url.replace(replace, final)));
		});
	} else {
		jumpFromLink(newLink(url));
	}
}

function getLink(selector) {
	var link = document.querySelector(selector);
	console.debug("link", link);
	return link;
}

function newLink(url) {
	var body = document.body, link = document.createElement("a");
	link.textContent = "download";
	link.href = url;
	body.insertBefore(link, body.children[0]);
	return link;
}

function jumpFromLink(link, click) {
	if (typeof link == "string") {
		link = getLink(link);
		if (!link)
			return;
	}
	if (click)
		link.click();
	else
		location = link.href;
}

function startsWith(search, string) {
	search = search || "/file-";
	return (string || path).slice(0, search.length) == search;
}

switch (domain) {
	case "158pan.cn":
		if (startsWith()) {
			jump();
		}
		break;
	case "123wzwp.com":
	case "678pan.net":
	case "789xz.com":
	case "88pan.cc":
	case "hiyp.cc":
	case "sju.wang":
	case "wwp5.com":
	case "yousuwp.com":
		if (startsWith()) {
			jump(null);
		}
		break;
	case "dfpan.com":
		if (startsWith("/file/down/")) {
			downSubmit(1);
		} else if (startsWith("/fs/") || startsWith("/file/")) {
			dialog_Open2 = function () { };
			show_vcode();
		}
		break;
	case "feemoo.com":
		if (startsWith()) {
			jumpFromLink(document.querySelectorAll(".down_six_main_b a")[1]);
		} else if (startsWith("/fmdown.php")) {
			var button = document.querySelector("#combtn");
			console.debug("button", button);
			if (button)
				button.click();
		}
		break;
	case "fxpan.com":
		if (startsWith("/share/")) {
			var button = document.querySelector("#popup-submit");
			console.debug("button", button);
			if (button)
				setTimeout(function () { button.click() }, 1000);
		} else if (startsWith("/downhtml/")) {
			jumpFromLink(".d3 a");
		} else if (startsWith("/down.php")) {
			var time = document.querySelector("#time");
			console.debug("time", time);
			if (time)
				time.innerHTML = 0;
		}
		break;
	case "pipipan.com":
		[].forEach.call(document.querySelectorAll("body > a"), function (x) {
			if (x.href.indexOf("popjump.php") > 0)
				x.remove();
		});
		if (startsWith("/fs/")) {
			var link = document.querySelector("#free_down_link");
			console.debug("link", link);
			if (link)
				link.click();
		}
		break;
}
