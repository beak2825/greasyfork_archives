// ==UserScript==
// @name         国家中小学智慧教育平台刷课脚本
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @license      CC BY-NC-SA
// @description  16倍速，自动答题，自动切换列表中的视频，后台播放，学时不更新的解决方法看下面
// @author       Hui
// @match        https://basic.smartedu.cn/teacherTraining/*
// @match        https://*.zxx.edu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469803/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469803/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    ("use strict");
    const xljkUrlList = [
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=52437a43-1e09-43cf-b7af-2beb4f96baca&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=9ca7b73a-9386-4b58-9cf9-4e452b86b47f&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=8cf90221-98c8-416f-b819-ce271b946922&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=ea4a8bdb-6819-47af-bfc2-233933bb5049&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=1238d399-6ea6-4d5c-b010-4d469b3f9d2c&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=2f22d9c1-2510-4db1-81e2-152e94f45b00&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=f97c5ef3-4163-4551-bbe6-c2282de8002e&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=03ce293f-ce99-4905-8088-62d3efd1415f&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=9c50d48e-b997-4371-bfde-c9ef9da36006&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=b13aa14e-29e0-48fd-be51-aa32f343095a&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=6e00246a-4264-4e7f-a4ba-67150cebdc97&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=3b785768-a164-4346-af41-f7edb7ba9d02&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=98b8ea15-c39c-4ab0-9c90-89cc16ea345e&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=0b8c7836-3b5a-47f9-b6f2-6a57d9208148&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=81e12411-afee-47e3-9567-fc5dd17c3ac7&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=9099c3ad-9643-476e-b74f-8dede233ea88&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=c0234602-7ba1-4c9f-b409-39d15732a1d2&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=25928aa1-3029-4442-814a-2e73123e409c&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=c29ac9f3-dc69-4ad2-8629-92bbdd3b9cf7&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
        "https://www.zxx.edu.cn/teacherTraining/courseDetail?courseId=64f2dcad-6020-4be6-a150-eb3bfa9d0de8&tag=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD",
    ];
    const xljkUrlTag =
          "%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD";
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
            groups = document.getElementsByClassName("fish-collapse-item");
            //寻找最后一个打开的group(子group可能打开多个)
            //适配chrome版本低于97, firefox版本低于108的用户
            groupNo = findLastIndex([...groups], (item) => {
                return item.className.includes("active");
            })

            var base = groupNo === -1 ? document : groups[groupNo];
            resItems = base.getElementsByClassName("resource-item");
            resNo = [...resItems].findIndex((item) => {
                return item.className.includes("active");
            });
            return State.SwitchSource
        },
        switchSource: () => {
            //视频修改为标清 zxj663建议添加
            let sped = document.querySelector(
                "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > span"
            );
            if (sped && sped.innerText != "标清") {
                document
                    .querySelector(
                    "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > div > ul > li:nth-child(2) > span.vjs-menu-item-text"
                )
                    .click();
            }
            return State.PlayVideo
        },
        playVideo: () => {
            let icons = resItems[resNo].getElementsByClassName("iconfont");
            if (icons[1] && icons[1].className.includes("icon_checkbox_fill")) {
                console.log(666, `第${groupNo + 1}组, 第${resNo + 1}个视频已经观看`);
                return State.SwitchActive
            }

            console.log(666, `开始观看: 第${resNo + 1}个视频，第${groupNo + 1}组`);
            var video = document.getElementsByTagName("video")[0];
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
            video.addEventListener("ended", () => setTimeout(state = State.SwitchActive, false,5000))
            return State.HandlePlayRes
        },
        handlePlayRes: () => {
            //处理播放的结果
            return videoErr === undefined ? State.HandlePlayRes : videoErr ? State.PlayVideo : State.WaitPlay
        },
        waitPlay: () => { return State.WaitPlay },
        switchActive: () => {
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
                document.getElementsByClassName("fish-collapse-header")[groupNo].click();
                return State.SwitchFirst
            }
            //如果都看完了
            var urlList = [];
            //是心理健康教育培训
            if (location.href.includes(xljkUrlTag)) {
                urlList = [...xljkUrlList];
            }
            var curUrl = urlList.indexOf(location.href);
            if (curUrl + 1 == urlList.length) {
                console.log(666, "看完了所有学习页面，退出");
                return State.TaskEnd;

            } else if (curUrl != -1) {
                console.log(666, "进入下一个学习页面");
                window.open(urlList[curUrl + 1], "_self");
            }
        },
        switchFirst: () => {
            resItems = groups[groupNo].getElementsByClassName("resource-item");
            resNo = 0
            resItems[resNo].click();
            return State.SwitchSource
        },
        taskEnd: () => {
            return State.TaskEnd;
        }
    }

    const setPopupHandler = () => {
        //点击页面的题目和弹窗
        setInterval(() => {
            [".nqti-option", ".index-module_markerExercise_KM5bU .fish-btn", ".fish-modal-confirm-btns .fish-btn"].forEach(selector => {
                let dom = document.querySelector(selector)
                if (!!dom) {
                    dom.click()
                }
            })
            //增加填空题支持
            var inputForm = document.querySelector(".index-module_box_blt8G");
            if (!!inputForm) {
                changInputValue(inputForm.getElementsByTagName("input")[1], "&nbsp;");
            }
        }, 1000);
    };

    const setVideoHandler = () => {
        setInterval(() => {
            try {
                state = func_table[state]()
                console.log(666, `${state}已经完成!`)
                document.querySelector('video').playbackRate=16
                if (resNo!= resItems.length) {
                    resItems[resNo].click();
                    console.log(666, `点击当前组的下一个视频`);
                }
            }
            catch (err) {
                console.log(666, `${state}: ${err}`)
            }
        }, 1000)
    }

    //修改播放速度
    const changeRate = (rate, index) => {
        localStorage.setItem("active", `${index}`)
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
  let activeStr = localStorage.getItem("active")
  const rateMenu = [{ title: "1x", value: 1 }, { title: "4x", value: 4 }, { title: "8x", value: 8 }, { title: "12x", value: 12 }, { title: "16x", value: 16 }]
  let active = activeStr === null ? rateMenu.length - 1 : parseInt(activeStr)

  //下面开始运行脚本
  console.log(666, "开始执行脚本")
    setVideoHandler();
    setPopupHandler();
})();
