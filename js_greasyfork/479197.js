    // ==UserScript==
    // @name         AllInOne
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  AllInOne - Super Pacotão de Scripts
    // @author       VSCoutinho
    // @match        */*
    // @match        *://spoon.rekreasi.co.id/*
    // @icon         https://static-00.iconduck.com/assets.00/clock-stop-icon-256x256-evvlirzq.png
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479197/AllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/479197/AllInOne.meta.js
    // ==/UserScript==



	window.addEventListener('load', () => {

		const 
			getCookie = (name) => {
				let matches = document.cookie.match(
					new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\/\+^])/g, '\$1') + "=([^;]*)")
				)
				return matches ? decodeURIComponent(matches[1]) : undefined
			},

			setCookie = (name, value) => {

				let options = {
						expires: new Date(Date.now() +  60 * 60 * 24 * 365).toUTCString(),
						path: '/',
						domain: location.host
					},
					updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)

				for (let optionKey in options) {
					updatedCookie += "; " + optionKey
					let optionValue = options[optionKey]
					if (optionValue !== true) {
						updatedCookie += "=" + optionValue
					}
				}

				document.cookie = updatedCookie
			}

		const 
			codeVisible = true,
			visitedCount = 8,
			postId = 4115,
			uniquePostFlag = true
			
		console.log('postId, visitedCount, codeVisible, uniquePostFlag', postId, visitedCount, codeVisible, uniquePostFlag );

		if (postId && uniquePostFlag) {

			let step = 10,
				scale = 10,
				time = 20 * 1000

			let interval = setInterval(() => {

				time -= step

				let strTime = (time / scale).toString(),
					seconds = strTime.slice(0, -2) || '0',
					mSeconds = strTime.slice(-2)

				if (seconds.length == 1) seconds = '0' + seconds
				if (mSeconds == '0') mSeconds = '00'

				document.querySelector('._rnd-inner-counter__countdown').innerText = seconds + ':' + mSeconds

				if ( time == 0 ) {

					clearInterval(interval)

					if (uniquePostFlag) {

						document.querySelector('._rnd-unique-count').innerText = visitedCount + 1

						if ( !codeVisible ) {
							let postsIds = getCookie('post_ids')
							postsIds = JSON.parse(postsIds)
							postsIds.push(postId)

							setCookie('post_ids', JSON.stringify(postsIds))

						} else {
							document.querySelector('._rnd-inner-counter__countdown')
								.style.fontSize = '48' + 'px'
							document.querySelector('._rnd-inner-counter__countdown').innerText = codeVisible
						}
					}
				}
				
			}, step)
		}
	})