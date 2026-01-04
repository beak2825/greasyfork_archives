// ==UserScript==
// @name        L2L March Maddness 2022
// @namespace   L2L-Humor
// @description Script to add jokes for the 2022 seaason
// @license MIT
// @match       https://fantasy.espn.com/tournament-challenge-bracket/2022/en/group?groupID=3389172
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.0.3
// @downloadURL https://update.greasyfork.org/scripts/441739/L2L%20March%20Maddness%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/441739/L2L%20March%20Maddness%202022.meta.js
// ==/UserScript==


const wait_until_element_appear = setInterval(() => {
    var $entry = $(".entry[href='entry?entryID=58075225']");
    if ($entry.length !== 0) {
        var $row = $entry.closest("tr");
        clearInterval(wait_until_element_appear);
        $row.before("<tr><td colspan='12' class='rank'>The following entry is disqualified for exceptional gamesmenship unbefitting the indignity of the biggest loser. </td> </tr>")
        $row.find("td").addClass("champ").addClass("incorrect")
    }
}, 500);
