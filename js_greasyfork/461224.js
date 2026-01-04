// ==UserScript==
// @name         txt-downloader
// @namespace    https://github.com/LimboDzz/
// @version      1.0.0
// @description  Download books as txt from certain websites
// @author       dzz
// @match        *://*.dmshuba.com/*n/*/*.html
// @match        *://*.yqshuwang.com/*n/*/*.html
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461224/txt-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/461224/txt-downloader.meta.js
// ==/UserScript==


(function () {
	'use strict';
	let downloadButton
	insertStyle()
	attachDownloadButton()



	function insertStyle() {
		const styles = `
			body.processing {
				cursor: progress;
			}
		`
		const styleSheet = document.createElement('style')
		styleSheet.innerText = styles
		document.head.append(styleSheet)
	}

	function attachDownloadButton() {
		//? createButton
		downloadButton = document.createElement('button')
		downloadButton.textContent = 'Download'
		downloadButton.setAttribute('style', `
			position: fixed;
			right: 1em;
			bottom: 1em;
		`)
		downloadButton.addEventListener('click', download)
		document.body.append(downloadButton)
	}

	function download() {
		disableDownload()
		fetchAllPages()
	}

	function fetchAllPages() {
		let url = window.location.href
		//? remove the ending part of url
		//	from https://www.dmshuba.com/2023n/03/91520_23.html
		// 	to https://www.dmshuba.com/2023n/03/91520
		const [fileSpecifier,] = url.split(/(?=(_\d+)?.html)/)
		const filename = document.querySelector('h1').textContent.replace('\/', '_')
		const pageSum = document.querySelectorAll('a[title="Page"] b')[1].textContent
		//? get all page links to fetch
		const pageLinks = []
		for (let i = 1; i <= pageSum; i++) {
			if (i == 1)
				url = `${fileSpecifier}.html`
			else
				url = `${fileSpecifier}_${i}.html`
			pageLinks.push(url)
		}
		Promise
			.all(pageLinks.map(pageLink =>
				fetch(pageLink)
					.then(res => res.arrayBuffer())
					.then(buffer => {
						//?	res.text() default to utf-8
						//	resort to arrayBuffer and then TextDecoder
						const gb2312Decoder = new TextDecoder('gbk')
						const html = gb2312Decoder.decode(buffer)
						//? parse plain text to html for DOM manipulation
						const parser = new DOMParser()
						const doc = parser.parseFromString(html, 'text/html')
						const text = [...doc.querySelectorAll('#text div')]
							.map(div => div.childNodes[0].textContent)
							.join('\n')
						return text
					})
					.catch(err => console.log('Failed to fetch page: ', err))
			))
			.then(textArray => saveFile(textArray, filename))
	}

	function saveFile(textArray, filename) {
		//?	create fileData
		const fileData = new Blob(textArray, { type: 'text/plain' })
		//?	create download link to that file
		const downloadLink = URL.createObjectURL(fileData)
		//?	triger download
		const a = document.createElement('a')
		a.download = filename + '.txt'
		a.href = downloadLink
		a.click()
		a.remove()

		enableDownload()
	}

	function enableDownload() {
		downloadButton.addEventListener('click', download)
		downloadButton.textContent = 'Download'
		document.body.classList.toggle('processing')
	}

	function disableDownload() {
		downloadButton.removeEventListener('click', download)
		downloadButton.textContent = 'Processing...'
		document.body.classList.toggle('processing')
	}
})();
