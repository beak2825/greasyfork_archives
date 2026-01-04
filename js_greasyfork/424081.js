// ==UserScript==
// @name         Automatic Money Collector (for hentaiheroes.com)
// @namespace    https://greasyfork.org/fr/scripts/424081
// @version      1.3
// @description  3 functions: getMoneyBackground, getMoneyGUI, displayGirlsId
// @author       ManJizz
// @match        https://www.hentaiheroes.com/
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.js

// getMoneyBackground:
//      It collects money on a regular basis by sending POST requests to the server (even if the harem section is not displayed).
//      You will need to find the ids of the girls you own in order to put them into the array allGirlsId.
//      Here is a selector to find your girls' id:
//      $('#hh_game').contents().find('body div#contains_all.fixed_scaled div#harem_whole div.global-container div#harem_left div.girls_list div[id_girl] div[class=""]')
//      You can run it with Tampermonkey or on your browser console (F12 => Console).
//      You can also use the function displayGirlsId.

// getMoneyGUI:
//      It collects money on a regular basis by sending POST requests to the server.
//      It's only triggered if the harem section is open.
//      This function doesn't need the ids of your girls. It finds them itself.

// displayGirlsId:
//      It displays the girls' id.
//      The harem section has to be open.

// The functions don't refresh the page so you will still see the progress bar after the collect.
// Both funtions use JQuery and Notify.js, which is a JQuery plugin for the notifications
// The script has been made for https://www.hentaiheroes.com/

// @downloadURL https://update.greasyfork.org/scripts/424081/Automatic%20Money%20Collector%20%28for%20hentaiheroescom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424081/Automatic%20Money%20Collector%20%28for%20hentaiheroescom%29.meta.js
// ==/UserScript==
jQuery(function($) {
    var notifOpts = {
        autoHideDelay: 5000,
        showAnimation: "fadeIn",
        hideAnimation: "fadeOut",
        className: 'info',
    };

    function getMoneyBackground(){
        /** allGirlsId => array to fill with the ids of your girls **/
        var allGirlsId = [1,4,5,7,10,15,12,14,7914892,13,11];
        var textAlert = 'Collect money from ';
        var nbGirls = [];
        var girls = '/ ';
        var promises = [];

        // For each girl id in allGirlsId
        $.each(allGirlsId, function(index, value) {
            var dfd = new $.Deferred();
            // Post request to query the server
            $.post('ajax.php', { class: "Girl", id_girl : value, action : "get_salary"}, function(response){
                var data = JSON.parse(JSON.stringify(response));
                if(data.success === true){
                    nbGirls.push(value);
                    girls = girls.concat(value.toString()).concat(' / ');
                }
            }).done(function() {
                dfd.resolve();
            }).fail(function() {
                console.log('failed');
            });
            promises.push(dfd);
        });

        // All post requests are treated => report
        $.when.apply($, promises).done(function () {
            if(nbGirls.length > 0){
                // If any money has been collected
                textAlert = textAlert.concat(nbGirls.length).concat(' girl(s): ').concat(girls);
                console.log(textAlert);
            } else {
                // If no money has been collected
                textAlert = 'No money to collect';
                console.log(textAlert);
            }
            $.notify(textAlert, notifOpts);
        });
    }

    function getMoneyGUI(){
        var allGirlsId = [];
        var textAlert;
        // Selectors to reach the div
        var divGirlsList = $('#hh_game').contents().find('body div#contains_all.fixed_scaled div#harem_whole div.global-container div#harem_left div.girls_list')
        if(divGirlsList.is(":visible")){
            var divIdGirl = divGirlsList.find('div[id_girl]');
            $(divIdGirl).each(function() {
                if($(this).contents().find('button.collect_money').is(":visible")){
                    // All ids are pushed into allGirlsId
                    allGirlsId.push($(this).attr("id_girl"));
                }
            });

            if(allGirlsId.length > 0){
                // If any id has been found
                textAlert = 'Money collected for girl(s):  ';
                $.each(allGirlsId, function(index, value) {
                    $.post('ajax.php', { class: "Girl", id_girl : value, action : "get_salary"}, function(response){
                        var data = JSON.parse(JSON.stringify(response));
                        console.log('Post request returned: ' + data.success + ' for girl n°' + value.toString());
                    }).fail(function() {
                        console.log('failed');
                    });
                    textAlert = textAlert.concat(value.toString());
                    textAlert = textAlert.concat(' / ');
                });
                console.log(textAlert);
                $.notify(textAlert, notifOpts);
            } else {
                // If no id has been found
                textAlert = 'No money to collect.';
                console.log(textAlert);
                $.notify(textAlert, notifOpts);
            }
            console.log('Money collected for : ' + allGirlsId.length + ' girl(s).');
        } else {
            // Notification when the harem is closed
            textAlert = 'Harem iframe is hidden.';
            console.log(textAlert);
            $.notify(textAlert, notifOpts);
        }
    }

    function displayGirlsId(){
        var allGirlsId = [];
        var textAlert = "";
        var idGirls = $('#hh_game').contents().find('body div#contains_all.fixed_scaled div#harem_whole div.global-container div#harem_left div.girls_list div[id_girl]');
        idGirls.find('div[class=""]').add(idGirls.find('div[class="opened"]')).each(function() {
            allGirlsId.push($(this).attr("girl"));
            textAlert = textAlert.concat($(this).attr("girl").toString());
            textAlert = textAlert.concat(', ');
        });

        if(allGirlsId.length > 0){
            console.log(textAlert);
            $.notify(textAlert, notifOpts);
        } else {
            textAlert = "Can't get the girls' id";
            console.log(textAlert);
            $.notify(textAlert, notifOpts);
        }
    }


    // 1 s = 1000 ms / 1 min = 60000 ms
    var interval = 37000;

    /** First call **/
    getMoneyBackground();
    //displayGirlsId();
    //getMoneyGUI();

    /** Interval: duration between each request **/
    window.setInterval(getMoneyBackground,interval);
    //window.setInterval(displayGirlsId,interval);
    //window.setInterval(getMoneyGUI,interval);
});
