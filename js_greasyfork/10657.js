﻿// ==UserScript==
// @name            Netease Music Download Full Mod
// @namespace       qixinglu.com
// @author            muzuiget
// @contributor    黒仪大螃蟹      
// @description     网易云音乐免Flash播放，切换歌曲音质，可下载音乐，可显示高音质的完整版
// @description:zh-CN     网易云音乐免Flash播放，切换歌曲音质，可下载音乐，可显示高音质的完整版
// @include         http://music.163.com/*
// @include         http://*.music.126.net/?crossOrgin=nmdfm
// @version        1.5
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/10657/Netease%20Music%20Download%20Full%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/10657/Netease%20Music%20Download%20Full%20Mod.meta.js
// ==/UserScript==

(function(){
	//框架页面
	if(location.hostname.indexOf('music.126.net') > -1){
		return top === self || addEventListener('DOMContentLoaded', function(){
			var frameId = location.hostname.split('.').shift(),
				listPage = frameId === 'm1',
				bridgeCover = null, cover = null;
			var onDlLinkClick = function(link){
				var a = document.body.appendChild(document.createElement('a'));
				a.setAttribute('download', link.dlname + '.' + (link.lrc || link.url.split('.').pop()));
				a.href = link.url;
				a.click(), a.remove();
			}, createBridge = function(url){
				var src = url.match(/^https?:\/\/[^\/]+/)[0] + '/?crossOrigin=nmdfm';
				if(bridgeCover = document.querySelector(`iframe[src="${src}"]`))
					return bridgeCover.contentWindow.postMessage(cover, '*');
				(bridgeCover = document.body.appendChild(document.createElement('iframe'))).src = src;
			};

			addEventListener('message', function(event){
				if(event.data.nid === '126_download_link'){
					if(event.data.text && event.data.text.startsWith('封面') && listPage)
						return createBridge((cover = event.data).url);
					onDlLinkClick(event.data);
				}else if(event.data.nid === '126_download_bridgeOnload'){
					cover && event.source.postMessage(cover, event.origin);
				}else if(event.data.nid === '126_hook_js') {
					var req = new XMLHttpRequest();
					req.open('GET', event.data.src, true);
					req.onload = function () {
						event.data.js = this.responseText;
						event.source.postMessage(event.data, event.origin);
					};
					req.send();
				}
			});
			//告诉父窗口加载完成
			(listPage ? top : parent.window).postMessage({nid: '126_download_bridgeOnload', frameId: frameId}, '*');
		});
	}

	//同时阻止框架和顶层窗口原脚本载入，hook脚本后重新注入，
	//Promise 确保正确的脚本依赖加载顺序
	var jsIframe = null,
		hookJsUrl = {};
	Promise.all([new Promise(function(resolve){
		addEventListener('beforescriptexecute', function(event){
			var src = event.target.src,
				core = /core\.js\?/.test(src),
				ptcs = /pt_(?!frame)[^\.]+\.js\?/.test(src);
				ptfi = /pt_frame_index\.js\?/.test(src);
			if(!core && !ptcs && !ptfi || /\/\/(?=music)/.test(src)) return;
			core && (hookJsUrl.core = src);
			ptcs && (hookJsUrl.ptcs = src);
			ptfi && (hookJsUrl.ptfi = src);
			event.preventDefault();
			hookJsUrl.core && (hookJsUrl.ptcs || hookJsUrl.ptfi) && removeEventListener('beforescriptexecute', arguments.callee);
			if(!jsIframe){
				jsIframe = document.createElement('iframe')
				jsIframe.src = src.replace(/(^https?:\/\/[^\/]+).+/, '$1/?crossOrigin=nmdfm');
				jsIframe.style.visibility = 'hidden';
				document.body.appendChild(jsIframe);
			}
			if(hookJsUrl.core && (hookJsUrl.ptcs || hookJsUrl.ptfi)) return resolve();
		});
	}), new Promise(function(resolve){
		addEventListener('message', function(ev){
			if(ev.data.nid === '126_download_bridgeOnload'){
				if(ev.data.frameId !== 'm1')
					return resolve();
			}else if(ev.data.nid === '126_hook_js' && ev.data.js){
				if(ev.data.jsName === 'ptcs' || ev.data.jsName === 'ptfi'){
					removeEventListener('message', arguments.callee);
					jsIframe.remove();
				}

				//尽量模糊匹配，降低网易更新，代码压缩后变量名字变更带来的失效概率
				var js = '';
				if(ev.data.jsName === 'core'){
					js = ev.data.js.replace(/var [^=]+=0,[^=]+=([^\.]+)\.length,[^=]+=\{\};if\(\!\1\|\|\!\1\.length\)return;for/, 'arguments[0].forEach(function(a){(a.fee!=0)&&(a.fee=0)||(a.status=0);});$&')//**专辑播放***bq.bwp=function(bk,eG){var UR=0,df=bk.length,bao={};if(!bk||!bk.length)return;for(var i=df-1,ii;i>=0;i--){ii=bk[i];if(bq.jC(ii))
					.replace(/("resAction"\),([^=]+)=[^\.]+\.[^\(]+\([^,]+,"resCopyright"\);)(?=if\(([^\!]+)\!="log")/, '$1$3=="play"&&$2==0&&($2=1);')//***跳过搜索结果播放弹窗*****//cv=Fp.bI(bid,"resAction"),bqZ=Fp.bI(bid,"resCopyright");if(cv!="log"&&cv!="bilog")bj.cG(bc);
					.replace(/window\.GAbroad/g, 'false')//解除diqu限制
					//.replace('bq.fE=function(cD,bC,bDM){', '$&console.trace();')
					;
				}else if(ev.data.jsName === 'ptcs'){
					js = ev.data.js.replace(/(copyrightId:[^\.]+\.[^\(]+\(this\.[^,]+,"copyrightId"\)\};)(?=if\([^\.]+\.[^\(]+\(([^\)]+)\)\))/, '$1($2.fee!=0)&&($2.fee=0)||($2.status=0);')//***跳过单曲弹窗*****//copyrightId:Fp.bI(this.nG,"copyrightId")};if(bq.jC(bHM))
					.replace(/("resId"\);var ([^=]+)=this\.[^\.]+\.[^\(]+\(\)\.[^\(]+\([^\)]+\);)(?=switch\(([^\)]+)\)\{case"share":)/, '$1$3=="play"&&($2.fee!=0)&&($2.fee=0)||($2.status=0);')//***跳过搜索结果播放弹窗*****pt_content_artist.js//cv=Fp.bI(bid,"resAction"),bC=Fp.bI(bid,"resId");var eD=this.fK.AX().fh(bC);switch(cv){case"share":case"fav":case"addto":case"play":
					.replace(/[^=]+=parseInt\([^\.]+\.[^(]+\([^,]+,"copyright"\)\|\|[^\.]+\.[^(]+\([^,]+,"resCopyright"\)\)/, '$&||1;')//***跳过播放列表banquan弹窗*****BX=parseInt(Fp.bI(bD,"copyright")||Fp.bI(bD,"resCopyright"))
					;
				}else if(ev.data.jsName === 'ptfi'){
					js = ev.data.js.replace(/(?=this\.[^=]+=new Audio)/, 'window.hookPlayer=')//this.cz=new Audio
					.replace(/(this\.[^\.]+\.[^\.]+\()([^\.]+)\.mp3Url(?=,[^\.]+\.id,[^\.]+\.autoplay\);)/, '$1window.hookURL($2)')
					.replace(/(case 18:)(?=[^\.]+\.push\(([^\)]+)\);)/, '$1($2.fee!=0)&&($2.fee=0)||($2.status=0);')//***播放单曲***case 18:fy.push(bl);
					.replace(/(case 19:)(?=[^=]+=([^\.]+\.songs);)/, '$1$2.forEach(function(a){(a.fee!=0)&&(a.fee=0)||(a.status=0);});') //***跳过专辑弹窗*****case 19:fy=bl.songs;
					.replace(/(function\(([^,]+),[^,+]+,[^\)]+\)\{)(?=if\(\!\2\|\|\!\2\.length\)return;for)/, '$1$2.forEach(function(a){(a.fee==4)&&(a.fee=0)||(a.status=0);});') //***跳过歌手专辑弹窗*****;bb.uV=function(bk,dB,bQ){if(!bk||!bk.length)return;for(var i=0,bfi=[],Ik;i<bk.length;++i)
					;
				}
				hookJsUrl[ev.data.jsName](js);
			}
		});
	})]).then(function(){
		Promise.all([new Promise(function(resolve){
			jsIframe.contentWindow.postMessage({nid: '126_hook_js', src: hookJsUrl.core, jsName: 'core'}, '*');
			hookJsUrl.core = resolve;
		}),new Promise(function(resolve){
			if(hookJsUrl.ptcs){
				jsIframe.contentWindow.postMessage({nid: '126_hook_js', src: hookJsUrl.ptcs, jsName: 'ptcs'}, '*');
				hookJsUrl.ptcs = resolve;
			}else{
				jsIframe.contentWindow.postMessage({nid: '126_hook_js', src: hookJsUrl.ptfi, jsName: 'ptfi'}, '*');
				hookJsUrl.ptfi = resolve;
			}
		})]).then(function(result){
			result.forEach(function(r){
				document.body.appendChild(document.createElement('script')).textContent = r;
			});
			hookJsUrl = null;
		});
	});

	//排除框架
	if(top !== self) {
		//修复专辑列表中正在播放的banquan歌曲红色“播放按钮”样式
		return document.head.appendChild(document.createElement('style')).textContent = `
			.m-table .ply-z-slt {background-position: -20px -128px !important;}
			.m-table .js-dis .ply, .m-table .js-dis .ply:hover{cursor:pointer!important;}
		`;
	}


	//免flash播放
	Object.defineProperty(navigator, 'plugins', {
		get: function () {
			return {length: 0};
		}
	});

	//切换控制列表样式， 下载按钮、列表样式
	document.head.appendChild(document.createElement('style')).textContent = `
		#hook_cMenu{float: right; margin-right: 32px; position:relative; cursor:pointer; color: #aaa; width: 80px;}
		#hook_cMenu>span{display:block; text-align:right;}
		#hook_cMenu:not(:hover) > ul {display:none;}
		#hook_cMenu > ul {position:fixed; bottom: 47px; background-color: rgba(51, 51, 51, 0.9); width: 80px;}
		#hook_cMenu li{height: 20px; font: 12px/20px '微软雅黑';text-align: center;}
		#hook_cMenu .select{color: #eee;}
		#hook_cMenu li:hover{background-color: rgba(0, 0, 0, 0.4);}

		#g_player {width:1002px !important;}
		.m-playbar .oper {width: 82px !important;}
		#g_player .icn-download{background:none;}
		.icn-download::before{content:''; display:block; height:100%; background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAABCElEQVQ4je2TMW4DIRBFv6ZytQdwlSv4BBzArSvqvQGSJSQ3cwKqQdBQ0bnxmSwfwf2kCBuRtdfZpEgVpN+A/tNnPgB/uA5ExJMAHH5NIiIupWitVUsp2oD/sMe1QTf4OawrYrMGNhARi4jmnLWH5ZxVRKaEw9pkloj4GayB7KtkOwBj067t2YWZ2RceAMAYY7ymlG7t8EvCWuuzRGNK6RZjvHaej9ZCCBpCmDf2WQZmQ1/0EBEzszLz6voXPf2BtfbS/8clWWsvSwGOzrm7915FRGut30pE1Huvzrk7gGMP2xtjzhNwrZxzd2PMGcC+hw2tqdOaK3Y/4dR8Dw94ALAF8PYDbXvQOx/w+kFc4FUfAAAAAElFTkSuQmCC') 0 4px no-repeat;}
		.icn-download:hover::before{filter: brightness(135%) drop-shadow(0px 0px 2px rgba(255,255,255,.5));}

		.icn-download{position:relative}
		.icn-download ul{display:none;position:fixed; background: rgba(51, 51, 51, 0.9); bottom:47px; margin-left:calc(120px / -2 - 22px / -2)}
		.icn-download span{text-indent: 0;color: #ddd; cursor:pointer; font:12px/20px '微软雅黑'; display:block;}
		.icn-download li{text-align: center; height:20px; width:120px;}
		.icn-download li:hover{background: rgba(0, 0, 0, 0.4)}
	`;
	//hook 方法到页面环境
	document.head.appendChild(document.createElement('script')).textContent = '('+ (function(){
		var makeHash = function (d) {
			var c = function (a) {
				return a.charCodeAt(0)
			}, b = '3,g,o,8,&,$,8,*,3,*,3,h,0,k,(,2,),2'.split(',').map(c);
			d = String(d).split('').map(c);
			var c = [], a, e;
			for (a = 0; a < d.length; a += 1) e = (d[a] ^ b[a % 18]) & 255, c.push(e);
			b = c.map(function (a) {
				return String.fromCharCode(a)
			}).join('');
			b = String(window.CryptoJS.MD5(b));
			return btoa(function (a) {
				var c = [], b;
				for (b = 0; b < a.length - 1; b += 2) c.push(parseInt(a.substr(b, 2), 16));
				return String.fromCharCode.apply(String, c)
			}(b)).replace(/\+/g, '-').replace(/\//g, '_')
		}, convertByte = function(b) {
			var i = 0;
			while ((b >= 999.5) && (i < 3)) {
				b /= 1024;
				i++;
			}
			return ((b > 0) && (b < 100) && (i != 0) ? (b < 10 ? (parseInt(b * 100) / 100).toFixed(2) : (parseInt(b * 10) / 10).toFixed(1)): parseInt(b)) + ['bytes', 'KB', 'MB', 'GB'][i];
		}, mp3Url  = function(track){
			return 'http://m1.music.126.net/' + makeHash(track.dfsId) + '/' + track.dfsId + '.' + track.extension;
		}, onListClick = function(li, track, hookConfig, songId){
			var player = window.hookPlayer
				currentTime = player.currentTime,
				paused = player.paused;
			if(player.src === mp3Url(track)) return;

			li.parentNode.nextElementSibling.textContent 
				= `${track.bitrate/1000}K / ${convertByte(track.size)}`;

			[].forEach.call(li.parentNode.children, function(i){
				i !== li ? i.removeAttribute('class') : (i.className = 'select');
			});

			localStorage.setItem('hookConfig', JSON.stringify(hookConfig));

			player.src = mp3Url(track);
			var seeking = function (){
				this.removeEventListener('seeking',  arguments.callee);
				currentTime = this.currentTime;
			};
			player.addEventListener('seeking', seeking);
			player.addEventListener('progress', function(){
				if(!this.buffered.length || this.buffered.end(0) <= currentTime) return;
				this.removeEventListener('progress', arguments.callee);
				this.removeEventListener('seeking', seeking);
				//如果不是当前曲目就不要还原了
				if(window.player.getPlaying().track.id !== songId) return;
				//还原播放状态
				this.currentTime = currentTime;
				this.play();
				//必须先播放后才能暂停
				paused && this.pause();
			});
		}, controlMenu = function(track){
			if(!track.lMusic || typeof track.lMusic.id !== 'number')
				throw '"Netease Music Download Full Mod" 脚本错误！';
			var current = JSON.parse(localStorage.getItem('hookConfig') || JSON.stringify({q: 'mMusic'})),
				_current = current.q,
				panel = document.querySelector('.j-flag.words'),
				menu = document.createElement('div'),
				quality = {lMusic: '低', mMusic: '中', hMusic: '高'},
				arr = Object.keys(quality);
				index = arr.indexOf(current.q),
				songId = track.id;
			while(!track[current.q]) current.q = arr[--index];
			menu.id = 'hook_cMenu';
			menu.innerHTML = '<ul></ul><span></span>';
			menu.lastElementChild.textContent 
				= `${track[current.q].bitrate/1000}K / ${convertByte(track[current.q].size)}`;
			arr.forEach(function(q){
				if(!track[q]) return;
				var li = document.createElement('li');
				li.textContent = `${quality[q]} [${track[q].bitrate/1000}K]`;
				li.setAttribute('title', convertByte(track[q].size));
				if(_current === q) li.className = 'select';
				menu.firstElementChild.appendChild(li).onclick = function(ev){
					if(ev.button !== 0) return;
					onListClick(li, track[current.q = q], current, songId);
				}
			});
			panel.appendChild(menu);
			return track[current.q];
		};

		addEventListener('DOMContentLoaded', function(){
			removeEventListener('DOMContentLoaded', arguments.callee);
			var interval = setInterval(function(){
				if(!window.player) return;
				clearInterval(interval);
				if(!document.getElementById('hook_cMenu') && window.hookPlayer)
					controlMenu(window.player.getPlaying().track);
			}, 200);
		});

		//必要暴露的方法
		window.hookURL = function(tracks){
			var track = controlMenu(tracks);
			return tracks.lMusic === track ? tracks.mp3Url : mp3Url(track);
		};
	}).toString() + ')()';


	//下载功能区域
	addEventListener('DOMContentLoaded', function(){
		var api = {
			detailUrl: function (songIds) {
				var tpl = 'http://music.163.com/api/song/detail?ids=[${songIds}]';
				return tpl.replace('${songIds}', songIds.join(','));
			},
			detail: function (songIds, callback) {
				var req = new XMLHttpRequest();
				req.open('GET', this.detailUrl(songIds), true);
				req.send();
				req.onload = function () {
					callback(JSON.parse(this.responseText));
				};
			},
			mediaUrl: function (songId) {
				return 'http://music.163.com/api/song/media?id=' + songId;
			},
			media: function (songId, callback) {
				var req = new XMLHttpRequest();
				req.open('GET', this.mediaUrl(songId), true);
				req.onload = function () {
					callback(JSON.parse(this.responseText));
				};
				req.send();
			},
			lyric: function (songId, callback) {
				var req = new XMLHttpRequest();
				req.open('GET', 'http://music.163.com/api/song/lyric?lv=-1&tv=-1&id='+songId, true);
				req.onload = function () {
					callback(JSON.parse(this.responseText));
				};
				req.send();
				return req;
			},
			makeHash: function (d) {
				var c = function (a) {
					return a.charCodeAt(0)
				}, b = '3,g,o,8,&,$,8,*,3,*,3,h,0,k,(,2,),2'.split(',').map(c);
				d = String(d).split('').map(c);
				var c = [], a, e;
				for (a = 0; a < d.length; a += 1) e = (d[a] ^ b[a % 18]) & 255, c.push(e);
				b = c.map(function (a) {
					return String.fromCharCode(a)
				}).join('');
				b = String(window.CryptoJS.MD5(b));
				return btoa(function (a) {
					var c = [], b;
					for (b = 0; b < a.length - 1; b += 2) c.push(parseInt(a.substr(b, 2), 16));
					return String.fromCharCode.apply(String, c)
				}(b)).replace(/\+/g, '-').replace(/\//g, '_')
			},
			mp3Url: function (obj) {
				var url = 'http://m1.music.126.net/' + this.makeHash(obj.dfsId) + '/' + obj.dfsId + '.' + obj.extension;
				return url;
			}
		};
		var page = {
			url: 'http://music.163.com/#/song?id=',
			handler: function () {
				this.createDownloadButton();
				var songId = location.href.match(/id=([0-9]+)/)[1];
				var downloadLine = this.createDownloadLine(songId);
				var metaLine = this.createMetaLine(songId);
				var innerFrameDoc = innerFrame.contentWindow.document;
				var albumNode = innerFrameDoc.querySelectorAll('p.des.s-fc4')[1];
				var parentNode = albumNode.parentNode;
				parentNode.insertBefore(downloadLine, albumNode.nextElementSibling);
				parentNode.insertBefore(metaLine, downloadLine.nextElementSibling);
			},
			list: null,
			createDownloadButton: function(){
				if(window.self !== window.top || bridge) return;
				var pPanel = document.querySelector('.j-flag.words'),
					dPanel = document.querySelector('.oper.f-fl');
				bridge = document.body.appendChild(document.createElement('iframe'));
				bridge.src = 'http://m1.music.126.net/?crossOrigin=nmdfm';
				bridge.style.visibility = 'hidden';

				pPanel && (new MutationObserver(function(record){
					if(record.length === 1 && record.some(function(r){
						return [].some.call(r.addedNodes, function(a){
							return a.id === 'hook_cMenu';
						});
					})) return;
					this.updateDownloadLists();
				}.bind(this))).observe(pPanel, {childList: true});

				if(!dPanel) return;
				var icon = dPanel.appendChild(document.createElement('a')),
					list = null;
				icon.className = 'icn icn-download';
				icon.setAttribute('title', '下载');
				list = this.list = icon.appendChild(document.createElement('ul'));
				list.addEventListener('click', function(event){
					event.stopPropagation();
					event.preventDefault();
					if(event.button !== 0 || event.target.tagName !== 'SPAN')
						return;
					bridge.contentWindow.postMessage(event.target._link, '*');
				});
				icon.onmouseenter = function(){
					clearTimeout(icon._mouseleaveTimeout);
					list.style.display = 'block';
				};
				icon.onmouseleave = function(){
					icon._mouseleaveTimeout = setTimeout(function(){
						list.style.display = 'none';
					}, 300);
				};
			},
			convertByte: function(b) {
				var i = 0;
				while ((b >= 999.5) && (i < 3)) {
					b /= 1024;
					i++;
				}
				return ((b > 0) && (b < 100) && (i != 0) ? (b < 10 ? (parseInt(b * 100) / 100).toFixed(2) : (parseInt(b * 10) / 10).toFixed(1)): parseInt(b)) + ['bytes', 'KB', 'MB', 'GB'][i];
			},
			updateDownloadLists: function(){
				var _update = function(links){
					for(var link of links){
						var span = list.appendChild(document.createElement('li')).appendChild(document.createElement('span'));
						span._link = {url: link.url, nid: '126_download_link'};
						span.setAttribute('title', 
							(span.textContent = link.text +
								(link.size ? ' ['+ link.size+']' : '') + //文件大小
								((span._link.text = link.text).startsWith('歌词') ? '[' + (span._link.lrc = link.type).toUpperCase() + ']' : '')) + ': ' + //歌词扩展格式
							((span._link.dlname = song.artists[0].name + ' - ' + song.name) + (link.type ? '.' + link.type : '')) //文件名+扩展名
						);
					}
				}, list = this.list,
					song = window.player.getPlaying().track,
					links = [],
					quality = {lMusic: '低', mMusic: '中', hMusic: '高'};

				for(var q in quality) song[q] && links.push({
					text: quality[q] + '(' + song[q].bitrate/1000 + 'K)',
					url: api.mp3Url(song[q]),
					size: this.convertByte(song[q].size),
					type: song[q].extension
				});

				song.album && song.album.picUrl && links.push({
					text: '封面', url: song.album.picUrl,
					type: song.album.picUrl.split('.').pop()
				});

				list.innerHTML = '';
				//分两步更新，防止歌词获取失败列表不更新
				_update(links);
				//下一曲后无论前一曲有无响应都要终止
				list._lyricRequest && list._lyricRequest.abort();

				list._lyricRequest = api.lyric(song.id, function (result) {
					var lrc = null,
						data = 'data:text/plain;charset=UTF-8,',
						links = [];
					result.lrc && result.lrc.lyric && links.push(lrc = {
						text: '歌词', url: data + encodeURIComponent(result.lrc.lyric),
						type: result.lrc.lyric.trim().startsWith('[') ? 'lrc' : 'txt'
					});
					result.lrc && result.tlyric && result.tlyric.lyric && (lrc.text += '(原)') && links.push({
						text: '歌词(译)', url: data + encodeURIComponent(result.tlyric.lyric),
						type: result.tlyric.lyric.trim().startsWith('[') ? 'lrc' : 'txt'
					});
					_update(links);
				});
			},
			createDownloadLine: function (songId) {
				var disableStyle = function (link) {
					link.textContent += '(无)';
					link.style.color = 'gray';
					link.style.textDecoration = 'none';
					link.style.cursor = 'auto';
				};
				var bitrateLabel = function (bitrate) {
					return '(' + bitrate / 1000 + 'K)';
				};
				var container = this.createLineContainer('下载');
				var links = {
					lMusic: container.appendChild(this.createLink('低音质')),
					mMusic: container.appendChild(this.createLink('中等音质')),
					hMusic: container.appendChild(this.createLink('高音质'))
				};
				var lyricLink = container.appendChild(this.createLink('歌词')),
					coverLink = container.appendChild(this.createLink('封面')),
					convertByte = this.convertByte;

				Promise.all([new Promise(function(resolve){
					api.detail([songId], function (result) {
						var song = result.songs[0];
						for(var i in links){
							if(song[i]){
								links[i].href = api.mp3Url(song[i]);
								links[i].textContent += bitrateLabel(song[i].bitrate);
								links[i].setAttribute('title', convertByte(song[i].size));
							}else{
								disableStyle(links[i]);
							}
						}
						song.album && song.album.picUrl ? 
							(coverLink.href = song.album.picUrl) : disableStyle(coverLink);
						resolve(song.artists[0].name + ' - ' + song.name);
					});
				}), new Promise(function(resolve){
					api.lyric(songId, function (result) {
						var lrc, data = 'data:text/plain;charset=UTF-8,';
						if (result.lrc && result.lrc.lyric) {
							lyricLink.href = data + encodeURIComponent(result.lrc.lyric);
							lrc = [result.lrc.lyric.trim().startsWith('[') ? 'lrc' : 'txt'];
							if(result.tlyric && result.tlyric.lyric){
								var tlyricLink = lyricLink.cloneNode(true);
								container.insertBefore(tlyricLink, lyricLink.nextElementSibling);
								tlyricLink.href = data + encodeURIComponent(result.tlyric.lyric);
								lrc.push(result.tlyric.lyric.trim().startsWith('[') ? 'lrc' : 'txt');
								lyricLink.textContent += '(原)';
								tlyricLink.textContent += '(译)';
							}
						} else {
							disableStyle(lyricLink);
						}
						resolve(lrc);
					});
				})]).then(function(result){
					[].forEach.call(container.children, function(link){
						link.onclick = function(e){
							if(e.button !== 0) return;
							e.preventDefault();
							var lrc;
							if(link.href.startsWith('data'))
								lrc = link.textContent.endsWith('译)') ? result[1][1] : result[1][0];
							bridge.contentWindow.postMessage({
								nid: '126_download_link',
								text: link.textContent,
								dlname: result[0],
								lrc: lrc,
								url: link.href
							}, '*');
						}
					});
				});
				return container;
			},
			createMetaLine: function (songId) {
				var detailLink = this.createLink('歌曲');
				var mediaLink = this.createLink('媒体');
				detailLink.href = api.detailUrl([songId]);
				mediaLink.href = api.mediaUrl([songId]);
				var container = this.createLineContainer('元数据');
				container.appendChild(detailLink);
				container.appendChild(mediaLink);
				return container;
			},
			createLink: function (label) {
				var link = document.createElement('a');
				link.innerHTML = label;
				link.className = 's-fc7';
				link.style.marginRight = '6px';
				link.href = 'javascript:void(0);';
				return link;
			},
			createLineContainer: function (label) {
				var container = document.createElement('p');
				container.className = 'desc s-fc4';
				container.innerHTML = label + '：';
				container.style.margin = '10px 0';
				return container;
			},
		};

		var innerFrame = document.querySelector('iframe'),
			bridge = null;
		page.createDownloadButton();
		innerFrame && innerFrame.addEventListener('load', function () {
			if (location.href.startsWith(page.url))
				page.handler();
		});
	});

})();

