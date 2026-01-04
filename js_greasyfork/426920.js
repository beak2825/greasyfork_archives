// ==UserScript==
// @name         Trophymanager Super Voice Reports
// @namespace    http://trophymanager.com/
// @version      1.03
// @description  Now with Super Voice Reports you can just relax and listen to your game reports.
// @match        *trophymanager.com/matches/*
// @match        *www.naturalreaders.com/online/
// @author       Joao Manuel Ferreira Fernandes
// @github       https://github.com/etnepres/trophymanager-super-voice-report
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426920/Trophymanager%20Super%20Voice%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/426920/Trophymanager%20Super%20Voice%20Reports.meta.js
// ==/UserScript==

// ADDED
setInterval(function(){
    jQuery(document).attr("title", "HOME" + " ["+$("#main > div.top_team_bars > div.abs.score > div > span.home").html() + " - " + $("#main > div.top_team_bars > div.abs.score > div > span.away").html()+"] "+"AWAY");
}, 5000);
// ------- END ADDED

// https://trophymanager.com/js/matchviewer.2.0.js?v=3.016.1
function prepare_next_minute() {

    // ADDED
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function getPlayerlastName(str, p1) {

        if (p1 != null) {

            var playerActual = allPlayers[p1];

            if (playerActual != null && typeof playerActual["nameLast"] != "undefined") {
                return allPlayers[p1]["nameLast"];
            }
        }
    }
    // ------- END ADDED

    match_next_minute = get_next_minute_with_severity(match_last_min);

    if (match_next_minute !== false && !test_prepared_minute(match_next_minute)) {

        console.log("Prepareing next minute - " + match_next_minute);

        // Add minute as has been prepared
        match_prepared_minutes.push(match_next_minute);

        // Merge all videos for the loader and prepare text boxes
        var video_list = [];

        for (var i in report[match_next_minute]) {

            if (settings["severity"] == 0 || (settings["severity"] == 1 && report[match_next_minute][i]["severity"] == 1)) {

                var entry = report[match_next_minute][i];

                // ADDED
                var allPlayers = [];
                for (var attr in lineup["home"]) { allPlayers[attr] = lineup["home"][attr]; }
                for (var attr in lineup["away"]) { allPlayers[attr] = lineup["away"][attr]; }
                var relato = "";

                for (var j = 0; j < entry["chance"]["text"].length; j++) {

                    var relatoActualArray = entry["chance"]["text"][j];
                    var relatoActual = "";
                    for (var k = 0; k < relatoActualArray.length; k++) {
                        relatoActual = relatoActual + relatoActualArray[k];
                        if (!relatoActual.endsWith(".") && !relatoActual.endsWith("!") && !relatoActual.endsWith("?")) {
                            relatoActual = relatoActual + " ";
                        }
                        relatoActual = relatoActual + " ";
                    }

                    relatoActual = relatoActual.replace(/\[player=(\d+)\]/gi, getPlayerlastName);
                    relatoActual = relatoActual.replace("[goal]", "");
                    relatoActual = relatoActual.replace("[sub]", "");
                    relatoActual = relatoActual.replace("[yellow]", "");
                    relatoActual = relatoActual.replace("[red]", "");
                    relatoActual = replaceAll(relatoActual, "GOAL", "Goal");
                    relatoActual = replaceAll(relatoActual, "GOOOOOOOOOAL", "Goal");
                    relatoActual = replaceAll(relatoActual, "GOOOOOOOOOOLO", "Golo");
                    relatoActual = replaceAll(relatoActual, "GOLOOOOOO", "Golo");
                    relatoActual = replaceAll(relatoActual, "(clap-clap-clap)", "");



                    if (!relatoActual.endsWith(".") && !relatoActual.endsWith("!") && !relatoActual.endsWith("?")) {
                        relatoActual = relatoActual + " ";
                    }

                    relato = relato + relatoActual + "\n";

                    relato = relato.replace(". .", "");

                }

                if (typeof match_data["report_relato"] == "undefined") {
                    match_data["report_relato"] = [];
                }

                if (typeof match_data["report_relato"][match_next_minute] == "undefined") {
                    match_data["report_relato"][match_next_minute] = relato;
                } else {
                    match_data["report_relato"][match_next_minute] += " " + relato;
                }
                // ------- END ADDED

                // Prune action text holders
                var action_text_holders = $(".actiontext .scroller .entry");
                if (action_text_holders.size() > 6) action_text_holders.first().remove();
                var new_margin = 266 - $(".scroller").outerHeight();
                $(".scroller").css({ "margin-top": new_margin });

                // Add time to entry
                entry["time"] = match_next_minute;

                // Make new action text holder
                $(".actiontext .scroller").append(template_action_holder(entry, flash_status["enabled"]));

                // Add videos to video list
                if (entry["chance"]["video"]) video_list = video_list.concat(entry["chance"]["video"]);

            }
            //match_pause();
        }

        if (video_list.length > 0 && flash_status["enabled"] && $("#viewer")[0] && $("#viewer")[0].gateway) {

            flash_start_loaded_minutes_ar.push(match_next_minute);

            // Cashe fix, treats duplicates as unique clips, otherwise animation complete will not fire.
            for (var i in video_list) {
                for (var j in video_list) {
                    if (i != j) {
                        if (video_list[i]["video"] == video_list[j]["video"]) {
                            video_list[i]["video"] = video_list[i]["video"] + "?" + i;
                        }
                    }
                }
            }

            // try {
            load_clips(video_list, match_next_minute);

            // } catch(e) {
            // 	console.log("CATCHY");
            // 	flash_status["enabled"] = false;
            // 	flash_finished_loaded_minutes_ar.push(match_next_minute);
            // 	flash_played_minutes_ar.push(match_next_minute);

            // 	// Make sure report is running
            // 	if (!flash_status["report_started"]) start_report();

            // }

        } else {

            flash_finished_loaded_minutes_ar.push(match_next_minute);
            flash_played_minutes_ar.push(match_next_minute);

            // Make sure report is running
            if (!flash_status["report_started"]) start_report();

        }
    }
}

