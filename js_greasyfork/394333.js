// ==UserScript==
// @name        Torn CT Pot Notifications
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     1.2
// @description Notifies large Pot games
// @author      MikePence [2029670]
// @match       https://www.torn.com/christmas_town.php*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM_notification
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/394333/Torn%20CT%20Pot%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/394333/Torn%20CT%20Pot%20Notifications.meta.js
// ==/UserScript==

// Change these
var potNotificationAmount = 30;
var silentNotifications = true;

// Don't change these
var numSlots = 12 * 8;
var notifiedLarge = false;
var notifiedDone = false;

$(document).ready(function(){
    var potInterval = window.setInterval(potFunction, 100);
    function potFunction(){
        var container = $(".status-area-container").first();
        if(container.children().first().attr("class").includes("wrap")){
            notifiedDone = false;
            var wrap = container.children().first();
            if(wrap.children().first().attr("class").includes("board")){
                var board = wrap.children().first();
                var itemsWrap = board.children().eq(1);
                var potAmount = itemsWrap.children().length;
                var winPercent = Math.min(Math.floor(1000 * 3 / (numSlots - potAmount)) / 10, 100);
                var controls = wrap.children().eq(1);
                var message = controls.children().first();
                message.text("Pot is at " + potAmount + " (" + winPercent + "% chance to win)");
                if(!notifiedLarge && potAmount >= potNotificationAmount){
                    notifiedLarge = true;
                    GM_notification({
                        text: potAmount + " items",
                        title: "CT large pot",
                        silent: silentNotifications,
                        timeout: 5000,
                        onclick: function() {
                            window.focus();
                        }
                    });
                }
            }
        }
        else{
            notifiedLarge = false;
        }
        if(container.children().first().attr("class").includes("score-board")){
            if(!notifiedDone){
                notifiedDone = true;
                GM_notification({
                    text: "Made by MikePence [2029670]",
                    title: "CT pot done",
                    silent: silentNotifications,
                    timeout: 5000,
                    onclick: function() {
                        window.focus();
                    }
                });
            }
        }
    }
});