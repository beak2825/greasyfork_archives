// ==UserScript==
// @name			[Twitter]返ってこい！リツイート欄！
// @name:ja			[Twitter]返ってこい！リツイート欄！
// @name:en			[Twitter]Engagement Restorer
// @namespace		https://greasyfork.org/ja/users/1023652
// @version			1145141919810.0.12
// @description		リツイートや引用、いいねをした人を表示するリンクを追加します。
// @description:ja			リツイートや引用、いいねをした人を表示するリンクを追加します。
// @description:en			Retweet and Like List Restorer for Twitter.
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://x.com/*
// @match			https://X.com/*
// @connect			api.twitter.com
// @icon			https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant			GM_xmlhttpRequest
// @license			MIT
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/475409/%5BTwitter%5D%E8%BF%94%E3%81%A3%E3%81%A6%E3%81%93%E3%81%84%EF%BC%81%E3%83%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E6%AC%84%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/475409/%5BTwitter%5D%E8%BF%94%E3%81%A3%E3%81%A6%E3%81%93%E3%81%84%EF%BC%81%E3%83%AA%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E6%AC%84%EF%BC%81.meta.js
// ==/UserScript==

(function(){
	'use strict';
	let currentUrl = document.location.href;
	let updating = false;
	locationChange();
	const engagementsTextColor = {
		"0": {"count": "rgb(15, 20, 25)","text": "rgb(83, 100, 113)"},
		"1": {"count": "rgb(247, 249, 249)","text": "rgb(139, 152, 165)"},
		"2": {"count": "rgb(231, 233, 234)","text": "rgb(113, 118, 123)"}
	};
	async function main(){
		if(!currentUrl.match(/https?\:\/\/twitter\.com\/\w*\/status\/[0-9]*($|\?.*)/) || document.getElementById('restoreEngagements'))return;
		const tweetLink = currentUrl.match(/https?\:\/\/twitter\.com\/\w*\/status\/[0-9].*/)[0];
		const tweetId = tweetLink.match(/\/status\/(\d+)/)[1];
		let response = (await request(new requestObject_twitter_graphQL(tweetId))).response.data.threaded_conversation_with_injections_v2.instructions[0];
		response = response.entries[response.entries.findIndex((tmp) => tmp.entryId == `tweet-${tweetId}`)].content.itemContent.tweet_results.result.legacy;
		const engagemants = {"favorite_count": response.favorite_count,"quote_count": response.quote_count,"retweet_count": response.retweet_count};
		console.log(engagemants);
		const target_node = Array.from((await wait_load_Element('article[data-testid="tweet"]'))).find(node => {
			const timeParents = Array.from(node.querySelectorAll('time')).map(time => time.parentNode);
			return timeParents.some(parent => parent.href && parent.href.match(tweetId));
		});
		const engagemants_aria = target_node.querySelector('[role="group"]');
		if(!engagemants_aria)return;
		let envEngagementsTextColor = engagementsTextColor[GetCookie("night_mode") || "0"];
		const flexContainer = document.createElement('div');
		flexContainer.style.display = 'flex';
		flexContainer.style.justifyContent = 'space-between';
		flexContainer.style.width = '70%';
		flexContainer.id = 'restoreEngagements';
		const links = [
			{
				"name": "retweets",
				"href": tweetLink + "/retweets",
				"count": round_half_up(engagemants.retweet_count,env_Text.roundingScale,env_Text.decimalPlaces,env_Text.units),
				"text": env_Text.retweet
			},
			{
				"name": "quotes",
				"href": tweetLink + "/quotes",
				"count": round_half_up(engagemants.quote_count,env_Text.roundingScale,env_Text.decimalPlaces,env_Text.units),
				"text": env_Text.quoted,
			},
			{
				"name": "likes",
				"href": tweetLink + "/likes",
				"count": round_half_up(engagemants.favorite_count,env_Text.roundingScale,env_Text.decimalPlaces,env_Text.units),
				"text": env_Text.like,
			},
		];
		links.forEach((a, index) => {
			const newLink = document.createElement('a');
			newLink.style.textDecoration = 'none';
			newLink.href = a.href;
			const countText = document.createElement('span');
			countText.textContent = a.count;
			countText.style.color = envEngagementsTextColor.count;
			newLink.appendChild(countText);

			const textPart = document.createElement('span');
			textPart.textContent = " " + a.text;
			textPart.style.color = envEngagementsTextColor.text;
			newLink.appendChild(textPart);

			newLink.addEventListener('click', (e) => {
				e.preventDefault();
				clickTab(a.name,target_node);
			});
			flexContainer.appendChild(newLink);
		});
		if(currentUrl.match(/https?\:\/\/twitter\.com\/\w*\/status\/[0-9]*($|\?.*)/))engagemants_aria.parentNode.prepend(flexContainer);
	}
	Text.ja = {
		"retweet": "リツイート",
		"quoted": "件の引用",
		"like": "いいね",
		"units": "万",
		"roundingScale": 10000,
		"decimalPlaces": 2,
	}

	Text.en = {
		"retweet": "Retweets",
		"quoted": "Quotes",
		"like": "Likes",
		"units": "K",
		"roundingScale": 1000,
		"decimalPlaces": 1,
	}

	let env_Text = Text[GetCookie("lang")] || Text.en;
	function update(){
		if(updating) return;
		updating = true;
		main();
		setTimeout(() => {updating = false;}, 1000);
	}
	function locationChange(){
		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				if(currentUrl !== document.location.href){
					currentUrl = document.location.href;
					main();
				}
			});
		});
		const target = document.getElementById("react-root");
		const config = {childList: true,subtree: true};
		observer.observe(target, config);
	}
	async function clickTab(name,target_node){
		target_node.querySelector('[data-testid="caret"]').click();
		document.querySelector('[data-testid="tweetEngagements"]').click();
		const engagemants_aria = (await wait_load_Element('nav[aria-live="polite"]'))[0];
		const regex = new RegExp(name + '$');
		engagemants_aria.querySelectorAll('[role="presentation"] a').forEach((e)=>{
			if(e.href.match(regex)) e.click();
		});
	}
	function round_half_up(original_value,where_round_off,decimal_place = 0,unit_str = ""){
		if(Number(original_value)>=Number(where_round_off)){
			var tmp_value;
			tmp_value = Math.round(Number(original_value) / Number(where_round_off) * Math.pow(10,Number(decimal_place))) / Math.pow(10,Number(decimal_place));
			if(unit_str == ""){
				return tmp_value;
			}else{
				return `${tmp_value}${unit_str}`
			}
		}else{
			return original_value;
		}
	}
	function wait_load_Element(Element_Name,interval = 100,retry = 25){
		return new Promise((resolve, reject) => {
			const MAX_RETRY_COUNT = retry;
			let retry_counter = 0;
			let set_interval_id = setInterval(find_target_element, interval);
			function find_target_element(){
				retry_counter++;
				if(retry_counter > MAX_RETRY_COUNT){
					clearInterval(set_interval_id);
					return reject("Max retry count reached");
				}
				let target_elements = document.querySelectorAll(`${Element_Name}`);
				if(target_elements.length > 0){
					clearInterval(set_interval_id);
					return resolve(target_elements);
				}
			}
		});
	}
	function GetCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
		}else{
			return null;
		}
	}
	async function request(object, maxRetries = 1, timeout = 60000){
		let retryCount = 0;
		while(retryCount <= maxRetries){
			try{
				return await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: object.method,
						url: object.url,
						headers: object.headers,
						responseType: object.respType,
						data: object.body,
						anonymous: object.anonymous,
						timeout: timeout,
						onload: function(responseDetails){
							resolve(responseDetails);
						},
						ontimeout: function(responseDetails){
							reject(`[request]time out:\nresponse ${responseDetails}`);
						},
						onerror: function(responseDetails){
							reject(`[request]error:\nresponse ${responseDetails}`);
						}
					});
				});
			}catch(error){
				retryCount++;
				console.warn(`Retry ${retryCount}: Failed to fetch ${object.url}. Reason: ${error}`);
				if(retryCount === maxRetries){
					throw new Error(`Failed to fetch ${object.url} after ${maxRetries} retries.`);
				}
			}
		}
	}
	class requestObject_twitter_1_1{
		constructor(ID){
			this.method = 'GET';
			this.respType = 'json';
			this.url = "https://api.twitter.com/1.1/statuses/lookup.json?id=" + ID + "&tweet_mode=extended";
			this.body = null;
			this.headers = {
				"Content-Type": "application/json",
				'Referer': "https://twitter.com/",
				'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAIK1zgAAAAAA2tUWuhGZ2JceoId5GwYWU5GspY4%3DUq7gzFoCZs1QfwGoVdvSac3IniczZEYXIcDyumCauIXpcAPorE`,
				'x-csrf-token': GetCookie("ct0"),
			};
			this.package = null;
			this.anonymous = false;
		}
	}
	class requestObject_twitter_graphQL{
		constructor(ID){
			this.method = 'GET';
			this.respType = 'json';
			this.url = `https://api.twitter.com/graphql/NNiD2K-nEYUfXlMwGCocMQ/TweetDetail?variables=%7B%22focalTweetId%22%3A%22${ID}%22%2C%22with_rux_injections%22%3Afalse%2C%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withBirdwatchNotes%22%3Atrue%2C%22withSuperFollowsUserFields%22%3Atrue%2C%22withDownvotePerspective%22%3Afalse%2C%22withReactionsMetadata%22%3Afalse%2C%22withReactionsPerspective%22%3Afalse%2C%22withSuperFollowsTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D&features=%7B%22responsive_web_twitter_blue_verified_badge_is_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Afalse%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Afalse%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
			this.body = null;
			this.headers = {
				"Content-Type": "application/json",
				'User-agent': navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Referer': "https://twitter.com/",
				'Host': 'api.twitter.com',
				'authorization': `Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA`,
				'x-csrf-token': GetCookie("ct0"),
			};
			this.package = null;
			this.anonymous = false;
		}
	}
	main();
})();
