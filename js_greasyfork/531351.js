// ==UserScript==
// @name   🌱【免费版】新疆维吾尔自治区药学服务平台|如需自动下一集、秒过、考试答题等高级功能见收费版本：https://doc.zhanyc.cn/pages/xjyx/
// @namespace    http://jb.zhanyc.cn/
// @icon    https://js.zhanyc.cn/img/js-logo.svg
// @version      1.0
// @description  当前是免费版本，只包含了视频页面自动播放、解除播放暂停限制功能。如需自动下一集、秒过、考试答题、全自动无人值守高级功能可升级付费版本，一杯咖啡钱，保你无忧学习，且永久使用|接各类脚本开发、代挂工作，微信：zhanyc_cn 备用微信:zhanfengkuo 个人网站：http://doc.zhanyc.cn
// @author       zfk
// @include    *://*xjyxjyw.com*
// @include    *://*.xjyxjyw.com/*
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
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @require https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @antifeature 
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/531351/%F0%9F%8C%B1%E3%80%90%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E6%96%B0%E7%96%86%E7%BB%B4%E5%90%BE%E5%B0%94%E8%87%AA%E6%B2%BB%E5%8C%BA%E8%8D%AF%E5%AD%A6%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%A6%82%E9%9C%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E3%80%81%E7%A7%92%E8%BF%87%E3%80%81%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E7%AD%89%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD%E8%A7%81%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%EF%BC%9Ahttps%3Adoczhanyccnpagesxjyx.user.js
// @updateURL https://update.greasyfork.org/scripts/531351/%F0%9F%8C%B1%E3%80%90%E5%85%8D%E8%B4%B9%E7%89%88%E3%80%91%E6%96%B0%E7%96%86%E7%BB%B4%E5%90%BE%E5%B0%94%E8%87%AA%E6%B2%BB%E5%8C%BA%E8%8D%AF%E5%AD%A6%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%A6%82%E9%9C%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%E3%80%81%E7%A7%92%E8%BF%87%E3%80%81%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%E7%AD%89%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD%E8%A7%81%E6%94%B6%E8%B4%B9%E7%89%88%E6%9C%AC%EF%BC%9Ahttps%3Adoczhanyccnpagesxjyx.meta.js
// ==/UserScript==
(function () {
    let $jq = $;
    unsafeWindow.$jq = $;
    let baseConfig = {}

    let freeTips = "当前是免费版本，只包含了视频页面自动播放、解除播放暂停限制功能。如需自动下一集、秒过、考试答题、全自动无人值守高级功能，可点击下方按钮查看付费版本"
    let docUrl = "https://doc.zhanyc.cn/pages/xjyx/";
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
            let run = true;
            if (run) plugMain.firstRun();
        },
        async addMenu() {
            await plugMain.waitOf(a => $("body:visible").length > 0)
            if ($("#zfkLeftMenuContainer").length > 0) return;
            GM_addStyle(`#zfkLeftMenuContainer{z-index:9999;position:fixed;left:0;top:40%;color:#fff;box-shadow:0 0 10px #00ffcc,0 0 20px #00ffcc,0 0 30px #00ffcc;animation:glowAnimation 3s infinite alternate;}@keyframes glowAnimation{0%{box-shadow:0 0 10px #00ffcc,0 0 20px #00ffcc,0 0 30px #00ffcc;}20%{box-shadow:0 0 15px #ff66cc,0 0 25px #ff66cc,0 0 35px #ff66cc;}40%{box-shadow:0 0 10px #ffcc33,0 0 20px #ffcc33,0 0 30px #ffcc33;}60%{box-shadow:0 0 15px #66ff66,0 0 25px #66ff66,0 0 35px #66ff66;}80%{box-shadow:0 0 10px #3399ff,0 0 20px #3399ff,0 0 30px #3399ff;}100%{box-shadow:0 0 10px #fffb00,0 0 20px #fffb00,0 0 30px #fffb00;}}#zfkLeftMenuContainer .zfkLeftMenuStep{position:absolute;background:#3498db;width:max-content;top:-35px;display:block;padding:6px}#zfkLeftMenuContainer .zfkLeftMenu{background:rgba(0,0,0,0.4);border-radius:0 4px 4px 0;padding:6px}#zfkLeftMenuContainer .zfkLeftMenu:hover .zfkLeftMenuBtn-titile{width:auto}#zfkLeftMenuContainer .zfkLeftMenu .zfkLeftMenuBtn-titile{cursor:pointer;word-wrap:break-word;width:1em;display:inline-block}#zfkLeftMenuContainer .zfkLeftMenu .zfkLeftMenuBtnUl{display:none;margin:0 -6px;box-sizing:border-box}#zfkLeftMenuContainer .zfkLeftMenu .zfkLeftMenuBtnUl li{list-style:none;color:#fff !important;cursor:pointer;padding:6px}#zfkLeftMenuContainer .zfkLeftMenu .zfkLeftMenuBtnUl li:hover{background:#000}#zfkLeftMenuContainer .zfkLeftMenu .zfkLeftMenuBtnUl li::before{content:"+ "}#zfkIp51Config{padding:10px}#zfkLeftMenuContainer *{font-size:14px}`);
            $(`<div id="zfkLeftMenuContainer">
            <div class="zfkLeftMenu">
              <span class="zfkLeftMenuBtn-titile">菜单</span>
              <ul class="zfkLeftMenuBtnUl">
              </ul>
        
            </div>
            </div>`).appendTo("body");
            $(".zfkLeftMenu").hover(
                () => {
                    $(".zfkLeftMenuBtnUl").show();
                },
                () => {
                    $(".zfkLeftMenuBtnUl").hide();
                }
            );
        },
        async runByUrl(url) {
            url = url.toLocaleLowerCase()
            if (url.includes("/yxfw/a/tra/traCsTheory/play".toLocaleLowerCase())) {
                zfk.page_video();
            } else if (url.includes("/yxfw/a/tra/traCsTheory/list".toLocaleLowerCase()) || url.includes('/yxfw/a/tra/traCsTheory?tabPageId'.toLocaleLowerCase())) {
                plugMain.showPaidContent(`免费版本不包含自动换课、无人值守功能，如需使用请安装收费版本`);
            } else if (url.includes("/traQuestion/paper".toLocaleLowerCase())) {
                plugMain.showPaidContent(`免费版本不包含答题功能，如需使用请安装收费版本`);
            }



        },
        async page_video() {
            plugMain.closeWaitConfrimWin()
            console.log("%c page_video", "background:rgb(0,0,0);color:#fff");
            let timeout = 2;
            let lastTime = null;
            let checkTimeTimesBak = 60;
            let checkTimeTimes = checkTimeTimesBak;
            plugMain.closeWaitConfrimWin();
            if (plugMain.pageData.video.index != null) {
                return;
            }
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
                            plugMain.confirmRun("貌似卡死了，刷新下页面").then((a) => {
                                location.reload()
                            });
                            plugMain.pageData.waitTime = 10;
                            return;
                        }
                    } else {
                        lastTime = curTime;
                        checkTimeTimes = checkTimeTimesBak;
                    }
                    plugMain.getVideo().volume = 0;
                    let title = `进度：${plugMain.getCurTime().toFixed(0)}/${plugMain
                        .getTotalTime()
                        .toFixed(0)}`;
                    $("title").text(title);

                    console.log("%c video run", "background:rgb(255,0,0);color:#fff");

                    let isFinish = await plugMain.isPlayFinish();
                    if (isFinish) {
                        plugMain.pageData.waitTime = 15;

                        plugMain.alertMsg("视频即将结束，等待下一步操作", { time: 10 * 1000 });
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
            plugMain.tipsMsg("视频即将结束，等待下一步操作", { time: 10 * 1000 });

            setTimeout(() => {

                plugMain.showPaidContent(`自动下一集启动失败，免费版本不包含自动换课、无人值守功能，如需使用请安装收费版本`);
            }, 10 * 1000);
        },
        firstRun() {
            if (top === window && plugMain.getGMData("showDoc", true)) {
                plugMain.confirmMsg(
                    freeTips,
                    {
                        icon: 3, title: "首次使用？", btn: ["查看付费版本", "继续使用免费版本"],
                        fun1: function (index) {
                            plugMain.openDoc();
                            Swal.close()
                            plugMain.setGMData("showDoc", false);
                            plugMain.begin("");
                        },
                        fun2: function () {
                            plugMain.setGMData("showDoc", false);
                            plugMain.begin("");
                        }
                    });
            } else {
            }
            plugMain.begin("");
        },
        async begin(key) {
            if (window === top) {
                plugMain.registerMenuCommand();
                plugMain.addMenu()
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
                    Swal.close()
                }
            }
            Swal.fire({
                title: "免费版本提示",
                html: `<div style="padding:14px;">${msg}</div>`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                position: "bottom-end",
                backdrop: false,
                padding: "1em",
                cancelButtonColor: "#d33",
                confirmButtonText: "查看收费版本"
            }).then((result) => {
                if (result.isConfirmed) {
                    plugMain.openDoc()
                    return false
                }
            });
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
        async callRegisterMenuCommand(name, fun) {
            if (!plugMain.pageData.menuBtnIndex) {
                plugMain.pageData.menuBtnIndex = 0;
            }
            GM_registerMenuCommand(name, fun)
            await plugMain.waitOf(a => $("body:visible").length > 0)
            await plugMain.waitTimeout(500)
            if ($("#zfkLeftMenuContainer").length > 0) {
                plugMain.pageData.menuBtnIndex++;
                $("#zfkLeftMenuContainer .zfkLeftMenuBtnUl").append(`<li id="zfkMenuBtn_${plugMain.pageData.menuBtnIndex}">${name}</li>`)
                $(`#zfkMenuBtn_${plugMain.pageData.menuBtnIndex}`).click(function () {
                    fun();
                });
            }
        },
        registerMenuCommand() {
            plugMain.callRegisterMenuCommand("当前是免费版", plugMain.openDoc);
            plugMain.callRegisterMenuCommand("点此安装付费版本", plugMain.openDoc);
            plugMain.callRegisterMenuCommand("联系脚本客服", plugMain.linkAuthor);
        },
        linkAuthor() {
            window.open("http://doc.zhanyc.cn/contact-me/");
        },
        addStyle() {
            GM_addStyle(`
        .zfk-btn{background-color:#0fbcf9;color:white;padding:4px 12px;border:none;box-sizing:content-box;font-size:14px;height:20px;border-radius:4px;cursor:pointer;display:inline-block;border:1px solid transparent;white-space:nowrap;user-select:none;text-align:center;vertical-align:middle}.zfk-btn:hover{opacity:.8}.zfk-btn.success{background-color:#38b03f}.zfk-btn.warning{background-color:#f1a325}.zfk-btn.info{background-color:#03b8cf}.zfk-btn.danger{background-color:#ea644a}.zfk-form-tips{font-size:1.2em;color:red}.tips{color:red}.zfk-form textarea,.zfk-form input[type=text],.zfk-form input[type=number],.zfk-form input[type=password]{border:1px solid #888;border-radius:4px;padding:5px;box-sizing:border-box}.zfk-form textarea{width:100%}.zfk-form-item{margin-bottom:10px}.zfk-form-item>label:first-child{width:7em;text-align:right;display:inline-block;padding-right:5px;margin-right:0}.zfk-form-item label{margin-right:4px}.zfk-form-item.block>label:first-child{text-align:left;display:block;width:100%;font-weight:bold}.text-l{text-align:left !important}.text-c{text-align:center !important}.text-r{text-align:right !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.p-t-0{padding-top:0px !important}.p-t-5{padding-top:5px !important}.p-t-10{padding-top:10px !important}.p-t-15{padding-top:15px !important}.p-t-20{padding-top:20px !important}.p-b-0{padding-bottom:0px !important}.p-b-5{padding-bottom:5px !important}.p-b-10{padding-bottom:10px !important}.p-b-15{padding-bottom:15px !important}.p-b-20{padding-bottom:20px !important}.p-l-0{padding-left:0px !important}.p-l-5{padding-left:5px !important}.p-l-10{padding-left:10px !important}.p-l-15{padding-left:15px !important}.p-l-20{padding-left:20px !important}.p-r-0{padding-right:0px !important}.p-r-5{padding-right:5px !important}.p-r-10{padding-right:10px !important}.p-r-15{padding-right:15px !important}.p-r-20{padding-right:20px !important}.p-0{padding:0px !important}.p-5{padding:5px !important}.p-10{padding:10px !important}.p-15{padding:15px !important}.p-20{padding:20px !important}.m-t-0{margin-top:0px !important}.m-t-5{margin-top:5px !important}.m-t-10{margin-top:10px !important}.m-t-15{margin-top:15px !important}.m-t-20{margin-top:20px !important}.m-b-0{margin-bottom:0px !important}.m-b-5{margin-bottom:5px !important}.m-b-10{margin-bottom:10px !important}.m-b-15{margin-bottom:15px !important}.m-b-20{margin-bottom:20px !important}.m-l-0{margin-left:0px !important}.m-l-5{margin-left:5px !important}.m-l-10{margin-left:10px !important}.m-l-15{margin-left:15px !important}.m-l-20{margin-left:20px !important}.m-r-0{margin-right:0px !important}.m-r-5{margin-right:5px !important}.m-r-10{margin-right:10px !important}.m-r-15{margin-right:15px !important}.m-r-20{margin-right:20px !important}.bold{font-weight:bold !important}.tips-box{padding:10px;border:1px solid red;background-color:#fff0f0;color:red}.bold{font-weight:bold}.font-l{font-size:1.2em}.font-xl{font-size:40px}.font-l{font-size:25px}.color-default{color:#ea644a !important}.color-success{color:#38b03f !important}.color-warning{color:#f1a325 !important}.color-danger{color:#ea644a !important}.bg-default{background-color:#ea644a !important}.bg-success{background-color:#38b03f !important}.bg-warning{background-color:#f1a325 !important}.bg-danger{background-color:#ea644a !important}.zfk-table{border-collapse:collapse}.zfk-table thead{background-color:#1abc9c}.zfk-table td,.zfk-table th{text-align:center;padding:6px;border:1px solid #888}.zfk-table tr:nth-child(2n){background-color:#f2f2f2}.zfk-table tr:hover{background-color:#fff799}.zfk-container *{font-size:17px}
        `);
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
                Swal.fire({
                    title: "脚本：是否继续执行？",
                    text: msg,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "取消执行"
                }).then((result) => {
                    isRun = false;
                    Swal.close()
                    reject();
                });
                setTimeout(() => {
                    Swal.close()
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
            Swal.fire({
                title: "脚本提示" + (timeout == 0 ? '' : `（${(timeout / 1000).toFixed(2)}秒后自动关闭}）`),
                text: msg,
                timerProgressBar: true,

            });
        },
        tipsMsg(msg, timeout = 3000) {
            Swal.fire({
                title: msg,
                timer: timeout,
                position: "top-end",
                timerProgressBar: true,
                backdrop: false,
                showConfirmButton: false,
            });
        },
        confirmMsg(msg = "请确认", option = {}) {
            let defConfig = {
                title: "脚本提示",
                btn: ["确定", "关闭"],
                offset: "100px",
                area: ["500px"],
                shade: 0.3,
                fun1() { },
                fun2() { },
                fun3() { }
            }
            Object.assign(defConfig, option)
            Swal.fire({
                title: defConfig.title,
                text: msg,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: defConfig.btn[0],
                cancelButtonText: defConfig.btn[1]
            }).then((result) => {
                if (result.isConfirmed) {
                    defConfig.fun1()
                } else {
                    defConfig.fun2()
                }
            });
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
