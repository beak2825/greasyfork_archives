// ==UserScript==
// @name         提取e-hentai画廊元数据
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Use the e-hentai metadata API to retrieve metadata.
// @author       SchneeHertz
// @license MIT
// @match        https://e-hentai.org/g/*
// @match        https://exhentai.org/g/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472321/%E6%8F%90%E5%8F%96e-hentai%E7%94%BB%E5%BB%8A%E5%85%83%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472321/%E6%8F%90%E5%8F%96e-hentai%E7%94%BB%E5%BB%8A%E5%85%83%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

/* jshint esversion: 8, asi: true */
(function () {
  'use strict';
  const button = document.createElement('input')
  button.value = '提取'
  button.type = 'button'
  button.id = 'extractButton'
  document.querySelector('#taglist').append(button)
  document.querySelector('#extractButton').addEventListener('click', async () => {
    const match = /(\d+)\/([a-z0-9]+)/.exec(window.location.href)
    const { response } = await GM.xmlHttpRequest({
      url:'https://api.e-hentai.org/api.php',
      method: "POST",
      data: JSON.stringify({
        'method': 'gdata',
        'gidlist': [
          [+match[1], match[2]]
        ],
        'namespace': 1
      })
    })
    let gmetadata = JSON.parse(response)
    const metaobj = {}
    gmetadata = gmetadata.gmetadata[0]
    const tags = {}
    gmetadata.tags.forEach(tagString => {
      const match = /^(.+):(.+)$/.exec(tagString)
      if (tags[match[1]]) {
        tags[match[1]].push(match[2])
      } else {
        tags[match[1]] = [match[2]]
      }
    })
    metaobj.tags = tags
    metaobj.url = window.location.href
    metaobj.title = gmetadata.title
    metaobj.title_jpn = gmetadata.title_jpn
    metaobj.rating = +gmetadata.rating
    metaobj.posted = +gmetadata.posted
    metaobj.filecount = +gmetadata.filecount
    metaobj.category = gmetadata.category
    metaobj.filesize = gmetadata.filesize
    metaobj.status = 'tagged'
    navigator.clipboard.writeText(JSON.stringify(metaobj))
    button.value = '已复制到剪贴板'
  })
})()