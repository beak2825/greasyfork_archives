// ==UserScript==
// @name         Sankaku Previewer
// @namespace    https://greasyfork.org/ja/scripts/370717-sankaku-previewer
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        https://chan.sankakucomplex.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370717/Sankaku%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/370717/Sankaku%20Previewer.meta.js
// ==/UserScript==

(function() {
	const body = document.getElementsByTagName('body')[0]

	createPreview()
	addEvent()
	body.onmousemove = () => { addEvent() }

	function xpath(path, d){
		if(!d) d = document
		return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
	}

	function xpathList(nodes, path) {
		const xpathObj = xpath(path)
		for (let i = 0; i < xpathObj.snapshotLength; i++){
			nodes.push(xpathObj.snapshotItem(i))
		}
		return nodes
	}

	let timer
	function addEvent() {
		let nodes = []
		nodes = xpathList(nodes, "//div[@class='content']//img[not(@preview)]")
		for(let i = 0; i < nodes.length; i++){
			const imgEle = nodes[i]


			imgEle.setAttribute('preview', '')
			imgEle.setAttribute('flag', '0')
			const tags = imgEle.getAttribute('title')

			if (tags == null || tags.match(/animated/)) {continue}

			imgEle.removeAttribute('title')

			//もっとエレガントに
			imgEle.onmouseover = () => {
				imgEle.setAttribute('flag', '0')
				if (imgEle.getAttribute('preview')) {
					openPreview(imgEle.getAttribute('preview'))
				}
				else if (!imgEle.getAttribute('preview')) {
					const parent = imgEle.parentNode
					const req = new GM_xmlhttpRequest({
						method: "GET",
						url: parent.href,
						responseType: 'text',
						onload: (res) => {
							const raw_xml = res.response
							const parser = new DOMParser()
							const html = parser.parseFromString(raw_xml, "text/html")
							const img = html.getElementById('lowres') || html.getElementById('highres')
							if (imgEle.getAttribute('flag') != 0) return
							const blob_req = new GM_xmlhttpRequest({
								method: "GET",
								url: img.href,
								responseType: 'blob',
								onload: (res) => {
									if (imgEle.getAttribute('flag') != 0) return
									const img_src = window.URL.createObjectURL(res.response)
									imgEle.setAttribute('preview', img_src)
									openPreview(imgEle.getAttribute('preview'))
								}
							})
						}
					})
				}
			}

			imgEle.onmouseout = () => {
				imgEle.setAttribute('flag', '1')
				closePreview()
			}
			imgEle.setAttribute('preview', '')
		}
	}

	function createPreview() {
		const preview = document.createElement('img')
		const content = document.getElementById('content')

		preview.setAttribute('id', 'sankaku-preview')
		preview.height = document.documentElement.clientHeight
		preview.style.pointerEvents = 'none'
		preview.style.zIndex = '99999'
		preview.style.opacity = '0.9'
		preview.style.left = '0px'
		preview.style.top = '0px'
		preview.style.position = 'fixed'
		preview.style.display = 'none'
		content.appendChild(preview)
	}

	function openPreview(src) {
		const preview = document.getElementById('sankaku-preview')

		preview.setAttribute('src', src)
		preview.style.display = 'inline'
	}

	function closePreview() {
		const preview = document.getElementById('sankaku-preview')

		preview.style.display = 'none'
	}
})();