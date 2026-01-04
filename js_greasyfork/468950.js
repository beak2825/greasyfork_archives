// ==UserScript==
// @name         巴哈姆特哈啦區：嵌入 Twitter 貼文
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  embed Twitter post at forum.gamer.com
// @author       Rplus
// @match        https://m.gamer.com.tw/forum/C*.php?*
// @match        https://forum.gamer.com.tw/C*.php?*
// @license      WTFPL
// @grant        GM_registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468950/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%EF%BC%9A%E5%B5%8C%E5%85%A5%20Twitter%20%E8%B2%BC%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/468950/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%EF%BC%9A%E5%B5%8C%E5%85%A5%20Twitter%20%E8%B2%BC%E6%96%87.meta.js
// ==/UserScript==

(async function() {
	'use strict';

	const ori_config = {
		theme: 'light', // light, dark
		dnt: true, // ads
		align: 'center', // left, right, center
		// width: null, // 250 ~ 550
		lang: 'zh-tw', // https://developer.twitter.com/en/docs/twitter-for-websites/supported-languages
		no_conversation: true, // conversation: none
		hide_media: false, // (media) cards: hidden
	};

	let config = await GM.getValue('config');
	if (!config) {
		config = ori_config;
		// GM.setValue('config', config);
	};

	GM_registerMenuCommand('選項', loadGui, 'O');
	GM_registerMenuCommand('重設', resetConfig, 'R');

	function resetConfig() {
		GM.setValue('config', ori_config);
	}
	function loadGui() {
		(function(doc, id) {
			if (doc.getElementById(id)) return;
			let fjs = doc.getElementsByTagName('script')[0];
			let js = doc.createElement('script');
			js.id = id;
			js.src = 'https://cdn.jsdelivr.net/npm/lil-gui@0.18';
			fjs.parentNode.insertBefore(js, fjs);
			js.onload = adjConfig;
		}(document, 'dat-lil'))
	}
	function adjConfig(argument) {
		let GUI = lil.GUI;
		const gui = new GUI({ width: 120 });
		gui.add( config, 'theme', ['light', 'dark']).name('色系');
		gui.add( config, 'lang').name('語系');
		gui.add( config, 'align', ['left', 'right', 'center']).name('對齊');
		gui.add( config, 'hide_media').name('純文字');
		gui.add( config, 'no_conversation').name('無上下文');
		gui.add( config, 'dnt').name('停止追蹤');
		gui.onChange(e => {
			GM.setValue('config', e.object);
		});
	}

	let attrs = `
		data-theme="${config.theme}"
		data-dnt="${config.dnt}"
		data-align="${config.align}"
		data-lang="${config.lang}"
		${config.no_conversation ? 'data-conversation="none"' : ''}
		${config.hide_media ? 'data-cards="hidden"' : ''}
	`.trim();

	let links = document.querySelectorAll('.cbox_txt a, .c-post__body a');
	let has_twitter_link = false;

	links.forEach(a => {
		let qs = new URLSearchParams(a.search);
		let regex = /^http(?:s)?:\/\/(?:m(?:obile)?\.)?twitter\.com\/[^\/]+\/status\/(\d+)/;
		let url = qs?.get('url');
		if (!url || !regex.test(url)) { return; }

		has_twitter_link = true;
		let twitter_id = url.match(regex)[1];


		a.outerHTML = `<details open><summary>${a.outerHTML}</summary>
			<blockquote class="twitter-tweet" ${attrs}><a href="https://twitter.com/i/status/${twitter_id}"></a></blockquote>
		</details>`
	});

	if (has_twitter_link) {
		// load embed script
		// https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
		window.twttr = (function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0],
				t = window.twttr || {};
			if (d.getElementById(id)) return t;
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://platform.twitter.com/widgets.js';
			fjs.parentNode.insertBefore(js, fjs);

			t._e = [];
			t.ready = function(f) {
				t._e.push(f);
			};

			return t;
		}(document, 'script', 'twitter-wjs'));
	}

})();