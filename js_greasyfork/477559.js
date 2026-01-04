// ==UserScript==
// @name         [Premium] Dutchycorp.space by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      3.3.2
// @description  DUTCHY Roll/Coin Roll/PTC Wall/Surf Ads
// @author       Andrewblood
// @match        *://autofaucet.dutchycorp.space/*
// @exclude      challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autofaucet.dutchycorp.space
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/477559/%5BPremium%5D%20Dutchycorpspace%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/477559/%5BPremium%5D%20Dutchycorpspace%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const titles = [
        'Just a moment', // Englisch
        '稍等片刻', // Chinesisch
        'Een ogenblik', // Holländisch
        'Un instant', // Französisch
        'Nur einen Moment', // Deutsch
        'Un momento', // Italienisch
        'Um momento', // Portugiesisch
        'Bir an' // Türkisch
    ];

    if (titles.some(title => document.title.includes(title))) {
        console.log('Cloudflare-Challenger-Seite erkannt. Dutchycorp Skript wird nicht ausgeführt.');
    } else {


        // CSS für das Overlay
        GM_addStyle(`
        #overlay {
            position: fixed;
            bottom: 10px;
            left: 10px;
            height: 320px;
            width: 250px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            z-index: 9999;
            color: white;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }
        #overlayTitle {
            font-size: 20px;
            text-align: center;
        }
        [type="checkbox"]:not(:checked), [type="checkbox"]:checked {
            position: relative;
            opacity: 1;
        }
        #checkboxContainer label {
            font-size: 16px;
            margin: 10px;
        }

        #status {
            font-size: 16px;
            color: #00aaff;
            text-align: center;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        #overlay button {
            margin-top: 10px;
            margin-left: 20px;
            margin-right: 20px;
            background-color: #00aaff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
            text-align: center;
            align-items: center;
            justify-content: center;
        }
        #overlay button:hover {
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
            text-align: center;
        }
        #info-overlay h2 {
            text-align: center;
            color: white;
        }
        #info-overlay a {
            color: #00aaff;
        }
    `);

        // Overlay HTML
        let overlay = document.createElement("div");
        overlay.id = "overlay";

        // Überschrift erstellen
        var title = document.createElement('div');
        title.id = 'overlayTitle';
        title.textContent = 'Dutchycorp Script from Andrewblood';
        overlay.appendChild(title);

        function setStatus(html) {
            Status.textContent = html;
        }

        var Status = document.createElement('div');
        Status.id = 'status';
        overlay.appendChild(Status);

        var checkboxContainer = document.createElement('div');
        checkboxContainer.id = 'checkboxContainer';
        checkboxContainer.innerHTML = `
        <label><input type="checkbox" id="dutchyRoll"> DUTCHY Roll</label><br>
        <label><input type="checkbox" id="coinRoll"> Coin Roll</label><br>
        <label><input type="checkbox" id="ptcWall"> PTC Wall</label><br>
        <label><input type="checkbox" id="surfAds"> Surf Ads</label><br>
        <label><input type="checkbox" id="shortlinks"> Shortlinks</label><br>
        <label><input type="checkbox" id="closeAfterWork"> Close after work</label>
    `;
        overlay.appendChild(checkboxContainer);

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
				You can start on <a href="https://autofaucet.dutchycorp.space/roll.php">DUTCHY Roll</a>.<br>
				Now all captchas supported.
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

        function specialClick(selector) {
            var interval001 = setInterval(function() {
                var button = document.querySelector(selector);
                var captchaElement = document.querySelector("#captcha");
                var captchaResponse = document.querySelector("[name='g-recaptcha-response'], [name='cf-turnstile-response'], [name='h-captcha-response']");
                var iconCaptchaResponse = document.querySelector('.iconcaptcha-modal__body-title');

                if (captchaElement) {
                    captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (((captchaResponse && captchaResponse.value.length > 0) || (iconCaptchaResponse && iconCaptchaResponse.innerHTML == 'Verification complete.')) && button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                        clearInterval(interval001);
                        console.log("Click: " + button.innerText);
                        setTimeout(() => {
                            button.click();
                        }, 2000);
                    }
                } else {
                    if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                        clearInterval(interval001);
                        console.log("Click: " + button.innerText);
                        setTimeout(() => {
                            button.click();
                        }, 2000);
                    }
                }
            }, 500);
        }

        // Ad Closer
        var oldFunction = unsafeWindow.open;
        var lastOpenedWindow = null;
        function closeAdFunction(url, target) {
            var windowName = (target && target !== "_blank") ? target : "popUpWindow";
            lastOpenedWindow = oldFunction(url, windowName);
            return lastOpenedWindow;
        }
        unsafeWindow.open = closeAdFunction;
        unsafeWindow.onbeforeunload = function() {
            if (lastOpenedWindow) {
                lastOpenedWindow.close();
                lastOpenedWindow = null;
            }
        };

        // Load checkbox values
        document.getElementById('dutchyRoll').checked = GM_getValue('dutchyRoll', false);
        document.getElementById('coinRoll').checked = GM_getValue('coinRoll', false);
        document.getElementById('ptcWall').checked = GM_getValue('ptcWall', false);
        document.getElementById('surfAds').checked = GM_getValue('surfAds', false);
        document.getElementById('shortlinks').checked = GM_getValue('shortlinks', false);
        document.getElementById('closeAfterWork').checked = GM_getValue('closeAfterWork', false);

        // Save checkbox values on change
        document.querySelectorAll('#checkboxContainer input').forEach(input => {
            input.addEventListener('change', () => {
                GM_setValue(input.id, input.checked);
            });
        });
        setStatus("Script started.");

        // DUTCHY Roll
        if (GM_getValue('dutchyRoll', false) && window.location.href.includes("https://autofaucet.dutchycorp.space/roll_game.php")) {
            setStatus("Make DUTCHY Roll");
            specialClick("#unlockbutton");
            specialClick("#claim_boosted");
            if (document.querySelector("#timer")){
                window.location.replace("https://autofaucet.dutchycorp.space/coin_roll.php");
            }
            document.querySelector("#unlockbutton").focus;
        }

        // Coin Roll
        if (GM_getValue('coinRoll', false) && window.location.href.includes("https://autofaucet.dutchycorp.space/coin_roll.php")) {
            setStatus("Make Roll");
            specialClick("#unlockbutton");
            specialClick("#claim_boosted");
            if (document.querySelector("#timer")){
                window.location.replace("https://autofaucet.dutchycorp.space/ptc/wall.php");
            }
            document.querySelector("#unlockbutton").focus;
        }

        // PTC Wall
        if (GM_getValue('ptcWall', false) && window.location.href.includes("https://autofaucet.dutchycorp.space/ptc/wall.php")) {
            setStatus("Make PTC Wall");


            const wallNext = document.querySelector('[name="claim"]');

            if (wallNext && !wallNext.href.includes("bitcotask")){
                console.log(wallNext.href);
                wallNext.onmousedown();
                window.open(wallNext.href, "_self");
            } else {
                window.location.replace("https://autofaucet.dutchycorp.space/ptc/");
            }
        }

        if (GM_getValue('ptcWall', false) && window.location.href.includes("https://autofaucet.dutchycorp.space/ptc/view")) {
            setStatus("Make PTC");
            specialClick("[type='submit']");
            var asdf = setInterval(function() {
                if (document.querySelector(".g-recaptcha.bordeaux-btn.btn-small.waves-effect.waves-red") && document.querySelector(".g-recaptcha.bordeaux-btn.btn-small.waves-effect.waves-red").offsetHeight > 0) {
                    clearInterval(asdf);
                    document.querySelector(".g-recaptcha.bordeaux-btn.btn-small.waves-effect.waves-red").click();
                }
            }, 2000);
        }

        // Surf Ads
        if (GM_getValue('surfAds', false) && window.location.href === "https://autofaucet.dutchycorp.space/ptc/") {
            setStatus("Make Surf Ads");
            specialClick("[type='submit']");
            if (document.querySelector(".fas.fa-check-double")) {
                window.location.replace("https://autofaucet.dutchycorp.space/shortlinks-wall.php");

            }
        }

        if (GM_getValue('shortlinks', false) && window.location.href.includes("https://autofaucet.dutchycorp.space/shortlinks-wall")){

            const shortlinkMakedandLikeBanner = document.querySelector(".card.center-align.white-text.z-depth-5.faa-horizontal.animated")
            if (shortlinkMakedandLikeBanner && shortlinkMakedandLikeBanner.innerText.includes("Received")) {

            }

            const link = "/extend_claim_count_wall_nu_link_per_click_version.php?username=";
            const name = document.querySelector("#properties > ul > li:nth-child(10) > a > span > b, #mobile-demo > div > b").innerText.toLowerCase().replace(/\s+/g, '');
            const and = "&id=";
            const number = document.querySelector(".transparent-btn.tooltipped");
            if (number) {
                const nextShortlinkUrl = link+name+and+number.value;
                // setTimeout(function() {
                window.open(nextShortlinkUrl, '_self');
                // }, 1000);
                // window.location.href = nextShortlinkUrl;
            } else if (GM_getValue('closeAfterWork', false)){
                setStatus("Close in 10 seconds");
                setTimeout(function() {
                    window.close();
                }, 1000*10);
            } else {
                setStatus("Restart in 30 min.");
                setTimeout(function() {
                    window.location.replace("https://autofaucet.dutchycorp.space/roll.php");
                }, 1000*60*30);
            }
        }

        // Referal
        if ((window.location.href.includes("signup") && !window.location.href.includes("marcel6")) || window.location.href === "https://autofaucet.dutchycorp.space/") {
            window.location.replace("https://autofaucet.dutchycorp.space/signup.php?r=marcel6");
        }

    }

})();