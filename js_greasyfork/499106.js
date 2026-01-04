// ==UserScript==
// @name         X Long Image Enlarge Tool
// @name:zh-CN   推特长图放大
// @namespace    https://github.com/yanzhili/xImageEnlarge
// @version      2024-07-19
// @description  Add a button on the left top conner of a image,for convenience of displaying long images on X
// @description:zh-CN 在图片右上角显示一个放大按钮，方便显示推特中的长图
// @author       James.Yan
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499106/X%20Long%20Image%20Enlarge%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/499106/X%20Long%20Image%20Enlarge%20Tool.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  window.dev = false
  const MatchPic = 'pbs.twimg.com/media'
  const MarkTag = 'zx-btn-added'
  const ImgClass = 'zx-img-class'
  const ImgBtnClass = 'zx-btn-class'
  const aHrefMap = new Map()
  const imgMap = new Map()

  function main() {
    initCss()
    initFullscreenDiv()
    observeHtml((imgElement) => {
      imgElement.classList.add(ImgClass)
      const largeImg = imgToLarge(imgElement.src)
      distribute(imgElement, largeImg)
      addButton(imgElement.parentElement, largeImg)
    })
  }

  function distribute(element, src) {
    if (!element) return
    if (element.parentElement && element.parentElement.tagName == 'A') {
      const aHref = element.parentElement.getAttribute('href')
      if (aHref.indexOf('/photo/') > -1) {
        const aHrefArr = aHref.split('/photo/')
        if (aHrefArr.length < 1) return
        log(aHrefArr[0], 'keyHref')
        const keyHref = aHrefArr[0]
        const index = Number(aHrefArr[1])
        if (index <= 0) return
        if (!imgMap.has(src)) {
          imgMap.set(src, keyHref)
        }
        if (!aHrefMap.has(keyHref)) {
          let imgArr = []
          imgArr[index - 1] = src
          aHrefMap.set(keyHref, imgArr)
        } else {
          const imgArr = aHrefMap.get(keyHref)
          if (imgArr.indexOf(src) < 0) {
            imgArr[index - 1] = src
            aHrefMap.set(keyHref, imgArr)
          }
        }
      }
    } else {
      distribute(element.parentElement, src)
    }
  }

  function isLongImage(imgSrc) {
    if (
      imgSrc.indexOf('name=4096x4096') > -1 ||
      imgSrc.indexOf('name=large') > -1
    ) {
      return true
    }
    return false
  }

  function addButton(parentElement, imgSrc) {
    if (parentElement.id.indexOf('zx-') > -1) {
      return
    }

    if (parentElement.getAttribute(MarkTag)) {
      log(imgSrc, 'Btn-Added')
      return
    }

    let button = document.createElement('div')
    button.id = genRandomID('btn')
    button.className = ImgBtnClass
    button.style =
      'width:50px;height:22px;line-height:22px;text-align: center;font-size:12px;font-famliy:ui-monospace;cursor: pointer;color: white;'
    button.style.backgroundColor = '#000'
    button.style.opacity = '0.7'
    button.innerText = 'ZOOM'
    button.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      displayFullScreenImg(imgSrc)
    }
    parentElement.setAttribute(MarkTag, 'added')
    parentElement.appendChild(button)
  }

  function isMediaImg(img) {
    return img.indexOf(MatchPic) > -1
  }

  function observeHtml(imgAddedCallback) {
    const targetNode = document.body
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['src'],
    }
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (
          mutation.attributeName == 'src' &&
          isMediaImg(mutation.target.src)
        ) {
          imgAddedCallback(mutation.target)
        }
      }
    }
    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
    // observer.disconnect()
  }

  function imgToLarge(imgSrc) {
    if (!imgSrc) return
    let nameValue = ''
    if (imgSrc.indexOf('name=') > -1) {
      let arr1 = imgSrc.split('?')
      if ((arr1.length = 2)) {
        let str1 = arr1[1]
        let arr2 = str1.split('&')
        if (arr2) {
          arr2.map((i) => {
            let arr3 = i.split('=')
            if (arr3.length == 2 && arr3[0] == 'name' && arr3[1] != 'large') {
              let tempNameValue = arr3[1]
              if (tempNameValue.indexOf('x') > -1) {
                let arr4 = tempNameValue.split('x')
                //大图不替换
                if (Number(arr4[0]) < 1024) {
                  nameValue = arr3[1]
                }
              } else {
                nameValue = arr3[1]
              }
            }
          })
        }
      }
    }
    if (nameValue) {
      imgSrc = imgSrc.replace(`name=${nameValue}`, 'name=large')
    }
    log(imgSrc, 'Large-Imgage-Src')
    return imgSrc
  }

  window.onload = function () {
    main()
  }

  const ImgFullWidthCss = 'width:100%;height:auto;margin:auto;cursor:zoom-in'
  const ImgFullHeightCss = 'width:auto;height:100%;margin:auto;cursor:zoom-in'
  const ImgAutoCss = 'width:auto;height:auto;margin:auto;cursor:zoom-in'
  const FSDivId = 'zx-fullsceen-div-id'
  const FSImgId = 'zx-fullsceen-img-id'
  const ImgDisplayType = 'zx-display-type'
  const NextArrowId = 'zx-next-arrow-id'
  const PreviousArrowId = 'zx-previous-arrow-id'

  function initFullscreenDiv() {
    let fsDiv = document.createElement('div')
    fsDiv.id = FSDivId
    fsDiv.style =
      'text-align: center;width:100%;height:100%; position: fixed;top: 0px;bottom: 0px;overflow-y:auto;display:none'
    fsDiv.style.backgroundColor = 'black'
    fsDiv.onclick = () => {
      dismissImg()
    }
    let imgElmt = document.createElement('img')
    imgElmt.id = FSImgId
    imgElmt.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (imgElmt.getAttribute(ImgDisplayType) == 'image-auto') {
        imgElmt.setAttribute(ImgDisplayType, 'image-fw')
        imgElmt.style = ImgFullWidthCss
      } else if (imgElmt.getAttribute(ImgDisplayType) == 'image-fw') {
        imgElmt.setAttribute(ImgDisplayType, 'image-fh')
        imgElmt.style = ImgFullHeightCss
      } else if (imgElmt.getAttribute(ImgDisplayType) == 'image-fh') {
        imgElmt.setAttribute(ImgDisplayType, 'image-auto')
        imgElmt.style = ImgAutoCss
      }
    }

    fsDiv.appendChild(imgElmt)

    fsDiv.appendChild(genCloseButton())
    fsDiv.appendChild(genArrowButton(true))
    fsDiv.appendChild(genArrowButton(false))
    document.body.appendChild(fsDiv)
  }

  function genCloseButton() {
    let closeImgDiv = document.createElement('div')
    closeImgDiv.style =
      'top: 0;right: 0px;margin-top: 10px;margin-right: 10px;width: 40px;height: 40px;position: fixed;'

    closeImgDiv.style.backgroundColor = '#000'
    closeImgDiv.style.opacity = '0.8'
    closeImgDiv.style.backgroundImage =
      'url(data:image/svg+xml;base64,PHN2ZyB0PSIxNzE5NTU1MTg1MTM4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MDAzIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik01MTAuODA5NiA0MjAuMzAwOGwzMzUuMjk2LTMzNS4yOTYgOTAuNTA4OCA5MC41MDg4LTMzNS4yOTYgMzM1LjI5NiAzMzUuMjk2IDMzNS4yOTYtOTAuNTA4OCA5MC41MDg4LTMzNS4yOTYtMzM1LjI5Ni0zMzUuMjk2IDMzNS4yOTYtOTAuNTA4OC05MC41MDg4IDMzNS4yOTYtMzM1LjI5Ni0zMzUuMjk2LTMzNS4yOTYgOTAuNTA4OC05MC41MDg4eiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iMTQwMDQiPjwvcGF0aD48L3N2Zz4=)'
    closeImgDiv.style.backgroundRepeat = 'no-repeat'
    closeImgDiv.style.backgroundSize = 'cover'
    closeImgDiv.style.cursor = 'pointer'
    closeImgDiv.onclick = () => {
      dismissImg()
    }
    return closeImgDiv
  }

  function genArrowButton(showNext) {
    let arrowDiv = document.createElement('div')
    if (showNext) {
      arrowDiv.id = NextArrowId
    } else {
      arrowDiv.id = PreviousArrowId
    }
    if (showNext) {
      arrowDiv.style = 'right: 0px; margin-right: 10px;'
    } else {
      arrowDiv.style = 'left: 0px; margin-left: 10px;'
    }
    arrowDiv.style.display = 'none'
    arrowDiv.style.top = '50%'
    arrowDiv.style.width = '45px'
    arrowDiv.style.height = '45px'
    arrowDiv.style.position = 'fixed'
    arrowDiv.style.borderRadius = '50%'
    arrowDiv.style.backgroundColor = '#80808091'
    arrowDiv.style.backgroundImage =
      'url(data:image/svg+xml;base64,PHN2ZyB0PSIxNzIwNDMwNjM5Mzg3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgxMzgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTU0NCA2OTAuNzczMzMzbDExNi4wNTMzMzMtMTE2LjA1MzMzM2EzMiAzMiAwIDEgMSA0NS4yMjY2NjcgNDUuMjI2NjY3bC0xNzAuNjY2NjY3IDE3MC42NjY2NjZhMzIgMzIgMCAwIDEtNDUuMjI2NjY2IDBsLTE3MC42NjY2NjctMTcwLjY2NjY2NmEzMiAzMiAwIDEgMSA0NS4yMjY2NjctNDUuMjI2NjY3bDExNi4wNTMzMzMgMTE2LjA1MzMzM1YyNzcuMzMzMzMzYTMyIDMyIDAgMCAxIDY0IDB2NDEzLjQ0eiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iODEzOSI+PC9wYXRoPjwvc3ZnPg==)'
    arrowDiv.style.backgroundRepeat = 'no-repeat'
    arrowDiv.style.backgroundSize = 'cover'
    arrowDiv.style.cursor = 'pointer'
    if (showNext) {
      arrowDiv.style.transform = 'rotate(-90deg)'
    } else {
      arrowDiv.style.transform = 'rotate(90deg)'
    }
    arrowDiv.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (showNext) {
        showNextImg(true)
      } else {
        showNextImg(false)
      }
    }
    return arrowDiv
  }

  function showNextImg(showNext) {
    let imgElmt = document.getElementById(FSImgId)
    const imgSrc = imgElmt.getAttribute('src')
    const keyHref = imgMap.get(imgSrc)
    log(keyHref, imgSrc)
    if (!keyHref) return
    const imgArr = aHrefMap.get(keyHref)
    log(imgArr, keyHref)
    if (!imgArr) return
    const imgIndex = imgArr.indexOf(imgSrc)
    const len = imgArr.length

    let fsDiv = document.getElementById(FSDivId)
    const windowRatio = fsDiv.clientWidth / fsDiv.clientHeight
    let imgUrl
    if (showNext) {
      if (imgIndex + 1 + 1 <= len) {
        imgUrl = imgArr[imgIndex + 1]
      }
    } else {
      if (imgIndex > 0) {
        imgUrl = imgArr[imgIndex - 1]
      }
    }
    if (!imgUrl) return
    checkHasNextAndHasPrevious(imgUrl)
    displayImg(imgUrl, windowRatio)
  }

  function initCss() {
    var css = `
    .${ImgBtnClass}
      {display:none}
    .${ImgClass}:hover + .${ImgBtnClass}, .${ImgBtnClass}:hover
      { display: inline-block }
    `
    var style = document.createElement('style')

    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    document.getElementsByTagName('head')[0].appendChild(style)
  }

  function displayFullScreenImg(imgSrc) {
    let fsDiv = document.getElementById(FSDivId)
    fsDiv.style.overflowY = 'overflow-y:auto'
    fsDiv.style.display = 'flex'
    fsDiv.style.justifyContent = 'center'
    fsDiv.style.alignItems = 'center'
    const windowRatio = fsDiv.clientWidth / fsDiv.clientHeight
    displayImg(imgSrc, windowRatio)
    checkHasNextAndHasPrevious(imgSrc)
  }

  function checkHasNextAndHasPrevious(imgSrc) {
    clearEmptyImg(imgSrc)
    const nextBtn = document.getElementById(NextArrowId)
    const previousBtn = document.getElementById(PreviousArrowId)
    nextBtn.style.display = 'none'
    previousBtn.style.display = 'none'
    if (hasNext(imgSrc)) {
      nextBtn.style.display = 'block'
    }
    if (hasPrevious(imgSrc)) {
      if (previousBtn) {
        previousBtn.style.display = 'block'
      }
    }
  }

  function clearEmptyImg(imgSrc) {
    const keyHref = imgMap.get(imgSrc)
    if (!keyHref) return
    const imgArr = aHrefMap.get(keyHref)
    if (imgArr) {
      const newImgArr = imgArr.filter((i) => {
        return !!i
      })
      aHrefMap.set(keyHref, newImgArr)
    }
  }

  function hasNext(imgSrc) {
    const keyHref = imgMap.get(imgSrc)
    if (!keyHref) return false
    const imgArr = aHrefMap.get(keyHref)
    if (!imgArr) return false
    const imgIndex = imgArr.indexOf(imgSrc)
    const len = imgArr.length
    if (len == 1) {
      return false
    }
    return imgIndex + 1 < len
  }

  function hasPrevious(imgSrc) {
    const keyHref = imgMap.get(imgSrc)
    if (!keyHref) return false
    const imgArr = aHrefMap.get(keyHref)
    if (!imgArr) return false
    const imgIndex = imgArr.indexOf(imgSrc)
    const len = imgArr.length
    if (len == 1) {
      return false
    }

    return imgIndex + 1 > 1 && imgIndex + 1 <= len
  }

  function displayImg(imgSrc, windowRatio) {
    let imgElmt = document.getElementById(FSImgId)
    if (!imgElmt) return
    imgElmt.setAttribute('src', '')
    const img = new Image()
    img.onload = function () {
      const imgRatio = this.width / this.height
      if (imgRatio > windowRatio) {
        imgElmt.style = ImgFullWidthCss
        imgElmt.setAttribute(ImgDisplayType, 'image-fw')
      } else {
        imgElmt.style = ImgFullHeightCss
        imgElmt.setAttribute(ImgDisplayType, 'image-fh')
      }
      imgElmt.setAttribute('src', imgSrc)
    }
    img.src = imgSrc
  }

  function dismissImg() {
    let fsDiv = document.getElementById(FSDivId)
    fsDiv.style.display = 'none'
    let imgElmt = document.getElementById(FSImgId)
    if (!imgElmt) return
    imgElmt.removeAttribute('src')
  }

  function genRandomID(tag) {
    return `zx-${tag}-${Math.random().toString(36).slice(-8)}`
  }

  /**
   * 将标准时间格式化
   * @param {Date} time 标准时间
   * @param {String} format 格式
   * @return {String}
   */
  function moment(time) {
    // 获取年⽉⽇时分秒
    let y = time.getFullYear()
    let m = (time.getMonth() + 1).toString().padStart(2, `0`)
    let d = time.getDate().toString().padStart(2, `0`)
    let h = time.getHours().toString().padStart(2, `0`)
    let min = time.getMinutes().toString().padStart(2, `0`)
    let s = time.getSeconds().toString().padStart(2, `0`)
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }

  function log(msg, tag) {
    if (!window.dev) {
      return false
    }
    if (tag) {
      console.log(`${moment(new Date())}  ${tag}`, msg)
    } else {
      console.log(`${moment(new Date())}`, msg)
    }
  }
})()
