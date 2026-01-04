// ==UserScript==
// @name          TagPro Honk
// @description   Press space to honk.
// @version       1.1
// @icon          https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/doot.png
// @supportURL    https://www.reddit.com/message/compose/?to=Wilcooo
// @website       https://www.reddit.com/r/TagPro/comments/6cn82i/modded_mod_honk_doot_doot/
// @match         *://*.koalabeast.com/*
// @match         *://*.jukejuice.com/*
// @match         *://*.newcompte.fr/*
// @author        CFlakes / Ballzilla / Ko
// @dootdoot      Vermite
// @require       https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @grant         GM_setValue
// @grant         GM_getValue
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/33836/TagPro%20Honk.user.js
// @updateURL https://update.greasyfork.org/scripts/33836/TagPro%20Honk.meta.js
// ==/UserScript==




var short_name = 'honk';               // An alphabetic (no spaces/numbers) distinctive name for the script.
var version = GM_info.script.version;  // The version number is automatically fetched from the metadata.
tagpro.ready(function(){ if (!tagpro.scripts) tagpro.scripts = {}; tagpro.scripts[short_name]={version:version};});
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');


// SETTINGS

var settings = tpul.settings.addSettings({
    id: 'honk',
    title: "Configure the Honk script",
    tooltipText: "Doot Doot",
    icon: "https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/doot.png",

    fields: {
        sprite: {
            label: 'What visual effect should honking have?',
            type: 'select',
            options: ['nothing','icon on ball','stripes around ball'],
            default: 'stripes around ball'
        },
        sound: {
            label: 'What sound should honking make?',
            type: 'select',
            options: ['honk','doot'],
            default: 'honk'
        },
        timeout: {
            label: 'The time in milliseconds after which the sound will be repeated (recommended: 80 for honk, 300 for doot)',
            type: 'int',
            min: 10,
            max: 5000,
            default: 80
        },
        honkKey: {
            label: 'Additional honk key',
            section: ['','You will honk when pressing Up and Down simultaneously, but you could additionally have a dedicated honk key. Go to keycode.info to get the correct number for your key. The spacebar has keycode 32'],
            type: 'int',
            min: 0,
            max: 255,
            default: 32
        }
    },

    events: {
        save: updateSettings,
        open: function(){

            // Set the recommended timeout automatically after changing the sound
            settings.fields.sound.node.onchange = function(){
                if (this.value == 'honk') settings.fields.timeout.node.value = 80
                if (this.value == 'doot') settings.fields.timeout.node.value = 300
            }
        }
    }
});

var sprite = settings.get("sprite"),
    sound = settings.get("sound"),
    timeout = settings.get("timeout"),
    honkKey = settings.get("honkKey");

var honkSound,
    honkSprite;

