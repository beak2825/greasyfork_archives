// ==UserScript==
// Copyright 2025 shadows
//
// Distributed under MIT license.
// See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
// @name         漫画下载 备份
// @namespace    shadows
// @version      10.2.1.002
// @description  从此类使用相同框架的漫画网站上下载免费或已付费的章节
// @author       shadows
// @license      MIT License
// @copyright    Copyright (c) 2025 shadows

// A类型网站
// @match        https://shonenjumpplus.com/episode/*
// @match        https://comic-days.com/episode/*
// @match        https://comic-days.com/volume/*
// @match        https://comic-days.com/magazine/*
// @match        https://comic-gardo.com/episode/*
// @match        https://magcomi.com/episode/*
// @match        https://magcomi.com/volume/*
// @match        https://viewer.heros-web.com/episode/*
// @match        https://kuragebunch.com/episode/*
// @match        https://comic-zenon.com/episode/*
// B类型
// @match        https://feelweb.jp/episode/*
// @match        https://tonarinoyj.jp/episode/*
// @match        https://comic-action.com/episode/*
// @match        https://comicbushi-web.com/episode/*
// @match        https://comicborder.com/episode/*
// @match        https://comic-trail.com/episode/*
// @match        https://www.sunday-webry.com/episode/*
// @match        https://comic-ogyaaa.com/episode/*
// @match        https://www.corocoro.jp/episode/*
// @match        https://ourfeel.jp/episode/*
// @match        https://comic-growl.com/episode/*

// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.34/dist/zip.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547684/%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%20%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/547684/%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%20%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==
"use strict";

const hostname = window.location.hostname;
const typeA = /shonenjumpplus|-days|-gardo|magcomi|heros-web|kuragebunch|comic-zenon/i;
const typeB = /feelweb|tonarinoyj|comic(-action|bushi-web|border|-trail|-ogyaaa|-growl)|sunday-webry|corocoro|ourfeel/i;
let siteType = "typeA";
if (typeB.test(hostname)) {
    siteType = "typeB";
}
console.log(siteType);

let observer = new MutationObserver(addButton);
observer.observe(document.querySelector("div#series-contents"), { childList: true, subtree: true });
window.navigation.addEventListener("navigate", async (event) => {
    observer = new MutationObserver(addButton);
    await waitForElm("div#series-contents .series-episode-list");
    observer.observe(document.querySelector("div#series-contents"), { childList: true, subtree: true });
})


const xmlHttpRequest = (typeof(GM_xmlhttpRequest) === 'undefined') ? GM.xmlHttpRequest : GM_xmlhttpRequest;
const xhr = option => new Promise((resolve, reject) => {
    xmlHttpRequest({
        ...option,
        onerror: reject,
        onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(response);
            }
        },
    });
});
const buttonCSS = `display: inline-block;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    padding: 3px 3px;
    margin: 4px 0px;
    text-align: center;
    border-radius: 3px;
    border-width: 0px;`;

