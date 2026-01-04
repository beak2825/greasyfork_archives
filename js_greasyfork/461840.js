// ==UserScript==
// @name         去纯色背景
// @namespace    com.fachep.pureColorBackgroundOff
// @version      0.1
// @description  计算背景像素平均值、标准差等，将纯色背景图改为颜色
// @author       Fachep
// @license      MIT
// @match        *://www.taobao.com/*
// @match        *://www.tmall.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      alicdn.com
// @downloadURL https://update.greasyfork.org/scripts/461840/%E5%8E%BB%E7%BA%AF%E8%89%B2%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/461840/%E5%8E%BB%E7%BA%AF%E8%89%B2%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

"use strict";

const globalSelectors = {
    "^.*$": ["body"],
    "^[^\\.]+\\.tmall\\.com.*$": ["body>.rax-view-v2"],
};

let stdMax = GM_getValue("stdMax");
if (!stdMax) {
    GM_setValue("stdMax", 16);
    stdMax = 16;
}

(function () {
    for (const reg in globalSelectors) {
        if (Object.hasOwnProperty.call(globalSelectors, reg)) {
            if (!new RegExp(reg, "i").test(window.location.href)) continue;
            const selectors = globalSelectors[reg];
            for (const selector of selectors) {
                bgOff(document.querySelector(selector));
            }
        }
    }
})();

function bgOff(ele) {
    let bg = window
        .getComputedStyle(ele)
        .getPropertyValue("background-image")
        ?.match(/url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i)?.[1];
    if (!bg) return;

    GM_xmlhttpRequest({
        method: "GET",
        url: bg,
        responseType: "blob",
        onload: (res) => {
            createImageBitmap(res.response).then((img) => {
                let [width, height] = [img.width, img.height];
                let cvs = new OffscreenCanvas(width, height);
                let ctx = cvs.getContext("2d");
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0);
                let data = ctx.getImageData(0, 0, width, height).data;
                let length = data.length / 4;
                if (length != width * height) return;
                let [r, g, b, a] = [0, 0, 0, 0];
                for (let i = 0; i < length; i++) {
                    r += data[i * 4 + 0];
                    g += data[i * 4 + 1];
                    b += data[i * 4 + 2];
                    a += data[i * 4 + 3];
                }
                let [ra, ga, ba, aa] = [
                    r / length,
                    g / length,
                    b / length,
                    a / length,
                ];
                let [rs, gs, bs, as] = [0, 0, 0, 0];
                for (let i = 0; i < length; i++) {
                    rs += (data[i * 4 + 0] - ra) ** 2;
                    gs += (data[i * 4 + 1] - ga) ** 2;
                    bs += (data[i * 4 + 2] - ba) ** 2;
                    as += (data[i * 4 + 3] - aa) ** 2;
                }
                let [rsa, gsa, bsa, asa] = [
                    Math.sqrt(rs / length),
                    Math.sqrt(gs / length),
                    Math.sqrt(bs / length),
                    Math.sqrt(as / length),
                ];
                if (
                    rsa < stdMax &&
                    gsa < stdMax &&
                    bsa < stdMax &&
                    asa < stdMax
                ) {
                    ele.style.setProperty("background-image", "none");
                    ele.style.setProperty(
                        "background-color",
                        `rgba(${ra} ${ga} ${ba} / ${(
                            (aa / 255) *
                            100
                        ).toFixed()}%)`
                    );
                }
            });
        },
    });
}
