// ==UserScript==
// @name         Outlook OWA Notifier and Unread Title Updater
// @version      0.4
// @description  Update the HTML title with the number of unread messages and notify of new messages
// @author       Dan Moore
// @match        */owa/*
// @grant        none
// @namespace    https://greasyfork.org/users/40703
// @downloadURL https://update.greasyfork.org/scripts/19163/Outlook%20OWA%20Notifier%20and%20Unread%20Title%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/19163/Outlook%20OWA%20Notifier%20and%20Unread%20Title%20Updater.meta.js
// ==/UserScript==

(function() {    
    Notification.requestPermission();
    
    var $title = $('title');
    var unreadCount = 0;

    setInterval(function() {
        var unread = $('[title=Inbox]').next().next().html();
        var newUnreadCount = unreadCount;
        
        if (unread.length) {
            $title.html(unread + ' - Outlook');
            newUnreadCount = parseInt(unread);
        } else {
            $title.html('Outlook');
            newUnreadCount = 0;
        }
        
        if (newUnreadCount > unreadCount) {
            var summary = $("div[aria-label*='Unread'")
            .attr('aria-label')
            .replace('1 Unread, From ', '')
            .replace('Subject ', '')
            .replace('Files Attached, ', '')
            .replace('Last message ', '')
            .replace('Conversation Collapsed, ', '')
            .trim();
            
            var notification = new Notification(summary);
            
            notification.onclick = function () {
                window.focus();
            };
        }
        
        unreadCount = newUnreadCount;
    }, 1000);

})();