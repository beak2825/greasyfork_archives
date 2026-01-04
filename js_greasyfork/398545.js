// ==UserScript==
// @name              Make AV number, not BV code
// @name:en           Make AV number, not BV code
// @name:zh-CN        要AV号，不要BV码
// @namespace         https://pilipili.com/bv10492
// @version           0.1.5
// @description       Make AV number, not BV code. F**k you BiliBili
// @description:en    Make AV number, not BV code. F**k you BiliBili
// @description:zh-CN 要AV号，不要BV码，屑站飞了
// @author            jk1551
// @require           https://unpkg.com/ajax-hook@2.0.0/dist/ajaxhook.min.js
// @nocompat          Chrome
// @nocompat          Firefox
// @nocompat          Opera
// @nocompat          Edge
// @match             https://www.bilibili.com/video/*
// @match             http://www.bilibili.com/video/*
// @match             https://www.bilibili.com/bangumi/play/*
// @match             http://www.bilibili.com/bangumi/play/*
// @match             https://acg.tv/*
// @match             http://acg.tv/*
// @match             https://b23.tv/*
// @match             http://b23.tv/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/398545/Make%20AV%20number%2C%20not%20BV%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/398545/Make%20AV%20number%2C%20not%20BV%20code.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const CONFIG = {
    autoJump: false
};

// GM代码构思来自 https://greasyfork.org/zh-CN/scripts/398526-give-me-av-not-bv

