// ==UserScript==
// @name         Challonge team formatter
// @namespace    gamestah-challonge
// @version      0.14
// @description  Parses all the team names and optionally the team members in a given team.
// @author       SuperRoach
// @match        http://gamestah.challonge.com/*/standings
// @match        https://gamestah.challonge.com/*/standings
// @website      http://twitter.com/superroach
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34835/Challonge%20team%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/34835/Challonge%20team%20formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

//reset our stuff
    //GM_notification("Loaded Team parser", "SuperRoach");
var teams_list = [];
//$(".participants.modal-open a").click();
// Setup
$(".share-icons").append("<a class=\"teamschecker\" href=\"http://gamestah.com\" onclick=\"return false;\"><img title=\"SuperRoach - Get teams list\" alt=\"SuperRoach - Get teams list\" src=\"https://www.shareicon.net/download/2016/10/18/845430_bug_512x512.png\" width=\"32\" height=\"32\"></a>");

$( "a.teamschecker" ).unbind('click').on( "click", function(evt) {
  //alert("Runs on page load for now.");
    evt.stopPropagation();
    evt.preventDefault();
    evt.stopImmediatePropagation();
    return false;
});
            setTimeout(function(){
    checkteams();
            }, 6000);

function checkteams() {
            console.info("Loading, Please hold....");
    $.each( $(".standings tr:gt(0)"), function( key, value ) {
        //console.log( value );


        var search_pattern = $(value);
        var get_player_names = true;

        var team_name = search_pattern.find(".display_name span").html();
        var team_url = search_pattern.find("td:eq(2) a").attr("href");
        //var previous_match = search_pattern.find("td:eq(4) div:first").html();  // Either a W or L
        var previous_match = search_pattern.find("td").has("a[data-toggle]").find("div:first").html();  // Either a W or L


        var team = {name: team_name, url: team_url, result: previous_match};
        teams_list.push([team] );
        //console.log("Team: " + team_name )
        if (get_player_names) {
            var search_pattern_model = $(".modal-body");
            var team_position = (previous_match == "W") ? 0 : 1;  // Winner's position is on the left aka block 0
            var opposition_position = (previous_match == "W") ? 1 : 0;  // Invert for the other team
            var team_details = null; // Scopey McScopeface
            // Load this bit up
            search_pattern.find("td:eq(4) div:first").click(); // and we should wait
            setTimeout(function(){
                var working_team_details = $(".modal-body .matchup .participant").eq(team_position);
                var team_score = $(".modal-body .score").eq(team_position).find(".contents").text();
                //var opposition_name = $(".modal-body .participant:eq(0) .name").text(); // this doesn't work yet.
                var player_list = [];
                console.log("Team: " + team_name + " ("+previous_match+")" );
                console.log("-------------------");
                $.each( working_team_details.find(".team-members a"), function( key, value ) {
                    var user_url = "http://gamestah.challonge.com" + $(value).attr("href");
                    var user_name = $(value).attr("title");
                    var player = { name: user_name, url: user_url};
                    player_list.push(player);
                    console.log(user_name, user_url);
                });
                //var last = teams_list[teams_list.length-1]
                var last = teams_list[key];
                last.players = player_list;
                last.score = team_score; // This needs to be cleaned up to show only the number

            }, 2400);

            // We're done, close it
            setTimeout(function(){
            $(".participants.modal-open a").click();
            }, 250);


            console.log(teams_list);
        }


    });
    return true;
}
})();