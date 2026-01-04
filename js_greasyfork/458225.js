// ==UserScript==
// @name         Free Read And Go
// @namespace    http://tampermonkey.net/
// @version      2025.05.06
// @description  链接直接跳转,阅读全文
// @author       Leon406
// @match        *://**/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @homepageURL  https://github.com/Leon406/jsdelivr/tree/master/js/tampermonkey
// @connect        *
// @grant        GM_xmlhttpRequest
// @exclude 	 *://login.live.com/*
// @exclude 	 *://*.aliyun.com/*
// @exclude 	 *://*.google.*/*
// @exclude 	 *://pan.baidu.com/*
// @exclude 	 *://tieba.baidu.com/*
// @exclude 	 *://baike.baidu.com/*
// @exclude 	 *://leetcode.*/*
// @exclude 	 *://cloud.baidu.com/*
// @exclude 	 *://*.bce.baidu.com/*
// @exclude 	 *://*.iconfont.cn/*
// @exclude 	 *://*.sou.com/*
// @exclude 	 *://*.jiguang.cn/*
// @exclude 	 *://*.mozilla.org/*
// @exclude 	 https://space.bilibili.com/*
// @exclude 	 https://www.thepaper.cn/*
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/458225/Free%20Read%20And%20Go.user.js
// @updateURL https://update.greasyfork.org/scripts/458225/Free%20Read%20And%20Go.meta.js
// ==/UserScript==

const host = window.location.host;
const rootHost = host.replaceAll(/.*\.(\w+\.\w+)$/g, "$1");

