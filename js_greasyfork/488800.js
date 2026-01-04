// ==UserScript==
// @name       YT截圖screenshot
// @version       1.0.1
// @match         https://www.youtube.com/*
// @author        peng-devs,leadra
// @namespace     https://greasyfork.org/zh-TW/users/4839-leadra
// @description   YouTube截圖為JPG，檔案名稱為網頁標題+時間
// @icon          https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @grant         none
// @allFrames     true
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/488800/YT%E6%88%AA%E5%9C%96screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/488800/YT%E6%88%AA%E5%9C%96screenshot.meta.js
// ==/UserScript==
/*
YT快速鍵hotkeys
https://greasyfork.org/zh-TW/scripts/487719
搭配使用可用鍵盤快速鍵執行
*/
  //圖片格式
  var imageFormat = "jpeg"; //can be one of these: jpeg, png

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
        <svg viewBox="-6 -6 38 38" class="style-scope ytd-player">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                class="style-scope ytd-player"
                fill="#fff">
          </path>
        </svg>
      `

      button.onclick = () => {
        const video = document.querySelector('video')
        const canvas = document.createElement('canvas')
        canvas.width = video?.videoWidth
        canvas.height = video?.videoHeight
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)

        // download screenshot directly檔案名稱
        const link = document.createElement('a')

        const VideoElement = document.querySelector('video');
        const CurrentTime = VideoElement.currentTime;
        const Hours = Math.floor(CurrentTime / 3600);
        const Minutes = Math.floor((CurrentTime % 3600) / 60);
        const Seconds = Math.floor(CurrentTime % 60);
        const FormattedTime = `${Hours.toString().padStart(2, '0')}${Minutes.toString().padStart(2, '0')}${Seconds.toString().padStart(2, '0')}`;
        link.download = document.title + `-${FormattedTime}.${imageFormat === "jpeg" ? "jpg" : imageFormat}`

        //link.download = document.title +`-${Date.now()}`
        link.href = canvas.toDataURL("image/" + imageFormat);
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
