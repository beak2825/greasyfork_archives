// ==UserScript==
// @name         iTubeGo YouTube Downloader
// @namespace    https://itubego.com/
// @version      1.0.1
// @date		 2020-06-04
// @description  Download YouTube videos and audios for free without external service, convert YouTube to all formats.
// @homepage	https://itubego.com/
// @icon		https://keepvid.pro/assets/images/itubego.png
// @author       iTubeGo
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @grant        GM_xmlhttpRequest
// @connect      googlevideo.com
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/402860/iTubeGo%20YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/402860/iTubeGo%20YouTube%20Downloader.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const DEBUG = true
	const RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO = true
	const createLogger = (console, tag) =>
		Object.keys(console)
			.map(k => [
				k,
				(...args) =>
					DEBUG
						? console[k](tag + ': ' + args[0], ...args.slice(1))
						: void 0
			])
			.reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
	const logger = createLogger(console, 'YTDL')

	const LANG_FALLBACK = 'en'
	const LOCALE = {
		en: {
			togglelinks: 'Other formats',
			stream: 'Stream',
			adaptive: 'Adaptive',
			get_video_failed:
				'You seems to have AdBlocking extension installed, which blocks %s.\nPlease add the following rule to the rule set, or it will prevent Local YouTube Downloader from working.\n\nPS: If it refuse to add that rule, you should uninstall it and use "uBlock Origin" instead.\nIf you still don\'t understand what I am saying, just disable or uninstall all your ad blockers...'
		},
		'zh-tw': {
			togglelinks: '顯示 / 隱藏連結',
			stream: '串流 Stream',
			adaptive: '自適應 Adaptive',
			get_video_failed:
				'您看起來有在使用擋廣告的擴充功能，而它將 %s 給阻擋了。\n請將下方的規則加入你的廣告阻擋器中，否則本地 YouTube 下載器無法正常運作。\n\nPS: 如它拒絕加入該規則，請將它移除並改為使用 "uBlock Origin"。\n如果你仍無法理解我在說什麼，那就直接把全部的廣告阻擋器停用或是移除掉...'
		},
		'zh-hk': {
			togglelinks: '顯示 / 隱藏連結',
			stream: '串流 Stream',
			adaptive: '自適應 Adaptive',
			get_video_failed:
				'您睇來有用阻擋廣告嘅擴充功能，而佢阻擋咗 %s。\n請將下面嘅規則加到你嘅廣告阻擋器，否則本地 YouTube 下載器唔能夠正常運作。\n\nPS: 如果佢拒絕加入呢個規則，請將佢移除並改用 "uBlock Origin"。\n如果你仍然唔明我講乜，咁就直接停用或者移除全部廣告阻擋器...'
		},
		zh: {
			togglelinks: '显示 / 隐藏链接',
			stream: '串流 Stream',
			adaptive: '自适应 Adaptive',
			get_video_failed:
				'您看起来有在使用挡广告的扩充功能，而它将 %s 给阻挡了。\n请将下方的规则加入你的广告阻挡器中，否则本地 YouTube 下载器无法正常运作。\n\nPS: 如它拒绝加入该规则，请将它移除并改为使用 "uBlock Origin"。\n如果你仍无法理解我在说什么，那就直接把全部的广告阻挡器停用或是移除掉...'
		},
		kr: {
			togglelinks: '링크 보이기/숨기기',
			stream: '스트리밍',
			adaptive: '조정 가능한',
		},
		es: {
			togglelinks: 'Mostrar/Ocultar Links',
			stream: 'Stream',
			adaptive: 'Adaptable',
		},
		he: {
			togglelinks: 'הצג/הסתר קישורים',
			stream: 'סטרים',
			adaptive: 'אדפטיבי',
		},
		ru: {
			togglelinks: 'Показать/Скрыть ссылки',
			stream: 'Stream',
			adaptive: 'Адаптивная',
			get_video_failed:
				'Похоже у вас установлено расширение AdBlock, которое блокирует %s.\nДобавьте следующее правило в исключение, иначе это помешает работе локального загрузчика YouTube.\n\nЗЫ: Если расширение отказывается добавить это правило, его следует удалить и использовать "uBlock Origin".\nЕсли вы все ещё не понимаете, о чём я говорю, просто отключите или удалите все свои блокировщики рекламы...'
		}
	}
	const findLang = l => {
		// language resolution logic: zh-tw --(if not exists)--> zh --(if not exists)--> LANG_FALLBACK(en)
		l = l.toLowerCase().replace('_', '-')
		if (l in LOCALE) return l
		else if (l.length > 2) return findLang(l.split('-')[0])
		else return LANG_FALLBACK
	}
	const $ = (s, x = document) => x.querySelector(s)
	const $el = (tag, opts) => {
		const el = document.createElement(tag)
		Object.assign(el, opts)
		return el
	}

	const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseDecsig = function a(data){try{if(data.startsWith("var script")){const obj={},document={createElement:()=>obj,head:{appendChild:()=>{}}};eval(data),data=obj.innerHTML}const fnnameresult=/=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(data),fnname=fnnameresult[1],_argnamefnbodyresult=new RegExp(escapeRegExp(fnname)+"=function\\((.+?)\\){(.+?)}").exec(data),[_,argname,fnbody]=_argnamefnbodyresult,helpernameresult=/;(.+?)\..+?\(/.exec(fnbody),helpername=helpernameresult[1],helperresult=new RegExp("var "+escapeRegExp(helpername)+"={[\\s\\S]+?};").exec(data),helper=helperresult[0];return logger.log("parsedecsig result: %s=>{%s\n%s}",argname,helper,fnbody),new Function([argname],helper+"\n"+fnbody)}catch(e){logger.error("parsedecsig error: %o",e),logger.info("script content: %s",data),logger.info('If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.')}}

	const parseQuery = s =>
		[...new URLSearchParams(s).entries()].reduce(
			(acc, [k, v]) => ((acc[k] = v), acc),
			{}
		)
	const getVideo = async function a(e,o){const c=await xf.get(`https://www.youtube.com/get_video_info?video_id=${e}&el=detailpage`).text().catch(e=>null);if(!c)return"Adblock conflict";const t=parseQuery(c),s=JSON.parse(t.player_response);if(logger.log("video %s data: %o",e,t),logger.log("video %s playerResponse: %o",e,s),"fail"===t.status)throw t;function a(e,o,c){return e.split(o).join(c)}let i=[];if(s.streamingData.formats){(i=s.streamingData.formats.map(e=>Object.assign({},e,parseQuery(e.cipher||e.signatureCipher)))).sort((e,o)=>e.qualityLabel>o.qualityLabel?-1:1);for(const e of i){const o=s.videoDetails.title,c=new URL(e.url);c.host="redirector.googlevideo.com",c.search+="&title="+encodeURI(o),e.url=c.href;const t=e.mimeType.split(";");e.format=t[0].split("/")[1].toUpperCase(),codecs=t[1].split("=")[1];const i=t[0].split("/")[0];"video"==i&&(e.vcodec=codecs.split(",")[0],e.acodec="none",codecs.split(",")[1]&&(e.acodec=codecs.split(",")[1])),"audio"==i&&(e.vcodec="none",e.acodec=codecs.split(",")[0]),e.vcodec=a(e.vcodec,'"',""),e.vcodec=a(e.vcodec," ",""),e.vcodec=e.vcodec.split(".")[0],e.acodec=a(e.acodec,'"',""),e.acodec=a(e.acodec," ",""),e.acodec=e.vcodec.split(".")[0]}if(logger.log("video %s stream: %o",e,i),i[0].sp&&i[0].sp.includes("sig"))for(const e of i)e.s=o(e.s),e.url+=`&sig=${e.s}`}let d=[];if(s.streamingData.adaptiveFormats){d=s.streamingData.adaptiveFormats.map(e=>Object.assign({},e,parseQuery(e.cipher||e.signatureCipher)));for(const e of d){const o=s.videoDetails.title,c=new URL(e.url);c.host="redirector.googlevideo.com",c.search+="&title="+encodeURI(o),e.url=c.href;const t=e.mimeType.split(";");e.format=t[0].split("/")[1].toUpperCase(),codecs=t[1].split("=")[1];const i=t[0].split("/")[0];"video"==i&&(e.vcodec=codecs.split(",")[0],e.acodec="none",codecs.split(",")[1]&&(e.acodec=codecs.split(",")[1])),"audio"==i&&(e.vcodec="none",e.acodec=codecs.split(",")[0],e.qualityLabel=parseInt(e.averageBitrate/1e3).toString()+"kbps"),e.vcodec=a(e.vcodec,'"',""),e.vcodec=a(e.vcodec," ",""),e.vcodec=e.vcodec.split(".")[0],e.acodec=a(e.acodec,'"',""),e.acodec=a(e.acodec," ",""),e.acodec=e.acodec.split(".")[0]}if(logger.log("video %s adaptive: %o",e,d),d[0].sp&&d[0].sp.includes("sig"))for(const e of d)e.s=o(e.s),e.url+=`&sig=${e.s}`}return logger.log("video %s result: %o",e,{stream:i,adaptive:d}),{stream:i,adaptive:d,meta:t}}

	const workerMessageHandler = async e => {
		const decsig = await xf.get(e.data.path).text(parseDecsig)
		try {
			const result = await getVideo(e.data.id, decsig)
			self.postMessage(result)
		} catch (e) {
			self.postMessage(e)
		}
	}
	const ytdlWorkerCode = `
importScripts('https://unpkg.com/vue@2.6.10/dist/vue.js')
importScripts('https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js')
const DEBUG=${DEBUG}
const logger=(${createLogger})(console, 'YTDL')
const escapeRegExp=${escapeRegExp}
const parseQuery=${parseQuery}
const parseDecsig=${parseDecsig}
const getVideo=${getVideo}
self.onmessage=${workerMessageHandler}`
	const ytdlWorker = new Worker(
		URL.createObjectURL(new Blob([ytdlWorkerCode]))
	)
	const workerGetVideo = (id, path) => {
		logger.log(`workerGetVideo start: %s %s`, id, path)
		return new Promise((res, rej) => {
			const callback = e => {
				ytdlWorker.removeEventListener('message', callback)
				if (e.data === 'Adblock conflict') {
					return rej(e.data)
				}
				logger.log('workerGetVideo end: %o', e.data)
				res(e.data)
			}
			ytdlWorker.addEventListener('message', callback)
			ytdlWorker.postMessage({ id, path })
		})
	}

	const template = `
<div class="box" :class="{'dark':dark}">
	<div v-if="1" class="of-h t-center lh-20 button-container">
		<a class="button c-pointer" :href="stream[0].url" target="_blank">
			<svg t="1588821961308" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11214" width="24" height="24"><path d="M906.960201 111.639098h-187.989975a37.213033 37.213033 0 0 0-36.250627 36.250626 37.213033 37.213033 0 0 0 36.250627 36.250627h187.989975a46.516291 46.516291 0 0 1 43.949874 48.761905v668.230576a46.516291 46.516291 0 0 1-43.949874 48.761905H117.145664a46.516291 46.516291 0 0 1-43.949875-48.761905V233.223058a46.516291 46.516291 0 0 1 43.949875-48.441103h189.914787a36.571429 36.571429 0 0 0 0-72.822055H117.145664A118.37594 118.37594 0 0 0 0.052932 233.864662v668.230576a119.659148 119.659148 0 0 0 117.092732 121.904762h792.380953a119.659148 119.659148 0 0 0 117.092731-121.904762V233.223058a121.58396 121.58396 0 0 0-119.659147-121.58396z" fill="#ffffff" p-id="11215"></path><path d="M305.135639 481.203008a34.646617 34.646617 0 0 0 0 51.32832l179.969925 179.969925 2.566416 2.566416a2.566416 2.566416 0 0 1 2.566416 2.566416c2.566416 2.566416 5.132832 2.566416 7.378446 5.132832s2.566416 0 5.132832 2.566416 4.81203 2.566416 9.62406 2.566416a16.360902 16.360902 0 0 0 9.62406-2.566416c2.566416 0 2.566416 0 5.132833-2.566416s5.132832-2.566416 7.057644-5.132832a2.566416 2.566416 0 0 0 2.566416-2.566416l2.566416-2.566416 180.290727-179.969925a36.250627 36.250627 0 1 0-51.328321-51.32832l-119.017544 119.338345V36.250627a36.571429 36.571429 0 0 0-72.822055 0v563.007518L357.105564 481.203008a35.929825 35.929825 0 0 0-51.969925 0z" fill="#ffffff" p-id="11216"></path></svg>
			<span v-text="'MP4 (' + stream[0].qualityLabel + ')'"></span>
		</a>
		<a class="button c-pointer" href="https://itubego.com/youtube-downloader/?utm_source=Social&utm_medium=mp4_button&utm_campaign=Extension" target="_blank">
			<svg t="1588821961308" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11214" width="24" height="24"><path d="M906.960201 111.639098h-187.989975a37.213033 37.213033 0 0 0-36.250627 36.250626 37.213033 37.213033 0 0 0 36.250627 36.250627h187.989975a46.516291 46.516291 0 0 1 43.949874 48.761905v668.230576a46.516291 46.516291 0 0 1-43.949874 48.761905H117.145664a46.516291 46.516291 0 0 1-43.949875-48.761905V233.223058a46.516291 46.516291 0 0 1 43.949875-48.441103h189.914787a36.571429 36.571429 0 0 0 0-72.822055H117.145664A118.37594 118.37594 0 0 0 0.052932 233.864662v668.230576a119.659148 119.659148 0 0 0 117.092732 121.904762h792.380953a119.659148 119.659148 0 0 0 117.092731-121.904762V233.223058a121.58396 121.58396 0 0 0-119.659147-121.58396z" fill="#ffffff" p-id="11215"></path><path d="M305.135639 481.203008a34.646617 34.646617 0 0 0 0 51.32832l179.969925 179.969925 2.566416 2.566416a2.566416 2.566416 0 0 1 2.566416 2.566416c2.566416 2.566416 5.132832 2.566416 7.378446 5.132832s2.566416 0 5.132832 2.566416 4.81203 2.566416 9.62406 2.566416a16.360902 16.360902 0 0 0 9.62406-2.566416c2.566416 0 2.566416 0 5.132833-2.566416s5.132832-2.566416 7.057644-5.132832a2.566416 2.566416 0 0 0 2.566416-2.566416l2.566416-2.566416 180.290727-179.969925a36.250627 36.250627 0 1 0-51.328321-51.32832l-119.017544 119.338345V36.250627a36.571429 36.571429 0 0 0-72.822055 0v563.007518L357.105564 481.203008a35.929825 35.929825 0 0 0-51.969925 0z" fill="#ffffff" p-id="11216"></path></svg>
			<span>MP4 (HD)</span>
		</a>
		<a class="button c-pointer" href="https://itubego.com/youtube-to-mp3-downloader/?utm_source=Social&utm_medium=mp3_button&utm_campaign=Extension" target="_blank">
			<svg t="1588821961308" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11214" width="24" height="24"><path d="M906.960201 111.639098h-187.989975a37.213033 37.213033 0 0 0-36.250627 36.250626 37.213033 37.213033 0 0 0 36.250627 36.250627h187.989975a46.516291 46.516291 0 0 1 43.949874 48.761905v668.230576a46.516291 46.516291 0 0 1-43.949874 48.761905H117.145664a46.516291 46.516291 0 0 1-43.949875-48.761905V233.223058a46.516291 46.516291 0 0 1 43.949875-48.441103h189.914787a36.571429 36.571429 0 0 0 0-72.822055H117.145664A118.37594 118.37594 0 0 0 0.052932 233.864662v668.230576a119.659148 119.659148 0 0 0 117.092732 121.904762h792.380953a119.659148 119.659148 0 0 0 117.092731-121.904762V233.223058a121.58396 121.58396 0 0 0-119.659147-121.58396z" fill="#ffffff" p-id="11215"></path><path d="M305.135639 481.203008a34.646617 34.646617 0 0 0 0 51.32832l179.969925 179.969925 2.566416 2.566416a2.566416 2.566416 0 0 1 2.566416 2.566416c2.566416 2.566416 5.132832 2.566416 7.378446 5.132832s2.566416 0 5.132832 2.566416 4.81203 2.566416 9.62406 2.566416a16.360902 16.360902 0 0 0 9.62406-2.566416c2.566416 0 2.566416 0 5.132833-2.566416s5.132832-2.566416 7.057644-5.132832a2.566416 2.566416 0 0 0 2.566416-2.566416l2.566416-2.566416 180.290727-179.969925a36.250627 36.250627 0 1 0-51.328321-51.32832l-119.017544 119.338345V36.250627a36.571429 36.571429 0 0 0-72.822055 0v563.007518L357.105564 481.203008a35.929825 35.929825 0 0 0-51.969925 0z" fill="#ffffff" p-id="11216"></path></svg>
			<span>MP3 (320kbps)</span>
		</a>
	</div>
	<div class="t-center t-hint fs-14px">Note: Right-click the Download button if video not download, choose 'Save link as...' or 'Download link as...' option.</div>
	<div class="box-toggle div-a t-center fs-14px other-formats-btn">
		<span @click="hide=!hide" class="c-pointer">Other formats</span>
		<img src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAAPAA8DAREAAhEBAxEB/8QAbgAAAwEAAAAAAAAAAAAAAAAAAAEDCQEAAgMAAAAAAAAAAAAAAAAAAQMAAgkQAAEFAQACAwEAAAAAAAAAAAYBAgMEBQcREgAiExURAAICAgICAgEFAAAAAAAAAAIDAQQFBhEHEhMAFCIhMXFSI//aAAwDAQACEQMRAD8A3T4vzwO6gLkuXWybd7qodZgNs/Fbq2alLooFnLAhQJ1GsSR9AnqxKs1WaH7TNejPT6Ok+Ya9P6JqHZGt38amox/ZeJaF9aPexYZTGrkYt0g4mfVbGJkksXESfkAyPAsONWuwtqz+mZmndc8F6TkAKobfUJHQus5+vZLniDrlPAsE/wBAmPLy/IR+HS+XhYCd86KYJtXW4B0mzjk2LowyI/bYLN0aLTAXsPZ6qwmG4pnwOTyq+XRqrlk90avsTrbT9I3fAbIgrFno7YG17aGxMy6KftX96oUxwUWawkQf24IOSlkM8ZqG57Fs+s5bCtFKO0cQDa7VzHCZs+s/q2Bif3r2JiDj+D4jx8Zm3EjCEdFDDCDxY72OhlyMoFZMJY0WtfEONV31ZSxRmKCSazBs6sitjsW7LIa0Ef5+HteiOV/Te2VsDrOUwuq4zOW9+yswu7bo1xc2jghkJufTgSIxsNmYE3NFalxKpg4MBkqdi4BmVzdDJZ+7jK+qUOTrV7TZWFrKlBRW+xMxAkpcckClybDLz5GRmY+PqZ7KTn3NSAoASUe4Zh/waPPw61QtZ0OjzTEvUF125Fywtejq627VarrduKeRFmlY10ytYx3wdmbw3Yt513O7Hg8hQ6ZpTWXjKLEmoW4pDFS/0EcipzrC4/1aDCjklATZEBL4NL1gMNrGXxeGylO12TZ9x3bQmLJXkHAfq9oD5GtSS4haiAfxEihcSRR8/9k=" />
	</div>
	<div :class="{'hide':hide}">
		<table class="other-formats-table">
			<tr>
				<th>Format</th>
				<th>Codecs</th>
				<th>Quality</th>
				<th>Download</th>
			</tr>
			<tr>
				<td>MP4</td>
				<td>video=<b>h264</b>, audio=<b>aac</b></td>
				<td>4k (iTubeGo)</td>
				<td style="color:#F59A23"><a href="https://itubego.com/youtube-downloader/?utm_source=Social&utm_medium=4k&utm_campaign=Extension" target="_blank">Install</a></td>
			</tr>
			<tr>
				<td>MP4</td>
				<td>video=<b>h264</b>, audio=<b>aac</b></td>
				<td>1080p (iTubeGo)</td>
				<td style="color:#F59A23"><a href="https://itubego.com/youtube-downloader/?utm_source=Social&utm_medium=1080p&utm_campaign=Extension" target="_blank">Install</a></td>
			</tr>
			<tr>
				<td>MP3</td>
				<td>audio=<b>mp3</b></td>
				<td>320kpbs (Musify)</td>
				<td style="color:#F59A23"><a href="https://itubego.com/youtube-to-mp3-downloader/?utm_source=Social&utm_medium=320kbps&utm_campaign=Extension" target="_blank">Install</a></td>
			</tr>
			<tr v-for="vid in stream">
				<td v-text="vid.format"></td>
				<td v-text="'video=' + vid.vcodec + ', audio=' + vid.acodec"></td>
				<td v-text="vid.qualityLabel"></td>
				<td style="color:#F59A23"><a :href="vid.url" target="_blank">Download</a></td>
			</tr>
			<tr v-for="vid in adaptive">
				<td v-text="vid.format"></td>
				<td v-text="'video=' + vid.vcodec + ', audio=' + vid.acodec"></td>
				<td v-text="vid.qualityLabel"></td>
				<td style="color:#F59A23"><a :href="vid.url" target="_blank">Download</a></td>
			</tr>
		</table>
	</div>
</div>
`.slice(1)
	const app = new Vue({
		data() {
			return {
				hide: true,
				id: '',
				stream: [],
				adaptive: [],
				meta: null,
				dark: false,
				lang: findLang(navigator.language)
			}
		},
		computed: {
			strings() {
				return LOCALE[this.lang.toLowerCase()]
			}
		},
		methods: {
		},
		template
	})
	logger.log(`default language: %s`, app.lang)

	// attach element
	const shadowHost = $el('div')
	const shadow = shadowHost.attachShadow
		? shadowHost.attachShadow({ mode: 'closed' })
		: shadowHost // no shadow dom
	logger.log('shadowHost: %o', shadowHost)
	const container = $el('div')
	shadow.appendChild(container)
	app.$mount(container)

	if (DEBUG && typeof unsafeWindow !== 'undefined') {
		// expose some functions for debugging
		unsafeWindow.$app = app
		unsafeWindow.parseQuery = parseQuery
		unsafeWindow.parseDecsig = parseDecsig
		unsafeWindow.getVideo = getVideo
	}

	const getLangCode = () => {
		if (typeof ytplayer !== 'undefined' && ytplayer.config) {
			return ytplayer.config.args.host_language
		} else if (typeof yt !== 'undefined') {
			return yt.config_.GAPI_LOCALE
		} else {
			return navigator.language
		}
		return null
	}
	const textToHtml = t => {
		// URLs starting with http://, https://
		t = t.replace(
			/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
			'<a href="$1" target="_blank">$1</a>'
		)
		t = t.replace(/\n/g, '<br>')
		return t
	}
	const applyOriginalTitle = meta => {
		const data = eval(`(${meta.player_response})`).videoDetails // not a valid json, so JSON.parse won't work
		if ($('#eow-title')) {
			// legacy youtube
			$('#eow-title').textContent = data.title
			$('#eow-description').innerHTML = textToHtml(data.shortDescription)
		} else if ($('h1.title')) {
			// new youtube (polymer)
			$('h1.title').textContent = data.title
			$('yt-formatted-string.content').innerHTML = textToHtml(
				data.shortDescription
			)
		}
	}
	const load = async id => {
		try {
			const basejs =
				typeof ytplayer !== 'undefined' && ytplayer.config
					? 'https://' + location.host + ytplayer.config.assets.js
					: $('script[src$="base.js"]').src
			const data = await workerGetVideo(id, basejs)
			logger.log('video loaded: %s', id)
			if (RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO) {
				try {
					applyOriginalTitle(data.meta)
				} catch (e) {
					// just make sure the main function will work even if original title applier doesn't work
				}
			}
			app.id = id
			app.stream = data.stream
			app.adaptive = data.adaptive
			app.meta = data.meta

			const actLang = getLangCode()
			if (actLang !== null) {
				const lang = findLang(actLang)
				logger.log('youtube ui lang: %s', actLang)
				logger.log('ytdl lang:', lang)
				app.lang = lang
			}
		} catch (err) {
			if (err === 'Adblock conflict') {
				const str = app.strings.get_video_failed.replace(
					'%s',
					`https://www.youtube.com/get_video_info?video_id=${id}&el=detailpage`
				)
				prompt(
					str,
					'@@||www.youtube.com/get_video_info?*=detailpage$xhr,domain=youtube.com'
				)
			}
			logger.error('load', err)
		}
	}
	let prev = null
	setInterval(() => {
		const el = $('ytd-video-primary-info-renderer>#container')
		if (el && !el.contains(shadowHost)) {
			el.insertBefore(shadowHost, el.childNodes[el.childNodes.length-1])
		}

		if (location.href !== prev) {
			logger.log(`page change: ${prev} -> ${location.href}`)
			prev = location.href
			if (location.pathname === '/watch') {
				shadowHost.style.display = 'block'
				const id = parseQuery(location.search).v
				logger.log('start loading new video: %s', id)
				app.hide = true // fold it
				load(id)
			} else {
				shadowHost.style.display = 'none'
			}
		}
	}, 1000)

	// listen to dark mode toggle
	const $html = $('html')
	new MutationObserver(() => {
		app.dark = $html.getAttribute('dark') === 'true'
	}).observe($html, { attributes: true })
	app.dark = $html.getAttribute('dark') === 'true'

	const css = `
.button-container {
	display: flex;
    justify-content: center;
}
.button-container .button {
	margin: 10px;
    font-size: 15px;
    color: black;
    display: flex;
    align-items: center;
}
.button svg {
	background: #F59A23;
    padding: 6px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    display: inline-block;
}
.button span {
    background: white;
    border: 1px #bdbdbd solid;
    padding: 7px 8px;
    border-left: 0px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: white;
    display: inline-block;
    width: 110px;
}
.other-formats-btn {
	display: flex;
    justify-content: center;
	align-items: center;
}
.other-formats-btn span {
	margin-right: 5px;
    color: #F59A23;
}

.t-hint {
	font-style: italic;
    margin-bottom: 5px;
    color: #666666;
}

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
	border-bottom: 1px solid var(--yt-border-color);
	font-family: Arial;
	padding: 15px;
	margin-bottom: 10px;
}
.box-toggle{
	margin: 3px;
	user-select: none;
	-moz-user-select: -moz-none;
}

.other-formats-table {
	margin: 0px auto;
    margin-top: 15px;
    font-size: 14px;
	width: 90%;
	border-collapse: collapse;
}

td, th {
	border: 1px solid #dddddd;
	text-align: center;
	padding: 8px;
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
.box.dark{
	color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
}
.box.dark .ytdl-link-btn{
	color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
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
