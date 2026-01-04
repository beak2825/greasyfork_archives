// ==UserScript==
// @name         hijav 快速预览
// @namespace    http://tampermonkey.net/
// @version      0.35.7
// @description  collect hijav preview images quickly
// @author       miles
// @match        https://hijav.net/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502499/hijav%20%E5%BF%AB%E9%80%9F%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/502499/hijav%20%E5%BF%AB%E9%80%9F%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  const runHiJAV = () => {
    if (!location.href.includes('hijav.net')) {
      return
    }

    const dialog = document.createElement('dialog')
    dialog.align = 'center'
    dialog.open = false
    dialog.style.zIndex = 1000

    const div = document.createElement('div')
    div.style.display = 'grid'
    div.style.gap = '4vh'
    div.style.overflowY = 'scroll'
    div.style.maxHeight = '94vh'
    div.style.padding = '0 60px'
    // 获取所有可能的元素
    const getElements = () => {
      const post = [...document.querySelectorAll('.post.type-post ')]
      const postLinks = post.map((c) => {
        const i = c.querySelector('#content') || c
        const image = i.children[3].children[0]
        const contentContainer = [...i.children[1].children]
        const hasA = contentContainer.find((i) => i.tagName === 'A')
        const hasImg = contentContainer.find((i) => i.tagName === 'IMG')
        const link = hasA?.href || hasImg?.src
        const a = document.createElement('a')
        a.href = link
        const targetImage = hasImg || image
        if (targetImage) {
          a.appendChild(targetImage.cloneNode())
          const date = i.querySelector('.comm_date')
          if (date) {
            a.style.position = 'relative'
            const cloneDate = date.cloneNode(true)
            cloneDate.style.top = '87px'
            cloneDate.style.left = '0'
            cloneDate.style.marginLeft = '-57px'
            cloneDate.style.border = '1px solid #545454'
            cloneDate.style.borderRadius = '5px'
            a.appendChild(cloneDate)
          }
        }
        const children = i.children || []
        const findMaybeIndex = [...children].findIndex((c) => c.className.includes('separator')) - 1
        const images = [...children[findMaybeIndex].children].filter((i) => i.tagName === 'A')
        return [a, ...images]
      })
      return postLinks.flat()
    }

    // clone 所有可能的元素
    const createElements = (action) => {
      const elements = getElements()
      elements.forEach((e) => {
        const node = e.cloneNode(true)
        node.target = '_blank'
        action?.(node)
        div.append(node)
      })
    }

    const btnOpenLarge = document.createElement('button')
    btnOpenLarge.style.marginLeft = '5px'
    btnOpenLarge.innerText = 'open large'
    btnOpenLarge.style.position = 'fixed'
    btnOpenLarge.style.top = '5px'
    btnOpenLarge.onclick = () => {
      div.style.gridTemplateColumns = '1fr 1fr'
      createElements((node) => {
        node.style.display = 'flex'
        node.style.alignItems = 'center'
        node.style.justifyContent = 'center'
        const image = node.firstChild
        if (!image?.src) {
          return
        }
        image.src = image.src.replace('.th.', '.')
        image.style.maxHeight = '94vh'
        image.style.maxWidth = '40vw'
      })
      dialog.open = true
    }

    const btnClose = document.createElement('button')
    btnClose.innerText = 'close'
    btnClose.onclick = () => {
      dialog.close()
      div.innerHTML = ''
    }

    dialog.append(btnClose)
    dialog.append(div)
    dialog.style.top = '5px'
    document.body.prepend(btnOpenLarge)
    document.body.prepend(dialog)
  }
  runHiJAV()
})()