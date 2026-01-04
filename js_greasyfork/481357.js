/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               左手医生匿名化
// @namespace          PY-DNG userscripts
// @version            0.1.9
// @description        去除或随机更换左手医生页面水印
// @author             PY-DNG
// @license            Do What The F*ck You Want To Public License
// @match              *://ai-app.zuoshouyisheng.com/chat/*
// @require            https://update.greasyfork.org/scripts/456034/1282804/Basic%20Functions%20%28For%20userscripts%29.js
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAArZJREFUOE99k1toVFcUhr91ZubMGTXGRE2a1jJBk4qJYsWA2qdYiopUrBewSKIhRS1BRXwI4tOhIPggoqJUbBqs2JaqKBTxAkWD16CNGtRUBGMxGpJ2qk7UMZl95iyZkYmDqa6XvdiXb//7X2sLOVF3X53SUpKuiJ87/3aum49cQWS9bFnSKunFuh7d4Bs2iKdRNbwQI5fUcMDxOLqvShJZQHxuUxnIZ3nTRu6SIE1gnZK6Xm1Qjz0YUAPZMZN7xMVwyPdo/nm2tMbnNDUAa+2S8Cfhkki3BOiQFd16I3GXqf+0gHkJThHkl8GI4gxgEIrHX+rRbP/H7p2//vhQxfp61On6P2Rllz74+wc+TlwD9XiWLOSMSVFtOeQXlkNxBdiR18oyQGHR93ub7ZQVPjX6ZE2fLLuiqx8d0k2mTQ56yq62FolNX6DDKGVjfhS3aCIBK21C+rAP/Y9ZcmyVHM36kjExN5Zf1E+tFI3qsVQNoawnL3rgaReYfhZc3i7HhwBqrmq1+rpJDHPVSOZGfwCedsKTTkgl6Q0G2REvZHuHK8lBwMqbOsf3+E4NM7KmpRJK7LYQu6Pgyb1AiG15hv0t+6X/bcVS264xNYxOSzVx6P4T/r2l4NMeCMvWsRM40uKK967Gkto27euPkdd1nlTvDQL5H5EqmsyFMZOo/+UL6cRVa+YFvhq3jsbhFfQlkiw+XCnPB58wy9XH3a0URAqg/HPIGwcSAkKkLJtzsbMUvbynlSXfCKGxIAEW/jRefh8EROfpfPX1Wysg8wqihIorYVQ5BCIgdgaUAWagQRh4xKzfZkvrkCqUztcPnGHUBMOssIczpaDsNSjyIYgDqjDQxfXKNqpc981nG9IHafK0NVrl2H5d0LG+DDlE7RE8s8Q/DtbGE43Sk2vo/wJyN1S7GnxfFV4B3Vgcanqr72kAAAAASUVORK5CYII=
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/481357/%E5%B7%A6%E6%89%8B%E5%8C%BB%E7%94%9F%E5%8C%BF%E5%90%8D%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481357/%E5%B7%A6%E6%89%8B%E5%8C%BB%E7%94%9F%E5%8C%BF%E5%90%8D%E5%8C%96.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */

(function() {
    'use strict';

	const CONST = {
		Text: {
			Setting: {
				Random: ['[ ]随机水印ID', '[✔]随机水印ID'],
				HideID: ['[ ]隐藏水印ID', '[✔]隐藏水印ID'],
				Hide: ['[ ]隐藏水印', '[✔]隐藏水印'],
			}
		}
	};

	let watermark, content;
	detectDom({
		selector: 'body>div>div[style="position: relative;"]>div[style]:first-child',
		attributes: true,
		callback: _watermark => {
			watermark = _watermark;
			const observer = new MutationObserver((mutationList, observer) => {
				const content = getContent();
				if (!(!!getUrlArgv('showId') ^ !!content.id) && content.text) {
					work(watermark, content);
					observer.disconnect();
				}
			});
			observer.observe(watermark, {
				attributes: true,
				attributeFilter: ['style']
			});
		}
	});

	function work(_watermark, _content) {
		[watermark, content] = [_watermark, _content];

		// Load settings
		setContent(GM_getValue('id', null), GM_getValue('text', null));
		makeBooleanSettings([{
			key: 'random',
			text: CONST.Text.Setting.Random,
			callback: (key, val) => val ? setContent(randstr(content.id.length, false, false), null) : setContent(content.id, null),
			initCallback: true
		}, {
			key: 'hideid',
			text: CONST.Text.Setting.HideID,
			callback: (key, val) => val ? hideID() : showID(),
			initCallback: true
		}, {
			key: 'hide',
			text: CONST.Text.Setting.Hide,
			callback: (key, val) => watermark.style.display = val ? 'none' : '',
			initCallback: true
		}]);
	}

	function hideID() {
		const xml = parseXML();
		$(xml, 'tspan:first-child').style.visibility = 'hidden';

		setSVG(xml);
	}

	function showID() {
		const xml = parseXML();
		$(xml, 'tspan:first-child').style.removeProperty('visibility');

		setSVG(xml);
	}

	function setContent(id=null, text=null) {
		const xml = parseXML();
		id !== null && ($(xml, 'tspan:first-child').innerHTML = id);
		text !== null && ($(xml, 'tspan:last-child').innerHTML = text);

		setSVG(xml);
	}

	function getContent() {
		const xml = parseXML();

		return {
			id: $(xml, 'tspan:first-child').innerHTML,
			text: $(xml, 'tspan:last-child').innerHTML
		}
	}

	function parseXML() {
		const url = watermark.style.backgroundImage.split(',', 2)[1].split('"', 2)[0];
		const svg = decodeURIComponent(url);
		const DP = new DOMParser();
		const xml = DP.parseFromString(svg, 'image/svg+xml');

		return xml;
	}

	function setSVG(xml) {
		const svg = xml.lastChild.outerHTML;
		const url = encodeURIComponent(svg);
		const val = `url("data:image/svg+xml,${url}")`;
		watermark.style.backgroundImage = val;
	}

	function makeBooleanSettings(settings) {
		for (const setting of settings) {
			makeBooleanMenu(setting.text, setting.key, setting.defaultValue, setting.callback, setting.initCallback);
		}

		function makeBooleanMenu(texts, key, defaultValue=false, callback=null, initCallback=false) {
			const initialVal = GM_getValue(key, defaultValue);
			const initialText = texts[initialVal + 0];
			let id = GM_registerMenuCommand(initialText, onClick/*, {
				autoClose: false
			}*/);
			initCallback && callback(key, initialVal);

			function onClick() {
				const newValue = !GM_getValue(key, defaultValue);
				const newText = texts[newValue + 0];
				GM_setValue(key, newValue);
				GM_unregisterMenuCommand(id);
				id = GM_registerMenuCommand(newText, onClick/*, {
					autoClose: false
				}*/);

				typeof callback === 'function' && callback(key, newValue);
			}
		}
	}

	// Returns a random string
	function randstr(length=16, nums=true, cases=true) {
		const all = 'abcdefghijklmnopqrstuvwxyz' + (nums ? '0123456789' : '') + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
		return Array(length).fill(0).reduce(pre => (pre += all.charAt(randint(0, all.length-1))), '');
	}

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}) ();