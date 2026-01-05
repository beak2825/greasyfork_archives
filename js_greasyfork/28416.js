// ==UserScript==
// @name          Google Title Tooltips
// @namespace     https://github.com/ohdeerdog/
// @version       0.1
// @description   Applies original Google search result titles to result links as title attributes
// @author        ohdeerdog
// @include       *://*.google.tld/*
// @run-at        document-body
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/28416/Google%20Title%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/28416/Google%20Title%20Tooltips.meta.js
// ==/UserScript==

(function() {
  function apply_titles() {
    let links = document.querySelectorAll('#rso .g h3.r a');
    for (let link of links) {
      let request = new Request('https://urltitle.herokuapp.com/', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ url: link.href }),
      });

      fetch(request).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            if (data.title.length > 0) {
              link.setAttribute('title', data.title);
            }
          });
        }
      });
    }
  }

  const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      if (mutation.target.id === 'search' && mutation.addedNodes.length === 2) {
        apply_titles();
      }
    }
  });

  var config = { childList: true, subtree: true };

  document.addEventListener('DOMContentLoaded', apply_titles);
  observer.observe(document.body, config);
})();
