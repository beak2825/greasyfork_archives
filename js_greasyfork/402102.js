// ==UserScript==
// @name        AmazonSwitch (X)
// @namespace   AmazonSwitch (X)
// @description Play a sound if Switch is in stock
// @version     10
// @include 	https://www.amazon.com/gp/offer-listing/B07VJRZ62R/ref=olp_twister_child?ie=UTF8&m=ATVPDKIKX0DER&mv_color_name=0&mv_style_name=0*
// @include     https://www.amazon.com/gp/offer-listing/B07VJRZ62R/ref=olp_twister_child?ie=UTF8&m=ATVPDKIKX0DER&mv_color_name=0&mv_style_name=0*
// @include     https://www.amazon.com/gp/offer-listing/B07YZQSC5Y/ref=olp_twister_child?ie=UTF8&m=ATVPDKIKX0DER&mv_edition=0&mv_platform_for_display=0*
// @incldue     https://www.amazon.com/gp/offer-listing/B07VGRJDFY/ref=olp_twister_child?ie=UTF8&m=ATVPDKIKX0DER&mv_color_name=1&mv_style_name=0*
// @incldue     https://www.amazon.com/gp/offer-listing/B07YMR6NB8/ref=as_li_ss_tl?ie=UTF8&m=ATVPDKIKX0DER&mv_color_name=1&mv_style_name=2&linkCode=ll2&tag=switchlists-20&linkId=115dfebe66d618d3cc20530b12d69f5c&language=en_US*
// @include     https://www.amazon.com/gp/offer-listing/B07YMR6NB8/ref=olp_twister_child?ie=UTF8&m=ATVPDKIKX0DER&mv_color_name=1&mv_style_name=2*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/402102/AmazonSwitch%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402102/AmazonSwitch%20%28X%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.com/gp/offer-listing/B07XV4NHHN/

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/44f683a84163b3523afe57c2e008bc8c/file-22_v-2-single.mp3';
player.preload = 'auto';

if ((/\$299.99/i.test (document.body.innerHTML)) || (/\$317.94/i.test (document.body.innerHTML)))
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 2*1000);
}