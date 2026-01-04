// ==UserScript==
// @name 8chan External Sounds
// @namespace lig
// @description Plays audio associated with images on 8chan.
// @author Bakugo + MFG
// @version 1.7.2
// @match *://8chan.cc/*
// @match *://8chan.moe/*
// @match *://8chan.se/*
// @grant GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/533679/8chan%20External%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/533679/8chan%20External%20Sounds.meta.js
// ==/UserScript==

const debug_GM_fetch = false

function parseHeaders(responseHeaders) {
	let head = new Headers()
	let pairs = responseHeaders.trim().split('\n')
	pairs.forEach(function(header) {
		let split = header.trim().split(':')
		let key = split.shift().trim()
		let value = split.join(':').trim()
		try {
			head.append(key, value)
		} catch(e) {
			console.error(e);
		}
	})
	return head
}

function GM_fetch(url, options = {}) {
	return new Promise((res, rej) => {
		const host = new URL(url).hostname;
		options.url = url;
		options.method = options.method || 'GET';
		options.responseType = options.responseType || 'text';
		options.headers = options.headers || {};
		//options.headers.userAgent
		Object.assign(options.headers, {
			accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,audio/mpeg,*/*;q=0.8",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.5",
			"alt-used": host,
			"cache-control": "no-cache",
			connection: "keep-alive",
			host: host,
			pragma: "no-cache",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		})
		options.onload = _res => {
			const parsedHeaders = parseHeaders(_res.responseHeaders);
			if(debug_GM_fetch) {
				console.log('parsedHeaders', parsedHeaders);
				console.log('response', _res);
			}
			const response = new Response(_res.response, {
				status: _res.status,
				statusText: _res.statusText,
				headers: parsedHeaders
			})
			Object.defineProperty(response, "url", { value: url });
			res(response);
		};

		options.onerror = function() {
			setTimeout(function() {
				rej(new TypeError('Network request failed'))
			}, 0)
		}

		options.ontimeout = function() {
			setTimeout(function() {
				rej(new TypeError('Network request timed out'))
			}, 0)
		}

		options.onabort = function() {
			setTimeout(function() {
				rej(new DOMException('Aborted', 'AbortError'))
			}, 0)
		}

		GM_xmlhttpRequest(options);
	});
}

function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	const len = buffer.byteLength;
	let binary = "";
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

async function fetchSound(url) {
	const response = await GM_fetch(url, { responseType: "arraybuffer" })
    const arrayBuffer = await response.arrayBuffer()
    const type = response.headers.get('Content-Type')
	const b64 = arrayBufferToBase64(arrayBuffer)
    
    const src = `data:${type};base64,${b64}`
	return [src, type]
}

(function() {
	let doInit;
	let doParseFile;
	let doParseFiles;
	let doPlayFile;
	let doMakeKey;
	
	let allow;
	let players;
	
	allow = [
		"4cdn.org",
		"catbox.moe",
		"dmca.gripe",
		"lewd.se",
		"pomf.cat",
		"zz.ht"
	];
	
	document.addEventListener(
		"DOMContentLoaded",
		function (event) {
			setTimeout(
				function () {
					doInit();
				},
				(1)
			);
		}
	);
	
	doInit = function () {
		let observer;
		
		if (players) {
			return;
		}
		
		players = {};
		
		doParseFiles(document.body);
		
		observer =
			new MutationObserver(
				function (mutations) {
					mutations.forEach(
						function (mutation) {
							if (mutation.type === "childList") {
								mutation.addedNodes.forEach(
									function (node) {
										if (node.nodeType === Node.ELEMENT_NODE) {
											doParseFiles(node);
											doPlayFile(node);
										}
									}
								);
							}
						}
					);
				}
			);
		
		observer
			.observe(
				document.body,
				{
					childList: true,
					subtree: true
				}
			);
	};
	
	doParseFile = function (file) {
		let fileLink;
		let fileName;
		let key;
		let match;
		let player;
		let link;
		
		if (!file.classList.contains("uploadCell")) {
			return;
		}
		
		fileLink = file.querySelector(".originalNameLink");
		
		if (!fileLink) {
			return;
		}
		
		if (!fileLink.href) {
			return;
		}
		
		fileName = fileLink.textContent;
		
		if (!fileName) {
			return;
		}
		
		fileName = fileName.replace(/\-/, "/");
		
		key = doMakeKey(fileLink.href);
		
		if (!key) {
			return;
		}
		
		if (players[key]) {
			return;
		}
		
		match = fileName.match(/[\[\(\{](?:audio|sound)[ \=\:\|\$](.*?)[\]\)\}]/i);
		
		if (!match) {
			return;
		}
		
		link = match[1];
		
		if (link.includes("%")) {
			try {
				link = decodeURIComponent(link);
			} catch (error) {
				return;
			}
		}
		
		
		if (link.match(/^(https?\:)?\/\//) === null) {
			link = (location.protocol + "//" + link);
		}
		
		try {
			link = new URL(link);
		} catch (error) {
			return;
		}
		
		if (
			allow.some(
				function (item) {
					return (
						link.hostname.toLowerCase() === item ||
						link.hostname.toLowerCase().endsWith("." + item)
					);
				}
			) == false
		) {
			return;
		}

		if(key.endsWith('mp4') || key.endsWith('webm')) {
			const video = file.querySelector('video')
			const imgLink = file.querySelector('.imgLink')
			console.log('binding video soundpost', key, video, imgLink)
			imgLink.addEventListener('click', e => {
				doPlayFile(video)
			})
		}
		
		player = new Audio();
		
		player.fetched = false
		player.crossOrigin = 'anonymous';
		player.preload = "none";
		player.volume = 0.80;
		player.loop = true;
		
		player.src = link.href;
		
		players[key] = player;
	};
	
	doParseFiles = function (target) {
		target.querySelectorAll(".innerPost, .innerOP")
			.forEach(
				function (post) {
					if (post.parentElement.classList.contains("quoteTooltip")) {
						return;
					}
					
					if (!post.querySelector('.uploadCell')) {
						return;
					}
					
					post.querySelectorAll(".uploadCell")
						.forEach(
							function (file) {
								doParseFile(file);
							}
						);
				}
			);
	};
	
	doPlayFile = async function (target) {
		let key;
		let player;
		let interval;

		if (!(
			target.matches('video[controls="true"]') && target.parentElement.parentElement.matches('.uploadCell') ||
			target.matches(".imgExpanded") ||
			target.matches('img') && target.parentElement.matches('body') ||
			target.matches('video') && target.parentElement.matches('body')
		)) {
			return;
		}

		if (!target.src && !target.currentSrc) {
			return;
		}
		
		key = doMakeKey(target.src || target.currentSrc);
		
		if (!key) {
			return;
		}
		
		player = players[key];

		if (!player) {
			return;
		}

		if(target.matches('video[controls="true"]')) {
			console.log('found video soundpost')
		}

		console.log('players', players)

		if(target.matches(`.imgExpanded`)) {
			target.addEventListener('click', e => {
				let parent = target.parentElement
				setTimeout(() => {
					target.remove()
					parent.querySelector('img').removeAttribute('style')
				}, 50)
			})
		}

		if(!player.fetched) {
			if(!player.response)
				player.response = fetchSound(player.src)
			let [src, type] = await player.response
            player = new Audio()
            player.fetched = true
            player.response = true
            player.type = type
            player.src = src
			players[key] = player
		}

		if (!player.paused) {
			if (player.dataset.play == 1) {
				player.dataset.again = 1;
			} else {
				player.pause();
			}
		}
		
		if (player.dataset.play != 1) {
			player.dataset.play = 1;
			player.dataset.again = 0;
			player.dataset.moveTime = 0;
			player.dataset.moveLast = 0;
		}
		
		switch (target.tagName) {
			case "IMG":
				player.loop = true;
				
				if (player.dataset.again != 1) {
					player.currentTime = 0;
					player.play();
				}
				
				break;
			
			case "VIDEO":
				player.loop = false;
				player.currentTime = target.currentTime;
				player.play();
				break;
			
			default:
				return;
		}
		
		if (player.paused) {
			document.dispatchEvent(
				new CustomEvent(
					"CreateNotification",
					{
						bubbles: true,
						detail: {
							type: "warning",
							content: "Your browser blocked autoplay, click anywhere on the page to activate it and try again.",
							lifetime: 5
						}
					}
				)
			);
		}
		
		interval =
			setInterval(
				function () {
					if (document.body.contains(target) && !target.matches('[style$="display: none;"]')) {
						if (target.tagName === "VIDEO") {
							if (target.currentTime != (+player.dataset.moveLast)) {
								player.dataset.moveTime = Date.now();
								player.dataset.moveLast = target.currentTime;
							}
							
							if (player.duration != NaN) {
								if (
									target.paused == true ||
									target.duration == NaN ||
									target.currentTime > player.duration ||
									((Date.now() - (+player.dataset.moveTime)) > 300)
								) {
									if (!player.paused) {
										player.pause();
									}
								} else {
									if (
										player.paused ||
										Math.abs(target.currentTime - player.currentTime) > 0.100
									) {
										player.currentTime = target.currentTime;
									}
									
									if (player.paused) {
										player.play();
									}
								}
							}
						}
					} else {
						clearInterval(interval);
						
						if (player.dataset.again == 1) {
							player.dataset.again = 0;
						} else {
							player.pause();
							player.dataset.play = 0;
						}
					}
				},
				(1000/30)
			);
	};
	
	doMakeKey = function (link) {
		let match;
		match = link.match(/https\:\/\/8chan\.(?:cc|moe|se)\/\.media\/(.+?)\.(.+)$/);
		
		if (match) {
			return (match[1] + "." + match[2]);
		}
		
		return null;
	};
})();
