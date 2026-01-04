// ==UserScript==
// @name        Bing: Definition box auto expander
// @namespace   Violentmonkey Scripts
// @match       https://www.bing.com/search*
// @grant       none
// @version     1.0.0
// @author      myf
// @license     CC0
// @run-at      document-end
// @description Clicks the "See more" button for you. Sadly, that button is really interactive after some time, so there is a delay.
// @downloadURL https://update.greasyfork.org/scripts/526181/Bing%3A%20Definition%20box%20auto%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/526181/Bing%3A%20Definition%20box%20auto%20expander.meta.js
// ==/UserScript==
/*
 * https://greasyfork.org/en/scripts/526181-bing-definition-box-auto-expander
 * Changelog
 * 1.0.0 (2025-02-07) Init
*/
function expandOnce() {
  const cont = document.querySelector('.dc_innerCont');
  if( !cont || cont.matches('.dc_innerCont.dc_HeightExp')) {
    // console.log('Auto exapand definitopn: DONE or not applicable.')
    return
  }
  document.querySelector('.b_DictBtnLink')?.click();
  // console.log('Auto exapand definitopn: check and attempt.')
  setTimeout(expandOnce, 100);
}
expandOnce();
