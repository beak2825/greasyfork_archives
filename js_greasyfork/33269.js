// ==UserScript==
// @name         TagPro AutoStatsSetting (TP-ASS)
// @version      0.3
// @description  When less than 2 of the 3 last games are won: turn off stats. When the last 3 games are won: turn on stats
// @author       Ko
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://www.reddit.com/r/TagPro/comments/6wlsfa/userscript_tagpro_autostatsetting_tpass/
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tagpro-*.koalabeast.com/game
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      koalabeast.com
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/33269/TagPro%20AutoStatsSetting%20%28TP-ASS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33269/TagPro%20AutoStatsSetting%20%28TP-ASS%29.meta.js
// ==/UserScript==

console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// Please type your reserved name between the quotes.                                 //  //
// DO NOT FORGET to change this when you change your reserved name in the future,     //  //
// or it will be set back to what you typed here!!                                    //  //
var reservedName = "";                                                                //  //
                                                                                      //  //
// How many wins in a row should turn stats back on? (Max. 3 at the moment)           //  //
var wins_in_a_row = 3;                                                                //  //
                                                                                      //  //
// What is the mininum acceptable amount of games to win out of 3?                    //  //
// If you win less than that, stats are turned off.                                   //  //
var minimum_wins = 2;                                                                 //  //
                                                                                      //  //
// Note: With the default options, winning 2 of the last 3 games keeps the stat       //  //
// setting unchanged                                                                  //  //
                                                                                      //  //
// Start a new session after how many minutes of not playing?                         //  //
var reset_time = 30;                                                                  //  //
                                                                                      //  //
// Do you want to be alerted when the stat setting is changed? true/false             //  //
var show_alert = true;                                                                //  //
// Currently not working, and I've no idea why. Help appreciated :)                   //  //
                                                                                      //  //
// Do you want to be alerted after every game, with the last three results?           //  //
var show_results = true;                                                              //  //
                                                                                      //  //
// What color should the alerts have (You'll get those in your chat-box)              //  //
// This tool may come in handy: https://www.w3schools.com/colors/colors_picker.asp    //  //
var alert_color = "#ffccff";                                                          //  //
                                                                                      //  //
// Do you want to see some debug-messages in the console                              //  //
// (don't worry if you've no idea what this is)                                       //  //
var debug = false;                                                                    //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////

/*

UPDATE LOG:

    0.2:
        Two new options; you can now specify at what number of wins stats should be turned on and off


Idea for a future update (I don't plan on updating this soon, but if you want you can fork/pull request):

    Whether or not Stats will be turned off/on won't be based on that simple rule.
    Instead the win% of the last session will be compared to your R300 win%.
    Only when you are positively influencing your R300 win%, stats will be turned on
    I plan on leaving the approach in this version as an option too.

*/


//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////

function chat_alert(message) {                                              // This function shows info in your chat.
    tagpro.socket.emit("local:chat", { to:"all", from:"TP-ASS", message:message, c:alert_color});
}

