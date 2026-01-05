// ==UserScript==
// @name                Maximize Video
// @name:zh-CN          视频网页全屏
// @namespace           http://www.icycat.com
// @description         Maximize all video players.Support Piture-in-picture.
// @description:zh-CN   让所有视频网页全屏，开启画中画功能
// @author              冻猫
// @include             *
// @exclude             *www.w3school.com.cn*
// @version             12.0
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/4870/Maximize%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/4870/Maximize%20Video.meta.js
// ==/UserScript==

;(() => {
  const gv = {
    isFull: false,
    isIframe: false,
    autoCheckCount: 0,
  }

  //Html5规则[播放器最外层],适用于无法自动识别的自适应大小HTML5播放器
  const html5Rules = {
    "www.acfun.cn": [".player-container .player"],
    "www.bilibili.com": ["#bilibiliPlayer"],
    "www.douyu.com": ["#js-player-video-case"],
    "www.huya.com": ["#videoContainer"],
    "www.twitch.tv": [".player"],
    "www.youtube.com": ["#movie_player"],
    "www.yy.com": ["#player"],
    "*weibo.com": ['[aria-label="Video Player"]', ".html5-video-live .html5-video"],
    "v.huya.com": ["#video_embed_flash>div"],
  }

  //通用html5播放器
  const generalPlayerRules = [".dplayer", ".video-js", ".jwplayer", "[data-player]"]

  if (window.top !== window.self) {
    gv.isIframe = true
  }

  if (navigator.language.toLocaleLowerCase() == "zh-cn") {
    gv.btnText = {
      max: "网页全屏",
      pip: "画中画",
      tip: "Iframe内视频，请用鼠标点击视频后重试",
    }
  } else {
    gv.btnText = {
      max: "Maximize",
      pip: "PicInPic",
      tip: "Iframe video. Please click on the video and try again",
    }
  }

  const tool = {
    print(log) {
      const now = new Date()
      const year = now.getFullYear()
      const month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1)
      const day = (now.getDate() < 10 ? "0" : "") + now.getDate()
      const hour = (now.getHours() < 10 ? "0" : "") + now.getHours()
      const minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
      const second = (now.getSeconds() < 10 ? "0" : "") + now.getSeconds()
      const timenow = "[" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "]"
      console.log(timenow + "[Maximize Video] > " + log)
    },
    getRect(element) {
      const rect = element.getBoundingClientRect()
      const scroll = tool.getScroll()
      return {
        pageX: rect.left + scroll.left,
        pageY: rect.top + scroll.top,
        screenX: rect.left,
        screenY: rect.top,
      }
    },
    isHalfFullClient(element) {
      const client = tool.getClient()
      const rect = tool.getRect(element)
      if (
        (Math.abs(client.width - element.offsetWidth) < 21 && rect.screenX < 20) ||
        (Math.abs(client.height - element.offsetHeight) < 21 && rect.screenY < 10)
      ) {
        if (
          Math.abs(element.offsetWidth / 2 + rect.screenX - client.width / 2) < 21 &&
          Math.abs(element.offsetHeight / 2 + rect.screenY - client.height / 2) < 21
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isAllFullClient(element) {
      const client = tool.getClient()
      const rect = tool.getRect(element)
      if (
        Math.abs(client.width - element.offsetWidth) < 21 &&
        rect.screenX < 20 &&
        Math.abs(client.height - element.offsetHeight) < 21 &&
        rect.screenY < 10
      ) {
        return true
      } else {
        return false
      }
    },
    getScroll() {
      return {
        left: document.documentElement.scrollLeft || document.body.scrollLeft,
        top: document.documentElement.scrollTop || document.body.scrollTop,
      }
    },
    getClient() {
      return {
        width: document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth,
        height: document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight,
      }
    },
    addStyle(css) {
      const style = document.createElement("style")
      style.type = "text/css"
      const node = document.createTextNode(css)
      style.appendChild(node)
      document.head.appendChild(style)
      return style
    },
    matchRule(str, rule) {
      return new RegExp("^" + rule.split("*").join(".*") + "$").test(str)
    },
    createButton(id) {
      const btn = document.createElement("tbdiv")
      btn.id = id
      btn.onclick = () => {
        maximize.playerControl()
      }
      document.body.appendChild(btn)
      return btn
    },
    async addTip(str) {
      if (!document.getElementById("catTip")) {
        const tip = document.createElement("tbdiv")
        tip.id = "catTip"
        tip.innerHTML = str
        ;(tip.style.cssText =
          'transition: all 0.8s ease-out;background: none repeat scroll 0 0 #27a9d8;color: #FFFFFF;font: 1.1em "微软雅黑";margin-left: -250px;overflow: hidden;padding: 10px;position: fixed;text-align: center;bottom: 100px;z-index: 300;'),
          document.body.appendChild(tip)
        tip.style.right = -tip.offsetWidth - 5 + "px"
        await new Promise((resolve) => {
          tip.style.display = "block"
          setTimeout(() => {
            tip.style.right = "25px"
            resolve("OK")
          }, 300)
        })
        await new Promise((resolve) => {
          setTimeout(() => {
            tip.style.right = -tip.offsetWidth - 5 + "px"
            resolve("OK")
          }, 3500)
        })
        await new Promise((resolve) => {
          setTimeout(() => {
            document.body.removeChild(tip)
            resolve("OK")
          }, 1000)
        })
      }
    },
  }

  const setButton = {
    init() {
      if (!document.getElementById("playerControlBtn")) {
        init()
      }
      if (gv.isIframe && tool.isHalfFullClient(gv.player)) {
        window.parent.postMessage("iframeVideo", "*")
        return
      }
      this.show()
    },
    show() {
      gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
      gv.player.addEventListener("mouseleave", handle.leavePlayer, false)

      if (!gv.isFull) {
        document.removeEventListener("scroll", handle.scrollFix, false)
        document.addEventListener("scroll", handle.scrollFix, false)
      }
      gv.controlBtn.style.display = "block"
      gv.controlBtn.style.visibility = "visible"
      if (document.pictureInPictureEnabled && gv.player.nodeName != "OBJECT" && gv.player.nodeName != "EMBED") {
        gv.picinpicBtn.style.display = "block"
        gv.picinpicBtn.style.visibility = "visible"
      }
      this.locate()
    },
    locate() {
      const playerRect = tool.getRect(gv.player)
      gv.controlBtn.style.opacity = "0.5"
      gv.controlBtn.innerHTML = gv.btnText.max
      gv.controlBtn.style.top = playerRect.screenY - 20 + "px"
      // 网页全屏按钮位置，Maximize button
      gv.controlBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth + "px"
      gv.picinpicBtn.style.opacity = "0.5"
      gv.picinpicBtn.innerHTML = gv.btnText.pip
      gv.picinpicBtn.style.top = gv.controlBtn.style.top
      // 画中画按钮位置，PicInPic button
      gv.picinpicBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth - 54 + "px"
    },
  }

  const handle = {
    getPlayer(e) {
      if (gv.isFull) {
        return
      }
      gv.mouseoverEl = e.target
      const hostname = document.location.hostname
      let players = []
      for (let i in html5Rules) {
        if (tool.matchRule(hostname, i)) {
          for (let html5Rule of html5Rules[i]) {
            if (document.querySelectorAll(html5Rule).length > 0) {
              for (let player of document.querySelectorAll(html5Rule)) {
                players.push(player)
              }
            }
          }
          break
        }
      }
      if (players.length == 0) {
        for (let generalPlayerRule of generalPlayerRules) {
          if (document.querySelectorAll(generalPlayerRule).length > 0) {
            for (let player of document.querySelectorAll(generalPlayerRule)) {
              players.push(player)
            }
          }
        }
      }
      if (players.length == 0 && e.target.nodeName != "VIDEO" && document.querySelectorAll("video").length > 0) {
        const videos = document.querySelectorAll("video")
        for (let v of videos) {
          const vRect = v.getBoundingClientRect()
          if (
            e.clientX >= vRect.x - 2 &&
            e.clientX <= vRect.x + vRect.width + 2 &&
            e.clientY >= vRect.y - 2 &&
            e.clientY <= vRect.y + vRect.height + 2 &&
            v.offsetWidth > 399 &&
            v.offsetHeight > 220
          ) {
            players = []
            players[0] = handle.autoCheck(v)
            gv.autoCheckCount = 1
            break
          }
        }
      }
      if (players.length > 0) {
        const path = e.path || e.composedPath()
        for (let v of players) {
          if (path.indexOf(v) > -1) {
            gv.player = v
            setButton.init()
            return
          }
        }
      }
      switch (e.target.nodeName) {
        case "VIDEO":
        case "OBJECT":
        case "EMBED":
          if (e.target.offsetWidth > 399 && e.target.offsetHeight > 220) {
            gv.player = e.target
            setButton.init()
          }
          break
        default:
          handle.leavePlayer()
      }
    },
    autoCheck(v) {
      let tempPlayer,
        el = v
      gv.playerChilds = []
      gv.playerChilds.push(v)
      while ((el = el.parentNode)) {
        if (Math.abs(v.offsetWidth - el.offsetWidth) < 15 && Math.abs(v.offsetHeight - el.offsetHeight) < 15) {
          tempPlayer = el
          gv.playerChilds.push(el)
        } else {
          break
        }
      }
      return tempPlayer
    },
    leavePlayer() {
      if (gv.controlBtn.style.visibility == "visible") {
        gv.controlBtn.style.opacity = ""
        gv.controlBtn.style.visibility = ""
        gv.picinpicBtn.style.opacity = ""
        gv.picinpicBtn.style.visibility = ""
        gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
        document.removeEventListener("scroll", handle.scrollFix, false)
      }
    },
    scrollFix(e) {
      clearTimeout(gv.scrollFixTimer)
      gv.scrollFixTimer = setTimeout(() => {
        setButton.locate()
      }, 20)
    },
    hotKey(e) {
      //默认退出键为ESC。需要修改为其他快捷键的请搜索"keycode"，修改为按键对应的数字。
      if (e.keyCode == 27) {
        maximize.playerControl()
      }
      //默认画中画快捷键为F2。
      if (e.keyCode == 113) {
        handle.pictureInPicture()
      }
    },
    async receiveMessage(e) {
      switch (e.data) {
        case "iframePicInPic":
          tool.print("messege:iframePicInPic")
          if (!document.pictureInPictureElement) {
            await document
              .querySelector("video")
              .requestPictureInPicture()
              .catch((error) => {
                tool.addTip(gv.btnText.tip)
              })
          } else {
            await document.exitPictureInPicture()
          }
          break
        case "iframeVideo":
          tool.print("messege:iframeVideo")
          if (!gv.isFull) {
            gv.player = gv.mouseoverEl
            setButton.init()
          }
          break
        case "parentFull":
          tool.print("messege:parentFull")
          gv.player = gv.mouseoverEl
          if (gv.isIframe) {
            window.parent.postMessage("parentFull", "*")
          }
          maximize.checkParent()
          maximize.fullWin()
          if (getComputedStyle(gv.player).left != "0px") {
            tool.addStyle("#htmlToothbrush #bodyToothbrush .playerToothbrush {left:0px !important;width:100vw !important;}")
          }
          gv.isFull = true
          break
        case "parentSmall":
          tool.print("messege:parentSmall")
          if (gv.isIframe) {
            window.parent.postMessage("parentSmall", "*")
          }
          maximize.smallWin()
          break
        case "innerFull":
          tool.print("messege:innerFull")
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerFull", "*")
          }
          maximize.checkParent()
          maximize.fullWin()
          break
        case "innerSmall":
          tool.print("messege:innerSmall")
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerSmall", "*")
          }
          maximize.smallWin()
          break
      }
    },
    pictureInPicture() {
      if (!document.pictureInPictureElement) {
        if (gv.player) {
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("iframePicInPic", "*")
          } else {
            gv.player.parentNode.querySelector("video").requestPictureInPicture()
          }
        } else {
          document.querySelector("video").requestPictureInPicture()
        }
      } else {
        document.exitPictureInPicture()
      }
    },
  }

  const maximize = {
    playerControl() {
      if (!gv.player) {
        return
      }
      this.checkParent()
      if (!gv.isFull) {
        if (gv.isIframe) {
          window.parent.postMessage("parentFull", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerFull", "*")
        }
        this.fullWin()
        if (gv.autoCheckCount > 0 && !tool.isHalfFullClient(gv.playerChilds[0])) {
          if (gv.autoCheckCount > 10) {
            for (let v of gv.playerChilds) {
              v.classList.add("videoToothbrush")
            }
            return
          }
          const tempPlayer = handle.autoCheck(gv.playerChilds[0])
          gv.autoCheckCount++
          maximize.playerControl()
          gv.player = tempPlayer
          maximize.playerControl()
        } else {
          gv.autoCheckCount = 0
        }
      } else {
        if (gv.isIframe) {
          window.parent.postMessage("parentSmall", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerSmall", "*")
        }
        this.smallWin()
      }
    },
    checkParent() {
      if (gv.isFull) {
        return
      }
      gv.playerParents = []
      let full = gv.player
      while ((full = full.parentNode)) {
        if (full.nodeName == "BODY") {
          break
        }
        if (full.getAttribute) {
          gv.playerParents.push(full)
        }
      }
    },
    fullWin() {
      if (!gv.isFull) {
        document.removeEventListener("mouseover", handle.getPlayer, false)
        gv.backHtmlId = document.body.parentNode.id
        gv.backBodyId = document.body.id
        if (document.location.hostname == "www.youtube.com" && !document.querySelector("#player-theater-container #movie_player")) {
          document.querySelector("#movie_player .ytp-size-button").click()
          gv.ytbStageChange = true
        }
        gv.leftBtn.style.display = "block"
        gv.rightBtn.style.display = "block"
        gv.picinpicBtn.style.display = ""
        gv.controlBtn.style.display = ""
        this.addClass()
      }
      gv.isFull = true
    },
    addClass() {
      document.body.parentNode.id = "htmlToothbrush"
      document.body.id = "bodyToothbrush"
      for (let v of gv.playerParents) {
        v.classList.add("parentToothbrush")
        //父元素position:fixed会造成层级错乱
        if (getComputedStyle(v).position == "fixed") {
          v.classList.add("absoluteToothbrush")
        }
      }
      gv.player.classList.add("playerToothbrush")
      if (gv.player.nodeName == "VIDEO") {
        gv.backControls = gv.player.controls
        gv.player.controls = true
      }
      window.dispatchEvent(new Event("resize"))
    },
    smallWin() {
      document.body.parentNode.id = gv.backHtmlId
      document.body.id = gv.backBodyId
      for (let v of gv.playerParents) {
        v.classList.remove("parentToothbrush")
        v.classList.remove("absoluteToothbrush")
      }
      gv.player.classList.remove("playerToothbrush")
      if (document.location.hostname == "www.youtube.com" && gv.ytbStageChange && document.querySelector("#player-theater-container #movie_player")) {
        document.querySelector("#movie_player .ytp-size-button").click()
        gv.ytbStageChange = false
      }
      if (gv.player.nodeName == "VIDEO") {
        gv.player.controls = gv.backControls
      }
      gv.leftBtn.style.display = ""
      gv.rightBtn.style.display = ""
      gv.controlBtn.style.display = ""
      document.addEventListener("mouseover", handle.getPlayer, false)
      window.dispatchEvent(new Event("resize"))
      gv.isFull = false
    },
  }

  const init = () => {
    gv.picinpicBtn = document.createElement("tbdiv")
    gv.picinpicBtn.id = "picinpicBtn"
    gv.picinpicBtn.onclick = () => {
      handle.pictureInPicture()
    }
    document.body.appendChild(gv.picinpicBtn)
    gv.controlBtn = tool.createButton("playerControlBtn")
    gv.leftBtn = tool.createButton("leftFullStackButton")
    gv.rightBtn = tool.createButton("rightFullStackButton")

    if (getComputedStyle(gv.controlBtn).position != "fixed") {
      tool.addStyle(
        [
          "#htmlToothbrush #bodyToothbrush .parentToothbrush .bilibili-player-video {margin:0 !important;}",
          "#htmlToothbrush, #bodyToothbrush {overflow:hidden !important;zoom:100% !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush {overflow:visible !important;z-index:auto !important;transform:none !important;-webkit-transform-style:flat !important;transition:none !important;contain:none !important;}",
          "#htmlToothbrush #bodyToothbrush .absoluteToothbrush {position:absolute !important;}",
          "#htmlToothbrush #bodyToothbrush .playerToothbrush {position:fixed !important;top:0px !important;left:0px !important;width:100vw !important;height:100vh !important;max-width:none !important;max-height:none !important;min-width:0 !important;min-height:0 !important;margin:0 !important;padding:0 !important;z-index:2147483646 !important;border:none !important;background-color:#000 !important;transform:none !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush video {object-fit:contain !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush .videoToothbrush {width:100vw !important;height:100vh !important;}",
          '#playerControlBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:64px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #playerControlBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
          '#picinpicBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:53px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #picinpicBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
          "#leftFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;left:0;z-index:2147483647;background:#000;}",
          "#rightFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;right:0;z-index:2147483647;background:#000;}",
        ].join("\n")
      )
    }
    document.addEventListener("mouseover", handle.getPlayer, false)
    document.addEventListener("keydown", handle.hotKey, false)
    window.addEventListener("message", handle.receiveMessage, false)
    tool.print("Ready")
  }

  init()
})()
