// ==UserScript==
// @name         BiliBili 内容优化|屏蔽增强|低质量UP屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  基于拦截请求的 Bilibili 内容优化插件
// @license MIT
// @author       NoBB
// @match        https://www.bilibili.com/
// @match        https://api.bilibili.com/
// @icon            https://www.bilibili.com/favicon.ico
// @match           https://www.bilibili.com/*
// @match           https://www.bilibili.com/video/*/*
// @match           https://www.bilibili.com/video/*
// @match           https://search.bilibili.com/*
// @match           https://www.bilibili.com/v/popular/all/*
// @match           https://www.bilibili.com/v/popular/weekly/*
// @match           https://www.bilibili.com/v/popular/history/*
// @exclude         https://www.bilibili.com/anime/*
// @exclude         https://www.bilibili.com/movie/*
// @exclude         https://www.bilibili.com/guochuang/*
// @exclude         https://www.bilibili.com/variety/*
// @exclude         https://www.bilibili.com/tv/*
// @exclude         https://www.bilibili.com/documentary*
// @exclude         https://www.bilibili.com/mooc/*
// @exclude         https://www.bilibili.com/v/virtual/*
// @exclude         https://www.bilibili.com/v/popular/music/*
// @exclude         https://www.bilibili.com/v/popular/drama/*
// @grant           unsafeWindow
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @require         https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-w/vue/3.2.31/vue.global.min.js
// @grant        none
// @run-at       document-start
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/498835/BiliBili%20%E5%86%85%E5%AE%B9%E4%BC%98%E5%8C%96%7C%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%7C%E4%BD%8E%E8%B4%A8%E9%87%8FUP%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498835/BiliBili%20%E5%86%85%E5%AE%B9%E4%BC%98%E5%8C%96%7C%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%7C%E4%BD%8E%E8%B4%A8%E9%87%8FUP%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

"use strict";

// 过滤配置
let blockSettings = {
    // 根据标题过滤
    byTitle: {
        enabled: true,
        regexp: false,
        blackList: [
            "纪录片", "单机离线版", "下载", "白嫖", "免费", "资源分享", "拒绝一切社交", "猫一杯", "战况解析", "python接单", "AI换脸", "chatgpt"]
    }, "byUserName": {
        "enabled": true, "regexp": false, "blackList": ["python", "中医", "纪录片", "二狗App-单身青年故事", "军情", "阿坤纪录片传奇", "娱乐", "人民心声", "评论员", "人民动态", "古城亲亲", "大大千面", "人性智慧之光", "杨藩讲艺术"],
    },
    // 根据用户名过滤
    byUserName: {
        enabled: true,
        regexp: false,
        blackList: [
            "中医",
            "纪录片",
            "二狗App-单身青年故事",
            "军情",
            "阿坤纪录片传奇",
            "娱乐",
            "人民心声",
            "评论员",
            "人民动态",
            "古城亲亲",
            "大大千面",
            "人性智慧之光",
            "杨藩讲艺术"],
    },
    // 根据用户ID过滤
    byUserId: {
        enabled: true,
        blackList: [
            "1753768110", "3546691766586028", "476963415", "2050448795", "2117439536", "510892181", "3493145461393694", "404194769", "425538832", "2104210484", "1895305615", "375100514", "3546638165478259", "544106740", "385645933", 310844810, "128580869", "2074735306", "207285584", "3537104715909319", "3493092743187140", "107861587", "1197689164", "82363089", "25473403", "52764688", "562142378", "519514228", "893892", "12638031", "39422678", "15303993", "505422611", "1034643771", "1995815895", "3493141279672411", "404200957", "500116147", "98600335", "508709785", "33256988", "25200326", "3546645719419419", "689554001", "23268144", "414271158", "3546585197709871", "107457908", "502810214", "688174628", "1089706429", "223357914", "35127124", "10154196", "3546614245361669", "3493083991771669", "1283676771", "451560057", "670825272", "1749217079", "5992670", "1025592457", "527383938", "1525355", "352068290", "95994636", "1641484091", "207704732", "1909782963", "454271602", "38276801", "439390610", "245645656", "481872624", "8480063", "3546391838197831", "20611070", "11280389", "1645147838", "1670977922", "387507650", "1732848825", "3493285280615392", "314175457", "629515024", "617764854", "3546695942015651", "3888666", "2055926626"],
    },
    // 根据浏览量过滤
    byViewCount: {
        enabled: false,
        value: -1,
    },
    // 根据弹幕数量过滤
    byDanmaku: {
        enabled: false,
        value: -1,
    },
    // 根据点赞数量过滤
    byLike: {
        enabled: false,
        value: -1,
    },
    // 根据视频时长过滤
    byDuration: {
        enabled: false,
        value: -1,
    },
    // 过滤直播
    byLive: {
        enabled: true,
    }
}

