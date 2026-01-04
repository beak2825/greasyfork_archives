// ==UserScript==
// @name         Humble Bundle
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  reveal keys
// @author       pal
// @match        https://www.humblebundle.com/downloads?key=*
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/476039/Humble%20Bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/476039/Humble%20Bundle.meta.js
// ==/UserScript==
 
(async function () {
  'use strict';
  const request = async ({ url, method, body, headers }) => {
    const res = await fetch(url, {
      method: method || 'GET',
      body: body || null,
      headers
    })
    if (res.status !== 200) return {}
    return res.json()
  }
  const getGameKey = async (gameItem) => {
    let result
    try {
      result = await request({
        url: 'https://www.humblebundle.com/humbler/redeemkey',
        body: `keytype=${gameItem.machine_name}&key=${gameItem.gamekey}&keyindex=${gameItem.keyindex}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        method: 'POST'
      })
    } catch (e) {
      result = { key: 'Request failed' }
    }
    return result
  }
  const parentEle = document.querySelector('.js-subproduct-whitebox-holder')
  const ele = document.createElement('div')
  ele.innerHTML = `<div style="display: flex; gap: 10px; margin-bottom: 10px; height: 200px;">
        <button style="font-size: 20px; padding: 20px 40px;">Reveal and Copy</button>
        <textarea style="flex: 1; font-family: monospace; padding: 10px; resize: none;" rows="10" placeholder="Revealed keys will appear here..."></textarea>
    </div>`
  parentEle.insertBefore(ele, parentEle.firstElementChild)
  const button = ele.querySelector('button')
  const textarea = ele.querySelector('textarea')
  button.onclick = async function () {
    if (this.innerText !== 'Reveal and Copy') return
    this.innerText = `revealing keys...`
    const [, orderId] = location.href.match(/downloads\?key=(\w+)/) || []
    const { tpkd_dict: { all_tpks } } = await request({
      url: `https://www.humblebundle.com/api/v1/order/${orderId}?all_tpkds=true`,
    })
    const platformObj = all_tpks.reduce((obj, item, index) => {
      if (!obj[item.key_type_human_name]) obj[item.key_type_human_name] = []
      if (all_tpks.length - 1 === index) {
        obj.temp.push(item)
        obj.tpks.push(obj.temp)
        return obj
      }
      if (obj.temp.length >= 4) {
        obj.temp.push(item)
        obj.tpks.push(obj.temp)
        obj.temp = []
      } else {
        obj.temp.push(item)
      }
      return obj
    }, { tpks: [], temp: [] })
    const { tpks } = platformObj
    delete platformObj.tpks
    delete platformObj.temp
    let count = 0
    for (let j = 0; j < tpks.length; j++) {
      const gameArr = tpks[j]
      const result = await Promise.all(gameArr.map(getGameKey))
      result.forEach((item, index) => {
        this.innerText = `${++count}/${all_tpks.length}`
        const game = gameArr[index]
        platformObj[game.key_type_human_name].push(`${game.human_name};; ${item.key}`)
      })
    }
 
    const platform = Object.keys(platformObj)
    const gameText = []
    for (let i = 0; i < platform.length; i++) {
      const keyType = platform[i]
      const games = platformObj[keyType]
      gameText.push(games.join('\n'))
    }
    const finalText = gameText.join('\n\n')
    textarea.value = `${finalText}`;
 
    // Copy to clipboard
    try {
      GM_setClipboard(finalText)
      button.innerText = 'Copied to Clipboard!'
    } catch (err) {
      button.innerText = 'Copy Failed - Use Ctrl+C'
    }
 
    setTimeout(() => {
      button.innerText = 'Reveal and Copy'
    }, 2000)
  }
 
})();