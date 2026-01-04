// ==UserScript==
// @name         移除手机页面打开App提示|移除推荐下载App提示
// @version      0.0.4
// @description  移除手机页面打开App提示|移除推荐下载App提示|CSDN|知乎|B站|淘宝|京东|西瓜视频|优酷|东方财富网
// @author       luoyeah
// @match        *://*/*
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon         https://www.csdn.net/favicon.ico
// @homepageURL  https://github.com/luoyeah/browser-script
// @namespace    https://greasyfork.org/users/1126380
// @grant        none
// @note         0.0.4 2023年07月20日 修复jquery冲突
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471030/%E7%A7%BB%E9%99%A4%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80App%E6%8F%90%E7%A4%BA%7C%E7%A7%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E4%B8%8B%E8%BD%BDApp%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/471030/%E7%A7%BB%E9%99%A4%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80App%E6%8F%90%E7%A4%BA%7C%E7%A7%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E4%B8%8B%E8%BD%BDApp%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 网站匹配规则
    let site_db = [

        {
            site: "csdn.net",
            exec_duration: 5,
            // 移除元素列表
            hide_elements: [],
            // 移除元素列表
            remove_elements: [
                // 右上角打开app
                ".openApp.active",

                // 文章页
                // 工具栏下拉大按钮
                ".m_toolbar_left_app_btn",
                // 打开app遮蔽
                ".weixin-shadowbox.wap-shadowbox",
                // 返回栏
                ".aside-header-fixed",
                // 文章底部大按钮
                ".btn_open_app_prompt_div",

                // 推荐列表
                "#recommend",

                // 左上角图标
                // ".logo.floatL",

                // 搜索页
                ".openApp",

                // 操作栏
                "#operate",

                "span:contains('前往')",
            ],
            auto_click: [
                // 继续阅读
                {   // check_ele 可见时点击 click_ele
                    check_ele: ".btn_open_app_prompt_box.detail-open-removed",
                    click_ele: ".btn_open_app_prompt_box.detail-open-removed",
                },
                // 取消前往CSDNapp
                {
                    check_ele: "div:contains('前往CSDN APP阅读全文')",
                    click_ele: "a:contains('取消')",
                }
            ],
            // 自定义执行
            custom_eval: `
                        for(;;){
                            let url = "https://www.csdn.net/"
                            // 获取元素
                            let ele = jq(".mToolbarL.floatL a")
                            
                            // 判断是否存在
                            if(undefined==ele){
                                break
                            }

                            if(ele.attr("href")!=url){
                                 ele.attr("href",url)
                            }     
                            break
                        }

                    `
            ,
        },
        {
            site: "m.bilibili.com",
            exec_duration: -1,
            // 移除元素列表
            remove_elements: [
                // 主页
                // 右上角按钮
                ".m-nav-openapp",
                // 底部悬浮按钮
                ".m-home-float-openapp",

                // 播放页
                // 全屏提示下载app
                ".mplayer-fullscreen-call-app",
                // 倍数
                // ".mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-speed",
                // 全屏提示下载
                ".mplayer-widescreen-callapp",
                // 全屏发弹幕
                // ".mplayer-control-btn.mplayer-btn-comment-middle.mplayer-btn-comment-full",
                // ".mplayer-btn-comment-content",
                // 播放完推荐app
                ".mplayer-end",
                // 全屏高清
                ".mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-quality",
                // 播放页正下方按钮
                ".m-video2-awaken-btn-v2,.m-video2-awaken-btn",
                // 底部弹框推荐打开app
                ".openapp-dialog.large",
                // 底部看不够推荐下载app
                "#relateRecomMore",
                // 右下角bilibil内打开
                ".m-video2-float-openapp",

                // 下方推荐，都是跳转到app
                ".bottom-tab",
                ".caution-dialog",

                ".launch-app-btn.icon-spread",
                // 我的页面
                ".launch-app-btn.m-space-float-openapp",
            ],

            // 自动点击
            auto_click: [
                // 点击继续播放
                {
                    check_ele: "div:contains('立即播放')",
                    click_ele: "div:contains('立即播放')",
                },
                // 点击继续观看遮蔽
                {
                    check_ele: ".v-dialog.natural-dialog",
                    click_ele: ".to-see",
                },
                // 自动播放
                {
                    check_ele: ".mplayer-icon-call-app",
                    click_ele: ".mplayer-icon-call-app",
                },
                // 搜索页取消
                {
                    check_ele: ".open-app-dialog-btn.cancel",
                    click_ele: ".open-app-dialog-btn.cancel",
                },
            ]

        },
        {
            // 匹配网站
            site: "m.taobao.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: 5,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [
                "button:contains('打开淘宝App')"
            ],
            // 自动点击列表
            auto_click: [
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: "#SLK_manualPopCancel",
                    click_ele: "#SLK_manualPopCancel",
                },
            ]
        },
        {
            // 匹配网站
            site: "m.jd.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: 5,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [
                // 上方打开app
                "#m_common_tip",
                "#pannelSeat",

                // 主页底部
                "#imk2FixedBottom",

                "div:contains('打开APP')",
            ],
            // 自动点击列表
            auto_click: [
            ]
        },
        {
            // 匹配网站
            site: "zhihu.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: 5,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [
                // 上方打开app
                "button:contains('打开App')",

                // 主页底部
                ".OpenInAppButton",
            ],
            // 自动点击列表
            auto_click: [
                // 点击阅读更多
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: ".ContentItem-expandButton",
                    click_ele: ".ContentItem-expandButton",
                },

            ]
        },
        {
            // 匹配网站
            site: "wap.eastmoney.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: 5,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [
                // 上方打开app
                "#IndexDT",

                // 上方app下载
                ".appxz",

                // 主页底部按钮
                "#openinapp",
                ".open-inapp",

                // 顶部推荐
                "#swiper-ad",
                // 导航栏
                // ".comm-nav",
                ".emwapas_dtw",
                ".btn-comm-more",
            ],
            // 自动点击列表
            auto_click: [
                // 点击阅读更多
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: ".fold-btn",
                    click_ele: ".fold-btn",
                },
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: ".cancel",
                    click_ele: ".cancel",
                },
                // 跳过推荐下载app
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: "#go-wap-top",
                    click_ele: "#go-wap-top",
                },

            ],
            // 自定义执行
            custom_eval: `
                for(;;){
                    let ele = jq(".comm-nav")
                    // 判断是否存在
                    if(undefined==ele){
                        break
                    }

                    if(ele.css("top")!=0){
                        ele.css("top",0);
                    }

                    ele = jq("body")
                    // 判断是否存在
                    if(undefined==ele){
                        break
                    }

                    if(ele.css("padding-top")!=0){
                        ele.css("padding-top",0);
                    }   
                    break                 
                }

                `
            ,
        },
        {
            // 匹配网站
            site: "m.ixigua.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: -1,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [],
            // 隐藏元素列表(有些网站移除会提示错误)
            hide_elements: [
                // 右上方打开app
                ".xigua-bar-publish-container",

                // 底部推荐下载app
                ".xigua-download",

                // 播放页底部
                ".xigua-guide-button",

                //
                ".xigua-comment-more",
            ],
            // 自动点击列表
            auto_click: [
                // 点击阅读更多
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: ".button.platter",
                    click_ele: ".button.platter",
                },
                {
                    // 当check_ele可见时点击click_ele
                    check_ele: ".banner_title__continue",
                    click_ele: ".banner_title__continue",
                },

            ],
        },
        {
            // 匹配网站
            site: "youku.com",
            // 持续执行时间（秒）小于0代表永久执行
            exec_duration: 5,
            // 移除元素列表（默认为 jquery 选择器）
            remove_elements: [],
            // 隐藏元素列表(有些网站移除会提示错误)
            hide_elements: [
                // 右上方打开app
                ".icon.downloadApp",

                "#download_btn",

                // 播放页下方
                ".clipboard.h5-detail-guide",

                // 底部下载按钮
                ".callEnd_fixed_box",
            ],
            // 自动点击列表
            auto_click: [
            ],
        },
    ]


    // 获取jquery对象（无冲突）
    let jq = jQuery.noConflict(true);

    // 设置全局变量
    let console_info_prefix = "移除打开App提示: "


    // 打印信息
    function console_info(info) {
        console.info(console_info_prefix + info)
    }


    // 根据当前网站链接地址获取网站匹配规则
    function get_current_site_db() {
        let current_url = window.location.href

        // console_info("当前网站地址:" + current_url)

        // 遍历所有网站匹配规则
        for (let index = 0; index < site_db.length; index++) {
            let site = site_db[index].site

            // 正则表达式匹配
            if (current_url.match(site) != null) {
                console_info("匹配到网站规则：" + site)
                return site_db[index]
            }
        }
        console_info("没有匹配到网站规则")
    }

    // 获取当前网站数据信息
    let current_site_db = get_current_site_db()

    // 隐藏网站元素
    function do_site_hide_elements() {
        let elements = current_site_db.hide_elements

        // 判断是否设置当前键值
        if (elements == undefined) {
            return
        }

        for (let index = 0; index < elements.length; index++) {
            let ele = jq(elements[index])
            // 判断元素是否存在
            if (ele != undefined) {
                // 判断元素是否可见
                if (ele.is(":visible")) {
                    ele.hide()
                }
            }
        }
    }

    // 移除网站元素
    function do_site_remove_elements() {
        let elements = current_site_db.remove_elements

        // 判断是否设置当前键值
        if (elements == undefined) {
            return
        }

        for (let index = 0; index < elements.length; index++) {
            let ele = jq(elements[index])
            // 判断元素是否存在
            if (ele != undefined) {
                // 移除
                ele.remove()
            }
        }
    }

    // 自动点击网站元素
    function do_site_auto_click() {
        let elements = current_site_db.auto_click

        // 判断是否设置当前键值
        if (elements == undefined) {
            return
        }

        for (let index = 0; index < elements.length; index++) {
            let check_element = jq(elements[index].check_ele)
            let click_element = jq(elements[index].click_ele)

            // 判断元素是否存在
            if (undefined == check_element) {
                continue
            }

            // 如果元素不可见
            if (!check_element.is(":visible")) {
                continue
            }

            // 判断元素是否存在
            if (undefined == click_element) {
                continue
            }

            // 特殊处理a标签
            if (click_element.is('a')) {
                click_element = click_element[0]
            }

            // 点击元素
            click_element.click()
        }
    }

    // 执行自定义命令
    function do_site_custom_eval() {
        let custom_eval = current_site_db.custom_eval

        // 判断是否设置当前键值
        if (custom_eval == undefined) {
            return
        }

        eval(custom_eval)
    }

    // 设置属性
    function do_site_set_attr() {
        let elements = current_site_db.set_attr

        // 判断是否设置当前键值
        if (elements == undefined) {
            return
        }

        for (let index = 0; index < elements.length; index++) {
            let ele = jq(elements[index].ele)
            // 判断元素是否存在
            if (undefined == ele) {
                continue
            }

            // 判断当前属性值是否与设定属性值一致
            let attr = elements[index].attr
            let value = elements[index].value

            // 如果与设定属性值一致
            if (ele.attr(attr) == value) {
                continue
            }

            // 设置
            ele.attr(attr, value)
        }
    }

    function main() {
        // 未匹配到网站
        if (undefined == current_site_db) {
            return
        }

        // 执行间隔
        let interval_time = 250

        // 获取当前时间戳（秒）
        let current_time = new Date().getTime()

        // 结束时间点
        let final_time = current_time + current_site_db.exec_duration * 10 ** 3

        // 设置定时器
        let interval = setInterval(function () {
            // 移除元素、自动点击
            do_site_hide_elements()
            do_site_remove_elements()
            do_site_auto_click()
            do_site_set_attr()
            do_site_custom_eval()

            // 永久执行
            if (current_site_db.exec_duration < 0) {
                return
            }

            // 判断当前时间是否超过设定时间
            current_time = new Date().getTime()

            if (current_time > final_time) {
                clearInterval(interval)
                console_info("执行完成")
            }
        }, interval_time);
    }

    // 执行主函数
    main()
    // jq(document).ready(function () {
    //     // 执行主函数
    //     main()
    // })
})();