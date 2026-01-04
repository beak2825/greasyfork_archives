// ==UserScript==
// @name         Let Me Out | TM Edition
// @namespace    tedbigham.blogspot.com
// @version      1.3
// @description  Prevents actions (like alerts) when navigating away from a page.
// @author       Ted Bigham
// @license MIT
// @match        *://*/*
// @icon         https://lh3.googleusercontent.com/UQFgp7s3-HgSxCENa2xNzGQAJhbA6r4VkY1iLAuZrtTBkEQ3cidC5CrkzpyjwYyPK9sXTAECWz1ab_ZJJyLnc96YoKQ=s60
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527631/Let%20Me%20Out%20%7C%20TM%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/527631/Let%20Me%20Out%20%7C%20TM%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Before injection
    var beforeScript = document.createElement('script');
    beforeScript.textContent = `
        Window.prototype.addEventListener2 = Window.prototype.addEventListener;
        Window.prototype.addEventListener = function(type, listener, useCapture) {
            if (type != "beforeunload") {
                addEventListener2(type, listener, useCapture);
            }
        }
    `;
    (document.head||document.documentElement).insertBefore(beforeScript, (document.head||document.documentElement).firstChild);
    beforeScript.onload = function() {
        this.parentNode.removeChild(this);
    };

    // After injection
    var afterScript = document.createElement('script');
    afterScript.textContent = `
        function letmeout() {
            var all = document.getElementsByTagName("*");
            for (var i=0, max=all.length; i < max; i++) {
                if(all[i].getAttribute("onbeforeunload")) {
                    all[i].setAttribute("onbeforeunload", null);
                }
            }
            window.onbeforeunload = null;
        }
        letmeout();
        setInterval(letmeout, 500);
    `;
    (document.head||document.documentElement).appendChild(afterScript);
    afterScript.onload = function() {
        this.parentNode.removeChild(this);
    };

})();