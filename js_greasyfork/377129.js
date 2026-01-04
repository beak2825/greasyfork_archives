// ==UserScript==
// @name           Reddit - Add Removeddit links
// @icon           https://www.google.com/s2/favicons?domain=www.reddit.com
// @description    Adds a Removeddit.com link to every comment and post
// @author         Arudarin
// @version        1.0.1
// @namespace      Violentmonkey Scripts
// @match          *://*.reddit.com/r/*/comments/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @require        https://greasyfork.org/scripts/7602-mutation-observer/code/mutation-observer.js
// @downloadURL https://update.greasyfork.org/scripts/377129/Reddit%20-%20Add%20Removeddit%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/377129/Reddit%20-%20Add%20Removeddit%20links.meta.js
// ==/UserScript==

; ($ => {
  'use strict'

  // --------------------------------------------------------------------------

  const url = new URL(location.href)
  url.host = 'www.removeddit.com'

  const observer = new MutationSummary({
    callback(summaries) {
      $(summaries[0].added)
        .append(`
          <li>
              <a class="removeddit" href="${url}">
                removeddit
              </a>
          </li>
        `)
    },
    rootNode: document.body,
    queries: [
      { element: '.flat-list' }
    ]
  })

})(jQuery);

jQuery.noConflict(true);


/*  The old script, for future use
(function() {
'use strict';
  url = new URL(location.href);
  url.host = 'www.removeddit.com';
  
  $("ul.flat-list.buttons").append(`
    <li>
      <a class="removeddit" href="${url}">
              removeddit
      </a>
    </li>
  `);
}());
*/