// ==UserScript==
// @name         YouTube Awesome
// @namespace    https://github.com/pagyew
// @version      1.0.9
// @description  Get the best YouTube experience
// @author       Vladislav Tsepilov (https://github.com/pagyew)
// @license      MIT
// @homepageURL  https://github.com/pagyew/youtube-awesome
// @supportURL   https://github.com/pagyew/youtube-awesome
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/496728/YouTube%20Awesome.user.js
// @updateURL https://update.greasyfork.org/scripts/496728/YouTube%20Awesome.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const shortsSelectors = [
    // Menus
    'ytm-pivot-bar-item-renderer:has(.pivot-shorts)',
    'ytd-mini-guide-entry-renderer:has(a#endpoint[title*="shorts" i])',
    'ytd-guide-entry-renderer:has(a#endpoint[title*="shorts" i])',

    // Tabs
    'yt-chip-cloud-chip-renderer:has(yt-formatted-string[title*="shorts" i])',
    'yt-tab-shape[tab-title*="shorts" i]',

    // Sections
    'ytm-reel-shelf-renderer',
    'ytd-reel-shelf-renderer',
    'ytm-item-section-renderer:has(.big-shorts-singleton)',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer)',

    // Videos
    'ytd-video-renderer:has(a#thumbnail[href*="shorts" i])',

    // Ads
    'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
  ];

  const mixSelectors = [
    // Tabs
    'yt-chip-cloud-chip-renderer:has(yt-formatted-string[title*=mixes i])',

    // Videos
    'ytd-rich-item-renderer:has(ytd-playlist-thumbnail):has(a[title^="Mix - "])',
    'ytd-rich-item-renderer:has(ytd-playlist-thumbnail):has(a[title="My Mix"])',
    'ytd-rich-item-renderer:has(yt-collections-stack):has([title^="Mix - "])',
    'ytd-rich-item-renderer:has(yt-collections-stack):has([title="My Mix"])',
    'ytd-radio-renderer:has(ytd-playlist-thumbnail):has(span[title^="Mix - "])',
    'ytd-compact-radio-renderer:has(yt-collections-stack):has(span[title^="Mix - "])',
  ];

  const watchedSelectors = [
    //Videos
    'ytd-rich-item-renderer:has(#progress[style="width: 100%;"])',
    'ytd-compact-video-renderer:has(#progress[style="width: 100%;"])',
  ];

  const options = [
    {
      id: 'shorts',
      title: 'Shorts',
      defaultValue: true,
      selectors: shortsSelectors,
    },
    {
      id: 'mix',
      title: 'Mixes',
      defaultValue: true,
      selectors: mixSelectors,
    },
    {
      id: 'watched',
      title: 'Watched',
      defaultValue: true,
      selectors: watchedSelectors,
    },
  ];

  function register(option) {
    const { id, ref, title } = option;
    const command = `--- ${ref.value ? '✅' : '❌'} ${title}`;

    GM_registerMenuCommand(
      command,
      () => {
        ref.value = !ref.value;
        setTimeout(update);
      },
      {
        id,
        autoClose: false,
      },
    );
  };

  function unregister(option) {
    GM_unregisterMenuCommand(option.id);
  };

  function useOption(option) {
    const { id, defaultValue } = option;

    if (typeof GM_getValue === 'undefined') {
      return { value: defaultValue };
    };

    const ref = {
      get value() {
        return GM_getValue(id, defaultValue);
      },
      set value(v) {
        GM_setValue(id, v);
      },
    };

    return { ...option, ref };
  };

  const style = document.createElement('style');
  document.body.appendChild(style);
  
  const usedOptions = options.map(useOption);
  GM_registerMenuCommand('Hide:', () => { }, { autoClose: false });

  function update() {
    usedOptions.forEach(unregister);
    usedOptions.forEach(register);

    const selectors = usedOptions
      .filter(({ ref }) => ref.value)
      .map(({ selectors }) => selectors)
      .flat();

    if (selectors.length > 0) {
      style.innerText = `${selectors.join(',')}{ display: none !important; }`;
    };
  };

  update();
})();
