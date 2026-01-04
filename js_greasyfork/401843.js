// ==UserScript==
// @name        Torn Redis Test 2
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     1.0
// @description Test
// @author      MikePence [2029670]
// @match       https://www.torn.com/factions.php?step=your*
// @match       https://www.torn.com/trade.php*
// @match       https://www.torn.com/stockexchange.php*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401843/Torn%20Redis%20Test%202.user.js
// @updateURL https://update.greasyfork.org/scripts/401843/Torn%20Redis%20Test%202.meta.js
// ==/UserScript==

var user = "MikePence [2029670]";
var delay = 0;
var stockKey = 2536448350;
var stockCost = 202;

$(document).ready(function(){
    if(window.location.href.indexOf("factions.php") > -1){
        $("<div id='MikeTornRedis' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's Redis Test</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRedisDepositCash' disabled>Deposit $1</button> <button type='button' id='MikeTornRedisWithdrawCash' disabled>Withdraw $1 at the next 10s</button></p><p><button type='button' id='MikeTornRedisDepositWeapon' disabled>Deposit weapon</button> <button type='button' id='MikeTornRedisWithdrawWeapon' disabled>Withdraw weapon at the next 10s</button> <button type='button' id='MikeTornRedisLoanWeapon' disabled>Loan weapon at the next 10s</button> <button type='button' id='MikeTornRedisRetrieveWeapon' disabled>Retrieve weapon</button></p><p><button type='button' id='MikeTornRedisPlanOC'>Plan OC at the next 10s</button> <button type='button' id='MikeTornRedisCancelOC'>Cancel OC</button></p></div><hr class='page-head-delimiter m-top10'></div>").insertBefore("#factions");
        $("#MikeTornRedisDepositCash").click(function(){
            $.post(
                "https://www.torn.com/factions.php",
                {
                    ajax: true,
                    step: "armouryDonate",
                    type: "cash",
                    amount: 1
                },
                function(data){
                    console.log(data);
                }
            );
        });
        $("#MikeTornRedisWithdrawCash").click(function(){
            var interval = setInterval(function(){
                if(new Date().getSeconds() % 10 == 0){
                    clearInterval(interval);
                    setTimeout(function(){
                        $.post(
                            "https://www.torn.com/factions.php",
                            {
                                step: "controlsGivemp",
                                action: "money",
                                user: user,
                                value: 1
                            },
                            function(data){
                                console.log(data);
                            }
                        );
                    }, delay);
                }
            }, 10);
        });
        $("#MikeTornRedisDepositWeapon").click(function(){
            $.post(
                "https://www.torn.com/factions.php",
                {
                    "items[0][amount]": 1,
                    "items[0][price]": 0,
                    "items[0][type]": "Primary",
                    "items[0][id]": 5488299018,
                    "items[0][itemID]": 241,
                    "items[0][estimatedPrice]": 9754,
                    step: "donateInventoryItems"
                },
                function(data){
                    console.log(data);
                }
            );
        });
        $("#MikeTornRedisWithdrawWeapon").click(function(){
            var interval = setInterval(function(){
                if(new Date().getSeconds() % 10 == 0){
                    clearInterval(interval);
                    setTimeout(function(){
                        $.post(
                            "https://www.torn.com/factions.php",
                            {
                                ajax: true,
                                step: "armouryActionItem",
                                role: "give",
                                item: 5488299018,
                                user: user,
                                quantity: 1
                            },
                            function(data){
                                console.log(data);
                            }
                        );
                    }, delay);
                }
            }, 10);
        });
        $("#MikeTornRedisLoanWeapon").click(function(){
            var interval = setInterval(function(){
                if(new Date().getSeconds() % 10 == 0){
                    clearInterval(interval);
                    setTimeout(function(){
                        $.post(
                            "https://www.torn.com/factions.php",
                            {
                                ajax: true,
                                step: "armouryActionItem",
                                role: "loan",
                                item: 5488299018,
                                user: user,
                                quantity: 1
                            },
                            function(data){
                                console.log(data);
                            }
                        );
                    }, delay);
                }
            }, 10);
        });
        $("#MikeTornRedisRetrieveWeapon").click(function(){
            $.post(
                "https://www.torn.com/factions.php",
                {
                    ajax: true,
                    step: "armouryActionItem",
                    role: "retrieve",
                    item: 5488299018,
                    user: user
                },
                function(data){
                    console.log(data);
                }
            );
        });
        $("#MikeTornRedisPlanOC").click(function(){
            var interval = setInterval(function(){
                if(new Date().getSeconds() % 10 == 0){
                    clearInterval(interval);
                    setTimeout(function(){
                        $.post(
                            "https://www.torn.com/factions.php",
                            {
                                step: "crimesPlane",
                                crimeID: 1,
                                "users[0]": 1271316,
                                "users[1]": 2029670
                            },
                            function(data){
                                console.log(data);
                            }
                        );
                    }, delay);
                }
            }, 10);
        });
        $("#MikeTornRedisCancelOC").click(function(){
            var crimeID = $(".crimes-list").children().first().children().eq(1).attr("data-crime");
            console.log(crimeID);
            $.post(
                "https://www.torn.com/factions.php",
                {
                    step: "crimesCancel",
                    ID: crimeID
                },
                function(data){
                    console.log(data);
                }
            );
        });
    }
    else if(window.location.href.indexOf("trade.php") > -1){
        setTimeout(function(){
            $("#trade-container").prepend("<div id='MikeTornRedis' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's Redis Test</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRedisStartTrade'>Start trade</button> <button type='button' id='MikeTornRedisAddTrade'>Add $1</button> <button type='button' id='MikeTornRedisWithdrawTrade'>Withdraw $1 at the next 10s</button> <button type='button' id='MikeTornRedisCancelTrade'>Cancel trade at the next 10s</button></p></div><hr class='page-head-delimiter m-top10'></div>");
            var tradeID = $(".current").children().first().children().eq(2).children().first().attr("href").split("ID=")[1];
            $("#MikeTornRedisStartTrade").click(function(){
                $.post(
                    "https://www.torn.com/trade.php",
                    {
                        step: "initiateTrade",
                        inserter: 949391914,
                        ajax: true,
                        userID: "pokey477 [1271316]",
                        description: "a"
                    },
                    function(data){
                        console.log(data);
                    }
                );
            });
            $("#MikeTornRedisAddTrade").click(function(){
                $.post(
                    "https://www.torn.com/trade.php",
                    {
                        step: "view",
                        ID: tradeID,
                        inserter: 257942693,
                        ajax: true,
                        amount: 1,
                        sub_step: "addmoney2"
                    },
                    function(data){
                        console.log(data);
                    }
                );
            });
            $("#MikeTornRedisWithdrawTrade").click(function(){
                var interval = setInterval(function(){
                    if(new Date().getSeconds() % 10 == 0){
                        clearInterval(interval);
                        setTimeout(function(){
                            $.post(
                                "https://www.torn.com/trade.php",
                                {
                                    step: "view",
                                    ID: tradeID,
                                    inserter: 257942693,
                                    ajax: true,
                                    amount: 0,
                                    sub_step: "addmoney2"
                                },
                                function(data){
                                    console.log(data);
                                }
                            );
                        }, delay);
                    }
                }, 10);
            });
            $("#MikeTornRedisCancelTrade").click(function(){
                var interval = setInterval(function(){
                    if(new Date().getSeconds() % 10 == 0){
                        clearInterval(interval);
                        setTimeout(function(){
                            $.post(
                                "https://www.torn.com/trade.php",
                                {
                                    step: "cancel2",
                                    ID: tradeID,
                                    ajax: true
                                },
                                function(data){
                                    console.log(data);
                                }
                            );
                        }, delay);
                    }
                }, 10);
            });
        }, 1000);
    }
    else if(window.location.href.indexOf("stockexchange.php") > -1){
        $(".stock-main-wrap").prepend("<div id='MikeTornRedis' class='m-top10'><div class='title-gray top-round' role='heading'>MikePence's Redis Test</div><div class='bottom-round cont-gray p10'><p><button type='button' id='MikeTornRedisSellStock'>Sell stock</button> <button type='button' id='MikeTornRedisBuyStock'>Buy stock at the next 10s</button></p></div><hr class='page-head-delimiter m-top10'></div>");
        var stockID = $("li.item-wrap[data-stock='elbt']").attr("id");
        $("#MikeTornRedisSellStock").click(function(){
            $.post(
                "https://www.torn.com/stockexchange.php?" + $.param({
                    ajax: true,
                    step: "sell",
                    ID: stockID
                }),
                {},
                function(data){
                    console.log(data);
                }
            );
        });
        $("#MikeTornRedisBuyStock").click(function(){
            var interval = setInterval(function(){
                if(new Date().getSeconds() % 10 == 0){
                    clearInterval(interval);
                    setTimeout(function(){
                        $.post(
                            "https://www.torn.com/stockexchange.php?" + $.param({
                                ajax: true,
                                key: stockKey,
                                step: "buy2",
                                ID: 21,
                                shares: 1,
                                cost: stockCost,
                                portfolio: true
                            }),
                            {},
                            function(data){
                                console.log(data);
                            }
                        );
                    }, delay);
                }
            }, 10);
        });
    }
});