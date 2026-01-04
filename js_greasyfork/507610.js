// ==UserScript==
// @name         VK Clips Views Parser
// @version      0.6
// @description  Считает количество просмотров на клипах за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.vk.com/clips*
// @match        https://vk.com/clips*
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @downloadURL https://update.greasyfork.org/scripts/507610/VK%20Clips%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/507610/VK%20Clips%20Views%20Parser.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */

let firstButton, secondButton, resultElement
let mainElement
let clips = []
let started = 0 // 0, 1, 2 - не начато, работает, закончено
let channel
// let authed = false
let selectors = {}




function parseValue(value) {
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

    let firstLink = firstButton.dataset.link
    let secondLink = secondButton.dataset.link

    // let commonPeriod = firstLink || secondLink
    // commonPeriod = commonPeriod || clips.some((element) => element.mark && element.mark != "include")


    let clip1 = clips.find((element) => element.href === firstLink)
    let clip2 = clips.find((element) => element.href === secondLink)
    if (clips.indexOf(clip1) > clips.indexOf(clip2)) {
        [firstLink, secondLink] = [secondLink, firstLink]
    }


    for (let clip of clips) {
        clip.status = false

        // Если ничего не начато, но текущий клип - первый
        // или
        // Если начато, но текущая клип - последний
        if ((!inPeriod && clip.href == firstLink && secondLink)) {
            inPeriod = true
        }

        // Если не в периоде начато, но пост не принудителен
        if (!inPeriod && clip.mark != "include") {
            continue
        }

        // Если в периоде, но клип надо скипнуть
        if (inPeriod && clip.mark == "exclude") {
            skippedQuantity++
            continue
        }

        // Если не начато/не закончено
        result += clip.views
        clip.status = true
        quantity++

        // Если начато, но текущая клип - последний
        if (inPeriod && clip.href == secondLink && firstLink) {
            inPeriod = false
        }
    }

    resultElement.innerText = result
    let fullQuantity = quantity + skippedQuantity
    resultElement.title = `Просчитано ${quantity} клипов\nПропущено ${skippedQuantity} клипов (внутри периода)\nВсего посчитано клипов: ${fullQuantity}`
    resultElement.style.color = quantity > 70 ? "#ff6e6e" : "white"

    collectClips()
}




function getClipLink() {
    let href
    href = window.location.href
    // if (authed) {
    // 	href = window.location.href
    // } else {
    // 	if (window.location.href.includes("?z=")) {
    // 		href = "https://vk.com/" + window.location.href.split("?z=")[1].split("&")[0]
    // 	} else {
    // 		href = window.location.href
    // 	}
    // }
    return href
}




function setLink(event) {
    if (!window.location.href.includes("z=clip-")) {
        alert("Нужно открыть необходимый клип")
        return
    }
    let href = getClipLink()
    event.target.dataset.link = href
    if (firstButton.dataset.link && secondButton.dataset.link) {
        startCount()
    }
}




function excludeLink() {
    if (!window.location.href.includes("z=clip-")) {
        alert("Нужно открыть необходимый клип")
        return
    }
    let href = getClipLink()
    let clip = clips.find((element) => element.href === href)
    clip.mark = "exclude"
    startCount()
}




function includeLink() {
    if (!window.location.href.includes("z=clip-")) {
        alert("Нужно открыть необходимый клип")
        return
    }
    let href = getClipLink()
    let clip = clips.find((element) => element.href === href)
    clip.mark = "include"
    startCount()
}




function copyResult() {
    let result = resultElement.innerText
    navigator.clipboard.writeText(result)
}




