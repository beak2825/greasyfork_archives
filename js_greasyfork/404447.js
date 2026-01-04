// ==UserScript==
// @name           Auto-select OGame account
// @namespace      https://openuserjs.org/users/clemente
// @match          https://lobby.ogame.gameforge.com/*/hub
// @grant          GM_xmlhttpRequest
// @version        1.0
// @author         clemente
// @license        MIT
// @description    Redirect to current Ogame account if only one is available
// @icon           https://lobby.ogame.gameforge.com/favicon.ico
// @connect        lobby.ogame.gameforge.com
// @inject-into    content
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404447/Auto-select%20OGame%20account.user.js
// @updateURL https://update.greasyfork.org/scripts/404447/Auto-select%20OGame%20account.meta.js
// ==/UserScript==

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 && status >= 300) return reject();
        resolve(JSON.parse(responseText));
      },
      onerror: function() { reject(); },
    });
  });
}

async function redirectToAccount() {
  try {
    const accounts = await gm_fetch("https://lobby.ogame.gameforge.com/api/users/me/accounts");
    if (accounts.length > 1) return;
    const number = accounts[0].server.number;
    const language = accounts[0].server.language;

    document.location.href = `https://s${number}-${language}.ogame.gameforge.com/game/index.php?page=ingame&component=overview`;
  } catch (e) {
    // If there is an error, the user is probably not logged in
    console.error(e);
  }
}

redirectToAccount();
