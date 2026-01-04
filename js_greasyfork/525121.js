// ==UserScript==
// @name          小丑牌 Balatro 卡牌定位工具
// @namespace     balatro-soul-util
// @version       0.0.6
// @description   The Soul 的搜索增强版，帮助快速定位目标牌和位置。内置 蓝图、头脑、可乐的搜索，其他自行调用函数找到 `window.findCardInAnte(底注, 英文牌名)`
// @author        liam61
// @match         mathisfun0.github.io/The-Soul/
// @license       MIT
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM.getValue
// @grant         GM_setValue
// @grant         GM.setValue
// @charset       UTF-8
// @github        https://github.com/liam61/the-soul-card-util

// @downloadURL https://update.greasyfork.org/scripts/525121/%E5%B0%8F%E4%B8%91%E7%89%8C%20Balatro%20%E5%8D%A1%E7%89%8C%E5%AE%9A%E4%BD%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525121/%E5%B0%8F%E4%B8%91%E7%89%8C%20Balatro%20%E5%8D%A1%E7%89%8C%E5%AE%9A%E4%BD%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

;(function (global) {
  const minAnte = 1
  const maxAnte = 40
  const presetCardsMap = {
    FlushFive: ['Blueprint', 'Brainstorm', 'Diet Cola', 'Showman', 'The Idol', 'Sock and Buskin'],
    同花五条流: ['Blueprint', 'Brainstorm', 'Diet Cola', 'Showman', 'The Idol', 'Sock and Buskin'],

    HighCard: ['Blueprint', 'Brainstorm', 'Diet Cola', 'Showman', 'Baron', 'Mime'],
    高牌流: ['Blueprint', 'Brainstorm', 'Diet Cola', 'Showman', 'Baron', 'Mime'],

    // Juggler, Troubadour
    LiamsFlushFive: [
      'Blueprint',
      'Brainstorm',
      'Diet Cola',
      { card: 'Scary Face', range: [1, 10] },
      { card: 'Hanging Chad', range: [1, 18] },
      { card: 'Photograph', range: [1, 18] },

      { card: 'Midas Mask', range: [6, 9] },
      { card: 'Golden Ticket', range: [8, 33] },
      { card: 'Seance', range: [8, 10] },

      { card: 'Showman', range: [10, 33] },
      { card: 'Sock and Buskin', range: [16, 33] },
      { card: 'The Idol', range: [18, 33] },
    ],
  }

  /**
   *
   * @param {number} ante 底注
   * @param {string | string[]} targets 目标牌，可以是单张牌，也可以是多张牌数组。可选参数
   * @param {object} config 可选参数
   * @param {'index' | 'card'} config.orderBy 排序方式，index: 按照位置顺序，card: 按照牌的顺序
   * @param {'FlushFive' | 'HighCard'} config.preset 预设的牌组，FlushFive: 同花五条流，HighCard: 高牌流
   * @param {2 | 3 | 4} config.stockSize 牌库大小，默认 3
   */
  const findCardsInAnte = (ante, targets = [], config) => {
    if (typeof ante !== 'number') {
      console.error('[ante error]: should be a number')
      alert('[ante error]: 底注应该是一个数字')
    }

    // 兼容未传 targets，TODO: 考虑其他优雅传参
    if (targets && typeof targets === 'object' && !Array.isArray(targets) && config == null) {
      config = targets
      targets = []
    }

    if (!(Array.isArray(targets) || typeof targets === 'string' || targets == null)) {
      console.error('[targets error]: should be an array or string')
      alert('[targets error]: 目标牌应该是一个数组或字符串')
    }

    if (!(typeof config === 'object' || config == null)) {
      console.error('[config error]: should be an object')
      alert('[config error]: 配置选项应该是一个对象')
    }

    const { orderBy = 'index', preset = 'FlushFive', stockSize = 3 } = config || {}

    // ==Utils==
    const parsePresetCard = (item) => {
      if (typeof item === 'object' && Array.isArray(item?.range)) {
        return {
          card: item.card,
          min: ~~+item.range[0] || minAnte,
          max: ~~+item.range[1] || maxAnte,
        }
      }

      if (typeof item === 'string') {
        return {
          card: item,
          min: minAnte,
          max: maxAnte,
        }
      }

      return {}
    }

    /**
     *
     * @param {number} ante
     * @param {( string | { card: string, range: [number, number] } )} target
     */
    const findIndexOfCard = (ante, target) => {
      const { card, min, max } = parsePresetCard(target)

      if (typeof card !== 'string' || !(min <= ante && ante <= max)) return []

      const anteEl = document.querySelector('#scrollingContainer').children[ante - 1]
      if (!anteEl) return []

      const cardListEl = anteEl.querySelector('.scrollable')

      const arr = [...cardListEl.children].reduce((arr, cardEl, index) => {
        const el = cardEl.querySelector('div')

        if (el.textContent.includes(card)) {
          arr.push({ card, index })
        }
        return arr
      }, [])

      return arr
    }

    const print = (targetCardList) => {
      const msgArr = targetCardList.map(({ card, index }) => {
        const realIndex = index + 1
        const order = realIndex % stockSize

        return `[ante ${ante}] ${card.padEnd(20, ' ')}\tindex: ${realIndex}, round: ${Math.ceil(
          realIndex / stockSize
        )}, order: ${order != 0 ? order : stockSize}`
      })

      if (targetCardList.length) {
        console.log(msgArr.join('\n'))
        console.log('\n')
      }
    }
    // ==/Utils==

    // ==Output==
    const finalTargets = targets?.length
      ? Array.isArray(targets)
        ? targets
        : [targets]
      : presetCardsMap[preset]
    // TODO: optimize algorithm
    const targetLists = finalTargets.map((target) => findIndexOfCard(ante, target))

    let results = []
    if (orderBy === 'card') {
      results = targetLists.sort((list1, list2) => list1[0]?.index - list2[0]?.index)
      results.forEach(print)
    } else if (orderBy === 'index') {
      results = targetLists
        .reduce((arr, item) => {
          arr.push(...item)
          return arr
        }, [])
        .sort((item1, item2) => item1.index - item2.index)
      print(results)
    }

    return results
  }
  // ==/Output==

  // ==Export==
  global.findCardsInAnte = findCardsInAnte
  global.findCardsInAllAntes = (targets, config) => {
    return Array.from({ length: maxAnte }, (_, i) => i + 1).map((ante) =>
      findCardsInAnte(ante, targets, config)
    )
  }
  // ==/Export==

  global.findCardsInAllAntes({ preset: 'LiamsFlushFive' })
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window)
