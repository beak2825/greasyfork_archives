// ==UserScript==
// @name         Automatic Missions Handler (for hentaiheroes.com)
// @namespace    https://greasyfork.org/fr/scripts/424552
// @version      1.1
// @description  3 functions: missionHandlerBackground, missionHandlerGUI, displayMissionsId
// @author       ManJizz
// @match        https://www.hentaiheroes.com/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.js

// missionHandlerBackground:
//      It checks for missions to start and rewards to claimon on a regular basis by sending POST requests to the server (even if the mission section is not displayed).
//      Use the function displayMissionsId to get your missions.

// missionHandlerGUI:
//      It checks for missions to start and rewards to claimon on a regular basis by sending POST requests to the server.
//      It's only triggered if the harem section is open
//      This function doesn't need the ids of your mission. It finds them himself in the panel.

// displayMissionsId:
//      It displays the missions' id on the browser console.
//      The mission panel has to be open.

// The functions don't refresh the page so you will still see the progress bar after the checks.
// Both funtions use JQuery and Notify.js, which is a JQuery plugin for the notifications
// The script has been made for https://www.hentaiheroes.com/

// @downloadURL https://update.greasyfork.org/scripts/424552/Automatic%20Missions%20Handler%20%28for%20hentaiheroescom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424552/Automatic%20Missions%20Handler%20%28for%20hentaiheroescom%29.meta.js
// ==/UserScript==
jQuery(function($) {
    // Options for the notification
    var notifOpts = {
        autoHideDelay: 5000,
        showAnimation: "fadeIn",
        hideAnimation: "fadeOut",
        className: 'info',
    };

    // Mission handler that runs even if the mission panel is closed
    function missionHandlerBackground(){
        /**
        * missionIds => Object to be filled with the key/value pair
        * key: id_member_mission / value: id_mission
        * use the function displayMissionsId to get your missions' id and paste the result here
        **/
        var missionIds = { "935091121" : "915", "935091123" : "24", "935091124" : "5", "935091125" : "710", "935091126" : "185", "935091127" : "13", "935091128" : "10", "935091129" : "31", "935091130" : "813", "935091131" : "37", "935091132" : "190", "935091133" : "828" };
        var promises = [];
        var missionStarted = "";
        var rewardClaimed = "";

        // First, we check if there is any mission to start
        $.each(missionIds, function(index, value) {
            var dfd = new $.Deferred();
            // Post request to query the server
            $.post('ajax.php', { class: "Missions", action : "start_mission", id_mission : value , id_member_mission: index }, function(response){
                var data = JSON.parse(JSON.stringify(response));
                if(data.success === true){
                    missionStarted = value;
                }
            }).done(function() {
                dfd.resolve();
            }).fail(function() {
                console.log('failed');
            });
            promises.push(dfd);
        });

        // If not, we check there is any reward to claim
        if (missionStarted.length == 0){
            $.each(missionIds, function(index, value) {
                var dfd = new $.Deferred();
                // Post request to query the server
                $.post('ajax.php', { class: "Missions", action : "claim_reward", id_mission : value , id_member_mission: index }, function(response){
                    var data = JSON.parse(JSON.stringify(response));
                    if(data.success === true){
                        rewardClaimed = value;
                    }
                }).done(function() {
                    dfd.resolve();
                }).fail(function() {
                    console.log('failed');
                });
                promises.push(dfd);
            });
        }

        // All post requests are treated => report
        $.when.apply($, promises).done(function () {
            // The start_mission request returns true when the mission is ongoing so we check the reward first
            if(rewardClaimed.length > 0){
                $.notify('Reward for mission n°' + rewardClaimed + ' has been claimed', notifOpts);
                console.log('Reward for mission n°' + rewardClaimed + ' has been claimed');
            } else {
                // If there is no reward to claim, we check if a mission has been started
                $.notify('No reward to claim', notifOpts);
                console.log('No reward to claim');
            }

            // If there is no reward to claim, we check if a mission has been started
            if(missionStarted.length > 0) {
                $.notify('Mission n°' + missionStarted + ' has been started', notifOpts);
                console.log('Mission n°' + missionStarted + ' has been started');
            } else {
                $.notify('No mission to start', notifOpts);
                console.log('No mission to start');

            }
        });
    }

    // Mission handler that runs only when the mission panel is open
    function missionHandlerGUI(){
        var divMissions = $('#hh_game').contents().find('body div#contains_all.fixed_scaled div#activities div#missions div.missions_wrap div.mission_object');
        var arrayMissions = [];
        if(divMissions.length > 0){
            var missionStarted = "";
            var rewardClaimed = "";
            $.each(divMissions, function() {
                var arrayData = JSON.parse($(this).attr("data-d"));
                arrayMissions.push(arrayData);
            });

            $.each(arrayMissions, function() {
                var dfd = new $.Deferred();
                var mission = $(this).get(0);
                // Post request to query the server
                $.post('ajax.php', { class: "Missions", action : "start_mission", id_mission : mission.id_mission , id_member_mission: mission.id_member_mission }, function(response){
                    var data = JSON.parse(JSON.stringify(response));
                    if(data.success === true){
                        missionStarted = mission.id_mission;
                    }
                }).fail(function() {
                    console.log('failed');
                });
            });

            if (missionStarted.length == 0){
                $.each(arrayMissions, function(index, value) {
                    var dfd = new $.Deferred();
                    var mission = $(this).get(0);
                    // Post request to query the server
                    $.post('ajax.php', { class: "Missions", action : "claim_reward",id_mission : mission.id_mission , id_member_mission: mission.id_member_mission }, function(response){
                        var data = JSON.parse(JSON.stringify(response));
                        if(data.success === true){
                            rewardClaimed = value;
                        }
                    }).fail(function() {
                        console.log('failed');
                    });
                });
             }

            // The start_mission request returns true when the mission is ongoing so we check the reward first
            if(rewardClaimed.length > 0){
                $.notify('Reward for mission n°' + rewardClaimed + ' has been claimed', notifOpts);
                console.log('Reward for mission n°' + rewardClaimed + ' has been claimed');
            } else {
                // If there is no reward to claim, we check if a mission has been started
                $.notify('No reward to claim', notifOpts);
                console.log('No reward to claim');
            }

            // If there is no reward to claim, we check if a mission has been started
            if(missionStarted.length > 0) {
                $.notify('Mission n°' + missionStarted + ' has been started', notifOpts);
                console.log('Mission n°' + missionStarted + ' has been started');
            } else {
                $.notify('No mission to start', notifOpts);
                console.log('No mission to start');
            }
        } else {
            $.notify('The missions panel is not open.', notifOpts);
            console.log('The missions panel is not open.');
        }
    }


    // Print all the missions' id in the panel
    function displayMissionsId(){
        var divMissions = $('#hh_game').contents().find('body div#contains_all.fixed_scaled div#activities div#missions div.missions_wrap div.mission_object');
        var arrayMissions = [];
        var missionId = [];
        var jsonString = "{ ";
        if(divMissions.length > 0){
            divMissions.each(function() {
                var arrayData = JSON.parse($(this).attr("data-d"));
                arrayMissions.push(arrayData);
            });

            $.each(arrayMissions,function(index) {
                var isLastElement = index == arrayMissions.length -1;
                if (isLastElement) {
                    jsonString = jsonString.concat("\"" + $(this).get(0).id_member_mission + "\"" + ' : ' + "\"" + $(this).get(0).id_mission + "\"");
                } else {
                    jsonString = jsonString.concat("\"" + $(this).get(0).id_member_mission + "\"" + ' : ' + "\"" + $(this).get(0).id_mission + "\"").concat(', ');
                }
            });
            jsonString = jsonString.concat(' }');
            console.log(jsonString);
            /* $.each(JSON.parse(jsonString), function(key, value){
                console.log(key + " - " + value);
                $.notify(key + " - " + value, notifOpts);
            });*/
        } else {
            console.log("Can't get the missions id");
            $.notify("Can't get the missions id", notifOpts);
        }
    }


    // 1 s = 1000 ms / 1 min = 60000 ms
    var interval = 180000;

    /** First call **/
    missionHandlerBackground();
    //missionHandlerGUI();
    //displayMissionsId();

    /** Interval: duration between each request **/
    window.setInterval(missionHandlerBackground,interval);
    //window.setInterval(missionHandlerGUI,interval);
    //window.setInterval(displayMissionsId,interval);
});
