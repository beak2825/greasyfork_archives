// ==UserScript==
// @name            N163mdm
// @namespace       qixinglu.com
// @description     m1u6s3ic
// @include         http://music.163.com/*
// @include         http://*.music.126.net/?crossOrigin=nmdfm
// @grant           none
// @run-at          document-start
// @version 0.0.1.20151022011130
// @downloadURL https://update.greasyfork.org/scripts/13266/N163mdm.user.js
// @updateURL https://update.greasyfork.org/scripts/13266/N163mdm.meta.js
// ==/UserScript==

(function(){
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
	if(top !== self) return;


	//免flash播放
	Object.defineProperty(navigator, 'plugins', {
		get: function () {
			return {length: 0};
		}
	});

		//必要暴露的方法
		window.hookURL = function(tracks){
			var track = controlMenu(tracks);
			return tracks.lMusic === track ? tracks.mp3Url : mp3Url(track);
		};
	}).toString() + ')()';

