// ==UserScript==
// @name         Hide Baseball Notifications
// @namespace    http://knightsradiant.pw/
// @version      0.11
// @description  Hide baseball results from the notifications page so that more important notifications are not concealed.
// @author       Talus
// @match        https://politicsandwar.com/nation/notifications/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396035/Hide%20Baseball%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/396035/Hide%20Baseball%20Notifications.meta.js
// ==/UserScript==

(function() {
    var notificationsTablesPath = '#rightcolumn > div > table > tbody > tr';
    var oblGameMatch = ':contains("Your OBL team")';

    var $ = window.jQuery;

    $(notificationsTablesPath).each(function(){
        console.log('yay');
        if ($(this).is(oblGameMatch)){
            $(this).hide();
        }
    });

})();