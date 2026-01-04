// ==UserScript==
// @name         YouTube Music and Shorts Redirector
// @version      3.8.1
// @description  Provides a redirect button on YouTube '/shorts/' pages to '/watch?v=' and buttons from www.youtube.com to music.youtube.com, even a setting to automatically redirect from /shorts/ to '/watch?v='.
// @author       Mayer_Szabolcs
// @match        *://www.youtube.com/*
// @match        *://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @namespace    https://greasyfork.org/users/1129350
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/471148/YouTube%20Music%20and%20Shorts%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/471148/YouTube%20Music%20and%20Shorts%20Redirector.meta.js
// ==/UserScript==

// Greasy Fork link: https://greasyfork.org/en/scripts/471148-youtube-music-and-shorts-redirector

(function () {
  'use strict';

  const config = {
    check_if_page_is_shorts_interval: 1000, // Set the interval in milliseconds
    check_if_its_music_interval: 1000, // Set the interval in milliseconds for checking if it's a music page
    check_if_its_youtube_interval: 1000, // Set the interval in milliseconds for checking if it's a YouTube page
  };

  // Create an HTML element with specified attributes and optional text content
  function createElement(tag, attributes, textContent) {
    const element = Object.assign(document.createElement(tag), attributes);
    if (textContent) element.textContent = textContent;
    return element;
  }

  const settingsMenus = {}; // Track registered settings menus

  // A utility function to handle user options and settings
  function useOption(key, title, defaultValue) {
    if (typeof GM_getValue === 'undefined') return { value: defaultValue };

    if (!settingsMenus[key]) {
      let value = GM_getValue(key, defaultValue);
      const ref = {
        get value() {
          return value;
        },
        set value(v) {
          value = v;
          GM_setValue(key, v);
          toggleButtonVisibility(); // Update button visibility on value change
        },
      };

      GM_registerMenuCommand(`${title}: ${value ? 'On load it was: Hidden' : 'On load it was: Visible'}`, () => (ref.value = !value));

      settingsMenus[key] = ref; // Store the reference to the settings menu
    }

    return settingsMenus[key];
  }

  const container = createElement('div', {
    id: 'script-buttons', // Name the div "script-buttons"
    style: `
      position: fixed;
      top: 10px;
      right: 175px;
      z-index: 9999;
      display: flex;
      gap: 8px;
    `,
  });

  // Toggle the visibility of the buttons based on user settings
  function toggleButtonVisibility() {
    container.style.display = hideHomeTabs.value ? 'none' : 'flex';
  }

  const hideHomeTabs = useOption('youtube_hide_home_tabs', 'Show/Hide The Buttons', false);

  // Create a button to hide or show the other buttons
  const hideButtonDiv = createElement('div', { id: 'hide-button-div' });
  const hideButton = createElement('button', {
    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">	<path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" fill="#fff"/></svg>',
    style: `
      background-color: #f00;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
      padding: 8px 12px;
    `,
    onclick: () => {
      hideHomeTabs.value = !hideHomeTabs.value;
    },
  });
  hideButtonDiv.appendChild(hideButton);

  const musicAndYouTubeButtonDiv = createElement('div', { id: 'music-youtube-button-div' });

  const musicRedirectButton = createElement('button', {
    textContent: 'Go to YouTube Music',
    style: `
      background-color: #f00;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
      padding: 8px 12px;
    `,
    onclick: () => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace('https://www.youtube.com/', 'https://music.youtube.com/');
      window.location.href = newUrl;
    },
  });

  const youtubeRedirectButton = createElement('button', {
    textContent: 'Go to YouTube',
    style: `
      background-color: #f00;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
      padding: 8px 12px;
      display: none;
    `,
    onclick: () => {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace('https://music.youtube.com/', 'https://www.youtube.com/');
      window.location.href = newUrl;
    },
  });

  musicAndYouTubeButtonDiv.appendChild(musicRedirectButton);
  musicAndYouTubeButtonDiv.appendChild(youtubeRedirectButton);

  const redirectButtonDiv = createElement('div', { id: 'redirect-button-div' });
  const redirectButton = createElement('button', {
    textContent: 'Redirect',
    style: `
      background-color: #f00;
      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-weight: 500;
      padding: 8px 12px;
      display: none;
    `,
    onclick: () => {
      const currentUrl = window.location.href;
      if (isShortsPage()) {
        const newUrl = currentUrl.replace('shorts/', 'watch?v=');
        window.location.href = newUrl;
      }
    },
  });
  redirectButtonDiv.appendChild(redirectButton);

  container.appendChild(hideButtonDiv);
  container.appendChild(musicAndYouTubeButtonDiv);
  container.appendChild(redirectButtonDiv);

  document.body.appendChild(container);

  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement !== null;
    [hideButtonDiv, redirectButtonDiv, musicAndYouTubeButtonDiv].forEach(
      (buttonDiv) => (buttonDiv.style.display = isFullscreen ? 'none' : 'block')
    );
  });

  setInterval(() => {
    if (isShortsPage()) {
      redirectButton.style.display = 'block';
    } else {
      redirectButton.style.display = 'none';
    }
  }, config.check_if_page_is_shorts_interval);

  setInterval(() => {
    if (isMusicPage()) {
      musicRedirectButton.style.display = 'block';
      youtubeRedirectButton.style.display = 'none';
    } else if (isYouTubePage()) {
      musicRedirectButton.style.display = 'none';
      youtubeRedirectButton.style.display = 'block';
    } else {
      musicRedirectButton.style.display = 'none';
      youtubeRedirectButton.style.display = 'none';
    }
  }, config.check_if_its_music_interval);

  setInterval(() => {
    if (isYouTubePage()) {
      musicRedirectButton.style.display = 'block';
      youtubeRedirectButton.style.display = 'none';
    } else {
      musicRedirectButton.style.display = 'none';
      youtubeRedirectButton.style.display = 'block';
    }
  }, config.check_if_its_youtube_interval);

  toggleButtonVisibility();

  function isShortsPage() {
    return window.location.href.includes('/shorts/');
  }

  function isMusicPage() {
    return window.location.href.includes('music.youtube.com');
  }

  function isYouTubePage() {
    return window.location.href.includes('www.youtube.com');
  }

  function isEmbed() {
    return window.location.href.includes('/embed/');
  }

  function isLiveChat() {
    return window.location.href.includes('/live_chat');
  }

    if (isEmbed() || isLiveChat()) {
       container.style.display = "none";
    }
})();


(function () {
  'use strict';

  function useOption(key, title, defaultValue) {
    if (typeof GM_getValue === 'undefined') {
      return {
        value: defaultValue,
      };
    }

    let value = GM_getValue(key, defaultValue);
    const ref = {
      get value() {
        return value;
      },
      set value(v) {
        value = v;
        GM_setValue(key, v);
        location.reload();
      },
    };

    GM_registerMenuCommand(`${title}: ${value ? '✔' : '❌'}`, () => {
      ref.value = !value;
    });

    return ref;
  }

  const shortsRedirectOption = useOption('shorts_redirect_option', 'Redirect Shorts', false);

  if (shortsRedirectOption.value) {
    const redirectShortsToWatch = () => {
      const currentHref = window.location.href;
      const newHref = currentHref.replace('/shorts/', '/watch?v=');
      if (newHref !== currentHref) {
        window.location.replace(newHref);
      }
    };

    const observerCallback = () => {
      const newHref = window.location.href;
      if (newHref !== oldHref) {
        oldHref = newHref;
        redirectShortsToWatch();
      }
    };

    let oldHref = window.location.href;
    const bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
      redirectShortsToWatch();
    });
  }
})();