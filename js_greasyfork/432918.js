// ==UserScript==
// @name         上海交通大学 Canvas 平台课程视频播放器至尊版焕然一新插件
// @namespace    http://tampermonkey.net/
// @version      4.0.5
// @description  优化上海交通大学 Canvas 平台课程视频播放器的功能
// @author       danyang685
// @match        https://oc.sjtu.edu.cn/*
// @match        https://courses.sjtu.edu.cn/*
// @match        https://vshare.sjtu.edu.cn/play/*
// @match        https://v.sjtu.edu.cn/jy-application-canvas-sjtu-ui/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAACPhJREFUWEfFl3mM1dUVx7/n3N/vzcIAI8x7Q2DezCBSVCLEMswMi7hFg7hExSVxqVZNWou1TZqa2jY10aRNGxNjtDYmtikVuxCtUWJjUYtxQWYcxaWWgbLMxgyzCgzM8t7vnm9zHx0LCMU2Tfr+/N3lfO653/O95wn+zz/5b+K3YFE8VnGoGBiZHJlpomUH8mXj+Qvb2sb+0/2+MMCWaWdMYTx2ljOtMaIcIomAk0g4KAZBiRV22CvbOIq/Lz3YNfRFYE4J8FbFvMkxxlYQnBsCqWdrAnajBEPjUcQQpCqK2Lt/fHpMPZOOs2AoUbGOZBzNpwI5KQABaanMzjcvyyjSqZBuo12lIuYNzy0ZbN929AmbKrJ1gNwA4DAEbRT2gDpXaE31A53vCVCAPf53QoAQvDmdXU7oAlH8qb23vaM2XXWJQecpuNUT5czxraNPtyVTs1rI2wCUC/DW4Un64KSDuTRdfCnI3rKByRvn45PcKQEKwTM1jYBVuny8qe7T3QfCoqaK6iu8WGt6anHn0P7RGnEua6SDoESp/TAfm7oKwBaC8lFjf8ezYV3LzJmllotuJniofqDzDwLY0RCfy0Dz9OxiqpxdrOPPLuztPTwx+Z0ZtbWa5+l0doGYLIDgbAJeAAGREOgR4SYBdlGi1oa+PR9OrN1cVVUSjblrKdbR0N/55kkBWmbOrPA5dyugO/IofqM4NezrurtHmtO1M8L9Q3GnAGUhxaQ0k9hd2EysVqiLIaxH4a75vDn32yX72trC8Nby2nIfscQLViWRvrqsZ0/7BMQxGWjK1FxD4jQhF1PQ6uheHkcyHIvcC8GVMLwhER5fvK9jW0hly2mnT9WikdTOffuGrgfYUllda5Q1IK+CyAYIHvPmnYNbeQSUB0mJOvrb194A+MKnCZLmaTOz1GgVFKMkVgngTO1h592lBG8E+KuRMvdEMJtN6XRZmRbXGvUy0KoFshfQl9v62z5OA1JSUX2PCO4FsF6V68y0AeBCAO+RKBL41xsG9u44FiBdtRKqeQ875MxdArFBmh6A8NsgXh8Z6Pj+hUCyJVN9qxhWi+JDQg4VNiZGITJJKD+r72/7YD3gqiuqfyCC6wV4yGBbBXK9QrfC/KB3LtvY1/7cZwDBWn2m707vuWHpYNfepsqa2ZLPJ9T4fggXuyRaXffp7o5PMD81nD70CIR1QjSFayCwAEQXwA+ocubkvsn3hHJ7f8aMdN6nQiXsIfGYWtKXlOoADqJEU3pdlErWBX0VruDtyjmZmLnVSYq/XtrVNVoou8zshaB/gsSfGwc6HiyUFBbFVtF/OwVzIGwj5TQACxXo0SR6xLvkfqd8uK6vc1eY35zJ3k3KHaTc1zjQvil8C9mpyVTfLEmyqX6ou7MA0JLJzjHIksV9Hc8Exwpe8G5F9RUU/FjANfX9nW9srqw6x3m9BSpZEJuDIYK6wmApgXgQg1BMBjlOES/Ex0Z5W4XrKPhJQ1/Hugk3DJ4iol3hugoA706vqveq1cE8QvAgzncz2a+Tcrc5vTKU05Z09qsC+SbAcVA+CD4AYMVxzkYQf4MUHqcnqfqa0P8RghemTUk9OnfnzvEwf0tFzYUADzYOdASLPgJAlWJN4ra8s9OLorFPcknqZgHuSmJ3eajbcE1FiZ/mxc4XSBnEZpMyBcCXIdwBSEziNYi9pKINRmuKYtub5N2zELQo3RNGmzUqo9snaUkY72/s6/qoAFC4b0vOFmInBcudj5/zLrkMIt9wJjfWDba1hnlBWDkf32vg2gi6hpCRYDwCzITymfrejtcKOkn3XatJ/E4i4ybOvUhgrdf4d47JeUiSJmg0l86PLOntCkIGggfAuYvzUbQpztt1ifMbI2iGHo9S5YGJkmlOZ28k5bCKeAO/RUEHKHkBM4DsoI9/Ojq0c2RSOnuLd+51SThbhL+A8HtMZAec1BblZfN4ihc7078uHtizvQAQmg11udvzkXsh8sllKrKT+WQ7XfRUMBkjfw7gchUU5yP3ZJT470gQW/ABhcBAqMxT4unyqfFfBg/krhT6j6DR10g2RKZ30dl0A+YIdSPByxONNizr3dVXACioPp29TRQt9DKbyllE9LxYchNE1gjlAQqvFmCeEY+rygDJuUJJAJRSMQZaCtB94vMbDaUHJMrPB7mWwt9Hpr8w4CLCTJ00GbG8va/jmWDHn1nxlsraRjWrDhCeci3gNwpiAf1DIEoVbg2cz9IsEtFhT9T982ktFUqKgiKC/aLyovMYS8R+Gdo0Ovuhg5bBc6Ugeso0OUtEhoNejrHi0HpFMnpH2IDkGSqwJLFWEVmkIt8FsF+V9yfiDknOSiVy8ZH3JWgwKFFoZi5SlhC4j8RcAj+KhFs9ZBkhh0XwPrxd41L+N3Xd3QPHABxxrpqlNKuxyL3jzK8i0I3Y3mQ+ukDINQJMJbCeHhus1PYs6eoaC+YSLHqkcrjKPK+G4CtAQZgPe+eakPgFqlIenM+rO1cUY419nRtP+BxvAqLSTPVNCuyC8ACJ8wzaZ95vUdEZKriFwHIBikj0iWKXsdAd1wKoBhie2NBwrPfG3aq6BAhe4d9kSI6z84sl9/TRjc7nOqItmdmVoF0nTF5xjNWcv4iGZovcgMvlPJ2rJWWRCM6FwAGiAg4TsjM0oIDbIZSpBn+BKDUhX3GkiurFOcMLywc6u0/aEU0MBAihX6lm20Rcp4fNomiDkh0Eeyg8oIiG85EUpfIozsUYk1w+iTRKa6JDFicrhDLoRd93hnLCrjD1rwTnO866/9WQHD+weXrVLKdupZB96qMPmcpPMepcktUKHjDwbaE7X8TC6TMgqkTZZqatCWx72C+CzhPwSzT/UuPQ3q7jY3xOhMdPCB2tT9x5Aswx020R0ArvYitKJh/2o+2TWLRInMYeekjFhuF1UBNN+djPovGc4BeWxK82Du08eKLgpwSYWBSaUpKLKJZRkbyZ7HWC/VDL50EJWoG36RCrFA0pR48k/r3FQ91dJ/tDcsIqOBnlxPfQXrsxZoloFmGTnTAncEIy8tDhCNLjzfX8uxN/YQ2cCuZ/Nf4P8iTQXa0LxcMAAAAASUVORK5CYII=
// @grant        GM_info
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432918/%E4%B8%8A%E6%B5%B7%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20Canvas%20%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%B3%E5%B0%8A%E7%89%88%E7%84%95%E7%84%B6%E4%B8%80%E6%96%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/432918/%E4%B8%8A%E6%B5%B7%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20Canvas%20%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%B3%E5%B0%8A%E7%89%88%E7%84%95%E7%84%B6%E4%B8%80%E6%96%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/*-----------------------------------------------
本项目主页： https://greasyfork.org/zh-CN/scripts/432918
水源社区讨论贴： https://shuiyuan.sjtu.edu.cn/t/topic/28688
-----------------------------------------------*/

