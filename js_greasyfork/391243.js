// ==UserScript==
// @name         代码片段语法高亮 + 不要翻译页面上的代码
// @namespace    https://floatsyi.com/
// @version      0.3.1
// @description  使用 highlight.js 给代码片断添加语法高亮, 并设置更优雅的字体.查看codepen原型快速了解: https://codepen.io/FloatingShuYin/pen/GRRjmOE?editors=0010 不要翻译页面上的代码请参考：https://greasyfork.org/zh-CN/scripts/376658-%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91github%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81
// @author       floatsyi
// @license      MIT
// @require      https://cdn.bootcss.com/highlight.js/9.15.10/highlight.min.js
// @require      https://cdn.bootcss.com/fontfaceobserver/2.1.0/fontfaceobserver.js
// @require      https://unpkg.com/vue@2.6.10/dist/vue.min.js
// @require      https://unpkg.com/buefy/dist/buefy.min.js
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/391243/%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5%E8%AF%AD%E6%B3%95%E9%AB%98%E4%BA%AE%20%2B%20%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/391243/%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5%E8%AF%AD%E6%B3%95%E9%AB%98%E4%BA%AE%20%2B%20%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
//  https://www.bootcdn.cn/highlight.js/
// 当前版本号
// FIXME
const currentVersion = '0.3.1'
// debug log
const isDev = false
const log = (...any) => {if (isDev) { console.log(...any) }}
log('GM_listValues', GM_listValues())
//  thmem 和  font 列表
// https://highlightjs.org/static/demo/
// ;[...document.querySelectorAll('#styles > li')].map(item =>item.innerText.toLocaleLowerCase().replace(/\s/g, '-').replace(/(-)?(\d+)(-)?/g,'$2').replace(/(qtcreator)(-)(dark|light)/, '$1_$3').replace(/(kimbie)(-)(dark|light)/,'$1.$2'))
const themes = [
  'default',
  'a11y-dark',
  'a11y-light',
  'agate',
  'an-old-hope',
  'androidstudio',
  'arduino-light',
  'arta',
  'ascetic',
  'atelier-cave-dark',
  'atelier-cave-light',
  'atelier-dune-dark',
  'atelier-dune-light',
  'atelier-estuary-dark',
  'atelier-estuary-light',
  'atelier-forest-dark',
  'atelier-forest-light',
  'atelier-heath-dark',
  'atelier-heath-light',
  'atelier-lakeside-dark',
  'atelier-lakeside-light',
  'atelier-plateau-dark',
  'atelier-plateau-light',
  'atelier-savanna-dark',
  'atelier-savanna-light',
  'atelier-seaside-dark',
  'atelier-seaside-light',
  'atelier-sulphurpool-dark',
  'atelier-sulphurpool-light',
  'atom-one-dark-reasonable',
  'atom-one-dark',
  'atom-one-light',
  'brown-paper',
  'codepen-embed',
  'color-brewer',
  'darcula',
  'dark',
  'darkula',
  'docco',
  'dracula',
  'far',
  'foundation',
  'github-gist',
  'github',
  'gml',
  'googlecode',
  'grayscale',
  'gruvbox-dark',
  'gruvbox-light',
  'hopscotch',
  'hybrid',
  'idea',
  'ir-black',
  'isbl-editor-dark',
  'isbl-editor-light',
  'kimbie.dark',
  'kimbie.light',
  'lightfair',
  'magula',
  'mono-blue',
  'monokai-sublime',
  'monokai',
  'nord',
  'obsidian',
  'ocean',
  'paraiso-dark',
  'paraiso-light',
  'pojoaque',
  'purebasic',
  'qtcreator_dark',
  'qtcreator_light',
  'railscasts',
  'rainbow',
  'routeros',
  'school-book',
  'shades-of-purple',
  'solarized-dark',
  'solarized-light',
  'sunburst',
  'tomorrow-night-blue',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'tomorrow-night',
  'tomorrow',
  'vs',
  'vs2015',
  'xcode',
  'xt256',
  'zenburn'
]
// google Monospace fonts:  https://fonts.google.com/?sort=date&category=Monospace
// ;[...document.querySelectorAll('.fonts-module-title')].map(item => item.innerText)
const fonts = [
  'Fira Code',
  'B612 Mono',
  'Major Mono Display',
  'IBM Plex Mono',
  'Nanum Gothic Coding',
  'Overpass Mono',
  'Space Mono',
  'Roboto Mono',
  'Fira Mono',
  'Share Tech Mono',
  'Cutive Mono',
  'Source Code Pro'
]

