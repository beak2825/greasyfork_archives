// ==UserScript==
// @name         Display Coze Bot With FullScreen
// @version      2024-02-24
// @description  将Coze对话框全屏
// @author       CyanFalse
// @match        https://www.coze.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.com
// @grant        none
// @namespace https://greasyfork.org/users/370662
// @downloadURL https://update.greasyfork.org/scripts/488849/Display%20Coze%20Bot%20With%20FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/488849/Display%20Coze%20Bot%20With%20FullScreen.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if(!location.pathname.match(/\/space\/\d+\/bot\/\d+/g)) return;
            if (Object.values(document.querySelectorAll('span')).filter((span) => span.innerText === 'Publish')[0]) {
                clearInterval(interval)
                resolve()
            }
        }, 1000)
    })
    const PublishButtonSpan = Object.values(document.querySelectorAll('span')).filter((span) => span.innerText === 'Publish')[0]
    const PublishButton = PublishButtonSpan.parentElement
    const HideButtonSpan = PublishButtonSpan.cloneNode(true)
    const HideButton = PublishButton.cloneNode(true)
    HideButtonSpan.innerText = 'Hide'
    HideButton.innerHTML = ''
    HideButton.appendChild(HideButtonSpan)
    PublishButton.parentElement.appendChild(HideButton)
    const container = document.getElementsByClassName('sidesheet-container')[0]
    const feedback = document.querySelectorAll('[id^="feelgood_root"]')[0]
    const hide = () => {
        container.children[0].style.display = 'none'
        container.children[1].style.display = 'none'
        container.style.display = 'unset'
        feedback.style.display = 'none'
        HideButton.removeEventListener('click', hide)
        HideButton.addEventListener('click', show)
    }
    const show = () => {
        container.children[0].style.display = 'unset'
        container.children[1].style.display = 'unset'
        container.style.display = 'grid'
        feedback.style.display = 'unset'
        HideButton.removeEventListener('click', show)
        HideButton.addEventListener('click', hide)
    }
    HideButton.addEventListener('click', hide)
    HideButton.click()
})();
