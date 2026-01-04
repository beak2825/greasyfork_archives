// ==UserScript==
// @name              Comic Fuz Downloader
// @name:en           Comic Fuz Downloader
// @namespace         http://circleliu.cn
// @version           0.4.10
// @description       Userscript for download comics on Comic Fuz
// @description:en    Userscript for download comics on Comic Fuz
// @author            Circle
// @license           MIT
// @match             https://comic-fuz.com/book/viewer*
// @match             https://comic-fuz.com/magazine/viewer*
// @match             https://comic-fuz.com/manga/viewer*
// @run-at            document-start
// @grant             none

// @require           https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js
// @require           https://unpkg.com/axios/dist/axios.min.js
// @require           https://unpkg.com/jszip@3.6.0/dist/jszip.min.js
// @require           https://unpkg.com/jszip-utils@0.1.0/dist/jszip-utils.min.js
// @require           https://unpkg.com/jszip@3.6.0/vendor/FileSaver.js
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/protobufjs@6.11.2/dist/protobuf.min.js
// @require           https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require           https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.min.js

// @require           https://greasyfork.org/scripts/435461-comic-fuz-downloader-protobuf-message/code/Comic%20Fuz%20Downloader%20Protobuf%20Message.js?version=987894

// @homepageURL       https://circleliu.github.io/Comic-Fuz-Downloader/
// @supportURL        https://github.com/CircleLiu/Comic-Fuz-Downloader
// @downloadURL https://update.greasyfork.org/scripts/428281/Comic%20Fuz%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/428281/Comic%20Fuz%20Downloader.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const DEFAULT_CONFIGS = {
    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted/retried.
    // `0` is never timeout
    timeout: 60000,
    // The number of times to retry before failing.
    maxRetries: 3,
    //the delay in milliseconds between retried requests.
    retryDelay: 1000,
  }

  const api = getApi()

  const imgBaseUrl = 'https://img.comic-fuz.com'
  const apiBaseUrl = 'https://api.comic-fuz.com'

  const client = axios.create({
    baseURL: imgBaseUrl,
    ...DEFAULT_CONFIGS,
  })

  client.interceptors.response.use(null, (error) => {
    if (error.config && shouldRetry(error)) {
      const { __retryCount: retryCount = 0 } = error.config
      error.config.__retryCount = retryCount + 1
      const delay = error.config.retryDelay
      return new Promise((resolve) => {
        setTimeout(() => resolve(client(error.config)), delay)
      })
    }
    return Promise.reject(error)
  })

  const shouldRetry = (error) => {
    const { maxRetries, __retryCount: retryCount = 0 } = error.config
    if (retryCount < maxRetries) {
      return true
    }
    return false
  }

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  class Comic {
    constructor (path, request, response) {
      const deviceInfo = {
        deviceType: 2,
      }
      this.url = `${apiBaseUrl}/v1/${path}`
      this.requestBody = {
        deviceInfo,
      }
      this.request = request
      this.response = response
    }

    async fetchMetadata() {
      const response = await fetch(this.url, {
        method: 'POST',
        credentials: 'include',
        body: this.request.encode(this.requestBody).finish(),
      })
      this.metadata = await this.decodeResponse(response)
    }

    async decodeResponse(response) {
      const data = await response.arrayBuffer()
      const res = this.response.decode(new Uint8Array(data))
      return res
    }
  }

  class Book extends Comic {
    constructor (bookIssueId) {
      super('book_viewer_2', api.v1.BookViewer2Request, api.v1.BookViewer2Response)
      this.requestBody = {
        deviceInfo: this.requestBody.deviceInfo,
        bookIssueId,
        consumePaidPoint: 0,
        purchaseRequest: false,
      }
    }
  }

  class Magazine extends Comic {
    constructor (magazineIssueId) {
      super('magazine_viewer_2', api.v1.MagazineViewer2Request, api.v1.MagazineViewer2Response)
      this.requestBody = {
        deviceInfo: this.requestBody.deviceInfo,
        magazineIssueId,
        consumePaidPoint: 0,
        purchaseRequest: false,
      }
    }
  }

  class Manga extends Comic {
    constructor (chapterId) {
      super('manga_viewer', api.v1.MangaViewerRequest, api.v1.MangaViewerResponse)
      this.requestBody = {
        deviceInfo: this.requestBody.deviceInfo,
        chapterId,
        consumePoint: {
          event: 0,
          paid: 0,
        },
        useTicket: false,
      }
    }
  }

  let comic
  async function initialize() {
    const path = new URL(window.location.href).pathname.split('/')
    const type = path[path.length - 3]
    const id = path[path.length - 1]
    switch (type.toLowerCase()) {
      case 'book':
        comic = new Book(id)
        break
      case 'magazine':
        comic = new Magazine(id)
        break
      case 'manga':
        comic = new Manga(id)
        break
    }
    await comic.fetchMetadata()
  }

  async function decryptImage({imageUrl, encryptionKey, iv}) {
    const res = await client.get(imageUrl, {
      responseType: 'arraybuffer',
    })

    if (!imageUrl.includes('.enc')) {
      return btoa([].reduce.call(new Uint8Array(res.data),function(p,c){return p+String.fromCharCode(c)},''))
    }

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.lib.WordArray.create(res.data)
    })
    const key = CryptoJS.enc.Hex.parse(encryptionKey)
    const _iv = CryptoJS.enc.Hex.parse(iv)
    const dcWordArray = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
    })
    return dcWordArray.toString(CryptoJS.enc.Base64)
  }

  $(document).ready($ => {
    const downloadIcon = 'https://circleliu.github.io/Comic-Fuz-Downloader/icons/download.png'
    const loadingIcon = 'https://circleliu.github.io/Comic-Fuz-Downloader/icons/loading.gif'
    // const downloadIcon = 'http://localhost:5000/icons/download.png'
    // const loadingIcon = 'http://localhost:5000/icons/loading.gif'
    const divDownload = $(`
      <div id="downloader"></div>
    `)
    const path = new URL(window.location.href).pathname.split('/')
    const is_manga = (path[path.length - 3].toLowerCase()) === 'manga'
    if (is_manga) {
      divDownload.css({
        "grid-area": 'rright',
        display: 'flex',
        "align-items": 'center',
        gap: '24px',
        color: '#929ea5',
      })
    } else {
      divDownload.css({
        'margin-left': '24px',
        flex: '1 1',
        color: '#2c3438',
        width: 'fit-content',
      })
    }

    const spanDownloadButton = $(`
      <span id="downloadButton">
        <img id="downloaderIcon" src="${downloadIcon}">
        <img id="downloadingIcon" src="${loadingIcon}">
        <span id="downloaderText">Initializing</span>
      </span>
    `)
    spanDownloadButton.css({
      cursor: 'pointer',
    })
    spanDownloadButton.on('click', async () => {
      setDownloaderBusy()
      try {
        await downloadAsZip(comic.metadata, +$('#downloadFrom').val(), +$('#downloadTo').val())
        setDownloaderReady()
      } catch (error) {
        console.error(error)
        setDownloaderReady(error.message)
      }
    })

    const spanDownloadRange = $(`
      <span id="downloadRange">
        <input id="downloadFrom" type="number">~<input id="downloadTo" type="number">
      </span>
    `)
    spanDownloadRange.children('input').css({
      width: '3rem',
    })


    function initRange() {
      if (!comic.metadata) {
        throw new Error('No metadata')
      }
      const maxLength = comic.metadata.pages.filter(({image}) => !!image).length
      spanDownloadRange.children('input').attr({
        min: 1,
        max: maxLength,
      })

      $('#downloadFrom').val(1)
      $('#downloadFrom').on('input', _.debounce(() => {
        if (!$('#downloadFrom').val()) return

        const max = Math.min(+$('#downloadFrom').attr('max'), +$('#downloadTo').val())
        if (+$('#downloadFrom').val() < +$('#downloadFrom').attr('min')) {
          $('#downloadFrom').val($('#downloadFrom').attr('min'))
        } else if (+$('#downloadFrom').val() > max) {
          $('#downloadFrom').val(max)
        }
      }, 300))

      $('#downloadTo').val(maxLength)
      $('#downloadTo').on('input', _.debounce(() => {
        if (!$('#downloadTo').val()) return

        const min = Math.max(+$('#downloadTo').attr('min'), +$('#downloadFrom').val())
        if (+$('#downloadTo').val() > +$('#downloadTo').attr('max')) {
          $('#downloadTo').val($('#downloadTo').attr('max'))
        } else if (+$('#downloadTo').val() < min) {
          $('#downloadTo').val(min)
        }
      }, 300))
    }

    divDownload.append(spanDownloadButton)
    divDownload.append(spanDownloadRange)


    function setDownloaderReady(msg) {
      $('#downloaderIcon').show()
      $('#downloadingIcon').hide()
      setText(msg || 'Download')
    }

    function setDownloaderBusy() {
      $('#downloaderIcon').hide()
      $('#downloadingIcon').show()
    }

    function setText(text) {
      $('#downloaderText').text(text)
    }

    function updateDownloadProgress(progress) {
      setText(`Loading: ${progress.done}/${progress.total}`)
    }

    function checkAndLoad() {
      if ($('#downloader').length === 0) {
        if (is_manga) {
          $('div[class^="InternalViewerFooter_footer__wrapper__"]:first').append(divDownload)
        } else {
          $('div[class^="ViewerFooter_footer__buttons__"]:first').append(divDownload)
        }
      }
    }

    const maxRetry = 10
    ;(async () => {
      for (let i = 0; i < maxRetry; ++i) {
        const old_ui = !is_manga && $('div[class^="ViewerFooter_footer__"]').length
        const new_ui = is_manga && $('div[class^="InternalViewerFooter_footer__wrapper__"]').length
        if (old_ui || new_ui) {

          if (old_ui) {
            const zoomContainer = $('div[class^="ViewerFooter_footer__zoomContainer__"]:first').attr('class')
            $('head').append(`<style type="text/css">
                .${zoomContainer} {
                  flex: 0 1 270px;
                }
              </style>`)
          } else {
            const footer = $('div[class^="InternalViewerFooter_footer__wrapper__"]:first').attr('class')
            $('head').append(`<style type="text/css">
                .${footer} {
                  grid-template-areas: "left center right rright";
                  grid-template-columns: auto 1fr auto auto;
                }
              </style>`)
          }

          checkAndLoad()
          $(document).on('click', checkAndLoad)
          setDownloaderBusy()
          setText('Initializing...')
          try {
            await initialize()
            initRange()
            setDownloaderReady()
          } catch (err) {
            setDownloaderReady('Initialization failed!')
          }
          break
        } else {
          await delay(500)
        }
      }
    })()

    async function downloadAsZip(metadata, pageFrom, pageTo) {
      if (!metadata) {
        throw new Error('Failed to load data!')
      } else if (!pageFrom || !pageTo || pageFrom > pageTo) {
        throw new Error('Incorrect Range!')
      }

      const zipName = getNameFromMetadata(metadata)
      const zip = new JSZip()
      if (metadata.tableOfContents){
        zip.file('TableOfContents.txt', JSON.stringify(metadata.tableOfContents, null, '  '))
      }

      const progress = {
        total: 0,
        done: 0,
      }
      const promises = []
      const images = metadata.pages.slice(pageFrom - 1, pageTo)
      for (let i = 0; i < images.length; i++) {
        await delay(i > 0 ? 100 : 0)
        const {image} = images[i]
        if (image) {
          progress.total++
          promises.push(getImageToZip(image, zip, progress, pageFrom + i))
        }
      }
      await Promise.all(promises)

      const content = await zip.generateAsync({ type: 'blob' }, ({ percent }) => {
        setText(`Packaging: ${percent.toFixed(2)}%`)
      })
      saveAs(content, `${zipName}.zip`)
    }

    function getNameFromMetadata(metadata) {
      if (metadata.bookIssue) {
        return metadata.bookIssue.bookIssueName.trim()
      } else if (metadata.viewerTitle) {
        return metadata.sns?.body?.match(/(?<=「).*(?=」)/)?.[0]?.trim() ?? metadata.viewerTitle.trim()
      } else if (metadata.magazineIssue) {
        return metadata.magazineIssue.magazineName.trim() + ' ' + metadata.magazineIssue.magazineIssueName.trim()
      }
    }

    async function getImageToZip(image, zip, progress, index) {
      const fileName = `${index.toString().padStart(3, '0')}.jpeg`
      try {
        const imageData = await decryptImage(image)
        const imageData72Dpi = modifyExif(imageData)
        addImageToZip(fileName, imageData72Dpi, zip)
      } catch (err) {
        console.error(err)
      }
      if (progress) {
        progress.done++
        updateDownloadProgress(progress)
      }
    }

    function addImageToZip(name, base64Data, zip) {
      zip.file(name, base64Data, {
        base64: true,
      })
    }

    function modifyExif(base64Data) {
      const imageString = atob(base64Data)
      const exif = piexif.load(imageString)

      exif['0th'][piexif.ImageIFD.XResolution] = [720000,10000]
      exif['0th'][piexif.ImageIFD.YResolution] = [720000,10000]

      const newExifDump = piexif.dump(exif)

      const newData = piexif.insert(newExifDump, imageString)
      const newBase64 = btoa(newData)

      return newBase64
    }
  })
})()
