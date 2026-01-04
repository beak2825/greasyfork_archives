// ==UserScript==
// @name         Better BiteFight
// @namespace    https://lobby.bitefight.gameforge.com/
// @version      1.0.1
// @description  Adds an healthbar, energybar, links and other QOL to BiteFight
// @author       Spychopat
// @match        https://*.bitefight.gameforge.com/*
// @exclude      https://lobby.bitefight.gameforge.com/*
// @exclude      https://forum.bitefight.gameforge.com/*
// @icon         https://lobby.bitefight.gameforge.com/favicon.ico
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/517933/Better%20BiteFight.user.js
// @updateURL https://update.greasyfork.org/scripts/517933/Better%20BiteFight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // hide the page at the start, to avoid seeing the page jumping (it's then showed again after the script is loaded)
    const style = document.createElement('style');
    style.textContent = `body {visibility: hidden;}`; // hardcore
    if(document.head)document.head.appendChild(style);


    // Script storage keys
    const KEY_SERVER_DOMAIN = window.location.hostname;
    const pageLoadTime = Date.now();

    // Define character object
    const CHARACTER = GM_getValue(KEY_SERVER_DOMAIN, {
        health: 0,
        maxHealth: 0,
        regenHealth: 0,
        energy: 0,
        maxEnergy: 0,
        regenEnergy: 4,
        potionCooldownEnd: 0,
        energyPotionCooldownEnd: 0,
        churchCooldownEnd: 0,
        jobCooldownEnd: 0,
        autoRedirectGrotte: true,
        autoGrotto: [false, false, false],
        autoGrottoInstant: false,
        lastGrottoClick: -1,
        highlightChurch: false,
        highlightPotion: true,
        highlightEnergyPotion: true,
        highlightJob: 2,
        healthRefreshRate: 200,
        showTotalStat: false,
        hideBuddies: true,
        hideCharisma: true
    });

    const GROTTO_STATS = GM_getValue(KEY_SERVER_DOMAIN+"/grotto_stats", {
        goldEarned: { 0: [], 1: [], 2: [] },
        dmgTaken: { 0: [], 1: [], 2: [] },
        xpEarned: { 0: [], 1: [], 2: [] }
    });
    // used to store the health refresh interval, so we can dynamically change it in the settings
    let healthRefreshInterval;
    let maxHealthString;
    let maxEnergyString;


    //console.log(parseInt(formatNumber(document.getElementsByClassName("gold")[1].firstChild.textContent.split("\n")[1])));

    var mainScriptRunned = false;
    window.addEventListener('load', function() {
        main();
    },false);

    // sometime, the previous event isn't triggered for some reason (pretty rare), but when it happens, it's bad. so, i run the script after 2 seconds anyway, as a failsafe
    setTimeout(() => {
        main();
    }, 2000);

    function main(){
        if(mainScriptRunned)return;
        mainScriptRunned = true;
        redirectAfterGrotteFight(); // run it first, because it has chances to redirect, so we don't work uselessly

        // early, to avoid the page jump as much as possible
        insertCSS();
        addAdditionnalLink();
        extractCharacterStats();

        insertHealthEnergyBars(); // Insert progress bars after updating the character
        startHealthRegeneration(); // Start health regeneration on page load
        startEnergyRegeneration();


        if (window.location.pathname.contains('/profile')){
            if (window.location.hash=='#potion')autoUseBestPotion();
            if (window.location.hash=='#energy-potion')autoUseBestEnergyPotion();
            moveGameEventDiv(); // move down the game event div
            updateRegenHealthEnergy();
            updatePotionTimer();
            updateEnergyPotionTimer();
            hideCharisma();
        } else if (window.location.pathname.contains('/city/church')){
            updateChurchCooldownTimer();
        } else if (window.location.pathname.contains('/user/working')){
            updateJobCooldownTimer();
        } else if (window.location.pathname.contains('/user/settings')){
            settingsMenu();
        } else if (window.location.pathname.contains('/city/graveyard')){
            CHARACTER.jobCooldownEnd = 0; //the job can't be in progress if we're on this page, meaning that user may have canceled it
            updateJobCooldownDisplay();
        } else if (window.location.pathname.contains('/city/grotte')){
            addGrottoAutoRedirectButton();
            addAutoGrottoButton();
            autoFightGrotto();
        } else if (window.location.pathname.contains('/city/shop')){
            defaultNonPremiumShop();
        }
        updateCharacter();
        //console.log(CHARACTER);

        if(CHARACTER.hideBuddies){
            hideBuddies();
        }

        // (si pas sur un rapport de grotte OU si aucun des auto fight n'est actif) ET si pas sur #potion
        if ((!(window.location.href.includes('report/fightreport/') && window.location.href.includes('/grotte')) || (!CHARACTER.autoRedirectGrotte && !CHARACTER.autoGrotto[0] && !CHARACTER.autoGrotto[1] && !CHARACTER.autoGrotto[2])) && !(window.location.hash=='#energy-potion') && !(window.location.hash=='#potion')){
            style.textContent = `body {visibility: visible;}`; // we loaded everything, so now we're showing the page again, we avoided the page jumping
        }
    }

    function insertCSS() {
        document.querySelectorAll('img[src*="/img/voodoo/res3_rotation.gif"]').forEach(img => img.style.display = 'none');
        GM_addStyle(`
        #upgrademsg {
            display: none;
        }
        #premium > img {
            display: none;
        }
        #mmonetbar {
            display: none !important;
            visibility: hidden;
        }
        .premiumButton {
            color: #FFCC33 !important;
            font-weight: bold !important;
            background-position: 0 -184px !important;
            text-shadow: 0 0 5px #000 !important;
        }
        input:disabled{
            background-color: #50323200 !important;
        }
    `);
    }

    function hideCharisma(){
        if(CHARACTER.hideCharisma){
            const element = document.querySelector('a[href*="/profile/training/5"]');
            if(!element)return;
            element.style.visibility = "hidden";
        }
    }

    function extractCharacterStats(){
        // Get Stats
        //var allStatsElement = document.getElementsByClassName("gold")[0];
        var allStatsElement = document.querySelector("#infobar > div.wrap-left.clearfix > div > div.gold")
        var statsValues = allStatsElement.textContent.split("\n");
        statsValues = statsValues.map(value => value.trim());
        statsValues.shift();

        // Extract energy, fragments, gold, health, and hellStones
        var energy = statsValues[3].trim();
        var currentEnergy = energy.split("/")[0];
        var maxEnergy = energy.split("/")[1];

        if (currentEnergy && maxEnergy) {
            CHARACTER.energy = parseInt(currentEnergy); // Use parseFloat to preserve decimals
            CHARACTER.maxEnergy = parseInt(maxEnergy); // Use parseFloat to preserve decimals
        }

        var health = statsValues[4].trim();
        var currentHealth = formatNumber(health.split("/")[0]);
        var maxHealth = formatNumber(health.split("/")[1]);

        if (currentHealth && maxHealth) {
            CHARACTER.health = parseInt(currentHealth);
            CHARACTER.maxHealth = parseInt(maxHealth);
        }

        // used in case the user wants to display the total for health and energy, i do it now to avoid doing it every 200 ms
        maxHealthString = " / "+(CHARACTER.maxHealth > 999 ? CHARACTER.maxHealth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'): CHARACTER.maxHealth);
        maxEnergyString = " / "+(CHARACTER.maxEnergy > 999 ? CHARACTER.maxEnergy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'): CHARACTER.maxEnergy);


        // Now remove the parts containing health and energy
        // Update the text content by filtering out the specific lines
        var elements = allStatsElement.innerHTML.split("\n");

        elements.splice(4, 2); // Removes the energy (index 4) and health (index 5) values

        // Create two new div elements
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('div');

        // Fill div1 with elements 1, 2, 3
        div1.innerHTML = elements.slice(1, 4).join("");
        // Fill div2 with elements 4, 5
        div2.innerHTML = elements.slice(4).join("");
        div1.style.minWidth = "193px";
        div2.style.minWidth = "193px";
        div3.appendChild(div1);
        div3.appendChild(div2);
        div3.style.paddingRight = '104px';
        div3.style.display = 'flex';
        div3.style.justifyContent = 'space-between';

        // Clear the existing content and append the two divs
        allStatsElement.innerHTML = '';
        allStatsElement.appendChild(div3);
        allStatsElement.style.display = 'block';
    }

    // Format texts to return as numbers (no thousand separators)
    function formatNumber(value) {
        while (value.indexOf(".") > 0) value = value.replace(".", "");
        return value;
    }

    function updateRegenHealthEnergy() {
        //if (!window.location.pathname.endsWith('/profile/index')) return;
        const healthRegenElement = document.querySelector("#skillmodis_tab > div.wrap-left.clearfix > div > div > table > tbody div.triggerTooltip");
        if(healthRegenElement){
            CHARACTER.regenHealth = parseInt(healthRegenElement.textContent.match(/\d+/g));
        }
        const energyRegenElement = document.getElementById('actionpointRegeneration');
        if(energyRegenElement){
            CHARACTER.regenEnergy = parseInt(energyRegenElement.parentElement.lastChild.textContent.match(/\d+/g));
        }
    }

    // Update character in local storage
    function updateCharacter() {
        GM_setValue(KEY_SERVER_DOMAIN, CHARACTER);
    }

    function updateGrottoStats(){
        GM_setValue(KEY_SERVER_DOMAIN+"/grotto_stats", GROTTO_STATS);
    }

    function updateEnergyPotionTimer() {
        const timerElement = document.querySelector("#item_temp_active_2_17 > span");
        const buttonElement = document.querySelector('a[href*="/profile/useItem/2/17?"]');

        if(!timerElement){
            // couldn't find the potion timer, it means player is out of potions, or the potion is already ready
            if(buttonElement){
                CHARACTER.energyPotionCooldownEnd = 1; // the potion is ready to use !
            } else {
                CHARACTER.energyPotionCooldownEnd = -1; // i put -1 so i can display later that that no more potions
            }
            updateEnergyPotionCooldownDisplay();
        } else {
            // Get the current time and add the potion cooldown to get the end time
            const currentTime = pageLoadTime / 1000; // Current time in seconds
            const cooldownTime = timeToSeconds(timerElement.textContent); // Convert cooldown time to seconds
            const endTime = currentTime + cooldownTime; // Calculate the end time
            // Save the end time to the character object
            CHARACTER.energyPotionCooldownEnd = endTime;
            updateEnergyPotionCooldownDisplay(); //refresh
        }
    }

    function updatePotionTimer() {
        var timerElement = document.querySelector("#item_cooldown2_20 > span");
        if(!timerElement){
            timerElement = document.querySelector("#item_cooldown2_1 > span");
        }
        if(!timerElement){
            timerElement = document.querySelector("#item_cooldown2_2 > span");
        }
        if(!timerElement){
            // couldn't find the potion timer, it means player is out of potions, or the potion is already ready
            if(getUseHealthPotionButtons().length>0){
                CHARACTER.potionCooldownEnd = 1; // the potion is ready to use !
            } else {
                CHARACTER.potionCooldownEnd = -1; // i put -1 so i can display later that that no more potions
            }
            updatePotionCooldownDisplay();
        } else {
            // Get the current time and add the potion cooldown to get the end time
            const currentTime = pageLoadTime / 1000; // Current time in seconds
            const cooldownTime = timeToSeconds(timerElement.textContent); // Convert cooldown time to seconds
            const endTime = currentTime + cooldownTime; // Calculate the end time
            // Save the end time to the character object
            CHARACTER.potionCooldownEnd = endTime;
            updatePotionCooldownDisplay(); //refresh
        }
    }

    function autoUseBestPotion(){
        const hpPotions = getUseHealthPotionButtons();
        if (hpPotions.length > 0) {
            hpPotions[hpPotions.length-1].click();
        } else {
            // si plus de potion, ou si potion en cours de cooldown
            window.location.href = '/city/shop/potions/&page=1&premiumfilter=nonpremium';
        }
    }

    function autoUseBestEnergyPotion(){
        const energyPotionButton = document.querySelector('a[href*="/profile/useItem/2/17?"]');
        if (energyPotionButton) {
            energyPotionButton.click();
        } else {
            // si plus de potion, ou si potion en cours de cooldown
            window.location.href = '/city/shop/potions/&page=1&premiumfilter=nonpremium';
        }
    }

    function getUseHealthPotionButtons(){
        // returns a table containing all (if any) buttons to use the health potions
        return Array.from(document.querySelectorAll("#accordion > div > table > tbody > tr > td > div > div > a")).filter(button =>
                                                                                                                          button.href.includes("useItem/2/1?") ||
                                                                                                                          button.href.includes("useItem/2/2?") ||
                                                                                                                          button.href.includes("useItem/2/20?")
                                                                                                                         );
    }

    function timeToSeconds(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    function insertHealthEnergyBars() {
        if (document.getElementById('progressBarsTimersContainer')) {
            return;
        }

        let mainContainer = document.createElement('div');
        mainContainer.id = 'progressBarsTimersContainer';
        mainContainer.style.display = 'flex';
        mainContainer.style.flexDirection = 'column'; // Stack the bars and timers vertically
        mainContainer.style.alignItems = 'center';
        mainContainer.style.marginTop = '3px';

        let progressBarsContainer = document.createElement('div');
        progressBarsContainer.style.display = 'flex'; // Changed to row to place bars side by side
        progressBarsContainer.style.flexDirection = 'row'; // Set to row for horizontal alignment
        progressBarsContainer.style.alignItems = 'center'; // Align items vertically in the middle
        progressBarsContainer.style.paddingBottom = '8px';
        progressBarsContainer.style.gap = '60px'; // Added gap between the bars

        // Health Bar
        let healthBarContainer = document.createElement('div');
        healthBarContainer.style.width = '250px';
        healthBarContainer.style.position = 'relative';
        healthBarContainer.style.background = 'linear-gradient(to right, #1a1a1a, #333)';
        healthBarContainer.style.borderImage = 'linear-gradient(to right, #ff4d4d, #b80000) 1';
        healthBarContainer.style.borderRadius = '6px';
        healthBarContainer.style.boxShadow = 'inset 0 10px 5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 77, 77, 1)';
        healthBarContainer.style.overflow = 'hidden';
        healthBarContainer.id = 'healthProgressBar';

        let healthBar = document.createElement('div');
        healthBar.style.height = '20px';
        healthBar.style.width = `${(CHARACTER.health / CHARACTER.maxHealth) * 100}%`;
        healthBar.style.background = 'linear-gradient(to right, #ff4d4d, #b80000)';
        healthBar.style.transition = 'width 0.3s ease-in-out';
        healthBar.style.boxShadow = 'inset 0 10px 5px rgba(0, 0, 0, 0.5)';

        let healthText = document.createElement('div');
        healthText.textContent = `${CHARACTER.health > 999 ? CHARACTER.health.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : CHARACTER.health}`;
        if(CHARACTER.showTotalStat)healthText.textContent += maxHealthString;
        healthText.style.position = 'absolute';
        healthText.style.top = '50%';
        healthText.style.left = '50%';
        healthText.style.transform = 'translate(-50%, -50%)';
        healthText.style.color = 'white';
        healthText.style.fontSize = '12px';
        healthText.style.fontFamily = 'monospace';

        healthBarContainer.appendChild(healthBar);
        healthBarContainer.appendChild(healthText);

        // Energy Bar
        let energyBarContainer = document.createElement('div');
        energyBarContainer.style.width = '250px';
        energyBarContainer.style.position = 'relative';
        energyBarContainer.style.background = 'linear-gradient(to right, #1a1a1a, #333)';
        energyBarContainer.style.borderImage = 'linear-gradient(to right, #4d94ff, #0000a4) 1';
        energyBarContainer.style.borderRadius = '6px';
        energyBarContainer.style.boxShadow = 'inset 0 10px 5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(77, 148, 255, 1)';
        energyBarContainer.style.overflow = 'hidden';
        energyBarContainer.id = 'energyProgressBar';

        let energyBar = document.createElement('div');
        energyBar.style.height = '20px';
        energyBar.style.width = `${(CHARACTER.energy / CHARACTER.maxEnergy) * 100}%`;
        energyBar.style.background = 'linear-gradient(to right, #4d94ff, #0000a4)';
        energyBar.style.transition = 'width 0.3s ease-in-out';
        energyBar.style.boxShadow = 'inset 0 10px 5px rgba(0, 0, 0, 0.5)';

        let energyText = document.createElement('div');
        energyText.textContent = `${CHARACTER.energy}`;
        if(CHARACTER.showTotalStat)energyText.textContent += maxEnergyString;
        energyText.style.position = 'absolute';
        energyText.style.top = '50%';
        energyText.style.left = '50%';
        energyText.style.transform = 'translate(-50%, -50%)';
        energyText.style.color = 'white';
        energyText.style.fontSize = '12px';
        energyText.style.fontFamily = 'monospace';

        energyBarContainer.appendChild(energyBar);
        energyBarContainer.appendChild(energyText);

        progressBarsContainer.appendChild(healthBarContainer);
        progressBarsContainer.appendChild(energyBarContainer);

        mainContainer.appendChild(progressBarsContainer);
        document.querySelector("#infobar > div.wrap-left.clearfix > div > div.gold").appendChild(mainContainer);
    }

    function calculateCurrentEnergy(){
        const regenPerSecond = CHARACTER.regenEnergy / 3600; // Convert regenHealth from per hour to per second
        // Calculate the total health regenerated since the page loaded
        const elapsedSeconds = (Date.now() - pageLoadTime) / 1000; // Time elapsed in seconds
        const regeneratedEnergy = regenPerSecond * elapsedSeconds;
        // Calculate the updated health, without modifying the original CHARACTER.health
        const updatedEnergy = Math.min(
            CHARACTER.energy + regeneratedEnergy,
            CHARACTER.maxEnergy
        );
        return updatedEnergy;
    }

    function calculateCurrentHealth(){
        const regenPerSecond = CHARACTER.regenHealth / 3600; // Convert regenHealth from per hour to per second
        // Calculate the total health regenerated since the page loaded
        const elapsedSeconds = (Date.now() - pageLoadTime) / 1000; // Time elapsed in seconds
        const regeneratedHealth = regenPerSecond * elapsedSeconds;
        // Calculate the updated health, without modifying the original CHARACTER.health
        const updatedHealth = Math.min(
            CHARACTER.health + regeneratedHealth,
            CHARACTER.maxHealth
        );
        return updatedHealth;
    }

    // Start real-time health regeneration
    function startHealthRegeneration() {
        // Update every 200ms by default
        healthRefreshInterval = setInterval(() => {
            // Update the progress bar with the calculated health
            updateHealthBars(calculateCurrentHealth());
        }, CHARACTER.healthRefreshRate);
    }

    function startEnergyRegeneration() {
        const regenInterval = 10000; // Update every 10s
        setInterval(() => {
            // Update the progress bar with the calculated health
            updateEnergyBars(calculateCurrentEnergy());
        }, regenInterval);
    }

    // Update the existing progress bars
    function updateHealthBars(calculatedHealth) {
        // Update Health Progress Bar
        const healthBar = document.getElementById('healthProgressBar').children[0];
        healthBar.style.width = `${(calculatedHealth / CHARACTER.maxHealth) * 100}%`;

        const healthText = document.getElementById('healthProgressBar').children[1];
        // Format the health value with thousands separators
        let healthWithoutDecimals = Math.floor(calculatedHealth);
        healthText.textContent = `${healthWithoutDecimals > 999 ? healthWithoutDecimals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'): healthWithoutDecimals}`;
        if(CHARACTER.showTotalStat)healthText.textContent += maxHealthString;
    }
    function updateEnergyBars(calculatedEnergy) {
        // Update Health Progress Bar
        const energyBar = document.getElementById('energyProgressBar').children[0];
        energyBar.style.width = `${(calculatedEnergy / CHARACTER.maxEnergy) * 100}%`;

        const energyText = document.getElementById('energyProgressBar').children[1];
        // Format the health value with thousands separators
        let energyWithoutDecimals = Math.floor(calculatedEnergy);
        energyText.textContent = `${energyWithoutDecimals > 999 ? energyWithoutDecimals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'): energyWithoutDecimals}`;
        if(CHARACTER.showTotalStat)energyText.textContent += maxEnergyString;
    }


    // Function to update the timer display
    function updatePotionCooldownDisplay() {
        const timerButton = document.getElementById('potionCooldownTimer');
        const currentTime = new Date().getTime() / 1000; // Current time in seconds

        if (CHARACTER.potionCooldownEnd > currentTime) {
            const remainingTime = CHARACTER.potionCooldownEnd - currentTime; // Remaining time in seconds
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = Math.round(remainingTime % 60);
            //timerElement.textContent = `Potion : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerButton.textContent = `Health : ${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerButton.className = "";
        } else if (CHARACTER.potionCooldownEnd < 0) {
            timerButton.textContent = 'Out of potions';
            if(CHARACTER.highlightPotion){
                timerButton.className = "premiumButton";
            } else {
                timerButton.className = "";
            }
        } else {
            timerButton.textContent = 'Health Potion';
            if(CHARACTER.highlightPotion)timerButton.className = "premiumButton";
        }
    }

    function updateEnergyPotionCooldownDisplay() {
        const timerButton = document.getElementById('energyPotionCooldownTimer');
        const currentTime = new Date().getTime() / 1000; // Current time in seconds

        if (CHARACTER.energyPotionCooldownEnd > currentTime) {
            const remainingTime = CHARACTER.energyPotionCooldownEnd - currentTime; // Remaining time in seconds
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = Math.round(remainingTime % 60);
            //timerElement.textContent = `Potion : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerButton.textContent = `Energy : ${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerButton.className = "";
        } else if (CHARACTER.energyPotionCooldownEnd < 0) {
            timerButton.textContent = 'Out of potions';
            if(CHARACTER.highlightEnergyPotion){
                timerButton.className = "premiumButton";
            } else {
                timerButton.className = "";
            }
        } else {
            timerButton.textContent = 'Energy Potion';
            if(CHARACTER.highlightEnergyPotion)timerButton.className = "premiumButton";
        }
    }

    function updateChurchCooldownTimer() {
        const churchCountdownElement = document.querySelector("#church_healing_countdown > span");
        if (churchCountdownElement) {
            const cooldownTime = churchCountdownElement.textContent.trim();
            const currentTime = new Date().getTime() / 1000; // Current time in seconds
            const cooldownSeconds = timeToSeconds(cooldownTime); // Convert cooldown time to seconds
            const endTime = currentTime + cooldownSeconds; // Calculate the end time

            // Save the end time to the character object
            CHARACTER.churchCooldownEnd = endTime;
            updateCharacter(); // Save updated character data
            updateChurchCooldownDisplay(); //refresh
        }
    }
    function updateJobCooldownTimer() {
        const jobCountdownElement = document.querySelector("#graveyardCount > span");
        if (jobCountdownElement) {
            const cooldownTime = jobCountdownElement.textContent.trim();
            const currentTime = new Date().getTime() / 1000; // Current time in seconds
            const cooldownSeconds = timeToSeconds(cooldownTime); // Convert cooldown time to seconds
            const endTime = currentTime + cooldownSeconds; // Calculate the end time

            // Save the end time to the character object
            CHARACTER.jobCooldownEnd = endTime;
            updateCharacter(); // Save updated character data
            updateJobCooldownDisplay(); //refresh
        }
    }

    function updateJobCooldownDisplay() {
        const timerElement = document.getElementById('jobCooldownTimer');
        const currentTime = new Date().getTime() / 1000; // Current time in seconds

        if (CHARACTER.jobCooldownEnd > currentTime) {
            const remainingTime = CHARACTER.jobCooldownEnd - currentTime; // Remaining time in seconds
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = Math.round(remainingTime % 60);
            //timerElement.textContent = `Church : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = `Job : ${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (CHARACTER.highlightJob == 1){
                timerElement.className = "premiumButton";
                timerElement.style.lineHeight = "37px";
            } else if (window.location.pathname.contains('/city/graveyard') || window.location.pathname.contains('/user/working')){
                timerElement.className = "active";
                timerElement.style.lineHeight = "44px";
            } else {
                timerElement.className = "";

            }
        } else {
            timerElement.textContent = 'Graveyard';
            if (CHARACTER.highlightJob == 2){
                timerElement.className = "premiumButton";
                timerElement.style.lineHeight = "37px";
            } else{
                if (window.location.pathname.contains('/city/graveyard') || window.location.pathname.contains('/user/working')){
                    timerElement.className = "active";
                } else {
                    timerElement.className = "";
                }
            }
        }
    }

    // Function to update the church cooldown display
    function updateChurchCooldownDisplay() {
        const timerElement = document.getElementById('churchCooldownTimer');
        const currentTime = new Date().getTime() / 1000; // Current time in seconds

        if (CHARACTER.churchCooldownEnd > currentTime) {
            const remainingTime = CHARACTER.churchCooldownEnd - currentTime; // Remaining time in seconds
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = Math.round(remainingTime % 60);
            //timerElement.textContent = `Church : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = `Church : ${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.className = "";
        } else {
            timerElement.textContent = 'Church';
            if(CHARACTER.highlightChurch)timerElement.className = "premiumButton";
        }
    }

    function hideBuddies(){
        const buddiesElement = document.querySelector("#buddyTrigger");
        if(CHARACTER.hideBuddies){
            buddiesElement.style.visibility = "hidden";
        } else {
            buddiesElement.style.visibility = "";
        }
    }

    function addAdditionnalLink() {
        // make the overview link open the attributes by default
        if (!window.location.pathname.contains('/profile'))document.querySelectorAll('#menuHead li a')[1].href="/profile/index#tabs-2";
        // make the voodoo shop less flashy
        document.getElementById("premium").querySelector("img").remove();
        document.getElementById("premium").removeAttribute("id");
        //translation of all the menu in english, so everything is the same

        document.querySelectorAll('#menuHead li a')[0].textContent="News";
        document.querySelectorAll('#menuHead li a')[1].textContent="Overview";
        document.querySelectorAll('#menuHead li a')[2].textContent="Messages";
        document.querySelectorAll('#menuHead li a')[3].textContent="Hideout";
        document.querySelectorAll('#menuHead li a')[4].textContent="City";
        document.querySelectorAll('#menuHead li a')[5].textContent="Hunt";
        document.querySelectorAll('#menuHead li a')[6].textContent="Voodoo Shop";
        document.querySelectorAll('#menuHead li a')[7].textContent="Clan";
        document.querySelectorAll('#menuHead li a')[8].textContent="Buddy list";
        document.querySelectorAll('#menuHead li a')[9].textContent="Notepad";

        if(document.querySelector('a[href*="/robbery/robberystats"]')){ // if the player is premium, there's an additionnal button
            document.querySelectorAll('#menuHead li a')[10].textContent="Statistics";
            document.querySelectorAll('#menuHead li a')[11].textContent="Settings";
            document.querySelectorAll('#menuHead li a')[12].textContent="Forum";
            document.querySelectorAll('#menuHead li a')[13].textContent="Highscore";
            document.querySelectorAll('#menuHead li a')[14].textContent="Search";
            document.querySelectorAll('#menuHead li a')[15].textContent="Support";
            document.querySelectorAll('#menuHead li a')[16].textContent="Leave game";
        } else {
            document.querySelectorAll('#menuHead li a')[10].textContent="Settings";
            document.querySelectorAll('#menuHead li a')[11].textContent="Forum";
            document.querySelectorAll('#menuHead li a')[12].textContent="Highscore";
            document.querySelectorAll('#menuHead li a')[13].textContent="Search";
            document.querySelectorAll('#menuHead li a')[14].textContent="Support";
            document.querySelectorAll('#menuHead li a')[15].textContent="Leave game";

        }

        // Find the <li> containing the Chasse link
        const chasseListItem = document.querySelector('li.free-space > a[href$="/robbery/index"]');

        if (chasseListItem) {
            // Navigate to the parent <li> element
            const chasseLi = chasseListItem.closest('li');

            // Remove the class "free-space"
            chasseLi.removeAttribute('class');
            if (window.location.pathname.contains('robbery')){
                chasseLi.className = "active";
            }


            // Create a new <li> for the Grotte link
            const grotteLi = document.createElement('li');
            if (window.location.pathname.contains('/grotte')){
                if (document.getElementsByClassName("active")[0])document.getElementsByClassName("active")[0].removeAttribute('class');
                grotteLi.className = "active";
            }
            grotteLi.innerHTML = '<a href="/city/grotte" target="_top">Grotto</a>';


            const graveLi = document.createElement('li');
            if (window.location.pathname.contains('/city/graveyard') || window.location.pathname.contains('/user/working')){
                if (document.getElementsByClassName("active")[0])document.getElementsByClassName("active")[0].removeAttribute('class');
                graveLi.className = "active";
            }
            graveLi.innerHTML = '<a id="jobCooldownTimer" href="/city/graveyard" target="_top">Graveyard</a>';
            if (CHARACTER.highlightJob == 2){
                //graveLi.className = "premiumButton";
                //graveLi.style.lineHeight = "37px";
            }

            const shopLi = document.createElement('li');
            if (window.location.pathname.contains('/city/shop/')){
                if (document.getElementsByClassName("active")[0])document.getElementsByClassName("active")[0].removeAttribute('class');
                shopLi.className = "active";
            }
            shopLi.innerHTML = '<a href="/city/shop/potions/&page=1&premiumfilter=nonpremium" target="_top">Merchant</a>';

            const questsLi = document.createElement('li');
            questsLi.className = "free-space";
            if (window.location.pathname.contains('/city/missions')){
                if (document.getElementsByClassName("active")[0])document.getElementsByClassName("active")[0].removeAttribute('class');
                questsLi.className = "active free-space";
            }
            questsLi.innerHTML = '<a href="/city/missions" target="_top">Quests</a>';

            const potionLi = document.createElement('li');
            // instead of doing this, i prefer to to redirect to overview with the hash #potion, so i can use the best available potion from here
            //potionLi.innerHTML = CHARACTER.level > 74 ? '<a id="potionCooldownTimer" href="/profile/useItem/2/20" target="_top">Potion</a>' : '<a id="potionCooldownTimer" href="/profile/useItem/2/2" target="_top">Potion</a>';
            potionLi.innerHTML = '<a id="potionCooldownTimer" href="/profile/index#potion" target="_top">Health Potion</a>';
            potionLi.addEventListener('click', function(event) {
                if (window.location.pathname.contains('/profile'))autoUseBestPotion(); // i do this, so the button still works even if already on the profile
            });

            const churchLi = document.createElement('li');
            churchLi.innerHTML = '<a id="churchCooldownTimer" href="/city/church" target="_top">Church</a>';

            const energyPotionLi = document.createElement('li');
            energyPotionLi.innerHTML = '<a id="energyPotionCooldownTimer" href="/profile/index#energy-potion" target="_top">Energy Potion</a>';
            energyPotionLi.addEventListener('click', function(event) {
                if (window.location.pathname.contains('/profile'))autoUseBestEnergyPotion(); // i do this, so the button still works even if already on the profile
            });

            /*
            let potionTimer = document.createElement('a');
            potionTimer.id = 'potionCooldownTimer';
            potionTimer.style.color = 'white';
            potionTimer.style.fontSize = '14px';
            potionTimer.style.fontFamily = 'monospace';
            potionTimer.style.margin = '0px';
            potionTimer.href = CHARACTER.level > 74 ? '/profile/useItem/2/20' : '/profile/useItem/2/2';
            potionTimer.textContent = 'Potion Cooldown: Calculating...';

            let churchTimer = document.createElement('a');
            churchTimer.id = 'churchCooldownTimer';
            churchTimer.style.color = 'white';
            churchTimer.style.fontSize = '14px';
            churchTimer.style.fontFamily = 'monospace';
            churchTimer.style.margin = '0px';
            churchTimer.href = '/city/church';
            churchTimer.textContent = 'Church Cooldown: Calculating...';



*/

            // Insert the new links (in reverse)
            chasseLi.insertAdjacentElement('afterend', churchLi);
            chasseLi.insertAdjacentElement('afterend', energyPotionLi);
            chasseLi.insertAdjacentElement('afterend', potionLi);
            chasseLi.insertAdjacentElement('afterend', questsLi);
            chasseLi.insertAdjacentElement('afterend', shopLi);
            chasseLi.insertAdjacentElement('afterend', graveLi);
            chasseLi.insertAdjacentElement('afterend', grotteLi);

            updatePotionCooldownDisplay();
            setInterval(updatePotionCooldownDisplay, 1000);
            updateEnergyPotionCooldownDisplay();
            setInterval(updateEnergyPotionCooldownDisplay, 1000);
            updateChurchCooldownDisplay();
            setInterval(updateChurchCooldownDisplay, 1000);
            updateJobCooldownDisplay();
            setInterval(updateJobCooldownDisplay, 1000);
        }
    }

    function moveGameEventDiv() {
        const gameEventDivs = document.querySelectorAll('[id=gameEvent]');
        const itemsDiv = document.getElementById('items');

        if (gameEventDivs.length > 0 && itemsDiv) {
            gameEventDivs.forEach(gameEventDiv => {
                itemsDiv.insertAdjacentElement('afterend', gameEventDiv);
            });
        }

        // Scroll up after upgrading a skill
        if (window.location.hash === '#tabs-2') {
            window.scrollTo(0, 0);
        }
    }

    function defaultNonPremiumShop() {

        const links = document.querySelectorAll('a'); // Select all anchor elements
        links.forEach(link => {
            // Check if the link href contains '/city/shop/'
            if (link.href.includes('/city/shop')) {
                // If the URL doesn't already have a query string, add it
                if (!link.href.includes('&premiumfilter=nonpremium')) {
                    link.href += '&premiumfilter=nonpremium';
                }
            }
        });

        /*
        var premiumfilter = document.querySelector('select[name="premiumfilter"]'); // Replace with the correct selector if necessary
        if (premiumfilter) {
            premiumfilter.value = 'nonpremium'; // Set default value to 'nonpremium'
        }*/
    }

    function redirectAfterGrotteFight() {
        if (!(window.location.href.includes('report/fightreport/') && window.location.href.includes('/grotte')))return;

        //console.log("Current difficulty : "+CHARACTER.lastGrottoClick);
        if(CHARACTER.lastGrottoClick == 0 || CHARACTER.lastGrottoClick == 1 || CHARACTER.lastGrottoClick == 2){
            saveGrottoStats(CHARACTER.lastGrottoClick);
        }

        // condition to redirect to last page
        if (CHARACTER.autoRedirectGrotte || CHARACTER.autoGrotto[0] || CHARACTER.autoGrotto[1] || CHARACTER.autoGrotto[2]) {
            // Redirect to '/city/grotte'
            console.log("Redirecting to grotto...");
            window.location.href = '/city/grotte';
        }
    }


    function saveGrottoStats(grottoDifficulty){
        const element = document.querySelector("#reportResult > div.wrap-left.clearfix > div > p.gold");
        if(!element)return;
        const rewards = element.textContent.split("\n")[1].split("+");
        const goldEarned = parseInt(rewards[0].replace(/\D/g, ''));
        const xpEarned = parseInt(rewards[1].replace(/\D/g, ''));

        const dmgTaken = getGrottoHealthDamage(goldEarned);

        // ça veut dire que le joueur est mort ! on ne compte pas ce combat dans les stats pour éviter de les fausser
        if(dmgTaken == -1){
            CHARACTER.lastGrottoClick = -1;
            updateCharacter();
            return;
        }

        // Ensure the goldEarned array for the selected difficulty exists
        if (!GROTTO_STATS.goldEarned[grottoDifficulty]) {
            GROTTO_STATS.goldEarned[grottoDifficulty] = [];
        }

        // Push the new gold earned value into the array
        GROTTO_STATS.goldEarned[grottoDifficulty].push(goldEarned);

        // Keep only the last 20 entries for each difficulty
        if (GROTTO_STATS.goldEarned[grottoDifficulty].length > 20) {
            GROTTO_STATS.goldEarned[grottoDifficulty].shift(); // Remove the oldest entry
        }

        // Ensure the dmgTaken array for the selected difficulty exists
        if (!GROTTO_STATS.dmgTaken[grottoDifficulty]) {
            GROTTO_STATS.dmgTaken[grottoDifficulty] = [];
        }

        // Push the new dmg taken value into the array
        GROTTO_STATS.dmgTaken[grottoDifficulty].push(dmgTaken);

        // Keep only the last 20 entries for each difficulty
        if (GROTTO_STATS.dmgTaken[grottoDifficulty].length > 20) {
            GROTTO_STATS.dmgTaken[grottoDifficulty].shift(); // Remove the oldest entry
        }

        // Ensure the xpEarned array for the selected difficulty exists
        if (!GROTTO_STATS.xpEarned[grottoDifficulty]) {
            GROTTO_STATS.xpEarned[grottoDifficulty] = [];
        }

        // Push the new dmg taken value into the array
        GROTTO_STATS.xpEarned[grottoDifficulty].push(xpEarned);

        // Keep only the last 20 entries for each difficulty
        if (GROTTO_STATS.xpEarned[grottoDifficulty].length > 20) {
            GROTTO_STATS.xpEarned[grottoDifficulty].shift(); // Remove the oldest entry
        }

        // Update the grotto data with the new stats

        CHARACTER.lastGrottoClick = -1;
        updateGrottoStats();
        updateCharacter();
    }

    function addGrottoAutoRedirectButton(){
        const buildingDescElement = document.getElementsByClassName('buildingDesc')[0];
        if (!buildingDescElement) return;

        // add the button for auto redirection
        const buttonAutoRedirect = document.createElement("button");
        if (CHARACTER.autoRedirectGrotte){
            buttonAutoRedirect.textContent = "Redirect : ON";
            buttonAutoRedirect.className = "btn-small left btn-redirectGrotto premiumButton";
        } else {
            buttonAutoRedirect.textContent = "Redirect : OFF";
            buttonAutoRedirect.className = "btn-small left btn-redirectGrotto";
        }
        buttonAutoRedirect.style.margin = "0px";
        buttonAutoRedirect.style.padding = "0 0 5px";

        // Add a click event listener
        buttonAutoRedirect.addEventListener("click", function (event) {
            CHARACTER.autoRedirectGrotte = !CHARACTER.autoRedirectGrotte;
            updateCharacter();
            if (CHARACTER.autoRedirectGrotte){
                buttonAutoRedirect.textContent = "Redirect : ON";
                buttonAutoRedirect.className = "btn-small left btn-redirectGrotto premiumButton";
            } else {
                buttonAutoRedirect.textContent = "Redirect : OFF";
                buttonAutoRedirect.className = "btn-small left btn-redirectGrotto";
            }
        });
        // Insert the button after the target element
        buildingDescElement.appendChild(buttonAutoRedirect);


        // add the button to reset stats
        const button = document.createElement("button");
        button.textContent = "Reset stats";
        button.className = "btn-small left btn-resetGrotto";
        button.style.margin = "0px";
        button.style.padding = "0 0 5px";

        // Add a click event listener
        button.addEventListener("click", function (event) {
            console.log("Grotto stats reset");
            GROTTO_STATS.goldEarned = {};
            GROTTO_STATS.dmgTaken = {};
            GROTTO_STATS.xpEarned = {};
            updateGrottoStats();
            location.reload();
        });
        // Insert the button after the target element
        buildingDescElement.appendChild(button);
    }

    function initiateGrottoStats(){
        if (!GROTTO_STATS.goldEarned || !GROTTO_STATS.dmgTaken || !GROTTO_STATS.xpEarned) {
            GROTTO_STATS.goldEarned = {};
            GROTTO_STATS.dmgTaken = {};
            GROTTO_STATS.xpEarned = {};
            updateGrottoStats();
        }
    }

    function addAutoGrottoButton() {

        // make sure the variable is defined
        if (!Array.isArray(CHARACTER.autoGrotto)) {
            CHARACTER.autoGrotto = [false, false, false];
            updateCharacter();
        }
        // instantiate the variable for grotto stats if it isn't  already
        initiateGrottoStats();

        for (let difficulty = 0; difficulty < 3; difficulty++) {
            //const target = $(`table.noBackground form.clearfix div input`)[index];
            const grottoButton = document.querySelectorAll('table.noBackground form.clearfix div input')[difficulty];
            if (!grottoButton) return;

            grottoButton.addEventListener('click', (event) => {
                CHARACTER.lastGrottoClick = difficulty;
                updateCharacter();
            });

            // Create the button
            const button = document.createElement("button");
            if(CHARACTER.autoGrotto[difficulty]){
                button.textContent = "Auto : ON";
                button.className = "btn-small left btn-autoGrotto premiumButton";
            } else {
                button.textContent = "Auto : OFF";
                button.className = "btn-small left btn-autoGrotto";
            }
            button.style.margin = "10px";
            button.style.padding = "0 0 5px";

            // Add a click event listener
            button.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default button behavior
                if(!CHARACTER.autoGrotto[difficulty] && isReadyForGrotto(difficulty)){
                    grottoSetAllButtonsToOFF();
                    CHARACTER.autoGrotto[difficulty] = true;
                    updateCharacter();
                    button.textContent = "Auto : ON";
                    button.className = "btn-small left btn-autoGrotto premiumButton";
                    document.querySelectorAll('table.noBackground form.clearfix div input')[difficulty].click();
                } else {
                    CHARACTER.autoGrotto[difficulty] = false;
                    updateCharacter();
                    button.textContent = "Auto : OFF";
                    button.className = "btn-small left btn-autoGrotto";
                }
                //console.log(`CHARACTER.autoGrotto[${index}] is now `, CHARACTER.autoGrotto);
            });
            // Insert the button after the target element
            grottoButton.parentNode.insertBefore(button, grottoButton.nextSibling);
            displayStatsAverage(difficulty);
        }
    }

    function grottoSetAllButtonsToOFF(){
        CHARACTER.autoGrotto[0] = false;
        CHARACTER.autoGrotto[1] = false;
        CHARACTER.autoGrotto[2] = false;
        const buttons = document.querySelectorAll('.btn-autoGrotto');
        buttons.forEach(button => {
            button.textContent = 'Auto : OFF';
            button.className = "btn-small left btn-autoGrotto";
        });
    }

    function autoFightGrotto() {
        if(!CHARACTER.autoGrotto[0] && !CHARACTER.autoGrotto[1] && !CHARACTER.autoGrotto[2]) return;
        var randomDelay = 10;
        if(!CHARACTER.autoGrottoInstant){
            randomDelay = Math.random() * 1500 + 500; // wait between 500ms and 2000ms
        }
        //console.log(`Action will be executed after ${randomDelay.toFixed(0)}ms`);

        // Set the timeout
        setTimeout(() => {
            if(!isReadyForGrotto()){
                grottoSetAllButtonsToOFF();
                updateCharacter();
            } else {
                if(!CHARACTER.autoGrotto[0] && !CHARACTER.autoGrotto[1] && !CHARACTER.autoGrotto[2]) return;
                if(CHARACTER.autoGrotto[0])document.querySelectorAll('table.noBackground form.clearfix div input')[0].click();
                if(CHARACTER.autoGrotto[1])document.querySelectorAll('table.noBackground form.clearfix div input')[1].click();
                if(CHARACTER.autoGrotto[2])document.querySelectorAll('table.noBackground form.clearfix div input')[2].click();
            }
        }, randomDelay);
    }

    function isReadyForGrotto(difficulty) {
        //en cas d'abscence de données, on combat si plus de 9000 HP
        if (!GROTTO_STATS.dmgTaken[difficulty] || GROTTO_STATS.dmgTaken[difficulty].length < 1) return (calculateCurrentHealth() > 9000 && CHARACTER.energy > 0);

        // sinon, on chope les plus gros dégats qu'on s'est mangé dans cette difficulté, et on y ajoute 10%
        let highestValue = 0;
        for (let value of GROTTO_STATS.dmgTaken[difficulty]) {
            if (value > highestValue) {
                highestValue = value;
            }
        }
        console.log("gros degats : "+(highestValue*1.1));
        return (calculateCurrentHealth() > (highestValue*1.1) && CHARACTER.energy > 0);
    }


    // This function calculates the average gold for a given difficulty
    function calculateGoldAverage(grottoDifficulty) {
        if (!GROTTO_STATS.goldEarned[grottoDifficulty] || GROTTO_STATS.goldEarned[grottoDifficulty].length < 1) return 0;

        let totalGold = 0;
        // Loop through the gold history for the given difficulty
        for (let i = 0; i < GROTTO_STATS.goldEarned[grottoDifficulty].length; i++) {
            totalGold += GROTTO_STATS.goldEarned[grottoDifficulty][i];
        }
        return totalGold / GROTTO_STATS.goldEarned[grottoDifficulty].length;
    }

    function calculateDamageAverage(grottoDifficulty) {
        if (!GROTTO_STATS.dmgTaken[grottoDifficulty] || GROTTO_STATS.dmgTaken[grottoDifficulty].length < 1) return 0;

        let totalDmg = 0;
        // Loop through the gold history for the given difficulty
        for (let i = 0; i < GROTTO_STATS.dmgTaken[grottoDifficulty].length; i++) {
            totalDmg += GROTTO_STATS.dmgTaken[grottoDifficulty][i];
        }
        return totalDmg / GROTTO_STATS.dmgTaken[grottoDifficulty].length;
    }

    function calculateXPAverage(grottoDifficulty) {
        if (!GROTTO_STATS.xpEarned[grottoDifficulty] || GROTTO_STATS.xpEarned[grottoDifficulty].length < 1) return 0;

        let totalGold = 0;
        // Loop through the gold history for the given difficulty
        for (let i = 0; i < GROTTO_STATS.xpEarned[grottoDifficulty].length; i++) {
            totalGold += GROTTO_STATS.xpEarned[grottoDifficulty][i];
        }
        return totalGold / GROTTO_STATS.xpEarned[grottoDifficulty].length;
    }

    function calculateWinrate(grottoDifficulty) {
        if (!GROTTO_STATS.goldEarned[grottoDifficulty] || GROTTO_STATS.goldEarned[grottoDifficulty].length < 1) return 0;

        let totalwin = 0;
        // Loop through the gold history for the given difficulty
        for (let i = 0; i < GROTTO_STATS.goldEarned[grottoDifficulty].length; i++) {
            if(GROTTO_STATS.goldEarned[grottoDifficulty][i] > 0)totalwin += 1;
        }
        return (totalwin / GROTTO_STATS.goldEarned[grottoDifficulty].length * 100);
    }

    // Function to display the average gold under each button
    function displayStatsAverage(grottoDifficulty) {
        //console.log("Average gold for difficult "+grottoDifficulty+" : "+calculateGoldAverage(grottoDifficulty));
        const button = document.querySelectorAll('.btn-autoGrotto')[grottoDifficulty];
        if (!button) return;
        let avgGoldText = `${calculateGoldAverage(grottoDifficulty).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} `;
        let avgDmg = `${calculateDamageAverage(grottoDifficulty).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} `;
        let avgXP = `${calculateXPAverage(grottoDifficulty).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} `;
        let winrate = `${calculateWinrate(grottoDifficulty).toFixed(0)}% `;

        // Check if the display already exists, and update or create a new one
        let avgElement = button.querySelector('.gold-average');
        avgElement = document.createElement('div');
        avgElement.classList.add('gold-average');
        avgElement.style.fontSize = '15px';
        avgElement.style.marginLeft = '10px';
        avgElement.style.textAlign = 'center'; // Center the text
        avgElement.style.display = 'block'; // Make sure it takes up the full width and goes below the button
        avgElement.style.width = '160px';
        avgElement.style.textShadow = "0 0 4px #FF0000";
        avgElement.style.fontFamily = 'monospace';
        avgElement.style.fontWeight = 'bold';
        avgElement.style.color = 'white';
        avgElement.style.lineHeight = '25px';
        button.parentNode.insertBefore(avgElement, button.nextSibling);
        avgElement.textContent = avgGoldText;
        // Create an image element and append it after the text
        let imgGold = document.createElement('img');
        imgGold.src = '/img/symbols/res2.gif';
        avgElement.appendChild(imgGold);
        imgGold.align = 'absmiddle';
        // xp earned
        var lineBreak2 = document.createElement('br');
        avgElement.appendChild(lineBreak2);
        var avgXPText = document.createTextNode(avgXP);
        avgElement.appendChild(avgXPText);
        let imgXP = document.createElement('img');
        imgXP.src = '/img/symbols/level.gif';
        avgElement.appendChild(imgXP);
        imgXP.align = 'absmiddle';
        // health lost
        var lineBreak = document.createElement('br');
        avgElement.appendChild(lineBreak);
        var avgDmgText = document.createTextNode(avgDmg);
        avgElement.appendChild(avgDmgText);
        let imgHealth = document.createElement('img');
        imgHealth.src = '/img/symbols/herz.png';
        avgElement.appendChild(imgHealth);
        imgHealth.align = 'absmiddle';
        // winrate
        var lineBreak3 = document.createElement('br');
        avgElement.appendChild(lineBreak3);
        var winrateText = document.createTextNode(winrate);
        avgElement.appendChild(winrateText);
        let imgWin = document.createElement('img');
        imgWin.src = '/img/symbols/fightvalue.gif';
        avgElement.appendChild(imgWin);
        imgWin.align = 'absmiddle';
    }

    // if gold earned = 0, then it's lost,and the dmg taken is on left and not on right
    function getGrottoHealthDamage(goldEarned){
        var win = 1;
        if(goldEarned == 0){
            win = 0;
        }
        const wholeText = document.querySelectorAll('#reportResult div.wrap-left div.wrap-content p')[0].textContent;
        const extractedText = wholeText.match(/\(([^)]+)\)/);
        if(!extractedText)return -1; // si on trouve pas le texte, c'est que le joueur est mort, on renvoi -1 pour que ce resultat soit ignoré
        const numbers = extractedText[1].split(":");
        return(parseInt(numbers[win]));
    }

    function settingsMenu(){
        // Create the new div element
        const settingDiv = document.createElement('div');
        settingDiv.id = 'betterBfSettings';
        settingDiv.innerHTML = `
        <div class="wrap-top-left clearfix">
            <div class="wrap-top-right clearfix">
                <div class="wrap-top-middle clearfix"></div>
            </div>
        </div>
        <div class="wrap-left clearfix">
            <div class="wrap-content wrap-right clearfix">
                <h2><img src="/img/symbols/race1small.gif" alt=""/>Better BiteFight Settings</h2>
            </div>
        </div>`;
        // Locate the target div
        const charDescDiv = document.getElementById('discribeChar');
        if (charDescDiv)charDescDiv.parentNode.insertBefore(settingDiv, charDescDiv);

        const settingContentDiv = document.querySelector("div#betterBfSettings div.wrap-left.clearfix div.wrap-content.wrap-right.clearfix");

        const potionDiv = createSettingPotionHighlightDiv();
        settingContentDiv.appendChild(potionDiv);

        const energyPotionDiv = createSettingEnergyPotionHighlightDiv();
        settingContentDiv.appendChild(energyPotionDiv);

        const churchDiv = createSettingChurchHighlightDiv();
        settingContentDiv.appendChild(churchDiv);

        const jobDiv = createSettingJobHighlightDiv();
        settingContentDiv.appendChild(jobDiv);

        const healthRefreshRateDiv = createSettingHealthRefreshDiv();
        settingContentDiv.appendChild(healthRefreshRateDiv);

        const grottoSpeedDiv = createSettingGrottoSpeedDiv();
        settingContentDiv.appendChild(grottoSpeedDiv);

        const showTotalDiv = createSettingShowTotalDiv();
        settingContentDiv.appendChild(showTotalDiv);

        const hideBuddiesDiv = createSettingHideBuddiesDiv();
        settingContentDiv.appendChild(hideBuddiesDiv);

        const hideCharsimaDiv = createSettingHideCharsimaDiv();
        settingContentDiv.appendChild(hideCharsimaDiv);



        const resetDataDiv = createSettingResetDataDiv();
        settingContentDiv.appendChild(resetDataDiv);
    }

    function createSettingTextDiv(){
        const newDiv = document.createElement('div')
        newDiv.style.minWidth = "355px";
        newDiv.style.textAlign = "right";
        newDiv.style.marginTop = "9px";
        newDiv.style.textShadow = "0 0 4px #FF0000";
        newDiv.style.fontSize = "16px";
        return newDiv;
    }

    function createSettingChurchHighlightDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Highlight CHURCH when ready : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.className = "btn-small left";
        if (CHARACTER.highlightChurch){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.highlightChurch = !CHARACTER.highlightChurch;
            updateCharacter();
            if (CHARACTER.highlightChurch){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
                document.getElementById('churchCooldownTimer').className = ""; // turning off instantly
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingPotionHighlightDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Highlight POTION when ready : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.className = "btn-small left";
        if (CHARACTER.highlightPotion){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.highlightPotion = !CHARACTER.highlightPotion;
            updateCharacter();
            if (CHARACTER.highlightPotion){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
                document.getElementById('potionCooldownTimer').className = ""; // turning off instantly
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingEnergyPotionHighlightDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Highlight ENERGY POTION when ready : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.className = "btn-small left";
        if (CHARACTER.highlightEnergyPotion){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.highlightEnergyPotion = !CHARACTER.highlightEnergyPotion;
            updateCharacter();
            if (CHARACTER.highlightEnergyPotion){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
                document.getElementById('energyPotionCooldownTimer').className = ""; // turning off instantly
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingJobHighlightDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Highlight JOB : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.className = "btn-small left";
        if (CHARACTER.highlightJob == 0){
            newButton.textContent = "Never";
        } else if (CHARACTER.highlightJob == 1){
            newButton.textContent = "In progress";
        } else {
            newButton.textContent = "Finished";
        }
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            if (CHARACTER.highlightJob == 0){
                CHARACTER.highlightJob = 1;
            } else if (CHARACTER.highlightJob == 1){
                CHARACTER.highlightJob = 2;
            } else {
                CHARACTER.highlightJob = 0;
            }
            updateCharacter();
            if (CHARACTER.highlightJob == 0){
                newButton.textContent = "Never";
            } else if (CHARACTER.highlightJob == 1){
                newButton.textContent = "In progress";
            } else {
                newButton.textContent = "Finished";
            }
            updateJobCooldownDisplay();
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingHealthRefreshDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Health refresh rate : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.textContent = CHARACTER.healthRefreshRate+" ms";
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            if (CHARACTER.healthRefreshRate == 200){
                CHARACTER.healthRefreshRate = 500;
            } else if (CHARACTER.healthRefreshRate == 500){
                CHARACTER.healthRefreshRate = 1000;
            } else if (CHARACTER.healthRefreshRate == 1000){
                CHARACTER.healthRefreshRate = 10000;
            } else if (CHARACTER.healthRefreshRate == 10000){
                CHARACTER.healthRefreshRate = 25;
            } else if (CHARACTER.healthRefreshRate == 25){
                CHARACTER.healthRefreshRate = 50;
            } else if (CHARACTER.healthRefreshRate == 50){
                CHARACTER.healthRefreshRate = 100;
            } else {
                CHARACTER.healthRefreshRate = 200;
            }
            newButton.textContent = CHARACTER.healthRefreshRate+" ms";
            updateCharacter();
            if (healthRefreshInterval){
                clearInterval(healthRefreshInterval);
                startHealthRegeneration();
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingGrottoSpeedDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Auto grotto speed : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        if(CHARACTER.autoGrottoInstant){
            newButton.textContent = "Instant";
        } else {
            newButton.textContent = "Randomized";
        }
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.autoGrottoInstant = !CHARACTER.autoGrottoInstant;
            updateCharacter();
            if(CHARACTER.autoGrottoInstant){
                newButton.textContent = "Instant";
            } else {
                newButton.textContent = "Randomized";
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingResetDataDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Reset BBF data : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        newButton.textContent = "Reset";
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            GM_deleteValue(KEY_SERVER_DOMAIN);
            GM_deleteValue(KEY_SERVER_DOMAIN+"/grotto_stats");
            location.reload();
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingShowTotalDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Show max health and max energy : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        if(CHARACTER.showTotalStat){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.showTotalStat = !CHARACTER.showTotalStat;
            updateCharacter();
            if(CHARACTER.showTotalStat){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
            }
            updateHealthBars(calculateCurrentHealth());
            updateEnergyBars(calculateCurrentEnergy());
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingHideBuddiesDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Hide buddies button : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        if(CHARACTER.hideBuddies){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.hideBuddies = !CHARACTER.hideBuddies;
            updateCharacter();
            if(CHARACTER.hideBuddies){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
            }
            hideBuddies();
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

    function createSettingHideCharsimaDiv(){
        //create the setting line
        const mainDiv = document.createElement('div');
        mainDiv.style.display = "flex";
        //churchDiv.style.justifyContent = 'space-around';
        const leftDiv = createSettingTextDiv();
        mainDiv.appendChild(leftDiv);
        const rightDiv = document.createElement('div');
        mainDiv.appendChild(rightDiv);
        // add the text
        let textChurchHighlight = document.createTextNode('Hide charisma button : ');
        leftDiv.appendChild(textChurchHighlight);
        // add the button for church highlight
        const newButton = document.createElement("button");
        if(CHARACTER.hideCharisma){
            newButton.textContent = "Yes";
        } else {
            newButton.textContent = "No";
        }
        newButton.className = "btn-small left";
        newButton.style.margin = "0px";
        newButton.style.padding = "0 0 5px";

        // Add a click event listener
        newButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default button behavior
            CHARACTER.hideCharisma = !CHARACTER.hideCharisma;
            updateCharacter();
            if(CHARACTER.hideCharisma){
                newButton.textContent = "Yes";
            } else {
                newButton.textContent = "No";
            }
        });
        // Insert the button after the target element
        rightDiv.appendChild(newButton);
        return mainDiv;
    }

})();
