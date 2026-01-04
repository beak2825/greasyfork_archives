// ==UserScript==
// @name               Xueersi Aurora
// @name:zh-CN         学而思极光
// @namespace          XueersiAurora
// @version            1.0.3
// @description        Xueersi enhancement | For the old days of Xueersi.
// @description:zh-CN  学而思增强工具 | 谨以此献给学而思最好的那段时光, 以及我们失去的一切。
// @license            AGPL-3.0-only
// @author             FurryR
// @match              https://code.xueersi.com/*
// @icon               https://static0.xesimg.com/platform-fe/website/home/favicon.ico
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/502832/Xueersi%20Aurora.user.js
// @updateURL https://update.greasyfork.org/scripts/502832/Xueersi%20Aurora.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  /**
   * @typedef {{ new(tag?: string, data?: object, children?: object[], text?: string, elm?: unknown, context?: unknown, componentOptions?: object, asyncFactory?: Function): object }} VElement
   */

  const logger = Object.assign({}, console)

  if (!window.location.hostname.includes('xueersi.com')) {
    logger.log(`Aurora 将不在 ${window.location.href} 内运行。`)
    return
  }

  if (!console.log.toString().includes('[native code]')) {
    alert(
      '看起来 Xueersi Aurora 加载得太慢了... 别担心，我们可以轻松解决这个问题。\n1. 转到 Tampermonkey 设置。\n2. 将“配置模式”改为“高级”。\n3. 转到“实验”，将“注入模式”改为“即时”。\n4. 刷新页面。\n\n在您进行这些操作前，Xueersi Aurora 的部分或全部功能不会生效。'
    )
  }

  // [审查用]取得直链
  function getScratchlink(id, version, type) {
    let ret = ''
    if (type == 'scratch') {
      ret = `https://code.xueersi.com/scratch/index.html?pid=${id}&version=${version}&env=community`
      if (version == '2.0') {
        if (id.includes('8080')) {
          ret = `http://dev-code.xueersi.com/scratch/index.html?pid=${id}&version=${version}&env=community`
        }
      } else {
        if (id.includes('8080')) {
          ret = `http://dev-code.xueersi.com/scratch3/index.html?pid=${id}&version=${version}&env=community`
        } else {
          ret = `https://code.xueersi.com/scratch3/index.html?pid=${id}&version=${version}&env=community`
        }
      }
    } else if (type == 'cpp' || type == 'webpy' || type == 'python') {
      ret = `https://code.xueersi.com/ide/code/${id}`
    }
    return ret
  }

  // xterm-original from xtermjs.org
  const xterm_theme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selection: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF'
  }

  const CODEFONT_CSS =
    'color: white; font-family: "Jetbrains Mono", "Fira Code", Consolas, "Courier New", monospace'

  /**
   * @template T
   * @template {keyof T} Key
   * @param {T} obj
   * @param {Key} p
   * @param {(fn: T[Key]) => T[Key]} fn
   */
  function patch(obj, p, fn) {
    if (obj[p]) obj[p] = fn(obj[p])
  }
  /**
   * 获得默认配置。
   * @returns 默认配置。
   */
  function default_config() {
    return {
      disabled: [],
      option: {}
    }
  }
  let Aurora_config = default_config()
  class PluginManager {
    /**
     * 获得名为 id 的设置，若找不到则以 value 顶替。
     * @param {id} id 设置 id。
     * @param {any} value 顶替的值。
     * @returns {any} 设置的值。
     */
    get_option_or(id, value) {
      if (Aurora_config.option[id] !== undefined) {
        return Aurora_config.option[id]
      }
      Aurora_config.option[id] = value
      window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
      return value
    }
    /**
     * 重设 ID 为 id 的设置为指定值。
     * @param {string} id 设定 id。
     * @param {any} value 设定的值。
     */
    set_option(id, value) {
      Aurora_config.option[id] = value
      window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
    }
    /**
     * 注册功能。
     * @param {string} id 功能的 ID。
     * @param {string} description 功能的人类可读描述。
     * @param {Function} fn 功能本体函数。
     */
    plug(id, description, fn) {
      this._events[id] = [description, fn]
    }
    /**
     * 完成注册，开始加载 Aurora。
     */
    done() {
      const v = Aurora_config.disabled
      if (!v instanceof Array) {
        logger.error('Aurora 加载失败。请检查配置文件是否设置正确。')
        return
      }
      for (const [key, value] of Object.entries(this._events)) {
        if (!v.includes(key)) {
          if (window === window.top)
            logger.log(`Aurora 正在加载功能 %c${key}%c。`, CODEFONT_CSS, '')
          value[1]()
        }
      }
    }
    constructor() {
      this._events = {}
    }
  }
  class VueElementMixin {
    constructor() {
      this._events = new Map()
    }
    on(tagName, fn) {
      const v = this._events.get(tagName)
      if (v) v.push(fn)
      else this._events.set(tagName, [fn])
    }
    emit(instance) {
      const tag =
        instance.$vnode?.componentOptions?.tag ??
        instance._vnode?.componentOptions?.tag ??
        instance.$vnode?.tag?.split('-')?.at(-1)
      if (this._events.has(tag)) {
        for (const v of this._events.get(tag)) {
          try {
            v(instance)
          } catch (e) {
            logger.error(
              `在为 %c${tag}%c 组件进行补丁时发生了错误。这看起来是一个漏洞，请报告给 Aurora 开发者。`,
              CODEFONT_CSS,
              ''
            )
            logger.error(e)
          }
        }
      }
    }
  }
  const webpackListener = []
  const plug = new PluginManager()
  window.Aurora = {
    /**
     * 获得帮助。
     * @param {string | undefined} 帮助 ID。不填则查看全部。
     */
    help(obj = undefined) {
      if (obj == undefined) {
        logger.log('Aurora 帮助')
        logger.log('所有条目:')
        logger.table({
          enable_plugin: '关于启用/关闭功能的方法',
          option: '关于设置',
          development: '关于如何开发功能'
        })
        logger.log(
          '请输入 %clogger.log("条目 ID")%c 来查看相应条目的帮助。',
          CODEFONT_CSS,
          ''
        )
      } else if (obj == 'enable_plugin') {
        logger.log(
          '以下是 Aurora 对象中 %cenable/disable%c 方法参数的说明。',
          CODEFONT_CSS,
          ''
        )
        logger.table({
          id: '可选，需启用/禁用功能的 ID。若不指定，则会打印目前启用/禁用的全部功能。'
        })
      } else if (obj == 'option') {
        logger.log(
          '%cAurora.option%c 可以获取/更改设置内容。',
          CODEFONT_CSS,
          ''
        )
        logger.log('以下是 Aurora 对象中 option 方法参数的说明。')
        logger.table({
          id: '可选，需设定的设置 id。不指定时，打印全部设置。',
          value: '可选，需设定的设置值。不指定时，返回这个 id 的设置。'
        })
      } else if (obj == 'development') {
        logger.log('%cplug.plug%c 可以注册一个功能。', CODEFONT_CSS, '')
        logger.log('以下是 plug 对象中 plug 方法参数的说明。')
        logger.table({
          id: '功能的 ID。',
          description: '功能的人类可读描述。',
          fn: '功能本体函数。'
        })
      } else {
        logger.log('无法找到条目。请确认您的拼写。')
      }
    },
    /**
     * 禁用功能。当没有参数时，查看已经禁用的功能列表。
     * @param {string[]} args 禁用的功能 ID。
     */
    disable(...args) {
      if (args.length == 0) {
        {
          const v = Aurora_config.disabled,
            v2 = {}
          if (!v instanceof Array) {
            logger.error('Aurora 加载失败。请检查配置文件是否设置正确。')
            return
          }
          if (v.length != 0) {
            logger.log('已经禁用的功能:')
            for (const key of v) {
              v2[key] = plug._events[key][0]
            }
            logger.table(v2)
          } else {
            logger.log('尚未禁用任何功能。')
          }
        }
        return
      }
      for (const id of args) {
        if (!Aurora_config.disabled.includes(id)) {
          Aurora_config.disabled.push(id)
        }
        window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
        logger.log(`Aurora 已经禁用了 %c${id}%c。`, CODEFONT_CSS, '')
      }
      logger.log('将在 %c3s%c 后刷新网页以应用更改。', CODEFONT_CSS, '')
      setTimeout(() => window.location.reload(), 3000)
    },
    /**
     * 启用功能。
     * @param {string[]} args 启用的功能 ID。
     */
    enable(...args) {
      if (args.length == 0) {
        {
          const v = Aurora_config.disabled,
            v2 = {}
          if (!v instanceof Array) {
            logger.error('Aurora 加载失败。请检查配置文件是否设置正确。')
            return
          }
          if (v.length != Object.keys(plug._events).length) {
            logger.log('已经启用的功能:')
            for (const [key, value] of Object.entries(plug._events)) {
              if (!v.includes(key)) {
                v2[key] = value[0]
              }
            }
            logger.table(v2)
          } else {
            logger.log('尚未启用任何功能。')
          }
        }
        return
      }
      for (const id of args) {
        Aurora_config.disabled = Aurora_config.disabled.filter(val => val != id)
        window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
        logger.log(`Aurora 已经启用了 %c${id}%c。`, CODEFONT_CSS, '')
      }
      logger.log('将在 %c3s%c 后刷新网页以应用更改。', CODEFONT_CSS, '')
      setTimeout(() => window.location.reload(), 3000)
    },
    /**
     * 获得 Aurora 设置。
     * @param {string | undefined} id 设置的 ID。
     * @param {string | undefined} value 设置的值。
     */
    option(...args) {
      if (args.length == 0) {
        logger.log('Aurora 设置:')
        logger.table(Aurora_config.option)
        return
      }
      if (args.length == 1) {
        return Aurora_config.option[args[0]]
      }
      Aurora_config.option[args[0]] = args[1]
      window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
      logger.log(
        `Aurora 已经设置了 %c${args[0]}%c 为 %c${args[1]}%c。`,
        CODEFONT_CSS,
        '',
        CODEFONT_CSS,
        ''
      )
      logger.log('将在 %c3s%c 后刷新网页以应用更改。', CODEFONT_CSS, '')
      setTimeout(() => window.location.reload(), 3000)
    }
  }
  function requireVue(callback) {
    let captured = false
    patch(Function.prototype, 'call', call => {
      return function (self, ...args) {
        if (
          args.length === 3 &&
          typeof args[0] === 'object' &&
          args[0] !== null &&
          typeof args[1] === 'object' &&
          args[1] !== null &&
          typeof args[2] === 'function' &&
          args[0].exports
        ) {
          const fn = this
          // const require = args[2]
          const str = fn.toString()
          if (str.includes('ENABLE_XES_CONSOLE')) {
            return
          }
          const res = call.apply(this, [self, ...args])
          const exports = args[0].exports
          if (!exports) return res
          webpackListener.forEach(v => v(exports))
          if (
            typeof exports.default === 'function' &&
            typeof exports.default.version === 'string' &&
            !captured
          ) {
            // This is vue.
            captured = true
            callback(self.default)
          }
          return res
        } else return call.apply(this, [self, ...args])
      }
    })
  }
  function addStyle(css) {
    if (css instanceof URL) {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = css.toString()
      document.documentElement.appendChild(style)
    } else {
      const style = document.createElement('style')
      style.textContent = css
      document.documentElement.appendChild(style)
    }
  }
  {
    if (window === window.top) logger.log('Aurora 正在加载配置。')
    let v = window.localStorage.getItem('Aurora')
    if (v == null) {
      window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
    } else {
      try {
        Aurora_config = JSON.parse(v)
      } catch (_) {
        window.localStorage.setItem('Aurora', JSON.stringify(Aurora_config))
      }
    }
  }
  const vueMixinManager = new VueElementMixin()
  requireVue(Vue => {
    patch(Vue.prototype, '_init', _init => {
      return function (args) {
        _init.call(this, args)
        vueMixinManager.emit(this)
      }
    })
  })
  plug.plug('privacy', '去除一些让开发者伤心的东西。', () => {
    let loaded = false
    // Universal (Vue.js / React) patch
    webpackListener.push(exports => {
      if (
        typeof exports === 'function' &&
        exports.default === exports &&
        typeof exports.Axios === 'function' &&
        !loaded
      ) {
        loaded = true
        exports.interceptors.request.use(function (config) {
          if (config.url.startsWith('/log')) {
            config.baseURL = ''
            config.url = 'data:application/json,{}'
          }
          return config
        })
      }
    })
    sessionStorage.setItem('debugger', 'true')
    Object.defineProperty(window, 'logger', {
      get() {
        return new Proxy(
          {},
          {
            get() {
              return () => {}
            },
            set() {
              return true
            }
          }
        )
      },
      set() {}
    })
    Object.defineProperty(window, 'xesWeb_eventLog', {
      get() {
        return new Proxy(
          {},
          {
            get() {
              return () => {}
            },
            set() {
              return true
            }
          }
        )
      },
      set() {}
    })
    Object.defineProperty(window, 'XesLoggerSDK', {
      value: function () {},
      writable: false
    })
  })
  plug.plug('sudo', '非唯C者也是人。', () => {
    vueMixinManager.on('109', instance => {
      instance.fnHandlePermission = () => true
    })
  })
  plug.plug('operate', '作品操作优化。', () => {
    vueMixinManager.on('109', instance => {
      if (instance.projectData) {
        instance.onAdaptClick = () => {
          instance.openNewTab(
            getScratchlink(
              instance.projectId,
              instance.version ?? instance.projectData.version,
              instance.$route.query.langType
            )
          )
        }
        patch(instance.$options, 'render', render => {
          return function (createElement) {
            this.projectData.hidden_code = 2
            const ret = render.call(this, createElement)
            const operateLeft =
              ret.componentOptions.children[1].children[1].children[1]
                .children[0].children[1].children[0]
            const adapt = operateLeft.children[5]
            adapt.children[1].text = ' 审查 '
            return ret
          }
        })
      }
    })
  })
  plug.plug('unlimited', '解除一些长度限制。', () => {
    if (window.location.pathname.startsWith('/space/')) {
      vueMixinManager.on('homepages', instance => {
        patch(instance.$options, 'render', render => {
          return function (createElement) {
            const res = render.call(this, createElement)
            if (this.contenteditable) {
              const signature =
                res.children[0].componentOptions.children[1].children[2]
                  .children[0]
              delete signature.data.attrs.maxlength
            }
            return res
          }
        })
      })
    } else if (window.location.pathname.startsWith('/ide/code')) {
      vueMixinManager.on('HeaderBase', instance => {
        patch(instance.$options, 'render', render => {
          return function (createElement) {
            const res = render.call(this, createElement)
            if (this.canEditName) {
              const input = res.children[0].children[1].children[0]
              delete input.data.attrs.maxlength
            }
            return res
          }
        })
      })
    } else if (window.location.pathname === '/project/publish/modal') {
      addStyle(`
.publish .publish_main_warp .publish_main .publish_detail .icon-edit {
  font-size: 14px;
  color: rgba(53,53,53,.3);
  cursor: pointer
}
`)
      vueMixinManager.on('Publish', instance => {
        // 允许上传非指定尺寸/格式及大小超过 5 MiB 的图像
        instance.handleFileChange = async () => {
          instance.handleUpload(instance.$refs.input.files[0])
        }
        instance.inputHandle = () => {
          instance.descriptionLength = instance.description.length
        }
        instance.$data.textareaPlaceholder = '在这里介绍你的作品...'
        instance.$data.tagPlacerholder =
          '勾选作品的标签，你也可以点击右侧按钮来添加标签。'
        instance.toSelectedTag = tag => {
          if (instance.selectedTagList.includes(tag)) {
            const tagIndex = instance.selectedTagList.findIndex(
              selectedTag => selectedTag === tag
            )
            instance.selectedTagList.splice(tagIndex, 1)
          } else instance.selectedTagList.push(tag)
        }
        instance.fnPublish = async () => {
          const t = instance
          // From Xueersi obfuscated code
          function getMd5PythonLibs(e) {
            return instance.axios.get(`${e}?_v=${Date.now()}`).catch(() => {
              logger.log('获取文件失败。')
            })
          }
          function processAsset(t) {
            const e = {}
            function n(t, r) {
              t.forEach(function (t) {
                t.isLeaf && 'html' === t.lang && (e['' + r + t.name] = t),
                  !t.isLeaf &&
                    t.children &&
                    t.children.length > 0 &&
                    n(t.children, '' + r + t.name + '/')
              })
            }
            return n(t, ''), e
          }
          t.sourceType = t.isHomework ? 'homework' : 'normal'
          if ('offline' !== t.version || !t.assets.assets_url) {
            t.publishAjax()
          } else {
            const r = await getMd5PythonLibs(t.assets.assets_url)
            if (r.data.treeAssets) {
              t.assetsHtmlMap = processAsset(r.data.treeAssets)
            }
            t.$nextTick(function () {
              Object.keys(t.assetsHtmlMap).length > 0
                ? t.$refs.publishWebDialog.open()
                : t.publishAjax()
            })
          }
        }
        instance.$options.computed.disableRadio = () => [
          'original',
          'adapt',
          'reprint'
        ]
        instance._computedWatchers.disableRadio.getter =
          instance.$options.computed.disableRadio
        instance._computedWatchers.disableRadio.dirty = true
        instance.checkSourceRadio = () => {}
        patch(instance, 'onRadioClick', onRadioClick => {
          return function (type) {
            if (type === 'homework') {
              this.isHomework = !this.isHomework
              this.radioHomeworkTooltipShow = this.isHomework
              if (this.radioHomeworkTooltipShow) {
                this.$refs.homeworkPoptip.show()
              } else {
                this.$refs.homeworkPoptip.hide()
              }
            } else return onRadioClick.call(this, type)
          }
        })
        patch(instance.$options, 'render', render => {
          return function (createElement) {
            if (this.isHomework === undefined) {
              this.isHomework = this.sourceType === 'homework'
            }
            if (
              !this.selectedTagList.every(tag => this.tagList.includes(tag))
            ) {
              this.tagList = Array.from(
                new Set([...this.tagList, ...this.selectedTagList])
              )
            }
            const res = render.call(this, createElement)
            const publishBtns =
              res.children[0].children[1].children[1].children[8]
            publishBtns.children.splice(0, 1)
            publishBtns.data.style = {
              float: 'right'
            }
            const operate = res.children[0].children[1].children[0].children[3]
            operate.children.at(-1).data.staticStyle = {
              'margin-right': '24px'
            }
            operate.children.push(
              createElement(
                'Poptip',
                {
                  ref: 'homeworkPoptip',
                  attrs: {
                    trigger: 'noop',
                    offset: '-14 16',
                    placement: 'bottom-start'
                  }
                },
                [
                  createElement('div', [
                    createElement('div', {
                      class:
                        'publish_radio' +
                        (this.isHomework ? ' publish_radio-checked' : ''),
                      on: {
                        click: e => {
                          e.stopPropagation()
                          this.onRadioClick('homework')
                          this.$forceUpdate()
                        }
                      }
                    })
                  ]),
                  createElement(
                    'div',
                    {
                      staticClass: 'publish_radio-poptip',
                      attrs: { slot: 'content' },
                      slot: 'content'
                    },
                    [
                      createElement(
                        'p',
                        { staticClass: 'publish_radio-detail' },
                        [
                          '选中此选项会导致你的作品',
                          createElement('br'),
                          '通常无法被看见。'
                        ]
                      ),
                      createElement('div', {
                        staticClass: 'publish_radio-close',
                        on: {
                          click: () => {
                            return this.$refs.homeworkPoptip.hide()
                          }
                        }
                      })
                    ]
                  )
                ]
              ),
              createElement('div', { staticClass: 'publish_radio-text' }, [
                createElement(
                  'p',
                  { staticClass: 'publish_radio-text-content' },
                  [
                    createElement('Poptip', [
                      ' 发布为',
                      createElement(
                        'span',
                        {
                          style: {
                            display: 'inline-block',
                            lineHeight: '30px'
                          }
                        },
                        '作业'
                      ),
                      createElement(
                        'p',
                        { attrs: { slot: 'content' }, slot: 'content' },
                        [
                          '其它人将会在随堂练习中看到这个 ',
                          createElement('br'),
                          '作品。'
                        ]
                      )
                    ])
                  ]
                )
              ])
            )
            const workName = res.children[0].children[1].children[1].children[1]
            const textArea =
              res.children[0].children[1].children[1].children[7].children[0]
            const helpClick =
              res.children[0].children[1].children[1].children[5].children[0]
                .children[1]
            helpClick.data.on.click = () => {
              const p = prompt('请输入需要添加的标签。')
              if (p && !this.tagList.includes(p)) this.tagList.push(p)
            }
            helpClick.data.staticClass = 'iconfont icon-edit'
            helpClick.data.attrs = { title: '添加自定义标签...' }
            delete workName.children[0].data.attrs.maxlength
            delete textArea.children[0].data.attrs.maxlength
            textArea.children.pop()
            return res
          }
        })
      })
    }
  })
  plug.plug('editor', '各种编辑器优化。', () => {
    if (
      window.location.href.startsWith(
        'https://code.xueersi.com/toolkit/template'
      )
    ) {
      vueMixinManager.on('6', instance => {
        instance.closeModal()
      })
    } else {
      // replace default code
      ;(() => {
        const template = plug.get_option_or('template', {
          cpp: `#include <iostream>

int main() {
    // 这是 Xueersi Aurora 的 C++ 默认模板。你可以在 Aurora 设置中变更它。
    std::cout << "[__AURORA_HITOKOTO__]" << std::endl;
    return 0;
}
`,
          python: `# 这是 Xueersi Aurora 的 Python 默认模板。你可以在 Aurora 设置中变更它。

print("[__AURORA_HITOKOTO__]")
`,
          webpy: `# 这是 Xueersi Aurora 的 Web Python 默认模板。你可以在 Aurora 设置中变更它。

print("[__AURORA_HITOKOTO__]")
`,
          offlinepy: `# 这是 Xueersi Aurora 的离线 Python 默认模板。你可以在 Aurora 设置中变更它。

print("[__AURORA_HITOKOTO__]")
`,
          hw1py: `# 这是 Xueersi Aurora 的光环板 Python 默认模板。你可以在 Aurora 设置中变更它。

print("[__AURORA_HITOKOTO__]")
`,
          hw2py: `# 这是 Xueersi Aurora 的编程掌机 Python 默认模板。你可以在 Aurora 设置中变更它。

print("[__AURORA_HITOKOTO__]")
`
        })
        let loaded = false
        // Universal (Vue.js / React) patch
        webpackListener.push(exports => {
          if (
            typeof exports === 'function' &&
            exports.default === exports &&
            typeof exports.Axios === 'function' &&
            !loaded
          ) {
            loaded = true
            exports.interceptors.response.use(function (resp) {
              const map = {
                1: 'cpp',
                2: 'python',
                3: 'webpy',
                4: 'webpy',
                5: 'hw1py',
                7: 'hw2py',
                28794692: 'offlinepy'
              }
              if (
                resp.config.url.startsWith('/compilers/v2/') ||
                resp.config.url.startsWith('/api/projects/v2/') ||
                resp.config.url.startsWith('/projects/v2/') ||
                (resp.config.url === '/community/v4/projects/detail' &&
                  window.location.pathname.startsWith('/ide/code/'))
              ) {
                if (resp.data.stat === 1) {
                  if (resp.data.data.id in map) {
                    const t = template[map[resp.data.data.id]]
                    if (t.includes('[__AURORA_HITOKOTO__]')) {
                      return fetch('https://v1.hitokoto.cn/?c=k')
                        .then(
                          v => {
                            logger.log(
                              '随机名言来自 Hitokoto，请访问 https://hitokoto.cn/ 以了解更多相关信息。'
                            )
                            return v.json()
                          },
                          () => ({
                            hitokoto:
                              '谨以此献给学而思最好的那段时光, 以及我们失去的一切。',
                            from_who: '凌'
                          })
                        )
                        .then(v => {
                          let hitokoto = ''
                          if (!v.from_who && !v.from) hitokoto = `${v.hitokoto}`
                          else if (!v.from_who)
                            hitokoto = `${v.hitokoto} —— 「${v.from}」`
                          else if (!v.from)
                            hitokoto = `${v.hitokoto} —— ${v.from_who}`
                          else
                            hitokoto = `${v.hitokoto} —— ${v.from_who}「${v.from}」`
                          resp.data.data.xml = t.replace(
                            /\[__AURORA_HITOKOTO__\]/g,
                            hitokoto
                          )
                          return resp
                        })
                    }
                    resp.data.data.xml = template[map[resp.data.data.id]]
                  }
                }
              }
              return resp
            })
          }
        })
      })()
      // no timer
      ;(() => {
        let loaded = false
        vueMixinManager.on('IdeEditor', instance => {
          instance.fnTryLockRun = () => {
            return true
          }
          if (window.Sk && !loaded) {
            loaded = true
            let v = Infinity
            Object.defineProperty(window.Sk, 'execLimit', {
              get: () => v,
              set: val => {
                if (val == 1) {
                  v = 1
                  queueMicrotask(() => {
                    v = Infinity
                  })
                }
              }
            })
            Object.defineProperty(window.Sk, 'yieldLimit', {
              get: () => Infinity,
              set: () => {}
            })
          }
        })
      })()
      // xterm v5
      addStyle(
        new URL(
          'https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.min.css'
        )
      )
      class Decoder {
        constructor() {
          this.bytesLeft = 0
          this.codePoint = 0
          this.lowerBound = 0
        }
        decode(data) {
          let tmp = ''
          for (let idx = 0; idx < data.length; idx++) {
            const code = data.charCodeAt(idx)
            if (0 === this.bytesLeft) {
              if (code <= 127) tmp += data.charAt(idx)
              else if (192 <= code && code <= 223) {
                this.codePoint = code - 192
                this.bytesLeft = 1
                this.lowerBound = 128
              } else if (224 <= code && code <= 239) {
                this.codePoint = code - 224
                this.bytesLeft = 2
                this.lowerBound = 2048
              } else if (240 <= code && code <= 247) {
                this.codePoint = code - 240
                this.bytesLeft = 3
                this.lowerBound = 65536
              } else if (248 <= code && code <= 251) {
                this.codePoint = code - 248
                this.bytesLeft = 4
                this.lowerBound = 2097152
              } else if (252 <= code && code <= 253) {
                this.codePoint = code - 252
                this.bytesLeft = 5
                this.lowerBound = 67108864
              } else tmp += '�'
            } else if (128 <= code && code <= 191) {
              this.bytesLeft--
              this.codePoint = (this.codePoint << 6) + (code - 128)
              if (this.bytesLeft === 0) {
                const charCode = this.codePoint
                if (
                  charCode < this.lowerBound ||
                  (55296 <= charCode && charCode <= 57343) ||
                  charCode > 1114111
                )
                  tmp += '�'
                else if (charCode < 65536) tmp += String.fromCharCode(charCode)
                else {
                  charCode -= 65536
                  tmp += String.fromCharCode(
                    55296 + ((charCode >>> 10) & 1023),
                    56320 + (1023 & charCode)
                  )
                }
              }
            } else {
              tmp += '�'
              this.bytesLeft = 0
              idx--
            }
          }
          return tmp
        }
      }
      const decoderInstance = new Decoder()
      class Xterm {
        constructor(
          elem,
          Terminal,
          WebglAddon,
          FitAddon,
          Unicode11Addon,
          CanvasAddon,
          WebLinksAddon
        ) {
          this.elem = elem
          this.term = new Terminal({
            fontSize: 15,
            fontFamily:
              '"Jetbrains Mono", "Fira Code", "Cascadia Code", "Noto Emoji", "Segoe UI Emoji", "Lucida Console", Menlo, courier-new, courier, monospace',
            theme: xterm_theme,
            cursorBlink: true,
            allowProposedApi: true,
            allowTransparency: true,
            cursorStyle: 'bar'
          })
          this.term.on = () => {}
          this.term.setOption = (name, value) => {
            this.term.options[name] = value
            this.fit()
          }
          this.fitAddon = new FitAddon()
          this.term.loadAddon(this.fitAddon)
          try {
            this.term.loadAddon(new WebglAddon())
          } catch {
            this.term.loadAddon(new CanvasAddon())
          }
          this.term.loadAddon(new Unicode11Addon())
          this.term.unicode.activeVersion = '11'
          this.term.loadAddon(new WebLinksAddon())
          this.term.onData(e => {
            if (window.WebpyInputCtrl && window.WebpyInputCtrl.runByWebPy) {
              const n =
                !!window.WebpyInputCtrl && window.WebpyInputCtrl.onData(e)
              if (n !== false) {
                if (n === true) this.write(e)
                else this.write(n)
              }
            }
          })
          this.term.open(elem)
          this.fit()
          window.addEventListener(
            'resize',
            (this.resizeListener = () => this.fit())
          )
          this.term.focus()
          this.term.blur()
          this.resizeHandler = null
          this.activate = true
          this.decoder = decoderInstance
        }
        fit() {
          this.fitAddon.fit()
        }
        info() {
          return {
            columns: this.term.cols,
            rows: this.term.rows
          }
        }
        output(e) {
          const n = this.decode(e)
          this.term.write(n)
          // var n = this.decoder.decode(e)
          // t(n) || this.term.write(n)
        }
        decode(data) {
          return this.decoder.decode(data)
        }
        outputNoEncode(e) {
          this.term.write(e)
        }
        write(e) {
          this.term.write(e)
        }
        writeln(e) {
          this.term.writeln(e)
        }
        showMessage(_message, _timeout) {
          // Unused
        }
        removeMessage() {
          // Unused
        }
        setWindowTitle(title) {
          document.title = title
        }
        setPreferences(_options) {
          // Unused
        }
        onInput(callback) {
          this.term.onData(ev => {
            if (this.activate) callback(ev)
          })
        }
        onResize(callback) {
          this.term.onResize(ev => {
            if (this.activate) callback(ev.cols, ev.rows)
          })
        }
        deactivate() {
          // if (this.resizeHandler) this.resizeHandler.dispose()
          this.activate = false
          this.term.blur()
        }
        reset() {
          this.term.clear()
          this.term.reset()
        }
        close() {
          window.removeEventListener('resize', this.resizeListener)
          this.term.dispose()
        }
      }
      let termInstance = null
      vueMixinManager.on('IdeEditor', instance => {
        patch(instance, 'fnRunCode', fnRunCode => {
          return function (...args) {
            if (termInstance) termInstance.activate = true
            return fnRunCode.call(this, ...args)
          }
        })
      })
      const xtermDeps = Promise.all([
        import('https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/+esm'),
        import('https://cdn.jsdelivr.net/npm/@xterm/addon-webgl@0.18.0/+esm'),
        import('https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/+esm'),
        import(
          'https://cdn.jsdelivr.net/npm/@xterm/addon-unicode11@0.8.0/+esm'
        ),
        import('https://cdn.jsdelivr.net/npm/@xterm/addon-canvas@0.7.0/+esm'),
        import(
          'https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@0.11.0/+esm'
        )
      ])
      vueMixinManager.on('WsTermComp', instance => {
        const fnInitWS = instance.fnInitWS
        instance.fnInitWS = async function (api) {
          // 移植自 XesExt v2
          const xterm = document.getElementById('terminal')
          if (xterm && this.canInitWs) {
            if (!this.xterm) {
              xterm.style.backgroundColor =
                xterm.parentNode.style.backgroundColor = xterm_theme.background
              const [
                { Terminal },
                { WebglAddon },
                { FitAddon },
                { Unicode11Addon },
                { CanvasAddon },
                { WebLinksAddon }
              ] = await xtermDeps
              termInstance = this.xterm = new Xterm(
                xterm,
                Terminal,
                WebglAddon,
                FitAddon,
                Unicode11Addon,
                CanvasAddon,
                WebLinksAddon
              )
              this.xterm.term.options.fontSize = Number(this.fontSize)
            }
            fnInitWS.call(this, api)
          }
        }
      })
      // monaco editor
      addStyle(
        new URL(
          'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs/editor/editor.main.css'
        )
      )
      addStyle(`
.editor, .ace-editor {
  padding: 0 !important;
  text-align: left !important;
}
`)
      window.MonacoEnvironment = {
        getWorkerUrl(fileName) {
          if (fileName === 'workerMain.js') {
            // fix SecurityError exception
            return `data:text/javascript;base64,${btoa(
              `(function(fetch){globalThis.fetch=function(url,...args){return fetch.call(this,'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs/base/worker/'+url,...args);};})(globalThis.fetch);importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs/base/worker/workerMain.js');`
            )}`
          }
        }
      }

      const languageMap = {
        c_cpp: 'cpp'
      }
      class DummyAceEditor {
        constructor(defaultLanguage) {
          this.value = ''
          this.language = defaultLanguage
        }
        setValue(value) {
          this.value = value
        }
        getSession() {
          return {
            setMode: mode => {
              const lang = mode.substring(9)
              this.language = languageMap[lang] ?? lang
            },
            setUndoManager: () => {}
          }
        }
      }
      const monacoDeps = import(
        'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'
      )
      vueMixinManager.on('AceEditor', instance => {
        instance.foldCode =
          instance.addCodeTips =
          instance.addCodeOfflineTips =
            () => {}
        instance.$options.mounted = [
          async function () {
            const lang = this.lang ?? 'c_cpp'
            const dummy = new DummyAceEditor(languageMap[lang] ?? lang)
            this.editor = new Proxy(dummy, {
              get(_, p) {
                if (Reflect.has(dummy, p)) return Reflect.get(dummy, p)
                return () => {}
              }
            })
            const Monaco = await monacoDeps
            // Based on https://github.com/zsodur/monaco-editor-copilot, MIT license
            const MonacoEditorCopilot = editor => {
              async function fetchCompletion(
                config,
                handleInsertion,
                WindowAI
              ) {
                const handleMessage = message => {
                  handleInsertion(message)
                }

                let text = ''
                const [response] = await WindowAI.generateText(
                  {
                    messages: [
                      {
                        role: 'assistant',
                        content: `你是一个代码补全器，帮我重构这段代码，或实现注释中给出的请求。代码的语言为 ${config.lang}，只需给出重构的代码，不需要任何解释，但可以在注释中补充人类可读的说明。`
                      },
                      {
                        role: 'user',
                        content: config.code
                      }
                    ]
                  },
                  {
                    onStreamResult: (resp, err) => {
                      if (err) logger.error('在 AI 生成时发生错误。', err)
                      else if (resp) {
                        text += resp.message.content
                        handleMessage(text)
                      }
                    }
                  }
                )
                text = response.message.content.trim()
                handleMessage(text)
              }

              const handleCompletion = async (
                editor,
                config,
                cursorStyleLoading,
                cursorStyleNormal,
                WindowAI
              ) => {
                const currentPosition = editor.getPosition()
                if (!currentPosition) {
                  return
                }

                cursorStyleLoading()

                let lastText = ''
                const handleInsertion = text => {
                  const position = editor.getPosition()
                  if (!position) {
                    return
                  }
                  const offset = editor.getModel()?.getOffsetAt(position)
                  if (offset === undefined) {
                    return
                  }

                  const edits = [
                    {
                      range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                      },
                      text: text.slice(lastText.length)
                    }
                  ]
                  lastText = text
                  editor.executeEdits('', edits)
                }

                try {
                  await fetchCompletion(config, handleInsertion, WindowAI)
                  cursorStyleNormal()
                } catch (error) {
                  cursorStyleNormal()
                  logger.error('在 AI 生成时发生错误。', error)
                }
              }

              const cursorStyleLoading = () => {
                editor.updateOptions({
                  cursorStyle: 'underline'
                })
              }

              const cursorStyleNormal = () => {
                editor.updateOptions({
                  cursorStyle: 'line'
                })
              }

              cursorStyleNormal()

              let refactorAction = {
                id: 'aurora.refactor',
                label: '用 AI 重构选中代码',
                keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyB],
                contextMenuGroupId: 'aurora',
                run: async () => {
                  let WindowAI = window.ai
                  if (!WindowAI || !WindowAI.generateText) {
                    const { SSE } = await import(
                      'https://cdn.jsdelivr.net/npm/sse.js@2.5.0/+esm'
                    )
                    logger.log(
                      'window.ai 未安装或不支持，已回退到学而思 AI，生成结果质量可能变差。'
                    )
                    logger.log(
                      '您可以访问 https://windowai.io/ 来获取关于 window.ai 的相关信息。'
                    )
                    WindowAI = {
                      generateText: async (session, func) => {
                        const history = session.messages.slice(0, -1)
                        const prompt = session.messages.at(-1).content
                        const authData = await (
                          await fetch('https://code.xueersi.com/api/ai/auth')
                        ).json()
                        const token = `Bearer ${authData.data.token}`
                        let responseText = ''

                        let source = new SSE(
                          'https://codeapi.xueersi.com/ai/aigc/v2/chat',
                          {
                            method: 'POST',
                            headers: {
                              Authorization: token,
                              'Content-Type': 'application/json'
                            },
                            payload: JSON.stringify({
                              prompt: prompt,
                              history: history,
                              stream: true,
                              max_tokens: 0
                            })
                          }
                        )
                        source.addEventListener('message', function (data) {
                          const content = JSON.parse(data.data)
                          responseText += content.message.content
                          func.onStreamResult(content)
                        })
                        source.stream()
                        return [{ message: { content: responseText } }]
                      }
                    }
                  }
                  if (editor.getRawOptions().readOnly) return
                  const originalTitle = document.title
                  document.title = 'Generating...'
                  // 最麻烦的一集
                  const selectedRange = this.editor.getSelection()
                  const selectedText = this.editor
                    .getModel()
                    .getValueInRange(selectedRange)
                  editor.executeEdits('', [
                    {
                      range: selectedRange,
                      text: ''
                    }
                  ])
                  logger.log(
                    '您正在使用 AI 生成功能。请注意开发者不对 AI 生成结果的质量作保证，请遵循相关地区的法律法规。'
                  )
                  await handleCompletion(
                    editor,
                    {
                      code: selectedText,
                      lang: editor.getModel().getLanguageId()
                    },
                    cursorStyleLoading,
                    cursorStyleNormal,
                    WindowAI
                  )
                  document.title = originalTitle
                }
              }

              editor.addAction(refactorAction)
            }
            this.editor = Monaco.editor.create(this.$el, {
              value: dummy.value,
              automaticLayout: true,
              language: dummy.language,
              fontSize: this.fontSize,
              readOnly: !!this.readOnly
            })
            const engine = new URL(
              plug.get_option_or('searchEngine', 'https://www.bing.com/?q=')
            )
            this.editor.addAction({
              id: 'aurora.search',
              label: `用 ${engine.host} 搜索选中内容`,
              contextMenuGroupId: 'aurora',
              run: () => {
                const a = document.createElement('a')
                a.target = '_blank'
                a.href = `${engine.toString()}${this.editor
                  .getModel()
                  .getValueInRange(this.editor.getSelection())}`
                a.click()
              }
            })
            MonacoEditorCopilot(this.editor)
            this.editor.getModel().setEOL(0)
            this.editor.onDidChangeModelContent(() => {
              const value = this.editor.getValue()
              this.$emit('listenEvent', {
                type: 'update',
                user_code: value
              })
              this.contentBackup = value
            })
            this.editor.setOptions =
              this.editor.setBehavioursEnabled =
              this.editor.setOptions =
              this.editor.resize =
                () => {}
            this.editor.gotoLine = line => {
              this.editor.revealLineInCenter(line)
            }
            this.editor.moveCursorTo = (lineNumber, column) =>
              this.editor.setPosition({
                lineNumber: Number(lineNumber) + 1,
                column: Number(column) + 1
              })
            this.editor.setReadOnly = readOnly =>
              this.editor.updateOptions({ readOnly })
            this.editor.setFontSize = fontSize =>
              this.editor.updateOptions({ fontSize })
            this.tryHandleExceptionForTerm = errors => {
              const SeverityMap = {
                error: 8,
                warning: 4,
                note: 1
              }
              if (!errors || errors.length === 0) {
                Monaco.editor.setModelMarkers(
                  this.editor.getModel(),
                  'error',
                  []
                )
                return
              }
              Monaco.editor.setModelMarkers(
                this.editor.getModel(),
                'error',
                errors.map(error => ({
                  startLineNumber: Number(error.Line),
                  endLineNumber: Number(error.Line),
                  message: error.Info.split('\r\n')[0].trim(),
                  startColumn: Number(error.Postion), // NOTE: This is a typo from Xueersi developer
                  endColumn: Infinity,
                  severity: SeverityMap[error.Type]
                }))
              )
            }
            this.editor.getSession = () => ({
              setMode: mode => {
                const lang = mode.substring(9)
                this.editor.getModel().setLanguage(languageMap[lang] ?? lang)
              },
              setUndoManager() {}
            })
            this.editor.onDidChangeCursorPosition(ev => {
              this.$emit('listenEvent', {
                type: 'cursorChange',
                user_code_cursor: {
                  row: ev.position.lineNumber - 1,
                  column: ev.position.column - 1
                }
              })
            })
            this.editor.onDidFocusEditorText(() => {
              this.$store.dispatch('editorFocus', true)
            })
            this.$store.dispatch('setEditor', this.editor)
          }
        ]
      })
    }
  })
  plug.plug('hidden', '访问不公开的作品。', () => {
    let loaded = false
    // Universal (Vue.js / React) patch
    webpackListener.push(exports => {
      if (
        typeof exports === 'function' &&
        exports.default === exports &&
        typeof exports.Axios === 'function' &&
        !loaded
      ) {
        loaded = true
        exports.interceptors.request.use(function (config) {
          if (config.url.startsWith('/compilers/v2/')) {
            config.url = '/community/v4/projects/detail'
            config.params = {
              id: config.params.id,
              lang: 'python'
            }
          } else if (config.url.startsWith('/api/projects/v2/')) {
            const code = config.url.split('/').at(-1)
            config.url = '/api/community/v4/projects/detail'
            config.params = {
              id: code,
              lang: 'scratch'
            }
          } else if (config.url.startsWith('/projects/v2/')) {
            const code = config.url.split('/').at(-1)
            config.url = '/community/v4/projects/detail'
            config.params = {
              id: code,
              lang: 'scratch'
            }
          }
          return config
        })
        exports.interceptors.response.use(function (resp) {
          if (resp.config.url === '/community/v4/projects/detail') {
            if (resp.data.stat === 1) {
              if (!resp.data.data.published)
                resp.data.data.published_at = resp.data.data.modified_at
            }
          }
          return resp
        })
      }
    })
  })
  plug.plug('dislike', '显示踩数。', () => {
    const UnlikeImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAv3pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBbDsMgDPvPKXYE8oCG49C1k3aDHX+BpFVZZwmT2MhNA/vn/YJHB6GA5EVLLSUZpEqlZoUmRxuMSQZ708LDWYfTIJPYbvZWS7w/dDwDjkBM+RKkzzDW2agS+foTRH5xn6jXWwTVCGJyAyOgxaSl6nL9hXVPM9QPdBKdx771i21vy/YdJtoZORkzqw/A/Qhws0IHC7ncjNn1COuL/LOnA/AFZY9Zb2AiYesAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX9NKi1QcrCDiELA62UVFHKWKRbBQ2gqtOphc+gVNGpIUF0fBteDgx2LVwcVZVwdXQRD8AHF2cFJ0kRL/lxRaxHhw3I939x537wChWWWqGZgDVM0y0om4mMuvisFXhBBAGIMYlZipJzOLWXiOr3v4+HoX41ne5/4cfUrBZIBPJJ5jumERbxDPbFo6533iCCtLCvE58YRBFyR+5Lrs8hvnksMCz4wY2fQ8cYRYLHWx3MWsbKjE08RRRdUoX8i5rHDe4qxW66x9T/7CcEFbyXCd5ggSWEISKYiQUUcFVViI0aqRYiJN+3EP/7DjT5FLJlcFjBwLqEGF5PjB/+B3t2ZxatJNCseBnhfb/hgDgrtAq2Hb38e23ToB/M/Aldbx15rA7CfpjY4WPQL6t4GL644m7wGXO8DQky4ZkiP5aQrFIvB+Rt+UBwZugd41t7f2Pk4fgCx1tXwDHBwC4yXKXvd4d6i7t3/PtPv7AYV+cq40kTkPAAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDplNDNjMDY2My03NTIxLTQyM2ItYjhmMC00NjYwYjRiNTI0NjQiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTEwMmJjMDEtY2Y4NC00NDQwLThlYjktZmI1ZGI0ZDc0ZWVkIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDE2YTU1MDUtODNhYS00MWJjLTliM2YtMTkxNzA3NmQxZTg1IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MjI3NzQxODg2OTE4NzUiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQ6MDg6MDRUMjA6MjM6MDgrMDg6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI0OjA4OjA0VDIwOjIzOjA4KzA4OjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjAyYjQ3ZmMtYjUzNi00NDhlLTk0OGItYWZmMzc4ODRiMTY2IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA4LTA0VDIwOjIzOjA4Ii8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PhEGw8QAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCAQMFwiLkxoZAAACMklEQVRIx7WVP0+UQRjEf7PvwoHKH41G0URMVGoLrQwEYiGRwkJM/AT6OWysrP0UYiFCDBiQwkITtVBJLIyNlYIaUDzufHcsPM0FuTuOOyfZajc7+8w8z6wApmYXhekBrpI8btELiOawiT0NWpa4YTgMSFLRKT2IlUOdwLjta4g+INA8iiGEHsMZ24PAHgDbSdJwAFBKBZwuAL27JPkDCTr+vUOdYebhvEKg1+gEkLVAQkqp5l4s5lk0nAQK/EcEKWRCQ61W05AIO2IPAbH124Jrb2WhUJEu/teKUkoDQN8u5qZZ6TjVrmpk15YOON1m2by9dG6fP0a1KxI+0mIaVItXxyO0AqQ2yZawN4AS8LOyyohvEXEfc7TSeaGGj1kDT4rAGnglSC/BA4aDQLApChaixCOkNSfOirRfkpKRkKwUZY4bDdYgy4U+AtOIJzbvBZvA7apHGygJ4N7s446U3CFSkEQyCIHcDVy3ubRNFuaS3lq+g/VKULwyMZY37x4wNbPQA9yyObelMy1pFeum5ReTE2Objcyr29Y2qvxRWx9UwsyDX++EpCGRfhNEb0Mk/EzwY6ftGBuMRQLWMam6IyWVUtQ7ClneHiI7AZ9A1XOWDJ/JvTE5Ouydh2r9ksqg58BGVYaVZL9Rcrm59K6DQwf6y11dnUvAHLAKfBVaJoS7ZFmxPeFUwdzSU62tf98rcSzg7hjjh4S+XL44kreV6O9MzS6GjFz9+7rT6Mh5NxuCvwDVzNSdNFOkZAAAAABJRU5ErkJggg==`
    addStyle(`
.card-bottom-data-right-unlike {
  margin-right: 12px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.icon-cai:before {
  display: inline-block;
  content: "\\e61f";
  transform: rotate(180deg);
}

.recom-card .card-bottom-data-right-unlikes>i,.recom-card .card-bottom-data-right-views>i {
  margin-right: 5px
}

.recom-card .card-bottom-data-right-unlikes {
  margin-right: 12px
}

.recom-card .card-bottom-data-right-unlikes,.recom-card .card-bottom-data-right-views {
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.card-bottom-data-right-unlike:before {
  content: " ";
  width: 16px;
  height: 16px;
  background: url(${UnlikeImg}) no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
  margin-top: -2px
}

.work-card .work-detail .work-list .work-count .unlike_icon {
  margin-right: .5em
}

.work-card .work-detail .work-list .work-count .unlike_icon:before {
  background: url(${UnlikeImg})
}
`)
    vueMixinManager.on('commentPiece', instance => {
      patch(instance.$options, 'render', render => {
        return function (createElement) {
          const res = render.call(this, createElement)
          /** @type {VElement} */
          const VElement = res.constructor
          const unlike =
            res.children[1].children[2].children[1].children[1].children[1]
          unlike.children.push(
            new VElement(
              undefined,
              undefined,
              undefined,
              ` ${this.commentDetail.unlikes} `,
              undefined,
              this
            )
          )
          return res
        }
      })
    })
    vueMixinManager.on('109', instance => {
      function patchLike(instance, p) {
        instance[p] = function () {
          let flag = false
          const proxy = new Proxy(instance, {
            get: (_, p) => {
              if (p === 'projectId' && !flag) {
                // Skip first time comparison
                flag = true
                return '0'
              }
              return Reflect.get(instance, p)
            }
          })
          return instance.$options.methods[p].call(proxy)
        }
      }
      if (instance.projectData) {
        // ✌就要踩
        patchLike(instance, 'fnSetLike')
        patchLike(instance, 'fnSetUnlike')
        patch(instance.$options, 'render', render => {
          return function (createElement) {
            const res = render.call(this, createElement)
            const operateLeft =
              res.componentOptions.children[1].children[1].children[1]
                .children[0].children[1].children[0]
            const operateRight =
              res.componentOptions.children[1].children[1].children[1]
                .children[0].children[1].children[1]
            const dislike = operateLeft.children[2]
            if (
              typeof this.projectData.unlikes === 'number' &&
              this.projectData.unlikes > 0
            ) {
              dislike.children.push(
                createElement('span', `${this.projectData.unlikes}`)
              )
            }
            operateLeft.children.pop() // 删除“分享”
            operateRight.children.splice(0, 1) // 删除“公约”
            return res
          }
        })
      }
    })
    vueMixinManager.on('WorkPiece', instance => {
      patch(instance.$options, 'render', render => {
        return function (createElement) {
          const res = render.call(this, createElement)
          if (this.workDetail.removed) {
            return res
          }
          const workCount = res.children[0].children[1].children[1].children[1]
          workCount.children.splice(
            1,
            0,
            createElement(
              'i',
              { staticClass: 'unlike_icon' },
              `${this.workDetail.unlikes}`
            )
          )
          return res
        }
      })
    })
    vueMixinManager.on('Card', instance => {
      patch(instance.$options, 'render', render => {
        return function (createElement) {
          const res = render.call(this, createElement)
          const rankDetail =
            res.children[0].children[0].children[6].children[1].children[1]
          rankDetail.children.splice(
            2,
            0,
            createElement('img', {
              attrs: { width: '13', src: UnlikeImg },
              staticClass: 'rank-heart-img'
            }),
            createElement(
              'span',
              { staticClass: 'rank-heart' },
              `${this.cell.unlikes}`
            )
          )
          return res
        }
      })
    })
    vueMixinManager.on('NewCard', instance => {
      patch(instance.$options, 'render', render => {
        return function (createElement) {
          const ret = render.call(this, createElement)
          let work
          if (instance.$parent.$parent.list) {
            work = instance.$parent.$parent.list.find(
              v => v && this.id === v.id
            )
            const cardBottomRight = ret.children[1].children[1].children[1]
            cardBottomRight.children.splice(
              1,
              0,
              createElement(
                'div',
                { staticClass: 'card-bottom-data-right-unlike' },
                `${work.unlikes}`
              )
            )
          } else if (
            instance.$parent.$parent.$parent.$parent.$parent
              .keduoRecommendData?.[0]?.items
          ) {
            work =
              instance.$parent.$parent.$parent.$parent.$parent.keduoRecommendData[0].items.find(
                v => this.id === v.id
              )
            if (work) {
              const cardBottomRight = ret.children[1].children[1].children[1]
              cardBottomRight.children.splice(
                1,
                0,
                createElement(
                  'div',
                  { staticClass: 'card-bottom-data-right-unlikes' },
                  [
                    createElement('i', { staticClass: 'iconfont icon-cai' }),
                    `${work.unlikes}`
                  ]
                )
              )
            } else {
              work =
                instance.$parent.$parent.$parent.$parent.$parent.tagWorkList
                  .flatMap(v => v.items)
                  .find(v => this.id === v.id)
              const cardBottomRight = ret.children[1].children[1].children[1]
              cardBottomRight.children.splice(
                1,
                0,
                createElement(
                  'div',
                  { staticClass: 'card-bottom-data-right-unlike' },
                  `${work.unlikes}`
                )
              )
            }
          } else if (instance.$parent.$parent.$parent.projects) {
            work = instance.$parent.$parent.$parent.projects
              .flat()
              .find(v => this.id === v.id)
            const cardBottomRight = ret.children[1].children[1].children[1]
            cardBottomRight.children.splice(
              1,
              0,
              createElement(
                'div',
                { staticClass: 'card-bottom-data-right-unlike' },
                `${work.unlikes}`
              )
            )
          }
          return ret
        }
      })
    })
  })
  plug.done()
  if (window === window.top) {
    // Something went wrong on dependencies (https://github.com/ai/nanoid/pull/490), so Markdown based dashboard is suspended.
    // async function printImage(url) {
    //   const xhr = await fetch(url)
    //   const fr = new FileReader()
    //   fr.addEventListener('load', () => {
    //     const style = `font-size: 300px; background-image: url("${fr.result}"); background-size: contain; background-repeat: no-repeat;`
    //     console.log('%c     ', style)
    //   })
    //   fr.readAsDataURL(await xhr.blob())
    // }
    // const plugin = document.createElement('div')
    // plugin.insertAdjacentHTML(
    //   'beforeend',
    //   `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.6.1/github-markdown.min.css"`
    // )
    // const article = document.createElement('article')
    // article.className = 'markdown-body'
    // article.insertAdjacentHTML('beforeend', '<h1>Xueersi Aurora 已加载。</h1>')
    // plugin.appendChild(article)
    // logger.clear()
    // printImage(
    //   ''
    // )
    logger.log('Xueersi Aurora 已加载。')
    logger.log(
      '关于开发自己的功能，可以参见 %cAurora.help("development")%c。',
      CODEFONT_CSS,
      ''
    )
    window.Aurora.enable()
    logger.log('请使用 %cAurora.help()%c 查看帮助。', CODEFONT_CSS, '')
  }
})()
