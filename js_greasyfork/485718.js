// ==UserScript==
// @name         Temu ads redirect
// @namespace    http://tampermonkey.net/
// @version      2024-01-26
// @license      MIT 
// @description  Annoyed by the Temu ads that are forcing you to install the mobile app to see the product? Fear no more, this script is redirecting you directly to the product you are looking for.
// @author       Bartek Igielski
// @match        https://www.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485718/Temu%20ads%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/485718/Temu%20ads%20redirect.meta.js
// ==/UserScript==

(function() {
  const params = new URL(document.location).searchParams
  const productId = params.get('goods_id')

  if (!productId) {
    return
  }

  document.location = `https://www.temu.com/g-${productId}.html`
})();