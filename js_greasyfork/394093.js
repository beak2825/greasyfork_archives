// ==UserScript==
// @name         Xianzun manhuagui & omanhua Downloader(enhanced) 仙尊 漫画柜、哦漫画 下载器(增强版)
// @namespace    http://saber.love/?p=3407
// @version      3.4.1
// @description  下载 manhuagui.com 和 omanhua.net 的漫画，保存到浏览器的下载文件夹里。从任意页面下载皆可，会一直下载到最后一页（自动跨章节下载）
// @author       雪见仙尊（ian xia 修改）
// @match        https://*.manhuagui.com/comic/*
// @match        http://*.omanhua.com/comic/*
// @match        http://*.omanhua.net/comic/*
// @license 	GNU General Public License version 3
// @icon 		http://www.manhuagui.com/favicon.ico
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @connect     dx.yogajx.com
// @connect     i.yogajx.com
// @connect     p.yogajx.com
// @connect     i.hamreus.com
// @connect     dx.hamreus.com
// @connect     p.szhkshop.com
// @connect     pic.fxdm.cc
// @connect     us.hamreus.com
// @connect     static.7jfb.cn
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/394093/Xianzun%20manhuagui%20%20omanhua%20Downloader%28enhanced%29%20%E4%BB%99%E5%B0%8A%20%E6%BC%AB%E7%94%BB%E6%9F%9C%E3%80%81%E5%93%A6%E6%BC%AB%E7%94%BB%20%E4%B8%8B%E8%BD%BD%E5%99%A8%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394093/Xianzun%20manhuagui%20%20omanhua%20Downloader%28enhanced%29%20%E4%BB%99%E5%B0%8A%20%E6%BC%AB%E7%94%BB%E6%9F%9C%E3%80%81%E5%93%A6%E6%BC%AB%E7%94%BB%20%E4%B8%8B%E8%BD%BD%E5%99%A8%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

/**
 * 作者：雪见仙尊
 * 博客：https://saber.love/
 * QQ群：499873152
 * 3.0更新：manhuagui.com 设置了 X-Frame-Options: DENY，导致无法使用iframe来加载了，只好改成直接从页面抓取。
 * 现在有个已知的问题，每一章的最后一页有可能下载两次
 */

