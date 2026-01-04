// ==UserScript==
// @name         跳过抖音广告
// @namespace    https://greasyfork.org/zh-CN/users/1034730-%E9%9A%8F%E7%BC%98%E7%8E%A9%E5%AE%B6?locale_override=1
// @version      0.31
// @description  关闭抖音弹窗登录,跳过抖音广告和直播,观看直播默认原画
// @author       随缘玩家
// @license      随缘玩家
// @match        https://www.douyin.com/
// @match        https://live.douyin.com/*
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/455943/1270016/ajaxHooker.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460973/%E8%B7%B3%E8%BF%87%E6%8A%96%E9%9F%B3%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460973/%E8%B7%B3%E8%BF%87%E6%8A%96%E9%9F%B3%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let url = window.location.host
  if (url == "www.douyin.com") {
    let next;
    let configxgIcon = [
      { name: "清屏", option: false, type: "qingping" },
      { name: "评论区", option: false, type: "comment" },
      { name: "直播", option: true, type: "live" },
      { name: "右侧", option: true, type: "right" },
      { name: "底部", option: true, type: "bottom" },
      { name: "提示", option: true, type: "tips" },
      { name: "回退", option: true, type: "rollback" },
      { name: "屏蔽", option: true, type: "filter" },
    ]
    if (!localStorage.getItem("xg-icon")) {
      localStorage.setItem("xg-icon", JSON.stringify(configxgIcon))

    } else if (JSON.parse(localStorage.getItem("xg-icon")).length != configxgIcon.length) {
      localStorage.setItem("xg-icon", JSON.stringify(configxgIcon))
    } else {
      configxgIcon = JSON.parse(localStorage.getItem("xg-icon"))
    }

    let listModuleContent = ` <div class="userInput"> <div class="choice"> ﹀ </div> <input class="content" type="text"> <div class="confirm"> ✔ </div> </div> <div class="option"></div> <div class="list"> </div></div> `;
    let listModule = document.createElement("div")
    listModule.className = "listModule"
    listModule.innerHTML = listModuleContent
    let createlistModule = setInterval(() => {
      let rootvideo = document.querySelector(".YwClj8rK.fullscreen_capture_feedback")
      if (rootvideo) {
        clearInterval(createlistModule)
        rootvideo.appendChild(listModule)
      }
    }, 2000)

    let userValue = listModule.querySelector(".content")
    let KeywordFiltering = [
      { name: "名字", class: "username", data: [] },
      { name: "文案", class: "Copywriting", data: [] },
      { name: "标签", class: "Tag", data: ["图文", "购物", "广告"] },
      { name: "全选", class: "selectall", data: [] },
      { name: "时间", class: "time", time: 7, tips: function () { return `当前过滤${this.time}天以外的视频(7~999,999为不过滤)` } }
    ]

    if (!localStorage.getItem("KeywordData")) {
      localStorage.setItem("KeywordData", JSON.stringify(KeywordFiltering))
    } else {
      let i = JSON.parse(localStorage.getItem("KeywordData")).filter(item => item.data?.length != 0)
      KeywordFiltering = KeywordFiltering.map(item => i.find(subItem => subItem.name == item.name) ? { ...item, ...i.find(subItem => subItem.name == item.name) } : item)
    }

    for (const item of KeywordFiltering) {
      let li = document.createElement("li")
      li.innerText = item.name
      listModule.querySelector(".option").appendChild(li)
      let div = document.createElement("div")
      div.className = item.class
      listModule.querySelector(".list").appendChild(div)
      li.onclick = () => {
        for (const allDiv of listModule.querySelectorAll(".list div")) {
          allDiv.style.display = "none"
        }
        div.style.display = "block"
        listModule.querySelector(".option").style.display = "none "

        listModule.querySelector(".choice").innerText = li.innerText
        listModule.querySelector(".confirm").onclick = () => {
          if (userValue.value == "") {
            Tips("不允许为空")
            return
          }
          if (item.data) {
            if (item.data.includes(userValue.value)) {
              Tips("已存在")
              return
            }
            let span = document.createElement("span")
            span.innerText = userValue.value
            div.appendChild(span)
            item.data.push(userValue.value)

          }

          if (item.time || item.time == 0) {
            if (isNaN(userValue.value)) {
              Tips("请输入有效数字")
              return
            } else if (userValue.value < 7 || userValue.value > 999) {
              Tips("不符合规定")
              return
            }

            item.time = Number(userValue.value)
            document.querySelector(`.list .${item.class} span`).innerText = item.tips()
          }
          userValue.value = ""
          localStorage.setItem("KeywordData", JSON.stringify(KeywordFiltering))
        }

        userValue.onkeydown = (e) => {
          if (e.keyCode == 13) {
            listModule.querySelector(".confirm").click()
          }
        }
      }
      if (item.data) item.data.forEach(subitem => {
        let span = document.createElement("span")
        span.innerText = subitem
        div.appendChild(span)
      });

      if (item.time || item.time == 0) {
        let p = document.createElement("span")
        p.innerText = item.tips()
        div.appendChild(p)
      }

      div.onclick = (e) => {
        if (item.data && e.target.nodeName === "SPAN") {
          e.target.remove()
          item.data = item.data.filter(item => item != e.target.innerText)
          localStorage.setItem("KeywordData", JSON.stringify(KeywordFiltering))
        }
      }

    }

    listModule.querySelector(".choice").onmouseover = () => {
      listModule.querySelector(".option").style.display = "block "
      listModule.querySelector(".choice").innerText = " ﹀ "
      listModule.querySelector(".confirm").onclick = null
      for (const allDiv of listModule.querySelectorAll(".list div")) {
        allDiv.style.display = "none"
      }
    }
    listModule.querySelector(".option").onmouseleave = () => {
      listModule.querySelector(".option").style.display = "none "
    }

    document.onclick = function () {
      if (listModule.style.display == "none") return
      listModule.style.opacity = 0
      setTimeout(() => {
        userValue.value = ""
        listModule.style.display = "none"
        listModule.querySelector(".choice").innerText = " ﹀ "
        listModule.querySelectorAll(".list div").forEach(item => { item.style.display = "none" })
        listModule.querySelector(".confirm").onclick = null
      }, 300);
    }

    listModule.onclick = function (e) {
      e.stopPropagation()
    }
    let configureStyle = {}
    function addStyle(type, option) {
      if (!configureStyle[type]) return
      let targetItem = document.head.querySelector(`[name=${type}]`)
      if (String(option) == "true") {
        targetItem.innerText = configureStyle[type]
      } else {
        targetItem.innerText = ""
      }
    }

    let bottomElement = setInterval(() => {
      let bottomItem = document.querySelector(".xgplayer-controls")
      let head = document.querySelector("head")
      if (!bottomItem || !next || !head) return
      clearInterval(bottomElement)
      document.head.appendChild(geteStyle)
      configureStyle = {
        "qingping": `
        .tSXOCvQc{display: none !important}
      `,
        "right": `
      .L1TH4HdO.d6KxRih3.positionBox,
      .L1TH4HdO.positionBox
      {display: none !important}
      `,
        "bottom": `
      .video-info-mask,
      .UXyEyqbq.UdkDK3ea.DZKZZklc
      {display: none !important;}
      .xgplayer-controls{background-image:none !important}
      .xg-video-container{height: 99% !important;cursor: none !important;bottom: 0px !important;margin: auto 0px !important;}
      .JrMwkvQy.playerContainer.YFEqUSvt{cursor:none !important;}
      [class="JrMwkvQy playerContainer YFEqUSvt dLCldFlr"]{transition:all .5s !important;}
      .tSXOCvQc,.L1TH4HdO.positionBox{bottom:6px !important;transition:all .5s}
      .L1TH4HdO.positionBox{transform-origin:center bottom;}
      .tSXOCvQc{transform-origin:left bottom;}
      .xgplayer .xg-inner-controls.xg-pos{bottom:${-bottomItem.offsetHeight + 2}px;transition:all .3s}
      .Bj07xoIA .yWm90O3y{height: 100% !important}   
      `,
      }
      for (const key in configureStyle) {
        let style = document.createElement("style")
        style.setAttribute("name", key)
        document.head.appendChild(style)
        let item = configxgIcon.find(i => i.type == key)
        addStyle(key, item.option)
      }
      let item = document.querySelector("[data-e2e='feed-active-video']")
      if (item && configxgIcon[7].option) {
        findSkip(item)
      }
      if (!item && configxgIcon[2].option) {
        skip("直播", document.querySelector("[data-e2e='feed-live'] .Nu66P_ba")?.innerText)
      }
    })
    document.onmouseover = (e) => {
      if (e.target.classList.contains("xgplayer-controls") || e.target.classList.contains("progress-list")) {
        let target = document.querySelector('[data-e2e="feed-active-video"] .xgplayer-controls')
        let bottomItem = target?.querySelector(".xg-inner-controls.xg-pos")
        let copywriting = document.querySelector('[data-e2e="feed-active-video"] .tSXOCvQc')
        let personalData = document.querySelector('[data-e2e="feed-active-video"] .L1TH4HdO.positionBox')
        let bottomItemHeight = bottomItem?.offsetHeight
        if (personalData && !personalData.dataset.scale && personalData.style.transform) personalData.dataset.scale = personalData.style.transform
        if (!target || !configxgIcon[4].option) return
        requestAnimationFrame(() => {
          bottomItem.style.bottom = 0 + "px"
          copywriting.style.setProperty('bottom', `${bottomItemHeight}px`, 'important')
          personalData.style.setProperty('bottom', `${bottomItemHeight}px`, 'important')
          if (personalData.dataset.scale) personalData.style.transform = "scale(1)"
        })
        target.onmouseover = () => {
          clearTimeout(bottomItem.dataset.time)
        }
        target.onmouseleave = () => {
          clearTimeout(bottomItem.dataset.time)
          if (configxgIcon[4].option) {
            bottomItem.dataset.time = setTimeout(() => {
              requestAnimationFrame(() => {
                bottomItem.style.bottom = -bottomItemHeight + "px"
                copywriting.style.setProperty('bottom', `6px`, 'important')
                personalData.style.setProperty('bottom', `6px`, 'important')
                if (personalData.dataset.scale) personalData.style.transform = personalData.dataset.scale
              })
            }, 1000);
          }
        }
      }
    }

    let observer = new MutationObserver((e) => {
      e.forEach((i) => {
        if (i.addedNodes.length > 0 && i.addedNodes[0].className) {
          let getClass = i.addedNodes[0].classList[0]
          if (getClass != undefined) {
            if (getClass == "OFZHdvpl" && document.querySelector('[data-e2e="feed-active-video"] ._QjzkgP3.Vw_S4MTA.isDark') != null && configxgIcon[1].option) {
              let commentsOff = document.querySelector('[data-e2e="feed-active-video"] ._QjzkgP3.Vw_S4MTA.isDark.z_zS3jcn.dLCldFlr') || document.querySelector('[data-e2e="feed-active-video"] .aDQw7OWI._628BWQES.JFWzESlW.LookModalFrameFast')
              if (commentsOff) setTimeout(() => { i.addedNodes[0].querySelector(".pBxTZJeH.Qz1xVpFH.aLzJ7lUV").click() }, 200);
            }
            if (getClass == "gear") {
              let clear = i.addedNodes[0].querySelectorAll(".virtual .item")
              if (clear[0] != null && clear[0].classList.length <= 1 && clear[0].querySelectorAll("span")[1] == undefined) {
                clear[0].click()
              }
              if (clear[0].querySelectorAll("span")[1] != undefined && clear[2].classList.length <= 1) {
                clear[2].click()
              }
              if (document.querySelector("[data-e2e='feed-active-video']") && !document.querySelector("[data-e2e='feed-active-video'] [data-peizhi]")) {
                let config = document.querySelector("[data-e2e='feed-active-video'] .xg-right-grid")
                let xgIcon = document.createElement("xg-icon")
                xgIcon.className = "xgplayer-autoplay-setting automatic-continuous"
                xgIcon.dataset.index = 99
                xgIcon.innerHTML = `<div class="xgplayer-icon" data-e2e="video-player-auto-play" data-e2e-state="video-player-auto-playing"><div class="xgplayer-setting-label"><span class="xg-switch-inner"></span></button><span class="xgplayer-setting-title" data-peizhi>配置</span></div></div><div class="xgTips">

    </div>`
                for (const item of configxgIcon) {
                  let icon = `<div class="xgplayer-icon" data-e2e="video-player-auto-play" data-e2e-state="video-player-auto-playing"><div class="xgplayer-setting-label"><button data-type="${item.type}" aria-checked="${item.option}" class="${item.option ? "xg-switch-checked" : ""} xg-switch" aria-labelledby="xg-switch-pip" type="button"><span class="xg-switch-inner"></span></button><span class="xgplayer-setting-title">${item.name}</span></div></div>`
                  let range = document.createRange()
                  let iconitem = range.createContextualFragment(icon)
                  let button = iconitem.querySelector("button");
                  let xgTips = xgIcon.querySelector(".xgTips")
                  xgTips.style.display = "none"
                  xgTips.style.visibility = "visible"
                  xgTips.style.bottom = 31 + "px"
                  button.onclick = () => {
                    if (item.option == true) {
                      item.option = false
                      button.classList.remove("xg-switch-checked")
                      button.setAttribute("aria-checked", "false")
                      localStorage.setItem("xg-icon", JSON.stringify(configxgIcon))
                    } else {
                      item.option = true
                      button.classList.add("xg-switch-checked")
                      button.setAttribute("aria-checked", "true")
                      localStorage.setItem("xg-icon", JSON.stringify(configxgIcon))
                    }
                  }
                  xgIcon.onmouseover = () => {
                    xgTips.style.display = "block"
                  }
                  xgIcon.onmouseleave = () => {
                    xgTips.style.display = "none"
                  }
                  xgTips.onclick = (e) => {
                    e.stopPropagation()
                    let item = e.target
                    if (item.nodeName == "BUTTON") {
                      if (item.dataset.type == "filter") {
                        if (item.ariaChecked == "true") {
                          listModule.style.display = "block"
                          setTimeout(() => { listModule.style.opacity = "1" }, 50);
                        }
                      }
                      addStyle(item.dataset.type, item.ariaChecked)
                    }
                  }
                  xgTips.appendChild(iconitem)
                }
                config?.appendChild(xgIcon)
              }
            }
          }
        }
      })
    })
    observer.observe(document, { childList: true, subtree: true })
    //广告
    let body;
    let time;
    let VideoNumber = []
    let bodyTime

    let geteStyle = document.createElement("style")
    geteStyle.innerText = `
    * { margin: 0; padding: 0; } body { background-color: #252526; } input { text-decoration: none; border: none; outline: none; } li { list-style: none; } .listModule {backdrop-filter: blur(40px); box-sizing: border-box; position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto; width: 800px; height: 500px; background-color: rgba(255,255,255,.2); opacity: 0; border-radius: 25px; padding: 25px 10px 0px; transition: all .3s; display: none; } .userInput { display: flex; justify-content: space-evenly; align-items: center; text-align: center; } .userInput .content { position: relative; background-color: rgba(0,0,0,.2); width: 600px; height: 35px; font-size: 20px; font-weight: 400; border-radius: 25px; text-align: center; } .choice, .confirm { cursor: pointer; flex:1; } .option {position: relative; width: 130px; top: -34px; left: -5px; text-align: center; padding-top: 38px; display: none; } .option li { padding: 7px 5px; font-size: 13px; cursor: pointer; border-radius: 5px; width: 100px; } .option li:hover, .selected { background-color: rgba(211, 211, 212,.5); } .list { width: 600px; margin: 20px auto; } .list div { display: none; padding:5px; border-radius: 20px; } .list span { display: inline-block; cursor: pointer; padding: 8px; margin: 3px; background-color: rgba(164, 198, 239,.2); font-size: 13px; border-radius: 5px; } .list span:hover { background-color: #235eac; color: #fff; }
      [data-e2e='feed-active-video'] .slider-video .xgplayer-controls{display:block !important}
      [id='sliderVideo'] .xgplayer-controls{display:none !important}
      .xg-video-container{transition:all .3s}
      .video-info-detail.wallpaperTitle{padding-bottom:16px !important}
      .xg-right-grid{z-index:9999 !important}
      .login-mask-enter-done{display:none !important}
      .xJM6xOS5{display:none !important}
      .Xu8BXy_K{display:none}
      #douyin-sidebar{display:none}
      .N7WC10t2.R0e9n3hS{display:none}
      .C0PKXv0T.vVKvTOe_{display:none}
      .XOS1zQWA{display:none}
      .cjPSLdOm{display:none}
      ._m_Gkwgz{display:none}
      .TGDaOxiI.isDark{display:none}
      .nH4jBlTd.wallPaperBtn{display:none}
      .L1TH4HdO .xgplayer-playswitch{display:none}
      .JsAsIOEV{display:none}
      `

    function Tips(tipsText) {
      let RootVideo = document.querySelector(".YwClj8rK.fullscreen_capture_feedback")
      let TipsBox = document.createElement("div")
      TipsBox.style = ` position: absolute; left: 0; right: 0; bottom: 90px; margin: 0 auto; text-align: center; width: 300px; height: 30px; line-height: 30px; background-color: rgba(255,255,255,.2); backdrop-filter:blur(40px); border-radius:25px; cursor: pointer; z-index: 99999999999999999999999999; opacity:.9; transition: all .3s
 `
      TipsBox.innerText = tipsText
      RootVideo.appendChild(TipsBox)
      setTimeout(() => { TipsBox.style.opacity = 0 }, 500);
      setTimeout(() => { TipsBox.remove() }, 1000);
    }

    function skip(item, index) {
      if (configxgIcon[6].option && VideoNumber.includes(index)) return
      if (VideoNumber.length > 20) VideoNumber = []
      if (index && !VideoNumber.includes(index)) VideoNumber.push(index)
      let videos = document.querySelector("[data-e2e='feed-active-video'] .slider-video")
      let comment = document.querySelector("[data-e2e='feed-active-video'] #videoSideBar")
      let zhibonode = document.querySelector("[data-e2e='feed-live'] video")
      if (videos) {
        videos.style.display = "none"
        setTimeout(() => { if (videos.querySelector("video")) videos.querySelector("video").pause() }, 150)
      }
      if (comment) {
        comment.style.display = "none"
      }
      if (zhibonode && zhibonode.style.display == "") {
        zhibonode.style.display = "none"
        setTimeout(() => { zhibonode.pause() }, 150)
      }
      if (configxgIcon[5].option) {
        Tips(item = "已为您跳过了" + item)
      }
      time = setInterval(function () {
        next.click()
      }, 1);
    }



    ajaxHooker.hook(request => {
      if (request.url.includes("/aweme/v1/web/tab/feed")) {
        request.response = res => {
          let stringRes = JSON.parse(res.responseText)
          let list = stringRes.aweme_list
          if (list && configxgIcon[7].option) {
            try {
              if (KeywordFiltering.find(i => i.name == "标签")?.data.includes("广告")) list = list.filter(i => !i?.is_ads)
              if (KeywordFiltering.find(i => i.name == "标签")?.data.includes("图文")) list = list.filter(i => !i?.images)
              if (KeywordFiltering.find(i => i.name == "标签")?.data.includes("购物")) list = list.filter(i => i?.anchor_info?.title_tag != "购物")
              if (KeywordFiltering.find(i => i.name == "标签")?.data.includes("直播") || configxgIcon[2].option) list = list.filter(i => !i.cell_room)
              if (KeywordFiltering.filter(i => i.data && i.name != "名字").find(i => i.data?.includes("集"))) list = list.filter(i => !i?.mix_info?.statis?.current_episode)
              if (findArrays("时间").time < 999) list = list.filter(i => !i.create_time || (i.create_time && searchTime(i.create_time) < findArrays("时间").time))
              list = list.filter(i => !KeywordFiltering.find(i => i.name == "名字")?.data.filter(item => i.author?.nickname?.includes(item)).length)
              list = list.filter(i => !KeywordFiltering.find(i => i.name == "文案")?.data.filter(item => i.desc?.includes(item)).length)
              list = list.filter(i => !KeywordFiltering.find(i => i.name == "全选")?.data.filter(item => i.author?.nickname?.includes(item) || i.desc?.includes(item)).length);
            } catch (e) {
              console.log(e);
            }
          }
          stringRes.aweme_list = list
          res.responseText = JSON.stringify(stringRes)
        };
      }
    });

    function searchTime(oldTime) {
      oldTime = Number(oldTime)
      let time = Math.round(new Date() / 1000)
      let timeInterval = (time - oldTime) / 60 / 60 / 24
      return timeInterval
    }
    function findArrays(name) {
      return KeywordFiltering.find(item => item.name == name)
    }



    function findSkip(item, sum = 0) {
      sum++
      let username = item.querySelector(".Nu66P_ba")?.innerText
      let Copywriting = item.querySelector(".UCT89JiM")?.innerText
      let tagAll = item.querySelector(".tSXOCvQc")?.innerText
      let selectallData = [username, Copywriting]
      let user = KeywordFiltering.find(item => item.class == "username")?.data.filter(item => username?.includes(item))
      let copy = KeywordFiltering.find(item => item.class == "Copywriting")?.data.filter(item => Copywriting?.includes(item))
      let selectall = KeywordFiltering.find(item => item.class == "selectall")?.data.find(item => selectallData.find(subkey => subkey?.includes(item)))
      tagAll = KeywordFiltering.find(item => item.class == "Tag")?.data.filter(item => tagAll?.includes(item))
      let findContent = tagAll[0] || user[0] || copy[0] || selectall
      if (!username && !findContent && sum < 400) {
        setTimeout(() => { findSkip(item, sum) }, 1)
        return
      }
      if (findContent) {
        skip(`"${findContent}"`, item.dataset.e2eVid)
      }
    }

    bodyTime = setInterval(() => {
      body = document.querySelector(".u0N5WOYm.Srjrb_Q0") || document.querySelector(".swiper-wrapper")
      next = document.querySelectorAll(".xgplayer-playswitch-next")[0]
      if (!body || !next) return
      clearInterval(bodyTime)
      let observers = new MutationObserver((e) => {
        e.forEach((i) => {
          if (i.target.attributes[0].nodeValue == 'feed-active-video') {
            clearInterval(time)
            let gouwu = i.target.querySelector(".tSXOCvQc .xgplayer-shop-anchor")
            if (gouwu && gouwu.innerText.includes("剪映")) {
              gouwu.style.display = "none"
            }
            setTimeout(() => {
              let comment = i.target.querySelectorAll('.C4qWeq9o.sOcxqrD7 div')[1]
              if (comment) { comment.click() }
            }, 300)
            if (configxgIcon[7].option) {
              findSkip(i.target)
            }
          }
          if (!document.querySelector("[data-e2e='feed-active-video']") && configxgIcon[2].option) {
            clearInterval(time)
            skip("直播", document.querySelector("[data-e2e='feed-live'] .Nu66P_ba")?.innerText)
          }
        })
      })
      observers.observe(body, { attributeOldValue: true, attributes: true, subtree: true, attributeFilter: ['data-e2e'] })
    }, 10);


  }
  if (url == "live.douyin.com" && window.location.href != "https://live.douyin.com/") {
    let style = document.createElement("style")
    style.innerText = `
    #douyin-sidebar{display:none !important}
    .aqK_4_5U{display:none !important}
    .XKA9dwzm{display:none !important}
    .q4OfieDg{display:none !important}
    .C3RZrxtJ{display:none !important}
    [data-index="15"]{display:none !important}
    [data-index="30"]{display:none !important}
    .xgplayer-danmu.danmu .ZUGMpBcb{display:none !important}
    .webcast-chatroom___item:has(> .TNg5meqw .tbZ6dkVE){display:none !important}
    .MXPhrGwK{height: 87vh !important}
    ._uuQkdQj.BU1qePtl{padding-top:0 !important}
    .webcast-chatroom__room-message{display:none !important}
    `
    let config = [
      { name: "弹幕", option: true },
      { name: "特效", option: true },
    ]
    if (!localStorage.getItem("xg-icon")) {
      localStorage.setItem("xg-icon", JSON.stringify(config))
    }
    else if (JSON.parse(localStorage.getItem("xg-icon")).length === config.length) {
      config = JSON.parse(localStorage.getItem("xg-icon"));
    } else {
      localStorage.setItem("xg-icon", JSON.stringify(config))
    }

    let div = document.createElement("xg-icon")
    div.innerHTML =
      `
      <div class="xg-tips" style="bottom: 100%;">

     </div>
     <div class="xgplayer-icon" style="position: relative;top: 16px;">配置</div>
     `
    let boss = div.querySelector(".xg-tips")
    for (const item of config) {
      let label = document.createElement("label")
      let input = document.createElement("input")
      let span = document.createElement("span")
      input.type = "checkbox"
      input.checked = item.option
      span.innerText = item.name
      label.appendChild(input)
      label.appendChild(span)
      boss.appendChild(label)
      label.onclick = function (e) {
        if (e.target.tagName !== "INPUT") return
        item.option = input.checked
        localStorage.setItem("xg-icon", JSON.stringify(config))
        window.location.reload()
      }
    }

    let elementConfig = {
      "head": (item) => {
        item.appendChild(style)
      },
      ".xg-right-grid [data-index='0.5'] div": (item) => {
        item?.querySelectorAll("div")[1].click()
      },
      ".xg-right-grid .danmu-icon": (item) => {
        if (config[0].option) item.click()
      },
      ".xg-right-grid [data-index='1'][classname='sLHkIpHN'] div": (item) => {
        let bottom = document.querySelector(".xgplayer-controls.control_autohide.xgplayer-controls-initshow .xg-right-grid")
        bottom.appendChild(div)
        if (config[1].option) item?.querySelectorAll("div")[1].click()
      },
      ".xg-right-grid [data-index='12'].sLHkIpHN div": (item) => {
        item?.querySelectorAll(".NsCkThfl")[0].click()
      },
      ".dy-account-close": (item) => {
        item?.click()
      },
      ".LO5TGkc0": (item) => {
        let time;
        item.onmousemove = function () {
          clearInterval(time)
          item.style.cursor = 'auto'
          time = setInterval(function () {
            item.style.cursor = 'none'
          }, 2000)
        }
      }
    }

    function call(config) {
      let delayTime = 300
      let TerminationTime = 20 * 1000
      let sum = 0
      function checkElement(key, sum) {
        sum += delayTime
        if (sum > TerminationTime) return
        let item = document.querySelector(key)
        if (item) config[key](item)
        else { setTimeout(() => { checkElement(key, sum) }, delayTime) }
      }
      for (const key in config) {
        setTimeout(() => { checkElement(key, sum) }, delayTime)
      }
    }
    call(elementConfig)
  }
})();