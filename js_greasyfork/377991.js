// ==UserScript==
// @name         LinkedIn Learning 字幕中文翻译
// @description  LinkedIn Learning 字幕中文翻译脚本
// @namespace    https://github.com/journey-ad
// @version      0.2.1
// @icon         https://static.licdn.cn/sc/h/2c0s1jfqrqv9hg4v0a7zm89oa
// @author       journey-ad
// @match        *://www.linkedin.com/learning/*
// @require      https://greasyfork.org/scripts/411512-gm-createmenu/code/GM_createMenu.js?version=864854
// @require      https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js
// @license      MIT
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377991/LinkedIn%20Learning%20%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/377991/LinkedIn%20Learning%20%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
const __SCRIPT_NAME = 'LinkedIn Learning 字幕翻译'
const __SCRIPT_VER = '0.2.1'
const logcat = {
  log: createDebugMethod('log'),
  info: createDebugMethod('info'),
  debug: createDebugMethod('debug'),
  warn: createDebugMethod('warn'),
  error: createDebugMethod('error')
}

function createDebugMethod(name) {
  const bgColorMap = {
    debug: '#0070BB',
    info: '#009966',
    warn: '#BBBB23',
    error: '#bc0004'
  }
  name = bgColorMap[name] ? name : 'info'
  return function () {
    const args = Array.from(arguments)
    args.unshift(`color: white; background-color: ${bgColorMap[name] || '#FFFFFF'};`)
    args.unshift(`【${__SCRIPT_NAME} v${__SCRIPT_VER}】 %c[${name.toUpperCase()}]:`)
    console[name].apply(console, args)
  }
}

