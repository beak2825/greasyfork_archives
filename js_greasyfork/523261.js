// ==UserScript==
// @name         Raptor一键反解
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键反解
// @author       chengpengfei05
// @match        https://raptor.mws.sankuai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523261/Raptor%E4%B8%80%E9%94%AE%E5%8F%8D%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/523261/Raptor%E4%B8%80%E9%94%AE%E5%8F%8D%E8%A7%A3.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const presetsAPP = {
    'rn_mc_deal-moma-4': 'deal-moma-4',
    'rn_mc_deal-kdb': 'deal-kdb',
    'rn_mc_moma-poi-detail': 'moma-poi-detail',
    'rn_mc_moma-visit-ground': 'moma-visit-ground',
    'rn_mc_moma-visit': 'moma-visit',
    'rn_mc_moma-visit-middle-customer': 'moma-visit-middle-customer',
    'rn_mc_moma-bml-map': 'moma-bml-map',
    'rn_mc_moma-home': 'moma-home',
    'rn_mc_moma-competition-data-board': 'moma-competition-data-board',
    'rn_meishi_popcornmrn-1710-2778': 'meishi_popcornmrn-1710-2778',
    'rn_mc_merchant-dish': 'merchant-dish',
    'rn_mc_moma-dish': 'moma-dish',
    'rn_mc_dianping-dish': 'dianping-dish',
    'rn_mc_fdc-material-moma': 'fdc-material-moma',
    'rn_mc_fdc-material-kdb': 'fdc-material-kdb',
    'rn_mc_merchant-poi-info': 'merchant-poi-info',
    'rn_mc_moma-visit-warning': 'moma-visit-warning'
  }

  // Helper function to parse JSON safely
  function safeJSONParse(str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      return null
    }
  }

  // Helper function to generate URL parameters
  function generateURLParams(params) {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  }

  // Helper function to create and insert link
  function createLink(targetElement, url, text) {
    if (!targetElement) return

    const link = document.createElement('a')
    link.href = url
    link.textContent = text || url
    link.target = '_blank'
    link.style.marginLeft = '10px'
    targetElement.appendChild(link)
  }

  // Helper function to stringify query parameters
  function stringifyQuery(obj) {
    if (!obj || typeof obj !== 'object') {
      return ''
    }

    return Object.entries(obj)
      .filter(([_, value]) => value != null) // Filter out null/undefined
      .map(([key, value]) => {
        // Handle arrays
        if (Array.isArray(value)) {
          return value
            .map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
            .join('&')
        }
        // Handle objects
        if (typeof value === 'object') {
          return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value))
        }
        // Handle primitive values
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')
  }

  function extractFileLocations(errorString) {
    try {
      // 匹配 文件名.js:行号:列号 的模式
      const regex = /[a-zA-Z0-9_-]+\.js:\d+:\d+/g
      const matches = errorString.match(regex) || []
      return matches
    } catch (error) {
      console.error('Extract file locations failed:', error)
      return []
    }
  }

  // Main function to initialize the script
  function init() {
    let jsonData
    let platform

    const appNameEle = document.querySelector('#app div.error-title div.error-title-left div.project-header > span.name')
    const appName = appNameEle ? appNameEle.textContent : ''
    const formatAppName = presetsAPP[appName]

    // Example of finding and parsing JSON content
    const jsonElement = document.querySelector('#app div.modal__content div.row__content')
    if (jsonElement) {
      jsonData = safeJSONParse(jsonElement.textContent)
    }

    // platform
    const platformElement = document.querySelector('#app div.os-img--android')
    platform = platformElement ? 'android' : 'ios'

    // Find the target element for link insertion
    const targetElements = document.querySelectorAll(
      '#app div.modal__content div.stack-con.stack-con--border > ol > li'
    )
    targetElements.forEach(targetElement => {
      if (targetElement) {
        // Example URL - replace with your actual URL
        const textContent = extractFileLocations(targetElement.textContent)
        const loc = textContent && textContent.length > 0 ? textContent[0] : ''
        if (!loc) return
        createLink(
          targetElement,
          `https://recorder.hfe.test.sankuai.com/mrn/reverse?${stringifyQuery({
            loc: loc,
            bundleVersion: jsonData.bundleVersion || '1.0.0',
            platform,
            appName,
          })}`,
          '点我反解🚀'
        )
      }
    })
  }

  // Run the script after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Re-run on dynamic content changes
  const observer = new MutationObserver(mutations => {
    // 检查变更是否包含我们关心的元素
    const shouldInit = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        return node.matches?.('div.right-modal.detail-modal') || node.matches?.('ol.source-list')
      })
    })

    if (shouldInit) {
      init()
    }
  })

  observer.observe(document.querySelector('#app div.modal__content') || document.body, {
    childList: true,
    subtree: true,
  })
})()
