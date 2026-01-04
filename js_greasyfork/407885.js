// ==UserScript==
// @name        Youdao Notebook Fullscreen Button - youdao.com
// @namespace   Violentmonkey Scripts
// @match       https://note.youdao.com/md/
// @grant       GM_addStyle
// @version     1.0
// @author      Asuka109
// @description Add fullscreen button and hook F11 for Youdao Notebook.
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/407885/Youdao%20Notebook%20Fullscreen%20Button%20-%20youdaocom.user.js
// @updateURL https://update.greasyfork.org/scripts/407885/Youdao%20Notebook%20Fullscreen%20Button%20-%20youdaocom.meta.js
// ==/UserScript==

(async function ($) {
  GM_addStyle(`
    *:fullscreen::backdrop {
      background: rgba(255,255,255,0) !important;
    }
    .svg_fullsrceen {
      background: url(/web/images/sprite-27dd832cfd.svg) no-repeat;
      background-size: auto !important;
      background-position: 60.9% 82.37%;
      height: 18px !important;
      width: 18px !important;
      margin: 4px;
    }
  `)
  const findItem = ($item, selector) => new Promise((resolve, reject) => {
    if ($item.length === 0) reject()
    // 有可能此时 .item-b 已经出现，所以先检查下
    const $itemB = $item.find(selector)
    if ($itemB.length > 0) {
      resolve($itemB)
      return
    }
    // 监视 .item 的 DOM 树 childList 变化
    new MutationObserver((mutations, self) => {
      mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
          if (node.is(selector)) {
            self.disconnect()
            resolve($(node))
          }
        })
      })
    }).observe($item[0], { childList: true })
  })

  const toolbar = await findItem($(document.body), '#toolbar')
  const btnFullscreen = $(`<i title="全屏" class="svg-icon svg_fullsrceen"></i>`)
  const editorArea = document.body  // $('.detail')[0]
  
  const toggleFullscreen = () => {
    if(document.fullscreenElement){
      document.exitFullscreen()
    } else {
      editorArea.requestFullscreen()
      editorArea.style.background = '#fff'
    }
  }
  
  btnFullscreen.click(toggleFullscreen)
  toolbar.append(btnFullscreen)
  
  $(document).on('keydown', function (e) {
    if(e && e.keyCode == 122){
      e.preventDefault()
      toggleFullscreen()
    }
  })
})(jQuery)
