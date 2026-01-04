// ==UserScript==
// @name         B站（哔哩哔哩）增强工具箱 - 随机播放、自定义倍速、自动播放/暂停、网页全屏
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  B站增强工具箱：自动播放/暂停、随机播放、自定义倍速、网页全屏等功能
// @author       xujinkai
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528944/B%E7%AB%99%EF%BC%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%89%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C%E3%80%81%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/528944/B%E7%AB%99%EF%BC%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%89%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%9A%82%E5%81%9C%E3%80%81%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

; (() => {
  //===========================================
  // 配置区域 - 可根据需要修改
  //===========================================

  const CONFIG = {
    autoPlay: false, // 打开页面时自动播放视频
    autoPause: true, // 自动暂停其他标签页的视频
    randomPlayButton: true, // 随机播放的按钮

    // 播放速度选项（从慢到快排序）
    // 这些倍速会自动绑定到字母上方的1到0十个数字
    playbackRates: ["0.2", "0.75", "1.0", "1.5", "2.0", "2.5", "3.0", "4.0", "5.0", "6.0"],

    // 键盘快捷键配置
    keys: {
      // 随机播放相关
      toggleRandom: "s", // 切换随机播放模式
      playRandom: "n", // 手动触发随机播放
      prevVideo: "[", // 上一个视频
      nextVideo: "]", // 下一个视频

      // 倍速相关
      decreaseSpeed: ",", // 减速
      increaseSpeed: ".", // 加速
      resetSpeed: "/", // 恢复原速

      // 全屏相关
      webFullscreen: "g", // 网页全屏

      // 中键点击播放器所映射的按键
      middleClick: "g",
    },

    // URL参数配置
    urlParams: {
      random: "random", // 随机播放参数名
      enabledValue: "1", // 启用随机播放的参数值
    },

    // 时间配置（毫秒）
    timing: {
      buttonCheckInterval: 1000, // 按钮检查间隔
      initialDelay: 1500, // 初始化延迟
      playRandomDelay: 500, // 随机播放延迟
      buttonBindRetry: 2000, // 按钮绑定重试延迟
      urlParamCheckDelay: 800, // URL参数检查延迟
      updateInterval: 1000, // 更新检查间隔
    },

    // 样式配置
    styles: {
      bilibiliBlue: "#00a1d6", // B站蓝色
      buttonMargin: "0 8px 0 0", // 按钮右侧间距
    },
  }

  //===========================================
  // 常量定义
  //===========================================

  // 选择器常量
  const SELECTORS = {
    // 视频元素
    VIDEO: [
      ".bilibili-player-video video", // 标准播放器
      ".bpx-player-video-wrap video", // 新版播放器
      "video", // 通用选择器
    ],

    // 控制区域
    CONTROL_AREAS: [".bilibili-player-video-control", ".bpx-player-control-wrap"],

    // 播放器区域
    PLAYER_AREAS: [".bilibili-player-video-wrap", ".bpx-player-video-area"],

    // 上一个/下一个按钮
    PREV_NEXT_BUTTONS: [
      // 旧版播放器
      ".bilibili-player-video-btn-prev",
      ".bilibili-player-video-btn-next",
      // 新版播放器
      ".bpx-player-ctrl-prev",
      ".bpx-player-ctrl-next",
    ],

    // 自动连播按钮
    AUTO_PLAY: ".auto-play",

    // 播放列表项
    PLAYLIST_ITEM: ".video-pod__list .simple-base-item",

    // 活跃的播放列表项
    ACTIVE_PLAYLIST_ITEM: ".video-pod__list .simple-base-item.active",

    // 播放速度菜单
    PLAYBACK_RATE_MENU: ".bpx-player-ctrl-playbackrate-menu",

    // 网页全屏按钮
    WEB_FULLSCREEN_BUTTON: ".bpx-player-ctrl-web",
  }

  // 事件类型常量
  const EVENTS = {
    PLAY: "play",
    ENDED: "ended",
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    MOUSEDOWN: "mousedown",
    CLICK: "click",
    POPSTATE: "popstate",
    LOAD: "load",
  }

  // 自定义事件类型
  const CUSTOM_EVENTS = {
    VIDEO_PLAY: "video:play",
    VIDEO_PAUSE: "video:pause",
    VIDEO_ENDED: "video:ended",
    VIDEO_ELEMENT_FOUND: "video:element_found",
    RANDOM_PLAY_TOGGLE: "random:toggle",
    RANDOM_PLAY_NEXT: "random:next",
    RANDOM_PLAY_PREV: "random:prev",
    URL_CHANGED: "url:changed",
    PLAYBACK_RATE_CHANGE: "playback:rate_change",
    FULLSCREEN_TOGGLE: "fullscreen:toggle",
    DOM_UPDATED: "dom:updated",
    CHANNEL_MESSAGE: "channel:message",
    KEY_PRESSED: "key:pressed",
    MIDDLE_CLICK: "mouse:middle_click",
    MEDIA_NEXT_TRACK: "media:next_track",
    MEDIA_PREV_TRACK: "media:prev_track",
  }

  // 消息类型常量
  const MESSAGES = {
    PAUSE_OTHERS: "pauseOthers",
  }

  // 动作类型常量
  const ACTIONS = {
    INCREASE: "increase",
    DECREASE: "decrease",
    RESET: "reset",
  }

  // DOM属性常量
  const DOM_PROPS = {
    HAS_ENDED_LISTENER: "_hasEndedListener",
    HAS_RANDOM_LISTENER: "_hasRandomListener",
  }

  // 通信频道名称
  const CHANNEL_NAME = "bilibili_video_control"

  //===========================================
  // 工具函数模块
  //===========================================

  const DOMUtils = {
    // 元素缓存
    _elementCache: {},

    /**
     * 从选择器数组中查找第一个匹配的元素
     * @param {string[]} selectors - 选择器数组
     * @returns {HTMLElement|null} 找到的元素或null
     */
    findFirstElement(selectors) {
      const cacheKey = selectors.join("|")
      if (this._elementCache[cacheKey]) {
        const element = this._elementCache[cacheKey]
        if (document.contains(element)) return element
      }

      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          this._elementCache[cacheKey] = element
          return element
        }
      }
      return null
    },

    /**
     * 从选择器数组中查找所有匹配的元素
     * @param {string[]} selectors - 选择器数组
     * @returns {HTMLElement[]} 找到的元素数组
     */
    findElements(selectors) {
      const elements = []
      for (const selector of selectors) {
        const found = document.querySelector(selector)
        if (found) elements.push(found)
      }
      return elements
    },

    /**
     * 显示提示信息
     * @param {string} message - 要显示的消息
     */
    showNotification(message) {
      // 检查是否已存在通知，如果存在则移除
      const existingNotification = document.querySelector(".bilibili-enhancer-notification")
      if (existingNotification) {
        document.body.removeChild(existingNotification)
      }

      const notification = document.createElement("div")
      notification.className = "bilibili-enhancer-notification"
      notification.textContent = message
      notification.style.position = "fixed"
      notification.style.top = "50%"
      notification.style.left = "50%"
      notification.style.transform = "translate(-50%, -50%)"
      notification.style.padding = "10px 20px"
      notification.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
      notification.style.color = "white"
      notification.style.borderRadius = "4px"
      notification.style.zIndex = "9999"

      document.body.appendChild(notification)

      // 淡出动画
      setTimeout(() => {
        notification.style.transition = "opacity 1s ease"
        notification.style.opacity = "0"
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 1000)
      }, 1500)
    },

    /**
     * 模拟键盘按键
     * @param {string} key - 要模拟的按键
     */
    simulateKeyPress(key) {
      if (!key || key.length === 0) return

      // 创建一个键盘事件
      const keyEvent = new KeyboardEvent(EVENTS.KEYDOWN, {
        key: key,
        code: `Key${key.toUpperCase()}`,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true,
      })

      // 分发事件到文档
      document.dispatchEvent(keyEvent)
      Logger.log(`模拟按键: ${key}`)
    },

    /**
     * 清除元素缓存
     */
    clearCache() {
      this._elementCache = {}
    },
  }

  /**
   * 日志工具模块
   */
  const Logger = {
    PREFIX: "[B站增强]",

    // 日志级别
    LEVELS: {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      NONE: 4,
    },

    // 当前日志级别
    level: 1, // 默认INFO级别

    /**
     * 设置日志级别
     * @param {number} level - 日志级别
     */
    setLevel(level) {
      this.level = level
    },

    /**
     * 输出调试日志
     * @param {string} message - 日志消息
     */
    debug(message) {
      if (this.level <= this.LEVELS.DEBUG) {
        console.debug(`${this.PREFIX} [DEBUG] ${message}`)
      }
    },

    /**
     * 输出普通日志
     * @param {string} message - 日志消息
     */
    log(message) {
      if (this.level <= this.LEVELS.INFO) {
        console.log(`${this.PREFIX} ${message}`)
      }
    },

    /**
     * 输出警告日志
     * @param {string} message - 警告消息
     */
    warn(message) {
      if (this.level <= this.LEVELS.WARN) {
        console.warn(`${this.PREFIX} ${message}`)
      }
    },

    /**
     * 输出错误日志
     * @param {string} message - 错误消息
     * @param {Error} [error] - 错误对象
     */
    error(message, error) {
      if (this.level <= this.LEVELS.ERROR) {
        if (error) {
          console.error(`${this.PREFIX} ${message}:`, error)
        } else {
          console.error(`${this.PREFIX} ${message}`)
        }
      }
    },
  }

  /**
   * 数学工具模块
   */
  const MathUtils = {
    /**
     * 将值舍入到最接近的整数（如果差值小于0.1）
     * @param {number} rate - 要舍入的值
     * @returns {number} 舍入后的值
     */
    roundToNearestInteger(rate) {
      if (rate < 0.2) return 0.2

      rate = Number.parseFloat(rate.toFixed(2))
      const rounded = Math.round(rate)

      return Math.abs(rate - rounded) < 0.1 ? rounded : rate
    },
  }

  //===========================================
  // 事件总线模块
  //===========================================

  const EventBus = {
    // 事件监听器
    listeners: {},

    // 通信频道
    channel: null,

    // DOM观察器
    observer: null,

    /**
     * 初始化事件总线
     */
    init() {
      // 创建通信频道
      this.channel = new BroadcastChannel(CHANNEL_NAME)

      // 设置频道消息监听
      this.channel.addEventListener("message", (event) => {
        this.emit(CUSTOM_EVENTS.CHANNEL_MESSAGE, event.data)
      })

      // 设置DOM观察器
      this.observer = new MutationObserver(() => {
        this.emit(CUSTOM_EVENTS.DOM_UPDATED)
      })

      // 开始观察DOM变化
      this.observer.observe(document.body, { childList: true, subtree: true })

      // 设置键盘事件监听
      window.addEventListener(EVENTS.KEYDOWN, (event) => {
        // 忽略输入框中的按键事件
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
          return
        }

        // 忽略带有修饰键的按键
        if (event.ctrlKey || event.altKey || event.metaKey) {
          return
        }

        const key = event.key.toLowerCase()
        this.emit(CUSTOM_EVENTS.KEY_PRESSED, { key, event })
      })

      // 设置鼠标中键事件监听
      document.addEventListener(EVENTS.MOUSEDOWN, (event) => {
        // 检查是否是中键点击
        if (event.button !== 1) return

        // 检查点击的是否是视频元素
        const video = VideoController.getVideo()
        if (!video) return

        // 检查点击位置是否在视频元素内
        const rect = video.getBoundingClientRect()
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          this.emit(CUSTOM_EVENTS.MIDDLE_CLICK, { event, video })
          event.preventDefault()
        }
      })

      // 设置URL变化监听
      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState

      // 重写pushState
      history.pushState = function () {
        originalPushState.apply(this, arguments)
        EventBus.emit(CUSTOM_EVENTS.URL_CHANGED, { url: window.location.href })
      }

      // 重写replaceState
      history.replaceState = function () {
        originalReplaceState.apply(this, arguments)
        EventBus.emit(CUSTOM_EVENTS.URL_CHANGED, { url: window.location.href })
      }

      // 监听popstate事件（浏览器前进/后退）
      window.addEventListener(EVENTS.POPSTATE, () => {
        this.emit(CUSTOM_EVENTS.URL_CHANGED, { url: window.location.href })
      })

      // 监听视频元素变化
      this.on(CUSTOM_EVENTS.DOM_UPDATED, () => {
        const video = VideoController.getVideo()
        if (video && !video[DOM_PROPS.HAS_ENDED_LISTENER]) {
          video[DOM_PROPS.HAS_ENDED_LISTENER] = true

          // 发送视频元素找到事件
          this.emit(CUSTOM_EVENTS.VIDEO_ELEMENT_FOUND, { video })

          // 监听视频播放事件
          video.addEventListener(EVENTS.PLAY, () => {
              // BUG: 自动播放失败，但仍然会触发VIDEO_PLAY
              setTimeout(()=> {
                  if (!video.paused){
                      Logger.log("发送 CUSTOM_EVENTS.VIDEO_PLAY 事件");
                      this.emit(CUSTOM_EVENTS.VIDEO_PLAY, { video })
                  }
              },10)
          })

          // 监听视频结束事件
          video.addEventListener(EVENTS.ENDED, () => {
            this.emit(CUSTOM_EVENTS.VIDEO_ENDED, { video })
          })
        }
      })

      // 设置媒体会话处理程序
      this.setupMediaSessionHandlers()

      Logger.log("事件总线已初始化")
    },

    /**
     * 设置媒体会话处理程序
     */
    setupMediaSessionHandlers() {
      if ("mediaSession" in navigator) {
        // 设置上一曲处理程序
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          Logger.log("媒体会话: 上一曲(mediaSession)")
          this.emit(CUSTOM_EVENTS.MEDIA_PREV_TRACK)
        })

        // 设置下一曲处理程序
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          Logger.log("媒体会话: 下一曲(mediaSession)")
          this.emit(CUSTOM_EVENTS.MEDIA_NEXT_TRACK)
        })

        Logger.log("媒体会话处理程序已注册")
      } else {
        Logger.warn("媒体会话API不可用")
      }

      document.addEventListener("keyup", (e) => {
        if (e.key === "MediaTrackPrevious") {
          Logger.log("媒体会话: 上一曲(keyup)")
          this.emit(CUSTOM_EVENTS.MEDIA_PREV_TRACK)
        } else if (e.key === "MediaTrackNext") {
          Logger.log("媒体会话: 下一曲(keyup)")
          this.emit(CUSTOM_EVENTS.MEDIA_NEXT_TRACK)
        }
      }, true,)
    },

    /**
     * 注册事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(callback)
      return this // 支持链式调用
    },

    /**
     * 移除事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
      if (!this.listeners[event]) return this

      if (callback) {
        this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
      } else {
        delete this.listeners[event]
      }
      return this // 支持链式调用
    },

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     */
    emit(event, data = {}) {
      Logger.debug(`事件触发: ${event}`)
      if (!this.listeners[event]) return

      this.listeners[event].forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          Logger.error(`事件处理器错误 (${event})`, error)
        }
      })
    },

    /**
     * 发送频道消息
     * @param {string} action - 动作类型
     * @param {*} data - 消息数据
     */
    sendMessage(action, data = {}) {
      this.channel.postMessage({ action, ...data })
    },

    /**
     * 清理资源
     */
    destroy() {
      this.listeners = {}
      if (this.channel) {
        this.channel.close()
      }
      if (this.observer) {
        this.observer.disconnect()
      }
    },
  }

  //===========================================
  // 视频控制模块
  //===========================================

  const VideoController = {
    /**
     * 获取视频元素
     * @returns {HTMLElement|null} 视频元素
     */
    getVideo() {
      return DOMUtils.findFirstElement(SELECTORS.VIDEO)
    },

    /**
     * 尝试自动播放视频
     * @returns {Promise<boolean>} 是否成功播放
     */
    tryAutoPlay() {
      const video = this.getVideo()
      if (!video) return Promise.resolve(false)

      return video
        .play()
        .then(() => {
          Logger.log("自动播放成功")
          return true
        })
        .catch((error) => {
          Logger.log("自动播放被拦截，不再尝试")
          Logger.debug(`自动播放错误: ${error.message}`)
          return false
        })
    },

    /**
     * 暂停视频
     * @returns {boolean} 是否成功暂停
     */
    pause() {
      const video = this.getVideo()
      if (!video || video.paused) return false

      video.pause()
      return true
    },

    /**
     * 调整视频播放速度
     * @param {string|number} action - "increase", "decrease", "reset", or a specific rate
     */
    adjustPlaybackSpeed(action) {
      const video = this.getVideo()
      if (!video) return

      const currentRate = video.playbackRate

      if (typeof action === "number") {
        // 如果已经是该速度，则恢复为1.0倍速
        if (Math.abs(video.playbackRate - action) < 0.01) {
          video.playbackRate = 1.0
          DOMUtils.showNotification(`播放速度: 1.0x`)
        } else {
          video.playbackRate = action
          DOMUtils.showNotification(`播放速度: ${action}x`)
        }
        return
      }

      switch (action) {
        case ACTIONS.RESET:
          video.playbackRate = 1.0
          DOMUtils.showNotification(`播放速度: 1.0x`)
          break

        case ACTIONS.DECREASE:
          video.playbackRate = MathUtils.roundToNearestInteger(currentRate * 0.8)
          DOMUtils.showNotification(`播放速度: ${video.playbackRate}x`)
          break

        case ACTIONS.INCREASE:
          video.playbackRate = MathUtils.roundToNearestInteger(currentRate * 1.2)
          DOMUtils.showNotification(`播放速度: ${video.playbackRate}x`)
          break
      }

      // 触发播放速度变化事件
      EventBus.emit(CUSTOM_EVENTS.PLAYBACK_RATE_CHANGE, {
        rate: video.playbackRate,
        previousRate: currentRate,
      })
    },

    /**
     * 切换网页全屏状态
     */
    toggleWebFullscreen() {
      const fullscreenButton = document.querySelector(SELECTORS.WEB_FULLSCREEN_BUTTON)
      if (fullscreenButton) {
        fullscreenButton.click()
        Logger.log("切换网页全屏")

        // 触发全屏切换事件
        EventBus.emit(CUSTOM_EVENTS.FULLSCREEN_TOGGLE)
      }
    },

    /**
     * 更新播放速度菜单列表
     * @returns {boolean} 是否更新成功
     */
    updatePlaybackRateMenu() {
      const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU)
      if (!menu) return false

      const currentRates = Array.from(menu.children).map((el) => el.getAttribute("data-value"))
      const newRates = [...CONFIG.playbackRates].reverse()

      // 避免不必要的更新
      if (JSON.stringify(currentRates) === JSON.stringify(newRates)) return false

      menu.innerHTML = ""

      newRates.forEach((rate) => {
        const item = document.createElement("li")
        item.className = "bpx-player-ctrl-playbackrate-menu-item"
        item.setAttribute("data-value", rate)
        item.textContent = rate + "x"
        menu.appendChild(item)
      })

      Logger.log("播放速度菜单已更新")
      return true
    },
  }

  //===========================================
  // 随机播放模块
  //===========================================

  const RandomPlayModule = {
    // 随机播放相关状态
    state: {
      shuffleButtonAdded: false,
      buttonCheckInterval: null,
      isRandomPlayEnabled: false,
      urlParamProcessed: false,
      originalPlaylist: [],
      shuffledPlaylist: [],
      currentPlayIndex: -1,
    },

    /**
     * 初始化随机播放功能
     */
    init() {
      // 使用间隔检查按钮是否存在
      this.state.buttonCheckInterval = setInterval(
        () => this.checkAndAddRandomButton(),
        CONFIG.timing.buttonCheckInterval,
      )

      // 初始尝试添加按钮
      setTimeout(() => this.checkAndAddRandomButton(), CONFIG.timing.initialDelay)

      // 监听URL变化
      EventBus.on(CUSTOM_EVENTS.URL_CHANGED, () => this.checkURLParams())

      // 检查URL参数
      setTimeout(() => this.checkURLParams(), CONFIG.timing.urlParamCheckDelay)

      // 监听视频结束事件
      EventBus.on(CUSTOM_EVENTS.VIDEO_ENDED, () => {
        Logger.log("视频播放结束，检查随机播放状态")
        if (this.state.isRandomPlayEnabled) {
          setTimeout(() => this.playNextInQueue(), CONFIG.timing.playRandomDelay)
        }
      })

      // 监听随机播放事件
      EventBus.on(CUSTOM_EVENTS.RANDOM_PLAY_TOGGLE, () => {
        const shuffleBtn = document.querySelector(".shuffle-btn")
        if (shuffleBtn) shuffleBtn.click()
      })

      EventBus.on(CUSTOM_EVENTS.RANDOM_PLAY_NEXT, () => {
        this.playNextVideo()
      })

      EventBus.on(CUSTOM_EVENTS.RANDOM_PLAY_PREV, () => {
        this.playPrevVideo()
      })

      // 监听媒体会话事件
      EventBus.on(CUSTOM_EVENTS.MEDIA_NEXT_TRACK, () => {
        Logger.log("媒体会话: 下一曲 -> 随机播放下一个")
        this.playNextVideo()
      })

      EventBus.on(CUSTOM_EVENTS.MEDIA_PREV_TRACK, () => {
        Logger.log("媒体会话: 上一曲 -> 随机播放上一个")
        this.playPrevVideo()
      })
    },

    /**
     * 检查并添加随机播放按钮
     */
    checkAndAddRandomButton() {
      // 检查是否已经添加了随机按钮，避免重复添加
      if (document.querySelector(".shuffle-btn")) {
        return
      }

      // 查找自动连播按钮容器
      const autoPlayContainer = document.querySelector(SELECTORS.AUTO_PLAY)
      if (autoPlayContainer) {
        this.createShuffleButton(autoPlayContainer)
        this.state.shuffleButtonAdded = true
        Logger.log("随机播放按钮已添加")

        // 成功添加按钮后清除检查间隔
        if (this.state.buttonCheckInterval) {
          clearInterval(this.state.buttonCheckInterval)
          this.state.buttonCheckInterval = null
        }

        // 设置上一个/下一个按钮监听
        this.setupPrevNextButtonsListener()

        // 初始化播放列表
        this.initializePlaylist()

        // 再次检查URL参数（确保按钮已添加后再处理）
        if (!this.state.urlParamProcessed) {
          this.checkURLParams()
        }
      }
    },

    /**
     * 创建随机播放按钮
     * @param {HTMLElement} autoPlayContainer - 自动连播按钮容器
     */
    createShuffleButton(autoPlayContainer) {
      // 克隆自动连播按钮作为模板
      const shuffleContainer = autoPlayContainer.cloneNode(true)
      shuffleContainer.className = "shuffle-btn auto-play" // 保持相同的样式类

      // 添加右侧间距
      shuffleContainer.style.margin = CONFIG.styles.buttonMargin

      // 修改文本和图标
      const textElement = shuffleContainer.querySelector(".txt")
      if (textElement) {
        textElement.textContent = "随机播放"
      }

      // 替换图标为随机播放图标
      const iconElement = shuffleContainer.querySelector("svg")
      if (iconElement) {
        // 清除原有的路径
        while (iconElement.firstChild) {
          iconElement.removeChild(iconElement.firstChild)
        }

        // 添加随机图标的路径
        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
        iconPath.setAttribute("d", "path")
        iconPath.setAttribute(
          "d",
          "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
        )
        iconElement.appendChild(iconPath)
      }

      // 确保开关按钮的样式正确
      const switchElement = shuffleContainer.querySelector(".switch-btn")
      if (switchElement) {
        // 确保开关按钮初始状态为off
        switchElement.className = "switch-btn off"
      }

      // 移除原有的点击事件
      const newShuffleContainer = shuffleContainer.cloneNode(true)

      // 将随机按钮添加到自动连播按钮旁边
      const rightContainer = autoPlayContainer.closest(".right")
      if (rightContainer) {
        rightContainer.insertBefore(newShuffleContainer, autoPlayContainer)

        // 添加点击事件
        newShuffleContainer.addEventListener(EVENTS.CLICK, () => this.toggleRandomPlay())
      }
    },

    /**
     * 初始化播放列表
     */
    initializePlaylist() {
      // 获取所有播放列表项
      const playlistItems = Array.from(document.querySelectorAll(SELECTORS.PLAYLIST_ITEM))
      if (playlistItems.length <= 1) return

      // 保存原始播放列表
      this.state.originalPlaylist = playlistItems

      // 初始化打乱的播放列表（初始为空，会在开启随机播放时生成）
      this.state.shuffledPlaylist = []

      // 找到当前播放的视频索引
      const activeItem = document.querySelector(SELECTORS.ACTIVE_PLAYLIST_ITEM)
      this.state.currentPlayIndex = activeItem ? playlistItems.indexOf(activeItem) : 0

      Logger.log(`播放列表已初始化，共 ${playlistItems.length} 个视频，当前索引: ${this.state.currentPlayIndex}`)
    },

    /**
     * 生成随机播放队列
     */
    generateShuffledPlaylist() {
      // 确保原始播放列表已初始化
      if (this.state.originalPlaylist.length === 0) {
        this.initializePlaylist()
        if (this.state.originalPlaylist.length === 0) return
      }

      // 创建索引数组
      const indices = Array.from({ length: this.state.originalPlaylist.length }, (_, i) => i)

      // 获取当前播放的视频索引
      const activeItem = document.querySelector(SELECTORS.ACTIVE_PLAYLIST_ITEM)
      const currentIndex = activeItem ? this.state.originalPlaylist.indexOf(activeItem) : -1

      // 从索引数组中移除当前播放的视频索引
      if (currentIndex !== -1) {
        indices.splice(indices.indexOf(currentIndex), 1)
      }

      // Fisher-Yates 洗牌算法打乱剩余索引
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }

      // 如果当前有播放的视频，将其放在队列最前面
      if (currentIndex !== -1) {
        indices.unshift(currentIndex)
      }

      // 保存打乱后的播放列表
      this.state.shuffledPlaylist = indices.map((index) => this.state.originalPlaylist[index])
      this.state.currentPlayIndex = 0

      Logger.log("随机播放队列已生成:", indices)
    },

    /**
     * 切换随机播放状态
     * @param {boolean} [forceState] - 可选，强制设置为指定状态
     */
    toggleRandomPlay(forceState) {
      // 如果提供了强制状态，则使用它，否则切换当前状态
      if (typeof forceState === "boolean") {
        this.state.isRandomPlayEnabled = forceState
      } else {
        this.state.isRandomPlayEnabled = !this.state.isRandomPlayEnabled
      }

      // 更新按钮状态
      const shuffleBtn = document.querySelector(".shuffle-btn")
      if (shuffleBtn) {
        // 更新开关按钮的状态
        const switchElement = shuffleBtn.querySelector(".switch-btn")
        if (switchElement) {
          if (this.state.isRandomPlayEnabled) {
            switchElement.className = "switch-btn on"
            // 生成随机播放队列
            this.generateShuffledPlaylist()
          } else {
            switchElement.className = "switch-btn off"
            // 清空随机播放队列
            this.state.shuffledPlaylist = []
          }
        } else {
          // 如果没有开关元素，使用颜色来表示状态
          if (this.state.isRandomPlayEnabled) {
            shuffleBtn.style.color = CONFIG.styles.bilibiliBlue
            // 生成随机播放队列
            this.generateShuffledPlaylist()
          } else {
            shuffleBtn.style.color = ""
            // 清空随机播放队列
            this.state.shuffledPlaylist = []
          }
        }
      }

      // 更新URL参数
      this.updateURLParam()

      Logger.log(this.state.isRandomPlayEnabled ? "已开启随机播放模式" : "已关闭随机播放模式")
    },

    /**
     * 设置上一个/下一个按钮监听
     */
    setupPrevNextButtonsListener() {
      // 监听按钮变化
      EventBus.on(CUSTOM_EVENTS.DOM_UPDATED, () => {
        // 遍历所有可能的按钮选择器
        SELECTORS.PREV_NEXT_BUTTONS.forEach((selector) => {
          const button = document.querySelector(selector)
          if (button && !button[DOM_PROPS.HAS_RANDOM_LISTENER]) {
            button[DOM_PROPS.HAS_RANDOM_LISTENER] = true

            // 保存原始的点击处理函数
            const originalClickHandler = button.onclick

            // 替换为我们的处理函数
            button.onclick = (e) => {
              if (this.state.isRandomPlayEnabled) {
                e.preventDefault()
                e.stopPropagation()

                // 根据按钮类型决定播放上一个还是下一个
                if (selector.includes("prev")) {
                  this.playPrevInQueue()
                } else {
                  this.playNextInQueue()
                }

                return false
              } else if (originalClickHandler) {
                return originalClickHandler.call(button, e)
              }
            }

            // 如果是div元素，还需要监听click事件
            if (button.tagName.toLowerCase() === "div") {
              button.addEventListener(EVENTS.CLICK, (e) => {
                if (this.state.isRandomPlayEnabled) {
                  e.preventDefault()
                  e.stopPropagation()

                  // 根据按钮类型决定播放上一个还是下一个
                  if (selector.includes("prev")) {
                    this.playPrevInQueue()
                  } else {
                    this.playNextInQueue()
                  }

                  return false
                }
              })
            }

            Logger.log(`按钮监听器已添加: ${selector}`)
          }
        })
      })
    },

    /**
     * 播放队列中的下一个视频
     */
    playNextInQueue() {
      if (!this.state.isRandomPlayEnabled || this.state.shuffledPlaylist.length === 0) {
        // 如果随机播放未启用或队列为空，则随机选择一个视频播放
        this.playRandomVideo()
        return
      }

      // 移动到下一个索引
      this.state.currentPlayIndex = (this.state.currentPlayIndex + 1) % this.state.shuffledPlaylist.length

      // 播放当前索引的视频
      const videoToPlay = this.state.shuffledPlaylist[this.state.currentPlayIndex]
      if (videoToPlay) {
        this.playVideo(videoToPlay)
      } else {
        // 如果出现问题，重新生成队列并播放
        this.generateShuffledPlaylist()
        this.playNextInQueue()
      }
    },

    /**
     * 播放队列中的上一个视频
     */
    playPrevInQueue() {
      if (!this.state.isRandomPlayEnabled || this.state.shuffledPlaylist.length === 0) {
        // 如果随机播放未启用或队列为空，则随机选择一个视频播放
        this.playRandomVideo()
        return
      }

      // 移动到上一个索引
      this.state.currentPlayIndex =
        (this.state.currentPlayIndex - 1 + this.state.shuffledPlaylist.length) % this.state.shuffledPlaylist.length

      // 播放当前索引的视频
      const videoToPlay = this.state.shuffledPlaylist[this.state.currentPlayIndex]
      if (videoToPlay) {
        this.playVideo(videoToPlay)
      } else {
        // 如果出现问题，重新生成队列并播放
        this.generateShuffledPlaylist()
        this.playPrevInQueue()
      }
    },

    /**
     * 随机播放一个视频（不使用队列，完全随机）
     */
    playRandomVideo() {
      const playlistItems = Array.from(document.querySelectorAll(SELECTORS.PLAYLIST_ITEM))
      if (playlistItems.length <= 1) return

      // 获取当前活跃的视频
      const activeItem = document.querySelector(SELECTORS.ACTIVE_PLAYLIST_ITEM)
      const currentIndex = activeItem ? playlistItems.indexOf(activeItem) : -1

      // 随机选择一个不同的索引
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * playlistItems.length)
      } while (randomIndex === currentIndex && playlistItems.length > 1)

      Logger.log(`播放随机视频: ${randomIndex + 1}/${playlistItems.length}`)

      // 播放随机选择的视频
      this.playVideo(playlistItems[randomIndex])
    },

    /**
     * 播放指定的视频
     * @param {HTMLElement} videoElement - 要播放的视频元素
     */
    playVideo(videoElement) {
      if (!videoElement) return

      // 尝试获取链接并导航
      const link = videoElement.querySelector("a")
      if (link && link.href) {
        Logger.log(`导航至: ${link.href}`)

        // 添加随机播放参数到URL
        const url = new URL(link.href)
        if (this.state.isRandomPlayEnabled) {
          url.searchParams.set(CONFIG.urlParams.random, CONFIG.urlParams.enabledValue)
        }

        window.location.href = url.toString()
      } else {
        // 如果无法获取链接，尝试模拟点击
        Logger.log("模拟点击播放列表项")
        videoElement.click()
      }
    },

    /**
     * 播放上一个视频（如果随机模式开启则使用队列）
     */
    playPrevVideo() {
      if (this.state.isRandomPlayEnabled) {
        this.playPrevInQueue()
      } else {
        // 尝试点击上一个按钮
        const prevButton = DOMUtils.findFirstElement(SELECTORS.PREV_NEXT_BUTTONS.filter((s) => s.includes("prev")))
        if (prevButton) {
          prevButton.click()
        }
      }
    },

    /**
     * 播放下一个视频（如果随机模式开启则使用队列）
     */
    playNextVideo() {
      if (this.state.isRandomPlayEnabled) {
        this.playNextInQueue()
      } else {
        // 尝试点击下一个按钮
        const nextButton = DOMUtils.findFirstElement(SELECTORS.PREV_NEXT_BUTTONS.filter((s) => s.includes("next")))
        if (nextButton) {
          nextButton.click()
        }
      }
    },

    /**
     * 检查URL参数
     */
    checkURLParams() {
      const url = new URL(window.location.href)
      const randomParam = url.searchParams.get(CONFIG.urlParams.random)

      // 标记URL参数已处理
      this.state.urlParamProcessed = true

      // 如果存在随机播放参数并且值为启用值
      if (randomParam === CONFIG.urlParams.enabledValue) {
        Logger.log("在URL中检测到随机播放参数")

        // 如果按钮已添加，则启用随机播放
        if (document.querySelector(".shuffle-btn")) {
          if (!this.state.isRandomPlayEnabled) {
            Logger.log("从URL参数启用随机播放")
            this.toggleRandomPlay(true)

            // 如果有播放列表，则播放随机视频
            setTimeout(() => {
              if (document.querySelectorAll(SELECTORS.PLAYLIST_ITEM).length > 1) {
                this.playRandomVideo()
              }
            }, CONFIG.timing.playRandomDelay)
          }
        } else {
          // 如果按钮尚未添加，则设置标志以便稍后处理
          Logger.log("按钮尚未添加，将在按钮准备好时启用随机播放")
          this.state.urlParamProcessed = false
        }
      }
    },

    /**
     * 更新URL参数
     */
    updateURLParam() {
      // 获取当前URL
      const url = new URL(window.location.href)

      // 根据随机播放状态设置或移除参数
      if (this.state.isRandomPlayEnabled) {
        url.searchParams.set(CONFIG.urlParams.random, CONFIG.urlParams.enabledValue)
      } else {
        url.searchParams.delete(CONFIG.urlParams.random)
      }

      // 使用replaceState更新URL，不触发页面刷新
      try {
        window.history.replaceState({}, document.title, url.toString())
        Logger.log(`URL已更新: ${url.toString()}`)
      } catch (e) {
        Logger.error("更新URL失败", e)
      }
    },
  }

  //===========================================
  // 播放增强模块
  //===========================================

  const PlaybackEnhancementModule = {
    // 播放器状态
    state: {
      lastUpdate: 0,
      isInitialized: false,
    },

    /**
     * 初始化播放增强功能
     */
    init() {
      // 监听DOM变化以适应B站的SPA特性
      EventBus.on(CUSTOM_EVENTS.DOM_UPDATED, () => this.updatePlayer())

      // 初始更新播放器
      this.updatePlayer()
    },

    /**
     * 更新播放器功能（可能需要定期执行）
     */
    updatePlayer() {
      // 防止频繁更新
      const now = Date.now()
      if (now - this.state.lastUpdate < CONFIG.timing.updateInterval) return

      // 如果配置了播放速度选项，则更新播放速度菜单
      if (CONFIG.playbackRates && CONFIG.playbackRates.length > 0) {
        VideoController.updatePlaybackRateMenu()
      }

      this.state.lastUpdate = now
    },
  }

  //===========================================
  // 键盘和鼠标控制模块
  //===========================================

  const KeyboardMouseModule = {
    /**
     * 初始化键盘和鼠标控制
     */
    init() {
      // 监听键盘事件
      EventBus.on(CUSTOM_EVENTS.KEY_PRESSED, ({ key }) => {
        this.triggerKeyFunction(key)
      })

      // 监听鼠标中键事件
      EventBus.on(CUSTOM_EVENTS.MIDDLE_CLICK, () => {
        if (CONFIG.keys.middleClick) {
          // 先尝试触发预定义的按键功能
          const handled = this.triggerKeyFunction(CONFIG.keys.middleClick)

          // 如果没有预定义功能处理，则模拟键盘按键
          if (!handled) {
            DOMUtils.simulateKeyPress(CONFIG.keys.middleClick)
          }
        }
      })

      Logger.log("键盘和鼠标控制已初始化")
    },

    /**
     * 触发按键对应的功能
     * @param {string} key - 按键
     * @returns {boolean} 是否处理了该按键
     */
    triggerKeyFunction(key) {
      if (!key) return false

      // 根据按键执行相应功能
      switch (key) {
        case CONFIG.keys.toggleRandom:
          EventBus.emit(CUSTOM_EVENTS.RANDOM_PLAY_TOGGLE)
          return true
        case CONFIG.keys.playRandom:
          EventBus.emit(CUSTOM_EVENTS.RANDOM_PLAY_NEXT)
          return true
        case CONFIG.keys.prevVideo:
          EventBus.emit(CUSTOM_EVENTS.RANDOM_PLAY_PREV)
          return true
        case CONFIG.keys.nextVideo:
          EventBus.emit(CUSTOM_EVENTS.RANDOM_PLAY_NEXT)
          return true
        case CONFIG.keys.decreaseSpeed:
          VideoController.adjustPlaybackSpeed(ACTIONS.DECREASE)
          return true
        case CONFIG.keys.increaseSpeed:
          VideoController.adjustPlaybackSpeed(ACTIONS.INCREASE)
          return true
        case CONFIG.keys.resetSpeed:
          VideoController.adjustPlaybackSpeed(ACTIONS.RESET)
          return true
        case CONFIG.keys.webFullscreen:
          VideoController.toggleWebFullscreen()
          return true
        default:
          // 检查是否是数字键
          if (key >= "0" && key <= "9") {
            const keyNum = Number.parseInt(key)
            const index = keyNum === 0 ? 9 : keyNum - 1
            if (CONFIG.playbackRates && index < CONFIG.playbackRates.length) {
              VideoController.adjustPlaybackSpeed(Number.parseFloat(CONFIG.playbackRates[index]))
              return true
            }
          }
          return false
      }
    },
  }

  //===========================================
  // 主应用模块
  //===========================================

  const App = {
    /**
     * 主初始化函数
     */
    init() {
      Logger.log("初始化中...")

      // 初始化事件总线
      EventBus.init()

      // 检查URL参数，判断是否有随机播放参数
      const url = new URL(window.location.href)
      const hasRandomParam = url.searchParams.get(CONFIG.urlParams.random) === CONFIG.urlParams.enabledValue

      // 自动播放功能
      if (CONFIG.autoPlay && !hasRandomParam) {
        // 修复：当有随机播放参数时，不执行自动播放
          EventBus.on(CUSTOM_EVENTS.VIDEO_ELEMENT_FOUND, ()=>VideoController.tryAutoPlay());
          // setTimeout(()=>VideoController.tryAutoPlay(), 1);
     }

      // 自动暂停功能
      if (CONFIG.autoPause) {
        // 监听视频播放事件，通知其他标签页暂停
        EventBus.on(CUSTOM_EVENTS.VIDEO_PLAY, () => {
          EventBus.sendMessage(MESSAGES.PAUSE_OTHERS)
        })

        // 监听频道消息，暂停当前标签页的视频
        EventBus.on(CUSTOM_EVENTS.CHANNEL_MESSAGE, (data) => {
          if (data.action === MESSAGES.PAUSE_OTHERS) {
            if (VideoController.pause()) {
              Logger.log("其他页面播放，本页面已暂停")
            }
          }
        })
      }

      // 随机播放功能
      if (CONFIG.randomPlayButton) {
        RandomPlayModule.init()
      }

      // 自定义倍速功能
      if (CONFIG.playbackRates && CONFIG.playbackRates.length > 0) {
        PlaybackEnhancementModule.init()
      }

      // 键盘和鼠标控制
      KeyboardMouseModule.init()

      Logger.log("初始化完成")
    },

    /**
     * 获取配置
     * @returns {Object} 当前配置
     */
    getConfig() {
      return { ...CONFIG }
    },

    /**
     * 更新配置
     * @param {Object} newConfig - 新配置
     */
    updateConfig(newConfig) {
      Object.assign(CONFIG, newConfig)
      Logger.log("配置已更新")
      return { ...CONFIG }
    },
  }

  //===========================================
  // 公共API
  //===========================================

  // 创建全局API对象
  window.BilibiliEnhancer = {
    // 配置相关
    getConfig: App.getConfig,
    updateConfig: App.updateConfig,

    // 视频控制
    getVideo: VideoController.getVideo,
    adjustPlaybackSpeed: (rate) => VideoController.adjustPlaybackSpeed(rate),
    toggleWebFullscreen: () => VideoController.toggleWebFullscreen(),

    // 随机播放
    toggleRandomPlay: (state) => RandomPlayModule.toggleRandomPlay(state),
    playNextVideo: () => RandomPlayModule.playNextVideo(),
    playPrevVideo: () => RandomPlayModule.playPrevVideo(),
    playRandomVideo: () => RandomPlayModule.playRandomVideo(),

    // 事件相关
    on: (event, callback) => EventBus.on(event, callback),
    off: (event, callback) => EventBus.off(event, callback),
    emit: (event, data) => EventBus.emit(event, data),

    // 工具函数
    showNotification: (message) => DOMUtils.showNotification(message),

    // 日志相关
    setLogLevel: (level) => Logger.setLevel(level),

    // 常量
    EVENTS: CUSTOM_EVENTS,
    ACTIONS: ACTIONS,

    // 版本信息
    VERSION: "1.0",
  }

  //===========================================
  // 初始化
  //===========================================

  // 页面加载完成后初始化
  if (document.readyState === "complete") {
    App.init()
  } else {
    window.addEventListener(EVENTS.LOAD, () => { setTimeout(App.init, 0) })
  }
})()

