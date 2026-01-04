// ==UserScript==
// @name         【去广告 屏蔽广告 广告拦截 百度广告 百度联盟广告 谷歌广告】@LYS-广告拜拜助手（适配手机）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  1、净化百度搜索结果中插入广告；2、净化推送广告；3、指定规则净化页面插入广告……
// @author       LYS
// @match        */*
// @run-at       document-end
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440959/%E3%80%90%E5%8E%BB%E5%B9%BF%E5%91%8A%20%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%20%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%20%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F%E5%B9%BF%E5%91%8A%20%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E3%80%91%40LYS-%E5%B9%BF%E5%91%8A%E6%8B%9C%E6%8B%9C%E5%8A%A9%E6%89%8B%EF%BC%88%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440959/%E3%80%90%E5%8E%BB%E5%B9%BF%E5%91%8A%20%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%20%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%20%E7%99%BE%E5%BA%A6%E8%81%94%E7%9B%9F%E5%B9%BF%E5%91%8A%20%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E3%80%91%40LYS-%E5%B9%BF%E5%91%8A%E6%8B%9C%E6%8B%9C%E5%8A%A9%E6%89%8B%EF%BC%88%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //判断是否为百度搜索页面，则判断手机/PC端后直接开始循环屏蔽页面插入广告，不进入后面过程
    var url = window.location.href
    if (url.includes("www.baidu.com/") || url.includes("m.baidu.com/")) {

        if (url.includes("m.baidu.com/")) {
            setInterval(function () {
                $('.ec_ad_results').hide();
            }, 500);
        } else {
            setInterval(function () {
                $('#content_left div:contains("广告")').slideUp()
            }, 500)
        }

    } else {

        //定义预设推送域：csdn广告、百度广告、谷歌广告等，后续可继续按格式添加（HTML页面内容清除为空白）
        var ads = ["kunpeng-sc.csdnimg.cn/",
            "newscdnct.inter.71edge.com/videos/",
            "iyes.youku.com/",
            "pos.baidu.com/",
            "g.doubleclick.net",
            "pagead2.googlesyndication.com",
            "tpc.googlesyndication.com",
            "cs.emxdgt.com",
            "sync.richaudience.com",
            "gum.criteo.com",
            "ads.pubmatic.com",
            "eus.rubiconproject.com",
            "hde.tynt.com",
            "ssbsync.smartadserver.com",
            "simage2.pubmatic.com",
            "onetag-sys.com",
            "sync.aniview.com",
            "imasdk.googleapis.com",
            "mp.4dex.io",
            "acdn.adnxs.com",
            "safeframe.googlesyndication.com",
            "s.amazon-adsystem.com",
            "rtb.gumgum.com",
            "ap.lijit.com",
            "usersync.gumgum.com",
            "sync.inmobi.com",
            "ads.vamaker.com",
            "cm.masky.biddingx.com",
            "cb.baidu.com",
            "eclick.baidu.com",
            "cpro.baidustatic.com",
            "cbjslog.baidu.com",
            "static.acs86.com",
            "show.g.mediav.com",
            "impservice.union.youdao.com",
            "entry.baidu.com",
            "g.fastapi.net",
            "strip.taobaocdn.com",
            ".778669.com",
            "atm.youku.com",
            "Fvid.atm.youku.com",
            "html.atm.youku.com",
            "valb.atm.youku.com",
            "valf.atm.youku.com",
            "valo.atm.youku.com",
            "valp.atm.youku.com",
            "Istat.youku.com",
            "speed.lstat.youku.com",
            "urchin.lstat.youku.com",
            "stat.youku.com",
            "static.Istat.youku.com",
            "valc.atm.youku.com",
            "vid.atm.youku.com",
            "walp.atm.youku.com",
            "adcontrol.tudou.com",
            "a.baidu.com",
            "baidutv.baidu.com",
            "bar.baidu.com",
            "c.baidu.com",
            "cjhq.baidu.com",
            "cpro.baidu.com",
            "drmcmm.baidu.com",
            "eiv.baidu.com",
            "hc.baidu.com",
            "hm.baidu.com",
            "ma.baidu.com",
            "nsclick.baidu.com",
            "spcode.baidu.com",
            "tk.baidu.com",
            "union.baidu.com",
            "ucstat.baidu.com",
            "utility.baidu.com",
            "utk.baidu.com",
            "focusbaiduafp.allyes.com",
            "afp.qiyi.com",
            "focusbaiduafp.allyes.com",
            "a.cctv.com",
            "a.cntv.cn",
            "ad.cctv.com",
            "d.cntv.cn",
            "adguanggao.eee114.com",
            "cctv.adsunion.com",
            "dcads.sina.com.cn",
            "pp2.pptv.com",
            "pro.letv.com",
            "images.sohu.com",
            "a.cctv.com",
            "a.cntv.cn",
            "ad.cctv.com",
            "d.cntv.cn",
            "adguanggao.eee114.com",
            "cctv.adsunion.com",
            "acs.56.com",
            "acs.agent.56.com",
            "acs.agent.v-56.com",
            "bill.agent.56.com",
            "bill.agent.v-56.com",
            "stat.56.com",
            "stat2.corp.56.com",
            "uvimage.56.com",
            "v16.56.com",
            "pole.6rooms.com",
            "shrek.6.cn",
            "simba.6.cn",
            "union.6.cn",
            "adextensioncontrol.tudou.com",
            "iwstat.tudou.com",
            "nstat.tudou.com",
            "stats.tudou.com",
            ".p2v.tudou.com",
            "at-imgl.tdimg.com",
            "at-img2.tdimg.com",
            "at-img3.tdimg.com",
            "adplay.tudou.com",
            "adcontrol.tudou.com",
            "stat.tudou.com",
            "1.allyes.com.cn",
            "analytics.ku6.com",
            "gug.ku6cdn.com",
            "ku6.allyes.com",
            "ku6afp.allyes.com",
            "pq.stat.ku6.com",
            "st.vq.ku6.cn",
            "stat0.888.ku6.com",
            "stat1.888.ku6.com",
            "stat2.888.ku6.com",
            "stat3.888.ku6.com",
            "static.ku6.com",
            "vO.stat.ku6.com",
            "v1.stat.ku6.com",
            "v2.stat.ku6.com",
            "v3.stat.ku6.com",
            "86file.megajoy.com",
            "86get.joy.cn",
            "86logjoy.cn"
        ]

        //定义预设屏蔽规则：油猴、opgg、csdn等，后续可继续按格式添加
        var adsattr = [
            ["greasyfork.org/", "[class*='ad ad-']", "#carbonads"],
            ["op.gg/", "[id*='mobile-app-install']", "[class*='einfil']"],
            [".csdn.net/", "[class*='ad-box']", "#kp_box_www_swiper", ".passport-login-container"],
            [".xinnet.com/", "[class*='xinnet-adv-code']"]
        ]

        var attr = ["", ""]

        //判断当前页是否属于预设推送广告域，是则已清除全页面，非则继续判断jquery
        var nopush = false
        for (var i = 0; i < ads.length; i++) {
            if (url.includes(ads[i])) {
                document.getElementsByTagName('head').innerHTML = "";
                document.getElementsByTagName('title').innerHTML = "";
                document.getElementsByTagName('body')[0].innerHTML = "";
                nopush = true
                break
            }
        }

        if (nopush == false) {

            //判断页面是否存在引用jquery
            var isjqexist = false
            var sp = document.getElementsByTagName('script')
            Array.prototype.slice.bind(sp)
            for (var l = 0; l < sp.length; l++) {
                if (sp[l].getAttribute("src") != null) {
                    if (sp[l].getAttribute("src").includes("jquery")) {
                        console.log(sp[l].getAttribute("src"))
                        isjqexist = true
                        break
                    }
                }
            }
            //如未引用则加载jquery
            if (isjqexist) {
                console.log("无需额外引用jQuery！")
            } else {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
                document.getElementsByTagName('head')[0].appendChild(script);
            }

            isjqexist = false


            //判断jquery资源是否加载完成
            var isjq = setInterval(function () {
                if (typeof jQuery != "undefined") {
                    console.log("jQuery已经加载完成！")
                    clearInterval(isjq);
                    getcurruturl();
                    if (attr[0] != "") {
                        setInterval(function () {
                            killinnerads();
                        }, 1000);
                    }

                } else {
                    console.log("等待jQuery加载完成！")
                }
            }, 100)
        }

    }



    //当前页面规则匹配
    var getcurruturl = function () {
        for (var i = 0; i < adsattr.length; i++) {
            if (url.includes(adsattr[i][0])) {
                attr = adsattr[i]
                return attr
            }
        }
    }

    //按规则筛选屏蔽屏蔽DOM
    var killinnerads = function () {
        console.log("正在针对[" + attr[0] + "]规则进行监控！")
        for (var j = 1; j < attr.length; j++) {
            $(attr[j]).hide()
        }
    }

})();