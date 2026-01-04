// ==UserScript==
// @name         Mastodon - Collapse Media in Notifications By Default
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Adds a collapsible toggle to posts in your notifications for media
// @author       LupoMikti
// @license      MIT
// @match        https://mastodon.social/*
// @match        https://mstdn.jp/*
// @match        https://mastodon.art/*
// @match        https://pawoo.net/*
// @match        https://baraag.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mastodon.social
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482767/Mastodon%20-%20Collapse%20Media%20in%20Notifications%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/482767/Mastodon%20-%20Collapse%20Media%20in%20Notifications%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = `.media-toggle {
    margin-top: 10px;
    margin-inline-start: 48px;
    width: calc(100% - 48px);
    & span {
        cursor: pointer;
    }
}

.notification-ungrouped:not(.notification-ungrouped--unread) .media-toggle span {
    color: #606984;
    filter: brightness(1.5);
}

article:not([data-toggle-open]) .notification-ungrouped .status > .media-gallery,
article:not([data-toggle-open]) .notification-ungrouped .status > .media-gallery__item,
article:not([data-toggle-open]) .notification-ungrouped .status div:has(.video-player),
article[data-toggle-open="false"] .notification-ungrouped .status > .media-gallery,
article[data-toggle-open="false"] .notification-ungrouped .status > .media-gallery__item,
article[data-toggle-open="false"] .notification-ungrouped .status div:has(.video-player) {
    display: none;
}

.notification-ungrouped .status-card.expanded .status-card__image {
    visibility: collapse;
}
`

    // This waits until we have the notifications response JSON then makes the script wait 1 second more for all DOM changes to take place
    var origOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            // console.log('XHR finished loading', method, this.status, url);
            if (url.includes('api/v2/notifications?') && window.location.pathname.includes(`/notifications`)) {
                return setTimeout(init, 1000)
            }
        })

        this.addEventListener('error', function() {
            console.log('XHR errored out', method, url)
        })
        origOpen.apply(this, arguments)
    }

    window.addEventListener('load', () => {
        let oldHref = document.location.href
        const bodyObserver = new MutationObserver((mutationList) => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href
                refreshScript()
            }
        })
        bodyObserver.observe(document.body, {childList: true, subtree: true})
    })

    // We cannot inject a style element without the nonce, so get it and use it
    let styleNonce = document.querySelector('meta[name=style-nonce]').content
    document.head.insertAdjacentHTML('beforeend',`<style id="notif-media-toggle-css" nonce="${styleNonce}">${css}</style>`)

    let notificationColumn

    window.addEventListener('popstate', refreshScript)

    function init() {
        notificationColumn = document.querySelector('.column[aria-label="Notifications"] .item-list')
        let initialPostsWithMedia = document.querySelectorAll(`.item-list article[style=""] .notification-ungrouped .status > .media-gallery,
            .item-list article[style=""] .notification-ungrouped .status > .media-gallery__item,
            .item-list article[style=""] .notification-ungrouped .status div:has(.video-player),
            .item-list article:not(article[style]) .notification-ungrouped .status > .media-gallery,
            .item-list article:not(article[style]) .notification-ungrouped .status > .media-gallery__item,
            .item-list article:not(article[style]) .notification-ungrouped .status div:has(.video-player)`)

        initialPostsWithMedia.forEach((mediaSection) => {insertToggle(mediaSection)})

        startObserving()
    }

    function refreshScript() {
        if (!document.location.pathname.includes(`/notifications`)) return
        return setTimeout(init, 500)
    }

    function getAncestorWithDataId(node) {
        while (node && Array.from(node.attributes).every(attr => attr.name !== 'data-id')) {
            node = node.parentNode
        }
        return node
    }

    // Inserts the toggle span into a post
    function insertToggle(mediaSection, parentElementId = null, wasKeptOpen = 'false') {
        if (!mediaSection) return
        if (mediaSection.parentNode.querySelector('.media-toggle')) return
        const showingMedia = (wasKeptOpen === 'true')
        if (!parentElementId) {
            parentElementId = getAncestorWithDataId(mediaSection)?.getAttribute('data-id')
        }
        if (!parentElementId) {
            console.error("Failed to retrieve the element with the corresponding data-id")
            return
        }
        const targetSelector = mediaSection.className ? mediaSection.className.split(' ').map(name => `.${name}`).join('') : 'div:has(>.video-player)'
        mediaSection.insertAdjacentHTML('beforebegin',
            `<div class="media-toggle" data-toggle-target="[data-id='${parentElementId}'] ${targetSelector}"><span>Click to ${showingMedia ? 'hide' : 'show'} media</span></div>`)
        mediaSection.parentNode.querySelector('.media-toggle').addEventListener('click', doToggle)
    }

    // Click handler for the toggle span
    function doToggle(event) {
        if(event.target.nodeName !== 'SPAN') return
        let toggle = event.currentTarget
        let toggleTargetSelector = toggle?.getAttribute('data-toggle-target')
        let parentElementSelector = toggleTargetSelector?.split(' ')[0]
        let toggleTarget = document.querySelector(toggleTargetSelector)
        let parentElement = document.querySelector(parentElementSelector)
        if (!toggleTarget.checkVisibility()) {
            parentElement.setAttribute('data-toggle-open', 'true')
            toggleTarget.style = toggleTarget.style.cssText + "display: grid;"
            toggle.childNodes[0].innerText = "Click to hide media"
        }
        else {
            parentElement.setAttribute('data-toggle-open', 'false')
            toggleTarget.style = toggleTarget.style.cssText.replace("display: grid;", "")
            toggle.childNodes[0].innerText = "Click to show media"
        }
    }

    // Mutation observer needed because page dynamicaly hides + removes/adds post content as you scroll
    function startObserving() {
        const observeColumn = (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes') {
                    const article = mutation.target
                    if (article.nodeName !== 'ARTICLE') continue // if the target is not an article element skip
                    if (!mutation.oldValue) continue // if the target's old attribute value is empty, skip
                    if (article.style.cssText) continue // if the target article's style attribute is NOT being changed to empty, skip
                    insertToggle(article.querySelector('.notification-ungrouped .status > .media-gallery, .notification-ungrouped .status > .media-gallery__item, .notification-ungrouped .status div:has(.video-player)'),
                                 article.getAttribute('data-id'),
                                 article.getAttribute('data-toggle-open') || 'false')
                }

                if (mutation.type === 'childList') {
                    const parent = mutation.target
                    let movedNodes = []
                    if (mutation.addedNodes.length > 0) {
                        movedNodes = Array.from(mutation.addedNodes)
                        if (!(parent.matches('div.status') && parent.hasAttribute('data-id') && movedNodes.some(node => node.matches('.media-gallery, .media-gallery__item, div:has(.video-player)')))) continue // if the target is not the parent of the media container we want, skip
                        if (parent.hasAttribute('data-toggle-open') && parent.getAttribute('data-toggle-open') === 'true') {
                            let mediaNode = movedNodes.find(node => node.matches('.media-gallery, .media-gallery__item, div:has(.video-player)'))
                            mediaNode.style = mediaNode.style.cssText + " display: grid;"
                        }
                        insertToggle(parent.querySelector('.media-gallery, .media-gallery__item, div:has(.video-player)'),
                                 parent.getAttribute('data-id'),
                                 parent.getAttribute('data-toggle-open') || 'false')
                    }

                    if (mutation.removedNodes.length > 0) {
                        movedNodes = Array.from(mutation.removedNodes)
                        if (!(parent.matches('div.status') && parent.hasAttribute('data-id') && movedNodes.some(node => node.matches('.media-gallery, .media-gallery__item, div:has(.video-player)')))) continue // if the target is not the parent of the media container we want, skip
                        parent.querySelector('.media-toggle').replaceWith()
                    }
                }
            }
        }

        const observer = new MutationObserver(observeColumn)
        observer.observe(notificationColumn, {
            subtree: true,
            attributeFilter: ["style"],
            attributeOldValue: true
        })

        const observer2 = new MutationObserver(observeColumn)
        observer2.observe(notificationColumn, { subtree: true, childList: true })
    }
})();
