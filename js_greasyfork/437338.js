// ==UserScript==
// @name         NRK subtitle download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download subtitles from tv.nrk.no
// @author       cvzi
// @copyright    2021, cuzi (https://openuserjs.org/users/cuzi)
// @license      MIT
// @match        https://tv.nrk.no/*
// @icon         https://tv.nrk.no/apple-touch-icon.png
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/437338/NRK%20subtitle%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/437338/NRK%20subtitle%20download.meta.js
// ==/UserScript==

/* globals GM */

(function () {
  'use strict'
  const PROGRAM_URL = 'https://psapi.nrk.no/programs/$pid'

  function container () {
    let div = document.getElementById('videosrcs84519')
    if (!div) {
      div = document.createElement('div')
      div.id = 'videosrcs84519'
      document.body.appendChild(div)
      document.head.appendChild(document.createElement('style')).innerHTML = `
        #videosrcs84519 {
          position:fixed;
          z-index:99999;
          top:0px;
          left:0px;
          padding:5px;
          margin:0px;
          background:white;
          color:black;
          border:2px solid black;
          font-family:monospace;
          font-size:14px;
        }

        #videosrcs84519 a:link {color:blue; text-decoration:underline;font-size:14px;font-family:monospace;}
        #videosrcs84519 a:visited {color:#660973; text-decoration:underline;font-size:14px;font-family:monospace;}
`
    }
    div.innerHTML = ''
    return div
  }
  function link (url) {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    let text = url.toString()
    a.title = text
    if (text.length > 160) {
      text = text.substring(0, 78) + '...' + text.substring(text.length - 78)
    }
    a.appendChild(document.createTextNode(text))
    return a
  }

  const lst = new Set()
  const m3u8s = new Set()
  function m3u8 (url) {
    if (!url.endsWith('m3u8') || m3u8s.has(url)) {
      return
    }
    m3u8s.add(url)
    GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        response.responseText.split('\n').forEach(function (line) {
          if (line.trim().startsWith('#')) {
            return
          }
          if (line.startsWith('http')) {
            lst.add(line)
          } else {
            const parts = url.split('/')
            parts.pop()
            parts.push(line)
            lst.add(parts.join('/'))
          }
        })
        listUrls()
      }
    })
  }

  function findProgramId () {
    if (document.querySelector('meta[property="nrk:program-id"]')) {
      return document.querySelector('meta[property="nrk:program-id"]').content
    } else if (document.querySelector('[data-program-id]')) {
      return document.querySelector('[data-program-id]').dataset.programId
    } else {
      let m = document.documentElement.innerHTML.match(/"prfId":"(\w+?)"/)
      if (m) {
        return m[1]
      } else {
        m = document.documentElement.innerHTML.match(/prf:(\w+?)/)
        if (m) {
          return m[1]
        }
      }
    }
    return null
  }

  let iv = null
  function listUrls () {
    const programId = findProgramId()
    if (programId) {
      GM.xmlHttpRequest({
        method: 'GET',
        url: PROGRAM_URL.replace('$pid', programId),
        onload: function (response) {
          const data = JSON.parse(response.responseText)
          data.mediaAssetsOnDemand.forEach(function (episode) {
            lst.add(decodeURIComponent(episode.webVttSubtitles))
            m3u8(decodeURIComponent(episode.webVttSubtitles))
            lst.add(decodeURIComponent(episode.timedTextSubtitlesUrl))
            m3u8(decodeURIComponent(episode.timedTextSubtitlesUrl))

            const c = container()
            lst.forEach(function (src) {
              c.appendChild(link(src))
              c.appendChild(document.createElement('br'))
            })
            let button = c.appendChild(document.createElement('button'))
            button.addEventListener('click', function () {
              window.clearInterval(iv)
              c.remove()
            })
            button.appendChild(document.createTextNode('Close'))
            button = c.appendChild(document.createElement('button'))
            button.addEventListener('click', () => listUrls())
            button.appendChild(document.createTextNode('Refresh'))
          })
        }
      })
    }
  }

  GM.registerMenuCommand('List NRK subtitles', listUrls)
  iv = window.setInterval(listUrls, 5000)
})()
