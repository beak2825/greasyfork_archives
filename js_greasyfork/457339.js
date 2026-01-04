// ==UserScript==
// @name         Antimatter Dimensions - Max All Autoclicker & Active Farming Automator
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  Add a checkbox to spam click the "buy max" button
// @author       Shamus03
// @license      MIT
// @match        https://ivark.github.io/AntimatterDimensions/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ivark.github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457339/Antimatter%20Dimensions%20-%20Max%20All%20Autoclicker%20%20Active%20Farming%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/457339/Antimatter%20Dimensions%20-%20Max%20All%20Autoclicker%20%20Active%20Farming%20Automator.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const main = () => {
    const maxAllAutobuyer = new MaxAllAutobuyer()
    const activeFarmingAutobuyer = new ActiveFarmingAutobuyer()

    window.tampermonkeyAutobuyers = {
      maxAllAutobuyer,
      activeFarmingAutobuyer,
    }

    GameKeyboard.bindHotkey('alt+m', () => maxAllAutobuyer.toggle())
    GameKeyboard.bindHotkey('alt+k', () => activeFarmingAutobuyer.toggle())
  }

  const trueMaxAll = () => {
    maxAll()
    buyMaxTickSpeed()
    InfinityDimensions.buyMax()
    ReplicantiUpgrade.chance.purchase()
    ReplicantiUpgrade.interval.purchase()
    ReplicantiUpgrade.galaxies.purchase()
    requestGalaxyReset()
    replicantiGalaxy()
    EternityUpgrade.epMult.buyMax()
    InfinityUpgrade.ipMult.buyMax()
    if (!Autobuyer.sacrifice.isUnlocked) {
      if (Sacrifice.canSacrifice && Sacrifice.nextBoost.gt(2)) {
        sacrificeReset()
      }
    }
  }

  class CustomAutobuyer {
    constructor() {
      this.interval = undefined
      if (localStorage.getItem(this.localStorageKey)) {
        this.start()
      }
    }

    onStart() {
      // Implement in child class
    }

    onStop() {
      // Implement in child class
    }

    onToggle(running) {
      // Implement in child class
    }

    tick() {
      // Implement in child class
    }

    get running() {
      return !!this.interval
    }

    get localStorageKey() {
      return 'autobuyer-enabled-' + this.constructor.name
    }

    start() {
      if (this.running) return

      this.onStart()
      localStorage.setItem(this.localStorageKey, 'true')
      this.interval = setInterval(() => this.tick(), 10)
    }

    stop() {
      if (!this.running) return

      this.onStop()
      localStorage.removeItem(this.localStorageKey)
      clearInterval(this.interval)
      this.interval = 0
    }

    toggle() {
      if (this.running) {
        this.stop()
      } else {
        this.start()
      }
      this.onToggle(this.running)
    }
  }

  class MaxAllAutobuyer extends CustomAutobuyer {
    tick() {
      trueMaxAll()
    }

    onToggle(running) {
      GameUI.notify.info(`Max All autobuyer toggled ${running ? 'on' : 'off'}`)
    }
  }

  class ActiveFarmingAutobuyer extends CustomAutobuyer {
    constructor() {
      super()
      this.timeReachedMaxReplicanti = undefined

      this.lastTimeBrokenEpPerMinuteRecord = undefined
      this.lastKnownEpPerMinuteRecord = undefined

      this.lastTimeBrokenIpPerMinuteRecord = undefined
      this.lastKnownIpPerMinuteRecord = undefined
    }

    onStart() {
      this.timeReachedMaxReplicanti = undefined

      this.lastTimeBrokenEpPerMinuteRecord = undefined
      this.lastKnownEpPerMinuteRecord = undefined

      this.lastTimeBrokenIpPerMinuteRecord = undefined
      this.lastKnownIpPerMinuteRecord = undefined
    }

    tick() {
      const [decision, message] = this.makeActiveFarmingDecision()
      if (message) {
        GameUI.notify.success('Active farming mode: ' + message)
      }
      switch (decision) {
        case 'eternity': return this.buyTimeTheoremsAndEternity()
        case 'crunch': return this.crunch()
        case 'buy': return trueMaxAll()
      }
    }

    crunch() {
      bigCrunchReset()
      this.lastTimeBrokenIpPerMinuteRecord = undefined
      this.lastKnownIpPerMinuteRecord = undefined
    }

    buyTimeTheoremsAndEternity() {
      while (TimeTheoremPurchaseType.am.purchase())
        ;
      while (TimeTheoremPurchaseType.ip.purchase())
        ;

      EternityUpgrade.epMult.buyMax()

      eternity()

      EternityUpgrade.epMult.buyMax()

      for (let d = 8; d >= 1; d--) {
        buyMaxTimeDimension(d)
      }

      while (TimeTheoremPurchaseType.ep.purchase())
        ;

      this.timeReachedMaxReplicanti = undefined
      this.lastTimeBrokenEpPerMinuteRecord = undefined
      this.lastKnownEpPerMinuteRecord = undefined
      this.lastTimeBrokenIpPerMinuteRecord = undefined
      this.lastKnownIpPerMinuteRecord = undefined
    }

    get secondsSinceLastBrokenEpRecord() {
      if (!this.lastTimeBrokenEpPerMinuteRecord) {
        return 0
      }
      const t = Time.thisEternity.totalSeconds - this.lastTimeBrokenEpPerMinuteRecord
      if (t < 0) {
        this.lastTimeBrokenEpPerMinuteRecord = undefined
        this.lastKnownEpPerMinuteRecord = undefined
        return 0
      }
      return t
    }

    get secondsSinceLastBrokenIpRecord() {
      if (!this.lastTimeBrokenIpPerMinuteRecord) {
        return 0
      }
      const t = Time.thisInfinity.totalSeconds - this.lastTimeBrokenIpPerMinuteRecord
      if (t < 0) {
        this.lastTimeBrokenIpPerMinuteRecord = undefined
        this.lastKnownIpPerMinuteRecord = undefined
        return 0
      }
      return t
    }

    makeActiveFarmingDecision() {
      const bestIpPerMinute = player.records.thisInfinity.bestIPmin
      if (!this.lastKnownIpPerMinuteRecord || bestIpPerMinute.gt(this.lastKnownIpPerMinuteRecord)) {
        this.lastKnownIpPerMinuteRecord = bestIpPerMinute
        this.lastTimeBrokenIpPerMinuteRecord = Time.thisInfinity.totalSeconds
      }

      const bestEpPerMinute = player.records.thisEternity.bestEPmin
      if (!this.lastKnownEpPerMinuteRecord || bestEpPerMinute.gt(this.lastKnownEpPerMinuteRecord)) {
        this.lastKnownEpPerMinuteRecord = bestEpPerMinute
        this.lastTimeBrokenEpPerMinuteRecord = Time.thisEternity.totalSeconds
      }

      if (player.timestudy.studies.includes(121) && Player.canEternity && !player.dilation.active && Math.clamp(250 / Player.averageRealTimePerEternity, 1, 50) < 50) {
        return ['eternity', 'Doing quick eternities to prep TS121']
      }

      if (player.eternityPoints.eq(0)) {
        if (Player.canCrunch && this.secondsSinceLastBrokenIpRecord > 10) {
          return ['crunch', 'Progress is slowing down - time to crunch']
        }
      }

      if (Replicanti.galaxies.max === 0 || Replicanti.galaxies.total < Replicanti.galaxies.max) {
        this.timeReachedMaxReplicanti = undefined
      } else if (Replicanti.galaxies.total === Replicanti.galaxies.max && this.timeReachedMaxReplicanti === undefined) {
        this.timeReachedMaxReplicanti = Time.thisInfinity.totalSeconds
      }

      if (!player.timestudy.studies.includes(181)) {
        if (this.timeReachedMaxReplicanti && Time.thisInfinity.totalSeconds - this.timeReachedMaxReplicanti > 5) {
          const lastInfinity = player.records.lastTenInfinities[0]
          const infinityBefore = player.records.lastTenInfinities[1]
          if (lastInfinity && infinityBefore) {
            const ipGainedLastInfinity = lastInfinity[1]
            const ipGainedInfinityBefore = infinityBefore[1]
            if (ipGainedLastInfinity.dividedBy(ipGainedInfinityBefore).lt(1e10)) {
              return ['eternity', 'Progress is slowing down - time to eternity']
            }
          }
          return ['crunch', 'You have been at max RG for 5 seconds, time to crunch']
        }
      }

      if (Time.thisEternity.totalSeconds > 10 && Player.canEternity && !player.dilation.active) {
        if (player.timestudy.studies.includes(181)) {
          if (this.secondsSinceLastBrokenEpRecord > 10) {
            return ['eternity', 'Progress is slowing down - time to eternity']
          }
        }
      }

      return ['buy', '']
    }

    onToggle(running) {
      GameUI.notify.info(`Active farming mode toggled ${running ? 'on' : 'off'}`)
    }
  }

  main()

  })()