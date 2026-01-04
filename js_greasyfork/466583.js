// ==UserScript==
// @name         巴哈姆特動畫瘋小幫手：封面圖 & 自動開始 & 留言連結 & 彈幕熱圖
// @namespace    http://tampermonkey.net/
// @version      1.7.5
// @description  幫巴哈姆特動畫瘋加上封面 & 自動播放 & 留言區的直連連結 & 彈幕熱圖
// @author       Rplus
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @license      WTFPL
// @grant        GM_registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/466583/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%B0%8F%E5%B9%AB%E6%89%8B%EF%BC%9A%E5%B0%81%E9%9D%A2%E5%9C%96%20%20%E8%87%AA%E5%8B%95%E9%96%8B%E5%A7%8B%20%20%E7%95%99%E8%A8%80%E9%80%A3%E7%B5%90%20%20%E5%BD%88%E5%B9%95%E7%86%B1%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/466583/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%B0%8F%E5%B9%AB%E6%89%8B%EF%BC%9A%E5%B0%81%E9%9D%A2%E5%9C%96%20%20%E8%87%AA%E5%8B%95%E9%96%8B%E5%A7%8B%20%20%E7%95%99%E8%A8%80%E9%80%A3%E7%B5%90%20%20%E5%BD%88%E5%B9%95%E7%86%B1%E5%9C%96.meta.js
// ==/UserScript==

