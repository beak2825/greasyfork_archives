// ==UserScript==
// @name         TourneyTopia Calculate Max Possible Score
// @author       jkalderash
// @version      0.1
// @description  Compute the score you would get if you get every remaining pick correct.
// @match        http://www.tourneytopia.com/*/entrypicks.aspx?entryid=*
// @copyright    2014+, jkalderash
// @require      http://code.jquery.com/jquery-2.0.0.min.js
// @namespace    http://greasyfork.org/users/1076-jkalderash
// @downloadURL https://update.greasyfork.org/scripts/1940/TourneyTopia%20Calculate%20Max%20Possible%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/1940/TourneyTopia%20Calculate%20Max%20Possible%20Score.meta.js
// ==/UserScript==

$(document).ready(function() {
    var rounds = ["r2", "r3", "r4", "r5", "r6", "r7", "r8"];
    var points = [ 1,    2,    3,    5,    10,   20,   30 ];
    var sum = 0;
    for (var i = 0; i < 6; i++) {
        var sum_per_round = 0;
        $("div#" + rounds[i] + " p.competitor-container span.incorrect").each(function() {
            sum_per_round += points[i]
        });
        sum += sum_per_round;
    }
    
    // for some reason the last round uses a different format
    $("div.champ span[style='color:Red;font-weight:bold;']").each(function() {
         sum += points[i]
    });
    
    var total_points = 326;
    GM_log("Total points lost: " + sum + " out of a total of " + total_points);
    
    var max_score = total_points - sum;
    var max_score_display = $("<div><label>Max Possible Score:</label><span>" + max_score + "</span></div>");
    $("div#ctl00_contentPlaceHolder1_TieBreaker2Row").append(max_score_display);
});
