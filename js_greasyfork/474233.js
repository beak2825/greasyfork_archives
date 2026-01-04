// ==UserScript==
// @name         [Premium] Freebitco.in by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      3.7.1
// @description  Faucet Roll/1000% BTC Bonus/WoF Spin and a overlay for settings
// @author       Andrewblood
// @match        *://*.freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/474233/%5BPremium%5D%20Freebitcoin%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/474233/%5BPremium%5D%20Freebitcoin%20by%20Andrewblood.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var overlayStyle = `
    #overlay {
        position: fixed;
        right: 10px;
        bottom: 10px;
        width: 300px;
        height: 350px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        z-index: 9999;
        font-size: 16px;
        display: flex;
        flex-direction: column;
    }

    #overlay h2 {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: white;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        margin-left: 40px;
        margin-bottom: 5px;
    }

    .checkbox-container label {
        color: white;
        margin-left: 5px;
    }

    #status {
        font-size: 16px;
        color: #ffa500;
        margin-top: -10px;
        margin-bottom: 10px;
    }

    #overlay button {
        margin-top: 10px;
        margin-bottom: 10px;
        align-self: center;
        background-color: #ffa500;
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

    #info-overlay ul {
        text-align: center;
        item-algin: center;
        color: white;
    }

    #info-overlay a {
        color: #ffa500;
    }
