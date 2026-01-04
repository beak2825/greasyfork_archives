// ==UserScript==
// @name         NLegs Loader
// @version      2025.9.19
// @description  Loads original images in one page
// @author       德克斯DEX
// @match        *://www.nlegs.com/girls/*.html
// @match        *://www.honeyleg.com/article/*.html
// @match        *://www.ladylap.com/show/*
// @match        *://www.nuyet.com/gallery/*
// @match        *://www.legbabe.com/*.html
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFMElEQVRYhbVXXWxTZRjujaiJMdHERGOMiVEvlNMKJmo0GhMXBYwRIf4l4PQGjTBvuJCweDH8A50kJARwwsbWrDvtxhDGBggOuo39sG5tz2lZt3bt1m5t6dZu/SMOLx6/97DTnLan25nOkzxJz3e+c57n+973e9+nurKy19cw3MWgW+p6wTh6P2d2faw3C79xZuE61yTGOLN4m+OF21yjPcY1Dg3qjbbjhvr+bYaD/IPLfS93LUeub3I8zfHiCYas3iwiD7wAvcleBK5JyHK88/hzLe6ntAhQHX/J0nsvW2E1I/67iHgJcml8cQ7tELv/6fG6wD3atmPxIuWMWFQl1khegL7nT7kf0USuN7nXUXxXkVx+L7TWJOiXX/l/IDcwbOnwoLLHj9da3aoinrG4Hpb58sJPcWITHCslL/vdjT3d42h2hzAejiEej0uocwZLfEe0UX4ROR2AnABKOC3kL5od+PTCDRzq96HXH5bIAlMRtA+I2N/cifJDzTBdscEdipYMB9fkrFo8fWvuxP3OUVPN9nUMW9tc+P6aD+dvTGAqHEGI4ardg8PnevD5kdN4a1893qw6mcMONkbCNpwdUV9M43DacPjcYzkBdM6Vk95t92Bfnx/tnhAmw1FEo1G4vH60WG34rukSPqrm8d7+xpLYcsCEiekIvu0P4BWWCwaVneSMg8ckAVKFUxSZmuGApH7Q7YU3OI1kMplDKpVENpvFrVu3VoSu4GxRDnEme4Yqpu5Oec0lCGoHxzDiD+KNPUdwc2YWPu95BAb2SgjaKuERjqJtKqsZo4kspudSJU6P80Md1Xbl9n/ZbkdoOswEHJYEeIeqMdOzHYne7Zjr+wQj9oMwTmQ1wxrJIjibUD+6vPirjhqLMkFeNvYiHIlgc1VNToBMTrjs6dFM3hDI4MpUEpMziVJFq48EzCgThKsfQJcngJ2HTIjNxuF3/LJIXg6b0LAi8pO+eXSGCgQoe0WTeFPHBhbyE2QYB60i6jusiM/NwzV6Bg7nCbSPOVZMLgsIygIKyzUv/MVqgHOhMD7bWq9jzOtDYj6JPyPa411ILguIJubUewUJ4EzDM4UC1jf0wzfuRyKZWpEAIq/1JVAzNos675wkgHJgLpUuURFZCCQnU5AgTBQGXB7Mp5YXUDMeR6XgwmcDndhsbcWmTksOW7vO4IBbQCqTKdmmdWSjChOE9QXwfQLS6TRqRsexe3AI39hd+Nk9Ia2SiOsDaex2DOGd7tPYZG3BpiuWPHLpno1/7ehHLFliB8ziMR15OLUE+aK1FxmmfEf3H3i1rTaHjRfN2GsXUM5W/HbXqSXJ6TkJCM+XEMAL7+vW7zc+wH5kCh8+e/SyqgBC2aVGTeRLCWCrzzBvcJ9kCshAFgk43o00E1Bpu1YkYOPVZk3khOobgvoO8EJNvhMiA6kUUNeHGDuG1EzCrBFNK+CNswo5E8Mka1oygomE9CzMEldGlIHeH43NF5IvcC3CE/lekLlX5aS1Rhs2NF5DRZsNFR12VFxwSth13oFd7UPYqQDd07g8R4mvLorYeNZdEHvxxyI/KFkydixKuiINnlATeKH3yY7Ru4s8IV1kGFl3DP5f5KzvTBss9kdl8jxPKF9kncm9rvrK2cI4i5NTkucsWZE9tww/xF6yrua2y3ZcSV5SAF0UJ3KvZJ3+NTllu1n8QRlzJfmSAuTJ5F7JQOaEaCCnIkNuR3nU1MhVc6DUZKqY5OGofq81C/3UyRa9xAL9lsZ48ajBLHwgVbhlvif/K/8H+XyqkCfHcFQAAAAASUVORK5CYII=
// @license      MIT
// @namespace    https://greasyfork.org/users/20361
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @require      https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @downloadURL https://update.greasyfork.org/scripts/463123/NLegs%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/463123/NLegs%20Loader.meta.js
// ==/UserScript==

