// ==UserScript==
// @name         coco-pa
// @icon         https://www.hololive.tv/favicon.ico
// @version      0.15
// @description  懒人冲虫，自动检测点踩开车刹车
// @author       coco-pa
// @match         *://www.youtube.com/*
// @match         *://schedule.hololive.tv/*
// @match         *://www.google.com/sorry/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        window.close
// @grant        unsafeWindow
// @run-at        document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @namespace https://greasyfork.org/zh-CN/users/700210-coco-pa
// @downloadURL https://update.greasyfork.org/scripts/415224/coco-pa.user.js
// @updateURL https://update.greasyfork.org/scripts/415224/coco-pa.meta.js
// ==/UserScript==

const config = {
  channel: "UCS9uQI-jC3DE0L4IpXyvr6w",
  autoOpenDLC: true, // 自动打开独轮车
  DLCConfig: {
    slowMode: {
      minCycleSec: "90",
      maxCycleSec: "100"
    },
    fastMode: {
      minCycleSec: "5",
      maxCycleSec: "10"
    }
  }
}

let comfirmDom = {
  box: null,
  text: null,
  ok: null,
  cancel: null
}

const log = function(text){
  const date = new Date()
  console.log(`[全自动冲蝗][${date.getHours()<10?'0'+date.getHours():date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()}:${date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()}]${text}`)
}

function cocopacomfirm(text,ok,cancel){
  if(!comfirmDom.box){
    comfirmDom.box = document.createElement("div")
    comfirmDom.box.style="z-index: 9999;position:fixed;width: 400px;height: 200px;left: 50%;top: 50%;transform: translate(-50%, -50%);box-shadow: 0px 0px 10px #000;background-color: #fff;"
    document.body.append(comfirmDom.box)
    comfirmDom.text = document.createElement("div")
    comfirmDom.text.style="height: 150px;text-align: center;"
    comfirmDom.text.innerHTML = ""
    comfirmDom.box.append(comfirmDom.text)
    comfirmDom.ok = document.createElement("div")
    comfirmDom.ok.style="cursor: pointer;line-height:50px;height: 50px;width:200px;text-align: center;float:left;"
    comfirmDom.ok.innerHTML = "确认"
    comfirmDom.box.append(comfirmDom.ok)
    comfirmDom.cancel = document.createElement("div")
    comfirmDom.cancel.style="cursor: pointer;line-height:50px;height: 50px;width:200px;text-align: center;float:left;"
    comfirmDom.cancel.innerHTML = "取消"
    comfirmDom.box.append(comfirmDom.cancel)
  }
  comfirmDom.text.innerHTML = `[全自动冲蝗]${text}`
  comfirmDom.ok.onclick=function(){
    comfirmDom.box.style.display = "none"
    ok()
  }
  comfirmDom.cancel.onclick=function(){
    comfirmDom.box.style.display = "none"
    cancel()
  }
}

let exitTimer
function exit(text){
  try{
    clearTimeout(exitTimer)
  }catch(e){}
  exitTimer = setTimeout(()=>{
    window.close()
    unsafeWindow.close()
  },1*60*1000)
  cocopacomfirm(`${text}<br />点击确认立即退出，点击取消取消退出，不点击1分钟后退出`,()=>{
    window.close()
    unsafeWindow.close()
  },()=>{
    clearTimeout(exitTimer)
  })
}

