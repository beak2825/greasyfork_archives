// ==UserScript==
// @name          Auto expand and/or darken
// @version       2.1.0
// @description   The script auto expands, and/or darkens, the video player when the page loads, without the need for clicking anything.
// @namespace     JustGotenks
// @license       MIT
// @match         https://zoro.to/watch/*
// @grant         GM_addStyle
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/448814/Auto%20expand%20andor%20darken.user.js
// @updateURL https://update.greasyfork.org/scripts/448814/Auto%20expand%20andor%20darken.meta.js
// ==/UserScript==


const autoExpand = true;

const autoDark = true;

const secondsToWait = 4;



// Sets the background color when the light is switched to 'off'.
// You can change it to any color.
GM_addStyle(`
#mask-overlay {
  background-color: black;
}
`);


const start = async () => {

  const element = (selector) => {
    return new Promise(resolve => {
      const ele = document.querySelector(selector);
      // if element already exists, return it. (no need for observer)
      if(ele) {
        resolve(ele);
        return;
      }
      // starts observing the document for "ele".
      new MutationObserver((_, observer) => {
        // if "ele" found, then return it and stop observer.
        if(ele) {
          resolve(ele);
          observer.disconnect();
        }
      })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });

    });
  };

  const switches = () => {
    if(autoExpand && resizeBtn.textContent === 'Expand') {
      resizeBtn.click();
    }
    if(autoDark && !switchBtn.classList.contains('off')) {
      switchBtn.click();
    }
  };

  const addSwitchToSeekButtons = async () => {
    const prevBtn = await element('.block-prev');
    const nextBtn = await element('.block-next');
    prevBtn.addEventListener('click', switches);
    nextBtn.addEventListener('click', switches);
  };

  const addSwitchToEpisodeButtons = async () => {
    const episodeBtnsContainer = await element('#detail-ss-list');
    const episodeBtns = episodeBtnsContainer.querySelectorAll('.ep-item');
    for(let btn of episodeBtns) {
      btn.addEventListener('click', switches);
    }
  };


  const resizeBtn = await element('#media-resize');
  const switchBtn = await element('#turn-off-light');
  switches();

  addSwitchToSeekButtons();

  setTimeout(addSwitchToEpisodeButtons, 1000 * secondsToWait);
};



start();
