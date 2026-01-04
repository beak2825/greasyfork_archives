// ==UserScript==
// @name         AutoComponent
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       lsdsjy
// @match       https://jira.zhenguanyu.com/secure/*
// @match       https://jira.zhenguanyu.com/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://cdn.jsdelivr.net/npm/mutation-summary@1.0.0/dist/umd/mutation-summary.min.js
// @downloadURL https://update.greasyfork.org/scripts/427395/AutoComponent.user.js
// @updateURL https://update.greasyfork.org/scripts/427395/AutoComponent.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  console.log('auto component by lsdsjy')
  new MutationSummary.MutationSummary({
    callback: ([{ added }]) => {
      if (added && added.length && !document.querySelector('#components-textarea ~ .representation button.value-item')) {
        setTimeout(() => {
          let input = document.querySelector('#components-textarea')
          input.value = 'H5'
          input.dispatchEvent(
            new InputEvent('input', { inputType: 'insertText' })
          )
          setTimeout(() => {
            let prevFocus = document.activeElement
            input.dispatchEvent(
              new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: 13,
              })
            )
            prevFocus.focus()
          }, 500)
        }, 200)
      }
    },
    queries: [{ element: '#components-textarea' }],
  })
})()
