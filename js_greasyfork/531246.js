// ==UserScript==
// @name         wnacg-helper
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  helper for wnacg
// @author       miles
// @match        https://www.wnacg.com/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAVFBMVEVHcExCfAthwARozwInQRE2Yg4yWA8TFRZw4ABr1gExWA9DfQtToQclPBJbsgUXHRUkOhJYrAZCfQtRnQcdKxRgvgRs2AFSoAdfugQcKhRVpgZp0gI1gtGuAAAAAXRSTlMAQObYZgAAAP1JREFUWMPtl+sOgyAMhdn1dPf7/f3fcyooB2Fms0u2HzRGS6Ff6IGY1Bhr+NgMG3qZMt0jACVBCwCUBC0ASsuADMiADMiAACBSOvZdfopnK25YBkKfvGpAgEv1cSlu6ZL82G0BxO1DaEvWPZBvV/iMUgO5AncGwAMAxGFeYXysTuBpa2fKopkQ8EAtSwDw1XYAKuWQBEhUWRogVEVY7KZdeLHm+AIAOcUANHpH4bEHFJEbwvPjE137OrBvwv4ekGA7JDSotUHrIlEJXTad0GCw4qn3ACmTuRZAWvUCLKwaM8X/YCQyzP/EDMiA7wJ+3zP9Qd+ob331zbeq/X8C72hvkXKaG6kAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531246/wnacg-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531246/wnacg-helper.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  const highlight = (item, a) => {
    if (item.classList.contains('wnacg-helper-heightlight')) return
    const infoCol = item?.children?.[1]?.children?.[1]
    if (infoCol?.tagName === 'DIV') {
      const text = infoCol.textContent
      const match = text.match(/(\d+)張照片，/)
      if (match) {
        const count = match[1]
        if (count > 80) {
          const img = a.querySelector('img')
          if (img) {
            img.style.boxShadow = '0 0 12px #FFD700'
            img.style.border = '2px solid #FFD700'
          }
          item.classList.add('wnacg-helper-heightlight')
        }
      }
    }
  }

  const run = () => {
    const items = document.querySelectorAll('.li.gallary_item')
    items.forEach((item) => {
      const a = item?.children?.[0]?.lastElementChild
      if (a?.tagName === 'A') {
        if (a.target === '_blank') return
        a.target = '_blank'
      }
      highlight(item, a)
    })
    setTimeout(run, 500)
  }
  run()
})()
