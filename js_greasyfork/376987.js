// ==UserScript==
// @name         Microsoft Teams Notifications
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Creates browser notifications for the Web-based Teams application. Useful in Linux (in Linux notifications do not work). Tested in Chrome 66.
// @author       David López Castellote
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376987/Microsoft%20Teams%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/376987/Microsoft%20Teams%20Notifications.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const TRANSLATIONS = {
        "es": {
            "BROWSER_NOT_SUPPORTED":    "Este navegador no soporta notificaciones de escritorio.",
            "ACTIVATE_NOTIFICATIONS":   "Activando notificaciones de Teams...",
            "MULTI_NEW_MESSAGES":       "Tienes %numberOfMessages% nuevas notificaciones.",
            "SINGLE_NEW_MESSAGE":       "Tienes %numberOfMessages% nuevas notificación.",
            "PERMISSION_RESULT":        "Permiso para notificaciones de Teams: %result%"
        },
        "de": {
            "BROWSER_NOT_SUPPORTED":    "Dieser Browser unterstützt keine Desktopbenachrichtigungen.",
            "ACTIVATE_NOTIFICATIONS":   "Teambenachrichtigungen aktivieren...",
            "MULTI_NEW_MESSAGES":       "%numberOfMessages% neue Nachrichten.",
            "SINGLE_NEW_MESSAGE":       "%numberOfMessages% neue Nachricht.",
            "PERMISSION_RESULT":        "Erlaubnis für Teambenachrichtigungen: %result%"
        },
        "en": {
            "BROWSER_NOT_SUPPORTED":    "This browser does not support desktop notifications.",
            "ACTIVATE_NOTIFICATIONS":   "Activating Teams notifications...",
            "MULTI_NEW_MESSAGES":       "%numberOfMessages% new messages.",
            "SINGLE_NEW_MESSAGE":       "%numberOfMessages% new message.",
            "PERMISSION_RESULT":        "Permission for Teams notifications: %result%"
        }
    };
    const LANG_MAPPING = {
        "es-*": "es",
        "en-*": "en",
        "de-*": "de"
    };
    function getTranslation(key) {
        let lang;
        if(TRANSLATIONS.hasOwnProperty(navigator.language)) {
            lang = navigator.language;
        }
        else {
            lang = LANG_MAPPING[Object.keys(LANG_MAPPING).filter(mappingkey => navigator.language.match(mappingkey) !== null)[0]] || "en";
        }
        return TRANSLATIONS[lang][key] || key;
    }

    function notifyMe(numberOfMessages) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert(getTranslation("BROWSER_NOT_SUPPORTED"));
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
        const title = "Microsoft Teams Online";
        const options = {
            body: getTranslation((numberOfMessages == 1) ? "SINGLE_NEW_MESSAGE" : "MULTI_NEW_MESSAGES").replace("%numberOfMessages%", numberOfMessages),
            icon: document.querySelector('link[rel="icon"]').href,
            requireInteraction: true
        };
        const notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }


    function setTitleObserver() {
        console.log(getTranslation("ACTIVATE_NOTIFICATIONS"));
        requestNotificationsPermission();
        const target = document.querySelector('head > title');
        const observer = new window.WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const newTitle = mutation.target.textContent;
                let res;
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
            console.log(getTranslation("PERMISSION_RESULT").replace("%result%", result));
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