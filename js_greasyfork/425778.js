// ==UserScript==
// @name         神鸡 KinhDown 跳转
// @namespace    Lingyan000.sjkd
// @version      0.1
// @description  用于给神鸡影视添加跳转到 KinhDown 下载的按钮
// @author       Lingyan000
// @icon         https://api.kinh.cc/HtmlStatic/Kinh-Logo.ico
// @match        http://n7f6.cn/?p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425778/%E7%A5%9E%E9%B8%A1%20KinhDown%20%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425778/%E7%A5%9E%E9%B8%A1%20KinhDown%20%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  function findLinkAndExecute(shareReg, shareLink, executeFun) {
    let shareArray
    while ((shareArray = shareReg.exec(shareLink)) !== null) {
      executeFun(shareArray.input)
    }
  }

  function getKdBaiduBtn(url, pwd) {
    return `<a href="https://baidu.kinh.cc/?Header_Share_Url=${url}&Header_Share_Pwd=${pwd}" class="btn btn-primary ml-1 mr-1" target="_blank">KD百毒盘</a>`
  }

  function getXunleiBtn(url, pwd) {
    return `<a href="https://xunlei.kinh.cc/?Header_Share_Url=${url}&Header_Share_Pwd=${pwd}" class="btn btn-primary ml-1 mr-1" target="_blank">KD迅雷盘</a>`
  }

  function run() {
    const postHeader = document.querySelector('div.post-header.mb-3')
    let headerHtml = postHeader.innerHTML
    headerHtml += '<div id="kdBtnGroup" class="mt-2">'
    const postContentPtagNodeList = document.querySelectorAll('.post-content p')
    for (let i = 0, aList; i < postContentPtagNodeList.length; i++) {
      if (
        (aList = postContentPtagNodeList[i].getElementsByTagName('a')).length >
        0
      ) {
        const pwd = postContentPtagNodeList[i].textContent.replace(
          /(.|\n)*(提取码：|访问码：)/g,
          ''
        )
        findLinkAndExecute(
          /(?:https?:\/\/)?(yun|pan)\.baidu\.com\/s\/([\w\-]{4,25})\b/gi,
          aList[0].getAttribute('href'),
          (input) => {
            headerHtml += getKdBaiduBtn(input, pwd)
          }
        )
        findLinkAndExecute(
          /(?:https?:\/\/)?pan\.xunlei\.com\/s\/([\w\-]{4,35})\b/gi,
          aList[0].getAttribute('href'),
          (input) => {
            headerHtml += getXunleiBtn(input, pwd)
          }
        )
      }
    }
    headerHtml += '</div>'
    postHeader.innerHTML = headerHtml
  }

  try {
    if (document.getElementById('kdBtnGroup') === null) run()
    return
  } catch (e) {}
})()