//https://trophymanager.com/js/matchviewer.2.0.js?v=3.016.1
function run_match() {

    // ADDED
    if (typeof match_data["report_done"] == "undefined") {
        match_data["report_done"] = [-1, 0];
    }

    if (!flash_status["loaded_main"] && match_data["report_done"].length == 3 && match_data["report_done"].indexOf(match_next_minute) == -1){// && match_data["report_done"].indexOf(match_next_minute) == -1) { //  && match_data["report_done"].length == 2
        setTimeout(function(){
            match_data["report_done"].push(match_next_minute);
        },2000);
    }

    if (match_time_mode == "live" && flash_status["loaded_main"] && match_data["report_done"].indexOf(match_next_minute) == -1 && flash_finished_loaded_minutes_ar.indexOf(match_next_minute) > -1) { //  && match_data["report_done"].length == 2
        setTimeout(function(){
            match_data["report_done"].push(match_next_minute);
        },2000);
    }
    // ------- END ADDED

    var time = timeObj(match_seconds);

    // Stop if end of game
    if (end_of_game) return;
    // End at end of game
    if (time.m >= end_game && !flash_playing_clip && !$(".actiontext .scroller p:hidden").length > 0) {
        match_end();
        return;
    }

    // Paused? Wait a sec and check for unpaused then
    if (flash_status["playback_mode"] == "pause") {
        setTimeout(run_match, 1000);
        return false;
    }


    // Update clock
    //$(".clock").text(time.m_leading+":"+time.s_leading);
    $(".clock").text(get_display_time(match_seconds).formatted_s);

    // Start half time
    if (time.m == 45 && match_half_time === false && match_time_mode == "live") {

        match_half_time = 0;
        play_refblow();
        setTimeout(run_match, 1000);
        return false;

        // Continue half time
    } else if (time.m == 45 && match_half_time <= 900 && match_time_mode == "live") {

        var half_time = timeObj(900 - match_half_time);
        $(".ht_clock").show().text(half_time.m_leading + ":" + half_time.s_leading);

        match_half_time++;

        // Hide clock
        if (match_half_time >= 900) $(".ht_clock").hide();

        setTimeout(run_match, 1000);
        return false;

    } else if (time.m >= 45 && match_half_time === false && match_time_mode == "relive") {
        match_half_time = true;
        element_venue.update();
    }


    // No flash
    if (!flash_status["enabled"]) {
        if ($(".scroller p:hidden").size() > 0 && time.m >= match_next_minute) {
            show_next_action_text_entry();
        } else {
            finish_playing(0);
        }
    }

    // Match still going on

    if (match_data["report_done"].indexOf(Math.floor(match_seconds / 60)) > -1) { // ADDED - LINE - IF

        if (match_last_min != Math.floor(match_seconds / 60)) {

            // New minute called
            match_last_min = Math.floor(match_seconds / 60);
            console.log("New minute called: " + match_last_min);

            update_stats(true);
            update_elements_with_stats(false);
            update_live_elements();

            if (report[match_last_min]) {

                play_clips(match_last_min);
            }

            var iframe = document.getElementById('frame1'); // ADDED - LINE
            iframe.contentWindow.postMessage('narrate:' + match_data["report_relato"][match_last_min], 'https://www.naturalreaders.com'); // ADDED - LINE

        }
    } // ADDED - LINE - END IF


    // *** Bump time ***
    // Next minute loaded and current minute playback done speed up clock
    // CHANGED LINE - WAS: (commented)
    // if (match_time_mode == "relive" && test_flash_finished_loaded(match_next_minute) && test_flash_played_minute(match_last_min)) {
    if (match_data["report_done"].indexOf(match_next_minute) > -1 && match_time_mode == "relive" && test_flash_finished_loaded(match_next_minute) && test_flash_played_minute(match_last_min)) {
        if (match_seconds < match_next_minute * 60) {
            match_seconds = match_next_minute * 60;
        } else {
            match_seconds++;
        }

        // Allow clock to go
    } else if ($.inArray(match_next_minute, flash_finished_loaded_minutes_ar) >= 0) {
        match_seconds++;

        // Disallow clock to pass match_next_minute until the clips are loaded for that minute
    } else if (Math.floor((match_seconds + 1) / 60) < match_next_minute) {
        match_seconds++;
    }

    setTimeout(run_match, 1000);

}

