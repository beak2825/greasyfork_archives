// ==UserScript==
// @name         Copilot Text-to-Speech 
// @namespace    https://copilot.microsoft.com/
// @version      1.0
// @author       CHJ85
// @description  Adds text-to-speech functionality to Copilot / Bing chat for all web browsers.
// @match        https://copilot.microsoft.com/chats*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541743/Copilot%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/541743/Copilot%20Text-to-Speech.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TTS_API = 'https://texttospeech.responsivevoice.org/v1/text:synthesize?lang=en-GB&engine=g1&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male&text=';
  let currentAudio = null;

  const injectSpeakerButtons = () => {
    document.querySelectorAll('[data-testid="share-message-button"]').forEach(shareBtn => {
      if (!shareBtn.parentElement.querySelector('.copilot-tts-button')) {
        const ttsBtn = document.createElement('button');
        ttsBtn.className = 'copilot-tts-button';
        ttsBtn.title = 'Listen to message';
        ttsBtn.style.marginLeft = '6px';
        ttsBtn.style.cursor = 'pointer';
        ttsBtn.innerHTML = getSVG('speaker');

        ttsBtn.onclick = () => {
          const messageBlock = shareBtn.closest('div[id*="-content-"]');
          const spans = messageBlock?.querySelectorAll('span.font-ligatures-none');
          const fullMessage = Array.from(spans).map(span => span.textContent.trim()).join(' ');
          if (!fullMessage) return;

          if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            ttsBtn.innerHTML = getSVG('speaker');
          } else if (currentAudio && currentAudio.paused) {
            currentAudio.play();
            ttsBtn.innerHTML = getSVG('pause');
          } else {
            const audioSrc = `${TTS_API}${encodeURIComponent(fullMessage)}`;
            console.log("🔊 Playing TTS from:", audioSrc);
            currentAudio = new Audio(audioSrc);
            currentAudio.onerror = e => console.error("Audio playback error:", e);
            currentAudio.onended = () => ttsBtn.innerHTML = getSVG('speaker');
            currentAudio.oncanplaythrough = () => {
              currentAudio.play();
              ttsBtn.innerHTML = getSVG('pause');
            };
          }
        };

        shareBtn.parentElement.appendChild(ttsBtn);
      }
    });
  };

  const getSVG = (type) => {
    if (type === 'pause') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    }
    // Speaker icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"/></svg>`;
  };

  const startObserving = () => {
    const observer = new MutationObserver(injectSpeakerButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    injectSpeakerButtons(); // Initial run
  };

  window.addEventListener('DOMContentLoaded', startObserving);
})();
