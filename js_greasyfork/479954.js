// ==UserScript==
// @name         chiphell屏蔽功能
// @namespace    http://tampermonkey.net/chiphell-blocker
// @version      0.1
// @description  屏蔽某个用户的发帖和回帖，还您一片清净。
// @author       snddddddd
// @match        https://www.chiphell.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479954/chiphell%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479954/chiphell%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {

  // *******************需要屏蔽的用户列表, 用英文引号和逗号分隔*********************
  var blackList = ['用户名1', '用户名2']

  // 屏蔽发帖
  var threads = document.querySelectorAll('#threadlisttableid tbody')
  threads.forEach(function(thread) {
    var threadChildren = getDeepChildElements(thread)
    var total = threadChildren.length
    for (var i = 0; i < total; i++) {
      var threadChild = threadChildren[i]
      if (blackList.includes(threadChild.innerHTML) && total - i !== 3) {
        thread.style.display = 'none';
        break
      }
    }
  })

  // 屏蔽回帖
  var posts = document.querySelectorAll('#postlist > div')
  posts.forEach(function(post) {
    var postChildren = getDeepChildElements(post)
    var total = postChildren.length
    for (var i = 0; i < total; i++) {
      var postChild = postChildren[i]
      if (blackList.includes(postChild.innerHTML)) {
        post.style.display = 'none';
        break
      }
    }
  })

  function getDeepChildElements(element) {
    var childElements = element.children
    var deepChildElements = []
    for (var i = 0; i < childElements.length; i++) {
      var childElement = childElements[i]
      deepChildElements.push(childElement)
      if (childElement.children.length > 0) {
        var grandChildElements = getDeepChildElements(childElement)
        deepChildElements = deepChildElements.concat(grandChildElements)
      }
    }
    return deepChildElements
  }
})()
