// ==UserScript==
// @name         ylFriendliesPlayedChecker
// @namespace    http://tampermonkey.net/
// @version      0.0.3b
// @description  click yellow circle on matches page to load
// @author       kostrzak16 (Michal Kostrzewski)
// @match        https://www.managerzone.com/?p=match*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449847/ylFriendliesPlayedChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/449847/ylFriendliesPlayedChecker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var yellowDot = $(".icon-explanation.uxx");
    yellowDot.css("cursor", "pointer");



    yellowDot.off("dblclick").click(function () {
       FriendliesPlayedChecker(false);
    });

     yellowDot.off("dblclick").dblclick(function () {
       FriendliesPlayedChecker(true);
    });

    function FriendliesPlayedChecker(previousWeek = false)
    {
        let today = new Date();          //today
        let lastMondayEndDate = new Date();
        let daysToPreviousMonday = ( (today.getDay() + 6) % 7 ) + 7;
        let  previousMonday = getDateXDaysAgo(daysToPreviousMonday);
         console.log(previousMonday);
        console.log("days to previous Monday" + daysToPreviousMonday);

  //   lastMondayEndDate.setDate(lastMondayEndDate.getDate() - (lastMondayEndDate.getDay() + 6) % 7 );
   //      lastMondayEndDate.setDate(lastMondayEndDate.getDate() - (lastMondayEndDate.getDay() + 6) % 7 );
       if(lastMondayEndDate.getDay() == 1){ //if monday today  //change 8 to 1 for Monday

            lastMondayEndDate = new Date( new Date().setDate(new Date().getDate() -1)); //sunday
          lastMondayEndDate.setDate(lastMondayEndDate.getDate() - (lastMondayEndDate.getDay() + 6) % 7 ); //previous monday
               lastMondayEndDate.setUTCHours(43);
        lastMondayEndDate.setUTCMinutes(59);
        }
        else
        {
        lastMondayEndDate.setDate(lastMondayEndDate.getDate() - (lastMondayEndDate.getDay() + 6) % 7 ); //last monday
                lastMondayEndDate.setUTCHours(21);
        lastMondayEndDate.setUTCMinutes(59);
        }
         console.log(lastMondayEndDate);

        let matchesLinks = "";
        let mLinks;
        var players = [];
        var playersNr = [];
        var playersForm = [];

        //lastMondayEndDate.setDate(lastMondayEndDate.getDate() - (lastMondayEndDate.getDay()  + 6) % 7 );
     //   console.log(lastMondayEndDate); //display last Monday

//lastMondayEndDate = getPreviousMonday();

  //      lastMondayEndDate.setUTCHours(21);
    //    lastMondayEndDate.setUTCMinutes(59);


        let realLastMondayEndDate = new Date();
      if(previousWeek){
              realLastMondayEndDate = lastMondayEndDate;
lastMondayEndDate = previousMonday;
  lastMondayEndDate.setUTCHours(21);
        lastMondayEndDate.setUTCMinutes(59);
        }


        console.log("last monday" + lastMondayEndDate);
           console.log("real last monday" + realLastMondayEndDate);
        //gather all links since last tuesday
        $("#fixtures-results-list .group").each(function () {
            let d = $(this).text().trim().split("-");
            let matchesDay = new Date(d[2], d[1] - 1, d[0]);
            var Difference_In_Time = today.getTime() - lastMondayEndDate.getTime();
             var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            let previousWeek = Difference_In_Days > 7;
            if ( ((matchesDay > lastMondayEndDate) && (previousWeek == false)) ||
                ((previousWeek == true) && (matchesDay > lastMondayEndDate) && (matchesDay < realLastMondayEndDate) ))
                {

                var matchesInThatDay = $(this).nextUntil(".group");
                for(var j=0;j < matchesInThatDay.length;j++){
                   matchesLinks += "||" + $(matchesInThatDay[j]).find("a.score-shown").attr("href");
                }
            }
            else if (matchesDay.getTime() == removeTime(lastMondayEndDate).getTime()) //brazilian Monday XD
            {
                var matchesLateMonday = $(this).nextUntil(".group");
                for(var k=0;k < matchesLateMonday.length;k++){
                    if($(matchesLateMonday[k]).find('.match-time').text().substr(0,2) > lastMondayEndDate.getHours()) //match on Monday but after new MZ week start
                   matchesLinks += "||" + $(matchesLateMonday[k]).find("a.score-shown").attr("href");
                }
            }
            //console.log(matchesLinks);
            mLinks = matchesLinks.split("||");
        });

        var allPromises = [];
        for (let index = 0; index < mLinks.length; index++) {

            console.log(mLinks[index]);
            allPromises.push($.get(mLinks[index], {}, function (content) {
                //if player found add +1 to his weekly matches
                $(content).find(".statsLite .player_link.fixed_lite_stats").each(function () { players[$(this).text()] = (players[$(this).text()] ?? 0) + 1; });
                players = players.sort(function (a, b) {
                    return a.val.localeCompare(b.val);
                });
            }, "html"))
        };
//----------------
        allPromises.push($.get("/?p=players", {}, function (content) {

            $(content).find('.player_name').each(function () {
                var playerShortName = $(this).text().split(" ")[0].substring(0, 1) + ". " + $(this).text().split(" ")[1];

                if($(this).text().split(" ").length == 1)
                    playerShortName = $(this).text().trim();
                if($(this).text().split(" ").length > 2)
                    playerShortName =  $(this).text().split(" ")[0].substring(0, 1) + "." + $(this).text().substr($(this).text().indexOf(" "));

                 playersNr[playerShortName] = $(this).parent().text().split('.')[0].trim();

                if( $(this).closest(".playerContainer").find(".player_icon_image[style*='formminus']").length)
                    playersForm[playerShortName] = "<img src='nocache-818/img/player/formminus.png'>";
                if( $(this).closest(".playerContainer").find(".player_icon_image[style*='formplus']").length)
                    playersForm[playerShortName] = "<img src='nocache-818/img/player/formplus.png'>";
                if( $(this).closest(".playerContainer").find(".player_icon_image[style*='formgood']").length)
                    playersForm[playerShortName] = "";


                // playersForm[playerShortName] = $(this).closest(".playerContainer").find(".player_icon_image[style*='formminus']")
                if (players[playerShortName] === undefined
                    && ($(this).closest(".playerContainer").find(".player_tc_package_information").length == 0 ||
                        $(this).closest(".playerContainer").find(".player_tc_package_information p[style*='report_ycc_soccer']").length > 0)) {
                    players[playerShortName] = 0;
                }
            })

        }));

        var AfterAllRequests = $.Deferred().done(function () {
            // real final work here...
            //  console.dir(players);

            let sortedPlayers = getSortedPlayers(players,playersNr,playersForm);
            $('body #PlayersListYel').html("").remove();
            $('body').append('<div id="PlayersListYel" style="position: fixed; font-size:14px; z-index: 1000; left: 5%; top: 20px; width: auto; height: 20px;background-color: white">Most active players ' + ((previousWeek) ? "previous week " : "this week ")  + ':<br><table id="tblPlayers" style="display:block; background-color:white;max-height:850px;overflow-y:auto"></table></div>');

            sortedPlayers.forEach(function (pl) {
                let playerBgColor = "#fff";
                if (pl.matches < 2) playerBgColor = "#d7ffd7";
                if (pl.matches == 4) playerBgColor = "#ffd8ac";

                if (pl.matches > 4) playerBgColor = "#f19e9e";
//<img src="nocache-818/img/player/formplus.png">
                $("#tblPlayers").append("<tr><td>" + pl.nr + "</td> <td style='background-color:" + playerBgColor + "'>" + pl.name +  pl.form + "</td>" + "<td>" + pl.matches + "</td>");
            });
        });

        //below + above ensures div is generated only when all ajax calls are completed
        $.when.apply($, allPromises).always(function () {
            AfterAllRequests.resolve();
            console.log(players.length);
        });

        //helper functions
        function removeTime(date = new Date()) {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        }
    }

    function getSortedPlayers(obj,plNrs, plForm) {

        var listOfObjects = [];
        for (let key in obj) {
            var singlePlayer = {};
            singlePlayer.name = key;
            singlePlayer.matches = obj[key];
            if (singlePlayer.matches == 4) {
                singlePlayer.warning = "max";
            }
            if (singlePlayer.matches > 4) {
                singlePlayer.warning = "thats too much bro";
            }
            singlePlayer.nr = plNrs[key];
            singlePlayer.form = plForm[key];
            console.log(singlePlayer.name);
            if (key != "unique") {
                listOfObjects.push(singlePlayer);
            }
        }
    //    listOfObjects.sort((a, b) => {
 //           return b.matches - a.matches;
    //    });
            listOfObjects.sort((a, b) => {
                if(b.matches > a.matches)
                    return 1;
                if(a.matches > b.matches)
                    return -1;
                if(a.matches == b.matches)
                    return a.nr - b.nr;

        });

        //console.dir(listOfObjects);
        return listOfObjects;
        // console.table(listOfObjects);
    }

    function getDateXDaysAgo(numOfDays, date = new Date()) {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
}

    function getPreviousMonday() {
  var today = new Date();
  var dayOfWeek = today.getDay();
  var prevMonday = new Date(today);

  if (dayOfWeek === 1) {
    prevMonday.setDate(today.getDate() - 7);
  } else {
    prevMonday.setDate(today.getDate() - (dayOfWeek - 1));
  }

  return prevMonday;
}

    function getPreviousMonday10pmUTC() {
  var now = new Date();
  var currentDay = now.getUTCDay();
  var prevMonday = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (currentDay + 6) % 7, 22, 0, 0);

  return prevMonday;
}

    // end
})();