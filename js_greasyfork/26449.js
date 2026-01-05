// ==UserScript==
// @name         Microsoft Teams Notification
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Check for teams notification
// @author       You
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26449/Microsoft%20Teams%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/26449/Microsoft%20Teams%20Notification.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var notification = null;

    function openNotification(message) {
        if (notification === null) {
            var options = {
                body: message,
                icon: "https://ms-vsts.gallerycdn.vsassets.io/extensions/ms-vsts/vss-services-teams/1.0.1/1479220529279/images/teams-logo.png"
            };

            notification = new Notification("Microsoft Teams", options);

            notification.onclose = function () {
                notification = null;
            };
        }
    }

    function notifyUser(message) {

        // Voyons si l'utilisateur est OK pour recevoir des notifications
        if (Notification.permission === "granted") {
            // Si c'est ok, créons une notification
            openNotification(message);
        }

        // Sinon, nous avons besoin de la permission de l'utilisateur
        // Note : Chrome n'implémente pas la propriété statique permission
        // Donc, nous devons vérifier s'il n'y a pas 'denied' à la place de 'default'
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

                // Quelque soit la réponse de l'utilisateur, nous nous assurons de stocker cette information
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }

                // Si l'utilisateur est OK, on crée une notification
                if (permission === "granted") {
                    openNotification(message);
                }
            });
        }

        // Comme ça, si l'utlisateur a refusé toute notification, et que vous respectez ce choix,
        // il n'y a pas besoin de l'ennuyer à nouveau.
    }

    function check() {
        setTimeout(check, 30000); // 15 secondes

        var elts = document.querySelectorAll(".activity-badge");
        if (elts.length < 1) {
            return;
        }

        // A new element in teams
        notifyUser('New activity !');
    }

    check();

})();
