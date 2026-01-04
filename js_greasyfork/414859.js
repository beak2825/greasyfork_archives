// ==UserScript==
// @name         Cancel Yandex Metrika
// @namespace    https://mcmedic.ru
// @version      1.0.1
// @description  Disable yandex metrika (for Firefox only)
// @author       IvanSkvortsov
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/414859/Cancel%20Yandex%20Metrika.user.js
// @updateURL https://update.greasyfork.org/scripts/414859/Cancel%20Yandex%20Metrika.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('beforescriptexecute', function (e) {
      var src = e.target.src;
      if (src && src.indexOf('yandex') !== -1 && src.indexOf('metrika') !== -1) {
          e.preventDefault();
          console.log('script stoped', e.target, e.target.src);
      }
    });
    // Your code here...
})();