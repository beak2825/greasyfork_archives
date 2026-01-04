// ==UserScript==
// @name          YouTube Video Screenshot
// @version       1.0.6
// @match         https://www.youtube.com/**
// @author        peng-devs
// @namespace     https://greasyfork.org/users/57176
// @description   Add video screenshot button for YouTube
// @icon          https://www.youtube.com/s/desktop/c1d331ff/img/favicon_48x48.png
// @grant         none
// @allFrames     true
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/466259/YouTube%20Video%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/466259/YouTube%20Video%20Screenshot.meta.js
// ==/UserScript==

(function() {
  'use strict'


  const NAME = 'YouTube Video Screenshot'


  function main() {
    if (!location.pathname.startsWith('/watch') &&
       !location.pathname.startsWith('/live'))
      return

    const observer = new MutationObserver(_ => {
      if (document.getElementById('yt-ss-btn')) return

      const control_bar = document.querySelector('#movie_player .ytp-right-controls')
      if (!control_bar) return

      console.log(`[${NAME}] initializing...`)

      const button = document.createElement("button")
      button.id = 'yt-ss-btn'
      button.title = 'Screenshot'
      button.className = 'ytp-button style-scope ytd-player'
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
          <g fill="none">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path fill="currentColor" d="M20 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2H4v14h.929l9.308-9.308a1.25 1.25 0 0 1 1.768 0L20 13.686zm-4.879 6.636L7.757 19H20v-2.485zM7.5 7a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3" />
          </g>
        </svg>
      `

      button.onclick = () => {
        const video = document.querySelector('video')
        const canvas = document.createElement('canvas')
        canvas.width = video?.videoWidth
        canvas.height = video?.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)

        // download screenshot directly
        const link = document.createElement('a')
        link.download = `yt-screenshot-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
      }

      // place button on the player control bar
      control_bar.prepend(button)

      observer.disconnect()
      console.log(`[${NAME}] loaded`)
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  main()
  document.addEventListener('yt-navigate-finish', main, true)

})();