let latestBvid = null;
let latestUpdateTime = null;

const configData = localStorage.getItem("GM_BlockSettings");
if (configData) {
    blockSettings = JSON.parse(configData);
}

(function () {
    'use strict';

    // 保存配置
    function saveBlockSettings() {
        // GM_setValue("GM_BlockSettings", blockSettings);
        localStorage.setItem("GM_BlockSettings", JSON.stringify(blockSettings));
    }

    // 根据用户编号屏蔽
    function setBlockByUserId(uid, isBlock) {
        uid = uid + "";
        if (isBlock) {
            if (!blockSettings.byUserId.blackList.includes(uid)) {
                blockSettings.byUserId.blackList.push(uid);
            }
        } else {
            blockSettings.byUserId.blackList = blockSettings.byUserId.blackList.filter(item => item !== uid);
        }
        saveBlockSettings();
    }

    // 屏蔽推广卡片样式
    function rewriteRecommandStyle() {
        const DOMs = document.getElementsByClassName("floor-single-card");
        for (let i = 0; i < DOMs.length; i++) {
            const dom = DOMs[i];
            dom.style = "display: none !important;"
        }
    }

    // 创建屏蔽按钮
    function createBlockButton(title, cb, color = "#9499A0", size = 24) {
        const blockButton = document.createElement("a");
        blockButton.href = "javascript:;";
        blockButton.onclick = cb;
        blockButton.className = "block-button";
        blockButton.innerHTML = `<svg t="1719294169106" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2751" width="${size}" height="${size}" fill="${color}"><path d="M671.9488 303.3088c0-112.9472-91.904-204.8512-204.8512-204.8512S262.2464 190.3104 262.2464 303.3088c0 72.6528 38.0928 136.6016 95.2832 172.9536-123.0336 44.8512-211.1488 163.072-211.1488 301.4144 0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6c0-148.6336 120.9344-269.5168 269.5168-269.5168 112.9472 0 204.8512-91.904 204.8512-204.8512zM467.0976 456.96c-84.736 0-153.6512-68.9152-153.6512-153.6512s68.9152-153.6512 153.6512-153.6512 153.6512 68.9152 153.6512 153.6512-68.9152 153.6512-153.6512 153.6512zM706.5088 489.6768c-101.12 0-183.4496 82.2784-183.4496 183.4496 0 101.12 82.2784 183.4496 183.4496 183.4496 101.1712 0 183.4496-82.2784 183.4496-183.4496-0.0512-101.12-82.3296-183.4496-183.4496-183.4496z m-132.2496 183.4496c0-72.9088 59.3408-132.2496 132.2496-132.2496 27.904 0 53.8112 8.704 75.1616 23.552l-188.1088 177.3568c-12.2368-20.0192-19.3024-43.52-19.3024-68.6592z m132.2496 132.2496c-29.3376 0-56.4224-9.6256-78.3872-25.8048l189.2352-178.432a131.4304 131.4304 0 0 1 21.4016 71.9872c-0.0512 72.9088-59.3408 132.2496-132.2496 132.2496z" fill="#252424" p-id="2752"></path></svg>
<span style="color: ${color}">${title}</span>`;
        blockButton.style = `margin-left: 5px; color: ${color};`
        return blockButton;
    }

    // 在视频卡片上追加屏蔽按钮
    function addBlockButtonToCard() {
        const DOMs = document.getElementsByClassName("bili-video-card");
        for (let i = 0; i < DOMs.length; i++) {
            const DOM = DOMs[i];
            const bottomDOM = DOM.getElementsByClassName("bili-video-card__info--bottom")[0];
            if (bottomDOM && bottomDOM.getElementsByClassName("block-button").length === 0) {
                const blockButton = createBlockButton("屏蔽UP", () => {
                    console.log(DOM, bottomDOM);
                    const ownerInfoDOM = bottomDOM.getElementsByClassName("bili-video-card__info--owner")[0];
                    if (ownerInfoDOM) {
                        const uid = ownerInfoDOM.href.substr(ownerInfoDOM.href.lastIndexOf("/") + 1);
                        blockSettings.byUserId.blackList.push(uid);
                        saveBlockSettings();
                        if (DOM.parentNode?.className === "feed-card") {
                            DOM.parentNode.parentNode.removeChild(DOM.parentNode);
                        } else {
                            DOM.parentNode.removeChild(DOM);
                        }
                    }
                });
                bottomDOM.appendChild(blockButton);
            }
        }
    }

    // 读取流数据
    function readJsonFromStream(stream) {
        return new Promise((resolve, reject) => {
            const reader = stream.getReader();
            let data = "";
            reader.read().then(function process({ done, value }) {
                if (done) {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                    return;
                }
                data += new TextDecoder().decode(value);
                // 读取下一段数据
                return reader.read().then(process);
            });
        });
    }

    // 创建响应数据
    function createResponse(data) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(JSON.stringify(data));

        // 创建一个ReadableStream，使用Uint8Array作为其源
        const stream = new ReadableStream({
            start(controller) {
                // 将编码后的数据推送到流中
                controller.enqueue(encodedData);
                // 当所有数据都推送完毕后，关闭流
                controller.close();
            }
        });
        return new Response(stream);
    }

    // 检查视频标题是否被屏蔽
    function checkBlockByTitle(title) {
        if (blockSettings.byTitle.enabled) {
            if (blockSettings.byTitle.regexp) {
                // 正则过滤
                return !!blockSettings.byTitle.blackList.find((regexp) => {
                    return title.match(regexp);
                });
            } else {
                // 普通过滤
                return !!blockSettings.byTitle.blackList.find((t) => {
                    return title.toLowerCase().includes(t.toLowerCase());
                });
            }
        }
        return false;
    }

    // 检查视频UP主是否被屏蔽
    function checkBlockByUpName(name) {
        if (blockSettings.byUserName.enabled) {
            if (blockSettings.byUserName.regexp) {
                // 正则过滤
                return !!blockSettings.byUserName.blackList.find((regexp) => {
                    return name?.match(regexp);
                });
            } else {
                // 普通过滤
                return !!blockSettings.byUserName.blackList.find((n) => {
                    return name?.toLowerCase().includes(n.toLowerCase());
                });
            }
        }
        return false;
    }

    // 检查视频UP主ID是否被屏蔽
    function checkBlockByUpUid(uid) {
        if (blockSettings.byUserId.enabled) {
            return !!blockSettings.byUserId.blackList.find((id) => {
                return id + "" === uid + "";
            });
        }
        return false;
    }

    // 优化推荐数据
    function optimizeRecommandVideoData(data) {
        const originalData = JSON.parse(JSON.stringify(data));
        const filterData = data.filter((video) => {
            const { bvid, duration, goto, is_followed, owner, rcmd_reason, room_info, stat, title, uri } = video;
            if (blockSettings.byLive.enabled && goto === "live") {
                return false;
            }
            if (blockSettings.byDuration.enabled && duration < blockSettings.byDuration.value) {
                return false;
            }
            if (blockSettings.byLike.enabled && stat.like < blockSettings.byLike.value) {
                return false;
            }
            if (blockSettings.byViewCount.enabled && stat.view < blockSettings.byViewCount.value) {
                return false;
            }
            if (blockSettings.byDanmaku.enabled && stat.danmaku < blockSettings.byDanmaku.value) {
                return false;
            }

            const blockByTitle = checkBlockByTitle(title);
            const blockByUserName = owner ? checkBlockByUpName(owner?.name) : false;
            const blockByUpUid = owner ? checkBlockByUpUid(owner?.mid) : false;
            const shouldBlock = blockByTitle || blockByUserName || blockByUpUid;

            return bvid.length > 0 && goto !== "ad" && !shouldBlock;
        }).map((video) => {
            return video;
        });
        if (originalData.length !== filterData.length) {
            console.log("已过滤视频：", originalData.length - filterData.length, originalData.filter((video) => !filterData.find(item => item.bvid === video.bvid)));
        }
        return filterData;
    }

    // 重新设置视频播放页面内容
    function resetVideoPageElements(stateData) {
        if (stateData) {
            // 播放页面内容处理
            if (window.parent.location.pathname.startsWith("/video/")) {
                // stateData.adData = {};
                stateData.related = optimizeRecommandVideoData(stateData.related);
                const blockByTitle = checkBlockByTitle(stateData.videoData.title);
                const blockByUserName = checkBlockByUpName(stateData.videoData.owner.name);
                const blockByUpUid = checkBlockByUpUid(stateData.videoData.owner.mid);
                const shouldBlock = blockByTitle || blockByUserName || blockByUpUid;
                const videoPlayerDOM = window.parent.document.getElementById("bilibili-player");
                const videoPlayerTopDOM = window.parent.document.getElementById("bilibili-player-placeholder-top");
                if (shouldBlock) {
                    videoPlayerDOM.style.display = "none";
                    videoPlayerTopDOM.innerHTML = `<div style="font-size: 2em;text-align:center; color: white; align-content: center; height: 100%">此视频已被屏蔽：${blockByTitle ? "标题" : blockByUserName ? "用户名" : "UID"}</span>`;
                } else if (!shouldBlock && videoPlayerDOM.style.display == "none") {
                    delete videoPlayerDOM.style.display;
                }
                const upDetailTopDOM = window.parent.document.getElementsByClassName("up-detail-top")[0];
                if (upDetailTopDOM && upDetailTopDOM.getElementsByClassName("block-button").length === 0) {
                    const blockButton = createBlockButton(shouldBlock ? "解除屏蔽" : "屏蔽UP", () => {
                        if (shouldBlock) {
                            // 解除屏蔽
                            setBlockByUserId(stateData.videoData.owner.mid, false);
                        } else {
                            // 屏蔽
                            setBlockByUserId(stateData.videoData.owner.mid, true);
                        }
                        location.reload();
                    }, "#61666D", 13);
                    upDetailTopDOM.appendChild(blockButton);
                }
            }
        }
    }

    // 保存原始的 fetch 函数
    const originalFetch = window.fetch;

    // 重写 fetch 函数
    window.fetch = function (input, init) {
        // 可以在请求前添加自定义逻辑
        // console.log('Request:', input);
        return new Promise((resolve, reject) => {
            // 使用原始的 fetch 发起请求
            originalFetch.apply(this, arguments).then(response => {
                // 可以在响应后添加自定义逻辑
                if (input.includes("feed/rcmd")) {
                    readJsonFromStream(response.body).then((jsonData) => {
                        jsonData.data.side_bar_column = [];
                        jsonData.data.item = optimizeRecommandVideoData(jsonData.data.item);
                        const fakeResp = createResponse(jsonData);
                        resolve(fakeResp);
                    });
                } else if (input.includes("/x/web-show/wbi/res/locs")
                    || input.includes("web-interface/dynamic/region")
                    || input.includes("twirp/comic.v1.Comic/GetClassPageSixComics")
                    || input.includes("xlive/web-interface/v1/webMain/getMoreRecList")
                    || input.includes("pugv/app/web/floor/switch")
                    || input.includes("pgc/web/timeline/v2")
                    || input.includes("pgc/web/variety/feed")) {
                    readJsonFromStream(response.body).then((jsonData) => {
                        if (jsonData.data?.page) {
                            jsonData.data.page.count = 0;
                        } else {
                            jsonData.data = {};
                        }
                        const fakeResp = createResponse(jsonData);
                        resolve(fakeResp);
                    });
                } else {
                    // 返回原始的响应
                    resolve(response);
                }
            }).catch(ex => {
                console.error('Fetch failed:', ex);
            });
        });
    };

    function addObserverToNode(target, cb) {
        // 创建一个 MutationObserver 实例，观察 body 元素的子节点变化
        let observer = new MutationObserver(cb);
        let targetNode = target;
        // 配置观察器的选项
        let config = { childList: true, subtree: true };
        // 启动观察器并传入回调函数和配置选项
        observer.observe(targetNode, config);
    }

    document.addEventListener("DOMContentLoaded", () => {
        // 定义 MutationObserver 的回调函数
        addObserverToNode(document.body, () => {
            const now = new Date().getTime();
            if (latestUpdateTime) {
                const timeSpend = now - latestUpdateTime;
                if (timeSpend < 200) return;
            }
            rewriteRecommandStyle();
            addBlockButtonToCard();
            latestUpdateTime = new Date().getTime()
            const stateData = window.parent.__INITIAL_STATE__ || window.__INITIAL_STATE__;
            if (stateData) {
                resetVideoPageElements(stateData);
                latestBvid = stateData.bvid;
            }
        });
    });
})();