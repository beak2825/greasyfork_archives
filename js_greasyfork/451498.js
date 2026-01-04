// ==UserScript==
// @name         Persianizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto-set auto-AI-translated persian subtitle of youtube videos if available
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451498/Persianizer.user.js
// @updateURL https://update.greasyfork.org/scripts/451498/Persianizer.meta.js
// ==/UserScript==

//represents clicked buttons (to turn on and change subtitle)

window.addEventListener('load', function () {
function changeSubtitleLanguage(language) {
  let steps = 0;
  const subtitleBtn = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-button.ytp-subtitles-button");
  const settingBtn = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-button.ytp-settings-button");
  // helper function:
  // select by css selector,
  // or by selector & text
  function selectItem(node, selector, text) {
    if (text) {
      return Array.from(node.querySelectorAll(selector))
       .find(el => el.innerText.includes(text));
    } else {
      return node.querySelector(selector);
    }
  }
  const observer = new MutationObserver((records) => {
    const subtitleChosen = selectItem(document, '.ytp-subtitles-button.ytp-button[aria-pressed="true"]');
    // check if subtitle chosen
    if (subtitleChosen && steps === 0) {
      steps += 1;
      settingBtn.click();
    }
    const subtitleMenuItem = selectItem(document, '.ytp-menuitem-label span', 'Subtitles/CC');
    // check if subtitle item is
    // available in menu panel
    if (subtitleMenuItem && steps === 1) {
      steps += 1;
      subtitleMenuItem.click();
    }
    const autoTranslateMenuItem = selectItem(document, '.ytp-menuitem-label', 'Auto-translate');
    // check if autotranslate item is
    // available in menu panel
    if (autoTranslateMenuItem && steps === 2) {
      steps += 1;
      autoTranslateMenuItem.click();
    }
    const languageMenuItem = selectItem(document, '.ytp-menuitem-label', language);
    // check if language item is
    // available in menu panel
    if (languageMenuItem && steps === 3) {
      // stop observer,
      // when accomplished
      observer.disconnect();
      languageMenuItem.click();
    }
  })
  observer.observe(
    // observe parent of .ytp-settings-menu
    selectItem(document, '.html5-video-player'),
    {
      childList: true,
      subtree: true
    }
  );
  if (subtitleBtn && settingBtn &&
      !selectItem(document, '.ytp-subtitles-button.ytp-button[aria-pressed="true"]')
  ) {
    // if necessary, the 'subtitleBtn'
    // can also be put inside
    // an observer callback
    subtitleBtn.click();
  }
}

changeSubtitleLanguage('Persian');
})