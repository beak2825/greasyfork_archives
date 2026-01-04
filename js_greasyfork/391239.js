// ==UserScript==
// @name         Changeling EventData
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changeling's event data inspector.
// @author       chengkai.wu
// @match        https://prod-gl.llsops.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391239/Changeling%20EventData.user.js
// @updateURL https://update.greasyfork.org/scripts/391239/Changeling%20EventData.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  function safeParse(string) {
    try {
      return JSON.parse(string)
    } catch (e) {}
  }

  document.body.addEventListener('click', ({ target }) => {
    while ((target = target.parentElement)) {
      if (target.classList.contains('message-group')) {
        break
      }
    }

    if (target && !target.querySelector('.changeling-eventdata')) {
      setTimeout(() => {
        const message = target.querySelector('.message-field .field-value')
        const json = message && safeParse(message.textContent)
        if (json && json.req_origin_path) {
          const params = new URLSearchParams(json.req_origin_path)
          const eventData = safeParse(
            params.get('extra') || params.get('eventData')
          )
          if (eventData) {
            if (eventData.data) {
              eventData.data = safeParse(eventData.data)
            }
            const reqOriginPath = target.querySelector(
              '.message-details span:nth-of-type(13)'
            )
            const span = document.createElement('span')
            span.innerHTML = /* html */ `<dt class="changeling-eventdata">Changeling eventData</dt><dd class=""><div class="field-value">${JSON.stringify(
              eventData,
              null,
              '  '
            )}</div></dd>`
            reqOriginPath.parentElement.insertBefore(span, reqOriginPath)
          }
        }
      })
    }
  })
})()
