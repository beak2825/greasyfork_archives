// ==UserScript==
// @name        Steam - Auto age verifier
// @description add cookie to verify age automatically
// @namespace   valacar
// @include     /^https?://store.steampowered.com/
// @version     0.1
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/12488/Steam%20-%20Auto%20age%20verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/12488/Steam%20-%20Auto%20age%20verifier.meta.js
// ==/UserScript==


// Note: might need to apply this to steamcommunity.com as well

// this code is too slow
// note: old include was: /^https?://store.steampowered.com/agecheck//
// (function (form) {
//     form.ageMonth.value = 'January';
//     form.ageDay.value = 1;
//     form.ageYear.value = 1969;
//     form.submit();
// }(document.querySelector('#agegate_box form')));

function cookieSetNoExpire(name,value)
{
  document.cookie = name + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

cookieSetNoExpire("birthtime",-31507199);
cookieSetNoExpire("lastagecheckage","1-January-1969");