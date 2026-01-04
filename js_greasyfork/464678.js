// ==UserScript==
// @name            Fritz box name in call list
// @name:DE         Fritz box Name in der Anruferliste
// @namespace       https://greasyfork.org/en/users/20068-cuzi
// @version         1.2
// @description     Show name from dastelefonbuch.de in fritz box caller list. Set your local area code in the source
// @description:DE  Zeigt den Anrufernamen von dastelefonbuch.de in the Anruferliste. Ändere deine Vorwahl im Sourcecode
// @author          cvzi
// @license         MIT
// @match           http://192.168.178.1/*
// @match           https://192.168.178.1/*
// @match           https://fritz.box/*
// @match           http://fritz.box/*
// @icon            http://192.168.178.1/icon.png
// @grant           GM.xmlHttpRequest
// @connect         dastelefonbuch.de
// @downloadURL https://update.greasyfork.org/scripts/464678/Fritz%20box%20name%20in%20call%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/464678/Fritz%20box%20name%20in%20call%20list.meta.js
// ==/UserScript==

/* global GM */
/* jshint asi: true, esversion: 8 */

(function () {
  'use strict'

  const areaCode = '06241' // Set to your local area code or empty string '' if you don't use one

  const dastelefonbuchUrl = 'https://www.dastelefonbuch.de/R%C3%BCckw%C3%A4rts-Suche/'

  function getCallerName (number) {
    return new Promise(function (resolve, reject) {
      const cached = window.localStorage.getItem(number)
      if (cached) {
        if (cached !== 'NOT_FOUND') {
          return resolve(cached)
        } else {
          return reject(new Error(cached + '+FROM_CACHE'))
        }
      }

      const url = dastelefonbuchUrl + encodeURIComponent(number)

      GM.xmlHttpRequest({
        method: 'GET',
        url,
        onerror: function (response) {
          console.error(`Error xmlHttpRequest "${url}"`, response)
          reject(new Error('ONERROR:xmlHttpRequest'))
        },
        onload: function (response) {
          const parts = response.responseText.split('<div class="vcard">')
          if (parts.length < 2) {
            console.debug('No results for number ' + number)
            window.localStorage.setItem(number, 'NOT_FOUND')
            return reject(new Error('NOT_FOUND'))
          }
          let s = parts[1]
          if (s.indexOf('</address>')) {
            s = s.split('</address>')[0] + '</address></div></div>'
          } else {
            s = s.split('</div>')[0] + '</div></div>'
          }

          s = s.replace(/<a[^>]+>/gim, '<span style="color:#888">').replace('</a>', '</span>')

          window.localStorage.setItem(number, s)

          resolve(s)
        }
      })
    })
  }

  function getCallerNameTryAreaCode (number, displayResult) {
    getCallerName(number).then(function (html) {
      displayResult(html)
    }).catch(function () {
      if (areaCode && !number.startsWith('0') && !number.startsWith('+')) {
        getCallerName(`${areaCode}${number}`).then(function (html) {
          displayResult(html)
        }).catch(function () {
          // no name found even with area code
        })
      } else {
        // no name found
      }
    })
  }

  function addNameToUnknownCalls () {
    // Full caller list
    document.querySelectorAll('#uiCalls tr a[href*="number="]').forEach(function (a) {
      if ('asked' in a.dataset) {
        return
      }
      a.dataset.asked = 1

      const m = a.href.match(/number=(\d+)/)
      if (!m) {
        return
      }
      const number = m[1]

      const displayResult = function (html) {
        a.parentNode.parentNode.parentNode.getElementsByTagName('td')[2].innerHTML += html
      }

      getCallerNameTryAreaCode(number, displayResult)
    })

    // Small caller list on home page
    document.querySelectorAll('.info-table--phonecalls .grid-row--phonecall>div:first-of-type').forEach(function (div) {
      if ('asked' in div.dataset) {
        return
      }
      div.dataset.asked = 1

      let m = div.textContent.trim().match(/^(\d+)$/)
      if (!m) {
        // Active calls:
        m = div.textContent.trim().match(/ — (\d+)/)
        if (!m) {
          return
        }
      }
      const number = m[1]

      const displayResult = function (html) {
        div.innerHTML += html
      }
      getCallerNameTryAreaCode(number, displayResult)
    })
  }

  window.setInterval(addNameToUnknownCalls, 1000)
})()
