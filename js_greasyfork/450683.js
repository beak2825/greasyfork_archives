// ==UserScript==
// @name         検閲スクリプト
// @namespace    https://midra.me
// @version      1.0.1
// @description  指定したキーワードを検閲します
// @author       Midra
// @license      MIT
// @match        *://*/*
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/450683/%E6%A4%9C%E9%96%B2%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450683/%E6%A4%9C%E9%96%B2%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(() => {
  'use strict'

  //----------------------------------------
  // 設定初期化
  //----------------------------------------
  const configInitData = {
    keyword: {
      label: 'キーワード (「,」で複数指定可)',
      type: 'textbox',
      default: '',
    },
    caseSensitive: {
      label: '大文字を小文字を区別しない',
      type: 'checkbox',
      default: false,
    },
  }

  GM_config.init('検閲設定', configInitData)

  GM_config.onload = () => {
    setTimeout(() => {
      alert('設定を反映させるにはページを再読み込みしてください。')
    }, 200)
  }

  GM_registerMenuCommand('設定', GM_config.open)

  // 設定取得
  const config = {}
  Object.keys(configInitData).forEach(v => { config[v] = GM_config.get(v) })

  if (!config['keyword']) return

  const keywords = config['keyword'].split(',').map(val => ({
    regexp: new RegExp(val.trim(), config['caseSensitive'] ? 'gi' : 'g'),
    censor: Array.from(val.trim()).map(() => '█').join('')
  }))

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  const replaceWord = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const word of keywords) {
        node.textContent = node.textContent.replace(word.regexp, word.censor)
      }
      return true
    }
    return false
  }

  /**
   * @param {NodeList} nodes
   */
  const replaceAllTextNode = nodes => {
    for (const node of nodes) {
      if (!replaceWord(node)) {
        replaceAllTextNode(node.childNodes)
      }
    }
  }

  //----------------------------------------
  // 監視
  //----------------------------------------
  const obs = new MutationObserver(mutationRecord => {
    obs.disconnect()
    for (const { target, addedNodes } of mutationRecord) {
      if (0 < addedNodes.length) {
        replaceAllTextNode(target.childNodes)
      }
    }
    obs.observe(document.body, { childList: true, subtree: true })
  })
  obs.observe(document.body, { childList: true, subtree: true })
})()