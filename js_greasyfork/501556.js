// ==UserScript==
// @name         自动关闭pdd商家后台弹窗
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  auto close pdd modal
// @author       haoyue
// @match        https://mms.pinduoduo.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/501556/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADpdd%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501556/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADpdd%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and close the modal
    function handleClose(modal) {
        const closeButton = modal.querySelectorAll('[class*="close"]')[0]


        if (closeButton) {
            closeButton.click()
            console.info('click close button')
        } else {
            // If no close button is found, remove the modal and the mask directly
            modal.remove()
            const mask = document.querySelector('[data-testid="beast-core-modal-mask"]')
            if (mask) {
                mask.remove()
                console.info('remove mask')
            }
        }
    }

    function checkModal(modal) {
        return modal.textContent.includes('自动跟价') || modal.textContent.includes('设置西藏包邮额度订单')
    }

    function checkAndCloseModal() {
        // Find the modal element
        const modal = document.querySelector('[data-testid="beast-core-modal"]')
        if (modal && checkModal(modal)) {
            // Check if the modal content contains the keyword
            console.info('出现了自动跟价')
            // Try to find the close button by looking for the keyword "关闭"
            handleClose(modal)

        }
    }

    // Function to observe route changes
    function observeRouteChanges() {
        const originalPushState = history.pushState
        const originalReplaceState = history.replaceState

        // Override pushState
        history.pushState = function () {
            originalPushState.apply(this, arguments)
            checkAndCloseModal()
        }

        // Override replaceState
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments)
            checkAndCloseModal()
        }

        // Listen for popstate event (back/forward navigation)
        window.addEventListener('popstate', checkAndCloseModal)
    }

    // Function to observe DOM changes
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                checkAndCloseModal()
            })
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    }

    // Start observing route changes and DOM changes
    // observeRouteChanges()
    observeDOMChanges()

    // Initial check in case the modal is already present
    checkAndCloseModal()

})();