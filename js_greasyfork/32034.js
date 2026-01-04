// ==UserScript==
// @name         Накрутка подписчиков в Instagram
// @namespace    Накрутка подписчиков в Instagram
// @version      2.0.4
// @description  Предлагаю вашему вниманию скрипт,который сам подписывается и отписывается от известных людей в инстаграм.
// @author       Bladhard
// @match        https://*.instagram.com/*
// @grant        none
// @icon         https://www.instagram.com/static/images/ico/favicon.svg/fc72dd4bfde8.svg
// @exclude      https://*.instagram.com/accounts/*
// @exclude      https://*.instagram.com/p/*
// @downloadURL https://update.greasyfork.org/scripts/32034/%D0%9D%D0%B0%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/32034/%D0%9D%D0%B0%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20Instagram.meta.js
// ==/UserScript==

const noProf = 'Скрипт необходимо запускать в чьём-то профиле Instagram.',
      nextProf =
      'Выбери кого-то, у кого больше 3 миллионов подписчиков. Например, instagram.com/timatiofficial'
const accountName = document.getElementsByClassName('_7UhW9')[0].innerHTML,
      noFollowers = 'На аккаунте ' + accountName + ' недостаточно подписчиков для работы скрипта.'

let inst = location.href.indexOf('instagram.com') >= 1
let home =
    document.getElementsByClassName('sqdOP').length && document.getElementsByClassName('W9_iZ')

function noFoll() {
    fClick()
    let fSub = document.getElementsByClassName('aOOlW')[0]
    if (fSub) {
        fSub.click()
    } else {
        fClick()
        numberОfСlicks()
    }
}
function fClick() {
    let sub = document.getElementsByClassName('_5f5mN')[0]
    sub.click()
}

let currentCount = 0
function numberОfСlicks() {
    document.getElementsByClassName('num')[0].innerHTML = currentCount
    return currentCount++
}

function donate() {
    document.getElementsByClassName('bPdm3')[0].insertAdjacentHTML(
        'beforebegin',
        `<style>
    .don {
        justify-content: center;
        text-align: center;
        position: relative;
        height: 30px;
        width: 160px;
        border-radius: 3px;
        background-color: #FFDD00;
        margin-right: -12px;
    }
    .don a {
        color: white;
        font-size: 14px;
        font-weight: 600;
    }
</style>
<div class="don">
    <a href="https://www.buymeacoffee.com/bladhard" target="_blank">
      ☕ Buy Me A Coffee
    </a>
</div>`
    )
}

function clickWindow() {
    document.getElementsByClassName('bPdm3')[0].insertAdjacentHTML(
        'beforebegin',
        `<style>
    .qwe {
        display: flex;
        justify-content: center;
        position: relative;
        width: max-content;
        max-width: 100px;
        height: 30px;
        border-radius: 3px;
        border: .5px #ffffff solid;
        background-color: #454545;
        margin: 0 8px;
    }
    .num {
        text-align: center;
        font-weight: 600;
        color: white;
        margin: 0 12px;
    }
</style>
<div class="qwe">
    <a href="https://www.buymeacoffee.com/bladhard" target="_blank">
        <h3 class="num">${currentCount}</h3>
    </a>
</div>`
    )
}

if (home == 1) {
    console.log(
        'Определяем страницу - ' + accountName + ', наша страница, работа скрипта запрещена. '
    ) // 1, наша страница. 0, чужая страница.
    console.log(noProf)
    alert(noProf)
} else if (
    parseInt(
        document.getElementsByClassName('g47SY')[1].attributes[1].textContent.split(' ').join('')
    ) < 3000000
) {
    console.log(
        'Определяем страницу - ' +
        accountName +
        ', правильная страница, работа скрипта разрешена, определяем кол-во подписчиков. '
    )
    console.log(noFollowers)
    alert(noFollowers)
    console.log(nextProf)
    alert(nextProf)
} else {
    let time = prompt('Введите количество секунд между действиями', '30')
    if (time === null) alert('Запуск скрипта отменен! Для запуска скрипта обновите страницу.')
    else {
        clickWindow()
        donate()
        noFoll()

        console.log(
            'Определяем страницу - ' +
            accountName +
            ', правильная страница, работа скрипта разрешена. '
        )
        console.log('Скрипт запущен.')
        alert('Скрипт запущен. Интервал между действиями равен "' + time + '" сек."')
        console.log('Интервал между действиями равен ' + time + ' сек.')
        alert('При закрытии данной вкладки работа скрипта будет завершена.')
        console.log('При закрытии данной вкладки работа скрипта будет завершена.')
    }
    setTimeout(function () {
        noFoll()
    }, time * 1000)
    setInterval(noFoll, time * 1000)
}
