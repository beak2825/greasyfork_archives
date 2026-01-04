// ==UserScript==
// @name  happy html keyboard player
// @name:zh-TW  happy html keyboard player
// @namespace  http://gholk.github.io
// @description  allow forward video with keyboard
// @description:zh-TW  allow forward video with keyboard
// @match https://www.ptsplus.tv/season/*
// @version  1.0.0
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/431399/happy%20html%20keyboard%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/431399/happy%20html%20keyboard%20player.meta.js
// ==/UserScript==

const config = {
    '公視勇者動畫系列': {
        regexp: /4b572dd5-bdc7-45a6-ba35-accfe9cda3df/,
        callback() {
            const list = document.querySelectorAll(
                'li.vjs-menu-item[role=menuitemradio]'
            )
            const button = Array.from(list).find(
                node => node.children[0]?.textContent == '480p'
            )
            if (button) {
                button.click()
                console.debug('click 480p')
                return 'done'
            }
        }
    }
}

function keepTry(callback) {
    let handleId
    handleId = setInterval(() => {
        if (callback() == 'done') clearInterval(handleId)
    }, 2)
}
function configSet() {
    for (const key in config) {
        const option = config[key]
        if (window.location.href.match(option.regexp)) {
            if (option.callback) keepTry(option.callback)
        }
    }
}

configSet()
let urlOld = window.location.href
keepTry(() => {
    const urlCurrent = window.location.href
    if (urlCurrent != urlOld) {
        urlOld = urlCurrent
        configSet()
    }
})

window.addEventListener('keydown', event => {
    const video = document.querySelector('video')
    const step = 5
    switch (event.key) {
    case 'ArrowRight':
    case 'Right':
        video.currentTime += step
        break
    case 'ArrowLeft':
    case 'Left':
        video.currentTime -= step
        break
    case ' ':
        if (video.paused) video.play()
        else video.pause()
        event.preventDefault()
        break
    }
})
