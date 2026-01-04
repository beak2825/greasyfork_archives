// ==UserScript==
// @name         DIY论坛屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.beareyes.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411958/DIY%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/411958/DIY%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var blackUsers = ['MemphisBelle','交通厅副厅长']
    var wrapper = document.querySelector('body')

    var attrBlocked = 'blocked'


    function queryUserLinks() {
        return document.querySelectorAll('a.UserLink-link')
    }

    function queryListItem() {
        return wrapper.querySelectorAll('ul')
    }
    function queryItemInnerUserLink(item) {
        return item.querySelector('b')
    }
    function collapsedItem(item, userName) {
        item.setAttribute(attrBlocked, attrBlocked)
        item.innerHTML = `<span>屏蔽一条内容：发布者（${userName}）</span>`
    }

    function maskUserLinks() {
        var listItem = queryListItem()
        listItem.forEach((item, index) => {
            var userLink = queryItemInnerUserLink(item)
            if (!userLink || item.getAttribute(attrBlocked)) {
                return
            }
            var userName = userLink.innerHTML.trim()
            if (blackUsers.includes(userName)) {
                collapsedItem(item, userName)
            }
        })

    }

    window.onload=function(){
        maskUserLinks()
    }

    // Your code here...
})();