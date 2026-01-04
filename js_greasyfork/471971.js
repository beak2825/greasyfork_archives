// ==UserScript==
// @name         反诈
// @namespace    http://tampermonkey.net/
// @version      1.12.5
// @icon         https://jgxin.dextrousdream8.repl.co/logo.jpg
// @description  反诈，所有迈克摇全换
// @license MIT
// @author       Dextrousdream8
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471971/%E5%8F%8D%E8%AF%88.user.js
// @updateURL https://update.greasyfork.org/scripts/471971/%E5%8F%8D%E8%AF%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
    if (
        location.href.indexOf("https://www.luogu.com.cn/paste/rvxy7xsr") >= 0 ||
        location.href.indexOf("https://www.luogu.com.cn/paste/k3189vkj") >= 0 ||
        document.title.indexOf("Never Gonna Give You Up") >= 0 ||
        document.title.indexOf("反诈提醒") >= 0
    ) {
        try {
            location.href = "https://www.luogu.com.cn/paste/m7e0e5kz";
        } catch (e) {}
    }
} catch (e) {}

    // 替换列表和目标URL，使用字典结构
    var replacementDict = {
        "https://fanhuishangyiye.jiaobenzhuanyong": "javascript:history.back()",
        "BV1GJ411x7h7": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "BV1va411w7aM": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "BV1BP4y1G78b": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "BV1mu411U7GU": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "BV1Px411w7FH": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "BV1Ti4y1f7td": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "av156766": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "av546403908": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "av80433022": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "id=5221167": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "*://milime.top": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "xn--l5xv74aora.cn": "https://acgo.cn",
        "https://www.luogu.com.cn/paste/g2ahu6v3": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "*://*/192d9a98d782d9c74c96f09db9378d93.mp4": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://cn.imken.moe/": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://b23.tv/rrHrxMt": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://vdse.bdstatic.com//192d9a98d782d9c74c96f09db9378d93.mp4": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "arcxingye.github.io/r18": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://p.qpic.cn/qq_expression/41384847/41384847_0_0_0_9710B2BF57B43E59DC64A5C64407F5B2_0_0/0": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://noip.d0j1a1701.cc/": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://blogs.mtdv.me/articles/OIerMustKnownTricks": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://milime.top/": "https://www.luogu.com.cn/paste/m7e0e5kz",
        "https://1145.s3.ladydaily.com/rock.mp4": "https://www.luogu.com.cn/paste/m7e0e5kz"
    };

    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var url = link.href;

        for (var content in replacementDict) {
            if (url.includes(content)) {
                link.href = replacementDict[content];
            }
        }
    }

    var iframes = document.getElementsByTagName("iframe");
    for (var j = 0; j < iframes.length; j++) {
        var iframe = iframes[j];
        var src = iframe.getAttribute("src");

        if (src && src.includes('//www.bilibili.com/blackboard/webplayer/embed-old.html?bvid=BV1GJ411x7h7')) {
            window.location.href = 'https://www.luogu.com.cn/paste/m7e0e5kz';
            break;
        }
    }
})();
