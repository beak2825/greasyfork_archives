// ==UserScript==
// @name         Youtube Pro | v5
// @version      v5
// @description  Youtube Pro is a script which allows you to return dislikes ,download youtube videos and block anoying ads powered by Return YouTube Dislike,local youtube video downloader and Youtube Pro
// @namespace OrangeMonkey Scripts
// @author       devsoniexpert72,maple3142 and Anarios & JRWR
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_addStyle
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @grant        GM.xmlHttpRequest
// @connect      youtube.com
// @grant        GM_addStyle
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @connect      googlevideo.com
// @license      MIT
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483626/Youtube%20Pro%20%7C%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/483626/Youtube%20Pro%20%7C%20v5.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	if (
		window.top === window.self &&
		GM_info.scriptHandler === 'Tampermonkey' &&
		GM_info.version === '4.18.0' &&
		GM_getValue('tampermonkey_breaks_should_alert', true)
	) {
		alert(
			`Tampermonkey recently release a breaking change / bug in version 4.18.0 that breaks this script, which is fixed in newer version of Tampermonkey right now. You should update it or switch to Violentmonkey instead.`
		)
		GM_setValue('tampermonkey_breaks_should_alert', false)
	}
	const DEBUG = true
	const createLogger = (console, tag) =>
		Object.keys(console)
			.map(k => [k, (...args) => (DEBUG ? console[k](tag + ': ' + args[0], ...args.slice(1)) : void 0)])
			.reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
	const logger = createLogger(console, 'YTDL')
	const sleep = ms => new Promise(res => setTimeout(res, ms))

	const LANG_FALLBACK = 'en'
	const LOCALE = {
		en: {
			togglelinks: 'Show/Hide Links',
			stream: 'Stream',
			adaptive: ' ',
			videoid: 'Video ID: ',
			inbrowser_adaptive_merger: ' ',
			dlmp4: ' ',
			get_video_failed: 'Failed to get video infomation for unknown reason, refresh the page may work.',
			live_stream_disabled_message: 'Local YouTube Downloader is not available for live stream'
		},
		'zh-tw': {
			togglelinks: '顯示 / 隱藏連結',
			stream: '串流 Stream',
			adaptive: '自適應 Adaptive (沒有聲音)',
			videoid: '影片 ID: ',
			inbrowser_adaptive_merger: '線上自適應影片及音訊合成工具 (FFmpeg)',
			dlmp4: '一鍵下載高畫質 mp4',
			get_video_failed: '無法取得影片資訊，重新整理頁面可能會有效果。',
			live_stream_disabled_message: '因為是直播的緣故，本地 YouTube 下載器的功能是停用的。'
		},
		'zh-hk': {
			togglelinks: '顯示／隱藏連結',
			stream: '串流 Stream',
			adaptive: '自動適應 Adaptive (沒有聲音)',
			videoid: '影片 ID: ',
			inbrowser_adaptive_merger: '網上自動適應影片及音訊合成工具 (FFmpeg)',
			dlmp4: '一 click 下載高畫質 mp4',
			get_video_failed: '無法取得影片資訊，重新整理頁面可能會有效果。',
			live_stream_disabled_message: '本地 YouTube 下載器無法用於直播。'
		},
		zh: {
			togglelinks: '显示／隐藏链接',
			stream: '串流 Stream',
			adaptive: '自适应 Adaptive (没有声音)',
			videoid: '视频 ID: ',
			inbrowser_adaptive_merger: '线上自适应视频及音频合成工具 (FFmpeg)',
			dlmp4: '一键下载高画质 mp4',
			get_video_failed: '无法取得影片资讯，重新整理页面可能会有效果。',
			live_stream_disabled_message: '因为是直播，本地 YouTube 下载器的功能已被禁用。'
		},
		ja: {
			togglelinks: 'リンク表示・非表示',
			stream: 'ストリーミング',
			adaptive: 'アダプティブ（音無し）',
			videoid: 'ビデオ ID: ',
			inbrowser_adaptive_merger: 'ビデオとオーディオを合併するオンラインツール (FFmpeg)',
			dlmp4: 'ワンクリックで高解像度の mp4 をダウンロード',
			live_stream_disabled_message: 'ライブ配信のため、ローカル YouTube ダウンローダーは無効になっています。'
		},
		kr: {
			togglelinks: '링크 보이기 · 숨기기',
			stream: '스트리밍',
			adaptive: '적응 (어댑티브)',
			videoid: '비디오 ID: ',
			inbrowser_adaptive_merger: '비디오와 오디오를 합병하는 온라인 도구 (FFmpeg)',
			dlmp4: '한 번의 클릭으로 고해상도 mp4 다운로드'
		},
		es: {
			togglelinks: 'Mostrar/Ocultar Links',
			stream: 'Stream',
			adaptive: 'Adaptable',
			videoid: 'Id del Video: ',
			inbrowser_adaptive_merger: 'Acoplar Audio a Video (FFmpeg)'
		},
		he: {
			togglelinks: 'הצג/הסתר קישורים',
			stream: 'סטרים',
			adaptive: 'אדפטיבי',
			videoid: 'מזהה סרטון: '
		},
		fr: {
			togglelinks: 'Afficher/Masquer les liens',
			stream: 'Stream',
			adaptive: 'Adaptative',
			videoid: 'ID vidéo: ',
			inbrowser_adaptive_merger: 'Fusionner vidéos et audios adaptatifs dans le navigateur (FFmpeg)',
			dlmp4: 'Téléchargez la plus haute résolution mp4 en un clic'
		},
		pl: {
			togglelinks: 'Pokaż/Ukryj Linki',
			stream: 'Stream',
			adaptive: 'Adaptywne',
			videoid: 'ID filmu: ',
			inbrowser_adaptive_merger: 'Połącz audio i wideo adaptywne w przeglądarce (FFmpeg)',
			dlmp4: 'Pobierz .mp4 w najwyższej jakości'
		},
		hi: {
			togglelinks: 'लिंक टॉगल करें',
			stream: 'स्ट्रीमिंग (Stream)',
			adaptive: 'अनुकूली (Adaptive)',
			videoid: 'वीडियो आईडी: {{id}}'
		},
		ru: {
			togglelinks: 'Показать/Cкрыть ссылки',
			stream: 'Поток',
			adaptive: 'Адаптивный',
			videoid: 'Идентификатор видео: ',
			inbrowser_adaptive_merger: 'Адаптивное слияние видео и аудио онлайн (FFmpeg)',
			dlmp4: 'Скачать mp4 в высоком разрешении в один клик',
			get_video_failed:
				'Не удалось получить информацию о видео по неизвестной причине, попробуйте обновить страницу.',
			live_stream_disabled_message: 'Локальный загрузчик YouTube недоступен для прямой трансляции'
		},
		ua: {
			togglelinks: 'Показати/Приховати посилання',
			stream: 'Потік',
			adaptive: 'Адаптивний',
			videoid: 'Ідентифікатор відео: ',
			inbrowser_adaptive_merger: 'Адаптивне злиття відео і аудіо онлайн (FFmpeg)',
			dlmp4: 'Завантажити mp4 у високій роздільній здатності в один клік',
			get_video_failed:
				'Не вдалося отримати інформацію про відео з невідомої причини, спробуйте оновити сторінку.',
			live_stream_disabled_message: 'Локальний завантажувач YouTube недоступний для прямої трансляції'
		},
		cs: {
			togglelinks: 'Zobrazit/Skrýt odkazy',
			stream: 'Stream',
			adaptive: 'Adaptivní',
			videoid: 'ID videa: ',
			inbrowser_adaptive_merger: 'Online nástroj pro sloučení videa a audia (FFmpeg)',
			dlmp4: 'Stáhnout video mp4 jedním kliknutím ve vysokém rozlišení',
			get_video_failed: 'Nepodařilo se nahrát informace o videu. Zkuste obnovit stránku (F5).',
			live_stream_disabled_message: 'Local YouTube Downloader není dostupný pro živé vysílání'
		}
	}
	for (const [lang, data] of Object.entries(LOCALE)) {
		if (lang === LANG_FALLBACK) continue
		for (const key of Object.keys(LOCALE[LANG_FALLBACK])) {
			if (!(key in data)) {
				data[key] = LOCALE[LANG_FALLBACK][key]
			}
		}
	}
	const findLang = l => {
		l = l.replace('-Hant', '') // special case for zh-Hant-TW
		// language resolution logic: zh-tw --(if not exists)--> zh --(if not exists)--> LANG_FALLBACK(en)
		l = l.toLowerCase().replace('_', '-')
		if (l in LOCALE) return l
		else if (l.length > 2) return findLang(l.split('-')[0])
		else return LANG_FALLBACK
	}
	const getLangCode = () => {
		const html = document.querySelector('html')
		if (html) {
			return html.lang
		} else {
			return navigator.language
		}
	}
	const $ = (s, x = document) => x.querySelector(s)
	const $el = (tag, opts) => {
		const el = document.createElement(tag)
		Object.assign(el, opts)
		return el
	}
	const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseDecsig = data => {
		try {
			if (data.startsWith('var script')) {
				// they inject the script via script tag
				const obj = {}
				const document = {
					createElement: () => obj,
					head: { appendChild: () => {} }
				}
				eval(data)
				data = obj.innerHTML
			}
			const fnnameresult = /=([a-zA-Z0-9\$_]+?)\(decodeURIComponent/.exec(data)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(escapeRegExp(fnname) + '=function\\((.+?)\\){((.+)=\\2.+?)}').exec(
				data
			)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;([a-zA-Z0-9$_]+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp('var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};').exec(data)
			const helper = helperresult[0]
			logger.log(`parsedecsig result: %s=>{%s\n%s}`, argname, helper, fnbody)
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info(
				'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
			)
		}
	}
	const parseQuery = s => [...new URLSearchParams(s).entries()].reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
	const parseResponse = (id, playerResponse, decsig) => {
		logger.log(`video %s playerResponse: %o`, id, playerResponse)
		let stream = []
		if (playerResponse.streamingData.formats) {
			stream = playerResponse.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s stream: %o`, id, stream)
			for (const obj of stream) {
				if (obj.s) {
					obj.s = decsig(obj.s)
					obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`
				}
			}
		}

		let adaptive = []
		if (playerResponse.streamingData.adaptiveFormats) {
			adaptive = playerResponse.streamingData.adaptiveFormats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s adaptive: %o`, id, adaptive)
			for (const obj of adaptive) {
				if (obj.s) {
					obj.s = decsig(obj.s)
					obj.url += `&${obj.sp}=${encodeURIComponent(obj.s)}`
				}
			}
		}
		logger.log(`video %s result: %o`, id, { stream, adaptive })
		return { stream, adaptive, details: playerResponse.videoDetails, playerResponse }
	}

	// video downloader
	const xhrDownloadUint8Array = async ({ url, contentLength }, progressCb) => {
		if (typeof contentLength === 'string') contentLength = parseInt(contentLength)
		progressCb({
			loaded: 0,
			total: contentLength,
			speed: 0
		})
		const chunkSize = 65536
		const getBuffer = (start, end) =>
			fetch(url + `&range=${start}-${end ? end - 1 : ''}`).then(r => r.arrayBuffer())
		const data = new Uint8Array(contentLength)
		let downloaded = 0
		const queue = new pQueue.default({ concurrency: 6 })
		const startTime = Date.now()
		const ps = []
		for (let start = 0; start < contentLength; start += chunkSize) {
			const exceeded = start + chunkSize > contentLength
			const curChunkSize = exceeded ? contentLength - start : chunkSize
			const end = exceeded ? null : start + chunkSize
			const p = queue.add(() => {
				console.log('dl start', url, start, end)
				return getBuffer(start, end)
					.then(buf => {
						console.log('dl done', url, start, end)
						downloaded += curChunkSize
						data.set(new Uint8Array(buf), start)
						const ds = (Date.now() - startTime + 1) / 1000
						progressCb({
							loaded: downloaded,
							total: contentLength,
							speed: downloaded / ds
						})
					})
					.catch(err => {
						queue.clear()
						alert('Download error')
					})
			})
			ps.push(p)
		}
		await Promise.all(ps)
		return data
	}

	const ffWorker = FFmpeg.createWorker({
		logger: DEBUG ? m => logger.log(m.message) : () => {}
	})
	let ffWorkerLoaded = false
	const mergeVideo = async (video, audio) => {
		if (!ffWorkerLoaded) await ffWorker.load()
		await ffWorker.write('video.mp4', video)
		await ffWorker.write('audio.mp4', audio)
		await ffWorker.run('-i video.mp4 -i audio.mp4 -c copy output.mp4', {
			input: ['video.mp4', 'audio.mp4'],
			output: 'output.mp4'
		})
		const { data } = await ffWorker.read('output.mp4')
		await ffWorker.remove('output.mp4')
		return data
	}
	const triggerDownload = (url, filename) => {
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		a.remove()
	}
	const dlModalTemplate = `
<div style="width: 100%; height: 100%;">
	<div v-if="merging" style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 24px;">Merging video, please wait...</div>
	<div v-else style="height: 100%; width: 100%; display: flex; flex-direction: column;">
 		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Video</p>
			<progress style="width: 100%;" :value="video.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{video.speed}} kB/s</span>
				<span>{{video.loaded}}/{{video.total}} MB</span>
			</div>
		</div>
		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Audio</p>
			<progress style="width: 100%;" :value="audio.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{audio.speed}} kB/s</span>
				<span>{{audio.loaded}}/{{audio.total}} MB</span>
			</div>
		</div>
	</div>
</div>
`
	function openDownloadModel(adaptive, title) {
		const win = open(
			'',
			'Video Download',
			`toolbar=no,height=${screen.height / 2},width=${screen.width / 2},left=${screenLeft},top=${screenTop}`
		)
		const div = win.document.createElement('div')
		win.document.body.appendChild(div)
		win.document.title = `Downloading "${title}"`
		const dlModalApp = new Vue({
			template: dlModalTemplate,
			data() {
				return {
					video: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					audio: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					merging: false
				}
			},
			methods: {
				async start(adaptive, title) {
					win.onbeforeunload = () => true
					// YouTube's default order is descending by video quality
					const videoObj = adaptive
						.filter(x => x.mimeType.includes('video/mp4') || x.mimeType.includes('video/webm'))
						.map(v => {
							const [_, quality, fps] = /(\d+)p(\d*)/.exec(v.qualityLabel)
							v.qualityNum = parseInt(quality)
							v.fps = fps ? parseInt(fps) : 30
							return v
						})
						.sort((a, b) => {
							if (a.qualityNum === b.qualityNum) return b.fps - a.fps // ex: 30-60=-30, then a will be put before b
							return b.qualityNum - a.qualityNum
						})[0]
					const audioObj = adaptive.find(x => x.mimeType.includes('audio/mp4'))
					const vPromise = xhrDownloadUint8Array(videoObj, e => {
						this.video.progress = (e.loaded / e.total) * 100
						this.video.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.video.total = (e.total / 1024 / 1024).toFixed(2)
						this.video.speed = (e.speed / 1024).toFixed(2)
					})
					const aPromise = xhrDownloadUint8Array(audioObj, e => {
						this.audio.progress = (e.loaded / e.total) * 100
						this.audio.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.audio.total = (e.total / 1024 / 1024).toFixed(2)
						this.audio.speed = (e.speed / 1024).toFixed(2)
					})
					const [varr, aarr] = await Promise.all([vPromise, aPromise])
					this.merging = true
					win.onunload = () => {
						// trigger download when user close it
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
					}
					const result = await Promise.race([mergeVideo(varr, aarr), sleep(1000 * 25).then(() => null)])
					if (!result) {
						alert('An error has occurred when merging video')
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
						return this.close()
					}
					this.merging = false
					const url = URL.createObjectURL(new Blob([result]))
					triggerDownload(url, title + '.mp4')
					win.onbeforeunload = null
					win.onunload = null
					win.close()
				}
			}
		}).$mount(div)
		dlModalApp.start(adaptive, title)
	}

	const template = `
<div class="box" :class="{'dark':dark}">
  <template v-if="!isLiveStream">
    <div v-if="adaptive.length" class="of-h t-center c-pointer lh-20">
      <a class="fs-14px" @click="dlmp4" v-text="strings.dlmp4"></a>
    </div>
    <div @click="hide=!hide" class="box-toggle div-a t-center fs-14px c-pointer lh-20" v-text="strings.togglelinks"></div>
    <div :class="{'hide':hide}">
      <div class="t-center fs-14px" v-text="strings.videoid+id"></div>
      <div class="d-flex">
        <div class="CLASS2 ">
          <div class="t-center fs-14px" v-text="strings.stream"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="formatStreamText(vid)"></a>
        </div>
        <div class="CLASS1">
  </template>
</div>
`.slice(1)
	const app = new Vue({
		data() {
			return {
				hide: true,
				id: '',
				isLiveStream: false,
				stream: [],
				adaptive: [],
				details: null,
				dark: false,
				lang: findLang(getLangCode())
			}
		},
		computed: {
			strings() {
				return LOCALE[this.lang.toLowerCase()]
			}
		},
		methods: {
			dlmp4() {
				openDownloadModel(this.adaptive, this.details.title)
			},
			formatStreamText(vid) {
				return [vid.qualityLabel, vid.quality].filter(x => x).join(': ')
			},
			formatAdaptiveText(vid) {
				let str = [vid.qualityLabel, vid.mimeType].filter(x => x).join(': ')
				if (vid.mimeType.includes('audio')) {
					str += ` ${Math.round(vid.bitrate / 1000)}kbps`
				}
				return str
			}
		},
		template
	})
	logger.log(`default language: %s`, app.lang)

	// attach element
	const shadowHost = $el('div')
	const shadow = shadowHost.attachShadow ? shadowHost.attachShadow({ mode: 'closed' }) : shadowHost // no shadow dom
	logger.log('shadowHost: %o', shadowHost)
	const container = $el('div')
	shadow.appendChild(container)
	app.$mount(container)

	if (DEBUG && typeof unsafeWindow !== 'undefined') {
		// expose some functions for debugging
		unsafeWindow.$app = app
		unsafeWindow.parseQuery = parseQuery
		unsafeWindow.parseDecsig = parseDecsig
		unsafeWindow.parseResponse = parseResponse
	}
	const load = async playerResponse => {
		try {
			const basejs =
				(typeof ytplayer !== 'undefined' && 'config' in ytplayer && ytplayer.config.assets
					? 'https://' + location.host + ytplayer.config.assets.js
					: 'web_player_context_config' in ytplayer
					? 'https://' + location.host + ytplayer.web_player_context_config.jsUrl
					: null) || $('script[src$="base.js"]').src
			const decsig = await xf.get(basejs).text(parseDecsig)
			const id = parseQuery(location.search).v
			const data = parseResponse(id, playerResponse, decsig)
			logger.log('video loaded: %s', id)
			app.isLiveStream = data.playerResponse.playabilityStatus.liveStreamability != null
			app.id = id
			app.stream = data.stream
			app.adaptive = data.adaptive
			app.details = data.details

			const actLang = getLangCode()
			if (actLang != null) {
				const lang = findLang(actLang)
				logger.log('youtube ui lang: %s', actLang)
				logger.log('ytdl lang:', lang)
				app.lang = lang
			}
		} catch (err) {
			alert(app.strings.get_video_failed)
			logger.error('load', err)
		}
	}

	// hook fetch response
	const ff = fetch
	unsafeWindow.fetch = (...args) => {
		if (args[0] instanceof Request) {
			return ff(...args).then(resp => {
				if (resp.url.includes('player')) {
					resp.clone().json().then(load)
				}
				return resp
			})
		}
		return ff(...args)
	}

	// attach element
	const it = setInterval(() => {
		const el =
			$('ytd-watch-metadata') ||
			$('#info-contents') ||
			$('#watch-header') ||
			$('.page-container:not([hidden]) ytm-item-section-renderer>lazy-list')
		if (el && !el.contains(shadowHost)) {
			el.appendChild(shadowHost)
			clearInterval(it)
		}
	}, 100)

	// init
	unsafeWindow.addEventListener('load', () => {
		const firstResp = unsafeWindow?.ytplayer?.config?.args?.raw_player_response
		if (firstResp) {
			load(firstResp)
		}
	})

	// listen to dark mode toggle
	const $html = $('html')
	new MutationObserver(() => {
		app.dark = $html.getAttribute('dark') !== null
	}).observe($html, { attributes: true })
	app.dark = $html.getAttribute('dark') !== null

	const css = `
.hide{
	display: none;
}
.t-center{
	text-align: center;
}
.d-flex{
	display: flex;
}
.f-1{
	flex: 1;
}
.fs-14px{
	font-size: 14px;
}
.of-h{
	overflow: hidden;
}
.box{
  padding-top: .5em;
  padding-bottom: .5em;
	border-bottom: 1px solid var(--yt-border-color);
	font-family: Arial;
}
.box-toggle{
	margin: 3px;
	user-select: none;
	-moz-user-select: -moz-none;
}
.ytdl-link-btn{
	display: block;
	border: 1px solid !important;
	border-radius: 3px;
	text-decoration: none !important;
	outline: 0;
	text-align: center;
	padding: 2px;
	margin: 5px;
	color: black;
}
a, .div-a{
	text-decoration: none;
	color: var(--yt-button-color, inherit);
}
a:hover, .div-a:hover{
	color: var(--yt-spec-call-to-action, blue);
}
.box.dark{
	color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn{
	color: var(--yt-endpoint-color, var(--yt-spec-text-primary));
}
.box.dark .ytdl-link-btn:hover{
	color: rgba(200, 200, 255, 0.8);
}
.box.dark .box-toggle:hover{
	color: rgba(200, 200, 255, 0.8);
}
.c-pointer{
	cursor: pointer;
}
.lh-20{
	line-height: 20px;
}
`
	shadow.appendChild($el('style', { textContent: css }))
})()


// This function will search for the aria-label "Download" and delete the element.
function checkAndDeleteDownloadElement() {
 const downloadElements = document.querySelectorAll('[aria-label="Download"]');

 if (downloadElements.length > 0) {
    downloadElements.forEach(element => {
      element.parentNode.removeChild(element);
    });
 }
}

// Call the function checkAndDeleteDownloadElement every 1 second (1000 milliseconds).
setInterval(checkAndDeleteDownloadElement, 10);

setInterval(function() {
    var element = document.getElementById("primary-entry");
    if (element) {
        element.parentNode.removeChild(element);
    }
}, 10);

setInterval(function() {
    (function() {
        function t(t) {
            const e = t.querySelector(".ytp-ad-skip-button-modern.ytp-button");
            e && e.click()
        }

        function e(t, e) {
            const n = t.querySelector("video");
            n && e && (n.playbackRate = 16, n.muted = !0)
        }

        function n(n, s) {
            for (const s of n) {
                if ("attributes" === s.type && "class" === s.attributeName) {
                    const t = s.target,
                        n = t.classList.contains("ad-showing") || t.classList.contains("ad-interrupting");
                    e(t, n)
                }
                "childList" === s.type && s.addedNodes.length && t(s.target)
            }
        }! function s() {
            const i = document.querySelector("#movie_player");
            if (i) {
                new MutationObserver(n).observe(i, {
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                });
                const s = i.classList.contains("ad-showing") || i.classList.contains("ad-interrupting");
                e(i, s), t(i)
            } else setTimeout(s, 50)
        }()
    })();
}, 10);

const extConfig = {
  // BEGIN USER OPTIONS
  // You may change the following variables to allowed values listed in the corresponding brackets (* means default). Keep the style and keywords intact.
  showUpdatePopup: false, // [true, false*] Show a popup tab after extension update (See what's new)
  disableVoteSubmission: false, // [true, false*] Disable like/dislike submission (Stops counting your likes and dislikes)
  coloredThumbs: false, // [true, false*] Colorize thumbs (Use custom colors for thumb icons)
  coloredBar: false, // [true, false*] Colorize ratio bar (Use custom colors for ratio bar)
  colorTheme: "classic", // [classic*, accessible, neon] Color theme (red/green, blue/yellow, pink/cyan)
  numberDisplayFormat: "compactShort", // [compactShort*, compactLong, standard] Number format (For non-English locale users, you may be able to improve appearance with a different option. Please file a feature request if your locale is not covered)
  numberDisplayRoundDown: true, // [true*, false] Round down numbers (Show rounded down numbers)
  tooltipPercentageMode: "none", // [none*, dash_like, dash_dislike, both, only_like, only_dislike] Mode of showing percentage in like/dislike bar tooltip.
  numberDisplayReformatLikes: false, // [true, false*] Re-format like numbers (Make likes and dislikes format consistent)
  rateBarEnabled: false // [true, false*] Enables ratio bar under like/dislike buttons
  // END USER OPTIONS
};

const LIKED_STATE = "LIKED_STATE";
const DISLIKED_STATE = "DISLIKED_STATE";
const NEUTRAL_STATE = "NEUTRAL_STATE";
let previousState = 3; //1=LIKED, 2=DISLIKED, 3=NEUTRAL
let likesvalue = 0;
let dislikesvalue = 0;
let preNavigateLikeButton = null;

let isMobile = location.hostname == "m.youtube.com";
let isShorts = () => location.pathname.startsWith("/shorts");
let mobileDislikes = 0;
function cLog(text, subtext = "") {
  subtext = subtext.trim() === "" ? "" : `(${subtext})`;
  console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    // When short (channel) is ignored, the element (like/dislike AND short itself) is
    // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
    !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}

function getButtons() {
  if (isShorts()) {
    let elements = document.querySelectorAll(
      isMobile
        ? "ytm-like-button-renderer"
        : "#like-button > ytd-like-button-renderer"
    );
    for (let element of elements) {
      if (isInViewport(element)) {
        return element;
      }
    }
  }
  if (isMobile) {
    return (
      document.querySelector(".slim-video-action-bar-actions .segmented-buttons") ??
      document.querySelector(".slim-video-action-bar-actions")
    );
  }
  if (document.getElementById("menu-container")?.offsetParent === null) {
    return (
      document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
      document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div")
    );
  } else {
    return document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }
}

function getDislikeButton() {
  if (getButtons().children[0].tagName ===
    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER")
  {
    if (getButtons().children[0].children[1] === undefined) {
      return document.querySelector("#segmented-dislike-button");
    } else {
      return getButtons().children[0].children[1];
    }
  } else {
    if (getButtons().querySelector("segmented-like-dislike-button-view-model")) {
      const dislikeViewModel = getButtons().querySelector("dislike-button-view-model");
      if (!dislikeViewModel) cLog("Dislike button wasn't added to DOM yet...");
      return dislikeViewModel;
    } else {
      return getButtons().children[1];
    }
  }
}

function getLikeButton() {
  return getButtons().children[0].tagName ===
  "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
    ? document.querySelector("#segmented-like-button") !== null ? document.querySelector("#segmented-like-button") : getButtons().children[0].children[0]
    : getButtons().querySelector("like-button-view-model") ?? getButtons().children[0];
}

function getLikeTextContainer() {
  return (
    getLikeButton().querySelector("#text") ??
    getLikeButton().getElementsByTagName("yt-formatted-string")[0] ??
    getLikeButton().querySelector("span[role='text']")
  );
}


function getDislikeTextContainer() {
  const dislikeButton = getDislikeButton();
  let result =
    dislikeButton?.querySelector("#text") ??
    dislikeButton?.getElementsByTagName("yt-formatted-string")[0] ??
    dislikeButton?.querySelector("span[role='text']")
  if (result === null) {
    let textSpan = document.createElement("span");
    textSpan.id = "text";
    textSpan.style.marginLeft = "6px";
    dislikeButton?.querySelector("button").appendChild(textSpan);
    if (dislikeButton) dislikeButton.querySelector("button").style.width = "auto";
    result = textSpan;
  }
  return result;
}

function createObserver(options, callback) {
  const observerWrapper = new Object();
  observerWrapper.options = options;
  observerWrapper.observer = new MutationObserver(callback);
  observerWrapper.observe = function (element) { this.observer.observe(element, this.options); }
  observerWrapper.disconnect = function () { this.observer.disconnect(); }
  return observerWrapper;
}

let shortsObserver = null;

if (isShorts() && !shortsObserver) {
  cLog("Initializing shorts mutation observer");
  shortsObserver = createObserver({
    attributes: true
  }, (mutationList) => {
    mutationList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
        mutation.target.id === "button"
      ) {
        cLog("Short thumb button status changed");
        if (mutation.target.getAttribute("aria-pressed") === "true") {
          mutation.target.style.color =
            mutation.target.parentElement.parentElement.id === "like-button"
              ? getColorFromTheme(true)
              : getColorFromTheme(false);
        } else {
          mutation.target.style.color = "unset";
        }
        return;
      }
      cLog(
        "Unexpected mutation observer event: " + mutation.target + mutation.type
      );
    });
  });
}

function isVideoLiked() {
  if (isMobile) {
    return (
      getLikeButton().querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getLikeButton().classList.contains("style-default-active");
}

function isVideoDisliked() {
  if (isMobile) {
    return (
      getDislikeButton()?.querySelector("button").getAttribute("aria-label") ==
      "true"
    );
  }
  return getDislikeButton()?.classList.contains("style-default-active");
}

function isVideoNotLiked() {
  if (isMobile) {
    return !isVideoLiked();
  }
  return getLikeButton().classList.contains("style-text");
}

function isVideoNotDisliked() {
  if (isMobile) {
    return !isVideoDisliked();
  }
  return getDislikeButton()?.classList.contains("style-text");
}

function checkForUserAvatarButton() {
  if (isMobile) {
    return;
  }
  if (document.querySelector("#avatar-btn")) {
    return true;
  } else {
    return false;
  }
}

function getState() {
  if (isVideoLiked()) {
    return LIKED_STATE;
  }
  if (isVideoDisliked()) {
    return DISLIKED_STATE;
  }
  return NEUTRAL_STATE;
}

function setLikes(likesCount) {
  if (isMobile) {
    getButtons().children[0].querySelector(".button-renderer-text").innerText =
      likesCount;
    return;
  }
  getLikeTextContainer().innerText = likesCount;
}

function setDislikes(dislikesCount) {
  if (isMobile) {
    mobileDislikes = dislikesCount;
    return;
  }
  getDislikeTextContainer()?.removeAttribute('is-empty');
  getDislikeTextContainer().innerText = dislikesCount;
}

function getLikeCountFromButton() {
  try {
    if (isShorts()) {
      //Youtube Shorts don't work with this query. It's not necessary; we can skip it and still see the results.
      //It should be possible to fix this function, but it's not critical to showing the dislike count.
      return false;
    }
    let likeButton = getLikeButton()
    .querySelector("yt-formatted-string#text") ??
    getLikeButton().querySelector("button");

    let likesStr = likeButton.getAttribute("aria-label")
    .replace(/\D/g, "");
    return likesStr.length > 0 ? parseInt(likesStr) : false;
  }
  catch {
    return false;
  }

}

(typeof GM_addStyle != "undefined"
  ? GM_addStyle
  : (styles) => {
      let styleNode = document.createElement("style");
      styleNode.type = "text/css";
      styleNode.innerText = styles;
      document.head.appendChild(styleNode);
    })(`
    #return-youtube-dislike-bar-container {
      background: var(--yt-spec-icon-disabled);
      border-radius: 2px;
    }

    #return-youtube-dislike-bar {
      background: var(--yt-spec-text-primary);
      border-radius: 2px;
      transition: all 0.15s ease-in-out;
    }

    .ryd-tooltip {
      position: absolute;
      display: block;
      height: 2px;
      bottom: -10px;
    }

    .ryd-tooltip-bar-container {
      width: 100%;
      height: 2px;
      position: absolute;
      padding-top: 6px;
      padding-bottom: 12px;
      top: -6px;
    }

    ytd-menu-renderer.ytd-watch-metadata {
      overflow-y: visible !important;
    }
    
    #top-level-buttons-computed {
      position: relative !important;
    }
  `);

function createRateBar(likes, dislikes) {
  if (isMobile || !extConfig.rateBarEnabled) {
    return;
  }
  let rateBar = document.getElementById("return-youtube-dislike-bar-container");

  const widthPx =
    getLikeButton().clientWidth +
    (getDislikeButton()?.clientWidth ?? 52);

  const widthPercent =
    likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;

  var likePercentage = parseFloat(widthPercent.toFixed(1));
  const dislikePercentage = (100 - likePercentage).toLocaleString();
  likePercentage = likePercentage.toLocaleString();

  var tooltipInnerHTML;
  switch (extConfig.tooltipPercentageMode) {
    case "dash_like":
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
      break;
    case "dash_dislike":
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
      break;
    case "both":
      tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
      break;
    case "only_like":
      tooltipInnerHTML = `${likePercentage}%`;
      break;
    case "only_dislike":
      tooltipInnerHTML = `${dislikePercentage}%`;
      break;
    default:
      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
  }

  if (!rateBar && !isMobile) {
    let colorLikeStyle = "";
    let colorDislikeStyle = "";
    if (extConfig.coloredBar) {
      colorLikeStyle = "; background-color: " + getColorFromTheme(true);
      colorDislikeStyle = "; background-color: " + getColorFromTheme(false);
    }

    getButtons().insertAdjacentHTML(
      "beforeend",
      `
        <div class="ryd-tooltip" style="width: ${widthPx}px">
        <div class="ryd-tooltip-bar-container">
           <div
              id="return-youtube-dislike-bar-container"
              style="width: 100%; height: 2px;${colorDislikeStyle}"
              >
              <div
                 id="return-youtube-dislike-bar"
                 style="width: ${widthPercent}%; height: 100%${colorDislikeStyle}"
                 ></div>
           </div>
        </div>
        <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
           <!--css-build:shady-->${tooltipInnerHTML}
        </tp-yt-paper-tooltip>
        </div>
