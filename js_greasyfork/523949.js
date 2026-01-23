// ==UserScript==
// @name         Remover Aviso de erro, Bloquear Anúncios e Remover Shorts do YouTube
// @description  Pula mensagem de erro por usar bloqueador de anúncios, remove anúncios e shorts do YouTube.
// @namespace    CowanTUBE
// @license      GPL-3.0
// @version      2.0
// @author       Cowanbas
// @match        *://*/*
// @match        *://*.youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523949/Remover%20Aviso%20de%20erro%2C%20Bloquear%20An%C3%BAncios%20e%20Remover%20Shorts%20do%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/523949/Remover%20Aviso%20de%20erro%2C%20Bloquear%20An%C3%BAncios%20e%20Remover%20Shorts%20do%20YouTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getAutoplayState() {
    return localStorage.getItem('autoplayNext') === 'true';
  }

  function setAutoplayState(state) {
    localStorage.setItem('autoplayNext', state.toString());
  }

  function toggleAutoplayState(button) {
    const autoplayNext = !getAutoplayState();
    setAutoplayState(autoplayNext);
    button.title = autoplayNext ? 'Autoplay is on' : 'Autoplay is off';
    button.setAttribute('aria-label', autoplayNext ? 'Autoplay is on' : 'Autoplay is off');
    button.querySelector('.ytp-autonav-toggle-button').setAttribute('aria-checked', autoplayNext.toString());
    return autoplayNext;
  }

  function isVideoEnded(iframeDoc) {
    return iframeDoc.querySelector('.html5-endscreen.ytp-show-tiles') !== null;
  }

  function replaceElement(oldElement) {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (!videoId) {
      return;
    }

    const newElement = document.createElement('iframe');
    newElement.width = "100%";
    newElement.height = "100%";
    newElement.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    newElement.title = "YouTube video player";
    newElement.frameBorder = "0";
    newElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    newElement.allowFullscreen = true;

    oldElement.parentNode.replaceChild(newElement, oldElement);

    newElement.onload = () => {
      const iframeDoc = newElement.contentDocument;

      const refButton = iframeDoc.querySelector('.ytp-subtitles-button');
      const youtubeButton = iframeDoc.querySelector('.ytp-youtube-button');

      if (youtubeButton) {
        youtubeButton.parentNode.removeChild(youtubeButton);
      }

      if (refButton) {
        const autoPlayButton = document.createElement('button');
        autoPlayButton.className = 'ytp-button';
        autoPlayButton.setAttribute('data-priority', '2');
        autoPlayButton.setAttribute('data-tooltip-target-id', 'ytp-autonav-toggle-button');
        autoPlayButton.title = getAutoplayState() ? 'Autoplay is on' : 'Autoplay is off';
        autoPlayButton.setAttribute('aria-label', getAutoplayState() ? 'Autoplay is on' : 'Autoplay is off');
        autoPlayButton.innerHTML = `
                    <div class="ytp-autonav-toggle-button-container">
                        <div class="ytp-autonav-toggle-button" aria-checked="${getAutoplayState().toString()}"></div>
                    </div>
                `;

        refButton.parentNode.insertBefore(autoPlayButton, refButton.nextSibling);

        autoPlayButton.addEventListener('click', () => {
          const isAutoplayOn = toggleAutoplayState(autoPlayButton);
          if (isAutoplayOn && isVideoEnded(iframeDoc)) {
            playNextVideo();
          }
        });
      }

      const endScreenObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.target.classList.contains('ytp-show-tiles') && getAutoplayState()) {
            playNextVideo();
            break;
          }
        }
      });

      endScreenObserver.observe(iframeDoc, { attributes: true, subtree: true, attributeFilter: ['class'] });
    };
  }

  function playNextVideo() {
    const rendererElements = document.querySelectorAll('ytd-compact-video-renderer');
    for (let rendererElement of rendererElements) {
      if (!rendererElement.querySelector('ytd-compact-radio-renderer')) {
        const nextVideoLink = rendererElement.querySelector('a#thumbnail');
        if (nextVideoLink && nextVideoLink.href) {
          const autoplayURL = new URL(nextVideoLink.href);
          autoplayURL.searchParams.set('autoplay', '1');
          window.location.href = autoplayURL.href;
          return;
        }
      }
    }
  }

  const observer1 = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length) {
        for (let node of mutation.addedNodes) {
          if (node.nodeName.toLowerCase() === 'ytd-enforcement-message-view-model') {
            replaceElement(node);
          }
        }
      }
    }
  });

  observer1.observe(document, { childList: true, subtree: true });

  // Funções e constantes do script de bloqueador de anúncios do YouTube
  let video;

  const cssSelectorArray = [
    `#masthead-ad`,
    `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`,
    `.video-ads.ytp-ad-module`,
    `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`,
    `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,
    `#related #player-ads`,
    `#related ytd-ad-slot-renderer`,
    `ytd-ad-slot-renderer`,
    `yt-mealbar-promo-renderer`,
    `ytd-popup-container:has(a[href="/premium"])`,
    `ad-slot-renderer`,
    `ytm-companion-ad-renderer`,
  ];
  window.dev = false;

  function moment(time) {
    let y = time.getFullYear();
    let m = (time.getMonth() + 1).toString().padStart(2, `0`);
    let d = time.getDate().toString().padStart(2, `0`);
    let h = time.getHours().toString().padStart(2, `0`);
    let min = time.getMinutes().toString().padStart(2, `0`);
    let s = time.getSeconds().toString().padStart(2, `0`);
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  function setRunFlag(name) {
    let style = document.createElement(`style`);
    style.id = name;
    (document.head || document.body).appendChild(style);
  }

  function getRunFlag(name) {
    return document.getElementById(name);
  }

  function checkRunFlag(name) {
    if (getRunFlag(name)) {
      return true;
    } else {
      setRunFlag(name);
      return false;
    }
  }

  function generateRemoveADHTMLElement(id) {
    if (checkRunFlag(id)) {
      return false;
    }

    let style = document.createElement(`style`);
    (document.head || document.body).appendChild(style);
    style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArray)));
  }

  function generateRemoveADCssText(cssSelectorArray) {
    cssSelectorArray.forEach((selector, index) => {
      cssSelectorArray[index] = `${selector}{display:none!important}`;
    });
    return cssSelectorArray.join(` `);
  }

  function nativeTouch() {
    let touch = new Touch({
      identifier: Date.now(),
      target: this,
      clientX: 12,
      clientY: 34,
      radiusX: 56,
      radiusY: 78,
      rotationAngle: 0,
      force: 1
    });

    let touchStartEvent = new TouchEvent(`touchstart`, {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch]
    });

    this.dispatchEvent(touchStartEvent);

    let touchEndEvent = new TouchEvent(`touchend`, {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: [],
      targetTouches: [],
      changedTouches: [touch]
    });

    this.dispatchEvent(touchEndEvent);
  }

  function getVideoDom() {
    video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);
  }

  function playAfterAd() {
    if (video && video.paused && video.currentTime < 1) {
      video.play();
    }
  }

  function closeOverlay() {
    const premiumContainers = [...document.querySelectorAll(`ytd-popup-container`)];
    const matchingContainers = premiumContainers.filter(container => container.querySelector(`a[href="/premium"]`));

    if (matchingContainers.length > 0) {
      matchingContainers.forEach(container => container.remove());
    }

    const backdrops = document.querySelectorAll(`tp-yt-iron-overlay-backdrop`);

    const targetBackdrop = Array.from(backdrops).find(
      (backdrop) => backdrop.style.zIndex === `2201`
    );

    if (targetBackdrop) {
      targetBackdrop.className = ``;
      targetBackdrop.removeAttribute(`opened`);
    }
  }

  function skipAd(mutationsList, observer) {
    const skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-skip-ad-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
    const shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`) || document.querySelector(`.ytp-ad-button-icon`);

    if ((skipButton || shortAdMsg) && window.location.href.indexOf(`https://m.youtube.com/`) === -1) {
      video.muted = true;
    }

    if (skipButton) {
      const delayTime = 0.5;
      setTimeout(skipAd, delayTime * 1000);
      if (video.currentTime > delayTime) {
        video.currentTime = video.duration;
        return;
      }
      skipButton.click();
      nativeTouch.call(skipButton);
    } else if (shortAdMsg) {
      video.currentTime = video.duration;
    }
  }

  function removePlayerAD(id) {
    if (checkRunFlag(id)) {
      return false;
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(() => { getVideoDom(); closeOverlay(); skipAd(); playAfterAd(); });
    observer.observe(targetNode, config);
  }

  function main() {
    generateRemoveADHTMLElement(`removeADHTMLElement`);
    removePlayerAD(`removePlayerAD`);
  }

  if (document.readyState === `loading`) {
    document.addEventListener(`DOMContentLoaded`, main);
  } else {
    main();
  }

  let resumeVideo = () => {
    const videoelem = document.body.querySelector('video.html5-main-video');
    if (videoelem && videoelem.paused) {
      videoelem.play();
    }
  }

  let removePop = node => {
    const elpopup = node.querySelector('.ytd-popup-container > .ytd-popup-container > .ytd-enforcement-message-view-model');

    if (elpopup) {
      elpopup.parentNode.remove();
      const bdelems = document.getElementsByTagName('tp-yt-iron-overlay-backdrop');
      for (var x = (bdelems || []).length; x--;) {
        bdelems[x].remove();
      }
      resumeVideo();
    }

    if (node.tagName.toLowerCase() === 'tp-yt-iron-overlay-backdrop') {
      node.remove();
      resumeVideo();
    }
  }

  let obs = new MutationObserver(mutations => mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      Array.from(mutation.addedNodes)
        .filter(node => node.nodeType === 1)
        .map(node => removePop(node));
    }
  }));

  obs.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Funções e constantes do script de remover shorts do YouTube
  const observer2 = new MutationObserver(function (mutationList, observer) {
    const shelves = document.getElementsByTagName('ytd-reel-shelf-renderer');
    for (let i = 0; i < shelves.length; i++) {
      shelves[i].remove();
    }

    const richShelves = document.getElementsByTagName('ytd-rich-shelf-renderer');
    for (let i = 0; i < richShelves.length; i++) {
      richShelves[i].remove();
    }

    const overlays = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    for (let i = 0; i < overlays.length; i++) {
      const element = overlays[i];

      const section = element.closest('.ytd-item-section-renderer');
      if (section) { section.remove(); return; }

      const grid = element.closest('.ytd-grid-renderer');
      if (grid) { grid.remove(); return; }

      const list = element.closest('.ytd-section-list-renderer');
      if (list) { list.remove(); }
    }
  });

  const observeShorts = () => {
    observer2.observe(document.querySelector('ytd-page-manager'), { childList: true, subtree: true });
  };

  window.navigation.addEventListener("navigate", (event) => {
    observer2.disconnect();
    observeShorts();
  });

  observeShorts();

})();
