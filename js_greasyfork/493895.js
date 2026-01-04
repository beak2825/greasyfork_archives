// ==UserScript==
// @name        Datum Prüfen und Benachrichtigung Erstellen
// @namespace   http://tampermonkey.net/
// @version     1.0.0.3
// @description Prüft das Datum und erstellt eine Benachrichtigung, wenn das Datum mit dem heutigen Datum übereinstimmt
// @author      Sie
// @match       *://*/*
// @grant       GM_notification
// @grant       GM_cookie
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @license     CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/493895/Datum%20Pr%C3%BCfen%20und%20Benachrichtigung%20Erstellen.user.js
// @updateURL https://update.greasyfork.org/scripts/493895/Datum%20Pr%C3%BCfen%20und%20Benachrichtigung%20Erstellen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL der Webseite
    let url = "https://play.google.com/store/points/perks";

    // Hole den HTML-Inhalt der Webseite
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            // Erstelle einen neuen DOMParser
            let parser = new DOMParser();

            // Parse den HTML-String
            let doc = parser.parseFromString(response.responseText, "text/html");

            // Finde das <span> Element und extrahiere den Text
            let spanElements = doc.querySelectorAll("span");

            spanElements.forEach((spanElement) => {
                let spanText = spanElement.innerText;

                // Prüfe, ob der Text mit "Verfügbar am " oder "Available on " beginnt
                let prefixDe = "Verfügbar am ";
                let prefixEn = "Available on ";
                if (spanText.startsWith(prefixDe) || spanText.startsWith(prefixEn)) {
                    // Entferne den Präfix um das Datum zu erhalten
                    let dateStr = spanText.replace(prefixDe, "").replace(prefixEn, "");

                    // Parse das Datum
                    let date = new Date(dateStr);

                    // Hole das heutige Datum
                    let today = new Date();

                    // Prüfe, ob das Datum mit dem heutigen Datum übereinstimmt
                    if (date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()) {
                        // Erstelle eine GM_notification
                        GM_notification({
                            text: "Das Datum ist heute. Klicken Sie hier, um zur Webseite zu gelangen.",
                            title: "Benachrichtigung",
                            onclick: function() {
                                // Erstelle einen Cookie, der in 7 Tagen abläuft
                                GM_cookie.set({
                                    url: "https://play.google.com/store/points/perks",
                                    name: "Verfügbarkeitsdatum",
                                    value: dateStr,
                                    maxAge: 60 * 60 * 24 * 7,  // 7 Tage in Sekunden
                                    onExpiration: function() {
                                        // Führe eine GM_notification aus, wenn der Cookie abläuft
                                        GM_notification({
                                            text: "Der Cookie ist abgelaufen. Klicken Sie hier, um zur Webseite zu gelangen.",
                                            title: "Benachrichtigung",
                                            onclick: function() {
                                                window.location.href = "https://play.google.com/store/points/perks";
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });

    // Registriere ein Menükommando zum Löschen des Cookies
    GM_registerMenuCommand("Cookie löschen", function() {
        GM_cookie.delete({
            url: "https://play.google.com/store/points/perks",
            name: "Verfügbarkeitsdatum"
        });
    });
})();
