// ==UserScript==
// @name        MWI Loadout Manager
// @namespace   https://github.com/tobytorn
// @description Setup loadout according to Combat Simulator export files
// @author      tobytorn
// @match       https://www.milkywayidle.com/*
// @match       https://test.milkywayidle.com/*
// @version     1.0.1
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @supportURL  https://github.com/tobytorn/mwi-loadout-manager
// @license     MIT
// @require     https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/502083/MWI%20Loadout%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/502083/MWI%20Loadout%20Manager.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MISC_SVG = '/static/media/misc_sprite.2864433e.svg';
  const ITEMS_SVG = '/static/media/items_sprite.8134f2ed.svg';
  const ABILITIES_SVG = '/static/media/abilities_sprite.7b4605a0.svg';

  const CSS = `
    .lmInput {
      color: var(--color-text-dark-mode);
      background: var(--color-midnight-700);
      border: none;
      padding: 4px;
      resize: none;
      outline: none;
    }
    .lmError {
      color: var(--color-warning-hover);
      display: none;
    }
    .lmItemIcon {
      position: absolute;
      top: 15%;
      left: 15%;
      width: 70%;
      height: 70%;
    }
    .lmEnhancementLevel {
      z-index: 1;
      position: absolute;
      top: 1px;
      left: 1px;
      color: var(--color-orange-400);
      text-shadow: 1px 1px 3px var(--color-midnight-500);
      font-size: 12px;
      font-weight: 500;
      line-height: 12px;
    }
    .lmPanelEntry {
      margin: 0 auto 8px auto;
      width: fit-content;
    }
    .CombatZones_consumablesAndAbilitiesContainer__rb6Fi.lmSeen > *,
    .Party_consumablesAndAbilitiesContainer__2ff8f.lmSeen > * {
      margin-left: auto;
    }
    .lmCombatEntry {
      align-self: center;
      padding: 8px;
    }
    .lmCombatEntry.lmEntryCorrect::after {
      content: 'Correct';
      font-size: 14px;
      color: var(--color-jade-600);
    }
    .lmCombatEntry.lmEntryWrong::after {
      content: 'Wrong';
      font-size: 14px;
      color: var(--color-warning);
    }
    .lmSetTriggers {
      margin-bottom: 8px;
    }
    .lmNoPick {
      margin-bottom: 4px;
      text-align: center;
      color: var(--color-warning);
    }

    .lmModalContent {
      width: 350px;
      height: 550px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
    }
    .lmModalTitle {
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
    }
    .lmModalTabContainer {
      flex-shrink: 0;
      flex-grow: 0;
      margin: 0;
      overflow: hidden;
      width: 100%;
      border-bottom: 2px solid var(--color-divider);
      display: flex;
      letter-spacing: 0.02857em;
    }
    .lmTabButton {
      color: var(--color-text-dark-mode);
      font-size: 14px;
      font-weight: 500;
      min-height: 32px;
      height: 32px;
      margin: 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: 6px;
      cursor: pointer;
    }
    .lmTabButton:hover {
      background: var(--color-midnight-300);
    }
    .lmTabButton.lmActive {
      background: var(--color-space-600);
    }
    .lmModalTabContent {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      gap: 4px;
      text-align: left;
      overflow: auto;
    }
    .lmModalTabContent:not(.lmActive) {
      display: none;
    }
    #lmSelectTab .lmSelectTabNote {
      font-style: italic;
    }
    #lmLoadoutList {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    #lmLoadoutList .lmLoadout {
      border-radius: 4px;
      border: 2px solid var(--color-midnight-700);
      background: var(--color-midnight-700);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: pointer;
    }
    #lmLoadoutList .lmLoadout:hover {
      background-color: var(--color-midnight-300);
    }
    #lmLoadoutList .lmLoadout.lmActive {
      border: 2px solid var(--color-neutral-200);
    }
    #lmLoadoutList .lmLoadoutNameContainer {
      display: flex;
      gap: 4px;
    }
    #lmLoadoutList .lmLoadoutName {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    #lmLoadoutList .lmLoadout.lmActive .lmLoadoutName {
      white-space: normal;
    }
    #lmLoadoutList .lmLoadoutStar {
      height: 20px;
      width: 20px;
      flex-shrink: 0;
    }
    #lmLoadoutList .lmLoadout:not(.lmCurrent) .lmLoadoutStar {
      display: none;
    }
    #lmLoadoutList .lmLoadoutSummary {
      display: grid;
      gap: 4px;
      grid-template-columns: repeat(6, 45px);
    }
    #lmLoadoutList .lmLoadoutSummary:empty::after {
      content: 'This exactly matches your current loadout';
      font-style: italic;
      white-space: nowrap;
      color: var(--color-market-buy);
    }
    #lmLoadoutList .lmLoadout.lmActive .lmLoadoutSummary {
      display: none;
    }
    #lmLoadoutList .lmLoadoutDetails {
      display: grid;
      grid-template-columns: repeat(3, 45px);
      gap: 4px;
      justify-content: center;
    }
    #lmLoadoutList .lmLoadout:not(.lmActive) .lmLoadoutDetails {
      display: none;
    }
    #lmLoadoutList .lmLoadoutSlot {
      height: 45px;
      width: 45px;
      background-color: var(--color-midnight-500);
      border-radius: 4px;
      border: 1px solid var(--color-space-300);
      position: relative;
    }
    #lmLoadoutList .lmTriggerIcon {
      display: none;
      z-index: 1;
      position: absolute;
      left: 50%;
      bottom: -1px;
      transform: translate(-50%, 50%);
      width: 16px;
      height: 16px;
    }
    #lmLoadoutList .lmTriggerIcon svg {
      filter: brightness(0) saturate(100%) invert(25%) sepia(95%) saturate(3196%) hue-rotate(346deg) brightness(93%) contrast(84%);
    }
    #lmLoadoutList .lmTriggerIcon > div {
      position: absolute;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background-color: var(--color-midnight-500);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }
    #lmLoadoutList .lmLoadoutSlot.lmBadTriggers .lmTriggerIcon {
      display: block;
    }
    #lmLoadoutList .lmLoadoutDetails .lmLoadoutSlot.lmBad {
      border: 3px solid var(--color-warning);
    }
    #lmLoadoutList .lmLoadoutActions {
      display: flex;
      gap: 4px;
    }
    #lmLoadoutList .lmDelete {
      background: var(--color-market-sell);
    }
    #lmLoadoutList .lmDelete:hover {
      background: var(--color-market-sell-hover);
    }
    #lmLoadoutList .lmDelete::after {
      content: 'Delete';
    }
    #lmLoadoutList .lmDelete.lmConfirming {
      background: var(--color-disabled);
    }
    #lmLoadoutList .lmDelete.lmConfirming::after {
      content: 'Confirm Delete';
    }
    #lmLoadoutList .lmDelete.lmConfirming.lmConfirmed {
      background: var(--color-warning);
    }
    #lmLoadoutList .lmDelete.lmConfirming.lmConfirmed:hover {
      background: var(--color-warning-hover);
    }
    #lmLoadoutList .lmLoadout:not(.lmActive) .lmLoadoutActions {
      display: none;
    }
    #lmLoadoutList .lmLoadout.lmCurrent .lmSelect,
    #lmLoadoutList .lmLoadout.lmCurrent .lmDelete {
      display: none;
    }
    #lmLoadoutList .lmLoadout:not(.lmCurrent) .lmDeselect {
      display: none;
    }
    #lmImportTab textarea {
      flex-grow: 1;
    }

    .EquipmentPanel_playerModel__3LRB6 > .lmHighlight .ItemSelector_itemSelector__2eTV6,
    .AbilitySlot_abilitySlot__22oxh.lmHighlight .AbilitySlot_slot__3BSD4,
    .ConsumableSlot_consumableSlotContainer__2DwgD.lmHighlight .ConsumableSlot_itemSelectorContainer__RODer {
      position: relative;
    }
    .EquipmentPanel_playerModel__3LRB6 > .lmHighlight .ItemSelector_itemSelector__2eTV6::after,
    .ConsumableSlot_consumableSlotContainer__2DwgD.lmHighlight .ConsumableSlot_itemSelectorContainer__RODer::after,
    .AbilitySlot_abilitySlot__22oxh.lmHighlight .AbilitySlot_slot__3BSD4::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: inherit;
      border: 3px solid var(--color-warning);
      pointer-events: none;
    }
    .lmHighlightTriggers .CombatTriggersSetting_combatTriggersSetting__380iI {
      filter: brightness(0) saturate(100%) invert(25%) sepia(95%) saturate(3196%) hue-rotate(346deg) brightness(93%) contrast(84%);
    }
    .lmPick {
      position: relative;
      grid-area: 1 / 1;
    }
    .lmPick.lmPickSecond {
      grid-column-start: 2;
    }
    .lmPick::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 4px;
      border: 3px solid var(--color-jade-600);
      pointer-events: none;
    }
    .lmCombatUnitWrongLoadout::after {
      content: 'Wrong Loadout';
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-warning);
    }
  `;
  const PANEL_ENTRY_HTML = '<div class="lmPanelEntry"><div class="lmEntry Button_button__1Fe9z">Loadout</div></div>';
  const COMBAT_ENTRY_HTML = '<div class="lmCombatEntry"><div class="lmEntry Button_button__1Fe9z">Loadout</div></div>';
  const SET_TRIGGERS_BUTTON_HTML =
    '<div class="lmSetTriggers Button_button__1Fe9z Button_fullWidth__17pVU">Apply Selected Loadout</div>';
  const NO_PICK_NOTE_HTML = '<div class="lmNoPick">Item not owned for the selected loadout</div>';
  const LOADOUT_HTML = `
    <div class="lmLoadout">
      <div class="lmLoadoutNameContainer">
        <div class="lmLoadoutName"></div>
        <div class="lmLoadoutStar">
          <svg width="100%" height="100%">
            <use href="${MISC_SVG}#elite_2_star"></use>
          </svg>
        </div>
      </div>
      <div class="lmLoadoutSummary"></div>
      <div class="lmLoadoutDetails"><!-- equipments and abilities --></div>
      <div class="lmLoadoutDetails"><!-- consumables --></div>
      <div class="lmLoadoutActions">
        <div class="lmSelect Button_button__1Fe9z Button_fullWidth__17pVU">Highlight</div>
        <div class="lmDelete Button_button__1Fe9z Button_fullWidth__17pVU"></div>
        <div class="lmDeselect Button_button__1Fe9z Button_fullWidth__17pVU">Clear highlight</div>
      </div>
    </div>
  `;
  const LOADOUT_ITEM_HTML = `
    <div class="lmLoadoutSlot">
      <div class="lmItemIcon">
        <svg width="100%" height="100%"><use href=""></use></svg>
      </div>
      <div class="lmEnhancementLevel"></div>
      <div class="lmTriggerIcon">
        <div><!-- a small dot to make the center of this icon opaque --></div>
        <svg width="100%" height="100%"><use href="${MISC_SVG}#settings"></use></svg>
      </div>
    </div>
  `;
  const SETTING_MODAL_HTML = `
    <div id="lmSettingModal" class="Modal_modalContainer__3B80m">
      <div class="Modal_background__2B88R"></div>
      <div class="Modal_modal__1Jiep">
        <div class="lmModalContent">
          <div class="lmModalTitle">Loadout Manager</div>
          <div class="lmModalTabContainer">
            <div class="lmTabButton lmActive" data-lm-tab="lmSelectTab">Loadouts</div>
            <div class="lmTabButton" data-lm-tab="lmImportTab">Import</div>
            <div class="lmTabButton" data-lm-tab="lmCurrentTab">Current</div>
          </div>
          <div id="lmSelectTab" class="lmModalTabContent lmActive">
            <div class="lmSelectTabNote">Select a loadout to compare with your current one</div>
            <div id="lmLoadoutList"></div>
          </div>
          <div id="lmImportTab" class="lmModalTabContent">
            <div>Loadout name:</div>
            <input class="lmInput" type="text" maxlength="100">
            <div class="lmError" data-lm-field="name"></div>
            <div>Combat simulator export file:</div>
            <textarea class="lmInput"></textarea>
            <div class="lmError" data-lm-field="data"></div>
            <div id="lmImportSave" class="Button_button__1Fe9z Button_success__6d6kU Button_fullWidth__17pVU">Save</div>
          </div>
          <div id="lmCurrentTab" class="lmModalTabContent">
            <div>Enter a name to save your current loadout:</div>
            <input class="lmInput" type="text" maxlength="100">
            <div class="lmError" data-lm-field="name"></div>
            <div id="lmSaveCurrent" class="Button_button__1Fe9z Button_success__6d6kU Button_fullWidth__17pVU">Save</div>
          </div>
        </div>
        <div class="Modal_closeButton__3eTF7">
          <div role="img" alt="Close" class="Icon_icon__2LtL_">
            <svg width="100%" height="100%"><use href="${MISC_SVG}#close_menu"></use></svg>
          </div>
        </div>
      </div>
    </div>
  `;

  const ITEM_HRID_PREFIX = '/items/';
  const ABILITY_HRID_PREFIX = '/abilities/';
  const LOCATION_HRID_PREFIX = '/item_locations/';
  const ITEM_HREF_PREFIX = `${ITEMS_SVG}#`;
  const ABILITY_HREF_PREFIX = `${ABILITIES_SVG}#`;
  const TRIGGER_COMPARATOR_PREFIX = '/combat_trigger_comparators/';
  const TRIGGER_CONDITION_PREFIX = '/combat_trigger_conditions/';
  const TRIGGER_DEPENDENCY_PREFIX = '/combat_trigger_dependencies/';
  const EQUIPMENT_GRID_POSITION = {
    head: [1, 2],
    body: [2, 2],
    legs: [3, 2],
    feet: [4, 2],
    hands: [3, 1],
    main_hand: [2, 1],
    two_hand: [2, 1],
    off_hand: [2, 3],
    pouch: [3, 3],
    back: [1, 1],
    neck: [1, 5],
    earrings: [2, 5],
    ring: [3, 5],
  };
  const SLOT_WITH_TRIGGERS = {
    abilities: {
      hrefPrefix: ABILITY_HREF_PREFIX,
      hridPrefix: ABILITY_HRID_PREFIX,
      hridField: 'abilityHrid',
      gridIndex: 0,
      gridPosition: [5, 1],
    },
    food: {
      hrefPrefix: ITEM_HREF_PREFIX,
      hridPrefix: ITEM_HRID_PREFIX,
      hridField: 'itemHrid',
      gridIndex: 1,
      gridPosition: [1, 1],
    },
    drinks: {
      hrefPrefix: ITEM_HREF_PREFIX,
      hridPrefix: ITEM_HRID_PREFIX,
      hridField: 'itemHrid',
      gridIndex: 1,
      gridPosition: [1, 4],
    },
  };

  const $ = window.jQuery;

  class LoadoutManager {
    constructor() {
      this.id = null;
      this.playerName = '';
      this.loadouts = [];
      this.selected = null;
      this.current = {};
    }

    onInitCharacterData(msg) {
      this.id = msg.character.id.toString();
      this.playerName = msg.character.name;
      const savedData = GM_getValue(this.id, {});
      this.loadouts = savedData.loadouts ?? [];
      this.selected = this.loadouts.find((x) => x.name === savedData.selectedName) ?? null;
      this.current = {
        abilities: Array.from({ length: 5 }, () => ({ abilityHrid: '' })),
        drinks: [],
        food: [],
        equipment: [],
        triggerMap: { ...msg.abilityCombatTriggersMap, ...msg.consumableCombatTriggersMap },
      };
      this.onConsumableSlotsUpdated(msg);
      for (const ability of msg.characterAbilities) {
        if (ability.slotNumber > 0) {
          this.current.abilities[ability.slotNumber - 1].abilityHrid = ability.abilityHrid;
        }
      }
      for (const item of msg.characterItems) {
        const location = item.itemLocationHrid.slice(LOCATION_HRID_PREFIX.length);
        if (location in EQUIPMENT_GRID_POSITION) {
          this.current.equipment.push({
            itemLocationHrid: item.itemLocationHrid,
            itemHrid: item.itemHrid,
            enhancementLevel: item.enhancementLevel,
          });
        }
      }
    }

    onConsumableSlotsUpdated(msg) {
      this.current.drinks = msg.actionTypeDrinkSlotsMap['/action_types/combat'].slice(0, 3).map((x) => ({
        itemHrid: x?.itemHrid ?? '',
      }));
      this.current.food = msg.actionTypeFoodSlotsMap['/action_types/combat'].slice(0, 3).map((x) => ({
        itemHrid: x?.itemHrid ?? '',
      }));
    }

    onItemsUpdated(msg) {
      const removedLocations = (msg.endCharacterItems ?? [])
        .filter((x) => x.count === 0)
        .map((x) => x.itemLocationHrid);
      this.current.equipment = this.current.equipment.filter((x) => !removedLocations.includes(x.itemLocationHrid));
      for (const item of msg.endCharacterItems) {
        if (item.count === 1 && item.itemLocationHrid.slice(LOCATION_HRID_PREFIX.length) in EQUIPMENT_GRID_POSITION) {
          this.current.equipment.push({
            itemLocationHrid: item.itemLocationHrid,
            itemHrid: item.itemHrid,
            enhancementLevel: item.enhancementLevel,
          });
        }
      }
    }

    onAbilitiesUpdated(msg) {
      for (const ability of msg.endCharacterAbilities) {
        for (const currentAbility of this.current.abilities) {
          if (currentAbility.abilityHrid === ability.abilityHrid) {
            currentAbility.abilityHrid = '';
          }
        }
        if (ability.slotNumber > 0) {
          this.current.abilities[ability.slotNumber - 1].abilityHrid = ability.abilityHrid;
        }
      }
    }

    onCombatTriggersUpdated(msg) {
      let target;
      if (msg.combatTriggerTypeHrid === '/combat_trigger_types/ability') {
        target = msg.abilityHrid;
      } else if (msg.combatTriggerTypeHrid === '/combat_trigger_types/consumable') {
        target = msg.itemHrid;
      }
      this.current.triggerMap[target] = msg.combatTriggers;
    }

    save() {
      if (this.id === null) {
        throw new Error('LoadoutManager not initialized');
      }
      GM_setValue(this.id, {
        loadouts: this.loadouts,
        selectedName: this.selected?.name ?? null,
      });
    }

    add(loadout) {
      this.loadouts.push(loadout);
      this.save();
    }

    addCurrent(name) {
      const data = structuredClone(this.current);
      try {
        validateLoadoutData(data);
      } catch (err) {
        console.log('[Loadout Manager] addCurrent error', err);
        return;
      }
      this.add({ name, data });
    }

    select(name) {
      const loadout = this.loadouts.find((x) => x.name === name);
      if (!loadout) {
        return;
      }
      this.selected = loadout;
      this.save();
    }

    deselect() {
      this.selected = null;
      this.save();
    }

    delete(name) {
      const index = this.loadouts.findIndex((x) => x.name === name);
      if (index < 0) {
        return;
      }
      this.loadouts.splice(index, 1);
      if (this.selected?.name === name) {
        this.selected = null;
      }
      this.save();
    }

    /**
     * @param {keyof typeof EQUIPMENT_GRID_POSITION} location
     * @param {Loadout | undefined} loadout
     * @returns {Item | null}
     */
    compareEquipment(location, loadout = undefined) {
      loadout = loadout ?? this.selected;
      if (!loadout) {
        return null;
      }
      const item = loadout.data.equipment.find((x) => x.itemLocationHrid === `${LOCATION_HRID_PREFIX}${location}`);
      if (!item) {
        return null;
      }
      const currentItem = this.current.equipment.find(
        (x) => x.itemLocationHrid === `${LOCATION_HRID_PREFIX}${location}`,
      );
      if (currentItem?.itemHrid === item.itemHrid && currentItem.enhancementLevel >= item.enhancementLevel) {
        return null;
      } else {
        return item;
      }
    }

    /**
     * @param {'abilities' | 'food' | 'drinks'} type
     * @param {number} index
     * @param {Loadout | undefined} loadout
     * @returns {{ slot: Ability | Item } | { triggers: Trigger[] } | {}}
     */
    compareSlotWithTriggers(type, index, loadout = undefined) {
      loadout = loadout ?? this.selected;
      if (!loadout) {
        return {};
      }
      const item = loadout.data[type][index];
      const currentItem = manager.current[type][index];
      const hridField = type === 'abilities' ? 'abilityHrid' : 'itemHrid';
      if (currentItem?.[hridField] === item[hridField]) {
        const triggers = loadout.data.triggerMap[item[hridField]] ?? [];
        const currentTriggers = manager.current.triggerMap[item[hridField]] ?? [];
        if (!this.compareTriggers(triggers, currentTriggers)) {
          return { triggers };
        }
      } else {
        return { slot: item };
      }
      return {};
    }

    compareTriggers(t1, t2) {
      if (t1.length !== t2.length) {
        return false;
      }
      return t1.every(
        (x, i) =>
          x.comparatorHrid === t2[i].comparatorHrid &&
          x.conditionHrid === t2[i].conditionHrid &&
          x.dependencyHrid === t2[i].dependencyHrid &&
          x.value === t2[i].value,
      );
    }

    /** @returns { boolean } true if the selected loadout exactly matches the current one or no loadout is selected */
    compareSelectedAndCurrent() {
      if (!this.selected) {
        return true;
      }
      if (Object.keys(EQUIPMENT_GRID_POSITION).some((x) => manager.compareEquipment(x) !== null)) {
        return false;
      }
      for (const type of Object.keys(SLOT_WITH_TRIGGERS)) {
        for (let i = 0; i < this.selected.data[type].length; i++) {
          if (!$.isEmptyObject(manager.compareSlotWithTriggers(type, i))) {
            return false;
          }
        }
      }
      return true;
    }
  }

  class DomMonitor {
    constructor() {
      this.equipmentPanels = document.body.getElementsByClassName('EquipmentPanel_equipmentPanel__29pDG');
      this.abilitiesPanels = document.body.getElementsByClassName('AbilitiesPanel_abilitiesPanel__2kLc9');
      this.combatZoneSettings = document.body.getElementsByClassName(
        'CombatZones_consumablesAndAbilitiesContainer__rb6Fi',
      );
      this.combatPartySettings = document.body.getElementsByClassName('Party_consumablesAndAbilitiesContainer__2ff8f');
      this.equipmentContainers = document.body.getElementsByClassName('EquipmentPanel_playerModel__3LRB6');
      this.consumablesContainers = document.body.getElementsByClassName(
        'ActionTypeConsumableSlots_actionTypeConsumableSlots__1VwJx',
      );
      this.combatAbilitiesContainers = document.body.getElementsByClassName('CombatZones_abilitiesContainer__1mYiZ');
      this.partyAbilitiesContainers = document.body.getElementsByClassName('Party_abilitiesContainer__VAksm');
      this.abilitiesPanelAbilitiesContainers = document.body.getElementsByClassName(
        'AbilitiesPanel_abilityGrid__-p-VF',
      );
      this.combatUnits = document.body.getElementsByClassName('CombatUnit_combatUnit__1m3XT');
    }

    run() {
      const bodyOb = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const added of mutation.addedNodes) {
            if (added instanceof HTMLElement) {
              this.onChange();
              return;
            }
          }
        }
      });
      bodyOb.observe(document.body, { childList: true, subtree: true });
      const tooltipOb = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const added of mutation.addedNodes) {
            if (
              added instanceof HTMLElement &&
              added.getAttribute('role') === 'tooltip' &&
              added.classList.contains('MuiTooltip-popperInteractive')
            ) {
              this.onTooltipAdded(added);
            }
          }
        }
      });
      tooltipOb.observe(document.body, { childList: true });
    }

    onChange() {
      this.checkCollection(this.equipmentPanels, addEntryButtonInEquipmentPanel);
      this.checkCollection(this.abilitiesPanels, addEntryButtonInAbilitiesPanel);
      this.checkCollection(this.combatZoneSettings, updateEntryButtonInCombatSettings);
      this.checkCollection(this.combatPartySettings, updateEntryButtonInCombatSettings);
      this.checkCollection(this.equipmentContainers, highlightEquipments);
      this.checkCollection(this.consumablesContainers, highlightConsumables);
      this.checkCollection(this.combatAbilitiesContainers, highlightAbilities);
      this.checkCollection(this.partyAbilitiesContainers, highlightAbilities);
      this.checkCollection(this.abilitiesPanelAbilitiesContainers, highlightAbilities);
      this.checkCollection(this.combatUnits, highlightCombatUnit);
    }

    checkCollection(collection, fn) {
      for (const element of collection) {
        if (!element.classList.contains('lmSeen')) {
          element.classList.add('lmSeen');
          fn(element);
        }
      }
    }

    refresh() {
      this.refreshCollection(this.combatZoneSettings, updateEntryButtonInCombatSettings);
      this.refreshCollection(this.combatPartySettings, updateEntryButtonInCombatSettings);
      this.refreshCollection(this.equipmentContainers, highlightEquipments);
      this.refreshCollection(this.consumablesContainers, highlightConsumables);
      this.refreshCollection(this.combatAbilitiesContainers, highlightAbilities);
      this.refreshCollection(this.partyAbilitiesContainers, highlightAbilities);
      this.refreshCollection(this.abilitiesPanelAbilitiesContainers, highlightAbilities);
      this.refreshCollection(this.combatUnits, highlightCombatUnit);
    }

    refreshCollection(collection, fn) {
      for (const element of collection) {
        fn(element);
      }
    }

    onTooltipAdded(tooltip) {
      const $tooltip = $(tooltip);
      if ($tooltip.find('.ItemSelector_menu__12sEM').length > 0) {
        updateItemTooltip($tooltip);
      } else if ($tooltip.find('.AbilitySlot_abilitySelector__kwDWq').length > 0) {
        updateAbilitiesTooltip($tooltip);
      } else if ($tooltip.find('.CombatTriggersSetting_combatTriggersEditMenu__QL_kp').length > 0) {
        updateTriggersTooltip($tooltip);
      }
    }
  }

  const manager = new LoadoutManager();
  const domMonitor = new DomMonitor();

  // For debug only
  // eslint-disable-next-line no-unused-vars
  function debugInjectJq() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/jquery@3.7.0/dist/jquery.min.js';
    document.head.appendChild(script);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // https://stackoverflow.com/a/70267397
  function interceptWebSocket(fn) {
    const property = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data');
    const data = property.get;

    function lookAtMessage() {
      const msg = data.call(this);
      if (!(this.currentTarget instanceof WebSocket)) {
        return msg;
      }
      Object.defineProperty(this, 'data', { value: msg }); //anti-loop
      fn(msg);
      return msg;
    }

    property.get = lookAtMessage;
    Object.defineProperty(MessageEvent.prototype, 'data', property);
  }

  // https://github.com/facebook/react/issues/10135#issuecomment-314441175
  function changeReactInput($element, value) {
    if ($element.length === 0) {
      return;
    }
    const element = $element[0];
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // https://stackoverflow.com/a/53754780
  function changeReactSelect($element, value) {
    $element.val(value)[0]?.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function validatePrefix(s, prefix) {
    return s.startsWith(prefix) && /^[a-z0-9_]+$/.test(s.slice(prefix.length));
  }

  function validateLoadoutData(data) {
    if (
      data.abilities.length !== 5 ||
      !data.abilities.every((x) => validatePrefix(x.abilityHrid, ABILITY_HRID_PREFIX) || x.abilityHrid === '')
    ) {
      throw new Error('Invalid abilities');
    }
    if (
      data.drinks.length !== 3 ||
      !data.drinks.every((x) => validatePrefix(x.itemHrid, ITEM_HRID_PREFIX) || x.itemHrid === '')
    ) {
      throw new Error('Invalid drinks');
    }
    if (
      data.food.length !== 3 ||
      !data.food.every((x) => validatePrefix(x.itemHrid, ITEM_HRID_PREFIX) || x.itemHrid === '')
    ) {
      throw new Error('Invalid food');
    }
    for (const [key, triggers] of Object.entries(data.triggerMap)) {
      if (!validatePrefix(key, ABILITY_HRID_PREFIX) && !validatePrefix(key, ITEM_HRID_PREFIX)) {
        throw new Error('Invalid trigger key');
      }
      if (
        !triggers.every(
          (x) =>
            validatePrefix(x.comparatorHrid, TRIGGER_COMPARATOR_PREFIX) &&
            validatePrefix(x.conditionHrid, TRIGGER_CONDITION_PREFIX) &&
            validatePrefix(x.dependencyHrid, TRIGGER_DEPENDENCY_PREFIX) &&
            Number.isFinite(x.value),
        )
      ) {
        throw new Error(`Invalid trigger of "${key}"`);
      }
    }
    if (
      !data.equipment.every(
        (x) =>
          validatePrefix(x.itemHrid, ITEM_HRID_PREFIX) &&
          validatePrefix(x.itemLocationHrid, LOCATION_HRID_PREFIX) &&
          x.enhancementLevel >= 0,
      )
    ) {
      throw new Error('Invalid equipment');
    }
  }

  function parseLoadoutData(str) {
    const data = JSON.parse(str);
    const loadoutData = {
      abilities: data.abilities.slice(0, 5),
      drinks: data.drinks['/action_types/combat'].slice(0, 3),
      food: data.food['/action_types/combat'].slice(0, 3),
      equipment: data.player.equipment,
      triggerMap: data.triggerMap,
    };
    validateLoadoutData(loadoutData);
    return loadoutData;
  }

  function formatTriggers(triggers) {
    const lines = triggers.map((x) =>
      [
        x.dependencyHrid.slice(TRIGGER_DEPENDENCY_PREFIX.length),
        x.conditionHrid.slice(TRIGGER_CONDITION_PREFIX.length),
        x.comparatorHrid.slice(TRIGGER_COMPARATOR_PREFIX.length),
        x.value.toString(),
      ].join(' '),
    );
    return lines.join('\n');
  }

  function renderLoadoutDetails($row, loadout) {
    const $summary = $row.find('.lmLoadoutSummary');
    const $details = $row.find('.lmLoadoutDetails');
    for (const [location, [r, c]] of Object.entries(EQUIPMENT_GRID_POSITION)) {
      const $item = $(LOADOUT_ITEM_HTML);
      $item.attr('data-lm-location', location);
      const item = loadout.data.equipment.find((x) => x.itemLocationHrid === `${LOCATION_HRID_PREFIX}${location}`);
      if (item) {
        $item.find('.lmItemIcon use').attr('href', ITEM_HREF_PREFIX + item.itemHrid.slice(ITEM_HRID_PREFIX.length));
        if (item.enhancementLevel > 0) {
          $item.find('.lmEnhancementLevel').text(`+${item.enhancementLevel}`);
        }
        if (manager.compareEquipment(location, loadout)) {
          $item.addClass('lmBad');
          $summary.append($item.clone());
        }
      }
      $item.css('grid-row', r);
      $item.css('grid-column', c);
      if (location === 'two_hand') {
        if (item) {
          $details.find('[data-lm-location=main_hand]').remove();
        } else {
          continue;
        }
      }
      $details.eq(0).append($item);
    }
    for (const [type, slotInfo] of Object.entries(SLOT_WITH_TRIGGERS)) {
      for (let i = 0; i < loadout.data[type].length; i++) {
        const item = loadout.data[type][i];
        const $item = $(LOADOUT_ITEM_HTML);
        if (item[slotInfo.hridField] !== '') {
          $item
            .find('.lmItemIcon use')
            .attr('href', slotInfo.hrefPrefix + item[slotInfo.hridField].slice(slotInfo.hridPrefix.length));
        }
        const highlight = manager.compareSlotWithTriggers(type, i, loadout);
        if ('slot' in highlight) {
          $item.addClass('lmBad');
          $summary.append($item.clone());
        } else if ('triggers' in highlight) {
          $item.attr('title', formatTriggers(highlight.triggers));
          $summary.append($item.clone());
          $item.addClass('lmBadTriggers');
        }
        $item.css('grid-row', slotInfo.gridPosition[0]);
        $item.css('grid-column', slotInfo.gridPosition[1] + i);
        $details.eq(slotInfo.gridIndex).append($item);
      }
    }
  }

  function refreshLoadouts(activeName) {
    const $content = $('#lmLoadoutList');
    $content.empty();
    for (const loadout of manager.loadouts) {
      const $row = $(LOADOUT_HTML);
      $row.find('.lmLoadoutName').text(loadout.name);
      $row.attr('data-lm-name', loadout.name);
      renderLoadoutDetails($row, loadout);
      if (loadout === manager.selected) {
        $row.addClass('lmCurrent');
      }
      if (loadout.name === activeName) {
        $row.addClass('lmActive');
      }
      $content.append($row);
    }
    $content.find('.lmLoadout').on('click', function () {
      const $this = $(this);
      const isActive = $this.hasClass('lmActive');
      $content.find('.lmLoadout').removeClass('lmActive');
      $this.toggleClass('lmActive', !isActive);
      const $confirming = $content.find('.lmConfirming');
      $confirming.removeClass('lmConfirming');
      $confirming.removeClass('lmConfirmed');
    });
    $content.find('.lmSelect').on('click', function () {
      const name = $(this).closest('.lmLoadout').attr('data-lm-name');
      manager.select(name);
      refreshLoadouts(name);
      domMonitor.refresh();
      return false; // stop propagation
    });
    $content.find('.lmDelete').on('click', function () {
      const $this = $(this);
      if ($this.hasClass('lmConfirmed')) {
        const name = $this.closest('.lmLoadout').attr('data-lm-name');
        manager.delete(name);
        refreshLoadouts(null);
      } else if (!$this.hasClass('lmConfirming')) {
        $this.addClass('lmConfirming');
        setTimeout(() => {
          if ($this.hasClass('lmConfirming')) {
            $this.addClass('lmConfirmed');
          }
        }, 1000);
      }
      return false; // stop propagation
    });
    $content.find('.lmDeselect').on('click', function () {
      const name = $(this).closest('.lmLoadout').attr('data-lm-name');
      manager.deselect();
      refreshLoadouts(name);
      domMonitor.refresh();
      return false; // stop propagation
    });
  }

  function checkLoadoutName(name) {
    if (name.length === 0) {
      return 'Empty name';
    }
    if (manager.loadouts.some((x) => x.name === name)) {
      return 'Duplicate name';
    }
  }

  function saveImportedLoadout() {
    const $importTab = $('#lmImportTab');
    $importTab.find('.lmError').hide();
    const name = $importTab.find('input').val().trim();
    const dataStr = $importTab.find('textarea').val();

    const nameError = checkLoadoutName(name);
    if (nameError) {
      $importTab.find('.lmError[data-lm-field="name"]').text(nameError).show();
      return;
    }
    let data;
    try {
      data = parseLoadoutData(dataStr);
    } catch (err) {
      $importTab
        .find('.lmError[data-lm-field="data"]')
        .text(`Invalid data: ${String(err)}`)
        .show();
      return;
    }
    manager.add({ name, data });

    $importTab.find('input').val('');
    $importTab.find('textarea').val('');
    $('.lmModalContent .lmTabButton[data-lm-tab="lmSelectTab"]').trigger('click');
    refreshLoadouts(name);
  }

  function saveCurrentLoadout() {
    const $tab = $('#lmCurrentTab');
    $tab.find('.lmError').hide();
    const name = $tab.find('input').val().trim();

    const nameError = checkLoadoutName(name);
    if (nameError) {
      $tab.find('.lmError[data-lm-field="name"]').text(nameError).show();
      return;
    }
    manager.addCurrent(name);

    $tab.find('input').val('');
    $('.lmModalContent .lmTabButton[data-lm-tab="lmSelectTab"]').trigger('click');
    refreshLoadouts(name);
  }

  function showSettingModal() {
    const $modal = $(SETTING_MODAL_HTML);
    $modal.insertAfter($('.GamePage_gamePage__ixiPl').first());
    $modal.find('.Modal_background__2B88R').on('click', closeSettingModal);
    $modal.find('.Modal_closeButton__3eTF7').on('click', closeSettingModal);
    $modal.find('.lmTabButton').on('click', function () {
      const $this = $(this);
      $this.siblings().removeClass('lmActive');
      $this.addClass('lmActive');
      const tabName = this.dataset.lmTab;
      const $modal = $this.closest('.lmModalContent');
      $modal.find('.lmModalTabContent').removeClass('lmActive');
      $modal.find(`#${tabName}`).addClass('lmActive');
      $modal.find('.lmError').hide();
    });
    $modal.find('#lmImportSave').on('click', saveImportedLoadout);
    $modal.find('#lmSaveCurrent').on('click', saveCurrentLoadout);
    refreshLoadouts(null);
  }

  function closeSettingModal() {
    $('#lmSettingModal').remove();
  }

  function onWebSocketMessage(msg) {
    try {
      const parsed = JSON.parse(msg);
      switch (parsed.type) {
        case 'init_character_data':
          manager.onInitCharacterData(parsed);
          break;
        case 'action_type_consumable_slots_updated':
          manager.onConsumableSlotsUpdated(parsed);
          break;
        case 'items_updated':
          manager.onItemsUpdated(parsed);
          break;
        case 'abilities_updated':
          manager.onAbilitiesUpdated(parsed);
          break;
        case 'combat_triggers_updated':
          manager.onCombatTriggersUpdated(parsed);
          break;
        default:
          return;
      }
      domMonitor.refresh();
    } catch (err) {
      console.log('[Loadout Manager] error parsing websocket message', err);
      return;
    }
  }

  function addEntryButtonInEquipmentPanel(panel) {
    const $entry = $(PANEL_ENTRY_HTML);
    $entry.find('.lmEntry').on('click', showSettingModal);
    $(panel).find('[class=EquipmentPanel_title__CY-rf]').first().after($entry);
  }

  function addEntryButtonInAbilitiesPanel(panel) {
    const $entry = $(PANEL_ENTRY_HTML);
    $entry.find('.lmEntry').on('click', showSettingModal);
    $(panel).find('[class=AbilitiesPanel_title__2_8WC]').first().after($entry);
  }

  function updateEntryButtonInCombatSettings(container) {
    const $container = $(container);
    let $entry = $container.find('.lmCombatEntry');
    if ($entry.length === 0) {
      $entry = $(COMBAT_ENTRY_HTML);
      $entry.find('.lmEntry').on('click', showSettingModal);
      $container.append($entry);
    }
    const isCorrect = manager.compareSelectedAndCurrent();
    $entry.toggleClass('lmEntryCorrect', manager.selected !== null && isCorrect);
    $entry.toggleClass('lmEntryWrong', manager.selected !== null && !isCorrect);
  }

  function highlightEquipments(container) {
    const $equipments = $(container).children();
    $equipments.each(function () {
      const $equipment = $(this);
      const r = Number($equipment.css('grid-row-start'));
      const c = Number($equipment.css('grid-column-start'));
      const locations = Object.entries(EQUIPMENT_GRID_POSITION)
        .filter(([, pos]) => r === pos[0] && c === pos[1])
        .map(([location]) => location);
      for (const location of locations) {
        const item = manager.compareEquipment(location);
        $equipment.toggleClass('lmHighlight', item !== null);
        $equipment.data('lmItem', item);
        if (item !== null) {
          break;
        }
      }
    });
  }

  function highlightConsumables(container) {
    const $container = $(container);
    const $slots = $container.find('.ConsumableSlot_consumableSlotContainer__2DwgD');
    if ($slots.length !== 6) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      const $slot = $slots.eq(i);
      const highlight = manager.compareSlotWithTriggers('food', i);
      $slot.toggleClass('lmHighlight', 'slot' in highlight);
      $slot.toggleClass('lmHighlightTriggers', 'triggers' in highlight);
      $slot.data('lmItem', highlight.slot);
      $slot.data('lmTriggers', highlight.triggers);
    }
    for (let i = 0; i < 3; i++) {
      const $slot = $slots.eq(i + 3);
      const highlight = manager.compareSlotWithTriggers('drinks', i);
      $slot.toggleClass('lmHighlight', 'slot' in highlight);
      $slot.toggleClass('lmHighlightTriggers', 'triggers' in highlight);
      $slot.data('lmItem', highlight.slot);
      $slot.data('lmTriggers', highlight.triggers);
    }
  }

  function highlightAbilities(container) {
    const $container = $(container);
    const $slots = $container.find('.AbilitySlot_abilitySlot__22oxh');
    if ($slots.length !== 5) {
      return;
    }
    for (let i = 0; i < 5; i++) {
      const $slot = $slots.eq(i);
      const highlight = manager.compareSlotWithTriggers('abilities', i);
      $slot.toggleClass('lmHighlight', 'slot' in highlight);
      $slot.toggleClass('lmHighlightTriggers', 'triggers' in highlight);
      $slot.data('lmAbility', highlight.slot);
      $slot.data('lmTriggers', highlight.triggers);
    }
  }

  function highlightCombatUnit(combatUnit) {
    const $combatUnit = $(combatUnit);
    const name = $combatUnit.find('.CombatUnit_name__1SlO1').text();
    if (name !== manager.playerName) {
      return;
    }
    $combatUnit.toggleClass('lmCombatUnitWrongLoadout', !manager.compareSelectedAndCurrent());
  }

  function updateItemTooltip($tooltip) {
    const tooltipId = $tooltip.attr('id');
    const item = $(`[aria-labelledby="${tooltipId}"]`).closest('.lmHighlight').data('lmItem');
    if (!item) {
      return;
    }
    if (item.itemHrid === '') {
      $tooltip.find('.ItemSelector_removeButton__3i8Lj').addClass('lmPick');
      return;
    }
    const itemName = item.itemHrid.slice(ITEM_HRID_PREFIX.length);
    const $items = $tooltip.find(`use[href$="#${itemName}"]`).closest('.ItemSelector_itemContainer__3olqe');
    let isMatched;
    if ('enhancementLevel' in item) {
      let $matched = null;
      let $best = null;
      let bestLevel = item.enhancementLevel;
      $items.each(function () {
        const $this = $(this);
        const level = Number($this.find('.Item_enhancementLevel__19g-e').text());
        if (level === item.enhancementLevel) {
          $matched = $this;
        }
        if (level > bestLevel) {
          $best = $this;
        }
      });
      $matched?.addClass('lmPick');
      $best?.addClass('lmPick');
      $best?.toggleClass('lmPickSecond', $matched !== null && $best !== null);
      isMatched = $matched !== null || $best !== null;
    } else {
      $items.first().addClass('lmPick');
      isMatched = $items.length > 0;
    }
    if (!isMatched) {
      $tooltip.find('.ItemSelector_menu__12sEM').before(NO_PICK_NOTE_HTML);
    }
  }

  function updateAbilitiesTooltip($tooltip) {
    const tooltipId = $tooltip.attr('id');
    const ability = $(`[aria-labelledby="${tooltipId}"]`).closest('.lmHighlight').data('lmAbility');
    if (!ability) {
      return;
    }
    if (ability.abilityHrid === '') {
      $tooltip.find('.AbilitySlot_removeButton__1GpmP').addClass('lmPick');
      return;
    }
    const abilityName = ability.abilityHrid.slice(ABILITY_HRID_PREFIX.length);
    const $svgUse = $tooltip.find(`use[href$="${abilityName}"]`);
    if ($svgUse.length > 0) {
      const $grid = $tooltip.find('.AbilitySlot_availableAbilities__s-5qp');
      $grid.children().addClass('lmTemp');
      $svgUse.closest('.lmTemp').addClass('lmPick');
      $grid.children().removeClass('lmTemp');
    } else {
      $tooltip.find('.AbilitySlot_abilitySelector__kwDWq').before(NO_PICK_NOTE_HTML);
    }
  }

  function updateTriggersTooltip($tooltip) {
    const tooltipId = $tooltip.attr('id');
    const triggers = $(`[aria-labelledby="${tooltipId}"]`).closest('.lmHighlightTriggers').data('lmTriggers');
    if (!triggers) {
      return;
    }
    const $button = $(SET_TRIGGERS_BUTTON_HTML);
    $tooltip.find('.Button_success__6d6kU').before($button);
    $button.on('click', async function () {
      $button.off('click');
      $button.text('Please wait');
      $button.addClass('Button_disabled__wCyIq');
      // Add/remove trigger inputs
      const REMOVE_SELECTOR = '.CombatTriggersSetting_removeButtonContainer__dpk_o .Button_warning__1-AMI';
      const oldCount = $tooltip.find(REMOVE_SELECTOR).length;
      for (let i = 0; i < oldCount - triggers.length; i++) {
        const $remove = $tooltip.find(REMOVE_SELECTOR).last();
        while ($remove.hasClass('Button_disabled__wCyIq')) {
          await sleep(100);
        }
        $remove.trigger('click');
      }
      for (let i = 0; i < triggers.length - oldCount; i++) {
        const $addCondition = $tooltip
          .find('.CombatTriggersSetting_buttonContainer__1NSkb .Button_button__1Fe9z')
          .first();
        while ($addCondition.hasClass('Button_disabled__wCyIq')) {
          await sleep(100);
        }
        $addCondition.trigger('click');
      }
      // Set each trigger
      const $groups = $tooltip.find('.CombatTriggersSetting_inputs__2lxPR');
      if ($groups.length !== triggers.length) {
        $button.text('Unexpected dropdown count');
        return;
      }
      for (let i = 0; i < triggers.length; i++) {
        const trigger = triggers[i];
        const $group = $groups.eq(i);
        changeReactSelect($group.find('.CombatTriggersSetting_dependencySelect__3foBB'), trigger.dependencyHrid);
        changeReactSelect($group.find('.CombatTriggersSetting_conditionSelect__njiG5'), trigger.conditionHrid);
        changeReactSelect($group.find('.CombatTriggersSetting_comparatorSelect__tFrQS'), trigger.comparatorHrid);
        changeReactInput($group.find('.CombatTriggersSetting_valueInput__3B34p'), trigger.value.toString());
      }

      $button.text('Done. Please click Save.');
    });
  }

  function main() {
    // debugInjectJq();
    GM_addStyle(CSS);
    interceptWebSocket(onWebSocketMessage);
    domMonitor.run();
  }

  main();
})();