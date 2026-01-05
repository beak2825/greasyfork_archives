// ==UserScript==
// @name         Loot Auto Harker
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Autoscans streams for drops and enters the loot in background
// @author       S-Babbah
// @match        https://vulcun.com/user/lobby*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18607/Loot%20Auto%20Harker.user.js
// @updateURL https://update.greasyfork.org/scripts/18607/Loot%20Auto%20Harker.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, Firebase, console
 */

'use strict' ;

/**********************************************************************************************************************************************
 * GLOBALS
 */

var IMG_URL     = "http://i.imgur.com/XUQsKTc.png";                                           // banner pic link
var DOC_TITLE   = "Loot Auto Harker v3.8" ;                                                   // title of the HTML document
var TWITCH_MSG  = "VULCUN LOOT AUTO HARKER = ACTIVE ^^" ;                                     // title of the removed TWITCH player
var FUNNY_MSG   = "De zalige tijden zijn aangebroken" ;                                       // message to motivate user
var TWITCH_PLAY = "#channel-player-container" ;                                               // twitch player container
var STREAM_GAME = "CS:GO" ;                                                                   // type of game to auto-click
var STREAMS_MSG = "Hieronder staan de " + STREAM_GAME + " streams waar we loots harken" ;     // message above streams
var VUL_ONGOING = "vu-game-listing-ongoing" ;                                                 // vulcun streams container
var FIREBASE_ID = "https://incandescent-torch-6287.firebaseio.com/lootdrop_v2/" ;             // lootdrop server
var LOOT_URL    = "https://vulcun.com/api/enterlootdrop" ;                                    // lootdrop link
var CONSOLE_ID  = "autolooter-console" ;                                                      // identifier for HTML console
var CON         = '#' + CONSOLE_ID ;                                                          // second identifier for HTML console
var REFRESH_INT = Math.floor( Math.random() * (1200000 - 300000) + 300000) ;                  // time for every refresh

var CHANCE_CLCK = 0.95 ;  // change to actually enter a contest
var CS_START    = 12   ;  // time to start entering contests
var CS_END      = 5    ;  // time to stop entering contests
var DELAY       = 0    ;  // variable to hold time difference with vulcun server
var CONTESTS    = {}   ;  // dictionary to hold the contests
var STREAMS ;             // the stream variable

/**********************************************************************************************************************************************
 * STREAM MANAGEMENT
 *
 * 1. Getting the streams
 * 2. Counting the streams
 * 3. Check whether streams are fine
 */

// 1. Getting the streams
function getStreams() {

    // set-up
    var streams = [] ;

    // catch streams
    var parents = document.getElementById( VUL_ONGOING ).childNodes ;

    // iterate and select appropriate streams
    for (var i = 1; i < parents.length; i++) {
        var children = parents[i].childNodes ;
        if (children[1].innerHTML.indexOf( STREAM_GAME ) > -1)
            for (var j = 2; j < children.length; j++)
                streams.push( children[j] ) ;
    }
    // that's it
    return streams ;
}

// 2. Counting the streams
function countStreams() {

    // count
    var noOfStreams = STREAMS.length ;

    // inform user
    console.debug("Er zijn momenteel %c" + noOfStreams + "%c " + STREAM_GAME + " streams:", "color:green", "color:blue") ;

    // reload, if no streams
    if (noOfStreams <= 0) location.reload() ;

    // return value
    return noOfStreams ;
}

// 3. Check whether streams are fine
function checkStreams(timing) {

    // plan
    setTimeout(function() {

        // set-up
        var ok = false ;

        // check streams
        for (var key in CONTESTS) if (key !== undefined) ok = true ;

        // determine action and inform user
        if (!ok) { console.debug("Streams zijn niet oke :( ") ; location.reload() ; }
        else console.debug( "Streams zijn oke." ) ;

    }, timing);
}

/**********************************************************************************************************************************************
 * TIME MANAGEMENT
 *
 * 1. Determining current time
 * 2. Defining the times to click
 * 3. Adjusting to local time
 * 4. Updating the remaining time
 * 5. Converting JavaScript time annotation
 */

