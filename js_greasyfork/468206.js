// ==UserScript==
// @name			[Twitter]こっそりいいね
// @namespace		https://greasyfork.org/ja/users/1023652
// @version			1145141919810.0.2
// @description		リツイートした人に通知を飛ばさずいいねするボタンを追加する。
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @connect			twitter.com
// @icon			https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant			GM_xmlhttpRequest
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/468206/%5BTwitter%5D%E3%81%93%E3%81%A3%E3%81%9D%E3%82%8A%E3%81%84%E3%81%84%E3%81%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/468206/%5BTwitter%5D%E3%81%93%E3%81%A3%E3%81%9D%E3%82%8A%E3%81%84%E3%81%84%E3%81%AD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const desktop_env = {'tweet_field': 'article[data-testid="tweet"]','retweeted': '[data-testid="socialContext"]','liked_color': 'r-vkub15','liked':'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'};
	const mobile_env = {'tweet_field': 'article[data-testid="tweet"]','retweeted': '[data-testid="socialContext"]','liked_color': 'r-vkub15','liked':'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'};
	var env_selector;
	function isMobileDevice(){
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	}
	if(isMobileDevice()){
		env_selector = mobile_env;
	}else{
		env_selector = desktop_env;
	}
	let updating = false;
	window.addEventListener("scroll", update);
	init();

	async function main(tweets){
		tweets.forEach(function(element){
			if(element.querySelector(".sneakilyLike") || ! element.querySelector(env_selector.retweeted) || !element.querySelector('[data-testid="like"]')) return;
			let tweet_link = Array.from(element.querySelectorAll("a[aria-label]")).filter(function(tmp){return tmp.href.match(/\/status\/[0-9]*(\/analytics)?$/)})[0].href.replace(/\/analytics$/,'');
			let button = document.createElement('button');
			let fotter = element.querySelector('div[id][role="group"]');
			let like_element = fotter.querySelector('[data-testid="like"]');
			button.textContent = "いいね！";
			button.style.fontSize = '0.7em';
			button.style.whiteSpace = 'nowrap';
			button.classList.add('sneakilyLike');
			button.addEventListener('click',async function(event){
				this.disabled = true;
				const status = await request(new requestObject(tweet_link));
				if(status.response.data.favorite_tweet == "Done"){
					like_element.querySelector('div[dir="ltr"]').classList.add(env_selector.liked_color);
					like_element.querySelector('div[dir="ltr"]').style.color = "rgb(249, 24, 128)";
					like_element.querySelector("path").setAttribute('d',env_selector.liked);
					like_element.setAttribute('data-testid', 'unlike');
				}
				this.remove();
			});
			fotter.insertBefore(button, like_element.parentElement.nextSibling);
		});
	}
	function init() {
		main(document.querySelectorAll(env_selector.tweet_field));
	}
	function update() {
		if(updating) return;
		updating = true;
		init();
		setTimeout(() => {updating = false;}, 1000);
	}
	function getCookieArray() {
		var arr = [];
		if(document.cookie != '') {
			var tmp = document.cookie.split('; ');
			for(var i = 0; i < tmp.length; i++) {
				var data = tmp[i].split('=');
				arr[data[0]] = decodeURIComponent(data[1]);
			}
		}
		return arr;
	}
	const x_csrf_token = getCookieArray().ct0;
	class requestObject{
		constructor(URL){
			this.method = 'POST';
			this.respType = 'json';
			this.url = 'https://twitter.com/i/api/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet';
			this.body = `{"variables":{"tweet_id":"${URL.split('/').pop()}"},"queryId":"lI07N6Otwv1PhnEgXILM7A"}`;
			this.headers = {
				'Content-Type': 'application/json',
				'User-agent': window.navigator.userAgent,
				'accept': '*/*',
				'Referer': URL,
				'Origin': 'https://twitter.com',
				'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
				"x-csrf-token": x_csrf_token,
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'navigate',
			};
			this.package = null;
			this.anonymous = false;
		}
	}
	async function request(object, timeout = 60000) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: object.method,
				url: object.url,
				headers: object.headers,
				responseType: object.respType,
				data: object.body,
				anonymous: object.anonymous,
				timeout: timeout,
				onload: function(responseDetails) {
					return resolve(responseDetails);
				},
				ontimeout: function(responseDetails) {
					return reject(`[request]time out:\nresponse ${responseDetails}`);
				},
				onerror: function(responseDetails) {
					return reject(`[request]error:\nresponse ${responseDetails}`);
				}
			});
		});
	}
})();
