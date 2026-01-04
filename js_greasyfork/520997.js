// ==UserScript==
// @name         VK Video Views Parser
// @version      0.5.2
// @description  Считает количество просмотров на постах за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.vkvideo.ru/*/all
// @match        https://vkvideo.ru/*/all
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422100/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @downloadURL https://update.greasyfork.org/scripts/520997/VK%20Video%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/520997/VK%20Video%20Views%20Parser.meta.js
// ==/UserScript==
	
/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */


let blur = false // либо true (брюр включен), либо false (выключен)




let firstLink, secondLink, resultElement
let mainElement
let videos = []
let netData = {}
let channel
	

	
	
function parseValue(value) {
	value = value.replaceAll(/&nbsp;/g, "").replaceAll(/\u00A0/g, "").replaceAll(String.fromCharCode(160), "").replaceAll(" ","").trim()
	
	if (value.includes("тыс")) {
		value = value.replace("тыс","")
		if (value.includes(",")) {
			value = parseInt(value.replace(",",""))*100
		} else {
			value = parseInt(value)*1000
		}
	} else if (value.includes("млн")) {
		value = value.replace("млн","")
		if (value.includes(",")) {
			value = parseInt(value.replace(",",""))*100000
		} else {
			value = parseInt(value)*1000000
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
	
	let video1 = videos.find((element)=> element.href === firstLink)
	let video2 = videos.find((element)=> element.href === secondLink)
	if (videos.indexOf (video1)> videos.indexOf (video2)) {
		[firstLink, secondLink] = [secondLink, firstLink]
	}

	
	for (let video of videos) { 
		video.status = false

		// Если ничего не начато, но текущий рилс - первый
		if (!inPeriod && video.href == firstLink && secondLink) {
			inPeriod = true
		}

		// Если не в периоде начато, но пост не принудителен
		if (!inPeriod && video.mark != "include") {
			continue
		}
	
		// Если в периоде, но рилс надо скипнуть
		if (inPeriod && video.mark == "exclude") { 
			skippedQuantity += 1
			continue
		}

		// Если не начато/закончено
		result += video.views
		video.status = true
		quantity += 1

		// Если начато, но текущий рилс - последний
		if (inPeriod && video.href == secondLink && firstLink) { 
			inPeriod = false
		}
	}
	
	resultElement.innerText = result
	let fullQuantity = quantity + skippedQuantity
	resultElement.title = `Просчитано ${quantity} видео\nПропущено ${skippedQuantity} видео (внутри периода)\nВсего посчитано видео: ${fullQuantity}`
	resultElement.style.color = fullQuantity > 70 ? "#ff6e6e" : "white"

	collectVideos()
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
	style.id = "parser-style"
	style.innerHTML = /*css*/`
		:root {
			--parser-blur: ${blur ? "10px" : "0"};
		}

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

		.parser-video-row {
			display: flex;
			justify-content: space-around;
			gap: 6px;
			margin-top: 3px;
		}

		.parser-video-button {
			padding-block: 3px;
			padding-inline: 3px;
			color: var(--vkui--color_text_primary);
			background-color: var(--vkui--color_transparent--active);
			cursor: pointer;
		}

		.parser-video {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			height: 100%;
			width: 100%;
			object-fit: cover;
			overflow-clip-margin: content-box;
			overflow: clip;
			opacity: 0;
			transition-duration: 0s;
		}

		.parser-video:hover {
			opacity: 1;
		}
	
		.parser-video-button[data-parser-selected=true] {
			background-color: #103610 !important;
		}

		img[class*=vkitVideoCardPreviewImage__imgBlurred] {
			filter: none !important;
		}

		img[class*=vkitVideoCardPreviewImage__img] {
			filter: blur(var(--parser-blur)) !important;
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
		collectVideos()
	}
}


	
	
function collectVideos() {
	let elements = mainElement.querySelectorAll("[class*=vkitGridItem__root]")
	
	for (let el of elements) {
	
		let href = el.querySelector("a[href*=video]").href
		let video = videos.find((element)=> element.href == href)
	
		// Если пост не запомнен
		if (!video && href) {
	
			let viewsSpan     = el.querySelector("[class*=vkitVideoCardInfoLayout__additionalInfo][class*=vkuiFootnote]")
			let viewsValue    = viewsSpan ? parseValue(viewsSpan.innerText.replace(" · ","")) : 0
	
			video = {
				views: viewsValue,
				href: href,
				status: false,
				trailer: undefined,
				mark: undefined
			}
	
			videos.push(video)
		}
	
		// Добавление кнопок
		if (!el.querySelector(".parser-video-button")) {
			let row = document.createElement("div")
			row.className = "parser-video-row"
			
			let classList = "vkuiTypography vkuiTypography--normalize vkuiSubnavigationButton vkuiSubnavigationButton__in parser-video-button"

			let firstButton = document.createElement("div")
			firstButton.className = `${classList} parser-first-button`
			firstButton.innerText = "1"
			firstButton.addEventListener("click", ()=> {
				firstLink = href
				startCountWithCheck()
			})
			row.appendChild(firstButton)
	
			
			let secondButton = document.createElement("div")
			secondButton.className = `${classList} parser-second-button`
			secondButton.innerText = "2"
			secondButton.addEventListener("click", ()=> {
				secondLink = href
				startCountWithCheck()
			})
			row.appendChild(secondButton)


			let excludeButton = document.createElement("div")
			excludeButton.className = `${classList} parser-exclude-button`
			excludeButton.innerText = "−"
			excludeButton.addEventListener("click", ()=> {
				video.mark = "exclude"
				startCount()
			})
			row.appendChild(excludeButton)
	
	
			let includeButton = document.createElement("div")
			includeButton.className = `${classList} parser-include-button`
			includeButton.innerText = "+"
			includeButton.addEventListener("click", ()=> {
				video.mark = "include"
				startCount()
			})
			row.appendChild(includeButton)


			el.appendChild(row)
		}


		if (!el.querySelector(".parser-video-date") && netData[href]) {
			let dateEl = document.createElement("div")
			dateEl.className = "vkuiTypography vkuiTypography--normalize parser-video-date"
			dateEl.innerText = netData[href].date.split(",")[0]
			dateEl.title = netData[href].date
			dateEl.style.padding = "3px"
			dateEl.style.textAlign = "center"
			el.querySelector(".parser-video-row").prepend(dateEl)
		}


		// let channelHref = el.querySelector("a[class*=vkitVideoCardOwnerItem]").href.split("@")[1] || ""
		// if (channelHref && channelHref != channel) {
		// 	video.mark = "exclude"
		// }



		if (el.querySelector("[class*=vkitVideoCardRestrictionOverlay__restriction]")) {
			el.querySelector("[class*=vkitVideoCardRestrictionOverlay__restriction]").remove()

			let blurEl = el.querySelector("[class*=vkitVideoCardPreviewImage__imgBlurred]")
			let classList = Array.from(blurEl.classList)
  			let targetClass = classList.find(cls => cls.startsWith("vkitVideoCardPreviewImage__imgBlurred--"))

			if (targetClass) {
				blurEl.classList.remove(targetClass)
			}

			if (!video.trailer && netData[href] && netData[href].trailer) {
				video.trailer = netData[href].trailer
			}

			if (!el.querySelector("video") && video.trailer) {
				let videoEl = document.createElement("video")
				videoEl.setAttribute("loop", "")
				videoEl.setAttribute("crossorigin", "anonymous")
				videoEl.setAttribute("aria-label", "Видео от PornTV")
				// videoEl.className = document.querySelector("video[class*=vkitVideoCardTrailerPlayer__trailer").className
				videoEl.className = "parser-video"
				videoEl.src = video.trailer
				videoEl.preload = "none"
				// videoEl.title = "Это видео имело возрастное ограничение и скрытый трейлер. Это было пофикшено с помощью парсера."
				videoEl.onmouseenter = () => {
					videoEl.play()
					// videoEl.style.opacity = "1"
				}
				videoEl.onmouseleave = () => {
					videoEl.currentTime = 0
					videoEl.pause()
					// videoEl.style.opacity = "0"
				}

				let parent = el.querySelector("[class*=vkitVideoCardPreview__preview][role=button]")
				parent.insertBefore(videoEl, parent.children[1])
			}
		}
	
	
		// Стили
		let firstButton  = el.querySelector(".parser-first-button")
		let secondButton = el.querySelector(".parser-second-button")
		firstButton.dataset.parserSelected = href == firstLink ? true : false
		secondButton.dataset.parserSelected = href == secondLink ? true : false
	
		if (video.status && video.mark != "exclude") {
			el.style.outline = "1px dashed LawnGreen" //
		} else if (video.mark == "exclude") {
			el.style.outline = "1px dashed DarkGoldenRod"
		} else if (!video.status) {
			el.style.outline = "none"
		}
	}
}
	
	
	
	
function toExcel() {
	
	let workbook = XLSX.utils.book_new()
	let data = [["Video", "Просмотры"]]
	
	let filtered = videos.filter((video)=> video.status)
	
	for (let i = 0; i < filtered.length; i++) {
		let video = filtered[i]
	
		data.push([
			{ t: "s", v: video.href, font: { color: { rgb: "#0000FF" } } },
			{ t: "n", v: video.views }
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
	ws['!cols'] = [ { wpx: 340 }, { wpx: 140 } ]
	XLSX.utils.book_append_sheet(workbook, ws, "Sheet1")
	XLSX.writeFile(workbook, `vk_video.xlsx`)
}
GM_registerMenuCommand("Скачать Excel файл для проверки", toExcel, "x")
	
	


function blurToggle() {
	blur = !blur
	document.querySelector(":root").style.setProperty("--parser-blur", blur ? "10px" : "0")
}
GM_registerMenuCommand("Переключить брюр", blurToggle, "b")



	
waitForKeyElements("[class*=vkitGrid__root--][class*=ListGrid__list]", (element)=> {
	// channel = window.location.href.replace("https://www.vk.com/","").replace("https://vk.com/","").split("?")[0]
	
	const observer = new MutationObserver(()=> { collectVideos()})
	channel = document.location.href.split("@")[1].split("/")[0]
	
	mainElement = element
	
	observer.observe(mainElement, {
		childList: true
	})
	
	createForm()
	collectVideos()
})




async function getVideoData(items) {
	items.forEach(item => {
		let href = `https://vkvideo.ru/video${item.owner_id}_${item.id}`
		
		if (!netData[href]) {
			netData[href] = {}
		}
		if (!netData[href].trailer && item.trailer) {
			let trailer = item.trailer.mp4_360 || item.trailer.mp4_240 || item.trailer.mp4_480
			netData[href].trailer = trailer
		}
		
		if (!netData[href].date && item.date) {
			let date = new Date(item.date*1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
			netData[href].date = date
		}
	})
	collectVideos()
}





let originalFetch = unsafeWindow.fetch
unsafeWindow.fetch = function(url, options) {
	try {
		return originalFetch.apply(this, arguments).then(response => {
			if (url.includes("catalog.getVideo") || url.includes("catalog.getSection")) {
				let clonedResponse = response.clone()
				clonedResponse.text().then(body => {
					let items = JSON.parse(body).response.videos
					getVideoData(items)
				})
			}
			return response
		})
	} catch {
		return originalFetch.apply(this, arguments)
	}
}




// let originalFetch = unsafeWindow.fetch
// unsafeWindow.fetch = function(url, options) {
// 	try {
// 		return originalFetch.apply(this, arguments).then(response => {
// 			if (url.includes("catalog.getVideo") || url.includes("catalog.getSection")) {
// 				// const clonedResponse = response.clone()

// 				// try {
// 				let clonedResponse = response.clone()
// 				clonedResponse.text().then(body => {
// 					let jsonData = JSON.parse(body)
// 					let items = jsonData.response.videos
// 					items.forEach(item => {
						
// 						if (item.restriction) {
// 							delete item.restriction
// 						}
// 					})

// 					const newBody = JSON.stringify(jsonData)
// 					return new Response(newBody, {
// 						status: response.status,
// 						statusText: response.statusText,
// 						headers: response.headers
// 					})
// 				})

// 				// } catch (e) {
// 				// 	console.log(e)
// 				// 	return response
// 				// }
// 			}
// 			return response
// 		})
// 	} catch {
// 		return originalFetch.apply(this, arguments)
// 	}
// }