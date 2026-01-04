// ==UserScript==
// @name        codex.lol bypass
// @namespace   dindin
// @match       https://mobile.codex.lol/*
// @match        *://linkvertise.com/*
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*
// @match        https://lootdest.info/s?*
// @match        https://lootdest.org/s?*
// @match        https://lootdest.com/s?*
// @match        https://links-loot.com/s?*
// @match        https://linksloot.net/s?*
// @run-at       document-end
// @grant       none
// @version     1.3
// @author      dindin00
// @license MIT
// @description greatest codex bypass ever
// @downloadURL https://update.greasyfork.org/scripts/486873/codexlol%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/486873/codexlol%20bypass.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const redirectMap = {
      "https://linkvertise.com/654032/codex-gateway-2": "https://mobile.codex.lol/?page=tasks",
      //"https://": "urlnohttp//",
  };

  const currentURL = window.location.href;

  if (currentURL in redirectMap) {
      alert(`redirect to ${redirectMap[currentURL]}\nwait a few seconds before clicking ok`)
      window.location.replace(`${redirectMap[currentURL]}`);
  }

  function decryptData(encodedData, keyLength = 5) {
let decryptedData = '',
  base64Decoded = atob(encodedData),
  key = base64Decoded.substring(0, keyLength),
  encryptedContent = base64Decoded.substring(keyLength);

for (let i = 0; i < encryptedContent.length; i++) {
  let charCodeEncrypted = encryptedContent.charCodeAt(i),
    charCodeKey = key.charCodeAt(i % key.length),
    decryptedCharCode = charCodeEncrypted ^ charCodeKey;

  decryptedData += String.fromCharCode(decryptedCharCode);
}

return decryptedData;
}

(function () {
  if (typeof p == 'object' && p?.PUBLISHER_LINK && decryptData(p['PUBLISHER_LINK'])) {
      let cur = decryptData(p['PUBLISHER_LINK'])
      window.location.assign(decryptData(p['PUBLISHER_LINK']));
      alert(`going to ${cur}\nwait a few seconds before clicking ok`);
    }
    else {}
  })();
})();