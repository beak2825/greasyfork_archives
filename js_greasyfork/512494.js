// ==UserScript==
// @name   🌱【免费版】气象远程教育网|如需自动秒过高级功能见收费版本：https://doc.zhanyc.cn/pages/qxycjyw/
// @namespace    http://jb.zhanyc.cn/
// @icon    https://js.zhanyc.cn/img/js-logo.svg
// @version      1.1
// @description  当前是免费版本，只包含了视频页面自动播放、自动下一集、解除播放暂停限制功能。如需自动自动换大章节、自动换大课程、秒过、全自动无人值守等高级功能可升级付费版本，一杯咖啡钱，保你无忧学习，且永久使用|接各类脚本开发、代挂工作，微信：zhanyc_cn 备用微信:zhanfengkuo 个人网站：http://doc.zhanyc.cn
// @author       zfk
// @include    *://*.cmatc.cn/*
// @include    *://*.cmatc.cma.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/512494/%F0%9F%8C%B1%E3%80%90%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E6%B0%94%E8%B1%A1%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E7%BD%91%7C%E5%A6%82%E9%9C%80%E8%87%AA%E5%8A%A8%E7%A7%92%E8%BF%87%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD%E8%A7%81%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%EF%BC%9Ahttps%3Adoczhanyccnpagesqxycjyw.user.js
// @updateURL https://update.greasyfork.org/scripts/512494/%F0%9F%8C%B1%E3%80%90%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E6%B0%94%E8%B1%A1%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E7%BD%91%7C%E5%A6%82%E9%9C%80%E8%87%AA%E5%8A%A8%E7%A7%92%E8%BF%87%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD%E8%A7%81%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%EF%BC%9Ahttps%3Adoczhanyccnpagesqxycjyw.meta.js
// ==/UserScript==
(function () {
    // @run-at      document-start
    let $jq = $;
    unsafeWindow.$jq = $;
    unsafeWindow.layer = layer;
    let baseConfig = {}

    let freeTips = " 当前是免费版本，只包含了视频页面自动播放、自动下一集功能。如需自动自动换大章节、自动换大课程、秒过、全自动无人值守等高级功能，可点击下方按钮查看付费版本"
    let docUrl = "https://doc.zhanyc.cn/pages/qxycjyw/";
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


            if (url.includes("/Learn/recordLearnTime.do")) {

            } else if (url.includes("Learn/dislessonmp4flvplayer.do") || url.includes('/qiusuo/')) {

            } else if (url.includes("/Learn/enter.do?")) {
                plugMain.page_videoTop();
            } else if (url.includes("/Userselectlesson/show.do") ||
                url.includes('Userselectlesson/commonlessonshow.do')) {
                plugMain.page_courseDetail()
            } else if (url.includes("/Trainclass/trainclassIndex.do?")) {
                plugMain.showPaidContent(`免费版本不包含自动换课、无人值守功能，如需使用请安装收费版本`);
            } else if (url.includes("/Userselectlesson/onlineLessonList.do?")) {
                plugMain.showPaidContent(`免费版本不包含自动换课、无人值守功能，如需使用请安装收费版本`);
            } else if (url.includes("/showTopic.do?trainForm=3")) {

            } else if (url.includes("/qhjs/")) {
                plugMain.page_video_qhjs();
            }
        },

        async page_videoTop() {
            console.log("%c page_videoParent", "background:rgb(0,0,0);color:#fff");
            plugMain.closeWaitConfrimWin()
            GM_addValueChangeListener(
                "close",
                function (name, old_value, new_value, remote) {
                    window.close();
                }
            );
        },
        async page_courseDetail() {
            console.log("%c page_courseDetail", "background:rgb(0,0,0);color:#fff");
            GM_addValueChangeListener('videoFinish', function (name, old_value, new_value, remote) {
                location.reload()
            })
            await plugMain.waitOf(a => $(`.table-list a[onclick^="startLesson("]`).length > 0)
            await plugMain.waitTimeout(500)
            let $el = null
            $(`.table-list a[onclick^="startLesson("]`).each((i, el) => {
                if ($(el).parents('td:first').next().attr('title') == '已完成'
                    || $(el).parents('td:first').next().attr('title').startsWith('已完成100')
                    || $(el).parents('td:first').next().attr('title').includes('100%')
                ) {
                    return true
                }
                $el = $(el)
                return false
            })
            if ($el == null) {
                let userData = await plugMain.getUserData()
                userData.finishCourseArr.push($(".ke_video a[title]").attr('title'))
                await plugMain.setUserData(userData)
                plugMain.confirmRun(
                    "学习完成，前往列表页面"
                ).then(a => {
                    location.href = plugMain.getGMData('listUrl', '/')
                })
                return;
            }
            plugMain.setGMData("courseDetailUrl", location.href);
            plugMain.confirmRun("3秒后执行下一步", 3000).then((a) => {
                $el[0].click();
                plugMain.openLjTips(false)
            });
        },
        async page_video_qhjs() {
            console.log("%c page_showTopic3", "background:rgb(0,0,0);color:#fff");
            plugMain.closeWaitConfrimWin()
            plugMain.tipsMsg("未开启秒过")
            let timeout = 2;
            let lastTime = null;
            let checkTimeTimesBak = 60;
            let checkTimeTimes = checkTimeTimesBak;
            plugMain.closeWaitConfrimWin();
            if (plugMain.pageData.video.index != null) {
                return;
            }
            setTimeout(async () => {
                let time = plugMain.getCurTime()
                await plugMain.waitTimeout(5000)
                if (plugMain.getCurTime() == time) {
                    plugMain.confirmRun("貌似卡主了，3秒后刷新页面").then(a => {
                        location.reload()
                    })
                }
            }, 60 * 1000);
            plugMain.pageData.video.index = setInterval(async () => {
                try {
                    if (plugMain.pageData.waitTime > 0) {
                        plugMain.pageData.waitTime -= timeout;
                        return;
                    }
                    if (!plugMain.getVideo()) {
                        console.log("%c zfk no video", "background:rgb(0,0,0);color:#fff");
                        return;
                    }

                    let curTime = plugMain.getCurTime();
                    if (curTime == lastTime) {
                        lastTime = plugMain.getCurTime();
                        checkTimeTimes -= timeout;
                        if (checkTimeTimes <= 0) {
                            checkTimeTimes = checkTimeTimesBak;
                            plugMain.confirmRun("貌似卡死了，前往列表页面").then((a) => {
                                location.href = plugMain.getGMData("courseDetailUrl", "/");
                            });
                            plugMain.pageData.waitTime = 10;
                            return;
                        }
                    } else {
                        lastTime = curTime;
                        checkTimeTimes = checkTimeTimesBak;
                    }
                    plugMain.getVideo().volume = 0;
                    let title = `进度：${plugMain.getCurTime().toFixed(0)}/${plugMain.getTotalTime()
                        .toFixed(0)}`;
                    $("title").text(title);
                    // plugMain.setGMData("updateTitle", title)

                    console.log("%c video run", "background:rgb(255,0,0);color:#fff");
                    if (plugMain.getElByText($("div.user_choise"), "开始学习") != null) {
                        plugMain.getElByText($("div.user_choise"), "开始学习").click();
                        return;
                    }
                    let isFinish = await plugMain.isPlayFinish();
                    if (isFinish) {
                        plugMain.pageData.waitTime = 15;
                        layer.msg("视频即将结束，等待下一步操作", { time: 10 * 1000 });
                        // plugMain.pageData.waitTime = plugMain.getTotalTime() - plugMain.getCurTime() + 1;
                        plugMain.nextVideo();

                        clearInterval(plugMain.pageData.video.index)
                        plugMain.pageData.video.index = null
                        return;
                    }
                    let isPlay = await plugMain.videoIsPlay();
                    if (!isPlay) {
                        if (!isFinish) {
                            plugMain.play();
                        }
                    }
                } catch (e) {
                    console.error("视频页面定时器出错", e);
                }
            }, timeout * 1000);
        },
        nextVideo() {
            layer.msg("视频即将结束，等待下一步操作", { time: 10 * 1000 });

            setTimeout(() => {
                plugMain.setGMData("videoFinish", plugMain.now())
                plugMain.setGMData('close', plugMain.now())
            }, 10 * 1000);
        },
        page_top() {
            GM_addValueChangeListener('openLjts', function (name, old_value, new_value, remote) {
                plugMain.openLjTips()
            })
        },
        firstRun() {
            if (top === window && plugMain.getGMData("showDoc", true)) {
                layer.confirm(
                    freeTips,
                    { icon: 3, title: "首次使用？", btn: ["查看付费版本", "继续使用免费版本"] },
                    function (index) {
                        plugMain.openDoc();
                        layer.close(index);
                        plugMain.setGMData("showDoc", false);
                        plugMain.begin("");
                    },
                    function () {
                        plugMain.setGMData("showDoc", false);
                        plugMain.begin("");
                    }
                );
            } else {
            }
            plugMain.begin("");
        },
        async begin(key) {
            if (window === top) {
                plugMain.registerMenuCommand();
            }
            // let lastUrl =location.href;

            // setInterval(async () => {
            //   if (lastUrl != location.href) {
            //     lastUrl = location.href;
            //     plugMain.runByUrl(location.href);
            //   }
            // }, 500);
            plugMain.runByUrl(location.href);
        },

        async showPaidContent(msg = "此页面为付费内容，免费脚本不包含", withPostfix = true) {
            if (withPostfix) {
                msg += "<span style='font-weight:bold;'>*重要：一个学员付费一次，永久使用，永久更新!</span>"
            }
            if (!plugMain.pageData.paidIndexArr) {
                plugMain.pageData.paidIndexArr = []
            }
            if (plugMain.pageData.paidIndexArr.length > 0) {
                for (let i = 0; i < plugMain.pageData.paidIndexArr.length; i++) {
                    const index = plugMain.pageData.paidIndexArr[i];
                    layer.close(index)
                }
            }
            let index = layer.open(
                {
                    type: "1",
                    content: `<div style="padding:14px;">${msg}</div>`,
                    title: "免费版本提示",
                    offset: "rb",
                    area: ["500px"],
                    btn: ["查看收费版本", "关闭"],
                    shade: 0,
                    yes: function (index) { plugMain.openDoc() }
                })
            plugMain.pageData.paidIndexArr.push(index)
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
                window.open("http://doc.zhanyc.cn/pages/auth/");
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
            window.open("http://doc.zhanyc.cn/contact-me/");
        },
        setClip(txt) {
            GM_setClipboard(txt, "text");
            layer.msg("复制成功");
        },
        addStyle() {
            GM_addStyle(`
        .zfk-btn{background-color:#0fbcf9;color:white;padding:4px 12px;border:none;box-sizing:content-box;font-size:14px;height:20px;border-radius:4px;cursor:pointer;display:inline-block;border:1px solid transparent;white-space:nowrap;user-select:none;text-align:center;vertical-align:middle}.zfk-btn:hover{opacity:.8}.zfk-btn.success{background-color:#38b03f}.zfk-btn.warning{background-color:#f1a325}.zfk-btn.info{background-color:#03b8cf}.zfk-btn.danger{background-color:#ea644a}.zfk-form-tips{font-size:1.2em;color:red}.tips{color:red}.zfk-form textarea,.zfk-form input[type=text],.zfk-form input[type=number],.zfk-form input[type=password]{border:1px solid #888;border-radius:4px;padding:5px;box-sizing:border-box}.zfk-form textarea{width:100%}.zfk-form-item{margin-bottom:10px}.zfk-form-item>label:first-child{width:7em;text-align:right;display:inline-block;padding-right:5px;margin-right:0}.zfk-form-item label{margin-right:4px}.zfk-form-item.block>label:first-child{text-align:left;display:block;width:100%;font-weight:bold}.text-l{text-align:left !important}.text-c{text-align:center !important}.text-r{text-align:right !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.p-t-0{padding-top:0px !important}.p-t-5{padding-top:5px !important}.p-t-10{padding-top:10px !important}.p-t-15{padding-top:15px !important}.p-t-20{padding-top:20px !important}.p-b-0{padding-bottom:0px !important}.p-b-5{padding-bottom:5px !important}.p-b-10{padding-bottom:10px !important}.p-b-15{padding-bottom:15px !important}.p-b-20{padding-bottom:20px !important}.p-l-0{padding-left:0px !important}.p-l-5{padding-left:5px !important}.p-l-10{padding-left:10px !important}.p-l-15{padding-left:15px !important}.p-l-20{padding-left:20px !important}.p-r-0{padding-right:0px !important}.p-r-5{padding-right:5px !important}.p-r-10{padding-right:10px !important}.p-r-15{padding-right:15px !important}.p-r-20{padding-right:20px !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.m-t-0{margin-top:0px !important}.m-t-5{margin-top:5px !important}.m-t-10{margin-top:10px !important}.m-t-15{margin-top:15px !important}.m-t-20{margin-top:20px !important}.m-b-0{margin-bottom:0px !important}.m-b-5{margin-bottom:5px !important}.m-b-10{margin-bottom:10px !important}.m-b-15{margin-bottom:15px !important}.m-b-20{margin-bottom:20px !important}.m-l-0{margin-left:0px !important}.m-l-5{margin-left:5px !important}.m-l-10{margin-left:10px !important}.m-l-15{margin-left:15px !important}.m-l-20{margin-left:20px !important}.m-r-0{margin-right:0px !important}.m-r-5{margin-right:5px !important}.m-r-10{margin-right:10px !important}.m-r-15{margin-right:15px !important}.m-r-20{margin-right:20px !important}.bold{font-weight:bold !important}.tips-box{padding:10px;border:1px solid red;background-color:#fff0f0;color:red}.bold{font-weight:bold}.font-l{font-size:1.2em}.font-xl{font-size:40px}.font-l{font-size:25px}.color-default{color:#ea644a !important}.color-success{color:#38b03f !important}.color-warning{color:#f1a325 !important}.color-danger{color:#ea644a !important}.bg-default{background-color:#ea644a !important}.bg-success{background-color:#38b03f !important}.bg-warning{background-color:#f1a325 !important}.bg-danger{background-color:#ea644a !important}.zfk-table{border-collapse:collapse}.zfk-table thead{background-color:#1abc9c}.zfk-table td,.zfk-table th{text-align:center;padding:6px;border:1px solid #888}.zfk-table tr:nth-child(2n){background-color:#f2f2f2}.zfk-table tr:hover{background-color:#fff799}.zfk-container *{font-size:17px}
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
                } else if (mode == "like" && $(el).text().trim().includes(text)) {
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
    plugMain.tipsMsg("脚本加载中")
    setTimeout(() => {
        if (!unsafeWindow.zfk) {
            plugMain.init();
        } else {
            console.log('skip init');
        }
    }, 3000);
    if (!unsafeWindow.plugMain) unsafeWindow.plugMain = plugMain;
})();
