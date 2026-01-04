// ==UserScript==
// @name        Torn Poker
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     1.0
// @description Make poker great again
// @author      MikePence [2029670]
// @match       https://www.torn.com/*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @connect     mpsse.epizy.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/397114/Torn%20Poker.user.js
// @updateURL https://update.greasyfork.org/scripts/397114/Torn%20Poker.meta.js
// ==/UserScript==

// Code
$(document).ready(function(){
    if(window.location.href.includes("holdem")){
        pokerStart();
        function pokerStart(){
            var panelWrap = $("#tableWrap").parent().children().eq(1);
            if(panelWrap.children().first().children().eq(2).children().length == 0 || panelWrap.children().first().children().eq(2).children().first().children().length == 2){
                setTimeout(function () {
                    pokerStart();
                }, 1000);
                return;
            }
            $("<div id='MikeTornPoker' class='m-top10'><div class='title-gray top-round' role='heading'>Torn Poker</div><div class='bottom-round cont-gray p10'><p id='MikeTornPokerBody'>Waiting...</p></div></div>").insertAfter("#react-root");
            var observerConfig = {attributes: true, childList: false, subtree: false};
            var observer = new MutationObserver(pokerDelayFunction);
            var myCards = panelWrap.children().first().children().eq(2).children().first().children().eq(1).children().first().children();
            var aMyCardFront = myCards.first().children().first().children().first().children().first();
            var myCardsJS = document.getElementsByClassName(aMyCardFront.attr("class").split(/\s+/)[0]);
            for (var i = 0; i < myCardsJS.length; i++) {
                observer.observe(myCardsJS[i], observerConfig);
            }
            var table = $("#table");
            var communityCards = table.children().first().children().first().children().first().children();
            var aCommunityCardFront = communityCards.first().children().first().children().first().children().first().children().first();
            var communityCardsJS = document.getElementsByClassName(aCommunityCardFront.attr("class").split(/\s+/)[0]);
            for (i = 0; i < communityCardsJS.length; i++) {
                observer.observe(communityCardsJS[i], observerConfig);
            }
            var lastUpdate = 0;
            function pokerDelayFunction(){
                lastUpdate++;
                var checkLastUpdate = lastUpdate;
                setTimeout(function(){
                    if(checkLastUpdate == lastUpdate){
                        pokerFunction();
                    }
                }, 2000);
            }
            function pokerFunction(){
                console.log("change");
                var myCardsText = [];
                var communityCardsText = [];
                myCards.each(function(){
                    var cardFront = $(this).children().first().children().first().children().first();
                    var cardClasses = cardFront.attr("class").split(/\s+/);
                    if(cardClasses[1].includes("back")){
                        return;
                    }
                    var cardText = cardClasses[2].split("___")[0];
                    myCardsText.push(cardText);
                });
                console.log("my " + myCardsText);
                communityCards.each(function(){
                    var cardFront = $(this).children().first().children().first().children().first().children().first();
                    var cardClasses = cardFront.attr("class").split(/\s+/);
                    if(cardClasses[1].includes("back")){
                        return;
                    }
                    var cardText = cardClasses[2].split("___")[0];
                    communityCardsText.push(cardText);
                });
                console.log("comm " + communityCardsText);
                if(myCardsText.length == 2){
                    var url = "http://mpsse.epizy.com/poker.php?";
                    for(var i = 1; i <= 2; i++){
                        if(i != 1){
                            url += "&";
                        }
                        url += "my_card_" + i + "=" + myCardsText[i - 1];
                    }
                    for(i = 1; i <= 5; i++){
                        url += "&community_card_" + i + "=";
                        if(i > communityCardsText.length){
                        }
                        else{
                            url += communityCardsText[i - 1];
                        }
                    }
                    console.log("sending " + url);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onreadystatechange: function(res){
                            if (res.readyState > 3 && res.status === 200) {
                                $("#MikeTornPokerBody").html(res.response);
                                console.log(res.response);
                            }
                        },
                        onerror: function(err){
                            $("#MikeTornPokerBody").html(err);
                            console.log(err);
                        }
                    });
                }
            }
        }
    }
});

function intAbbreviation(value){
    var valueLength = value.toString().length;
    if(valueLength > 9){
        return Math.round(value / 1000000000 * 100) / 100 + "b";
    }
    else if(valueLength > 6){
        return Math.round(value / 1000000 * 100) / 100 + "m";
    }
    else if(valueLength > 3){
        return Math.round(value / 1000 * 100) / 100 + "k";
    }
    else{
        return value;
    }
}

function timeDifferenceSOrM(current, previous){
    var difference = current - previous;
    if(difference < 1000){
        return "0s";
    }
    if(difference < 60000){
        return Math.floor(difference / 1000) + "s";
    }
    return Math.floor(difference / 60000) + "m";
}

function timeDifferenceSAndM(current, previous){
    var difference = current - previous;
    if(difference < 1000){
        return "<span style='color:red'>0s</span>";
    }
    if(difference < 60000){
        return "<span style='color:red'>" + Math.floor(difference / 1000) + "s</span>";
    }
    var mins = Math.floor(difference / 60000);
    var secs = Math.floor((difference - mins * 60000) / 1000);
    return mins + "m " + secs + "s";
}

function timeDifferenceSubS(current, previous){
    var difference = current - previous;
    return (difference / 1000).toFixed(2) + "s";
}