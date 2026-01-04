// ==UserScript==
// @name         东立漫画下载
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动下载电子书城的漫画
// @author       shadows
// @license      MIT License
// @match        https://ebook.tongli.com.tw/reader/FireBase3.html?bookID=*
// @icon         https://ebook.tongli.com.tw/images/logo_small.jpg
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.6.61/dist/zip.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456900/%E4%B8%9C%E7%AB%8B%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456900/%E4%B8%9C%E7%AB%8B%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
"use strict";
const buttonCSS = `display: inline-block;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    padding: 3px 3px;
    margin: 4px 0px;
    text-align: center;
    border-radius: 3px;
    border-width: 0px;
    position: fixed;
    right: 0px;
    bottom: 0px;
    z-index: 99`;

addButton()

function addButton() {
    let button = document.createElement("button");
    button.classList.add("download-button");
    button.textContent = "Download";
    button.style.cssText = buttonCSS;
    button.onclick = clickButton;
    document.body.prepend(button);
}

async function clickButton(event) {
    event.stopPropagation();
    event.preventDefault();
    const params = (new URL(document.location)).searchParams
    const bookID = params.get("bookID");
    const token = getCookie("token");
    let rawData = await fetch(`https://api.tongli.tw/Comic/sas/${bookID}`,{
        headers:{ 'Authorization': "Bearer " + token},
    }).then(res => res.json());
    const pages = rawData["Pages"];
    const name = rawData["Title"];
    const targetLength = pages.length.toString().length;
    let imagesData = [];
    //let zip = new JSZip();
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    for (let i of pages) {
        imagesData.push({
            filename: `${i.PageNumber.toString().padStart(targetLength,'0')}.jpg`,
            url: i.ImageURL,
            //zip: zip,
            zipWriter: zipWriter,
        })
    }
    await asyncPool(10, imagesData, imageWorker);
    //zip.generateAsync({ type: "blob", base64: true }).then(content => saveAs(content, `${name}.zip`));
    const zipFile = await zipWriter.close();
    saveBlob(zipFile , `${name}.zip`);
}

async function imageWorker(item) {
    let image = await fetch(item.url).then(res => res.blob());
    console.log(`${item.filename} have downloaded.`);
    //item.zip.file(item.filename, image);
    await item.zipWriter.add(item.filename, new zip.BlobReader(image));
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

function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie[name];
}