// ==UserScript==
// @name         Twitter scroller & like clicker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Scroll and like in twitter
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427317/Twitter%20scroller%20%20like%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/427317/Twitter%20scroller%20%20like%20clicker.meta.js
// ==/UserScript==

(function () {
  setTimeout(() => {
    'use strict';

    // UI elements
    const arrowSvgString = '<svg viewBox="0 0 24 24"><g><path d="M12 4.656l8.72 8.72c.293.293.768.293 1.06 0s.294-.768 0-1.06l-9.25-9.25c-.292-.294-.767-.294-1.06 0l-9.25 9.25c-.146.145-.22.337-.22.53s.073.383.22.53c.293.292.768.292 1.06 0L12 4.656z"></path><path d="M12 12.465l8.72 8.72c.293.293.768.293 1.06 0s.294-.768 0-1.06l-9.25-9.25c-.292-.294-.767-.294-1.06 0l-9.25 9.25c-.146.145-.22.337-.22.53s.073.383.22.53c.293.292.768.292 1.06 0l8.72-8.72z"></path></g></svg>';
    const likeSvgString = '<svg viewBox="0 0 24 24"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>';

    // Utilities
    const random = (min, max) => Math.random() * (max - min) + min;

    const fireMouseEvent = (el, etype, x, y) => {
      el.dispatchEvent(new MouseEvent(etype, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        button: 0
      }));
    };

    const clickElement = (el) => {
      var box = el.getBoundingClientRect(),
        x = box.left + (box.right - box.left) / 2,
        y = box.top + (box.bottom - box.top) / 2;

      fireMouseEvent(el, "mousedown", x, y);
      fireMouseEvent(el, "mouseup", x, y);
      fireMouseEvent(el, "click", x, y);
    }

    const createFromHTML = (htmlString) => {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes
      return div.firstChild;
    }

    // Get elements Utilites

    const arrowSvg = createFromHTML(arrowSvgString);
    const heartSvg = createFromHTML(likeSvgString);
    const blueColor = 'rgba(29,161,242,1.00)';

    arrowSvg.setAttribute("style", "transform: rotate(180deg);");
    const getNav = () => document.querySelector('nav[role="navigation"]');
    const getHearts = () => Array.from(document.querySelectorAll('main [d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"]'))
    const getTweets = (current) => {
      const all = Array.from(document.querySelectorAll('article'));
      return all.slice(all.indexOf(current) + 1);
    }

    // Setup settings
    const getStorageKey = (key) => `t-${key}-${location.pathname}`
    const getLocalSettings = () => ({
      scroll: !!localStorage.getItem(getStorageKey('scroll')),
      like: !!localStorage.getItem(getStorageKey('like')),
    })

    let settings = getLocalSettings();

    // Setup loops
    let tweets = [];
    let currentIndex = 0;
    let reloads = 0;
    const rndReloads = random(10, 20);

    const startInterval = (callback, ms) => {
      callback();
      return setInterval(callback, ms);
    }

    const getIntervalMap = {
      like: () => startInterval(() => {
        settings.like && getHearts().forEach((h) => h !== setTimeout(() => settings.like && clickElement(h), random(300, 3300)));
      }, 5000, 'like'),
      scroll: () => startInterval(() => {
        if (settings.scroll) {
          if (reloads > rndReloads) {
            window.location.reload();
            return;
          }

          let tweet = tweets[currentIndex++];
          if (!tweet) {
            tweets = getTweets(tweets[currentIndex - 2]);
            currentIndex = 0;
            tweet = tweets[currentIndex++];
            reloads++;
          }
          if (tweet) tweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 5000, 'scroll')
    };

    const intervalRefMap = {
      scroll: settings.scroll ? getIntervalMap.scroll() : null, like: settings.like ? getIntervalMap.like() : null
    };

    // Setup UX
    const uiContainer = getNav();

    const createNavElement = (newIcon, text, clickHandler) => {
      const newElement = uiContainer.lastChild.cloneNode(true);
      const oldIcon = newElement.querySelector('svg');

      newIcon.className.baseVal = oldIcon.className.baseVal;

      oldIcon.parentElement.appendChild(newIcon);
      oldIcon.parentElement.removeChild(oldIcon);

      const textSpan = newElement.querySelector('span');
      if (textSpan) {
        textSpan.innerHTML = text;
      }

      newElement.addEventListener('click', (e) => {
        clickHandler(e);
        e.preventDefault && e.preventDefault();
        return false;
      });

      return newElement;
    }

    const doButtonStyle = (button, activate) => {
      const svg = button.querySelector('svg');
      const text = button.querySelector('span');

      button.style.color = activate ? blueColor : null;

      if (svg) {
        svg.style.fill = activate ? blueColor : null
      }

      if (text) {
        text.style.color = activate ? blueColor : null;
      }
    }

    const handleClick = (settingKey) => ({ target }) => {
      const button = target.matches('[role="button"]') ? target : target.closest('[role="button"]');
      if (settings[settingKey] = !settings[settingKey]) {
        intervalRefMap[settingKey] = getIntervalMap[settingKey]();
        localStorage.setItem(getStorageKey(settingKey), '1');
        doButtonStyle(button, true);
      } else {
        localStorage.setItem(getStorageKey(settingKey), '');
        intervalRefMap[settingKey] = clearTimeout(intervalRefMap[settingKey]);
        doButtonStyle(button, false);
      }
    };

    const scrollButton = createNavElement(arrowSvg, 'Auto Scroll', handleClick('scroll'));
    if (settings.scroll) doButtonStyle(scrollButton, true);

    const likeButton = createNavElement(heartSvg, 'Auto Like', handleClick('like'));
    if (settings.like) doButtonStyle(likeButton, true);

    uiContainer.prepend(likeButton);
    uiContainer.prepend(scrollButton);

    const getButton = (key) => ({
      scroll: scrollButton,
      like: likeButton,
    })[key];


    // Polling for client side navigation and tab inactivity
    let wasHidden = false;
    let { href } = window.location;
    setInterval(() => {
      if (href !== window.location.href) {
        href = window.location.href;
        settings = getLocalSettings();

        Object.entries(intervalRefMap).forEach(([key, value]) => {
          const button = getButton(key);
          if (settings[key]) {
            if (!value) intervalRefMap[key] = getIntervalMap[key]();
            doButtonStyle(button, true);
          } else {
            clearTimeout(value);
            doButtonStyle(button, false);
          }
        });
      }
      if (document.hidden) {
        if (!wasHidden) {
          wasHidden = true;
          Object.entries(intervalRefMap).forEach(([key, value]) => { intervalRefMap[key] = clearInterval(value) });
        }
      } else if (wasHidden) {
        wasHidden = false;
        Object.keys(intervalRefMap).forEach((key) => { settings[key] && !intervalRefMap[key] && (intervalRefMap[key] = getIntervalMap[key]()) });
      }
    }, 50);
  }, 3000)
})();