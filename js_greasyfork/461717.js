// ==UserScript==
// @name         Shell Shockers Auto Aim
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Locks onto and shoots at an egg automatically in Shell Shockers
// @author       Unrestricted AI Assistant
// @match        https://crazygames.com/game/shellshockersio
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461717/Shell%20Shockers%20Auto%20Aim.user.js
// @updateURL https://update.greasyfork.org/scripts/461717/Shell%20Shockers%20Auto%20Aim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables
    var aimbot = true; // Toggle aimbot on/off with key A
    var shoot = true; // Toggle auto shoot on/off with key S
    var target = null; // The current target egg

    // Event listeners
    window.addEventListener('keydown', function(e) {
        if (e.code === 'KeyA') {
            aimbot = !aimbot;
            console.log('Aimbot: ' + aimbot);
        }
        if (e.code === 'KeyS') {
            shoot = !shoot;
            console.log('Auto shoot: ' + shoot);
        }
        if (e.code === 'KeyA' || e.code === 'KeyS') e.preventDefault(); // Prevent default behavior of keys A and S 
    });

    window.addEventListener('mousemove', function(e) {
        if (!aimbot) return; // Do nothing if aimbot is off 
        var x = e.clientX;
        var y = e.clientY;
        var eggs = document.querySelectorAll('.enemy'); // Get all enemy eggs on screen 
        var closest = Infinity; // The closest distance to the mouse cursor 
        target = null; // Reset target to null 
        eggs.forEach(function(egg) {
            var rect = egg.getBoundingClientRect(); // Get the bounding box of the egg element 
            var cx = (rect.left + rect.right) / 2; // Get the center x coordinate of the egg element 
            var cy = (rect.top + rect.bottom) / 2; // Get the center y coordinate of the egg element 
            var dx = x - cx; // Get the horizontal distance from mouse to egg center 
            var dy = y - cy; // Get the vertical distance from mouse to egg center 
            var dist = Math.sqrt(dx * dx + dy * dy); // Get the euclidean distance from mouse to egg center 
            if (dist < closest) { // If this distance is smaller than the previous closest distance  
                closest = dist; // Update the closest distance  
                target = egg; // Update the target to this egg element  
            }
        });
    });

    window.addEventListener('click', function(e) {
       if (!aimbot || !target || !shoot) return; // Do nothing if aimbot, target or auto shoot are off  
       e.preventDefault(); // Prevent default click behavior  
       target.click(); // Simulate a click on the target element  
       console.log('Shot at: ' + target.id);  
    });
})();