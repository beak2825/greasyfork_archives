/*jshint esversion: 10 */
/* globals OLCore */

// ==UserScript==
// @name           onlineliga Helper
// @name:de        onlineliga Helper
// @namespace      https://greasyfork.org/en/users/714990
// @version        0.26
// @license        LGPLv3
// @description    Make onlineliga.de data more visible
// @description:de onlineliga Daten sichtbarer machen
// @author         Tai Kahar
// @match          https://www.onlineliga.de/
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_info
// @grant          GM_addStyle
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @downloadURL https://update.greasyfork.org/scripts/425692/onlineliga%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/425692/onlineliga%20Helper.meta.js
// ==/UserScript==

/*********************************************
 * 0.13 better eventlistener
 * 0.14 added percents of academy, staff and scouts
 * 0.15 mobile support
 * 0.16 added: correct birhtday on player details
 * 0.17 added: budget overview for dispo and bank balance on top navigation
        bugfix: real birthdate when original = 1 (=> 44)
 * 0.18 show birthdate on transfer offerings
 * 0.19 bugix: negative values in numbers
 * 0.20 bugix: don't show birthdate on to many items
 * 0.21 compatibility with onlineliga liveticker (don't show balance)
 * 0.22 added: Assits for transfer list offer
 * 0.23 bugfix: repeating birthdate on transfer offer
        added: Overallstats on transfer offer
 * 0.24 added: Overall card stats on transfer offer
 * 0.25 added: Season card stats on transfer offer
 * 0.26 added compatibility with Toolbox (Knut Edelbert)
 *********************************************/

