// ==UserScript==
// @name         Instagram Views Parser
// @version      0.30
// @description  Считает количество просмотров на reels за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.instagram.com/*
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @downloadURL https://update.greasyfork.org/scripts/507613/Instagram%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/507613/Instagram%20Views%20Parser.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */

let firstButton, secondButton, resultElement
let mainElement
let reels = []
let channel
// let fixes = []

const links = [
    "mostbet", "most-bet", "prmtxoe", "7tiff93", "bit.ly/3ZXIfXc", // Mostbet
    "betandreas", "bit.ly/41zcVzl", // Betandreas
    "vivy", "vivi", "depflowww", "nki9z0h", // Vivi
    "banzai", "bnzstr", // Banzai
    "t.me/+vFqTphU87T43Mjky", //Kinodostup
]


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

    let firstLink = firstButton.dataset.link
    let secondLink = secondButton.dataset.link

    let reel1 = reels.find((element) => element.href === firstLink)
    let reel2 = reels.find((element) => element.href === secondLink)
    if (reels.indexOf(reel1) > reels.indexOf(reel2)) {
        [firstLink, secondLink] = [secondLink, firstLink]
    }


    let er = 0
    for (let reel of reels) {
        reel.status = false

        // Если ничего не начато, но текущий рилс - первый
        // или
        // Если начато, но текущая рилс - последний
        if (!inPeriod && reel.href == firstLink && secondLink) {
            inPeriod = true
        }

        // Если не в периоде, но пост не принудителен
        if (!inPeriod && reel.mark != "include") {
            continue
        }

        // Если в периоде, но рилс надо скипнуть
        if (inPeriod && reel.mark == "exclude") {
            skippedQuantity++
            continue
        }

        // Если не начато/не закончено
        result += reel.views
        reel.status = true
        quantity++
        er += parseFloat(reel.er)

        // Если начато, но текущая рилс - последний
        if (inPeriod && reel.href == secondLink && firstLink) {
            inPeriod = false
        }
    }

    resultElement.innerText = result
    let fullQuantity = quantity + skippedQuantity
    er = (er / quantity).toFixed(2)

    resultElement.title = `Просчитано ${quantity} рилсов\nПропущено ${skippedQuantity} рилсов (внутри периода)\nВсего посчитано рилсов: ${fullQuantity}\nСредний ER: ${er}%`
    resultElement.style.color = fullQuantity > 70 ? "#ff6e6e" : "white"

    collectReels()
}




function setLink(event) {
    // пример такой ссылки https://www.instagram.com/reel/CyjktC2Mylx/
    if (!window.location.href.includes("/reel/")) {
        alert("Нужно открыть необходимый рилс")
        return
    }

    let href = window.location.href.replace("reel", `${channel}/reel`)
    event.target.dataset.link = href
    if (firstButton.dataset.link && secondButton.dataset.link) {
        startCount()
    }
}




function excludeLink() {
    if (!window.location.href.includes("/reel/")) {
        alert("Нужно открыть необходимый рилс")
        return
    }
    let href = window.location.href.replace("reel", `${channel}/reel`)
    let reel = reels.find((element) => element.href === href)
    reel.mark = "exclude"
    startCount()
}




function includeLink() {
    if (!window.location.href.includes("/reel/")) {
        alert("Нужно открыть необходимый рилс")
        return
    }
    let href = window.location.href.replace("reel", `${channel}/reel`)
    let reel = reels.find((element) => element.href === href)
    reel.mark = "include"
    startCount()
}




function copyResult() {
    let result = resultElement.innerText
    navigator.clipboard.writeText(result)
}




// function checkSubCount() {
//     let interval = setInterval(() => {
//         let span = document.querySelectorAll("._ac2a")[1]
//         let count = parseValue(span.innerText)
//         if (count < 10000) {
//             span.closest("a").style.borderBottom = "5px solid red"
//         }
//         clearInterval(interval)
//     }, 500)
// }




// function checkAverageViews10() {
//     let interval = setInterval(() => {
//         let first10 = reels.slice(0,10)
//         let sum = first10.reduce((n, {views}) => n + views, 0)
//         if (!sum) { return }
//         let average = Math.round(sum / 10)
//         let span = document.createElement("li")
//         span.classList = "xl565be x1m39q7l x1uw6ca5 x2pgyrj"
//         span.innerText = average
//         span.title = `Среднее количествово просмотров за 10 последних рилсов: ${average}\nВсего просмотров за 10 последних рилсов: ${sum}`
//         if (average < 10000) {
//             span.style.borderBottom = "5px solid red"
//         }
//         document.querySelector(".xieb3on").appendChild(span)
//         clearInterval(interval)
//     }, 500)
// }




