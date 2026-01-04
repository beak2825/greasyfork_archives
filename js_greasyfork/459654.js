// ==UserScript==
// @name			あなたのツイートはどこから？
// @name:ja			あなたのツイートはどこから？
// @name:en			Hello tweet where are you from.
// @version			1145141919810.0.14
// @description			どのクライアントからツイートしたかを表示します。
// @description:ja		どのクライアントからツイートしたかを表示します。
// @description:en		Displays from which client the tweet was sent.
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @connect			api.twitter.com
// @icon			https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant			GM_xmlhttpRequest
// @license			MIT
// @namespace https://greasyfork.org/ja/users/1023652
// @downloadURL https://update.greasyfork.org/scripts/459654/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AF%E3%81%A9%E3%81%93%E3%81%8B%E3%82%89%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/459654/%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AF%E3%81%A9%E3%81%93%E3%81%8B%E3%82%89%EF%BC%9F.meta.js
// ==/UserScript==

function getCookieArray(){
	var arr = [];
	if (document.cookie != ''){
		var tmp = document.cookie.split('; ');
		for (var i = 0; i < tmp.length; i++){
			var data = tmp[i].split('=');
			arr[data[0]] = decodeURIComponent(data[1]);
		}
	}
	return arr;
}

class requestObject {
	constructor(ID, cookies){
		this.method = 'GET';
		this.respType = 'json';
		this.url = `https://api.twitter.com/1.1/statuses/show.json?id=${ID}&tweet_mode=extended`;
		this.body = null;
		this.headers = {
			"Content-Type": "application/json",
			'User-agent': navigator.userAgent || navigator.vendor || window.opera,
			'accept': '*/*',
			'Referer': "https://twitter.com/",
			'Host': 'api.twitter.com',
			'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAIK1zgAAAAAA2tUWuhGZ2JceoId5GwYWU5GspY4%3DUq7gzFoCZs1QfwGoVdvSac3IniczZEYXIcDyumCauIXpcAPorE',
			'x-csrf-token': cookies.ct0,
//			'cookie': `auth_token=${cookies.auth_token}; ct0=${cookies.ct0}`
		};
		this.package = null;
		this.anonymous = false;
	}
}

function request(object, func, timeout = 60000){
	GM_xmlhttpRequest({
		method: object.method,
		url: object.url,
		headers: object.headers,
		responseType: object.respType,
		data: object.body,
		anonymous: object.anonymous,
		timeout: timeout,
		onload: function(responseDetails){
//			console.log(responseDetails);
			func(responseDetails, object);
		},
		ontimeout: function(responseDetails){
			console.log("time out.");
			console.log(responseDetails);
		},
		ononerror: function(responseDetails){
			console.log("error.");
			console.log(responseDetails);
		}
	});
}
(function(){
	'use strict';
	var desktop_selector = {'info_field': '.css-1dbjc4n.r-1d09ksm.r-1471scf.r-18u37iz.r-1wbh5a2'};
	var mobile_selector = {'info_field': '.css-1dbjc4n.r-1d09ksm.r-1471scf.r-18u37iz.r-1wbh5a2'};
	var env_selector;
	function isMobileDevice(){
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	}
	if(isMobileDevice()){
		env_selector = mobile_selector;
	}else{
		env_selector = desktop_selector;
	}
	let currentUrl = document.location.href;
	let Tweet_ID, Obj;
	locationChange();

	function main(){
		show_client();
	}

	function executing_functions(response_data){
		write_client(response_data);
	}

	function write_client(response_json){
		//console.log(response_json.response[0].source.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ''));
		document.querySelectorAll(env_selector.info_field).forEach(t => {
			if (t.innerText.match(/2[0-9]{3}/)){
				var info_selector_name = t.childNodes[0].className;
				var client_text = document.createElement("div");
				client_text.dir = "ltr";
				client_text.innerHTML = `<span class="display_twitter_client ${info_selector_name}" style="">${response_json.response.source.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')}</span>`;
				t.appendChild(client_text);
				if(response_json.response.extended_entities.media[0].type.match(/video|animated_gif/)){
					var nomination = response_json.response.extended_entities.media[0].video_info.variants.filter(function(obj){return obj.content_type != 'application/x-mpegURL'});
					var video_url = nomination.reduce((a, b) => a.bitrate > b.bitrate ? a:b).url.split('?')[0];
					var show_video_url = document.createElement("span");
					show_video_url.innerHTML = `<span class="display_video_url"><a href="${video_url}">video url</a></span>`
					t.appendChild(show_video_url);
				}
			}
		});
	}

	function show_client(){
		if (currentUrl.match(/status\/[0-9]{12,}/) && !document.querySelector('.display_twitter_client')){
			Tweet_ID = currentUrl.match(/status\/[0-9]{12,}/)[0].match(/[0-9]{12,}/)[0];
			console.log(`Tweet_id: ${Tweet_ID}`);
			Obj = new requestObject(Tweet_ID, getCookieArray());
			request(Obj, executing_functions);
		}
	}

	function locationChange(){
		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				if (currentUrl !== document.location.href){
					currentUrl = document.location.href;
					main();
				}
			});
		});
		const target = document.body;
		const config = {childList: true,subtree: true};
		observer.observe(target, config);
	}
    function wait_load_Element_and_do_function(Element_Name,func,func_argument){
		const MAX_RETRY_COUNT = 15;
		var retry_counter = 0;
		var set_interval_id = setInterval(find_target_element, 500);
		function find_target_element() {
			retry_counter++;
			if(retry_counter > MAX_RETRY_COUNT) {
			clearInterval(set_interval_id);
                return;
			}
			var target_elements = document.querySelectorAll(`${Element_Name}`);
			if(target_elements.length > 0) {
				if(typeof(set_interval_id) != 'undefined') {
					clearInterval(set_interval_id);
					func(func_argument);
				}else {
					return target_elements;
				}
			}
		}
		find_target_element();
	}
	wait_load_Element_and_do_function(env_selector.info_field,main);
})();
