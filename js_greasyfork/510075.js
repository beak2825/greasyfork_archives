// ==UserScript==
// @name         始
// @namespace    https://www.tampermonkey.net/
// @version      0.0.0
// @license      *
// @description  *
// @author       *
// @match        http*://v.qq.com/*
// @match        http*://m.v.qq.com/*
// @match        http*://*.iqiyi.com/*
// @match        http*://*.youku.com/*
// @match        http*://*.bilibili.com/*
// @match        http*://*.miguvideo.com/*
// @match        http*://*.le.com/*
// @match        http*://tv.sohu.com/*
// @match        http*://film.sohu.com/*
// @match        http*://m.tv.sohu.com/*
// @match        http*://*.mgtv.com/*
// @match        http*://*.ixigua.com/*
// @match        http*://*.pptv.com/*
// @match        http*://vip.1905.com/*
// @match        http*://www.wasu.cn/*
// @include      http*://*.*/*?url=http*://*.*.*/*
// @include      http*://*.*:*/*?url=http*://*.*.*/*
// @include      http*://*.*/*?v=http*://*.*.*/*
// @include      http*://*.*:*/*?v=http*://*.*.*/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/510075/%E5%A7%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/510075/%E5%A7%8B.meta.js
// ==/UserScript==
 
if (location.search.match(/\?url=https?:\/\/.+\..+\..+\/.+/) ||
    location.search.match(/\?v=https?:\/\/.+\..+\..+\/.+/) ||
    location.host.indexOf("v.qq.com") !== -1 ||
    location.host.indexOf("iqiyi.com") !== -1 ||
    location.host.indexOf("youku.com") !== -1 ||
    location.host.indexOf("bilibili.com") !== -1 ||
    location.host.indexOf("miguvideo.com") !== -1 ||
    location.host.indexOf("le.com") !== -1 ||
    location.host.indexOf("tv.sohu.com") !== -1 ||
    location.host.indexOf("film.sohu.com") !== -1 ||
    location.host.indexOf("mgtv.com") !== -1 ||
    location.host.indexOf("ixigua.com") !== -1 ||
    location.host.indexOf("pptv.com") !== -1 ||
    location.host.indexOf("vip.1905.com") !== -1 ||
    location.host.indexOf("www.wasu.com") !== -1) {
    console.log("脚本运行在 " + location.href);
    // 对符合条件的域名执行脚本
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)) {
        // 修改手机端UA
        Object.defineProperty(navigator, 'userAgent', {
            value: "Mozilla/5.0 (Linux; Android 7.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Mobile Safari/537.36 Edg/96.0.1054.34",
            writable: false
        });
    }
 
    function detectMobile() {
        return (
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/SymbianOS/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        );
    }
 
    if (window !== top) {
        console.clear = function () {
            // 禁止清除控制台
        }
    }
 
    // (true:开启|false:关闭)
    const setings = {
        弹幕: true,
        /*
    *    (): 小括号括住的表示推荐解析 画质高 速度快
    *    : 无括号的表示视频带水印 或 原页面画质
    *    []: 方括号表示标清画质 不推荐
    */
        NoAD解析: {    // TODO by 17kyun.com/api.php?url=    // TODO by tv.hzwdd.cn
            TV解析: "https://jx.m3u8.tv/jiexi/?url=",    // TODO 腾讯
            天翼解析: "https://jsap.attakids.com/?url=",    // TODO 腾讯
            爱解析: "https://jiexi.t7g.cn/?url=",    // TODO 腾讯
            OK解析: "https://api.okjx.cc:3389/jx.php?url=" || "https://okjx.cc/?url=" || "https://m2090.com/?url=",    // TODO 优质: 腾讯 (爱奇艺) 优酷 乐视 芒果 PPTV (华数)
            Mao解析: "https://www.mtosz.com/m3u8.php?url=",    // TODO 无水印(但不稳定): 腾讯 爱奇艺 优酷 乐视 (芒果) (PPTV) (华数)
            全民解析: "https://jx.quanmingjiexi.com/?url=" || "https://chaxun.truechat365.com/?url=",    // TODO (腾讯)
            云解析: "https://jx.aidouer.net/?url=" || "https://jx.ppflv.com/?url=",    // TODO 腾讯 [爱奇艺] 优酷 (乐视) 芒果 (1905电影网) [华数]
            久播解析: "https://jx.jiubojx.com/vip/?url=" || "https://www.qianyicp.com/vip/vip_g.php?url=",    // _4K解析: "https://vip.jx4k.com/vip/?url=",    // TODO 腾讯 爱奇艺 (优酷) 咪咕 乐视 (芒果) 西瓜 PPTV
            虾米解析: "https://jx.xmflv.com/?url=",    // TODO (土豆) (咪咕) 搜狐
            夜幕解析: "https://www.yemu.xyz/?url=",    // (Parwix解析: "https://jx.parwix.com:4433/player/analysis.php?v=" || "https://vip.parwix.com:4433/player/?url=" || )    // TODO (西瓜) (B站) (搜狐)
            云博解析: "https://jx.yunboys.cn/?url="    // TODO 土豆 华数 芒果:可能有广告    // by www.yunboys.cn
        },
        // 获取框架循环时间，CPU性能好的可以设置为100，CPU性能不好的可以设置为1000
        getElementTimes: 500,
        // log输出字体布局
        fontStyle: {
            error: "color: #f00;",
            ok: "color: #0f0;",
            maxTip: "font-size: 30px; background-color: #222; text-shadow: 0px 0px 12px #fff; color: #fff;"
        }
    }
 
    function doElement(cssString, doFunction, waitMS = 0) {
        let Element = document.querySelector(cssString);
        if (Element && Element.nodeType === 1) {
            doFunction(Element);
            console.log("%c已为 " + cssString + " 进行了操作", setings.fontStyle.ok);
        } else if (document.readyState !== "complete" || waitMS > 0) {
            console.log("正在查找 " + cssString);
            setTimeout(function () {
                doElement(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - setings.getElementTimes);    // TODO 10毫秒约函数执行时间
            }, setings.getElementTimes);
        } else {
            console.log("%c未找到 " + cssString, setings.fontStyle.error);
        }
    }
 
    function doElements(cssString, doFunction, waitMS = 0, index = 0) {
        let Elements = document.querySelectorAll(cssString);
        if (Elements[index] && Elements[index].nodeType === 1) {
            doFunction(Elements);
            console.log("%c已为 All[" + index + "] " + cssString + " 进行了操作", setings.fontStyle.ok);
        } else if (document.readyState !== "complete" || waitMS > 0) {
            console.log("正在查找 All[" + index + "] " + cssString);
            setTimeout(function () {
                doElements(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - setings.getElementTimes, index);    // TODO 10毫秒约函数执行时间
            }, setings.getElementTimes);
        } else {
            console.log("%c未找到 All[" + index + "] " + cssString, setings.fontStyle.error);
        }
    }
 
    function forElement(cssString, doFunction, waitMS = 0) {
        let forElementInterval = setInterval(function () {
            if (document.readyState !== "complete" || waitMS > 0) {
                let Element = document.querySelector(cssString);
                if (Element && Element.nodeType === 1) {
                    doFunction(Element, forElementInterval);
                    console.log("%cforElement已为 " + cssString + " 进行了操作", setings.fontStyle.ok);
                }
                if (document.readyState === "complete") {
                    waitMS = waitMS - 10 - setings.getElementTimes;
                }
            } else {
                console.log("已清除 forElement Interval计时器")
                clearInterval(forElementInterval);
            }
        }, setings.getElementTimes);
    }
 
    function removeElements(ElementsStrings) {
        console.log("正在检测并移除 " + ElementsStrings);
        let removeElementsInterval = setInterval(function () {
            if (ElementsStrings.length > 0) {
                for (let i in ElementsStrings) {
                    let Elements = eval(ElementsStrings[i]);
                    try {
                        if (Elements && Elements.nodeType === 1) {
                            Elements.parentNode.removeChild(Elements);
                            ElementsStrings.splice(i, 1);
                        } else if (Elements[0] && Elements[0].nodeType === 1) {
                            for (let Element of Elements) {
                                Element.parentNode.removeChild(Element);
                            }
                            ElementsStrings.splice(i, 1);
                        }
                    } catch (e) {
                    }
                }
            } else {
                clearInterval(removeElementsInterval);
                console.log("Elements 移除完毕")
            }
        }, 200);
        onFirstLoad(function () {
            clearInterval(removeElementsInterval);
        });
    }
 
    function setParseBox() {
        // 移除广告模块
        removeElements([
            'document.getElementById("ADplayer")',
            'document.getElementById("ADtip")'
        ]);
        // 设置解析播放器
        setParseVideo();
        // 移除弹幕模块
        if (setings.弹幕 === false) {
            console.log("正在移除弹幕功能");
            removeElements([
                'document.querySelector("div[class$=player-video-wrap]").getElementsByTagName("div")',
                'document.querySelector("div[class$=playr-danmu]")',
                'document.querySelector("div[class$=player-danmaku]")',
                'document.querySelector("div[class*=player-comment-box]")',
                'document.querySelector("div[class*=player-controller-mask]")',
                'document.querySelector("[class*=player-list-icon]")',
                'document.querySelector("div[class$=player-menu]")'
            ]);
        }
    }
 
    function setParseVideo() {
        console.log(location.href + " 正在查找video 准备移除poster")
        forElement("video", function (video, thisInterval) {
            if (video.src) {
                let fullscreen_btn = document.querySelector("[class*=fullscreen],[class$=player-full] button[class$=full-icon]");
                window.onkeydown = video.onkeydown = function (event) {
                    if (event.key === "Enter") {
                        if (video.paused) {
                            video.play()
                        }
                        if (fullscreen_btn && fullscreen_btn.nodeType === 1) {
                            fullscreen_btn.click();
                            return false;
                        } else if (video.webkitDisplayingFullscreen) {
                            if (video.webkitExitFullScreen) {
                                video.webkitExitFullScreen();
                            } else if (video.webkitExitFullscreen) {
                                video.webkitExitFullscreen();
                            }
                        } else {
                            if (video.webkitEnterFullScreen) {
                                video.webkitEnterFullScreen();
                            } else if (video.webkitEnterFullscreen) {
                                video.webkitEnterFullscreen();
                            }
                        }
                    }
                }
                window.focus();
                video.addEventListener("pause", function () {
                    if ((video.currentTime - video.duration) > -5) {
                        console.log("视频播放结束了");
                        if (fullscreen_btn && fullscreen_btn.nodeType === 1 && ((video.clientWidth || video.scrollWidth) === screen.width) || ((video.clientHeight || video.scrollHeight) === screen.height)) {
                            fullscreen_btn.click();
                            return false;
                        } else if (video.webkitExitFullScreen) {
                            video.webkitExitFullScreen();
                        } else if (video.webkitExitFullscreen) {
                            video.webkitExitFullscreen();
                        } else {
                            console.log("不支持退出全屏");
                        }
                    }
                }, false);
                clearInterval(thisInterval);
            }
        }, 5000);
    }
 
    if (location.host.indexOf("jiexi.t7g.cn") !== -1) {
        // 移除爱解析p2p提示
        displayNone(["body>div#stats"]);
        setParseBox();
    } else if (location.host.indexOf("api.okjx.cc:3389") !== -1) {
        // 删除OK解析线路选择功能
        (function (style) {
            style.innerHTML = ".slide,.panel,.slide *,.panel *{width: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
            document.head.appendChild(style);
        })(document.createElement("style"));
    } else if (location.host.indexOf("api.jiubojx.com") !== -1) {
        displayNone("div.adv_wrap_hh");
        setParseBox();
    } else if (location.host.indexOf("yemu.xyz") !== -1) {
        if (location.pathname.indexOf("jx.php") === -1) {
            if (location.host.indexOf("www.yemu.xyz") !== -1) {
                // 删除夜幕解析线路选择功能
                (function (style) {
                    style.innerHTML = ".slide,.panel,.slide *,.panel *{width: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
                    document.head.appendChild(style);
                })(document.createElement("style"));
            } else if (location.host.indexOf("jx.yemu.xyz") !== -1) {
                // 移除视频分类提示 及 解析框架处理
                displayNone(["div.advisory"]);
                setParseBox();
            }
        } else {
            // 移除背景图片
            doElement("div[style*='width:100%;height:100%;'][style*='.jpg']", function (background) {
                background.style = "width:100%;height:100%;position:relative;z-index:2147483647987;";
            }, 5000);
        }
    } else if (location.host.indexOf('www.mtosz.com') !== -1) {
        displayNone([".video-panel-blur-image"]);    // 似乎不管用？
        doElement(".video-panel-blur-image", function (element) {
            element.style = "display: none; height: 0; width: 0;";
        })
        setParseBox();
    } else if (location.host.indexOf('v.superchen.top:3389') !== -1) {
        setParseBox();
    } else if (location.host.indexOf('jx.parwix.com:4433') !== -1) {
        setParseBox();
    } else if (window === top) {
        function randomSelete() {
            // arguments 代表输入的所有参数，看不懂可以百度搜索 “js 参数 arguments”
            return arguments ? arguments[Math.floor(Math.random() * arguments.length)] : null;
        }
 
        if (!detectMobile()) {
            if (location.host.indexOf("v.qq.com") !== -1) {
                readyPlayerBox("已进入腾讯视频", ["#mask_layer", ".mod_vip_popup", "#mask_layer"], randomSelete(setings.NoAD解析.夜幕解析), "div#player", null);
            } else if (location.host.indexOf("iqiyi.com") !== -1) {
                readyPlayerBox("已进入爱奇艺", null, setings.NoAD解析.夜幕解析, "#flashbox", null);
            } else if (location.host.indexOf("youku.com") !== -1) {
                readyPlayerBox("已进入优酷视频", ["#iframaWrapper"], setings.NoAD解析.夜幕解析, "#player", null);
            } else if (location.host.indexOf("bilibili.com") !== -1) {
                doElements("div[role=tooltip]:not([class*=popover-])", function (loginTip) {
                    displayNone(["#" + loginTip[6].id]);
                }, 1000, 6);
                doElement("svg[aria-hidden=true]", function () {
                    readyPlayerBox("已进入哔哩哔哩", null, setings.NoAD解析.夜幕解析, "div.bpx-player-video-area,div.mask-container", null);    // TODO || document.getElementById("bilibiliPlayer") || document.getElementById("live-player-ctnr")
                });
            } else if (location.host.indexOf("miguvideo.com") !== -1) {
                readyPlayerBox("已进入咪咕视频", null, setings.NoAD解析.夜幕解析, "section#mod-player", null);
            } else if (location.host.indexOf("le.com") !== -1) {
                readyPlayerBox("已进入乐视TV", null, setings.NoAD解析.夜幕解析, "#le_playbox", null);
            } else if (location.host.match(/(tv|film).sohu.com/)) {
                readyPlayerBox("已进入搜狐视频", null, setings.NoAD解析.夜幕解析, "#player,#sohuplayer,.player-view", null);
            } else if (location.host.indexOf("mgtv.com") !== -1) {
                readyPlayerBox("已进入芒果TV", null, setings.NoAD解析.夜幕解析, "#mgtv-player-wrap", null);
            } else if (location.host.indexOf("ixigua.com") !== -1) {
                readyPlayerBox("已进入西瓜视频", null, setings.NoAD解析.夜幕解析, "div.teleplayPage__playerSection", null);
            } else if (location.host.indexOf("pptv.com") !== -1) {
                readyPlayerBox("已进入PPTV", null, setings.NoAD解析.夜幕解析, "div.w-video", null);
            } else if (location.host.indexOf("vip.1905.com") !== -1) {
                readyPlayerBox("已进入1905电影网", null, setings.NoAD解析.云解析, "div#playBox", null);
            } else if (location.host.indexOf("www.wasu.cn") !== -1) {
                readyPlayerBox("已进入华数TV", null, setings.NoAD解析.OK解析, "div#pcplayer", null);
            }
        } else {
            if (location.host.indexOf("v.qq.com") !== -1) {
                readyPlayerBox("已进入腾讯视频", [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec"],
                    setings.NoAD解析.夜幕解析, "section.mod_player", null, function (href) {
                        href = searchToJSON(href);
                        if (href) {
                            if (href["cid"]) {
                                if (href["id"]) {
                                    return location.protocol + '//v.qq.com/detail/' + href["cid"][0] + '/' + href["cid"] + '.html';
                                } else if (href["vid"]) {
                                    return location.protocol + '//v.qq.com/x/cover/' + href["cid"] + '/' + href["vid"] + '.html';
                                } else {
                                    return location.protocol + '//v.qq.com/x/cover/' + href["cid"] + '.html';
                                }
                            } else if (href["vid"]) {
                                return location.protocol + '//v.qq.com/x/page/' + href["vid"] + '.html';
                            } else if (href["lid"]) {
                                return location.protocol + '//v.qq.com/detail/' + href["lid"][0] + '/' + href["lid"] + '.html';
                            } else {
                                return null;
                            }
                        } else {
                            return null;
                        }
                    });
            } else if (location.host.indexOf("iqiyi.com") !== -1) {
                readyPlayerBox("已进入爱奇艺", ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]"], setings.NoAD解析.夜幕解析, "section.m-video-player", null);
            } else if (location.host.indexOf("youku.com") !== -1) {
                readyPlayerBox("已进入优酷视频", ["#iframaWrapper", ".ad-banner-wrapper", ".h5-detail-guide,.h5-detail-vip-guide", ".brief-btm"], setings.NoAD解析.夜幕解析, "#player", null);
            } else if (location.host.indexOf("bilibili.com") !== -1) {
                readyPlayerBox("已进入哔哩哔哩", ["div.fe-ui-open-app-btn,div.recom-wrapper,open-app-btn", "[class*=openapp]"], setings.NoAD解析.夜幕解析, "div#app.main-container div.player-wrapper", null, function (href) {
                    return href.replace("m.bilibili.com", "www.bilibili.com");
                });
            } else if (location.host.indexOf("miguvideo.com") !== -1) {
                readyPlayerBox("已进入咪咕视频", ["[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", ".openClient", "div.group-item.programgroup .data-rate-01,div.group-item.programgroup .max-rate-01,div.group-item.programgroup .p-common"], setings.NoAD解析.Mao解析, "section#mod-player", null, function (href) {
                    return href.replace("m.miguvideo.com", "www.miguvideo.com").replace("msite", "website");
                });
            } else if (location.host.indexOf("le.com") !== -1) {
                (function (block_show) {
                    block_show.innerHTML = "div.layout{visibility: visible !important; display:block !important;}div.layout>*:not(style,script,#j-vote,#j-follow){visibility: visible !important; display: block !important;}";
                    document.head.insertBefore(block_show, document.head.firstChild);
                })(document.createElement("style"));
                doElement("a.j-close-gdt", function (jump_over) {
                    jump_over.click();
                    return false;
                });
                readyPlayerBox("已进入乐视TV", ["a.leapp_btn", "div.full_gdt_bits[id^=full][data-url]", "[class*=Daoliu],[class*=daoliu],[class*=game]", "div.m-start", "[class*=icon_user]"], setings.NoAD解析.云解析, "div.column.play", null);
            } else if (location.host.indexOf("m.tv.sohu.com") !== -1) {
                readyPlayerBox("已进入搜狐视频", ["div[class^=banner]", "div.js-oper-pos", "div[id^=ad],div[id^=ad] *", "[id*=login],[class*=login]", "[class$=-app]", "div.app-vbox.ph-vbox,div.app-vbox.app-guess-vbox", "div.twinfo_iconwrap", "div[class$=banner],div[id$=banner]"], setings.NoAD解析.夜幕解析, "#player,#sohuplayer,.player-view", null, function (href) {
                    href = searchToJSON(href);
                    if (href && href["aid"]) {
                        return location.protocol + '//film.sohu.com/album/' + href["aid"] + '.html';
                    } else {
                        return location.href.replace("m.tv.sohu.com", "tv.sohu.com");
                    }
                });
            } else if (location.host.indexOf("mgtv.com") !== -1) {
                readyPlayerBox("已进入芒果TV", ["div.adFixedContain", "div.ad-banner", "div[class^=mg-app],div.mg-stat,div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"], setings.NoAD解析.久播解析, "div.video-poster,div.video-area", null);
            } else if (location.host.indexOf("ixigua.com") !== -1) {
                readyPlayerBox("已进入西瓜视频", ["div.xigua-download", "div.xigua-guide-button", "div.c-long-video-recommend.c-long-video-recommend-unfold"], setings.NoAD解析.夜幕解析, "div.xigua-detailvideo-video", null);
            } else if (location.host.indexOf("pptv.com") !== -1) {
                readyPlayerBox("已进入PPTV", ["[data-darkreader-inline-bgimage][data-darkreader-inline-bgcolor]", "div[class^=pp-m-diversion]", "section#ppmob-detail-picswiper", "section.layout.layout_ads", "div.foot_app", "div[modulename=导流位]", "a[class*=user]", "div.mod_video_info div.video_func"], setings.NoAD解析.OK解析, "section.pp-details-video", null, function (href) {
                    return href.replace("m.pptv.com", "v.pptv.com");
                });
            } else if (location.host.indexOf("vip.1905.com") !== -1) {
                (function (movie_info) {
                    movie_info.innerHTML = "section#movie_info{padding-top: 20px !important;}";
                    document.head.appendChild(movie_info);
                })(document.createElement("style"));
                readyPlayerBox("已进入1905电影网", ["a.new_downLoad[target=_blank]", "iframe[srcdoc^='<img src=']", "section.movieList_new.club_new", ".wakeAppBtn", "[class*=login]", "section.openMembershipBtn", ".ad", ".open-app,.openApp,ul.iconList li:not(.introduceWrap),div#zhichiBtnBox", "section#hot_movie,section#exclusive_movie,section#hot_telve"], setings.NoAD解析.云解析, "div.area.areaShow.clearfix_smile", null);
            } else if (location.host.indexOf("www.wasu.cn") !== -1) {
                readyPlayerBox("已进入华数TV", ["div.ws_poster", "div.appdown,div.player_menu_con", "div#play_and_info_fix_adv"], setings.NoAD解析.OK解析, "div#player,div#pop", null);
            }
        }
 
        function readyPlayerBox(Tip, displayNones, src, cssString, doFunction, doHref = null) {
            if (Tip) {
                console.log("%c" + Tip, setings.fontStyle.maxTip);
            }
            onLocationChange(function () {
                location.reload();    // TODO 如果网页rul变了就刷新页面
            });
            if (displayNones) {
                displayNone(displayNones);
            }
            doElement(cssString, function (playerBox) {
                setInterval(function () {
                    for (let link of document.querySelectorAll("a")) {
                        link.onclick = function () {
                            if (link.host === location.host) {
                                location.href = link.href
                            }
                        }
                    }
                }, 1500);
                let iframe = document.createElement("iframe");
                iframe.id = "iframePlayer";
                iframe.allowFullscreen = true;
                iframe.frameBorder = "0";   // HTML5已弃用此属性，并使用style.border代替
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.style = "background-color: #000 !important; border: 0 !important; display: block !important; visibility: visible !important; opacity: 1 !important;" +
                    " min-width: 100% !important; width: 100% !important; max-width: 100% !important; min-height: 100% !important; height: 100% !important; max-height: 100% !important;" +
                    " position: absolute !important; left: 0px !important; top: 0px !important; z-index: 2147483647 !important;";
                if (typeof doHref === "function") {
                    let href = doHref(location.href);
                    iframe.src = src ? src + (href ? href : location.href) : "";
                } else {
                    iframe.src = src ? src + location.href : "";
                }
                playerBox.appendChild(iframe);
                console.log("%cplayerBox已建立解析连接", setings.fontStyle.maxTip);
 
                // 自定义解析线路
                let DIY_iframe = document.createElement("div");
                DIY_iframe.style = "display: flex; background-color: #0000; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; min-width: 120px; width: 5%; height: 34px; position: fixed;  right: 7%; bottom: 45px; z-index: 2147483647; color: #000";
                DIY_iframe.innerHTML = "<select style='border: 0; background-color: #ddd; text-align: center; min-width: 80px; width: 80px; height: 100%; border-bottom-left-radius: 15px; border-top-left-radius: 15px;'></select>" +
                    "<input type='text' style='display: none;'>" +
                    "<button style='transition: all 0.5s; width: 50px; height: 100%; border-bottom-right-radius: 17px; border-top-right-radius: 15px; background-color: #4af; border-color: #4af; text-align: center; color: #fff;'>解析</button>";
                let DIY_iframe_text = DIY_iframe.querySelector("input[type=text]");
 
                function DIY_iframe_src() {
                    if (typeof doHref === "function") {
                        let href = doHref(DIY_iframe_text.value ? DIY_iframe_text.value : location.href);
                        iframe.src = DIY_iframe_select.options[DIY_iframe_select.selectedIndex].value + (href ? href : (DIY_iframe_text.value ? DIY_iframe_text.value : location.href))
                    } else {
                        iframe.src = DIY_iframe_select.options[DIY_iframe_select.selectedIndex].value + (DIY_iframe_text.value ? DIY_iframe_text.value : location.href);
                    }
                }
 
                let DIY_iframe_select = DIY_iframe.querySelector("select");
                for (let name in setings.NoAD解析) {
                    DIY_iframe_select.innerHTML += "<option value='" + setings.NoAD解析[name] + "' style='text-align: center'>" + name + "</option>";
                }
                DIY_iframe.querySelector("option[value='" + src + "']").selected = true;
                DIY_iframe.querySelector("button").onclick = function () {
                    DIY_iframe_src();
                }
                DIY_iframe_text.onkeydown = DIY_iframe_select.onkeydown = function (event) {
                    if (event.key === "Enter") {
                        DIY_iframe_src();
                    }
                }
                document.body.appendChild(DIY_iframe);
 
                (function () {
                    let resetPlayerBoxInterval = setInterval(function () {
                        if (document.querySelector(cssString) !== (playerBox || null)) {
                            console.log("playerBox重新建立连接");
                            let src = iframe.src;
                            iframe.src = "";
                            iframe = iframe.cloneNode(true);
                            iframe.src = src;
                            document.querySelector(cssString).appendChild(iframe);
                            clearInterval(resetPlayerBoxInterval);
                        } else if (document.readyState === "complete") {
                            clearInterval(resetPlayerBoxInterval);
                        }
                    }, setings.getElementTimes)
                })();
 
                if (doFunction) {
                    doFunction(playerBox, iframe);
                }
                setInterval(function () {
                    for (let video of document.getElementsByTagName("video")) {
                        if (video.src) {
                            video.removeAttribute("src");
                            video.load();
                            video.muted = true;
                        }
                    }
                }, setings.getElementTimes);
 
                if (!detectMobile()) {
                    showTip("按下Enter回车键，进入全屏 并 自动播放");
                }
            });
        }
    } else if (location.pathname) {
        setParseVideo();
    }
 
 
    function displayNone(Tags) {
        let style = document.createElement("style");
        style.innerHTML = "\n"
        for (let i = 0; i < Tags.length; i++) {
            style.innerHTML += Tags[i] + "{display: none !important; height: 0 !important; width: 0 !important; visibility: hidden !important; max-height: 0 !important; max-width: 0 !important; opacity: 0 !important;}\n"
        }
        document.head.insertBefore(style, document.head.firstChild);
    }
 
    function onLocationChange(handler) {
        let url = top.location.pathname;
        let onLocationChangeInterval = setInterval(function () {
            let href = top.location.pathname;
            if (href.indexOf(url) === -1) {
                handler();
                clearInterval(onLocationChangeInterval);
            } else {
                url = href;
            }
        }, setings.getElementTimes);
    }
 
    function onFirstLoad(doFunction) {
        if (document.readyState === "complete") {
            if (doFunction) {
                doFunction();
            }
        } else {
            setTimeout(function () {
                onFirstLoad(doFunction);
            }, setings.getElementTimes);
        }
    }
 
    function searchToJSON(search) {
        if (search) {
            return JSON.parse(
                "{\"" +
                decodeURIComponent(
                    search.substring(1)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"')
                )
                + "\"}"
            );
        } else {
            return null;
        }
    }
 
    function showTip(msg) {
        // 该函数需要在window.top内运行，否则可能显示异常
        if (window === top) {
            let tip = document.querySelector("tip div#showTip");
            if (tip && tip.nodeType === 1) {
                tip.innerText = msg;
                let time = msg.length / 2;   // TODO 2个字/秒
                tip.style.animation = "showTip " + (time > 2 ? time : 2) + "s cubic-bezier(0," + ((time - 1) > 0 ? (time - 1) / time : 0) + "," + (1 - ((time - 1) > 0 ? (time - 1) / time : 0)) + ",1) 1 normal";
            } else {
                tip = document.createElement("tip");
                tip.innerHTML = "<style>@keyframes showTip {0%{opacity: 0} 33.34%{opacity: 1} 66.67%{opacity: 1} 100%{opacity: 0}}</style>" +
                    "<div id='showTip' style='opacity: 0; background-color: #222a; color: #fff; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; position: fixed; left: 50%; bottom: 15%; transform: translate(-50%, -50%); z-index: 2147483647;'></div>";
                document.querySelector("html").appendChild(tip);
                showTip(msg);
            }
        } else {
            console.log(locaton.href + "\n showTip: " + msg);
        }
    }
}