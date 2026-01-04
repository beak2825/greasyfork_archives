// ==UserScript==
// @name         Статистика баллов VK Testers
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  Показывает статистику, сколько еще осталось до накопления какого-либо товара в /testpool. Анализ идет по 3, 6 и 12 месяцам всех начислений. (В данный момент mvp, поэтому только последние 6 месяцев)
// @author       reyzitwo
// @match        https://vk.com/market-134304772*
// @match        https://vk.ru/market-134304772*
// @match        https://static.vk.com/vk_store/*
// @icon         https://vk.com/images/icons/favicons/fav_vk_testers.ico?6
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/476993/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B1%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20VK%20Testers.user.js
// @updateURL https://update.greasyfork.org/scripts/476993/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B1%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20VK%20Testers.meta.js
// ==/UserScript==

const ButtonGetStatisticCSS = `
    .page_block_header[id=market_page_header] .page_block_header_extra {
        line-height: normal;
    }

    .page_block_header[id=market_page_header] .page_block_header_extra .FlatButton {
        float: none;
    }
`

const DisplayStatisticGoodCSS = `
    .UserScript-reyztwo__good_statistic {
        position: absolute;
        top: 148px;
        right: 6px;
        background: var(--vkui--color_separator_primary);
        border-radius: 4px;
        padding: 5px;
    }
`

if (window.location.host === "static.vk.com") {
    getToken()
} else {
    renderButtonGetStatistics()
}

// получение токена приложения https://vk.com/app7300833
function getToken() {
    let id = setInterval(() => {
        let element = document.getElementsByClassName("ItemsGrid")
        if (element.length > 0) {
            console.log(JSON.parse(localStorage.getItem("7300833:vkui-common:auth")).access_token)
            GM.setValue("access_token", JSON.parse(localStorage.getItem("7300833:vkui-common:auth")).access_token)
            clearInterval(id)
        }
    }, 500)
}

async function renderButtonGetStatistics() {
    let headerChilds = [...document.getElementById("market_page_header").children]
    let buttons = headerChilds.find(el => el.className === "page_block_header_extra _header_extra")

    const button = document.createElement("button")
    button.className = "FlatButton FlatButton--secondary FlatButton--size-s"
    button.innerHTML = '<span class="FlatButton__in"> <span class="FlatButton__before"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" d="M2.1 19a.9.9 0 0 1 .9-.9h18a.9.9 0 0 1 0 1.8H3a.9.9 0 0 1-.9-.9ZM16.5 5.9a.9.9 0 1 1 0-1.8H21a.9.9 0 0 1 .9.9v4.5a.9.9 0 0 1-1.8 0V7.173l-5.964 5.963a.9.9 0 0 1-1.272 0L9.5 9.773l-5.864 5.863a.9.9 0 0 1-1.272-1.272l6.5-6.5a.9.9 0 0 1 1.272 0l3.364 3.363L18.827 5.9H16.5Z" clip-rule="evenodd"></path></svg></span> <span class="FlatButton__content">Статистика</span> </span>'
    addCSSStyle(ButtonGetStatisticCSS)

    button.addEventListener("click", () => displayStatsGoods())
    buttons.insertBefore(button, buttons.children[0])
}

