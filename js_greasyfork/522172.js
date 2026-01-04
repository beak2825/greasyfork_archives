// ==UserScript==
// @name         goofish
// @namespace    http://tampermonkey.net/
// @version      1.1.14
// @description  下载闲鱼图片和视频
// @author       You
// @match        https://2.taobao.com/item-detail*
// @match        https://www.goofish.com/item*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522172/goofish.user.js
// @updateURL https://update.greasyfork.org/scripts/522172/goofish.meta.js
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("success");
        }, time);
    });
}

async function download(options) {
    return new Promise((resolve, reject) => {
        GM_download({
            ...options,
            onload: resolve,
            onerror: reject,
            ontimeout: reject,
        });
    });
}

async function downloadMedia(sellerId, id, images, video) {
    if (video) {
        await download({
            url: video,
            name: `goofish_${sellerId}_${id}_0.mp4`,
        });
    }
    await sleep(500);
    for (let i = 0; i < images.length; i++) {
        const { image } = images[i];
        const ext = image.split(".")[image.split(".").length - 1];
        const filename = `goofish_${sellerId}_${id}_${video ? i + 1 : i}.${ext}`;
        console.log(filename)
        await download({
            url: image,
            name: filename,
        });
        if (i < images.length - 1) {
            await sleep(500);
        }
    }
}

const alertWhenClose = (event) => {
    event.preventDefault();
    window.alert("请不要关闭页面，否则无法下载图片和视频。");
};

