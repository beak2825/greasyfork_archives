// ==UserScript==
// @name         Tag on the Go
// @version      0.3
// @description  Move your ball using a touchscreen, and other improvements for mobile gameplay
// @author       Ko
// @include      http://tagpro-*.koalabeast.com*
// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @icon         https://github.com/wilcooo/TagPro-OnTheGo/raw/master/icon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/374684/Tag%20on%20the%20Go.user.js
// @updateURL https://update.greasyfork.org/scripts/374684/Tag%20on%20the%20Go.meta.js
// ==/UserScript==


// =====SETTINGS SECTION=====



// I use tpul for this userscripts' options.
// see: https://github.com/wilcooo/TagPro-UserscriptLibrary


var settings = tpul.settings.addSettings({
    id: 'TagOnTheGo',
    title: "Tag on the Go",
    tooltipText: "Configure Tag on the Go",
    icon: "https://github.com/wilcooo/TagPro-OnTheGo/raw/master/icon.png",


    fields: {
        vibration: {
            type: 'int',
            default: 100,
            min: 0,
            max: 1000,
            label: "How many milliseconds to vibrate (set to 0 to turn of)",
        }
    },

    events: {

        save: function(){
            vibration = settings.get("vibration");
        },
    }
});

var vibration = settings.get('vibration');


if (!location.port) return;

/* global tagpro, $ */

tagpro.ready(function(){

    // =====FULLSCREEN=====
    function openFullscreen() {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) { /* Firefox */
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) { /* IE/Edge */
            document.body.msRequestFullscreen();
        }
    }

    document.addEventListener('touchend', openFullscreen, {once : true});





    // =====TOUCH CONTROL=====
    (function() {
        // DO NOT CHANGE ANYTHING IN THIS FUNCTION, AS IT CAN BREAK OTHER TAGPRO SCRIPTS.
        // DON'T EVEN MINIFY IT.
        if (!tagpro.KeyComm) tagpro.KeyComm = {};
        if (!(tagpro.KeyComm.version >= 2.0)) tagpro.KeyComm.version = 2.0;
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

            for (var key of keys) {
                if (!tagpro.KeyComm.sentDir[key])
                    tagpro.socket.emit('keydown', {k: key} );
            }

            if (short === true) short = 20;
            if (short) setTimeout(tagpro.KeyComm.stop,short);
        };


        tagpro.KeyComm.set = function(keys) {

            var allkeys = ['up','down','left','right'];

            for (var key of allkeys) {
                if ( keys.includes(key) && !tagpro.KeyComm.sentDir[key] ) {
                    tagpro.socket.emit('keydown', {k: key} );
                } else if (tagpro.KeyComm.sentDir[key]) {
                    tagpro.socket.emit('keyup', {k: key} );
                }
            }
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



    // Disable scrolling / panning / zooming with touch
    document.body.style.touchAction = 'none';

    document.addEventListener('touchstart',handleTouch);
    document.addEventListener('touchmove',handleTouch);
    document.addEventListener('touchend',handleTouch);
    document.addEventListener('touchcancel',handleTouch);

    const deadzone = 30; // pixels

    var origin = null,
        last = null;

    function handleTouch(TouchEvent) {

        if (TouchEvent.touches.length) {
            pointer.hidden = false;
            var x = TouchEvent.touches[0].clientX,
                y = TouchEvent.touches[0].clientY;
            if (!origin) {
                origin = {x: x, y: y};
                pointer.style.left = x-64 + 'px';
                pointer.style.top = y-64 + 'px';
            }

            // Calculate distance:
            var dist = Math.max(
                x - origin.x,
                y - origin.y,
                origin.x - x,
                origin.y - y
            );

            if (dist < deadzone) return tagpro.KeyComm.stop();

            // Calculate direction:
            var n = Math.floor(0.5 + 4 * Math.atan2(y - origin.y, x - origin.x) / Math.PI);
            if (n != last) {
                last = n;

                navigator.vibrate(vibration);

                switch (n) {
                    case -3:
                        console.log('upleft');
                        tagpro.KeyComm.set(['left','up']);
                        break;
                    case -2:
                        console.log('up');
                        tagpro.KeyComm.set(['up']);
                        break;
                    case -1:
                        console.log('upright');
                        tagpro.KeyComm.set(['right','up']);
                        break;
                    case 0:
                        console.log('right');
                        tagpro.KeyComm.set(['right']);
                        break;
                    case 1:
                        console.log('downright');
                        tagpro.KeyComm.set(['right','down']);
                        break;
                    case 2:
                        console.log('down');
                        tagpro.KeyComm.set(['down']);
                        break;
                    case 3:
                        console.log('downleft');
                        tagpro.KeyComm.set(['down','left']);
                        break;
                    case 4:
                    case -4:
                        console.log('left');
                        tagpro.KeyComm.set(['left']);
                        break;
                    default:
                        tagpro.KeyComm.stop();
                }
            }
        } else {
            pointer.hidden = true;
            origin = null;

            tagpro.KeyComm.stop();
        }
    }



    var pointer = document.createElement('div');
    pointer.style.position = 'fixed';
    pointer.hidden = true;
    pointer.style.backgroundImage = 'url("https://i.imgur.com/CdXxFr0.png")';
    pointer.style.width = '128px';
    pointer.style.height = '128px';
    pointer.style.left = '100px';
    pointer.style.top = '100px';

    document.body.append(pointer);
});
