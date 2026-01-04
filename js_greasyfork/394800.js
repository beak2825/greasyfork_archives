// ==UserScript==
// @name         知乎屏蔽用户回答
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394800/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/394800/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blackUsers = ['zhujiangren']
    var wrapper = document.querySelector('#QuestionAnswers-answers .List')
    var listLength = 0
    var listInsertedDebounceTimer = 300
    var attrBlocked = 'blocked'

    function debounce(fn, wait) {
        var timer = null;
        return function () {
            var context = this
            var args = arguments
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }
    }
    function queryUserLinks() {
        return document.querySelectorAll('a.UserLink-link')
    }
    function getUserNameFromLink(link) {
        var exec = /[^\/]+$/.exec(link)
        return exec ? exec[0] : null
    }
    function queryListItem() {
        return wrapper.querySelectorAll('.List-item')
    }
    function queryItemInnerUserLink(item) {
        return item.querySelector('.AuthorInfo-content a.UserLink-link')
    }
    function collapsedItem(item, userName) {
        item.setAttribute(attrBlocked, attrBlocked)
        var content = item.querySelector('.ContentItem')
        content.style.height = '0'
        content.style.overflow = 'hidden'
        var holder = document.createElement('div')
        holder.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px;background:#fafafa;cursor:pointer;'
        holder.innerHTML = `<span>折叠一条内容：发布者（${userName}）</span><i style="text-decoration: underline;">点击还原</i>`
        holder.onclick = function() {
            content.style.height='auto'
            holder.parentNode.removeChild(holder)
            holder = null
            content = null
        }
        item.appendChild(holder)
    }


    function maskUserLinks() {
        var listItem = queryListItem()
        listItem.forEach((item, index) => {
            var userLink = queryItemInnerUserLink(item)
            if (!userLink || item.getAttribute(attrBlocked)) {
                return
            }
            var href = userLink.href
            var userId = getUserNameFromLink(href)
            var userName = userLink.innerHTML
            if (blackUsers.includes(userId)) {
                collapsedItem(item, userName)
            }
        })

    }

    function onListInserted(e) {
        maskUserLinks()
    }

    wrapper.addEventListener('DOMNodeInserted', debounce(onListInserted, listInsertedDebounceTimer), false)

    // Your code here...
})();