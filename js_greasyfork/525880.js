// ==UserScript==
// @name         Neopets Alerts Manager
// @version      1.0
// @description  Adds a button to clear all alerts from the alert drawer in beta pages.
// @author       darknstormy
// @match        http*://www.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1328929
// @downloadURL https://update.greasyfork.org/scripts/525880/Neopets%20Alerts%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/525880/Neopets%20Alerts%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let alertsTabHeader = $(".alerts-tab-viewall__2020")

    if (!alertsTabHeader) {
       return
    }

    alertsTabHeader.css("height","70px")
    alertsTabHeader.append('<div id="clearAllAlerts" class="alerts-tab-viewclick__2020" style="margin: 8px;"><div class="alerts-tab-icon__2020" style="background: url(https://images.neopets.com/themes/h5/basic/images/x-icon.svg)"></div><div class="news-dropdown-text__2020">Clear All</div></div>')

    $('#clearAllAlerts').on('click', () => {
        if( confirm("Are you sure? This will clear all of your alerts; this action cannot be undone!") == true) {
            $(".alert-x").each(function() {
                $(this).click()
            });
        }
    })

})();

