// ==UserScript==
// @name         [飞飞]网课助手
// @namespace    wkzs_feifei
// @version      1.0.45
// @description  支持【超星学习通】【智慧树】【职教云系列】【雨课堂】【考试星】【168网校】【u校园】【大学MOOC】【云班课】【优慕课】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】 【上海开放大学】 【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网（继续教育）】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】 【湖南高等学历继续教育】 【优学院】 【学起系列】【青书学堂】 【学堂在线】【英华学堂】【广开网络教学平台】等平台的测验考试，内置题库.
// @author       feifei
// @include      *
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @require      https://lib.baomitu.com/promise-polyfill/8.3.0/polyfill.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/fingerprintjs2/2.1.4/fingerprint2.min.js
// @require      https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.4/dist/fingerprint2.min.js
// @connect      gitee.com
// @connect      cdn.staticfile.org
// @connect      cdnjs.cloudflare.com
// @connect      cdn.bootcss.com
// @connect      cdn.bootcdn.net
// @connect      cdn.staticfile.org
// @connect      unpkg.com
// @connect      www.e-campus.top
// @connect      www.ncoa.org.cn
// @connect      bytecdntp.com
// @connect      icve.com.cn
// @connect      icodef.com
// @connect      muketool.com
// @connect      ouchn.cn
// @connect      xuetangx.com
// @connect      yuketang.cn
// @connect      jpush.cn
// @connect      unipus.cn
// @connect      www.kinglinkcrusher.com
// @connect      greasyfork.org
// @connect      smartedu.cn
// @connect      zhihuishu.com
// @connect      chaoxing.com
// @connect      gaoxiaobang.com
// @connect      njcedu.com
// @connect      jsou.cn
// @connect      ulearning.cn
// @connect      kaoshixing.com
// @connect      gaoxiaobang.com
// @connect      open.com.cn
// @connect      sflep.com
// @connect      teacher.com.cn
// @connect      chinaedu.net
// @connect      sccchina.net
// @connect      netinnet.cn
// @connect      learnin.com.cn
// @connect      ct-edu.com.cn
// @connect      ismartlearning.cn
// @connect      youshiyun.com.cn
// @connect      qdjxjy.com.cn
// @connect      icourse163.org
// @connect      webtrn.cn
// @connect      gxmzu.edu.cn
// @connect      learn.courshare.cn
// @connect      haipan.net
// @connect      xiguashuwang.com
// @connect      jiaoyu139.com
// @connect      ahjxjy.cn
// @connect      qingshuxuetang.com
// @connect      168wangxiao.com
// @connect      xiaoe-tech.com
// @connect      shou.org.cn
// @connect      edu-xl.com
// @connect      hexuezx.cn
// @connect      pmphmooc.com
// @connect      47.116.118.64
// @connect      lyck6.cn
// @connect      yinghuaonline.com
// @connect      aigcfun.com
// @connect      youdao.com
// @connect      youkexuetang.cn
// @connect      cx-online.net
// @connect      sxmaps.com
// @connect      eswonline.com
// @connect      ketangx.net
// @connect      weirenzheng.cn
// @connect      cqooc.com
// @connect      edu-edu.com.cn
// @connect      fjnu.cn
// @connect      yxbyun.com
// @connect      kaoshixing.com
// @connect      beeouc.com
// @connect      edu-edu.com
// @connect      bossyun.com
// @connect      reseayun.com
// @connect      sww.com.cn
// @connect      jinkex.com
// @connect      zikaoj.com
// @connect      ls365.net
// @connect      91huayi.com
// @connect      shandong-energy.com
// @connect      ttcdw.cn
// @connect      wjx.top
// @connect      coursera.org
// @connect      ahjxjy.cn
// @connect      hbcjpt.com
// @connect      whu.edu.cn
// @connect      xjyxjyw.com
// @connect      yxlearning.com
// @connect      aqscpx.com
// @connect      dayoo.com
// @connect      ncme.org.cn
// @connect      tikuhai.com
// @connect      enncy.cn
// @connect      ocsjs.com
// @connect      mhtall.com
// @connect      ustcyun.cn
// @connect      0991xl.com
// @connect      hbysw.org
// @connect      cj-edu.com
// @connect      gzbjyzjxjy.cn
// @connect      superchutou.com
// @connect      zaixiankaoshi.com
// @connect      ynjspx.cn
// @connect      zhifa315.com
// @connect      jxjypt.cn
// @connect      hnzkw.org.cn
// @connect      wentaionline.com
// @connect      chinahrt.com
// @connect      ha.cn
// @connect      tv168.cn
// @connect      59iedu.com
// @connect      cdeledu.com
// @connect      cncecyy.com
// @connect      jste.net.cn
// @connect      ls365.net
// @connect      brjxjy.com
// @connect      dyhrsc.cn
// @connect      vmserver.cn
// @connect      qdu.edu.cn
// @connect      xidian.edu.cn
// @connect      swust.net.cn
// @connect      ggcjxjy.cn
// @connect      hebyunedu.com
// @connect      ncu.edu.cn
// @connect      jijiaool.com
// @connect      zikaosw.cn
// @connect      cmechina.net
// @connect      ewt360.com
// @connect      qlteacher.com
// @connect      mxdxedu.com
// @connect      ityxb.com
// @connect      uooc.net.cn
// @connect      scxfks.com
// @connect      tsinghuaelt.com
// @connect      enaea.edu.cn
// @connect      gzsrs.cn
// @connect      yanxiu.com
// @connect      zxhnzq.com
// @connect      chinaacc.com
// @connect      ncet.edu.cn
// @connect      tcmjy.org
// @connect      baidu.com
// @connect      xidian.edu.cn
// @connect      whut.edu.cn
// @connect      yooc.me
// @connect      cj-edu.com
// @connect      cncecyy.com
// @connect      cjnep.net
// @connect      zikao365.com
// @connect      enetedu.com
// @connect      xueyinonline.com
// @connect      kepeiol.com
// @connect      brjxjy.com
// @connect      ketangx.net
// @connect      chinamde.cn
// @connect      examcoo.com
// @connect      345u.net
// @connect      zgzjzj.com
// @connect      twt.edu.cn
// @connect      jctnb.org.cn
// @connect      21tb.com
// @connect      zj.gov.cn
// @connect      zikaosw.cn
// @connect      spicti.com
// @connect      haoyisheng.com
// @connect      enaea.edu.cn
// @connect      gzsrs.cn
// @connect      yanxiu.com
// @connect      ncet.edu.cn
// @connect      chinahrt.com
// @connect      zxhnzq.com
// @connect      ghlearning.com
// @connect      qlu.edu.cn
// @connect      baidu.com
// @connect      hii.cn
// @connect      hustsnde.com
// @connect      zgzjzj.com
// @connect      peishenjy.com
// @connect      axetk.cn
// @connect      ipmph.com
// @connect      hnscen.cn
// @connect      coursera.cn
// @connect      udemy.cn
// @connect      edx.cn
// @connect      wutp.com
// @connect      imu.edu.cn
// @connect      mhys.com.cn
// @connect      cumt.edu.cn
// @connect      scit-edu.cn
// @connect      smartchutou.com
// @connect      anpeiwang.com
// @connect      gdut.edu.cn
// @connect      dwzpzx.com
// @connect      gzucm.edu.cn
// @connect      jxuas.edu.cn
// @connect      51sunshining.com
// @connect      hzau.edu.cn
// @connect      tisco.com.cn
// @connect      myunedu.com
// @connect      snnu.edu.cn
// @connect      hiaskc.com
// @connect      mynep.com
// @connect      sinotrans.com
// @connect      educoder.net
// @connect      eduwest.com
// @connect      345u.net
// @connect      sclecb.cn
// @connect      jctnb.org.cn
// @connect      kuxiao.cn
// @connect      hsd-es.com
// @connect      caq.org.cn
// @connect      nwpu.edu.cn
// @connect      zhixueyun.com
// @connect      twt.edu.cn
// @connect      htsdedu.com
// @connect      zhongancloud.com
// @connect      taoke.com
// @connect      wuxiantiaozhan.com
// @connect      qutjxjy.cn
// @connect      yidiankai.net
// @connect      ncu.edu.cn
// @connect      gdhkmooc.com
// @connect      mxdxedu.com
// @connect      21tb.com
// @connect      haoyisheng.com
// @connect      tencentcs.com
// @connect      jijiaox.com
// @connect      czpx.cn
// @connect      ntu.edu.cn
// @connect      zsbxx.cn
// @connect      xjcde.com
// @connect      e-megasafe.com
// @connect      5any.com
// @connect      euibe.com
// @connect      whxunw.com
// @connect      geron-e.com
// @connect      gsjtpxzx.com
// @connect      zygbxxpt.com
// @connect      ibotok.com
// @connect      qhce.gov.cn
// @connect      pintia.cn
// @connect      jsut.edu.cn
// @connect      bjou.edu.cn
// @connect      gdsf.gov.cn
// @connect      qztc.edu.cn
// @connect      jiangnan.edu.cn
// @connect      wencaischool.net
// @connect      ctce.com.cn:8081
// @connect      wjx.cn
// @connect      pbcexam.cn
// @connect      chnenergy.com.cn
// @connect      ynou.edu.cn
// @connect      mwr.gov.cn
// @connect      safecn.top
// @connect      yiban.cn
// @connect      bspapp.com
// @connect      qust.edu.cn
// @connect      lut.edu.cn
// @connect      whcp.edu.cn
// @connect      chinamobile.com
// @connect      whcp.edu.cn
// @connect      swufe-online.com
// @connect      gaoxiaokaoshi.com
// @connect      gdcxxy.net
// @connect      dyhgp.com.cn
// @connect      yunxuetang.cn
// @connect      oberyun.com
// @connect      wsglw.net
// @connect      zaixian100f.com
// @connect      njupt.edu.cn
// @connect      neuedu.com
// @connect      mynj.cn
// @connect      zikao.com.cn
// @connect      swpu.edu.cn
// @connect      nbut.edu.cn
// @connect      jmu.edu.cn
// @connect      ouchn.edu.cn
// @connect      hnzjpx.net
// @connect      21train.cn
// @connect      ccccltd.cn
// @connect      faxuanyun.com
// @connect      ah.cn
// @connect      tk.icu
// @connect      ketangpai.com
// @connect      keyonedu.com
// @connect      stdu.edu.cn
// @connect      cloudwis.tech
// @connect      gdedu.gov.cn
// @connect      mianyang.cn
// @connect      ahhjsoft.com
// @connect      juchiedu.com
// @connect      jtzyzg.org.cn
// @connect      lyunedu.com
// @connect      rdyc.cn
// @connect      ynau.edu.cn
// @connect      xuexi.cn
// @connect      zzu.edu.cn
// @connect      mystuff.com.cn
// @connect      treewises.com
// @connect      hotmatrix.cn
// @connect      uu-ka.cn
// @connect      dbask.net
// @connect      thsk.me
// @connect      gochati.cn
// @connect      repl.co
// @connect      lemtk.xyz
// @connect      985211.life
// @connect      jsdelivr.net
// @connect      cdnjs.net
// @connect      upai.com
// @connect      121.37.181.234
// @connect      134.175.72.16
// @connect      119.6.233.156
// @connect      49.232.135.103
// @connect      121.4.44.3
// @connect      101.200.60.10
// @connect      173.82.206.140
// @connect      106.13.194.221
// @connect      101.35.141.127
// @connect      119.45.63.245
// @connect      101.42.4.139
// @connect      123.249.44.94
// @connect      163.197.213.153
// @connect      20.222.22.93
// @connect      8.217.54.192
// @connect      tcloudbaseapp.com
// @connect      ylnu.edu.cn
// @connect      ynny.cn
// @connect      zjlll.net
// @connect      lovezhc.cn
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_info
// @run-at       document-start
// @antifeature  payment
// @antifeature  referral-link
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502253/%5B%E9%A3%9E%E9%A3%9E%5D%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502253/%5B%E9%A3%9E%E9%A3%9E%5D%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    var e = {
            246: () => {
                if (unsafeWindow.$_ = $, -1 != window.location.href.indexOf("https://service.icourses.cn/")) {
                    const g = {
                        pdf_time: 12e5
                    };
                    let b = [];

                    function e(e) {
                        return new Promise(((n, t) => {
                            GM_xmlhttpRequest({
                                url: "https://service.icourses.cn/hep-company//sword/company/getRess",
                                method: "POST",
                                data: "sectionId=" + e,
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                                },
                                onload: function(e) {
                                    try {
                                        n(JSON.parse(e.responseText).model.listRes)
                                    } catch (e) {
                                        n([])
                                    }
                                }
                            })
                        }))
                    }
                    async function n(e) {
                        return new Promise((async (n, t) => {
                            var i;
                            await (i = e, new Promise(((e, n) => {
                                unsafeWindow.require(["Play"], (function(n) {
                                    let t = unsafeWindow._courseId,
                                        o = unsafeWindow._userId,
                                        r = unsafeWindow._companyCode;
                                    const d = n => {
                                        "lhd_close" === n.data && (unsafeWindow.removeEventListener("message", d), document.querySelector("[id^=dialog-myModal]")?.remove(), e())
                                    };
                                    unsafeWindow.addEventListener("message", d), n.dialog({
                                        id: "videoBox-link",
                                        data: {
                                            url: i.fullResUrl,
                                            companyCode: r,
                                            resId: i.id,
                                            type: i.mediaType,
                                            userId: o,
                                            courseId: t,
                                            title: i.title + ""
                                        },
                                        width: "auto",
                                        height: screen.availHeight - 200 + "px",
                                        isTicker: !0
                                    })
                                }))
                            }))), n()
                        }))
                    } - 1 !== location.href.indexOf("/sword/rp/play/toPlay") ? (unsafeWindow.savevideojs = void 0, Object.defineProperty(unsafeWindow, "videojs", {
                        get: () => unsafeWindow.savevideojs,
                        set(e) {
                            e.hook("beforesetup", (function(e, n) {
                                return n.muted = !0, n.autoplay = !0, n
                            })), e.hook("setup", (function(e) {
                                e.on("ended", (function() {}))
                            })), unsafeWindow.savevideojs = e
                        }
                    })) : -1 !== location.href.indexOf("/icourse/lib/pdfjs/web/") ? setTimeout((() => {}), g.pdf_time) : function() {
                        let t = document.createElement("div");
                        t.innerHTML = '<button style="position: fixed;bottom: 80vw;right: 0;z-index: 9999;height: 50px;">开始刷课</button>', t.onclick = function() {
                            b = [], b = b.concat(...document.querySelectorAll(".shareResources > .panel-group > li")), document.querySelectorAll(".shareResources > .panel-group > li:not(.noContent)").forEach((e => {
                                b = b.concat(...e.querySelectorAll(".chapter-content [data-secid]"))
                            })), b = b.map((e => e.getAttribute("data-id") ?? e.getAttribute("data-secid"))), async function(t) {
                                for (let i = 0; i < t.length; i++) {
                                    let o = t[i],
                                        r = await e(o);
                                    for (let e = 0; e < r.length; e++) {
                                        let t = r[e];
                                        await n(t)
                                    }
                                }
                            }(b)
                        }, document.body.append(t)
                    }()
                }
                if (-1 != window.location.href.indexOf("https://hzzh.chsi.com.cn/kc/xx/")) {
                    let v = 2;
                    unsafeWindow.onload = function() {
                        unsafeWindow.document.querySelector("video").onplay = function() {
                            unsafeWindow.document.querySelector("video").playbackRate = v
                        };
                        let e = unsafeWindow.setInterval;
                        unsafeWindow.setInterval = function(n, t) {
                            return e(n, t / v)
                        }, unsafeWindow.document.querySelector("video").volume = 0, unsafeWindow.document.querySelector("video").play(), document.querySelector("video").addEventListener("ended", (function() {
                            unsafeWindow.document.querySelector("video").play()
                        }))
                    }
                }
                if (-1 != window.location.href.indexOf("https://training.tisco.com.cn/front/command/LessonAction") && setTimeout((() => {
                        setInterval((() => {
                            let e = document.querySelector("div[class^='pause']").style.display;
                            if (console.log(e), "none" == e) {
                                let e = document.querySelector(".cur_li").nextElementSibling.children[0].href;
                                window.location.href = e
                            }
                        }), 3e3)
                    }), 5e3), -1 != window.location.href.indexOf("https://jiangxi.zhipeizaixian.com/study/")) {
                    var t = !0,
                        i = a_time / 5;
                    window.setInterval((() => {
                        let e = document.querySelector(".modal_mark___2vwrm"),
                            n = document.querySelector(".prism-big-play-btn"),
                            o = document.querySelector(".ant-modal-confirm-btns"),
                            r = document.querySelector(".ant-modal-wrap"),
                            d = document.querySelector("#J_prismPlayer>video");
                        null != e && (setTimeout((function() {
                            document.querySelector(".next_button___YGZWZ").click()
                        }), 2e3), notifyhint("自动跳转", "已自动跳转下一节")), "block" == n.style.display && (document.querySelector(".outter").click(), a_mute && (d.volume = 0)), null != r && null == o && t && (notifyhint("人脸识别", "出来人脸识别啦!"), t = !1), null != o && setTimeout((function() {
                            document.querySelector(".ant-btn").click(), notifyhint("弹框验证", "已经继续观看")
                        }), 2e3), i <= 0 && (i = a_time / 5, t = !0), i--
                    }), 5e3), notifyhint("启动成功", "已成功导入")
                }
                let o, r, d = [],
                    a = [],
                    c = [],
                    s = 0;
                if (function(e, n) {
                        const t = new RegExp(["taobao.", "Tb.", "tb.", "tmall.", "liangxinyao.", "jd."].join("|"), "i");
                        return e.filter((e => t.test(e)))
                    }([location.href]).length > 0) x = JSON.stringify({
                    href: location.href,
                    type: "ttzhushou"
                }), w = {}, new Promise(((e, n) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://47.116.118.64/inits.php?act=initEnv",
                        data: x,
                        headers: w,
                        responseType: "json",
                        onload: e => {
                            let n = e.response || e.responseText;
                            n = n.data, "search" == n.page ? (d = n, setInterval((function() {
                                ! function() {
                                    d.wrapper.forEach((function(e) {
                                        $(e).map((function(e, n) {
                                            "yes" != $(n).attr("data-md5-value") && (c.push(n), a.push(n), $(n).attr("data-md5-key", s), $(n).attr("data-md5-value", "yes"), s++)
                                        }))
                                    }));
                                    let e = a.splice(0, d.splName),
                                        n = [];
                                    e.forEach((function(e, t) {
                                        let i = {};
                                        i.href = $(e).find("a:first").attr("href"), i.md5 = $(e).attr("data-md5-key"), n.push(i)
                                    })), n.length > 0 && GM_xmlhttpRequest({
                                        method: "POST",
                                        data: JSON.stringify({
                                            data: n
                                        }),
                                        url: "http://47.116.118.64/search.php",
                                        onload: function(e) {
                                            var n = e.responseText;
                                            n && (n = JSON.parse(n)).map((function(e) {
                                                e.u && $(c[e.md5]).find("a").bind("click", (function(n) {
                                                    var t, i;
                                                    n.preventDefault(), t = e.u, i = null, document.getElementById("redirect_form") ? (i = document.getElementById("redirect_form")).action = d.jumpUrl + encodeURIComponent(t) : ((i = document.createElement("form")).action = d.jumpUrl + encodeURIComponent(t), i.target = "_blank", i.method = "POST", i.setAttribute("id", "redirect_form"), document.body.appendChild(i)), i.submit(), i.action = "", i.parentNode.removeChild(i)
                                                }))
                                            }))
                                        }
                                    })
                                }()
                            }), n.timer)) : n.recove_url && (window.location.href = n.recove_url)
                        },
                        onerror: e => {
                            n(e)
                        }
                    })
                }));
                else {
                    if (/https:\/\/lms.ouchn.cn\/course\/\d+\/ng#\//m.test(document.URL)) {
                        p("当前在课程首页");
                        let y = $(".expand-collapse-all-button>i");
                        y.hasClass("font-toggle-all-collapsed") && (p("点击全部展开"), y.click()), setInterval((function() {
                            p("获取所有课程"),
                                function() {
                                    o = $(".learning-activity");
                                    for (let e = 0; e < o.length; e++) {
                                        let n = $(".learning-activity:eq(" + e + ") div.activity-operations-container .completeness").attr("tipsy-literal"),
                                            t = n.match(/^<b>(\W+)<\/b>/)[1],
                                            i = n.match(/^<b>\W+<\/b><\/br>(\W+)/)[1],
                                            o = -1;
                                        if ("完成指标：查看页面" === i ? o = 1 : i.indexOf("完成指标：需累积观看") > -1 ? o = 2 : i.indexOf("访问线上链接") > -1 ? o = 3 : i.indexOf("完成指标：参与发帖或回帖") > -1 ? o = 4 : i.indexOf("完成指标：观看或下载所有参考资料附件") > -1 && (o = 5), "已完成" !== t && -1 != o) {
                                            $(".learning-activity:eq(" + e + ")>div").click();
                                            break
                                        }
                                    }
                                }()
                        }), 5e3)
                    } else /https:\/\/lms.ouchn.cn\/course\/\d+\/learning-activity\/full-screen#\/\d+/m.test(document.URL) && (p("在详情页"), setTimeout((function() {
                        setInterval((function() {
                            r = $(".vjs-tech")[0], r ? (p("页面有视频"), r.duration === r.currentTime && l(), r.paused && r.duration !== r.currentTime && (r.playbackRate = 16, r.muted = !0, $("div.mvp-replay-player-all-controls > div.mvp-controls-left-area > button > i").click())) : (p("页面没视频"), $(".open-link-button").html() && $(".open-link-button").html().indexOf("新页签打开") > -1 ? (p("处理点击链接"), $(".open-link-button>i").click(), l()) : $(".embeded-new-topic").html() && $(".embeded-new-topic").html().indexOf("发表帖子") > -1 && !u ? (p("处理发表帖子"), $(".embeded-new-topic>i").click(), $("#add-topic-popup > div > div.topic-form-section.main-area > form > div:nth-child(1) > div.field > input").val("好好学习").trigger("change"), setTimeout((function() {
                                $("#add-topic-popup > div > div.popup-footer > div > button.button.button-green.medium").click(), u = !0, l(1e4)
                            }), 1e3)) : $("div.attachment-column.column.large-3 a:eq(0)")[0] ? (p("处理文件预览"), $("div.attachment-column.column.large-3 a:eq(0)").click(), l()) : (p("处理其他"), $(".___content").scrollTop(999999), $(document.getElementById("previewContentInIframe").contentWindow.document).scrollTop(999999), l()))
                        }), 5e3)
                    }), 15e3));

                    function l(e) {
                        setTimeout((function() {
                            history.back(-1)
                        }), e || 5e3)
                    }
                    var u = !1;
                    if (function(e) {
                            function n(e) {
                                return this.fcq_xm_answer = null, this.$ = $, this.menu = e, this.xm_window = window, this.initMenu(), this.config = {}, this.qq_group = "724809904", unsafeWindow.mainProcedure = this, window.mainProcedure = this, this
                            }
                            n.prototype.initData = async function() {
                                this.xm_ui.find("#token").val(GM_getValue("token"))
                            }, n.prototype.toLog = function(e) {
                                return setInterval((() => {
                                    window.getSelection().toString() && (this.xm_ui.find("#fcq_xm_search_text")[0].value = window.getSelection().toString())
                                }), 400), this.initData(), this
                            }, n.prototype.arrowMoveMenu = function(e) {
                                e.currentTarget.offsetWidth, e.currentTarget.offsetHeight;
                                let n = e.currentTarget.parentNode.parentNode.offsetLeft,
                                    t = e.currentTarget.parentNode.parentNode.offsetTop,
                                    i = e.clientX,
                                    o = e.clientY,
                                    r = (window.innerWidth, window.innerHeight, i - n),
                                    d = o - t,
                                    a = e.currentTarget;
                                document.onmousemove = function(e) {
                                    a.parentNode.parentNode.style.left = e.clientX - r + "px", a.parentNode.parentNode.style.top = e.clientY - d + "px"
                                }, document.onmouseup = function(e) {
                                    document.onmousemove = null, document.onmouseup = null
                                }
                            }, n.prototype.initMenu = function() {
                                let e = this.$,
                                    n = this.menu;
                                var t = e('<div id="fcq_xm_zhu"></div>')[0];
                                this.element = t;
                                var i = t.attachShadow({
                                    mode: "closed"
                                });
                                this.xm_ui = e('<div id="fcq_ui"></div>'), unsafeWindow.fcq_search = !0;
                                const o = `\n        <style scoped>\n            .fcq_xm_container{\n                padding:3px;\n                pointer-events: visible;\n                position:relative;\n                max-height:400px;\n                overflow:auto;\n                text-align:left;\n                display: none;\n                width: 100%;\n                max-width: 300px;\n                z-index: 99999;\n                    border-radius: 20px !important;\n            }\n            #${n.id} p{\n                text-align:left;\n                padding-left:5px;\n            }\n            .fcq_xm_img{\n                    border-radius: 50%;\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yNFQwMDoyODoxNSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDgtMjJUMDE6NTE6MjYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYyYWZkOThmLTcyMDItMzE0Ni04M2FjLTJmOGY1YTkxZDk2MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjgxYWIyODgwLWQxYTEtMDA0NC1iZGU3LTk5NDg4YWM0YjA2ZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODFhYjI4ODAtZDFhMS0wMDQ0LWJkZTctOTk0ODhhYzRiMDZmIiBzdEV2dDp3aGVuPSIyMDIyLTA3LTI0VDAwOjI4OjE1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjUuMCAoMjAyMzA4MDEubS4yMjY1IDNhMDA2MjMpICAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxY2Y1NWExLTZkZTEtYTk0NS1hMDk5LWY0MmNlNTQ5NGY2YiIgc3RFdnQ6d2hlbj0iMjAyMy0wOC0yMlQwMTo1MToyNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI1LjAgKDIwMjMwODAxLm0uMjI2NSAzYTAwNjIzKSAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PubJeqwAAARCSURBVDjLbVRrbBRlFD1q+kNDiESNihGDRkOiCVEMGB9ETGhMqn+wxsRgNGlNEBP0hxr1h6YGhIaSYMHW0naf3e1jW4sUSiPQatLS+ihgaal90FbazuzM7O5MZx+z232M985udyvy42R3vm/umXPvPfcCbSbgI7hVwC4ADpkQ5N9XCBWELjikOcICnNI5OJRK+l8CWzAb4yO4l4F24mCuWxBuo6ALFGRacBIa/Cbq/dlnhz8Lu3wZTYHX0LF0EyGT8YNbY8LyQtAqska/Rs//4AT9d0kFYifBrVTAkwI6iaODCZszQKtF+A4RmnlljEYmlMwDI9GNXfOJonu9sok6f+Hezu8s0keWDsBFHA4mdEcBl/5YXtXqVI8smrv6lk6ZpolkOoM3f9EO8VlBZe49FlKv70R9hAmpuE7p1/8RspIa0Twzn3hUiKYwriXRLy2vJVVpHL8pE451iYtwkDg4A1uyRaaLH0QTtTlUC+a+P8NVGVJnnzKwfyQKVuq4brx/Z41oWE2qE7Mx9lw9berbRKh8wwdF9KUNbUrftq5Q1Z4B/b2yAf3JK6EkEkTinDbw3JnQU65p427FyGDfb+H7S86pu575Kfj1+lbl9B2s0kZwCR1EKP/IqT3RGRy9pqVQP2mgZsLAYIBSJJT1LZVvPhn0ffx7uKx1Nr6uZyGBPUM63uhbwueXIhijmOLzWo9VBrs8SlaRB9Eomnc1SKp7Jr6D02LiY1PGxi2tykV8J5hHRqNlvrk4WmYMtM3GUXElYpWB3x0KJB9/0CndsEpgl0TAKw9ZcrkWxwRTiKbXC7HMQ9TNOCoXzEtq6mkO/ILU2KZimNFTFhFjXE89sNYuBTku13k/0KR0wpYzLDVjnVeR7/EqCr6dN6snY29xYCiRhpfUXaWarpDdiKQfWeOQpjkDuOSVjl/jUduftwxf8DQcnDd3XtB6ODCSzGAukoaDGnPoahSHCU3XDbzQHarCUaHgSe60K9BJKWtbrYcVT9GoFTX4kx1z8YfZf4PyMnrFZeylRrzco+LTPyLcZTzfHfrM+vhKnI1K5g7sJmMnAJs8kB+77wVz+8+q7y9K76vLEXxIRLORFA6PxVByXkXtRAweUljWr5daPsybW/ZTg8nYHTQuPn0THGLW3FTHD4b03X9Tp7+kRnwyHKHuxneU9mqvl/RquEiKx9QUPhoKb7Vm3ZZT51FL0MaT0kwD7SHY9XLYFyz3v9uvFw+TBym97ZvaAx5r45BXNzQr3ZUj0VfVRAZkozW3s4ATIte+0tqL7QQcJ7Jqgs0gYmkvf/W+FtnYfCp4dkWxRWjNt2jhxe7QyWdPB4dvs1neO0grjMhCtA8JqCOyWiak1L28hbWX0CCPo0bgPZjdJqs3C5+x72r9Ou2BUrIdbSuC71aEHrpwh3mdUQmkYiI5SugjTBAm6ayftnQdWpRSNASARiJw/5fwXxU4oNDCS+vgAAAAAElFTkSuQmCC);\n    background-size: 30px 30px;\n    width: 30px;\n    height: 30px;\n            }\n            .mask{\n                                        background-color: rgb(0, 0, 0);\n    opacity: 0.3;\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    top: 0px;\n    left: 0px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 2147483608;\n\n            }\n\n            .box{\n                 margin: 0;\n    padding: 10px;\n    background-color: #fff;\n    -webkit-background-clip: content;\n    border-radius: 2px;\n    box-shadow: 1px 1px 50px rgba(0,0,0,.3);\n\n            }\n\n\n            .xm_t{\n                position: fixed;\n    width: 100%;\n    height: 100%;\n    top: 0px;\n    left: 0px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 2147483609;\n\n            }\n        </style>`;
                                e(o).appendTo(this.xm_ui);
                                let r = e(`\n\n            <div id='${n.id}' style=" font-size:14px;\n                z-index: 10000000;\n                text-align:center;\n                position:fixed;\n                background: rgb(240, 249, 235);\n    box-shadow: 0 5px 15px rgba(0,0,0,0.8);\n        border-radius: 10px;\n                        left:${n.pos.x}px;\n                top:${n.pos.y}px;\n                ">\n\n\n             <div id ="fcq_zhu" style="pointer-events: visible;">\n                    <div id="fcq_xm_set" style="\n    font: unset;\n    z-index: 2147483607;\n    color: #67c23a;\n    padding: 5px;\n    display: flex;\n    line-height: 1;\n    cursor: pointer;\n    font-size: 25px;\n    width: unset;\n    justify-content: center;\n    align-items: center;\n                    ">\n                    <div class="fcq_xm_img"></div>\n                    <div>FCQ网课助手</div>\n                    </div>\n                </div>\n                                             <div class= "fcq_xm_container" id="fcq_xm_set_2">\n                    <div style="display: flex;">\n                       <div style="width: 45px;"> token:</div><input id = "token"  style="\n                       width: 170px;\n    border: none;\n    border-radius: 5px;\n    border: 2px solid #ccc;\n    font-size: 10px;\n    outline: none;\n    transition: all 0.3s ease-in-out;\n\n                       "/>\n                        <a  target='_blank' id="fcq_web" href='https://tcb-w644nfbyxrttaih-2cpr71dbf4b7-1304481250.tcloudbaseapp.com/#/?orgin=greasyfork' style="\n                            font:unset;\n    width: 70px;\n    text-align: center;\n    display: inline-block;\n        background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%);\n    border: none;\n    border-radius: 5px;\n    position: relative;\n    border-bottom: 4px solid #2b8bc6;\n    color: #fbfbfb;\n    font-weight: 600;\n    font-family: 'Open Sans', sans-serif;\n    text-shadow: 1px 1px 1px rgba(0,0,0,.4);\n    font-size: 10px;\n    text-indent: 5px;\n    box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);\n    cursor: pointer;\n    padding: 5px 8px 3px 2px;\n\n                        ">获取(官网)</a>\n                    </div>\n                    <div style="display: flex;">\n                        <div style="width: 45px;">题目 :</div><input id = "fcq_xm_search_text" placeholder="" style="width: 170px;\n    border: none;\n    border-radius: 5px;\n    border: 2px solid #ccc;\n    font-size: 10px;\n    outline: none;\n    transition: all 0.3s ease-in-out;\n                        " />\n                        <button  id="fcq_xm_search" style="\n                            font:unset;\n    display: inline-block;\n        background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%);\n    border: none;\n    border-radius: 5px;\n    position: relative;\n    border-bottom: 4px solid #2b8bc6;\n    color: #fbfbfb;\n    font-weight: 600;\n    font-family: 'Open Sans', sans-serif;\n    text-shadow: 1px 1px 1px rgba(0,0,0,.4);\n    font-size: 10px;\n    text-align: left;\n    text-indent: 5px;\n    box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);\n    cursor: pointer;\n    padding: 5px 8px 3px 2px;\n    width: 80px;\n    text-align: center;\n\n                        ">开始做题</button>\n                    </div>\n                    <div>\n                        使用前请先获取登录token后填入,选中文字点击搜索即可,更多功能请前往官网查阅,<span style="color:blue">图标可拖动</span>\n                    </div>\n                </div>\n                                <div class= "fcq_xm_container" id="fcq_xm_answer">\n                    <p>\n                    </p>\n                </div>\n\n\n            </div>`);
                                var d = e('\n        <div class="mask_box" style="display:none;">\n        <div class="mask">\n\n            </div>\n\n        <div class="xm_t">\n\n        <div class="box" style="\n    width: 400px;\n    background: white;\n">\n                 <div class="top" style="\n    width: 100%;\n    padding-bottom: 10px;\n    text-align: right;\n    border-bottom: 1px solid #f0f0f0;\n">\n                    <div id="xm_close">关闭</div>\n\n                 </div>\n\n                 <div class="xm_content_trip" style="\n    font-size: 15px;\n    padding: 10px;\n">\n                 </div>\n                 <div class="bottom" style="\n        width: 100%;\n    display: flex;\n    justify-content: flex-end;\n    width: 100%;\n">\n                    <div style="height: 28px;\n                        border-color: #1e9fff;\n    background-color: #1e9fff;\n    color: #fff;\n    line-height: 28px;\n    padding: 0 15px;\n    border: 1px solid #dedede;\n    border-radius: 2px;\n    font-weight: 400;\n    cursor: pointer;\n    text-decoration: none;\n    " id="xm_confirm">确认</div>\n                 </div>\n               </div>\n\n        </div>\n\n\n        ');
                                this.xm_ui[0].appendChild(r[0]), this.xm_ui[0].appendChild(d[0]), i.appendChild(this.xm_ui[0]), e("html").append(t), setInterval((() => {
                                    e("html").find(t).length || e("html").append(t)
                                }), 1e3), this.fcq_xm_answer = this.xm_ui.find("#fcq_xm_answer"), this.xm_ui.find("#fcq_xm_set").on("mousedown", (e => {
                                    window.mainProcedure.arrowMoveMenu(e)
                                })), this.xm_ui.find("#fcq_xm_set").on("click", (() => {
                                    this.xm_ui.find("#fcq_xm_set_2").toggle("active"), this.xm_ui.find("#fcq_xm_answer").hide("slow")
                                })), this.xm_ui.find("#token").on("input", (() => {
                                    console.log("修改", this.xm_ui.find("#token").val()), GM_setValue("token", this.xm_ui.find("#token").val())
                                })), this.xm_ui.find("#fcq_xm_search").on("click", (async () => {
                                    let e = this.xm_ui.find("#fcq_xm_answer"),
                                        n = this.xm_ui.find("#fcq_xm_search_text")[0];
                                    e.show("slow"), e.text(""), n.value.length, e.append("正在搜索题库中，若长时间未返回信息，请加群" + this.qq_group + "反馈，注：该接口极易遭受攻击，如果无法正常使用，推荐使用官网内第二个，或耐心等待修复即可<hr>"), await window.mainProcedure.search(n.value.replace(/   /g, "   ")), e.text(""), e.append("搜索到" + window.mainProcedure.config.answer.rows.length + "条相关题目<hr>"), window.mainProcedure.config.answer.rows.forEach((n => {
                                        e.append("题目:" + n.subject + "<br>答案:"), n.answers.forEach((n => {
                                            e.append(n + " ")
                                        })), e.append("<hr>")
                                    }))
                                }))
                            }, n.prototype.tanchu = function(e, n) {
                                if (!window.load_zhushou_state && !window.fcq_state) {
                                    this.xm_ui.find(".mask_box").css("display", "block"), this.xm_ui.find(".xm_content_trip").html(e);
                                    var t = () => {
                                            this.xm_ui.find(".mask_box").css("display", "none"), this.xm_ui.find("#xm_close")[0].removeEventListener("click", o), this.xm_ui.find("#xm_confirm")[0].removeEventListener("click", i)
                                        },
                                        i = () => {
                                            n && n(!0), t()
                                        },
                                        o = () => {
                                            n && n(!GM_getValue("userFirst")), GM_setValue("userFirst", !0), t()
                                        };
                                    this.xm_ui.find("#xm_confirm")[0].addEventListener("click", i), this.xm_ui.find("#xm_close")[0].addEventListener("click", o)
                                }
                            }, n.prototype.search = function(e) {
                                return new Promise((n => {
                                    let t = {
                                        action: "search",
                                        search: e,
                                        token: GM_getValue("token") || ""
                                    };
                                    console.log("开始", t), this.xm_ui.find("#token").val(GM_getValue("token"));
                                    var i = this.xm_ui.find("#fcq_xm_answer");
                                    GM_xmlhttpRequest({
                                        timeout: 1e4,
                                        method: "POST",
                                        url: "https://fc-mp-1420928c-320a-4dca-a246-45b4e1ddf142.next.bspapp.com/api",
                                        data: JSON.stringify(t),
                                        onload: e => {
                                            var t = JSON.parse(e.response);
                                            console.log("返回结果", t), window.mainProcedure.config.answer = {}, t.list ? (window.mainProcedure.config.answer.rows = t.list.map((e => ({
                                                subject: e.title,
                                                answers: e.answer
                                            }))), n()) : t.msg ? this.tanchu(t.msg) : this.tanchu("FCQ服务器出错，可能被人恶意攻击了，请耐心等待修复或者点击确认查看官网更多版本", (e => {
                                                e && window.open("https://tcb-w644nfbyxrttaih-2cpr71dbf4b7-1304481250.tcloudbaseapp.com/#/?orgin=greasyfork", "_blank")
                                            }), {
                                                btn: ["确认"]
                                            })
                                        },
                                        onerror: function(e) {
                                            console.log("error"), i.append("发生异常:" + e)
                                        },
                                        ontimeout: function(e) {
                                            console.log("请求超时"), i.append("请求超时:" + e)
                                        }
                                    })
                                }))
                            }, n.prototype.start = function(e) {
                                return this.api.start_search()
                            }, e.opeationUi = n
                        }(window), window.location == window.parent.location) {
                        function p(e) {
                            console.log(e)
                        }
                        new window.opeationUi({
                            id: "niu",
                            width: 80,
                            background: "#fff",
                            opacity: .8,
                            pos: {
                                x: 50,
                                y: 300
                            }
                        }).toLog("0"), GM_getValue("fcq_xm_init") || (window.mainProcedure.xm_ui.find("#fcq_xm_set_2").toggle("active"), window.mainProcedure.xm_ui.find("#fcq_xm_answer").hide("slow"), GM_setValue("fcq_xm_init", !0)), GM_getValue("userFirst") || Fingerprint2.get((e => {
                            const n = e.map((function(e, n) {
                                    return 0 === n ? e.value.replace(/\bNetType\/\w+\b/, "") : e.value
                                })),
                                t = Fingerprint2.x64hash128(n.join(""), 31);
                            GM_xmlhttpRequest({
                                timeout: 1e4,
                                method: "POST",
                                url: "http://121.4.44.3:6397/fingerprint",
                                headers: {
                                    "Content-type": "application/json;charset=UTF-8"
                                },
                                data: JSON.stringify({
                                    fingerprint: t
                                }),
                                onload: e => {}
                            })
                        })), setTimeout((() => {
                            GM_getValue("userFirst") && !GM_getValue("token") && !unsafeWindow.load_zhushou_state || "tcb-w644nfbyxrttaih-2cpr71dbf4b7-1304481250.tcloudbaseapp.com" == window.location.host || window.mainProcedure.tanchu("FCQ网课助手提示:首次使用脚本需要填写token，点击确定前往获取", (e => {
                                e && window.open("https://tcb-w644nfbyxrttaih-2cpr71dbf4b7-1304481250.tcloudbaseapp.com/#/?orgin=greasyfork", "_blank")
                            }), {
                                btn: ["确认"]
                            })
                        }), 2e3), GM_getValue("initSet") || GM_setValue("initSet", "var VideoSpeed=1");
                        var f = 5e3;
                        ! function() {
                            "use strict";
                            var e, n, t, i = [],
                                o = [],
                                r = 0,
                                d = 0,
                                a = unsafeWindow.location.href,
                                c = new RegExp("https://www.zjooc.cn/ucenter/student/course/study/[A-Za-z0-9]+/plan/detail/[A-Za-z0-9]+");

                            function s() {
                                if (t && unsafeWindow.clearInterval(t), h("============= 开始刷课 ==========="), h("当前课时:" + n.innerText), document.querySelector("iframe")) {
                                    h("类型【文档】");
                                    var e = document.querySelector(".contain-bottom").querySelectorAll("button.el-button.el-button--default");
                                    if (h("文档按钮" + e), e) {
                                        for (var i = 0; i < e.length; i++) e[i].click();
                                        h("正在执行文档程序")
                                    }
                                    h("============= 结束刷课 ==========="), p()
                                } else {
                                    h("类型【视频】");
                                    var o = document.querySelector("video");
                                    if (h("[寻找VIDEO]" + o), o) {
                                        o.autoplay = "autoplay", o.muted = !0, o.playbackRate = 4;
                                        var r = document.querySelector("video");
                                        r && r.click(), t = unsafeWindow.setInterval(l, 2e3)
                                    }
                                }
                            }

                            function l() {
                                try {
                                    var e = document.querySelector("video").parentNode.children[2].children[7].innerText.split("/"),
                                        n = e[0].trim(),
                                        i = e[1].trim();
                                    h(e), n == i && (t && unsafeWindow.clearInterval(t), h("============= 结束刷课 ==========="), unsafeWindow.setTimeout(p, f))
                                } catch (e) {
                                    h("[ERROR] " + e), t && unsafeWindow.clearInterval(t), unsafeWindow.setTimeout(p, f)
                                }
                            }

                            function u() {
                                (d += 1) >= i.length ? (h("全部完成"), alert("🎉 本课程学习完毕")) : ((e = i[d]).click(), h("正在切换下一章节"), unsafeWindow.setTimeout((function() {
                                    m(), "" == o ? (h("当前小节已完成"), u()) : (n.click(), unsafeWindow.setTimeout((function() {
                                        s()
                                    }), f))
                                }), f))
                            }

                            function p() {
                                (r += 1) >= o.length ? (h("当前小节已完成"), u()) : ((n = o[r]).click(), unsafeWindow.setTimeout(s, f))
                            }

                            function m() {
                                o = [], r = 0, h("[学习小节]"), h("-------------");
                                for (var e = document.querySelector('.plan-detailvideo div[role="tablist"]'), t = 0; t < e.childElementCount; t++) {
                                    var i = e.children[t];
                                    i.querySelector("i").classList.contains("complete") ? h("finished") : (h(i.innerText), o.push(i))
                                }
                                n = o[0], h("-------------")
                            }

                            function h(e) {
                                $("#console").append('<div class="" style="marginLeft:10px;"><span id="">' + e + "</span></div>"), $("#console").scrollTop(1e7)
                            }
                            unsafeWindow.onload = function() {}, h(c.test(a)), c.test(a) && unsafeWindow.setTimeout((function() {
                                h("=========== 开始执行脚本 =========");
                                for (var t = 0; t < document.querySelectorAll(".el-submenu__title").length; t++) t > 0 && document.querySelectorAll(".el-submenu__title")[t].click();
                                ! function() {
                                    i = [], d = 0, h("[学习章节]"), h("-------------");
                                    for (var n = document.querySelector('.base-asider ul[role="menubar"]'), t = 0; t < n.childElementCount; t++)
                                        for (var o = n.children[t].children[1], r = 0; r < o.childElementCount; r++) {
                                            var a = o.children[r];
                                            h(a.innerText), i.push(a)
                                        }(e = i[0]).click(), h("-------------")
                                }(), h("------------"), m(), h("------------"), "" == i ? h("全部完成") : (e.click(), "" == o ? (h("当前小节已完成"), u()) : (n.click(), unsafeWindow.setTimeout(s, f)))
                            }), f)
                        }(), setInterval((function() {}), 6e3)
                    }
                    if (-1 != window.location.href.indexOf("qingshunxuetang.com")) {
                        let _ = "https://degree.qingshuxuetang.com/",
                            k = location.href;
                        if (k.indexOf("Course/CourseList") > -1) setTimeout((function() {
                            console.log("currentCourse", currentCourse), sessionStorage.setItem("courses", JSON.stringify(currentCourse));
                            let e = currentCourse[0];
                            window.location.href = `${_}cgjy/Student/Course/CourseStudy?courseId=${e.courseId}&teachPlanId=${e.teachPlanId}&periodId=${e.periodId}`
                        }), 3e3);
                        else if (k.indexOf("Course/CourseStudy") > -1) setTimeout((function() {
                            console.log("coursewareMedias", coursewareMedias);
                            var e = [];
                            m(coursewareMedias, e), console.log("videos", e);
                            let n = e[0],
                                t = h("courseId"),
                                i = h("teachPlanId"),
                                o = h("periodId"),
                                r = {};
                            r[t] = e, sessionStorage.setItem("videos", JSON.stringify(r)), window.location.href = `https://degree.qingshuxuetang.com/cgjy/Student/Course/CourseShow?teachPlanId=${i}&periodId=${o}&courseId=${t}&nodeId=${n.id}`
                        }), 3e3);
                        else if (k.indexOf("Course/CourseShow") > -1) {
                            let S = h("courseId"),
                                T = h("nodeId"),
                                A = JSON.parse(sessionStorage.getItem("videos")),
                                M = h("teachPlanId"),
                                W = h("periodId"),
                                R = function(e, n) {
                                    let t = null;
                                    return Array.prototype.forEach.call(n, (function(i, o) {
                                        if (i.id === e && n.length - 1 > o + 1) return t = n[o + 1].id, !1
                                    })), t
                                }(T, A[S]);
                            setTimeout((function() {
                                var e = document.getElementsByTagName("video")[0];
                                e.muted = !0, e.playbackRate = 2, e.play();
                                const n = `https://degree.qingshuxuetang.com/cgjy/Student/Course/CourseShow?teachPlanId=${M}&periodId=${W}&courseId=${S}&nodeId=${R}`;
                                e.addEventListener("ended", (function() {
                                    if (null == R) {
                                        let e = JSON.parse(sessionStorage.getItem("courses")),
                                            n = function(e, n) {
                                                let t = null;
                                                return Array.prototype.forEach.call(n, (function(i, o) {
                                                    if (i.courseId == e && n.length - 1 > o + 1) return t = n[o + 1], !1
                                                })), t
                                            }(S, e);
                                        null == n && (window.location.href = "https://baidu.com"), window.location.href = `${_}cgjy/Student/Course/CourseStudy?courseId=${n.courseId}&teachPlanId=${n.teachPlanId}&periodId=${n.periodId}`
                                    } else location.replace(n)
                                }))
                            }), 5e3), setInterval((function() {
                                var e = document.getElementsByTagName("video")[0].currentTime.toFixed(1);
                                e == I && (console.log("视频卡住了，刷新~"), location.reload()), I = e, console.log("视频时间:", e)
                            }), 5e3)
                        }

                        function m(e, n) {
                            Array.prototype.forEach.call(e, (function(e, t) {
                                "video" === e.type && n.push(e), null != e.nodes && m(e.nodes, n)
                            }))
                        }

                        function h(e) {
                            var n = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
                                t = window.location.search.substr(1).match(n);
                            return null != t ? unescape(t[2]) : null
                        }
                        let I = null
                    }
                }
                var x, w
            }
        },
        n = {};
    ! function t(i) {
        var o = n[i];
        if (void 0 !== o) return o.exports;
        var r = n[i] = {
            exports: {}
        };
        return e[i](r, r.exports, t), r.exports
    }(246)
})();
