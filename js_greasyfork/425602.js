// ==UserScript==
// @name         Torn MP Tools
// @version      2.3
// @description  Stuff
// @author       MikePence [2029670]
// @namespace    MikePence [2029670]
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        window.focus
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/425602/Torn%20MP%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/425602/Torn%20MP%20Tools.meta.js
// ==/UserScript==

$(document).ready(function(){
    var rfcv = "5ffdddbc9888b";
    if(window.location.href.includes("page.php?sid=russianRoulette")){
        var bet1 = 100000000;
        var showBet1 = false;
        var bet2 = 250000000;
        var showBet2 = true;
        var compInsteadOfVault = true;
        var panel = "<div id='MikeTornCT' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's RR</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRRStartTestButton'>Start test game</button> <button type='button' id='MikeTornRRStopTestButton'>Stop test game</button></p>";
        if(showBet1){
            panel += "<p><button type='button' id='MikeTornRRWithdraw1Button'>Withdraw $100m</button> <button type='button' id='MikeTornRRStartActual1Button'>Start $100m game</button> <button type='button' id='MikeTornRRDeposit1Button'>Deposit $200m</button></p>";
        }
        if(showBet2){
            panel += "<p><button type='button' id='MikeTornRRWithdraw2Button'>Withdraw $250m</button> <button type='button' id='MikeTornRRStartActual2Button'>Start $250m game</button> <button type='button' id='MikeTornRRDeposit2Button'>Deposit $500m</button></p><p>This game ID: <input type='text' id='MikeTornRRThisGameIDInput'> Next game ID: <input type='text' id='MikeTornRRNextGameIDInput'> Next game status: <input type='text' id='MikeTornRRNextGameStatusInput'></p></div><hr class='page-head-delimiter m-top10'></div>";
        }
        $(panel).insertBefore("#react-root");
        $("#MikeTornRRStartTestButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/page.php",
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    sid: "russianRouletteData",
                    step: "createGame",
                    betAmount: 10,
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
                if(nextGameID % 10 == 9){
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
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRRWithdraw1Button").click(function(){
            if(compInsteadOfVault){
                $.ajax({
                    url:"https://www.torn.com/companies.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "funds",
                        "withdraw": bet1
                    },
                    done:function(data){
                    }
                });
            }
            else{
                $.ajax({
                    url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "vaultProperty",
                        "withdraw": bet1,
                        "ID": "3158724"
                    },
                    done:function(data){
                    }
                });
            }
        });
        $("#MikeTornRRWithdraw2Button").click(function(){
            if(compInsteadOfVault){
                $.ajax({
                    url:"https://www.torn.com/companies.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "funds",
                        "withdraw": bet2
                    },
                    done:function(data){
                    }
                });
            }
            else{
                $.ajax({
                    url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "vaultProperty",
                        "withdraw": bet2,
                        "ID": "3158724"
                    },
                    done:function(data){
                    }
                });
            }
        });
        $("#MikeTornRRStartActual1Button").click(function(){
            $.ajax({
                url:"https://www.torn.com/page.php",
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    sid: "russianRouletteData",
                    step: "createGame",
                    betAmount: bet1
                }),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRRStartActual2Button").click(function(){
            $.ajax({
                url:"https://www.torn.com/page.php",
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    sid: "russianRouletteData",
                    step: "createGame",
                    betAmount: bet2
                }),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRRDeposit1Button").click(function(){
            if(compInsteadOfVault){
                $.ajax({
                    url:"https://www.torn.com/companies.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "funds",
                        "deposit": bet1 * 2
                    },
                    done:function(data){
                    }
                });
            }
            else{
                $.ajax({
                    url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "vaultProperty",
                        "deposit": bet1 * 2,
                        "ID": "3158724"
                    },
                    done:function(data){
                    }
                });
            }
        });
        $("#MikeTornRRDeposit2Button").click(function(){
            if(compInsteadOfVault){
                $.ajax({
                    url:"https://www.torn.com/companies.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "funds",
                        "deposit": bet2 * 2
                    },
                    done:function(data){
                    }
                });
            }
            else{
                $.ajax({
                    url:"https://www.torn.com/properties.php?" + $.param({rfcv:rfcv}),
                    type:"POST",
                    dataType:"text",
                    data:{
                        "step": "vaultProperty",
                        "deposit": bet2 * 2,
                        "ID": "3158724"
                    },
                    done:function(data){
                    }
                });
            }
        });
    }
    else if(window.location.href.includes("amarket.php")){
        var buyPrices = {"Paper Crown : Blue": 1400001, "Paper Crown : Green": 1400001, "Paper Crown : Yellow": 1400001, "Paper Crown : Red": 1400001, "String Vest": 1200001, "Sweatpants": 1200001, "Loaf of Bread": 1400001, "Pinstripe Suit Trousers": 1200001, "Classic Fedora": 1200001, "Sand": 1100001};
        setTimeout(function(){
            $(".items-list").children().each(function(){
                var name = $(this).children().first().children().eq(1).children().first().html();
                console.log(name);
                if(typeof name !== "undefined" && name in buyPrices){
                    var id = $(this).attr("id");
                    var buyPrice = buyPrices[name];
                    console.log(buyPrice);
                    $(this).children().eq(4).children().first().click(function(){
                        $.ajax({
                            url:"https://www.torn.com/amarket.php",
                            type:"POST",
                            dataType:"text",
                            data:{
                                step: "bidLot",
                                ID: id,
                                bid: buyPrice
                            },
                            done:function(data){
                            }
                        });
                    });
                }
            });
        }, 1000);
    }
    else if(window.location.href.includes("loader.php?sid=racing")){
        $("<div id='MikeTornRace' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's Race</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRaceMakeDocksButton'>Make Docks</button> <button type='button' id='MikeTornRaceJoinDocksButton'>Join Docks</button> <button type='button' id='MikeTornRaceMakeSpeedwayButton'>Make Speedway</button> <button type='button' id='MikeTornRaceJoinSpeedwayButton'>Join Speedway</button> <button type='button' id='MikeTornRaceMakeConvictButton'>Make Convict</button> <button type='button' id='MikeTornRaceJoinConvictButton'>Join Convict</button></p></div><hr class='page-head-delimiter m-top10'></div>").insertBefore("#racingMainContainer");
        $("#MikeTornRaceMakeDocksButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({sid:"racing"}),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    section: "createCustomRace",
                    tab: "customrace",
                    step: "create",
                    rfcv: "",
                    "fake-username": "",
                    "fake-password": "",
                    title: "MikePence's race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 10,
                    laps: 100,
                    carsAllowed: 5,
                    carsTypeAllowed: 1,
                    betAmount: 0,
                    waitTime: 1,
                    password: "",
                    createCustomRace: "START & JOIN THIS RACE"
                }),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRaceJoinDocksButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({
                    sid: "racing",
                    tab: "customrace",
                    section: "getInRace",
                    step: "getInRace",
                    id: "",
                    carID: 286779,
                    createRace: true,
                    title: "MikePence&#39;s race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 10,
                    laps: 100,
                    minClass: 5,
                    carsTypeAllowed: 1,
                    carsAllowed: 5,
                    betAmount: 0,
                    waitTime: 1
                }),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({}),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRaceMakeSpeedwayButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({sid:"racing"}),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    section: "createCustomRace",
                    tab: "customrace",
                    step: "create",
                    rfcv: "",
                    "fake-username": "",
                    "fake-password": "",
                    title: "MikePence's race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 21,
                    laps: 100,
                    carsAllowed: 5,
                    carsTypeAllowed: 1,
                    betAmount: 0,
                    waitTime: 1,
                    password: "",
                    createCustomRace: "START & JOIN THIS RACE"
                }),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRaceJoinSpeedwayButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({
                    sid: "racing",
                    tab: "customrace",
                    section: "getInRace",
                    step: "getInRace",
                    id: "",
                    carID: 556265,
                    createRace: true,
                    title: "MikePence&#39;s race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 21,
                    laps: 100,
                    minClass: 5,
                    carsTypeAllowed: 1,
                    carsAllowed: 5,
                    betAmount: 0,
                    waitTime: 1
                }),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({}),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRaceMakeConvictButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({sid:"racing"}),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({
                    section: "createCustomRace",
                    tab: "customrace",
                    step: "create",
                    rfcv: "",
                    "fake-username": "",
                    "fake-password": "",
                    title: "MikePence's race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 24,
                    laps: 100,
                    carsAllowed: 5,
                    carsTypeAllowed: 1,
                    betAmount: 0,
                    waitTime: 1,
                    password: "",
                    createCustomRace: "START & JOIN THIS RACE"
                }),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
        $("#MikeTornRaceJoinConvictButton").click(function(){
            $.ajax({
                url:"https://www.torn.com/loader.php?" + $.param({
                    sid: "racing",
                    tab: "customrace",
                    section: "getInRace",
                    step: "getInRace",
                    id: "",
                    carID: 556265,
                    createRace: true,
                    title: "MikePence&#39;s race",
                    minDrivers: 2,
                    maxDrivers: 2,
                    trackID: 24,
                    laps: 100,
                    minClass: 5,
                    carsTypeAllowed: 1,
                    carsAllowed: 5,
                    betAmount: 0,
                    waitTime: 1
                }),
                type:"POST",
                dataType:"json",
                data:JSON.stringify({}),
                contentType:"application/json",
                done:function(data){
                }
            });
        });
    }
});