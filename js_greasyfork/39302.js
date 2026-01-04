// ==UserScript==
// @name         対開封クリック率
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sendgrid.com/marketing_campaigns/campaigns/*/stats
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39302/%E5%AF%BE%E9%96%8B%E5%B0%81%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/39302/%E5%AF%BE%E9%96%8B%E5%B0%81%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E7%8E%87.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var open = $('.panels .open .secondary').text().trim().replace(/,/g, '');
  var clicks = $('.panels .click .secondary').text().trim().replace(/,/g, '');
  var target = $('.panels .click .primary');
  console.log(target);
  var num = Math.floor( clicks / open * 100 * Math.pow( 10, 2 ) ) / Math.pow( 10, 2 );
  target.append($(`<small>(${num}%)</small>`));
})();