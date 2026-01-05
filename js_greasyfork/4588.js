// ==UserScript==
// @name       reddit cubing competition result helper
// @namespace  http://www.mathemaniac.org
// @version    1.0
// @description  Select a score and press "c" to show a text-box with the markdown needed for making the result list.
// @match      http://www.reddit.com/r/Cubers/comments/*/cubing_competition*/
// @copyright  2013-2017, Sebastian Paaske Tørholm
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4588/reddit%20cubing%20competition%20result%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4588/reddit%20cubing%20competition%20result%20helper.meta.js
// ==/UserScript==

$('html').keypress(function (event) {
    if (event.shiftKey || event.altKey || event.ctrlKey) return;

    if (event.charCode != 99) return; // 'c'

    var selection = window.getSelection();
    if (selection.rangeCount == 0) return;

    var p = selection.getRangeAt(0).startContainer.parentNode;
    var post = $(p).closest('div.entry');

    var username = $('a.author', post)[0].innerText;

    var line = '1. ' + selection.toString() + " - ["+username+"](/u/"+username+")";

    $(post).append('<div><input type="text" value="'+line+'" style="width: 400px;"/></div>');
});
