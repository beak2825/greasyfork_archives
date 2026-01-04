// ==UserScript==
// @name               [Neko0] Iwara functional enhancements
// @name:zh            [Neko0] Iwara 增强
// @name:ja            [Neko0] Iwara 機能強化
// @description        Provide  the function of "one-click copy name and like+follow+download" and the function of "copy name only" separately, which makes it convenient to save your favorite videos to your local device, so that you can still access them even if the author deletes their account. Automatically load the highest resolution video source. Detect resolution and frame rate, and low-quality videos will be marked with a red warning. Automatically click the "R18 warning button", eliminating the need to manually close the prompt every time.
// @description:zh     提供 "一键复制名字 并 喜欢+关注+下载" 与单独 "复制名字" 的功能, 便捷地收藏自己喜欢的视频到本地, 以免作者销号后就看不到作品了。自动加载最高分辨率视频源。侦测分辨率和帧率，过低的质量会以红色警示。自动点击“R18警告按钮”，不再需要每次手动关闭提示。
// @description:ja     「名前を一括コピーして、いいね＋フォロー＋ダウンロード」および「名前のみコピー」の機能を提供し、自分の好きな動画を手軽にローカルに保存できるようにしました。作者がアカウントを削除しても作品を見ることができます。最高解像度の動画ソースを自動的に読み込みます。解像度とフレームレートを検出し、低品質の動画は赤い警告で表示されます。自動的に「R18警告ボタン」をクリックし、毎回手動でプロンプトを閉じる必要がなくなります。
// @version            1.2.9
// @author             JoJunIori
// @namespace          neko0-web-tools
// @icon               https://www.iwara.tv/logo.png
// @homepageURL        https://github.com/nekozero/neko0-web-tools
// @supportURL         https://t.me/+URovzRdPTyHlWtQd
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_setClipboard
// @grant              window.onurlchange
// @run-at             document-idle
// @license            AGPL-3.0-or-later
// @require            https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match              *://*.iwara.tv/*
// @downloadURL https://update.greasyfork.org/scripts/382345/%5BNeko0%5D%20Iwara%20functional%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/382345/%5BNeko0%5D%20Iwara%20functional%20enhancements.meta.js
// ==/UserScript==
/* global $ ClipboardJS */
/* jshint esversion: 9 */

/** 初始化设定 开始 */
// 设置项默认值
let setting = {
	type: 'name',
}

// 判断是否存在设定
if (GM_getValue('iwara_setting') === undefined) {
	GM_setValue('iwara_setting', setting)
} else {
	let store = GM_getValue('iwara_setting')
	$.each(setting, function (i) {
		if (store[i] === undefined) {
			store[i] = setting[i]
		}
	})
	GM_setValue('iwara_setting', store)
}
/** 初始化设定 结束 */

// 实时获取最新设置
let getSet = () => {
	return GM_getValue('iwara_setting')
}
// 更改设置
let setSet = (key, value) => {
	let store = GM_getValue('iwara_setting')
	store[key] = value
	GM_setValue('iwara_setting', store)
}
console.log('iwara_setting', getSet())

// 置入Style
let style = `<style>
.page-video__bottom {
    border-radius: 5px 5px 0 0 !important;
}
.one-tap, .copy-name {
    margin-left: 10px;
}
.detection {
    position: absolute;
    line-height: 20px;
    height: 20px;
    top: -30px;
    width: 100%;
    text-align: center;
    color: #3498db;
    white-space: nowrap;
}
.copy-name {
    position: relative
}
.copy-name ul {
    position: absolute;
    margin: 0;
    top: 100%;
    left: 0;
    z-index: 99;
    border-radius: 5px;
    background-color: var(--primary-text);
    color: var(--primary);
    text-align: left;
    padding: 10px;
    transition: 0.3s all;
    transform: scale(0);
    transform-origin: 0 0;
}
.copy-name:hover ul {
    transform: scale(1);
}
.copy-name ul li {
    cursor: pointer;
    list-style: none;
    padding: 2px 4px;
    margin: 2px 0;
    border-radius: 5px;
}
.copy-name ul li.s {
    background-color: var(--primary);
    color: var(--primary-text);
}
.page-video__actions .likeButton:has(svg.svg-inline--fa.fa-heart-crack) {
    background-color: var(--red);
}
// 根除R18警告
.adultWarning {
    display: none !important;
}
</style>`
$('head').append(style)

