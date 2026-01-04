// ==UserScript==
// @name         автопродажа ресов v2
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description 123
// @author       You
// @match        https://www.heroeswm.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472028/%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0%20%D1%80%D0%B5%D1%81%D0%BE%D0%B2%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/472028/%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B0%20%D1%80%D0%B5%D1%81%D0%BE%D0%B2%20v2.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const DETAILS_URLS = 'hwm-helper-details_url'
    const FACTORIES_URLS = 'hwm-helper-factories_url'
    const REGION_URLS = 'hwm-helper-region_url'

    const RESOURCE_BUY = 'hwm-helper-resource-buy'
    const WORKS_COUNT = 'hwm-helper-works-count'

    if (window.location.href.split('https://www.heroeswm.ru/pl_info.php?id=').length > 1) {
        await userInfoPage()
        return
    }

    if (window.location.href.split('https://www.heroeswm.ru/map.php').length > 1) {
        await mapPage()
        return
    }

    if (window.location.href === 'https://www.heroeswm.ru/undefined') {
        window.location.href = 'https://www.heroeswm.ru/pl_info.php?id=6727991'
    }

    if (window.location.href.split('https://www.heroeswm.ru/object-info.php?id=').length > 1) {
        await factoryPage()
        return
    }

    if (window.location.href === 'https://www.heroeswm.ru/ecostat.php') {
        await ecostatPage()
        return
    }

    if (window.location.href.split('https://www.heroeswm.ru/ecostat_details.php?id').length > 1) {
        await detailsPage()
        return
    }

    setTimeout(() => {
        window.location.href = 'https://www.heroeswm.ru/pl_info.php?id=6727991'
    }, 10000)

    async function userInfoPage() {
        localStorage.removeItem(DETAILS_URLS)
        localStorage.removeItem(REGION_URLS)
        localStorage.removeItem(FACTORIES_URLS)
        localStorage.removeItem(RESOURCE_BUY)
        // todo удалить
        //window.location.href = 'https://www.heroeswm.ru/ecostat.php'
        let resourcesAll = [
            {
                title: "Ртуть",
                count: 0,
            },
            {
                title: "Сера",
                count: 0,
            },
            {
                title: "Кристаллы",
                count: 0,
            },
            {
                title: "Самоцветы",
                count: 0,
            },
            {
                title: "Волшебный порошок",
                count: 0,
            },
            {
                title: "Кожа",
                count: 0,
            },
            {
                title: "Мифрил",
                count: 0,
            },
            {
                title: "Мифриловая руда",
                count: 0,
            },
            {
                title: "Никель",
                count: 0,
            },
            {
                title: "Орихал",
                count: 0,
            },
            {
                title: "Сталь",
                count: 0,
            },
            {
                title: "Обсидиан",
                count: 0,
            }
        ]
        let wbArr = document.getElementsByClassName('wb')
        let tableResources = wbArr[1].querySelectorAll('td')
        let mercury = {
            title: "Ртуть",
            count: Number(tableResources[7].textContent),
        }
        if (mercury.count === 0) {
            localStorage.setItem(RESOURCE_BUY, 'true')
            window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=3'
            return
        }
        let sulfur = {
            title: "Сера",
            count: Number(tableResources[9].textContent),
        }
        if (sulfur.count === 0) {
            localStorage.setItem(RESOURCE_BUY, 'true')
            window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=4'
            return
        }
        let crystals = {
            title: "Кристалы",
            count: Number(tableResources[11].textContent),
        }
        if (crystals.count === 0) {
            localStorage.setItem(RESOURCE_BUY, 'true')
            window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=5'
            return
        }
        let gems = {
            title: "Кристалы",
            count: Number(tableResources[13].textContent),
        }
        if (gems.count === 0) {
            localStorage.setItem(RESOURCE_BUY, 'true')
            window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=6'
            return
        }

        let resourcesUser = [{
            title: "Волшебный порошок",
            count: 0,
        },
            {
                title: "Кожа",
                count: 0,
            },
            {
                title: "Мифрил",
                count: 0,
            },
            {
                title: "Мифриловая руда",
                count: 0,
            },
            {
                title: "Никель",
                count: 0,
            },
            {
                title: "Обсидиан",
                count: 0,
            },
            {
                title: "Орихалк",
                count: 0,
            },
            {
                title: "Сталь",
                count: 0,
            }]
        wbArr = document.getElementsByClassName('wb')
        let tableResourcesFull;
        let checkWbLength = false;
        if (wbArr.length === 23) {
            checkWbLength = true
            tableResourcesFull = wbArr[14].childNodes
        }
        if (wbArr.length === 22) {
            checkWbLength = true
            tableResourcesFull = wbArr[13].childNodes
        }
        if (!checkWbLength) {
            alert('error')
            return
        }


        let resourcesFullTextArr = [];
        let text = '';
        for (const item of tableResourcesFull) {
            text += item.textContent
            if (item.localName === 'br') {
                if (text !== '')
                    resourcesFullTextArr.push(text.trim())
                text = '';
            }
        }

        for (const text of resourcesFullTextArr) {
            let textResources = text.split(':')[0];
            resourcesUser.find(el => {
                if (el.title === textResources) {
                    el.count = text.split(':')[1].trim()
                }
            })
        }
        let resourcesCheck = resourcesUser.find(el => {
            if (el.count === 0) {
                return el
            }
        })
        if (resourcesCheck) {
            console.log(resourcesUser)
            if (resourcesCheck.title === 'Волшебный порошок') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=11'
            }
            if (resourcesCheck.title === 'Мифрил') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=55'
            }
            if (resourcesCheck.title === 'Кожа') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=8'
            }
            if (resourcesCheck.title === 'Мифриловая руда') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=77'
            }
            if (resourcesCheck.title === 'Обсидиан') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=80'
            }
            if (resourcesCheck.title === 'Никель') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=10'
            }
            if (resourcesCheck.title === 'Орихалк') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=81'
            }
            if (resourcesCheck.title === 'Сталь') {
                localStorage.setItem(RESOURCE_BUY, 'true')
                window.location.href = 'https://www.heroeswm.ru/ecostat_details.php?id=9'
            }
        } else {
            window.location.href = 'https://www.heroeswm.ru/ecostat.php'

        }


    }

    async function mapPage() {
        setTimeout(() => {
            if (document.childNodes[1].childNodes[0].baseURI !== 'https://www.heroeswm.ru/map.php') {
                setTimeout(() => {
                    localStorage.setItem(REGION_URLS, document.childNodes[1].childNodes[0].baseURI)
                    document.getElementById('dbut0').click()
                }, 1000)
                return
            } else {
                if (document.getElementById('hwm_map_objects_and_buttons')) {
                    let url = JSON.parse(localStorage.getItem(FACTORIES_URLS))
                    setTimeout(() => {
                        window.location.href = url[0]
                    }, 1000)
                    return;
                }
            }
        }, 1000)

    }

    function workCount() {
        let count = localStorage.getItem(WORKS_COUNT)
        if (count) {
            count = Number(count)
            count += 1
            localStorage.setItem(WORKS_COUNT, count)
        } else {
            localStorage.setItem(WORKS_COUNT, 1)
        }
        return
    }

    function done(myImage, context) {
        myCanvas.width = myImage.width;
        myCanvas.height = myImage.height;
        context.drawImage(myImage, 0, 0);
        console.log(myCanvas.toDataURL());

        let formData = new FormData()
        formData.append('method', 'base64')
        formData.append('key', "676ec1a756127c74ec917e59d4c8a7b8")
        formData.append('body', myCanvas.toDataURL())
        formData.append('header_acao', '1')
        console.log(formData)
        let test = fetch('https://rucaptcha.com/in.php', {
            method: 'POST',
            body: formData
        }).then(el => {
            return el.text()
        }).then(el => {
            return el.split('|')[1]
        }).then(el => {
            setTimeout(function () {
                fetch(`https://rucaptcha.com/res.php?key=676ec1a756127c74ec917e59d4c8a7b8&action=get&id=${el}&header_acao=1`).then(el => {
                    return el.text()
                }).then(el => {
                    // workCount()
                    let input = document.getElementsByClassName('getjob_capchaInput')[0]
                    input.focus()
                    let data = el.split('|')[1]
                    input.value = el.split('|')[1]
                    work_code_data_c = 128
                    work_code_data = {
                        "0": {
                            "type": "mousemove",
                            "time2": 2176,
                            "cX": 875,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3034
                        },
                        "1": {
                            "type": "mousemove",
                            "time2": 2177,
                            "cX": 875,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3034
                        },
                        "2": {
                            "type": "mousemove",
                            "time2": 2182,
                            "cX": 826,
                            "cY": 310,
                            "mX": -61,
                            "mY": -12,
                            "code": "",
                            "time": 3042
                        },
                        "3": {
                            "type": "mousemove",
                            "time2": 2189,
                            "cX": 774,
                            "cY": 301,
                            "mX": -65,
                            "mY": -11,
                            "code": "",
                            "time": 3049
                        },
                        "4": {
                            "type": "mousemove",
                            "time2": 2197,
                            "cX": 727,
                            "cY": 291,
                            "mX": -59,
                            "mY": -13,
                            "code": "",
                            "time": 3057
                        },
                        "5": {
                            "type": "mousemove",
                            "time2": 2205,
                            "cX": 688,
                            "cY": 287,
                            "mX": -49,
                            "mY": -5,
                            "code": "",
                            "time": 3064
                        },
                        "6": {
                            "type": "mousemove",
                            "time2": 2215,
                            "cX": 661,
                            "cY": 285,
                            "mX": -33,
                            "mY": -2,
                            "code": "",
                            "time": 3072
                        },
                        "7": {
                            "type": "mousemove",
                            "time2": 2220,
                            "cX": 639,
                            "cY": 284,
                            "mX": -28,
                            "mY": -1,
                            "code": "",
                            "time": 3079
                        },
                        "8": {
                            "type": "mousemove",
                            "time2": 2227,
                            "cX": 618,
                            "cY": 285,
                            "mX": -26,
                            "mY": 1,
                            "code": "",
                            "time": 3087
                        },
                        "9": {
                            "type": "mousemove",
                            "time2": 2236,
                            "cX": 604,
                            "cY": 286,
                            "mX": -17,
                            "mY": 1,
                            "code": "",
                            "time": 3094
                        },
                        "10": {
                            "type": "mousemove",
                            "time2": 2242,
                            "cX": 593,
                            "cY": 287,
                            "mX": -14,
                            "mY": 1,
                            "code": "",
                            "time": 3102
                        },
                        "11": {
                            "type": "mousemove",
                            "time2": 2249,
                            "cX": 583,
                            "cY": 288,
                            "mX": -13,
                            "mY": 1,
                            "code": "",
                            "time": 3109
                        },
                        "12": {
                            "type": "mousemove",
                            "time2": 2257,
                            "cX": 574,
                            "cY": 288,
                            "mX": -11,
                            "mY": 1,
                            "code": "",
                            "time": 3117
                        },
                        "13": {
                            "type": "mousemove",
                            "time2": 2266,
                            "cX": 566,
                            "cY": 289,
                            "mX": -10,
                            "mY": 1,
                            "code": "",
                            "time": 3125
                        },
                        "14": {
                            "type": "mousemove",
                            "time2": 2273,
                            "cX": 556,
                            "cY": 290,
                            "mX": -12,
                            "mY": 1,
                            "code": "",
                            "time": 3132
                        },
                        "15": {
                            "type": "mousemove",
                            "time2": 2280,
                            "cX": 545,
                            "cY": 290,
                            "mX": -14,
                            "mY": 0,
                            "code": "",
                            "time": 3140
                        },
                        "16": {
                            "type": "mousemove",
                            "time2": 2288,
                            "cX": 537,
                            "cY": 291,
                            "mX": -10,
                            "mY": 1,
                            "code": "",
                            "time": 3147
                        },
                        "17": {
                            "type": "mousemove",
                            "time2": 2295,
                            "cX": 531,
                            "cY": 290,
                            "mX": -8,
                            "mY": -1,
                            "code": "",
                            "time": 3155
                        },
                        "18": {
                            "type": "mousemove",
                            "time2": 2303,
                            "cX": 525,
                            "cY": 289,
                            "mX": -7,
                            "mY": -1,
                            "code": "",
                            "time": 3163
                        },
                        "19": {
                            "type": "mousemove",
                            "time2": 2312,
                            "cX": 521,
                            "cY": 288,
                            "mX": -5,
                            "mY": -1,
                            "code": "",
                            "time": 3170
                        },
                        "20": {
                            "type": "mousemove",
                            "time2": 2318,
                            "cX": 518,
                            "cY": 288,
                            "mX": -4,
                            "mY": -1,
                            "code": "",
                            "time": 3178
                        },
                        "21": {
                            "type": "mousemove",
                            "time2": 2325,
                            "cX": 516,
                            "cY": 287,
                            "mX": -2,
                            "mY": -1,
                            "code": "",
                            "time": 3185
                        },
                        "22": {
                            "type": "mousemove",
                            "time2": 2333,
                            "cX": 515,
                            "cY": 287,
                            "mX": -2,
                            "mY": 0,
                            "code": "",
                            "time": 3193
                        },
                        "23": {
                            "type": "mousemove",
                            "time2": 2341,
                            "cX": 514,
                            "cY": 286,
                            "mX": -1,
                            "mY": -1,
                            "code": "",
                            "time": 3200
                        },
                        "24": {
                            "type": "mousemove",
                            "time2": 2348,
                            "cX": 513,
                            "cY": 286,
                            "mX": -1,
                            "mY": 0,
                            "code": "",
                            "time": 3208
                        },
                        "25": {
                            "type": "mousemove",
                            "time2": 2355,
                            "cX": 513,
                            "cY": 286,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3215
                        },
                        "26": {
                            "type": "mousemove",
                            "time2": 2363,
                            "cX": 512,
                            "cY": 286,
                            "mX": -1,
                            "mY": 0,
                            "code": "",
                            "time": 3223
                        },
                        "27": {
                            "type": "mousemove",
                            "time2": 2371,
                            "cX": 512,
                            "cY": 286,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3231
                        },
                        "28": {
                            "type": "mousemove",
                            "time2": 2438,
                            "cX": 512,
                            "cY": 286,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3299
                        },
                        "29": {
                            "type": "mousemove",
                            "time2": 2499,
                            "cX": 512,
                            "cY": 286,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3359
                        },
                        "30": {
                            "type": "mousemove",
                            "time2": 2506,
                            "cX": 512,
                            "cY": 286,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3366
                        },
                        "31": {
                            "type": "mousemove",
                            "time2": 2514,
                            "cX": 512,
                            "cY": 287,
                            "mX": 0,
                            "mY": 1,
                            "code": "",
                            "time": 3374
                        },
                        "32": {
                            "type": "mousemove",
                            "time2": 2521,
                            "cX": 513,
                            "cY": 287,
                            "mX": 1,
                            "mY": 0,
                            "code": "",
                            "time": 3381
                        },
                        "33": {
                            "type": "mousemove",
                            "time2": 2529,
                            "cX": 513,
                            "cY": 288,
                            "mX": 0,
                            "mY": 1,
                            "code": "",
                            "time": 3389
                        },
                        "34": {
                            "type": "mousemove",
                            "time2": 2536,
                            "cX": 513,
                            "cY": 288,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3397
                        },
                        "35": {
                            "type": "mousemove",
                            "time2": 2545,
                            "cX": 514,
                            "cY": 288,
                            "mX": 1,
                            "mY": 1,
                            "code": "",
                            "time": 3404
                        },
                        "36": {
                            "type": "mousemove",
                            "time2": 2553,
                            "cX": 515,
                            "cY": 289,
                            "mX": 1,
                            "mY": 1,
                            "code": "",
                            "time": 3411
                        },
                        "37": {
                            "type": "mousemove",
                            "time2": 2559,
                            "cX": 516,
                            "cY": 290,
                            "mX": 1,
                            "mY": 1,
                            "code": "",
                            "time": 3419
                        },
                        "38": {
                            "type": "mousemove",
                            "time2": 2567,
                            "cX": 516,
                            "cY": 292,
                            "mX": 1,
                            "mY": 2,
                            "code": "",
                            "time": 3426
                        },
                        "39": {
                            "type": "mousemove",
                            "time2": 2574,
                            "cX": 518,
                            "cY": 294,
                            "mX": 2,
                            "mY": 3,
                            "code": "",
                            "time": 3434
                        },
                        "40": {
                            "type": "mousemove",
                            "time2": 2582,
                            "cX": 520,
                            "cY": 296,
                            "mX": 2,
                            "mY": 2,
                            "code": "",
                            "time": 3442
                        },
                        "41": {
                            "type": "mousemove",
                            "time2": 2589,
                            "cX": 520,
                            "cY": 296,
                            "mX": 1,
                            "mY": 1,
                            "code": "",
                            "time": 3449
                        },
                        "42": {
                            "type": "mousemove",
                            "time2": 2597,
                            "cX": 521,
                            "cY": 298,
                            "mX": 1,
                            "mY": 2,
                            "code": "",
                            "time": 3457
                        },
                        "43": {
                            "type": "mousemove",
                            "time2": 2604,
                            "cX": 521,
                            "cY": 299,
                            "mX": 0,
                            "mY": 1,
                            "code": "",
                            "time": 3464
                        },
                        "44": {
                            "type": "mousemove",
                            "time2": 2613,
                            "cX": 522,
                            "cY": 299,
                            "mX": 1,
                            "mY": 0,
                            "code": "",
                            "time": 3472
                        },
                        "45": {
                            "type": "mousemove",
                            "time2": 2619,
                            "cX": 522,
                            "cY": 300,
                            "mX": 0,
                            "mY": 1,
                            "code": "",
                            "time": 3479
                        },
                        "46": {
                            "type": "mousemove",
                            "time2": 2626,
                            "cX": 522,
                            "cY": 300,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3487
                        },
                        "47": {
                            "type": "mousemove",
                            "time2": 2635,
                            "cX": 523,
                            "cY": 300,
                            "mX": 1,
                            "mY": 1,
                            "code": "",
                            "time": 3494
                        },
                        "48": {
                            "type": "mousemove",
                            "time2": 2642,
                            "cX": 523,
                            "cY": 300,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3502
                        },
                        "49": {
                            "type": "mousedown",
                            "time2": 2750,
                            "cX": 523,
                            "cY": 300,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3608
                        },
                        "50": {
                            "type": "mousedown",
                            "time2": 2750,
                            "cX": 523,
                            "cY": 300,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3608
                        },
                        "51": {
                            "type": "mouseup",
                            "time2": 2888,
                            "cX": 523,
                            "cY": 300,
                            "mX": 0,
                            "mY": 0,
                            "code": "",
                            "time": 3744
                        },
                        "52": {
                            "type": "keydown",
                            "time2": 3915,
                            "code": "",
                            "keyCode": 57,
                            "time": 4775
                        },
                        "53": {
                            "type": "input",
                            "time2": 3919,
                            "code": "9",
                            "time": 4780
                        },
                        "54": {
                            "type": "keyup",
                            "time2": 4051,
                            "code": "9",
                            "time": 4911
                        },
                        "55": {
                            "type": "keydown",
                            "time2": 4123,
                            "code": "9",
                            "keyCode": 65,
                            "time": 4983
                        },
                        "56": {
                            "type": "input",
                            "time2": 4124,
                            "code": "9a",
                            "time": 4986
                        },
                        "57": {
                            "type": "keyup",
                            "time2": 4228,
                            "code": "9a",
                            "time": 5089
                        },
                        "58": {
                            "type": "mousemove",
                            "time2": 4528,
                            "cX": 532,
                            "cY": 299,
                            "mX": 12,
                            "mY": -2,
                            "code": "9a",
                            "time": 5388
                        },
                        "59": {
                            "type": "mousemove",
                            "time2": 4535,
                            "cX": 553,
                            "cY": 294,
                            "mX": 26,
                            "mY": -6,
                            "code": "9a",
                            "time": 5395
                        },
                        "60": {
                            "type": "mousemove",
                            "time2": 4543,
                            "cX": 578,
                            "cY": 288,
                            "mX": 31,
                            "mY": -7,
                            "code": "9a",
                            "time": 5403
                        },
                        "61": {
                            "type": "mousemove",
                            "time2": 4550,
                            "cX": 608,
                            "cY": 281,
                            "mX": 38,
                            "mY": -9,
                            "code": "9a",
                            "time": 5410
                        },
                        "62": {
                            "type": "mousemove",
                            "time2": 4558,
                            "cX": 639,
                            "cY": 275,
                            "mX": 38,
                            "mY": -8,
                            "code": "9a",
                            "time": 5418
                        },
                        "63": {
                            "type": "mousemove",
                            "time2": 4566,
                            "cX": 675,
                            "cY": 268,
                            "mX": 45,
                            "mY": -8,
                            "code": "9a",
                            "time": 5425
                        },
                        "64": {
                            "type": "mousemove",
                            "time2": 4573,
                            "cX": 714,
                            "cY": 264,
                            "mX": 49,
                            "mY": -6,
                            "code": "9a",
                            "time": 5433
                        },
                        "65": {
                            "type": "mousemove",
                            "time2": 4581,
                            "cX": 750,
                            "cY": 258,
                            "mX": 45,
                            "mY": -7,
                            "code": "9a",
                            "time": 5441
                        },
                        "66": {
                            "type": "mousemove",
                            "time2": 4588,
                            "cX": 788,
                            "cY": 254,
                            "mX": 48,
                            "mY": -5,
                            "code": "9a",
                            "time": 5448
                        },
                        "67": {
                            "type": "mousemove",
                            "time2": 4596,
                            "cX": 836,
                            "cY": 248,
                            "mX": 59,
                            "mY": -8,
                            "code": "9a",
                            "time": 5456
                        },
                        "68": {
                            "type": "mousemove",
                            "time2": 4603,
                            "cX": 883,
                            "cY": 242,
                            "mX": 59,
                            "mY": -7,
                            "code": "9a",
                            "time": 5463
                        },
                        "69": {
                            "type": "mousemove",
                            "time2": 64496,
                            "cX": 897,
                            "cY": 244,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65355
                        },
                        "70": {
                            "type": "mousemove",
                            "time2": 64496,
                            "cX": 897,
                            "cY": 244,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65355
                        },
                        "71": {
                            "type": "mousemove",
                            "time2": 64503,
                            "cX": 885,
                            "cY": 247,
                            "mX": -15,
                            "mY": 3,
                            "code": "9a",
                            "time": 65362
                        },
                        "72": {
                            "type": "mousemove",
                            "time2": 64511,
                            "cX": 873,
                            "cY": 251,
                            "mX": -15,
                            "mY": 5,
                            "code": "9a",
                            "time": 65370
                        },
                        "73": {
                            "type": "mousemove",
                            "time2": 64517,
                            "cX": 860,
                            "cY": 255,
                            "mX": -16,
                            "mY": 5,
                            "code": "9a",
                            "time": 65377
                        },
                        "74": {
                            "type": "mousemove",
                            "time2": 64525,
                            "cX": 847,
                            "cY": 260,
                            "mX": -17,
                            "mY": 7,
                            "code": "9a",
                            "time": 65385
                        },
                        "75": {
                            "type": "mousemove",
                            "time2": 64533,
                            "cX": 835,
                            "cY": 267,
                            "mX": -15,
                            "mY": 8,
                            "code": "9a",
                            "time": 65393
                        },
                        "76": {
                            "type": "mousemove",
                            "time2": 64540,
                            "cX": 823,
                            "cY": 273,
                            "mX": -15,
                            "mY": 8,
                            "code": "9a",
                            "time": 65400
                        },
                        "77": {
                            "type": "mousemove",
                            "time2": 64547,
                            "cX": 812,
                            "cY": 280,
                            "mX": -13,
                            "mY": 9,
                            "code": "9a",
                            "time": 65407
                        },
                        "78": {
                            "type": "mousemove",
                            "time2": 64555,
                            "cX": 803,
                            "cY": 287,
                            "mX": -12,
                            "mY": 8,
                            "code": "9a",
                            "time": 65415
                        },
                        "79": {
                            "type": "mousemove",
                            "time2": 64563,
                            "cX": 795,
                            "cY": 292,
                            "mX": -10,
                            "mY": 7,
                            "code": "9a",
                            "time": 65423
                        },
                        "80": {
                            "type": "mousemove",
                            "time2": 64572,
                            "cX": 788,
                            "cY": 297,
                            "mX": -8,
                            "mY": 6,
                            "code": "9a",
                            "time": 65430
                        },
                        "81": {
                            "type": "mousemove",
                            "time2": 64579,
                            "cX": 782,
                            "cY": 301,
                            "mX": -8,
                            "mY": 5,
                            "code": "9a",
                            "time": 65438
                        },
                        "82": {
                            "type": "mousemove",
                            "time2": 64585,
                            "cX": 776,
                            "cY": 305,
                            "mX": -8,
                            "mY": 5,
                            "code": "9a",
                            "time": 65445
                        },
                        "83": {
                            "type": "mousemove",
                            "time2": 64593,
                            "cX": 769,
                            "cY": 308,
                            "mX": -8,
                            "mY": 4,
                            "code": "9a",
                            "time": 65453
                        },
                        "84": {
                            "type": "mousemove",
                            "time2": 64601,
                            "cX": 763,
                            "cY": 312,
                            "mX": -8,
                            "mY": 4,
                            "code": "9a",
                            "time": 65460
                        },
                        "85": {
                            "type": "mousemove",
                            "time2": 64608,
                            "cX": 758,
                            "cY": 313,
                            "mX": -6,
                            "mY": 2,
                            "code": "9a",
                            "time": 65468
                        },
                        "86": {
                            "type": "mousemove",
                            "time2": 64616,
                            "cX": 754,
                            "cY": 314,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65476
                        },
                        "87": {
                            "type": "mousemove",
                            "time2": 64624,
                            "cX": 750,
                            "cY": 315,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65483
                        },
                        "88": {
                            "type": "mousemove",
                            "time2": 64633,
                            "cX": 747,
                            "cY": 314,
                            "mX": -4,
                            "mY": -1,
                            "code": "9a",
                            "time": 65491
                        },
                        "89": {
                            "type": "mousemove",
                            "time2": 64640,
                            "cX": 743,
                            "cY": 314,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65498
                        },
                        "90": {
                            "type": "mousemove",
                            "time2": 64647,
                            "cX": 740,
                            "cY": 313,
                            "mX": -4,
                            "mY": -1,
                            "code": "9a",
                            "time": 65506
                        },
                        "91": {
                            "type": "mousemove",
                            "time2": 64653,
                            "cX": 736,
                            "cY": 313,
                            "mX": -4,
                            "mY": 0,
                            "code": "9a",
                            "time": 65513
                        },
                        "92": {
                            "type": "mousemove",
                            "time2": 64661,
                            "cX": 732,
                            "cY": 313,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65521
                        },
                        "93": {
                            "type": "mousemove",
                            "time2": 64669,
                            "cX": 728,
                            "cY": 312,
                            "mX": -6,
                            "mY": -1,
                            "code": "9a",
                            "time": 65529
                        },
                        "94": {
                            "type": "mousemove",
                            "time2": 64676,
                            "cX": 724,
                            "cY": 312,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65536
                        },
                        "95": {
                            "type": "mousemove",
                            "time2": 64684,
                            "cX": 720,
                            "cY": 312,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65544
                        },
                        "96": {
                            "type": "mousemove",
                            "time2": 64691,
                            "cX": 716,
                            "cY": 312,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65551
                        },
                        "97": {
                            "type": "mousemove",
                            "time2": 64699,
                            "cX": 712,
                            "cY": 312,
                            "mX": -4,
                            "mY": 0,
                            "code": "9a",
                            "time": 65559
                        },
                        "98": {
                            "type": "mousemove",
                            "time2": 64707,
                            "cX": 708,
                            "cY": 312,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65566
                        },
                        "99": {
                            "type": "mousemove",
                            "time2": 64714,
                            "cX": 704,
                            "cY": 312,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65574
                        },
                        "100": {
                            "type": "mousemove",
                            "time2": 64723,
                            "cX": 700,
                            "cY": 313,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65581
                        },
                        "101": {
                            "type": "mousemove",
                            "time2": 64731,
                            "cX": 696,
                            "cY": 315,
                            "mX": -6,
                            "mY": 2,
                            "code": "9a",
                            "time": 65589
                        },
                        "102": {
                            "type": "mousemove",
                            "time2": 64739,
                            "cX": 692,
                            "cY": 316,
                            "mX": -5,
                            "mY": 2,
                            "code": "9a",
                            "time": 65597
                        },
                        "103": {
                            "type": "mousemove",
                            "time2": 64745,
                            "cX": 688,
                            "cY": 317,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65604
                        },
                        "104": {
                            "type": "mousemove",
                            "time2": 64752,
                            "cX": 684,
                            "cY": 319,
                            "mX": -5,
                            "mY": 2,
                            "code": "9a",
                            "time": 65612
                        },
                        "105": {
                            "type": "mousemove",
                            "time2": 64759,
                            "cX": 680,
                            "cY": 320,
                            "mX": -4,
                            "mY": 1,
                            "code": "9a",
                            "time": 65619
                        },
                        "106": {
                            "type": "mousemove",
                            "time2": 64767,
                            "cX": 676,
                            "cY": 320,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65627
                        },
                        "107": {
                            "type": "mousemove",
                            "time2": 64775,
                            "cX": 673,
                            "cY": 321,
                            "mX": -4,
                            "mY": 1,
                            "code": "9a",
                            "time": 65634
                        },
                        "108": {
                            "type": "mousemove",
                            "time2": 64782,
                            "cX": 669,
                            "cY": 322,
                            "mX": -5,
                            "mY": 1,
                            "code": "9a",
                            "time": 65642
                        },
                        "109": {
                            "type": "mousemove",
                            "time2": 64789,
                            "cX": 666,
                            "cY": 322,
                            "mX": -4,
                            "mY": 0,
                            "code": "9a",
                            "time": 65649
                        },
                        "110": {
                            "type": "mousemove",
                            "time2": 64797,
                            "cX": 662,
                            "cY": 322,
                            "mX": -5,
                            "mY": 0,
                            "code": "9a",
                            "time": 65657
                        },
                        "111": {
                            "type": "mousemove",
                            "time2": 64805,
                            "cX": 660,
                            "cY": 322,
                            "mX": -3,
                            "mY": 0,
                            "code": "9a",
                            "time": 65664
                        },
                        "112": {
                            "type": "mousemove",
                            "time2": 64812,
                            "cX": 656,
                            "cY": 322,
                            "mX": -4,
                            "mY": 0,
                            "code": "9a",
                            "time": 65672
                        },
                        "113": {
                            "type": "mousemove",
                            "time2": 64821,
                            "cX": 655,
                            "cY": 321,
                            "mX": -2,
                            "mY": -1,
                            "code": "9a",
                            "time": 65680
                        },
                        "114": {
                            "type": "mousemove",
                            "time2": 64829,
                            "cX": 652,
                            "cY": 321,
                            "mX": -3,
                            "mY": 0,
                            "code": "9a",
                            "time": 65687
                        },
                        "115": {
                            "type": "mousemove",
                            "time2": 64835,
                            "cX": 651,
                            "cY": 320,
                            "mX": -2,
                            "mY": -1,
                            "code": "9a",
                            "time": 65695
                        },
                        "116": {
                            "type": "mousemove",
                            "time2": 64842,
                            "cX": 650,
                            "cY": 320,
                            "mX": -1,
                            "mY": 0,
                            "code": "9a",
                            "time": 65702
                        },
                        "117": {
                            "type": "mousemove",
                            "time2": 64850,
                            "cX": 649,
                            "cY": 320,
                            "mX": -1,
                            "mY": 0,
                            "code": "9a",
                            "time": 65710
                        },
                        "118": {
                            "type": "mousemove",
                            "time2": 64857,
                            "cX": 648,
                            "cY": 320,
                            "mX": -1,
                            "mY": -1,
                            "code": "9a",
                            "time": 65717
                        },
                        "119": {
                            "type": "mousemove",
                            "time2": 64866,
                            "cX": 648,
                            "cY": 320,
                            "mX": -1,
                            "mY": 0,
                            "code": "9a",
                            "time": 65725
                        },
                        "120": {
                            "type": "mousemove",
                            "time2": 64887,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65747
                        },
                        "121": {
                            "type": "mousemove",
                            "time2": 64895,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65755
                        },
                        "122": {
                            "type": "mousemove",
                            "time2": 64963,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65823
                        },
                        "123": {
                            "type": "mousedown",
                            "time2": 64985,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65838
                        },
                        "124": {
                            "type": "mousedown",
                            "time2": 64986,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65838
                        },
                        "125": {
                            "type": "mouseup",
                            "time2": 65130,
                            "cX": 648,
                            "cY": 320,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a",
                            "time": 65989
                        },
                        "126": {
                            "type": "keydown",
                            "time2": 66400,
                            "code": "9a",
                            "keyCode": 50,
                            "time": 67260
                        },
                        "127": {
                            "type": "input",
                            "time2": 66402,
                            "code": "9a2",
                            "time": 67263
                        },
                        "128": {
                            "type": "keyup",
                            "time2": 66534,
                            "code": "9a2",
                            "time": 67393
                        },
                        "129": {
                            "type": "keydown",
                            "time2": 66915,
                            "code": "9a2",
                            "keyCode": 90,
                            "time": 67775
                        },
                        "130": {
                            "type": "input",
                            "time2": 66916,
                            "code": "9a2z",
                            "time": 67778
                        },
                        "131": {
                            "type": "keyup",
                            "time2": 67036,
                            "code": "9a2z",
                            "time": 67896
                        },
                        "132": {
                            "type": "keydown",
                            "time2": 67648,
                            "code": "9a2z",
                            "keyCode": 89,
                            "time": 68508
                        },
                        "133": {
                            "type": "input",
                            "time2": 67650,
                            "code": "9a2zy",
                            "time": 68511
                        },
                        "134": {
                            "type": "keyup",
                            "time2": 67744,
                            "code": "9a2zy",
                            "time": 68604
                        },
                        "135": {
                            "type": "keydown",
                            "time2": 67765,
                            "code": "9a2zy",
                            "keyCode": 88,
                            "time": 68625
                        },
                        "136": {
                            "type": "input",
                            "time2": 67767,
                            "code": "9a2zyx",
                            "time": 68628
                        },
                        "137": {
                            "type": "keyup",
                            "time2": 67889,
                            "code": "9a2zyx",
                            "time": 68749
                        },
                        "138": {
                            "type": "mousemove",
                            "time2": 68266,
                            "cX": 665,
                            "cY": 319,
                            "mX": 22,
                            "mY": -1,
                            "code": "9a2zyx",
                            "time": 69126
                        },
                        "139": {
                            "type": "mousemove",
                            "time2": 68273,
                            "cX": 683,
                            "cY": 319,
                            "mX": 22,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 69133
                        },
                        "140": {
                            "type": "mousemove",
                            "time2": 68281,
                            "cX": 711,
                            "cY": 320,
                            "mX": 35,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69141
                        },
                        "141": {
                            "type": "mousemove",
                            "time2": 68290,
                            "cX": 735,
                            "cY": 320,
                            "mX": 30,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69148
                        },
                        "142": {
                            "type": "mousemove",
                            "time2": 68298,
                            "cX": 759,
                            "cY": 323,
                            "mX": 30,
                            "mY": 3,
                            "code": "9a2zyx",
                            "time": 69156
                        },
                        "143": {
                            "type": "mousemove",
                            "time2": 68308,
                            "cX": 780,
                            "cY": 325,
                            "mX": 26,
                            "mY": 3,
                            "code": "9a2zyx",
                            "time": 69164
                        },
                        "144": {
                            "type": "mousemove",
                            "time2": 68312,
                            "cX": 795,
                            "cY": 328,
                            "mX": 19,
                            "mY": 3,
                            "code": "9a2zyx",
                            "time": 69171
                        },
                        "145": {
                            "type": "mousemove",
                            "time2": 68319,
                            "cX": 805,
                            "cY": 330,
                            "mX": 13,
                            "mY": 3,
                            "code": "9a2zyx",
                            "time": 69179
                        },
                        "146": {
                            "type": "mousemove",
                            "time2": 68326,
                            "cX": 812,
                            "cY": 332,
                            "mX": 9,
                            "mY": 2,
                            "code": "9a2zyx",
                            "time": 69186
                        },
                        "147": {
                            "type": "mousemove",
                            "time2": 68334,
                            "cX": 819,
                            "cY": 333,
                            "mX": 8,
                            "mY": 2,
                            "code": "9a2zyx",
                            "time": 69194
                        },
                        "148": {
                            "type": "mousemove",
                            "time2": 68342,
                            "cX": 824,
                            "cY": 335,
                            "mX": 7,
                            "mY": 2,
                            "code": "9a2zyx",
                            "time": 69201
                        },
                        "149": {
                            "type": "mousemove",
                            "time2": 68349,
                            "cX": 828,
                            "cY": 336,
                            "mX": 4,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69209
                        },
                        "150": {
                            "type": "mousemove",
                            "time2": 68357,
                            "cX": 830,
                            "cY": 336,
                            "mX": 3,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69216
                        },
                        "151": {
                            "type": "mousemove",
                            "time2": 68365,
                            "cX": 831,
                            "cY": 337,
                            "mX": 1,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69224
                        },
                        "152": {
                            "type": "mousemove",
                            "time2": 68373,
                            "cX": 832,
                            "cY": 337,
                            "mX": 1,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 69232
                        },
                        "153": {
                            "type": "mousemove",
                            "time2": 68379,
                            "cX": 832,
                            "cY": 337,
                            "mX": 1,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 69239
                        },
                        "154": {
                            "type": "mousemove",
                            "time2": 68394,
                            "cX": 832,
                            "cY": 337,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 69254
                        },
                        "155": {
                            "type": "mousemove",
                            "time2": 68402,
                            "cX": 832,
                            "cY": 336,
                            "mX": -1,
                            "mY": -1,
                            "code": "9a2zyx",
                            "time": 69262
                        },
                        "156": {
                            "type": "mousemove",
                            "time2": 68424,
                            "cX": 831,
                            "cY": 336,
                            "mX": -1,
                            "mY": -1,
                            "code": "9a2zyx",
                            "time": 69284
                        },
                        "157": {
                            "type": "mousemove",
                            "time2": 68431,
                            "cX": 829,
                            "cY": 333,
                            "mX": -2,
                            "mY": -3,
                            "code": "9a2zyx",
                            "time": 69291
                        },
                        "158": {
                            "type": "mousemove",
                            "time2": 68440,
                            "cX": 828,
                            "cY": 331,
                            "mX": -2,
                            "mY": -3,
                            "code": "9a2zyx",
                            "time": 69299
                        },
                        "159": {
                            "type": "mousemove",
                            "time2": 68447,
                            "cX": 826,
                            "cY": 328,
                            "mX": -2,
                            "mY": -4,
                            "code": "9a2zyx",
                            "time": 69307
                        },
                        "160": {
                            "type": "mousemove",
                            "time2": 68454,
                            "cX": 825,
                            "cY": 323,
                            "mX": -1,
                            "mY": -6,
                            "code": "9a2zyx",
                            "time": 69314
                        },
                        "161": {
                            "type": "mousemove",
                            "time2": 68462,
                            "cX": 825,
                            "cY": 318,
                            "mX": 0,
                            "mY": -6,
                            "code": "9a2zyx",
                            "time": 69322
                        },
                        "162": {
                            "type": "mousemove",
                            "time2": 68471,
                            "cX": 826,
                            "cY": 313,
                            "mX": 1,
                            "mY": -6,
                            "code": "9a2zyx",
                            "time": 69329
                        },
                        "163": {
                            "type": "mousemove",
                            "time2": 68478,
                            "cX": 828,
                            "cY": 309,
                            "mX": 3,
                            "mY": -5,
                            "code": "9a2zyx",
                            "time": 69337
                        },
                        "164": {
                            "type": "mousemove",
                            "time2": 68485,
                            "cX": 832,
                            "cY": 306,
                            "mX": 4,
                            "mY": -4,
                            "code": "9a2zyx",
                            "time": 69345
                        },
                        "165": {
                            "type": "mousemove",
                            "time2": 68492,
                            "cX": 833,
                            "cY": 304,
                            "mX": 2,
                            "mY": -2,
                            "code": "9a2zyx",
                            "time": 69352
                        },
                        "166": {
                            "type": "mousemove",
                            "time2": 68500,
                            "cX": 836,
                            "cY": 302,
                            "mX": 4,
                            "mY": -3,
                            "code": "9a2zyx",
                            "time": 69359
                        },
                        "167": {
                            "type": "mousemove",
                            "time2": 68507,
                            "cX": 841,
                            "cY": 300,
                            "mX": 6,
                            "mY": -2,
                            "code": "9a2zyx",
                            "time": 69367
                        },
                        "168": {
                            "type": "mousemove",
                            "time2": 68515,
                            "cX": 846,
                            "cY": 299,
                            "mX": 6,
                            "mY": -2,
                            "code": "9a2zyx",
                            "time": 69374
                        },
                        "169": {
                            "type": "mousemove",
                            "time2": 68522,
                            "cX": 853,
                            "cY": 298,
                            "mX": 9,
                            "mY": -1,
                            "code": "9a2zyx",
                            "time": 69382
                        },
                        "170": {
                            "type": "mousemove",
                            "time2": 68531,
                            "cX": 862,
                            "cY": 298,
                            "mX": 11,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 69390
                        },
                        "171": {
                            "type": "mousemove",
                            "time2": 68539,
                            "cX": 874,
                            "cY": 300,
                            "mX": 15,
                            "mY": 2,
                            "code": "9a2zyx",
                            "time": 69397
                        },
                        "172": {
                            "type": "mousemove",
                            "time2": 68545,
                            "cX": 886,
                            "cY": 300,
                            "mX": 15,
                            "mY": 1,
                            "code": "9a2zyx",
                            "time": 69405
                        },
                        "173": {
                            "type": "mousemove",
                            "time2": 68552,
                            "cX": 900,
                            "cY": 304,
                            "mX": 18,
                            "mY": 4,
                            "code": "9a2zyx",
                            "time": 69412
                        },
                        "174": {
                            "type": "mousemove",
                            "time2": 73526,
                            "cX": 904,
                            "cY": 640,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 74384
                        },
                        "175": {
                            "type": "mousemove",
                            "time2": 73533,
                            "cX": 900,
                            "cY": 673,
                            "mX": -4,
                            "mY": 41,
                            "code": "9a2zyx",
                            "time": 74392
                        },
                        "176": {
                            "type": "mousemove",
                            "time2": 73541,
                            "cX": 899,
                            "cY": 694,
                            "mX": -2,
                            "mY": 26,
                            "code": "9a2zyx",
                            "time": 74400
                        },
                        "177": {
                            "type": "mousemove",
                            "time2": 73551,
                            "cX": 898,
                            "cY": 710,
                            "mX": -1,
                            "mY": 20,
                            "code": "9a2zyx",
                            "time": 74407
                        },
                        "178": {
                            "type": "mousemove",
                            "time2": 73556,
                            "cX": 897,
                            "cY": 720,
                            "mX": -1,
                            "mY": 12,
                            "code": "9a2zyx",
                            "time": 74415
                        },
                        "179": {
                            "type": "mousemove",
                            "time2": 73564,
                            "cX": 898,
                            "cY": 726,
                            "mX": 1,
                            "mY": 8,
                            "code": "9a2zyx",
                            "time": 74422
                        },
                        "180": {
                            "type": "mousemove",
                            "time2": 73872,
                            "cX": 904,
                            "cY": 721,
                            "mX": 7,
                            "mY": -6,
                            "code": "9a2zyx",
                            "time": 74731
                        },
                        "181": {
                            "type": "mousemove",
                            "time2": 95757,
                            "cX": 363,
                            "cY": 487,
                            "mX": 0,
                            "mY": 0,
                            "code": "9a2zyx",
                            "time": 96614
                        },
                        "182": {
                            "type": "mousemove",
                            "time2": 96022,
                            "cX": 369,
                            "cY": 482,
                            "mX": 8,
                            "mY": -6,
                            "code": "9a2zyx",
                            "time": 96882
                        },
                        "183": {
                            "type": "mousemove",
                            "time2": 96030,
                            "cX": 380,
                            "cY": 476,
                            "mX": 13,
                            "mY": -8,
                            "code": "9a2zyx",
                            "time": 96889
                        },
                        "184": {
                            "type": "mousemove",
                            "time2": 96037,
                            "cX": 391,
                            "cY": 470,
                            "mX": 14,
                            "mY": -7,
                            "code": "9a2zyx",
                            "time": 96897
                        },
                        "185": {
                            "type": "mousemove",
                            "time2": 96045,
                            "cX": 403,
                            "cY": 464,
                            "mX": 15,
                            "mY": -8,
                            "code": "9a2zyx",
                            "time": 96904
                        },
                        "186": {
                            "type": "mousemove",
                            "time2": 96052,
                            "cX": 421,
                            "cY": 456,
                            "mX": 23,
                            "mY": -9,
                            "code": "9a2zyx",
                            "time": 96912
                        },
                        "187": {
                            "type": "mousemove",
                            "time2": 96062,
                            "cX": 442,
                            "cY": 448,
                            "mX": 26,
                            "mY": -10,
                            "code": "9a2zyx",
                            "time": 96919
                        },
                        "188": {
                            "type": "mousemove",
                            "time2": 96071,
                            "cX": 466,
                            "cY": 441,
                            "mX": 30,
                            "mY": -9,
                            "code": "9a2zyx",
                            "time": 96927
                        },
                        "189": {
                            "type": "mousemove",
                            "time2": 96075,
                            "cX": 496,
                            "cY": 432,
                            "mX": 38,
                            "mY": -12,
                            "code": "9a2zyx",
                            "time": 96935
                        },
                        "190": {
                            "type": "mousemove",
                            "time2": 96083,
                            "cX": 528,
                            "cY": 424,
                            "mX": 40,
                            "mY": -10,
                            "code": data,
                            "time": 96942
                        },
                        "191": {
                            "type": "mousemove",
                            "time2": 96092,
                            "cX": 564,
                            "cY": 416,
                            "mX": 45,
                            "mY": -10,
                            "code": data,
                            "time": 96950
                        },
                        "192": {
                            "type": "mousemove",
                            "time2": 96101,
                            "cX": 615,
                            "cY": 406,
                            "mX": 63,
                            "mY": -12,
                            "code": data,
                            "time": 96957
                        },
                        "193": {
                            "type": "mousemove",
                            "time2": 96107,
                            "cX": 668,
                            "cY": 399,
                            "mX": 66,
                            "mY": -9,
                            "code": data,
                            "time": 96965
                        },
                        "194": {
                            "type": "mousemove",
                            "time2": 96113,
                            "cX": 724,
                            "cY": 393,
                            "mX": 71,
                            "mY": -7,
                            "code": data,
                            "time": 96972
                        },
                        "195": {
                            "type": "mousemove",
                            "time2": 96138,
                            "cX": 792,
                            "cY": 389,
                            "mX": 84,
                            "mY": -5,
                            "code": data,
                            "time": 96980
                        },
                        "196": {
                            "type": "mousemove",
                            "time2": 96144,
                            "cX": 859,
                            "cY": 387,
                            "mX": 84,
                            "mY": -3,
                            "code": data,
                            "time": 96987
                        },
                        "screen_width": 1920,
                        "screen_height": 1080,
                        "pixel_ratio": 1.25,
                        "nav_appName": "Netscape",
                        "nav_product": "Gecko",
                        "nav_appVersion": "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.114 YaBrowser/22.9.1.1110 (beta) Yowser/2.5 Safari/537.36",
                        "nav_userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.114 YaBrowser/22.9.1.1110 (beta) Yowser/2.5 Safari/537.36",
                        "nav_platform": "Linux x86_64",
                        "browserLang": "ru",
                        "innerWidth": 906,
                        "innerHeight": 762,
                        "outerWidth": 1848,
                        "outerHeight": 1053
                    }
                    work_was_focused = true
                    work_last_code = el.split('|')[1]
                    setTimeout(document.getElementsByClassName('getjob_submitBtnMargins')[0].click(), 10000)


                })
            }, 17000)
        })
    }

    async function factoryPage() {

        try {
            let isWorkNeed = document.getElementsByClassName('getjob_capcha').length > 0
            //let isWorkNeed = false
            console.log(isWorkNeed, 'isWorkNeed')
            if (isWorkNeed) {
                let canvas = document.createElement('canvas')
                canvas.id = 'myCanvas'
                document.body.appendChild(canvas)

                var myImage = document.getElementsByClassName('getjob_capcha')[0];
                var myCanvas = document.getElementById('myCanvas'),
                    context = myCanvas.getContext('2d');
                if (!myImage.complete) {
                    console.log(1)

                    myImage.addEventListener('load', function (e) {
                        done(myImage, context);
                    });
                } else {
                    console.log(2)
                    done(myImage, context);

                }
                return
            }
            if (document.getElementsByClassName('getjob_submitBtn').length > 0) {
                let isNoCode = document.getElementsByClassName('getjob_block')[0]?.childNodes[1]?.textContent === 'Нажмите кнопку с "киркой" для устройства на работу.'
                if (isNoCode) {
                    document.getElementsByClassName('getjob_submitBtn')[0].click()
                }
            }
            let tableArr = document.getElementsByTagName('table');
            let tableArrLength = tableArr.length;
            let tableResurses = tableArr[tableArrLength - 1];
            let trArr = tableResurses.getElementsByTagName('tr');
            let trSelectCount = 0;


            let isBuyResource = localStorage.getItem(RESOURCE_BUY) === 'true'
            if (!isBuyResource) {
                for (const tr of trArr) {
                    trSelectCount += 1;
                    if (tr.childNodes.length === 6) {
                        if (trSelectCount !== 1) {
                            let textArr = tr.childNodes[3].textContent.split('/')
                            if (Number(textArr[1]) - Number(textArr[0]) < 1) {
                                let url = JSON.parse(localStorage.getItem(FACTORIES_URLS))
                                if (url.length > 0) {
                                    let urlSave = url.splice(1, 999999)
                                    localStorage.setItem(FACTORIES_URLS, JSON.stringify(urlSave))
                                    setTimeout(() => {
                                        window.location.href = url[0]
                                    }, 1000)
                                    return
                                }
                            }
                        }
                    }
                }
            }

            // переход
            //localStorage.getItem('hwm-helper-region_url')
            let aArr = document.getElementsByTagName('a');
            for (const a of aArr) {
                if (a.attributes[0].nodeValue) {
                    if (a.attributes[0].nodeValue.split('map.php?cx=').length > 1) {
                        let url = '' + a
                        console.log(url)
                        if (localStorage.getItem(REGION_URLS) !== url) {
                            let urls = JSON.parse(localStorage.getItem(FACTORIES_URLS))
                            urls.unshift(window.location.href)
                            localStorage.setItem(FACTORIES_URLS, JSON.stringify(urls))
                            a.click()
                        }


                    }
                }
            }

            // покупка ресурсов
            if (isBuyResource === true) {
                let wbArr = document.getElementsByName('buy_res')[0].querySelectorAll('tr')
                let tdArr = wbArr[1].getElementsByTagName('td')
                let selectTd = tdArr[tdArr.length - 1]
                selectTd.childNodes[3].value = 10;
                localStorage.setItem(RESOURCE_BUY, 'false')
                selectTd.childNodes[8].click();
                return
            }

            // продажа ресов
            let trSelectArr = [];
            for (const tr of trArr) {
                if (tr.childNodes.length === 6 && tr.childNodes[0].childNodes[0].nodeValue !== 'Тип') {
                    trSelectArr.push(tr);
                }
            }
            for (const tr of trSelectArr) {
                let blockItemNeed = tr.childNodes[4].childNodes[0].childNodes;
                let isProfit = tr.childNodes[2].childNodes[0].textContent !== '180';
                if (blockItemNeed.length === 4) {
                    if (isProfit) {
                        blockItemNeed[3].childNodes[0].value = 100;
                        setTimeout(()=>{
                            blockItemNeed[3].childNodes[1].click();
                        },1000)
                        return
                    }
                }
            }

            let url = JSON.parse(localStorage.getItem(FACTORIES_URLS))
            if (url.length > 0) {
                let urlSave = url.splice(1, 999999)
                localStorage.setItem(FACTORIES_URLS, JSON.stringify(urlSave))
                setTimeout(() => {
                    window.location.href = url[0]
                }, 1000)
                return
            }

            setTimeout(() => {
                window.location.href = 'https://www.heroeswm.ru/pl_info.php?id=6727991'
            }, 10000)
            return
        } catch (e) {
            setTimeout(() => {
                window.location.href = 'https://www.heroeswm.ru/pl_info.php?id=6727991'
            }, 10000)
        }

    }

    async function ecostatPage() {

        let tableMain = document.getElementById('tableDiv');
        let trArr = Array.prototype.slice.call(tableMain.getElementsByTagName('tr'));
        let trSelectArr = trArr.slice(4, 17);
        let urlArr = []
        // 3 элем
        let count = 0
        for (const tr of trSelectArr) {
            if (!tr.childNodes[3]) {
                continue
            }
            count += 1
            if (tr.childNodes[3].childNodes[1].text !== '0') {
                let url = tr.childNodes[0].childNodes[0].attributes[0].nodeValue;
                urlArr.push(url)
            }
        }
        let url = []
        url.push('https://www.heroeswm.ru/object-info.php?id=3')
        localStorage.setItem(FACTORIES_URLS, JSON.stringify(url))
        localStorage.setItem(DETAILS_URLS, JSON.stringify(urlArr))
        setTimeout(() => {
            window.location.href = urlArr[0]
        }, 1000)
        return
    }

    async function detailsPage() {
        let factoriesArr = JSON.parse(localStorage.getItem(FACTORIES_URLS))
        let isBuyResource = localStorage.getItem(RESOURCE_BUY) === 'true'

        if (isBuyResource) {
            let tableMain = document.getElementById('global_table_div').childNodes;
            let trArr = tableMain[tableMain.length - 1].getElementsByTagName('tr');
            let count = 0;
            for (const tr of trArr) {
                count += 1;
                if (count === 1) {
                    continue
                }
                if (tr.childNodes[1].childNodes[0].textContent.split(',').length === 1) {
                    if (JSON.parse(tr.childNodes[1].childNodes[0].textContent.trim()) > 50) {
                        let saveUrl = []
                        let urlToClick = ('https://www.heroeswm.ru/' + tr.childNodes[0].childNodes[1].attributes[0].nodeValue)
                        saveUrl.push(urlToClick)
                        localStorage.setItem(FACTORIES_URLS, JSON.stringify(saveUrl))
                        window.location.href = urlToClick
                        return
                    }
                } else {

                    if (tr.childNodes[1].childNodes[0].textContent.trim() !== 0) {
                        let saveUrl = []
                        let urlToClick = ('https://www.heroeswm.ru/' + tr.childNodes[0].childNodes[1].attributes[0].nodeValue)
                        saveUrl.push(urlToClick)
                        localStorage.setItem(FACTORIES_URLS, JSON.stringify(saveUrl))
                        window.location.href = urlToClick
                        return
                    }
                }
            }
        }
        let tableMain = document.getElementById('global_table_div2').childNodes;
        let trArr = tableMain[tableMain.length - 1].getElementsByTagName('tr');
        let count = 0;
        let urlArr = []
        for (const tr of trArr) {
            count += 1;
            if (count === 1) {
                continue
            }
            if (tr.childNodes[1].childNodes[0].textContent.trim() !== "0") {
                urlArr.push('https://www.heroeswm.ru/' + tr.childNodes[0].childNodes[1].attributes[0].nodeValue)
            }
        }
        let urls
        if (factoriesArr) {
            urls = factoriesArr.concat(urlArr)
        } else {
            urls = urlArr
        }
        await localStorage.setItem(FACTORIES_URLS, JSON.stringify(urls))
        let url = JSON.parse(localStorage.getItem(DETAILS_URLS))
        if (url.length > 0) {
            let urlSave = url.splice(1, 999999)
            localStorage.setItem(DETAILS_URLS, JSON.stringify(urlSave))
            setTimeout(() => {
                window.location.href = url[0]
            }, 1000)
            return
        } else {
            let urlFactories = JSON.parse(localStorage.getItem(FACTORIES_URLS))
            if (urlFactories.length > 0) {
                let urlFactoriesSave = urlFactories.splice(1, 999999)
                localStorage.setItem(FACTORIES_URLS, JSON.stringify(urlFactoriesSave))
                setTimeout(() => {
                    window.location.href = urlFactories[0]
                }, 1000)
                return
            } else {
                setTimeout(() => {
                    window.location.href = 'https://www.heroeswm.ru/pl_info.php?id=6727991'
                }, 1000)
                return
            }
        }
    }

    async function test() {
        let formData = new FormData()
        formData.append('method', 'base64')
        formData.append('key', "676ec1a756127c74ec917e59d4c8a7b8")
        formData.append('body', 'data:image/png;base64,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')
        console.log(formData)
        let test = await fetch('https://rucaptcha.com/in.php', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
        console.log(test)
    }

    function workSet() {
        let img = document.createElement('img')
        img.id = 'myImage'
        img.src = 'https://www.heroeswm.ru/work_codes/19556-134/6727991--469357.jpeg'
        document.body.appendChild(img)


        console.log(test)
            .then(resp => resp.text())
            .then(data => console.log(data))

        fetch('http://rucaptcha.com/res.php', {
            method: 'GET',
            body: formData
        })
        'http://rucaptcha.com/res.php?key=1abc234de56fab7c89012d34e56fa7b8&action=get&id=51924261983'

        fetch(' https://api.capmonster.cloud/getTaskResult/', {
            method: 'POST',
            body: JSON.stringify({
                "taskId": '96922744',
                "clientKey": "e74f832150a92fd4e511168ade353fb5",
            })
        })


    }
})();