const REAL_GO = {
    "juejin.cn": {
        prefix: "https://link.juejin.cn/?target=",
        query: "target",
        action: urlDecode
    },
    "www.douban.com": {
        prefix: "https://www.douban.com/link2/",
        query: "url",
        action: urlDecode
    },
    "feishu.cn": {
        func: () => get_elements(".outer-u-container a", filterThirdATag).forEach(createNewTag)
    },
    "security.feishu.cn": {
        prefix: "https://security.feishu.cn/link/safety?",
        query: "target",
        action: urlDecode
    },
    "51.ruyo.net": {
        prefix: "https://51.ruyo.net/go/index.html?u=",
        query: "u",
        action: urlDecode
    },
    "blog.51cto.com": {
        prefix: "https://blog.51cto.com/transfer?",
        action: urlDecode,
        //func: () => get_elements(".article-content-wrap a", filterThirdATag).forEach(removeOnClick)
    },
    "zhuanlan.zhihu.com": {
        prefix: "https://link.zhihu.com/?target",
        query: "target",
        action: urlDecode
    },
    "www.zhihu.com": {
        prefix: "https://link.zhihu.com/?target",
        query: "target",
        action: urlDecode
    },
    "cloud.tencent.com": {
        prefix: "https://cloud.tencent.com/developer/tools/blog-entry?",
        query: "target",
        action: urlDecode
    },
    "gitee.com": {
        prefix: "https://gitee.com/link?target=",
        query: "target",
        action: urlDecode
    },
    "xie.infoq.cn": {
        prefix: "https://xie.infoq.cn/link?",
        query: "target",
        action: urlDecode,
        func: () => get_elements(".main a", filterThirdATag).forEach(createNewTag)
    },
    "sspai.com": {
        prefix: "https://sspai.com/link?",
        query: "target",
        action: urlDecode
    },
    "afdian.com": {
        prefix: "https://afdian.com/link?",
        query: "target",
        action: urlDecode
    },
    "www.oschina.net": {
        prefix: "https://www.oschina.net/action/GoToLink?",
        query: "url",
        action: urlDecode
    },
    "wx.mail.qq.com": {
        prefix: "https://wx.mail.qq.com/xmspamcheck/xmsafejump",
        query: "url",
        action: urlDecode
    },
      "c.pc.qq.com": {
        prefix: "https://c.pc.qq.com/middlem.html?",
        query: "pfurl",
        action: urlDecode
    },
    "weibo.cn": {
        prefix: "https://weibo.cn/sinaurl?u=",
        query: "u",
        action: urlDecode
    },
    "aiqicha.baidu.com": {
        prefix: "https://aiqicha.baidu.com/safetip?",
        query: "target",
        action: rawText
    },
    "www.qcc.com": {
        prefix: "https://www.qcc.com/web/transfer-link?",
        query: "target",
        action: urlDecode
    },
    "www.tianyancha.com": {
        prefix: "https://www.tianyancha.com/security",
        query: "target",
        action: urlDecode
    },
    "leetcode.cn": {
        prefix: "https://leetcode.cn/link/?target=",
        query: "target",
        action: urlDecode
    },
    "www.jianshu.com": {
        prefix: "https://link.jianshu.com",
        query: "t",
        prefix2: "https://www.jianshu.com/go-wild",
        query2: "url",
        action: urlDecode
    },
    "yuque.com": {
        prefix: "https://www.yuque.com/r/goto?url=",
        query: "url",
        action: urlDecode
    },
    "nowcoder.com": {
        prefix: "https://hd.nowcoder.com/link.html?target=",
        query: "target",
        action: urlDecode
    },

    "steamcommunity.com": {
        prefix: "https://steamcommunity.com/linkfilter/?url=",
        query: "url",
        action: urlDecode
    },

    "docs.google.com": {
        prefix: "https://www.google.com/url?",
        query: "q",
        action: urlDecode
    },
    "t.me": {
        prefix: "https://t.me/iv?url=",
        query: "url",
        action: urlDecode
    },
    "telegra.ph": {
        prefix: "https://t.me/iv?url=",
        query: "url",
        action: urlDecode
    },
    "www.pixiv.net": {
        prefix: "https://www.pixiv.net/jump.php",
        query: "url",
        action: urlDecode
    },
    "www.youtube.com": {
        prefix: "https://www.youtube.com/redirect?",
        query: "q",
        action: urlDecode
    },
    "www.linkedin.com": {
        prefix: "https://www.linkedin.com/redir/redirect?",
        query: "url",
        action: urlDecode
    },
    "mail.qq.com": {
        prefix: "https://mail.qq.com/cgi-bin/readtemplate",
        query: "gourl",
        action: urlDecode,
        intervalFunc: () => get_elements("#contentDiv a", filterThirdATag).forEach(stopropagation)
    },
    "www.kdocs.cn": {
        prefix: "https://www.kdocs.cn/office/link?target=",
        query: "target",
        action: urlDecode
    },
    "bbs.nga.cn": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "nga.178.com": {
        func: () => get_elements("#m_posts a", filterThirdATag).forEach(removeOnClick)
    },
    "tieba.baidu.com": {
        prefix: "https://tieba.baidu.com/mo/q/checkurl?url=",
        query: "url",
        action: urlDecode,
        intervalFunc: () => get_elements("#container a", filterThirdATag).forEach(stopropagation)
    },
    "blog.csdn.net": {
        func: () => get_elements(".blog-content-box a", filterThirdATag).forEach(createNewTag)
    },
    "developers.weixin.qq.com": {
        prefix: "/community/middlepage/href?href=",
        query: "href",
        action: urlDecode,
        func: () => get_elements("a", filterThirdATag).forEach(stopropagation)
    }
}

function filterThirdATag(aTag) {
    return aTag.href.startsWith("http") && !aTag.href.includes(rootHost)
}

function find_all_iframe(doc = document) {
    let frame = doc.querySelectorAll("iframe");
    if (frame.length === 0)
        return [];
    let frames = Array.from(frame)
        .filter(el => el.contentDocument)
        if (frames.length > 0) {
            let frames2 = frames.flatMap(el => find_all_iframe(el.contentDocument))
                if (frames2.length > 0) {
                    frames2.forEach(e => frames.push(e))
                }
        }
        return frames;
}

function get_elements(selector, cond = el => el) {
    let elements = Array.from(document.querySelectorAll(selector)).filter(cond);
    if (elements.length === 0) {
        elements = find_all_iframe()
            .flatMap(el => Array.from(el.contentDocument.querySelectorAll(selector)))
            .filter(el => cond(el));
    }
    return elements;
}

function get_elements_simlpe(selector, cond = el => el) {
    return Array.from(document.querySelectorAll(selector)).filter(cond);
}

const reg_more = /^\s*(阅读|查看|展开)(全文|全部|更多)$|^展开(剩余|阅读)/g

