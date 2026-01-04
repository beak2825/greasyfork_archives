// ==UserScript==
// @name         TagPro Null Movement Cancellation
// @description         Changes TagPro Movement
// @include      *://*.koalabeast.com*
// @include      http://*.jukejuice.com:*
// @include      http://*.newcompte.fr:*
// @grant        none
// @version 0.0.1.20220427012541
// @namespace https://greasyfork.org/users/907397
// @downloadURL https://update.greasyfork.org/scripts/444063/TagPro%20Null%20Movement%20Cancellation.user.js
// @updateURL https://update.greasyfork.org/scripts/444063/TagPro%20Null%20Movement%20Cancellation.meta.js
// ==/UserScript==

tagpro.ready(function() {

    var socketEmit = tagpro.socket.emit;
    var keyCount = 0;
    var globalKeyStates = {};
    var gameKeyStates = {};
    var directions = ['right', 'left', 'down', 'up'];
    var keyCodes = [39, 37, 40, 38, 68, 65, 83, 87];

    ['keyup', 'keydown'].forEach(function(keyState) {
        window.addEventListener(keyState, function(e) {
            var i = keyCodes.indexOf(e.which);
            if (i === -1) return;
            var direction = directions[i % 4];
            globalKeyStates[direction] = keyState;
            if (!e.repeat && keyState === 'keydown' && !tagpro.disableControls) {
                tagpro.socket.emit(keyState, { k: direction });
            } else if (keyState === 'keyup' && !tagpro.disableControls) {
                i = directions.indexOf(direction);
                var oppKeyIndex = (i % 2) ? -1 + i : 1 + i;
                var oppDirection = directions[oppKeyIndex];
                if (globalKeyStates[oppDirection] !== gameKeyStates[oppDirection]) {
                    tagpro.socket.emit(globalKeyStates[oppDirection], { k: oppDirection });
                }
            }
        });
    });

    tagpro.socket.emit = function(event, data) {
        if (event === 'keyup' || event === 'keydown') {
            if (gameKeyStates[data.k] === event) return;
            gameKeyStates[data.k] = event;
            data.t = ++keyCount;
            if (event === 'keydown') {
                var i = directions.indexOf(data.k);
                var oppKeyIndex = (i % 2) ? -1 + i : 1 + i;
                var oppDirection = directions[oppKeyIndex];
                tagpro.socket.emit('keyup', { k: oppDirection });
            }
        }
        return socketEmit.apply(this, arguments);
    };
});