// ==UserScript==
// @name         dify本地启动自动复制token
// @version      0.5
// @description  登录测试环境Dify, 再打开或刷新本地项目地址, 本地项目会自动登录
// @author       zhangyu
// @include      https://ai-agent-*.clink.cn/*
// @include      https://agent-*.clink.cn/*/index/systemMenu/智能体*
// @exclude      https://ai-agent-*.clink.cn/signin
// @include      https://localhost:3000*
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @namespace https://greasyfork.org/users/108102
// @downloadURL https://update.greasyfork.org/scripts/537735/dify%E6%9C%AC%E5%9C%B0%E5%90%AF%E5%8A%A8%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6token.user.js
// @updateURL https://update.greasyfork.org/scripts/537735/dify%E6%9C%AC%E5%9C%B0%E5%90%AF%E5%8A%A8%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6token.meta.js
// ==/UserScript==

;(() => {
  // 判断当前页面是否为本地开发环境
  if (location.hostname === "localhost") {
    setTimeout(() => {
      // 从GM存储中获取之前保存的token
      const gmToken = GM_getValue("difyToken")

      if (!hasDifyToken(gmToken)) {
        return
      }

      // 如果localStorage中存在token，对比local和GM存储中的token过期时间，如果local的过期时间大于等于GM的过期时间 return
      const localToken = getDifyTokenFromLocalStorage()
      if (hasDifyToken(localToken)) {
        const decodedLocalToken = decodeJWT(localToken.console_token)
        const decodedGmToken = decodeJWT(gmToken.console_token)
        if (decodedLocalToken.payload.exp >= decodedGmToken.payload.exp) {
          return
        }
      }

      // 将token设置到本地localStorage中，实现自动登录
      localStorage.setItem("console_token", gmToken.console_token)
      localStorage.setItem("refresh_token", gmToken.refresh_token)
      console.log("%c🐸 dify token自动设置成功", "color: #FFEB3B; font-weight: bold; font-size: 12px;")
    })
  } else if (location.hostname.includes("clink.cn")) {
    // 当前在测试环境Dify页面，需要获取并保存token
    waitForPageReady(() => {
      let tryCount = 0
      // 定时器轮询获取token，最多尝试10次
      const timer = setInterval(() => {
        tryCount++
        const saveToken = saveDifyToken()
        const currentToken = saveToken.token
        const hasToken = hasDifyToken(currentToken)

        // 如果获取到token或达到最大尝试次数，停止轮询
        if (hasToken || tryCount >= 10) {
          clearInterval(timer)
          if (hasToken) {
            saveToken() // 保存token到GM存储
          }
        }
      }, 200)

      // 监听页面可见性变化，当离开页签时兜底保存token
      // 避免上面轮询获取到的是过期token的情况
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          saveDifyToken()() // 保存token到GM存储
        }
      })
    })
  }

  // =================== utils ===================
  /**
   * JWT解码函数
   * @param {string} token JWT token字符串
   * @returns {object} 包含header、payload和signature的对象
   */
  function decodeJWT(token) {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("无效的token")
      }

      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("JWT token格式错误")
      }

      const [headerBase64, payloadBase64, signature] = parts

      // Base64解码并解析JSON
      const header = JSON.parse(atob(headerBase64.replace(/-/g, "+").replace(/_/g, "/")))
      const payload = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")))

      return {
        header,
        payload,
        signature,
        raw: token,
      }
    } catch (error) {
      console.error("JWT解码失败:", error.message)
      return null
    }
  }

  /**
   * 从localStorage获取token数据
   */
  function getDifyTokenFromLocalStorage() {
    return {
      console_token: localStorage.getItem("console_token"),
      refresh_token: localStorage.getItem("refresh_token"),
    }
  }

  /**
   * 判断token是否完整
   */
  function hasDifyToken(token) {
    return token?.refresh_token && token?.console_token
  }

  /**
   * 并保存Dify token到GM存储中
   */
  function saveDifyToken() {
    // 保存token到GM存储
    const saveToken = () => {
      const tokenData = getDifyTokenFromLocalStorage()
      if (hasDifyToken(tokenData)) {
        GM_setValue("difyToken", tokenData)
      }
      return tokenData
    }

    // 为saveToken函数添加token属性，方便获取当前token
    Object.defineProperty(saveToken, "token", { get: getDifyTokenFromLocalStorage, enumerable: true })
    return saveToken
  }

  /**
   * 等待页面完全加载完成后执行回调函数
   * @param {Function} callback 页面加载完成后的回调函数
   */
  function waitForPageReady(callback) {
    if (document.readyState === "complete") callback()
    else window.addEventListener("load", callback, { once: true })
  }
})()
