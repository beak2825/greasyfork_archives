// ==UserScript==
// @name        在拦截页面自动跳转 / Autojump URL In jumpPage
// @namespace   leizingyiu.net
// @match       http*://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi*
// @match       http*://docs.qq.com/scenario/link.html*
// @match       http*://link.zhihu.com/?target=*
// @match       http*://link.csdn.net/?target=*
// @match       http*://t.cn/*
// @match       http*://weibo.cn/sinaurl?*
// @match       http*://www.jianshu.com/go-wild?ac=2&url=*
// @grant       none
// @version     20240125.19.09
// @author      leizingyiu
// @license     GPL-3.0-only
// @description 跳转拦截真的很麻烦，简单弄个跳转;
// @run-at      document-idle

// @downloadURL https://update.greasyfork.org/scripts/485148/%E5%9C%A8%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%20Autojump%20URL%20In%20jumpPage.user.js
// @updateURL https://update.greasyfork.org/scripts/485148/%E5%9C%A8%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%20Autojump%20URL%20In%20jumpPage.meta.js
// ==/UserScript==


function autoJump() {
    const host = window.location.host;
    const settings = {
        微信110: {
            host: "weixin110.qq.com",
            jumpBoo: () => document.body.innerText.indexOf("如需浏览，请长按网址复制后使用浏览器访问") != -1,
            terminal: () => document.querySelector("p").innerText
        },
        腾讯文档: {
            host: "docs.qq.com",
            jumpBoo: () => document.body.innerText.indexOf("继续访问") != -1,
            terminal: () => document.querySelector(".url-tips span").innerText
        },
        知乎: {
            host: "link.zhihu.com",
            jumpBoo: () => document.body.innerText.indexOf("即将离开知乎") != -1,
            terminal: () => document.querySelector("p.link").innerText
        },
        csdn: {
            host: "link.csdn.net",
            jumpBoo: () => document.body.innerText.indexOf("您即将离开CSDN，去往：") != -1,
            terminal: () => new URL(window.location).searchParams.get('target')
        },

        weibo: {
            host: ["t.cn", "weibo.cn"],
            jumpBoo: function () { return document.body.innerText.indexOf("将要访问") != -1 },
            terminal: function () { return document.querySelector("div.desc").innerText }
        },

        简书: {
            host: "www.jianshu.com",
            jumpBoo: () => document.body.innerText.indexOf("即将跳转到外部网站") != -1,
            terminal: () => document.querySelector('div[title]').innerText
        },
    };

    let web = Object.keys(settings).filter((k) =>
        typeof settings[k].host == 'string' ?
            settings[k].host == host :
            (settings[k].host instanceof Array ?
                (settings[k].host.includes(host)) :
                (false))
    );
    console.log(web.length);

    if (web.length && settings[web[0]].terminal().length > 0) {

        window.location.href = settings[web[0]].jumpBoo() == true ?
            settings[web[0]].terminal() :
            '#';
    }
}


let s = document.createElement("style");
s.innerHTML = `body,body *:last-child{ animation: fade 1s ease 0.5s 1 normal forwards; } @keyframes fade { to { opacity: 0; } } `;
document.body.appendChild(s);
document.addEventListener("animationend", (ev) => { if (ev.animationName == "fade") { autoJump(); } });
/**ref : https://mp.weixin.qq.com/s/KNIMdROilYYR6S1o7xze1g */
