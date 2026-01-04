// ==UserScript==
// @name         BiliBili 评论区/空间显示IP属地 BiliBili IP Geolocation
// @namespace    https://mozz.ie/
// @version      0.2.2
// @description  让PC版页面评论区也能显示IP属地
// @author       Archeb
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xhook@1.5.5/dist/xhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/462151/BiliBili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%A9%BA%E9%97%B4%E6%98%BE%E7%A4%BAIP%E5%B1%9E%E5%9C%B0%20BiliBili%20IP%20Geolocation.user.js
// @updateURL https://update.greasyfork.org/scripts/462151/BiliBili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%A9%BA%E9%97%B4%E6%98%BE%E7%A4%BAIP%E5%B1%9E%E5%9C%B0%20BiliBili%20IP%20Geolocation.meta.js
// ==/UserScript==

function onDOMLoad(callback) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		callback();
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}

function addAjaxHook() {
	if (window.ajaxHooked) return;
	if (typeof $ === "undefined") return;

	var originalAjax = $.ajax;
	var ajaxWrapper = function () {
		var jqXHR = originalAjax.apply($, arguments);
		jqXHR.originalArguments = arguments;

		jqXHR.done((data, textStatus, jqXHR) => {
			// try to get URL, may in the first argument or in the second one
			var url = jqXHR.originalArguments[0]?.url || jqXHR.originalArguments[1]?.url;
			if (!url) {
				return;
			}
			var originalData = data;
			console.log("hooked:" + url);
			try {
				if (url.match(/api.bilibili.com\/x\/v2\/reply\/main/) || url.match(/api.bilibili.com\/x\/v2\/reply\/reply/)) data = processReplies(data);
			} catch (e) {
				console.error(e);
				data = originalData;
			}
		});

		return jqXHR;
	};

	$.ajax = ajaxWrapper;
	window.ajaxHooked = true;
	clearInterval(window.ajaxHookInterval);
	console.log("ajax hooked");
}

onDOMLoad(addAjaxHook);

window.ajaxHookInterval = setInterval(addAjaxHook, 1000);

// 加载bilibili评论js
var script = document.createElement("script");
script.src = "//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js";
document.head.appendChild(script);
script.onload = function () {
	if (window.bbComment) {
		window.bbComment();
	}
};

xhook.before(function (request) {
    var url = request.url;
	if (url.match(/api.bilibili.com\/x\/v2\/reply\/wbi\/main/) || url.match(/api.bilibili.com\/x\/v2\/reply\/reply/)) {
        // 不带cookie是不会返回IP属地信息的
        if(typeof request.withCredentials == 'boolean') request.withCredentials = true;
	}
});

xhook.after(async function (request, response) {
	var url = request.url;
	if (url.match(/api.bilibili.com\/x\/v2\/reply\/wbi\/main/) || url.match(/api.bilibili.com\/x\/v2\/reply\/reply/)) {
        if(request.xhr){
            // 是xmlhttprequest发出的请求
            response.text = JSON.stringify(unwrapReplies(JSON.parse(response.text)));
            return response;
        } else {
            // 是fetch API发出的请求
            const json = () => response.clone().json().then((data) => {
                return unwrapReplies(data)
            });
            response.json = json;
            return response;
        }
	}
});

function unwrapReplies(data) {

    console.log('processReplies' , data)
	data.data.replies = processReplies(data.data.replies);
	if(data.data.top_replies) data.data.top_replies = processReplies(data.data.top_replies);

	return data;
}
function processReplies(replies) {
	for (var i = 0; i < replies.length; i++) {
		if (replies[i].reply_control.location) {
			if (replies[i].root === 0) {
				// append to replies[i].card_label, create if not exist
				if (!replies[i].card_label) {
					replies[i].card_label = [];
				}
				replies[i].card_label.push({
					rpid: replies[i].rpid,
					text_content: replies[i].reply_control.location,
					text_color_day: "#757575",
					text_color_night: "#939393",
					label_color_day: "#F4F4F4",
					label_color_night: "#1E1E1E",
					image: "",
					type: 0,
					background: "",
					background_width: 0,
					background_height: 0,
					jump_url: "",
					effect: 0,
					effect_start_time: 0,
				});
			} else {
				replies[i].content.message = " (" + replies[i].reply_control.location + ") " + replies[i].content.message;
			}
		}
		if (replies[i].replies) {
			for (var j = 0; j < replies[i].replies.length; j++) {
				if (replies[i].replies[j].reply_control.location) {
					replies[i].replies[j].content.message = " (" + replies[i].replies[j].reply_control.location + ") " + replies[i].replies[j].content.message;
				}
			}
		}
	}
	return replies;
}