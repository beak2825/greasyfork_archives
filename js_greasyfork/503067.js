// ==UserScript==
// @name              Toc Bar, auto-generating table of content
// @name:zh-CN        Toc Bar, 自动生成文章大纲。知乎、微信公众号等阅读好伴侣
// @author            hikerpig
// @namespace         https://github.com/hikerpig
// @license           MIT
// @description       A floating table of content widget
// @description:zh-CN [改了一下，支持多一点网站]自动生成文章大纲目录，在页面右侧展示一个浮动的组件。覆盖常用在线阅读资讯站（技术向）。github/medium/MDN/掘金/简书等
// @version           1.9.6
// @match             *://www.jianshu.com/p/*
// @match             *://cdn2.jianshu.io/p/*
// @match             *://zhuanlan.zhihu.com/p/*
// @match             *://www.zhihu.com/pub/reader/*
// @match             *://mp.weixin.qq.com/s*
// @match             *://cnodejs.org/topic/*
// @match             *://*zcfy.cc/article/*
// @match             *://juejin.cn/post/*
// @match             *://juejin.cn/book/*
// @match             *://dev.to/*/*
// @exclude           *://dev.to/settings/*
// @match             *://web.dev/*
// @match             *://medium.com/*
// @exclude           *://medium.com/media/*
// @match             *://itnext.io/*
// @match             *://python-patterns.guide/*
// @match             *://www.mysqltutorial.org/*
// @match             *://en.wikipedia.org/*
// @match             *://vuejs.org/*
// @match             *://docs.python.org/*
// @match             *://packaging.python.org/*
// @match             *://*.readthedocs.io/*
// @match             *://docs.djangoproject.com/*
// @match             *://www.cnblogs.com/*
// @match             *://bigsearcher.com/*
// @match             *://ffmpeg.org/*
// @match             *://www.ruanyifeng.com/*
// @match             *://stackoverflow.blog/*
// @match             *://realpython.com/*
// @match             *://www.infoq.cn/article/*
// @match             *://towardsdatascience.com/*
// @match             *://hackernoon.com/*
// @match             *://css-tricks.com/*
// @match             *://www.smashingmagazine.com/*/*
// @match             *://distill.pub/*
// @match             *://github.com/*/*
// @match             *://github.com/*/issues/*
// @match             *://developer.mozilla.org/*/docs/*
// @match             *://learning.oreilly.com/library/view/*
// @match             *://developer.chrome.com/extensions/*
// @match             *://app.getpocket.com/read/*
// @match             *://indepth.dev/posts/*
// @match             *://gitlab.com/*
// @match             *://10.0.68.37/*
// @match             *://10.0.34.61/*
// @run-at            document-idle
// @grant             GM_getResourceText
// @grant             GM_addStyle
// @grant             GM_setValue
// @grant             GM_getValue
// @require           https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.18.2/tocbot.min.js
// @icon              https://raw.githubusercontent.com/hikerpig/toc-bar-userscript/master/toc-logo.svg
// @homepageURL       https://github.com/hikerpig/toc-bar-userscript
// @downloadURL https://update.greasyfork.org/scripts/503067/Toc%20Bar%2C%20auto-generating%20table%20of%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/503067/Toc%20Bar%2C%20auto-generating%20table%20of%20content.meta.js
// ==/UserScript==

