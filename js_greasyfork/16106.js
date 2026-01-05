// ==UserScript==
// @author       Giel
// @name       block promoted
// @version    0.7
// @description  block promoted v0.7
// @match      https://*.twitter.com/*/*
// @copyright  You
// @namespace  https://twitter.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16106/block%20promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/16106/block%20promoted.meta.js
// ==/UserScript==
 



$('.js-action-profile-promoted').each(function(i, val){
  $(this).click()
  $('.promoted-tweet')[0]
  $('.profiletweet-actionbutton').click()
  $('.block-link').click()
  $($('.block-button')[0]).click()
});