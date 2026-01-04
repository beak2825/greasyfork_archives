// ==UserScript==
// @name         Auto Refresh ChatGPT session
// @namespace    http://github.com/zhaohongxuan
// @version      0.5
// @description  Auto refresh chatGPT session
// @author       hank zhao
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_notification
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/462237/Auto%20Refresh%20ChatGPT%20session.user.js
// @updateURL https://update.greasyfork.org/scripts/462237/Auto%20Refresh%20ChatGPT%20session.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showNotification() {
      const notification = new Notification("chatGPT session auto refresh Failed",{
          "body":"Click to reload manully",
          "icon":"https://www.google.com/s2/favicons?sz=64&domain=openai.com"
      })

      notification.onclick = (event) => {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          location.reload()
      };
   }

    function checkPermissionAndNotify() {
        if (!("Notification" in window)) {
            alert("chatGPT session auto refresh Failed");
        } else if (Notification.permission === "granted") {
            showNotification()
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                     showNotification()
                }
            });
        }
    }

    const intervalId = setInterval(function() {
          var xhr = new XMLHttpRequest()
          xhr.open('GET', "https://chat.openai.com/api/auth/session")
          xhr.onload = function() {
              if (xhr.status === 200) {
                console.debug('refresh chatGPT session Success')
              } else {
                console.warn('refresh chatGPT session Failed: ', xhr.status)
                clearInterval(intervalId)
                checkPermissionAndNotify()
              }
          }
          xhr.onerror = function() {
             console.warn('refresh chatGPT session Error: ', xhr.status)
             clearInterval(intervalId)
             checkPermissionAndNotify()
          }
          xhr.send()
    }, 10000);
})();