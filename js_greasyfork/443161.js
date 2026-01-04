// ==UserScript==
// @name         哔滴影视广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  哔滴影视广告屏蔽（图片广告屏蔽及视频广告跳过）
// @author       limbopro
// @match        https://www.btbdys.com/*
// @match        https://www.bdys01.com/*
// @match        https://www.bdys02.com/*
// @match        https://www.bdys03.com/*
// @match        https://www.bdys04.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btbdys.com
// @grant        none
// @run-at document-end
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443161/%E5%93%94%E6%BB%B4%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443161/%E5%93%94%E6%BB%B4%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

const btbdys_css = ".ayx[style^=\"position\: fixed;bottom\"],#ad-index,#adsbox,.ayx[style=\"display:block;\"],.ayx[style^=\"position: fixed;bottom\"],a[target*=_new] {display:none !important;}" // 哔滴影视广告样式
const url = document.location.href;
const url_regx = "/play/";

css_adsRemove(btbdys_css, 500);
hrefAttribute_set();
if (url.indexOf(url_regx) !== -1) {
    videoAds_accelerateSkip(0.1);
}

// 动态创建引用内部资源 内嵌式样式 内嵌式脚本
function css_adsRemove(newstyle, delaytime, id) {
    setTimeout(() => {
        var creatcss = document.createElement("style");
        creatcss.id = id;
        creatcss.innerHTML = newstyle;
        document.getElementsByTagName('head')[0].appendChild(creatcss)
        console.log("CSS样式新增完毕！");
    }, delaytime);
}

/* 视频页广告加速跳过 */
function videoAds_accelerateSkip(fasterx) {
    // https://github.com/gorhill/uBlock/wiki
    /// nano-setInterval-booster.js
    /// alias nano-sib.js
    let needleArg = '{{1}}';
    if (needleArg === '{{1}}') { needleArg = ''; }
    let delayArg = '{{2}}';
    if (delayArg === '{{2}}') { delayArg = ''; }
    let boostArg = '{{3}}';
    if (boostArg === '{{3}}') { boostArg = ''; }
    if (needleArg === '') {
        needleArg = '.?';
    } else if (needleArg.charAt(0) === '/' && needleArg.slice(-1) === '/') {
        needleArg = needleArg.slice(1, -1);
    } else {
        needleArg = needleArg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    const reNeedle = new RegExp(needleArg);
    let delay = delayArg !== '*' ? parseInt(delayArg, 10) : -1;
    if (isNaN(delay) || isFinite(delay) === false) { delay = 1000; }
    let boost = parseFloat(boostArg);
    boost = isNaN(boost) === false && isFinite(boost)
        ? Math.min(Math.max(boost, fasterx), 50)
        : fasterx;
    self.setInterval = new Proxy(self.setInterval, {
        apply: function (target, thisArg, args) {
            const [a, b] = args;
            if (
                (delay === -1 || b === delay) &&
                reNeedle.test(a.toString())
            ) {
                args[1] = b * boost;
            }
            return target.apply(thisArg, args);
        }
    });
};

// 禁止新页面跳转
function hrefAttribute_set() {
    var href = document.querySelectorAll("a");
    var i;
    if (href.length > 0) {
        console.log("新标签页打开链接已被禁止；")
        for (i = 0; i < href.length; i++) {
            href[i].target = "_self";
        }
    }
}