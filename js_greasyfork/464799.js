// ==UserScript==
// @name         CheckinSuite
// @namespace    https://github.com/frosn0w/iOSscripts
// @version      1.2.1
// @description  Checkin all in one
// @author       frosn0w
// @match        https://xue.alibaba-inc.com/trs/xue/home*
// @match        https://hifini.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAFVBMVEVHcEwzMzIzMzI6OjYnJywzMzIzMzJtKzdZAAAAB3RSTlMAzf8CArThzF+FCQAAAERJREFUeAFjAAJGATiGACYFGMYqYKiEAkQYglAFVBmUULUoYRVgS4BhqAACkC/ApKTAoKQEoggLDHVDKRfAjDlWVIEAALtyGcbXf1bkAAAAAElFTkSuQmCC
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464799/CheckinSuite.user.js
// @updateURL https://update.greasyfork.org/scripts/464799/CheckinSuite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Define timer
    var timer = setInterval(function(){
        // find all spans
        var spans = document.querySelectorAll("span");
        var divs = document.querySelectorAll("div");
        for (var i = 0; i < spans.length; i++) {
            //alilearn
            if (spans[i].getAttribute("class") === "next-btn-helper" && spans[i].innerText === "签到") {
                spans[i].click();
            }
            else continue;
        }
        for (var j = 0; j < divs.length; j++){
            //hifini
            if (divs[j].getAttribute("id") === "sign" && divs[j].innerText === "签到") {
                divs[j].click();
            }
            else continue;
        }
    }, 1500);
})();
