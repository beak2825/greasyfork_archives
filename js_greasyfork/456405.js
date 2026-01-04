// ==UserScript==
// @name         Nitterify
// @namespace    *
// @version      0.3
// @description  Turns all twitter.com links into nitter.net links
// @author       DarkWiiPlayer
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitter.net
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/456405/Nitterify.user.js
// @updateURL https://update.greasyfork.org/scripts/456405/Nitterify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stylesheet = `
        div {
            position: fixed;
            color: white;
            left: 0;
            bottom: 0; /* this is me */
            padding: 1em;
            transition: opacity .3s;
        }
        .hidden {
            opacity: 0;
        }
        a {
            color: inherit;
            text-decoration: none;
        }
    `

    const nitterify = link => {
        const url = new URL(link)
        if (url.host == "twitter.com") {
            url.host = "nitter.net"
        }
        return url
    }

    const nitterifyTree = subtree => {
        if (HTMLElement.prototype.isPrototypeOf(subtree)) {
            subtree.querySelectorAll(`a[href]`).forEach(link => {
                link.href = nitterify(link.href)
            })
        }
    }

    const observer = new MutationObserver(list => {
        list.forEach(mutation => {
            mutation.addedNodes.forEach(nitterifyTree)
        })
    })

    const blacklist = new Set([
        "home"
    ])

    const url = new URL(location)
    if (url.host == "twitter.com") {
        /* Inject ✨magic✨ to get location change events */
        const old = { pushState: history.pushState, replaceState: history.replaceState }
        history.pushState = function(...params) {
            old.pushState.call(history, ...params)
            window.dispatchEvent(new CustomEvent("locationchange"))
        }
        history.replaceState = function(...params) {
            old.replaceState.call(history, ...params)
            window.dispatchEvent(new CustomEvent("locationchange"))
        }
        window.addEventListener("popstate", event => {window.dispatchEvent(new CustomEvent("locationchange"))})

        const nitterButton = document.createElement("nitter-button")
        const shadow = nitterButton.attachShadow({mode: "open"})
        url.host = "nitter.net"
        shadow.innerHTML = `<style>${stylesheet}</style><div><a href="${url}">View on <b>Nitter</b></a></div>`
        document.body.append(nitterButton)
        const update = () => {
            shadow.querySelector("a").href = nitterify(location)
            const div = shadow.querySelector("div")
            const page = new URL(location).pathname.match(/[^/]+/)[0]
            if (blacklist.has(page)) {
                div.classList.add("hidden")
            } else {
                div.classList.remove("hidden")
            }
        }
        window.addEventListener('locationchange', update)
        update()
    } else {
        observer.observe(document, {childList: true, subtree: true})
        nitterifyTree(document)
    }
})();