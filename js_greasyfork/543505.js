// ==UserScript==
// @name        Clean Weibo
// @namespace   Violentmonkey Scripts
// @match       *://weibo.com/*
// @version     1.0
// @author      GeniusCorn
// @description Clean your Weibo.
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543505/Clean%20Weibo.user.js
// @updateURL https://update.greasyfork.org/scripts/543505/Clean%20Weibo.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function useOption(
    key,
    title,
    defaultValue,
  ) {
    if (typeof GM_getValue === 'undefined') {
      return {
        value: defaultValue,
      }
    }

    let value = GM_getValue(key, defaultValue)
    const ref = {
      get value() {
        return value
      },
      set value(v) {
        value = v
        GM_setValue(key, v)
        location.reload()
      },
    }

    GM_registerMenuCommand(
      `${title}: ${value ? 'True' : 'False'}`,
      () => {
        ref.value = !value
      },
    )

    return ref
  }

  const isHideHotBand = useOption(
    'isHideHotBand',
    '关闭微博热搜',
    false,
  )
  const isHideCurCard = useOption(
    'isHideCurCard',
    '关闭你可能感兴趣的人',
    false,
  )
  const isHidePanel = useOption(
    'isHidePanel',
    '关闭创作者中心',
    false,
  )
  const isHideSideCopy = useOption(
    'isHideSideCopy',
    '关闭 Copyright',
    false,
  )
  const isHideNewBadge = useOption(
    'isHideNewBadge',
    '关闭新消息',
    false,
  )
  const isHideHotTab = useOption(
    'isHideHotTab',
    '关闭推荐页签',
    false,
  )
  const isHideTvTab = useOption(
    'isHideTvTab',
    '关闭视频页签',
    false,
  )
  const isHideGameButton = useOption(
    'isHideGameButton',
    '关闭游戏按钮',
    false,
  )
  const isHideWzaButton = useOption(
    'isHideWzaButton',
    '关闭无障碍按钮',
    false,
  )
  const isHideArticleButton = useOption(
    'isHideArticleButton',
    '关闭头条文章按钮',
    false,
  )
  const isHidePopItem = useOption(
    'isHidePopItem',
    '关闭更多按钮',
    false,
  )
  const isHidePictureBadge = useOption(
    'isHidePictureBadge',
    '关闭会员标签',
    false,
  )

  function hideHotBand() {
    if (isHideHotBand.value) {
      const hotBand = document.querySelector('.hotBand')

      hotBand.style.display = 'none'
    }
  }

  function hideCurCard() {
    if (isHideCurCard.value) {
      const curCard
        = document
          .querySelector('.wbpro-side-main > div:nth-child(2)')

      curCard.style.display = 'none'
    }
  }

  function hidePanel() {
    if (isHidePanel.value) {
      const panel
        = document
          .querySelector('.cardService_gap_2fAkp > div:nth-child(1)')

      panel.style.display = 'none'
    }
  }

  function hideSideCopy() {
    if (isHideSideCopy.value) {
      const sideCopy
        = document
          .querySelector('.wbpro-side-copy')

      sideCopy.style.display = 'none'
    }
  }

  function hideNewBadge() {
    if (isHideNewBadge.value) {
      const badge
        = document
          .querySelector('.woo-badge-main')

      if (!badge)
        return

      badge.style.display = 'none'
    }
  }

  function hideHotTab() {
    if (isHideHotTab.value) {
      const hot
        = document
          .querySelectorAll('[href="/hot"]')

      hot.forEach(item => item.style.display = 'none')
    }
  }

  function hideTvTab() {
    if (isHideTvTab.value) {
      const video
        = document
          .querySelectorAll('[href="/tv"]')

      video.forEach(item => item.style.display = 'none')
    }
  }

  function hideGameButton() {
    if (isHideGameButton.value) {
      const game
        = document
          .querySelector('.Links_box_17T3k')

      game.style.display = 'none'
    }
  }

  function hideWzaButton() {
    if (isHideWzaButton.value) {
      const wza
        = document
          .querySelector('#cniil_wza')

      wza.style.display = 'none'
    }
  }

  function hideArticleItem() {
    if (isHideArticleButton.value) {
      const article
        = document
          .querySelector('div.woo-box-item-inlineBlock:nth-child(5) > div:nth-child(1)')

      article.style.display = 'none'
    }
  }

  function hidePopItem() {
    if (isHidePopItem.value) {
      const pop
        = document
          .querySelector('div.woo-box-item-inlineBlock:nth-child(6) > div:nth-child(1)')

      pop.style.display = 'none'
    }
  }

  function hidePictureBadge() {
    if (isHidePictureBadge.value) {
      const badge
        = document
          .querySelector('div.woo-picture-main:nth-child(2)')

      badge.style.display = 'none'
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      hideHotBand()
      hideCurCard()
      hidePanel()
      hideSideCopy()
      hideNewBadge()
      hideHotTab()
      hideTvTab()
      hideGameButton()
      hideWzaButton()
      hideArticleItem()
      hidePopItem()
      hidePictureBadge()
    }, 500)
  })
})()
