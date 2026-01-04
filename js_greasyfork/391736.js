// ==UserScript==
// @name				elegant alert()
// @name:zh-CN			优雅的 alert()
// @name:zh-TW			優雅的 alert()
// @description			Display a non-blocking alert box at the top right corner, and automatically close after a few seconds. Click on the alert box will close it immediately and copy the alert message to clipboard.
// @description:zh-CN	把警示窗改为显示在页面右上角，显示几秒后会自动关闭。用鼠标点按信息窗口会立即关闭，并把内容拷贝到系统剪贴板。
// @description:zh-TW	把警示窗改為顯示在頁面右上角，顯示幾秒後會自動關閉。用滑鼠點按訊息窗口會立即關閉，並把內容複製到系統剪貼簿。
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @author				Evan Tseng
// @version				1.14
// @match				*://*/*
// @run-at				document-start
// @grant				none
// @license				MIT
// @downloadURL https://update.greasyfork.org/scripts/391736/elegant%20alert%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391736/elegant%20alert%28%29.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const boxFont = '400 15pt sans-serif',
		  boxFontColor = '#222',
		  boxBgColor = 'rgba(240,240,210,.85)',
		  boxHoverColor = 'rgba(255,255,255,.9)',
		  popFontColor = '#8ff',
		  popBgColor = '#b00',
		  countdownColor = 'rgba(100,100,240,.2)',
		  popDuration = 1500,		// the period of highlight poping (ms)
		  duration = 7200,			// message box default lifetime (ms)
		  fadeOutDuration = 700,	// message box disppearing duration (ms)

		  eaCSS = '@media screen and (max-width:40em) { .elegantAlertBoxWrapper>.eaNormal, .elegantAlertBoxWrapper>.eaClose { max-width:50vw } }' +
		  '@media screen and (min-width:40em) { .elegantAlertBoxWrapper>.eaNormal, .elegantAlertBoxWrapper>.eaClose { max-width:20em } }' +
		  '.elegantAlertBoxWrapper { position:fixed; top:8mm; right:12mm; max-height:calc(100vh - 16mm); z-index:2147483647 }' +
		  '.elegantAlertBoxWrapper>div { position:relative; float:right; clear:right; font:' + boxFont + '!important; line-height:1; color:' + boxFontColor + '; background:' + boxBgColor + '; padding:.1em .6em; margin-bottom:.4em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; border-radius:1em; opacity:.2; cursor:pointer; box-shadow:inset 0 0 0 1px rgba(255,255,255,.8), 0 1px 2mm rgba(0,0,0,.7); user-select:none; -webkit-user-select:none; backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px) }' +
		  '.elegantAlertBoxWrapper .eaBar { position:absolute; left:0; top:0; width:100%; height:100%; background:' + countdownColor + '; border-radius:3px; z-index:2 }' +
		  '.elegantAlertBoxWrapper>.eaPop { opacity:1; max-width:75vw; max-height:3em; animation:elegantAlertPopping ' + popDuration + 'ms 1 }' +
		  '.elegantAlertBoxWrapper>.eaNormal { opacity:1; max-height:4em; transition:.3s }' +
		  '.elegantAlertBoxWrapper>.eaClose { background:' + boxBgColor + '; opacity:0; min-height:0; max-height:0; padding-top:0; padding-bottom:0; margin:0; overflow:hidden; transform:scale(0); transition:' + fadeOutDuration + 'ms; -ms-overflow-style:none }' +
		  '.elegantAlertBoxWrapper>.eaNormal:hover { max-width:80vw; background:' + boxHoverColor + '; z-index:2; box-shadow:inset 0 0 0 1px #fff, 0 1px 2mm rgba(0,0,0,.8); transform:scale(1.03); transition:.2s }' +
		  '.elegantAlertBoxWrapper>.eaNormal:active { box-shadow:inset 0 1px 1mm #000, 0 0 0 1px #777; transform:scale(.97); transition:50ms }' +
		  '.elegantAlertTextCopy { position:absolute; top:-2em; left:0; width:8em; height:1em }' +
		  '@keyframes elegantAlertPopping { 0% { opacity:.7 } 7% { color:' + popFontColor + '; background:' + popBgColor + '; opacity:1; } 9% { transform:scale(1.05) } 20% {color: '+boxFontColor+'; background:' + boxBgColor + '; } 30% { transform:scale(1) } }';

	var cssElement = document.createElement('style');
	if(cssElement.styleSheet)	cssElement.styleSheet.cssText = eaCSS;
	else	cssElement.appendChild(document.createTextNode(eaCSS));
	cssElement.setAttribute('title', 'Elegant Alert');
	document.querySelector('head').appendChild(cssElement);

	var alertWrapper = null;
	const ElegantAlertBox = function(msg, lifeTime = duration){
		if(!alertWrapper) {
			document.documentElement.appendChild(alertWrapper = document.createElement('div'));
			alertWrapper.setAttribute('class', 'elegantAlertBoxWrapper');
		}
		this.exist = true;
		this.createBox = function(msgText){
			var box = this,
				alBox = document.createElement('div');
			alertWrapper.appendChild(alBox);
			alBox.innerHTML = '<div class="eaBar"></div>' + msgText;
			alBox.setAttribute('class', 'eaPop');
			alBox.addEventListener('click', function(){
				let tmp = document.createElement('textArea');
				tmp.setAttribute('class', 'elegantAlertTextCopy');
				tmp.value = msgText;
				document.documentElement.appendChild(tmp);
				tmp.select();
				document.execCommand('copy');
				tmp.remove();
				box.close();
			});
			return alBox;
		};
		this.show = function(){
			var box = this;
			setTimeout(function(){
				box.elm.querySelector('.eaBar').setAttribute('style', 'width:0; transition:linear ' + lifeTime + 'ms');
			}, 30)
			setTimeout(function(){
				box.elm.setAttribute('class', 'eaNormal');
				setTimeout(function(){
					if(box.exist) box.close();
				}, lifeTime - popDuration);
			}, popDuration);
		};
		this.close = function(){
			var box = this;
			box.elm.setAttribute('class', 'eaClose');
			setTimeout(function(){
				if(box.exist) {
					box.elm.remove();
					box.elm = undefined;
					box.exist = undefined;
					if(!alertWrapper.hasChildNodes()) {
						alertWrapper.remove();
						alertWrapper = null
					}
					box = undefined;
				}
			}, fadeOutDuration);
		};
		this.elm = this.createBox(msg);
		this.show();
	};

	window.alert = function(message){
		if(document.body)	new ElegantAlertBox(message);
		else	setTimeout(function(){ window.alert(message); }, 250);
	};
})();
