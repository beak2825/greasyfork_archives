// ==UserScript==
// @name          Jodel.com download images
// @namespace     cuzi
// @description   Download images and videos from shared Jodel/Yodel posts on share.jodel.com
// @copyright     2018, cuzi (https://openuserjs.org//users/cuzi)
// @license       GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @version       1.1.0
// @match         https://share.jodel.com/*
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/372266/Jodelcom%20download%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/372266/Jodelcom%20download%20images.meta.js
// ==/UserScript==

/* globals GM_download */

function removeEventListeners (element) {
  const clone = element.cloneNode()
  while (element.firstChild) {
    clone.appendChild(element.lastChild)
  }
  element.parentNode.replaceChild(clone, element)
  return clone
}

function downloadFile (ev) {
  if (ev) {
    ev.preventDefault()
  }
  const url = this.href
  if (typeof GM_download !== 'undefined') {
    GM_download({ url, name: this.download })
  } else {
    document.location.href = url
  }
}

function makeImagesDownloadable () {
  const mPostId = document.location.href.match(/postId=(\w+)/)
  let filename = 'jodel'
  if (mPostId) {
    filename += '_' + mPostId[1]
  }
  const videoFileName = filename + '_video.mp4'
  filename += '.jpg'

  // images
  const images = document.querySelectorAll('#jodels-list li.image>img:not([class~=theimage])')
  for (let i = 0; i < images.length; i++) {
    const img = removeEventListeners(images[i])
    const download = document.createElement('a')
    download.title = 'Download image'
    download.href = img.src
    download.download = filename
    download.addEventListener('click', downloadFile)
    if (document.querySelector('.share-details .share')) {
      const div = document.createElement('div')
      const share = download.appendChild(document.querySelector('.share-details .share').cloneNode(false))
      div.appendChild(download)
      share.style.transform = 'rotate(180deg)'
      document.querySelector('.share-details').insertBefore(div, document.querySelector('.share-details').firstChild)
    } else {
      download.className = 'time-text'
      download.style = 'cursor:pointer; margin-left:7pt; font-size:16pt; text-shadow: rgba(0, 0, 0, 0.8) 1px 1px;'
      download.innerHTML = '&#9047;'
      img.parentNode.querySelector('.row').appendChild(download)
    }

    img.className += ' theimage'
  }

  // secure_url from meta
  const meta = document.querySelector('meta[property$=":secure_url"]')
  if (meta && document.querySelector('.share-details') && !document.querySelector('.share-details .linky')) {
    document.querySelectorAll('meta[property$=":secure_url"]').forEach(meta => {
      let title = 'Link'
      try {
        title = meta.getAttribute('property').replace(':secure_url', '').replace('og:', '') + ' link'
      } catch (e) {}
      const metaUrl = meta.content.replace('https:https://', 'https://')
      const download = document.createElement('a')
      download.title = 'Download image'
      download.href = metaUrl
      download.target = '_blank'
      download.appendChild(document.createTextNode(title))
      download.classList.add('linky')
      download.style = 'color:#aaa; padding: 0px 7px;'
      const div = document.createElement('div')
      div.appendChild(download)
      document.querySelector('.share-details').insertBefore(div, document.querySelector('.share-details').firstChild)
    })
  }

  // videos
  document.querySelectorAll('video').forEach(function (video) {
    video.querySelectorAll('source[src]').forEach(function (source) {
      if ('seen' in source.dataset) {
        return
      }
      source.dataset.seen = true
      const download = document.createElement('a')
      download.title = 'Download video'
      download.href = source.src
      download.download = videoFileName
      download.style.color = 'black'
      download.addEventListener('click', downloadFile)
      download.appendChild(document.createTextNode(source.src))

      const div = document.createElement('div')
      div.style = 'white-space: nowrap; background:white; color:black'
      div.appendChild(download)
      video.parentNode.parentNode.insertBefore(div, video.parentNode)
    })
  })
}

function removeJoinAd () {
  const e = document.getElementById('join-jodel-modal')
  if (e) {
    e.parentNode.removeChild(e)
  }
}

function removeFooter () {
  const e = document.querySelector('nav.navbar.footer')
  if (e) {
    e.parentNode.removeChild(e)
  }
}

window.setInterval(function () {
  removeJoinAd()
  makeImagesDownloadable()
  removeFooter()
}, 500)
