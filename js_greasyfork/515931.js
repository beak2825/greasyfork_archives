// ==UserScript==
// @name        Qobuz Auth Token ARL Login
// @namespace   https://gist.github.com/uhwot/8250904f3e4bfbad684c5ec26943e082
// @match       https://play.qobuz.com/*
// @grant       none
// @version     1.0+
// @author      uh wot
// @description allows logging in via auth tokens (ARL) on qobuz
// @homepageURL https://gist.github.com/uhwot/8250904f3e4bfbad684c5ec26943e082
// @icon        https://play.qobuz.com/resources/favicon/favicon-96x96.png
// @run-at      document-start
// @license     GPL-2.0-only

// @downloadURL https://update.greasyfork.org/scripts/515931/Qobuz%20Auth%20Token%20ARL%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/515931/Qobuz%20Auth%20Token%20ARL%20Login.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function ass() {
    if (window.location.pathname === "/login") {
        waitForElm("div.LoginPage__content").then((_) => {
            const element = document.querySelector("div.LoginPage__content")

            const div = document.createElement("div")
            div.setAttribute("style", "width: 100%")

            const p = document.createElement("p")
            p.innerText = "Token: (Enter'a bas)"
            p.setAttribute("style", "color: #000000 ")
            div.appendChild(p)

            const input = document.createElement("input")
            input.setAttribute("class", "SearchBar__input")
            input.setAttribute("type", "password")
            input.setAttribute("style", "padding: 0px 10px 0px 10px; width: 100%")

            input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault()
                    localStorage.setItem("shitass", input.value)
                    window.location = "https://play.qobuz.com/featured?code_autorisation=!shitass!"
                }
            })

            div.appendChild(input)

            element.appendChild(div)
        })
    }
}

const token = localStorage.getItem("shitass")
if (window.location == "https://play.qobuz.com/featured?code_autorisation=!shitass!" && token !== null) {
    localStorage.removeItem("shitass")

    window.fetch = (function (fetch) {
        return async function (url, init) {
            if (url.startsWith("https://www.qobuz.com/api.json/0.2/oauth/callback?code=!shitass!")) {
                window.fetch = fetch
                return new Response(JSON.stringify({
                    token: token,
                    user_id: "1"
                }))
            }

            return await fetch(url, init)
        }
    })(window.fetch);
}

window.addEventListener('load', function() {
    ass()

    const replaceState = window.history.replaceState
    Object.defineProperty(window.history, 'replaceState', {
        get(_) {return function() {
            replaceState.apply(window.history, arguments)
            ass()
        }},
        set(_) {},
    });

    const pushState = window.history.pushState
    Object.defineProperty(window.history, 'pushState', {
        get(_) {return function() {
            pushState.apply(window.history, arguments)
            ass()
        }},
        set(_) {},
    });
}, false)