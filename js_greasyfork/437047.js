// ==UserScript==
// @name         UX Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Batch downloader for ux.getuploader.com
// @author       Amarillys
// @match        https://ux.getuploader.com/*
// @icon         https://www.google.com/s2/favicons?domain=getuploader.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437047/UX%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/437047/UX%20Batch%20Downloader.meta.js
// ==/UserScript==


(function() {
  'use strict';
  const G = init()
  window = unsafeWindow
  // const DL_PATH = 'https://downloadx.getuploader.com/g/'
  const user = location.pathname.match(/\/(.*?)\//)[1]
  let status = G.initStatus()
  const statusTextCtl = initGUI(G)

  function init() {
    const G = {}
    G.Zip = class {
      constructor(title) {
        this.title = title
        this.zip = new JSZip()
        this.size = 0
        this.partIndex = 0
      }
      file(filename, blob) {
        this.zip.file(filename, blob, {
          compression: 'STORE'
        })
        this.size += blob.size
      }
      add(folder, name, blob) {
        if (this.size + blob.size >= G.Zip.MAX_SIZE)
          this.pack()
        this.zip.folder(G.purifyName(folder)).file(G.purifyName(name), blob, {
          compression: 'STORE'
        })
        this.size += blob.size
      }
      pack(callback) {
        if (this.size === 0) return
        let index = this.partIndex
        this.zip
          .generateAsync({
            type: 'blob',
            compression: 'STORE'
          })
          .then(zipBlob => {
            G.saveBlob(zipBlob, `${this.title}-${index}.zip`)
            typeof callback === 'function' && callback()
          })
        this.partIndex++
        this.zip = new JSZip()
        this.size = 0
      }
    }
    G.Zip.MAX_SIZE = 850000000

    G.setProgress = status => {
      G.progressCtl.setValue(status.processed / status.amount * 100)
    }

    G.gmRequireImage = function (url, status) {
      const callback = () => {
        status.progressList[status.amount] = 1
        status.processed++
        G.setProgress(status)
      }
      return new Promise((resolve, reject) =>
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          overrideMimeType: 'application/octet-stream',
          responseType: 'blob',
          asynchrouns: true,
          onload: res => {
            callback()
            resolve(res.response)
          },
          onprogress: () => {
            G.setProgress(status)
          },
          onerror: () =>
            GM_xmlhttpRequest({
              method: 'GET',
              url,
              overrideMimeType: 'application/octet-stream',
              responseType: 'arraybuffer',
              onload: res => {
                callback()
                resolve(new Blob([res.response]))
              },
              onprogress: res => {
                status.progressList[status.amount] = res.done / res.total
                G.setProgress(status)
              },
              onerror: res => reject(res)
            })
        })
      )
    }

    G.initStatus = function (user, addition) {
      const zip = new G.Zip(`${user}-${addition}`)
      return {
        amount: 1,
        processed: 0,
        progress: 0,
        failed: 0,
        start: Math.min(...document.documentElement.innerHTML.match(/download\/\d+/g).map(r => +r.slice(9))),
        end: +document.documentElement.innerHTML.match(/download\/(\d+)/)[1],
        progressList: [],
        zip
      }
    }

    G.purifyName = function (filename) {
      return filename.replaceAll(':', '').replaceAll('/', '').replaceAll('\\', '').replaceAll('>', '').replaceAll('<', '')
          .replaceAll('*:', '').replaceAll('|', '').replaceAll('?', '').replaceAll('"', '')
    }

    G.saveBlob = function (blob, fileName) {
      let downloadDom = document.createElement('a')
      document.body.appendChild(downloadDom)
      downloadDom.style = `display: none`
      let url = window.URL.createObjectURL(blob)
      downloadDom.href = url
      downloadDom.download = fileName
      downloadDom.click()
      window.URL.revokeObjectURL(url)
    }

    G.sleep = function (ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }
  
    return G
  }

  function initGUI(G) {
    const gui = new dat.GUI({
      autoPlace: false,
      useLocalStorage: false
    })
    const clickHandler = {
      text() {},
      download() { downloadAll() },
      downloadById() { downloadAll(+status.start, +status.end) }
    }
    G.label = gui.add(clickHandler, 'text').name('v0.11')
    gui.add(clickHandler, 'download').name('Download All')
    G.progressCtl = gui.add(status, 'progress', 0, 100, 0.01).name('Progress')
    gui.add(status, 'start', 1, 1000, 1).name('Start ID')
    gui.add(status, 'end', 1, 1000, 1).name('End ID')
    gui.add(clickHandler, 'downloadById').name('DL By Id')
    const statusTextCtl = gui.add(clickHandler, 'text').name('Initialized.')
    gui.domElement.style.position = 'fixed'
    gui.domElement.style.top = '10%'
    gui.domElement.style.opacity = 0.75
    document.body.appendChild(gui.domElement)
    
    gui.open()
    return statusTextCtl
  }

  async function downloadAll(startID, endID) {
    const zipName = (startID && endID) ? `${startID}-${endID}` : 'all'
    status = G.initStatus(user, zipName)
    statusTextCtl.name('Starting...')
    let index = 1
    do {
      const html = await (await fetch(`https://ux.getuploader.com/${user}/index/date/desc/${index++}`)).text()
      status.amount = (startID && endID) ? (endID - startID + 1 - status.failed) : +html.match(/<td>(\d+) ファイル<\/td>/)[1]
      let files = html.match(/<a href="https:\/\/ux\.getuploader\.com\/\w+\/download\/\d+.*?">.*?<\/a>/g)?.slice(0, 15).filter(i => !i.includes('<img'))
      if (!files || files.length === 0) {
        console.warn('cannot get any files.')
        statusTextCtl.name('Packing...')
        status.zip.pack(() => statusTextCtl.name('Packed.'))        
        break
      }
      files = files.map(f => f.replace('<a href="', '').replace('" title="', '/').slice(0, -2))
      for (let i = 0; i < files.length; ++i) {
        let file = files[i].slice(0, files[i].indexOf('"'))
          .replace('https://ux.getuploader.com', 'https://downloadx.getuploader.com/g').replace('download/', '')
        let filename = file.slice(35).match(/.+\/(.*?\.\w+)$/)[1]
        let fileIndex = parseInt(file.slice(35).split('/')[2])
        if (startID && endID) {
          if (fileIndex < startID || fileIndex > endID) continue
        }
        await(300)
        try {
          const blob = await G.gmRequireImage(file, status)
          status.zip.add(user, `${fileIndex}-${filename}`, blob)
        } catch (e) {
          status.failed++
          console.log(`Failed to download: ${file} ${e}`)
        }
      }
    } while (true)
  }
})();