// ==UserScript==
// @name        91wii自动回答
// @description 自动回答运算
// @version     1.0.1
// @author      billypon
// @namespace   http://www.canaansky.com/
// @match       https://www.91wii.com/*
// @match       https://www.91tvg.com/*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/431748/91wii%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/431748/91wii%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

const submit = document.querySelector('[name="secqsubmit"]')
if (submit) {
	const container = submit.parentElement
	const answer = container.querySelector('[name="answer"]')
	const question = container.querySelector('b')
	if (answer && question) {
		answer.value = eval(`(${ question.textContent.replace(' = ?', '') })`)
		submit.click()
	}
}
