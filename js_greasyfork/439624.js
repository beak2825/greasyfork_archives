// ==UserScript==
// @name         Html5VideoShortcut
// @namespace    com.gmail.fujifruity.greasemonkey
// @version      0.1
// @description  YouTube-like keyboard shortcuts for HTML5 video.
// @author       fujifruity
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439624/Html5VideoShortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/439624/Html5VideoShortcut.meta.js
// ==/UserScript==

{
    const Shortcut = (run, msg) => ({
        run: run,
        msg: msg
    })
    const getShortcut = (v /*video*/, key) =>
        // Play/Pause
         key == 'k' || key == ' ' ? Shortcut(() => v.paused ? v.play() : v.pause(), v.paused ? 'play' : 'pause') :
        // Seek
         key == 'j' ?               Shortcut(() => v.currentTime -= 10,     '-10s') :
         key == 'l' ?               Shortcut(() => v.currentTime += 10,     '+10s') :
         key == 'ArrowLeft' ?       Shortcut(() => v.currentTime -= 5,      '-5s') :
         key == 'ArrowRight' ?      Shortcut(() => v.currentTime += 5,      '+5s') :
         key == ',' ?               Shortcut(() => v.currentTime -= 0.0333, '') :
         key == '.' ?               Shortcut(() => v.currentTime += 0.0333, '') :
         '0' <= key && key <= '9' ? Shortcut(() => v.currentTime = parseInt(key) * v.duration / 10, key + '/10') :
        // Volume
         key == 'ArrowDown' ?       Shortcut(() => v.volume -= 0.1, parseInt(v.volume * 100) - 10 + '%') :
         key == 'ArrowUp' ?         Shortcut(() => v.volume += 0.1, parseInt(v.volume * 100) + 10 + '%') :
         key == 'm' ?               Shortcut(() => v.muted = !v.muted, v.muted ? 'unmute' : 'mute') :
        // Speed
         key == '<' && v.playbackRate >= 0.50 ? Shortcut(() => v.playbackRate -= 0.25, v.playbackRate - 0.25 + 'x') :
         key == '>' && v.playbackRate <= 1.75 ? Shortcut(() => v.playbackRate += 0.25, v.playbackRate + 0.25 + 'x') : null

    const modalTimeout = 400
    const modalId = 'fujifruity-Html5VideoShortcut'
    const showMsg = (v, msg) => {
        const modal = document.getElementById(modalId) ?? createModal()
        modal.innerText = msg
        const vrect = v.getBoundingClientRect()
        const top = vrect.y + vrect.height / 2 - modal.height / 2 //+ document.documentElement.scrollTop
        const left = vrect.x + vrect.width / 2 - modal.width / 2 //+ document.documentElement.scrollLeft
        modal.style.top = parseInt(top) + 'px'
        modal.style.left = parseInt(left) + 'px'
        modal.style.position = 'absolute'
        document.body.appendChild(modal)
        window.setTimeout(() => modal.remove(), modalTimeout)
    }
    const createModal = () => {
        const modal = document.createElement('div')
        modal.id = modalId
        modal.width = 80
        modal.height = 50
        modal.style.width = modal.width + 'px'
        modal.style.height = modal.height + 'px'
        modal.style.lineHeight = modal.height + 'px'
        modal.style.textAlign = 'center'
        modal.style.color = 'lightgray'
        modal.style.fontFamily = 'sans-serif'
        modal.style.backgroundColor = '#000000aa'
        return modal
    }

    window.addEventListener('keydown', event => {
        if (event.target.tagName != 'VIDEO') return
        if (event.ctrlKey || event.altKey || event.metaKey) return
        const v = event.target
        const shortcut = getShortcut(v, event.key)
        if (shortcut) {
            shortcut.run()
            if (shortcut.msg) showMsg(v, shortcut.msg)
            event.preventDefault()
        }
    })
}