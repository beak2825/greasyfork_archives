// ==UserScript==
// @name         Doing nothing alert
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Play an alert once when title says "Doing nothing"
// @author       meee
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      ntfy.sh
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543840/Doing%20nothing%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/543840/Doing%20nothing%20alert.meta.js
// ==/UserScript==

(() => {
  const soundUrl = 'https://cdn.freesound.org/previews/241/241809_4404552-lq.mp3';

  const audio = new Audio();
  audio.loop = false;
  let audioUnlocked = false;
  let hasPlayed = false;

  async function loadAndUnlockAudio() {
    if (audioUnlocked) return;
    try {
      console.log('Fetching audio from', soundUrl);
      const response = await fetch(soundUrl);
      const blob = await response.blob();
      audio.src = URL.createObjectURL(blob);
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
      console.log('Audio loaded and unlocked');
    } catch (err) {
      console.warn('Audio fetch or unlock failed:', err);
    }
  }

  let ntfyTopic = GM_getValue('ntfyTopic', 'milkywayidle_' + Math.random().toString(36).substr(2, 8));
  let isNtfyEnabled = GM_getValue('isNtfyEnabled', false);

  function addNotificationModeUI() {
    if (!document.body) {
      window.addEventListener('load', addNotificationModeUI);
      return;
    }
    const existing = document.getElementById('ntfySettingsContainer');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'ntfySettingsContainer';
    Object.assign(container.style, {
      position: 'fixed', bottom: '10px', right: '10px',
      background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px',
      borderRadius: '5px', zIndex: '10000', fontSize: '12px'
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'ntfyEnable';
    checkbox.checked = isNtfyEnabled;
    checkbox.addEventListener('change', () => {
      isNtfyEnabled = checkbox.checked;
      GM_setValue('isNtfyEnabled', isNtfyEnabled);
    });

    const label = document.createElement('label');
    label.htmlFor = 'ntfyEnable';
    label.textContent = 'Enable "Doing nothing" notifications';
    label.style.marginLeft = '4px';

    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Sound';
    testBtn.style.marginLeft = '8px';
    testBtn.style.fontSize = '12px';
    testBtn.addEventListener('click', async () => {
      await loadAndUnlockAudio();
      if (audioUnlocked && !hasPlayed) {
        audio.play().catch(err => console.warn('Test play failed:', err));
      }
    });

    container.append(checkbox, label, testBtn);
    document.body.appendChild(container);
  }

  function checkForText() {
    const title = document.title.toLowerCase();
    const isDoingNothing = title.includes('doing nothing');

    if (isDoingNothing) {
      if (audioUnlocked && !hasPlayed) {
        audio.currentTime = 0;
        audio.play().catch(err => console.warn('Play error:', err));
        hasPlayed = true;
        console.log('Alert played once');
      } else if (!audioUnlocked) {
        loadAndUnlockAudio();
      }

      if (isNtfyEnabled) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://ntfy.sh/' + ntfyTopic,
          headers: { 'Title': 'Doing nothing detected!' },
          data: 'Title includes "Doing nothing".'
        });
      }
    } else {
      if (hasPlayed) {
        audio.pause();
        audio.currentTime = 0;
        hasPlayed = false;
        console.log('Reset alert state');
      }
    }
  }

  if (document.head) {
    window.addEventListener('load', () => {
      loadAndUnlockAudio();
      checkForText();
      const observer = new MutationObserver(checkForText);
      observer.observe(document.querySelector('title'), { childList: true });
      setInterval(checkForText, 500);
      addNotificationModeUI();
    });
  }
})();