`
    );
    let descriptionAndActionsElement = document.getElementById("top-row");
    descriptionAndActionsElement.style.borderBottom =
      "1px solid var(--yt-spec-10-percent-layer)";
    descriptionAndActionsElement.style.paddingBottom = "10px";
  } else {
    document.querySelector(
      ".ryd-tooltip"
    ).style.width = widthPx + "px";
    document.getElementById("return-youtube-dislike-bar").style.width =
      widthPercent + "%";

    if (extConfig.coloredBar) {
      document.getElementById(
        "return-youtube-dislike-bar-container"
      ).style.backgroundColor = getColorFromTheme(false);
      document.getElementById(
        "return-youtube-dislike-bar"
      ).style.backgroundColor = getColorFromTheme(true);
    }
  }
}

function setState() {
  cLog("Fetching votes...");
  let statsSet = false;

  fetch(
    `https://returnyoutubedislikeapi.com/votes?videoId=${getVideoId()}`
  ).then((response) => {
    response.json().then((json) => {
      if (json && !("traceId" in response) && !statsSet) {
        const { dislikes, likes } = json;
        cLog(`Received count: ${dislikes}`);
        likesvalue = likes;
        dislikesvalue = dislikes;
        setDislikes(numberFormat(dislikes));
        if (extConfig.numberDisplayReformatLikes === true) {
          const nativeLikes = getLikeCountFromButton();
          if (nativeLikes !== false) {
            setLikes(numberFormat(nativeLikes));
          }
        }
        createRateBar(likes, dislikes);
        if (extConfig.coloredThumbs === true) {
          const dislikeButton = getDislikeButton();
          if (isShorts()) {
            // for shorts, leave deactived buttons in default color
            const shortLikeButton = getLikeButton().querySelector(
              "tp-yt-paper-button#button"
            );
            const shortDislikeButton = dislikeButton?.querySelector(
              "tp-yt-paper-button#button"
            );
            if (shortLikeButton.getAttribute("aria-pressed") === "true") {
              shortLikeButton.style.color = getColorFromTheme(true);
            }
            if (shortDislikeButton && 
                shortDislikeButton.getAttribute("aria-pressed") === "true")
            {
              shortDislikeButton.style.color = getColorFromTheme(false);
            }
            shortsObserver.observe(shortLikeButton);
            shortsObserver.observe(shortDislikeButton);
          } else {
            getLikeButton().style.color = getColorFromTheme(true);
            if (dislikeButton) dislikeButton.style.color = getColorFromTheme(false);
          }
        }
      }
    });
  });
}

