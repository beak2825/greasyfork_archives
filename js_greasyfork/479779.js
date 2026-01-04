// ==UserScript==
// @name         [Premium] Coinpayu.com by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      3.4.5
// @description  Open and close Framed and Frameless Ads with Overlay for settings
// @author       Andrewblood
// @match        *://*.coinpayu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinpayu.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        window.close
// @grant        window.focus
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/479779/%5BPremium%5D%20Coinpayucom%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/479779/%5BPremium%5D%20Coinpayucom%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS-Stile mit GM_addStyle hinzufügen
    GM_addStyle(`
        #customOverlay {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            z-index: 10000;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center; /* Zentriert den Inhalt horizontal */
            justify-content: center; /* Zentriert den Inhalt vertikal */
        }
        #overlayTitle {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            width: 100%;
        }
        #status {
            font-size: 16px; /* Gleiche Größe wie die Schalter */
            color: #00aaff; /* Hellblau wie der Button */
            margin-top: -10px; /* 5px näher zur Überschrift */
            margin-bottom: 10px; /* 5px Abstand nach unten */
        }
        .toggleSwitchWrapper {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-bottom: 10px;
            width: 100%;
        }
        .toggleSwitch {
            display: none;
        }
        .switchSpan {
            width: 60px;
            height: 30px;
            background-color: #ccc;
            position: relative;
            border-radius: 30px;
            transition: background-color 0.3s;
            margin-right: 10px;
        }
        .switchHandle {
            width: 26px;
            height: 26px;
            background-color: #fff;
            position: absolute;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }
        .toggleText {
            flex-grow: 1;
            font-size: 16px;
            color: white;
        }

        #customOverlay button {
            margin-top: 20px;
            background-color: #00aaff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
            text-align: center;
        }

        #customOverlay button:hover {
            background-color: #0099dd;
        }

        #info-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            z-index: 99999;
            padding: 20px;
            display: none;
            overflow-y: auto;
        }

        #info-overlay h2 {
            text-align: center;
            color: white;
        }

        #info-overlay a {
            color: #00aaff;
        }
    `);

    // Overlay-Div erstellen
    var overlay = document.createElement('div');
    overlay.id = 'customOverlay';

    // Überschrift erstellen
    var title = document.createElement('div');
    title.id = 'overlayTitle';
    title.textContent = 'Coinpayu Script from Andrewblood';
    overlay.appendChild(title);

    function setStatus(html) {
        Status.textContent = html;
    }

    var Status = document.createElement('div');
    Status.id = 'status';
    overlay.appendChild(Status);

    // Funktion zum Erstellen eines Toggle-Schalters
    function createToggleSwitch(id, labelText) {
        var toggle = document.createElement('label');
        toggle.className = 'toggleSwitchWrapper';

        var switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.id = id;
        switchInput.className = 'toggleSwitch';

        var switchSpan = document.createElement('span');
        switchSpan.className = 'switchSpan';

        var switchHandle = document.createElement('span');
        switchHandle.className = 'switchHandle';

        var toggleText = document.createElement('span');
        toggleText.className = 'toggleText';
        toggleText.textContent = labelText;

        toggle.appendChild(switchInput);
        toggle.appendChild(switchSpan);
        switchSpan.appendChild(switchHandle);
        toggle.appendChild(toggleText);
        overlay.appendChild(toggle);

        // Initialen Status des Schalters setzen
        updateToggle(switchInput, switchSpan, switchHandle);

        // Schalter-Event-Handler
        switchInput.addEventListener('change', function() {
            const isChecked = this.checked;
            GM_setValue(id + '_toggleStatus', isChecked);
            switchSpan.style.backgroundColor = isChecked ? '#00aaff' : '#ccc';
            switchHandle.style.transform = isChecked ? 'translateX(30px)' : 'translateX(0)';
        });
    }

    // Funktion zum Aktualisieren des Toggle-Schalters
    function updateToggle(switchInput, switchSpan, switchHandle) {
        const isChecked = GM_getValue(switchInput.id + '_toggleStatus', false);
        switchInput.checked = isChecked;
        switchSpan.style.backgroundColor = isChecked ? '#00aaff' : '#ccc';
        switchHandle.style.transform = isChecked ? 'translateX(30px)' : 'translateX(0)';
    }

    // Drei Toggle-Schalter mit Texten erstellen
    createToggleSwitch('toggleSwitch1', 'Framed Ads');
    createToggleSwitch('toggleSwitch2', 'Frameless Ads');
    createToggleSwitch('toggleSwitch3', 'Close after work');


    var moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = 'More Info';
    moreInfoButton.addEventListener('click', openInfoOverlay);

    overlay.appendChild(moreInfoButton);

    // Overlay zur Seite hinzufügen
    document.body.appendChild(overlay);

    function openInfoOverlay() {
        var infoOverlay = document.getElementById('info-overlay');
        if (!infoOverlay) {
            infoOverlay = document.createElement('div');
            infoOverlay.id = 'info-overlay';
            infoOverlay.innerHTML = `
                <h2>Additional Information</h2>
                <p>
                    Go to the Dashboard and it start after reloading the page.<br>
                    Framed Ads: It opens the first aviable site in the list and stay on it, when one site is completed it starts with the Next.<br>
	                When all sites completed it goes to Framless Ads.<br>
	                Frameless Ads: It opens and close site by site.<br>
	                When all sites completed it close coinpayu or go after 3 hour to Framless Ads and begin from new.<br>
                    You can activate and deactivate the functions in the Overlay as desired.<br>
                </p>
                <br>

                <h2>Download Captcha Solver</h2>
                <p>
					<b>HCaptcha + ReCaptcha:</b> NoCoding Data Scraper and CAPTCHA Solver - <a href="https://chromewebstore.google.com/search/minirpa" target="_blank">Install Here</a><br>
					<b>Antibot Words:</b> AB Links Solver - <a href="https://greasyfork.org/de/scripts/459453-ab-links-solver" target="_blank">Install Here</a><br>
					<b>Cf-Turnstile:</b> Autopass Cloudflare CAPTCHA - <a href="https://greasyfork.org/de/scripts/464785-autopass-cloudflare-captcha" target="_blank">Install Here</a><br>
                </p>
                <br>

                <h2>Support</h2>
                <p>
                    If you have any questions or need assistance, don't hesitate to reach out the creator and supporter, <a href="https://greasyfork.org/users/1162863" target="_blank">Andrewblood</a>.<br>
                </p>
                <br>

                <h2>Privacy Policy</h2>
                <p>
                    This script stores user data locally within TamperMonkey and is exclusively used for script functionality.<br>
                    It is not shared with the script creator or third parties.<br>
                </p>
            `;
            document.body.appendChild(infoOverlay);
        }
        infoOverlay.style.display = 'block';

        document.addEventListener('click', function(event) {
            if (!infoOverlay.contains(event.target) && event.target !== moreInfoButton) {
                closeInfoOverlay();
            }
        });
    }

    function closeInfoOverlay() {
        var infoOverlay = document.getElementById('info-overlay');
        if (infoOverlay) {
            infoOverlay.style.display = 'none';
        }
    }

    // GEÄNDERT: Robustere Methode zum Schließen von Fenstern
    let adWindow = null;
    const originalOpen = unsafeWindow.open;
    unsafeWindow.open = function(url, target, features) {
        // Wir speichern eine direkte Referenz zum neuen Fenster
        adWindow = originalOpen(url, target, features);
        return adWindow;
    };

    // ENTFERNT: Die alte, fehleranfällige Methode wurde entfernt.
    /*
    var oldfunction = unsafeWindow.open;
    var windowName = "";
    function newFunction(params1, params2) {
        if (!params2 || params2 == "_blank") {
            windowName = "popUpWindow";
        } else {
            windowName = params2;
        }
        return oldfunction(params1, windowName);
    }
    unsafeWindow.open = newFunction;
    unsafeWindow.onbeforeunload = function() {
        unsafeWindow.open('', windowName).close();
    };
    */

    // Referal Code einfügen
    if (window.location.href.includes("register")) {
        if (!window.location.href.includes("Andrewblood")) {
            window.location.replace("https://www.coinpayu.com/register?r=Andrewblood");
        }
    }

    // Fenster von Framed Ad schließen
    if (window.location.href.includes("coinpayu.com/dashboard/view_active?id=")) {
        var intervalId = setInterval(function() {
            var waittime = document.querySelector("#app > div > div > div > div > div");
            if (waittime && waittime.style.width === "100%") {
                clearInterval(intervalId);
                // Da dies eine einfache Seite ist, sollte window.close() hier funktionieren.
                setTimeout(function() {
                    window.close();
                }, 500);
            }
        }, 100);
    }
    if (window.location.href === "https://www.coinpayu.com/dashboard") {

        setTimeout(function() {
            setStatus('Go to Framed Ads.');
            window.location.href = "https://www.coinpayu.com/dashboard/ads_active";
            setTimeout(function() {
                document.querySelector("#app > div > div.v2-dashboard-main > div.v2-dashboard-main-section > div > div.leaderboard-top > ul > li:nth-child(2) > a > span").click();
            }, 500);
        }, 1000 * 2);
    }
    // 1. Funktion für Framed Ads
    async function processFramedAds() {
        if (GM_getValue('toggleSwitch1_toggleStatus', false)) {
            setStatus('Start with making Framed Ads.');
            return new Promise(resolve => {
                function processNextFramedElement() {
                    setStatus('Make the next Framed Ad.');
                    var element = document.querySelector('.clearfix.ags-list-box:not(.gray-all)');
                    if (element) {
                        var firstElement = element.querySelector('.text-overflow.ags-description > span');
                        var timeElement = element.querySelector('.ags-detail-time span');
                        var urlElement = element.querySelector('.text-overflow.ags-description');
                        var url = urlElement.getAttribute('title');
                        var time = parseInt(timeElement.textContent);
                        setStatus('Open ' + url + ' for ' + time + ' seconds.');
                        if (firstElement) {
                            firstElement.click();
                            setTimeout(function() {
                                var interval = setInterval(function() {
                                    var alertElementGreen = document.querySelector(".alert-div.alert-green");
                                    var alertElementRed = document.querySelector(".alert-div.alert-red");
                                    if (alertElementGreen) {
                                        clearInterval(interval);
                                        setTimeout(function() {
                                            processNextFramedElement();
                                        }, 3000);
                                    } else if (alertElementRed) {
                                        clearInterval(interval);
                                        element.remove();
                                        setTimeout(function() {
                                            processNextFramedElement();
                                        }, 7000);
                                    }
                                }, 1000);
                            }, 3000);
                        }
                    } else {
                        setStatus('No more Framed Ads.');
                        document.querySelector("#app > div > div.v2-dashboard-main > div.v2-dashboard-main-section > div > div.leaderboard-top > ul > li:nth-child(1) > a > span").click();
                        setTimeout(function() {
                            resolve();
                        }, 2000);
                    }
                }
                processNextFramedElement();
            });
        }
    }

    // 2. Funktion für Frameless Ads
    async function processFramelessAds() {
        if (GM_getValue('toggleSwitch2_toggleStatus', false)) {
            // GEÄNDERT: Statusmeldung korrigiert
            setStatus('Processing Frameless Ads...');
            return new Promise(resolve => {
                function processNextFramelessElement() {
                    var element = document.querySelector('.clearfix.ags-list-box:not(.gray-all)');
                    if (element) {
                        setStatus('Make the next Frameless Ad.');
                        var firstElement = element.querySelector('.text-overflow.ags-description > span');
                        var timeElement = element.querySelector('.ags-detail-time span');
                        var urlElement = element.querySelector('.text-overflow.ags-description');
                        var url = urlElement.getAttribute('title');
                        var time = parseInt(timeElement.textContent);
                        setStatus('Open ' + url + ' for ' + time + ' seconds.');
                        if (firstElement) {
                            firstElement.click();
                            setTimeout(function() {
                                var interval = setInterval(function() {
                                    var alertElementGreen = document.querySelector(".alert-div.alert-green");
                                    var alertElementRed = document.querySelector(".alert-div.alert-red");
                                    if (alertElementGreen) {
                                        clearInterval(interval);
                                        window.focus();
                                        // GEÄNDERT: Schließt das Fenster über die direkte Referenz
                                        if (adWindow && !adWindow.closed) {
                                            adWindow.close();
                                            setStatus('Frameless Ad closed.');
                                        }
                                        setTimeout(function() {
                                            processNextFramelessElement();
                                        }, 3000);
                                    } else if (alertElementRed) {
                                        clearInterval(interval);
                                        element.remove();
                                        setTimeout(function() {
                                            processNextFramelessElement();
                                        }, 7000);
                                    }
                                }, 1000);
                            }, 3000);
                        }
                    } else {
                        setStatus('No more Frameless Ads.');
                        resolve();
                    }
                }
                processNextFramelessElement();
            });
        } else {
            setStatus('Frameless Ads not activated.');
        }
    }

    // 3. Funktion für das Schließen nach der Arbeit oder Seiten-Neuladen nach 3 Stunden
    async function closeAfterWork() {
        setStatus('Checking if "Close after work" is enabled.');
        if (GM_getValue('toggleSwitch3_toggleStatus', false)) {
            return new Promise(resolve => {
                setStatus('Close the window in 10 seconds.');
                setTimeout(function() {
                    window.close();
                    resolve();
                }, 10 * 1000);
            });
        } else {
            return new Promise(resolve => {
                setStatus('Reload the site after 3 hours.');
                setTimeout(function() {
                    window.location.href = "https://www.coinpayu.com/dashboard";
                    resolve();
                }, 3 * 60 * 60 * 1000); // 3 Stunden in Millisekunden
            });
        }
    }

    // Funktionen in Reihenfolge ausführen
    setStatus('Script started.');
    setTimeout(async function run() {
        await processFramedAds();
        await processFramelessAds();
        await closeAfterWork();
    }, 5000); // 5 Sekunden warten, bevor die Funktionen ausgeführt werden

})();