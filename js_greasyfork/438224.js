// ==UserScript==
// @author          yukinotech
// @namespace       yukinotech
// @github          https://github.com/yukinotech/bili-rotate
// @name            bilibili b站 视频 旋转
// @name:en         bilibili player rotate
// @version         1.0.8
// @description     bilibili 视频 旋转 插件
// @description:en  bilibili b站 player rotate plugin
// @include         http*://*.bilibili.com/video/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438224/bilibili%20b%E7%AB%99%20%E8%A7%86%E9%A2%91%20%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438224/bilibili%20b%E7%AB%99%20%E8%A7%86%E9%A2%91%20%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==

;(async function () {
  console.log("rotate init start xxxxx")
  // ****** utils 函数 ******
  let waitToGet = (fn, time) => {
    return new Promise((resolve, reject) => {
      let c = () => {
        setTimeout(() => {
          let leftAgs = [...arguments].slice(2)
          let rtn = fn(...leftAgs)
          if (rtn) {
            resolve(rtn)
          } else {
            c()
          }
        }, time)
      }
      c()
    })
  }
  let getNumFromPx = (pxStr) => {
    return Number(pxStr.replace("px", ""))
  }
  let numToPx = (num) => {
    return String(num.toFixed(2)) + "px"
  }
  // ****** 全局初始化  ******
  let playerStyleTag = await waitToGet(() => {
    return document.getElementById("setSizeStyle")
  }, 600)
  // ****** video 旋转处理部分 ******
  // 使用全局变量，因为会出现页面内刷新的情况，变量需要实时指向最新的dom标签，便于赋值刷新
  // 页面层级结构： 1、变量名:dom名  2、外层->里层
  // video:div -> realVideo:video || realVideo:bwp-video

  // video：包裹player的中层div
  let video
  // realVideo：实际video标签，或者bwp-video标签
  let realVideo
  // deg：旋转角度
  let deg
  // realVideo_H_W_Ratio：视频原始高比宽
  let realVideo_H_W_Ratio

  // video逻辑初始化部分
  let videoInit = async () => {
    video = await waitToGet(() => {
      return (
        document.getElementsByClassName("bilibili-player-video")?.[0] ||
        document.getElementsByClassName("bpx-player-video-wrap")?.[0]
      )
    }, 600)

    realVideo = video.childNodes[0]

    video.style.height = "100%"
    video.style.width = "100%"
    video.style.display = "flex"
    video.style["justify-content"] = "center"

    realVideo.style.margin = "0"
    realVideo.style.padding = "0"
    realVideo.style["object-fit"] = "contain"
    realVideo.style.height = "auto"
    realVideo.style.width = "auto"
    realVideo.style.transform = "none"

    let { height: videoContainerHeight, width: videoContainerWidth } =
      window.getComputedStyle(video)
    let { height: realVideoHeight, width: realVideoWidth } =
      window.getComputedStyle(realVideo)
    realVideo_H_W_Ratio =
      getNumFromPx(realVideoHeight) / getNumFromPx(realVideoWidth)
    if (realVideo_H_W_Ratio >= 1) {
      // 原始视频是竖屏
      realVideo.style["max-height"] = "none"
    } else {
      // 原始视频是横屏
      realVideo.style["width"] = "100%"
    }
    console.log("realVideoHeight", realVideoHeight)
    console.log("realVideoWidth", realVideoWidth)
    console.log("videoContainerHeight", videoContainerHeight)
    console.log("videoContainerWidth", videoContainerWidth)
    // deg 标记旋转角度
    deg = 0
  }
  // 旋转时回调函数
  let rotate = () => {
    deg = (deg + 90) % 360
    resetHW()
  }
  // 重置宽高
  let resetHW = () => {
    let { height: videoContainerHeight, width: videoContainerWidth } =
      window.getComputedStyle(video)
    let videoContainerHeightNum = getNumFromPx(videoContainerHeight)
    let videoContainerWidthNum = getNumFromPx(videoContainerWidth)

    // deg 为当前角度状态
    if (deg === 90 || deg === 270) {
      console.log("realVideo_H_W_Ratio", realVideo_H_W_Ratio)
      if (realVideo_H_W_Ratio < 1) {
        // 原始视频是横屏
        realVideo.style.transform = `rotate(${deg}deg)`
        // 这里不能太准确，需要后续确认一下
        realVideo.style.width = numToPx(getNumFromPx(videoContainerHeight) - 5)
      } else {
        // 原始视频是竖屏
        realVideo.style.height = videoContainerWidth
        realVideo.style.width = numToPx(
          videoContainerWidthNum / realVideo_H_W_Ratio
        )
        let offsetY = numToPx(
          (videoContainerWidthNum - videoContainerHeightNum) / -2
        )
        realVideo.style.transform = `translate(0,${offsetY}) rotate(${deg}deg)`
      }
    } else {
      if (realVideo_H_W_Ratio < 1) {
        // 原始视频是横屏
        realVideo.style.width = videoContainerWidth
        realVideo.style.transform = `rotate(${deg}deg)`
      } else {
        // 原始视频是竖屏
        realVideo.style.height = "auto"
        realVideo.style.width = "auto"
        realVideo.style.transform = `rotate(${deg}deg)`
      }
    }
  }
  // 按钮初始化部分
  let buttonInit = async () => {
    // 找到播放底栏父元素
    let controlRight = await waitToGet(() => {
      return (
        document.getElementsByClassName(
          "bilibili-player-video-control-bottom-right"
        )?.[0] ||
        document.getElementsByClassName("bpx-player-control-bottom-right")?.[0]
      )
    }, 600)

    // 调试用代码 begin ：强制底栏常驻

    // let controlBottom = await waitToGet(() => {
    //   return document.getElementsByClassName(
    //     "bilibili-player-video-control-bottom"
    //   )?.[0]
    // }, 300)

    // controlBottom.style.opacity = "1"
    // controlBottom.style.visibility = "visible"

    // 调试用代码 end ：强制底栏常驻

    // 构造button div，绑定事件，并插入文档
    let buttonSvg = `<svg viewBox="0 0 1536 1536" aria-labelledby="rwsi-awesome-repeat-title" id="si-awesome-repeat" width="100%" height="100%"><title id="rwsi-awesome-repeat-title">icon repeat</title><path d="M1536 128v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l138-138Q969 256 768 256q-104 0-198.5 40.5T406 406 296.5 569.5 256 768t40.5 198.5T406 1130t163.5 109.5T768 1280q119 0 225-52t179-147q7-10 23-12 14 0 25 9l137 138q9 8 9.5 20.5t-7.5 22.5q-109 132-264 204.5T768 1536q-156 0-298-61t-245-164-164-245T0 768t61-298 164-245T470 61 768 0q147 0 284.5 55.5T1297 212l130-129q29-31 70-14 39 17 39 59z"></path></svg>`
    let buttonDiv = document.createElement("div")
    buttonDiv.style.width = "17px"
    buttonDiv.style.height = "17px"
    buttonDiv.style.fill = "#fff"
    buttonDiv.style.margin = "3px 6px"
    buttonDiv.style.cursor = "pointer"
    buttonDiv.innerHTML = buttonSvg
    buttonDiv.id = "rotate-button"

    if (!document.getElementById("rotate-button")) {
      controlRight.insertBefore(buttonDiv, controlRight.childNodes[6])
    }

    buttonDiv.addEventListener("click", rotate)

    console.log("rotate init end")

    setTimeout(() => {
      if (!document.getElementById("rotate-button")) {
        // 存在b站在脚本的初始化之后执行，覆盖脚本，加一次兜底
        controlRight.insertBefore(buttonDiv, controlRight.childNodes[6])
      }
    }, 5000)
  }

  // ****** 第一次实际执行部分 ******

  await videoInit()
  await buttonInit()

  // ****** 监听部分 ******

  // 播放器父元素的大小发生变化时，处理宽高 回调
  let observer = new MutationObserver((mutationList) => {
    // console.log("播放器的大小change", mutationList)
    // 这里b站会自动重置css，包括video的宽高，可以加延迟解决
    if (mutationList.length !== 2) {
      // === 2时，为播放列表切换视频，应该走视频初始化流程
      console.log("handle size change")
      setTimeout(() => {
        resetHW()
      }, 100)
    }

    // 调试用代码 begin

    // let { height: videoContainerHeight, width: videoContainerWidth } =
    //   window.getComputedStyle(video)
    // let { height: realVideoHeight, width: realVideoWidth } =
    //   window.getComputedStyle(realVideo)
    // console.log("realVideoHeight", realVideoHeight)
    // console.log("realVideoWidth", realVideoWidth)
    // console.log("videoContainerHeight", videoContainerHeight)
    // console.log("videoContainerWidth", videoContainerWidth)

    // 调试用代码 end
  })

  // 监听播放器父元素的大小发生变化
  observer.observe(playerStyleTag, {
    childList: true,
    attributes: true,
    subtree: true,
  })

  // 播放列表里切换视频时，b站会初始化播放器。此处为初始化播放器的回调
  let videoSwitchObserver = new MutationObserver((mutationList) => {
    // console.log("视频切换change", mutationList?.["1"]?.type)
    // 页面往下滑，会触发画中画功能，造成初始化误判,增加条件判断
    if (mutationList?.["1"]?.type === "childList") {
      // 增加一个同步重置, 避免闪烁
      realVideo.style.transform = "none"
      ;(async () => {
        console.log("**** handle init ****")
        await videoInit()
        await buttonInit()
      })()
    } else if (mutationList?.["1"]?.type === "attributes") {
      // 触发画中画功能，回来后需要重置宽高
      console.log("触发画中画功能，回来后需要重置宽高")
      setTimeout(() => {
        resetHW()
      }, 100)
    }
  })

  // 监听播放器是否初始化
  videoSwitchObserver.observe(document.getElementById("bilibili-player"), {
    childList: true,
    attributes: true,
  })
})()
