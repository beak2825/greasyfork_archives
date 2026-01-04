// ==UserScript==
// @name     zactopus' Twitch Tweaks
// @version  1.1.6
// @grant    none
// @match    https://www.twitch.tv/*
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @namespace https://greasyfork.org/users/813052
// @description tweaks twitch to remove loads of crap
// @downloadURL https://update.greasyfork.org/scripts/432060/zactopus%27%20Twitch%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/432060/zactopus%27%20Twitch%20Tweaks.meta.js
// ==/UserScript==

/* global VM */

const logger = (...args) => {
  return console.log("[zactopus' Twitch Tweaks]", ...args);
};

logger("Loading...");

function alphabetiseFollowedChannels({ categoriesToRemove = [] } = {}) {
  function getParentElementWithClass(element, className) {
    if (element.classList.contains(className)) {
      return element;
    }

    if (!element.parentElement) {
      return null;
    }

    return getParentElementWithClass(element.parentNode, className);
  }


  let currentFollowedChannelsUsernames = [];

  function areUpdatedFollowerChannelSame(followedChannels) {
    const followedChannelsUsernames = followedChannels.map(channel => {
      return channel.username;
		});
    return currentFollowedChannelsUsernames.toString() === followedChannelsUsernames.toString();
  }

  VM.observe(document.body, () => {
    const sideNavTransitionGroupElement = document.querySelector('.side-nav-section .tw-transition-group');

    if (sideNavTransitionGroupElement) {
      const followedChannelsElements = [...document.querySelectorAll('[data-test-selector="followed-channel"]')];

      // no channels
      if (followedChannelsElements.length === 0) {
        logger('No channels');
        return;
      }

      const followedChannels = followedChannelsElements.map(element => {
        const username = element.getAttribute('href').replace('/', '');
        return { element, username };
      });

      if (areUpdatedFollowerChannelSame(followedChannels)) {
        return;
      }
      currentFollowedChannelsUsernames = followedChannels.map(j => j.username).toString();

      // hide any removed categories
      followedChannels.forEach(channel => {
        const category = channel.element.querySelector('[data-a-target="side-nav-game-title"]')?.innerText;
        const isntCategoryToBeRemoved = !categoriesToRemove.includes(category);


        console.log({ channel, isntCategoryToBeRemoved });
        if (!isntCategoryToBeRemoved) {
          channel.element.remove();
        }
      });

      const filteredFollowedChannels = followedChannels.filter(channel => {
        const hasOfflineClassName = channel.element.querySelector('.side-nav-card__avatar--offline');
        return !hasOfflineClassName;
      })


      if (filteredFollowedChannels.length === 0) {
        logger('No online channels');
      	return;
      }

      const sortedFollowedChannels = filteredFollowedChannels.sort((a, b) => {
        return a.username.localeCompare(b.username);
      });

      sortedFollowedChannels.reverse().forEach(channel => {
        const element = getParentElementWithClass(channel.element, 'tw-transition');
        element.setAttribute("data-zactopus-twitch-tweaks", "true");
        sideNavTransitionGroupElement.prepend(element);
      });

      logger('Updated channels', currentFollowedChannelsUsernames);
    }
  });
}


function redirectHomePageToFollowingPage() {
    VM.observe(document.body, () => {
        const followingLinkElement = document.querySelector('[data-test-selector="top-nav__following-link"]');
        const homepageLinkElements = [...document.querySelectorAll('[href="/"]')];

        if (followingLinkElement && homepageLinkElements.length > 0) {
            homepageLinkElements.forEach(element => {
                element.setAttribute('data-a-target', followingLinkElement.getAttribute('data-a-target'));
                element.href = followingLinkElement.href;
                element.addEventListener('click', () => {
                    window.location.href = window.location.origin + '/directory/following';
                });
            });
        }
    });
}

alphabetiseFollowedChannels({ categoriesToRemove: ['Dead by Daylight'] });
redirectHomePageToFollowingPage();