const shouldClearCacheKeys = ['bulmaStyle']

const hash = '662eb72f' // fnv132('Syntax_highlighting')
const hashString = str => `${str}-${hash}`
const getCacheValue = key => GM_getValue(hashString(key))
const setCacheValue = (key, value) => GM_setValue(hashString(key), value)
const deleteCacheValue = key => GM_deleteValue(hashString(key))
const hasCacheValue = key => !!GM_getValue(hashString(key))

// 默认字体与主题
const defaultTheme = 'atom-one-dark'
const defaultFont = 'Fira Code'

let currentTheme = getCacheValue('currentTheme') || defaultTheme
let currentFont = getCacheValue('currentFont') || defaultFont

// hashString
const hashVersion = hashString('version')

const clearCache = () => {
    for (const key of [...themes, ...fonts, ...shouldClearCacheKeys]) {
      deleteCacheValue(key)
    }
}

// 如果是新版本就清除缓存
GM_addValueChangeListener(hashVersion, function (
  name,
  old_value,
  new_value,
  remote
) {
  if (old_value !== new_value) {
    clearCache()
    // TODO 清除之前 0.1.2 版本的废弃缓存
    ;['Fira Code', 'atom-one-dark', 'bulmaStyle'].forEach(key => {GM_deleteValue(key)})
    // TODO 清除 0.2.2 版本的废弃缓存
    deleteCacheValue('isForcePreBackgroundColors')
  }
})

// 保存当前版本号, 触发监听
GM_setValue(hashVersion, currentVersion)

// 避免 google 网页翻译当前页面的代码
const hasCodeEleChild = ele => !!ele.querySelector('code')

function addCodeEle (ele) {
  ele.innerHTML = '<code class="doNotTranslate">' + ele.innerHTML + '</code>'
}

function doNotTranslateCode () {
  const pres = document.querySelectorAll('pre')
  pres.forEach(function (pre) {
     if (!hasCodeEleChild(pre)) addCodeEle(pre)
  })
}

const _ = {}
  _.debounce = function (func, wait) {
    var lastCallTime
    var lastThis
    var lastArgs
    var timerId

    function startTimer (timerExpired, wait) {
      return setTimeout(timerExpired, wait)
    }

    function remainingWait (time) {
      const timeSinceLastCall = time - lastCallTime
      const timeWaiting = wait - timeSinceLastCall
      return timeWaiting
    }

    function shoudInvoking (time) {
      return lastCallTime !== undefined && time - lastCallTime >= wait
    }

    function timerExpired () {
      const time = Date.now()
      if (shoudInvoking(time)) {
        return invokeFunc()
      }
      timerId = startTimer(timerExpired, remainingWait(time))
    }

    function invokeFunc () {
      timerId = undefined
      const args = lastArgs
      const thisArg = lastThis
      let result = func.apply(thisArg, args)
      lastArgs = lastThis = undefined
      return result
    }

    function debounced (...args) {
      let time = Date.now()
      lastThis = this
      lastArgs = args
      lastCallTime = time
      if (timerId === undefined) {
        timerId = startTimer(timerExpired, wait)
      }
    }

    return debounced
  }
const body = document.body
const option = {
    childList: true,
    subtree: true
  }

  let time = 0

  function doNotTranslate (mutations, observer) {
    // 处于过于频繁的 DOM 变更时, 暂停监听 50ms, 并放弃累积的未处理的变更事件
    if (time >= 20) {
      observer.disconnect()
      observer.takeRecords()
      time = 0
      setTimeout(function () {
        mo.observe(body, option)
      }, 50)
    }

    doNotTranslateCode()

    time++
    log(`第${time}次执行: doNotTranslate`)
  }

const MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver

const mo = new MutationObserver(_.debounce(doNotTranslate, 50))

const currentHostName = [window.location.host]
let hostNames = getCacheValue('hostNames')

if (!hostNames) {
    setCacheValue('hostNames', ['www.npmjs.com'])
} else {
    if (hostNames.includes(...currentHostName)){
      doNotTranslateCode()
      mo.observe(body, option)
    }
}
// 注册设置页
GM_registerMenuCommand('不要翻译这个页面的代码', () => {
   hostNames = getCacheValue('hostNames')
   if (hostNames.includes(...currentHostName)) return false
   doNotTranslateCode()
   mo.observe(body, option)
  const newhostNames= [...currentHostName, ...hostNames]
  setCacheValue('hostNames', newhostNames)
}, 'D')

