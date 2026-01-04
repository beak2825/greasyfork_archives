// ==UserScript==
// @name         leaving_facebook_soon_auto_click
// @version      1
// @description  auto_click_"leaving_facebook_soon"_button
// @author       we684123
// @match        https://www.facebook.com/flx/warn/?*
// @grant        none
// @namespace    https://github.com/we684123/leaving_facebook_soon_auto_click
// @downloadURL https://update.greasyfork.org/scripts/406626/leaving_facebook_soon_auto_click.user.js
// @updateURL https://update.greasyfork.org/scripts/406626/leaving_facebook_soon_auto_click.meta.js
// ==/UserScript==
//Github - https://github.com/we684123/leaving_facebook_soon_auto_click

(function () {
  var class_name = "_42ft _42fu selected _42g-";
  var bt = document.getElementsByClassName(class_name)[0];
  bt.click();
})();
