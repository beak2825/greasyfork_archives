// ==UserScript==
// @name         OC 2.0 Time Based Payouts
// @namespace    http://tampermonkey.net/
// @version      1.28
// @description  Calculates time-based payouts for OCs 2.0 with a 20% faction cut, supports multi-stage crimes
// @author       KingLouisCLXXII [2070312]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      discord.com
// @connect      api.torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527250/OC%2020%20Time%20Based%20Payouts.user.js
// @updateURL https://update.greasyfork.org/scripts/527250/OC%2020%20Time%20Based%20Payouts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "";
    const DISCORD_WEBHOOK = "";
    // =================== Constants (Change these as needed) ===================
    // Rates
    const REDUCED_RATE = 0.75;
    const REGULAR_RATE = 1.0;
    const BOOSTED_RATE = 1.25;
    const STALL_RATE = 1.0;
    // Pre-planning durations in hours
    const PRE_PLANNING_REDUCED_DURATION = 12;
    const PRE_PLANNING_REGULAR_DURATION = 6;
    const MAX_PRE_PLANNING_DURATION = 24;
    const STALL_CREDIT_DURATION = 6;
    // Faction cut percentage (0.2 = 20%)
    const FACTION_CUT = 0.2;
    // Deduct consumable items from payout (true/false)
    const DEDUCT_CONSUMABLE_ITEMS = true;
    // ===========================================================================

    // Get a cookie value by name.
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function getPlayerNameAndIdFromSidebar() {
        // Find the anchor with href like /profiles.php?XID=XXXXX
        const profileAnchor = document.querySelector('a[href^="/profiles.php?XID="].menu-value___gLaLR');
        if (!profileAnchor) return null;
        // Extract player ID from href
        const idMatch = profileAnchor.href.match(/XID=(\d+)/);
        const playerId = idMatch ? idMatch[1] : null;
        const playerName = profileAnchor.textContent.trim();
        if (!playerId || !playerName) return null;
        return { playerId, playerName };
    }

    // Get the rfc token from cookies.
    function getRFC() {
        const rfc = getCookie("rfc_v");
        if (!rfc) {
            for (let cookie of document.cookie.split("; ")) {
                cookie = cookie.split("=");
                if (cookie[0] === "rfc_v") {
                    return cookie[1];
                }
            }
        }
        return rfc;
    }

    function formatName(name) {
        if (name[0] === '_' && name[name.length - 1] === '_') {
            return '\\_' + name.slice(1, -1) + '\\_';
        }
        return name;
    }

    /**
     * Fetches member data to map user IDs to names
     *
     * @returns {Promise<Object>} A promise that resolves to an object mapping user IDs to usernames
     */
    async function fetchMemberData() {
        try {
            const url = 'https://api.torn.com/v2/faction/members?striptags=true';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'ApiKey ' + API_KEY
                }
            });

            const data = await response.json();
            const membersMapping = {};

            if (data && data.members && Array.isArray(data.members)) {
                data.members.forEach(member => {
                    membersMapping[member.id] = member.name;
                });
            }

            return membersMapping;
        } catch (err) {
            console.error("Error fetching member data:", err);
            return {};
        }
    }

    /**
     * Fetches crime and member data for a specific crimeId using the new Torn v2 API endpoint.
     * For multi-stage crimes, it recursively fetches all previous stages.
     *
     * @param {number} crimeId - The ID of the organized crime to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to an object containing:
     *                                 - crimes: array of crime objects (all stages)
     *                                 - membersMapping: an object mapping user IDs to usernames
     *                                 - isMultiStage: boolean indicating if this is a multi-stage crime
     *                                 Or null if the data could not be retrieved.
     */
    async function fetchCrimeData(crimeId) {
        try {
            const crimes = [];
            let currentCrimeId = crimeId;
            let isMultiStage = false;

            // First, fetch member data to map user IDs to names
            const membersMapping = await fetchMemberData();

            // Recursively fetch all stages of the crime
            while (currentCrimeId) {
                const url = `https://api.torn.com/v2/faction/${currentCrimeId}/crime`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'ApiKey ' + API_KEY
                    }
                });

                const data = await response.json();

                if (data && data.crime) {
                    // Add the crime to our array
                    crimes.push(data.crime);

                    // Check if there's a previous stage
                    if (data.crime.previous_crime_id) {
                        isMultiStage = true;
                        currentCrimeId = data.crime.previous_crime_id;
                    } else {
                        currentCrimeId = null;
                    }
                } else {
                    currentCrimeId = null;
                }
            }

            // Reverse the array so the first stage is first
            crimes.reverse();

            return {
                crimes: crimes,
                membersMapping: membersMapping,
                isMultiStage: isMultiStage
            };
        } catch (err) {
            console.error("Error fetching crime data:", err);
            return null;
        }
    }

    /**
     * Adds our custom clipboard payout button into a given .wrapper___U2Ap7 element.
     * It removes the native PayOut button (if present) and then adds our button.
     */
    function addClipboardPayoutButton(wrapper) {
        // Only add the button if the native payout container exists.
        const container = wrapper.querySelector('.btnContainer___DVoOL');
        if (!container) return;

        // Find the native PayOut button.
        const nativePayout = container.querySelector('button.torn-btn.btn-small.payoutBtn___WdW3B');
        if (!nativePayout) return;

        // Remove the native PayOut button.
        nativePayout.remove();

        // Avoid duplicate custom buttons.
        if (container.querySelector('.tampermonkey-clipboard-button')) return;

        // Create our custom clipboard button.
        const clipboardButton = document.createElement('button');
        clipboardButton.textContent = "Payout";
        clipboardButton.classList.add('tampermonkey-clipboard-button');
        clipboardButton.style.cssText = `
            padding: 5px 10px;
            margin-left: 5px;
            background-color: #28a745;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

        // Declare crimeIdContent at this scope so it can be used later.
        let crimeIdContent = null;

        clipboardButton.addEventListener("click", function () {
            // Find the .wrapper___U2Ap7 container that our button is in.
            const wrapperAncestor = clipboardButton.closest('.wrapper___U2Ap7');
            if (!wrapperAncestor) return;

            // Within that wrapper, search for the "Copy link" button.
            crimeIdContent = wrapperAncestor?.getAttribute('data-oc-id');
            if (crimeIdContent) {
                console.log("Extracted Crime ID:", crimeIdContent);
                clipboardButton.textContent = "Calculating...";

                const targetCrimeId = Number(crimeIdContent);
                // Use the function to find the matching crime and members mapping.
                fetchCrimeData(targetCrimeId)
                    .then(result => {
                    if (result) {
                        console.log("Matching Crimes:", result.crimes);
                        const crimes = result.crimes;
                        const isMultiStage = result.isMultiStage;
                        const membersMapping = result.membersMapping;

                        // For multi-stage crimes, we'll use the final stage for display purposes
                        // but calculate rewards and durations across all stages
                        const finalStage = crimes[crimes.length - 1]; // Final stage

                        if (isMultiStage) {
                            clipboardButton.textContent = `Calculating (${crimes.length} stages)`;
                            console.log(`Multi-stage crime detected with ${crimes.length} stages`);
                        } else {
                            clipboardButton.textContent = "Calculated";
                        }

                        // Define a function to process payout calculations and UI updates.
                        function processCrime() {
                            // =================== Calculate time-based credits ===================
                            let player_dict = {};
                            let total = 0;
                            let participantDetailsStr = "";
                            let totalMoneyReward = 0;
                            let totalItemsValue = 0;
                            let stageInfo = "";

                            // Store detailed timing information for each participant in each stage
                            let participantStageDetails = {};

                            // Process each stage of the crime
                            crimes.forEach((crime, crimeIndex) => {
                                // Add the money reward from this stage
                                totalMoneyReward += crime.rewards.money || 0;

                                // Add stage info for multi-stage crimes
                                if (isMultiStage) {
                                    stageInfo += `Stage ${crimeIndex + 1}: ${crime.name} (${crime.difficulty}/10) - ID: ${crime.id}\n`;
                                }

                                const sortedSlots = crime.slots.sort((a, b) => a.user.joined_at - b.user.joined_at);
                                let previousPlanningStart = null;
                                
                                for (let i = 0; i < sortedSlots.length; i++) {
                                    const slot = sortedSlots[i];
                                    const userId = slot.user.id;

                                    // Initialize participant stage details if needed
                                    if (!participantStageDetails[userId]) {
                                        participantStageDetails[userId] = [];
                                    }

                                    // Calculate processing start time.
                                    let processing_start;
                                    if (i === 0) {
                                        // First player's planning starts as soon as they join
                                        processing_start = slot.user.joined_at;
                                    } else {
                                        // Subsequent players start 24 hours after previous player's planning start
                                        processing_start = Math.max(
                                            previousPlanningStart + 24 * 60 * 60,
                                            slot.user.joined_at
                                        );
                                    }
                                    
                                    const time_since_join = Math.max(0, processing_start - slot.user.joined_at);

                                    // Calculate time earned before planning.
                                    // Players who join more than MAX_PRE_PLANNING_DURATION hours early get zero pre-planning credit (punishment for excessive early joining)
                                    // Set MAX_PRE_PLANNING_DURATION = -1 to disable the cap entirely
                                    let pre_planning_credit = 0;
                                    if (MAX_PRE_PLANNING_DURATION === -1 || time_since_join <= MAX_PRE_PLANNING_DURATION * 60 * 60) {
                                        pre_planning_credit = Math.max(
                                            Math.min(PRE_PLANNING_REDUCED_DURATION * 60 * 60, time_since_join) * REDUCED_RATE,
                                            Math.min(PRE_PLANNING_REGULAR_DURATION * 60 * 60, time_since_join) * REGULAR_RATE
                                        );
                                    }

                                    // Calculate stall credit for players joining a stalled crime
                                    let stall_credit = 0;
                                    if (i > 0) {
                                        // Check if more than 24 hours has elapsed since previous player's planning start
                                        const timeSincePreviousPlanning = slot.user.joined_at - previousPlanningStart;
                                        if (timeSincePreviousPlanning > 24 * 60 * 60) {
                                            // Crime has stalled - calculate stall credit
                                            const stallTimeHours = (timeSincePreviousPlanning - 24 * 60 * 60) / (60 * 60); // Hours since stall
                                            const maxStallCreditHours = STALL_CREDIT_DURATION;
                                            const actualStallHours = Math.min(stallTimeHours, maxStallCreditHours);
                                            stall_credit = actualStallHours * 60 * 60 * STALL_RATE;
                                        }
                                    }

                                    previousPlanningStart = processing_start;

                                    // Calculate time earned during planning.
                                    const planning_credit = 24 * 60 * 60 * BOOSTED_RATE;

                                    // Calculate time earned after planning.
                                    let post_planning_credit = 0;
                                    if (crime.executed_at && (crime.executed_at - processing_start - 24 * 60 * 60) > 0) {
                                        post_planning_credit = (crime.executed_at - processing_start - 24 * 60 * 60) * REGULAR_RATE;
                                    } else if (crime.ready_at && (crime.ready_at - processing_start - 24 * 60 * 60) > 0) {
                                        post_planning_credit = (crime.ready_at - processing_start - 24 * 60 * 60) * REGULAR_RATE;
                                    }

                                    const time_credit = pre_planning_credit + planning_credit + post_planning_credit + stall_credit;

                                    // Store stage details for this participant
                                    participantStageDetails[userId].push({
                                        stageIndex: crimeIndex,
                                        stageName: crime.name,
                                        stageDifficulty: crime.difficulty,
                                        position: slot.position,
                                        checkpointRate: slot.checkpoint_pass_rate,
                                        joinedAt: slot.user.joined_at,
                                        planningAt: processing_start,
                                        prePlanningCredit: pre_planning_credit,
                                        planningCredit: planning_credit,
                                        postPlanningCredit: post_planning_credit,
                                        stallCredit: stall_credit,
                                        timeCredit: time_credit
                                    });

                                    // Build detailed participant info for the final stage only
                                    if (crimeIndex === crimes.length - 1) {
                                        participantDetailsStr += `${membersMapping[slot.user.id] || slot.user.id} - ${slot.position} (${slot.checkpoint_pass_rate}%)\n`;
                                        participantDetailsStr += `- Joined: <t:${slot.user.joined_at}:f>\n`;
                                        participantDetailsStr += `- Planning: <t:${processing_start}:f>\n`;
                                        participantDetailsStr += `- Pre-Planning: ${(pre_planning_credit / 3600).toFixed(2)}\n`;
                                        participantDetailsStr += `- Planning: ${(planning_credit / 3600).toFixed(2)}\n`;
                                        participantDetailsStr += `- Post-Planning: ${(post_planning_credit / 3600).toFixed(2)}\n`;
                                        participantDetailsStr += `- Total Credit: ${(time_credit / 3600).toFixed(2)}\n\n`;
                                    }

                                    // Update payout calculations.
                                    if (player_dict[slot.user.id]) {
                                        player_dict[slot.user.id] += time_credit;
                                    } else {
                                        player_dict[slot.user.id] = time_credit;
                                    }
                                    total += time_credit;
                                }

                                // Process item rewards if any
                                if (crime.rewards.items && crime.rewards.items.length > 0) {
                                    crime.rewards.items.forEach(item => {
                                        if (item.value && item.value.market_price) {
                                            totalItemsValue += item.value.market_price * (item.quantity || 1);
                                        }
                                    });
                                }
                            });

                            // Add item value to total money reward
                            totalMoneyReward += totalItemsValue;
                            
                            // Calculate total consumable item value to subtract from payout (if enabled)
                            const totalConsumableValue = DEDUCT_CONSUMABLE_ITEMS ? 
                                consumableItems.reduce((sum, item) => sum + (item.value * item.quantity), 0) : 0;
                            
                            // Subtract consumable items from total money reward before faction cut (if enabled)
                            const adjustedMoneyReward = totalMoneyReward - totalConsumableValue;
                            // =====================================================================

                            // =================== Calculate payouts with faction cut ===================
                            const factionCut = adjustedMoneyReward * FACTION_CUT;
                            const moneyRewardAfterCut = adjustedMoneyReward - factionCut;
                            const payouts = {};
                            for (const [userId, time_credit] of Object.entries(player_dict)) {
                                payouts[userId] = (time_credit / total) * moneyRewardAfterCut;
                            }
                            console.log("Calculated time credits per participant:", player_dict);
                            console.log("Total time credits:", total);
                            console.log("Calculated payouts per participant:", payouts);
                            // =====================================================================

                            // =================== Create a container for payout buttons ===================
                            let existingPayoutContainer = container.querySelector('.tm-payout-buttons');
                            if (existingPayoutContainer) {
                                existingPayoutContainer.remove();
                            }
                            const payoutContainer = document.createElement('div');
                            payoutContainer.classList.add('tm-payout-buttons');
                            payoutContainer.style.cssText = "margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;";

                            // Create a button for each participant.
                            for (const [userId, payoutValue] of Object.entries(payouts)) {
                                const payButton = document.createElement('button');
                                const payoutFormatted = Number(payoutValue).toFixed(2);
                                const userName = membersMapping[userId] || userId;
                                payButton.textContent = `Pay ${userName}`;
                                payButton.style.cssText = `
                                    padding: 5px 10px;
                                    background-color: #007bff;
                                    color: #fff;
                                    border: none;
                                    border-radius: 3px;
                                    cursor: pointer;
                                    font-size: 0.9em;
                                `;
                                
                                // Add click event to directly pay the user
                                payButton.addEventListener("click", async () => {
                                    payButton.disabled = true;
                                    payButton.textContent = "Paying...";
                                    
                                    try {
                                        // Make the request to add money to the player's balance
                                        const response = await fetch("https://www.torn.com/page.php?sid=factionsGiveMoney&rfcv=" + getRFC(), {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                "accept": "/",
                                                "content-type": "application/json",
                                                "x-requested-with": "XMLHttpRequest",
                                                "referrer": "https://www.torn.com/factions.php?step=your&type=1"
                                            },
                                            body: JSON.stringify({
                                                "option": "addToBalance",
                                                "receiver": parseInt(userId),
                                                "amount": parseFloat(payoutFormatted)
                                            })
                                        });
                                        
                                        const result = await response.json();
                                        
                                        if (result && result.success) {
                                            payButton.textContent = "✓ Paid";
                                            payButton.style.backgroundColor = "#28a745";
                                        } else {
                                            payButton.textContent = "Failed";
                                            payButton.style.backgroundColor = "#dc3545";
                                            console.error("Payment failed:", result);
                                            setTimeout(() => {
                                                payButton.disabled = false;
                                                payButton.textContent = `Pay ${userName}`;
                                                payButton.style.backgroundColor = "#007bff";
                                            }, 3000);
                                        }
                                    } catch (error) {
                                        console.error("Error making payment:", error);
                                        payButton.textContent = "Error";
                                        payButton.style.backgroundColor = "#dc3545";
                                        setTimeout(() => {
                                            payButton.disabled = false;
                                            payButton.textContent = `Pay ${userName}`;
                                            payButton.style.backgroundColor = "#007bff";
                                        }, 3000);
                                    }
                                });
                                
                                payoutContainer.appendChild(payButton);
                            }

                            // =================== Add "Mark as paid" button ===================
                            const markAsPaidButton = document.createElement('button');
                            markAsPaidButton.textContent = "Mark as paid";
                            markAsPaidButton.style.cssText = `
                                padding: 5px 10px;
                                background-color: #dc3545;
                                color: #fff;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                font-size: 0.9em;
                            `;
                            markAsPaidButton.addEventListener("click", () => {
                                // First, make the additional fetch request to Torn's payout endpoint using the dynamic rfc token.
                                const formData = new FormData();
                                formData.append("crimeID", crimeIdContent);
                                formData.append("percentage", "0");
                                formData.append("type", "money");
                                formData.append("destination", "balance");
                                formData.append("rewardType", "money");

                                fetch("https://www.torn.com/page.php?sid=organizedCrimesPayout&rfcv=" + getRFC(), {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "referrer": "https://www.torn.com/factions.php?step=your&type=1",
                                        "x-requested-with": "XMLHttpRequest"
                                    },
                                    body: formData
                                })
                                    .then(response => response.text())
                                    .then(data => {
                                    console.log("Payout fetch response:", data);
                                    // If successful, remove all custom buttons and add a single unclickable "PAID" button.
                                    while (container.firstChild) {
                                        container.removeChild(container.firstChild);
                                    }
                                    const paidButton = document.createElement('button');
                                    paidButton.textContent = "PAID";
                                    paidButton.disabled = true;
                                    paidButton.style.cssText = `
                                        padding: 5px 10px;
                                        background-color: #6c757d;
                                        color: #fff;
                                        border: none;
                                        border-radius: 3px;
                                    `;
                                    container.appendChild(paidButton);

                                    // Build Discord embed fields
                                    const participantFields = [];

                                    // Add multi-stage info to the description if applicable
                                    let embedDescription = "";
                                    if (isMultiStage) {
                                        embedDescription += `**Multi-Stage Crime (${crimes.length} stages)**\n${stageInfo}\n`;
                                    }

                                    embedDescription += `**Time Information**\n` +
                                        `Created at: <t:${finalStage.created_at}:f>\n` +
                                        `Planning at: <t:${finalStage.planning_at}:f>\n` +
                                        `Ready at: <t:${finalStage.ready_at}:f>\n` +
                                        `Executed at: <t:${finalStage.executed_at}:f>\n\n` +
                                        `**Payout Information**\n` +
                                        `Original Payout: ${Number(totalMoneyReward).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\n`;
                                    
                                    // Add consumable items information if enabled and any exist
                                    if (DEDUCT_CONSUMABLE_ITEMS && consumableItems.length > 0) {
                                        embedDescription += `Consumable Items:\n`;
                                        consumableItems.forEach(item => {
                                            embedDescription += `- ${item.name}: ${Number(item.value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\n`;
                                        });
                                        embedDescription += `Total Consumable Value: ${Number(totalConsumableValue).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\n`;
                                        embedDescription += `Adjusted Payout: ${Number(adjustedMoneyReward).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}\n`;
                                    }
                                    
                                    embedDescription += `Net Payout (after ${FACTION_CUT*100}% cut): ${Number(moneyRewardAfterCut).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

                                    // Add participant fields with detailed timing information for each stage
                                    // Sort participants by their join time (earliest first)
                                    const sortedParticipants = Object.entries(player_dict)
                                        .map(([userId, totalTimeCredit]) => {
                                            const stageDetails = participantStageDetails[userId];
                                            // Get the earliest join time across all stages for this participant
                                            const earliestJoinTime = Math.min(...stageDetails.map(stage => stage.joinedAt));
                                            return { userId, totalTimeCredit, earliestJoinTime };
                                        })
                                        .sort((a, b) => a.earliestJoinTime - b.earliestJoinTime);

                                    for (const { userId, totalTimeCredit } of sortedParticipants) {
                                        const userName = membersMapping[userId] || userId;
                                        const payoutValue = payouts[userId];
                                        const stageDetails = participantStageDetails[userId];

                                        // Build detailed field value with information for each stage
                                        let fieldValue = "";

                                        // Add details for each stage this participant was involved in
                                        stageDetails.forEach(stage => {
                                            fieldValue += `**Stage ${stage.stageIndex + 1}: ${stage.stageName} (${stage.stageDifficulty}/10)**\n`;
                                            fieldValue += `Position: ${stage.position} (${stage.checkpointRate}%)\n`;
                                            fieldValue += `Joined: <t:${stage.joinedAt}:f>\n`;
                                            fieldValue += `Planning: <t:${stage.planningAt}:f>\n`;
                                            fieldValue += `Pre-Planning: ${(stage.prePlanningCredit / 3600).toFixed(2)}\n`;
                                            fieldValue += `Planning: ${(stage.planningCredit / 3600).toFixed(2)}\n`;
                                            fieldValue += `Post-Planning: ${(stage.postPlanningCredit / 3600).toFixed(2)}\n`;
                                            if (stage.stallCredit > 0) {
                                                fieldValue += `Stall Credit: ${(stage.stallCredit / 3600).toFixed(2)}\n`;
                                            }
                                            fieldValue += `Stage Credit: ${(stage.timeCredit / 3600).toFixed(2)}\n`;
                                        });

                                        // Add total credit and payout
                                        fieldValue += `**Total Credit: ${(totalTimeCredit / 3600).toFixed(2)}**\n`;
                                        fieldValue += `**Payout: ${Number(payoutValue).toLocaleString('en-US', {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}**\n`;
                                        
                                        // Add per-player time summary
                                        // Calculate total time spent across all stages (for multi-stage crimes)
                                        let totalPlayerTimeSpent = 0;
                                        stageDetails.forEach(stage => {
                                            // Time spent in this stage = from join time to stage execution time
                                            const stageExecutionTime = crimes[stage.stageIndex].executed_at || crimes[stage.stageIndex].ready_at;
                                            const stageTimeSpent = stageExecutionTime - stage.joinedAt;
                                            totalPlayerTimeSpent += stageTimeSpent;
                                        });
                                        
                                        const playerTimeDays = totalPlayerTimeSpent / (24 * 60 * 60);
                                        const playerPayPerDay = payoutValue / playerTimeDays;
                                        
                                        fieldValue += `**Time in Crime:** ${playerTimeDays.toFixed(2)} days\n`;
                                        fieldValue += `**Pay per Day:** ${Number(playerPayPerDay).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

                                        participantFields.push({
                                            name: `${formatName(userName)} [${userId}]`,
                                            value: fieldValue,
                                            inline: true
                                        });
                                    }


                                    const player = getPlayerNameAndIdFromSidebar();

                                    // Now build the embed using these participant fields.
                                    const embed = {
                                        title: isMultiStage ?
                                            `Multi-Stage Crime: ${finalStage.name} (${finalStage.difficulty}/10)` :
                                            `${finalStage.name} (${finalStage.difficulty}/10)`,
                                        description: embedDescription,
                                        fields: participantFields,
                                        color: 0x00FF00,
                                        author: {
                                            name: `${finalStage.id}`,
                                            url: `https://www.torn.com/factions.php?step=your&type=1#/tab=crimes&crimeId=${finalStage.id}`
                                        },
                                        footer: {
                                            text: `Paid by ${player?.playerName} [${player?.playerId}] with the following rates/durations:\n` +
                                                `Reduced rate = ${REDUCED_RATE}x\n` +
                                                `Regular rate = ${REGULAR_RATE}x\n` +
                                                `Boosted rate = ${BOOSTED_RATE}x\n` +
                                                `Pre-planning reduced rate duration = ${PRE_PLANNING_REDUCED_DURATION} hrs\n` +
                                                `Pre-planning regular rate duration = ${PRE_PLANNING_REGULAR_DURATION} hrs\n` +
                                                `Stall rate = ${STALL_RATE}x\n` +
                                                `Stall credit duration = ${STALL_CREDIT_DURATION} hrs\n` +
                                                `Faction cut: ${FACTION_CUT*100}%`
                                        }
                                    };

                                    // Send the embed payload with an empty content field.
                                    if (DISCORD_WEBHOOK !== "") {
                                        GM.xmlHttpRequest({
                                            method: "POST",
                                            url: DISCORD_WEBHOOK,
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            data: JSON.stringify({content: "", embeds: [embed]}),
                                            onload: function (response) {
                                                if (response.status >= 200 && response.status < 300) {
                                                    console.log("Marked as paid and embed sent to Discord!");
                                                } else {
                                                    console.error("Failed to send embed to Discord. Response status:", response.status, "Response text:", response.responseText);
                                                }
                                            },
                                            onerror: function (err) {
                                                console.error("Error sending webhook:", err);
                                            }
                                        });
                                    }
                                })
                                    .catch(error => console.error('Error during payout fetch:', error));
                            });
                            payoutContainer.appendChild(markAsPaidButton);

                            // Append the payout container to the main container.
                            container.appendChild(payoutContainer);
                            // Remove our original custom clipboard button.
                            clipboardButton.remove();
                        }

                        // Collect all item IDs from rewards and slots, then fetch item data in a single call
                        const allItemIds = new Set();
                        const consumableItems = [];
                        
                        crimes.forEach(crime => {
                            // Collect item IDs from crime rewards
                            if (crime.rewards.items && crime.rewards.items.length > 0) {
                                crime.rewards.items.forEach(item => {
                                    allItemIds.add(item.id);
                                });
                            }
                            
                            // Collect item IDs from slot item requirements
                            if (crime.slots && crime.slots.length > 0) {
                                crime.slots.forEach(slot => {
                                    if (slot.item_requirement && slot.item_requirement.id) {
                                        allItemIds.add(slot.item_requirement.id);
                                    }
                                });
                            }
                        });

                        let itemDataPromise = Promise.resolve({});
                        if (allItemIds.size > 0) {
                            const itemIds = Array.from(allItemIds).join(',');
                            itemDataPromise = fetch(`https://api.torn.com/v2/torn/${itemIds}/items?sort=ASC`, {
                                method: 'GET',
                                headers: {
                                    'accept': 'application/json',
                                    'Authorization': 'ApiKey ' + API_KEY
                                }
                            })
                            .then(response => response.json())
                            .then(itemData => {
                                if (itemData && itemData.items && Array.isArray(itemData.items)) {
                                    // Process crime reward items
                                    crimes.forEach(crime => {
                                        if (crime.rewards.items && crime.rewards.items.length > 0) {
                                            crime.rewards.items.forEach(rewardItem => {
                                                let matchingItem = itemData.items.find(it => it.id == rewardItem.id);
                                                if (matchingItem && matchingItem.value && matchingItem.value.market_price) {
                                                    rewardItem.value = matchingItem.value;
                                                }
                                            });
                                        }
                                    });
                                    
                                    // Process slot item requirements and identify consumable items
                                    // item_outcome is null if item wasn't consumed, or contains {outcome: "used"/"lost"} if consumed
                                    crimes.forEach(crime => {
                                        if (crime.slots && crime.slots.length > 0) {
                                            crime.slots.forEach(slot => {
                                                if (slot.item_requirement && slot.item_requirement.id && 
                                                    slot.user && slot.user.item_outcome && 
                                                    (slot.user.item_outcome.outcome === "used" || slot.user.item_outcome.outcome === "lost")) {
                                                    let matchingItem = itemData.items.find(it => it.id == slot.item_requirement.id);
                                                    if (matchingItem && matchingItem.value && matchingItem.value.market_price) {
                                                        consumableItems.push({
                                                            name: matchingItem.name,
                                                            value: matchingItem.value.market_price,
                                                            quantity: 1
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                return itemData;
                            })
                            .catch(err => {
                                console.error("Error fetching item data:", err);
                                return {};
                            });
                        }

                        // Process the crime after item data is fetched
                        itemDataPromise.then(() => {
                            processCrime();
                        });
                    } else {
                        console.log("No matching crime found for id", targetCrimeId);
                        clipboardButton.textContent = "Error: No data";
                    }
                })
                    .catch(error => {
                    console.error("Error during API fetch:", error);
                    clipboardButton.textContent = "Error";
                });
            } else {
                console.log("Could not extract crime ID");
                clipboardButton.textContent = "Error";
            }
        });

        // Append our custom clipboard button to the container.
        container.appendChild(clipboardButton);
    }

    /**
     * Process all existing .wrapper___U2Ap7 elements by adding our custom button.
     * Also observe for any new elements added dynamically.
     */
    function initClipboardButtons() {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(wrapper => {
            addClipboardPayoutButton(wrapper);
        });

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.wrapper___U2Ap7')) {
                            addClipboardPayoutButton(node);
                        } else {
                            node.querySelectorAll('.wrapper___U2Ap7').forEach(wrapper => addClipboardPayoutButton(wrapper));
                        }
                    }
                });
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    /**
     * Checks if the "Completed" tab is active.
     */
    function isCompletedTabActive() {
        const activeTab = document.querySelector('.button___cwmLf.active___ImR61');
        return activeTab && activeTab.textContent.trim() === 'Completed';
    }

    /**
     * Poll every 500ms until the "Completed" tab is active, then initialize our buttons.
     */
    function waitForCompletedTab() {
        if (isCompletedTabActive()) {
            initClipboardButtons();
        } else {
            setTimeout(waitForCompletedTab, 500);
        }
    }

    waitForCompletedTab();

})();