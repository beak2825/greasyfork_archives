// ==UserScript==
// @name         Tora EBook Downloader
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  A userscript that allow you download all images in Tora EBook Viewer
// @author       https://github.com/Amarillys
// @match        http://viewer.toraebook.com/imageviewer/index.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js
// @icon         https://www.toranoana.jp/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442731/Tora%20EBook%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/442731/Tora%20EBook%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const bookInfoApi = `http://viewer.toraebook.com/bookinfo_php73.php`
  const imageInfoApi = `http://viewer.toraebook.com/image_php73.php`
  
  window = unsafeWindow
  const bookCode = window.location.search.slice(1)

  const gui = new dat.GUI({
    autoPlace: false,
    useLocalStorage: false
  })
  
  let options = {
    progress: 0
  }

  const clickHandler = {
    text() {},
    download: () => {
      console.log('start downloading')
      main()
    }
  }
  gui.add(clickHandler, 'text').name('Tora-Ebook-Downloader')
  const progressCtl = gui.add(options, 'progress', 0, 100, 0.01).name('Progress')
  gui.add(clickHandler, 'download').name('download')
  gui.open()

  setTimeout(() => {
    gui.domElement.style['z-index'] = 10
    gui.domElement.style.position = 'fixed'
    gui.domElement.style.left = '100px'
    gui.domElement.style.top = '100px'
    window.document.body.appendChild(gui.domElement)
    window.document.getElementById('page0-screen').remove()
  }, 1500)

  async function main() {
    const bookInfoXMLStr = await gmRequireText(`${bookInfoApi}?${bookCode}`)
    const parser = new DOMParser()
    const bookInfo = parser.parseFromString(bookInfoXMLStr, `application/xml`)
    const imageList = Array.from(bookInfo.documentElement.children[1].children[2].children)
    const zip = new JSZip()
    let total = 0
    
    for (let i = 0; i < imageList.length; ++i) {
      const imageInfoURL = `${imageInfoApi}?sp=${bookCode}&x1=${imageList[i].children[7].innerHTML}&x2=${imageList[i].children[8].innerHTML}&t=${9999999999 * Math.random()}`
      const imageInfoText = await gmRequireText(imageInfoURL)
      const imageInfo = JSON.parse(imageInfoText)
      const imageURL = imageInfo.image
      let imageBlockInfo = imageInfo.x
      const image = await gmRequire(imageURL)
      const imageBlobURL = URL.createObjectURL(image)

      const imageEl = await loadImage(imageBlobURL)
      const canvasEl = window.document.createElement('canvas')
      canvasEl.style.position = 'fixed'
      canvasEl.style.left = 0
      canvasEl.width = imageEl.width
      canvasEl.height = imageEl.height
      window.document.body.appendChild(canvasEl)
      const ctx = canvasEl.getContext('2d')
      
      imageBlockInfo = imageBlockInfo.slice(1)
      for (let j = 0; j < imageBlockInfo.length - 1; ++j) {
        ctx.drawImage(imageEl, imageBlockInfo[j][2], imageBlockInfo[j][3], imageBlockInfo[j][4], imageBlockInfo[j][5],
            imageBlockInfo[j][0], imageBlockInfo[j][1], imageBlockInfo[j][4], imageBlockInfo[j][5])
      }
      canvasEl.toBlob(blob => {
        zip.folder(purifyName(window.document.title)).file(`${purifyName(i)}.jpg`, blob, {
          compression: 'STORE'
        })
        total++
        setTimeout(() => canvasEl.remove(), 1200)
        progressCtl.setValue(total / imageList.length * 100)
        if (total === imageList.length) {
          zip.generateAsync({
            type: 'blob',
            compression: 'STORE'
          }).then(zipBlob => saveBlob(zipBlob, `${purifyName(window.document.title)}.zip`))
        }
      }, "image/jpeg", 0.95)
    }
  }
  
  function gmRequire(url, index, overrideMimeType, responseType) {
    return new Promise((resolve) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        overrideMimeType: overrideMimeType || 'image/jpeg',
        responseType: responseType || 'blob',
        asynchrouns: true,
        credentials: "include",
        onload: res => {
          if (responseType === 'json') resolve(res.responseText)
          else resolve(res.response)
        },
        onerror: console.error
      })
    )
  }

  function gmRequireText(url, index) {
    return gmRequire(url, index, 'application/json', 'json')
  }
  
  function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
  }

  function purifyName(filename) {
    return (filename + '').replaceAll(':', '').replaceAll('/', '').replaceAll('\\', '').replaceAll('>', '').replaceAll('<', '')
        .replaceAll('*:', '').replaceAll('|', '').replaceAll('?', '').replaceAll('"', '')
  }

  function saveBlob(blob, fileName) {
    let downloadDom = document.createElement('a')
    document.body.appendChild(downloadDom)
    downloadDom.style = `display: none`
    let url = window.URL.createObjectURL(blob)
    downloadDom.href = url
    downloadDom.download = fileName
    downloadDom.click()
    window.URL.revokeObjectURL(url)
  }
})();
