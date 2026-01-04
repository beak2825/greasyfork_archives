// ==UserScript==
// @name                微博ip属地显示助手
// @name:zh             微博ip属地显示助手
// @name:zh-CN          微博ip属地显示助手
// @description         新浪微博显示用户ip属地
// @description:zh      新浪微博显示用户ip属地
// @description:zh-CN   新浪微博显示用户ip属地
// @version             1.3.1
// @author              NiaoBlush
// @license             GPL
// @namespace           https://github.com/NiaoBlush/weibo-ip-location
// @homepageURL         https://github.com/NiaoBlush/weibo-ip-location
// @supportURL          https://github.com/NiaoBlush/weibo-ip-location/issues
// @match               https://weibo.com/*
// @match               https://m.weibo.cn/*
// @require             https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @grant               GM.xmlHttpRequest
// @connect             weibo.com
// @downloadURL https://update.greasyfork.org/scripts/442391/%E5%BE%AE%E5%8D%9Aip%E5%B1%9E%E5%9C%B0%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/442391/%E5%BE%AE%E5%8D%9Aip%E5%B1%9E%E5%9C%B0%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 获取用户 IP 属地（桌面版）
    function getRegion(uid) {
        return new Promise((resolve) => {
            $.get(`https://weibo.com/ajax/profile/detail?uid=${uid}`, function (res) {
                if (res.data && res.data.ip_location) {
                    const array = /IP属地：(.+)/.exec(res.data.ip_location);
                    resolve(array ? array[1] : "");
                } else {
                    resolve("");
                }
            });
        });
    }

    // 获取用户 IP 属地（移动版）
    function getRegionGM(uid) {
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                url: `https://weibo.com/ajax/profile/detail?uid=${uid}`,
                method: "GET",
                onload: function (xhr) {
                    const res = JSON.parse(xhr.responseText);
                    if (res.data && res.data.ip_location) {
                        const array = /IP属地：(.+)/.exec(res.data.ip_location);
                        resolve(array ? array[1] : "");
                    } else {
                        resolve("");
                    }
                }
            });
        });
    }

    // 国内省市列表，用于标识境外
    const district = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江",
        "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
        "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃",
        "青海", "宁夏", "新疆", "台湾", "中国香港", "澳门"];

    // 在用户昵称元素后添加 IP 属地标识
    function mark($obj, region) {
        const markedClass = "weibo-ip-marked";
        if (!region || $obj.hasClass(markedClass)) return;
        $obj.addClass(markedClass);
        const foreign = district.indexOf(region) === -1;
        const html = foreign
            ? `<span style="background-color:red;color:#FFF;margin-left:5px;font-weight:bold;border-radius:8px;padding:2px 5px;">${region}</span>`
            : `<span style="color:#00d0ff;margin-left:5px;font-weight:normal;border-radius:8px;padding:2px 5px;">(${region})</span>`;
        $obj.append(html);
    }

    // 缓存已获取的属地
    const regionMap = {};

    // 创建一个 MutationObserver，监听容器内新增节点
    function createInsertionObserver(container, callback) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    const nodes = Array.from(mutation.addedNodes).filter(node => node.nodeType === 1);
                    if (nodes.length) callback(nodes);
                }
            });
        });
        observer.observe(container, {childList: true, subtree: true});
        return observer;
    }

    // 处理桌面版微博列表
    function processList($ele) {
        const list = $ele.find("a[class^='ALink_default']:not([aria-label]), .WB_info>a[usercard]");
        list.each(async function () {
            const href = $(this).attr("href");
            const array = /\/u\/(\d+)/.exec(href);
            if (array) {
                const uid = array[1];
                let region = regionMap[uid];
                if (region === undefined) {
                    region = await getRegion(uid);
                    regionMap[uid] = region;
                }
                mark($(this), region);
            }
        });
    }

    // 处理移动版微博列表
    function processMobileList($ele) {
        const list = $ele.find(".weibo-top .m-text-box> a, .weibo-text> span>a:not([data-hide])");
        list.each(async function () {
            let $target = $(this);
            const href = $target.attr("href");
            const array = /\/profile\/(\d+)/.exec(href);
            if ($target.parent().hasClass("m-text-box")) {
                $target = $target.find("h3").first();
            }
            if (array) {
                const uid = array[1];
                let region = regionMap[uid];
                if (region === undefined) {
                    region = await getRegionGM(uid);
                    regionMap[uid] = region;
                }
                mark($target, region);
            }
        });
    }

    // 桌面版 v6
    const mainContainer = document.querySelector('.WB_main');
    if (mainContainer) {
        processList($(mainContainer));
        createInsertionObserver(mainContainer, nodes => {
            nodes.forEach(node => processList($(node)));
        });
    }

    // 桌面版 v7
    const homeFeeds = document.querySelectorAll("[class^='Home_feed']");
    homeFeeds.forEach(container => {
        processList($(container));
        createInsertionObserver(container, nodes => {
            nodes.forEach(node => processList($(node)));
        });
    });

    // 移动版
    if (location.host === "m.weibo.cn") {
        const appEl = document.getElementById('app');
        if (appEl) {
            processMobileList($(appEl));
            createInsertionObserver(appEl, nodes => {
                nodes.forEach(node => {
                    const $node = $(node);
                    if ($node.hasClass('main-wrap') || $node.hasClass('pannelwrap')) {
                        processMobileList($node);
                    }
                });
            });
        }
    }
})();
