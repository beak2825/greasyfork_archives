// ==UserScript==
// @name         Reverse submit fields
// @version      0.1
// @description  Reverses the url and title fields in Reddit link submit pages
// @author       Alpacalex
// @match        https://www.reddit.com/r/*/submit
// @grant        none
// @namespace https://greasyfork.org/users/6644
// @downloadURL https://update.greasyfork.org/scripts/25032/Reverse%20submit%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/25032/Reverse%20submit%20fields.meta.js
// ==/UserScript==

function main() {
    var title = jQ('#title-field').parent();
    title.detach();
    jQ('#url-field').parent().prepend(title);
}

addJQuery(main);

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