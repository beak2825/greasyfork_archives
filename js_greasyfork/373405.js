// ==UserScript==
// @name         Microsoft Teams Notifications
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Creates browser notifications for the Web-based Teams application. Useful in Linux (in Linux notifications do not work). Tested in Chrome 69.
// @author       David López Castellote
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373405/Microsoft%20Teams%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/373405/Microsoft%20Teams%20Notifications.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function notifyMe(numberOfMessages) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            createNotification(numberOfMessages);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification(numberOfMessages);
                }
            });
        }

    }

    function createNotification(numberOfMessages) {
        var title = "Microsoft Teams";
        var options = {
            body: "You have " + numberOfMessages + " new notifications.",
            icon: document.querySelector('link[rel="icon"]').href,
            requireInteraction: true
        };
        var notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }


    function setTitleObserver() {
        console.log('Activating Teams notifications...');
        requestNotificationsPermission();
        var target = document.querySelector('head > title');
        var observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var newTitle = mutation.target.textContent;
                var res;
                try {
                    res = newTitle.match(/(?<=\().+?(?=\))/);
                }
                catch( e ) {
                    res = newTitle.match(/\(([^)]+)\)/);
                }
                if (res && res[0] && res[0] && document.hidden) {
                    notifyMe(res[0]);
                    return false;
                }
            });
        });
        observer.observe(target, {
            subtree: true,
            characterData: true,
            childList: true
        });

    }

    function requestNotificationsPermission() {
        Notification.requestPermission().then(function(result) {
            console.log('Permission for Teams notifications: ' + result);
        });
    }

    function exitFromCurrentChat() {
        setInterval( function() {
            if( document.hidden ) {
                document.querySelector('ul[data-tid="active-chat-list"] li:nth-last-child(2) a').click();
            }
        }, 30000 );
    }

    setTitleObserver();
    exitFromCurrentChat();
})();
