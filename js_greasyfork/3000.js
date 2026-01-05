// ==UserScript==
// @name        Video Player Toothbrush
// @namespace   http://www.icycat.com
// @description 牙刷科技!让所有视频播放器网页全屏！默认快捷键ALT+1,可自行修改
// @author      冻猫
// @include     *www.bilibili.com/*
// @include     *www.bilibili.tv/*
// @include     *bilibili.kankanews.com/*
// @include     *.iqiyi.com/*
// @include     *v.youku.com/*
// @include     *www.youtube.com/*
// @include     *v.17173.com/*
// @include     *www.tudou.com/*
// @include     *.letv.com/*
// @include     *v.pptv.com/*
// @include     *tv.sohu.com/*
// @include     *v.ku6.com/*
// @include     *vod.kankan.com/*
// @include     *v.qq.com/*
// @include     *www.56.com/*
// @include     *live.yy.com/*
// @include     *yy.tv/*
// @include     *www.acfun.com/*
// @include     *www.acfun.tv/*
// @include     *donghua.dmzj.com/*
// @include     *video.sina.com.cn/*
// @include     *.cntv.cn/*
// @include     *.douyutv.com/*
// @include     *music.163.com/*
// @include     *v.163.com/*
// @include     *www.twitch.tv/*
// @include     *v.yinyuetai.com/*
// @version     3.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/3000/Video%20Player%20Toothbrush.user.js
// @updateURL https://update.greasyfork.org/scripts/3000/Video%20Player%20Toothbrush.meta.js
// ==/UserScript==

//若有需要可以自行添加域名，按照include的格式添加即可。
//自行修改快捷键，请参考下面代码中的注释。注意焦点在flash上时快捷键会失效。

