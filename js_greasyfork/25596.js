// ==UserScript==
// @name         Putlockertv.is Nav Buttons
// @namespace    https://redmoses.me/
// @version      0.2.2.2
// @description  Nav Buttons For Pulockertv.is
// @Original author Red  Moses
// @Updated By Brice Wilber
// @include      http://putlockertv.is/*episode*
// @include      http://putlockertv.is/*tvshow*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/25596/Putlockertvis%20Nav%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/25596/Putlockertvis%20Nav%20Buttons.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// button style
$('head').append("<style>.myButton{-moz-box-shadow:0 14px 14px -7px #3e7327;-webkit-box-shadow:0 14px 14px -7px #3e7327;box-shadow:0 14px 14px -7px #3e7327;background:-webkit-gradient(linear,left top,left bottom,color-stop(.05,#77b55a),color-stop(1,#72b352));background:-moz-linear-gradient(top,#77b55a 5%,#72b352 100%);background:-webkit-linear-gradient(top,#77b55a 5%,#72b352 100%);background:-o-linear-gradient(top,#77b55a 5%,#72b352 100%);background:-ms-linear-gradient(top,#77b55a 5%,#72b352 100%);background:linear-gradient(to bottom,#77b55a 5%,#72b352 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#77b55a', endColorstr='#72b352', GradientType=0);background-color:#77b55a;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;border:1px solid #4b8f29;display:inline-block;cursor:pointer;color:#fff;font-family:Arial;font-size:25px;font-weight:700;padding:6px 12px;text-decoration:none;text-shadow:0 1px 23px #5b8a3c}.myButton:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(.05,#72b352),color-stop(1,#77b55a));background:-moz-linear-gradient(top,#72b352 5%,#77b55a 100%);background:-webkit-linear-gradient(top,#72b352 5%,#77b55a 100%);background:-o-linear-gradient(top,#72b352 5%,#77b55a 100%);background:-ms-linear-gradient(top,#72b352 5%,#77b55a 100%);background:linear-gradient(to bottom,#72b352 5%,#77b55a 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#72b352', endColorstr='#77b55a', GradientType=0);background-color:#72b352}.myButton:active{position:relative;top:1px}</style>");

function getTitle(url){
    var re = /watch-.*-tvshow/, m;
    if ((m = re.exec(url)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }
    return (m[0].replace("watch-","")).replace("-tvshow","");
}

function updateShow(show){
    var result = $.grep(shows, function(s){ return s.title == show.title; });
    if (result.length > 0){
        for (var i in shows) {
            if (shows[i].title == show.title) {
                shows[i].url = show.url;
                break;
            }
        }
    } else {
        shows.push(show);
    }
    localStorage.TV_SHOWS = JSON.stringify(shows);
}

function getEpisode(url, direction){
    var re = /episode-[0-9]+/, m;

    if ((m = re.exec(url)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }
    var episode_num = Number(m[0].replace("episode-","")), new_episode;
    if(direction == 'prev') {
        new_episode = episode_num - 1;
    } else {
        new_episode = episode_num + 1;
    }
    var new_url = url.replace("episode-" + episode_num, "episode-" + new_episode);
    updateShow({title: getTitle(url), url: new_url});
    return new_url;
}

function getLastWatched(url){
    var title = getTitle(url);
    var result = $.grep(shows, function(show){ return show.title == title; });
    if (result.length > 0) {
        return result[0].url;
    } else {
        alert("No data saved for " + title);
        return null;
    }
}

// get saved shows
var shows = [];
if(localStorage.TV_SHOWS) {
    shows = JSON.parse(localStorage.TV_SHOWS);
} else {
    localStorage.TV_SHOWS = JSON.stringify(shows);
}

var episode_page = window.location.href.indexOf("episode") > -1;
if (episode_page){
    updateShow({title: getTitle(window.location.href), url: window.location.href});
    $('body').append('<input type="button" value="Next episode" id="next" class="myButton">');
    $('#next').css("position", "fixed").css("top", 0).css("right", 0);
    $('#next').click(function(){
        window.location.href = getEpisode(window.location.href, 'next');
    });
    $('body').append('<input type="button" value="Previous episode" id="prev" class="myButton">');
    $('#prev').css("position", "fixed").css("top", 0).css("left", 0);
    $('#prev').click(function(){
        window.location.href = getEpisode(window.location.href, 'prev');
    });
} else {
    $('body').append('<div style="text-align:center;"><input type="button" value="Last watched" id="last_episode" class="myButton"></div>');
    $('#last_episode').css("position", "fixed").css("top", 0);
    if(typeof(Storage) == "undefined") 
        $('#last_episode').attr('disabled','disabled');
    $('#last_episode').click(function(){
        var last_watched = getLastWatched(window.location.href);
        if (last_watched)
            window.location.href = last_watched;
    });
}