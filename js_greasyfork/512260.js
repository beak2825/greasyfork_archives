// ==UserScript==
// @name        干他妈的唐氏视频和弱智广告
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/10/11 下午6:23:38
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512260/%E5%B9%B2%E4%BB%96%E5%A6%88%E7%9A%84%E5%94%90%E6%B0%8F%E8%A7%86%E9%A2%91%E5%92%8C%E5%BC%B1%E6%99%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/512260/%E5%B9%B2%E4%BB%96%E5%A6%88%E7%9A%84%E5%94%90%E6%B0%8F%E8%A7%86%E9%A2%91%E5%92%8C%E5%BC%B1%E6%99%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

const titleBlackList = ['纪录片']

function removeTrash(root) {
  titleBlackList.forEach((title) => {
    const feedCard = root.querySelectorAll('.feed-card')
    feedCard.forEach((dom) => {
      if(dom.querySelector('.bili-video-card__info--tit')?.title?.includes(title)) {
        dom.remove()
      }
    })

    const rcmdCard = root.querySelectorAll('.is-rcmd')
    rcmdCard.forEach((dom) => {
      if(dom.querySelector('.bili-video-card__info--tit')?.title?.includes(title)) {
        dom.remove()
      }
    })
  })

  const floorSingleCard = root.querySelectorAll('.floor-single-card')
  floorSingleCard.forEach((dom) => dom.remove())

  const liveCard = root.querySelectorAll('.bili-live-card')
  liveCard.forEach((dom) => dom.remove())

  const rcmdCard = root.querySelectorAll('.is-rcmd')
  rcmdCard.forEach((dom) => {
    const adDom= dom.querySelector('.bili-video-card__info--ad')
    if(adDom) {
      dom.remove()
    }
  })

  const creativeAD = root.querySelectorAll('.is-rcmd')
  creativeAD.forEach((dom) => {
    const adDom= dom.querySelector('.bili-video-card__info--creative-ad')
    if(adDom) {
      dom.remove()
    }
  })

  const banner = root.querySelector('#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8 > div.recommended-swipe.grid-anchor')
  if(banner) {
    banner.remove()
  }
}

const removeDom = setInterval(() => {removeTrash(document)}, 500)