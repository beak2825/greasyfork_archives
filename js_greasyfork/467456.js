// ==UserScript==
// @name         国家中小学智慧教育平台刷课脚本(木木修改版)
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @license      MIT
// @description  16倍速，自动答题，自动切换列表中的视频，后台播放，学时不更新的解决方法看下面
// @author       木木（基于HGGshiwo）
// @match        https://basic.smartedu.cn/teacherTraining/courseIndex?courseId*
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/training*
// @match        https://basic.smartedu.cn/*/courseDetail*
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA1LTMwVDEzOjA5OjUzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNS0zMFQxMzoxMTowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNS0zMFQxMzoxMTowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NTEzNWUzZS0zNmNkLWJm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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467456/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E6%9C%A8%E6%9C%A8%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467456/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%28%E6%9C%A8%E6%9C%A8%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    ("use strict");

    // function
    const sleep = async (time) => {
        var p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
        return p;
    };

    const waitLoading = async () => {
        var resItems = document.getElementsByClassName("resource-item");
        var video = document.getElementsByTagName("video");
        if (resItems.length === 0 || video.length === 0) {
            console.log(666, "视频没有加载完成，等待1s");
            await sleep(1000);
            return waitLoading();
        } else {
            return sleep(1000);
        }
    };

    const changInputValue = (inputDom, newText) => {
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event("input", {bubbles: true});
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    };

    const getActiveVideoAndPlay = async () => {
        //获取当前的页面活跃的视频并且播放
        await waitLoading();

        renderMenu();
        //获取当前视频位置
        var groups = document.getElementsByClassName("fish-collapse-item");
        //寻找最后一个打开的group(子group可能打开多个)
        var groupNo = undefined;
        if (![...groups].findLastIndex) {
            //适配chrome版本低于97, firefox版本低于108的用户
            groupNo = [...groups].reverse().findIndex((item) => {
                return item.className.includes("active");
            });
        } else {
            groupNo = [...groups].findLastIndex((item) => {
                return item.className.includes("active");
            });
        }

        var base = groupNo === -1 ? document : groups[groupNo];
        var resItems = base.getElementsByClassName("resource-item");
        var resNo = [...resItems].findIndex((item) => {
            return item.className.includes("active");
        });

        //计算下一个视频的位置
        const toNextVideo = async () => {
            if (resNo + 1 === resItems.length) {
                //看完了当前组
                if (groupNo + 1 === groups.length) {
                    /*var urlList = [];
                    var curUrl = urlList.indexOf(location.href);
                    if (curUrl + 1 === urlList.length) {
                        console.log(666, "看完了所有学习页面，退出");
                    } else if (curUrl !== -1) {
                        console.log(666, "进入下一个学习页面");
                        window.open(urlList[curUrl + 1], "_self");
                    }*/
                    const dhl = document.getElementsByClassName("fish-breadcrumb breadcrumb-container");
                    if (dhl.length > 0) {
                        localStorage.setItem("curClass", dhl[0].children[3].children[0].innerText);
                        dhl[0].children[2].children[0].click();
                        window.close();
                    }
                } else {
                    //观看下一组
                    console.log(666, `点击下一组的第一个视频`);
                    document.getElementsByClassName("fish-collapse-header")[groupNo + 1].click();
                    await sleep(1000);
                    resItems = groups[groupNo + 1].getElementsByClassName("resource-item");
                    resItems[0].click();
                    getActiveVideoAndPlay();
                }
            } else {
                //观看当前组的下一个视频
                resItems[resNo + 1].click();
                console.log(666, `点击当前组的下一个视频`);
                getActiveVideoAndPlay();
            }
        };

        //保证看完的不再看
        let icons = resItems[resNo].getElementsByClassName("iconfont");
        if (icons[1] && icons[1].className.includes("icon_checkbox_fill")) {
            console.log(666, `第${groupNo + 1}, 第${resNo + 1}个视频已经观看`);
            await toNextVideo();
            return;
        }

        console.log(666, `开始观看: 第${resNo + 1}个视频，第${groupNo + 1}组`);
        try {
            // //视频修改为标清 zxj663建议添加
            let sped = document.querySelector("div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > span");

            if (sped && sped.innerText !== "标清") {
                document
                    .querySelector("div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > div > ul > li:nth-child(2) > span.vjs-menu-item-text")
                    .click();
            }
            console.log(666, "完成切换src");
            await sleep(1000);
            var video = document.getElementsByTagName("video")[0];
            video.muted = true;
            video.play().catch((err) => {
                console.log(666, err);
                location.reload(); //视频播放出错，刷新页面
            });
            video.playbackRate = rateMenu[active].value;
            video.addEventListener("ended", async () => {
                await sleep(1000);
                //计算下一个视频的位置
                toNextVideo();
            }, false);
            video.addEventListener("pause", async () => {
                //因为页面隐藏而暂停，则直接播放
                if (document.hidden) {
                    video.play().catch((err) => {
                        console.log(666, err); //视频播放出错，刷新页面
                        location.reload();
                    });

                }
            });
        } catch (e) {
            console.log(666, e);
            getActiveVideoAndPlay(); //获取不到视频，再次调用
        }
    };

    const setPageHandler = () => {
        //点击页面的题目和弹窗
        setInterval(() => {
            var options = document.getElementsByClassName("nqti-option");
            if (options.length) {
                options[0].click();
            }
            var btnWapper = document.getElementsByClassName("index-module_markerExercise_KM5bU");
            if (btnWapper.length) {
                var btns = btnWapper[0].getElementsByClassName("fish-btn");
                if (btns.length) {
                    btns[0].click();
                }
            }
            var confirmBtns = document.getElementsByClassName("fish-modal-confirm-btns");
            if (confirmBtns.length) {
                confirmBtns[0].getElementsByClassName("fish-btn")[0].click();
            }

            //增加填空题支持
            var inputForms = document.getElementsByClassName("index-module_box_blt8G");
            if (inputForms.length !== 0) {
                changInputValue(inputForms[0].getElementsByTagName("input")[1], "&nbsp;");
            }
        }, 1000);
    };

    //修改播放速度
    const changeRate = (rate, index) => {
        localStorage.setItem("active", `${index}`)
        active = index
        document.getElementsByTagName("video")[0].playbackRate = rate
        return false
    }

    //修改速度菜单
    const renderMenu = () => {
        const rate = document.querySelector(".vjs-playback-rate .vjs-menu-content");
        rate.parentElement.parentElement.className = rate.parentElement.parentElement.className.replace(" vjs-hidden", "");
        rate.innerHTML = rateMenu.map((rate, index) => `<li class="vjs-menu-item" tabindex="-1" role="menuitemradio" aria-disabled="false" aria-checked="${index === active}">
        <span class="vjs-menu-item-text">${rate.title}</span>
        <span class="vjs-control-text" aria-live="polite"></span>
      </li>`).join(" ")
        const doms = document.querySelectorAll(".vjs-playback-rate .vjs-menu-content .vjs-menu-item")
        rateMenu.forEach((rate, index) => {
            doms[index].addEventListener("click", () => changeRate(rate.value, index), false)
        })
    }

    //获取速度
    let activeStr = localStorage.getItem("active");
    const rateMenu =
        [{title: "1x", value: 1},
            {title: "4x", value: 4},
            {title: "8x", value: 8},
            {title: "12x", value: 12},
            {title: "16x", value: 16}]
    let active = activeStr === null ? 0 : parseInt(activeStr);

    //下面开始运行脚本
    console.log(666, "开始执行脚本");
    const waitClsLoading = async (clsName) => {
        const clsItems = document.getElementsByClassName(clsName);
        if (clsItems.length === 0) {
            console.log('木木', "课程链接未加载，等待1s");
            await sleep(1000);
            return waitClsLoading(clsName);
        } else {
            return sleep(1000);
        }
    };

    const nextCls = async ()=>{
        if (window.document.visibilityState !== 'visible') {
            return;
        }
        const url = window.location.href;
        if (url.startsWith("https://basic.smartedu.cn/training/")) {
            await waitClsLoading("index-module_title_8i8E6");
            const lastCls = localStorage.getItem("curClass");
            const clsList = document.getElementsByClassName("index-module_title_8i8E6");
            if (lastCls != null) {
                for (let i = 0; i < clsList.length; i++) {
                    if (clsList[i].innerText === lastCls) {
                        clsList[i + 1].click();
                        break;
                    }
                }
            } else {
                console.log("木木", "点击第一个课程。",clsList[0].innerText);
                clsList[0].parentElement.click();
                //window.close();
            }
        }
        else if (url.startsWith("https://basic.smartedu.cn/teacherTraining/courseIndex?courseId")) {
            await waitClsLoading("CourseIndex-module_course-btn_3Yy4j");
            document.getElementsByClassName("CourseIndex-module_course-btn_3Yy4j")[0].click();
        }
    }

    window.document.addEventListener('visibilitychange',nextCls);
    nextCls();
    setPageHandler();
    getActiveVideoAndPlay();

})();