(function () {
    'use strict';
    let script_version = GM_info.script.version; // 本脚本的版本号
    let window = unsafeWindow; // 脚本中使用GM函数后，必须使用 unsafeWindow 才可覆盖原有 window 事件回调函数

    // 登录页面，要求选 jAccount 或校外用户登录
    let is_canvas_login_page = location.pathname == "/login/canvas" && location.origin == "https://oc.sjtu.edu.cn"; // 允许带 hash 的登录页面
    // 点播页面，包括 Canvas 内置的和 courses.sjtu 网站上的
    let is_canvas_vod_page = location.href.startsWith("https://courses.sjtu.edu.cn/lti/app/lti/vodVideo/playPage");
    // 直播页面，Canvas 内置的
    let is_canvas_live_page = location.href.startsWith("https://courses.sjtu.edu.cn/lti/app/lti/liveVideo/index.d2j");
    // 课程视频 LTI 插件页面
    let is_canvas_lti162_page = new RegExp("https://oc\.sjtu\.edu\.cn/courses/\\d*/external_tools/(162|8199)").test(location.href);
    // 课程视频 LTI 插件页面
    let is_article_page = new RegExp("https://oc\.sjtu\.edu\.cn/courses/\\d*/modules/items/\\d*").test(location.href);
    // vshare 视频页面
    let is_vshare_page = location.href.startsWith("https://vshare.sjtu.edu.cn/play/")
    // 新 Canvas 课堂视频页面，2024秋季学期启用
    let is_new_canvas_video_page = location.href.startsWith("https://v.sjtu.edu.cn/jy-application-canvas-sjtu-ui/");
    // 处于 iframe 内
    let is_iframe = (self != top);

    // 检查是否为安卓设备
    function isAndroidPhone() {
        const isAndroid = navigator.userAgent.toLowerCase().includes("android");
        const isSmallScreen = Math.min(window.screen.width, window.screen.height) < 500; // 收紧了安卓设备的范围
        return isAndroid && isSmallScreen;
    }

    // 允许进一步缩放
    if (isAndroidPhone()) {
        // 怎么会一点也不起作用呢？一定是哪里出了问题，不应当不应当！
        // document.getElementById("viewport").setAttribute("content", "height=520, initial-scale=0, minimum-scale=0.25, maximum-scale=1.0, user-scalable=yes");
    }

    // 到达 Canvas 登录页时，自动跳转到 jAccount 登录页
    if (is_canvas_login_page) {
        location.replace("https://oc.sjtu.edu.cn/login/openid_connect");
    }

    // 新 Canvas 课堂视频页面，2024秋季学期启用
    else if (is_new_canvas_video_page) {
        console.log('新 Canvas 课堂视频页面，2024秋季学期启用')


        // 功能需求1，去除视频区域的姓名学号水印
        // https://shuiyuan.sjtu.edu.cn/t/topic/28688/480
        GM_addStyle(`
            #kmd-watermark-cvs {
                display: none !important;
            }
        `)

        // 功能需求2，去除暂停视频的遮罩效果
        // https://shuiyuan.sjtu.edu.cn/t/topic/28688/480
        GM_addStyle(`
            div.player-pause-mask {
                display: none !important;
            }
        `)


        function AfterVideoLoaded() {
            console.log('视频加载完成');
            // 虽然可以直接暴露video元素，但是破坏了其他功能

            // Array.from(document.getElementsByClassName("jkp-hover-wrap")).forEach(element => {
            //     element.remove();
            // });
            // Array.from(document.getElementsByClassName("jkp-content-wrap")).forEach(element => {
            //     element.remove();
            // });
            // Array.from(document.getElementsByClassName("jkp-default-slot-wrap")).forEach(element => {
            //     element.remove();
            // });

            console.log(document.getElementById("DraggableBox"))
            console.log(document.getElementsByClassName("jkp-default-slot-wrap"))
            // 全屏后，副屏dom会被整体移动到 .jkp-default-slot-wrap 里面

        }

        // 功能需求3，全屏时的双屏显示小屏鼠标滚轮控制大小
        // https://shuiyuan.sjtu.edu.cn/t/topic/28688/493
        function smallVideoWheelScale(event) {
            // 阻止默认的滚动行为，防止页面滚动
            event.preventDefault();
            const elements = document.getElementsByClassName("second-player-wrapper__body");
            if (elements.length == 0) {
                return;
            }
            const element = elements[0];
            var sizeDelta = -event.deltaY * 0.3;
            var currentWidth = parseFloat(window.getComputedStyle(element).width);
            var currentHeight = parseFloat(window.getComputedStyle(element).height);
            var ratio = currentHeight / currentWidth;
            currentWidth += sizeDelta
            if (currentWidth < 50) {
                currentWidth = 50;
            }
            currentHeight = currentWidth * ratio;

            element.style.width = currentWidth + 'px';
            element.style.height = currentHeight + 'px';
        }

        const observer = new MutationObserver(function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length) {
                        // console.log("------------------");
                        // console.log('新增子节点');
                        mutation.addedNodes.forEach(element => {
                            // console.log(element);
                            // 右下角小窗口是div#DraggableBox里面的div.second-player-wrapper__body
                            if (element.className != undefined && element.className.includes("second-player-wrapper__body")) {
                                if (element.parentNode.id == "DraggableBox") {
                                    // console.log("发现你了")
                                    element.removeEventListener('wheel', smallVideoWheelScale);
                                    element.addEventListener('wheel', smallVideoWheelScale);
                                }

                            }
                        });


                    }
                    if (mutation.removedNodes.length) {
                        // console.log("------------------");
                        // console.log('移除子节点');
                        mutation.removedNodes.forEach(element => {
                            // console.log(element);
                        });
                    }
                } else if (mutation.type === 'attributes') {
                    // console.log("------------------");
                    // console.log(`属性${mutation.attributeName}发生变化`);
                    // console.log(mutation.target);
                    // console.log(mutation.target.className);

                    if (mutation.target.className.includes("jy-progress-bar")) {
                        // observer.disconnect();
                        AfterVideoLoaded();
                    }
                }
            }
        });

        const targetElement = document.getElementsByTagName('body')[0];
        observer.observe(
            targetElement,
            {
                attributes: true,  // 监测属性变化
                childList: true,   // 监测子元素的添加或移除
                subtree: true     // 监测后代节点的变化
            }
        );
    }

    // LTI插件页面
    else if (is_canvas_lti162_page) {
        $(document).ready(function () {
            const oc_course_id = location.href.match(new RegExp("courses/(\\d*)/"))[1];

            // 去除了页面中多余的滚动条
            let clear_resize_event_interval = setInterval(function () {
                $(window).off("resize"); //删除疑似画蛇添足的resize事件，瞎删除2百次就行吧
                $(".tool_content_wrapper").attr("style", "").css("text-align", "center"); // 使iframe居中显示以便顺利纯享
                $("#tool_content")
                    .css("height", "510px")
                    .css("width", "1020px");
            }, 100);
            setTimeout(() => clearInterval(clear_resize_event_interval), 10000);

            // 移除了【课程导航菜单】隐藏控制按钮点击时不好看的外轮廓
            GM_addStyle("#courseMenuToggle:hover {box-shadow:none !important;} #courseMenuToggle:focus {box-shadow:none !important;}")

            // 关灯纯色元素
            $(".ic-Layout-columns").append($('<div class="light-turn-off"></div>'))
            $(".light-turn-off")
                .css("position", "fixed")
                .css("inset", "0")
                .css("background-color", "black")
                .css("z-index", "101")
                .css("display", "none"); // 页面最高z-index为100
            $("#tool_content")
                .css("position", "relative") // 写错了写错了，这里怎么可以是fixed呢
                .css("z-index", "102"); // 页面最高z-index为100

            // 自动更新cookie，防止页面会话失效
            function help_refresh_session() {
                $("body").append('<iframe src="' + location.href + '" style="display:none; height:0;" id="session_updater_iframe">');
            }

            let pending_request_refresh = false;

            // 将相关重要跨域传递给子页面
            $(window).on("message", function (event) {
                let origin = event.origin || event.originalEvent.origin;
                let data = event.data || event.originalEvent.data;

                if (origin == "https://courses.sjtu.edu.cn") {
                    console.log("收到子页面的message", data);

                    const command_text = data.slice(0, data.indexOf("!") + 1);

                    switch (command_text) {
                        case "online!": {
                            document.getElementById("tool_content").contentWindow.postMessage(
                                JSON.stringify({
                                    "message_type": "config_tranfer",
                                    "course_canvasid": oc_course_id,
                                    "course_name": $("#context_title").attr("value"),
                                    "course_fullname": $("#context_label").attr("value"),
                                    "user_name": $("#lis_person_name_full").attr("value"),
                                    "user_id": $("#custom_canvas_user_id").attr("value")
                                }), "https://courses.sjtu.edu.cn");
                            break;
                        }
                        case "help!": {
                            help_refresh_session();
                            break;
                        }
                        case "helpr!": {
                            help_refresh_session();
                            pending_request_refresh = true;
                            break;
                        }
                        case "done!": { // 新创建的附属页面完成了一次登录，会话已更新
                            $("#session_updater_iframe").remove();
                            if (pending_request_refresh) { // 需要发送刷新指令
                                pending_request_refresh = false;
                                document.getElementById("tool_content").contentWindow.postMessage(
                                    JSON.stringify({
                                        "message_type": "request_refresh"
                                    }), "https://courses.sjtu.edu.cn");
                                console.log("子页面要求在更新会话后刷新，刷新。");
                            }
                            break;
                        }
                        case "lightoff!": {
                            // 修复了乱改z-index导致的某些场景中的界面样式错乱
                            $(".ic-Layout-columns").css("z-index", "101");
                            const color = data.slice(data.indexOf("!") + 1 - data.length);
                            console.log(color)
                            $(".light-turn-off").css("background-color", color)
                            $(".light-turn-off").show(); // 搞渐变不好整啊，这finish和queue咋用啊。。。
                            break;
                        }
                        case "lighton!": {
                            // 修复了乱改z-index导致的某些场景中的界面样式错乱
                            $(".ic-Layout-columns").css("z-index", "");
                            $(".light-turn-off").hide();
                            break;
                        }
                        case "goback!": {
                            console.log("返回上一级！")
                            // if(history.length>1) history.back(); // 这个不好用，会导致仅iframe被后退
                            if (document.referrer.startsWith("https://oc.sjtu.edu.cn/courses/" + oc_course_id) && !document.referrer.endsWith("/external_tools/162")) {
                                location.replace(document.referrer);
                            } else {
                                console.log("无法返回合适的上一级")
                                location.replace("https://oc.sjtu.edu.cn/courses/" + oc_course_id);
                            }
                            break;
                        }
                    }
                }
            })
        })
    }

    // Canvas 课程文章
    else if (is_article_page) {
        let content_wrapper = $("#content-wrapper");
        if (content_wrapper.length) {
            let vshare_iframe = $(content_wrapper[0]).find("iframe");
            if (vshare_iframe.length) {
                let item = vshare_iframe[0];
                item.setAttribute('allowFullScreen', '') // 允许 Canvas 课程文章内嵌的网页视频全屏播放
                item.src = item.src; // 但会导致每次打开，播放量增加2
            }

            let iframe_title = $(content_wrapper[0]).find(".ui-listview-text");
            console.log(`length ${iframe_title}`)
            if (iframe_title.length) {

                let item = $(iframe_title[0]).find("a");
                item.css("text-decoration", "underline") // 使 Canvas 课程文章内嵌的网页视频顶部标签链接更加醒目
                    .css("color", "#33d")
                    .css("text-shadow", "0px 0px 10px white");
            }
        }

    }

    // 课程视频页面
    else if (is_canvas_live_page || is_canvas_vod_page) {
        console.log("%cCanvas课程视频加强！%c当前链接：%c" + location.href, "color:blue;", "color:green;", "color:#0FF;");

        const player_version = document.getElementsByTagName('html')[0].outerHTML.match(new RegExp("href=\"/lti/app/css/base\\.css\\?v=([0-9]*)\""))[1].slice(0, 8);
        const canvasCourseId = new URLSearchParams(location.search).get('canvasCourseId')

        function numberClamp(val, min = undefined, max = undefined) {
            if (min !== undefined) {
                val = val < min ? min : val;
            }
            if (max !== undefined) {
                val = val > max ? max : val;
            }
            return val;
        }

        let auto_refresh_flag = false,
            allow_long_live_flag = false, // 嘿嘿，嘿嘿
            allow_live_earlier = false,
            vlist_ajax_called_flag = true,
            live_video_links = new Array();
        canvas_live_vod_enhance_pre();
        let video_list_loaded_flag = false; // 通过捕获 getVideoInfoById 的调用来进行视频加载状态的检查
        {
            let raw_getVideoInfoById = getVideoInfoById;
            getVideoInfoById = function (id) {
                let vlist_ajax_called_flag_waiting_interval = setInterval(function () {
                    console.log("直播列表加载完成检测中")
                    if (!vlist_ajax_called_flag) {
                        return; // 哦原来它没有返回值啊，那太好了，可以用俺的土办法
                    }
                    clearInterval(vlist_ajax_called_flag_waiting_interval);

                    let data = undefined;


                    /*
                    while(!vlist_ajax_called_flag){
                        (async () => await new Promise(resolve => setTimeout(resolve, 10)))(); // 抄来的高级代码啊哈哈哈哈，嘤嘤嘤根本等不来那个ajax callback
                        console.log("waiting for vlist_ajax_called_flag");
                    }
                    */

                    if (allow_live_earlier) {
                        let newf = undefined;
                        eval("newf = " + raw_getVideoInfoById.toString()
                            .replace("getVideoInfoById", "")
                            .replace("noStart();\n\t\t\t\t\treturn;", "")
                            .replace("setTimeout(overLive, (courEndTime -currentTime));", "setTimeout(overLive, (courEndTime -currentTime)+15*60*1000);") // 允许持续观看直播至课后20分钟
                        );
                        raw_getVideoInfoById = newf;
                        console.log("allow_live");
                    }
                    raw_getVideoInfoById(id);
                    video_list_loaded_flag = true; // 如果没有视频的时候，它就不会被调用了emmmm。。。
                    console.log("loaded!");
                }, 10);
            }
        }
        let onload_check_interval = setInterval(function () {
            if (!video_list_loaded_flag) { // 或许用 $("body .loading").css("display")!="none" 判断的话会有极小概率出现线程间不同步（或许？？）
                console.log("loading...");
                // 20241123注意到后台启动浏览器标签页时有时会卡在这里，不知道如何解决。getVideoInfoById没成功覆盖？
                return;
            }
            clearInterval(onload_check_interval);
            console.log("页面加载完成")
            const t0 = Date.now();
            canvas_live_vod_enhance();
            console.log(`页面加载完成后任务运行完成，耗时：${Date.now() - t0}毫秒`)
        }, 50);

        function canvas_live_vod_enhance_pre() {
            if (is_canvas_vod_page) {
                // 阻止向服务器回报观看日志
                if (window.openQuestion) openQuestion = function () { };
                else {
                    console.log("%c日志阻断失败", "color:#0FF;");
                }
                if (window.addVodPlayLog) addVodPlayLog = function () { };
                else {
                    console.log("%c日志阻断失败", "color:#0FF;");
                }
                if (window.updateLiveCount) updateLiveCount = function () { };
                else {
                    console.log("%c日志阻断失败", "color:#0FF;");
                }
                if (window.updateVodPlayLog) updateVodPlayLog = function () { };
                else {
                    console.log("%c日志阻断失败", "color:#0FF;");
                }
                //dateVodPlayLog = updateLiveCount = addVodPlayLog = function () {};
            } else {
                if (window.updateLivePlayLog) updateLivePlayLog = function () { };
                if (window.updateLiveCount) updateLiveCount = function () { };
                if (window.addLivePlayLog) addLivePlayLog = function () { };
                //dateLivePlayLog=updateLiveCount=addLivePlayLog = function () {};
            }

            // 当前处于纯享模式
            if (location.hash == "#pure") {
                sessionStorage.setItem("pure", 1); // 一直就pure了
                location.hash = ""
            }

            // 允许通过点击顶部当前标签页重新载入当前网页
            $(".tab-item--active").click(function () {
                location.replace(location.href);
            });

            if (is_canvas_live_page) {
                // 将直播中同一场课程的多个节次合并显示
                let old_creatCourseList_func = creatCourseList;
                creatCourseList = function (lst) {
                    let joint_live_list = Array.from(function* getJointLiveItemList(lst) {
                        // 注意一会别忘了写长度为1的判定。……啊哈根本不需要写哈哈哈哈哈
                        for (let i = 1; i < lst.length; i++) {
                            let is_continious = Date.parse(lst[i].courBeginTime) - Date.parse(lst[i - 1].courEndTime) <= 1000 * 60 * 20, // 间隔小于20分钟
                                is_same_room = lst[i].clroName == lst[i - 1].clroName; // 在同一教室
                            if (is_continious && is_same_room) { // 视为同一课程安排
                                // TODO: 请优先返回后一节课程的录播流
                                lst[i - 1].courEndTime = lst[i].courEndTime;
                                lst[i] = lst[i - 1];
                                console.log("joint!")
                            } else {
                                yield lst[i - 1]; // 之前那个
                            }
                        }
                        yield lst[lst.length - 1]; // 最后一个
                    }(lst));
                    old_creatCourseList_func(joint_live_list);
                }
            } else {
                // 修复了使用Firefox或Safari浏览器时右侧视频列表视频时间显示为NaN的问题
                // 此功能官方已修复，但是这段代码还是留着吧，又没有副作用
                {
                    let newf = undefined;
                    eval(creatCourseList.toString()
                        .replace("function creatCourseList(data) ", "newf = function(data)")
                        // .replace("data[i].courseBeginTime;", "data[i].courseBeginTime;console.log('starttime:'+startTime);")
                        // 看来这里没问题

                    )
                    creatCourseList = newf;
                } {
                    let newf = undefined;
                    eval(dateFormat.toString()
                        .replace("function dateFormat(timestamp, formats)", "newf = function(timestamp, formats)")
                        .replace('timestamp.replace("-","/")', "timestamp") // 难道是故意创造的不兼容？
                    )
                    dateFormat = newf;
                }
            }

            $(document).ajaxComplete(function (event, xhr, settings) { // woc jQuery好厉害，但它不够快。明天再改。。。。。。。
                if (xhr.responseJSON == undefined) {
                    console.log("怎么办怎么办" + settings.url + "请求到了undefined。")
                    console.log(event, xhr, settings)
                    return
                }
                const response_json = xhr.responseJSON;
                switch (settings.url) {
                    case "/lti/liveVideo/findLiveList": {
                        // console.log("ajax done!!!",event,xhr,settings);
                        if (xhr.status != 200) { // 这是因为后台页面正在进行登录
                            location.reload();
                        }
                        let live_list = response_json.body.list;
                        if (live_list.length) {
                            let this_id = (new URLSearchParams(location.search).get("id") || live_list[0].id).replaceAll(" ", "+"); // 为什么加号会变成空格？？
                            console.log("活跃的视频ID：" + this_id);
                            live_list = live_list.filter(live_item => live_item.id == this_id);
                            if (live_list.length) {
                                let course_start_time_span = (Date.parse(live_list[0].courBeginTime) - new Date().getTime()) / 1000 / 60;
                                // 允许在课前25分钟即开始观看课程直播
                                if (course_start_time_span < 25 || allow_long_live_flag) {
                                    allow_live_earlier = true;
                                    vlist_ajax_called_flag = true; // 否则是来不及的
                                    console.log("try_allow_live");
                                }
                            }
                        } else {
                            video_list_loaded_flag = true; // 直接置位视频列表已加载的标志
                            console.log(`检测到 ${settings.url}`)
                        }
                        break;
                    }
                    case "/lti/vodVideo/findVodVideoList": {
                        // console.log("ajax done!!!",event,xhr,settings);
                        if (xhr.status != 200) { // 这是因为后台页面正在进行登录
                            location.reload();
                        }
                        let vod_list = response_json.body.list;
                        if (vod_list.length == 0) {
                            video_list_loaded_flag = true; // 直接置位视频列表已加载的标志
                            console.log(`检测到 ${settings.url}`)
                        }
                        break;
                    }
                    case "/lti/liveVideo/getLiveVideoInfos": { // 直播源的信息
                        // console.log("ajax done!!!",event,xhr,settings);
                        if (xhr.status != 200) { // 这是因为后台页面正在进行登录
                            location.reload();
                        }
                        let live_list = response_json.body.videoPlayResponseVoList;
                        live_list.forEach(function (item) {
                            live_video_links.push(item.rtmpUrlHdv)
                        })
                        console.log(live_video_links)
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }

        function canvas_live_vod_enhance() {
            let is_from_default_lti_entry = document.referrer.startsWith("https://oc.sjtu.edu.cn/"),
                video_count = $(".lti-list .item-text").length || $(".lti-list .item-infos").length,
                is_live_playing = $(".lti-list .live-course-item--avtive .icon-play").length,
                no_live_video_played = false,
                just_clicked_screen = false; // 刚刚点过屏幕

            let is_single_video = undefined,
                use_storage_flag = true;

            // 在右侧视频列表顶部用文字显示视频总数
            $(".lti-list>.list-title").append($('<span style="font-size: 50%;">(' + video_count + '条视频)</span>'));
            // 移除视频列表标题区的不正确的默认提示文字
            $(".lti-list>.list-title").attr("title", "");


            let usercode = undefined; { // 学号
                let ma = document.getElementsByTagName('html')[0].outerHTML.match(new RegExp("loginUserCode = '([0-9A-Za-z\\-%]*)';"));
                if (ma) {
                    usercode = decodeURIComponent(ma[1]);
                }
            }

            function setStorage(k, v) {
                if (use_storage_flag) {
                    localStorage.setItem("canvasnb_plugin_" + k, v);
                }
            }

            function getStorage(k) {
                if (use_storage_flag) {
                    return localStorage.getItem("canvasnb_plugin_" + k);
                } else {
                    return null;
                }
            }

            function isVideoStuck(vid) {
                // 浏览器升级至Chrome 97后，安装本插件直接打开【课程视频】页面时，视频将开始转圈圈，不能播放，需要刷新。此时将自动刷新页面
                return $(`#loading-service-0000${vid} .kmd-flex-center.kmd-loading-view.kmd-loading-bg.kmd-full`).length != 0;
            }
            let videoStarted = false;
            function isVideoBuffering() {
                let badCnt = 0;
                $('video#kmd-video-player').each(function (index) {
                    if ($(this)[0].readyState < 2) // 1: HAVE_METADATA, 2: HAVE_CURRENT_DATA, 3: HAVE_FUTURE_DATA, 4: HAVE_ENOUGH_DATA
                    {
                        badCnt += 1;
                    }
                    // console.log(`video ${index} ${$(this)[0].readyState}`)
                });
                // console.log(`badCnt ${badCnt}`)
                return badCnt != 0;
            }

            // 首先获取本页面的课程ID
            let course_id = undefined; {
                // 本科生课程0-9A-Z，研究生课程额外含有a-z和-，感谢@icebreak的反馈
                // 修复某些情况下获取到错误错误ID的情况
                let ma = document.getElementsByTagName('html')[0].outerHTML.match(new RegExp('canvasCourseId="([0-9A-Za-z\\-%]*)";'));
                if (ma) {
                    course_id = decodeURIComponent(ma[1]);
                }
            }
            console.log("课程ID：" + course_id);
            if (!course_id) {
                console.log("%c课程ID获取失败！", "color:red;")
                use_storage_flag = false;
                course_id = "UNKNOWN_COURSE"
            }

            // 再获取本视频的视频ID
            let video_id = $(".lti-list .list-item--active").attr("id") || $(".lti-list .live-course-item--avtive").attr("id"),
                userid = getStorage("course_" + course_id + "_last_userid"),
                username = getStorage("course_" + course_id + "_last_username"),
                last_play = getStorage(usercode + "_course_" + course_id + "_lastplay_video_id");

            // 修复了部分场景下无法自动跳转到上一次观看的点播视频的bug
            if (course_id != "UNKNOWN_COURSE" && last_play != null) {
                if (is_canvas_vod_page) {
                    if (new URLSearchParams(location.search).get('id') === null) { // 适配20211201防串课更新
                        location.replace(location.href + "&id=" + last_play); // 适配20211201防串课更新
                        return;
                    }
                } else {
                    // 适配20211201防串课更新
                    $(".tab-demand>a").attr("href", "/lti/app/lti/vodVideo/playPage?canvasCourseId=" + encodeURIComponent(canvasCourseId) + "&id=" + last_play); // 直播页面顶部切换到点播页面的按钮
                }
            }

            // 修复了右侧视频栏中已激活的视频在部分场景下仍然可点击的bug
            if (video_id && video_id.length > 10) { // 10是我瞎写的
                let new_search = "?canvasCourseId=" + encodeURIComponent(canvasCourseId) + "&id=" + video_id; // 适配20211201防串课更新

                let new_url = new URL(location); // 这里原来不能用location啊，呜呜呜之前写的一直是错的
                new_url.search = new_search;

                if (location.href != new_url && location.search != new_search) { // 点播页面检查的是当前url
                    console.log("链接未包含视频id，原search：" + location.search + "目标search：" + new_search)
                    console.log("raw url: " + location.href + " , push new url: " + new_url);
                    window.history.pushState('data', document.title, new_url);
                }
                if (is_canvas_live_page) {
                    urlId = video_id; // 直播页面检查的是内部变量
                }
            }

            // 移除自带的反馈和帮助按钮，我的优秀用户已经不需要看那个入门资料了
            $(".lti-page-tab>.tab-help").remove()


            // 跳转到合适的直播页面
            function redirectToVodPage() {
                // 修复了自动跳转到点播页面时，需要二次跳转到上次视频的bug
                let last_play = getStorage(usercode + "_course_" + course_id + "_lastplay_video_id");
                if (last_play != null) {
                    // 适配20211201防串课更新
                    location.replace("https://courses.sjtu.edu.cn/lti/app/lti/vodVideo/playPage?canvasCourseId=" + encodeURIComponent(canvasCourseId) + "&id=" + last_play); // 适配20211201防串课更新
                    return true;
                } else {
                    // 适配20211201防串课更新
                    if (location.href != "https://courses.sjtu.edu.cn/lti/app/lti/vodVideo/playPage?canvasCourseId=" + encodeURIComponent(canvasCourseId)) {
                        // 避免了潜在的死循环可能（对于未开放录播的课程）
                        location.replace("https://courses.sjtu.edu.cn/lti/app/lti/vodVideo/playPage?canvasCourseId=" + encodeURIComponent(canvasCourseId));
                        return true;
                    }
                }
                return false; // 适配了未开放录播因此无处跳转的课程
            }

            let no_live_available = false;

            if (is_canvas_live_page) {
                let should_redirect_flag = false;
                let will_not_play = true;
                if (video_count != 0) {
                    let item_date = $(".live-course-item--avtive .item-infos p:nth-child(2) span:nth-child(2)").text(),
                        item_time = $(".live-course-item--avtive .item-infos p:nth-child(3) span:nth-child(2)").text().split("~")[0],
                        next_date_span_minute = (Date.parse(item_date + " " + item_time) - new Date().getTime()) / 1000 / 60; // 距离正式开始直播的分钟数

                    console.log(`距离上课还有${next_date_span_minute}分钟！`)
                    // 当距离上课还有超过40分钟时，访问【课程视频】自动切换到点播页面
                    if (next_date_span_minute > 40 && !allow_long_live_flag) {
                        should_redirect_flag = true;
                        console.log('距离上课还有超过40分钟时，访问【课程视频】自动切换到点播页面')
                    }
                    if (next_date_span_minute > 25 && !allow_live_earlier) {
                        setTimeout(function () {
                            if (is_iframe) {
                                refresh_session(true); // 刷新页面，开始观看直播
                            } else {
                                location.reload(); // 这个恐怕很难有用吧，猜猜会话多久过期？
                                // 经过测试，在未重复登录的情况下，会话可以连续使用长达15小时以上
                                // 但在多次重复进入【课程视频】页面后，旧的会话可能迅速过期
                                // 那就每五分钟刷新一次吧！
                            }
                        }, 5 * 60 * 1000); // ((60 * (next_date_span_minute - 25)) + 30) * 1000

                        // 在开始直播时自动刷新页面，以便进行无人值守的录屏
                        const video_not_start_text_shown_check_interval = setInterval(function () {
                            if ($("#playerDiv>.live-video-tips").length) {
                                clearInterval(video_not_start_text_shown_check_interval);
                            } else {
                                return;
                            }
                            $(".live-video-tips").html("课程将于<span></span>后开始，课前25分钟自动开放")

                            function updateTimeleftText() {
                                const time_left = (Date.parse(item_date + " " + item_time) - new Date().getTime()) / 1000 - 25 * 60 + 30;
                                //据说这样比较好理解
                                var time_second = parseInt(time_left);
                                var time_day = 0;
                                var time_hour = 0;
                                var time_minute = 0;
                                while (time_second > 24 * 60 * 60) {
                                    time_second -= 24 * 60 * 60;
                                    time_day += 1;
                                }
                                while (time_second > 60 * 60) {
                                    time_second -= 60 * 60;
                                    time_hour += 1;
                                }
                                while (time_second > 60) {
                                    time_second -= 60;
                                    time_minute += 1;
                                }
                                var time_str = "";
                                if (time_day > 0) {
                                    time_str += `${time_day}天`;
                                }
                                if (time_hour > 0 || time_str.length > 0) {
                                    time_str += `${time_hour}时`;
                                }
                                time_str += `${time_minute}分`;
                                $(".live-video-tips>span").text(time_str);
                            }
                            setInterval(updateTimeleftText, 20000);
                            updateTimeleftText();
                        }, 5)


                    }
                } else {
                    should_redirect_flag = true;
                }
                if (is_from_default_lti_entry) {
                    if (window.innerHeight == 0) { // 我是用于更新会话的工具iframe
                        console.log("会话更新已完成！课程ID：%c" + course_id, "color:#0FF;");
                        top.postMessage("done!", "https://oc.sjtu.edu.cn");
                        return;
                    } else if (should_redirect_flag) {
                        if (redirectToVodPage()) return;
                    }
                }
                if (should_redirect_flag && !allow_live_earlier) {
                    no_live_available = true; // 无可用的直播视频时，停止等待视频
                }
            }


            // 从canvas内直接打开【视频点播】时，自动切换到上次观看的视频
            if (is_canvas_vod_page) {
                if (new URLSearchParams(location.search).get('id') == null) { // 适配20211201防串课更新
                    if (redirectToVodPage()) return; // 适配了未开放录播因此无处跳转的课程
                }
                if (video_id != undefined) {
                    setStorage(usercode + "_course_" + course_id + "_lastplay_video_id", video_id);
                }
            }

            console.log("视频ID：" + video_id);

            if (is_iframe) {
                console.log("发送message：online!");
                top.window.postMessage("online!", "https://oc.sjtu.edu.cn");
            }

            $(window).on("message", function (event) {
                let origin = event.origin || event.originalEvent.origin;
                let data = event.data || event.originalEvent.data;

                if (is_iframe && origin == "https://oc.sjtu.edu.cn") { // oc.sjtu仅会向iframe内的course.sjtu发送消息
                    console.log("收到父页面的message", data);
                    let message = JSON.parse(data);
                    if (message["message_type"] == "config_tranfer") {
                        setStorage("course_" + course_id + "_realname", message["course_name"]);
                        setStorage("course_" + course_id + "_canvasid", message["course_canvasid"]);
                        setStorage("course_" + course_id + "_fullname", message["course_fullname"]);
                        setStorage("course_" + course_id + "_last_userid", message["user_id"]);
                        setStorage("course_" + course_id + "_last_username", message["user_name"]);
                        userid = message["user_id"];
                        username = message["user_name"];
                        console.log("config_message:", message);
                        console.log("userid:", userid);
                        console.log("username:", username);
                    } else if (message["message_type"] == "request_refresh") {
                        location.reload(); // 刷新页面
                    }
                }
            });

            // 覆盖已有设定，有一说一，光屏蔽F12有用吗，Chrome还可以 Ctrl+Shift+I 呢。
            window.onkeydown = window.onkeyup = window.onkeypress = window.oncontextmenu = undefined;

            // 移除了视频下方课程信息区域，压缩页面高度
            $(".course-details").empty();

            // 移除直播视频上的两个无意义图标
            $(".live-review-icon").remove();
            $(".icon-play").remove();

            // 将全局右键屏蔽改为仅应用至视频区域
            $("#rtcMain").bind('contextmenu', function (event) {
                // console.log("contextmenu");
                event.preventDefault();
                return false;
            });


            // 无视频可播放时，这部分依然需要执行
            // 修复了未开放录播的课程的页面外观
            if (is_canvas_vod_page) {
                $("#rtcMain").css("background-color", "transparent");
                $(".video-box").css("background-color", "black"); // 否则这里就会一片空白
            } else {
                $("#rtcMain").css("background-color", "black");
            }

            // 播放器大致加载出来之后做的事
            function afterVideoPreloaded() {
                if (!sessionStorage.getItem("pure")) {
                    $("#rtcMain").css("position", "relative");
                    $("#rtcContent").css("width", "100%").css("height", "406px"); // 20241025适配新版本的尺寸的微小变化
                    $(".lti-video").css("margin-top", "26px").css("margin-bottom", "0");
                    $(".video-box")
                        .css("width", "unset")
                        .css("height", "unset");

                    // 将课程名移动到标题栏的空白区域中
                    const course_name = $(".list-title.courser-video").text().trim();
                    if (!is_iframe) {
                        $('<div style="display: inline-block; font-size: 28px; font-weight: bold; margin-left: 200px; margin-top: -2px; position: absolute;"></div>')
                            .text(course_name)
                            .insertBefore($("#btn_about_canvasnb"));
                        document.title = `${course_name} ${$(".tab-item--active").text()}`;
                    }
                    $(".list-title.courser-video").remove();
                }
            }

            // 播放器完全加载出来之后做的事
            function afterVideoLoaded() {
                let is_user_interacted = false; // 用户已进行交互的标志，感谢 Teruteru 的辛苦调试，现在不会在视频播放前卡住了

                // 特殊判断只有一个视频流的点播视频
                is_single_video = $(".cont-item-2").length == 0;

                // 隐藏画面上的音量控制
                $(".voice-icon").hide();

                function lightoffControl(on, bgcolor) {
                    if (on) {
                        $("#lightControl>span").text("开灯")
                        let color = bgcolor || getStorage(usercode + "_black_color");
                        if (color == null) {
                            color = "black";
                        }
                        setStorage(usercode + "_black_color", color);
                        $(".light-turn-off").css("background-color", color)
                        $(".light-turn-off").show();

                        if (is_iframe) { // 父页面也关灯
                            top.postMessage(`lightoff!${color}`, "https://oc.sjtu.edu.cn");
                        }
                    } else {
                        $("#lightControl>span").text("关灯")
                        $(".light-turn-off").hide()
                        if (is_iframe) {
                            top.postMessage("lighton!", "https://oc.sjtu.edu.cn");
                        }
                    }
                }

                // 是否正在播放/暂停
                function getPlay() {
                    return $(".tool-btn__play").css("display") == "none"; // 修复了不恰当的“播放"判据
                }

                // 设置播放/暂停
                function setPlay(status, quiet = false) {
                    if (status) {
                        console.log("请求播放！");
                        kmplayer.play("play");
                        if (!quiet) {
                            putText("状态：播放");
                            is_user_interacted = true;
                        }
                    } else {
                        console.log("请求暂停！");
                        kmplayer.play("pause");
                        if (!quiet) {
                            putText("状态：暂停");
                        }
                    }
                }

                // 切换播放/暂停
                function togglePlay() {
                    setPlay(!getPlay());
                }

                function getMuted() {
                    return $(".tool-btn__voice").length == 0;
                }

                function setMuted(muted) {
                    kmplayer.voice((muted) ? "voice" : "muted");
                }

                function setSpeed(speed) {
                    for (let i = 0; i < kmplayer.ids.length; i++) {
                        kmplayer.allInstance['type' + (i + 1)].playbackRate(speed);
                    }
                }

                function changeSpeed(speed) {
                    console.log("设定倍速：" + speed);
                    setStorage(usercode + "_speed_val", speed);
                    setSpeed(speed);
                    clearTimeout(timeout_reset_speed_text);
                    $("#timesContorl>span").html(speed);
                    timeout_reset_speed_text = setTimeout(function () {
                        $("#timesContorl>span").html("倍速"); // 修改倍速后，状态栏短暂显示倍速数值
                    }, 500)
                    $("#timesContorl>ul>li").each(function (idx, elem) {
                        if (elem.id == speed) {
                            $(elem).attr("class", "times-active");
                        } else {
                            $(elem).attr("class", "");
                        }
                    });
                }

                // 读取播放速度
                function getSpeed() {
                    return $("#player-00001 #kmd-video-player")[0].playbackRate;
                }

                // 调整倍速
                function increaseSpeed(delta) {
                    // 缝补修复了不恰当的倍速控制功能逻辑
                    // 20221212小注释，这个delta参数只有2个取值，0.1和-0.1，那么0.1进1档，-0.1退1档岂不美哉？
                    let is_using_default_speed = (Math.abs(getSpeed() - default_time_speed) < 0.005);
                    let time_speed_base = is_using_default_speed ? default_time_speed : current_time_speed;
                    // 20221212这个好像是用来四舍五入的？忘了……
                    // 20221212哦！想起来了，之前是按键盘Z，可以临时回到默认播放速度来着

                    if (delta > 0) {
                        current_time_speed = Math.floor((time_speed_base + 0.0001) * 100) / 100; // 仅保留小数点后一位，末尾数为偶数
                    } else {
                        current_time_speed = Math.ceil((time_speed_base - 0.0001) * 100) / 100; // 仅保留小数点后一位，末尾数为偶数
                    }


                    current_time_speed += delta;

                    // 限制最大倍速范围为 0.6-6.0，超强十倍变速，过低倍速会导致声音变怪
                    // 20221212更新，因canvas播放器底层代码限制，倍速仅支持0.5、1.0、1.25、1.5、2.0、4.0、8.0共7档
                    // 20221212更新，16倍七段超强变速！（也不是不行）
                    // 20241123更新，由于教育技术中心已经放开此限制，应用户要求，已经恢复至原功能
                    current_time_speed = numberClamp(current_time_speed, 0.6, 6.0);
                    current_time_speed = Math.round(current_time_speed * 100) / 100; // 最多两位，避免浮点数误差
                    changeSpeed(current_time_speed);
                    putText(((delta > 0) ? "增加" : "减小") + "倍速：" + current_time_speed);
                }

                // 调整音量
                function increaseVolume(volDelta) {
                    let newVol = Math.round((getVolume() + volDelta) * 100);
                    newVol = numberClamp(newVol, 0, 100);
                    setVolumeMix(newVol / 100, 0);
                    // 使用快捷方式调节音量时，会在画面左上角以渐隐文本提示音量变化
                    putText(`音量: ${newVol}%`); // 调节时会在画面左上角显示当前音量
                }

                function toggleFullscreen() {
                    kmplayer.scrren(); // 这都能拼错？
                    putText("切换全屏");
                }

                // 设定播放位置
                function setTime(time) {
                    console.log('set time!!!')
                    time = numberClamp(time, Math.abs(getTimeDelta()), getDuration() - Math.abs(getTimeDelta()));
                    $("#player-00001 #kmd-video-player")[0].currentTime = time;
                    $("#player-00002 #kmd-video-player")[0].currentTime = time + getTimeDelta();
                }

                // 读取播放位置
                function getTime() {
                    return $("#player-00001 #kmd-video-player")[0].currentTime;
                }

                // 重写状态栏播放状态
                function updateTimeText() {
                    kmplayer.setViewSenTime(getTime()); // 时间显示同步
                    kmplayer.addSpeedRate(getTime()); // 进度条同步
                }

                // 读取音量
                function getVolume() {
                    return kmplayer.volume / 100;
                }

                // 设定各通道音量
                function setVolumeMix(volume_ratio, idx) {
                    volume_ratio = numberClamp(volume_ratio * 100, 0, 100);
                    $(".voice" + idx + "-rate").height(volume_ratio);
                    switch (idx) {
                        case 0:
                            kmplayer.volume = volume_ratio;

                            // 修复了调整子音量不为100%时调整总音量时音量产生短暂突变的bug
                            // 改变静音状态的函数里写入了一个50%音量，因此不能随意调用
                            if (volume_ratio == 0) {
                                setMuted(true);
                            } else if (getMuted()) {
                                setMuted(false);
                            }
                            rewriteVolume();
                            break;
                        case 1:
                            scene_audio_ratio = volume_ratio / 100;
                            break;
                        case 2:
                            computer_audio_ratio = volume_ratio / 100;
                            break;
                        default:
                            return;
                    }
                    setStorage(usercode + "_volume_" + idx + "_value", volume_ratio);
                    // console.log("channel" + idx + ": volume=" + volume_ratio)
                }


                const wait_user_interacted_interval = setInterval(function () {
                    if (is_user_interacted) {
                        // 感谢 Teruteru 的辛苦调试，现在不会在视频播放前卡住了
                        clearInterval(wait_user_interacted_interval);
                        // 支持了音量记忆功能，初始音量设置为100%
                        for (let idx = 0; idx < (is_single_video ? 1 : 3); idx++) {
                            let val = getStorage(usercode + "_volume_" + idx + "_value");

                            setVolumeMix((val != null ? parseInt(val) : 100) / 100, idx);
                            console.log(`恢复记忆音量，通道：${idx}，数值：${val}%`);
                        }
                    }
                }, 500);

                // 为两路声音设置均衡
                function rewriteVolume() {
                    // 修复了子音量在个别场景下调节无效的问题
                    // 0也是false，因此出现了音量到达0后再也无法恢复的bug
                    let main_vol = getMuted() ? 0 : kmplayer.volume; // 修复了引起静音按钮无效的bug
                    kmplayer.allInstance.type1.volume(main_vol * scene_audio_ratio);
                    if (!is_single_video) {
                        kmplayer.allInstance.type2.volume(main_vol * computer_audio_ratio);
                    }
                }

                // 为两路画面设置同步
                function syncTime() {
                    let delta = kmplayer.allInstance.type2.currentTime() - kmplayer.allInstance.type1.currentTime() - getTimeDelta();
                    // console.log(`当前误差 delta=${delta}`)
                    // 20241123奇怪，为什么加了isVideoBuffering检查，视频播放就不太正常了
                    if (Math.abs(delta) > 0.3 && videoStarted) { //20241123适当改大一点
                        kmplayer.allInstance.type2.currentTime(kmplayer.allInstance.type1.currentTime() + getTimeDelta());
                        setSpeed(current_time_speed);
                        // console.log(`为两路画面设置同步 delta=${delta}`)
                    }
                }

                // 设定小画面的尺寸
                function setSmallVideoSize(size) {
                    setStorage(usercode + "_zoom_ratio", size); // 重新打开时，记忆上次的小画面尺寸
                    let num2 = parseInt(size),
                        num1 = 100 - num2;
                    $("style").each(function (idx, elem) {
                        if (elem.innerHTML.includes(".style-type-2-1 .cont-item-2 {top: ")) {
                            $(elem).remove();
                        }
                    })
                    GM_addStyle(".style-type-2-1 .cont-item-2 {top: " + num1 + "%;left: " + num1 + "%; width: " + num2 + "%; height: " + num2 + "%;}");
                }

                let time_sync_delta = 0;

                function setTimeDelta(time_delta) {
                    time_sync_delta = time_delta;
                    // 当前时间差
                    $("#syncControl>div>p:last>span").text(time_sync_delta.toFixed(2))
                    setStorage("video_" + video_id + "_timedelta", time_delta);
                }

                function getTimeDelta() {
                    return time_sync_delta;
                }

                function getDuration() {
                    return kmplayer.durationSec;
                }

                // 输出左上角渐隐提示文本
                function putText(text) {
                    $("#custom-status-text>span").html(text);
                    $("#custom-status-text").finish().show().delay(1000).fadeOut(1000); // 完成前stoptruetrue的话，会导致delay不生效，为什么呢？
                }

                // 将时间转换为分:秒.毫秒
                function timeSec2Text(time) {
                    let time_s = parseInt(time);
                    let time_ms = parseInt((time - parseInt(time)) * 1000);
                    let time_min = parseInt(time_s / 60);
                    let time_sec = parseInt(time_s % 60);
                    return ("00" + parseInt(time_min)).slice(time_min >= 100 ? -3 : -2) + ":" + ("0" + parseInt(time_sec)).slice(-2) + "." + ("00" + parseInt(time_ms)).slice(-3);
                }

                // 创建截图
                function makeScreenshot(video_id, no_download = false) {
                    let se = $(".cont-item-" + video_id + " #kmd-video-player");
                    if (se) {
                        let el = se[0];
                        console.log(el);
                        let t = el.currentTime;
                        // 修正了此前自以为是的画面尺寸都是720p的想法
                        let w = el.videoWidth;
                        let h = el.videoHeight;
                        // 抄的jAccount验证码识别那个插件
                        $("body").append($('<canvas width="' + w + '" height="' + h + '" style="display: none;" id="screenshot_canvas"></canvas>'));
                        let canvas_el = document.getElementById("screenshot_canvas"),
                            current_time = timeSec2Text(t).replaceAll(":", "_").replaceAll(".", "_");
                        canvas_el.getContext("2d").drawImage(el, 0, 0);
                        let screenshot_img = canvas_el.toDataURL("image/jpeg");
                        $("#screenshot_canvas").remove();
                        if (no_download) { // 在新标签页打开，而不是下载
                            // console.log(screenshot_img);
                            window.open("", null, 'width=' + (w + 50) + ',height=' + (h + 50) + ',status=yes,toolbar=no,menubar=no,location=no').document.body.innerHTML = '<img src="' + screenshot_img + '">';
                        } else { // 下载
                            $("body").append($('<a href="' + screenshot_img + '" id="download_link" download="canvas_screenshot_' + current_time + '.jpg">下载</a>'));
                            $("#download_link")[0].click(); // 哦是我之前在浏览器里阻止了下载
                            $("#download_link").remove();
                        }
                    }
                }

                // 音频动态限幅器
                // 20221212 收到反馈，突然没有声音了。因此移除了该功能，可以解决问题

                // {
                //     let audio_context_enabled = false;
                //     const AudioContext = window.AudioContext || window.webkitAudioContext;
                //     let audioCtx = new AudioContext();

                //     const video1 = $("#player-00001 #kmd-video-player")[0];
                //     const video2 = $("#player-00002 #kmd-video-player")[0];
                //     const source1 = audioCtx.createMediaElementSource(video1);
                //     const source2 = audioCtx.createGain();
                //     if (video2) {
                //         audioCtx.createMediaElementSource(video2).connect(source2);
                //     }

                //     const compressor1 = audioCtx.createDynamicsCompressor(),
                //         gain_mix = audioCtx.createGain();

                //     // 去除了对电脑音频的自适应音量处理
                //     // 移除了音量增益
                //     source1.connect(gain_mix);
                //     source2.connect(gain_mix);

                //     compressor1.threshold.value = -30;
                //     compressor1.knee.value = 20;
                //     compressor1.ratio.value = 12;
                //     compressor1.attack.value = 0.010;
                //     compressor1.release.value = 0.010;

                //     gain_mix.gain.value = 1;
                //     gain_mix.connect(audioCtx.destination);

                //     function enableAudioEffect() {
                //         if (audio_context_enabled) {
                //             source1.disconnect(compressor1);
                //             compressor1.disconnect(gain_mix);
                //             source1.connect(gain_mix);
                //             putText("关闭自适应音量");
                //         } else {
                //             source1.disconnect(gain_mix);
                //             source1.connect(compressor1);
                //             compressor1.connect(gain_mix);
                //             putText("启用自适应音量");
                //         }
                //         audio_context_enabled = !audio_context_enabled;
                //         setStorage(usercode + "_auto_volume", audio_context_enabled);
                //     }

                //     // 鼠标右键点击音量图标启动自适应音量功能
                //     $("#voiceContorl").on("contextmenu", function (event) {
                //         enableAudioEffect();
                //     });

                //     // 支持了自适应音量功能的记忆
                //     if (getStorage(usercode + "_auto_volume") == 'true') {
                //         enableAudioEffect();
                //     }
                // }

                // 加快状态栏功能弹窗隐藏速度
                function new_hoverleave_callback(cld, prt) {
                    let timer = null;
                    prt.on('mouseover', function () {
                        clearTimeout(timer);
                        cld.show();
                    })
                    prt.on("mouseout", function () {
                        timer = setTimeout(function () {
                            cld.hide();
                        }, 100);
                    });
                }
                new_hoverleave_callback($(".voice-volume"), $("#voiceContorl"));
                new_hoverleave_callback($(".split-select"), $("#splitContorl"));
                new_hoverleave_callback($("#timesContorl>ul"), $("#timesContorl"));

                if (isAndroidPhone()) {
                    $('<div class="tool-bar-item tool-btn__times" style="position: relative; z-index: 20;"><span>安卓</span></div>')
                        .insertBefore("#voiceContorl");
                }

                // 增加图像参数调整选项，可进行亮度、对比度、不透明度的调节

                $('<div id="effectControl" class="tool-bar-item tool-btn__times" style="position: relative; z-index: 20;"><span>图像</span><div><p>图像参数设定</p></div></div>')
                    .insertAfter("#splitContorl");

                $("#effectControl")
                    .css("position", "relative")
                    .css("z-index", "20");

                $("#effectControl>div")
                    .css("position", "absolute")
                    .css("display", "none")
                    .css("bottom", "25px")
                    .css("left", "-58px")
                    .css("height", "auto")
                    .css("padding-bottom", "10px")
                    .css("width", "150px")
                    .css("border-radius", "3px")
                    .css("background-color", "rgba(28, 32, 44, .9)");
                $("#effectControl>div>p")
                    .css("font-size", "150%")
                    .css("font-weight", "bold");

                // 统一图像参数调整滑块样式
                GM_addStyle(`
                    input[id^=effect_slider_] {
                        -webkit-appearance: none;
                        height: 6px;
                        border-radius: 3px;
                        background: #0092E9;
                        outline: none;
                        margin: 7px 0px;
                    }
                    input[id^=effect_slider_]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border-radius: 16px;
                        background: white;
                        cursor: pointer;
                    }
                `);

                let effect_control_list = [{
                    for: "opacity",
                    label: "小窗不透明度",
                    default: 0.85,
                    min: 0.2,
                    max: 1.0
                }, {
                    for: "brightnesssA",
                    label: "现场亮度",
                    default: 1,
                    min: 0.7,
                    max: 2.5
                }, {
                    for: "brightnesssB",
                    label: "电脑亮度",
                    default: 1,
                    min: 0.7,
                    max: 2.5
                }, {
                    for: "contrastA",
                    label: "现场对比度",
                    default: 1,
                    min: 0.5,
                    max: 2.5
                }, {
                    for: "contrastB",
                    label: "电脑对比度",
                    default: 1,
                    min: 0.8,
                    max: 2.5
                }, {
                    for: "blurA",
                    label: "现场清晰度",
                    default: 0,
                    min: 1.5,
                    max: 0
                }, {
                    for: "blurB",
                    label: "电脑清晰度",
                    default: 0,
                    min: 2,
                    max: 0
                }]

                let effect_setting = JSON.parse(getStorage(usercode + "_effect"));
                if (!effect_setting) {
                    effect_setting = Object.fromEntries(effect_control_list.map(x => [x.for, x.default])); // 哦越来越熟练了呢
                }

                setStorage(usercode + "_effect", JSON.stringify(effect_setting));

                effect_control_list.forEach(function (v) {
                    if (effect_setting[v.for] == undefined) {
                        effect_setting[v.for] = v.default; // 其实上面那句可以删了，嘿但我就不删，看着多高级啊
                    }
                    $("#effectControl>div").append($('<div id="effect_container_' + v.for + '"></div'));
                    let container = $("#effectControl>div>#effect_container_" + v.for);
                    container.append($("<label>" + v.label + "</label>"));
                    container.append($('<input type="range" id="effect_slider_' + v.for + '" min="0" max="100">')); //嘤嘤嘤slider的默认样式好美啊
                    let range_slider = $("#effectControl>div #effect_slider_" + v.for);
                    range_slider[0].value = parseInt(100 * (effect_setting[v.for] - v.min) / (v.max - v.min));
                    range_slider.on("input change", function (event) {
                        let new_value = event.target.value / 100;
                        effect_setting[v.for] = v.min + (new_value * (v.max - v.min));
                        event.target.style.background = 'linear-gradient(to right, #0092E9 0%, #0092E9 ' + event.target.value + '%, white ' + event.target.value + '%, white 100%)';
                        setStorage(usercode + "_effect", JSON.stringify(effect_setting));
                    });
                    range_slider.trigger("input");
                })
                $("#effectControl>div").append('<input type="button" id="btn_reset_effect" value="还原默认">')
                $("#btn_reset_effect").on("click", function () {
                    effect_control_list.forEach(function (v) {
                        effect_setting[v.for] = v.default;
                        let range_slider = $("#effectControl>div #effect_slider_" + v.for);
                        range_slider[0].value = parseInt(100 * (effect_setting[v.for] - v.min) / (v.max - v.min));
                        // 修复了部分场景下滑块显示样式不正确的bug
                        range_slider.trigger("change");
                    })
                    // 哦豁忘记这个了
                    setStorage(usercode + "_effect", JSON.stringify(Object.fromEntries(effect_control_list.map(x => [x.for, x.default])))); // 可以清理废弃字段
                });
                $("#btn_reset_effect")
                    .css("margin-top", "8px");

                new_hoverleave_callback($("#effectControl>div"), $("#effectControl"));

                // 有两路视频时，能够通过设定参考点的方式进行画面同步
                if (!is_single_video) {
                    $('<div id="syncControl" class="tool-bar-item tool-btn__times" style="position: relative; z-index: 20;"><span>同步</span><div></div></div>')
                        .insertAfter("#timesContorl");
                    $("#syncControl")
                        .css("position", "relative")
                        .css("z-index", "20");
                    $("#syncControl>div")
                        .append('<p>双屏进度同步</p>')
                        .append('<p>在参考时刻<br/>分别按下按钮</p>')
                        .append('<input type="button" id="ref_scene">')
                        .append('<input type="button" id="ref_computer">')
                        .append('<p>还原</p>')
                        .append('<input type="button" id="ref_reset">')
                        .append('<p>当前时间差<span></span>秒</p>')
                        .css("position", "absolute")
                        .css("display", "none")
                        .css("bottom", "25px")
                        .css("left", "-58px")
                        .css("height", "auto")
                        .css("padding-bottom", "10px")
                        .css("width", "150px")
                        .css("border-radius", "3px")
                        .css("background-color", "rgba(28, 32, 44, .9)");
                    $("#syncControl>div>p:first")
                        .css("font-size", "150%")
                        .css("font-weight", "bold");
                    $("#syncControl>div>input")
                        .css("margin", "0 10px");

                    const sync_ref_name = {
                        ref_scene: "现场",
                        ref_computer: "电脑",
                        ref_reset: "还原"
                    }
                    $("#syncControl :button").each(function (idx, elem) {
                        elem.value = sync_ref_name[elem.id];
                    });

                    function clear_pending_sync_control_button() {
                        $("#syncControl :button").each(function (idx, elem) {
                            if (elem.value.includes("撤销")) {
                                elem.value = elem.value.substr(2, elem.value.length - 1);
                            }
                        });
                    }

                    let sync_ref_scene = -1;
                    let sync_ref_computer = -1;
                    let last_time_delta = getStorage("video_" + video_id + "_timedelta");
                    last_time_delta = last_time_delta == null ? 0 : parseFloat(last_time_delta);
                    setTimeDelta(last_time_delta);

                    function applyTimeDelta(value) {
                        setTimeDelta(value);
                        sync_ref_scene = -1;
                        sync_ref_computer = -1;
                        clear_pending_sync_control_button();
                    }

                    $("#syncControl :button").on("click", function (event) {
                        const elem = event.target
                        switch (elem.id) {
                            case "ref_scene": {
                                if (elem.value == "重设") {
                                    sync_ref_scene = -1;
                                    elem.value = sync_ref_name[elem.id];
                                } else {
                                    sync_ref_scene = kmplayer.allInstance.type1.currentTime();
                                    if (sync_ref_computer == -1) {
                                        putText("现场画面参考时刻: " + timeSec2Text(sync_ref_scene) + "，请选取相应的电脑画面参考时刻");
                                        event.target.value = "重设";
                                    } else {
                                        last_time_delta = sync_ref_computer - sync_ref_scene;
                                        applyTimeDelta(last_time_delta);
                                        putText("画面参考时间差" + last_time_delta.toFixed(3) + "s，画面已成功同步");
                                    }
                                }
                                break;
                            }
                            case "ref_computer": {
                                if (elem.value == "重设") {
                                    sync_ref_scene = -1;
                                    elem.value = sync_ref_name[elem.id];
                                } else {
                                    sync_ref_computer = kmplayer.allInstance.type2.currentTime();
                                    if (sync_ref_scene == -1) {
                                        putText("电脑画面参考时刻: " + timeSec2Text(sync_ref_computer) + "，请选取相应的现场画面参考时刻");
                                        event.target.value = "重设";
                                    } else {
                                        last_time_delta = sync_ref_computer - sync_ref_scene;
                                        applyTimeDelta(last_time_delta);
                                        putText(`时间差：${last_time_delta.toFixed(2)}s，画面已成功同步`);
                                    }
                                }
                                break;
                            }
                            case "ref_reset": {
                                if (last_time_delta == 0) {
                                    putText("同步状态未设定");
                                } else {
                                    if (getTimeDelta() == last_time_delta) {
                                        applyTimeDelta(0);
                                        putText("已清除自定义同步状态");
                                    } else {
                                        applyTimeDelta(last_time_delta);
                                        putText(`已恢复同步状态，时间差：${last_time_delta.toFixed(2)}s，画面已成功同步`);
                                    }
                                }
                                break;
                            }
                        }
                    });
                    new_hoverleave_callback($("#syncControl>div"), $("#syncControl"));
                }

                // 在播放控制栏增加了【关灯】按钮
                if (!sessionStorage.getItem("pure")) {
                    $('<div id="lightControl" class="tool-bar-item tool-btn__times" style="position: relative; z-index: 20;"><span>关灯</span></div>')
                        .insertBefore(".tool-btn__scrren"); // 修复了单视频模式下不支持关灯的bug
                }

                // 在播放控制栏增加了【纯享】功能按钮，在浮窗中进行播放
                $('<div id="aloneControl" class="tool-bar-item tool-btn__times" style="position: relative; z-index: 20;"><span>纯享</span></div>')
                    .insertBefore(".tool-btn__scrren");
                $("#aloneControl").on("click", function () {
                    const w = window.screen.availWidth * 0.6,
                        h = window.screen.availHeight * 0.6,
                        // 居中显示新窗口
                        y = window.outerHeight / 2 + window.screenY - (h / 2),
                        x = window.outerWidth / 2 + window.screenX - (w / 2);
                    window.open(location.href + "#pure", null, `width=${w},height=${h},left=${x},top=${y},status=yes,toolbar=no,menubar=no,location=no`);

                    setPlay(false); //暂停播放
                })

                $("#lightControl").click(function () {
                    switch ($("#lightControl>span").text()) {
                        case "关灯": {
                            lightoffControl(true);
                            break;
                        }
                        case "开灯": {
                            lightoffControl(false);
                            break;
                        }
                    }
                })
                $("#lightControl").on("wheel", function (event) {
                    if (event.originalEvent.deltaY == 0) {
                        // 不要响应水平滚轮
                        return;
                    }
                    if ($("#lightControl>span").text() != "开灯") {
                        // 开灯时才有用
                        return;
                    }
                    let color = getStorage(usercode + "_black_color");
                    if (color == "black") {
                        color = "white";
                    } else {
                        color = "black";
                    }
                    lightoffControl(true, color);
                })

                let progressBar_operating_flag = false, // 手动拖动进度条的过程中，不应覆写进度条状态
                    current_time_speed = 1.0,
                    default_time_speed = 1.0;

                let current_zoom_ratio = parseInt(getStorage(usercode + "_zoom_ratio")) || 45; // 重新打开时，记忆上次的小画面尺寸
                setSmallVideoSize(current_zoom_ratio); // 首先设置一遍

                // 使右侧视频列表的内容更紧凑了，并增加了教室显示
                let this_teacher;
                $(".lti-list .item-text").each(function (idx, elem) {
                    elem = $(elem);
                    elem.children("p:first").attr("title", ""); // 清空课程名title
                    elem.children(".classroom-name").css("display", "");
                    let course_name = elem.children("p:first").html();
                    let teacher_name = elem.children(".item-contour").html();
                    teacher_name = teacher_name.substr(3, teacher_name.length - 1).trim();
                    elem.children("p:first").html(course_name + "(" + teacher_name + ")"); // 课程名加教师名
                    elem.children(".item-contour").remove(); // 删除教师
                    let course_time = elem.children("p:last-child").html();
                    elem.children("p:last-child").html(course_time.trim().substr(0, course_time.length - 3));
                    if (elem.attr("class").includes("list-item--active")) {
                        this_teacher = teacher_name;
                    }

                    // 加粗突出显示未观看过的视频（感谢@evian_xian的反馈，确实好丑）
                    let elem_video_id = elem.parent().attr("id");
                    if (getStorage(usercode + "_video_" + elem_video_id + "_position") == null && video_id != elem_video_id) {
                        // 移除了未观看的视频的突出显示，没啥用啊
                        // elem.children().css("font-weight", "bold");
                    }
                });

                // 将右侧视频列表改为升序了
                // $(".list-main").html($(".list-main>.list-item").get().reverse());

                // 自动将当前视频条目定位到右侧视频列表中央
                if (is_canvas_vod_page) {
                    const active_element = $(".lti-list .list-item--active")[0];
                    if (active_element === undefined) {
                        // 应该是走错教室了，那怎么办呢？
                        console.log("走错教室了！真是的！！！")

                        // 适配20211201防串课更新
                        // 现在应该不可能串课了
                    }
                    $(".list-main")[0].scrollTop = active_element.offsetTop - 250;
                    //$(".lti-list .list-item--active")[0].scrollIntoView({block: "center"}); // 这个不太行，把整个页面都给滚没了
                }

                // 新窗口中的纯享播放
                if (sessionStorage.getItem("pure")) {
                    $("#aloneControl").remove();
                    // 移除所有其他元素
                    $(".lti-page").css("text-align", "center")
                    $(".main_container").css("display", "inline-block")
                    $(".courser-video.list-title").remove()
                    $(".lti-page-tab").remove()
                    $(".lti-list").hide()
                    // 使视频元素占满屏幕
                    $("body").append($(".main_container"));
                    $("body").css("overflow", "hidden"); // 修复了特殊情况下纯享模式出现滚动条的bug
                    $(".main_container")
                        .css("width", "100%")
                        .css("height", "100%")
                        .css("display", "inline-block");
                    $(".lti-video")
                        .css("width", "100%")
                        .css("height", "100%")
                        .css("margin", "0px");
                    $(".video-box")
                        .css("width", "100%")
                        .css("height", "100%");
                    $("#rtcMain")
                        .css("width", "100%")
                        .css("height", "100%");
                    if (is_canvas_live_page) {
                        // 直播没有进度条，稍微窄一些
                        $("#rtcContent")
                            .css("width", "100%")
                            .css("height", "calc(100% - 32px)"); // 20241025更新尺寸
                    }
                    else {
                        $("#rtcContent")
                            .css("width", "100%")
                            .css("height", "calc(100% - 40px)");
                    }

                    $(".kmd-container").on("contextmenu", function (event) { // 再把视频区域的右键锁上，否则将意外触发画面切换功能
                        event.preventDefault();
                        return false;
                    })

                    // 新窗口的纯享播放有标题了
                    const active_video_item = $(".list-item--active>div");
                    const t1 = active_video_item.children("p:first").text();
                    const t2 = active_video_item.children("p:last").text();
                    document.title = t1 + "—" + t2;
                }

                // 设定播放速度
                let timeout_reset_speed_text = null;

                // 重写原生全屏函数
                {
                    function tabbarForcedActive() {
                        let is_some_setting_active =
                            ($("#timesContorl>ul").css("display") == "block" || false) ||
                            ($("#splitContorl>ul").css("display") == "block" || false); // 这两个不是div
                        $(".tool-bar>div:nth-child(2)>div>div").each(function (idx, el) {
                            let this_displayed = ($(el).css("display") == "block" || false);
                            is_some_setting_active = is_some_setting_active || this_displayed;
                        })
                        if (just_clicked_screen) {
                            return true;
                        }
                        return is_some_setting_active; // 修复了全屏时底部播放栏会在操作中异常收起的问题
                    }
                    tabbarForcedActive(); // 防止【函数未被使用】警告

                    function duringToggleFullscreen() {
                        if (isAndroidPhone()) {
                            // 在安卓设备上全屏时，自动以横屏方式全屏
                            screen.orientation.lock("landscape-primary");
                        }
                    }
                    let newf = undefined;
                    eval(kmplayer.scrren.toString()
                        .replace("scrren()", "newf = function()")
                        // 修复了缩放后播放控制栏自动弹出的响应范围随之变化的bug
                        // 修复了调整两画面位置后，播放控制栏自动弹出响应范围异常的bug
                        // 允许点击屏幕以唤起播放控制栏（安卓）
                        .replace("window.screen.height * 0.5", '(isAndroidPhone()?-1000:($("#rtcContent").height()*0.95-32))') // 缩小播放控制栏自动弹出的响应范围，使体验更加顺滑
                        .replace("event.clientY > rangeY", "(event.clientY > rangeY)||tabbarForcedActive()") // 改写保持收起的条件
                        .replace("if (!this.isFull) {", "duringToggleFullscreen();\nif (!this.isFull) {") // 在函数执行到一半的时候来这里执行一下这个函数吧
                        .replace("-32 + 'px'", "is_canvas_vod_page ? '-32px' : '-28px'") // 直播没有进度条，稍微窄一些
                    )
                    kmplayer.scrren = newf; // 这里居然不让用caller
                }

                // 设定音量
                let scene_audio_ratio = 1.00;
                let computer_audio_ratio = 1.00;

                // 重写原生元素拖动函数
                {
                    let newf = undefined;

                    eval(kmplayer.addDragEvent.toString()
                        .replace("addDragEvent()", "newf = function()")

                        // 修复了调整子音量不为100%时调整总音量时音量突变的bug
                        .replace("that.volume = that.limit(totalH, 100)", "setVolumeMix(totalH/100,0)")
                        .replace("that.setVolume(that.volume)", "") // 把写音量拿到写高度上面一行，避免音量最小为2而不能为0的bug
                        .replace("target.parentNode.style.height =", "//") // 高度无需在此设置了，注释掉
                    )
                    kmplayer.addDragEvent = newf;
                }

                // 双击画面全屏
                $("video").on('dblclick', function (event) {
                    if (!(isAndroidPhone() && document.fullscreenElement != null)) { // 对安卓全屏状态下不启用
                        toggleFullscreen();
                    }
                    event.preventDefault(); // 阻断默认全屏行为
                    return false;
                });

                var just_clicked_screen_reset_timeout = null;

                // 单击画面暂停/播放
                $("video").on('click', function (event) {
                    if (!(isAndroidPhone() && document.fullscreenElement != null)) { // 对安卓全屏状态下不启用
                        togglePlay();
                    }

                    if (isAndroidPhone()) {
                        // 允许使用安卓设备时点击屏幕唤起播放控制栏
                        just_clicked_screen = true;
                        if (just_clicked_screen_reset_timeout) {
                            clearTimeout(just_clicked_screen_reset_timeout);
                        }
                        just_clicked_screen_reset_timeout = setTimeout(function () {
                            just_clicked_screen = false;
                            let tabbar = document.querySelector('.fixed-tool');
                            if (tabbar) {
                                tabbar.style.bottom = is_canvas_vod_page ? "-32px" : "-28px"; // 直播没有进度条，稍微窄一些
                            }
                        }, 2000);
                    }
                });

                // 修正视频变形问题，按视频原比例而非播放器窗口比例显示视频（但会导致画面黑边）
                $("video").css("object-fit", "contain");

                // 将黑边修改为空白边
                $(".kmd-app-container").css("background-color", "transparent");
                $(".kmd-app").css("background-color", "transparent");
                $(".kmd-container").css("background-color", "transparent");
                $(".kmd-player").css("background-color", "transparent");
                $("#rtcContent").css("background-color", "black");

                console.log("%c执行到这里！", "color:red;")

                // 当视频链接过期时，自动刷新链接
                function refreshVideoLink() { // 本函数效果不理想，更改视频源后，播放进度将自动复位，倒不如刷新整个页面
                    $.ajax({
                        type: "POST",
                        url: "/lti/vodVideo/getVodVideoInfos",
                        async: true,
                        traditional: true,
                        dataType: "json",
                        data: {
                            playTypeHls: true,
                            id: video_id,
                            isAudit: true
                        },
                        success: function (data) {
                            let video_link_array = data.body.videoPlayResponseVoList;
                            let current_time = getTime();
                            $(".kmd-wrapper video#kmd-video-player").each(function (idx, elem) {
                                elem.src = video_link_array[idx].rtmpUrlHdv;
                            })
                            setTime(current_time);
                            console.log(video_link_array);
                        }
                    });
                }
                $(".kmd-wrapper video#kmd-video-player").each(function (idx, elem) {
                    elem.onerror = function () {
                        console.log("video error: " + elem.error.code + "; details: " + elem.error.message);
                        if (is_iframe) {
                            refresh_session(true); // 然后在onmessage里刷新页面
                        } else { // 独立窗口中无法自动更新会话，切回大窗口
                            location.href("https://oc.sjtu.edu.cn/courses/" + getStorage("course_" + course_id + "_canvasid") + "/external_tools/162");
                            return;
                        }
                    }
                })

                // 倍速列表选项优化
                // 移除了部分愚蠢的倍速数值
                // 根据建议，补充了一个快得离谱的倍速
                let speed_choice = [0.8, 0.9, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 6, 12]; // 16是该播放器支持的最高倍速
                // let speed_choice = [0.5, 1.0, 1.25, 1.5, 2.0, 4.0, 8.0]; // 20221212新的列表
                speed_choice.sort(function (a, b) {
                    return a - b;
                });
                let speed_choice_text = speed_choice.map(function (num) {
                    return '<li id="' + num + '">' + num + '倍</li>';
                }).join("");
                $("#timesContorl>ul").html(speed_choice_text);
                $("#timesContorl>ul>#1").attr("class", "times-active"); // 默认1倍高亮

                // 直播没有进度条，稍微窄一些
                if (is_canvas_live_page) {
                    GM_addStyle("#rtcTool {height:32px;} #rtcTool .tool-bar {height:32px;}") // 20241025更新尺寸
                    $("#playerDiv").css("height", "445px");// 20241025适配新版本的尺寸的微小变化
                }

                // 在菜单中选择新倍速后自动关闭菜单
                $("#timesContorl").bind("click", function (event) {
                    if (event.target.tagName == "LI") {
                        // 状态栏显示倍速
                        $("#timesContorl>ul").css("display", "none");
                        current_time_speed = parseFloat(event.target.id);
                        changeSpeed(current_time_speed); // 修复了通过播放控制栏设定倍速失效的bug
                        putText("设定倍速：" + current_time_speed);
                    }
                    return true;
                });

                if (is_canvas_live_page) {
                    // 移除了直播页面中自欺欺人的【暂停】按钮（看来不容易直接移除。。算了）
                    // 移除了直播页面中的播放时间显示
                    $(".tool-view-time").hide();
                }
                // 移除了点播页面缺乏使用场景、直播页面没有作用的【停止播放】按钮
                $(".tool-btn__stop").remove();

                // 允许使用播放器控制栏切换上一集下一集
                if (is_canvas_vod_page) {
                    if ($(".list-item--active").prev().length) {
                        $('<div class="tool-bar-item tool-btn__next" style="display: block;"></div>').insertAfter($(".tool-btn__pause"));
                    }
                    if ($(".list-item--active").next().length) {
                        $('<div class="tool-bar-item tool-btn__prev" style="display: block;"></div>').insertAfter($(".tool-btn__pause"));
                    }
                    $(".tool-btn__prev").click(function () {
                        $(".list-item--active").next().click();
                    });
                    $(".tool-btn__next").click(function () {
                        $(".list-item--active").prev().click();
                    });
                }

                // 移除了直播页面中没有任何作用的【画质】按钮
                $(".tool-btn__sharp").remove();

                // 仅有一路视频时，禁用各类画面布局功能
                if (!is_single_video) {
                    // 将画面选择按钮图标改为文字显示【分屏】
                    $("#splitContorl").attr("class", "tool-bar-item tool-btn__times")
                    $("#splitContorl").append($("<span>分屏</span>"))

                    // 增加了画中画模式，并允许从设置中直接选择所需画面
                    let split_choice_id = ["split_scene_only", "split_computer_only", "split_big_small", "split_pip"];
                    let split_choice_desc = ["仅现场画面", "仅电脑画面", "一大一小", "进入画中画"];
                    let split_choice_class = ["style-type-1-1", "style-type-1-1", "style-type-2-1", "style-type-2-1 style-type-2-1-pip"];
                    let split_choice_text = split_choice_id.map(function (id, idx) {
                        return '<li id="' + id + '" class="' + split_choice_class[idx] + '">' + split_choice_desc[idx] + '</li>';
                    }).join("");
                    $("#splitContorl>ul").html(split_choice_text);
                    $("#splitContorl>ul>#split_big_small").css("background", "white").css("color", "#0a0a0a"); // 默认一大一小

                    // 安卓端似乎不支持画中画
                    if (!document.pictureInPictureEnabled) {
                        $("#splitContorl>ul>#split_pip").remove();
                    }

                    // 切换画中画设定
                    function enable_PiP(flag) {
                        if (flag) {
                            let video2 = $(".cont-item-2 #kmd-video-player"); // 右下角视频
                            video2.on('enterpictureinpicture', function () {
                                $(".cont-item-2").hide(); // 进入画中画，隐藏原小窗
                                $("#split_pip").html("退出画中画");
                            });
                            video2.on('leavepictureinpicture', function () {
                                $(".cont-item-1").css("display", ""); // 退出画中画，恢复原小窗
                                $(".cont-item-2").css("display", ""); // 退出画中画，恢复原小窗
                                $("#split_pip").html("进入画中画");
                                $("#split_big_small").click();
                            });
                            video2[0].requestPictureInPicture();
                        } else {
                            document.exitPictureInPicture();
                        }
                    }

                    let split_replaying_flag = false,
                        split_changed = 0;
                    $("#splitContorl").bind("click", function (event) {
                        if (event.target.tagName == "LI") {
                            split_changed++;
                            $(event.target).css("background", "white").css("color", "#0a0a0a");
                            $(event.target).siblings().each(function (idx, elem) {
                                $(elem).css("background", "").css("color", "");
                            });
                            let changed_flag = false;
                            if ($("#split_pip").length && $("#split_pip").html().includes("退出")) { // 修复了在不支持画中画的设备上无法切换成【仅电脑画面】模式的bug
                                enable_PiP(false);
                                $("#split_pip").html("进入画中画");
                                changed_flag = true;
                            }
                            switch ($(event.target).attr("id")) {
                                case "split_computer_only": // 仅电脑画面
                                    $("#player-00002").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-1");
                                    $("#player-00001").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-2");
                                    if (!split_replaying_flag) {
                                        split_replaying_flag = true;
                                        setTimeout(function () {
                                            $(event.target).click();
                                            split_replaying_flag = false;
                                        }, 1);
                                    }
                                    break;
                                case "split_scene_only": // 仅现场画面
                                    $("#player-00001").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-1");
                                    $("#player-00002").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-2");
                                    if (!split_replaying_flag) {
                                        split_replaying_flag = true;
                                        setTimeout(function () {
                                            $(event.target).click();
                                            split_replaying_flag = false;
                                        }, 1);
                                    }
                                    break;
                                case "split_pip":
                                    if ($(event.target).html().includes("进入") && !changed_flag) {
                                        enable_PiP(true);
                                        // $(event.target).html("退出画中画");
                                    }
                                    break;
                                default:
                                    break;
                            }

                            $("#rtcContent").attr("class", $(event.target).attr("class")); // 虽然网页里已经定义过这个事件，但是好像有些晚，所以我在这重复操作一遍。
                        } else { // 鼠标左右键点击工具栏【画面】按钮可进行布局布局快捷调整
                            let active_mode = undefined;
                            $("#splitContorl>ul>li").each(function (idx, elem) {
                                // $("#split_big_small").css("background") 会返回
                                // rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box
                                if (elem.style.background == "white") {
                                    active_mode = $(elem).attr("id")
                                }
                            });
                            if (active_mode) {
                                switch (active_mode) {
                                    case "split_computer_only": // 仅电脑画面
                                        $("#split_scene_only").click();
                                        break;
                                    case "split_scene_only": // 仅现场画面
                                        $("#split_computer_only").click();
                                        break;
                                    case "split_pip":
                                        $("#split_pip").click();
                                        break;
                                    case "split_big_small":
                                        // 交换
                                        let cl1 = $("#player-00001").parent(".rtc-cont-item").attr("class"),
                                            cl2 = $("#player-00002").parent(".rtc-cont-item").attr("class");
                                        $("#player-00001").parent(".rtc-cont-item").attr("class", cl2);
                                        $("#player-00002").parent(".rtc-cont-item").attr("class", cl1);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                    $("#splitContorl").bind("contextmenu", function (event) {
                        if (event.target.tagName != "LI") {
                            // 鼠标左右键点击工具栏【画面】按钮可进行布局布局快捷调整
                            let active_mode = undefined;
                            $("#splitContorl>ul>li").each(function (idx, elem) {
                                // $("#split_big_small").css("background") 会返回
                                // rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box
                                if (elem.style.background == "white") {
                                    active_mode = $(elem).attr("id")
                                }
                            });
                            if (active_mode) {
                                switch (active_mode) {
                                    case "split_computer_only": // 切换到一大一小
                                    case "split_scene_only": // 切换到一大一小
                                        $("#split_big_small").click();
                                        break;
                                    case "split_pip": // 退出画中画
                                        $("#split_pip").click();
                                        break;
                                    case "split_big_small": // 切换到单屏
                                        // 交换
                                        if ($("#player-00001").parent(".rtc-cont-item").attr("class") == "rtc-cont-item cont-item-1") {
                                            $("#split_scene_only").click();
                                        } else {
                                            $("#split_computer_only").click();
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    })

                    $("#player-00001").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-1");
                    $("#player-00002").parent(".rtc-cont-item").attr("class", "rtc-cont-item cont-item-2");

                    // 直播中没有电脑视频流时，以【仅现场画面】模式启动
                    if (is_canvas_live_page) {
                        $("#split_scene_only").click();
                        let computer_video = $(".cont-item-2 #kmd-video-player");
                        computer_video.one("playing", function () {
                            console.log("playing....", 321);
                            if (split_changed == 2) {
                                $("#split_big_small").click(); // 切换回一大一小模式
                            }
                        });
                        if (computer_video[0].currentTime > 0) { //防止刚才趁程序不注意就开始了播放
                            computer_video.trigger("playing");
                        }
                    }
                } else {
                    $("#splitContorl").remove();
                }

                // 有两路视频时，开启子音量控制功能
                $(".voice-volume .voice-max").attr("class", "voice-max voice0-max");
                $(".voice-volume .voice-rate").attr("class", "voice-rate voice0-rate");
                if (!is_single_video) {
                    $(".voice-volume").css("width", "80px").css("text-align", "center");
                    $(".voice-volume").append($('<div class="voice-max voice1-max" style="width: 8px;"><div class="voice-rate voice1-rate voice-rate-child" style="height: 100%;"><div class="tool-rate-tip"></div></div></div>'));
                    $(".voice-volume").append($('<div class="voice-max voice2-max" style="width: 8px;"><div class="voice-rate voice2-rate voice-rate-child" style="height: 100%;"><div class="tool-rate-tip"></div></div></div>'));
                    $(".voice-volume>div").css("display", "inline-block").css("margin", "0 9px");
                    $(".voice-volume").css("transform", "translateX(-35px)");
                    $(".voice-volume").append($('<span class="voice-desc voice0-desc">总控</span>'));
                    $(".voice-volume").append($('<span class="voice-desc voice1-desc">现场</span>'));
                    $(".voice-volume").append($('<span class="voice-desc voice2-desc">电脑</span>'));
                    $(".voice-volume>span").css("position", "absolute")
                        .css("top", "50%")
                        .css("font-size", "12px")
                        .css("width", "50px");
                    $(".voice-volume>.voice0-desc").css("transform", "translateX(-87px) translateY(50px)");
                    $(".voice-volume>.voice1-desc").css("transform", "translateX(-62px) translateY(50px)");
                    $(".voice-volume>.voice2-desc").css("transform", "translateX(-37px) translateY(50px)");
                }

                // 鼠标位于进度条上或拖动进度条时浮窗显示时刻
                $("#rtcContent").append('<div id="custom-progress-hover"><svg viewBox="-3 -3 37.6 23"> <polygon points="17.3,20 0,0 34.6,0" style="fill:#0092E9AA; stroke:black; stroke-width:3;"/></svg><span>12:00</span></div>');
                $("#custom-progress-hover") // 进度条，百万大制作
                    .css("position", "absolute")
                    .css("text-align", "center")
                    .css("display", "none")
                    .css("background-color", "#0092E9AA")
                    .css("border", "2px solid black")
                    .css("border-radius", "10px")
                    .css("box-shadow", "#AAA 0px 0px 10px")
                    .css("margin", "8px 8px")
                    .css("z-index", "11")
                    .css("padding", "5px 5px;")
                    .css("width", "60px")
                    .css("height", "25px");
                $("#custom-progress-hover span")
                    .css("user-select", "none")
                    .css("position", "absolute")
                    .css("top", "50%")
                    .css("transform", "translateX(-50%) translateY(-50%)")
                    .css("font-weight", "bold")
                    .css("font-size", "14px");
                $("#custom-progress-hover svg")
                    .css("position", "absolute")
                    .css("top", "50%")
                    .css("width", "15px")
                    .css("transform", "translateX(-50%) translateY(140%)");

                // 时移浮窗显示
                $(".tool-progress").on("mousemove", function (event) {
                    let progress_ratio = (event.pageX - $(".tool-progress").offset().left) / $(".tool-progress").width();
                    progress_ratio = numberClamp(progress_ratio, 0, 1);

                    $("#custom-progress-hover").css("display", "block");
                    $("#custom-progress-hover").css("top", $("#rtcTool").position().top - 48);
                    $("#custom-progress-hover").css("left", event.pageX - $("#rtcTool").offset().left - 40);

                    let progress_sec = parseInt(progress_ratio * getDuration());

                    $("#custom-progress-hover>span").html(parseInt(progress_sec / 60) + ":" + ("0" + parseInt(progress_sec % 60)).slice(-2));

                    if (progressBar_operating_flag) {
                        setTime(progress_sec);
                    }
                });

                $(".tool-progress").on("mouseleave", function (event) {
                    $("#custom-progress-hover").css("display", "none");
                });

                // 扩展进度条的可点击范围高度，便于操作
                GM_addStyle(".tool-progress {z-index: 12;}")
                GM_addStyle(".tool-progress > div {height:4px !important; position:absolute !important;}")
                $(".tool-progress").append('<div style="width: 100%; height: 25px !important; background-color: transparent; transform: translateY(-16px); cursor:auto; z-index: 11;" class="tool-progress"></div>');

                // 在画面左上角显示自动渐隐的文本，显示状态变化
                $("#rtcContent").append('<div id="custom-status-text"><span></span></div>');
                $("#custom-status-text")
                    .css("position", "absolute")
                    .css("text-align", "center")
                    .css("display", "none")
                    .css("background-color", "#CCCA")
                    .css("margin", "5px 5px")
                    .css("z-index", "11")
                    .css("padding", "0px 2px") // 嘤嘤嘤因为这里不小心加了分号，竟然一直没生效过
                    .css("height", "20px")
                    .css("top", 0)
                    .css("left", 0);

                $("#custom-status-text>span")
                    .css("font-size", "16px")
                    .css("line-height", "20px")
                    .css("user-select", "none") // 禁止选中
                    .css("color", "blue");

                // 修复了暂停状态下改变进度条导致意外继续播放且进度条不再刷新的问题
                function repair_pause_playing() {
                    if (!getPlay()) {
                        setTimeout(function () {
                            if (!getPlay()) {
                                setPlay(false, true); // 这种情况下不展示消息提醒
                            }
                        }, 1);
                    }
                }
                $("body").on("mouseup", function (event) {
                    // console.log("mouseup",event.originalEvent.button);
                    if (event.originalEvent.button != 0) { // 仅响应鼠标左键
                        return;
                    }

                    let target_el_class = $(event.target).attr("class");
                    // 使用按钮进行播放和暂停也可以显示文字提示了
                    if (Object.prototype.toString.call(target_el_class) === "[object String]") {
                        if ($(event.target).attr("class").includes("tool-btn__play")) {
                            putText("状态：播放");
                            if (is_single_video) {
                                setPlay(true, true); // 修复了部分场景下播放/暂停按钮失效的问题
                            }
                            return;
                        } else if ($(event.target).attr("class").includes("tool-btn__pause")) {
                            putText("状态：暂停");
                            if (is_single_video) {
                                setPlay(false, true); // 修复了部分场景下播放/暂停按钮失效的问题
                            }
                            return;
                        }
                    }

                    progressBar_operating_flag = false;
                    repair_pause_playing();
                    //return true;
                });
                $("body").on("mousedown", function (event) {
                    // console.log("mousedown",event.originalEvent.button);
                    if (event.originalEvent.button != 0) { // 仅响应鼠标左键
                        return;
                    }

                    if (!$(event.target).attr("class")) {

                    } else if ($(event.target).attr("class").startsWith("tool-progress")) {
                        // 避免鼠标操作进度条时自动刷新进度条
                        progressBar_operating_flag = true;
                    } else if ($(event.target).attr("class").startsWith("voice-")) {
                        // 允许鼠标点击音量条任意位置设定音量并解除静音
                        let click_height = event.pageY;
                        let clicked_idx_match = $(event.target).attr("class").match(new RegExp("voice(\\d)-")); // 这里改成另一个格式的RegExp之后要转义反斜杠了
                        if (clicked_idx_match) {
                            let clicked_idx = parseInt(clicked_idx_match[1]);
                            let voicebar_height = $(".voice0-max").height();
                            let voicebar_base = $(".voice0-max").offset().top;
                            let volume_ratio = 1 - (click_height - voicebar_base) / voicebar_height;
                            setVolumeMix(volume_ratio, clicked_idx);
                        }
                    }
                    //return true;
                });

                let in_ultra_slow_mode = false,
                    is_mute_before_ultra_slow_mode; // 在进入超慢速模式前是否静音，一定要静音否则声音太怪了
                $("body").on("keyup", function (event) {
                    // console.log("keyup:",event.target);
                    switch (event.keyCode) {
                        case 37: // 方向键左
                        case 39: // 方向键右
                        case 68: // 字母D，上一帧
                        case 70: { // 字母F，下一帧
                            repair_pause_playing();
                            break;
                        }
                        case 76: { // L键
                            // 使用L键进入超慢速寻找模式，松开后立即暂停

                            changeSpeed(current_time_speed); // 恢复到之前的播放速度
                            setPlay(false, true);
                            in_ultra_slow_mode = false;
                            if (!is_mute_before_ultra_slow_mode) {
                                setMuted(false);
                            }
                            break
                        }
                        default:
                            break;
                    }
                });

                $("body").on("keydown", function (event) {
                    //console.log("keydown:", event.target, event.keyCode);

                    // 左右方向键进行时移
                    // Ctrl+左右方向键进行快速时移
                    // Ctrl+Shift+左右方向键进行超快速时移
                    const SMALL_TIME_STEP = 3;
                    const MIDDLE_TIME_STEP = 15;
                    const BIG_TIME_STEP = 59;
                    let step = SMALL_TIME_STEP;
                    if (event.ctrlKey && event.shiftKey) {
                        step = BIG_TIME_STEP;
                    } else if (event.ctrlKey) {
                        step = MIDDLE_TIME_STEP;
                    }
                    switch (event.keyCode) {
                        case 32: { // 空格，暂停/播放
                            if (!is_canvas_vod_page) break; //仅针对点播
                            togglePlay();
                            break;
                        }
                        case 49: { // 数字1，左屏幕截图
                            makeScreenshot(1, event.shiftKey);
                            break;
                        }
                        case 50: { // 数字2，右屏幕截图
                            makeScreenshot(2, event.shiftKey);
                            break;
                        }
                        case 37: { // 方向键左，快退
                            if (!is_canvas_vod_page) break; //仅针对点播
                            setTime(getTime() - step);
                            putText("快退");
                            // console.log("minus:", step, "to:", target_time);
                            break;
                        }
                        case 39: { // 方向键右，快进
                            if (!is_canvas_vod_page) break; //仅针对点播
                            setTime(getTime() + step);
                            putText("快进");
                            // console.log("add:", step, "to:", target_time);
                            break;
                        }
                        case 38: { // 方向键上，音量加
                            increaseVolume(0.1);
                            break;
                        }
                        case 40: { // 方向键下，音量减
                            increaseVolume(-0.1);
                            break;
                        }
                        case 68: { // 字母D，上一帧
                            if (!is_canvas_vod_page) break; //仅针对点播
                            if (getPlay()) setPlay(false, true); // 暂停
                            let target_time = getTime() - 1 / 30;
                            setTime(target_time);
                            putText("上一帧 当前时刻：" + timeSec2Text(getTime()));
                            // console.log("add:", step, "to:", target_time);
                            break;
                        }
                        case 70: { // 字母F，下一帧
                            if (!is_canvas_vod_page) break; //仅针对点播
                            if (getPlay()) setPlay(false, true); // 保持暂停状态
                            let target_time = getTime() + 1 / 30;
                            setTime(target_time);
                            putText("下一帧 当前时刻：" + timeSec2Text(getTime()));
                            // console.log("minus:", step, "to:", target_time);
                            break;
                        }
                        case 76: { // L键
                            // 使用L键进入超慢速寻找模式，松开后立即暂停
                            if (!is_canvas_vod_page) break; //仅针对点播
                            if (!in_ultra_slow_mode) {
                                in_ultra_slow_mode = true;
                                is_mute_before_ultra_slow_mode = getMuted();
                                if (!is_mute_before_ultra_slow_mode) {
                                    setMuted(true);
                                }
                                changeSpeed(0.3); // 0.3倍速似乎较为合适
                                if (!getPlay()) {
                                    setPlay(true, true);
                                }
                            }
                            putText("超慢速播放中");
                            break;
                        }
                        case 67: { // 字母C
                            if (!is_canvas_vod_page) break; //仅针对点播
                            increaseSpeed(0.1); // 每次快捷键将会增减0.1倍速
                            break;
                        }
                        case 88: { // 字母X
                            if (!is_canvas_vod_page) break; //仅针对点播
                            increaseSpeed(-0.1); // 每次快捷键将会增减0.1倍速
                            break;

                        }
                        case 90: { // 字母Z
                            if (!is_canvas_vod_page) break; //仅针对点播
                            let is_using_default_speed = (Math.abs(getSpeed() - default_time_speed) < 0.005);
                            let is_speed_no_change = (Math.abs(current_time_speed - default_time_speed) < 0.005);
                            if (is_speed_no_change) { // 在恢复倍速是显示原倍速情况
                                putText(`倍速未改变：${current_time_speed}`);
                            } else {
                                if (is_using_default_speed) {
                                    changeSpeed(current_time_speed);
                                    putText(`切换倍速：${default_time_speed}->${current_time_speed}`);
                                } else {
                                    changeSpeed(default_time_speed);
                                    putText(`切换倍速：${default_time_speed}，原倍速：${current_time_speed}`);
                                }
                            }
                            break;
                        }
                        case 77: { // 字母M
                            // 使用M键切换静音状态
                            if (getMuted()) {
                                putText("切换静音：解除静音");
                            }
                            else {
                                putText("切换静音：静音");
                            }
                            setMuted(!getMuted());
                            break;
                        }
                        case 13: { // 使用Enter键切换全屏
                            toggleFullscreen();
                            putText("切换全屏");
                            break;
                        }
                        default:
                            return true;
                    }
                });

                $("body").on("mousewheel", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });

                $("body").on("wheel", function (event) {
                    // console.log("wheel",event.originalEvent.deltaY);


                    const target = event.target;

                    if (event.originalEvent.deltaY == 0) {
                        // 不要响应水平滚轮
                        return;
                    }
                    // 仅在视频上使用滚轮生效
                    if (target.tagName == "VIDEO") {
                        // 在小画面上使用鼠标滚轮缩放画面
                        if (target == $(".cont-item-2 #kmd-video-player")[0]) {
                            let max_ratio = 85,
                                min_ratio = 15;
                            current_zoom_ratio -= event.originalEvent.deltaY / 25;
                            current_zoom_ratio = numberClamp(current_zoom_ratio, min_ratio, max_ratio);
                            setSmallVideoSize(current_zoom_ratio);
                        } else {
                            let volDelta = 2 * parseInt(100 * (-event.originalEvent.deltaY) / 2500) / 100;
                            increaseVolume(volDelta);
                        }
                    } else {
                        if (target == $("#timesContorl")[0] || target == $("#timesContorl>span")[0]) {
                            // 使用鼠标滚轮在倍速图标上调整倍速
                            const direction = event.originalEvent.deltaY < 0;
                            // 每次操作加快 0.2 倍
                            increaseSpeed((direction ? 1 : -1) * 0.1); // 每次鼠标滚轮将会增减0.1倍速
                        } else if (target == $("#voiceContorl")[0] || $(".voice0-max")[0].contains(target)) {
                            // 使用鼠标滚轮在音量图标上调整主音量
                            let volDelta = 2 * parseInt(100 * (-event.originalEvent.deltaY) / 2500) / 100;
                            increaseVolume(volDelta);
                        }
                    }
                });

                function onStartPlay() {
                    if (is_canvas_vod_page) {
                        // 打开后默认不自动播放视频
                        setPlay(false, true);
                        setTimeout(function () {
                            // 打开视频后，自动跳转到上次观看的进度
                            let last_playback = getStorage(usercode + "_video_" + video_id + "_position")
                            if (last_playback != null) {
                                last_playback = parseFloat(last_playback);
                                if (last_playback > 10) { // 仅调整进度超过10秒的视频
                                    let restore_time_interval = setInterval(function () {
                                        // 20241123注意到在视频加载完成前，此处代码会持续引起seek out of range警告
                                        if (!isVideoBuffering()) {
                                            videoStarted = true;
                                        }
                                        if (!videoStarted) return;
                                        kmplayer.allInstance.type1.currentTime(parseFloat(last_playback));
                                        if (kmplayer.allInstance.type1.currentTime() >= last_playback - 2) {
                                            clearInterval(restore_time_interval);
                                            putText("已恢复到上次的播放进度：" + ("0" + parseInt(last_playback / 60)).slice(-2) + ":" + ("0" + parseInt(last_playback % 60)).slice(-2));
                                        }
                                    }, 10);
                                }
                            }
                            setTimeout(function () {
                                setPlay(false, true);
                            }, 1);
                            // 打开视频后，自动载入上次的默认播放速度
                            if (getStorage(usercode + "_speed_val") !== null) {
                                current_time_speed = parseFloat(getStorage(usercode + "_speed_val")); // 传入字符串时，无效
                                console.log("load current speed: " + current_time_speed);
                                // 应用记忆中的播放速度
                                changeSpeed(current_time_speed);
                            }
                        }, 1);

                        // 修改默认音量设定为不静音，并移除静音说明
                        setMuted(false);
                        $(".mute-tip").hide();
                    }


                    setInterval(function () {
                        if (!is_single_video) { // 否则会导致直播视频加载异常
                            syncTime(); // 开启画面同步控制功能
                            if ($(".kmd-wrapper #kmd-video-player")[0].paused != $(".kmd-wrapper #kmd-video-player")[1].paused) {
                                // setPlay(false, true); // 修复禁用启动后自动播放时的冲突导致的可能的暂停不彻底
                                setPlay(true, true); // 避免切换窗口导致画面全部暂停，不妨改成全部播放吧
                            }
                        }
                    }, 1000)

                    let periodic_job_interval = setInterval(periodic_job, 75); // 75ms 的定时任务


                    function periodic_job() {

                        if (is_canvas_live_page) {
                            if ($('#playerDiv').text() == "直播已结束！") { // 检查直播状态是否已经结束（否则会导致下方过程中出错）
                                console.log("直播已经结束")
                                clearInterval(periodic_job_interval);
                            }
                        }

                        if (is_canvas_vod_page) {
                            updateTimeText(); // 优化了状态栏播放进度显示精度

                            if ($(".kmd-wrapper #kmd-video-player")[0].paused == getPlay()) {
                                const force_pauce_interval = setInterval(function () {
                                    console.log("播放状态不匹配！暂停");
                                    setPlay(false, true); // 进一步修复了特殊情况下可能自动播放视频的bug
                                    if ($(".kmd-wrapper #kmd-video-player")[0].paused != getPlay()) {
                                        clearInterval(force_pauce_interval);
                                        console.log("播放状态不匹配，暂停成功");
                                    }
                                }, 150);
                            }


                            // 记录当前进度
                            if (getPlay()) {
                                if (getStorage(usercode + "_video_" + video_id + "_position") && getTime() < 5) { // 本次不算播放
                                } else {
                                    setStorage(usercode + "_video_" + video_id + "_position", getTime());
                                }
                            }
                        }

                        {
                            let player1_height = $("#player-00001 #kmd-video-player")[0].offsetHeight;
                            // 修复了一处误写导致的画面清晰度滤镜参数错乱
                            let player2_height = $("#player-00002 #kmd-video-player")[0] ? $("#player-00002 #kmd-video-player")[0].offsetHeight : 0;

                            let screen_switched = $(".cont-item-1 .kmd-app-container").attr("id") != "player-00001";
                            let bA = screen_switched ? effect_setting.brightnesssA : effect_setting.brightnesssB;
                            let bB = !screen_switched ? effect_setting.brightnesssA : effect_setting.brightnesssB;
                            let cA = screen_switched ? effect_setting.contrastA : effect_setting.contrastB;
                            let cB = !screen_switched ? effect_setting.contrastA : effect_setting.contrastB;
                            let bl1 = effect_setting.blurA * player1_height / 1000;
                            let bl2 = effect_setting.blurB * player2_height / 1000;
                            let blA = screen_switched ? bl1 : bl2; // 这个居然和画面大小也有关。。。
                            let blB = !screen_switched ? bl1 : bl2;
                            let op = effect_setting.opacity;

                            let filter1 = "brightness(" + bB + ") contrast(" + cB + ") blur(" + blB + "px)";
                            let filter2 = "brightness(" + bA + ") contrast(" + cA + ") blur(" + blA + "px) opacity(" + op + ")";

                            $(".cont-item-1 #kmd-video-player").css("filter", filter1);
                            $(".cont-item-2 #kmd-video-player").css("filter", filter2);
                        }


                        // 有两路视频时
                        if (!is_single_video) {
                            rewriteVolume(); // 为两路声音设置均衡
                        }


                        // console.log(`周期任务运行完成，耗时：${Date.now()-t0}毫秒`)
                    }

                    // 使用安卓设备时默认打开新标签页播放
                    if (isAndroidPhone()) {
                        console.log("正在使用安卓移动设备");
                        if (is_iframe && is_from_default_lti_entry) {
                            console.log("申请返回上层页面");
                            $("#btn_play_in_new_tab").click();
                            top.postMessage("goback!", "https://oc.sjtu.edu.cn");
                        }
                    }
                }



                // 20221212 发现这里才有setPlay这个函数……
                $(".lti-page-tab").append($('<button class="tab-help" id="btn_go_shuiyuan">学累了？看看水源！</button>'));
                $("#btn_go_shuiyuan").on("click", function () {
                    window.open("https://shuiyuan.sjtu.edu.cn/");
                    setPlay(false); // 暂停播放
                })

                // 在右上角增加【关于本插件】按钮
                $(".lti-page-tab").append($('<button class="tab-help" id="btn_about_canvasnb">关于本插件</button>'));
                $("#btn_about_canvasnb").on("click", function () {
                    window.open("https://greasyfork.org/zh-CN/scripts/432918");
                    setPlay(false); // 暂停播放
                })

                // 终于能在页面里显示版本号了
                $("#btn_about_canvasnb").attr("title", `播放器版本：${player_version}\n本插件版本：v${script_version}`)


                if (is_iframe || true) { // 任意条件下均显示【在新标签页中打开】按钮
                    $(".lti-page-tab").append($('<button class="tab-help" id="btn_play_in_new_tab">在新标签页中打开</button>'));

                    $("#btn_play_in_new_tab").on("click", function (event) {
                        setPlay(false); // 暂停播放
                        window.open(location.href);
                    });

                    if (true) { // 【在新标签页中打开】右键功能
                        $("#btn_play_in_new_tab").on("contextmenu", function (event) { // 右击能在新标签页打开有意思的东西
                            let totalX = this.clientWidth,
                                clickX = event.offsetX;
                            var video_link;
                            if (!is_single_video) {
                                if (clickX < totalX / 2) { // 打开左边的视频
                                    if (is_canvas_vod_page) {
                                        video_link = $(".cont-item-1 #kmd-video-player").attr("src");
                                    } else {
                                        video_link = live_video_links[$(".cont-item-1 .kmd-app-container").attr("id") == "player-00001" ? 0 : 1];
                                    }
                                } else { // 打开右边的视频
                                    if (is_canvas_vod_page) {
                                        video_link = $(".cont-item-2 #kmd-video-player").attr("src");
                                    } else {
                                        video_link = live_video_links[$(".cont-item-1 .kmd-app-container").attr("id") == "player-00001" ? 1 : 0];
                                    }
                                }
                            } else { // 只有一个视频
                                if (is_canvas_vod_page) {
                                    video_link = $(".cont-item-1 #kmd-video-player").attr("src");
                                } else {
                                    video_link = live_video_links[0];
                                }
                            }
                            $("body").append($('<a href="' + video_link + '" id="download_link" referrerpolicy="origin">KKKK</a>'));
                            $("#download_link")[0].click(); // 哦是我之前在浏览器里阻止了下载
                            $("#download_link").remove();
                            event.preventDefault();
                            return false;
                        })
                    }
                }

                setTimeout(function () {
                    console.log("视频播放准备工作完成")
                    const t0 = Date.now();
                    onStartPlay();
                    console.log(`视频播放准备工作完成后任务运行完成，耗时：${Date.now() - t0}毫秒`)
                }, 50);
            }

            function processNoLiveAvailable() {
                clearInterval(video_proload_check_interval);
                console.log("无可用的直播视频，退出");
                if (is_from_default_lti_entry) {
                    redirectToVodPage(); //20241123偶然发现的一处功能问题，修复之
                }
            }

            let video_proload_check_interval = setInterval(function () {
                if ($("video").length) { // 直到video元素和#timesContorl元素和视频生成，大概能表明播放器完全加载出来了
                    clearInterval(video_proload_check_interval);
                    console.log("视频播放器预加载完成")
                    let video_loaded_check_interval = setInterval(function () {
                        if (kmplayer.ids.length && $("#player-00001 #kmd-video-player")[0] != undefined) { // 直到video元素和#timesContorl元素和视频生成，大概能表明播放器完全加载出来了
                            clearInterval(video_loaded_check_interval);
                            console.log("视频播放器加载完成")
                            const t0 = Date.now();
                            afterVideoLoaded();
                            console.log(`视频播放器加载完成后任务运行完成，耗时：${Date.now() - t0}毫秒`)
                        } else {
                            console.log("视频播放器加载等待中");
                            if ($(".not-data").length || no_live_video_played || no_live_available) {
                                processNoLiveAvailable();
                            }
                        }
                    }, 20);
                    const t0 = Date.now();
                    afterVideoPreloaded();
                    console.log(`视频播放器预加载完成后任务运行完成，耗时：${Date.now() - t0}毫秒`)
                } else {
                    console.log("视频播放器预加载等待中");
                    if ($(".not-data").length || no_live_video_played || no_live_available) {
                        processNoLiveAvailable();
                    }
                }
            }, 50);



            function refresh_session(andRefresh = false) {
                console.log("refresh session!")
                if (andRefresh) {
                    top.postMessage("helpr!", "https://oc.sjtu.edu.cn");
                } else {
                    top.postMessage("help!", "https://oc.sjtu.edu.cn");
                }
            }

            if (is_iframe) {
                $(document).on('visibilitychange', function (event) { //从外面回来时
                    if (!document.hidden && auto_refresh_flag) {
                        refresh_session();
                    }
                })
                if (auto_refresh_flag) {
                    setInterval(refresh_session, 20 * 60 * 1000); // 20分钟更新一次，防止页面失效
                }
            }

            // 禁止标题文字被选中，改善体验……算了不改了，没改善。
            // $(".list-title").css("user-select","none");

            // 本插件顺利生效时，顶部标签卡颜色为金色
            $(".tab-item--active").css("color", "gold");
            $(".tab-item--active").css("border-bottom", "3px solid gold");


            // 将画面背景色由廉价的灰色改为圣洁白
            $(".lti-page").css("background-color", "transparent");

            // 将部分白色背景色改为透明色
            GM_addStyle(`
            .lti-video {
                background-color: transparent;
            }
            .list-title {
                background-color: transparent;
            }
            .list-item {
                background-color: transparent;
            }
            .list-main {
                background-color: transparent;
            }
            .lti-page-tab {
                background-color: transparent;
            }
            `)

            // 关灯纯色元素
            $(".loading").css("z-index", "103"); // 这个元素要始终能够遮盖整个画面
            $("#rtcMain")
                .css("position", "absolute")
                .css("height", "")
                .css("z-index", "102"); // 父框架最高z-index为100，遮罩为101
            $("body").append($('<div class="light-turn-off"></div>'))

            $(".light-turn-off")
                .css("position", "fixed")
                .css("inset", "0")
                .css("background-color", "black")
                .css("z-index", "101")
                .css("display", "none"); // 父框架最高z-index为100，遮罩为101

            // 通过增加边框使右侧视频列表更有质感
            // 缩窄并加密了右侧视频列表
            $(".lti-page").append('<div class="main_container"></div>');
            $(".main_container")
                .append($(".lti-video"))
                .append($(".lti-list"))
                .css("display", "flex");
            $(".lti-list")
                .css("border", "2px solid black")
                .css("border-radius", "10px")
                .css("width", "auto")
                .css("flex-grow", "1");

            GM_addStyle(".lti-list>.list-title {border-bottom: 1px solid black;}");
            GM_addStyle(".list-item {padding: 5px; margin-bottom: 3px;}");
            GM_addStyle(".lti-list {height: 460px; max-width: 225px;}"); //否则视频列表文字过多会导致视频列表内容越界


            //GM_addStyle(".list-item:hover {border-bottom: 1px solid black;}");

            $(".role-teacher").remove(); // 删除教师专属元素（空白），否则影响右侧视频列表的优美外观

            GM_addStyle(".list-main {height: 400px; padding: 0 8px; margin-top: 6px;}");

            GM_addStyle(".live-course-item .item-infos {margin-left: 0;}");

            // 减小了页面总宽度，并居中显示了新窗口
            GM_addStyle(".lti-page {max-width: 970px; width: 100%; margin: auto;}");

            // 加密了播放控制栏上的文字按钮
            GM_addStyle("#rtcTool .tool-bar .tool-bar-item {margin-left: 13px;}");
            GM_addStyle(".tool-bar .tool-btn__times {margin-left: 5px !important;}");
            GM_addStyle(".tool-bar .tool-btn__voice {margin-right: 8px !important;}"); // 不然不对称了
            GM_addStyle(".tool-bar .tool-btn__muted {margin-right: 8px !important;}"); // 不然不对称了

            // 更新播放控制栏图标为矢量图标
            GM_addStyle(`
            #rtcTool .tool-btn__play {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M176 480C148.6 480 128 457.6 128 432v-352c0-25.38 20.4-47.98 48.01-47.98c8.686 0 17.35 2.352 25.02 7.031l288 176C503.3 223.8 512 239.3 512 256s-8.703 32.23-22.97 40.95l-288 176C193.4 477.6 184.7 480 176 480z"></path></svg>');
            }
            #rtcTool .tool-btn__pause {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="white" d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"></path></svg>');
            }
            #rtcTool .tool-btn__voice {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="white" d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"></path></svg>');
            }
            #rtcTool .tool-btn__muted {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="white" d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z"></path></svg>');
            }
            #rtcTool .tool-btn__pause {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="white" d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"></path></svg>');
            }
            #rtcTool .tool-btn__prev {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="white" d="M31.1 64.03c-17.67 0-31.1 14.33-31.1 32v319.9c0 17.67 14.33 32 32 32C49.67 447.1 64 433.6 64 415.1V96.03C64 78.36 49.67 64.03 31.1 64.03zM267.5 71.41l-192 159.1C67.82 237.8 64 246.9 64 256c0 9.094 3.82 18.18 11.44 24.62l192 159.1c20.63 17.12 52.51 2.75 52.51-24.62v-319.9C319.1 68.66 288.1 54.28 267.5 71.41z"></path></svg>');
            }
            #rtcTool .tool-btn__next {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="white" d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z"></path></svg>');
            }
            `)

            // 移除了底部课程信息区域，压缩页面高度
            $(".course-details").height(0);

            // 将播放控制栏底色由廉价的灰色改为至尊黑
            GM_addStyle("#rtcTool .tool-bar {background-color: black;}");
            GM_addStyle("#rtcContent {background-color: black;}");

            $(".tool-bar").click() // 随便点一下，不知道有没有用

            console.log("%c施工完毕，辛苦了！", "color:#0FF;");
        }
    }

    // 将 vshare 网站的视频播放器替换为浏览器内置播放器
    else if (is_vshare_page) {
        function doVshareEnhance() {
            // 恢复页面对基本操作的响应
            let document = window.document;
            document.onkeydown = document.oncontextmenu = undefined;
            document.body.oncontextmenu = document.body.onselectstart = undefined;
            $(window).off("resize");

            // 避免 vshare 页面视频过大超出画面范围
            document.getElementsByTagName("html")[0].style["min-height"] = "auto"
            document.getElementsByTagName("body")[0].style["min-height"] = "auto"
            $(".video-container")
                .css("height", "")
                .css("padding", "20px 15px")
                .css("width", "100%")

            // 将 vshare 视频标题移至标题栏
            $(".header").css("text-align", "center").css("overflow", "hidden");
            $(".header>.logo").css("position", "absolute").css("left", "0");
            $(".header").append($(".video-container>.video-title-container"))
            $(".header>.video-title-container").css("margin-top", "7px").css("display", "inline-block");
            $(".out-container").css("height", "calc(100% - 116px)").css("margin", "58px 0").css("min-height", "auto");

            // 移除原播放器
            let v_src = $("#video-share_html5_api").attr("src");
            $("#video-share_html5_api")[0].pause(); // 终止原视频的播放
            $("#video-share_html5_api")[0].src = ""; // 终止原视频的播放

            // 移除了 vshare 右上角的名字显示
            $(".header>.user").remove();

            // 创建新播放器
            $(".video-wrapper").replaceWith($('<div class="video-elem-container"></div>'));
            // 避免 vshare 页面视频过大超出画面范围
            $(".video-elem-container")
                .css("padding", "0 20px")
                .css("width", "100%")
                .css("height", "100%")
                .css("margin", "auto")
                .css("text-align", "center");
            $(".video-elem-container").append($('<video src="' + v_src + '"id="new_player" crossorigin="anonymous" controls></video>'));
            $("#new_player").css("height", "calc(100% - 40px)").css("max-width", "100%").css("min-width", "30%").css("background-color", "black");

            // 调整 vshare 页面标题位置
            $(".video-title-container").css("text-align", "center");
            $(".video-title-container>div").css("float", "none");

            function enable_audio_delay() {
                // 允许通过滑块调整 vshare 页面视频的音画时差时延（仅支持将音频滞后）
                $(".slider-audio-delay-container")
                    .append($('<span>声音叠加时延<span>0</span>毫秒</span>'))
                    .append($('<input type="range" min="0" max="1000" value="0" class="slider-audio-delay styled-slider">'));

                // 音频时延功能，参考 https://mdn.github.io/webaudio-examples/media-source-buffer/
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                let audioCtx = new AudioContext();
                let source = audioCtx.createMediaElementSource($("video")[0]);
                let delayNode = audioCtx.createDelay(1.0); // 创建支持最长1秒延时的音频延迟器

                source.connect(delayNode);
                delayNode.connect(audioCtx.destination); // 输出

                $(".slider-audio-delay").on("input", function (event) {
                    let delay_time = event.target.value;
                    $(event.target.parentElement).find("span>span").text(delay_time);
                    delayNode.delayTime.exponentialRampToValueAtTime(delay_time / 1000 + 0.000001, audioCtx.currentTime + 0.1);
                })
            }
            $(".video-elem-container").append($('<div class="slider-audio-delay-container slider-box"></div>'))

            $(".slider-audio-delay-container")
                .append($('<span id="btn_enable_audio_delay" title="在Chrome99下发现该功能可能导致视频无法自行播放，请按需打开">点击启用声音延时功能</span>'))

            $("#btn_enable_audio_delay").click(function () {
                $("#btn_enable_audio_delay").remove();
                enable_audio_delay();
            })

            // 允许通过滑块调整 vshare 页面视频的倍速（0.5-5倍），10倍变速
            $(".video-elem-container").append($('<div class="video-playback-rate-container slider-box"></div>'))
            $(".video-playback-rate-container")
                .append($('<span>视频播放倍速<span>1.0</span>倍速</span>'))
                .append($('<input type="range" min="5" max="50" value="10" class="video-playback-rate styled-slider">'));

            $(".video-playback-rate").on("input", function (event) {
                let playback_rate = event.target.value;
                $(event.target.parentElement).find("span>span").text((playback_rate / 10).toFixed(1));
                $("#new_player")[0].playbackRate = playback_rate / 10;
            });

            // 创建自定义样式的滑块元素，参考 https://www.w3schools.com/howto/howto_js_rangeslider.asp
            GM_addStyle(".styled-slider {-webkit-appearance: none; width: calc(100% - 14em); height: 8px; border-radius: 3px; background: #DDD; outline: none;}")
            GM_addStyle(".styled-slider::-webkit-slider-thumb {-webkit-appearance: none; appearance: none; width: 25px; height: 15px; border-radius: 3px; background: #666; cursor: pointer;}")
            GM_addStyle(".styled-slider::-moz-range-thumb {width: 25px; height: 15px; border-radius: 3px; background: #666; cursor: pointer;}")

            GM_addStyle(".slider-box {height: 20px; max-width: 800px; margin: auto;}");
            GM_addStyle(".slider-box>span {display: inline-block; width: 13em;}");
            GM_addStyle(".slider-box>span>span {display: inline-block; width: 2.5em;}");

            // 新样式的视频说明文字
            $(".video-desc-container.empty").remove()
            if ($(".video-desc-container").length) {
                $(".video-title").css("width", "fit-content");
                $(".video-title").css("margin", "auto");
                $(".video-desc-container").attr("style", "position: absolute;top: 0;display:none; z-index: 1;background-color: #fffe;border: 2px solid black;border-radius: 16px;box-shadow: rgb(0 0 0 / 70%) 1px 1px 10px;margin: -28px 0px;padding: 13px 16px;width: 240px;min-height: 300px;");

                // 鼠标悬停时显示，离开时隐藏
                let desc_hide_timeout = undefined;
                $(".video-title").on("mousemove", function (event) {
                    $(".video-desc-container").css("left", event.pageX - 120)
                    clearTimeout(desc_hide_timeout);
                    $(".video-desc-container").show();
                });
                $(".video-desc-container").on("mousemove", function () {
                    clearTimeout(desc_hide_timeout);
                });
                $(".video-title,.video-desc-container").on("mouseleave", function () {
                    clearTimeout(desc_hide_timeout);
                    desc_hide_timeout = setTimeout(function () {
                        $(".video-desc-container").hide()
                    }, 30)
                });
            }
        }
        if ($(".video-wrapper").length) {
            let wait_video_interval = setInterval(function () {
                if (!$("#video-share_html5_api").attr("src")) {
                    return;
                }
                clearInterval(wait_video_interval);
                console.log("vshare 页面加载完成")
                const t0 = Date.now();
                doVshareEnhance();
                console.log(`vshare 页面加载完成后任务运行完成，耗时：${Date.now() - t0}毫秒`)
            }, 10);
        }
    }
})();