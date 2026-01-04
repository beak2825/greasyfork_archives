// ==UserScript==
// @name                Save Pinterest images to Eagle
// @name:zh             批量导入 Pinterest 图片到 Eagle
// @name:zh-TW          批次導入 Pinterest 圖片到 Eagle
// @name:ja-JP          Pinterestの画像を Eagle に保存

// @description         Launch a script on Pinterest that automatically scrolls the page and converts all images on the page into large images (with links, names) to be added to the Eagle App.
// @description:zh      请确保你的网路环境可以正常访问 Pinterest，如果设备网路无法访问，此脚本将无法正常运作。在 Pinterest 画版页面启动脚本，此脚本会自动滚动页面，将页面中所有图片转换成大图（包含链接、名称），添加至 Eagle App。
// @description:zh-TW   在 Pinterest 畫版頁面啓動腳本，此腳本會自動滾動頁面，將頁面中所有圖片轉換成大圖（包含鏈接、名稱），添加至 Eagle App。
// @description:ja-JP   Pinterestのボードページ上でスクリプトを起動すると、ページが自動的にスクロールし、ページ上のすべての画像を大きな画像（リンク、名前付き）に変換してEagleアプリに追加することができます。

// @author              Augus
// @namespace           https://eagle.cool/
// @homepageURL         https://eagle.cool/
// @supportURL          https://docs-cn.eagle.cool/
// @icon                https://cn.eagle.cool/favicon.png
// @license             MIT License

// @match               *://*/*
// @grant               GM_xmlhttpRequest
// @connect             localhost
// @connect             127.0.0.1
// @run-at              context-menu


// @date                06/16/2020
// @modified            02/24/2022
// @version             0.1.2

// @downloadURL https://update.greasyfork.org/scripts/405556/Save%20Pinterest%20images%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/405556/Save%20Pinterest%20images%20to%20Eagle.meta.js
// ==/UserScript==

