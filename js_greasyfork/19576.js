// ==UserScript==
// @name         Queue Total Value
// @namespace    https://kadabot.com/
// @version      1.1.0
// @description  Displays the total reward value of the HITs on your current HITs Assigned To You page.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      /^https://www\.mturk\.com/mturk/(myhits|sortmyhits|return)/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/19576/Queue%20Total%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/19576/Queue%20Total%20Value.meta.js
// ==/UserScript==

if ($('a[href*="myhits"][class="nonboldsubnavclass"]').length) {
  var total = 0;
  var $reward = $(".reward");

  for (var i = 0; i < $reward.length; i++) {
	total += Number($reward.eq(i).text().trim().replace(/[^0-9.]/g, ''));
  }

  $('.title_orange_text_bold').text('HITs - Queue Value: $' + total.toFixed(2));
}