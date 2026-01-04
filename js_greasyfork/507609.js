// ==UserScript==
// @name         VK Posts Views Parser
// @version      0.13
// @description  Считает количество просмотров на постах за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.vk.com/*
// @match        https://vk.com/*
// @exclude      https://vk.com/clips*
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422100/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @downloadURL https://update.greasyfork.org/scripts/507609/VK%20Posts%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/507609/VK%20Posts%20Views%20Parser.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */

let firstLink, secondLink, resultElement
let mainElement
let posts = []
let channel



const mouseOverEvent = new MouseEvent('mouseover', {
	// 'view': window,
	'bubbles': true,
	'cancelable': true
})


const mouseOutEvent = new MouseEvent('mouseout', {
	// 'view': window,
	'bubbles': true,
	'cancelable': true
})




function parseValue(value) {
	value = value.replace("просмотров", "")
	value = value.replaceAll(/&nbsp;/g, "").replaceAll(/\u00A0/g, "").replaceAll(String.fromCharCode(160), "").replaceAll(" ", "").trim()
	if (value.includes("K")) {
		value = value.replace("K", "")
		if (value.includes(",")) {
			value = parseInt(value.replace(",", "")) * 100
		} else {
			value = parseInt(value) * 1000
		}
	} else if (value.includes("M")) {
		value = value.replace("M", "")
		if (value.includes(",")) {
			value = parseInt(value.replace(",", "")) * 100000
		} else {
			value = parseInt(value) * 1000000
		}
	} else {
		value = parseInt(value)
	}
	return value
}




function startCount() {
	let result = 0
	let inPeriod = false
	resultElement.innerText = "0"

	let quantity = 0
	let skippedQuantity = 0

	let post1 = posts.find((element) => element.href === firstLink)
	let post2 = posts.find((element) => element.href === secondLink)
	if (posts.indexOf(post1) > posts.indexOf(post2)) {
		[firstLink, secondLink] = [secondLink, firstLink]
	}


	for (let post of posts) {
		post.status = false

		// Если ничего не начато, но текущий рилс - первый
		if (!inPeriod && post.href == firstLink && secondLink) {
			inPeriod = true
		}

		// Если не в периоде начато, но пост не принудителен
		if (!inPeriod && post.mark != "include") {
			continue
		}

		// Если в периоде, но рилс надо скипнуть
		if (inPeriod && post.mark == "exclude") {
			skippedQuantity += 1
			continue
		}

		// Если не начато/закончено
		result += post.views
		post.status = true
		quantity += 1

		// Если начато, но текущий рилс - последний
		if (inPeriod && post.href == secondLink && firstLink) {
			inPeriod = false
		}
	}

	resultElement.innerText = result
	let fullQuantity = quantity + skippedQuantity
	resultElement.title = `Просчитано ${quantity} постов\nПропущено ${skippedQuantity} постов (внутри периода)\nВсего посчитано постов: ${fullQuantity}`
	resultElement.style.color = fullQuantity > 70 ? "#ff6e6e" : "white"

	collectPosts()
}




function copyResult() {
	let result = resultElement.innerText
	navigator.clipboard.writeText(result)
}




let row
// По хорошему всё это надо переделать в строку с html
// откуда и будет браться вся форма
function createForm() {

	let form = document.createElement("div")
	form.id = "parser-form"

	let style = document.createElement('style')
	style.innerHTML = `
		#parser-form {
			position: fixed;
			width: 70px;
			background-color: #1E1E1E;
			border-radius: 3px;
			padding: 3px;
			right: 60px;
			bottom: 40%;
			display: flex;
			flex-direction: column;
			gap: 3px;
			color: white;
			z-index: 999;
			text-align: center;
		}
	
		#parser-form > .parser-row {
			display: flex;
			justify-content: space-evenly;
			gap: 3px;
		}
	
		#parser-form button {
			color: white;
			background-color: #101010;
			border: none;
			flex: 1;
			border-radius: 3px;
			box-sizing: border-box;
			cursor: pointer;
		}

		#parser-form button:hover {
			background-color: black;
		}

		#parser-form button:active {
			background-color: #3b3b3b;
		}
	
		.parser-post-button[data-parser-selected=true] {
			background-color: #103610 !important;
		}

		.parser-data {
			margin-left: 12px;
			color: var(--vkui--color_text_secondary);
		}

		.post.page_block {
			border-radius: 0 !important;
			border-bottom: 16px solid var(--vkui--color_background);
		}
	`
	document.head.appendChild(style)

	// count/copy

	let countButton = document.createElement("button")
	countButton.onclick = startCount
	countButton.innerText = "="
	countButton.title = "Считает просмотры рилсов в выбранном отрезке"

	let copyButton = document.createElement("button")
	copyButton.onclick = copyResult
	copyButton.innerHTML = `
		<svg role="img" xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewbox="0 -4 16 20">
			<path fill="white" d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z">
			</path>
		</svg>
	`
	copyButton.title = "Скопировать значение в буфер обмена"

	row = document.createElement("div")
	row.className = "parser-row"

	row.appendChild(countButton)
	row.appendChild(copyButton)
	form.appendChild(row)

	// result

	resultElement = document.createElement("div")
	resultElement.id = "parser-result-element"
	resultElement.innerText = "0"

	form.appendChild(resultElement)

	document.body.appendChild(form)
}



function startCountWithCheck() {
	if (firstLink && secondLink) {
		startCount()
	} else {
		collectPosts()
	}
}



