// ==UserScript==
// @name         FML autodownload
// @namespace    https://greasyfork.org/en/users/370170
// @version      0.4
// @description  Script for autodownloading FML w/ reminder
// @author       Radoslaw Rusek
// @match        *://mediatask.floorplanner.com/projects/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390050/FML%20autodownload.user.js
// @updateURL https://update.greasyfork.org/scripts/390050/FML%20autodownload.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var minuty = 15; // Co ile skrypt ma się uruchamiać?
    var powiadomienia = true; // Czy mają pokazywać się powiadomienia?
    var pobieranie = true; // Czy skrypt ma automatycznie pobierać pliki FML?


    var url = window.location.href;
    var new_url = url.substring(0, url.indexOf('-'));
    var fml_url = new_url.concat("/export.fml");

    shim_GM_notification();

    var notText = 'Minęło 15 minut, trwa pobieranie pliku FML..';
    if (pobieranie === true) {
        notText = 'Minęło 15 minut, trwa pobieranie pliku FML..';
    } else {
        notText = 'Minęło 15 minut, proszę pobrać plik FML..';
    }
    var notificationDetails = {
        text: notText,
        title: 'Przypomnienie',
        timeout: 6000,
        onclick: function() {
            window.focus();
        }
    };
    setInterval(function() {
        if (powiadomienia === true) {
            GM_notification(notificationDetails);
        }
        if (pobieranie === true) {
            setTimeout(function() {
                document.location.href = fml_url;
            }, 1000);
        }
    }, minuty * 60 * 1000);
    /*--- Cross-browser Shim code follows:
     */
    function shim_GM_notification() {
        if (typeof GM_notification === "function") {
            return;
        }
        window.GM_notification = function(ntcOptions) {
            checkPermission();

            function checkPermission() {
                if (Notification.permission === "granted") {
                    fireNotice();
                } else if (Notification.permission === "denied") {
                    return;
                } else {
                    Notification.requestPermission(function(permission) {
                        checkPermission();
                    });
                }
            }

            function fireNotice() {
                if (!ntcOptions.title) {
                    return;
                }
                if (ntcOptions.text && !ntcOptions.body) {
                    ntcOptions.body = ntcOptions.text;
                }
                var ntfctn = new Notification(ntcOptions.title, ntcOptions);

                if (ntcOptions.onclick) {
                    ntfctn.onclick = ntcOptions.onclick;
                }
                if (ntcOptions.timeout) {
                    setTimeout(function() {
                        ntfctn.close();
                    }, ntcOptions.timeout);
                }
            }
        };
    }
})();