(function () {
  'use strict'
  logcat.info('已加载')

  let transPlat = 'caiyun' // caiyun | google

  let sourceSub = null // 原始字幕数组
  let __PLAYER_ = null // 播放器实例
  let __CUES = null // 原始字幕对象

  let ts = Date.now()
  let transTimer = window.setInterval(init, 100) // 用定时器检查播放器是否加载完毕

  addCustomStyle()
  addMenu()

  // hook history.pushState 监测路由变化
  !(function (history) {
    const pushState = history.pushState;
    history.pushState = function (state) {
      logcat.debug('页面路由变更')
      // 路由变化后重新初始化
      ts = Date.now()
      window.clearInterval(transTimer)
      transTimer = window.setInterval(init, 100)

      return pushState.apply(history, arguments);
    };
  })(window.history)

  function init() {
    if (Date.now() - ts >= 20 * 1000) {
      window.clearInterval(transTimer) // 清除定时器
      logcat.error('播放器检测超时，当前页可能非播放页')
    }

    const coursePage = document.querySelector('.classroom-body')
    const quiz = document.querySelector('.classroom-quiz')

    // 处理课程小节测验的情况
    if (coursePage && quiz) {
      coursePage.hasBeenInject = false
    }

    __PLAYER_ = document.querySelector('.media-player__player')?.player

    const __textTracks_ = __PLAYER_?.textTracks_

    if (__textTracks_) {
      window.clearInterval(transTimer)

      logcat.debug('播放器加载完毕')
      handleHookPlayer()
    } else {
      return
    }

    function handleHookPlayer() {
      if (coursePage.hasBeenInject) return

      coursePage.hasBeenInject = true // 标记当前页面已注入

      // 字幕添加后
      __textTracks_.on('addtrackcomplete', () => {
        handleHookWebtt()
      })
    }

    function handleHookWebtt() {
      // 字幕开关按钮
      const { captionsMenuToggle } = __PLAYER_.controlBar
      const isEnable = captionsMenuToggle.items[0].isSelected_

      if (!isEnable) {
        logcat.warn('未打开字幕开关')

        // captionsToggle.one('activate', () => {
        // logcat.info('打开字幕开关')
        //handleHookWebtt()
        // })

        return
      }

      let zhTrackItem = __PLAYER_.tech_.remoteTextTracks().tracks_.find(_ => _.language === 'zh-cn-addon')

      // 初次注入字幕语言选单
      if (!zhTrackItem) {
        logcat.debug('字幕轨道加载完毕')

        // 添加中文字幕轨道
        const zhTrack = __PLAYER_.tech_.createRemoteTextTrack({ kind: 'captions', label: '中文(自动翻译)', srclang: 'zh-cn-addon' })
        __PLAYER_.tech_.remoteTextTrackEls().addTrackElement_(zhTrack)
        __PLAYER_.tech_.remoteTextTracks().addTrack(zhTrack.track)
      }

      const tracks = __PLAYER_.tech_.remoteTextTracks()
      zhTrackItem = tracks.tracks_.find(_ => _.language === 'zh-cn-addon')

      // 从英文字幕轨道克隆一份作为中文字幕轨道
      zhTrackItem.cues_ = clone(tracks.tracks_[0].cues_)
      zhTrackItem.cues.setCues_(zhTrackItem.cues_)

      __CUES = zhTrackItem.cues_

      if (__CUES.length === 0) {
        // 字幕轨道为空，100ms后重试
        setTimeout(handleHookWebtt, 100)
        return
      }

      // 防止重复翻译
      if (zhTrackItem.hasBeenTranslate) return
      zhTrackItem.hasBeenTranslate = true

      // 字幕开启时暂停播放等待翻译
      if (isEnable) __PLAYER_.pause()

      // 取到原始字幕数组
      sourceSub = __CUES.map(_ => _.text)

      // 执行翻译操作
      __CUES[0].text = `[等待翻译文本]\n${__CUES[0].text}`
      // 重置字幕显示状态
      captionsMenuToggle.items[0].el_.click()
      captionsMenuToggle.items.find(_ => _.track.language === 'zh-cn-addon').el_.click()
      transText((text) => {
        logcat.info('字幕翻译完毕')
        console.groupCollapsed('中文字幕文本')
        console.info(text)
        console.groupEnd()

        __CUES[0].text = __CUES[0].text.replace(/\[等待翻译文本\]\n/, '')
        // if (captionsMenuToggle.items[0].isSelected_) {
        // 恢复播放
        if (isEnable) __PLAYER_.play()

        // 重置字幕显示状态
        captionsMenuToggle.items[0].el_.click()
        captionsMenuToggle.items.find(_ => _.track.language === 'zh-cn-addon').el_.click()
        // }
      })
    }
  }

  // 添加一些自定义样式
  function addCustomStyle() {
    const css = `
    .classroom-layout__stage--hide-controls .vjs-text-track-display {
      bottom: 18px !important;
    }
    .vjs-text-track-display>div>div {
      font-size: 1.6rem !important;
      font-size: clamp(1.4rem, 2.2vmin, 2.4rem) !important;
      line-height: 1.4 !important;
      white-space: pre-wrap !important;
      padding: 6px 20px !important;
    }
    .vjs-text-track-display>div>div>div {
      max-width: 66ch !important;
    }
    `
    addStyle(css)
  }

  function addMenu() {
    GM_createMenu.add({
      on: {
        default: true,
        name: "点击切换翻译来源 (当前: 彩云)",
        callback: function () {
          transPlat = 'google'
          alert("翻译来源已切换到Google")
        }
      },
      off: {
        name: "点击切换翻译来源 (当前: Google)",
        callback: function () {
          transPlat = 'caiyun'
          alert("翻译来源已切换到彩云")
        }
      }
    });
    GM_createMenu.create({ storage: true });

    transPlat = GM_createMenu.list[0].curr === 'on' ? 'caiyun' : 'google'
  }

  // 替换原始字幕实现
  function transText(cb) {
    let source = '',
      result = '',
      chunkArr = [],
      chunkSize = 0,
      count = 0

    // 去除每条字幕的换行符并按行排列
    sourceSub.forEach((e) => source += e.replace(/\r?\n|\r/g, ' ') + '\n')

    // 字符过长会提交失败，进行分块翻译
    // 返回分块大小，在回调中拼接 TODO: 优化为promise
    chunkSize = chunkTrans(source, (data, index) => {
      count++
      chunkArr[index] = data // 按分块原始下标放回数组

      // 所有翻译文本已取回
      if (count >= chunkSize) {
        result = chunkArr.join('\n') // 拼接分块翻译结果
        const subtitleTrans = result.split('\n') // 分割每条字幕

        // 按上中下英文混排，直接修改到原始字幕对象中
        subtitleTrans.forEach((item, idx) => {
          const el = __CUES[idx]
          el.text = `${item}\n${el.text}`
        })

        cb && cb(result)
      }
    })
  }

  // 分块翻译
  function chunkTrans(str, callback) {
    let textArr = [],
      count = 1

    //大于5000字符分块翻译
    if (str.length > 5000) {
      let strArr = str.split('\n'),
        i = 0

      strArr.forEach(str => {
        textArr[i] = textArr[i] || ''

        // 若加上此行后长度超出5000字符则分块
        if ((textArr[i] + str).length > (i + 1) * 5000) {
          i++
          textArr[i] = ''
        }

        textArr[i] += str + '\n'
      })

      count = i + 1 // 记录块的数量

    } else {
      textArr[0] = str
    }

    // 遍历每块分别进行翻译
    textArr.forEach(function (text, index) {
      doTrans({
        transPlat,
        text: text.trim(),
        index: index
      }, callback)
    })

    return count // 返回分块数量
  }

  // 彩云翻译实现
  function doTrans(sourceObj, callback) {

    switch (transPlat) {
      // 彩云翻译
      case 'caiyun':
        // 初始化彩云接口后再执行翻译操作
        initCaiyun()
          .then(({ browser_id, jwt }) => {
            const data = {
              source: sourceObj.text.split('\n'), // 按行翻译
              trans_type: 'en2zh',
              request_id: 'web_fanyi',
              media: 'text',
              os_type: 'web',
              dict: false,
              cached: true,
              replaced: true,
              browser_id
            }

            Request('https://api.interpreter.caiyunai.com/v1/translator',
              {
                method: 'POST',
                headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json charset=UTF-8',
                  'X-Authorization': 'token:qgemv4jr1y38jyq6vhvi',
                  'T-Authorization': jwt
                },
                data: JSON.stringify(data),
              })
              .then(function (response) {
                var result = JSON.parse(response.responseText)

                // 加解密逻辑提取自彩云网页版翻译

                // ascii码表
                const __CHAR_MAP_1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                // 凯撒密码码表
                const __CHAR_MAP_2 = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'

                const index = t => __CHAR_MAP_1.indexOf(t) // 遍历密文 返回在字母表中的索引 非字母返回-1

                const encode = e => {
                  return e.split('')
                    .map(t => index(t) > -1 ? __CHAR_MAP_2[index(t)] : t) // 若返回值大于-1 则取密码表对应位数的密值 否则返回其自身 并拼接为新字符串)
                    .join('').replace(/[-_]/g, e => '-' === e ? '+' : '/')
                    .replace(/[^A-Za-z0-9\+\/]/g, '') // 去除非法字符
                }

                const btou = e => {
                  return e.replace(/[À-ß][-¿]|[à-ï][-¿]{2}|[ð-÷][-¿]{3}/g, e => {
                    switch (e.length) {
                      case 4:
                        const t = ((7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3)) - 65536
                        return String.fromCharCode(55296 + (t >>> 10)) + String.fromCharCode(56320 + (1023 & t))

                      case 3:
                        return String.fromCharCode((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2))

                      default:
                        return String.fromCharCode((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1))
                    }
                  })
                }

                const encodeArr = result.target.map(words => {
                  const base64 = encode(words) // '6Vh55c6p' -> '6Iu55p6c'
                  return btou(atob(base64)) // '6Iu55p6c' -> 'è¹æ' -> '苹果'
                })

                callback(encodeArr.join('\n'), sourceObj.index) // 执行回调，在回调中拼接
              })

          })

        break

      // 谷歌翻译
      case 'google':
        Request('https://translate.google.com/translate_a/t',
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json charset=UTF-8',
            },
            params: {
              client: 'dict-chrome-ex',
              sl: 'auto',
              tl: 'zh-CN',
              q: sourceObj.text,
            }
          })
          .then(function (response) {
            const result = JSON.parse(response.responseText)

            callback(result[0], sourceObj.index) // 执行回调，在回调中拼接
          })
        break
    }
  }

  function initCaiyun() {
    const state = {
      browser_id: '',
      jwt: ''
    }

    return new Promise(function (resolve, reject) {
      if (state.browser_id && state.jwt) {
        resolve(state)

      } else {
        Fingerprint2 && Fingerprint2.get({}, function (components) {
          const values = components.map(component => component.value)

          const browser_id = Fingerprint2.x64hash128(values.join(''), 233)

          Request('https://api.interpreter.caiyunai.com/v1/user/jwt/generate',
            {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'content-type': 'application/json charset=UTF-8',
                'X-Authorization': 'token:qgemv4jr1y38jyq6vhvi'
              },
              data: JSON.stringify({
                'browser_id': browser_id
              })
            })
            .then(function (response) {
              const result = JSON.parse(response.responseText)
              resolve({ browser_id, jwt: result.jwt })
            })
            .catch(function (error) {
              reject(error)
            })
        })
      }
    })
  }

  function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [Number, String, Boolean],
      result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
      if (item instanceof type) {
        result = type(item);
      }
    });

    if (typeof result == "undefined") {
      if (Object.prototype.toString.call(item) === "[object Array]") {
        result = [];
        item.forEach(function (child, index, array) {
          result[index] = clone(child);
        });
      } else if (typeof item == "object") {
        // testing that this is DOM
        if (item.nodeType && typeof item.cloneNode == "function") {
          result = item.cloneNode(true);
        } else if (!item.prototype) { // check that this is a literal
          if (item instanceof Date) {
            result = new Date(item);
          } else {
            // it is an object literal
            result = {};
            for (var i in item) {
              result[i] = clone(item[i]);
            }
          }
        } else {
          // depending what you would like here,
          // just keep the reference, or create new object
          if (false && item.constructor) {
            // would not advice to do that, reason? Read below
            result = new item.constructor();
          } else {
            result = item;
          }
        }
      } else {
        result = item;
      }
    }

    return result;
  }

  function addStyle(css) {
    if (typeof GM_addStyle != 'undefined') {
      GM_addStyle(css)
    } else if (typeof PRO_addStyle != 'undefined') {
      PRO_addStyle(css)
    } else {
      var node = document.createElement('style')
      node.type = 'text/css'
      node.appendChild(document.createTextNode(css))
      var heads = document.getElementsByTagName('head')

      if (heads.length > 0) {
        heads[0].appendChild(node)
      } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node)
      }
    }
  }

  function Request(url, opt = {}) {
    const originURL = new URL(url)
    const originParams = originURL.searchParams

    new URLSearchParams(opt.params).forEach((value, key) => originParams.append(key, value))

    const newQS = originParams.toString() !== '' ? `?${originParams.toString()}` : ''
    const newURL = `${originURL.origin}${originURL.pathname}${newQS}`

    Object.assign(opt, {
      url: newURL,
      timeout: 20000,
      responseType: 'json'
    })

    return new Promise((resolve, reject) => {
      opt.onerror = opt.ontimeout = reject
      opt.onload = resolve

      GM_xmlhttpRequest(opt)
    })
  }
})()
