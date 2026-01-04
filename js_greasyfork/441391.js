// ==UserScript==
// @name         『华医网-帮帮客网课助手』
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  【2025】帮帮客平台荣耀推出系列高效工具，核心亮点「帮帮客程序版」，此次更新「BBK Local Preview」版，修复【好医生】考试问题。即刻体验，尽享前所未有的便捷与高效！详细功能及下载方式，敬请查阅介绍。
// @author       帮帮客
// @license      MIT
// @match        *://*.91huayi.com/*
// @match        *://*.yxlearning.com/*
// @match        *://*.cmechina.net/*
// @match        *://*.ghlearning.com/*
// @match        *://basic.smartedu.cn/teacherTraining*
// @match        *://*.zxx.edu.cn/teacherTraining/courseDetail*
// @match        *://*.qutjxjy.cn/*
// @match        *://*.hbysw.org/*
// @match        *://*.jxjyedu.org.cn/*
// @match        *://*.xjzyysxh.cn/*
// @match        *://*.mtnet.com.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @icon         https://mmbiz.qpic.cn/mmbiz_jpg/nc15h3nWHMVYP16HAuFe6PNJcic7mB6GFnNmk61LSHfH9ZPUoOWKnZiaaB9Jze8hCyrEYzIyicOzibs3e6ZIJTlcgw/640?wx_fmt=jpeg
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441391/%E3%80%8E%E5%8D%8E%E5%8C%BB%E7%BD%91-%E5%B8%AE%E5%B8%AE%E5%AE%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/441391/%E3%80%8E%E5%8D%8E%E5%8C%BB%E7%BD%91-%E5%B8%AE%E5%B8%AE%E5%AE%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%8F.meta.js
// ==/UserScript==

