// ==UserScript==
// @name           x.com autoBtn
// @namespace      http://tampermonkey.net/
// @version        0.2.2
// @description    Clicks on "Block" and "Maybe later" buttons
// @author         CiNoP
// @license        GPL-3.0-only
// @match          https://x.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/518861/xcom%20autoBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/518861/xcom%20autoBtn.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* jshint asi: true */
 
(() => {
    let blockProcessButtonClicked = false
    let blockProcessConfirmButtonClicked = false
 
    function clickBlockButtonIfExists() {
        if (blockProcessButtonClicked) return
        const blockButton = document.querySelector('div[data-testid="block"]')
        const ruBlockButton = document.querySelector('div[data-testid="В черный список"]')
        if (blockButton || ruBlockButton) {
            console.log('Кнопка блокировки найдена, ожидаем подтверждения...')
            ;(blockButton || ruBlockButton).addEventListener('click', () => {
                blockProcessButtonClicked = true
                observeConfirmButton()
            })
        }
    }
 
    function clickConfirmButtonIfExists() {
        const confirmButton = Array.from(document.querySelectorAll('button[data-testid="confirmationSheetConfirm"]')).find(button =>
            button.textContent.includes('В черный список') || button.textContent.includes('Block')
        )
        if (confirmButton) {
            console.log('Кнопка подтверждения найдена, кликаю...')
            confirmButton.click()
            blockProcessConfirmButtonClicked = true
            setTimeout(() => {
                blockProcessButtonClicked = false
                blockProcessConfirmButtonClicked = false
            }, 300)
        }
    }
 
    function observeConfirmButton() {
        const confirmObserver = new MutationObserver(() => {
            clickConfirmButtonIfExists()
        })
        confirmObserver.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
 
    const blockObserver = new MutationObserver(() => {
        clickBlockButtonIfExists()
    })
    const blockObserverConfig = {
        childList: true,
        subtree: true,
        attributes: false
    }
    blockObserver.observe(document.body, blockObserverConfig)
    clickBlockButtonIfExists()
})();
 
(() => {
    let forYouButtonClicked = false
 
    function clickForYouButtonIfExists() {
        if (forYouButtonClicked) return
        const forYouButton = Array.from(document.querySelectorAll('a[role="tab"]')).find(el =>
            el.textContent.trim() === "Для вас" || el.textContent.trim() === "For you"
        )
        if (forYouButton) {
            const buttonText = forYouButton.textContent.trim() === "Для вас" ? "Не сейчас" : "Maybe later"
            const targetButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent.trim() === buttonText
            )
            if (targetButton) {
                console.log(`Кнопка "${buttonText}" найдена, кликаю...`)
                targetButton.click()
                forYouButtonClicked = true
                setTimeout(() => {
                    forYouButtonClicked = false
                }, 300)
            }
        }
    }
 
    function observeForYouChanges() {
        const observer = new MutationObserver(() => {
            clickForYouButtonIfExists()
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
 
    function observePostAddedChanges() {
        const observer = new MutationObserver(() => {
            clickForYouButtonIfExists()
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
 
    observeForYouChanges()
    observePostAddedChanges()
    clickForYouButtonIfExists()
})()