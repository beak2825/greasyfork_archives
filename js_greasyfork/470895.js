// ==UserScript==
// @name              Mortal Killer Plus
// @name:zh-CN        Mortal Killer Plus
// @description       Mortal KillerDucky GUI+
// @description:zh-CN Mortal KillerDucky GUI+
// @namespace         mortal-killer-plus
// @version           1.3.4
// @author            Sabertaz
// @icon              https://mjai.ekyu.moe/favicon-32x32.png
// @match             https://mjai.ekyu.moe/killerducky/*
// @grant             GM_getValue
// @run-at            document-start
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/470895/Mortal%20Killer%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/470895/Mortal%20Killer%20Plus.meta.js
// ==/UserScript==

/* eslint-disable security/detect-object-injection */
/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-unsafe-assignment */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-return */
/* eslint-disable ts/strict-boolean-expressions */

(function () {
  'use strict'

  const FatalErrorLimit = '1'
  const NormalErrorLimit = '5'
  const ArguableErrorLimit = '10'

  const PlayerChoiceColor = '#abc431'
  const FatalErrorColor = '#ff0000'
  const NormalErrorColor = '#ff5a00'
  const ArguableErrorColor = '#845ef7'

  const Locales = {
    'en': {
      FatalErrorLimit: `${FatalErrorLimit}% Moves/total`,
      NormalErrorLimit: `${NormalErrorLimit}% Moves/total`,
      ArguableErrorLimit: `${ArguableErrorLimit}% Moves/total`,
    },
    'zh-CN': {
      FatalErrorLimit: `${FatalErrorLimit}% 恶手率`,
      NormalErrorLimit: `${NormalErrorLimit}% 恶手率`,
      ArguableErrorLimit: `${ArguableErrorLimit}% 恶手率`,
    },
  }

  const i18n = {
    lang: 'en',
    init() {
      const lang = localStorage.getItem('lang') ?? 'en'
      this.setLang(lang)
    },
    setLang(lang = 'en') {
      this.lang = lang
    },
    translate(key) {
      return Locales[this.lang][key]
    },
    t(key) {
      return this.translate(key)
    },
  }

  async function waitForElement(targetSelector, rootSelector = 'body', wait = undefined) {
    const rootElement = document.querySelector(rootSelector)
    if (!rootElement) {
      return Promise.reject(new Error('root element is not exist'))
    }
    // check if the element is already rendered
    const targetElement = rootElement.querySelector(targetSelector)
    if (targetElement) {
      return Promise.resolve(targetElement)
    }
    return new Promise((resolve) => {
      const callback = function (mutationList, observer) {
        const targetElement = rootElement.querySelector(targetSelector)
        if (targetElement) {
          // found
          resolve(targetElement)
          // then cancel to watch the element
          observer.disconnect()
        }
      }
      const observer = new MutationObserver(callback)
      observer.observe(rootElement, {
        subtree: true,
        childList: true,
      })
      if (wait !== undefined) {
        // if wait is set, then cancel to watch the element to render after wait times
        setTimeout(() => {
          observer.disconnect()
        }, wait)
      }
    })
  }

  function addTableRow(table, key, value, color) {
    const tr = table.insertRow()
    const keyCell = tr.insertCell()
    keyCell.textContent = `${key}`
    const valueCell = tr.insertCell()
    valueCell.textContent = `${value}`

    if (color) {
      keyCell.style.color = color
      valueCell.style.color = color
    }
  }

  async function addErrorMetadata() {
    let fatalErrorNum = 0
    let normalErrorNum = 0
    let arguableErrorNum = 0
    const urlParams = new URLSearchParams(window.location.search)
    const dataParam = urlParams.get('data')

    if (!dataParam) {
      return
    }

    const response = await fetch(dataParam)
    const data = await response.json()
    const reviewData = data.review

    for (const kyokus of reviewData.kyokus) {
      for (const currentPlay of kyokus.entries) {
        const mismatch = !currentPlay.is_equal
        const currentPlayPoint = currentPlay.details[currentPlay.actual_index].prob * 100

        if (mismatch && currentPlayPoint <= Number.parseFloat(FatalErrorLimit)) {
          fatalErrorNum++
        }
        if (mismatch && currentPlayPoint <= Number.parseFloat(NormalErrorLimit)) {
          normalErrorNum++
        }
        if (mismatch && currentPlayPoint <= Number.parseFloat(ArguableErrorLimit)) {
          arguableErrorNum++
        }
      }
    }

    const totalReviewed = reviewData.total_reviewed
    const fatalErrorRate = ((fatalErrorNum / totalReviewed) * 100).toFixed(2)
    const fatalErrorStr = `${fatalErrorNum}/${totalReviewed} = ${fatalErrorRate}%`
    const normalErrorRate = ((normalErrorNum / totalReviewed) * 100).toFixed(2)
    const normalErrorStr = `${normalErrorNum}/${totalReviewed} = ${normalErrorRate}%`
    const arguableErrorRate = ((arguableErrorNum / totalReviewed) * 100).toFixed(2)
    const arguableErrorStr = `${arguableErrorNum}/${totalReviewed} = ${arguableErrorRate}%`

    const metadataTable = document.querySelector('.about-metadata table')
    addTableRow(metadataTable, i18n.t('FatalErrorLimit'), fatalErrorStr, FatalErrorColor)
    addTableRow(metadataTable, i18n.t('NormalErrorLimit'), normalErrorStr, NormalErrorColor)
    addTableRow(metadataTable, i18n.t('ArguableErrorLimit'), arguableErrorStr, ArguableErrorColor)
  }

  /**
   * @author CiterR (Bilibili at 遥忆酒家七)
   * @link https://www.bilibili.com/video/BV1SWv6eGEnq
   */
  function markupPlayerChoice() {
    const actionTrList = document.querySelector('.opt-info > table:last-child')?.querySelectorAll('tr')
    const actionCardList = [] // 第一个是无用项
    const possibilityList = []

    actionTrList?.forEach((e) => {
      const cardAct = e.querySelector('td:first-child > span')
      let action, card
      if (cardAct != null) {
        action = cardAct.textContent.substring(0, 1) // 获取牌操作
      }

      const cardImg = e.querySelector('td:first-child > span > img')
      if (cardImg != null) {
        const cardURL = cardImg.getAttribute('src')
        card = cardURL.substring(cardURL.lastIndexOf('/') + 1, cardURL.lastIndexOf('.')) // 获取出牌选择
      }

      actionCardList.push(action + card)

      const possibilityTr = e.querySelector('td:last-child')
      if (possibilityTr.textContent !== 'P') {
        possibilityList.push(possibilityTr.textContent) // 获取概率数据
      }
    })

    // 获取玩家选择和 Mortal 一选
    const actionCard = []
    const mainActionSpan = document.querySelectorAll('.opt-info > table:first-child span')
    mainActionSpan.forEach((e) => {
      const action = e.textContent?.substring(0, 1) // 操作
      let card
      const cardImg = e.querySelector('img')
      if (cardImg != null) {
        const cardURL = cardImg.getAttribute('src')
        card = cardURL?.substring(cardURL.lastIndexOf('/') + 1, cardURL.lastIndexOf('.')) // 牌张
      }
      actionCard.push(action + card)
    })

    let possibilityPlayer = 0
    let playerSelect = 0

    // 给玩家选择进行标记
    for (let i = 1; i < actionCardList.length; i++) {
      if (actionCardList[i] === actionCard[0]) {
        actionTrList[i].style.background = PlayerChoiceColor
        possibilityPlayer = Number.parseFloat(possibilityList[i - 1])
        playerSelect = i - 1
        break
      }
    }

    // 判断恶手并标红, 橙, 紫, 绿.
    if (actionCard[0] !== actionCard[1]) {
      if (possibilityPlayer <= Number.parseFloat(FatalErrorLimit)) {
        actionTrList[playerSelect + 1].style.background = FatalErrorColor
      } else if (possibilityPlayer <= Number.parseFloat(NormalErrorLimit)) {
        actionTrList[playerSelect + 1].style.background = NormalErrorColor
      } else if (possibilityPlayer <= Number.parseFloat(ArguableErrorLimit)) {
        actionTrList[playerSelect + 1].style.background = ArguableErrorColor
      }
    }
  }

  /**
   * @author CiterR (Bilibili at 遥忆酒家七)
   * @link https://www.bilibili.com/video/BV1SWv6eGEnq
   */
  function startMortalOptionObserver() {
    // 关闭状态时不设置监听
    const optState = GM_getValue('mortalOptionState', true)
    if (!optState) {
      return
    }

    // 设置 Mortal 选项更新监听
    const observer = new MutationObserver(
      () => {
        markupPlayerChoice()
      },
    )
    const optionTable = document.querySelector('.opt-info')
    if (optionTable) {
      observer.observe(optionTable, { childList: true })
    }
  }

  waitForElement('.about-metadata table').then(async () => {
    i18n.init()
    startMortalOptionObserver()
    return addErrorMetadata()
  }).then(() => {
    document.querySelector('#about-modal')?.showModal()
  }).catch(console.error)
})()
