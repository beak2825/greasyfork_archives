// ==UserScript==
// @name         AutoClick Bookmark page more button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ブックマークページのもっと見るを自動的にクリックする
// @author       RamisAmuki
// @match        https://www.dmm.co.jp/dc/doujin/-/bookmark/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @require      https://greasyfork.org/scripts/469263-ramisamuki-utils/code/RamisAmuki%20Utils.js?version=1209366
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543766/AutoClick%20Bookmark%20page%20more%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/543766/AutoClick%20Bookmark%20page%20more%20button.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const query = "button.c_btn_more";
  const hitButton = () => {
    console.log("hit button!");
    document.querySelector(query).click();
  };
  setInterval(() => waitForElement(query, hitButton), 1000);
})();
