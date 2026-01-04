// ==UserScript==
// @name         油管开播信息一键复制以及打标辅助
// @namespace    67373tools
// @description  点击日期（视频框左下方那个，不是标题下面的那个）就可以复制油管开播信息，免得每次都要手动编辑。
// @version      0.0.3
// @author       旅行
// @match        *://*.youtube.com/*
// @match        *://*.speechnotes.co/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453321/%E6%B2%B9%E7%AE%A1%E5%BC%80%E6%92%AD%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A5%E5%8F%8A%E6%89%93%E6%A0%87%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/453321/%E6%B2%B9%E7%AE%A1%E5%BC%80%E6%92%AD%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A5%E5%8F%8A%E6%89%93%E6%A0%87%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'
  //✳️✳️✳️✳️✳️ 判断当前的域
  var yu = false
  if (document.querySelector("#text > a").innerText != '陈一发儿') yu = true
  if (location.href.search("speechnotes.co") != -1) {
    yu = 'subtitle'
  } else if (document.querySelectorAll('#watch7-content').length == 1) {
    if (yu) return
    yu = 'video'
  } else if (location.href.search("https://www.youtube.com/live_chat") != -1) {
    if (yu) return
    yu = 'chat'
  }
  console.log('域：', yu)
  //🔼🔼🔼🔼🔼 判断当前的域

  function restart() {
    GM_setValue("subtitleLast", "")
    GM_setValue("subtitleArchive", "")
    GM_setValue("subtitle", "")
    GM_setValue("subtitleAll", "")
    GM_setValue("counter", 1)
    GM_setValue("log", "")
    GM_setValue('currentMark', ['', '', '', '', '', ''])
    // GM_setValue('lastTime', 0)
    GM_setValue('subtitleTime', Number(new Date()))
  }
  // if (!GM_getValue('lastTime')) GM_setValue('lastTime', 0)
  // if ((Number(new Date()) - GM_getValue('lastTime')) > 10 * 60 * 60 * 1000) restart()

  if (yu == 'video') {
    //✳️✳️✳️✳️✳️ 复制开播信息
    const days = {
      "0": "周日", "1": "周一", "2": "周二", "3": "周三", "4": "周四", "5": "周五", "6": "周六"
    }
    var postText
    setTimeout(() => {
      GM_registerMenuCommand("复制开播信息", () => {
        var liveDate = document.querySelector('.style-scope.ytd-video-primary-info-renderer').innerText
        liveDate = liveDate.substring(liveDate.search("发布时间：") + 5, 100).split("\n")[0]
        var liveDay = liveDate.replace("年", "-").replace("月", "-").replace("日", "")
        var liveTime = document.querySelector('.ytp-offline-slate-subtitle-text').innerText
        liveDay = new Date(liveDay)
        // console.log(liveDate, liveDay, liveTime)
        liveDay = days[liveDay.getDay()]
        postText = "🔴【开播通知】\n[" + liveDay + " " + liveDate.substring(0, 5) + liveTime + "]"
        var titleText = document.querySelector('.style-scope.ytd-video-primary-info-renderer').innerText
        titleText = titleText.substring(0, titleText.search("\n"))
        postText += "\n\n" + titleText + "\n"
        let urlTemp = document.URL.replace("https://www.youtube.com", "")
        urlTemp = urlTemp.slice(0, urlTemp.search("&"))
        postText += urlTemp + "\n\n"
        postText += "进去记得先点👍~"
        GM_setClipboard(postText)
        console.log(postText)
      })
    }, 0)
    //🔼🔼🔼🔼🔼 复制开播信息
    //✳️✳️✳️✳️✳️ 播放页面初始化
    setTimeout(() => {
      showTimeStamp()
      hideTitle(1)
    }, 10000)
    var mouseMoveEvent = new Event('mousemove')
    var subtitleBtn = document.createElement("button")
    var timerElement = document.createElement("span")
    //🔼🔼🔼🔼🔼 播放页面初始化
    //✳️✳️✳️✳️✳️ 菜单：显/隐当前画面时间戳
    GM_registerMenuCommand("显/隐当前画面时间戳", () => {
      if (document.querySelector("#masthead-container").style.display == "none") {
        hideTitle(0)
      } else {
        hideTitle(1)
      }
    })
    function hideTitle(i) {
      if (i == 0) {
        document.querySelector("#masthead-container").style.display = "block"
        document.querySelector("#page-manager").style.marginTop = "56px"
        timerElement.style.display = "none"
      } else {
        document.querySelector("#masthead-container").style.display = "none"
        document.querySelector("#page-manager").style.marginTop = 0
        timerElement.style.display = "inline"
      }
    }
    //🔼🔼🔼🔼🔼 菜单：显/隐当前画面时间戳
    //✳️✳️✳️✳️✳️ 时间戳的获取及显示
    function showTimeStamp() {
      timerElement.innerHTML = `<span></span>`
      let insEle = document.querySelector("#content.ytd-app")
      insEle.insertBefore(timerElement, insEle.childNodes[0])
      subtitleBtn.innerText = "字幕"
      subtitleBtn.addEventListener("click", (event) => {
        window.open('https://speechnotes.co/zh/', 'subtitle_page')
      }, true)
      insEle.insertBefore(subtitleBtn, insEle.childNodes[0])
      setInterval(() => {
        if (document.querySelector("#movie_player")) {
          document.querySelector("#movie_player").dispatchEvent(mouseMoveEvent)
        }
        let bar = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar")
        if (bar) {
          GM_setValue('liveTimerNow', hmmss(bar.getAttribute("aria-valuenow")))
          GM_setValue('liveTimerAll', hmmss(bar.getAttribute("aria-valuemax")))
          GM_setValue('timeDiff', Number(bar.getAttribute("aria-valuemax")) - Number(bar.getAttribute("aria-valuenow")))
          // console.log(1111, GM_getValue("subtitleLast"), GM_getValue("subtitle"))
          timerElement.innerText = GM_getValue("subtitleLast") + "\n"
          timerElement.innerText += GM_getValue("subtitle") + "\n"
          timerElement.innerText += GM_getValue('liveTimerNow') + ` / ` + GM_getValue('liveTimerAll') + "；" + GM_getValue('currentMark').join("；")
          if (GM_getValue("log").search(GM_getValue('currentMark')[0]) == -1) {
            GM_setValue("log", GM_getValue("log") + "\n=================================\n" + timerElement.innerText)
          }
        }
      }, 500)
    }
    //🔼🔼🔼🔼🔼 时间戳的获取及显示
    //✳️✳️✳️✳️✳️ 手动标记按钮及功能 2
    setTimeout(() => {
      // showMarkBtn2()
    }, 10000)
    function showMarkBtn2() {
      let markInput = document.createElement("input")
      let markBtn = document.createElement("button")
      markBtn.innerHTML = "提交"
      let insEle = document.querySelector("#chatframe").contentWindow.document.querySelector("[dir='ltr']")
      insEle.insertBefore(markInput, insEle.childNodes[0])
      insEle.insertBefore(markBtn, insEle.childNodes[0])
      let timeMark = ""
      let timeDiff = ""
      markInput.addEventListener('focus', (event) => {
        timeMark = GM_getValue('liveTimerNow')
        timeDiff = GM_getValue('timeDiff')
        markBtn.innerText = timeMark
      })
      markInput.addEventListener("keypress", (event) => {
        if (event.keyCode == 13) {
          markSubmit()
        }
      }, true)
      markBtn.addEventListener("click", markSubmit, true)
      function markSubmit() {
        let markText = markInput.value
        markInput.value = ""
        switch (markText) {
          case "":
          case undefined:
            break
          case "重启 确定":
          case "重启 确认":
          case "-重启":
          case "！重启":
          case "reboot yes":
            restart()
            break
          case "下载":
          case "-下载":
          case "！下载":
          case "download":
            downloadText("markLog", GM_getValue("log"))
            break
          default: {
            if (markText.search('ddd') != -1) {
              markText = markText.replaceAll("ddd ", "").replaceAll("ddd", "")
              let currentMarkArr = GM_getValue('currentMark')
              currentMarkArr.unshift(markText + "丨" + GM_getValue("counter") + "_" + timeMark + "-" + timeDiff)
              currentMarkArr.pop()
              GM_setValue('currentMark', currentMarkArr)
              GM_setValue("counter", GM_getValue("counter") + 1)
              markText = GM_getValue('currentMark')[0]
            }
            let evt = document.createEvent('HTMLEvents')
            evt.initEvent('input', true, true)
            document.querySelector("#chatframe").contentWindow.document.querySelector("#input").querySelector("#input").innerText = markText
            document.querySelector("#chatframe").contentWindow.document.querySelector("#input").querySelector("#input").dispatchEvent(evt)
            document.querySelector("#chatframe").contentWindow.document.querySelector("#send-button > yt-button-renderer > a").click()
            // GM_setValue('lastTime', Number(new Date()))
          }
        }
      }
    }
    //🔼🔼🔼🔼🔼 手动标记按钮及功能 2
  }

  if (yu == 'subtitle') {
    //✳️✳️✳️✳️✳️ 字幕显示及记录
    var subtitleCheckTime = 15
    setInterval(() => {
      // console.log("字幕容器：", document.querySelector("#mirror_container"))
      // console.log(`GM_getValue("subtitle")`, GM_getValue("subtitle"))
      // console.log(`(GM_getValue("subtitleLast")`, GM_getValue("subtitleLast"))
      // console.log(`GM_getValue("subtitle").length`, GM_getValue("subtitle").length)
      // console.log(``, )
      if (document.querySelector("#mirror_container")) {
        GM_setValue("subtitle", document.querySelector("#mirror_container").innerText)
        if (GM_getValue("subtitle").length < GM_getValue("subtitleArchive").length) {
          GM_setValue("subtitleLast", (GM_getValue("subtitleLast") + GM_getValue("subtitleArchive")).replaceAll("\n\n", '\n').slice(-188))
          GM_setValue("subtitleArchive", GM_getValue("subtitle"))
          if (GM_getValue("subtitle").length != 0) {
            GM_setValue('subtitleTime', Number(new Date()))
            subtitleCheckTime = 15
            console.log("字幕条变短且不为0，检查时间改为15")
            // console.log(new Date(GM_getValue('subtitleTime')))
          } else {
            subtitleCheck()
          }
        } else if (GM_getValue("subtitle") == GM_getValue("subtitleArchive")) {
          subtitleCheck()
        } else {
          GM_setValue("subtitleArchive", GM_getValue("subtitle"))
          GM_setValue('subtitleTime', Number(new Date()))
          subtitleCheckTime = 15
          console.log("字幕条变长，检查时间改为15")
          // console.log(new Date(GM_getValue('subtitleTime')))
        }
      } else if (document.querySelector("#start_img").getAttribute("src") == 'https://speechlogger.appspot.com/images/micoff2.png') {
        document.querySelector("#start_img").click()
      }
    }, 500)
    function subtitleCheck() {
      // console.log("检查字幕")
      // console.log(Number(new Date()), Date())
      // console.log(GM_getValue('subtitleTime'), new Date(GM_getValue('subtitleTime')))
      if ((Number(new Date()) - GM_getValue('subtitleTime')) > (subtitleCheckTime * 1000)) {
        if (subtitleCheckTime == 15) {
          subtitleCheckTime = 1
          // console.log("15秒 重启字幕")
          // console.log(Date())
          // console.log(new Date(GM_getValue('subtitleTime')))
          document.querySelector("#start_img").click()
          console.log("15秒无反应，点击了字幕开关，并将检查时间设为1秒", subtitleCheckTime)
        } else if (document.querySelector("#start_img").getAttribute("src") == 'https://speechlogger.appspot.com/images/micoff2.png') {
          // console.log(Date())
          // console.log(new Date(GM_getValue('subtitleTime')))
          document.querySelector("#start_img").click()
          console.log("1秒检查，开启似乎失败，点击了字幕开关，继续1秒检查", subtitleCheckTime)
        } else {
          // console.log("重启成功，恢复15秒")
          // console.log(Date())
          // console.log(new Date(GM_getValue('subtitleTime')))
          subtitleCheckTime = 15
          console.log("1秒检查，开启成功，改为15秒检查", subtitleCheckTime)
        }
        GM_setValue('subtitleTime', Number(new Date()))
      }
    }
    //🔼🔼🔼🔼🔼 字幕显示及记录
  }

  if (yu == 'chat') {
    // 定位到 chat 的 iframe 的方法：document.querySelector("#chatframe").contentWindow.document
    setTimeout(() => {
      document.querySelector("#menu > a:nth-child(2)").click() // 切换到实时聊天
      showMarkBtn()
    }, 10000)
    //✳️✳️✳️✳️✳️ 手动标记按钮及功能
    function showMarkBtn() {
      let markInput = document.createElement("input")
      let markBtn = document.createElement("button")
      markBtn.innerHTML = "提交"
      let insEle = document.querySelector("[dir='ltr']")
      // let insEle = document.querySelector("yt-live-chat-app")
      insEle.insertBefore(markInput, insEle.childNodes[0])
      insEle.insertBefore(markBtn, insEle.childNodes[0])
      let timeMark = ""
      let timeDiff = ""
      markInput.addEventListener('focus', (event) => {
        timeMark = GM_getValue('liveTimerNow')
        timeDiff = GM_getValue('timeDiff')
        markBtn.innerText = timeMark
      })
      markInput.addEventListener("keypress", (event) => {
        if (event.keyCode == 13) {
          markSubmit()
        }
      }, true)
      markBtn.addEventListener("click", markSubmit, true)
      function markSubmit() {
        let markText = markInput.value
        markInput.value = ""
        switch (markText) {
          case "":
          case undefined:
            break
          case "重启 确定":
          case "重启 确认":
          case "-重启":
          case "！重启":
          case "reboot yes":
            restart()
            break
          case "下载":
          case "-下载":
          case "！下载":
          case "download":
            downloadText("markLog", GM_getValue("log"))
            break
          default: {
            if (markText.search('ddd') != -1) {
              markText = markText.replaceAll("ddd ", "").replaceAll("ddd", "")
              let currentMarkArr = GM_getValue('currentMark')
              currentMarkArr.unshift(markText + "丨" + GM_getValue("counter") + "_" + timeMark + "-" + timeDiff)
              currentMarkArr.pop()
              GM_setValue('currentMark', currentMarkArr)
              GM_setValue("counter", GM_getValue("counter") + 1)
              markText = GM_getValue('currentMark')[0]
            }
            let evt = document.createEvent('HTMLEvents')
            evt.initEvent('input', true, true)
            document.querySelector("#input").querySelector("#input").innerText = markText
            document.querySelector("#input").querySelector("#input").dispatchEvent(evt)
            document.querySelector("#send-button > yt-button-renderer > a").click()
            // GM_setValue('lastTime', Number(new Date()))
          }
        }
      }
    }
    //🔼🔼🔼🔼🔼 手动标记按钮及功能
  }
  //✳️✳️✳️✳️✳️
  //🔼🔼🔼🔼🔼

  //✳️✳️✳️✳️✳️ 格式化时间函数
  function hmmss(seconds) {
    seconds = Number(seconds)

    let ss = ("0" + Math.floor(seconds) % 60).slice(-2)
    let mm = ("0" + Math.floor(seconds / 60) % 60).slice(-2)
    let h = ("0" + Math.floor(seconds / 3600)).slice(-1)
    return [h, mm, ss].join(":")
  }
  //🔼🔼🔼🔼🔼 格式化时间函数
  //✳️✳️✳️✳️✳️ 文本下载函数
  function downloadText(fileName, content) {
    if (!fileName) fileName = Date()
    if (fileName.slice(-4) != '.txt') fileName += ".txt"
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', fileName)
    element.click()
  }
  //🔼🔼🔼🔼🔼 文本下载函数
})();

