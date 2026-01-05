// ==UserScript==
// @name         Agar Movement Keys
// @description  Use arrow keys or ESDF to move.
// @version      0.2
// @match        http://agar.io/
// @grant        none
// @namespace https://greasyfork.org/users/12022
// @downloadURL https://update.greasyfork.org/scripts/10267/Agar%20Movement%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/10267/Agar%20Movement%20Keys.meta.js
// ==/UserScript==
 
// Get canvas and create an object with (fake) mouse position properties.
var canvas = document.getElementById("canvas");
var endPoint = {clientX: innerWidth / 2, clientY: innerHeight / 2};
 
// Closure:
var handleKeys = (function() {
    
    // KeyCodes and an object for storing key states.
    var keys = [37, 38, 39, 40, 83, 69, 70, 68];
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
            var point = (keyState === "keydown") ? 1000 : -1000;
            
            // Invert value if direction is left or up.
            point = (direction === "left" || direction === "up") ? -point : point;
            
            // Add point to fake mouse position property.
            endPoint[axis.value] += point;
            
            // Return true to send the movement.
            return true;
        }
    };
})();
 
// Send all key events to handleKeys.
["keydown", "keyup"].forEach(function(keyState) {
    window.addEventListener(keyState, function(event) {
        
        // Send movement if handleKeys returns true.
        if (handleKeys(event, keyState)) canvas.onmousedown(endPoint);
    }, false);
});
 
// Stop the default mouse move behavior.
(function nullMouseMove(startTime) {
    if (Date.now() - startTime > 5000) return;
    if (!canvas.onmousemove) return setTimeout(nullMouseMove, 0, startTime);
    canvas.onmousemove = null;
})(Date.now());