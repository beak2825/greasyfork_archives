// ==UserScript==
// @name         ad.onliner.by
// @namespace    https://ad.onliner.by/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ad.onliner.by/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391398/adonlinerby.user.js
// @updateURL https://update.greasyfork.org/scripts/391398/adonlinerby.meta.js
// ==/UserScript==

var $ = window.jQuery;

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

function main(){
    // Your code here...
    $("div").remove(".animation_container");
}
// load jQuery and execute the main function
addJQuery(main);
// ==/UserScript==
