// ==UserScript==
// @name             flickr Download Link
// @version          3.7
// @description      Adds a download link next to the Create link and enables right click on photos.
// @homepageURL      https://openuserjs.org/scripts/cuzi/flickr_Download_Link
// @contributionURL  https://buymeacoff.ee/cuzi
// @contributionURL  https://ko-fi.com/cuzicvzi
// @copyright        2014, cuzi (https://openuserjs.org/users/cuzi)
// @namespace        cuzi
// @license          MIT
// @grant            none
// @icon             https://combo.staticflickr.com/pw/images/favicons/favicon-228.png
// @match            https://flickr.com/*
// @match            https://*.flickr.com/*
// @downloadURL https://update.greasyfork.org/scripts/13880/flickr%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13880/flickr%20Download%20Link.meta.js
// ==/UserScript==

/* jshint asi: true, esversion: 8 */

(function () {
  'use strict'

  function page_photo () {
    const main_photo = document.getElementsByClassName('main-photo')[0]

    // Make the right click context menu available
    document.getElementsByClassName('main-photo')[0].style.zIndex = 10000
    document.getElementsByClassName('main-photo')[0].parentNode.parentNode.appendChild(document.getElementsByClassName('main-photo')[0].parentNode) // Move photo a level up

    // Remove protection layer
    document.querySelectorAll('.facade-of-protection-neue').forEach(e => e.remove())
    document.querySelectorAll('.facade-of-protection-zoom').forEach(e => e.remove())

    // Make the zoomed image context menu available
    document.querySelectorAll('.zoom-modal .zoom-photo-container img').forEach(function (img) {
      img.style.pointerEvents = 'auto'
    })

    const url = main_photo.src // URL of currently shown image
    let li, a

    if (document.getElementsByClassName('all-sizes server-only-link').length > 0) {
    // Download link in ballon
      const balloon = document.getElementsByClassName('all-sizes server-only-link')[0].parentNode.parentNode
      if (balloon.getElementsByTagName('li').length === 1) {
      // Download is disabled -> add download link for current resolution
        const orga = document.getElementsByClassName('all-sizes server-only-link')[0]
        a = orga.cloneNode()
        li = document.createElement('li')
        a.setAttribute('id', 'idllusgm2')
        a.setAttribute('href', url)
        a.setAttribute('class', 'server-only-link')
        a.appendChild(document.createTextNode('Download current size'))
        a.dataset.track = ''
        a.dataset.rapid_p = ''
        li.appendChild(a)
        balloon.appendChild(li)
      }
    }

    if (!document.getElementById('idllusgm')) {
    // Download link in nav bar
      li = document.createElement('li')
      li.setAttribute('id', 'iddllusgm3')
      li.setAttribute('title', 'Download current size')
      li.setAttribute('role', 'menuitem')
      a = document.createElement('a')
      li.appendChild(a)
      document.getElementsByClassName('nav-menu')[0].appendChild(li)
      a.setAttribute('class', 'gn-title')
      a.setAttribute('id', 'idllusgm')
      a.setAttribute('href', url)
      a.appendChild(document.createTextNode('Download'))
    } else {
      document.getElementById('idllusgm').setAttribute('href', url)
    }
  }

  function page_size_overview () {
    // Remove protection layer
    document.querySelectorAll('#allsizes-photo .spaceball').forEach(e => e.remove())

    let allsizes, allsizesheader
    if ((allsizes = document.getElementById('allsizes-photo'))) {
      if ((allsizesheader = document.getElementById('all-sizes-header')) && allsizes.querySelector('img') && !document.querySelector('#all-sizes-header dl:nth-child(2) a')) {
        // Add download link to message
        const url = allsizes.querySelector('img').src
        const text = document.querySelector('#all-sizes-header dl:nth-child(2) dd')
        if (text) {
          const a = document.createElement('a')
          text.appendChild(document.createTextNode('. '))
          text.appendChild(a)
          a.setAttribute('href', url)
          a.setAttribute('download', url.split('/').pop())
          a.appendChild(document.createTextNode('Download current size'))
        }
      }
    }
  }

  function page_video () {
    if (document.getElementById('iddllusgm3')) { // Remove photo specific link from nav bar
      document.getElementById('iddllusgm3').parentNode.removeChild(document.getElementById('iddllusgm3'))
    }
  }

  function main () {
    if (document.getElementsByClassName('yui3-videoplayer-video').length > 0) {
      page_video()
    }
    if (document.getElementsByClassName('main-photo').length > 0) {
      page_photo()
    }
    if (document.getElementById('allsizes-photo')) {
      page_size_overview()
    }
  }

  window.setInterval(main, 1000)
})()
