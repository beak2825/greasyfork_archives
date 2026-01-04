// ==UserScript==
// @name         Microsoft Outlook Notifications
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates browser notifications for the Web-based Outlook application. Useful in Linux (in Linux notifications do not work). Tested in Chrome 66.
// @author       David López Castellote
// @match        https://outlook.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367697/Microsoft%20Outlook%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/367697/Microsoft%20Outlook%20Notifications.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var allowNotify = true;

    function notifyMe() {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("Este navegador no soporta notificaciones de escritorio.");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            createNotification();
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification();
                }
            });
        }

    }

    function createNotification() {
        var title = "Outlook";
        var options = {
            body: "Tienes nuevos correos en tu bandeja.",
            icon: document.querySelector('link[rel="shortcut icon"]').href,
            requireInteraction: true
        };
        var notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }


    function setTitleObserver() {
        console.log('Activando notificaciones de Teams...');
        requestNotificationsPermission();
        var target = document.getElementById('MailFolderPane.FavoritesFolders');
        var observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (document.hidden && allowNotify) {
                    allowNotify = false;
                    notifyMe();
                    setTimeout( function() {
                        allowNotify = true;
                    }, 1000 );
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
            console.log('Permiso para notificaciones de Outlook: ' + result);
        });
    }

    setTitleObserver();
})();
