// ==UserScript==
// @name         Zhihu Ads Marker
// @description  为含有广告的回答增加红框标识
// @namespace    http://tampermonkey.net/
// @version      0.3
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446321/Zhihu%20Ads%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/446321/Zhihu%20Ads%20Marker.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const targetNode = document.getElementById('root')
  const config = {attributes: false, childList: true, subtree: true}

  const AdClassList = [
    'GoodsRecommendCard',
    'ecommerce-ad-box',
    'RichText-MCNLinkCardContainer',
    'RichText-ADLinkCardContainer',
  ]
  const ContainerClassList = ['List-item', 'TopstoryItem', 'AnswerCard']

  /**
   * @param {HTMLElement} element
   * @returns {HTMLElement | null}
   */
  const getContainer = (element) => {
    const parentElement = element.parentElement
    if (parentElement) {
      if (
        Array.from(parentElement.classList).some((className) =>
          ContainerClassList.includes(className)
        )
      ) {
        return parentElement
      } else {
        return getContainer(parentElement)
      }
    }

    return null
  }

  const observer = new MutationObserver((mutationList) => {
    for (const {type, addedNodes} of mutationList) {
      if (type === 'childList' && addedNodes.length) {
        for (const addedNode of addedNodes) {
          if (
            addedNode instanceof HTMLElement &&
            Array.from(addedNode.classList).some((className) =>
              AdClassList.includes(className)
            )
          ) {
            const container = getContainer(addedNode)
            if (container) {
              container.style.outline = '1px solid red'
            }
          }
        }
      }
    }
  })

  observer.observe(targetNode, config)
})()
