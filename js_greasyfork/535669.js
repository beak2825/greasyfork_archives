// ==UserScript==
// @name         Twitch Followed Channels Color Customizer
// @namespace    http://tampermonkey.net/
// @version      2025-05-11T18-13
// @description  Custom highlighting for selected "Followed Channels" in twitch.tv sidebar.
// @author       Technosoap
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535669/Twitch%20Followed%20Channels%20Color%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/535669/Twitch%20Followed%20Channels%20Color%20Customizer.meta.js
// ==/UserScript==
//
// INSTRUCTIONS FOR USERS: modify the `userConfigJson` below to add or remove
// the channels you want to highlight. For example add the line:
//
//     "MyFavouriteStreamer": "lime",
//
// to highlight MyFavouriteStreamer with a lime-green color.
//
// If you want to add more colors, be sure to add another `GM_addStyle` line
// too.

(function() {
    'use strict';

    const addStyle = function(cssText) {
      let head = document.getElementsByTagName('head')[0];
      if (head) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = cssText;
        head.appendChild(style);
        return style;
      }
      return null;
    };

    addStyle('p.twitch-followed-channels-color-customizer-userscript-highlight-gray { color: gray !important; }');
    addStyle('p.twitch-followed-channels-color-customizer-userscript-highlight-lime { color: lime !important; }');

    // The long term plan is that this JSON would be stored in local storage and
    // modified by some sort of configuration interface. For now, we hard-code
    // it.
    //
    // TODO validate that colors here have a corresponding
    // twitch-followed-channels-color-customizer-userscript-highlight-* class.
    //
    // TODO the config is using human-friendly twitch channel handles (e.g.
    // "OldTimeyComputerShow"). Handles can change, so ideally we would be using
    // something immutable like the channel ID, but AFAICT that requires an API
    // call. Not worth the faff right now.
    const userConfigJson = `{"highlights": {
       "OldTimeyComputerShow": "gray",
       "PirateSoftware": "lime"}}`;

    // Revive with Object.create(null), to avoid issues of a namespace collision
    // between Object's prototype and twitch users (imagine a twitch streamer
    // called toString...).
    //
    // ref:
    // https://esdiscuss.org/topic/proposal-add-an-option-to-omit-prototype-of-objects-created-by-json-parse#content-1
    // via https://stackoverflow.com/a/48260948
    const userConfig = JSON.parse(userConfigJson, function(key, value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return Object.assign(Object.create(null), value);
        }
        return value;
    });

    const findFollowedChannelsDiv = function() {
        const followedChannelsDiv = document.querySelector(`div[aria-label="Followed Channels"]`);
        if (followedChannelsDiv) {
            let observerTimer = 0;
            const observer = new ResizeObserver((entries) => {
                // debouncing
                clearTimeout(observerTimer);
                observerTimer = setTimeout(changeColor, 100, followedChannelsDiv);
            }).observe(followedChannelsDiv);
            clearInterval(findFollowedChannelsDivInterval);
        }
    }
    const findFollowedChannelsDivInterval = setInterval(findFollowedChannelsDiv, 1000);

    const changeColor = function(followedChannelsDiv) {
        for (const titleElem of followedChannelsDiv.getElementsByClassName("side-nav-card__title")) {
            const handle = titleElem.firstElementChild.title;
            const highlightColor = userConfig.highlights[handle];
            if (highlightColor) {
                titleElem.firstElementChild.classList.toggle(`twitch-followed-channels-color-customizer-userscript-highlight-${highlightColor}`, true);
            }
        }
    };
})();
