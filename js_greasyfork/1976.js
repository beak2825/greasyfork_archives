// ==UserScript==
// @name        Bashtube HTML5 Player and Downloader
// @description Добавляет ссылку на видео файл и если браузер поддерживает воспроизведение mp4, то добавляет видеоплеер.
// @namespace   2k1dmg@userscript
// @match       http://bashtube.ru/video/*
// @version     37
// @author      2k1dmg
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1976/Bashtube%20HTML5%20Player%20and%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/1976/Bashtube%20HTML5%20Player%20and%20Downloader.meta.js
// ==/UserScript==

// 2014-12-26

(function(window, _getUtils, _getStyleSheetLoader) {
'use strict';
if (!window || (window && window.self !== window.top)) {
	return;
}
var document = window.document,
	_utils = _getUtils(),
	styleSheetLoader = _getStyleSheetLoader(_utils);

var setEvent = {
	toggleButton: {
		init: function(button, html5ImageColored, html5Image) {
			var onClick = function(event) {
				if (!this.uppod && !this.player) {
					try {
						this.uppod = document.getElementById('uppod');
						this.player = document.getElementById('bt-html5video-player');
						this.container = document.getElementById('bt-html5video-player-container');

						var panel = document.getElementById('bt-html5video-panel');
						var images = panel.getElementsByTagName('img');
						this.image = images[0];
					}
					catch (ex) {
						return;
					};
				}
				this.onclick = function() {
					if (this.uppod.style.display == 'none') {
						this.uppod.style.removeProperty('display');
						this.container.style.display = 'none';
						this.textContent = 'HTML5';
						this.image.src = html5Image;

						this.player.pause();

						this.screenButton.style.display = 'none';
					}
					else {
						this.container.style.removeProperty('display');
						this.uppod.style.display = 'none';
						this.textContent = 'FLASH';
						this.image.src = html5ImageColored;

						this.screenButton.style.removeProperty('display');
					}
				};
				return this.onclick();
			};
			button.onclick = onClick;
		}
	},
	downloadLink: {
		init: function(link) {
			var onClick = function(event) {
				if (event && event.button === 0) {
					event.preventDefault();
					event.stopPropagation();
				}
			};
			link.onclick = onClick;
			link.title = 'Скачивать правой кнопкой мыши!\nИ выбрать: "Сохранить объект как…" или т.п';
		}
	},
	player: {
		init: function(player) {
			player.addEventListener('loadedmetadata', function(e) {
				var width = this.videoWidth,
					height = this.videoHeight;

				(function() {
					var w = _utils.getWidth(width, height),
					m = _utils.getMargin(w),
					p = document.getElementById('bt-html5video-player'),
					c = document.getElementById('bt-html5video-player-container');

					if (w !== 640)
						p.setAttribute('width', w);
					if (m !== 0)
						c.setAttribute('style', 'margin-left: ' + m + 'px');

					setTimeout(function() {
						// postLoad();
						styleSheetLoader(w);
					}, 50);
				}());

				this.volume = 0.5;

				var panel = document.getElementById('bt-html5video-panel');
				var spans = panel.getElementsByTagName('span');
				if (spans[0]) {
					spans[0].textContent = width + 'x';
					spans[1].style.color = 'black';
					spans[1].textContent = height;
					if (height >= 720) {
						spans[2].className = 'supstr'
						spans[2].textContent = ' HD';
					}
				}
			}, false);
		}
	}
};

var createLink = function(params) {
	var file = params.file,
		poster = params.poster,
		flash = params.flash,
		videoInfo = document.getElementsByClassName('video-info')[0],
		canPlay = _utils.canPlayMedia('video/mp4');

	var addHTML5video = function() {
		var wrapper = document.createElement('div');
		wrapper.id = 'bt-html5video-wrapper';
		document.body.appendChild(wrapper);

		var container = document.createElement('div');
		container.id = 'bt-html5video-player-container';

		var player = _utils.createHTML5player({
			id: 'bt-html5video-player',
			width: '640',
			height: '360',
			volume: '0.5',
			controls: 'controls',
			poster: poster,
			//src: file
			source: [{
				src: file,
				type: 'video/mp4'
			}]
		});

		var controls = document.createElement('div');
		controls.id = 'bt-html5video-player-controls';

		var sizeButton = document.createElement('div');
		sizeButton.id = 'bt-html5video-player-size-btn';
		sizeButton.title = 'Размер видеоплеера';
		sizeButton.onclick = function() {
			if (!this.rights && !this.player) {
				try {
					var player = this.player = document.getElementById('bt-html5video-player');
					var contents = document.getElementsByClassName('content');
					var rights = contents[0].getElementsByClassName('right');
					if (rights[1]) {
						this.rights = rights[1];
					}
				}
				catch (ex) {
					return;
				};
			}
			if (this.rights.classList.contains('sizeLarge')) {
				this.rights.classList.remove('sizeLarge');
				container.classList.remove('sizeLarge');
			}
			else {
				this.rights.classList.add('sizeLarge');
				container.classList.add('sizeLarge');
			}
		};
		controls.appendChild(sizeButton);

		var loopBox = document.createElement('div');
		loopBox.title = 'Повторять это видео';
		var loop = document.createElement('input');
		loop.type = 'checkbox';
		loop.name = 'video-loop';
		loop.value = 'false';
		loop.onchange = function() {
			if (this.checked) {
				player.setAttribute('loop', '');
			}
			else if (player.loop) {
				player.removeAttribute('loop');
			}
		};
		loopBox.appendChild(loop);
		loopBox.insertAdjacentHTML('beforeend', 'Loop');
		controls.appendChild(loopBox);

		container.appendChild(controls);
		container.appendChild(player);

		// preLoad();
		styleSheetLoader(canPlay, flash);

		videoInfo.parentNode.insertBefore(container, videoInfo);

		var uppod = document.getElementById('uppod');
		if (uppod)
			uppod.style.display = 'none';

		player.onplay = function() {
			if (typeof this.updateTimeoutID == 'number') {
				window.clearTimeout(this.updateTimeoutID);
				this.updateTimeoutID = null;
			}
			if (typeof wrapper.updateTimeoutID == 'number') {
				window.clearTimeout(wrapper.updateTimeoutID);
				wrapper.updateTimeoutID = null;
			}
			this.updateTimeoutID = window.setTimeout(function() {
				var wrapper = document.getElementById('bt-html5video-wrapper');
				wrapper.classList.add('playing');
				player.classList.add('playing');
				wrapper.style.zIndex = '50';
			}, 50);
		};

		player.onpause = function() {
			if (typeof this.updateTimeoutID == 'number') {
				window.clearTimeout(this.updateTimeoutID);
				this.updateTimeoutID = null;
			}
			if (typeof wrapper.updateTimeoutID == 'number') {
				window.clearTimeout(wrapper.updateTimeoutID);
				wrapper.updateTimeoutID = null;
			}
			this.updateTimeoutID = window.setTimeout(function() {
				var wrapper = document.getElementById('bt-html5video-wrapper');
				wrapper.classList.remove('playing');
				player.classList.remove('playing');
				wrapper.updateTimeoutID = window.setTimeout(function() {
					wrapper.style.removeProperty('z-index');
				}, 500);
			}, 50);
		};

		player.onseeking = function() {
			if (this.currentTime == 0)
				return;
			if (typeof this.updateTimeoutID == 'number') {
				window.clearTimeout(this.updateTimeoutID);
				this.updateTimeoutID = null;
			}
		};

		wrapper.onclick = function() {
			player.pause();
		};

		setEvent.player.init(player);

		var toggleButton = panel.getElementsByClassName('bt-toggle-button');
		if (toggleButton[0]) {
			setEvent.toggleButton.init(toggleButton[0], html5ImageColored, html5Image);
		}

		var downloadLink = panel.getElementsByClassName('bt-download-link');
		if (downloadLink[0]) {
			setEvent.downloadLink.init(downloadLink[0]);
		}
	};

	var panel = document.createElement('div');
	panel.id = 'bt-html5video-panel';

	var html5ImageColored = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATdJREFUeNpifOqtlsDAwDCfgQwgvfUWIxOQfsBAAWCiQO8BEMECxBdgIvypVQzc/vF4db2tjGX4efkUnM8C9McHYDiAOf++fgbTv+9dZ/gPZaODfwjxDzAXYICvmxYyfNuznpAXLiIbAPKGwa/LJ4FUDgOXcxADs5gMVl2fl01G4bMgOwcG2HTNwBgd/H31FNmABxhe+H3vBjiQsAHh9sUMf18+RRZCMeAgEDv8+/oJJYThcc3NR3w6kNpyk0F83j4GdqgXmMWlGThdAsHsP69wu+ADIpo+AQNQGuxkjDBA8gIw+h+gxwIYvM4LYOCwcAG7AESDDPxxYi/Dj+N7GH5h8R4LNlu+blwIxnjABfQwADlnAZEZC6R5IozDiC4LTNYGoBgBYn8oDQqfDdCY2gBK+sjqAQIMACfPddVHcozkAAAAAElFTkSuQmCC';
	var html5Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/klEQVR42sWTqw6DMBSGeYQ9wh5hj7BHqeCuFjRiBotFLsEiZrAEiQSNWYImmcN2/ZudpjA6mNqfHNPT851ba/m+z8Iw5EEQ/GSIsSDbts9/AXieV0sAY+xAgKqq+JbSNJ0DIAKUZSkvDcPA+75ftSRJCHA3AvI832xBDP+qAILW4hDlQcgE2JqZALUOMGkcRx3APgBRFEnImlFlBMD2FADlfOsX4N0AKpXWFccxL4pCnjdNowBi/UcFcF33Qo5pmowz0Ido6UI55KCMXdfJIACROcsy2comYM8fwNpnAPQj2rgJx2PHH2hnK1zKcZwTZoLVvl/oE3AE4d8s778Aj+4t+EF6GnYAAAAASUVORK5CYII=';

	if (canPlay) {
		panel.innerHTML = '<img src="' + html5ImageColored + '" width="16" height="16" alt="">' +
				(flash ? '<button class="bt-toggle-button">FLASH</button>' : '<sub>HTML5</sub>') +
				'<span></span>' +
				'<span></span>' +
				'<span></span>' +
				'<a href="' + file + '" class="bt-download-link" title="Скачивать правой кнопкой мыши!' +
					'И выбрать: &quot;Сохранить объект как…&quot; или т.п">Скачать</a>';
		addHTML5video();
	}
	else {
		panel.innerHTML = '<a href="' + file + '"> Скачать</a>';
	}
	videoInfo.parentNode.insertBefore(panel, videoInfo);
};

var addSearchInBtn = function() {
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	cssStyle.textContent = '.bt-btn {\n' +
	'	cursor: pointer;\n' +
	'	display: inline;\n' +
	'	margin-left: 10px;\n' +
	'	color: #555;\n' +
	'	font-weight: bold;\n' +
	'	background: #eee;\n' +
	'	border: 1px solid #aaa;\n' +
	'	border-radius: 3px;\n' +
	'	transition: all 200ms ease-out;\n' +
	'	opacity: .5;\n' +
	'}\n' +
	'.bt-btn:hover {\n' +
	'	opacity: 1;\n' +
	'	background: transparent;\n' +
	'	box-shadow: 0 0 3px rgba(0, 0, 0, .3);\n' +
	'}\n' +
	'.bt-btn-google:hover {\n' +
	'	color: #2571C6;\n' +
	'}\n' +
	'.bt-btn-yandex:hover  {\n' +
	'	color: #C63025;\n' +
	'}\n';
	document.head.appendChild(cssStyle);

	var videoPages = document.getElementsByClassName('video-page'),
	videoPage = videoPages[0],
	videoTitle = videoPage.getElementsByTagName('h1')[0];

	var searchInButton = {
		handleEvent: function(event) {
			var target = event.target,
			searchURL = /yandex/.test(target.className) ?
				'https://yandex.ru/yandsearch?text=' :
				'https://www.google.ru/search?q=';
			window.open(
				searchURL + encodeURIComponent(target.parentNode.firstChild.textContent)
			);
		}
	};

	[
		['Я', 'Яндекс', 'bt-btn-yandex'],
		['G', 'Google', 'bt-btn-google']
	].forEach(function(s) {
		var sb = document.createElement('button');
		sb.textContent = s[0];
		sb.setAttribute('title', 'искать в ' + s[1]);
		sb.setAttribute('class', 'bt-btn ' + s[2]);
		sb.addEventListener('click', searchInButton, false);
		videoTitle.appendChild(sb);
	});
};

var getParams = function() {
	addSearchInBtn();

	var getScriptContent = function() {
		var lastSibling = uppod.nextSibling,
			targetContent;
		for (var i = 0; i < 15; i++) {
			if (lastSibling.nodeType === 1 &&
				/.*file:\s'(http:[^']*).*/m.test(lastSibling.textContent)) {
			   targetContent = lastSibling;
			   break;
			}
			lastSibling = lastSibling.nextSibling;
		}
		if (targetContent) {
			return targetContent.textContent;
		}
		else {
			return null;
		}
	};

	var getPageBodyParams = function() {
		var bodyContent = getScriptContent() || document.body.innerHTML,
			matchBodyContent = bodyContent.match(/.*file:\s'(http:[^']*).*/m),
			matchBodyContentPoster = bodyContent.match(/.*poster:\s'(http:[^']*).*/m);
		if (matchBodyContent[1]) {
			file = matchBodyContent[1];
			poster = matchBodyContentPoster[1] ? matchBodyContentPoster[1] : '';
			return {'file': file, 'poster': poster, 'flash': false};
		}
	};

	var getUppodParams = function() {
		var matchFlashvars = flashvars.match(/.*file=(http:[^&]*).*/m),
			matchPoster = flashvars.match(/.*poster=(http:[^&]*).*/m);
		if (matchFlashvars[1]) {
			file = matchFlashvars[1];
			poster = matchPoster[1] ? matchPoster[1] : '';
			return {'file': file, 'poster': poster, 'flash': true};
		}
	};

	var uppod = document.getElementById('uppod'),
		uppodParams = uppod.getElementsByTagName('param'),
		flashvars,
		file,
		poster,
		params;
	if ('flashvars' in uppodParams && uppodParams['flashvars'].value) {
		flashvars = uppodParams['flashvars'].value;
		params = getUppodParams();
	}
	else {
		params = getPageBodyParams();
	}
	if (params) {
		return params;
	}
};

