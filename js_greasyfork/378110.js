// ==UserScript==
// @name         知乎上的回答/专栏的编辑时间放在第一行
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  有些问题的回答会具有时效性.如果答案很长,还要翻很长的页面去看编辑时间,用户体验极差.所以我写了这个脚本
// @author       floatsyi
// @license      MIT
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378110/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%9A%84%E5%9B%9E%E7%AD%94%E4%B8%93%E6%A0%8F%E7%9A%84%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%94%BE%E5%9C%A8%E7%AC%AC%E4%B8%80%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/378110/%E7%9F%A5%E4%B9%8E%E4%B8%8A%E7%9A%84%E5%9B%9E%E7%AD%94%E4%B8%93%E6%A0%8F%E7%9A%84%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%94%BE%E5%9C%A8%E7%AC%AC%E4%B8%80%E8%A1%8C.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function() {
    'use strict'
     if (window.location.href.search(/follow/i) !== -1) return false
     if (window.location.href.search(/zhuanlan/i) !== -1) {
          document.querySelector('header.Post-Header').appendChild(document.querySelector('.ContentItem-time').cloneNode(true))
          return false
     }

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

         const hasEle = function (el) {
             if (!el) return false
             let RichContent = el.querySelector('.RichContent')
             if (!RichContent) return false
             let RichContent_inner = RichContent.querySelector('.RichContent-inner')
             let editTime = RichContent_inner.nextSibling
             if (RichContent.querySelectorAll('.ContentItem-time').length >= 2) return false
             if (window.location.href.search(/question/) !== -1) {
                if (editTime.firstChild.className !== 'ContentItem-time') return false
             }
             // 如果答案不够长
             if ((parseInt(RichContent_inner.offsetHeight) / window.innerHeight) < (66/100)) return false

             if (editTime.nodeName === 'BUTTON') return false

             if (!!RichContent && !!RichContent_inner && !!editTime) {
                 return{
                     RichContent,
                     RichContent_inner,
                     editTime
                 }
             }

             return false
         }

         const doing = function (eles) {
             if (!eles) return false
             eles.RichContent.insertBefore(eles.editTime.cloneNode(true), eles.RichContent_inner)
             return true
         }

         let time = 0
         const zhihuTV = document.querySelector('body')
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
                     !!zhihuTV && observer.observe(zhihuTV, option)
                 }, 50)
             }
                 doing(hasEle(document.querySelector('.Card.TopstoryItem')))

                 doing(hasEle(document.querySelector('.Card.AnswerCard')))

             let list = document.querySelectorAll('.List .List-item')
             if (list.length <= 0) {
               list = document.querySelectorAll('.Card.TopstoryItem')
             }
             list.forEach(function(item){
                 doing(hasEle(item))
             })
             time++
         }
         const mo = new MutationObserver(_.debounce(doNotTranslateCode, 50))
         !!zhihuTV && mo.observe(zhihuTV, option)
})()