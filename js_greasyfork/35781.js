// ==UserScript==
// @name        LeaderboardRank
// @namespace   robloxext
// @description Finds your rank on a leaderboard
// @include     https://www.roblox.com/games/*
// @include     http://www.roblox.com/games/*
// @include     https://web.roblox.com/games/*
// @include     http://web.roblox.com/games/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35781/LeaderboardRank.user.js
// @updateURL https://update.greasyfork.org/scripts/35781/LeaderboardRank.meta.js
// ==/UserScript==


var placeID = window.location.pathname.split("/")[2];
var button = 'btn-full-width btn-control-xs rbx-game-server-join';
var domain = "https://www.roblox.com";
if(window.location.toString().indexOf("web.roblox.com") > -1){
	domain = "https://web.roblox.com";
}
var pagesize = 50;
// 0 today, 1 week, 2 month, 3 all
var tt = ["Today", "Last week", "Last month", "All time"];
function getRank(username, pos, points, d, cb)
{
    if(pos >= 1000 && d.c == false){
        if(confirm("You're going past rank 1,000, do you want to continue?")){
            d.c = true;    
        } else {
            cb(false);
            return;    
        }
    }
    $.ajax({
        'url' : domain+'/leaderboards/game/json',
        'type' : 'GET',
        'data' : {
            targetType: 0,
            distributorTargetId: 113491250,
            timeFilter: d.t,
            startIndex: pos,
            currentRank: pos+1,
            previousPoints: -1,
            max: pagesize,
            imgWidth: 48,
            imgHeight: 48,
            imgFormat:"PNG"
        },
        'success' : function(data) {
            
            if(data.length == 0){
                cb(false);
                return;    
            }
            
            var poi = -1;
            for(var i in data){
                if(data[i].Name.toLowerCase() == username){
                    d.myrank = data[i].Rank;
                    cb(d);
                    return;
                } else {
                    poi = data[i].Points;    
                }
            }
            
            setTimeout(function(){ getRank(username, pos + pagesize, poi, d, cb); }, 100);
        }
    });
}

$(".game-stat-footer").after("<h3>Leaderboard Position finder</h3><input placeholder=\"Username\" id=\"lb-pos-in\" /> <button id=\"buttonGetLeaderboard\" class=\""+button+" buttonLB\" style=\"width: 25%\">Find Position</button><select id=\"timetypes\">"
    +"<option value=\"0\">Today</option>"
    +"<option value=\"1\">Week</option>"
    +"<option value=\"2\">Month</option>"
    +"<option value=\"3\">All time</option></select>"
    +"<br /><hr/><br />");
$(function(){
    $(".buttonLB").click(function(){
        $(".buttonLB").attr("disabled", "disabled");
        $(".buttonLB").html("Loading...");
        var user = $("#lb-pos-in").val();
        var tim = $("#timetypes").val();
          getRank(user.toLowerCase(), 0, -1, {myrank: false, c: false, t: tim}, function(data){
            $(".buttonLB").removeAttr("disabled");
            $(".buttonLB").html("Find Position");
            if(data == false){
                alert("Failed to fetch position");    
            } else {
                alert("The rank for "+user+" is "+ data.myrank+" for "+tt[tim]);
            }
        });
    });
});
