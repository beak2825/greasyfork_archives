// ==UserScript==
// @name          DONE - Visual Sign Of A Loaded Page
// @namespace     http://userscripts.org/users/23652
// @description   Shows a big DONE sign when the page is fully loaded
// @include       http://*.*/*
// @include       https://*.*/*
// @copyright     JoeSimmons
// @version       1.0.3
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/3983/DONE%20-%20Visual%20Sign%20Of%20A%20Loaded%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/3983/DONE%20-%20Visual%20Sign%20Of%20A%20Loaded%20Page.meta.js
// ==/UserScript==

+function () {
    'use strict';

    // temporary fade function until I implement one in JSL
    function fade(dir, element) {
        var interval = 0.05,
            fps = Math.floor(1000 / 60),
            count, intv;

        function anim() {
            var curOpacity = parseFloat(element.style.opacity);

            if (dir === 'in') {
                if (curOpacity >= 1) {
                    count = 1;
                    element.style.opacity = '1';
                    window.clearInterval(intv);
                } else {
                    element.style.opacity = (count += interval);
                }
            } else if (dir === 'out') {
                if (curOpacity <= 0) {
                    count = 0;
                    element.style.opacity = '0';
                    element.style.display = 'none';
                    window.clearInterval(intv);
                } else {
                    element.style.opacity = (count -= interval);
                }
            }
        }

        if (typeof element === 'string') {
            element = document.getElementById(element);
        }

        if (dir === 'in') {
            element.style.opacity = '0';
            count = 0;

            if (element.style.display === 'none') {
                element.style.display = '';
            }
        } else if (dir === 'out') {
            element.style.opacity = '1';
            count = 1;
        } else {
            return;
        }

        intv = window.setInterval(anim, fps);
    }

    // runAfterPageIdle by JoeSimmons
    // supply it a function and it will run when the page stops mutating
    function runAfterPageIdle(fn) {
        var time = Date.now(),
            set = window.setInterval.bind(window),
            clear = window.clearInterval.bind(window),
            idleTime = 499, // adjustable -- the user's function runs after this idle length; in ms
            freezeCalled = false,
            listenIntv;

        function listen(a) {
            var now = Date.now(); // why call Date.now() twice? :)

            if (typeof a === 'undefined' && (now - time) > idleTime) {
                // clear if it's been idle for the set length of time
                checkFreezing();
            } else if (typeof a === 'object') {
                // reset if it hasn't been idle for the set length of time
                time = now;
            }
        }

        function checkFreezing() {
            var firstTime = Date.now(),
                lastTime = firstTime,
                endOnShortInterval = false,
                freezingIntv;

            // this script has the possibility of checking for freezing twice,
            // but we only want it to run once, regardless of which function calls it first
            if (freezeCalled === true) { return; }
            freezeCalled = true;

            function monitor() {
                var now = Date.now(),
                    diff = now - lastTime;

                if (diff < 41 && endOnShortInterval === true || (now - firstTime) > 499) {
                    clear(freezingIntv);
                    done();
                } else if (diff > 299) {
                    endOnShortInterval = true;
                }
            }

            freezingIntv = set(monitor, 20);
        }

        function done() {
            // clear the interval
            clear(listenIntv);

            // remove listeners
            document.removeEventListener('DOMSubtreeModified', listen, false);
            document.removeEventListener('DOMNodeInserted', listen, false);
            document.removeEventListener('DOMNodeRemoved', listen, false);

            // run user at next event loop slot
            window.setTimeout(fn, 0);
        }

        if (typeof JSL !== 'undefined' && typeof JSL.setInterval === 'function' && typeof JSL.clearInterval === 'function') {
            set = JSL.setInterval.bind(JSL);
            clear = JSL.clearInterval.bind(JSL);
        }

        if (typeof fn === 'function') {
            listenIntv = set(listen, 125); // check 8 times per second

            // set listeners
            document.addEventListener('DOMSubtreeModified', listen, false);
            document.addEventListener('DOMNodeInserted', listen, false);
            document.addEventListener('DOMNodeRemoved', listen, false);

            window.addEventListener('load', function () {
                window.setTimeout(checkFreezing, 0);
            }, false);
        }
    }

    function main() {
        var box = document.createElement('div'),
            boxWidth = Math.floor(window.innerWidth * 0.95),
            oldTitle;

        GM_addStyle('' +
            '#load_sign { ' +
                'background: #D7FFD7; ' +
                'border: 3px ridge #008000; ' +
                'color: #00C400; ' +
                'display: block; ' +
                'font-style: Arial; ' +
                'font-size: 24pt; ' +
                'height: 42px; ' +
                'left: ' + (window.innerWidth / 2 - boxWidth / 2) + 'px; ' + // division comes first here so it works
                'margin: 0 auto; ' +
                'min-height: 42px; ' +
                'padding: 4px 0; ' +
                'position: fixed; ' +
                'text-align: center; ' +
                'text-shadow: 2px 2px 4px #C7C7C7; ' +
                'top: 0; ' +
                'width: ' + boxWidth + 'px; ' +
                'z-index: 2100100100; ' +
            '}' +
        '');

        box.id = 'load_sign';
        box.appendChild( document.createTextNode('DONE') );
        document.body.appendChild(box);

        // add done to the title
        oldTitle = document.title;
        document.title = '[DONE] ' + oldTitle;

        window.setTimeout(function () {
            fade('out', 'load_sign');
            document.title = oldTitle;
        }, 750);
    }

    // make sure the page is not in a frame
    if (window.frameElement || window !== window.top) { return; }

    runAfterPageIdle(main);
}();