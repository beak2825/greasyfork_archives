// ==UserScript==
// @name TikTok Live Expander
// @author fulingen
// @description Automatically clicks show more on following and recommending
// @version 0.3.2
// @license GNU GPLv3
// @supportURL https://t.me/fulingen
// @match https://www.tiktok.com/live
// @match https://www.tiktok.com/live*
// @match https://www.tiktok.com/*/live
// @match https://www.tiktok.com/*/live*
// @namespace https://greasyfork.org/users/980311
// @downloadURL https://update.greasyfork.org/scripts/465567/TikTok%20Live%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/465567/TikTok%20Live%20Expander.meta.js
// ==/UserScript==

const xpr = XPathResult.FIRST_ORDERED_NODE_TYPE;
const text = 'See all';
let xpath;
let node;

setInterval(() => {
  xpath = '/html/body/div[1]/main/div[4]/div[1]/div/div[1]/div[1]/div/div[2]/div/div[2]/div[6]';
  node = document.evaluate(xpath, document, null, xpr, null).singleNodeValue;

  if (node) {
    if (node.innerText == text) {
      node.click();
    }
  }

  xpath = '/html/body/div[1]/main/div[4]/div[1]/div/div[1]/div[1]/div/div[3]/div/div[2]/div[6]';
  node = document.evaluate(xpath, document, null, xpr, null).singleNodeValue;

  if (node) {
    if (node.innerText == text) {
      node.click();
    }
  }

}, 100);