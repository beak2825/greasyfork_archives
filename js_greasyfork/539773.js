// ==UserScript==
// @name         SleightofHand
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  tricky
// @author       You
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.eu/Main
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539773/SleightofHand.user.js
// @updateURL https://update.greasyfork.org/scripts/539773/SleightofHand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_ID_LOG_PREFIX = "QuickEquip:";
    let scriptInitialized = false;
    let gameJQ = null;
    let gameNav = null;

    const ITEM_MOVE_DELAY_MS = 200;
    const BATCH_DELAY_MS = 300;

    const PRESET_STORAGE_KEY = "dcEquipmentPresets_v2";
    const TOOLBAR_ID = "dcEquipToolbar";
    const TOOLBAR_POS_KEY = "dcEquipToolbarPos";
    const PRESET_BUTTONS_CONTAINER_ID = "dcPresetButtonsContainer";
    const SAVE_PRESET_BTN_ID = "dcSavePresetBtn";
    const DELETE_MODE_BTN_ID = "dcDeleteModeBtn";

    const AVAILABLE_ICONS = ["⚔️", "🛡️", "🛠️", "🎭", "👟", "💰", "❤️", "✨", "①", "②", "③", "④", "⑤"];
    const RESTRICTED_ITEM_TYPES_IN_COMBAT = ["Buste", "Jambes", "Pieds"];
    const RESTRICTED_SLOT_TYPE_SUFFIXES_IN_COMBAT = ["Buste", "Jambes", "Pieds"];
    const EQUIPMENT_PANEL_SELECTOR = '#equipement_inventaire';
    const CHARACTER_EQUIP_SLOT_SUFFIXES = [-2, -1, 1, 2, 3, 4, 5, 6];
    const itemTypeToSlotTypeNameMap = {
        "Tete": "Tete", "Buste": "Buste", "Jambes": "Jambes", "Pieds": "Pieds",
        "Secondaire": "Secondaire", "SecondaireRP": "SecondaireRP",
        "Arme": "Main droite", "Arme à une main": "Main droite", "Arme à deux mains": "Main droite"
    };

    let isDeleteModeArmed = false;

    function isInCombat() {
        if (!gameJQ) return false;
        return gameJQ('#db_combat').length > 0;
    }

    function isSlotRestrictedByTypeInCombat($slotDiv) {
        if (!$slotDiv || !$slotDiv.length) return false;
        const slotClasses = $slotDiv.attr('class');
        if (!slotClasses) return false;
        for (const restrictedType of RESTRICTED_SLOT_TYPE_SUFFIXES_IN_COMBAT) {
            if (slotClasses.includes(`_type_${restrictedType}`)) return true;
        }
        return false;
    }

    function getRawItemType(itemImgElement) {
        if (!itemImgElement) return null;
        for (const cls of itemImgElement.classList) if (cls.startsWith('objet_type_')) return cls.substring('objet_type_'.length);
        return null;
    }

    function getSlotNumericSuffix(slotId) {
        if (!slotId || typeof slotId !== 'string') return NaN;
        const parts = slotId.split('_');
        if (parts.length > 0) return parseInt(parts[parts.length - 1], 10);
        return NaN;
    }

    function initializeMainLogic() {
        if (!gameJQ || typeof gameJQ.fn === 'undefined' || !gameJQ.fn.jquery ||
            !gameNav || typeof gameNav.getInventaire !== 'function') {
            console.error(`${SCRIPT_ID_LOG_PREFIX} CRITICAL FAILURE: initializeMainLogic with invalid gameJQ/gameNav.`);
            scriptInitialized = true; return;
        }
        const $ = gameJQ;

        GM_addStyle(`
            #${TOOLBAR_ID} { position: fixed; background-color: rgba(30, 30, 30, 0.85); border: 1px solid #555; border-radius: 5px; padding: 5px; z-index: 100001; cursor: grab; display: flex; flex-direction: column; gap: 4px; }
            #${TOOLBAR_ID}:active { cursor: grabbing; }
            #${PRESET_BUTTONS_CONTAINER_ID} { display: flex; flex-direction: column; gap: 4px; }
            .${TOOLBAR_ID}_button, #${SAVE_PRESET_BTN_ID}, #${DELETE_MODE_BTN_ID} { width: 28px; height: 28px; background-color: #444; border: 1px solid #666; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 3px; font-size: 16px; padding: 0; box-sizing: border-box; user-select: none; }
            .${TOOLBAR_ID}_button:hover, #${SAVE_PRESET_BTN_ID}:hover, #${DELETE_MODE_BTN_ID}:hover { background-color: #555; }
            #${DELETE_MODE_BTN_ID}.armed { background-color: #a00 !important; border-color: #f00 !important; }
            #dcIconPickerModal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2a2a2a; border: 1px solid #777; border-radius: 5px; padding: 15px; z-index: 100002; display: flex; flex-wrap: wrap; gap: 10px; }
            .dc-icon-option { cursor: pointer; font-size: 20px; padding: 5px; border-radius:3px; }
            .dc-icon-option:hover { background-color: #555; }
        `);

        function performMove(itemElement, targetSlotId) {
            const $itemToMove = $(itemElement);
            const inventaire = gameNav.getInventaire();
            if (!inventaire) { console.error(`${SCRIPT_ID_LOG_PREFIX} No MenuInventaire for performMove.`); return; }
            inventaire.currentDrag = $itemToMove;
            inventaire.initPos = { x: $itemToMove.css('left'), y: $itemToMove.css('top') };
            try {
                inventaire.checkDeplacement(targetSlotId);
            }
            catch (e) { console.error(`${SCRIPT_ID_LOG_PREFIX} Error in checkDeplacement:`, e); }
        }

        function savePreset(name, icon, equipmentData) {
             let presets = JSON.parse(GM_getValue(PRESET_STORAGE_KEY, "{}"));
             presets[name] = { icon: icon, equipment: equipmentData, name: name };
             GM_setValue(PRESET_STORAGE_KEY, JSON.stringify(presets));
             loadAndDisplayPresets();
        }

        function deletePreset(presetName) {
            let presets = JSON.parse(GM_getValue(PRESET_STORAGE_KEY, "{}"));
            if (presets[presetName]) { delete presets[presetName]; GM_setValue(PRESET_STORAGE_KEY, JSON.stringify(presets)); loadAndDisplayPresets(); }
            disarmDeleteMode();
        }

        function loadAndDisplayPresets() {
            const presets = JSON.parse(GM_getValue(PRESET_STORAGE_KEY, "{}"));
            const $container = $(`#${PRESET_BUTTONS_CONTAINER_ID}`); $container.empty();
            for (const name in presets) { if (presets.hasOwnProperty(name)) addPresetButtonToToolbar(name, presets[name]); }
        }

        function addPresetButtonToToolbar(presetName, presetData) {
            $('<div>').addClass(`${TOOLBAR_ID}_button`).html(presetData.icon || '❓')
                .attr('title', presetName).data('presetData', presetData)
                .on('click', function() {
                    const clickedPresetData = $(this).data('presetData');
                    if (isDeleteModeArmed) { if (confirm(`Delete preset "${clickedPresetData.name}"?`)) deletePreset(clickedPresetData.name); else disarmDeleteMode(); }
                    else equipPreset(clickedPresetData.equipment);
                }).appendTo($(`#${PRESET_BUTTONS_CONTAINER_ID}`));
        }

        async function equipPreset(equipmentData) {
            if (!gameJQ) { console.error(`${SCRIPT_ID_LOG_PREFIX} equipPreset: gameJQ not available!`); return; }
            const inCombat = isInCombat();
            const currentEquipment = {};
            $(`${EQUIPMENT_PANEL_SELECTOR} div.linkBox:not(.linkBox_vide)`).each(function() {
                const $slot = $(this); const $itemImg = $slot.find('img.item');
                if ($itemImg.length) currentEquipment[$slot.attr('id')] = $itemImg.attr('id').split('_')[0];
            });
            const itemsToUnequipOps = [];
            for (const slotId in currentEquipment) {
                const currentItemId = currentEquipment[slotId];
                const targetItemFullIdForSlot = equipmentData[slotId];
                const targetItemIdForSlot = targetItemFullIdForSlot ? targetItemFullIdForSlot.split('_')[0] : null;
                if (currentItemId !== targetItemIdForSlot) {
                    const $currentSlotDiv = $(`#${slotId}`);
                    if (inCombat && isSlotRestrictedByTypeInCombat($currentSlotDiv)) { continue; }
                    const itemFullIdToUnequip = $(`#${slotId} img.item[id^="${currentItemId}_"]`).attr('id');
                    if (itemFullIdToUnequip) { const itemElementToUnequip = $(`#${itemFullIdToUnequip}`)[0]; if (itemElementToUnequip) itemsToUnequipOps.push({ itemElement: itemElementToUnequip }); }
                }
            }
            if (itemsToUnequipOps.length > 0) {
                for (const op of itemsToUnequipOps) {
                    const $emptyBagSlot = $('div[id^="conteneur_"].linkBox_vide.case_objet_vide_type_inv_vide.ui-droppable').first();
                    if ($emptyBagSlot.length) { performMove(op.itemElement, $emptyBagSlot.attr('id')); await new Promise(resolve => setTimeout(resolve, ITEM_MOVE_DELAY_MS)); }
                    else { console.warn(`${SCRIPT_ID_LOG_PREFIX} No valid empty bag slot (conteneur_) for preset unequip. Aborting.`); return; }
                }
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
            }
            const itemsToEquipOps = [];
            for (const targetSlotId in equipmentData) {
                const targetFullItemId = equipmentData[targetSlotId]; const targetItemId = targetFullItemId.split('_')[0];
                const $itemCurrentlyInTargetSlot = $(`#${targetSlotId} img.item`);
                if ($itemCurrentlyInTargetSlot.length && $itemCurrentlyInTargetSlot.attr('id').startsWith(targetItemId + "_")) continue;
                const $targetSlotDiv = $(`#${targetSlotId}`);
                if (inCombat && isSlotRestrictedByTypeInCombat($targetSlotDiv)) { continue; }
                let $itemInBag = null;
                $('div[id^="conteneur_"] img.item').each(function() { if ($(this).attr('id').startsWith(targetItemId + "_")) { $itemInBag = $(this); return false; } });
                if ($itemInBag && $itemInBag.length) itemsToEquipOps.push({ itemElement: $itemInBag[0], targetSlotId: targetSlotId });
                else console.warn(`${SCRIPT_ID_LOG_PREFIX} Item ${targetItemId} for preset (to ${targetSlotId}) not found.`);
            }
            if (itemsToEquipOps.length > 0) {
                for (const op of itemsToEquipOps) { performMove(op.itemElement, op.targetSlotId); await new Promise(resolve => setTimeout(resolve, ITEM_MOVE_DELAY_MS)); }
            }
        }

        function handleSavePreset() {
            const presetName = prompt("Enter a name for this preset:");
            if (!presetName) return;

            let $iconPicker = $('#dcIconPickerModal');
            if ($iconPicker.length === 0) {
                $iconPicker = $('<div id="dcIconPickerModal"></div>').appendTo('body');
            }
            $iconPicker.empty().show();

            if (AVAILABLE_ICONS.length === 0) {
                alert("Error: No icons available.");
                $iconPicker.hide().empty();
                return;
            }

            AVAILABLE_ICONS.forEach(icon => {
                $('<span>').addClass('dc-icon-option').text(icon)
                    .on('click', function() {
                        // When an icon is chosen, we no longer need the "click-outside" listener.
                        $(document).off('click.dcIconPicker');

                        const chosenIcon = $(this).text();
                        $iconPicker.hide().empty();
                        const currentEquipment = {};
                        let itemCount = 0;
                        $(`${EQUIPMENT_PANEL_SELECTOR} div.linkBox:not(.linkBox_vide)`).each(function() {
                            const $slot = $(this);
                            const $itemImg = $slot.find('img.item');
                            if ($itemImg.length) {
                                currentEquipment[$slot.attr('id')] = $itemImg.attr('id');
                                itemCount++;
                            }
                        });
                        if (itemCount === 0) {
                            alert("No items equipped to save.");
                            return;
                        }
                        savePreset(presetName, chosenIcon, currentEquipment);
                    }).appendTo($iconPicker);
            });

            // FIX: Use setTimeout to defer attaching the "click-outside" handler.
            // This prevents it from catching the same click event that opened the modal.
            setTimeout(() => {
                $(document).one('click.dcIconPicker', function(e) {
                     // If the picker is visible and the click was outside of it, hide the picker.
                     if ($iconPicker.is(':visible') && $(e.target).closest('#dcIconPickerModal').length === 0) {
                        $iconPicker.hide().empty();
                    }
                });
            }, 0);
        }

        function armOrDisarmDeleteMode() { isDeleteModeArmed = !isDeleteModeArmed; $(`#${DELETE_MODE_BTN_ID}`).toggleClass('armed', isDeleteModeArmed).html(isDeleteModeArmed ? '💥' : '❌');}
        function disarmDeleteMode() { if (isDeleteModeArmed) { isDeleteModeArmed = false; $(`#${DELETE_MODE_BTN_ID}`).removeClass('armed').html('❌'); }}

        function createToolbar() {
            let $toolbar = $(`#${TOOLBAR_ID}`); if ($toolbar.length) return $toolbar;
            let savedPos = null; try { const savedPosStr = GM_getValue(TOOLBAR_POS_KEY); if (savedPosStr) savedPos = JSON.parse(savedPosStr); } catch (e) {}
            const top = savedPos && typeof savedPos.top === 'number' ? savedPos.top + 'px' : '100px';
            const left = savedPos && typeof savedPos.left === 'number' ? savedPos.left + 'px' : '10px';
            $toolbar = $('<div>').attr('id', TOOLBAR_ID).css({ top: top, left: left }).appendTo('body');
            $('<div>').attr('id', SAVE_PRESET_BTN_ID).addClass(`${TOOLBAR_ID}_button`).html('💾').attr('title', "Save Preset").on('click', handleSavePreset).appendTo($toolbar);
            $('<div>').attr('id', DELETE_MODE_BTN_ID).addClass(`${TOOLBAR_ID}_button`).html('❌').attr('title', "Delete Mode").on('click', armOrDisarmDeleteMode).appendTo($toolbar);
            $('<div>').attr('id', PRESET_BUTTONS_CONTAINER_ID).appendTo($toolbar);
            if ($.fn.draggable) { $toolbar.draggable({ containment: 'window', stop: function(event, ui) { GM_setValue(TOOLBAR_POS_KEY, JSON.stringify({ top: ui.position.top, left: ui.position.left })); } }); }
            return $toolbar;
        }

        $(document).on('click', 'img.item', function(event) {
            const clickedItemImgRaw = this;
            const $clickedItemImg = $(clickedItemImgRaw);
            const $itemSlotDiv = $clickedItemImg.closest('div.linkBox');

            if ($clickedItemImg.hasClass('activable') || !$itemSlotDiv.length) return;

            const slotId = $itemSlotDiv.attr('id');
            const itemType = getRawItemType(clickedItemImgRaw);
            const inCombat = isInCombat();

            event.preventDefault(); event.stopPropagation();
            if (!itemType) { console.warn(`${SCRIPT_ID_LOG_PREFIX} No itemType for clicked item.`); return; }

            const isRestrictedItemByType = RESTRICTED_ITEM_TYPES_IN_COMBAT.includes(itemType);
            const isCurrentSlotRestrictedByType = isSlotRestrictedByTypeInCombat($itemSlotDiv);
            if (inCombat && (isRestrictedItemByType || isCurrentSlotRestrictedByType)) {
                return;
            }

            let actionToTake = null;
            const slotNumericSuffix = getSlotNumericSuffix(slotId);
            const isInventaireSlot = slotId && slotId.startsWith('inventaire_');
            const isRecognizedEquipSuffix = !isNaN(slotNumericSuffix) && CHARACTER_EQUIP_SLOT_SUFFIXES.includes(slotNumericSuffix);
            const isConteneurSlot = slotId && slotId.startsWith('conteneur_');

            if (isInventaireSlot && isRecognizedEquipSuffix) actionToTake = 'de-equip';
            else if (isConteneurSlot) actionToTake = 'equip';

            if (!actionToTake) return;

            if (actionToTake === 'de-equip') {
                const $emptyBagSlot = $('div[id^="conteneur_"].linkBox_vide.case_objet_vide_type_inv_vide.ui-droppable').first();
                if ($emptyBagSlot.length) {
                    performMove(clickedItemImgRaw, $emptyBagSlot.attr('id'));
                } else {
                    alert("No valid empty bag slot available!");
                }
            } else if (actionToTake === 'equip') {
                let targetSlotTypeName = itemTypeToSlotTypeNameMap[itemType];
                if (!targetSlotTypeName) {
                    if (itemType.toLowerCase().includes("arme")) targetSlotTypeName = "Main droite";
                    else { console.warn(`${SCRIPT_ID_LOG_PREFIX} No target slot type name for item type: ${itemType}`); return; }
                }
                let $targetEquipSlot = null;
                const desiredClassGeneric = `_type_${targetSlotTypeName}`;
                const desiredClassExact = `case_objet_vide_type_${targetSlotTypeName}`;
                const undesiredClassRP = `_type_SecondaireRP`;

                if (itemType === "Secondaire") {
                    $(`${EQUIPMENT_PANEL_SELECTOR} div.linkBox_vide.ui-droppable`).each(function() {
                        const $potentialSlot = $(this); const slotClasses = $potentialSlot.attr('class');
                        if (slotClasses && slotClasses.includes(desiredClassExact) && !slotClasses.includes(undesiredClassRP)) {
                             if (inCombat && isSlotRestrictedByTypeInCombat($potentialSlot)) {} else { $targetEquipSlot = $potentialSlot; return false; }
                        }
                    });
                }
                if (!$targetEquipSlot) {
                    $(`${EQUIPMENT_PANEL_SELECTOR} div.linkBox_vide.ui-droppable`).each(function() {
                        const $potentialSlot = $(this); const slotClasses = $potentialSlot.attr('class');
                        if (slotClasses && slotClasses.includes(desiredClassGeneric)) {
                            if (itemType === "Secondaire" && slotClasses.includes(undesiredClassRP)) return true;
                            if (inCombat && isSlotRestrictedByTypeInCombat($potentialSlot)) {} else { $targetEquipSlot = $potentialSlot; return false; }
                        }
                    });
                }
                if (targetSlotTypeName === "Main droite" && itemType !== "Arme à deux mains" && (!$targetEquipSlot || $targetEquipSlot.length === 0) ) {
                    const weaponOffHandDesiredClass = `_type_Secondaire`; // Assumes off-hand weapon slot also uses _type_Secondaire
                     $(`${EQUIPMENT_PANEL_SELECTOR} div.linkBox_vide.ui-droppable`).each(function(){
                        const $potentialSlot = $(this); const slotClasses = $potentialSlot.attr('class');
                        if (slotClasses && slotClasses.includes(weaponOffHandDesiredClass) && !slotClasses.includes(undesiredClassRP) ) { // Avoid accessory RP slot for weapons
                            if (inCombat && isSlotRestrictedByTypeInCombat($potentialSlot)) { } else { $targetEquipSlot = $potentialSlot; return false; }
                        }
                     });
                }
                if ($targetEquipSlot && $targetEquipSlot.length) {
                    performMove(clickedItemImgRaw, $targetEquipSlot.attr('id'));
                } else {
                    console.warn(`${SCRIPT_ID_LOG_PREFIX} No suitable empty (and non-restricted in combat) equip slot found for ${itemType}.`);
                }
            }
        });

        createToolbar();
        loadAndDisplayPresets();
        scriptInitialized = true;
    }

    let uwAttempts = 0; const maxUwAttempts = 100; const uwInterval = 50;
    const GQPoll = setInterval(function() {
        if (scriptInitialized) { clearInterval(GQPoll); return; }
        uwAttempts++;
        if (typeof unsafeWindow !== 'undefined') {
            let tempJQ = unsafeWindow.jQuery || unsafeWindow.$;
            let tempNav = unsafeWindow.nav;
            if (tempJQ && typeof tempJQ === 'function' && tempJQ.fn && tempJQ.fn.jquery) gameJQ = tempJQ; else gameJQ = null;
            if (tempNav && typeof tempNav.getInventaire === 'function') gameNav = tempNav; else gameNav = null;
            if (gameJQ && gameNav) {
                clearInterval(GQPoll);
                initializeMainLogic(); return;
            }
        }
        if (uwAttempts >= maxUwAttempts) {
            clearInterval(GQPoll);
            console.error(`${SCRIPT_ID_LOG_PREFIX} Could not find required game objects.`);
            scriptInitialized = true;
        }
    }, uwInterval);
})();