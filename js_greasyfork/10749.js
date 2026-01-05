// ==UserScript==
// @name   HF Poll Counter
// @namespace  Xerotic
// @description  Counts polls properly when they are public (or mod of the section)
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include   **hackforums.net/polls.php**
// @run-at    document-end
// @version   1.1
// @downloadURL https://update.greasyfork.org/scripts/10749/HF%20Poll%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/10749/HF%20Poll%20Counter.meta.js
// ==/UserScript==

var total_count = 0;

$('.quick_keys').first().find('tr').each(function() {
 if(!$(this).children().first().hasClass('thread')) {
  if($(this).children().first().hasClass('tfoot')) {
   $(this).children().first().next().html('<strong>' + total_count + ' votes</strong>');
  } else {
   $(this).children().first().next().next().html($(this).children().first().next().find('a').length);
   total_count += parseInt($(this).children().first().next().find('a').length);
  }
 }
});