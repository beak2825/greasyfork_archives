// ==UserScript==
// @name         B站VRChat链接复制
// @namespace    Shinnya
// @version      2024-01-23-3
// @description  把B站链接复制到VRChat中
// @author       小新喵~ 风铃Echo
// @match        https://www.bilibili.com/video/BV*
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485486/B%E7%AB%99VRChat%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485486/B%E7%AB%99VRChat%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  var vrcDiv = null

  function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }

  // 修改文本
  function updateText(newText) {
    const numChinese = newText.match(/[\u3400-\u9FBF]/g) ? newText.match(/[\u3400-\u9FBF]/g).length : 0
    const numEnglish = newText.length - numChinese

    const padding = 16
    const width = numChinese * 16 + numEnglish * 10 + padding + "px"

    setTimeout(() => {
      vrcDiv.style.width = width
      vrcDiv.textContent = newText
    }, 10)
  }
  // 获取BV或者ROOM
  function geturlParameter() {
    const re = /^.*(BV[0-9a-zA-Z]+).*$/
    const re2 = /^\/([0-9]+)\?*.*$/
    const uri = re.exec(window.location.pathname)
    const uri2 = re2.exec(window.location.pathname)
    let parameter = ""
    if (uri && uri.length == 2){
        parameter = uri[1]
        let page = getQueryString("p")
        if(page) parameter = parameter + '/' + page
    }
    else if (uri2 && uri2.length == 2) parameter = uri2[1]
    return parameter
  }

  vrcDiv = document.createElement("div")
  updateText("复制链接给VRChat使用")
  const styles = {
    position: "fixed",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    bottom: "1vh",
    left: "0.5vw",
    zIndex: "999",
    fontSize: "16px",
    lineHeight: "16px",
    background: "#FB7299",
    color: "#FFF",
    padding: "6px 8px",
    borderRadius: "8px",
    transition: "all 0.3s ease-in"
  }
  for (const property in styles) {
    vrcDiv.style[property] = styles[property]
  }

  document.body.append(vrcDiv)
  vrcDiv.onclick = function () {
    try {
      navigator.clipboard.writeText("http://api.xin.moe/" + geturlParameter())
      updateText("复制成功")
    } catch (err) {
      updateText("复制失败")
    }
    setTimeout(function () {
      updateText("复制链接给VRChat使用")
    }, 5000)
  }
})()