(function() {

	var parentArray = new Array(),
		player = null,
		fullStatus = false,
		backStyle = new Array(),
		childStyle = new Array(),
		playerStyle, parent, type, iframe;

	function init() {
		createButton();
		window.addEventListener("keydown", function(e) {
			//默认快捷键为alt + 1, 全屏/恢复。altkey是按键ALT,keyCode=49是按键1，需要修改为其他快捷键的请搜索"keycode"，修改为按键对应的数字。
			if (e.altKey && e.keyCode == 49) {
				playerControl();
			}
		}, false);
		console.log('Video Player Toothbrush 初始化');
	}

	function createButton() {
		var leftButton = document.createElement('span');
		leftButton.id = 'leftFullStackButton';
		leftButton.onclick = function() {
			playerControl();
		};
		document.body.appendChild(leftButton);
		addStyle('#leftFullStackButton{position:fixed;width:1px;height:100%;top:0;left:0;z-index:2147483646;}');
		var rightButton = document.createElement('span');
		rightButton.id = 'rightFullStackButton';
		rightButton.onclick = function() {
			playerControl();
		};
		document.body.appendChild(rightButton);
		addStyle('#rightFullStackButton{position:fixed;width:1px;height:100%;top:0;right:0;z-index:2147483646;}');
	}

	function addStyle(css) {
		var style = document.createElement('style');
		style.type = 'text/css';
		var node = document.createTextNode(css);
		style.appendChild(node);
		document.head.appendChild(style);
	}

	function playerControl() {
		if (!player) {
			checkPlayer();
			fullWin();
		} else {
			if (!fullStatus) {
				switch (type) {
					case 'object':
						var objectArray = parent.getElementsByTagName('object');
						checkObject(objectArray);
						break;
					case 'embed':
						var embedArray = parent.getElementsByTagName('embed');
						checkEmbed(embedArray);
						break;
					case 'html5':
						var html5Array = parent.getElementsByTagName('html5');
						checkHtml5(html5Array);
						break;
					case 'innerIframe':
					case 'iframe':
						var iframeArray = parent.getElementsByTagName('iframe');
						checkIframe(iframeArray);
						break;
				}
				fullWin();
			} else {
				smallWin();
			}
		}
	}

	function checkPlayer() {
		var objectArray = document.getElementsByTagName('object');
		console.log('object数量' + objectArray.length);
		checkObject(objectArray);
		if (!player) {
			console.log('未找到object播放器');
			var embedArray = document.getElementsByTagName('embed');
			console.log('embed数量' + embedArray.length);
			checkEmbed(embedArray);
		}
		if (!player) {
			console.log('未找到embed播放器');
			var html5Array = document.getElementsByTagName('video');
			console.log('html5视频数量' + html5Array.length);
			checkHtml5(html5Array);
		}
		if (!player) {
			console.log('未找到html5播放器');
			var iframeArray = document.getElementsByTagName('iframe');
			console.log('iframe数量' + iframeArray.length);
			checkIframe(iframeArray);
		}
		if (!player) {
			console.log('未找到iframe引用的播放器');
			return;
		}
		parent = player.parentNode;
		var full = player;
		while (full = full.parentNode) {
			if (full.getAttribute && full.nodeName != 'OBJECT') {
				full.setAttribute('full_stack', true);
				parentArray.push(full);
			}
			if (full.nodeName == 'HTML') {
				break;
			}
		}
		if (type == 'innerIframe') {
			full = iframe;
			do {
				if (full.getAttribute) {
					full.setAttribute('full_stack', true);
					parentArray.push(full);
				}
				if (full.nodeName == 'HTML') {
					break;
				}
			} while (full = full.parentNode);
		}
	}

	function checkObject(objectArray) {
		if (objectArray.length > 0) {
			for (i = 0; i < objectArray.length; i++) {
				console.log('object播放器检测' + i);
				if (objectArray[i].type == 'application/x-shockwave-flash' && objectArray[i].offsetWidth > 299 && objectArray[i].offsetHeight > 199) {
					player = objectArray[i];
					type = 'object';
					console.log('找到object播放器');
					break;
				}
			}
		}
	}

	function checkEmbed(embedArray) {
		if (embedArray.length > 0) {
			for (i = 0; i < embedArray.length; i++) {
				console.log('embed播放器检测' + i);
				if (embedArray[i].type == 'application/x-shockwave-flash' && embedArray[i].offsetWidth > 299 && embedArray[i].offsetHeight > 199) {
					player = embedArray[i];
					type = 'embed';
					console.log('找到embed播放器');
					break;
				}
			}
		}
	}

	function checkHtml5(html5Array) {
		if (html5Array.length > 0) {
			for (i = 0; i < html5Array.length; i++) {
				console.log('html5播放器检测' + i);
				if (html5Array[i].offsetWidth > 299 && html5Array[i].offsetHeight > 199) {
					player = html5Array[i];
					type = 'html5';
					console.log('找到html5播放器');
					break;
				}
			}
		}
	}

	function checkIframe(iframeArray) {
		if (iframeArray.length > 0) {
			for (var i = 0; i < iframeArray.length; i++) {
				if (iframeArray[i].offsetWidth > 299 && iframeArray[i].offsetHeight > 199) {
					try {
						var objectArray = iframeArray[i].contentWindow.document.getElementsByTagName('object');
						console.log('iframe' + i + '中object数量' + objectArray.length);
						checkObject(objectArray);
						if (!player) {
							console.log('iframe' + i + '中未找到object播放器');
							var embedArray = iframeArray[i].contentWindow.document.getElementsByTagName('embed');
							console.log('iframe' + i + '中embed数量' + embedArray.length);
							checkEmbed(embedArray);
						}
						if (player) {
							iframe = iframeArray[i];
							type = 'innerIframe';
							break;
						} else {
							console.log('未找到iframe' + i + '中的播放器');
						}
					} catch (e) {
						player = iframeArray[i];
						type = 'iframe';
						console.log('找到可能通过iframe跨域引用的播放器');
						break;
					}
				}
			}
		}
	}

	function fullWin() {
		if (!fullStatus) {
			window.addEventListener('resize', fullWin, false);
			playerStyle = player.style.cssText;
		}
		for (var i = 0; i < parentArray.length; i++) {
			if (!fullStatus) {
				backStyle[i] = parentArray[i].style.cssText;
			}
			parentArray[i].style.cssText = 'width:100% !important;height:100% !important;max-width:100% !important;margin:0px !important;padding:0px !important;top:0px !important;left:0px !important;z-index:2147483645 !important;overflow:hidden !important;position:fixed !important;background:#000 !important;';
		}
		player.style.cssText = 'width:calc(100% - 2px) !important;height:100% !important;z-index:2147483645 !important;left:1px !important;position:relative !important;visibility:visible !important;'
		console.log('网页全屏完成');
		fullStatus = true;
	}

	function smallWin() {
		window.removeEventListener('resize', fullWin, false);
		for (var i = 0; i < parentArray.length; i++) {
			parentArray[i].style.cssText = backStyle[i];
		}
		player.style.cssText = playerStyle;
		console.log('恢复完成');
		fullStatus = false;
	}

	init();

})();