(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;
    var budgetLoaded = false;

    function whichTransitionAnimationEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'WebkitTransition' :'webkitTransitionEnd',
            'MozTransition'    :'transitionend',
            'MSTransition'     :'msTransitionEnd',
            'OTransition'      :'oTransitionEnd',
            'transition'       :'transitionEnd',
            'animation'        :'animationEnd',
            'WebkitAnimation'  :'webkitAnimationEnd',
            'oAnimation'       :'oAnimationEnd',
            'MSAnimation'      :'MSAnimationEnd',
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    Object.defineProperty(String.prototype, "convertNumber", {
        value: function convertNumber(isOnlyNumber = false, canBeNegative = true) {
            if(isOnlyNumber){
                if(canBeNegative){
                    return this.replace(/[^0-9-]/g, '');
                }
                return this.replace(/[^0-9]/g, '');
            }

            if(canBeNegative){
                return this.replace(/[^0-9.,-]/g, '');
            }

            return this.replace(/[^0-9.,]/g, '');
        },
        writable: true,
        configurable: true
    });

    function getRealBirthdate(oldBirthdate){
        if(oldBirthdate == 1){
            return 44;
        }
        return oldBirthdate - 1;
    }

    function correctYouthEfficiency()
    {
        $("#progressBar").one(whichTransitionAnimationEvent(), function(){
            var academyPercent = Math.floor(parseFloat($("#progressBarYouthAcademy").attr("style").convertNumber()) * 100) / 100;
            var staffPercent = Math.floor(parseFloat($("#progressBarStaff").attr("style").convertNumber()) * 100) / 100;
            var scoutingPercent = Math.floor(parseFloat($("#progressBarScouting").attr("style").convertNumber()) * 100) / 100;

            $("#progressBarValue span:first-child").html(Math.floor(parseFloat($(".ol-progressbar-large").attr("data-value")) * 100) / 100 + "%");
            $("#progressBarYouthAcademy").attr("title",academyPercent + "%");
            $("#progressBarYouthAcademy").append("<span style='top: 4px;'>" + academyPercent + "% </span>");
            $("#progressBarStaff").attr("title",staffPercent + "%");
            $("#progressBarStaff").append("<span style='top: 4px;'>" + staffPercent + "% </span>");
            $("#progressBarScouting").attr("title",scoutingPercent + "%");
            $("#progressBarScouting").append("<span style='top: 4px;'>" + scoutingPercent + "% </span>");
        });
    }

    function correctBirthDate()
    {
        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().css("display","none");
        var oldBirthdate = parseInt($(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().text().convertNumber());

        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().html("Woche " + getRealBirthdate(oldBirthdate) + " vorher: " + oldBirthdate);
        $(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().css("display","block");
    }

    function showPlayerSpecificDataOnTrades()
    {
        var playerId = $("#playerView #playerViewContent .player-view-head .player-steckbrief").attr("onclick").convertNumber(true);
        if(playerId)
        {
            $.get("https://www.onlineliga.de/player/overview?playerId=" + playerId,function(data){
                if(data){
                    var oldBirthdate = parseInt($(data).find(".playeroverviewtablestriped div:nth-child(5) div:nth-child(2) div:nth-child(2)").first().text().convertNumber());
                    var field = $(".player-view-detail div.row:nth-child(1) div.player-attr-unit").first();
                    var fieldMobile = $(".player-view-detail div.player-attr-unit").eq(6);
                    field.html(field.html() + "<div style='font-size:10pt'>Woche: " + getRealBirthdate(oldBirthdate) + "</div>");
                    fieldMobile.html(fieldMobile.html() + "<div style='font-size:10pt'>Woche: " + getRealBirthdate(oldBirthdate) + "</div>");

                    var overAllStats = $(data).find(".player-info-stats-mobile div.col-xs-4").first().text().replace(/ /g,'').trim();
                    var fieldStats = $(".player-view-detail div.row:nth-child(1) div.player-attr").eq(1).parent();
                    var fieldSmall = $(".player-view-detail div.player-attr").eq(6).parent();
                    var fieldMobileStats = $(".hidden-xs div.player-attr").eq(5).parent();

                    fieldStats.prepend("<span style='font-size:10pt;'>" + overAllStats + "</span>");
                    fieldSmall.prepend("<span style='font-size:10pt;'>" + overAllStats + "</span>");
                    fieldMobileStats.prepend("<span style='font-size:10pt;'>" + overAllStats + "</span>");


                    var cardsAllStats = $(data).find(".player-info-stats-mobile div.col-xs-3").first().text().replace(/ /g,'').trim();
                    var fieldCardStats = $(".player-view-detail div.row:nth-child(1) div.player-attr").eq(2);
                    var fieldSmallCardStats = $(".player-view-detail div.player-attr").eq(9);
                    var fieldMobileCardStats = $(".hidden-xs div.player-attr").eq(6);
                    var fielInfoCardStats = $(".player-view-detail div.row:nth-child(1) div.player-attr-unit").eq(2);
                    var fieldInfoMobileCardStats = $(".player-view-detail div.player-attr-unit").eq(13);
                    var fieldInfoSmall = $(".player-view-detail div.player-attr-unit").eq(10);

                    //Seasoncards
                    var cardData = $(data).find(".player-cards-this-season span");
                    var yellow = 0;
                    var yellowRed = 0;
                    var red = 0;
                    for(var i = 0; i < cardData.length; i=i+2)
                    {
                        if(cardData.eq(i).hasClass("icon-lineup_icon_yellow")){
                            yellow = cardData.eq(i+1).html().convertNumber(true);
                        }
                        else if(cardData.eq(i).hasClass("icon-lineup_icon_yellowred")){
                            yellowRed = cardData.eq(i+1).html().convertNumber(true);
                        }
                        else if(cardData.eq(i).hasClass("icon-lineup_icon_red")){
                            red = cardData.eq(i+1).html().convertNumber(true);
                        }
                    }

                    fielInfoCardStats.html("(G/GR/R)");
                    fieldInfoMobileCardStats.html("(G/GR/R)");
                    fieldInfoSmall.html("(G/GR/R)");
                    fieldCardStats.html(yellow + "/" + yellowRed + "/" + red);
                    fieldSmallCardStats.html(yellow + "/" + yellowRed + "/" + red);
                    fieldMobileCardStats.html(yellow + "/" + yellowRed + "/" + red);
                    //Allcards
                    fieldCardStats.parent().prepend("<span style='font-size:10pt;'>" + cardsAllStats + "</span>");
                    fieldSmallCardStats.parent().prepend("<span style='font-size:10pt;'>" + cardsAllStats + "</span>");
                    fieldMobileCardStats.parent().prepend("<span style='font-size:10pt;'>" + cardsAllStats + "</span>");
                }
            });
        }
    }

    function showAssistsOnTrades()
    {

        var playerId = $("#playerView #playerViewContent .player-view-head .player-steckbrief").attr("onclick").convertNumber(true);
        var userId = $('#transferListContent .ol-user-name').attr("onclick");
        var teamLink = "https://www.onlineliga.de/team/overview/squad?userId=";
        if(userId && playerId)
        {
         userId = userId.convertNumber(true);
         $.get(teamLink + userId, function(data){
             if(data){
                 var contentAdd = $(data).find("span[onclick*='"+playerId+"']").first().parent().parent().parent().children().eq(4).html();
                 var field = $(".player-view-detail div.row:nth-child(1) div.player-attr").eq(1);
                 var infoField = $(".player-view-detail div.row:nth-child(1) div.player-attr-unit").eq(1);
                 var fieldMobile = $(".hidden-xs div.player-attr").eq(5);
                 var infoFieldMobile = $(".hidden-xs div.player-attr-unit").eq(6);
                 var fieldSmall = $(".player-view-detail div.player-attr").eq(6);
                 var infoFieldSmall = $(".player-view-detail div.player-attr-unit").eq(7);

                 field.html(contentAdd);
                 fieldMobile.html(contentAdd);
                 fieldSmall.html(contentAdd);

                 infoField.html(infoField.html().trim() + "/Vorl.");
                 infoFieldMobile.html(infoFieldMobile.html().trim() + "/Vorl.");
                 infoFieldSmall.html(infoFieldSmall.html().trim() + "/Vorl.");

                 infoField.css("font-size","10pt");
                 infoFieldMobile.css("font-size","10pt");
                 infoFieldSmall.css("font-size","10pt");
             }
         });
        }
    }

    function showTradeDetails()
    {
        showAssistsOnTrades();
        showPlayerSpecificDataOnTrades();
    }

    function budgetOverview()
    {
        if(!budgetLoaded){
            $.get("https://www.onlineliga.de/office/finance",function(data){
                var financeData = $(data).find(".finance-account-overview-box .row div div:nth-child(1)");
                var bankBalance = financeData.eq(0).text().convertNumber();
                var dispo = financeData.eq(1).text().convertNumber(false, false);
                var allBalance = $(".ol-nav-liquid-funds").html();

                var liquidFundsElement = $(".ol-nav-liquid-funds").first();
                if(liquidFundsElement.text() != "XXX.XXX"){
                    $(".ol-nav-liquid-funds").html("<div style='font-size: 10pt;top:-18px;position:relative;margin-bottom:-20px;color:grey;'>Konto " + bankBalance + "€ | Dispo " + dispo + "€</div>" + allBalance);
                }
            });
            budgetLoaded = true;
        }
    }

    function init(){
        OLCore.waitForKeyElements (
            "div#youthPlayerHeader",
            correctYouthEfficiency
        );
        OLCore.waitForKeyElements(
            ".playeroverviewtablestriped",
            correctBirthDate
        );

        OLCore.waitForKeyElements(
            ".ol-player-budget",
            budgetOverview
        );
        OLCore.waitForKeyElements(
            "div#playerViewContent",
            showTradeDetails
        );
    }

    if (!window.OLToolboxActivated) {
       init();
    } else {
        window.OnlineligaHelper = {
            init : init
        };
    }

})();