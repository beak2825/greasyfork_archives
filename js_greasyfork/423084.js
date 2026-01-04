// ==UserScript==
// @name         NGA 图片浏览器
// @namespace    https://greasyfork.org/zh-CN/users/164691-shy07
// @version      1.91
// @description  收集指定楼层的图片，改善图片浏览体验，并支持批量下载
// @author       Shy07
// @match        *://nga.178.com/*
// @match        *://bbs.ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlHttpRequest
// jshint        esversion:6
// @downloadURL https://update.greasyfork.org/scripts/423084/NGA%20%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/423084/NGA%20%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.meta.js
// ==/UserScript==

((ui, self) => {
  'use strict'

  if (ui === undefined) return

  let imageSources = []
  let currentImage = 0
  let napTimer = null
  let zoomRate = 1
  let rotateDeg = 0

  const callerId = '_shy07_gallery_caller'
  const containerClass = '_shy07_gallery_container'
  const imgClass = '_shy07_gallery_img'
  const progressID = '_shy07_progress_id'
  const topLeftMenuID = '_shy07_top_left_menu'
  const leftArrowID = '_shy07_left_arrow'
  const rightArrowID = '_shy07_right_arrow'
  const closeBtnID = '_shy07_close_btn'
  const galleryContainerStyle = `
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  `
  const galleryMaskStyle = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: -1;
  `
  const galleryImgStyle = `
    top: 0;
    left: 0;
    width: auto;
    height: 100vh;
  `
  const arrowStyle = `
    display: block;
    position: fixed;
    top: 0;
    line-height: 100vh;
    color: rgba(255, 255, 255, 0.6);
    font-size: 5rem;
    text-decoration-line: none;
  `
  const leftArrowStyle = `
    left: 0;
    padding-left: 1rem;
  `
  const rightArrowStyle = `
    right: 0;
    padding-right: 1rem;
  `
  const closeBtnStyle = `
    display: text-block;
    position: fixed;
    top: 0;
    right: 0;
    padding: .5rem 1rem;
    color: #fff;
    text-decoration-line: none;
  `
  const topLeftMenuStyle = `
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding: .5rem 1rem;
    background: rgba(0, 0, 0, 0.3);
    transition: all .4s linear;
  `
  const topLeftMenuItemStyle = `
    display: text-block;
    margin-right: 1rem;
    color: #fff;
    text-decoration-line: none;
  `

  const showCollapseContent = container => {
    const elements = container.querySelectorAll('.collapse_btn')
    if (elements && elements.length > 0) {
      elements.forEach(ele => {
        const btn = ele.querySelector('button')
        btn && btn.click()
      })
    }
  }

  const setImageSrc = (index, ele = null) => {
    const progress = document.querySelector('#' + progressID)
    if (progress) progress.innerHTML = `${index + 1}/${imageSources.length}`
    const src = imageSources[index]
    const img = ele || document.querySelector('.' + imgClass)
    if (img) {
      img.src = src
      img.style.transform = `scale(.75) rotate(0deg)`
    }
    zoomRate = .75
    rotateDeg = 0
    wakeAll()
    if (napTimer) clearTimeout(napTimer)
    napTimer = setTimeout(() => {
      napAll()
      zoomIn(1)
    }, 1000 * 5)
  }
  const prevImage = ev => {
    currentImage = currentImage === 0 ? imageSources.length - 1 : currentImage - 1
    setImageSrc(currentImage)
    ev.stopPropagation()
  }
  const nextImage = ev => {
    currentImage = currentImage === imageSources.length - 1 ? 0 : currentImage + 1
    setImageSrc(currentImage)
    ev.stopPropagation()
  }
  const handleKeydown = ev => {
    const code = ev.keyCode
    if (code === 27 || code === 32) {
      hideGallery()
      ev.preventDefault()
    } else if (code === 37) {
      prevImage()
      ev.preventDefault()
    } else if (code === 38) {
      zoomIn()
      ev.preventDefault()
    } else if (code === 39) {
      nextImage()
      ev.preventDefault()
    } else if (code === 40) {
      zoomOut()
      ev.preventDefault()
    }
  }

  function throttle (final, delay, time) {
    let timeout = null
    let startTime = new Date()
    let skip = false
    return e => {
      e.preventDefault()
      e.stopPropagation()
      let curTime = new Date()
      clearTimeout(timeout)
      if (curTime - startTime >= time) {
        if (!skip) {
          final(e)
          setTimeout(() => (skip = false), delay)
        }
        skip = true
        startTime = curTime
      } else {
        !skip && (timeout = setTimeout(() => final(e), time))
      }
    }
  }

  const rotateImage = ev => {
    ev.stopPropagation()
    const img = document.querySelector('.' + imgClass)
    if (img) {
      rotateDeg += 90
      img.style.transform = `scale(${zoomRate}) rotate(${rotateDeg}deg)`
    }
  }
  const zoomIn = (rate = null) => {
    const img = document.querySelector('.' + imgClass)
    if (img) {
      zoomRate = zoomRate === 5 ? zoomRate : zoomRate + .25
      if (rate) zoomRate = rate
      img.style.transform = `scale(${zoomRate}) rotate(${rotateDeg}deg)`
    }
  }
  const zoomOut = () => {
    const img = document.querySelector('.' + imgClass)
    if (img) {
      zoomRate = zoomRate === .25 ? zoomRate : zoomRate - .25
      img.style.transform = `scale(${zoomRate}) rotate(${rotateDeg}deg)`
    }
  }
  const handleMousewheel = throttle(e => {
    if (e.wheelDelta) { // IE/Opera/Chrome
      if (e.wheelDelta > 0) {
        zoomIn()
      }
      if (e.wheelDelta < 0) {
        zoomOut()
      }
    } else if (e.detail) { // Firefox
      if (e.detail > 0) {
        zoomIn()
      }
      if (e.detail < 0) {
        zoomOut()
      }
    }
  }, 400, 400)

  const ajaxDownload = (url, callback, args, tryTimes = 0) => {
    const GM_download = GM.xmlHttpRequest || GM_xmlHttpRequest
    const clearUrl = url.replace(/[&\?]?download_timestamp=\d+/, '')
    const retryUrl = clearUrl + (clearUrl.indexOf('?') === -1 ? '?' : '&') + 'download_timestamp=' + new Date().getTime()
    GM_download({
      method: 'GET',
      responseType: 'blob',
      url: url,
      onreadystatechange: (responseDetails) => {
        if (responseDetails.readyState === 4) {
          if (responseDetails.status === 200 || responseDetails.status === 304 || responseDetails.status === 0) {
            const blob = responseDetails.response
            const size = blob && blob.size
            if (size && (size / 1024 >= 5)) {
              callback(blob, args)
            } else if (tryTimes++ === 3) {
              callback(blob, args)
            } else {
              ajaxDownload(retryUrl, callback, args, tryTimes)
            }
          } else {
            if (tryTimes++ === 3) {
              callback(null, args)
            } else {
              ajaxDownload(retryUrl, callback, args, tryTimes)
            }
          }
        }
      },
      onerror: (responseDetails) => {
        if (tryTimes++ === 3) {
          callback(null, args)
        } else {
          ajaxDownload(retryUrl, callback, args, tryTimes)
        }
        console.log(responseDetails.status)
      }
    })
  }

  const downloadBlobFile = (content, fileName) => {
    if ('msSaveOrOpenBlob' in navigator) {
      navigator.msSaveOrOpenBlob(content, fileName)
    } else {
      const aLink = document.createElement('a')
      aLink.download = fileName
      aLink.style = 'display:none;'
      const blob = new Blob([content])
      aLink.href = window.URL.createObjectURL(blob)
      document.body.appendChild(aLink)
      if (document.all) {
        aLink.click() //IE
      } else {
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        aLink.dispatchEvent(evt) // 其它浏览器
      }
      window.URL.revokeObjectURL(aLink.href)
      document.body.removeChild(aLink)
    }
  }

  const downloadImage = ev => {
    const url = imageSources[currentImage]
    const filename = url.split('/').pop()
    ajaxDownload(url, downloadBlobFile, filename)
    ev.stopPropagation()
  }

  const downloadAllImage = (blob = null, { list, filename } = {}) => {
    if (blob && filename) downloadBlobFile(blob, filename)
    const [first, ...newList] = list || imageSources
    if (!first) return
    const f = first.split('/').pop()
    ajaxDownload(first, downloadAllImage, { list: newList, filename: f })
  }
  const handleDownloadAll = ev => {
    downloadAllImage()
    ev.stopPropagation()
  }

  const createGalleryImage = () => {
    currentImage = 0
    const img = document.createElement('img')
    img.className = imgClass
    img.style = galleryImgStyle
    img.addEventListener('wheel', handleMousewheel)
    setImageSrc(0, img)
    return img
  }
  const createLeftArrow = () => {
    const ele = document.createElement('a')
    ele.id = leftArrowID
    ele.style = arrowStyle + leftArrowStyle
    ele.innerHTML = '<'
    ele.href = 'javascript:;'
    ele.addEventListener('click', prevImage)
    ele.addEventListener('mouseover', wakeAll)
    ele.addEventListener('mouseleave', napAll)
    return ele
  }
  const createRightArrow = () => {
    const ele = document.createElement('a')
    ele.id = rightArrowID
    ele.style = arrowStyle + rightArrowStyle
    ele.innerHTML = '>'
    ele.href = 'javascript:;'
    ele.addEventListener('click', nextImage)
    ele.addEventListener('mouseover', wakeAll)
    ele.addEventListener('mouseleave', napAll)
    return ele
  }
  const createCloseBtn = () => {
    const ele = document.createElement('a')
    ele.id = closeBtnID
    ele.style = closeBtnStyle
    ele.innerHTML = '关闭'
    ele.href = 'javascript:;'
    ele.addEventListener('click', hideGallery)
    ele.addEventListener('mouseover', wakeAll)
    ele.addEventListener('mouseleave', napAll)
    return ele
  }
  const createTopLeftMenu = () => {
    const ele = document.createElement('div')
    ele.id = topLeftMenuID
    ele.style = topLeftMenuStyle
    const progress = document.createElement('span')
    progress.id = progressID
    progress.style= topLeftMenuItemStyle
    progress.innerHTML = `${currentImage + 1}/${imageSources.length}`
    const downloadBtn = document.createElement('a')
    downloadBtn.style= topLeftMenuItemStyle
    downloadBtn.innerHTML = '下载'
    downloadBtn.href = 'javascript:;'
    downloadBtn.addEventListener('click', downloadImage)
    const downloadAllBtn = document.createElement('a')
    downloadAllBtn.style= topLeftMenuItemStyle
    downloadAllBtn.innerHTML = '全部下载'
    downloadAllBtn.href = 'javascript:;'
    downloadAllBtn.addEventListener('click', handleDownloadAll)
    const clockwiseBtn = document.createElement('a')
    clockwiseBtn.style= topLeftMenuItemStyle
    clockwiseBtn.innerHTML = '旋转'
    clockwiseBtn.href = 'javascript:;'
    clockwiseBtn.addEventListener('click', rotateImage)
    ele.appendChild(progress)
    ele.appendChild(downloadBtn)
    ele.appendChild(downloadAllBtn)
    ele.appendChild(clockwiseBtn)
    ele.addEventListener('mouseover', wakeAll)
    ele.addEventListener('mouseleave', napAll)
    return ele
  }

  const napElement = id => () => {
    const ele = document.querySelector('#' + id)
    if (ele) ele.style.opacity = 0
  }
  const wakeElement = id => () => {
    const ele = document.querySelector('#' + id)
    if (ele) ele.style.opacity = 1
  }

  const napAll = () => {
    napElement(topLeftMenuID)()
    napElement(leftArrowID)()
    napElement(rightArrowID)()
    napElement(closeBtnID)()
  }
  const wakeAll = () => {
    wakeElement(topLeftMenuID)()
    wakeElement(leftArrowID)()
    wakeElement(rightArrowID)()
    wakeElement(closeBtnID)()
  }

  const showGallery = () => {
    if (!imageSources.length) {
      window.alert('这层楼没有图片 ￣□￣｜｜')
      return
    }
    document.addEventListener('keydown', handleKeydown)
    const galleryMask = document.querySelector('.' + containerClass)
    if (galleryMask) {
      currentImage = 0
      setImageSrc(currentImage)
      galleryMask.style = galleryContainerStyle
    } else {
      const ele = document.createElement('div')
      ele.className = containerClass
      ele.style = galleryContainerStyle
      const mask = document.createElement('div')
      mask.style = galleryMaskStyle
      mask.addEventListener('click', hideGallery)
      const img = createGalleryImage()
      const leftArrow = createLeftArrow()
      const rightArrow = createRightArrow()
      const closeBtn = createCloseBtn()
      const topLeftMenu = createTopLeftMenu()
      ele.appendChild(mask)
      ele.appendChild(img)
      ele.appendChild(leftArrow)
      ele.appendChild(rightArrow)
      ele.appendChild(topLeftMenu)
      ele.appendChild(closeBtn)
      document.body.appendChild(ele)
    }
  }
  const hideGallery = () => {
    document.removeEventListener('keydown', handleKeydown)
    const galleryMask = document.querySelector('.' + containerClass)
    if (galleryMask) {
      galleryMask.style.display = 'none'
    }
  }

  const getExtname = url => {
    const filename = url.split('/').pop()
    const extname = filename.split('.').pop()
    return extname
  }
  const getOriginFile = srcUrl => {
    const fileExtname = getExtname(srcUrl)
    const url = srcUrl
      .replace(`.medium.${fileExtname}`, '')
      .replace(`.thumb.${fileExtname}`, '')
      .replace(`.thumb_s.${fileExtname}`, '')
      .replace(`.thumb_ss.${fileExtname}`, '')
    return url
  }
  const collectImages = container => {
    showCollapseContent(container)
    imageSources = []
    const imgs = container.querySelectorAll('.postcontent img')
    const temp = []
    imgs.forEach(img => {
      const src = img.src
      const lazySrc = img.dataset ? img.dataset.srclazy : ''
      if (lazySrc) {
        const url = getOriginFile(lazySrc)
        if (!imageSources.includes(url)) imageSources.push(url)
        return
      }
      if (src.includes('/attachments/')) {
        const arr = img.src.replace(/https:/g, 'http:').split('http:')
        const tmp = arr.filter(s => !!s)[0]
        const url = getOriginFile(tmp)
        if (!imageSources.includes(url)) imageSources.push(url)
      }
    })
  }

  const callerButton = container => {
    const a = document.createElement('a')
    const handleClick = () => {
      collectImages(container.parentElement)
      showGallery()
    }
    a.addEventListener('click', handleClick)
    a.id = callerId + container.id
    a.className = 'small_colored_text_btn block_txt_c0 stxt'
    a.href = 'javascript:;'
    a.title = '图片浏览'
    a.innerHTML = `
      <span>&nbsp;
        <span style="font-family: comm_glyphs; -webkit-font-smoothing: antialiased; line-height: 1em;">
          图集
        </span>&nbsp;
      </span>
    `
    return a
  }

  const createCallerButton = postData => {
    const checkExist = document.querySelector('#' + callerId + postData.i)
    if (!checkExist) {
      const container = postData.pInfoC
      container.appendChild(callerButton(container))
    }
  }

  if (ui.postArg) {
    Object.keys(ui.postArg.data).forEach(key => {
      createCallerButton(ui.postArg.data[key])
    })
  }

  // 钩子
  const hookFunction = (object, functionName, callback) => {
    ((originalFunction) => {
      object[functionName] = function () {
        const returnValue = originalFunction.apply(this, arguments)
        callback.apply(this, [returnValue, originalFunction, arguments])
        return returnValue
      }
    })(object[functionName])
  }

  let initialized = false

  hookFunction(ui, 'eval', () => {
    if (initialized) return
    if (ui.postDisp) {
      hookFunction(
        ui,
        'postDisp',
        (returnValue, originalFunction, args) => {
          createCallerButton(ui.postArg.data[args[0]])
        }
      )
      initialized = true
    }
  })

})(commonui, __CURRENT_UID)
