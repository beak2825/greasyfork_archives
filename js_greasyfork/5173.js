// ==UserScript==
// @id          tp2p-thanks
// @name        TemplateP2P: t to thank
// @version     0.1.0
// @description Thank the first post on a page by pressing t.
// @author      phracker <phracker@privatdemail.net>
// @namespace   https://github.com/phracker
// @grant       none
// @icon        https://i.imgur.com/E3Zh9L3.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js
// 
// @include     http*://*templatep2p.com/forum/index.php?topic=*
// @downloadURL https://update.greasyfork.org/scripts/5173/TemplateP2P%3A%20t%20to%20thank.user.js
// @updateURL https://update.greasyfork.org/scripts/5173/TemplateP2P%3A%20t%20to%20thank.meta.js
// ==/UserScript==

(function() {
  Mousetrap.bind('t', function() {
    var linkSearch = document.evaluate("//*[@id=\"quickModForm\"]/table[1]/tbody/tr[1]/td/table/tbody/tr/td/table/tbody/tr[1]/td[2]/table/tbody/tr/td[3]/a[2]", document, null, XPathResult.ANY_TYPE, null);
    var link = linkSearch.iterateNext();
    link.click();
  })
})();