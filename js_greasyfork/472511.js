// ==UserScript==
// @name			[Twitter]WebhookがTweetを連れてくるわ今日も
// @name:ja			[Twitter]WebhookがTweetを連れてくるわ今日も
// @name:en			Webhook brings tweets to Discord.
// @name:zh-CN			Webhook brings tweets to Discord.
// @name:ko			Webhook brings tweets to Discord.
// @namespace		https://greasyfork.org/ja/users/1023652
// @version			1145141919810.0.19
// @description		ツイートをTwitterからDiscordにウェブフックでポストします。
// @description:ja			ツイートをTwitterからDiscordにウェブフックでポストします。
// @description:en			Post tweets from Twitter to Discord using webhooks.
// @description:zh-cn			使用webhooks将Twitter的推文发送到Discord。
// @description:ko			웹훅을 사용하여 Twitter의 트윗을 Discord에 게시합니다.
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @connect			discord.com
// @connect			api.twitter.com
// @connect			api.fanbox.cc
// @connect			skeb.jp
// @connect			fantia.jp
// @connect			booth.pm
// @connect			linktr.ee
// @connect			profcard.info
// @connect			lit.link
// @connect			potofu.me
// @connect			creatorlink.net
// @connect			lab.syncer.jp
// @connect			carrd.co
// @connect			sketch.pixiv.net
// @connect			tumblr.com
// @connect			html.co.jp
// @connect			twpf.jp
// @connect			pbs.twimg.com
// @connect			abs.twimg.com
// @icon			data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @grant			GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/472511/%5BTwitter%5DWebhook%E3%81%8CTweet%E3%82%92%E9%80%A3%E3%82%8C%E3%81%A6%E3%81%8F%E3%82%8B%E3%82%8F%E4%BB%8A%E6%97%A5%E3%82%82.user.js
// @updateURL https://update.greasyfork.org/scripts/472511/%5BTwitter%5DWebhook%E3%81%8CTweet%E3%82%92%E9%80%A3%E3%82%8C%E3%81%A6%E3%81%8F%E3%82%8B%E3%82%8F%E4%BB%8A%E6%97%A5%E3%82%82.meta.js
// ==/UserScript==

