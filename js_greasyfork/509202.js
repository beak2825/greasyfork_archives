// ==UserScript==
// @name         游民星空图片助手
// @namespace    https://github.com/addpd/gamersky-image-helper
// @version      0.1
// @description  为游民星空网站提供图片下载功能的油猴插件
// @author       addpd
// @copyright    2024, addpd (https://github.com/addpd)
// @license      MIT
// @match        https://www.gamersky.com/news/*/*.shtml
// @match        https://www.gamersky.com/ent/*/*.shtml
// @match        https://www.gamersky.com/wenku/*/*.shtml
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/draggabilly/2.3.0/draggabilly.pkgd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/509202/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/509202/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class GamerskyImageHelper {
        constructor() {
            this.imageModeActive = GM_getValue('imageModeActive', true);
            this.adBlockActive = GM_getValue('adBlockActive', true);
            this.removeWatermark = true;
            this.isDragging = false;

            this.initStyles();

            // 检测body存在后再执行appendChild
            document.addEventListener('DOMContentLoaded', () => {
                this.createUI();
                this.initEventListeners();
                this.initSettings();
                this.sayHi();
            });
        }

        initStyles() {
            this.imageModeCSS = `
                /* 文章 */
                /* 隐藏文章 Mid2L_con 下的所有文本节点 */
                .Mid2L_con,
                .Mid2L_con > p,
                .Mid2L_con > p > span {
                    font-size: 0 !important;
                }

                /* 评论区 */
                /* 隐藏 cmt_msg 下的所有文本节点 */
                .cmt_msg {
                    font-size: 0 !important;
                }

                /* 隐藏特定的文本内容 */
                .cmt_msg .cmt_con,
                .cmt_msg .cmt_reply {
                    display: none !important;
                }

                /* 隐藏没有图片的评论 */
                .cmt_cont:not(:has(.qzcmt-piclist)) {
                    display: none !important;
                }
            `;

            GM_addStyle(`
                .ant-btn {
                    line-height: 1.5715;
                    position: relative;
                    display: inline-block;
                    font-weight: 400;
                    white-space: nowrap;
                    text-align: center;
                    background-image: none;
                    border: 1px solid transparent;
                    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    user-select: none;
                    touch-action: manipulation;
                    height: 32px;
                    padding: 4px 15px;
                    font-size: 14px;
                    border-radius: 2px;
                    color: rgba(0, 0, 0, 0.85);
                    background: #fff;
                    border-color: #d9d9d9;
                }
                .ant-btn-primary {
                    color: #fff;
                    background: #1890ff;
                    border-color: #1890ff;
                    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
                }
                .ant-btn-sm {
                    height: 26px;
                    padding: 0 8px;
                    font-size: 14px;
                    border-radius: 2px;
                    margin:5px 0;
                }
                .ant-btn-toggle {
                    color: rgba(0, 0, 0, 0.85);
                    background: #fff;
                    border-color: #d9d9d9;
                }
                .ant-btn-toggle.active {
                    color: #fff;
                    background: #52c41a;
                    border-color: #52c41a;
                }
                .ant-btn:active {
                    color: #096dd9;
                    background: #fff;
                    border-color: #096dd9;
                }
                .ant-btn-primary:active {
                    color: #fff;
                    background: #096dd9;
                    border-color: #096dd9;
                }
                .ant-btn-toggle:active {
                    color: #fff;
                    background: #096dd9;
                    border-color: #096dd9;
                }
                .ant-radio-group {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 14px;
                    font-variant: tabular-nums;
                    line-height: 1.5715;
                    list-style: none;
                    font-feature-settings: 'tnum';
                    display: inline-block;
                    line-height: unset;
                }
                .ant-radio-button-wrapper {
                    position: relative;
                    display: inline-block;
                    height: 26px;
                    margin: 0;
                    padding: 0 8px;
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 14px;
                    line-height: 24px;
                    background: #fff;
                    border: 1px solid #d9d9d9;
                    border-top-width: 1.02px;
                    border-left-width: 0;
                    cursor: pointer;
                    transition: color 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                .ant-radio-button-wrapper:first-of-type {
                    border-left: 1px solid #d9d9d9;
                    border-radius: 2px 0 0 2px;
                }
                .ant-radio-button-wrapper:last-of-type {
                    border-radius: 0 2px 2px 0;
                    margin-left: -4px;
                }
                .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                    z-index: 1;
                    color: #1890ff;
                    background: #fff;
                    border-color: #1890ff;
                }
                .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
                    background-color: #1890ff;
                }
                .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
                    border-color: #1890ff;
                }
                .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
                    color: #40a9ff;
                    border-color: #40a9ff;
                }
                .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active {
                    color: #096dd9;
                    border-color: #096dd9;
                }
                .ant-radio-button-input {
                    display: none;
                }
                .ant-radio-button-wrapper:has(.ant-radio-button-input:checked) {
                    background: #1890ff;
                    color: #fff;
                }

                #floatingMenu {
                    h6 { margin: 10px 0; }
                    div[class$="_edit"] {
                        display: flex;
                        gap: 5px;
                        justify-content: space-between;
                        border: 1px solid #d6d6d6;
                        padding: 10px 10px 0 10px;
                        border-radius: 5px;
                        flex-direction: column;
                    }
                    span[id$="_img_num"] { font-size: .75em; }
                    & #other_edit {
                        display: flex;
                        flex-direction: row;
                        justify-content: start;
                        gap: 10px;
                    }
                    .edit_title{
                        font-size:14px;
                    }
                }
            `);
        }

        createUI() {
            const menuHTML = `
                <span style="pointer-events: none;">+</span>
                <div id="floatingMenu" style="
                  position: absolute;
                  top: 0;
                  right: 40px;
                  background-color: white;
                  border: 1px solid rgb(222, 226, 230);
                  border-radius: 0.25rem;
                  box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 4px 0px;
                  display: none;
                  padding: 0 10px 10px 10px;
                  color: #151515;
                  text-align: left;
                  cursor: auto;
                ">
                  <div>
                    <h6>文章区操作</h6>
                    <div class="article_edit">
                      <div class="ant-radio-group">
                        <span class="edit_title">图片下载方式：</span>
                        <label class="ant-radio-button-wrapper">
                          <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" name="article_download_type" value="zip" checked=checked>
                            <span class="ant-radio-button-inner"></span>
                          </span>
                          <span>打包</span>
                        </label>
                        <label class="ant-radio-button-wrapper">
                          <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" name="article_download_type" value="single">
                            <span class="ant-radio-button-inner"></span>
                          </span>
                          <span>逐个</span>
                        </label>
                      </div>
                      <button id="downloadArticleBtn" class="ant-btn ant-btn-primary ant-btn-sm">开始下载文章图</button>
                    </div>
                  </div>
                  <div>
                    <h6>评论区操作</h6>
                    <div class="comment_edit">
                      <div class="ant-radio-group">
                        <span class="edit_title">图片下载方式：</span>
                        <label class="ant-radio-button-wrapper">
                          <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" name="comment_download_type" value="zip" checked=checked>
                            <span class="ant-radio-button-inner"></span>
                          </span>
                          <span>打包</span>
                        </label>
                        <label class="ant-radio-button-wrapper">
                          <span class="ant-radio-button">
                            <input type="radio" class="ant-radio-button-input" name="comment_download_type" value="single">
                            <span class="ant-radio-button-inner"></span>
                          </span>
                          <span>逐个</span>
                        </label>
                      </div>
                      <button id="downloadCommentsBtn" class="ant-btn ant-btn-primary ant-btn-sm">开始下载评论图</button>
                    </div>
                  </div>
                  <div>
                    <h6>其他操作</h6>
                    <div id="other_edit">
                        <div class="other_edit">
                            <span class="edit_title">页面导航：</span>
                            <div>
                                <button id="topBtn" class="ant-btn ant-btn-primary ant-btn-sm">去顶部</button>
                                <button id="commentsBtn" class="ant-btn ant-btn-primary ant-btn-sm">去评论</button>
                            </div>
                        </div>
                        <div class="other_edit">
                            <span class="edit_title">一些选项：</span>
                            <div>
                                <button id="imageModeBtn" class="ant-btn ant-btn-toggle ant-btn-sm">只看图</button>
                                <button id="adBlockBtn" class="ant-btn ant-btn-toggle ant-btn-sm">去广告</button>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
            `;

            this.floatDiv = document.createElement('div');
            this.floatDiv.style.cssText = `
                position: fixed;
                right: 30px;
                top: 25%;
                width: 40px;
                height: 40px;
                z-index: 9999;
                overflow: unset;
            `;

            document.body.appendChild(this.floatDiv);


            this.floatButton = document.createElement('button');
            this.floatButton.className = 'ant-btn ant-btn-primary ant-btn-sm';
            this.floatButton.style.cssText = `
                width: 100%;
                height: 100%;
                font-size: 20px;
                line-height: 1;
                padding: 0;
                border-radius: 50%;
            `;
            this.floatDiv.appendChild(this.floatButton);
            this.floatButton.innerHTML = menuHTML;

            this.floatingMenu = document.getElementById('floatingMenu');

        }

        initEventListeners() {
            document.getElementById('topBtn')?.addEventListener('click', this.scrollToTop.bind(this));
            document.getElementById('commentsBtn')?.addEventListener('click', this.scrollToComments.bind(this));
            document.getElementById('downloadArticleBtn')?.addEventListener('click', this.batchDownloadCurrentPagePictures.bind(this));
            document.getElementById('downloadCommentsBtn')?.addEventListener('click', this.batchDownloadCommentPicturesAsZip.bind(this));
            document.getElementById('imageModeBtn')?.addEventListener('click', this.toggleImageMode.bind(this));
            document.getElementById('adBlockBtn')?.addEventListener('click', this.toggleAdBlock.bind(this));

            this.floatButton.onclick = this.toggleMenu.bind(this);
            document.addEventListener('click', this.hideMenuOnClickOutside.bind(this));

            this.initDraggable();
        }

        initDraggable() {
            const draggie = new Draggabilly(this.floatDiv, {
                containment: 'body'
            });

            draggie.on('dragStart', () => {
                this.isDragging = true;
                this.floatDiv.style.cursor = 'grabbing';
            });

            draggie.on('dragEnd', () => {
                setTimeout(() => {
                    this.isDragging = false;
                    this.floatDiv.style.cursor = 'move';
                }, 0);
            });

            window.addEventListener('resize', () => {
                const rect = this.floatDiv.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    draggie.setPosition(window.innerWidth - rect.width, rect.top);
                }
                if (rect.bottom > window.innerHeight) {
                    draggie.setPosition(rect.left, window.innerHeight - rect.height);
                }
            });
        }

        toggleMenu(event) {
            if (event.target === this.floatButton && !this.isDragging) {
                event.stopPropagation();
                if (this.floatingMenu.style.opacity === '0' || this.floatingMenu.style.opacity === '') {
                    this.floatingMenu.style.display = 'block';
                    setTimeout(() => {
                        this.floatingMenu.style.opacity = '1';
                        this.floatingMenu.style.transition = 'opacity 0.1s ease-in-out';
                    }, 10);
                } else {
                    this.floatingMenu.style.opacity = '0';
                    this.floatingMenu.style.transition = 'opacity 0.1s ease-in-out';
                    setTimeout(() => {
                        this.floatingMenu.style.display = 'none';
                    }, 300);
                }
            }
        }

        hideMenuOnClickOutside(event) {
            if (event.target !== this.floatButton && !this.floatButton.contains(event.target)) {
                this.floatingMenu.style.opacity = '0';
                this.floatingMenu.style.transition = 'opacity 0.1s ease-in-out';
                setTimeout(() => {
                    this.floatingMenu.style.display = 'none';
                }, 300);
            }
        }

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        scrollToComments() {
            document.querySelector('.Comment')?.scrollIntoView({ behavior: 'smooth' });
        }

        async downloadImages(urls) {
            for (let i = 0; i < urls.length; i++) {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: urls[i],
                        responseType: "blob",
                        onload: function (response) {
                            const blob = response.response;
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            const fileName = urls[i].split('/').pop();
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                            resolve();
                        },
                        onerror: function (error) {
                            console.error('下载失败:', error);
                            reject(error);
                        }
                    });
                });
            }
        }

        async batchDownloadCurrentPagePictures() {
            const images = document.querySelectorAll(".picact");
            const imageCount = images.length;

            const downloadType = this.getDownloadType('article');

            if (!this.downlaodConfirm({
                from: '文章区',
                imgLen: imageCount,
                downloadType
            })) {

                return;
            }

            const urls = Array.from(images).map(img =>
                this.removeWatermark ? img.src.replace("_S.", ".") : img.src
            );
            try {
                if (downloadType === 'zip') {
                    await this.downloadImagesAsZip(urls, '文章区');
                } else if (downloadType === 'single') {
                    await this.downloadImages(urls);
                }
            } catch (error) {
                console.error('批量下载图片失败:', error);
            }
        }

        async downloadImagesAsZip(urls, from) {
            const zip = new JSZip();
            let successCount = 0;
            const maxImagesToDownload = 5;
            const isTestEnvironment = false;

            for (let i = 0; i < (isTestEnvironment ? Math.min(urls.length, maxImagesToDownload) : urls.length); i++) {
                try {
                    console.log(`尝试下载图片 ${i + 1}: ${urls[i]}`);
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: urls[i],
                            headers: { "Referer": "https://www.gamersky.com/" },
                            responseType: "blob",
                            timeout: 30000,
                            onload: resolve,
                            onerror: reject,
                            ontimeout: reject
                        });
                    });
                    if (response.status !== 200) throw new Error(`HTTP错误! 状态: ${response.status}`);
                    const blob = response.response;

                    const fileName = urls[i].split('/').pop();
                    zip.file(fileName, blob);
                    console.log(`成功下载图片 ${i + 1}`);
                    successCount++;
                } catch (error) {
                    console.error(`下载图片 ${urls[i]} 失败:`, error);
                    if (error.name === 'TimeoutError') {
                        console.log('下载超时，跳过此图片');
                    }
                }
                await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 500));
            }
            if (successCount === 0) {
                console.error("没有成功下载任何图片");
                return;
            }
            console.log(`总共成功下载 ${successCount} 张图片`);
            console.log("开始创建ZIP文件...");
            try {
                const zipContent = await zip.generateAsync({ type: "blob" });
                console.log("ZIP文件创建完成，准备下载...");
                const blobUrl = URL.createObjectURL(zipContent);
                const link = document.createElement('a');
                link.href = blobUrl;
                const now = new Date();
                const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

                const pageTitle = document.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
                let currentPage;

                if (from === '文章区') {
                    currentPage = document.querySelector('.page_css b')?.textContent || '1';
                } else if (from === '评论区') {
                    currentPage = document.querySelector('.pagelist .curr')?.textContent || '1';
                }

                const zipFileName = `gamersky_【${pageTitle}】_${from}_第${currentPage}页_${timestamp}.zip`;
                link.download = zipFileName;

                link.click();
                URL.revokeObjectURL(blobUrl);
                console.log(`ZIP文件下载成功，文件名：${zipFileName}`);
            } catch (error) {
                console.error("创建或下载ZIP文件时出错:", error);
                alert("下载过程中出错，请查看控制台以获取更多信息。");
            }
        }

        isValidImageUrl(url) {
            return url.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|ico|tiff)$/i) != null;
        }

        getOriginalImageUrl(url) {
            const isGif = url.includes('imggif.gamersky.com');
            const isImg1 = url.includes('img1.gamersky.com');

            if (isGif || isImg1) {
                let newUrl = url.replace('tinysquare_', 'origin_');
                return isGif ? newUrl.replace(/\.jpg$/i, '.gif') : newUrl;
            }

            return url;
        }

        getDownloadType(area = 'article') {
            return document.querySelector(`input[name="${area}_download_type"]:checked`)?.value;
        }

        async batchDownloadCommentPicturesAsZip() {
            let piclistUrls = [];
            document.querySelectorAll(".qzcmt-piclist img").forEach((i) => {
                // 如果是符合的图片则push进去
                if (this.isValidImageUrl(i.src)) {
                    // 直接push评论原图
                    let url = this.getOriginalImageUrl(i.src);
                    piclistUrls.push(url);
                }
            });

            if (piclistUrls.length === 0) {
                alert("没有找到可下载的图片");
                return;
            }

            console.log("找到的图片URL:", piclistUrls);

            const downloadType = this.getDownloadType('comment');
            // 确认
            if (!this.downlaodConfirm({
                from: '评论区',
                imgLen: piclistUrls.length,
                downloadType
            })) {

                return;
            }

            try {
                if (downloadType === 'zip') { // 打包下载
                    await this.downloadImagesAsZip(piclistUrls, '评论区');
                } else if (downloadType === 'single') { // 逐个下载
                    await this.downloadImages(piclistUrls);
                }
            } catch (error) {
                console.error("下载过程中出错:", error);
                alert("下载过程中出错，请查看控制台以获取更多信息。");
            }
        }

        downlaodConfirm(data) {
            let confirmMessage = `当前 ${data.from} 找到 ${data.imgLen} 张图片，\n是否${data.downloadType === 'zip' ? '打包' : '逐个'}下载？`;

            return confirm(confirmMessage);
        }

        toggleImageMode() {
            this.imageModeActive = !this.imageModeActive;
            GM_setValue('imageModeActive', this.imageModeActive);
            document.getElementById('imageModeBtn')?.classList.toggle('active', this.imageModeActive);
            this.applyImageMode();
        }

        toggleAdBlock() {
            this.adBlockActive = !this.adBlockActive;
            GM_setValue('adBlockActive', this.adBlockActive);
            document.getElementById('adBlockBtn')?.classList.toggle('active', this.adBlockActive);
            this.applyAdBlock();
        }

        applyImageMode() {
            const styleId = 'gm-image-mode-style';
            let styleElement = document.getElementById(styleId);

            if (this.imageModeActive) {
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = styleId;
                    styleElement.textContent = this.imageModeCSS;
                    document.head.appendChild(styleElement);
                }
            } else {
                if (styleElement) {
                    styleElement.remove();
                }
            }
        }

        applyAdBlock() {
            const styleId = 'gm-ad-block-style';
            let styleElement = document.getElementById(styleId);

            if (this.adBlockActive) {
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = styleId;
                    styleElement.textContent = '.MidRPicTxt, .yyimg ,.Mid2L_con>p[align=center]:not(.GsImageLabel){ display: none !important; }';
                    document.head.appendChild(styleElement);
                }
            } else {
                if (styleElement) {
                    styleElement.remove();
                }
            }
        }

        initSettings() {
            document.getElementById('imageModeBtn')?.classList.toggle('active', this.imageModeActive);
            document.getElementById('adBlockBtn')?.classList.toggle('active', this.adBlockActive);
            this.applyImageMode();
            this.applyAdBlock();
        }

        sayHi() {
            console.log('%c✅ 游民沙雕图插件已生效', 'padding:6px 12px 6px 10px;color:green;border:1px solid green;font-size:12px;');
        }
    }

    new GamerskyImageHelper();
})();
