// ==UserScript==
// @name         Freebitco.in Auto Roll, Auto WoF (work with tiers Turnstile resolver) 11/2024
// @namespace
// @version      0.4
// @description  Please use my Referal-Link https://freebitco.in/?r=1748546, if you find the script useful and want to donate, please use bc1qwdsgre7gzy4z63ujsev9mfkv68f33jykdzeypj
// @author       PredatorBzh & Danik Odze
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/447780/Freebitcoin%20Auto%20Roll%2C%20Auto%20WoF%20%28work%20with%20tiers%20Turnstile%20resolver%29%20112024.user.js
// @updateURL https://update.greasyfork.org/scripts/447780/Freebitcoin%20Auto%20Roll%2C%20Auto%20WoF%20%28work%20with%20tiers%20Turnstile%20resolver%29%20112024.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        if (document.querySelector("#time_remaining").textContent == '') location.reload();
    }, 20000);

    var CaptchaSolverStatus = document.createElement('div');
    document.body.appendChild(CaptchaSolverStatus);

    CaptchaSolverStatus.classList.add('captchasolver-status');
    document.body.appendChild(document.createElement('style')).textContent = (`
                .captchasolver-status {
                position: fixed;
                font-size: 20px !important;
                top: 140px !important;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
                }
                `);

    function setCaptchaSolverStatus(html, color) {
        if (color === 'green') {
            CaptchaSolverStatus.style.color = 'green';
        } else if (color === 'red') {
            CaptchaSolverStatus.style.color = 'red';
        } else {
            CaptchaSolverStatus.style.color = 'black';
        }
        CaptchaSolverStatus.innerHTML = html;
    }

    setCaptchaSolverStatus('<p><b>Captcha Solver:</b> Activated.</p>', 'green');

    let url = window.location.href;

    let buyLottery = false; //По умолчанию false, установите значение true, если вы хотите покупать лотерейный билет после каждого броска
    let number_ticket = 1; //Default is 1

    $(document).ready(function () {
        setCaptchaSolverStatus("Состояние: страница загружена.", 'green');
        console.log("Status: Page loaded.");

        let turnstile = document.querySelector('input[name="cf-turnstile-response"]');

        if (turnstile) {
            setCaptchaSolverStatus("капча присутствует на странице.", 'green');
            console.log("Turnstile is present on the page.");

            waitForCaptcha(function () {
                setCaptchaSolverStatus("Капча была решена!", 'green');
                console.log("Captcha has been resolved!");
                setTimeout(() => play(), 5000);
            });
        } else {
            console.log("Turnstile is not present on the page.");
			//setTimeout(() => play(), 5000);
        }
    });

    function checkTurnstile() {
        const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        return turnstileResponse && turnstileResponse.value !== '';
    }


    function buy_lottery_ticket(number_of_ticket) {

        let element = document.querySelector('.lottery_link');

        if (element) {
            element.click();

            $(document).ready(function () {

                let inputElement = document.getElementById('lottery_tickets_purchase_count');
                if (inputElement) {
                    inputElement.value = number_of_ticket;
                }

                let buyButton = document.getElementById('purchase_lottery_tickets_button');
                if (buyButton) {
                    buyButton.click();
                }
            });
        } else {
            setCaptchaSolverStatus("Элемент не найден.", 'red');
            console.log("The element was not found.");
        }
    }

    function checkCaptchaResolved() {

        let hCaptchaResponse = document.querySelector('textarea[id^="h-captcha-response-"]');

        if (hCaptchaResponse && hCaptchaResponse.value.trim() !== "") {
            return true; // Return true if resolved
        } else {
            return false; // Return false if not resolved
        }
    }

    function waitForCaptcha(callback) {
        let captchaCheckInterval = setInterval(function () {
            if (checkTurnstile()) {
                clearInterval(captchaCheckInterval);
                callback();
            }
        }, 1000); // Проверяйте каждые 1 секунду
    }

    function play() {

        setTimeout(function () {
            let timeRemainingDiv = document.getElementById("time_remaining");

            if (timeRemainingDiv && timeRemainingDiv.innerHTML.trim() !== "") {
                setCaptchaSolverStatus("Мы ничего не делаем", 'black');
                console.log("We do nothing");
            } else {

                $('#free_play_form_button').click();

                setTimeout(function () {
                    if (buyLottery) {
                        buy_lottery_ticket(number_ticket)
                    }
                }, 5000);
            }
        }, 2000);

        setTimeout(function () {

            if (!sessionStorage.getItem('justReloaded')) {

                sessionStorage.setItem('justReloaded', 'true');
                //location.reload();
            } else {

                sessionStorage.removeItem('justReloaded');
            }

            //let div = document.getElementById("free_wof_spins_msg");
			let div = document.querySelector("#fp_bonus_wins > a");

            if (div) {

                let link = div.querySelector('a[href="https://freebitco.in/static/html/wof/wof-premium.html"]');

                if (link) {

                    let clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('click', true, true);
                    link.dispatchEvent(clickEvent);

                    setTimeout(function () {

                        let specificCloseButton = document.querySelector('.close[onclick="CloseAlertMsg(\'free_wof_spins\',1);"]');

                        if (specificCloseButton) {
                            specificCloseButton.click();
                        } else {
                            setCaptchaSolverStatus("Специальная кнопка закрытия не найдена.", 'red');
                            console.log("The specific close button was not found.");
                        }
                    }, 2000);
                } else {
                    setCaptchaSolverStatus("Ссылка 'Play them here!' не найдена.", 'red');
                    console.log("The 'Play them here!' link was not found.");
                }
            } else {
                setCaptchaSolverStatus("Элемент с идентификатором 'free_wof_spins_msg' не существует.", 'red');
                console.log("The div with ID 'free_wof_spins_msg' does not exist.");
            }
        }, 10000);

        if (url.includes("https://freebitco.in/static/html/wof/wof-premium.html")) {
            $(document).ready(function () {
                setTimeout(function () {

                    let buttons = document.querySelectorAll(".play-but");

                    let playAllButton = Array.from(buttons).find(button => button.textContent.trim() === "PLAY ALL");

                    if (playAllButton) {

                        let clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent('click', true, true);
                        playAllButton.dispatchEvent(clickEvent);
                    } else {
                        setCaptchaSolverStatus("Кнопка с текстом 'PLAY ALL' не найдена.", 'red');
                        console.log("The button with the text 'PLAY ALL' was not found.");
                    }

                    setTimeout(function () {
                        window.close();
                    }, 5000);
                }, 4000);
            });
        } else {
            setCaptchaSolverStatus('Это не та страница, которую мы ищем.', 'green');
            console.log("This is not the page we are looking for.");
        }
    }

})();