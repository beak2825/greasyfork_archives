// ==UserScript==
// @name          Cryptoclaimhub.com
// @namespace     Violentmonkey & Tampermonkey Scripts
// @match         https://cryptoclaimhub.com/*
// @grant         none
// @version       0.2
// @author        Ojo Ngono
// @description   Otomatis klik mulai dari faucet sampai shortlink
// @license       Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/508988/Cryptoclaimhubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/508988/Cryptoclaimhubcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
            confirmButton.click();
            return true;
        }
        return false;
    }

    let confirmInterval = setInterval(function() {
        if (checkTurnstile() && isModalVisible()) {
            if (clickConfirmButton()) {
                clearInterval(confirmInterval);
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
            claimButton.click();  // Mencoba mengklik tombol
            return true;
        }
    }

    return false;
}

function isIconSelected() {
    let selectedIcon = document.querySelector('.stat.selected');
    if (selectedIcon) {
        console.log("Ikon telah dipilih.");
        return true;
    } else {
        console.log("Ikon belum dipilih.");
        return false;
    }
}

function clickButtonByStep(stepText) {
    let claimButton = document.querySelector("button.step-button-class");

    if (claimButton) {
        if (new RegExp(stepText + '\\s\\d+/\\d+').test(claimButton.textContent)) {
            console.log("Tombol sesuai dengan pola, mencoba klik...");
            claimButton.click();
            return true;
        } else {
            console.log("Tombol tidak sesuai dengan pola: " + claimButton.textContent);
        }
    } else {
        console.log("Tombol tidak ditemukan.");
    }

    return false;
}

let actionInterval = setInterval(function() {
    if (checkTurnstile() && isIconSelected()) {
        let buttonClicked = clickButtonByStep('Step');
        if (buttonClicked) {
            clearInterval(actionInterval);
        }
        else {
            let confirmButton = document.querySelector("button.btn.btn-primary[type='submit']");
            if (confirmButton) {
                confirmButton.click();
                clearInterval(actionInterval);
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

    clickNextButton();
})();

(function() {
    'use strict';

    function startCountdown() {
        const countdownTime = 5 * 60 * 1000;
        const endTime = Date.now() + countdownTime;
        localStorage.setItem('countdownEndTime', endTime);
        const countdownInterval = setInterval(function() {
            const remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                window.location.href = "https://cryptoclaimhub.com/faucet";
            }
        }, 1000);
    }

    function continueCountdown() {
        const endTime = localStorage.getItem('countdownEndTime');
        if (endTime && Date.now() < endTime) {
            const countdownInterval = setInterval(function() {
                const newRemainingTime = endTime - Date.now();
                if (newRemainingTime <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = "https://cryptoclaimhub.com/faucet";
                }
            }, 1000);
        }
    }

    function checkClock() {
    let waitTimeElement = document.getElementById('waitTimeDisplay');

    if (waitTimeElement) {
        let waitTimeText = waitTimeElement.innerText;

        if (waitTimeText.includes("0s")) {
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
