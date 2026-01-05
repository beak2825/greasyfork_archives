// ==UserScript==
// @name         Add CQ Content Paths
// @version      0.3
// @description  update url's to include /{adaptive|content}/{brand} e.g /content/adaptive/watoday
// @author       Joel Cumberland
// @include      http://azcms*
// @exclude      http://www\.(smh|theage|canberratimes|brisbanetimes|watoday)\.com.au/
// @exclude      http://www\.(traveller|dailylife|essentialkids|essentialbaby|goodfood|drive)\.com.au/
// @namespace https://greasyfork.org/users/40077
// @downloadURL https://update.greasyfork.org/scripts/19046/Add%20CQ%20Content%20Paths.user.js
// @updateURL https://update.greasyfork.org/scripts/19046/Add%20CQ%20Content%20Paths.meta.js
// ==/UserScript==
var application_name = getApplicationName();
var smh_app_name = 'The Sydney Morning Herald';
var theage_app_name = 'The Age';
var ct_app_name = 'Canberra Times';
var wt_app_name = 'WA Today';
var bt_app_name = 'Brisbane Times';
var traveller_app_name = 'Traveller';

function updateLinks(content_path) {
    console.log('updateLinks() called');

    var urls = document.getElementsByTagName('a');

    for (var i = 0; i < urls.length; i++) {
        var get_host = urls[i].host;
        var get_href = urls[i].href;

        if (get_host.indexOf(get_href) < 0) {
            var get_pathname = urls[i].pathname;
            var get_ext = get_pathname.split('.').pop();
            var html = '';

            if (get_ext != 'html') {
                html = '.html';
            }
            urls[i].setAttribute('href', content_path + get_pathname + html);
        }
    }
}


function getApplicationName() {
    console.log('getApplicationName() called');

    var metas = document.getElementsByTagName('meta');

    for (var i = 0; i < metas.length; i++) {
        var application = metas[i].getAttribute("name");
        if (application == 'application-name') {
            console.log('Applicaton found ' + metas[i].getAttribute('content'));
            return metas[i].getAttribute('content');
        }
    }

    return "";
}


(function() {
    'use strict';
    /* Main Run */

    if (application_name == smh_app_name) {
        updateLinks('/content/desktop/smh');
    }

    if (application_name == theage_app_name) {
        updateLinks('/content/desktop/theage');
    }

    if (application_name == wt_app_name) {
        updateLinks('/content/adaptive/watoday');
    }

    if (application_name == bt_app_name) {
        updateLinks('/content/adaptive/brisbanetimes');
    }

    if (application_name == ct_app_name) {
        updateLinks('/content/adaptive/canberratimes');
    }

    if (application_name == traveller_app_name) {
        updateLinks('/content/traveller');
    }

})();