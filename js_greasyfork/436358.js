/* eslint-disable func-names */
// ==UserScript==
// @name         Bumble Auto Swipe Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      GNU GPLv3
// @description  Bumble auto swipe bot
// @author       Aamir khan
// @url          github.com/iamaamir
// @namespace    https://github.com/iamaamir
// @match        https://bumble.com/app
// @icon         https://www.google.com/s2/favicons?domain=bumble.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436358/Bumble%20Auto%20Swipe%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/436358/Bumble%20Auto%20Swipe%20Bot.meta.js
// ==/UserScript==

(function (win) {
  const swipes = []; // save all the swipes
  const minTime = 5000;
  const maxTime = 2500;

  // helpers
  const b = (obj, f) => obj[f].bind(obj);
  const select = b(document, 'querySelector');
  const el = b(document, 'createElement');
  const log = b(console, 'log');

  // icons
  const swipeIcon = '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><path  d="M30.4 17.6c-1.8-1.9-4.2-3.2-6.7-3.7-1.1-.3-2.2-.5-3.3-.6 2.8-3.3 2.3-8.3-1-11.1s-8.3-2.3-11.1 1-2.3 8.3 1 11.1c.6.5 1.2.9 1.8 1.1v2.2l-1.6-1.5c-1.4-1.4-3.7-1.4-5.2 0-1.4 1.4-1.5 3.6-.1 5l4.6 5.4c.2 1.4.7 2.7 1.4 3.9.5.9 1.2 1.8 1.9 2.5v1.9c0 .6.4 1 1 1h13.6c.5 0 1-.5 1-1v-2.6c1.9-2.3 2.9-5.2 2.9-8.1v-5.8c.1-.4 0-.6-.2-.7zm-22-9.4c0-3.3 2.7-5.9 6-5.8 3.3 0 5.9 2.7 5.8 6 0 1.8-.8 3.4-2.2 4.5v-5a3.4 3.4 0 0 0-3.4-3.2c-1.8-.1-3.4 1.4-3.4 3.2v5.2c-1.7-1-2.7-2.9-2.8-4.9zM28.7 24c.1 2.6-.8 5.1-2.5 7.1-.2.2-.4.4-.4.7v2.1H14.2v-1.4c0-.3-.2-.6-.4-.8-.7-.6-1.3-1.3-1.8-2.2-.6-1-1-2.2-1.2-3.4 0-.2-.1-.4-.2-.6l-4.8-5.7c-.3-.3-.5-.7-.5-1.2 0-.4.2-.9.5-1.2.7-.6 1.7-.6 2.4 0l2.9 2.9v3l1.9-1V7.9c.1-.7.7-1.3 1.5-1.2.7 0 1.4.5 1.4 1.2v11.5l2 .4v-4.6c.1-.1.2-.1.3-.2.7 0 1.4.1 2.1.2v5.1l1.6.3v-5.2l1.2.3c.5.1 1 .3 1.5.5v5l1.6.3v-4.6c.9.4 1.7 1 2.4 1.7l.1 5.4z"/></svg>';
  const stopSwipeIcon = '<svg class="has-solid" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><path class="clr-i-outline clr-i-outline-path-1" d="M30 32H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2ZM6 6v24h24V6Z"/></svg>';
  const toJsonIcon = '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"><path d="M28.09 9.74a4 4 0 0 0-1.16.19c-.19-1.24-1.55-2.18-3.27-2.18a4 4 0 0 0-1.53.25A3.37 3.37 0 0 0 19 6.3a3.45 3.45 0 0 0-2.87 1.32 3.65 3.65 0 0 0-1.89-.51A3.05 3.05 0 0 0 11 9.89v.91c-1.06.4-4.11 1.8-4.91 4.84s.34 8 2.69 11.78a25.21 25.21 0 0 0 5.9 6.41.9.9 0 0 0 .53.17h10.34a.92.92 0 0 0 .55-.19 13.13 13.13 0 0 0 3.75-6.13A25.8 25.8 0 0 0 31.41 18v-5.5a3.08 3.08 0 0 0-3.32-2.76ZM29.61 18a24 24 0 0 1-1.47 9.15 12.46 12.46 0 0 1-2.94 5.05h-9.73a23.75 23.75 0 0 1-5.2-5.72c-2.37-3.86-3-8.23-2.48-10.39A5.7 5.7 0 0 1 11 12.76v7.65a.9.9 0 0 0 1.8 0V9.89c0-.47.59-1 1.46-1s1.49.52 1.49 1v5.72h1.8v-6.8c0-.28.58-.71 1.46-.71s1.53.48 1.53.75v6.89h1.8V10l.17-.12a2.1 2.1 0 0 1 1.18-.32c.93 0 1.5.44 1.5.68v6.5H27v-4.87a1.91 1.91 0 0 1 1.12-.33c.86 0 1.52.51 1.52.94Z" class="clr-i-outline clr-i-outline-path-1"/></svg>';

  // css selectors
  const actionBarClass = '.encounters-controls__hotkeys';
  const usernameClass = '.encounters-story-profile__user';
  const profileBoxClass = 'picture.media-box__picture';
  const townClass = '.location-widget';
  const likeBtnClass = '.encounters-action--like';

  const addAction = (title, cb = log, icon) => {
    log('making a new action', title);
    const action = el('div');
    const actionBar = select(actionBarClass);
    action.addEventListener('click', cb);
    const html = `<div class="hotkey tooltip-activator" title=${title}>
  <div class="hotkey__icon">
      <span class="icon icon--size-stretch" role="presentation" data-qa-role="icon">
          ${icon}
      </span>
  </div>
  </div>`;
    action.innerHTML = html;
    actionBar.appendChild(action);
  };

  function eventFire(target, etype) {
    if (target.fireEvent) {
      target.fireEvent(`on${etype}`);
    } else {
      const evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      target.dispatchEvent(evObj);
    }
  }

  function getNextSwipeTime(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getUserName() {
    return select(usernameClass).textContent;
  }

  function getProfilebox() {
    return document.querySelectorAll(profileBoxClass);
  }

  function getSrc(pic) {
    return pic.firstChild.src;
  }

  function getTown() {
    return select(townClass).textContent;
  }

  let timer = null;
  const bumbleBot = {
    startSwiping: function swipe() {
      const likeBtn = select(likeBtnClass);
      if (!likeBtn) return;
      const nextSwipeTime = getNextSwipeTime(minTime, maxTime);
      log('Next Swipe is in ', nextSwipeTime);
      timer = setTimeout(() => {
        swipes.push([`${getUserName()} from ${getTown()}`, Array.from(getProfilebox()).flatMap(getSrc)]);
        eventFire(likeBtn, 'click');
        swipe();
      }, nextSwipeTime);
    },

    toJson(write = false) {
      this.stopSwiping();
      const data = JSON.stringify(swipes, null, 2);
      const logger = write ? document.write : log;
      logger(data);
    },

    stopSwiping: function stopSwiping() {
      log('Swiping stopped');
      clearTimeout(timer);
    },
  };

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (select(selector)) return resolve(select(selector));

      const observer = new MutationObserver(() => {
        if (select(selector)) {
          resolve(select(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  if (win) {
    win.onload = function () {
      log('loading auto swipe script');
      waitForElm(actionBarClass).then(() => {
        log('Action bar is ready');
        addAction('AutoSwipe', bumbleBot.startSwiping, swipeIcon);
        addAction('StopSwipe', bumbleBot.stopSwiping, stopSwipeIcon);
        addAction('Collect', b(bumbleBot, 'toJson'), toJsonIcon);
      });
    };
  }
}(window));
