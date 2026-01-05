// ==UserScript==
// @name        Updated Ad Remover for TF2C
// @namespace   tf2cadblockremover
// @description Removes ads for TF2C without leaving big boxes
// @include     /^https?:\/\/(www)?tf2center.com\/.*$/
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23665/Updated%20Ad%20Remover%20for%20TF2C.user.js
// @updateURL https://update.greasyfork.org/scripts/23665/Updated%20Ad%20Remover%20for%20TF2C.meta.js
// ==/UserScript==

$('._containerHor').text("").hide();
$('._containerVer').text("").hide();
$('._containerVerRight').text("").hide();
$('#google_image_div').text("").hide();
noAds=true;