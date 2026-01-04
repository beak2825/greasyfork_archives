// ==UserScript==
// @name         swagger-free
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  关于 swagger 文档的一些自动化
// @author       glk
// @include       /^https?://.*/
// @icon         https://public.shv.im/doc/favicon-16x16.png
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/444600/swagger-free.user.js
// @updateURL https://update.greasyfork.org/scripts/444600/swagger-free.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const VERSION = "0.0.8"

  const isSwagger = !!document.getElementById('swagger-ui')

  const custom_style = `
    .container {
      position: fixed;
      top: 5px;
      right: 5px;
      background: #fff;
      padding: 5px;
      border-radius: 3px;
      box-shadow: 0 0 3px #ccc;
    }

    .base {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
    }
    
    .base input {
      width: 100px;
      margin-left: 20px;
      padding: 5px;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      outline: none;
    }

    .base {
      color: #333;
    }
  
  `
  if (isSwagger) {

    // 登录接口标识
    const LoginSign = '登录'

    // 添加权限标识
    const AddAuthSign = `添加权限`

    // 复制文本到剪贴板(带格式)
    function copyTextToClipboard(text = '') {
      const textArea = document.createElement('textarea')
      const _text = String(text)
      textArea.setAttribute('readonly', 'readonly');
      textArea.value = _text;
      document.body.appendChild(textArea);
      textArea.select();;
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('复制成功');
        showTip('复制成功✔', 1)
      } else {
        console.log(`复制失败`);
        showTip('复制失败😒', 1)
      }
      document.body.removeChild(textArea);
    }

    // 提示框
    function showTip (message, duration = 0.8) {
      let show_tip = document.getElementById('show_tip')
      if (show_tip) {
        document.body.removeChild(show_tip)
      }
      if (!message) { return }
      let tipDom = document.createElement('div')
      tipDom.id = 'show_tip'
      Object.assign(tipDom.style, {
        position: 'fixed',
        maxWidth: '80vw',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        lineHeight: '20px',
        zIndex: 9999,
        color: '#fff',
        backgroundColor: '#303133',
        borderRadius: ' 4px',
        padding: '10px',
        textAlign: 'center',
        opacity: 0.9,
        fontSize: '1rem',
        animation: `tipanimation ${duration}s 1`
      })
      tipDom.innerText = message
      document.body.appendChild(tipDom)

      setTimeout(() => {
        let show_tip = document.getElementById('show_tip')
        if (show_tip) {
          document.body.removeChild(show_tip)
        }
      }, duration * 1000 - 100)
    }

    // 添加样式
    function addStyle(styStr = "") {
      let _style = document.createElement('style')
      _style.innerHTML = styStr
      document.getElementsByTagName('head')[0].appendChild(_style)
    }

     // 休眠
    function sleep(duration = 3) {
      return new Promise(resolve => {
        setTimeout(resolve, duration * 1000)
      })
    }
    // 保存用户信息
    function saveUserInfo (obj={}) {
      const keys = Object.keys(obj)
      keys.forEach(i => {
        localStorage.setItem(i, obj[i])
      })
    }

    // 折叠/展开所有面板
    async function collapseSummary (bool=false) {
      const text = bool ? '折叠' : '展开'
      showTip(`等待${text}...`, 90)
      await sleep(0.3)
      Array.from( document.getElementsByClassName('opblock-summary-control')).forEach(i => { 
        const isExpanded = i.getAttribute('aria-expanded') === 'true' ? true : false
        if ((bool && isExpanded) || (!bool && !isExpanded)) { 
          i.click()
        }
      })
      showTip(`${text}完成`, 1.5)
    }

    // 网络请求
    function request ({ url, method='post', data }={}) {
      return new Promise((resolve) => {
        window.fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(data)
        }).then(res => res.json()).then(res => resolve(res))
      })
    }

    // 根据标识查找接口路径
    function findSignPath (signStr) {
      const signEle = Array.from(document.querySelectorAll('.opblock-summary-description')).find(el => el.textContent.includes(signStr))
      if (signEle) {
        return signEle.previousElementSibling.textContent.replace(/​/g, '') || ''
      } else { 
        showTip(`${signStr}的标识选择错误！`, 1.5)
     }
    }

    // 添加所有权限
    function addAllAuth () {
      let addAuthPath = findSignPath(AddAuthSign)
      if (!addAuthPath) return
      Array.from( document.getElementsByClassName('opblock')).forEach(async i => {
        const summaryControl = i.children[0].children[0]
        const method = summaryControl?.children[0].innerText
        const path = summaryControl?.children[1].children[0].children[0]?.innerText.replace(/​/g, '') // 去除 &ZeroWidthSpace;
        console.log('path', path)
        // 权限地址
        const request_url = `${method}:${path}`
        // 权限介绍
        const introduce = summaryControl?.children[2]?.innerText
        // 权限描述
        const codeText = i.children[1].getElementsByClassName('opblock-body')[0].children[0]?.getElementsByTagName('code')[0]?.innerText 
        if (codeText.includes('需要权限')) {
          const res = await request({
            url: addAuthPath, 
            data: {
              introduce,
              request_url,
              menu_url: '',
              role_id: localStorage.getItem('roleId') || ''
            }
          })
          console.log(`添加${request_url}权限结果`, res)
          console.log(`%c 
          权限: ${request_url}
          介绍: ${introduce}
          描述: ${codeText} `, 'color: pink;')
        }
      })
    }

    // 添加DOM、绑定事件
    function bindDom () {
      const autoLoginHTML = `
        <div class="base">
          <span>account: </span><input class="account"/>
        </div>
        <div class="base">
          <span>password: </span><input class="password"/>
        </div>
        <div class="base">
          <button class="loginBtn">login</button>
          <button class="addAuths">add auths</button>
        </div>
        <hr />
        <div class="base">
          <button id="tD">Toggle DesignMode</button>
        </div>
      `
      const autoLoginContainer = document.createElement('div')
      autoLoginContainer.className = 'container'
      autoLoginContainer.innerHTML = autoLoginHTML
      document.body.appendChild(autoLoginContainer)
      
      const accountInput = document.getElementsByClassName('account')[0]
      const psdInput = document.getElementsByClassName('password')[0]
      const loginBtn = document.getElementsByClassName('loginBtn')[0]
      accountInput.value = localStorage.getItem('account') || ''
      psdInput.value = localStorage.getItem('password') || ''

      loginBtn.onclick = () => {
        let loginPath = findSignPath(LoginSign)
        if (!loginPath) { 
          return 
        }
        const account = accountInput.value.replace(/\s+/g, '')
        const password = psdInput.value
        if(!account || !password) { 
          showTip('用户名或密码错误！', 1.5)
          return 
        }
        const data = { account, password }
        window.fetch(loginPath, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
          console.log('登录结果', res)
          if(!res.error) {
            const { token, role: { Admin: isAdmin, id: roleId } } = res.data
            saveUserInfo({ token, account, password, isAdmin, roleId })
            const authorizeBtn = document.getElementsByClassName('authorize')[0]
            const copyTokenBtn = document.createElement('button')
            copyTokenBtn.className = 'btn modal-btn auth authorize button'
            copyTokenBtn.innerText = 'copy token'
            copyTokenBtn.onclick = () => {  copyTextToClipboard(token) }
            // 打开 token 填写窗口
            authorizeBtn.click()
            // 添加复制按钮
            const authContainer = document.getElementsByClassName('auth-container')[0]
            const authBtnWrapper = authContainer.getElementsByClassName('auth-btn-wrapper')[0]
            const child0 = authBtnWrapper.children[0]
            if (child0.textContent === 'Logout') {
              console.log('先删除之前的 token ')
              child0.click()
            }
            authBtnWrapper.appendChild(copyTokenBtn)
  
            const tokenInput = authContainer.getElementsByTagName('input')[0]
            const submitAuthorizeBtn = authContainer.getElementsByClassName('authorize')[0]
            const closeModal = document.getElementsByClassName('close-modal')[0]
  
            submitAuthorizeBtn.onclick = () => {
              if (!tokenInput.value) {
                showTip("😡你不打算粘贴Token？？？", 1.5)
                return
              }
              setTimeout(() => {
                closeModal.click()
                showTip('token 写入成功✌', 1.5)
              }, 500) 
            }
            // tokenInput.focus()
  
            // swagger 不支持
            // tokenInput.value = token
            // submitAuthorizeBtn.click()
            } else {
              const resMsg = res.message
              const errMsg = Array.isArray(resMsg) ? resMsg.join('，') : resMsg
              showTip(errMsg)
            }
        })
      }

      tD.onclick = () => {
        if (document.designMode === "on") {
          document.designMode = "off"
          showTip("DesignMode off")
        } else {
          document.designMode = "on"
          showTip("DesignMode on")
        }
      }
    }

    // 绑定权限录入
    function bindAddAuth () {
      const addAuths = document.getElementsByClassName('addAuths')[0]
      addAuths.onclick = () => {
      addAuths.setAttribute('disabled', 'disabled')
        collapseSummary().then(async () => {
          await sleep(1.5)
          addAllAuth()
          addAuths.removeAttribute('disabled')
          showTip('所有权限添加完成', 1.5)
          // collapseSummary(true).then(() => {
          // })
        })
      }
    }

    addStyle(custom_style)
    bindDom()
    bindAddAuth()
    console.log(`%c swagger-free ${VERSION}`, 'color: pink;')
  } else {
    console.log(`%c swagger-free ${VERSION} 脚本不执行`, 'color: pink;')
  }
})();