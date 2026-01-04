// ==UserScript==
// @name        YouTube Alternative frontends
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/watch?v=*
// @grant       none
// @version     1.1
// @author      -
// @description 10/21/2023, 2:15:40 PM
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @run-at document-end
 // @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477974/YouTube%20Alternative%20frontends.user.js
// @updateURL https://update.greasyfork.org/scripts/477974/YouTube%20Alternative%20frontends.meta.js
// ==/UserScript==
setInterval(
  function() {
    let subButton = document.querySelector("#subscribe-button")
    let videoId = window.location.href;
    videoId = videoId.substring(videoId.search("=") + 1)
    let frontendLinks =
    [
      ["Piped", "https://piped.video/watch?v=" + videoId],
      ["Invidious", "https://yewtu.be/watch?v=" + videoId]
    ];


    let button;
    let youtubeButtonAttrs = 'class="yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m" type="button" id="dropdownMenuButton" aria-haspopup="true" aria-expanded="false" style="padding: 10px; margin: 10px;"'
    for (let i = 0; i < frontendLinks.length; i++){
      button = $("#" + frontendLinks[i][0])
      if (button){
        button.remove()
      }
      button = $(
        `
          <div class="style-scope ytd-watch-metadata"id="${frontendLinks[i][0]}">
            <button ${youtubeButtonAttrs}>
              <a href="${frontendLinks[i][1]}" target="_blank">
                ${frontendLinks[i][0]}
              </a>
            </button>
          </div>
        `
      )
      subButton.parentNode.insertBefore(button[0], subButton);
    }
  },
  3000
)