// ==UserScript==
// @name Agar.io Gamepad Script
// @description  Based on WASD script by ProfessorTag and contributors
// @version      0.1
// @match        http://agar.io/
// @grant        none
// @namespace https://greasyfork.org/users/12767
// @downloadURL https://update.greasyfork.org/scripts/10668/Agario%20Gamepad%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/10668/Agario%20Gamepad%20Script.meta.js
// ==/UserScript==
 
// Get canvas and create an object with (fake) mouse position properties.
var canvas = document.getElementById("canvas");
var endPoint = {clientX: innerWidth / 2, clientY: innerHeight / 2};
var gamepadIndex = -1; // -1 means M+KB 
var currentGamepad;
var pressedButtons = [];
var holdMoveEvent = null;
var lastStickMag = 0;
var last_x = 0;
var last_y = 0;

var ButtonStates = {
    UP: -1,
    DOWN: 1,
    IDLE: 0
};

jQuery.fn.simulateKeyDown = function (character) {
  jQuery(this).trigger({ type: 'keydown', keyCode: character });
};

jQuery.fn.simulateKeyUp = function (character) {
  jQuery(this).trigger({ type: 'keyup', keyCode: character });
};
 
// Stop the default mouse move behavior.
(function nullMouseMove(startTime) {
    if (Date.now() - startTime > 5000) return;
    if (!canvas.onmousemove) return setTimeout(nullMouseMove, 0, startTime);
    holdMoveEvent = canvas.onmousemove;
    canvas.onmousemove = null;
})(Date.now());

function canGame() {
     return "getGamepads" in navigator;   
}

function refreshGamepadList() {
    var gamepadList = navigator.getGamepads();
    
    console.log(gamepadList);
    
    for(var i = 0; i < gamepadList.length; i++) {
        var gamepad = gamepadList[i];
        
        if(gamepad === undefined)
            return;
        
        var padLookup  = $("#gamepads #gp" + gamepad.index);
        if(padLookup.length > 0) {
            $(padLookup).addClass("isconnected");
        } else {
            $("#gamepads").append('<option class="gamepad isconnected" value="' + gamepad.index + '" id="gp' + gamepad.index +'">' + gamepad.id + '</option>');
        }
    }
    
    $("#gamepads option.gamepad:not(.isconnected)").remove();
}

$(document).ready(function() {
    if(!canGame()) {
        console.log("Gamepad API not supported");
        return;
    }
    
    $(window).on('keydown', function(event) {
        if (event.repeat && event.type === "keydown") return;
       
               
        if (event.which == 82 && event.type === "keydown") {
            if (canvas.onmousemove == null) {
                canvas.onmousemove = holdMoveEvent;
            } else {
                canvas.onmousemove = null;
            }
           
            return;
        }
    });
    
    $(window).on('blur resize', function() {
        endPoint = {clientX: innerWidth / 2, clientY: innerHeight / 2};
        canvas.onmousedown(endPoint);
    });
    
    $("#helloDialog #playBtn").click(function() {
        if(gamepadIndex < 0)
            canvas.onmousemove = holdMoveEvent;
    });
    
    $("#helloDialog #region").parent().after('<div class="form-group"><select id="gamepads" class="form-control"><option value="-1" class="mkb">Mouse &amp; Keyboard</option></select></div>');
    
    $("#gamepads").change(function() {
        gamepadIndex = $("#gamepads").val(); 
        
        if(gamepadIndex >= 0)
            currentGamepad = navigator.getGamepads()[gamepadIndex];
    });
    
    $(window).on("gamepadconnected", function(e) {
        refreshGamepadList();
    });
    
    $(window).on('gamepaddisconnected', function(e) {
        refreshGamepadList();
    });
    
    refreshGamepadList();
    
    requestAnimationFrame(handleGamepadLoop);
});

function ButtonDown(gamepad, buttonIndex) {
    var findButton = $.inArray(buttonIndex, pressedButtons);
    
    if(gamepad.buttons[buttonIndex].pressed) {
        if(findButton === -1) {
            pressedButtons.push(buttonIndex);
            return ButtonStates.DOWN;
        }
    } else {
        if(findButton != -1) {
            pressedButtons.splice(findButton, 1);
            return ButtonStates.UP;
        }
    }
    
    return ButtonStates.IDLE;
}

function handleGamepadLoop() {
    setTimeout(handleGamepadLoop, 16);
    
    if(gamepadIndex < 0)
        return;
    
    var gamepad = navigator.getGamepads()[gamepadIndex];
    
    if(gamepad == undefined) {
        canvas.onmousemove = holdMoveEvent; // Gamepad's gone, let the mouse come back.
        return;
    }
    
    var x_axis = gamepad.axes[0];
    var y_axis = gamepad.axes[1];
    var x_result = 0;
    var y_result = 0;
    
    var stickMag = Math.sqrt((x_axis * x_axis) + (y_axis * y_axis));
    
    if(stickMag >= 0.5) { // Our dead-zone.
        // Normalise and * 500
        x_result = (x_axis / stickMag) * 500;
        y_result = (y_axis / stickMag) * 500;
    } else if(lastStickMag >= 0.5) { // Stick has only just come off
        x_result = last_x / 8;
        y_result = last_y / 8;
    }
        
    last_x = x_result;
    last_y = y_result;
    lastStickMag = stickMag > 0.5 ? stickMag : 0;
    
    var mouseLoc = { clientX: endPoint.clientX, clientY: endPoint.clientY};
    mouseLoc.clientX += x_result;
    mouseLoc.clientY += y_result;
    
    canvas.onmousedown(mouseLoc);
    
    // A for Split, X for W
   
    var shouldSplit = ButtonDown(gamepad, 0);
    var shouldEject = ButtonDown(gamepad, 2);
    var shouldPause = ButtonDown(gamepad, 9);
    
    /*for(var i = 0; i < gamepad.buttons.length; i++) {
        if(gamepad.buttons[i].pressed)
            console.log("Button " + i + " pressed");
    }*/
    
    if(shouldEject == ButtonStates.DOWN) {
        $(window).simulateKeyDown(87);
    } else if(shouldEject == ButtonStates.UP) {
        $(window).simulateKeyUp(87);   
    }

    if(shouldSplit == ButtonStates.DOWN) {
         $(window).simulateKeyDown(32);
    } else if(shouldSplit == ButtonStates.UP) {
        $(window).simulateKeyUp(32);
    }
    
    if(shouldPause == ButtonStates.DOWN) {
        if($("#overlays").css('display') == "none") {
            $(window).simulateKeyDown(27);
        } else {
            $("#playBtn").click();
        }
    } else if(shouldPause == ButtonStates.UP) {
         $(window).simulateKeyUp(27);   
    }
};