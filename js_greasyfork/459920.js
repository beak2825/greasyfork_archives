// ==UserScript==
// @name			PixivのリンクをTweetに添えて
// @name:ja			PixivのリンクをTweetに添えて
// @name:en			Show me your Pixiv.
// @version			1145141919810.2.6
// @description			Tweetの画像の下に(プロフィール欄にあれば)その人のPixivのリンクを表示します。
// @description:ja			Tweetの画像の下に(プロフィール欄にあれば)その人のPixivのリンクを表示します。
// @description:en			Display Pixiv link below the Tweet image.
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @match			https://x.com/*
// @match			https://X.com/*
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
// @icon			data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @grant			GM_xmlhttpRequest
// @license			MIT
// @namespace			https://greasyfork.org/ja/users/1023652
// @downloadURL https://update.greasyfork.org/scripts/459920/Pixiv%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92Tweet%E3%81%AB%E6%B7%BB%E3%81%88%E3%81%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/459920/Pixiv%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92Tweet%E3%81%AB%E6%B7%BB%E3%81%88%E3%81%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';
	const desktop_selector = {'tweet_field': 'article[data-testid="tweet"]','media_field': '.r-9aw3ui.r-1s2bzr4','profile_field': '[data-testid="UserProfileHeader_Items"]'};
	const mobile_selector = {'tweet_field': 'article[data-testid="tweet"]','media_field': '.r-9aw3ui.r-a1ub67 > .r-9aw3ui','profile_field': '[data-testid="UserProfileHeader_Items"]'};
	const deny_name = /^(home|explore|notifications|messages|i|settings|tos|privacy|compose|search)$/;
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
	const is_debug = false;
	let currentUrl = document.location.href;
	locationChange();
	var already_acquisition_arr = replace_null_to_something(JSON.parse(localStorage.getItem('user_pixvi_link_collection')),{});
	let updating = false;
	window.addEventListener("scroll", update);
	init();
	wait_load_Element_and_do_function(env_selector.profile_field,show_pixiv_link_in_profile);
	function write_content(target_node,screen_name,additional_linefeed = ''){
		if(target_node === null) return;
		if(get_only_particular_key_value(already_acquisition_arr,`${screen_name}.pixiv_url`) && !target_node.querySelector('.display_pixiv_link')){
			var new_content = document.createElement("span");
			new_content.innerHTML = `${additional_linefeed}<a class="display_pixiv_link" href="${already_acquisition_arr[screen_name].pixiv_url}" target="_blank" rel="noopener">Pixiv🔗</a>`;
			target_node.appendChild(new_content);
			return `${screen_name}のメディア欄に書き込みました。`;
		}
		return `${screen_name}のPixivのURLはすでに書き込まれています。`
	}
	function show_pixiv_link_in_tweet(target){
		var todo_promise_list = [];
		document.querySelectorAll(target).forEach((target_node, index)=> {
			const screen_name = target_node.querySelector('[data-testid="User-Name"]>div>div>a').href.split("/").pop();
			if(! get_only_particular_key_value(already_acquisition_arr,`${screen_name}.pixiv_url`)) return;
			todo_promise_list[index] = new Promise(async function(resolve){
				resolve(write_content(target_node.querySelector(env_selector.media_field),screen_name));
			});
		});
		Promise.allSettled(todo_promise_list).then(results => {
			results.forEach(result => {
				if(result.status === 'fulfilled'){
					debug_log(`${result.value}`);
				}else{
					debug_log(`Failure: ${result.reason}`);
				}
			});
		}).catch(error => debug_log(`Error: ${error}`));
	}
	function show_pixiv_link_in_profile(){
		var profile_field = document.querySelector(env_selector.profile_field);
		if(profile_field .querySelector('.display_pixiv_link') !== null){
			profile_field .querySelector('.display_pixiv_link').parentNode.remove();
		}
		var screen_name = currentUrl.split('/')[3];
		setTimeout(() => write_content(profile_field,screen_name,'<br>'),800);
	}

	function findTarget(target){
		var todo_promise_list = [];
		document.querySelectorAll(`${target}:not([is_pixiv_link_check="true"])`).forEach((target_node, index)=> {
			//なんども取得しないように。
			target_node.setAttribute("is_pixiv_link_check","true");
			//TwitterのID(@の後に見えるやつ)を取得。
			const screen_name = target_node.querySelector('[data-testid="User-Name"]>div>div>a').href.split("/").pop();
			if(already_acquisition_arr[screen_name]?.pixiv_url === undefined || (get_only_particular_key_value(already_acquisition_arr,`${screen_name}.Create_date`,0) + 604800000) <= new Date().getTime()){
				todo_promise_list[screen_name] = new Promise(async function(resolve){
					if(target_node.querySelector(env_selector.media_field) === null){
						resolve(`${screen_name}: 画像なし`);
					}else{
						const end_stat = await find_pixiv_link(screen_name);
						if(end_stat == "Too Many Requests"){
							console.log("API limit.");
						}else if(end_stat === false || end_stat === undefined){
							already_acquisition_arr[screen_name] = {"pixiv_url": null,"Create_date": new Date().getTime()};
							resolve(`${screen_name}: Pixivリンクなし`);
						}else{
							//httpをhttpsにする。
							already_acquisition_arr[screen_name] = {"pixiv_url": end_stat.replace(/^https?/,'https'),"Create_date": new Date().getTime()};
							//console.log(JSON.stringify(already_acquisition_arr))
							resolve(`${screen_name}: ${end_stat}`);
						}
					}
				});
			}
		});
		//連想配列だとうまくいかないので普通の配列に戻す。
		todo_promise_list = Object.values(todo_promise_list);
		Promise.allSettled(todo_promise_list).then(results => {
			results.forEach(result => {
				if(result.status === 'fulfilled'){
					debug_log(`${result.value}`);
				}else{
					debug_log(`Failure: ${result.reason}`);
				}
			});
		}).catch(error => debug_log(`Error: ${error}`)).then(() => {
			show_pixiv_link_in_tweet(env_selector.tweet_field);
			localStorage.setItem('user_pixvi_link_collection', JSON.stringify(already_acquisition_arr));
		});
	}
	async function find_pixiv_link(screen_name){
		if(screen_name.match(deny_name)) return undefined;
		const Pixiv_url_regex = /^https?:\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u)\/)[0-9]*)|me\/.*))/;
		return new Promise(async function(resolve){
			const request_object = new requestObject_twitter_1_1(screen_name);
			const Twitter_author_data = await request(request_object);
			if(Twitter_author_data.statusText == "Too Many Requests") return resolve("Too Many Requests");
			const urls_in_description = get_only_particular_key_value(Twitter_author_data,'response.entities.description.urls.url',[]);
			const urls_in_description_expanded = get_only_particular_key_value(Twitter_author_data,'response.entities.description.urls.expanded_url',[]);
			const urls_in_url_place = get_only_particular_key_value(Twitter_author_data,'response.entities.url.urls.url',[]);
			const urls_in_url_place_expanded = get_only_particular_key_value(Twitter_author_data,'response.entities.url.urls.expanded_url',[]);
			var urls = urls_in_description.concat(urls_in_description_expanded,urls_in_url_place,urls_in_url_place_expanded).filter(item => !/^https?:\/\/t\.co\//.test(item));
			var Pixiv_url;
			if(urls.length > 0){
				Pixiv_url = await find_pixiv_link_from_profile_urls(urls);
				if(Pixiv_url === undefined || Pixiv_url === null || Pixiv_url === false){
					urls = await expand_shortening_link(urls);
					Pixiv_url = await find_pixiv_link_from_profile_urls(urls);
					return resolve(Pixiv_url);
				}else{
					return resolve(Pixiv_url);
				}
			}
			return resolve(false);
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
			const Fanbox_url_regex = /^https?:(\/\/www\.pixiv\.net\/fanbox\/creator\/[0-9]*|\/\/.*\.fanbox\.cc\/?)/;
			return new Promise(async function(resolve,reject){
				var tmp_pixiv_url;
				tmp_pixiv_url = findMatch_from_array(urls_in_profile,Pixiv_url_regex,true);
				if (tmp_pixiv_url !== undefined) return resolve(tmp_pixiv_url);
				if(findMatch_from_array(urls_in_profile,Fanbox_url_regex) !== undefined){
					tmp_pixiv_url = await when_fanbox(findMatch_from_array(urls_in_profile,Fanbox_url_regex,true));
					if (Pixiv_url_regex.test(tmp_pixiv_url)){
						console.log(`「${screen_name}」のPixivのURLをFanboxから発見！`)
						return resolve(tmp_pixiv_url);
					}
				}else{
					var get_url_promise_list = [];
					urls_in_profile.forEach(target=>{
						switch(true){
							case /^https?:\/\/((skeb\.jp\/\@.*)|(fantia\.jp\/(fanclubs\/[0-9])?.*)|(.*\.booth\.pm)|(.*linktr\.ee)|(.*profcard\.info)|(.*lit\.link)|(potofu\.me)|(.*\.carrd\.co)|(.*\.tumblr\.com$)|(html\.co\.jp)|(twpf\.jp))\/?/.test(target):
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
				return resolve(false);
				async function when_general(target_url){
					return new Promise(async function(resolve,reject){
						const response_data = await request(new requestObject(target_url.replace(/^https?/,"https")));
						var response_data_urls = response_data.response.split(/\"|\<|\>/).filter(function(data_str){return data_str.match(/^https?:(\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u|fanbox\/creator)\/)[0-9].*)|me\/.*))|.*\.fanbox\.cc\/?)$/)});
						if(response_data_urls.find(function(element){return element.match(Pixiv_url_regex)}) !== undefined){
							console.log(`「${screen_name}」のPixivのURLを ${target_url.split("/")[2]} から発見！`);
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
								console.log(`「${screen_name}」のPixivのURLを pixiv sketchから発見！`);
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
	async function when_location_change(screen_name){
		if(!screen_name.match(deny_name)){
			const end_stat = await find_pixiv_link(screen_name);
			if(end_stat == "Too Many Requests"){
				console.log("API limit.");
			}else if(end_stat === false || end_stat === undefined){
				already_acquisition_arr[screen_name] = {"pixiv_url": null,"Create_date": new Date().getTime()};
			}else{
				already_acquisition_arr[screen_name] = {"pixiv_url":end_stat,"Create_date": new Date().getTime()};
				wait_load_Element_and_do_function(env_selector.profile_field,show_pixiv_link_in_profile);
			}
			localStorage.setItem('user_pixvi_link_collection', JSON.stringify(already_acquisition_arr));
		}
	}
	function debug_log(str_ = "debug"){
		if(is_debug === true){
			console.log(str_);
		}
	}
	function init() {
		findTarget(env_selector.tweet_field);
		show_pixiv_link_in_tweet(env_selector.tweet_field);
	}
	function update() {
		if(updating) return;
		updating = true;
		init();
		setTimeout(() => {updating = false;}, 1000);
	}

	function locationChange() {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(() => {
				if(currentUrl !== document.location.href){
					currentUrl = document.location.href;
					init();
					wait_load_Element_and_do_function(env_selector.profile_field,show_pixiv_link_in_profile);
					when_location_change(currentUrl.split("/")[3]);
				}
			});
		});
		const target = document.getElementById("react-root");
		const config = {childList: true,subtree: true};
		observer.observe(target, config);
	}
	function GetCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
    	}else{
        	return null;
		}
	}

	function findMatch_from_array(arr, regex, is_strict = false){
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
	function get_only_particular_key_value(object, path, defaultValue = undefined){
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

	function wait_load_Element_and_do_function(Element_Name,func,func_argument){
		const MAX_RETRY_COUNT = 5;
		var retry_counter = 0;
		var set_interval_id = setInterval(find_target_element, 500);
		function find_target_element(){
			retry_counter++;
			if(retry_counter > MAX_RETRY_COUNT) {
			clearInterval(set_interval_id);
                return;
			}
			var target_elements = document.querySelectorAll(Element_Name);
			if(target_elements.length > 0){
				if(typeof(set_interval_id) != 'undefined'){
					clearInterval(set_interval_id);
					func(func_argument,target_elements);
				}else{
					return target_elements;
				}
			}
		}
		find_target_element();
	}
	function replace_null_to_something(input_character,replace_character = " "){
		if(input_character === null || input_character === undefined || input_character === ""){
			return replace_character;
		}else{
			return input_character;
		}
	}
	async function request(object, timeout = 60000){
		return new Promise((resolve, reject) => {
			try{
				GM_xmlhttpRequest({
					method: object.method,
					url: object.url,
					headers: object.headers,
					responseType: object.respType,
					data: object.body,
					anonymous: object.anonymous,
					timeout: timeout,
					onload: function(responseDetails){
						//console.log(responseDetails);
						return resolve(responseDetails);
					},
					ontimeout: function(responseDetails){
						reject(`[request]time out:\nresponse ${responseDetails}`)
					},
					onerror: function(responseDetails){
						reject(`[request]error:\nresponse ${responseDetails}`)
					}
				});
			}catch(err){
				//console.log(err)
			}
		});
	}
	class requestObject_twitter{
		constructor(ID) {
			this.method = 'GET';
			this.respType = 'json';
			this.url = `https://api.twitter.com/graphql/rePnxwe9LZ51nQ7Sn_xN_A/UserByScreenName?variables=%7B%22screen_name%22%3A%22${ID}%22%2C%22withSafetyModeUserFields%22%3Afalse%2C%22withSuperFollowsUserFields%22%3Afalse%7D&features=%7B%22responsive_web_twitter_blue_verified_badge_is_enabled%22%3Afalse%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Afalse%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Afalse%7D`;
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
			this.screen_name = ID;
		}
	}
	class requestObject_twitter_1_1{
		constructor(ID) {
			this.method = 'GET';
			this.respType = 'json';
			this.url = `https://api.twitter.com/1.1/users/show.json?screen_name=${ID}`;
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
			this.screen_name = ID;
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
			};
		}
	}
	class requestObject{
		constructor(URL,addtional_cookie = undefined){
			this.method = 'GET';
			this.respType = '';
			this.url = `${URL}`;
			this.headers = {
				"Content-Type": "text/html,application/xhtml+xml,application/xml",
				'User-agent': navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Referer': URL,
				"Sec-Fetch-Mode": "navigate",
				'cookie': `${addtional_cookie}`
			};
			this.package = null;
		}
	}
	when_location_change(currentUrl.split("/")[3]);
})();
