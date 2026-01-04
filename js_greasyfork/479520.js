// ==UserScript==
// @name               YouTube Auto HD and FPS
// @namespace          https://github.com/jlhg/youtube-auto-hd
// @license            GPL-3.0
// @version            0.1.0
// @description        Auto select the highest quality on YouTube
// @description:zh-TW  YouTube 自動選最高畫質
// @author             jlhg
// @homepage           https://github.com/jlhg/youtube-auto-hd
// @supportURL         https://github.com/jlhg/youtube-auto-hd/issues
// @match              https://www.youtube.com/watch*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/479520/YouTube%20Auto%20HD%20and%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/479520/YouTube%20Auto%20HD%20and%20FPS.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SELECTORS = {
    buttonSettings: '.ytp-settings-button',
    video: 'video',
    player: '.html5-video-player:not(#inline-preview-player)',
    menuOption: '.ytp-settings-menu[data-layer] .ytp-menuitem',
    menuOptionContent: ".ytp-menuitem-content",
    optionQuality: ".ytp-settings-menu[data-layer] .ytp-menuitem:last-child",
    panelHeaderBack: ".ytp-panel-header button",
    labelPremium: '.ytp-premium-label'
  };

  const OBSERVER_OPTIONS = {
    childList: true,
    subtree: true
  };

  const SUFFIX_EBR = 'ebr';

  const fpsSupported = [60, 50, 30];
  const qualities = [4320, 2160, 1440, 1080, 720, 480, 360, 240, 144];

  function isElementVisible(element) {
    return element?.offsetWidth > 0 && element?.offsetHeight > 0;
  }

  async function getCurrentQualityElements() {
    return waitElement(SELECTORS.player).then((el) => {
      const elMenuOptions = [...el.querySelectorAll(SELECTORS.menuOption)];
      return elMenuOptions.filter(getIsQualityElement);
    });
  }

  function convertQualityToNumber(elQuality) {
    const isPremiumQuality = Boolean(elQuality.querySelector(SELECTORS.labelPremium));
    const qualityNumber = parseInt(elQuality.textContent);
    if (isPremiumQuality) {
      return (qualityNumber + SUFFIX_EBR);
    }

    return qualityNumber;
  }

  async function getAvailableQualities() {
    const elQualities = await getCurrentQualityElements();
    return elQualities.map(convertQualityToNumber);
  }

  function getPlayerDiv(elVideo) {
    return elVideo.closest(SELECTORS.player);
  }

  function getVideoFPS() {
    const elQualities = getCurrentQualityElements();
    const labelQuality = elQualities[0]?.textContent;
    if (!labelQuality) {
      return 30;
    }
    const fpsMatch = labelQuality.match(/[ps](\d+)/);
    return fpsMatch ? Number(fpsMatch[1]) : 30;
  }

  function getFpsFromRange(qualities, fpsToCheck) {
    const fpsList = Object.keys(qualities)
      .map(fps => parseInt(fps))
      .sort((a, b) => b - a);
    return fpsList.find(fps => fps <= fpsToCheck) || fpsList.at(-1);
  }

  function getIsQualityElement(element) {
    const isQuality = Boolean(element.textContent.match(/\d/));
    const isHasChildren = element.children.length > 1;
    return isQuality && !isHasChildren;
  }

  async function getIsSettingsMenuOpen() {
    waitElement(SELECTORS.buttonSettings).then((el) => {
      const elButtonSettings = el;
      return elButtonSettings?.ariaExpanded === "true";
    });
  }

  function getIsLastOptionQuality(elVideo) {
    const elOptionInSettings = getPlayerDiv(elVideo).querySelector(SELECTORS.optionQuality);

    if (!elOptionInSettings) {
      return false;
    }

    const elQualityName = elOptionInSettings.querySelector(SELECTORS.menuOptionContent);

    // If the video is a channel trailer, the last option is initially the speed one,
    // and the speed setting can only be a single digit
    const matchNumber = elQualityName?.textContent?.match(/\d+/);
    if (!matchNumber) {
      return false;
    }

    const numberString = matchNumber[0];
    const minQualityCharLength = 3; // e.g. 3 characters in 720p

    return numberString.length >= minQualityCharLength;
  }

  async function changeQualityAndClose(elVideo, elPlayer) {
    await changeQualityWhenPossible(elVideo);
    await closeMenu(elPlayer);
  }

  function openQualityMenu(elVideo) {
    const elSettingQuality = getPlayerDiv(elVideo).querySelector(SELECTORS.optionQuality);
    elSettingQuality.click();
  }

  async function changeQuality() {
    const elQualities = await getCurrentQualityElements();
    const qualitiesAvailable = await getAvailableQualities();
    const applyQuality = (iQuality) => {
      elQualities[iQuality]?.click();
    };

    const isQualityPreferredEBR = qualitiesAvailable[0].toString().endsWith(SUFFIX_EBR);
    if (isQualityPreferredEBR) {
      applyQuality(0);
      return;
    }

    const iQualityFallback = qualitiesAvailable.findIndex(quality => !quality.toString().endsWith(SUFFIX_EBR));
    applyQuality(iQualityFallback);
  }

  async function changeQualityWhenPossible(elVideo) {
    if (!getIsLastOptionQuality(elVideo)) {
      elVideo.addEventListener("canplay", () => changeQualityWhenPossible(elVideo), { once: true });
      return;
    }

    openQualityMenu(elVideo);
    await changeQuality();
  }

  async function closeMenu(elPlayer) {
    const clickPanelBackIfPossible = () => {
      const elPanelHeaderBack = elPlayer.querySelector(SELECTORS.panelHeaderBack);
      if (elPanelHeaderBack) {
        elPanelHeaderBack.click();
        return true;
      }
      return false;
    };

    if (clickPanelBackIfPossible()) {
      return;
    }

    new MutationObserver((_, observer) => {
      if (clickPanelBackIfPossible()) {
        observer.disconnect();
      }
    }).observe(elPlayer, OBSERVER_OPTIONS);
  }

  function waitElement(selector) {
    return new Promise(resolve => {
      let element = [...document.querySelectorAll(selector)]
        .find(isElementVisible);

      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(mutations => {
        let element = [...document.querySelectorAll(selector)]
          .find(isElementVisible);

        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, OBSERVER_OPTIONS);
    });
  }

  waitElement(SELECTORS.video).then(async (elVideo) => {
    const elPlayer = getPlayerDiv(elVideo);
    const elSettings = elPlayer.querySelector(SELECTORS.buttonSettings);
    if (!elSettings) {
      return;
    }

    const isSettingsMenuOpen = await getIsSettingsMenuOpen();
    if (!isSettingsMenuOpen) {
      elSettings.click();
    }
    elSettings.click();

    await changeQualityAndClose(elVideo, elPlayer);
    elPlayer.querySelector(SELECTORS.buttonSettings).blur();
  });
})();