function showMore() {
    var mores = get_elements_simlpe("a", el => reg_more.test(el.text) && el.target != '_blank');
    //console.log("showMore ", mores);
    for (let more of mores) {
        if (!more.href.startsWith("http") && more.href.includes(rootHost)) {
            more.click();
        }
    }

    mores = get_elements_simlpe("span,div", el => reg_more.test(el.textContent));
    //console.log("showMore span ", mores);
    for (let more of mores) {
        let p = more.closest("a");
        if (p) {
            if (!p.href.startsWith("http") && p.href.includes(rootHost)) {
                more.click();
            }
        } else {
            more.click();
        }
    }
}
const stopEvent = (e) => {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
};

function stopropagation(aTag) {
    if (aTag.onclick && aTag.onclick != stopEvent)
        aTag.onclick = stopEvent
}

function removeOnClick(aTag) {
    if (aTag.onclick)
        aTag.onclick = null;
    console.log("removeOnClick", aTag)
    aTag.removeEventListener("click", function () {});
}

function createNewTag(aTag) {
    //console.log("rewriteOnClick", aTag)
    if (!aTag.onclick && aTag.href) {
        aTag.onclick = function antiRedirectOnClickFn(e) {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log("stop__", aTag)
            const tmpA = document.createElement("a");
            tmpA.href = aTag.href;
            tmpA.target = "_blank";
            tmpA.click();
        };
    }
}

function interval(func, period = 500) {
    //console.log("interval", func)
    setInterval(func, period)
}

function urlDecode(aTag, query) {
    //console.log("urlDecode", query, aTag)
    let url = new URL(aTag.href);
    //  console.log("urlDecode", url.searchParams.get(query), url.search.replace("?", ""))
    url = query && url.searchParams.get(query) || url.search.replace("?", "")
    try {
        url =decodeURIComponent(url)
     }catch(err) {
     }
    aTag.href = url
      
}

function rawText(aTag, query) {
    console.log("rawText", query, aTag)
    aTag.href = query
}

function request(aTag, query) {
    GM_xmlhttpRequest({
        method: "get",
        url: aTag.href,
        onload: function (response) {
            var myregexp = /u *= *"([^"]*)"/;
            var match = myregexp.exec(response.responseText);
            if (match != null) {
                result = match[1];
                aTag.href = result
            } else {
                result = "";
            }
            console.log("request", result)
        }
    });

}

function removeClick() {
    document.body.addEventListener('click', function (event) {
        var target = event.target || event.srcElement;
        if (target.nodeName.toLocaleLowerCase() === 'a') {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                window.event.returnValue = true;
            }
            var url = target.getAttribute("href")
                if (target.getAttribute("target") === '_blank') {
                    window.open(url)
                } else {
                    window.location.href = url
                }
        }
    });
}

function findAllHref(rule = "http") {
    return get_elements("a", el => el.href.includes(rule))
}

(function () {
    'use strict';
    let rule = REAL_GO[host] || REAL_GO[rootHost];
    console.log("====rule 11", rule)
    if (rule && rule.prefix && window.location.href.startsWith(rule.prefix)) {
        let url = new URL(window.location.href);
        let targetUrl = decodeURIComponent(rule.query && url.searchParams.get(rule.query) || url.search.replace("?", ""));
        window.location.href = targetUrl.includes("://") ? targetUrl : ("https://" + targetUrl);
        console.log("redirect-------->", window.location.href)
        return;
    }

    if (rule && rule.prefix2 && window.location.href.startsWith(rule.prefix2)) {
        let url = new URL(window.location.href);
        let targetUrl = decodeURIComponent(rule.query2 && url.searchParams.get(rule.query2) || url.search.replace("?", ""))
            window.location.href = targetUrl.includes("://") ? targetUrl : ("https://" + targetUrl);
        console.log("redirect2-------->", window.location.href)
        return;
    }

    // 有的页面不触发 onload
    setTimeout(() => {
        showMore();
    }, 3000)
    window.onload = function () {
        showMore();
        setTimeout(() => {
            console.log("====rule", rule)
            if (rule) {
                rule.prefix && findAllHref(rule.prefix).forEach(el => {
                    rule.action && rule.action(el, rule.query)
                });
                rule.prefix2 && findAllHref(rule.prefix2).forEach(el => {
                    rule.action && rule.action(el, rule.query2)
                });
                rule.func && rule.func()
                rule.intervalFunc && interval(rule.intervalFunc)
            }
        }, 3000)
    }
})();
