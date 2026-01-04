// ==UserScript==
// @name         知乎拉黑用户屏蔽回答
// @namespace    zhihublacklist
// @version      0.3
// @description  知乎拉黑用户屏蔽回答（本地）
// @license MIT
// @author       MIO
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462840/%E7%9F%A5%E4%B9%8E%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/462840/%E7%9F%A5%E4%B9%8E%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==
let preblack = ['知乎 官方帐号']
let tbus = localStorage.getItem('blackUsers')
let blackUsers = tbus ? tbus.split(',') : []

if (!blackUsers) {
  blackUsers = []
  localStorage.setItem('blackUsers', blackUsers)
}
let run = () => {
  // document.querySelector('.AdblockBanner').hidden = true
  let handleOne = (item) => {
    var userLink = queryItemInnerUserLink(item)
    if (!userLink || item.getAttribute(attrBlocked)) {
      return
    }

    var href = userLink.href
    var userId = getUserNameFromLink(href)
    var userName = userLink.innerHTML

    if (blackUsers.includes(userId)) {
      collapsedItem(item, userName, userId)
    } else {
      let div = document.createElement('div')
      div.className = 'mdiv'
      let blackfy = () => {
        collapsedItem(item, userName, userId)
        blackUsers.push(userId)
        localStorage.setItem('blackUsers', blackUsers)
        div.parentNode.removeChild(div)
      }

      div.innerHTML = '拉黑'
      div.style = 'float:right;cursor:pointer'
      div.onclick = blackfy
      let tdesc = item.querySelector('.AuthorInfo-badgeText')
      if (tdesc) {
      } else {
        return
      }
      let desc = tdesc.innerHTML

      if (preblack.includes(desc)) {
        blackfy()
        return
      }
      let first = item.children[0]
      if (first.className == 'mdiv') {
        return
      }
      item.insertBefore(div, first)
    }
  }
  let listItem = queryListItem()
  listItem.forEach(handleOne)
  var attrBlocked = 'blocked'
  function getUserNameFromLink(link) {
    var exec = /[^\/]+$/.exec(link)
    return exec ? exec[0] : null
  }
  function queryListItem() {
    return document.querySelectorAll('.List-item')
  }
  function queryItemInnerUserLink(item) {
    return item.querySelector('.AuthorInfo-content a.UserLink-link')
  }
  function collapsedItem(item, userName, userId) {
    item.setAttribute(attrBlocked, attrBlocked)
    var content = item.querySelector('.ContentItem')
    content.style.height = '0'
    content.style.overflow = 'hidden'
    var holder = document.createElement('div')
    holder.className = 'mdiv'
    holder.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;padding:16px;background:#fafafa;cursor:pointer;'
    holder.innerHTML = `<span>折叠一条内容：发布者（${userName}）</span><i style="text-decoration: underline;">取消拉黑</i>`
    holder.onclick = function () {
      content.style.height = 'auto'
      holder.parentNode.removeChild(holder)
      holder = null
      content = null
      let div = document.createElement('div')
      div.className = 'mdiv'
      let blackfy = () => {
        collapsedItem(item, userName, userId)
        blackUsers.push(userId)
        localStorage.setItem('blackUsers', blackUsers)
        div.parentNode.removeChild(div)
      }

      div.innerHTML = '拉黑'
      div.style = 'float:right;cursor:pointer'
      div.onclick = blackfy
      blackUsers = blackUsers.filter((one) => one != userId)
      localStorage.setItem('blackUsers', blackUsers)
      let first = item.children[0]
      let second = item.children[1]
      if (first.className == 'mdiv' || (second && second.className == 'mdiv')) {
        return
      } else {
        console.log(second, 'second')
        item.insertBefore(div, first)
      }
    }
    item.appendChild(holder)
  }

  let dynamicChange = (el = '.List-item') => {
    const parent = document.querySelector(el).parentElement
    // 创建 MutationObserver 对象
    const observer = new MutationObserver(function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 遍历新增的节点
          for (let node of mutation.addedNodes) {
            handleOne(node)
          }
        }
      }
    })
    // 监听父元素
    observer.observe(parent, {
      childList: true,
    })
  }
  dynamicChange('.List-item')
  // maskUserLinks()
}

run()
