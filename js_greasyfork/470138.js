// ==UserScript==
// @name         搜索那个
// @description  日本影视行业内部搜索工具Pro Max Plus Ultra
// @author       shopkeeperV
// @namespace    https://greasyfork.org/zh-CN/users/150069
// @version      2.1.3
// @match        *://*/*
// @exclude      *://localhost*/*
// @exclude      *://192.168*/*
// @connect *
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/470138/%E6%90%9C%E7%B4%A2%E9%82%A3%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/470138/%E6%90%9C%E7%B4%A2%E9%82%A3%E4%B8%AA.meta.js
// ==/UserScript==
/*jshint esversion: 8*/
(async function () {
    'use strict';
    let iframes = document.getElementsByTagName('iframe');
    if (top !== window) {
        let host = location.host;
        //仅在iframe内执行，服务于分辨率获取功能，负责iframe内视频信息反馈
        //注意广告插件或许会导致获取不到视频信息
        if (!/(cloudflare)|(captcha)/.test(window.location.href)) {
            console.log(`iframe>${host}开始监听消息。`);
            //iframe获取父窗口消息，绕过iframe安全机制
            window.addEventListener('message', e => {
                //需要判断一下内容，部分网站自己也会通信，会触发到这个方法，JavSearch作为标志
                if (typeof e.data === 'string' && e.data.includes("JavSearch")) {
                    console.log(`收到父窗口通知，发送iframe>${host}内视频信息。`);
                    //发送页面视频信息
                    window.top.postMessage(getVideosInfo(), '*');
                    //通知iframe里面的子iframe
                    noticeSubIframe();
                }
            });
        }
        //去部分iframe弹窗
        if (/emturbovid/.test(host)) {
            addCSS("div[id^='pop']{display:none;}");
        }
        //https://supjav.com/zh/112670.html FST源
        else if (host === "fc2stream.tv") {
            addCSS("div[style*='opacity:0']{display:none;}");
        }
        //7mm系列弹窗
        else if (/^mm.+\.xyz$/.test(host)) {
            addCSS("div[class*='pop']{display:none;}");
            addCSS("div[style*='opacity:0']{display:none;}");
        }
        //为此iframe添加message事件后无需往后执行
        return;
    }
    let isAndroid = /android/i.test(navigator.userAgent);
    let modalStyleReady = false;
    let ballStyleReady = false;
    let blingStyleReady = false;
    //设置样式，通知模态框要用
    initStyle();
    //通知模态框需要率先创建
    let noticeDialogObj = new ModalDialog("<div id='jav_notice'></div>", {
        width: "310px",
        dialogPosition: "top",
    }, () => {
        const noticeElement = document.getElementById("jav_notice");
        //DOM元素的移除（或其内容的清空）并不总是会自动停止该元素内部正在运行的媒体
        const videoElements = noticeElement.querySelectorAll("video");
        videoElements.forEach(video => {
            video.pause();
            //为了彻底释放资源，可以将视频源清空
            video.src = "";
            video.load();
        });
        noticeElement.innerHTML = "";
    });
    //需要声明在noticeDialogObj创建后
    let noticeContainer = document.getElementById("jav_notice");
    //执行个别网页的定制脚本
    if (await adviceAndReturn()) return;
    //分辨获取功能的页面视频信息描述
    let videosInfo = "";
    //分词时特殊片商识别
    let currentSP = "";
    let specialProducers = {
        "H4610": "https://en.h4610.com/moviepages/%s/index.html",
        "H0930": "https://en.h0930.com/moviepages/%s/index.html",
        "C0930": "https://en.c0930.com/moviepages/%s/index.html"
    };
    //桌面端链接分词定时器
    let timeoutTimer;
    //功能是否初始化
    let ready = false;
    let oldUser = getTmValue("old_user");
    //灵魂搜索引擎们
    let btnMap;
    let cenMap;
    let uncMap;
    let searchDialogPosition, blingBlurRadius, blingSpreadRadius;
    if (isAndroid) {
        searchDialogPosition = "bottom";
        blingBlurRadius = "50px";
        blingSpreadRadius = "30px";
    } else {
        searchDialogPosition = "middle";
        blingBlurRadius = "500px";
        blingSpreadRadius = "60px";
    }
    buildBtnMap();
    let searchDialogObj = new ModalDialog(searchDialogCode(), {
        width: "310px",
        dialogPosition: searchDialogPosition
    });
    let settingDialogObj;
    //大量使用，单独声明，注意需要模态框创建后才有，写在后面
    let textInput = document.getElementById("jav_input");
    //创建悬浮球
    new FloatBall("jav_ball", {color: "#00cec9"});
    //让屏幕周围亮起来，用于链接分词
    let blingObj = new WindowBling({
        color: "#00cec9",
        blingPosition: ["left", "right"],
        blurRadius: blingBlurRadius,
        spreadRadius: blingSpreadRadius
    });
    //监听变量，多线程请求完成个数，个数符合预期代表本次搜索结束
    const obj = {value: 0};
    let complete = 0;
    let completeHandler;
    const count = new Proxy(obj, {
        set(target, prop, newValue) {
            console.log(`搜索完成计数从 ${target[prop]} 变为 ${newValue}`);
            if (newValue !== 0 && newValue === complete) {
                completeHandler();
            }
            target[prop] = newValue;
            return true;
        }
    });
    let startNewCount = function (_complete, _completeHandler) {
        count.value = 0;
        complete = _complete;
        console.log("请求完成目标总数：" + complete);
        completeHandler = _completeHandler;
    };
    let hlsJsLoaded = false;
    let hlsSupported = false;
    //第一阶段初始化，绑定必须的监听事件，小球，链接分词，划词等，其余的在首次点击小球后再初始化，以节约性能
    init1();

    function noticeSubIframe() {
        for (let iframe of iframes) {
            if (iframe.contentWindow && iframe.contentWindow.postMessage) {
                const url = new URL(iframe.src);
                const iframeHost = url.host;
                console.log(`${location.host}给iframe>${iframeHost}发送信号。`);
                iframe.contentWindow.postMessage("JavSearch"/*JavSearch作为标志标明是此脚本发送的信息*/, '*');
            }
        }
    }

    function buildBtnMap() {
        btnMap = new Map();
        btnMap.set("trailers情报", {
            url: "https://javtrailers.com/ja/search/%s",
            //当搜索内容为空时，没有back属性的引擎将打开首页，有back属性的引擎会打开指定的页面
            back: "https://javtrailers.com/shorts"
        });
        btnMap.set("avsox无码情报", {url: "https://avsox.click/cn/search/%s", back: "https://avsox.click/cn"});
        btnMap.set("javdb情报", {url: "https://javdb.com/search?q=%s&f=all"});
        btnMap.set("google+jav", {url: "https://www.google.com/search?q=%s%20jav"});
    }

    //排序对应结果优先级
    function buildCenMap() {
        cenMap = new Map();
        cenMap.set("missav字幕", {url: "https://missav.ai/cn/search/%s", reqMethod: "get"});
        cenMap.set("jable字幕", {url: "https://jable.tv/search/%s/", reqMethod: "get"});
        cenMap.set("7mm字幕", {
            url: "https://7mmtv.sx/zh/searchform_search/all/index.html",
            reqMethod: "post",
            payload: "search_keyword=%s&search_type=searchall&op=search"
        });
        cenMap.set("supjav破解", {url: "https://supjav.com/zh/?s=%s", reqMethod: "get"});
        cenMap.set("777字幕", {url: "https://www.jav777.xyz/?s=%s", reqMethod: "get"});
    }

    function buildUncMap() {
        uncMap = new Map();
        uncMap.set("missav无码", {url: "https://missav.ai/cn/search/%s", reqMethod: "get"});
        uncMap.set("123av", {url: "https://123av.com/zh/search?keyword=%s", reqMethod: "get"});
        uncMap.set("7mm无码", {
            url: "https://7mmtv.sx/zh/searchform_search/all/index.html",
            reqMethod: "post",
            payload: "search_keyword=%s&search_type=searchall&op=search"
        });
        uncMap.set("guru", {url: "https://jav.guru/?s=%s", reqMethod: "get"});
        uncMap.set("supjav无码", {url: "https://supjav.com/zh/?s=%s", reqMethod: "get"});
    }

    function searchDialogCode() {
        return '<div id="jav_searchDialog">' +
            '<div>' + getBtns() +
            `<div id="jav_cen" class="bbtn llink">搜索有码</div>` +
            '<div id="jav_unc" class="bbtn llink">搜索无码</div>' +
            '</div>' +
            '<div><input id="jav_input" type="text" value="" autocomplete="off"/></div>' +
            '<div>' +
            '<div id="jav_copy" class="bbtn ttool">复制到剪贴板</div>' +
            '<div id="jav_clear" class="bbtn ttool">清空输入框</div>' +
            '<div id="jav_analyze" class="bbtn ttool">析出番号</div>' +
            '<div id="jav_sample" class="bbtn ttool">视频预览</div>' +
            '<div id="jav_video_size" class="bbtn ttool">分辨率获取</div>' +
            '<div id="jav_setting" class="bbtn ttool">搜索设置</div>' +
            '<div id="jav_description" class="bbtn ttool">必看说明</div>' +
            '</div>' +
            '<div><div id="jav_close" class="bbtn cclose">关闭</div></div>' +
            '</div>';

        function getBtns() {
            let btns = "";
            btnMap.forEach(function (value, key) {
                btns += `<div class='bbtn llink' id='${key}'>${key}</div>`;
            });
            return btns;
        }
    }

    function settingCode() {
        return "<div id='jav_settingDialog'>" +
            "<div class='jav_setting_text' >下列开关决定相应引擎是否参与搜索，在搜索结果不理想时使用，仅在当前页面生效。</div>" +
            "<div>" +
            "<span class='jav_setting_text'>有码引擎</span><br/>" +
            "<form class='jav_pick_form' id='cen_pick_form'>" +
            getSettingBtns(cenMap) +
            "</form>" +
            "</div>" +
            "<div>" +
            "<span class='jav_setting_text'>无码引擎</span><br/>" +
            "<form class='jav_pick_form' id='unc_pick_form'>" +
            getSettingBtns(uncMap) +
            "</form>" +
            "</div>" +
            "</div>";
    }

    function getSettingBtns(map) {
        let result = "";
        map.forEach((value, key) => {
            let urlPart = value.url.split("/");
            result += `<input type='checkbox' checked id='${key}'><label for='${key}'>${key}</label>` +
                `<div class='jav_go' jav_url='${urlPart[0]}//${urlPart[2]}'>前往</div>` +
                "<br/>";
        });
        return result;
    }

    function initStyle() {
        let globalCSS = ".ddialog .bbtn:focus,.ddialog .bbtn:active,.ddialog .bbtn:hover{-webkit-tap-highlight-color:transparent}" +
            ".ddialog .bbtn{box-sizing:border-box;display:inline-block;margin:3px;padding:0 8px;border-radius:4px;cursor:pointer;color:white;font:16px/1.8 sans-serif;min-width:140px;min-height:30px;letter-spacing:normal;user-select:none}" +
            ".ddialog .llink{background:#00baf8;}" +
            ".ddialog .ttool{background:#00baf8;}" +
            ".ddialog .cclose{background:#ff6666;}" +
            "#jav_input{box-sizing:border-box;display:block;margin:3px auto;outline:none;border:3px solid #00baf8 !important;border-radius:6px;padding:6px;width:286px;height:35px;font:14px/1.8 sans-serif !important;text-align:center;color:#00baf8 !important;font-weight:bold !important;background-color:white !important;box-shadow:none;letter-spacing:normal;}" +
            "#jav_input::placeholder{font:14px/1.8 sans-serif !important;color:#00baf8 !important;text-align:center;letter-spacing:normal;}" +
            "#mmuted,#ssearch{position:fixed;box-sizing:border-box;z-index:999997;border-radius:4px;cursor:pointer;user-select: none;margin:auto;color:white;text-align:center;letter-spacing:normal;}" +
            "#jav_notice,#jav_video{font:18px/1.8 sans-serif;text-align:center;color:#00baf8;font-weight:bold;padding:10px;letter-spacing:normal;}" +
            "#jav_notice .eerror{color:#ff6666;}" +
            ".jav_pick_form{text-align:center !important;}" +
            ".jav_pick_form input{display:none !important;}" +
            ".jav_pick_form label,.jav_go{border:1px solid #00baf8;padding:2px 5px 2px 5px;text-align:center;margin:5px;border-radius:5px;color:#00baf8;cursor:pointer;display:inline-block !important;font:14px/1.6 sans-serif;-webkit-tap-highlight-color:transparent;user-select:none;}" +
            ".jav_pick_form label{min-width:110px;}" +
            ".jav_pick_form input:checked + label{color:white;background:#00baf8;}" +
            "#jav_searchDialog{margin-top:15px;margin-bottom:10px;}" +
            "#jav_settingDialog{width:200px;margin:20px auto;font:14px/1.6 sans-serif;color:#00baf8;}" +
            "#jav_settingDialog div:not(.jav_go){margin-bottom:10px;}" +
            "#jav_settingDialog .sset{font:14px/2.3 sans-serif;}" +
            ".jav_setting_text{font-weight:bold;}";
        addCSS(globalCSS);
        //下面是特定网页的样式
        let host = location.host;
        let path = location.pathname;
        if (host === "adult.contents.fc2.com" && /article/.test(path)) {
            addCSS('#fc2Div>div{background-color:#00baf8;border-radius:4px;color:white;padding:5px 8px;user-select:none;' +
                'cursor: pointer;margin:5px 10px;text-align:center;display:inline-block;font:12px/1.6 sans-serif;}');
        } else if (/^7mmtv\./.test(host)) {
            //广告图，css隐藏比js快
            addCSS(".ut_cg1_top{display:none;}");
            //去视频悬浮层
            addCSS(".mvspan_2_s_k_i_p_row{display:none;}");
            addCSS("div[class*='pop']{display:none;}");
        } else if (host === "www.jav777.xyz") {
            addCSS("body{min-width:unset !important;}");
        } else if (host === "javdb.com") {
            addCSS(".columns{margin-right:0px !important;}");
        } else if (host === "supjav.com") {
            addCSS(".movv-ad{display:none;}");
        }
    }

    function addCSS(css) {
        let style = document.createElement("style");
        //放body里是因为部分网页重写head标签，外面套了一层div是因为bing换搜索词会删掉body的子style
        let styleDiv = document.querySelector("#jav_style");
        if (!styleDiv) {
            styleDiv = document.createElement("div");
            styleDiv.id = "jav_style";
            document.body.prepend(styleDiv);
        }
        style.textContent = css;
        styleDiv.appendChild(style);
    }

    //此方法可以完成一些网站的自动点击、自动播放等，也对一些网站进行功能定制
    async function adviceAndReturn() {
        let host = location.host;
        let path = location.pathname;
        let hash = location.hash;
        //7mm自定义播放源优先级
        if (/^7mmtv\./.test(host)) {
            if (/searchform_search/.test(path)) {
                let match = hash.match(/#(.*)/);
                if (match) {
                    let formElement = document.querySelector("form");
                    let inputElement = formElement.querySelector('input[type="text"]');
                    inputElement.value = match[1];
                    formElement.submit();
                }
            }
            //视频观看页面
            else if (document.querySelectorAll(".fullvideo-details").length === 1) {
                chooseSource(".btn-server", ["FL", "SW", "VH", "US"],
                    (btn, source) => btn.onclick.toString().includes(source));
            }
        }
        //supjav自定义播放源优先级
        else if (host === "supjav.com") {
            if (path.includes(".html")) {
                chooseSource(".btnst>a", ["FST", "VOE", "DS"],
                    (btn, source) => btn.textContent === source,
                    () => document.querySelectorAll("#dz_video>iframe").length > 0);
            }
        }
        //fc2，添加两个易用的按钮
        else if (host === "adult.contents.fc2.com" && /article/.test(path)) {
            //该元素后添加按钮
            let targetEle;
            //用户主页
            let home;
            if (isAndroid) {
                targetEle = document.getElementsByClassName("items_article_Mainitem")[0];
                home = document.getElementsByClassName("items_article_seller")[0].href;
            } else {
                targetEle = document.getElementsByTagName("ul")[3];
                home = targetEle.getElementsByTagName("a")[1].href;
            }
            let div = document.createElement("div");
            div.id = "fc2Div";
            div.innerHTML = "<div>该作者其他作品</div><div>搜索该作品</div>";
            targetEle.after(div);
            div.children[0].addEventListener("click", () => {
                window.location.href = home + "articles?sort=date&order=desc";
            });
            div.children[1].addEventListener("click", () => {
                textInput.value = window.location.href.match(/\/([0-9]+)\//)[1];
                if (!ready) {
                    init2();
                    ready = true;
                }
                searchDialogObj.open();
            });
        }
        //heyzo没有预览视频时将小图片替换高清图，无码片商中仅heyzo可以替换，因为他图片的url格式是固定的
        else if (/\.heyzo\.com/.test(host)) {
            //查找所有图片，替换url，展示预览大图
            let gallery = document.getElementById("section_gallery");
            if (gallery) {
                let reg = /\/contents\/[0-9]+\/[0-9]+\/gallery\/thumbnail.*?\.jpg/ig;
                let template = '<img src="%s" style="width:inherit;">';
                let imgs = gallery.innerHTML.match(reg);
                //往.quality-btns后添加图片
                let html = "";
                for (let i = 0; i < imgs.length; i++) {
                    html += template.replace("%s", imgs[i].replace("thumbnail_", ""));
                }
                let div = document.createElement("div");
                div.style.width = "inherit";
                div.innerHTML = html;
                document.getElementById("quality-btns").after(div);
            }
        }
        //missav分辨中文字幕、无码流出视频
        else if (/^missav\./.test(host)) {
            let selector = document.querySelector(".space-y-2");
            if (selector) {
                let match = selector.textContent.match(/中文字幕|无码流出/);
                if (match) {
                    let title = document.querySelector(".mt-4>h1");
                    if (title) {
                        title.innerText = `【${match[0]}】${title.innerText}`;
                    }
                }
            }
        }
        //给trailers的短视频页面记录浏览历史
        else if (host === "javtrailers.com") {
            //单页应用
            const originalPushState = history.pushState;
            history.pushState = function (state, title, url) {
                originalPushState.apply(history, arguments);
                console.log('pushState被调用，新地址：', url);
                if (/shorts/.test(location.pathname/*必须重新获取*/)) {
                    waitContainer();
                }
            };
            let waitContainer = () => {
                let container = document.querySelector(".video-container");
                if (!container) {
                    setTimeout(waitContainer, 500);
                    return;
                }
                let videos = container.getElementsByTagName("video");
                if (isAndroid) {
                    //添加搜索按钮，仅在移动端shorts页面显示，所以随着container的存在而存在
                    let div = document.createElement("div");
                    div.style.cssText = "left:0;top:70%;background-color:#00cec9;padding:5px 8px;font:14px/1.8 sans-serif;";
                    div.id = "ssearch";
                    div.innerText = "获取此页番号";
                    container.appendChild(div);
                    div.addEventListener("click", () => {
                        showNotice("获取番号中...");
                        let noPlaying = true;
                        for (let video of videos) {
                            if (!video.paused) {
                                let a = video.parentElement.parentElement.querySelector(".icon-buttons-container>a:nth-child(2)");
                                if (!a) {
                                    appendNotice("非短视频页面。", true);
                                    return;
                                }
                                noPlaying = false;
                                let url = a.href;
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: url,
                                    timeout: 3000,
                                    onload: (res) => {
                                        let match = res.responseText.match("DVD ID:</span> ([^<]+)<");
                                        if (match) {
                                            textInput.value = match[1];
                                            if (!ready) {
                                                init2();
                                                ready = true;
                                            }
                                            hideNotice();
                                            searchDialogObj.open();
                                        } else {
                                            appendNotice("所请求页面未找到番号。", true);
                                        }
                                    },
                                    onerror: (err) => {
                                        hideNotice();
                                        openInTab(url);
                                    },
                                    ontimeout: (err) => {
                                        hideNotice();
                                        openInTab(url);
                                    }
                                });
                                break;
                            }
                        }
                        if (noPlaying) {
                            appendNotice("没有视频在播放。", true);
                        }
                    });
                }
                let count = 0;
                new MutationObserver(() => {
                    count++;
                    //短时间内不重复执行
                    if (count > 1) {
                        return;
                    }
                    console.log("video-container内dom变化");
                    setTimeout(() => {
                        count = 0;
                    }, 300);
                    waitCamera();
                }).observe(container, {childList: true});
                let waitCamera = () => {
                    let camera = container.querySelector(".flicking-camera");
                    if (!camera) {
                        setTimeout(waitCamera, 500);
                        return;
                    }
                    new MutationObserver(() => {
                        console.log("flicking-camera内dom变化");
                        for (let video of videos) {
                            if (!video.getAttribute("mmark")) {
                                video.addEventListener("play", () => {
                                    console.log("playing");
                                    let target = video.parentElement.parentElement.querySelector(".icon-buttons-container>a:nth-child(2)");
                                    if (target) {
                                        history.pushState(null, "", target.href);
                                    }
                                });
                                video.setAttribute("mmark", "true");
                            }
                        }
                    }).observe(camera, {childList: true});
                };
                waitCamera();
            };
            if (/shorts/.test(path)) {
                waitContainer();
            }
        }
        //自动播放
        if (hash === "#autoplay") {
            let failTimes = 0;
            let videos = document.getElementsByTagName("video");
            let voiceDiv = document.createElement("div");
            //给个通知，明确自动播放程序运行中
            voiceDiv.textContent = "等待视频加载...";
            voiceDiv.id = "mmuted";
            let _width = 180;
            voiceDiv.style.cssText = "background-color:#ff6666;padding:15px 20px;font:18px/1.8 sans-serif;";
            voiceDiv.style.width = _width + "px";
            voiceDiv.style.top = Math.round(screen.height / 3 * 2) + "px";
            voiceDiv.style.left = Math.round(screen.width / 2 - _width / 2) + "px";
            document.body.prepend(voiceDiv);
            if (host === "javtrailers.com") {
                let posters = document.getElementsByClassName("vjs-poster");
                let clickPoster = function () {
                    if (failTimes > 20) {
                        finalFailHandler();
                        return;
                    }
                    if (posters.length === 0 || videos.length === 0) {
                        setTimeout(clickPoster, 500);
                        failTimes++;
                        return;
                    }
                    let video = videos[0];
                    if (video.paused) {
                        //想要播放得静音
                        video.muted = true;
                        autoClick(posters[0]);
                    }
                    if (video.readyState === 0) {
                        setTimeout(clickPoster, 500);
                        failTimes++;
                    } else {
                        failTimes = 0;
                        forcePlay();
                    }
                };
                clickPoster();
            } else {
                forcePlay();
            }

            function finalFailHandler() {
                voiceDiv.innerHTML = "播放失败<br/>请尝试日本节点";
                voiceDiv.addEventListener("click", () => {
                    voiceDiv.style.display = "none";
                }, {once: true});
            }

            async function forcePlay() {
                if (failTimes === 15) {
                    finalFailHandler();
                    return;
                }
                console.log("自动播放：尝试强制播放，每0.5s一次。");
                let video = videos[0];
                if (!video) {
                    failTimes++;
                    setTimeout(forcePlay, 500);
                    console.log("没有视频元素。");
                    return;
                }
                //个别网站display不写在内联样式里，需要以这种方式获取所有的样式getComputedStyle
                if (window.getComputedStyle(video).display === "none") {
                    failTimes++;
                    setTimeout(forcePlay, 500);
                    console.log('video.style.display="none"');
                    return;
                }
                //视频已就绪但是播放不了的话
                setTimeout(() => {
                    if (video.readyState === 0) {
                        finalFailHandler();
                    }
                }, 8000);
                video.muted = true;
                console.log("自动播放：设为无声。");
                try {
                    await video.play();
                } catch (e) {
                    console.log("视频未就绪：" + e.message);
                    failTimes++;
                    setTimeout(forcePlay, 500);
                    return;
                }
                //刷新不再自动播放
                location.hash = "played";
                voiceDiv.style.backgroundColor = "#00cec9";
                voiceDiv.textContent = "点我解除静音";
                voiceDiv.addEventListener("click", () => {
                    video.muted = false;
                    voiceDiv.textContent = "点我3倍速播放";
                    voiceDiv.addEventListener("click", () => {
                        if (video.playbackRate === 1.0) {
                            video.playbackRate = 3.0;
                            voiceDiv.textContent = "点我恢复速度";
                        } else {
                            video.playbackRate = 1.0;
                            voiceDiv.textContent = "点我3倍速播放";
                        }
                    });
                }, {once: true});
                console.log("自动播放：强制播放成功。");
            }
        }
        //默认情况不终止脚本执行
        return false;

        function autoClick(eventTarget) {
            console.log("尝试点击中...");
            eventTarget.dispatchEvent(new Event("click", {bubbles: true}));
        }

        function chooseSource(selector, sources, matchFunc, checkFunc = () => true) {
            //自动加载顺序：自定义数组>第一个源
            let btns = document.querySelectorAll(selector);
            if (btns.length > 0) {
                let openFirst = true;
                out: for (let source of sources) {
                    for (let btn of btns) {
                        if (matchFunc(btn, source)) {
                            autoClick(btn);
                            openFirst = false;
                            break out;
                        }
                    }
                }
                if (openFirst) autoClick(btns[0]);
                if (!checkFunc()) {
                    setTimeout(() => chooseSource(selector, sources, matchFunc, checkFunc), 500);
                }
            } else {
                setTimeout(() => chooseSource(selector, sources, matchFunc, checkFunc), 500);
            }
        }
    }

    function init1() {
        observeNodeIncrement();
        //获取页面所有链接，添加事件获取文本内容，移动端滑动触发，桌面端鼠标悬浮一会触发
        //getElementsByTagName、getElementsByClassName获取的集合是实时更新的，不需要重新获取，保留引用以提升性能
        let links = document.getElementsByTagName("a");
        //首次链接分词监听
        addLinkListener();
        //选词监听
        document.addEventListener("selectionchange", getSelectedWord);
        //记录小球位置，避免拖拽时触发点击
        let startX;
        let startY;
        //为悬浮球添加鼠标按下事件，防止拖拽时触发点击
        document.getElementById("jav_ball").addEventListener("mousedown", (e) => {
            startX = e.clientX;
            startY = e.clientY;
        });
        //为悬浮球添加点击事件
        document.getElementById("jav_ball").addEventListener("click", (e) => {
            //先判断是否拖拽过，误差5px
            if (Math.abs(startX - e.clientX) > 5 || Math.abs(startY - e.clientY) > 5) {
                return;
            }
            //首次初始化
            if (!ready) {
                init2();
                ready = true;
            }
            //每次打开时重置placeholder
            textInput.placeholder = "使用前请先看说明！";
            searchDialogObj.open();
        });

        //观察dom变化，因为个别网站会用xhr添加新的a标签，这部分链接将无法触发链接分词，dom增加节点时将刷新a标签的分词事件
        function observeNodeIncrement() {
            //延迟1秒重置标签，如果在一秒内又触发则取消执行，设置新的延迟任务，因为有时触发太频繁可能影响性能
            let observerTimer;
            new MutationObserver(nodeChangeCallback).observe(document.body, {childList: true, subtree: true});
            console.log("搜索那个dom观察：开始观察dom变化。");

            function nodeChangeCallback(mutationsList) {
                console.log('搜索那个dom观察：发现dom变化。');
                if (observerTimer) {
                    return;
                }
                observerTimer = setTimeout(() => {
                    observerTimer = 0;
                    addLinkListener();
                }, 1000);
                console.log("搜索那个dom观察：一秒后重置所有a标签事件。");
            }
        }

        //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop
        function addLinkListener() {
            //链接分词监听，所有a标签
            for (let i = 0; i < links.length; i++) {
                //a标签有文字节点且有内容才添加事件
                if (!links[i].getAttribute("jav_listen")) {
                    if (isAndroid) {
                        links[i].addEventListener("touchstart", getLinkText);
                    } else {
                        //桌面端鼠标悬浮触发
                        links[i].addEventListener("mousemove", rebuildLinkTimer/*鼠标移动的话不停重置定时器*/);
                        //离开时也清除定时器
                        links[i].addEventListener("mouseleave", clearLinkTimeout);
                    }
                    links[i].setAttribute("jav_listen", "true");
                }
            }
            console.log("搜索那个dom观察：a标签事件添加完成。");

            function rebuildLinkTimer(event) {
                //在链接上移动鼠标需要重新设置定时器
                timeoutTimer && clearTimeout(timeoutTimer);
                timeoutTimer = setTimeout(() => {
                    getLinkText(event);
                }, 600);
            }

            function clearLinkTimeout() {
                timeoutTimer && clearTimeout(timeoutTimer);
            }

            function getLinkText(event) {
                let _textContent = event.target.textContent;
                if (!/\S+/.test(_textContent)) return;
                separate(_textContent, true);
            }
        }

        function getSelectedWord(event) {
            //排除自己的输入框
            if (textInput.contains(event.target)) {
                return;
            }
            let selectWords = window.getSelection().toString();
            if (selectWords) {
                //需要清除首尾空格
                textInput.value = removeSpaces(selectWords);
            }
        }
    }

    //更多功能的第二阶段初始化
    function init2() {
        buildCenMap();
        buildUncMap();
        settingDialogObj = new ModalDialog(settingCode(), {
            width: "220px",
            dialogPosition: searchDialogPosition
        });
        //接收iframe发来的数据，绕过iframe安全机制
        window.addEventListener('message', e => {
            //需要判断一下内容，部分网站自己也会通信，会触发到这个方法
            if (typeof e.data === 'string' && e.data.includes("JavFrame>")) {
                appendNotice(e.data, false);
            }
        });
        //给搜索按钮添加事件
        btnMap.forEach((value, key) => {
            let btn = document.getElementById(key);
            btn.addEventListener("click", (event) => {
                let url = value.url;
                let keyword = removeSpaces(textInput.value);
                //有搜索词
                //使用油猴的GM_openInTab()，因为window.open()存在个别网站打不开的情况
                if (keyword !== "" && !/^\s+$/.test(keyword)/*也不能全是空白符*/) {
                    openInTab(url.replace("%s", keyword));
                }
                //没有搜索词
                else {
                    if (value.back) {
                        openInTab(value.back);
                    } else {
                        //其余跳到主页
                        let parts = url.split("/");
                        openInTab(parts[0] + "//" + parts[2]);
                    }
                }
            });
        });
        let btnGoArray = document.getElementsByClassName("jav_go");
        for (let go of btnGoArray) {
            if (go.getAttribute("jav_url")) {
                go.onclick = () => {
                    openInTab(go.getAttribute("jav_url"));
                };
            }
        }
        //使用说明
        document.getElementById("jav_description").addEventListener("click", () => {
            openInTab("https://sleazyfork.org/zh-CN/scripts/470138#additional-info");
        });
        //视频预览
        document.getElementById("jav_sample").addEventListener("click", sampleHandler);
        //清除输入框内容
        document.getElementById("jav_clear").addEventListener("click", () => {
            textInput.value = "";
            textInput.placeholder = "请输入";
        });
        //复制
        document.getElementById("jav_copy").addEventListener("click", () => {
            GM_setClipboard(removeSpaces(textInput.value), "text");
            showNotice("已复制。");
            setTimeout(() => {
                hideNotice();
            }, 500);
        });
        //析出番号，手动粘贴后，点击按钮获取文本中的番号
        document.getElementById("jav_analyze").addEventListener("click", () => {
            separate(textInput.value, false);
        });
        //关闭按钮
        document.getElementById("jav_close").addEventListener("click", () => {
            searchDialogObj.close();
        });
        //获取页面中存在的视频的分辨率
        document.getElementById("jav_video_size").addEventListener("click", () => {
            //先获取当前页面视频信息
            videosInfo = getVideosInfo();
            searchDialogObj.close();
            showNotice(videosInfo);
            //发个空消息给所有子iframe，通知他们响应视频信息
            noticeSubIframe();
        });
        document.getElementById("jav_setting").addEventListener("click", () => {
            settingDialogObj.open();
        });
        document.getElementById("jav_cen").addEventListener("click", searchHandler);
        document.getElementById("jav_unc").addEventListener("click", searchHandler);
        //模态框内输入框添加离焦事件更新按钮事件
        textInput.addEventListener("blur", () => {
            currentSP = "";
            console.log("blur清除特殊片商");
            textInput.placeholder = "请输入";
        });
    }

    //分词方法，blink表示是否分词后闪烁屏幕
    function separate(textContent, blink, search = false/*如果是搜索调用，不要修改特殊片商的信息*/) {
        //输入框置空，显示placeholder的提示内容
        textInput.value = "";
        if (textContent === "") {
            textInput.placeholder = "文本内容不存在";
            return;
        }
        textContent = textContent.replaceAll("—"/*中文连接符*/, "-");
        //匹配正则数组
        let matchers = [
            //部分文本胡乱使用连接符和下划线，只能尽量识别，小部分需要手动删改
            //可能出现carib-11111-11，所以先获取该格式，日期格式1111-11-11只有最高四位数不用管
            /(?<![a-z0-9])[0-9]{5,}[_-][0-9]{2,5}(?![a-z0-9])/i,
            //可能出现fc2-ppv-111111，但数字部分6位起步不用管
            /((?<![a-z0-9])([0-9]*[a-z]+|[a-z]+[0-9]+[a-z]*))[_-]([a-z]*[0-9]{2,5}(?![0-9]))/i,/*后面可以有字母，因为有些番号以abc分p*/
            /(?<![a-z0-9])[a-z]+[0-9]{3,}(?![a-z0-9])/i,
            //常见日期格式1111-11-11，所以末尾带-或_的排除
            /(?<![a-z0-9])[0-9]{4,}(?![a-z0-9-_])/i
        ];
        let ids;
        if (!search) {
            //特殊片商处理（片商名称像番号）
            currentSP = "";
            console.log("separate清除特殊片商");
            for (let sp of Object.keys(specialProducers)) {
                if (new RegExp(sp, "i").test(textContent)) {
                    console.log("获取到特殊片商：" + sp);
                    //若视频预览功能匹配到响应格式的番号，将使用该片商的的预览地址
                    currentSP = sp;
                    textContent = textContent.replace(sp, "").replace(sp.toLowerCase(), "");
                    break;
                }
            }
        }
        for (let i = 0; i < matchers.length; i++) {
            ids = textContent.match(matchers[i]);
            if (ids) {
                break;
            }
        }
        if (!ids) {
            textInput.placeholder = "链接或输入框文本中未找到番号";
            return false;
        }
        textInput.value = ids[0];
        if (blink) {
            blingObj.blink();
        }
        return true;
    }

    //处理cloudflare拦截
    async function checkCF(xhr) {
        let finalUrl = xhr.finalUrl;
        let finalHost = finalUrl.split("/")[2];
        //从响应码判断可以避免每次请求都搜索字符串，但是cloudflare拦截后响应码是否一定不是200待验证
        if (xhr.status === 200) {
            console.log(`${finalHost}的响应码是200，跳过cloudflare检查`);
            return 0;
        }
        if (xhr.responseText.search(/you have been blocked/i) >= 0) {
            //被cloudflare拉黑
            appendNotice(finalHost + "被cloudflare拉黑，请更换代理。响应码：" + xhr.status, true);
            //1代表出错
            return 1;
        } else if (xhr.responseText.search(/Enable JavaScript and cookies to continue/i) >= 0) {
            //需要真人验证
            return 2;
        }
        //0代表未被拦截
        else return 0;
    }

    function addTitle(text) {
        let div = document.createElement("div");
        div.innerText = text + "↓";
        noticeContainer.appendChild(div);
    }

    function addBtn(innerText, url, warning = false) {
        const btn = document.createElement("div");
        btn.className = warning ? "bbtn cclose"/*只是红色，并非关闭*/ : "bbtn llink";
        btn.innerText = innerText;
        btn.addEventListener("click", () => openInTab(url));
        noticeContainer.appendChild(document.createElement("div")).appendChild(btn);
    }

    function addCloseBtn() {
        const btn = document.createElement("div");
        btn.className = "bbtn cclose";
        btn.innerText = "关闭";
        btn.addEventListener("click", () => noticeDialogObj.close());
        noticeContainer.appendChild(document.createElement("div")).appendChild(btn);
    }

    async function searchHandler(event) {
        separate(textInput.value, false, true);
        let keyword = textInput.value;
        if (keyword === "") {
            return;
        }
        let selected = [];
        let inputs;
        let currentMap;
        let type = event.target.id;
        if ("jav_cen" === type) {
            showNotice("正在搜索...<br/>可搜索：aaa-111、111aaaa-111，含中文字幕、无码破解。");
            inputs = document.getElementById("cen_pick_form").getElementsByTagName("input");
            currentMap = cenMap;
        } else {
            showNotice("正在搜索...<br/>可搜索：111111、111111-111、n1111、heyzo-111。");
            inputs = document.getElementById("unc_pick_form").getElementsByTagName("input");
            currentMap = uncMap;
        }
        for (let input of inputs) {
            if (input.checked) {
                selected.push(input.id);
            }
        }
        if (selected.length === 0) {
            appendNotice("未至少选择一个搜索引擎。", true);
            return;
        }
        //用于判断是否在过程中出错，如果出错就不关闭通知
        let error = false;
        let blockedList = [];
        //无码结果集，二维数组
        let uncResults = [];
        let addUncResults = (index, itemPage, itemInfo) => {
            if (!uncResults[index]) {
                uncResults[index] = [];
            }
            uncResults[index].push({itemPage: itemPage, itemInfo: itemInfo});
        };
        //无码破解版本的结果集
        let results0 = [];
        //中文字幕版本的结果集
        let results1 = [];
        //有结果就放进去
        let results2 = [];
        const resultOrder = [results0, results1, results2];
        const btnOrder = ["无码破解", "中文字幕", "普通视频"];
        startNewCount(selected.length, async () => {
            let foundResult = false;
            if (blockedList.length > 0) {
                for (let i = 0; i < blockedList.length; i++) {
                    if (blockedList[i]) {
                        let resultPage = currentMap.get(selected[i]).url;
                        addBtn(resultPage.split("/")[2] + "被拦截，点我去人机验证"
                            , resultPage.replace("%s", keyword)
                            , true);
                    }
                }
            }
            if ("jav_cen" === type) {
                console.log(results0);
                console.log(results1);
                console.log(results2);
                //按往网站分类
                for (let i = 0; i < selected.length; i++) {
                    let haveTitle = false;
                    //获取每种类型的结果
                    for (let j = 0; j < resultOrder.length; j++) {
                        let results = resultOrder[j];
                        if (results[i]) {
                            if (!haveTitle) {
                                haveTitle = true;
                                addTitle(currentMap.get(selected[i]).url.split("/")[2]);
                            }
                            foundResult = true;
                            addBtn(btnOrder[j], results[i]);
                        }
                    }
                }
                if (foundResult) {
                    addCloseBtn();
                }
            } else {
                if (uncResults.length > 0) {
                    console.log(uncResults);
                    foundResult = true;
                    for (let uncResultsF2 of uncResults) {
                        if (!uncResultsF2) {
                            continue;
                        }
                        let haveTitle = false;
                        for (let result of uncResultsF2) {
                            if (!haveTitle) {
                                haveTitle = true;
                                addTitle(result.itemPage.split("/")[2]);
                            }
                            addBtn(result.itemInfo, result.itemPage);
                        }
                    }
                    addCloseBtn();
                }
            }
            //如果未找到结果，则尝试谷歌搜索
            if (!foundResult) {
                appendNotice("未找到结果，可以尝试谷歌搜索。", true);
                addBtn(`去谷歌搜索${keyword}`
                    , `https://www.google.com/search?q=${keyword}%20jav`, true);
            }
        });
        for (let i = 0; i < selected.length; i++) {
            /*多线程
            checkCF并不会阻碍其他搜索引擎，只是不触发最终结果汇总（count不加到预期值）*/
            crawl(currentMap.get(selected[i]), keyword, i);
        }
        //在一次搜索结束后不再通知授权
        setTmValue("old_user", true);
        oldUser = true;

        async function crawl(engine, id, index = 0/*用于结果排序*/, once = false) {
            //在爬取过程需要嵌套爬取时，跳过请求完成计数
            let url = engine.url;
            let urlSplit = url.split("/");
            let host = urlSplit[2];
            let topLevelSite = urlSplit[0] + "//" + host;
            if (/missav/.test(topLevelSite)) {
                //需要将mgs格式改为常规格式
                if (/^[0-9]+[a-z]+-[0-9]+$/i.test(id)) {
                    id = id.replace(/[0-9]*(?=[a-z])/i, "");
                }
            }
            url = url.replace("%s", id);
            console.log("正在爬取：" + url);
            let headers = {Host: host, Origin: topLevelSite};
            if (/7mmtv/.test(topLevelSite)) {
                headers["content-type"] = "application/x-www-form-urlencoded";
            }
            let timeout = 5000;
            //给新用户授权的时间
            if (!oldUser && location.origin !== topLevelSite) {
                await checkUser();
                timeout = 15000;
            }
            //已经超时强制中断的不再显示请求超时的通知
            let aborted = false;
            return new Promise((resolve/*改成多线程后，返回什么都无所谓了*/) => {
                let connectTimeout = true;
                let promise = GM_xmlhttpRequest({
                    method: engine.reqMethod,
                    url: url,
                    //data为空时必须传null
                    data: engine.payload ? engine.payload.replace("%s", id) : null,
                    timeout: timeout,
                    headers: headers,
                    cookiePartition: {
                        topLevelSite: topLevelSite
                    },
                    onload: async function (xhr) {
                        if (aborted) {
                            return;
                        }
                        const meetCF = async function () {
                            switch (await checkCF(xhr)) {
                                case 0:
                                    return false;
                                case 2:
                                    blockedList[index] = true;
                                case 1:
                                    error = true;
                                    !once && count.value++;
                                    resolve(false);
                                    return true;
                            }
                        };
                        connectTimeout = false;
                        let finalUrl = xhr.finalUrl;
                        let finalUrlSplit = finalUrl.split("/");
                        let finalHost = finalUrlSplit[2];
                        let finalOrigin = finalUrlSplit[0] + "//" + finalHost;
                        try {
                            let _id = id;
                            //不支持模糊搜索，需要完全匹配
                            if (/[a-z]/i.test(_id)) {
                                _id = `(?<![a-z])${_id}(?![0-9])`;
                            } else {
                                //如果是纯数字的番号，不要只匹配到几个数字
                                _id = `(?<![a-z0-9])${_id}(?![0-9])`;
                            }
                            //7mm cne unc
                            if (/7mmtv/.test(finalUrl)) {
                                //<a  target="_top"   href="https://7mmtv.sx/zh/chinese_content/56350/VEC-697.html">[中字]VEC-697 与一个美丽的...</a>
                                let urlReg = new RegExp(`"(${finalOrigin}/zh/[^/]+_content/[^/]*/[^\\.]*${_id}.html)">([^<]*)</a>`, "gi");
                                let matchArray = xhr.responseText.matchAll(urlReg);
                                let found = false;
                                for (let match of matchArray) {
                                    found = true;
                                    if ("jav_unc" === type) {
                                        addUncResults(index, match[1], match[2]);
                                    } else {
                                        results2[index] = match[1];
                                        if (match[1].search(/chinese/) >= 0) {
                                            results1[index] = match[1];
                                        }
                                        if (match[1].search(/reducing/) >= 0) {
                                            results0[index] = match[1];
                                        }
                                    }
                                }
                                found ? resolve(true) : resolve(false);
                            }
                            //jav777 cen
                            else if (/jav777/.test(finalUrl)) {
                                //搜索页
                                if (/\?s=/.test(finalUrl)) {
                                    //<h2 class="post-title"><a href="https://..."
                                    let regString = `post-title"><a href="([^"]*)"`;
                                    let matches = xhr.responseText.matchAll(new RegExp(regString, "gi"));
                                    let found = false;
                                    for (let match of matches) {
                                        console.log(`嵌套爬取：${match[1].replace("%s", id)}`);
                                        if (await crawl({
                                            url: match[1],
                                            reqMethod: "get"
                                        }, id/*需要还没添加规则的id，避免重复添加*/, index, true)) {
                                            results1[index] = match[1];
                                            found = true;
                                            break;
                                        }
                                    }
                                    found ? resolve(true) : resolve(false);
                                }
                                //详情页
                                else if (finalUrl.includes(".html")) {
                                    if (xhr.responseText.search(`【番號】︰[^<]*${_id}<br />`) > 0) {
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                            }
                            //supjav cen unc
                            else if (/supjav/.test(finalUrl)) {
                                if (await meetCF()) return;
                                //case为0时将继续运行
                                //href="https://supjav.com/zh/147335.html" title="FC2PPV 2753411 * Apricot...
                                let reg = new RegExp(`"(${finalOrigin}/zh/[0-9]+.html)" title="([^"]*${_id}[^"]*)"`, "gi");
                                let matches = xhr.responseText.matchAll(reg);
                                let found = false;
                                for (let match of matches) {
                                    found = true;
                                    if ("jav_unc" === type) {
                                        addUncResults(index, match[1], match[2]);
                                    } else {
                                        results2[index] = match[1];
                                        if (match[0].search(/无码破解|无码流出|無修正/) >= 0) {
                                            results0[index] = match[1];
                                        }
                                        if (match[0].search(/中文字幕/) >= 0) {
                                            results1[index] = match[1];
                                        }
                                    }
                                }
                                found ? resolve(true) : resolve(false);
                            }
                            //missav cen unc
                            else if (/missav/.test(finalUrl)) {
                                if (await meetCF()) return;
                                if (/排序/.test(xhr.responseText)) {
                                    //有排序选项表示存在结果
                                    /*
                                    <img
                                    x-cloak
                                    :class="{ hidden: showPreview === '01ae1d7c-e420-46c0-b1d6-b66b70fac0e1' || holdPreviews.includes('01ae1d7c-e420-46c0-b1d6-b66b70fac0e1') }"
                                                            class="lozad w-full"
                                        data-src="https://fourhoi.com/seven-016-uncensored-leak/cover-t.jpg"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN09omrBwADNQFuUCqPAwAAAABJRU5ErkJggg=="
                                                        alt="一对在酒吧被抓住的女孩。这个故事讲述了一个肉食爱好者长者在性爱后醒来，被跨坐在他身上的谦虚短小者所吸引。文乃五月"
                                            >
                                        </a>
                                            <a href="https://missav.ai/cn/seven-016-uncensored-leak" alt="seven-016-uncensored-leak">
                                    <span class="absolute bottom-1 left-1 rounded-lg px-2 py-1 text-xs text-nord5 bg-blue-800 bg-opacity-75">
                                        无码影片
                                    </span>
                                    </a>
                                        <a href="https://missav.ai/cn/seven-016-uncensored-leak" alt="seven-016-uncensored-leak" >
                                                    <span class="absolute bottom-1 right-1 rounded-lg px-2 py-1 text-xs text-nord5 bg-gray-800 bg-opacity-75">
                                        1:11:58
                                    </span>
                                            </a>
                                    </div>
                                    <div class="my-2 text-sm text-nord4 truncate">
                                <a
                                    class="text-secondary group-hover:text-primary"
                                    href="https://missav.ai/cn/seven-016-uncensored-leak"
                                    alt="seven-016-uncensored-leak"
                                                    >
                                    SEVEN-016 一对在酒吧被抓住的女孩。这个故事讲述了一个肉食爱好者长者在性爱后醒来，被跨坐在他身上的谦虚短小者所吸引。文乃五月 - 沙月ふみの
                                        </a>
                                    </div>
                                    </div>
                                    */
                                    let reg = new RegExp(`<img([\\s\\S](?!<img))*truncate">\\s*<a[^>]*href="([^"]*)"[^>]*>\\s*([^<]*${_id}[^<]*)\\s*</a>`, "ig");
                                    let matches = xhr.responseText.matchAll(reg);
                                    let found = false;
                                    for (let match of matches) {
                                        found = true;
                                        if ("jav_cen" === type) {
                                            results2[index] = match[2];
                                            if (/中文字幕/.test(match[0])) {
                                                results1[index] = match[2];
                                            }
                                            if (/无码影片/.test(match[0])) {
                                                results0[index] = match[2];
                                            }
                                        } else {
                                            addUncResults(index, match[2], match[3]);
                                        }
                                    }
                                    found ? resolve(true) : resolve(false);
                                } else {
                                    resolve(false);
                                }
                            }
                            //jable cen
                            else if (/jable/.test(finalUrl)) {
                                if (await meetCF()) return;
                                if (/search/.test(finalUrl)) {
                                    //<a href="https://jable.tv/videos/miab-304/">MIAB-304...
                                    let regString = `<a href="([^"]*)">[^<]*${_id}[^<]*<`;
                                    let urls = xhr.responseText.match(new RegExp(regString, "i"));
                                    if (urls) {
                                        results2[index] = finalUrl;
                                        console.log(`嵌套爬取：${urls[1]}`);
                                        await crawl({url: urls[1], reqMethod: "get"}, "", index, true);
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                } else if (/videos/.test(finalUrl)) {
                                    let cn = xhr.responseText.match(new RegExp("已更新至中文字幕版"));
                                    if (cn) {
                                        results1[index] = finalUrl;
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                            }
                            //guru unc
                            else if (/guru/.test(finalUrl)) {
                                /*
                                <a href="https://jav.guru/320706/101323-001-carib...">
                                <img src="..." alt="[101323-001-CARIB] Caribbeancom 101323-001 ...">
                                </a>
                                * */
                                let regString = `<a href="([^"]*${_id}[^"]*)">\\s+<img[^>]*alt="([^"]*)"`;
                                let matches = xhr.responseText.matchAll(new RegExp(regString, "gi"));
                                let found = false;
                                for (let match of matches) {
                                    found = true;
                                    addUncResults(index, match[1], match[2]);
                                    resolve(true);
                                }
                                found ? resolve(true) : resolve(false);
                            }
                            //123av unc
                            else if (/123av/.test(finalUrl)) {
                                if (await meetCF()) return;
                                /*
                                <div class="detail">
                                <a href="dm14/v/1pondo-062822_001">1Pondo-062822_001 - 款待〜为男人提供深喉口交的女性〜</a>
                                </div>
                                * */
                                let regString = `<div class="detail">\\s<a href="([^"]*${_id}[^"]*)">([^<]*)</a>`;
                                let matches = xhr.responseText.matchAll(new RegExp(regString, "gi"));
                                let found = false;
                                for (let match of matches) {
                                    found = true;
                                    addUncResults(index, finalOrigin + "/zh/" + match[1], match[2]);
                                }
                                found ? resolve(true) : resolve(false);
                            }
                            //没有匹配域名，被重定向到其他域名，搜索失败
                            else {
                                error = true;
                                appendNotice("错误：被重定向，请更换代理。原域名："
                                    + host + "，重定向域名：" + finalHost, true);
                                resolve(false);
                            }
                        } catch (e) {
                            error = true;
                            appendNotice(`错误：${url}，请联系开发者。<br/>${e.name}:${e.message}`, true);
                            resolve(false);
                            throw e;
                        }
                        console.log(`${host}爬取完成。`);
                        !once && count.value++;
                    },
                    ontimeout: function () {
                        connectTimeout = false;
                        if (!aborted) {
                            error = true;
                            appendNotice("超时：" + host, true);
                            console.log("超时：" + host);
                            !once && count.value++;
                            resolve(false);
                        }

                    },
                    onerror: function () {
                        error = true;
                        connectTimeout = false;
                        appendNotice("错误：" + host + "，机场不行或网站挂了。", true);
                        console.log("错误：" + host + "，机场不行或网站挂了。");
                        !once && count.value++;
                        resolve(false);
                    }
                });
                setTimeout(() => {
                    promise.abort();
                    if (connectTimeout) {
                        error = true;
                        aborted = true;
                        appendNotice("超时强制中断：" + host, true);
                        console.log("超时强制中断：" + host);
                        !once && count.value++;
                        resolve(false);
                    }
                }, timeout);
            });
        }
    }

    async function sampleHandler() {
        if (!separate(textInput.value, false, true)) {
            return;
        }
        let id = textInput.value.toLowerCase();
        //正则
        let common_reg = /^[a-z]+[0-9]*[a-z]*-[a-z]*[0-9]+$/i;
        let heyzo_reg = /^heyzo-?[0-9]+$/i;
        let gachi_reg = /^gachi[a-z]*-?[a-z]*[0-9]+$/i;
        let mgs_reg = /^[0-9]+[a-z]+-[0-9]+$/i;
        let fc2_reg = /^[0-9]{6,7}$/;
        let carib_reg = /^[0-9]{6}-[0-9]{3}$/;
        let heyzo_k8_tokyoHot4_reg = /^[0-9]{4}$/;
        let paco_1p_caribpr_reg = /^[0-9]{6}_[0-9]{3}$/;
        let _10m_reg = /^[0-9]{6}_[0-9]{2}$/;
        let nyoshin_tokyoHotN_reg = /^n[0-9]{4}$/i;
        let xxxav_reg = /^[0-9]{5}$/;
        let other_reg = /^[a-z]+[0-9]+$/i;
        //网址
        /*
        有些是搜索页，有些直接是详情页
        基本涵盖所有番号的视频预览自动播放
        全是get请求
        */
        let trailer = "https://javtrailers.com/search/%s";
        let jav24 = "https://www.jav24.com/?q=%s";
        let mgs_player = "https://www.mgstage.com/sampleplayer/sampleRespons.php?pid=";/*这里不能加%s，不需要替换id*/
        let mgs = "https://www.mgstage.com/product/product_detail/%s/";
        let javten = "https://javten.com/tw/search?kw=%s";//自动重定向，比fc2官网更快更稳
        let fc2 = "https://adult.contents.fc2.com/article/%s/";
        let carib = "https://en.caribbeancom.com/eng/moviepages/%s/index.html";
        let caribpr = "https://en.caribbeancompr.com/moviepages/%s/index.html";
        let heyzo = "https://en.heyzo.com/moviepages/%s/index.html";
        let paco_1p_10_template = "/movies/%s/";
        let _1pondo_data = "https://en.1pondo.tv/dyn/phpauto/movie_details/movie_id/%s.json";
        let pacopacomama_data = "https://en.pacopacomama.com/dyn/phpauto/movie_details/movie_id/%s.json";
        let _10musume_data = "https://en.10musume.com/dyn/phpauto/movie_details/movie_id/%s.json";
        let nyoshin = "https://en.nyoshin.com/moviepages/%s/index.html";
        let kin8tengoku = "https://en.kin8tengoku.com/moviepages/%s/index.html";
        let xxxav = "https://en.xxx-av.com/mov/movie/%s/";
        let tokyoHot_result = "https://my.tokyo-hot.com/product/?q=%s";
        let tokyoHot_product = "https://my.tokyo-hot.com/product/%s/";
        let tokyoHot_sample = "https://my.cdn.tokyo-hot.com/media/samples/%s.mp4";
        //只搜索dvd部分，ppv没一个能看的
        let ave = "https://www.aventertainments.com/search_Products.aspx?languageID=1&keyword=%s";
        let javdb = "https://javdb.com/search?q=%s&f=all";
        //无声视频预览，官网经常没有预览视频或者需要日本ip，所以用盗版网站的自制预览作为替代
        /*url: "https://7mmtv.sx/zh/searchform_search/all/index.html",
            reqMethod: "post",
            payload: "search_keyword=%s&search_type=searchall&op=search"*/
        let _7mmtv = "https://7mmtv.sx/zh/searchform_search/all/index.html";
        let _123av = "https://123av.com/zh/search?keyword=%s";
        //miss在搜索时如果没有-会自动添加，而且是在服务器添加的，这导致部分存在的结果，一搜索却不存在了
        let missav = "https://missav.ai/cn/search/%s";
        let silentSamples = [_7mmtv, _123av, missav];
        let needSilentSample = true;
        let notice_text = "正在搜索...<br/>搜索前请先确认番号的准确性。<br/>部分预览视频需要日本ip。";
        //爬取过程中出错将不会关闭通知模态框
        let error = false;
        let blockedList = [];
        //爬取结果集，有序的，获取结果需要遍历判断undefined
        let results = [];
        let silentResults = [];
        let addResult = function (index, productPage, videoSrc = "") {
            results[index] = {productPage: productPage, videoSrc: videoSrc};
        };
        let addSilentResult = function (index, resultPage, videoSrc, videoText) {
            !silentResults[index] && (silentResults[index] = {resultPage: resultPage, videoInfoArray: []});
            silentResults[index].videoInfoArray.push({src: videoSrc, text: videoText});
        };
        let dealOneResult = function () {
            addTitle("官网/资讯站");
            if (results[0].videoSrc) {
                showVideo(results[0].videoSrc, true);
            }
            let pg = results[0].productPage;
            addBtn(pg.split("/")[2], pg);
            addCloseBtn();
        }
        showNotice(notice_text);
        //SKYHD-156(ave) NATR-749 MKD-015(ave列表外) RED-183(tokyo-hot大小写敏感，小写没有视频)
        if (common_reg.test(id) && !heyzo_reg.test(id) && !gachi_reg.test(id)) {
            //ave常规格式番号前缀，优先爬取，提升搜索速度
            const aveIds = ["sky", "skyhd", "cwp", "cwpbd", "lldv", "laf", "lafbd", "hey", "ccdv", "ssdv",
                "smd", "smdv", "smbd", "pt", "bt", "s2m", "s2mbd", "mmdv", "mcdv", "mcbd", "mxx",
                "drc", "drg", "drgbd", "dsam", "dsamd", "dsambd", "rhj", "jav", "pink"];
            let prefix = id.split("-")[0].toLowerCase();
            if (aveIds.includes(prefix)) {
                //前缀与aveId匹配，直接在ave搜索，然后终止方法
                if (await crawl(ave)) {
                    dealOneResult();
                } else {
                    nothing();
                }
            } else if (/red/i.test(prefix)) {
                id = id.toUpperCase();
                if (await crawl(tokyoHot_product)) {
                    dealOneResult();
                } else {
                    nothing();
                }
            } else {
                await crawlList([trailer, jav24, ave/*没归纳的无码*/, javdb/*锁ip，有无码内容，放后面补充*/]);
            }
        }
        //200GANA-3166
        else if (mgs_reg.test(id)) {
            await crawlList([jav24, mgs/*需要日本ip*/]);
        }
        //6到7位纯数字 4668750
        else if (fc2_reg.test(id)) {
            needSilentSample = false;
            crawlSilentSamples(() => {
                addBtn("去javten查看", javten.replace("%s", id));
                addBtn("跳转到官网", fc2.replace("%s", id));
            });
        }
        //6位-3位 041525-001
        else if (carib_reg.test(id)) {
            if (await crawl(carib)) {
                dealOneResult();
            } else {
                nothing();
            }
        }
        //6位_2位 040825_01
        else if (_10m_reg.test(id)) {
            if (await crawl(_10musume_data)) {
                dealOneResult();
            } else {
                nothing();
            }
        }
        //纯4位数字的heyzo等 1234 5271(tokyo-hot实际是n0274，链接却是四位数)
        else if (heyzo_k8_tokyoHot4_reg.test(id)) {
            needSilentSample = false;
            await crawlList([heyzo, kin8tengoku, tokyoHot_product]);
        }
        //纯5位数字 24293
        else if (xxxav_reg.test(id)) {
            if (await crawl(xxxav)) {
                dealOneResult();
            } else nothing();
        }
        //没有官网，直接搜索无声预览
        else if (gachi_reg.test(id)) {
            appendNotice("这片商官网没了。", true);
            //有连接符的获取连接符后的内容，没有的不修改，这是为了匹配无声预览那些结果的写法
            if (id.includes("-")) {
                id = "gachi" + id.match(/-(.*)/)[1];
            }
            //由无声预览搜索此番号
        }
        //带前缀heyzo的 HEYZO-3566 heyzo3566
        else if (heyzo_reg.test(id)) {
            //没有-的补上，取数字部分在crawl方法内进行不然，无声预览也会使用4位数字搜索
            id = "heyzo-" + id.match(/[0-9]+/)[0];
            if (await crawl(heyzo)) {
                dealOneResult();
            } else nothing();
        }
        //6位_3位 060624_001 041525_100 040525_001
        else if (paco_1p_caribpr_reg.test(id)) {
            await crawlList([_1pondo_data, pacopacomama_data, caribpr]);
        }
        //n开头加4位数字 n2348(nyoshin) n0274(product拼接不行)
        else if (nyoshin_tokyoHotN_reg.test(id)) {
            await crawlList([tokyoHot_result, nyoshin]);
        }
        //其他字母加数字形式 lb0017(tokyo-hot但是搜索不到，拼链接也不行) kb1737(tokyo-hot) ki250311(specialProducers)
        else if (other_reg.test(id) && !nyoshin_tokyoHotN_reg.test(id) && !heyzo_reg.test(id) && !gachi_reg.test(id)) {
            //明确片商则无需重复打开
            //H4610-ki250304 伊瓦基·希恩（Iwaki Shion），21岁
            if (currentSP) {
                if (await crawl(specialProducers[currentSP])) {
                    dealOneResult();
                }
            } else {
                //tokyoHot存在一个有另一个没有的情况
                let list = [tokyoHot_result, tokyoHot_product, nyoshin].concat(Object.values(specialProducers));
                await crawlList(list);
            }
        }
        //其余形式未收录
        else {
            needSilentSample = false;
            showNotice("输入错误或未收录该番号。");
        }
        if (needSilentSample) {
            appendNotice("正在搜索无声预览视频...");
            crawlSilentSamples();
        }
        //在一次搜索结束后不再通知授权，前面如果有使用crawl()，不能在使用crawl后还return，此处必须执行
        setTmValue("old_user", true);
        oldUser = true;

        function showVideo(url, first) {
            let video = document.createElement("video");
            video.controls = true;
            video.loop = true;
            video.style.width = "100%";
            video.style.marginBottom = "1px";
            video.style.marginTop = "10px";
            first && (video.autoplay = true);
            // 检查是否是 HLS 流
            let isHlsStream = url.toLowerCase().endsWith('.m3u8');
            // 如果是首次加载且是 HLS 流并且 hls.js 尚未加载，则动态加载 hls.js
            if (first && isHlsStream && !hlsJsLoaded) {
                let script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.2';
                script.type = 'text/javascript';
                script.onload = function () {
                    console.log('hls.js 加载完成');
                    if (Hls.isSupported()) {
                        console.log("首次加载m3u8视频。");
                        hlsSupported = true;
                        loadHlsVideo(url, video);
                    } else {
                        console.log("此浏览器不支持 hls.js");
                    }
                    hlsJsLoaded = true; // 设置标志表示 hls.js 已加载
                };
                noticeContainer.parentElement.prepend(script);
            } else {
                // 对于非首次加载或非 HLS 流的情况
                if (isHlsStream && hlsSupported) {
                    console.log("加载m3u8视频中...");
                    loadHlsVideo(url, video);
                } else {
                    // 直接设置 src 属性播放普通视频
                    video.src = url;
                }
            }
            let div = document.createElement('div');
            div.style.position = "relative";
            div.style.display = "flex";
            noticeContainer.appendChild(div).appendChild(video);

            function loadHlsVideo(url, video) {
                let hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
            }
        }

        function replaceAndOpen(url) {
            !error && hideNotice();
            window.setTimeout(() => {
                openInTab(url.replace("%s", id));
            }, 300);
        }

        //除了常规格式番号，无声预览会展示同一个网站下的多个同番号结果，因为有些番号一样但内容不一样
        //另外mgs格式会被转为常规格式搜索
        //060624_001
        function crawlSilentSamples(finishHandler) {
            startNewCount(silentSamples.length, () => {
                if (blockedList.length > 0) {
                    for (let i = 0; i < blockedList.length; i++) {
                        if (blockedList[i]) {
                            addBtn(silentSamples[i].split("/")[2] + "被拦截，点我去人机验证"
                                , silentSamples[i].replace("%s", id)
                                , true);
                        }
                    }
                }
                if (silentResults.length === 0) {
                    if (noticeContainer.innerHTML) {
                        appendNotice("未找到无声预览视频。", true);
                    } else {
                        nothing();
                    }
                } else {
                    console.log(silentResults);
                    for (let i = 0, open = 0; i < silentResults.length; i++) {
                        if (silentResults[i]) {
                            let haveTitle = false;
                            for (let videoInfo of silentResults[i].videoInfoArray) {
                                let pageHost = silentResults[i].resultPage.split("/")[2];
                                if (/7mmtv/.test(pageHost)) {
                                    //此页面需要form表单搜索，给链接传一个id，在弹窗内用js提交表单
                                    silentResults[i].resultPage += `#${id}`;
                                }
                                if (!haveTitle) {
                                    addTitle(pageHost);
                                    haveTitle = true;
                                }
                                showVideo(videoInfo.src, (open === 0 && !noticeContainer.querySelector("video")));
                                if (heyzo_k8_tokyoHot4_reg.test(id)
                                    || paco_1p_caribpr_reg.test(id)
                                    || other_reg.test(id)) {
                                    addBtn(videoInfo.text, silentResults[i].resultPage);
                                }
                                addCloseBtn();
                                open++;
                            }
                        }
                    }
                }
                finishHandler && finishHandler();
            });
            if (mgs_reg.test(id)) {
                id = id.match(/[a-z]+-[0-9]+/i);
            }
            for (let i = 0; i < silentSamples.length; i++) {
                crawl(silentSamples[i], i, false);
            }
        }

        async function crawlList(brands) {
            return await new Promise((resolve) => {
                startNewCount(brands.length, () => {
                    if (results.length > 0) {
                        addTitle("官网/资讯站");
                        console.log(results);
                        //需要fori用于判断是不是第一个视频自动播放
                        for (let i = 0, open = 0; i < results.length; i++) {
                            if (results[i]) {
                                let videoSrc = results[i].videoSrc;
                                let productPage = results[i].productPage;
                                let btnText = productPage.split("/")[2];
                                if (/javtrailer/.test(productPage)) {
                                    btnText = "点我跳转到javtrailers.com，原网页播放无需日本ip";
                                }
                                if (videoSrc) {
                                    showVideo(videoSrc, open === 0);
                                    open++;
                                }
                                productPage && addBtn(btnText, productPage);
                                videoSrc && addCloseBtn();
                            }
                        }
                        resolve(true);
                    } else {
                        nothing();
                        resolve(false);
                    }
                });
                for (let i = 0; i < brands.length; i++) {
                    crawl(brands[i], i/*对应数组索引*/, false);
                }
            });
        }

        //爬取搜索结果或详情页中是否包含预览视频或图片
        async function crawl(url, index = 0, once = true) {
            //在爬取过程需要嵌套爬取时，跳过请求完成计数
            let ignore = false;
            let urlSplit = url.split("/");
            let host = urlSplit[2];
            let topLevelSite = urlSplit[0] + "//" + host;
            let _id = id;
            if (/mgstage\.com/.test(topLevelSite)) {
                _id = _id.toUpperCase();
            } else if (/jav24/.test(topLevelSite)) {
                if (mgs_reg.test(id)) {
                    _id = _id.match(/[a-z]+-[0-9]+/i)[0];
                }
            } else if (/heyzo/.test(topLevelSite)) {
                _id = _id.match(/[[0-9]+/i)[0];
            }
            url = url.replace("%s", _id);
            console.log("正在爬取：" + url);
            let payload = null;
            if (/7mmtv/.test(url)) {
                payload = "search_keyword=%s&search_type=searchall&op=search".replace("%s", _id);
            }
            let method = "get";
            if (/tokyo-hot.*samples/.test(url)) {
                //head请求可以不下载视频，直接返回响应头信息
                method = "head";
            } else if (/7mmtv/.test(url)) {
                method = "post";
            }
            //默认超时时间
            let timeout = 5000;
            if (/aventertainments.*search/.test(url)) {
                //响应太慢了，实际上可以访问
                timeout = 7000;
            } else if (/tokyo-hot.*product/.test(url)) {
                timeout = 7000;
            }
            //给新用户授权的时间
            if (!oldUser && location.origin !== topLevelSite) {
                await checkUser();
                timeout = 15000;
            }
            let headers = {Host: host, Origin: topLevelSite};
            if (/tokyo-hot.*q=/.test(url)) {
                headers["user-agent"] = "windows";
            } else if (/mgstage\.com/.test(url)) {
                //移动端的响应不一样
                headers["user-agent"] = "windows";
            } else if (/7mmtv/.test(url)) {
                headers["content-type"] = "application/x-www-form-urlencoded";
            }
            let cookie = "";
            if (/mgstage\.com/.test(topLevelSite)) {
                cookie = "adc=1;";
            }
            //已经超时强制中断的不再显示请求超时的通知
            let aborted = false;
            return new Promise((resolve) => {
                let connectTimeout = true;
                let promise = GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    data: payload,
                    timeout: timeout,
                    headers: headers,
                    cookie: cookie,
                    cookiePartition: {
                        topLevelSite: topLevelSite
                    },
                    onload: async function (xhr) {
                        if (aborted) {
                            return;
                        }
                        let meetCF = async function () {
                            switch (await checkCF(xhr)) {
                                case 0:
                                    return false;
                                case 2:
                                    blockedList[index] = true;
                                case 1:
                                    error = true;
                                    !once && count.value++;
                                    resolve(false);
                                    return true;
                            }
                        };
                        let dealSilentResult = function (reg, srcIndex, infoIndex) {
                            let matches = xhr.responseText.matchAll(new RegExp(reg, "gi"));
                            let haveMatch = false;
                            if (/7mmtv/.test(finalUrl) && common_reg.test(id)) {
                                let isMgs = false;
                                let firstMatch;
                                //修复7mm的mgs番号删减数字部分时，预览链接错误 SGKI-038
                                for (const match of matches) {
                                    haveMatch = true;
                                    if (!firstMatch) {
                                        firstMatch = match;
                                    }
                                    if (new RegExp(`[0-9]+${_id}`, "i").test(match[srcIndex])) {
                                        isMgs = true;
                                        addSilentResult(index, finalUrl, match[srcIndex], match[infoIndex]);
                                        break;
                                    }
                                }
                                if (!isMgs && firstMatch) {
                                    addSilentResult(index, finalUrl, firstMatch[srcIndex], firstMatch[infoIndex]);
                                }
                            } else {
                                for (const match of matches) {
                                    haveMatch = true;
                                    addSilentResult(index, finalUrl, match[srcIndex], match[infoIndex]);
                                    if (common_reg.test(id)) {
                                        //常规格式的番号结果有些是字幕和无码版本，对预览来说无区别，保存一个即可
                                        break;
                                    }
                                }
                            }
                            if (haveMatch) {
                                resolve(true);
                            } else {
                                //爬搜索引擎的无声视频，没有视频什么都不用放
                                resolve(false);
                            }
                        };
                        connectTimeout = false;
                        let finalUrl = xhr.finalUrl;
                        let finalHost = finalUrl.split("/")[2];
                        try {
                            /*
                            需要正则匹配的话，都得从开发者工具的网络工具中查看源码，不能在元素工具查看，不然会出现错误
                            注意id如cap-111和ap-11是不一样的
                            注意.不能替代[\\s\\S]，同时浏览器有格式化功能，是否存在换行符需要看源码格式
                            */
                            //404未找到
                            if (xhr.status === 404) {
                                //404并不是错误，而是没有结果的意思
                                console.log(`404：${xhr.finalUrl}`);
                                resolve(false);
                            }
                            //caribbeancom和caribbeancompr，会404
                            else if (/caribbeancom/.test(finalUrl)) {
                                //https://en.caribbeancompr.com/moviepages/040525_001/index.html
                                //"sample_flash_url":"https:\/\/smovie.caribbeancompr.com\/sample\/movies\/040525_001\/480p.mp4"
                                //https://en.caribbeancom.com/eng/moviepages/041525-001/index.html
                                //"sample_flash_url":"https:\/\/smovie.caribbeancom.com\/sample\/movies\/041525-001\/480p.mp4"
                                //"sample_m_flash_url":"https:\/\/smovie.caribbeancom.com\/sample\/movies\/041525-001\/sample_m.mp4"
                                let nothing = false;
                                if (/com\./.test(finalUrl)) {
                                    //即使胡编乱造的id也不会404，而是写着过期了，判断标题为空的就是这种
                                    if (xhr.responseText.search(/<title>\s+-\s+Caribbeancom.com<\/title>/i) > 0) {
                                        nothing = true;
                                        resolve(false);
                                    }
                                }
                                if (!nothing) {
                                    let reg = new RegExp(`flash_url":"([^"]+mp4)"`, "i");
                                    let match = xhr.responseText.match(reg);
                                    addResult(index, finalUrl, match ? match[1].replaceAll("\\", "") : "");
                                    resolve(true);
                                }
                            }
                            //pacopacomama|1pondo|10musume，会404
                            else if (/pacopacomama|1pondo|10musume/.test(finalUrl)) {
                                /*
                                "SampleFiles": [
                                {
                                ...
                                "URL": "https://smovie.1pondo.tv/sample/movies/060624_001/240p.mp4"
                                * */
                                let reg = new RegExp(`SampleFiles[\\s\\S]*? "URL": "([^"]+mp4)"`/*最低清晰度*/, "i");
                                let match = xhr.responseText.match(reg);
                                let page = topLevelSite + paco_1p_10_template.replace("%s", id);
                                addResult(index, page, match ? match[1] : "");
                                resolve(true);
                            }
                            //ave结果，常规格式无码
                            else if (/aventertainments/.test(finalUrl)) {
                                /*
                                详情页https://www.aventertainments.com/40676/2/29/product_lists
                                商品番号 SMBD-18
                                源码 <span class="title">商品番号</span><span class="tag-title">SMBD-18</span>
                                */
                                if (/lists/.test(finalUrl)) {
                                    let searchWord = new RegExp(`<span class="tag-title">${_id}</span>`, "i");
                                    if (xhr.responseText.search(searchWord) === -1) {
                                        resolve(false);
                                    } else {
                                        //<source src="... .m3u8"
                                        let reg = /<source src="([^"]*)"/i;
                                        let match = xhr.responseText.match(reg);
                                        addResult(index, finalUrl, match ? match[1] : "");
                                        resolve(true);
                                    }
                                }
                                /*搜索页 https://www.aventertainments.com/search_Products.aspx?keyword=SMBD-18
                                single-slider-product是存在结果时响应中存在的class*/
                                else if (xhr.responseText.search(/single-slider-product/i) === -1) {
                                    resolve(false);
                                }
                                /*
                                即使有结果，该结果未必是搜索的番号，比如搜索bc会出现abc的结果
                                并且从响应中无法判断是否完全匹配，需要再到详情页比较避免搜索错误，这也是ave搜索慢的原因
                                搜索结果中的详情页url https://www.aventertainments.com/40676/2/29/product_lists
                                */
                                else {
                                    //爬取所有结果是否是与id匹配的
                                    let matches = xhr.responseText.match(/https:\/\/www.aventertainments.com.*?product_lists/gi);
                                    let urlSet = new Set();
                                    for (let m of matches) {
                                        //很多有重复的
                                        urlSet.add(m);
                                    }
                                    let beFound;
                                    for (let url of urlSet) {
                                        console.log(`嵌套爬取：${url}`);
                                        beFound = await crawl(url, index, true);
                                        if (beFound) break;
                                    }
                                    if (beFound) {
                                        resolve(true);
                                    } else resolve(false);
                                }
                            }
                            //trailer结果
                            else if (/javtrailers/.test(finalUrl)) {
                                //详情页 https://javtrailers.com/video/ssis00411
                                if (/video/.test(finalUrl)) {
                                    //"https://cc3001.dmm.co.jp/hlsvideo/freepv/s/son/sone00638/playlist.m3u8"
                                    //这个视频需要日本ip另一个视频链接不能跨域
                                    let reg = /"([^"]+\.(mp4|m3u8))"/i;
                                    let match = xhr.responseText.match(reg);
                                    addResult(index, finalUrl + "#autoplay", match ? match[1] : "");
                                    resolve(true);
                                }
                                /*结果页 https://javtrailers.com/search/SSIS-411
                                "id空格jav在结果中只存在一个，开头双引号不能去掉，不然会有三个*/
                                else if (/search/.test(finalUrl)) {
                                    //<div class="card-container">...href="/video/ssis00411"...没有换行符，是浏览器格式化了...alt="SSIS-411 jav"
                                    let matchArray = xhr.responseText.match(new RegExp(`"(/video/[^"]*)"(.(?!card-container))*"${_id} jav"`, "i"));
                                    if (matchArray) {
                                        //使用日语网页
                                        let url = topLevelSite + "/ja" + matchArray[1];
                                        console.log(`嵌套爬取：${url}`);
                                        await crawl(url, index, true);
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                            }
                            //jav24
                            else if (/jav24/.test(finalUrl)) {
                                //结果页
                                if (/q=/.test(finalUrl)) {
                                    //https://www.jav24.com/?q=EROFV-130
                                    //他响应的网页就没有换行
                                    //<a class="my__product__summary__link" href="/watch/www.dmm.co.jp/digital/videoc/-/detail/=/cid=bskj001/"... BSKJ-001<span
                                    let _24reg = new RegExp(`"(/watch[^"]*)"(.(?!/watch/))*(?<![a-z])${_id}<span`, "i");
                                    let match = xhr.responseText.match(_24reg);
                                    if (match) {
                                        await crawl(topLevelSite + match[1], index, true);
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                                //产品页
                                else if (/watch/.test(finalUrl)) {
                                    let reg = /<source src="([^"]*)"/i;
                                    let match = xhr.responseText.match(reg);
                                    addResult(index, finalUrl, match ? match[1] : "");
                                    resolve(true);
                                }
                            }
                            //mgstage
                            else if (/mgstage\.com/.test(finalHost)) {
                                //https://www.mgstage.com/product/product_detail/200GANA-3166/
                                if (xhr.status === 403) {
                                    error = true;
                                    appendNotice("错误：mgstage需要日本ip。", true);
                                    resolve(false);
                                } else if (/product/.test(finalUrl)) {
                                    //不存在会跳转到主页
                                    //https://www.mgstage.com/product/product_detail/200GANA-3166/
                                    //网页中按钮<a href="/sampleplayer/sampleplayer.html/bb7109fc-d1dd-48a9-95da-3851c188527a" class="button_sample">
                                    //视频所在地址https://www.mgstage.com/sampleplayer/sampleRespons.php?pid=bb7109fc-d1dd-48a9-95da-3851c188527a
                                    /*"url":"https:\/\/sample.mgstage.com\/sample\/nanpatv\/200gana\/3166\/200gana-3166_20250307T185502.ism
                                    太长了其实未换行\/request?uid=10000000-0000-0000-0000-00000000000a&amp;pid=bb7109fc-d1dd-48a9-95da-3851c188527a"*/
                                    let reg = /"[^"]+html\/([^"]+)" class="button_sample"/i;
                                    let match = xhr.responseText.match(reg);
                                    if (match) {
                                        console.log(`嵌套爬取：${mgs_player + match[1]}`);
                                        await crawl(mgs_player + match[1], index, true);
                                    } else {
                                        addResult(index, finalUrl);
                                    }
                                    resolve(true);
                                } else if (/sampleplayer/.test(finalUrl)) {
                                    let reg = /"url":"(.*ism).*"/i;
                                    let match = xhr.responseText.match(reg);
                                    addResult(index, mgs.replace("%s", _id),
                                        match ?
                                            match[1].replaceAll("\\", "").replace("ism", "mp4") :
                                            "");
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                            //javdb
                            else if (/javdb/.test(finalUrl)) {
                                //搜索结果页 https://javdb.com/search?q=pts-437
                                if (/search/.test(finalUrl)) {
                                    //日本ip会被拒绝，或者响应被限制的提示文本
                                    if (xhr.status === 403 || xhr.responseText.search("prohibited"/*禁止*/) !== -1) {
                                        error = true;
                                        appendNotice("错误：javdb不能使用日本节点。", true);
                                        resolve(false);
                                    } else {
                                        //<a href="/v/ppARk"...包含换行符...<strong>PTS-437</strong>
                                        let matchArr = xhr.responseText.match(new RegExp(`"(/v/[^"]*)"([\\s\\S](?!/v/))*>${_id}<`, "i"));
                                        if (!matchArr) {
                                            resolve(false);
                                        } else {
                                            //找到了，去爬取详情页有没有视频存在
                                            let uri = matchArr[1];
                                            console.log(`嵌套爬取：${topLevelSite + uri}`);
                                            await crawl(topLevelSite + uri, index/*嵌套爬取要携带原先的index*/, true);
                                            resolve(true);
                                        }
                                    }
                                }
                                //详情页 https://javdb.com/v/DYvxa 可见地址中不包含id
                                else if (/\/v\//.test(finalUrl)) {
                                    let reg = /"([^"]+\.(mp4|m3u8))"/i;
                                    let match = xhr.responseText.match(reg);
                                    addResult(index, finalUrl, match ? match[1] : "");
                                    resolve(true);
                                }
                            }
                            //tokyo-hot，会404
                            else if (/tokyo-hot/.test(finalUrl)) {
                                //搜索页 https://my.tokyo-hot.com/product/?q=n0274
                                //<div class="actor"> (Product ID: n0274)</div>
                                if (/q=/.test(finalUrl)) {
                                    //<a href="/product/5271/" class="rm">...含有换行符...<div class="actor"> (Product ID: n0274)</div> 不用翻译不一样
                                    //单个英文括号也是要被转义的
                                    let reg = new RegExp(`"/product/([^/]+)/"([\\s\\S](?!/product/))*<div class="actor">[^<]*(?<![a-z])${_id}\\)<`, "i");
                                    let match = xhr.responseText.match(reg);
                                    if (match) {
                                        let sample_url = tokyoHot_sample.replace("%s", match[1]);
                                        let product_url = tokyoHot_product.replace("%s", match[1]);
                                        //sample_url这里id变了，将没有%s被替换
                                        console.log(`嵌套爬取：${sample_url}`);
                                        if (await crawl(sample_url, index, true)) {
                                            addResult(index, product_url, sample_url);
                                        } else {
                                            addResult(index, product_url);
                                        }
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                                //产品页https://my.tokyo-hot.com/product/kb1738/ 没404就是有
                                else if (/product\/[^?]/.test(finalUrl)) {
                                    console.log(`嵌套爬取：${tokyoHot_sample}`);
                                    if (await crawl(tokyoHot_sample, index)) {
                                        addResult(index, finalUrl, tokyoHot_sample.replace("%s", id));
                                    } else {
                                        addResult(index, finalUrl);
                                    }
                                    resolve(true);
                                }
                                //视频文件 https://my.cdn.tokyo-hot.com/media/samples/kb1738.mp4
                                else if (/samples/.test(finalUrl)) {
                                    resolve(true);
                                }
                            }
                            //nyoshin，拼接番号后请求，不存在结果会重定向到首页
                            else if (/nyoshin/.test(finalUrl)) {
                                //https://en.nyoshin.com/moviepages/n2348/index.html
                                //stream_url = '//smovie.nyoshin.com/contents/2348/sample.mp4'
                                if (/moviepages/.test(finalUrl)) {
                                    let regString = `stream_url = '([^']*)'`;
                                    let match = xhr.responseText.match(new RegExp(regString, "i"));
                                    addResult(index, finalUrl, match ? match[1] : "");
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                            //xxxav，拼接方式请求，无结果重定向到首页
                            else if (/xxx-av/.test(finalUrl)) {
                                //https://en.xxx-av.com/mov/movie/18059/
                                if (/movie/.test(finalUrl)) {
                                    addResult(index, finalUrl);
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                            //7mmtv
                            else if (/7mmtv/.test(finalUrl)) {
                                /*
                                <div class='video'>
                                <figure class='video-preview'>
                                  <a  target="_top"   href="https://7mmtv.sx/zh/chinese_content/56350/VEC-697.html"><img class='lazyload' data-src='https://99avcdn.org/censored/s/389380_VEC-697.jpg'  alt='VEC-697 与一个美丽的屁股妻子进行的蹲式训练会严格禁止插入屁股！她无法握住它，她经历了女牛仔的位置，并在自己的体内暨！我无法摆脱活塞的乐趣！ Nogami Shiori'><video loop='true' muted='true' playsinline='true' muted='' poster='' data-src='https://video2.98avcdn.xyz/censored/389380_VEC-697.mp4' src='' autoplay='true'></video><div class='video-loader'><div class='spinner-border text-pink'></div></div></a>
                                </figure>
                                <h3 class='video-title'>
                                  <a  target="_top"   href="https://7mmtv.sx/zh/chinese_content/56350/VEC-697.html">[中字]VEC-697 与一个美丽的屁股妻子进行的蹲式训练会严格禁止插入屁股！她无法握住它，她经历了女牛仔的位置，并在自己的体内暨！我无法摆脱活塞的乐趣！ Nogami Shiori</a>
                                </h3>
                                <div class='video-info'>
                                  <div class='row justify-content-between'>
                                    <div class='col-auto'>
                                      <div class='video-channel'>goubi</div>
                                    </div>
                                    <div class='col-auto'>
                                      <span class='small text-muted'> 2025-04-18 14:50:54 </span>
                                    </div>
                                  </div>
                                </div>
                                */
                                let reg = `<video[^>]+data-src='([^']*)'[\\s\\S]*?<a.*?>([^<]*(?<![a-z])${_id}(?![0-9])[^<]*)</a>`;
                                dealSilentResult(reg, 1, 2);
                            }
                            //123av
                            else if (/123av/.test(finalUrl)) {
                                if (await meetCF()) {
                                    return;
                                }
                                /*
                                <div class="box-item">
                                <div class="thumb" v-scope="Preview()" data-preview="https://cdn.123av.me/preview/5/45/maan-1066/preview.png?t=1744536876" @vue:mounted="init($el)">
                                <a href="v/maan-1066" title="MAAN-1066">
                                <img class="lazyload" data-src="https://cdn.123av.me/resize/s360/5/45/maan-1066/cover.jpg?t=1744536876" title="MAAN-1066" alt="MAAN-1066" />
                                </a>
                                <div class="favourite"
                                v-scope="Favourite('movie', 270783, 0)"
                                data-code="MAAN-1066"
                                @click="handle" :class="{active: state == 1}">
                                <i class="fas fa-heart"></i>
                                </div>
                                <div class="duration">01:18:47</div>
                                </div>
                                <div class="detail">
                                <a href="v/maan-1066">MAAN-1066 - “ [敏感的托儿所老师被浸透和生长]一个超级可爱的Crybaby Girl刺入了赌注！当她进入室内时，她进入了顽皮的角色扮演者的回合！她完全炫耀了自己的屁股！她从后面从后面从后面开始高潮...</a>
                                </div>
                                </div>
                                * */
                                let reg = `data-preview="([^"]*)"[\\s\\S]*?data-code[\\s\\S]*?<a.*?>([^<]*(?<![a-z])${_id}(?![0-9])[^<]*)</a>`;
                                dealSilentResult(reg, 1, 2);
                            }
                            //missav
                            else if (/missav/.test(finalUrl)) {
                                if (await meetCF()) {
                                    return;
                                }
                                /*
                                <div
                                    @mouseenter="setPreview('094e105f-a18b-44c7-bab2-583f44a9a56b')"
                            @mouseleave="setPreview()"
                            @click="clickPreview('094e105f-a18b-44c7-bab2-583f44a9a56b')"
                                class="thumbnail group"
                                >
                        <div class="relative aspect-w-16 aspect-h-9 rounded overflow-hidden shadow-lg">
                            <a href="https://missav.ai/dm315/cn/060624_001" alt="060624_001" >
                                <video
                                    x-cloak
                                    :class="{ hidden: showPreview !== '094e105f-a18b-44c7-bab2-583f44a9a56b' && ! holdPreviews.includes('094e105f-a18b-44c7-bab2-583f44a9a56b') }"
                                    id="preview-094e105f-a18b-44c7-bab2-583f44a9a56b"
                                    class="preview hidden"
                                    loop
                                    muted
                                    playsinline
                                    data-src="https://fourhoi.com/060624_001/preview.mp4"
                                ></video>
                                <img
                                    x-cloak
                                    :class="{ hidden: showPreview === '094e105f-a18b-44c7-bab2-583f44a9a56b' || holdPreviews.includes('094e105f-a18b-44c7-bab2-583f44a9a56b') }"
                                                            class="lozad w-full"
                                        data-src="https://fourhoi.com/060624_001/cover-t.jpg"
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN09omrBwADNQFuUCqPAwAAAABJRU5ErkJggg=="
                                                        alt="欲望家政府小泉真希的清洁与清洁！"
                                >
                                    </a>
                                        <a href="https://missav.ai/dm315/cn/060624_001" alt="060624_001" >
                                                    <span class="absolute bottom-1 right-1 rounded-lg px-2 py-1 text-xs text-nord5 bg-gray-800 bg-opacity-75">
                                        0:55:38
                                    </span>
                                            </a>
                                    </div>
                                    <div class="my-2 text-sm text-nord4 truncate">
                                <a
                                    class="text-secondary group-hover:text-primary"
                                    href="https://missav.ai/dm315/cn/060624_001"
                                    alt="060624_001"
                                                    >
                                    060624_001 欲望家政府小泉真希的清洁与清洁！
                                    </a>
                                </div>
                                </div>
                                * */
                                let reg = `<video[^>]*data-src="([^"]*)"[\\s\\S]*?<span[\\s\\S]*?<a[^>]*>\\s([^<]*(?<![a-z])${_id}(?![0-9])[^<]*)\\s</a>`;
                                dealSilentResult(reg, 1, 2);
                            }
                            //heyzo，会404
                            else if (/heyzo/.test(finalUrl)) {
                                //"contentUrl": "https://sample.heyzo.com/contents/3000/3565/sample.mp4"
                                let regString = `"contentUrl": "([^"]*${_id}[^"]*)"`;
                                let match = xhr.responseText.match(new RegExp(regString, "i"));
                                addResult(index, finalUrl, match ? match[1] : "");
                                resolve(true);
                            }
                            //即使搜索到了特殊片商也会用js跳转而不是重定向，直接获取视频链接播放
                            else if (/h4610|c0930|h0930/.test(finalUrl)) {
                                //https://en.h4610.com/moviepages/ki250306/index.html
                                //"contentUrl": "https://smovie.h4610.com/moviepages/ki250306/sample.mp4"
                                if (/moviepages/.test(finalUrl)) {
                                    let regString = `"contentUrl": "([^"]*${_id}[^"]*)"`;
                                    let match = xhr.responseText.match(new RegExp(regString, "i"));
                                    addResult(index, finalUrl, match ? match[1] : "");
                                    resolve(true);
                                } else resolve(false);
                            }
                            //kin8tengoku
                            else if (/kin8tengoku/.test(finalUrl)) {
                                if (/moviepages/.test(finalUrl)) {
                                    //'//en.kin8tengoku.com/1111/pht/sample_en.mp4' 有四个结果，画质不一样，以防万一只用第一个
                                    let regString = `'([^']+mp4)'`;
                                    let match = xhr.responseText.match(new RegExp(regString, "i"));
                                    addResult(index, finalUrl, match ? match[1] : "");
                                    resolve(true);
                                } else resolve(false);
                            }
                        } catch (e) {
                            error = true;
                            appendNotice(`错误：${url}，请联系开发者。<br/>${e.name}:${e.message}`, true);
                            console.log(`错误：${url}，请联系开发者。<br/>${e.name}:${e.message}`);
                            resolve(false);
                            throw e;
                        }
                        console.log(`${host}爬取完成。`);
                        !once && count.value++;
                    },
                    onerror: function () {
                        error = true;
                        connectTimeout = false;
                        appendNotice("错误：" + host + "，机场不行或网站挂了。", true);
                        console.log("错误：" + host + "，机场不行或网站挂了。");
                        !once && count.value++;
                        resolve(false);
                    },
                    ontimeout: function () {
                        connectTimeout = false;
                        if (!aborted) {
                            error = true;
                            appendNotice("超时：" + host, true);
                            console.log("超时：" + host);
                            !once && count.value++;
                            resolve(false);
                        }
                    }
                });
                setTimeout(() => {
                    promise.abort();
                    if (connectTimeout) {
                        error = true;
                        aborted = true;
                        appendNotice("超时强制中断：" + host, true);
                        console.log("超时强制中断：" + host);
                        !once && count.value++;
                        resolve(false);
                    }
                }, timeout);
            });
        }

        function nothing() {
            appendNotice("预览视频或图片皆未找到。", true);
        }
    }

    async function checkUser() {
        //首次使用设置指引
        //多线程，其实刷新了数次这个通知
        showNotice("请在弹出页面点选【总是允许全部域名】。");
        await sleep(4000);
    }

    //全局通知方法
    function showNotice(notice) {
        document.getElementById("jav_notice").innerHTML = notice;
        noticeDialogObj.open();
    }

    function hideNotice() {
        if (!noticeDialogObj.opened) return;
        noticeDialogObj.close();
        document.getElementById("jav_notice").innerHTML = "";
    }

    function appendNotice(notice, warning = false) {
        let noticedDiv = document.getElementById("jav_notice");
        let div = document.createElement("div");
        div.className = warning ? "eerror" : "";
        div.innerText = notice;
        noticedDiv.appendChild(div);
        if (!noticeDialogObj.opened) {
            noticeDialogObj.open();
        }
    }

    function removeSpaces(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function getVideosInfo() {
        let videos = document.getElementsByTagName("video");
        let num = videos.length;
        let info = `${top === window ? "Top>" : "JavFrame>"}${location.host}(${num})${num > 0 ? ":" : ""}`;
        let count = 0;
        for (let i = 0; i < num; i++) {
            if (videos[i].readyState !== 0) {
                let video = videos[i];
                info += `<br/>video${i}:${video.videoWidth}*${video.videoHeight}`;
                count++;
            }
        }
        if (count === 0 && num > 0) {
            info += "<br/>null";
        }
        return info;
    }

    //同步等待若干时间
    function sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), time);
        });
    }

    function openInTab(url, option = {insert: true, loadInBackground: false}) {
        GM_openInTab(url, option);
    }

    function getTmValue(key) {
        return GM_getValue(key);
    }

    function setTmValue(key, value) {
        try {
            GM_setValue(key, value);
        } catch (e) {
            appendNotice("GM_setValue调用失败，浏览器bug捕获。" + e.message, true);
        }
    }

    function FloatBall(id, option) {
        if (!id) {
            throw new Error("FloatBall：创建悬浮球失败，至少需要指定id。");
        }
        if (document.getElementById(id)) {
            throw new Error("FloatBall：创建悬浮球失败，指定id的元素已存在。");
        }
        if (!option) {
            option = {};
        }
        let defaultOption = {
            color: "red",
            diameter: "40px",
            opacity: "0.5"
        };
        for (let name in defaultOption) {
            if (option[name] === undefined) {
                option[name] = defaultOption[name];
                // console.log(`FloatBall：未传入参数${name}，将使用默认值${defaultOption[name]}。`);
            }
        }
        console.log("FloatBall：配置完毕");
        //添加默认的css，::-webkit-scrollbar只有id选择器可以用
        //伪类中的highlight设置为透明，解决部分网站点击小球出现蓝色高光的问题
        //类名首字母写两位，防止与被注入的网站冲突
        let cssCode = '.bball{position:fixed;cursor:pointer;border-radius:99px;z-index:999999;}' +
            '.bball:focus,.bball:active,.bball:hover{-webkit-tap-highlight-color:transparent;}';
        if (!ballStyleReady) {
            addCSS(cssCode);
            ballStyleReady = true;
        }
        //使用div作为小球的元素，一方面div一般不会被加样式，一方面在移动端选词后点击可以直接取消选词，button就不行
        //a标签也由于本身的意义不适合作为小球的元素
        let ball = document.createElement("div");
        ball.id = id;
        ball.className = "bball";
        ball.style.width = option.diameter;
        ball.style.height = option.diameter;
        ball.style.opacity = option.opacity;
        ball.style.backgroundColor = option.color;
        let ballX;
        let ballY;
        //从插件获取悬浮球上次的位置，不存在就使用默认位置
        let lastPosition = getTmValue(ball.id);
        if (lastPosition) {
            let position = lastPosition.split(",");
            //数值异常或越界使用默认位置
            if (position[0] > window.innerWidth || position[1] > window.innerHeight) {
                move(0, 0.5 * window.innerHeight);
            } else move(position[0], position[1]);
        } else {
            move(0, 0.5 * window.innerHeight);
        }
        document.body.prepend(ball);
        //鼠标与小球位置差值
        let _x;
        let _y;
        //不同设备需要区别触发事件
        let events;
        if (isAndroid) {
            events = ["touchstart", "touchmove", "touchend"];
        } else events = ["mousedown", "mousemove", "mouseup"];
        let moveListenerHandler = function (e) {
            e.preventDefault();
            //移动端多指触控处理
            if (e.type === "touchmove") {
                e = e.touches[0];
            }
            // console.log("touchmove/mousemove：移动小球。");
            //移动小球时需要保持相对位置，同时处理屏幕左方与上方越界
            move(e.pageX - _x < 0 ? 0 : e.pageX - _x, e.pageY - _y < 0 ? 0 : e.pageY - _y);
        };
        let freeHandler = function () {
            //手指或鼠标放开，清除移动监听器，随后记录位置到插件
            document.removeEventListener(events[1], moveListenerHandler);
            console.log("mouseup/touchend：已清除移动事件监听。");
            setTmValue(ball.id, Number(ballX).toFixed(1) + "," + Number(ballY).toFixed(1));
        };
        //当小球被按下或触摸开始，添加移动监听器和抬起监视器
        ball.addEventListener(events[0], (e) => {
            //移动端多指触控处理
            if (e.type === "touchstart") {
                e = e.touches[0];
            }
            //记录小球位置与鼠标位置的差值
            _x = e.pageX - ballX;
            _y = e.pageY - ballY;
            document.addEventListener(events[1], moveListenerHandler, {passive: false}/*解决移动端上下移动小球触发屏幕滑动*/);
            console.log("mousedown/touchstart：已添加移动事件监听器。");
            document.addEventListener(events[2], freeHandler, {once: true});
            console.log("mousedown/touchstart：已添加抬起事件监听器（一次性）。");
        });

        function move(x, y) {
            //获取直径数值
            let diameter = Number(option.diameter.replace("px", ""));
            //处理屏幕右方与下方越界
            x = x > window.innerWidth - diameter ? window.innerWidth - diameter : x;
            y = y > window.innerHeight - diameter ? window.innerHeight - diameter : y;
            ballX = x;
            ballY = y;
            ball.style.left = x + "px";
            ball.style.top = y + "px";
        }
    }

    function ModalDialog(innerHTML, option, closeHandler = null) {
        if (!innerHTML) {
            innerHTML = "";
        }
        if (!option) {
            option = {};
        }
        //参数校验
        let defaultOption = {
            dialogPosition: "middle",
            width: "300px",
            backgroundColor: "white",
            backgroundOpacity: "0.9",
            //是否可以通过点击背景关闭模态框
            canBeClose: true
        };
        if (option.dialogPosition && !/top|middle|bottom/.test(option.dialogPosition)) {
            option.dialogPosition = "middle";
            console.log("ModalDialog：位置名称错误，将使用middle位置。");
        }
        for (let name in defaultOption) {
            if (option[name] === undefined) {
                option[name] = defaultOption[name];
                // console.log("ModalDialog：未传入配置" + name + "，将使用默认配置" + defaultOption[name] + "。");
            }
        }
        console.log("ModalDialog：配置完毕");
        //添加默认的css，::-webkit-scrollbar不能把_下划线开头的选择器放在前面，会失效
        //类名首字母写两位，防止与被注入的网站冲突
        let cssCode = '.ddialogBackground{position:fixed;inset:0px;visibility:hidden;background:rgba(0,0,0,0);}' +
            '.ddialog{overflow-y:overlay;box-sizing:border-box;margin:auto;border-radius:8px;visibility:hidden;text-align:center;opacity:0;}' +
            '.ddialog::-webkit-scrollbar{display:none;}';
        let transitionCss = '.ddialogBackground{transition:background 0.3s,visibility 0.3s;}' +
            '.ddialog{transition:opacity 0.3s,visibility 0.3s,margin-top 0.3s linear,bottom 0.3s linear;}';
        if (!modalStyleReady) {
            addCSS(cssCode);
            if (!isAndroid) {
                addCSS(transitionCss);
            }
            modalStyleReady = true;
        }
        //模态框全屏容器，压暗
        let dialogBackground = document.createElement("div");
        dialogBackground.className = "ddialogBackground";
        //添加点击事件，点击背景可以关闭当前模态框
        if (option.canBeClose) {
            dialogBackground.addEventListener("click", (e) => {
                if (e.target !== dialogBackground) {
                    return;
                }
                this.close();
            });
        }
        document.body.prepend(dialogBackground);
        //模态框
        let dialog = document.createElement("div");
        dialog.innerHTML = innerHTML;
        dialog.className = "ddialog";
        dialog.style.width = option.width;
        dialog.style.backgroundColor = option.backgroundColor;
        dialogBackground.prepend(dialog);
        const thisModal = this;
        let keepDialogMiddle = function () {
            //-20，打开时会+20
            let marginTop = Math.floor(innerHeight * 0.5 - dialog.clientHeight * 0.5)
                - ((isAndroid || thisModal.opened/*打开后的尺寸变化不要偏移*/) ? 0 : 20/*-20，打开时会+20*/);
            dialog.style.marginTop = marginTop + 'px';
        };
        //模态框上下留白
        let boundary;
        //动画偏移量
        let offset = 20;
        if (option.dialogPosition === "top") {
            boundary = 60;
            //移动端考虑到性能，不整动画
            if (isAndroid) {
                dialog.style.marginTop = boundary + "px";
            } else {
                //给20做动画，动画结束后是boundary的值
                dialog.style.marginTop = boundary - offset + "px";
            }
        } else if (option.dialogPosition === "middle") {
            boundary = 60;
            let observer = new ResizeObserver(() => {
                console.log("middle-dialog尺寸变化");
                keepDialogMiddle();
            });
            observer.observe(dialog);
            keepDialogMiddle();
        } else if (option.dialogPosition === "bottom") {
            boundary = 30;
            dialog.style.position = 'absolute';
            dialog.style.left = '50%';
            dialog.style.marginLeft = '-' + dialog.clientWidth / 2 + 'px';
            if (isAndroid) {
                dialog.style.bottom = boundary + 'px';
            } else {
                //动画结束后是30
                dialog.style.bottom = boundary - offset + 'px';
            }
        }
        dialog.style.maxHeight = window.innerHeight - boundary * 2 + "px";
        //开关状态
        this.opened = false;
        //定义打开与关闭方法
        this.open = function () {
            if (this.opened) {
                return;
            }
            //打开时指定z-index，模态框依次叠加
            if (!window.maxDialogZIndex) {
                //7个9，基数
                //并非每次都是回到这个数值，因为有允许先开的先关，此时最大值是不该递减的
                //因为后开那个才是最上层，最终关完，提前关了几个，数值就会大几
                window.maxDialogZIndex = 9999999;
            }
            dialogBackground.style.zIndex = window.maxDialogZIndex + 1;
            window.maxDialogZIndex += 1;
            //显示
            //下面的样式书写书序没有影响
            dialogBackground.style.background = "rgba(0,0,0," + option.backgroundOpacity + ")";
            dialogBackground.style.visibility = "visible";
            dialog.style.opacity = "1";
            dialog.style.visibility = "visible";
            //这是动画
            if (!isAndroid) {
                if (option.dialogPosition === "bottom") {
                    dialog.style.bottom = boundary + 'px';
                } else {
                    let top = Number(dialog.style.marginTop.replace("px", "")) + offset;
                    dialog.style.marginTop = top + 'px';
                }
            }
            this.opened = true;
        };
        this.close = function () {
            if (!this.opened) {
                return;
            }
            if (closeHandler) {
                closeHandler();
            }
            //显示
            dialogBackground.style.visibility = "hidden";
            dialogBackground.style.background = "rgba(0,0,0,0)";
            dialog.style.visibility = "hidden";
            dialog.style.opacity = "0";
            //这是动画
            if (!isAndroid) {
                if (option.dialogPosition === "bottom") {
                    dialog.style.bottom = boundary - offset + 'px';
                } else {
                    let top = Number(dialog.style.marginTop.replace("px", "")) - offset;
                    dialog.style.marginTop = top + 'px';
                }
            }
            //修改最大z-index
            //需要判断关闭的是不是最上层的再递减全局变量
            if (dialogBackground.style.zIndex === String(window.maxDialogZIndex)) {
                window.maxDialogZIndex -= 1;
            }
            this.opened = false;
        };
    }

    function WindowBling(option) {
        if (!option) {
            option = {};
        }
        let defaultOption = {
            color: "purple",
            blingPosition: ["top", "bottom", "left", "right"],
            blurRadius: "80px",
            spreadRadius: "30px"
        };
        for (let name in defaultOption) {
            if (option[name] === undefined) {
                option[name] = defaultOption[name];
                // console.log("WindowBling：未传入参数" + name + "，将使用默认值" + defaultOption[name] + "。");
            }
        }
        console.log("WindowBling：配置完毕");
        let blingArray = new Array(4);
        //opacity，visibility需要改动，写在元素里
        let topAndBottomStyle = "left:0px;right:0px;height:0px;opacity:0;visibility:hidden;";
        let leftAndRightStyle = "top:0px;bottom:0px;width:0px;opacity:0;visibility:hidden;";
        //通用css，使用选择器的方式方便调试
        let cssCode = '.bbling{z-index:999998;position:fixed;transition:opacity 0.5s,visibility 0.5s;';
        cssCode += "box-shadow:" + "0 0 " + option.blurRadius + " " + option.spreadRadius + " " + option.color + ";}";
        if (!blingStyleReady) {
            addCSS(cssCode);
            blingStyleReady = true;
        }
        //给传入需要bling的位置创建元素并指定各自的样式
        for (let position of option.blingPosition) {
            let bling = document.createElement("div");
            bling.className = "bbling";
            bling.style[position] = "0px";
            if (position === "top" || position === "bottom") {
                bling.style.cssText += topAndBottomStyle;
            } else if (position === "left" || position === "right") {
                bling.style.cssText += leftAndRightStyle;
            }
            document.body.prepend(bling);
            blingArray.push(bling);
        }
        this.blink = function () {
            let handler = function () {
                for (let bling of blingArray) {
                    if (bling) {
                        if (bling.style.opacity === "0") {
                            bling.style.opacity = "1";
                        } else {
                            bling.style.opacity = "0";
                        }
                        if (bling.style.visibility === "hidden") {
                            bling.style.visibility = "visible";
                        } else {
                            bling.style.visibility = "hidden";
                        }
                    }
                }
            };
            //只闪一下
            handler();
            setTimeout(handler, 500);
        };
    }
})();