let isMHG = location.hostname.includes('.manhuagui.com') ? true : false; //区分漫画柜和哦漫画
let splitString = isMHG ? '#' : '?'; // 根据站点设置分页符
let safe_fileName_rule = new RegExp(/\\|\/|:|\?|"|<|>|\*|\|/g); // 安全的文件名
let comicName = document.querySelector('h1 a').innerHTML; //漫画名
let pageTotal = document.querySelectorAll('option').length; // 总页数
let userStop, output, outputE, hui;
let sessionKey = 'continueDown';
let timer_dealy = isMHG ? 500 : 1000;

function setDownloadStatus(boolean) {
	if (boolean) {
		sessionStorage.setItem(sessionKey, 'yes');
	} else {
		sessionStorage.removeItem(sessionKey);
	}
	// sessionStorage 对当前标签页生效（对从当前标签页里打开的页面也生效）。标签页关闭后自动清除。可以解决用户不经过确认直接关闭页面时，没有正常解锁的情况
}

// 创建开始按钮
let startDownload = document.createElement('a');
startDownload.id = 'startDownload';
startDownload.className = 'btn-red';
startDownload.innerHTML = '开始下载';
document.querySelector('.main-btn').appendChild(startDownload);
startDownload.style.background = '#0077D1';
startDownload.style.cursor = 'pointer';

// 创建下载 a 标签
let down_a = `<a href="" id="down_a" download></a>`;
document.body.insertAdjacentHTML('beforeend', down_a);
down_a = document.getElementById('down_a');

function addOutput() {
	//  创建用于输出提示信息的区域
	output = document.createElement('div');
	output.id = 'output';
	document.body.insertBefore(output, document.querySelector('.title'));
	document.querySelector('#output').style.cssText = 'width:960px;margin:0 auto;backgroundColor:#fff;padding:10px;fontSize:14px;';
	document.querySelector('#output').addEventListener('click', () => {
		if (!userStop) {
			if (confirm('你确定要停止下载吗？')) {
				userStop = true;
				setDownloadStatus(false);
				alert('下载已停止。');
			}
		}
	});
	outputE = document.querySelector('#output');
}

function GMDownload() { // 用于下载图片
	let imgUrl = document.querySelector('.mangaFile').getAttribute('src'); //图片网址
	if (imgUrl.includes('[') || imgUrl.includes(']')) { //如果url里含有[]这两个符号，会被encodeURI编码掉。所以encodeURI之后要在转换回来（我在这地方被坑了数小时）。但为什么下边还要再encodeURI一次？不经过二次encodeURI就不行，我也是好晕啊
		imgUrl = (encodeURI(imgUrl).replace(/%5B/g, '[')).replace(/%5D/g, ']');
	} else if (imgUrl.includes('%') && imgUrl.includes('%26') === false) { //如果含有已经转码过的汉字，就全解码成汉字，再编码。%26是排除&符号。但为什么还是需要第二次编码？
		imgUrl = encodeURI(decodeURI(imgUrl));
	} else { //虽然不知道为什么，总之编码两次就对了
		imgUrl = encodeURI(imgUrl);
	}
	hui = document.querySelector('h2').innerHTML; //第几回
	let pageNum = document.querySelector('#page').innerHTML.padStart(3, '0'); // 第几页（修改为用0补全到3位数）
	let ext = imgUrl.split('/').pop();
	ext = ext.substr(ext.indexOf('.')); //取出后缀名
	ext = ext.split('?cid')[0].split('?')[0];
	let fullFileName = (comicName + '_' + hui + '_第' + pageNum + '页').substr(0, 200).replace(safe_fileName_rule, '') + ext; //设置文件名 后缀名都改为jpg

	let nowPageNo;
	nowPageNo = parseInt(document.querySelector('#pageSelect').value); // 现在的页码
	outputE.innerHTML = '正在下载 ' + hui + '第' + nowPageNo + '页 点击可设置停止。';

	GM_xmlhttpRequest({
		method: 'GET',
		url: imgUrl,
		headers: {
			referer: window.location.href.split(splitString)[0]
		},
		responseType: 'blob',
		onload: function (xhr) {
			xhr.response.type = 'image/jpeg';
			let blobURL = window.URL.createObjectURL(xhr.response);
			down_a.href = blobURL;
			down_a.download = fullFileName;
			down_a.click();
			window.URL.revokeObjectURL(blobURL);

			setTimeout(() => { // 在测试时，发现哦漫画的页面加载太快，导致很多下载的图片来不及保存，所以加上延时。
				if (nowPageNo === pageTotal) { //如果已经最后一页
					document.querySelector('.nextC').click(); // 点击下一章
					let t = setInterval(() => {
						if (document.querySelector('#pb')) { //如果出现提示框，则认为没有下一章了
							clearInterval(t);
							userStop = true;
							setDownloadStatus(false);
							alert('已经到达最后一页，下载完毕！');
							return false;
						}
					}, 500);
				} else { //如果还有下一页
					document.querySelector('#next').click(); // 点击下一页按钮
				}
			}, timer_dealy);
		}
	});
}

// 点击下载按钮时执行
document.querySelector('#startDownload').addEventListener('click', () => {
	userStop = false;

	addOutput();

	setDownloadStatus(true); // 每次下载时初始化

	readyDownload(); // 点击下载按钮时，首先下载当前页

	if (isMHG) {
		window.addEventListener('hashchange', () => {
			// 这里只在漫画柜生效，因为漫画柜加载下一页是改变hash的。哦漫画没有hash而且需要重新加载页面
			readyDownload();
		});
	}

	function readyDownload() {

		window.stop();

		if (userStop) {
			return false;
		}

		GMDownload();
	}
});

// 是否自动继续下载
if (sessionStorage.getItem('continueDown') !== null) {
	document.querySelector('#startDownload').click(); // 模拟点击，自动继续下载
}