/*
此站大圖質量還算不錯的，可惜人機驗證神煩！！！

獲取大圖操作
1.自動取得所有預覽圖
2.手動點擊載入全部大圖按鈕來獲取大圖
3.等待替換元素
4.遇到人機驗證會跳出警告結束取得迴圈
5.在新開啟的分頁完成人機驗證
6.回來繼續按載入大圖按鈕取得大圖

東方永頁機用戶請添加黑名單網址避免衝突
https://www.nlegs.com/girls/*.html
https://www.honeyleg.com/article/*.html
https://www.ladylap.com/show/*
https://www.nuyet.com/gallery/*
https://www.legbabe.com/hot/*
*/

(async () => {
    'use strict';
    const language = navigator.language;
    let displayLanguage = {};
    switch (language) {
        case "zh-TW":
        case "zh-HK":
        case "zh-Hant-TW":
        case "zh-Hant-HK":
            displayLanguage = {
                str_01: "獲取預覽圖遇到了人機驗證，將重新載入頁面",
                str_02: "預覽圖連一張都沒有了！",
                str_03: "獲取大圖中請勿重複操作！",
                str_04: "點擊繼續載入大圖",
                str_05: "獲取大圖中斷，遇到了人機驗證，請在新開啟的分頁裡完成人機驗證後，再回來按載入大圖按鈕繼續獲取大圖。",
                str_06: "所有大圖獲取完畢",
                str_07: "大圖一張也沒有！",
                str_08: "獲取大圖或下載或壓縮中請等待完成再操作！",
                str_09: "下載第",
                str_10: "張",
                str_11: "壓縮進度: ",
                str_12: "壓縮打包下載圖片",
                str_13: "點擊載入全部大圖",
                str_14: "鏈接逐張下載大圖",
                str_15: "圖片自適應視窗"
            };
            break;
        case "zh-CN":
        case "zh-Hans-CN":
            displayLanguage = {
                str_01: "获取预览图遇到了人机验证，将重新加载页面",
                str_02: "预览图连一张都没有了！",
                str_03: "获取大图中请勿重复操作！",
                str_04: "点击继续加载大图",
                str_05: "获取大图中断，遇到了人机验证，请在新开启的标籤页里完成人机验证后，再回来按加载大图按钮继续获取大图。",
                str_06: "所有大图获取完毕",
                str_07: "大图一张也没有！",
                str_08: "获取大图或下载或压缩中请等待完成再操作！",
                str_09: "下载第",
                str_10: "张",
                str_11: "压缩进度: ",
                str_12: "压缩打包下载图片",
                str_13: "点击加载全部大图",
                str_14: "链接逐张下载大图",
                str_15: "图片自适应窗口"
            };
            break;
        default:
            displayLanguage = {
                str_01: "Get preview Encountered human-machine verification will reload the page",
                str_02: "There’s not even a single preview image left.",
                str_03: "Get original picturesing Do not repeat operations",
                str_04: "Click to load",
                str_05: "Get original image interrupt Encountered human-machine verification Please complete the human-machine verification in the newly opened tab. come back again Click to load",
                str_06: "get completed",
                str_07: "There is not a single original picture",
                str_08: "Obtaining original image or downloading or compressing Please wait until completion before proceeding",
                str_09: "download No.",
                str_10: "P",
                str_11: "progress: ",
                str_12: "zip download",
                str_13: "Click to load",
                str_14: "link download",
                str_15: "Image adaptive viewport"
            };
            break;
    }
    const resBlobArray = [];
    const ge = (selector, doc) => (doc || document).querySelector(selector);
    const gae = (selector, doc) => (doc || document).querySelectorAll(selector);
    const gx = (xpath, doc) => (doc || document).evaluate(xpath, (doc || document), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const gax = (xpath, doc) => {
        let nodes = [];
        let results = (doc || document).evaluate(xpath, (doc || document), null, XPathResult.ANY_TYPE, null);
        let node;
        while (node = results.iterateNext()) {
            nodes.push(node);
        }
        return nodes;
    };
    const waitEle = selector => new Promise(resolve => {
        const loop = setInterval(() => {
            let ele = ge(selector);
            if (!!ele) {
                clearInterval(loop);
                resolve(ele);
            }
        }, 100);
    });
    const parseHTML = str => new DOMParser().parseFromString(str, 'text/html');
    const openInNewTab = () => gae('a[href*=image]').forEach(a => (a.setAttribute('target', '_blank')));
    const checkImgStatus = src => new Promise(r => {
        const temp = new Image();
        temp.onload = r(true);
        temp.onerror = r(false);
        temp.src = src;
    });
    const _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : GM.openInTab)();
    const _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : GM.getValue)();
    const _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : GM.setValue)();
    const _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : GM.registerMenuCommand)();

    const item_xpath = "//div[a[@class='thumbnail']] | //div[a[div[@class='img-div']]] | //div[@class='col-md-2 col-sm-4 col-xs-12']";

    if (!gx(item_xpath)) {
        return;
    }

    let nlegsImgMode = _GM_getValue("nlegsImgMode");

    if (nlegsImgMode == undefined) {
        _GM_setValue("nlegsImgMode", 0);
        nlegsImgMode = 0;
    }

    _GM_registerMenuCommand(nlegsImgMode == 0 ? `❌ ${displayLanguage.str_15}` : `✔️ ${displayLanguage.str_15}`, () => {
        nlegsImgMode == 0 ? _GM_setValue("nlegsImgMode", 1) : _GM_setValue("nlegsImgMode", 0);
        location.reload();
    });

    let get_error = false;

    const lastPage = await waitEle('.pagination>li:last-child>a');

    if (lastPage.innerText == 1) {
        addButton();
        openInNewTab();
    } else {
        const pages = gae('.pagination>li>a');
        const getAllThumb = async () => {
            for (let i = 1; i < pages.length; i++) {
                const res = await fetch(pages[i].href, {
                    cache: "no-store"
                });
                console.log(pages[i].href, "\n", res);
                if (!res.ok) {
                    get_error = true;
                    return alert(`Get image thumbs\n${pages[i].href}\nHTTP response status codes：${res.status}`);
                }
                const lastUrl = await res.url;
                if (lastUrl.includes("hcaptcha")) {
                    document.title = displayLanguage.str_01;
                    return location.reload();
                }
                const resText = await res.text();
                const doc = await parseHTML(resText);
                if (!gx(item_xpath, doc)) {
                    document.title = displayLanguage.str_01;
                    return location.reload();
                }
                const thumbs = gax(item_xpath, doc);
                console.log(`第${parseInt(i)+1}頁\n`, thumbs);
                const fragment = new DocumentFragment();
                thumbs.forEach(thumb => fragment.appendChild(thumb));
                gx(item_xpath).parentNode.appendChild(fragment);
                const e = '.pagination';
                ge(e).outerHTML = ge(e, doc).outerHTML;
            }
            addButton();
            openInNewTab();
        };
        getAllThumb();
    }

    if (get_error) return;

    const getAllOriginal = async () => {
        const links = gae('a[href*=image]');
        if (!links[0]) {
            alert(displayLanguage.str_02);
            return;
        }
        if (/\d+/.test(ge('.getBigImg').innerText)) {
            return alert(displayLanguage.str_03);
        }
        for (let i = 0; i < links.length; i++) {
            const res = await fetch(links[i].href, {
                cache: "no-store"
            });
            const lastUrl = await res.url;
            if (lastUrl.includes("hcaptcha")) {
                ge('.getBigImg').innerText = displayLanguage.str_04;
                _GM_openInTab(ge('a[href*=image]').href);
                return alert(displayLanguage.str_05);
            }
            const resText = await res.text();
            const doc = await parseHTML(resText);
            const imgRes = ge('img[id^=Image]', doc);
            if (!imgRes) {
                ge('.getBigImg').innerText = displayLanguage.str_04;
                _GM_openInTab(ge('a[href*=image]').href);
                return alert(displayLanguage.str_05);
            } else {
                ge('.getBigImg').innerText = `獲取第${parseInt(i)+1}/${links.length}張`;
                const res = await fetch(imgRes.src, {
                    cache: "no-store"
                });
                const resBlob = await res.blob();
                const objectURL = URL.createObjectURL(resBlob);
                const check = await checkImgStatus(objectURL);
                if (check != true) {
                    ge('.getBigImg').innerText = displayLanguage.str_04;
                    _GM_openInTab(ge('a[href*=image]').href);
                    return alert(displayLanguage.str_05);
                }
                resBlobArray.push(resBlob);
                links[i].parentNode.outerHTML = `<img class="${nlegsImgMode == 0 ? "auto" : "vh"}" src="${objectURL}">`;
            }
        }
        console.log('所有圖片Blob數據\n', resBlobArray);
        ge('.getBigImg').innerText = displayLanguage.str_06;
        setTimeout(() => (ge('.getBigImg').style.display = "none"), 1000);
    };

    const imgZipDownload = async () => {
        const imgs = gae('img[src^=blob]');
        if (!imgs[0]) {
            return alert(displayLanguage.str_07);
        }
        if (/\d+/.test(ge('.zipmsg').innerText) || /\d+/.test(ge('.getBigImg').innerText)) {
            return alert(displayLanguage.str_08);
        }
        const imgsNum = resBlobArray.length;
        const title = ge('[class^=container] p').innerText.replace(/\[\d+[-\.\+\w]+\]/, '').trim();
        const zip = new JSZip();
        const zipFolder = zip.folder(`${title} [${imgsNum}P]`);
        for (let i = 0; i < imgsNum; i++) {
            const n = parseInt(i) + 1;
            const padStart = String(imgsNum).length;
            const pn = String(n).padStart(padStart, "0");
            const fileName = `${pn}P.jpg`;
            ge('.zipmsg').innerText = `${displayLanguage.str_09}${n}/${imgsNum}${displayLanguage.str_10}`;
            console.log(`第${n}/${imgsNum}張，檔案名：${fileName}，大小：${parseInt(resBlobArray[i].size / 1024)} Kb，下載完成！等待壓縮...`);
            zipFolder.file(fileName, resBlobArray[i], {
                binary: true
            });
        }
        zip.generateAsync({
            type: "blob"
        }, (metadata) => {
            ge('.zipmsg').innerText = displayLanguage.str_11 + metadata.percent.toFixed(2) + ' %';
            console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
        }).then(data => {
            console.log('ZIP壓縮檔數據\n', data);
            ge('.zipmsg').innerText = displayLanguage.str_12;
            let a = document.createElement('a');
            a.href = URL.createObjectURL(data);
            a.download = `${title} [${imgsNum}P].zip`;
            try {
                a.dispatchEvent(new MouseEvent("click"));
            } catch {
                let b = document.createEvent("MouseEvents");
                b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null);
                a.dispatchEvent(b);
            }
            setTimeout(() => URL.revokeObjectURL(data), 4000);
        });
    };

    const imgDownload = async () => {
        const imgs = gae('img[src^=blob]');
        const imgsNum = imgs.length;
        if (!imgs[0]) {
            return alert(displayLanguage.str_07);
        }
        const title = ge('[class^=container] p').innerText.replace(/\[\d+[-\.\+\w]+\]/, '').trim();
        for (let i = 0; i < imgsNum; i++) {
            const n = parseInt(i) + 1;
            const padStart = String(imgsNum).length;
            const pn = String(n).padStart(padStart, "0");
            const a = document.createElement('a');
            a.href = imgs[i].src;
            a.download = `${title}_${pn}P.jpg`;
            try {
                a.dispatchEvent(new MouseEvent("click"));
            } catch {
                let b = document.createEvent("MouseEvents");
                b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null);
                a.dispatchEvent(b);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    function addButton() {
        let ele;
        if (location.origin.includes("nlegs")) {
            if (ge("span.title")) {
                ele = ge('div:has(>span.title)');
            } else {
                ele = ge('.container div:has(>p)');
            }
        } else {
            if (ge('div:has(>p>input)')) {
                ele = ge('div:has(>p>input)');
            } else if (ge('#download')) {
                ele = ge('#download');
            } else {
                ele = ge('.col-md-12:has(>p) p');
            }
        }
        const p_div = document.createElement('div');
        p_div.style.marginBottom = "10px";
        const div = document.createElement('div');
        div.innerText = displayLanguage.str_13;
        div.className = 'btn btn-primary getBigImg';
        div.addEventListener("click", () => {
            getAllOriginal();
        });
        p_div.appendChild(div);
        const div2 = document.createElement('div');
        div2.innerText = displayLanguage.str_14;
        div2.className = 'btn btn-primary imgDownload';
        div2.addEventListener("click", () => {
            imgDownload();
        });
        p_div.appendChild(div2);
        const div3 = document.createElement('div');
        div3.innerText = displayLanguage.str_12;
        div3.className = 'btn btn-primary imgDownload zipmsg';
        div3.addEventListener("click", () => {
            imgZipDownload();
        });
        p_div.appendChild(div3);
        ele.appendChild(p_div);
    }

    const addReturnTopButton = () => {
        const a = document.createElement('a');
        a.href = 'javascript:void(0);';
        a.setAttribute('onclick', "window.scrollTo({top:0,behavior:'smooth'});");
        const img = new Image();
        img.src = 'data:image/png;base64,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';
        img.className = 'returnTop';
        a.appendChild(img);
        document.body.appendChild(a);
    };
    addReturnTopButton();

    const addGlobalStyle = css => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    };
    const css = `
.returnTop {
    position: fixed;
    right: 10px;
    bottom: 60px;
    width: 53px;
    z-index: 99;
    opacity: 0.5;
}
img[src^=blob].auto {
    width: auto;
    height: auto;
    max-width: 100%;
    display: block;
    margin: 0 auto;
}
img[src^=blob].vh {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 99vh;
    display: block;
    margin: 0 auto;
}
.imgDownload {
    display: inline;
    padding: 6px 12px!important;
    font-size: 16px;
    font-family: Arial,sans-serif!important;
    line-height: 24px;
    width: 150px;
    padding: 4px;
    margin-right: 5px;
    margin-bottom: 10px;
}
.getBigImg {
    font-size: 16px;
    font-family: Arial,sans-serif!important;
    line-height: 24px;
    width: 150px;
    position: fixed;
    z-index:999;
    bottom: 10px;
    left: 50%;
    margin-left: -75px;
    padding: 4px;
}
strong~div {
     display: table-cell!important;
}
    `;
    addGlobalStyle(css);

})();