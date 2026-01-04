// ==UserScript==
// @name         剑三万宝楼账号查看图片
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  剑三万宝楼账号详情可以查看外观图片
// @author       箫阮阮
// @match        https://jx3.seasunwbl.com/*
// @icon         https://jx3.seasunwbl.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480626/%E5%89%91%E4%B8%89%E4%B8%87%E5%AE%9D%E6%A5%BC%E8%B4%A6%E5%8F%B7%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/480626/%E5%89%91%E4%B8%89%E4%B8%87%E5%AE%9D%E6%A5%BC%E8%B4%A6%E5%8F%B7%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

let abortController = new AbortController()
let lastPromise = null // 最后一个promise

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  }
  catch (e) {
    console.error('localStorage set error: ', e)
  }
}

function getLocalStorage(key, defaultValue = null) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  }
  catch (e) {
    console.error('localStorage get error: ', e)
    return defaultValue
  }
}

function observerDom(dom, callback) {
  const options = { childList: true, subtree: true }
  const observer = new MutationObserver(callback)
  observer.observe(dom, options)
}

function waitDomBySelector(selector) {
  return new Promise((resolve) => {
    const waitDom = () => {
      const dom = document.querySelector(selector)
      if (dom !== null)
        resolve(dom)
      else
        requestAnimationFrame(waitDom)
    }
    waitDom()
  })
}

function getClothUrl(name) {
  return `https://dl.pvp.xoyo.com/prod/icons/handbook/image/${name}-%E8%AF%A6%E6%83%85-1.png`
}

function getLocalImgUrl(name) {
  return getLocalStorage('imgUrls', {})?.[name] || ''
}

function updateLocalImgUrl(name, url) {
  const imgUrls = getLocalStorage('imgUrls', {})
  imgUrls[name] = { url, updateTime: new Date().getTime() }
  setLocalStorage('imgUrls', imgUrls)
}

async function getImgUrlByName(name, isRoleClothes = false) {
  name = preprocessName(name)
  const localUrl = getLocalImgUrl(name)
  if (localUrl) {
    const isDisplayImage = localUrl.url !== '暂无展示外观图'
    const currentTime = new Date().getTime()
    if (!isDisplayImage && localUrl.updateTime + 24 * 60 * 60 * 1e3 > currentTime) {
      return ''
    }
    else if (isDisplayImage && localUrl.updateTime + 30 * 24 * 60 * 60 * 1e3 > currentTime) {
      return localUrl.url
    }
    else if (isDisplayImage && localUrl.updateTime + 30 * 24 * 60 * 60 * 1e3 < currentTime) {
      // 检查链接是否正常
      const isUrlValid = await checkImage(localUrl.url)
      if (isUrlValid) {
        updateLocalImgUrl(name, localUrl.url)
        return localUrl.url
      }
    }
  }

  const baseUrl = getClothUrl(name)
  const isBaseUrlValid = await checkImage(baseUrl)
  if (isBaseUrlValid) {
    updateLocalImgUrl(name, baseUrl)
    return baseUrl
  }

  const reg = /·(黑发|衣|外装|左|右|白发|金发|披风|帽|发)$/
  const isBox = !reg.test(name)
  if (!isBox) {
    const types = ['礼盒', '·礼盒']
    const plusReg = /·(白发|金发)$/
    types.unshift(plusReg.test(name) ? '·豪华' : '·标准')
    const baseName = name.replace(reg, '')
    const newBaseName = baseName.replaceAll('·', '')
    const urls = types.map(item => getClothUrl(baseName + item))
    if (baseName !== newBaseName) {
      const newUrls = types.map(item => getClothUrl(newBaseName + item))
      urls.push(...newUrls)
    }
    return await getImageFromUrls(name, urls)
  }
  else if (isBox && isRoleClothes) {
    const roleClothesReg = /^(黑发|白发|金发|发|帽)·/
    if (roleClothesReg.test(name)) {
      const types = ['礼盒', '·礼盒', '·豪华', '·标准']
      const baseName = name.replace(roleClothesReg, '')
      const urls = types.map(item => getClothUrl(baseName + item))
      return await getImageFromUrls(name, urls)
    }
    else {
      const types = ['礼盒', '·礼盒', '·豪华', '·标准']
      const urls = types.map(item => getClothUrl(name + item))
      const newBaseName = name.replaceAll('·', '')
      if (name !== newBaseName) {
        const newUrls = types.map(item => getClothUrl(newBaseName + item))
        urls.push(...newUrls)
      }
      return await getImageFromUrls(name, urls)
    }
  }
  updateLocalImgUrl(name, '暂无展示外观图')
  return ''
}

