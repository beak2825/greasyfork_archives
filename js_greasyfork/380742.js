// ==UserScript==
// @name         Outlook Notification
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Send desktop notification from Outlook Web Application
// @author       Wenxuan Zhao
// @match        https://outlook.office.com/mail/inbox
// @iconURL      http://ow2.res.office365.com/owamail/2019031801.04/resources/images/favicons/mail-seen.ico
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/380742/Outlook%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/380742/Outlook%20Notification.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var sentSet = new Set();
  console.log('[Outlook Notification] UserScript loaded')

  setInterval(function () {
    var reminders = Array.from(document.querySelector('.ms-Layer').firstChild.firstChild.lastChild.lastChild.firstChild.children)
    reminders.forEach(function (reminder) {
      if (sentSet.has(reminder)) return;
      sentSet.add(reminder)

      var event = reminder.querySelector('.ms-Button-flexContainer').lastChild

      var message = event.firstChild.firstChild.textContent
      var time = event.lastChild.firstChild.textContent
      var location = event.lastChild.lastChild.textContent

      var title = 'Outlook Notification'
      var text = message + " / " + time + " @ " + location

      console.log('[Outlook Notification] Send notification: ', message, time, location)
      GM_notification(text, title, 'http://ow2.res.office365.com/owamail/2019031801.04/resources/images/favicons/mail-seen.ico')
    })
  }, 1000);
})();