// ==UserScript==
// @name        Remove restriction of steam workshop
// @name:zh-CN 移除steam创作工坊限制
// @description Unlock adult content of steam for Chinese region users
// @description:zh-CN 解除steam国区创作工坊内容限制
// @match       https://store.steampowered.com/account/preferences*
// @version     1.0.2
// @author      mokurin000
// @license MIT
// @namespace https://greasyfork.org/users/295326
// @downloadURL https://update.greasyfork.org/scripts/543838/Remove%20restriction%20of%20steam%20workshop.user.js
// @updateURL https://update.greasyfork.org/scripts/543838/Remove%20restriction%20of%20steam%20workshop.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  // Locate hidden div block of secret control
  const hidden_divs = document.querySelectorAll("div.account_setting_not_customer_facing");
  
  // Make them visible, optional
  for (let div of hidden_divs) {
    div.setAttribute("class", "preference_row");
  }
  
  // Actually enable settings
  for (let id of [4, 3]) {
    for (let suffix of ["store", "community"]) {
      const selector = `input#descriptor_${id}_${suffix}`;
      document.querySelector(selector).click();
    }
  }
}, false);
