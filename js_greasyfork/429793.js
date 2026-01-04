// ==UserScript==
// @name         链家租房列表增加一些信息
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2
// @description  比如加上小区的建筑年代
// @author       windeng
// @match        https://gz.lianjia.com/zufang/*
// @icon         https://www.google.com/s2/favicons?domain=lianjia.com
// @require      https://greasyfork.org/scripts/433586-simpletools/code/SimpleTools.js?version=977251
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429793/%E9%93%BE%E5%AE%B6%E7%A7%9F%E6%88%BF%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%BA%9B%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/429793/%E9%93%BE%E5%AE%B6%E7%A7%9F%E6%88%BF%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E4%B8%80%E4%BA%9B%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

async function GetXiaoquPage(xiaoquId) {
  return Get(`https://gz.lianjia.com/xiaoqu/${xiaoquId}`)
}

async function GetXiaoquInfo(xiaoquId) {
  let resp = await GetXiaoquPage(xiaoquId)
  // console.log(resp)
  let el = document.createElement('html')
  el.innerHTML = resp
  // console.log(el)
  let elemList = el.querySelectorAll('div.xiaoquInfo > div.xiaoquInfoItem')
  let result = {}
  for (let i = 0; i < elemList.length; ++i) {
    let elem = elemList[i]
    let label = elem.querySelector('span.xiaoquInfoLabel').innerText.trim()
    let content = elem.querySelector('span.xiaoquInfoContent').innerText.trim()
    result[label] = content
  }

  return result
}

async function DoLogic() {
  await WaitUntil(() => {
    return !!document.querySelector('div.content__list')
  })

  let divList = document.querySelectorAll('div.content__list--item')
  for (let i = 0; i < divList.length; ++i) {
    let div = divList[i]
    // 获取小区id
    let a = div.querySelector('p.content__list--item--des > a:nth-of-type(3)')
    let matches = a.getAttribute('href').match(/zufang\/c(\d+)/)
    // console.log(a, matches)
    if (!matches) continue
    let xiaoquId = matches[1]

    // 增加跳转到小区的按钮
    let tmpA = document.createElement('a')
    tmpA.setAttribute('href', `/xiaoqu/${xiaoquId}`)
    tmpA.setAttribute('target', '_blank')
    tmpA.innerText = '小区主页'
    a.parentNode.insertBefore(tmpA, a.nextSibling)
    let tmpSpan = document.createElement('span')
    tmpSpan.innerText = '-'
    a.parentNode.insertBefore(tmpSpan, tmpA)

    let xiaoquInfo = await GetXiaoquInfo(xiaoquId)
    console.log(xiaoquInfo)
    let desElem = div.querySelector('p.content__list--item--des')
    let span = document.createElement('span')
    span.innerHTML = `<i>/</i> ${xiaoquInfo["建筑年代"]}`
    desElem.appendChild(span)

    /*
    GetXiaoquInfo(xiaoquId).then(xiaoquInfo => {
        console.log(xiaoquInfo)
        let desElem = div.querySelector('p.content__list--item--des')
        let span = document.createElement('span')
        span.innerHTML = `<i>/</i> ${xiaoquInfo["建筑年代"]}`
        desElem.appendChild(span)
    }).catch(err => {
        console.error(err)
    })
    */
  }
}

(async function () {
  'use strict';

  // Your code here...
  await DoLogic()
})();