function updateSettings(){
    if (tpul.playerLocation != 'game') return;

    console.log('updating settings')

    sprite = settings.get("sprite")
    sound = settings.get("sound")
    timeout = settings.get("timeout")
    honkKey = settings.get("honkKey")

    switch (sound) {
        case 'honk':
            honkSound = new Audio("data:audio/mp3;base64,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");
                    //mid: [21, 96]
            break;
        case 'doot':
            honkSound = new Audio("data:audio/mp3;base64,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2C4dCNdbTPu6uQyGfhEwcUOZ1EDmKZUUUodiyqXb+xpCtkPFldX8tGl6lo9He4uIl36lqy4CQkswA6oJMBvlAHMxiyK4PLIYxynyrJYrEcjyL4L2aS5/KK71It1Khoa/xBPCD25cQHtWmHrh6CoVStb/ey8jxSur+WjV6rR6O9xaHX2qOLQUUwAASpdgB7TkoXo5kNMB+I8TMPavP9AmWzK1VKs+Vhyqz2PcJjoZ4dmDoRoW/3mamKba4vhabatGGZioP3mxJf+6Y2urBW/fxEktCfvFjH/+YlkQVCAQBScuAIpP637T18LA1nCbuq8QwFkUd0ZoPx+FpEVbHHHHcrH1HuVdJAw5p3f9q4hsOyqbdacO2s8UUXDRXaVCWkVLYeHUvgICMERsyVGCXkhCAEAAALQAKIX/+5IEWYACpCLT+w9A4lVEWm9hhkoKoG8zh5hwyU8N5qTzDhHItxzF+IU5GaADS5iGlxVCiP4lRLtkhExOlDQmfgMRBQCiai4KEktglszMt9XWhWGgoKCwgpbFh8X/4/pvTccm+P9xMV00K4FDf/wU1DAABvAFiIyQZXH8XKcwQEk0xcTpRiFNRPiXbJ6OE6VaRw4kDIzIKAQk0AhNUmPqq2UbUgpygoKCwgqbFh8X/N/oKTNi5N8O8FJgvSQVkFHGjPBattaSSTgAXuqxUVShYqxI8VFWOrFWe/4sLUqFhb6f9v/b4sLf/+Kiv//qFvAADZZZSNlayxyVlBA46OysDBA0DERKqIPJVVTO//XqqqWBiVURMDVRBwMSqDB4NVUGK//////aabKdpp///////6qv2xVVTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSBG8P8VgAKeghGABG4iSlDGOAQAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==");
                    //mid: [1, 270]
            break;
        default:
            break;
    }

    honkSound.preservesPitch = false;
    honkSound.mozPreservesPitch = false;
    honkSound.webkitPreservesPitch = false;

    switch (sprite) {
        case 'icon on ball':
            honkSprite = PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpi/P//PwMKaGBkwAoa/mOVY2LAD0Dy/WhiHEDcTYwBnEC8CogL0Fz2B4j9gdgInwEiQLwXiIPRxHmhBqyCGsLAgsPPx4BYFU0sBIgdgDgHiE8BcSrEAAhADklGLJpB4CEQW0HZN4FYnZhARAb3gVgOyn4OxBKkGvABiAWg7E/Q8CDJAHTwi1QDBKCuAAE+IP5MqgGKQPwIypYE4nfIBjAiYRC4g8UAeWj0MkBj4CZYI468AEpIm4HYAskCEOAB4i9A3AyN+jpcXngDxE5AvA5N/As07YQD8QZCYfAdiMOAeCI8N0IAyICNQHyOmED8C89MCPADiEthHIAAAwBEhjK+0yzwDgAAAABJRU5ErkJggg==");
            break;
        case 'stripes around ball':
            honkSprite = PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAACiUlEQVR4Xu3bMa7bQAwG4RwkZe5/s5zBiYoAgjFFJJPL1fgvPjxgDAjksn4/Xq/XV/n989ffP/ybEUar47j/vP9mhdEqB5bLgeVyYLkcWC4HlsuB5XJguRxYLgeWy4HlcmC5HFguB5bLgW940qM9ZdbKOTFecR6mYqBOT5jzPGPFnBiveB+oYqguu894nq9qToxXdQzWYef5zrNVzojxjq4Bq+041/u7Vc6I8a7OQa263wzjJ7oHNlnxVhg/tWLwp1v1RhgrrFrgiVa+DcYqKxd5itVvgrHS6oV2NvEWGKtNLLabqTfA2GFqwR1M7o6xy+SiU6Z3xthpctkJ0/ti7Da58GrTu2IMD4zhgTE8MIYHxvDAGB4YwwNjeGAMD4zhgTE8MIYHxvDAGB4YwwNjeGAMD4zhgTE8MIYHxvDAGB4YwwNjeGAMD4zhgTHmnP/V5VPH91o+GvfQe36q5aPvg8f/o/e86/hey0djHxjDA2N4YAwPjOGBMTwwhgfG8MAYHhjDA2N4YAwPjOGBMTwwhgfG8MAYHhjDA2N4YAwPjOGBMTwwhgfG8MAYHhjDA2N4YOz2Tf/qMr0rxk7nhaeWXml6X4xd3pedWHi16Z0xdphedNLk7hirTS64i6k3wFhparEdTbwFxioTC+1u9ZtgrLB6kSdZ+TYYP7Vygada9UYYP7FqcIMVb4XxrhUD23S/GcY7ugetsONMh/d3q5wT41WdA1bZebbDeb7KOTFe0TVYtd3nO5xnrJoV4xXVA3V5woyH85wVs2K8onKYTk+Z81A5K0ajykd7EoxGObBcDiyXA8vlwHI5sFwOLJcDy+XAcjmwXA4slwPL5cByObBcDvwFvu24r9frxx9ThG6n1YCdggAAAABJRU5ErkJggg==");
            break;
        default:
            break;
    }
}

