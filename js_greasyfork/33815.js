// ==UserScript==
// @name         TagPro Pencil
// @version      1.2
// @description  Draw with your pencil flair, everyone with the script can see it!
// @author       Ko
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tangent.jukejuice.com:*
// @include      http://*.newcompte.fr:*
// @include      http://tagpro-*.koalabeast.com/game
// @include      http://tangent.jukejuice.com/game
// @include      http://*.newcompte.fr/game
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/74r58i
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/33815/TagPro%20Pencil.user.js
// @updateURL https://update.greasyfork.org/scripts/33815/TagPro%20Pencil.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// How thick the lines should be:                                                     //  //
var thickness = 2;                                                                    //  //
                                                                                      //  //
// The colors for the red and blue team (that 'null' is important!)                   //  //
// To find your color code, Google: color picker                                      //  //
// Should be of the form: 0xFF4444, *not*: #FF4444                                    //  //
var colors = [null, 0xFF4444, 0x4444FF];                                              //  //
                                                                                      //  //
// The key to press to emulate left&right (which makes your pencil start drawing)     //  //
// To find the code for your key, go to keycode.info                                  //  //
var drawKey = 66;                                                                     //  //
                                                                                      //  //
// Do you want the key to toggle drawing, so you don't have to keep pressing it?      //  //
var toggle = false;                                                                   //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////

console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

// Constants, don't edit
var dx = 15; var dy = -3;             // The position of the tip of the Pencil (relative to the top-left corner of the ball sprite)
var updateTime = 200;               // The drawing combo is sent with this interval
var drawTime = updateTime+100;      // Drawing stops when this amount of ms has passed since the last left&right combo.
var minimumTime = 500;              // The minimum length of a drawing (shorter drawings are deleted)
var drawCombo = ['left','right'];   // These keys need to be pressed simultaniously to make a balls Pencil draw.