(function() {

    if (location.href.indexOf("pinterest.") === -1) {
        alert("This script only works on pinterest.com.");
        return;
    }

    // Eagle API 服务器位置
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURLs`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;

    // Pinterest 当前图片、链接命名规则
    const SELECTOR_IMAGE = "[data-grid-item] a img[srcset]";
    const SELECTOR_LINK = "[data-grid-item] a";
    const SELECTOR_SPINNER = `[aria-label="Board Pins grid"]`;

    var startTime = Date.now();     // 开始滚动时间
    var scrollInterval;             // 无限滚动，直到底部
    var lastScrollPos;              // 上一次滚轴位置
    var retryCount = 0;             // 目前重试次数
    var scrollDelay = 250;          // 滚动页面延迟
    var retryThreshold = 20;         // 无法滚动页面重试次数，当超过次数，表示到底部了
    var pageInfo = {
        imageCount: 0,
        imageSet: {},
        linkSet: {},
        folderId: ""
    };

    // 创建文件夹
    var createFolder = function(folderName, callback) {
        GM_xmlhttpRequest({
            url: EAGLE_CREATE_FOLDER_API_URL,
            method: "POST",
            data: JSON.stringify({ folderName: folderName }),
            onload: function(response) {
                try {
                    var result = JSON.parse(response.response);
                    if (result.status === "success" && result.data && result.data.id) {
                        callback(undefined, result.data);
                    } else {
                        callback(true);
                    }
                } catch (err) {
                    callback(true);
                }
            }
        });
    };

    // 滚动至页面顶端
    var scarollToTop = function() {
        window.scrollTo(0, 0);
        lastScrollPos = window.scrollY;
    };

    // 滚动至页面底端
    var scarollToBottom = function() {
        window.scrollTo(0, window.scrollY + 125);
        // window.scrollTo(0, window.innerHeight);
        lastScrollPos = window.scrollY;
    };

    // 取得当前画面所有图片链接
    var getImgs = function() {
        var imgs = [];
        var imgElements = Array.from(document.querySelectorAll(SELECTOR_IMAGE));

        // 避免重复添加
        imgElements = imgElements.filter(function(elem) {
            var src = elem.src;
            var key = elem.closest("a").href;
            pageInfo.linkSet[key] = true
            if (!pageInfo.imageSet[src]) {
                pageInfo.imageSet[src] = true;
                return true;
            }
            return false;
        });

        var getLink = function(img) {
            var links = Array.from(document.querySelectorAll(SELECTOR_LINK));
            for (var i = 0; i < links.length; i++) {
                if (links[i].contains(img)) {
                    return absolutePath(links[i].href);
                }
            }
            return "";
        };

        var getTitle = function(img) {
            var gridItem = img.closest("[data-grid-item]");
            if (gridItem && gridItem.textContent) {
                return gridItem.textContent;
            }
            return img.alt || "";
        };

        imgs = imgElements.map(function(elem, index) {
            pageInfo.imageCount++;
            return {
                name: getTitle(elem),
                url: getHighestResImg(elem) || elem.src, // 取得最大分辨率
                website: getLink(elem), // 取得图片链接
                modificationTime: startTime - pageInfo.imageCount // 强制设置时间，确保在 Eagle 顺序与 Pinterest 相同
            }
        });

        return imgs;
    };

    // 滚动页面并取得图片信息，发送至 Eagle App
    var fetchImages = function() {
        var currentScrollPos = window.scrollY;
        scarollToBottom();

        addImagesToEagle(getImgs());

        // 到底了
        if (lastScrollPos === currentScrollPos || currentScrollPos === 0) {
            // 画面如果出现 Spinner 表示后面还有内容尚未载入完成
            if (!document.querySelector(SELECTOR_SPINNER)) {
                retryCount++;
                //console.log(retryCount)
                if (retryCount >= retryThreshold) {
                    clearInterval(scrollInterval);
                    let duplicateCount = Object.keys(pageInfo.linkSet).length - pageInfo.imageCount;
                    if (duplicateCount > 0) {
                        alert(`Scan completed, skip ${duplicateCount} duplicated image(s), a total of ${pageInfo.imageCount} image(s) have been added to Eagle App.`);
                    }
                    else {
                        alert(`Scan completed, a total of ${pageInfo.imageCount} image(s) have been added to Eagle App.`);
                    }
                }
            }
        }
        // 还有内容
        else {
            retryCount = 0;
            var images = getImgs();
            addImagesToEagle(images);
        }
    }

    // 将图片添加至 Eagle
    var addImagesToEagle = function(images) {
        GM_xmlhttpRequest({
            url: EAGLE_IMPORT_API_URL,
            method: "POST",
            data: JSON.stringify({ items: images, folderId: pageInfo.folderId }),
            onload: function(response) {}
        });
    }

    function absolutePath(href) {
        if (href && href.indexOf(" ") > -1) {
            href = href.trim().split(" ")[0];
        }
        var link = document.createElement("a");
        link.href = href;
        return link.href;
    }

    function getHighestResImg(element) {
        if (element.getAttribute('srcset')) {
            let highResImgUrl = '';
            let maxRes = 0;
            let imgWidth, urlWidthArr;
            element.getAttribute('srcset').split(',').forEach((item) => {
                urlWidthArr = item.trim().split(' ');
                imgWidth = parseInt(urlWidthArr[1]);
                if (imgWidth > maxRes) {
                    maxRes = imgWidth;
                    highResImgUrl = urlWidthArr[0];
                }

            });
            return highResImgUrl;
        } else {
            return element.getAttribute('src');
        }
    }

    // 脚本开始
    scarollToTop();

    // 创建本次保存使用文件夹
    var folderName = document.querySelector("h1") && document.querySelector("h1").innerText || "Pinterest";
    createFolder(folderName, function(err, folder) {
        if (folder) {
            // 持续滚动列表，直到列表没有更多内容
            pageInfo.folderId = folder.id;
            scrollInterval = setInterval(fetchImages, scrollDelay);
        } else {
            alert("软件尚未打开，或当前软件版本不支持，需至 Eagle 官网下载，手动重新安装最新版本");
        }
    });

})();