// 1. Determining current time
function now() {
    return new Date().getTime() + DELAY;
}

// 2. Defining the times to click
function getCsTimes() {

    // get current time in hours
    var hour = new Date().getHours() ;

    // return whether in time frame, or not
    if ( hour < CS_END || hour >= CS_START ) return true ;
    console.debug("Too late bro") ;
    return false ;
}

// 3. Adjusting to local time
function adjustLocalTime() {

    // request time and set the delay
    $.ajax({
        url:     "/api/time",
        success: function(time){ DELAY = time * 1000 - new Date().getTime() ; },
        async:   false
    });

    // keep user informed
    var d = new Date() ;
    var now = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) ;
    console.debug("%c" + now + "%c: Jouw klok staat %c" + (DELAY / 1000) + "%c seconden anders dan de Vulcun server ",
                  "color:brown", "color:blue", "color:red", "color:blue") ;
}

// 4. Updating the remaining time
function updateTime() {

    // start repetitve function, every second
    setInterval(function() {

        // iterate the streams
        for (var key in CONTESTS) {

            // check only streams which are live
            if (key !== undefined) {

                // determine time till drop
                var remaining = CONTESTS[key] * 1000 - now() ;

                // update the console rows
                if (remaining >= 0) updateStreamRow(key, remaining);
            }
        }
    }, 1000);
}

// 5. Converting JavaScript time annotation
function convertTime(time) {

    // seconds
    time = parseInt( time / 1000 ) ;
    var sec = "0" + ( time % 60 ) ;

    // minutes
    time = parseInt( time / 60 );
    var min = "0" + ( time % 60 ) ;

    // slice the strings
    return min.slice(-2) + ":" + sec.slice(-2) ;
}

function planRefresh() {

    if (!getCsTimes()) {
        var hour = new Date().getHours() ;
        var wait = CS_START - hour ;
        REFRESH_INT = wait * 60 * 60 * 1000 ;
        console.debug("%cLoot harker offline, again online in %c" + wait + "%c hours...", "color:brown", "color:green", "color:brown") ;
    }
    setTimeout(function() { console.debug("Refreshing...") ; location.reload(); }, REFRESH_INT) ;

}

/**********************************************************************************************************************************************
 * CONSOLE MANAGEMENT
 *
 * 1. Hiding the twitch player
 * 2. Creating the console
 * 3. Adding the different rows
 * 4. Updating the different rows
 */

// 1. Hiding the twitch player
function hidePlayer() {

    // catching the player
    var playerDiv = $(TWITCH_PLAY) ;

    // replacing the content
    playerDiv.attr('class', '') ;
    playerDiv.attr('style', 'color: red;') ;
    playerDiv.html("<div id='" + CONSOLE_ID + "' </div>") ;
    $($(CON)).append('<span style="color: red"><b>' + TWITCH_MSG + '</b></span><br/>') ;
}

// 2. Creating the console
function creatConsole() {
    $(CON).append(
        '<div class="panel panel-default" style="border: 1px solid; color: #333"><div class="panel-heading"><span >' + FUNNY_MSG + '</span>'  +
        '<span class="badge" style="float:right; background-color: #124585; border: 1px solid; ">             Niet te zoenie</span>'          +
        '<span class="badge" style="float:right; background-color: white; color: #124585; border: 1px solid;">◔ ◡ ◔</span>'                 +
        '<span class="badge" style="float:right; background-color: white; color: #124585; border: 1px solid;">Gaat lekker he pik</span></div>'+
        '<img src=' + IMG_URL +' align="middle">' +
        '<div class="panel-body"><ul class="list-group" id="loot-streams"><li style="border-bottom: 0px; margin-bottom: 5px; color: black;"'  +
        ' class="list-group-item">' + STREAMS_MSG + '</li></ul></div></div>');
}

// 3. Adding the different rows
function addStreamRow(index, uniqueId, channelName) {
    $('#loot-streams').append('<li style="border-bottom: 0px; margin-bottom: 10px;" class="list-group-item"><span style="margin-right: 10px;' +
                              'font-size: small;" class="label label-default" id="loot'+uniqueId+'">Even opstarten...</span>' + index + '. '  +
                              channelName+'</li>');
}