(function () {
  /**
   * @typedef {Object} SiteSetting
   * @property {string} contentSelector
   * @property {string} siteName
   * @property {Object} style
   * @property {Number} scrollSmoothOffset
   * @property {Number} initialTop
   * @property {Number} headingsOffset
   * @property {() => Boolean} shouldShow
   * @property {(ele) => HTMLElement} findHeaderId
   * @property {(e) => void} onClick
   * @property {(tocBar: TocBar) => void} onInit
   */

  /** @type {{[key: string]: Partial<SiteSetting>}} */
  const SITE_SETTINGS = {
    jianshu: {
      contentSelector: '.ouvJEz',
      style: {
        top: '55px',
        color: '#ea6f5a',
      },
    },
    'zhuanlan.zhihu.com': {
      contentSelector: 'article',
      scrollSmoothOffset: -52,
      shouldShow() {
        return location.pathname.startsWith('/p/')
      },
    },
    'www.zhihu.com': {
      contentSelector: '.reader-chapter-content',
      scrollSmoothOffset: -52,
    },
    zcfy: {
      contentSelector: '.markdown-body',
    },
    qq: {
      contentSelector: '.rich_media_content',
    },
    'juejin.cn': function() {
      let contentSelector = '.article' // post
      if (/\/book\//.test(location.pathname)) {
        contentSelector = '.book-body'
      }
      return {
        contentSelector,
      }
    },
    'dev.to': {
      contentSelector: 'article',
      scrollSmoothOffset: -56,
      shouldShow() {
        return ['/search', '/top/'].every(s => !location.pathname.startsWith(s))
      },
    },
    'medium.com': {
      contentSelector: 'article'
    },
    'docs.djangoproject.com': {
      contentSelector: '#docs-content'
    },
    'hackernoon.com': {
      contentSelector: 'main',
      scrollSmoothOffset: -80,
    },
    'towardsdatascience.com': {
      contentSelector: 'article'
    },
    'css-tricks.com': {
      contentSelector: 'main'
    },
    'distill.pub': {
      contentSelector: 'body'
    },
    'smashingmagazine': {
      contentSelector: 'article'
    },
    'web.dev': {
      contentSelector: '#content'
    },
    'python-patterns.guide': {
      contentSelector: '.section',
    },
    'www.mysqltutorial.org': {
      contentSelector: 'article',
    },
    'github.com': function () {
      const README_SEL = '.entry-content'
      const WIKI_CONTENT_SEL = '#wiki-body'
      const ISSUE_CONTENT_SEL = '.comment .comment-body'

      const matchedSel = [README_SEL, ISSUE_CONTENT_SEL, WIKI_CONTENT_SEL].find((sel) => {
        const c = document.querySelector(sel)
        if (c) {
          return true
        }
      })

      if (!matchedSel) {
        return {
          contentSelect: false,
        }
      }

      const isIssueDetail = /\/issues\//.test(location.pathname)
      const ISSUE_DETAIL_HEADING_OFFSET = 60

      /** Ugly hack for github issues */
      const onClick = isIssueDetail ? function (e) {
        const href = e.target.getAttribute('href')
        const header = document.body.querySelector(href)
        if (header) {
          const rect = header.getBoundingClientRect()
          const currentWindowScrollTop = document.documentElement.scrollTop
          const scrollY = rect.y + currentWindowScrollTop - ISSUE_DETAIL_HEADING_OFFSET

          window.scrollTo(0, scrollY)

          location.hash = href

          e.preventDefault()
          e.stopPropagation()
        }
      }: null

      return {
        siteName: 'github.com',
        contentSelector: matchedSel,
        hasInnerContainers: isIssueDetail ? true: false,
        scrollSmoothOffset: isIssueDetail ? -ISSUE_DETAIL_HEADING_OFFSET: 0,
        headingsOffset: isIssueDetail ? ISSUE_DETAIL_HEADING_OFFSET: 0,
        initialTop: 500,
        onClick,
        findHeaderId(ele) {
          let id
          let anchor = ele.querySelector('.anchor')
          if (anchor) id = anchor.getAttribute('id')

          if (!anchor) {
            anchor = ele.querySelector('a')
            if (anchor) id = anchor.hash.replace(/^#/, '')
          }
          return id
        },
      }
    },
    'developer.mozilla.org': {
      contentSelector: '#content',
      onInit() {
        setTimeout(() => {
          tocbot.refresh()
        }, 2000)
      }
    },
    'learning.oreilly.com': {
      contentSelector: '#sbo-rt-content'
    },
    'developer.chrome.com': {
      contentSelector: 'article'
    },
    'www.infoq.cn': {
      contentSelector: '.article-main',
      scrollSmoothOffset: -107
    },
    'app.getpocket.com': {
      contentSelector: '[role=main]',
    },
    'indepth.dev': {
      contentSelector: '.content',
    },
    'gitlab.com': {
      contentSelector:  '.file-content',
      scrollSmoothOffset: -40
    },
    'docs.celeryproject.org': {
      contentSelector: '[role=main]',
    },
    'docs.python.org': {
      contentSelector: '[role=main]',
    },
    'packaging.python.org': {
      contentSelector: '[role=main]',
    },
    'readthedocs.io': {
      contentSelector: '[role=main]',
    },
    'bigsearcher.com': {
      contentSelector: 'body',
    },
    'ffmpeg.org': {
      contentSelector: '#page-content-wrapper',
    },
    'www.ruanyifeng.com': {
      contentSelector: 'article',
    },
    'realpython.com': {
      contentSelector: '.main-content',
    },
    'en.wikipedia.org': {
      contentSelector: '#content',
    },
    'www.cnblogs.com': {
      contentSelector: '#main',
    },
    'stackoverflow.blog': {
      contentSelector: 'article',
    },
    'vuejs.org': {
      contentSelector: 'main > div',
    },
    '10.0.68.37': {
      contentSelector:  '.file-content',
      scrollSmoothOffset: -40
    },
    '10.0.34.61': {
      contentSelector:  '.file-content',
      scrollSmoothOffset: -40
    },
  }

  function getSiteInfo() {
    let siteName
    if (SITE_SETTINGS[location.hostname]) {
      siteName = location.hostname;
    } else if (location.hostname.indexOf('readthedocs.io') > -1) {
      siteName = 'readthedocs.io';
    } else {
      const match = location.href.match(
        /([\d\w]+)\.(com|cn|net|org|im|io|cc|site|tv)/i
      )
      siteName = match ? match[1] : null
    }
    if (siteName && SITE_SETTINGS[siteName]) {
      return {
        siteName,
        siteSetting: SITE_SETTINGS[siteName],
      }
    }
  }

  function getPageTocOptions() {
    let siteInfo = getSiteInfo()
    if (siteInfo) {
      if (typeof siteInfo.siteSetting === 'function') {
        return siteInfo.siteSetting()
      }

      let siteSetting = { ...siteInfo.siteSetting }
      if (siteSetting.shouldShow && !siteSetting.shouldShow()) {
        return
      }
      if (typeof siteSetting.contentSelector === 'function') {
        const contentSelector = siteSetting.contentSelector()
        if (!contentSelector) return
        siteSetting = {...siteSetting, contentSelector}
      }
      if (typeof siteSetting.scrollSmoothOffset === 'function') {
        siteSetting.scrollSmoothOffset = siteSetting.scrollSmoothOffset()
      }

      console.log('[toc-bar] found site info for', siteInfo.siteName)
      return siteSetting
    }
  }

  function guessThemeColor() {
    const meta = document.head.querySelector('meta[name="theme-color"]')
    if (meta) {
      return meta.getAttribute('content')
    }
  }

  /**
   * @param {String} content
   * @return {String}
   */
  function doContentHash(content) {
    const val = content.split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
    return val.toString(32)
  }

  const POSITION_STORAGE = {
    cache: null,
    checkCache() {
      if (!POSITION_STORAGE.cache) {
        POSITION_STORAGE.cache = GM_getValue('tocbar-positions', {})
      }
    },
    get(k) {
      k = k || location.host
      POSITION_STORAGE.checkCache()
      return POSITION_STORAGE.cache[k]
    },
    set(k, position) {
      k = k || location.host
      POSITION_STORAGE.checkCache()
      POSITION_STORAGE.cache[k] = position
      GM_setValue('tocbar-positions', POSITION_STORAGE.cache)
    },
  }

  function isEmpty(input) {
    if (input) {
      return Object.keys(input).length === 0
    }
    return true
  }

  /** 宽度，也用于计算拖动时的最小 right */
  const TOC_BAR_WIDTH = 340

  const TOC_BAR_DEFAULT_ACTIVE_COLOR = '#54BC4B';

  // ---------------- TocBar ----------------------
  const TOC_BAR_STYLE = `
.toc-bar {
  --toc-bar-active-color: ${TOC_BAR_DEFAULT_ACTIVE_COLOR};
  --toc-bar-text-color: #333;
  --toc-bar-background-color: #FEFEFE;

  position: fixed;
  z-index: 9000;
  right: 5px;
  top: 80px;
  width: ${TOC_BAR_WIDTH}px;
  font-size: 14px;
  box-sizing: border-box;
  padding: 0 10px 10px 0;
  box-shadow: 0 1px 3px #DDD;
  border-radius: 4px;
  transition: width 0.2s ease;
  color: var(--toc-bar-text-color);
  background: var(--toc-bar-background-color);

  user-select:none;
  -moz-user-select:none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.toc-bar[colorscheme="dark"] {
  --toc-bar-text-color: #fafafa;
  --toc-bar-background-color: #333;
}
.toc-bar[colorscheme="dark"] svg {
  fill: var(--toc-bar-text-color);
  stroke: var(--toc-bar-text-color);
}

.toc-bar.toc-bar--collapsed {
  width: 30px;
  height: 30px;
  padding: 0;
  overflow: hidden;
}

.toc-bar--collapsed .toc {
  display: none;
}

.toc-bar--collapsed .hidden-when-collapsed {
  display: none;
}

.toc-bar__header {
  font-weight: bold;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.toc-bar__refresh {
  position: relative;
  top: -2px;
}

.toc-bar__icon-btn {
  height: 1em;
  width: 1em;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.toc-bar__icon-btn:hover {
  opacity: 0.7;
}

.toc-bar__icon-btn svg {
  max-width: 100%;
  max-height: 100%;
  vertical-align: top;
}

.toc-bar__actions {
  align-items: center;
}
.toc-bar__actions .toc-bar__icon-btn {
  margin-left: 1em;
}

.toc-bar__scheme {
  transform: translateY(-1px) scale(1.1);
}

.toc-bar__header-left {
  align-items: center;
}

.toc-bar__toggle {
  cursor: pointer;
  padding: 8px 8px;
  box-sizing: content-box;
  transition: transform 0.2s ease;
}

.toc-bar__title {
  margin-left: 5px;
}

.toc-bar a.toc-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  line-height: 1.6;
}

.flex {
  display: flex;
}

/* tocbot related */
.toc-bar__toc {
  max-height: 80vh;
  overflow-y: auto;
}

.toc-list-item > a:hover {
  text-decoration: underline;
}

.toc-list {
  padding-inline-start: 0;
}

.toc-bar__toc > .toc-list {
  margin: 0;
  overflow: hidden;
  position: relative;
  padding-left: 5px;
}

.toc-bar__toc>.toc-list li {
  list-style: none;
  padding-left: 8px;
  position: static;
}

a.toc-link {
  color: currentColor;
  height: 100%;
}

.is-collapsible {
  max-height: 1000px;
  overflow: hidden;
  transition: all 300ms ease-in-out;
}

.is-collapsed {
  max-height: 0;
}

.is-position-fixed {
  position: fixed !important;
  top: 0;
}

.is-active-link {
  font-weight: 700;
}

.toc-link::before {
  background-color: var(--toc-bar-background-color);
  content: ' ';
  display: inline-block;
  height: inherit;
  left: 0;
  margin-top: -1px;
  position: absolute;
  width: 2px;
}

.is-active-link::before {
  background-color: var(--toc-bar-active-color);
}

.toc-list-item,
.toc-link {
  font-size: 1em; /* reset font size */
}


@media print {
  .toc-bar__no-print { display: none !important; }
}
/* end tocbot related */
`

  const TOCBOT_CONTAINTER_CLASS = 'toc-bar__toc'

  const DARKMODE_KEY = 'tocbar-darkmode'

  /**
   * @typedef {Object} TocBarOptions
   * @property {String} [siteName]
   * @property {Number} [initialTop]
   */

  /**
   * @class
   * @param {TocBarOptions} options
   */
  function TocBar(options={}) {
    this.options = options

    // inject style
    GM_addStyle(TOC_BAR_STYLE)

    this.element = document.createElement('div')
    this.element.id = 'toc-bar'
    this.element.classList.add('toc-bar', 'toc-bar__no-print')
    document.body.appendChild(this.element)

    /** @type {Boolean} */
    this.visible = true

    this.initHeader()

    // create a container tocbot
    const tocElement = document.createElement('div')
    this.tocElement = tocElement
    tocElement.classList.add(TOCBOT_CONTAINTER_CLASS)
    this.element.appendChild(tocElement)

    POSITION_STORAGE.checkCache()
    const cachedPosition = POSITION_STORAGE.get(options.siteName)
    if (!isEmpty(cachedPosition)) {
      this.element.style.top = `${Math.max(0, cachedPosition.top)}px`
      this.element.style.right = `${cachedPosition.right}px`
    } else if (options.hasOwnProperty('initialTop')) {
      this.element.style.top = `${options.initialTop}px`
    }

    if (GM_getValue('tocbar-hidden', false)) {
      this.toggle(false)
    }

    const isDark = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    /** @type {Boolean} */
    this.isDarkMode = isDark

    if (GM_getValue(DARKMODE_KEY, false)) {
      this.toggleScheme(true)
    }
  }

  const REFRESH_ICON = `<svg t="1593614403764" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5002" width="200" height="200"><path d="M918 702.8 918 702.8c45.6-98.8 52-206 26-303.6-30-112.4-104-212.8-211.6-273.6L780 23.2l-270.8 70.8 121.2 252.4 50-107.6c72.8 44.4 122.8 114.4 144 192.8 18.8 70.8 14.4 147.6-18.8 219.6-42 91.2-120.8 153.6-210.8 177.6-13.2 3.6-26.4 6-39.6 8l56 115.6c5.2-1.2 10.4-2.4 16-4C750.8 915.2 860 828.8 918 702.8L918 702.8M343.2 793.2c-74-44.4-124.8-114.8-146-194-18.8-70.8-14.4-147.6 18.8-219.6 42-91.2 120.8-153.6 210.8-177.6 14.8-4 30-6.8 45.6-8.8l-55.6-116c-7.2 1.6-14.8 3.2-22 5.2-124 33.2-233.6 119.6-291.2 245.6-45.6 98.8-52 206-26 303.2l0 0.4c30.4 113.2 105.2 214 213.6 274.8l-45.2 98 270.4-72-122-252L343.2 793.2 343.2 793.2M343.2 793.2 343.2 793.2z" p-id="5003"></path></svg>`

  const TOC_ICON = `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 1024 1024" style="enable-background:new 0 0 1024 1024;" xml:space="preserve">
<g>
  <g>
    <path d="M835.2,45.9H105.2v166.8l93.2,61.5h115.8H356h30.6v-82.8H134.2v-24.9h286.2v107.6h32.2V141.6H134.2V118h672.1v23.6H486.4
      v132.5h32V166.5h287.8v24.9H553.8v82.8h114.1H693h225.6V114.5L835.2,45.9z M806.2,93.2H134.2V67.2h672.1v26.1H806.2z"/>
    <polygon points="449.3,1008.2 668,1008.2 668,268.9 553.8,268.9 553.8,925.4 518.4,925.4 518.4,268.9 486.4,268.9 486.4,925.4
      452.6,925.4 452.6,268.9 420.4,268.9 420.4,925.4 386.6,925.4 386.6,268.9 356,268.9 356,946.7 		"/>
  </g>
</g>
</svg>
`

  const LIGHT_ICON = `
  <?xml version="1.0" encoding="iso-8859-1"?>
  <!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 181.328 181.328" style="enable-background:new 0 0 181.328 181.328;" xml:space="preserve" style="transform: translateY(-1px);">
  <g>
    <path d="M118.473,46.308V14.833c0-4.142-3.358-7.5-7.5-7.5H70.357c-4.142,0-7.5,3.358-7.5,7.5v31.474
      C51.621,54.767,44.34,68.214,44.34,83.331c0,25.543,20.781,46.324,46.324,46.324s46.324-20.781,46.324-46.324
      C136.988,68.215,129.708,54.769,118.473,46.308z M77.857,22.333h25.615v16.489c-4.071-1.174-8.365-1.815-12.809-1.815
      c-4.443,0-8.736,0.642-12.807,1.814V22.333z M90.664,114.655c-17.273,0-31.324-14.052-31.324-31.324
      c0-17.272,14.052-31.324,31.324-31.324s31.324,14.052,31.324,31.324C121.988,100.604,107.937,114.655,90.664,114.655z"/>
    <path d="M40.595,83.331c0-4.142-3.358-7.5-7.5-7.5H7.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h25.595
      C37.237,90.831,40.595,87.473,40.595,83.331z"/>
    <path d="M173.828,75.831h-25.595c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h25.595c4.142,0,7.5-3.358,7.5-7.5
      C181.328,79.189,177.97,75.831,173.828,75.831z"/>
    <path d="M44.654,47.926c1.464,1.465,3.384,2.197,5.303,2.197c1.919,0,3.839-0.732,5.303-2.197c2.929-2.929,2.929-7.678,0-10.606
      L37.162,19.222c-2.929-2.93-7.678-2.929-10.606,0c-2.929,2.929-2.929,7.678,0,10.606L44.654,47.926z"/>
    <path d="M136.674,118.735c-2.93-2.929-7.678-2.928-10.607,0c-2.929,2.929-2.928,7.678,0,10.607l18.1,18.098
      c1.465,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197c2.929-2.929,2.928-7.678,0-10.607L136.674,118.735z"/>
    <path d="M44.654,118.736l-18.099,18.098c-2.929,2.929-2.929,7.677,0,10.607c1.464,1.465,3.384,2.197,5.303,2.197
      c1.919,0,3.839-0.732,5.303-2.197l18.099-18.098c2.929-2.929,2.929-7.677,0-10.606C52.332,115.807,47.583,115.807,44.654,118.736z"
      />
    <path d="M131.371,50.123c1.919,0,3.839-0.732,5.303-2.196l18.1-18.098c2.929-2.929,2.929-7.678,0-10.607
      c-2.929-2.928-7.678-2.929-10.607-0.001l-18.1,18.098c-2.929,2.929-2.929,7.678,0,10.607
      C127.532,49.391,129.452,50.123,131.371,50.123z"/>
    <path d="M90.664,133.4c-4.142,0-7.5,3.358-7.5,7.5v25.595c0,4.142,3.358,7.5,7.5,7.5c4.142,0,7.5-3.358,7.5-7.5V140.9
      C98.164,136.758,94.806,133.4,90.664,133.4z"/>
  </g>
  </svg>
`

  TocBar.prototype = {
    /**
     * @method TocBar
     */
    initHeader() {
      const header = document.createElement('div')
      header.classList.add('toc-bar__header')
      header.innerHTML = `
    <div class="flex toc-bar__header-left">
      <div class="toc-bar__toggle toc-bar__icon-btn" title="Toggle TOC Bar">
        ${TOC_ICON}
      </div>
      <div class="toc-bar__title hidden-when-collapsed">TOC Bar</div>
    </div>
    <div class="toc-bar__actions flex hidden-when-collapsed">
      <div class="toc-bar__scheme toc-bar__icon-btn" title="Toggle Light/Dark Mode">
        ${LIGHT_ICON}
      </div>
      <div class="toc-bar__refresh toc-bar__icon-btn" title="Refresh TOC">
        ${REFRESH_ICON}
      </div>
    </div>
    `
      const toggleElement = header.querySelector('.toc-bar__toggle')
      toggleElement.addEventListener('click', () => {
        this.toggle()
        GM_setValue('tocbar-hidden', !this.visible)
      })
      this.logoSvg = toggleElement.querySelector('svg')

      const refreshElement = header.querySelector('.toc-bar__refresh')
      refreshElement.addEventListener('click', () => {
        try {
          tocbot.refresh()
        } catch (error) {
          console.warn('error in tocbot.refresh', error)
        }
      })

      const toggleSchemeElement = header.querySelector('.toc-bar__scheme')
      toggleSchemeElement.addEventListener('click', () => {
        this.toggleScheme()
      })
      // ---------------- header drag ----------------------
      const dragState = {
        startMouseX: 0,
        startMouseY: 0,
        startPositionX: 0,
        startPositionY: 0,
        startElementDisToRight: 0,
        isDragging: false,
        curRight: 0,
        curTop: 0,
      }

      const onMouseMove = (e) => {
        if (!dragState.isDragging) return
        const deltaX = e.pageX - dragState.startMouseX
        const deltaY = e.pageY - dragState.startMouseY
        // 要换算为 right 数字
        const newRight = Math.max(30 - TOC_BAR_WIDTH, dragState.startElementDisToRight - deltaX)
        const newTop = Math.max(0, dragState.startPositionY + deltaY)
        Object.assign(dragState, {
          curTop: newTop,
          curRight: newRight,
        })
        // console.table({ newRight, newTop})
        this.element.style.right = `${newRight}px`
        this.element.style.top = `${newTop}px`
      }

      const onMouseUp = () => {
        Object.assign(dragState, {
          isDragging: false,
        })
        document.body.removeEventListener('mousemove', onMouseMove)
        document.body.removeEventListener('mouseup', onMouseUp)

        POSITION_STORAGE.set(this.options.siteName, {
          top: dragState.curTop,
          right: dragState.curRight,
        })
      }

      header.addEventListener('mousedown', (e) => {
        if (e.target === toggleElement) return
        const bbox = this.element.getBoundingClientRect()
        Object.assign(dragState, {
          isDragging: true,
          startMouseX: e.pageX,
          startMouseY: e.pageY,
          startPositionX: bbox.x,
          startPositionY: bbox.y,
          startElementDisToRight: document.body.clientWidth - bbox.right,
        })
        document.body.addEventListener('mousemove', onMouseMove)
        document.body.addEventListener('mouseup', onMouseUp)
      })
      // ----------------end header drag -------------------

      this.element.appendChild(header)
    },
    /**
     * @method TocBar
     * @param {SiteSetting} options
     */
    initTocbot(options) {
      const me = this

      /**
       * records for existing ids to prevent id conflict (when there are headings of same content)
       * @type {Object} {[key: string]: number}
       **/
      this._tocContentCountCache = {}

      const tocbotOptions = Object.assign(
        {},
        {
          tocSelector: `.${TOCBOT_CONTAINTER_CLASS}`,
          scrollSmoothOffset: options.scrollSmoothOffset || 0,
          headingObjectCallback(obj, ele) {
            // if there is no id on the header element, add one that derived from hash of header title
            // remove ¶ and # notation in headers text
            obj.textContent = obj.textContent.replace(/¶|#/g, '');
            if (!ele.id) {
              let newId
              if (options.findHeaderId) {
                newId = options.findHeaderId(ele)
              }
              if (!newId) {
                newId = me.generateHeaderId(obj, ele)
                ele.setAttribute('id', newId)
              }
              if (newId) obj.id = newId
            }
            return obj
          },
          headingSelector: 'h1, h2, h3, h4, h5',
          collapseDepth: 4,
        },
        options
      )
      // console.log('tocbotOptions', tocbotOptions);
      try {
        tocbot.init(tocbotOptions)
        if (options.onInit) {
          options.onInit(this)
        }
      } catch (error) {
        console.warn('error in tocbot.init', error)
      }
    },
    generateHeaderId(obj, ele) {
      const hash = doContentHash(obj.textContent)
      let count = 1
      let resultHash = hash
      if (this._tocContentCountCache[hash]) {
        count = this._tocContentCountCache[hash] + 1
        resultHash = doContentHash(`${hash}-${count}`)
      }
      this._tocContentCountCache[hash] = count
      return `tocbar-${resultHash}`
    },
    /**
     * @method TocBar
     */
    toggle(shouldShow = !this.visible) {
      const HIDDEN_CLASS = 'toc-bar--collapsed'
      const LOGO_HIDDEN_CLASS = 'toc-logo--collapsed'
      if (shouldShow) {
        this.element.classList.remove(HIDDEN_CLASS)
        this.logoSvg && this.logoSvg.classList.remove(LOGO_HIDDEN_CLASS)
      } else {
        this.element.classList.add(HIDDEN_CLASS)
        this.logoSvg && this.logoSvg.classList.add(LOGO_HIDDEN_CLASS)

        const right = parseInt(this.element.style.right)
        if (right && right < 0) {
          this.element.style.right = "0px"
          const cachedPosition = POSITION_STORAGE.cache
          if (!isEmpty(cachedPosition)) {
            POSITION_STORAGE.set(null, {...cachedPosition, right: 0 })
          }
        }
      }
      this.visible = shouldShow
    },
    /**
     * Toggle light/dark scheme
     * @method TocBar
     */
    toggleScheme(isDark) {
      const isDarkMode = typeof isDark === 'undefined' ? !this.isDarkMode: isDark
      this.element.setAttribute('colorscheme', isDarkMode ? 'dark': 'light')
      console.log('[toc-bar] toggle scheme', isDarkMode)
      this.isDarkMode = isDarkMode

      GM_setValue(DARKMODE_KEY, isDarkMode)
      this.refreshStyle()
    },
    refreshStyle() {
      const themeColor = guessThemeColor()
      if (themeColor && !this.isDarkMode) {
        this.element.style.setProperty('--toc-bar-active-color', themeColor);
      } else if (this.isDarkMode) {
        this.element.style.setProperty('--toc-bar-active-color', TOC_BAR_DEFAULT_ACTIVE_COLOR);
      }
    },
  }
  // ----------------end TocBar -------------------

  function main() {
      const options = getPageTocOptions()

      if (options) {
          const tocBar = new TocBar(options)
          tocBar.initTocbot(options)
          tocBar.refreshStyle()
      }

  }
  //main();
    setTimeout(main, 350);
})()
