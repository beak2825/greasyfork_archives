// ==UserScript==
// @name        Pinterest.com Backup Original Files
// @description Download all original images from your Pinterest.com profile. Creates an entry in the Greasemonkey menu, just go to one of your boards, scroll down to the last image and click the option in the menu.
// @namespace   cuzi
// @license     MIT
// @version     19.0.4
// @match       https://*.pinterest.com/*
// @match       https://*.pinterest.at/*
// @match       https://*.pinterest.ca/*
// @match       https://*.pinterest.ch/*
// @match       https://*.pinterest.cl/*
// @match       https://*.pinterest.co.kr/*
// @match       https://*.pinterest.co.uk/*
// @match       https://*.pinterest.com.au/*
// @match       https://*.pinterest.com.mx/*
// @match       https://*.pinterest.de/*
// @match       https://*.pinterest.dk/*
// @match       https://*.pinterest.es/*
// @match       https://*.pinterest.fr/*
// @match       https://*.pinterest.ie/*
// @match       https://*.pinterest.info/*
// @match       https://*.pinterest.it/*
// @match       https://*.pinterest.jp/*
// @match       https://*.pinterest.net/*
// @match       https://*.pinterest.nz/*
// @match       https://*.pinterest.ph/*
// @match       https://*.pinterest.pt/*
// @match       https://*.pinterest.ru/*
// @match       https://*.pinterest.se/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       GM.registerMenuCommand
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @connect     pinterest.com
// @connect     pinterest.de
// @connect     pinimg.com
// @icon        https://s.pinimg.com/webapp/logo_trans_144x144-5e37c0c6.png
// @downloadURL https://update.greasyfork.org/scripts/15914/Pinterestcom%20Backup%20Original%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/15914/Pinterestcom%20Backup%20Original%20Files.meta.js
// ==/UserScript==

/* globals JSZip, saveAs, GM, MouseEvent */

// Time to wait between every scroll to the bottom (in milliseconds)
const scrollPause = 1000

let scrollIV = null
let lastScrollY = null
let noChangesFor = 0
let lastImageListLength = -1
let noImageListLengthChangesFor = 0

function prepareForDownloading () {
  if (scrollIV !== null) {
    return
  }

  document.scrollingElement.scrollTo(0, 0)
  collectActive = true
  scrollIV = true
  collectImages()

  if (!window.confirm('The script needs to scroll down to the end of the page. It will start downloading once the end is reached.\n\nOnly images that are already visible can be downloaded.\n\n\u2757 Keep this tab open (visible) \u2757')) {
    return
  }

  const div = document.querySelector('.downloadoriginal123button')
  div.style.position = 'fixed'
  div.style.top = '30%'
  div.style.zIndex = 100
  div.innerHTML = 'Collecting images... (keep this tab visible)<br>'

  const startDownloadButton = div.appendChild(document.createElement('button'))
  startDownloadButton.appendChild(document.createTextNode('Stop scrolling & start downloading'))
  startDownloadButton.addEventListener('click', function () {
    window.clearInterval(scrollIV)
    downloadOriginals()
  })

  const statusImageCollector = div.appendChild(document.createElement('div'))
  statusImageCollector.setAttribute('id', 'statusImageCollector')

  document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight)

  window.setTimeout(function () {
    scrollIV = window.setInterval(scrollDown, scrollPause)
  }, 1000)
}

function scrollDown () {
  if (document.hidden) {
    // Tab is hidden, don't do anyhting
    return
  }
  if (noChangesFor > 2) {
    console.log('noChangesFor > 2')
    window.clearInterval(scrollIV)
    window.setTimeout(downloadOriginals, 1000)
  } else {
    console.log('noChangesFor <= 2')
    document.scrollingElement.scrollTo(0, document.scrollingElement.scrollTop + 500)
    if (document.scrollingElement.scrollTop === lastScrollY) {
      noChangesFor++
      console.log('noChangesFor++')
    } else {
      noChangesFor = 0
      console.log('noChangesFor = 0')
    }
    if (entryList.length !== lastImageListLength) {
      lastImageListLength = entryList.length
      noImageListLengthChangesFor = 0
    } else {
      console.log('noImageListLengthChangesFor =', noImageListLengthChangesFor)
      noImageListLengthChangesFor++
      if (noImageListLengthChangesFor > 5) {
        window.clearInterval(scrollIV)
        window.setTimeout(downloadOriginals, 1000)
      }
    }
  }
  lastScrollY = document.scrollingElement.scrollTop
}

