// ==UserScript==
// @name         COC2 翻译分段修复
// @namespace    http://tampermonkey.net/
// @version      2024-10-33
// @description  修复 Google 翻译导致段落合并的问题
// @author       LinHQ
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       context-menu
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/512690/COC2%20%E7%BF%BB%E8%AF%91%E5%88%86%E6%AE%B5%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/512690/COC2%20%E7%BF%BB%E8%AF%91%E5%88%86%E6%AE%B5%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 选择器必须指向最内层元素，否则导致虚拟 dom 报错
  // 大段落主要文本
  const target = '.mainText'
  // 零碎段落
  const targetMulti = '.combatCard span,.itemText,span.message'
  // 不翻译
  const noTranslate = 'span.listItemQuantity,div.totalCard .value,.sidebarDetailsContainer,.sidebarControlContainer,.keybindDisplay.trayButtonBind,.hotkeyIndicator'

  GM_addStyle(`
    .mainText .event_log_entry > span:has(font){
      white-space: inherit !important;
    }
    `)

  new MutationObserver((li, ob) => {
    try {
      const operateNodes = new Map([
        ['translate', []],
        ['brfix', []],
      ])

      li.filter(mu => mu.type === 'childList' && !!mu.addedNodes)
        .forEach(mu =>
          mu.addedNodes.forEach(node => {
            if (node.nodeType === 3) {
              // #text 节点这里可以不区分，非 #text 可能是 fragment
              operateNodes.get('brfix').push(node.parentElement?.matches(`${target},${targetMulti}`) ? node.parentNode : undefined)
              operateNodes.get('translate').push(node.parentElement?.matches(noTranslate) ? node.parentElement : undefined)
              return
            }

            // 放下面，因为 #text 没有 querySelectorAll
            const mainText = node?.querySelectorAll(target)
            operateNodes.get('brfix').push(mainText[Math.max(0, mainText.length - 1)], ...node?.querySelectorAll(targetMulti))

            operateNodes.get('translate').push(...node?.querySelectorAll(noTranslate))
          })
        )

      ob.disconnect()
      for (const [k, v] of operateNodes) {
        switch (k) {
          case 'translate':
            v.forEach(node => node?.setAttribute('translate', 'no'))
            break
          case 'brfix':
            v.forEach(node => {
              if (!node?.innerHTML) return

              // 直接换行和空一行需要区分
              // 看看是不是 div 效果比 br 更好，插入 &nbsp; 利用默认 line-height 撑起 div
              node.innerHTML = node.innerHTML.replaceAll('\n\n', '<div style="display: block; line-height: inherit;">&nbsp;</div>').replaceAll('\n', '<div style="display: block; line-height: inherit;"></div>')
            })
            break
        }
      }
      ob.observe(document.body, {
        subtree: true,
        childList: true
      })
    } catch (e) {
    }
  }).observe(document, {
    subtree: true,
    childList: true
  })
})()