//  环境探测
const envDetection = [
  unsafeWindow.Prism,
  unsafeWindow.hljs,
  unsafeWindow.prettyPrint
]
if (envDetection.some(item => !!item)) return false
const fontSize = getCacheValue('fontSize') || 16
const isApplyThemeChanges = getCacheValue('isApplyThemeChanges') || 'Yes'
const isApplyFontChanges = getCacheValue('isApplyFontChanges') || 'Yes'
const isGFW = getCacheValue('isGFW') || 'Fuck'
const isForcePreBackground =
  getCacheValue('isForcePreBackground') || 'Yes'

const getCurrentThemeBackground = styleText =>
  styleText.match(/background:(.*?)[;}]/)[1]

// 轮询
const poll = ({
  condition,
  resolve,
  reject = () => {},
  millisecond = 1000,
  retries = 1
}) => {
  if (condition()) return resolve()

  let time = 0
  const int = setInterval(() => {
    time++
    if (condition()) {
      clearInterval(int)
      return resolve()
    } else if (time > retries) {
      clearInterval(int)
      return reject()
    }
  }, millisecond)
  const stop = () => {
    clearInterval(int)
  }
  return stop
}

const fetchStyleText = url =>
  fetch(url, {
    headers: {
      'Content-Type': 'text/plain'
    }
  }).then(response => {
    return response.text()
  })

// 获取并设置样式
const setStyle = () => {
  // 获取主题样式并添加
  const themeStyle = getCacheValue(currentTheme)

  if (themeStyle) {
    GM_addStyle(themeStyle)
  } else {
    const themeUrl =
      this.GFW === 'Fuck'
        ? `https://cdn.bootcss.com/highlight.js/9.15.10/styles/${currentTheme}.min.css`
        : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/${currentTheme}.min.css`
    fetchStyleText(themeUrl).then(style => {
      GM_addStyle(style)
      setCacheValue(currentTheme, style)
    })
  }

  // 获取字体样式并添加
  const fontStyle = getCacheValue(currentFont)
  if (fontStyle) {
    GM_addStyle(fontStyle)
  } else {
    const fontUrl = isGFW
      ? `https://fonts.loli.net/css?family=${currentFont}&display=swap`
      : `https://fonts.googleapis.com/css?family=${currentFont}&display=swap`

    fetchStyleText(fontUrl).then(style => {
      GM_addStyle(style)
      setCacheValue(currentFont, style)
    })
  }
}

//  为 code 片断应用 highlightBlock 并设置字体样式
const beautify = () => {
  setStyle()

  const font = new window.FontFaceObserver(currentFont)
  font.load().then(
    () => {
      log('Font is available')
      for (const pre of Array.from(document.querySelectorAll('pre'))) {
        const code = pre.querySelector('code')
        if (isApplyThemeChanges && code) {
          code.classList.remove('language-text')
          window.hljs.highlightBlock(code)
        }
        if (isApplyFontChanges === 'Yes' && code) {
          code.style.fontFamily = currentFont
          code.style.fontSize = `${fontSize}px`
        }
        if (isForcePreBackground === 'Yes') {
          pre.style.background = getCurrentThemeBackground(
            getCacheValue(currentTheme)
          )
        }
      }
    },
    () => {
      log('Font is not available')
    }
  )
}

