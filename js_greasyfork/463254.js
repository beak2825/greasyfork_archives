// ==UserScript==
// @name		[Twitter]アイコンを鳥に
// @name:ja		[Twitter]アイコンを鳥に
// @name:en			[Twitter] ashes to ashes, dust to dust, Twitter to Twitter.
// @version			1145141919810.0.13
// @description			Twitterのアイコンを鳥に戻します。
// @description:ja			Twitterのアイコンを鳥に戻します。
// @description:en			Change the Twitter icon back a bird.
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @match			https://x.com/*
// @match			https://X.com/*
// @connect			abs.twimg.com
// @icon			data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @license			MIT
// @namespace			https://greasyfork.org/ja/users/1023652
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463254/%5BTwitter%5D%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%82%92%E9%B3%A5%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/463254/%5BTwitter%5D%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%82%92%E9%B3%A5%E3%81%AB.meta.js
// ==/UserScript==
/*
var i18nUrl,nonce;
document.head.querySelectorAll('link').forEach(l=>{
	if(l.href.match(/i18n\/ja\..*\.js/)){i18nUrl = l.href;nonce = l.nonce;l.remove();}
});
*/
class requestObject{
	constructor(URL, cookies) {
		this.method = 'GET';
		this.respType = 'json';
		this.url = URL;
		this.body = null;
		this.headers = {
		};
		this.package = null;
		this.anonymous = false;
	}
}
(async function() {
	'use strict';
	//const xLogoPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
	//const xLogoPath = "M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"
	const xLogoPath = "M18.436 1.92h3.403l-7.433 8.495 8.745 11.563h-6.849l-5.363-7.012-6.136 7.012H1.4l7.951-9.088L.96 1.92h7.02l4.848 6.41 5.608-6.41zm-1.194 18.021h1.886L6.958 3.851H4.933l12.308 16.09z";
	const birdPath = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";
	const twitterColor = "rgb(29, 155, 240)";
	const loadingBirdColor = "rgba(29,161,242,1.00)";
	/*
	var response;
	response = (await request(new requestObject(i18nUrl))).responseText;
	response = response.replace(/リポスト/g,"リツイート");
	response = response.replace(/ポスト/g,"ツイート");
	response = response.replace(/reposts/g,"retweets");
	response = response.replace(/repost/g,"retweet");
	response = response.replace(/posts/g,"tweets");
	response = response.replace(/post/g,"tweet");
	response = response.replace(/('(?:\\.|[^'])*')|(X)/g, function(match, p1, p2){
		return p2 ? "Twitter" : match;
	});
	//response = response.replace(/\(self\.webpackChunk_twitter_responsive_web\=self\.webpackChunk_twitter_responsive_web\|\|\[\]\)\.push\(/,'var\ numb\ \=\ 0\;for\(let\ a\ of\ \(self\.webpackChunk_twitter_responsive_web\ \=\ self\.webpackChunk_twitter_responsive_web\ \|\|\ \[\]\)\)\{if\(a\[0\]\[0\]\ \=\=\ \"i18n\/ja\"\)\{break\}else\{numb\ \=\ numb\+1\}\}\;webpackChunk_twitter_responsive_web\[numb\]\ \=\ ');
	//response = response.replace(/\]\)\;/,',\]\;');
	//console.log(response)
	//console.log(a.href)
	const script = document.createElement('script');
	script.text = response;
	script.setAttribute('nonce', nonce);
	document.head.appendChild(script);
	*/
	const style = document.createElement("style");
	style.innerHTML = `
	path[d="${xLogoPath}"]{
		d:path("${birdPath}");
		fill: inherit;
		color: ${twitterColor};
	}

	div[style="color: rgb(239, 243, 244);"] > svg > g > path[d="${xLogoPath}"] {
		color: rgb(239, 243, 244);
	}
	header h1 a[href="/home"] svg path{
		d:path("${birdPath}");
		fill: inherit;
		color: ${twitterColor};
	}
	div[aria-label="Loading…"] > svg > g > path {
		d:path("${birdPath}");
		fill: inherit;
		color: ${loadingBirdColor};
	}
	`;

	const i = setInterval(async ()=>{
		const head = document.head;
		if(head !== null){
			//"https://abs.twimg.com/favicons/twitter.2.ico"
			await sleep(1000);
			document.querySelector('[rel="shortcut icon"]').href = "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=";
			head.appendChild(style);
			clearInterval(i);
		}
	});
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
					reject(`[request]time out:\nresponse ${responseDetails}`)
				},
				onerror: function(responseDetails) {
					reject(`[request]error:\nresponse ${responseDetails}`)
				}
			});
		});
	}
	function sleep(time){
		return new Promise((resolve)=>{
			setTimeout(()=>{return resolve(time)}, time);
		});
	}
})();