(async function() {
	let options = await GM.getValue('options');
	if (!options) {
		options = {
			cover: true,
			autostart: true,
			permalink: true,
			heatmap: true,
			heatmapVisibility: true,
		};
		GM.setValue('options', options);
	};

	let optionsText = {
		cover: '封面圖',
		autostart: '自動開始',
		permalink: '留言連結',
		heatmap: '彈幕熱圖',
	};

	function triggerConfig(type) {
		options[type] = !options[type];
		GM.setValue('options', options);
	}

	GM_registerMenuCommand(getMenuText('cover'), () => triggerConfig('cover'), 'C');
	GM_registerMenuCommand(getMenuText('autostart'), () => triggerConfig('autostart'), 'A');
	GM_registerMenuCommand(getMenuText('permalink'), () => triggerConfig('permalink'), 'P');
	GM_registerMenuCommand(getMenuText('heatmap'), () => triggerConfig('heatmap'), 'H');
	GM_registerMenuCommand('init', () => init(), 'I');

	function getMenuText(type) {
		return `${options[type] ? '✅ 已啟用' : '❎ 已停用'}：${optionsText[type]}`;
	}

	unsafeWindow.addEventListener('load', init);

	unsafeWindow.navigation.addEventListener('navigate', () => {
		setTimeout(init, 2000);
	});

	unsafeWindow.BahaWall.showUpload = (e) => {
		e.closest('.reply-input')?.querySelector('input[type="file"]')?.click();
	}
	document.querySelector('#w-post-box').addEventListener('click', (e) => {
		if (e.target.tagName !== 'INPUT' || e.target.type !== 'file') {
			return;
		}
		e.target.accept = 'image/*';
	})

	function init() {
		if (options.cover) {
			initCover();
		}

		// latest duration
		// animefun.breakPoint.breakPoint

		if (options.autostart) {
			// auto start when it is not comment permalink
			if (location.search.indexOf('pcid') === -1) {
				checkReady();
			}
		}

		// right click to add permalink
		if (options.permalink) {
			document.querySelector('.webview_commendlist').addEventListener('contextmenu', right_click_comment_to_add_permalink);
		}

		// danmu heatmap
		if (options.heatmap) {
			danmuHelper();
		}
	}

	function right_click_comment_to_add_permalink(e) {
		let span = e.target;
		if (span.className !== 'reply_time') { return; }
		let a = span.parentElement.querySelector('a.reply_menu');
		if (!a) { return; }
		e.preventDefault();

		let config = JSON.parse(a.dataset?.tippyMenuComment);
		let qs = new URLSearchParams({
			sn: new URLSearchParams(location.search).get('sn'),
			pcid: config.pid || config.cid,
		});
		if (config.pid) {
			qs.append('cid', config.cid);
		}
		let url = `https://ani.gamer.com.tw/animeVideo.php?` + qs.toString();
		span.className += ' inited';
		span.innerHTML = `<a href="${url}" target="_blank"># ${span.textContent}</a>`;
	}

	function initCover() {
		let cover = (unsafeWindow.ani_video_html5_api?.poster !== location.href && unsafeWindow.ani_video_html5_api?.poster) || unsafeWindow.animefun.poster;
		// insert poster
		// document.querySelector('h1')?.insertAdjacentHTML('afterbegin', `
		// 	<a href="${cover}" target="_blank">
		// 		<img src="${cover}" style="float: left; height: 2em; margin-top: 4px; margin-right: 8px;" />
		// 	</a>`);

		let h1 = document.querySelector('h1');
		if (h1) {
			h1.innerHTML = `
				<a href="${cover}" target="_blank">
					<img src="${cover}" style="float: left; height: 2em; margin-top: 4px; margin-right: 8px;" />
				</a>${h1.textContent}`;
		}

		// insert published time
		let timeTag = document.querySelector('.anime_info_detail .uploadtime');
		let time = timeTag?.textContent.split('：')?.[1];
		if (time) {
			timeTag.textContent += ` (${getRelatedDays(time)}天前)`;
		}
	}

	function getRelatedDays(time = new Date()) {
		return ((new Date() - new Date(time))/(1000*60*60*24)).toFixed();
	}

	function checkReady(counter = 0) {
		setTimeout(() => {
			console.log(111, unsafeWindow.adult);
			if (unsafeWindow.AnimeRoute && unsafeWindow.adult && unsafeWindow.animefun) {
				unsafeWindow.adult.click();
			} else {
				if (counter < 40) {
					checkReady(counter + 1);
				}
			}
		}, 1000)
	}

	function danmuHelper() {
		console.log('danmuHelper')
		let _danmu = unsafeWindow.animefun?.danmu;
		let sn = new URLSearchParams(location.search)?.get('sn');

		if (_danmu && _danmu.length) {
			danmuAnal(_danmu);
		} else {
			fetch('https://ani.gamer.com.tw/ajax/danmuGet.php', {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				},
				cache: 'force-cache',
				body: `sn=${sn}`,
				method: "POST",
			}).then(r => r.json()).then(danmuAnal);
		}
	}

	function updateVideoDuration(e) {
		let key = '';
		let target = document.querySelector('.danmu-heatmap');
		let new_v = document.getElementById('ani_video_html5_api')?.duration;
		let old_v = parseFloat(getComputedStyle(target).getPropertyValue('--video-duration'));

		if (new_v && old_v && new_v > old_v && isFinite(new_v)) {
			console.log('video-source-duration', {new_v, old_v});
			target.style.setProperty('--video-source-duration', new_v);
			document.getElementById('ani_video_html5_api').removeEventListener('durationchange', updateVideoDuration);
		}
	}
	let timer = 0;
	function obVideo() {
		if (!document.getElementById('ani_video_html5_api') && timer < 20) {
			setTimeout(obVideo, 1000);
		} else {
			document.getElementById('ani_video_html5_api').addEventListener('durationchange', updateVideoDuration);
		}
	}

	function danmuAnal(danmu) {
		console.log('danmuAnal')
		// let byUser = danmu.reduce((all, i) => {
		// 	let uid = i.userid;
		// 	if (!all[uid]) { all[uid] = []; }
		// 	all[uid].push(i);
		// 	return all;
		// }, {});
		let danmu_duration = danmu[danmu.length - 1].time / 10;
		obVideo();

		let danmu_set_item = document.querySelector('.ani-setting-item.danmu');
		if (!danmu_set_item) {
			document.querySelector('#ani-tab-content-2 .ani-setting-section:not(.is-seperate) .ani-setting-item')?.insertAdjacentHTML('afterend', `
				<div class="ani-setting-item ani-flex ani-setting-item--danmu">
					<div class="ani-setting-label">彈幕熱圖</div>
					<div class="ani-set-flex-right">
						<div class="ani-checkbox">
							<label class="ani-checkbox__label">
								<input type="checkbox" id="danmu-heatmap-ckbox" ${options.heatmapVisibility ? 'checked' : ''} />
								<div class="ani-checkbox__button"></div>
							</label>
						</div>
					</div>
				</div>
			`);
		}

		document.querySelector('#danmu-heatmap-ckbox')?.addEventListener('change', (e) => {
			document.querySelector('.danmu-heatmap').hidden = !e.target.checked;
			triggerConfig('heatmapVisibility');
		});

		let d1 = document.querySelector('.danmu-heatmap');
		let s1 = document.querySelector('.danmu-heatmap-style');
		console.log({d1})
		if (d1) { d1.remove(); }
		if (s1) { s1.remove(); }

		// heatmap
		let dots = `<div class="danmu-heatmap" ${options.heatmapVisibility ? '' : 'hidden'}>` + danmu.map(i => {
			return `<i data-time="${i.time / 10}" style="--danmu-time: ${i.time / 10}" title="${i.text}"></i>`;
		}).join('') + '</div>';
		let dots_style = `<style class="danmu-heatmap-style">
			.danmu-heatmap {
				--video-duration: var(--video-source-duration, ${danmu_duration});
				position: absolute;
				left: 0;
				right: 0;
				top: 100%;
				z-index: 1;
				height: 1em;
				overflow: hidden;
				background-color: #000;
			}
			.danmu-heatmap i {
				position: absolute;
				left: calc(var(--danmu-time, 1) / var(--video-duration) * 100%);
				margin-left: -0.25em;
				width: 0.5em;
				height: 1em;
				background: #fff;
				opacity: var(--dh-op, ${danmu.length > 1000 ? 0.05 : 0.1});
			}
			.danmu-heatmap i:hover {
				opacity: .8;
				z-index: 2;
				background: #ff0;
			}
			.reply_time a {
				color: unset;
			}
		</style>`;
		let videoframe = document.querySelector('.videoframe');
		videoframe.style.position = 'relative';
		videoframe.insertAdjacentHTML('beforeend', dots + dots_style);

		videoframe.querySelector('.danmu-heatmap').addEventListener('click', danmuJump);

		unsafeWindow.navigation.addEventListener('navigate', () => {
			videoframe.querySelector('.danmu-heatmap').removeEventListener('click', danmuJump);
		});
	}

	function danmuJump(e) {
		if (e.target.tagName !== 'I') { return; }
		jumpVideoTime(+e.target.dataset?.time);
	}

	function jumpVideoTime(time = 0) {
		document.getElementById('ani_video_html5_api').currentTime = time;
	}
})();
