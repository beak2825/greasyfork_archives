// ==UserScript==
// @name        Facebook "login to see more" message remover
// @namespace   https://gitlab.com/helq
// @description Detects and removes annoying "login to see more" message from facebook when you aren't logged
// @version     0.0.1
// @include     /^https?://.*\.facebook\.com/.*$/
// @grant       none
// @author      helq
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/31521/Facebook%20%22login%20to%20see%20more%22%20message%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/31521/Facebook%20%22login%20to%20see%20more%22%20message%20remover.meta.js
// ==/UserScript==

(function() {
  "use strict";

  console.log("Facebook login message remover started");

  let annoying_popup = document.querySelector('#headerArea > div:nth-child(1)');
  
  if(annoying_popup === null)
    annoying_popup = document.querySelector('#pagelet_growth_expanding_cta > div:nth-child(1)');

  annoying_popup.parentNode.removeChild( annoying_popup );
})();