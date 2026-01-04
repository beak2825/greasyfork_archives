// ==UserScript==
// @name YouTube Video Autofocus
// @name:ru YouTube автофокус видео
// @description Auto focus Youtube player to enable hotkeys
// @description:ru Ставит фокус на плеер YouTube для активации хоткеев
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 1.0.0
// @run-at document_end
// @match *://youtube.com/*
// @match *://www.youtube.com/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449609/YouTube%20Video%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/449609/YouTube%20Video%20Autofocus.meta.js
// ==/UserScript==

(function ytVideoAutofocus() {
  const checkIntervalMs = 1000;

  function main() {
    const videoElSelector = '.html5-main-video';
    const videoEl = document.querySelector(videoElSelector);

    if (videoEl) {
      videoEl.focus({
        preventScroll: true,
      });
    }
  }

  function isVideoPage(searchString = top.location.search) {
    const videoSearchParamKey = 'v';
    return new URLSearchParams(searchString).has(videoSearchParamKey);
  }

  function getVideoSearchParamValue(searchString = top.location.search) {
    const videoSearchParamKey = 'v';
    return new URLSearchParams(searchString).get(videoSearchParamKey);
  }

  let currentVideoSearchParamValue = getVideoSearchParamValue();
  setInterval(() => {
    if (!isVideoPage()) {
      return;
    }

    const newVideoSearchParamValue = getVideoSearchParamValue();
    if (currentVideoSearchParamValue !== newVideoSearchParamValue) {
      currentVideoSearchParamValue = newVideoSearchParamValue;
      main();
    }
  }, checkIntervalMs);

  if (isVideoPage()) {
    main();
  }
})();
