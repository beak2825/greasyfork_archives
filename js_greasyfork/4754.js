// ==UserScript==
// @name       Swagbucks App Completion
// @namespace  https://github.com/Omegaice/SwagBucksAppMonitor
// @version    1.5
// @description A script to add a new tab to the users acount page to show how much you have progressed for each swagbuck app.
// @match      http://www.swagbucks.com/account/summary
// @copyright  2014+, Omegaice
// @downloadURL https://update.greasyfork.org/scripts/4754/Swagbucks%20App%20Completion.user.js
// @updateURL https://update.greasyfork.org/scripts/4754/Swagbucks%20App%20Completion.meta.js
// ==/UserScript==

// App Maximums
var sbtvpc_max      = 150;
var sbtv_max        = 36;
var lifestylez_max  = 18;
var indymusic_max   = 18;
var sportly_max     = 18;
var movieclips_max  = 18;
var entertainow_max = 18;

function CreateAppRows(name, current, maximum, reward, video_duration, videos_per_reward) {
    var result = "<p>"+ name + ":</br>";
    if( current >= maximum ){
        result += "&nbsp&nbsp&nbsp&nbspComplete [" + current + "/" + maximum + "]";
    }else{
        result += "&nbsp&nbsp&nbsp&nbspIncomplete [" + current + "/" + maximum + "]";
    }
    result += "</br>&nbsp&nbsp&nbsp&nbspVideos Remaining: " + videos_per_reward * (Math.max(maximum-current, 0)/reward);
    if( video_duration > 0) result += "</br>&nbsp&nbsp&nbsp&nbspEstimated Time Remaining: " + CalculateDuration(video_duration, current, maximum, videos_per_reward, reward);
    return result + "</p>";
}

// Time Variables
var advert_time = 15;
var nextup_time = 10;
var video_load_time = 5;

function CalculateDuration(minimum_time, current_points, maximum_points, videos_per_reward, reward_value){
    var remaining_points = Math.max(maximum_points - current_points, 0);
    var remaining_videos = remaining_points * (videos_per_reward / reward_value);
    var remaining_adverts = remaining_videos;

    var time = remaining_videos * (video_load_time + minimum_time + nextup_time) + remaining_adverts * advert_time;

    var hours = Math.floor(time / 3600) % 24;
    var minutes = Math.floor(time / 60) % 60;
    var seconds = time % 60;

    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
}

$("#ledgerInnerCont").append('<div id="appContent" style="position: relative; display: none;"></div>');

$.get("http://www.swagbucks.com/?cmd=sb-acct-ledger&allTime=false",function(data,status){
    var values = data.split("|")[2].substr(1);
    values = values.substring(0, values.length - 1);

    var rewards = new Array();
    rewards["SBTV"] = 0;
    rewards["SBTVPC"] = 0;
    rewards["Sportly"] = 0;
    rewards["Indymusic"] = 0;
    rewards["Lifestylz"] = 0;
    rewards["EntertaiNow"] = 0;
    rewards["MovieCli.ps"] = 0;

    var lines = values.split("],");
    for( var i = 0; i < lines.length; i++ ){
        var lData = lines[i].replace("[", "").replace("]", "").split(",");

        var desc = lData[5].replace("'", "").replace("'", "").trim();
        var value = parseInt(lData[3]);

        if( desc == "" ) desc = ( value == 2 ? "SBTV" : "SBTVPC" )

        if( rewards[desc] == null ){
            rewards[desc] = value;
        }else{
        	rewards[desc] = rewards[desc] + parseInt(lData[3]);
        }
    }

    $("#appContent").append(CreateAppRows("SBTV - PC", rewards["SBTVPC"], sbtvpc_max, 3, 0, 10) + "</br>");
    $("#appContent").append(CreateAppRows("SBTV - Mobile", rewards["SBTV"], sbtv_max, 2, 9, 5) + "</br>");
    $("#appContent").append(CreateAppRows("Sportly.tv", rewards["Sportly"], sportly_max, 2, 25, 15) + "</br>");
    $("#appContent").append(CreateAppRows("Indymusic.tv", rewards["Indymusic"], indymusic_max, 2, 30, 15) + "</br>");
    $("#appContent").append(CreateAppRows("Lifestylz.tv", rewards["Lifestylz"], lifestylez_max, 2, 12, 15) + "</br>");
    $("#appContent").append(CreateAppRows("EntertaiNow", rewards["EntertaiNow"], entertainow_max, 2, 11, 15) + "</br>");
    $("#appContent").append(CreateAppRows("MovieCli.ps", rewards["MovieCli.ps"], movieclips_max, 2, 23, 15) + "</br>");
});

$("#accountTab1").parent().append("<li id=\"accountTab2\">Applications</li>");

$("#accountTab2").click(function(){
    $("#accountTab1").removeClass("selected");
    $("#ledgerContL").css({position: "relative", display: "none"});

    $("#accountTab2").addClass("selected");
    $("#appContent").removeAttr( 'style' );

    $("#accountTab3").removeClass("selected");
    $("#collectorBills").css({position: "relative", display: "none"});
})

// Helpers for old tabs
$("#accountTab1").click(function(){
    $("#accountTab2").removeClass("selected");
    $("#appContent").css({position: "relative", display: "none"});
})
$("#accountTab3").click(function(){
    $("#accountTab2").removeClass("selected");
    $("#appContent").css({position: "relative", display: "none"});
})
