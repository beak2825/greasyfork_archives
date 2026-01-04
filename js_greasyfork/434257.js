// ==UserScript==
// @name         JAVBUS预告片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  javbus自动显示预告片
// @author       jibi
// @include     *://www.*bus*/*
// @exclude     /https?:\/\/www\.(\w{3})?bus(\w{3})?\.\w{3}\/$/
// @exclude      https://www.*bus*/forum/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?domain=www.buscdn.xyz/
// @downloadURL https://update.greasyfork.org/scripts/434257/JAVBUS%E9%A2%84%E5%91%8A%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/434257/JAVBUS%E9%A2%84%E5%91%8A%E7%89%87.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	let log = console.log;
	let url = location.href;
	let main_re = /https?:\/\/www\.(\w{3})?bus(\w{3})?\.\w{3}\/$/
	if(main_re.test(url)){
		log('这是主页');
		return ''
	}
	let avid = url.split('/').pop();
	function request(url, referrerStr, timeoutInt) {
		return new Promise((resolve, reject) => {
			console.log(`发起网址请求：${url}`);
			GM_xmlhttpRequest({
				url,
				method: 'GET',
				headers: {
					"Cache-Control": "no-cache",
					referrer: referrerStr,
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
				},
				timeout: timeoutInt > 0 ? timeoutInt : 20000,
				onload: response => { //console.log(url + " reqTime:" + (new Date() - time1));
					response.loadstuts = true;
					resolve(response);
				},
				onabort: response => {
					console.log(url + " abort");
					response.loadstuts = false;
					resolve(response);
				},
				onerror: response => {
					console.log(url + " error");
					console.log(response);
					response.loadstuts = false;
					resolve(response);
				},
				ontimeout: response => {
					console.log(`${url} ${timeoutInt}ms timeout`);
					response.loadstuts = false;
					response.finalUrl = url;
					resolve(response);
				},
			});
		});
	}
 
	function set_style(){
		const video_style = `
		.video_holder{
			position:absolute;
			top:50%;
			left:50%;
			margin:-225px 0 0 -400px;
		}
		`
		let t = document.createElement('style');
		t.innerText = video_style;
		document.querySelector('head').appendChild(t);
	}
	// set_style();
 
	function parsetext(text) {
		try {
			//let doc = (new DOMParser).parseFromString("需要将其解析为Document的字符串", "text/html");
			let doc = document.implementation.createHTMLDocument('');
			doc.documentElement.innerHTML = text;
			return doc;
		}catch (e) {
			alert('parse error');
		}
	}
	let search_url = `https://www.r18.com/common/search/searchword=${avid}/`;
	log(search_url);
	let promise = request(search_url);
	/*
	<video id="preview-video" playsinline="" controls="" muted="" preload="auto" style="display:none">
			  <source src="//cc3001.dmm.co.jp/litevideo/freepv/h/h_3/h_346rebd594/h_346rebd594_dmb_w.mp4" type="video/mp4">
	</video>
	*/
	function add_video(video_url) {
		let v = `
			 <video id="preview-video" playsinline controls preload="auto" >
              <source src="//cc3001.dmm.co.jp/litevideo/freepv/h/h_3/h_346rebd594/h_346rebd594_dmb_w.mp4" type="video/mp4" />
            </video>
			`
		let ele = document.createElement('div');
		ele.setAttribute('class','video_holder');
		ele.innerHTML = v;
		ele.querySelector('source').setAttribute('src', video_url);
		let movie = document.getElementsByClassName('row movie')[0];
		// let movie = document.getElementsByTagName('body')[0];
		movie.appendChild(ele);
	}
 
	promise.then((res) => {
		let doc = parsetext(res.responseText);
		let a = doc.getElementsByClassName('js-view-sample')[0];
		let video_url;
		if (a !== undefined) {
			video_url = a.getAttribute('data-video-high');
			log('video_url -> ', video_url);
			add_video(video_url);
			throw new Error('add video done');
		} else {
			let p = request(`https://www.mgstage.com/product/product_detail/${avid}/`);
			return p;
		}
	}).then((res) => {
		let doc = parsetext(res.responseText);
		let ele = doc.querySelector('div.detail_photo p.sample_movie_btn a');
		if (ele != null) {
			let href = ele.getAttribute('href');
			let pid = href.split('/').pop();
			log('pid -> ', pid);
			href = `https://www.mgstage.com/sampleplayer/sampleRespons.php?pid=${pid}`;
			let p = request(href);
			return p;
		} else {
			let href = `https://www.dmm.co.jp/mono/dvd/-/search/=/searchstr=${avid}/`;
			let p = request(href);
			return p;
		}
	}).then((res) => {
		let final_url = res.finalUrl;
		let re = /www\.(.*?)\.co/
		let site = re.exec(final_url)[1];
		switch (site) {
			case 'mgstage':
				let re = /https.*?ism/
				let json_obj = JSON.parse(res.responseText);
				let video_url = json_obj['url'];
				video_url = re.exec(video_url)[0].replace('ism', 'mp4');
				add_video(video_url);
				throw new Error('add video done');
				break;
			case 'dmm':
				let doc = parsetext(res.responseText);
				let ele = doc.querySelector('ul#list li p.tmb a');
				if (ele != null) {
					let href = ele.getAttribute('href');
					let re = /cid=.*?(\/)/
					let cid = re.exec(href)[0];
					cid = cid.replace('/', '');
					href = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/${cid}/mtype=AhRVShI_/service=mono/floor=dvd/mode=/`;
					let p = request(href)
					return p;
				} else {
					throw new Error('target av not found,fuck!')
				}
			default:
				throw new Error('target av not found,fuck!')
		}
 
	}).then((res) => {
		let text = res.responseText;
		let re = /src":"(.*?.mp4)/g;
		re.test(text);
		let url = RegExp.$1;
		url = url.replace(/\\/, '');
		url = url.replace(/\\/, '');
		let video_url = 'https:' + url;
		add_video(video_url);
	}).catch(msg => {
		log('Msg: ', msg)
	})
 
})();