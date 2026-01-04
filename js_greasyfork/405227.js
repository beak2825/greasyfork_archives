// ==UserScript==
// @name         HF - Better Post Activity
// @namespace    https://hackforums.net/
// @version      0.6
// @description  A userscript that adds search buttons to the Post Activity page
// @author       Exalted/4541508
// @match        https://hackforums.net/postactivity.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405227/HF%20-%20Better%20Post%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/405227/HF%20-%20Better%20Post%20Activity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var forumId;
    let table = document.querySelector("#content > div > table");
    document.querySelector("#content > div > table > tbody > tr:nth-child(1) > td").colSpan = 4;
    let username = document.querySelector("#content > div > div > a:nth-child(10)").innerText;
    table.rows[1].insertCell().classList.add("tcat");
    table.rows[1].cells[1].innerHTML = "<span class='smalltext'><strong>Count</strong></span>";
    table.rows[1].cells[2].innerHTML = "<span class='smalltext'><strong>Threads⠀⠀Posts</strong></span>";
    table.rows[1].cells[2].colSpan = 2;
    for (var i = 2, row; row = table.rows[i]; i++) {
        forumId = row.getElementsByTagName('a')[0].href.split('=')[1];
        row.insertCell(2).classList.add("trow1");
        row.insertCell(3).classList.add("trow1");
        if(forumId.length >= 1) {
            row.cells[3].innerHTML = '<form action="search.php" method="post"><input type="hidden" name="action" value="do_search"> <input type="hidden" name="keywords" value=""> <input type="hidden" name="postthread" value="1"> <input type="hidden" name="author" value="'+username+'"> <input type="hidden" name="matchusername" value="1"> <input type="hidden" name="forums[]" value="'+forumId+'"> <input type="hidden" name="findthreadst" value="1"> <input type="hidden" name="numreplies" value=""> <input type="hidden" name="postdate" value="0"> <input type="hidden" name="pddir" value="1"> <input type="hidden" name="threadprefix" value="any"> <input type="hidden" name="sortby" value="lastpost"> <input type="hidden" name="sortordr" value="desc"> <input type="hidden" name="showresults" value="posts"> <button data-tag="'+username+'\'s posts" data-tooltip="'+username+'\'s posts" type="submit" name="submit" value="Posts"><i class="fa fa-file-signature fa-lg" aria-hidden="true"></i></button</form>';
            row.cells[2].innerHTML = '<form action="search.php" method="post"><input type="hidden" name="action" value="do_search"> <input type="hidden" name="keywords" value=""> <input type="hidden" name="postthread" value="2"> <input type="hidden" name="author" value="'+username+'"> <input type="hidden" name="matchusername" value="1"> <input type="hidden" name="forums[]" value="'+forumId+'"> <input type="hidden" name="findthreadst" value="1"> <input type="hidden" name="numreplies" value=""> <input type="hidden" name="postdate" value="0"> <input type="hidden" name="pddir" value="1"> <input type="hidden" name="threadprefix" value="any"> <input type="hidden" name="sortby" value="lastpost"> <input type="hidden" name="sortordr" value="desc"> <input type="hidden" name="showresults" value="threads"> <button data-tag="'+username+'\'s threads" data-tooltip="'+username+'\'s threads"type="submit" name="submit" value="Threads"><i class="far fa-file fa-lg" aria-hidden="true"></i></button></form>';
        }
    }
})();