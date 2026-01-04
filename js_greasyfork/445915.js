// ==UserScript==
// @name         Livesicilia remove rubbish
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all target="_blank" attrs from all links
// @author       You
// @match        https://livesicilia.it/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userscript.zone
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445915/Livesicilia%20remove%20rubbish.user.js
// @updateURL https://update.greasyfork.org/scripts/445915/Livesicilia%20remove%20rubbish.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    // the guts of this userscript
    function main() {
        // Note, jQ replaces $ to avoid conflicts.
        $("[target='_blank']").each((w,e)=> {$(e).removeAttr("target");});
    }

    // load jQuery and execute the main function
    addJQuery(main);

})();