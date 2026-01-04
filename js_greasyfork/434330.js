    // ==UserScript==
    // @name        22 oct 2021
    // @namespace   Automation
    // @description Hold q or w key to repeatedly click element under mouse
    // @version     1.0
    // @include     http:*
    // @include     https:*
    // @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434330/22%20oct%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/434330/22%20oct%202021.meta.js
    // ==/UserScript==
    /** 
     * Summary: Upon activation clicks element under mouse.
     * @param {number} [rate] - Timeout between clicks in milliseconds; Default: 500
     * @author hjjk jujki
     */
    function AutoClick(rate = 500) {
        if (window.attachEvent) {
            document.attachEvent("onmousemove", MouseMv);
        } else {
            document.addEventListener("mousemove", MouseMv, false);
        }
        document.addEventListener('keydown', KeyDown);
     
        /**
         * Summary: Listens for mouse movment and exports position to variables x & y.
         * @param {Event} e 
         */
        function MouseMv(e) {
            if (!e) e = window.event;
     
            if (typeof e.pageY == 'number') {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
        }
     
        /**
         * Summary: Listens for keydown event
         * @param {Event} e 
         */
        function KeyDown(e) {
            if (e.type == 'keydown') {
                var char = e.key
                if (char == '`' || char == '~') { 
                    setTimeout(Click(x, y), rate);
                }
            }
        }
     
        /** 
         * Summary: Clicks element at postions (x, y) on document.
         * @param {number} x - X coordinate of document element.
         * @param {number} y - Y coordinate of document element.
         */
        function Click(x, y) {
            document.elementFromPoint(x, y).click();
        }
    }
    setInterval(AutoClick(1000), 10) // Set to listen every 10ms

