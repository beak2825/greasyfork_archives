// ==UserScript==
// @name         微博相册存档
// @namespace    http://tampermonkey.net/
// @description 微博相册存档 批量下载
// @version      0.2
// @author       邪不压正
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @match        *photo.weibo.com/*/talbum/index*
// @match        *photo.weibo.com/*/albums/detail*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523105/%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%AD%98%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/523105/%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%AD%98%E6%A1%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const requestConfig = {
        "api_url": "https://photo.weibo.com/photos/get_all",
        "max_count": 100, // 尝试一次性获取尽可能多的图片
        "page": 1, // 尝试一次性获取尽可能多的图片
        "download_delay": 500 // 设置下载之间的延迟，避免过快请求
    };

    var total = null
    var totalPage = null
    var downloadPage = null

    // 存储原始的 XMLHttpRequest 构造函数
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    let originalRequestParams = null;
    // 拦截并修改 XMLHttpRequest
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.startsWith(requestConfig.api_url)) {
            // 修改 count 参数为较大的值
            //let params = new URLSearchParams(new URL(url).search);
            //params.set('count', requestConfig.max_count.toString());
            //params.set('page', requestConfig.page.toString());
            //this._modifiedUrl = `${new URL(url).origin}${new URL(url).pathname}?${params.toString()}`;

            this._modifiedUrl = url
            originalRequestParams = new URL(url).searchParams;
            console.log('Intercepted and modified request:', this._modifiedUrl);
        } else {
            this._modifiedUrl = url;
        }

        return originalXhrOpen.apply(this, [method, this._modifiedUrl, async, user, password]);
    };

    // 存储原始的 send 方法
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (body) {
        if (this._modifiedUrl && this._modifiedUrl.startsWith(requestConfig.api_url)) {
            logme("into send and match url")
            this.addEventListener('load', function () {
                try {
                    logme("response match")
                    let response = JSON.parse(this.responseText);
                    if (response.result && response.data && response.data.total !== undefined) {
                        total = response.data.total;
                        console.log('Total images:', total);
                        // 更新显示
                        const totalSpan = document.getElementById('total-count-display');
                        if (totalSpan) {
                            totalSpan.textContent = `共 ${total} 张图片`;
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse response:', e);
                }
            });
        }
        return originalXhrSend.apply(this, arguments);
    };

    function sanitizeFileName(name) {
        return name
            // 移除或替换文件名中的非法字符
            .replace(/[<>:"/\\|?*]/g, '_')
            // 替换多个连续的下划线为单个下划线
            .replace(/_+/g, '_')
            // 移除首尾的空格和点
            .trim()
            .replace(/^\.+|\.+$/g, '')
            // 处理空白符
            .replace(/\s+/g, '_')
            // 如果处理后为空，返回默认名称
            || 'untitled';
    }

    let allPhotoList = [];

    const batch_download = async function () {
        if (!originalRequestParams) {
            console.error('未获取到原始请求参数');
            return;
        }

        const pageSize = requestConfig.max_count;
        const totalPages = Math.ceil(total / pageSize);
        this.textContent = "加载中...0/" + totalPages + "页";

        // 复制原始参数用于构建新请求
        let allPhotoList = [];

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            try {
                // 复制原始参数
                const params = new URLSearchParams(originalRequestParams);
                // 更新分页参数
                params.set('count', pageSize.toString());
                params.set('page', currentPage.toString());

                // 发起请求
                const response = await fetch(`${requestConfig.api_url}?${params.toString()}`);
                const data = await response.json();

                if (data.result && data.data && data.data.photo_list) {
                    const processedPhotoList = data.data.photo_list.map(item => ({
                        ...item,
                        downloadName: sanitizeFileName(`${item.caption_render}-${item.created_at}-${item.photo_id}-${item.pic_name}`),
                        downloadUrl: `${item.pic_host}/large/${item.pic_name}`
                    }));


                    allPhotoList = allPhotoList.concat(processedPhotoList);
                    this.textContent = `加载中...${currentPage}/${totalPages}页`;
                }

                await new Promise(resolve => setTimeout(resolve, requestConfig.download_delay));

            } catch (error) {
                console.error('获取第' + currentPage + '页数据失败:', error);
            }
        }

        // 数据全部获取完成后
        this.textContent = `获取完成，共${allPhotoList.length}张图片`;
        console.log('所有图片数据:', allPhotoList);

        // 这里可以调用你原来的下载逻辑
        // 使用 allPhotoList 中的数据进行下载
        processDownload(allPhotoList);
    };

    let errorList = [];
    async function processDownload(photoList) {
        const zip = new JSZip();
        for (const $photo of photoList) {
            try {
                const response = await fetch($photo.downloadUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                zip.file($photo.downloadName, blob);
            } catch (error) {
                console.error(`Error downloading ${$photo.downloadName}:`, error);
                errorList.push({
                    photo: $photo.downloadUrl,
                    error: error.message
                }); // 将错误信息添加到错误列表中
            }
        }
        try {
            const content = await zip.generateAsync({ type: "blob" });
            const download_$a = document.createElement("a");
            download_$a.href = URL.createObjectURL(content);
            download_$a.download = `photos-${photoList[0].album_id}.zip`;
            download_$a.click();
            URL.revokeObjectURL(download_$a.href);
        } catch (error) {
            console.error("Error generating ZIP:", error);
        }
        if (errorList.length > 0) {
            let errorMessage = "下载过程中出现以下错误：\n";
            errorList.forEach((error, index) => {
                if (error.photo) {
                    errorMessage += `${error.photo}\n`;
                } else {
                    errorMessage += `其他错误：${error.error}\n`;
                }
            });
            errorList.forEach((error, index) => {
                errorMessage += `${index} ${error.error}\n`;
            });
            alert(errorMessage); // 使用 alert 弹窗提示
        }
        console.error("下载出错errorList", errorList);
    }

    // // 处理下载的函数
    // const processDownload = function (photoList) {
    //     photoList.forEach(($photo) => {
    //         // 构造下载链接
    //         let download_$a = document.createElement("a");
    //         // 根据你的配置构造实际的下载地址
    //         const picUrl = $photo.downloadUrl;
    //         download_$a.href = picUrl;
    //         download_$a.download = $photo.photo_id;

    //         // 使用 fetch 下载图片
    //         fetch(picUrl)
    //             .then(res => res.blob())
    //             .then(blob => {
    //                 let blob_url = window.URL.createObjectURL(blob);
    //                 download_$a.href = blob_url;
    //                 download_$a.download = $photo.downloadName;
    //                 download_$a.click();
    //                 window.URL.revokeObjectURL(blob_url);
    //             });

    //         // 添加下载间隔
    //         setTimeout(() => { }, requestConfig.download_delay);
    //     });
    // };

    window.addEventListener('load', function () {
        logme("into page")

        async function downloader() {
            try {
                init()
            } catch (e) {
            }
        }

        downloader().then(r => {
        });
    });


    var config_;

    const init = function () {
        const domain_regex = /:\/\/(?<domain>[\w\.]+)/;
        const config_map = {
            "photo.weibo.com": {
                "batch_download_$button_container_selector": ".m_share_like",
                "batch_download_$button_class": undefined,
                "$img_list_selector": "ul.photoList li img",
                "photo_id_regex": /.+photo_id\/(?<id>\d+).*/,
                "photo_id_replacement": "$<id>",
                "photo_src_regex": /(?<prefix>.+\/)\w+(?<suffix>\/.*)/,
                "photo_src_replacement": "$<prefix>large$<suffix>",
            }
        };

        let domain = domain_regex.exec(document.location.origin).groups.domain;
        config_ = config_map[domain];


        // 创建一个容器 div
        let containerDiv = document.createElement("div");
        containerDiv.style.display = "flex";
        containerDiv.style.alignItems = "center";
        containerDiv.style.gap = "10px"; // 设置按钮和文本之间的间距


        let batch_download_$button = document.createElement("button");
        batch_download_$button.textContent = "批量下载原图";
        batch_download_$button.style.fontWeight = "bolder";
        batch_download_$button.classList.add(config_.batch_download_$button_class);
        batch_download_$button.onclick = batch_download;

        // 创建显示 total 的 span 元素
        let totalSpan = document.createElement("span");
        totalSpan.id = "total-count-display";
        totalSpan.textContent = total ? `共 ${total} 张图片` : "加载中...";
        totalSpan.style.marginLeft = "10px";

        // 将按钮和 total 文本添加到容器中
        containerDiv.appendChild(batch_download_$button);
        containerDiv.appendChild(totalSpan);

        document.querySelector(config_.batch_download_$button_container_selector).appendChild(containerDiv);


    }

    function logme(string) {
        console.log("|||" + string)
    }

})();