let entryList = []
let url = document.location.href
let collectActive = false
let boardName = ''
let boardNameEscaped = ''
let userName = ''
let userNameEscaped = ''
const startTime = new Date()
const entryTemplate = {
  images: [],
  title: null,
  link: null,
  description: null,
  note: null,
  sourceLink: null
}

function collectImages () {
  if (!collectActive) return
  if (url !== document.location.href) {
    // Reset on new page
    url = document.location.href
    entryList = []
  }

  const masonry = document.querySelector('[data-test-id="board-feed"] .masonryContainer')
  if (!masonry) {
    return
  }
  const imgs = masonry.querySelectorAll('a[href^="/pin/"] img')
  for (let i = 0; i < imgs.length; i++) {
    if (imgs[i].clientWidth < 100) {
      // Skip small images, these are user profile photos
      continue
    }
    if (!('mouseOver' in imgs[i].dataset)) {
      // Fake mouse over to load source link
      const mouseOverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true
      })

      imgs[i].dispatchEvent(mouseOverEvent)
      imgs[i].dataset.mouseOver = true
    }

    const entry = Object.assign({}, entryTemplate)
    entry.images = [imgs[i].src.replace(/\/\d+x\//, '/originals/'), imgs[i].src]

    if (imgs[i].alt) {
      entry.description = imgs[i].alt
    }

    const pinWrapper = parentQuery(imgs[i], '[data-test-id="pinWrapper"]') || parentQuery(imgs[i], '[role="listitem"]') || parentQuery(imgs[i], '[draggable="true"]')
    if (pinWrapper) {
      // find metadata
      const aText = Array.from(pinWrapper.querySelectorAll('a[href*="/pin/"]')).filter(a => a.firstChild.nodeType === a.TEXT_NODE)
      if (aText.length > 0 && aText[0]) {
        entry.title = aText[0].textContent.trim()
        entry.link = aText[0].href.toString()
      } else if (pinWrapper.querySelector('a[href*="/pin/"]')) {
        entry.link = pinWrapper.querySelector('a[href*="/pin/"]').href.toString()
      }
      const aNotes = Array.from(pinWrapper.querySelectorAll('a[href*="/pin/"]')).filter(a => a.querySelector('div[title]'))
      if (aNotes.length > 0 && aNotes[0]) {
        entry.note = aNotes[0].textContent.trim()
      }

      if (pinWrapper.querySelector('[data-test-id="pinrep-source-link"] a')) {
        entry.sourceLink = pinWrapper.querySelector('[data-test-id="pinrep-source-link"] a').href.toString()
      }
    }

    if (imgs[i].srcset) {
      // e.g. srcset="https://i-h2.pinimg.com/236x/15/87/ae/abcdefg1234.jpg 1x, https://i-h2.pinimg.com/474x/15/87/ae/abcdefg1234.jpg 2x, https://i-h2.pinimg.com/736x/15/87/ae/abcdefg1234.jpg 3x, https://i-h2.pinimg.com/originals/15/87/ae/abcdefg1234.png 4x"

      let goodUrl = false
      let quality = -1
      const srcset = imgs[i].srcset.split(', ')
      for (let j = 0; j < srcset.length; j++) {
        const pair = srcset[j].split(' ')
        const q = parseInt(pair[1].replace('x'))
        if (q > quality) {
          goodUrl = pair[0]
          quality = q
        }
        if (pair[0].indexOf('/originals/') !== -1) {
          break
        }
      }
      if (goodUrl && quality !== -1) {
        entry.images[0] = goodUrl
      }
    }

    let exists = false
    for (let j = 0; j < entryList.length; j++) {
      if (entryList[j].images[0] === entry.images[0] && entryList[j].images[1] === entry.images[1]) {
        exists = true
        entryList[j] = entry // replace with newer entry
        break
      }
    }
    if (!exists) {
      entryList.push(entry)
      console.debug(imgs[i].parentNode)
      console.debug(entry)
    }
  }
  const statusImageCollector = document.getElementById('statusImageCollector')
  if (statusImageCollector) {
    statusImageCollector.innerHTML = `Collected ${entryList.length} images`
  }
}

