// ==UserScript==
// @name         Alo7 AOT 开发工具包
// @namespace    https://gist.github.com/liubiantao/49c99f34e51d133019a3cad4619062a1
// @version      0.3
// @author       liubiantao
// @match        https://aosp-operation-frontend-internal.beta.saybot.net/*
// @match        https://aosp-operation-frontend-external.beta.saybot.net/*
// @grant        window.open
// @grant        GM_addStyle
// @description 一些帮助开发的工具
// @downloadURL https://update.greasyfork.org/scripts/413185/Alo7%20AOT%20%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/413185/Alo7%20AOT%20%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  GM_addStyle(`
    #gotodev {
        position: fixed;
        bottom: 20%;
        left: 1px;
        border: 1px solid #00b5ff;
        padding: 3px;
        width: 20px;
        font-size: 12px;
        cursor: pointer;
        border-radius: 3px;
        z-index: 111;
        color: #00b5ff;
        background: #00b5ff1f;
    }

    #testIframe {
      position: fixed;
      bottom: 13%;
      left: 1px;
      border: 1px solid #9e9ef3;
      padding: 3px;
      width: 20px;
      font-size: 12px;
      cursor: pointer;
      border-radius: 3px;
      z-index: 111;
      color: #9e9ef3;
      background: #c2c2f542;
    }
  `)

  function openDevSrc() {
    const iframeSrc = document.querySelector('.aosp_iframe').src
    const { pathname, search } = new URL(iframeSrc)
    const devSrc = `http://localhost:3000${pathname}${search}`
    window.open(devSrc)
  }

  function addButton() {
    const btn = document.createElement('div')
    btn.innerText = '本地开发'
    btn.id = 'gotodev'
    document.body.append(btn)
    document.querySelector('#gotodev').addEventListener('click', openDevSrc)
  }

  function openTestIframeSrc() {
    const iframeSrc = document.querySelector('.aosp_iframe').src
    const { pathname, search } = new URL(iframeSrc)

    const src = `http://localhost:3000/testIframe${search}&iframeRoute=${encodeURIComponent(
      pathname
    )}`
    window.open(src)
  }
  function addIframeButton() {
    const btn = document.createElement('div')
    btn.innerText = '彩蛋'
    btn.id = 'testIframe'
    document.body.append(btn)
    document
      .querySelector('#testIframe')
      .addEventListener('click', openTestIframeSrc)
  }

  addButton()
  addIframeButton()
})()
