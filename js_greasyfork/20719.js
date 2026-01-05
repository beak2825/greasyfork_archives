// ==UserScript==
// @name         Bandcamp download mp3s
// @description  Shows download links for the preview files on bandcamp albums
// @namespace    cuzi
// @oujs:author  cuzi
// @homepageURL  https://openuserjs.org/scripts/cuzi/Bandcamp_download_mp3s
// @version      9
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://*.bandcamp.com/*
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @connect      bandcamp.com
// @connect      bcbits.com
// @icon         https://bandcamp.com/img/favicon/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/20719/Bandcamp%20download%20mp3s.user.js
// @updateURL https://update.greasyfork.org/scripts/20719/Bandcamp%20download%20mp3s.meta.js
// ==/UserScript==

/* globals GM, unsafeWindow, GM_download */
/* jshint asi: true, esversion: 8 */

(function () {
  // Base64 function from https://gist.github.com/stubbetje/229984
  function base64BinaryString (s) {
    const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
    const l = s.length
    const o = []
    let char0, char1, char2, char3
    let byte0, byte1, byte2
    let t
    for (let i = 0; i < l; i++) {
      byte0 = s.charCodeAt(i++) & 0xff
      byte1 = i < l ? s.charCodeAt(i++) & 0xff : 0
      byte2 = i < l ? s.charCodeAt(i) & 0xff : 0
      char0 = byte0 >> 2
      char1 = ((byte0 & 0x3) << 4) | (byte1 >> 4)
      char2 = ((byte1 & 0x0f) << 2) | (byte2 >> 6)
      char3 = byte2 & 0x3f
      t = i - l
      if (t === 1) {
        char3 = 64
      } else if (t === 2) {
        char3 = 64
        char2 = 64
      }
      o.push(base64[char0], base64[char1], base64[char2], base64[char3])
    }
    return o.join('')
  }

  function fixFilename (s) {
    const forbidden = '*"/\\[]:|,<>?\n\t\0'.split('')
    forbidden.forEach(function (char) {
      s = s.replace(char, '')
    })
    return s
  }

  const SPINNERCSS = '/* http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner/ */\n' +
    '.download-col .downloaddisk:hover {\n' +
    '  text-decoration:none\n' +
    '}\n' +
    '.downspinner {\n' +
    '  margin:0px auto;\n' +
    '  position:relative;\n' +
    '  display:inline-block;\n' +
    '  animation: spinnerrotation 3s infinite linear;\n' +
    '  cursor:wait;\n' +
    '}\n' +
    '@keyframes spinnerrotation {\n' +
    '  from {transform: rotate(0deg)}\n' +
    '  to {transform: rotate(359deg)}\n' +
    '}'

  function addSpinner (el) {
    el.style = ''
    el.classList.add('downspinner')
  }

  function removeSpinner (el) {
    el.classList.remove('downspinner')
    el.style = 'background:#1cea1c;border-radius:5px;padding:1px;opacity:0.5'
  }

  function download (ev) {
    const a = this
    const url = a.href

    if (GM_download) {
      // Use Tampermonkey GM_download function
      ev.preventDefault()
      addSpinner(a)
      GM_download({
        url,
        name: a.download,
        onerror: function () {
          window.alert('Could not download via GM_download')
          document.location.href = url
        },
        ontimeout: function () {
          window.alert('Could not download via GM_download. Time out.')
          document.location.href = url
        },
        onload: function () {
          window.setTimeout(() => removeSpinner(a), 500)
        }

      })
      return
    }

    if (!url.startsWith('http') || navigator.userAgent.indexOf('Chrome') !== -1) {
      // Just open the link normally (no prevent default)
      addSpinner(a)
      window.setTimeout(() => removeSpinner(a), 1000)
      return
    }

    // Use GM.xmlHttpRequest to download and offer data uri
    ev.preventDefault()

    addSpinner(a)

    GM.xmlHttpRequest({
      method: 'GET',
      overrideMimeType: 'text/plain; charset=x-user-defined',
      url,
      onload: function (response) {
        a.href = 'data:audio/mpeg;base64,' + base64BinaryString(response.responseText)
        window.setTimeout(() => a.click(), 10)
      },
      onerror: function (response) {
        window.alert('Could not download via GM.xmlHttpRequest')
        document.location.href = url
      }
    })
  }

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(SPINNERCSS))
  document.head.appendChild(style)

  window.setTimeout(function () {
    const TralbumData = unsafeWindow.TralbumData
    if (TralbumData && TralbumData.hasAudio && !TralbumData.freeDownloadPage && TralbumData.trackinfo) {
      let hoverdiv = document.querySelectorAll('.download-col div')
      if (hoverdiv.length === 0) {
        hoverdiv = document.querySelectorAll('h2.trackTitle')
      }
      for (let i = 0; i < TralbumData.trackinfo.length; i++) {
        const t = TralbumData.trackinfo[i]
        for (const prop in t.file) {
          const mp3 = t.file[prop].replace(/^\/\//, 'http://')
          const a = document.createElement('a')
          a.className = 'downloaddisk'
          a.href = mp3
          a.download = (t.track_num > 9 ? '' : '0') + t.track_num + '. ' + fixFilename(TralbumData.artist + ' - ' + t.title) + '.mp3'
          a.title = 'Download ' + prop
          a.appendChild(document.createTextNode('\uD83D\uDCBE'))
          a.addEventListener('click', download)
          hoverdiv[i].appendChild(a)
          break
        }
      }
    }
  }, 500)
})()
