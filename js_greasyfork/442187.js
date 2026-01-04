// ==UserScript==
// @name         open the link directly
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  点击链接直接跳转
// @author       nediiii
// @match        *://*.csdn.net/*
// @match        *://*.gitee.com/*
// @match        *://*.uisdc.com/*
// @match        *://*.uiiiuiii.com/*
// @match        *://*.logonews.cn/*
// @match        *://*.afdian.net/*
// @match        *://*.tianyancha.com/*
// @match        *://*.oschina.net/*
// @match        *://*.pixiv.net/*
// @match        *://*.jianshu.com/*
// @match        *://*.juejin.cn/*
// @match        *://*.weibo.cn/*
// @match        *://*.weibo.com/*
// @match        *://*.yuque.com/*
// @match        *://*.segmentfault.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.bookmarkearth.com/*
// @match        *://*.leetcode-cn.com/*
// @match        *://*.huaban.com/*
// @match        *://*.t.cn/*
// @match        *://*.weibo.cn/*
// @match        *://*.leetcode.cn/*
// @run-at       document-start
// @license      GPLv3 License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/442187/open%20the%20link%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/442187/open%20the%20link%20directly.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 保存原始方法
    unsafeWindow.__otld_open = unsafeWindow.open;
    // 重写 open 方法
    var myopen = function (url, name, features) {
        console.log({ url }, { name }, { features });
        // debugger;
        return unsafeWindow.__otld_open(url, name, features);
    }
    // 屏蔽 JS 中对原生函数 native 属性的检测
    var _myopen = myopen.bind(null);
    _myopen.toString = unsafeWindow.__otld_open.toString;
    Object.defineProperty(unsafeWindow, 'open', {
        value: _myopen
    });

    const getValidURL = (url) => {
        try {
            let u = new URL(url);
            return u;
        } catch (error) {
            return getValidURLWithBase(url);
        }
    }

    const getValidURLWithBase = (url) => {
        try {
            let u = new URL(url, getCurrentURLBase());
            return u;
        } catch (error) {
            return null;
        }
    }

    const isHttpProtocol = (url) => {
        return url.protocol == 'http:' || url.protocol == 'https:';
    }

    const getCurrentURLBase = () => {
        return window.location.origin;
    }

    const urlReg = /\bhttps?:\/\/\S+/gi;

    const weiboResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status != 200) {
                        reject(href);
                        return;
                    }

                    // weibo跳转会区分目标网址是否备案
                    // 未备案的, 中转
                    // 已备案的, 直跳
                    let realURI = href;
                    if (response.finalUrl === href) {
                        // 未备案, 中转网址
                        // 网址在html里
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > div > div:nth-child(2)');
                        let str = node.innerText;
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });

                        let extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                    }
                    else {
                        // 已备案
                        // 网址在finalUrl里
                        let extractURL = response.finalUrl.match(urlReg);
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                    }

                    resolve(realURI)
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const segfaultResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status == 200) {
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > p')
                        let str = node.innerText;
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });

                        let realURI = href;
                        let extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                        resolve(realURI)
                    } else {
                        reject(href)
                    }
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const bmeResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status == 200) {
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > div.row.box > div.col-lg-6.jump-box > div > div.content > p.link');
                        //querySelector('body > div > div > div').attributes['data-url'].value
                        let str = doc.querySelector('body > div > div > div').attributes['data-url'].value;
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });

                        let realURI = href;
                        let extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                        resolve(realURI)
                    } else {
                        reject(href)
                    }
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const huabanResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status == 200) {
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > script');
                        let str = node.innerText;
                        const obj = JSON.parse(str);
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });
                        console.log({ obj });

                        str = obj.props.pageProps.data.link;

                        let realURI = href;
                        let extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                        resolve(realURI)
                    } else {
                        reject(href)
                    }
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const patter_match = {

        // 注意这里的pattern需要去看对应网站dom里的a标签的实际herf值, console也会打印日志, 可以自己添加正则来增加网站支持

        // https://zhuanlan.zhihu.com/p/23333042
        // https://link.zhihu.com/?target=https%3A//getkap.co/
        // https://link.zhihu.com/?target=https%3A//greasyfork.org/en/scripts/5029-yet-another-%25E8%2587%25AA%25E5%258F%25A4cb%25E5%2587%25BA%25E8%25AF%2584%25E8%25AE%25BA-sharing-plugin
        zhihu: { pattern: /https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/ },

        // https://www.jianshu.com/p/a6a63a0c6e53
        // https://links.jianshu.com/go?to=https%3A%2F%2Fnpm.taobao.org%2Fmirrors%2Felectron
        jianshu2: { pattern: /https?:\/\/links\.jianshu\.com\/go\?to=(.+)$/ },

        // https://www.jianshu.com/p/a3af2fb4d99e
        // https://link.jianshu.com/?t=http://www.ihie.org/john-kansky
        // https://www.jianshu.com/go-wild?ac=2&url=http%3A%2F%2Fwww.ihie.org%2Fjohn-kansky
        jianshu3: { pattern: /https?:\/\/link\.jianshu\.com\/\?t=(.+)$/ },
        jianshu4: { pattern: /https?:\/\/www\.jianshu\.com\/go-wild\?ac=2&url=(.+)$/ },

        // href="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.aliyun.com%2Fgroup%2Falisoftwaretech%2F"
        juejin: { pattern: /https?:\/\/link\.juejin\.cn\/?\?target=(.+)$/ },

        // https://gitee.com/meetqy/acss-dnd
        // href="https://gitee.com/link?target=https%3A%2F%2Fcuyang.me%2Facss-dnd%2F"
        // https://blog.gitee.com/2022/01/20/lowcodetools/
        // https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgitee.com%2Fnocobase%2Fnocobase
        gitee: { pattern: /https?:\/\/gitee\.com\/link\?target=(.+)$/ },

        // https://www.uisdc.com/build-b-end-grid-system
        // https://link.uisdc.com/?redirect=https%3A%2F%2Fuxdesign.cc%2Fresponsive-grids-and-how-to-actually-use-them-970de4c16e01
        uisdc: { pattern: /https?:\/\/link\.uisdc\.com\/?\?redirect=(.+)$/ },

        // https://www.logonews.cn/apple-sues-sex-topic-blog-for-logo-infringement.html
        // https://link.logonews.cn/?url=http://aasd.k12.wi.us/district
        logonews: { pattern: /https?:\/\/link\.logonews\.cn\/?\?url=(.+)$/ },

        // https://afdian.net/@AdventCirno
        // https://afdian.net/link?target=https%3A%2F%2Fwww.patreon.com%2Fuser%3Fu%3D6139561
        afdian: { pattern: /https?:\/\/afdian\.net\/link\?target=(.+)$/ },

        // https://www.pixiv.net/users/25237
        // href="/jump.php?url=https%3A%2F%2Ftwitter.com%2Fomiya_io"
        // href="/jump.php?https%3A%2F%2Finstagram.com%2Fsnatti89%2F"
        pixiv: { pattern: /https?:\/\/www\.pixiv\.net\/jump\.php\?(?:url=)?(.+)$/ },

        // https://my.oschina.net/androiddevs/blog/5496556
        // https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzk0NDIwMTExNw%3D%3D%26action%3Dgetalbum%26album_id%3D1879128471667326981%23wechat_redirect
        // href="https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzk0NDIwMTExNw%3D%3D%26action%3Dgetalbum%26album_id%3D1879128471667326981%23wechat_redirect"
        oschina: { pattern: /https?:\/\/www\.oschina\.net\/action\/GoToLink\?url=(.+)$/ },


        // https://uiiiuiii.com/software/491152.html
        // https://link.uiiiuiii.com/?redirect=https%3A%2F%2Fwww.behance.net%2Fgallery%2F117044741%2FHARSHITA-FREE-SIGNATURE-FONT%3Ftracking_source%3Dfor_you_feed_recommended
        uiiiuiii: { pattern: /https?:\/\/link\.uiiiuiii\.com\/?\?redirect=(.+)$/ },

        // https://leetcode-cn.com/circle/discuss/mL0gxC/
        // https://leetcode-cn.com/link/?target=http%3A%2F%2Fwww.bytedance.com
        leetcodecn: { pattern: /https?:\/\/leetcode-cn\.com\/link\/\?target=(.+)$/ },

        // https://leetcode.cn/link/?target=http%3A%2F%2Fwww.bytedance.com
        leetcodecn2: { pattern: /https?:\/\/leetcode\.cn\/link\/\?target=(.+)$/ },

        // https://www.tianyancha.com/company/28723141
        // href="https://ss.knet.cn/verifyseal.dll?sn=e18042711010873571xsuv000000&pa=111332"
        // https://www.tianyancha.com/security?target=https%3A%2F%2Fss.knet.cn%2Fverifyseal.dll%3Fsn%3De18042711010873571xsuv000000%26pa%3D111332
        tianyancha: { pattern: /https?:\/\/www\.tianyancha\.com\/security\?target=(.+)$/ },

        // https://huaban.com/pins/5095905933
        // https://huaban.com/go?pin_id=4614749616
        // https://huaban.com/go?pin_id=4614750040&url=item.taobao.com
        huaban: { pattern: /https?:\/\/huaban\.com\/go\?pin_id=(.+)$/, resolver: huabanResolver },

        // https://weibo.cn/sinaurl?u=https%3A%2F%2Fwww.freebsd.org%2F
        // https://weibo.cn/sinaurl?toasturl=https%3A%2F%2Ftime.geekbang.org%2F
        // https://weibo.cn/sinaurl?luicode=10000011&lfid=230259&u=http%3A%2F%2Ft.cn%2FA6qHeVlf
        // https://weibo.cn/sinaurl?f=w&u=http%3A%2F%2Ft.cn%2FA66XY2gI&ep=LlAsNz3HD%2C1683963007%2CLlpkandl6%2C7276218544
        // href="https://weibo.cn/sinaurl?f=w&u=http%3A%2F%2Ft.cn%2FA66XY2gI&ep=LlAsNz3HD%2C1683963007%2CLlpkandl6%2C7276218544"
        weibo: { pattern: /https?:\/\/weibo\.cn\/sinaurl\?(?:toasturl|u|f=w&u|ep)=(.+)$/, resolver: weiboResolver },

        // http://t.cn/A66926Pm  未备案的, 跳转到中转网址,  response.finalUrl仍然还是http://t.cn/A66926Pm 目标网址出现在response.responseText里
        // http://t.cn/A669K964  已备案的, 直接跳转到目标网址, 出现在response.finalUrl里
        weibo2: { pattern: /(https?:\/\/t\.cn\/.+)$/, resolver: weiboResolver },


        // segmentfault对链接进行加密处理, 不知道如何decode, 所以只能写一个函数去单独处理
        // https://link.segmentfault.com/?enc=LZyRulLABKpXOHl2vbA%2F4w%3D%3D.MWhFMvjhyBk1ReIRoGxyxa0VxGtg%2Foyk0DMtfzZTJoKbsgoJFtGCPHe8%2BZ1HbRdcvNsGaVfll9oGQXLsZCHK7w%3D%3D
        // https://segmentfault.com/a/1190000017434150
        segfault: { pattern: /https?:\/\/link\.segmentfault\.com\/?\?enc=(.+)$/, resolver: segfaultResolver },

        // https://www.bookmarkearth.com/detail/097c687c98974691b2174bc1e85103d4
        // https://show.bookmarkearth.com/view/801
        // https://www.bookmarkearth.com/view/801
        bookmarkearth: { pattern: /(https?:\/\/show\.bookmarkearth\.com\/view\/.+)$/, resolver: bmeResolver },
        bookmarkearth2: { pattern: /(https?:\/\/www\.bookmarkearth\.com\/view\/.+)$/, resolver: bmeResolver },

        // 以下网站a标签的herf未修改, 推测是js做的弹窗, 所以不需要匹配, 也匹配不出来
        // csdn https://link.csdn.net/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FRegExp
        // 语雀 https://www.yuque.com/r/goto?url=https%3A%2F%2Fwww.canva.cn%2F

        // https://blog.csdn.net/weixin_41010294/article/details/85289852
        csdn: { host: 'csdn.net' },
        // https://link.csdn.net/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FRegExp
        csdn2: { pattern: /https?:\/\/link\.csdn\.net\/\?target=(.+)$/ },

        // https://www.yuque.com/yuque/gpvawt/fuu6h3
        yuque: { host: 'yuque.com' },
    }

    const matchHostResolver = (url, host) => {
        // 1. 需要当前网站与host匹配
        if (!window.location.host.includes(host)) {
            return false;
        }
        // 2. url为外链
        if (url.host.includes(host)) {
            return false;
        }

        return true;
    }

    const getMatchPattern = (url) => {
        for (let i in patter_match) {
            // console.log("url:", url, "patter_match[i]:", patter_match[i])
            if (patter_match[i].hasOwnProperty('host') && matchHostResolver(url, patter_match[i].host)) {
                return patter_match[i];
            }
            if (patter_match[i].hasOwnProperty('pattern') && url.href.match(patter_match[i].pattern)) {
                return patter_match[i];
            }
        }
        return null;
    }

    const resolveRealURI = async (href) => {
        // TODO 兼容套娃链接, 如 https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgitee.com%2Fnocobase%2Fnocobase
        const fallbackURI = href;

        for (let i in patter_match) {
            const matcher = href.match(patter_match[i].pattern);
            if (!matcher) {
                continue;
            }
            console.log({ matcher });

            if (patter_match[i].hasOwnProperty('resolver')) {
                // complex customize resolver
                console.log(patter_match[i].resolver)
                let realURI = await patter_match[i].resolver(href);
                return realURI;
            }

            const encodeURI = matcher[1];
            // simple reg resolver
            return decodeURIComponent(encodeURI);
        }
        return fallbackURI;
    }

    const patternResolve = async (patter_match, href) => {

        if (patter_match.hasOwnProperty('resolver')) {
            // complex customize resolver
            console.log(patter_match.resolver)
            let realURI = await patter_match.resolver(href);
            return realURI;
        }

        if (patter_match.hasOwnProperty('pattern')) {
            const matcher = href.match(patter_match.pattern);
            if (!matcher) { return href; }
            const encodeURI = matcher[1];
            return decodeURIComponent(encodeURI);
        }

        return href;
    }

    const getAnchorElement = (e) => {
        let target = e.target;
        while (target) {
            if (target.tagName.toLowerCase() === 'a' && target.hasAttribute('href')) {
                return target;
            }
            target = target.parentElement;
        }
        return null;
    }

    /// 主体函数
    /// link: 原始链接
    /// e: 事件对象 
    /// handleEventAfterMatch: 匹配到规则后的事件处理
    /// handleRealURI: 处理真实链接
    /// errCallback: 错误回调
    const otld = (link, e, handleEventAfterMatch, handleRealURI, errCallback) => {
        let url = getValidURL(link);
        if (url === null || !isHttpProtocol(url)) {
            return;
        }

        console.log({ url });

        const matchPattern = getMatchPattern(url);
        console.log({ matchPattern });
        if (!matchPattern) {
            console.log("不匹配处理规则, 如有误, 请反馈给我, 非常感谢");
            return;
        }

        handleEventAfterMatch && handleEventAfterMatch(e);

        const target = (() => {
            // csdn 打开新标签页兼容处理
            if (matchPattern == patter_match.csdn) {
                return '_blank';
            }

            if (!e || !getAnchorElement(e)) {
                return '_self';
            }

            let anchor = getAnchorElement(e);
            if (anchor.hasAttribute('target')) {
                return anchor.getAttribute('target');
            }
            return '_self';
        })();

        patternResolve(matchPattern, url.href).then((realURI) => {
            console.log({ realURI });
            handleRealURI(realURI, target);
        }).catch(() => { errCallback && errCallback(target); });
    }


    document.addEventListener('click', (e) => {
        console.log({ e })

        // 找到a标签
        let anchor = getAnchorElement(e);
        if (!anchor) {
            return;
        }

        console.log({ anchor })
        let href = anchor.getAttribute('href');
        if (!href) {
            return;
        }

        const stopEvent = (e) => {
            if (!e) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
        }

        otld(href, e, stopEvent, (realURI, target) => { window.open(realURI, target) }, (target) => { window.open(href, target); });

    }, { capture: true })

    /// 处理手动输入或者鼠标拖动的链接
    otld(window.location.href, null, null, (realURI, target) => { window.location.replace(realURI); }, null);

})();
