// ==UserScript==
// @name         Reload mangadex home each 10 min
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.3
// @description  try to make your life easier!
// @author       Riztard
// @match        https://mangadex.org/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390848/Reload%20mangadex%20home%20each%2010%20min.user.js
// @updateURL https://update.greasyfork.org/scripts/390848/Reload%20mangadex%20home%20each%2010%20min.meta.js
// ==/UserScript==

(function () {
  'use strict';

  setTimeout(func, 600000);

  function func() {
    window.location.reload(false);
  }

})();
