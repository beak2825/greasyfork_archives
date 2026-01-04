// ==UserScript==
// @name         comic-walker 漫画下载
// @namespace    shadows
// @version      0.3.3
// @description  下载comic-walker(KadoComi)网站的免费漫画
// @author       shadows
// @license      MIT License
// @copyright    Copyright (c) 2024 shadows
// @icon         https://comic-walker.com/favicons/favicon.ico
// @icon64       https://comic-walker.com/favicons/icon.svg
// @match        http*://comic-walker.com/detail/*
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.34/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/428483/comic-walker%20%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428483/comic-walker%20%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
"use strict";
//等页面自己的脚本加载时再添加
waitForElm('[data-nscript=afterInteractive]').then(async (elm) => {
    if(document.querySelector('[class*= EpisodesTabContents_episodeList]')==null){
        await waitForElm('[class*= EpisodesTabContents_episodeList]')
    }
    addButton();
    const observer = new MutationObserver(addButton);
    observer.observe(document.querySelector("[class*=ContentsDetailPage_episodeList]").parentNode, {
        childList: true,
        subtree: true
    });
});

function addButton() {
    let targets = document.querySelectorAll("[class^=EpisodeThumbnail_episodeThumbnail]");
    console.log(targets);
    for (let elem of targets) {
        if (elem.parentNode.querySelector(".download-button") || elem.href === undefined) continue;
        const titleElem = elem.querySelector("[class^=EpisodeThumbnail_title_]");
        let name = titleElem.textContent.trim();
        const href = new URL(elem.href);
        const episodeCode = href.pathname.split("/").at(-1);
        titleElem.append(creatButton(name, episodeCode));
    }
}

function creatButton(name, episodeCode) {
    let button = document.createElement('button');
    button.classList.add("download-button");
    button.textContent = "Download";
    button.style.cssText = `z-index: 2;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    padding: 3px 3px;
    margin: 4px 0px;
    text-align: center;
    border-radius: 3px;
    border-width: 0px;`;
    button.dataset.episodeCode = episodeCode;
    button.dataset.name = name;
    button.onclick = download;
    return button;
}

async function download(event) {
    event.stopPropagation();
    event.preventDefault();
    let elem = event.target;
    let name = elem.dataset.name;
    let episodeCode = elem.dataset.episodeCode;
    let imagesData = await getImageSData(episodeCode);
    let images = await downloadImages(imagesData, name);
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    let targetLength = images.length.toString().length;
    for (let image of images) {
        await zipWriter.add(`${image.id.toString().padStart(targetLength,'0')}.webp`, new zip.BlobReader(image.content));
    }
    const zipFile = await zipWriter.close();
    saveBlob(zipFile , `${name}.zip`);
}

async function getImageSData(episodeCode) {
    const id = await fetch(`https://comic-walker.com/api/contents/details/episode?episodeCode=${episodeCode}&workCode=0&episodeType=first`)
    .then(resp => resp.json())
    .then(json => json.episode.id);
    //图片大小目前已知最大的是width:1284
    return fetch(`https://comic-walker.com/api/contents/viewer?episodeId=${id}&imageSizeType=width%3A1284`)
        .then(resp => resp.json())
        .then(json => {
        let dataArray = json.manuscripts;
        return dataArray.map((item, index) => ({ drmMode: item.drmMode,drm_hash: item.drmHash, source_url: item.drmImageUrl, id: index + 1 }))
    });
}


function downloadImages(imagesData, name) {
    async function downloadSingleImage(item) {
        const res = await fetch(item.source_url);
        let data;
        switch (item.drmMode) {
            case 'raw':
                data = await res.blob();
                break;
            case 'xor': {
                const encrypted = new Uint8Array(await res.arrayBuffer())
                data = decryptXor(encrypted , item.drm_hash);
                break;
            }
            default:
                throw Error('Encryption not supported');
        }
        return { id: item.id, content: data }
    }

    let images = asyncPool(10, imagesData, downloadSingleImage);
    return images;
}

/**
 * 解密图片
 * @param {Uint8Array} encrypted 图片数据
 * @param {String} drm_hash 解密密钥
 * @returns {Blob} 已解密的图片Blob对象
 */
function decryptXor(encrypted, drm_hash) {
    const key = generateKey(drm_hash);
    return new Blob([xor(encrypted, key)]);
}

function generateKey(drm_hash) {
    const e = drm_hash.slice(0, 16).match(/[\da-f]{2}/gi);
    if (null != e) {
        return new Uint8Array(e.map(drm_hash => parseInt(drm_hash, 16)));
    }
    throw new Error("failed generate key.");
}

/**
 * xor解密
 * @param {Uint8Array} encrypted 待解密的内容
 * @param {Uint8Array} key 密钥
 * @returns Uint8Array 结果
 */
function xor(encrypted, key) {
    let length = encrypted.length;
    let keyLength = key.length;
    let result = new Uint8Array(length);
    for (let i = 0; i < length; i+=1) {
        result[i] = encrypted[i] ^ key[i % keyLength];
    }
    return result;
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

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
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
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}