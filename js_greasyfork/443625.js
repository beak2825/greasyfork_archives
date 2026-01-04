// ==UserScript==
// @name         GitHub custom filters
// @namespace    https://nihlen.io/
// @version      1
// @description  Adds custom filters to the GitHub pull request search screen.
// @author       Malcolm Nihlén
// @license      MIT
// @grant        none
// @include      /^https?:\/\/github.com\/[^\\]+\/[^\\]+\/pulls.*$/
// @downloadURL https://update.greasyfork.org/scripts/443625/GitHub%20custom%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/443625/GitHub%20custom%20filters.meta.js
// ==/UserScript==

(function() {
  var filters = [
    { text: 'My pending pull request reviews', query: 'is:pr is:open sort:updated-desc -author:app/renovate user-review-requested:@me' }
  ];
  
  function createElementFromHTML (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }
  
  function escapeHTML (unsafeText) {
      var div = document.createElement('div');
      div.innerText = unsafeText;
      return div.innerHTML;
  }
  
  function createListElement () {
    return createElementFromHTML(
      '<a class="SelectMenu-item" role="menuitemradio" aria-checked="false">' +
      '  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check SelectMenu-icon SelectMenu-icon--check">' +
      '    <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>' +
      '  </svg>' +
      '</a>'
    );
  }
  
  var list = document.querySelector('#filters-select-menu .SelectMenu-list');
  
  for (var i = 0; i < filters.length; i++) {
    var menuItem = createListElement();
    menuItem.href = '?q=' + encodeURIComponent(filters[i].query);
    menuItem.innerHTML += escapeHTML(filters[i].text);
    list.prepend(menuItem);
  }
})();