var params;
if (document.readyState === 'complete') {
	params = getParams();
	if (params)
		createLink(params);
}
else {
	window.addEventListener('load', function pageLoaded(e) {
		window.removeEventListener('load', pageLoaded, false);
		var params = getParams();
		if (params)
			createLink(params);
	}, false);
}
})(window, function() {
	// _getUtils()
	var
	getScale = function(height) {
		return 360 / height;
	},
	getWidth = function(width, height) {
		return width * getScale(height);
	},
	getMargin = function(width) {
		return (640 - width) / 2;
	},
	canPlayMedia = function(type) {
		try {
			var v = document.createElement('video');
			return v.canPlayType(type) !== '';
		}
		catch (ex) {
			return false;
		}
	},
	createHTML5player = function(param) {
		var player = document.createElement('video'),
			source,
			prop;

		for (prop in param) {
			if (param.hasOwnProperty(prop)) {
				if (prop == 'source') {
					source = param[prop];
					continue;
				}
				player.setAttribute(prop, param[prop]);
			}
		}
		if (source)
			player = createHTML5playerSource(player, source);

		return player;
	},
	createHTML5playerSource = function(player, source) {
		var sourceElement,
			param,
			i,
			prop;

		for (i = 0; i < source.length; i++) {
			sourceElement = document.createElement('source');
			param = source[i];
			for (prop in param) {
				if (param.hasOwnProperty(prop))
					sourceElement.setAttribute(prop, param[prop]);
			}
			player.appendChild(sourceElement);
		}

		return player;
	},
	_slice = Array.slice || (function() {
		var unboundSlice = Array.prototype.slice,
		slice = Function.prototype.call.bind(unboundSlice);
		return slice;
	}());

	return {
		canPlayMedia: canPlayMedia,
		createHTML5player: createHTML5player,
		getWidth: getWidth,
		getMargin: getMargin,
		_slice: _slice
	};

}, function(_utils) {
	// _getStyleSheetLoader()
	var _slice = _utils._slice,
	preLoad = function() {
		var args = _slice(arguments),
		canPlay = args[0],
		flash = args[1];

		var cssStyle = document.createElement('style');
		cssStyle.type = 'text/css';
		cssStyle.textContent = '#bt-html5video-panel {\n' +
			'	width: 640px;\n' +
			'	height: 25px;\n' +
			'	padding: 15px 0 10px 0;\n' +
			'}\n' +
			'#bt-html5video-panel > a {\n' +
			'	margin-right: 20px;\n' +
			'	float: right;\n' +
			'}\n' +
			'#bt-html5video-panel > img {\n' +
			'	margin: 0 0 -3px 20px;\n' +
			'}\n';
		if (canPlay)
			cssStyle.textContent += (flash ? '#bt-html5video-panel > button {\n' : '#bt-html5video-panel > sub {\n') +
			'	margin-left: 10px;\n' +
			'	margin-right: 10px;\n' +
			'}\n' +
			'#bt-html5video-panel button {\n' +
			'	border: 1px solid #aaa;\n' +
			'	background: #eee;\n' +
			'}\n' +
			'#bt-html5video-panel > span {\n' +
			'	font-size: 90%;\n' +
			'}\n' +
			'#bt-html5video-panel > SPAN.supstr {\n' +
			'	vertical-align: top;\n' +
			'	font-size: 65%;\n' +
			'}\n' +
			'#bt-html5video-wrapper {\n' +
			'	z-index: -50;\n' +
			'	position: fixed;\n' +
			'	background: #000;\n' +
			'	top: 0;\n' +
			'	left: 0;\n' +
			'	width: 100%;\n' +
			'	height: 100%;\n' +
			'	opacity: 0;\n' +
			'	transition: opacity 500ms ease-out;\n' +
			'	box-shadow: 0 0 10px 1px #000 inset;\n' +
			'}\n' +
			'#bt-html5video-wrapper.playing {\n' +
			'	opacity: .7;\n' +
			'}\n' +
			'\n' +
			'.content > .right {\n' +
			'	opacity: 1;\n' +
			'	transition: all 300ms ease-in;\n' +
			'}\n' +
			'.content > .right.sizeLarge {\n' +
			'	position: relative;\n' +
			'	z-index: -1;\n' +
			'	opacity: 0;\n' +
			'}\n' +
			'\n' +
			'#bt-html5video-player-container,\n' +
			'#bt-html5video-player {\n' +
			'	position: relative;\n' +
			'	z-index: 100;\n' +
			'}\n' +
			'#bt-html5video-player-container {\n' +
			'	/*outline: 1px solid green;*/\n' +
			'	display: inline-block;\n' +
			'}\n' +
			'#bt-html5video-player-controls {\n' +
			'	position: absolute;\n' +
			'	z-index: 150;\n' +
			'	width: 100%;\n' +
			'	height: 28px;\n' +
			'	background-color: rgba(35,31,32,.74);\n' +
			'	opacity: 0;\n' +
			'	color: #ddd;\n' +
			'}\n' +
			'#bt-html5video-player-container:hover #bt-html5video-player-controls {\n' +
			'	opacity: 1;\n' +
			'}\n' +
			'#bt-html5video-player-size-btn {\n' +
			'	cursor: pointer;\n' +
			'	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAbCAYAAAAgVez8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzUyQjZBRDEzRTgxMTFFNEE4QzFFRTlDNDAzNkJBNDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzUyQjZBRDIzRTgxMTFFNEE4QzFFRTlDNDAzNkJBNDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NTJCNkFDRjNFODExMUU0QThDMUVFOUM0MDM2QkE0OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NTJCNkFEMDNFODExMUU0QThDMUVFOUM0MDM2QkE0OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhVpoj0AAACESURBVHja7JgxDoAgDACp8UfOfkffhLM/ceZNOLESMDVQuFshKdc2KanEGN1MLG4yEEYYYYRNsWbOvFKM04pwa/wfiS4Rvj4GPKy1dCI0fuNTeX+32tKJW1OYsYQwwuN+PEaZx9XCngr3OX+LkMyKZ1OKEXrKorDTQhhhhBFGuB9eAQYAbtsR3i9+1uIAAAAASUVORK5CYII=) no-repeat;\n' +
			'	width: 30px;\n' +
			'	height: 27px;\n' +
			'}\n' +
			'#bt-html5video-player-container.sizeLarge #bt-html5video-player-size-btn {\n' +
			'	background-position: -30px 0;\n' +
			'}\n' +
			'#bt-html5video-player-controls > * {\n' +
			'	display: inline-block;\n' +
			'	vertical-align: middle;\n' +
			'	margin: 0 2px;\n' +
			'}\n';
		document.head.appendChild(cssStyle);
	},
	postLoad = function() {
		var args = _slice(arguments),
		w = args[0];

		var cssStyle = document.createElement('style');
		cssStyle.type = 'text/css';
		cssStyle.textContent = ('#bt-html5video-player {\n' +
			'	box-shadow: 0 0 5px 1px #000;\n' +
			'}\n' +
			'#bt-html5video-player.playing {\n' +
			'	box-shadow: 0 0 5px 1px #fff;\n' +
			'}\n' +
			'#bt-html5video-player-container > #bt-html5video-player {\n' +
			'	transition: all 300ms ease-in;\n' +
			'}\n' +
			'#bt-html5video-player-container.sizeLarge > #bt-html5video-player {\n' +
			'	width: 960px;\n' +
			'	height: 540px;\n' +
			'}\n').
			replace('960', parseInt(w) * 1.5);
		document.head.appendChild(cssStyle);
	};

	return function(f, s) {
		if (typeof s != 'undefined') {
			preLoad.apply(null, arguments);
		}
		else {
			postLoad.apply(null, arguments);
		}
	};
});
