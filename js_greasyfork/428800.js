// ==UserScript==
// @name         Trình tải video
// @description  Tải video.
// @version      0.9.45.fork
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @connect      googlevideo.com
// @namespace https://greasyfork.org/en/users/774487-kids-pops
// @downloadURL https://update.greasyfork.org/scripts/428800/Tr%C3%ACnh%20t%E1%BA%A3i%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/428800/Tr%C3%ACnh%20t%E1%BA%A3i%20video.meta.js
// ==/UserScript==
 
;(function () {
	'use strict'
	const DEBUG = true
	const createLogger = (console, tag) =>
		Object.keys(console)
			.map(k => [k, (...args) => (DEBUG ? console[k](tag + ': ' + args[0], ...args.slice(1)) : void 0)])
			.reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
	const logger = createLogger(console, 'YTDL')
	const sleep = ms => new Promise(res => setTimeout(res, ms))
 
	const strings = {
		togglelinks: 'Show/Hide Links',
		stream: 'Stream',
		adaptive: 'Adaptive',
        dllow: 'Custom low-resolution mp4',
		dlmp4: 'High-resolution mp4',
		get_video_failed: 'Failed to get video infomation for unknown reason, refresh the page may work.',
		live_stream_disabled_message: 'Local YouTube Downloader is not available for live stream'
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
			const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(data)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(escapeRegExp(fnname) + '=function\\((.+?)\\){(.+?)}').exec(data)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp('var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};').exec(data)
			const helper = helperresult[0]
			logger.log(`parsedecsig result: %s=>{%s\n%s}`, argname, helper, fnbody)
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info('If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.')
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
			adaptive = playerResponse.streamingData.adaptiveFormats.map(x => Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher)))
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
 

 
	const ffWorker = FFmpeg.createWorker({
		logger: DEBUG ? m => logger.log(m.message) : () => {}
	})
	let ffWorkerLoaded = false
	const mergeVideo = async (video, audio) => {
		if (!ffWorkerLoaded) await ffWorker.load()
		await ffWorker.write('video.mp4', video)
		await ffWorker.write('audio.mp4', audio)
		await ffWorker.run('-i video.mp4 -i audio.mp4 -c copy output.mp4', { input: ['video.mp4', 'audio.mp4'], output: 'output.mp4' })
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
	
	const template = `
<div class="box" :class="{'dark':dark}">
  <template v-if="!isLiveStream">
    <div @click="hide=!hide" class="box-toggle div-a t-center fs-14px c-pointer lh-20" v-text="strings.togglelinks"></div>
    <div :class="{'hide':hide}">
      <div class="d-flex">
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.stream"></div>
          <a class="ytdl-link-btn fs-14px t-center c-pointer" @click="dllow" v-text="strings.dllow"></a>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="formatStreamText(vid)"></a>
          <a class="ytdl-link-btn fs-14px t-center c-pointer" @click="dlmp4" v-text="strings.dlmp4"></a>
        </div>
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.adaptive"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in adaptive" :href="vid.url" :title="vid.type" v-text="formatAdaptiveText(vid)"></a>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="t-center fs-14px lh-20" v-text="strings.live_stream_disabled_message"></div>
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
				dark: true
			}
		},
		computed: {
			strings() {return strings}
		},
		methods: {
			dllow() {
				let vCode = parseInt(prompt("Video code",160))
				let aCode = parseInt(prompt("Audio code",140))
				openDownloadModel(this.adaptive, this.details.title, vCode + '|' + aCode)
			},
			dlmp4() {
				openDownloadModel(this.adaptive, this.details.title, 'high')
			},
			formatStreamText(vid) {
				let str = `${vid.itag} - ${vid.mimeType} - ${vid.width}x${vid.height}@${vid.fps}fps - ${(vid.approxDurationMs/1000*vid.bitrate/8/1024/1024).toFixed(2)}MB`
				return str
			},
			formatAdaptiveText(vid) {
				let str = `${vid.itag} - ${vid.mimeType} - ${vid.width}x${vid.height}@${vid.fps}fps - ${(vid.contentLength/1024/1024).toFixed(2)}MB`
				if (vid.mimeType.includes('audio')) {
					str = `${vid.itag} - ${vid.mimeType} - ${(vid.contentLength/1024/1024).toFixed(2)}MB`
				}
				return str
			}
		},
		template
	})
 
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
			const basejs = (typeof ytplayer !== 'undefined' && 'config' in ytplayer && ytplayer.config.assets
				? 'https://' + location.host + ytplayer.config.assets.js : 'web_player_context_config' in ytplayer
				? 'https://' + location.host + ytplayer.web_player_context_config.jsUrl : null)
				|| $('script[src$="base.js"]').src
			const decsig = await xf.get(basejs).text(parseDecsig)
			const id = parseQuery(location.search).v
			const data = parseResponse(id, playerResponse, decsig)
			logger.log('video loaded: %s', id)
			app.isLiveStream = data.playerResponse.playabilityStatus.liveStreamability != null
			app.id = id
			app.stream = data.stream
			app.adaptive = data.adaptive
			app.details = data.details
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
	setInterval(() => {
		const el =
			$('#info-contents') ||
			$('#watch-header') ||
			$('.page-container:not([hidden]) ytm-item-section-renderer>lazy-list')
		if (el && !el.contains(shadowHost)) {
			el.appendChild(shadowHost)
		}
	}, 100)
 
	// init
	unsafeWindow.addEventListener('load', () => {
		const firstResp = unsafeWindow?.ytplayer?.config?.args?.raw_player_response
		if (firstResp) {
			load(firstResp)
		}
	})
 
	const css = `

.ytdl-link-btn{
	display: block;
	border: 1px solid !important;
	border-radius: 3px;
	text-decoration: none !important;
	outline: 0;
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