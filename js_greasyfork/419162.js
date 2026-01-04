// ==UserScript==
// @name        Better Toonily
// @namespace   Violentmonkey Scripts
// @match       https://toonily.com/user-settings/
// @grant       none
// @version     1.1
// @author      -
// @description 12/25/2020, 11:15:05 PM
// @downloadURL https://update.greasyfork.org/scripts/419162/Better%20Toonily.user.js
// @updateURL https://update.greasyfork.org/scripts/419162/Better%20Toonily.meta.js
// ==/UserScript==
jQuery('.list-bookmark tbody tr').each((i,e) => {
  let last_read = jQuery(e).find('div.chapter').text().trim();
  let last_released = jQuery(e).find('.list-chapter .chapter-item .chapter').first().text().trim();
  if(last_read === last_released) {
    jQuery(e).hide();
  }
})