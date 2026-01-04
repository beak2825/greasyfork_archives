// ==UserScript==
// @name         osu!web highlight for modding queues
// @name:zh-CN   osu!web modding queues 高亮
// @namespace    https://github.com/Teages/tampermonkey-things/tree/main/osu-web/osu-web-modding-queues-highlight
// @version      0.1
// @description  highlight post in Modding Queues of osu! forum.
// @description:zh-cn 高亮 osu 的 modding queues 论坛帖子状态.
// @author       Teages
// @match        https://osu.ppy.sh/community/forums/*
// @icon         https://osu.ppy.sh/favicon.ico
// @license      MIT License
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/445432/osu%21web%20highlight%20for%20modding%20queues.user.js
// @updateURL https://update.greasyfork.org/scripts/445432/osu%21web%20highlight%20for%20modding%20queues.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let lastUrl = location.href
  let acceptUrls = [
    '/community/forums/60',
    '/community/forums/121',
    '/community/forums/122',
    '/community/forums/123'
  ]
  loopCheck()
  function loopCheck() {
    // console.log('checking')
    if (acceptUrls.indexOf(location.pathname) >= 0) {
      if (!document.getElementById('topics').classList.contains('modq-highlight-founded')) {
        console.log("Finding Modder....")
        updatePage()
      }
    }
    requestAnimationFrame(loopCheck)
  }
  // updatePage()
  function updatePage() {
    document.getElementById('topics').classList.add('modq-highlight-founded')
    GM_addStyle(`
    .open-queues > .forum-item-stripe:before {
      background-color: green!important;
    }
    .close-queues > .forum-item-stripe:before {
      background-color: red!important;
    }
    .new-mapper-queues > .forum-item-stripe:before {
      background-color: #6cf!important;
    }
    .close-queues {
      opacity: 0.3;
    }
    .self-bumped-queues.open-queues {
      background-color: green!important;
    }
    `);
    let openRules = [
      /\(open\)/,
      /\[open\]/,
      /\(not close\)/,
      /\[not close\]/,
      /\(not closed\)/,
      /\[not closed\]/,
    ]
    let closeRules = [
      /\(close\)/,
      /\[close\]/,
      /\(closed\)/,
      /\[closed\]/,
      /\(not open\)/,
      /\[not open\]/,
    ]
    let newMapperRules = [
      /newmapper/,
      /new mapper/,
    ]


    let items = document.getElementsByClassName("forum-topic-entry")
    for (let item of items) {
      if (match(item.innerText, closeRules)) {
        item.classList.add('close-queues')
      }
      if (match(item.innerText, openRules)) {
        item.classList.add('open-queues')
      }
      if (match(item.innerText, newMapperRules)) {
        item.classList.add('new-mapper-queues')
      }
      if (isBumpedByHost(item)) {
        item.classList.add('self-bumped-queues')
      }
      // console.log(item)
    }
    function isBumpedByHost(item) {
      let mainBox = findElementByClass(item.children, 'forum-topic-entry__col--main')[0]
      let hostMan = findElementByClass(mainBox.children, 'forum-topic-entry__content--left')[0].children[1].children[0].children[1].innerText
      let bumpMan = findElementByClass(mainBox.children, 'forum-topic-entry__content--right')[0].children[0].children[0].innerText
      // console.log("hostMan", hostMan)
      // console.log("bumpMan", bumpMan)
      if (hostMan == bumpMan) {
        return true
      }
      return false
    }
    function findElementByClass(items, className) {
      let ans = []
      for (let item of items) {
        if (item.classList.contains(className)) {
          ans.push(item)
        }
      }
      return ans;
    }
    function match(item, rules) {
      item = item.toLowerCase()
      for (let rule of rules) {
        if (rule.test(item)) {
          return true
        }
      }
      return false
    }
  }
})();