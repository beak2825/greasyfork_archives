// ==UserScript==
// @name       Ximble Schedule
// @version    1.0
// @description  This changes the Ximble Schedule view to allow for a better experience.
// @match      https://app.ximble.com/schedules
// @namespace https://greasyfork.org/users/134794
// @downloadURL https://update.greasyfork.org/scripts/30823/Ximble%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/30823/Ximble%20Schedule.meta.js
// ==/UserScript==
$(function () {
    $("#intercom-container").hide();
    
    $(document).ajaxComplete(function() {
        $(".schedule-card__time").hide();
        $(".schedule-card__summary").css("white-space", "normal");
        $("#intercom-container").hide();
    });
    
    document.addEventListener('scroll', function (event) {
        console.log('scrolling', event.target);
        $("#intercom-container").hide();
        $(".schedule-card__time").hide();
        $(".schedule-card__summary").css("white-space", "normal");
    }, true /*Capture event*/);
});