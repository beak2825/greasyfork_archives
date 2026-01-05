// ==UserScript==
// @name        Pretty Ad Remover for TF2C
// @namespace   deetr
// @description Removes ads for TF2C without leaving big boxes
// @include     /^https?:\/\/(www)?tf2center.com\/lobbies.*$/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10997/Pretty%20Ad%20Remover%20for%20TF2C.user.js
// @updateURL https://update.greasyfork.org/scripts/10997/Pretty%20Ad%20Remover%20for%20TF2C.meta.js
// ==/UserScript==

$('._containerHor').text("").hide();
$('._containerVer').text("").hide();
$('#google_image_div').text("").hide();