var myTimer;
function hnzj_gx() {//河南专技_公需
    if (document.querySelector(".item-box")) {
        try {
            for (var i = 0; i < document.querySelectorAll(".item-box").length; i++) {
                if (document.querySelectorAll(".sr-only")[i * 2].innerText != "100.0%") {
                    document.querySelectorAll(".item-box")[i].click();
                    break;
                }
            }
        } catch (error) {
            console.log("加载失败");
        }
        setTimeout(function () {
            alert("当前已选的所有课程均已完成！\n感谢您的使用");
            clearInterval(myTimer);
        }, 2000);
    }
    let jd = document.querySelector("#a span[du-html=sumschedule]");//获取视频进度
    if (jd) {
        if (!document.querySelector("#hnzjfz")) {
            document.querySelector("#defaultBtn > span.titlesname").insertAdjacentHTML('afterEnd', "<div style=\"font-weight:700;float:left;margin-left: 30px;\"><a href=https://greasyfork.org/zh-CN/scripts/441391-%E5%B8%AE%E5%B8%AE%E5%AE%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B target=_blank><span id=hnzjfz style=\"color:rgb(255 127 1);\">『帮帮客网课助手』</span> </a>");
            document.querySelector("#defaultBtn > div").insertAdjacentHTML('afterEnd',`
                    <div id="xl" style="margin-left: 30px; text-decoration: underline;">
                        <a id="xbfw" href="http://139.224.47.209:91/%E5%B0%8F%E5%B8%AE%E6%9C%8D%E5%8A%A1.png" target="_blank" style="color: #aaa;">小帮服务</a>
                        <a href="https://www.123pan.com/s/aYv7Vv-WgLN3" style="margin-left: 10px; margin-right: 10px; color: #aaa;" target="_blank">程序版下载</a>
                        <a href="http://139.224.47.209:91/wechat_bbk.jpg" style="margin-right: 10px; color: #aaa;" target="_blank">联系小帮</a>
                        <a href="https://www.bilibili.com/video/BV1H44y1Z7cr/" target="_blank" style="color: #aaa;">视频教程</a>
                    </div>
                `)
            setTimeout(function () {document.querySelector('#speaker').parentElement.click();}, 2000);//执行静音
        }
        if (jd.innerText != "100.00") {
            if (document.querySelector("#bplayer-ffplayer")) {
                if (document.querySelector("#stop") == null) {
                    document.querySelector("#play").parentElement.click();//执行播放
                }
            }
            let dangqian = document.querySelector(".videoLi.active");
            if (dangqian.innerText.match(/单元测试/)) {
                location.reload();
            } else if (document.querySelector("button.pv-ask-skip.pv-hide")) {
                document.querySelector("button.pv-ask-skip.pv-hide").click();//跳过答题
            } else if (dangqian.innerText.match(/[0-9]+%/)[0] == "100%" && document.querySelector(".pt5 [class=progress-bar]")) {
                document.querySelector(".pt5 [class=progress-bar]").parentElement.parentElement.click();//下一节
                setTimeout("location.reload();", 2000);
            }
        } else {
            history.back(-1);//返回
        }
    }
}
function gjzxx(){//国家中小学教育平台
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
                console.log("Bbk", "等待视频加载")
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
                console.log("Bbk", `第${groupNo + 1}组, 第${resNo + 1}个视频已经观看`);
                return State.SwitchActive
            }

            console.log("Bbk", `开始观看: 第${resNo + 1}个视频，第${groupNo + 1}组`);
            var video = document.getElementsByTagName("video")[0];
            video.muted = true;
            video.play().then(() => {
                videoErr = false
            }).catch((err) => {
                console.log("Bbk", err);
                videoErr = true
            });
            renderMenu()
            video.playbackRate = rateMenu[active].value;
            video.addEventListener("pause", () => state = State.PlayVideo, false)
            video.addEventListener("ended", () => state = State.SwitchActive, false)
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
                console.log("Bbk", `点击当前组的下一个视频`);
                return State.SwitchSource;
            }

            //如果看完了当前组，没看完当前页面，则看下一个页面
            if (groupNo + 1 != groups.length) {
                console.log("Bbk", `点击下一组的第一个视频`);
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
                console.log("Bbk", "看完了所有学习页面，退出");
                return State.TaskEnd;

            } else if (curUrl != -1) {
                console.log("Bbk", "进入下一个学习页面");
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
                    dom.click();
                }
            })
            //增加填空题支持
            var inputForm = document.querySelector(".index-module_box_blt8G");
            if (!!inputForm) {
                changInputValue(inputForm.getElementsByTagName("input")[1], "&nbsp;");
            }
        }, 5000);
    };

    const setVideoHandler = () => {
        setInterval(() => {
            try {
                state = func_table[state]()
                //console.log("Bbk", `${state}已经完成!`)
            }
            catch (err) {
                //tusi("BBK提示："+`${state}: ${err}`,1000,true);
                console.log("Bbk", `${state}: ${err}`)
            }
        }, 5000)
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
    //tusi("BBK提示：脚本加载成功，稍后执行自动化操作...",1000,true);
    console.log("Bbk", "加载成功")
    setVideoHandler();
    setPopupHandler();
}
function Hyw(){
    var intervalId_examherftest;
    function sleep(timeout) {
        return new Promise((resolve) => { setTimeout(resolve, timeout); });
    }
    function BlockQ_A() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            }
            player.sendQuestion = function () {
                document.querySelector('h6').innerText = "课堂问答已跳过";
            }
        })();
    }
    function Skipclassanswer() {
        setInterval(async function() {
            try {
                if ($('.pv-ask-head').length > 0) {
                    document.querySelector('h6').innerText = "执行跳过问题对话框";
                    $(".pv-ask-skip").click();
                }
            } catch (err) {
                console.log("错误：", err);
            }

            try {
                if ($('.signBtn').length > 0) {
                    document.querySelector('h6').innerText = "执行跳过签到对话框";
                    $(".signBtn").click();
                }
            } catch (err) {
                console.log("错误：", err);
            }
        }, 2000);
    }
    function examherftest(){
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        const video = document.querySelector('video');
        if (!isVideoPlaying(video) && hreftest == "#") {
            playVideo(video);
        }
        else {
            $.ajax({
                type: "get",
                url: "../pages/exam.aspx?cwid=" + cwrid,
                data: {},
                success: function (res) {
                    if (!res.includes("再进入考试") && !res.includes("再进行考试")){
                        $.ajax({
                            type: "get",
                            url: "../pages/exam.aspx?cwid=" + cwrid,
                            data: {},
                            success: function (res) {
                                if (!res.includes("再进入考试") && !res.includes("再进行考试")){
                                    setTimeout(Jrkskk, 3000);
                                }
                            }
                        });
                    }
                    else{
                        document.querySelector('h6').innerText = "帮帮客提示：还未能考试！";
                        playVideo(video);
                    }
                }
            });
        }
    }
    function Jrkskk() {
        $.ajax({
            type: "get",
            url: "../pages/exam.aspx?cwid=" + cwrid,
            data: {},
            success: function (res) {
                if (!res.includes("再进入考试") && !res.includes("再进行考试")){
                    document.querySelector('h6').innerText = "帮帮客提示：准备进入考试";
                    unsafeWindow.location.href = "../pages/exam.aspx?cwid=" + cwrid;
                    document.getElementById("jrks").click();
                }
            }
        });
    }
    function Independentdetection(){
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        if (hreftest != "#") {
            examherftest();
        }
    }
    function isVideoPlaying(video) {
        return !video.paused && !video.ended && video.currentTime > 0;
    }
    function playVideo(video) {
        if (!isVideoPlaying(video)) {
            document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-right > div:nth-child(4) > button").click();
            setTimeout(() => {
                document.querySelector("#video > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-control > div.pv-controls > div.pv-controls-left > button").click();
            }, 100);
        }
        //unsafeWindow.player.j2s_getCurrentTime = j2s_getCurrentTime;
    }
    function j2s_getCurrentTime() {
        var P = unsafeWindow.player.HTML5 ? unsafeWindow.player.HTML5.currentTime : unsafeWindow.player.flash.j2s_getCurrentTime();
        var T = (p * 1.5);
        document.querySelector('h6').innerText = "帮帮客提示：" + P + "/" + T;
        return T;
    }
    Skipclassanswer();
    BlockQ_A();
    cleanKeyStorage();
    var xh = setInterval(function () {
         if (unsafeWindow.updateCourseWareProcess){
            clearInterval(xh);
            examherftest();
            setInterval(Independentdetection, 5000);
            intervalId_examherftest = setInterval(examherftest, 3*60*1000);
         }             
    },3000);
}
function Hyw_exam() {
    document.querySelector("#containter > div.main_long > div.colm_long_mid > h3").textContent += ">准备作答";
    var questions = JSON.parse(localStorage.getItem("BBK_Test")) || {};
    var qRightAnswer = JSON.parse(localStorage.getItem("BBK_RightAnswer")) || {};
    if (JSON.stringify(qRightAnswer) == "{}") {
        qRightAnswer = LoadRightAnwser();
    };
    var qTestAnswer = {};
    var index = 0;
    while (true) {
        var question = document.querySelector("#gvQuestion_question_" + index);
        if (question == null) break;
        else {
            var q = question.innerText.substring(2).replace(/\s*/g, "");
            if (qRightAnswer.hasOwnProperty(q)) {
                var rightSelection = findAnwser("#gvQuestion_rbl_" + index, qRightAnswer[q]);
                document.querySelector("#" + rightSelection).click();
            } else {
                if (questions.hasOwnProperty(q)) {
                    questions[q] = getNextChoice(questions[q]);
                } else {
                    questions[q] = "A";
                };
                var answer = getChoiceCode(questions[q]);
                var element = document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);
                if (!element) { 
                    questions[q] = "A";
                    answer = getChoiceCode("A");
                    element = document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);
                };
                try {
                    var answerText = element.nextSibling.innerText.trim().substring(2);
                    qTestAnswer[q] = answerText;
                } catch (error) { console.log("答案文本获取失败A：" + error); };
                element.click();
            };
            index = index + 1;
        };
    };

    localStorage.setItem("BBK_Test", JSON.stringify(questions));
    localStorage.setItem("BBK_TestAnswer", JSON.stringify(qTestAnswer));
    document.querySelector("#containter > div.main_long > div.colm_long_mid > h3").textContent += ">作答完毕>执行拟人化操作(6-10秒)";
    setTimeout(function () {
        document.querySelector("#btn_submit").click();
    }, (3000 + Math.ceil(Math.random() * 1000))); 
    function findAnwser(qakey, rightAnwserText) {
        var answerslist = document.querySelector(qakey);
        var arr = answerslist.getElementsByTagName("label");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].innerText.substring(2) == rightAnwserText) {
                return arr[i].htmlFor;
            };
        };
    };
    function getChoiceCode(an) { 
        var charin = an || "A";
        return charin.charCodeAt(0) - "A".charCodeAt(0);
    };
    function getNextChoice(an) { 
        var code = an.charCodeAt(0) + 1;
        return String.fromCharCode(code);
    };
    function LoadRightAnwser() {
        var qAllAnswer = JSON.parse(localStorage.getItem("BBK_AllAnswer")) || {};
        var qTitle = JSON.parse(localStorage.getItem("BBK_ThisTitle")) || "没有记录到章节名称";
        if (qTitle == "没有记录到章节名称") {
            return {};
        };
        var qOldAnswer = qAllAnswer[qTitle] || {};
        return qOldAnswer
    };
}
function Hyw_exam_result() {
    var res = $(".tips_text")[0].innerText;
    var dds = $(".state_lis_text");
    localStorage.removeItem("BBK_Result");
    if (res == "考试通过" || res == "考试通过！" || res == "完成项目学习可以申请学分了") { 
        saveRightAnwser();
        SaveAllAnwser(); 
        cleanKeyStorage();
        var next = document.querySelector(".state_lis_han");
        if (next) {
            setTimeout(function () { next.click(); }, 3000);
            document.querySelector("p[class='tips_text']").innerText = "帮帮客提示：考试已通过\r\n【延时3秒后进行下一步操作。脚本不支持作答存在相同试题的试卷。】"
        };
    } else {
        document.querySelector("p[class='tips_text']").innerText = "帮帮客提示：很抱歉，考试未通过。请您放松心情\r\n(如果试题存在相同问题，建议重新选过课程或手动作答)\r\n【延时6-10秒后进行下一步操作】"
        var qWrong = {};
        for (var i = 0; i < dds.length; ++i) {
            qWrong[dds[i].title.replace(/\s*/g, "")] = i

        };
        if (qWrong != {}) {
            localStorage.setItem("BBK_Result", JSON.stringify(qWrong));
            saveRightAnwser();
            setTimeout(function () {
                $("input[type=button][value='重新考试']").click();
            }, (3000 + Math.ceil(Math.random() * 1000)) * 1);
        };
    };
    function SaveAllAnwser() {
        var qAllAnswer = JSON.parse(localStorage.getItem("BBK_AllAnswer")) || {};
        var qRightAnswer = JSON.parse(localStorage.getItem("BBK_RightAnswer")) || {};
        var qTitle = JSON.parse(localStorage.getItem("BBK_ThisTitle")) || "没有记录到章节名称";
        var qOldAnswer = qAllAnswer[qTitle] || {};
        for (var q in qRightAnswer) {
            qOldAnswer[q] = qRightAnswer[q];
        };
        qAllAnswer[qTitle] = qOldAnswer;
 
        if (qAllAnswer != null) {
            localStorage.setItem("BBK_AllAnswer", JSON.stringify(qAllAnswer));
        };
    };
    function saveRightAnwser() {
        var qRightAnswer = JSON.parse(localStorage.getItem("BBK_RightAnswer")) || {};
        var qTestAnswer = JSON.parse(localStorage.getItem("BBK_TestAnswer")) || {};
        var qkeyTest = JSON.parse(localStorage.getItem("BBK_Test")) || {};
        var qWrongs = JSON.parse(localStorage.getItem("BBK_Result")) || {};
        for (var q in qTestAnswer) {
            var iswrong = false;
            if (!qWrongs.hasOwnProperty(q)) {
                qRightAnswer[q] = qTestAnswer[q];
            }
        };
        localStorage.removeItem("BBK_TestAnswer");
        if (qRightAnswer != null) {
            localStorage.setItem("BBK_RightAnswer", JSON.stringify(qRightAnswer));
        };
    };
}
function cleanKeyStorage() {
    localStorage.removeItem("BBK_Test");
    localStorage.removeItem("BBK_Result");
    localStorage.removeItem("BBK_ThisTitle");
    localStorage.removeItem("BBK_RightAnswer");
};
class Verify {
    constructor() {
        var version = 'version',hear = 'hear',version_ = "4.5";
        var txt,str;
        str = 'https://www.cnblogs.com/BBK1106/p/17770770.html';
        let Set = GM_getValue("set");
        if (GM_listValues().indexOf("set") == -1) {
            GM_setValue("set", {"idCard": "","code": "","hear": "","version": ""});
            confirm("BBK_JavaScript\n初始化完毕!");
        }
        setTimeout(function () {
            Set = GM_getValue("set");
            if (Set[hear] != true) {
                data();
            } else if (Set[hear] == true && Set[version] != version_) {
                data();
                let v1 = prompt('BBK_JavaScript\n\n温馨提示；您有新版本更新\n\n最新版本：' + Set[version] + '，当前版本：' + Vs + '\n\n更新流程：\n1.点击确定按钮进行跳转\n2.复制输入框内的地址到浏览器上打开即可\n\n注意事项：点击确定按钮后，个别浏览器会阻止弹窗而导致跳出失败，注意浏览器提示选择允许即可',str);
                if(v1){window.open(str);}
            }
            if (document.querySelector('#floatTips2')) 
                document.querySelector('#imga3').style.display = 'none';
            if (document.querySelector('#floatTips')) 
                    document.querySelector('#floatTips').style.display = 'none';
            if (document.querySelector("#top_body > div.video-container > div.coent > div.r > div:nth-child(7)"))
                    document.querySelector("#top_body > div.video-container > div.coent > div.r > div:nth-child(7)").style.display = 'none';
        }, 1500);
        function data() {
            var url_n, url_t;
            url_n = unsafeWindow.location.href.split("/");
            url_t = url_n[url_n.length - 1].split("?")[0];
            if (url_t != "course_list_v2.aspx") {
                $('body').append(`
                    <div id=gzh style="font-weight: bold;right: 17px;font-size: 14px;height: 32px;text-align: center;display: block;background: #ffffff;position: fixed;top: 272px;width: 129px;color: #717375;margin-left: 0px;line-height: 15px;">
                        微信扫码关注
                        <br>
                        助你高效学习
                    </div>
                    <iframe src="https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=102&__biz=Mzk0MjMxNTcxOQ==&mid=2247483681&idx=1&sn=382747485cbe09c94f7e7ee0eef363b5&send_time="
                    style="right: 17px;display: block;position: fixed; top:143px;width: 129px;color: #555;margin-left: 0px;line-height: 11px;border-radius: 6px;height: 160px;">
                    </iframe>
                    `);
            }
        }
        function getCookie(name)
        {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
    }
}
new Verify();
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        console.log("State");
        var Ht = location.href;
        //河南专技
        if (Ht.includes('ghlearning')) {
            myTimer = setInterval(hnzj_gx,3000);
        }
        //国家中小学教育平台
        else if (Ht.includes("courseDetail")) {
            gjzxx();
        }
        //华医网
        else if (Ht.includes('91huayi.com')) {
            if (Ht.includes("course_ware")){
                function addContentWithStyle(containerClass) {
                    var str = 'https://www.cnblogs.com/BBK1106/p/17770770.html';
                    var txt = `
                    <p>当前使用版本：『帮帮客网课助手』 视频采取原速 2. 具备：视频播放、课堂答题、签到等检测人机机制、自动考试、拟人化延时</p>
                    <p><span style="color: #ff0000;">高级版本：帮帮客本地预览版（BBK Local preview） 1. 具备：无视视频播放、课堂答题、签到，图形验证码识别、自动考试、拟人化延时</span></p>
                    `;
                    var style = document.createElement('style');
                    style.textContent = `
                    .${containerClass} {
                        font-family: Arial, sans-serif;
                        color: #333;
                        padding: 10px;
                        background-color: #f9f9f9;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        margin: 20px;
                    }
                    .${containerClass} a {
                        color: #007bff;
                        text-decoration: none;
                        margin-left: 10px;
                    }
                    `;
                    document.head.appendChild(style);
                    var container = document.querySelector('.' + containerClass);            
                    var contentDiv = document.createElement('div');
                    contentDiv.innerHTML = txt + '<br><a href="' + str + '">安装【帮帮客本地预览版】-网页端</a>';
                    var wrapperDiv = document.createElement('div');
                    wrapperDiv.classList.add('content-wrapper');
                    wrapperDiv.appendChild(contentDiv);
                    container.appendChild(wrapperDiv);
                    contentDiv = document.createElement('div');
                    contentDiv.innerHTML = '<a href="https://www.123pan.com/s/aYv7Vv-WgLN3.html">推荐安装【BBKAssistant_Pro】-window程序端</a>';
                    wrapperDiv = document.createElement('div');
                    wrapperDiv.classList.add('content-wrapper');
                    wrapperDiv.appendChild(contentDiv);
                    container.appendChild(wrapperDiv);
                }
                addContentWithStyle('video-container');
                Hyw();            
            }
            else if (Ht.includes("exam.aspx")){
                Hyw_exam();
            }
            else if (Ht.includes("exam_result.aspx")){
                Hyw_exam_result();
            }
        }
        console.log(Ht);        
    }
};