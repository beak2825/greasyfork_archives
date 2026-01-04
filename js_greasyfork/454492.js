// ==UserScript==
// @name         手机浏览器增加左滑前进右滑后退功能
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  模拟实现夸克手机浏览器的左滑后退右滑前进功能
// @author       企鹅吧
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/454492/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%B7%A6%E6%BB%91%E5%89%8D%E8%BF%9B%E5%8F%B3%E6%BB%91%E5%90%8E%E9%80%80%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/454492/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%B7%A6%E6%BB%91%E5%89%8D%E8%BF%9B%E5%8F%B3%E6%BB%91%E5%90%8E%E9%80%80%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const distance = 50
  const arrowCss = `
      position: fixed;
      top: 50%;
      width: ${distance}px;
      height: ${distance}px;
      line-height: ${distance}px;
      text-align: center;
      background: rgba(0,0,0,.4);
      color: #fff;
    `
  const leftArrow = document.createElement('div')
  leftArrow.innerHTML = `←`
  leftArrow.style.cssText = arrowCss
  leftArrow.style.left = `0`
  leftArrow.style['border-radius'] = `0 10px 10px 0`
  leftArrow.style.transform = `translate3d(-100%, -50%, 0)`
 
  const rightArrow = document.createElement('div')
  rightArrow.innerHTML = `→`
  rightArrow.style.cssText = arrowCss
  rightArrow.style.right = `0`
  rightArrow.style['border-radius'] = `10px 0 0 10px`
  rightArrow.style.transform = `translate3d(100%, -50%, 0)`
 
  const docBody = document.body
  docBody.appendChild(leftArrow)
  docBody.appendChild(rightArrow)
  
  function canScroll (el) {
      if (el === document.body) return false
      if (el.scrollWidth > el.clientWidth) {
          return true
      } else {
          return canScroll(el.parentNode)
      }
  }
 
 
  let startX,
    startY,
    direction = null
  docBody.addEventListener('touchstart', e => {
    direction = null
    startX = e.changedTouches[0].pageX
    startY = e.changedTouches[0].pageY
  })
 
  docBody.addEventListener('touchmove', e => {
    if (canScroll(e.target)) return
    const moveX = e.changedTouches[0].pageX
    const moveY = e.changedTouches[0].pageY
    const offsetX = moveX - startX
    const offsetY = moveY - startY
    // console.log('offset X Y: ', offsetX, offsetY)
    if (Math.abs(offsetY) > 5) return // 上下滑动不作处理
    const isToLeft = offsetX < 0
    if (isToLeft) { // 右往左滑
      console.log('toleft')
      if (direction === 'toRight') return
      direction = 'toLeft'
      const x = distance + offsetX
      const translateX = x <= 0 ? 0 : x
      rightArrow.style.transform = `translate3d(${translateX}px, -50%, 0)`
    } else { // 左往右滑
      if (direction === 'toLeft') return
      direction = 'toRight'
      const x = -distance + offsetX
      const translateX = x >= 0 ? 0 : x
      leftArrow.style.transform = `translate3d(${translateX}px, -50%, 0)`
    }
  })
 
  docBody.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].pageX
    const offset = endX - startX
 
    leftArrow.style.transform = `translate3d(-100%, -50%, 0)`
    rightArrow.style.transform = `translate3d(100%, -50%, 0)`
    if (direction === 'toLeft' && offset < -distance) {
      console.log("右往左滑,前进")
      window.history.go(1)
    } else if (direction === 'toRight' && offset > distance) {
      console.log("左往左滑,后退")
      window.history.go(-1)
    }
  })
})()