// 4. Updating the different rows
function updateStreamRow(key, remaining) {

    // setting it up
    var timer = $('#loot' + key);
    var timerColor ;

    // determining color
    if      (remaining < 1499  ) { timerColor = 'purple' ; }
    else if (remaining < 120000) { timerColor = 'red'    ; }
    else if (remaining < 480000) { timerColor = '#e5b933'; }
    else 						 { timerColor = '#92b449'; }

    // updating the row
    timer.css('background-color', timerColor);
    timer.html("Loot dropje over " + convertTime(remaining));
}

/**********************************************************************************************************************************************
 * CLICK MANAGEMENT
 *
 * 1. Enter a loot contest
 * 2. Planning a new click
 */

// 1. Enter a loot contest
function enterContest(id) {

    // perform click with chance and within current time frame
    if ( Math.random() < CHANCE_CLCK ) {
        $.ajax({
            type:    "POST",
            url:     LOOT_URL ,
            data:    { 'league_id' : id } ,
            success: function (resp) {
            }
        });
        // inform user
        console.debug("Geklikt op ID:%c" + id + "%c. Check je inventory over een minuutje om te zien of je wint!", "color:red", "color:blue") ;
        $('#loot' + id).html("Je doet mee aan de drop") ;
    }
    else {
        // inform user
        console.debug("Niet geklikt op ID:%c" + id + "%c. We moeten menselijk blijven...", "color:red", "color:blue") ;
        $('#loot' + id).html("Geen klik, no worries") ;
    }

    // planning the new click
    if (getCsTimes()) planClick(id, 60000, 0) ;
}

// 2. Planning a new click
function planClick(uniqueId, timing, index) {

    // planning
    setTimeout(function(uniqueId) {

        // setting it up
        var channelName = $("div[data-league='" + uniqueId + "'] .indexVideoPanelTitle").text();
        var firebase = new Firebase(FIREBASE_ID);

        // doing the magic
        firebase.child('eta/' + uniqueId).once('value', function (snap) {
            var eta = snap.val();
            if (eta !== null && eta * 1000 > now()) {

                // determining time
                CONTESTS[uniqueId + ''] = eta;
                var randomClick = Math.floor( Math.random() * (20000 - 5000) + 5000 ) ;
                var remaining   = eta * 1000 - now();
                var randomStrng = randomClick.toString() ;
                randomStrng = randomStrng.slice(0,-3) + '.' + randomStrng.slice(-3,randomStrng.length) ;
                randomStrng = randomStrng.slice(0, 5) ;

                // keep user informed
                console.debug('-> ID:%c'+uniqueId+'%c, %c'+convertTime(remaining)+'%c + random %c'+randomStrng+"%cs <- %c"+channelName,
                              "color:red", "color:blue", "color:green", "color:blue", "color:green", "color:blue", "color:orange") ;

                // plan the click
                setTimeout(enterContest, (remaining + randomClick), uniqueId);
            } else {
                console.debug('ID:%c' + uniqueId + '%c is (nog) niet online', "color:red", "color:blue");
                $('#loot' + uniqueId).html("(nog) niet online") ;
            }
        });

        // add row if necessarry
        if (index !== 0) addStreamRow(index, uniqueId, channelName);

    }, timing, uniqueId);
}

/**********************************************************************************************************************************************
 * MAIN FUNCTION
 */

setTimeout(function() {

    // initial checking
    if (location.href == 'https://vulcun.com/user/lobby') location.assign('https://vulcun.com/user/lobby#page-live') ;
    if (location.href != 'https://vulcun.com/user/lobby#page-live') return ;

    // initialization
    hidePlayer();
    adjustLocalTime() ;
    document.title = DOC_TITLE ;
    STREAMS = getStreams() ;

    // creating lootklik console for user
    creatConsole() ;
    planRefresh() ;

    // getting info for streams and plan the clicks
    for (var i = 0; i < countStreams(); i++) planClick( $(STREAMS[i]).attr('data-league') , i * 1000 , i + 1 ) ;

    // keep updating time, and check the streams
    updateTime() ;
    checkStreams(15000) ;

}, 2000);