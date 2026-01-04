// ==UserScript==
// @name         网页里面将文本保存成文件并直接下载
// @namespace    https://leochan.me
// @version      1.0.3
// @description  网页下载文本
// @author       Leo
// @license      GPLv2
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @grant        unsafeWindow
// ==/UserScript==

function webPageDownloadTextFile(text, fileName) {
    var blob = new Blob([text], { type: "application/octet-stream" });
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
}