// ==UserScript==
// @author         Saka
// @name           DisneyPlus Starplus user agent change
// @namespace      https://greasyfork.org/users/983625
// @description    Starplus and Disney random user agent change to bypass in linux.
// @match          https://*.starplus.com/*
// @match          *://*.starplus.com/*
// @match          https://www.starplus.com/pt-br/home
// @match          https://*.disneyplus.com/*
// @version        0.1.2
// @grant          none
// @homepage       https://github.com/RodrigoSaka
// @downloadURL https://update.greasyfork.org/scripts/454881/DisneyPlus%20Starplus%20user%20agent%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/454881/DisneyPlus%20Starplus%20user%20agent%20change.meta.js
// ==/UserScript==

const userAgents = [
  {
    appVersion:
      '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.26 Safari/537.36',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.26 Safari/537.36'
  },
  {
    appVersion:
      '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36'
  },
  {
    appVersion:
      '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36/8mqXoXuL-32',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36/8mqXoXuL-32'
  }
];

const randomIndex = Math.floor(Math.random() * (userAgents.length - 0) + 0);
const currentAgent = userAgents[randomIndex];

navigator.__defineGetter__('appVersion', () => currentAgent.appVersion);
navigator.__defineGetter__('userAgent', () => currentAgent.userAgent);