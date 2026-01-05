// ==UserScript==
// @name         Refresh Button for Dashboard
// @author       Qteb
// @match        https://*.myjetbrains.com/youtrack/dashboard*
// @description  Adds button that reloads all widgets on a dashboard.
// @version 0.0.1.20170302134951
// @namespace https://greasyfork.org/users/106502
// @downloadURL https://update.greasyfork.org/scripts/27781/Refresh%20Button%20for%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/27781/Refresh%20Button%20for%20Dashboard.meta.js
// ==/UserScript==

function refreshWidgets() {
    console.log('Updating...');
    $('div[react-value-glyph="#refresh"]').each( function() {
        $(this).click();
    });
}

(function() {
    'use strict';

    var vis = (function(){
        var stateKey, eventKey, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
        return function(c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        };
    })();

    vis(function(){
        if(vis()) {
            refreshWidgets();
        }
    });

    // add refresh button
    setTimeout(function () {
        // while button does not exists
        while ($('.ring-button__content:contains("Reload All")').text().length === 0) {
            $('.dashboard-page__toolbar-buttons')
                .prepend($('<button>').addClass("ring-button ring-button_default reloadAll")
                         .prepend($('<span>').addClass("ring-button__content")
                                  .prepend($('<span>').text('Reload All'))));
        }
        // click refresh button action
        $('.ring-button__content:contains("Reload All")').click(function () {
            refreshWidgets();
        });
    }, 1000);
})();