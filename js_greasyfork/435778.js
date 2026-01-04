// ==UserScript==
// @namespace    https://tenfond.outlook.com/vip-video-player
// @name         全网VIP视频自动解析播放
// @version      0.2.6.4
// @author       Tenfond
// @description  无需跳转新网址，打开官网直接看，超清 无广告 无水印。支持：腾讯，爱奇艺，优酷，哔哩哔哩动画，咪咕，乐视，搜狐，芒果，西瓜，PPTV，1905电影网，华数
// @match        *://v.qq.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://www.bilibili.com/*
// @match        *://*.miguvideo.com/*
// @match        *://*.le.com/*
// @match        *://*.sohu.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.pptv.com/*
// @match        *://vip.1905.com/*
// @match        *://*.wasu.cn/*
// @match        *://www.mtosz.com/m3u8.php?url=*
// @match        *://v.superchen.top:3389/m3u8.php?url=*
// @match        *://api.okjx.cc:3389/jx.php?url=*
// @match        *://jx.parwix.com:4433/player/analysis.php?v=*
// @downloadURL https://update.greasyfork.org/scripts/435778/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/435778/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
//暂无解析 @match        *://fun.tv/*
//暂无解析 @match        *://*.fun.tv/*
 
// 该脚本如有待改进的地方欢迎联系 tenfond@outlook.com
 
// (true:开启|false:关闭)
var setings = {
    弹幕: false,
    /*
    *    (): 小括号括住的表示推荐解析 画质高 速度快
    *    : 无括号的表示视频带水印 或 原页面画质
    *    []: 方括号表示标清画质 不推荐
    */
    无广告解析: {    // TODO by 17kyun.com/api.php?url=
        OK解析: "https://api.okjx.cc:3389/jx.php?url=" || "https://m2090.com/?url=",    // TODO 优质: (腾讯) (爱奇艺) 优酷 乐视 芒果 (PPTV) (华数)
        Mao解析: "https://www.mtosz.com/m3u8.php?url=",    // TODO 无水印(但不稳定): 腾讯 (爱奇艺) (优酷) 乐视 (芒果) (PPTV) (华数)
        云解析: "https://jx.aidouer.net/?url=" || "https://jx.ppflv.com/?url=",    // TODO 腾讯 [爱奇艺] 优酷 (乐视) 芒果 (1905电影网) [华数]
        久播解析: "https://www.qianyicp.com/vip/vip_g.php?url=",    // TODO 腾讯 爱奇艺 优酷 咪咕 乐视 (搜狐) (芒果) 西瓜 PPTV
        虾米解析: "https://jx.xmflv.com/?url=",    // TODO (土豆) (咪咕) 搜狐
        Parwix解析: "https://jx.parwix.com:4433/player/analysis.php?v=" || "https://vip.parwix.com:4433/player/?url=" || "https://www.yemu.xyz/?url=",    // TODO (西瓜) (B站)
        云博解析: "https://jx.yunboys.cn/?url="    // TODO 土豆 华数    // by www.yunboys.cn
    },
    // 获取框架循环时间
    getElementTimes: 300,
    // 记录被此脚本删除的Element，以便最后查找用
    removedElements: document.createElement("div")
}
// 初始化WindowData
let windowData = document.createElement("data");
windowData.id = "windowData";
windowData.innerHTML = "{}";
document.head.appendChild(windowData);
 
// 创建记录此脚本当前window的Interval计时器ID
doWindowData(function (data) {
    data.IntervalsID = [];
    return data;
});
 
function doWindowData(doFunction, doWindow = window) {
    try {
        let data = JSON.parse(doWindow.document.head.querySelector("data#windowData").innerHTML);
        data = doFunction(data);
        if (data) {
            doWindow.document.head.querySelector("data#windowData").innerHTML = JSON.stringify(data);
        }
    } catch (e) {
        // 排除跨域错误
    }
}
 
function setMyInterval(handler, timeout = 0) {
    let intervalId = setInterval(handler, timeout);
    doWindowData(function (data) {
        data.IntervalsID.push(intervalId);
        return data;
    });
    return intervalId;
}
 
var doElement = function (evalString, doFunction) {
    let Element = eval(evalString);
    if (Element !== null && Element.nodeType === 1) {
        doFunction(Element);
        console.log("已为 " + evalString + " 进行了操作");
    } else if (document.readyState !== "complete") {
        console.log("正在查找 " + evalString);
        setTimeout(function () {
            doElement(evalString, doFunction);
        }, setings.getElementTimes);
    } else {
        console.log("%c未找到 " + evalString, 'color: #f00;');
    }
}
 
