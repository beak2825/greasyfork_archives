// ==UserScript==
// @name         JAVBUS预告片
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  javbus自动显示预告片
// @author       jibi
// @include      *://www.*bus*/*
// @include     *://*javbus.com/*
// @exclude      /https?:\/\/www\.(\w{3})?bus(\w{3})?\.\w{3}\/$/
// @exclude      https://www.*bus*/forum/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?domain=www.buscdn.xyz/
// v0.2          优化视频的展现方式
// v0.2.1        fix a bug
// v0.2.1        fix a bug
// v0.3          更新了非科学版本
// @downloadURL https://update.greasyfork.org/scripts/434185/JAVBUS%E9%A2%84%E5%91%8A%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/434185/JAVBUS%E9%A2%84%E5%91%8A%E7%89%87.meta.js
// ==/UserScript==

(function () {
	'use strict';
	let log = console.log;
	let url = location.href;
	let main_re = /https?:\/\/www\.(\w{3})?bus(\w{3})?\.\w{3}\/$/
	if(main_re.test(url)){
		log('这是主页');
		return '';
	}
	let avid = url.split('/').pop();
	let big_img =  document.querySelector('a.bigImage img');
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
	 
	function set_style(){
		 // 创建style标签，#mask:befero伪元素
		const styleElement = document.createElement('style');
		styleElement.innerText = `
			#mask:before {
				content: "x";
				font-size: 50px;
				color: white;
				opacity: 0.7;
				right: 10px;
				top: -15px;
				position: absolute;
				cursor: pointer;
			}
			
			div.sample-box div.photo-frame:after {
				background: url(https://javdb32.com/packs/media/images/btn-play-b414746c.svg) 50% no-repeat;
				background-color: rgba(0,0,0,.2);
				background-size: 40px 40px;
				bottom: 0;
				content: "";
				display: block;
				left: 0;
				position: absolute;
				right: 0;
				top: 0;
				height: calc(100% - 6px);
			}
			`;
		document.head.append(styleElement);
		
	} 
	
	set_style();
	
	
	function add_video(video_url) {
        const sampleWaterFall = document.getElementById('sample-waterfall');
        let divElement = document.createElement('div');
        if (sampleWaterFall) {
            divElement.className = 'sample-box';
            divElement.style.cursor = 'pointer';
			divElement.style.setProperty('position', 'relative');
			let photo_frame = document.createElement('div');
			photo_frame.className = 'photo-frame';
			divElement.appendChild(photo_frame);
			if(big_img!=null){
				let temp = big_img.cloneNode(false);
				photo_frame.appendChild(temp);
			}
            sampleWaterFall.prepend(divElement);
        }else {
            const clearfix = document.getElementsByClassName('clearfix')[0];
            let div_box  = document.createElement('div');
			div_box.id = 'sample-waterfall';
			div_box.innerHTML = `
                <div class="sample-box" style="cursor: pointer;">
				<div class="photo-frame"></div>                
                </div>
            `;
			divElement = div_box.querySelector('div.sample-box')

			if(big_img!=null){
				let temp = big_img.cloneNode(false);
				let box = div_box.querySelector('div.sample-box div.photo-frame');
				box.style.setProperty('position', 'relative');
				box.appendChild(temp);
			}
			let img_tit = document.createElement('h4');
			img_tit.innerText = '樣品圖像';
            clearfix.before(img_tit, div_box);
        }
        divElement.addEventListener('click', () => {
            const bodyElement = document.body;
            let maskDivElement = document.getElementById('mask');
            if (!maskDivElement) {
                maskDivElement = document.createElement('div');
                maskDivElement.id = 'mask';
                maskDivElement.innerHTML = `
                    <video id="preview-video" playsinline controls preload="none" autoplay="autoplay" style="display:block;position:relative;transform: translateY(-50%);margin: 0 auto;top:50%;width: 73%; height: 80%;" >
                        <source src="${video_url}" type="video/mp4" />
                    </video>
                `;
                maskDivElement.setAttribute('style', 'position:fixed;height:100%;width:100%;background-color:rgba(0,0,0,0.8);top:0px;z-index:999;display:block;');
                // 点击 X 关闭
                maskDivElement.addEventListener('click', () => {
                    maskDivElement.style.display = 'none';
                    document.querySelector('video').pause();
                    bodyElement.style.overflow = 'auto';
                }); 
				bodyElement.append(maskDivElement);   
				document.getElementById('preview-video').addEventListener('click',(e)=>{
					e.stopPropagation();
				});
            }else {
                maskDivElement.style.display = 'block';
                document.querySelector('video').play();
                bodyElement.style.overflow = 'hidden';		
            }
        });
	}

	let first_url = `http://dmm.xrmoo.com/sindex.php?searchstr=${avid}`;
	let r18_url = `https://www.r18.com/common/search/searchword=${avid}/`;
	let promise = request(first_url);
	promise.then((res) => {
		let doc = parsetext(res.responseText);
		let a = doc.querySelector('a[class="link viewVideo"]');
		let video_url;
		if(a!=null){
			video_url = a.getAttribute('data-link');
			video_url=video_url.replace('_sm_','_dmb_')
			add_video(video_url);
			throw new Error('add video done');
		}
		return request(r18_url);
	})
	.then((res) => {
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