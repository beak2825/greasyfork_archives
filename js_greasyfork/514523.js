// ==UserScript==
// @name         Tribal Wars Battle Report Production Calculator
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Calculates total resource production from battle report spy information
// @author       ricardofauch
// @match        https://*.die-staemme.de/game.php?village=*&screen=report&*
// @match        https://*.die-staemme.de/game.php?village=*&screen=report*
// @match        https://*.die-staemme.de/game.php?screen=report&*
// @match        https://*.die-staemme.de/game.php?village=*&screen=place*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514523/Tribal%20Wars%20Battle%20Report%20Production%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/514523/Tribal%20Wars%20Battle%20Report%20Production%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug configuration
    const DEBUG = true;

    // Debug logger function
    function log(message, data = null) {
        if (!DEBUG) return;
        const prefix = '[Production Calculator]';
        if (data) {
            console.log(prefix, message, data);
        } else {
            console.log(prefix, message);
        }
    }

    let SettingsHelper = {
        configConf: null,
        loadSettings() {
            log('Loading settings...');
            var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
            var path = "config_settings_" + win.game_data.world;
            log('Settings path:', path);

            if (win.localStorage.getItem(path) == null) {
                log('Settings not found in localStorage, fetching from server...');
                var oRequest = new XMLHttpRequest();
                var sURL = 'https://' + window.location.hostname + '/interface.php?func=get_config';
                log('Fetching config from URL:', sURL);
                oRequest.open('GET', sURL, 0);
                oRequest.send(null);
                if (oRequest.status != 200) {
                    log('Error fetching config! Status:', oRequest.status);
                    throw "Error executing XMLHttpRequest call to get Config! " + oRequest.status;
                }
                const config = this.xmlToJson(oRequest.responseXML).config;
                log('Received config from server:', config);
                win.localStorage.setItem(path, JSON.stringify(config));
            }
            const settings = JSON.parse(win.localStorage.getItem(path));
            log('Loaded settings:', settings);
            return settings;
        },
        xmlToJson(xml) {
            log('Converting XML to JSON...');
            var obj = {};
            if (xml.nodeType == 1) {
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = isNaN(parseFloat(attribute.nodeValue)) ? attribute.nodeValue : parseFloat(attribute.nodeValue);
                    }
                }
            } else if (xml.nodeType == 3) {
                obj = xml.nodeValue;
            }
            if (xml.hasChildNodes() && xml.childNodes.length === [].slice.call(xml.childNodes).filter(function(node) {
                return node.nodeType === 3;
            }).length) {
                obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
                    return text + node.nodeValue;
                }, "");
            } else if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof obj[nodeName] == "undefined") {
                        obj[nodeName] = this.xmlToJson(item);
                    } else {
                        if (typeof obj[nodeName].push == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xmlToJson(item));
                    }
                }
            }
            return obj;
        },
        getConf() {
            log('Getting configuration...');
            if (!this.configConf) {
                log('Config not cached, loading from localStorage...');
                this.configConf = JSON.parse(window.localStorage.getItem('config_settings_' + game_data.world));
                log('Loaded config:', this.configConf);
            }
            return this.configConf;
        },
        checkConfigs() {
            log('Checking configurations...');
            const configConf = this.getConf();
            if (configConf == null) {
                log('No config found, loading settings...');
                SettingsHelper.loadSettings();
            }
        }
    };

    // Initialize based on current screen
    if (window.location.href.includes('screen=place')) {
        handleRallyPoint();
    } else {
        // Normal report page handling with 2 second delay
        window.addEventListener('load', function() {
            log('Page loaded, waiting 2 seconds before processing...');

            setTimeout(() => {
                log('Checking for attack results after delay...');

                if (document.getElementById('attack_results')) {
                    log('Attack results found, calculating production...');
                    calculateProduction();
                } else {
                    log('No attack results found on this page');
                }
            }, 200); // 2000ms = 2 seconds
        });
    }


    function calculateTimeDifferenceHours() {
        const now = new Date();
        const fightTimeText = document.evaluate(
            "//td[contains(text(), 'Kampfzeit')]/following-sibling::td",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue.textContent.trim();

        log('Fight time text:', fightTimeText);

        // Parse the fight time
        const [datePart, timePart] = fightTimeText.split(' ');
        const [day, month, year] = datePart.split('.');
        const [hours, minutes, seconds] = timePart.split(':');
        const fightTime = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day),
                                 parseInt(hours), parseInt(minutes), parseInt(seconds));

        log('Parsed fight time:', fightTime);
        log('Current time:', now);

        // Calculate difference in hours
        const diffHours = (now - fightTime) / (1000 * 60 * 60);
        log('Time difference in hours:', diffHours);

        return diffHours;
    }

    function extractSpiedResources() {
        const resourcesRow = document.querySelector('#attack_spy_resources td');
        if (!resourcesRow) {
            log('No spied resources found');
            return null;
        }

        const resources = {
            wood: 0,
            stone: 0,
            iron: 0
        };

        const amounts = resourcesRow.textContent.match(/\d+(?:\.\d+)?/g);
        if (amounts && amounts.length >= 3) {
            resources.wood = parseInt(amounts[0].replace('.', ''));
            resources.stone = parseInt(amounts[1].replace('.', ''));
            resources.iron = parseInt(amounts[2].replace('.', ''));
        }

        log('Extracted spied resources:', resources);
        return resources;
    }

    function extractMyVillageCoords() {
        const coordCell = document.querySelector('td.box-item b.nowrap');
        if (!coordCell) {
            log('Could not find village coordinates cell');
            return null;
        }

        const coordMatch = coordCell.textContent.match(/\((\d+)\|(\d+)\)/);
        if (!coordMatch) {
            log('Could not extract coordinates from:', coordCell.textContent);
            return null;
        }

        return {
            x: parseInt(coordMatch[1]),
            y: parseInt(coordMatch[2])
        };
    }

    function calculateDistance(source, target) {
        return Math.sqrt(
            Math.pow(source.x - target.x, 2) +
            Math.pow(source.y - target.y, 2)
        );
    }

    function calculateTravelTimeHours(distance) {
        const MINUTES_PER_FIELD = 10;
        return (distance * MINUTES_PER_FIELD) / 60; // Convert to hours
    }

    function calculateExpectedResources(hourlyProduction, spiedResources, hoursSinceSpy, travelTimeHours) {
        const totalHours = hoursSinceSpy + travelTimeHours;

        if (DEBUG) {
            console.log('[Production Calculator] Hours since spy:', hoursSinceSpy);
            console.log('[Production Calculator] Travel time hours:', travelTimeHours);
            console.log('[Production Calculator] Total hours for calculation:', totalHours);
        }

        const expected = {
            wood: Math.floor(spiedResources.wood + (hourlyProduction.wood * totalHours)),
            stone: Math.floor(spiedResources.stone + (hourlyProduction.stone * totalHours)),
            iron: Math.floor(spiedResources.iron + (hourlyProduction.iron * totalHours))
        };

        if (DEBUG) {
            console.log('[Production Calculator] Expected resources:', expected);
        }

        return expected;
    }


    function calculateNeededLightCavalry(totalResources) {
    const LIGHT_CAVALRY_CAPACITY = 80;
    const TARGET_PERCENTAGE = 0.9; // 100%
    const targetResources = Math.floor(totalResources * TARGET_PERCENTAGE);

    if (DEBUG) {
        console.log('[Production Calculator] Total resources:', totalResources);
        console.log('[Production Calculator] Target resources (90%):', targetResources);
        console.log('[Production Calculator] LC needed:', Math.ceil(targetResources / LIGHT_CAVALRY_CAPACITY));
    }

    return Math.ceil(targetResources / LIGHT_CAVALRY_CAPACITY);
}


    function extractTargetCoordinates() {
        // Find the target village link
        const targetCell = document.evaluate(
            "//td[contains(text(), 'Ziel:')]/following-sibling::td//a[contains(@href, 'screen=info_village')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (!targetCell) {
            log('Target cell not found');
            return null;
        }

        // Get the village ID for the place screen
        const villageIdMatch = targetCell.href.match(/id=(\d+)/);
        const villageId = villageIdMatch ? villageIdMatch[1] : null;

        // Extract coordinates
        const coordMatch = targetCell.textContent.match(/\((\d+)\|(\d+)\)/);
        if (!coordMatch) {
            log('No coordinates found in target cell');
            return null;
        }

        const coordinates = {
            x: parseInt(coordMatch[1]),
            y: parseInt(coordMatch[2]),
            id: villageId
        };

        log('Extracted coordinates and village ID:', coordinates);
        return coordinates;
    }

    function handleRallyPoint() {
        const pendingAttack = localStorage.getItem('pendingAttack');
        if (pendingAttack) {
            const attack = JSON.parse(pendingAttack);

            const scriptContent = `
                (function() {
                    // Define settings globally
                    window.settings = [...${JSON.stringify(attack.troops)}, ${attack.coordinates.x}, ${attack.coordinates.y}];

                    $(document).ready(function() {
                        try {
                            // Register script
                            if (window.ScriptAPI) {
                                window.ScriptAPI.register('Scriptgenerator - Truppen im Versammlungsplatz einfügen', true, 'tomabrafix', 'support-nur-im-forum@die-staemme.de');
                            }

                            var scriptgenerator = {
                                replace_all: function(unit) {
                                    var all = $('#unit_input_'+unit).next().text().match(/\\d+/);
                                    return all;
                                },
                                main: function() {
                                    var units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
                                    for(var i = 0; i <= units.length; i++) {
                                        if($('#unit_input_'+units[i]).length == 0) {
                                            continue;
                                        }
                                        var anzahl = this.replace_all(units[i]);
                                        if(window.settings[i] < 0) {
                                            var dif = Number(anzahl) + Number(window.settings[i]);
                                            anzahl = dif < 0 ? 0 : dif;
                                        } else if (window.settings[i] > 0) {
                                            anzahl = window.settings[i];
                                        }
                                        if (window.settings[i] !== 0) {
                                            $('#unit_input_'+units[i]).val(anzahl);
                                        }
                                    }
                                    if(window.settings[12] != 'none') {
                                        $('#inputx').val(window.settings[12]);
                                        $('#inputy').val(window.settings[13]);
                                    }
                                }
                            };

                            // Execute main and set up auto-confirmation
                            scriptgenerator.main();

                            // Schedule the first attack button click
                            setTimeout(() => {
                                const attackButton = document.getElementById('target_attack');
                                if (attackButton) {
                                    attackButton.click();
                                    console.log('Clicked first attack button');

                                    // After clicking the first button, we need to wait for the new page and confirm button
                                    // Store flag in localStorage to indicate we need to click confirm
                                    localStorage.setItem('needsConfirm', 'true');
                                } else {
                                    console.log('Attack button not found');
                                }
                            }, 331);

                        } catch(e) {
                            console.error('Script execution error:', e);
                        }
                    });
                })();
            `;

            // Create and inject the script
            const script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);

            // Clear the pending attack
            localStorage.removeItem('pendingAttack');
        }

        // Check if we need to click the confirm button (on the confirmation page)
        const needsConfirm = localStorage.getItem('needsConfirm');
        if (needsConfirm === 'true') {
            const confirmScript = `
                (function() {
                    $(document).ready(function() {
                        setTimeout(() => {
                            const confirmButton = document.getElementById('troop_confirm_submit');
                            if (confirmButton) {
                                confirmButton.click();
                                console.log('Clicked confirm button');
                            } else {
                                console.log('Confirm button not found');
                            }
                            localStorage.removeItem('needsConfirm');
                        }, 212);
                    });
                })();
            `;

            const confirmScriptElement = document.createElement('script');
            confirmScriptElement.textContent = confirmScript;
            document.head.appendChild(confirmScriptElement);
        }
    }

    // Function to create the attack button with auto-confirm flag
    function createAttackButton(coordinates, lcAmount) {
        const button = document.createElement('button');
        button.className = 'btn';
        button.style.marginTop = '5px';
        button.textContent = `Send ${lcAmount} LC to (${coordinates.x}|${coordinates.y})`;

        button.onclick = function() {
            if (!confirm(`Are you sure you want to send ${lcAmount} LC to (${coordinates.x}|${coordinates.y})?`)) {
                return;
            }

            const targetParam = coordinates.id ?
                `target=${coordinates.id}` :
                `x=${coordinates.x}&y=${coordinates.y}`;

            const url = `/game.php?village=${game_data.village.id}&screen=place&${targetParam}`;

            localStorage.setItem('pendingAttack', JSON.stringify({
                troops: [0, 0, 0, 0, 1, lcAmount, 0, 0, 0, 0, 0, 0],
                coordinates: {x: coordinates.x, y: coordinates.y}
            }));

            window.location.href = url;
        };

        return button;
    }

    function calculateProduction() {
        log('Starting production calculation...');

        // Initialize settings
        SettingsHelper.checkConfigs();
        const worldConfig = SettingsHelper.getConf();
        const worldspeed = worldConfig.speed;
        const base_production = worldConfig.game.base_production;
        log('World configuration:', { worldspeed, base_production });

        // Get building levels from spy data
        const buildingDataElement = document.getElementById('attack_spy_building_data');
        if (!buildingDataElement) {
            log('Error: Building data element not found!');
            return;
        }

        const buildingData = JSON.parse(buildingDataElement.value);
        log('Building data:', buildingData);

        // Find resource building levels
        let woodLevel = 0;
        let stoneLevel = 0;
        let ironLevel = 0;

        buildingData.forEach(building => {
            switch(building.id) {
                case 'wood':
                    woodLevel = parseInt(building.level);
                    break;
                case 'stone':
                    stoneLevel = parseInt(building.level);
                    break;
                case 'iron':
                    ironLevel = parseInt(building.level);
                    break;
            }
        });

        log('Resource building levels:', { woodLevel, stoneLevel, ironLevel });

        // Calculate base production for each resource
        const woodProduction = Math.round(Math.pow(1.163118, woodLevel - 1) * worldspeed * base_production);
        const stoneProduction = Math.round(Math.pow(1.163118, stoneLevel - 1) * worldspeed * base_production);
        const ironProduction = Math.round(Math.pow(1.163118, ironLevel - 1) * worldspeed * base_production);

        log('Base production calculations:', {
            woodProduction,
            stoneProduction,
            ironProduction
        });

        // Check for resource bonus (bonus village)
        const bonusIcons = document.querySelectorAll('.bonus_icon_1, .bonus_icon_2, .bonus_icon_3, .bonus_icon_8');
        log('Found bonus icons:', bonusIcons.length);

        let finalWoodProduction = woodProduction;
        let finalStoneProduction = stoneProduction;
        let finalIronProduction = ironProduction;

        // Track applied bonuses for debugging
        const appliedBonuses = [];

        bonusIcons.forEach(icon => {
            if (icon.classList.contains('bonus_icon_1')) {
                finalWoodProduction *= 2;
                appliedBonuses.push('2x wood bonus');
            }
            if (icon.classList.contains('bonus_icon_2')) {
                finalStoneProduction *= 2;
                appliedBonuses.push('2x stone bonus');
            }
            if (icon.classList.contains('bonus_icon_3')) {
                finalIronProduction *= 2;
                appliedBonuses.push('2x iron bonus');
            }
            if (icon.classList.contains('bonus_icon_8')) {
                finalWoodProduction = Math.round(finalWoodProduction * 1.3);
                finalStoneProduction = Math.round(finalStoneProduction * 1.3);
                finalIronProduction = Math.round(finalIronProduction * 1.3);
                appliedBonuses.push('30% all resources bonus');
            }
        });

        log('Applied bonuses:', appliedBonuses);
        log('Final production values:', {
            finalWoodProduction,
            finalStoneProduction,
            finalIronProduction
        });

        // Create display element
        const productionDiv = document.createElement('div');
        productionDiv.style.marginBottom = '10px';
        productionDiv.style.padding = '5px';
        productionDiv.style.border = '1px solid #DED3B9';

        productionDiv.innerHTML = `
            <b>Theoretical Resource Production:</b><br>
            <span class="icon header wood"></span> ${formatNumber(finalWoodProduction)} per hour | ${formatNumber(finalWoodProduction * 24)} per day<br>
            <span class="icon header stone"></span> ${formatNumber(finalStoneProduction)} per hour | ${formatNumber(finalStoneProduction * 24)} per day<br>
            <span class="icon header iron"></span> ${formatNumber(finalIronProduction)} per hour | ${formatNumber(finalIronProduction * 24)} per day<br>
            Total: ${formatNumber(finalWoodProduction + finalStoneProduction + finalIronProduction)} per hour | ${formatNumber((finalWoodProduction + finalStoneProduction + finalIronProduction) * 24)} per day
        `;

        log('Created production display element');

        // Insert before attack results table
        const attackResults = document.getElementById('attack_results');
        attackResults.parentNode.insertBefore(productionDiv, attackResults);
        log('Inserted production display into page');

        const hourlyProduction = {
            wood: finalWoodProduction,
            stone: finalStoneProduction,
            iron: finalIronProduction
        };

        // When calculating expected resources:
        const sourceCoords = extractMyVillageCoords();
        const targetCoords = extractTargetCoordinates();

        // Calculate expected resources
        const spiedResources = extractSpiedResources();
        const hoursSinceFight = calculateTimeDifferenceHours();

        if (spiedResources && hoursSinceFight > 0) {
            const sourceCoords = extractMyVillageCoords();
            const targetCoords = extractTargetCoordinates();

            if (sourceCoords && targetCoords) {
                const distance = calculateDistance(sourceCoords, targetCoords);
                const travelTime = calculateTravelTimeHours(distance);

                if (DEBUG) {
                    console.log('[Production Calculator] Source village:', sourceCoords);
                    console.log('[Production Calculator] Target village:', targetCoords);
                    console.log('[Production Calculator] Distance:', distance.toFixed(2), 'fields');
                    console.log('[Production Calculator] Travel time:', (travelTime * 60).toFixed(2), 'minutes');
                }

                const expectedResources = calculateExpectedResources(
                    hourlyProduction,
                    spiedResources,
                    hoursSinceFight,
                    travelTime
                );

                const totalExpectedResources = expectedResources.wood + expectedResources.stone + expectedResources.iron;
                const neededLC = calculateNeededLightCavalry(totalExpectedResources);

                // Update the display
                const estimationDiv = document.createElement('div');
                estimationDiv.style.marginBottom = '10px';
                estimationDiv.style.padding = '5px';
                estimationDiv.style.border = '1px solid #DED3B9';

                estimationDiv.innerHTML = `
            <b>Resource Estimation:</b><br>
            Time since spy: ${formatNumber(hoursSinceFight.toFixed(2))} hours<br>
            Travel time: ${formatNumber((travelTime * 60).toFixed(1))} minutes<br>
            Total time for calculation: ${formatNumber((hoursSinceFight + travelTime).toFixed(2))} hours<br>
            Distance: ${formatNumber(distance.toFixed(1))} fields<br>
            Expected resources on arrival:<br>
            <span class="icon header wood"></span> ${formatNumber(expectedResources.wood)}<br>
            <span class="icon header stone"></span> ${formatNumber(expectedResources.stone)}<br>
            <span class="icon header iron"></span> ${formatNumber(expectedResources.iron)}<br>
            Total: ${formatNumber(expectedResources.wood + expectedResources.stone + expectedResources.iron)}<br>
            Required light cavalry to farm 90%: ${formatNumber(neededLC)}
            (${formatNumber(neededLC * 80)} carry capacity)
        `;

            // Add attack button if coordinates were found
            if (targetCoords) {
                const attackButton = createAttackButton(targetCoords, neededLC);
                estimationDiv.appendChild(attackButton);
            }

            // Insert after production div
            productionDiv.parentNode.insertBefore(estimationDiv, productionDiv.nextSibling);
        }
    }
    }

    function formatNumber(number) {
        return new Intl.NumberFormat().format(Math.round(number));
    }
})();