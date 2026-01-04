// ==UserScript==
// @name         巴哈姆特動漫電玩通解答顯示小工具
// @namespace    https://blog.maple3142.net/
// @version      0.9
// @description  在巴哈姆特哈拉區右側的動漫電玩通顯示答案
// @author       maple3142
// @require      https://unpkg.com/xfetch-js@0.6.0/dist/xfetch.min.js
// @match        https://forum.gamer.com.tw/B.php*
// @downloadURL https://update.greasyfork.org/scripts/39733/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E6%BC%AB%E9%9B%BB%E7%8E%A9%E9%80%9A%E8%A7%A3%E7%AD%94%E9%A1%AF%E7%A4%BA%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/39733/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E6%BC%AB%E9%9B%BB%E7%8E%A9%E9%80%9A%E8%A7%A3%E7%AD%94%E9%A1%AF%E7%A4%BA%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

;(function() {
	'use strict'

	const APIURL = 'https://script.google.com/macros/s/AKfycbyyIFvW0LyJUT92VjGBwy7jh7gUsTfjLnugUnXQWUr8N2Y4oBbE2eIjMXjLBz3esC7e/exec'
	const $ansbox = jQuery('.BH-rbox.BH-qabox1')

	const getCSRF = () => xf.get('/ajax/getCSRFToken.php').text()
	const answer = sn => o =>
		getCSRF().then(token =>
			xf.get('/ajax/quiz_answer.php', { qs: { sn, o, token } }).text(html => html.includes('答對了'))
		)
	const tryAnswer = sn => Promise.all([1, 2, 3, 4].map(answer(sn))).then(r => r.indexOf(true) + 1)
	const getAnswer = sn => xf.get(APIURL, { qs: { sn } }).json()
	function getQuestion($ansbox) {
		let anss = $ansbox
			.find('li')
			.toArray()
			.map(x => x.textContent.trim())
		let q
		return (q = {
			question: $ansbox.contents()[0].textContent.trim(),
			answer1: anss[0],
			answer2: anss[1],
			answer3: anss[2],
			answer4: anss[3],
			sn: $ansbox.data('quiz-sn'),
			toArray: function() {
				return [q.sn, q.question, q.answer1, q.answer2, q.answer3, q.answer4, q.answer]
			}
		})
	}

	function dbQuery(q) {
		return getAnswer(q.sn).then(data => {
			console.log(q.sn, data)
			if (data !== null) {
				return data.answer
			}
			return tryAnswer(q.sn).then(ans => {
				q.answer = ans
				console.log('Submit new question to database', q)
				xf.post(APIURL, { json: q.toArray(), mode: 'no-cors', redirect: 'follow' }).json(console.log)
				return ans
			})
		})
	}

	if (!egg.cookie.get('BAHAID')) return

	dbQuery(getQuestion($ansbox))
		.then(x => $ansbox.find('li')[x - 1])
		.then(el =>
			$(el)
				.css('font-size', '120%')
				.css('color', 'red')
		)
})()
