// ==UserScript==
// @name     plug.dj keyboard shortcuts
// @description Allows navigation on plug.dj using only shortcut keys
// @version  1
// @grant    none
// @include  http*plug.dj*
// @require  https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @namespace https://greasyfork.org/users/159174
// @downloadURL https://update.greasyfork.org/scripts/367970/plugdj%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/367970/plugdj%20keyboard%20shortcuts.meta.js
// ==/UserScript==

function doClick(path) {
  document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}

function getFocus(path) {
  document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus();
}

// open playlist drawer
Mousetrap.bind('alt+p', function(e) {
    doClick('/html/body/div[1]/div[2]/div[2]/div[3]/div[1]');
});

// search youtube
Mousetrap.bind('alt+y', function(e) {
    doClick('/html/body/div[1]/div[2]/div[2]/div[3]/div[1]');
    getFocus('//*[@id="search-input-field"]');
});