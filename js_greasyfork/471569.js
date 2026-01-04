// ==UserScript==
// @name        就不登录-csdn
// @namespace   github.com/ojer
// @match       http*://blog.csdn.net/*/article/details/**
// @noframes
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @author      ojer
// @version     1.2.4
// @description 复制网页内容
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471569/%E5%B0%B1%E4%B8%8D%E7%99%BB%E5%BD%95-csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/471569/%E5%B0%B1%E4%B8%8D%E7%99%BB%E5%BD%95-csdn.meta.js
// ==/UserScript==
const btnText = 'Copy'
let editorType = void 0
const copyBtn = 'hljs-button'
const codeElement = document.querySelectorAll('pre code')

const setStyle = () => {
	GM_addStyle(`
		code, pre {user-select: auto !important;}
		#article_content{height: auto !important;}
		.hide-article-box.hide-article-pos.text-center{display: none !important;}
	`)
}

const execCopy = (e, text) => {
	const target = e.target || e.srcElement
	if (target.className.indexOf(copyBtn) > -1) {
		e.preventDefault()
		GM_setClipboard(text.replace(/[\u00A0]/gi, ' '))
		target.dataset.title = '复制成功'
		setTimeout(function () {
			target.dataset.title = btnText
		}, 3e3)
	}
}

const copyCode = (e) => {
	execCopy(e, e.currentTarget.innerText)
}

const copyParentNodeCode = (e) => {
	execCopy(e, e.currentTarget.parentNode.innerText)
}

const addCopyBtnByType = () => {
	try {
		let e = undefined
		if ('ckeditor' == editorType) {
			e = document.querySelectorAll('code.hljs')
			for (var t in e) {
				if (e.hasOwnProperty(t)) {
					addCopyButton(e[t].parentNode)
				}
			}
		} else {
			e = codeElement
			for (var t in e) {
				if (e.hasOwnProperty(t)) {
					addCopyButton(e[t])
				}
			}
		}
	} catch (n) {
		console.error('CopyButton error: ', n)
	}
}

const addCopyButton = (e) => {
	if (e === null || 'object' !== typeof e) {
		return
	}
	const signin = '.signin(event)'
	let o = 'hljs'
	let clickFun = '.copyCode(event)'
	if ('mdeditor' === editorType) {
		o = 'mdcp'
	}
	clickFun = o + clickFun
	// clickFun = o + signin
	e.innerHTML = e.innerHTML + `<div class="hljs-button {2}" data-title="${btnText}" data-report-click='{"spm": "1001.2101.3001.4334"}'></div>`
	if ('hljs' === o) {
		e.querySelector('.hljs-button').setAttribute('onclick', clickFun)
	} else {
		e.setAttribute('onclick', clickFun)
		e.style.position = 'unset'
	}
}

const initCopy = () => {
	document.querySelectorAll('.hljs-button').forEach((e) => {
		e.remove()
	})

	let i = 0
	const intervalId = setInterval(() => {
		if (this.unsafeWindow.csdn && this.unsafeWindow.csdn.loginBox && this.unsafeWindow.csdn.loginBox.show) {
			this.unsafeWindow.csdn.loginBox.show = () => {
				return 0
			}
			clearInterval(intervalId)
		}

		if (i++ > 100) {
			clearInterval(intervalId)
		}
	}, 2e3)

	const onCopy = (t) => {
		if (window.getSelection().getRangeAt(0).toString().length > 0) {
			t.preventDefault()
			var e = window
				.getSelection()
				.getRangeAt(0)
				.toString()
				.replace(/[\u00A0]/gi, ' ')
			GM_setClipboard(e)
		}
	}

	document.querySelector('#content_views').addEventListener('copy', onCopy)
	document.querySelector('#content_views').addEventListener('keydown', onCopy)
	addCopyBtnByType()
}

const init = () => {
	const winw = this.unsafeWindow
	if (document.querySelectorAll('div.htmledit_views').length > 0) {
		editorType = 'ckeditor'
		Object.assign(winw.hljs, {
			initCopyButtonOnLoad: initCopy,
			addCopyButton: addCopyButton,
			copyCode: copyParentNodeCode,
			signin: copyParentNodeCode
		})
	} else {
		if (codeElement.length > 0) {
			editorType = 'mdeditor'
			if (!winw.mdcp) {
				winw.mdcp = {}
			}
			Object.assign(winw.mdcp, {
				copyCode: copyCode,
				signin: copyCode
			})
		}
	}
	initCopy()
	setStyle()
}

const intervalId = setInterval(() => {
	if ('complete' === document.readyState) {
		setTimeout(() => {
			init()
		}, 5e2)
		clearInterval(intervalId)
	}
}, 1e3)
