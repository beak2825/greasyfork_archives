// ==UserScript==
// @name        Hack Forums - Fixed Quick Reply
// @namespace   Doctor Blue
// @description Fixes the quick reply formula to the bottom of the viewport to make it easier to browse the thread while composing a reply.
// @include     *hackforums.net/showthread.php?tid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11679/Hack%20Forums%20-%20Fixed%20Quick%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/11679/Hack%20Forums%20-%20Fixed%20Quick%20Reply.meta.js
// ==/UserScript==

// Prevent conflicts with other userscripts
$j = $.noConflict(true)

$j('#quick_reply_form .expcolimage').remove() // Remove the expand/collapse button
$j('#quick_reply_form tbody').hide() // Hide the quick reply field by default
$j('#quick_reply_form textarea').attr('rows', '6') // Reduce textarea height to 6 rows

// Make quick reply header clickable
$j('#quick_reply_form thead')
  .css('cursor', 'pointer')
  .on('click', function() {
    $j('#quick_reply_form tbody').toggle()
  })

// Move the quick reply form to the fixed position
$j('#quick_reply_form')
  .css('width', 'calc(95% - 15px)')
  .css('position', 'fixed')
  .css('bottom', '0')