if (tpul.playerLocation == 'game') {

    tagpro.ready(function waitForId() {

        if (!tagpro.playerId) return setTimeout(waitForId, 100);



        var self = tagpro.players[tagpro.playerId];


        updateSettings();

        function getPlayers() {
            requestAnimationFrame(getPlayers);
            for (var id in tagpro.players) {
                if (!tagpro.players.hasOwnProperty(id)) continue;
                var player = tagpro.players[id];
                if (player.up && player.down && player.draw && !player.dead) {
                    if (!player.isHonking) {
                        var startTime = Date.now();
                        player.isHonking = true;
                        $(document).trigger('honk',{state:true, id: player.id});
                        if (honkSprite) drawHonk(player);
                        honk(player, startTime);
                    }
                } else {
                    if (player.isHonking) {
                        player.isHonking = false;
                        $(document).trigger('honk',{state:false, id: player.id});
                        if (honkSprite) drawHonk(player, true);
                    }
                }
            }
        }
        requestAnimationFrame(getPlayers);

        function findCosAngle(self, player) {
            var selfVector = {
                x: player.x - self.x,
                y: player.y - self.y
            };
            var playerVector = {
                x: player.lx,
                y: player.ly
            };
            var scalarProduct = (selfVector.x * playerVector.x) + (selfVector.y * playerVector.y);
            var selfMagnitude = Math.sqrt(Math.pow(selfVector.x, 2) + Math.pow(selfVector.y, 2));
            var playerMagnitude = Math.sqrt(Math.pow(playerVector.x, 2) + Math.pow(playerVector.y, 2));
            return (-(scalarProduct / (selfMagnitude * playerMagnitude)));
        }

        function honk(player, startTime) {
            if (!tagpro.sound || !honkSound) return;
            if (player.isHonking && Date.now() - startTime < 4000) {
                var last;
                var distance = Math.sqrt(Math.pow(player.x - self.x, 2) + Math.pow(player.y - self.y, 2)),
                    volume = distance === 0 ? 1 : Math.max(1 - distance / 800, 0.1);
                honkSound.volume = volume;
                if (distance > 0) {
                    var playerSpeed = Math.sqrt(Math.pow(player.lx, 2) + Math.pow(player.ly, 2));
                    var cosAngle = findCosAngle(self, player);
                    var rate = playerSpeed * cosAngle;
                    rate = Math.pow(Math.exp(rate), 1 / 5);

                    honkSound.playbackRate = rate / 4 + 0.75;
                } else honkSound.playbackRate = 1;

                honkSound.play();
                setTimeout(function() {
                    honk(player, startTime);
                }, timeout);
            } else {
                if (player.sprites.honk) drawHonk(player, true);
            }
        }

        function drawHonk(player, remove) {
            if (!player.sprites.honk && !remove) {
                player.sprites.honk = new PIXI.Sprite(honkSprite);
                player.sprites.honk.x = -honkSprite.width/2 +20;
                player.sprites.honk.y = -honkSprite.height/2 +20;
                player.sprites.ball.addChild(player.sprites.honk);
            } else {
                if (player.sprites.honk && remove) {
                    player.sprites.ball.removeChild(player.sprites.honk);
                    player.sprites.honk = null;
                }
            }
        }

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

        $(document).keydown(function(key) {
            switch (key.which) {
                case honkKey:
                    tagpro.KeyComm.send(['up','down']);
                    break;
            }
        });

        $(document).keyup(function(key) {
            switch (key.which) {
                case honkKey:
                    tagpro.KeyComm.stop();
                    break;

            }
        });
    });

}