// document.querySelector('.ytp-offline-slate-subtitle-text').onclick = ()=> GM_setClipboard(postText)

// console.log(document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar").getAttribute("aria-valuemax"))
// console.log(document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-bound-time-left").innerText)

// let ss = ("0" + Math.round(seconds) % 60).slice(-2).replaceAll("0","⁰").replaceAll("1","¹").replaceAll("2","²").replaceAll("3","³").replaceAll("4","⁴").replaceAll("5","⁵").replaceAll("6","⁶").replaceAll("7","⁷").replaceAll("8","⁸").replaceAll("9","⁹")
// let mm = ("0" + Math.round(seconds / 60) % 60).slice(-2).replaceAll("0","₀").replaceAll("1","₁").replaceAll("2","₂").replaceAll("3","₃").replaceAll("4","₄").replaceAll("5","₅").replaceAll("6","₆").replaceAll("7","₇").replaceAll("8","₈").replaceAll("9","₉")
// let h = ("0" + Math.round(seconds / 3600)).slice(-1).replaceAll("0","⁰").replaceAll("1","¹").replaceAll("2","²").replaceAll("3","³").replaceAll("4","⁴").replaceAll("5","⁵").replaceAll("6","⁶").replaceAll("7","⁷").replaceAll("8","⁸").replaceAll("9","⁹")
// return h + mm + ss


// 嵌入 https://speechnotes.co/
// var subtitlePage = document.createElement("iframe")
// subtitlePage.setAttribute("src", "https://speechnotes.co/zh/")
// subtitlePage.setAttribute("style", "width: 100px; height: 100px")
// // subtitlePage.style.display = 'none'
// document.body.appendChild(subtitlePage)
// 嵌入 https://speechnotes.co/ 模块结束