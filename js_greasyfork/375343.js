// ==UserScript==
// @name         idaradio.fr Web radio notifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Notifies new tracks played (adapted from ms team notification; credit to David López Castellote)
// @author       Sylvain Foubert
// @match        https://idaradio.fr/direct-radio/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375343/idaradiofr%20Web%20radio%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/375343/idaradiofr%20Web%20radio%20notifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function notifyMe(trackname) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("Notification is not supported by this navitor.");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            createNotification(trackname);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification(trackname);
                }
            });
        }

    }

    function createNotification(trackname) {
        var title = "New track";
        var options = {
            body: trackname,
            icon: document.querySelector('link[rel="icon"]').href,
            requireInteraction: false
        };
        var notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }


    function setTitleObserver() {
        console.log('Notification activation');
        requestNotificationsPermission();
        var target = document.getElementsByClassName('cc_streaminfo');
        var observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var newTitle = mutation.addedNodes[0].data;
                notifyMe(newTitle);
            });
        });
        observer.observe(target[0], {
            //subtree: true,
            // characterData: true,
            childList: true
        });

    }

    function requestNotificationsPermission() {
        Notification.requestPermission().then(function(result) {
            console.log('Autorisation: ' + result);
        });
    }


    setTitleObserver();

})();