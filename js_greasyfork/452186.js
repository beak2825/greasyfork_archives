
// ==UserScript==
// @name         Setting btn - [ X ]
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Add custom btn for setting menubar
// @copyright    2022, terifash (https://greasyfork.org/en/users/964055-teri-fash)
// @author       teri.fash <teri.fash@gmail.com>
// @license      MIT
// @match        *://*.xvideos.com/video*
// @icon         https://www.xvideos.com/favicon-32x32.png
// @supportURL   https://github.com/TeriFash/x.scripts.user/issues
// @homepageURL  https://github.com/TeriFash/x.scripts.user
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452186/Setting%20btn%20-%20%5B%20X%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/452186/Setting%20btn%20-%20%5B%20X%20%5D.meta.js
// ==/UserScript==

(()=> {
  const styles = {
    zIndex: 1000,
  }

  function setingsUpinit(seti) {
    let position = window.localStorage.getItem(`video-menu-position`);

		// maybe need added class "init-ok"
    seti.addClass(`btn-settings-top btn-settings-top--${position === 'left' ? 'right' : 'left'}`).css(styles);

    $('body').prepend(seti);
  }

  function init() {
    const settings = $('#site-settings').clone();

    setingsUpinit(settings);
  }

   window.addEventListener('DOMContentLoaded', init);
})();