// ==UserScript==
// @name         автоустройство на работу
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  try 123
// @author       You
// @match        https://www.heroeswm.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473035/%D0%B0%D0%B2%D1%82%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE%20%D0%BD%D0%B0%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/473035/%D0%B0%D0%B2%D1%82%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE%20%D0%BD%D0%B0%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%83.meta.js
// ==/UserScript==

const LOGIN = 'hwm-helper-auto-work-login';
const PASSWORD = 'hwm-helper-auto-work-password';
const IS_START_WORK = 'auto-work-is-start-script';
const IS_NEED_WORK = 'auto-work-is-need-script';

let login = localStorage.getItem(LOGIN);
let password = localStorage.getItem(PASSWORD);

let isStarAutoWork = localStorage.getItem(IS_START_WORK) === 'true';
let isNeedWork = localStorage.getItem(IS_NEED_WORK) === 'true';
const lordsUrl = 'https://www.lordswm.com';
const hwmUrl = 'https://www.heroeswm.ru';
const hwmWorkText = 'Нажмите кнопку с "киркой" для устройства на работу.';
const lordsWorkText = 'Click "Pick" button to enroll.';

const isNewDesign = document.getElementById('hwm_header');
const isHwmUrl = window.location.href.split('https://www.heroeswm.ru').length > 0;

const baseUrl = isHwmUrl ? hwmUrl : lordsUrl;
const workText = isHwmUrl ? hwmWorkText : lordsWorkText;
const usersUrl = isNewDesign ? baseUrl + '/home.php' + '?info' : baseUrl + '/home.php';

(async function () {
    'use strict';

    /*
    if (window.location.href.split('https://www.heroeswm.ru').length > 0) {
        baseUrl = hwmUrl
        workText = 'Нажмите кнопку с "киркой" для устройства на работу.'
    } else {
        baseUrl = lordsUrl
        workText = 'Click "Pick" button to enroll.'
    } */
    /*
    if (!login) {
        login = prompt('Введите Логин');
        localStorage.setItem(LOGIN, login)
    }

    if (!password) {
        password = prompt('Введите Пароль');
        localStorage.setItem(PASSWORD, password)
        let response = await fetch(`https://hwm-helper.ru/autowork/users/check/${login}/${password}`, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        })
        response = await response.json()
        if (response.error) {
            loginAndPasswordDelete()
            alert(response.error)
            return
        }
        if (response.status !== 'ok') {
            loginAndPasswordDelete()
            alert('Системная ошибка')
            return
        }
    }
        */

    if (!isStarAutoWork) {
        // скрипт выключен
        if (window.location.href === usersUrl) {
            let button = document.createElement("input");
            button.type = "button";
            button.value = 'Включить Auto Work'
            button.onclick = startScript;
            document.getElementById('hwm_no_zoom').appendChild(button)

        }

    } else {
        // скрипт включен
        if (window.location.href === usersUrl) {
            closeUpdateButton()
            let button = document.createElement("input");
            button.type = "button";
            button.value = 'Выключить Auto Work'
            button.onclick = endScript;
            document.getElementById('hwm_no_zoom').appendChild(button)

            const isNeedWork = checkNeedWork()
            localStorage.setItem(IS_NEED_WORK, String(isNeedWork))

            if (isNeedWork) {

                randomDelay(() => {
                    window.location.href = `${baseUrl}/map.php`
                });
            } else {
                windowReloadTimer();
            }
            return
        }

        // скрипт выключен
        if (window.location.href === `${baseUrl}/map.php`) {
            mapLogic();

            return;
        }

        if (window.location.href.split(`${baseUrl}/object-info.php?id=`).length > 1) {
            factoryLogic();

            return
        }

        randomDelay(() => {
            window.location.href = usersUrl
        }, 10000, 20000)

    }

})();

function closeUpdateButton() {
    const updateButtonTexts = ['Ознакомилась', 'Ознакомился']

    function findElementByExactText(text) {
        const elements = document.querySelectorAll('*');
        return Array.from(elements).find(el => el.textContent?.trim() === text);
    }

    const findUpdateButtonArray = updateButtonTexts.flatMap((text) => {
        const buttonBlock = findElementByExactText(text)

        return buttonBlock ? buttonBlock : []
    })

    if (findUpdateButtonArray.length > 0) {
        const findUpdateButton = findUpdateButtonArray[0];

        if (findUpdateButton.nodeName === 'CENTER') {
            findUpdateButton.childNodes[0].childNodes[1].click()
        }

        if (findUpdateButton.nodeName === 'A') {
            findUpdateButton.click()
        }

        findUpdateButton.childNodes.forEach((element) => {
            element.click()
        })
    }

}


