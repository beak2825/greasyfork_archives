// ==UserScript==
// @name         BIT-补足页面标题
// @namespace    http://tampermonkey.net/
// @version      1.2.13
// @description  修改页面标题
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        https://*.bit.edu.cn/*
// @match        http://*.bit.edu.cn/*
// @match        https://www.yanhekt.cn/*
// @exclude      https://lexue.bit.edu.cn/*
// @exclude      https://www.bit.edu.cn/xww/*
// @exclude      https://webvpn.bit.edu.cn/*
// @exclude      http://jxzxehallapp.bit.edu.cn/*
// @exclude      https://jxzxehallapp.bit.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466252/BIT-%E8%A1%A5%E8%B6%B3%E9%A1%B5%E9%9D%A2%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/466252/BIT-%E8%A1%A5%E8%B6%B3%E9%A1%B5%E9%9D%A2%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   * @typedef {object} Site
   * @property {string} host 例：“jwb”“jwb.bit.edu.cn”
   * @property {(string | { selector: string, post: (element: Element) => string? })[]} title_selectors 优先使用在前面的 selector
   * @property {string?} name 默认从`<title>`获取
   */

  /* spell-checker: disable */

  /** @type {Site[]} */
  const sites = [
    { // 教学中心
      host: 'jxzx',
      title_selectors: [
        '.pageArticle > .articleTitle > h2',
        '.pagelistTitle > h2'
      ]
    },
    { // Information Technology Center
      host: 'itc',
      title_selectors: [
        '.pageArticle > .pageArticleTitle > h3#shareTitle',
        'body > div > div.subPage > div.sub_right > h2',
        'body > div > div.subPage > div > h2'
      ]
    },
    { // 教务处
      host: 'jwc',
      title_selectors: [
        '.pageArticle > .aca_article > h2',
        '.pageArticle > .articleTitle > h2'
      ]
    },
    { // 教务部
      name: '教务部',
      host: 'jwb',
      title_selectors: [
        'h3#shareTitle',
        '.gp-bread + h2.gpColumnTitle'
      ]
    },
    { // World Wide Web
      host: 'www',
      title_selectors: [
        '.subPage > .container > .subRight  > .newsTitle > h1',
        '.subPage > .container > .listTitle02 > h2',
        '.bread > .container > a:nth-last-child(1)'
      ]
    },
    { // I
      host: 'i',
      title_selectors: [
        // 从首页进去，怎么单击都是页面内跳转，URL不变。想检测的话要一直运行这个脚本，干脆算了吧……
        '.special-detail-banner > div > .special-detail-title > h2',
        '.service-name',
        'table.mini-tabs-header > tbody > tr > td.mini-tab-active > span.mini-tab-text'
      ]
    },
    { // 学生事务中心
      host: 'student',
      title_selectors: [
        '#home .page_box .txt > h2',
        '#home .page_box .top > h2'
      ]
    },
    { // 世纪（学生工作部、武装部、心理健康教育与咨询中心）
      host: 'century',
      title_selectors: [
        'h2'
      ]
    },
    { // 徐特立
      host: 'xuteli',
      title_selectors: [
        '.articleTitle h2'
      ]
    },
    { // 延河课堂
      host: 'www.yanhekt.cn',
      title_selectors: [
        // https://www.yanhekt.cn/recordCourse
        '.header-menu .ant-menu-item-selected',
        // https://www.yanhekt.cn/profile/info
        '.ant-menu .ant-menu-item-selected',
        // Unknown
        '#root div[class^=secHeading] > span[class^=title]',
        '[class^=liveHeader], [class^=mobileLiveHeader]',
        '.title-bar > :last-child',
        // https://www.yanhekt.cn/course/58931
        '.course-intro-title',
        // https://www.yanhekt.cn/session/666725
        'nav.ant-breadcrumb'
      ]
    },
    { // 信息公开
      host: 'xxgk',
      title_selectors: [
        '.pageArticleTitle h3',
        '.gp-subRight .articleTitle02'
      ]
    },
    { // 明德
      host: 'mingde',
      title_selectors: [
        '.pageArticleTitle > h3',
        '.gp-subRight .articleTitle02',
        '.subPage h2'
      ]
    },
    { // 校医院
      host: 'xyy',
      title_selectors: [
        '.rt_tit > h1',
        '.lt_tit > h2'
      ]
    },
    { // School of Information and Electronics
      host: 'sie',
      title_selectors: [
        '.pageArticle > .pageArticleTitle > h3#shareTitle',
        'h2.listTitle',
        '.gp-bread > .gp-container > a:last-child'
      ]
    },
    { // Radar
      host: 'radar',
      title_selectors: [
        {
          selector: '.detailBox .name',
          post: (el) => {
            if (el.childNodes.length === 2 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.childNodes[1].classList?.contains('gender')) {
              return el.childNodes[0].textContent
            }
          }
        },
        'h3.gp-title',
        '.bread > .gp-container > a:last-child'
      ]
    }
  ]
  /* spell-checker: enable */

  function match_site () {
    const site = sites.find(s => [
      `${s.host}.bit.edu.cn`,
      s.host
    ].includes(window.location.host))

    if (site === undefined) {
      return null
    } else {
      if (!site.name) {
        site.name = document.title
          .match(/(北京)?(理工)?(大学)?(?<name>.+)/)
          .groups.name.trim()
          .replace(/网$/, '')
      }
      return site
    }
  }

  /**
   * Applies function to the elements of the array and returns the first non-empty result.
   *
   * https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.find_map
   *
   * @template T
   * @template U
   * @param {Array<T>} array
   * @param {(element: T) => U?} fn
   * @returns {U?}
   */
  function find_map (array, fn) {
    for (const element of array) {
      const result = fn(element)
      if (result) {
        return result
      }
    }
  }

  /**
     * @param {Site} site
     * @returns success
     */
  function change_title_for (site) {
    const raw_title = find_map(site.title_selectors, s => {
      if (typeof s === 'string') {
        return document.querySelector(s)?.textContent
      } else {
        const el = document.querySelector(s.selector)
        if (el) {
          return s.post(el)
        }
      }
    })

    if (!raw_title) {
      return false
    }

    const title = raw_title.replace(/^[>-]/, '').trim()
    if (!title) {
      return false
    }

    document.title = `${title} - ${site.name}${site.name ? ' |' : ''} 北京理工大学`
    return true
  }

  const site = match_site()
  if (site) {
    change_title_for(site)

    // 适应 I、延河课堂
    // 加载完成后刷新
    setTimeout(() => change_title_for(site), 1500)
    // URL 变化时也刷新
    const history_pushState_original = history.pushState
    history.pushState = function () {
      const result = history_pushState_original.apply(this, arguments)
      window.dispatchEvent(new Event('url-changed'))
      return result
    }
    window.addEventListener('url-changed', () => {
      // 等待加载完成
      setTimeout(() => change_title_for(site), 500)
    })
  }
})()
