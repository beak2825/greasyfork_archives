// ==UserScript==
// @name               自研 - 多个站点 - 反外站拦截
// @name:en_US         Self-made - Multi-site - Anti-External Site Interception
// @description        去除某些网站的外站拦截。目前已适配 16 个站点。
// @description:en_US  Remove external site interception for some websites. Currently adapted for 16 sites.
// @version            1.0.14
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              *://*.zhihu.com/*
// @match              *://www.pixiv.net/*
// @match              *://gitee.com/*
// @match              *://www.tianyancha.com/*
// @match              *://jump2.bdimg.com/safecheck/index
// @match              *://www.vilipix.com/*
// @match              *://www.skland.com/*
// @match              *://weibo.cn/sinaurl
// @match              *://weibo.com/*
// @match              *://m.weibo.cn/*
// @match              *://www.douban.com/*
// @match              *://addons.mozilla.org/*
// @match              *://www.mcmod.cn/*
// @match              *://link.mcmod.cn/target/*
// @match              *://www.curseforge.com/*
// @match              *://cn.bing.com/search
// @match              *://www.gcores.com/*
// @match              *://sspai.com/*
// @match              *://www.bookmarkearth.cn/view/*
// @run-at             document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496719/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E5%8F%8D%E5%A4%96%E7%AB%99%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/496719/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E5%8F%8D%E5%A4%96%E7%AB%99%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「配置」变量，「解码」「暂停执行」「点击器」函数。
    const config = [
        // {
        //     "name": "站点名",
        //     "matchLink": /匹配链接/,
        //     "target": "目标",
        //     "reproduce": "复现链接"
        // },
        // 目标可用项：网页参数、元素选择符、自定义脚本`() => { {{自定义脚本}} }`、正则剔除和特殊方式。
        // 特殊方式：`$entireParam`整个网页参数。
        {
            "name": "知乎",
            "matchLink": /^link.zhihu.com/,
            "target": "target",
            "reproduce": ["https://www.zhihu.com/question/646179463/answer/3411700328", "https://zhuanlan.zhihu.com/p/102911463"]
        },
        {
            "name": "Pixiv(予素)",
            "matchLink": /^www.pixiv.net\/jump.php/,
            "target": "$entireParam",
            "reproduce": "https://www.pixiv.net/users/10885193 > 查看个人资料"
        },
        {
            "name": "Gitee",
            "matchLink": /^gitee.com\/link/,
            "target": "target",
            "reproduce": "https://gitee.com/rmbgame/SteamTools#从移动端-steam-app-导入令牌指南"
        },
        {
            "name": "天眼查",
            "matchLink": /^www.tianyancha.com\/security/,
            "target": "target",
            "reproduce": "https://www.tianyancha.com/company/2347945472"
        },
        {
            "name": "百度贴吧",
            "matchLink": /^jump2.bdimg.com\/safecheck\/index/,
            "target": ".warning_info a",
            "reproduce": "https://tieba.baidu.com/p/8459041179 > 5楼 > 彼梦Archi"
        },
        {
            "name": "插画世界",
            "matchLink": /^www.vilipix.com\/jump/,
            "target": "$entireParam",
            "reproduce": "https://www.vilipix.com/illust/108871691"
        },
        {
            "name": "森空岛",
            "matchLink": /^www.skland.com\/third-link/,
            "target": "target",
            "reproduce": "https://www.skland.com/ > 工具箱 > 塞壬唱片"
        },
        {
            "name": "新浪微博",
            "matchLink": /^weibo.cn\/sinaurl/,
            "target": "u",
            "reproduce": ["https://weibo.com/3556190647/LfTSUxUB6", "https://weibo.com/2656274875/Ohfr4edHf", "https://m.weibo.cn/status/NiQw1CyCy"]
        },
        {
            "name": "豆瓣",
            "matchLink": /^www.douban.com\/link2/,
            "target": "url",
            "reproduce": "https://www.douban.com/group/topic/253534825"
        },
        {
            "name": "Firefox 附加组件",
            "matchLink": /^addons.mozilla.org\/[a-z]{2}(-[A-Z]{2})?/,
            "target": () => {

                // 当页面完成解析，就遍历所有链接元素如果是拦截页面就重配置为原链接。
                document.addEventListener('DOMContentLoaded', () => {

                    document.querySelectorAll("a").forEach((link) => {

                        if(/^https:\/\/prod\.outgoing\.prod\.webservices\.mozgcp\.net\/v1\/[a-z0-9]{64}\//.test(link.href)) {

                            link.href = decode(link.href.slice(118));

                        }

                    });

                });

            },
            "reproduce": "https://addons.mozilla.org/zh-CN/firefox/addon/noscript/"
        },
        {
            "name": "MC百科（MCMOD）",
            "matchLink": /^(link|www).mcmod.cn(\/target\/)?/,
            "target": /http(s)?:\/\/link.mcmod.cn\/target\//,
            "reproduce": "https://www.mcmod.cn/class/4170.html"
        },
        {
            "name": "curseForge",
            "matchLink": /^www.curseforge.com\/linkout/,
            "target": "remoteUrl",
            "reproduce": "https://www.curseforge.com/minecraft/mc-mods/timeless-and-classics-zero"
        },
        {
            "name": "中国必应",
            "matchLink": /^cn.bing.com\/search/,
            "target": () => {

                // 当页面完成解析就遍历主体部分所有链接，如果是打开拦截页面就修改链接
                document.addEventListener('DOMContentLoaded', () => {

                    document.querySelectorAll("#b_content a").forEach((link) => {

                        if(/https:\/\/www.bing.com\/ck\/a/.test(link.href)) {

                            link.href = atob(link.href.split("&u=a1")[1].split("&ntb=1")[0].replaceAll(/[-_+]/g), "").split("#:")[0];

                        }

                    });

                });

            },
            "reproduce": "https://cn.bing.com/search?q=test"
        },
        {
            "name": "机核",
            "matchLink": /^www.gcores.com\/link/,
            "target": "target",
            "reproduce": "https://www.gcores.com/articles/158806"
        },
        {
            "name": "少数派",
            "matchLink": /^sspai.com\/link/,
            "target": "target",
            "reproduce": "https://sspai.com/post/89743"
        },
        {
            "name": "书签地球",
            "matchLink": /^www.bookmarkearth.cn\/view/,
            "target": () => {

                // 当页面完成解析就遍历主体部分所有链接，如果是打开拦截页面就修改链接
                document.addEventListener("DOMContentLoaded", () => {

                    location.href = document.querySelector(".wrapper").dataset.url;

                });

            },
            "reproduce": ["https://www.bookmarkearth.cn/view/817eb92893d711edb9f55254005bdbf9", "https://www.bookmarkearth.cn/view/7df2a2b293d711edb9f55254005bdbf9"]
        },
    ];

    function decode(data) {

        // 判断状况并解码。
        // 内容数量为 4 的倍数且不是 `http(s)?` 开头的判断为 base64；内容开头是 `http(s)?` 的判断为 URI 编码。
        if(data.length % 4 === 0 && !/^http(s)?/.test(data)) {

            return atob(data);

        }else if(/^http(s)?/.test(data)) {

            return decodeURIComponent(data);

        }

    };

    function sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    async function clicker(elm) {

        // 定义「按钮元素」变量。
        const btn = document.querySelector(elm);

        // 如果「按钮元素」存在就点击，不存在就等待 .1 秒后再次判断。
        if(btn) {

            btn.click();

        }else {

            await sleep(100);
            clicker(elm);

        }

    };


    // 遍历「配置」。
    config.forEach((data) => {

        // 当链接匹配，就判断目标执行方法并执行对应操作。
        if(data.matchLink.test(location.href.replaceAll(/http(s)?:\/\//g, ""))) {

            // 定义「目标」变量。
            const target = data.target;

            // 判断状况执行对应语句。
            // 内容为字符串且包含 `(.#])` 的判断为元素选择符；内容为字符串且内容为判断为特殊方式；内容为字符串判断为网页参数；内容为正则表达式且页面链接与「目标匹配」判断为正则剔除；内容为函数判断为自定义脚本。
            if(typeof target === "string" && /\.|#|\]/.test(target)) {

                clicker(target);

            }else if(typeof target === "string" && location.search !== "" && target === "$entireParam") {

                // 停止网页继续加载。
                window.stop();

                // 访问页面。
                window.open(decode(location.search.substring(1)), "_self");

            }else if(typeof target === "string" && location.search !== "") {

                // 停止网页继续加载。
                window.stop();

                // 定义「网页参数」变量。
                const params = new URLSearchParams(location.search.substring(1));

                // 访问页面。
                window.open(decode(params.get(target)), "_self");

            }else if(Object.prototype.toString.call(target) === "[object RegExp]" && target.test(location.href)) {

                // 停止网页继续加载。
                window.stop();

                // 定义「网页链接」变量。
                const URL = location.href.replace(target, "");

                // 访问页面。
                window.open(decode(URL), "_self");

            }else if(typeof target === "function") {

                target();

            }

        }

    });


    // 定义「侦测器」变量。
    const observer = new MutationObserver(() => {

        // 遍历所有未被修改的链接元素。
        document.querySelectorAll('a:not(.removeIntercepted)').forEach((link) => {

            // 遍历「配置」
            config.forEach((data) => {

                // 定义「目标」变量。
                const target = data.target;

                // 当链接元素地址与目标链接匹配、类型为字符串、内容不包含`(.#])`且不是空内容，就判断目标执行方法并执行对应操作。
                if(data.matchLink.test(link.href.replaceAll(/http(s)?:\/\//g, "")) && typeof target === "string" && !/\.|#|\]/.test(target) && new URL(link.href).search !== "") {

                    if(target === "$entireParam") {

                        // 修改链接地址。
                        link.href = decode(new URL(link.href).search.substring(1));

                    }else {

                        // 定义「网页参数」变量。
                        const params = new URLSearchParams(new URL(link.href).search.substring(1));

                        // 修改链接地址。
                        link.href = decode(params.get(target));

                    }

                    // 添加「removeIntercepted」类，防止重复检测。
                    link.classList.add("removeIntercepted");

                // 当链接元素地址与目标链接匹配、类型为正则表达式且「目标」链接与元素链接匹配
                }else if (data.matchLink.test(link.href.replaceAll(/http(s)?:\/\//g, "")) && Object.prototype.toString.call(target) === "[object RegExp]" && target.test(link.href)) {

                    // 定义「网页链接」变量。
                    const URL = link.href.replace(target, "");

                    // 修改链接地址。
                    link.href = decode(URL);

                }

            });

        });

    });

    // 当页面完成解析，就配置「侦测器」侦测目标节点。
    document.addEventListener('DOMContentLoaded', () => {

        observer.observe(document.body, {
            "subtree": true,
            "childList": true
        });

    });

})();