// ==UserScript==
// @name         Universal Autoplay Stopper
// @version      0.8
// @description  Aims to prevent autoplay on any streaming service!
// @match        https://*/*
// @namespace https://greasyfork.org/users/189717
// @downloadURL https://update.greasyfork.org/scripts/479417/Universal%20Autoplay%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/479417/Universal%20Autoplay%20Stopper.meta.js
// ==/UserScript==

(() => {
    const setLastUserAction = () => {
        localStorage.setItem('last user action', Date.now())
    }

    ['click', 'keydown'].forEach((type) => {
        document.addEventListener(type, setLastUserAction)

        // Listen on this element for Netflix, because events don't bubble up to document.
        const watchVideoElement = document.querySelector('.watch-video')
        if(watchVideoElement){
            watchVideoElement.addEventListener(type, setLastUserAction)
        }
    })

    setInterval(() => {
        document.querySelectorAll('video').forEach((v) => {
            const timeSinceAction = Date.now() - (localStorage.getItem('last user action') ?? 0)
            if(v.currentTime < 30 && timeSinceAction > 60000 && !v.paused){
                v.pause()
            }
        })
    }, 1000)
})()