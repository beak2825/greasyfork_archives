// ==UserScript==
// @name         [Premium] Viefaucet by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      2.0.1
// @description  Make Faucet/Coupon/PTC/Daily Bonus/Challenges/Shortlinks/Captcha help
// @author       Andrewblood
// @match        *://*.viefaucet.com/*
// @match        *://*.t.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=viefaucet.com
// @grant        window.focus
// @grant        window.close
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/489664/%5BPremium%5D%20Viefaucet%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/489664/%5BPremium%5D%20Viefaucet%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adSetActive() {
        GM_setValue('adActive', 1);
    }

    function adClearActive() {
        GM_deleteValue('adActive');
    }

    function adIsActive() {
        return GM_getValue('adActive', 0) === 1;
    }

    function solveVieCaptcha() {
        var waitForCaptcha = setInterval(function() {
            const captchaCheckBox = document.querySelector('.check-box');
            if (captchaCheckBox){
                clearInterval(waitForCaptcha);
                window.focus();
                captchaCheckBox.click();
                var waitForCaptchaSolved = setInterval(function() {
                    const dotElement = document.querySelector('div.dot');
                    if (dotElement) {
                        clearInterval(waitForCaptchaSolved);
                        var buttons = document.querySelectorAll('button');
                        buttons.forEach(function(button) {
                            if (button.textContent.includes('Verify') || button.textContent.includes('Claim')) {
                                button.click();
                                if (window.location.href.includes("app/ptc/iframe/") || window.location.href.includes("app/ptc/youtube/")) {
                                    setTimeout(function() {
                                        adClearActive();
                                        window.close();
                                    }, 500);
                                } else {
                                    setTimeout(function() {
                                        window.location.reload();
                                    }, 2000);
                                }
                            }
                        });
                    }
                }, 1000);
            }
        }, 3000);
    }

    setTimeout(function() {

        if (window.location.href == "https://viefaucet.com/" && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) {
            window.location.replace("https://viefaucet.com/?r=64e3d92cc6440515b31dc7cb");
        }
        if (window.location.href.includes("/register") && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) {
            window.location.replace("https://viefaucet.com/register?r=64e3d92cc6440515b31dc7cb");
        }
        if (window.location.href.includes("/login") && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) {
            window.location.replace("https://viefaucet.com/login?r=64e3d92cc6440515b31dc7cb");
        }

        if (window.location.href.includes("/app/ptc/window")) {

            var originalOpen = unsafeWindow.open;
            var windowName = "EvervepopUpWindow";
            function interceptedOpen(url, name, specs, replace) {
                var finalName = (!name || name === "_blank") ? windowName : name;
                console.log(`Intercepted open: ${url}, ${finalName}`);
                url = "about:blank"
                return originalOpen.call(unsafeWindow, url, finalName, specs, replace);
            }
            unsafeWindow.open = interceptedOpen;
            unsafeWindow.onbeforeunload = function() {
                try {
                    var popup = unsafeWindow.open('', windowName);
                    if (popup && !popup.closed) {
                        popup.close();
                    }
                } catch (e) {
                    console.warn("Popup konnte beim Verlassen nicht geschlossen werden:", e);
                }
            };

            const viewAdButton = document.querySelector(".el-button.el-button--primary.claim-button:not(.is-disabled)");
            if (viewAdButton) {
                viewAdButton.click();
                solveVieCaptcha()
            } else {
                window.location.replace("https://viefaucet.com/app/bonus")
            }
        }

        if (window.location.href.includes("/app/bonus")) {
            var claimDailyBonusButton = document.querySelector("button.el-button.el-button--warning.el-button--small:not(.is-disabled)");
            if (claimDailyBonusButton){
                claimDailyBonusButton.click();
                solveVieCaptcha();
            } else {
                window.location.replace("https://viefaucet.com/app/faucet")
            }
        }

        if (window.location.href.includes("/app/faucet")) {


            var translateToDigitMap = {
                'zero': '0',
                'one': '1', 'I': '1',
                'two': '2', 'II': '2',
                'three': '3', 'III': '3',
                'four': '4', 'IV': '4',
                'five': '5', 'V': '5',
                'six': '6', 'VI': '6',
                'seven': '7', 'VII': '7',
                'eight': '8', 'VIII': '8',
                'nine': '9', 'IX': '9',
                'ten': '10', 'X': '10'
            };

            solveVieCaptcha()
        }
        if (window.location.href.includes("/app/wait")) {
            window.location.replace("https://viefaucet.com/app/ptc/iframe")
        }

        if (window.location.href == "https://viefaucet.com/app/ptc/iframe") {
            adClearActive();
            setInterval(function() {
                const viewAdButton = document.querySelector(".el-button.el-button--primary.claim-button:not(.is-disabled)");
                if (viewAdButton) {
                    if (adIsActive()){
                        console.log("Warte auf Zeit")
                    } else {
                        viewAdButton.click();
                        adSetActive();
                    }
                } else {
                    window.location.replace("https://viefaucet.com/app/ptc/youtube")
                }
            }, 3000);
        }
        if (window.location.href.includes("/app/ptc/iframe/")) {
            solveVieCaptcha();
        }

        if (window.location == "https://viefaucet.com/app/ptc/youtube") {
            setInterval(function() {
                const viewAdButton = document.querySelector(".el-button.el-button--primary.claim-button:not(.is-disabled)");
                if (viewAdButton) {
                    if (adIsActive()){
                        console.log("Warte auf Zeit")
                    } else {
                        viewAdButton.click();
                        adSetActive();
                    }
                } else {
                    window.location.replace("https://viefaucet.com/app/link")
                }
            }, 3000);
        }
        if (window.location.href.includes("/app/ptc/youtube/")) {
            const clickPlayYoutubeVideo = document.querySelector("#movie_player > div.ytp-cued-thumbnail-overlay > div");
            var interval001 = setInterval(function() {
                if (clickPlayYoutubeVideo) {
                    clearInterval(interval001);
                    clickPlayYoutubeVideo.click();
                }
            }, 1000);
            solveVieCaptcha();
        }

        if (window.location.href.includes("/app/link")) {
            setTimeout(function() {
                var claimShortlinkButton = document.querySelector("#main-view > div.contents > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > div > div > button:not(.is-disabled)");
                if (claimShortlinkButton) {
                    claimShortlinkButton.click();
                    window.close();
                } else {
                    window.location.replace("https://viefaucet.com/app/challenge");
                }
            }, 3000);
        }

        if (window.location.href.includes("/app/challenge")) {
            const claimChallange = document.querySelector(".el-button.el-button--warning:not(.is-disabled)");
            if (claimChallange) {
                claimChallange.click();
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            } else {
                window.location.replace("https://viefaucet.com/app/ptc/window")
            }
        }

        if (window.location.href.includes ("coupon")){
            const lastClaimTableFieldSelector = "#main-view > div.contents > div.el-row > div:nth-child(2) > div > div > div > div.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition.el-table.el-table--layout-fixed.is-scrolling-none > div.el-table__inner-wrapper > div.el-table__body-wrapper > div > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > div > table > tbody > tr:nth-child(1) > td.el-table_1_column_5.is-center.el-table__cell";
            const openTelegramLinkSelector = "#main-view > div.contents > div.el-row > div:nth-child(1) > div > div > div:nth-child(1) > a";

            // --- Hilfsfunktion: Aktuelles Datum als YYYY-MM-DD String ---
            function getCurrentDateString() {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            console.log("Tampermonkey Skript: Datumsprüfung startet...");

            try {
                const lastClaimTableField = document.querySelector(lastClaimTableFieldSelector);
                const openTelegramLink = document.querySelector(openTelegramLinkSelector);

                if (!lastClaimTableField) {
                    console.error("Datumselement nicht gefunden! Selektor:", lastClaimTableFieldSelector);
                    return; // Skript beenden, wenn Element fehlt
                }

                // Text aus dem Element holen und bereinigen (z.B. Leerzeichen, evtl. Anführungszeichen entfernen)
                let elementText = lastClaimTableField.innerText.trim();
                if (elementText.startsWith("'") && elementText.endsWith("'")) {
                    elementText = elementText.slice(1, -1); // Entfernt die äußeren Anführungszeichen
                }

                // Extrahiere nur den Datumsteil (angenommenes Format: 'YYYY-MM-DD HH:MM:SS')
                const elementDatePart = elementText.split(' ')[0];

                // Aktuelles Datum holen
                const currentDate = getCurrentDateString();

                console.log(`Datum im Element gefunden: ${elementDatePart}`);
                console.log(`Aktuelles Datum: ${currentDate}`);

                // Vergleich
                if (elementDatePart === currentDate) {
                    console.log("Datum stimmt überein. Aktion 'neue Seite laden' wird ausgeführt.");
                    // Aktion, wenn Datum übereinstimmt:
                    window.location.href = 'https://viefaucet.com/app/bonus';
                } else {
                    console.log("Datum stimmt NICHT überein. Aktion 'Link klicken' wird ausgeführt.");
                    // Aktion, wenn Datum nicht übereinstimmt:
                    if (openTelegramLink) {
                        console.log("Klicke auf Link:", openTelegramLinkSelector);
                        openTelegramLink.click();
                    } else {
                        console.error("Link zum Klicken nicht gefunden! Selektor:", openTelegramLinkSelector);
                    }
                }
            } catch (error) {
                console.error("Ein Fehler ist im Tampermonkey-Skript aufgetreten:", error);
            }
        }

        if (window.location.href.includes ("viefaucet_announcements")){
            const previewChannelButton = document.querySelector("body > div.tgme_page_wrap > div.tgme_body_wrap > div > div.tgme_page_context_link_wrap > a");
            if (previewChannelButton) previewChannelButton.click();

            const historyContainerSelector = 'section.tgme_channel_history';
            const messageWrapSelector = '.js-widget_message_wrap';
            const timeElementSelector = 'time.time[datetime]';
            // Selektor für den 'Redeem'-Button (oder den ersten Inline-Button) RELATIV zum Nachrichten-Wrapper
            const redeemButtonSelector = '.tgme_widget_message_inline_keyboard .tgme_widget_message_inline_button';

            // --- Hilfsfunktion: Aktuelles Datum als YYYY-MM-DD String ---
            function getCurrentDateString() {
                const today = new Date(); // Nimmt das aktuelle Systemdatum
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // Format YYYY-MM-DD
            }

            // --- Hauptlogik ---
            console.log("Tampermonkey Skript: Telegram Datumsprüfung -> Redeem/Schließen startet...");

            try {
                const historyContainer = document.querySelector(historyContainerSelector);
                if (!historyContainer) {
                    console.error("Nachrichtenverlauf-Container nicht gefunden:", historyContainerSelector, ". Schließe Tab (Versuch).");
                    window.close(); // Wenn der Container fehlt, stimmt was nicht -> schließen
                    return;
                }

                const messageWraps = historyContainer.querySelectorAll(messageWrapSelector);
                if (messageWraps.length === 0) {
                    console.log("Keine Nachrichten-Wrapper gefunden. Schließe Tab (Versuch).");
                    window.close(); // Keine Nachrichten -> schließen
                    return;
                }

                const lastMessageWrap = messageWraps[messageWraps.length - 1];
                console.log("Letzter Nachrichten-Wrapper analysiert:", lastMessageWrap);

                const timeElement = lastMessageWrap.querySelector(timeElementSelector);
                if (!timeElement) {
                    console.error("Time-Element in der letzten Nachricht nicht gefunden. Schließe Tab (Versuch).", lastMessageWrap);
                    window.close(); // Kein Datum -> schließen
                    return;
                }

                const dateTimeString = timeElement.getAttribute('datetime');
                if (!dateTimeString) {
                    console.error("Letztes Time-Element hat kein 'datetime'-Attribut. Schließe Tab (Versuch).", timeElement);
                    window.close(); // Kein Datum -> schließen
                    return;
                }
                console.log("Gefundenes datetime-Attribut:", dateTimeString);

                // Extrahiere den Datumsteil (YYYY-MM-DD)
                const messageDatePart = dateTimeString.substring(0, 10);

                // Aktuelles Datum holen
                // Das Skript läuft jetzt am 07. April 2025 (laut Kontext)
                const currentDate = getCurrentDateString(); // Holt das tatsächliche aktuelle Datum beim Ausführen

                console.log(`Datum der letzten Nachricht: ${messageDatePart}`);
                console.log(`Aktuelles Datum: ${currentDate}`);

                // Vergleich und Aktion
                if (messageDatePart === currentDate) {
                    // --- DATUM STIMMT ÜBEREIN ---
                    console.log("Datum stimmt überein. Suche 'Redeem'-Button in der letzten Nachricht...");

                    // Suche den Button innerhalb des letzten Nachrichten-Wrappers
                    const redeemButton = lastMessageWrap.querySelector(redeemButtonSelector);

                    if (redeemButton) {
                        console.log("'Redeem'-Button gefunden. Klicke darauf:", redeemButton);
                        redeemButton.click();
                        // Optional: Tab nach erfolgreichem Klick schließen?
                        // setTimeout(window.close, 1500); // Warte 1.5 Sek nach Klick, dann versuche zu schließen
                    } else {
                        console.error("'Redeem'-Button in der letzten Nachricht nicht gefunden! Selektor:", redeemButtonSelector, ". Tue nichts weiter oder schließe Tab (Versuch)...");
                        // Wenn der Button fehlt, obwohl das Datum passt -> evtl. trotzdem schließen?
                        // window.close();
                    }

                } else {
                    // --- DATUM STIMMT NICHT ÜBEREIN ---
                    console.log("Datum stimmt NICHT überein. Schließe Tab (Versuch)...");
                    window.close();
                }

            } catch (error) {
                console.error("Ein Fehler ist im Tampermonkey-Skript aufgetreten:", error);
                // Bei unerwarteten Fehlern ggf. auch versuchen zu schließen?
                // try { window.close(); } catch(e) {}
            }
        }

    }, 3000);

})();