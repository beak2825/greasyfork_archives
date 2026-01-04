// ==UserScript==
// @name        download chapter manga-park.com
// @namespace   https://manga-park.com/title/*
// @match       https://manga-park.com/title/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     1.1.1
// @author      ssrankedghoul
// @description hijacks js script and saves copies of decrypted scans
// @run-at      document-start
// @inject-into page
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488914/download%20chapter%20manga-parkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/488914/download%20chapter%20manga-parkcom.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	function hijack(jsCode, rules) {
		const newJsCode = document.createElement('script')
		newJsCode.type = 'text/javascript'
		newJsCode.textContent = `/*hijacked*/${jsCode}`
		for (const rule of rules) {
			newJsCode.textContent = jsCode.replace(rule[0], rule[1])
		}
		document.head.appendChild(newJsCode)
	}

	function saveBlob(blobParts, fileType) {
		const blob = new Blob([blobParts], { type: fileType })
		const blobs = JSON.parse(localStorage.getItem('blobs'))
		blobs.push(URL.createObjectURL(blob))
		localStorage.setItem('blobs', JSON.stringify(blobs))
	}

	window.addEventListener('beforescriptexecute', (e) => {
		const src = e.target.src
		if (!src || !src.endsWith('app.js')) {
			return
		}

		unsafeWindow.blobs = [] // somehow without this line globalThis.blobs won't be defined
		globalThis.blobs = []
		localStorage.setItem('blobs', '[]')

		e.preventDefault()
		e.stopPropagation()
		GM_xmlhttpRequest({
			method: 'GET',
			url: src,
			onload: (response) => {
				hijack(response.responseText, [
					[
						',this.url=URL.createObjectURL(new Blob([t],{type:n}))',
						`,((${saveBlob.toString()})(t,n)),
                        this.url=URL.createObjectURL(new Blob([t],{type:n}))`,
					],
				])
			},
		})
	})

	async function saveImagesAsZip() {
		if (!JSON.parse(localStorage.getItem('blobs')).length) {
			return
		}
		const a = document.createElement('a')
		const jsZip = new JSZip()
		const images = []
		const blobs = JSON.parse(localStorage.getItem('blobs'))

		for (const blob of blobs) {
			const response = await fetch(blob)
			const image = await response.blob()
			images.push(image)
		}

		for (let i = 0; i < images.length; i++) {
			jsZip.file(`${i + 1}.jpg`, images[i])
		}

		jsZip.generateAsync({ type: 'blob' }).then((content) => {
			a.href = URL.createObjectURL(content)
			a.download = `mangapark-${window.location.pathname.match(/\d+/)[0]}.zip`
			a.click()
			URL.revokeObjectURL(a.href)
			globalThis.blobs = []
			localStorage.setItem('blobs', '[]')
		})
	}

	window.addEventListener('load', () => {
		let i = 0
		const interval = setInterval(() => {
			i++

			const anchorButton = document.querySelector('.close-viewer')
			if (i > 10) {
				clearInterval(interval)
				return alert('could not find download button')
			}
			if (document.querySelector('#download-button')) {
				return clearInterval(interval)
			}
			if (!anchorButton) {
				return
			}
			clearInterval(interval)

			const downloadButtonContainer = document.createElement('div')
			const downloadButton = document.createElement('div')
			const downloadButtonText = document.createElement('span')

			downloadButtonContainer.className = 'download-container'
			downloadButton.id = 'download-button'
			downloadButtonText.textContent = 'Download ↓'
			downloadButton.onclick = saveImagesAsZip
			document.head.insertAdjacentHTML(
				'beforeend',
				`<style>
            .download-container {
              height: 100px;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 20px;
            }
            #download-button {
              border: 1px solid #663399;
              line-height: 0 !important;
              height: 50%;
              width: 300px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              box-shadow: 0 0 5px #663399;
              box-sizing: border-box;
              border-radius: 5px;
            }
            #download-button:hover {
              background-color: #00ced1;
            }
          </style>`
			)

			downloadButton.appendChild(downloadButtonText)
			downloadButtonContainer.appendChild(downloadButton)
			anchorButton.insertAdjacentElement('afterend', downloadButtonContainer)
		}, 1000)
	})
})()