function updateDOMDislikes() {
  setDislikes(numberFormat(dislikesvalue));
  createRateBar(likesvalue, dislikesvalue);
}

function likeClicked() {
  if (checkForUserAvatarButton() == true) {
    if (previousState == 1) {
      likesvalue--;
      updateDOMDislikes();
      previousState = 3;
    } else if (previousState == 2) {
      likesvalue++;
      dislikesvalue--;
      updateDOMDislikes();
      previousState = 1;
    } else if (previousState == 3) {
      likesvalue++;
      updateDOMDislikes();
      previousState = 1;
    }
    if (extConfig.numberDisplayReformatLikes === true) {
      const nativeLikes = getLikeCountFromButton();
      if (nativeLikes !== false) {
        setLikes(numberFormat(nativeLikes));
      }
    }
  }
}

function dislikeClicked() {
  if (checkForUserAvatarButton() == true) {
    if (previousState == 3) {
      dislikesvalue++;
      updateDOMDislikes();
      previousState = 2;
    } else if (previousState == 2) {
      dislikesvalue--;
      updateDOMDislikes();
      previousState = 3;
    } else if (previousState == 1) {
      likesvalue--;
      dislikesvalue++;
      updateDOMDislikes();
      previousState = 2;
      if (extConfig.numberDisplayReformatLikes === true) {
        const nativeLikes = getLikeCountFromButton();
        if (nativeLikes !== false) {
          setLikes(numberFormat(nativeLikes));
        }
      }
    }
  }
}

