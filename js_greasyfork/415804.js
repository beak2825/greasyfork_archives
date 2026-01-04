// ==UserScript==
// @name              哔哩哔哩（bilibili.com）播放页调整
// @license           GPL-3.0 License
// @namespace         https://greasyfork.org/zh-CN/scripts/415804-bilibili%E6%92%AD%E6%94%BE%E9%A1%B5%E8%B0%83%E6%95%B4-%E8%87%AA%E7%94%A8
// @version           0.39
// @description       1.自动定位到播放器（进入播放页，可自动定位到播放器，可设置偏移量及是否在点击主播放器时定位）；2.可设置是否自动选择最高画质；3.可设置播放器默认模式；
// @author            QIAN
// @match             *://*.bilibili.com/video/*
// @match             *://*.bilibili.com/bangumi/play/*
// @match             *://*.bilibili.com/list/*
// @run-at            document-start
// @require           https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@11.7.2/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@11.7.2/dist/sweetalert2.min.css
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM.info
// @supportURL        https://github.com/QIUZAIYOU/Bilibili-VideoPage-Adjustment
// @homepageURL       https://github.com/QIUZAIYOU/Bilibili-VideoPage-Adjustment
// @icon              https://www.bilibili.com/favicon.ico?v=1
// @downloadURL https://update.greasyfork.org/scripts/415804/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E6%92%AD%E6%94%BE%E9%A1%B5%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/415804/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibilicom%EF%BC%89%E6%92%AD%E6%94%BE%E9%A1%B5%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
$(() => {
  'use strict'
  let {
    currentUrl,
    theMainFunctionRunningTimes,
    thePrepFunctionRunningTimes,
    autoSelectScreenModeTimes,
    autoCancelMuteTimes,
    webfullUnlockTimes,
    insertGoToCommentsButtonTimes,
    autoSelectVideoHighestQualityTimes,
    functionExecutionsTimes = 0,
  } = {
    currentUrl: window.location.href,
    theMainFunctionRunningTimes: 0,
    thePrepFunctionRunningTimes: 0,
    autoSelectScreenModeTimes: 0,
    autoCancelMuteTimes: 0,
    webfullUnlockTimes: 0,
    insertGoToCommentsButtonTimes: 0,
    autoSelectVideoHighestQualityTimes: 0,
  }
  const {
    getValue,
    setValue,
    sleep,
    addStyle,
    historyListener,
    checkBrowserHistory,
    throttle,
    getClientHeight,
    checkElementExistence,
    isDocumentHidden,
    isLogin,
    logger,
    checkPageReadyState,
    pageReload,
    scrollToPlayer
  } = {
    getValue (name) {
      return GM_getValue(name)
    },
    setValue (name, value) {
      GM_setValue(name, value)
    },
    sleep (time) {
      return new Promise(resolve => setTimeout(resolve, time))
    },
    addStyle (id, tag, css) {
      tag = tag || 'style'
      const doc = document
      const styleDom = doc.getElementById(id)
      if (styleDom) return
      const style = doc.createElement(tag)
      style.rel = 'stylesheet'
      style.id = id
      tag === 'style' ? (style.innerHTML = css) : (style.href = css)
      document.head.appendChild(style)
    },
    historyListener () {
      class Dep {
        constructor(name) {
          this.id = new Date()
          this.subs = []
        }
        defined () {
          Dep.watch.add(this)
        }
        notify () {
          this.subs.forEach((e, i) => {
            if (typeof e.update === 'function') {
              try {
                e.update.apply(e)
              } catch (err) {
                console.warr(err)
              }
            }
          })
        }
      }
      Dep.watch = null
      class Watch {
        constructor(name, fn) {
          this.name = name
          this.id = new Date()
          this.callBack = fn
        }
        add (dep) {
          dep.subs.push(this)
        }
        update () {
          var cb = this.callBack
          cb(this.name)
        }
      }
      var addHistoryMethod = (function () {
        var historyDep = new Dep()
        return function (name) {
          if (name === 'historychange') {
            return function (name, fn) {
              var event = new Watch(name, fn)
              Dep.watch = event
              historyDep.defined()
              Dep.watch = null
            }
          } else if (name === 'pushState' || name === 'replaceState') {
            var method = history[name]
            return function () {
              method.apply(history, arguments)
              historyDep.notify()
              // logger.info("访问历史｜变化")
            }
          }
        }
      })()
      window.addHistoryListener = addHistoryMethod('historychange')
      history.pushState = addHistoryMethod('pushState')
      history.replaceState = addHistoryMethod('replaceState')
      window.addHistoryListener('history', function () {
        const throttleAutoLocation = throttle(m.autoLocation, 500)
        throttleAutoLocation()
      })
    },
    checkBrowserHistory () {
      window.addEventListener('popstate', () => {
        m.autoLocation()
      })
    },
    throttle (func, delay) {
      let wait = false
      return (...args) => {
        if (wait) {
          return
        }
        func(...args)
        wait = true
        setTimeout(() => {
          wait = false
        }, delay)
      }
    },
    getClientHeight () {
      const bodyHeight = document.body.clientHeight || 0
      const docHeight = document.documentElement.clientHeight || 0
      return bodyHeight < docHeight ? bodyHeight : docHeight
    },
    // 检查指定HTML元素是否存在
    checkElementExistence (selector, maxAttempts, interval) {
      // functionExecutionsTimes += 1
      // const funName = (new Error()).stack.split("\n")[2].trim().split(" ")[1].replace('Object.', '')
      // logger.debug(`(调用：${functionExecutionsTimes}) ${funName} -> ${selector}`)
      return new Promise(resolve => {
        let attempts = 0
        const intervalId = setInterval(() => {
          attempts++
          // logger.debug(`(尝试：${attempts}) -> ${selector}`)
          const element = $(selector)
          if (element.length) {
            clearInterval(intervalId)
            resolve(true)
          } else if (attempts === maxAttempts) {
            clearInterval(intervalId)
            resolve(false)
          }
        }, interval)
      })
    },
    isDocumentHidden () {
      const visibilityChangeEventNames = ['visibilitychange', 'mozvisibilitychange', 'webkitvisibilitychange', 'msvisibilitychange']
      const documentHiddenPropertyName = visibilityChangeEventNames.find(name => name in document) || 'onfocusin' in document || 'onpageshow' in window ? 'hidden' : null
      if (documentHiddenPropertyName !== null) {
        const isHidden = () => document[documentHiddenPropertyName]
        const onChange = () => isHidden()
        // 添加各种事件监听器
        visibilityChangeEventNames.forEach(eventName => document.addEventListener(eventName, onChange))
        window.addEventListener('focus', onChange)
        window.addEventListener('blur', onChange)
        window.addEventListener('pageshow', onChange)
        window.addEventListener('pagehide', onChange)
        document.onfocusin = document.onfocusout = onChange
        return isHidden()
      }
      // 如果无法判断是否隐藏，则返回undefined
      return undefined
    },
    isLogin () {
      return Boolean(document.cookie.replace(new RegExp(String.raw`(?:(?:^|.*;\s*)bili_jct\s*=\s*([^;]*).*$)|^.*$`), '$1') || null)
    },
    logger: {
      info (content) {
        console.info('%c播放页调整', 'color:white;background:#006aff;padding:2px;border-radius:2px', content)
      },
      warn (content) {
        console.warn('%c播放页调整', 'color:white;background:#ff6d00;padding:2px;border-radius:2px', content)
      },
      error (content) {
        console.error('%c播放页调整', 'color:white;background:#f33;padding:2px;border-radius:2px', content)
      },
      debug (content) {
        console.info('%c播放页调整(调试)', 'color:white;background:#cc00ff;padding:2px;border-radius:2px', content)
      },
    },
    checkPageReadyState (state) {
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (document.readyState === state) {
            clearInterval(timer)
            resolve(true)
          }
        }, 100)
      })
    },
    pageReload () {
      if (auto_reload) location.reload(true)
    },
    scrollToPlayer (offset) {
      $('html,body').scrollTop(offset)
    }
  }
  const {
    is_vip,
    player_type,
    offset_top,
    auto_locate,
    auto_locate_video,
    auto_locate_bangumi,
    click_player_auto_locate,
    player_offset_top,
    current_screen_mode,
    selected_screen_mode,
    auto_select_video_highest_quality,
    contain_quality_4k,
    contain_quality_8k,
    webfull_unlock,
    auto_reload
  } = {
    is_vip: getValue('is_vip'),
    player_type: getValue('player_type'),
    offset_top: Math.trunc(getValue('offset_top')),
    auto_locate: getValue('auto_locate'),
    auto_locate_video: getValue('auto_locate_video'),
    auto_locate_bangumi: getValue('auto_locate_bangumi'),
    click_player_auto_locate: getValue('click_player_auto_locate'),
    player_offset_top: Math.trunc(getValue('player_offset_top')),
    current_screen_mode: getValue('current_screen_mode'),
    selected_screen_mode: getValue('selected_screen_mode'),
    auto_select_video_highest_quality: getValue('auto_select_video_highest_quality'),
    contain_quality_4k: getValue('contain_quality_4k'),
    contain_quality_8k: getValue('contain_quality_8k'),
    webfull_unlock: getValue('webfull_unlock'),
    auto_reload: getValue('auto_reload')
  }
  const m = {
    // 初始化设置参数
    initValue () {
      const value = [{
        name: 'is_vip',
        value: false,
      }, {
        name: 'player_type',
        value: 'video',
      }, {
        name: 'offset_top',
        value: 7,
      }, {
        name: 'player_offset_top',
        value: 160,
      }, {
        name: 'auto_locate',
        value: true,
      }, {
        name: 'auto_locate_video',
        value: true,
      }, {
        name: 'auto_locate_bangumi',
        value: true,
      }, {
        name: 'click_player_auto_locate',
        value: true,
      }, {
        name: 'current_screen_mode',
        value: 'normal',
      }, {
        name: 'selected_screen_mode',
        value: 'wide',
      }, {
        name: 'auto_select_video_highest_quality',
        value: true,
      }, {
        name: 'contain_quality_4k',
        value: false,
      }, {
        name: 'contain_quality_8k',
        value: false,
      }, {
        name: 'webfull_unlock',
        value: false,
      }, {
        name: 'auto_reload',
        value: false,
      }]
      value.forEach(v => {
        if (getValue(v.name) === undefined) {
          setValue(v.name, v.value)
        }
      })
    },
    // 检查视频资源是否加载完毕并处于可播放状态
    async checkVideoCanPlayThrough () {
      const BwpVideoPlayerExists = await checkElementExistence('bwp-video', 10, 10)
      // logger.debug(`bwp-video｜${BwpVideoPlayerExists?'存在':'不存在'}`)
      if (BwpVideoPlayerExists) {
        return new Promise(resolve => {
          resolve(true)
        })
      }
      const $video = $('#bilibili-player video')
      const videoReadyState = $video[0].readyState
      // logger.debug(`视频资源｜${videoReadyState>=4?'可播放':'不可播放'}`
      if (videoReadyState >= 4) {
        return new Promise(resolve => {
          resolve(true)
        })
      } else {
        return new Promise(resolve => {
          const checkTimeout = setTimeout(() => {
            // logger.error('视频资源｜脚本检测失败｜重载页面')
            pageReload()
            resolve(false)
          }, 7000)
          $video.on('canplaythrough', () => {
            // logger.info("视频资源加载｜成功")
            let attempts = 100
            const timer = setInterval(() => {
              const isHidden = $('#bilibili-player .bpx-player-container').attr('data-ctrl-hidden')
              if (isHidden === 'false') {
                clearInterval(timer)
                clearTimeout(checkTimeout)
                // logger.info(`视频可播放`)
                // logger.info(`控制条｜出现(hidden:${isHidden})`)
                resolve(true)
              } else if (attempts <= 0) {
                clearInterval(timer)
                clearTimeout(checkTimeout)
                // logger.error("控制条｜检查失败")
                resolve(false)
              }
              // logger.info("控制条｜检查中")
              attempts--
            }, 100)
          })
        })
      }
    },
    // 获取当前视频类型(video/bangumi)
    getCurrentPlayerType () {
      const isVideo = currentUrl.includes('www.bilibili.com/video') || currentUrl.includes('www.bilibili.com/list/')
      const isBangumi = currentUrl.includes('www.bilibili.com/bangumi')
      setValue('player_type', isVideo ? 'video' : isBangumi && 'bangumi')
    },
    // 获取当前屏幕模式(normal/wide/web/full)
    async getCurrentScreenMode () {
      const exists = await checkElementExistence('#bilibili-player .bpx-player-container', 10, 100)
      if (exists) {
        const screenMode = $('#bilibili-player .bpx-player-container').attr('data-screen')
        return Promise.resolve(screenMode)
      } else return Promise.resolve(false)
    },
    // 监听屏幕模式变化(normal/wide/web/full)
    watchScreenModeChange () {
      const screenModObserver = new MutationObserver(mutations => {
        const playerDataScreen = $('#bilibili-player .bpx-player-container').attr('data-screen')
        setValue('current_screen_mode', playerDataScreen)
      })
      screenModObserver.observe($('#bilibili-player .bpx-player-container')[0], {
        attributes: true,
        attributeFilter: ['data-screen'],
      })
    },
    // 判断自动切换屏幕模式是否切换成功
    async checkScreenModeSuccess (expect_mode) {
      const current_screen_mode = await this.getCurrentScreenMode()
      const player_data_screen = $('#bilibili-player .bpx-player-container').attr('data-screen')
      const equal = new Set([
        expect_mode,
        selected_screen_mode,
        current_screen_mode,
        player_data_screen,
      ]).size === 1
      return Promise.resolve(equal)
    },
    // 自动选择屏幕模式
    async autoSelectScreenMode () {
      const current_screen_mode = await this.getCurrentScreenMode()
      if (current_screen_mode === 'wide') return { done: true, mode: selected_screen_mode }
      if (current_screen_mode === 'web') return { done: true, mode: selected_screen_mode }
      autoSelectScreenModeTimes++
      if (autoSelectScreenModeTimes === 1) {
        const wideEnterBtn = document.querySelector('.bpx-player-ctrl-wide-enter')
        const webEnterBtn = document.querySelector('.bpx-player-ctrl-web-enter')
        const selectModeBtn = selected_screen_mode === 'wide' ? wideEnterBtn : webEnterBtn
        const expect_mode = selected_screen_mode === 'wide' ? 'wide' : 'web'
        let attempts = 50
        selectModeBtn.click()
        const checkScreenMode = async (expect_mode) => {
          const success = await this.checkScreenModeSuccess(expect_mode)
          if (success) {
            clearInterval(checkScreenModeInterval)
            setValue('current_screen_mode', selected_screen_mode)
            return {
              done: true,
              mode: selected_screen_mode
            }
          } else {
            await sleep(1000)
            selectModeBtn.click()
            logger.warn('自动选择屏幕模式失败正在重试')
            attempts--
            if (attempts === 0) {
              clearInterval(checkScreenModeInterval)
              pageReload()
            }
          }
        }
        let checkScreenModeInterval = setInterval(checkScreenMode, 100, expect_mode)
        return new Promise(resolve => {
          checkScreenMode(expect_mode).then(result => {
            resolve(result)
          })
        })
      }
    },
    // 网页全屏解锁
    fixedWebfullUnlockStyle () {
      webfullUnlockTimes++
      async function resetPlayerLayout () {
        $('body').css({
          'padding-top': 0,
          position: 'auto',
        })
        $('#playerWrap').css('display', 'block')
        $('#bilibili-player').css({
          height: 'auto',
          position: 'unset',
        })
        $('#playerWrap').append($('#bilibili-player'))
        $('.float-nav-exp .mini').css('display', '')
        // 临时设置默认屏幕模式为宽屏用以触发执行自动定位至播放器，定位完后再重新改为网页全屏
        setValue('selected_screen_mode', 'wide')
        const playerDataScreen = await m.getCurrentScreenMode()
        if (playerDataScreen !== 'full') {
          m.autoLocation()
        }
        setValue('selected_screen_mode', 'web')
      }
      if (webfullUnlockTimes === 1) {
        const clientHeight = getClientHeight()
        $('body.webscreen-fix').css({
          'padding-top': clientHeight,
          position: 'unset',
        })
        $('#bilibili-player.mode-webscreen').css({
          height: clientHeight,
          position: 'absolute',
        })
        $('#app').prepend($('#bilibili-player.mode-webscreen'))
        $('#playerWrap').css('display', 'none')
        logger.info('网页全屏解锁｜成功')
        setValue('current_screen_mode', 'web')
        this.insertGoToCommentsButton()
        // 退出网页全屏
        $('.bpx-player-ctrl-btn-icon.bpx-player-ctrl-web-leave').click(function () {
          resetPlayerLayout()
        })
        // 再次进入网页全屏
        $('.bpx-player-ctrl-btn-icon.bpx-player-ctrl-web-enter').click(function () {
          $('body').css({
            'padding-top': clientHeight,
            position: 'unset',
          })
          $('#bilibili-player').css({
            height: clientHeight,
            position: 'absolute',
          })
          $('#app').prepend($('#bilibili-player'))
          $('#playerWrap').css('display', 'none')
          $('.float-nav-exp .mini').css('display', 'none')
          $('html,body').scrollTop(0)
        })
        // 进入退出全屏
        $('.bpx-player-ctrl-btn.bpx-player-ctrl-full').click(function () {
          resetPlayerLayout()
        })
        // 进入宽屏
        $('.bpx-player-ctrl-btn-icon.bpx-player-ctrl-wide-enter').click(function () {
          resetPlayerLayout()
        })
      }
    },
    // 插入跳转评论按钮
    insertGoToCommentsButton () {
      insertGoToCommentsButtonTimes++
      if (player_type === 'video' && webfull_unlock && insertGoToCommentsButtonTimes === 1) {
        const goToCommentsBtnHtml = '<div class="bpx-player-ctrl-btn bpx-player-ctrl-comment" role="button" aria-label="前往评论" tabindex="0"><div id="goToComments" class="bpx-player-ctrl-btn-icon"><span class="bpx-common-svg-icon"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="88" height="88" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><path d="M512 85.333c235.637 0 426.667 191.03 426.667 426.667S747.637 938.667 512 938.667a424.779 424.779 0 0 1-219.125-60.502A2786.56 2786.56 0 0 0 272.82 866.4l-104.405 28.48c-23.893 6.507-45.803-15.413-39.285-39.296l28.437-104.288c-11.008-18.688-18.219-31.221-21.803-37.91A424.885 424.885 0 0 1 85.333 512c0-235.637 191.03-426.667 426.667-426.667zm-102.219 549.76a32 32 0 1 0-40.917 49.216A223.179 223.179 0 0 0 512 736c52.97 0 103.19-18.485 143.104-51.67a32 32 0 1 0-40.907-49.215A159.19 159.19 0 0 1 512 672a159.19 159.19 0 0 1-102.219-36.907z" fill="#currentColor"/></svg></span></div></div>'
        $('.bpx-player-control-bottom-right').append(goToCommentsBtnHtml)
        $('#goToComments').on('click', function (event) {
          event.stopPropagation()
          $('body,html').scrollTop($('#comment').offset().top - 10)
          logger.info('到达评论区')
        })
      }
    },
    // 添加返回播放器按钮
    async insertBackToPlayerButton () {
      const playerDataScreen = await this.getCurrentScreenMode()
      if (player_type === 'video') {
        const locateButtonHtml = '<div class="fixed-sidenav-storage-item locate" title="定位至播放器">\n<svg t="1643419779790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" width="200" height="200" style="width: 50%;height: 100%;fill: currentColor;"><path d="M512 352c-88.008 0-160.002 72-160.002 160 0 88.008 71.994 160 160.002 160 88.01 0 159.998-71.992 159.998-160 0-88-71.988-160-159.998-160z m381.876 117.334c-19.21-177.062-162.148-320-339.21-339.198V64h-85.332v66.134c-177.062 19.198-320 162.136-339.208 339.198H64v85.334h66.124c19.208 177.062 162.144 320 339.208 339.208V960h85.332v-66.124c177.062-19.208 320-162.146 339.21-339.208H960v-85.334h-66.124zM512 810.666c-164.274 0-298.668-134.396-298.668-298.666 0-164.272 134.394-298.666 298.668-298.666 164.27 0 298.664 134.396 298.664 298.666S676.27 810.666 512 810.666z" p-id="1776"></path></svg></div>'
        const floatNav = $('.fixed-sidenav-storage .back-to-top-wrap')
        // $('.fixed-sidenav-storage').css('bottom', '274px')
        const dataV = floatNav[0].attributes[1].name
        const locateButtonHtmlDataV = locateButtonHtml.replace('title="定位至播放器"', `title="定位至播放器" ${dataV}`)
        floatNav.prepend(locateButtonHtmlDataV)
        const locateButton = $('.storable-items .fixed-sidenav-storage-item.locate')
        locateButton.not(':first-child').remove()
        floatNav.on('click', '.locate', function () {
          $('html,body').scrollTop(playerDataScreen !== 'web' ? player_offset_top - offset_top : 0)
        })
      }
      if (player_type === 'bangumi') {
        const floatNav = $('[class*="navTools_floatNavExp"] [class*="navTools_navMenu"]')
        const floatNavMenuItemClass = floatNav.children('a').children('div').attr('class').split(' ')[0]
        const locateButtonHtml = `<div class="${floatNavMenuItemClass} locate" style="height:40px;padding:0" title="定位至播放器">\n<svg t="1643419779790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" width="200" height="200" style="width: 50%;height: 100%;fill: currentColor;"><path d="M512 352c-88.008 0-160.002 72-160.002 160 0 88.008 71.994 160 160.002 160 88.01 0 159.998-71.992 159.998-160 0-88-71.988-160-159.998-160z m381.876 117.334c-19.21-177.062-162.148-320-339.21-339.198V64h-85.332v66.134c-177.062 19.198-320 162.136-339.208 339.198H64v85.334h66.124c19.208 177.062 162.144 320 339.208 339.208V960h85.332v-66.124c177.062-19.208 320-162.146 339.21-339.208H960v-85.334h-66.124zM512 810.666c-164.274 0-298.668-134.396-298.668-298.666 0-164.272 134.394-298.666 298.668-298.666 164.27 0 298.664 134.396 298.664 298.666S676.27 810.666 512 810.666z" p-id="1776"></path></svg></div>`
        floatNav.prepend(locateButtonHtml)
        const locateButton = $(`${floatNavMenuItemClass}.locate`)
        locateButton.not(':first-child').remove()
        floatNav.on('click', '.locate', function () {
          $('html,body').scrollTop(playerDataScreen !== 'web' ? player_offset_top - offset_top : 0)
        })
      }
    },
    // 自动定位至播放器
    autoLocation () {
      const $player = $('#bilibili-player')
      const player_offset_top = Math.trunc($player.offset().top)
      setValue('player_offset_top', player_offset_top)
      return new Promise(resolve => {
        const isAutoLocate = auto_locate && ((!auto_locate_video && !auto_locate_bangumi) || (auto_locate_video && player_type === 'video') || (auto_locate_bangumi && player_type === 'bangumi'))

        if (!isAutoLocate || getValue('selected_screen_mode') === 'web') {
          resolve(false)
          // 未开启功能或模式为网页全屏时直接返回，防止代码继续执行进入死循环
          return
        }
        scrollToPlayer(player_offset_top - offset_top)
        const applyAutoLocationInterval = setInterval(() => {
          scrollToPlayer(player_offset_top - offset_top)
          logger.warn(`自动定位失败，继续尝试
                    -----------------
                    当前文档顶部偏移量：${Math.trunc($(document).scrollTop())}
                    期望文档顶部偏移量：${player_offset_top - offset_top}
                    偏移量误差：${(player_offset_top - offset_top) - Math.trunc($(document).scrollTop())}
                    播放器顶部偏移量：${player_offset_top}
                    设置偏移量：${offset_top}`)
        }, 200)
        const checkAutoLocationStatus = setInterval(() => {
          const document_scroll_top = Math.trunc($(document).scrollTop())
          const expect_offset_top = player_offset_top - offset_top
          const offset_deviation = Math.abs(expect_offset_top - document_scroll_top)
          const success = true ? offset_deviation < 5 : false
          if (success) {
            clearInterval(checkAutoLocationStatus)
            clearInterval(applyAutoLocationInterval)
            // logger.info(offset_deviation);
            resolve(true)
          }
        }, 100)
      })
    },
    // 点击播放器自动定位至播放器
    async clickPlayerAutoLocation () {
      if (click_player_auto_locate) {
        const $player = $('#bilibili-player')
        const player_offset_top = Math.trunc($player.offset().top)
        $('#bilibili-player').on('click', handleClick)
        function handleClick (event) {
          event.stopPropagation()
          // logger.info(`1:${player_offset_top}, 2:${offset_top}, 3:${player_offset_top - offset_top}`)
          scrollToPlayer(player_offset_top - offset_top)
        }
      }
    },
    // 点击时间锚点自动返回播放器
    async jumpVideoTime () {
      const clickTarget = player_type === 'video' ? '#comment' : '#comment_module'
      const $clickTarget = $(clickTarget)
      scrollToPlayer(player_offset_top - offset_top)
      $clickTarget.unbind('click').on('click', '.video-time,.video-seek', function (event) {
        event.stopPropagation()
        $('html,body').scrollTop(scrollTop)
        const targetTime = $(this).attr(player_type === 'video' ? 'data-video-time' : 'data-time')
        const video = $('bwp-video')
        video.currentTime = targetTime
        video.play()
      })
    },
    // 自动取消静音
    autoCancelMute () {
      autoCancelMuteTimes++
      const cancelMuteButtn = $('.bpx-player-ctrl-muted-icon')
      const cancelMuteButtnDisplay = cancelMuteButtn.css('display')
      const cancelMuteButtnClass = cancelMuteButtn.attr('class')
      if (autoCancelMuteTimes === 1) {
        if (cancelMuteButtnDisplay === 'block') {
          cancelMuteButtn.click()
          logger.info('已自动取消静音')
        }
      }
    },
    // 自动选择最高画质
    autoSelectVideoHighestQuality () {
      autoSelectVideoHighestQualityTimes++
      if (!auto_select_video_highest_quality) return
      if (autoSelectVideoHighestQualityTimes === 1) {
        let message
        const no4K8K = $('.bpx-player-ctrl-quality ul > li').filter(function () {
          const qualityText = $(this).children('span.bpx-player-ctrl-quality-text').text()
          return (!qualityText.includes('4K') && !qualityText.includes('8K'))
        }).eq(0)
        const yes8K = $('.bpx-player-ctrl-quality ul > li').filter(function () {
          return $(this).children('span.bpx-player-ctrl-quality-text').text().includes('8K')
        }).eq(0)
        const yes4K = $('.bpx-player-ctrl-quality ul > li').filter(function () {
          return $(this).children('span.bpx-player-ctrl-quality-text').text().includes('4K')
        }).eq(0)
        const notVip = $('.bpx-player-ctrl-quality ul > li').eq($('.bpx-player-ctrl-quality ul > li').children('.bpx-player-ctrl-quality-badge-bigvip').length)
        function autoSelectTargetQuality (target) {
          target.length ? target.click() : logger.error('最高画质丨切换失败丨未找到清晰度切换元素')
        }
        if (is_vip) {
          if (!contain_quality_4k && !contain_quality_8k) {
            autoSelectTargetQuality(no4K8K)
            message = '最高画质｜VIP｜不包含4K及8K｜切换成功'
          }
          if (contain_quality_4k && !contain_quality_8k) {
            yes4K.length ? autoSelectTargetQuality(yes4K) : autoSelectTargetQuality(no4K8K)
            message = '最高画质｜VIP｜4K｜切换成功'
          }
          if ((contain_quality_4k && contain_quality_8k) || (!contain_quality_4k && contain_quality_8k)) {
            yes8K.length ? autoSelectTargetQuality(yes8K) : autoSelectTargetQuality(no4K8K)
            message = '最高画质｜VIP｜8K｜切换成功'
          }
        } else {
          autoSelectTargetQuality(notVip)
          message = '最高画质｜非VIP｜切换成功'
        }
        logger.info(message)
      }
    },
    // 添加样式文件
    addPluginStyle () {
      const style = `
        #playerAdjustment {
          height: 500px;
          overflow: auto;
          overscroll-behavior: contain;
          padding-right: 10px;
        }
        .swal2-popup {
          width: 34em !important;
          padding: 1.25em !important;
        }
        .swal2-html-container {
          margin: 0 !important;
          padding: 16px 5px 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        .swal2-footer {
          flex-direction: column !important;
        }
        .swal2-close {
          top: 5px !important;
          right: 3px !important;
        }
        .swal2-actions {
          margin: 7px auto 0 !important;
        }
        .swal2-styled.swal2-confirm {
          background-color: #23ade5 !important;
        }
        .swal2-icon.swal2-info.swal2-icon-show {
          display: none !important;
        }
        .player-adjustment-container, .swal2-container {
          z-index: 999999999 !important;
        }
        .player-adjustment-popup {
          font-size: 14px !important;
        }
        .player-adjustment-setting-label {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding-top: 10px !important;
        }
        .player-adjustment-setting-checkbox {
          width: 16px !important;
          height: 16px !important;
        }
        .player-adjustment-setting-tips {
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          padding: 5px !important;
          margin-top: 10px !important;
          background: #f5f5f5 !important;
          box-sizing: border-box !important;
          font-size: 14px !important;
          color: #666 !important;
          border-radius: 2px !important;
          text-align: left !important;
        }
        .player-adjustment-setting-tips svg {
          margin-right: 5px !important;
        }
        label.player-adjustment-setting-label input {
          border: 1px solid #cecece !important;
          background: #fff !important;
        }
        label.player-adjustment-setting-label input[type=checkbox],
        label.player-adjustment-setting-label input[type=radio] {
          width: 16px !important;
          height: 16px !important;
        }
        label.player-adjustment-setting-label input:checked {
          border-color: #1986b3 !important;
          background: #23ade5 !important;
        }
        .auto-quality-sub-options,
        .auto-locate-sub-options {
          display: flex;
          align-items: center;
          padding-left: 15px;
        }
        .auto-quality-sub-options label.player-adjustment-setting-label.fourK,
        .auto-locate-sub-options label.player-adjustment-setting-label.video {
          margin-right: 10px;
        }
        .auto-quality-sub-options .player-adjustment-setting-label input[type="checkbox"] {
          margin-left: 5px !important;
        }
        .player-adjustment-setting-label.screen-mod input {
          margin-right: 5px !important;
        }
        #biliMainHeader {
          height:64px!important;
        }
        #viewbox_report {
          height:106px!important;
          padding-top:24px!important;
        }
        #v_upinfo {
          height:80px!important;
        }
        .members-info-v1 {
          padding-top:0!important;
        }
        .members-info-v1 .wide-members-header {
          height:0!important;
        }
        .members-info-v1 .wide-members-container .up-card .info-tag {
          display:none!important;
        }
        .membersinfo-wide {
          margin-top: -35px!important;
        }
        .fixed-sidenav-storage-item.locate {
          width:40px!important;
          height:40px!important;
        }
        .fixed-header .bili-header__bar{
          position: absolute!important;
          inset-inline: 0!important;
        }
      `
      const addStyleToHead = () => {
        addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'))
        addStyle('player-adjustment-style', 'style', style)
      }
      if (document.head) {
        addStyleToHead()
      } else {
        const headObserver = new MutationObserver(() => {
          if (document.head) {
            headObserver.disconnect()
            addStyleToHead()
          }
        })
        headObserver.observe(document.documentElement, {
          childList: true,
          subtree: true,
        })
      }
    },
    // 注册脚本设置控件
    registerMenuCommand () {
      GM_registerMenuCommand('设置', () => {
        const html = `
                <div id="playerAdjustment" style="font-size: 1em;">
                  <label class="player-adjustment-setting-label" style="padding-top:0!important;"> 是否为大会员
                    <input type="checkbox" id="Is-Vip" ${getValue('is_vip') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                  </label>
                  <span class="player-adjustment-setting-tips"> -> 请如实勾选，否则影响自动选择清晰度</span>
                  <label class="player-adjustment-setting-label"> 自动定位至播放器
                    <input type="checkbox" id="Auto-Locate" ${getValue('auto_locate') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                  </label>
                  <div class="auto-locate-sub-options">
                    <label class="player-adjustment-setting-label video"> 普通视频(video)
                      <input type="checkbox" id="Auto-Locate-Video" ${getValue('auto_locate_video') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                    </label>
                    <label class="player-adjustment-setting-label bangumi"> 其他视频(bangumi)
                      <input type="checkbox" id="Auto-Locate-Bangumi" ${getValue('auto_locate_bangumi') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                    </label>
                  </div>
                  <span class="player-adjustment-setting-tips"> -> 只有勾选自动定位至播放器，才会执行自动定位的功能；勾选自动定位至播放器后，video 和 bangumi 两者全选或全不选，默认在这两种类型视频播放页都执行；否则勾选哪种类型，就只在这种类型的播放页才执行。</span>
                  <label class="player-adjustment-setting-label" id="player-adjustment-Range-Wrapper">
                    <span>播放器顶部偏移(px)</span>
                    <input id="Top-Offset" value="${getValue(
            'offset_top'
          )}" style="padding:5px;width: 200px;border: 1px solid #cecece;">
                  </label>
                  <span class="player-adjustment-setting-tips"> -> 播放器距离浏览器窗口默认距离为 ${Math.trunc(
            $('#bilibili-player').offset().top
          )}；请填写小于 ${Math.trunc(
            $('#bilibili-player').offset().top
          )} 的正整数或 0；当值为 0 时，播放器上沿将紧贴浏览器窗口上沿、值为 ${Math.trunc(
            $('#bilibili-player').offset().top
          )} 时，将保持B站默认。 </span>
                  <label class="player-adjustment-setting-label"> 点击播放器时定位
                    <input type="checkbox" id="Click-Player-Auto-Location" ${getValue('click_player_auto_locate') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                  </label>
                  <div class="player-adjustment-setting-label screen-mod" style="display: flex;align-items: center;justify-content: space-between;"> 播放器默认模式 <div style="width: 215px;display: flex;align-items: center;justify-content: space-between;">
                      <label class="player-adjustment-setting-label" style="padding-top:0!important;">
                        <input type="radio" name="Screen-Mod" value="close" ${getValue('selected_screen_mode') === 'close'
            ? 'checked'
            : ''
          }>关闭</label>
                      <label class="player-adjustment-setting-label" style="padding-top:0!important;">
                        <input type="radio" name="Screen-Mod" value="wide" ${getValue('selected_screen_mode') === 'wide'
            ? 'checked'
            : ''
          }>宽屏</label>
                      <label class="player-adjustment-setting-label" style="padding-top:0!important;">
                        <input type="radio" name="Screen-Mod" value="web" ${getValue('selected_screen_mode') === 'web'
            ? 'checked'
            : ''
          }>网页全屏</label>
                    </div>
                  </div>
                  <span class="player-adjustment-setting-tips"> -> 若遇到不能自动选择播放器模式可尝试点击重置</span>
                  <label class="player-adjustment-setting-label"> 网页全屏模式解锁
                    <input type="checkbox" id="Webfull-Unlock" ${getValue('webfull_unlock') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                  </label>
                  <span class="player-adjustment-setting-tips"> ->*实验性功能(不稳，可能会有这样或那样的问题)：勾选后网页全屏模式下可以滑动滚动条查看下方评论等内容，2秒延迟后解锁（番剧播放页不支持）<br>->新增迷你播放器显示，不过比较简陋，只支持暂停/播放操作，有条件的建议还是直接使用浏览器自带的小窗播放功能。</span>
                  <label class="player-adjustment-setting-label"> 自动选择最高画质
                    <input type="checkbox" id="Auto-Quality" ${getValue('auto_select_video_highest_quality')
            ? 'checked'
            : ''
          } class="player-adjustment-setting-checkbox">
                  </label>
                  <div class="auto-quality-sub-options">
                    <label class="player-adjustment-setting-label fourK"> 是否包含4K画质
                      <input type="checkbox" id="Quality-4K" ${getValue('contain_quality_4k') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                    </label>
                    <label class="player-adjustment-setting-label eightK"> 是否包含8K画质
                      <input type="checkbox" id="Quality-8K" ${getValue('contain_quality_8k') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                    </label>
                  </div>
                  <span class="player-adjustment-setting-tips"> -> 网络条件好时可以启用此项，勾哪项选哪项，都勾选8k，否则选择4k及8k外最高画质。</span>
                  <label class="player-adjustment-setting-label"> 自动刷新
                  <input type="checkbox" id="Auto-Reload" ${getValue('auto_reload') ? 'checked' : ''
          } class="player-adjustment-setting-checkbox">
                </label>
                <span class="player-adjustment-setting-tips"> -> （不建议开启）若脚本执行失败是否自动刷新页面重试，开启后可能会对使用体验起到一定改善作用，但若是因为B站页面改版导致脚本失效，则会陷入页面无限刷新的情况，此时则必须在页面加载时看准时机关闭此项才能恢复正常，请自行选择是否开启。</span>
                </div>
                `
        Swal.fire({
          title: '播放页调整设置',
          html: html,
          icon: 'info',
          showCloseButton: true,
          showDenyButton: true,
          confirmButtonText: '保存',
          denyButtonText: '重置',
          footer: '<div style="text-align: center;">如果发现脚本不能用，可能是播放页更新了，请耐心等待适配。</div><hr style="border: none;height: 1px;margin: 12px 0;background: #eaeaea;"><div style="text-align: center;font-size: 1.25em;"><a href="//userstyles.world/style/241/nightmode-for-bilibili-com" target="_blank">夜间哔哩 - </a><a href="//greasyfork.org/zh-CN/scripts/415804-bilibili%E6%92%AD%E6%94%BE%E9%A1%B5%E8%B0%83%E6%95%B4-%E8%87%AA%E7%94%A8" target="_blank">检查更新</a></div>',
        }).then(res => {
          res.isConfirmed && location.reload(true)
          if (res.isConfirmed) {
            location.reload(true)
          } else if (res.isDenied) {
            setValue('current_screen_mode', 'normal')
            location.reload(true)
          }
        })
        $('#Is-Vip').change(e => {
          setValue('is_vip', e.target.checked)
          $('.fourK,.eightK').css('display', e.target.checked ? 'flex!important' : 'none!important')
        })
        $('#Auto-Locate').change(e => {
          setValue('auto_locate', e.target.checked)
        })
        $('#Auto-Locate-Video').change(e => {
          setValue('auto_locate_video', e.target.checked)
        })
        $('#Auto-Locate-Bangumi').change(e => {
          setValue('auto_locate_bangumi', e.target.checked)
        })
        $('#Top-Offset').change(e => {
          setValue('offset_top', e.target.value * 1)
        })
        $('#Click-Player-Auto-Location').change(e => {
          setValue('click_player_auto_locate', e.target.checked)
        })
        $('#Auto-Quality').change(e => {
          setValue('auto_select_video_highest_quality', e.target.checked)
        })
        $('#Quality-4K').change(e => {
          setValue('contain_quality_4k', e.target.checked)
        })
        $('#Quality-8K').change(e => {
          setValue('contain_quality_8k', e.target.checked)
        })
        $('input[name="Screen-Mod"]').click(function () {
          setValue('selected_screen_mode', $(this).val())
        })
        $('#Webfull-Unlock').change(e => {
          setValue('webfull_unlock', e.target.checked)
        })
        $('#Auto-Reload').change(e => {
          setValue('auto_reload', e.target.checked)
        })
      })
    },
    // 冻结视频标题及UP主信息样式
    freezeHeaderAndVideoTitleStyles () {
      $('#biliMainHeader').attr('style', 'height:64px!important')
      $('#viewbox_report').attr('style', 'height:106px!important;padding-top:24px!important')
      $('#v_upinfo').attr('style', 'height:80px!important')
      $('.members-info-v1').attr('style', 'padding-top:0!important')
      $('.members-info-v1 .wide-members-header').attr('style', 'height:0!important')
      $('.members-info-v1 .wide-members-container .up-card .info-tag').attr('style', 'display:none!important')
    },
    // 判断当前窗口是否在最上方
    isTopWindow () {
      return window.self === window.top
    },
    // 前期准备函数
    thePrepFunction () {
      thePrepFunctionRunningTimes++
      if (thePrepFunctionRunningTimes === 1) {
        isLogin()
        checkBrowserHistory()
        historyListener()
        this.initValue()
        this.addPluginStyle()
        this.isTopWindow() && this.registerMenuCommand()
        this.getCurrentPlayerType()
        this.getCurrentScreenMode()
      }
    },
    // 主函数
    async theMainFunction () {
      try {
        theMainFunctionRunningTimes++
        if (theMainFunctionRunningTimes === 1) {
          const videoPlayerExists = await checkElementExistence('#bilibili-player video', 5, 100) || await checkElementExistence('bwp-video', 5, 100)
          if (videoPlayerExists) {
            logger.info('播放器｜存在')
            $('body').css('overflow', 'hidden')
            const isPlayable = await this.checkVideoCanPlayThrough()
            // console.time('播放页调整：判断按钮出现')
            const screenModeBtnExists = await checkElementExistence('#bilibili-player .bpx-player-ctrl-btn', 100, 100)
            // console.timeEnd('播放页调整：判断按钮出现')
            // const pageComplete = await checkPageReadyState('complete')
            if (isPlayable || (!isPlayable && screenModeBtnExists)) {
              logger.info('视频资源｜可以播放')
              // console.time('播放页调整：切换模式耗时')
              this.watchScreenModeChange()
              await sleep(100)
              // close 为功能关闭，勿改
              const selectedScreenMode = selected_screen_mode !== 'close' ? await this.autoSelectScreenMode() : 'close'
              // console.timeEnd('播放页调整：切换模式耗时')
              if (selectedScreenMode && selectedScreenMode.done || selectedScreenMode === 'close') {
                if (selectedScreenMode !== 'close') logger.info(`屏幕模式｜${selectedScreenMode['mode'].toUpperCase()}｜切换成功`)
                this.autoCancelMute()
                // console.time('播放页调整：选择画质耗时')
                this.autoSelectVideoHighestQuality()
                // console.timeEnd('播放页调整：选择画质耗时')
                this.clickPlayerAutoLocation()
                if (webfull_unlock && selectedScreenMode.mode === 'web') {
                  this.fixedWebfullUnlockStyle()
                }
                // console.time('播放页调整：自动定位耗时')
                this.freezeHeaderAndVideoTitleStyles()
                await sleep(500)
                const autoLocationDone = await this.autoLocation()
                // console.timeEnd('播放页调整：自动定位耗时')
                if (auto_locate && autoLocationDone) {
                  $('body').css('overflow', 'auto')
                  logger.info('自动定位｜成功')
                  await sleep(100)
                  this.insertBackToPlayerButton()
                  this.jumpVideoTime()
                }
                if (!auto_locate || (auto_locate && auto_locate_bangumi && !auto_locate_video && player_type === 'video') || (auto_locate && auto_locate_video && !auto_locate_bangumi && player_type === 'bangumi')) {
                  $('body').css('overflow', 'auto')
                  logger.info('自动定位｜未开启')
                }
                if (player_type === 'video') {
                  const loaded = await checkElementExistence('#comment > .comment > .bili-comment', 10, 100)
                  await sleep(100)
                  if (loaded) {
                    logger.info('页面加载｜完毕')
                  } else {
                    pageReload()
                  }
                }
              } else {
                logger.error(`屏幕模式｜切换失败｜autoSelectScreenMode()`)
                pageReload()
              }
            } else {
              logger.error('视频资源｜加载失败')
              pageReload()
            }
          } else {
            logger.error('播放器｜不存在')
            pageReload()
          }
        }
      } catch (error) {
        logger.error(error)
        pageReload()
      }
    },
  }
  if (isLogin()) {
    m.thePrepFunction()
    const checkDocumentHidden = setInterval(() => {
      const dicumentHidden = isDocumentHidden()
      if (!dicumentHidden) {
        logger.info('当前标签｜已激活｜开始应用配置')
        clearInterval(checkDocumentHidden)
        m.theMainFunction()
      } else {
        logger.info('当前标签｜未激活｜等待激活')
      }
    }, 100)
  } else logger.warn('请登录｜本脚本只能在登录状态下使用')
})
