// ==UserScript==
// @name         Reddit Karma & Account Age Display Below Username (New Reddit 2025)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Muestra karma y edad de cuenta debajo del nombre de usuario en Reddit (interfaz moderna 2025)
// @author       greenwenvy + ChatGPT
// @match        https://www.reddit.com/*
// @grant        GM_xmlhttpRequest
// @connect      reddit.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532562/Reddit%20Karma%20%20Account%20Age%20Display%20Below%20Username%20%28New%20Reddit%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532562/Reddit%20Karma%20%20Account%20Age%20Display%20Below%20Username%20%28New%20Reddit%202025%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const userDataCache = {};

  function getAgeColor(createdDate) {
    const now = new Date();
    const created = new Date(createdDate * 1000);
    const ageInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (ageInDays < 30) return '#e74c3c';
    if (ageInDays < 180) return '#e67e22';
    if (ageInDays < 365) return '#f1c40f';
    if (ageInDays < 730) return '#27ae60';
    if (ageInDays < 1825) return '#3498db';
    return '#8e44ad';
  }

  function formatTimeDifference(createdDate) {
    const now = new Date();
    const created = new Date(createdDate * 1000);
    const diffYears = now.getFullYear() - created.getFullYear();
    const diffMonths = now.getMonth() - created.getMonth();

    if (diffYears > 0) return `${diffYears}y`;
    if (diffMonths > 0) return `${diffMonths}m`;

    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  }

  function fetchUserData(username) {
    if (userDataCache[username]) return Promise.resolve(userDataCache[username]);

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.reddit.com/user/${username}/about.json`,
        responseType: 'json',
        onload: function (response) {
          if (response.status === 200 && response.response?.data) {
            userDataCache[username] = response.response.data;
            resolve(response.response.data);
          } else reject('Failed to fetch user data');
        },
        onerror: reject
      });
    });
  }

  function addKarmaDisplay(userElement, userData) {
    if (userElement.dataset.karmaAdded === "true") return;

    const postKarma = userData.link_karma >= 1000 ? (userData.link_karma / 1000).toFixed(1) + 'k' : userData.link_karma;
    const commentKarma = userData.comment_karma >= 1000 ? (userData.comment_karma / 1000).toFixed(1) + 'k' : userData.comment_karma;
    const accountAge = formatTimeDifference(userData.created);
    const ageColor = getAgeColor(userData.created);

    const container = document.createElement('div');
    container.textContent = `(${postKarma} | ${commentKarma} | ${accountAge})`;
    container.style.fontSize = '10px';
    container.style.color = ageColor;
    container.style.marginTop = '2px';

    // Insert under the username
    const parent = userElement.closest('div'); // Usually a container div
    if (parent) {
      parent.appendChild(container);
      userElement.dataset.karmaAdded = "true";
    }
  }

  function processUsernames() {
    const userLinks = document.querySelectorAll('a[href^="/user/"]:not([data-karma-added])');

    userLinks.forEach(userLink => {
      const username = userLink.textContent.trim();
      if (!username || username.includes('[') || username === 'AutoModerator' || username === '[deleted]') {
        userLink.dataset.karmaAdded = "true";
        return;
      }

      userLink.dataset.karmaAdded = "pending";

      fetchUserData(username)
        .then(data => addKarmaDisplay(userLink, data))
        .catch(() => userLink.dataset.karmaAdded = "true");
    });
  }

  const throttled = (() => {
    let timeout = null;
    return function () {
      if (!timeout) {
        timeout = setTimeout(() => {
          processUsernames();
          timeout = null;
        }, 800);
      }
    };
  })();

  const observer = new MutationObserver(throttled);
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(processUsernames, 1500);
})();
