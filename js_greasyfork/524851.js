// ==UserScript==
// @name         Google OAuth2 示例
// @namespace    http://rachpt.cn/
// @version      0.1
// @description  示例油猴脚本，展示如何实现 Google OAuth2 认证
// @author       您的名称
// @match        https://rachpt.cn/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524851/Google%20OAuth2%20%E7%A4%BA%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524851/Google%20OAuth2%20%E7%A4%BA%E4%BE%8B.meta.js
// ==/UserScript==

;(async () => {
  ;('use strict')

  // 客户端ID，从Google Cloud Platform获取
  const CLIENT_ID =
    '1006685129079-gsvfd4b06ugq7b37p5br5qn3g8lrehs2.apps.googleusercontent.com'

  // 应用的重定向URI，确保这个URI在Google Cloud Platform中被正确配置
  const REDIRECT_URI = 'https://rachpt.cn/callback.html'

  // API的范围，这里使用的是Google Apps Script API的范围
  const SCOPES =
    'https://www.googleapis.com/auth/script.external_request https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.webapp.deploy https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets'

  // 替换为您的脚本ID
  const scriptId =
    'AKfycbxxzhm-eBNMtipzMH4D-FQB9SdxTvFpANSiAWzHV11aLZ2j_75u0su1rNaScewn5La6Uw'
  const functionToCall = 'getSpreadsheetsData' // 替换为您的函数名

  // 初始化gapi客户端
  async function initClient() {
    try {
      await gapi.client.init({
        apiKey: 'AIzaSyBA_ktrU2sFdCMwsxLh-3woKTF7lO8dhpU', // API密钥，同样在Google Cloud Platform获取
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: [
          'https://script.googleapis.com/$discovery/rest?version=v1',
        ],
      })
      // 检查是否已经授权
      checkAuthorization()
    } catch (error) {
      console.error(error)
    }
  }

  // 检查是否已经授权
  function checkAuthorization() {
    const accessToken = localStorage.getItem('google_access_token')
    if (accessToken) {
      console.log('已授权，access_token: ' + accessToken)
      document.getElementById('authorize-button').style.display = 'none'
      document.getElementById('signout-button').style.display = 'block'
      // 设置授权令牌
      gapi.client?.setToken({
        access_token: accessToken,
      })
      // 调用Google Apps Script API
      callAppsScriptAPI()
    } else {
      console.log('未授权')
      document.getElementById('authorize-button').style.display = 'block'
      document.getElementById('signout-button').style.display = 'none'
    }
  }

  // 打开授权页面
  function authorize() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=token&scope=${encodeURIComponent(
      SCOPES
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

    // 使用GM_openInTab打开授权页面
    GM_openInTab(authUrl, {
      active: true,
      insert: true,
      setParent: true,
    })

    // 检查token是否已经保存
    checkAuthorization()
  }

  // 注销
  function signOut() {
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(() => {
      console.log('用户已注销。')
      document.getElementById('authorize-button').style.display = 'block'
      document.getElementById('signout-button').style.display = 'none'
      localStorage.removeItem('google_access_token')
      localStorage.removeItem('google_id_token')
    })
  }

  // 调用Google Apps Script API
  // async function callAppsScriptAPI() {
  //   const parameters = [] // 根据需要传入参数

  //   try {
  //     const request = await gapi.client.script.scripts.run({
  //       scriptId: scriptId,
  //       function: functionToCall,
  //       parameters: parameters,
  //     })

  //     console.log('Script 结果: ' + request.result.response)
  //   } catch (error) {
  //     console.error('Script 错误消息: ' + error.error.details[0])
  //   }
  // }

  // 调用Google Apps Script API
  async function callAppsScriptAPI() {
    const parameters = [] // 根据需要传入参数

    const accessToken = localStorage.getItem('google_access_token')
    if (!accessToken) {
      console.error('没有找到访问令牌')
      return
    }

    try {
      const response = await GM_xmlhttpRequest({
        method: 'POST',
        url: `https://script.googleapis.com/v1/scripts/${scriptId}:run`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          function: functionToCall,
          parameters: parameters,
        }),
        onload: (response) => {
          console.log('Script 结果: ' + response.responseText)
        },
        onerror: (error) => {
          console.error('Script 错误消息: ' + error.responseText)
        },
      })
    } catch (error) {
      console.error('Script 错误消息: ' + error)
    }
  }

  // 在HTML中加载Google API客户端库
  const loadGapiScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src =
        'https://apis.google.com/js/client:platform.js?onload=initClient'
      script.onload = resolve
      script.onerror = reject
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  // 添加授权和注销按钮
  const addButtons = () => {
    const authButton = document.createElement('button')
    authButton.id = 'authorize-button'
    authButton.innerHTML = '授权'
    authButton.onclick = authorize
    document.body.appendChild(authButton)

    const signOutButton = document.createElement('button')
    signOutButton.id = 'signout-button'
    signOutButton.innerHTML = '注销'
    signOutButton.onclick = signOut
    signOutButton.style.display = 'none'
    document.body.appendChild(signOutButton)
  }

  // 初始化客户端并添加按钮
  async function initialize() {
    try {
      await loadGapiScript()
      addButtons()
      checkAuthorization()
    } catch (error) {
      console.error(error)
    }
  }

  // 确保页面加载后初始化
  window.addEventListener('load', initialize)
})()
