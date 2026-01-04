// ==UserScript==
// @name        自动保存到notion
// @namespace   auto_save_to_notion
// @match       *://*/*
// @version     1.1
// @author      Gorvey
// @description 2024/12/29 14:44:23
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_setValues
// @grant       GM_getValue
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/522285/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0notion.user.js
// @updateURL https://update.greasyfork.org/scripts/522285/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0notion.meta.js
// ==/UserScript==
//--------------------设置------------------- S//
GM_registerMenuCommand("databaseID设置", function () {
  handledatabaseIDSetting()
}, {
  autoClose: true
});
GM_registerMenuCommand("设置计时器", function () {
  handletimeSetting()
}, {
  autoClose: true
});
const handledatabaseIDSetting = async () => {
  let databaseID = await new Promise(resolve => {
    resolve(window.prompt('填写databaseID'))
  })
  GM_setValues({
    databaseID: databaseID,
  })

  let secret = await new Promise(resolve => {
    resolve(window.prompt('填写secret'))
  })
  GM_setValues({
    secret: secret,
  })
}
const handletimeSetting = async () => {
  let time = await new Promise(resolve => {
    resolve(window.prompt('填写计时器，单位是秒，默认2分钟'))
  })
  GM_setValues({
    time: time,
  })
}
//--------------------设置------------------- E//
// time: 计时器,大于xx秒自动保存,单位是秒,默认2分钟
const CONFIG = {
  time: 60 * 2,
  databaseID: '',
  secret: '',
}
CONFIG.time = GM_getValue('time', CONFIG.time)
CONFIG.databaseID = GM_getValue('databaseID', CONFIG.databaseID)
CONFIG.secret = GM_getValue('secret', CONFIG.secret)

let nowTime = new Date().getTime()
let lastSaveTime = nowTime
let lastUrl = location.href

// 添加URL变化监听函数
const watchUrlChange = () => {
  // 使用定时器检查URL变化
  setInterval(() => {
    const currentUrl = location.href
    if (currentUrl !== lastUrl) {
      clearInterval(timer) // 清除旧的定时器
      lastUrl = currentUrl
      lastSaveTime = new Date().getTime() // 重置保存时间
      startTimer() // 重新启动定时器
      console.log('URL changed, timer reset')
    }
  }, 1000)

  // 监听 URL 变化
  window.addEventListener('urlchange', (info) => {
    clearInterval(timer) // 清除旧的定时器
    lastSaveTime = new Date().getTime()
    lastUrl = location.href
    startTimer() // 重新启动定时器
    console.log('URL changed, timer reset')
  })
}

// 启动定时器的函数
const startTimer = () => {
  timer = setInterval(() => {
    const currentTime = new Date().getTime()
    if ((currentTime - lastSaveTime) / 1000 >= CONFIG.time) {
      save()
      lastSaveTime = currentTime
    }
  }, 2000)
}

// 启动初始定时器
startTimer()

// 启动URL变化监听
watchUrlChange()

const save = async () => {
  clearInterval(timer)
  if (!CONFIG.databaseID || !CONFIG.secret) {
    GM_notification({
      text: '请先设置databaseID和secret',
      title: '请先设置databaseID和secret',
      timeout: 3000,
    })
    return
  }
  let ignoreHost = ['localhost', '127.0.0.1', 'seevin.com']
  let host = location.host
  if (host.includes(':')) {
    return
  }
  if (host.includes(ignoreHost)) {
    return
  }
  let { results } = await queryPageIsInTodayNotion()
  if (results.length <= 0) {
    await saveToNotion()
    // GM_notification({
    //   text: '保存到notion成功',
    //   title: '保存到notion成功',
    //   timeout: 3000,
    // })
  } else {
    console.log('已存在')
  }
}

/**
 * 获取页面信息
 * @returns {Object} 返回页面标题、URL和图标信息
 * @returns {string} returns.title - 页面标题
 * @returns {string} returns.url - 页面URL
 * @returns {string} returns.icon - 页面图标URL
 */
const getPageInfo = () => {
  const title = document.querySelector('title').innerText
  const url = location.href
  const shortUrl = location.host
  const date = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')
  let icon = ''
  const iconRefsList = ['apple-touch-icon', 'og:image', 'shortcut icon', 'icon',]
  iconRefsList.forEach(ref => {
    if (icon) return
    const element = document.querySelector(`link[rel="${ref}"]`)
    if (element) {
      const href = element.getAttribute('href')
      if (href.startsWith('http')) {
        icon = href
      } else {
        icon = location.origin + href
      }
      return
    }
  })

  return {
    title,
    url,
    shortUrl,
    icon,
    date
  }
}
/**
 * 保存页面信息到Notion
 * @returns {Promise<Object|undefined>} 返回Notion API的响应数据,保存失败时返回undefined
 * @description 将当前页面的标题、URL和图标信息保存到Notion数据库中。使用GM_xmlhttpRequest发送POST请求到Notion API。
 * 需要配置CONFIG.secret(Notion API密钥)和CONFIG.databaseID(目标数据库ID)。
 */

const saveToNotion = async () => {
  const pageInfo = getPageInfo()
  const URL = 'https://api.notion.com/v1/pages'
  const headers = {
    'Authorization': `Bearer ${CONFIG.secret}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  }
  const data = {
    'parent': { 'database_id': CONFIG.databaseID },
    'properties': {
      '名称': {
        title: [
          {
            text: {
              content: pageInfo.title,
            },
          },
        ],
      },
      URL: {
        url: pageInfo.url,
      },
    },
    icon: {
      external: {
        url: pageInfo.icon
      }
    },
  }
  GM_xmlhttpRequest({
    url: URL,
    method: 'POST',
    headers: headers,
    data: JSON.stringify(data),
    timeout: 100000,
    onload: (res) => {
      if (res.status == 200) {
        return JSON.parse(res.responseText)
      }
    }
  })
}

const queryPageIsInTodayNotion = async () => {
  const { url } = getPageInfo()
  const URL = `https://api.notion.com/v1/databases/${CONFIG.databaseID}/query`
  const headers = {
    'Authorization': `Bearer ${CONFIG.secret}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  }
  const data = {
    filter: {
      "and": [
        // {
        //   "property": "日期",
        //   "rich_text": {
        //     "equals": date
        //   }
        // },
        {
          "property": "URL",
          "rich_text": {
            "equals": url
          }
        }
      ]
    }
  }
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: URL,
      method: 'POST',
      headers: headers,
      data: JSON.stringify(data),
      timeout: 100000,
      onload: (res) => {
        resolve(JSON.parse(res.responseText))
      },
      onerror: (res) => {
        reject(res)
      }
    })
  })
}
