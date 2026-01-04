// ==UserScript==
// @name         TagPro Good Games
// @description  Use gg's to get statistics about maps! tagpro.page.link/gg
// @author       Ko
// @version      1.6
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://tagpro.page.link/gg
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tagpro-*.koalabeast.com/game
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/36113/TagPro%20Good%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/36113/TagPro%20Good%20Games.meta.js
// ==/UserScript==





    //----------------------------------------------------------------//
    //                                                                //
    //                TL;DR: DO NOT EDIT THIS SCRIPT !!               //
    //                                                                //
    //        This script will collect some data of the games         //
    //        that you play. To see all data, you can go to           //
    //        tagpro.page.link/gg. No other data than what is         //
    //        visible on the 'rawData' sheet is sent. If you          //
    //        don't want your username to be stored, enable           //
    //        'anonymity' in the options below. Even with it          //
    //        enabled, it is theoretically possible for               //
    //        someone to find out that you use this script, by        //
    //        comparing the data with that of TagPro Analytics        //
    //        (tagpro.eu)                                             //
    //                                                                //
    //        Please do not alter this script in any way, as          //
    //        it may pollute the data. It would be                    //
    //        exceptionally lame if a mapmaker gave his/her           //
    //        own map synthetic GGs.                                  //
    //                                                                //
    //        If, however, you really want to play with this          //
    //        script, make sure to remove the POST_URL below,         //
    //        or change it to a fake URL.                             //
    //                                                                //
    //                TL;DR: DO NOT EDIT THIS SCRIPT !!               //
    //                                                                //
    //----------------------------------------------------------------//





////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// By changing false to true, your TagPro username won't be send with the data.       //  //
// and the 'uniqueID' will be changed.                                                //  //
var anonymity = false;                                                                //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////






// The URL to post the data to
var POST_URL = "https://script.google.com/macros/s/AKfycbzZcmWaKvendh1ziz2mloTWJvsMMTbmZcPy_HUgT4yrtvh6SguC/exec";

// Remove the slashes (//) before the next line if you want to play with this script.
//   Don't send false data to the real URL.
// var POST_URL = "http://www.example.com/_This_Is_A_Fake_URL_"

// All data will be stored in this var
var data = {};

// Get your unique id from the userscripts storage, or create a new one.
// This is used to detect data manipulation
function generateID(storage){
    var ID = "";
    var chars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var n = 0; n < 16; n++) ID += chars.charAt(Math.floor(Math.random() * chars.length));
    GM_setValue(storage,ID);
    return uniqueID;
}

// There is a seperate anonymousID
var whichID = anonymity ? 'anonymousID' : 'normalID';

data.uniqueID = GM_getValue( whichID ) || generateID( whichID );

// To prevent players to be able to say 'gg' multiple times,
//   this var keeps track of who have said 'gg' before, and when.
var saidGG = {};

tagpro.ready(function() {

    // This socket sends the map name and author
    //   after you join a game.
    tagpro.socket.on('map', function(map) {
        data.map = map.info.name;
        data.author = map.info.author;
    });

    // Intercept every chat message
    tagpro.socket.on('chat', function(chat) {
        if (chat.message.toLowerCase().includes('gg') &&         // If it's a GG
            Number.isInteger( chat.from ) &&                     // and it's from a player (not a mod/groupmember)
            chat.to == 'all' ) {                                 // and it's sent to all (not team)

            // Store it
            saidGG[ chat.from ] = { time: Date.now(), team: tagpro.players[chat.from].team };
        }
    });

    tagpro.socket.on('end', function(end) {
        var min_time = Date.now() - 10e3;

        // Basic info of the game and the player
        data.gameEndsAt = tagpro.gameEndsAt.getTime();
        data.server     = tagproConfig.serverHost.replace('tagpro-','').replace('.koalabeast.com','');
        data.group      = Boolean( end.groupId );
        data.name       = anonymity || tagpro.spectator ? "" : tagpro.players[tagpro.playerId].name;
        data.auth       = anonymity || tagpro.spectator ? "" : tagpro.players[tagpro.playerId].auth;
        data.redScore   = tagpro.score.r;
        data.blueScore  = tagpro.score.b;

        // Count the number of players per team
        data.redPlayers = 0;
        data.bluePlayers = 0;
        for (var id in tagpro.players) {
            if (tagpro.players.hasOwnProperty(id)) {
                if (tagpro.players[id].team == 1) data.redPlayers++;
                if (tagpro.players[id].team == 2) data.bluePlayers++;
            }
        }

        // Data is only sent when you stay at least 24 seconds after the game ends
        setTimeout( function() {

            // wait for the page to unload...
            window.addEventListener("beforeunload", function () {

                // Count the GG's per team
                data.redGG = 0;
                data.blueGG = 0;
                for (var id in saidGG) {
                    if ( saidGG[id].time > min_time ) {
                        if ( saidGG[id].team == 1 ) data.redGG++;
                        if ( saidGG[id].team == 2 ) data.blueGG++;
                    }
                }

                // Send the data!
                $.post( POST_URL, data );
            });
        }, 24e3);

    });

});
