// ==UserScript==
// @name Block user in Review33
// @version 2.1
// @namespace http://www.review33.com/block_user
// @description Block user message in review33 thread
// @include https://www.review33.com/discuss/forum_message.php*
// @include https://www.review33.com/chat/forum_message.php*
// @downloadURL https://update.greasyfork.org/scripts/382491/Block%20user%20in%20Review33.user.js
// @updateURL https://update.greasyfork.org/scripts/382491/Block%20user%20in%20Review33.meta.js
// ==/UserScript==

// Add user in the list, seperated by comma.
var blk_usrs = ["testuser","testuser2"];

// Set it to ture for experimental feature olny
var blk_all = false;

// Suppress Option
// 0: Show nothing
// 1: Show Message Supressed only
// 2: Show Message Supressed, display username
// 3: Supress Message body only, display username, datetime, etc.
var suppress_option = 2;


// ============ Do Not modify anything below ================

var j, i;
var blk_usr;
var msg_blks;
var msg_line = '===============================';
var td_bgn = '<td bgcolor="#DDDDDD" width="100%"><font color="6699CC">';
var td_end = '</font></td>';

function replace_block( p_msg_blk ) {
    var alt_msg;

    alt_msg = document.createElement("tr");
    alt_msg.className = "SmallFont";
    switch (suppress_option) {
      case 1:
        alt_msg.innerHTML= td_bgn + msg_line+ ': Message Suppressed '+ msg_line + td_end;
        break;
      case 2:
        alt_msg.innerHTML= td_bgn + msg_line +' User ' + blk_usr + ': Message Suppressed '+ msg_line + td_end;
        break;
       case 3:
        p_msg_blk.getElementsByTagName('td')[0].innerHTML= td_bgn + '== Message Suppressed ==' + td_end;
        alt_msg = p_msg_blk;
        break;
      default:
        alt_msg.innerHTML= '<td></td>';
        break;
    }
    p_msg_blk.parentNode.replaceChild(alt_msg, p_msg_blk);
}

if (blk_all) {
    msg_blks = document.evaluate("//tr[td]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (i=0; i < msg_blks.snapshotLength; i++) {
        replace_block( msg_blks.snapshotItem(i) );
    }
} else {
  for (j=0; j < blk_usrs.length; j++) {

    blk_usr = blk_usrs[j];

    // Search for the first message (with ad)
    msg_blks = document.evaluate("//body/table[position()=3 and //tr/td[3]/text() = '" + blk_usr +"']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (msg_blks.snapshotLength > 0) {
        replace_block( msg_blks.snapshotItem(0) );
    }

    // Search the remaining message
    msg_blks = document.evaluate("//tr[td[2]/text() = '" + blk_usr +"']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (i=0; i < msg_blks.snapshotLength; i++) {
        replace_block( msg_blks.snapshotItem(i) );
    }
  }
}