(function(){
	'use strict';
	const desktop_env = {'tweet_field': 'article[data-testid="tweet"]','retweeted': '[data-testid="socialContext"]','liked_color': 'r-vkub15','liked':'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'};
	const mobile_env = {'tweet_field': 'article[data-testid="tweet"]','retweeted': '[data-testid="socialContext"]','liked_color': 'r-vkub15','liked':'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z'};
	let storedSettings = JSON.parse(localStorage.getItem('webhook_brings_tweets_to_discord') || '{}');
	let script_settings = {
		"displayMethod": storedSettings.displayMethod || 'method1',
		"lang": storedSettings.lang || GetCookie("lang") || 'en',
		"defaultWebhook": storedSettings.defaultWebhook,
		"webHooks": (function(data){
				let webhooks = {};
				if(data && Array.isArray(data)){
					data.forEach(item => {
						if(item.name && item.value){
							webhooks[item.name] = item.value;
						}
					});
				}
				return webhooks;
			})(storedSettings.data)
	};
	const timeZoneObject = Intl.DateTimeFormat().resolvedOptions();
	let Text = {};
	Text.ja = {
		"various_links": "各種リンク",
		"link_to_tweet": "ツイートへ",
		"link_to_image": "画像へのリンク",
		"engagement": "エンゲージメント",
		"likes": "いいね",
		"retweets": "リツイート",
		"units": "万",
		"roundingScale": 10000,
		"decimalPlaces": 2,
		"postedDate": "投稿日時",
		"quotedTweet": "↓♻️引用元♻️↓",
		"submit": "送信",
		"close": "閉じる",
		"display_everywhere": "どこでも表示する",
		"tweet_details_only": "詳細表示したときだけ",
		"when_webhook_name_duplicate": "Webhookの名前が重複しています。",
		"cancel": "キャンセル",
		"save_settings": "設定を保存",
		"display_method": "表示方法",
		"default": "デフォルトの",
		"language": "Language",
		"webhook_not_set": "ウェブフックが設定されていません。",
		"when_webhook_url_invalid": "正しいDiscordのWebhookのURLではありません。",
		"when_post_failed": "以下のURLのポストに失敗しました。",
	};

	Text.en = {
		"various_links": "Various Links",
		"link_to_tweet": "To Tweet",
		"link_to_image": "Link to Image",
		"engagement": "Engagement",
		"likes": "Likes",
		"retweets": "Retweets",
		"units": "k",
		"roundingScale": 1000,
		"decimalPlaces": 1,
		"postedDate": "Posted Date",
		"quotedTweet": "↓♻️Quoted Tweet♻️↓",
		"submit": "submit",
		"close": "close",
		"display_everywhere": "Display everywhere",
		"tweet_details_only": "Tweet Details Only",
		"when_webhook_name_duplicate": "Duplicate webhook name.",
		"cancel": "Cancel",
		"save_settings": "saveSettings",
		"display_method": "Display Method",
		"default": "default",
		"language": "Language",
		"webhook_not_set": "Webhook is not set.",
		"when_webhook_url_invalid": "It is not a valid Discord Webhook URL.",
		"when_post_failed": "Failed to post the following URL.",
	};
	Text.ko = {
		"various_links": "다양한 링크",
		"link_to_tweet": "트윗으로",
		"link_to_image": "이미지 링크",
		"engagement": "참여",
		"likes": "좋아요",
		"retweets": "리트윗",
		"units": "k",
		"roundingScale": 1000,
		"decimalPlaces": 1,
		"postedDate": "게시 날짜",
		"quotedTweet": "↓♻️인용 트윗♻️↓",
		"submit": "제출",
		"close": "닫기",
		"display_everywhere": "어디서나 표시",
		"tweet_details_only": "트윗 세부 정보만",
		"when_webhook_name_duplicate": "웹훅 이름이 중복됩니다.",
		"cancel": "취소",
		"save_settings": "설정 저장",
		"display_method": "표시 방법",
		"default": "기본",
		"language": "Language",
		"webhook_not_set": "웹훅이 설정되지 않았습니다.",
		"when_webhook_url_invalid": "유효한 Discord Webhook URL이 아닙니다.",
		"when_post_failed": "다음 URL 게시에 실패했습니다.",
	};

	Text["zh-CN"] = {
		"various_links": "各种链接",
		"link_to_tweet": "到推文",
		"link_to_image": "图片链接",
		"engagement": "参与度",
		"likes": "点赞",
		"retweets": "转推",
		"units": "k",
		"roundingScale": 1000,
		"decimalPlaces": 1,
		"postedDate": "发布日期",
		"quotedTweet": "↓♻️引用推文♻️↓",
		"submit": "提交",
		"close": "关闭",
		"display_everywhere": "随处显示",
		"tweet_details_only": "仅推文详情",
		"when_webhook_name_duplicate": "Webhook名称重复。",
		"cancel": "取消",
		"save_settings": "保存设置",
		"display_method": "显示方法",
		"default": "默认",
		"language": "Language",
		"webhook_not_set": "Webhook未设置。",
		"when_webhook_url_invalid": "这不是有效的Discord Webhook URL.",
		"when_post_failed": "以下URL发布失败。",
	};
	let env_Text = Text[script_settings.lang] || Text.en;
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
			if(element.querySelector(".quickDimg")) return;
			let tweet_link = Array.from(element.querySelectorAll("a[aria-label]")).filter(function(tmp){return tmp.href.match(/\/status\/[0-9]*(\/analytics)?$/)})[0].href.replace(/\/analytics$/,'');
			let fotter = element.querySelector('div[id][role="group"]');
			const flexContainer = document.createElement('div');
			flexContainer.classList.add('quickDimg');
			flexContainer.style.display = 'flex';

			// 1つ目のドロップダウン（サーバー選択）
			const dropdown_select_server = document.createElement('select');
			for(const server in script_settings.webHooks){
				const option = document.createElement('option');
				option.value = script_settings.webHooks[server];
				option.textContent = server;
				if(server == script_settings.defaultWebhook){
					option.selected = true;
				}
				dropdown_select_server.appendChild(option);
			}
			flexContainer.appendChild(dropdown_select_server);
			dropdown_select_server.addEventListener('click', (event) => {
				event.stopPropagation();
			});

			const dropdown_send_image = document.createElement('select');
			for(let i = 1; i <= 5; i++){
				const option = document.createElement('option');
				option.value = i;
				option.textContent = i;
				if(i === 5){
					option.selected = true;
				}
				dropdown_send_image.appendChild(option);
			}
			flexContainer.appendChild(dropdown_send_image);

			dropdown_send_image.addEventListener('click', (event) => {
				event.stopPropagation();
			});
			const dropdown_post_quote = document.createElement('select');
			['false','true'].forEach(value => {
				const option = document.createElement('option');
				option.value = value;
				option.textContent = value;
				dropdown_post_quote.appendChild(option);
			});
			flexContainer.appendChild(dropdown_post_quote);

			dropdown_post_quote.addEventListener('click', (event) => {
				event.stopPropagation();
			});

			const dropdown_use_graphql = document.createElement('select');
			['false','true'].forEach(value => {
				const option = document.createElement('option');
				option.value = value;
				option.textContent = value;
				dropdown_use_graphql.appendChild(option);
			});
			flexContainer.appendChild(dropdown_use_graphql);

			dropdown_use_graphql.addEventListener('click', (event) => {
				event.stopPropagation();
			});
			// ボタンを作成
			const button = document.createElement('button');
			button.textContent = env_Text.submit;
			flexContainer.appendChild(button);

			dropdown_select_server.addEventListener('change', () => {
				button.disabled = false;
			});
			dropdown_send_image.addEventListener('change', () => {
				button.disabled = false;
			});
			dropdown_post_quote.addEventListener('change', () => {
				button.disabled = false;
			});
			dropdown_use_graphql.addEventListener('change', () => {
				button.disabled = false;
			});

			// ボタンのクリックイベントを監視
			button.addEventListener('click',async function(){
				// ここでドロップダウンの選択値に基づいて処理を行う
				this.disabled = true;
				const selectedServer = dropdown_select_server.value;
				const selectedNumber = dropdown_send_image.value;
				const send_post_tweet = dropdown_post_quote.value === 'true';
				const useGraphql = dropdown_use_graphql.value === 'true';
				if(!selectedServer){
					customAlert(env_Text.webhook_not_set);
					return;
				}
				let send_page;
				if(selectedNumber != 5){
					send_page = [selectedNumber-1]
				}else{
					send_page = [0,1,2,3]
				}
				const body = await make_send_data(tweet_link,send_page,send_post_tweet,useGraphql);
				await sleep(300)
				for(let target in body){
					let formData = new FormData();
					let payload = {};
					let tmp = body[target];
					if(tmp.embeds){
						payload.embeds = tmp.embeds;
					}
					if(tmp.content){
						payload.content = tmp.content;
					}
					formData.append('payload_json', JSON.stringify(payload));
					//console.log(formData)
					if(tmp.files){
						tmp.files.forEach((file, index) => {
							formData.append(`file${index}`, file.attachment, file.name);
						});
					}
					try{
						let res = await request(new sendObject(selectedServer,formData));
						if(res.statusText == "Bad Request"){
							customAlert(`${env_Text.when_post_failed}`,payload.embeds[0].url);
						}
					}catch(error){
						customAlert(`${env_Text.when_post_failed}`,payload.embeds[0].url);
						console.log(error);
					}
					//console.log(res)
					await sleep(1000)
				}
			});
			fotter.parentNode.appendChild(flexContainer);
		});
	}
	async function make_send_data(tweet_link,select_pages = [1],send_quoted_tweet,use_graphQL){
		const tweet_id = tweet_link.match(/https?:\/\/twitter\.com\/\w+\/status\/(\d+)/)[1];
		let tweet_data,return_object;
		try{
			tweet_data = await get_Tweet_data();
			return_object = await make_embeds();
		}catch(error){
			customAlert(`${env_Text.when_post_failed}`,tweet_link);
			console.error(error);
		}
		if(send_quoted_tweet && return_object[return_object.length - 1].quoted_tweet_data){
			tweet_data = return_object.pop().quoted_tweet_data;
			return_object = return_object.concat([{content: env_Text.quotedTweet}],await make_embeds(1));
		}
		return return_object;
		async function make_embeds(quoted_tweet_mode = 0){
			let embeds = [];
			let tmpEmbed = {};
			let tmp_return_object = [];
			var twitter_user_data = {};
			var twitter_tweet_data = {};
			var tweet_user_data_json = {};
			var tweet_tweet_data_json = {};
			switch(tweet_data.APIsource){
				case "graphql":
					tweet_user_data_json = tweet_data.result.core?.user_results.result || tweet_data.result.tweet.core.user_results.result;
					tweet_tweet_data_json = tweet_data.result.legacy || tweet_data.result.tweet.legacy;
					twitter_user_data.ID = tweet_user_data_json.rest_id;
					twitter_user_data.screen_name = tweet_user_data_json.legacy.screen_name;
					twitter_user_data.name = tweet_user_data_json.legacy.name;
					twitter_user_data.profile_image = tweet_user_data_json.legacy.profile_image_url_https.replace('_normal.','.');;
					twitter_user_data.urls = tweet_user_data_json.legacy.entities;
					twitter_tweet_data.hashtags = get_only_particular_key_value(tweet_tweet_data_json.entities,"hashtags",[]);
					twitter_tweet_data.user_mentions = get_only_particular_key_value(tweet_tweet_data_json.entities,"user_mentions",[]);
					twitter_tweet_data.symbols = get_only_particular_key_value(tweet_tweet_data_json.entities,"symbols",[]);
					break;
				case "1_1":
					tweet_user_data_json = tweet_data.user;
					tweet_tweet_data_json = tweet_data;
					twitter_user_data.ID = tweet_user_data_json.id_str;
					twitter_user_data.screen_name = tweet_user_data_json.screen_name;
					twitter_user_data.name = tweet_user_data_json.name;
					twitter_user_data.profile_image = tweet_user_data_json.profile_image_url_https.replace('_normal.','.');;
					twitter_user_data.urls = tweet_user_data_json.entities;
					twitter_tweet_data.hashtags = get_only_particular_key_value(tweet_tweet_data_json.entities,"hashtags",[]);
					twitter_tweet_data.user_mentions = get_only_particular_key_value(tweet_tweet_data_json.entities,"user_mentions",[]);
					twitter_tweet_data.symbols = get_only_particular_key_value(tweet_tweet_data_json.entities,"symbols",[]);
					break;
			}
			try{
				twitter_user_data.pixiv_url = await find_pixiv_link(twitter_user_data.urls);
			}catch(error){
				console.log("pixivのURLの取得に失敗しました。");
				throw(error);
			}
			twitter_tweet_data.full_text = replace_null_to_something(tweet_tweet_data_json.full_text);
			twitter_tweet_data.extended_entities = tweet_tweet_data_json.extended_entities;
			twitter_tweet_data.retweet_count = tweet_tweet_data_json.retweet_count;
			twitter_tweet_data.favorite_count = tweet_tweet_data_json.favorite_count;
			twitter_tweet_data.id = tweet_tweet_data_json.id_str;
			twitter_tweet_data.created_at = new Date(tweet_tweet_data_json.created_at).toLocaleString(timeZoneObject.locale, { timeZone: timeZoneObject.timeZone });
			twitter_tweet_data.urls = tweet_tweet_data_json.entities.urls;
			twitter_tweet_data.media = make_media_list(twitter_tweet_data.extended_entities,select_pages);
			try{
				//文が長すぎるとエラーになるので一定の長さで切る。
				//普通のツイートではそんなことありえないが、Blueでは長いツイートが可能なのでそれに対応している。
				if(tweet_data.APIsource == "graphql"){
					let note_tweet = tweet_data.result.note_tweet?.note_tweet_results.result||tweet_data.result.tweet.note_tweet.note_tweet_results.result;
					twitter_tweet_data.full_text = note_tweet.text;
					twitter_tweet_data.urls = note_tweet.entity_set.urls;
					twitter_tweet_data.hashtags = get_only_particular_key_value(note_tweet.entity_set,"hashtags",[]);
					twitter_tweet_data.user_mentions = get_only_particular_key_value(note_tweet.entity_set,"user_mentions",[]);
					twitter_tweet_data.symbols = get_only_particular_key_value(note_tweet.entity_set,"symbols",[]);
				}
			}catch{}
			//console.log(twitter_tweet_data.full_text)
			// hashtags, mentions, symbolsを一つの配列に結合
			let combined = [].concat(
				twitter_tweet_data.hashtags.map(tag => ({
					type: 'hashtag',
					indices: tag.indices,
					text: tag.text
				})),
				twitter_tweet_data.user_mentions.map(mention => ({
					type: 'mention',
					indices: mention.indices,
					text: mention.screen_name
				})),
				twitter_tweet_data.symbols.map(symbol => ({
					type: 'symbol',
					indices: symbol.indices,
					text: symbol.text
				}))
			);


			// combinedをindicesの順にソート
			combined.sort((a, b) => b.indices[0] - a.indices[0]);
			let transformedText = twitter_tweet_data.full_text;
			function countSurrogatePairs(str){
				return Array.from(str).filter(char => char.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)).length;
			}
			const currentTimeMillis = new Date().getTime();
			const linkTextStart = `linkTextStart${currentTimeMillis}`;
			const linkTextEnd = `linkTextEnd${currentTimeMillis}`;
			const linkUrlStart = `linkUrlStart${currentTimeMillis}`;
			const linkUrlEnd = `linkUrlEnd${currentTimeMillis}`;
			const hashtag = `hashtag${currentTimeMillis}`
			combined.forEach(item => {
				let start = item.indices[0];
				let end = item.indices[1];

				// サロゲートペアの数をカウントして調整
				const adjustment = countSurrogatePairs(transformedText.slice(0, end));
				start += adjustment;
				end += adjustment;

				let replacement = '';
				switch(item.type){
					case 'hashtag':
						replacement = `${linkTextStart}${hashtag}${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/hashtag/${item.text}${linkUrlEnd}`;
						break;
					case 'mention':
						replacement = `${linkTextStart}@${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/${item.text}${linkUrlEnd}`;
						break;
					case 'symbol':
						replacement = `${linkTextStart}$${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/search?q=%24${item.text}&src=cashtag_click${linkUrlEnd}`;
						break;
				}
				transformedText = transformedText.slice(0, start) + replacement + transformedText.slice(end);
			});
			twitter_tweet_data.full_text = str_max_length(transformedText,7000);
			//マークダウンにならないでほしいやつのエスケープ
			let escapeCharacters = ['|', '*', '_', '`', '~', '[', ']', '(', ')', '>', '#', '-'];
			escapeCharacters.forEach(char => {
				let regExp = new RegExp('\\' + char, 'g');
				twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(regExp, '\\' + char);
			});
			//マークダウンになって欲しいやつは戻す
			twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(new RegExp(linkTextStart, 'g'), '[');
			twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(new RegExp(linkTextEnd, 'g'), ']');
			twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(new RegExp(linkUrlStart, 'g'), '(');
			twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(new RegExp(linkUrlEnd, 'g'), ')');
			twitter_tweet_data.full_text = twitter_tweet_data.full_text.replace(new RegExp(hashtag, 'g'), '#');
			try{
				//複数メディアをつけるオプションのときに動画があるとうまくいかないので。
				if(select_pages.length > 1 && ! twitter_tweet_data.media.every(v => v.media_type == "photo")){
					twitter_tweet_data.media = [twitter_tweet_data.media[0]];
				}
			}catch{}

			let tweet_url;
			if(!quoted_tweet_mode == 1){
				tweet_url = tweet_link;
			}else{
				tweet_url = `https://twitter.com/${twitter_user_data.screen_name}/status/${twitter_tweet_data.id}`;
			}
			tmpEmbed.color = 1940464;
			tmpEmbed.title = "Tweet";
			tmpEmbed.url = tweet_url;
			tmpEmbed.author = {
				"name": `${twitter_user_data.name} (@${twitter_user_data.screen_name})`,
				"url": `https://twitter.com/${twitter_user_data.screen_name}`,
				"icon_url": `attachment://${twitter_user_data.profile_image.split('/').pop().replace(/^_*/,'')}`
			};
			tmpEmbed.description = replace_t_co_to_original_url(twitter_tweet_data.full_text,twitter_tweet_data.urls,twitter_tweet_data.media);
			tmpEmbed.thumbnail = {"url": "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg"};
			tmpEmbed.fields = [
				{
					"name": `${env_Text.various_links}:link:`,
					"value": `[${env_Text.link_to_tweet}](${tweet_url})` + `\n[TwitterID: ${twitter_user_data.ID}](https://twitter.com/intent/user?user_id=${twitter_user_data.ID})` + if_exsit_return_text(twitter_tweet_data.media[0]?.url,`\n[${env_Text.link_to_image}](${image_url_to_original(twitter_tweet_data.media[0]?.url)})`) + if_exsit_return_text(twitter_user_data.pixiv_url,`\n[Pixiv](${twitter_user_data.pixiv_url})`)
				},{
					"name": env_Text.engagement,
					"value": `${env_Text.retweets} ${round_half_up(twitter_tweet_data.retweet_count,env_Text.roundingScale,env_Text.decimalPlaces,env_Text.units)}:recycle:	${env_Text.likes} ${round_half_up(twitter_tweet_data.favorite_count,env_Text.roundingScale,env_Text.decimalPlaces,env_Text.units)}:heart:`
				},{
					"name": env_Text.postedDate,
					"value": twitter_tweet_data.created_at
				}
			];
			if(twitter_tweet_data.media[0]?.url){
				tmpEmbed.image = {
					"url": `attachment://${twitter_tweet_data.media[0].url.split('/').pop()}`
				}
			}
			embeds.push(tmpEmbed);
			if(twitter_tweet_data.media[1]?.url){
				for(let i=1;i<twitter_tweet_data.media.length;i++){
					embeds[i] = {
						"url": tweet_url,
						"image": {
							"url": `attachment://${twitter_tweet_data.media[i].url.split('/').pop()}`,
						}
					}
				}
			}
			tmp_return_object.push({"embeds": embeds, "files": await fetchImages(twitter_tweet_data.media.concat([{"url": twitter_user_data.profile_image}]))});
			if(twitter_tweet_data.media[0]?.media_type.match(/(video|animated_gif)/)){
				tmp_return_object.push({"content": twitter_tweet_data.media[0].video_url});
			}
			if(send_quoted_tweet && quoted_tweet_mode == 0 && (tweet_tweet_data_json.result?.quoted_status_result||tweet_tweet_data_json.quoted_status)){
				let tmp_quoted_data = tweet_tweet_data_json.result?.quoted_status_result||tweet_tweet_data_json.quoted_status;
				tmp_quoted_data.APIsource = tweet_data.APIsource;
				tmp_return_object.push({"quoted_tweet_data": tmp_quoted_data});
			}
			return tmp_return_object;
		}
		async function get_Tweet_data(){
			let response;
			if(use_graphQL){
				response = (await request(new requestObject_twitter_graphQL(tweet_id),3)).response.data.threaded_conversation_with_injections_v2.instructions[0];
				response = response.entries[response.entries.findIndex((tmp) => tmp.entryId == `tweet-${tweet_id}`)].content.itemContent.tweet_results;
				response.APIsource = 'graphql';
			}else{
				response = await request(new requestObject_twitter_1_1(tweet_id),3);
				response = response.response[0];
				response.APIsource = '1_1';
			}
			return response;
		}
	}

	async function find_pixiv_link(urls){
		const Pixiv_url_regex = /^https?:\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u)\/)[0-9]*)|me\/.*))/;
		const Fanbox_url_regex = /^https?:(\/\/www\.pixiv\.net\/fanbox\/creator\/[0-9]*|\/\/.*\.fanbox\.cc\/?)/;
		return new Promise(async function(resolve){
			const urls_in_description = get_only_particular_key_value(urls,'description.urls.url',[]);
			const urls_in_description_expanded = get_only_particular_key_value(urls,'description.urls.expanded_url',[]);
			const urls_in_url_place = get_only_particular_key_value(urls,'url.urls.url',[]);
			const urls_in_url_place_expanded = get_only_particular_key_value(urls,'url.urls.expanded_url',[]);
			var tmp_urls = urls_in_description.concat(urls_in_description_expanded,urls_in_url_place,urls_in_url_place_expanded).filter(item => !/^https?:\/\/t\.co\//.test(item));
			var Pixiv_url;
			if(tmp_urls.length > 0){
				Pixiv_url = await find_pixiv_link_from_profile_urls(tmp_urls);
				if(Pixiv_url === undefined || Pixiv_url === null || Pixiv_url === false){
					tmp_urls = await expand_shortening_link(tmp_urls);
					Pixiv_url = await find_pixiv_link_from_profile_urls(tmp_urls);
					return resolve(Pixiv_url);
				}else{
					return resolve(Pixiv_url);
				}
			}
			return resolve(null);
		});
		async function expand_shortening_link(urls_in_profile){
			return new Promise(async function(resolve){
				var return_urls = [];
				if(urls_in_profile.length == 0 || urls_in_profile.length === null || urls_in_profile.length === undefined) return ;
				var promise_list = [];
				urls_in_profile.forEach(target=>{
					switch(true){
						case /^https?:\/\/bit\.ly\/[\w]{1,9}$/.test(target):
							promise_list.push(request(new requestObject('https://lab.syncer.jp/api/32/' + target)));
							break;
						default:
							break;
					}
				});
				await Promise.allSettled(promise_list).then(results => {
					const res_tmp = get_only_particular_key_value(results, 'value.response', undefined);
					var tmp;
					for(let i=0;i<res_tmp.length;i++){
						tmp = JSON.parse(res_tmp[i]).pop();
						tmp = tmp.pop();
						return_urls[i] = tmp[0];
					}
				});
				resolve(return_urls);
			});
		}
		async function find_pixiv_link_from_profile_urls(urls_in_profile){
			return new Promise(async function(resolve,reject){
				var tmp_pixiv_url;
				tmp_pixiv_url = findMatch_from_array(urls_in_profile,Pixiv_url_regex,true);
				if (tmp_pixiv_url !== undefined) return resolve(tmp_pixiv_url);
				if(findMatch_from_array(urls_in_profile,Fanbox_url_regex) !== undefined){
					tmp_pixiv_url = await when_fanbox(findMatch_from_array(urls_in_profile,Fanbox_url_regex,true));
					if(Pixiv_url_regex.test(tmp_pixiv_url)){
						return resolve(tmp_pixiv_url);
					}
				}else{
					var get_url_promise_list = [];
					urls_in_profile.forEach(target=>{
						switch(true){
							case /^https?:\/\/((skeb\.jp\/\@.*)|(fantia\.jp\/(fanclubs\/[0-9])?.*)|(.*\.booth\.pm)|(.*linktr\.ee)|(.*profcard\.info)|(.*lit\.link)|(potofu\.me)|(.*\.carrd\.co)|(.*\.tumblr\.com$)|(twpf\.jp))\/?/.test(target):
								get_url_promise_list.push(new Promise(
									async function(resolve,reject){
										try{
											return resolve(await when_general(target));
										}catch(error){
											return reject(error);
										}
									}
								));
								break;
							case /^https?:\/\/.*\.creatorlink\.net(\/.*)?/.test(target):
								get_url_promise_list.push(new Promise(
									async function(resolve,reject){
										try{
											return resolve(await when_general(`${target.match(/^https?:\/\/.*\.creatorlink\.net/)[0]}\/Contact`));
										}catch(error){
											return reject(error);
										}
									}
								));
								break;
							case /^https?:\/\/sketch\.pixiv\.net\//.test(target):
								get_url_promise_list.push(new Promise(
									async function(resolve,reject){
										try{
											return resolve(await when_pixiv_sketch(target));
										}catch(error){
											return reject(error);
										}
									}
								));
								break;
							default:
								break;
						}
					});
					if(get_url_promise_list.length > 0){
						await Promise.any(get_url_promise_list).then((value) => {tmp_pixiv_url = value}).catch(() => {tmp_pixiv_url = undefined});
						if(!Pixiv_url_regex.test(tmp_pixiv_url)) return resolve(undefined);
						return resolve(tmp_pixiv_url.replace(/^https?/,'https').replace(/(\/|\\)$/,''));
					}
				}
				return resolve(null);
				async function when_general(target_url){
					return new Promise(async function(resolve,reject){
						const response_data = await request(new requestObject(target_url.replace(/^https?/,"https")));
						var response_data_urls = response_data.response.split(/\"|\<|\>/).filter(function(data_str){return data_str.match(/^https?:(\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u|fanbox\/creator)\/)[0-9].*)|me\/.*))|.*\.fanbox\.cc\/?)$/)});
						if(response_data_urls.find(function(element){return element.match(Pixiv_url_regex)}) !== undefined){
							return resolve(response_data_urls.find(function(element){return element.match(Pixiv_url_regex)}));
						}else if(response_data_urls.find(function(element){return element.match(Fanbox_url_regex)}) !== undefined){
							return resolve(when_fanbox(response_data_urls.find(function(element){return element.match(Fanbox_url_regex)})));
						}else{
							return reject(undefined);
						}
					});
				}
				async function when_pixiv_sketch(target_url){
						return new Promise(async function(resolve,reject){
							const response_data = await request(new requestObject(target_url));
							var User_id = response_data.response.split(',').filter(function(data_str){return data_str.match(/\\"pixiv_user_id\\":\\"[0-9]*\\"/)});
							if(User_id){
								return resolve("https://www.pixiv.net/users/" + User_id[0].split(/\"|\\/)[6]);
							}else{
								return reject(undefined);
							}
						});
					}
				async function when_fanbox(fanbox_url){
					if(fanbox_url.match(/^https?:\/\/www\.pixiv\.net\/fanbox\/creator\/[0-9]*/)){
						return fanbox_url.replace('fanbox/creator', 'users');
					}else{
						const fanbox_response = await request(new requestObject_fanbox(`https://api.fanbox.cc/creator.get?creatorId=${fanbox_url.replace(/(https?:\/\/|\.fanbox.*)/g,'')}`,fanbox_url.replace(/^http:/, 'https:').replace(/\/$/, '')));
						if(fanbox_response.status == "404") return undefined;
						tmp_pixiv_url = findMatch_from_array(fanbox_response.response.body.profileLinks,Pixiv_url_regex,true);
						if(tmp_pixiv_url !== undefined){
							return tmp_pixiv_url;
						}else{
							return `https://www.pixiv.net/users/${fanbox_response.response.body.user.userId}`;
						}
					}
				}
			}
		)}
	}
	function get_only_particular_key_value(object, path, defaultValue = undefined){
		//オブジェクトから任意のpathの値を取得する。
		//オブジェクト内に配列がある場合などに便利。
		/*
			{
				a: "1",
				b: [
					{hoge: "2"},
					{hoge: "3"}
				]
			}
			こんな感じになってるときに
			get_only_particular_key_value(object, "b.hoge")
			とやると
			>>[2,3]
			って帰ってくる。
			get_only_particular_key_value(object, "a")
			なら
			>> 1
			って帰ってくる。
		*/
		var isArray = Array.isArray;
		if(object == null || typeof object != 'object') return defaultValue;
		return (isArray(object)) ? object.map(createProcessFunction(path)) : createProcessFunction(path)(object);
		function createProcessFunction(path){
			if(typeof path == 'string') path = path.split('.');
			if(!isArray(path)) path = [path];
			return function(object){
				var index = 0,
					length = path.length;
				while(index < length){
					const key = toString_(path[index++]);
					if(object === undefined){
						return defaultValue;
					}
					// 配列に対する処理
					if(isArray(object)){
						object = object.map(item => item[key]);
					}else{
						object = object[key];
					}
				}
				return (index && index == length) ? object : void 0;
			};
		}
		function toString_(value){
			if(value == null) return '';
			if(typeof value == 'string') return value;
			if(isArray(value)) return value.map(toString) + '';
			var result = value + '';
			return '0' == result && 1 / value == -(1 / 0) ? '-0' : result;
		}
	}
	function findMatch_from_array(arr, regex, is_strict = false){
		//配列に正規表現にマッチするテキストがあるかを調べる。
		//「is_strict」が「true」ならマッチした部分だけど返す。
		for(let i = 0; i < arr.length; i++){
			if(regex.test(arr[i])){
				if(is_strict === true){
					return arr[i].match(regex)[0];
				}else{
					return arr[i];
				}
			}
		}
		return undefined;
	}
	function if_exsit_return_text(variable,return_text){
		if(!(variable === null || variable === undefined || variable === "")){
			return return_text
		}
		return "";
	}
	function image_url_to_original(image_url){
		//apiから帰ってくるURLをそのまま開くと小さい画像になってしまうので最大サイズの画像をダウンロードできるようにする。
		if(typeof image_url !== "undefined"){
			var extension = image_url.split(".").pop();
			return `${image_url.replace(`.${extension}`,"")}?format=${extension}&name=orig`
		}
	}
	function replace_t_co_to_original_url(full_text,urls,media_urls){
		//ツイート内のt.coで短縮されたリンクをもとにのリンクにもどす。
		try{
			if(typeof full_text !== "undefined"){
				/*
				full_text = full_text.replace(/\&amp\;/g,'&');
				full_text = full_text.replace(/\&gt\;/g,'\\>');
				full_text = full_text.replace(/\&lt\;/g,'\\<');
				*/
				full_text = decodeHtml(full_text);
				if(typeof urls !== "undefined"){
					for(let i=0;i<=urls.length-1;i++){
						if(urls[i].expanded_url.length > 200){
							full_text = full_text.replace(urls[i].url,`[${decodeURI(urls[i].expanded_url).slice(0,150)}](${decodeURI(urls[i].expanded_url)}) ... `);
						}else{
							full_text = full_text.replace(urls[i].url,decodeURI(urls[i].expanded_url));
						}
					}
				}
				//メディアがくっついてるツイートは末尾にメディアのURLが付随しているためそれを消す。
				if(typeof media_urls !== "undefined"){
					for(let i=0;i<=media_urls.length-1;i++){
						full_text = full_text.replace(media_urls[i].tco_url,"");
					}
				}
			}
		}catch{}
		return full_text;
	}
	function make_media_list(extended_entities,select_pages){
		var tmp_arr = [];
		var tmp_object = {};
		if(typeof extended_entities !== "undefined"){
			var j = 0;
			for(const target in select_pages){
				try{
					if(extended_entities.media.length > select_pages[target]){
						tmp_object = {};
						tmp_object.media_type = extended_entities.media[select_pages[target]].type;
						tmp_object.tco_url = extended_entities.media[select_pages[target]].url
						if(tmp_object.media_type == "animated_gif" || tmp_object.media_type == "video"){
							//動画はTwitterのサーバー上に複数の解像度のものがあるためその中で最も大きいものを選択する。
							tmp_object.video_url = extended_entities.media[select_pages[target]].video_info.variants.filter(function(obj){return obj.content_type == "video/mp4"}).reduce((a, b) => a.bitrate > b.bitrate ? a:b).url.split('?')[0];
						}else if(tmp_object.media_type == "photo"){
							tmp_object.url = extended_entities.media[select_pages[target]].media_url_https;
						}
						tmp_arr[j] = tmp_object;
						j++;
					}
				}catch{}
			}
			return tmp_arr;
		}
		return [];
	}
	function str_max_length(text, max_length,defaultValue = "……以下Discordの字数オーバー。"){
		var r = 0;
		for(var i = 0; i < text.length; i++){
			var c = text.charCodeAt(i);
			if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
				r += 1;
			}else{
				r += 2;
			}
			if(r >= max_length){
				text = `${text.slice(0, i - 1)} ${defaultValue}`;
				break;
			}
		}
		return text;
	}
	function round_half_up(original_value,where_round_off,decimal_place = 0,unit_str = ""){
		//四捨五入関数。
		/*
		original_valu: 元の値
		where_round_off: どこで四捨五入するか(0.1, 1, 10, 100, 1000など)
		decimal_place: 小数点以下を何桁にするか(1, 2, 3, 4, 5など)
		unit_str: 単位を末尾につける(千,万など)
		*/
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
	function replace_null_to_something(input_character,replace_character = " "){
		if(input_character === null || input_character === undefined || input_character === ""){
			return replace_character;
		}else{
			return input_character;
		}
	}
	async function sleep(time){
		return new Promise((resolve)=>{
			setTimeout(()=>{return resolve(time)}, time);
		});
	}
	async function fetchImages(mediaUrlArray){
		if(mediaUrlArray?.length == 0) return;
		let downloadPromises = mediaUrlArray.map(fetchImage);
		return remove_null_from_array(await Promise.all(downloadPromises));
		async function fetchImage(target) {
			let retryCount = 5; // リトライ回数を設定
			while(retryCount > 0){
				if(!target.url) return;
				let image;
				let name;
				if(target.url.match(/https?:\/\/pbs\.twimg\.com\/media\//)){
					image = await request(new requestObject_binary_data(image_url_to_original(target.url)),3);
					name = target.url.split('/').pop();
				}else{
					image = await request(new requestObject_binary_data(target.url),3);
					name = target.url.split('/').pop().replace(/^_*/, '');
				}

				// ダウンロードした画像データのサイズを確認
				if(image.response.size > 1024){
					return {
						"attachment": image.response,
						"name": name,
					};
				}else{
					retryCount--;
				}
			}
			console.warn(`Failed to download image after multiple retries: ${target.url}`);
			return null;
		}
	}
	function remove_null_from_array(arr){
		return arr.filter(function(x){return !(x === null || x === undefined || x === "")});
	}
	function openSettings(){
		let html = `
		<div style="padding: 20px;">
			<h2>Webhook</h2>
			<div id="webhooks">
				<!-- ここにWebhookの設定行が動的に追加されます -->
			</div>
			<button id="addWebhook">+</button>

			<h2>${env_Text.default}Webhook</h2>
			<select id="defaultWebhook"></select>

			<h2>${env_Text.display_method}</h2>
			<select id="displayMethod">
				<option value="method1">${env_Text.display_everywhere}</option>
				<option value="method2">${env_Text.tweet_details_only}</option>
			</select>

			<h2>${env_Text.language}</h2>
			<select id="languageSelect">
				${Object.keys(Text).map(lang_ => `<option value="${lang_}" ${lang_ === script_settings.lang ? 'selected' : ''}>${lang_}</option>`).join('')}
			</select>
			<br><br>
			<br><br>
			<div style="display: flex; justify-content: space-between; width: 200px;">
				<button id="saveSettings">${env_Text.save_settings}</button>
				<button id="cancelSettings">${env_Text.cancel}</button>
			</div>
		</div>
		`;
		let div = document.createElement('div');
		div.innerHTML = html;
		div.style.position = 'fixed'; // 画面上の固定位置に配置
		div.style.top = '50%'; // 画面の上から50%の位置
		div.style.left = '50%'; // 画面の左から50%の位置
		div.style.transform = 'translate(-50%, -50%)'; // 要素の中心を基準に位置を調整
		div.style.zIndex = '9999'; // 最前面に表示
		div.style.backgroundColor = 'white'; // 背景色を白に設定
		div.style.border = '1px solid black'; // 枠線を追加
		div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // 影を追加
		div.style.maxHeight = '80vh'; // 画面の高さの80%を最大高さとして設定
		div.style.overflowY = 'auto'; // 必要に応じて垂直スクロールバーを表示
		document.body.appendChild(div);

		let closeBtn = document.createElement('button');
		closeBtn.innerHTML = '☓';
		closeBtn.style.position = 'absolute';
		closeBtn.style.top = '10px';
		closeBtn.style.right = '10px';
		closeBtn.addEventListener('click', () => {
			div.remove();
		});
		div.appendChild(closeBtn);

		document.getElementById('cancelSettings').addEventListener('click', () => {
			div.remove();
		});

		function addWebhookRow(name = '', url = ''){
			let row = document.createElement('div');
			row.innerHTML = `
				WebhookName: <input type="text" class="webhookName" value="${name}">
				URL: <input type="text" class="webhookUrl" value="${url}">
				<button class="removeWebhook">X</button>
			`;
			row.querySelector('.removeWebhook').addEventListener('click', () => {
				row.remove();
				updateDefaultWebhookOptions();
			});
			document.getElementById('webhooks').appendChild(row);
		}
		document.getElementById('addWebhook').addEventListener('click', () => {
			addWebhookRow();
		});
		function updateDefaultWebhookOptions(){
			let select = document.getElementById('defaultWebhook');
			select.innerHTML = '';
			let webhookElements = document.getElementById('webhooks').children;
			for(let elem of webhookElements){
				let name = elem.querySelector('.webhookName').value;
				if(name){
					let option = document.createElement('option');
					option.value = name;
					option.textContent = name;
					select.appendChild(option);
				}
			}
		}

		document.getElementById('saveSettings').addEventListener('click', () => {
			let data = [];
			let names = [];
			let hasDuplicate = false;
			let hasInvalidWebhook = false;
			let webhookElements = document.getElementById('webhooks').children;

			// Webhookの正規表現
			let webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;

			for(let elem of webhookElements){
				let name = elem.querySelector('.webhookName').value;
				let url = elem.querySelector('.webhookUrl').value;

				if(name && url){
					if(!/^https:\/\/discord\.com\/api\/webhooks\/[\w-]+\/[\w-]+$/.test(url)){
						elem.querySelector('.webhookUrl').style.backgroundColor = 'red';
						hasInvalidWebhook = true; // 無効なWebhookを検出
						continue;
					}else{
						elem.querySelector('.webhookUrl').style.backgroundColor = '';
					}

					// URLをBase64エンコード
					let encodedUrl = encodeBase64(url.replace('https://discord.com/api/webhooks/', ''));
					if(names.includes(name)){
						hasDuplicate = true;
						elem.querySelector('.webhookName').style.backgroundColor = 'red';
					}else{
						names.push(name);
						elem.querySelector('.webhookName').style.backgroundColor = '';
						data.push({ name, value: encodedUrl });
					}
				}
			}
			if(hasDuplicate){
				customAlert(env_Text.when_webhook_name_duplicate);
				return;
			}
			if(hasInvalidWebhook){
				customAlert(env_Text.when_webhook_url_invalid);
				return;
			}
			// 設定をJSON形式で保存
			let selectedLanguage = document.getElementById('languageSelect').value;
			let settings = {
				data: data,
				defaultWebhook: document.getElementById('defaultWebhook').value,
				displayMethod: document.getElementById('displayMethod').value,
				lang: selectedLanguage
			};
			localStorage.setItem('webhook_brings_tweets_to_discord', JSON.stringify(settings));

			// 保存した設定を再度読み込む
			storedSettings = JSON.parse(localStorage.getItem('webhook_brings_tweets_to_discord') || '{}');

			script_settings = {
				"displayMethod": storedSettings.displayMethod || 'method1',
				"lang": storedSettings.lang || GetCookie("lang") || 'en',
				"defaultWebhook": storedSettings.defaultWebhook,
				"webHooks": (function(data){
					let webhooks = {};
					if(data && Array.isArray(data)){
						data.forEach(item => {
							if(item.name && item.value){
								webhooks[item.name] = item.value;
							}
						});
					}
					return webhooks;
				})(storedSettings.data)
			};
			env_Text = Text[script_settings.lang] || Text.en;

			// 設定画面を閉じる
			div.remove();
			document.querySelectorAll('.quickDimg').forEach((target)=>{target.remove()});
		});
		// 初期設定を読み込む
		let storedSettings = JSON.parse(localStorage.getItem('webhook_brings_tweets_to_discord') || '{}');
		let storedData = storedSettings.data || [];
		for(let item of storedData){
			// URLをBase64デコードして、前の部分を追加
			let decodedUrl = 'https://discord.com/api/webhooks/' + decodeBase64(item.value);
			addWebhookRow(item.name, decodedUrl);
			let option = document.createElement('option');
			option.value = item.name;
			option.textContent = item.name;
			document.getElementById('defaultWebhook').appendChild(option);
		}

		// 保存されたデフォルトのWebhookが存在する場合にのみ値を設定
		if(storedSettings.defaultWebhook){
			document.getElementById('defaultWebhook').value = storedSettings.defaultWebhook;
		}
		document.getElementById('displayMethod').value = storedSettings.displayMethod || env_Text.display_everywhere;
		function encodeBase64(data){
			return btoa(data);
		}
		function decodeBase64(encodedData){
			return atob(encodedData);
		}
	}
	function customAlert(message, url){
		let overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		overlay.style.zIndex = '9999';

		let alertBox = document.createElement('div');
		alertBox.style.position = 'absolute';
		alertBox.style.top = '50%';
		alertBox.style.left = '50%';
		alertBox.style.transform = 'translate(-50%, -50%)';
		alertBox.style.padding = '20px';
		alertBox.style.backgroundColor = 'white';
		alertBox.style.border = '1px solid black';
		alertBox.style.zIndex = '10000';
		alertBox.style.maxWidth = '80%'; // ボックスの最大幅を設定してテキストを折り返します
		alertBox.style.whiteSpace = 'pre-wrap'; // 改行と空白を保持します

		let alertMessage = document.createElement('p');
		alertMessage.innerHTML = message.replace(/\n/g, '<br>'); // \nを<br>に置き換えて改行を表示します

		let closeButton = document.createElement('button');
		closeButton.textContent = env_Text.close;
		closeButton.addEventListener('click', () => {
			document.body.removeChild(overlay);
		});

		alertBox.appendChild(alertMessage);

		// URLが提供された場合、それを表示するa要素を作成します
		if(url){
			let urlElement = document.createElement('a');
			urlElement.href = url;
			urlElement.textContent = url;
			urlElement.style.display = 'block';
			urlElement.style.marginTop = '10px';
			urlElement.target = '_blank';
			urlElement.rel = 'noopener';
			alertBox.appendChild(urlElement);
		}
		alertBox.appendChild(closeButton);
		overlay.appendChild(alertBox);
		document.body.appendChild(overlay);
	}
	function decodeHtml(html) {
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}
	function init(){
		if(script_settings.displayMethod == "method1"){
			main(document.querySelectorAll(env_selector.tweet_field));
		}else if(document.location.href.match(/https?:\/\/twitter\.com\/\w+\/status\/(\d+)(?!\/photo\/\d+)/)){
			main(document.querySelectorAll(env_selector.tweet_field));
		}
	}
	function update(){
		if(updating) return;
		updating = true;
		init();
		setTimeout(() => {updating = false;}, 1000);
	}
	function GetCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
		}else{
			return null;
		}
	}
	GM_registerMenuCommand('script settings', openSettings);
	class sendObject{
		constructor(webhook,sendEmbeds){
			this.method = 'POST';
			this.respType = 'json';
			this.url = "https://discord.com/api/webhooks/" + atob(webhook);
			this.headers = {
				//'Content-Type': 'multipart/form-data'
			};
			this.package = null;
			this.anonymous = true;
			this.body = sendEmbeds;
		}
	}
	class requestObject{
		constructor(URL,addtional_cookie = undefined){
			this.method = 'GET';
			this.url = `${URL}`;
			this.headers = {
				"Content-Type": "text/html,application/xhtml+xml,application/xml",
				'User-agent': navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Referer': URL,
				"Sec-Fetch-Mode": "navigate",
				"Sec-Fetch-Site": "cross-site",
				'cookie': `${addtional_cookie}`
			};
			this.package = null;
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

	class requestObject_fanbox{
		constructor(URL,fanbox_URL){
			this.method = 'GET';
			this.respType = 'json';
			this.url = `${URL}`;
			this.body = null;
			this.headers = {
				'User-agent': navigator.userAgent || navigator.vendor || window.opera,
				'origin': fanbox_URL,
				'Host': 'api.fanbox.cc',
				'cookie': '',
			};
		}
	}
	class requestObject_binary_data{
		constructor(URL,addtional_cookie = undefined){
			this.method = 'GET';
			this.respType = 'blob';
			this.url = `${URL}`;
			this.body = null;
			this.encoding = null;
			this.headers = {
				"Content-Type": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*",
				'User-agent': navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Referer': URL,
				"Sec-Fetch-Mode": "navigate",
				'cookie': `${addtional_cookie}`
			};
			this.package = null;
		}
	}
	async function request(object, maxRetries = 0, timeout = 60000){
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
})();
