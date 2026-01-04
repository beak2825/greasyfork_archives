// ==UserScript==
// @name         [Premium] Firefaucet.win by Andrewblood
// @tag          Faucet
// @namespace    https://greasyfork.org/users/1162863
// @version      1.4.2
// @description  Dayli Bonus/Faucet Roll/Level Rewards/Dayli Tasks/Shortlinks/PTC
// @author       Andrewblood
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firefaucet.win
// @match        *://*.firefaucet.win/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @grant        window.close
// @grant        unsafeWindow
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/494173/%5BPremium%5D%20Firefaucetwin%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/494173/%5BPremium%5D%20Firefaucetwin%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS-Stil für das Overlay
    var overlayStyle = `
        #overlay {
            position: fixed !important;
            left: 10px !important; /* Abstand vom linken Rand */
            bottom: 10px !important; /* Abstand vom unteren Rand */
            width: 300px !important; /* Breite des Overlays */
            height: 450px !important; /* Höhe des Overlays */
            background-color: rgba(0, 0, 0, 0.5) !important; /* Halbtransparentes Schwarz */
            color: white !important; /* Schriftfarbe Schwarz */
            padding: 10px !important;
            z-index: 9999 !important; /* Stellen Sie sicher, dass das Overlay oben liegt */
            font-size: 16px !important; /* Schriftgröße 16px */
            display: flex;
            flex-direction: column; /* Überschrift und Inhalt untereinander */
        }

        #overlay h2 {
            font-size: 20px; /* Größe des h2-Titels */
            margin-bottom: 20px; /* Abstand nach unten */
            text-align: center; /* Überschrift zentriert */
        }

        #status {
            font-size: 16px; /* Gleiche Größe wie die Schalter */
            color: #2ed573; /* Hellblau wie der Button */
            text-align: center; /* Vertikal zentriert */
            margin-top: -10px; /* 5px näher zur Überschrift */
            margin-bottom: 10px; /* 5px Abstand nach unten */
        }

        .checkbox-container {
            display: flex;
            align-items: center; /* Vertikal zentriert */
            margin-left: 40px; /* Abstand vom linken Rand */
            margin-bottom: 5px; /* Abstand nach unten */
        }

        label {
            color: white !important;
        }

        .checkbox-container input[type="checkbox"] {
            margin-right: 5px; /* Abstand zwischen Checkbox und Text */
        }
        #overlay button {
            margin-top: 10px;
            margin-left: 40px;
            margin-right: 40px;
            background-color: #2ed573;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
            text-align: center;
        }

        #overlay button:hover {
            background-color: #7fffd4;
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
            text-align: center;
            z-index: 99999;
            padding: 20px;
            display: none;
            overflow-y: auto;
        }

        #info-overlay h2 {
            font-size: 28px !important;
            text-align: center;
            color: white;
        }

        #info-overlay a {
            color: #2ed573;
        }

    .imageOverlay {
        position: fixed;
        z-index: 9999;
        padding: 10px;
        border-radius: 5px;
    }
    .imageOverlay.original {
        top: 100px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
    }
    .imageOverlay.processed {
        top: 200px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
    }
    .imageOverlay img {
        max-width: 200px;
        max-height: 200px;
        width: auto;
        height: auto;
    }
    `;

    // Füge den CSS-Stil hinzu
    GM_addStyle(overlayStyle);

    // Erstelle das Overlay-Element mit innerHTML
    var overlay = document.createElement('div');
    overlay.id = 'overlay';

    // Überschrift
    overlay.innerHTML = '<h2>Firefaucet Script from Andrewblood</h2>';

    function setStatus(html) {
        Status.textContent = html;
    }

    var Status = document.createElement('div');
    Status.id = 'status';
    overlay.appendChild(Status);

    var daylibonusCheckboxContainer = document.createElement('div');
    daylibonusCheckboxContainer.classList.add('checkbox-container');
    daylibonusCheckboxContainer.innerHTML = `
        <input type="checkbox" id="daylibonus-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="daylibonus-checkbox">Dayli Bonus</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(daylibonusCheckboxContainer);

    var faucetCheckboxContainer = document.createElement('div');
    faucetCheckboxContainer.classList.add('checkbox-container');
    faucetCheckboxContainer.innerHTML = `
        <input type="checkbox" id="faucet-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="faucet-checkbox">Faucet</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(faucetCheckboxContainer);

    var levelrewardCheckboxContainer = document.createElement('div');
    levelrewardCheckboxContainer.classList.add('checkbox-container');
    levelrewardCheckboxContainer.innerHTML = `
        <input type="checkbox" id="levelreward-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="levelreward-checkbox">Level Reward</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(levelrewardCheckboxContainer);

    var taskCheckboxContainer = document.createElement('div');
    taskCheckboxContainer.classList.add('checkbox-container');
    taskCheckboxContainer.innerHTML = `
        <input type="checkbox" id="task-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="task-checkbox">Dayli Tasks</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(taskCheckboxContainer);

    var ptcCheckboxContainer = document.createElement('div');
    ptcCheckboxContainer.classList.add('checkbox-container');
    ptcCheckboxContainer.innerHTML = `
        <input type="checkbox" id="ptc-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="ptc-checkbox">PTC</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(ptcCheckboxContainer);

    var shortlinkCheckboxContainer = document.createElement('div');
    shortlinkCheckboxContainer.classList.add('checkbox-container');
    shortlinkCheckboxContainer.innerHTML = `
        <input type="checkbox" id="shortlink-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="shortlink-checkbox">Shortlinks</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(shortlinkCheckboxContainer);

    var offerwallCheckboxContainer = document.createElement('div');
    offerwallCheckboxContainer.classList.add('checkbox-container');
    offerwallCheckboxContainer.innerHTML = `
        <input type="checkbox" id="offerwall-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="offerwall-checkbox">Offerwall</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(offerwallCheckboxContainer);

    var closeCheckboxContainer = document.createElement('div');
    closeCheckboxContainer.classList.add('checkbox-container');
    closeCheckboxContainer.innerHTML = `
        <input type="checkbox" id="close-checkbox"> <!-- Kästchen zum Ankreuzen -->
        <label for="close-checkbox">Close after work</label> <!-- Text neben dem Kästchen -->
    `;
    overlay.appendChild(closeCheckboxContainer);

    var moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = 'More Info';
    moreInfoButton.addEventListener('click', openInfoOverlay);

    overlay.appendChild(moreInfoButton);

    // Füge das Overlay dem Dokument hinzu
    document.body.appendChild(overlay);



    var daylibonusCheckbox = document.getElementById('daylibonus-checkbox');
    daylibonusCheckbox.addEventListener('change', function() {
        GM_setValue('daylibonusStatus', daylibonusCheckbox.checked);
    });

    var savedDayliBonusStatus = GM_getValue('daylibonusStatus');
    if (savedDayliBonusStatus !== undefined) {
        daylibonusCheckbox.checked = savedDayliBonusStatus;
    }

    var faucetCheckbox = document.getElementById('faucet-checkbox');
    faucetCheckbox.addEventListener('change', function() {
        GM_setValue('faucetStatus', faucetCheckbox.checked);
    });

    var savedFaucetStatus = GM_getValue('faucetStatus');
    if (savedFaucetStatus !== undefined) {
        faucetCheckbox.checked = savedFaucetStatus;
    }

    var levelrewardCheckbox = document.getElementById('levelreward-checkbox');
    levelrewardCheckbox.addEventListener('change', function() {
        GM_setValue('levelrewardStatus', levelrewardCheckbox.checked);
    });

    var savedLevelRewardStatus = GM_getValue('levelrewardStatus');
    if (savedLevelRewardStatus !== undefined) {
        levelrewardCheckbox.checked = savedLevelRewardStatus;
    }

    var taskCheckbox = document.getElementById('task-checkbox');
    taskCheckbox.addEventListener('change', function() {
        GM_setValue('taskStatus', taskCheckbox.checked);
    });

    var savedTaskStatus = GM_getValue('taskStatus');
    if (savedTaskStatus !== undefined) {
        taskCheckbox.checked = savedTaskStatus;
    }

    var ptcCheckbox = document.getElementById('ptc-checkbox');
    ptcCheckbox.addEventListener('change', function() {
        GM_setValue('ptcStatus', ptcCheckbox.checked);
    });

    var savedPtcStatus = GM_getValue('ptcStatus');
    if (savedPtcStatus !== undefined) {
        ptcCheckbox.checked = savedPtcStatus;
    }

    var shortlinkCheckbox = document.getElementById('shortlink-checkbox');
    shortlinkCheckbox.addEventListener('change', function() {
        GM_setValue('shortlinkStatus', shortlinkCheckbox.checked);
    });

    var savedShortlinkStatus = GM_getValue('shortlinkStatus');
    if (savedShortlinkStatus !== undefined) {
        shortlinkCheckbox.checked = savedShortlinkStatus;
    }

    var offerwallCheckbox = document.getElementById('offerwall-checkbox');
    offerwallCheckbox.addEventListener('change', function() {
        GM_setValue('offerwallStatus', offerwallCheckbox.checked);
    });

    var savedOfferwallStatus = GM_getValue('offerwallStatus');
    if (savedOfferwallStatus !== undefined) {
        offerwallCheckbox.checked = savedOfferwallStatus;
    }

    var closeCheckbox = document.getElementById('close-checkbox');
    closeCheckbox.addEventListener('change', function() {
        GM_setValue('closeStatus', closeCheckbox.checked);
    });

    var savedCloseStatus = GM_getValue('closeStatus');
    if (savedCloseStatus !== undefined) {
        closeCheckbox.checked = savedCloseStatus;
    }


    function openInfoOverlay() {
        var infoOverlay = document.getElementById('info-overlay');
        if (!infoOverlay) {
            infoOverlay = document.createElement('div');
            infoOverlay.id = 'info-overlay';
            infoOverlay.innerHTML = `
                <h2>Additional Information</h2>
                <p>
