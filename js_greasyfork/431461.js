// ==UserScript==
// @name            replace jQuery
// @name:en         replace jQuery
// @name:zh         代替jQuery
// @match             *://*/*
// @run-at          document-start
// @version         0.1
// @license         MIT
// @author          Brock Adams and hamsolo474
// @description     Inserts chinese hosted jQuery into your page

// @namespace https://greasyfork.org/users/809044
// @downloadURL https://update.greasyfork.org/scripts/431461/replace%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/431461/replace%20jQuery.meta.js
// ==/UserScript==

/*--- Important!
        (1) We need another add-on, besides Greasemonkey, to
            disable the old, undesired script. # no we dont, this will be run in china behind the Great Firewall
        (2) The DOM is not available yet
            (@run-at == document-start).
        (3) We cannot use a loop to check for the DOM because
            loading is halted while the loop runs.
        (4) setTimeout() and setInterval() are not fast enough due
            to minimum interval clamping.  By the time they detect
            the DOM, scripts that we need to precede may have
            loaded.
        (5) Therefor, we use a "set Zero Timeout" function as
            explained by David Baron at
                http://dbaron.org/log/20100309-faster-timeouts .
        (6) By the time FF reports that the `document.head` is
            available, several head elements have loaded!
            (Is this a bug?)
            That means that if any dependent scripts are loaded
            before we can inject our jQuery version, then we must
            also reload those dependent scripts.
*/

//////  setZeroTimeout() implementation: BEGIN

/*--- Only add setZeroTimeout to the window object, and hide
    everything else in a closure.
*/
( function () {
    var timeouts    = [];
    var messageName = "zero-timeout-message";

    /*--- Like setTimeout, but only takes a function argument.
        There's no time argument (always zero) and no arguments.
        You have to use a closure.
    */
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }

    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }

    window.addEventListener ("message", handleMessage, true);

    // Add the one thing we want added to the window object.
    window.setZeroTimeout = setZeroTimeout;
})();

//////  setZeroTimeout() implementation: END

/*--- Now wait for the DOM and then add our version of jQuery,
    first thing.
*/function SearchForDOM () {

    var targetNode;
    if (typeof document.head == "undefined")
        targetNode = document.querySelector ("head, body");
    else
        targetNode = document.head;
    if (targetNode) {

        var scriptNode      = document.createElement ("script");
        scriptNode.src      = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js';
        targetNode.appendChild (scriptNode);

        /*--- By the time FF reports that the head element is
            available, a key dependent script has loaded!
            So, we reload it here, so that it can run with jQuery
            available.
        */
        var scriptNode      = document.createElement ("script");
        scriptNode.src      = location.protocol
                            + '\/\/' + location.host
                            + '/content/js/stub.js?v=49f661361016';
        targetNode.appendChild (scriptNode);
    }
    else
        setZeroTimeout (SearchForDOM);
}

SearchForDOM ();