// ==UserScript==
// @name         Drop Claim
// @namespace    http://tampermonkey.net/
// @version      v4
// @description  Monitor Telegram chat
// @author       Ardag
// @match        https://web.telegram.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @run-at       document-idle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/482014/Drop%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/482014/Drop%20Claim.meta.js
// ==/UserScript==

let newTab; // Global variable to close tab later

(function() {

  const chatId = '-1002057367550';
  const botToken = '6986976346:AAHUHyzirPCkOrSe9NWyn5Vzg3sZscaqvJM';
  const urlPrefix = 'https://stake.com/tr/settings/offers?type=drop&code=';
  const urlSuffix = '&currency=trx&modal=redeemBonus';
  let lastUpdateId = 0;

  setInterval(() => {

    fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId}&chat_id=${chatId}`)
      .then(res => res.json())
      .then(updates => {

        const newUpdates = updates.result.filter(update => update.update_id > lastUpdateId);

        newUpdates.forEach(update => {

          lastUpdateId = update.update_id;

          const message = update.message.text;
          const url = `${urlPrefix}${message}${urlSuffix}`;

          // Open new tab
          newTab = window.open(url,'_blank');

          // Close new tab after 25 seconds
          setTimeout(() => {
            newTab.close();
          }, 25000);

        });

      })
      .catch(err => {
        console.error('Error fetching updates:', err);
      });

  }, 2000);

})();
