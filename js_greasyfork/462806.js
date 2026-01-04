// ==UserScript==
// @name         CSGO开箱历史统计
// @namespace    csgo_openBoxHistory
// @version      0.1.7
// @description  CSGO开箱历统计，清算数量和出金次数。
// @author       lock
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462806/CSGO%E5%BC%80%E7%AE%B1%E5%8E%86%E5%8F%B2%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/462806/CSGO%E5%BC%80%E7%AE%B1%E5%8E%86%E5%8F%B2%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

const LOG_PREFIX = '[CSGO开箱历史统计]'

const IMSORR = `
<p>尊敬的!#{userName}：</p>
<p style="padding-left: 2em;">我们非常抱歉听到您在开箱子时没有获得您期望的物品。我们理解这可能会令您感到失望。</p>
<p style="padding-left: 2em;">请注意，CSGO的箱子开启是基于随机概率的，每个物品都有一定的概率被获得。我们无法保证每个玩家都能获得他们想要的物品。</p>
<p style="padding-left: 2em;">我们希望您能理解这一点，并继续享受游戏的乐趣和挑战。为了表示感谢您对CSGO的支持，我们决定赠送您一份特别的礼物，一个包含了一些稀有物品的神秘箱子。</p>
<p style="padding-left: 2em;">您可以在游戏内找到它，并用您的钥匙打开它。我们希望您能喜欢这份礼物，并祝您好运！</p>
<p style="padding-left: 2em;">我们感谢您对CSGO的支持，并希望您能继续享受游戏。</p>
<p style="text-align: right;">此致， CSGO团队</p>
`

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 定时请求
const RAF = {
  intervalTimer: null,
  timeoutTimer: null,

  setTimeout(cb, interval) {
    // 实现setTimeout功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout() {
    cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval(cb, interval) {
    // 实现setInterval功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.intervalTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval() {
    cancelAnimationFrame(this.intervalTimer)
  }
}

const LOAD_INVENTORY_HISTORY = {
  currentPage: 0, // 当前请求页
  lastLoadTime: new Date().getTime(), // 最后请求时间
  checkPageLoadTimer: null,

  /**
   * @description: 页面加载超时检测
   * @return {boolean}
   */
  checkPageLoad() {
    return new Date().getTime() - LOAD_INVENTORY_HISTORY.lastLoadTime > 60 * 1000 ? true : false
  },

  /**
   * @description: 加载全部库存变更历史
   * @param {Number} page
   * @return {*}
   */
  async inventoryHistory_LoadAll(page) {
    $J('#load_more_button').hide()
    if (LOAD_INVENTORY_HISTORY.checkPageLoadTimer == null)
      LOAD_INVENTORY_HISTORY.checkPageLoadTimer = RAF.setInterval(LOAD_INVENTORY_HISTORY.checkPageLoad, 5000)
    if (unsafeWindow.g_historyCursor == null) return

    var request_data = {
      ajax: 1,
      cursor: unsafeWindow.g_historyCursor,
      sessionid: unsafeWindow.g_sessionID
    }

    if (unsafeWindow.g_rgFilterApps && unsafeWindow.g_rgFilterApps.length > 0) {
      request_data.app = unsafeWindow.g_rgFilterApps
    }

    var prevCursor = unsafeWindow.g_historyCursor
    unsafeWindow.g_historyCursor = null

    $J('#inventory_history_loading').show()
    await sleep(1000)
    $J.ajax({
      type: 'GET',
      url: unsafeWindow.g_strProfileURL + '/inventoryhistory/',
      data: request_data,
      timeout: 6000
    })
      .done(function (data) {
        if (data.success) {
          for (var appid in data.apps) {
            unsafeWindow.g_rgAppContextData[appid] = data.apps[appid]
          }

          $J('#inventory_history_count').text(parseInt($J('#inventory_history_count').text()) + data.num)

          if (data.html) {
            var elem_prev = $J('#inventory_history_table').children().last()

            $J('#inventory_history_table').append(data.html)

            var new_elems = elem_prev.nextAll()
            new_elems.hide()
            new_elems.fadeIn(500)

            InventoryHistory_BindTooltips(new_elems, data.descriptions)
          }
          LOAD_INVENTORY_HISTORY.currentPage++
          LOAD_INVENTORY_HISTORY.lastLoadTime = new Date().getTime()
          if (data.cursor) {
            unsafeWindow.g_historyCursor = data.cursor
            $J('#load_more_button').fadeIn(50)
            $J('#check_inventory_history_box').text(`正在清点(${page}页) | `)
            LOAD_INVENTORY_HISTORY.inventoryHistory_LoadAll(LOAD_INVENTORY_HISTORY.currentPage)
          } else {
            $J('#load_more_button').hide()
            RAF.clearInterval(LOAD_INVENTORY_HISTORY.checkPageLoadTimer)
            LOAD_INVENTORY_HISTORY.handleInventoryHistory()
          }
        } else {
          unsafeWindow.g_historyCursor = prevCursor
          $J('#load_more_button').fadeIn(50)
          LOAD_INVENTORY_HISTORY.inventoryHistory_LoadAll(LOAD_INVENTORY_HISTORY.currentPage)
          if (data.error) {
            ShowAlertDialog('错误', data.error, '确定')
          }
        }
      })
      .fail(function (jqXHR, textStatus) {
        unsafeWindow.g_historyCursor = prevCursor
        $J('#load_more_button').fadeIn(50)
        if (textStatus === 'timeout') {
          LOAD_INVENTORY_HISTORY.inventoryHistory_LoadAll(page)
          return
        }
        if (jqXHR.status == 429) {
          console.log(`${LOG_PREFIX}请求页(${page})速率限制，正在重试。原因：您最近作出的请求太多了。请稍候再重试您的请求。`)
          LOAD_INVENTORY_HISTORY.inventoryHistory_LoadAll(page)
        } else {
          ShowAlertDialog('错误', '遍历已停止，服务器返回错误状态，稍后再试。<br>原因：载入您的库存历史记录时出现问题。', '确定')
          RAF.clearInterval(LOAD_INVENTORY_HISTORY.checkPageLoadTimer)
        }
      })
      .always(function () {
        $J('#inventory_history_loading').hide()
      })
  },

  /**
   * @description: 获取开箱统计
   * @return {*}
   */
  boxCount() {
    let results = {
      boxNumber: 0,
      goldNumber: 0,
      capsuleNumber: 0
    }
    $J('.tradehistory_content').each(function () {
      if ($J(this).children('.tradehistory_event_description').text().indexOf('已开启武器箱') == -1) {
        return
      }
      let nodeBoxItem = $J(this).find('.tradehistory_items.tradehistory_items_withimages')
      let openItemName = nodeBoxItem.eq(0).find('.tradehistory_items_group span.history_item_name').eq(0).text()
      let getItemName = nodeBoxItem.eq(1).find('.tradehistory_items_group a span.history_item_name').eq(0).text()

      if (openItemName.indexOf('印花') != -1) {
        results.capsuleNumber++
        return
      }

      if (getItemName.indexOf('★') != -1) {
        results.goldNumber++
      }

      results.boxNumber++
    })
    return results
  },

  /**
   * @description: 处理历史库存变更记录
   * @return {*}
   */
  handleInventoryHistory() {
    const boxStat = LOAD_INVENTORY_HISTORY.boxCount()
    const tips = `已开${boxStat.boxNumber}箱、${boxStat.capsuleNumber}胶囊，箱子出金${boxStat.goldNumber}次`
    $J('#check_inventory_history_box').text(`清点完成(${tips}) | `)
    // 0金非洲人
    if (boxStat.goldNumber == 0) {
      const careMail = IMSORR.replaceAll('!#{userName}', UI.userName)
      ShowAlertDialog('提示', careMail, '确定')
    }
    // 特殊用户
    if (UI.isUserHu() && boxStat.goldNumber == 1) {
      const careMail = IMSORR.replaceAll('!#{userName}', UI.userName)
      ShowAlertDialog('提示', careMail, '确定')
    }
    ShowAlertDialog('清点完成', tips, '确定')
  },

  /**
   * @description: 开始清点历史库存变更
   * @return {*}
   */
  startInventoryHistory() {
    ShowAlertDialog('提示', `正在清点，需要几分钟不等，请稍等...`, '确定')
    LOAD_INVENTORY_HISTORY.inventoryHistory_LoadAll(0)
  }
}

// 与页面交互的逻辑
const UI = {
  userProfilesUrl: null,
  userName: null,
  inventoryHistoryUrl: null,

  initialization() {
    UI.userProfilesUrl = $J('.profile_small_header_name a').attr('href')
    UI.inventoryHistoryUrl = UI.userProfilesUrl + '/inventoryhistory/?app%5B%5D=730&checkBox=1'
    UI.userName = $J('.profile_small_header_name a').text().trim()
  },

  insertCheckButton() {
    return new Promise((resolve, reject) => {
      const steamMenu = $J('.inventory_rightnav')
      if (!steamMenu) {
        console.error(`${LOG_PREFIX} 找不到插入按钮元素`)
        throw new Error(`${LOG_PREFIX} 找不到插入按钮元素 .inventory_rightnav`)
      }
      steamMenu.prepend(
        `<a id="check_inventory_history_box_button" href="${UI.inventoryHistoryUrl}" class="btn_darkblue_white_innerfade btn_medium_wide reload_inventory" style="margin-right:12px"><span>CSGO开箱统计</span></a>`
      )
    })
  },

  insertCheckInfo() {
    return new Promise((resolve, reject) => {
      const steamMenu = $J('.inventory_history_nextbtn')
      if (!steamMenu) {
        console.error(`${LOG_PREFIX} 找不到插入按钮元素`)
        throw new Error(`${LOG_PREFIX} 找不到插入按钮元素 .inventory_history_nextbtn`)
      }
      steamMenu.prepend(`<a id="check_inventory_history_box" href="${UI.inventoryHistoryUrl}'">清点开箱 | </a>`)
    })
  },
  // 库存页面
  isInventory() {
    return window.location.href.includes('/inventory/')
  },
  // 历史库存页面
  isInventoryHistory() {
    return window.location.href.includes('/inventoryhistory/')
  },

  isCheckBox() {
    return window.location.href.includes('&checkBox=1')
  },

  isUserHu() {
    const isUserID = window.location.href.includes('76561198401556084')
    const isUserName = $J('.profile_small_header_name a').text().indexOf('CN-qiezi') != -1
    return isUserID && isUserName
  },

  isStartCheckBox() {}
}

;(function () {
  // 库存页面
  if (UI.isInventory()) {
    UI.initialization()
    UI.insertCheckButton()
  }
  // 历史库存页面
  if (UI.isInventoryHistory()) {
    UI.initialization()
    UI.insertCheckInfo()
    if (UI.isCheckBox()) {
      LOAD_INVENTORY_HISTORY.startInventoryHistory()
    }
  }
})()
