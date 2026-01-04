// ==UserScript==
// @name         Melvor Auto Miner
// @namespace    https://github.com/shamus03
// @version      1.6
// @description  Helpful tool for auto-mining in Melvor
// @author       Shamus03
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424725/Melvor%20Auto%20Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/424725/Melvor%20Auto%20Miner.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const bus = document.createElement('div')

  const getItemQuantityInBank = itemId => {
    let qty = 0
    for (const item of bank) {
      if (item.id === itemId) {
        qty += item.qty
      }
    }
    return qty
  }

  const tryTriggerSemiSkillChanged = () => {
    SEMIEventBus && typeof SEMIEventBus.TriggerSkillChanged === 'function' && SEMIEventBus.TriggerSkillChanged()
  }

  const trySelectOre = ore => {
    if (rockData[ore].depleted) {
      return false
    }
    if (ore !== currentRock) {
      setTimeout(() => {
        mineRock(ore, true)
        tryTriggerSemiSkillChanged()
      })
    }
    return true
  }

  const ORES = {
    Rune_Essence: 10,
    Copper: 0,
    Tin: 1,
    Iron: 2,
    Coal: 3,
    Silver: 4,
    Gold: 5,
    Mithril: 6,
    Adamantite: 7,
    Runite: 8,
    Dragonite: 9,
  }

  const ORE_ITEM_IDS = {
    [ORES.Rune_Essence]: CONSTANTS.item.Rune_Essence,
    [ORES.Copper]: CONSTANTS.item.Copper_Ore,
    [ORES.Tin]: CONSTANTS.item.Tin_Ore,
    [ORES.Iron]: CONSTANTS.item.Iron_Ore,
    [ORES.Coal]: CONSTANTS.item.Coal_Ore,
    [ORES.Silver]: CONSTANTS.item.Silver_Ore,
    [ORES.Gold]: CONSTANTS.item.Gold_Ore,
    [ORES.Mithril]: CONSTANTS.item.Mithril_Ore,
    [ORES.Adamantite]: CONSTANTS.item.Adamantite_Ore,
    [ORES.Runite]: CONSTANTS.item.Runite_Ore,
    [ORES.Dragonite]: CONSTANTS.item.Dragonite_Ore,
  }

  const BAR_RATIOS = {}
  for (const item of items) {
    if (item.type !== 'Bar') continue

    const ratios = {}
    for (const reqItem of item.smithReq) {
      ratios[items[reqItem.id].miningID] = reqItem.qty
    }
    BAR_RATIOS[item.id] = ratios
  }

  const ADDITIONAL_OPTIONS = {
    None: 'None',
    Lowest_Mastery: 'Lowest_Mastery',
    Highest_Ore_Not_Maxed: 'Highest_Ore_Not_Maxed',
  }

  const localStorageKey = 'mep-auto-mine-last-selected-bar'

  let selectedBar = localStorage.getItem(localStorageKey)
  if (selectedBar === '') {
    selectedBar = ADDITIONAL_OPTIONS.None
  }

  const trySetupBarSelection = () => {
    const container = document.getElementById('mining-ores-container')
    if (!container) return false

    const spacer = document.createElement('div')
    spacer.classList.add('col-12')

    const col = document.createElement('div')
    col.classList.add('col-auto')

    const lbl = document.createElement('label')
    lbl.classList.add('form-group', 'form-inline', 'block', 'block-content', 'block-content-full', 'border-4x', 'border-mining', 'border-top')
    lbl.innerText = 'Auto-Mining:'
    lbl.innerH
    col.append(lbl)

    const sel = document.createElement('select')
    sel.classList.add('form-control', 'ml-2')
    lbl.append(sel)
    sel.addEventListener('change', () => {
      selectedBar = sel.value
      localStorage.setItem(localStorageKey, selectedBar)
    })

    const addOption = (text, value) => {
      const opt = document.createElement('option')
      opt.innerText = text
      opt.value = value
      sel.append(opt)
    }

    addOption('None', ADDITIONAL_OPTIONS.None)
    for (const itemId in BAR_RATIOS) {
      const item = items[itemId]
      addOption(item.name, itemId)
    }
    for (const k in ADDITIONAL_OPTIONS) {
      if (k === ADDITIONAL_OPTIONS.None) continue
      const name = k.replace(/_/g, ' ')
      addOption(name, k)
    }
    sel.value = selectedBar

    container.prepend(spacer)
    container.prepend(col)
    return true
  }

  (async function() {
    while (!trySetupBarSelection()) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  })()

  const getOreMasteryLevel = ore => {
    return MASTERY[CONSTANTS.skill.Mining].xp[ore]
  }

  const getOrePriority = () => {
    switch (selectedBar) {
      case ADDITIONAL_OPTIONS.Lowest_Mastery:
        const levels = {}
        for (const ore of Object.values(ORES)) {
          levels[ore] = getOreMasteryLevel(ore)
        }
        return Object.values(ORES).sort((a, b) => levels[a] - levels[b])
      case ADDITIONAL_OPTIONS.Highest_Ore_Not_Maxed:
        const prios = {}
        for (const ore of Object.values(ORES).reverse()) {
          prios[ore] = getOreMasteryLevel(ore) < 13034431 ? 1 : 0
        }
        return Object.values(ORES).reverse().sort((a, b) => prios[b] - prios[a])
    }

    const selectedRatios = BAR_RATIOS[selectedBar] || {}

    const currentRatios = {}
    for (const ore of Object.values(ORES)) {
      const qty = getItemQuantityInBank(ORE_ITEM_IDS[ore])
      const needRatio = selectedRatios[ore] || 0

      currentRatios[ore] = (needRatio > 0)
        ? qty === 0 ? 0 : qty / needRatio
      : Infinity
    }

    return Object.values(ORES).sort((a, b) => currentRatios[a] - currentRatios[b])
  }

  const selectBestOre = () => {
    const orePriority = getOrePriority()

    for (const ore of orePriority) {
      if (trySelectOre(ore)) {
        return
      }
    }
  }

  const utils = {
    selectBestOre,
    getItemQuantityInBank,
    getOrePriority,
  }

  const events = {
    rockDamaged: 'rock-damaged',
    rockRespawned: 'rock-respawned',
    glovesChargesDecreased: 'gloves-charges-decreased',
  }

  const originalFunctions = {}
  const wrap = (name, handler) => {
    originalFunctions[name] = window[name]
    window[name] = function(...args) {
      const result = originalFunctions[name](...args)
      try {
        handler(...args)
      } catch(ex) {
        console.error(ex)
      }
      return result
    }
  }

  wrap('updateRockHP', (ore) => {
    const { depleted, damage } = rockData[ore]
    if (damage === 0) {
      bus.dispatchEvent(new CustomEvent(events.rockRespawned, {detail:{ore}}))
    } else {
      bus.dispatchEvent(new CustomEvent(events.rockDamaged, {detail:{ore,depleted,damage}}))
    }
  })

  wrap('updateGloves', (gloves, skill) => {
    const { isActive, remainingActions } = glovesTracker[gloves]
    bus.dispatchEvent(new CustomEvent(events.glovesChargesDecreased, {detail:{gloves,skill,isActive,remainingActions}}))
  })

  bus.addEventListener(events.rockDamaged, e => {
    if (isMining && selectedBar !== ADDITIONAL_OPTIONS.None) {
      selectBestOre()
    }
  })

  const getEquippedGloves = () => {
    return combatManager.player.equipmentSets[combatManager.player.selectedEquipmentSet].slots.Gloves.item
  }

  bus.addEventListener(events.glovesChargesDecreased, ({ detail: { gloves, skill, isActive, remainingActions }}) => {
    const equippedGloves = getEquippedGloves()
    if (!isActive || remainingActions > 1 || !equippedGloves || equippedGloves.gloveID !== gloves) return

    const haveEnoughGp = gp >= glovesCost[gloves]

    switch (skill) {
      case CONSTANTS.skill.Mining:
        if (!isMining) return
        break
      case CONSTANTS.skill.Thieving:
        if (!isThieving) return
        break
      default:
        return
    }

    const oldBuyQty = buyQty
    buyQty = 1
    buyShopItem('Gloves', gloves, true)
    buyQty = oldBuyQty
  })

  window.mep = {
    bus,
    events,
    utils,
    originalFunctions,
  }
})()