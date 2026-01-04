// ==UserScript==
// @name         pter helper keyboard shortcuts
// @namespace    https://pterclub.com
// @version      0.3.1
// @description  猫站审核键盘快捷方式
// @author       maicss
// @date         2021/08/26
// @update       2022/11/27
// @match        https://*.pterclub.com/details.php?id=*
// @match        https://*.pterclub.com/edit.php*
// @icon         https://pterclub.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456378/pter%20helper%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/456378/pter%20helper%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   *  如果需要自定义快捷键，请注意：
   *  1，请修改下面的key，保证不要重复【不要修改selector！】
   *  2，大小写敏感，建议小写
   */
    // 种子详情界面快捷键
  const detailKeyboardMaps = [
      {
        key: 'q',
        name: '打开豆瓣链接',
        selector: 'a.altlink[href*="movie.douban.com/subject/"]'
      },
      {
        key: 'w',
        name: '特别编辑',
        exec: 'klappe_news',
        params: ['specialedit']
      },
      {
        key: 'e',
        name: '编辑/删除',
        selector: 'a[title="点击编辑或删除本种子"]'
      },
      {
        key: 'r',
        name: '举报种子',
        selector: 'a[title="合理的举报将有助猫站社区变得更加美好"]',
      },
      {
        key: 't',
        name: '种子页',
        handler: () => handlePageNavi('torrentpage'),
        // exec: 'func_torrentpage'
      },
      {
        key: 'y',
        name: 'IMDB',
        selector: 'a.altlink[href*=".imdb.com/title/"]'
      },
      {
        key: 'u',
        name: '确认编辑',
        selector: 'input#specialedit'
      },

      {
        key: 'a',
        name: '通过审核',
        selector: '#radio_checked',
        next: {
          type: 'customize1'
        },
      },
      {
        key: 's',
        name: '取消通过审核',
        selector: '#radio_unchecked',
        next: {
          type: 'customize1'
        },
      },
      {
        key: 'd',
        name: '下一个',
        handler: () => handlePageNavi('next')
        // exec: 'func_next'
      },
      {
        key: 'f',
        name: '上一个',
        // exec: 'func_previous',
        handler: () => handlePageNavi('previous')
      },
      {
        key: 'g',
        name: '置顶和免费一天',
        selector: '#radio_stickyfree',
        next: {
          type: 'customize1'
        },
      },
      {
        key: 'h',
        name: '不置顶只免费一天',
        selector: '#radio_onlyfree',
        next: {
          type: 'customize1'
        },
      },
      {
        key: 'j',
        name: '不置顶 不免费',
        selector: '#radio_nostickyfree',
        next: {
          type: 'customize1'
        },
      },

      {
        key: 'b',
        name: '通过审核 + 下一个',
        selector: '#radio_checked',
        next: {
          type: 'fn',
          handler: () => handlePageNavi('next')
        },
      },
      {
        key: 'n',
        name: '通过审核',
        selector: '#radio_checked',
      }, // 勾选通过审核，但不点击提交。方便连续审核
      {
        key: 'm',
        name: '取消通过审核',
        selector: '#radio_unchecked',
      },// 勾选“取消通过审核”，但不点击提交。方便连续审核

      {
        key: '0',
        name: '添加',
        selector: '#qr',
      },
      {
        key: '1',
        name: '已代修正',
        xpath: '//td[@id=\'outer\']//a[text()=\'已代修正\']',
      },
      {
        key: '2',
        name: '需要修正',
        xpath: '//td[@id=\'outer\']//a[text()=\'需要修正\']',
      },
    ]
  // 种子编辑界面快捷键
  const editKeyboardMaps = [
    {
      key: 'k',
      name: '种子编辑界面-一级置顶+免费1.5天',
      selector: 'input[name="stickyandfree"][value="1"]',
      next: {
        type: 'selector-click',
        selector: '#qr'
      }
    },
    {
      key: 'g',
      name: '种子编辑界面-置顶+免费1天',
      selector: 'input[name="stickyandfree"][value="2"]',
      next: {
        type: 'selector-click',
        selector: '#qr'
      }
    },
    {
      key: 'h',
      name: '种子编辑界面-不置顶+免费1天',
      selector: 'input[name="stickyandfree"][value="3"]',
      next: {
        type: 'selector-click',
        selector: '#qr'
      }
    },
    {
      key: 'j',
      name: '种子编辑界面-不置顶+不免费',
      selector: 'input[name="stickyandfree"][value="4"]',
      next: {
        type: 'selector-click',
        selector: '#qr'
      }
    },
    {
      key: 'l',
      name: '种子编辑界面-编辑按钮',
      selector: '#qr',
    },
  ]

  /** @param {'previous'|'next'|'torrentpage'} type */
  function handlePageNavi (type) {
    if (type === 'torrentpage') return location.href = 'https://pterclub.com/torrents.php?check=unchecked'
    const element = document.querySelector('#checker')
    element.action = 'takedetails.php?action=' + type
    element.submit.click()
  }

  document.addEventListener('keyup', function (event) {
    if (event.altKey || event.ctrlKey) return
    if (event.composedPath()[0] !== document.body) return
    if (location.href.includes('/details.php?')) {
      const setting = detailKeyboardMaps.find(setting => setting.key === event.key)
      if (setting) {
        if (setting.handler) {
          setting.handler()
        } else if (setting.exec) {
          unsafeWindow[setting.exec].apply(unsafeWindow, setting.params)
        } else if (setting.selector) {
          const element = document.querySelector(setting.selector)
          element && element.click()
          if (setting.next) {
            if (setting.next.type === 'customize1') {
              element.parentElement.querySelector('input[type=submit]').click()
            } else if (setting.next.type === 'fn') {
              setting.next.handler()
            }
          }
        } else if (setting.xpath) {
          const queryRes = document.evaluate(setting.xpath, document.body, null, XPathResult.ANY_TYPE, null)
          if (queryRes) {
            const element = queryRes.iterateNext()
            if (element) element.click()
          }
        }
      }
    }
    if (location.href.includes('/edit.php')) {
      const setting = editKeyboardMaps.find(setting => setting.key === event.key)
      if (setting) {
        if (setting.selector) {
          const element = document.querySelector(setting.selector)
          element && element.click()
          if (setting.next) {
            if (setting.next.type === 'selector-click') {
              document.querySelector(setting.next.selector).click()
            }
          }
        }
      }
    }
  })
})()
