// ==UserScript==
// @name           YouTube - Toggle videos buttons
// @description    Adds buttons to filter out videos by type and/or status. The toggles can be hidden/shown at any time by pressing the button added to the header.
// @version        2023.06.13.17.21
// @author         MetalTxus
// @namespace      https://github.com/jesuscc1993

// @icon           https://www.youtube.com/favicon.ico
// @match          *://*.youtube.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js

// @grant          GM.getValue
// @grant          GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/443344/YouTube%20-%20Toggle%20videos%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/443344/YouTube%20-%20Toggle%20videos%20buttons.meta.js
// ==/UserScript==

/* globals jQuery */

(async () => {
  'use strict';

  const enableDebug = false;

  let currentUrl;
  let videosTotal;

  let buttonsContainer;
  let toggleButtonsButton;
  let toggleLiveButton;
  let toggleShortsButton;
  let toggleUpcomingButton;
  let toggleUploadsButton;
  let toggleWatchedButton;

  let buttonsHidden = await GM.getValue('buttonsHidden', false);
  let liveHidden = await GM.getValue('liveHidden', false);
  let shortsHidden = await GM.getValue('shortsHidden', false);
  let upcomingHidden = await GM.getValue('upcomingHidden', false);
  let uploadsHidden = await GM.getValue('uploadsHidden', false);
  let watchedHidden = await GM.getValue('watchedHidden', false);

  const shouldRenderButton = () => {
    return location.href.match(urlPattern) !== null;
  };

  const shouldFilterByTypeButton = () => {
    return location.href.match(urlWithTypesPattern) !== null;
  };

  const shouldFilterByStatus = () => {
    return true;
  };

  const shouldRunScript = () => {
    const oldUrl = currentUrl;
    currentUrl = location.href.split('?')[0];

    const oldVideosTotal = videosTotal;
    videosTotal = jQuery(videosSelector).length;

    const locationChanged = !!oldUrl && oldUrl !== currentUrl;
    const videosCountChanged = oldVideosTotal !== videosTotal;

    const videosShouldBeHidden =
      (liveHidden ||
        shortsHidden ||
        upcomingHidden ||
        uploadsHidden ||
        watchedHidden) &&
      !!document.querySelectorAll(unprocessedVideosSelectors).length;

    const videosShouldBeShown =
      !(
        liveHidden &&
        shortsHidden &&
        upcomingHidden &&
        uploadsHidden &&
        watchedHidden
      ) && !!document.querySelectorAll(processedVideosSelectors).length;

    const shouldIt =
      shouldRenderButton() &&
      (locationChanged ||
        videosCountChanged ||
        videosShouldBeHidden ||
        videosShouldBeShown);

    if (shouldIt) {
      debug(`Videos should be processed
        locationChanged: ${locationChanged}
        videosCountChanged: ${videosCountChanged}
        videosShouldBeHidden: ${videosShouldBeHidden}
        videosShouldBeShown: ${videosShouldBeShown}`);
    }

    return shouldIt;
  };

  const runButtonTask = () => {
    if (shouldRenderButton()) {
      const buttonsDestinationContainer = jQuery(
        buttonDestinationContainerSelector
      );

      if (
        buttonsDestinationContainer.length &&
        !buttonsDestinationContainer.find(buttonsContainer).length
      ) {
        insertButtons(buttonsDestinationContainer);
      }
    } else {
      buttonsContainer.remove();
      toggleButtonsButton.remove();
    }
  };

  const runVideosTask = () => {
    if (shouldRunScript()) {
      setTimeout(processAllVideos, 150);
    }
  };

  const insertButtons = (buttonDestinationContainer) => {
    toggleLiveButton.off('click').on('click', toggleLiveVideos);
    toggleShortsButton.off('click').on('click', toggleShortsVideos);
    toggleUpcomingButton.off('click').on('click', toggleUpcomingVideos);
    toggleUploadsButton.off('click').on('click', toggleUploadsVideos);
    toggleWatchedButton.off('click').on('click', toggleWatchedVideos);

    setButtonState(toggleLiveButton, liveHidden);
    setButtonState(toggleShortsButton, shortsHidden);
    setButtonState(toggleUpcomingButton, upcomingHidden);
    setButtonState(toggleUploadsButton, uploadsHidden);
    setButtonState(toggleWatchedButton, watchedHidden);

    buttonDestinationContainer.prepend(buttonsContainer);

    toggleButtonsButton.off('click').on('click', toggleButtons);
    jQuery(buttonsToggleDestinationSelector).prepend(toggleButtonsButton);
  };

  const processAllVideos = () => {
    debug(`Processing videos...`);
    if (liveHidden) processLiveVideos();
    if (shortsHidden) processShortsVideos();
    if (upcomingHidden) processUpcomingVideos();
    if (uploadsHidden) processUploadsVideos();
    if (watchedHidden) processWatchedVideos();
    debug(`All videos processed`);
  };

  const toggleLiveVideos = () => {
    liveHidden = !liveHidden;
    GM.setValue('liveHidden', liveHidden);
    processLiveVideos();
  };

  const toggleShortsVideos = () => {
    shortsHidden = !shortsHidden;
    GM.setValue('shortsHidden', shortsHidden);
    processShortsVideos();
  };

  const toggleUpcomingVideos = () => {
    upcomingHidden = !upcomingHidden;
    GM.setValue('upcomingHidden', upcomingHidden);
    processUpcomingVideos();
  };

  const toggleUploadsVideos = () => {
    uploadsHidden = !uploadsHidden;
    GM.setValue('uploadsHidden', uploadsHidden);
    processUploadsVideos();
  };

  const toggleWatchedVideos = () => {
    watchedHidden = !watchedHidden;
    GM.setValue('watchedHidden', watchedHidden);
    processWatchedVideos();
  };

  const toggleButtons = (newValue) => {
    buttonsHidden = typeof newValue == 'boolean' ? newValue : !buttonsHidden;
    GM.setValue('buttonsHidden', buttonsHidden);
    buttonsHidden
      ? buttonsContainer.addClass('hide-buttons')
      : buttonsContainer.removeClass('hide-buttons');
  };

  const processLiveVideos = () => {
    if (shouldFilterByTypeButton()) {
      processVideos(toggleLiveButton, liveHidden, liveVideosSelector);
    }
  };

  const processShortsVideos = () => {
    if (shouldFilterByTypeButton()) {
      processVideos(toggleShortsButton, shortsHidden, shortsVideosSelector);
    }
  };

  const processUpcomingVideos = () => {
    if (shouldFilterByStatus()) {
      processVideos(
        toggleUpcomingButton,
        upcomingHidden,
        upcomingVideosSelector
      );
    }
  };

  const processUploadsVideos = () => {
    if (shouldFilterByTypeButton()) {
      processVideos(toggleUploadsButton, uploadsHidden, uploadsVideosSelector);
    }
  };

  const processWatchedVideos = () => {
    if (shouldFilterByStatus()) {
      processVideos(toggleWatchedButton, watchedHidden, watchedVideosSelector);
    }
  };

  const processVideos = (button, hidden, matchingSelector) => {
    const matchingVideos = jQuery(matchingSelector).parents(videosSelector);
    matchingVideos.toggleClass('mt-hidden', hidden);

    setButtonState(button, hidden);
  };

  const setButtonState = (button, hidden) => {
    button.toggleClass('on', !hidden);
  };

  const debug = enableDebug
    ? (message) => console.debug(`${scriptPrefix} ${message}`)
    : () => {};

  const initialize = () => {
    jQuery('head').append(baseStyle);

    toggleLiveButton = jQuery(toggleVideosButtonTemplate)
      .addClass(`${i18n.live} type`)
      .text(i18n.live);

    toggleShortsButton = jQuery(toggleVideosButtonTemplate)
      .addClass(`${i18n.shorts} type`)
      .text(i18n.shorts);

    toggleUpcomingButton = jQuery(toggleVideosButtonTemplate)
      .addClass(`${i18n.upcoming} status`)
      .text(i18n.upcoming);

    toggleUploadsButton = jQuery(toggleVideosButtonTemplate)
      .addClass(`${i18n.uploads} type`)
      .text(i18n.uploads);

    toggleWatchedButton = jQuery(toggleVideosButtonTemplate)
      .addClass(`${i18n.watched} status`)
      .text(i18n.watched);

    buttonsContainer = jQuery(buttonsContainerTemplate);
    buttonsContainer.append(toggleUpcomingButton);
    buttonsContainer.append(toggleLiveButton);
    buttonsContainer.append(toggleUploadsButton);
    buttonsContainer.append(toggleShortsButton);
    buttonsContainer.append(toggleWatchedButton);

    toggleButtonsButton = jQuery(toggleButtonsButtonTemplate);
    toggleButtons(buttonsHidden);

    setInterval(runButtonTask, 150);
    setInterval(runVideosTask, 1000);

    console.info(`${scriptPrefix} Script initialized.`);
  };

  const scriptPrefix = `[Toggle videos buttons]`;

  const urlPattern =
    /youtube.com(\/?$|\/((channel\/|c\/|@)(\w*)(\/(featured|videos|shorts|streams)|\/?$)|feed\/subscriptions|results|playlist))/;

  const urlWithTypesPattern =
    /youtube.com(\/?$|\/((channel\/|c\/|@)(\w*)(\/(featured)|\/?$)|feed\/subscriptions|results|playlist))/;

  // texts
  const i18n = {
    toggleButtons: 'Toggle video filter buttons',

    live: 'live',
    shorts: 'shorts',
    upcoming: 'upcoming',
    uploads: 'videos',
    watched: 'watched',
  };

  // selectors
  const liveVideosSelector = `
    [role="main"] .badge-style-type-live-now-alternate
  `;
  const shortsVideosSelector = `
    [role="main"] ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"],
    [role="main"] .ytd-thumbnail[href^="/shorts/"]
  `;
  const upcomingVideosSelector = `
    [role="main"] ytd-thumbnail-overlay-time-status-renderer[overlay-style="UPCOMING"]
  `;
  const uploadsVideosSelector = `
    [role="main"] ytd-thumbnail-overlay-time-status-renderer:not([overlay-style="SHORTS"])
  `;
  const watchedVideosSelector = `
    [role="main"] [id="progress"]
  `;

  const buttonDestinationContainerSelector = `
    [page-subtype="channels"][role="main"] #primary > ytd-section-list-renderer,
    [page-subtype="channels"][role="main"] ytd-rich-grid-renderer,
    [page-subtype="home"][role="main"] #primary > ytd-rich-grid-renderer,
    [page-subtype="playlist"][role="main"] ytd-item-section-renderer,
    [page-subtype="subscriptions"][role="main"] ytd-shelf-renderer,
    ytd-search[role="main"] ytd-section-list-renderer
  `;

  const buttonsToggleDestinationSelector = `#masthead #end`;

  const videosSelector = `
    [role="main"] ytd-grid-video-renderer,
    [role="main"] ytd-playlist-video-renderer,
    [role="main"] ytd-rich-item-renderer,
    [role="main"] ytd-video-renderer,

    [role="main"] .ytd-rich-section-renderer[is-shorts],
    [role="main"] ytd-reel-shelf-renderer,
    [role="main"] ytd-reel-item-renderer
  `;

  const unprocessedVideosSelectors = videosSelector
    .replace(/\n\s*/g, '')
    .split(',')
    .map(
      (selector) =>
        `${selector}:not(.mt-hidden) ${watchedVideosSelector}, ${selector}:not(.mt-hidden) ${upcomingVideosSelector}`
    )
    .join(',');

  const processedVideosSelectors = videosSelector
    .replace(/\n\s*/g, '')
    .split(',')
    .map(
      (selector) =>
        `${selector}.mt-hidden ${watchedVideosSelector}, ${selector}.mt-hidden ${upcomingVideosSelector}`
    )
    .join(',');

  // templates
  const toggleVideosButtonTemplate = `
    <tp-yt-paper-button class="ytd-subscribe-button-renderer mt-button mt-toggle-videos-button" />
  `;

  const toggleButtonsButtonTemplate = `
    <tp-yt-paper-button class="mt-button mt-toggle-buttons-button">
      <svg viewBox="0 0 24 24">
        <g>
          <path fill="#FFF" d="M20,7H4V6h16V7z M22,9v12H2V9H22z M15,15l-5-3v6L15,15z M17,3H7v1h10V3z"></path>
        </g>
      </svg>
      <tp-yt-paper-tooltip class="ytd-topbar-menu-button-renderer">
        ${i18n.toggleButtons}
      </tp-yt-paper-tooltip>
    </tp-yt-paper-button>
  `;

  const buttonsContainerTemplate = `
    <div class="mt-toggle-videos-container"></div>
  `;

  // style
  const baseStyle = `
    <style>
      .mt-toggle-videos-container {
        display: flex;
        justify-content: center;
        margin: 0 auto;
      }

      .mt-toggle-videos-container.hide-buttons {
        display: none;
      }

      .mt-button {
        border-radius: 20px !important;
      }

      .mt-toggle-videos-button {
        border-radius: 0 !important;
        margin: 0 !important;
        text-align: center;
        min-width: 112px;
        background: var(--yt-spec-additive-background) !important;
      }
      .mt-toggle-videos-button.on {
        background: var(--yt-spec-10-percent-layer) !important;
      }
      .mt-toggle-videos-button:first-child {
        border-radius: 20px 0 0 20px !important;
      }
      .mt-toggle-videos-button:last-child {
        border-radius: 0 20px 20px 0 !important;
      }

      .mt-toggle-buttons-button {
        background: transparent !important;
        height: 40px;
        margin: 0 8px 0 0;
        min-width: 40px;
        padding: 0 !important;
      }
      .mt-toggle-buttons-button:hover {
        background: var(--yt-spec-10-percent-layer) !important;
      }
      .mt-toggle-buttons-button svg {
        width: 24px;
      }

      .mt-hidden {
        display: none !important;
      }

      [page-subtype="channels"] .mt-toggle-videos-container {
        margin-top: 24px;
      }
      [page-subtype="channels"] ytd-rich-grid-renderer .mt-button.type,
      ytd-rich-grid-renderer[is-shorts-grid] .mt-button {
        background: transparent !important;
        opacity: .1;
        pointer-events: none;
      }

      [page-subtype="playlist"] .mt-toggle-videos-container {
        box-sizing: border-box;
        padding: 0 24px;
      }

      .ytd-search ytd-section-list-renderer .mt-toggle-videos-container {
        margin: 12px 0;
      }
    </style>
  `;

  initialize();
})();