function removeElements(ElementsStrings) {
    console.log("正在检测并移除 " + ElementsStrings);
    let removeElementsInterval = setMyInterval(function () {
        if (ElementsStrings.length > 0) {
            for (let i in ElementsStrings) {
                let Elements = eval(ElementsStrings[i]);
                try {
                    if (Elements.nodeType === 1) {
                        setings.removedElements.appendChild(Elements);
                        Elements.parentNode.removeChild(Elements);
                        ElementsStrings.splice(i, 1);
                    } else if (Elements.length !== (undefined && 0)) {
                        for (let Element of Elements) {
                            setings.removedElements.appendChild(Elements);
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
    window.onunload = function () {
        clearInterval(removeElementsInterval);
    }
}
 
setTimeout(function () {
    if (location.host.indexOf("api.okjx.cc:3389") !== -1) {
        // 删除OK解析线路选择功能
        displayNone([".slide", ".panel"]);
    } else if (location.host.indexOf('www.mtosz.com') !== -1) {
        // displayNone([".video-panel-blur-image"]);    似乎不管用？
        doElement('document.querySelector(".video-panel-blur-image")', function (element) {
            element.style = "display: none;height: 0;width: 0;";
        })
        // 移除广告模块
        removeElements([
            'document.getElementById("ADplayer")',
            'document.getElementById("ADtip")'
        ]);
        // 移除弹幕模块
        if (setings.弹幕 === false) {
            console.log("正在移除弹幕功能");
            removeElements([
                'document.getElementsByClassName("leleplayer-video-wrap")[0].getElementsByTagName("div")',
                'document.getElementsByClassName("leleplayr-danmu")',
                'document.getElementsByClassName("leleplayer-comment-box")[0]',
                'document.getElementsByClassName("leleplayer-controller-mask")[0]',
                'document.getElementsByClassName("leleplayer-list-icon")[0]',
                'document.getElementsByClassName("leleplayer-menu")[0]'
            ]);
        }
        doElement('document.getElementById("lelevideo")', function (element) {
            element.removeAttribute('poster');
        });
    } else if (location.host.indexOf('v.superchen.top:3389') !== -1) {
        // 移除广告模块
        removeElements([
            'document.getElementById("ADplayer")',
            'document.getElementById("ADtip")'
        ]);
        // 移除弹幕模块
        if (setings.弹幕 === false) {
            console.log("正在移除弹幕功能");
            removeElements([
                'document.getElementsByClassName("leleplayer-video-wrap")[0].getElementsByTagName("div")',
                'document.getElementsByClassName("leleplayr-danmu")',
                'document.getElementsByClassName("leleplayer-comment-box")[0]',
                'document.getElementsByClassName("leleplayer-controller-mask")[0]',
                'document.getElementsByClassName("leleplayer-list-icon")[0]',
                'document.getElementsByClassName("leleplayer-menu")[0]'
            ]);
        }
        doElement('document.querySelector(".leleplayer-video-current")', function (element) {
            element.removeAttribute('poster');
        });
    } else if (location.host.indexOf('jx.parwix.com:4433') !== -1) {
        // 移除广告模块
        removeElements([
            'document.getElementById("ADplayer")',
            'document.getElementById("ADtip")'
        ]);
        // 移除弹幕模块
        if (setings.弹幕 === false) {
            console.log("正在移除弹幕功能");
            removeElements([
                'document.getElementsByClassName("yzmplayer-video-wrap")[0].getElementsByTagName("div")',
                'document.getElementsByClassName("yzmplayr-danmu")',
                'document.getElementsByClassName("yzmplayer-comment-box")[0]',
                'document.getElementsByClassName("yzmplayer-controller-mask")[0]',
                'document.getElementsByClassName("yzmplayer-list-icon")[0]',
                'document.getElementsByClassName("yzmplayer-menu")[0]'
            ]);
        }
    } else {
        if (location.host.indexOf("v.qq.com") !== -1) {
            readyPlayerBox("已进入腾讯视频", ["#mask_layer", ".mod_vip_popup", "#mask_layer", ".mod_vip_popup"], setings.无广告解析.OK解析, 'document.getElementById("mod_player").parentElement', null);
        } else if (location.host.indexOf(".iqiyi.com") !== -1) {
            readyPlayerBox("已进入爱奇艺", null, setings.无广告解析.Mao解析, 'document.getElementById("block-B").getElementsByClassName("player-mnc")[0] || document.getElementById("lequPlayer").parentElement', null);
            doElement('document.querySelector("div[name=playAb]");', function (element) {
                setMyInterval(function () {
                    element.removeAttribute('style');
                })
            });
            removeElements(['document.querySelector(".qy-player-absolute") || document.querySelector("#realFlashbox")']);
        } else if (location.host.indexOf(".youku.com") !== -1) {
            readyPlayerBox("已进入优酷视频", ["#iframaWrapper"], setings.无广告解析.Mao解析, 'document.getElementById("player")', null);
        } else if (location.host.indexOf("www.bilibili.com") !== -1) {
            readyPlayerBox("已进入哔哩哔哩动画", null, setings.无广告解析.Parwix解析, 'document.getElementById("player_module") || document.getElementById("bilibili-player")', null);    // TODO || document.getElementById("live-player-ctnr")
        } else if (location.host.indexOf(".miguvideo.com") !== -1) {
            readyPlayerBox("已进入咪咕视频", null, setings.无广告解析.虾米解析, 'document.getElementsByClassName("webPlay")[0]', null);
        } else if (location.host.indexOf(".le.com") !== -1) {
            readyPlayerBox("已进入乐视TV", null, setings.无广告解析.云解析, 'document.getElementById("le_playbox")', null);
        } else if (location.host.indexOf(".sohu.com") !== -1) {
            readyPlayerBox("已进入搜狐视频", null, setings.无广告解析.久播解析, 'document.getElementById("player") || document.getElementById("sohuplayer")', null);
        } else if (location.host.indexOf("mgtv.com") !== -1) {
            readyPlayerBox("已进入芒果TV", null.setings.无广告解析.久播解析, 'document.getElementById("mgtv-player-wrap")', null);
        } else if (location.host.indexOf("ixigua.com") !== -1) {
            readyPlayerBox("已进入西瓜视频", null, setings.无广告解析.Parwix解析, 'document.querySelector(".teleplayPage__playerSection__left")', function (playerBox) {
                playerBox.style.paddingTop = "39.8741%";
            });
        } else if (location.host.indexOf("pptv.com") !== -1) {
            readyPlayerBox("已进入PPTV", ["[data-darkreader-inline-bgimage][data-darkreader-inline-bgcolor]"], setings.无广告解析.OK解析, 'document.getElementById("pptv_playpage_box")', null);
        } else if (location.host.indexOf("vip.1905.com") !== -1) {
            readyPlayerBox("已进入1905电影网", null, setings.无广告解析.云解析, 'document.getElementById("playBox")', null);
        } else if (location.host.indexOf("wasu.cn") !== -1) {
            readyPlayerBox("已进入华数TV", null, setings.无广告解析.OK解析, 'document.getElementById("player")', null);
            if (location.host.indexOf("wasu.cn") !== -1) {
                // 直接播放
                if (window === top) {
                    createPlayer();
                }
            }
        } else {
            return;
        }
 
        function readyPlayerBox(Tip, displayNones, src, evalString, doFunction) {
            if (window === top) {
                console.group(Tip);
                onLocationChange(function () {
                    location.reload();    // TODO 如果网页rul变了就刷新页面
                });
                if (displayNones) {
                    displayNone(displayNones);
                }
                setPlayerBox(src, evalString, doFunction);
 
                function setPlayerBox(src, evalString, doFunction) {
                    let playerBox = eval(evalString);
                    console.log("playerBox is " + playerBox + " and document.state = " + document.readyState);
                    if (playerBox !== null && playerBox.nodeType === 1) {
                        let iframe = document.createElement("iframe");
                        iframe.id = "iframePlayer";
                        iframe.allowFullscreen = true;
                        iframe.frameBorder = "0";   // HTML5已弃用此属性，并使用style.border代替
                        iframe.style = "background-color: #000; border: 0px; min-width: 100%; width: 100%; min-height: 100%; height: 100%; position: absolute; left: 0px; top: 0px; z-index: 2147483647;";
                        iframe.src = src + location.href;
                        playerBox.appendChild(iframe);
                        console.log("playerBox已建立解析连接");
 
                        setMyInterval(function () {
                            for (let video of document.getElementsByTagName("video")) {
                                if (video.played) {
                                    video.pause();
                                }
                            }
                            for (let video of setings.removedElements.getElementsByTagName("video")) {
                                if (video.played) {
                                    video.pause();
                                }
                            }
                        }, 300);
 
                        if (doFunction) {
                            doFunction(playerBox);
                        }
                        console.groupEnd();
                    } else if (document.readyState !== "complete") {
                        setTimeout(function () {
                            console.log("正在查找 playerBox");
                            setPlayerBox(src, evalString, doFunction);
                        }, setings.getElementTimes);
                    } else {
                        console.log("%c未找到 playerBox", 'color: #f00;');
                        console.groupEnd();
                    }
                }
            }
            try {
                top.onload = setTimeout(function () {
                    try {
                        // 清除Top中非此脚本的Interval计时器
                        for (let i = 0; i < 1000; i++) {
                            doWindowData(function (data) {
                                if (data.IntervalsID.indexOf(i) === -1) {
                                    top.clearInterval(i);
                                }
                            }, top);
                        }
                    } catch (e) {
                        // 排除跨域错误
                    }
                });
            } catch (e) {
                // 排除跨域错误
            }
        }
    }
});
 
function displayNone(Tags) {
    let style = document.createElement("style");
    style.innerHTML = "\n"
    for (let i = 0; i < Tags.length; i++) {
        style.innerHTML += Tags[i] + "{display: none;height: 0;width: 0;}\n"
    }
    document.head.appendChild(style);
}
 
function onLocationChange(handler) {
    let url = top.location.href;
    let onLocationChangeInterval = setMyInterval(function () {
        let href = top.location.href;
        if (href !== url) {
            handler();
            clearInterval(onLocationChangeInterval);
        } else {
            url = href;
        }
    }, 200);
}