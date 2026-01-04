// ==UserScript==
// @name        TheresMoreHelpZH
// @namespace   TheresMoreGame.com
// @match       https://theresmoregame.g8hh.com/
// @grant       none
// @version     2.0.26
// @description Helper for TheresMoreGame
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/458994/TheresMoreHelpZH.user.js
// @updateURL https://update.greasyfork.org/scripts/458994/TheresMoreHelpZH.meta.js
// ==/UserScript==

;(async () => {
    let cheatsOff = true

    let scriptPaused = true
    let haveManualResourceButtons = true
    let isClicking = false
    let mainLoopRunning = false

    const buildingsList = [
      { id: '众神之陵', alwaysBuild: true, isSafe: true },
      { id: '法力之塔', alwaysBuild: true, isSafe: true },
      { id: '光之城', alwaysBuild: true, isSafe: true },
      { id: '海湾区', alwaysBuild: true, isSafe: true },
      { id: '证券交易所', alwaysBuild: true, isSafe: true },
      { id: '法力深井', alwaysBuild: true, isSafe: true },
      { id: '超级大炮', alwaysBuild: true, isSafe: true },
      { id: '难民区', alwaysBuild: true, isSafe: true },
      { id: '自由思想家学院', alwaysBuild: true, isSafe: true },
      { id: '市中心', alwaysBuild: true, isSafe: true },
      { id: '大教堂', alwaysBuild: true, isSafe: true },
      { id: '超大集市', alwaysBuild: true, isSafe: true },
      { id: '栅栏', alwaysBuild: true, isSafe: true },
      { id: '城墙', alwaysBuild: true, isSafe: true },
      { id: '法力之塔组件', alwaysBuild: true, isSafe: true },
      { id: '光之城组件', alwaysBuild: true, isSafe: true },
      { id: '海湾区组件', alwaysBuild: true, isSafe: true },
      { id: '证券交易所组件', alwaysBuild: true, isSafe: true },
      { id: '法力深井组件', alwaysBuild: true, isSafe: true },
      { id: '超级大炮组件', alwaysBuild: true, isSafe: true },
      { id: '难民区组件', alwaysBuild: true, isSafe: true },
      { id: '自由思想家学院组件', alwaysBuild: true, isSafe: true },
      { id: '市中心组件', alwaysBuild: true, isSafe: true },
      { id: '超大集市组件', alwaysBuild: true, isSafe: true },
      { id: '大教堂组件', alwaysBuild: true, isSafe: true },
      { id: '工匠公会', alwaysBuild: true, isSafe: true },
      { id: '诸神的机器', alwaysBuild: true, isSafe: true },
      { id: '登攀者世界图书馆', alwaysBuild: true, isSafe: true },
      { id: '修道院', alwaysBuild: true, isSafe: true },
      { id: '守望者前哨', alwaysBuild: true, isSafe: true },
      { id: '亡者大厅', alwaysBuild: true, isSafe: true },
      { id: '锯木厂', alwaysBuild: true, isSafe: true },
      { id: '纪念碑', alwaysBuild: true, isSafe: true },
      { id: '铸造厂', alwaysBuild: true, isSafe: true },
      { id: '建筑工区域', alwaysBuild: true, isSafe: true },
      { id: '伊甸园', alwaysBuild: true, isSafe: true },
      { id: '亡者之门', alwaysBuild: true, isSafe: true },
      { id: '灵魂图书馆', alwaysBuild: true, isSafe: true },
      { id: '灵魂', isSafe: true },
      { id: '书籍', isSafe: true },
      { id: '天文台', isSafe: true },
      { id: '金库', isSafe: true },
      { id: '信用社', isSafe: true },
      { id: '卡纳瓦贸易站', isSafe: true },
      { id: '银行', isSafe: true },
      { id: '市场', isSafe: true },
      { id: '工匠作坊', isSafe: true },
      { id: '粮仓', isSafe: true },
      { id: '智慧大厅', isSafe: true },
      { id: '学校', isSafe: true },
      { id: '大学', isSafe: true },
      { id: '研究工厂', isSafe: true },
      { id: '亡者兽群', isSafe: true },
      { id: '有人值守仓库', isSafe: true },
      { id: '封地', isSafe: true },
      { id: '钠红石精炼厂', isSafe: true },
      { id: '炼金实验室', isSafe: true },
      { id: '伐木工营地', isSafe: true },
      { id: '采石场', isSafe: true },
      { id: '矿井', isSafe: true },
      { id: '栅栏组件', isSafe: true },
      { id: '城墙组件', isSafe: true },
      { id: '壁垒', alwaysBuild: true, isSafe: true },
      { id: '壁垒组件', isSafe: true },
      { id: '农场', isSafe: true },
      { id: '物质转化器', isSafe: true },
      { id: '马厩', isSafe: true },
      { id: '精神花园', isSafe: true },
      { id: '秘密会议', isSafe: true },
      { id: '魔法塔', isSafe: true },
      { id: '寺庙', isSafe: true },
      { id: '献祭圣坛', isSafe: true },
      { id: '繁荣之泉', isSafe: true },
      { id: '丰饶之谷', isSafe: true },
      { id: '税收检查站', isSafe: true },
      { id: '工业厂房', isSafe: true },
      { id: '魔法环', isSafe: true },
      { id: '木匠工坊', isSafe: true },
      { id: '食品杂货店', isSafe: true },
      { id: '钢铁厂', isSafe: true },
      { id: '军事学院', isSafe: true },
      { id: '远古保险库', isSafe: true },
      { id: '新兵训练中心', isSafe: true },
      { id: '军官训练场', isSafe: true },
      { id: '城堡民兵', isSafe: true },
      { id: '宅邸', isSafe: false, requires: { resource: '食物', parameter: 'speed', minValue: 3 } },
      { id: '市政厅', isSafe: false, requires: { resource: '食物', parameter: 'speed', minValue: 1.5 } },
      { id: '住宅区', isSafe: false, requires: { resource: '食物', parameter: 'speed', minValue: 5 } },
      { id: '普通房屋', isSafe: false, requires: { resource: '食物', parameter: 'speed', minValue: 1 } },
      { id: '存储设施', isSafe: true },
      { id: '弩炮', isSafe: true },
      { id: '大型仓库', isSafe: true },
      { id: '大型库房', isSafe: true },
      { id: '储物间', isSafe: true },
      { id: '钠红石仓库', isSafe: true },
      { id: '兵营', isSafe: true },
      { id: '雷区', isSafe: true },
      { id: '钠红石气球', isSafe: true },
      { id: '门之解密', isSafe: true },
      { id: '好运之森', isSafe: true },
      { id: '法力之柱', isSafe: false, requires: { resource: '黄金', parameter: 'speed', minValue: 100 } },
    ]
      .filter((building) => building.id)
      .map((building, index) => {
        return {
          ...building,
          order: index,
        }
      })

    const lang = {
      pop_artisan: '工匠',
      pop_breeder: '饲育员',
      pop_farmer: '农民',
      pop_lumberjack: '伐木工',
      pop_merchant: '商人',
      pop_trader: '交易人',
      pop_miner: '矿工',
      pop_quarryman: '石工',
      pop_priest: '牧师',
      pop_carpenter: '木匠',
      pop_steelworker: '炼钢工人',
      pop_professor: '教授',
      pop_skymancer: '星学家',
      pop_supplier: '供应商',
      pop_alchemist: '炼金术士',
      pop_unemployed: '失业',
      pop_natro_refiner: '钠红石精炼工',
      pop_researcher: '研究员',
      res_army: '军队',
      res_coin: '代币',
      res_copper: '铜',
      res_cow: '奶牛',
      res_crystal: '水晶',
      res_faith: '信念',
      res_fame: '声誉',
      res_food: '食物',
      res_gold: '黄金',
      res_horse: '马',
      res_iron: '铁',
      res_legacy: '传承',
      res_luck: '运气',
      res_mana: '法力',
      res_natronite: '钠红石',
      res_population: '人口',
      res_stone: '石头',
      res_relic: '遗物',
      res_research: '研究',
      res_tools: '工具',
      res_wood: '木材',
      res_building_material: '原料',
      res_steel: '钢',
      res_supplies: '补给',
      res_saltpetre: '硝石',
      res_tome_wisdom: '智慧卷轴',
      res_gem: '宝石',
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

    const resourcesToTrade = ['奶牛', '马', '食物', '铜', '木材', '石头', '铁', '工具']
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

    const getResource = (resourceName = '黄金') => {
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
      const faith = getResource('信念')
      const mana = getResource('法力')

      if (faith && mana) {
        if (faith.current >= 2000 && mana.current >= 600) {
          return true
        }
      }

      return false
    }

    const shouldBuyBA = () => {
      const faith = getResource('信念')
      const mana = getResource('法力')

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
        BUILD: '建造',
        RESEARCH: '研究',
        POPULATION: '人口',
        ARMY: '军队',
        MARKETPLACE: '市场',
        MAGIC: '魔法',
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
                    button.id === '普通房屋' &&
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
            '月明之夜',
            '巨龙来袭',
            '神秘劫案',
            '堕天使出现',
            '说服贵族',
            '赢得民心',
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
                const foodJob = jobsWithSpace.find((job) => job.resourcesGenerated.find((res) => res.id === '食物'))

                if (foodJob && (getResource('食物').speed <= 0 || foodJob.current < Math.min(minFarmers, foodJob.max))) {
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
                      '钠红石',
                      '硝石',
                      '工具',
                      '木材',
                      '石头',
                      '铁',
                      // '铜', // Same as Iron
                      '法力',
                      // '信念', // Same as Mana
                      '研究',
                      '原料',
                      '钢',
                      '补给',
                      '黄金',
                      '水晶',
                      '马',
                      // '奶牛', // Same as Horse
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
              if (button.innerText.includes('战斗天使')) {
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

          let gold = getResource('黄金')

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
              gold = getResource('黄金')
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
                gold = getResource('黄金')
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
            const gold = getResource('黄金')

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
      const manualResources = ['食物', '木材', '石头'].filter((resourceName) => {
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