let row
// По хорошему всё это надо переделать в строку с html
// откуда и будет браться вся форма
function createForm() {

    document.querySelector("#parser-form")?.remove()

    let form = document.createElement("div")
    form.id = "parser-form"

    let style = document.createElement('style')
    style.innerHTML = /*css*/`
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
			gap: 5px;
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

		#parser-form button[data-link] {
			background-color: #103610;
		}

		.parser-date {
			text-align: center;
		}

		.videoplayer_ui._layer {
			display: none !important;
		}

		.videoplayer_media:has(video.videoplayer_media_provider):after {
			content: none !important;
		}
	`
    document.head.appendChild(style)

    // set link

    firstButton = document.createElement("button")
    firstButton.innerText = "1"
    firstButton.title = "Назначает открытый клип как первый для подсчёта просмотров\n(жать на самом НОВОМ клипе за период)."
    firstButton.onclick = setLink

    secondButton = document.createElement("button")
    secondButton.innerText = "2"
    secondButton.title = "Назначает открытый клип как последний для подсчёта просмотров\n(жать на самом СТАРОМ клипе за период)."
    secondButton.onclick = setLink

    row = document.createElement("div")
    row.className = "parser-row"

    row.appendChild(firstButton)
    row.appendChild(secondButton)
    form.appendChild(row)

    // skip/unskip

    let excludeButton = document.createElement("button")
    excludeButton.innerText = "-"
    excludeButton.title = "Сделать клип игнорируемым при просчёте."
    excludeButton.onclick = excludeLink

    let includeButton = document.createElement("button")
    includeButton.innerText = "+"
    includeButton.title = "Отменить игнорирование клипа при просчёте."
    includeButton.onclick = includeLink

    row = document.createElement("div")
    row.className = "parser-row"

    row.appendChild(excludeButton)
    row.appendChild(includeButton)
    form.appendChild(row)

    // count/copy

    let countButton = document.createElement("button")
    countButton.onclick = startCount
    countButton.innerText = "="
    countButton.title = "Считает просмотры клипов в выбранном отрезке"

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




async function collectClips() {
    if (!mainElement) { return }
    let elements = mainElement.querySelectorAll("[data-testid=grid-item]")
    for (let el of elements) {
        let href = el.querySelector("a[data-testid=clip-preview]").href
        let clip = clips.find((element) => element.href == href)

        // Если пост не запомнен
        if (!clip) {

            let viewsSpan = el.querySelector("[data-testid=clipcontainer-views]")
            let viewsValue = viewsSpan ? parseValue(viewsSpan.innerText) : 0

            clip = {
                views: viewsValue,
                href: href,
                status: false
            }

            clips.push(clip)
        }

        if (isNaN(clip.views)) {
            let viewsSpan = el.querySelector("[data-testid=clipcontainer-views]")
            let viewsValue = viewsSpan ? parseValue(viewsSpan.innerText) : 0
            clip.views = viewsValue
        }


        if (!el.querySelector(".parser-date")) {
            if (clip.date) {
                if (!clip.date_string) {
                    clip.date_string = new Date(clip.date * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
                }
                let area = el.querySelector("[class^=vkitClipContainer__content]:has([class^=vkitClipContainer__views])")
                let date_el = document.createElement("div")

                date_el.className = "parser-date"
                date_el.innerText = clip.date_string.split(",")[0]

                area.appendChild(date_el)
            }
        }


        if (clip) {
            if (clip.status && clip.mark != "exclude") {
                el.style.outline = "1px dashed LawnGreen"
            } else if (clip.mark == "exclude") {
                el.style.outline = "1px dashed DarkGoldenRod"
            } else if (!clip.status) {
                el.style.outline = "none"
            }
        }

        el.title = clip.date_string + "\n" + clip.views + " просмотров"

        if (clip.status) {
            el.title += "\nПросчитан"
        } else if (clip.mark == "exclude") {
            el.title += "\nПропущен при просчёте"
        }

    }
}
GM_registerMenuCommand("Принудительно перепроверить клипы", collectClips, "u")




function toExcel() {

    let workbook = XLSX.utils.book_new()
    let data = [["clip", "Просмотры"]]

    let filtered = clips.filter((clip) => clip.status)

    for (let i = 0; i < filtered.length; i++) {
        let clip = filtered[i]

        data.push([
            { t: "s", v: clip.href, font: { color: { rgb: "#0000FF" } } },
            { t: "n", v: clip.views }
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




waitForKeyElements(".vkuiDiv__host > [class*=Grid__root]:has([class*=Grid__row])", (el) => {

    channel = window.location.href.replace("www.", "").replace("https://vk.com/clips/", "").split("?")[0]

    const observer = new MutationObserver(() => { collectClips() })

    mainElement = el

    observer.observe(mainElement, {
        childList: true,
        //subtree: true
    })

    createForm()
    collectClips()
})




navigation.addEventListener("navigatesuccess", e => {
    if (window.location.href.includes("?z=clip-")) {
        waitForKeyElements(".videoplayer_media > video.videoplayer_media_provider", (el) => {
            el.setAttribute("controls", "")

        })
    }
})




async function setDates(items) {
    if (!items) {
        return
    }
    let interval = setInterval(() => {
        items.forEach(element => {
            let href = window.location.href.split("?")[0]
            href = href + "?z=clip" + element.owner_id + "_" + element.id
            let clip = clips.find((element) => element.href === href)
            let date = element.date
            if (clip) {
                clip.date = date
            }
        })
        collectClips()
        clearInterval(interval)
    }, 300)
    }




let originalFetch = unsafeWindow.fetch
unsafeWindow.fetch = function (url, options) {
    try {
        return originalFetch.apply(this, arguments).then(response => {
            let clonedResponse = response.clone()

            clonedResponse.text().then(body => {
                if (url && url?.includes("https://api.vk.com/method/shortVideo.getOwnerVideos")) {
                    let items = JSON.parse(body).response.items
                    setDates(items)
                } else if (url && url?.includes("https://api.vk.com/method/execute?v=")) {
                    let items = JSON.parse(body)?.response?.[0]?.items
                    setDates(items)
                }
            })
            return response
        })
    } catch {
        return originalFetch.apply(this, arguments)
    }
}




let originalSend = XMLHttpRequest.prototype.send


XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener('load', function () {
        try {
            let data = JSON.parse(this.responseText)
            let date = data?.payload[1][4]?.player?.params[0]?.date || data?.payload[1][4]?.mvData?.info[9]
            date = new Date(date * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

            if (date) {
                waitForKeyElements(".VerticalVideoLayerInfo__underAuthorNameSubtitle", (parent) => {
                    let el = document.createElement("span")
                    el.className = "VerticalVideoLayerInfo__date"
                    el.title = "Точная дата получена парсером. Возможно, она некорректна. Сверяйтесь."
                    el.innerHTML = `<br>${date}`
                    parent.appendChild(el)
                })
                let href = document.location.href
                let clip = clips.find((element) => element.href === href)
                if (clip && !clip.date) {
                    clip.date = date
                }
            }
        } catch {
            return originalSend.apply(this, arguments)
        }
    })
    return originalSend.apply(this, arguments)
}