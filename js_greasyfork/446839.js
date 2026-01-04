// ==UserScript==
// @name        自动跳转各类外链跳转页到目的地址
// @description 自动跳转以下各类外链跳转页到目的地址，包括 QQ、微信所谓“非官方页面”等
// @author      AnnAngela
// @version     1.8.0
// @mainpage    https://greasyfork.org/scripts/446839
// @supportURL  https://greasyfork.org/scripts/446839/feedback
// @match       *://c.pc.qq.com/*
// @match       *://docs.qq.com/scenario/link.html*
// @match       *://afdian.net/link*
// @match       *://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi*
// @match       *://mp.weixin.qq.com/mp/readtemplate?t=pages/wapredirect&url=*
// @match       *://t.cn/*
// @match       *://www.jianshu.com/go-wild*
// @match       *://link.csdn.net/*
// @match       *://link.zhihu.com/*
// @match       *://jump2.bdimg.com/safecheck/index*
// @match       *://link.juejin.cn/*
// @match       *://www.google.com/url?*
// @match       *://steamcommunity.com/linkfilter/?*
// @match       *://wx.mail.qq.com/xmspamcheck/xmsafejump?*
// @run-at      document-start
// @license     GNU General Public License v3.0 or later
// @namespace https://greasyfork.org/users/129402
// @downloadURL https://update.greasyfork.org/scripts/446839/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%90%84%E7%B1%BB%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E9%A1%B5%E5%88%B0%E7%9B%AE%E7%9A%84%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/446839/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%90%84%E7%B1%BB%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E9%A1%B5%E5%88%B0%E7%9B%AE%E7%9A%84%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
"use strict";
const hide = () => {
    try {
        document.documentElement.style.display = "none";
        document.title = "跳转中……";
    } catch { }
};
const searchParams = new URL(location.href).searchParams;
const normalTargets = [
    {
        snippets: [
            "c.pc.qq.com/middle.html",
            "c.pc.qq.com/middlem.html",
            "c.pc.qq.com/middlect.html",
            "c.pc.qq.com/index.html",
        ],
        searchParamName: "pfurl",
    },
    {
        snippets: [
            "c.pc.qq.com/ios.html",
            "wx.mail.qq.com/xmspamcheck/xmsafejump"
        ],
        searchParamName: "url",
    },
    {
        snippets: [
            "docs.qq.com/scenario/link.html",
            "jianshu.com/go-wild",
        ],
        searchParamName: "url",
    },
    {
        snippets: [
            "afdian.net/link",
            "link.csdn.net/?",
            "link.zhihu.com/?",
            "link.juejin.cn/?",
        ],
        searchParamName: "target",
    },
    {
        snippets: [
            "www.google.com/url?",
        ],
        searchParamName: "q",
    },
    {
        snippets: [
            "mp.weixin.qq.com/mp/readtemplate?t=pages/wapredirect&url=",
        ],
        searchParamName: "url",
    },
    {
        snippets: [
            "steamcommunity.com/linkfilter/?",
        ],
        searchParamName: "u",
    },
];
const plaintextTargets = [
    {
        snippets: [
            "t.cn/",
        ],
        selector: ".url_view_code",
    },
    {
        snippets: [
            "jump2.bdimg.com/safecheck/index",
        ],
        selector: ".link",
    },
    {
        snippets: [
            "www.google.com/url?",
        ],
        selector: "a[href]:not(id)",
    },
];
for (const { snippets, searchParamName } of normalTargets) {
    for (const snippet of snippets) {
        if (location.href.includes(snippet)) {
            hide();
            location.replace(searchParams.get(searchParamName));
            break;
        }
    }
}
for (const { snippets, selector } of plaintextTargets) {
    for (const snippet of snippets) {
        if (location.href.includes(snippet)) {
            let flag = false;
            hide();
            setInterval(() => {
                const url_view_code = unsafeWindow.document.querySelector(selector);
                if (!flag && url_view_code) {
                    try {
                        const url = new URL(url_view_code.innerText);
                        flag = true;
                        location.replace(url);
                    } catch { }
                }
            }, 100);
        }
    }
}
if (location.href.includes("c.pc.qq.com/ios.html")) {
    const obj = Object.fromEntries(new URL(location.href.replace(/%2F(?=&(?:sub)?level)/g, "")).searchParams);
    Reflect.deleteProperty(obj, "level");
    Reflect.deleteProperty(obj, "sublevel");
    const newUrl = new URL(obj.url);
    for (const [k, v] of Object.entries(obj)) {
        if (k !== "url") {
            newUrl.searchParams.append(k, v);
        }
    }
    hide();
    location.replace(newUrl);
}
if (location.href.includes("weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi")) {
    let flag = false;
    setInterval(() => {
        if (!flag && Reflect.has(unsafeWindow.cgiData || {}, "url")) {
            hide();
            flag = true;
            location.replace(new DOMParser().parseFromString(unsafeWindow.cgiData.url, "text/html").documentElement.textContent);
        }
    }, 100);
}
