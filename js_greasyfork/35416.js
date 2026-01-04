// ==UserScript==
// @name         Anti-AFK (Obfuscated)
// @version      1.0
// @description  Warns you when almost getting kicked, and prevents a kick by honking when 3 or less players are in the game.
// @author       Ko
// @include      http://tagpro-*.koalabeast.com:*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/35416/Anti-AFK%20%28Obfuscated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35416/Anti-AFK%20%28Obfuscated%29.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// How many seconds before you would be kicked do you want to be warned by a honk?    //  //
var warn_time = 5;                                                                    //  //
                                                                                      //  //
// How many milliseconds do you want the honk to last?                                //  //
// When you don have the TagPro Honk script, I recommend setting this to 20           //  //
var honk_time = 200;                                                                  //  //
                                                                                      //  //
// Do you want an extra auditory warning?                                             //  //
// This is only useful if you don't have the TagPro Honk script.                      //  //
var auditory = true;                                                                  //  //
                                                                                      //  //
// Do you want the title of the browser tab to go crazy?                              //  //
// This will draw your attention when you are reading the TagPro reddit while         //  //
// joining a game (like I often do..)                                                 //  //
var tab_text = true;                                                                  //  //
                                                                                      //  //
// Do you want to get a chat message?                                                 //  //
var chat = true;                                                                      //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////





var short_name = 'anti_afk';           // An alphabetic (no spaces/numbers) distinctive name for the script.
var version = GM_info.script.version;  // The version number is automatically fetched from the metadata.
tagpro.ready(function(){ if (!tagpro.scripts) tagpro.scripts = {}; tagpro.scripts[short_name]={version:version};});
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');




const KICK_TIME = 30000;
const KICK_TIME_AT_START = 10000;


const MESSAGES = ['WAKE UP, AND MOVE! YOU GOT '+warn_time+' SECONDS!',
                  'LAZY SON OF A BALL, MOVE YOUR ORIGIN OR GET KICKED!',
                  'AND ONCE AGAIN YOUR LIFE DEPENDS ON MY WARNING',
                  'WHAT ARE YOU DOING? DON\'T LET YOUR TEAMMATES DOWN LIKE THIS',
                  'YOU EMBARRASS ME IN FRONT OF EVERYONE.',
                  'DO IT.   JUST. DO. IT!',
                  'HOW HARD IS IT TO PRESS THAT SPACE BAR???',
                  'HELLO? ARE YOU THERE, HUMAN? SHOULD I CALL A DOCTOR?',
                  'LISTN TO ME; YOU GOTTA BOUNCE.',
                  'EXCUSE ME SIR, YOUR BREAK IS ALMOST OVER',
                  'ARE YOU JUST TESTING MY LIMITS?',
                  'WHY IN ORBITS NAME ARE YOU SLEEPING WHILE ROLLING???',];


