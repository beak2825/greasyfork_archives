// ==UserScript==
// @name         Custom Twitch hacks
// @namespace    TODO
// @version      0.3
// @description  Various custom enhancements for Twitch
// @author       buzz
// @match        *://*.twitch.tv/*
// @grant        none
// @license      GPLv3 or later
// @downloadURL https://update.greasyfork.org/scripts/459617/Custom%20Twitch%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/459617/Custom%20Twitch%20hacks.meta.js
// ==/UserScript==

/**
 * - Adds following link to user card/also on moderator page
 * - Enlarges user card chat messages height
 */

(function() {
  'use strict';

  const moderator = window.location.pathname.startsWith('/moderator/');

  const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 20c-6.6-6.1-10-9.2-10-12.9C3.5 4 5.9 1.6 9 1.6c1.7 0 3.4.8 4.5 2.1c1.1-1.3 2.8-2.1 4.5-2.1c3.1 0 5.5 2.4 5.5 5.5c0 3.8-3.4 6.9-10 12.9M12 21.1C5.4 15.2 1.5 11.7 1.5 7v-.6c-.6.9-1 2-1 3.2c0 3.8 3.4 6.9 10 12.8l1.5-1.3Z"/></svg>`

  let bodyObserver;
  let userCardObserver;
  let followingLink;

  const observerOptions = {
    childList: true,
    attributes: false,
    subtree: true
  }

  function debounce(fn, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => fn.call(this, ...args), wait)
    }
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  const addAvatarLink = debounce((headerNode) => {
    // Hi-res Avatar link
    const avatarImg = headerNode.querySelector('.tw-image-avatar');
    if (avatarImg) {
      const avatarLink = document.createElement('a');
      avatarLink.appendChild(avatarImg.cloneNode());
      avatarLink.setAttribute('target', '_blank');
      avatarLink.setAttribute('title', 'View hi-res avatar');
      avatarLink.setAttribute('href', avatarImg.src.replace('70x70', '600x600'));
      avatarImg.parentElement.replaceChild(avatarLink, avatarImg);
    }
  }, 100)

  const addFollowingLink = debounce((headerNode) => {
    // Following link
    if (!headerNode.querySelector('.followinglink')) {
      const usernameNode = headerNode.querySelector('h4');
      const username = usernameNode.innerText.trim();
      if (username === '') return;
      followingLink = document.createElement('a');
      followingLink.className = 'followinglink';
      followingLink.setAttribute('target', '_blank');
      followingLink.setAttribute('title', 'View following list');
      followingLink.setAttribute('href', `https://twitch-tools.rootonline.de/followinglist_viewer.php?username=${username}`);
      followingLink.innerHTML = heartSvg;
      usernameNode.appendChild(followingLink);
    }
  }, 100);

  function bodyObserverCallback(records) {
    for (const record of records) {
      if (record.addedNodes.length > 0) {
        // mod user card
        if (record.target.className.includes('tw-avatar')) {
          addAvatarLink(record.target);
        }
        if (record.target.className.includes('viewer-card-header__display-name')) {
          addFollowingLink(record.target);
        }

        // regular user card
        if (record.target.className.includes('viewer-card-header__overlay')) {
          addAvatarLink(record.target);
          addFollowingLink(record.target);
        }
      }
    }
  }

  addGlobalStyle(`
.followinglink {
  vertical-align: top;
  display: inline-block;
}

.followinglink > svg {
  color: var(--color-text-overlay);
  transform: scale(0.8);
}

.followinglink:hover > svg {
  color: var(--color-text-overlay-link-hover);
}

.bttv-moderator-card-messages .message-list {
  max-height: 700px !important;
}
`);

  const bodyNode = document.querySelector("body");

  if (bodyNode) {
    bodyObserver = new MutationObserver(bodyObserverCallback);
    bodyObserver.observe(bodyNode, observerOptions);
  }
})();