var timer = null

// 获取作品上传时间
async function getCreateDate(callback) {
	let url = window.location.href
	let parts = url.split('/')
	let text = parts[4]
	await fetch('https://api.iwara.tv/video/' + text)
		.then(response => response.json())
		.then(data => {
			let date = new Date(data.createdAt)
			let formattedDate = []
			// 格式1 230101
			formattedDate.push(
				date.getFullYear().toString().slice(-2) +
					('0' + (date.getMonth() + 1)).slice(-2) +
					('0' + date.getDate()).slice(-2)
			)
			// 格式2 2023-1-1
			formattedDate.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())

			callback(formattedDate)
		})
}

// 视频播放页
async function videoPage() {
	console.log('ƒ videoPage')

	if ($('.one-tap')[0]) {
		clearInterval(timer)
	}
	console.log('has one-tap?', $('.one-tap')[0])
	console.log('about timer:', timer)

	let video = document.querySelector('.vjs-tech')
	if (video) {
		clearInterval(timer)

		// 自动点击R18警告的继续按钮
		if ($('.adultWarning')[0]) {
			$('.adultWarning__actions>button')[0].click()
		}

		// 文件名
		let username = $('.username').attr('title')
		let title = $('.page-video__details > .text.mb-1.text--h1.text--bold').text()
		let filename = null
		let type_name = username + ' - ' + title
		let type_date1 = null
		let type_date2 = null
		let type_date3 = null
		let type_date4 = null
		await getCreateDate(function (formattedDate) {
			console.log(formattedDate)
			type_date1 = formattedDate[0] + ' - ' + title
			type_date2 = formattedDate[1] + ' - ' + title
			type_date3 = formattedDate[0] + ' - ' + username + ' - ' + title
			type_date4 = formattedDate[1] + ' - ' + username + ' - ' + title
		})

		// 置入DOM
		let dom = `
<button class="button copy-name button--primary button--solid" type="button"><div class="text text--small"><div class="icon mr-1">
    <svg class="svg-inline--fa fa-share-nodes " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V428.7c-2.7 1.1-5.4 2-8.2 2.7l-60.1 15c-3 .7-6 1.2-9 1.4c-.9 .1-1.8 .2-2.7 .2H240c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 381l-9.8 32.8c-6.1 20.3-24.8 34.2-46 34.2H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h8.2c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.8 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8h8.9c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7L384 203.6V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM549.8 139.7c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM311.9 321c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L512.1 262.7l-71-71L311.9 321z"/></svg>
    </div>复制名字</div>
    <ul>
        <div>»切换格式:</div>
        <li class="${getSet().type == 'name' ? 's' : ''} type_name">${type_name}</li>
        <li class="${getSet().type == 'date1' ? 's' : ''} type_date1">${type_date1}</li>
        <li class="${getSet().type == 'date2' ? 's' : ''} type_date2">${type_date2}</li>
        <li class="${getSet().type == 'date3' ? 's' : ''} type_date3">${type_date3}</li>
        <li class="${getSet().type == 'date4' ? 's' : ''} type_date4">${type_date4}</li>
    </ul>
</button>
<button class="button one-tap button--primary button--solid" type="button"><div class="text text--small"><div class="icon mr-1">
    <svg class="svg-inline--fa fa-share-nodes " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"/></svg>
    </div>一键喜欢关注下载</div>
</button>
`
		$('.container-fluid > .row > .col-12')[0].prepend($('.page-video__bottom')[0])
		$('.page-video__actions').append(dom)
		// 替换广告的位置
		$('.page-video__details')[0].after($('.contentBlock.mb-2')[0])

		// 绑定 按键 事件
		$('li.type_name').click(function () {
			console.log('type', 'name')
			setSet('type', 'name')
			$(this).addClass('s').siblings().removeClass('s')
		})
		$('li.type_date1').click(function () {
			console.log('type', 'date1')
			setSet('type', 'date1')
			$(this).addClass('s').siblings().removeClass('s')
		})
		$('li.type_date2').click(function () {
			console.log('type', 'date2')
			setSet('type', 'date2')
			$(this).addClass('s').siblings().removeClass('s')
		})
		$('li.type_date3').click(function () {
			console.log('type', 'date3')
			setSet('type', 'date3')
			$(this).addClass('s').siblings().removeClass('s')
		})
		$('li.type_date4').click(function () {
			console.log('type', 'date4')
			setSet('type', 'date4')
			$(this).addClass('s').siblings().removeClass('s')
		})
		$('.copy-name').click(() => {
			if (getSet().type == 'date1') {
				filename = type_date1
			} else if (getSet().type == 'date2') {
				filename = type_date2
			} else if (getSet().type == 'date3') {
				filename = type_date3
			} else if (getSet().type == 'date4') {
				filename = type_date4
			} else {
				filename = type_name
			}
			// 替换windows文件名禁用字符
			filename = filename.replace(/[/\\:*?<>|]/g, ' ')
			GM_setClipboard(filename)
		})
		$('.one-tap').click(() => {
			// 拷贝名称
			$('.copy-name').click()
			// 喜欢
			$('.page-video__actions svg.svg-inline--fa.fa-heart').parent().parent().parent().click()
			// 关注
			$('.page-video__byline__actions svg.svg-inline--fa.fa-heart').parent().parent().parent().click()

			// 下载
			$('.dropdown__content a:contains("Source")')[0].click()
		})

		// 解决新版默认不以Source分辨率播放并无法记忆用户设置的问题
		const checkSource = function () {
			return new Promise((resolve, reject) => {
				console.log('ƒ checkSource')
				if (!video.src.match('_Source.mp4')) {
					$('.vjs-menu-item.resolution-Source').click()
				}
				resolve()
			})
		}

		const checkResolution = function () {
			console.log('ƒ checkResolution start')

			// video可播放后将分辨率标注出来
			video.oncanplay = function () {
				if (document.querySelector('.detection') !== null) return false
				console.log(this)
				console.log(this.videoWidth, this.videoHeight)

				if (
					(this.videoWidth < 1920 && this.videoHeight < 1080) ||
					(this.videoWidth < 1080 && this.videoHeight < 1920)
				) {
					$('.container-fluid > .row > .col-12')
						.eq(0)
						.prepend(
							`<div class="detection"><span class="resolution" style="color: red;">${this.videoWidth} x ${this.videoHeight}</span>　<span class="fps"></span></div>`
						)
				} else {
					$('.container-fluid > .row > .col-12')
						.eq(0)
						.prepend(
							`<div class="detection"><span class="resolution">${this.videoWidth} x ${this.videoHeight}</span>　<span class="fps"></span></div>`
						)
				}

				// 获取帧率 from https://stackoverflow.com/a/73098112
				// Part 1:
				var vid = this
				var last_media_time, last_frame_num, fps
				var fps_rounder = []
				var frame_not_seeked = true
				// Part 2 (with some modifications):
				function ticker(useless, metadata) {
					var media_time_diff = Math.abs(metadata.mediaTime - last_media_time)
					var frame_num_diff = Math.abs(metadata.presentedFrames - last_frame_num)
					var diff = media_time_diff / frame_num_diff
					if (
						diff &&
						diff < 1 &&
						frame_not_seeked &&
						fps_rounder.length < 50 &&
						vid.playbackRate === 1 &&
						document.hasFocus()
					) {
						fps_rounder.push(diff)
						fps = Math.round(1 / get_fps_average())
						document.querySelector('.fps').textContent =
							'fps:' + fps + ', certainty:' + fps_rounder.length * 2 + '%'
						if (fps < 60) {
							$('.fps').attr('style', 'color: red')
						} else {
							$('.fps').attr('style', 'color: #3498db')
						}
					}
					frame_not_seeked = true
					last_media_time = metadata.mediaTime
					last_frame_num = metadata.presentedFrames
					vid.requestVideoFrameCallback(ticker)
				}
				vid.requestVideoFrameCallback(ticker)
				// Part 3:
				vid.addEventListener('seeked', function () {
					fps_rounder.pop()
					frame_not_seeked = false
				})
				// Part 4:
				function get_fps_average() {
					return fps_rounder.reduce((a, b) => a + b) / fps_rounder.length
				}
			}
		}

		checkSource().then(checkResolution)
	}
}

if (window.location.pathname.indexOf('/video/') !== -1) {
	timer = setInterval(videoPage, 1000)
}

// 监测页面变换
if (window.onurlchange === null) {
	window.addEventListener('urlchange', info => {
		console.log('urlchange', info)
		if (window.location.pathname.indexOf('/video/') !== -1 && !$('.one-tap')[0]) {
			timer = setInterval(videoPage, 1000)
		}
	})
}