The script looks at first on Dashboard if it any from that aviable and clicks on that: Dayli Bonus/Faucet Roll/Level Rewards/Dayli Tasks/PTC/Shortlinks <br>
Shortlink Maker for the Shortlinks on this site you can download from my Greasyfork profile: <a href="https://greasyfork.org/users/1162863" target="_blank">Andrewblood</a>. <br>
Dayli Bonus/Faucet Roll: It choose the Captcha in this order if it is aviable: 1)Turnstile 2)ReCaptcha 3)HCaptcha <br>
PTC: Captcha Solver for full automation integrated. <br>
Shortlinks: On this page you can Unflag the sites and the script don't take the sites. <br>
Offerwall: I have a script released for the site what opens. <br>

                </p>
                <br>

           <h2>Download Captcha Solver</h2>
            <p>
				<b>Google ReCaptcha:</b> RektCAPTCHA - <a href="https://github.com/Wikidepia/RektCAPTCHA" target="_blank">Install Here</a><br>
				<b>Antibot Words:</b> AB Links Solver - <a href="https://greasyfork.org/de/scripts/459453-ab-links-solver" target="_blank">Install Here</a><br>
				<b>Cf-Turnstile:</b> Captcha Solver - <a href="https://github.com/MrAndrewBlood/Captcha-Solver" target="_blank">Install Here</a><br>
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



    if (window.location.href.includes("register")) {
        function checkAndRedirect() {
            var referByCookie = getCookie("refer_by");
            if (referByCookie === "79539") {
            } else {
                window.location.href = "https://firefaucet.win/ref/79539";
            }
        }

        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        checkAndRedirect();
    }

        function specialClick(selector) {
            const interval001 = setInterval(function() {
                const button = document.querySelector(selector);
                const captchaElement = document.querySelector(".captcha-modal, .g-recaptcha, .h-captcha, #captcha_container, #captcha-holder");
                const captchaResponse = document.querySelector("[name='h-captcha-response'], #g-recaptcha-response");

                if (captchaElement) {
                    captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (captchaResponse && captchaResponse.value.length > 0 && button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                        clearInterval(interval001);
                        console.log("Click: " + button.innerText);
                        setTimeout(() => {
                            button.click();
                        }, 2000);
                    }
                } else {
                    if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                        clearInterval(interval001);
                        console.log("Click: " + button.innerText);
                        setTimeout(() => {
                            button.click();
                        }, 2000);
                    }
                }
            }, 500);
        }


    setStatus('Script started.');


    if (window.location.href === "https://firefaucet.win/") {
        setStatus('Search and make the next activated step.');
        const dailyBonus = document.querySelector(".btn-flat.waves-effect.waves-dark");
        const dailyBonusDisabled = document.querySelector("#disabled");
        const faucet = document.querySelector("#faucet_btn");
        const taskButton = document.querySelector(".dashboard-action-btns > a:nth-child(6)");
        const taskValue = document.querySelector("#data__tasks_available_to_collect");
        const ptc = document.querySelector("#ptc-btn");
        const offerwall = document.querySelector("#offerwall-btn");
        const shortlinks = document.querySelector(".dashboard-action-btns > a:nth-child(1)");
        const reward = document.querySelector(".level-reward-section > div:nth-child(2) > a");

        setTimeout(function () {
            if (savedDayliBonusStatus && dailyBonus && !dailyBonusDisabled) {
                dailyBonus.click();
            } else if (savedFaucetStatus && faucet && !faucet.innerText.includes('s')) {
                faucet.click();
            } else if (savedLevelRewardStatus && reward && reward.innerText.includes('Claim')) {
                reward.click();
            } else if (savedTaskStatus && taskButton && taskValue.innerText > 0) {
                taskButton.click();
            } else if (savedPtcStatus && ptc && !ptc.innerText.includes('0')) {
                ptc.click();
            } else if (savedShortlinkStatus && document.referrer !== "https://firefaucet.win/shortlinks" && document.referrer !== "https://firefaucet.win/offerwalls/bitcotasks/") {
                shortlinks.click();
            } else if (savedOfferwallStatus && document.referrer !== "https://firefaucet.win/offerwalls/bitcotasks/") {
                offerwall.click();
            } else if (savedCloseStatus) {
                setStatus('Close the site in 10 seconds.');
                setTimeout(function() {
                    window.close();
                }, 1000*10);
            } else {
                setStatus('Reload in 30 minutes.');
                setTimeout(function() {
                    window.location.reload();
                }, 1000*60*30);
            }
        }, 3000);

    }

    if (savedDayliBonusStatus && window.location.href === ("https://firefaucet.win/daily/")) {

        setStatus('Make the daily Bonus.');
        const xButtonBottomAd = document.querySelector(".sticky-ad-close.waves-effect.waves-dark");
        const selectturnstile = document.querySelector("#select-turnstile");
        const selectrecaptcha = document.querySelector("#select-recaptcha");
        const selecthcaptcha = document.querySelector("#select-hcaptcha");



        if (document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > a > button")){
            document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > a > button").click()
        }

        if (document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > form > div:nth-child(2)").innerText.includes('reCAPTCHA')){
            document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > form > div:nth-child(2) > label:nth-child(2)").click()
        }



        if (selectturnstile) {
            selectturnstile.click();
        } else if (selectrecaptcha) {
            selectrecaptcha.click();
        } else if (selecthcaptcha) {
            selecthcaptcha.click();
        }

        setInterval(function() {

            const daylibonus = document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > form > button");

            if (document.querySelector("body > div.row > div.col.s12.m12.l6 > div > center > form > input[type=hidden]").value.length > 0) {
                daylibonus.click();
            }
        }, 3000);

    }

    if (savedFaucetStatus && window.location.href.includes("/faucet")) {
        setStatus('Make the Faucet.');
        const reward = document.querySelector("#get_reward_button")
        const selectturnstile = document.querySelector("#select-turnstile");
        const selecthcaptcha = document.querySelector("#select-hcaptcha");
        const selectrecaptcha = document.querySelector("#select-recaptcha");
        if (reward) reward.scrollIntoView({ behavior: 'smooth', block: 'center' });


        if (!selectturnstile && !selecthcaptcha && !selectrecaptcha) {
            reward.click();
        }

        if (selectturnstile) {
            selectturnstile.click()
        } else if (selectrecaptcha) {
            selectrecaptcha.click();
        } else if (selecthcaptcha) {
            selecthcaptcha.click();
        }

        setInterval(function() {
            const turnstileElement = document.querySelector("#captcha-turnstile");
            const recaptchaElement = document.querySelector("#captcha-recaptcha");
            const hcaptchaElement = document.querySelector("#captcha-hcaptcha")

            const turnstileResponse = document.querySelector('input[name="cf-turnstile-response"]');
            const recaptchaResponse = document.querySelector("#g-recaptcha-response");
            const hcaptchaResponse = document.querySelector('[name="h-captcha-response"]');


            if (turnstileElement && turnstileElement.offsetParent !== null && turnstileResponse.value.length > 0) {
                reward.click();
            }
            else if (recaptchaElement && recaptchaElement.offsetParent !== null && recaptchaResponse.value.length > 0) {
                reward.click();
            }
            else if (hcaptchaElement && hcaptchaElement.offsetParent !== null && hcaptchaResponse.value.length > 0) {
                reward.click();
            }
        }, 3000);
    }

    if (savedLevelRewardStatus && window.location.href.includes("/levels")) {
        setStatus('Take the level Bonus.');
        const collect = document.querySelector(".z-depth-1 > table > tbody > tr:nth-child(1) > th:nth-child(4) > a")

        if (collect && collect.innerText.includes("Collect")) {
            collect.click();
        }
        else {
            window.location.replace("https://firefaucet.win/");
        }
    }

    if (savedTaskStatus && window.location.href.includes("/tasks")) {
        setStatus('Take the daily task Bonus.');

        var elements = document.getElementsByClassName("bi bi-clipboard-check f-14");

        function clickElementsWithDelay(index) {
            if (index < elements.length) {
                elements[index].click();
                setTimeout(function() {
                    clickElementsWithDelay(index + 1);
                }, 3000);
            } else {
                window.location.replace("https://firefaucet.win/");
            }
        }
        clickElementsWithDelay(0);
    }

    if (savedPtcStatus) {
        if (window.location.href === "https://firefaucet.win/ptc/" || window.location.href === "https://firefaucet.win/ptc/#!") {
            setStatus("Make the available PTC's.");
            const allviewed = document.querySelector(".card-panel > center:nth-child(11) > i")
            const allviewed2 = document.querySelector(".card-panel > center:nth-child(9) > i")
            const viewadvert = document.querySelector(".row > div:nth-child(1) > div > div:nth-child(3) > a")
            const sucessmessage = document.querySelector(".success_msg.hoverable")

            if (viewadvert) {
                viewadvert.click();
            }
            else {
                window.location.replace("https://firefaucet.win/");
            }
        }

        if (window.location.href.includes("https://firefaucet.win/viewptc")) {

            // Create the original overlay div and add it to the document
            const originalOverlayDiv = document.createElement('div');
            originalOverlayDiv.classList.add('imageOverlay', 'original');
            document.body.appendChild(originalOverlayDiv);

            // Create the processed overlay div and add it to the document
            const processedOverlayDiv = document.createElement('div');
            processedOverlayDiv.classList.add('imageOverlay', 'processed');
            document.body.appendChild(processedOverlayDiv);

            // Create img elements for the original and processed images
            const originalImgElement = document.createElement('img');
            const processedImgElement = document.createElement('img');
            originalOverlayDiv.appendChild(originalImgElement);
            processedOverlayDiv.appendChild(processedImgElement);

            // Load Tesseract.js script
            var tesseractScript = document.createElement('script');
            tesseractScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.4/tesseract.min.js';
            tesseractScript.onload = function() {

                // Load Tesseract worker
                var workerScript = document.createElement('script');
                workerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.4/worker.min.js';
                workerScript.onload = function() {
                    setStatus("Tesseract.js loaded");

                    // OpenCV script
                    var opencvScript = document.createElement('script');
                    opencvScript.src = 'https://docs.opencv.org/4.5.5/opencv.js';
                    opencvScript.onload = function() {
                        setStatus("OpenCV.js loaded");

                        // Funktion zum Polling bis das Element sichtbar ist
                        function waitForElement(selector, callback) {
                            const element = document.querySelector(selector);
                            if (element && element.offsetHeight > 1) {
                                callback(element);
                            } else {
                                setTimeout(() => waitForElement(selector, callback), 1000);
                            }
                        }

                        // Funktion zum Laden und Bearbeiten des Bildes
                        function loadAndProcessImage() {

                            // Überwachungsfunktion, die in bestimmten Intervallen prüft, ob das Bild vorhanden ist
                            let interval = setInterval(function() {
                                let imgElement = document.querySelector("#description > img");
                                if (imgElement) {
                                    clearInterval(interval); // Stoppe das Intervall, wenn das Bild vorhanden ist
                                    setStatus('Picture found and start to edit the image.')
                                    originalImgElement.src = imgElement.src; // Zeige das Originalbild an
                                    processImage(imgElement); // Lade und bearbeite das Bild
                                } else {
                                    setStatus('Wait for picture.')
                                }
                            }, 1000); // Überprüfe alle 1 Sekunde, ob das Bild vorhanden ist
                        }

                        // Funktion zum Laden und Bearbeiten des Bildes
                        function processImage(imgElement) {
                            let src = cv.imread(imgElement);

                            // Schritt 0: Vergrößere das Bild
                            let resized = new cv.Mat();
                            let dsize = new cv.Size(src.cols * 4, src.rows * 4); // Verdreifache die Größe des Bildes
                            cv.resize(src, resized, dsize, 0, 0, cv.INTER_LINEAR);

                            let dst = new cv.Mat();
                            let M = cv.Mat.ones(5, 5, cv.CV_8U);
                            let anchor = new cv.Point(-1, -1);

                            // Schritt 1: Ändere die Schriftfarbe auf Weiß und den Hintergrund auf Schwarz
                            cv.cvtColor(resized, dst, cv.COLOR_RGB2GRAY);
                            cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

                            // Schritt 2: Verwende Morphologie-Operationen, um das Bild zu bearbeiten
                            cv.dilate(dst, dst, M, anchor, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
                            //        cv.erode(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

                            // Schritt 3: Konvertiere das bearbeitete Bild zurück in ein DOM-Element
                            let canvas = document.createElement('canvas');
                            cv.imshow(canvas, dst);
                            let manipulatedImageSrc = canvas.toDataURL();

                            // Füge das bearbeitete Bild dem Overlay-DIV hinzu
                            processedImgElement.src = manipulatedImageSrc;

                            // Texterkennung mit Tesseract.js
                            Tesseract.recognize(
                                manipulatedImageSrc,
                                'eng',
                                {
                                    logger: m => setStatus("Tesseract Log:", m),
                                    psm: 7,
                                    oem: 3,
                                    tessedit_char_whitelist: "0123456789"
                                }
                            ).then(({ data: { text } }) => {
                                setStatus("Text from teseract:", text);

                                // Filtere nur Zahlen von 0 bis 9 aus dem erkannten Text
                                const filteredText = text.replace(/[^0-9]/g, '');

                                setStatus('Regonized Numbers: ' + filteredText)

                                var textField = document.querySelector("#description > input.captcha-input");

                                // Überprüfe, ob die Länge des Textes korrekt ist
                                if (filteredText.length === 4) {
                                    textField.value = filteredText;

                                } else {
                                    location.reload();
                                }
                            });

                            // Bereinige Ressourcen
                            src.delete();
                            dst.delete();
                            M.delete();
                            resized.delete();
                        }

                        // Starte das Laden und Bearbeiten des Bildes
                        loadAndProcessImage();
                    };
                    document.head.appendChild(opencvScript);
                };
                document.head.appendChild(workerScript);
            };
            document.head.appendChild(tesseractScript);

            setInterval(function () {
                if (document.querySelector("#description > input.captcha-input").value.length === 4 && document.querySelector("#submit-button").offsetHeight > 1){
                    document.querySelector("#submit-button").click();
                    setTimeout(function() {
                        window.close();
                    }, 200);
                } else {
                }
            }, 1000);
        }
    }

    if (savedOfferwallStatus && window.location.href.includes("offerwall")) {
        document.querySelector("body > div.row > div.col.s12.l12.xl8 > div.card-panel.card-limited-max-width > div:nth-child(8) > a").click();
        document.querySelector("#bitcotasks > div > div > a").click();
        window.location.replace("https://firefaucet.win/");
    }

    if (savedShortlinkStatus && window.location.href.includes("/shortlinks")) {
        setStatus('Make the unflagged Shortlinks.');

        let helpers = {
            typer: function(inputElm, value) {
                let lastValue = inputElm.value;
                inputElm.value = value;
                let event = new Event('input', { bubbles: true });
                event.simulated = true;
                let tracker = inputElm._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                inputElm.dispatchEvent(event);
            },

            triggerMouseEvent: function(elm, eventType) {
                let clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent(eventType, true, true);
                elm.dispatchEvent(clickEvent);
            },

            alternativeClick: function(elm) {
                helpers.triggerMouseEvent(elm, "mouseover");
                helpers.triggerMouseEvent(elm, "mousedown");
                helpers.triggerMouseEvent(elm, "mouseup");
                helpers.triggerMouseEvent(elm, "click");
            }
        };

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function randomDisplayNumber() {
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;

            var randomX = getRandomNumber(0, screenWidth);
            var randomY = getRandomNumber(0, screenHeight);

            return { x: randomX, y: randomY };
        }

        function moveMouseTo(x, y) {
            var event = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: document.defaultView,
                clientX: x,
                clientY: y
            });
            document.dispatchEvent(event);
        }

        function selectLinks(selectorPrefix, startIndex) {
            let links = [];
            for (let i = startIndex; i < startIndex + 10; i++) {
                let link = document.querySelector(`${selectorPrefix} form:nth-child(${i}) button[type='submit']`);
                links.push(link);
            }
            return links;
        }

        function clickFirstValidLink(links) {
            for (let i = 0; i < links.length; i++) {
                let link = links[i];
                if (link && link.innerText.includes(i + 1)) {
                    var randomPosition = randomDisplayNumber();
                    moveMouseTo(randomPosition.x, randomPosition.y);
                    helpers.alternativeClick(link);
                    window.close();
                    return;
                }
            }
            window.location.replace("https://firefaucet.win/");
        }


        // Überprüfe das Element mit der Klasse "success_msg.hoverable"
        let successMsg = document.querySelector(".success_msg.hoverable");
        let selectorPrefix = successMsg ? "body > div.row > div.col.s12.m12.l8 > div > div:nth-child(6) > div.sl-views-section" : "body > div.row > div.col.s12.m12.l8 > div > div:nth-child(5) > div.sl-views-section";

        // Hauptcode
        let links = selectLinks(selectorPrefix, 1);

        setTimeout(function () {
            clickFirstValidLink(links);
        }, 3000);

    }


})();