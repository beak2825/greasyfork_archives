// ==UserScript==
// @author      Mr. Nope
// @version     1.6
// @name        PornHub Plus
// @description A kinder PornHub. Because you're worth it.
// @namespace   Nope
// @date        2019-05-27
// @include     *pornhub.com*
// @run-at      document-start
// @grant       none
// @license     Public Domain
// @icon        https://res-4.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1458758320/ajcppvmug2jcsljnzbmi.jpg
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380711/PornHub%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/380711/PornHub%20Plus.meta.js
// ==/UserScript==

(() => {
  const OPTIONS = {
    openWithoutPlaylist: JSON.parse(localStorage.getItem('plus_openWithoutPlaylist')) || false,
    showOnlyVerified: JSON.parse(localStorage.getItem('plus_showOnlyVerified')) || false,
    showOnlyHd: JSON.parse(localStorage.getItem('plus_showOnlyHd')) || false,
    redirectToVideos: JSON.parse(localStorage.getItem('plus_redirectToVideos')) || false,
    cinemaModePlayer: JSON.parse(localStorage.getItem('plus_cinemaMode')) || false,
    hideWatchedVideos: JSON.parse(localStorage.getItem('plus_hideWatchedVideos')) || false,
    hidePlaylistBar: JSON.parse(localStorage.getItem('plus_hidePlaylistBar')) || false,
    durationFilter: JSON.parse(localStorage.getItem('plus_durationFilter')) || { max: 0, min: 0 },
    durationPresets: [
      { label: 'Micro', min: 0, max: 2 },
      { label: 'Short', min: 3, max: 8 },
      { label: 'Average', min: 8, max: 18 },
      { label: 'Long', min: 18, max: 40 },
      { label: 'Magnum', min: 40, max: 0 }
    ],
    observedAreas: ['.videos-list']
  }
  
  /**
   * Shared Styles
   */
  const sharedStyles = `
    /* Our own elements */

    .plus-buttons {
      background: rgba(27, 27, 27, 0.9);
      box-shadow: 0px 0px 12px rgba(20, 111, 223, 0.9);
      font-size: 12px;
      position: fixed;
      bottom: 10px;
      padding: 10px 22px 8px 24px;
      right: 0;
      z-index: 100;
      transition: all 0.3s ease;

      /* Negative margin-right calculated later based on width of buttons */
    }

    .plus-buttons:hover {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    }

    .plus-buttons .plus-button {
      margin: 10px 0;
      padding: 6px 15px;
      border-radius: 4px;
      font-weight: 700;
      display: block;
      position: relative;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }

    .plus-buttons a.plus-button {
      background: rgb(221, 221, 221);
      color: rgb(51, 51, 51);
    }

    .plus-buttons a.plus-button:hover {
      background: rgb(187, 187, 187);
      color: rgb(51, 51, 51);
    }

    .plus-buttons a.plus-button.plus-button-isOn {
      background: rgb(20, 111, 223);
      color: rgb(255, 255, 255);
    }

    .plus-buttons a.plus-button.plus-button-isOn:hover {
      background: rgb(0, 91, 203);
      color: rgb(255, 255, 255);
    }

    .plus-hidden {
      display: none !important;
    }
  `;
  
  /**
   * Color Theme
   */
  const themeStyles = `
    .plus-buttons {
      box-shadow: 0px 0px 12px rgba(255, 153, 0, 0.85);
    }

    .plus-buttons:hover {
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    }

    .plus-buttons a.plus-button {
      background: rgb(47, 47, 47);
      color: rgb(172, 172, 172);
    }

    .plus-buttons a.plus-button:hover {
      background: rgb(79, 79, 79);
      color: rgb(204, 204, 204);
    }

    .plus-buttons a.plus-button.plus-button-isOn {
      background: rgb(255, 153, 0);
      color: rgb(0, 0, 0);
    }

    .plus-buttons a.plus-button.plus-button-isOn:hover {
      background: rgb(255, 153, 0);
      color: rgb(255, 255, 255);
    }
  `;
  
  /**
   * Site-Specific Styles
   */
  const generalStyles = `
    /* Hide elements */

    .realsex,
    .networkBar,
    #welcome,
    .sniperModeEngaged,
    .footer,
    .footer-title,
    .ad-link,
    .removeAdLink,
    .removeAdLink + iframe,
    .abovePlayer,
    .streamatesModelsContainer,
    #headerUpgradePremiumBtn,
    #PornhubNetworkBar,
    #js-abContainterMain,
    #hd-rightColVideoPage > :not(#relatedVideosVPage) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
    }

    /* Make "HD" icon more visible on thumbnails */

    .hd-thumbnail {
      color: #f90 !important;
    }

    /* Show all playlists without scrolling in "add to" */

    .slimScrollDiv {
      height: auto !important;
    }

    #scrollbar_watch {
      max-height: unset !important;
    }

    /* Hide premium video from related videos sidebar */

    #relateRecommendedItems li:nth-of-type(5) {
      display: none !important;
    }

    /* Prevent animating player size change on each page load */

    #main-container .video-wrapper #player.wide {
      transition: none !important;
    }

    /* Fit more playlists into "add to" popup */

    .playlist-menu-addTo {
      display: none;
    }

    .add-to-playlist-menu #scrollThumbs,
    .playlist-option-menu #scrollThumbs {
      height: 320px !important;
      max-height: 35vh !important;
    }

    .add-to-playlist-menu ul.custom-playlist li {
      font-size: 12px;
      height: 24px;
    }

    .add-to-playlist-menu .playlist-menu-createNew {
      font-size: 12px !important;
      height: 38px !important;
    }

    .add-to-playlist-menu .playlist-menu-createNew a {
      padding-top: 8px !important;
      font-weight: 400 !important;
    }

    /* Hide playlist bar if disabled in options */

    .playlist-bar {
      display: ${OPTIONS.hidePlaylistBar ? 'none' : 'block'};
    }
  `;
  
  /**
   * Run after page has loaded
   */
  window.addEventListener('DOMContentLoaded', () => {
    /**
     * References to video element and container if they exist on the page
     */
    const player = document.querySelector('#player');
    const video = document.querySelector('video');

    /**
     * Creation of option buttons
     */
    const scrollButton = document.createElement('a');
    const scrollButtonText = document.createElement('span');
    
    const playlistBarButton = document.createElement('a');
    const playlistBarButtonText = document.createElement('span');
    const playlistBarButtonState = getButtonState(OPTIONS.hidePlaylistBar);
    
    const verifiedButton = document.createElement('a');
    const verifiedButtonText = document.createElement('span');
    const verifiedButtonState = getButtonState(OPTIONS.showOnlyVerified);

    const hideWatchedButton = document.createElement('a');
    const hideWatchedButtonText = document.createElement('span');
    const hideWatchedButtonState = getButtonState(OPTIONS.hideWatchedVideos);
    
    const hdButton = document.createElement('a');
    const hdButtonText = document.createElement('span');
    const hdButtonState = getButtonState(OPTIONS.showOnlyHd);

    const redirectToVideosButton = document.createElement('a');
    const redirectToVideosButtonText = document.createElement('span');
    const redirectToVideosButtonState = getButtonState(OPTIONS.redirectToVideos);
    
    const cinemaModeButton = document.createElement('a');
    const cinemaModeButtonText = document.createElement('span');
    const cinemaModeButtonState = getButtonState(OPTIONS.cinemaModePlayer);
    
    const durationShortButton = document.createElement('a');
    const durationShortButtonText = document.createElement('span');
    const durationShortButtonState = getButtonState(!OPTIONS.durationFilter.min);
    
    const durationMediumButton = document.createElement('a');
    const durationMediumButtonText = document.createElement('span');
    const durationMediumButtonState = getButtonState(OPTIONS.durationFilter.min <= 8 && OPTIONS.durationFilter.max >= 20);
    
    const openWithoutPlaylistButton = document.createElement('a');
    const openWithoutPlaylistButtonText = document.createElement('span');
    const openWithoutPlaylistButtonState = getButtonState(OPTIONS.openWithoutPlaylist);
    
    /**
     * Returns an `on` or `off` CSS class name based on the boolean evaluation
     * of the `state` parameter, as convenience method when setting UI state.
     */
    function getButtonState(state) {
      return state ? 'plus-button-isOn' : 'plus-button-isOff';
    }
    
    scrollButtonText.textContent = "Scroll to Top";
    scrollButtonText.classList.add('text');
    scrollButton.appendChild(scrollButtonText);
    scrollButton.classList.add('plus-button');
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0 });
    });
    
    verifiedButtonText.textContent = 'Verified Only';
    verifiedButtonText.classList.add('text');
    verifiedButton.appendChild(verifiedButtonText);
    verifiedButton.classList.add(verifiedButtonState, 'plus-button');
    verifiedButton.addEventListener('click', () => {
      OPTIONS.showOnlyVerified = !OPTIONS.showOnlyVerified;
      localStorage.setItem('plus_showOnlyVerified', OPTIONS.showOnlyVerified);

      if (OPTIONS.showOnlyVerified) {
        verifiedButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        verifiedButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
      
      filterVideos();
    });
    
    hdButtonText.textContent = 'HD Only';
    hdButtonText.classList.add('text');
    hdButton.appendChild(hdButtonText);
    hdButton.classList.add(hdButtonState, 'plus-button');
    hdButton.addEventListener('click', () => {
      OPTIONS.showOnlyHd = !OPTIONS.showOnlyHd;
      localStorage.setItem('plus_showOnlyHd', OPTIONS.showOnlyHd);

      if (OPTIONS.showOnlyHd) {
        hdButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        hdButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
      
      filterVideos();
    });
    
    
    playlistBarButtonText.textContent = 'Hide Playlist Bar';
    playlistBarButtonText.classList.add('text');
    playlistBarButton.appendChild(playlistBarButtonText);
    playlistBarButton.classList.add(playlistBarButtonState, 'plus-button');
    playlistBarButton.addEventListener('click', () => {
      OPTIONS.hidePlaylistBar = !OPTIONS.hidePlaylistBar;
      localStorage.setItem('plus_hidePlaylistBar', OPTIONS.hidePlaylistBar);
      
      if (OPTIONS.hidePlaylistBar) {
        playlistBarButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        playlistBarButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }

      const playlistBar = document.querySelector('.playlist-bar');
      
      if (playlistBar) {
        playlistBar.style.display = OPTIONS.hidePlaylistBar ? 'none' : 'block';
      }
    });
    
    hideWatchedButtonText.textContent = 'Unwatched Only';
    hideWatchedButtonText.classList.add('text');
    hideWatchedButton.appendChild(hideWatchedButtonText);
    hideWatchedButton.classList.add(hideWatchedButtonState, 'plus-button');
    hideWatchedButton.addEventListener('click', () => {
      OPTIONS.hideWatchedVideos = !OPTIONS.hideWatchedVideos;
      localStorage.setItem('plus_hideWatchedVideos', OPTIONS.hideWatchedVideos);
      
      if (OPTIONS.hideWatchedVideos) {
        hideWatchedButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        hideWatchedButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }

      filterVideos();
    });
    
    redirectToVideosButtonText.textContent = 'Redirect Profiles to Uploads';
    redirectToVideosButtonText.classList.add('text');
    redirectToVideosButton.appendChild(redirectToVideosButtonText);
    redirectToVideosButton.classList.add(redirectToVideosButtonState, 'plus-button');
    redirectToVideosButton.addEventListener('click', () => {
      OPTIONS.redirectToVideos = !OPTIONS.redirectToVideos;
      localStorage.setItem('plus_redirectToVideos', OPTIONS.redirectToVideos);
      
      if (OPTIONS.redirectToVideos) {
        redirectToVideosButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        redirectToVideosButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });
    
    durationShortButtonText.textContent = 'Short Videos (< 8 min)';
    durationShortButtonText.classList.add('text');
    durationShortButton.appendChild(durationShortButtonText);
    durationShortButton.classList.add(durationShortButtonState, 'plus-button');
    durationShortButton.addEventListener('click', () => {
      OPTIONS.durationFilter.min = OPTIONS.durationFilter.min ? 0 : 8;
      localStorage.setItem('plus_durationFilter', JSON.stringify(OPTIONS.durationFilter));
      
      if (!OPTIONS.durationFilter.min) {
        durationShortButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
        filterVideos();
      } else {
        durationShortButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
        filterVideos();
      }
    });
    
    durationMediumButtonText.textContent = 'Medium Videos (8-20 min)';
    durationMediumButtonText.classList.add('text');
    durationMediumButton.appendChild(durationMediumButtonText);
    durationMediumButton.classList.add(durationMediumButtonState, 'plus-button');
    durationMediumButton.addEventListener('click', () => {
      OPTIONS.durationFilter.min = OPTIONS.durationFilter.min !== 8 ? 8 : 0;
      OPTIONS.durationFilter.max = OPTIONS.durationFilter.max !== 20 ? 20 : 0;
      
      localStorage.setItem('plus_durationFilter', JSON.stringify(OPTIONS.durationFilter));
      
      if (OPTIONS.durationFilter.min === 8 && OPTIONS.durationFilter.max === 20) {
        durationMediumButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
        filterVideos();
      } else {
        durationMediumButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
        filterVideos();
      }
    });
    
    cinemaModeButtonText.textContent = 'Cinema Mode';
    cinemaModeButtonText.classList.add('text');
    cinemaModeButton.appendChild(cinemaModeButtonText);
    cinemaModeButton.classList.add(cinemaModeButtonState, 'plus-button');
    cinemaModeButton.addEventListener('click', () => {
      OPTIONS.cinemaModePlayer = !OPTIONS.cinemaModePlayer;
      localStorage.setItem('plus_cinemaMode', OPTIONS.cinemaModePlayer);
      
      if (OPTIONS.cinemaModePlayer) {
        cinemaModeButton.classList.replace('plus-button-isOff', 'plus-button-isOn');
      } else {
        cinemaModeButton.classList.replace('plus-button-isOn', 'plus-button-isOff');
      }
    });

    /**
     * Order option buttons in a container
     */

    const buttons = document.createElement('div');
    const durationFilters = [];

    buttons.classList.add('plus-buttons');

    buttons.appendChild(scrollButton);
    buttons.appendChild(cinemaModeButton);
    buttons.appendChild(verifiedButton);
    buttons.appendChild(hdButton);
    buttons.appendChild(hideWatchedButton);
    buttons.appendChild(redirectToVideosButton);
    buttons.appendChild(playlistBarButton);
    
    /**
     * Generate buttons for filtering by duration. Buttons are created based on
     * `OPTIONS.durationPresets`, an array of objects containing max and min duration in minutes,
     * and a label (like "Short Videos").
     */
    OPTIONS.durationPresets.forEach(preset => {
      const button = document.createElement('a');
      const buttonText = document.createElement('span');
      const buttonState = getButtonState(OPTIONS.durationFilter.min === preset.min &&
                                         OPTIONS.durationFilter.max === preset.max);

      buttonText.textContent = `${preset.label} (${preset.min}-${preset.max} mins)`;
      buttonText.classList.add('text');
      button.appendChild(buttonText);
      button.classList.add(buttonState, 'plus-button');
      
      durationFilters.push({
        button,
        preset
      });
    });
    
    /**
     * We needed access to all buttons, their state, and the duration values, to be able to switch
     * all the buttons to off state before we apply the newly selected filters. For simplicity and
     * sanity, only one duration range can be selected at a time.
     */
    durationFilters.forEach(({ button, preset }) => {
      buttons.appendChild(button);
      
      button.addEventListener('click', () => {
        durationFilters.forEach(filter => filter.button.classList.replace('plus-button-isOn', 'plus-button-isOff'));
        
        OPTIONS.durationFilter.min = OPTIONS.durationFilter.min === preset.min ? 0 : preset.min;
        OPTIONS.durationFilter.max = OPTIONS.durationFilter.max === preset.max ? 0 : preset.max;

        localStorage.setItem('plus_durationFilter', JSON.stringify(OPTIONS.durationFilter));

        if (OPTIONS.durationFilter.min === preset.min &&
            OPTIONS.durationFilter.max === preset.max) {
          button.classList.replace('plus-button-isOff', 'plus-button-isOn');
          filterVideos();
        } else {
          button.classList.replace('plus-button-isOn', 'plus-button-isOff');
          filterVideos();
        }
      });
    });
    
    document.body.appendChild(buttons); // Button container ready and added to page
    
    /**
     * Observe certain areas that should trigger refiltering if nodes are added or removed, so that
     * for example when more related videos are loaded into the sidebar, they will be filtered
     * according to settings right away. Any selectors in `OPTIONS.observedAreas` will be observed
     * if found on page.
     */
     OPTIONS.observedAreas.forEach(selector => {
      const observableArea = document.querySelector(selector);
      
      if (observableArea) {
        /**
         * If the element is found on the page, we observe any mutations to it, and if those
         * mutations include new nodes we call `filterVideos()`. We could check to make sure the
         * nodes are relevant, but it would probably be slower to run than the actual filtering.
         */
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => mutation.addedNodes.length && filterVideos());
        });

        observer.observe(observableArea, { childList: true, subtree: true }); // Start observing
      }
    });

    /**
     * General UI related functions
     */

    /**
     * Does the CSS changes necessary to enable cinema mode. In case this runs
     * immediately on page load, we wait a couple of seconds for the player
     * controls to load before telling the cinema mode button to appear active.
     */
    function toggleCinemaMode() {
      // Add and remove some CSS classes that control cinema view
      player.classList.remove('original');
      player.classList.add('wide');
      document.querySelector('#hd-rightColVideoPage').classList.add('wide');
      
      // Make sure cinema mode button appears as active
      setTimeout(() => {
        document.querySelector('.mhp1138_cinema').classList.add('mhp1138_active');
      }, 2000);
    }
    
    /**
     * Clicking a video on a playlist page opens it without the playlist at the
     * top if the option is enabled.
     */
    function updatePlaylistLinks() {
      if (OPTIONS.openWithoutPlaylist) {
        document.querySelectorAll('#videoPlaylist li a').forEach(link => {
          link.href = link.href.replace('pkey', 'nopkey');
        });
      } else {
        document.querySelectorAll('#videoPlaylist li a').forEach(link => {
          link.href = link.href.replace('nopkey', 'pkey');
        });
      }
    }

   /**
    * Allow scrolling the page when mouse hovers playlists in "add to", by
    * cloning the playlist scroll container to remove the listeners that
    * `preventDefault()`.
    */
    function fixScrollContainer(container) {
      if (container) {
        container.parentNode.replaceChild(container.cloneNode(true), container);
      }
    }

    /**
     * Video thumbnail box related functions
     */

    /**
     * Checks if video box links to a video made by a verified member
     */
    function videoIsVerified(box) {
      return box.innerHTML.includes('Video of verified member');
    }
    
    /**
     * Checks if video box links to a HD video
     */
    function videoIsHd(box) {
      return box.querySelector('.hd-thumbnail');
    }

    /**
     * Checks if the video box has a "watched" label on it (the video has
     * already been viewed) 
     */
    function videoIsWatched(box) {
      return box.querySelector('.watchedVideoText');
    }

    /**
     * Checks if video box links to a video that is within the selected duration
     * range, if one has been selected in options.
     */
    function videoIsWithinDuration(box) {
      // Parse integer minutes from video duration text
      const mins = parseInt(box.querySelector('.duration').textContent.split(":")[0]);
      const minMins = OPTIONS.durationFilter.min;
      const maxMins = OPTIONS.durationFilter.max;

      // If either max or min duration has been selected
      if (minMins || maxMins) {
        // If any max duration is set (otherwise defaults to 0 for no max)
        const hasMaxDuration = !!maxMins;
        // True if the video is shorther than we want (min defaults to 0)
        const isBelowMin = mins < minMins;
        // True if a max duration is set and the video exceeds it
        const isAboveMax = hasMaxDuration && (mins > maxMins - 1);
        // One minute negative offset since we ignore any extra seconds

        return !isBelowMin && !isAboveMax;
      } else {
        return true;
      }
    }

    /**
     * Resets video thumbnail box to its original visible state. 
     */
    function resetVideo(box) {
      showVideo(box);
    }

    /**
     * Shows the video thumbnail box. 
     */
    function showVideo(box) {
      box.classList.remove('plus-hidden');
    }

    /**
     * Hides the video thumbnail box. 
     */
    function hideVideo(box) {
      box.classList.add('plus-hidden');
    }

    /**
     * Does the required checks to filter out unwanted video boxes according to
     * options. Each box is reset to it's original visible state, then it's
     * checked against relevant options to determine if it should be hidden or
     * stay visible. 
     */
    function filterVideos() {
      document.querySelectorAll('li.videoblock.videoBox').forEach(box => {
        const state = {
          verified: videoIsVerified(box),
          watched: videoIsWatched(box),
          hd: videoIsHd(box),
          inDurationRange: videoIsWithinDuration(box)
        }

        const shouldHide =
          (OPTIONS.showOnlyHd && !state.hd) ||
          (OPTIONS.showOnlyVerified && !state.verified) ||
          (OPTIONS.hideWatchedVideos && state.watched) ||
          !state.inDurationRange;
        
        // Reset the box to its original visible state so we can focus only on
        // what to hide instead of also on what to unhide
        resetVideo(box);

        if (shouldHide)  {
          hideVideo(box);
        }
      });
    }

    /**
     * Initialize video pages (that contain a valid video element)
     */

    if (/^http[s]*:\/\/[www.]*pornhub\.com\/view_video.php/.test(window.location.href) && player) {
      if (OPTIONS.cinemaModePlayer) {
        toggleCinemaMode();
      }

      // Let us scroll the page despite the mouse pointer hovering over the "Add to" playlist area
      const scrollContainer = document.querySelector('#scrollbar_watch');

      if (scrollContainer) {
        fixScrollContainer(scrollContainer);
      }
    }

    /**
     * Initialize any page that contains a video box
     */
    
     if (document.querySelector('.videoBox')) {
      setTimeout(() => {
        filterVideos();
      }, 1000);
    }
    
    /**
     * Initialize profile pages, channel pages, user pages, star pages
     */
    
    /**
     * Redirect profile pages straight to their video uploads page if the setting is
     * enabled, except in case we just came from the video page (don't loop back).
     */
    if (
      /^http[s]*:\/\/[www.]*pornhub\.com\/pornstar\/([^\/]+)$/.test(window.location.href) ||
      /^http[s]*:\/\/[www.]*pornhub\.com\/model\/([^\/]+)$/.test(window.location.href)) {
      // Stars and models have their own uploads at `/videos/uploads`
      if (OPTIONS.redirectToVideos && !/.+\/videos.*/.test(document.referrer)) {
        window.location.href = window.location.href + '/videos/upload';
      }
    } else if (
      /^http[s]*:\/\/[www.]*pornhub\.com\/users\/([^\/]+)$/.test(window.location.href) ||
      /^http[s]*:\/\/[www.]*pornhub\.com\/channels\/([^\/]+)$/.test(window.location.href)) {
      // Users and channels only have `/videos` and not `/videos/uploads`
      if (OPTIONS.redirectToVideos && !/.+\/videos.*/.test(document.referrer)) {
        window.location.href = window.location.href + '/videos';
      }
    }
    
    /*
     * Add styles
     */
    
    GM_addStyle(sharedStyles);
    GM_addStyle(themeStyles);
    GM_addStyle(generalStyles);
    
    /*
     * Add dynamic styles
     */
    
    const dynamicStyles = `
      .plus-buttons {
        margin-right: -${buttons.getBoundingClientRect().width - 23}px;
      }

      .plus-buttons:hover {
        margin-right: 0;
      }
    `;
    
    GM_addStyle(dynamicStyles);
  });
})();