// ==UserScript==
// @name       Pr0gramm Joystick Controls
// @namespace  http://skipcast.net
// @version    0.21
// @description  Enables joystick controls for pr0gramm.
// @match      *pr0gramm.com/*
// @copyright  2014+, Jonathan Lindahl
// @downloadURL https://update.greasyfork.org/scripts/3660/Pr0gramm%20Joystick%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/3660/Pr0gramm%20Joystick%20Controls.meta.js
// ==/UserScript==

/*
 * Controls:
 * DPad Left = Previous Image.
 * DPad Right = Next Image.
 * DPad Up/Down = Scroll up/down the page.
 * L1 + R1 = Reload page to latest entries.
 * Y = Toggle mode.
 * 
 * Scroll mode:
 * Left stick = Scroll up/down the page with better accuracy.
 * Right stick = Scroll up/down the page faster combined with left stick.
 * 
 * Mouse mode:
 * Left stick = Scroll up/down the page.
 * Right stick: Move mouse.
 * X: Click.
 * B: Back.
 * */

// Use this to get button indices: http://www.html5rocks.com/en/tutorials/doodles/gamepad/gamepad-tester/tester.html
var BTN_X = 0;
var BTN_B = 1;
var BTN_Y = 3;
var BTN_TAB_LEFT = 4;
var BTN_TAB_RIGHT = 5;
var BTN_UP = 12;
var BTN_DOWN = 13;
var BTN_LEFT = 14;
var BTN_RIGHT = 15;
var SCROLL_SPEED = 15;
var MOUSE_SPEED = 20;

var oldLeft = false;
var oldRight = false;
var oldX = false;
var oldY = false;
var oldB = false;

var State = {
    scroll: 0,
    mouse: 1
};

var currentState = State.scroll;
var cursorNode = null;
var overlayNode = null;
var mousePosition = [0.5, 0.5];
var mouseHotzone = [0, 0];

function scrollUp(multiplier)
{
    var top = $("body").scrollTop();
    $("body").scrollTop(top - (SCROLL_SPEED * multiplier));
}

function scrollDown(multiplier)
{
    var top = $("body").scrollTop();
    $("body").scrollTop(top + (SCROLL_SPEED * multiplier));
}

function scrollLeft()
{
    var streamPrevNode = $("#stream-prev");
    
    if (window.location.pathname != "/")
        streamPrevNode.click();
}

function scrollRight()
{
    var streamNextNode = $("#stream-next");
    
    if (window.location.pathname != "/")
    {
        try
        {
            streamNextNode.click();
        }
        catch (error) {}
    }
    else
    {
        $(".stream-row a img").first().click();
    }
}

function pollJoystickInput()
{
    var gamepads = navigator.getGamepads();
    
    for(var i = 0; i < gamepads.length; ++i)
    {
        var gamepad = gamepads.item(i);
        
        if (gamepad != null)
        {
            var buttons = gamepad.buttons;
            var axes = gamepad.axes;
            var upKey = buttons[BTN_UP];
            var downKey = buttons[BTN_DOWN];
            var leftKey = buttons[BTN_LEFT];
            var rightKey = buttons[BTN_RIGHT];
            var tabLeft = buttons[BTN_TAB_LEFT];
            var tabRight = buttons[BTN_TAB_RIGHT];
            var yKey = buttons[BTN_Y];
            var xKey = buttons[BTN_X];
            var bKey = buttons[BTN_B];
            
            if (leftKey.pressed && !oldLeft)
            {
                scrollLeft();
            }
            else if (rightKey.pressed && !oldRight)
            {
                scrollRight();
            }
            
            if (upKey.pressed)
            {
                scrollUp(1);
            }
            if (downKey.pressed)
            {
                scrollDown(1);
            }
            
            if (Math.abs(axes[0]) > 0.01 || Math.abs(axes[1]) > 0.01 || Math.abs(axes[2]) > 0.01 || Math.abs(axes[3]) > 0.01)
            {
                var multiplier = axes[3];
                
                if (currentState == State.scroll)
                    multiplier += axes[1];
                
                if (Math.abs(multiplier) > 1)
                    multiplier *= (Math.abs(multiplier) - 1) + 1;
                
                if (currentState == State.mouse)
                {
                    moveMouse(axes[0] * MOUSE_SPEED, axes[1] * MOUSE_SPEED);
                }
                
                scrollDown(multiplier);
            }
            
            if (tabLeft.pressed && tabRight.pressed)
            {
                window.location.href = "/";
            }
            
            if (yKey.pressed && !oldY)
            {
                toggleState();
            }
            
            if (bKey.pressed && !oldB)
            {
                if (window.location.pathname != "/")
                	window.history.back();
                else
                    window.location.reload();
            }
            
            if (currentState == State.mouse && xKey.pressed && !oldX)
            {
                var mousePos = getFixedMousePos();
                
                cursorNode.hide(); // Prevent elementFromPoint from getting cursor element.
                var elmAtMouse = document.elementFromPoint(mousePos[0] + mouseHotzone[0], mousePos[1] + mouseHotzone[1]);
                cursorNode.show();
                $(elmAtMouse).click();
            }
            
            oldLeft = leftKey.pressed;
            oldRight = rightKey.pressed;
            oldY = yKey.pressed;
            oldX = xKey.pressed;
            oldB = bKey.pressed;
        }
    }
    
    requestAnimationFrame(pollJoystickInput);
}

