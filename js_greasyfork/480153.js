// ==UserScript==
// @name         MAM Guide Re-title
// @namespace yyyzzz999
// @author yyyzzz999
// @version      0.32
// @description  11/16/23 Re-title MAM Guide tab to put the guide name first
// @match        https://www.myanonamouse.net/guides/*
// @supportURL   https://greasyfork.org/en/scripts/480153-mam-guide-re-title/feedback
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/480153/MAM%20Guide%20Re-title.user.js
// @updateURL https://update.greasyfork.org/scripts/480153/MAM%20Guide%20Re-title.meta.js
// ==/UserScript==
/*jshint esversion: 6 */


(function() {

    'use strict';
  console.log('Starting MAM Guide Re-title');
  // This part works if, and only if, a guide link is opened in a new tab
  // See: https://www.myanonamouse.net/f/t/73870
      var iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.addEventListener('load', function() {
            var h1 = iframe.contentDocument.querySelector('h1');
			console.log(h1);
            if (h1) {
                var title = h1.textContent.split(' -> ').reverse().join(', ');
                document.title = title + ', Guides';
            }
        });
    }
// Observe the event listener that updates the iframe in the page, and then retitle the parent page.
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.matches('div#guideBox')) {
				console.log(mutations);
                var name = document.querySelector('div#guideBox h1:first-of-type');
                if (name) {
                    var title = name.textContent.split(' -> ').reverse().join(', ');
                    document.title = title + ', Guides';
					console.log(document.title);
                    }
                }

        });

    });

    observer.observe(document.body, { childList: true, subtree: true });
})();