// ==UserScript==
// @name         MessageAlerter
// @namespace    https://blog.zheeeng.me
// @version      1.0
// @description  Use messager instead of native alert
// @author       hi@zheeeng.me
// @match        http*://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391507/MessageAlerter.user.js
// @updateURL https://update.greasyfork.org/scripts/391507/MessageAlerter.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    function notify (message) {
      if (!message) return null
      var div = document.createElement('div')
      div.style = 'position:fixed;top:16px;width:100%;mrgin-top:-100%;transition:margin-top .5s ease;awidth:100%;z-index:99999;text-align:center;font-size:14px;line-height:1.5;'
      var div2 = document.createElement('div')
      div2.style = 'display:inline-block;padding:8px 16px;background-color:white;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);'
      div.appendChild(div2)
      var icon = document.createElement('i')
      icon.style = 'display:inline-block;margin-right:8px;font-size:16px;font-style:normal;color:white;background-color:red;width:24px;height:24px;border-radius:50%;'
      icon.appendChild(document.createTextNode('x'))
      var textNode = document.createTextNode(message)
      div2.appendChild(icon)
      div2.appendChild(textNode)

      document.body.appendChild(div)

      function position (marginTop) {
          div.style.marginTop = marginTop
      }

      function dismiss () {
          document.body.removeChild(div)
      }

      return {
          position: position,
          dismiss: dismiss
      }
    }

    var positionFns = []

    window.alert= function (message) {
      var ops = notify(message)

      if (ops) {
          positionFns.push(ops.position)
          setTimeout(function () {
              ops.position((positionFns.length - 1) * 50 + 'px')
          }, 60)
          setTimeout(function () {
              ops.dismiss()
              positionFns = positionFns.filter(function (positionFn) { return positionFn !== ops.position  })
              positionFns.forEach(function (positionFn, idx) { positionFn(idx * 50 + 'px') })
          }, 3000)
      }
    }
})();