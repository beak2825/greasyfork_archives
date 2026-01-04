// ==UserScript==
// @name         fastCfgForTuiA
// @namespace    http://www.zbd.com/
// @version      0.5
// @description  fastCfg
// @author       zbd
// @include        *
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/424326/fastCfgForTuiA.user.js
// @updateURL https://update.greasyfork.org/scripts/424326/fastCfgForTuiA.meta.js
// ==/UserScript==

function getImgWH (params) {
  return new Promise((resolve, reject) => {
    const img_url = params
    const img = new Image()
    img.src = img_url
    const check = function () {
      if (img.width > 0 || img.height > 0) {
        clearInterval(set)
        resolve({
          width: img.width,
          height: img.height
        })
      }
    }
    const set = setInterval(check, 40)
    img.onload = function () {
      resolve({
        width: img.width,
        height: img.height
      })
    }
  })
}

function Toast (msg, duration) {
  duration = isNaN(duration) ? 3000 : duration
  const m = document.createElement('div')
  m.innerHTML = msg
  m.style.cssText =
        'font-size: 18px;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;'
  document.body.appendChild(m)
  setTimeout(function () {
    const d = 0.5
    m.style.opacity = '0'
    setTimeout(function () {
      document.body.removeChild(m)
    }, d * 1000)
  }, duration)
}

(function () {
  'use strict'
  const mainElement = document.getElementsByClassName('tac-main')[0]
  const insertElement = document.createElement('input')
  insertElement.setAttribute(
    'style',
    'width:80px;' +
        'height:40px;' +
        'background-color:#ffffff;' +
        'position:fixed;' +
        'top:20px;' +
        'left:20px;' +
        'opacity:0.9;' +
        'padding:0' +
        'border-radius:8px;' +
        'z-index:500'
  )
  insertElement.setAttribute('id', 'classNameBox')
  mainElement.appendChild(insertElement)

  document.onkeyup = function (e) {
    // 兼容FF和IE和Opera
    const event = e || window.event
    const key = event.which || event.keyCode || event.charCode
    if (key === 13 && document.activeElement.id === 'classNameBox') {
      const elementClassName = insertElement.value
      const elementList = document.getElementsByClassName(elementClassName)
      if (elementList.length > 0) {
        const element = elementList[0]
        const style = element.currentStyle || window.getComputedStyle(element, false)
        const jsonObj = {
          title: '',
          type: '',
          name: '',
          size: {
            width: 0,
            height: 0
          },
          value: ''
        }
        let url = ''
        switch (element.tagName) {
          case 'DIV':
            url = style.backgroundImage.slice(4, -1).replace(/"/g, '')
            break

          case 'IMG':
            url = element.src
            break

          default:
            Toast('解析失败')
            break
        }
        getImgWH(url).then(result => {
          const { width, height } = result
          jsonObj.type = 'image'
          jsonObj.size = {
            width: width,
            height: height
          }
          if (url.match(/.*\?x-oss-process=image\/format,webp.*/)) {
            url = url.match(/(\S*)\?x-oss-process=image\/format,webp/)[0]
          }
          jsonObj.value = url.slice(5, url.length)
          GM.setClipboard(JSON.stringify(jsonObj))
          console.log(url)
          console.log(jsonObj)
          Toast('复制成功')
        })
      }
    }
    if (key === 27) {
      insertElement.value = ''
    }
  }
})()
