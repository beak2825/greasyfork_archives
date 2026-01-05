// ==UserScript==
// @name        Can I have Pizza Hut
// @namespace   pizzahut
// @description Tells you the wait for Pizza Hut prior to ordering
// @include     https://order.pizzahut.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17035/Can%20I%20have%20Pizza%20Hut.user.js
// @updateURL https://update.greasyfork.org/scripts/17035/Can%20I%20have%20Pizza%20Hut.meta.js
// ==/UserScript==
// ==OpenUserJS==
// @author baconface
// @collaborator baconface
// ==/OpenUserJS==
$('.cartOccasion').html('The estimated wait time is ' + window.store_promised_time + ' minutes.<br />');
if (window.store_promised_time <= 30) {
 $('.cartOccasion').append('It is totally a good time to order!'); 
} else if (window.store_promised_time <= 45) {
  $('.cartOccasion').append('Looks like a minor wait but not too bad.');
} else if (window.store_promised_time <= 60) {
  $('.cartOccasion').append('I would debate if it is worth the wait.');
} else if (window.store_promised_time <= 90) {
  $('.cartOccasion').append('Better off hitting up another pizza joint.');
} else {
  $('.cartOccasion').append('This is ridiculous.');
}
$('.cartOccasion').css('font-size', '16px');
