// ==UserScript==
// @name         Microsoft Calendar Notifications
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Creates browser notifications for the Web-based Outlook-Calendar application. Useful in Linux (in Linux notifications do not work). Tested in Chrome 66.
// @author       David López Castellote
// @match        https://outlook.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367732/Microsoft%20Calendar%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/367732/Microsoft%20Calendar%20Notifications.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var allowNotification = true;

    function notifyMe( event ) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("Este navegador no soporta notificaciones de escritorio.");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            createNotification( event );
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification( event );
                }
            });
        }

    }

    function createNotification( event ) {
        var title = "Calendar";
        var options = {
            body: event,
            icon: 'https://raw.githubusercontent.com/Dellos7/nav-favicon/master/ms-calendar-favicon.ico',
            requireInteraction: true
        };
        var notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }


    function setTitleObserver() {
        console.log('Activando notificaciones de Calendar...');
        requestNotificationsPermission( function() {
                console.log("DOM fully loaded and parsed");
                setTimeout( function() {
                    console.log('CALENDAR TARGET');
                    var target = document.querySelector('.o365cs-notifications-notificationPopupArea');
                    console.log(target);
                    var observer = new window.WebKitMutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            console.log(mutation);
                            var target = mutation.target;
                            if (document.hidden && target.nodeName === 'DIV' && target.offsetParent.className === 'o365cs-notifications-notificationPopup ms-bcl-nl' && allowNotification) {
                                allowNotification = false;
                                console.log('NOTIFICATION: ' + target.innerText);
                                notifyMe( target.innerText );
                                setTimeout( function() {
                                    allowNotification = true;
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
            }, 5000);
        });
    }

    function requestNotificationsPermission( callback ) {
        Notification.requestPermission().then(function(result) {
            console.log('Permiso para notificaciones de Calendar: ' + result);
            callback();
        });
    }

    setTitleObserver();

})();
