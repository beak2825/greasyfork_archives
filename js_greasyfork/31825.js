// ==UserScript==
// @name          last.fm 1-click delete
// @description   Shows a delete "x" button for scrobbles
// @version       1.0.4
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @match         https://www.last.fm/*
// @grant         GM_addStyle
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/31825/lastfm%201-click%20delete.user.js
// @updateURL https://update.greasyfork.org/scripts/31825/lastfm%201-click%20delete.meta.js
// ==/UserScript==

GM_addStyle(`
.one-click-delete {
  position: absolute;
  margin-left: .25em;
  opacity: .5;
  cursor: pointer;
  padding: 0px 8px;
}
.one-click-delete:hover {
  background-color: rgba(255,0,0,0.1);
  opacity: 1.0;
  color: red;
  font-weight: bold;
}
`);

const ROW_SELECTOR = '.chartlist-row:not(.has-one-click-delete):not(.chartlist-row--now-scrobbling)';
const observer = new MutationObserver(() => $(ROW_SELECTOR) && process());

process();
registerPJAXforwarding();

function process() {
  observer.disconnect();
  $$(ROW_SELECTOR + ' .chartlist-timestamp').forEach(el => {
    el.appendChild(Object.assign(
      document.createElement('span'), {
        className: 'one-click-delete',
        textContent: 'X',
        title: 'Delete',
        onclick: onClick,
      }
    ));
  });
  if ($('.chartlist tbody')) {
    observer.takeRecords();
    observer.observe($('.chartlist tbody'), {childList: true});
  }
}

function registerPJAXforwarding() {
  document.addEventListener('pjax:end:1-click-delete', process);
  window.addEventListener('load', function _() {
    window.removeEventListener('load', _);
    unsafeWindow.jQuery(unsafeWindow.document).on('pjax:end',
      () => document.dispatchEvent(new CustomEvent('pjax:end:1-click-delete')));
  });
}

function onClick() {
  const delButton = this.closest('tr').querySelector('[data-ajax-form-sets-state="deleted"]');
  delButton && delButton.click();
}

function $(selector, base) {
  return (base || document).querySelector(selector);
}

function $$(selector, base) {
  return Array.prototype.slice.call((base || document).querySelectorAll(selector));
}