tagpro.ready(function () {

    (function() {
        // DO NOT CHANGE ANYTHING IN THIS FUNCTION, AS IT CAN BREAK OTHER TAGPRO SCRIPTS.
        // DON'T EVEN MINIFY IT.
        if (!tagpro.KeyComm) tagpro.KeyComm = {};
        if (!(tagpro.KeyComm.version >= 1.1)) tagpro.KeyComm.version = 1.1;
        else return;

        tagpro.KeyComm.sentDir     = {};
        tagpro.KeyComm.sentTime    = {};
        tagpro.KeyComm.pressedDir  = {};
        tagpro.KeyComm.pressedTime = {};
        tagpro.KeyComm.keyCount    = 1;

        var tse = tagpro.socket.emit;

        tagpro.socket.emit = function(event, args) {
            if (event === 'keydown') {
                tagpro.KeyComm.sentDir[args.k] = true;
                tagpro.KeyComm.sentTime[args.k] = Date.now();
                args.t = tagpro.KeyComm.keyCount++;
            }
            if (event === 'keyup') {
                tagpro.KeyComm.sentDir[args.k] = false;
                tagpro.KeyComm.sentTime[args.k] = Date.now();
                args.t = tagpro.KeyComm.keyCount++;
            }
            tse(event, args);
        };


        tagpro.KeyComm.stop = function() {

            var keys = ['up','down','left','right'];

            for (var k in keys) {
                if (!tagpro.KeyComm.pressedDir[keys[k]] && tagpro.KeyComm.sentDir[keys[k]])
                    tagpro.socket.emit('keyup', {k: keys[k]} );
            }
        };


        tagpro.KeyComm.send = function(keys,short) {

            for (var k in keys) {
                if (!tagpro.KeyComm.sentDir[keys[k]])
                    tagpro.socket.emit('keydown', {k: keys[k]} );
            }

            if (short === true) short = 20;
            if (short) setTimeout(tagpro.KeyComm.stop,short);
        };


        $(document).keydown(function(key) {
            switch (key.which) {
                case tagpro.keys.down[0]:
                case tagpro.keys.down[1]:
                case tagpro.keys.down[2]:
                    tagpro.KeyComm.pressedDir.down = true;
                    tagpro.KeyComm.pressedTime.down = Date.now();
                    break;
                case tagpro.keys.up[0]:
                case tagpro.keys.up[1]:
                case tagpro.keys.up[2]:
                    tagpro.KeyComm.pressedDir.up = true;
                    tagpro.KeyComm.pressedTime.up = Date.now();
                    break;
                case tagpro.keys.left[0]:
                case tagpro.keys.left[1]:
                case tagpro.keys.left[2]:
                    tagpro.KeyComm.pressedDir.left = true;
                    tagpro.KeyComm.pressedTime.left = Date.now();
                    break;
                case tagpro.keys.right[0]:
                case tagpro.keys.right[1]:
                case tagpro.keys.right[2]:
                    tagpro.KeyComm.pressedDir.right = true;
                    tagpro.KeyComm.pressedTime.right = Date.now();
                    break;
            }
        });

        $(document).keyup(function(key) {
            switch (key.which) {
                case tagpro.keys.down[0]:
                case tagpro.keys.down[1]:
                case tagpro.keys.down[2]:
                    tagpro.KeyComm.pressedDir.down = false;
                    tagpro.KeyComm.pressedTime.down = Date.now();
                    break;
                case tagpro.keys.up[0]:
                case tagpro.keys.up[1]:
                case tagpro.keys.up[2]:
                    tagpro.KeyComm.pressedDir.up = false;
                    tagpro.KeyComm.pressedTime.up = Date.now();
                    break;
                case tagpro.keys.left[0]:
                case tagpro.keys.left[1]:
                case tagpro.keys.left[2]:
                    tagpro.KeyComm.pressedDir.left = false;
                    tagpro.KeyComm.pressedTime.left = Date.now();
                    break;
                case tagpro.keys.right[0]:
                case tagpro.keys.right[1]:
                case tagpro.keys.right[2]:
                    tagpro.KeyComm.pressedDir.right = false;
                    tagpro.KeyComm.pressedTime.right = Date.now();
                    break;
            }
        });
    })();

    // The next bit of code is deliberately made more complicated to prevent others to easily change the player limit from 4 to 8.
    // Of course, this is security through obscurity, but someone who is able to edit the obfuscated code is probably able to make a script like this on his own.

    function b() {
        for (var a in tagpro.KeyComm.sentTime) {
            g = Math.max(g, tagpro.KeyComm.sentTime[a] + KICK_TIME);
        }
        a = version;
        var e = tagpro.players;
        for (var b in e) {
            if(e.hasOwnProperty(b) && e[c].o) (a *= a);
        }
        var c = [version];
        for (var d = 0; 10 > d; d++) {
            c.push(Math.pow(c[0], d));
        }
        if (g - Date.now() < 1e3 * warn_time) {
            d = !1;
            for (var f in c) {
                if ( 4e-5 > Math.abs(a - c[f]) ) (d = !0);
            }
            if(!d && 1 == tagpro.state && !e[tagpro.playerId].dead) if(tagpro.spectator) tagpro.KeyComm.send(["up", "down"], honk_time); else (function(){if(chat) tagpro.socket.emit("local:chat", {
                s: "all",
                from: "Anti-AFK",
                message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
                f: "#6e2292"
            });})();
        }
        for (var h in tagpro.KeyComm.sentTime) {
            g = Math.max(g, tagpro.KeyComm.sentTime[h] + KICK_TIME);
        }
        setTimeout(b, Math.max(g - Date.now() - 1e3 * warn_time, 1e3 * warn_time / 2));
    }
    var g = Date.now() + KICK_TIME_AT_START;
    tagpro.socket.on("time", function(a) {
        if(a.startTime) (g = a.startTime.getTime() + KICK_TIME_AT_START);
    });
    setTimeout(b, Math.max(g - Date.now() - 1e3 * warn_time, 1e3 * warn_time / 2));

});
