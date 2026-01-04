// ==UserScript==
// @name        Get Discord User Token
// @version     1.0
// @description A simple userscript to get your Discord user token.
// @author      Lol#9999
// @match       https://*.discord.com/app
// @match       https://*.discord.com/channels/*
// @namespace https://greasyfork.org/users/899179
// @downloadURL https://update.greasyfork.org/scripts/446549/Get%20Discord%20User%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/446549/Get%20Discord%20User%20Token.meta.js
// ==/UserScript==
  function getToken() {
    window.dispatchEvent(new Event('beforeunload'));
    const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
    return JSON.parse(LS.token);
  }

let token = getToken();
alert(token);