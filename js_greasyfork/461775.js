// ==UserScript==
// @name                微博图片下载器
// @namespace           https://1mether.me/
// @version             0.1
// @description         微博内容页增加图片下载的按钮
// @author              乙醚(@locoda)
// @match               http*://*.weibo.com/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/461775/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461775/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // ==============
    // =    Main    =
    // ==============
    var observer = new MutationObserver(function (mutations, observer) {
        // console.log(mutations);
        processWeiboTimeline();
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
    });

    // ================================
    // =    Button Injection Utils    =
    // ================================
    function processWeiboTimeline() {
        var divs = Array.from(document.querySelectorAll("article"));
        divs.forEach((div) => {
            if (
                div.querySelector("div[class^=picture]") &&
                !div.querySelector(".download-button")
            ) {
                injectImageDownloadButton(div);
            }
        });
    }

    function injectImageDownloadButton(element) {
        // 图片下载按钮
        const like = Array.from(
            element.querySelectorAll(".woo-box-item-flex")
        ).pop();
        var download = like.cloneNode(true);
        download.classList.add("download-button");
        var btn = download.querySelector("button");
        btn.removeChild(btn.firstChild);
        btn.firstChild.textContent = "下载";
        btn.firstChild.classList.remove("woo-like-liked");
        btn.addEventListener("click", function () {
            getInfoAndDownloadImages(element);
        });
        like.parentElement.appendChild(download);
    }

    function getInfoAndDownloadImages(element) {
        // 获取图片链接
        const id = element
            .querySelector("a[class^=head-info_time]")
            .href.split("/")
            .pop()
            .split("?")[0];
        fetch("https://weibo.com/ajax/statuses/show?id=" + id)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                const prefix = response.user.screen_name + "_" + id + "_";
                var imgs = [];
                if (response.hasOwnProperty("retweeted_status")) {
                    response = response.retweeted_status;
                }
                for (var pic in response.pic_infos) {
                    imgs.push(response.pic_infos[pic].largest.url);
                }
                downloadImages(imgs, prefix);
            });
    }

    // ========================
    // =    Download Utils    =
    // ========================

    function downloadImages(imgs, prefix = "") {
        console.debug("正在下载图片： " + imgs);
        // Thanks to https://github.com/y252328/Instagram_Download_Button
        if (imgs.length <= 10) {
            // 同时最多下载十张图
            imgs.forEach((img, index) =>
                downloadOneImage(img, appendIndexToPrefix(prefix, index))
            );
        } else {
            // 设置延时下载更多图片 https://stackoverflow.com/questions/56244902/56245610#56245610
            imgs.forEach((img, index) => {
                setTimeout(function () {
                    downloadOneImage(img, appendIndexToPrefix(prefix, index));
                }, index * 200);
            });
        }
    }

    function appendIndexToPrefix(prefix, index) {
        return (
            prefix +
            (index + 1).toLocaleString("en-US", {
                minimumIntegerDigits: 3,
                useGrouping: false,
            }) +
            "_"
        );
    }

    function downloadOneImage(img, prefix = "") {
        fetch(img, {
            headers: new Headers({
                Origin: window.location.origin,
            }),
            mode: "cors",
            cache: "no-cache",
        })
            .then((response) => response.blob())
            .then((blob) =>
                dowloadBlob(
                    window.URL.createObjectURL(blob),
                    prefix + img.substring(img.lastIndexOf("/") + 1)
                )
            )
            .catch((e) => console.error(e));
    }

    function dowloadBlob(blob, filename) {
        var a = document.createElement("a");
        a.download = sanitizeFileName(filename);
        a.href = blob;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    // ======================
    // =    Naming Utils    =
    // ======================
    function sanitizeFileName(input, replacement = "_") {
        // Thanks to https://github.com/parshap/node-sanitize-filename/blob/master/index.js
        const illegalRe = /[\/\?<>\\:\*\|"]/g;
        const controlRe = /[\x00-\x1f\x80-\x9f]/g;
        const reservedRe = /^\.+$/;
        const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
        const windowsTrailingRe = /[\. ]+$/;
        return input
            .split(/\s/g)
            .filter((s) => s)
            .join("_")
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement)
            .replace(windowsTrailingRe, replacement);
    }
})();
