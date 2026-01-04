// ==UserScript==
// @name        TheresMoreHelp
// @namespace   TheresMoreGame.com
// @match       https://www.theresmoregame.com/play/
// @grant       none
// @version     2.0.26
// @description Helper for TheresMoreGame
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/456892/TheresMoreHelp.user.js
// @updateURL https://update.greasyfork.org/scripts/456892/TheresMoreHelp.meta.js
// ==/UserScript==

;(async () => {
  let cheatsOff = true

  let scriptPaused = true
  let haveManualResourceButtons = true
  let isClicking = false
  let mainLoopRunning = false

  const buildingsList = [
    { id: 'Mausoleum of gods', alwaysBuild: true, isSafe: true },
    { id: 'Tower of mana', alwaysBuild: true, isSafe: true },
    { id: 'City of Lights', alwaysBuild: true, isSafe: true },
    { id: 'Harbor district', alwaysBuild: true, isSafe: true },
    { id: 'Stock exchange', alwaysBuild: true, isSafe: true },
    { id: 'Mana pit', alwaysBuild: true, isSafe: true },
    { id: 'Great bombard', alwaysBuild: true, isSafe: true },
    { id: 'Refugees district', alwaysBuild: true, isSafe: true },
    { id: 'Academy of Freethinkers', alwaysBuild: true, isSafe: true },
    { id: 'City center', alwaysBuild: true, isSafe: true },
    { id: 'Cathedral', alwaysBuild: true, isSafe: true },
    { id: 'Great fair', alwaysBuild: true, isSafe: true },
    { id: 'Palisade', alwaysBuild: true, isSafe: true },
    { id: 'Wall', alwaysBuild: true, isSafe: true },
    { id: 'Tower of mana part', alwaysBuild: true, isSafe: true },
    { id: 'City of Lights part', alwaysBuild: true, isSafe: true },
    { id: 'Harbor district part', alwaysBuild: true, isSafe: true },
    { id: 'Stock exchange part', alwaysBuild: true, isSafe: true },
    { id: 'Mana pit part', alwaysBuild: true, isSafe: true },
    { id: 'Great bombard part', alwaysBuild: true, isSafe: true },
    { id: 'Refugees district part', alwaysBuild: true, isSafe: true },
    { id: 'A. of Freethinkers Part', alwaysBuild: true, isSafe: true },
    { id: 'City center part', alwaysBuild: true, isSafe: true },
    { id: 'Great fair unit', alwaysBuild: true, isSafe: true },
    { id: 'Cathedral part', alwaysBuild: true, isSafe: true },
    { id: 'Guild of craftsmen', alwaysBuild: true, isSafe: true },
    { id: 'Machines of gods', alwaysBuild: true, isSafe: true },
    { id: 'Library of Theresmore', alwaysBuild: true, isSafe: true },
    { id: 'Monastery', alwaysBuild: true, isSafe: true },
    { id: 'Watchman Outpost', alwaysBuild: true, isSafe: true },
    { id: 'Hall of the dead', alwaysBuild: true, isSafe: true },
    { id: 'Sawmill', alwaysBuild: true, isSafe: true },
    { id: 'Monument', alwaysBuild: true, isSafe: true },
    { id: 'Foundry', alwaysBuild: true, isSafe: true },
    { id: 'Builder district', alwaysBuild: true, isSafe: true },
    { id: 'Gan Eden', alwaysBuild: true, isSafe: true },
    { id: 'Portal of the dead', alwaysBuild: true, isSafe: true },
    { id: 'Library of SouLs', alwaysBuild: true, isSafe: true },
    { id: 'Souls', isSafe: true },
    { id: 'Books', isSafe: true },
    { id: 'Observatory', isSafe: true },
    { id: 'The Vaults', isSafe: true },
    { id: 'Credit union', isSafe: true },
    { id: 'Canava trading post', isSafe: true },
    { id: 'Bank', isSafe: true },
    { id: 'Marketplace', isSafe: true },
    { id: 'Artisan Workshop', isSafe: true },
    { id: 'Granary', isSafe: true },
    { id: 'Hall of wisdom', isSafe: true },
    { id: 'School', isSafe: true },
    { id: 'University', isSafe: true },
    { id: 'Research plant', isSafe: true },
    { id: 'Undead Herds', isSafe: true },
    { id: 'Guarded warehouse', isSafe: true },
    { id: 'Fiefdom', isSafe: true },
    { id: 'Natronite refinery', isSafe: true },
    { id: 'Alchemical laboratory', isSafe: true },
    { id: 'Lumberjack Camp', isSafe: true },
    { id: 'Quarry', isSafe: true },
    { id: 'Mine', isSafe: true },
    { id: 'Palisade part', isSafe: true },
    { id: 'Wall part', isSafe: true },
    { id: 'Rampart', alwaysBuild: true, isSafe: true },
    { id: 'Rampart part', isSafe: true },
    { id: 'Farm', isSafe: true },
    { id: 'Matter transmuter', isSafe: true },
    { id: 'Stable', isSafe: true },
    { id: 'Spiritual garden', isSafe: true },
    { id: 'Conclave', isSafe: true },
    { id: 'Magical tower', isSafe: true },
    { id: 'Temple', isSafe: true },
    { id: 'Altar of sacrifices', isSafe: true },
    { id: 'Fountain of Prosperity', isSafe: true },
    { id: 'Valley of plenty', isSafe: true },
    { id: 'Tax revenue checkpoints', isSafe: true },
    { id: 'Industrial plant', isSafe: true },
    { id: 'Magic Circle', isSafe: true },
    { id: 'Carpenter workshop', isSafe: true },
    { id: 'Grocery', isSafe: true },
    { id: 'Steelworks', isSafe: true },
    { id: 'Military academy', isSafe: true },
    { id: 'Ancient vault', isSafe: true },
    { id: 'Recruit training center', isSafe: true },
    { id: 'Officer training ground', isSafe: true },
    { id: 'Castrum Militia', isSafe: true },
    { id: 'Mansion', isSafe: false, requires: { resource: 'Food', parameter: 'speed', minValue: 3 } },
    { id: 'City Hall', isSafe: false, requires: { resource: 'Food', parameter: 'speed', minValue: 1.5 } },
    { id: 'Residential block', isSafe: false, requires: { resource: 'Food', parameter: 'speed', minValue: 5 } },
    { id: 'Common House', isSafe: false, requires: { resource: 'Food', parameter: 'speed', minValue: 1 } },
    { id: 'Storage facility', isSafe: true },
    { id: 'Ballista', isSafe: true },
    { id: 'Large warehouse', isSafe: true },
    { id: 'Large storehouse', isSafe: true },
    { id: 'Store', isSafe: true },
    { id: 'Natronite depot', isSafe: true },
    { id: 'Barracks', isSafe: true },
    { id: 'Minefield', isSafe: true },
    { id: 'Natronite balloon', isSafe: true },
    { id: 'Decryption of the portal', isSafe: true },
    { id: 'Fortune grove', isSafe: true },
    { id: 'Pillars of mana', isSafe: false, requires: { resource: 'Gold', parameter: 'speed', minValue: 100 } },
  ]
    .filter((building) => building.id)
    .map((building, index) => {
      return {
        ...building,
        order: index,
      }
    })

  const lang = {
    pop_artisan: 'Artisan',
    pop_breeder: 'Breeder',
    pop_farmer: 'Farmer',
    pop_lumberjack: 'Lumberjack',
    pop_merchant: 'Merchant',
    pop_trader: 'Trader',
    pop_miner: 'Miner',
    pop_quarryman: 'Quarryman',
    pop_priest: 'Priest',
    pop_carpenter: 'Carpenter',
    pop_steelworker: 'Steelworker',
    pop_professor: 'Professor',
    pop_skymancer: 'Skymancer',
    pop_supplier: 'Supplier',
    pop_alchemist: 'Alchemist',
    pop_unemployed: 'Unemployed',
    pop_natro_refiner: 'Nat-Refiner',
    pop_researcher: 'Researcher',
    res_army: 'Army',
    res_coin: 'Coin',
    res_copper: 'Copper',
    res_cow: 'Cow',
    res_crystal: 'Crystal',
    res_faith: 'Faith',
    res_fame: 'Fame',
    res_food: 'Food',
    res_gold: 'Gold',
    res_horse: 'Horse',
    res_iron: 'Iron',
    res_legacy: 'Legacy',
    res_luck: 'Luck',
    res_mana: 'Mana',
    res_natronite: 'Natronite',
    res_population: 'Population',
    res_stone: 'Stone',
    res_relic: 'Relic',
    res_research: 'Research',
    res_tools: 'Tools',
    res_wood: 'Wood',
    res_building_material: 'Materials',
    res_steel: 'Steel',
    res_supplies: 'Supplies',
    res_saltpetre: 'Saltpetre',
    res_tome_wisdom: 'Tome of Wisdom',
    res_gem: 'Gem',
  }

  const allJobs = [
    {
      id: 'unemployed',
    },
    {
      id: 'farmer',
      req: [
        {
          type: 'building',
          id: 'farm',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'food',
          value: 1.6,
        },
      ],
    },
    {
      id: 'lumberjack',
      req: [
        {
          type: 'building',
          id: 'lumberjack_camp',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'wood',
          value: 0.7,
        },
      ],
    },
    {
      id: 'quarryman',
      req: [
        {
          type: 'building',
          id: 'quarry',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'stone',
          value: 0.6,
        },
      ],
    },
    {
      id: 'miner',
      req: [
        {
          type: 'building',
          id: 'mine',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'copper',
          value: 0.5,
        },
        {
          type: 'resource',
          id: 'iron',
          value: 0.3,
        },
      ],
    },
    {
      id: 'artisan',
      req: [
        {
          type: 'building',
          id: 'artisan_workshop',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'gold',
          value: 0.5,
        },
        {
          type: 'resource',
          id: 'tools',
          value: 0.3,
        },
      ],
    },
    {
      id: 'merchant',
      req: [
        {
          type: 'building',
          id: 'marketplace',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'gold',
          value: 3,
        },
      ],
    },
    {
      id: 'trader',
      req: [
        {
          type: 'building',
          id: 'credit_union',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'gold',
          value: 6,
        },
      ],
    },
    {
      id: 'breeder',
      req: [
        {
          type: 'building',
          id: 'stable',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'cow',
          value: 0.2,
        },
        {
          type: 'resource',
          id: 'horse',
          value: 0.1,
        },
      ],
    },
    {
      id: 'carpenter',
      req: [
        {
          type: 'building',
          id: 'carpenter_workshop',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'building_material',
          value: 0.3,
        },
        {
          type: 'resource',
          id: 'wood',
          value: -3,
        },
        {
          type: 'resource',
          id: 'stone',
          value: -1.5,
        },
        {
          type: 'resource',
          id: 'tools',
          value: -0.5,
        },
      ],
    },
    {
      id: 'steelworker',
      req: [
        {
          type: 'building',
          id: 'steelworks',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'steel',
          value: 0.4,
        },
        {
          type: 'resource',
          id: 'copper',
          value: -1,
        },
        {
          type: 'resource',
          id: 'iron',
          value: -0.5,
        },
      ],
    },
    {
      id: 'professor',
      req: [
        {
          type: 'building',
          id: 'university',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'crystal',
          value: 0.06,
        },
        {
          type: 'resource',
          id: 'research',
          value: 1,
        },
      ],
    },
    {
      id: 'researcher',
      req: [
        {
          type: 'building',
          id: 'research_plant',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'research',
          value: 3,
        },
      ],
    },
    {
      id: 'supplier',
      req: [
        {
          type: 'building',
          id: 'grocery',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'supplies',
          value: 0.4,
        },
        {
          type: 'resource',
          id: 'food',
          value: -2,
        },
        {
          type: 'resource',
          id: 'cow',
          value: -0.2,
        },
      ],
    },
    {
      id: 'skymancer',
      req: [
        {
          type: 'building',
          id: 'observatory',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'faith',
          value: 3,
        },
        {
          type: 'resource',
          id: 'mana',
          value: 3,
        },
      ],
    },
    {
      id: 'alchemist',
      req: [
        {
          type: 'building',
          id: 'alchemic_laboratory',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'saltpetre',
          value: 0.7,
        },
      ],
    },
    {
      id: 'natro_refiner',
      req: [
        {
          type: 'building',
          id: 'natronite_refinery',
          value: 1,
        },
      ],
      gen: [
        {
          type: 'resource',
          id: 'natronite',
          value: 1,
        },
        {
          type: 'resource',
          id: 'mana',
          value: -5,
        },
        {
          type: 'resource',
          id: 'saltpetre',
          value: -0.5,
        },
      ],
    },
  ]
    .filter((job) => job.gen && job.gen.length)
    .map((job) => {
      return {
        id: lang[`pop_${job.id}`],
        gen: job.gen
          .filter((gen) => gen.type === 'resource')
          .map((gen) => {
            return {
              id: lang[`res_${gen.id}`],
              value: gen.value,
            }
          }),
      }
    })
    .map((job) => {
      return {
        id: job.id,
        isSafe: !job.gen.find((gen) => gen.value < 0),
        resourcesGenerated: job.gen
          .filter((gen) => gen.value > 0)
          .map((gen) => {
            return { id: gen.id, value: gen.value }
          }),
        resourcesUsed: job.gen
          .filter((gen) => gen.value < 0)
          .map((gen) => {
            return { id: gen.id, value: gen.value }
          }),
      }
    })

  const resourcesToTrade = ['Cow', 'Horse', 'Food', 'Copper', 'Wood', 'Stone', 'Iron', 'Tools']
  const timeToWaitUntilFullGold = 60
  const minFarmers = 5

  const sleep = (miliseconds) => new Promise((resolve) => setTimeout(resolve, miliseconds))

  // https://stackoverflow.com/a/55366435
  class NumberParser {
    constructor(locale) {
      const format = new Intl.NumberFormat(locale)
      const parts = format.formatToParts(12345.6)
      const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i))
      const index = new Map(numerals.map((d, i) => [d, i]))
      this._group = new RegExp(`[${parts.find((d) => d.type === 'group').value}]`, 'g')
      this._decimal = new RegExp(`[${parts.find((d) => d.type === 'decimal').value}]`)
      this._numeral = new RegExp(`[${numerals.join('')}]`, 'g')
      this._index = (d) => index.get(d)
    }

    parse(string) {
      let multiplier = 1
      if (string.includes('K')) {
        multiplier = 1000
      } else if (string.includes('M')) {
        multiplier = 1000000
      }

      return (string = string.replace('K', '').replace('M', '').trim().replace(this._group, '').replace(this._decimal, '.').replace(this._numeral, this._index))
        ? +string * multiplier
        : NaN
    }
  }
  const numberParser = new NumberParser()

  const formatTime = (timeToFormat) => {
    const timeValues = {
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
    }

    let timeShort = ''
    let timeLong = ''

    timeValues.seconds = timeToFormat % 60
    timeToFormat = (timeToFormat - (timeToFormat % 60)) / 60
    timeValues.minutes = timeToFormat % 60
    timeToFormat = (timeToFormat - (timeToFormat % 60)) / 60
    timeValues.hours = timeToFormat % 24
    timeToFormat = (timeToFormat - (timeToFormat % 24)) / 24
    timeValues.days = timeToFormat

    if (timeValues.days) {
      timeShort += `${timeValues.days}d `
      timeLong += `${timeValues.days} days `
    }
    if (timeValues.hours) {
      timeShort += `${timeValues.hours}h `
      timeLong += `${timeValues.hours} hrs `
    }
    if (timeValues.minutes) {
      timeShort += `${timeValues.minutes}m `
      timeLong += `${timeValues.minutes} min `
    }
    if (timeValues.seconds) {
      timeShort += `${timeValues.seconds}s `
      timeLong += `${timeValues.seconds} sec `
    }

    timeShort = timeShort.trim()
    timeLong = timeLong.trim()

    return {
      timeShort,
      timeLong,
      timeValues,
    }
  }

  const logger = ({ msgLevel, msg }) => {
    const logText = `[TMH][${new Date().toLocaleTimeString()}] ${msg}`
    const levelsToLog = ['log', 'warn', 'error']

    if (levelsToLog.includes(msgLevel)) {
      const logHolder = document.querySelector('#root > div > div > div > div.w-full.order-2.flex-grow.overflow-x-hidden.overflow-y-auto.pr-4')

      const tmhLogs = [...logHolder.querySelectorAll('.tmh-log')]
      if (tmhLogs.length > 10) {
        for (let i = 10; i < tmhLogs.length; i++) {
          tmhLogs[i].remove()
        }
      }

      const p = document.createElement('p')
      p.classList.add('text-xs', 'mb-2', 'text-green-600', 'tmh-log')
      p.innerText = logText
      logHolder.insertAdjacentElement('afterbegin', p)
    }

    console[msgLevel](logText)
  }

  const getAllButtons = () => {
    return [...document.querySelectorAll('#maintabs-container > div > div[role=tabpanel] button.btn.btn-dark:not(.btn-off)')]
  }

  const getResource = (resourceName = 'Gold') => {
    let resourceFound = false
    let resourceToFind = { name: resourceName, current: 0, max: 0, speed: 0, ttf: null, ttz: null }
    const resources = [...document.querySelectorAll('#root div > div > div > table > tbody > tr > td:nth-child(1) > span')]
    resources.map((resource) => {
      if (resource.textContent.includes(resourceName)) {
        resourceFound = true
        const values = resource.parentNode.parentNode.childNodes[1].textContent
          .split('/')
          .map((x) => numberParser.parse(x.replace(/[^0-9KM\-,\.]/g, '').trim()))
        resourceToFind.current = values[0]
        resourceToFind.max = values[1]

        resourceToFind.speed = numberParser.parse(resource.parentNode.parentNode.childNodes[2].textContent.replace(/[^0-9KM\-,\.]/g, '').trim()) || 0

        resourceToFind.ttf =
          resourceToFind.speed > 0 && resourceToFind.max !== resourceToFind.current
            ? formatTime(Math.ceil((resourceToFind.max - resourceToFind.current) / resourceToFind.speed))
            : null
        resourceToFind.ttz =
          resourceToFind.speed < 0 && resourceToFind.current ? formatTime(Math.ceil(resourceToFind.current / (resourceToFind.speed * -1))) : null
      }
    })

    return resourceFound ? resourceToFind : null
  }

  const hasUnassignedPopulation = () => {
    let unassignedPopulation = false

    const navButtons = document.querySelectorAll('#main-tabs > div > button')
    navButtons.forEach((button) => {
      if (button.innerText.includes(KEYS.PAGES.POPULATION)) {
        unassignedPopulation = !!button.querySelector('span')
      }
    })

    return unassignedPopulation
  }

  const canAffordBA = () => {
    const faith = getResource('Faith')
    const mana = getResource('Mana')

    if (faith && mana) {
      if (faith.current >= 2000 && mana.current >= 600) {
        return true
      }
    }

    return false
  }

  const shouldBuyBA = () => {
    const faith = getResource('Faith')
    const mana = getResource('Mana')

    if (faith && mana) {
      if (
        faith.current + faith.speed * timeToWaitUntilFullGold >= faith.max &&
        mana.current + mana.speed * timeToWaitUntilFullGold >= mana.max &&
        mana.speed > 20
      ) {
        return true
      }
    }

    return false
  }

  const lastSell = {}

  const shouldSell = () => {
    return !!resourcesToTrade.find((resName) => {
      if (!lastSell[resName]) lastSell[resName] = 0

      const res = getResource(resName)
      if (
        res &&
        (res.current === res.max || res.current + res.speed * timeToWaitUntilFullGold >= res.max) &&
        lastSell[resName] + 90 * 1000 < new Date().getTime()
      )
        return true
    })
  }

  const KEYS = {
    PAGES: {
      BUILD: 'Build',
      RESEARCH: 'Research',
      POPULATION: 'Population',
      ARMY: 'Army',
      MARKETPLACE: 'Marketplace',
      MAGIC: 'Magic',
    },
  }

  const hasPage = (page) => {
    const navButtons = [...document.querySelectorAll('#main-tabs > div > button')]

    return !!navButtons.find((button) => button.innerText.includes(page))
  }

  const switchPage = async (page) => {
    let foundPage = hasPage(page)
    if (!foundPage) {
      await switchPage(KEYS.PAGES.BUILD)
      return
    }

    let pageButton
    let switchedPage = false

    const navButtons = document.querySelectorAll('#main-tabs > div > button')
    navButtons.forEach((button) => {
      if (button.innerText.includes(page) && button.getAttribute('aria-selected') !== 'true') {
        pageButton = button
      }
    })

    if (pageButton) {
      pageButton.click()
      switchedPage = true
    }

    await sleep(2000)

    if (switchedPage) {
      logger({ msgLevel: 'debug', msg: `Switched page to ${page}` })
    }
  }

  const pages = [
    {
      id: KEYS.PAGES.BUILD,
      action: async () => {
        await switchPage(KEYS.PAGES.BUILD)

        let buttons = getAllButtons()
          .map((button) => {
            const id = button.innerText.split('\n').shift()
            return { id: id, element: button, building: buildingsList.find((building) => building.id === id) }
          })
          .filter((button) => button.building)
          .sort((a, b) => a.building.order - b.building.order)

        if (buttons.length) {
          while (!scriptPaused && buttons.length) {
            let shouldBuild = true
            const button = buttons.shift()

            if (!button.building.isSafe) {
              const requiredResource = getResource(button.building.requires.resource)
              if (!requiredResource) {
                shouldBuild = false
              } else {
                if (
                  button.id === 'Common House' &&
                  (!button.element.querySelector('span') || numberParser.parse(button.element.querySelector('span').innerText) < 2)
                ) {
                  shouldBuild = true
                } else {
                  shouldBuild = shouldBuild && requiredResource[button.building.requires.parameter] > button.building.requires.minValue
                }
              }
            }

            if (shouldBuild) {
              button.element.click()
              logger({ msgLevel: 'log', msg: `Building ${button.building.id}` })
              await sleep(6000)

              buttons = getAllButtons()
                .map((button) => {
                  const id = button.innerText.split('\n').shift()
                  return { id: id, element: button, building: buildingsList.find((building) => building.id === id) }
                })
                .filter((button) => button.building)
                .sort((a, b) => a.building.order - b.building.order)
            }
          }
        }

        await sleep(5000)
      },
    },
    {
      id: KEYS.PAGES.RESEARCH,
      action: async () => {
        await switchPage(KEYS.PAGES.RESEARCH)

        const manualResearches = [
          'A moonlight night',
          'Dragon assault',
          'Mysterious robbery',
          'The Fallen Angel reveal',
          'Persuade the nobility',
          'Persuade the people',
        ]

        let buttonsList = getAllButtons().filter((button) => !manualResearches.includes(button.innerText.split('\n').shift()))

        if (buttonsList.length) {
          while (!scriptPaused && buttonsList.length) {
            const button = buttonsList.shift()

            button.click()
            logger({ msgLevel: 'log', msg: `Researching ${button.innerText.split('\n').shift()}` })
            await sleep(6000)

            buttonsList = getAllButtons().filter((button) => !manualResearches.includes(button.innerText.split('\n').shift()))
          }
        }

        await sleep(5000)
      },
    },
    {
      id: KEYS.PAGES.POPULATION,
      action: async () => {
        await switchPage(KEYS.PAGES.POPULATION)

        let canAssignJobs = true
        const container = document.querySelector('#maintabs-container > div > div[role=tabpanel]')
        let availablePop = container
          .querySelector('div > span.ml-2')
          .textContent.split('/')
          .map((pop) => numberParser.parse(pop.trim()))

        const availableJobsQSA = container.querySelectorAll('h5')
        const availableJobs = []

        availableJobsQSA.forEach((job) => {
          const jobTitle = job.textContent.trim()
          availableJobs.push({
            ...allJobs.find((allJob) => allJob.id === jobTitle),
            container: job.parentElement.parentElement,
            current: +job.parentElement.parentElement.querySelector('input').value.split('/').shift().trim(),
            max: +job.parentElement.parentElement.querySelector('input').value.split('/').pop().trim(),
          })
        })

        if (availablePop[0] > 0) {
          while (!scriptPaused && canAssignJobs) {
            const jobsWithSpace = availableJobs.filter((job) => !!job.container.querySelector('button.btn-green'))
            canAssignJobs = false

            if (jobsWithSpace.length) {
              const foodJob = jobsWithSpace.find((job) => job.resourcesGenerated.find((res) => res.id === 'Food'))

              if (foodJob && (getResource('Food').speed <= 0 || foodJob.current < Math.min(minFarmers, foodJob.max))) {
                const addJobButton = foodJob.container.querySelector('button.btn-green')
                if (addJobButton) {
                  logger({ msgLevel: 'log', msg: `Assigning worker as ${foodJob.id}` })

                  addJobButton.click()
                  canAssignJobs = true
                  await sleep(1000)
                }
              } else {
                let unassigned = container
                  .querySelector('div > span.ml-2')
                  .textContent.split('/')
                  .map((pop) => numberParser.parse(pop.trim()))
                  .shift()

                if (unassigned > 0) {
                  const resources = [
                    'Natronite',
                    'Saltpetre',
                    'Tools',
                    'Wood',
                    'Stone',
                    'Iron',
                    // 'Copper', // Same as Iron
                    'Mana',
                    // 'Faith', // Same as Mana
                    'Research',
                    'Materials',
                    'Steel',
                    'Supplies',
                    'Gold',
                    'Crystal',
                    'Horse',
                    // 'Cow', // Same as Horse
                  ]
                    .filter((res) => getResource(res))
                    .filter((res) => jobsWithSpace.find((job) => job.resourcesGenerated.find((resGen) => resGen.id === res)))

                  const resourcesWithNegativeGen = resources.filter((res) => getResource(res) && res.speed < 0)
                  const resourcesWithNoGen = resources.filter((res) => !resourcesWithNegativeGen.includes(res) && getResource(res) && !res.speed)
                  const resourcesLeft = resources.filter((res) => !resourcesWithNegativeGen.includes(res) && !resourcesWithNoGen.includes(res))

                  const resourcesSorted = resourcesWithNegativeGen.concat(resourcesWithNoGen).concat(resourcesLeft)

                  if (resourcesSorted.length) {
                    for (let i = 0; i < resourcesSorted.length && !scriptPaused; i++) {
                      if (unassigned === 0) break

                      const resourceName = resourcesSorted[i]

                      const jobsForResource = jobsWithSpace
                        .filter((job) => job.resourcesGenerated.find((resGen) => resGen.id === resourceName))
                        .sort(
                          (a, b) =>
                            b.resourcesGenerated.find((resGen) => resGen.id === resourceName).value -
                            a.resourcesGenerated.find((resGen) => resGen.id === resourceName).value
                        )

                      if (jobsForResource.length) {
                        for (let i = 0; i < jobsForResource.length && !scriptPaused; i++) {
                          if (unassigned === 0) break
                          const job = jobsForResource[i]

                          let isSafeToAdd = true

                          if (!job.isSafe) {
                            job.resourcesUsed.forEach((resUsed) => {
                              const res = getResource(resUsed.id)

                              if (!res || res.speed < Math.abs(resUsed.value * 2)) {
                                isSafeToAdd = false
                              }
                            })
                          }

                          if (isSafeToAdd) {
                            const addJobButton = job.container.querySelector('button.btn-green')
                            if (addJobButton) {
                              logger({ msgLevel: 'log', msg: `Assigning worker as ${job.id}` })

                              addJobButton.click()
                              unassigned -= 1
                              canAssignJobs = !!unassigned
                              await sleep(1000)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            const unassigned = container
              .querySelector('div > span.ml-2')
              .textContent.split('/')
              .map((pop) => numberParser.parse(pop.trim()))
              .shift()
            if (unassigned === 0) {
              canAssignJobs = false
            }

            await sleep(10)
          }
        }

        await sleep(5000)
      },
    },
    {
      id: KEYS.PAGES.ARMY,
      action: async () => {
        await switchPage(KEYS.PAGES.ARMY)

        if (canAffordBA() && shouldBuyBA()) {
          const allButtonsQSA = document.querySelectorAll('div > div > div > div > div > span > button:not(.btn-off)')
          let buyBAButton = null

          allButtonsQSA.forEach((button) => {
            if (button.innerText.includes('Battle Angel')) {
              buyBAButton = button
            }
          })

          if (buyBAButton) {
            buyBAButton.click()
            logger({ msgLevel: 'log', msg: `Buying Battle Angel(s)` })
            await sleep(5000)
          }
        }

        await sleep(5000)
      },
    },
    {
      id: KEYS.PAGES.MARKETPLACE,
      action: async () => {
        await switchPage(KEYS.PAGES.MARKETPLACE)

        let gold = getResource('Gold')

        if (gold && gold.current < gold.max && shouldSell()) {
          const resourceHoldersQSA = document.querySelectorAll('div > div.tab-container > div > div > div')
          const resourceHolders = []

          if (resourceHoldersQSA) {
            resourceHoldersQSA.forEach((resourceHolder) => {
              const resNameElem = resourceHolder.querySelector('h5')
              if (resNameElem) {
                const resName = resNameElem.innerText
                const res = getResource(resName)

                if (resourcesToTrade.includes(resName) && res && (res.current === res.max || res.current + res.speed * timeToWaitUntilFullGold >= res.max)) {
                  resourceHolders.push(resourceHolder)
                }
              }
            })
          }

          let goldEarned = 0
          let soldTotals = {}

          for (let i = 0; i < resourceHolders.length && !scriptPaused; i++) {
            gold = getResource('Gold')
            const resourceHolder = resourceHolders[i]
            const resName = resourceHolder.querySelector('h5').innerText
            let res = getResource(resName)

            const initialPrice = numberParser.parse(resourceHolder.querySelector('div:nth-child(2) > div > table > tbody > tr > td:nth-child(2)').innerText)
            let price = initialPrice
            let sellButtons = resourceHolder.querySelectorAll('div > div.grid.gap-3 button.btn-red:not(.btn-dark)')

            while (
              !scriptPaused &&
              sellButtons &&
              sellButtons.length &&
              gold.current < gold.max &&
              res.current + res.speed * timeToWaitUntilFullGold * 2 >= res.max
            ) {
              let maxSellButton = 2
              const missingResToSell = Math.ceil((gold.max - gold.current) / price)

              if (missingResToSell < 80) {
                maxSellButton = 0
              } else if (missingResToSell < 800) {
                maxSellButton = 1
              }
              maxSellButton = Math.min(maxSellButton, sellButtons.length - 1)
              sellButtons[maxSellButton].click()
              lastSell[resName] = new Date().getTime()
              soldTotals[resName] = soldTotals[resName] ? soldTotals[resName] : { amount: 0, gold: 0 }
              soldTotals[resName].amount += +sellButtons[maxSellButton].innerText
              soldTotals[resName].gold += +sellButtons[maxSellButton].innerText * price
              logger({ msgLevel: 'debug', msg: `Selling ${sellButtons[maxSellButton].innerText} of ${res.name} for ${price}` })
              goldEarned += numberParser.parse(sellButtons[maxSellButton].innerText) * price
              await sleep(10)
              sellButtons = resourceHolder.querySelectorAll('div:nth-child(2) > div.grid.gap-3 button:not(.btn-dark)')
              gold = getResource('Gold')
              res = getResource(resName)
              price = numberParser.parse(resourceHolder.querySelector('div:nth-child(2) > div > table > tbody > tr > td:nth-child(2)').innerText)
              await sleep(1)

              if (price / initialPrice < 0.1) {
                break
              }
            }
          }

          if (goldEarned) {
            const totals = Object.keys(soldTotals)
              .filter((resName) => soldTotals[resName] && soldTotals[resName].gold && soldTotals[resName].amount)
              .map(
                (resName) =>
                  `${resName}: ${new Intl.NumberFormat().format(soldTotals[resName].amount)} units for ${new Intl.NumberFormat().format(
                    Math.round(soldTotals[resName].gold)
                  )} gold (avg price: ${(soldTotals[resName].gold / soldTotals[resName].amount).toFixed(2)})`
              )

            logger({ msgLevel: 'log', msg: `Earned ${new Intl.NumberFormat().format(goldEarned)} gold on Marketplace [${totals.join(', ')}]` })
          }
        }

        await sleep(5000)
      },
    },
  ]

  window.switchScriptState = () => {
    scriptPaused = !scriptPaused
    window.localStorage.setItem('TMH_cheatsOff', JSON.stringify(false))
    window.localStorage.setItem('TMH_scriptPaused', JSON.stringify(scriptPaused))

    if (!scriptPaused) {
      mainLoop()
    }
  }

  const lastVisited = {
    [KEYS.PAGES.BUILD]: 1,
    [KEYS.PAGES.RESEARCH]: 0,
    [KEYS.PAGES.POPULATION]: 0,
    [KEYS.PAGES.ARMY]: 0,
    [KEYS.PAGES.MARKETPLACE]: 0,
  }

  const mainLoop = async () => {
    if (cheatsOff) return
    if (mainLoopRunning) {
      setTimeout(mainLoop, 1000)
      return
    }

    mainLoopRunning = true

    while (!scriptPaused) {
      const should = {
        [KEYS.PAGES.BUILD]: () => {
          return hasPage(KEYS.PAGES.BUILD) && lastVisited[KEYS.PAGES.BUILD] < lastVisited[KEYS.PAGES.RESEARCH]
        },
        [KEYS.PAGES.RESEARCH]: () => {
          return hasPage(KEYS.PAGES.RESEARCH) && lastVisited[KEYS.PAGES.RESEARCH] < lastVisited[KEYS.PAGES.BUILD]
        },
        [KEYS.PAGES.POPULATION]: () => {
          return hasPage(KEYS.PAGES.POPULATION) && hasUnassignedPopulation()
        },
        [KEYS.PAGES.ARMY]: () => {
          const timeout = lastVisited[KEYS.PAGES.ARMY] + 2 * 60 * 1000 < new Date().getTime()
          return hasPage(KEYS.PAGES.ARMY) && canAffordBA() && shouldBuyBA() && timeout
        },
        [KEYS.PAGES.MARKETPLACE]: () => {
          const gold = getResource('Gold')

          return hasPage(KEYS.PAGES.MARKETPLACE) && gold.current + gold.speed * timeToWaitUntilFullGold < gold.max && shouldSell()
        },
      }

      const pagesToCheck = [KEYS.PAGES.POPULATION, KEYS.PAGES.MARKETPLACE, KEYS.PAGES.ARMY, KEYS.PAGES.RESEARCH, KEYS.PAGES.BUILD]

      while (!scriptPaused && pagesToCheck.length) {
        const pageToCheck = pagesToCheck.shift()

        if (should[pageToCheck] && should[pageToCheck]()) {
          const page = pages.find((page) => page.id === pageToCheck)

          if (page) {
            logger({ msgLevel: 'debug', msg: `Executing ${page.id} action` })
            lastVisited[page.id] = new Date().getTime()
            await page.action()
            await sleep(1000)
          }
        }
      }

      await sleep(1000)
    }

    mainLoopRunning = false
  }

  const managePanel = () => {
    if (cheatsOff) return

    const controlPanel = document.querySelector('div#theresMoreHelpControlPanel')

    let scriptState = scriptPaused ? `▶️` : `⏸️`

    if (!controlPanel) {
      const controlPanelElement = document.createElement('div')
      controlPanelElement.id = 'theresMoreHelpControlPanel'
      controlPanelElement.classList.add('dark')
      controlPanelElement.classList.add('dark:bg-mydark-300')
      controlPanelElement.style.position = 'fixed'
      controlPanelElement.style.bottom = '10px'
      controlPanelElement.style.left = '10px'
      controlPanelElement.style.zIndex = '99999999'
      controlPanelElement.style.border = '1px black solid'
      controlPanelElement.style.padding = '10px'

      controlPanelElement.innerHTML = `
          <p class="mb-2">TheresMoreHelp:
            <button onClick="window.switchScriptState()" title="Start/stop script" class="scriptState">${scriptState}</button> 
          </p>
        `

      document.querySelector('div#root').insertAdjacentElement('afterend', controlPanelElement)
    } else {
      controlPanel.querySelector('.scriptState').textContent = scriptState
    }

    if (!scriptPaused) {
      const fullPageOverlay = document.querySelector('div > div.absolute.top-0.right-0.z-20.pt-4.pr-4 > button')
      if (fullPageOverlay) {
        fullPageOverlay.click()
      }
    }
  }

  const calculateTTF = () => {
    const resourceTrNodes = document.querySelectorAll('#root > div > div:not(#maintabs-container) > div > div > div > table:not(.hidden) > tbody > tr')
    resourceTrNodes.forEach((row) => {
      const cells = row.querySelectorAll('td')
      const resourceName = cells[0].textContent.trim()
      const resource = getResource(resourceName)
      let ttf = ''

      if (resource && resource.current < resource.max && resource.speed) {
        ttf = resource.ttf ? resource.ttf.timeShort : resource.ttz ? resource.ttz.timeShort : ''
      }

      if (!cells[3]) {
        const ttfElement = document.createElement('td')
        ttfElement.className = 'px-3 3xl:px-5 py-3 lg:py-2 3xl:py-3 whitespace-nowrap w-1/3 text-right'
        ttfElement.textContent = ttf
        row.appendChild(ttfElement)
      } else {
        cells[3].textContent = ttf
      }
    })
  }

  const calculateTippyTTF = () => {
    let potentialResourcesToFillTable = document.querySelectorAll('div.tippy-box > div.tippy-content > div > div > table')
    if (potentialResourcesToFillTable.length) {
      potentialResourcesToFillTable = potentialResourcesToFillTable[0]
      const rows = potentialResourcesToFillTable.querySelectorAll('tr')
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td')
        const resourceName = cells[0].textContent.trim()

        const resource = getResource(resourceName)
        if (resource) {
          let ttf = '✅'

          const target = numberParser.parse(
            cells[1].textContent
              .split(' ')
              .shift()
              .replace(/[^0-9KM\-,\.]/g, '')
              .trim()
          )

          if (target > resource.max || resource.speed <= 0) {
            ttf = 'never'
          } else if (target > resource.current) {
            ttf = formatTime(Math.ceil((target - resource.current) / resource.speed)).timeShort
          }

          if (!cells[2]) {
            const ttfElement = document.createElement('td')
            ttfElement.className = 'px-4 3xl:py-1 text-right'
            ttfElement.textContent = ttf
            row.appendChild(ttfElement)
          } else {
            cells[2].textContent = ttf
          }
        }
      })
    }
  }

  const tossACoinToYourClicker = async () => {
    if (cheatsOff) return
    if (!haveManualResourceButtons) return
    if (scriptPaused) return
    if (isClicking) return

    isClicking = true
    const manualResources = ['Food', 'Wood', 'Stone'].filter((resourceName) => {
      const resource = getResource(resourceName)

      if (resource && resource.current < Math.min(200, resource.max) && (!resource.speed || resource.speed <= 0)) {
        return true
      }
    })
    const buttons = [
      ...document.querySelectorAll('#root > div.flex.flex-wrap.w-full.mx-auto.p-2 > div.w-full.lg\\:pl-2 > div > div.order-2.flex.flex-wrap.gap-3 > button'),
    ]

    if (!buttons.length) {
      haveManualResourceButtons = false
      return
    }

    const buttonsToClick = buttons.filter((button) => manualResources.includes(button.innerText.trim()))

    while (!scriptPaused && buttonsToClick.length) {
      const buttonToClick = buttonsToClick.shift()
      buttonToClick.click()
      await sleep(250)
    }

    isClicking = false
  }

  const performRoutineTasks = async () => {
    calculateTTF()

    if (!cheatsOff) {
      managePanel()
      if (haveManualResourceButtons) tossACoinToYourClicker()
    }
  }

  const performFastTasks = async () => {
    calculateTippyTTF()
  }

  window.setInterval(performRoutineTasks, 1000)
  window.setInterval(performFastTasks, 100)

  const loadSettingsFromLocalStorage = () => {
    const TMH_scriptPaused = window.localStorage.getItem('TMH_scriptPaused')
    const TMH_cheatsOff = window.localStorage.getItem('TMH_cheatsOff')

    if (TMH_cheatsOff) {
      cheatsOff = JSON.parse(TMH_cheatsOff)
    }

    if (TMH_scriptPaused) {
      scriptPaused = JSON.parse(TMH_scriptPaused)
    }
  }
  loadSettingsFromLocalStorage()

  if (!cheatsOff) {
    await sleep(5000)

    if (!scriptPaused) {
      mainLoop()
    }
  } else {
    logger({ msgLevel: 'log', msg: 'Welcome to TheresMoreHelp script!' })
    logger({ msgLevel: 'log', msg: 'Please execute the following in the console if you want to enable cheats:' })
    logger({ msgLevel: 'log', msg: ' ' })
    logger({ msgLevel: 'log', msg: 'window.localStorage.setItem("TMH_cheatsOff", JSON.stringify(false))' })
    logger({ msgLevel: 'log', msg: ' ' })
    logger({ msgLevel: 'log', msg: 'and then refresh the page. Have fun!' })
  }
})()

