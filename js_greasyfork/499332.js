// ==UserScript==
// @name         NameMC PvP Tiers Display
// @namespace    https://github.com/AlphaLeoli/NameMC-PvP-Tiers
// @version      2.1.0
// @description  Display a person's pvp tier from mctiers.com on their namemc profile
// @author       AlphaLeoli
// @license      CC-BY-NC-SA
// @match        *://namemc.com/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namemc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499332/NameMC%20PvP%20Tiers%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/499332/NameMC%20PvP%20Tiers%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const settings = {
        // Peak Settings
        showPeak: true, // Shows the peak tier to the right of the tier
        peakPrefix: `(peaked `, // The text before the peak tier
        peakSuffix: `)`, // The text afterr the peak tier
        showDuplicates: false, // Whether or not to show the peak tier if the peak tier is the same as the current tier

        // Tier Names
        showIcons: true, // Show the tier icons next to the tier name
        sword: `Sword`,
        axe: `Axe`,
        uhc: `UHC`,
        netherPot: `NethPot`,
        vanilla: `Crystal`,
        smp: `SMP`,
        pot: `Pot`,

        // Badges
        showBadges: true, // Show badges next to someones name
        showRating: true, // Show player's overall rating next to their name
        ratingIcon: true, // Display the trophy icon (and show the rating when you hover over it)
        retiredBadge: true, // Show the purple trophy (and show the retired gamemodes when you hover over it)

        // Tier Lists
        mctiers: true // show the mctiers.com tierlist ranks. changing this won't do anything yet.
        //not yet added any other tierlists. dm @alphaleoli on discord to make a suggestion.
    }

    var style = document.createElement('style');
    style.type = 'text/css';

    style.innerHTML = `
        #gamemode {
            display: flex;
            align-items: center;
            position: relative;
        }
        .col-auto h1.text-nowrap {
            display: flex;
            align-items: center;
            position: relative;
        }
        #gamemode img {
            margin-right: 5px;
        }
        .col-auto h1.text-nowrap img {
            margin-left: 10px;
        }
    `;

    document.head.appendChild(style);

    // Function to format the date
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Function to calculate time difference in days or years
    function calculateTimeDifference(timestamp) {
        const now = new Date();
        const date = new Date(timestamp * 1000);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / 86400000);
        const diffYears = Math.abs(now.getFullYear() - date.getFullYear());

        if (diffDays >= 365) {
            return `~${diffYears}y`;
        } else {
            return `${diffDays}d`;
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Select the div to be replaced
        var targetDiv = document.querySelector('div[style="max-width: 580px; min-height: 216px; margin: auto"]');

        var gamemodes = {
            uhc: {
                label: settings.uhc
            },
            pot: {
                label: settings.pot
            },
            vanilla: {
                label: settings.vanilla
            },
            neth_pot: {
                label: settings.netherPot
            },
            sword: {
                label: settings.sword
            },
            smp: {
                label: settings.smp
            },
            axe: {
                label: settings.axe
            }
        };

        // Get the UUID from the select element
        var uuidSelect = document.getElementById('uuid-select');
        if (uuidSelect) {
            var selectedOption = uuidSelect.options[uuidSelect.selectedIndex];
            var uuidText = selectedOption.textContent.trim(); // Get the displayed text of the selected option
            var uuid = uuidText.replace(/-/g, '');
            console.log(`Fetched UUID: ${uuid}`);

            // Fetch the PvP tier data
            fetch(`https://mctiers.com/api/profile/${uuid}`)
                .then(response => {
                    if (!response.ok) {
                        console.error(`Error: ${response.status} ${response.statusText}`);
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('API Data:', data);
                    if (targetDiv) {
                        // Create the new div
                        var newDiv = document.createElement('div');
                        newDiv.className = 'card mb-3';
                        newDiv.innerHTML = `
                            <div class="card-header py-1">
                              <strong>PvP Tiers</strong>
                            </div>
                            <div class="card-body px-0 py-1" style="max-height: 182px; overflow: auto">
                              <table class="table table-borderless mb-0">
                                <tbody>
                                </tbody>
                              </table>
                            </div>
                        `;
                        var nameHeader = document.querySelector('div.col-auto h1.text-nowrap');
                        // Rating Badge
                        if (settings.showRating) {
                            if (settings.ratingIcon) {
                                nameHeader.innerHTML += ` <img src = https://mctiers.com/assets/overall-ca77dd12.svg width="48px" height="48px" style="vertical-align: middle;" title="Ranked #${data.overall} Overall">`
                            } else {
                                nameHeader.innerHTML += ` <span>#${data.overall}</span>`;
                            }
                        }
                        // Retired Badge
                        if (settings.retiredBadge) {
                            // var retiredGamemodes = 0;
                            var retiredList = `Retired in `;
                            var retired = false;
                            for (const [key, value] of Object.entries(data.rankings)) {
                                if (value.retired) {
                                    if (!retired) {
                                        retiredList += `${gamemodes[key].label}`;
                                        retired = true;
                                    } else {
                                        retiredList += `, ${gamemodes[key].label}`;
                                    }
                                }
                            }
                            if (retired) {
                                nameHeader.innerHTML += ` <img src = https://mctiers.com/assets/retired-11f4ccb4.svg width="48px" height="48px" style="vertical-align: middle;" title="${retiredList}">`
                            }
                        }
                        // Other Badges
                        if (nameHeader && settings.showBadges) {
                            var holdingTheCrown;
                            for (const [key, value] of Object.entries(data.badges)) {
                                switch (value.title) {
                                    case `Adventurous`:
                                        nameHeader.innerHTML += ` <img src = https://mctiers.com/assets/adventurous-81202832.svg width="48px" height="48px" style="vertical-align: middle;" title="${value.desc}">`;
                                    case `Holding The Crown`:
                                        if (!holdingTheCrown) {
                                            nameHeader.innerHTML += ` <img src = https://mctiers.com/assets/holding_the_crown-cb7b5717.svg width="48px" height="48px" style="vertical-align: middle;" title="${value.desc}">`;
                                            holdingTheCrown = true;
                                        }
                                }
                            }
                        }

                        var tbody = newDiv.querySelector('tbody');
                        // Check if there are any rankings
                        if (data.rankings && Object.keys(data.rankings).length > 0) {
                            // Add rows for each ranking
                            for (const [key, value] of Object.entries(data.rankings)) {
                                var gamemode = gamemodes[key] ? gamemodes[key].label : key;

                                var tier = value.tier;
                                var pos = value.pos;
                                var peakTier = value.peak_tier;
                                var peakPos = value.peak_pos;
                                var ranking = `T${tier}`;
                                var peakRanking = `T${peakTier}`;
                                if (pos === 0) {
                                    ranking = `H${ranking}`;
                                } else {
                                    ranking = `L${ranking}`;
                                }
                                if (peakPos === 0) {
                                    peakRanking = `H${peakRanking}`;
                                } else {
                                    peakRanking = `L${peakRanking}`;
                                }
                                if (peakRanking === ranking && !settings.showDuplicates) {
                                    peakRanking = ``;
                                } else {
                                    peakRanking = `${settings.peakPrefix}${peakRanking}${settings.peakSuffix}`;
                                }
                                if (value.retired) {
                                    ranking = `R${ranking}`;
                                }
                                var attainedDate = formatDate(value.attained);
                                var timeSince = calculateTimeDifference(value.attained);
                                var namemcDate = attainedDate.replace(/,/g, ' •');
                                if (!settings.showPeak) {
                                    peakRanking = ``;
                                }
                                if (settings.mctiers) {
                                    var mctiersList = ``;
                                }

                                var icon;
                                if (settings.showIcons) {
                                    switch (key) {
                                        case `sword`:
                                            icon = `https://mctiers.com/assets/sword-9023278f.svg`;
                                            break;
                                        case `uhc`:
                                            icon = `https://mctiers.com/assets/uhc-05be850e.svg`;
                                            break;
                                        case `axe`:
                                            icon = `https://mctiers.com/assets/axe-09fbd7d8.svg`;
                                            break;
                                        case `neth_pot`:
                                            icon = `https://mctiers.com/assets/neth_pot-07e18fb6.svg`;
                                            break;
                                        case `pot`:
                                            icon = `https://mctiers.com/assets/pot-5ade81ba.svg`;
                                            break;
                                        case `vanilla`:
                                            icon = `https://mctiers.com/assets/vanilla-38455c89.svg`;
                                            break;
                                        case `smp`:
                                            icon = `https://mctiers.com/assets/smp-72ce94df.svg`;
                                            break;
                                        default:
                                            icon = `https://mctiers.com/assets/restricted-c3913674.svg`;
                                    }
                                }
                                icon = `<img src = ${icon} height="16px" width="16px" style="vertical-align: middle;">`;
                                var row = `
                                    <tr>
                                        <td width="35%" class="text-start fw-bold" id="gamemode">
                                            ${icon}
                                            ${gamemode}
                                        </td>
                                        <td width="100%" class="text-nowrap">${ranking} ${peakRanking}</td>
                                        <td width="20%" class="d-none d-lg-table-cell text-end text-nowrap pe-0"><time>${namemcDate}</time></td>
                                        <td class="d-none d-lg-table-cell" colspan="2"></td>
                                        <td width="20%" class="d-none d-lg-table-cell text-end text-nowrap pe-0"><time>${timeSince}</time></td>
                                        <td class="text-end text-nowrap px-0"></td>
                                        <!-- <td class="text-end text-nowrap ps-0">
                                          <a class="copy-button px-1" href="javascript:void(0)" data-clipboard-text="${ranking}" onclick="return false">Copy</a>
                                        </td> -->
                                    </tr>
                                    <tr class="d-lg-none border-bottom">
                                        <td colspan="3">
                                          <time>asdfasdf ${attainedDate} • ${ranking}</time>
                                        </td>
                                    </tr>
                                `;

                                tbody.innerHTML += row;
                            }
                        } else {
                            // Default to "Unranked" if no rankings found
                            tbody.innerHTML = `
                                <tr>
                                    <td class="text-start fw-bold">Unranked</td>
                                </tr>
                            `;
                        }

                        // Replace the old div with the new div
                        targetDiv.parentNode.replaceChild(newDiv, targetDiv);
                    }
                })
                .catch(error => {
                    console.error('Error fetching PvP tier data:', error);
                    // If error occurs, replace with "Unranked"
                    if (targetDiv) {
                        var newDiv = document.createElement('div');
                        newDiv.className = 'card mb-3';
                        newDiv.innerHTML = `
                            <div class="card-header py-1">
                              <strong>PvP Tiers</strong>
                            </div>
                            <div class="card-body px-0 py-1" style="max-height: 134px; overflow: auto">
                              <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td class="text-start fw-bold">Unranked</td>
                                    </tr>
                                </tbody>
                              </table>
                            </div>
                        `;

                        targetDiv.parentNode.replaceChild(newDiv, targetDiv);
                    }
                });
        } else {
            console.error('UUID select element not found');
        }
    });
})();
