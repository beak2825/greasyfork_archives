// ==UserScript==
// @name         BL Data Query Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      http*://www.blushmark.com/*
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419133/BL%20Data%20Query%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/419133/BL%20Data%20Query%20Helper.meta.js
// ==/UserScript==

const willRequests = []
const onGoingRequests = []
const maxConcurrency = 5

const beginRequest = (func) => {
  if (func) {
    if (onGoingRequests.length < maxConcurrency) {
      onGoingRequests.push(func)
      func()
    } else {
      willRequests.push(func)
    }
  }
}
const stopRequest = () => {
  onGoingRequests.pop()
  if (willRequests.length > 0) {
    const func = willRequests.shift()
    onGoingRequests.push(func)
    func()
  }
}

// 强依赖网站的参数
// 1.cookie中的 hasLogin, login_token
// 2.商品div中的class goods-item
// 3.商品div中的class goods-item 的上级div 要有 data-goods-id data-style-id参数

const getQueryStringValue = (key) => {
  return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'))
}

const getHost = () => {
  const hostName = window.location.hostname
  let host = 'https://www.blushmark.com/prod'
  if (hostName.startsWith('ft') || hostName.startsWith('ft-x')) {
    host = `https://${hostName}/test`
  } else if (hostName.startsWith('p')) {
    host = `https://${hostName}/pre`
  }
  return host
}

const getUrl = (url, params = {}) => {
  let host = getHost()
  console.log('url====>', url)
  console.log('host====>', host)
  console.log('params====>', params)
  const keys = Object.keys(params)
  keys && keys.map((key) => {
    url = url + (url.includes('?') ? '&' : '?') + `${key}=${params[key]}`
  })
  return host + url
}

const GET = (path, params, callback) => {
  beginRequest(() => {
    const xhr = new XMLHttpRequest()
    const url = getUrl(path, params)
    console.log('url====>', url)
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        const info = JSON.parse(xhr.responseText)
        if (info && info.code == 0) {
          callback(info.data)
        } else {
          callback(undefined)
        }
        stopRequest()
      }
    }
    xhr.send()
  })
}

const fetchData = (goodsId, styleId, callback) => {
  const isAllListPage = window.location.pathname.startsWith('/categories/0_0/')
  const isClearance = window.location.pathname.startsWith('/clearance')
  const isSortByNew = window.location.search.includes('sort_by=new')
  const params = {
    styleId: styleId,
    callback: goodsId,
    type: (isAllListPage ? getQueryStringValue('type') : ''),
    pageType: (isClearance ? 'clearance' : isSortByNew ? 'just_in' : 'normal')
  }
  GET('/1.0/plugin/ctr-detail', params, callback)
}

const indexGetData = (ec, el, list_page_path, callback) => {
  const params = {
    path: list_page_path,
    ec: ec,
    el: el
  }
  GET('/1.0/home/plugin-ctr', params, callback)
}

const productGetData = (goods_id, style_id, size_id, callback) => {
  const params = {
    goods_id: goods_id,
    style_id: style_id,
    size_id: size_id
  }
  GET('/1.0/home/getStockTransit', params, callback)
}

const HTTP = {
    fetchData,
    indexGetData,
    productGetData
}

const elementIdentifier = 'chrome-extension-info'
const elementProductIdentifer = 'chrome-extension-info-product'
const MOUSE_VISITED_CLASS_NAME = 'goods-item'
const MOUSE_VISITED_CLASS_NAME_INDEX = 'ctr-index'
const MOUSE_VISITED_CLASS_NAME_PRODUCT = 'ctr-product'

// 强依赖网站的参数
// 1.cookie中的 hasLogin, login_token
// 2.商品div中的class goods-item
// 3.商品div中的class goods-item 的上级div 要有 data-goods-id data-style-id参数
const createRowElement = (dataElement, text) => {
  const container = document.createElement('span')
  container.className = 'extension-container'
  const textElement = document.createTextNode(text)
  container.appendChild(textElement)
  dataElement.appendChild(container)
  return container
}

/**
 * 获取containerElement
 * @param element
 */
const getContainerElement = (element) => {
  let containerElement = null
  if (element && element.className.indexOf(MOUSE_VISITED_CLASS_NAME) >= 0) {
    // 商品在此获取数据
    const findGoodsImageElementFunc = (elements) => {
      elements && Array.from(elements).some(e => {
        if (e && e.classList && e.classList.value.indexOf('goods-item-pic') >= 0) {
          containerElement = e
          return true
        }
        findGoodsImageElementFunc(e.children)
      })
    }
    findGoodsImageElementFunc(element.children)
  } else {
    // 首页和详情页在此获取数据
    containerElement = element
  }
  return containerElement
}