`;

    GM_addStyle(overlayStyle);

    var overlay = document.createElement('div');
    overlay.id = 'overlay';

    overlay.innerHTML = '<h2>Freebitcoin Script from Andrewblood</h2>';

    var Status = document.createElement('div');
    Status.id = 'status';
    function setStatus(html) {
        Status.innerHTML = html;
    }
    overlay.appendChild(Status);

    var wofCheckboxContainer = document.createElement('div');
    wofCheckboxContainer.classList.add('checkbox-container');
    wofCheckboxContainer.innerHTML = `
        <input type="checkbox" id="wof-checkbox">
        <label for="wof-checkbox">WoF</label>
    `;

    overlay.appendChild(wofCheckboxContainer);

    var bonusCheckboxContainer = document.createElement('div');
    bonusCheckboxContainer.classList.add('checkbox-container');
    bonusCheckboxContainer.innerHTML = `
        <input type="checkbox" id="bonus-checkbox">
        <label for="bonus-checkbox">1000% BTC Bonus</label>
        <button id="settings-button" style="margin-left: 10px;">⚙️</button>
    `;

    overlay.appendChild(bonusCheckboxContainer);

    var rollCheckboxContainer = document.createElement('div');
    rollCheckboxContainer.classList.add('checkbox-container');
    rollCheckboxContainer.innerHTML = `
        <input type="checkbox" id="roll-checkbox">
        <label for="roll-checkbox">Roll</label>
    `;

    overlay.appendChild(rollCheckboxContainer);

    var closeCheckboxContainer = document.createElement('div');
    closeCheckboxContainer.classList.add('checkbox-container');
    closeCheckboxContainer.innerHTML = `
        <input type="checkbox" id="close-checkbox">
        <label for="close-checkbox">Close after work</label>
    `;
    overlay.appendChild(closeCheckboxContainer);

    var moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = 'More Info';
    moreInfoButton.addEventListener('click', openInfoOverlay);

    overlay.appendChild(moreInfoButton);

    document.body.appendChild(overlay);

    function openInfoOverlay() {
        var infoOverlay = document.getElementById('info-overlay');
        if (!infoOverlay) {
            infoOverlay = document.createElement('div');
            infoOverlay.id = 'info-overlay';
            infoOverlay.innerHTML = `
                <h2>Additional Information</h2>
                <p>
                    The script looks at first for a message if you have any WoF aviable, if yes it opens a new page and makes the WoF and close the Wof page.<br>
	                Then it goes to the Reward page and looks how many Reward points you have if you have much enough for 1000% BTC bonus it buy that.<br>
	                After that it make the Roll with or without Captcha. (Captcha Solving not included)<br>
                    Then it close the page 10 seconds later or reload after 60 minutes.<br>
                    You can activate and deactivate the functions in the Overlay as desired.<br>
                </p>
                <br>

           <h2>Download Captcha Solver</h2>
            <p>
				<b>HCaptcha + ReCaptcha:</b> NoCoding Data Scraper and CAPTCHA Solver - <a href="https://chromewebstore.google.com/search/minirpa" target="_blank">Install Here</a><br>
				<b>Antibot Words:</b> AB Links Solver - <a href="https://greasyfork.org/de/scripts/459453-ab-links-solver" target="_blank">Install Here</a><br>
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

    var wofCheckbox = document.getElementById('wof-checkbox');
    wofCheckbox.addEventListener('change', function() {
        GM_setValue('wofStatus', wofCheckbox.checked);
    });

    var savedWofStatus = GM_getValue('wofStatus');
    if (savedWofStatus !== undefined) {
        wofCheckbox.checked = savedWofStatus;
    }

    var bonusCheckbox = document.getElementById('bonus-checkbox');
    bonusCheckbox.addEventListener('change', function() {
        GM_setValue('bonusStatus', bonusCheckbox.checked);
    });

    var savedBonusStatus = GM_getValue('bonusStatus');
    if (savedBonusStatus !== undefined) {
        bonusCheckbox.checked = savedBonusStatus;
    }

    var rollCheckbox = document.getElementById('roll-checkbox');
    rollCheckbox.addEventListener('change', function() {
        GM_setValue('rollStatus', rollCheckbox.checked);
    });

    var savedRollStatus = GM_getValue('rollStatus');
    if (savedRollStatus !== undefined) {
        rollCheckbox.checked = savedRollStatus;
    }

    var closeCheckbox = document.getElementById('close-checkbox');
    closeCheckbox.addEventListener('change', function() {
        GM_setValue('closeStatus', closeCheckbox.checked);
    });

    var savedCloseStatus = GM_getValue('closeStatus');
    if (savedCloseStatus !== undefined) {
        closeCheckbox.checked = savedCloseStatus;
    }

    function checkReferalCode() {
        var url = window.location.href;
        var targetURL = "https://freebitco.in/signup/?op=s&r=3595810";

        if (url.includes("signup") && url !== targetURL) {
            window.location.href = targetURL;
        }
    }

    // Funktion zur Ausführung der WoF-Aktion
    async function performWoFAction() {
        if (savedWofStatus) {
            setStatus('<p>Make WoF spins.</p>');
            if (window.location.href.includes("wof")) {
                await new Promise(resolve => {
                    setTimeout(function() {
                        document.querySelector("#wofc-section > div > div.wofc-spins > p > button:nth-child(2)").click();
                        resolve();
                    }, 1000 * 5);
                });
                await new Promise(resolve => {
                    setTimeout(function() {
                        window.close();
                        resolve();
                    }, 1000 * 10);
                });
            }
            await new Promise(resolve => {
                setTimeout(function() {
                    if (document.querySelector("#free_wof_spins_msg")) {
                        window.open('https://freebitco.in/static/html/wof/wof-premium.html', '_blank');
                    }
                    resolve();
                }, 1000 * 3);
            });
        }
    }

    // Funktion zur Ausführung der Bonus-Aktion
    async function performBonusAction() {
        if (savedBonusStatus) {
            setStatus('<p>Make the Bonus.</p>');
            document.querySelector("body > div.large-12.fixed > div > nav > section > ul > li:nth-child(8) > a").click();
            document.querySelector("#rewards_tab > div.row.reward_category_container_main_div > div > div:nth-child(4) > div.reward_category_name").click();
            await new Promise(resolve => {
                setTimeout(function() {
                    var yourrwp = parseFloat(document.querySelector("#rewards_tab > div:nth-child(2) > div > div.reward_table_box.br_0_0_5_5.user_reward_points.font_bold").innerText.replace(/,/, ''));
                    var bonuscost = parseFloat(document.querySelector("#fp_bonus_rewards > div:nth-child(2) > div:nth-child(2) > div.large-6.small-12.columns > div").innerText.replace(/,/, ''));
                    console.log("Current Reward Points:", yourrwp);
                    console.log("Price for bonus:", bonuscost);
                    if (yourrwp > bonuscost) {
                        document.querySelector("#fp_bonus_rewards > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > button").click();
                    }
                    resolve();
                }, 1000 * 1);
            });
            document.querySelector("#free_play_link_li > a").click();
        }
    }

    // Funktion zur Ausführung der Roll-Aktion
    async function performRollAction() {
        if (savedRollStatus) {
            setStatus('<p>Make the Roll.</p>');
            await new Promise(resolve => {
                const button = document.querySelector("#free_play_form_button");
                const captchaElement = document.querySelector("#freeplay_form_cf_turnstile");
                const captchaResponse = document.querySelector('[name="cf-turnstile-response"]');

                const interval001 = setInterval(function() {

                    if (captchaElement) {
                        captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        if (captchaResponse && captchaResponse.value.length > 0 && button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                            clearInterval(interval001);
                            button.click();
                            resolve();
                        }
                    } else {
                        if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                            clearInterval(interval001);
                            button.click();
                            resolve();
                        }
                    }
                }, 500);
            });
        }
    }

    // Funktion zur Ausführung der Schließ-Aktion
    async function performCloseAction() {
        if (savedCloseStatus) {
            await new Promise(resolve => {
                setStatus('<p>Close the site in 10 seconds.</p>');
                setTimeout(function() {
                    window.close();
                    resolve();
                }, 1000 * 10);
            });
        } else {
            await new Promise(resolve => {
                setStatus('<p>Wait 60 min. for reload.</p>');
                setTimeout(function() {
                    window.location.reload();
                    resolve();
                }, 1000 * 60 * 60);
            });
        }
    }

    // Die Aktionen werden nacheinander ausgeführt
    checkReferalCode();
    setStatus('<p>Script Started.</p>');
    await performWoFAction();
    await performBonusAction();
    await performRollAction();
    await performCloseAction();

})();