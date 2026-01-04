// ==UserScript==
// @name         SoundGasm Additional Buttons
// @namespace    https://github.com/ikeman2003/UserscriptRepo
// @version      0.2.3
// @description  Adds a download button and copy link button to the page
// @author       ikeman2003
// @match        https://soundgasm.net/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/466296/SoundGasm%20Additional%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/466296/SoundGasm%20Additional%20Buttons.meta.js
// ==/UserScript==

GM_addStyle(`
a.download-button, a.copy-link-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;
  margin-top: 5px;
}

a.copy-link-button {
  background-color: #2196F3;
}

a.copy-link-button.copied {
  background-color: #4CAF50;
}

@keyframes blink {
  from, to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

a.copy-link-button .copy-status {
  animation: blink 2s linear;
}
`);

function forceDownload(href) {
    var anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = href;
    anchor.click();
}

(function () {
  'use strict';

  function waitForAudio() {
      const src_el = document.getElementById("jp_audio_0");
      const title_el = document.getElementsByClassName("jp-title");
      if (src_el && title_el.length !== 0) {
          const src = src_el.src;
          const title = title_el[0].textContent;
          if (src && src.length > 4 && title) {
              const downloadLink = document.createElement("a");
              downloadLink.href = src;
              downloadLink.download = title+".m4a";
              downloadLink.textContent = "Download Link";
              downloadLink.classList.add("download-button");
              downloadLink.target = "_blank";
              document.body.appendChild(downloadLink);

              const copyLinkButton = document.createElement("a");
              copyLinkButton.href = "#";
              copyLinkButton.textContent = "Copy Link";
              copyLinkButton.classList.add("copy-link-button");
              copyLinkButton.onclick = () => {
                  navigator.clipboard.writeText(window.location.href);
                  copyLinkButton.innerHTML = '<span class="copy-status">Copied!</span>';
                  copyLinkButton.classList.add("copied");
                  setTimeout(() => {
                      copyLinkButton.innerHTML = 'Copy Link';
                      copyLinkButton.classList.remove("copied");
                  }, 2000);
              };
              document.body.appendChild(copyLinkButton);
          } else {
              console.log('[AdditionalButtons] Waiting...');
              setTimeout(waitForAudio, 250);
          }
      } else {
          console.log('[AdditionalButtons] Waiting...');
          setTimeout(waitForAudio, 250);
      }
  }
  waitForAudio();
})();
