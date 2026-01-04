// ==UserScript==
// @name        RED: Trumpable: show trumpable reason(s)
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php
// @grant       none
// @version     0.1.3
// @description make trumpable reason(s) visible without clicking
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456333/RED%3A%20Trumpable%3A%20show%20trumpable%20reason%28s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456333/RED%3A%20Trumpable%3A%20show%20trumpable%20reason%28s%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const find_this = 'Trumpable For:';

  document.querySelectorAll('strong.tooltip[title="Trumpable"]').forEach(t => {
    var b = stepUp(t, 3).nextElementSibling.querySelector('b');
    if (b && b.textContent == find_this) {
      var reason = b.parentElement.textContent.replace(find_this, '').trim();
      console.log(reason);
      t.insertAdjacentText('afterEnd', ` (${reason})`)
    }
  });

  function stepUp(elm, num) {
    for (let i=0; i<num; i++) {
      elm = elm.parentElement;
    }
    return elm;
  }

})();