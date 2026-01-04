// ==UserScript==
// @name         Smooth Scrolling
// @description  Smoothly scrolls the page when a button is held
// @version      1.1.2
// @author       sllypper
// @homepage     https://greasyfork.org/en/users/55535-sllypper
// @namespace    https://greasyfork.org/en/users/55535-sllypper
// @match        *://forums.spacebattles.com/*
// @match        *://forums.sufficientvelocity.com/*
// @match        *://forum.questionablequesting.com/*
// @match        *://fanfiction.net/*
// @match        *://archiveofourown.org/*
// @match        *://turb0translation.blogspot.com/*
// @match        *://fiction.live/*
// @grant        none
// @todo         make keybinds easily configurable
// @downloadURL https://update.greasyfork.org/scripts/423926/Smooth%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/423926/Smooth%20Scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Smooth Scrolling Settings

    // how much it scrolls every time (in pixels)
    let scrollAmount = 16;

    // how long between ticks (in ms)
    // 16.66667 = 60 frames per second
    // not used if experimental is true
    let scrollPeriod = 16.66667;

    // how much holding Shift will multiply the scrollAmount
    let shiftSpeedMod = 2.0;

    //

    // Experimental settings

    // Use the alternative experimental Scroller
    // it's bound to your screen framerate
    // is supposed to be smoother
    let experimental = true;

    // Scroll Speed in times per second
    // set to 0 to match your refresh rate (smooth perfection)
    // values above your framerate scrolls every frame
    let fps = 0

    // programming magic stuff

    const states = {
        NONE: 0,
        UP: 1,
        SHIFTUP: 2,
        DOWN: 3,
        SHIFTDOWN: 4
    }
    let scrollState = states.NONE;
    let currScrollAction = null;
    let isTyping = false;

    document.addEventListener('focus', function(evt) {
        var target = evt.target;
        if((target.nodeName === 'INPUT' && target.type === 'text') || target.nodeName === 'TEXTAREA') isTyping = true;
        // else isTyping = false;
      }, true);

    document.addEventListener('blur', function(evt) {
        var target = evt.target;
        if((target.nodeName === 'INPUT' && target.type === 'text') || target.nodeName === 'TEXTAREA') isTyping = false;
    }, true);

    document.addEventListener("keydown", event => {
        // ignore keybindings when text input is focused
        if (isTyping || event.isComposing || event.target.getAttribute('medium-editor') != null || event.target.getAttribute('contenteditable') != null) {
            //console.log('entered first if')
            event.stopPropagation();
            return;
        }
        switch (event.code) {
            case "KeyW":
            case "KeyK":
            case "ArrowUp": {
                event.preventDefault();
                if (scrollState !== states.UP && !event.shiftKey) {
                    //event.preventDefault();
                    clearScrollAction();
                    scrollState = states.UP;
                    scrollAction(-scrollAmount);
                } else if (scrollState !== states.SHIFTUP && event.shiftKey) {
                    //event.preventDefault();
                    clearScrollAction();
                    scrollState = states.SHIFTUP;
                    scrollAction(-scrollAmount*shiftSpeedMod);
                }
                break;
            }
            case "KeyS":
            case "KeyJ":
            case "ArrowDown": {
                event.preventDefault();
                if (scrollState !== states.DOWN && !event.shiftKey) {
                    // event.preventDefault();
                    clearScrollAction();
                    scrollState = states.DOWN;
                    scrollAction(scrollAmount);
                } else if (scrollState !== states.SHIFTDOWN && event.shiftKey) {
                    // event.preventDefault();
                    clearScrollAction();
                    scrollState = states.SHIFTDOWN;
                    scrollAction(scrollAmount*shiftSpeedMod);
                }
                break;
            }
        }
    });

    document.addEventListener("keyup", event => {
        switch(event.code) {
            case 'KeyW':
            case 'KeyK':
            case 'KeyJ':
            case 'KeyS':
            case 'ArrowDown':
            case 'ArrowUp':
                clearScrollAction();
                break
            default:
                // using even.key for any Shift Key
                if (event.key === "Shift") {
                    clearScrollAction();
                }
                break;
        }
    });

    function scrollAction(amount) {
        if (experimental) {
            scroller.move(amount)
            return;
        }

        currScrollAction = setInterval(() => {
            window.scrollBy(0, amount);
        }, scrollPeriod)
    }

    function clearScrollAction() {
        clearInterval(currScrollAction);
        currScrollAction = null;
        scrollState = states.NONE;
        scroller.stop();
    }

    // experimental bit

    let scroller = new Scroller(fps)

    function Scroller(fps) {

        var	delay,
            time,
            frame,
            tref,
            amount;

        function loop(timestamp) {
            if (fps !== 0) {
                // Scroll with fps behavior
                if (time === null) {time = timestamp; timestamp = 0}
                var seg = Math.floor((timestamp - time) / delay);
                if (seg > frame) {
                    frame = seg;
                    window.scrollBy(0, amount);
                }
            } else {
                // Scroll every frame behavior
                window.scrollBy(0, amount);
            }
            tref = requestAnimationFrame(loop)
        }

        this.move = function(pixels) {
            amount = pixels;
            delay = 1000 / fps;
            frame = -1;
            time = null;
            tref = requestAnimationFrame(loop);
        }

        this.stop = function() {
            cancelAnimationFrame(tref);
        };
    }

})();