// ==UserScript==
// @name         哔哩哔哩 (B站|Bilibili) 限制视频种类(做减法)
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  隐藏搜索内容，必须选择时长和视频分区才显示（环境改变引导自己要什么）
// @author       weihao
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518695/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28B%E7%AB%99%7CBilibili%29%20%E9%99%90%E5%88%B6%E8%A7%86%E9%A2%91%E7%A7%8D%E7%B1%BB%28%E5%81%9A%E5%87%8F%E6%B3%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518695/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%28B%E7%AB%99%7CBilibili%29%20%E9%99%90%E5%88%B6%E8%A7%86%E9%A2%91%E7%A7%8D%E7%B1%BB%28%E5%81%9A%E5%87%8F%E6%B3%95%29.meta.js
// ==/UserScript==

(function () {
    'use strict'

    /*自定义区域*/
    const CONFIG = {
        //设定合法视频时长（1:10分钟以下。2:10~30分钟。3:30~60分钟。4:60分钟以上）
        LEGAL_DURATION: [2, 3, 4]
    }
    const UI = {
        //判断css是否插入的标志位
        flag: {
            has_filterCss: false
        },
        init: () => {
            //cssRule1：提前插入防止未过滤视频显示
            const rule = `
                /* 隐藏未过滤的视频内容 */
                .search-page-wrapper { display: none; }
            `
            GM_addStyle(rule)
        },
        init_after_dom: () => {
            //cssRule2
            //dom之前插入css防止过滤前内容显示
            const rule2 = `
                /* 常驻视频过滤选项 */
                div.more-conditions,div.more-conditions.ov_hidden{
                    height: 100%!important;
                    display:unset!important;
                }

                /* 隐藏过滤菜单显示隐藏切换按钮 */
                .vui_button.vui_button--active-shrink.i_button_more{
                    display:none;
                }
            `;
            //添加css
            GM_addStyle(rule2)
            UI.flag.has_filterCss = true
        },
        //设置禁用时长和分区按钮
        buttonDisable: () => {
            //禁止不合法的时长 const LEGAL_DURATION = [2, 3, 4] 之外的
            const duration_idx = [0, 1, 2, 3, 4]
            let disabled_duration_idx = []
            //取差集，因为选择器从1开始所以每个值+1
            for (let i of duration_idx) {
                if (!CONFIG.LEGAL_DURATION.includes(i)) {
                    disabled_duration_idx.push(i + 1)
                }
            }
            //禁用不合法时长选项
            for (let i of disabled_duration_idx) {
                document.querySelector(`.more-conditions>.search-condition-row:nth-child(2)>.vui_button.vui_button--tab:nth-of-type(${i})`)?.setAttribute("disabled", "disabled");
            }
            //禁止全部分区
            document.querySelector(".more-conditions>.search-condition-row:nth-child(3)>.search-channel-item:nth-of-type(1)>.vui_button.vui_button--tab")?.setAttribute("disabled", "disabled");
        }
    }
    const UTILS = {
        //检测是否符合以下条件的url
        //1.是all或video路由
        //2.并且都有keyword参数
        is_trueURL: () => {
            let lastUrl = window.location.href
            return (lastUrl.includes("/all?") || lastUrl.includes("/video?")) && lastUrl.includes("keyword=")
        }
    }
    const CONTENT = {
        //url正确才会触发这个方法：第二步检测内容是否符合条件
        content_check: () => {
            //url正确所以禁用部分选项
            UI.buttonDisable()
            //获取当前url
            const url = new URL(window.location.href);
            const params = url.searchParams;
            //获取时长和分类参数
            const hasTids = params.has('tids');
            const duration = params.get('duration')
            //是否有分区tids，并且时长duration在规定范围
            if (hasTids && CONFIG.LEGAL_DURATION.includes(+duration)) {
                //有，显示内容
                CONTENT.content_show()
            } else {
                //1.url正确。2.内容不正确。则隐藏内容
                CONTENT.content_hide()
            }
        },
        content_show: () => {
            //没有切换到：不是符合条件的url，显示搜索内容
            var div = document.querySelector('.search-page-wrapper');
            var computedStyle = window.getComputedStyle(div);
            if (computedStyle.display === 'none') {
                console.log('div 是隐藏的');
                setTimeout(() => {
                    div?.style?.setProperty('display', 'block', 'important');
                    console.log('div 显示方法已执行');
                }, 100)
            } else {
                console.log('div 是可见的');
            }
        },
        //设置url中有 tids和duration 才显示内容.search-page-wrapper才设置为block
        //隐藏过滤前的内容
        content_hide: () => {
            //先隐藏，再删除，因为搜索后加载有延迟所以现隐藏然后延迟500ms删除
            document.querySelector('.search-page-wrapper').style.setProperty('display', 'none', 'important')
            //因为切换会闪出之前的所以删掉，反正切换分类会再显示
            setTimeout(() => {
                document.querySelector(".search-page.search-page-all>div")?.children[2]?.remove()
                document.querySelector(".search-page.search-page-all>div")?.children[1]?.remove()
            }, 500)
        }

    }

    /*
    🕵️‍♂️监听模块
    */

    const jt = () => {
        //第一次进来就是正确url的情况触发这个方法，之前出现频繁切换内容可能出现不显示问题就是多线程控制内容显示，现在统一用jt控制显示就ok了
        CONTENT.content_check()

        //清除检测是否为正确url的定时器
        clearInterval(intervalId)

        // 监听 URL 变化的函数
        const listenForUrlChange = () => {
            let lastUrl = window.location.href;

            setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    console.log("URL 变化:", currentUrl);
                    //是否切换到了正确的url
                    if (UTILS.is_trueURL()) {
                        //符合url条件，content_check里再判断参数是否正确
                        CONTENT.content_check()
                    } else {
                        CONTENT.content_show()
                    }
                }
            }, 100); // 每100毫秒检查一次
        }

        // 启动监听
        listenForUrlChange();
    }

    var intervalId
    const init = () => {
        //第一层监听：持续监听url是否正确
        document.addEventListener('DOMContentLoaded', () => {
            //监听是否是有选项卡的视频列表页面，第一次进入时候使用，直到observe监听dom启动会关闭这个监听器
            intervalId = setInterval(() => {
                // 如果url正确
                if (UTILS.is_trueURL()) {
                    //判断有无添加过滤css
                    if (!UI.flag.has_filterCss) {
                        //没添加过就添加,这样第一次进入其他符合gm条件但不是视频页就不会不显示内容了
                        UI.init_after_dom()
                    }
                    //1.部分选项禁止
                    //2.继续判断参数是否正确
                    //3.第二层监听：持续监听url切换
                    jt()
                }
            }, 1000);
        });
    }

    //启动
    init()
})();