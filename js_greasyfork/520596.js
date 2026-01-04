// ==UserScript==
// @name         Booth商品信息获取
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  获取Booth页面中的商品标题、所有变体名称以及商品ID，并复制到剪贴板以及下载最大9张图片
// @author       YourName
// @match        https://booth.pm/*/items/*
// @match        *.booth.pm/items/*
// @grant        GM_setClipboard
// @grant        GM_download
// @run-at       document-end
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/520596/Booth%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520596/Booth%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮容器
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.zIndex = "1000";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);

    // 创建按钮函数
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.padding = "10px";
        button.style.backgroundColor = "#FF4500";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.addEventListener("click", onClick);
        container.appendChild(button);
    }

    // 获取商品标题
    function getTitle() {
        const titleElement = document.querySelector("h2.font-bold.leading-\\[32px\\].m-0.text-\\[24px\\]");
        if (!titleElement) {
            throw new Error("未找到商品标题元素");
        }
        return titleElement.innerText.trim();
    }

    // 获取所有角色适配名称
    function getVariations() {
        const elements = document.getElementsByClassName("variation-name");
        if (elements.length === 0) {
            throw new Error("未找到变体名称元素");
        }
        console.log(elements);
        return Array.from(elements)
            .map(el => el.innerText.replace(/^For\s+/i, '').trim())
            .filter(name => !/fullset|Fullset/.test(name))
            .filter(name => !/full/i.test(name))
            .map(name => `#${name}`)
            .join(" ");
    }

    // 获取商品 ID
    function getItemId() {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            throw new Error("未找到 rel='canonical' 的链接");
        }
        const href = canonicalLink.getAttribute("href");
        const match = href.match(/\/items\/(\d+)/);
        if (!match) {
            throw new Error("未找到商品ID");
        }
        return match[1];
    }

    // 获取所有图片链接
    async function getImages() {
        const imageWrappers = document.getElementsByClassName("market-item-detail-item-image-wrapper");
        if (!imageWrappers.length) {
            throw new Error("未找到图片容器");
        }
        // market-item-detail-item-image slick-loading
        const imageUrls = [];
        for (let wrapper of imageWrappers) {
            if (!wrapper.closest('.slick-slide').classList.contains("slick-cloned")) { // 检查父级 slick-slide 是否包含 slick-cloned
                const imageElement = wrapper.querySelector("img.market-item-detail-item-image");
                if (!imageElement) {
                    //跳过了找不到图片元素的错误
                    continue;
                    throw new Error("未找到图片元素");
                }
                if(!imageElement.getAttribute("data-lazy")){
                    imageUrls.push(imageElement.getAttribute("src"));
                }
                else
                    imageUrls.push(imageElement.getAttribute("data-lazy"));
            }
        }

        return imageUrls.slice(0, 9);  // 获取最大9张图片链接
    }

    // 创建下载按钮
    createButton("下载商品图片", async () => {
        try {
            // 首先获取所有图片链接
            const imageUrls = await getImages();
            if (imageUrls.length === 0) {
                throw new Error("未找到图片");
            }
            console.log(imageUrls);
            // 下载每张图片
            for (let index = 0; index < imageUrls.length; index++) {
                const url = imageUrls[index];
                // 提取文件名和格式
                const filenameMatch = url.match(/([^/]+)\.(jpg|jpeg|png|gif)$/);
                if (filenameMatch) {
                    const fileName = filenameMatch[1];
                    const fileExtension = filenameMatch[2];
                    GM_download(url, `${fileName}.${fileExtension}`);
                } else {
                    throw new Error("无法解析文件名和格式");
                }
            }
            //alert("所有图片已开始下载");
        } catch (error) {
            console.error("下载图片失败", error);
            alert("下载图片失败，请检查脚本或页面内容结构");
        }
    });




    // 合并功能按钮
    createButton("获取多适配所有信息", () => {
        try {
            const title = getTitle();
            const variations = getVariations();
            const itemId = getItemId();

            const combinedContent = `适配\n${itemId}\n
【内容】
✧${title}

【适配角色】
${variations}

默认会自己配置、上传模型，本店不负责教学
tag :// vrchat 模型 纹理 衣服 头饰 面饰 makeup 贴图 face texture 动作 服装 animation 3d模型 unity blender eyes heart 渲染 服饰 指甲 爱心 星星 眼饰 泳装 clothing
（24小时自动发货，虚拟货品发货不退款）`;
            GM_setClipboard(combinedContent);
            //alert("所有信息已复制到剪贴板:\n\n" + combinedContent);
        } catch (error) {
            console.error("获取信息失败", error);
            alert("获取信息失败，请检查脚本或页面内容结构");
        }
    });
    createButton("获取所有信息（单适配）", () => {
        try {
            const title = getTitle();
            const itemId = getItemId();

            const combinedContent = `适配\n${itemId}\n
【内容】
✧${title}

【适配角色】


默认会自己配置、上传模型，本店不负责教学
tag :// vrchat 模型 纹理 衣服 头饰 面饰 makeup 贴图 face texture 动作 服装 animation 3d模型 unity blender eyes heart 渲染 服饰 指甲 爱心 星星 眼饰 泳装 clothing
（24小时自动发货，虚拟货品发货不退款）`;
            GM_setClipboard(combinedContent);
            //alert("所有信息已复制到剪贴板:\n\n" + combinedContent);
        } catch (error) {
            console.error("获取信息失败", error);
            alert("获取信息失败，请检查脚本或页面内容结构");
        }
    });

    // 单独功能按钮
    createButton("获取商品标题", () => {
        try {
            const title = getTitle();
            GM_setClipboard(title);
            //alert("商品标题已复制到剪贴板:\n" + title);
        } catch (error) {
            console.error("获取商品标题失败", error);
            alert("获取商品标题失败，请检查脚本或页面内容结构");
        }
    });
    //获取适配角色
    createButton("获取适配角色名称", () => {
        try {
            const variations = getVariations();
            GM_setClipboard(variations);
            alert("角色名称已复制到剪贴板:\n" + variations);
        } catch (error) {
            console.error("获取角色名称失败", error);
            alert("获取角色名称失败，请检查脚本或页面内容结构");
        }
    });

    createButton("获取商品ID", () => {
        try {
            const itemId = getItemId();
            GM_setClipboard(itemId);
            //alert("商品ID已复制到剪贴板:\n" + itemId);
        } catch (error) {
            console.error("获取商品ID失败", error);
            alert("获取商品ID失败，请检查脚本或页面内容结构");
        }
    });
})();
