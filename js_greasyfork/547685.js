// ==UserScript==
// @name         碧可梦
// @namespace    https://github.com/Waaatanuki
// @version      1.0.3
// @description  碧可梦散步
// @author       Waaatanuki
// @license      MIT
// @match        *://*/*
// @icon         https://prd-game-a-granbluefantasy.akamaized.net/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/547685/%E7%A2%A7%E5%8F%AF%E6%A2%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/547685/%E7%A2%A7%E5%8F%AF%E6%A2%A6.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️配置信息⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️

  const config = {"sort":[0],"cosmetic":["000","000","000"],"size":100,"frameInterval":150}

  // ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️配置信息⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️

  const STORAGE_KEY = 'sampoPosition'
  const imgUri = 'https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/vyrnsampo/assets/character/exploring'

  let requestId = null

  // 主容器
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.zIndex = '9999'
  container.style.display = 'flex'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  container.style.cursor = 'move'

  // 尝试从GM存储加载位置（跨页面共享）
  const savedPosition = GM_getValue(STORAGE_KEY)
  if (savedPosition) {
    const { left, top } = savedPosition
    container.style.left = `${left}px`
    container.style.top = `${top}px`
  }
  else {
    container.style.right = '20px'
    container.style.bottom = '20px'
  }

  const partyInfo = []

  for (let i = 0; i < config.sort.length; i++) {
    const npcId = config.sort[i]

    const npcContainer = document.createElement('div')
    npcContainer.style.position = 'relative'
    npcContainer.style.width = `${config.size}px`
    npcContainer.style.height = `${config.size}px`
    container.appendChild(npcContainer)

    const npcInfo = { id: npcId, element: [] }

    for (let i = 0; i < (npcId === 0 ? 3 : 1); i++) {
      const el = document.createElement('img')
      el.style.position = 'absolute'
      el.style.width = `${config.size}px`
      el.draggable = false
      el.onerror = () => {
        console.log('加载碧可梦失败')
        if (requestId) {
          cancelAnimationFrame(requestId)
          requestId = null
        }
        container.remove()
      }
      npcContainer.appendChild(el)
      npcInfo.element.push(el)
    }
    partyInfo.push(npcInfo)
  }

  let isDragging = false
  let offsetX = 0
  let offsetY = 0

  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0)
      return

    isDragging = true
    const rect = container.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging)
      return

    const x = e.clientX - offsetX
    const y = e.clientY - offsetY

    container.style.right = 'auto'
    container.style.bottom = 'auto'
    container.style.left = `${x}px`
    container.style.top = `${y}px`
  })

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false

      const position = {
        left: Number.parseInt(container.style.left),
        top: Number.parseInt(container.style.top),
      }
      GM_setValue(STORAGE_KEY, position)
    }
  })

  document.body.appendChild(container)

  GM_registerMenuCommand('重置位置', () => {
    GM_deleteValue([STORAGE_KEY])
  })

  let currentIndex = 0
  let lastTime = 0

  function animate(timestamp) {
    if (timestamp - lastTime >= config.frameInterval) {
      currentIndex = (currentIndex % 4) + 1
      lastTime = timestamp

      for (const npc of partyInfo) {
        if (npc.id === 0) {
          npc.element.forEach((el, index) => {
            el.src = `${imgUri}/captain/captain_01_0${index + 1}_${config.cosmetic[index]}_0${currentIndex}.png`
          })
        }
        else {
          npc.element.forEach((el) => {
            el.src = `${imgUri}/crew/crew_0${npc.id}_0${currentIndex}.png`
          })
        }
      }
    }

    requestId = requestAnimationFrame(animate)
  }

  requestId = requestAnimationFrame(animate)
})()