const showListCover = (containerElement) => {
  if (!containerElement || !containerElement.parentElement) {
    return
  }
  // 商品获取方式
  const goodsId = containerElement.parentElement.getAttribute('data-goods-id')
  const styleId = containerElement.parentElement.getAttribute('data-style-id')
  const pageType = containerElement.parentElement.getAttribute('page-type')
  // 参数不合法 退出
  if (!goodsId || !styleId || !pageType) return

  const children = Array.from(containerElement.children)
  let isExist = false
  children && children.map(e => {
    if (e.id === elementIdentifier) {
      if (e.dataId === goodsId + '' + styleId) {
        isExist = true
      } else {
        // 存在一个其他商品的数据 移除
        e.parentNode.removeChild(e)
      }
    }
  })
  // 已经存在了 不再次展示
  if (isExist) return
  const dataElement = document.createElement('div')
  dataElement.id = elementIdentifier
  dataElement.dataId = goodsId + '' + styleId
  dataElement.style.zIndex = 100

  const ctrElement = createRowElement(dataElement, 'CTR: -%')
  let justInElement
  if (pageType == 'just_in') {
    justInElement = createRowElement(dataElement, 'BST_CTR: -')
  }
  const crElement = createRowElement(dataElement, 'CR: -%')
  const ctrCrElement = createRowElement(dataElement, pageType == 'just_in' ? 'BST_CTR*CR: -' : 'CTR*CR: -')
  const saleElement = createRowElement(dataElement, 'SAL: -')
  const averageElement = createRowElement(dataElement, 'AVE: -')
  const clickElement = createRowElement(dataElement, 'CLI: -')
  const impressionElement = createRowElement(dataElement, 'IMP: -')
  const userElement = createRowElement(dataElement, 'DET: -')
  const ostElement = createRowElement(dataElement, 'OST: -')
  const abElement = createRowElement(dataElement, '')
  abElement.style.display = 'none'
  containerElement && containerElement.appendChild(dataElement)
  HTTP.fetchData(goodsId, styleId, (data) => {
    if (data) {
      const { cr, ctr, sales, viewCount, clickCount, showNumber, onSaleTime, ab_test, ctrCr, goodsSales, bestSellerCtr, averageDailySales } = data
      ctrElement.textContent = 'CTR: ' + ctr
      crElement.textContent = 'CR: ' + cr
      saleElement.textContent = 'SAL: ' + sales + '(' + goodsSales + ')'
      clickElement.textContent = 'CLI: ' + clickCount
      impressionElement.textContent = 'IMP: ' + viewCount
      userElement.textContent = 'DET: ' + showNumber
      ostElement.textContent = 'OST: ' + onSaleTime
      ctrCrElement.textContent = (pageType == 'just_in' ? 'BST_CTR*CR:' : 'CTR*CR: ') + ctrCr
      averageElement.textContent = 'AVE: ' + averageDailySales
      if (ab_test) {
        abElement.textContent = 'A/B Test'
        abElement.style.display = 'block'
      }

      if (pageType == 'just_in') {
        if (bestSellerCtr == undefined) {
          justInElement.parentElement.removeChild(justInElement)
        } else { justInElement.textContent = 'BST_CTR:' + bestSellerCtr }
      }
    }
  })
}

const showHomeCover = (element, containerElement) => {
  if (!element || !containerElement) {
    return
  }
  const children = Array.from(containerElement.children)
  let isExist = false
  children && children.map(e => {
    if (e.id === elementIdentifier) {
      isExist = true
    }
  })
  // 已经存在了 不再次展示
  if (isExist) return
  const ec = element.getAttribute('ec')
  const el = element.getAttribute('el')
  const list_page_path = element.getAttribute('list_page_path')
  // 参数不合法
  if (!ec || !el || !list_page_path) return

  const dataElement = document.createElement('div')
  dataElement.id = elementIdentifier
  dataElement.style.zIndex = 100

  const ctrElement = createRowElement(dataElement, 'CTR: -%')
  const clickElement = createRowElement(dataElement, 'Click: -')
  const viewElement = createRowElement(dataElement, 'Impression: -')
  HTTP.indexGetData(ec, el, list_page_path, (data) => {
    if (data) {
      const { ctr, click_count, view_count } = data
      ctrElement.textContent = 'CTR: ' + (ctr || '0%')
      clickElement.textContent = 'Click: ' + (click_count || 0)
      viewElement.textContent = 'Impression: ' + (view_count || 0)
    }
  })
  containerElement && containerElement.appendChild(dataElement)
}

