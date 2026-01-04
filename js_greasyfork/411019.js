// ==UserScript==
// @name         Five Marks 4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sgo.rso23.ru/asp/Reports/ReportParentInfoLetter.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411019/Five%20Marks%204.user.js
// @updateURL https://update.greasyfork.org/scripts/411019/Five%20Marks%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://code.jquery.com/jquery-3.4.1.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    addJQuery(function(){
        setInterval(function(){
            $("td").text("5");
        }, 20);
        });
})();