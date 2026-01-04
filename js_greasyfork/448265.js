// ==UserScript==
// @name         115画中画
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在115播放界面加入画中画按钮!
// @author       bbbyqq
// @match        *://v.anxia.com/*
// @match        *://115.com/*
// @match        *://115vod.com/*
// @grant        GM_addStyle
// @license      bbbyqq
// @downloadURL https://update.greasyfork.org/scripts/448265/115%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/448265/115%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   * 播放页面新增画中画按钮
   */
  const menu = document.querySelector('.bar-side ul')
  const li = document.createElement('li')
  const a = document.createElement('a')
  const i = document.createElement('i')
  const div = document.createElement('div')
  a.href = 'javascript:;'
  a.className = 'btn-opt'
  i.className = 'icon-operate iop-picture'
  const css = `
  .icon-operate.iop-picture {
     background-position-x: -200px;
  }
  .topfloat-cell {
     top: 12px;
  }`
  GM_addStyle(css) // GM_addStyle动态添加css
  div.textContent = '画中画'
  div.className = 'tooltip'
  a.appendChild(i)
  a.appendChild(div)
  li.appendChild(a)
  if (menu) {
    menu.insertBefore(li, menu.childNodes[4])
  }

  const videoElement = document.getElementById('js-video')
  // 绑定按键点击功能
  a.onclick = function () {
    if (document.pictureInPictureEnabled && !videoElement.disablePictureInPicture) {
      try {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        }
        videoElement.requestPictureInPicture()
      } catch (err) {
        console.error(err)
      }
    }
  }

  /**
   * 删除115广告
   */
  document.getElementById('js_common_mini-dialog')?.remove()

  /**
   * 首页添加云下载
   */
  document.querySelector('#js_top_panel_box .left-tvf').insertAdjacentHTML(
    'beforeend',
    '<a href="javascript:;" class="button btn-line btn-upload" menu="offline_task"><i class="icon-operate ifo-linktask"></i><span>云下载</span><em style="display:none;" class="num-dot"></em></a>'
  )

})()
