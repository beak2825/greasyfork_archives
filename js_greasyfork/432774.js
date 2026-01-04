// ==UserScript==
// @name           Frozen Cookies
// @version        github-latest
// @description    Userscript to load Frozen Cookies
// @author         Icehawk78
// @homepage       https://github.com/icehawk78/FrozenCookies
// @include        http://orteil.dashnet.org/cookieclicker/
// @include        https://orteil.dashnet.org/cookieclicker/
// @namespace https://greasyfork.org/users/817739
// @downloadURL https://update.greasyfork.org/scripts/432774/Frozen%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/432774/Frozen%20Cookies.meta.js
// ==/UserScript==

// Source:    https://github.com/Icehawk78/FrozenCookies/main/
// Github.io: http://icehawk78.github.io/FrozenCookies/

var loadInterval = setInterval(function () {
const Game = unsafeWindow.Game;
  if (Game && Game.ready) {
    clearInterval(loadInterval);
    Game.LoadMod("https://icehawk78.github.io/FrozenCookies/frozen_cookies.js");
  }
}, 1000);