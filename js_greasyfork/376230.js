// ==UserScript==
// @name         AutoHeal (bez pełnego leczenia)
// @author       Reskiezis
// @description  Dodatek do gry Margonem
// @version      1.0
// @match        http://*.margonem.pl/
// @match        http://*.margonem.com/
// @grant        none
// @namespace    https://greasyfork.org/users/233329
// @downloadURL https://update.greasyfork.org/scripts/376230/AutoHeal%20%28bez%20pe%C5%82nego%20leczenia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376230/AutoHeal%20%28bez%20pe%C5%82nego%20leczenia%29.meta.js
// ==/UserScript==

;((Engine, hero) => {
  'use strict'

  //maksymalna ilość uleczeń po każdej walce
  const MAXIMUM_HEALING_ITEMS_USES = 20

  const prop = key => object =>
    object[key]

  const getHeroStats = () =>
    hero.warrior_stats

  const getItemsInsideBags = () =>
    Engine.items.fetchLocationItems('g')
    .map(
      ({ id, name, _cachedStats }) => ({
        ..._cachedStats,
        id,
        name
      })
    )

  const isHeroDead = () =>
    Engine.dead

  const getRemainingHealth = ({ hp, maxhp }) =>
    maxhp - hp

  const hasLvlSmallerThan = lvlToCompare =>
    ({ lvl }) =>
      lvl === undefined ||
      lvl < lvlToCompare

  const withoutTimeLimits = ({ timelimit }) =>
    timelimit === undefined

  const getPartialHealingItems = ({ lvl }) =>
    getItemsInsideBags()
    .filter(prop('leczy'))
    .filter(hasLvlSmallerThan(lvl))
    .filter(withoutTimeLimits)
    .sort((a, b) => b.leczy - a.leczy)

  const isHealingEqualOrLessThan = value =>
    ({ leczy }) =>
      leczy <= value

  const autoHeal = ({ handleFinish, ticks = 1 }) => {
    const remainingHealth = getRemainingHealth(
      getHeroStats()
    )

    if(remainingHealth === 0){
      handleFinish()
      return
    }

    const healingItemToUse = getPartialHealingItems({ lvl: hero.lvl })
      .find(
        isHealingEqualOrLessThan(remainingHealth)
      )

    //there is no item we can use
    if(healingItemToUse === undefined){
      handleFinish()
      return
    }

    _g(`moveitem&st=1&id=${healingItemToUse.id}`)
    console.log(`${(new Date).toLocaleTimeString()}: Używam "${healingItemToUse.name}" (${healingItemToUse.leczy}hp z ${remainingHealth}hp)`)

    if(MAXIMUM_HEALING_ITEMS_USES === ticks){
      console.log(`AutoHeal: maksymalna ilość uleczeń (${MAXIMUM_HEALING_ITEMS_USES})`)
      handleFinish()
      return
    }

    //_g callback is not called after lag
    setTimeout(autoHeal, (Engine.lag*50+50)*2, { handleFinish, ticks: ticks + 1 })
  }

  let isHealing = false
  const handleCloseBattle = () => {
    //'close_battle' is sometimes emitted twice (maybe by other addon)
    if(isHealing)
      return

    if(isHeroDead())
      return

    isHealing = true
    autoHeal({
      handleFinish(){
        isHealing = false
      }
    })
  }

  API.addCallbackToEvent('close_battle', handleCloseBattle)
})(window.Engine, window.Engine.hero.d);