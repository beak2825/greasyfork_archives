// ==UserScript==
// @name         Facebook Views Parser
// @version      0.10
// @description  Считает количество просмотров на reels за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.facebook.com/*
// @exclude      *instagram.com/*
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422100/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/507614/Facebook%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/507614/Facebook%20Views%20Parser.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */

let firstLink, secondLink
let resultElement
let timeline
let objects = []
let netData = {}
let started = 0 // 0, 1, 2 - не начато, работает, закончено




function parseValue(value) {
    value = value.replaceAll(/&nbsp;/g, "").replaceAll(/\u00A0/g, "").replaceAll(String.fromCharCode(160), "").replaceAll(" ", "").trim()

    if (value.includes("тыс.")) {
        value = value.replace("тыс.", "")
        if (value.includes(",")) {
            value = parseInt(value.replace(",", "")) * 100
        } else {
            value = parseInt(value) * 1000
        }
    } else if (value.includes("млн")) {
        value = value.replace("млн", "")
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


    let object1 = objects.find((element) => element.href === firstLink)
    let object2 = objects.find((element) => element.href === secondLink)
    if (objects.indexOf(object1) > objects.indexOf(object2)) {
        [firstLink, secondLink] = [secondLink, firstLink]
    }


    let er = 0
    for (let object of objects) {
        object.status = false

        // Если ничего не начато, но текущий рилс - первый
        // или
        // Если начато, но текущая рилс - последний
        if (!inPeriod && object.href == firstLink && secondLink) {
            inPeriod = true
        }

        // Если не в периоде, но пост не принудителен
        if (!inPeriod && object.mark != "include") {
            continue
        }

        // Если в периоде, но рилс надо скипнуть
        if (inPeriod && object.mark == "exclude") {
            skippedQuantity++
            continue
        }

        // Если не начато/не закончено
        result += object.views
        object.status = true
        quantity++
        er += parseFloat(object.er)

        // Если начато, но текущая рилс - последний
        if (inPeriod && object.href == secondLink && firstLink) {
            inPeriod = false
        }
    }

    resultElement.innerText = result
    let fullQuantity = quantity + skippedQuantity
    er = (er / quantity).toFixed(2)

    resultElement.title = `Просчитано ${quantity} рилсов\nПропущено ${skippedQuantity} рилсов (внутри периода)\nВсего посчитано рилсов: ${fullQuantity}\nСредний ER: ${er}%`
    resultElement.style.color = fullQuantity > 70 ? "#ff6e6e" : "white"

    collectObjects()
}




// function setLink(event) {
//     // пример такой ссылки https://www.instagram.com/reel/CyjktC2Mylx/
//     if (!window.location.href.includes("/reel/")) {
//         alert("Нужно открыть необходимый рилс")
//         return
//     }
//     let href = window.location.href.replace("/?s=single_unit", "")
//     if (href == "https://www.facebook.com/reel/" || href == "https://www.facebook.com/reel") {
//         event.target.dataset.link = objects[0].href
//     } else {
//         event.target.dataset.link = href
//     }
//     if (firstButton.dataset.link && secondButton.dataset.link) {
//         startCount()
//     }
// }


function setFirstLink(event) {
    let href = event.target.parentElement.parentElement.querySelector("a").href.split("/?")[0]
    firstLink = href
    startCount()
}

function setSecondLink(event) {
    let href = event.target.parentElement.parentElement.querySelector("a").href.split("/?")[0]
    secondLink = href
    startCount()
}


function excludeLink(event) {
    let href = event.target.parentElement.parentElement.querySelector("a").href.split("/?")[0]
    let object = objects.find((element) => element.href === href)
    object.mark = "exclude"
    startCount()
}


function includeLink(event) {
    let href = event.target.parentElement.parentElement.querySelector("a").href.split("/?")[0]
    let object = objects.find((element) => element.href === href)
    object.mark = "include"
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
    if (document.getElementById("parser-form")) {
        return
    }

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
            right: 15px;
            bottom: 15px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            color: white;
            z-index: 999;
        }

        #parser-form > .parser-row {
            display: flex;
            gap: 3px;
        }

        #parser-form button,
        .parser-bottom-menu button {
            color: white;
            background-color: #101010;
            border: none;
            flex: 1;
            border-radius: 3px;
			box-sizing: border-box;
			cursor: pointer;
        }

		#parser-form button:hover,
        .parser-bottom-menu button:hover {
			background-color: black;
		}

		#parser-form button:active,
        .parser-bottom-menu button:active {
			background-color: #3b3b3b;
		}

        #parser-form button[data-link],
        .parser-bottom-menu button[data-link],
        .parser-button-active {
            background-color: #103610;
        }

        #parser-result-element {
            text-align: center;
        }

        .parser-bottom-menu {
            height: 30px;
            width: 100%;
            background: #1E1E1E;
            display: flex;
            justify-content: space-evenly;
            gap: 3px;
            padding: 3px;
            box-sizing: border-box;
            align-items: center;
            color: white;
        }

		.parser-date {
			width: 50%;
            text-align: center;
		}

        .x9f619.x1r8uery.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6 {
            border: 1px solid transparent;
        }

		.x1swvt13.x1y1aw1k>div.html-div:has(object+span.html-span+object) {
			border: 5px dashed red;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
		}

		.xod5an3 > .x78zum5.x1q0g3np.x1a02dak {
			gap: 1px;
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


function collectObjects() {
    if (!timeline) { return }

    for (let el of timeline.children) {
        let href = el.querySelector("a")
        if (!href) { continue }
        href = href.href.split("/?")[0]

        let object = objects.find((element) => element.href === href)


        if ((!object || object && !object.views)) {
            let viewsSpan = el.querySelector("span > span")
            let viewsValue = viewsSpan ? parseValue(viewsSpan.innerText) : 0

            if (!object) {
                object = {
                    href: href,
                    views: viewsValue,
                    status: false,
                }
                objects.push(object)
            } else {
                object.views = viewsValue
            }
        }

        if (!el.querySelector(".parser-bottom-menu")) {
            let menuEl = document.createElement("div")
            menuEl.className = "parser-bottom-menu"

            let firstButton = document.createElement("button")
            firstButton.innerText = "1"
            firstButton.onclick = setFirstLink
            firstButton.title = "Назначает открытый рилс как первый для подсчёта просмотров."
            menuEl.appendChild(firstButton)

            let secondButton = document.createElement("button")
            secondButton.innerText = "2"
            secondButton.onclick = setSecondLink
            secondButton.title = "Назначает открытый рилс как последний для подсчёта просмотров."
            menuEl.appendChild(secondButton)

            let excludeButton = document.createElement("button")
            excludeButton.innerText = "-"
            excludeButton.onclick = excludeLink
            excludeButton.title = "Сделать рилс игнорируемым при просчёте."
            menuEl.appendChild(excludeButton)

            let includeButton = document.createElement("button")
            includeButton.innerText = "+"
            includeButton.onclick = includeLink
            includeButton.title = "Отменить игнорирование тиктока при просчёте."
            menuEl.appendChild(includeButton)

            let dateEl = document.createElement("div")
            dateEl.className = "parser-date"
            dateEl.innerText = "..."
            menuEl.appendChild(dateEl)

            el.appendChild(menuEl)
        }


        if (!object.date) {
            if (objects.indexOf(object) < 10) {
                let id = href.split("/reel/")[1]
                let data = [...document.querySelectorAll("script")].find(el =>
                    el.innerHTML.includes("creation_time") && el.innerHTML.includes(`"id":"${id}"`)
                )
                let date = data.innerHTML.match(/"creation_time":[0-9]+/gm)[objects.indexOf(object)]
                object.date = new Date(date.split(":")[1] * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
            }
            else if (netData[href]) {
                object.date = netData[href]
            }
            if (object.date) {
                delete netData[href]
            }
        }


        if (object.date && el.querySelector(".parser-date").innerText == "...") {
            el.querySelector(".parser-date").innerText = object.date.split(",")[0]
        }

        el.title = `Просмотров: ${object.views}`

        if (object.er) {
            el.title += `\nЛайков: ${object.likes}, комментариев: ${object.comments}, ER: ${object.er}%`
        }

        if (object.date) {
            el.title += `\nДата: ${object.date}`
        }

        if (object.status && object.mark != "exclude") {
            el.style.outline = "2px dashed Green"
        } else if (object.mark == "exclude") {
            el.style.outline = "2px dashed DarkGoldenRod"
        } else if (!object.status) {
            el.style.outline = "none"
        }

    }
}



function toExcel() {

    let workbook = XLSX.utils.book_new()
    let data = [["Reel", "Просмотры"]]

    let filtered = objects.filter((object) => object.status && !object.skip)

    for (let i = 0; i < filtered.length; i++) {
        let object = filtered[i]

        data.push([
            { t: "s", v: object.href, font: { color: { rgb: "#0000FF" } } },
            { t: "n", v: object.views }
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
    XLSX.writeFile(workbook, `facebook.xlsx`)
}
GM_registerMenuCommand("Скачать Excel файл", toExcel, "x")
GM_registerMenuCommand("Валидация", collectObjects, "c")



const timelineObserver = new MutationObserver(() => { collectObjects() })
const newTimelineObserver = new MutationObserver(() => {
    if (timeline) {
        timelineObserver.disconnect()
        newTimelineObserver.disconnect()
    }
    timeline = document.querySelector('.xod5an3 > .x78zum5.x1q0g3np.x1a02dak')
    timelineObserver.observe(timeline, {
        childList: true
    })
})
newTimelineObserver.observe(document.body, {
    childList: true,
    subtree: true
})


createForm()



const originalOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._method = method
    this._url = url
    return originalOpen.apply(this, arguments)
}

const originalSend = XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.send = function (body) {
    if (this._method === 'POST' && this._url == "/api/graphql/") {
        this.addEventListener('load', function () {
            let data = this.responseText
            try {
                data = data.split("\n")
                data.forEach((el) => {
                    let json = JSON.parse(el)
                    let edges = json.data.node.aggregated_fb_shorts.edges
                    edges.forEach((edge) => {
                        let id = edge.profile_reel_node.node.video.id
                        let date = edge.profile_reel_node.node.creation_time
                        date = new Date(date * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
                        let href = `https://www.facebook.com/reel/${id}`
                        netData[href] = date
                    })
                })

            } catch { }
        })
    }
    return originalSend.apply(this, arguments)
}



navigation.addEventListener("navigatesuccess", e => {
    if (window.location.href.includes("&sk=reels_tab")) { collectObjects() }
    if (!window.location.href.includes("/reel/")) { return }
    let href = window.location.href.replace("/?s=single_unit", "")
    let object = objects.find((element) => element.href === href)
    if (!object) { return }
    if (object.er && !object.views) { return }
    let elements = document.querySelectorAll("div.x1ja2u2z.xdt5ytf.x6s0dn4 > span > span")
    if (!elements) { return }
    let likes = parseValue(elements[0].innerText) || 0
    let comments = parseValue(elements[1].innerText) || 0
    object.likes = object.likes || likes
    object.comments = object.comments || comments
    let er = (((likes + comments) / object.views) * 100).toFixed(2)
    object.er = object.er || er

    elements[0].title = `Просмотров: ${object.views}, лайков: ${object.likes}, комментариев: ${object.comments}, ER: ${object.er}%`

})