function waitForElement(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

(async function () {
    "use strict";
    // Your code here...

    let id = "";
    try {
        const regex = /itemId=([^&]+)/;
        const match = window.location.search.match(regex);
        id = match[1];
    } catch (e) {
        const regex = /id=([^&]+)/;
        const match = window.location.search.match(regex);
        id = match[1];
    }


    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener(
                "readystatechange",
                async function (e) {
                    if (
                        this.readyState === 4 &&
                        (this.responseURL.includes("awesome.detail") ||
                         this.responseURL.includes("taobao.idle.pc.detail"))
                    ) {
                        const jsonData = JSON.parse(this.response).data;
                        const sellerId = jsonData.sellerDO.sellerId;
                        const data = JSON.parse(
                            jsonData.itemDO.shareData
                            .shareInfoJsonString
                        ).contentParams.mainParams;

                        const images = data.images;
                        const video = JSON.parse(this.response).data.itemDO?.videoPlayInfo
                        ?.playUrl;
                        const count = images.length + (video ? 1 : 0);
                        await waitForElement(
                            "div[class^='sidebar-container']>div[class^='sidebar-item-container']>div[style='display: block;']>div>div[class^='sidebar-item-wrap']>div[class^='icon-big-container']"
                        );
                        // 添加下载按钮
                        const btnsContainer = await waitForElement(
                            "div[class^='sidebar-container']>div[class^='sidebar-item-container']>div[style='display: block;']"
                        );
                        const _cloneBtn = await waitForElement(
                            "div[class^='sidebar-container']>div[class^='sidebar-item-container']>div[style='display: block;']>*:nth-last-child(3)"
                        );

                        // // 克隆按钮
                        const saveBtn = _cloneBtn.cloneNode(true);

                        // const saveBtn = document.createElement("div");
                        // saveBtn.innerHTML = `<div class="sidebar-item-wrap--EGyyd81t"><div class="sidebar-item-divider--hXt0Yd15"></div><div class="icon-big-container--XEsfsYSk"><img class="icon-big--gxPveA3X" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO2WTQrCQAyFP1T8uZOewsO4c2u9hRs3rgTB1gNVL1EYCYwiQ0szmVFc9MGDWbzJRwKBQL+mwB64Ay5wDRQ+k6yiBeACSyZZbZ24wI8cIKd0sgaQWcPo/mt0a6CJKO463PhanRoBpwygMzDu60oCxwTIFZhpR2iFlcBcC7HCSgskFlalQLSwKgekD3aLgWgXTmCHj/wFWMTUj9ls2bMNsAUmyj8mkEXu56DaP5ZfgKx8bWGozqlU7wQkx5/AXp3l9PvAfAKV7hPWLfRRtQAAAABJRU5ErkJggg==" style="object-fit: cover;"></div><div class="sidebar-item-text-container--KNEB4FFf">下载(${count})</div></div>`;
                        const lastBtn = await waitForElement(
                            "div[class^='sidebar-container']>div[class^='sidebar-item-container']>div[style='display: block;']>*:nth-last-child(1)"
                        );
                        const completeIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADWElEQVR4nO2Y/0sTYRzHH7M0zbQsrRQyzUmZq9a088tk8/J0s+f8Pqc5N81bhCD0HyREf0C/RF/ot6CQKMXSLHRmpanZdC7drs2bQYkFitEPGekT07KS1MfN8oR7weu3u/fn/dw93B0HgICAgICAgIDAHzAj9CGDk37IcPQlPSffDNYTjJOOZDj43uCk0Zyw88w7uBOsBypYZYjBCa2/ys/JcPD1GQfcC/hMNasMZDi6d2H53+7EW9fWAnykmlX6GjjYsnj5H3JwGCDgBfjEeXR+A8PB2mXLu7aSkx7l3QIYJ7yMU97ghFOGkex0wCcMHF2DdeU5OF05DDWATzAcPMtwEOF58pzbg6os8gDtKLVlVcs7lIWVDtW3yuEstKwO1QW3B5XbKbLCnvm5wp4xqX+Tkbsa5V2Z5faMLxX2TIThNbcHaa1UpJ6lPupZCs1qo2b0NqrGk/I6K3lYZ6Mm5jPZJbRR9XKjfKNbg04PJW/V2cgBnY1ECy2zklfdCdaxafvLbOTo3zJ1C7WSbW5/A7mey9pBeb12SIEWs3RQ0eRaJG6m1k6FaocU7FKZ2p8OKsynzLLtwF2KB1LOlVhkCMPuYjOxa7k89cv0oBKLrA8ns9gic5QOpu4BnqDpJ25ozIkIxyJzIqcZIA4uluXaBpp+og0vixhTWxKjPSo/uwATsa/AlGAv7EtAOBaY4scLTFLFwhx1rdq7sC/+HlaOKf5TXr/0mMfl54dbYoPzXh19kv9KgnDM65VM5fdKyuYDEPDK75Vcxz23wHQkA6w2SjbaN6dHfDOnR4yw7BbP5PSIa1zls3viLuKck90tns7tiisC/wwEvGBX7EW6KxZh+yK2A/dY2H2gCvwPsjpF5aoO0VRWZwxaLVWdIo9eiitG9TyKzHwWNaF8FoU8N/IKWAvS28JFVHsES7VHIPfdW6euBd5grTjxOGxHWmv4U9IYjlZqWmuYUW6MWPvfJMrGaF9FS+gtRcsutALNcmPQNsAbEPBKbd5ek/ooGC1rc7BDbgzZDfhISmNAZXJj4NfkpkD0N5OaAj/IHmyNAXwmocE/k2jwmyTu+6PfPX7fbzyp0V8C1gPSu777pfU+t+PrN41J63wmpXWb7hANPqK17iUgICAgIAD4zHd5fAGgfbEhmQAAAABJRU5ErkJggg=="
                        const downloadIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO2WTQrCQAyFP1T8uZOewsO4c2u9hRs3rgTB1gNVL1EYCYwiQ0szmVFc9MGDWbzJRwKBQL+mwB64Ay5wDRQ+k6yiBeACSyZZbZ24wI8cIKd0sgaQWcPo/mt0a6CJKO463PhanRoBpwygMzDu60oCxwTIFZhpR2iFlcBcC7HCSgskFlalQLSwKgekD3aLgWgXTmCHj/wFWMTUj9ls2bMNsAUmyj8mkEXu56DaP5ZfgKx8bWGozqlU7wQkx5/AXp3l9PvAfAKV7hPWLfRRtQAAAABJRU5ErkJggg=="

                        saveBtn.querySelector("img").src = downloadIcon;

                        const saveBtnText = saveBtn.querySelector(
                            "div[class^='sidebar-item-text-container']"
                        );

                        // 设置按钮文字
                        saveBtnText.innerText = `下载(${count})`;

                        // 按钮点击事件
                        saveBtn.onclick = null;
                        saveBtn.href = "javascript:void(0);";
                        saveBtn.addEventListener("click", async function (event) {
                            event.preventDefault()
                            window.addEventListener("beforeunload", alertWhenClose);
                            await downloadMedia(sellerId, id, images, video);
                            GM_notification({
                                image:
                                "https://img.alicdn.com/tfs/TB19WObTNv1gK0jSZFFXXb0sXXa-144-144.png",
                                title: "下载完成",
                                text: `${video ? "1 个视频 ，" : ""}${
                  images.length
                            } 张图片已下载完成。`,
                            });
                            window.removeEventListener("beforeunload", alertWhenClose);
                        });

                        btnsContainer.insertBefore(saveBtn, lastBtn);
                    }
                },
                false
            );

            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();
