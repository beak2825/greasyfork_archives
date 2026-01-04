// ==UserScript==
// @name         Cardmarket show thumbnails
// @namespace    http://tampermonkey.net/
// @version      2025-04-29-001
// @description  Open all thumbnails at once so you don't have to hover over each item.
// @author       You
// @match        https://www.cardmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492453/Cardmarket%20show%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/492453/Cardmarket%20show%20thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const icons = [...document.querySelectorAll('.thumbnail-icon')]
    if (icons.length > 0) {
        const button = document.createElement('button')
        button.innerText = 'Open all thumbnails'
        button.classList.add('btn', 'btn-outline-primary')
        button.style.position = 'fixed'
        button.style.bottom = 0
        button.style.margin = '0.5rem'
        button.addEventListener('click', () => {
            button.classList.toggle('active')
            const show = button.classList.contains('active')
            if (show) {
                icons.forEach(icon => {
                    const tr = icon.closest('tr,.row')
                    const anchor = tr.querySelector('a[href*="Products"],.card-name,.name')
                    if (anchor) {
                        const wrapper = document.createElement('div')
                        wrapper.classList.add('thumbnail-tmp-image')
                        wrapper.innerHTML = icon.dataset.bsTitle
                        wrapper.children[0].style.maxHeight = '300px'
                        wrapper.children[0].style.objectFit = 'cover'
                        wrapper.children[0].style.objectPosition = 'top'
                        wrapper.style.maxHeight = '185px'
                        wrapper.style.flexBasis = '100%'
                        wrapper.style.overflowY = 'hidden'
                        anchor.parentElement.style.flexWrap = 'wrap'
                        anchor.insertAdjacentElement('afterend', wrapper)
                    }
                })
            }
            else {
                [...document.querySelectorAll('.thumbnail-tmp-image')].forEach(item => item.parentElement.removeChild(item))
            }
        })

        document.body.appendChild(button)
    }

})();