function inWatchPage(){
  const refs = {
    name: null,
    button: null
  }

  let isDLCError = false

  function isLive(){
    document.querySelector(".ytp-live-badge") && document.querySelector(".ytp-live-badge").click()
    return !!(document.querySelector(".ytp-live") && document.querySelector(".ytp-live-badge") && document.querySelector(".ytp-live-badge").disabled)
  }
  function isWaitLive(){
    return document.querySelector(".ytp-live") !== null && document.querySelector(".ytp-live").style.display === "none"
  }
  function hasDLC(){
    try{
      return !!unsafeWindow.dulunche.refs
    }catch(e){
      return false
    }
    
  }
  function checkBan(){
    return new Promise((res)=>{
      try{
        // YouTube聊天观察哨提供api
        // https://greasyfork.org/scripts/414521
        window.top.document.querySelector("#chatframe").contentWindow.checkSuperChat().then((status)=>{
          if(status.error !== null){
            if(!(refs.button.classList.value.indexOf("style-default-active")>-1)){
              refs.button.click()
            }
            log(`当前账号可能已被封禁: ${status.error}`)
            exit(`当前账号可能已被封禁，视频已踩，1分钟后关闭: ${status.error}`)
            res(true)
          }else{
            res(false)
          }
        })
      }catch(e){
        res(false)
      }
    })
  }
  function waitDLC(){
    if(hasDLC() && isLive()){
      if(isDLCError){
        exit("独轮车开启失败，视频已踩，1分钟后关闭")
        return
      }
      log("独轮车输出，等待直播结束")
      let timeout = 0
      const timer = setInterval(()=>{
        if(!isLive()){
          if(document.querySelector(".videowall-endscreen").style.display === "none"){
            document.querySelector(".ytp-live-badge").click()
            setTimeout(()=>{
              if(!isLive()){
                timeout += 1;
                if(timeout > 2){
                  if(!(refs.button.classList.value.indexOf("style-default-active")>-1)){
                    refs.button.click()
                  }
                  clearInterval(timer)
                  exit("直播已结束，视频已踩，1分钟后关闭")
                }
              }
            },500)
          }else{
            if(!(refs.button.classList.value.indexOf("style-default-active")>-1)){
              refs.button.click()
            }
            clearInterval(timer)
            exit("直播已结束，视频已踩，1分钟后关闭")
          }
        }else{
          timeout = 0
        }
        // 开启会员专享模式情况或其他不可评论的情况
        // if(document.querySelector("#chatframe").contentDocument.querySelector("yt-live-chat-restricted-participation-renderer")){
        //   if(!(refs.button.classList.value.indexOf("style-default-active")>-1)){
        //     refs.button.click()
        //   }
        //   exit("不可评论，视频已踩，1分钟后关闭")
        // }
      },60000)
      checkBan().then((isBan)=>{
        if(!isBan){
          const checkBanTimer = setInterval(()=>{
            checkBan().then((isBan)=>{
              if(isBan){
                clearInterval(checkBanTimer)
              }
            })
          },5*60*1000)// 5分钟检测一次ban情况
        }
      })

    }else{
      exit("未检测到独轮车或直播已结束，视频已踩，1分钟后关闭")
    }
  }
  function setDefinition(){
    setTimeout(()=>{
      // 调整画质
      log(`调整画质`)
      document.querySelector(".ytp-settings-button").click()
      setTimeout(()=>{
        const bts = document.querySelectorAll(".ytp-settings-menu .ytp-menuitem")
        bts[bts.length-1].click()
        setTimeout(()=>{
          const bts = document.querySelectorAll(".ytp-quality-menu .ytp-menuitem")
          bts[bts.length-2].click()
        },1000)
      },1000)
    },60000)
  }
  const waitDown = function(){
    log("开始计时观看10分钟")
    setTimeout(()=>{
      if(refs.button.classList.value.indexOf("style-default-active")>-1){
        log("已踩")
      }else{
        refs.button.click()
      }
      waitDLC()
    },60*1000*10)
  }
  const tryOpenDLC = function(){
    if(hasDLC()){
      try{
        document.querySelector(".dlc-suspension").click()
        // 更新远程弹幕库
        const bts = document.querySelectorAll(".dlc-cmd>div")[1].querySelectorAll("button")
        bts[bts.length-1].click()

      }catch(e){
        isDLCError = true
      }
      setTimeout(()=>{
        try{
          let flag = false
          if(/慢速/.test(document.querySelector(".ytd-live-chat-frame").contentDocument.querySelector("#input-container label").innerText)){
            flag = unsafeWindow.dulunche.config.minCycleSec !== String(config.DLCConfig.slowMode.minCycleSec) || unsafeWindow.dulunche.config.maxCycleSec !== String(config.DLCConfig.slowMode.maxCycleSec)
            unsafeWindow.dulunche.config.minCycleSec = String(config.DLCConfig.slowMode.minCycleSec)
            unsafeWindow.dulunche.config.maxCycleSec = String(config.DLCConfig.slowMode.maxCycleSec)
          }else{
            flag = unsafeWindow.dulunche.config.minCycleSec !== String(config.DLCConfig.fastMode.minCycleSec) || unsafeWindow.dulunche.config.maxCycleSec !== String(config.DLCConfig.fastMode.maxCycleSec)
            unsafeWindow.dulunche.config.minCycleSec = String(config.DLCConfig.fastMode.minCycleSec)
            unsafeWindow.dulunche.config.maxCycleSec = String(config.DLCConfig.fastMode.maxCycleSec)
          }
          if(flag){
            setTimeout(()=>{
              if(document.querySelector(".dlc-titlebar>button").innerHTML === "出动"){
                document.querySelector(".dlc-titlebar>button").click()
              }else{
                document.querySelector(".dlc-titlebar>button").click()
                setTimeout(()=>{
                  document.querySelector(".dlc-titlebar>button").click()
                },500)
              }
            },1000)
          }else{
            if(document.querySelector(".dlc-titlebar>button").innerHTML === "出动"){
              document.querySelector(".dlc-titlebar>button").click()
            }
          }
        }catch(e){
          log("开启独轮车失败")
          console.error(e)
          isDLCError = true
        }
      },5000)
    }
  }
  const start = function(){
    try{
      if(refs.name.getAttribute("href") !== `/channel/${config.channel}`){
        log("非蝗直播间: " + refs.name.getAttribute("href"))
        return
      }
      if(isLive() && config.autoOpenDLC){
        tryOpenDLC()
      }
      if(document.querySelector("#related") && document.querySelector("#related").querySelector("paper-toggle-button") && document.querySelector("#related").querySelector("paper-toggle-button").getAttribute("aria-pressed") == "true"){
        log("关闭自动播放")
        document.querySelector("#related").querySelector("paper-toggle-button").click()
      }
      if(document.querySelector(".ytp-autonav-toggle-button") && document.querySelector(".ytp-autonav-toggle-button").getAttribute("aria-checked") == "true"){
        log("关闭自动播放")
        document.querySelector(".ytp-autonav-toggle-button").click()
      }
      if(refs.button.classList.value.indexOf("style-default-active")>-1){
        log("此视频已踩过")
        waitDLC()
        setDefinition()
      }else{
        if(isWaitLive()){
          log("直播尚未开始，等待开始后计时观看")
          const waitLiveTimer = setInterval(()=>{
            if(isLive()){
              waitDown()
              setDefinition()
              clearInterval(waitLiveTimer)
            }
          },60000)
        }else{
          // 正在直播和直播结束都会观看10钟后踩
          waitDown()
          setDefinition()
        }
      }
    }catch(e){
      console.log(e)
    }
  }
  const findRefsTimer = setInterval(() => {
    try {
      refs.name = document.querySelector("#channel-name .yt-simple-endpoint.style-scope.yt-formatted-string")
      refs.button = document.querySelectorAll("#top-level-buttons ytd-toggle-button-renderer")[1]
      if(refs.name.getAttribute("href")){
        clearInterval(findRefsTimer)
        log("元素定位成功")
        start()
      }
    } catch (e) {
    }
  }, 1000);
}
async function inSchedulePage(){
  setTimeout(()=>{
    window.location.reload()
  },60000)
  window.addEventListener("load",async function(){
    let fireList = []
    try{
      fireList = JSON.parse(GM_getValue("coco-pa-live"))
      if(!Array.isArray(fireList)){
        fireList = []
      }
    }catch(e){
      fireList = []
    }
    const thumbnails = document.querySelectorAll(".thumbnail")
    let nowFlag = false
    for(let i=0;i<thumbnails.length;i++){
      const thumbnail = thumbnails[i]
      const name = thumbnail.querySelector(".name").innerHTML
      const watchURL = thumbnail.getAttribute("href")
      if(/red/.test(thumbnail.style.border)){
        nowFlag = true
      }
      if(/桐生ココ/.test(name) && /red/.test(thumbnail.style.border)){
        if(fireList.includes(watchURL)){
          log(`[JPT: ${thumbnail.querySelector('.datetime').innerText}]该直播已处理过`)
        }else{
          fireList.push(watchURL)
          GM_setValue("coco-pa-live",JSON.stringify(fireList))
          GM_openInTab(watchURL,{
            active: true
          })
          return
        }
      }
      if(/桐生ココ/.test(name) && nowFlag && !/red/.test(thumbnail.style.border)){
        log("即将开始的直播[JPT]: " + thumbnail.querySelector('.datetime').innerText)
      }
    }
    log("holo日程表未发现虫皇正在直播且未冲的的直播间")
    try{
      const response = await new Promise((res,rej)=>{
        const curl = GM_xmlhttpRequest({
          method: "GET",
          url: `https://dsjzxgqd48j6m.cloudfront.net/coco-gachi.json`,
          onload: (response)=>{
            try{
              res(JSON.parse(response.response))
            }catch(e){
              rej(e)
            }
          }
        })
      })
      if(response.currentLives.length > 0){
        const watchURL = response.currentLives[0].link
        if(!fireList.includes(watchURL)){
          fireList.push(watchURL)
          GM_setValue("coco-pa-live",JSON.stringify(fireList))
          GM_openInTab(watchURL,{
            active: true
          })
          return
        }else{
          log(`正在直播但已处理: ${response.currentLives[0].title}`)
        }
      }else{
        log("API未发现虫皇正在直播且未冲的的直播间")
        for(let upcomingLive of response.upcomingLives){
          log("即将开始的直播: " + upcomingLive.title)
        }
      }
    }catch(e){
      log("直播信息API访问失败")
      console.log(e)
    }
  })
}