(() => {
    if (typeof BigInt !== "function") {
        console.warn("Your browser does not support BigInt. AV/BV conversion is disabled.");
        return;
    }

    const bv2av = (() => {
        // https://www.zhihu.com/question/381784377/answer/1099438784
        const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
        const tr = Object.create(null);

        for (let i = 0; i < 58; i += 1) {
            tr[table[i]] = BigInt(i);
        }

        const s = [11, 10, 3, 8, 4, 6/* ←今ここ */, 2, 9, 5, 7/* 最大値 */];
        // 不用BigInt的话后面做位运算就爆炸了
        const xor = BigInt(177451812);
        const add = BigInt(8728348608);
        const pow58 = [];

        // 58进制下2^32的最大位数（=6），也就是在此之前变动的最多位数，也就是s表的长度
        // 以后用随机av号，超过27个二进制位的时候，就可以把上面的封印解除啦
        const highestDigit = 6;

        for (let i = 0; i < highestDigit; i += 1) {
            pow58.push(BigInt(Math.pow(58, i)));
        }

        /**
         * @param s {string}
         */
        function list(s) {
            return s.split("");
        }

        /**
         * @param x {string} BV string; including the beginning "BV" (e.g. "BV17x411w7KC")
         */
        function dec(x) {
            let r = BigInt(0);

            for (let i = 0; i < highestDigit; i += 1) {
                r += tr[x[s[i]]] * pow58[i];
            }

            return Number((r - add) ^ xor);
        }

        /**
         * @param x {number} Exsiting AV number
         */
        function enc(x) {
            x = BigInt(x);
            x = (x ^ xor) + add;

            const r = list("BV1  4 1 7  ");

            for (let i = 0; i < highestDigit; i += 1) {
                const index = (x / pow58[i]) % BigInt(58);
                r[s[i]] = table[index];
            }

            return r.join("");
        }

        return {
            enc: enc,
            dec: dec
        };
    })();

    /**
     * @param avNumber {number | string | bigint}
     */
    function getAvUrl(avNumber) {
        return "/video/av" + avNumber.toString();
    }

    /**
     * @param avNumber {number | string | bigint}
     */
    function getAvText(avNumber) {
        return "av" + avNumber.toString();
    }

    /**
     * @param avNumber {number | string}
     */
    function appendOrUpdateAvNumberLink(avNumber) {
        const avInfoLabels = document.getElementsByClassName("video-data");
        // 第一行：分区和日期
        const infoBlock1 = avInfoLabels[0];

        // 投稿日期span
        // 直接塞到和infoBlock1同级会导致谜之排版错误，只好借壳咯（其实是Vue的锅
        const info1 = infoBlock1.children[1];

        // 我放弃创建新的元素了……干脆直接黑魔法换个a
        const avreg = /av\d+/;
        const oldContent = info1.textContent;
        
        if (!avreg.test(oldContent)) {
            const avUrl = getAvUrl(avNumber);
            const avText = getAvText(avNumber);
            info1.outerHTML = `<a href="${avUrl}" title="${avText}" target="_blank">${oldContent}\u00a0${avText}</a>`;
            // 以下两行本来是调整样式，让其显示跟原来差不多的，但是Vue似乎劫持了样式设定，所以没出效果也就算了
            info1.style.color = "#999";
            info1.style.height = "16px";
        }
    }

    /**
     * @param avNumber {number | string}
     */
    function modifyBangumiAvNumberLink(avNumber) {
        const pubs = document.getElementsByClassName("pub-wrapper");

        if (!pubs || pubs.length === 0) {
            return;
        }

        const avLink = pubs[0].querySelector("a.av-link");

        if (!avLink) {
            return;
        }

        avLink.textContent = getAvText(avNumber);
        avLink.href = getAvUrl(avNumber);
    }

    (() => {
        const bvUrlRE = /\/video\/(BV[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)/;
        const bvmatch = bvUrlRE.exec(window.location.href);

        if (bvmatch) {
            console.log("F**k You BV Number!");

            if (CONFIG.autoJump) {
                const bvstr = bvmatch[1];
                const avNumber = bv2av.dec(bvstr);
                const url = getAvUrl(avNumber);
                window.location.href = url;
            }
        }
    })();

    let isContentRefreshed = false;
    let avNumber = Number.NaN;
    let pageType = Number.NaN;

    const PageType = {
        video: 0,
        bangumi: 1
    };

    // TODO: 处理 HTML5 History 相关

    const bvidRE = /bvid=(BV[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)/;
    const aidRE = /aid=(\d+)/;
    const avidRE = /avid=(\d+)/;

    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            let match;

            if (config.url.indexOf("api.bilibili.com/x/web-interface/view") > 0) {
                match = bvidRE.exec(config.url);

                if (match) {
                    // https://api.bilibili.com/x/web-interface/view?cid=167028524&bvid=BV1TE411A7VJ
                    avNumber = bv2av.dec(match[1]);
                    isContentRefreshed = true;
                    pageType = PageType.video;
                } else {
                    match = aidRE.exec(config.url);

                    if (match) {
                        // https://api.bilibili.com/x/web-interface/view?cid=167028524&aid=97836354
                        avNumber = Number.parseInt(match[1]);
                        isContentRefreshed = true;
                        pageType = PageType.video;
                    }
                }
            } else if (config.url.indexOf("api.bilibili.com/pgc/player/web/playurl") > 0) {
                match = avidRE.exec(config.url);

                if (match) {
                    // https://api.bilibili.com/pgc/player/web/playurl?cid=122062626&qn=0&type=&otype=json&avid=70455036&ep_id=286039&fourk=1&fnver=0&fnval=16&session=xxx
                    avNumber = Number.parseInt(match[1]);
                    isContentRefreshed = true;
                    pageType = PageType.bangumi;
                }
            }

            handler.next(config);
        },

        //请求成功后进入
        onResponse: (response, handler) => {
            if (response.config.url.indexOf("api.bilibili.com") > 0) {
                if (isContentRefreshed) {
                    switch (pageType) {
                        case PageType.video: {
                            if (!Number.isNaN(avNumber)) {
                                setTimeout(() => appendOrUpdateAvNumberLink(avNumber));
                            }

                            break;
                        }
                        case PageType.bangumi: {
                            if (!Number.isNaN(avNumber)) {
                                setTimeout(() => modifyBangumiAvNumberLink(avNumber));
                            }

                            break;
                        }
                        default:
                            break;
                    }
                }
            }

            handler.next(response);
        }
    });
})();
