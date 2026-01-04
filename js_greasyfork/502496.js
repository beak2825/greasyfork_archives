// ==UserScript==
// @name   【永久免费版】国家中小学智慧教育平台|教师暑期寒假假期研修|不能后台观看，必须前置|收费版本见文档：https://kdocs.cn/l/ccVhELjvKcG5
// @namespace    https://kdocs.cn/l/ccVhELjvKcG5
// @icon    https://kdocs.cn/l/ccVhELjvKcG5
// @version      1.0
// @description  免费版本只有视频1倍速度+自动换课功能（不能后台观看，必须前置）。付费版本仅需5分钟学完整个学习任务，详情点击标题进入详情页面看描述；
// @author       一心向善
// @include    https://www.zxx.edu.cn/*
// @include    https://*.smartedu.cn/*
// @include    https://*captcha.gtimg.com/*
// @include    https://*.vocational.smartedu.cn/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceURL
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_getResourceText
// @grant       window.close
// @run-at      document-body
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://update.greasyfork.org/scripts/502187/1419386/base_lib.js
// @require https://greasyfork.org/scripts/434540-layerjs-gm-with-css/code/layerjs-gm-with-css.js?version=1065982
// @antifeature 
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/502496/%E3%80%90%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E6%9A%91%E6%9C%9F%E5%AF%92%E5%81%87%E5%81%87%E6%9C%9F%E7%A0%94%E4%BF%AE%7C%E4%B8%8D%E8%83%BD%E5%90%8E%E5%8F%B0%E8%A7%82%E7%9C%8B%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%89%8D%E7%BD%AE%7C%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%E8%A7%81%E6%96%87%E6%A1%A3%EF%BC%9Ahttps%3AkdocscnlccVhELjvKcG5.user.js
// @updateURL https://update.greasyfork.org/scripts/502496/%E3%80%90%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E6%9A%91%E6%9C%9F%E5%AF%92%E5%81%87%E5%81%87%E6%9C%9F%E7%A0%94%E4%BF%AE%7C%E4%B8%8D%E8%83%BD%E5%90%8E%E5%8F%B0%E8%A7%82%E7%9C%8B%EF%BC%8C%E5%BF%85%E9%A1%BB%E5%89%8D%E7%BD%AE%7C%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%E8%A7%81%E6%96%87%E6%A1%A3%EF%BC%9Ahttps%3AkdocscnlccVhELjvKcG5.meta.js
// ==/UserScript==
(function () {
    // @run-at      document-start
    let $jq = $;
    unsafeWindow.$jq = $;
    unsafeWindow.layer = layer;
    let baseConfig = {
        project: {
            id: "1650871821559652353",
            version: "202405241831",
        },
        url: {
            login: "https://kdocs.cn/l/ccVhELjvKcG5",
            base: "https://kdocs.cn/l/ccVhELjvKcG5",
            resource: "https://kdocs.cn/l/ccVhELjvKcG5",
        },
    };
    let docUrl = "https://kdocs.cn/l/ccVhELjvKcG5";
    let plugMain = Object.assign(baseConfig, {
        config: {
            maxComment: 100,
        },
        pageData: {
            userNameIndex: null,
            closeTipsIndex: null,
            confirmRunIndex: null,
            confirmRunZIndex: 19991018,
            waitTime: 0,
            index: {
                list: null,
            },
            video: {
                index: null,
            },
        },
        async init() {
            console.log("%c pg init", "background:rgb(0,0,0);color:#fff");
            var lockResolver;
            if (navigator && navigator.locks && navigator.locks.request) {
                const promise = new Promise((res) => {
                    lockResolver = res;
                });

                navigator.locks.request("unique_lock_name", { mode: "shared" }, () => {
                    return promise;
                });
            }
            plugMain.addStyle();
            unsafeWindow.alert = function (msg) {
                layer.alert(msg);
            };
            let run = true;
            if (run) plugMain.firstRun();
        },
        async runByUrl(url) {

            let lastUrl = "";
            let lastTime = 0
            setInterval(async () => {
                if (lastUrl != location.href) {
                    if (plugMain.now() - lastTime < 1000) {
                        console.log("==跳过==")
                        return
                    }
                    if (lastUrl.includes("/teacherTraining/courseIndex?") && location.href.includes("/teacherTraining/courseIndex?")) {
                        console.log("==跳过  courseIndex==")
                        return
                    }
                    lastTime = plugMain.now()
                    lastUrl = location.href;

                    // 寒假研修
                    if (
                        lastUrl.includes(
                            "/training/bdbe4c1e-f540-4e9f-9fae-855ab44e2d32"
                        ) ||
                        lastUrl.includes("subject/winter2022")
                    ) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("teacherTraining/courseDetail")) {
                        plugMain.page_courseDetail();
                    } else if (lastUrl.includes("/teacherTraining/courseIndex")) {
                        plugMain.page_courseIndex()
                    }
                    // 心理健康
                    else if (
                        lastUrl.includes("/training/f30ac359-402a-4883-9f4a-07c0f8356aca")
                    ) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("/simp/index.html")) {

                    } // 心理健康
                    else if (
                        lastUrl.includes("/training/2023sdjy") ||
                        lastUrl.includes("/training/71a83441-6d45-4644-80f0-00efa40df164")
                    ) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("/subject/teaching/") || lastUrl.includes('/h/subject/')) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("/course/vocational/")) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("training/2023sqpx")) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("/training/2024hjpx") || lastUrl.includes('/training/ee0d68b5-6a9d-441b-97dc-d52bfdfece83') || lastUrl.includes('/subject/summer2024/')) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    }
                    // #每年需要修改这里的授权ID
                    else if (lastUrl.includes("/training/2024sqpx") || lastUrl.includes('/training/5d7cf98c-3a42-4b13-8e5f-56f40ce08b1d')) {
                        plugMain.showPaidContent(`当前是免费版本，收费版联系我直接处理，无需您动手，无论多少订单，5分钟内完成`)
                    } else if (lastUrl.includes("login")) {

                    }
                }
            }, 500);

            if (window === top) {
                plugMain.registerMenuCommand();
            }
        },

        async page_courseIndex() {
            console.log("%c page_courseIndex", "background:rgb(0,0,0);color:#fff");
            plugMain.setGMData("closeLJTS", plugMain.now());
            await plugMain.waitOf(
                (a) =>
                    $('[class^="CourseIndex-module_course-info__title"]').text() != "" &&
                    $jq('[class^="CourseIndex-module_course-btn"]').length > 0
            );
            plugMain
                .waitOf(
                    (a) =>
                        plugMain.getElByText($("div[class^='index-module_btn_']"), "我晓得了") !=
                        null,
                    1000,
                    60
                )
                .then(async (a) => {
                    if ($(".fish-checkbox-wrapper").find('.fish-checkbox-checked').length == 0) {
                        $(".fish-checkbox-wrapper").click();
                    }
                    await plugMain.waitTimeout(1000);
                    plugMain
                        .getElByText($("div[class^='index-module_btn_']"), "我晓得了")
                        .click();
                    // plugMain.confirmRun().then((a) => {
                    //   $jq('[class^="CourseIndex-module_course-btn"]')[0].click();
                    // });
                });
            plugMain.confirmRun("2秒后执行下一步", 1000).then((a) => {
                $jq('[class^="CourseIndex-module_course-btn"]')[0].click();
            });
        },
        async page_courseDetail() {
            console.log("%c page_courseDetail", "background:rgb(0,0,0);color:#fff");

            setTimeout(() => {
                if (plugMain.getTotalTime() == 0 || plugMain.getCurTime() == 0) {
                    plugMain.confirmRun("OMG好像卡住了，准备刷新").then(a => {
                        location.reload()
                    })
                }
            }, 30 * 1000);
            plugMain
                .waitOf((a) => $jq(".resource-item").length > 0)
                .then((a) => {
                    $('.fish-collapse-header[aria-expanded="false"]').click();
                    setTimeout(() => {
                        $('.fish-collapse-header[aria-expanded="false"]').click();
                        plugMain.page_video();
                    }, 1000);
                });
        },
        async page_video() {
            console.log("%c page_video", "background:rgb(0,0,0);color:#fff");
            let list = plugMain.getGMData("courseList", []);
            let courseName = $('[class^="index-module_name"]').text().trim();

            let $el = null;
            $jq(".resource-item").each((i, el) => {
                if ($(el).find(".icon_checkbox_fill").length > 0) {
                    return true;
                }
                let title = $(el).text().trim();
                let fullTitle = courseName + "-" + title;
                console.log(fullTitle);
                $el = $(el);
                return false;
            });
            if ($el == null) {
                plugMain.openLjTips()
                window.open(plugMain.getGMData("listUrl", "/"));
                plugMain.pageData.videoFinish = true
                return;
            }
            $el.click();
            await plugMain.waitTimeout(5000);
            let timeout = 2;
            plugMain.pageData.video.index = setInterval(async () => {
                try {
                    if (plugMain.getVideo() == null) return;
                    if (plugMain.getElByText($(".fish-modal-confirm-content"), "必须完整看完整个视频才可以获得该视频的学时。") != null) {

                        plugMain.getElByText($(".fish-modal-confirm-content"), "必须完整看完整个视频才可以获得该视频的学时。").parents('.fish-modal-body:first').find('button').click()
                    }
                    if ($(".nqti-listnum-text").text().trim().replace(".", "") != "") {
                        // 答题
                        plugMain.pageData.waitTime = 2;
                        let curQIndex =
                            Number($(".nqti-listnum-text").text().trim().replace(".", "")) -
                            1;
                        let curAnswer = plugMain.pageData.answerArr[curQIndex];
                        if (curAnswer == "YES") {
                            $(".nqti-option-radio-icon").eq(0).click();
                        } else if (curAnswer == "NO") {
                            $(".nqti-option-radio-icon").eq(1).click();
                        } else {
                            $(".nqti-check").each((i, el) => {
                                if (curAnswer.includes($(el).text().trim())) {
                                    $(el).click();
                                }
                            });
                        }
                        await plugMain.waitTimeout(200);
                        if (plugMain.getElByText($("button"), "确定") != null) {
                            plugMain.getElByText($("button"), "确定").click();
                        }
                        if (plugMain.getElByText($("button"), "确 定") != null) {
                            plugMain.getElByText($("button"), "确 定").click();
                        }
                        if (plugMain.getElByText($("button"), "下一题") != null) {
                            plugMain.getElByText($("button"), "下一题").click();
                        }
                        if (plugMain.getElByText($("button"), "完成") != null) {
                            plugMain.getElByText($("button"), "完成").click();
                        }
                        if (plugMain.getElByText($("button"), "完 成") != null) {
                            plugMain.getElByText($("button"), "完 成").click();
                        }
                    }
                    if (plugMain.pageData.waitTime > 0) {
                        plugMain.pageData.waitTime -= timeout;
                        return;
                    }
                    console.log("%c video run", "background:rgb(255,0,0);color:#fff");
                    if (
                        plugMain.getElByText(
                            $(".fish-modal-confirm-content"),
                            "本条资源的学习，须完成视频中的测试题",
                            "startsWith"
                        ) != null
                    ) {
                        plugMain
                            .getElByText(
                                $(".fish-modal-confirm-content"),
                                "本条资源的学习，须完成视频中的测试题",
                                "startsWith"
                            )
                            .parents(".fish-modal-body:first")
                            .find("button")
                            .click();
                    }
                    if (
                        plugMain.getElByText(
                            $(".fish-modal-confirm-content"),
                            "须学习完本条视频并完成相应测试题才可获得本条视频的学时。"
                        ) != null
                    ) {
                        plugMain
                            .getElByText(
                                $(".fish-modal-confirm-content"),
                                "须学习完本条视频并完成相应测试题才可获得本条视频的学时。"
                            )
                            .parents(".fish-modal-body")
                            .find("button")
                            .click();
                    }

                    let isFinish = plugMain.isPlayFinish();
                    if (isFinish) {
                        layer.msg("视频即将结束，等待下一步操作", { time: 20 * 1000 });
                        plugMain.pageData.waitTime = 25;
                        setTimeout(() => {
                            plugMain.nextVideo();
                        }, 20 * 1000);
                        return;
                    }
                    let isPlay = await plugMain.videoIsPlay();
                    if (!isPlay) {
                        if (!isFinish) {
                            plugMain.play();
                            return;
                        }
                    }
                } catch (e) {
                    console.error("视频页面定时器出错", e);
                }
            }, timeout * 1000);
        },
        checkVideoPlay() {
            let lastTime = plugMain.getCurTime();
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (plugMain.getTotalTime() > 0 && plugMain.getCurTime() == lastTime) {
                        plugMain.play();
                    }
                    lastTime = plugMain.getCurTime();
                    resolve();
                }, 3000);
            });
        },
        listenerVideo() {
            console.log("%c listenerVideo", "background:rgb(255,0,0);color:#fff");
            let index = setInterval(() => {
                // 重播按钮（视频放完了，但是进度还没完）
                if ($(".xgplayer-replay:visible").length > 0) {
                    document.querySelector("video").play();
                    return;
                }
                if ($(".dialog-content") == "学时记录出现异常请检查网络") {
                    location.reload();
                    return;
                }
            }, 5000);
        },
        async page_viewerforccvideo() {
            console.log(
                "%c page_viewerforccvideo",
                "background:rgb(255,0,0);color:#fff"
            );
            plugMain.setGMData("closeLJTS", plugMain.now());
            plugMain.showPaidContent("当前是免费版本，收费版本直接无需您上手，我们全自动解决，我们等你付费升级哦！")
            plugMain.checkVideoPlay().then((a) => {
                plugMain.checkVideoPlay();
            });

            plugMain.listenerVideo();
            setInterval(() => {
                let cIndex = $("li.cvtb-MCK-course-content").index(
                    $("li.cvtb-MCK-course-content.current")
                );
                let progress = $("li.cvtb-MCK-course-content.current")
                    .find(".cvtb-MCK-CsCt-studyProgress")
                    .text()
                    .trim();
                let key = cIndex + "_" + progress;
                if (plugMain.pageData.video.lastKey == key) {
                    // layer.alert("OMG卡住了，刷新页面");
                    plugMain.confirmRun("OMG卡住了，5秒后刷新页面").then((a) => {
                        location.href = location.href;
                    });
                }
                plugMain.pageData.video.lastKey = key;
                // }, 10 * 1000);
            }, 2 * 60 * 1000);

            plugMain.checkVideoPlay().then((a) => {
                plugMain.checkVideoPlay();
            });

            plugMain.listenerVideo();

            setInterval(() => {
                if ($("#rest_tip").length > 0) {
                    $("#rest_tip").find("button").click();
                }
                if ($(".xgplayer-volume-large").length > 0) {
                    $(".xgplayer-volume .xgplayer-icon").click();
                }
            }, 1000);

            unsafeWindow.window.on_spark_player_pause = function () {
                console.log(">>>plugMain on_spark_player_pause");
                // plugMain
                // clearInterval(r)
            };
            unsafeWindow.on_spark_player_resume = function () {
                console.log(">>>plugMain on_spark_player_resume");
                // plugMain
                // i()
            };
        },
        page_top() {
            GM_addValueChangeListener('openLjts', function (name, old_value, new_value, remote) {
                plugMain.openLjTips()
            })
        },
        firstRun() {
            if (top === window && plugMain.getGMData("showDoc", true)) {
                layer.confirm(
                    "首次使用本脚本?点击下方按钮查看使用说明",
                    { icon: 3, title: "首次使用？", btn: ["查看使用说明", "取消"] },
                    function (index) {
                        plugMain.openDoc();
                        layer.close(index);
                        plugMain.setGMData("showDoc", false);
                        plugMain.begin("iamzhankuo");
                    },
                    function () {
                        plugMain.setGMData("showDoc", false);
                        plugMain.begin("iamzhankuo");
                    }
                );
            } else {
            }
            plugMain.begin("iamzhankuo");
        },
        async begin(key) {
            if (window === top) {
                plugMain.registerMenuCommand();
            }

            plugMain.runByUrl();
        },

        setSkip(event, courseId, skip) {
            event.stopPropagation()
            $(".skipContainer").remove();
            var sikpList = plugMain.getGMData("skipList", []);
            if (skip) {
                sikpList.push(courseId);
                plugMain.setGMData("skipList", sikpList);
            } else {
                plugMain.setGMData(
                    "skipList",
                    sikpList.filter((a) => a != courseId)
                );
            }
            layer.msg("操作成功");
            plugMain.setSkipBtn();
        },
        setSkipBtn() {
            var sikpList = plugMain.getGMData("skipList", []);
            $(".plugMain-skipContainer").remove()
            $("#currentCourseDiv .course").each((i, el) => {
                let courseId = $(el).attr("courseid");
                let $btnContainer = $(el)
                if (sikpList.includes(courseId)) {
                    $btnContainer.after(
                        `<div class="text-center plugMain-skipContainer"><button type="button" class="plugMain-btn info"  onclick="plugMain.setSkip(event,'${courseId}',false)">脚本：取消跳过</button></div>`
                    );
                } else {
                    $btnContainer.after(
                        `<div class="text-center plugMain-skipContainer"><button type="button" class="plugMain-btn danger" onclick="plugMain.setSkip(event,'${courseId}',true)">脚本：跳过课程</button></div>`
                    );
                }
            });
        },
        async showPaidContent(msg = "此页面未付费内容，免费脚本不包含", withPostfix = false) {
            if (withPostfix) {
                msg += "<span style='font-weight:bold;'>*重要：一个学员付费一次，解放您双手，全程我们来处理!</span>"
            }
            plugMain.confirmMsg(msg, {
                btn: ["收费版本说明书（必看）", "关闭"],
                title: "免费版温馨提示",
                area: ["500px"],
                shade: 0,
                offset: "rb",
                fun1(index) { plugMain.openDoc() }
            })
        },
        localSaveQa(qaArr) {
            let list = plugMain.getGMData("qaList", []);
            qaArr.forEach((item) => {
                let old = list.find((a) => a.key == item.key);
                item.value = item.value.replace(/#split#/g, "|");
                if (!old) {
                    list.push(item);
                } else {
                    old.value = item.value;
                }
            });
            plugMain.setGMData("qaList", list);
        },
        play() {
            plugMain.getVideo().volume = 0;
            setTimeout(() => {
                plugMain.getVideo().play();
            }, 200);
            // });
        },
        setVideoVolume() {
            try {
                if (plugMain.getVideo().volume != 0) {
                    plugMain.getVideo().volume = 0;
                }
            } catch (e) {
                console.error(e);
            }
        },
        isPlayFinish() {
            try {
                return (
                    plugMain.getTotalTime() > 0 && plugMain.getCurTime() + 5 >= plugMain.getTotalTime()
                );
            } catch (e) {
                return false;
            }
        },
        getVideo() {
            return $("video")[0];
        },
        getCurTime() {
            let res = 0;
            try {
                res = $("video")[0].currentTime;
            } catch (e) {
                console.error(e);
            }
            return res;
        },
        getTotalTime() {
            let res = 0;
            try {
                res = $("video")[0].duration;
            } catch (e) {
                console.error(e);
            }
            return res;
        },
        // 题库方法
        formatAnswerOption(option) {
            // 检查输入是否是单个字母且在 A-Z 范围内
            if (/^[a-zA-Z]$/.test(option)) {
                option = option.toUpperCase();
                return option.charCodeAt(0) - 'A'.charCodeAt(0);
            } else {
                let arr = [
                    ["正确", "错误"],
                    ["对", "错"],
                ];
                let opt = option.toUpperCase();
                let res = -1;
                arr.forEach((subArr) => {
                    if (subArr.includes(opt)) {
                        res = subArr.indexOf(opt);
                        return false;
                    }
                });
                return res;
            }
        },

        // 题库方法
        formatAnswerOptionNo(index) {
            return ["A", "B", "C", "D", "E", "F", "G", "H"][index]
        },
        isMatchQAText(txt1, txt2) {
            return (
                txt1 == txt2 ||
                plugMain.simpleHtml(txt1) == plugMain.simpleHtml(txt2) ||
                plugMain.simpleText(txt1) == plugMain.simpleText(txt2)
            );
        },
        simpleHtml(html) {
            html = html.replace(/&nbsp;|<br\/>|<br>|\n|\r/gi, "");
            html = html.trim();
            if (!html) return html;
            if (html.startsWith("<") && html.endsWith(">")) {
                return $(html).text().trim();
            }
            return html.trim();
        },
        simpleText(text) {
            return text
                .replace(/[^\u4e00-\u9fa5a-zA-Z0-9#split#√×]/g, "")
                .replace(/[的]/g, "");
        },
        async videoIsPlay() {
            return new Promise((resolve) => {
                try {
                    let curTime = $("video")[0].currentTime;
                    setTimeout(() => {
                        let time1 = $("video")[0].currentTime;
                        let res = time1 > curTime;
                        if (res) {
                            setTimeout(() => {
                                let time2 = $("video")[0].currentTime;
                                let res2 = time2 > time1;
                                resolve(res2);
                            }, 100);
                        } else {
                            return resolve(false);
                        }
                    }, 100);
                } catch (e) {
                    resolve(false);
                }
            });
        },
        beginMan() {
            console.log("%c beginMan", "background:rgb(0,0,0);color:#fff");
        },
        stop() {
            location.href = location.href;
        },

        openDoc() {
            if (docUrl) {
                window.open(docUrl);
            } else {
                window.open("https://kdocs.cn/l/ccVhELjvKcG5");
            }
        },
        isDZKFMode() {
            let res = typeof (loadFun) == 'function' && loadFun.toString().includes('var data = res.response;')
            if (!res)
                res = typeof isDZKF == "boolean" && !!isDZKF;
            return res
        },
        registerMenuCommand() {
            GM_registerMenuCommand("当前是免费版", plugMain.openDoc);
            GM_registerMenuCommand("点此安装付费版本", plugMain.openDoc);
            GM_registerMenuCommand("联系脚本客服", plugMain.linkAuthor);
        },
        linkAuthor() {
            window.open("https://kdocs.cn/l/ccVhELjvKcG5");
        },
        setClip(txt) {
            GM_setClipboard(txt, "text");
            layer.msg("复制成功");
        },
        addStyle() {
            GM_addStyle(`
        .plugMain-btn{background-color:#0fbcf9;color:white;padding:4px 12px;border:none;box-sizing:content-box;font-size:14px;height:20px;border-radius:4px;cursor:pointer;display:inline-block;border:1px solid transparent;white-space:nowrap;user-select:none;text-align:center;vertical-align:middle}.plugMain-btn:hover{opacity:.8}.plugMain-btn.success{background-color:#38b03f}.plugMain-btn.warning{background-color:#f1a325}.plugMain-btn.info{background-color:#03b8cf}.plugMain-btn.danger{background-color:#ea644a}.plugMain-form-tips{font-size:1.2em;color:red}.tips{color:red}.plugMain-form textarea,.plugMain-form input[type=text],.plugMain-form input[type=number],.plugMain-form input[type=password]{border:1px solid #888;border-radius:4px;padding:5px;box-sizing:border-box}.plugMain-form textarea{width:100%}.plugMain-form-item{margin-bottom:10px}.plugMain-form-item>label:first-child{width:7em;text-align:right;display:inline-block;padding-right:5px;margin-right:0}.plugMain-form-item label{margin-right:4px}.plugMain-form-item.block>label:first-child{text-align:left;display:block;width:100%;font-weight:bold}.text-l{text-align:left !important}.text-c{text-align:center !important}.text-r{text-align:right !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.p-t-0{padding-top:0px !important}.p-t-5{padding-top:5px !important}.p-t-10{padding-top:10px !important}.p-t-15{padding-top:15px !important}.p-t-20{padding-top:20px !important}.p-b-0{padding-bottom:0px !important}.p-b-5{padding-bottom:5px !important}.p-b-10{padding-bottom:10px !important}.p-b-15{padding-bottom:15px !important}.p-b-20{padding-bottom:20px !important}.p-l-0{padding-left:0px !important}.p-l-5{padding-left:5px !important}.p-l-10{padding-left:10px !important}.p-l-15{padding-left:15px !important}.p-l-20{padding-left:20px !important}.p-r-0{padding-right:0px !important}.p-r-5{padding-right:5px !important}.p-r-10{padding-right:10px !important}.p-r-15{padding-right:15px !important}.p-r-20{padding-right:20px !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.m-t-0{margin-top:0px !important}.m-t-5{margin-top:5px !important}.m-t-10{margin-top:10px !important}.m-t-15{margin-top:15px !important}.m-t-20{margin-top:20px !important}.m-b-0{margin-bottom:0px !important}.m-b-5{margin-bottom:5px !important}.m-b-10{margin-bottom:10px !important}.m-b-15{margin-bottom:15px !important}.m-b-20{margin-bottom:20px !important}.m-l-0{margin-left:0px !important}.m-l-5{margin-left:5px !important}.m-l-10{margin-left:10px !important}.m-l-15{margin-left:15px !important}.m-l-20{margin-left:20px !important}.m-r-0{margin-right:0px !important}.m-r-5{margin-right:5px !important}.m-r-10{margin-right:10px !important}.m-r-15{margin-right:15px !important}.m-r-20{margin-right:20px !important}.bold{font-weight:bold !important}.tips-box{padding:10px;border:1px solid red;background-color:#fff0f0;color:red}.bold{font-weight:bold}.font-l{font-size:1.2em}.font-xl{font-size:40px}.font-l{font-size:25px}.color-default{color:#ea644a !important}.color-success{color:#38b03f !important}.color-warning{color:#f1a325 !important}.color-danger{color:#ea644a !important}.bg-default{background-color:#ea644a !important}.bg-success{background-color:#38b03f !important}.bg-warning{background-color:#f1a325 !important}.bg-danger{background-color:#ea644a !important}.plugMain-table{border-collapse:collapse}.plugMain-table thead{background-color:#1abc9c}.plugMain-table td,.plugMain-table th{text-align:center;padding:6px;border:1px solid #888}.plugMain-table tr:nth-child(2n){background-color:#f2f2f2}.plugMain-table tr:hover{background-color:#fff799}.plugMain-container *{font-size:17px}
        `);
        }, // plugMain.setGMData("closeLJTS", plugMain.now());
        openLjTips(tipsAndClose = true, checkUrlBeforeClose = false) {
            let index = layer.open({
                type: 1,
                title: "请确认",
                offset: "100px",
                content: `
            <div style="padding:10px">
            <p>已经为你打开下一门课程，如果没有打开窗口，请检查浏览器地址栏右侧是否有拦截提示，请选择【永久允许】或者在浏览器设置中设置本网站【弹出式窗口和重定向】设置为允许</p>
            <p style="color:red;">如下图所示：</p>
            <img src="https://js.zhanyc.cn/img/ljts.jpg"/>
            </div>
            `,
            });
            if (!plugMain.pageData.ljtsIndexArr) {
                plugMain.pageData.ljtsIndexArr = []
            }
            plugMain.pageData.ljtsIndexArr.push(index)
            let url = checkUrlBeforeClose ? location.href : "";
            if (plugMain.pageData.closeTipsIndex != null) return;
            plugMain.pageData.closeTipsIndex = GM_addValueChangeListener(
                "closeLJTS",
                function (name, old_value, new_value, remote) {
                    plugMain.pageData.ljtsIndexArr.forEach(item => {
                        layer.close(item);
                    })
                    plugMain.pageData.ljtsIndexArr = []
                    tipsAndClose && plugMain.tipsAndClose && plugMain.tipsAndClose(url);
                }
            );
        },
        tipsAndClose(checkUrl, timeout = 5000) {
            let mark = plugMain.now()
            plugMain.pageData.tipsAndCloseMark = mark
            plugMain.confirmRun("准备关闭当前页面，如果不想关闭请点击下面【取消执行】按钮", timeout).then((a) => {
                if (plugMain.pageData.tipsAndCloseMark != mark) {
                    isDev && console.log("页面标识变更，取消关闭窗口");
                    return
                }
                if (!checkUrl || location.href == checkUrl) window.close();
            });
        },
        closeWaitConfrimWin() {
            plugMain.setGMData("closeLJTS", plugMain.now());
        },
        removeArrEmpty(arr) {
            let res = [];
            arr.forEach((item) => {
                if (!!item && item.trim() != "") {
                    res.push(item);
                }
            });
            return res;
        },
        confirmRun(msg = "脚本：3秒后执行下一步操作", time = 3000) {
            return new Promise((resolve, reject) => {
                let isRun = true;
                // clearTimeout(plugMain.pageData.confirmRunIndex);
                let confirmRunIndex =
                    layer.open({
                        type: '1',
                        title: '脚本：是否继续执行？',
                        closeBtn: 0,
                        zIndex: plugMain.pageData.confirmRunZIndex++,
                        btn: '取消执行',
                        offset: "100px",
                        content: `<div style="padding:20px;">${msg}</div>`,
                        yes: function (index) {
                            isRun = false;
                            reject();
                            layer.close(confirmRunIndex);
                        }
                    });

                // layer.alert(
                //   msg,
                //   { icon: 3, title: "是否继续？", btn: ["取消执行"], offset: "100px" },
                //   function (index) {
                //     isRun = false;
                //     reject();
                //     layer.close(plugMain.pageData.confirmRunIndex);
                //   }
                // );
                setTimeout(() => {
                    layer.close(confirmRunIndex);
                    resolve(true);
                }, time);
            });
        },
        waitTimeout(timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        },
        waitOf(fun, interval = 1000, timeout = 30) {
            console.log("%c waitOf", "background:rgb(0,0,0);color:#fff", fun);
            return new Promise((resolve, reject) => {
                let _timeOut = timeout * 1000;
                try {
                    if (fun()) {
                        return resolve();
                    }
                } catch (e) {
                    console.error(e);
                }
                let index = setInterval(() => {
                    try {
                        if (timeout != -1) {
                            _timeOut -= interval;
                            if (_timeOut < 0) {
                                clearInterval(index);
                                return reject();
                            }
                        }
                        if (fun()) {
                            clearInterval(index);
                            return resolve();
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }, interval);
            });
        },
        getUrlParam(url, name) {
            if (arguments.length == 1) {
                name = url;
                url = window.location;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return "";
        },
        objectToQueryString(obj) {
            var queryParams = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    // 如果值为数组，则将其转换为多个参数
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            queryParams.push(
                                encodeURIComponent(key) + "=" + encodeURIComponent(value[i])
                            );
                        }
                    } else {
                        queryParams.push(
                            encodeURIComponent(key) + "=" + encodeURIComponent(value)
                        );
                    }
                }
            }
            return queryParams.join("&");
        },
        parseQueryString(url = window.location.href) {
            //url参数转对象
            url = !url ? window.location.href : url;
            if (url.indexOf("?") === -1) {
                return {};
            }
            let search =
                url[0] === "?"
                    ? url.substr(1)
                    : url.substring(url.lastIndexOf("?") + 1);
            if (search === "") {
                return {};
            }
            search = search.split("&");
            let query = {};
            for (let i = 0; i < search.length; i++) {
                let pair = search[i].split("=");
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
            }
            return query;
        },
        getAttrName(el, key) {
            if (el.jquery) el = el.get(0);
            let propName = Object.keys(el).find((a) => a.startsWith(key));
            return propName;
        },
        getAttrNameList(el, key) {
            if (el.jquery) el = el.get(0);
            let propName = Object.keys(el).filter((a) => a.startsWith(key));
            return propName;
        },
        alertMsg(msg, timeout = 0) {
            layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: "脚本提示" + (timeout == 0 ? '' : `（${(timeout / 1000).toFixed(2)}秒后自动关闭}）`),
                    offset: "100px",
                    time: timeout,
                    btn: "关闭"
                })
        },
        tipsMsg(msg, timeout = 3000) {
            layer.msg(msg, { offset: "100px", time: timeout });
        },
        confirmMsg(msg = "请确认", option = {}) {
            let defConfig = {
                title: "脚本提示", btn: ["确定", "关闭"],
                offset: "100px",
                area: ["500px"],
                shade: 0.3,
                fun1(index) { layer.close(index) },
                fun2() { },
                fun3() { }
            }
            Object.assign(defConfig, option)
            layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: option.title,
                    offset: defConfig.offset,
                    area: defConfig.area,
                    btn: defConfig.btn,
                    shade: defConfig.shade,
                    yes: defConfig.fun1,
                    btn2: defConfig.fun2,
                    btn3: defConfig.fun3
                })
        },
        matchUrl(urlKeyword, mode = "like", url = location.href) {
            let res = false;
            switch (mode) {
                case "eq":
                    res = urlKeyword == url;
                    break;
                case "like":
                    res = url.indexOf(urlKeyword) != -1;
                    break;
                case "left":
                    res = url.startsWith(urlKeyword);
                    break;
                case "right":
                    res = url.endsWith(urlKeyword);
                    break;
            }
            return res;
        },
        getPromiseWithAbort(p) {
            let obj = {};
            let p1 = new Promise(function (resolve, reject) {
                obj.abort = reject;
            });
            obj.promise = Promise.race([p, p1]);
            return obj;
        },
        page_yhwelcome() {
            console.log("%c page_yhwelcome", "background:rgb(255,0,0);color:#fff");
            var token = sessionStorage.getItem("token");
            this.setGMData("token", token);
            this.setGMData("login", { login: true, time: plugMain.now() });
        },
        createWorker(f) {
            var blob = new Blob(["(" + f + ")()"]);
            var url = window.URL.createObjectURL(blob);
            var worker = new Worker(url);
            return worker;
        },
        createIntervalWorker(callback, time) {
            var pollingWorker = plugMain.createWorker(`async function (e) {
                setInterval(async function () {
                  this.postMessage(null)
                }, ${time})
              }`);
            pollingWorker.onmessage = callback;
            return pollingWorker;
        },
        createTimeoutWorker(callback, time) {
            var pollingWorker = plugMain.createWorker(`async function (e) {
                  setTimeout(async function () {
                    this.postMessage(null)
                  }, ${time})
                }`);
            pollingWorker.onmessage = function () {
                callback();
                plugMain.stopWorker(pollingWorker);
            };
            return pollingWorker;
        },
        stopWorker(vm) {
            try {
                vm && vm.terminate();
            } catch (err) {
                console.log(err);
            }
        },
        getGMData(item, def) {
            return GM_getValue(item, def);
        },
        setGMData(item, val) {
            return GM_setValue(item, val);
        },
        delGMData(item, val) {
            return GM_deleteValue(item);
        },
        generateRandomString(length) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let randomString = "";

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                randomString += charset.charAt(randomIndex);
            }

            return randomString;
        },
        timeSecondsFormat(seconds) {
            // 确保秒数为非负整数  
            seconds = Math.floor(Math.abs(seconds));

            // 计算小时、分钟和秒  
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var secs = seconds % 60;

            // 如果小时、分钟或秒小于10，则在其前面添加一个0  
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            secs = (secs < 10) ? "0" + secs : secs;

            // 返回格式化的时间字符串  
            return hours + ":" + minutes + ":" + secs;
        },
        // 时间转换成秒
        timeStringToSeconds(timeString) {
            if (!timeString.includes("时")) {
                timeString = '0时' + timeString
            }
            timeString = timeString
                .replace("小时", ":")
                .replace("时", ":")
                .replace("分钟", ":")
                .replace("分", ":")
                .replace("秒", "");
            if (timeString.endsWith(":")) {
                timeString = timeString.substring(0, timeString.length - 1);
            }
            const parts = timeString.split(":");
            if (parts.length !== 3) {
                if (parts.length == 2) {
                    parts.push(0);
                } else {
                    throw new Error("Invalid time string format. Expected 'hh:mm:ss'.");
                }
            }

            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                throw new Error("Invalid time string format. Expected numeric values.");
            }

            return hours * 3600 + minutes * 60 + seconds;
        },
        getLocalData(item, def) {
            var val = localStorage.getItem(item);
            if (val == null) return def;

            return JSON.parse(val).val;
        },
        setLocalData(item, val) {
            return localStorage.setItem(item, JSON.stringify({ val: val }));
        },
        setFormVal(selector, formVal) {
            $.each(formVal, function (key, val) {
                let $el = $(selector).find(`[name="${key}"]`);
                // console.log($el);
                // console.log(key, $el.eq(0).attr("type"));
                if ($el.length == 0) return true;
                else if ($el.length == 1) {
                    let type = $el.eq(0).attr("type");
                    switch (type) {
                        case "radio":
                        case "checkbox":
                            if ($el.val() == val) $el.prop("checked", true);
                            break;
                        default:
                            $el.val(val);
                            break;
                    }
                } else {
                    $el.each((i, el) => {
                        // console.log($(el), $(el).val());
                        if (val.includes($(el).val())) {
                            $(el).prop("checked", true);
                        }
                    });
                }
            });
        },
        getFormVal(selector) {
            let formVal = {};
            var arr = $(selector).serializeArray();
            let tempArr = [];
            $.each(arr, function () {
                console.log(this);
                if (!tempArr.includes(this.name)) {
                    tempArr.push(this.name);
                    formVal[this.name] = this.value;
                } else {
                    let oldVal = formVal[this.name];
                    if (Array.isArray(oldVal)) {
                        formVal[this.name].push(this.value);
                    } else {
                        formVal[this.name] = [formVal[this.name], this.value];
                    }
                }
            });
            return formVal;
        },
        now() {
            return new Date().getTime();
        },
        getElByText(query, text, mode = "eq", visible = true) {
            let $el = null;
            $(query).each((i, el) => {
                if (visible && !$(el).is(":visible")) {
                    return true;
                }
                if (mode == "eq" && $(el).text().trim() == text) {
                    $el = $(el);
                    return false;
                } else if (
                    mode == "startsWith" &&
                    $(el).text().trim().startsWith(text)
                ) {
                    $el = $(el);
                    return false;
                } else if (mode == "endsWith" && $(el).text().trim().endsWith(text)) {
                    $el = $(el);
                    return false;
                }
            });
            return $el;
        },
        getElListByText(query, text, mode = "eq", visible = true) {
            let arr = [];
            $(query).each((i, el) => {
                if (visible && !$(query).is(":visible")) {
                    return true;
                }
                if (mode == "eq" && $(el).text().trim() == text) {
                    arr.push($(el));
                } else if (
                    mode == "startsWith" &&
                    $(el).text().trim().startsWith(text)
                ) {
                    arr.push($(el));
                } else if (mode == "endsWith" && $(el).text().trim().endsWith(text)) {
                    arr.push($(el));
                }
            });
            return arr;
        },
        random(min, max) {
            // 生成随机数范围
            if (arguments.length === 2) {
                return Math.floor(min + Math.random() * (max + 1 - min));
            } else {
                return null;
            }
        },
        downloadTxt(filename, text) {
            var element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(text)
            );
            element.setAttribute("download", filename);

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        dateFormat(date = new Date(), fmt = "yyyy-MM-dd HH:mm") {
            let ret;
            if (typeof date === "number") date = new Date(date);
            const opt = {
                "y+": date.getFullYear().toString(), // 年
                "M+": (date.getMonth() + 1).toString(), // 月
                "d+": date.getDate().toString(), // 日
                "H+": date.getHours().toString(), // 时
                "m+": date.getMinutes().toString(), // 分
                "s+": date.getSeconds().toString(), // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(
                        ret[1],
                        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
                    );
                }
            }
            return fmt;
        },
    });
    setTimeout(() => {
        if (!unsafeWindow.zfk) {
            plugMain.init();
        } else {
            console.log('skip init');
        }
    }, 3000);
    if (!unsafeWindow.plugMain) unsafeWindow.plugMain = plugMain;
})();