requestAnimationFrame(pollJoystickInput);

var overlayTimeout = null;
function alertOverlay(message)
{
    if (overlayTimeout != null)
        clearTimeout(overlayTimeout);
    
    $("#joystickOverlay").html(message);
    $("#joystickOverlay").stop().fadeIn(50, function()
                                 {
                                     overlayTimeout = setTimeout(function()
                                                {
                                                    $("#joystickOverlay").fadeOut(200);
                                                }, 1250);
                                 });
}

function toggleState(doAlert)
{
    doAlert = doAlert != null ? doAlert : true;
    
    if (currentState == State.scroll)
    {
        $("#cursor").show();
        
        currentState = State.mouse;
        
        if (doAlert)
        	alertOverlay("Changed mode to mouse.");
    }
    else
    {
        $("#cursor").hide();
        
        currentState = State.scroll;
        
        if (doAlert)
        	alertOverlay("Changed mode to scroll.");
    }
    
    saveState();
}

function saveState()
{
    localStorage.setItem("joystick_LastState", currentState);
}

function loadState()
{
    var lastState = parseInt(localStorage.joystick_LastState);
    var lastMousePosX = parseFloat(sessionStorage.getItem("joystick_LastMousePosX"));
    var lastMousePosY = parseFloat(sessionStorage.getItem("joystick_LastMousePosY"));
    mousePosition[0] = isNaN(lastMousePosX) ? 0.5 : lastMousePosX;
    mousePosition[1] = isNaN(lastMousePosY) ? 0.5 : lastMousePosY;
    setMousePos();
    
    if (isNaN(lastState))
    {
        localStorage.setItem("joystick_LastState", State.scroll);
    }
    else
    {
        if (lastState == State.mouse) // Is scroll by default.
            toggleState(false);
    }
}

function moveMouse(x, y)
{
   	var addX = x / window.innerWidth;
    var addY = y / window.innerHeight;
    mousePosition = [mousePosition[0] + addX, mousePosition[1] + addY];
    if (mousePosition[0] < 0)
        mousePosition[0] = 0;
    else if (mousePosition[0] > 1)
        mousePosition[0] = 1;
        
    if (mousePosition[1] < 0)
        mousePosition[1] = 0;
    else if (mousePosition[1] > 1)
        mousePosition[1] = 1;
    
    sessionStorage.setItem("joystick_LastMousePosX", mousePosition[0]);
    sessionStorage.setItem("joystick_LastMousePosY", mousePosition[1]);
    setMousePos();
}

function setMousePos()
{
    $("#cursor").css(
    {
        left: (window.innerWidth * mousePosition[0]) - mouseHotzone[0],
        top: (window.innerHeight * mousePosition[1]) - mouseHotzone[1]
    });
}

function getFixedMousePos()
{
    var cursorNode = $("#cursor");
    var pos = cursorNode.position();
    
    return [pos.left, pos.top];
}

$(function()
{
    cursorNode = $(document.createElement("div"));
    cursorNode.attr("id", "cursor");
    cursorNode.css(
        {
            backgroundImage: "url(http://i.imgur.com/asuC1of.png)", // Better way to get image? base64 strings doesn't work for some reason.
            position: "fixed",
            top: "50%",
            left: "50%",
            width: 16,
            height: 24,
            "z-index": 1000001,
            display: "none"
        });
    
    $("body").append(cursorNode);
    
    overlayNode = $(document.createElement("div"));
    overlayNode.attr("id", "joystickOverlay");
    overlayNode.css(
        {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            position: "fixed",
            left: 0,
            right: 0,
            top: 200,
            height: 100,
            "line-height": "100px",
            color: "#FFF",
            "text-align": "center",
            "font-size": 30,
            "z-index": 1000000,
            display: "none"
        });
    
    $("body").append(overlayNode);
    
    $(window).resize(function()
    {
        setMousePos();
    });
    
    loadState();
});