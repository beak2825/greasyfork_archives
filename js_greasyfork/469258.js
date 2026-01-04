// ==UserScript==
// @name			[Twitter]長いツイートをTLで展開
// @name:ja			[Twitter]長いツイートをTLで展開
// @name:en			[Twitter]Note_Tweet expander
// @version			1145141919810.0.22
// @description			長いツイートを「更に表示」を押さなくてもTLで展開します。
// @description:ja			長いツイートを「更に表示」を押さなくてもTLで展開します。
// @description:en			Long tweets will expand in the TimeLine without having to press "Show More".
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @match			https://x.com/*
// @match			https://X.com/*
// @connect			api.twitter.com
// @connect			abs.twimg.com
// @icon			data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @grant			GM_xmlhttpRequest
// @license			MIT
// @namespace			https://greasyfork.org/ja/users/1023652
// @downloadURL https://update.greasyfork.org/scripts/469258/%5BTwitter%5D%E9%95%B7%E3%81%84%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92TL%E3%81%A7%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469258/%5BTwitter%5D%E9%95%B7%E3%81%84%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%82%92TL%E3%81%A7%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let updating = false;
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	const link_class = "r-18u37iz css-4rbku5 css-18t94o4 css-901oao css-16my406 r-1cvl2hr r-1loqt21 r-poiln3 r-bcqeeo r-qvutc0";
	const isFirefox = !!userAgent.match("Firefox")
	async function main(){
		document.querySelectorAll('article[data-testid="tweet"]:not(.tweetExpanderChecked)').forEach(async function(tweet){
			tweet.classList.add('tweetExpanderChecked');
			const elements = tweet.querySelectorAll('[data-testid="tweetText"]');
			const tweetId = tweet.querySelector(`[data-testid="User-Name"] a[aria-label], .css-1dbjc4n.r-1d09ksm.r-1471scf.r-18u37iz.r-1wbh5a2 a[aria-label]`)?.href.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/)[1];
			if(!tweetId)return;
			elements.forEach(async (element,index) =>{
				const showMoreLink = element.parentNode.querySelector('[data-testid="tweet-text-show-more-link"]');
				if(showMoreLink)showMoreLink.style.display = "none";
				if(!showMoreLink?.tagName.toLowerCase().match(/div|button/)){
					element.classList.add('tweetExpanderChecked');
					//if(element.innerText.split('\n').length >= 10)
					element.style.webkitLineClamp = null;
					return;
				}
				let tweet_data,note_tweet;
				if(index == 0){
					tweet_data = await twitterApi.getTweet(tweetId);
					note_tweet = tweet_data.note_tweet?.note_tweet_results.result || tweet_data.note_tweet?.note_tweet_results.result || null;
				}else{
					tweet_data = await twitterApi.getTweet(tweetId);
					tweet_data = await twitterApi.getTweet(tweet_data.legacy.quoted_status_id_str);
					note_tweet = tweet_data.note_tweet?.note_tweet_results.result || tweet_data.note_tweet?.note_tweet_results.result || null;
				}
				if(!note_tweet){
					element.style.webkitLineClamp = null;
					element.classList.add('tweetExpanderChecked');
					return;
				}
				Array.from(element.children).forEach(e=>e.style.display = "none");
				const new_tweet_node = createTweetTextElement(tweet_data);
				element.appendChild(new_tweet_node);
				element.style.webkitLineClamp = null;
			});
		});
	}
	function init() {
		main();
	}
	function update() {
		if(updating) return;
		updating = true;
		init();
		setTimeout(() => {updating = false;}, 1500);
	}
	function getCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
		}else{
			return null;
		}
	}
	function openIndexedDB(dbName, storeName){
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName);

			request.onerror = (event) => {
				reject("Database error: " + event.target.errorCode);
			};

			request.onsuccess = (event) => {
				let db = event.target.result;
				if(db.objectStoreNames.contains(storeName)){
					resolve(db);
				}else{
					db.close();
					const newVersion = db.version + 1;
					const versionRequest = indexedDB.open(dbName, newVersion);
					versionRequest.onupgradeneeded = (event) => {
						db = event.target.result;
						db.createObjectStore(storeName, { keyPath: 'id' });
					};
					versionRequest.onsuccess = (event) => {
						resolve(event.target.result);
					};
					versionRequest.onerror = (event) => {
						reject("Database error: " + event.target.errorCode);
					};
				}
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				db.createObjectStore(storeName, { keyPath: 'id' });
			};
		});
	}

	function saveToIndexedDB(dbName, storeName, data, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readwrite');
				const store = transaction.objectStore(storeName);
				const putRequest = store.put({ id: id, data: data });

				putRequest.onsuccess = () => {
					resolve("Data saved successfully.");
				};

				putRequest.onerror = (event) => {
					reject("Data save error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}

	function getFromIndexedDB(dbName, storeName, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readonly');
				const store = transaction.objectStore(storeName);
				const getRequest = store.get(id);

				getRequest.onsuccess = (event) => {
					if(event.target.result){
						// こうしないとfirefox系ブラウザで
						// Error: Not allowed to define cross-origin object as property on [Object] or [Array] XrayWrapper
						// というエラーが出ることがあるので、構造化クローンを使ってコピーする
						// でかいオブジェクトだと効率が悪いのでなにかいい方法があれば教えてください
						resolve(structuredClone(event.target.result.data));
					}else{
						resolve(null);
					}
				};

				getRequest.onerror = (event) => {
					reject("Data fetch error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}
	function escapeHTML(str){
		return str.replace(/[&<>"']/g, function(match){
			switch(match){
				case '&':
					return '&amp;';
				case '<':
					return '&lt;';
				case '>':
					return '&gt;';
				case '"':
					return '&quot;';
				case "'":
					return '&#39;';
			}
		});
	}
	function createTweetTextElement(tweetData){
		if(!tweetData)return null;
		const isNoteTweet = !!tweetData.note_tweet?.note_tweet_results?.result;
		let tweetBodyText, hashtags, urls, mentions, symbols;
		if(isNoteTweet){
			const data = tweetData.note_tweet.note_tweet_results.result;
			tweetBodyText = data.text;
			hashtags = data.entity_set.hashtags || [];
			urls = data.entity_set.urls || [];
			mentions = data.entity_set.user_mentions || [];
			symbols = data.entity_set.symbols || [];
		}else{
			const data = tweetData.legacy || tweetData;
			tweetBodyText = data.full_text;
			hashtags = data.entities.hashtags || [];
			urls = data.entities.urls || [];
			mentions = data.entities.user_mentions || [];
			symbols = data.entities.symbols || [];
		}
		const mediaUrls = (tweetData.legacy?.extended_entities?.media || tweetData.extended_entities?.media || []).map(media => media.url);
		mediaUrls.forEach(mediaUrl => {
			tweetBodyText = tweetBodyText?.replace(mediaUrl, '');
		});
		if(!tweetBodyText)return null;
		let tweetBodyArray = Array.from(tweetBodyText);
		const currentTimeMillis = new Date().getTime();
		const tagStart = `tagStart${currentTimeMillis}`;
		const tagEnd = `tagEnd${currentTimeMillis}`;
		const ampersand = `ampersand${currentTimeMillis}`;
		const doubleQuote = `doubleQuote${currentTimeMillis}`;
		const singleQuote = `singleQuote${currentTimeMillis}`;
		let combined = [].concat(
			hashtags.map(tag => ({
				type: 'hashtag',
				indices: tag.indices,
				text: tag.text
			})),
			mentions.map(mention => ({
				type: 'mention',
				indices: mention.indices,
				text: mention.screen_name
			})),
			symbols.map(symbol => ({
				type: 'symbol',
				indices: symbol.indices,
				text: symbol.text
			}))
		);
		combined.sort((a, b) => b.indices[0] - a.indices[0]);
		combined.forEach(item => {
			let replacement;
			switch(item.type){
				case 'hashtag':
					replacement = `<a class="${link_class}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/hashtag/${item.text}" target="_blank" rel="noopener nofollow">#${item.text}</a>`;
					break;
				case 'mention':
					replacement = `<a class="${link_class}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/${item.text}" target="_blank" rel="noopener nofollow">@${item.text}</a>`;
					break;
				case 'symbol':
					replacement = `<a class="${link_class}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/search?q=%24${item.text}&src=cashtag_click" target="_blank" rel="noopener nofollow">$${item.text}</a>`;
					break;
			}
			replacement = replacement.replace(/</gu, `${tagStart}`)
				.replace(/>/gu, `${tagEnd}`)
				.replace(/&/gu, `${ampersand}`)
				.replace(/"/gu, `${doubleQuote}`)
				.replace(/'/gu, `${singleQuote}`);
			const [start, end] = item.indices;
			tweetBodyArray.splice(start, end - start, ...Array.from(replacement));
		});
		tweetBodyText = tweetBodyArray.join('');
		const seen = new Set();
		urls.filter(target => !seen.has(target.url) && seen.add(target.url)).forEach(target =>{
			const link = `<a class="${link_class}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="${target.url}" target="_blank" rel="noopener noreferrer nofollow">${target.display_url}</a>`.replace(/</gu, `${tagStart}`)
				.replace(/>/gu, `${tagEnd}`)
				.replace(/&/gu, `${ampersand}`)
				.replace(/"/gu, `${doubleQuote}`)
				.replace(/'/gu, `${singleQuote}`);
			tweetBodyText = tweetBodyText.replace(new RegExp(`${target.url}(?=(\\s|$|\\u3000|\\W)(?!\\.|,))`, 'gu'), link);
		});
		tweetBodyText = escapeHTML(tweetBodyText);
		tweetBodyText = tweetBodyText.replace(new RegExp(tagStart, 'g'), '<')
			.replace(new RegExp(tagEnd, 'g'), '>')
			.replace(new RegExp(ampersand, 'g'), '&')
			.replace(new RegExp(doubleQuote, 'g'), '"')
			.replace(new RegExp(singleQuote, 'g'), "'");
		const newTweetBody = document.createElement('div');
		newTweetBody.className = 'css-901oao css-16my406 r-1qd0xha r-bcqeeo r-qvutc0';
		newTweetBody.innerHTML = tweetBodyText;
		return newTweetBody;
	}

	async function request({url, method = 'GET', respType = 'json', headers = {}, dontUseGenericHeaders = false, body = null, anonymous = false, cookie = null, maxRetries = 0, timeout = 60000, onlyResponse = true} = {}){
		if(!url)throw('url is not defined');

		const requestObject = {
			method,
			respType,
			url,
			headers: dontUseGenericHeaders ? headers : Object.assign({
				'Content-Type': '*/*',
				'Accept-Encoding': 'zstd, br, gzip, deflate',
				'User-agent': userAgent,
				'Accept': '*/*',
				'Referer': url,
				//'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				...(cookie ? {'Cookie': cookie} : {}),
			}, headers),
			body,
			anonymous,
		};
		let retryCount = 0;
		while(retryCount <= maxRetries){
			try{
				const response = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: requestObject.method,
						url: requestObject.url,
						headers: requestObject.headers,
						responseType: requestObject.respType,
						data: requestObject.body,
						anonymous: requestObject.anonymous,
						timeout: timeout,
						onload: function(responseDetails){
							if(responseDetails.status >= 200 && responseDetails.status < 300){
								if(onlyResponse == false || method == 'HEAD'){
									return resolve(responseDetails);
								}else{
									return resolve(responseDetails.response);
								}
							}else if(responseDetails.status >= 500 || responseDetails.status === 429){
								console.warn(`Retrying due to response status: ${responseDetails.status}`);
								return reject({
									function_name: 'request',
									reason: `Server error or too many requests (status: ${responseDetails.status})`,
									response: responseDetails,
									requestObject: requestObject
								});
							}else{
								console.error({
									function_name: 'request',
									reason: `status: ${responseDetails.status}`,
									requestObject,
									response: responseDetails
								});
								return reject({
									function_name: 'request',
									reason: `status: ${responseDetails.status}`,
									requestObject,
									response: responseDetails
								});
							}
						},
						ontimeout: function(responseDetails){
							console.warn(responseDetails);
							return reject({
								function_name: 'request',
								reason: 'time out',
								response: responseDetails,
								requestObject: requestObject
							});
						},
						onerror: function(responseDetails){
							console.warn(responseDetails);
							return reject({
								function_name: 'request',
								reason: 'error',
								response: responseDetails,
								requestObject: requestObject
							});
						}
					});
				});
				return response;
			}catch(error){
				retryCount++;
				console.warn({
					error: error,
					url: requestObject.url,
					Retry: retryCount,
					object: requestObject,
				});
				if(retryCount === maxRetries){
					throw({
						error: error,
						url: requestObject.url,
						Retry: retryCount,
						object: requestObject,
					});
				}
			}
		}
	}

	class TwitterApi{
		/*
		不具合は https://greasyfork.org/ja/scripts/478248/feedback または https://github.com/Happy-come-come/UserScripts/issues まで
		とはいえ、他人が使うことは想定していないのでなんかおかしくても知りません(は？)


		GM_addElementが有効だとiflame内のscriptがcspに引っかからないのでできればGM_addElementを使うことを推奨
		あ、もうこれいらないです(GM_addElement)。

			Twitter Web API(GraphQL)
			オブジェクト
				- tweetsData: ツイートのデータ
					{id_str: { ... }}
				- tweetsUserData: ツイートのユーザーデータ(id_strがkeyになっている)
					{userId: { ... }}
				- tweetsUserDataByUserName: ツイートのユーザーデータ(screenNameがkeyになっている)
					{screenName: { ... }}
				- lists: ユーザーのリスト(screenNameがkeyになっている)
				- timelines: タイムラインのデータ
			メソッド
			asyncなので、await必須
				- getTweet(tweetId, refresh = false)
					refresh: true の場合はキャッシュを無視して再取得
				- getUser(screenName, refresh = false)
					refresh: true の場合はキャッシュを無視して再取得
				- getHomeTimeline(place = 'bottom')
					place: bottom,top,refresh
					フォロー欄
				- getForYouTimeline(place = 'bottom')
					place: bottom,top,refresh
					おすすめ欄
				- getUserTweets(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのツイートを取得する
				- getUserTweetsAndReplies(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのツイートとリプライを取得する
				- getUserHighlights(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのハイライトを取得する
				- getUserMedia(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのメディア欄を取得する
				- getUserLikes(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのいいねを取得する
					今は自分のいいね欄しか取得できないが、将来的に他のユーザーのいいね欄も取得できるようになったときのためユーザの指定ができるようにしている
				- getOwnLists(place = 'bottom')
					place: bottom,top,refresh
					自分のリストを取得する
					getUserListでは非公開のリストが取得できないため、自身のリストを取得する場合はこのメソッドを使用する
				- getUserLists(screenName)
					ユーザーのリストを取得する
				- getListTimeline(listId, place = 'bottom')
					place: bottom,top,refresh
					リストのタイムラインを取得する
				- favoriteTweet(tweetId)
					引数の tweetId のツイートをいいねする
				- unfavoriteTweet(tweetId)
					引数の tweetId のツイートのいいねを解除する
				- retweet(tweetId)
					引数の tweetId のツイートをリツイートする
				- deleteRetweet(tweetId)
					引数の tweetId のツイートのリツイートを解除する
				- bookmark(tweetId)
					引数の tweetId のツイートをブックマークする
				- deleteBookmark(tweetId)
					引数の tweetId のツイートのブックマークを解除する
		*/
		#challengeData;
		#graphqlApiUri;
		#oldApiUri;
		#graphqlApiEndpoints;
		#oldApiEndpoints;
		#endpointsAliases;
		#requestHeadersTemplate;
		#graphqlFeatures;
		#challengeDataPromise = null;
		#initPromise;
		#RateLimitExceeded = "Rate limit exceeded";
		#transactionIdSolver;
		#resetTransactionIdSolverTimes = 0;
		#pendingTweetRequests = {};
		#pendingUserRequests = {};
		#pendingTLRequests = {};
		#pendingOldApiRequests = {};
		#apiRateLimit = {};
		#classSettings = {};
		tweetsData = {};
		tweetsUserData = {};
		tweetsUserDataByUserName = {};
		lists = {};
		timelines = {
			following: {
				...this.#defaultTimelineData()
			},
			forYou: {
				...this.#defaultTimelineData()
			},
			bookmarks: {
				...this.#defaultTimelineData()
			},
			userMedia: {},
			userTweets: {},
			userTweetsAndReplies: {},
			userHighlights: {},
			userLikes: {},
			ownLists: {
				...this.#defaultTimelineData(), pinningLists: {},
			},
			userLists: {},
			lists: {},
		};

		constructor(){
			this.#graphqlApiUri = `https://${window.location.hostname}/i/api/graphql`;
			this.#graphqlApiEndpoints = {
				TweetDetail: {
					method: ['GET'],
					uri: '/b9Yw90FMr_zUb8DvA8r2ug/TweetDetail',
				},
				UserTweets: {
					method: ['GET'],
					uri: '/M3Hpkrb8pjWkEuGdLeXMOA/UserTweets',
				},
				UserByScreenName: {
					method: ['GET'],
					uri: '/32pL5BWe9WKeSK1MoPvFQQ/UserByScreenName',
				},
				useFetchProfileBlocks_profileExistsQuery: {
					method: ['GET'],
					uri: '/Z2BA99jFw6TxaJM5v7Irmg/useFetchProfileBlocks_profileExistsQuery',
				},
				useFetchProfileSections_profileQuery: {
					method: ['GET'],
					uri: '/2ocjpx85ORO5fM06u75eCA/useFetchProfileSections_profileQuery',
				},
				UserMedia: {
					method: ['GET'],
					uri: '/8B9DqlaGvYyOvTCzzZWtNA/UserMedia',
				},
				Likes: {
					method: ['GET'],
					uri: '/uxjTlmrTI61zreSIV1urbw/Likes',
				},
				HomeLatestTimeline: {
					method: ['GET', 'POST'],
					uri: '/nMyTQqsJiUGBKLGNSQamAA/HomeLatestTimeline',
				},
				HomeTimeline: {
					method: ['GET', 'POST'],
					uri: '/ci_OQZ2k0rG0Ax_lXRiWVA/HomeTimeline',
				},
				UserTweetsAndReplies: {
					method: ['GET'],
					uri: '/pz0IHaV_t7T4HJavqqqcIA/UserTweetsAndReplies',
				},
				UserHighlightsTweets: {
					method: ['GET'],
					uri: '/y0aDPjeWFCpvY3GOmGXKhQ/UserHighlightsTweets',
				},
				BookmarksTimeline: {
					method: ['GET'],
					uri: '/ztCdjqsvvdL0dE8R5ME0hQ/Bookmarks',
				},
				ListLatestTweetsTimeline: {
					method: ['GET'],
					uri: '/LSefrrxhpeX8HITbKfWz9g/ListLatestTweetsTimeline',
				},
				ListsManagementPageTimeline: {
					method: ['GET'],
					uri: '/v06PoBzewJgqo_MliVawtg/ListsManagementPageTimeline',
				},
				CombinedLists: {
					method: ['GET'],
					uri: '/rh2fe0BAORm919U9jhyoQw/CombinedLists',
				},
				// actions
				FavoriteTweet: {
					method: ['POST'],
					uri: '/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet',
				},
				UnfavoriteTweet: {
					method: ['POST'],
					uri: '/ZYKSe-w7KEslx3JhSIk5LA/UnfavoriteTweet',
				},
				CreateRetweet: {
					method: ['POST'],
					uri: '/ojPdsZsimiJrUGLR1sjUtA/CreateRetweet',
				},
				DeleteRetweet: {
					method: ['POST'],
					uri: '/iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet',
				},
				CreateBookmark: {
					method: ['POST'],
					uri: '/aoDbu3RHznuiSkQ9aNM67Q/CreateBookmark',
				},
				DeleteBookmark: {
					method: ['POST'],
					uri: '/Wlmlj2-xzyS1GN3a6cj-mQ/DeleteBookmark',
				},
			};
			this.#endpointsAliases = {
				favorite: 'FavoriteTweet',
				unfavorite: 'UnfavoriteTweet',
				retweet: 'CreateRetweet',
				deleteRetweet: 'DeleteRetweet',
				bookmark: 'CreateBookmark',
				deleteBookmark: 'DeleteBookmark',
			};
			this.#oldApiUri = `https://${window.location.hostname}/i/api/1.1`;
			this.#oldApiEndpoints = {
				account: {
					"settings.json": {
						method: ['GET'],
						uri: '/account/settings.json',
					}
				}
			};
			this.#challengeData = {verificationCode: null, challengeCode: null, challengeJsCode: null, challengeAnimationSvgCodes: [], expires: null};
			this.#apiRateLimit = Object.keys(this.#graphqlApiEndpoints).reduce((acc, key) => {
				acc[key] = {remaining: null, limit: null, reset: null};
				return acc;
			}, {});
			this.#requestHeadersTemplate = {
				'Content-Type': 'application/json',
				'User-agent': userAgent || navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Accept-Encoding': 'zstd, br, gzip, deflate',
				'Origin': `https://${window.location.hostname}`,
				'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
				'x-csrf-token': getCookie("ct0"),
				'x-twitter-auth-type': 'OAuth2Session',
				'x-twitter-client-language': 'ja',
				'x-twitter-active-user': 'yes',
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'navigate',
			};
			this.#graphqlFeatures = {
				"rweb_video_screen_enabled": false,
				"profile_label_improvements_pcf_label_in_post_enabled": true,
				"rweb_tipjar_consumption_enabled": true,
				"responsive_web_graphql_exclude_directive_enabled": true,
				"verified_phone_label_enabled": false,
				"creator_subscriptions_tweet_preview_api_enabled": true,
				"responsive_web_graphql_timeline_navigation_enabled": true,
				"responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
				"premium_content_api_read_enabled": false,
				"communities_web_enable_tweet_community_results_fetch": true,
				"c9s_tweet_anatomy_moderator_badge_enabled": true,
				"responsive_web_grok_analyze_button_fetch_trends_enabled": false,
				"responsive_web_grok_analyze_post_followups_enabled": true,
				"responsive_web_jetfuel_frame": false,
				"responsive_web_grok_share_attachment_enabled": true,
				"articles_preview_enabled": true,
				"responsive_web_edit_tweet_api_enabled": true,
				"graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
				"view_counts_everywhere_api_enabled": true,
				"longform_notetweets_consumption_enabled": true,
				"responsive_web_twitter_article_tweet_consumption_enabled": true,
				"tweet_awards_web_tipping_enabled": false,
				"responsive_web_grok_show_grok_translated_post": false,
				"responsive_web_grok_analysis_button_from_backend": false,
				"creator_subscriptions_quote_tweet_preview_enabled": false,
				"freedom_of_speech_not_reach_fetch_enabled": true,
				"standardized_nudges_misinfo": true,
				"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
				"longform_notetweets_rich_text_read_enabled": true,
				"longform_notetweets_inline_media_enabled": true,
				"responsive_web_grok_image_annotation_enabled": true,
				"responsive_web_enhance_cards_enabled": false
			};
			this.#initPromise = this.#twitterApiInit();
		}

		async favoriteTweet(tweetId){
			if(this.#apiRateLimit.FavoriteTweet.remaining === 0 && this.#apiRateLimit.FavoriteTweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] FavoriteTweet API rate limit exceeded", resetDate: this.#apiRateLimit.FavoriteTweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('favorite', tweetId);
		}
		async unfavoriteTweet(tweetId){
			if(this.#apiRateLimit.UnfavoriteTweet.remaining === 0 && this.#apiRateLimit.UnfavoriteTweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UnfavoriteTweet API rate limit exceeded", resetDate: this.#apiRateLimit.UnfavoriteTweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('unfavorite', tweetId);
		}
		async retweet(tweetId){
			if(this.#apiRateLimit.CreateRetweet.remaining === 0 && this.#apiRateLimit.CreateRetweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] CreateRetweet API rate limit exceeded", resetDate: this.#apiRateLimit.CreateRetweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('retweet', tweetId);
		}
		async deleteRetweet(tweetId){
			if(this.#apiRateLimit.DeleteRetweet.remaining === 0 && this.#apiRateLimit.DeleteRetweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] DeleteRetweet API rate limit exceeded", resetDate: this.#apiRateLimit.DeleteRetweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('deleteRetweet', tweetId);
		}
		async bookmark(tweetId){
			if(this.#apiRateLimit.CreateBookmark.remaining === 0 && this.#apiRateLimit.CreateBookmark.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] CreateBookmark API rate limit exceeded", resetDate: this.#apiRateLimit.CreateBookmark.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('bookmark', tweetId);
		}
		async deleteBookmark(tweetId){
			if(this.#apiRateLimit.DeleteBookmark.remaining === 0 && this.#apiRateLimit.DeleteBookmark.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] DeleteBookmark API rate limit exceeded", resetDate: this.#apiRateLimit.DeleteBookmark.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('deleteBookmark', tweetId);
		}
		// 同時に同じツイートを取得しないようにする
		async getTweet(tweetId, refresh = false){
			if(this.tweetsData[tweetId] && !refresh)return {...this.tweetsData[tweetId], apiRateLimit: this.#apiRateLimit.TweetDetail};

			if(this.#pendingTweetRequests[tweetId]){
				return await this.#pendingTweetRequests[tweetId];
			}
			if(this.#apiRateLimit.TweetDetail.remaining === 0 && this.#apiRateLimit.TweetDetail.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] TweetDetail API rate limit exceeded", resetDate: this.#apiRateLimit.TweetDetail.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}

			this.#pendingTweetRequests[tweetId] = this.#_getTweet(tweetId, refresh);
			try{
				const result = await this.#pendingTweetRequests[tweetId];
				return result;
			}finally{
				delete this.#pendingTweetRequests[tweetId];
			}
		}

		async #_getTweet(tweetId, refresh = false){
			if(this.tweetsData[tweetId] && !refresh){
				return this.tweetsData[tweetId];
			}
			const variables = {
				"focalTweetId": tweetId,
				"referrer": "tweet",
				"with_rux_injections": false,
				"rankingMode": "Relevance",
				"includePromotedContent": true,
				"withCommunity": true,
				"withQuickPromoteEligibilityTweetFields": true,
				"withBirdwatchNotes": true,
				"withVoice": true
			};
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticleRichContentState": true,
				"withArticlePlainText": false,
				"withGrokAnalyze": false,
				"withDisallowedReplyControls": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.TweetDetail.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.TweetDetail.uri, 'GET');
			const instructions = response.response.data.threaded_conversation_with_injections_v2.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			this.#processgraphQL(TimelineAddEntries.entries);
			return {...this.tweetsData[tweetId], apiRateLimit: this.#apiRateLimit.TweetDetail};
		}
		async getUser(screenName, refresh = false){
			if(this.tweetsUserDataByUserName[screenName] && !refresh){
				return {...this.tweetsUserDataByUserName[screenName], apiRateLimit: this.#apiRateLimit.UserByScreenName};
			}
			if(this.#pendingUserRequests[screenName]){
				return await this.#pendingUserRequests[screenName];
			}
			if(this.#apiRateLimit.UserByScreenName.remaining === 0 && this.#apiRateLimit.UserByScreenName.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserByScreenName API rate limit exceeded", resetDate: this.#apiRateLimit.UserByScreenName.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingUserRequests[screenName] = this.#_getUser(screenName);
			try{
				const result = await this.#pendingUserRequests[screenName];
				return result;
			}finally{
				delete this.#pendingUserRequests[screenName];
			}
		}
		async #_getUser(screenName, refresh = false){
			if(this.tweetsUserDataByUserName[screenName] && !refresh){
				return this.tweetsUserDataByUserName[screenName];
			}
			const variables = {"screen_name": screenName};
			const features = {
				"hidden_profile_subscriptions_enabled": true,
				"profile_label_improvements_pcf_label_in_post_enabled": true,
				"rweb_tipjar_consumption_enabled": true,
				"responsive_web_graphql_exclude_directive_enabled": true,
				"verified_phone_label_enabled": false,
				"subscriptions_verification_info_is_identity_verified_enabled": true,
				"subscriptions_verification_info_verified_since_enabled": true,
				"highlights_tweets_tab_ui_enabled": true,
				"responsive_web_twitter_article_notes_tab_enabled": true,
				"subscriptions_feature_can_gift_premium": true,
				"creator_subscriptions_tweet_preview_api_enabled": true,
				"responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
				"responsive_web_graphql_timeline_navigation_enabled": true
			};
			const fieldToggles = {"withAuxiliaryUserLabels": false};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserByScreenName.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserByScreenName.uri, 'GET');
			const userData = response.response.data.user.result;
			if(!userData)return null;
			this.tweetsUserData[userData.rest_id] = { ...userData, API_type: "graphQL" };
			this.tweetsUserDataByUserName[userData.legacy.screen_name] = this.tweetsUserData[userData.rest_id];
			try{
				await this.getBio(screenName);
			}catch(error){}
			return {...this.tweetsUserData[userData.rest_id], apiRateLimit: this.#apiRateLimit.UserByScreenName};
		}

		async getHomeTimeline(place = 'bottom'){
			if(this.#pendingTLRequests.following){
				return await this.#pendingTLRequests.following;
			}
			if(this.#apiRateLimit.HomeLatestTimeline.remaining === 0 && this.#apiRateLimit.HomeLatestTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] HomeLatestTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.HomeLatestTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingTLRequests.following = this.#_getHomeTimeline(place);
			try{
				const result = await this.#pendingTLRequests.following;
				return result;
			}finally{
				delete this.#pendingTLRequests.following;
			}
		}

		async #_getHomeTimeline(place){
			const variables = {
				"count": 40,
				"includePromotedContent": false,
				"latestControlAvailable": true,
			};
			const cursor = this.#_getCursor('following', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.HomeLatestTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.HomeLatestTimeline.uri, 'GET')
			const instructions = response.response.data.home.home_timeline_urt.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'following', place: place})), apiRateLimit: this.#apiRateLimit.HomeLatestTimeline};
		}

		async getForYouTimeline(place = 'bottom'){
			if(this.#pendingTLRequests.forYou){
				return await this.#pendingTLRequests.forYou;
			}
			if(this.#apiRateLimit.HomeTimeline.remaining === 0 && this.#apiRateLimit.HomeTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] HomeTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.HomeTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingTLRequests.forYou = this.#_getForYouTimeline(place);
			try{
				const result = await this.#pendingTLRequests.forYou;
				return result;
			}finally{
				delete this.#pendingTLRequests.forYou;
			}
		}

		async #_getForYouTimeline(place){
			const variables = {
				"count": 40,
				"includePromotedContent": false,
				"latestControlAvailable": true,
			};
			const cursor = this.#_getCursor('forYou', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.HomeTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.HomeTimeline.uri, 'GET');
			const instructions = response.response.data.home.home_timeline_urt.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'forYou', place: place})), apiRateLimit: this.#apiRateLimit.HomeTimeline};
		}

		async getUserTweets(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userTweets?.[screenName]){
				return await this.#pendingTLRequests.userTweets?.[screenName];
			}
			if(this.#apiRateLimit.UserTweets.remaining === 0 && this.#apiRateLimit.UserTweets.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserTweets API rate limit exceeded", resetDate: this.#apiRateLimit.UserTweets.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userTweets)this.#pendingTLRequests.userTweets = {};
			if(!this.timelines.userTweets[screenName])this.timelines.userTweets[screenName] = {};
			this.#pendingTLRequests.userTweets[screenName] = this.#_getUserTweets(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userTweets?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userTweets?.[screenName];
			}
		}

		async #_getUserTweets(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userTweets', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserTweets.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserTweets.uri, 'GET');
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const TimelinePinEntry = instructions.find(element => element.type === 'TimelinePinEntry')?.entrie;
			if(TimelinePinEntry)this.#processgraphQL(TimelinePinEntry);
			const timelineData = (instructions[0]?.moduleItems || [])
				.concat(TimelineAddEntries.entries[0]?.content?.items || [])
				.concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userTweets', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserTweets};
		}

		async getUserTweetsAndReplies(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userTweetsAndReplies?.[screenName]){
				return await this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
			}
			if(this.#apiRateLimit.UserTweetsAndReplies.remaining === 0 && this.#apiRateLimit.UserTweetsAndReplies.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserTweetsAndReplies API rate limit exceeded", resetDate: this.#apiRateLimit.UserTweetsAndReplies.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userTweetsAndReplies)this.#pendingTLRequests.userTweetsAndReplies = {};
			if(!this.timelines.userTweetsAndReplies[screenName])this.timelines.userTweetsAndReplies[screenName] = {};
			this.#pendingTLRequests.userTweetsAndReplies[screenName] = this.#_getUserTweetsAndReplies(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
			}
		}

		async #_getUserTweetsAndReplies(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userTweetsAndReplies', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserTweetsAndReplies.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserTweetsAndReplies.uri, 'GET');
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const TimelinePinEntry = instructions.find(element => element.type === 'TimelinePinEntry')?.entrie;
			if(TimelinePinEntry)this.#processgraphQL(TimelinePinEntry);
			const timelineData = (instructions[0]?.moduleItems || [])
				.concat(TimelineAddEntries.entries[0]?.content?.items || [])
				.concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userTweetsAndReplies', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserTweetsAndReplies};
		}

		async getUserHighlights(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userHighlights?.[screenName]){
				return await this.#pendingTLRequests.userHighlights?.[screenName];
			}
			if(this.#apiRateLimit.UserHighlightsTweets.remaining === 0 && this.#apiRateLimit.UserHighlightsTweets.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserHighlightsTweets API rate limit exceeded", resetDate: this.#apiRateLimit.UserHighlightsTweets.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userHighlights)this.#pendingTLRequests.userHighlights = {};
			if(!this.timelines.userHighlights[screenName])this.timelines.userHighlights[screenName] = {};
			this.#pendingTLRequests.userHighlights[screenName] = this.#_getUserHighlights(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userHighlights?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userHighlights?.[screenName];
			}
		}

		async #_getUserHighlights(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userHighlights', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserHighlights.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserHighlightsTweets.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userHighlights', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserHighlightsTweets};
		}

		async getUserMedia(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userMedia?.[screenName]){
				return await this.#pendingTLRequests.userMedia?.[screenName];
			}
			if(this.#apiRateLimit.UserMedia.remaining === 0 && this.#apiRateLimit.UserMedia.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserMedia API rate limit exceeded", resetDate: this.#apiRateLimit.UserMedia.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userMedia)this.#pendingTLRequests.userMedia = {};
			if(!this.timelines.userMedia[screenName])this.timelines.userMedia[screenName] = {};
			this.#pendingTLRequests.userMedia[screenName] = this.#_getUserMedia(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userMedia?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userMedia?.[screenName];
			}
		}
		// place: bottom,top,refresh
		async #_getUserMedia(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withClientEventToken": false,
				"withBirdwatchNotes": false,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userMedia', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserMedia.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserMedia.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userMedia', screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserMedia};
		}

		async getUserLikes(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userLikes?.[screenName]){
				return await this.#pendingTLRequests.userLikes?.[screenName];
			}
			if(this.#apiRateLimit.Likes.remaining === 0 && this.#apiRateLimit.Likes.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] Likes API rate limit exceeded", resetDate: this.#apiRateLimit.Likes.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userLikes)this.#pendingTLRequests.userLikes = {};
			if(!this.timelines.userLikes[screenName])this.timelines.userLikes[screenName] = {};
			this.#pendingTLRequests.userLikes[screenName] = this.#_getUserLikes(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userLikes?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userLikes?.[screenName];
			}
		}

		async #_getUserLikes(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withClientEventToken": false,
				"withBirdwatchNotes": false,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userLikes', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.Likes.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.Likes.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userLikes', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.Likes};
		}

		async getOwnLists(place = 'bottom'){
			if(this.#pendingTLRequests.ownLists){
				return await this.#pendingTLRequests.ownLists;
			}
			if(this.#apiRateLimit.ListsManagementPageTimeline.remaining === 0 && this.#apiRateLimit.ListsManagementPageTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] ListsManagementPageTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.ListsManagementPageTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.ownLists)this.#pendingTLRequests.ownLists = {};
			this.#pendingTLRequests.ownLists = this.#_getOwnLists(place);
			try{
				const result = await this.#pendingTLRequests.ownLists;
				return result;
			}finally{
				delete this.#pendingTLRequests.ownLists;
			}
		}

		async #_getOwnLists(place){
			const variables = {"count":100};
			const cursor = this.#_getCursor('ownLists', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.ListsManagementPageTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.ListsManagementPageTimeline.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			await this.#processTimeline({entries: timelineData, type: 'ownLists', place: place});
			const lists = {};
			Object.keys(this.timelines.ownLists).forEach(key => {
				const list = this.timelines.ownLists[key];
				lists[list.id_str] = {
					id: list.id,
					id_str: list.id_str,
					name: list.name,
					description: list.description,
					mode: list.mode,
				};
			});
			this.lists.ownLists = {...this.lists.ownLists, ...lists};
			return {...this.lists.ownLists, apiRateLimit: this.#apiRateLimit.ListsManagementPageTimeline};
		}

		async getUserLists(screenName){
			if(this.#pendingTLRequests.lists?.[screenName]){
				return await this.#pendingTLRequests.lists?.[screenName];
			}
			if(this.#apiRateLimit.UserLists.remaining === 0 && this.#apiRateLimit.UserLists.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserLists API rate limit exceeded", resetDate: this.#apiRateLimit.UserLists.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.lists)this.#pendingTLRequests.lists = {};
			if(!this.timelines.userLists[screenName])this.timelines.userLists[screenName] = {};
			this.#pendingTLRequests.lists[screenName] = this.#_getUserLists(screenName);
			try{
				const result = await this.#pendingTLRequests.lists?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.lists?.[screenName];
			}
		}
		async #_getUserLists(screenName){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 100
			};
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.CombinedLists.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				headers,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.CombinedLists.uri);

			const entries = response.response.data.user.result.timeline.timeline.instructions?.find(element => element.type === 'TimelineAddEntries')?.entries;
			await this.#processTimeline({entries: entries, type: 'lists', screenName: screenName});
			const lists = {};
			Object.keys(this.timelines.userLists[screenName]).forEach(key => {
				const list = this.timelines.userLists[screenName][key];
				lists[list.id_str] = {
					id: list.id,
					id_str: list.id_str,
					name: list.name,
					description: list.description,
					mode: list.mode,
				};
			});
			this.lists[screenName] = {...this.lists[screenName], ...lists[screenName]};
			return {...this.lists[screenName], apiRateLimit: this.#apiRateLimit.UserLists};
		}

		async getListTimeline(listId, place = 'bottom'){
			if(this.#pendingTLRequests.lists?.[listId]){
				return await this.#pendingTLRequests.lists?.[listId];
			}
			if(this.#apiRateLimit.ListTimeline.remaining === 0 && this.#apiRateLimit.ListTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] ListTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.ListTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.lists)this.#pendingTLRequests.lists = {};
			if(!this.timelines.lists[listId])this.timelines.lists[listId] = {};
			this.#pendingTLRequests.lists[listId] = this.#_getListTimeline(listId, place);
			try{
				const result = await this.#pendingTLRequests.lists?.[listId];
				return result;
			}finally{
				delete this.#pendingTLRequests.lists?.[listId];
			}
		}

		async #_getListTimeline(listId, place = 'bottom'){
			const variables = {
				"listId": listId,
				"count": 20,
			};
			const cursor = this.#_getCursor('lists', place, listId);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.ListTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.ListTimeline.uri);
			this.#updateApiRateLimit(response, 'ListTimeline');
			const instructions = response.response.data.list.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'lists', place: place})), apiRateLimit: this.#apiRateLimit.ListTimeline};
		}

		async getAccountSettings(parameter = {}){
			if(this.#pendingOldApiRequests.account?.settings){
				return await this.#pendingOldApiRequests.account.settings;
			}
			/*
			if(this.#apiRateLimit.account?.setting?.remaining === 0 && this.#apiRateLimit.account?.setting?.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] AccountSetting API rate limit exceeded", resetDate: this.#apiRateLimit.account.setting.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			*/
			if(!this.#pendingOldApiRequests.account)this.#pendingOldApiRequests.account = {};
			this.#pendingOldApiRequests.account.settings = this.#_getAccountSettings(parameter);
			try{
				const result = await this.#pendingOldApiRequests.account.settings;
				return result;
			}finally{
				delete this.#pendingOldApiRequests.account.settings;
			}
		}
		async #_getAccountSettings(parameter){
			const params = new URLSearchParams(parameter).toString();
			const requestObj = {
				url: `${this.#oldApiUri}${this.#oldApiEndpoints.account["settings.json"].uri}${params ? `?${params}` : ""}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#oldApiEndpoints.account["settings.json"].uri, "1.1", true);
			if(!response.response)return null;
			return response.response;
		}

		// FavoriteTweet(favorite), UnfavoriteTweet(unfavorite), CreateRetweet(retweet), DeleteRetweet(deleteRetweet), CreateBookmark(bookmark), DeleteBookmark(deleteBookmark)
		async tweetAction(endpoint, tweetId){
			if(!this.#graphqlApiEndpoints[endpoint]){
				if(this.#endpointsAliases[endpoint]){
					endpoint = this.#endpointsAliases[endpoint];
				}else if(this.#graphqlApiEndpoints[endpoint.split('/').pop()]){
					endpoint = endpoint.split('/').pop();
				}else{
					throw new Error(`Invalid endpoint: ${endpoint}`);
				}
			}
			const endpointData = this.#graphqlApiEndpoints[endpoint];
			if(!endpointData || tweetId === undefined)throw new Error("Invalid endpoint or tweetId");
			const headers = await this.#generateHeaders(endpointData.uri, 'POST');
			const body = `{"variables": {"tweet_id": "${tweetId}"}, "queryId": "${endpointData.uri.split('/')[1]}"}`;
			const requestObj = {url: `${this.#graphqlApiUri}${endpointData.uri}`, method: 'POST', body: body, headers: headers, onlyResponse: false, dontUseGenericHeaders: true, maxRetries: 1};
			const response = await this.#_request(requestObj, endpoint);
			return (response.status === 200);
		}

		async getBio(screenName){
			const variables = {"screenName": screenName};
			let response;
			response = await request({
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.useFetchProfileBlocks_profileExistsQuery.uri}?variables=${this.#objectToUri(variables)}`,
				headers: await this.#generateHeaders(this.#graphqlApiEndpoints.useFetchProfileBlocks_profileExistsQuery.uri, 'GET'),
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			});
			if(!response.status === "200")throw new Error(`Failed to fetch`);
			if(!response.response.data.user_result_by_screen_name.result.has_profile_blocks)return;
			response = await request({
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.useFetchProfileSections_profileQuery.uri}?variables=${this.#objectToUri(variables)}`,
				headers: await this.#generateHeaders(this.#graphqlApiEndpoints.useFetchProfileSections_profileQuery.uri, 'GET'),
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			});
			if(!response.status === "200")throw new Error(`Failed to fetch`);
			const content = response.response.data.user_result_by_screen_name.result.expanded_profile_results.result.profile_sections.items_results[0].result.profile_blocks.items_results[0].result.content.value;
			const bioData = JSON.parse(content);
			if(!bioData)return;
			if(this.tweetsUserDataByUserName[screenName])this.tweetsUserDataByUserName[screenName].bio = bioData;
			return bioData;
		}

		//graphQL API のレスポンスを処理
		async #processgraphQL(entries){
			if(!entries)return null;
			const storeTweet = (tweetObj) => {
				const user = tweetObj.core.user_results.result;
				this.tweetsUserData[user.rest_id] = { ...user, API_type: "graphQL" };
				this.tweetsUserDataByUserName[user.legacy.screen_name] = this.tweetsUserData[user.rest_id];
				tweetObj.core.user_results.result = this.tweetsUserData[user.rest_id];
				this.tweetsData[tweetObj.rest_id] = { ...tweetObj, API_type: "graphQL" };
			};
			for(const entry of entries){
				const item = entry.content?.itemContent?.tweet_results || entry.item?.itemContent?.tweet_results;
				if(!item){
					const items = entry?.content?.items;
					if(items)this.#processgraphQL(items);
					continue;
				}
				const tweet = item?.result?.tweet || item?.result;
				if(!tweet || tweet.tombstone)continue;
				try{
					// 引用ツイートの処理
					const quoted = tweet.quoted_status_result?.result?.tweet
						|| tweet.quoted_status_result?.tweet
						|| tweet.quoted_status_result?.result;
					if(quoted){
						storeTweet(quoted);
						tweet.quoted_status_result.result = this.tweetsData[quoted.rest_id];
					}
					// リツイートの処理
					const retweeted = tweet.retweeted_status_result?.result?.tweet
						|| tweet.retweeted_status_result?.tweet
						|| tweet.retweeted_status_result?.result;
					if(retweeted){
						storeTweet(retweeted);
						tweet.retweeted_status_result.result = this.tweetsData[retweeted.rest_id];
					}
					// 本体ツイートの処理
					storeTweet(tweet);
				}catch(error){
					console.error("processgraphQL error", error, {tweet});
				}
			}
			return "OK";
		}

		async #processTimeline({entries = [], type = null, screenName = null,}={}){
			if(entries.length === 2){
				if(entries[0].entryId.startsWith('cursor') && entries[1].entryId.startsWith('cursor'))return;
			}else if(entries.length === 1){
				if(entries[0].entryId.startsWith('cursor'))return;
			}
			await this.#processgraphQL(entries);
			const newContents = {};
			const newRawData = {};

			let timelineTarget = null;
			if(['following', 'forYou', 'bookmarks', 'ownLists'].includes(type)){
				timelineTarget = this.timelines[type];
			}else if(['userMedia', 'userTweets', 'userTweetsAndReplies', 'userHighlights', 'userLikes' ,'lists'].includes(type)){
				if(!this.timelines[type][screenName]){
					this.timelines[type][screenName] = {
						contents: {},
						rawData: {},
						cursor: {
							top: {entryId: null, sortIndex: null, value: null},
							bottom: {entryId: null, sortIndex: null, value: null},
							value: null,
						}
					};
				}
				timelineTarget = this.timelines[type][screenName];
			}

			entries.forEach(entry => {
				if(entry.entryId.match('promoted'))return;
				switch(true){
					case /tweet-/.test(entry.entryId): {
						const tweetId = entry.entryId.split('-').pop();
						if(!entry.sortIndex){
							entry.sortIndex = tweetId;
						}
						newRawData[entry.entryId] = entry;
						if(newRawData[entry.entryId].content?.itemContent){
							newRawData[entry.entryId].content.itemContent.tweet_results = this.tweetsData[tweetId];
						}
						if(newRawData[entry.entryId].item?.itemContent){
							newRawData[entry.entryId].item.itemContent.tweet_results = this.tweetsData[tweetId];
						}
						const controllerData = (entry.item ?? entry.content)?.clientEventInfo?.details?.timelinesDetails?.controllerData;

						newContents[entry.entryId] = {
							sortIndex: newRawData[entry.entryId].sortIndex,
							entryId: newRawData[entry.entryId].entryId,
							tweetDisplayType: newRawData[entry.entryId].item?.itemContent.tweetDisplayType || newRawData[entry.entryId].content?.itemContent.tweetDisplayType,
							controllerData: controllerData,
							tweetData: this.tweetsData[tweetId],
						}
						break;
					}
					case entry.entryId.startsWith('profile-conversation'): {
						const tweets = [];
						newRawData[entry.entryId] = entry;
						newRawData[entry.entryId].content.items.forEach((item,index) => {
							if(item.item?.itemContent?.tweet_results){
								const tweetId = item.item.itemContent.tweet_results.result.rest_id;
								newRawData[entry.entryId].content.items[index].item.itemContent.tweet_results = this.tweetsData[tweetId];
								tweets.push(tweetId);
							}
						});
						newContents[entry.entryId] = {
							sortIndex: entry.sortIndex,
							entryId: entry.entryId,
							tweetDisplayType: entry.content?.displayType || entry.item?.itemContent.tweetDisplayType || entry.content?.itemContent?.tweetDisplayType,
							controllerData: entry.content?.clientEventInfo?.details?.timelinesDetails?.controllerData,
							tweetData: tweets.map(tweetId => this.tweetsData[tweetId]),
							allTweetIds: entry.content?.metadata?.conversationMetadata?.allTweetIds || entry.item?.metadata?.conversationMetadata?.allTweetIds,
						}
						break;
					}
					case entry.entryId.startsWith('cursor-top'): {
						newRawData[entry.entryId] = entry;
						if(!timelineTarget.cursor)timelineTarget.cursor = {top:{},bottom:{}};
						if(!timelineTarget.cursor.top.sortIndex || entry.sortIndex > timelineTarget.cursor.top.sortIndex){
							timelineTarget.cursor.top = {
								sortIndex: entry.sortIndex,
								entryId: entry.entryId,
								value: entry.content.value,
							}
						}
						break;
					}
					case entry.entryId.startsWith('cursor-bottom'): {
						newRawData[entry.entryId] = entry;
						if(!timelineTarget.cursor)timelineTarget.cursor = {top:{},bottom:{}};
						if(timelineTarget.cursor && (!timelineTarget.cursor.bottom.sortIndex || entry.sortIndex < timelineTarget.cursor.bottom.sortIndex)){
							timelineTarget.cursor.bottom = {
								sortIndex: entry.sortIndex,
								entryId: entry.entryId,
								value: entry.content.value,
							};
						}
						break;
					}
					case entry.entryId.match(/subscribed-list-module/): {
						newRawData[entry.entryId] = entry;
						entry.content.items.forEach(item => {
							newContents[item.entryId] = {
								sortIndex: item.sortIndex,
								entryId: item.entryId,
								listData: item.itemContent?.list,
								isPinning: item.itemContent?.list.pinning,
							};
							if(item.itemContent?.list.pinning){
								this.timelines.ownLists.pinningLists[item.entryId] = newContents[item.entryId];
							}
						});
						break;
					}
					case entry.entryId.match(/^list-/): {
						newRawData[entry.entryId] = entry;
						newContents[entry.entryId] = {
							sortIndex: entry.sortIndex,
							entryId: entry.entryId,
							listData: entry.content?.itemContent?.list,
						};
						break;
					}
					default:
						return;
				}
			});

			if(!timelineTarget.contents)timelineTarget.contents = {};
			if(!timelineTarget.rawData)timelineTarget.rawData = {};
			if(!timelineTarget.contentsList)timelineTarget.contentsList = [];
			if(!timelineTarget.contentsBySortIndex)timelineTarget.contentsBySortIndex = {};
			const combinedContents = {...timelineTarget.contents};
			const combinedRawData = {...timelineTarget.rawData};

			const newContentsData = { contents: {}, rawData: {}, contentsList: [], contentsBySortIndex: {} };
			const contentsList = timelineTarget.contentsList || [];
			const contentsBySortIndex = timelineTarget.contentsBySortIndex || {};

			for(const [key, content] of Object.entries(newContents)){
				const raw = newRawData[key];
				combinedContents[key] = content;
				combinedRawData[key] = raw;

				contentsList.push(content);
				contentsBySortIndex[content.sortIndex] = content;

				if(!timelineTarget.contents[key]){
					newContentsData.contents[key] = content;
					newContentsData.rawData[key] = raw;
					newContentsData.contentsList.push(content);
					newContentsData.contentsBySortIndex[content.sortIndex] = content;
				}
			}

			for(const [key, content] of Object.entries(timelineTarget.contents)){
				if(!combinedContents[key]){
					contentsList.push(content);
					contentsBySortIndex[content.sortIndex] = content;
				}
			}

			contentsList.sort((a, b) => (b.sortIndex || "").localeCompare(a.sortIndex || ""));
			newContentsData.contentsList.sort((a, b) => (b.sortIndex || "").localeCompare(a.sortIndex || ""));

			timelineTarget.contents = combinedContents;
			timelineTarget.rawData = combinedRawData;
			timelineTarget.contentsList = contentsList;
			timelineTarget.contentsBySortIndex = contentsBySortIndex;
			timelineTarget.newContents = newContentsData;


			return timelineTarget;
		}

		async #generateHeaders(endpoint, method, apiType = 'graphql'){
			const id = await this.getXctid(apiType === 'graphql' ? "/i/api/graphql" : `/i/api/${apiType}` + endpoint, method);
			const headers = id ? Object.assign({
				'x-client-transaction-id': id,
			}, this.#requestHeadersTemplate) : this.#requestHeadersTemplate;
			return headers;
		}

		#_getCursor(type, place, screenName = null){
			let timelineTarget;

			if(['following', 'forYou', 'bookmarks', 'ownLists'].includes(type)){
				timelineTarget = this.timelines[type];
			}else if(['userMedia', 'userTweets', 'userTweetsAndReplies', 'userHighlights', 'userLikes', 'lists'].includes(type)){
				if(!this.timelines[type][screenName]){
					this.timelines[type][screenName] = {
						cursor: {
							top: { entryId: null, sortIndex: null, value: null },
							bottom: { entryId: null, sortIndex: null, value: null }
						}
					};
				}
				timelineTarget = this.timelines[type][screenName];
			}else{
				throw new Error(`Invalid timeline type: ${type}`);
			}

			if(place === 'refresh'){
				timelineTarget.cursor = {
					top: { entryId: null, sortIndex: null, value: null },
					bottom: { entryId: null, sortIndex: null, value: null }
				};
				return null;
			}

			const cursorObj = timelineTarget.cursor?.[place];
			return cursorObj?.value ?? null;
		}

		async #_request(optionObj, endpoint, type = 'graphql', noApiRateLimit = false){
			if(this.#resetTransactionIdSolverTimes >= 5){
				console.error("[TwitterApi] Too many transactionIdSolver reset attempts. Please check your network connection or try again later.");
				throw new Error("TransactionIdSolver is not working");
			}
			let retryCount = 0;
			while(retryCount <= 5 && this.#resetTransactionIdSolverTimes < 5){
				try{
					const headers = await this.#generateHeaders(endpoint, optionObj.method, type);
					const response = await request({...optionObj, headers});
					if(!noApiRateLimit)this.#updateApiRateLimit(response, endpoint);
					return response;
				}catch(e){
					console.error(e);
					if(e.error?.response?.status === 404){
						retryCount++;
						this.#challengeData = null;
						this.#transactionIdSolver = null;
					}else{
						if(e.error?.response && !noApiRateLimit)this.#updateApiRateLimit(e.error.response, endpoint);
						return null;
					}
				}
			}
		}

		#updateApiRateLimit(response, endpoint){
			if(!this.#graphqlApiEndpoints[endpoint]){
				const tmpName = this.#graphqlApiEndpoints[endpoint?.split('/')?.pop()];
				if(tmpName){
					endpoint = endpoint?.split('/')?.pop();
				}
			}
			const responseHeaders = response.responseHeaders;
			if(!this.#apiRateLimit[endpoint]){
				this.#apiRateLimit[endpoint] = {
					remaining: responseHeaders.match(/x-rate-limit-remaining: ?([\d]+)/)?.[1],
					limit: responseHeaders.match(/x-rate-limit-limit: ?([\d]+)/)?.[1],
					reset: responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1],
					resetDate : new Date((responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1] || 0) * 1000),
				};
			}else{
				this.#apiRateLimit[endpoint].remaining = responseHeaders.match(/x-rate-limit-remaining: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].limit = responseHeaders.match(/x-rate-limit-limit: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].reset = responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].resetDate = new Date((responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1] || 0) * 1000);
			}
			if(response.status === 200){
				return true;
			}else{
				console.error(`${endpoint} API error`, response);
				throw new Error(`Failed to fetch`);
			}
		}

		#objectToUri(obj){
			return encodeURIComponent(JSON.stringify(obj));
		}

		getApiRateLimit(){
			return this.#apiRateLimit;
		}

		#defaultTimelineData(){
			return {
				contents: {},
				contentsList: [],
				contentsBySortIndex: {},
				rawData: {},
				newContents: {contents: {}, contentsList: [], contentsBySortIndex: {}, rawData: {}},
				cursor: {top: {entryId: null, sortIndex: null, value: null}, bottom: {entryId: null, sortIndex: null, value: null}},
			};
		}

		// challenge 情報を取得
		async #getChallengeData(force = false){
			if((this.#challengeData?.expires && this.#challengeData?.expires > Date.now()) && !force){
				return;
			}
			if(this.#challengeDataPromise){
				return this.#challengeDataPromise;
			}
			if(force)this.#resetTransactionIdSolverTimes++;
			this.#challengeDataPromise = (async () => {
				const response = await request({ url: 'https://x.com/home', respType: 'text' });
				const html = response;
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");

				const metaTag = doc.querySelector('meta[name="twitter-site-verification"]');
				const verificationCode = metaTag?.content;
				if(!verificationCode)throw new Error("Verification code not found");

				const challengeCodeMatch = html.match(/"ondemand\.s":"(\w+)"/);
				if(!challengeCodeMatch)throw new Error("Challenge code not found");

				const challengeCode = challengeCodeMatch[1];
				const svgs = Array.from(doc.querySelectorAll('svg[id^="loading-x"]'));
				const challengeAnimationSvgCodes = svgs.map(svg => svg.outerHTML);

				const jsUrl = `https://abs.twimg.com/responsive-web/client-web/ondemand.s.${challengeCode}a.js`;
				const challengeJsCode = await request({ url: jsUrl, respType: 'text' });
				this.#challengeData = {
					verificationCode,
					challengeCode,
					challengeJsCode,
					challengeAnimationSvgCodes,
					expires: Date.now() + 60 * 60 * 1000, // 60 min
				};
				await saveToIndexedDB('MTLU_twitterApi', 'challengeData', this.#challengeData);
			})();

			try{
				return this.#challengeDataPromise;
			}finally{
				this.#challengeDataPromise = null;
			}
		}

		async getXctid(endpoint, method = "GET"){
			await this.#initPromise;
			if(!this.#challengeData){
				await this.#getChallengeData();
			}
			if(!this.#transactionIdSolver){
				this.#transactionIdSolver = new TwitterApi.TransactionIdSolver(this.#challengeData);
			}
			return await this.#transactionIdSolver.solve(endpoint, method);
		}

		// ここは https://github.com/dimdenGD/OldTweetDeck/blob/main/src/challenge.js から完全にパクった
		#uuidV4(){
			const uuid = new Array(36);
			for(let i = 0; i < 36; i++){
			uuid[i] = Math.floor(Math.random() * 16);
			}
			uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
			uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
			uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			return uuid.map((x) => x.toString(16)).join('');
		}

		async #twitterApiInit(){
			this.#challengeData = await getFromIndexedDB('MTLU_twitterApi', 'challengeData');
			await this.#getChallengeData();
			this.#classSettings = await getFromIndexedDB('MTLU_twitterApi', 'settings') || {};
			if(!this.#classSettings?.uuid){
				this.#classSettings.uuid = this.#uuidV4();
				await saveToIndexedDB('MTLU_twitterApi', 'settings', this.#classSettings);
			}
			this.#requestHeadersTemplate['x-twitter-client-uuid'] = this.#classSettings.uuid;
		}

		// 参考: https://github.com/iSarabjitDhiman/XClientTransaction
		static TransactionIdSolver = class {
			constructor(challengeData){
				this.challengeData = challengeData;
				this.animationKey = null;
			}

			async solve(path, method){
				if(!this.challengeData.verificationCode){
					throw new Error("Challenge data missing");
				}
				if(!this.animationKey){
					this.animationKey = await this.getAnimationKey();
				}

				const keyBytes = Array.from(atob(this.challengeData.verificationCode), c => c.charCodeAt(0));
				return await this.generateTransactionId(method, path, {
					key: this.challengeData.verificationCode,
					keyBytes,
					animationKey: this.animationKey,
					defaultKeyword: "obfiowerehiring",
					additionalRandomNumber: 3
				});
			}

			async getAnimationKey(){
				if(!(this.rowIndexKey && this.frameTimeKeys))this.getIndices();
				const parser = new DOMParser();
				const svgs = this.challengeData.challengeAnimationSvgCodes.map(html => parser.parseFromString(html, 'image/svg+xml').documentElement);

				const keyBytes = Array.from(atob(this.challengeData.verificationCode), c => c.charCodeAt(0));
				const totalTime = 4096;
				const rowIndex = keyBytes[this.rowIndexKey] % 16;
				const frameTime = this.frameTimeKeys.map(i => keyBytes[i] % 16).reduce((a, b) => a * b, 1);

				const selectedSvg = svgs[keyBytes[5] % svgs.length];
				const arr = this.parsePathToArray(selectedSvg);
				const frameRow = arr[rowIndex].filter((x)=>{return x === x});

				const targetTime = frameTime / totalTime;
				return this.animate(frameRow, targetTime);
			}

			async getIndices(){
				const matches = [...this.challengeData.challengeJsCode.matchAll(/\(\w\[(\d+)\],\s*16\)/g)];
				const indices = matches.map(match => parseInt(match[1]));

				if(indices.length < 4){
					throw new Error("Couldn't extract keyByte indices from on_demand.js");
				}

				this.rowIndexKey = indices[0];
				this.frameTimeKeys = indices.slice(1, 4);
			}

			parsePathToArray(svgElement){
				const paths = svgElement.querySelectorAll('path');
				const path = paths[1];
				if(!path)return [];
				const d = path.getAttribute('d');
				if(!d)return [];
				const commands = d.split('C').slice(1);
				return commands.map(command => command.trim().split(/[\s,]+/).map(str => parseInt(str, 10)).filter((x)=>{return x === x}));
			}

			animate(frames, targetTime){
				const fromColor = [...frames.slice(0, 3).map(v => parseFloat(v)), 1];
				const toColor = [...frames.slice(3, 6).map(v => parseFloat(v)), 1];
				const fromRotation = [0.0];
				const toRotation = [this.solveVal(parseFloat(frames[6]), 60.0, 360.0, true)];
				const curves = frames.slice(7).map((item, i) => this.solveVal(parseFloat(item), this.isOdd(i) ? -1 : 0, 1.0, false)).filter((x)=>{return x === x});

				const val = this.getCubic(targetTime, curves);

				let color = this.interpolate(fromColor, toColor, val).map(v => Math.max(0, v));
				const rotation = this.interpolate(fromRotation, toRotation, val);
				const matrix = this.convertRotationToMatrix(rotation[0]);

				const strArr = [];
				for(let i=0;i<color.length-1;i++){
					strArr.push(Math.round(color[i]).toString(16));
				}
				for(const value of matrix){
					let rounded = Math.round(value * 100) / 100;
					if(rounded < 0)rounded = -rounded;
					const hexValue = this.floatToHex(rounded);
					strArr.push(hexValue.startsWith('.') ? `0${hexValue}` : hexValue || '0');
				}
				strArr.push("0", "0");

				return strArr.join('').replace(/[.-]/g, '');
			}

			convertRotationToMatrix(rotation){
				const rad = rotation * Math.PI / 180;
				const cosVal = Math.cos(rad);
				const sinVal = Math.sin(rad);
				return [cosVal, -sinVal, sinVal, cosVal];
			}

			solveVal(value, minVal, maxVal, rounding){
				const result = value * (maxVal - minVal) / 255 + minVal;
				return rounding ? Math.floor(result) : Math.round(result * 100) / 100;
			}

			isOdd(num){
				return (num % 2) ? -1.0 : 0.0;
			}

			interpolate(fromList, toList, f){
				if(fromList.length !== toList.length){
					throw new Error(`Mismatched interpolation arguments: ${fromList} vs ${toList}`);
				}
				return fromList.map((fromVal, i) => this.interpolateNum(fromVal, toList[i], f));
			}

			interpolateNum(fromVal, toVal, f){
				if(typeof fromVal === 'number' && typeof toVal === 'number'){
					return fromVal * (1 - f) + toVal * f;
				}
				if(typeof fromVal === 'boolean' && typeof toVal === 'boolean'){
					return f < 0.5 ? fromVal : toVal;
				}
				throw new Error('Unsupported types in interpolateNum');
			}

			floatToHex(x, maxDigits = 16){
				const result = [];
				let quotient = Math.floor(x);
				let fraction = x - quotient;

				// 整数部
				while(quotient > 0){
					let newQuotient = Math.floor(x / 16);
					let remainder = Math.floor(x - (newQuotient * 16));

					if(remainder > 9){
						result.unshift(String.fromCharCode(remainder + 55));
					}else{
						result.unshift(remainder.toString());
					}

					x = newQuotient;
					quotient = Math.floor(x);
				}

				if(result.length === 0){
					result.push('0');
				}

				// 小数部
				if(fraction !== 0){
					result.push('.');
					let safeCounter = 0;
					while(fraction > 0 && safeCounter < maxDigits){
						fraction *= 16;
						let integer = Math.floor(fraction);
						fraction -= integer;

						if(integer > 9){
							result.push(String.fromCharCode(integer + 55));
						}else{
							result.push(integer.toString());
						}

						safeCounter++;
						// fractionが十分小さくなったら無視
						if(fraction < 1e-12)break;
					}
				}

				return result.join('');
			}

			async generateTransactionId(method, path, options){
				const {
					key,
					keyBytes,
					animationKey,
					defaultKeyword,
					additionalRandomNumber
				} = options;

				const now = Date.now();
				const timeNow = Math.floor((now - 1682924400000) / 1000);
				const timeNowBytes = [
					(timeNow >> 0) & 0xFF,
					(timeNow >> 8) & 0xFF,
					(timeNow >> 16) & 0xFF,
					(timeNow >> 24) & 0xFF
				];

				const data = `${method}!${path}!${timeNow}${defaultKeyword}${animationKey.toLowerCase()}`;
				const hashBuffer = await crypto.subtle.digest('SHA-256', this.manualEncode(data));
				const hashArray = Array.from(structuredClone(new Uint8Array(hashBuffer))); // Firefoxでのエラー回避

				const randomNum = Math.floor(Math.random() * 256);

				const bytesArr = [
					...keyBytes,
					...timeNowBytes,
					...hashArray.slice(0, 16),
					additionalRandomNumber
				];

				const obfuscated = [randomNum, ...bytesArr.map(b => b ^ randomNum)];
				const base64 = this.base64Encode(obfuscated).replace(/=/g, '');

				return base64;
			}

			manualEncode(str){
				const bytes = new Uint8Array(str.length);
				for(let i=0;i<str.length;i++){
					bytes[i] = str.charCodeAt(i) & 0xFF;
				}
				return bytes;
			}

			getCubic(time, curves){
				if(time <= 0.0){
					let startGradient = 0.0;
					if(curves[0] > 0.0){
						startGradient = curves[1] / curves[0];
					}else if(curves[1] === 0.0 && curves[2] > 0.0){
						startGradient = curves[3] / curves[2];
					}
					return startGradient * time;
				}

				if(time >= 1.0){
					let endGradient = 0.0;
					if(curves[2] < 1.0){
						endGradient = (curves[3] - 1.0) / (curves[2] - 1.0);
					}else if(curves[2] === 1.0 && curves[0] < 1.0){
						endGradient = (curves[1] - 1.0) / (curves[0] - 1.0);
					}
					return 1.0 + endGradient * (time - 1.0);
				}

				let start = 0.0;
				let end = 1.0;
				let mid = 0.0;
				while(start < end){
					mid = (start + end) / 2;
					const x_est = this.calculateCubic(curves[0], curves[2], mid);
					if(Math.abs(time - x_est) < 0.00001){
						return this.calculateCubic(curves[1], curves[3], mid);
					}
					if(x_est < time){
						start = mid;
					}else{
						end = mid;
					}
				}
				return this.calculateCubic(curves[1], curves[3], mid);
			}

			calculateCubic(a, b, m){
				return 3.0 * a * (1.0 - m) * (1.0 - m) * m + 3.0 * b * (1.0 - m) * m * m + m * m * m;
			}

			base64Encode(bytes){
				const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
				return btoa(binary);
			}
		};

		debug(){
			console.log("TwitterApi");
			console.log({
				tweetsData: this.tweetsData,
				tweetsUserData: this.tweetsUserData,
				tweetsUserDataByUserName: this.tweetsUserDataByUserName,
				lists: this.lists,
				timelines: this.timelines,
				challengeData: this.#challengeData,
				graphqlApiUri: this.#graphqlApiUri,
				graphqlApiEndpoints: this.#graphqlApiEndpoints,
				endpointsAliases: this.#endpointsAliases,
				requestHeadersTemplate: this.#requestHeadersTemplate,
				graphqlFeatures: this.#graphqlFeatures,
				pendingTweetRequests: this.#pendingTweetRequests,
				pendingUserRequests: this.#pendingUserRequests,
				pendingTLRequests: this.#pendingTLRequests,
				apiRateLimit: this.#apiRateLimit,
				classSettings: this.#classSettings,
			});
		}
	}
	const twitterApi = new TwitterApi();
	window.addEventListener("scroll", update);
	init();
})();