function checkLink() {
    let element = document.querySelector("section > .x7a106z")
    let button = element.querySelector("button")
    if (!element) { return }
    let result = links.some(link => element.innerHTML.toLowerCase().includes(link))

    // if (fixes.includes(channel)) {
    // 	element.style.borderBottom = "5px solid green"
    // 	element.title = "Фиксовик, можно без ссылки"
    // } else 
    if (!result && !button) {
        element.style.borderBottom = "5px solid red"
        element.title = "Нет ссылки!"
    } else if (!result && button) {
        element.style.borderBottom = "5px solid yellow"
        element.title = "Есть скрытые ссылки. Возможно там есть нужная."
    }
}




let row
//TODO переделать в html?
function createForm() {

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

		#parser-result-element {
            text-align: center;
        }

        header._aaqw:has(._aaqv) {
            border: 5px dashed red;
            box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
        }

		svg[aria-label='Значок прикрепленной публикации'] {
			background-color: black;
			outline: 2px solid red;
		}
    `
    document.head.appendChild(style)

    // set link

    firstButton = document.createElement("button")
    firstButton.innerText = "1"
    firstButton.title = "Назначает открытый рилс как первый для подсчёта просмотров\n(жать на самом НОВОМ рилсе за период)."
    firstButton.onclick = setLink

    secondButton = document.createElement("button")
    secondButton.innerText = "2"
    secondButton.title = "Назначает открытый рилс как последний для подсчёта просмотров\n(жать на самом СТАРОМ рилсе за период)."
    secondButton.onclick = setLink

    row = document.createElement("div")
    row.className = "parser-row"

    row.appendChild(firstButton)
    row.appendChild(secondButton)
    form.appendChild(row)

    // skip/unskip

    let excludeButton = document.createElement("button")
    excludeButton.innerText = "-"
    excludeButton.title = "Сделать рилс игнорируемым при просчёте."
    excludeButton.onclick = excludeLink

    let includeButton = document.createElement("button")
    includeButton.innerText = "+"
    includeButton.title = "Отменить игнорирование рилса при просчёте."
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
    countButton.title = "Посчитать"

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




function collectReels() {
    if (!window.location.href.includes("/reels/")) { return }

    let elements = document.querySelectorAll("._ac7v > *")

    if (!elements) { return }

    for (let el of elements) {
        //el.style.border = "1px solid aqua" // Tests

        let href = el.querySelector("a").href
        let reel = reels.find((element) => element.href === href)

        if ((!reel && href.includes("/reel/")) || (reel && !reel.views)) {

            let viewsSpan = el.querySelector("._aajy > div > span > span")
            let likesSpan = el.querySelector("._aaj- ul > li:nth-child(1) > span > span")
            let commentsSpan = el.querySelector("._aaj- ul > li:nth-child(2) > span > span")

            let viewsValue = viewsSpan ? parseValue(viewsSpan.innerText) : 0
            let likesValue = likesSpan ? parseValue(likesSpan.innerText) : 0
            let commentsValue = commentsSpan ? parseValue(commentsSpan.innerText) : 0

            // let er = ((likesValue / viewsValue) * 100).toFixed(2) // Только лайки
            let er = (((likesValue + commentsValue) / viewsValue) * 100).toFixed(2) // Лайки + комменты

            let mark = undefined
            if (el.querySelector('svg[aria-label="Значок прикрепленной публикации"]')) {
                mark = "exclude"
            }

            if (!reel) {
                reel = {
                    href: href,
                    views: viewsValue,
                    likes: likesValue,
                    comments: commentsValue,
                    er: er,
                    status: false,
                    mark: mark,
                    number: reels.length + 1
                }

                reels.push(reel)
            } else {
                reel.views = viewsValue
                reel.likes = likesValue
                reel.comments = commentsValue
                reel.er = er
            }

            if (!href.includes(channel)) {
                let id = reel.href.split("/reel/")[1].split("/")[0]
                let href = `https://www.instagram.com/${channel}/reel/${id}/`
                console.info(`Fixed collab reel href: ${reel.href} -> ${href}`)
                reel.href = href
            }

        }


        if (reel && href.includes("/reel/")) {
            if (reel.status && reel.mark != "exclude") {
                el.style.border = "1px dashed LawnGreen"
            } else if (reel.mark == "exclude") {
                el.style.border = "1px dashed DarkGoldenRod"
            } else if (!reel.status) {
                el.style.border = "none"
            }
        }


        el.title = `Просмотров: ${reel.views}\nЛайков: ${reel.likes}\nКомментариев: ${reel.comments}`

        if (reel.status) {
            el.title += "\nПросчитан"
        } else if (reel.mark == "exclude") {
            el.title += "\nПропущен при просчёте"
        }

        el.title += `\n\nER: ${reel.er}%`

        if (reel.date) {
            el.title += "\nДата: " + reel.date
        }

        el.title += "\n№" + reel.number

        let er = parseFloat(reel.er)
        if (er == 0) {
            el.querySelector("._aajy > div > span > span").style.borderBottom = "2px solid yellow"
        } else if (er < 1.5 || er > 5) {
            el.querySelector("._aajy > div > span > span").style.borderBottom = "2px solid red"
        }

    }
}