function setInitialState() {
  setState();
}

function getVideoId() {
  const urlObject = new URL(window.location.href);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
}

function isVideoLoaded() {
  if (isMobile) {
    return document.getElementById("player").getAttribute("loading") == "false";
  }
  const videoId = getVideoId();

  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null
  );
}

function roundDown(num) {
  if (num < 1000) return num;
  const int = Math.floor(Math.log10(num) - 2);
  const decimal = int + (int % 3 ? 1 : 0);
  const value = Math.floor(num / 10 ** decimal);
  return value * 10 ** decimal;
}

function numberFormat(numberState) {
  let numberDisplay;
  if (extConfig.numberDisplayRoundDown === false) {
    numberDisplay = numberState;
  } else {
    numberDisplay = roundDown(numberState);
  }
  return getNumberFormatter(extConfig.numberDisplayFormat).format(
    numberDisplay
  );
}

function getNumberFormatter(optionSelect) {
  let userLocales;
  if (document.documentElement.lang) {
    userLocales = document.documentElement.lang;
  } else if (navigator.language) {
    userLocales = navigator.language;
  } else {
    try {
      userLocales = new URL(
        Array.from(document.querySelectorAll("head > link[rel='search']"))
          ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
          ?.getAttribute("href")
      )?.searchParams?.get("locale");
    } catch {
      cLog(
        "Cannot find browser locale. Use en as default for number formatting."
      );
      userLocales = "en";
    }
  }

  let formatterNotation;
  let formatterCompactDisplay;
  switch (optionSelect) {
    case "compactLong":
      formatterNotation = "compact";
      formatterCompactDisplay = "long";
      break;
    case "standard":
      formatterNotation = "standard";
      formatterCompactDisplay = "short";
      break;
    case "compactShort":
    default:
      formatterNotation = "compact";
      formatterCompactDisplay = "short";
  }

  const formatter = Intl.NumberFormat(userLocales, {
    notation: formatterNotation,
    compactDisplay: formatterCompactDisplay,
  });
  return formatter;
}