// 设置页
let parasitifer = null
const openSetting = () => {
  // 非首次调用
  if (parasitifer) {
    parasitifer.show()
    return true
  }

  parasitifer = document.createElement('div') // 此 DOM 节点将用作 shadowDOM 的载体被插入宿主的 DOM 节点中.
  parasitifer.id = 'host-element'
  parasitifer.style = `position: fixed;top:0;bottom:0;z-index:9999;width:100vw;height:100vh;font-size:16px;background-color:#fff;`
  parasitifer.show = () => {
    parasitifer.style.display = 'block'
  }
  parasitifer.hide = () => {
    parasitifer.style.display = 'none'
  }

  const shadowRoot = parasitifer.attachShadow({ mode: 'open' })
  // 此节点将成为 shadowDOM 的直接子元素, 包裹一切, 所以用 HTML 元素很合适.
  // 不仅仅是语义上的合适, 大多数的 UI 库都需要一个结构完整的 DOM 树用来做自适应布局.
  const shadowContent = document.createElement('HTML')
  const shadowStyleEle = document.createElement('style')
  const bulmaStyleEle = document.createElement('style')
  const fontStyleEle = document.createElement('style')
  const themeStyleEle = document.createElement('style')
  const vueContainer = document.createElement('div') // 这个 DOM 节点不会显示在 DOM 树中, 而是作为 vue 的挂载点,同来渲染 vue 的模板.
  vueContainer.id = 'vue-root'
  // shadow DOM 的样式作用域隔离是非常实用的特性, 完全不受宿主环境影响的样式, 轻盈的开始
  shadowStyleEle.innerText = ``
  shadowContent.appendChild(shadowStyleEle)
  shadowContent.appendChild(bulmaStyleEle)
  shadowContent.appendChild(fontStyleEle)
  shadowContent.appendChild(themeStyleEle)
  shadowContent.appendChild(vueContainer)
  shadowRoot.appendChild(shadowContent)
  document.body.appendChild(parasitifer)

  const mount = style => {
    bulmaStyleEle.innerText = style

    const vueRoot = document
      .querySelector('#host-element')
      .shadowRoot.querySelector('#vue-root')
    // 这里使用 body 元素 作为父节点, 结合上面创造的 HTML 元素是为了给 UI 组件一个完整的上下文环境, 就像在一个新的 HTML 页面中一样.
    const vueTemplate = `<body style="height: 100vh">
    <div id="app-vue" class="container">
        <div class="columns is-vcentered is-centered">
            <div class="column is-3">
                <section>
                    <b-field label="Themes">
                        <b-select placeholder="Select a name" @input="changeTheme" v-model="current.theme" rounded>
                            <option v-for="(item, index) in themes" :value="item" :key="index">
                                {{item}}
                            </option>
                        </b-select>
                    </b-field>
                    <b-field label="Monospace Fonts">
                        <b-select placeholder="Select a name" @input="changeFont" v-model="current.font" rounded>
                            <option v-for="(item, index) in fonts" :value="item" :key="index">
                                {{item}}
                            </option>
                        </b-select>
                    </b-field>
                    <b-field label="Font Size">
                        <b-slider v-model="fontSize" @input="changeFontSize"></b-slider>
                    </b-field>
                    <b-field label="Apply theme changes">
                        <b-switch v-model="isApplyThemeChanges" true-value="Yes" false-value="No">
                            {{ isApplyThemeChanges }}
                        </b-switch>
                    </b-field>
                    <b-field label="Apply font changes">
                        <b-switch v-model="isApplyFontChanges" true-value="Yes" false-value="No">
                            {{ isApplyFontChanges }}
                        </b-switch>
                    </b-field>
                    <b-field label="Force theme background colors">
                        <b-switch v-model="isForcePreBackground" true-value="Yes" false-value="No">
                            {{ isForcePreBackground }}
                        </b-switch>
                    </b-field>
                    <b-field label="铁幕重重困青年">
                        <b-switch v-model="isGFW" true-value="Fuck" false-value="No thank you">
                            {{ isGFW }}
                        </b-switch>
                    </b-field>
                </section>
                <section style="margin-top:30px;">
                    <b-button type="is-primary" rounded @click="apply">Apply</b-button>
                    <b-button type="is-warning" rounded @click="close">Close</b-button>
                    <b-button type="is-danger" rounded @click="reset">Reset</b-button>
                </section>
            </div>
            <div class="column">
                <section style="overflow:hidden;">
                    <h1 class="has-text-centered">Real-time preview</h1>
                    <pre class="has-text-left" :style="styles.pre" ref="pre">
                    <code :style="styles.code" ref="code">
import something from 'something'

// 获取并设置样式
const setStyle = () => {
  // 获取主题样式并添加
  const themeStyle = GM_getValue(hashString(currentTheme))

  if (themeStyle) {
    GM_addStyle(themeStyle)
  } else {
    const themeUrl = \`https://cdn.bootcss.com/highlight.js/9.15.10/styles/\${currentTheme}.min.css\`

    fetchStyleText(themeUrl).then(style => {
      GM_addStyle(style)
      GM_setValue(hashString(currentTheme), style)
    })
  }
}

export default something

                    </code>
                </pre>
                </section>
            </div>
        </div>
    </div>
</body>
`
    const vm = new window.Vue({
      el: vueRoot,
      template: vueTemplate,
      data () {
        return {
          current: {
            theme: currentTheme,
            font: currentFont
          },
          styles: {
            pre: {
              maxWidth: '952px',
              maxHeight: '631px',
              overflow: 'hidden',
            },
            code: {
              overflow: 'hidden',
              fontSize: `${fontSize}px`,
              fontFamily: currentFont
            }
          },
          fontSize: fontSize,
          themes: themes,
          fonts: fonts,
          isApplyThemeChanges: isApplyThemeChanges,
          isApplyFontChanges: isApplyFontChanges,
          isForcePreBackground: isForcePreBackground,
          isGFW: isGFW,
          defaultBackground: ''
        }
      },
      watch: {
        isForcePreBackground (value) {
          log(value)
          if (value === 'No') {
            this.$refs.pre.style.background = this.defaultBackground
          } else {
            poll({
              condition: () => hasCacheValue(this.current.theme),
              resolve: () => {
                this.$refs.pre.style.background = getCurrentThemeBackground(
                  getCacheValue(this.current.theme)
                )
              },
              millisecond: 1000,
              retries: 5
            })
          }
        }
      },
      methods: {
        reset () {
          this.fontSize = 16
          this.isApplyThemeChanges = 'Yes'
          this.isApplyFontChanges = 'Yes'
          this.isForcePreBackground = 'No'
          this.isGFW = 'Fuck'
          this.current.theme = 'atom-one-dark'
          this.current.font = 'Fira Code'
          this.changeTheme(this.current.theme)
          this.changeFont(this.current.font)
        },
        apply () {
          setCacheValue('fontSize', this.fontSize)
          setCacheValue('isApplyThemeChanges', this.isApplyThemeChanges)
          setCacheValue('isApplyFontChanges', this.isApplyFontChanges)
          setCacheValue(
            'isForcePreBackground',
            this.isForcePreBackground
          )
          setCacheValue('isGFW', this.isGFW)
          setCacheValue('currentTheme', this.current.theme)
          setCacheValue('currentFont', this.current.font)
        },
        close () {
          parasitifer.hide()
        },
        changeTheme (value) {
          if (this.isApplyThemeChanges === 'No') return false

          const doChangeTheme = (thmemName, themeStyle) => {
            themeStyleEle.innerText = themeStyle

            if (this.isForcePreBackground === 'Yes') {
              log(getCurrentThemeBackground(
                themeStyle
              ))
              this.$refs.pre.style.background = getCurrentThemeBackground(
                themeStyle
              )
              log(getCurrentThemeBackground(themeStyle))
            }

            window.hljs.highlightBlock(this.$refs.code)
          }

          if (hasCacheValue(value)) {
            doChangeTheme(value, getCacheValue(value))
            log(`get theme: ${value} in cache`)
          } else {
            const url =
              this.GFW === 'Fuck'
                ? `https://cdn.bootcss.com/highlight.js/9.15.10/styles/${value}.min.css`
                : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/${value}.min.css`
            log(url)
            fetchStyleText(url).then(style => {
              setCacheValue(value, style)
              doChangeTheme(value, style)
            })
          }
          log('current theme', this.current.theme)
        },
        changeFont (value) {
          if (this.isApplyFontChanges === 'No') return false

          const doChangeFont = (fontName, fontStyle) => {
            fontStyleEle.innerText = fontStyle
            this.styles.code.fontFamily = fontName
          }

          if (hasCacheValue(value)) {
            doChangeFont(value, getCacheValue(value))
            log(`get font: ${value} in cache`)
          } else {
            const url =
              this.GFW === 'Fuck'
                ? `https://fonts.loli.net/css?family=${value}&display=swap`
                : `https://fonts.googleapis.com/css?family=${value}&display=swap`
            fetchStyleText(url).then(style => {
              log('font style:', style)
              setCacheValue(value, style)
              doChangeFont(value, style)
            })
          }
          log(value)
        },
        changeFontSize (value) {
          if (this.isApplyFontChanges === 'No') return false
          log(value)
          this.styles.code.fontSize = `${value}px`
        }
      },
      mounted () {
        this.defaultBackground = this.$refs.pre.style.background
        this.changeTheme(this.current.theme)
        this.changeFont(this.current.font)
      }
    })
    log('Setting is mounted')
  }

  // 获取 bulmaStyle, 并挂载 设置页
  const bulmaStyle = getCacheValue('bulmaStyle')
  if (bulmaStyle) {
    mount(bulmaStyle)
  } else {
    const bulmaUrl = 'https://unpkg.com/buefy/dist/buefy.min.css'
    fetchStyleText(bulmaUrl).then(style => {
      mount(style)
      setCacheValue('bulmaStyle', style)
    })
  }
}

// 注册设置页
GM_registerMenuCommand('Open Setting', openSetting, 'SH')


beautify()
log('highlight runing')