function addButton() {
    let targets = [];
    if (siteType == "typeA") {
        let freeEp = document.querySelectorAll("[class*=series-episode-list-is-free]");
        let purchasedEp = document.querySelectorAll("[class*=series-episode-list-purchased]");
        let rentalEp = document.querySelectorAll('[class*=series-episode-list-rental]')
        let subscribedEp = document.querySelectorAll('[class*=series-episode-list-subscribed]')
        targets = [...freeEp, ...purchasedEp, ...rentalEp, ...subscribedEp];
    } else if (siteType == "typeB") {
        targets = document.querySelectorAll(":not(.private).episode .series-episode-list-title");
    }
    for (let elem of targets) {
        if (elem.parentNode.querySelector(".download-button")) continue;
        //付费章节的标识调整样式，以避免button位于它下方
        if (Array.prototype.some.call(elem.classList,(i) => i.includes("series-episode-list-purchased"))) {
            elem.style.display = "inline-block";
            elem.style.paddingRight = "6px";
        }
        let button = document.createElement("button");
        button.classList.add("download-button");
        button.textContent = "Download";
        button.style.cssText = buttonCSS;
        let aElement = elem.closest("a");
        //当前页面的章节找不到a跳转标签，使用窗口url
        button.dataset.href = aElement ? aElement.href : window.location.href;
        let name = elem.parentNode.querySelector("[class*=series-episode-list-title]").textContent;
        //过滤windows文件名中不允许的字符
        button.dataset.name = name.replaceAll(/[\\\/:*?"<>|]/g, " ").trim();
        button.onclick = clickButton;
        elem.parentNode.append(button);
    }
}

async function clickButton(event) {
    event.stopPropagation();
    event.preventDefault();
    let elem = event.target;
    let href = elem.dataset.href;
    let name = elem.dataset.name;
    console.log(`Click!href:${href} name:${name}`);
    let imagesData = await fetchImagesData(href);
    //console.log(imagesData);
    let imagesBlob = await downloadImages({ imagesData, name });
    if (!imagesData[0].src.includes("/original/")) {
        imagesBlob = await Promise.all(imagesBlob.map(item => decryptImage(item)));
    }
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    let targetLength = imagesBlob.length.toString().length;
    imagesBlob.forEach(async (item) => {
        await zipWriter.add(`${item.id.toString().padStart(targetLength,'0')}.jpg`, new zip.BlobReader(item.blob));
    });
    const zipFile = await zipWriter.close();
    saveBlob(zipFile , `${name}.zip`);
}

// 返回包含每张图片对象的数组
// imagesData [{id,src,height,width},...]
async function fetchImagesData(epUrl) {
    let epData = await xhr({
        method: "GET",
        url: epUrl,
    }).then(resp => resp.responseText)
    .then(html =>{
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html")
        return JSON.parse(doc.querySelector("#episode-json").dataset.value)
    });
    let imagesData = epData.readableProduct.pageStructure.pages.filter(item => item.type == "main");
    imagesData = imagesData.map((item, index) => ({ id: index + 1, ...item }));
    return imagesData;
}


async function downloadImages({ imagesData, name }) {
    async function downloadSingleImage(item) {
        return fetch(item.src).then(resp => resp.blob()).then(blob =>{
            console.log(`${name}-${item.id} have downloaded.`);
            //返回包含序号与blob的对象
            return { id: item.id, blob: blob };
        });
    }
    let imagesBlob = asyncPool(15, imagesData, downloadSingleImage);
    return imagesBlob;
}

async function decryptImage(imagesBlobItem) {
    let [images, width, height] = await blobToImageData(imagesBlobItem.blob);

    let cellWidth = Math.floor(width / 32) * 8;
    let cellHeight = Math.floor(height / 32) * 8;

    let canvas = document.createElement("canvas");
    [canvas.width, canvas.height] = [width, height];
    let ctx = canvas.getContext("2d");
    ctx.putImageData(images, 0, 0);

    let targetCanvas = document.createElement("canvas");
    [targetCanvas.width, targetCanvas.height] = [width, height];
    let targetCtx = targetCanvas.getContext("2d");

    //行 i
    for (let i = 0; i < 4; i++) {
        //列 j
        for (let j = 0; j < 4; j++) {
            let x = i * cellWidth;
            let y = j * cellHeight;
            let piece = ctx.getImageData(x, y, cellWidth, cellHeight);
            //转换后行列互换，得到真实位置
            let targetX = j * cellWidth;
            let targetY = i * cellHeight;
            targetCtx.putImageData(piece, targetX, targetY);
        }
    }
    return new Promise(resolve => {
        targetCanvas.toBlob(blob => resolve({ id: imagesBlobItem.id, blob }), 'image/jpeg', 1);
    })
}

async function blobToImageData(blob) {
    let blobUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = err => reject(err);
        img.src = blobUrl;
    }).then(img => {
        URL.revokeObjectURL(blobUrl);
        let canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [img.width, img.height];
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return [ctx.getImageData(0, 0, img.width, img.height), img.width, img.height];
    })
}


/**
 * @param poolLimit 并发控制数 (>= 1)
 * @param array 参数数组
 * @param iteratorFn 异步任务，返回 promise 或是 async 方法
 * https://www.luanzhuxian.com/post/60c2c548.html
 */
function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0
    const ret = [] // Promise.all(ret) 的数组
    const executing = []
    const enqueue = function() {
        // array 遍历完，进入 Promise.all 流程
        if (i === array.length) {
            return Promise.resolve()
        }

        // 每调用一次 enqueue，就初始化一个 promise，并放入 ret 队列
        const item = array[i++]
        const p = Promise.resolve().then(() => iteratorFn(item, array))
        ret.push(p)

        // 插入 executing 队列，即正在执行的 promise 队列，并且 promise 执行完毕后，会从 executing 队列中移除
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e)

        // 每当 executing 数组中 promise 数量达到 poolLimit 时，就利用 Promise.race 控制并发数，完成的 promise 会从 executing 队列中移除，并触发 Promise.race 也就是 r 的回调，继续递归调用 enqueue，继续 加入新的 promise 任务至 executing 队列
        let r = Promise.resolve()
        if (executing.length >= poolLimit) {
            r = Promise.race(executing)
        }

        // 递归，链式调用，直到遍历完 array
        return r.then(() => enqueue())
    }

    return enqueue().then(() => Promise.all(ret))
}

function saveBlob(content,name) {
    const fileUrl = window.URL.createObjectURL(content);
    const anchorElement = document.createElement('a');
    anchorElement.href = fileUrl;
    anchorElement.download = name;
    anchorElement.style.display = 'none';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    anchorElement.remove();
    window.URL.revokeObjectURL(fileUrl);
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}