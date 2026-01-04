// ==UserScript==
// @name         ComiciViewer Download
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Download images from Comici.jp viewer based websites
// @author       shadows
// @license      MIT License
// @copyright    Copyright (c) 2025 shadows
// @match        https://bigcomics.jp/episodes/*
// @match        https://youngchampion.jp/episodes/*
// @match        https://younganimal.com/episodes/*
// @match        https://comic-medu.com/episodes/*
// @match        https://comicride.jp/episodes/*
// @match        https://rimacomiplus.jp/*/episodes/*
// @match        https://kansai.mag-garden.co.jp/episodes/*
// @match        https://comicpash.jp/episodes/*
// @match        https://comic-growl.com/episodes/*
// @match        https://championcross.jp/episodes/*
// @icon         https://dimg04.c-ctrip.com/images/0391j120008r0n8a84D94.png
// @icon64       https://static.yximgs.com/bs2/adInnovationResource/367c797d005b4b1ab180f0a361a7ef43.png
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.62/dist/zip.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540999/ComiciViewer%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/540999/ComiciViewer%20Download.meta.js
// ==/UserScript==

const scrambleMatrix = new Array(16).fill(null).map((_, index) => [index / 4 >> 0, index % 4 >> 0]);

const buttonCSS = `display: inline-block;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    padding: 3px 3px;
    margin: 4px 0px;
    text-align: center;
    border-radius: 3px;
    border-width: 0px;`;

let button = document.createElement("button");
button.classList.add("download-button");
button.textContent = "Download";
button.style.cssText = buttonCSS
button.onclick = clickButton;
document.querySelector("div.article-section").after(button);

async function clickButton(event) {
    event.stopPropagation();
    event.preventDefault();
    let elem = event.target;

    const name = document.querySelector("div.article-title").textContent;
    const viewer = document.getElementById("comici-viewer");
    const viewerId = viewer.getAttribute("comici-viewer-id");
    const userId = viewer.dataset.memberJwt;
    const domain = viewer.dataset.apiDomain;

    console.log(`Click!name:${name}`);
    const imagesData = await fetchImagesData(domain,viewerId,userId);
    //console.log(imagesData);
    let imagesBlob = await downloadImages({ imagesData, name });
    imagesBlob = await Promise.all(imagesBlob.map(item => decryptImage(item)));
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    let targetLength = imagesBlob.length.toString().length;
    imagesBlob.forEach(async (item) => {
        await zipWriter.add(`${item.id.toString().padStart(targetLength,'0')}.jpg`, new zip.BlobReader(item.blob));
    });
    const zipFile = await zipWriter.close();
    saveBlob(zipFile , `${name}.zip`);
}

async function downloadImages({ imagesData, name }) {
    async function downloadSingleImage(item) {
        return fetch(item.url).then(resp => resp.blob()).then(blob =>{
            console.log(`${name}-${item.id} have downloaded.`);
            //返回包含序号与blob的对象
            return { id: item.id, blob: blob, scramble: item.scramble };
        });
    }
    let imagesBlob = asyncPool(15, imagesData, downloadSingleImage);
    return imagesBlob;
}

async function fetchImagesData(domain,viewerId,userId) {
    const totalPages= (await createContentsInfo(domain,viewerId,userId,"1")).totalPages;
    const imagesData = (await createContentsInfo(domain,viewerId,userId,totalPages)).result;
    return imagesData.map((item, index) => ({ id: index + 1, url: item.imageUrl, scramble: item.scramble}))
}

async function createContentsInfo(domain,viewerId,userId, pageTo){
    const data = await fetch(`https://${domain}/book/contentsInfo?comici-viewer-id=${viewerId}&user-id=${userId}&page-from=0&page-to=${pageTo}`)
        .then(r=>r.json());
    return data
}

async function decryptImage(imagesBlobItem) {
    const { scramble, blob, id } = imagesBlobItem;
    const decodedArray = decodeScrambleArray(scramble);

    const img = await blobToImage(blob);
    const { width, height } = img;
    const cellWidth = Math.floor(width / 4);
    const cellHeight = Math.floor(height / 4);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0)

    decodedArray.forEach(([srcCol, srcRow], index) => {
        const targetCol = Math. floor(index / 4);
        const targetRow = index % 4;

        ctx.drawImage(
            img,
            srcCol * cellWidth, srcRow * cellHeight, cellWidth, cellHeight,
            targetCol * cellWidth, targetRow * cellHeight, cellWidth, cellHeight
        );
    });

    return new Promise(resolve => {
        canvas.toBlob(blob => resolve({ id, blob }), 'image/jpeg', 1);
    });
}

function decodeScrambleArray(scramble) {
    const decoded = [];
    const encoded = scramble.replace(/\s+/g, '').slice(1).slice(0, -1).split(',');
    for (let i = 0; i < scrambleMatrix.length; i++) {
        decoded.push(scrambleMatrix[encoded[i]]);
    }
    return decoded;
}

async function blobToImage(blob) {
    // 如果 blob 是 Promise，先等待它完成
    const resolvedBlob = await Promise.resolve(blob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve(img);
        };
        img. onerror = reject;
        img.src = URL.createObjectURL(resolvedBlob);
    });

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