// ==UserScript==
// @name               通用_敏感内容屏蔽
// @name:zh-CN         通用_敏感内容屏蔽
// @name:en-US         Uni_Porn blocker
// @description        通过关键词匹配域名、网站标题和网站内容，阻止访问色情网站。
// @version            1.0.2
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @exclude            https://*.gravatar.com/*
// @exclude            https://*.java.com/*
// @grant              GM_addStyle
// @grant              GM_log
// @run-at             document-body
// @downloadURL https://update.greasyfork.org/scripts/458620/%E9%80%9A%E7%94%A8_%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458620/%E9%80%9A%E7%94%A8_%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

'use strict';

// 定义参数(cfg)变量和屏蔽函数(blocker(关键词, 通过方法))
let cfg = {
    "match": {
        "content": false,
    },
    "show": {
        "title": "收手吧，外面全是成龙！",
        "icon": "data:;base64,iVBORw0KGgo=",
        "style": "html,body{background:#303030}"
    },
    "Keywords": ["18", "69", "asmr", "adult", "av", "bdsm", "ero", "hani", "hentai", "jav", "porn", "sex", "sukebei", "xxx", "灵梦御所", "琉璃神社", "绅士", "色情", "音声"]
};

// 执行屏蔽
function blocker(Keyword = 网页内容, Method) {
    GM_log('敏感内容屏蔽 > ' + Method + '中发现关键词“' + Keyword + '”，已将其屏蔽。');
    document.body.innerHTML = '';
    GM_addStyle(cfg.show.style);
    document.querySelector("link[rel*=icon]").href = cfg.show.icon;
    document.title = cfg.show.title;
    window.stop();
};

// 检测
cfg.Keywords.filter(Keyword => {
    // 域名
    if(location.host.match(Keyword) !== null) {
        blocker(Keyword, '域名');
    }
    // 标题
    if(document.title.toLowerCase().match(Keyword) !== null) {
        blocker(Keyword, '标题');
    }
    // 网页内容
    if(cfg.match.content && document.body.textContent.toLowerCase().match(word) !== null) {
        blocker(Keyword);
    }
});