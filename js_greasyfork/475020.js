// ==UserScript==
// @name         Refined Github Commit Rewind
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make World Better！
// @author       Konv Suu
// @license      MIT
// @match        https://github.com/**
// @icon         https://cdn0.iconfinder.com/data/icons/data-analytics-orchid-vol-2/256/Reverse_Engineering-128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475020/Refined%20Github%20Commit%20Rewind.user.js
// @updateURL https://update.greasyfork.org/scripts/475020/Refined%20Github%20Commit%20Rewind.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function blankLinks() {
    const links = Array.from(document.querySelectorAll('.TimelineItem-body a'))
    links.forEach((link) => {
      link.setAttribute('target', '_blank')
    })
  }

  function reverseTimelineItems() {
    const timeline = document.querySelector('.js-navigation-container.js-active-navigation-container.mt-3')
    const timelineItems = timeline.querySelectorAll('.TimelineItem.TimelineItem--condensed')
    timeline.innerHTML = ''
    const timelineItemsArr = Array.from(timelineItems).reverse()

    timelineItemsArr[0].classList.remove('pt-2')
    timelineItemsArr[0].classList.add('pt-0')
    timelineItemsArr[timelineItemsArr.length - 1].classList.add('pt-2')

    timelineItemsArr.forEach((item) => {
      reverseCommits(item.querySelector('.Box.Box--condensed'))
      timeline.appendChild(item)
    })
  }

  function reverseCommits(timeline) {
    const commitItems = timeline.querySelectorAll('.Box-row.Box-row--focus-gray.js-commits-list-item.js-navigation-item')
    timeline.innerHTML = ''
    const commitItemsArr = Array.from(commitItems).reverse()
    commitItemsArr.forEach((item) => {
      timeline.appendChild(item)
    })
  }

  let isAutoJump = JSON.parse(localStorage.getItem('is-auto-jump')) ?? false

  function appendDOM() {
    const container = document.querySelector('.file-navigation')

    const reverseBtn = document.createElement('button')
    reverseBtn.classList.add('btn', 'mt-2')
    reverseBtn.innerText = 'Reverse'
    reverseBtn.addEventListener('click', () => {
      reverseTimelineItems()
    })

    const autoJumpBtn = document.createElement('button')
    autoJumpBtn.classList.add('btn', 'mt-2', 'mr-2')
    autoJumpBtn.innerText = isAutoJump ? 'Cancel Auto Jump' : 'Auto Jump'
    autoJumpBtn.addEventListener('click', () => {
      isAutoJump = !isAutoJump
      localStorage.setItem('is-auto-jump', JSON.parse(isAutoJump))
      autoJumpBtn.innerText = isAutoJump ? 'Cancel Auto Jump' : 'Auto Jump'
    })

    container.appendChild(autoJumpBtn)
    container.appendChild(reverseBtn)
  }

  function toLastPage() {
    if (!isAutoJump)
      return

    const olderBtn = Array.from(document.querySelectorAll('.btn.BtnGroup-item'))[1]

    if (olderBtn.getAttribute('disabled') === 'disabled') {
      isAutoJump = true
      localStorage.setItem('is-github-commit-last-page', JSON.parse(true))
    }
    olderBtn.click()
  }

  function run() {
    if (location.href.startsWith('https://github.com/') && location.href.split('/').includes('commits')) {
      blankLinks()
      appendDOM()
      toLastPage()
    }
  }

  run()

  // listen to github page loaded event
  document.addEventListener('pjax:end', () => run())
  document.addEventListener('turbo:render', () => run())
})()
