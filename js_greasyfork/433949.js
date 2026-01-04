// ==UserScript==
// @name         MICIDOL|CEVERIA|TELEGRA.PH 写真打包
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  MIC IDOL等网站写真打包下载，更多站点的支持以后添加。
// @author       JIBI
// @license      MIT
// @match        https://www.micmicidol.com/*/*/*.html
// @match        https://www.micmicdoll.com/*/*/*.html
// @match        http*://everia.club/*/*/*/*/
// @match        https://telegra.ph/*
// @icon         https://www.google.com/s2/favicons?domain=micmicdoll.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jszip/3.1.4/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.2/FileSaver.min.js
// v0.2          修复了已知问题
// v0.3          新增对telegra.ph的支持
// v0.3.1        修复bug
// v0.3.2        修复bug
// v0.3.3        修复图片乱序问题
// @downloadURL https://update.greasyfork.org/scripts/433949/MICIDOL%7CCEVERIA%7CTELEGRAPH%20%E5%86%99%E7%9C%9F%E6%89%93%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/433949/MICIDOL%7CCEVERIA%7CTELEGRAPH%20%E5%86%99%E7%9C%9F%E6%89%93%E5%8C%85.meta.js
// ==/UserScript==
(function () {
	'use strict';
	const sites = {
		MICIDOL: 'MICIDOL',
		EVERIA: 'EVERIA',
		TELEGRAPH: 'TELEGRAPH'
	}


	let is_down = false;
	let site = sites.MICIDOL;
	let host = location.host;
	function contains(key) {
		return host.indexOf(key) != -1;
	}
	if (contains('everia')) {
		site = sites.EVERIA;
	} else if (contains('telegra')) {
		site = sites.TELEGRAPH;
	}
	let log = console.log;
	const title_rules = {
		MICIDOL: 'h3[class="post-title entry-title"]',
		EVERIA: 'h1.entry-title',
		TELEGRAPH: 'header[class="tl_article_header"] h1'
	}
	const image_rules = {
		MICIDOL: 'div.post-body.entry-content a[href] img',
		EVERIA: 'div.entry-content div a[href] img',
		TELEGRAPH: 'div.figure_wrapper img'
	}
	let titEle = document.querySelector(title_rules[site]);
	if (titEle == null) {
		titEle = document.querySelector('title');
	}
	let title = titEle.innerText.trim();
	log(title);
	let show = document.createElement('button');

	const btn_style = '.show_btn{position:fixed;left:50px;bottom:50px;width: 50px; height: 50px; border-radius:50%;border: none;background-color: #f44949;border: 1px solid #f44949;color:#fff;padding:0;}' +
		'.show_btn:active{background-color: #ca8e9f;}'
	let t = document.createElement('style');
	t.innerText = btn_style;
	document.querySelector('head').appendChild(t);
	show.innerText = 'DOWNLOAD';
	show.setAttribute('class', 'show_btn');
	document.body.appendChild(show);
	
	function zeropadding(n){
		const max = 3;
		let s = String(n);
		let len = s.length;
		if(len < max){
			let x = max - len;
			for(let i = 0;i<x;i++){
				s='0'+s;
			}
		}
		return s;
	}
	function request(url, referrerStr, timeoutInt = 100000) {
		return new Promise((resolve, reject) => {
			//console.log(`发起网址请求：${url}`);
			GM_xmlhttpRequest({
				url,
				method: 'GET',
				overrideMimeType: 'text/plain; charset=x-user-defined',
				headers: {
					"Cache-Control": "no-cache",
					referrer: referrerStr
				},
				timeout: timeoutInt,
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
					//console.log(response);
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

	let img_eles = document.querySelectorAll(image_rules[site]);
	let imgs = [];
	for (let x of img_eles) {
		if (x.getAttribute('width') != null || x.getAttribute('data-original-width') != null) {
			x = x.parentElement;
		}
		let img_url = x.href !== undefined ? x.href : x.src;
		imgs.push(img_url);
	}
	//imgs = imgs.filter((x)=>x.endsWith('.jpg'));
	//log(imgs)
	let num = imgs.length;
	log('total img: ', num);
	let downloaded = 0;
	let zip = new JSZip();
	let folder = zip.folder(title);
	let promises = [];
	function zip_img() {
		for (let index = 0;index<num;index++) {
			let img = imgs[index];
			let p = request(img);
			p.then(res => {
				// let url = res.url;
				if (res.loadstuts == false) {
					throw new Error('下载失败');
				}
				let img_name =  zeropadding(index)+'.jpg';
				log('下载完成: ' + img_name)
				var r = res.responseText, data = new Uint8Array(r.length), i = 0;
				while (i < r.length) {
					data[i] = r.charCodeAt(i);
					i++;
				}
				var blob = new Blob([data], { type: 'image/jpeg' }); // 转为Blob类型
				folder.file(img_name, blob, { binary: true }); // 压入zip中
				downloaded++;
				show.innerText = `waiting ${downloaded}/${num}`;
				console.log(`waiting ${downloaded}/${num}`);
			}).catch(reason => {
				console.log('download error: ', reason);
			})
			promises.push(p);
		}
		Promise.all(promises).then(() => {
			is_down = true;
			show.enable = true;
			show.innerText = 'COMPELETE!'
			log(`共下载: ${downloaded}/${num}`)
			zip.generateAsync({ type: "blob", base64: true }).then(function (content) {
				saveAs(content, title + ".zip");
			});
		}).catch(reason => {
			log('final error -> ', reason)
		})

	}

	show.onclick = function () {
		if (!is_down) {
			show.enable = false;
			show.innerText = 'please wait...'
			zip_img();
		} else {
			log('已下载，请勿重复点击！')
		}
	}

})();