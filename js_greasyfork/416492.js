// ==UserScript==
// @name        load_allpages
// @namespace   https://greasyfork.org/users/396021
// @version     0.2
// @author      indraf
// @description tadinya buat tribun doang
// @match       *://*.tribunnews.com/*/*
// @match       *://*.kompas.com/*/*
// @match       *://*.suara.com/*/*
// @match       *://*.sindonews.com/*/*
// @match       *://*.grid.id/*/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/416492/load_allpages.user.js
// @updateURL https://update.greasyfork.org/scripts/416492/load_allpages.meta.js
// ==/UserScript==

if (/(tribunnews|kompas|suara)\.com/.test (location.hostname) ) {
window.history.pushState({}, "", "?page=all");
}
else if (/sindonews\.com/.test (location.hostname) ) {
window.history.pushState({}, "", "?showpage=all");
}
else if (/grid\.id/.test (location.hostname) ) {
window.history.pushState({}, "", "?page=all");
}
(function()
{
  if( window.localStorage )
  {
    if( !localStorage.getItem('firstLoad') )
    {
      localStorage['firstLoad'] = true;
      window.location.reload();
    }  
    else
      localStorage.removeItem('firstLoad');
  }
})();