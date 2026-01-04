// ==UserScript==
// @name         uraaka-joshi.com downloader
// @namespace    https://saber.love/?namespace=uraaka-joshi.com
// @version      0.3
// @description  uraaka-joshi.com crawler. 抓取 uraaka-joshi.com 的图片和视频的网址。在列表页面使用。
// @author       saber
// @match        https://www.uraaka-joshi.com/*
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/376393/uraaka-joshicom%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/376393/uraaka-joshicom%20downloader.meta.js
// ==/UserScript==

let img_result = [];
let video_result = [];
let now_no;
if (!location.href.includes('.html')) { // 没有页码
	now_no = 1; // 第一页
} else {
	now_no = parseInt(/\d*\d\./.exec(location.href)[0]); // 当前页码
}
let start_url = location.href.split('pages/')[0];
let parser = new DOMParser();
let max = now_no + 100;
let tipbar;

function start () {
	fetch(getUrl())
		.then(res => {
			if (res.status === 404) {
				tipbar.innerHTML = '已到达最后一页';
				showResult();
				return false;
			}
			res.text()
				.then(res => {
					let _DOM = parser.parseFromString(res, 'text/html');
					// 添加图片网址
					let imgs = _DOM.querySelectorAll('.post .photo-content img');
					let imgurls = Array.from(imgs).map(el => {
						return el.src.replace(/\w{1}_thumb_/, '');
					});
					img_result = img_result.concat(imgurls);
					// 添加视频网址
					let videos = _DOM.querySelectorAll('.adaptive-video video');
					let videourls = Array.from(videos).map(el => {
						return el.src;
					});
					video_result = video_result.concat(videourls);
					// 开始下一页
					tipbar.innerHTML = '页码 ' + now_no;
					now_no++;
					if (now_no > max) {
						tipbar.innerHTML = '已达到每次抓取最大页数：' + max;
						showResult();
						return false;
					}
					start();
				})
		})
}

function getUrl () {
	if (now_no === 1) {
		return start_url;
	} else {
		return start_url + 'pages/' + now_no + '.html';
	}
}

function showResult () {
	document.querySelectorAll('#xzd textarea')[0].innerHTML = [...new Set(img_result)].join('\r\n')
	document.querySelectorAll('#xzd textarea')[1].innerHTML = [...new Set(video_result)].join('\r\n')
}

document.addEventListener('DOMContentLoaded', () => {
	let pageno = document.querySelector('.pagination');
	if (pageno) {
		let input = `<span>抓取页数：<input type="text" placeholder="页码" value="100" id="xzdPageInput" style="max-width: 150px;" /></span>`
		let xzdBtn = `<button id="xzdBtn" style="background: #89c8f9;">开始下载</button>`;
		let xzdhtml = `<div id="xzd" style="display:none;">
		<p>进度提示</p>
		<fieldset>
			<legend>图片 url</legend>
			<textarea style="width:500px;height:100px;"></textarea>
		</fieldset>
		<fieldset>
			<legend>视频 url</legend>
			<textarea style="width:500px;height:100px;"></textarea>
		</fieldset>
	</div>`;
		document.querySelector('.content-main').insertAdjacentHTML('afterbegin', xzdhtml);
		document.querySelector('.content-main').insertAdjacentHTML('afterbegin', xzdBtn);
		document.querySelector('.content-main').insertAdjacentHTML('afterbegin', input);
		document.querySelector('#xzdBtn').onclick = function () {
			const wantPage = parseInt(document.querySelector('#xzdPageInput').value)
			if (wantPage) {
				max = now_no + wantPage - 1
			}
			start();
			this.disabled = true;
			document.querySelector('#xzd').style.display = "block";
			tipbar = document.querySelector('#xzd p');
		}
	}
})