async function displayStatsGoods() {
    const { operations, monthsPassed, error } = await getOperationsPoint()

    if (operations.length === 0) {
        if (!error) {
            unsafeWindow.Notifier.showEvent({ title: "Мал да удал", text: "Пока что мы не можем проанализировать ваши транзакции, вернитесь в ближайшую выдачу баллов :(" })
        }

        return
    }

    // средняя округленная ЗП, получаем сумму и делим на 2 * months (т.к. две выдачи в месяце). если вдруг monthsPassed === 0, то считаем что у чела была только 1 выдача
    let averageEarn = Math.floor( operations.reduce((acc, n) => acc + n, 0) / (monthsPassed ? 2 * monthsPassed : 1) )
    let balance = Number(document.getElementsByClassName("market_shop_balance_info")[0].children[0].children[1].innerText.split(" ").join(""))

    let goods = [...document.getElementById("market_list").children]
    let countGoods = Number(document.getElementById("market_items_count").innerText)

    // изначально товары прогружаются не все, поэтому нужно "догрузить" их самостоятельно
    while (countGoods > goods.length) {
        Market.updateList(goods.length)
        await sleep(1000)
        goods = [...document.getElementById("market_list").children]
    }

    addCSSStyle(DisplayStatisticGoodCSS)

    for (let good of goods) {
        if (good.id === "react_rootMarketGroupItemsModal") {
            continue
        }

        let price = Number(good.children[0].children[2].children[1].innerText.split(" ")[1])
        let time = Math.ceil((price - balance) / averageEarn)
        time = time < 0 ? 0 : time

        let timeEl = document.createElement("div")
        timeEl.className = "UserScript-reyztwo__good_statistic"
        timeEl.innerHTML = `${time} ${declOfNum(time, ["выдача", "выдачи", "выдач"])}` // убрал текст >100
        //timeEl.innerHTML = time > 100 ? ">100 выдач" : `${time} ${declOfNum(time, ["выдача", "выдачи", "выдач"])}`

        good.children[0].style.position = "relative"
        let result = good.children[0].appendChild(timeEl)
        console.log(result)
    }
}

// 1 - 3 месяца, 2 - 6 месяцев, 3 - 12 месяцев
async function getOperationsPoint(mode = 1) {
    const modeObj = { 1: 3, 2: 6, 3: 12 }
    const operations = []
    const nowDate = Math.floor(Date.now() / 1000)

    let coeffMonth = 1
    let monthsPassed = 0

    async function getOperations(last_id) {
        let response = await api("vkstore.getBalanceMovements", { owner_id: -134304772, count: 100 })
        if (response.error) {
            return { operations, monthsPassed, error: true }
        }

        response = response.response

        for (let item of response.items) {
            // 2629743 - 1 месяц в секундах, получается если между текущей и даты операции больше или равно 6 месяцам, то возвращаем массив с баллами
            if (nowDate - item.ts > 2629743 * 6) {
                monthsPassed++
                return { operations, monthsPassed, error: false }
            }

            if (nowDate - item.ts > 2629743 * coeffMonth) {
                coeffMonth++
                monthsPassed++
            }

            if (item.delta > 0 && !item.note.includes("Отмена заказа #")) {
                operations.push(item.delta)
            }
        }

        if (response.items.length === 100) {
            return new Promise(res => {
                setTimeout(() => {
                    res(getOperations(response.items[response.items.length - 1].transaction_id))
                }, 2750)
            })
        } else {
            return { operations, monthsPassed, error: false }
        }
    }

    return getOperations()
}

// отправка запросов к VK API
async function api(endpoint, params) {
    params.access_token = await GM.getValue("access_token")
    params.v = "5.120"

    if (!params.access_token) {
        unsafeWindow.Notifier.showEvent({ title: "Отсутствует токен", text: "Невозможно получить ваши операции, перейдите в <a href='\/app7300833' target='_blank'>приложение<\/a> и вернитесь обратно" })
        unsafeWindow.Notifier.playSound({ author_id: 1 })
        return { error: true }
    }

    let query = Object.keys(params).map(key => `${key}=${params[key]}`).join("&")
    let data = await fetch(`https://api.vk.com/method/${endpoint}?${query}`, {
        method: "POST"
    })

    data = await data.json()

    if (data.error) {
        let title = data.error.error_code === 5 ? "Токен просрочен" : `Неизвестная ошибка №${data.error.error_code}`
        let text = data.error.error_code === 5 ?
            "Требуется обновление токена, перейдите в <a href='\/app7300833' target='_blank'>приложение<\/a> и вернитесь обратно!" :
            "Попробуйте <a href='\/app7300833' target='_blank'>обновить токен<\/a>, а если же ошибка повторяется, то обратитесь <a href='\/id566935204' target='_blank'>ко мне<\/a>"

        unsafeWindow.Notifier.showEvent({ title: title, text: text })
        unsafeWindow.Notifier.playSound({ author_id: 1 })
    }

    return data
}

// Вставляем стили на страницу
function addCSSStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}

// склонение слов
function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ]
}


function sleep(ms) {
    return new Promise(res => setTimeout(() => res(), ms))
}