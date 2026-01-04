// ==UserScript==
// @name         Subs
// @version      0.4
// @match        https://icedrive.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icedrive.net
// @grant        none
// @license      MIT
// @description  simple script to add subtitles
// @namespace https://greasyfork.org/users/1012060
// @downloadURL https://update.greasyfork.org/scripts/458238/Subs.user.js
// @updateURL https://update.greasyfork.org/scripts/458238/Subs.meta.js
// ==/UserScript==

function toSeconds(time) {
    var containsMilliseconds = time.split(',').length > 1;
    var milliseconds = 0;
    if(containsMilliseconds){
        milliseconds = parseInt(time.split(',')[1]);
        time = time.split(',')[0];
    }
    var parts = time.split(':');
    if (parts.length === 2) {
        time = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
        time = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return time*1000 + milliseconds;
}

function createSubtitlesContainer(){
    var subtitlesContainer = $('<div id="my_subtitles_container"></div>');
    subtitlesContainer.css({
        'position': 'absolute',
        'bottom': '10%',
        'width': '100%',
        //'margin-left': '10%',
        'text-align': 'center',
        //'background-color': 'rgba(0, 0, 0, 0.5)',
        'color': 'white',
        'padding': '10px 50px',
        'font-size': '1.4em',
        'text-shadow': '1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000'
    });
    $('#preview .content .video-wrap > .plyr').append(subtitlesContainer);
}

function processSrt(srtText) {
  // Split the srtText by newline
  var srtLines = srtText.replace(/\r/g, "").split(/\n/);

  // Initialize variables for the current subtitle
  var subtitleNumber, subtitleStart, subtitleEnd, subtitleText;

  // Initialize an empty array to store the subtitles
  var subtitles = [];
  subtitleText = "";
  // Loop through each line of the srt text
  for (var i = 0; i < srtLines.length; i++) {
    // If the current line is the subtitle number
    if (!isNaN(srtLines[i]) && srtLines[i] != "") {
        subtitleNumber = srtLines[i];
        //console.log(subtitleNumber);
        //break;
    }
    // If the current line is the subtitle start and end time
    else if (srtLines[i].indexOf('-->') !== -1) {
        var timeCodes = srtLines[i].split(' --> ');
        subtitleStart = timeCodes[0];
        subtitleEnd = timeCodes[1];
        //console.log(subtitleStart, subtitleEnd);
        //break;
    }
    else if (srtLines[i] == "") {
        subtitles.push({
            number: subtitleNumber,
            start: subtitleStart,
            end: subtitleEnd,
            text: subtitleText,
            displayed: false
        });
        subtitleText = "";
        //console.log(subtitles);
        //break;
    }
    else {
        subtitleText = subtitleText + srtLines[i] + "<br>";
        //console.log(subtitleText);
        //break;
    }
  }
  //console.log(subtitles)
  return subtitles;
}

function screenSubtitle(subtitle, subtitle_container){
    subtitle_container.html(subtitle.text);
    subtitle.displayed = true;
}

function removeSubtitle(subtitle, subtitle_container){
    subtitle_container.html(subtitle_container.html().replace(subtitle.text, ""));
    subtitle.displayed = false;
}

function scheduleNextSecond(subtitles, timeLeft){
    var timeElapsed = total_video_length - toSeconds(timeLeft);
    var subtitle_container = $('#my_subtitles_container');
    //console.log(timeElapsed, toSeconds(timeLeft), timeLeft)
    for (var i = 0; i < subtitles.length; i++) {
        var start = toSeconds(subtitles[i].start);
        var end = toSeconds(subtitles[i].end);

        if(end <= timeElapsed && subtitles[i].displayed){
            removeSubtitle(subtitles[i], subtitle_container);
        }else if(start >= timeElapsed && start < timeElapsed+1000){
            var remainingTime = start - timeElapsed;
            setTimeout(screenSubtitle, remainingTime, subtitles[i], subtitle_container);
        }else if(start >= timeElapsed+1000 && subtitles[i].displayed){
            removeSubtitle(subtitles[i], subtitle_container);
        }
  }
}

var currentTime = null;

function displaySubtitles(srt){
    if(!$(this).find("#my_subtitles_container").length){
        createSubtitlesContainer();
    }
    var subtitles = processSrt(srt);
    currentTime = null;
    $(".plyr__controls__item.plyr__time--current.plyr__time").off("DOMSubtreeModified").on("DOMSubtreeModified", function() {
        var time = $(this).text();
        if(time.length && time.startsWith("-")){
            if(currentTime == null || currentTime !== time){
                currentTime = time;
                scheduleNextSecond(subtitles, currentTime.slice(1));
                //console.log("This should appear only once a second")
            }
        }
    });
    //$("#my_subtitles_container").text(subtitles);
    //console.log(subtitles);
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displaySubtitles(contents);
    };
    reader.readAsText(file);
}

function prepareInjection() {
    if(!$("#preview .content").children().length){
        //console.log("Preview has been closed, we now wait to inject again");
        $("#preview .content").on('DOMNodeInserted', injectButton);
        $("#preview .content").off('DOMNodeRemoved', playerWasClosed);
    }else{
        //console.log("False alarm");
    }
}

function playerWasClosed() {
    //console.log("This should appear few times");
    setTimeout(prepareInjection, 100);
}

var total_video_length;
//var time_A;

function getTotalVideoLength() {
    var time = $(this).text();
    if(time.length && time.startsWith("-")){
        total_video_length = time;
        //console.log(total_video_length);
        var time_A = Date.now();

        $(this).on("DOMSubtreeModified", time_A, (event) => {
            var time = $(this).text();
            if(time.length && time.startsWith("-")){
                if(total_video_length !== time){
                    var time_B = Date.now();
                    total_video_length = (time_B - time_A) + toSeconds(time.slice(1));
                    //console.log("Real total time: ", total_video_length);
                    $(this).off("DOMSubtreeModified");
                    $(".video-wrap").css('visibility', 'visible');

                }
            }
        });

    }else{
        $(this).one("DOMSubtreeModified", getTotalVideoLength);
    }
}

function injectButton() {
    if($(this).find('[id ^=plyr-settings-][id $=-home]').length && !$(this).find("#file-input").length){
        //console.log("Preview has been opened, we can make it invisible and inject our button");
        $('[id ^=plyr-settings-][id $=-home]').find("div[role='menu']").append(
            '<button data-plyr="settings" type="button" class="plyr__control plyr__control--forward" role="menuitem" aria-haspopup="true"><input type="file" id="file-input" style="display:none"/><span onclick="document.getElementById(\'file-input\').click()">Subtitles<span class="plyr__menu__value" style="pointer-events: auto;">Open</span></span></button>'
        );
        document.getElementById('file-input').addEventListener('change', readSingleFile, false);//$("#fine-input").on("change", readSingleFile, false);
        $("#preview .content").off('DOMNodeInserted', injectButton);
        $("#preview .content").on('DOMNodeRemoved', playerWasClosed);

        $(".video-wrap").css('visibility', 'hidden');
        $(".plyr__controls__item.plyr__time--current.plyr__time").one("DOMSubtreeModified", getTotalVideoLength);
        //setTimeout(function() {
        //    total_video_length = $(".plyr__controls__item.plyr__time--current.plyr__time").text().slice(1)
        //}, 800);
    }
}

(function() {
    'use strict';

    // Your code here...
    $("#preview .content").on('DOMNodeInserted', injectButton)
    //document.querySelectorAll("code").forEach(c => { c.contentEditable = "true" });
})();