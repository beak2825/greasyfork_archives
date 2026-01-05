	

    // ==UserScript==
    // @name         Agar Movement Keys
    // @description  Use arrow keys or WASD to move. E to eject mass. T to toggle movement with mouse.
    // @version      0.3
    // @match        http://agar.io/
    // @grant        none
// @namespace https://greasyfork.org/users/13587
// @downloadURL https://update.greasyfork.org/scripts/11159/Agar%20Movement%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/11159/Agar%20Movement%20Keys.meta.js
    // ==/UserScript==
     
    // Get canvas and create an object with (fake) mouse position properties.
    var canvas = document.getElementById("canvas");
    var endPoint = {clientX: innerWidth / 2, clientY: innerHeight / 2};
    var holdMoveEvent = null;
     
    // Closure:
    var handleKeys = (function() {
     
        // KeyCodes and an object for storing key states.
        var keys = [37, 38, 39, 40, 65, 87, 68, 83];
        var key = {left: "keyup", up: "keyup", right: "keyup", down: "keyup"};
     
        // Stop movement and reset center when window loses focus or is resized.
        ["blur", "resize"].forEach(function(listener) {
            window.addEventListener(listener, function() {
                key.left = key.up = key.right = key.down = "keyup";
                endPoint = {clientX: innerWidth / 2, clientY: innerHeight / 2};
                canvas.onmousedown(endPoint);
            }, false);
        });
     
        // The actual handleKeys function.
        return function(event, keyState) {
     
            // Stop if keydown is repeating.
            if (event.repeat && keyState === "keydown") return;
           
            // Thanks to /u/Apostolique for the toggle!
            if (event.which === 84 && keyState === "keydown") {
                if (canvas.onmousemove === null) {
                    canvas.onmousemove = holdMoveEvent;
                } else {
                    canvas.onmousemove = null;
                }
                return;
            }
           
            if (canvas.onmousemove === holdMoveEvent) return;
     
            // Iterate through keycodes.
            for (var i = 0; i < keys.length; i++) {
     
                // If keycode doesn't match, skip it.
                if (event.which !== keys[i]) continue;
     
                // Get axis based on key index, odd = y, even = x. Store directions (axis.dir) to be evaluated next.
                var axis = (i % 2) ? {dir: ["up", "down"], value: "clientY"} : {dir: ["left", "right"], value: "clientX"};
     
                // Get direction based on index and axis. If divisible by 4, direction must be up or left (depending on the axis).
                var direction = ((i % 4) === 0 || ((i - 1) % 4) === 0) ? axis.dir[0] : axis.dir[1];
     
                // If key state is already set, return.
                if (key[direction] === keyState) return;
     
                // Else, set it.
                key[direction] = keyState;
     
                // Positive or negative value based on key state.
                var point = (keyState === "keydown") ? 500 : -500;
     
                // Invert value if direction is left or up.
                point = (direction === "left" || direction === "up") ? -point : point;
     
                // Return true to send the movement.
                return [axis.value, point];
            }
        };
    })();
     
    // Send all key events to handleKeys.
    ["keydown", "keyup"].forEach(function(keyState) {
        window.addEventListener(keyState, function(event) {
            if (!canvas.onmousedown) return;
            var data = handleKeys(event, keyState);
            if (data && keyState === "keyup") {
                var fraction = data[1] / 10;
                for (var i = 0; i < 2; i++) {
                    endPoint[data[0]] += (fraction * (i ? 1 : 9));
                    canvas.onmousedown(endPoint);
                }
            } else if (data && keyState === "keydown") {
                endPoint[data[0]] += data[1];
                canvas.onmousedown(endPoint);
            }
            if (event.which === 87) event.stopPropagation();
            if (event.which === 69) {
                window["on" + keyState]({keyCode: 87});
            }
        }, true);
    });
     
    // Overwrites default behavior.
    (function overwrite(startTime) {
        if (Date.now() - startTime > 5000) return;
        if (!canvas.onmousemove) return setTimeout(overwrite, 100, startTime);
        holdMoveEvent = canvas.onmousemove;
        canvas.onmousemove = null;
    })(Date.now());

