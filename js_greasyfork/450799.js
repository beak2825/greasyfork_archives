// ==UserScript==
// @name         auto GI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  auto hunter
// @author       LeeRoY73
// @match        https://www.heroeswm.ru/mercenary_guild.php
// @match        https://www.heroeswm.ru/map.php
// @match        https://www.heroeswm.ru/war.php?warid=*
// @match        https://www.heroeswm.ru/waiting_for_results.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450799/auto%20GI.user.js
// @updateURL https://update.greasyfork.org/scripts/450799/auto%20GI.meta.js
// ==/UserScript==
const hrefGI = 'https://www.heroeswm.ru/mercenary_guild.php'
const hrefMap = 'https://www.heroeswm.ru/map.php'
const hrefResult = 'https://www.heroeswm.ru/waiting_for_results.php'
const horseGif = 'https://dcdn.heroeswm.ru/i/horse_gif.gif'
const autoGiGif = 'https://dcdn.heroeswm.ru/i/btns/HuntBtnGold_Auto.png'
const LOCAL_STORAGE_NAME = 'hwm-helper-autoGi'
const INPUT_COUNT_GAME_NAME = 'hwm-helper-inputCount'
const INPUT_COUNT_NOW_GAME_NAME = 'hwm-helper-inputCountNow'
const BTN_START_ANY_NAME = 'hwm-helper-startAny'
const MAP_COUNT = 'hwm-helper-mapCount'

function GetRandomNumber() {
    let randomCount = Math.random() * 10

    console.log(randomCount)
    return randomCount
}

function reload() {
    window.location.reload()
}

function autoGiStart() {
    localStorage.setItem(LOCAL_STORAGE_NAME, "true")
    localStorage.setItem(MAP_COUNT, 0)
    if (heart !== 100){
        console.log('ждем хп')
        setTimeout(() => {
          window.location.reload()
        }, 5*1000)
        return;
    }

    if (localStorage.getItem(BTN_START_ANY_NAME) === "true") {
        if (localStorage.getItem(INPUT_COUNT_NOW_GAME_NAME) === localStorage.getItem(INPUT_COUNT_GAME_NAME)) {
            alert('Закончил')
            scriptOff()
            return
        }
        let countNow = Number(localStorage.getItem(INPUT_COUNT_NOW_GAME_NAME))
        localStorage.setItem(INPUT_COUNT_NOW_GAME_NAME, String(countNow + 0.25))
    }
    let allBtnInPage = document.querySelectorAll('input');
    let selectBtn
    if (allBtnInPage && allBtnInPage.length > 0) {
        for (let i = 0; i < allBtnInPage.length; i++) {
            if (allBtnInPage[i].defaultValue === "Принять задание") {
                selectBtn = allBtnInPage[i]
                break
            }
        }
    }
    console.log(selectBtn)
    // TODO Добавить таймер
    if (selectBtn) {
        let randomNumber = GetRandomNumber()
        setTimeout(() => {
            selectBtn.click()
        }, randomNumber * 1000)

    }
    let hourseBtn
    allBtnInPage = document.querySelectorAll('input');
    if (allBtnInPage && allBtnInPage.length > 0) {
        for (let i = 0; i < allBtnInPage.length; i++) {
            console.log(allBtnInPage[i].defaultValue)
            if (allBtnInPage[i].defaultValue === "Отправиться в путь") {
                hourseBtn = allBtnInPage[i]
                break
            }
        }
    }
    if (hourseBtn) {
        hourseBtn.click();


    }
    if (localStorage.getItem(BTN_START_ANY_NAME) === "true") {

    }
    if (localStorage.getItem(BTN_START_ANY_NAME) === "true") {
        let img = 'https://dcdn.heroeswm.ru/i/speed_hunt.png'
        let imgArr = document.querySelectorAll('img')
        let btn
        for (const imgItem of imgArr) {
            if (imgItem.currentSrc === img) {
                btn = imgItem
                break
            }
        }
        let randomNumber = GetRandomNumber()
        console.log(btn)
        btn.click()
        let confirm = document.querySelectorAll('.sa-confirm-button-container')
        console.log('12')
        confirm[0].childNodes[1].click()
    }

    if (selectBtn === undefined && hourseBtn === undefined) {
        console.log('начинаем ожидание перед релоудом')
        setTimeout(() => {
            reload()
        }, 300000)
    }
}

