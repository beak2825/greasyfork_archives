// ==UserScript==
// @name         Element Fullscreen
// @namespace    http://shitchell.com/
// @include      *
// @description  Fullscreen any element on a webpage
// @author       Shaun Mitchell <shaun@shitchell.com>
// @license      wtfpl
// @grant        GM_addStyle
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/410140/Element%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/410140/Element%20Fullscreen.meta.js
// ==/UserScript==

// Send stuff to the console
var DEBUG = false;

// Key combination to activate element selection (default is Alt-f)
var toggleElementSelectionKey = "F";
var toggleElementSelectionAlt = false;
var toggleElementSelectionCtrl = true;

// Styles and css selectors
var focusedStyle = `box-shadow: 0 3px 6px rgba(0,0,0,0.16),
                                0 3px 6px rgba(0,0,0,0.23),
                                0 3px 6px rgba(255,255,255,0.16),
                                0 3px 6px rgba(255,255,255,0.23) !important;`;
var focusedSelector = "element-f";
var fullScreenStyle = "padding: 1em !important;";
var fullScreenSelector = "element-f-fullscreen";

// Element tracking
var focusedElement = null;

// Start off not running until the defined keypress
var running = false;

function debug()
{
    if (DEBUG)
    {
        let args = Array.from(arguments);
        args.unshift("[Element-F]");
        console.log.apply(null, args);
    }
}

/*
 * Returns a boolean that describes whether or not an element is fullscreened
 */
function isFullScreen()
{
    return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
}

// Get the element directly under the mouse
// https://stackoverflow.com/a/24540416/794241
function getInnermostHovered()
{
    return [].slice.call(document.querySelectorAll(':hover')).pop();
}

/*
 * Removes any styling from any previously focused elements
 */
function resetFocused()
{
    debug("resetting any focused elements");

    // Remove the focused class from any elements that have it
    document.querySelectorAll(`.${focusedSelector}`).forEach(function(el)
    {
        el.classList.remove(focusedSelector);
        debug("CLEARED: ", el);
    });

    // Unset the focused element
    focusedElement = null;
}

/*
 * Sets the currently hovered element as the focused element and
 * unsets any previously focused elements
 */
function focusElement(el)
{
    // Make sure we're running and the element isn't already focused
    if (!running || el === focusedElement)
    {
        return false;
    }

    // Clear any previously focused elements
    resetFocused();

    // Set the focus to this element
    focusedElement = el;
    debug("FOCUS: ", el);

    // Add the hover class
    el.classList.add(focusedSelector);
}

/*
 * Grabs the element under the cursor and sets it to focused
 */
function setFocusedElement()
{
    if (!running)
    {
        return false;
    }

    let hoveredElement = getInnermostHovered();
    if (hoveredElement !== undefined)
    {
        focusElement(hoveredElement);
    }
}

/*
 * Accepts an event from a listener and then fullscreens the target element
 */
function fullScreenElement(ev)
{
    if (!running)
    {
        return false;
    }

    // Prevent whatever the event would have triggered (like following a link)
    ev.stopPropagation();
    ev.preventDefault();

    if (ev.target !== null)
    {
        let req = ev.target.requestFullScreen || ev.target.webkitRequestFullScreen || ev.target.mozRequestFullScreen;
        if (req !== undefined)
        {
            // Fullscreen the target element
            req.call(ev.target);

            // Add fullscreen class
            ev.target.classList.add(fullScreenSelector);

            // Remove the fullscreen class after we're no longer fullscreened
            ev.target.addEventListener('fullscreenchange', function exitFullScreen() {
                if (!isFullScreen())
                {
                    ev.target.classList.remove(fullScreenSelector);
                    ev.target.removeEventListener('fullscreenchange', exitFullScreen);
                }
            });

            // Make sure the target element has a background set
            ensureBackground(ev.target);

            // Stop running
            running = false;

            // Unset the target element as focused
            resetFocused();
        }
    }
}

/*
 * Returns true if the specified key combination was pressed
 * to initiate element selection.
 */
function validateKeyPress(ev)
{
    if (ev.altKey != toggleElementSelectionAlt)
    {
        return false;
    }
    if (ev.ctrlKey != toggleElementSelectionCtrl)
    {
        return false;
    }
    if (ev.key != toggleElementSelectionKey)
    {
        return false;
    }
    debug("keypress triggered");
    return true;
}

/*
 * Accepts a keypress event and then toggles running (ie, element selection mode)
 */
function toggleRunning(ev)
{
    if (validateKeyPress(ev)) {
      // Prevent whatever the keypress would have triggered
      ev.stopPropagation();
      ev.preventDefault();

      running = !running;
        debug("toggled running =>", running);

        // Remove any focused elements if not running
        if (!running)
        {
            resetFocused();
        }
    }
}

/*
 * Some elements are not set with a background color, defaulting to black in
 * fullscreen mode, which sometimes makes the text hard to read. This method
 * will check to see if an element lacks a background color and, if it does not,
 * temporarily gives it a black or white background based on its text color.
 */
function ensureBackground(el)
{
    debug("testing background for", el);

    // First check to see that there isn't a background already
    let cS = getComputedStyle(el);
    let bgColor = cS.backgroundColor;
    if (bgColor == "rgba(0, 0, 0, 0)") // no background color is set
    {
        let textColor = getComputedStyle(el).color;
        textColor = textColor.substring(textColor.indexOf('(') +1, textColor.length -1).split(', ');
        textColor = {
            'r': textColor[0],
            'g': textColor[1],
            'b': textColor[2]
        };
        bgColor = yiq(textColor.r, textColor.g, textColor.b);

        // Set the background back to nothing after we exit fullscreen
        el.addEventListener('fullscreenchange', function removeBackground()
        {
            debug("potentially removing temporary background from", el);
            // Only run if the screen changed and exited fullscreen mode
            if (!isFullScreen())
            {
                debug("removing temporary background from", el);
                el.style.backgroundColor = null;
                el.removeEventListener('fullscreenchange', removeBackground);
            }
        });
        el.style.backgroundColor = bgColor;
        debug("YIQ: Got bg color", bgColor);
    }
    return bgColor;
}

/*
 * Determines whether black or white is more appropriate for
 * a given color using YIQ computation
 */
function yiq(r, g, b)
{
    let color = Math.round(((parseInt(r) * 299) +
                            (parseInt(g) * 587) +
                            (parseInt(b) * 114)) / 1000);
    return (color > 125) ? 'black' : 'white';
}

(function()
{
    'use strict';

    // Set the style for the actively hovered element
    GM_addStyle(`.${focusedSelector} {
        cursor: crosshair !important;
        ${focusedStyle};
    }`);

    // Set the style for the fullscreened element
    GM_addStyle(`.${fullScreenSelector} {
        overflow: auto !important;
        ${fullScreenStyle};
    }`);

    // Toggle whether or not we're looking for elements based on the defined keypress
    document.body.addEventListener('keydown', toggleRunning);

    // Set the element under the cursor to the focused element (only if running)
    document.body.addEventListener('mousemove', setFocusedElement);

    // Listen for a click and fullscreen that element (only if running)
    document.body.addEventListener('click', fullScreenElement, true);
})();
