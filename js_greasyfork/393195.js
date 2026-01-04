// ==UserScript==
// @name         Torn Casino for Mike
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.3
// @description  Casino
// @author       MikePence [2029670]
// @match        https://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/393195/Torn%20Casino%20for%20Mike.user.js
// @updateURL https://update.greasyfork.org/scripts/393195/Torn%20Casino%20for%20Mike.meta.js
// ==/UserScript==

$(document).ready(function(){
    if(!window.location.href.includes("viewRussianRouletteStats") && !window.location.href.includes("attack")){
        var blacklistInterval = window.setInterval(blacklistFunction, 10);
        function blacklistFunction(){
            var list = [["BORK", "mugger", "serious"],
                        ["realistassasin", "mugger", "casual"],
                        ["Cobralov3r", "mugger", "serious"],
                        ["Sharivan", "mugger", "casual"],
                        ["Dee_Alter", "mugger", "casual"],
                        ["LTJELLOMAN", "mugger", "serious"],
                        ["Lord_Marelis", "mugger", "casual"],
                        ["JayBragga", "mugger", "serious"],
                        ["bfb926", "mugger", "serious"],
                        ["Suomipoika", "mugger", "serious"],
                        ["CrazyXanax", "player", "serious"],
                        ["MOMO-", "player", "serious"],
                        ["RoseTaylor", "player", "casual"],
                        ["Sai_Lazuli", "player", "serious", "revives off", "large player", "yes join mugged"],
                        ["bathwaterboy69", "player", "serious", "revives off", "small to large player", "no join mugged 5s"],
                        ["dodgycheese", "player", "serious", "small player"],
                        ["SofiaVitosha", "player", "serious", "revives off", "large player", "no join mugged 15s-30s variable"],
                        ["-hipsterfogg-", "player", "serious", "revives off", "medium player"],
                        ["Copper_Halliday", "player", "casual", "revives on", "small to large player", "yes join mugged 4s-20s"],
                        ["Shenzi", "player", "casual", "revives on", "small to large player"],
                        ["FDEGEN", "player", "serious", "revives off", "large player"],
                        ["WeedsMyNeed", "player", "serious", "revives off", "large player", "yes join mugged 13s-15s"],
                        ["GoldDean", "player", "serious", "revives off", "large player", "no join mugged 5s"],
                        ["Cobb", "player", "serious", "revives on", "large player"],
                        ["Mr_Oxygen", "player", "serious", "revives off", "large player"],
                        ["Khaotic69", "player", "serious", "revives off", "medium to large player"],
                        ["TheBONERCOASTER", "player", "serious", "revives on", "medium to large player"],
                        ["Allegra", "player", "serious", "revives on", "medium player"],
                        ["Murph", "player", "serious", "revives ?", "large player"],
                        ["Chaos12th", "player", "?", "revives off", "large player"],
                        ["Mrfrench07", "player", "?", "revives on", "large player"],
                        ["C_M_Burns", "player", "?", "revives ?", "large player"],
                        ["iPlayNeked", "player", "?", "revives off", "medium player"],
                        ["Jelly_Roll", "player", "?", "revives off", "medium to large player"],
                        ["-Smithers-", "player", "?", "revives off", "medium player"],
                        ["IReacT", "player", "?", "revives off", "large player"],
                        ["Beltalowda", "player", "?", "revives on", "large player"],
                        ["AIure", "player", "?", "revives off", "medium to large player"],
                        ["YorkTzu", "player", "serious", "revives off", "large player"],
                        ["Boomslang", "player", "casual", "revives ?", "large player", "timeout mugged 157m"],
                        ["TheBigmeanie", "player", "?", "revives on", "medium player"],
                        ["2BOLTS1NATION3", "player", "?", "revives on", "medium player"],
                        ["kuaidilhazwar", "player", "join only", "revives ?", "medium player"],
                        ["BigDooD", "player", "?", "revives ?", "large player"],
                        ["NazerTheBlazer", "player", "?", "revives ?", "large player"],
                        ["EspiMedic92", "player", "serious", "revives off", "medium to large player"],
                        ["Clitasaurus", "player", "?", "revives off", "medium to large player"],
                        ["Bill", "player", "?", "revives off", "medium player"],
                        ["Topknaw", "player", "?", "revives on", "small to medium player"],
                        ["TheBigChenzo", "player", "?", "revives ?", "large player"],
                        ["Rum4nyby", "player", "serious", "revives off", "large player"],
                        ["quagmire_", "player", "?", "revives off", "medium player"],
                        ["Nessie-", "player", "?", "revives off", "large player"],
                        ["Saren_Arterius", "player", "?", "revives on", "large player"],
                        ["Kenny", "player", "?", "revives ?", "large player"],
                        ["Sai_Kuririn", "player", "?", "revives ?", "medium player"],
                        ["Jon", "player", "serious", "revives on", "medium to large player"],
                        ["DinkyWinky", "player", "serious", "revives off", "medium player"],
                        ["Flyweight", "player", "?", "revives on", "medium player"],
                        ["sqeeksmcgee", "squeek"],
                        ["Droq", "player", "casual", "revives off", "very large player"],];
            $("#nav-enemies").children().eq(1).children().first().children().first().children().each(function(){
                var name = $(this).children().eq(1).attr("id").replace("enemies_user_", "");
                var inList = false;
                for(var i = 0; i < list.length; i++){
                    if(list[i][0] == name) {
                        inList = i;
                        break;
                    }
                }
                if(inList === false){
                    $(this).children().eq(1).css("color", "black");
                }
                else{
                    if(list[inList][1] === "mugger" && list[inList][2] === "serious"){
                        $(this).children().eq(1).css("color", "yellow");
                    }
                    else if(list[inList][1] === "player"){
                        $(this).children().eq(1).css("color", "red");
                    }
                    else if(list[inList][1] === "squeek"){
                        $(this).children().eq(1).css("color", "green");
                    }
                    else{
                        $(this).children().eq(1).css("color", "black");
                    }
                }
            });
        }
    }
    if(window.location.href.includes("russianRoulette")){
        var rrInterval = window.setInterval(rrFunction, 10);
        function rrFunction(){
            /*$(".rr-list-wrap").first().children().first().children().first().children().each(function(){
                var name = $(this).children(".left").first().children(".started-by").first().children(".name").first().attr("data-placeholder");
                var bet = $(this).children(".right").first().children(".bet").first().attr("data-info");
                //console.log("name = " + name + ", bet = " + bet);
                //if(name == "Yowzer [2190778]"){
                //$(this).children(".right").first().children(".join").first().children(".join-icon").first().remove();
                //}
                //if(bet >= 25000000){
                //$(this).children(".right").first().children(".join").first().children(".join-icon").first().remove();
                //}
            });*/
            //$(".join").remove();
            var pot = parseInt($(".rr-pot").first().text().substr(12).replace(/,/g, ""));
            $(".btn-wrap.shoot").first().css("display", "inline-block");
            $(".btn-wrap.x2").first().css("display", "inline-block");
            $(".btn-wrap.x3").first().css("display", "inline-block");
//            $(".btn-wrap.leave").first().css("display", "inline-block");
//            $(".rr-confirm").first().css("display", "inline-block");
//            $(".btn-wrap.takeaction").first().css("display", "inline-block");
            if(pot <= 1000){
                 $(".btn-wrap.shoot").first().remove();
            }
            else if(pot >= 1000000){
                $(".btn-wrap.x2").first().remove();
                $(".btn-wrap.x3").first().remove();
            }
        }
    }
    else if(window.location.href.includes("viewRussianRouletteStats")){
        $("#overall-stats").children("ul").first().children().each(function(){
            var stat = $(this).children(".item").first().children(".stat").first().text().trim();
            var valueElement = $(this).children(".item").first().children(".stat-value").first();
            var value = parseInt(valueElement.text().trim().replace(/,/g, "").replace("$", ""));
            //console.log(stat + " " + value);
            var checkStats = [["Total money won", "lastTotalMoneyWon"],
                              ["Total games", "lastTotalGames"],
                              ["Round #1 shots", "lastRound1Shots"],
                              ["Round #2 shots", "lastRound2Shots"],
                              ["Round #3 shots", "lastRound3Shots"],
                              ["Round #4 shots", "lastRound4Shots"],
                              ["Round #5 shots", "lastRound5Shots"],
                              ["Round #6 shots", "lastRound6Shots"],
                              ["Timeouts", "lastTimeouts"]];
            for(var i = 0; i < checkStats.length; i++){
                if(stat.includes(checkStats[i][0])){
                    var lastValue = GM_getValue(checkStats[i][1]);
                    //console.log("value = " + value + ", lastValue = " + lastValue);
                    if(value != lastValue){
                        var difference = value - lastValue;
                        if(checkStats[i][0] == "Total money won"){
                            valueElement.html("<span style='color:" + (difference >= 25000000 ? "red" : "green") + "'>+$" + difference.toLocaleString() + "</span>");
                        }
                        else{
                            valueElement.html(value.toLocaleString() + " <span style='color:green'>(+" + difference.toLocaleString() + ")</span>");
                        }
                        GM_setValue(checkStats[i][1], value);
                    }
                    break;
                }
            }

        });
    }
    /*else if(window.location.href.includes("slots")){
        var slotsInterval = window.setInterval(slotsFunction, 10);
        function slotsFunction(){
            //$(".btn-10m").addClass("disabled");
            //$(".btn-1m").addClass("disabled");
        }
    }*/
    /*else if(window.location.href.includes("factions.php?step=your#/tab=controls")){
        var factionControlsInterval = window.setInterval(factionControlsFunction, 10);
        function factionControlsFunction(){
            $(".select-wrap").remove();
            $(".inputs-wrap").remove();
        }
    }*/
    else if(window.location.href.includes("attack")){
        var attackInterval = window.setInterval(attackFunction, 10);
        function attackFunction(){
            $("button:contains('Start fight')").css("height", "100px");
            $("button:contains('Start fight')").css("width", "500px");
            $("button:contains('leave')").remove();
            $("button:contains('hospitalize')").remove();
            $("button:contains('mug')").css("height", "100px");
            $("button:contains('mug')").css("width", "500px");
        }
    }
    /*else if(window.location.href.includes("profile")){
        var profileInterval = window.setInterval(profileFunction, 10);
        function profileFunction(){
            $(".profile-wrapper").first().append("<div><table></table></div>");
        }
    }*/
});