function scriptOff() {
    localStorage.setItem(LOCAL_STORAGE_NAME, "false")
    localStorage.setItem(INPUT_COUNT_GAME_NAME, "false")
    localStorage.setItem(INPUT_COUNT_NOW_GAME_NAME, "false")
    localStorage.setItem(BTN_START_ANY_NAME, "false")
    window.location.reload()
}

(function () {
    console.log('start')

    try {
        if (window.location.href === hrefGI) {


            if (localStorage.getItem(LOCAL_STORAGE_NAME) === "true") {
                const button = document.createElement('button')
                button.id = 'hwm-helper-start-gi'
                let btnStart = document.getElementsByClassName('wbwhite')[0]
                    .getElementsByTagName('td')[0]
                btnStart.appendChild(button)
                button.innerText = 'Выключить скрипт'
                btnStart.addEventListener('click', () => {
                    scriptOff()
                })
                autoGiStart()
            } else {

                const INPUT_COUNT_GAME_NAME = 'hwm-helper-inputCount'
                const BTN_START_ANY_NAME = 'hwm-helper-startAny'
                const button = document.createElement('button')
                const button2 = document.createElement('button')
                const input = document.createElement('input')

                input.placeholder = 'кол-во боев за брюли'
                input.id = INPUT_COUNT_GAME_NAME

                button2.innerText = 'Старт за брюли'
                button2.id = BTN_START_ANY_NAME

                button.id = 'hwm-helper-start-gi'
                button.innerText = 'Начать авто фарм'

                let btnStart = document.getElementsByClassName('wbwhite')[0]
                    .getElementsByTagName('td')[0]
                btnStart.appendChild(button)
                btnStart.appendChild(input)
                btnStart.appendChild(button2)
                button.addEventListener('click', () => {
                    autoGiStart()
                })
                button2.addEventListener('click', () => {
                    localStorage.setItem(BTN_START_ANY_NAME, "true")
                    localStorage.setItem(INPUT_COUNT_NOW_GAME_NAME, 0)
                    localStorage.setItem(INPUT_COUNT_GAME_NAME, document.getElementById('hwm-helper-inputCount').value)
                    autoGiStart()
                })

            }


        }
    } catch (e) {
        console.log(e)
    }
    try {
        if (window.location.href === hrefMap) {
            let count = localStorage.getItem(MAP_COUNT)
            localStorage.setItem(MAP_COUNT, count + 1)
            const autoGiGif = 'https://dcdn.heroeswm.ru/i/btns/HuntBtnGold_Auto.png'
            const allImgMap = document.querySelectorAll('img');
            let autohuntBtn
            let randomNumber2 = GetRandomNumber()
            console.log('ждем поиск кнопки',randomNumber2)
            setTimeout(() => {
                console.log('ищем кнопку')
                if (allImgMap && allImgMap.length > 0) {
                    for (let i = 0; i < allImgMap.length; i++) {
                        if (allImgMap[i].currentSrc === autoGiGif) {
                            autohuntBtn = allImgMap[i]
                            break
                        }
                    }
                }

                console.log('autohuntBtn', autohuntBtn)
                if (autohuntBtn) {
                    console.log('ждем входа в бой')
                    let randomNumber = GetRandomNumber()
                    setTimeout(() => {
                        autohuntBtn.click()
                    }, randomNumber * 1000)
                } else {
                    console.log('ждем релода')
                    let randomNumber = GetRandomNumber()
                    setTimeout(() => {
                        window.reload()
                    }, randomNumber * 1000)
                }
            }, randomNumber2 * 1000)
        }
    } catch (e) {
        console.log(e)
    }
    try {
        if (window.location.href === hrefResult) {
            setTimeout(() => {
                const allinputMap = document.querySelectorAll('input');
                let backToGi
                if (allinputMap && allinputMap.length > 0) {
                    for (let i = 0; i < allinputMap.length; i++) {
                        if (allinputMap[i].defaultValue === "Вернуться в гильдию") {
                            backToGi = allinputMap[i]
                            break
                        }
                        if (allinputMap[i].defaultValue === "К карте") {
                            backToGi = allinputMap[i]
                            break
                        }
                    }
                }
                ;

                if (backToGi) {
                    let randomNumber = GetRandomNumber()
                    setTimeout(() => {
                        backToGi.click()
                    }, randomNumber * 1000)
                }
            }, 5000)


        }
    } catch (e) {
        console.log(e)
    }
})();


