// ==UserScript==
// @name         BUFF获取武器箱期望值
// @namespace    https://greasyfork.org/en/scripts/464315
// @homepage     https://greasyfork.org/en/scripts/464315
// @author       Lock
// @license      GPL
// @version      0.42
// @description  目前只支持胶囊
// @match        https://buff.163.com/*
// @match        https://dmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-y/dexie/4.0.0-alpha.1/dexie.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      buff.163.com
// @downloadURL https://update.greasyfork.org/scripts/464315/BUFF%E8%8E%B7%E5%8F%96%E6%AD%A6%E5%99%A8%E7%AE%B1%E6%9C%9F%E6%9C%9B%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/464315/BUFF%E8%8E%B7%E5%8F%96%E6%AD%A6%E5%99%A8%E7%AE%B1%E6%9C%9F%E6%9C%9B%E5%80%BC.meta.js
// ==/UserScript==

;(async function () {
  'use strict'

  //印花胶囊不同级别中奖概率
  const stickerCapsuleProbability = {
    level4: {
      rare: 0.80128,
      mythical: 0.16026,
      legendary: 0.03205,
      ancient: 0.00641
    },
    level3: {
      rare: 0.82782,
      mythical: 0.16556,
      legendary: 0.0662
    },
    level2: {
      rare: 0.96154,
      legendary: 0.03846
    }
  }

  /**
   *对Date的扩展，将 Date 转化为指定格式的String
   *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   *例子：
   *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
   */
  Date.prototype.format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
  }

  /**
   * @description: 获取URL参数值
   * @param {*} url
   * @param {*} param
   * @return {*}
   */
  const getParam = (url, param) => {
    return new URLSearchParams(new URL(url).search).get(param)
  }

  /**
   * @description: 获取当前URL参数值
   * @param {*} param
   * @return {*}
   */
  const getUrlParam = param => {
    return getParam(location.href, param)
  }

  /**
   * @description: 延迟
   * @param {*} ms
   * @return {*}
   */
  const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * @description: 获取页面HTML
   * @param {*} url
   * @param {*} formData
   * @param {*} retries
   * @return {*}
   */
  const getUrlHtml = async (url, formData = false, retries = 5) => {
    let fetchOption = {}
    if (formData) {
      fetchOption = {
        method: 'POST',
        body: formData
      }
    } else {
      fetchOption = { method: 'GET' }
    }
    try {
      const response = await fetch(url, fetchOption)
      if (!response.ok) {
        if (retries > 0) {
          sleep(500)
          return getUrlHtml(url, formData, retries - 1)
        }
        throw 'HTTP-Error: ' + response.status
      }
      const responseHtml = await response.text()
      return responseHtml
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * @description: 请求队列
   * @return {*}
   */
  class AsyncQueue {
    static create(name) {
      return new this(name)
    }

    constructor(name) {
      this.name = name
      // 任务队列
      this.queue = []
      // 是否有任务正常执行
      this.running = false
    }

    push(fun) {
      return new Promise((resovle, reject) => {
        // 将 fun 包装一层放进任务队列中
        this.queue.push(async () => {
          this.running = true
          try {
            const res = await fun()
            resovle(res)
          } catch (e) {
            reject(e)
          }

          this.running = false
          // 获取下一个任务并执行
          const next = this.queue.shift()
          next?.()
        })
        // 若当前未有任务执行中，则触发队列的执行
        if (!this.running) {
          this.queue.shift()?.()
        }
      })
    }
  }

  /**
   * @description: 初始化数据库
   * @return {*}
   */
  const initDB = () => {
    window.MKDB = new Dexie('buff')
    MKDB.version(1).stores({
      buff: '++id, hash_name, &timestamp'
    })
    MKDB.open().catch(function (e) {
      console.error('Open failed: ' + e.stack)
    })
    return MKDB
  }

  /**
   * @description: 将BUFF数据保存到数据库
   * @param {*} buffInfo
   * @return {*}
   */
  const addBuffGoodsInfo = data => {
    // 保存数据
    return MKDB.transaction('rw', MKDB.buff, async () => {
      await MKDB.buff.add(data)
    })
  }

  /**
   * @description: 缓存
   * @return {*}
   */
  const LCACHE = {
    async set(key, value) {
      const buffInfo = { hash_name: key, timestamp: Date.now(), info: value }
      return MKDB.transaction('rw', MKDB.buff, async () => {
        await MKDB.buff.put(buffInfo)
      })
    },
    async get(key, expire) {
      // const result = await MKDB.buff.get({ hash_name: key })
      const result = await MKDB.buff.where({ hash_name: key }).desc().first()
      if (result && Date.now() - result.timestamp < expire * 1000) {
        return result.info
      }
      return null
    },
    async remove(key) {
      return MKDB.transaction('rw', MKDB.buff, async () => {
        return MKDB.buff.where({ hash_name: key }).delete()
      })
    },
    clear() {
      // localStorage.clear()
    }
  }

  /**
   * @description: 缓存 旧方法
   * @return {*}
   */
  const LCACHE_BK = {
    set(key, value, expire) {
      const data = {
        value,
        expire: expire ? new Date().getTime() + expire * 1000 : null
      }
      localStorage.setItem(key, JSON.stringify(data))
    },
    get(key) {
      const data = JSON.parse(localStorage.getItem(key))
      if (data && (!data.expire || data.expire > new Date().getTime())) {
        return data.value
      }
      return null
    },
    remove(key) {
      localStorage.removeItem(key)
    },
    clear() {
      localStorage.clear()
    }
  }

  /**
   * @description: 查找元素父级
   * @param {*} el
   * @param {*} parentSelector
   * @return {*}
   */
  const getParents = (el, parentSelector /* optional */) => {
    // console.log(el);
    // If no parentSelector defined will bubble up all the way to *document*
    if (parentSelector === undefined) {
      parentSelector = document
    }
    var p = el.parentNode
    while (p !== parentSelector) {
      var o = p
      p = o.parentNode
    }
    return parentSelector
  }

  /**
   * @description: 判断印花胶囊级别
   * @param {*} rarityNumber
   * @return {*}
   */
  const getStickerCapsuleLevel = rarityNumber => {
    let level = 0
    for (const key in rarityNumber) {
      if (rarityNumber.hasOwnProperty.call(rarityNumber, key)) {
        level = rarityNumber[key] > 0 ? level + 1 : level
      }
    }
    return level
  }

  /**
   * @description: 获取武器箱类型
   * @param {*} items
   * @return {*}
   */
  const getWeaponcaseType = items => {
    if (items[0].goods.tags.category_group.internal_name == 'sticker') {
      return 'sticker'
    }
    return 'other'
  }

  /**
   * @description: 通过物品ID获取物品信息
   * @param {*} goodID
   * @return {*}
   */
  const getGoodsContainers = async goodID => {
    const response = await fetch(`https://buff.163.com/api/market/csgo_goods_containers?goods_id=${goodID}&_=`)
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }
    return response.json()
  }

  /**
   * @description: 通过物品名获取详细信息
   * @param {*} goodsName
   * @return {*}
   */
  const getGoodsContainer = async goodsName => {
    const response = await fetch(
      `https://buff.163.com/api/market/csgo_container?container=${goodsName}&is_container=1&container_type=weaponcase&_=1681821226170`
    )
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }
    return response.json()
  }

  /**
   * @description: 获取武器箱内物品稀有度数量
   * @param {*} items
   * @return {*}
   */
  const countWeaponcaseRarity = items => {
    let rarityCount = { ancient: 0, legendary: 0, mythical: 0, rare: 0 }
    items.forEach(element => {
      switch (element.goods.tags.rarity.internal_name) {
        case 'ancient':
          rarityCount.ancient++
          break
        case 'legendary':
          rarityCount.legendary++
          break
        case 'mythical':
          rarityCount.mythical++
          break
        case 'rare':
          rarityCount.rare++
          break
      }
    })
    return rarityCount
  }

  /**
   * @description: 计算武器箱期望值
   * @param {*} goodID
   * @return {*}
   */
  const calculateGoodsExpectation = async goodID => {
    const goodsContainers = await getGoodsContainers(goodID) // buff 武器物品ID
    const goodsName = await goodsContainers.data.containers[0].container // 武器箱名字
    // const goodSprice = await goodsContainers.data.containers[0].sell_min_price // 武器箱价格 BUFF价格数据没了
    const goodSpriceNode = $('.detail-summ strong.f_Strong').text()
    const goodSprice = goodSpriceNode.match(/¥ (\d+\.\d+)/)[1] * 0.65
    const goodsContainer = await getGoodsContainer(goodsName) // 武器箱内物品详情
    if (!goodSprice > 0 || getWeaponcaseType(goodsContainer.data.items) !== 'sticker') {
      // 只支持印花胶囊
      return false
    }
    const rarityNumber = countWeaponcaseRarity(goodsContainer.data.items) // 武器箱内物品等级数量
    const weaponcaseLevel = getStickerCapsuleLevel(rarityNumber) // 武器箱级别
    let goodsValue = 0
    goodsContainer.data.items.forEach(element => {
      const rarity = element.goods.tags.rarity.internal_name // 物品级别
      const price = element.min_price // 物品价格
      const probability = stickerCapsuleProbability[`level${weaponcaseLevel}`][rarity] // 稀有度出货概率
      goodsValue = goodsValue + price * probability * (1 / rarityNumber[rarity])
    })
    const countExpectation = (goodsValue / goodSprice).toFixed(2)
    return countExpectation
  }

  /**
   * @description: 添加物品英文名显示
   * @param {*} goodID
   * @return {*}
   */
  const showGoodsName = () => {
    const goodsInfoNode = document.createElement('div')
    goodsInfoNode.innerHTML = document.querySelector('#buying_list_pat').innerHTML
    const goodsName = goodsInfoNode.querySelector('.t_Left a[data-goods-market-hash-name]').getAttribute('data-goods-market-hash-name')
    //创建一个新的元素
    let enNameNode = document.createElement('p')
    enNameNode.style.padding = '0.5em 0 0 0'
    enNameNode.innerText = goodsName
    //插入节点之前，要获得节点的引用
    let sp2 = document.querySelector('.detail-cont>div')
    //获得父节点的引用
    let parentDiv = sp2.parentNode

    //在 DOM 中在 sp2 之前插入一个新元素
    parentDiv.insertBefore(enNameNode, sp2.nextSibling)
  }

  /**
   * @description: 计算库存价格变化
   * @param {*} goodID
   * @return {*}
   */
  const calculateInventoryPriceChange = () => {
    // 计算价格变化百分比
    const calculatePercentageChange = (oldValue, newValue) => {
      const percentageChange = ((newValue - oldValue) / oldValue) * 100
      return percentageChange
    }

    let goodsListNode = document.querySelectorAll('.market-card .list_card ul li')
    let totalPriceNode = document.querySelector('.l_Right.export-btns.brief-info>span')
    let totalBuyPrice = 0
    let totalNowPrice = 0

    goodsListNode.forEach(item => {
      const buyPriceNode = item.querySelector('.shalow-btn.shalow-btn_long.asset-remark-edit')
      const nowPriceNode = item.querySelector('p>strong.f_Strong')
      if (buyPriceNode) {
        const buyPriceText = buyPriceNode.innerText.replace(/[^0-9.-]+/g, '')
        const buyPrice = parseFloat(buyPriceText)
        if (!isNaN(buyPrice)) {
          totalBuyPrice += buyPrice
          if (nowPriceNode) {
            const nowPriceText = nowPriceNode.innerText.replace(/[^0-9.-]+/g, '')
            const nowPrice = parseFloat(nowPriceText)
            if (!isNaN(nowPrice)) {
              totalNowPrice += nowPrice
              nowPriceNode.innerHTML += ` ${
                nowPrice - buyPrice > 0
                  ? '<span style="color: red; font-size: smaller;">(↑'
                  : '<span style="color: green; font-size: smaller;">(↓'
              }${calculatePercentageChange(buyPrice, nowPrice).toFixed(2)}% ${(nowPrice - buyPrice).toFixed(0)})</span>`
            }
          }
        }
      }
    })

    totalPriceNode.innerHTML += ` 总买入：<strong class="c_Yellow f_Normal">¥ ${totalBuyPrice.toFixed(0)}</strong> 涨幅：${
      totalNowPrice - totalBuyPrice > 0 ? '<strong style="color: red;">↑' : '<strong style="color: green;">↓'
    }${calculatePercentageChange(totalBuyPrice, totalNowPrice).toFixed(2)}% ${(totalNowPrice - totalBuyPrice).toFixed(0)})</strong>`
  }

  /**
   * @description: 等待元素出现
   * @param {*} selector 选择器
   * @param {*} callback 回调函数
   * @param {*} maxWaitTime 最大等待时间(毫秒)
   * @return {*}
   */
  const waitForElement = (selector, callback, maxWaitTime = 10000) => {
    // 首先检查元素是否已经存在
    const element = document.querySelector(selector)
    if (element) {
      callback(element)
      return
    }

    // 设置最大等待时间
    const timeout = setTimeout(() => {
      if (observer) {
        observer.disconnect()
        console.log(`等待元素 ${selector} 超时`)
      }
    }, maxWaitTime)

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector)
      if (element) {
        clearTimeout(timeout)
        obs.disconnect()
        callback(element)
      }
    })

    // 开始观察文档主体的子树变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  /**
   * @description: 根据商品名称获取csqaq网站的商品URL
   * @param {string} goodsName 商品名称
   * @return {Promise<string|null>} 返回商品URL或null（如果未找到）
   */
  const getCsqaqGoodsUrl = goodsName => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: `https://www.csqaq.com/proxies/api/v1/search/suggest?text=${encodeURIComponent(goodsName)}`,
        headers: {
          accept: '*/*'
        },
        method: 'GET',
        responseType: 'json',
        timeout: 10000,
        onload: function (res) {
          if (res.status === 200 && res.response) {
            const data = res.response
            if (data.code === 200 && data.data && data.data.length > 0) {
              // 提取第一个结果的ID
              const goodsId = data.data[0].id
              const goodsUrl = `https://www.csqaq.com/goods/${goodsId}`
              resolve(goodsUrl)
            } else {
              // 如果没有找到商品
              resolve(null)
            }
          } else {
            console.error(`获取CSQAQ商品URL失败: ${res.statusText}`)
            reject(new Error(`请求失败: ${res.status} ${res.statusText}`))
          }
        },
        onerror: function (error) {
          console.error('获取CSQAQ商品URL错误:', error)
          reject(error)
        },
        ontimeout: function () {
          console.error('获取CSQAQ商品URL超时')
          reject(new Error('请求超时'))
        }
      })
    })
  }

  const DMARKET = {
    ajaxTimeout: 30000,

    /**
     * @description: 获取商品中文名
     * @param {*} marketHashName
     * @return {*}
     */
    getGoodsBuffName(marketHashName) {
      return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          url: 'https://steamcommunity.com/market/listings/730/' + marketHashName,
          timeout: DMARKET.ajaxTimeout,
          method: 'get',
          onload: function (res) {
            if (res.status == 200) {
              const steamPageHtml = res.responseText // 页面很大
              try {
                const steamPageNode = new DOMParser().parseFromString(steamPageHtml, 'text/html')
                var buffName = steamPageNode.querySelector('.market_listing_nav a:nth-child(2)').innerText
              } catch (error) {
                steamConnection = true
                GM_setValue(buff_item_id, null)
                res.status = 404
                res.statusText = '物品不在货架上'
                console.log('获取itemID状态异常：', res)
                reject(res)
                return
              }
              resolve(buffName)
            } else {
              console.log('获取itemID状态异常：', res)
              reject(res)
            }
          },
          onerror: function (err) {
            console.log('获取itemID错误：', err)
            reject(err)
          },
          ontimeout: function () {
            failedSteamConnection()
            let err = { status: 408, statusText: '连接steam超时，请检查steam市场连接性' }
            console.log('获取itemID超时：', err)
            reject(err)
          }
        })
      })
    },

    /**
     * @description: 获取商品Buff信息
     * @param {*} marketHashName
     * @return {*}
     */
    getBuffInfo(marketHashName, reCount = 0) {
      const reMax = 10 // 最大重试次数
      const buffLink = `https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=${marketHashName}&use_suggestion=0`
      return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
          url: buffLink,
          headers: {
            Referer: 'ttps://buff.163.com'
          },
          timeout: DMARKET.ajaxTimeout,
          method: 'get',
          responseType: 'json',
          onload: function (res) {
            const reqData = res.response
            if (res.status !== 200 || reqData.code !== 'OK') {
              console.log('获取Buff信息异常：', res)
              if (reCount > reMax) {
                console.log('获取Buff信息异常,已达到最大重试次数.')
                reject(res)
              } else {
                resolve(DMARKET.getBuffInfo(marketHashName, reCount + 1))
              }
            } else {
              if (reqData?.data?.items?.[0]) {
                var buffData = null
                if (reqData.data.items.length > 1) {
                  reqData.data.items.forEach(element => {
                    if (element.market_hash_name == marketHashName) {
                      buffData = element
                    }
                  })
                }
                buffData = buffData ? buffData : reqData.data.items[0]
                resolve(buffData)
              } else {
                resolve(false)
              }
            }
          },
          onerror: function (err) {
            console.log('获取Buff信息错误：', err)
            reject(err)
          },
          ontimeout: function () {
            console.log('获取Buff信息超时：', err)
            reject(err)
          }
        })
      })
    }
  }

  // 页面判断
  const ROUTE = {
    // dnarket 网站
    isDmarket() {
      return window.location.host === 'dmarket.com'
    },

    // 商品列表页
    isDmarketSkinsList() {
      if (ROUTE.isDmarket() && window.location.pathname.indexOf('/csgo-skins') > -1 && getUrlParam('exchangeTab') !== 'myItems') {
        return true
      }
      return false
    },

    // BUFF
    isBuff() {
      return window.location.host === 'buff.163.com'
    },

    // BUFF 商品页
    isBuffGoodsPage() {
      if (ROUTE.isBuff() && window.location.pathname.indexOf('goods/') > -1) {
        return true
      }
      return false
    },

    // BUFF 首页
    isBuffIndex() {
      if (ROUTE.isBuff() && window.location.pathname === '/') {
        return true
      }
      return false
    },

    //BUFF 我的库存
    isBuffInventory() {
      if (ROUTE.isBuff() && window.location.pathname.indexOf('/steam_inventory') > -1) {
        return true
      }
      return false
    }
  }

  /**
   * @description: 防抖函数
   * @param {*} func
   * @param {*} delay
   * @return {*}
   */
  const debounce = function (func, delay = 300) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  // 查询 BUFF 商品售价是否正常
  const chenkGoodsPriceStat = data => {
    const restul = data.buy_max_price / data.sell_min_price > 0.8 && data.buy_num > 10
    return restul
  }

  // 处理商品卡片信息
  const handlerCard = async element => {
    // 元素未加载
    if (!element.querySelector('asset-card-price price')) {
      return
    }
    // 是否已存在数据
    if (element.querySelector('asset-card-price .c-asset__priceNumber .buff-price')) {
      return
    }
    // 获取BUff数据并写入
    const marketHashName = element.querySelector('.u-game img').alt // 物品名
    const dmPriceNode = element.querySelector('asset-card-price price')
    let dmPrice = ''
    for (const item of dmPriceNode.innerText.matchAll(/([0-9\.]+)/g)) {
      dmPrice += item[0]
    }
    dmPrice = Number(dmPrice) // dm价格
    if (dmPrice < 100) {
      return
    }

    // 是否已存在缓存
    const buffCache = await LCACHE.get(marketHashName, buffCacheExpire)
    let buffInfo = null
    if (buffCache) {
      buffInfo = buffCache
    } else {
      console.log(`查询 ${marketHashName}`, new Date())
      await sleep(1000)
      buffInfo = await DMARKET.getBuffInfo(marketHashName) // buff 数据
      buffInfo = buffInfo ? buffInfo : 'empty'
      await LCACHE.set(marketHashName, buffInfo) // 写入缓存
    }
    if (buffInfo === 'empty') {
      return
    }
    const buffPriceNode = document.createElement('price')
    buffPriceNode.className = 'buff-price'
    buffPriceNode.style.display = 'block'
    buffPriceNode.innerText = `~${buffInfo.quick_price} ￥`
    const goodsPriceStat = chenkGoodsPriceStat(buffInfo)
    switch (true) {
      case dmPrice < buffInfo.quick_price * 0.9:
        buffPriceNode.style.color = '#FFEB3B'
        if (goodsPriceStat) {
          element.style.border = '2px solid #FFEB3B'
        }
        break

      case dmPrice < buffInfo.quick_price:
        buffPriceNode.style.color = '#f44856'
        if (goodsPriceStat) {
          element.style.border = '2px solid #f44856'
        }
        break

      case dmPrice < buffInfo.quick_price * 1.05:
        buffPriceNode.style.color = '#af7fff'
        if (goodsPriceStat) {
          element.style.border = '2px solid #af7fff'
        }
        break

      case dmPrice < buffInfo.quick_price * 1.1:
        buffPriceNode.style.color = '#4daef8'
        if (goodsPriceStat) {
          element.style.border = '2px solid #4daef8'
        }
        break

      default:
        buffPriceNode.style.color = '#8dd294'
        break
    }
    // 添加到页面
    element.querySelector('asset-card-price .c-asset__priceNumber').append(buffPriceNode)
    const buffLinkTemplate = `<a target="_blank" class="buff c-asset__action c-asset__action--info ng-star-inserted" href="https://buff.163.com/goods/${buffInfo.id}"><i class="c-asset__actionIcon"><svg><symbol id="icon-info" viewBox="0 0 24 24" fill="currentColor"><path xmlns="http://www.w3.org/2000/svg" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></symbol><use xlink:href="#icon-exchange" style="color: #05e4ff;"></use></svg></i></a>`
    element.querySelector('asset-location-badge').innerHTML = buffLinkTemplate
  }

  // 遍历卡片
  const loadCard = async () => {
    try {
      if (!ROUTE.isDmarketSkinsList()) {
        await sleep(3000)
        await loadCard()
        return
      }
      const targets = document.querySelectorAll('.c-exchange__inventory .c-assets__container asset-card asset-card-price')
      for (const target of targets) {
        const cardNode = target.parentNode.parentNode.parentNode.parentNode.parentNode
        // cardNode.style.background = '#9E9E9E'
        await handlerCard(cardNode)
      }
      await sleep(3000)
      await loadCard()
    } catch (error) {
      if (error.message.indexOf('Cannot read properties of null') !== -1) {
        await sleep(1000)
        await loadCard()
      }
      console.error(error)
    }
  }

  // BUFF添加复制商品检视代码按钮
  const buffGoodsCheckCode = () => {
    const itemsZhHans = {
      glove: {
        brokenfang_gloves: 4725,
        bloodhound_gloves: 5027,
        sport_gloves: 5030,
        driver_gloves: 5031,
        hand_wraps: 5032,
        moto_gloves: 5033,
        specialist_gloves: 5034,
        hydra_gloves: 5035
      }
    }
    const topNode = document.querySelector('.detail-tab-cont')
    const targets = topNode.querySelectorAll('table.list_tb tbody.list_tb_csgo tr.selling')
    for (const target of targets) {
      const goodsInfo = JSON.parse(target.dataset.goodsInfo)
      const assetInfo = JSON.parse(target.dataset.assetInfo)
      const internalName = goodsInfo.tags.category.internal_name.split('weapon_')[1]
      let checkCode = ''
      switch (goodsInfo.tags.category_group.internal_name) {
        case 'hands':
          checkCode = `sm_glove ${itemsZhHans.glove[internalName]} ${assetInfo.info.paintindex} ${assetInfo.paintwear} ${assetInfo.info.paintseed}`
          break
        case 'knife':
          checkCode = `sm_skin ${internalName} ${assetInfo.info.paintindex} ${assetInfo.paintwear} ${assetInfo.info.paintseed}`
          break
        default:
          checkCode = `sm_skin ${internalName} ${assetInfo.info.paintindex} ${assetInfo.paintwear} ${assetInfo.info.paintseed} 0 0 0 0 0 0 0 0 0 0`
          break
      }
      let checkLink = document.createElement('a')
      checkLink.dataset.checkCode = checkCode
      checkLink.classList = 'ctag btn_check_code'
      checkLink.innerText = '复制代码'
      //按钮绑定事件
      checkLink.addEventListener('click', event => {
        event.preventDefault()
        let checkCode = checkLink.dataset.checkCode

        // 使用 Clipboard API 复制内容到剪贴板
        navigator.clipboard
          .writeText(checkCode)
          .then(function () {
            checkLink.innerText = '已复制'
            setTimeout(() => {
              checkLink.innerText = '复制代码'
            }, 2000)
          })
          .catch(function (err) {
            checkLink.innerText = '复制失败'
            setTimeout(() => {
              checkLink.innerText = '复制代码'
            }, 2000)
          })
      })

      target.querySelector('td.t_Left .csgo_value').appendChild(checkLink)
    }
  }

  const getNewRecommend = async () => {
    const url = 'https://buff.163.com/'
    const responseHtml = await getUrlHtml(url)
    const buffRecommendElement = $.parseHTML(responseHtml)
    const compareNode = $(buffRecommendElement).find('tbody tr')
    fetch('https://buff.163.com/api/index/popular_sell_order?_=1710602728857')
  }

  //Buff 首页 刷一刷
  if (ROUTE.isBuffIndex()) {
    const refreshBtnHtml = `<a>换一批<i class="icon icon_refresh"></i></a>`
    document.querySelector('.sec-title .l_Right').insertAdjacentHTML('afterbegin', refreshBtnHtml)
  }

  // 网易商品页面
  if (ROUTE.isBuffGoodsPage()) {
    const goodsID = window.location.pathname.match('/goods/([0-9]+)')[1]

    // 添加csgoBO链接
    const goodsName = document.querySelector('.detail-cont h1').innerText
    const csgoOBNode = `<a href="https://cs2ob.cn/goods?name=${goodsName}" target="_blank">查看CS:OB</a>`
    document.querySelector('.detail-summ').innerHTML += csgoOBNode

    // 添加CSQAQ链接
    // getCsqaqGoodsUrl(goodsName).then(goodsUrl => {
    //   if (goodsUrl) {
    //     const csqaqNode = `<a href="${goodsUrl}" target="_blank">查看CSQAQ</a>`
    //     document.querySelector('.detail-summ').innerHTML += csqaqNode
    //   }
    // })

    // 添加显示物品英文名
    showGoodsName()

    // 计算期望值 目前只支持胶囊
    if (document.querySelector('.detail-cont>p>span:nth-child(3)').innerText.indexOf('武器箱') !== -1) {
      const weaponcaseExpectation = await calculateGoodsExpectation(goodsID)
      if (weaponcaseExpectation) {
        document.querySelector('.detail-cont>p>span:nth-child(3)').innerText += ` ${weaponcaseExpectation}`
      }
    }

    // 饰品检视代码
    const goodsListTargetNode = document.querySelector('.detail-tab-cont')
    // 创建一个回调函数，当DOM发生变化时执行
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const element = document.querySelector('.detail-tab-cont table.list_tb')
          if (element && mutation.target.className === 'detail-tab-cont') {
            //observer.disconnect() // 找到元素后停止观察
            buffGoodsCheckCode()
            break
          }
        }
      }
    }
    // 创建一个MutationObserver实例并传入回调函数
    const observer = new MutationObserver(callback)
    // 开始观察目标节点并使用配置的选项
    observer.observe(goodsListTargetNode, { childList: true, subtree: true })
  }

  // BUFF 我的库存页面
  if (ROUTE.isBuffInventory()) {
    // 等待元素出现后执行计算
    waitForElement(
      '.market-card .list_card ul li',
      () => {
        calculateInventoryPriceChange()
      },
      15000
    )
  }

  // DM商品列表页面
  if (ROUTE.isDmarket()) {
    window.buffCacheExpire = 24 * 3600 // Buff缓存过期时间
    initDB() // 初始化数据库
    loadCard()
  }
})()
