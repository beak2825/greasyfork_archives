// ==UserScript==
// @name         百度翻译导出语音
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  导出百度翻译的语音，可导出原语言以及目标语言，目前仅支持中文，英语，韩语
// @author       chen
// @match        https://fanyi.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477739/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%AF%BC%E5%87%BA%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/477739/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%AF%BC%E5%87%BA%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const document = window.document
    const body = document.getElementsByTagName('body')[0]
    const exportBaseBtn = document.createElement('div')
    const languageList = ['zh', 'en', 'kor']
    exportBaseBtn.style = `width: 110px;
      height: 30px;
      line-height: 30px;
      position: fixed;
      left: 0px;
      top: 190px;
      font-size: 12px;
      border: 1px solid #b3d8ff;
      text-align: center;
      border-radius: 4px;
      background: #ecf5ff;
      color: #409eff;
      cursor: pointer;`
    exportBaseBtn.innerText = '导出原语言语音'
    exportBaseBtn.onclick = function () {
        const arr = location.hash.replace('#', '').split('/')
        if (!languageList.includes(arr[0])) {
            return alert('仅支持导出中文、英语、韩语语音')
        }
        if (!arr[2]) {
            return alert('原语言暂无内容')
        }
        const url = `https://fanyi.baidu.com/gettts?lan=${arr[0]}&text=${arr[2]}&spd=5&source=web`
        window.open(url)
    }
    const exportTargetBtn = document.createElement('div')
    exportTargetBtn.style = `width: 110px;
      height: 30px;
      line-height: 30px;
      position: fixed;
      left: 0px;
      top: 230px;
      font-size: 12px;
      border: 1px solid #b3d8ff;
      text-align: center;
      border-radius: 4px;
      background: #ecf5ff;
      color: #409eff;
      cursor: pointer;`
    exportTargetBtn.innerText = '导出目标语言语音'
    exportTargetBtn.onclick = function () {
        const arr = location.hash.replace('#', '').split('/')
        if (!languageList.includes(arr[1])) {
            return alert('仅支持导出中文、英语、韩语语音')
        }
        if (!document.getElementsByClassName('target-output')[0]) {
            return alert('目标语言暂无内容')
        }
        const content = document.getElementsByClassName('target-output')[0].children[0].innerHTML
        if (!content) {
            return alert('目标语言暂无内容')
        }
        const url = `https://fanyi.baidu.com/gettts?lan=${arr[1]}&text=${content}&spd=5&source=web`
        window.open(url)
    }
    body.appendChild(exportBaseBtn)
    body.appendChild(exportTargetBtn)
})();