function addButton () {
  if (document.querySelector('.downloadoriginal123button')) {
    return
  }

  if (document.querySelector('[data-test-id="board-tools"],[data-test-id="board-header"]') && document.querySelectorAll('[data-test-id="board-feed"] a[href^="/pin/"] img').length) {
    const button = document.createElement('div')
    button.type = 'button'
    button.classList.add('downloadoriginal123button')
    button.setAttribute('style', `
position: absolute;
display: block;
background: white;
border: none;
padding: 5px;
text-align: center;
cursor:pointer;
`)
    button.innerHTML = `
<div class="buttonText" style="background: #efefef;border: #efefef 1px solid;border-radius: 24px;padding: 5px;font-size: xx-large;color: #111;width: 62px; height: 58px;">\u2B73</div>
<div style="font-weight: 700;color: #111;font-size: 12px;">Download<br>originals</div>
`
    button.addEventListener('click', prepareForDownloading)
    document.querySelector('[data-test-id="board-tools"],[data-test-id="board-header"]').appendChild(button)
    try {
      const buttons = document.querySelectorAll('[role="button"] a[href*="/more-ideas/"],[data-test-id="board-header"] [role="button"]')
      const rect = buttons[buttons.length - 1].getBoundingClientRect()
      button.style.top = rect.top - 2 + 'px'
      button.style.left = rect.left - rect.width + 300 + 'px'
    } catch (e) {
      console.warn(e)
      try {
        const title = document.querySelector('h1')
        const rect = title.getBoundingClientRect()
        button.style.top = rect.top - 2 + 'px'
        button.style.left = rect.left - 120 + 'px'
      } catch (e) {
        console.warn(e)
      }
    }
  }
}

GM.registerMenuCommand('Pinterest.com - backup originals', prepareForDownloading)
addButton()
window.setInterval(addButton, 1000)
window.setInterval(collectImages, 400)

