// ==UserScript==
// @name         98tang一键推送下载到115与115cookie登录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  根据98tang特定元素插入按钮并一键推送下载到115与115cookie登录，支持bot与web下载
// @author       yelc668
// @match        *://*.115.com/*
// @include      https://www.sehuatang.*
// @include      https://www.weterytrtrr.*
// @include      https://www.qweqwtret.*
// @include      https://www.retreytryuyt.*
// @include      https://www.qwerwrrt.*
// @include      https://www.5aylp.*
// @include      https://www.jq2t4.*
// @include      https://www.0krgb.*
// @include      https://www.1qyqs.*
// @include      https://www.ds5hk.*
// @include      https://sehuatang.*
// @include      https://weterytrtrr.*
// @include      https://qweqwtret.*
// @include      https://retreytryuyt.*
// @include      https://qwerwrrt.*
// @include      https://5aylp.*
// @include      https://jq2t4.*
// @include      https://1qyqs.*
// @include      https://ds5hk.*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_cookie
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488593/98tang%E4%B8%80%E9%94%AE%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD%E5%88%B0115%E4%B8%8E115cookie%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/488593/98tang%E4%B8%80%E9%94%AE%E6%8E%A8%E9%80%81%E4%B8%8B%E8%BD%BD%E5%88%B0115%E4%B8%8E115cookie%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

