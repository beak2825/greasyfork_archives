// ==UserScript==
// @name         哔哩哔哩 PC 工坊订单详情 跳转 订单下载页面
// @namespace    http://tampermonkey.net/
// @version      2025-09-24
// @description  哔哩哔哩 PC 工房订单详情 跳转订单下载页面 修复工房定制订单不能下载的问题
// @author       YuanZhouLv
// @match        https://gf.bilibili.com/order/detail/*
// @match        https://gf.bilibili.com/order/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501536/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20PC%20%E5%B7%A5%E5%9D%8A%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%20%E8%B7%B3%E8%BD%AC%20%E8%AE%A2%E5%8D%95%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/501536/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20PC%20%E5%B7%A5%E5%9D%8A%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%20%E8%B7%B3%E8%BD%AC%20%E8%AE%A2%E5%8D%95%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
function downloadByBlob(url, fileName) {
    fetch(url).then(response => {
        return response.blob();
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}
function downloadByLink(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}
function downloadByFetch(url, fileName) {
    fetch(url).then(response => {
        return response.blob();
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    });
}
function getOrderDetail(orderId) {
    return new Promise((resolve, reject) => {
        fetch("https://mall.bilibili.com/mall-up-c/order/detail", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://gf.bilibili.com/",
            "body": JSON.stringify({
                orderId: orderId
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                reject("HTTP error: " + response.status);
            } else{
                return response.json()
            }
        }).then((data) => {
            resolve(data["data"]);
        });
    });
}

function getDownloadUrl(orderId, fileInfo) {
    return new Promise((resolve, reject) => {
        fetch("https://mall.bilibili.com/mall-up-c/order/process/delivery/file/url", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://gf.bilibili.com/",
            "body": JSON.stringify({
                fileUrl: fileInfo.fileUrl,
                fileName: fileInfo.fileName,
                orderId: orderId,
                bucketType: fileInfo.bucketType
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            if (!response.ok) {
                reject("HTTP error: " + response.status);
            } else {
                return response.json();
            }
        }).then((data) => {
            resolve(data["data"]["url"]);
        });
    });
}

function getBaseEleTextHeader() {
    let listHeaderEle = document.createElement("div")
    listHeaderEle.dataset["v-1f49e52a"] = ""
    listHeaderEle.className = "list__header";

    let listHeaderFileEle = document.createElement("div");
    listHeaderFileEle.dataset["v-1f49e52a"] = ""
    listHeaderFileEle.className = "list__header__file";
    listHeaderFileEle.innerText = "交付文件";
    listHeaderEle.appendChild(listHeaderFileEle);

    let listHeaderSizeEle = document.createElement("div");
    listHeaderSizeEle.dataset["v-1f49e52a"] = ""
    listHeaderSizeEle.className = "list__header__size";
    listHeaderSizeEle.innerText = "大小";
    listHeaderEle.appendChild(listHeaderSizeEle);

    let listHeaderActionsEle = document.createElement("div");
    listHeaderActionsEle.dataset["v-1f49e52a"] = ""
    listHeaderActionsEle.className = "list__header__actions";
    listHeaderActionsEle.innerText = "操作";
    listHeaderEle.appendChild(listHeaderActionsEle);

    // return `
    // <div class="list__header" data-v-1f49e52a="">
    //     <div class="list__header__file" data-v-1f49e52a="">交付文件</div>
    //     <div class="list__header__size" data-v-1f49e52a="">大小</div>
    //     <div class="list__header__actions" data-v-1f49e52a="">操作</div>
    // </div>`;
    return listHeaderEle;
}

function getStyleEleText() {
    return `
.list {
  width: 100%;
  margin-bottom: 40px;
}
.list:last-child {
  margin-bottom: 0;
}
.list__header {
  line-height: 16px;
  font-size: 16px;
  color: #2f3238;
  font-weight: 500;
  border-bottom: 1px solid #e3e5e7;
  padding-bottom: 20px;
  display: flex;
}
@media only screen and (max-width: 767px) {
.list__header {
    padding-bottom: 0px;
    border-bottom: none;
}
}
.list__header__file {
  flex: 1 1;
}
.list__header__size {
  width: 100px;
  margin: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media only screen and (max-width: 767px) {
.list__header__size {
    display: none;
}
}
.list__header__actions {
  width: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media only screen and (max-width: 767px) {
.list__header__actions {
    display: none;
}
}
.file-item {
  width: 100%;
  display: flex;
  margin-top: 20px;
  color: #000;
  line-height: 20px;
  font-size: 14px;
}
@media only screen and (max-width: 767px) {
.file-item {
    margin-top: 12px;
}
}
.file-item.disable {
  color: #aeb3b9;
}
.file-item__file {
  flex: 1 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.file-item__file__icon {
  width: 80px;
  height: 80px;
  background: #f1f2f3 url("//s1.hdslb.com/bfs/static/matrix/client/assets/folder_icon.cdcc5cfd.png") center/45px no-repeat;
  border-radius: 8px;
  margin-right: 8px;
  flex-shrink: 0;
  overflow: hidden;
}
.file-item__file__icon.file-thumbnail {
  background-position: center top;
  background-size: cover;
  background-color: transparent;
}
.file-item__file__icon.is-img {
  background-image: url("data:image/png;base64,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");
}
.file-item__file__icon.is-video {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAkFBMVEUAAACMmZ6PmaKTmaKTmaGSm6KTmaGTmaGXmp6TmKGTmaGUmaGPl6GTmaGSlp6TmaKSl5qSmZ+TmaGTmaGTmKGTmaGTmaGSmaCSmKGTmaGTmaKSmaGTmaGUmaGSmKGSmKCSmaCTmaGTmaGUmaKTmaGTmaGTmaGTmaGTmaGSmaGUmqCUmKKQmaCTmaGTmKGTmaE3iYZqAAAAL3RSTlMABxP79lSP2w9u6c8Y7xubCyTkpb61sFxPlXxB1XRjNS+roEfJxLqDiEs7HyngwJYbuScAAANmSURBVFjD7ZfXkqMwEEXJOZoBTAbbJCf9/9+tGrzL2iLIU/OwVev7hIv2Uei+LcF89NFH/4VYh+MM63Ipy3OS9PtRSVKUrmVwDvsWS0kyyfNrXd6ZAiIlaGntdaJLPTVRRzTaRVcqHmcLiFJpyFLwDq8LFDRtJz+kaU+bYEbb623HSN9u1XCfFNeLZVmGwT1kGDhPZRJmns4jULeZjxNMqrtsrsXpdQDy/dYMbczb0yUvhknKm1OU/JChlISwzszPidthYMb8oHwM3Ei0Y7llkfRimOfqoDwXxR4b7mopZHSEgcHiHrthV90X7CaYO1m/e134bI4Yvzot8Epbo/KbXTKTVLDL/PTyHaLULptqNMe/b/MlJRArlPVBYLeXl/EfosjjAZwZYDj+RfYP2HBH3PEsbDZlENjNcoskVNuDL/MDMdwCsibEVRazKTeASO13wnsBAzkyTIWoiKoJOzb6q5iPAqYbZJSMY3wYlYZYQ2bXgS6ibQggEWFdVoE9JN+lBV5uOPy4CgxxhM5Rd4QUh4erQBUM5NACHWjB6ioQHHlnqHXH4fFUNjPADkc0zLOu+Z5b6VnSX4Wt0DShvYn4VJwHBlC0q06Bg9N7zqSGQKdkDujhN4cpnTfSEBVEPE+QR4N4j2Nmxw9Wuw2swX4uXgAOEiQCaQNwtR82i0CQLDrklvvjYzbfsb8gbQRwUnUmDs+v8bGFx/eBKC0WgBEM9w0gygjglHD7O0CJAE67330DyOcLQHmwNaFmA8h7yjzwCkeHSFmHk279Uh3CEzLeBPItu1TYR5hgvWBObx5oRu6il40TjHeeAdpENSXC6Lv7cSa8eiyIg5RIS/dG//mgboCn59xqP8w03n+x5aKB3EpO4wlHVFk7PJXF6/5OFq9fXrHW0jnN1pvX1hyWp1B/t8HtP18N2UOTMmiBVjpU85oKSGhJCyzgeCjWIsbLV/TOt4RAJIMsVfNIx0tMwgakCgGIIUvz6bsDe7hbcYfBtY16dg1OYdkZkKNwlntWfR5tThDkfqGHNPnUBF7UdXGsgrI4bqXoUDUn2QQY6ERx1b02iFp3g6q6JI0Op0mUFz+2zILUXIeZadCO9qVkwr6LaiwdKt+va31QXTdBZUuxKp5diyNotGiWdRxlkOOwOO0fffTRP6tfAu/OPrBgcYoAAAAASUVORK5CYII=");
}
.file-item__file__icon.is-pdf {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAASFBMVEUAAACTmaGXl6CSl6CTmaGSmKCUmKGSmaCTmaGSmKCSmaCTmKCRl6CUlqCTmaGUlqCPoJ+UmKCNl6CRlqCVmKGTmaGSlqCTmaF5gCuBAAAAF3RSTlMAwCBA34Cg4O+QULBgcNAwEJAgcGBwUGk6ffcAAAJASURBVFjD7ZjbeqwgDIUN4ex5OrN9/zfdlHSgFe1otL3o57qaQfhNAgZCdenSpb8r0fvmTTldA8igKUkGAdTaqbcGUWxhoevktFkWnP8Wp+y0W7JZxfVyYknelnn3ZJ4xoEfVNh5RBOUu4U+P6JtWjRq61N8u+o30bPRix+yhJiqWz27RXzfsXhE62lF6HdtVxZCagqB0mHhsIi4Y2FVMQRhcz9roJSyRe3YommTFli3MaclonihgTRFXxQeWw11oabk4ctAt2MxWE4brLy11aPnHB/piCoCm6ci6gZ8FmtDS84GClvEMKGjC7DO7NznrUra/UV9vc2odXgND79ydpmuWR7spC18D35OEriGOchRda4yxebx5N5c0rro8BaVfKvaR9MHDR7iFetpsaM2V49eBafX3BMzfV3sAiOQiAZ/hhQNAly3M36dlAwdFcSZg9llEoISox0aglZIm9bECTBJbgFmqegGEbRaSQ7UaqgxMUR14MSTNgUBRPQ14oyy6CUif3jowJ+EELLPNdmAngjzQoBOAWVIwgHa2/enMA/F8hZsB+wQst4BH8PDrcQ2idIsV6S6l+N095fxt9PyN/vyjyPmHJbKZrTo6WJxB+UBZLJLBHj0STwtGAxfYUcB+tqyo4FjhU86osLH9thc3OMpDq8Wjxj3Fo3eLxeP8mGY7iLcAHrGfl7cCke4PQMrU/77yPm4Bvn5UvTOQ9vuZ9CPY7TDTjbitUMd4C1ADmKBPgCCAmu4PelFdunTpz+o/a/xf9JCl+OQAAAAASUVORK5CYII=");
}
.file-item__file__icon.is-audio {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAhFBMVEUAAACSmKCSl6CSl6CUmaGTmKGTmaKTmaGUl6GTmaGTmaGJnaSTmaGTmaGTmaGSmaGTmaGSmKCTmqGTmaGSmKCTlqCTmZ+Mmp6TmaGTmaGSmaCOl6CTmaKTmaKTmaGRmJ+TmaGTmKGSmaGPl6GTmaGSmqCTmaGTmaGSkp6TmKCUmaGTmaE/9RV5AAAAK3RSTlMAkCBA37/78C/4ywf01+aAcTWZeW0mGwvGuSkV4qtOO7FbVQ7SReufEoZlxvu81gAAAuFJREFUWMPtWNmWqjAQFJBV9kVA2QUX8v//d+lWcI5iIDhPd6gnT9Ipew0FmxUrEIfMtzjOsjP+N9gCOzJVgpDkyAu+pNtzpkR+InH33/BZKnmDau0Wu1f0JLIhisZAXhyX8QnGnSwug0c6y+JOajhL+JQaCxHnPxfzGBm3/ILqinDSrF4T1iawrjEznlKMTRnpSsxEemIkLFXw7zDa51tIRcvGd6yhHM34ZiND0Gz96EFY3qddG3ZtJgc18OH0McG4fWUgzMCFlpJh2M8YCN2JXuOhLhcGQmPK3oWeYiCEnikp+xizznArgHlOs3D0zmT+tDjQ1AF1MM3OxJl/z/Q1oVdFWAlXwpXwVwlzEDFUwgAepvl8/QZPKIWqAs6dyXwlFpKpgBrQZOFmNuByutEMbnDBbeYDFEy0o4QQdQYxA6EP2qChtAFc2D6Lqoacu/RnlMyijncXOJF/bCtw8LKbKbtQszjgovihFa8gfHQHJcZxckg0wwMXXfI56MuwZxmRMCFquvKpEGqAmo0bCWvHDcoxk0AB0QlBM9Rgk6moK69v8aYovKu+dMaErONIr0JsiQB58zIiGqzqfud6CD8la1rI9S3mISPRqnCItoxwScI0YyqLyfnDUNUW21slCLnwKkGo7FQmCNUfymYqM6ZEgjOoTxWNjKA+QCQumMlDjemDPxT4apmvdKZ1wndACYyqeWOS4snYwQ63Iv3JpkfeAV2PMXRr7nV4w3Ik/h5Hx7HTqN5uDS21nfCe5wSDYJDtnI4nxHz3+Is9zx/7JudTlck/JKiSe4hx+zqsCrfFraRk/Cwg9kVwK374H6UVHxkVmV9IQ38osFynnGd7XGGcJYI4W0ve66/WmYxCKrDUSyi95J0O+2k5hJsmS88+NGN7v/kWQeYVwBm5lC83jFDkXkqshP8VYVmIT2hSNx+a+ERcMTe0TqhQG0ZCn0zAZyR0JjxMBNaYc46GW7NZ8YfxD+mCkJnCIVDtAAAAAElFTkSuQmCC");
}
.file-item__file__icon.is-audio .cover {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: #f1f2f3;
}
.file-item__file__icon.is-audio .cover[lazy=loading],
.file-item__file__icon.is-audio .cover[lazy=error] {
  background-position: center;
  background-size: 30%;
  background-size: 30%;
}
.file-item__file__info {
  flex: 1 1;
}
@media only screen and (max-width: 767px) {
.file-item__file__info {
    padding-right: 12px;
}
}
.file-item__file__info__name {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-item__file__info__stage {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
  background-color: #f1f2f3;
  color: #9499a0;
  padding: 0 4px;
  border-radius: 2px;
}
.file-item__file__info__size,
.file-item__file__info__only {
  line-height: 16px;
  font-size: 12px;
  color: #aeb3b9;
  padding-top: 4px;
}
.file-item__file__info__size {
  display: none;
}
@media only screen and (max-width: 767px) {
.file-item__file__info__size {
    padding-right: block;
}
}
.file-item__size {
  width: 100px;
  margin: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@media only screen and (max-width: 767px) {
.file-item__size {
    display: none;
}
}
.file-item__actions {
  width: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.file-item__actions__button {
  min-width: 100%;
}
.download {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 16px 0;
}
@media only screen and (max-width: 767px) {
.download {
    padding: 20px;
}
}
.download__list {
  width: 100%;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
}
@media only screen and (max-width: 767px) {
.download__list {
    padding: 20px;
}
}
.download__list__empty {
  padding: 198px 0 30px;
  background-image: url("//s1.hdslb.com/bfs/static/matrix/client/assets/none-tip-img.f81e16f9.png");
  background-size: 280px 158px;
  background-position: center 30px;
  background-repeat: no-repeat;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  color: #9499a0;
}`;
}

function getBaseEleTextFooter() {
    return ``;
}

function getBaseEleTextBody(dataItem) {
    let fileItemEle = document.createElement("div");
    fileItemEle.dataset["v-49bca2e4"] = "";
    fileItemEle.className = "file-item";

    let fileItemFileEle = document.createElement("div");
    fileItemFileEle.dataset["v-49bca2e4"] = "";
    fileItemFileEle.className = "file-item__file";

    let fileItemFileIconEle = document.createElement("div");
    fileItemFileIconEle.dataset["v-49bca2e4"] = "";
    fileItemFileIconEle.className = "file-item__file__icon";

    let fileItemFileInfoEle = document.createElement("div");
    fileItemFileInfoEle.dataset["v-49bca2e4"] = "";
    fileItemFileInfoEle.className = "file-item__file__info";

    let fileItemFileInfoNameEle = document.createElement("div");
    fileItemFileInfoNameEle.dataset["v-49bca2e4"] = "";
    fileItemFileInfoNameEle.className = "file-item__file__info__name";
    fileItemFileInfoNameEle.style
    fileItemFileInfoNameEle.innerText = dataItem.filename;

    let fileItemFileInfoSizeEle = document.createElement("div");
    fileItemFileInfoSizeEle.dataset["v-49bca2e4"] = "";
    fileItemFileInfoSizeEle.className = "file-item__file__info__"
    fileItemFileInfoSizeEle.innerText = dataItem.filesize;

    let fileItemFileActionsEle = document.createElement("div");
    fileItemFileActionsEle.dataset["v-49bca2e4"] = "";
    fileItemFileActionsEle.className = "file-item__actions";

    let fileItemFileActionsButtonEle = document.createElement("div");
    fileItemFileActionsButtonEle.dataset.vAd11bf40 = "";
    fileItemFileActionsButtonEle.dataset["v-49bca2e4"] = "";
    fileItemFileActionsButtonEle.className = "button plain file-item__actions__button";
    fileItemFileActionsButtonEle.innerText = "下载";
    fileItemFileActionsButtonEle.addEventListener("click", function() {
        downloadByBlob(dataItem.filelink, dataItem.filename);
    });

    let fileItemFileActionsButtonLoadingEle = document.createElement("i");
    fileItemFileActionsButtonLoadingEle.dataset.vAd11bf40 = "";
    fileItemFileActionsButtonLoadingEle.className = "loading";
    fileItemFileActionsButtonLoadingEle.style["display"] = "none";

    fileItemFileActionsButtonEle.append(fileItemFileActionsButtonLoadingEle);

    fileItemFileIconEle.append(fileItemFileInfoEle);
    fileItemFileInfoEle.append(fileItemFileInfoNameEle);
    fileItemFileInfoEle.append(fileItemFileInfoSizeEle);
    fileItemFileEle.append(fileItemFileIconEle);
    fileItemFileEle.append(fileItemFileInfoEle);
    fileItemFileActionsEle.append(fileItemFileActionsButtonEle);
    fileItemEle.append(fileItemFileEle);
    fileItemEle.append(fileItemFileActionsEle);
    return fileItemEle;

    // return `
    // <div class="file-item" data-v-49bca2e4="">
    //     <div class="file-item__file" data-v-49bca2e4="">
    //         <div class="file-item__file__icon" data-v-49bca2e4="">
    //             <!---->
    //         </div>
    //         <div class="file-item__file__info" data-v-49bca2e4="">
    //             <div class="file-item__file__info__name" data-v-49bca2e4="" style="overflow: hidden;"><span style="box-shadow: transparent 0 0; word-break: break-all;">${dataItem.filename}</span></div>
    //             <!----><!---->
    //             <div class="file-item__file__info__size" data-v-49bca2e4="">${dataItem.filesize}</div>
    //         </div>
    //     </div>
    //     <div class="file-item__size" data-v-49bca2e4="">${dataItem.filesize}</div>
    //     <div class="file-item__actions" data-v-49bca2e4="">
    //         <div class="button plain file-item__actions__button" data-v-ad11bf40="" data-v-49bca2e4="">下载<i class="loading" data-v-ad11bf40="" style="display: none;"></i></div>
    //     </div>
    // </div>`;

    // return `
    // <div class="file-item" data-v-49bca2e4="">
    //     <div class="file-item__file" data-v-49bca2e4="">
    //         <div class="file-item__file__icon" data-v-49bca2e4="">
    //             <!---->
    //         </div>
    //         <div class="file-item__file__info" data-v-49bca2e4="">
    //             <div class="file-item__file__info__name" data-v-49bca2e4="" style="overflow: hidden;"><span style="box-shadow: transparent 0 0; word-break: break-all;">${dataItem.filename}</span></div>
    //             <!----><!---->
    //             <div class="file-item__file__info__size" data-v-49bca2e4="">${dataItem.filesize}</div>
    //         </div>
    //     </div>
    //     <div class="file-item__size" data-v-49bca2e4="">${dataItem.filesize}</div>
    //     <div class="file-item__actions" data-v-49bca2e4="">
    //         <a href="${dataItem.filelink}" download="${dataItem.filename}"><div class="button plain file-item__actions__button" data-v-ad11bf40="" data-v-49bca2e4="">下载<i class="loading" data-v-ad11bf40="" style="display: none;"></i></div></a>
    //     </div>
    // </div>`;
}

(function() {
    'use strict';
    if(window.location.href.indexOf("https://gf.bilibili.com/order/detail/") !== -1) {
        location.href = location.href.replaceAll("detail", "download")
        return;
    }


    if(window.location.href.indexOf("https://gf.bilibili.com/order/download/") !== -1) {
        const orderId = location.href.split("?")[0].replaceAll("https://gf.bilibili.com/order/download/","")
        //alert(orderId);
        const styleEle = document.createElement("style");
        styleEle.innerText = getStyleEleText();
        let timeout = setTimeout(async function() {
            document.head.append(styleEle);
            const orderDetail = await getOrderDetail(orderId);
            console.log(orderDetail)
            const targetEle = document.querySelectorAll(".download__list")[0]
            targetEle.childNodes.forEach(item=>item.remove())
            const baseEleTextHeader  = getBaseEleTextHeader();
            const baseEleTextFooter = getBaseEleTextFooter();
            let datas =[]
            if(orderDetail.bizOrderType === 2) {
                const orderTitle = orderDetail.skuList.map((item) => item.itemsName).join("、")
                orderDetail.itemsProductionList.forEach((item) => {
                    let processResources = item.processResourceVO
                    datas.push(...processResources.map((resources, index) => {
                        const ext = "." + resources.originalUrl.split(".")[resources.originalUrl.split(".").length - 1]
                        return {
                            filesize: resources.fileSize || resources.rawFileSize || "未知",
                            filelink: resources.originalUrl,
                            filename: "【" + orderTitle + "】" + item.title + "-" + String(index + 1) + ext
                        }
                    }))
                })
            } else
            if(orderDetail.bizOrderType === 5) {
                for (let item of orderDetail.deliveryFileVO.fileList) {
                    datas.push({
                        filesize: item.fileSize,
                        filelink: item.preSignedUrl ?? await getDownloadUrl(orderId, {
                            fileUrl: item.fileUrl,
                            fileName: item.fileName,
                            bucketType: item.bucketType
                        }),
                        filename: item.fileName
                    })
                }
            }
            const baseEleTextBody = datas.map(getBaseEleTextBody)/*.join("")*/;
            // const base = baseEleTextHeader + baseEleTextBody + baseEleTextFooter
            // const base = baseEleTextHeader + baseEleTextBody + baseEleTextFooter
            // console.log(base)
            const baseEle = document.createElement("div");
            // div class="list" data-v-1f49e52a="" data-v-9cff5946=""
            // baseEle.innerHTML = base;
            baseEle.append(
                baseEleTextHeader,
                ...baseEleTextBody,
                baseEleTextFooter
            )
            baseEle.classList.add("list")
            baseEle.dataset["v-1f49e52a"] = ""
            baseEle.dataset["v-9cff5946"] = ""
            targetEle.append(baseEle)
        }, 3000)
    }
})();