// ==UserScript==
// @name        Melvor Idle - AutoFarm
// @description Automates farming
// @version     1.5
// @namespace   Visua
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427692/Melvor%20Idle%20-%20AutoFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/427692/Melvor%20Idle%20-%20AutoFarm.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function startAutoFarm() {
        const utils = {
            equipFromBank: function (itemId, quantity = 1) {
                if (!checkBankForItem(itemId)) {
                    return false;
                }
                try {
                    return combatManager.player.equipItem(itemId, combatManager.player.selectedEquipmentSet, 'Default', quantity);
                } catch (e) {
                    console.error('AutoFarm: Error trying to equip item.', e);
                    return false;
                }
            },

            equipSwapState: {
                Ring: {},
                Cape: {},
                Gloves: {},
                Quiver: {},
            },

            equipSwap: function (slotName, itemId) {
                if (this.equipSwapState[slotName].swapped) {
                    return;
                }
                const currentlyEquippedItemId = combatManager.player.equipment.slots[slotName].item.id;
                const currentQuantity = combatManager.player.equipment.slots[slotName].quantity;
                let quantityToEquip = slotName === 'Quiver' ? getBankQty(itemId) : 1;
                if (this.equipFromBank(itemId, quantityToEquip)) {
                    this.equipSwapState[slotName].originalId = currentlyEquippedItemId;
                    this.equipSwapState[slotName].quantity = currentQuantity;
                    this.equipSwapState[slotName].swapped = true;
                }
            },

            equipSwapBack: function (slotName) {
                if (this.equipSwapState[slotName].swapped && (this.equipSwapState[slotName].originalId === -1 ||
                    this.equipFromBank(this.equipSwapState[slotName].originalId, this.equipSwapState[slotName].quantity))) {
                    this.equipSwapState[slotName].originalId = undefined;
                    this.equipSwapState[slotName].swapped = false;
                }
            },
        };

        const id = 'auto-farm';
        const settingsVersion = 2;
        const patchTypes = ['allotments', 'herbs', 'trees'];
        const toPatchType = { ALLOTMENT: patchTypes[0], HERB: patchTypes[1], TREE: patchTypes[2] };
        const priorityTypes = {
            custom: { id: 'custom', description: 'Custom priority', tooltip: 'Drag seeds to change their priority' },
            mastery: {
                id: 'mastery',
                description: 'Highest mastery',
                tooltip: 'Seeds with maxed mastery are excluded<br>Click seeds to disable/enable them',
            },
            replant: { id: 'replant', description: 'Replant', tooltip: 'Lock patches to their current seeds' },
            quantity: {
                id: 'quantity',
                description: 'Lowest quantity',
                tooltip: 'Crops with the lowest quantity in the bank are planted',
            },
        };
        const allSeeds = {
            allotments: [...allotmentSeeds].sort((a, b) => b.level - a.level).map((s) => s.itemID),
            herbs: [...herbSeeds].sort((a, b) => b.level - a.level).map((s) => s.itemID),
            trees: [...treeSeeds].sort((a, b) => b.level - a.level).map((s) => s.itemID),
        };
        const compostShopId = isItemInShop(CONSTANTS.item.Compost);
        let observer;
        let settings = {
            version: settingsVersion,
            disabledSeeds: {},
            swapEquipment: true,
        };
        patchTypes.forEach((patchType) => {
            settings[patchType] = {
                enabled: false,
                priorityType: priorityTypes.custom.id,
                priority: allSeeds[patchType],
                lockedPatches: {},
                useGloop: true,
            };
        });

        function findNextSeed(patch, patchId) {
            // Find next seed in bank according to priority
            const patchType = toPatchType[patch.type];
            const patchTypeSettings = settings[patchType];
            const lockedSeed = patchTypeSettings.lockedPatches[patchId];
            let priority = [];
            if (lockedSeed !== undefined) {
                priority = [lockedSeed];
            } else if (patchTypeSettings.priorityType === priorityTypes.custom.id) {
                priority = patchTypeSettings.priority;
            } else if (patchTypeSettings.priorityType === priorityTypes.mastery.id) {
                priority = allSeeds[patchType]
                    .filter((s) => !settings.disabledSeeds[s] && getSeedMasteryLevel(s) < 99)
                    .sort((a, b) => getSeedMastery(b) - getSeedMastery(a));
            } else if (patchTypeSettings.priorityType === priorityTypes.quantity.id) {
                priority = allSeeds[patchType]
                    .filter((s) => !settings.disabledSeeds[s])
                    .sort((a, b) => getSeedCropQuantity(a) - getSeedCropQuantity(b));
            }

            let nextSeed = -1;
            for (let k = 0; k < priority.length; k++) {
                const seedId = priority[k];
                if (seedId !== -1 && skillLevel[CONSTANTS.skill.Farming] >= items[seedId].farmingLevel) {
                    const bankId = getBankId(seedId);
                    if (bankId !== -1 && bank[bankId].qty >= items[seedId].seedsRequired) {
                        nextSeed = seedId;
                        break;
                    }
                }
            }

            return nextSeed;
        }

        function handlePatch(areaId, patchId) {
            const patch = newFarmingAreas[areaId].patches[patchId];

            if (!settings[toPatchType[patch.type]].enabled || !patch.unlocked || !(patch.hasGrown || !patch.seedID)) {
                // AutoFarm disabled for patch type or patch not unlocked or still growing
                return;
            }

            if (patch.hasGrown) {
                // Harvest
                let grownId = items[patch.seedID].grownItemID;
                let bankId = getBankId(grownId);
                if (bankId === -1 && bank.length >= getMaxBankSpace()) {
                    return;
                }
                harvestSeed(areaId, patchId);
            }

            const nextSeed = findNextSeed(patch, patchId);
            if (nextSeed === -1) {
                // No seeds available
                return;
            }

            if (!patch.gloop) {
                if (settings[toPatchType[patch.type]].useGloop && getBankQty(CONSTANTS.item.Weird_Gloop) > 1) {
                    addGloop(areaId, patchId);
                } else if (
                    getSeedMasteryLevel(nextSeed) < 50 &&
                    getMasteryPoolProgress(CONSTANTS.skill.Farming) < masteryCheckpoints[1]
                ) {
                    if (!playerModifiers.freeCompost) {
                        buyCompost();
                    }
                    addCompost(areaId, patchId, 5);
                }
            }
            selectedPatch = [areaId, patchId];
            selectedSeed = nextSeed;
            plantSeed();
        }

        function autoFarm() {
            let anyPatchReady = false;
            for (let i = 0; i < newFarmingAreas.length; i++) {
                for (let j = 0; j < newFarmingAreas[i].patches.length; j++) {
                    const patch = newFarmingAreas[i].patches[j];
                    if (
                        settings[toPatchType[patch.type]].enabled &&
                        patch.unlocked &&
                        (patch.hasGrown || (!patch.seedID && findNextSeed(patch, j) !== -1))
                    ) {
                        anyPatchReady = true;
                        break;
                    }
                }
            }
            if (anyPatchReady) {
                swapToFarmingEquipment();
                for (let i = 0; i < newFarmingAreas.length; i++) {
                    for (let j = 0; j < newFarmingAreas[i].patches.length; j++) {
                        handlePatch(i, j);
                    }
                }
                swapBackEquipment();
            }

            patchTypes.forEach((patchType) => {
                if (settings[patchType].priorityType === priorityTypes.mastery.id) {
                    orderMasteryPriorityMenu(patchType);
                } else if (settings[patchType].priorityType === priorityTypes.quantity.id) {
                    orderQuantityPriorityMenu(patchType);
                }
            });
        }

        function equipIfNotEquipped(slotName, itemId) {
            if (combatManager.player.equipment.slotMap.has(itemId)) {
                return true;
            }
            if (checkRequirements(items[itemId].equipRequirements) && checkBankForItem(itemId)) {
                utils.equipSwap(slotName, itemId);
                return true;
            }
            return false;
        }

        function swapToFarmingEquipment() {
            if (!settings.swapEquipment) {
                return;
            }

            equipIfNotEquipped('Ring', CONSTANTS.item.Aorpheats_Signet_Ring);
            equipIfNotEquipped('Cape', CONSTANTS.item.Cape_of_Completion) ||
                equipIfNotEquipped('Cape', CONSTANTS.item.Max_Skillcape) ||
                equipIfNotEquipped('Cape', CONSTANTS.item.Farming_Skillcape);
            equipIfNotEquipped('Gloves', CONSTANTS.item.Bobs_Gloves);
            equipIfNotEquipped('Quiver', CONSTANTS.item.Seed_Pouch);
        }

        function swapBackEquipment() {
            if (!settings.swapEquipment) {
                return;
            }

            Object.keys(utils.equipSwapState).forEach(slot => utils.equipSwapBack(slot));
        }

        function buyCompost() {
            const qty = getBankQty(CONSTANTS.item.Compost);
            if (qty < 5) {
                buyQty = 5 - qty;
                if (gp > buyQty * items[CONSTANTS.item.Compost].buysFor) {
                    buyShopItem(Object.keys(SHOP)[compostShopId[0]], compostShopId[1], true);
                }
            }
        }

        function getSeedMastery(seedId) {
            return MASTERY[CONSTANTS.skill.Farming].xp[items[seedId].masteryID[1]];
        }

        function getSeedCropQuantity(seedId) {
            return getBankQty(items[seedId].grownItemID);
        }

        function getSeedMasteryLevel(seedId) {
            return getMasteryLevel(CONSTANTS.skill.Farming, items[seedId].masteryID[1]);
        }

        function orderMasteryPriorityMenu(patchType) {
            const menu = $(`#${id}-${patchType}-prioritysettings-mastery`);
            menu.children()
                .toArray()
                .filter((e) => getSeedMasteryLevel($(e).data('seed-id')) >= 99)
                .forEach((e) => $(e).remove());
            const sortedMenuItems = menu
                .children()
                .toArray()
                .sort((a, b) => getSeedMastery($(b).data('seed-id')) - getSeedMastery($(a).data('seed-id')));
            menu.append(sortedMenuItems);
        }

        function orderQuantityPriorityMenu(patchType) {
            const menu = $(`#${id}-${patchType}-prioritysettings-quantity`);
            const sortedMenuItems = menu
                .children()
                .toArray()
                .sort((a, b) => getSeedCropQuantity($(a).data('seed-id')) - getSeedCropQuantity($(b).data('seed-id')));
            menu.append(sortedMenuItems);
        }

        function injectGUI() {
            if ($(`#${id}`).length) {
                return;
            }

            const disabledOpacity = 0.25;

            function saveSettings() {
                localStorage.setItem(`${id}-config-${currentCharacter}`, JSON.stringify(settings));
            }

            function loadSettings() {
                const storedSettings = JSON.parse(localStorage.getItem(`${id}-config-${currentCharacter}`));
                if (!storedSettings) {
                    return;
                }

                settings = { ...settings, ...storedSettings };

                // Update old settings
                if (settings.version === 1) {
                    patchTypes.forEach((patchType) => {
                        settings[patchType].useGloop = true;
                    });
                }
                settings.version = settingsVersion;
                saveSettings();
            }
            loadSettings();
            window.AUTOFARM_SETTINGS = settings;

            function createPatchTypeDiv(patchType) {
                function createSeedDiv(seedId) {
                    const grownItem = items[items[seedId].grownItemID];
                    return `
                    <div class="btn btn-outline-secondary ${id}-priority-selector" data-seed-id="${seedId}" data-tippy-content="${grownItem.name}" style="margin: 2px; padding: 6px; float: left;">
                        <img src="${grownItem.media}" width="30" height="30">
                    </div>`;
                }

                function createPriorityTypeSelector(priorityType) {
                    const prefix = `${id}-${patchType}-prioritytype`;
                    const elementId = `${prefix}-${priorityType.id}`;
                    return `
                    <div class="custom-control custom-radio custom-control-inline">
                        <input class="custom-control-input" type="radio" id="${elementId}" name="${prefix}" value="${priorityType.id
                        }"${settings[patchType].priorityType === priorityType.id ? ' checked' : ''}>
                        <label class="custom-control-label" for="${elementId}" data-tippy-content="${priorityType.tooltip
                        }">${priorityType.description}</label>
                    </div>`;
                }

                const prefix = `${id}-${patchType}`;
                const prioritySettings = `${prefix}-prioritysettings`;
                const seedDivs = allSeeds[patchType].map(createSeedDiv).join('');
                return `
                <div id="${prefix}" class="col-12 col-md-6 col-xl-4">
                    <div class="block block-rounded block-link-pop border-top border-farming border-4x" style="padding-bottom: 12px;">
                        <div class="block-header border-bottom">
                            <h3 class="block-title">AutoFarm ${patchType}</h3>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="${prefix}-enabled" name="${prefix}-enabled"${settings[patchType].enabled ? ' checked' : ''
                    }>
                                <label class="custom-control-label" for="${prefix}-enabled">Enable</label>
                            </div>
                        </div>
                        <div class="block-content" style="padding-top: 12px">
                            ${Object.values(priorityTypes).map(createPriorityTypeSelector).join('')}
                        </div>
                        <div class="block-content" style="padding-top: 12px">
                            <div id="${prioritySettings}-custom">
                                ${seedDivs}
                                <button id="${prioritySettings}-reset" class="btn btn-primary locked" data-tippy-content="Reset order to default (highest to lowest level)" style="margin: 5px 0 0 2px; float: right;">Reset</button>
                            </div>
                            <div id="${prioritySettings}-mastery" class="${id}-seed-toggles">
                                ${seedDivs}
                            </div>
                            <div id="${prioritySettings}-quantity" class="${id}-seed-toggles">
                                ${seedDivs}
                            </div>
                        </div>
                    </div>
                </div>`;
            }

            const autoFarmDiv = `
            <div id="${id}" class="row row-deck gutters-tiny">
                ${patchTypes.map(createPatchTypeDiv).join('')}
            </div>`;

            $('#farming-container .row:first').after($(autoFarmDiv));

            function addStateChangeHandler(patchType) {
                $(`#${id}-${patchType}-enabled`).change((event) => {
                    settings[patchType].enabled = event.currentTarget.checked;
                    saveSettings();
                    loadFarmingArea(patchTypes.indexOf(patchType));
                });
            }
            patchTypes.forEach(addStateChangeHandler);

            function showSelectedPriorityTypeSettings(patchType) {
                for (const priorityType of Object.values(priorityTypes)) {
                    $(`#${id}-${patchType}-prioritysettings-${priorityType.id}`).toggle(
                        priorityType.id === settings[patchType].priorityType
                    );
                }
            }
            patchTypes.forEach(showSelectedPriorityTypeSettings);

            function lockPatch(patchType, patchId, seedId) {
                if (seedId !== undefined) {
                    settings[patchType].lockedPatches[patchId] = seedId;
                } else {
                    delete settings[patchType].lockedPatches[patchId];
                }
            }

            function addPriorityTypeChangeHandler(patchType) {
                function lockAllPatches(auto = false) {
                    const area = newFarmingAreas[patchTypes.indexOf(patchType)];
                    for (let i = 0; i < area.patches.length; i++) {
                        lockPatch(patchType, i, auto ? undefined : area.patches[i].seedID || -1);
                    }
                    $(`.${id}-seed-selector`).remove();
                    addSeedSelectors();
                }

                $(`#${id} input[name="${id}-${patchType}-prioritytype"]`).change((event) => {
                    if (settings[patchType].priorityType === priorityTypes.replant.id) {
                        lockAllPatches(true);
                    }

                    settings[patchType].priorityType = event.currentTarget.value;
                    if (event.currentTarget.value === priorityTypes.replant.id) {
                        lockAllPatches();
                    }
                    showSelectedPriorityTypeSettings(patchType);
                    saveSettings();
                });
            }
            patchTypes.forEach(addPriorityTypeChangeHandler);

            function makeSortable(patchType) {
                const elementId = `${id}-${patchType}-prioritysettings-custom`;
                Sortable.create(document.getElementById(elementId), {
                    animation: 150,
                    filter: '.locked',
                    onMove: (event) => {
                        if (event.related) {
                            return !event.related.classList.contains('locked');
                        }
                    },
                    onEnd: () => {
                        settings[patchType].priority = [...$(`#${elementId} .${id}-priority-selector`)].map(
                            (x) => +$(x).data('seed-id')
                        );
                        saveSettings();
                    },
                });
            }
            patchTypes.forEach(makeSortable);

            function orderCustomPriorityMenu(patchType) {
                const priority = settings[patchType].priority;
                if (!priority.length) {
                    return;
                }
                const menu = $(`#${id}-${patchType}-prioritysettings-custom`);
                const menuItems = [...menu.children()];

                function indexOfOrInf(el) {
                    let i = priority.indexOf(+el);
                    return i === -1 ? Infinity : i;
                }

                const sortedMenu = menuItems.sort(
                    (a, b) => indexOfOrInf($(a).data('seed-id')) - indexOfOrInf($(b).data('seed-id'))
                );
                menu.append(sortedMenu);
            }

            function addPriorityResetClickHandler(patchType) {
                $(`#${id}-${patchType}-prioritysettings-reset`).on('click', () => {
                    settings[patchType].priority = allSeeds[patchType];
                    orderCustomPriorityMenu(patchType);
                    saveSettings();
                });
            }
            patchTypes.forEach(addPriorityResetClickHandler);

            $(`.${id}-seed-toggles div`).each((_, e) => {
                const toggle = $(e);
                const seedId = toggle.data('seed-id');
                if (settings.disabledSeeds[seedId]) {
                    toggle.css('opacity', disabledOpacity);
                }
            });

            $(`.${id}-seed-toggles div`).on('click', (event) => {
                const toggle = $(event.currentTarget);
                const seedId = toggle.data('seed-id');
                if (settings.disabledSeeds[seedId]) {
                    delete settings.disabledSeeds[seedId];
                } else {
                    settings.disabledSeeds[seedId] = true;
                }
                const opacity = settings.disabledSeeds[seedId] ? disabledOpacity : 1;
                toggle.fadeTo(200, opacity);
                saveSettings();
            });

            patchTypes.forEach((patchType) => {
                orderCustomPriorityMenu(patchType);
                orderMasteryPriorityMenu(patchType);
                orderQuantityPriorityMenu(patchType);
            });

            function createDropdown(patchType) {
                function createDropdownItem(name, icon, seedId) {
                    return `
                    <button class="dropdown-item"${seedId !== undefined ? ` data-seed-id="${seedId}"` : ''
                        } style="outline: none;">
                        <span style="margin-right: 12px; vertical-align: bottom;">${icon}</span>${name}
                    </button>`;
                }

                return `
            <div class="dropdown ${id}-seed-selector">
                <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" style="padding-left: 8px; padding-right: 8px;"><span class="${id}-seed-selector-icon" style="margin-right: 6px; vertical-align: text-bottom; margin-top: 1px;"></span><span class="${id}-seed-selector-text"></span></button>
                <div class="dropdown-menu font-size-sm" style="border-color: #6c757d; border-radius: 0.25rem; padding: 0.25rem 0;">
                    ${createDropdownItem(
                    'Auto',
                    '<img src="assets/media/main/settings_header.svg" width="20" height="20">'
                )}
                    ${allSeeds[patchType]
                        .map((seedId) =>
                            createDropdownItem(
                                items[items[seedId].grownItemID].name,
                                `<img src="${items[items[seedId].grownItemID].media}" width="20" height="20">`,
                                seedId
                            )
                        )
                        .join('')}
                    ${createDropdownItem(
                            'None',
                            '<i class="fa fa-ban" style="width: 20px; font-size: 20px; color: #c81f1f; vertical-align: middle;"></i>',
                            -1
                        )}
                </div>
            </div>`;
            }

            function addSeedSelectors() {
                function updateDropdownSelection(patchType, patchId, dropdown) {
                    dropdown.find('.dropdown-item.active').removeClass('active');
                    const button = dropdown.children('button');
                    const selectedSeed = settings[patchType].lockedPatches[patchId];
                    let selected;
                    if (selectedSeed !== undefined) {
                        selected = dropdown.find(`.dropdown-item[data-seed-id="${selectedSeed}"]`);
                        button.find(`.${id}-seed-selector-text`).text('');
                    } else {
                        selected = dropdown.find('.dropdown-item:not([data-seed-id])');
                        button.find(`.${id}-seed-selector-text`).text('Auto');
                    }
                    selected.addClass('active');
                    button.find(`.${id}-seed-selector-icon`).html(selected.find('span').html());
                }

                $('#farming-area-container h3').each((patchId, e) => {
                    const header = $(e);
                    if (header.siblings(`.${id}-seed-selector`).length) {
                        // Seed selector already exists
                        return;
                    }
                    const patchType = toPatchType[header.text().toUpperCase()];
                    if (patchType === undefined) {
                        // Locked patch
                        return;
                    }

                    if (settings[patchType].enabled) {
                        // Remove game's seed picker
                        header.siblings('.block-options').remove();
                    }

                    const dropdown = $(createDropdown(patchType, patchId));
                    updateDropdownSelection(patchType, patchId, dropdown);

                    dropdown.find('.dropdown-item').on('click', (event) => {
                        lockPatch(patchType, patchId, $(event.currentTarget).data('seed-id'));
                        saveSettings();
                        updateDropdownSelection(patchType, patchId, dropdown);
                    });

                    header.after(dropdown);
                });
            }
            addSeedSelectors();

            if (observer) {
                observer.disconnect();
            }
            observer = new MutationObserver(addSeedSelectors);
            observer.observe(document.getElementById('farming-area-container'), { childList: true });

            tippy(`#${id} [data-tippy-content]`, { animation: false, allowHTML: true });
        }

        injectGUI();
        setInterval(autoFarm, 15000);
    }

    // function removeGUI() {
    //     if (observer) {
    //         observer.disconnect();
    //     }
    //     $(`#${id} [data-tippy-content]`).each((_, e) => e._tippy.destroy());
    //     $(`#${id}`).remove();
    //     $(`.${id}-seed-selector`).remove();
    // }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading AutoFarm');
            startAutoFarm();
        }
    }

    const interval = setInterval(loadScript, 1000);
});
