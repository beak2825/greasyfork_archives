// ==UserScript==
// @name                批量导入花瓣图片到 Eagle
// @name:zh             批量导入花瓣图片到 Eagle
// @name:zh-TW          批次導入花瓣圖片到 Eagle
// @name:ja-JP          花瓣の画像を Eagle に保存

// @description         Launch a script on Huaban that automatically scrolls the page and converts all images on the page into large images (with links, names) to be added to the Eagle App.
// @description:zh      请确保你的网路环境可以正常访问 花瓣，如果设备网路无法访问，此脚本将无法正常运作。在 花瓣 画版页面启动脚本，此脚本会自动滚动页面，将页面中所有图片转换成大图（包含链接、名称），添加至 Eagle App。
// @description:zh-TW   在 花瓣 畫版頁面啓動腳本，此腳本會自動滾動頁面，將頁面中所有圖片轉換成大圖（包含鏈接、名稱），添加至 Eagle App。
// @description:ja-JP   花瓣のボードページ上でスクリプトを起動すると、ページが自動的にスクロールし、ページ上のすべての画像を大きな画像（リンク、名前付き）に変換してEagleアプリに追加することができます。

// @author              Augus
// @namespace           https://eagle.cool/
// @homepageURL         https://eagle.cool/
// @supportURL          https://docs-cn.eagle.cool/
// @icon                https://cn.eagle.cool/favicon.png
// @license             MIT License

// @match               https://huaban.com/*
// @grant               GM_xmlhttpRequest
// @connect             localhost
// @connect             127.0.0.1
// @run-at              context-menu

// @date                01/27/2022
// @modified            05/31/2022
// @version             0.0.7

// @downloadURL https://update.greasyfork.org/scripts/439191/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E8%8A%B1%E7%93%A3%E5%9B%BE%E7%89%87%E5%88%B0%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/439191/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E8%8A%B1%E7%93%A3%E5%9B%BE%E7%89%87%E5%88%B0%20Eagle.meta.js
// ==/UserScript==

(function() {

    if (location.href.indexOf("huaban.") === -1) {
        alert("此脚本只能在花瓣网运行");
        return;
    }

    // Eagle API 服务器位置
    const EAGLE_SERVER_URL = "http://localhost:41595";
    const EAGLE_IMPORT_API_URL = `${EAGLE_SERVER_URL}/api/item/addFromURLs`;
    const EAGLE_CREATE_FOLDER_API_URL = `${EAGLE_SERVER_URL}/api/folder/create`;

    let SELECTOR_IMAGE;
    let SELECTOR_LINK;
    let SELECTOR_NODATA;
    let SELECTOR_BOX;

    // 新版
    if (document.querySelector(".infinite-scroll-component")) {
        SELECTOR_IMAGE = `.infinite-scroll-component a[href*='pins'] img`;
        SELECTOR_LINK = `.infinite-scroll-component a[href*='pins']`;
        SELECTOR_NODATA = `.infinite-scroll-component .noMore`;
        SELECTOR_BOX = `[data-pin-id]`;
    }
    // 旧版
    else {
        SELECTOR_IMAGE = `#waterfall a.img img`;
        SELECTOR_LINK = `#waterfall a.img`;
        SELECTOR_NODATA = `img[src="/img/end.png"]`;
        SELECTOR_BOX = `[data-id]`;
    }

    var startTime = Date.now();     // 开始滚动时间
    var scrollInterval;             // 无限滚动，直到底部
    var lastScrollPos;              // 上一次滚轴位置
    var retryCount = 0;             // 目前重试次数
    var scrollDelay = 100;          // 滚动页面延迟
    var retryThreshold = 20;         // 无法滚动页面重试次数，当超过次数，表示到底部了
    var pageInfo = {
        imageCount: 0,
        imageSet: {},
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
            var gridItem = img.closest(SELECTOR_BOX);
            if (img.alt) {
                return img.alt;
            }
            if (gridItem && gridItem.textContent) {
                return gridItem.textContent;
            }
            return "";
        };

        imgs = imgElements.map(function(elem, index) {
            pageInfo.imageCount++;
            let src = getHighestResImg(elem) || elem.src;
            src += `?v=${Date.now()}`; // hack 💀
            return {
                name: getTitle(elem),
                url: src, // 取得最大分辨率
                website: getLink(elem), // 取得图片链接
                modificationTime: startTime - pageInfo.imageCount // 强制设置时间，确保在 Eagle 顺序与 花瓣 相同
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
            if (document.querySelector(SELECTOR_NODATA)) {
                retryCount++;
                console.log(retryCount)
                if (retryCount >= retryThreshold) {
                    clearInterval(scrollInterval);
                    alert(`添加完成，一共添加了 ${pageInfo.imageCount} 张图像。`);
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
        if (!images || images.length === 0) return;
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
        var src = element.currentSrc || element.src;
        return src.replace(/_\/fw(.*)/, '').replace(/_sq\d+\/format(.*)/, '').split('/format/')[0].replace(/_sq235$/, '').replace(/_sq75$/, '').replace(/_fw[\d]+[w]*$/, '').split("_fw")[0].split('/fw/')[0];
    }

    // 脚本开始
    scarollToTop();

    // 创建本次保存使用文件夹
    var folderName = document.querySelector("title").text;
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