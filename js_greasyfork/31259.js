// ==UserScript==
// @name		bilibiliDanmaku
// @name:zh-CN	哔哩哔哩弹幕姬
// @namespace	https://github.com/sakuyaa/gm_scripts
// @author		sakuyaa
// @description	在哔哩哔哩视频标题下方增加弹幕查看和下载
// @include		http*://www.bilibili.com/video/av*
// @include		http*://www.bilibili.com/video/BV*
// @include		http*://www.bilibili.com/watchlater/#/av*
// @include		http*://www.bilibili.com/watchlater/#/BV*
// @include		http*://www.bilibili.com/medialist/play/*/*
// @include		http*://www.bilibili.com/bangumi/play/*
// @version		2020.11.1
// @compatible	firefox 52
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/31259/bilibiliDanmaku.user.js
// @updateURL https://update.greasyfork.org/scripts/31259/bilibiliDanmaku.meta.js
// ==/UserScript==
(function() {
	let view, download, downloadAll, downloadPast, subSpan, downloadSub, convertSub;
	
	//拦截pushState和replaceState事件
	let historyFunc = type => {
		let origin = history[type];
		return function() {
			let e = new Event(type);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return origin.apply(history, arguments);
		};
	};
	history.pushState = historyFunc('pushState');
	history.replaceState = historyFunc('replaceState');
	
	let sleep = time => {
		return new Promise(resolve => setTimeout(resolve, time));
	};
	let fetchFunc = (url, type) => {
		let init = {};
		if (url.indexOf('.bilibili.com/') > 0) {
			init.credentials = 'include';
		}
		return fetch(url, init).then(response => {
			if (!response.ok) {
				throw new Error(`bilibiliDanmaku：${response.status} ${response.statusText}\n无法加载：${url}`);
			}
			switch (type) {
			case 'blob':
				return response.blob();
			case 'json':
				return response.json();
			default:
				return response.text();
			}
		});
	};
	//获取视频发布日期
	let fetchPubDate = async () => {
		let response = await fetchFunc(`https://api.bilibili.com/x/web-interface/view?${window.bvid ? 'bvid=' + window.bvid : 'aid=' + window.aid}`, 'json');
		if (response.data.pubdate) {
			let pubDate = new Date(response.data.pubdate * 1000);
			if (!isNaN(pubDate)) {
				return pubDate;
			}
		}
		return null;
	};
	//获取CC字幕列表
	let fetchSubtitles = async () => {
		let response = await fetchFunc(`https://api.bilibili.com/x/web-interface/view?${window.bvid ? 'bvid=' + window.bvid : 'aid=' + window.aid}`, 'json');
		if (response.data.subtitle.list) {
			return response.data.subtitle.list;
		}
		return [];
	};
	//秒转化为时分秒
	let formatSeconds = seconds => {
		let h = Math.floor(seconds / 3600);
		if (h < 10) {
			h = '0' + h;
		}
		let m = Math.floor((seconds / 60 % 60));
		if (m < 10) {
			m = '0' + m;
		}
		let s = Math.floor((seconds % 60));
		if (s < 10) {
			s = '0' + s;
		}
		let ms = '00' + Math.floor(seconds * 1000 % 1000);
		return `${h}:${m}:${s}.${ms.substr(-3)}`;
	}
	
	let danmakuFunc = async () => {
		//查看弹幕
		view.setAttribute('href', `https://comment.bilibili.com/${window.cid}.xml`);
		//下载弹幕
		download.removeAttribute('download');
		download.setAttribute('href', 'javascript:;');
		download.onclick = async () => {
			let danmaku = await fetchFunc(`https://api.bilibili.com/x/v1/dm/list.so?oid=${window.cid}&bilibiliDanmaku=1`, 'blob');
			download.onclick = null;
			download.setAttribute('download', document.title.split('_')[0] + '.xml');
			download.setAttribute('href', URL.createObjectURL(danmaku));
			download.dispatchEvent(new MouseEvent('click'));
		};
		//全弹幕下载
		downloadAll.removeAttribute('download');
		downloadAll.setAttribute('href', 'javascript:;');
		downloadAll.onclick = async () => {
			try {
				//加载当前弹幕池
				let danmakuMap = new Map();
				let danmaku = await fetchFunc(`https://api.bilibili.com/x/v1/dm/list.so?oid=${window.cid}&bilibiliDanmaku=1`);
				let danmakuAll = danmaku.substring(0, danmaku.indexOf('<d p='));
				let exp = new RegExp('<d p="([^,]+)[^"]+,(\\d+)">.+?</d>', 'g');
				while ((match = exp.exec(danmaku)) != null) {
					danmakuMap.set(parseInt(match[2]), [parseFloat(match[1]), match[0]]);
				}
				//获取视频发布日期
				let now = new Date();
				let pubDate, year, month;
				let dateNode = document.querySelector('.video-data span:nth-child(2)');
				if (dateNode) {
					pubDate = new Date(dateNode.textContent);
					if (isNaN(pubDate)) {
						pubDate = await fetchPubDate();
					}
				} else {
					pubDate = await fetchPubDate();
				}
				if (!pubDate) {
					alert('获取视频投稿时间失败！');
					return;
				}
				year = pubDate.getFullYear();
				month = pubDate.getMonth() + 1;
				//计算历史月份
				let monthArray = [];
				while (year * 100 + month <= now.getFullYear() * 100 + now.getMonth() + 1) {
					monthArray.push(`https://api.bilibili.com/x/v2/dm/history/index?type=1&oid=${window.cid}&month=${year + '-' + ('0' + month).substr(-2)}`);
					if (++month > 12) {
						month = 1;
						year++;
					}
				}
				//增加延迟
				let delay;
				if((delay = prompt('由于网站弹幕接口改版新的API限制获取速度，全弹幕下载需要有获取间隔，会导致该功能需要很长很长时间进行弹幕获取（视投稿时间而定，每天都有历史数据的话获取一个月大概需要20多秒），请输入获取间隔（若仍出现获取速度过快请适当加大间隔，单位：毫秒）', 299)) == null) {
					return;
				}
				if(isNaN(delay)) {
					alert('输入值不是数值！');
					return;
				}
				//进度条
				let progress = document.createElement('progress');
				progress.setAttribute('max', monthArray.length * 1000);
				progress.setAttribute('value', 0);
				progress.style.position = 'fixed';
				progress.style.margin = 'auto';
				progress.style.left = progress.style.right = 0;
				progress.style.top = progress.style.bottom = 0;
				progress.style.zIndex = 99;   //进度条置顶
				document.body.appendChild(progress);
				//获取历史弹幕日期
				let data;
				for (let i = 0; i < monthArray.length;) {
					data = await fetchFunc(monthArray[i], 'json');
					if (data.code) {
						throw new Error('bilibiliDanmaku，API接口返回错误：' + data.message);
					}
					if (data.data) {
						for (let j = 0; j < data.data.length; j++) {
							progress.setAttribute('value', i * 1000 + 1000 / data.data.length * j);
							await sleep(delay);   //避免网站API调用速度过快导致错误
							danmaku = await fetchFunc(`https://api.bilibili.com/x/v2/dm/history?type=1&oid=${window.cid}&date=${data.data[j]}&bilibiliDanmaku=1`);
							if ((match = (new RegExp('^\{"code":[^,]+,"message":"([^"]+)","ttl":[^\}]+\}$',)).exec(danmaku)) != null) {
								throw new Error('bilibiliDanmaku，API接口返回错误：' + match[1]);
							}
							exp = new RegExp('<d p="([^,]+)[^"]+,(\\d+)">.+?</d>', 'g');
							while ((match = exp.exec(danmaku)) != null) {
								if (!danmakuMap.has(parseInt(match[2]))) {   //跳过重复的项目
									danmakuMap.set(parseInt(match[2]), [parseFloat(match[1]), match[0]]);
								}
							}
						}
					}
					progress.setAttribute('value', ++i * 1000);
				}
				//按弹幕播放时间排序
				let danmakuArray = [];
				for (let value of danmakuMap.values()) {
					danmakuArray.push(value);
				}
				danmakuArray.sort((a, b) => a[0] - b[0]);
				//合成弹幕
				document.body.removeChild(progress);
				for (let pair of danmakuArray) {
					danmakuAll += pair[1];
				}
				danmakuAll += '</i>';
				//设置下载链接
				downloadAll.onclick = null;
				downloadAll.setAttribute('download', document.title.split('_')[0] + '.xml');
				downloadAll.setAttribute('href', URL.createObjectURL(new Blob([danmakuAll])));
				downloadAll.dispatchEvent(new MouseEvent('click'));
			} catch(e) {
				alert(e);
			}
		};
		//历史弹幕下载
		downloadPast.onclick = async () => {
			//获取视频发布日期
			let date;
			let dateNode = document.querySelector('.video-data span:nth-child(2)');
			if (dateNode) {
				date = new Date(dateNode.textContent);
				if (isNaN(date)) {
					date = await fetchPubDate();
				}
			} else {
				date = await fetchPubDate();
			}
			if (!date) {   //获取视频投稿时间失败，默认设置为当天
				date = new Date();
			}
			if((date = prompt('请按此格式输入想要下载历史弹幕的日期',  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2))) == null) {
				return;
			}
			let danmaku = await fetchFunc(`https://api.bilibili.com/x/v2/dm/history?type=1&oid=${window.cid}&date=${date}&bilibiliDanmaku=1`);
			let aLink = document.createElement('a');
			aLink.setAttribute('download', document.title.split('_')[0] + '_' + date + '.xml');
			aLink.setAttribute('href', URL.createObjectURL(new Blob([danmaku])));
			aLink.dispatchEvent(new MouseEvent('click'));
		};
		
		//获取CC字幕列表
		let subList = [];
		let notFound = true;
		if (window.eventLogText) {
			for (let i = window.eventLogText.length - 1; i >= 0; i--) {
				let eventLog = window.eventLogText[i];
				if (eventLog.indexOf('<subtitle>') > 0) {
					notFound = false;
					try {
						subList = JSON.parse(eventLog.substring(eventLog.indexOf('<subtitle>') + 10,
							eventLog.indexOf('</subtitle>'))).subtitles;
					} catch(e) {
						console.log(e);
						notFound = true;
					}
					break;
				}
			}
		}
		if (notFound) {
			subList = await fetchSubtitles();
		}
		if (subList.length == 0) {   //没有CC字幕则隐藏相关按钮
			subSpan.setAttribute('hidden', 'hidden');
			downloadSub.onclick = null;
			convertSub.onclick = null;
			return;
		} else {
			subSpan.removeAttribute('hidden');
		}
		//下载CC字幕
		downloadSub.onclick = async () => {
			let aLink = document.createElement('a');
			for (let sub of subList) {
				let subtitle = await fetchFunc(sub.subtitle_url.replace(/^http:/, ''), 'blob');   //避免混合内容
				aLink.setAttribute('download', sub.lan + '_' + document.title.split('_')[0] + '.json');
				aLink.setAttribute('href', URL.createObjectURL(subtitle));
				aLink.dispatchEvent(new MouseEvent('click'));
			}
		};
		//生成SRT字幕
		convertSub.onclick = async () => {
			let aLink = document.createElement('a');
			for (let sub of subList) {
				let subtitle = await fetchFunc(sub.subtitle_url.replace(/^http:/, ''), 'json');   //避免混合内容
				let srt = '', index = 0;
				for (let content of subtitle.body) {
					srt += `${index++}\n${formatSeconds(content.from)} --> ${formatSeconds(content.to)}\n${content.content.replace(/\n/g,'<br>')}\n\n`;
				}
				aLink.setAttribute('download', sub.lan + '_' + document.title.split('_')[0] + '.srt');
				aLink.setAttribute('href', URL.createObjectURL(new Blob([srt])));
				aLink.dispatchEvent(new MouseEvent('click'));
			}
		};
	};
	
	let findInsertPos = () => {
		let node;
		if (location.href.indexOf('www.bilibili.com/bangumi/play') > 0) {   //番剧
			node = document.querySelector('.media-right');
			if (node && node.querySelector('.media-count').textContent.indexOf('弹幕') == -1) {
				return null;   //避免信息栏未加载出来时插入链接导致错误
			}
		} else if (location.href.indexOf('www.bilibili.com/watchlater') > 0) {   //稍后再看
			node = document.querySelector('.tminfo');
			if (node) {
				node.lastElementChild.style.marginRight = '32px';
			}
		} else if (location.href.indexOf('www.bilibili.com/medialist/play') > 0) {   //新的稍后再看页面、收藏页面
			node = document.querySelector('.play-data');
			if (node) {
				node.lastElementChild.style.marginRight = '16px';
			}
			//新的稍后再看页面没有aid、bvid、cid，需要特殊处理
			let videoMessage = window.player.getVideoMessage();
			if (videoMessage) {
				window.aid = videoMessage.aid;
				window.cid = videoMessage.cid;
			} else {
				return null;
			}
		} else {
			node = document.getElementById('viewbox_report');
			if (node) {
				if (!document.querySelector('.bilibili-player-video-info-people-number')) {
					return null;   //避免信息栏未加载出来时插入链接导致错误
				}
				node = node.querySelector('.video-data');
				node.lastElementChild.style.marginRight = '16px';
			}
		}
		return node;
	};
	let createNode = () => {
		view = document.createElement('a');
		download = document.createElement('a');
		downloadAll = document.createElement('a');
		downloadPast = document.createElement('a');
		downloadSub = document.createElement('a');
		convertSub = document.createElement('a');
		view.setAttribute('target', '_blank');
		downloadPast.setAttribute('href', 'javascript:;');
		downloadSub.setAttribute('href', 'javascript:;');
		convertSub.setAttribute('href', 'javascript:;');
		view.textContent = '查看弹幕';
		download.textContent = '下载弹幕';
		downloadAll.textContent = '全弹幕下载';
		downloadPast.textContent = '历史弹幕下载';
		downloadSub.textContent = '下载CC字幕';
		convertSub.textContent = '生成SRT字幕';
		view.style.color = '#999';
		download.style.color = '#999';
		downloadAll.style.color = '#999';
		downloadPast.style.color = '#999';
		downloadSub.style.color = '#999';
		convertSub.style.color = '#999';
		let span = document.createElement('span');
		span.id = 'bilibiliDanmaku';
		span.appendChild(view);
		span.appendChild(document.createTextNode(' | '));
		span.appendChild(download);
		span.appendChild(document.createTextNode(' | '));
		span.appendChild(downloadAll);
		span.appendChild(document.createTextNode(' | '));
		span.appendChild(downloadPast);
		subSpan = document.createElement('span');
		subSpan.setAttribute('hidden', 'hidden');
		subSpan.style.marginLeft = '16px';   //弹幕与字幕功能分开
		subSpan.appendChild(downloadSub);
		subSpan.appendChild(document.createTextNode(' | '));
		subSpan.appendChild(convertSub);
		span.appendChild(subSpan);
		return span;
	};
	let insertNode = () => {
		let code = setInterval(() => {
			if (location.href.indexOf('www.bilibili.com/medialist/play') > 0) {
				if (!window.player) {   //新的稍后再看页面、收藏页面没有cid
					return;
				}
			} else if (!window.cid) {
				return;
			}
			if (document.getElementById('bilibiliDanmaku')) {   //节点已存在
				clearInterval(code);
				danmakuFunc();
			} else {
				let node = findInsertPos();
				if (node) {
					clearInterval(code);
					node.appendChild(createNode());
					danmakuFunc();
				}
			}
		}, 2196);
	};
	
	insertNode();
	addEventListener('hashchange', insertNode);
	addEventListener('pushState', insertNode);
	addEventListener('replaceState', insertNode);
})();
