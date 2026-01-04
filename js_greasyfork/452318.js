// ==UserScript==
// @name        get discord token
// @description shows an alert containing your discord token
// @version     1.0
// @author      Lol#9999
// @match       https://*.discord.com/app
// @match       https://*.discord.com/channels/*
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/452318/get%20discord%20token.user.js
// @updateURL https://update.greasyfork.org/scripts/452318/get%20discord%20token.meta.js
// ==/UserScript==
  function getToken() {
    window.dispatchEvent(new Event('beforeunload'));
    const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
    return JSON.parse(LS.token);
  }

let token = getToken();
alert(token);