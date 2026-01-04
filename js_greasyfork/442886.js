// ==UserScript==
// @name         Teams Auto-Expand Chat
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Auto-Expand Chats Topics
// @author       FHaze
// @match        https://teams.microsoft.com/_
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442886/Teams%20Auto-Expand%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/442886/Teams%20Auto-Expand%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isUrlChat = url => url.startsWith("https://teams.microsoft.com/_#/conversations") && url.contains("ctx=channel") && !url.contains("replyChainId")

    const doMagic = () => {
        const links = Array.from(document.querySelectorAll("[data-tid=messageBodyCollapsedString]"))
          .filter(l => !l.children[2].innerHTML.contains("Collapse all"))
        console.log(`[Teams Auto-Expand Chat] Expanding ${links.length} tabs`)
        links.forEach(l => l.click())
        setTimeout(() => { document.querySelectorAll("virtual-repeat")[0].scrollTop = 1_000_000_000 }, 200)
    }

    const addEventsListeners = () => {
        const channelList = document.querySelectorAll("li.animate-channel-item")
        console.log(`[Teams Auto-Expand Chat] Adding click listener for ${channelList.length} channels`)
        channelList.forEach(ch => {
            ch.removeEventListener("click", doMagic)
            ch.addEventListener("click", doMagic)
        })
    }

    const addHeaderEventsListeners = () => {
        const channelList = document.querySelectorAll("h3.channel-list-team-header")
        console.log(`[Teams Auto-Expand Chat] Adding click listener for ${channelList.length} header channels`)
        channelList.forEach(ch => {
            ch.removeEventListener("click", addEventsListeners)
            ch.addEventListener("click", addEventsListeners)
        })
    }

    const chatReady = callback => {
        let tries = 0
        let maxTries = 20
        console.log(`[Teams Auto-Expand Chat] Trying to auto-expand topics (maxTries=${maxTries})`)
        const verifyChat = setInterval(() => {
            if (document.querySelectorAll(".ts-message").length === 0) {
                console.log(`[Teams Auto-Expand Chat] Chat not ready (try=${tries})`)
                tries++
                if (tries === maxTries) {
                    clearInterval(verifyChat)
                }
                return
            }
            // Chat is ready
            console.log("[Teams Auto-Expand Chat] Chat is ready")
            callback()
            clearInterval(verifyChat)
        }, 500)
    }

    const TeamsAutoExpand = ({chatMonted}) => {
        window.onhashchange = e => {
            if (isUrlChat(e.newURL) && !isUrlChat(e.oldURL)) {
                chatReady(() => {
                    chatMonted()
                    addEventsListeners()
                    addHeaderEventsListeners()
                })
            }
        }
        chatReady(() => {
            chatMonted()
            addEventsListeners()
            addHeaderEventsListeners()
        })
    }

    TeamsAutoExpand({
        chatMonted: () => doMagic()
    })
})();
