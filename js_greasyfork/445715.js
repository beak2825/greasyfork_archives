// ==UserScript==
// @name         notion plugin
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  add notion outline view
// @author       fengxxc
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445715/notion%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/445715/notion%20plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
	 * 一、二、三 级标题的className分别为
	 * notion-header-block
	 * notion-sub_header-block
	 * notion-sub_sub_header-block
	 */
	function getOutlineTokens() {
		const headerBlock = document.querySelectorAll('.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block')
		const tokens = []
		for (var i = 0; i < headerBlock.length; i++) {
			const id = headerBlock[i].getAttribute('data-block-id').replaceAll('-', '')
			// const notranslate = headerBlock[i].querySelector('.notranslate')
			const level = headerBlock[i].className.split('sub').length
			const header = headerBlock[i].innerText
			tokens.push({id, level, header})
		}
		return tokens
	}

	function getOutlineHTMLs(outlineTokens) {
		const pathname = window.location.pathname
		return outlineTokens.map(token => (`
			<a href="${pathname}#${token.id}" rel="noopener noreferrer" style="display: block; color: inherit; text-decoration: none;">
				<div class="notion-focusable" role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; width: 100%;">
					<div style="padding: 6px 2px; font-size: 14px; line-height: 1.3; display: flex; align-items: center; margin-left: ${(token.level-1) * 24}px;">
						<div class="notranslate" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background-image: linear-gradient(to right, rgba(55, 53, 47, 0.16) 0%, rgba(55, 53, 47, 0.16) 100%); background-repeat: repeat-x; background-position: 0px 100%; background-size: 100% 1px;">
							${token.header}
						</div>
					</div>
				</div>
			</a>
		`))
	}

	function getOutlineBox(outlineHTMLs) {
		return `
			<div id="outline_view" style="position: fixed; top: 47px; right: 16px; z-index: 2; background-color: #f0f8ffcc; padding: 9px; height: calc(100% - 47px); overflow-y: auto; max-width: 33%;">
				${outlineHTMLs.join('')}
			</div>
		`
	}

	let notionFrame = null
	let existBox = false
	let lastTokenStr = ''
	const initInterval = setInterval(() => {
	    // 内容居左
        document.querySelector('.whenContentEditable > main').style.justifyContent = 'left';
		notionFrame = notionFrame || document.querySelector('.notion-frame')
		if (notionFrame) {
			// init completed
			// clearInterval(initInterval)
			const tokens = getOutlineTokens()
			const tokenStr = JSON.stringify(tokens)
			if (!existBox) {
				notionFrame.insertAdjacentHTML('afterend', getOutlineBox(getOutlineHTMLs(tokens)))
				existBox = true
				lastTokenStr = tokenStr
			} else {
				if (lastTokenStr != tokenStr) {
					document.querySelector('#outline_view').innerHTML = getOutlineHTMLs(tokens).join('')
					lastTokenStr = tokenStr
				}
			}
		}
	}, 1000)

})();