async function getImageFromUrls(name, urls) {
  try {
    const url = await checkImages(urls)
    updateLocalImgUrl(name, url)
    return url
  }
  catch (e) {
    updateLocalImgUrl(name, '暂无展示外观图')
    return ''
  }
}

function checkImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = function () {
      resolve(true)
    }
    img.onerror = function () {
      resolve(false)
    }
    img.src = url
  })
}

function checkImages(urls) {
  const promises = urls.map(async (url) => {
    const isValid = await checkImage(url)
    if (isValid)
      return url // 返回有效的URL
    else
      return Promise.reject(new Error('URL无效')) // 如果URL无效，将Promise拒绝
  })
  return Promise.any(promises)
}

function hoverImgCallback(mutations) {
  mutations.forEach((mutation) => {
    // 检查每个 mutation 中新增的节点
    mutation.addedNodes.forEach(async (node) => {
      // 判断新增节点是否为目标 div
      if (node instanceof HTMLElement && node.className === 'app-web-components-modal-components-role-detail-styles-index-m__positionRelative--3gVPE') {
        await waitDomBySelector('.lazyload-wrapper')
        const nodeList = node.querySelectorAll('.lazyload-wrapper')
        for (const item of Array.from(nodeList)) {
          const contentType = item.querySelector('div.lazyload-wrapper>div>div>div:nth-child(2)').textContent
          const whiteList = new Set(['发型：', '成衣：', '披风：', '挂宠：'])
          if (whiteList.has(contentType)) {
            const contentList = item.querySelector('div.lazyload-wrapper>div>div:nth-child(2)')
            const content = contentList.textContent
            if (content !== '无') {
              const children = contentList.children
              for (const child of children) {
                const name = child.textContent
                const imgDom = child.querySelector('img')
                if (isSetHoverImg(imgDom.src, name))
                  setShowImgEventListener(imgDom, name, 16, 30)
              }
            }
          }
        }
      }
    })
  })
}

function preprocessName(name) {
  const replaceReg = /·(（替）)$/
  const replaceMap = new Map([['清光彩璨礼盒', '清光彩璨·琉华礼盒']])
  let tempName = name
  if (replaceReg.test(tempName))
    tempName = tempName.replace(replaceReg, '')
  else if (replaceMap.has(tempName))
    tempName = replaceMap.get(tempName)
  return tempName
}

function isSetHoverImg(src, name, type = '') {
  // 完整匹配
  const blockUrls = new Set([
    'https://jx3wbl.xoyocdn.com/img/icon-no-equipment-resource.d1bae5d2.jpg',
    'https://dl.pvp.xoyo.com/prod/icons/baoxiang12.png?v=2',
    'https://dl.pvp.xoyo.com/prod/icons/biaoju09.png?v=2',
  ])
  // 模糊匹配
  const blockUrlKeyWords = [
    'https://dl.pvp.xoyo.com/prod/icons/item_21_7_5_',
    'https://dl.pvp.xoyo.com/prod/icons/item_23_9_26',
    'https://dl.pvp.xoyo.com/prod/icons/tome',
  ]
  // 正则匹配以 xxx 结尾
  const blockNameReg = /·(一|二|三|四|五)$/
  // 正则匹配以 xxx 开头
  const blockNameRegPre = /^(发型)·/
  // 模糊匹配关键词
  const blockKeyWords = ['芽芽', '表情包', '佩囊']
  // 完整匹配关键词
  const blockNames = new Set(['鼠栗栗', '鼠萌萌', '喵乌乌', '耳绒绒'])

  let typeTemp = !!type
  if (type !== '') {
    const typeBlock = new Set(['佩囊', '小头像', '宠物', '马具', '手饰', '眼饰', '肩饰', '面挂', '背挂', '腰挂'])
    typeTemp = typeBlock.has(type)
  }

  return !typeTemp
    && !blockUrls.has(src)
    && !blockNameReg.test(name)
    && !blockNameRegPre.test(name)
    && !blockNames.has(name)
    && !blockKeyWords.some(item => name.includes(item))
    && !blockUrlKeyWords.some(item => src.includes(item))
}

