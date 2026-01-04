// ==UserScript==
// @name         立创商城页面增强
// @version      0.3
// @license      MIT
// @namespace    http://tampermonkey.net/
// @description  立创商城页面增强~~~
// @author       Clistery
// @match        *://www.szlcsc.com/*
// @match        *://activity.szlcsc.com/*
// @match        *://alimg.szlcsc.com/*
// @match        *://cart.szlcsc.com/*
// @match        *://collector.szlcsc.com/*
// @match        *://member.szlcsc.com/*
// @match        *://op.szlcsc.com/*
// @match        *://static.szlcsc.com/*
// @match        *://wsimg.szlcsc.com/*
// @match        *://passport.jlc.com/*
// @match        *://list.szlcsc.com/*
// @match        *://item.szlcsc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szlcsc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507062/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/507062/%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  $(window).on('load', function () {
    updateHtml()
  })

  const style = document.createElement('style')
  style.textContent = `
    .layout-header.ecp .logo-wrap.active {
      position: unset !important;
    }
  `
  document.head.appendChild(style)

  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', (event) => {
  //     updateHtml()
  //   })
  // } else {
  //   updateHtml()
  // }

  function updateHtml() {
    if ('function' !== typeof $) {
      console.error('update html fail!')
      return
    }

    $.fn.slideDown = function () {
      // console.log('slideDown', this)
      this.show(true)
      if (arguments && arguments.length > 0) {
        for (const p in arguments) {
          if (Object.hasOwnProperty.call(arguments, p)) {
            const element = arguments[p]
            if ('function' == typeof element) {
              element()
              break
            }
          }
        }
      }
    }
    $.fn.slideUp = function () {
      // console.log('slideUp', this)
      this.hide(true)
      if (arguments && arguments.length > 0) {
        for (const p in arguments) {
          if (Object.hasOwnProperty.call(arguments, p)) {
            const element = arguments[p]
            if ('function' == typeof element) {
              element()
              break
            }
          }
        }
      }
    }

    const originShowF = $.fn.show
    $.fn.show = function () {
      // console.log('show', this)
      return originShowF.call(this)
    }

    const originHideF = $.fn.hide
    $.fn.hide = function () {
      // console.log('hide', this)
      return originHideF.call(this)
    }

    console.log('update html succ!')
  }
})()
