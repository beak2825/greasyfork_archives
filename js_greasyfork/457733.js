// ==UserScript==
// @name         国家中小学智慧教育平台刷课脚本（16倍速，自动答题，自动切换列表中的视频，后台播放，学时不更新的解决方法看下面）
// @namespace    http://tampermonkey.net/
// @version      3.3.2
// @license      CC BY-NC-SA
// @description  针对2023暑期教师研修更新，16倍速，自动答题，自动切换列表中的视频，后台播放，学时不更新的解决方法看下面
// @author       HGGshiwo
// @match        https://*.zxx.edu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457733/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%8816%E5%80%8D%E9%80%9F%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%97%E8%A1%A8%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%EF%BC%8C%E5%AD%A6%E6%97%B6%E4%B8%8D%E6%9B%B4%E6%96%B0%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%E7%9C%8B%E4%B8%8B%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457733/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%8816%E5%80%8D%E9%80%9F%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%88%97%E8%A1%A8%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%EF%BC%8C%E5%AD%A6%E6%97%B6%E4%B8%8D%E6%9B%B4%E6%96%B0%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%E7%9C%8B%E4%B8%8B%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const courses = [
    { course_id: '08e005b6-442f-40d0-bf5d-ac3ed35feaeb', resNo: 1, groupNo: 2 },
    { course_id: '1a11eeee-8d43-4d3b-8818-1b842a0ee966', resNo: 1, groupNo: 1 },
    { course_id: '47678428-4c27-4526-a8cf-15fb65138617', resNo: 1, groupNo: 1 }
  ]
  // function
  const changInputValue = (inputDom, newText) => {
    if (!inputDom) {
      return;
    }
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event("input", { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
  };

  function findLastIndex(array, predicate) {
    // 先将数组反转
    const reversedArray = array.slice().reverse();
    // 使用findIndex找到满足条件的元素的索引
    const index = reversedArray.findIndex(predicate);
    if (index === -1) {
      return -1; // 若未找到，则直接返回-1
    }
    // 计算满足条件的元素在原数组中的索引
    const originalIndex = array.length - 1 - index;
    return originalIndex;
  }

  const State = {
    LoadPage: "loadPage",
    GetActive: "getActive",
    SwitchSource: "switchSource",
    PlayVideo: "playVideo",
    HandlePlayRes: "handlePlayRes",
    WaitPlay: "waitPlay",
    SwitchActive: "switchActive",
    SwitchFirst: "switchFirst",
    TaskEnd: "taskEnd",
  }

  var state = State.LoadPage;
  var groups = undefined;
  var groupNo = undefined;
  var resItems = undefined;
  var resNo = undefined;
  var videoErr = undefined;
  var interval = undefined;

  const func_table = {
    loadPage: () => {
      var video = document.querySelector("video");
      var resItems = document.querySelector(".resource-item");
      if (!!video && !!resItems) {
        return State.GetActive
      }
      else {
        console.log(666, "等待视频加载")
        return State.LoadPage
      }
    },
    getActive: () => {
      groups = document.querySelector(".fish-collapse.fish-collapse-icon-position-right.tcourse-catalog.undefined").childNodes
      //适配chrome版本低于97, firefox版本低于108的用户
      groupNo = findLastIndex([...groups], group => {
        resItems = [...group.querySelectorAll(".resource-item")]
        resNo = resItems.findIndex(resItem => resItem.className.includes("active"))
        return resNo !== -1
      })
      return State.SwitchSource
    },
    switchSource: () => {
      //视频修改为标清 zxj663建议添加
      let sped = document.querySelector(
        "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > span"
      );
      if(!sped) {
         return State.SwitchSource
      }
      if (sped.innerText != "标清") {
        document
          .querySelector(
            "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > div > ul > li:nth-child(3) > span.vjs-menu-item-text"
          )
          .click();
      }
      return State.PlayVideo
    },
    playVideo: () => {
      let icons = resItems[resNo].getElementsByClassName("iconfont");
      if (icons[0] && icons[0].className.includes("icon_checkbox_fill")) {
        console.log(666, `第${groupNo + 1}组, 第${resNo + 1}个视频已经观看`);
        return State.SwitchActive
      }

      console.log(666, `开始观看: 第${resNo + 1}个视频，第${groupNo + 1}组`);
      var video = document.querySelector("video");
      if (!!video) {
        video.muted = true;
        video.play().then(() => {
          videoErr = false
        }).catch((err) => {
          console.log(666, err);
          videoErr = true
        });
        renderMenu()
        video.playbackRate = rateMenu[active].value;
        video.addEventListener("pause", () => state = State.PlayVideo, false)
        video.addEventListener("ended", () => state = State.SwitchActive, false)
        return State.HandlePlayRes
      }
      else {//是pdf，直接跳下一个
        return State.SwitchActive
      }
    },
    handlePlayRes: () => {
      //处理播放的结果
      return videoErr === undefined ? State.HandlePlayRes : videoErr ? State.PlayVideo : State.WaitPlay
    },
    waitPlay: () => { return state },
    switchActive: () => {
      //从列表中查找当前的课程
      const index = courses.findIndex(course => window.location.href.includes(course.course_id))
      if (index !== -1 && (courses[index].groupNo < groupNo || (courses[index].groupNo == groupNo && courses[index].resNo <= resNo))) {
        if (index + 1 < courses.length) {
          console.log(666, "进入下一个学习页面");
          window.open(`https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=${courses[index + 1].course_id}`, "_self");
        }
        else {
          return State.TaskEnd
        }
      }

      //如果没看完当前组，则观看当前组的下一个视频
      if (resNo + 1 != resItems.length) {
        resNo += 1
        resItems[resNo].click();
        console.log(666, `点击当前组的下一个视频`);
        return State.SwitchSource;
      }

      //如果看完了当前组，没看完当前页面，则看下一个页面
      if (groupNo + 1 != groups.length) {
        console.log(666, `点击下一组的第一个视频`);
        groupNo += 1
        let header = groups[groupNo].querySelector(".fish-collapse-header")
        if (!!header) {
          header.click()
        }
        return State.SwitchFirst
      }
      //如果都看完了
      return State.TaskEnd
    },
    switchFirst: () => {
      resItems = groups[groupNo].getElementsByClassName("resource-item");
      resNo = 0
      resItems[resNo].click();
      return State.SwitchSource
    },
    taskEnd: () => {
      if(!!interval) {
        clearInterval(interval)
      }
      window.alert("都看完了")
      return State.TaskEnd;
    }
  }

  const setVideoHandler = () => {
    interval = setInterval(() => {
      try {
        var popup = false;
        [".nqti-option", ".index-module_markerExercise_KM5bU .fish-btn", ".fish-modal-confirm-btns .fish-btn"].forEach(selector => {
          let dom = document.querySelector(selector)
          if (!!dom) {
            popup = true
            dom.click()
          }
        })
        //增加填空题支持
        var inputForm = document.querySelector(".index-module_box_blt8G");
        if (!!inputForm) {
          popup = true
          changInputValue(inputForm.getElementsByTagName("input")[1], "&nbsp;");
        }
        if (!popup) {
          state = func_table[state]()
          console.log(666, `${state}已经完成!`)
        }
        else {
          console.log(666, "处理弹窗")
        }
      }
      catch (err) {
        console.log(666, `${state}: ${err}`)
      }
    }, 1000)
  }

  //修改播放速度
  const changeRate = (rate, index) => {
    localStorage.setItem("_active", `${index}`)
    active = index
    document.querySelector(".vjs-playback-rate-value").innerHTML = rateMenu[index].title
    document.getElementsByTagName("video")[0].playbackRate = rate
    return false
  }

  //修改速度菜单
  const renderMenu = () => {
    document.querySelector(".vjs-playback-rate .vjs-menu-content").innerHTML =
      rateMenu.map((rate, index) =>
        `<li class="vjs-menu-item" tabindex="-1" role="menuitemradio" aria-disabled="false" aria-checked="${index == active}">
          <span class="vjs-menu-item-text">${rate.title}</span>
          <span class="vjs-control-text" aria-live="polite"></span>
        </li>`
      ).join(" ")
    const doms = document.querySelectorAll(".vjs-playback-rate .vjs-menu-content .vjs-menu-item")
    rateMenu.forEach((rate, index) => {
      doms[index].addEventListener("click", () => changeRate(rate.value, index), false)
    })

    //显示速度控制菜单
    const rateButtons = document.getElementsByClassName("vjs-playback-rate vjs-menu-button vjs-menu-button-popup vjs-control vjs-button vjs-hidden")
    if (rateButtons.length > 0) {
      rateButtons[0].classList.remove("vjs-hidden")
      document.querySelector(".vjs-playback-rate-value").innerHTML = rateMenu[active].title
    }
  }

  //获取速度
  let activeStr = localStorage.getItem("_active")
  const rateMenu = [{ title: "1x", value: 1 }, { title: "1.5x", value: 1.5 }, { title: "2x", value: 2 }, { title: "2.5x", value: 2.5 }, { title: "8x", value: 8 }]
  let active = activeStr === null ? 0 : parseInt(activeStr)

  //下面开始运行脚本
  console.log(666, "开始执行脚本")
  setVideoHandler();
})();
