// ==UserScript==
// @name        Bangumi-Drag2Sort-Relationship
// @namespace   BDSR
// @description It's BDSR, not BDSM.
// @include     /https?:\/\/(bgm|bangumi|chii)\.(tv|in)\/subject\/\d+\/add_related\/(subject|character)/
// @version     0.0.4
// @grant       none
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/11920/Bangumi-Drag2Sort-Relationship.user.js
// @updateURL https://update.greasyfork.org/scripts/11920/Bangumi-Drag2Sort-Relationship.meta.js
// ==/UserScript==

$('#modifyOrder').click(function() {
  $('#crtRelateSubjects').sortable({
    update: function(event, ui) {
      //Refresh all orders
      $('#crtRelateSubjects .item_sort').each(function(i) {
        $(this).val(i + 1);
      });
    }
  });
  $('#crtRelateSubjects').disableSelection();
});
