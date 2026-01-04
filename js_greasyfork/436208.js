// ==UserScript==
// @name         全网VIP视频自动解析播放器(已适配手机)
// @namespace    https://www.tampermonkey.net/
// @license      Tenfond
// @version      0.5.12.4
// @author       Tenfond
// @antifeature  此脚本只做学习交流，使用此脚本的造成任何后果概不负责
// @description  无需跳转新网址，打开官网直接看，超清 无广告 无水印。支持：腾讯，爱奇艺，优酷，哔哩哔哩，咪咕，乐视，搜狐，芒果，西瓜，PPTV，1905电影网，华数
// @match        http*://v.qq.com/*
// @match        http*://m.v.qq.com/*
// @match        http*://*.iqiyi.com/*
// @match        http*://*.youku.com/*
// @match        http*://*.bilibili.com/*
// @match        http*://*.miguvideo.com/*
// @match        http*://*.le.com/*
// @match        http*://tv.sohu.com/*
// @match        http*://m.tv.sohu.com/*
// @match        http*://*.mgtv.com/*
// @match        http*://*.ixigua.com/*
// @match        http*://*.pptv.com/*
// @match        http*://vip.1905.com/*
// @match        http*://www.wasu.cn/*
// @match        http*://www.mtosz.com/m3u8.php?url=*
// @match        http*://v.superchen.top:3389/m3u8.php?url=*
// @match        http*://api.okjx.cc:3389/jx.php?url=*
// @match        http*://*.yemu.xyz/*?url=*
// @match        http*://jx.parwix.com:4433/player/analysis.php?v=*
// @match        http*://jiexi.xmflv.com:4399/*url=*
// @match        http*://api.jiubojx.com/vip*/*.php?url=*
// @downloadURL https://update.greasyfork.org/scripts/436208/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436208/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29.meta.js
// ==/UserScript==
//暂无解析 @match        *://fun.tv/*
//暂无解析 @match        *://*.fun.tv/*

window.console.clear = function() {
        // 禁止清除控制台
    }
    // (true:开启|false:关闭)
