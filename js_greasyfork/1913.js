// ==UserScript==
// @name       TradeMe Google reminder
// @namespace  http://drsr/
// @version    0.8
// @description  Add a Google Calendar reminder link to Trademe auction pages
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @include    /https:\/\/www\.trademe\.co\.nz\/.*\/[Ll]isting.*/
// @include    /https:\/\/www\.trademe\.co\.nz\/.*\/auction-.*/
// @include    /https:\/\/www\.trademe\.co\.nz\/a\.aspx.*/
// @grant      GM_addStyle
// @copyright  public domain
// @downloadURL https://update.greasyfork.org/scripts/1913/TradeMe%20Google%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/1913/TradeMe%20Google%20reminder.meta.js
// ==/UserScript==

// make sure the JQuery is the one loaded by the @require
var myJQ = jQuery.noConflict();

// replace trademe's JS error handler
window.onerror=function(msg, url, linenumber){
    console.log('Custom handler Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
};

function getCloseDateTime() {
    var closeDateTime = null;
    // format of closing time is "Closes: Sat 16th Jun, 3:05 pm." and optionally " This auction may auto-extend"
    // doesn't work for periods less than one day where time is e.g. "4 hours", but not really worth a GCAL reminder then
    var closing = myJQ("#BidBuyNow_closingContainer,#ClosingTime_ClosingTimeContainer,tm-closing-time").text();

    if (closing && closing.indexOf("Closes:") > -1) {
        closing = closing.replaceAll("th", "").replaceAll("st","").replaceAll("nd","").replaceAll("am", " am").replaceAll("pm", " pm")
        // get just date and time without dayname but including am/pm
        closing = myJQ.trim(closing.replace(new RegExp("\n", 'g'), ""));
        var closeTime = /Closes:\s+\w+\s+(.*[ap]m).*/.exec(closing);
        if (closeTime) {
            closeTime = closeTime[1];
            // insert year
            var timeParts = closeTime.split(",");
            closeDateTime = new Date(timeParts[0] + " " + new Date().getFullYear() + " " + timeParts[1]);
        }
    }
    return closeDateTime;
}

/*
 *  Return a date string as yyyymmddThhmmssZ in UTC.
 *  based on http://stackoverflow.com/questions/5661487/converting-date-time-to-rfc3339-format-using-either-jquery-or-java-script
 */
// Add leading zero to single digit numbers
function addZ(n) {
    return (n<10) ? '0'+n : ''+n;
}
function dateToUTCString(d) {

    return d.getUTCFullYear() + 
           addZ(d.getUTCMonth() + 1) + 
           addZ(d.getUTCDate()) +
           'T' + 
           addZ(d.getUTCHours()) + 
           addZ(d.getUTCMinutes()) + 
           addZ(d.getUTCSeconds()) +
           'Z';
}

function addReminderLink(reminderTime) {
    var auctionTitle = myJQ("#ListingTitle_title,#ListingTitleBox_TitleText,.tm-marketplace-buyer-options__listing_title").text().trim();

    var utcDate = dateToUTCString(reminderTime);

    // annoyingly Google Calendar web app won't auto-link to either HTML or plain link in the title or details,
    // but other calendar and browser apps e.g. Android should when they popup the reminder
    var reminderLink = "https://www.google.com/calendar/event?action=TEMPLATE" +
        "&text=TM: " + escape(auctionTitle) +
        "&dates=" + utcDate + "/" + utcDate +
        "&details=" + escape(location.href);

    myJQ(".tm-marketplace-buyer-options__closing-time-rack").after('<tg-rack-item class="o-rack-item">'+
                                                                   '<div class="o-rack-item__body">'+
                                                                   '<div class="o-rack-item__main">'+
                                                                   '<tg-rack-item-primary class="o-rack-item__primary">'+
                                                                   '<div class="o-rack-item__primary-body">'+
                                                                   '<div id="tmgr_addToGoogle" class="tmgr_addToGoogle">' +
                                                                   '<a href="' + reminderLink + '">' +
                                                                   '<img src="https://www.google.com/calendar/images/ext/gc_button1_en-GB.gif">' +
                                                                   '</a>' +
                                                                   '</div>'+
                                                                   '</div>'+
                                                                   '</tg-rack-item-primary>'+
                                                                   '</div>'+
                                                                   '</div>'+
                                                                   '</tg-rack-item>');
}

function addReminder() {
    if (myJQ("#tmgr_addToGoogle").length==0) {
        var reminderTime = getCloseDateTime();
        if (reminderTime) {
            addReminderLink(reminderTime);
        }
    }
}

window.setInterval(addReminder, 500);