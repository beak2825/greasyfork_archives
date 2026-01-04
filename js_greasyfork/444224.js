// ==UserScript==
// @name         加群机器人json下载
// @namespace    67373tools
// @description  加群机器人的验证信息json下载，方便做成报表
// @version      0.0.1
// @author       旅行
// @match        *://mini.telestd.me/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444224/%E5%8A%A0%E7%BE%A4%E6%9C%BA%E5%99%A8%E4%BA%BAjson%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444224/%E5%8A%A0%E7%BE%A4%E6%9C%BA%E5%99%A8%E4%BA%BAjson%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var id = document.URL.substring(25, 1000)
  var vOffset = 0 // v 验证记录：大概正常时期1个月50条
  var oOffset = 0 // o 操作记录：大概正常时期1个月30条
  var offset = [700, 350]
  var ifExit = false

  GM_registerMenuCommand("设置offset", () => {
    offset = prompt("请输入offset", "700，350")
    offset = offset.replaceAll(",", "，")
    offset = offset.split("，")
    offset[0] = Math.ceil(offset[0] / 5) * 5
    offset[1] = Math.ceil(offset[1] / 5) * 5
    let ifOpen = confirm("是否打开网页检查" + offset)
    if(ifOpen){
      // 打开新窗口检查是否完备
      window.open("https://mini.telestd.me/admin/chats/-1001744444199/verifications?timeRange=1m&offset=" + offset[0])
      window.open("https://mini.telestd.me/admin/chats/-1001744444199/operations?timeRange=1m&offset=" + offset[1])
    }
  })

  GM_registerMenuCommand("下载JSON", () => {
    vOffset = 0
    oOffset = 0
    ifExit = false
    let downloadInterval = setInterval(() => {
      if (vOffset <= offset[0]) {
        GM_download("https://mini.telestd.me/admin/api/chats/" + id + "/verifications?timeRange=1m&offset=" + vOffset, "v" + (vOffset + 10000000))
        vOffset += 25
        ifExit = false
      } else { ifExit = true }

      if (oOffset <= offset[1]) {
        GM_download("https://mini.telestd.me/admin/api/chats/" + id + "/operations?timeRange=1m&offset=" + oOffset, "o" + (oOffset + 10000000))
        oOffset += 25
        ifExit = false
      } else {
        ifExit = (ifExit && true)
        if( ifExit ) console.log("下完了")
      }

      if (ifExit) {
        clearInterval(downloadInterval)
        console.log("关了")
      }
    }, 200)
  })
})();

