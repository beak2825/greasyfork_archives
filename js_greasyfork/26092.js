// ==UserScript==
// @name        poe.trade hide/highlight entry buttons
// @namespace   io.poe.trade
// @description poe.trade helper: add Hide & Highlight buttons to results for easier browsing
// @include     http://poe.trade/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26092/poetrade%20hidehighlight%20entry%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/26092/poetrade%20hidehighlight%20entry%20buttons.meta.js
// ==/UserScript==

/*
Changelog:
- 0.2.1:
    - just assume jQuery is loaded (loading explicitly broke Firefox...)
- 0.2:
    - always explicitly load jQuery (for compatibility with Chrome)
    - made the "Highlight" button a toggle
*/
function hide_item_parent(node)
{
   node.parentNode.parentNode.parentNode.style.display = 'none';
}

(function () {
  var $ = jQuery;
  $(".icon-td").each(function(i) {
    $('<div class="button tiny" onclick="this.parentNode.parentNode.parentNode.style.display = \'none\';">Hide</div>').appendTo($(this));
    $('<div class="button tiny" onclick="{var t = this.parentNode.parentNode.parentNode; if (t.style.borderWidth == \'5px\') {t.style.border = \'1px #333\';} else {t.style.border = \'5px solid #F00\';};};">Highlight</div>').appendTo($(this));
  });

})();
