// ==UserScript==
// @name         openload_video_info
// @version      0.0.1
// @include      http*://*openload.co/embed/*
// @grant        GM_getValue
// @grant        GM_setValue
// @description  resolve video info
// @namespace https://greasyfork.org/users/164996
// @downloadURL https://update.greasyfork.org/scripts/40855/openload_video_info.user.js
// @updateURL https://update.greasyfork.org/scripts/40855/openload_video_info.meta.js
// ==/UserScript==
const waitForAll = (...selectors) => new Promise(resolve => {
	const delay = 500
	let nodes
	const f = () => {
		nodes = selectors.map(i => document.querySelector(i))
		if (Object.values(nodes).every(v => v != null)) {
			resolve(nodes)
		} else {
			setTimeout(f, delay)
		}
	}
	f()
})
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
const copyTextToClipboard = text => {
	if (!navigator.clipboard) {
		// sync
		const textArea = document.createElement("textarea")
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		document.execCommand('copy')
		document.body.removeChild(textArea)
	} else
		// chrome 66 async
		navigator.clipboard.writeText(text)
}
const getFileSize = url => new Promise(resolve => {
	const xhr = new XMLHttpRequest()
	xhr.open("HEAD", url, true)
	xhr.onreadystatechange = function () {
		if (this.readyState == this.DONE) {
			resolve(parseInt(xhr.getResponseHeader("Content-Length")))
		}
	}
	xhr.send()
})
const formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes'
	const k = 1024, dm = decimals || 2, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

!(async () => {
	// style
	const css = `
	:root {
		--ovi-color: LIGHTGRAY;
		--ovi-hover-color: white;
	}
	#ovi{
		width:100%;
		position:fixed;
		top:0;
		text-align:left;
		line-height:2em;
		padding:.5em 1em;
	}
	#ovi-a {
		position: relative;
	}

	#ovi-b {
		display: none;
		width: 100%;
	}

	#ovi-a:hover #ovi-b {
		display: flex;
		box-sizing:border-box;
	}

	#ovi-a:hover #ovi-c {
		display: none;
	}
	#ovi-c{
		white-space:nowrap;
	}
	.ovi-btn:first-child{
		margin-left:0;
	}
	.ovi-btn:last-child{
		margin-right:1em;
	}
	.ovi-btn {
		color: var(--ovi-color);
		cursor: pointer;
		text-decoration: none;
		text-align:center;
		margin: 0 2em;
	}

	.ovi-btn:hover {
		color: var(--ovi-hover-color);
		box-shadow: inset 0 -1px 0 0 var(--ovi-hover-color);
	}

	#ovi-input {
		background:rgba(0,0,0,0);
		color:var(--ovi-color);
		padding: 0;
		margin: 0;
		border: 0;
		font-size: 1em;
		flex: 20;
	}
	#ovi-input:hover{
		color: var(--ovi-hover-color);
	}
	#ovi-input:focus {
		outline: none;
		box-shadow: inset 0 -1px 0 0 var(--ovi-hover-color);
	}
	#ovi-input::selection{
		color: black;
		background: white;
	}
	#ovi-aria2-response{
		white-sapce:nowrap;
		margin-left:3em;
	}
	`
	const style = document.createElement('style')
	style.type = 'text/css'
	style.appendChild(document.createTextNode(css))
	document.head.appendChild(style)
	// url
	const nodes = await waitForAll('video[src]')
	const video = nodes[0]
	const url = video.src
	let rpc = GM_getValue('rpc',`http://localhost:6800/jsonrpc`)
	// node
	const $duration = document.querySelector('div.vjs-duration.vjs-time-control.vjs-control')
	$duration.insertAdjacentHTML('afterend', `
	<div id=ovi>
	<div id=ovi-a><div id=ovi-b>
			<a class='ovi-btn' href='${url}' target='_blank'> open</a>
			<a class='ovi-btn' id=ovi-copy> copy </a>
			<a class='ovi-btn' id=ovi-aria2> aria2</a>
			<input id=ovi-input type='text' spellcheck='false' value='${rpc}'>
		</div><span id=ovi-c>${url}</span></div><span id=ovi-size>...</span><span id=ovi-aria2-response></span></div>`)
	waitForAll('#ovi-copy', '#ovi-aria2','#ovi-aria2-response','#ovi-input').then(([$copy, $aria2,$res,$input]) => {
		$copy.addEventListener('click', () => { copyTextToClipboard(url) })
		$input.addEventListener('keyup', () => {
			GM_setValue('rpc',$input.value)
		})
		$aria2.addEventListener('click', async () => {
			$res.textContent='...'
			const a = $input.value.split('#')
			const opts={}
			a.forEach((i,index) => {
				if (index === 0) return
				let [k,v]=i.split('=')
				opts[k]=v
			})
			const params = encodeURIComponent(btoa(JSON.stringify([[url], opts])))
			const res= await fetch(a[0]+`?id=${Date.now()}&method=aria2.addUri&params=` + params)
			const json = await res.json()
			$res.textContent=JSON.stringify(json)
		})
	})
	// size
	const content_length = await getFileSize(url)
	const size = formatBytes(content_length)
	document.querySelector('#ovi-size').textContent = size
})()
// video.addEventListener('playing', () => {
// 	const duration = video.duration
// 	console.log(duration);
// 	const date = new Date(null)
// 	date.setSeconds(duration)
// 	const result = date.toISOString().substr(11, 8)
// 	console.log(result)
// })
