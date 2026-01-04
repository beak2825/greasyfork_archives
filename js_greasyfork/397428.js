// ==UserScript==
// @name         知乎屏蔽登录弹窗
// @namespace    https://github.com/yzx9/
// @version      0.4.0
// @description  屏蔽知乎问题界面的登录弹窗, 首部按钮登录依然可用，[GitHub Link](https://github.com/yzx9/Tampermonkey)
// @author       yuan.zx@outlook.com
// @match        https://*.zhihu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397428/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/397428/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // prevent escape event, see also [#2](https://github.com/yzx9/Tampermonkey/issues/2)
    window.addEventListener('keydown', e => e.key === 'Escape' && e.stopImmediatePropagation(), true)

    // watch madal
    let modalDisabled = false
    let footDialog = null

    const body = document.body
    const html = document.documentElement

    const getModal = () => document.querySelector('.signFlowModal')

    const RE_LOGIN_BTN = /立即登录/
    const getFootDialog = () => Array.from(document.querySelectorAll('button')).filter(item => RE_LOGIN_BTN.test(item.innerText))[0]

    const modalObserver = new MutationObserver(() => {
        // clear login modal
        const modal = getModal()
        if (!modalDisabled && modal) {
            let parent = modal.parentNode
            while (parent.parentNode !== body) parent = parent.parentNode
            body.removeChild(parent)
            html.style.overflow = 'auto'
            html.style.marginRight = 'auto'
        }
        // clear foot prompt dialog
        if(!footDialog) {
            footDialog = getFootDialog()
            while (footDialog && footDialog.parentNode !== body) footDialog = footDialog.parentNode
            footDialog && body.removeChild(footDialog)
        }
    })

    modalObserver.observe(body, {
        childList: true,
        subtree: false
    })

    // watch login button
    const listener = () => {
        modalDisabled = true
        setTimeout(() => {
            const close = document.querySelector('.Modal-closeButton')
            close.addEventListener('click', () => (modalDisabled = false))
        }, 100)
    }

    const headerClass = ['.AppHeader', '.ColumnPageHeader']
    const loginButtonObserverCallback = () => {
        const buttons = headerClass.map(clazz => Array.from(document.querySelectorAll(`${clazz} button`))).filter(a => a.length).flat()
        buttons.forEach(button => button.removeEventListener('click', listener))
        buttons.forEach(button => button.addEventListener('click', listener))
    }
    const loginButtonObserver = new MutationObserver(loginButtonObserverCallback)
    const header = headerClass.map(clazz => document.querySelector(clazz)).find(el => el)
    loginButtonObserver.observe(header, { childList: true, subtree: true })
    loginButtonObserverCallback()
})();
