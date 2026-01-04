// ==UserScript==
// @name         Scroll page on double tap (mobile)
// @description  This userscript is designed for mobile browsers, and scrolls page on double tap. Top half of the screen scrolls up, and bottom half scrolls down. Double tap and move finger enables fast scrolling mode. When page is already scrolling, single tap will scroll it further.
// @description:ru Этот скрипт разработан для мобильных браузеров, и прокручивает страницу при двойном нажатии. Верхняя половина экрана прокручивает вверх, а нижняя половина — вниз. Двойное нажатие и движение пальцем включает режим быстрой прокрутки. Когда страница уже прокручивается, одиночный тап прокрутит её дальше.
// @version      1.0.2
// @author       emvaized
// @license      MIT
// @namespace    scroll_page_on_double_tap
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514788/Scroll%20page%20on%20double%20tap%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514788/Scroll%20page%20on%20double%20tap%20%28mobile%29.meta.js
// ==/UserScript==

/* *** Changelog
1.0.2
- switched to screenY instead of clientY to determine screen halves
- reordered config variables for better relevance

1.0.1
- implemented fling (kinetic) scrolling
- make preventing first tap toggleable, and disable by default
- implemented fast scrolling on double tap + move (enabled by default)

1.0.0 
Initial release
*** */

(function() {
    'use strict';

    // Configs
    const fastScrollingEnabled = true; // To enter fast scrolling mode, double tap and move finger on a second tap
    const fastScrollingFriction = 0.93; // Multiplier for dy touch movement during fast scrolling
    const scrollVelocity = 13.5; // Initial speed of the scroll (higher values will make it faster)
    const scrollDecay = 0.98; // The rate at which the scroll slows down (values closer to 1 will make the scroll slower to decelerate) 
    const scrollInterval = 8; // Time in milliseconds between each scroll step (16 ms gives approximately 60 frames per second)
    const doubleTapTimeout = 200; // Timeout for second tap in milliseconds
    const maxTapMovement = 10; // Maximum touch movement (in pixels) to qualify as a tap
    const preventFirstTap = false; // With this flag script will block the first tap on page and wait for the second tap. Allows to double tap links and images to scroll, but causes issues 

    // Service variables
    let lastTapUpTime = 0; // To track timing between taps
    let firstTapEvent = null; // To store the first tap event details
    let startX = 0; // Start position for touch
    let startY = 0;
    let isFastScrolling = false; // Manual scroll mode on double tap + move
    let lastMoveY; // Last Y position for manual scrolling
    let doubleTapDownTimeout;
    let lastTapDownTime = 0; // To track timing between taps
    let preventFlingScrolling = false; // Use to stop fling scroll when user manually scrolled page
    let isFlingScrolling = false; // To track if page is currently in kinetic scrolling state

    document.addEventListener('touchstart', function(event) {
        // Only handle single-finger touches
        if (event.touches.length === 1) {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            
            // Reset variables from last taps
            lastMoveY = null;
            preventFlingScrolling = false;

             // Detect double tap for manual scrolling
             const currentTapDownTime = new Date().getTime();
             const tapDownInterval = currentTapDownTime - lastTapDownTime;
 
            if (fastScrollingEnabled && tapDownInterval < doubleTapTimeout && tapDownInterval > 0) {
                // Double-tap detected within timeout
                cancelEvent(event);

                // Enable manual scrolling mode
                doubleTapDownTimeout = setTimeout(() => {
                    isFastScrolling = true;
                }, doubleTapTimeout);
            } else {
                // First tap: store the event and set timeout for single-tap action
                lastTapDownTime = currentTapDownTime;
                isFastScrolling = false;
                if (preventFirstTap) cancelEvent(event);
            }
        }
    },  { passive: fastScrollingEnabled || preventFirstTap ? false : true}, true);

    if (fastScrollingEnabled)
        window.addEventListener('touchmove', function(event){
            if ((isFastScrolling || isFlingScrolling) && event.touches.length === 1) {
                
                const currentMoveY = event.touches[0].clientY;
                if(!lastMoveY) lastMoveY = currentMoveY;
                const scrollDelta = lastMoveY - currentMoveY;
                const scrollDeltaAbs = Math.abs(scrollDelta);
                
                if(isFastScrolling){
                    // Prevent default action (scrolling page)
                    cancelEvent(event);
                    
                    lastMoveY = currentMoveY;
                    if(scrollDeltaAbs > 0.3) 
                        flingScroll(
                            window, 
                            (fastScrollingFriction * scrollDelta) * 2, 
                            scrollDecay, scrollInterval
                        );

                } else if(isFlingScrolling && scrollDeltaAbs > 0.3) {
                    isFlingScrolling = false;
                    preventFlingScrolling = true;
                }
            }
        }, { passive: false }, true)

    document.addEventListener('touchend', function(event) {
        // Only proceed if it’s a single-finger touch event
        if (event.changedTouches.length > 1) return;

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);

        // If movement exceeds maxTapMovement, consider it a scroll/swipe and ignore
        if (deltaX > maxTapMovement || deltaY > maxTapMovement) return;

        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapUpTime;

        // Disable manual scrolling mode
        isFastScrolling = false;
        clearTimeout(doubleTapDownTimeout);

        // Scroll up if tapped in top half of the screen, scroll down if tapped in bottom half
        const scrollDown = event.changedTouches[0].screenY > (window.screen.height / 2);

        if (tapInterval < doubleTapTimeout && tapInterval > 0) {
            // Double-tap detected within timeout
            
            // Prevent default action (including link navigation)
            cancelEvent(event);
        
            // Execute custom double-tap action: scroll down
            scrollPage(scrollDown);

            // Reset stored event and timing
            lastTapUpTime = 0;
            firstTapEvent = null;
        } else {
            // First tap
            // If kinetic scrolling in proccess, scroll again
            if(isFlingScrolling){
                cancelEvent(event);
                scrollPage(scrollDown);
                return;
            }

            // Store the event and set timeout for single-tap action
            firstTapEvent = event;
            lastTapUpTime = currentTime;

            setTimeout(() => {
                // If no second tap, execute single-tap action
                if (preventFirstTap && firstTapEvent && !isFlingScrolling && !isFastScrolling) {
                    if(isFlingScrolling) return;

                    // Prevent default action
                    event.preventDefault(); 
                    event.stopPropagation();

                    // Create and dispatch a manual click event
                    const singleClickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                        detail: 1,
                        view: window,
                    });
                    firstTapEvent.target.dispatchEvent(singleClickEvent);
                }
                firstTapEvent = null;
            }, doubleTapTimeout);
        }
    },  { passive: false }, true);

    // Prevent regular scrolling when manual scroll is in progress
    if (fastScrollingEnabled){
        document.addEventListener('wheel', function(e) { 
            if(isFastScrolling) cancelEvent(event);
        }, { passive: false });
    
        document.addEventListener('scroll', function(e) { 
            if(isFastScrolling) cancelEvent(event);
        }, { passive: false });
    }
    
    // Scroll page up or down
    function scrollPage(scrollDown){
        flingScroll(
            document.scrollingElement, 
            (scrollDown ? 1 : -1) * 
                scrollVelocity / window.visualViewport.scale,
            scrollDecay, 
            scrollInterval
        )
    }

    // Prevent default event action
    function cancelEvent(event){
        event.preventDefault(); 
        event.stopPropagation();
        // event.stopImmediatePropagation();
    }

    // For fling scroll (kinetic scrolling)
    function flingScroll(element, velocity = 13.5, decay = 0.98, interval = 8) {
        let currentVelocity = velocity; // initial velocity of the fling scroll

        function scrollStep() {
            isFlingScrolling = true;
            
            if(preventFlingScrolling && !isFastScrolling) {
                isFlingScrolling = false;
                return;
            }
            // Scroll the element by the current velocity
            element.scrollBy({
                left: 0,
                top: currentVelocity,
                behavior: "instant"
            });

            // Reduce the velocity to simulate natural slowing down
            currentVelocity *= decay;

            // Stop scrolling if the velocity is very low
            if (Math.abs(currentVelocity) > 1) {
                setTimeout(scrollStep, interval);
            } else { 
                isFlingScrolling = false; 
            }
        }
        // Start the fling scroll
        scrollStep();
    }
})();