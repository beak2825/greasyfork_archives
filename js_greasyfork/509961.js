// ==UserScript==
// @name         Github记录标星时间
// @version      1.0.0
// @author       windwhim
// @description  Github记录star时间
// @namespace    githubstartime
// @match        *github.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509961/Github%E8%AE%B0%E5%BD%95%E6%A0%87%E6%98%9F%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/509961/Github%E8%AE%B0%E5%BD%95%E6%A0%87%E6%98%9F%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==
/* TODO:
  在页面切换和数据变化时自动加载
*/

;(function () {
  "use strict"
  setTimeout(() => {
    main()
  }, 100)
  //url变化时重新加载

  //页面变化时重新显示

  let buttonGroup = document.querySelector(
    "#user-starred-repos > div > div.col-lg-9 > div.paginate-container > div"
  )
  if (buttonGroup) {
    buttonGroup.addEventListener("click", () => {
      setTimeout(() => {
        main
      }, 100)
    })
  }

  function main() {
    console.log("start")

    let starList = document.querySelector(
      "#user-starred-repos > div > div.col-lg-9, #user-list-repositories"
    )
    if (starList) {
      let num_buttons = starList.children.length
      let buttons = getStarButtons(starList, createRange(1, num_buttons))
      buttons.forEach((button) => {
        try {
          addListener(button)
          addTime(button)
        } catch (e) {
          if (!(e instanceof TypeError)) throw e
        }
      })
    }
    let singleButton = document.querySelector(
      ".js-toggler-container.js-social-container.starring-container.on.d-flex, .js-toggler-container.js-social-container.starring-container.d-flex"
    )
    console.log(singleButton)
    if (singleButton) {
      try {
        addListener2(singleButton)
        addTime2(singleButton)
      } catch (e) {
        if (!(e instanceof TypeError)) throw e
      }
    }
  }

  function addTime(element) {
    let repoName = getRepoName(element)
    let time = GM_getValue(repoName)
    if (!time) return
    let parent = element.parentNode
    let pparent = parent.parentNode
    let node = pparent.querySelector(".define-time")
    if (node) return
    let children = pparent.children
    let tgtEle = children[children.length - 1]
    let date = time.split(", ")[0]
    tgtEle.insertAdjacentHTML(
      "beforeend",
      `<span class='define-time' title='${time}'>&nbsp&nbsp&nbspSatrred at ${date}<span>`
    )
  }
  //单个按钮时间
  function addTime2(element) {
    let repoName_all = document.querySelector(
      "#repo-title-component > strong > a"
    ).href
    let repoName = repoName_all.slice(18)
    let time = GM_getValue(repoName)
    if (!time) return

    let parent = element.parentNode
    let pparent = parent.parentNode
    let ppparent = pparent.parentNode
    let pppparent = ppparent.parentNode
    let node = pppparent.querySelector(".define-time")
    if (node) return
    let date = time.split(", ")[0]
    ppparent.insertAdjacentHTML(
      "beforebegin",
      `<span class='define-time' title='${time}' style='margin-top:3px'>&nbsp&nbsp&nbspSatrred at ${date}<span>`
    )
  }

  function removeTime(element) {
    let parent = element.parentNode
    let pparent = parent.parentNode
    let node = pparent.querySelector(".define-time")
    if (!node) return
    node.remove()
  }

  function removeTime2(element) {
    let parent = element.parentNode
    let pparent = parent.parentNode
    let ppparent = pparent.parentNode
    let pppparent = ppparent.parentNode
    let node = pppparent.querySelector(".define-time")
    if (!node) return
    node.remove()
  }

  function addListener(element) {
    let buttons = element.querySelectorAll("form > button")
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        let isStar = getStarStatus(element)
        let repoName = getRepoName(element)
        if (isStar) {
          unStar(repoName)
          removeTime(element)
        } else {
          doStar(repoName)
          addTime(element)
        }
      })
    })
  }
  //单个按钮监听
  function addListener2(element) {
    let buttons = element.querySelectorAll("form > button")
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        let isStar = getStarStatus(element)
        let repoName_all = document.querySelector(
          "#repo-title-component > strong > a"
        ).href

        let repoName = repoName_all.slice(18)
        if (isStar) {
          unStar(repoName)
          removeTime2(element)
        } else {
          doStar(repoName)
          addTime2(element)
        }
      })
    })
  }
  function getStarButtons(element, indices) {
    const baseSelector = "div:nth-child(index) > div.float-right.d-flex > div"
    // const indices = [3, 4]; // 需要获取的索引列表
    return indices.map((index) => {
      const selector = baseSelector.replace("index", index)
      return element.querySelector(selector)
    })
  }
  function createRange(n, m) {
    return Array.from({ length: m - n + 1 }, (_, index) => n + index)
  }

  function getStarStatus(element) {
    let classes = element.classList
    return classes.contains("on") ? true : false
  }

  function getRepoName(element) {
    let parent = element.parentNode
    //parent前一个节点
    let repo = parent.previousElementSibling
    let a = repo.querySelector("a")
    let repoName = a.getAttribute("href")
    return repoName
  }

  function doStar(key) {
    //获取当前时间
    let date = new Date().toLocaleDateString()
    let now = new Date().toLocaleTimeString()
    GM_setValue(key, date + ", " + now)
  }

  function unStar(key) {
    if (!GM_getValue(key)) return
    GM_deleteValue(key)
  }
})()