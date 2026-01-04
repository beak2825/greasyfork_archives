// ==UserScript==
// @name         TikTok Views Parser
// @version      0.14
// @description  Считает количество просмотров на тиктоках за определённый отрезок
// @author       Михаил Смирнов
// @match        https://www.tiktok.com/*
// @require      https://unpkg.com/xlsx/dist/xlsx.mini.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422100/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_registerMenuCommand
// @noframes
// @license      MIT
// @namespace    https://greasyfork.org/users/1257876
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507612/TikTok%20Views%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/507612/TikTok%20Views%20Parser.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* global XLSX */
/* global navigation */
/* global waitForKeyElements */

let firstLink, secondLink
let resultElement, mainElement
let tiktoks = []
let started = 0 // 0, 1, 2 - не начато, работает, закончено
let netData = {}


function parseValue(value) {
    if (value.includes("K")) {
        value = value.replace("K", "")
        if (value.includes(".")) {
            value = parseInt(value.replace(".", "")) * 100
        } else {
            value = parseInt(value) * 1000
        }
    } else if (value.includes("M")) {
        value = value.replace("M", "")
        if (value.includes(".")) {
            value = parseInt(value.replace(".", "")) * 100000
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

    if (firstLink && secondLink) {
        let tiktok1 = tiktoks.find((element) => element.href === firstLink)
        let tiktok2 = tiktoks.find((element) => element.href === secondLink)
        if (tiktoks.indexOf(tiktok1) > tiktoks.indexOf(tiktok2)) {
            [firstLink, secondLink] = [secondLink, firstLink]
        }
    }

    let er = 0
    for (let tiktok of tiktoks) {
        tiktok.status = false

        if (!inPeriod && tiktok.href == firstLink && secondLink) {
            inPeriod = true
        }

        // Если не в периоде, но пост не принудителен
        if (!inPeriod && tiktok.mark != "include") {
            continue
        }

        // Если в периоде, но рилс надо скипнуть
        if (inPeriod && tiktok.mark == "exclude") {
            skippedQuantity++
            continue
        }

        // Если не начато/не закончено
        result += tiktok.views
        tiktok.status = true
        quantity++
        er += parseFloat(tiktok.er)

        // Если начато, но текущая рилс - последний
        if (inPeriod && tiktok.href == secondLink && firstLink) {
            inPeriod = false
        }
    }

    resultElement.innerText = result
    let fullQuantity = quantity + skippedQuantity
    er = (er / quantity).toFixed(2)

    resultElement.title = `Просчитано ${quantity} рилсов\nПропущено ${skippedQuantity} видео (внутри периода)\nВсего посчитано видео: ${fullQuantity}\nСредний ER: ${er}%`
    resultElement.style.color = fullQuantity > 70 ? "#ff6e6e" : "white"

    collectTiktoks() // Возможно эта тема не очень хороша для производительности?
}


// #TODO всё в одну функцию, а то уродство пока что
function setFirstLink(event) {
    let href = event.target.closest("[class*=DivItemContainerV2]").querySelector("a").href
    firstLink = href
    startCount()
}


function setSecondLink(event) {
    let href = event.target.closest("[class*=DivItemContainerV2]").querySelector("a").href
    secondLink = href
    startCount()
}


function excludeLink(event) {
    let href = event.target.closest("[class*=DivItemContainerV2]").querySelector("a").href
    let tiktok = tiktoks.find((element) => element.href === href)
    tiktok.mark = "exclude"
    startCount()
}


function includeLink(event) {
    let href = event.target.closest("[class*=DivItemContainerV2]").querySelector("a").href
    let tiktok = tiktoks.find((element) => element.href === href)
    tiktok.mark = "include"
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
            left: 15px;
            bottom: 20px;
            display: flex;
			justify-content: space-evenly;
            flex-direction: column;
            gap: 3px;
            color: white;
            z-index: 99999;
        }

        #parser-form > .parser-row {
            display: flex;

            gap: 3px;
        }

        #parser-form button,
        .parser-tiktok-menu button {
            color: white;
            background-color: #101010;
            border: none;
            flex: 1;
            border-radius: 3px;
			box-sizing: border-box;
			cursor: pointer;
        }

		#parser-form button:hover,
        .parser-tiktok-menu button:hover {
			background-color: black;
		}

		#parser-form button:active,
        .parser-tiktok-menu button:active {
			background-color: #3b3b3b;
		}

        #parser-form button[data-link],
        .parser-tiktok-menu button[data-link],
        .parser-button-active {
            background-color: #103610;
        }
        #parser-result-element {
            text-align: center;
        }

        .parser-tiktok-menu {
            height: 30px;
            width: 100%;
            background: #1E1E1E;
            display: flex;
            justify-content: space-evenly;
            gap: 3px;
            padding: 3px;
            box-sizing: border-box;
            align-items: center;
        }

		.parser-date {
			width: 50%;
            text-align: center;
		}

        [class*=DivItemContainerV2] video {
            object-fit: contain !important;
        }
    `
    document.head.appendChild(style)

    // count/copy

    let countButton = document.createElement("button")
    countButton.onclick = startCount
    countButton.innerText = "="
    countButton.title = "Считает просмотры тиктоков в выбранном отрезке"

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




function collectTiktoks() {
    let elements = document.querySelectorAll("[class*=DivItemContainerV2]")

    for (let el of elements) {
        let href = el.querySelector("a").href
        let tiktok = tiktoks.find((element) => element.href === href)

        if (!tiktok && (href.includes("/video/") || href.includes("photo"))) {

            let viewsSpan = el.querySelector(".video-count")
            if (!viewsSpan) {
                continue
            }
            let viewsValue = viewsSpan ? parseValue(viewsSpan.innerText) : 0

            tiktok = {
                href: href,
                views: viewsValue,
                status: false,
            }

            tiktoks.push(tiktok)
        }


        if (!el.querySelector(".parser-tiktok-menu")) {
            let menuEl = document.createElement("div")
            menuEl.className = "parser-tiktok-menu"

            let firstButton = document.createElement("button")
            firstButton.innerText = "1"
            firstButton.onclick = setFirstLink
            firstButton.title = "Назначает открытый тикток как первый для подсчёта просмотров."
            menuEl.appendChild(firstButton)

            let secondButton = document.createElement("button")
            secondButton.innerText = "2"
            secondButton.onclick = setSecondLink
            secondButton.title = "Назначает открытый тикток как последний для подсчёта просмотров."
            menuEl.appendChild(secondButton)

            let excludeButton = document.createElement("button")
            excludeButton.innerText = "-"
            excludeButton.onclick = excludeLink
            excludeButton.title = "Сделать тикток игнорируемым при просчёте."
            menuEl.appendChild(excludeButton)

            let includeButton = document.createElement("button")
            includeButton.innerText = "+"
            includeButton.onclick = includeLink
            includeButton.title = "Отменить игнорирование тиктока при просчёте."
            menuEl.appendChild(includeButton)

            let dateEl = document.createElement("div")
            dateEl.className = "parser-date"
            dateEl.innerText = tiktok.date ? tiktok.date : "..."
            menuEl.appendChild(dateEl)

            el.appendChild(menuEl)
        }


        if (tiktok && (href.includes("/video/") || href.includes("photo"))) {
            if (tiktok.status && tiktok.mark != "exclude") {
                el.style.outline = "2px dashed Green"
            } else if (tiktok.mark == "exclude") {
                el.style.outline = "2px dashed DarkGoldenRod"
            } else if (!tiktok.status) {
                el.style.outline = "none"
            }
        }



        if (netData[href]?.date && !tiktok.date) {
            tiktok.date = netData[href].date
            tiktok.likes = netData[href].likes
            tiktok.comments = netData[href].comments
            tiktok.er = (((tiktok.likes + tiktok.comments) / tiktok.views) * 100).toFixed(2)
            //delete netData[href]
        }

        if (tiktok.er && (tiktok.er < 1.5 || tiktok.er > 5)) {
            el.querySelector("strong.video-count").style.borderBottom = "2px solid red"
        }

        if (tiktok.date) {
            el.querySelector(".parser-tiktok-menu").title
            el.querySelector(".parser-tiktok-menu").title = `Просмотров: ${tiktok.views}\nЛайков: ${tiktok.likes}\nКомментариев: ${tiktok.comments}`
            el.querySelector(".parser-tiktok-menu").title += `\nER: ${tiktok.er}% \n\nДата: ${tiktok.date}`

            el.querySelector(".parser-date").innerText = tiktok.date.split(",")[0]
        }

    }

}
GM_registerMenuCommand("Принудительно перепроверить тиктоки", collectTiktoks, "u")




function toExcel() {

    let channel = window.location.href.split("tiktok.com/@")[1].split("/")[0]

    let workbook = XLSX.utils.book_new()
    let data = [["Дата (МСК)", "Видео", "Просмотры", "Лайки", "Комментарии", "ER"]]

    let filtered = tiktoks.filter((tiktok) => tiktok.status)

    for (let i = 0; i < filtered.length; i++) {
        let tiktok = filtered[i]
        let row = i + 2

        let er = `(D${row}+E${row})/C${row}*100`

        data.push([
            { t: "s", v: tiktok.date || "" },
            { t: "s", v: tiktok.href, l: { Target: tiktok.href } },
            { t: "n", v: tiktok.views },
            { t: "n", v: tiktok.likes },
            { t: "n", v: tiktok.comments },
            { t: "n", f: er }
        ])
    }

    let range = data.length

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



waitForKeyElements("[class*=DivVideoFeedV2][data-e2e=user-post-item-list]", () => {
    mainElement = document.body.querySelector("[class*=DivVideoFeedV2]")
    const observer = new MutationObserver(() => { collectTiktoks() })

    observer.observe(mainElement, {
        childList: true
    })
    createForm()

    collectTiktoks()
})



let scrollPosition = 0
window.addEventListener("scroll", e => {
    if (window.location.href.includes("/video/")) { return }
    scrollPosition = window.scrollY
})




navigation.addEventListener("navigatesuccess", e => {
    if (!window.location.href.includes("/video/")) {
        collectTiktoks()
        window.scrollTo(0, parseInt(scrollPosition));
    }

    let likeSpan = document.querySelector('strong[data-e2e="browse-like-count"]')
    let commentSpan = document.querySelector('strong[data-e2e="browse-comment-count"]')

    if (!likeSpan && !commentSpan) { return }

    let likesValue = parseValue(likeSpan.innerText)
    let commentsValue = parseValue(commentSpan.innerText)
    let href = window.location.href.split("?")[0]

    let tiktok = tiktoks.find((element) => element.href === href)
    let viewsValue = tiktok.views

    let er = (((likesValue + commentsValue) / viewsValue) * 100).toFixed(2)
    let erText = `ER: ${er}%\n` +
        `Просмотров: ${viewsValue}, лайков: ${likesValue}, комментариев: ${commentsValue}\n` +
        `В ER учтены просмотры, лайки и комментарии. Закладки не учтены.`


    likeSpan.parentElement.title = erText
    commentSpan.parentElement.title = erText
})




let originalFetch = unsafeWindow.fetch
unsafeWindow.fetch = function (url, options) {
    try {
        return originalFetch.apply(this, arguments).then(response => {
            try {
                let myUrl = url.url ? url.url : url
                if (myUrl.startsWith("https://www.tiktok.com/api/post/item_list")) {
                    let clonedResponse = response.clone()
                    clonedResponse.text().then(body => {
                        let data = JSON.parse(body)
                        data.itemList.forEach(item => {
                            let href = `https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`
                            if (!netData[href]) {
                                let date = new Date(item.createTime * 1000).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
                                netData[href] = {}
                                netData[href].date = date
                                netData[href].likes = item.stats.diggCount
                                netData[href].comments = item.stats.commentCount
                            }

                        })
                    })
                }
                collectTiktoks()
                return response
            } catch {
                throw new Error("Ошибка")
            }
        })
    } catch {
        return originalFetch.apply(this, arguments)
    }
}