// ==UserScript==
// @name        RTM copy tasks
// @namespace   cahrehn.com
// @description Copy current list of tasks
// @include     https://www.rememberthemilk.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js
// @grant       GM_addStyle
// @version 0.0.1.20140916215446
// @downloadURL https://update.greasyfork.org/scripts/5106/RTM%20copy%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/5106/RTM%20copy%20tasks.meta.js
// ==/UserScript==

// selection solution from: http://stackoverflow.com/a/987376/1090474
jQuery.fn.selectText = function(){
    var doc = document
        , element = this[0]
        , range
        , selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

jQuery("head").append (
  '<link '
  + 'href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/flick/jquery-ui.css" '
  + 'rel="stylesheet" type="text/css">'
);

GM_addStyle("#copy { position: absolute; right: -11px; top: -41px; height: 26px; width: 28px; }");
GM_addStyle("#copy_dialog { text-align: left; }");

jQuery('<div/>', {
    id: 'copy_dialog'
}).dialog({
    appendTo: 'body',
    autoOpen: false,
    minWidth: 400,
    maxWidth: 650
}).bind('copy', function() {
    // ensure that copy to clipboard happens first
    setTimeout(function() {
        jQuery('#copy_dialog').dialog("close");
    }, 100);
});

// force close-on-escape behavior which seems to be broken by focus stealing
jQuery(document).keyup(function(e) {
  if (e.keyCode == 27) { jQuery('#copy_dialog').dialog('close'); } // esc
});

jQuery('<button/>', {
    id: 'copy'
}).button({
    icons: { primary: 'ui-icon-extlink' }
}).click(function() {
    var content = "";
    jQuery('#tasks span.xtd_task_name').each(function() {
        content = content + jQuery(this).html() + "<br>";
    });
    jQuery('#copy_dialog').html(content).dialog("open");
    // steal focus back from "Add a new task" input
    setTimeout(function() {
        document.activeElement.blur();
        jQuery('#copy_dialog').selectText();
    }, 50);
}).insertAfter('#add-helpicon');
