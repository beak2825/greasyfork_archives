// ==UserScript==
// @name         Pornhub Playlist Webpage Fullscreen
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a webpage fullscreen button allowing you to watch playlist in fullscreen.
// @author       shead
// @match        https://www.pornhub.com/view_video.php?*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412276/Pornhub%20Playlist%20Webpage%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/412276/Pornhub%20Playlist%20Webpage%20Fullscreen.meta.js
// ==/UserScript==

//Set video quality
const videoQuality ="1080"
window.onload = setTimeout(function(){
	if( window.location.pathname.indexOf("/gif/") != -1 ){
		document.getElementsByClassName("toggleGifWebmButton")[0].click();
	} else {
		localStorage.setItem("player_quality", '{"quality":"'+videoQuality+'"}');
	}
}, 1000);


//Fullscreen
(function() {
    'use strict';
    const headEle = document.querySelector('head'),
        style = document.createElement('style'),
        styleText = `
          .playerFlvContainer.fullscreen {
              position: fixed !important;
              z-index: 10000000;
             width: 100%;
             height: 100%;
             left: 0;
             top: 0;
          }`;
    style.innerHTML = styleText;
    headEle.append(style);

    function poll() {
       const wrap = document.querySelector('.mhp1138_front');
        if (!wrap) return setTimeout(poll, 1000);
        let btn = wrap.querySelector('.fullscreen');
        if (!btn) {
           btn = document.createElement("div");
           btn.setAttribute('style', 'float:right; margin-top: 10px;margin-right: 8px; cursor: pointer;');
           btn.title = 'webpage fullscreen';
           btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 451.111 451.111" height="16px" viewBox="0 0 451.111 451.111" width="16px" class=""><g><path d="m290 0 56.389 56.389-88.611 88.611 48.333 48.333 88.611-88.611 56.389 56.389v-161.111z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#CCCCCC"/><path d="m145 257.778-88.611 88.611-56.389-56.389v161.111h161.111l-56.389-56.389 88.611-88.611z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#CCCCCC"/><path d="m306.111 257.778-48.333 48.333 88.611 88.611-56.389 56.389h161.111v-161.111l-56.389 56.389z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#CCCCCC"/><path d="m161.111 0h-161.111v161.111l56.389-56.389 88.611 88.611 48.333-48.333-88.611-88.611z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#CCCCCC"/><style xmlns="" id="8dca7fd2-2718-4c92-9e83-fd40994931ba" class="active-path">.select-text-inside-a-link{ -moz-user-select: text!important; }</style></g> </svg>`
           const player = document.querySelector('.playerFlvContainer');
           const header = document.querySelector('#header');
           btn.addEventListener('click', () => {
              const className = 'fullscreen';
              if (player.classList.contains(className)) {
                header.style.display = 'grid';
                player.classList.remove(className);
                GM_setValue("wasFullScreen", "0");
                document.body.style.overflow = 'visible';
              } else {
                header.style.display = 'none';
                player.classList.add(className);
                GM_setValue("wasFullScreen", "1");
                document.body.style.overflow = 'hidden';
              }
           })
           wrap.append(btn);
        }
    }

    function autoFullscreen(){
        if(GM_getValue("wasFullScreen", "0") =="1")
        {
            const player = document.querySelector('.playerFlvContainer');
            if (!player) return setTimeout(autoFullscreen, 1000);

            const header = document.querySelector('#header');
            const className = 'fullscreen';

            header.style.display = 'none';
            player.classList.add(className);
            document.body.style.overflow = 'hidden';
        }
    }

    autoFullscreen();
    poll();

})();