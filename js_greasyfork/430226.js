// ==UserScript==
// @name         碧蓝幻想出HELL了
// @namespace    https://gist.github.com/biuuu/gbf-hell
// @version      0.0.1
// @description  无
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-end
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/430226/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E5%87%BAHELL%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/430226/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E5%87%BAHELL%E4%BA%86.meta.js
// ==/UserScript==
(function () {
  'use strict';
  
  const send = (title) => {
    GM_notification({
      title: title,
      text: '看一下',
      timeout: 10000
    })
  }

  let eventOn = false
  window.addEventListener('hashchange', () => {
    let hash = location.hash
    if (/^#result(_multi)?\/\d/.test(hash)) {
      if (!eventOn) {
        eventOn = true
        $(document).ajaxSuccess(function(event, xhr, settings, data) {
          if (/\/result(multi)?\/data\/\d+/.test(settings.url)) {
            if (data.appearance) {
              send('出HELL了')
            }
          }
        })
      }
    }
  })
}())

