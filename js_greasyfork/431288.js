// ==UserScript==
// @name     facebook notification sender
// @namespace http://gholk.github.io
// @description send browser notification when getting notification on facebook.
// @version  3.3.0
// @match    https://www.facebook.com/*
// @grant    GM.notification
// @grant    window.focus
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/431288/facebook%20notification%20sender.user.js
// @updateURL https://update.greasyfork.org/scripts/431288/facebook%20notification%20sender.meta.js
// ==/UserScript==

const option = {
    icon: document.querySelector('link[rel~=icon]')?.href ||
        'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico',
    title: 'facebook notify'
}

function findNotify(node = document.body) {
    for (const notify of node.querySelectorAll('[aria-atomic = true]')) {
        if (notify.textContent != '所有通知都已標示為已讀。') {
            return notify
        }
    }
}
function sendGmNotify(node) {
    const title = option.title
    const image = option.icon
    const message = node.textContent
    GM.notification(message, title, image, () => {
        window.focus()
        const anchor = node.previousElementSibling.querySelector('a')
        anchor.click()
    })
}
function pageInBackGround() {
    return document.visibilityState != 'visible'
}
const observer = new MutationObserver(mulist => {
    for (const mutation of mulist) {
        if (mutation.type == 'childList') {
            const node = mutation.target
            const notify = findNotify(node)
            if (notify && pageInBackGround()) sendGmNotify(notify)
        }
    }
})
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
})

let titleLastChange = Date.now()
new MutationObserver(list => {
    const mutation = list[0]
    console.debug('title mutation', list[0].target)
    const message = list[0].target.textContent
    if (!/^\(\d+\)\sFacebook$/.test(message) && pageInBackGround()) {
        const now = Date.now()
        if (now - titleLastChange > 10 * 1000) {
            GM.notification(
                message, option.title, option.icon, () => window.focus()
            )
        }
        titleLastChange = now
    }
}).observe(
    document.getElementsByTagName('title')[0],
    // document.head,
    {subtree: true, childList: true, characterData: true}
)