;(function () {
  const config = {
    webDownloadFolderId: GM_getValue('webDownloadFolderId', ''),
    botDownloadUrl: GM_getValue('botDownloadUrl', ''),
    signUrl: 'https://115.com/?ct=offline&ac=space&_=', // 获取115 token签名接口
    addTaskUrl: 'https://115.com/web/lixian/?ct=lixian&ac=add_task_url', // 添加115离线任务接口
    addTaskUrls: 'https://115.com/web/lixian/?ct=lixian&ac=add_task_urls', // 添加115b多个离线任务接口
    getUserUrl: 'https://webapi.115.com/offine/downpath', // 获取115用户userid接口
  }
  let requireCookieNames = ['UID', 'CID', 'SEID']

  function findLinksAndCreateButtons() {
    const blockcode = document.querySelector('.blockcode')
    let links = []
    if (blockcode) {
      const codes = blockcode.querySelectorAll('[id*="code_"]')
      codes.forEach((code) => {
        const textContent = code.textContent
        const magnetLinks = textContent.match(/magnet:\S+/g)
        const ed2kLinks = textContent.match(/ed2k:\/\/\|file\|.*?\|[0-9]+\|[A-Fa-f0-9]+\|\//g)
        if (magnetLinks) {
          links = links.concat(magnetLinks)
        }
        if (ed2kLinks) {
          links = links.concat(ed2kLinks)
        }
      })
      if (links.length !== 0) {
        createSettingButton()
        const em = blockcode.querySelector('em')
        if (em) {
          if (config.webDownloadFolderId) {
            const webDownloadTrigger = createButton('Web下载', () => handleLinks(links, addWebTorrents))
            em.parentNode.insertBefore(webDownloadTrigger, em.nextSibling)
          }
          if (config.botDownloadUrl) {
            const botDownloadTrigger = createButton('Bot下载', () => handleLinks(links, addBotTorrents))
            em.parentNode.insertBefore(botDownloadTrigger, em.nextSibling)
          }
        }
      }
    }
  }
  // 添加bot离线下载任务
  function addBotTorrents(urls) {
    return new Promise((resolve, reject) => {
      try {
        //判断一下botDownloadUrl是否是以http或者https开头
        if (!/^(http|https):\/\/.+(\/)?$/i.test(config.botDownloadUrl)) {
          reject('115bot下载地址格式不正确')
          return
        }
        const url = (config.botDownloadUrl.endsWith('/') ? config.botDownloadUrl : config.botDownloadUrl + '/') + 'ghs/addTaskUrls'
        let formdata = new FormData()
        formdata.append('urls', JSON.stringify(urls))
        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          data: formdata,
          onload: (responseDetails) => {
            console.log(responseDetails)
            if (responseDetails.status === 200) {
              return responseDetails.responseText.includes('成功') ? resolve('添加' + responseDetails.responseText) : reject(responseDetails.responseText)
            }
            return reject('请检查bot下载地址是否正确')
          },
          error: () => {
            reject(' 请检查bot下载地址是否正确')
          },
        })
      } catch (err) {
        reject(' 请检查bot下载地址是否正确')
      }
    })
  }
  // 添加115web离线任务
  function addWebTorrents(urls) {
    return new Promise((resolve, reject) => {
      const timeout = new Date().getTime()

      const fetchUserIDAndAddTorrents = () => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: config.getUserUrl,
          onload: (responseDetails) => {
            let resData
            try {
              resData = JSON.parse(responseDetails.response)
            } catch (error) {
              reject('获取115用户信息失败: 无效的JSON数据')
              return
            }
            if (!resData.state) {
              reject('获取115用户信息失败')
              return
            }
            const userID = resData.data && resData.data[0] ? resData.data[0].user_id : null
            if (!userID) {
              reject('获取115用户信息失败: 用户ID未找到')
              return
            }
            GM_setValue('X_userID', userID)
            addTorrents(userID)
          },
          onerror: () => reject('获取用户信息失败'),
        })
      }

      const addTorrents = (userID) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: config.signUrl + timeout,
          onload: (responseDetails) => {
            if (responseDetails.responseText.indexOf('html') >= 0) {
              reject('还没有登录115')
              return
            }
            let signData
            try {
              signData = JSON.parse(responseDetails.response)
            } catch (error) {
              reject('获取签名失败: 无效的JSON数据')
              return
            }
            const { sign } = signData
            let falseUrl = urls.length === 1 ? true : false
            let encodedUrls = falseUrl ? `url=${encodeURIComponent(urls[0])}` : urls.map((url, index) => `url[${index}]=${encodeURIComponent(url)}`).join('&')
            const url = falseUrl ? config.addTaskUrl : config.addTaskUrls
            const addConfig = {
              method: 'POST',
              url: url,
              data: `${encodedUrls}&savepath=&wp_path_id=${config.webDownloadFolderId}&uid=${userID}&sign=${sign}&time=${timeout}`,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
              onload: (res) => {
                let resData
                try {
                  resData = JSON.parse(res.response)
                } catch (error) {
                  reject('添加任务失败: 无效的JSON数据')
                  return
                }
                if (!falseUrl) {
                  if (resData.state === false) return reject(resData.error_msg || '添加任务失败')
                  const notifications = resData.result.map((item, index) => {
                    if (item.state === true) {
                      return `添加成功！索引：${index}`
                    } else {
                      return `添加失败：${item.error_msg || '未知错误'}`
                    }
                  })
                  resolve(notifications)
                } else {
                  if (resData.state === false) {
                    reject(resData.error_msg || '添加任务失败')
                  } else {
                    resolve('添加成功')
                  }
                }
              },
              onerror: () => reject('请求添加离线任务失败'),
            }
            GM_xmlhttpRequest(addConfig)
          },
          onerror: () => reject('获取签名失败'),
        })
      }

      let X_userID = GM_getValue('X_userID', '')
      if (!X_userID) {
        fetchUserIDAndAddTorrents()
      } else {
        addTorrents(X_userID)
      }
    })
  }
  // 色花推送
  function customNotify(message) {
    var ntcwin = document.getElementById('ntcwin')
    var customNtcwin = document.getElementById('customNtcwin')
    var appendParent = document.getElementById('append_parent')
    if (!ntcwin) {
      if (!appendParent) {
        console.error('append_parent element not found.')
        return
      }
      ntcwin = document.createElement('div')
      ntcwin.id = 'ntcwin'
      ntcwin.className = 'ntcwin'
      ntcwin.setAttribute('initialized', 'true')
      ntcwin.style.cssText = 'position: fixed; z-index: 501; left: 50%; top: 117px; display: none; transform: translateX(-50%);'
      ntcwin.innerHTML = `
          <table cellspacing="0" cellpadding="0" class="popupcredit">
              <tbody>
                  <tr>
                      <td class="pc_l">&nbsp;</td>
                      <td class="pc_c"><div class="pc_inner"></div></td>
                      <td class="pc_r">&nbsp;</td>
                  </tr>
              </tbody>
          </table>
      `
      appendParent.appendChild(ntcwin)
    }
    if (!customNtcwin) {
      customNtcwin = document.createElement('div')
      customNtcwin.id = 'customNtcwin'
      customNtcwin.className = 'customNtcwin'
      customNtcwin.style.cssText =
        'position: fixed; z-index: 501; left: 50%; top: 168px; display: none; transform: translateX(-50%); background-color: #f9f9f9; border: 1px solid #ccc; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;'
      appendParent.appendChild(customNtcwin)
    }
    if (Array.isArray(message)) {
      customNtcwin.innerHTML = ''
      message.forEach((msg) => {
        var messageElement = document.createElement('div')
        messageElement.textContent = msg
        customNtcwin.appendChild(messageElement)
      })
      customNtcwin.style.display = 'block'
      setTimeout(function () {
        customNtcwin.style.display = 'none'
      }, 2500)
    } else {
      var pc_inner = ntcwin.querySelector('.pc_inner')
      if (pc_inner) {
        pc_inner.innerHTML = ''
      } else {
        console.error('pc_inner element not found.')
        return
      }
      var messageElement = document.createElement('div')
      messageElement.textContent = message
      pc_inner.appendChild(messageElement)
      ntcwin.style.display = 'block'
      setTimeout(function () {
        ntcwin.style.display = 'none'
      }, 2500)
    }
  }

  // 处理磁力链接的函数
  function handleLinks(links, addUrlFunction) {
    addUrlFunction(links)
      .then((res) => {
        customNotify(res)
      })
      .catch((error) => {
        customNotify('添加链接失败: ' + error)
      })
  }
  // 创建样式按钮的函数
  function createStyledButton(text) {
    const button = document.createElement('button')
    button.textContent = text
    button.style.padding = '10px'
    button.style.border = 'none'
    button.style.borderRadius = '5px'
    button.style.backgroundColor = '#d42f2f'
    button.style.color = 'white'
    button.style.marginRight = '10px'
    button.style.cursor = 'pointer'
    button.style.fontSize = '16px'
    button.onmouseover = function () {
      this.style.backgroundColor = '#db2a3a'
    }
    button.onmouseout = function () {
      this.style.backgroundColor = '#d42f2f'
    }
    return button
  }

  // 创建按钮的函数
  function createButton(text, onClick) {
    const button = document.createElement('em')
    button.textContent = text
    button.style.cssText = 'cursor: pointer; margin-left: 10px;'
    button.addEventListener('click', onClick)
    return button
  }

  // 创建设置按钮
  function createSettingButton() {
    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;'
    document.body.appendChild(buttonContainer)
    ;['web设置', 'bot设置'].forEach((type) => {
      const button = createStyledButton(type)
      button.addEventListener('click', () => handleSetting(type))
      buttonContainer.appendChild(button)
    })
  }

  // 处理设置操作
  function handleSetting(type) {
    let promptText, settingKey
    if (type === 'web设置') {
      promptText = '请输入115文件夹ID:'
      settingKey = 'webDownloadFolderId'
    } else {
      promptText = '请输入下载URL:http(s)://'
      settingKey = 'botDownloadUrl'
    }
    const inputValue = prompt(promptText, config[settingKey])
    if (inputValue !== null) {
      GM_setValue(settingKey, inputValue)
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  // <- ---------------------------------------------------------------------------------------------------------------------------------------------------- ->
  // 115 cookie登录 这里更新Gloduck的脚本 他写的115的cookie登录
  /**
   * Alter展示Cookie
   */
  function showCookie() {
    // 使用GM_cookie函数获取Cookie
    GM_cookie.list({ domain: '.115.com' }, function (cookieInfos, error) {
      if (!error) {
        let cookieOutputs = []
        cookieInfos.forEach(function (cookieInfo) {
          if (requireCookieNames.includes(cookieInfo.name)) {
            cookieOutputs.push(`${cookieInfo.name}=${cookieInfo.value}`)
          }
        })
        alert(`Cookie信息为：\n---------------------------\n${cookieOutputs.join('\n')}\n---------------------------\n内容已复制到剪切板！`)
        GM_setClipboard(`${cookieOutputs.join(';')};`)
      } else {
        alert('获取cookie失败，请检查是否支持GM_cookie函数（目前只有beta版支持）')
      }
    })
  }

  /**
   * 初始化复制Cookie按钮
   */
  function initCopyCookieButton() {
    let btnGroupDiv = document.querySelector('div.left-tvf[rel="left_tvf"]')
    if (btnGroupDiv) {
      // 创建复制 Cookie 按钮
      let copyButton = document.createElement('a')
      copyButton.href = 'javascript:;'
      copyButton.className = 'button btn-line btn-upload'
      copyButton.innerHTML = '<i class="icon-operate ifo-copy"></i><span>复制Cookie</span>'

      // 点击显示Cookie
      copyButton.addEventListener('click', showCookie)

      btnGroupDiv.appendChild(copyButton)
    }
  }

  /**
   * 获取Cookie需要的列
   * @param requireFields {Array}
   * @param cookie {string}
   * @returns {Map<any, any>}
   */
  function getRequireFieldFromCookie(requireFields, cookie) {
    let resMap = new Map()
    if (!cookie) {
      return resMap
    }
    let cookies = cookie.split(';')
    cookies.forEach(function (cookie) {
      if (!cookie) {
        return
      }
      let kv = cookie.split('=')
      if (kv.length != 2) {
        return
      }
      if (requireFields.includes(kv[0])) {
        resMap.set(kv[0], kv[1])
      }
    })
    return resMap
  }

  /**
   * Cookie登录
   * @param requireCookieMap {Map}
   * @param validDuration {number}
   */
  function handleCookieLogin(requireCookieMap, validDuration) {
    requireCookieMap.forEach((value, key) => {
      GM_cookie.delete({ name: key }, function (error) {
        if (error) {
          alert(`清除Cookie：[${key}]失败！请检查是否支持GM_cookie函数（目前只有beta版支持）`)
        }
      })
      GM_cookie.set(
        {
          // url: '.115.com',
          name: key,
          value: value,
          domain: '.115.com',
          path: '/',
          secure: false,
          httpOnly: false,
          expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * validDuration, // Expires in 30 days
        },
        function (error) {
          if (error) {
            alert(`设置Cookie：[${key}]失败，值为：[${value}]！请检查是否支持GM_cookie函数（目前只有beta版支持）`)
          }
        }
      )
    })
    setTimeout(function () {
      location.reload()
    }, 1000)
  }

  /**
   * 显示Cookie登录的输入框
   */
  function showCookieLoginInputDialog() {
    let inputCookie = prompt('请输入 Cookie：')
    let requireCookieMap = getRequireFieldFromCookie(requireCookieNames, inputCookie)
    if (requireCookieMap.size != requireCookieNames.length) {
      alert(`输入的Cookie需包含[${requireCookieNames.join(',')}]，请重新输入！`)
      return
    }
    let defaultValidDuration = 30
    let inputValidDuration = prompt('请输入Cookie有效天数：', defaultValidDuration)
    let validDuration = parseInt(inputValidDuration, 10) || defaultValidDuration
    handleCookieLogin(requireCookieMap, validDuration)
  }

  /**
   * 初始化Cookie登录按钮
   */
  function initCookieLoginButton() {
    let loginFooter = document.querySelector('div.login-footer[rel="login_footer"]')
    if (loginFooter) {
      // 分隔符
      let splitField = document.createElement('i')
      splitField.textContent = '|'
      // 登录按钮
      let loginSpan = document.createElement('span')
      let loginButton = document.createElement('a')
      loginButton.textContent = '使用 Cookie 登录'
      loginButton.href = 'javascript:;'
      loginButton.addEventListener('click', showCookieLoginInputDialog)
      loginSpan.appendChild(loginButton)
      loginFooter.insertBefore(splitField, loginFooter.firstElementChild)
      loginFooter.insertBefore(loginButton, loginFooter.firstElementChild)
    }
  }
  findLinksAndCreateButtons()
  initCookieLoginButton()
  initCopyCookieButton()
})()