const setings = {
    弹幕: true,
    /*
     *    (): 小括号括住的表示推荐解析 画质高 速度快
     *    : 无括号的表示视频带水印 或 原页面画质
     *    []: 方括号表示标清画质 不推荐
     */
    NoAD解析: { // TODO by 17kyun.com/api.php?url=
        OK解析: "https://api.okjx.cc:3389/jx.php?url=" || "https://okjx.cc/?url=" || "https://m2090.com/?url=", // TODO 优质: (腾讯) (爱奇艺) 优酷 乐视 芒果 (PPTV) (华数)
        乐多解析: "https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", // TODO 无水印(但不稳定): 腾讯 爱奇艺 优酷 乐视 (芒果) (PPTV) (华数)
        云解析: "https://jx.aidouer.net/?url=" || "https://jx.ppflv.com/?url=", // TODO 腾讯 [爱奇艺] 优酷 (乐视) 芒果 (1905电影网) [华数]
        久播解析: "https://vip.parwix.com:4433/player/?url=" || "https://www.qianyicp.com/vip/vip_g.php?url=", // _4K解析: "https://vip.jx4k.com/vip/?url=",    // TODO 腾讯 爱奇艺 (优酷) 咪咕 乐视 (芒果) 西瓜 PPTV
        虾米解析: "https://jx.xmflv.com/?url=", // TODO (土豆) (咪咕) 搜狐
        夜幕解析: "https://www.yemu.xyz/?url=", // (Parwix解析: "https://jx.parwix.com:4433/player/analysis.php?v=" || "https://vip.parwix.com:4433/player/?url=" || )    // TODO (西瓜) (B站) (搜狐)
        超清解析: "https://jx.yunboys.cn/?url=" // TODO 土豆 华数 芒果:可能有广告    // by www.yunboys.cn
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

// 记录被此脚本删除的Element的flash对象，以便最后查找用
var flash = document.createElement("flash");

function doElement(cssString, doFunction, waitMS = 0) {
    let Element = document.querySelector(cssString);
    if (Element && Element.nodeType === 1) {
        doFunction(Element);
        console.log("%c已为 " + cssString + " 进行了操作", setings.fontStyle.ok);
    } else if (document.readyState !== "complete" || waitMS > 0) {
        console.log("正在查找 " + cssString);
        setTimeout(function() {
            doElement(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - setings.getElementTimes); // TODO 10毫秒约函数执行时间
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
        setTimeout(function() {
            doElements(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - setings.getElementTimes, index); // TODO 10毫秒约函数执行时间
        }, setings.getElementTimes);
    } else {
        console.log("%c未找到 All[" + index + "] " + cssString, setings.fontStyle.error);
    }
}

function forElement(cssString, doFunction, waitMS = 0) {
    let forElementInterval = setInterval(function() {
        if (document.readyState !== "complete" || waitMS > 0) {
            let Element = document.querySelector(cssString);
            if (Element && Element.nodeType === 1) {
                doFunction(Element);
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
    let removeElementsInterval = setInterval(function() {
        if (ElementsStrings.length > 0) {
            for (let i in ElementsStrings) {
                let Elements = eval(ElementsStrings[i]);
                try {
                    if (Elements && Elements.nodeType === 1) {
                        flash.appendChild(Elements);
                        Elements.parentNode.removeChild(Elements);
                        ElementsStrings.splice(i, 1);
                    } else if (Elements[0] && Elements[0].nodeType === 1) {
                        for (let Element of Elements) {
                            flash.appendChild(Elements);
                            Element.parentNode.removeChild(Element);
                        }
                        ElementsStrings.splice(i, 1);
                    }
                } catch (e) {}
            }
        } else {
            clearInterval(removeElementsInterval);
            console.log("Elements 移除完毕")
        }
    }, 200);
    onFirstLoad(function() {
        clearInterval(removeElementsInterval);
    });
}

function 移除解析框架() {
    // 移除广告模块
    removeElements([
        'document.getElementById("ADplayer")',
        'document.getElementById("ADtip")'
    ]);
    // 移除video.poster
    console.log(location.href + " 准备移除poster")
    forElement("video", function(video) {
        console.log(location.href + " 将移除poster: " + video.poster);
        video.removeAttribute("poster");
    }, 5000);
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


if (location.host.indexOf("api.okjx.cc:3389") !== -1) {
    // 删除OK解析线路选择功能
    displayNone([".slide", ".panel"]);
    (function(box) {
        box.style = "height: 36px; max-height: 36px; display: block;";
        document.body.insertBefore(box, document.body.firstChild);
    })(document.createElement("div"));
} else if (location.host.indexOf("api.jiubojx.com") !== -1) {
    displayNone("div.adv_wrap_hh");
    移除解析框架();
} else if (location.host.indexOf("yemu.xyz") !== -1) {
    if (location.pathname.indexOf("jx.php") === -1) {
        if (location.host.indexOf("www.yemu.xyz") !== -1) {
            // 删除夜幕解析线路选择功能
            displayNone([".slide", ".panel"]);
            doElement("div#mg", function(box) {
                box.style = "width: 100%; height: 100%; margin: auto;";
            });
        } else if (location.host.indexOf("jx.yemu.xyz") !== -1) {
            // 移除视频分类提示 及 解析框架处理
            displayNone(["div.advisory"]);
            移除解析框架();
        }
    } else {
        // 移除背景图片
        doElement("div[style*='width:100%;height:100%;'][style*='.jpg']", function(background) {
            background.style = "width:100%;height:100%;position:relative;z-index:2147483647987;";
        }, 5000);
    }
} else if (location.host.indexOf('www.mtosz.com') !== -1) {
    displayNone([".video-panel-blur-image"]); // 似乎不管用？
    doElement(".video-panel-blur-image", function(element) {
        element.style = "display: none; height: 0; width: 0;";
    })
    移除解析框架();
} else if (location.host.indexOf('v.superchen.top:3389') !== -1) {
    移除解析框架();
} else if (location.host.indexOf('jx.parwix.com:4433') !== -1) {
    移除解析框架();
} else if (window === top) {
    function detectMobile() {
        return (
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/SymbianOS/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        );
    }

    if (!detectMobile()) {
        if (location.host.indexOf("v.qq.com") !== -1) {
            readyPlayerBox("已进入腾讯视频", ["#mask_layer", ".mod_vip_popup", "#mask_layer"], setings.NoAD解析.OK解析, "div#mod_player", null);
        } else if (location.host.indexOf("iqiyi.com") !== -1) {
            readyPlayerBox("已进入爱奇艺", null, setings.NoAD解析.OK解析, "iqpdiv.iqp-player[data-player-hook=mainlayer]", null);
        } else if (location.host.indexOf("youku.com") !== -1) {
            readyPlayerBox("已进入优酷视频", ["#iframaWrapper"], setings.NoAD解析.久播解析, "#player", null);
        } else if (location.host.indexOf("bilibili.com") !== -1) {
            doElements("div[role=tooltip]:not([class*=popover-])", function(loginTip) {
                displayNone(["#" + loginTip[6].id]);
            }, 1000, 6);
            doElement("svg[aria-hidden=true]", function() {
                readyPlayerBox("已进入哔哩哔哩", null, setings.NoAD解析.夜幕解析, "div.bpx-player-video-area,div.mask-container", null); // TODO || document.getElementById("bilibiliPlayer") || document.getElementById("live-player-ctnr")
            });
        } else if (location.host.indexOf("miguvideo.com") !== -1) {
            readyPlayerBox("已进入咪咕视频", null, setings.NoAD解析.虾米解析, "section#mod-player", null);
        } else if (location.host.indexOf("le.com") !== -1) {
            readyPlayerBox("已进入乐视TV", null, setings.NoAD解析.云解析, "#le_playbox", null);
        } else if (location.host.indexOf("tv.sohu.com") !== -1) {
            readyPlayerBox("已进入搜狐视频", null, setings.NoAD解析.夜幕解析, "#player,#sohuplayer,.player-view", null);
        } else if (location.host.indexOf("mgtv.com") !== -1) {
            readyPlayerBox("已进入芒果TV", null, setings.NoAD解析.久播解析, "#mgtv-player-wrap", null);
        } else if (location.host.indexOf("ixigua.com") !== -1) {
            readyPlayerBox("已进入西瓜视频", null, setings.NoAD解析.夜幕解析, "div.teleplayPage__playerSection", function(playerBox) {
                playerBox.style.paddingTop = "39.8741%";
            });
        } else if (location.host.indexOf("pptv.com") !== -1) {
            readyPlayerBox("已进入PPTV", null, setings.NoAD解析.OK解析, "div.w-video", null);
        } else if (location.host.indexOf("vip.1905.com") !== -1) {
            readyPlayerBox("已进入1905电影网", null, setings.NoAD解析.云解析, "div#playBox", null);
        } else if (location.host.indexOf("www.wasu.cn") !== -1) {
            readyPlayerBox("已进入华数TV", null, setings.NoAD解析.OK解析, "div#pcplayer", null);
        }
    } else {
        if (location.host.indexOf("v.qq.com") !== -1) {
            readyPlayerBox("已进入腾讯视频", [".mod_vip_popup", "a[class*=app]", "div[dt-eid=open_app_bottom]", "a[open-app]", "section.mod_source"], setings.NoAD解析.OK解析, "section.mod_player", null, (function(searchJSON) {
                if (searchJSON) {
                    if (searchJSON["cid"]) {
                        if (searchJSON["id"]) {
                            return location.protocol + '//v.qq.com/detail/' + searchJSON["cid"][0] + '/' + searchJSON["cid"] + '.html';
                        } else if (searchJSON["vid"]) {
                            return location.protocol + '//v.qq.com/x/cover/' + searchJSON["cid"] + '/' + searchJSON["vid"] + '.html';
                        } else {
                            return location.protocol + '//v.qq.com/x/cover/' + searchJSON["cid"] + '.html';
                        }
                    } else if (searchJSON["vid"]) {
                        return location.protocol + '//v.qq.com/x/page/' + searchJSON["vid"] + '.html';
                    } else if (searchJSON["lid"]) {
                        return location.protocol + '//v.qq.com/detail/' + searchJSON["lid"][0] + '/' + searchJSON["lid"] + '.html';
                    } else {
                        return location.protocol + '//v.qq.com/';
                    }
                } else {
                    return null;
                }
            })(searchToJSON(location.search)));
        } else if (location.host.indexOf("iqiyi.com") !== -1) {
            readyPlayerBox("已进入爱奇艺", ["div.m-iqyGuide-layer", "a[down-app-android-url][style^='background-image:']"], setings.NoAD解析.OK解析, "section.m-video-player", null);
        } else if (location.host.indexOf("youku.com") !== -1) {
            readyPlayerBox("已进入优酷视频", ["#iframaWrapper"], setings.NoAD解析.久播解析, "#player", null);
        } else if (location.host.indexOf("bilibili.com") !== -1) {
            readyPlayerBox("已进入哔哩哔哩", ["div.fe-ui-open-app-btn,div.recom-wrapper,open-app-btn"], setings.NoAD解析.夜幕解析, "div#app.main-container div.player-wrapper", null, window.location.href.replace("m.bilibili.com", "www.bilibili.com"));
        } else if (location.host.indexOf("miguvideo.com") !== -1) {
            readyPlayerBox("已进入咪咕视频", null, setings.NoAD解析.虾米解析, "section#mod-player", null);
        } else if (location.host.indexOf("le.com") !== -1) {
            forElement("div.layout", function(layout) {
                layout.removeAttribute("style");
            }, 3000);
            readyPlayerBox("已进入乐视TV", ["a.leapp_btn", "div.full_gdt_bits[id^=full][data-url]", "[class*=Daoliu]"], setings.NoAD解析.云解析, "div.column.play", null);
        } else if (location.host.indexOf("tv.sohu.com") !== -1) {
            readyPlayerBox("已进入搜狐视频", ["div[class^=banner]", "div.js-oper-pos"], setings.NoAD解析.夜幕解析, "#player,#sohuplayer,.player-view", null);
        } else if (location.host.indexOf("mgtv.com") !== -1) {
            readyPlayerBox("已进入芒果TV", ["div.adFixedContain", "div.ad-banner", "div[class^=mg-app]", "div.ht.mgui-btn.mgui-btn-nowelt"], setings.NoAD解析.久播解析, "div.video-area", null);
        } else if (location.host.indexOf("ixigua.com") !== -1) {
            readyPlayerBox("已进入西瓜视频", ["div.xigua-download", "div.xgplayer-mobile", "div.xigua-guide-button"], setings.NoAD解析.夜幕解析, "div.xigua-detailvideo-video", null);
        } else if (location.host.indexOf("pptv.com") !== -1) {
            readyPlayerBox("已进入PPTV", ["[data-darkreader-inline-bgimage][data-darkreader-inline-bgcolor]", "div[class^=pp-m-diversion]", "section#ppmob-detail-picswiper", "section.layout.layout_ads", "div.foot_app", "div[modulename=导流位]"], setings.NoAD解析.OK解析, "section.pp-details-video", null);
        } else if (location.host.indexOf("vip.1905.com") !== -1) {
            readyPlayerBox("已进入1905电影网", ["a.new_downLoad[target=_blank]", "iframe[srcdoc^='<img src=']"], setings.NoAD解析.云解析, "div.area.areaShow.clearfix_smile", null);
        } else if (location.host.indexOf("www.wasu.cn") !== -1) {
            readyPlayerBox("已进入华数TV", ["div.ws_poster", "div.appdown", "div#play_and_info_fix_adv"], setings.NoAD解析.OK解析, "div#player,div#pop", null);
        }
    }

    function readyPlayerBox(Tip, displayNones, src, cssString, doFunction, href = null) {
        if (Tip) {
            console.log("%c" + Tip, setings.fontStyle.maxTip);
        }
        onLocationChange(function() {
            location.reload(); // TODO 如果网页rul变了就刷新页面
        });
        if (displayNones) {
            displayNone(displayNones);
        }
        doElement(cssString, function(playerBox) {
            setInterval(function() {
                for (let link of document.querySelectorAll("a")) {
                    link.onclick = function() {
                        if (link.host === location.host) {
                            location.href = link.href
                        }
                    }
                }
            }, 1500);
            let iframe = document.createElement("iframe");
            iframe.id = "iframePlayer";
            iframe.allowFullscreen = true;
            iframe.frameBorder = "0"; // HTML5已弃用此属性，并使用style.border代替
            iframe.style = "background-color: #000; border: 0px;" +
                " min-width: 100%; width: 100%; min-height: 100%; height: 100%;" +
                " position: absolute; left: 0px; top: 0px; z-index: 2147483647;";
            if (!href) {
                iframe.src = src ? src + location.href : "";
            } else {
                iframe.src = src ? src + href : "";
            }
            playerBox.appendChild(iframe);
            console.log("%cplayerBox已建立解析连接", setings.fontStyle.maxTip);

            // 自定义解析线路
            let DIY_iframe = document.createElement("div");
            DIY_iframe.style = "display: flex; background-color: #0000; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; min-width: 320px; width: 30%; height: 34px; position: fixed; left: 10px; bottom: 45px; z-index: 2147483647;";
            DIY_iframe.innerHTML = "<select style='border: 0; background-color: #ddd; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; text-align: center; min-width: 80px; width: 80px; height: 100%;'></select>" +
                "<input type='text' style='border: 0; background-color: #eee; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; padding-left: 10px; flex-grow: 1; width: 185px; height: 100%;' placeholder='解析网址(当前网址请留空)'>" +
                "<button style='background-color: #08f; font-family: 微软雅黑,黑体,Droid Serif,sans-serif,SansSerif,serif; font-size: 14px; text-align: center; color: #fff; min-width: 55px; width: 54px; height: 100%; border-bottom-right-radius: 17px; border-top-right-radius: 15px;'>解析</button>";
            let DIY_iframe_text = DIY_iframe.querySelector("input[type=text]");

            function DIY_iframe_src() {
                iframe.src = DIY_iframe_select.options[DIY_iframe_select.selectedIndex].value + (DIY_iframe_text.value ? DIY_iframe_text.value : location.href);
            }

            let DIY_iframe_select = DIY_iframe.querySelector("select");
            for (let name in setings.NoAD解析) {
                DIY_iframe_select.innerHTML += "<option value='" + setings.NoAD解析[name] + "' style='text-align: center'>" + name + "</option>";
            }
            DIY_iframe.querySelector("option[value='" + src + "']").selected = true;
            DIY_iframe.querySelector("button").onclick = function() {
                DIY_iframe_src();
            }
            DIY_iframe_text.onkeydown = DIY_iframe_select.onkeydown = function(event) {
                if (event.key === "Enter") {
                    DIY_iframe_src();
                }
            }
            document.body.appendChild(DIY_iframe);

            if (doFunction) {
                doFunction(playerBox);
            }
            setInterval(function() {
                for (let video of document.getElementsByTagName("video")) {
                    if (video.src) {
                        video.removeAttribute("src");
                        video.load();
                    }
                }
                for (let video of flash.getElementsByTagName("video")) {
                    if (video.src) {
                        video.removeAttribute("src");
                        video.load();
                    }
                }
            }, 300);
        });
    }
} else {
    try {
        if (location.hostname !== top.location.hostname) {
            // 移除video.poster
            console.log(location.href + " 准备移除poster")
            forElement("video", function(video) {
                console.log(location.href + " 将移除poster: " + video.poster);
                video.removeAttribute("poster");
            }, 5000);
        }
    } catch (e) {
        // 排除跨域错误
    }
}

function displayNone(Tags) {
    let style = document.createElement("style");
    style.innerHTML = "\n"
    for (let i = 0; i < Tags.length; i++) {
        style.innerHTML += Tags[i] + "{display: none; height: 0; width: 0; visibility: hidden; max-height: 0; max-width: 0;}\n"
    }
    document.head.insertBefore(style, document.head.firstChild);
}

function onLocationChange(handler) {
    let url = top.location.pathname;
    let onLocationChangeInterval = setInterval(function() {
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
        setTimeout(function() {
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
            ) +
            "\"}"
        );
    } else {
        return null;
    }
}