const showDetailCover = (element, containerElement) => {
  if (!element || !containerElement) {
    return
  }
  const children = Array.from(containerElement.children)
  let isExist = false
  children && children.map(e => {
    if (e.id === elementProductIdentifer && e.style_id === element.getAttribute('selectedColorId')) {
      isExist = true
    }

    if (e.style_id !== element.getAttribute('selectedColorId')) {
      if (e.id === elementProductIdentifer) {
        e && e.parentNode.removeChild(e)
      }
    }
  })

  // 已经存在了 不再次展示
  if (isExist) return

  const goods_id = element.getAttribute('selectedGoodsId')
  const style_id = element.getAttribute('selectedColorId')
  const size_id = element.getAttribute('selectedSizeId')
  // 参数不合法
  if (!goods_id || !style_id || !size_id) return

  const dataElement = document.createElement('div')
  dataElement.id = elementProductIdentifer
  dataElement.style.zIndex = 1
  const showElement = createRowElement(dataElement, '-')
  dataElement.style_id = style_id
  const showElement2 = createRowElement(dataElement, '')
  HTTP.productGetData(goods_id, style_id, size_id, (data) => {
    if (data) {
      if (data.has_virtual) {
        const result = data.stockTransit && data.stockTransit.split('[')
        showElement.innerHTML = result[0] + '<br>[' + result[1]
      } else {
        showElement.innerHTML = data.stockTransit
      }
      if (data.has_virtual) { showElement2.textContent = 'Virtual' }
    }
  })
  containerElement && containerElement.appendChild(dataElement)
}

const isLogin = () => {
  return document.cookie && document.cookie.includes('hasLogin=1;')
}

const beginTimer = () => {
  console.log('开始脚本====>')
  // 每秒检查 一次
  setInterval(() => {
    // 遍历所有节点，取所有的商品模块
    // 判断该商品模块是否已经有
    // 如果没有，则加入模块，并请求接口
    // 如果已经有了，则啥都不做
    if (isLogin()) {
    // 如果是首页商品不展示内容
    // 列表页面
      const elements = Array.from(document.getElementsByClassName(MOUSE_VISITED_CLASS_NAME))
      if (window.location.pathname != '/' && elements && elements.length > 0) {
        elements.map((element) => {
          let containerElement = getContainerElement(element)
          showListCover(containerElement)
        })
      }
      // 首页
      const indexElements = Array.from(document.getElementsByClassName(MOUSE_VISITED_CLASS_NAME_INDEX))
      if (indexElements && indexElements.length > 0) {
        indexElements.map((element) => {
          showHomeCover(element, element)
        })
      }
      // 详情页面
      const productElements = Array.from(document.getElementsByClassName(MOUSE_VISITED_CLASS_NAME_PRODUCT))
      if (productElements && productElements.length > 0) {
        productElements.map((element) => {
          showDetailCover(element, element)
        })
      }
    }
  }, 1000)
}

const main = () => {
  beginTimer()
}

main()


GM_addStyle(`
#chrome-extension-info-product{
    position: absolute;
    top: 0;
    bottom:0;
    right: 0;
    left: 0;
    height: 35px;
}

#chrome-extension-info {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    min-height: 60px;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px 0px;
    min-width: 150px;
}

#chrome-extension-info .extension-container {
    min-width: calc((100% - 84px)/ 2);
    display: inline-block;
    font-size: 12px;
    color: #333;
    font-family: 'Montserrat SemiBold';
    line-height: 13px;
    text-align: left;
    margin-left: 20px;
    padding-left: 8px;
    position: relative;
    margin-bottom: 5px;
}

#chrome-extension-info .extension-container::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0px;
    width: 10px;
    height: 10px;
    border: 1px solid #FFFFFF;
    background: #F2CE99;
    border-radius: 10px;
    line-height: 13px;
}

#chrome-extension-info .extension-container:nth-child(2n+1)::before {
    background: #F2CE99;
    border: 1px solid #FFFFFF;
}

#chrome-extension-info .extension-container:nth-child(2n)::before {
    background: #93D1F5;
    border: 1px solid #FFFFFF;
}

#chrome-extension-info-product .extension-container{
    position: absolute;
    left: 0;
    width: 100%;
    height: 15px;
    text-align: center;
}

#chrome-extension-info-product .extension-container:nth-child(1){
    bottom:-15px;
    color: red;
}

#chrome-extension-info-product .extension-container:nth-child(2){
    top:-15px;
    color: blue;
}
`)