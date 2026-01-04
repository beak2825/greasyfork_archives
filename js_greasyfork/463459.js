// ==UserScript==
// @name         Better Figma Layer Exporter
// @name:zh-CN   Better Figma Layer Exporter
// @namespace    https://github.com/XuQK/Better-Figma-Layer-Exporter
// @version      1.1.3
// @license      MIT
// @description A more convenient Figma layer export solution, featuring the following main functions: 1. Direct export of selected layers as PNGs and automatically assigning them to their corresponding DPI drawable folders; 2. Support for converting PNGs to WebP format before exporting; 3. Support for exporting SVGs optimized through SVGO.
// @description:zh-CN  更方便的 Figma 图层导出，主要功能：1. 选定图层直接导出为 png 并按 dpi 分配到对应 dpi 的 drawable 文件夹; 2. 支持将 PNG 转换成 WebP 再导出; 3. 支持导出经 SVGO 优化的 svg 图片。
// @author       XuQK
// @match        https://www.figma.com/*
// @icon         https://github.com/XuQK/Better-Figma-Layer-Exporter/blob/master/assets/icon.jpeg?raw=true
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463459/Better%20Figma%20Layer%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/463459/Better%20Figma%20Layer%20Exporter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const coloredToastStyle = document.createElement("style");
    coloredToastStyle.innerHTML = `
    .colored-toast.swal2-icon-success {
  background-color: #a5dc86 !important;
}

.colored-toast.swal2-icon-error {
  background-color: #f27474 !important;
}

.colored-toast.swal2-icon-warning {
  background-color: #f8bb86 !important;
}

.colored-toast.swal2-icon-info {
  background-color: #3fc3ee !important;
}

.colored-toast.swal2-icon-question {
  background-color: #87adbd !important;
}

.colored-toast .swal2-title {
  color: white;
}

.colored-toast .swal2-close {
  color: white;
}

.colored-toast .swal2-html-container {
  color: white;
}
    `;
    document.head.appendChild(coloredToastStyle);

    GM_registerMenuCommand("Settings/设置", showSettingsDialog, "S");

    function showSettingsDialog() {
        Toast.fire({
            title: "Settings / 设置",
            html: `
          <div style="display: flex; align-items: center">
        <label for="kd-figma-token" style="font-size: 18px; width: 10em">Figma token</label>
        <input id="kd-figma-token" class="swal2-input" style="margin: 8px" value="${figmaToken}">
    </div>
    <div style="display: flex; align-items: center">
        <label for="kd-server-svg-optimizer" style="font-size: 18px; width: 10em">Svg Optimizer Url</label>
        <input id="kd-server-svg-optimizer" class="swal2-input" style="margin: 8px" value="${svgOptimizerRequestUrl}">
    </div>
    <div style="display: flex; align-items: center">
        <label for="kd-server-png-convert-to-webp" style="font-size: 18px; width: 10em">Webp Converter url</label>
        <input id="kd-server-png-convert-to-webp" class="swal2-input" style="margin: 8px" value="${pngConvertToWebpRequestUrl}">
    </div>
    <div style="display: flex; align-items: center">
        <label for="kd-svg-precision" style="font-size: 18px; width: 10em">Svg precision</label>
        <input id="kd-svg-precision" class="swal2-input" style="margin: 8px" value="${svgPrecision}">
    </div>
    <div style="display: flex; align-items: center">
        <label for="kd-webp-quality" style="font-size: 18px; width: 10em">WebP quality</label>
        <input id="kd-webp-quality" class="swal2-input" style="margin: 8px" value="${webpQuality}">
    </div>
    <div style="display: flex; align-items: center; height: 4em">
        <label for="kd-mode" style="font-size: 18px; width: 10em">Day/Night Mode</label>
        <input id="kd-mode-day" name="kd-mode" value="day" type="radio" style="margin: 8px">Day</input>
        <input id="kd-mode-night" name="kd-mode" value="night" type="radio" style="margin: 8px">Night</input>
    </div>
    <p></p>
    <p style="text-align: start; color: #FF5252">PS:</p>
    <p style="text-align: start; font-size: 14px; color: #FF5252">1. SVG 优化和 PNG 转 WebP 的需要后台能力，目前是白嫖的 node 服务器，资源有限，请温柔使用~</p>
    <p style="text-align: start; font-size: 14px; color: #FF5252">2. 如果想将此 node 服务器运行在自己本地，参见 <a href="https://github.com/XuQK/Better-Figma-Layer-Exporter#扩展功能" target="_blank">https://github.com/XuQK/Better-Figma-Layer-Exporter#扩展功能</a></p>
    
    </div>
          `,
            width: 600,
            focusConfirm: false,
            showCancelButton: true,
            didOpen() {
                document.getElementById(`kd-mode-${mode}`).checked = true;
            },
            preConfirm: () => {
                return [
                    document.getElementById("kd-figma-token").value,
                    document.getElementById("kd-server-svg-optimizer").value,
                    document.getElementById("kd-server-png-convert-to-webp").value,
                    document.getElementById("kd-svg-precision").value,
                    document.getElementById("kd-webp-quality").value,
                    document.querySelector("input[name='kd-mode']:checked").value
                ];
            }
        }).then(value => {
            const params = value.value;
            figmaToken = params[0];
            svgOptimizerRequestUrl = params[1];
            pngConvertToWebpRequestUrl = params[2];
            svgPrecision = params[3];
            webpQuality = params[4];
            mode = params[5];

            GM_setValue("figmaToken", figmaToken);
            GM_setValue("svgOptimizerRequestUrl", svgOptimizerRequestUrl);
            GM_setValue("pngConvertToWebpRequestUrl", pngConvertToWebpRequestUrl);
            GM_setValue("svgPrecision", svgPrecision);
            GM_setValue("webpQuality", webpQuality);
            GM_setValue("mode", mode);
        });
    }

    // 默认配置
    let figmaToken = GM_getValue("figmaToken", "");
    let svgOptimizerRequestUrl = GM_getValue("svgOptimizerRequestUrl", "");
    let pngConvertToWebpRequestUrl = GM_getValue("pngConvertToWebpRequestUrl", "");
    // svg 专用
    let svgPrecision = GM_getValue("svgPrecision", 1);
    // png 专用
    // webp 转换质量，0-100，默认 75
    let webpQuality = GM_getValue("webpQuality", 75);
    // 是否暗色模式
    let mode = GM_getValue("mode", "day");

    class Image {
        /**
         * @type {string}
         */
        url;

        /**
         * @type {Blob} 从 figma 下载的原始图层内容，可能是 svg，也有可能是 png
         */
        originalContent;

        /**
         * @type {number}
         */
        scale;

        /**
         * @type {Blob} 经处理后的数据，可能是优化后的 svg，也有可能是经 png 转换过后的 webp
         */
        processedContent;

        /**
         * @type {string} 最终创建文件的格式/后缀名
         */
        format;

        /**
         * @type {Blob} 最终存储到文件的数据
         */
        finalContent;

        /**
         * @param id {string}
         * @param name {string}
         */
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }
    }

    function dirNameToScaleMap() {
        if (mode === "day") {
            return _dirNameToScaleMapDay;
        } else {
            return _dirNameToScaleMapNight;
        }
    }

    function scaleToDirNameMap() {
        if (mode === "day") {
            return _scaleToDirNameMapDay;
        } else {
            return _scaleToDirNameMapNight;
        }
    }

    const _dirNameToScaleMapDay = new Map();
    _dirNameToScaleMapDay.set("drawable-ldpi", 0.75);
    _dirNameToScaleMapDay.set("drawable-mdpi", 1);
    _dirNameToScaleMapDay.set("drawable-hdpi", 1.5);
    _dirNameToScaleMapDay.set("drawable-xhdpi", 2);
    _dirNameToScaleMapDay.set("drawable-xxhdpi", 3);
    _dirNameToScaleMapDay.set("drawable-xxxhdpi", 4);

    const _scaleToDirNameMapDay = new Map();
    _scaleToDirNameMapDay.set(0.75, "drawable-ldpi");
    _scaleToDirNameMapDay.set(1, "drawable-mdpi");
    _scaleToDirNameMapDay.set(1.5, "drawable-hdpi");
    _scaleToDirNameMapDay.set(2, "drawable-xhdpi");
    _scaleToDirNameMapDay.set(3, "drawable-xxhdpi");
    _scaleToDirNameMapDay.set(4, "drawable-xxxhdpi");

    const _dirNameToScaleMapNight = new Map();
    _dirNameToScaleMapNight.set("drawable-night-ldpi", 0.75);
    _dirNameToScaleMapNight.set("drawable-night-mdpi", 1);
    _dirNameToScaleMapNight.set("drawable-night-hdpi", 1.5);
    _dirNameToScaleMapNight.set("drawable-night-xhdpi", 2);
    _dirNameToScaleMapNight.set("drawable-night-xxhdpi", 3);
    _dirNameToScaleMapNight.set("drawable-night-xxxhdpi", 4);

    const _scaleToDirNameMapNight = new Map();
    _scaleToDirNameMapNight.set(0.75, "drawable-night-ldpi");
    _scaleToDirNameMapNight.set(1, "drawable-night-mdpi");
    _scaleToDirNameMapNight.set(1.5, "drawable-night-hdpi");
    _scaleToDirNameMapNight.set(2, "drawable-night-xhdpi");
    _scaleToDirNameMapNight.set(3, "drawable-night-xxhdpi");
    _scaleToDirNameMapNight.set(4, "drawable-night-xxxhdpi");

    const svgButtonId = "svgo-button";
    const svgoButton = document.createElement("button");
    svgoButton.id = svgButtonId;
    svgoButton.className = "basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk button_row--btnNarrow--bKZDj button_row--btn--0W3Mm basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk";
    svgoButton.style.marginTop = "16px";
    svgoButton.style.width = "90%";
    svgoButton.style.marginLeft = "auto";
    svgoButton.style.marginRight = "auto";
    svgoButton.innerText = "经 SVGO 优化并导出";
    svgoButton.addEventListener("click", function () {
        onClickDownloadSvg().then();
    });

    const pngButtonId = "png-button";
    const pngButton = document.createElement("button");
    pngButton.id = pngButtonId;
    pngButton.className = "basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk button_row--btnNarrow--bKZDj button_row--btn--0W3Mm basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk";
    pngButton.style.marginTop = "16px";
    pngButton.style.width = "90%";
    pngButton.style.marginLeft = "auto";
    pngButton.style.marginRight = "auto";
    pngButton.innerText = "导出 PNG 到指定 res 目录";
    pngButton.addEventListener("click", function () {
        onClickDownloadPng(false).then();
    });

    const webpButtonId = "webp-button";
    const webpButton = document.createElement("button");
    webpButton.id = webpButtonId;
    webpButton.className = "basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk button_row--btnNarrow--bKZDj button_row--btn--0W3Mm basic_form--btn--t7Y67 ellipsis--ellipsis--70pHK text--fontPos11--rO47d text--_fontBase--VaHfk";
    webpButton.style.width = "90%";
    webpButton.style.marginTop = "16px";
    webpButton.style.marginLeft = "auto";
    webpButton.style.marginRight = "auto";
    webpButton.innerText = "导出 WebP 到指定 res 目录";
    webpButton.addEventListener("click", function () {
        onClickDownloadPng(true).then();
    });

    // 监听 body 元素变动，根据情况插入导出按钮（对于无编辑器权限的使用者）
    new MutationObserver(() => {
        try {
            let c = null;
            const anchorElemForGuest = document.querySelector("div.raw_components--panel--YDedw.export_panel--standalonePanel--yXYPM");
            if (anchorElemForGuest !== null) {
                c = anchorElemForGuest.parentElement;
            } else {
                const nodeList = document.querySelectorAll("div.draggable_list--panelTitleText--Bj2Hu")
                const anchorElemForOwner = Array.from(nodeList).find(node => node.innerText === "Export")
                if (anchorElemForOwner !== null) {
                    c = anchorElemForOwner.parentElement.parentElement.parentElement.parentElement.parentElement
                }
            }
            if (c !== null) {
                if (document.getElementById(svgButtonId) === null) {
                    c.appendChild(svgoButton);
                }
                if (document.getElementById(pngButtonId) === null) {
                    c.appendChild(pngButton);
                }
                if (document.getElementById(webpButtonId) === null) {
                    c.appendChild(webpButton);
                }
            }
        } catch (e) {
        }
    }).observe(document.body, {childList: true, subtree: true});
    // （对于有编辑权限的使用者）

    const Toast = Swal.mixin({
        position: "center",
        allowOutsideClick: false
    });

    // SVGO 优化下载功能 START
    async function onClickDownloadSvg() {
        const layerList = getSelectedLayerList();
        if (layerList.length === 0) {
            showError("未选择图层");
            return;
        }
        const fileKey = figma.fileKey;
        const dirHandle = await unsafeWindow.showDirectoryPicker({id: `${fileKey}-svg`, mode: "readwrite"});
        showExporting();
        try {
            const finalImageList = await downloadSelectedLayerAsSvg(dirHandle, fileKey, layerList);
            const successText = getSuccessText(finalImageList);
            showSuccess(successText);
        } catch (e) {
            console.error(e);
            showError(e.toString());
        }
    }

    /**
     * 将选中的图层下载为经 svgo 优化过后的 svg 图像，保存到指定地址
     * @async
     * @param dirHandle {FileSystemDirectoryHandle} 文件操作 Handle
     * @param fileKey {string} figma 文件 key
     * @param layerList {Image[]} 图层信息，格式为 [{"id": "svg id", "name": "svg name"}]
     * @return {Promise<Image[]>}
     */
    async function downloadSelectedLayerAsSvg(dirHandle, fileKey, layerList) {
        let optimizedImageList;
        // 1. 下载源 svg
        const imageList = await downloadImageFromFigma(fileKey, layerList, "svg", 1);
        if (imageList === undefined || imageList.length === 0) {
            throw new Error("从 figma 获取图片失败，请检查网络连接");
        }
        // 任何一张图层未下载成功，都判定整体失败
        if (!imageList.every(image => image.originalContent !== undefined)) {
            throw new Error("从 figma 下载图片内容失败，请检查网络连接");
        }
        // 2. 经 svgo 优化
        optimizedImageList = await optimizeSvg(imageList, svgPrecision);
        // 3. 保存到指定文件
        optimizedImageList.forEach(image => image.finalContent = image.processedContent);
        await saveImageWithDifferentDpiToDir(dirHandle, optimizedImageList);
        return optimizedImageList;
    }

    /**
     *
     * @param imageList {Image[]}
     * @param precision {number}
     * @returns
     */
    async function optimizeSvg(imageList, precision) {
        try {
            const svgContentList = await Promise.all(imageList.map(image => image.originalContent.text()));
            const requestBody = {
                precision: precision,
                svgContentList: svgContentList
            };
            const response = await fetch(getSvgOptimizerRequestUrl(), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestBody)
            });
            const responseJson = await response.json();
            imageList.forEach((image, index) => {
                image.processedContent = new Blob([responseJson[index]], {
                    type: image.originalContent.type
                });
            });

            return imageList;
        } catch (e) {
            console.error(e);
            throw new e;
        }
    }

    // SVGO 优化下载功能 END

    // PNG 下载及转换功能 START
    async function onClickDownloadPng(convertToWebp) {
        const layerList = getSelectedLayerList();
        if (layerList.length === 0) {
            showError("未选择图层");
            return;
        }
        const fileKey = figma.fileKey;
        let dirHandleId;
        if (convertToWebp) {
            dirHandleId = `${fileKey}-webp`;
        } else {
            dirHandleId = `${fileKey}-png`;
        }
        const dirHandle = await unsafeWindow.showDirectoryPicker({id: dirHandleId, mode: "readwrite"});
        showExporting();
        const scaleList = await getScaleList(dirHandle);
        if (scaleList.length === 0) {
            showError("所选目录下需要有指定 dpi 的\"drawable-*dpi\"的文件夹");
            return;
        }
        try {
            const finalImageList = await exportPng(convertToWebp, dirHandle, fileKey, layerList, scaleList);
            let successText;
            if (!finalImageList.every(image => image.format === "png")) {
                // 表示有导出为 webp 的文件
                successText = getSuccessText(finalImageList);
            }
            showSuccess(successText);
        } catch (e) {
            console.error(e);
            showError(e.toString());
        }
    }

    /**
     *
     * @param {boolean} convertToWebp 是否需要转换成 webp
     * @param {FileSystemDirectoryHandle} dirHandle
     * @param {string} fileKey figma 对应的文件 key
     * @param {Image[]} layerList 需要导出的图层信息，包括 id 和 name
     * @param {number[]} scaleList dpi 对应的缩放倍率
     * @returns {Promise<Image[]>}
     */
    async function exportPng(convertToWebp, dirHandle, fileKey, layerList, scaleList) {
        let imageList = await downloadSelectedLayerAsPng(dirHandle, fileKey, layerList, scaleList);
        if (convertToWebp) {
            imageList = await transferPngListToWebp(imageList, webpQuality);
            imageList.forEach((image) => {
                // 只有在 webp 小于 png 时，才存储为 webp
                if (image.processedContent.size > image.originalContent.size) {
                    image.format = "png";
                    image.finalContent = image.originalContent;
                } else {
                    image.format = "webp";
                    image.finalContent = image.processedContent;
                }
            });
        } else {
            imageList.forEach((image) => {
                image.format = "png";
                image.finalContent = image.originalContent;
            });
        }
        await saveImageWithDifferentDpiToDir(dirHandle, imageList);
        return imageList;
    }

    /**
     * 通过分析选中目录下的文件夹情况，得出需要下载的 dpi 对应的缩放倍率列表
     * @param {FileSystemDirectoryHandle} dirHandle
     * @return {Promise<number[]>}
     */
    async function getScaleList(dirHandle) {
        const scaleList = [];
        for await (const file of dirHandle.values()) {
            if (file.kind === "directory") {
                const scale = dirNameToScaleMap().get(file.name);
                if (scale !== undefined) {
                    scaleList.push(scale);
                }
            }
        }
        return scaleList;
    }

    /**
     * 将选中的图层根据给出的 scaleList 下载为 png
     * @param {FileSystemDirectoryHandle} dirHandle 文件操作 Handle
     * @param {string} fileKey figma 文件 key
     * @param {Image[]} layerList 图层信息，格式为 [{"id": "svg id", "name": "svg name"}]
     * @param {number[]} scaleList dpi 对应的缩放倍率
     * @return {Promise<Image[]>} 从 figma 下载下来的图片内容
     */
    async function downloadSelectedLayerAsPng(dirHandle, fileKey, layerList, scaleList) {
        const imageGroupByScale = await Promise.all(scaleList.map(scale => downloadImageFromFigma(fileKey, layerList, "png", scale)));
        /** @type {Image[]} */
        const imageList = imageGroupByScale.flat().filter(image => image !== undefined);
        if (imageList === undefined || imageList.length === 0) {
            throw new Error("从 figma 获取图片失败，请检查网络连接");
        }
        // 任何一张图层未下载成功，都判定整体失败
        if (!imageList.every(image => image.originalContent !== undefined)) {
            throw new Error("从 figma 下载图片内容失败，请检查网络连接");
        }
        return imageList;
    }

    /**
     * 批量转换 png 为 webp
     * @param {Image[]} imageList
     * @param {number} quality 质量
     * @return {Promise<Image[]>} 输出的值比参数 imageList 添加了 processedContent 属性
     *
     * @throws {Error} 操作失败会抛出异常
     */
    async function transferPngListToWebp(imageList, quality) {
        try {
            const responseList = await Promise.all(
                imageList.map(image => {
                    return fetch(getPngConvertToWebpRequestUrl(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                            "quality": quality
                        },
                        body: image.originalContent
                    });
                })
            );

            for (const image of imageList) {
                const index = imageList.indexOf(image);
                image.processedContent = await responseList[index].blob();
            }
            return imageList;
        } catch (e) {
            console.error(e);
            throw new Error("png 转 webp 操作失败，请检查是否开启优化服务器");
        }
    }

    // PNG 下载及转换功能 END

    // 公共能力 START
    /**
     * 获取当前选中的图层，包括 id 和 name
     * @return {[Image]}
     */
    function getSelectedLayerList() {
        return figma.currentPage.selection.map(node => new Image(node.id, node.name.toLowerCase().replace(/[^a-z0-9_]/g, "_")));
    }

    /**
     * 生成的一个随机四位数，并以下划线开头，作为文件的前缀，以防重名时覆盖已有文件
     * @return {string}
     */
    function getRandomPrefix() {
        return "figma" + Math.floor(Math.random() * 9000 + 1000);
    }

    /**
     * 下载选中图层的内容，包括内容指向 url 和具体的文件内容
     * @async
     * @param  {string} figmaFileKey
     * @param {string} format 格式 svg, png
     * @param {number} scale 缩放大小
     * @param {Image[]} layerList 包含有 id 和 name 的图层信息列表
     * @returns {Promise<Image[]>} 从 figma 下载下来的图片内容
     */
    async function downloadImageFromFigma(figmaFileKey, layerList, format, scale) {
        try {
            // 此处必须深拷贝
            const imageList = layerList.map(layer => new Image(layer.id, layer.name));
            const ids = imageList.map(image => image.id);
            let url = `https://api.figma.com/v1/images/${figmaFileKey}?ids=${ids.join(",")}&format=${format}&scale=${scale}`;
            const res = await fetch(url,
                {
                    headers: {
                        "X-FIGMA-TOKEN": figmaToken
                    }
                }
            );
            if (res.status !== 200) return undefined;
            const originalImageListJson = await res.json();
            imageList.forEach(layer => {
                layer.url = originalImageListJson.images[layer.id];
                layer.scale = scale;
                layer.format = format;
            });
            // 下载 image 内容
            const originalContentList = await Promise.all(imageList.map(image => downloadOriginalImageContent(image.url)));
            originalContentList.forEach((originalContent, index) => {
                imageList[index].originalContent = originalContent;
            });
            return imageList;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 下载给定的 url 的内容
     * @async
     * @param url 资源目标 url
     * @returns {Promise<Blob>} 下载下来的二进制内容
     */
    async function downloadOriginalImageContent(url) {
        try {
            let res = await fetch(url);
            if (res.status === 200) {
                // 需要用二进制数据
                return await res.blob();
            } else {
                console.log("错误？" + res.status);
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 保存内容到文件
     * @param {FileSystemDirectoryHandle} dirHandle
     * @param {Image[]} imageList
     */
    async function saveImageWithDifferentDpiToDir(dirHandle, imageList) {
        const prefix = getRandomPrefix();
        for (const image of imageList) {
            /** @type {FileSystemDirectoryHandle} */
            let drawableDirHandle;
            if (image.format === "svg") {
                // svg 图片直接保存到目录下
                drawableDirHandle = dirHandle;
            } else {
                // 其它图片需要保存到对应 dpi 的目录下
                const drawableDirName = scaleToDirNameMap().get(image.scale);
                drawableDirHandle = await dirHandle.getDirectoryHandle(drawableDirName);
            }
            const fileHandle = await drawableDirHandle.getFileHandle(`${prefix}_${image.name}.${image.format}`, {create: true});
            const writable = await fileHandle.createWritable();
            await writable.write(image.finalContent);
            await writable.close();
        }
    }

    /**
     * 格式化 bytes 数量为可读字符串
     * @param {number} bytesSize
     * @return {string}
     */
    function formatBytes(bytesSize) {
        if (bytesSize < 1024) {
            return bytesSize + " Bytes";
        } else if (bytesSize < 1024 * 1024) {
            return (bytesSize / 1024).toFixed(2) + " KB";
        } else {
            return (bytesSize / (1024 * 1024)).toFixed(2) + " MB";
        }
    }

    /**
     * 获取成功提示文字，主要是关于体积缩减大小
     * @param {Image[]} finalImageList
     * @return {string}
     */
    function getSuccessText(finalImageList) {
        const originalSize = finalImageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.originalContent.size;
        }, 0);
        const finalSize = finalImageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.finalContent.size;
        }, 0);
        return `成功缩减体积 ${formatBytes(originalSize - finalSize)}（${((originalSize - finalSize) * 100 / originalSize).toFixed(0)}%）`;
    }

    function showExporting() {
        Toast.fire({
            title: "图层导出中...",
            didOpen() {
                Swal.showLoading();
            }
        });
    }

    /**
     * @param {string} successText
     */
    function showSuccess(successText) {
        Toast.fire({
            icon: "success",
            title: "导出成功",
            text: successText
        });
    }

    /**
     * @param {string} errorText
     */
    function showError(errorText) {
        Toast.fire({
            icon: "error",
            text: errorText,
            title: "导出失败，请重试",
        });
    }

    function getSvgOptimizerRequestUrl() {
        if (svgOptimizerRequestUrl === "") {
            return "https://nifh3bnmc3.hk.aircode.run/svgOptimizer";
        } else {
            return svgOptimizerRequestUrl;
        }
    }

    function getPngConvertToWebpRequestUrl() {
        if (pngConvertToWebpRequestUrl === "") {
            return "https://nifh3bnmc3.hk.aircode.run/webpConvetor";
        } else {
            return pngConvertToWebpRequestUrl;
        }
    }

    // 公共能力 END

})();
