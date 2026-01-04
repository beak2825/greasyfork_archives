// ==UserScript==
// @name         Challenges and Masteries Inside Inventory
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Combines challenges and masteries inside the game inventory with separate buttons.
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547526/Challenges%20and%20Masteries%20Inside%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/547526/Challenges%20and%20Masteries%20Inside%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const Show_Clan_Challenges = true;//if it's set to false then it won't show clan challenges anymore

    // Inject challenges CSS
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
            body {
                color: #e6e6e6; /* Light text color */
            }
            #pageLogo {
                color: red;
                font-size: 14pt;
            }
            #invController {
                padding-top: 20px;
                overflow-y: auto;
            }
            .challengeContainer {
                border: 1px solid #555;
                margin: 10px;
                background-color: rgba(0, 0, 0, 0.6);
                padding-bottom: 8px;
                text-align: left;
                cursor: pointer;
            }
            .challengeContainer .challengeNamefield {
                position: relative;
                border-bottom: 1px solid darkgrey;
                background-image: linear-gradient(black, black, rgba(50, 50, 50, 0.5));
                padding: 3px 5px;
                font-weight: 900;
                color: #E6CC4D;
            }
            .challengeContainer .challengeDescription {
                padding: 3px 5px;
                border-bottom: 1px solid darkgrey;
            }
            .challengeContainer .challengeHidden {
                max-height: 0;
                overflow-y: hidden;
                transition: max-height 0.1s;
            }
            .challengeContainer .challengeComplete {
                position: absolute;
                text-align: center;
                top: 0;
                left: 0;
                right: 0;
                color: #00ff00;
                font-size: 12pt;
            }
            .challengeContainer.challengeOpened .challengeHidden {
                max-height: 500px;
            }
            .challengeContainer .challengeNamefield::before {
                content: "\\25b2  ";
            }
            .challengeContainer.challengeOpened .challengeNamefield::before {
                content: "\\25bc  ";
            }
            .challengeContainer .challengeRewards {
                float: right;
                border-left: 1px solid red;
                width: 160px;
            }
            .challengeContainer .challengeRewards .item_rewards {
                border-top: 1px solid #660000;
            }
            .challengeContainer .challengeRewards .autoPad {
                padding: 5px 10px;
            }
            .challengeContainer .challengeRewards .fakeItem {
                border-bottom: 1px solid #660000;
                padding: 5px 10px;
            }
            .challengeContainer .challengeObjectives {
                margin-right: 160px;
            }
            .challengeContainer.clanChallenge .challengeRewards {
                width: 200px;
            }
            .challengeContainer.clanChallenge .challengeRewards {
                text-align: center;
            }
            .challengeContainer.clanChallenge .challengeObjectives {
                margin-right: 200px;
            }
            .challengeContainer .challengeObjectives .challengeObjective {
                border: 1px solid #660000;
                border-right: 1px solid red;
                background-color: black;
            }
            .challengeContainer .challengeObjectives .objectiveProgress {
                background-color: #128800;
                white-space: nowrap;
            }
            .challengeContainer .challengeObjectives .objectiveProgress .pads {
                padding: 5px 10px;
            }
            .challengeContainer .challengeProgress {
                background-color: black;
                text-align: center;
            }
            .challengeContainer .challengeBar {
                background-color: #128800;
                white-space: nowrap;
            }
        `;
    document.head.appendChild(style);

    // Create overlay elements
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const overlayContent = document.createElement('div');
    overlayContent.style.backgroundColor = 'rgba(30, 30, 30, 0.9)'; // Dark background
    overlayContent.style.padding = '20px';
    overlayContent.style.borderRadius = '8px';
    overlayContent.style.maxWidth = '600px';
    overlayContent.style.width = '90%';
    overlayContent.style.overflowY = 'auto';
    overlayContent.style.maxHeight = '80%';

    const closeButton = document.createElement('button');
    closeButton.innerText = '✖'; // Change text to match the style
    closeButton.style.marginLeft = '550px';
    closeButton.style.fontFamily = 'Downcome'; // Match font family
    //closeButton.style.color = 'rgb(153, 0, 0)'; // Match text color
    closeButton.style.fontSize = '20pt'; // Match font size
    closeButton.style.backgroundColor = 'transparent'; // Make background transparent
    closeButton.style.border = 'none'; // Remove border
    closeButton.style.cursor = 'pointer'; // Pointer cursor
    closeButton.style.marginBottom = '5px'; // Maintain margin

    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    overlayContent.appendChild(closeButton);
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
    // Event listener to close the overlay when clicking outside of it
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none'; // Hide the overlay
            overlayContent.innerHTML = ''; // Clear existing content
            overlayContent.appendChild(closeButton); // Re-add close button
        }
    });
    // Function to serialize the request parameters
    function serializeObject(obj) {
        return Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');
    }

    // Function to parse clan challenge data from the response
    function parseClanChallengeData(data) {
        const clanChallenges = [];
        const parsedData = new URLSearchParams(data);
        const maxClanChallenges = parseInt(parsedData.get('max_clan_challenges')) || 0;

        for (let i = 0; i < maxClanChallenges; i++) {
            const challenge = {
                name: parsedData.get(`challenge_clan_${i}_name`),
                description: parsedData.get(`challenge_clan_${i}_description`),
                endTime: new Date(new Date(0).setUTCSeconds(parseInt(parsedData.get(`challenge_clan_${i}_end_time`)) + 1200000000)).toLocaleString(),
                objectives: [],
                progress: 0, // Initialize progress
                rewardPoints: parseInt(parsedData.get(`challenge_clan_${i}_reward_points`)) || 0 // Extract reward points
            };

            const totalObjectives = parseInt(parsedData.get(`challenge_clan_${i}_objectives`)) || 0;

            // Loop through each objective for the clan challenge
            for (let j = 1; j <= totalObjectives; j++) {
                const targetKey = `challenge_clan_${i}_objectives_${j}_target`;
                const playerScoreKey = `challenge_clan_${i}_objective_${j}_player_score`;
                const objectiveNameKey = `challenge_clan_${i}_objectives_${j}_name`;

                const target = parseInt(parsedData.get(targetKey)) || 0;
                const playerScore = parseInt(parsedData.get(playerScoreKey)) || 0;
                const objectiveName = parsedData.get(objectiveNameKey);

                // Calculate progress for the objective
                const progress = (target > 0) ? Math.min((playerScore / target) * 100, 100) : 0;

                challenge.objectives.push({
                    name: objectiveName,
                    target: target,
                    current: playerScore,
                    progress: progress
                });
            }

            // Calculate overall progress as the average of individual objective progress
            const totalProgress = challenge.objectives.reduce((sum, obj) => sum + obj.progress, 0);
            challenge.progress = totalObjectives > 0 ? (totalProgress / totalObjectives) : 0;

            clanChallenges.push(challenge);
        }

        return clanChallenges;
    }
    // Function to make the POST request
    function makeRequest() {
        const requestUrl = "https://fairview.deadfrontier.com/onlinezombiemmo/hotrods/load_challenge.php";
        const playerLevel = unsafeWindow.userVars["DFSTATS_df_level"]; // Get player's level
        const requestParams = {
            userID: unsafeWindow.userVars["userID"],
            password: unsafeWindow.userVars["password"],
            sc: unsafeWindow.userVars["sc"],
            action: "get"
        };

        // Calculate the hash
        const payload = serializeObject(requestParams);
        const hash = unsafeWindow.hash(payload);
        const fullPayload = "hash=" + hash + "&" + payload;

        // Send the POST request
        GM_xmlhttpRequest({
            method: "POST",
            url: requestUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "LuckyScript" // Replace with your desired User-Agent
            },
            data: fullPayload,
            onload: function(response) {
                //console.log('Response:', response.responseText);
                if (Show_Clan_Challenges) {
                    // Now process clan challenges as well
                    const clanChallenges = parseClanChallengeData(response.responseText);
                    displayClanChallenges(clanChallenges);
                }
                displayChallenges(response.responseText);
            },
            onerror: function(error) {
                console.error('Error:', error);
                alert('Error sending POST request.');
            }
        });
    }
    // Function to display clan challenges in the overlay
    function displayClanChallenges(clanChallenges) {
        clanChallenges.forEach(challenge => {
            const challengeContainer = document.createElement("div");
            challengeContainer.classList.add("challengeContainer");

            const nameField = document.createElement("div");
            nameField.classList.add("challengeNamefield");
            nameField.innerHTML = `<span style="color: green;">[CLAN] </span> ${challenge.name}<span style="float: right;">Ends: ${challenge.endTime}</span>`;

            challengeContainer.appendChild(nameField);

            const description = document.createElement("div");
            description.classList.add("challengeDescription");
            description.textContent = challenge.description;
            challengeContainer.appendChild(description);

            // Add reward information
            const rewardsContainer = document.createElement("div");
            rewardsContainer.classList.add("challengeRewards");
            rewardsContainer.innerHTML = `
    <div class="autoPad" style="display: flex; flex-direction: column; align-items: center;">
        <div class="cashhack redElements" style="position: relative; text-align: center;" data-cash="Rewards">
            <strong>Rewards</strong>
        </div>
        <div class="cashhack" style="position: relative; text-align: center;" data-cash="Victory Points: ${challenge.rewardPoints}">
            <strong>Victory Points: ${challenge.rewardPoints}</strong>
        </div>
    </div>
        `;
            challengeContainer.appendChild(rewardsContainer);

            const objectives = document.createElement("div");
            objectives.classList.add("challengeObjectives");
            challenge.objectives.forEach(obj => {
                const objective = document.createElement("div");
                objective.classList.add("challengeObjective");
                objective.innerHTML = `<div class='objectiveProgress' style='width: ${obj.progress}%;'>
                <div class='pads'>${obj.name}: ${obj.current}/${obj.target}</div>
            </div>`;
                objectives.appendChild(objective);
            });
            challengeContainer.appendChild(objectives);

            const progress = document.createElement("div");
            progress.classList.add("challengeProgress");
            progress.innerHTML = `
        <div class='challengeProgress'>
            <div class='challengeBar' style='width: ${challenge.progress}%;'>${challenge.progress.toFixed(2)}%</div>
        </div>
        `;
            challengeContainer.appendChild(progress);

            // Append the challenge container to the overlay content
            overlayContent.appendChild(challengeContainer);
        });

        // Show the overlay for clan challenges
        overlay.style.display = 'flex';
    }
    // Function to display challenges in the overlay
    function displayChallenges(data) {
        const challenges = parseChallengeData(data);
        //overlayContent.innerHTML = ''; // Clear existing content
        //overlayContent.appendChild(closeButton); // Re-add close button

        if (challenges.length === 0) {
            overlayContent.innerHTML = "<p style='color: white;'>No challenges available.</p>";
            overlay.style.display = 'flex'; // Show the overlay
            return;
        }

        challenges.forEach(challenge => {
            const challengeContainer = document.createElement("div");
            challengeContainer.classList.add("challengeContainer");

            const nameField = document.createElement("div");
            nameField.classList.add("challengeNamefield");
            nameField.innerHTML = `${challenge.name}<span style="float: right;">Ends: ${challenge.endTime}</span>`;

            challengeContainer.appendChild(nameField);

            const description = document.createElement("div");
            description.classList.add("challengeDescription");
            description.textContent = challenge.description;
            challengeContainer.appendChild(description);

            const rewards = document.createElement("div");
            rewards.classList.add("challengeRewards");

            let rewardsHTML = `<div class='autoPad'>
        <div class='cashhack redElements' style='position: relative;' data-cash='Rewards'>Rewards</div>`;

            if (challenge.rewardCash > 0) {
                rewardsHTML += `<div class='cashhack' style='position: relative;' data-cash='Cash: ${parseInt(challenge.rewardCash).toLocaleString()}'>Cash: ${parseInt(challenge.rewardCash).toLocaleString()}</div>`;
            }

            if (challenge.rewardExp > 0) {
                rewardsHTML += `<div class='credits cashhack' style='position: relative;' data-cash='Exp: ${parseInt(challenge.rewardExp).toLocaleString()}'>Exp: ${parseInt(challenge.rewardExp).toLocaleString()}</div>`;
            }
            rewardsHTML += `</div>`;
            rewards.innerHTML = rewardsHTML;

            challengeContainer.appendChild(rewards);


            const objectives = document.createElement("div");
            objectives.classList.add("challengeObjectives");
            challenge.objectives.forEach(obj => {
                const objective = document.createElement("div");
                objective.classList.add("challengeObjective");
                objective.innerHTML = `<div class='objectiveProgress' style='width: ${obj.progress}%;'>
                        <div class='pads'>${obj.name}: ${obj.current}/${obj.target}</div>
                    </div>`;
                objectives.appendChild(objective);
            });
            challengeContainer.appendChild(objectives);

            const progress = document.createElement("div");
            progress.classList.add("challengeProgress");
            //progress.innerHTML = `<div class='challengeBar' style='width: ${challenge.progress}%;'>${challenge.progress}%</div>`;
            // Determine margin-top based on conditions
            let marginTopStyle = "3px"; // Default margin
            const hasCash = challenge.rewardCash > 0;
            const hasExp = challenge.rewardExp > 0;
            const totalObjectives = challenge.objectives.length;

            if (hasCash && hasExp && totalObjectives === 1) {
                marginTopStyle = "34px";
            } else if (!hasCash && hasExp && totalObjectives === 1) {
                marginTopStyle = "16px";
            }

            progress.innerHTML = `
        <div class='challengeProgress' style='margin-top: ${marginTopStyle};'>
            <div class='challengeBar' style='width: ${challenge.progress}%;'>${challenge.progress}%</div>
        </div>
    `;
            challengeContainer.appendChild(progress);

            overlayContent.appendChild(challengeContainer);
        });

        overlay.style.display = 'flex'; // Show the overlay
    }

    // Function to parse challenge data from the response
    function parseChallengeData(data) {
        const challenges = [];
        const parsedData = new URLSearchParams(data);

        const maxChallenges = parseInt(parsedData.get('max_challenges')) || 0;
        const playerLevel = unsafeWindow.userVars["DFSTATS_df_level"]; // Get player's level

        for (let i = 0; i < maxChallenges; i++) {
            const minLevel = parseInt(parsedData.get(`challenge_${i}_min_level`)) || 0;
            const maxLevel = parseInt(parsedData.get(`challenge_${i}_max_level`)) || 0;

            // Check if the player's level is within the challenge's level range
            if (playerLevel < minLevel || playerLevel > maxLevel) {
                continue; // Skip this challenge if the player's level is not appropriate
            }

            let rewardExp = parseInt(parsedData.get(`challenge_${i}_reward_exp`)) || 0; // Get rewardExp and ensure it's a number

            // Check if the user is a gold member and double the rewardExp if true
            if (unsafeWindow.userVars['DFSTATS_df_goldmember'] === '1') {
                rewardExp *= 2; // Double the experience reward for gold members
            }
            rewardExp *= playerLevel; // Now multiply by player level

            const challenge = {
                name: parsedData.get(`challenge_${i}_name`),
                description: parsedData.get(`challenge_${i}_description`),
                endTime: new Date(new Date(0).setUTCSeconds(parseInt(parsedData.get(`challenge_${i}_end_time`)) + 1200000000)).toLocaleString(),
                rewardCash: parsedData.get(`challenge_${i}_reward_cash`),
                rewardExp: rewardExp,
                objectives: [],
                progress: 0
            };

            const totalObjectives = parseInt(parsedData.get(`challenge_${i}_objectives`)) || 0;
            let totalProgress = 0; // To accumulate total progress for the challenge
            let totalTargetScore = 0; // To accumulate total target score for the challenge
            let totalPlayerScore = 0; // To accumulate player's score for the challenge

            for (let j = 1; j <= totalObjectives; j++) {
                const targetKey = `challenge_${i}_objectives_${j}_target`;
                const playerScoreKey = `challenge_${i}_objective_${j}_player_score`;
                const objectiveNameKey = `challenge_${i}_objectives_${j}_name`;

                const target = parseInt(parsedData.get(targetKey)) || 0; // Correctly retrieve target
                const playerScore = parseInt(parsedData.get(playerScoreKey)) || 0;
                const objectiveName = parsedData.get(objectiveNameKey);

                // Calculate progress for the objective
                const progress = (target > 0) ? Math.min((playerScore / target) * 100, 100) : 0;

                challenge.objectives.push({
                    name: objectiveName,
                    target: target, // Ensure target is set correctly
                    current: playerScore,
                    progress: progress // Store the calculated progress
                });

                // Accumulate total target and player scores
                totalTargetScore += target;
                totalPlayerScore += playerScore;
                totalProgress += progress; // Accumulate individual progress
            }

            // Calculate overall progress as the average of individual objective progress
            const overallProgress = (totalObjectives > 0) ? (totalProgress / totalObjectives) : 0;

            // Set the challenge progress based on overall progress
            challenge.progress = Math.min(100, parseFloat(overallProgress.toFixed(2)));

            // Uncomment for debugging
            // console.log("Specific Objective Progress: ", specificObjectiveProgress);
            // console.log("Overall Progress: ", overallProgress);
            // console.log("Challenge Progress: ", challenge.progress);

            challenges.push(challenge);
        }

        return challenges;
    }

    // Create the button
    const button = document.createElement('button');
    button.innerText = 'Show Current Challenges';
    button.style.position = 'absolute';

    //<button class="opElem" style="left: 20px; bottom: 86px;">SlotLock?</button>

    //button.style.backgroundColor = '#4CAF50'; // Green button
    button.style.left = '20px';
    button.style.bottom = '110px';
    button.style.cursor = 'pointer';
//=========================================================
// =================== Masteries Part ===================
//=========================================================
    // Function to fetch and apply CSS styles
    function loadStylesMastery() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fairview.deadfrontier.com/onlinezombiemmo/hotrods/hotrods_v9_0_11/HTML5/css/masteries.css",
            onload: function(response) {
                const style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = response.responseText;
                document.head.appendChild(style);
            },
            onerror: function(error) {
                console.error('Error loading CSS:', error);
            }
        });
    }
    // Load the CSS styles
    loadStylesMastery();

    // Create overlay elements
    const overlayM = document.createElement('div');
    overlayM.style.position = 'fixed';
    overlayM.style.top = '0';
    overlayM.style.left = '0';
    overlayM.style.width = '100%';
    overlayM.style.height = '100%';
    overlayM.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlayM.style.zIndex = '9999';
    overlayM.style.display = 'none';
    overlayM.style.justifyContent = 'center';
    overlayM.style.alignItems = 'center';

    const overlayContentM = document.createElement('div');
    overlayContentM.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
    overlayContentM.style.padding = '20px';
    overlayContentM.style.borderRadius = '8px';
    overlayContentM.style.maxWidth = '800px'; // Set a fixed width
    overlayContentM.style.width = '90%';
    overlayContentM.style.overflowY = 'auto';
    overlayContentM.style.maxHeight = '80%';
    overlayContentM.style.display = 'flex'; // Use flexbox
    overlayContentM.style.flexWrap = 'wrap'; // Allow wrapping of mastery containers
    overlayContentM.style.gap = '5px'; // Add space between containers

    // Close button
    const closeButtonM = document.createElement('button');
    closeButtonM.innerText = '✖';
    closeButtonM.style.marginLeft = '756.5px';
    closeButtonM.style.fontSize = '20pt';
    closeButtonM.style.backgroundColor = 'transparent';
    closeButtonM.style.border = 'none';
    closeButtonM.style.cursor = 'pointer';
    closeButtonM.addEventListener('click', () => {
        overlayM.style.display = 'none';
    });

    // Append close button to overlay content
    overlayContentM.appendChild(closeButtonM);
    overlayM.appendChild(overlayContentM);
    document.body.appendChild(overlayM);

    // Event listener to close the overlay when clicking outside of it
    overlayM.addEventListener('click', (event) => {
        if (event.target === overlayM) {
            overlayM.style.display = 'none';
        }
    });

    // Function to serialize the request parameters
    function serializeObjectMastery(obj) {
        return Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');
    }

    // Function to make the POST request to load masteries
    function makeRequestMastery() {
        const requestUrl = "https://fairview.deadfrontier.com/onlinezombiemmo/hotrods/load_masteries.php";
        const requestParams = {
            userID: unsafeWindow.userVars["userID"],
            password: unsafeWindow.userVars["password"],
            sc: unsafeWindow.userVars["sc"],
            action: "get"
        };

        // Send the POST request
        GM_xmlhttpRequest({
            method: "POST",
            url: requestUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "LuckyScript" // Replace with your desired User-Agent
            },
            data: serializeObjectMastery(requestParams),
            onload: function(response) {
                displayMasteries(response.responseText);
            },
            onerror: function(error) {
                console.error('Error:', error);
                alert('Error sending POST request.');
            }
        });
    }

    // Function to display masteries in the overlay
    function displayMasteries(data) {
        const masteries = parseMasteryData(data);
        overlayContentM.innerHTML = ''; // Clear existing content
        overlayContentM.appendChild(closeButtonM); // Re-add close button

        if (masteries.length === 0) {
            overlayContentM.innerHTML = "<p style='color: white;'>No masteries available.</p>";
            overlayM.style.display = 'flex'; // Show the overlay
            return;
        }

        masteries.forEach(mastery => {
            const masteryContainer = document.createElement("div");
            masteryContainer.classList.add("masteryContainer");
            masteryContainer.style.flex = '1 1 20%'; // Allow three containers in a row
            masteryContainer.style.textAlign = 'center'; // Center align text

            const nameField = document.createElement("div");
            nameField.classList.add("namefield");
            nameField.textContent = mastery.name;

            masteryContainer.appendChild(nameField);

            // Add mastery icon
            const masteryIcon = document.createElement("img");
            masteryIcon.classList.add("icon");
            masteryIcon.src = `https://fairview.deadfrontier.com/onlinezombiemmo/hotrods/hotrods_v9_0_11/HTML5/images/masteries/${mastery.name}.png`;
            masteryContainer.appendChild(masteryIcon);

            const playerLevel = document.createElement("div");
            playerLevel.textContent = `Level ${mastery.statLevel}`;
            masteryContainer.appendChild(playerLevel);

            const playerProgress = document.createElement("div");
            playerProgress.classList.add("progress");

            const nextLevel = Math.ceil(mastery.startPoint * Math.pow(mastery.scaleFactor, mastery.statLevel + 1));
            const progress = mastery.statExp / nextLevel;
            const progressBar = document.createElement("div");
            progressBar.classList.add("bar");
            progressBar.style.width = (progress > 1 ? 1 : progress) * 100 + "%";

            const progressText = document.createElement("div");
            progressText.classList.add("pads");
            progressText.textContent = `${mastery.statExp} / ${nextLevel}`;

            progressBar.appendChild(progressText);
            playerProgress.appendChild(progressBar);
            masteryContainer.appendChild(playerProgress);

            const description = document.createElement("div");
            description.classList.add("description");
            description.textContent = mastery.description;
            masteryContainer.appendChild(description);

            const masteryData = document.createElement("div");
            masteryData.classList.add("masteryRewards");

            let rewardHTML = "<div class='autoPad'>";
            mastery.bonuses.forEach(bonus => {
                // Parse bonus scale and max as floats
                const bonusScale = Math.abs(parseFloat(bonus.scale));
                console.log(bonusScale);
                const bonusMax = parseFloat(bonus.max);
                //let userBonusValue = bonusScale * mastery.statLevel;
                let userBonusValue = bonusScale * Math.abs(mastery.statLevel);
                userBonusValue = Math.abs(userBonusValue);

                // Clamp to max if max is not zero
                if (bonusMax !== 0 && userBonusValue > bonusMax) {
                    userBonusValue = bonusMax;
                }
                userBonusValue = Math.abs(userBonusValue);
                // Format display
                let bonusDisplay = userBonusValue.toFixed(2) + "%";

                // Check if bonus is at max (consider floating point precision)
                if (Math.abs(userBonusValue - bonusMax) < 0.0001 && bonusMax !== 0) {
                    bonusDisplay += " MAX";
                } else {
                    bonusDisplay = '+' + bonusDisplay;
                }

                // Build HTML
                rewardHTML += `<div class='bonusType cashHack redElements' data-cash='${bonus.name}' title='${bonus.tooltip}' style='font-size: 14px; font-family: "Courier New", "Arial"; font-weight: 600;'>${bonus.name}</div>`;
                rewardHTML += `<div class='bonusScale' title='${bonusScale} / lvl' style='position: relative; font-size: 14px; font-family: "Courier New", "Arial"; font-weight: 600;'>
    <span class='cashhack greenElements' style='position: relative; font-size: 14px; font-family: "Courier New", "Arial"; font-weight: 600;' data-cash='${bonusDisplay}'>${bonusDisplay}</span><br>+${bonusScale}%/lvl
</div>`;
            });
            rewardHTML += "</div>"; // Close autoPad div
            masteryData.innerHTML = rewardHTML;

            masteryContainer.appendChild(masteryData);
            overlayContentM.appendChild(masteryContainer);
        });

        overlayM.style.display = 'flex'; // Show the overlay
    }


    // Function to parse mastery data from the response
    function parseMasteryData(data) {
        const masteries = [];
        const parsedData = new URLSearchParams(data);
        const maxMasteries = parseInt(parsedData.get('max_masteries')) || 0;

        for (let i = 0; i < maxMasteries; i++) {
            const mastery = {
                name: parsedData.get(`mastery_${i}_name`),
                description: parsedData.get(`mastery_${i}_description`),
                startPoint: parseInt(parsedData.get(`mastery_${i}_start_point`)) || 0,
                scaleFactor: parseFloat(parsedData.get(`mastery_${i}_scale_factor`)) || 1,
                statLevel: parseInt(parsedData.get(`mastery_${i}_stat_level`)) || 0,
                statExp: parseInt(parsedData.get(`mastery_${i}_stat_exp`)) || 0,
                bonuses: []
            };

            const bonusCount = parseInt(parsedData.get(`mastery_${i}_bonuses`)) || 0;
            for (let j = 0; j < bonusCount; j++) {
                mastery.bonuses.push({
                    name: parsedData.get(`mastery_${i}_bonuses_${j}_name`),
                    tooltip: parsedData.get(`mastery_${i}_bonuses_${j}_tooltip`),
                    scale: parseFloat(parsedData.get(`mastery_${i}_bonuses_${j}_scale`)),
                    max: parseFloat(parsedData.get(`mastery_${i}_bonuses_${j}_max`)),
                });
            }
            masteries.push(mastery);
        }
        return masteries;
    }

    // Create the button
    const buttonM = document.createElement('button');
    buttonM.innerText = 'Show Current Masteries';
    buttonM.style.position = 'absolute';
    buttonM.style.left = '20px';
    buttonM.style.bottom = '130px';
    buttonM.style.cursor = 'pointer';
    // =================== Masteries Part ===================

    // Select the element with ID 'invController'
    var invController = document.getElementById('invController');

    // Check if invController exists before appending the buttons
    if (invController) {
        // Append the button to the selected element
        invController.appendChild(buttonM);
        invController.appendChild(button);

        // Add click event listener to the mastery button
        buttonM.addEventListener('click', makeRequestMastery);

        // Add click event listener to the other button
        button.addEventListener('click', makeRequest);
    } else {
        // Append buttons to the body if invController is not found
        document.body.appendChild(buttonM);
        document.body.appendChild(button);

        // Add click event listener to the mastery button
        buttonM.addEventListener('click', makeRequestMastery);

        // Add click event listener to the other button
        button.addEventListener('click', makeRequest);

        console.log('invController not found, buttons appended to body');
    }
})();