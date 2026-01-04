// ==UserScript==
// @name          Cryptoclaimhub.com + countdownTimer
// @namespace     Violentmonkey & Tampermonkey Scripts
// @match         https://cryptoclaimhub.com/*
// @grant         none
// @version       0.4
// @author        Danik Odze
// @description   Автоматический переход от крана к короткой ссылке
// @license       Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/529204/Cryptoclaimhubcom%20%2B%20countdownTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/529204/Cryptoclaimhubcom%20%2B%20countdownTimer.meta.js
// ==/UserScript==

(function() {
    'use strict';
class WorkerInterval {
  worker = null;
  constructor(callback, interval) {
    const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
    const workerScript = URL.createObjectURL(blob);
    this.worker = new Worker(workerScript);
    this.worker.onmessage = callback;
  }

  stop() {
    this.worker.terminate();
  }
}
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

    setCaptchaSolverStatus('<p><b>Captcha Solver:</b> Console </p><br />', 'red');
//===================================
var finish = document.querySelector("body > div.wrapper > div > main > div > div:nth-child(7) > div > div > div > h4")
    if(finish && finish.textContent == 'You have met the daily limit.')window.location.href='https://cryptoclaimhub.com/home';
    if (window.location.href === "https://cryptoclaimhub.com/ads") {
        let viewButton = document.querySelector('button.btn.btn-primary.view-ad-btn');
        if (viewButton) {
            viewButton.click();
        } else {
            window.location.href = "https://cryptoclaimhub.com/shortlinks";
        }
    }

    function checkTurnstile() {
        let turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
        if (window.location.href === 'https://cryptoclaimhub.com/faucet'){
        document.querySelector('input[name="cf-turnstile-response"]').value='0.OolNkVEb2SiZgvzqJ-4vHQa3DNXwWIjHdEXG3UGImm1bCywjeNz13mXLzumh29hp1d7UPhMAD6nbZ03_WtGiCdjwNzrfuIuHTC2RbvNmRmHjjd_PdEMrMNmljhqqg3__LX7SaTHpSPBNW1dyDifd5pUoFeYi7nnondQ-gZuHRpU1M507N_Qp6rFzUnqnKxg9CYGKpWq2CUUIWTgD5wba4rykjVBwsaI_wFnPXF09ZSifn-NntfzLrkFgeHd7r7eGtEi-JoRjV0i9T6gYFBGH9TtSfk3g7KsIAx4b1kOyD45ks454ics3FW3cvI4DMUoPazw0gDnl_f8q_oC5jLfZz9cpcNoWN7s0MtFpQ3ZyqEX3zwgG91vLyXR56qrjh8HKyw6YEZDjwlfncSr_fOfKIvGqquLedOus3DHBA8FR45IkTRIz1AUzcjr6-mSiQtP9DS_R39RGl6ps_Eo9yuWW-w5Kg1V120qMIE6Fj8-8piDBR5EFWt67WI3ompkKKHZMy6aSkvdFkf1ciypt6el6NBXWmoPHn1mBu7VwjbcW_8xgmPygW4jVTe_xzZzXjqj7n-jyp4bQND6ocMZo_7j01UoIYTOMMlT1Y47NO9DZdZMvFaHlY1t_w5YM4z8oyZhIMyRBNeZyhJQ5C_RDxmZsKYkXyo9FfHHjGDeq4o_vaTvm05botsaHsOtisQ7F5BTnDHvqIhTq5PZdP57Vv16xXJax_Z_QXaGAN8tsggbB93-fXwscPCwHzZdgWl2agqgCieO97Ih_IHgt30G1dYwbNRnYQ9xQ47MZe6iIT91ApEmDDU0bCV3ldItjnItnpTc9xMYiSWPYdY5lQzH1ON02sw.9stX8PSEu8qLIJfFI5PVSQ.c1dce84bdf6da8b6ffaba91bb319c3f8934d67fcbd69b128aaede26b65eb8b89'
        }
        return turnstileResponse && turnstileResponse.value !== '';
    }

    function scrollToMiddle() {
        let middleY = document.body.scrollHeight / 2;
        window.scrollTo({
            top: middleY,
            behavior: 'smooth'
        });
    }

    if (window.location.href === 'https://cryptoclaimhub.com/faucet') {
        scrollToMiddle();
    }

    function isModalVisible() {
        let modal = document.querySelector('.modal-dialog.modal-dialog-centered.modal-sm.my-custom-modal');
        return modal && modal.offsetParent !== null;
    }

    function clickConfirmButton() {
        let confirmButton = document.querySelector('button.btn.btn-primary[type="submit"]');
        if (confirmButton) {
        setTimeout(function() {
            confirmButton.click();
        }, 5000);
            return true;
        }
        return false;
    }

    let confirmInterval = new WorkerInterval(function() {
        if (checkTurnstile() && isModalVisible()) {
            if (clickConfirmButton()) {
                confirmInterval.stop();
            }
        }
    }, 1000);

  setTimeout(function() {
        if (!checkTurnstile() && isModalVisible()) {
            clickConfirmButton();
        }
    }, 15000);


        function clickButtonByStep(stepText) {
    let claimButton = document.querySelector('#claimButton');

    if (claimButton) {

        if (new RegExp(stepText + '\\s\\d+/\\d+').test(claimButton.textContent)) {
            claimButton.click(); // Пытаюсь нажать на кнопку
            return true;
        }
    }

    return false;
}

function isIconSelected() {
    let selectedIcon = document.querySelector('.stat.selected');
    if (selectedIcon) {
        console.log("Значок был выбран.");
        return true;
    } else {
        console.log("Мы не будим выбирать ничего.");
        return true;
    }
}

function clickButtonByStepText(stepText) {
    let claimButton = document.querySelector("button.step-button-class");

    if (claimButton) {
        if (new RegExp(stepText + '\\s\\d+/\\d+').test(claimButton.textContent)) {
            console.log("Кнопки в соответствии с рисунком, попробуйте нажать...");
            claimButton.click();
            return true;
        } else {
            console.log("Пуговицы не подходят к выкройке: " + claimButton.textContent);
        }
    } else {
        console.log("Кнопка не найдена.");
    }

    return false;
}

let actionInterval = new WorkerInterval(function() {
    if (checkTurnstile() && isIconSelected()) {
        let buttonClicked = clickButtonByStep('Step');
        if (buttonClicked) {
            actionInterval.stop();
        }
        else {
            let confirmButton = document.querySelector("button.btn.btn-primary[type='submit']");
            if (confirmButton) {
        setTimeout(function() {
            confirmButton.click();
        }, 5000);
                actionInterval.stop();
            } else {
            }
        }
    }
}, 1000);




    const buttons = [
        'https://cryptoclaimhub.com/shortlinks/go/20',
        'https://cryptoclaimhub.com/shortlinks/go/31',
        'https://cryptoclaimhub.com/shortlinks/go/1',
        'https://cryptoclaimhub.com/shortlinks/go/8',
        'https://cryptoclaimhub.com/shortlinks/go/2',
        'https://cryptoclaimhub.com/shortlinks/go/15',
        'https://cryptoclaimhub.com/shortlinks/go/16',
        'https://cryptoclaimhub.com/shortlinks/go/22'
    ];
    let currentIndex = 0;

    function clickNextButton() {
        if (currentIndex < buttons.length) {
            let claimButton = document.querySelector(`a.btn.btn-primary[href="${buttons[currentIndex]}"]`);
            if (claimButton) {
                claimButton.click();
                currentIndex++;
                setTimeout(clickNextButton, 5000);
            } else {
                currentIndex++;
                setTimeout(clickNextButton, 1000);
            }
        }
    }

    //clickNextButton();

    function startCountdown() {
        const countdownTime = 10 * 60 * 1000;
        const endTime = Date.now() + countdownTime;
        localStorage.setItem('countdownEndTime', endTime);
        let countdownInterval = new WorkerInterval(function() {
            const remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
                countdownInterval.stop();
                window.location.href = "https://cryptoclaimhub.com/faucet";
            }
        }, 1000);
    }

    function continueCountdown() {
        const endTime = localStorage.getItem('countdownEndTime');
        if (endTime && Date.now() < endTime) {
            const countdownInterval = new WorkerInterval(function() {
                const newRemainingTime = endTime - Date.now();
        var minutes = parseInt(newRemainingTime / 60000, 10);
        var seconds = parseInt(newRemainingTime/1000 % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector("body > div.captchasolver-status").innerHTML = minutes + ":" + seconds;
                if (newRemainingTime <= 0) {
                    countdownInterval.stop();
                    window.location.href = "https://cryptoclaimhub.com/faucet";
                }
            }, 1000);
        }
    }

    function checkClock() {
    let waitTimeElement = document.getElementById('waitTimeDisplay');

    if (waitTimeElement) {
        let waitTimeText = waitTimeElement.innerText;

        if (waitTimeText.includes("55s")) {
            startCountdown();
            window.location.href = "https://cryptoclaimhub.com/ads";
        }
    }
}

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
            checkClock();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    checkClock();
    continueCountdown();
})();
