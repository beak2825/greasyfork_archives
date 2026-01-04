// ==UserScript==
// @name        DiscordImage Resizer
// @namespace   WF Scripts
// @match       https://media.discordapp.net/*/*/*
// @grant       none
// @runat       document-start
// @version     1.0
// @author      WhiteFang
// @description A Simple Script to remove parameters from the Discord URL to get image at full resolution.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440486/DiscordImage%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/440486/DiscordImage%20Resizer.meta.js
// ==/UserScript==

var url = window.location.href
if(url.includes('?')){ 
      window.history.pushState({}, document.title, window.location.pathname);
      window.location.replace(window.location.href);
}