tagpro.ready( function() {

    function draw() {
        requestAnimationFrame(draw);    // Tell the browser to 'draw' again on the next frame

        for (var id in tagpro.players) {

            if (!tagpro.players.hasOwnProperty(id)) continue;
            var player = tagpro.players[id];

            if (player.drawing) {
                if (Date.now() > player.lastUpdate + drawTime || !player.draw || player.dead) stopDrawing(id);

                else player.drawings[0].lineStyle( thickness, colors[player.team] ).lineTo( tagpro.players[id].x+dx, tagpro.players[id].y+dy );
            }

        }

    }

    requestAnimationFrame(draw);    // Tell the browser to 'draw' on the next frame





    function startDrawing(id) {

        if (!tagpro.players.hasOwnProperty(id)) return;
        var player = tagpro.players[id];

        if (player.drawings === undefined) tagpro.players[id].drawings = [];

        player.drawings.unshift(  new PIXI.Graphics().moveTo( tagpro.players[id].x + dx, tagpro.players[id].y + dy)  );

        player.drawing = true;
        player.drawStartTime = Date.now();

        tagpro.renderer.layers.midground.addChild(player.drawings[0]);

    }





    function stopDrawing(id) {

        if (!tagpro.players.hasOwnProperty(id)) return;
        var player = tagpro.players[id];

        player.drawing = false;

        if (Date.now() < player.drawStartTime + minimumTime) {
            tagpro.renderer.layers.midground.removeChild(player.drawings[0]);     // Get rid of 'accidental' drawings (little dots)
            player.drawings.splice(0,1);
        }

    }







    tagpro.socket.on('p',function(packet) {

        if (packet.u !== undefined) packet = packet.u;

        for ( var i in packet) {

            var data = packet[i];

            var player = tagpro.players[data.id];

            if (player.hasPencil == false) return;

            if (player.hasPencil == undefined) {
                if (player.hasPencil === undefined && player.flair)
                    player.hasPencil = (player.flair.description == "Pencil");

                if (!player.hasPencil) return;
            }

            var all_pressed = true;

            for (var k in drawCombo) {
                if (! (player[drawCombo[k]] || data[drawCombo[k]]) ) all_pressed = false;
            }

            if ( all_pressed ) {

                if(!player.drawing) startDrawing(player.id);
                player.lastUpdate = Date.now();
            }
        }
    });










    function setUp() {
        try { var a = tagpro.players[tagpro.playerId].flair.description; }
        catch(err) { setTimeout(setUp,50); return;}

        if (tagpro.players[tagpro.playerId].flair.description == "Pencil") {

            tagpro.players[tagpro.playerId].hasPencil = true;


            var initKeyComm = function () {    // DO NOT CHANGE THIS FUNCTION, AS IT CAN BREAK OTHER TP SCRIPTS
                if (tagpro.KeyComm) return;
                else tagpro.KeyComm = true;

                tagpro.KeyComm = {
                    sentDir: {},
                    pressedDir: {},
                    keyCount: 1,
                };

                var tse = tagpro.socket.emit;

                tagpro.socket.emit = function(event, args) {
                    if (event === 'keydown') {
                        tagpro.KeyComm.sentDir[args.k] = true;
                        args.t = tagpro.KeyComm.keyCount++;
                    }
                    if (event === 'keyup') {
                        tagpro.KeyComm.sentDir[args.k] = false;
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

                    if (short) setTimeout(tagpro.KeyComm.stop,20);
                };


                $(document).keydown(function(key) {
                    switch (key.which) {
                        case tagpro.keys.down[0]:
                        case tagpro.keys.down[1]:
                        case tagpro.keys.down[2]:
                            tagpro.KeyComm.pressedDir.down = true;
                            break;
                        case tagpro.keys.up[0]:
                        case tagpro.keys.up[1]:
                        case tagpro.keys.up[2]:
                            tagpro.KeyComm.pressedDir.up = true;
                            break;
                        case tagpro.keys.left[0]:
                        case tagpro.keys.left[1]:
                        case tagpro.keys.left[2]:
                            tagpro.KeyComm.pressedDir.left = true;
                            break;
                        case tagpro.keys.right[0]:
                        case tagpro.keys.right[1]:
                        case tagpro.keys.right[2]:
                            tagpro.KeyComm.pressedDir.right = true;
                            break;
                    }
                });

                $(document).keyup(function(key) {
                    switch (key.which) {
                        case tagpro.keys.down[0]:
                        case tagpro.keys.down[1]:
                        case tagpro.keys.down[2]:
                            tagpro.KeyComm.pressedDir.down = false;
                            break;
                        case tagpro.keys.up[0]:
                        case tagpro.keys.up[1]:
                        case tagpro.keys.up[2]:
                            tagpro.KeyComm.pressedDir.up = false;
                            break;
                        case tagpro.keys.left[0]:
                        case tagpro.keys.left[1]:
                        case tagpro.keys.left[2]:
                            tagpro.KeyComm.pressedDir.left = false;
                            break;
                        case tagpro.keys.right[0]:
                        case tagpro.keys.right[1]:
                        case tagpro.keys.right[2]:
                            tagpro.KeyComm.pressedDir.right = false;
                            break;
                    }
                });
            };
            initKeyComm();






            var sendDraw = function() {

                tagpro.KeyComm.send(drawCombo,true);
            };


            var sendDrawInterval;

            $(document).keydown(function(key) {
                switch (key.which) {
                    case drawKey:
                        if (!sendDrawInterval) {
                            sendDraw();
                            sendDrawInterval = setInterval(sendDraw,updateTime);
                        }
                        else if (toggle) {
                            clearInterval(sendDrawInterval);
                            sendDrawInterval = false;
                        }
                        break;
                }
            });

            $(document).keyup(function(key) {
                switch (key.which) {
                    case drawKey:
                        if (!toggle) {
                            clearInterval(sendDrawInterval);
                            sendDrawInterval = false;
                        }
                        break;
                }
            });
        }
    }
    setUp();
});
