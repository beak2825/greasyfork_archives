// ==UserScript==
// @name         hty 脚本
// @description  hty 的小脚本，个人使用向，不建议社会人士下载
// @version      1.1.6
// @author       hty
// @namespace    https://github.com/HTY-DBY/script-hty
// @icon         https://hty.ink/logo.jpg
// @grant        none
// @match        *.csdn.net/*
// @match        *.google.com/*
// @match        *.google.com.hk/*
// @match        *.bing.com/*
// @match        *.soujianzhu.cn/*
// @match        *.bilibili.com/*
// @match        *.baidu.com/*
// @match        *.yutu.cn/*
// @match        *.zhihu.com/*
// @match        *.cnki.net/*
// @match        *.openai.com/*

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459071/hty%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459071/hty%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// @note         1.1.6 一些 bug 修复
// @note         1.1.3 一些 bug 修复
// @note         1.1.2 一些 bug 修复
// @note         1.1.1 一些 bug 修复
// @note         1.1.0 新增 知网 PDF 硕博文献下载
// @note         1.0.0 个人使用向，不建议社会人士下载




// bing 刷新
if (window.location.href == 'https://www4.bing.com/#reloaded') {
    window.location.href = "https://www4.bing.com"
} else {
    //获取当前网页url
    var url = window.location.host

    if (url == 'chat.openai.com') {
        let OK = 0
        let timer = setInterval(function () {
            try {
                for (var i = 0; i < document.querySelectorAll('[id*="radix-"]').length; i++) {
                    let btnElements, firstBtn
                    let parentElement = document.querySelectorAll('[id*="radix-"]')[i]
                    if (parentElement) {
                        btnElements = parentElement.getElementsByClassName('btn relative btn-primary');
                        if (btnElements.length > 0) {
                            firstBtn = btnElements[0];
                            firstBtn.click()
                            OK++;
                        }
                    }
                }
            } catch { }
            if (OK == 30) {
                clearInterval(timer)
            }
        }, 200)
    }


    var Dark_hty = url => {
        // 黑暗模式
        // google 黑暗
        if (url == "www.google.com.hk" || url == "www.google.com") {
            let timer = setInterval(function () {
                let OK = 0
                try {
                    document.body.style.backgroundColor = "black"
                    document.getElementsByClassName('yg51vc')[0].style.height = "55px"
                    document.getElementsByClassName('yg51vc')[0].style.backgroundColor = "black"
                    OK = 1
                } catch { }
                if (OK == 1) {
                    clearInterval(timer)
                }
            }, 200)
        }

        // 知乎 黑暗
        if (url == "www.zhihu.com" || url == "zhuanlan.zhihu.com") {
            // 评论区懒加载，故这个计时器不请
            let timer = setInterval(function () {
                // let OK = 0
                try {
                    document.getElementsByClassName('css-1e7fksk')[0].style.background = 'black'

                    document.getElementsByClassName('css-1bi2006')[0].style.animation = 'none'


                    let alist_1ygdre8 = document.getElementsByClassName('css-1ygdre8')
                    for (let idx = 0; idx < alist_1ygdre8.length; idx++) {
                        document.getElementsByClassName('css-1ygdre8')[idx].style.color = "white"
                    }
                    let alist_1rd0h6f = document.getElementsByClassName('css-1rd0h6f')
                    for (let idx = 0; idx < alist_1rd0h6f.length; idx++) {
                        document.getElementsByClassName('css-1rd0h6f')[idx].style.color = "#bfbfbf"
                    }
                } catch { }
            }, 200)
        }

        // baidu 黑暗
        if (url == "www.baidu.com") {
            let timer = setInterval(function () {
                let OK = 0
                try {
                    document.body.style.backgroundColor = "black"


                    document.getElementById("head").style.backgroundColor = "black"
                    document.getElementsByClassName('s_tab_inner s_tab_inner_81iSw')[0].style.backgroundColor = "black"
                    OK = 1
                } catch { }
                if (OK == 1) {
                    clearInterval(timer)
                }
            }, 200)
        }

        // bilibili 黑暗
        if (url == "www.bilibili.com") {
            let timer_footer = setInterval(function () {
                let OK = 0
                try {
                    document.getElementById("comment").getElementsByClassName("comment-container")[0].style.backgroundColor = "black"
                    OK = 1
                } catch { }
                if (OK == 1) {
                    clearInterval(timer_footer)
                }
            }, 200)
        }

        // bing 黑暗
        if (url == "www.bing.com" || url == "cn.bing.com" || url == "www.bing.cn" || url == "www4.bing.com") {
            // 为了防止首页产生性能损失，在开头做了一个判断语句
            if (document.getElementsByClassName("b_searchboxForm")[0]) {
                let timer = setInterval(function () {
                    let OK = 0
                    try {
                        document.getElementById("b_header").style.backgroundColor = "black"
                        document.getElementById("b_header").style.background = "black"
                        document.getElementById("b_content").style.backgroundColor = "black"
                        document.body.style.backgroundColor = "black"
                        let a = document.getElementsByClassName("b_scopebar")[0]
                        let b = a.getElementsByTagName("ul")[0]
                        let c = b.getElementsByTagName("li")
                        for (let idx = 0; idx < c.length; idx++) {
                            let d = c[idx].getElementsByTagName("a")
                            // console.log(d[0])
                            d[0].style.color = "#ffffff"
                        }
                        OK = 1
                    } catch { }
                    if (OK == 1) {
                        clearInterval(timer)
                    }
                }, 200)
            }
            // 这里是处理 [图片]分支 的 [黑暗]
            if (document.getElementById("b_header")) {
                let timer = setInterval(function () {
                    let OK = 0
                    try {
                        document.getElementById("b_header").style.backgroundColor = "black"
                        document.getElementById("rfPane").style.backgroundColor = "black"
                        document.getElementsByClassName("dg_b")[0].style.backgroundColor = "black"
                        OK = 1
                    } catch { }
                    if (OK == 1) {
                        clearInterval(timer)
                    }
                }, 200)
            }
        }
    }

    // head事件
    var Head_hty = url => {
        // 滚动函数
        let scroll_hty = (element, scrollS) => {
            if (scrollS > 0) {
                element.slideUp(100)
            } else {
                element.slideDown(100)
            }
        }

        // bilibili head
        // b站请使用旧版模式，并配合广告插件，这样好处理
        // 不清计时器，该处懒加载，可能语句有延迟
        // 该处不放入 Head_pretreatment 是为了防止无限计时器产生
        if (url == "www.bilibili.com" && window.location.pathname.substring(window.location.pathname.indexOf("/", 0) + 1, window.location.pathname.indexOf("/", 1)) == "bangumi") {
            let timer = setInterval(function () {
                try {
                    document.getElementsByClassName("bili-header__bar")[0].style.position = 'absolute'
                } catch { }
            }, 200)
        }

        let Head_pretreatment = url => {
            // 谷歌的建议用广告插件代替，屏蔽 class: minidiv 元素即可

            // baidu head
            if (url == "baidu.com" || url == "www.baidu.com") {
                document.getElementById('head').style.position = 'absolute'
            }

            // 羽兔 head
            if (url == "www.yutu.cn") {
                document.getElementsByClassName('soft-nav')[0].style.position = 'relative'
            }

            // CSDN head
            if (url == "blog.csdn.net" || url == "stitch.blog.csdn.net" || url == "ideashare.blog.csdn.net") {
                var mutationObserver_Related_Searches = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        // 当DOM元素发送改变时执行的函数体
                        try {
                            document.getElementById("csdn-toolbar").style.position = 'relative'
                        } catch { }
                    })
                })
                mutationObserver_Related_Searches.observe(document.getElementById("csdn-toolbar"), {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true,
                    style: true
                })
            }

            // soujianzhu head
            if (url == "soujianzhu.cn" || url == "www.soujianzhu.cn") {
                document.getElementsByClassName('ptb_st2')[0].style.position = 'absolute'
            }
        }

        Head_pretreatment(url)

        // 用滚动 处理 head 事件
        window.addEventListener("scroll", (event) => {
            let scrollS = document.documentElement.scrollTop

            // 该处是担心 head_pretreatment 加载缓慢被刷语句，故再来一次
            Head_pretreatment(url)

            // 示例代码
            // if (url == 'xxx') {
            //     if ($("#Header")) {
            //         let head = $("#Header")
            //         scroll_hty(head, scrollS)
            //     }
            // }

        })
    }

    // 其他处理
    var Other_hty = url => {
        // CSDN bode
        if (url == "blog.csdn.net" || url == "stitch.blog.csdn.net" || url == "ideashare.blog.csdn.net") {
            let timer = setInterval(function () {
                try {
                    document.getElementById("mainBox").setAttribute("class", "container clearfix container-concision")
                } catch { }
            }, 200)
        }

        // CNKI 知网 PDF 下载
        if (url == "kns.cnki.net") {
            let url_down = '', datas = document.getElementsByName('cajDown');
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].innerText.indexOf("在线阅读") != -1) {
                    url_down = datas[i].href;
                    url_down = 'https://chn.oversea.cnki.net/kns/download?dflag=pdfdown' + url_down.substring(62);
                }
            }
            if (url_down != '') {
                for (i = 0; i < datas.length; i++) {
                    if (datas[i].innerText.indexOf("CAJ整本下载") != -1) {
                        datas[i].innerHTML = datas[i].innerHTML.replace('CAJ整本下载', 'CAJ下载');
                    } else if (datas[i].innerText.indexOf("整本下载") != -1) {
                        datas[i].innerHTML = datas[i].innerHTML.replace('整本下载', 'CAJ下载');
                    }
                    if (datas[i].innerText.indexOf("在线阅读") != -1) {
                        datas[i].href = url_down;
                        datas[i].innerHTML = datas[i].innerHTML.replace('在线阅读', 'PDF下载(失效)');
                    }
                }
            }
        }


        // bilibili
        if (url == "www.bilibili.com") {
            // 脚本[哔哩哔哩深色模式+工具箱(下载封面、关闭广告、调节亮度、获取av/BV号、随日出日落切换深浅色、跟随系统设置切换深浅色、关闭新版推广和赛事栏)]的 bug 调整
            // main
            try {
                document.getElementsByClassName('desc-info-text')[0].style.color = '#ffffff'
                document.getElementsByClassName('video-title')[0].style.color = '#ffffff'
                document.getElementsByClassName('up-name')[0].style.color = '#ffffff'
            } catch (error) {
                // console.log(error)
            }
            let timer_1 = setInterval(function () {
                try {

                    document.querySelectorAll('.mediainfo_mediaRight__SDOq4 .mediainfo_mediaTitle__Zyiqh')[0].style.color = 'white'
                    var elements = document.querySelectorAll('.RecommendItem_wrap__5sPoo .RecommendItem_right_wrap__DJpVw .RecommendItem_title__jBsvL')
                    elements.forEach((element) => {
                        element.style.setProperty('color', 'white', 'important');
                    });
                    var elements = document.querySelectorAll('.mediainfo_mediaRight__SDOq4 .mediainfo_media_desc__FdCrM')
                    elements.forEach((element) => {
                        element.style.setProperty('color', '#e1e1e1', 'important');
                    });
                    var elements = document.querySelectorAll('.mediainfo_mediaRight__SDOq4 .mediainfo_media_desc_section__Vkt2t .mediainfo_display_area__ggRQT .mediainfo_content__rexOq')
                    elements.forEach((element) => {
                        element.style.setProperty('color', '#e1e1e1', 'important');
                    });
                    // var elements = document.querySelectorAll('.mediainfo_mediaRight__SDOq4 .mediainfo_mediaTitle__Zyiqh');

                } catch (error) {
                    // console.log(error)
                }
            }, 1000)

            try {
                document.getElementsByClassName('main-container')[0].style.backgroundColor = 'black'
                document.querySelectorAll('.mediainfo_mediaRight__SDOq4 .mediainfo_mediaTitle__Zyiqh')[0].style.color = 'white'
                document.querySelectorAll('.RecommendItem_wrap__5sPoo .RecommendItem_right_wrap__DJpVw .RecommendItem_title__jBsvL')[0].style.color = 'white'


            } catch (error) {
                // console.log(error)
            }


            let timer_main = setInterval(function () {
                try {
                    // 颜色设置
                    document.getElementsByClassName('bili-header__channel')[0].style.setProperty('background', '#000000', 'important')
                } catch (error) {
                    // console.log(error)
                }
            }, 200)
            if (document.getElementById('bilibili-player')) {
                // bangumi
                if (url == "www.bilibili.com" && window.location.pathname.substring(window.location.pathname.indexOf("/", 0) + 1, window.location.pathname.indexOf("/", 1)) == "bangumi") {
                    let timer_bangumi = setInterval(function () {
                        try {
                            // 颜色设置
                            document.getElementsByClassName('up-name')[0].style.color = '#ffffff'
                            document.getElementsByClassName('bb-comment')[0].style.setProperty('background', '#000000', 'important')
                            for (let idx = 0; idx < document.getElementsByClassName('RecommendItem_title__zyQj0').length; idx++) {
                                document.getElementsByClassName('RecommendItem_title__zyQj0')[idx].style.color = '#ffffff'
                            }
                            document.getElementsByClassName('DanmukuBox_wrap__USrvT')[0].style.background = '#000000'
                            document.getElementsByClassName('recommend_title__miCR4')[0].style.color = '#ffffff'
                            // document.getElementsByClassName('seasonlist_ss_title__Tkrsi')[0].style.color = '#ffffff'
                            // document.getElementsByClassName('seasonlist_series_title__nPI47')[0].style.color = '#ffffff'
                            document.getElementsByClassName('mediainfo_media_desc_section__bOFBw')[0].style.color = '#ffffff'
                            document.getElementsByClassName('mediainfo_home_link__bcwpj')[0].style.color = '#ffffff'
                            document.getElementsByClassName('mediainfo_media_pub__Wm8A4')[0].style.color = '#ffffff'
                            document.getElementsByClassName('mediainfo_media_title__gcy_r')[0].style.color = '#ffffff'
                            document.getElementsByClassName('desc-info-text')[0].style.color = '#ffffff'

                            // document.getElementsByClassName('seasonlist_season_list__fMpQt')[0].style.color = '#ffffff'
                            // clearInterval(timer)
                        } catch (error) {
                            // console.log(error)
                            // clearInterval(timer)
                        }
                    }, 200)
                }
                // video
                if (url == "www.bilibili.com" && window.location.pathname.substring(window.location.pathname.indexOf("/", 0) + 1, window.location.pathname.indexOf("/", 1)) == "video") {
                    let timer_video = setInterval(function () {
                        try {
                            document.getElementsByClassName('up-name')[0].style.color = '#ffffff'
                        } catch { }
                    }, 200)
                }
            }
        }

        // google search
        if (url == "www.google.com.hk" || url == "www.google.com") {
            let timer = setInterval(function () {
                let OK = 0
                try {
                    document.getElementById("tsf").style.cssText = "--center-abs-margin: 365px"
                    document.getElementById("hdtb-msb").style.cssText = "--center-abs-margin: 0px background-color: black"
                    // 这一段是为了修改 脚本[AC-baidu-重定向优化百度搜狗谷歌必应搜索_favicon_双列] 的bug
                    document.getElementsByClassName('AC-GoogleGridDelta-Style')[0].outerText = ''
                    OK = 1
                } catch { }
                if (OK == 1) {
                    clearInterval(timer)
                }
            }, 200)
        }

        // bing
        if (url == "www.bing.com" || url == "cn.bing.com" || url == "www.bing.cn" || url == "www4.bing.com"
        ) {
            try {
                if (window.location.search.indexOf("FORM") == 1 || window.location.search.indexOf("ensearch") == 1) {
                    window.location.href = "https://www4.bing.com"
                }
            } catch { }
            try {
                if (window.location.pathname.substring(window.location.pathname.indexOf("/", 0) + 1) != "search") {
                    document.getElementById("est_switch").style.marginLeft = '0'
                }
                document.getElementById("est_switch").style.marginTop = '0'
                document.getElementById("est_switch").style.textAlign = 'center'
                document.getElementById("est_switch").style.position = 'relative'
                document.getElementById("est_switch").style.paddingRight = '0'
            } catch { }
            // 为了防止其他页产生性能损失，在开头做了一个判断语句
            if (document.getElementsByClassName("sbox ")[0]) {
                // 首页搜索框居中
                try {
                    document.getElementsByClassName("sbox ")[0].style.margin = "0px 30% auto"
                    document.getElementsByClassName("sbox ")[0].style.position = 'inherit'
                    document.getElementsByClassName("sbox ")[0].style.top = '10%'
                } catch { }
                let timer_footer = setInterval(function () {
                    let OK = 0
                    try {
                        // 修改搜索框样式使其居中，ちょど右だ
                        document.getElementsByClassName("sbox ")[0].style.margin = "0px 30%  auto"
                        document.getElementsByClassName("sbox ")[0].style.position = 'inherit'
                        // 顺便清除下底部 footer
                        document.getElementById("footer").style.display = "none"
                        document.getElementById("vs_cont").style.display = "none"
                        OK = 1
                    } catch { }
                    if (OK == 1) {
                        clearInterval(timer_footer)
                    }
                }, 200)
            }
            // 为了防止首页产生性能损失，在开头做了一个判断语句
            if (document.getElementsByClassName("b_searchboxForm")[0]) {
                // 去除搜索时弹出的 Related Searches
                let timer_Related_Searches = setInterval(function () {
                    let OK = 0
                    try {
                        // 监听变化
                        var mutationObserver_Related_Searches = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                // 当DOM元素发送改变时执行的函数体
                                try {
                                    document.getElementsByClassName("b_searchboxForm as_rsform")[0].className = 'b_searchboxForm'
                                } catch { }
                                try {
                                    document.getElementsByClassName("b_focus as_rsform")[0].className = 'b_focus'
                                } catch { }
                                try {
                                    document.getElementById("as_foot").remove()
                                } catch { }
                                try {
                                    document.getElementsByClassName("sa_drw")[0].style.borderRadius = '0px 0px 24px 24px'
                                } catch { }
                            })
                        })
                        mutationObserver_Related_Searches.observe(document.getElementsByClassName("b_searchboxForm")[0], {
                            attributes: true,
                            characterData: true,
                            childList: true,
                            subtree: true,
                            attributeOldValue: true,
                            characterDataOldValue: true
                        })
                        OK = 1
                    } catch { }
                    if (OK == 1) {
                        clearInterval(timer_Related_Searches)
                    }
                }, 200)
            }
            if (document.getElementsByClassName("sbox_cn")[0]) {
                document.getElementsByClassName("sbox_cn")[0].style.marginRight = '25%'
            }
        }
    }

    // 动画处理
    var Anime_hty = url => {
        // google anime
        // 不清计时器，该处懒加载，可能语句有延迟
        if (url == "www.google.com.hk" || url == "www.google.com") {
            let timer = setInterval(function () {
                try {
                    document.getElementById("tsf").style.animationName = "null"
                } catch { }
            }, 200)
        }

        // baidu anime
        if (url == "www.baidu.com") {
            let timer = setInterval(function () {
                try {
                    document.querySelector(".head_wrapper").style.animationName = "null"
                } catch { }
                if (document.querySelector(".head_wrapper").style.animationName == "null") {
                    clearInterval(timer)
                }
            }, 200)
        }
    }

    Dark_hty(url)
    Head_hty(url)
    Other_hty(url)
    Anime_hty(url)

}
