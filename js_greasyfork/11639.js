// ==UserScript==
// @name         osu! profile HL
// @namespace    
// @version      0.2
// @description  highlights all plays that player got in last 14days
// @author       Piotrekol
// @match        *://osu.ppy.sh/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11639/osu%21%20profile%20HL.user.js
// @updateURL https://update.greasyfork.org/scripts/11639/osu%21%20profile%20HL.meta.js
// ==/UserScript==

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

addJQuery(function() {
    var NOW = new Date();
    NOW.setDate(NOW.getDate() - 14);
    $('#leader').bind('DOMNodeInserted', function(event) {            
            jQ('#leader .timeago').each(function() {
                if (new Date(this.attributes.datetime.value) > NOW)
                    jQ(this.parentNode.parentNode.parentNode).css({
                        "background-color": "lightgreen"
                    });
            });
    });
});