async function inBotCheck(){
  Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
    if(location.href === "https://www.google.com/sorry/index?coco-pa"){
      if (status === "granted") {
        new Notification("授权已完成");
      }
      else {
        alert("授权已完成：未获得通知授权");
      }
      window.close()
    }else{
      if (status === "granted") {
        new Notification("请完成人机验证");
      }
      else {
        alert("请完成人机验证");
      }
    }
  });
}

(function() {
  'use strict';
  if(window.self !== window.top){
    return
  }
  if(/www\.youtube\.com/.test(location.href)){
    if(/www\.youtube\.com\/watch\?v=/.test(location.href)){
      inWatchPage()
    }
    let href = location.href
    setInterval(()=>{
      if(href !== location.href && /www\.youtube\.com\/watch\?v=/.test(location.href)){
        location.reload()
      }
      href = location.href
    },1000)
  }
  if(/schedule\.hololive\.tv/.test(location.href)){
    if(!GM_getValue("coco-pa-checkbot")){
      alert("当前为首次打开脚本，请先进行人机验证页的通知授权，使遇到人机验证时及时收到通知")
      GM_openInTab("https://www.google.com/sorry/index?coco-pa",{
        active: true
      })
      GM_setValue("coco-pa-checkbot","true")
    }
    log("当前为直播表页")
    inSchedulePage()
  }
  if(/www\.google\.com\/sorry/.test(location.href)){
    log("人机验证")
    inBotCheck()
  }

})();