function getColorFromTheme(voteIsLike) {
  let colorString;
  switch (extConfig.colorTheme) {
    case "accessible":
      if (voteIsLike === true) {
        colorString = "dodgerblue";
      } else {
        colorString = "gold";
      }
      break;
    case "neon":
      if (voteIsLike === true) {
        colorString = "aqua";
      } else {
        colorString = "magenta";
      }
      break;
    case "classic":
    default:
      if (voteIsLike === true) {
        colorString = "lime";
      } else {
        colorString = "red";
      }
  }
  return colorString;
}

let smartimationObserver = null;

function setEventListeners(evt) {
  let jsInitChecktimer;

  function checkForJS_Finish() {
    //console.log();
    if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
      const buttons = getButtons();
      const dislikeButton = getDislikeButton();

      if (preNavigateLikeButton !== getLikeButton() && dislikeButton) {
        cLog("Registering button listeners...");
        try {
          getLikeButton().addEventListener("click", likeClicked);
          dislikeButton?.addEventListener("click", dislikeClicked);
          getLikeButton().addEventListener("touchstart", likeClicked);
          dislikeButton?.addEventListener("touchstart", dislikeClicked);
          dislikeButton?.addEventListener("focusin", updateDOMDislikes);
          dislikeButton?.addEventListener("focusout", updateDOMDislikes);
          preNavigateLikeButton = getLikeButton();

          if (!smartimationObserver) {
            smartimationObserver = createObserver({
              attributes: true,
              subtree: true
            }, updateDOMDislikes);
            smartimationObserver.container = null;
          }

          const smartimationContainer = buttons.querySelector('yt-smartimation');
          if (smartimationContainer &&
            smartimationObserver.container != smartimationContainer)
          {
            cLog("Initializing smartimation mutation observer");
            smartimationObserver.disconnect();
            smartimationObserver.observe(smartimationContainer);
            smartimationObserver.container = smartimationContainer;
          }
        } catch {
          return;
        } //Don't spam errors into the console
      }
      if (dislikeButton) {
        setInitialState();
        clearInterval(jsInitChecktimer);
      }
    }
  }

  cLog("Setting up...");
  jsInitChecktimer = setInterval(checkForJS_Finish, 111);
}

(function () {
  "use strict";
  window.addEventListener("yt-navigate-finish", setEventListeners, true);
  setEventListeners();
})();
if (isMobile) {
  let originalPush = history.pushState;
  history.pushState = function (...args) {
    window.returnDislikeButtonlistenersSet = false;
    setEventListeners(args[2]);
    return originalPush.apply(history, args);
  };
  setInterval(() => {
    const dislikeButton = getDislikeButton();
    if(dislikeButton?.querySelector(".button-renderer-text") === null){
      getDislikeTextContainer().innerText = mobileDislikes;
    }
    else{
      if (dislikeButton) dislikeButton.querySelector(".button-renderer-text").innerText =
        mobileDislikes;
    }
  }, 1000);
}

