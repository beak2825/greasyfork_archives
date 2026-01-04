// ==UserScript==
// @name         Humble Bundle Auto Redeem
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  HB download 页面刮key
// @author       kumi
// @match        https://www.humblebundle.com/downloads?key=*
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441728/Humble%20Bundle%20Auto%20Redeem.user.js
// @updateURL https://update.greasyfork.org/scripts/441728/Humble%20Bundle%20Auto%20Redeem.meta.js
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
      } catch(e) {
          result = {key: '请求失败'}
      }
     return result
  }
  const parentEle = document.querySelector('.js-subproduct-whitebox-holder')
  const ele = document.createElement('div')
  ele.innerHTML = `<button style="display: block; font-size: 20px; margin-bottom: 10px; padding: 20px 40px;">全部刮开</button><textarea style="width: 50%; height: 300px;"></textarea>`
  parentEle.insertBefore(ele, parentEle.firstElementChild)
  ele.firstElementChild.onclick = async function() {
    if(this.innerText !== '全部刮开') return
    this.innerText = `正在刮key...`
    const [, orderId] = location.href.match(/downloads\?key=(\w+)/) || []
    const { tpkd_dict: { all_tpks } } = await request({
      url: `https://www.humblebundle.com/api/v1/order/${orderId}?all_tpkds=true`,
    })
    const platformObj = all_tpks.reduce((obj, item, index) => {
      if (!obj[item.key_type_human_name]) obj[item.key_type_human_name] = []
      if(all_tpks.length - 1 === index) {
        obj.temp.push(item)
        obj.tpks.push(obj.temp)
        return obj
      }
      if(obj.temp.length >= 4) {
        obj.temp.push(item)
        obj.tpks.push(obj.temp)
        obj.temp = []
      } else {
        obj.temp.push(item)
      }
      return obj
    }, {tpks: [], temp: []})
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
            platformObj[game.key_type_human_name].push(`${game.human_name},${item.key}`)
        })
     }

    const platform = Object.keys(platformObj)
    const gameText = []
    for (let i = 0; i < platform.length; i++) {
      const keyType = platform[i]
      gameText.push(keyType + '平台\n'+ platformObj[keyType].join('\n'))
    }
    ele.lastElementChild.value = gameText.join('\n\n')
  }

})();