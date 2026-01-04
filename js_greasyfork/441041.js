// ==UserScript==
// @name         抢单脚本
// @namespace    http://dbdh.top/
// @version      10.0
// @description  这是一个抢单脚本
// @author       aaronchen233
// @match        *://*.quanma51.com/*
// @icon         https://www.google.com/s2/favicons?domain=quanma51.com
// @downloadURL https://update.greasyfork.org/scripts/441041/%E6%8A%A2%E5%8D%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441041/%E6%8A%A2%E5%8D%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

;(() => {
  'use strict'

  let st = 0 // 0:不抢 1:抢指定 2:抢全部
  const msg = ['不在抢单中', '正在抢指定单', '正在抢全部单']
  const list = ['超级至尊披萨', '浓情香鸡翼', '香草凤尾虾']

  // 创建按钮
  const span = document.createElement('span')
  span.innerHTML = msg[st]
  span.style.cssText =
    'position: fixed; right: 0; bottom: 120px; z-index: 99; margin-right: calc((100% - 414px) / 2); padding: 5px 8px; border: 1px solid rgb(238, 238, 238); background: rgb(255, 255, 255); border-radius: 10px; cursor: pointer;'

  // 向页面添加按钮
  let observer = new MutationObserver(() => {
    const wrapper = document.querySelector('#pzh')
    if (wrapper) {
      observer.disconnect()
      wrapper.appendChild(span)
      observer = new MutationObserver(() => {
        // 新的订单来了
        document.querySelector('.van-icon')?.click()
        // 获取商品
        const lumps = document.querySelectorAll('.lump')
        if (!lumps.length) return
        const index =
          st === 2
            ? 0
            : [...lumps].findIndex((lump) =>
                list.includes(lump.querySelector('.fz15').innerHTML)
              )
        lumps[index].querySelector('.buttonkfc')?.click()
        lumps[index].querySelector('.van-hairline--left')?.click()
      })
    }
  })
  const config = { childList: true, subtree: true }
  observer.observe(document.body, config)

  // 监听按钮点击事件
  span.addEventListener('click', () => {
    observer.disconnect()
    st = (st + 1) % 3
    span.innerHTML = msg[st]
    // 抢单
    st !== 0 && observer.observe(document.body, config)
  })
})()
