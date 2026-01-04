// ==UserScript==
// @name         NeteaseMusic NormalScroll Replacer
// @namespace    https://github.com/nondanee
// @version      0.4.2
// @description  Replace scrolling for playlist and lyric with native scrolling
// @author       nondanee
// @match        *://music.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410042/NeteaseMusic%20NormalScroll%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/410042/NeteaseMusic%20NormalScroll%20Replacer.meta.js
// ==/UserScript==

(() => {
	if (window.top !== window.self) return

	const className = 'native-scroll'
	document.head.appendChild(document.createElement('style')).innerHTML = `
		.${className} {
			overflow: auto !important;
		}
		.${className}::-webkit-scrollbar {
			width: 0px;
			height: 0px;
		}
		.${className}::-webkit-scrollbar-track,
		.${className}::-webkit-scrollbar-thumb,
		.${className}::-webkit-scrollbar-thumb:hover {
			background-color: transparent;
		}
		.bline {
			cursor: pointer !important;
			z-index: 10 !important;
		}
	`

	const pageTop = (node) => (
		node.getBoundingClientRect().y + window.scrollY
	)

	const action = () => document.querySelectorAll('.bline').forEach(prevBar => {
		if (prevBar.cloned) return
		const bar = prevBar.cloneNode(true)
		bar.cloned = 1
		prevBar.parentNode.replaceChild(bar, prevBar)

		const {
			firstElementChild: thumb,
			previousElementSibling: area,
		} = bar

		if (!area || !thumb) return

		const start = {}

		const onMouseMove = (event) => {
			if (event.preventDefault) event.preventDefault()
			const y = event.pageY - start.pageY + start.offsetY
			const max = bar.clientHeight - thumb.offsetHeight
			const rate = Math.max(0, Math.min(y / max, 1))
			const { scrollHeight, clientHeight } = area
			area.scrollTop = rate * (scrollHeight - clientHeight)
		}

		const onMouseUp = (event) => {
			document.body.style.cursor = ''
			document.removeEventListener('mouseup', onMouseUp)
			document.removeEventListener('mousemove', onMouseMove)
		}

		const onMouseDown = (event) => {
			document.body.style.cursor = 'pointer'

			const { offsetTop, offsetHeight } = thumb
			start.pageY = event.pageY
			start.offsetY = offsetTop
 
			const moveY = event.pageY - pageTop(bar) - (offsetTop + offsetHeight / 2)
			onMouseMove({ pageY: event.pageY + moveY })
			start.offsetY = offsetTop + moveY

			document.addEventListener('mousemove', onMouseMove)
			document.addEventListener('mouseup', onMouseUp)
		}

		const onScroll = () => {
			const {
				scrollTop,
				scrollHeight,
				clientHeight,
			} = area
			const rate = scrollTop / (scrollHeight - clientHeight)
			const max = bar.clientHeight - thumb.offsetHeight
			thumb.style.top = `${rate * max}px`
		}

		area.classList.add(className)
		area.parentNode.addEventListener('mousewheel', _ => _.stopImmediatePropagation(), true)
		area.addEventListener('scroll', onScroll)
		bar.addEventListener('mousedown', onMouseDown)
	})

	try {
		const observer = new MutationObserver(action)
		observer.observe(document.querySelector('.m-playbar'), { childList: true })
	} catch (_) {}
})()
