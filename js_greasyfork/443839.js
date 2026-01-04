// ==UserScript==
// @name         自动下载tg群图片
// @namespace    67373tools
// @description  自动下载tg群图片，方便分享
// @version      0.4
// @author       旅行
// @match        *://web.telegram.org/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443839/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BDtg%E7%BE%A4%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/443839/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BDtg%E7%BE%A4%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
// 使用方法：
// 1、登录网页版tg
// 2、点开某个群聊
// 3、点击油猴菜单中的下载按钮

  'use strict';
  var status = "stop"
  var checkInterval, downloadInterval
  var lastID
  var lastNode
  var ifHaveNewMsg = true
  GM_registerMenuCommand("自动下载tg图片", () => {
    if ( status == "stop" ) {
      lastID = getLastID() - 28
      console.log(lastID, "开始的ID")
      status = "doing"
      startChecking()
    } else if( status == "doing" ) {
      status = "stop"
      clearInterval(checkInterval)
      clearInterval(downloadInterval)
      console.log("停止下载")
    }
  });

  function startChecking(){
    checkInterval = setInterval(()=>{
      lastNode = document.querySelector("#message"+lastID)
      if( lastNode != undefined ){
        ifHaveNewMsg = true
        // console.log(lastID, "ID查到元素，处理中", status, lastNode)
        lastNode.scrollIntoView()
        clearInterval(checkInterval)
        tryDownload()
      } else if ( lastID < getLastID() ){
        ifHaveNewMsg = true
        console.log(lastID, "ID元素不存在", status, lastNode)
        lastID += 1
      } else {
        if ( ifHaveNewMsg ) console.log(lastID, "消息还没有更新", status, lastNode)
        ifHaveNewMsg = false // 避免重复打印
      }
    },1000)
  }

  function tryDownload(){
    let nodeList = document.querySelectorAll("#message" + lastID + " .download-button")[0] // 音频
    if( nodeList != undefined ) {
      console.log(lastID, "音频，直接下载按钮") //, nodeList)
      nodeList.click()
      lastID += 1
      startChecking()
      return
    } else { // 有可能是 图片 图片组 视频
      nodeList = document.querySelectorAll("#message" + lastID + " .media-inner.interactive img")
      let nodeLen = nodeList.length
      if ( nodeLen == 0 ) {
        console.log(lastID, "啥也不是") //, nodeLen, nodeList)
        lastID += 1
        startChecking()
        return
      }
      console.log(lastID, "有可能是图片等", nodeLen) //, nodeList) // 图片/图片组/视频
      downloadInterval = setInterval(()=>{
        console.log("  现在点击节点图片") //, nodeList[nodeLen-1])
        if ( nodeList[nodeLen-1] == undefined ) return // 可能是消息被删了
        nodeList[nodeLen-1].click()
        setTimeout(()=>{
          console.log("  现在点击下载按钮")
          document.querySelectorAll("#MediaViewer .icon-download")[0].click()
            setTimeout(()=>{
              console.log("  现在点击关闭按钮")
              document.querySelectorAll('#MediaViewer [aria-label="Close"]')[0].click()
            },1000)
          nodeLen --
          if ( nodeLen == 0 ){
            clearInterval(downloadInterval)
            lastID += 1
            startChecking()
            return
          }
        },3000)
      },6000)
    }
  }

  function getLastID(){
    document.querySelectorAll('[aria-label="Go to bottom"]')[0].click()
    let ret = document.querySelectorAll(".Message") // 消息列表
    ret = Number(ret[ret.length - 1].id.substring(7,100))
    return ret
  }

  function delay(time){
    for(let i= Date.now(); Date.now()-i<time; ){}
  }
})();