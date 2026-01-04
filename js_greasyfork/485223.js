// ==UserScript==
// @name            SVG Symbol Exhibitor
// @name:zh         SVG 图标展示器
// @namespace       https://github.com/pansong291/
// @version         0.1.5
// @description     Show all the SVG symbols on the page.
// @description:zh  显示页面上的所有 SVG 图标。
// @author          paso
// @license         Apache-2.0
// @match           *://*/*
// @icon            https://www.w3.org/Graphics/SVG/svglogo.svg
// @grant           none
// @run-at          context-menu
// @require         https://update.greasyfork.org/scripts/473443/1374764/popup-inject.js
// @downloadURL https://update.greasyfork.org/scripts/485223/SVG%20Symbol%20Exhibitor.user.js
// @updateURL https://update.greasyfork.org/scripts/485223/SVG%20Symbol%20Exhibitor.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const namespace = `paso-svg-symbol-exhibitor-${Date.now()}`

  function loadJs(src) {
    return new Promise(resolve => {
      const jsEl = document.createElement('script')
      jsEl.src = src
      jsEl.onload = resolve
      document.head.appendChild(jsEl)
    })
  }

  function getId(elm) {
    return elm?.id ? `#${elm.id}` : ''
  }

  function getClassNames(elm) {
    let name = ''
    elm?.classList?.forEach((v) => name += '.' + v)
    return name
  }

  loadJs('https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js').then(() =>
    window.paso.injectPopup({
      namespace,
      actionName: 'SVG Symbol Exhibitor',
      collapse: '70%',
      location: '40%',
      content: `<div id="${namespace}-app"></div>`,
      style: `
        <style>
            #${namespace}-app {
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-width: 80vw;
            }
            .input {
                min-width: 280px;
            }
            .action-row {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            .svg-display {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .svg-wrap {
                display: flex;
                flex-direction: column;
                background-color: white;
                border-radius: 8px;
                transition: box-shadow .3s;
            }
            .svg-wrap:hover {
                box-shadow: 0 8px 12px 4px rgba(0,0,0,0.06);
            }
            .svg-name {
                padding: 8px;
                font-size: 16px;
                font-weight: bold;
                user-select: none;
                cursor: pointer;
            }
            .svg-symbols {
                display: none;
                flex-wrap: wrap;
                padding: 8px;
            }
            .svg-wrap.open .svg-symbols {
                display: flex;
            }
            .svg-collapse-handle {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 4px;
                user-select: none;
                cursor: pointer;
            }
            .collapse-char {
                transform: rotate(-90deg);
                transition: transform .3s;
            }
            .svg-wrap.open .collapse-char {
                transform: rotate(90deg);
            }
            .icon-wrap {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                gap: 4px;
                border-radius: 4px;
                transition: background-color .3s;
            }
            .icon-wrap:hover {
                background-color: rgba(0,0,0,0.08);
            }
            .icon-wrap svg {
                font-size: 36px;
                fill: #666;
                color: #666;
            }
        </style>`
    })
  ).then(() => {
    const Icon = {
      props: {
        type: String
      },
      computed: {
        innerAttrs() {
          return {
            'xlink:href': `#${this.type}`
          }
        }
      },
      template: `
        <div class="icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" focusable="false">
            <use v-bind="innerAttrs" />
          </svg>
          <div class="monospace">{{type}}</div>
        </div>`
    }
    const SvgWrap = {
      components: {
        Icon
      },
      props: {
        svg: Object
      },
      emits: ['collapseChange'],
      methods: {
        onCollapseClick() {
          this.$emit('collapseChange', !this.svg.collapse)
        }
      },
      template: `
        <div class="svg-wrap" :class="{open: !svg.collapse}">
          <div class="svg-name monospace" @click="onCollapseClick">{{svg.name}}</div>
          <div class="svg-symbols">
            <Icon v-for="symbol in svg.symbols" :type="symbol" />
          </div>
          <div class="svg-collapse-handle" @click="onCollapseClick"><span class="collapse-char">&lt;</span></div>
        </div>`
    }
    window.Vue.createApp({
      components: {
        SvgWrap
      },
      data() {
        return {
          selector: 'svg',
          search: '',
          svgs: []
        }
      },
      computed: {
        result() {
          if (!this.search) return this.svgs
          const svgList = []
          for (let i = 0; i < this.svgs.length; i++) {
            const svg = this.svgs[i]
            const s = {
              id: svg.id,
              name: svg.name,
              collapse: svg.collapse,
              symbols: svg.symbols.filter(symbol => this.textSearch(symbol, this.search))
            }
            if (s.symbols.length) svgList.push(s)
          }
          return svgList
        }
      },
      methods: {
        onDisplayClick() {
          const svgElems = document.querySelectorAll(this.selector)
          const svgs = []
          for (let i = 0; i < svgElems.length; i++) {
            const svgElem = svgElems[i]
            const symbolsElems = svgElem.querySelectorAll(`${this.selector} > symbol`)
            if (symbolsElems.length) {
              const svg = {
                id: i,
                name: `${svgElem.localName}${getId(svgElem)}${getClassNames(svgElem)}`,
                collapse: false,
                symbols: []
              }
              for (let i = 0; i < symbolsElems.length; i++) {
                svg.symbols.push(symbolsElems[i].id)
              }
              svgs.push(svg)
            }
          }
          this.svgs = svgs
        },
        textSearch(source, target) {
          if (!source || !target) return false
          source = source.toLowerCase()
          target = target.toLowerCase()
          if (source.indexOf(target) >= 0) return true
          try {
            return new RegExp('\\b' + Array.from(target).join('([a-z0-9]*[^a-z0-9]+)?')).test(source)
          } catch (e) {
            return false
          }
        }
      },
      template: `
        <div class="action-row">
          <input class="input monospace" v-model="selector" placeholder="please enter a css selector">
          <button class="button" @click="onDisplayClick">Display</button>
          <input v-if="svgs.length" class="input monospace" v-model="search" placeholder="search">
        </div>
        <div class="svg-display">
          <SvgWrap v-for="svg in result" :svg="svg" @collapse-change="c => svgs[svg.id].collapse = c"/>
        </div>`
    }).mount(`#${namespace}-app`)
  })
})()
