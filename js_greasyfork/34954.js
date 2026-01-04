// ==UserScript==
// @name        Elearning
// @namespace   tula4
// @include     https://elearning.viettel.vn/*
// @version     1
// @grant       none
// @description:en test
// @description test
// @downloadURL https://update.greasyfork.org/scripts/34954/Elearning.user.js
// @updateURL https://update.greasyfork.org/scripts/34954/Elearning.meta.js
// ==/UserScript==


function clearBlur(){
  unsafeWindow.$(unsafeWindow).off('blur');
  console.log("OK");
}
unsafeWindow.setTimeout(clearBlur, 2000);