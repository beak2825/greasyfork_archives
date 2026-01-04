// ==UserScript==
// @name        AmazonRiftS (X)
// @namespace   AmazonRiftS (X)
// @description Play a sound if Rift S is in stock
// @version     3
// @include 	https://www.amazon.com/gp/offer-listing/B07PTMKYS7/ref=as_li_ss_tl?ie=UTF8&condition=new&m=ATVPDKIKX0DER&linkCode=ll2&tag=siusa-mp-20&linkId=8f7fe6b4e0f7e59374138863d3b5686a&language=en_US*
// @include     https://www.amazon.com/gp/offer-listing/B07PTMKYS7?SubscriptionId=AKIAJF4X3QDDEUEKC7FA&tag=nismain-20&linkCode=xm2&camp=2025&creative=5143&creativeASIN=B07PTMKYS7&m=ATVPDKIKX0DER*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/402247/AmazonRiftS%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402247/AmazonRiftS%20%28X%29.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.com/gp/offer-listing/B07PTMKYS7/ref=as_li_ss_tl?ie=UTF8&condition=new&m=ATVPDKIKX0DER&linkCode=ll2&tag=siusa-mp-20&linkId=8f7fe6b4e0f7e59374138863d3b5686a&language=en_US

var player = document.createElement('audio');
player.src = 'https://notificationsounds.com/soundfiles/44f683a84163b3523afe57c2e008bc8c/file-22_v-2-single.mp3';
player.preload = 'auto';

if (/\$399.99/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 2*1000);
}