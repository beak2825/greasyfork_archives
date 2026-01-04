// ==UserScript==
// @name         Readability Line Gradient
// @namespace    https://neekleer.tacden.net/
// @version      0.3.5
// @description  Color lines to assist eye transistion similar to BeeLine Reader. Uses Lining.js for (responsive) DOM wrapping of paragraph text.
// @author       neekleer
// @match        http*://*.storiesonline.net/s/*
// @match        http*://*.novelfull.com/*/*.html
// @match        http*://*.novelplanet.com/Novel/*/*
// @match        http*://*.literotica.com/s/*
// @match        http*://*.literotica.com/beta/s/*
// @match        http*://*.chyoa.com/chapter/*
// @match        http*://*.readnovelfull.com/*
// @match        http*://*.wuxiaworld.com/novel/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/lining.js/0.3.2/lining.min.js
// @downloadURL https://update.greasyfork.org/scripts/395886/Readability%20Line%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/395886/Readability%20Line%20Gradient.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (typeof window.lining !== 'function') return

  function getContrastYIQ(color) {
    let parsed = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    )
    let r, g, b
    r = g = b = 255
    if (parsed) {
      if (parsed.length >= 4) {
        r = parsed[1]
        g = parsed[2]
        b = parsed[3]
      }
    } else {
      parsed = color
        .replace('#', '')
        .padEnd(6, '0')
        .match(/^([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/)
      if (parsed.length >= 4) {
        r = parseInt(parsed[1], 16)
        g = parseInt(parsed[2], 16)
        b = parseInt(parsed[3], 16)
      }
    }

    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  }

  function run() {
    setTimeout(() => {
      let mainContainer = document.body
      let darkMode = false
      let darkModeNormal = true

      if (window.location.hostname.endsWith('novelfull.com')) {
        const container = document.getElementById('container')
        if (container) {
          mainContainer = container
        }
      } else if (window.location.hostname.endsWith('novelplanet.com')) {
        const container = document.getElementById('main')
        if (container) {
          mainContainer = container
        }
      } else if (window.location.hostname.endsWith('wuxiaworld.com')) {
        const container = document.getElementById('chapter-outer')
        if (container) {
          mainContainer = container
          darkModeNormal = false
          darkMode = document.body.classList.contains('darkmode')
        }
      }

      if (darkModeNormal) {
        const darkMode = getContrastYIQ(
          window
            .getComputedStyle(mainContainer)
            .getPropertyValue('background-color'),
        )
      }

      const colorA = darkMode ? '#C1C1C1' : '#000'
      const colorB = darkMode ? '#FB6558' : '#0F52BA'
      const colorC = darkMode ? '#377BE6' : '#E34234'
      const elements = mainContainer.querySelectorAll('p:not(:empty)')
      window.lining.util.getAllOutSideBr = (root) => {
        var brs = root.getElementsByTagName('br')
        var br
        var outSideBrs = []
        for (var i = 0, l = brs.length; i < l; i++) {
          br = brs[i]
          if (
            br.previousElementSibling &&
            br.previousElementSibling.nodeName === 'TEXT-LINE'
          ) {
            outSideBrs.push(br)
          }
        }
        return outSideBrs
      }
      for (let i = elements.length - 1; i >= 0; i--) {
        const parent = elements[i].parentElement
        if (parent && parent.getAttribute('data-lining') === null) {
          window.lining(parent, { autoResize: true })
        }
      }

      const lineSpec = [
        ['3n - 2', colorA, colorA, colorB],
        ['3n - 1', colorB, colorA, colorC],
        ['3n', colorC, colorA, colorA],
      ]

      for (let i = 0, l = lineSpec.length; i < l; i++) {
        const multExpr = lineSpec[i].shift()
        const colorList = lineSpec[i]
        lineSpec[
          i
        ] = `p .line:nth-of-type(${multExpr}){background:linear-gradient(90deg,${colorList.join()});color:transparent;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}`
        if (colorList.pop() !== colorA) {
          colorList.push(colorA)
          lineSpec[
            i
          ] += `\np .line[last]:nth-of-type(${multExpr}){background:linear-gradient(90deg,${colorList.join()});color:transparent;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}`
        }
      }
      GM_addStyle(lineSpec.join('\n'))
    }, 1000)
  }

  run()
})()
