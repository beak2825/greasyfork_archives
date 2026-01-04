// ==UserScript==
// @name         TagPro Raptor Boats
// @description  Show EggBall-style raptor boats in TagPro
// @author       Ko
// @version      1.1
// @include      *.koalabeast.com:*
// @include      *.koalabeast.com/game
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://www.reddit.com/r/TagPro/comments/9alylc/idea_saving_tagpro_must_read/e4wnjd6
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/371633/TagPro%20Raptor%20Boats.user.js
// @updateURL https://update.greasyfork.org/scripts/371633/TagPro%20Raptor%20Boats.meta.js
// ==/UserScript==



// The minimum delay (in frames)
const SHOWBOAT_TIME = 120;

// The maximum distance during that delay (in TPU)
// 1 tile == 0.4 TPU (see r/TagPro/w/Physics)
const SHOWBOAT_DIST = 0.8;



tagpro.ready(function() {



    // STEP 1: Load the raptors

    var raptorSprites = [];
    for (var i = 1; i <= 17; i++) {
        raptorSprites.push( new PIXI.Sprite.fromImage("events/easter-2017/images/raptor" + i + ".png") );
    }



    // STEP 2: Define how to show a raptor

    function show_raptor(id,boat_time) {

        if (!(boat_time >= 60)) boat_time = 60;

        var raptorSprite = raptorSprites[id%raptorSprites.length];

        tagpro.renderer.layers.ui.addChild(raptorSprite);

        raptorSprite.x = tagpro.renderer.renderer.width;
        raptorSprite.y = tagpro.renderer.renderer.height - raptorSprite.height;

        function moveRaptor(){
            if (raptorSprite.x < -raptorSprite.width) {
                tagpro.renderer.layers.ui.removeChild(raptorSprite);
            } else {
                raptorSprite.x -= tagpro.renderer.renderer.width/boat_time;
                requestAnimationFrame(moveRaptor);
            }
        }

        requestAnimationFrame(moveRaptor);
    }



    // STEP 3: Detect boats

    var last_t = 0;

    tagpro.rawSocket.listeners('p').unshift(function(packet) {
        var updates = packet.u || packet;

        if (packet.t) last_t = packet.t;
        else packet.t = last_t;

        pu: for (let playerUpdate of updates) {
            var player = tagpro.players[playerUpdate.id];
            if (!player) continue;

            if (playerUpdate['s-captures'] > player['s-captures']) {
                var boat_time = packet.t - player.boating - 24*SHOWBOAT_DIST;

                if (boat_time > SHOWBOAT_TIME && Math.abs(tagpro.score.r - tagpro.score.b) > 2) {
                    for (var i = 0; i < 17; i++) { setTimeout(show_raptor, i*800, packet.t+i, boat_time); }
                } else if (boat_time > SHOWBOAT_TIME) show_raptor(packet.t, boat_time);
            }

            if (!player.flag) { player.boating = NaN; break pu; }

            for (var harbor of tagpro.events.static.harbors) {
                if (Math.abs(player.rx - harbor.x) < SHOWBOAT_DIST &&
                    Math.abs(player.ry - harbor.y) < SHOWBOAT_DIST) {

                    if (!player.boating) player.boating = packet.t;
                    break pu;
                }
            }

            player.boating = NaN;
        }
    });

    // Find all "harbors" (bases & endzones)
    tagpro.events = tagpro.events || {};
    tagpro.events.static = tagpro.events.static || {};
    tagpro.events.static.harbors = tagpro.events.static.harbors || [];

    tagpro.socket.on('map',function(){
        for (var i in tagpro.map) {
            for (var j in tagpro.map[i]) {
                if ([3,4,16,17,18].includes(Math.floor(tagpro.map[i][j]))) {
                    tagpro.events.static.harbors.push({x:i*.4,y:j*.4});
                }
            }
        }
    });
});
