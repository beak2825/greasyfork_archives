// ==UserScript==
// @name        Torn RR New
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     1.0
// @description Make RR great again
// @author      MikePence [2029670]
// @match       https://www.torn.com/page.php?sid=russianRoulette*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @connect     mpsse.epizy.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/425188/Torn%20RR%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/425188/Torn%20RR%20New.meta.js
// ==/UserScript==

$(document).ready(function(){
    var bet = 1000000;
    var rfcv = "601320da6fa47";
    $("<div id='MikeTornCT' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's RR</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRRStartTestButton'>Start test game</button> <button type='button' id='MikeTornRRStopTestButton'>Stop test game</button> <button type='button' id='MikeTornRRWithdrawButton'>Withdraw money</button> <button type='button' id='MikeTornRRStartActualButton'>Start actual game</button> <button type='button' id='MikeTornRRDepositButton'>Deposit money</button></p><p>This game ID: <input type='text' id='MikeTornRRThisGameIDInput'> Next game ID: <input type='text' id='MikeTornRRNextGameIDInput'> Next game status: <input type='text' id='MikeTornRRNextGameStatusInput'></p></div><hr class='page-head-delimiter m-top10'></div>").insertBefore("#react-root");
    $("#MikeTornRRStartTestButton").click(function(){
        $.ajax({
            url:"https://www.torn.com/page.php",
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                sid: "russianRouletteData",
                step: "createGame",
                betAmount: 1,
                password: "a"
            }),
            contentType:"application/json"
        }).done(function(data){
            var thisGameID = parseInt(data.data.ID);
            console.log("thisGameID " + thisGameID);
            $("#MikeTornRRThisGameIDInput").val(thisGameID);
            GM_setValue("thisGameID", thisGameID);
            var nextGameID = thisGameID + 1;
            console.log("nextGameID " + nextGameID);
            $("#MikeTornRRNextGameIDInput").val(nextGameID);
            GM_setValue("nextGameID", nextGameID);
            var nextGameStatus = "";
            /*if(nextGameID % 5 == 4){
                if(nextGameStatus != ""){
                    nextGameStatus += "; ";
                }
                nextGameStatus += "% 5 == 4";
            }*/
            if(nextGameID % 10 == 0 || nextGameID % 10 == 1 || nextGameID % 10 == 4 || nextGameID % 10 == 9){
                nextGameStatus += "YES";
            }
            if(nextGameStatus == ""){
                nextGameStatus = "None";
            }
            console.log("nextGameStatus " + nextGameStatus);
            $("#MikeTornRRNextGameStatusInput").val(nextGameStatus);
            GM_setValue("nextGameStatus", nextGameStatus);
        });
    });
    $("#MikeTornRRStopTestButton").click(function(){
        $.ajax({
            url:"https://www.torn.com/page.php",
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                sid: "russianRouletteData",
                step: "leaveGame"
            }),
            contentType:"application/json"
        }).done(function(data){

        });
    });
    $("#MikeTornRRWithdrawButton").click(function(){
        $.ajax({
            url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
            type:"POST",
            dataType:"text",
            data:{
                "step": "vaultProperty",
                "withdraw": bet,
                "ID": "3158724"
            },
            done:function(data){
//                console.log(data);
            }
        });
    });
    $("#MikeTornRRStartActualButton").click(function(){
        $.ajax({
            url:"https://www.torn.com/page.php",
            type:"POST",
            dataType:"json",
            data:JSON.stringify({
                sid: "russianRouletteData",
                step: "createGame",
                betAmount: bet
            }),
            contentType:"application/json"
        }).done(function(data){

        });
    });
    $("#MikeTornRRDepositButton").click(function(){
        $.ajax({
            url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
            type:"POST",
            dataType:"text",
            data:{
                "step": "vaultProperty",
                "deposit": bet * 2,
                "ID": "3158724"
            },
            done:function(data){
//                console.log(data);
            }
        });
    });
    /*setInterval(function(){
        $("#react-root").first().children().first().children().eq(1).children().first().children().eq(1).css("background", "");
        $("#react-root").first().children().first().children().eq(1).children().first().children().eq(1).css("background-color", "");
    }, 1000);*/
    /*$("#react-root").children().first().children().eq(1).children().first().children().first().children().eq(1).children().eq(1).on("DOMSubtreeModified", "span", function(){
        console.log("change");
        GM_notification({
            text: "",
            title: "Email",
            silent: true,
            timeout: 3000
        });
    });*/
});