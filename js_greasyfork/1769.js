// ==UserScript==
// @name       Google Music Power Hour
// @namespace  http://www.joefkelley.com/
// @version    0.2
// @description  Make any Google Music playlist into a power hour!
// @include https://play.google.com/music/listen*
// @copyright  2014, Joe Kelley
// @downloadURL https://update.greasyfork.org/scripts/1769/Google%20Music%20Power%20Hour.user.js
// @updateURL https://update.greasyfork.org/scripts/1769/Google%20Music%20Power%20Hour.meta.js
// ==/UserScript==

// Inject jQuery if not present
if (!(window.jQuery && window.jQuery.fn.jquery == '1.3.2')) {
    var s = document.createElement('script');
    s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
    //s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
    s.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(s);
}

// Power Hour state
unsafeWindow.powerHourActivated = false;
unsafeWindow.powerHourTimeout = null;

unsafeWindow.doPowerHour = function() {
    if (unsafeWindow.powerHourActivated && $('#time_container_current').text() == "1:00") {
        unsafeWindow.nextSong();
    }
    unsafeWindow.powerHourTimeout = setTimeout(unsafeWindow.doPowerHour, 500);
};

unsafeWindow.nextSong = function() {
    $("button[data-id='forward']").click();
};

unsafeWindow.startPowerHour = function() {
    unsafeWindow.powerHourActivated = true;
    unsafeWindow.nextSong();
    unsafeWindow.doPowerHour();
};

unsafeWindow.stopPowerHour = function() {
    unsafeWindow.powerHourActivated = false;
    clearTimeout(unsafeWindow.powerHourTimeout);
};