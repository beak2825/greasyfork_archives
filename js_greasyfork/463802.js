// ==UserScript==
// @name         Remove Reddit Login Requirement
// @namespace    socuul.reddit_rem_loginreq
// @version      1.0.8
// @description  Remove the on-screen modal that forces you to log in for certain posts.
// @author       SoCuul
// @license      MIT
// @match        http://*.reddit.com/*
// @match        https://*.reddit.com/*
// @icon         https://reddit.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/463802/Remove%20Reddit%20Login%20Requirement.user.js
// @updateURL https://update.greasyfork.org/scripts/463802/Remove%20Reddit%20Login%20Requirement.meta.js
// ==/UserScript==

(function() {
    const mainContent = document.querySelector('.sidebar-grid')
    mainContent?.setAttribute('style', mainContent.attributes?.getNamedItem('style')?.nodeValue?.replace(/filter: blur\(4px\);/g, ''))

    // Prevents fullscreen "are you sure" modals
    const domains = [ 'reddit.com', 'www.reddit.com' ]
    domains.forEach(domain => {
        GM_cookie.set({
            name: 'over18',
            value: 'true',
            domain: domain,
            path: '/',
            httpOnly: false
        })
    })

    //Remove other elements
    const observerOptions = { subtree: true, childList: true }
    const mObserver = new MutationObserver(function() {

        // Disable scroll prevention
        const body = document.querySelector('body')
        body?.setAttribute('style', body.attributes?.getNamedItem('style')?.nodeValue?.replace(/pointer-events: none; overflow: hidden;/g, ''))

        const overlays = [
            document.querySelector('xpromo-nsfw-blocking-modal-desktop'),
            document.querySelector('xpromo-nsfw-bypassable-modal-desktop'),
            document.querySelector('xpromo-nsfw-blocking-container')?.shadowRoot?.querySelector('.prompt'),
            document.querySelector('#nsfw-qr-dialog'),
            document.querySelector('div[style*="position: fixed"][style*="inset: 0px"][style*="backdrop-filter: blur(4px)"]'), // blurred screen
            document.querySelector('faceplate-modal:has(> div.text-category-nsfw)') // mature content blocking modal

        ]

        // Remove visual overlays
        overlays
            .filter(o => o)
            .forEach(o => o?.remove())

        // Automatically deal with blurred containers
        document.querySelectorAll('shreddit-blurred-container')
            .forEach(container => {
                //if (container?.handleNsfwEvent) container.handleNsfwEvent = () => {}
                if (!container?.isNsfwAllowed) container.isNsfwAllowed = true
                if (container?.handleClick) container.handleClick()

                // Remove inline blur (The added blur on top of the image cdn builtin blur)
                // const inlineBlur = container?.shadowRoot?.querySelector('.blurred')
                // if (inlineBlur) {
                //     inlineBlur.style = ''
                //     inlineBlur.className = inlineBlur.className.replace('blurred', '')
                // }

                // Replace blurred image (only shows first image, and badly)
                // const imageEl = container?.querySelector('img')
                // if (imageEl && imageEl?.src) {
                //     imageEl.src = imageEl.src.replace('preview.redd.it', 'i.redd.it')
                // }
            })

        document.querySelectorAll('xpromo-nsfw-blocking-container')
            .forEach(container => {
                if (!container.shadowRoot) return

                const prompt = container.shadowRoot.querySelector('div.prompt')
                if (!prompt) return

                prompt.style = 'display: none !important'
            })

    })

    mObserver.observe(document, observerOptions)

})();