function randomDelay(callback, startTime = 2000, endTime = 3000) {
    const delay = Math.floor(Math.random() * endTime) + startTime; // 2000-5000 мс
    console.log(`Ждем ${Math.floor(delay / 1000)} секунд (${Math.floor(delay / 1000 / 60)} минут) для проверки нужна ли работа`)

    setTimeout(callback, delay);
}

function randomDelayWithTimer(callback, startTime = 2000, endTime = 3000) {
    const delay = Math.floor(Math.random() * endTime) + startTime; // 2000-5000 мс
    console.log(`Ждем ${Math.floor(delay / 1000)} секунд (${Math.floor(delay / 1000 / 60)} минут) для проверки нужна ли работа`)
    console.log(1)
    const timer = createTimer(delay);
    console.log(timer)
    document.getElementById('hwm_no_zoom').appendChild(timer);

    setTimeout(callback, delay);
}

function startScript() {
    localStorage.setItem(IS_START_WORK, 'true')
    window.location.reload()
}

function endScript() {
    localStorage.setItem(IS_START_WORK, 'false')
    window.location.reload()
}

function findElementByExactText(text) {
    const elements = document.querySelectorAll('*');
    return Array.from(elements).find(el => el.textContent?.trim() === text);
}

function checkNeedWork() {

    const element = findElementByExactText('Вы нигде не работаете.');
    return Boolean(element);
}

function loginAndPasswordDelete() {
    localStorage.setItem(LOGIN, '')
    localStorage.setItem(PASSWORD, '')
    window.location.reload()

}

function factoryLogic() {
    let workBlock = document.getElementsByClassName('getjob_block')
    let isNeedWork = workBlock.length > 0
    console.log(isNeedWork)

    if (!isNeedWork) {
        randomDelay(() => {
            window.location.href = usersUrl
        });
    }

    if (isNeedWork) {
        const isWorkCode = !Boolean(findElementByExactText(workText))

        if (!isWorkCode) {
            // работа без кода
            workBlock[0].getElementsByClassName('getjob_submitBtn')[0].click()
        } else {
            // работа с кодом
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

        }

        return;
    } else {
        goToMap(10);

        return;
    }
}

function mapLogic() {
    let miningBtn = document.getElementsByClassName('job_fl_btn_selected');
    if (!miningBtn) {
        windowReloadTimer();
        return;
    }
    miningBtn = miningBtn[0];
    miningBtn.click();

    const btnWork = findElementByExactText('»»»')

    if (btnWork) {
        randomDelay(() => {
            btnWork.click()

        })
        btnWork.click()

        return;
    }
    randomDelay(() => {
        window.location.href = usersUrl
    })
}

function windowReloadTimer() {
    randomDelayWithTimer(() => {
        window.location.reload()
    }, 300000, 310000)
}

function goToMap(time) {
    console.log('ждем обновление')
    console.log(`${baseUrl}/map.php`)
    setTimeout(function () {
            window.location.href = `${baseUrl}/map.php`
        },
        time * 1000);
}

function createTimer(ms) {
    const timerElement = document.createElement('div');
    timerElement.style.cssText = `
          position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 10000;
        line-height: 1.4;
        text-align: center;
    `;

    let timeLeft = ms

    function updateTimer() {
        const minutesLeft = Math.floor(timeLeft / 60000);
        const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

        timerElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 3px;">Таймер Auto Work</div>
            <div>Осталось: ${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}</div>
        `;

        if (timeLeft <= 0) {
            timerElement.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 3px;">Таймер auto Work</div>
                <div style="color: #ff4444;">Время вышло!</div>
            `;
            clearInterval(intervalId);
        }

        timeLeft -= 1000;
    }

    updateTimer(); // начальное отображение
    const intervalId = setInterval(updateTimer, 1000);

    return timerElement;
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
                console.log('data', data)
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
                document.getElementsByClassName('getjob_submitBtnMargins')[0].click()
                goToMap(10);
            })
        }, 17000)
    })
}