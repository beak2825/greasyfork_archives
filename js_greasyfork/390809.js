// ==UserScript==
// @name         soundcloud scroll queue
// @version      1.0.1
// @description  Adds a button that automatically scrolls the queue until disabled
// @author       bhackel
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @namespace https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/390809/soundcloud%20scroll%20queue.user.js
// @updateURL https://update.greasyfork.org/scripts/390809/soundcloud%20scroll%20queue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Injects a button into the Next Up queue that runs the script.
    */
    function setup() {
        var btn = document.createElement('Button');
        btn.className = 'bhackelSCScroll sc-button sc-button-medium';
        btn.innerHTML = 'Scroll Down';
        btn.onclick = function(){ start(this); };

        var queue_panel = document.getElementsByClassName('queue__panel')[0];
        if (queue_panel) {
            queue_panel.insertBefore(btn, queue_panel.children[1]);
        } else {
            setTimeout(setup, 1000);
        }
    }

    /* Function called by the button being clicked. Either creates
    an interval to run the scroll function or clears the current interval.
    */
    function start(d){
        if (d.interval){
            clearInterval(d.interval);
            d.interval = 0;
            d.innerHTML = 'Scroll Down';
        } else {
            d.interval = setInterval(scroll, 1000);
            d.innerHTML = 'Stop Scrolling';
        }
    }

    /* Scrolls the queue down to a pixel value, found in one of the
    heights of one of the elements.
    */
    function scroll() {
        var scrollableQueue = document.getElementsByClassName('queue__scrollableInner g-scrollable-inner').item(0);
        var queueContainer = document.getElementsByClassName('queue__itemsHeight').item(0);
        var scrollToHeight = parseInt(queueContainer.style.height);
        scrollableQueue.scroll(0,scrollToHeight);
    }

    setup();

})();