// AUX CODE REPLACE ORIGINAL FUNCTION

addJS_Node(prepare_next_minute);
addJS_Node(run_match);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement('script');
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}

// SCRIPT CODE

(function () {
    'use strict';

    var iframeReady = false;

    if (window.top === window.self) {

        // Here we are at the top window (TROPHYMANAGER) and we setup our message event listener, iframe and help info

        jQuery('#main > div.abs.output.stats.text_center').append("No sound?<br>Select voice again on sound page once ---->");
        jQuery('div.main_center').css('overflow', 'initial');
        jQuery('<iframe />');
        jQuery('<iframe />', {
            name: 'frame1',
            id: 'frame1',
            style: 'position:absolute;left:320px;width:320px;height:600px',
            src: 'https://www.naturalreaders.com/online/'
        }).appendTo('#main > div.abs.output.stats.text_center');

        var handleSizingResponse = function (e) {

            if (e.origin == 'https://www.naturalreaders.com') {
                var action = e.data.split(':')[0]
                var message = e.data.split(':')[1]

                if (!iframeReady) {
                    if (action == 'status') {
                        if (message == 'iframe.ready') {
                            iframeReady = true;
                            match_data["report_done"].push(0);
                        }
                    }
                }

                if (iframeReady) {
                    if (action == 'game_play') {
                        /**
                         * Ended opting for forced timer
                         */
                        var timerIn = parseInt(message);
                        if (timerIn >= 59000) {
                            timerIn = 59000;
                        }

                        timerIn = 55000;

                        setTimeout(function () {
                            match_data["report_done"].push(match_next_minute);
                        }, timerIn);
                    }

                    //Lefted this comment here just because I'm awesome
                    //iframe.contentWindow.postMessage('narrate:I'm awesome.', 'https://www.naturalreaders.com');
                }
            }
        }

        window.addEventListener('message', handleSizingResponse, false);

    } else if (window.location.host == "www.naturalreaders.com") {

        window.top.postMessage('status:iframe.ready', "*");
        localStorage.setItem('NRPerson-input', '{"pageindex":0,"sentenceindex":0,"filetype":""}');
        $("#inputDiv").html("");

        var respondToSizingMessage = function (e) {
            if (e.origin == 'https://trophymanager.com') { // e.data is the string sent by the origin with postMessage.

                var action = e.data.split(':')[0]
                var message = e.data.split(':')[1]

                if (action == 'narrate') {
                    $("#inputDiv").html(message);
                    localStorage.setItem('NRPerson-input', '{"pageindex":0,"sentenceindex":0,"filetype":""}');
                    $("#pw_wrapper > div.mainTop.clearfix > div.topNavlink > div.operateContent > app-reader > div.option.playPause.play").click();

                    setTimeout(function () {
                        window.top.postMessage('game_play:' + (4000 * $("#inputDiv > p").length), "*");
                    }, 2000);

                    // TODO: For relive game porpuses find a way to send message as soon voice ends

                }
            }
        } // we have to listen for 'message'

        window.addEventListener('message', respondToSizingMessage, false);
    }
})();