function collectPosts() {
	let elements = mainElement.querySelectorAll("div._post.post")

	for (let el of elements) {

		let postId = el.dataset.postId.replace("-", "")
		//let href = `https://vk.com/${channel}?w=wall-${postId}`
		let href = `https://vk.com/wall-${postId}`
		let post = posts.find((element) => element.href == href)

		// Если пост не запомнен
		if (!post && postId) {

			post = {
				href: href,
				status: false,
			}

			posts.push(post)
		}

		let selector

		if (!post.views || isNaN(post.views)) {
			let interval1 = setInterval(() => {
				selector = `a[href*="${postId}"]`
				let a = el.querySelector(selector)
				if (a) {
					clearInterval(interval1)
					a.dispatchEvent(mouseOverEvent)
					let interval2 = setInterval(() => {
						try {
							let ariaId = a.getAttribute("aria-describedby")
							if (ariaId) {
								let tooltip = document.querySelector(`[role="tooltip"][id="${ariaId}"]`)
								//let date = tooltip.querySelector("div.vkuiTooltipBase__content span.vkuiText:nth-child(1)")
								let date = tooltip.querySelector(`[data-testid="post_date_block_date"]`)
								date = date.innerText
								//let views = tooltip.querySelector("div.vkuiTooltipBase__content span.vkuiText:nth-child(2)")
								let views = tooltip.querySelector(`[data-testid="post_date_block_viewers_count"]`)
								views = parseValue(views.innerText)
								if (!views || isNaN(views)) {
									return
								}
								clearInterval(interval2)
								post.date = date
								post.views = views
								a.dispatchEvent(mouseOutEvent)

								if (el.querySelector(".parser-data")) {
									el.querySelector(".parser-data").innerText = post.date + " \n " + post.views + " просмотров"
								}
							}
						} catch (e) { }

					}, 300)
				}
			}, 300)
		} else if (el.querySelector(".parser-data")) {
			el.querySelector(".parser-data").innerText = post.date + " \n " + post.views + " просмотров"
		}


		// Добавление кнопок
		if (!el.querySelector(".parser-post-button")) {
			let firstButton = document.createElement("div")
			firstButton.className = "PostBottomAction--withBg PostBottomAction PostBottomAction__label parser-post-button parser-first-button"
			firstButton.innerText = "1"
			firstButton.addEventListener("click", () => {
				firstLink = href
				startCountWithCheck()
			})
			el.querySelector(".like_btns").appendChild(firstButton)


			let secondButton = document.createElement("div")
			secondButton.className = "PostBottomAction--withBg PostBottomAction PostBottomAction__label parser-post-button parser-second-button"
			secondButton.innerText = "2"
			secondButton.addEventListener("click", () => {
				secondLink = href
				startCountWithCheck()
			})
			el.querySelector(".like_btns").appendChild(secondButton)


			let excludeButton = document.createElement("div")
			excludeButton.className = "PostBottomAction--withBg PostBottomAction PostBottomAction__label parser-post-button parser-exclude-button"
			excludeButton.innerText = "−"
			excludeButton.addEventListener("click", () => {
				post.mark = "exclude"
				startCount()
			})
			el.querySelector(".like_btns").appendChild(excludeButton)


			let includeButton = document.createElement("div")
			includeButton.className = "PostBottomAction--withBg PostBottomAction PostBottomAction__label parser-post-button parser-include-button"
			includeButton.innerText = "+"
			includeButton.addEventListener("click", () => {
				post.mark = "include"
				startCount()
			})
			el.querySelector(".like_btns").appendChild(includeButton)
		}


		if (!el.querySelector(".parser-data")) {
			let dataDiv = document.createElement("div")
			dataDiv.className = "parser-data vkuiTypography"
			el.querySelector(".like_btns").appendChild(dataDiv)
		}


		// Стили
		let firstButton = el.querySelector(".parser-first-button")
		let secondButton = el.querySelector(".parser-second-button")
		firstButton.dataset.parserSelected = href == firstLink ? true : false
		secondButton.dataset.parserSelected = href == secondLink ? true : false

		if (post.status && post.mark != "exclude") {
			el.style.outline = "1px dashed LawnGreen"
		} else if (post.mark == "exclude") {
			el.style.outline = "1px dashed DarkGoldenRod"
		} else if (!post.status) {
			el.style.outline = ""
		}
	}
}




function toExcel() {

	let workbook = XLSX.utils.book_new()
	let data = [["Post", "Просмотры"]]

	let filtered = posts.filter((post) => post.status)

	for (let i = 0; i < filtered.length; i++) {
		let post = filtered[i]

		data.push([
			{ t: "s", v: post.href, font: { color: { rgb: "#0000FF" } } },
			{ t: "n", v: post.views }
		])
	}

	let range = data.length

	data.push([""])
	data.push(["", "Всего просмотров"])
	data.push([
		"",
		{ f: `SUM(B2:B${range})` }
	])

	let ws = XLSX.utils.aoa_to_sheet(data)
	ws['!cols'] = [{ wpx: 340 }, { wpx: 140 }]
	XLSX.utils.book_append_sheet(workbook, ws, "Sheet1")
	XLSX.writeFile(workbook, `${channel}.xlsx`)
}
GM_registerMenuCommand("Скачать Excel файл для проверки", toExcel, "x")



function goToVideos() {
	window.location.href = `https://vkvideo.ru/@${channel}/all`
}
GM_registerMenuCommand("ВК Видео > Все видео", goToVideos, "a")



waitForKeyElements("#page_wall_posts", () => {
	channel = window.location.href.replace("https://www.vk.com/", "").replace("https://vk.com/", "").split("?")[0]

	const observer = new MutationObserver(() => { collectPosts() })

	mainElement = document.getElementById("page_wall_posts")

	observer.observe(mainElement, {
		childList: true
	})

	createForm()
	collectPosts()
})