function toExcel() {
    let workbook = XLSX.utils.book_new()
    let data = [["Дата (МСК)", "Видео", "Просмотры", "Лайки", "Комментарии", "ER"]]

    let filtered = reels.filter((reel) => reel.status)

    for (let i = 0; i < filtered.length; i++) {
        let reel = filtered[i]
        let row = i + 2

        let er = `(D${row}+E${row})/C${row}*100`

        data.push([
            { t: "s", v: reel.date || "" },
            { t: "s", v: reel.href, l: { Target: reel.href } },
            { t: "n", v: reel.views },
            { t: "n", v: reel.likes },
            { t: "n", v: reel.comments },
            { t: "n", f: er }
        ])
    }

    let range = data.length // фикс длины пока не добавились строки статистики

    data.push([""])
    data.push(["", "", "Всего просмотров", "", "", "Средняя ER"])
    data.push([
        "",
        "",
        { f: `SUM(C2:C${range})` },
        "",
        "",
        { f: `AVERAGE(F2:F${range})` }
    ])

    let ws = XLSX.utils.aoa_to_sheet(data)
    ws['!cols'] = [{ wpx: 110 }, { wpx: 340 }, { wpx: 100 }, { wpx: 60 }, { wpx: 80 }, { wpx: 80 }]
    XLSX.utils.book_append_sheet(workbook, ws, "Результаты")

    let date = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }).split(",")[0].replaceAll(".", "-")
    XLSX.writeFile(workbook, `${channel} (${date}).xlsx`)
}
GM_registerMenuCommand("Скачать Excel таблицу", toExcel, "x")




waitForKeyElements("main", () => {
    createForm()

    const observer = new MutationObserver(() => { collectReels() })

    mainElement = document.getElementsByTagName("main")[0]
    channel = window.location.href.split(".com/")[1].replace("/reels", "").replace("/", "")
    collectReels()

    observer.observe(mainElement, {
        subtree: true,
        childList: true
    })
    checkLink()
})




const originalOpen = XMLHttpRequest.prototype.open
const originalSend = XMLHttpRequest.prototype.send

XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._method = method
    this._url = url
    return originalOpen.apply(this, arguments)
}


XMLHttpRequest.prototype.send = function (body) {
    if (this._method === 'POST' && this._url == "/graphql/query") {
        this.addEventListener('load', function () {
            try {
                let data = JSON.parse(this.responseText)
                data.data.xdt_api__v1__clips__user__connection_v2.edges.forEach((el) => {

                    if (el.node.media.media_overlay_info) {
                        let href = `https://www.instagram.com/${channel}/reel/${el.node.media.code}/`
                        let updateInterval = setInterval(() => {
                            let reel = reels.find((element) => element.href === href)
                            if (reel) {
                                reel.views = el.node.media.play_count
                                reel.er = "???"
                                clearInterval(updateInterval)
                            }
                        }, 200)
                    }
                })
            } catch (e) { }
        })
    }
    return originalSend.apply(this, arguments)
}




navigation.addEventListener("navigatesuccess", e => {
    if (window.location.href.includes("/reels/")) {
        collectReels()
    } else if (window.location.href.includes("/reel/")) {
        let href = window.location.href.replace("reel", `${channel}/reel`)
        let reel = reels.find((element) => element.href === href)
        if (!reel) { return }
        if (reel.date) { return }
        waitForKeyElements("time.x1p4m5qa", (el) => {
            let text = el.getAttribute("datetime")
            reel.date = new Date(text).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
        })
    }
})