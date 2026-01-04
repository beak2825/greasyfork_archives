// ==UserScript==
// @name         获取网站所有图片
// @version      2.1.3-beta
// @description  支持动态加载的图片实时显示，添加手动加载按钮便于操作。
// @author       BennieCHAN
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hotkeys-js/3.9.1/hotkeys.min.js
// @namespace https://greasyfork.org/users/1381791
// @downloadURL https://update.greasyfork.org/scripts/519000/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/519000/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ImageCollector {
        constructor() {
            this.imgList = new Set();
            this.init();
        }

        init() {
            this.addStyles();
            this.registerMenu();
        }

        addStyles() {
            const styles = `
                #imageList {
                    position: fixed;
                    top: 10%;
                    left: 10%;
                    width: 80%;
                    height: 80%;
                    background: white;
                    overflow: auto;
                    z-index: 9999;
                    border: 2px solid black;
                    display: none;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    border-radius: 8px;
                }
                #imageList ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                #imageList li {
                    margin: 10px;
                    position: relative;
                    width: 150px;
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid gray;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    cursor: pointer;
                    overflow: hidden;
                }
                #imageList img {
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                }
                #imageList .actions {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 2px 5px;
                    font-size: 12px;
                    border-radius: 3px;
                    cursor: pointer;
                    z-index: 10;
                }
                #imageList .download-all,
                #imageList .close-btn {
                    margin: 10px;
                    cursor: pointer;
                    display: inline-block;
                    background: black;
                    color: white;
                    padding: 5px 10px;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 5px;
                    user-select: none;
                }
                #imageList .close-btn {
                    position: fixed;
                    top: 10%;
                    right: 10%;
                    background: red;
                    z-index: 10000;
                }
                #imageList .download-all {
                    position: fixed;
                    bottom: 5%;
                    left: 5%;
                    background: green;
                    z-index: 10001;
                }
            `;
            GM_addStyle(styles);
        }

        registerMenu() {
            GM_registerMenuCommand('列出图片', () => this.showImages());
        }

        collectImages() {
            const imageUrls = new Set();

            // 获取 img 标签的 src
            const images = document.images;
            Array.from(images).forEach(img => {
                if (img.src) imageUrls.add(img.src);
            });

            // 获取背景图片
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const bgImage = getComputedStyle(el).backgroundImage;
                if (bgImage && bgImage.includes('url(')) {
                    const url = bgImage.replace(/.*url\(["']?(.+?)["']?\).*/, '$1');
                    if (url) imageUrls.add(url);
                }
            });

            return Array.from(imageUrls);
        }

        showImages() {
            const images = this.collectImages();
            if (images.length === 0) {
                alert('未找到任何图片！');
                return;
            }

            let container = document.getElementById('imageList');
            if (!container) {
                document.body.insertAdjacentHTML('beforeend', `
                    <div id="imageList">
                        <ul></ul>
                        <div class="download-all">下载所有图片</div>
                        <div class="close-btn">关闭</div>
                    </div>
                `);
                container = document.getElementById('imageList');

                container.querySelector('.download-all').addEventListener('click', () => this.downloadAll(images));
                container.querySelector('.close-btn').addEventListener('click', () => this.closeImages());
            }

            const ul = container.querySelector('ul');
            ul.innerHTML = ''; // 清空已有内容

            images.forEach(src => {
                ul.insertAdjacentHTML('beforeend', `
                    <li>
                        <img src="${src}" alt="image">
                        <div class="actions" data-src="${src}">下载</div>
                    </li>
                `);
            });

            container.querySelectorAll('.actions').forEach(btn => {
                btn.addEventListener('click', e => {
                    const src = e.target.dataset.src;
                    this.downloadImage(src, this.getFileName(src));
                });
            });

            container.style.display = 'block';
        }

        closeImages() {
            const container = document.getElementById('imageList');
            if (container) container.style.display = 'none';
        }

        downloadImage(src, fileName) {
            GM_download({
                url: src,
                name: fileName,
                onerror: () => alert(`图片下载失败: ${src}`)
            });
        }

        downloadAll(images) {
            images.forEach(src => this.downloadImage(src, this.getFileName(src)));
        }

        getFileName(src) {
            return src.split('/').pop().split('?')[0] || `image_${Date.now()}.png`;
        }
    }

    new ImageCollector();
})();

