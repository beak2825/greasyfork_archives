// ==UserScript==
// @name         Mastodon Filter Editor: Move Add Keywords Button
// @description  Modifies the keyword insertion behavior in Mastodon's filter edit page - moves the "Add Keyword" form above the list and changes insertion to prepend new keywords at the top
// @match        https://mastodon.social/filters/*/edit
// @version 0.0.1.20250521181415
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536688/Mastodon%20Filter%20Editor%3A%20Move%20Add%20Keywords%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/536688/Mastodon%20Filter%20Editor%3A%20Move%20Add%20Keywords%20Button.meta.js
// ==/UserScript==

if (/^\/filters\/\d+\/edit$/.test(location.pathname)) {
  const anchor = document.querySelector('a.add_fields');
  if (anchor) {

    // Change insertion method to 'prepend'
    anchor.setAttribute('data-association-insertion-method', 'prepend');

    // Change insertion target to second tbody
    anchor.setAttribute('data-association-insertion-node', '.keywords-table tbody:nth-of-type(2)');

    const originalTfoot = anchor.closest('tfoot');
    if (originalTfoot) {
      // Grab the inner rows HTML
      const rowsHtml = originalTfoot.innerHTML;
      const table = originalTfoot.closest('table');
      const thead = table && table.querySelector('thead');
      if (table && thead) {
        // Remove the old tfoot
        originalTfoot.remove();
        // Create a new tbody, inject the rows
        const newTbody = document.createElement('tbody');
        newTbody.innerHTML = rowsHtml;
        // Insert right after the thead
        thead.insertAdjacentElement('afterend', newTbody);
      }
    }

    // Scope to the form
    const form = document.querySelector('form.edit_custom_filter');
    if (form) {
      const actionsDiv = form.querySelector('div.actions');
      const tableWrapper = form.querySelector('div.table-wrapper');
      if (actionsDiv && tableWrapper && tableWrapper.parentNode) {
        tableWrapper.parentNode.insertBefore(actionsDiv, tableWrapper);
      }
    }
  }
}