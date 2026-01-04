// ==UserScript==
// @name         New Battles
// @namespace    https://greasyfork.org/bg/users/2402-n-tsvetkov
// @version      0.5
// @description  Shows starting ground erepublik battles
// @author       You
// @include      https://www.erepublik.com/*/economy/advanced-buildings
// @include      https://www.erepublik.com/*/main/city/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/392116/New%20Battles.user.js
// @updateURL https://update.greasyfork.org/scripts/392116/New%20Battles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    var startTime = 3*60; // 3 minutes
    var endTime = 87*60; // 87 minutes
    var milestone1 = 90*60 // 90 minutes
    var milestone2 = 120*60 // 120 imnutes

    function style(t) {
        $("head").append("<style>" + t + "</style>");
    }

    $(function() {
        style("#resultsDiv {z-index: 99999; position: fixed; left: 45%; top: 0; border: 1px solid red; background-color: #ffffff; padding: 10px;}");
        style(".started{color:red}");
        style(".ending{color:navy}");
        //$("body").html("");
        $("body").append("<div id='resultsDiv'></div>");
        startRefresh();
        updateSecs();
    });

    function startRefresh() {

        setTimeout(startRefresh,1000*20);
        getData();
    }

    function updateSecs() {
        setTimeout(updateSecs,1000);
        $(".seconds").each(function(a, b){
            var val = parseInt($(b).html());
            val--;
            $(b).html(val);
        });
    }

    function getData() {

        var url = '/en/military/campaigns-new';
        $.getJSON(url, function (resObj) {

            var requestTime = resObj.time;

            var allBattles = resObj.battles;
            var allCountries = resObj.countries;
            //var allCountries = [];

            var xx = [];
            for (var key in allBattles) {
                xx.push(allBattles[key]);
                // alert('key: ' + key + '\n' + 'value: ' + allBattles[key]);
            }

            /*for (var key in allCountriesRaw) {
                    allCountries.push(allCountriesRaw[key]);
                }
				debugger
				*/

            //var x = $(allBattles).each(function (idx, item) {

            //});

            var newBattles = $(xx).filter(function (idx) {
                var item = xx[idx];
                var isGround = item.type == 'tanks';
                if ((item.start >= requestTime || (item.start + startTime) >= requestTime || (requestTime - item.start) >= endTime) && isGround) {
                    return xx[idx];
                }
            });


            newBattles.sort(function (a, b) {
                return (a.start - requestTime) - (b.start - requestTime);
            });

            $("#resultsDiv").html("");

            $('#resultsDiv').append('update in: <span class="seconds">' + 20 + '</span>');
            $('#resultsDiv').append('<span>s</span>');
            $('#resultsDiv').append('<br/>');
            $('#resultsDiv').append('<br/>');

            var x = newBattles.each(function (idx, item) {

                var battleID = item.id;
                var regionName = item.region.name;
                var attackerID = item.inv.id;
                var defenderID = item.def.id;

                //var attackerName = "BG";
                //var defenderName = "Ru";
                var attackerName = allCountries[attackerID].name;
                var defenderName = allCountries[defenderID].name;

                var timeLeftSec = newBattles[idx].start - requestTime;
                var started = 0;
                if (/advanced-buildings/.test(location.href) && timeLeftSec > (startTime * -1)) {
                    started = timeLeftSec < 0 ? ((timeLeftSec * -1) > endTime) ? ' class="ending"' : ' class="started"' : '';
                    $('#resultsDiv').append('<div id="newBattle'+ idx + '"' + started + '></div>');
                    $('#newBattle'+ idx).append('<span>   ' + attackerName + '</span>');
                    $('#newBattle'+ idx).append('<span>   ' + defenderName + ' </span>');
                    $('#newBattle'+ idx).append('<a href="https://www.erepublik.com/en/military/battlefield/' + battleID + '" target=blank>' + regionName + '</a>');
                    $('#newBattle'+ idx).append('<span>   </span>');
                    $('#newBattle'+ idx).append('<span class="seconds">' + timeLeftSec + '</span>');
                    $('#newBattle'+ idx).append('<span>s</span>');
                    $('#newBattle'+ idx).append('<br/>');
                } else if (/city/.test(location.href) && timeLeftSec < (endTime * -1)) {
                    started = (timeLeftSec * -1) > milestone1 ? ' class="ending"' : ' class="started"';
                    $('#resultsDiv').append('<div id="newBattle'+ idx + '"' + started + '></div>');
                    $('#newBattle'+ idx).append('<span>   ' + attackerName + '</span>');
                    $('#newBattle'+ idx).append('<span>   ' + defenderName + ' </span>');
                    $('#newBattle'+ idx).append('<a href="https://www.erepublik.com/en/military/battlefield/' + battleID + '" target=blank>' + regionName + '</a>');
                    $('#newBattle'+ idx).append('<span>   </span>');
                    $('#newBattle'+ idx).append('<span class="seconds">' + timeLeftSec + '</span>');
                    $('#newBattle'+ idx).append('<span>s</span>');
                    $('#newBattle'+ idx).append('<br/>');
                }
            });

            // $("#resultsDiv").html("aaaa");

            //     alert(requestTime);
        });
    }
})();