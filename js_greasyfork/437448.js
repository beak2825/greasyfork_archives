// ==UserScript==
// @name         Notfication test
// @version      0.1
// @description  Notfication test for https://www.google.com/
// @author       epicdude2121
// @grant        none
// @license MIT
// @match        https://www.google.com/
// @grant        GM_notification
// @run-at document-end
// @namespace    https://www.google.com/
// @downloadURL https://update.greasyfork.org/scripts/437448/Notfication%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/437448/Notfication%20test.meta.js
// ==/UserScript==

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Put wutever here!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied' || Notification.permission === "default") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Put wutever here!");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}