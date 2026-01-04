/* global unsafeWindow dat GM_addStyle */
// ==UserScript==
// @name         Fanbox Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      0.800.3
// @description  Batch Download on creator, not post
// @author       https://github.com/amarillys QQ 719862760
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js
// @match        https://*.fanbox.cc/*
// @match        https://www.fanbox.cc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/390112/Fanbox%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390112/Fanbox%20Batch%20Downloader.meta.js
// ==/UserScript==


/* global JSZip GM_xmlhttpRequest */
;(function() {
  'use strict'

  const apiUserUri = 'https://api.fanbox.cc/creator.get'
  const apiPostListUri = 'https://api.fanbox.cc/post.listCreator'
  const apiPostUri = 'https://api.fanbox.cc/post.info'
  // set style
  GM_addStyle(`
    .dg.main{
      top: 16px;
      position: fixed;
      left: 20%;
      filter: drop-shadow(2px 4px 6px black);
      opacity: 0.8;
      z-index: 999;
    }
    li.cr.number.has-slider:nth-child(2) {
      pointer-events: none;
    }
    .slider-fg {
      transition: width 0.5s ease-out;
    }
  `)

  window = unsafeWindow
  class ThreadPool {
    constructor(poolSize) {
      this.size = poolSize || 20
      this.running = 0
      this.waittingTasks = []
      this.callback = []
      this.tasks = []
      this.counter = 0
      this.sum = 0
      this.finished = false
      this.errorLog = ''
      this.step = () => {}
      this.timer = null
      this.callback.push(() =>
        console.log(this.errorLog)
      )
    }

    status() {
      return ((this.counter / this.sum) * 100).toFixed(1) + '%'
    }

    run() {
      if (this.finished) return
      if (this.waittingTasks.length === 0)
        if (this.running <= 0) {
          for (let m = 0; m < this.callback.length; ++m)
            this.callback[m] && this.callback[m]()
          this.finished = true
        } else return

      while (this.running < this.size) {
        if (this.waittingTasks.length === 0) return
        let curTask = this.waittingTasks[0]
        curTask.do().then(
          onSucceed => {
            this.running--
            this.counter++
            this.step()
            this.run()
            typeof onSucceed === 'function' && onSucceed()
          },
          onFailed => {
            this.errorLog += onFailed + '\n'
            this.running--
            this.counter++
            this.step()
            this.run()
            curTask.err()
          }
        )
        this.waittingTasks.splice(0, 1)
        this.tasks.push(this.waittingTasks[0])
        this.running++
      }
    }

    add(fn, errFn) {
      this.waittingTasks.push({ do: fn, err: errFn || (() => {}) })
      this.sum++
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.run()
        clearTimeout(this.timer)
      }, this.autoStartTime)
    }

    setAutoStart(time) {
      this.autoStartTime = time
    }

    finish(callback) {
      this.callback.push(callback)
    }

    isFinished() {
      return this.finished
    }
  }

  class Zip {
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
      if (this.size + blob.size >= Zip.MAX_SIZE)
        this.pack()
      this.zip.folder(purifyName(folder)).file(purifyName(name), blob, {
        compression: 'STORE'
      })
      this.size += blob.size
    }
    pack() {
      if (this.size === 0) return
      let index = this.partIndex
      this.zip
        .generateAsync({
          type: 'blob',
          compression: 'STORE'
        })
        .then(zipBlob => saveBlob(zipBlob, `${this.title}-${index}.zip`))
      this.partIndex++
      this.zip = new JSZip()
      this.size = 0
    }
  }
  Zip.MAX_SIZE = 850000000/*1048576000*/

  const creatorId = document.URL.startsWith('https://www') ?
        document.URL.match(/@([\w_-]+)\/?/)?.[1] : document.URL.match(/https:\/\/(.+).fanbox/)?.[1]
  if (!creatorId) return;
  let creatorInfo = null
  let options = {
    start: 1,
    end: 1,
    thread: 6,
    batch: 200,
    progress: 0,
    speed: 0,
    nameWithId: 0,
    nameWithDate: 1,
    nameWithTitle: 1
  }

  const Text = {
    batch: '分批 / Batch',
    download: '点击这里下载',
    download_en: 'Click to Download',
    downloading: '下载中...',
    downloading_en: 'Downloading...',
    packing: '打包中...',
    packing_en: 'Packing...',
    packed: '打包完成',
    packed_en: 'Packed!',
    init: '初始化中...',
    init_en: 'Initilizing...',
    initFailed: '请求数据失败',
    initFailed_en: 'Failed to get Data',
    initFailed_0: '请检查网络',
    initFailed_0_en: 'check network',
    initFailed_1: '或Github联系作者',
    initFailed_1_en: 'or connect at Github',
    initFinished: '初始化完成',
    initFinished_en: 'Initilized',
    name_with_id: '文件名带ID',
    name_with_id_en: 'name with id',
    name_with_date: '文件名带日期',
    name_with_date_en: 'name with date',
    name_with_title: '文件名带名字',
    name_with_title_en: 'name with title',
    start: '起始 / start',
    end: '结束 / end',
    thread: '线程 / threads',
    pack: '手动打包(不推荐)',
    pack_en: 'manual pack(Not Rcm)',
    progress: '进度 / Progress',
    speed: '网速 / speed'
  }
  const EN_FIX = navigator.language.indexOf('zh') > -1 ? '' : '_en'

  let label = null
  const gui = new dat.GUI({
    autoPlace: false,
    useLocalStorage: false
  })

  const clickHandler = {
    text() {},
    download: () => {
      console.log('startDownloading')
      downloadByFanboxId(creatorInfo, creatorId)
    },
    pack() {
      label.name(Text['packing' + EN_FIX])
      zip.pack()
      label.name(Text['packed' + EN_FIX])
    }
  }

  label = gui.add(clickHandler, 'text').name(Text['init' + EN_FIX])
  let progressCtl = null

  let init = async () => {
    let base = window.document.querySelector('#root')

    base.appendChild(gui.domElement)
    uiInited = true

    try {
      creatorInfo = await getAllPostsByFanboxId(creatorId)
      label.name(Text['initFinished' + EN_FIX])
    } catch (e) {
        label.name(Text['initFailed' + EN_FIX])
        gui.add(clickHandler, 'text').name(Text['initFailed_0' + EN_FIX])
        gui.add(clickHandler, 'text').name(Text['initFailed_1' + EN_FIX])
        return
    }

    // init dat gui
    const sum = creatorInfo.posts.length
    progressCtl = gui.add(options, 'progress', 0, 100, 0.01).name(Text.progress)
    const startCtl = gui.add(options, 'start', 1, sum, 1).name(Text.start)
    const endCtl = gui.add(options, 'end', 1, sum, 1).name(Text.end)
    gui.add(options, 'thread', 1, 20, 1).name(Text.thread)
    gui.add(options, 'batch', 10, 5000, 10).name(Text.batch)
    gui.add(options, 'nameWithId', 0, 1, 1).name(Text['name_with_id' + EN_FIX])
    gui.add(options, 'nameWithDate', 0, 1, 1).name(Text['name_with_date' + EN_FIX])
    // gui.add(options, 'nameWithTitle', 0, 1, 1).name(Text['name_with_title' + EN_FIX])
    gui.add(clickHandler, 'download').name(Text['download' + EN_FIX])
    gui.add(clickHandler, 'pack').name(Text['pack' + EN_FIX])
    endCtl.setValue(sum)
    startCtl.onChange(() => (options.start = options.start > options.end ? options.end : options.start))
    endCtl.onChange(() => (options.end = options.end < options.start ? options.start : options.end ))
    gui.open()
  }

  // init global values
  let zip = null
  let amount = 1
  let pool = null
  let progressList = []
  let uiInited = false

  const fetchOptions = {
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*'
    }
  }

  const setProgress = amount => {
    let currentProgress = progressList.reduce((p, q) => (p>0?p:0) + (q>0?q:0), 0) / amount * 100
    if (currentProgress > 0)
      progressCtl.setValue(currentProgress)
  }

  window.onload = () => {
    init()
    let timer = setInterval(() => {
      (!uiInited && document.querySelector('.dg.main') === null) ? init() : clearInterval(timer)
    }, 3000)
  }

  async function downloadByFanboxId(creatorInfo) {
    let processed = 0
    amount = 0
    label.name(Text['downloading' + EN_FIX])
    progressCtl.setValue(0)
    let { batch, end, start, thread } = options
    options.progress = 0
    zip = new Zip(`${creatorInfo.name}@${start}-${end}`)
    let stepped = 0
    // init pool
    pool = new ThreadPool(thread)
    pool.finish(() => {
      label.name(Text['packing' + EN_FIX])
      zip.pack()
      label.name(Text['packed' + EN_FIX])
    })

    // for name exist detect
    let titles = []
    progressList = new Array(amount).fill(0)
    pool.step = () => {
      console.log(` Progress: ${processed} / ${amount}, Pool: ${pool.running} @ ${pool.sum}`)
      if (stepped >= batch) {
        zip.pack()
        stepped = 0
      }
    }

    // start downloading
    for (let i = start - 1, p = creatorInfo.posts; i < end; ++i) {
      let folder = '';
      options.nameWithDate === 1 && (folder += `[${p[i].publishedDatetime.split('T')[0].replace(/-/g, '')}] - `);
      folder += p[i].title.replace(/\//g, '-');
      options.nameWithId === 1 && (folder += ` - ${p[i].id}`);
      let titleExistLength = titles.filter(title => title === folder).length
      if (titleExistLength > 0) folder += `-${titleExistLength}`
      folder = purifyName(folder)
      titles.push(folder)
      try {
        p[i].body = (await (await fetch(`${apiPostUri}?postId=${p[i].id}`, {
          credentials: "include"
        })).json()).body.body
        if (!p[i].body) continue
      } catch (e) {
        console.error(e)
        continue
      }

      if (p[i].coverImageUrl) {
        gmRequireImage(p[i].coverImageUrl).then(blob => {
          zip.add(folder, `cover${p[i].coverImageUrl.slice(p[i].coverImageUrl.lastIndexOf('.'))}`, blob)
        }).catch(e => {
          console.error(`Failed to download: ${p[i].coverImageUrl}\n${e}`)
        })
      }
      let { blocks, embedMap, imageMap, fileMap, files, images, text } = p[i].body
      let picIndex = 0
      let fileIndex = 0
      let imageList = []
      let fileList = []

      if (blocks?.length > 0) {
        let article = `# ${p[i].title}\n`
        for (let j = 0; j < blocks.length; ++j) {
          switch (blocks[j].type) {
            case 'p': {
              article += `${blocks[j].text}\n\n`
              break
            }
            case 'image': {
              let image = imageMap[blocks[j].imageId]
              imageList.push(image)
              article += `![${p[i].title} - P${picIndex}](${folder}_${picIndex}.${image.extension})\n\n`
              picIndex++
              break
            }
            case 'file': {
              let file = fileMap[blocks[j].fileId]
              fileList.push(file)
              article += `[File${fileIndex} - ${file.name}](${file.name}.${file.extension})\n\n`
              fileIndex++
              break
            }
            case 'embed': {
              let extenalUrl = embedMap[blocks[j].embedId]
              let serviceProvideMap = {
                gist: `[Github Gist - ${extenalUrl.contentId}](https://gist.github.com/${extenalUrl.contentId})`,
                google_forms: `[Google Forms - ${extenalUrl.contentId}](https://docs.google.com/forms/d/e/${extenalUrl.contentId}/viewform)`,
                soundcloud  : `[SoundCloud - ${extenalUrl.contentId}](https://soundcloud.com/${extenalUrl.contentId})`,
                twitter: `[Twitter - ${extenalUrl.contentId}](https://twitter.com/i/web/status/${extenalUrl.contentId})`,
                vimeo  : `[Vimeo - ${extenalUrl.contentId}](https://vimeo.com/${extenalUrl.contentId})`,
                youtube: `[Youtube - ${extenalUrl.contentId}](https://www.youtube.com/watch?v=${extenalUrl.contentId})`
              }
              article += serviceProvideMap[extenalUrl.serviceProvider] + '\n\n'
              break
            }
          }
        }

        zip.add(folder, 'article.md', new Blob([article]))
        for (let j = 0; j < imageList.length; ++j) {
          let image = imageList[j]
          let index = amount
          amount++
          pool.add(() => new Promise((resolve, reject) => {
            gmRequireImage(image.originalUrl, index).then(blob => {
              processed++
              zip.add(folder, `${folder}_${j}.${image.extension}`, blob)
              stepped++
              resolve()
            }).catch(() => {
              console.log(`Failed to download: ${image.originalUrl}`)
              reject()
            })
          }))
        }
        for (let j = 0; j < fileList.length; ++j) {
          let file = fileList[j]
          let index = amount
          amount++
          pool.add(() => new Promise((resolve, reject) => {
            gmRequireImage(file.url, index).then(blob => {
              processed++
              zip.add(folder, `${file.name}.${file.extension}`, blob)
              stepped++
              resolve()
            }).catch(() => {
              console.log(`Failed to download: ${file.url}`)
              reject()
            })
          }))
        }
      }

      if (files) {
        for (let j = 0; j < files.length; ++j) {
          let file = files[j]
          let index = amount
          amount++
          pool.add(() => new Promise((resolve, reject) => {
            gmRequireImage(file.url, index).then(blob => {
              processed++
              let fileIndexText = ''
              if (files.length > 1) fileIndexText = `-${j}`
              if (blob.size < 600 * 1024 * 1024)
                zip.add(folder, `${file.name}${fileIndexText}.${file.extension}`, blob)
              else
                saveBlob(blob, `${creatorInfo.name}@${folder}${fileIndexText}.${file.extension}`)
              stepped++
              resolve()
            }).catch(() => {
              console.log(`Failed to download: ${file.url}`)
              reject()
            })
          }))
        }
      }
      if (images) {
        for (let j = 0; j < images.length; ++j) {
          let image = images[j]
          let index = amount
          amount++
          pool.add(() => new Promise((resolve, reject) => {
            gmRequireImage(image.originalUrl, index).then(blob => {
              processed++
              zip.add(folder, `${folder}_${j}.${image.extension}`, blob)
              stepped++
              resolve()
            }).catch(() => {
              console.log(`Failed to download: ${image.url}`)
              reject()
            })
          }))
        }
      }

      if (text) {
        let textBlob = new Blob([text], { type: 'text/plain' })
        zip.add(folder, `${creatorInfo.name}-${folder}.txt`, textBlob)
      }
    }

    if (creatorInfo.cover)
      gmRequireImage(creatorInfo.cover, 0).then(blob => {
        zip.file('cover.jpg', blob)
        if (amount === 0) zip.pack()
      })
  }

  async function getAllPostsByFanboxId(creatorId) {
    // request userinfo
    const userUri = `${apiUserUri}?creatorId=${creatorId}`
    const userData = await (await fetch(userUri, fetchOptions)).json()
    let creatorInfo = {
      cover: null,
      posts: []
    }
    const limit = 56
    creatorInfo.cover = userData.body.coverImageUrl
    creatorInfo.name = userData.body.user.name

    // request post info
    let postData = await (await fetch(`${apiPostListUri}?creatorId=${creatorId}&limit=${limit}`, fetchOptions)).json()
    creatorInfo.posts.push(...postData.body.items)
    let nextPageUrl = postData.body.nextUrl
    while (nextPageUrl) {
      let nextData = await (await fetch(nextPageUrl, fetchOptions)).json()
      creatorInfo.posts.push(...nextData.body.items)
      nextPageUrl = nextData.body.nextUrl
    }
    console.log(creatorInfo)
    return creatorInfo
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

  function gmRequireImage(url, index) {
    let total = 0;
    return new Promise((resolve, reject) =>
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        overrideMimeType: 'application/octet-stream',
        responseType: 'blob',
        asynchrouns: true,
        credentials: "include",
        onload: res => {
          if (index !== undefined) {
            progressList[index] = 1
            setProgress(amount)
          }
          resolve(res.response)
        },
        onprogress: res => {
          total = Math.max(total, res.total)
          index !== undefined && (progressList[index] = res.done / res.total)
          setProgress(amount)
        },
        onerror: () =>
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            overrideMimeType: 'application/octet-stream',
            responseType: 'arraybuffer',
            onload: res => {
              if (index !== undefined) {
                progressList[index] = 1
                setProgress(amount)
              }
              resolve(new Blob([res.response]))
            },
            onprogress: res => {
              if (index !== undefined) {
                progressList[index] = res.done / res.total
                setProgress(amount)
              }
            },
            onerror: reject
          })
      })
    )
  }

  function purifyName(filename) {
    return filename.replaceAll(':', '').replaceAll('/', '').replaceAll('\\', '').replaceAll('>', '').replaceAll('<', '')
        .replaceAll('*:', '').replaceAll('|', '').replaceAll('?', '').replaceAll('"', '')
  }
})()