function downloadOriginals () {
  try {
    boardName = document.querySelector('h1').textContent.trim()
    boardNameEscaped = boardName.replace(/[^a-z0-9]/gi, '_')
  } catch (e1) {
    try {
      boardName = document.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/').pop()
      boardNameEscaped = boardName.replace(/[^a-z0-9]/gi, '_')
    } catch (e2) {
      boardName = 'board-' + Math.random()
      boardNameEscaped = boardName
    }
  }
  try {
    userName = document.location.href.match(/\.(\w{2,3})\/(.*?)\//)[2]
    userNameEscaped = userName.replace(/[^a-z0-9]/gi, '_')
  } catch (e) {
    try {
      userName = document.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/').shift()
      userNameEscaped = userName.replace(/[^a-z0-9]/gi, '_')
    } catch (e2) {
      userName = 'user'
      userNameEscaped = userName
    }
  }

  collectImages()
  collectActive = false

  const lst = entryList.slice()

  const total = lst.length
  let zip = new JSZip()
  const fileNameSet = new Set()

  // Create folders
  const imagesFolder = zip.folder('images')
  const errorFolder = zip.folder('error_thumbnails')
  const markdownOut = []
  const htmlOut = []

  document.body.style.padding = '3%'
  document.body.innerHTML = '<h1><span id="counter">' + (total - lst.length) + '</span>/' + total + ' downloaded</h1><br>(Keep this tab visible)<br>' + '</div><progress id="status"></progress> image download<br><progress id="total" value="0" max="' + total + '"></progress> total progress<pre id="statusmessage"></pre>'
  document.scrollingElement.scrollTo(0, 0)
  const pre = document.getElementById('statusmessage')
  const statusbar = document.getElementById('status')
  const totalbar = document.getElementById('total')
  const h1 = document.getElementById('counter');

  (async function work () {
    document.title = (total - lst.length) + '/' + total + ' downloaded'
    h1.innerHTML = totalbar.value = total - lst.length
    statusbar.removeAttribute('value')
    statusbar.removeAttribute('max')

    if (lst.length === 0) {
      document.title = 'Generating zip file...'
      document.body.innerHTML = '<h1>Generating zip file...</h1><progress id="gen_zip_progress"></progress>'
    }
    if (lst.length > 0) {
      const entry = lst.pop()
      const urls = entry.images
      let fileName = null
      const prettyFilename = (s) => safeFileName(s.substr(0, 200)).substr(0, 110).replace(/^[^\w]+/, '').replace(/[^\w]+$/, '')
      if (entry.title) {
        fileName = prettyFilename(entry.title)
      } else if (entry.description) {
        fileName = prettyFilename(entry.description)
      } else if (entry.note) {
        fileName = prettyFilename(entry.note)
      } else if (entry.sourceLink) {
        fileName = prettyFilename(entry.sourceLink.split('/').slice(3).join('-'))
      }

      if (!fileName) {
        fileName = urls[0].split('/').pop()
      } else {
        fileName = fileName + '.' + urls[0].split('/').pop().split('.').pop()
      }

      while (fileNameSet.has(fileName.toLowerCase())) {
        const parts = fileName.split('.')
        parts.splice(parts.length - 1, 0, parseInt(Math.random() * 10000).toString())
        fileName = parts.join('.')
      }
      fileNameSet.add(fileName.toLowerCase())

      pre.innerHTML = fileName
      GM.xmlHttpRequest({
        method: 'GET',
        url: urls[0],
        responseType: 'arraybuffer',
        onload: async function (response) {
          const s = String.fromCharCode.apply(null, new Uint8Array(response.response.slice(0, 125)))
          if (s.indexOf('<Error>') !== -1) {
            // Download thumbnail to error folder
            if (!('isError' in entry) || !entry.isError) {
              const errorEntry = Object.assign({}, entry)
              errorEntry.images = [urls[1]]
              errorEntry.isError = true
              // TODO change title? of error entry
              lst.push(errorEntry)
            }
          } else {
            // Save file to zip
            entry.fileName = fileName
            entry.fileNameUrl = markdownEncodeURIComponent(fileName)
            if (!('isError' in entry) || !entry.isError) {
              imagesFolder.file(fileName, response.response)
              entry.filePath = 'images/' + fileName
              entry.fileUrl = 'images/' + entry.fileNameUrl
              await addMetadata('successful', entry, htmlOut, markdownOut)
            } else {
              errorFolder.file(fileName, response.response)
              entry.filePath = 'error_thumbnails/' + fileName
              entry.fileUrl = 'error_thumbnails/' + entry.fileNameUrl
              await addMetadata('error', entry, htmlOut, markdownOut)
            }
          }

          work()
        },
        onprogress: function (progress) {
          try {
            statusbar.max = progress.total
            statusbar.value = progress.loaded
          } catch (e) { }
        },
        onerror: async function (response) {
          console.error('Error downloading image:', response)
          entry.filePath = ''
          entry.fileUrl = 'https://github.com/cvzi/pinterest-Backup-Original-Files/blob/master/error.svg'
          entry.note = 'Failed to download from: \'' + urls[0] + '\': ' + ('error' in response ? response.error : response.toString())
          await addMetadata('error', entry, htmlOut, markdownOut)

          work()
        }
      })
    } else {
      // Create html and markdown overview
      htmlOut.unshift(`
<style>
  th,td {
    word-wrap: break-word;
    max-width: 25em
  }
  tr:nth-child(2n+2){
    background-color:#f0f0f0
  }
</style>

<h1>${escapeXml(boardName)}</h1>
<h3>
  ${escapeXml(userName)}
  <br>
  <time datetime="${startTime.toISOString()}" title=""${startTime.toString()}">
    ${startTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
  </time>:
  <a href="${escapeXml(document.location.href)}">${escapeXml(document.location.href)}</a>
</h3>

<table border="1">
  <tr>
    <th>Title</th>
    <th>Image</th>
    <th>Pinterest</th>
    <th>Source</th>
    <th>Description</th>
    <th>Notes</th>
  </tr>
`)
      htmlOut.push('</table>')
      zip.file('index.html', htmlOut.join('\n'))
      markdownOut.unshift(`
# ${escapeMD(boardName)}

### ${escapeXml(userName)}

${startTime.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}: ${document.location.href}

| Title | Image | Pinterest | Source | Description | Notes |
|---|---|---|---|---|---|`)

      zip.file('README.md', markdownOut.join('\n'))

      // Done. Open ZIP file
      let zipfilename
      try {
        const d = startTime || new Date()
        zipfilename = userNameEscaped + '_' + boardNameEscaped + '_' + d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? '' : '0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9 ? '' : '0') + d.getDate() +
          '_' + (d.getHours() > 9 ? '' : '0') + d.getHours() + '-' + (d.getMinutes() > 9 ? '' : '0') + d.getMinutes()
      } catch (e) {
        zipfilename = 'board'
      }
      zipfilename += '.zip'
      const content = await zip.generateAsync({ type: 'blob' }) // TODO catch errors
      zip = null
      const h = document.createElement('h1')
      h.appendChild(document.createTextNode('Click here to Download'))
      h.style = 'cursor:pointer; color:blue; background:white; text-decoration:underline'
      document.body.appendChild(h)
      const genZipProgress = document.getElementById('gen_zip_progress')
      if (genZipProgress) {
        genZipProgress.remove()
      }
      h.addEventListener('click', function () {
        saveAs(content, zipfilename)
      })
      saveAs(content, zipfilename)
    }
  })()
}

function addMetadata (status, e, htmlOut, markdownOut) {
  return new Promise((resolve) => {
    writeMetadata(status, e, htmlOut, markdownOut)
    resolve()
  })
}

function writeMetadata (status, entry, htmlOut, markdownOut) {
  // XML escape all values for html
  const entryEscaped = Object.fromEntries(Object.entries(entry).map(entry => {
    const escapedValue = escapeXml(entry[1])
    return [entry[0], escapedValue]
  }))

  // Shorten source link title
  let sourceA = ''
  if (entry.sourceLink) {
    let sourceTitle = decodeURI(entry.sourceLink)
    if (sourceTitle.length > 160) {
      sourceTitle = sourceTitle.substring(0, 155) + '\u2026'
    }
    sourceA = `<a href="${entryEscaped.sourceLink}">${escapeXml(sourceTitle)}</a>`
  }

  // HTML table entry
  htmlOut.push(`  <tr>
    <th id="${entryEscaped.fileNameUrl}">
      <a href="#${entryEscaped.fileNameUrl}">${entryEscaped.title || entryEscaped.description || entryEscaped.fileName}</a
    </th>
    <td>
      <a href="${entryEscaped.fileUrl}">
        <img style="max-width:250px; max-height:250px" src="${entryEscaped.fileUrl}" alt="${entryEscaped.description || entryEscaped.filePath}">
      </a>
    </td>
    <td>
      <a href="${entryEscaped.link}">${entryEscaped.link}</a>
    </td>
    <td>
      ${sourceA}
    </td>
    <td>${entryEscaped.description}</td>
    <td>${entryEscaped.note}</td>
  </tr>
`)

  // Shorten source link title
  let sourceLink = entry.sourceLink || ''
  if (entry.sourceLink) {
    let sourceTitle = decodeURI(entry.sourceLink)
    if (sourceTitle.length > 160) {
      sourceTitle = sourceTitle.substring(0, 155) + '\u2026'
    }
    sourceLink = `[${escapeMD(sourceTitle)}](${entry.sourceLink})`
  }

  // Markdown
  markdownOut.push(`| ${escapeMD(entry.title || entry.description || entry.fileName)}` +
  ` | ![${escapeMD(entry.description || entry.fileName)}](${entry.fileUrl})` +
  ` | ${entry.link || ''}` +
  ` | ${sourceLink}` +
  ` | ${escapeMD(entry.description || '')}` +
  ` | ${escapeMD(entry.note || '')}` + ' |')
}

function parentQuery (node, q) {
  const parents = [node.parentElement]
  node = node.parentElement.parentElement
  while (node) {
    const lst = node.querySelectorAll(q)
    for (let i = 0; i < lst.length; i++) {
      if (parents.indexOf(lst[i]) !== -1) {
        return lst[i]
      }
    }
    parents.push(node)
    node = node.parentElement
  }
  return null
}

function safeFileName (s) {
  const blacklist = /[<>:'"/\\|?*\u0000\n\r\t]/g // eslint-disable-line no-control-regex
  s = s.replace(blacklist, ' ').trim().replace(/^\.+/, '').replace(/\.+$/, '')
  return s.replace(/\s+/g, ' ').trim()
}

function escapeXml (unsafe) {
  // https://stackoverflow.com/a/27979933/
  const s = (unsafe || '').toString()
  return s.replace(/[<>&'"\n\t]/gim, function (c) {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      case '\n': return '<br>'
      case '\t': return ' '
    }
  })
}

function escapeMD (unsafe) {
  // Markdown escape
  const s = (unsafe || '').toString()
  return s.replace(/\W/gim, function (c) {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '\\\''
      case '"': return '\\"'
      case '*': return '\\*'
      case '[': return '\\['
      case ']': return '\\]'
      case '(': return '\\('
      case ')': return '\\)'
      case '{': return '\\{'
      case '}': return '\\}'
      case '`': return '\\`'
      case '!': return '\\!'
      case '|': return '\\|'
      case '#': return '\\#'
      case '+': return '\\+'
      case '-': return '\\-'
      case '\r': return ' '
      case '\n': return '<br>'
      default: return c
    }
  }).trim()
}

function markdownEncodeURIComponent (s) {
  return encodeURIComponent(s).replace(/[[\](){}`!]/g, function (c) {
    switch (c) {
      case '[': return '%5B'
      case ']': return '%5D'
      case '(': return '%28'
      case ')': return '%29'
      case '{': return '%7B'
      case '}': return '%7D'
      case '`': return '%60'
      case '!': return '%21'
    }
  })
}