function isTimeChange(mutation) {
  return (mutation.type === 'childList'
    && mutation.addedNodes.length === 1
    && mutation.removedNodes.length === 0
    && mutation.addedNodes[0].nodeName === '#text')
}

function addTooltipImg() {
  const img = document.createElement('img')
  img.classList.add('popUpImgFixed')
  img.alt = '暂无外观展示图'
  img.addEventListener('mouseenter', () => {
    // 鼠标进入悬浮框时保持显示状态
    img.style.display = 'block'
  })

  img.addEventListener('mouseleave', () => {
    // 鼠标离开悬浮框时隐藏悬浮框
    img.style.display = 'none'
  })
  document.body.appendChild(img)
}

async function aTentListObserverCallback(mutationsList) {
  for (const mutation of mutationsList) {
    if (isTimeChange(mutation)) {
      const stateDom = mutation.target.closest('.app-web-page-follow-components-styles-components-m__flexWrap--1vtQV').nextElementSibling
      if (location.pathname === '/follow' && location.search === '?t=skin') {
        const infoDiv = stateDom.parentElement.children[0]
        const name = infoDiv.textContent
        setShowImgEventListener(infoDiv, name, -40, 100)
      }
    }
  }
}

function setShowImgEventListener(triggerDom, goodsName, yOffset = 60, xOffset = 38) {
  if (goodsName) {
    const img = document.querySelector('.popUpImgFixed')
    triggerDom.style.cursor = 'pointer'
    triggerDom.addEventListener('mouseenter', async (e) => {
      // 取消上一次的异步操作
      if (lastPromise) {
        abortController.abort()
        abortController = new AbortController()
      }

      img.src = ''
      const { left, top, width, height } = e.target.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight
      const position = {
        top: centerY <= winHeight / 2 ? `${Math.max(centerY + yOffset, 0)}px` : '',
        bottom: centerY > winHeight / 2 ? `${Math.max(winHeight - centerY + yOffset, 0)}px` : '',
        left: centerX <= winWidth / 2 ? `${Math.max(centerX + xOffset, 0)}px` : '',
        right: centerX > winWidth / 2 ? `${Math.max(winWidth - centerX + xOffset, 0)}px` : '',
      }
      Object.assign(img.style, position)
      img.style.display = 'block'
      // 保存当前 Promise
      lastPromise = getImgUrlByName(goodsName, true)
      try {
        img.src = await lastPromise
      }
      catch (error) {
        // 在这里处理取消的情况
        if (error.name === 'AbortError')
          console.log('操作已取消')
        else
          console.error(error)
      }
    })
    triggerDom.addEventListener('mouseleave', () => {
      // 取消上一次的异步操作
      if (lastPromise) {
        abortController.abort()
        abortController = new AbortController()
        lastPromise = null
      }
      img.style.display = 'none'
    })
  }
}

(async () => {
  'use strict'
  const pathName = location.pathname
  addTooltipImg()
  if (pathName === '/follow') {
    await waitDomBySelector('.app-web-page-follow-index-m__followComponent--TEzXY')
    observerDom(document.querySelector('.app-web-page-follow-index-m__followComponent--TEzXY'), aTentListObserverCallback)
  }
  if (pathName === '/follow' || pathName === '/buyer') {
    const style = document.createElement('style')
    style.textContent = `
        .popUpImg{
            position: absolute;
            background: url(//jx3wbl.xoyocdn.com/img/bg-empty.13dfbabf.png) center top no-repeat rgb(247, 253, 255);
            min-height: 360px;
            z-index: 1;
            top: 4px;
            left: 150px;
            box-shadow: 0 0 10px 4px #ccc;
            border-radius: 8px;
            color: transparent;
            user-select: none;
            display: none;
        }
        .popUpImgFixed{
            position: fixed;
            background: url(//jx3wbl.xoyocdn.com/img/bg-empty.13dfbabf.png) center top no-repeat rgb(247, 253, 255);
            min-height: 360px;
            z-index: 99999;
            box-shadow: 0 0 10px 4px #ccc;
            border-radius: 8px;
            color: transparent;
            user-select: none;
            display: none;
        }
        img[alt]:not([alt=""])::after {
            min-width: 638px;
            content: attr(alt);
            margin-top: 90px;
            display: block;
            color: rgb(191, 191, 191);
            font-size: 24px;
            text-align: center;
        }
        `
    document.body.appendChild(style)
    observerDom(document.body, hoverImgCallback)
  }
}
)()
