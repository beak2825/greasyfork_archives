// ==UserScript==
// @name         yuntech tronclass util
// @namespace    no
// @version      0.3.5
// @description  一鍵觀看影片，一鍵完成每周影音教材觀看，一鍵觀看投影片
// @author       someone
// @match        https://eclass.yuntech.edu.tw/course/*
// @icon         https://cdn.discordapp.com/avatars/755351137577599016/5ccfb5d525fb3d304c7d61c8d51c6777.png?size=1024
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481617/yuntech%20tronclass%20util.user.js
// @updateURL https://update.greasyfork.org/scripts/481617/yuntech%20tronclass%20util.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	let tglobal = {
		process: 0,
		processmax: 0,
		persent: 0,
		videoispress: false,
		courseispress: false,
		closeonfinish: false
	}

	function disableVideoJSFocusDetection() {
		const blockedEvents = [
			'visibilitychange',
			'webkitvisibilitychange',
			'mozvisibilitychange',
			'msvisibilitychange',
			'fullscreenchange',
			'webkitfullscreenchange',
			'mozfullscreenchange',
			'MSFullscreenChange',
			'focus',
			'blur',
			'pagehide'
		]

		blockedEvents.forEach((eventType) => {
			const originalAddEvent = EventTarget.prototype.addEventListener
			EventTarget.prototype.addEventListener = function (type, listener, options) {
				if (type === eventType) {
					console.log(`攔截: ${type}`)
					return
				}
				return originalAddEvent.call(this, type, listener, options)
			}

			window.addEventListener(
				eventType,
				function (e) {
					e.stopImmediatePropagation()
					e.preventDefault()
					console.log(`已阻止: ${eventType}`)
				},
				true
			)
		})

		Object.defineProperty(document, 'hidden', { get: () => false, configurable: true })
		Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true })
		Object.defineProperty(document, 'webkitHidden', { get: () => false, configurable: true })
		Object.defineProperty(document, 'webkitVisibilityState', {
			get: () => 'visible',
			configurable: true
		})

		document.hasFocus = () => true
		Object.defineProperty(document, 'hasFocus', { value: () => true, configurable: true })

		console.log('replaced document properties to prevent focus detection')
	}

	if (
		document.URL.match(
			/https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/learning-activity(#)?\/(full-screen)?/
		)
	) {
		disableVideoJSFocusDetection()
	}

	function contains(selector, text) {
		var elements = document.querySelectorAll(selector)
		return Array.prototype.filter.call(elements, function (element) {
			return RegExp(text).test(element.textContent)
		})
	}

	function tempAlert(msg, duration) {
		var el = document.createElement('div')
		el.innerHTML = `<div class="lol_alert alert-box success radius" data-alert>
      ${msg}
    </div>
    <style>
      .lol_alert {
        position: absolute;
        top: 40%;
        left: 20%;
        z-index: 99;
      }
    </style>`
		setTimeout(function () {
			el.parentNode.removeChild(el)
		}, duration)
		document.body.appendChild(el)
	}

	function updateprocessbar() {
		try {
			let processbar = document.getElementById('watch-process')
			let persent = (tglobal.process / tglobal.processmax) * 100
			processbar.style = `width: ${persent}%`
		} catch (e) {}
	}

	function finishprocessbar() {
		try {
			let processbar = document.getElementById('watch-process-div')
			processbar.parentNode.removeChild(processbar)
		} catch (e) {}
	}

	function extractVideoId(url) {
		try {
			const parsedUrl = new URL(url)
			const videoId = parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop()
			return videoId
		} catch (error) {
			console.error('獲取影片ID出錯:', error)
			return null
		}
	}

	async function get_youtube_length() {
		const iframe = document.querySelector('iframe[src*="youtube.com"]')
		if (!iframe) {
			reject('No YouTube iframe')
			return
		}
		const videoId = extractVideoId(iframe.src)
		if (!videoId) {
			reject('無法獲取影片ID')
			return
		}
		console.log('找到影片ID:', videoId)
		const apifetch = await fetch(
			'https://youtube_videotime_worker.phillychi3.workers.dev/api/video?url=' + videoId,
			{
				mode: 'no-cors'
			}
		)
		if (!apifetch.ok) {
			console.error('API錯誤:', apifetch.status)
			reject('API錯誤')
		} else {
			const apidata = await apifetch.json()
			return apidata.length
		}
	}

	async function circle_watch(fast = 1000) {
		const video = document.querySelector('video')
		//*[@id="player"]
		let max = 10000
		if (document.getElementById('player')) {
			max = await get_youtube_length()
		} else {
			max = video.duration
		}

		max = Math.floor(max)
		if (!video) {
			setTimeout(() => {
				circle_watch(fast)
			}, 1000)
			console.error('video not found')
			return
		}

		const maxrun = 60
		let lasttime = 0
		const thisvideoid = document.URL.split('/').splice(-1).toString()
		tglobal.processmax = max
		fetch(`https://eclass.yuntech.edu.tw/api/activities/${thisvideoid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			cookie: document.cookie
		})
			.then((response) => response.json())
			.then((data) => {
				let ct = 0
				for (let i = 0; i < max; i = i + maxrun) {
					ct++
					setTimeout(() => {
						watchthevideo(i, i + maxrun, data)
						tglobal.process = i + maxrun
						updateprocessbar()
						if (max - i < maxrun) {
							console.log('last')
							watchthevideo(i, max, data)
							tglobal.process = max
							updateprocessbar()
							finishprocessbar()
							tglobal.videoispress = false
							tempAlert('aleardy watch the video', 2000)
							if (tglobal.closeonfinish) {
								window.close()
							}
						}
					}, fast * ct)
					lasttime = i + maxrun
				}
			})
	}

	function watchthevideo(start, end, videodata) {
		start = Math.floor(start)
		end = Math.floor(end)
		const duration = end - start
		let student = globalData.user
		let course = globalData.course
		let dep = globalData.dept
		fetch(`https://eclass.yuntech.edu.tw/api/course/activities-read/${videodata.id}`, {
			method: 'POST',
			headers: {
				Origin: 'https://eclass.yuntech.edu.tw',
				Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
				'Content-Type': 'application/json;charset=UTF-8'
			},
			body: JSON.stringify({
				start: start,
				end: end
			}),
			cookie: document.cookie
		}).then((response) => response.json())
		fetch('https://eclass.yuntech.edu.tw/statistics/api/online-videos', {
			method: 'POST',
			headers: {
				Connection: 'keep-alive',
				Origin: 'https://eclass.yuntech.edu.tw',
				Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
				'Content-Type': 'text/plain;charset=UTF-8'
			},
			cookie: document.cookie,

			body: JSON.stringify({
				user_id: student.id,
				org_id: 1,
				course_id: course.id,
				module_id: videodata.moduls_id,
				syllabus_id: videodata.syllabus_id,
				activity_id: videodata.id,
				upload_id: videodata.uploads[0].id,
				reply_id: null,
				comment_id: null,
				forum_type: '',
				action_type: 'play',
				is_teacher: false,
				is_student: true,
				ts: Date.now(),
				user_agent: 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
				meeting_type: 'online_video',
				start_at: start,
				end_at: end,
				duration: duration,
				master_course_id: 0,
				org_name: student.orgName,
				user_no: student.userNo,
				user_name: student.name,
				course_code: course.courseCode,
				course_name: course.name,
				dep_id: dep.id,
				dep_name: dep.name,
				dep_code: dep.code
			})
		}).then((response) => {
			if (response.ok) {
				console.log('success')
			} else {
				console.log(response.status)
			}
		})
	}

	function watchthefile() {
		const activity_id = document.URL.split('/').splice(-1).toString()
		fetch(`https://eclass.yuntech.edu.tw/api/activities/${activity_id}?sub_course_id=0`, {
			headers: {
				Origin: 'https://eclass.yuntech.edu.tw',
				Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
				'Content-Type': 'application/json;charset=UTF-8'
			},
			cookie: document.cookie
		})
			.then((response) => response.json())
			.then((data) => {
				tglobal.processmax = data.uploads.length
				tglobal.process = 0
				data.uploads.forEach((element) => {
					fetch(`https://eclass.yuntech.edu.tw/api/course/activities-read/${data.id}`, {
						method: 'POST',
						headers: {
							Origin: 'https://eclass.yuntech.edu.tw',
							Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
							'Content-Type': 'application/json;charset=UTF-8'
						},
						cookie: document.cookie,
						body: JSON.stringify({
							upload_id: element.reference_id
						})
					})
						// fetch(
						//   `https://eclass.yuntech.edu.tw/api/uploads/reference/document/${element.reference_id}/url?preview=true&refer_id=${data.id}}&refer_type=learning_activity`,
						//   {
						//     headers: {
						//       Origin: "https://eclass.yuntech.edu.tw",
						//       Referer: `https://eclass.yuntech.edu.tw/course/${course.id}/learning-activity/full-screen`,
						//       "Content-Type": "application/json;charset=UTF-8",
						//     },
						//     cookie: document.cookie,
						//   }
						// )
						.then((response) => response.json())
					tglobal.process = tglobal.process + 1
					updateprocessbar()
					finishprocessbar()
				})
			})
		updateprocessbar()
		finishprocessbar()
		tglobal.videoispress = false
	}

	// 影片頁按鈕
	async function makevideopanel() {
		const target = await waitForSelector('.video-player-section')

		if (!target) {
			console.error('makevideopanel: .video-player-section not found')
			return
		}

		let panel = document.createElement('div')
		panel.style = 'padding: 20px; margin-top: 20px;'
		panel.innerHTML = `
        <div class="panel" id="eclassutilpanel">
            <div class="panel-heading">
                <h4>tronclass util</h4>
            </div>
            <div class="panel-body">
                <div class="panel-buttons" id="buttons">
                    <button class="btn btn-default glow-button" id="btn1">Watch Video</button>
                    <button class="btn btn-default glow-button" id="btn2">Watch Video Fast</button>
                </div>
            </div>
        </div>
        <style>
            .panel {
                margin-bottom: 23px;
                border-radius: 5px;
            }
            .panel-heading {
                padding: 10px;
                border-radius: 5px 5px 0 0;
            }
            .panel-body {
                padding: 15px;
            }
            .glow-button {
                position: relative;
                background: #428bca;
                color: white;
                border: none;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 5px;
                cursor: pointer;
            }
            .glow-button:hover {
                transform: translateY(-2px);
                background: #3071a9;
            }
        </style>
        `

		// 插入在影片區域之後
		target.parentNode.insertBefore(panel, target.nextSibling)

		// 按鈕事件監聽器
		let btn1 = document.getElementById('btn1')
		btn1.addEventListener('click', function () {
			if (!tglobal.videoispress) {
				let processbar = document.createElement('div')
				processbar.innerHTML = `
                <div class="panel-progress" id="watch-process-div">
                    <div class="progress-meter" id="watch-process" style="width: ${tglobal.persent}%"></div>
                </div>
                <style>
                    .panel-progress {
                        margin-top: 20px;
                        padding: 6px;
                        border-radius: 30px;
                        background: rgba(0, 0, 0, 0.25);
                        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25),
                            0 1px rgba(255, 255, 255, 0.08);
                    }
                    .progress-meter {
                        background-color: #ef416f;
                        height: 10px;
                        border-radius: 30px;
                        transition: 0.4s ease-out;
                    }
                </style>
                `
				document.querySelector('#eclassutilpanel .panel-body').appendChild(processbar)
				tglobal.videoispress = true
				circle_watch()
			}
		})

		let btn2 = document.getElementById('btn2')
		btn2.addEventListener('click', function () {
			if (!tglobal.videoispress) {
				tglobal.videoispress = true
				circle_watch(10)
			}
		})

		// 自動觀看邏輯
		let hash = window.location.hash.substring(1)
		let autowatch = false
		if (hash.includes('?')) {
			let hashParams = new URLSearchParams(hash.split('?')[1])
			autowatch = hashParams.get('autowatch')
		}
		if (autowatch === 'true') {
			tglobal.closeonfinish = true
			circle_watch()
		}
	}

	async function makefilepanel() {
		const target = await waitForSelector('div.fullscreen-right')
		if (!target) {
			console.error('makefilepanel: div.fullscreen-right not found')
			return
		}
		let panel = document.createElement('div')
		panel.style = 'padding: 20px;margin-top: -40px;'
		panel.innerHTML = `
    <div class="panel" id="eclassutilpanel">
      <div class="panel-heading">
        <h4>tronclass util</h4>
      </div>
      <div class="panel-body">
        <div class="panel-buttons" id="buttons">
          <button class="btn btn-default" id="btn1">Read All Files</button>
        </div>
      </div>
    </div>
    <style>
      .panel {
        margin-bottom: 23px;
        background: rgba(255, 255, 255, 0.9);
      }
      .panel-heading {
        padding: 0px;
      }
    </style>
    `
		target.appendChild(panel)
		let btn1 = document.getElementById('btn1')
		btn1.addEventListener('click', function () {
			if (!tglobal.videoispress) {
				let processbar = document.createElement('div')
				processbar.innerHTML = `
        <div class="panel-progress" id="watch-process-div">
            <div class="progress-meter" id="watch-process" style="width: ${tglobal.persent}%"></div>
        </div>
        <style>
          .panel-progress {
            margin-top: 20px;
            padding: 6px;
            border-radius: 30px;
            background: rgba(0, 0, 0, 0.25);
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25),
              0 1px rgba(255, 255, 255, 0.08);
          }
          .progress-meter {
            animation: progressAnimation 6s;
            background-color: #ef416f;
            height: 10px;
            border-radius: 30px;
            transition: 0.4s ease-out;
          }
        `
				document.querySelector('div.panel-body').appendChild(processbar)
				tglobal.videoispress = true
				watchthefile()
			}
		})
		let hash = window.location.hash.substring(1)
		let autowatch = false
		if (hash.includes('?')) {
			let hashParams = new URLSearchParams(hash.split('?')[1])
			autowatch = hashParams.get('autowatch')
		}
		if (autowatch === 'true') {
			tglobal.closeonfinish = true
			watchthefile()
		}
	}

	// 首頁按鈕
	function makecoursepanel() {
		let panel = document.createElement('div')
		panel.innerHTML = `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" aria-expanded="false">tronclass util</a>
            </h4>
        </div>
        <div class="buttons" id="buttons">
            <button class="btn btn-default" id="btn1">watch all video(not finish</button>
            <button class="btn btn-default" id="btn2">wait...</button>
        </div>
    </div>
    <style>
        .panel {
            margin-bottom: 23px;
        }
        .panel-heading {
            padding: 0px;
        }
        .panel-title {
            padding: 10px;
        }
    `

		let target = document.querySelector('.collapse')
		target.parentNode.insertBefore(panel, target)

		let btn1 = document.getElementById('btn1')
		let btn2 = document.getElementById('btn2')
		btn1.addEventListener('click', function () {
			console.log('click1')
		})
		btn2.addEventListener('click', function () {
			console.log('click2')
		})
	}

	// 觀看這周 按鈕
	function makeweekvideopanel() {
		let syllabus = document.getElementsByClassName('syllabus-list')
		Array.from(syllabus).forEach((element) => {
			let titleElement = element.querySelector('.title.ng-binding')
			if (titleElement && titleElement.innerText == '影音教材') {
				let activities = element.parentElement.getElementsByClassName('learning-activity')

				let activityIds = Array.from(activities)
					.map((activity) => {
						let match = activity.id.match(/learning-activity-(\d+)/)
						return match ? match[1] : null
					})
					.filter((id) => id !== null)

				let button = document.createElement('button')
				button.className = 'button-green'
				button.innerText = '觀看這周'
				button.style.marginRight = '10px'

				button.addEventListener('click', (event) => {
					event.stopPropagation()
					if (tglobal.courseispress) {
						return
					}
					tglobal.courseispress = true
					let container = document.createElement('div')
					container.style.display = 'flex'
					container.style.alignItems = 'center'
					container.style.gap = '10px'
					button.parentNode.insertBefore(container, button)
					container.appendChild(button)
					let processbar = document.createElement('div')
					processbar.className = 'loader'
					processbar.style.display = 'none'
					processbar.innerHTML = `
          <style>
            .loader {
              width: 30px;
              height: 30px;
              border: 5px solid #0000;
              box-sizing: border-box;
              background:
                radial-gradient(farthest-side,#000 98%,#0000) 0    0/5px 5px,
                radial-gradient(farthest-side,#000 98%,#0000) 100% 0/5px 5px,
                radial-gradient(farthest-side,#000 98%,#0000) 100% 100%/5px 5px,
                radial-gradient(farthest-side,#000 98%,#0000) 0 100%/5px 5px,
                linear-gradient(#000 0 0) 50%/10px 10px,
                #fff;
              background-repeat: no-repeat;
              filter: blur(2px) contrast(10);
              animation: l12 0.8s infinite;
            }
            @keyframes l12 {
              100%  {background-position:100% 0,100% 100%,0 100%,0 0,center}
            }
          `
					container.appendChild(processbar)
					processbar.style.display = 'block'
					alert(
						'自動觀看即將執行 請勿觸碰頁面，第一次使用請手動同意跳出過多窗口(瀏覽器右上角會有警示，並且重新執行自動觀看)，如有頁面長時間並無自動關閉請重新整理並手動按下觀看按鈕'
					)
					activityIds.forEach((id, index) => {
						setTimeout(() => {
							window.open(
								`https://eclass.yuntech.edu.tw/course/${globalData.course.id}/learning-activity/full-screen#/${id}?autowatch=true`
							)
							console.log(id)
						}, index * 6000)
					})
					setTimeout(() => {
						tglobal.courseispress = false
						processbar.style.display = 'none'
					}, activityIds.length * 6000)
				})

				titleElement.parentNode.appendChild(button)
			}
		})
	}

	var observer = new MutationObserver(resetTimer)
	var timer = setTimeout(action, 1000, observer)
	observer.observe(document, { childList: true, subtree: true })

	function resetTimer(changes, observer) {
		clearTimeout(timer)
		timer = setTimeout(action, 1000, observer)
	}

	function modifyLearningActivities() {
		const learningActivities = document.querySelectorAll('.learning-activity')

		learningActivities.forEach((activity) => {
			const activityId = activity.id.replace('learning-activity-', '')

			const clickableArea = activity.querySelector('.clickable-area')

			if (clickableArea) {
				const newClickableArea = clickableArea.cloneNode(true)
				clickableArea.parentNode.replaceChild(newClickableArea, clickableArea)

				const courseId = window.location.pathname.split('/')[2]

				newClickableArea.addEventListener('click', function (e) {
					e.preventDefault()
					e.stopPropagation()

					window.open(
						`https://eclass.yuntech.edu.tw/course/${courseId}/learning-activity#/${activityId}`,
						'_blank'
					)
				})

				newClickableArea.style.cursor = 'pointer'
			}
		})
	}

	function waitForElement(selector, text, maxAttempts = 5) {
		return new Promise((resolve) => {
			let attempts = 0

			const checkElement = () => {
				const elements = contains(selector, text)
				if (elements.length > 0) {
					resolve(true)
				} else if (attempts < maxAttempts) {
					attempts++
					setTimeout(checkElement, 100)
				} else {
					resolve(false)
				}
			}

			checkElement()
		})
	}

	function waitForSelector(selector, maxAttempts = 20) {
		return new Promise((resolve) => {
			let attempts = 0

			const checkElement = () => {
				const element = document.querySelector(selector)
				if (element) {
					resolve(element)
				} else if (attempts < maxAttempts) {
					attempts++
					setTimeout(checkElement, 200)
				} else {
					resolve(null)
				}
			}

			checkElement()
		})
	}

	async function action(observer) {
		observer.disconnect()
		if (document.URL.match(/https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/content#\//)) {
			makecoursepanel()
			makeweekvideopanel()
			modifyLearningActivities()
		} else if (
			document.URL.match(
				/https?:\/\/eclass.yuntech.edu.tw\/course\/[0-9]{1,6}\/learning-activity(#)?\/(full-screen)?/
			)
		) {
			const hasWatchRequirement = await waitForElement('span', '需累積觀看')
			if (hasWatchRequirement) {
				await makevideopanel()
			}

			const hasDownloadOption = await waitForElement('span', '觀看或下載')
			if (hasDownloadOption) {
				await makefilepanel()
			}
		}
	}

	console.log(
		'%c eclass Util %c https://github.com/phillychi3/loltronclass ',
		'color: white; background: #e9546b; padding:5px 0;',
		'padding:4px;border:1px solid #e9546b;'
	)
})()