tagpro.ready(function () {

    if (wins_in_a_row < minimum_wins) {      // If this is true, stats will be turned on and off simultaneously in some cases
        chat_alert("You messed up the options, wins_in_a_row cannot be smaller than minimum_wins!! This script is terminating.");
        return;
    }

    tagpro.socket.on('end',function(data) {                                 // This script only runs at the end of a game.

        if(debug)console.log('TP-ASS: Game has ended, starting the script');

        if (tagpro.spectator) return;                                       // Spectated game results should NOT affect this script!

        var player = tagpro.players[tagpro.playerId];                       // Your own ball's object
        var teamNames = [null,"red","blue"];                                // Because tagpro.players[n].team returns a number, and I need to compare it to a string
        var team = teamNames [ player.team ] ;                              // convert number to corresponding teamName string
        var winner = data.winner;                                           // Returns "red", "blue", or "tie" (even when custom names are set)
        var won = (team == winner);                                         // Determine if this game is won or not

        if(debug)console.log('TP-ASS: And the winner is: ',winner);
        if(debug)console.log('TP-ASS: You are part of that team: ',won);

        var now = new Date().getTime();                                     // Get the current time

        if ( GM_getValue("last_played") < now - reset_time*60000 || !GM_getValue("last_played") ) {        // If you haven't played (using this script) during the last x minutes

            GM_setValue("result1",false);                                   // 2 games earlier is set to Lost
            GM_setValue("result2",true);                                    // 1 game earlier is set to Win
            GM_setValue("result3",won);                                     // Last games result is stored

            // Note: The results of those 2 games are chosen this way because it will give the following effect.
            //   - When loosing the first game of a new session: stats are immediately turned OFF
            //   - You need to win the first 2 games for stats to be turned ON (if they weren't already)

            if(debug)console.log('TP-ASS: A new session has started');

        } else {                                                            // Else (if still in the same session)
            GM_setValue("result1",GM_getValue("result2"));                  // Move all results one place back in the 'past'
            GM_setValue("result2",GM_getValue("result3"));
            GM_setValue("result3",won);                                     // Store the latest result (of the game that just ended)
            if(debug)console.log('TP-ASS: This result is stored');
        }

        GM_setValue("last_played",now);                                     // Update the last_played time


        function setStats(to) {                                             // Defines how to turn stats on or off
            if ( tagpro.settings.stats == to ) return;                                       // If the current Stat setting is different from what you want it to be:

            if(debug)console.log('TP-ASS: Trying to change the STAT setting to '+to);

            // This is where the magic starts!! (changing the Stat Setting)
            var settings = tagpro.settings.ui;                                               // We copy your current settings, because we need a fully filled form to send to the server
            // What is still missing in tagpro.settings.ui is your displayName and reservedName
            settings.displayedName = player.name;                                            // We simply get your display name from your ball

            // Getting the reserved name isn't that easy:
            if(player.auth) settings.reservedName = player.name;                             // if you have a green checkmark, the script immediately knows your reserved name

            else if (reservedName !== "") settings.reservedName = reservedName;              // if you're playing unauthenticated, the name from the options (top of this script) will be used instead

            else {                                                                           // if you haven't set that as well, you will be prompted at the end of the game. (only the first time)
                storedName = GM_getValue("storedName");
                if (typeof storedName != 'undefined') settings.reservedName = storedName;    // If you are prompted before, use that value.
                else {                                                                       // If not, prompt and store the input.
                    input = "";
                    while (input === "") input = prompt('What is your reserved name? Be sure to get it correct! The TP-ASS script needs this to work.\n\nIf you change your reserved name in the future, don\'t forget to update it in the TP-ASS script too or it will be set back to the name you type here!!');
                    // In case you immediately press 'enter' at the end of the game (f.e. to chat 'gg'), the prompt will just show again.

                    settings.reservedName = input;
                    GM_setValue("storedName",input);
                }
            }

            if(debug)console.log('TP-ASS: Using this reserved name: '+settings.reservedName);

            settings.stats = to;                                                              // The only thing we change in the settings is the stats, to whatever this functions argument is

            if(debug)console.log('TP-ASS: Got the required settings, sending a POST request now...');

            // Now that we have all settings, we can 'post' it to the server. (This is what happens when you click 'save settings' on the TagPro profile page)
            GM_xmlhttpRequest ( {
                method:     "POST",
                url:        'http://'+document.location.hostname+'/profile/update',           // Settings should be send to the same server, so you'll be logged in for sure.
                data:       jQuery.param(settings),                                           // jQuery.param makes it a string: "stats=false&reservedName=Ko&..."
                headers: {"Content-Type": "application/x-www-form-urlencoded"},               // No idea why this is needed, but it doesn't work without it.
                onload:     function(r){
                    // 'r' is the response that we get back from the TP server, lets do some error handling with it:
                    if(r.response.error) chat_alert('Your Stat setting could not be saved due to the following error:\n'+e.error);     // Alert it when something is wrong
                    if(r.response.success && show_alert) {
                        var textify = {true: "on", false: "off" };                            // Translation from Boolean to the words on/off
                        chat_alert("Stats have been turned " + textify[to] + " for next game!");          // Alert when succeeded!
                    } if(debug)console.log('TP-ASS: Response of the POST request: ', r);
                }});

            // We did the magic!!

        }

        var number_of_wins = GM_getValue("result1") + GM_getValue("result2") + GM_getValue("result3");      // Count the number of wins of those last 3 results
        if (number_of_wins < minimum_wins) setStats(false);                                                 // Set stats off when <2 wins

        var wins_streak = ( GM_getValue("result1") * GM_getValue("result2") + GM_getValue("result2") ) * GM_getValue("result3") + GM_getValue("result3");  // Do some fancy math to get your current win streak
        if (wins_streak >= wins_in_a_row) setStats(true);                                                   // Stats on when enough wins

        // Note: if 2 of the last 3 games are won: the stat setting isn't changed. (With the default options)

        if (show_results) {
            var iconify = {true: "☀  ", false: "·  " };                   // Translation from Boolean to these icons
            var results = iconify[GM_getValue("result1")] + iconify[GM_getValue("result2")] + iconify[GM_getValue("result3")];
            chat_alert("Results from the last 3 games:   " + results);
            // Alerts you when the stat setting was updated.
        }

        if(debug)console.log('TP-ASS: Done! And hopefully succeeded xD');

    });
});
