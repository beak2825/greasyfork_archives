// ==UserScript==
// @name         Etherium
// @namespace    http://pendoria.net/
// @version      0.1.5
// @description  Improve some guild features for Ethereal
// @author       Rakky
// @match        *://pendoria.net/*
// @match        *://pendoria.net/game*
// @match        *://www.pendoria.net/game*
// @grant        none
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/39772/Etherium.user.js
// @updateURL https://update.greasyfork.org/scripts/39772/Etherium.meta.js
// ==/UserScript==

// Changelog ==0.1.5==
// Change url matching per Puls3's request
// Properly counts guild members again

const ALERT_SOUND = new Audio("https://soundbible.com/grab.php?id=1424&type=mp3");
ALERT_SOUND.load();

function updatePosition(xcoord, ycoord){
    localStorage.setItem("coordinates", JSON.stringify({'xcoord': xcoord, 'ycoord': ycoord}));
}

function getActiveMembers(){
    $.ajax({
        method: "POST",
        url: "https://pendoria.net/guild/member-activity"
    })
        .done(function(data) {
        let members = countMembers(data);
        $('#active').text(members);
        updateETA();
    });
}

function getProgress(){
    $.ajax({
        method: "POST",
        url: "https://pendoria.net/guild/tasks"
    })
        .done(function(data) {
        $('span#seconds').text("60");
        let progress = parseProgress(data);
		if(!progress){
			$('#progress').text("No Task Active");
		} else {
			$('#progress').text(progress[0].toLocaleString() + " / " + progress[1].toLocaleString());
		}
        updateETA();
    });
}

function getEtheriumProgress(){
    let progressString = $('span#progress').text();
    let progress = progressString.split(" / ");
	if(progress.length == 2){
		progress[0] = parseInt(progress[0].replace(/,/g, ""));
		progress[1] = parseInt(progress[1].replace(/,/g, ""));
		return progress;
	} else {
		return null;
	}
}

function updateETA(){
    let progress = getEtheriumProgress();
	if(!progress){
		$('#eta').text("0s");
	} else {
		let members = parseInt($('span#active').text());
		let timestring = secondsToString(getETA(progress[0], progress[1], members));
		$('#eta').text(timestring);
	}
}

function parseProgress(htmlString){
    let html = $($.parseHTML(htmlString));
	let element = html.find('tr:contains("Progress")').children('td:contains("/")');
	if(element.length == 0){
		return null;
	} else {
		let progressString = element.text();

		let progress = progressString.split(" / ");
		progress[0] = parseInt(progress[0].replace(/,/g, ""));
		progress[1] = parseInt(progress[1].replace(/,/g, ""));
		return progress;
	}
}

function getETA(current, total, active){
    return (total - current) / active * 6;
}

function secondsToString(time){
    let days = Math.floor(time/(24*60*60));
    let hours = Math.floor((time - days*24*60*60)/(60*60));
    let minutes = Math.floor((time - days*24*60*60 - hours*60*60)/60);
    let seconds = Math.floor(time - days*24*60*60 - hours*60*60 - minutes*60);
    let timestring = "";
    if(days > 0){ timestring = days + "d"; }
    if(hours > 0){ timestring = timestring + " " +  hours + "h"; }
    if(minutes > 0){ timestring = timestring + " " + minutes + "m"; }
    timestring = timestring + " " + seconds + "s";
    timestring = timestring.trim();
    return timestring;
}

function countMembers(htmlString){
    var html = $($.parseHTML(htmlString));
    return html.find('tbody tr:contains("a few seconds ago")').length;
}

(function() {
    'use strict';

    let html = "";
    html += '<div id="EtheriumBox" class="ui-widget-content">';
    html += '<p class="text">Members Active: <span id="active">0</span></p>';
    html += '<p class="text">Progress: <span id="progress"></span></p>';
    html += '<p class="text">ETA: <span id="eta"></span></p>';
    html += '<p class="text" id="update"><span id="seconds"></span><span id="update"><a id="update">update</a></span></p>';
    html += '</div>';
    $(document.body).append(html);

    $('a#update').on('click', function(){
        $('span#seconds').text("");
        getActiveMembers();
        getProgress();
    });

    $("#EtheriumBox").draggable({
        cancel: '.text',
        stop: function(){
            let xcoord = $('#EtheriumBox').css('left');
            let ycoord = $('#EtheriumBox').css('top');
            updatePosition(xcoord, ycoord);
        }
    });
    $("#EtheriumBox").css({'width': '175px',
                         'height': '90px',
                         'padding': '0.5em',
                         'border-style': 'solid',
                         'border-color': 'white',
                         'background-color': 'rgba(0,0,0,0.6)',
                         'color': 'white',
                         'z-index': '2',
                         'font-size': '12px'});
    $("span#update").css({'float': 'right'});


    let coordinates = JSON.parse(localStorage.getItem("coordinates"));
    if(coordinates){
        $("#EtheriumBox").css({'top': coordinates.ycoord,
                             'left': coordinates.xcoord});
    }

    getActiveMembers();
    getProgress();

    let counter = 0;
    setInterval(function(){
        let seconds = parseInt($('span#seconds').text());
        if(seconds <= 1){
            getActiveMembers();
            getProgress();
            $('span#seconds').text("");
        } else {
            seconds--;
            $('span#seconds').text(seconds);
        }

        if($('#progress:contains("No Task Active")').length > 0){
            if(counter === 0){
                ALERT_SOUND.load();
                ALERT_SOUND.play();
                counter = 5;
            } else {
                counter--;
            }
        }
    }, 1000);

})();