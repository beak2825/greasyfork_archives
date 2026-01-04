// ==UserScript==
// @name         github禁止翻译代码和文件名
// @namespace    http://5jianzhan.com
// @author       itldg
// @version      1.0.0
// @description  禁止谷歌翻译页面上的文件名和代码，在F辣条要甜点的基础上修改
// @author       F辣条要甜点
// @include      *://github.com*
// @include      *://flutter.dev*
// @match        *://github.com*
// @match        *://www.npmjs.com*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/430022/github%E7%A6%81%E6%AD%A2%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/430022/github%E7%A6%81%E6%AD%A2%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81%E5%92%8C%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function() {
    'use strict';
     const addCodeEle = function (ele) {ele.innerHTML = '<code>' + ele.innerHTML + '</code>'}
     const hasCodeEleChild = function (ele) {return !!ele.querySelector('code')}
     const _ = {}
     _.debounce = function (func, wait) {
         var lastCallTime
         var lastThis
         var lastArgs
         var timerId

         function startTimer (timerExpired, wait) {
             return setTimeout(timerExpired, wait)
         }

         function remainingWait(time) {
             const timeSinceLastCall = time - lastCallTime
             const timeWaiting = wait - timeSinceLastCall
             return timeWaiting
         }

         function shoudInvoking (time) {
             return lastCallTime !== undefined && (time - lastCallTime >= wait)
         }

         function timerExpired () {
             const time = Date.now()
             if (shoudInvoking(time)) {
                 return invokeFunc()
             }
             timerId = startTimer(timerExpired, remainingWait(time))
         }

         function invokeFunc () {
             timerId = undefined
             const args = lastArgs
             const thisArg = lastThis
             let result = func.apply(thisArg, args)
             lastArgs = lastThis = undefined
             return result
         }

         function debounced (...args) {
             let time = Date.now()
             lastThis = this
             lastArgs = args
             lastCallTime = time
             if (timerId === undefined) {
                 timerId = startTimer(timerExpired, wait)
             }
         }

         return debounced
     }
     let time = 0
     const TV = document.querySelector('body')

    // 监听DOM变更
     const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
     const option = {
         'childList': true,
         'subtree': true
     }
     const doNotTranslateCode = function (mutations, observer) {
         if (time >= 20) {
           observer.disconnect()
           observer.takeRecords()
           time = 0
           setTimeout(function() {
             mo.observe(TV, option)
           }, 50)
         }
         const files = document.querySelectorAll('.file,div[role=rowheader]')
         let pres = document.querySelectorAll('pre,div[itemprop=text]')
         let h = []
         ;['1','2','3','4','5','6'].forEach((item)=>{
           if (!document.querySelectorAll(`h${item}`)) return false
           h = [...h,...document.querySelectorAll(`h${item}`)]
         })
         pres = [...pres,...h]
         if (files.length > 0) {
             if (window.location.href.search(/.md/i) !== -1) {
               if (pres.length > 0) {
                  pres.forEach(function(pre){if (!hasCodeEleChild(pre)) addCodeEle(pre)})
               }
             } else {
               files.forEach(function(file){if (!hasCodeEleChild(file)) addCodeEle(file)})
             }
         }
         if (pres.length > 0) {
             pres.forEach(function(pre){if (!hasCodeEleChild(pre)) addCodeEle(pre)})
         }
         time++
     }
     const mo = new MutationObserver(_.debounce(doNotTranslateCode, 50))
     mo.observe(TV, option)
})()