// ==UserScript==
// @name         Imgur to Rimgo redirect
// @namespace    0b9
// @version      0.1.4
// @description  Redirect Imgur links to a random Rimgo instance
// @author       0b9
// @match        https://imgur.com/*
// @match        https://i.imgur.com/*
// @match        https://imgur.io/*
// @match        https://*.imgur.io/*
// @exclude      https://imgur.com/user/*
// @exclude      https://imgur.com/signin
// @exclude      https://imgur.com/register
// @exclude      https://imgur.com/arcade
// @exclude      https://imgur.com/upload
// @exclude      https://imgur.com/meme-generator
// @exclude      https://imgur.com/privacy
// @exclude      https://imgur.com/rules
// @exclude      https://imgur.com/emerald
// @exclude      https://imgur.com/ccpa
// @exclude      https://imgur.com/tos
// @exclude      https://imgur.com/about
// @exclude      https://imgur.com/apps
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath d='M349.15 398.825v-250m-235.975 13.992h250' fill='none' stroke='%23000' stroke-width='28'/%3E%3Ccircle cx='364.039' cy='147.961' r='34.785' fill='%231e88e5'/%3E%3C/svg%3E
// @grant        GM_xmlhttpRequest
// @connect      rimgo.codeberg.page
// @downloadURL https://update.greasyfork.org/scripts/534029/Imgur%20to%20Rimgo%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/534029/Imgur%20to%20Rimgo%20redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const apiUrl = 'https://rimgo.codeberg.page/api.json';
  const instancediscovery = 'https://rimgo.codeberg.page';

  const redirectTo = (instanceUrl) => {
    const path = window.location.href.substring(window.location.href.indexOf("/", 8));
    const newUrl = `${instanceUrl}/${path.startsWith("/") ? path.slice(1) : path}`;
    window.location.replace(newUrl);
  };

  GM_xmlhttpRequest({
    method: "GET",
    url: apiUrl,
    onload: function (response) {
      try {
        const data = JSON.parse(response.responseText);
        const eligible = data.clearnet.filter(inst => inst.note.includes("✅ Data not collected"));
        const instance = eligible.length
          ? eligible[Math.floor(Math.random() * eligible.length)].url
          : instancediscovery;
        redirectTo(instance);
      } catch (e) {
        console.error("JSON parsing failed, redirecting to Rimgo instace list page", e);
        redirectTo(instancediscovery);
      }
    },
    onerror: function (err) {
      console.error("Request failed, redirecting to Rimgo instace list page", err);
      redirectTo(instancediscovery);
    }
  });
})();