// ==UserScript==
// @name         Ctrl+Won't
// @namespace    http://tampermonkey.net/
// @version      2024-03-17
// @description  Prevents accidental Ctrl+W from closing current tab while you are typing something (input/textarea tag is active). You can change the whit list of websites (on which this script will be "enabled").
// @author       Andrew15-5
// @match        *://*/*
// @icon         https://i.ytimg.com/vi/Qa5xfIbMaqw/maxresdefault.jpg
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490058/Ctrl%2BWon%27t.user.js
// @updateURL https://update.greasyfork.org/scripts/490058/Ctrl%2BWon%27t.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const whitelist = [
    'github.com',
    'discord.com',
    'stackoverflow.com',
    'greasyfork.org',
  ];
  if (!whitelist.includes(location.hostname)) {
    return;
  }
  addEventListener(
    'beforeunload',
    function (e) {
      if (location.hostname === 'discord.com') {
        if (
          document.activeElement.localName !== 'div' ||
          document.activeElement.getAttribute('role') !== 'textbox'
        ) {
          return;
        }
      } else if (
        !['input', 'textarea'].includes(document.activeElement.localName)
      ) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    true,
  );
})();
