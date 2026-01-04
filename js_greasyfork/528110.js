// ==UserScript==
// @name         Gamesquad URL Converter
// @namespace    http://tampermonkey.net/
// @version      0.1.3.2
// @license      GPLv3
// @description  Automatically redirect old URLs of Gamesquad Forum to new ones, inspired by @JRV
// @author       micalex
// @match        *://*.gamesquad.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528110/Gamesquad%20URL%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/528110/Gamesquad%20URL%20Converter.meta.js
// ==/UserScript==
(function() {
  const url = window.location.href;
  const regexMap = {
    google: /http:\/\/forums.gamesquad.com\/showthread.php\?([0-9]+)-/,
    archive: /http:\/\/forums.gamesquad.com\/archive\/index.php\/t-([0-9]+)/,
    gamesquad: /http:\/\/forums.gamesquad.com\/showthread.php\?t=([0-9]+)/,
    oldNewGamesquad: /http:\/\/www.gamesquad.com\/xenforo\/index.php\?[^.]+\.([0-9]+)/,
    oldPostUrl: /http:\/\/forums.gamesquad.com\/showpost.php\?p=([0-9]+)/,
    forumdisplay: /http:\/\/forums.gamesquad.com\/forumdisplay.php\?(\d+)-(.+)/,
    member: /http:\/\/forums.gamesquad.com\/member.php\?(\d+)-(.+)/
  };
  const baseNewUrlMap = {
    google: 'https://www.gamesquad.com/forums/index.php?threads/',
    archive: 'https://www.gamesquad.com/forums/index.php?threads/',
    gamesquad: 'https://www.gamesquad.com/forums/index.php?threads/',
    oldNewGamesquad: 'https://www.gamesquad.com/forums/index.php?threads/',
    oldPostUrl: 'https://www.gamesquad.com/forums/index.php?posts/',
    forumdisplay: 'https://gamesquad.com/forums/index.php?forums/',
    member: 'https://www.gamesquad.com/forums/index.php?members/'
  };

  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, true);
  xhr.onload = function() {
    if (xhr.status === 404) {
      const match = Object.entries(regexMap).find(([key, regex]) => url.match(regex));
      if (match) {
        let newUrl = '';
        const rule = match[0];
        if (rule === 'forumdisplay') {
          const matches = url.match(regexMap.forumdisplay);
          const forumId = matches[1];
          let forumName = matches[2];
          forumName = forumName.toLowerCase().startsWith('asl-') ? forumName.slice(4).toLowerCase() : forumName.toLowerCase();
          newUrl = baseNewUrlMap.forumdisplay + forumName + '.' + forumId + '/';
        } else if (rule === 'member') {
          const matches = url.match(regexMap.member);
          const memberId = matches[1];
          const memberName = matches[2].toLowerCase();
          newUrl = baseNewUrlMap.member + memberName + '.' + memberId + '/';
        } else {
          const threadId = url.match(regexMap[rule])[1];
          const baseNewUrl = baseNewUrlMap[rule];
          newUrl = baseNewUrl + threadId;
          const query = url.indexOf('?') > -1 ? url.substring(url.indexOf('?') + 1) : '';
          const queryParts = query ? query.split('&') : [];
          const newQuery = queryParts.slice(1).join('&');
          newUrl = newUrl + (newQuery ? '&' + newQuery : '');
        }
        document.body.innerHTML = '';
        document.title = 'Detected old URL, redirecting';
        const container = document.createElement('div');
        container.className = 'container';
        document.body.appendChild(container);
        const text = document.createElement('div');
        text.className = 'text';
        text.textContent = 'Detected old URL, redirecting';
        let dots = 0;
        const interval = setInterval(() => {
          dots = (dots + 1) % 4;
          text.textContent = `Detected old URL, redirecting${'.'.repeat(dots)}`;
        }, 500);
        container.appendChild(text);
        setTimeout(() => {
          clearInterval(interval);
          window.location.href = newUrl;
        }, 2000);
      } else if (!document.title.includes('Oops!')) {
        document.body.innerHTML = '';
        document.title = 'Unable to match string as old gamesquad URL.';
        const container = document.createElement('div');
        container.className = 'container';
        document.body.appendChild(container);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'text';
        errorMessage.textContent = 'Unable to match string as old gamesquad URL.';
        container.appendChild(errorMessage);
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        const action = window.history.length > 1 ? { text: 'Back', handler: () => window.history.go(-1) } : { text: 'Close', handler: () => window.close() };
        backButton.textContent = action.text;
        backButton.onclick = action.handler;
        container.appendChild(backButton);
        const style = document.createElement('style');
        style.textContent = `
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .text {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            text-align: center;
            margin-bottom: 20px;
          }
          .back-button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: #fff;
            cursor: pointer;
            margin: 0 auto;
            display: block;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      return;
    }
  };
  xhr.send();
})();
