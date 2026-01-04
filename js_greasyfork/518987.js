// ==UserScript==
// @name         获取网站所有图片
// @version      2.1.1
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
// @downloadURL https://update.greasyfork.org/scripts/518987/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/518987/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ImageCollector {
        constructor() {
            this.imgList = new Set();
            this.zip = new JSZip();
            this.init();
        }

        init() {
            this.addStyles();
            this.registerMenu();
            hotkeys('alt+p', () => this.showImages());
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
                #imageList .close-btn,
                #imageList .load-more {
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
                    bottom: 10%;
                    left: 10%;
                    background: green;
                    z-index: 10001;
                }
                #imageList .load-more {
                    position: fixed;
                    bottom: 10%;
                    right: 10%;
                    background: blue;
                    z-index: 10001;
                }
            `;
            GM_addStyle(styles);
        }

        registerMenu() {
            GM_registerMenuCommand('获取图片 (Alt+P)', () => this.showImages());
        }

        collectImages() {
            const elements = $('img, canvas, [style*="background-image"]');
            elements.each((_, el) => {
                let src = '';
                if (el.tagName === 'IMG') {
                    src = el.src;
                } else if (el.tagName === 'CANVAS') {
                    src = el.toDataURL();
                } else {
                    const backgroundImage = getComputedStyle(el).backgroundImage;
                    if (backgroundImage.startsWith('url')) {
                        src = backgroundImage.slice(5, -2);
                    }
                }
                if (src && !this.imgList.has(src)) {
                    this.imgList.add(src);
                    this.appendImageToUI(src);
                }
            });
        }

        showImages() {
            this.collectImages();
            const container = $('#imageList');
            if (container.length === 0) {
                $('body').append(`
                    <div id="imageList">
                        <ul></ul>
                        <div class="download-all">下载所有图片</div>
                        <div class="close-btn">关闭</div>
                        <div class="load-more">继续加载</div>
                    </div>
                `);
                $('#imageList').on('click', '.download-all', () => this.downloadAll());
                $('#imageList').on('click', '.actions', (e) => {
                    const src = $(e.target).data('src');
                    this.downloadImage(src, `image_${Date.now()}.png`);
                });
                $('#imageList').on('click', '.close-btn', () => this.closeImages());
                $('#imageList').on('click', '.load-more', () => this.loadMoreImages());
            }

            $('#imageList ul').html(''); // 清空现有列表
            this.imgList.forEach((src) => this.appendImageToUI(src));
            $('#imageList').fadeIn();
        }

        appendImageToUI(src) {
            const listItem = `
                <li>
                    <img src="${src}" alt="image">
                    <div class="actions" data-src="${src}">下载</div>
                </li>`;
            $('#imageList ul').append(listItem);
        }

        closeImages() {
            $('#imageList').fadeOut();
        }

        downloadImage(src, fileName) {
            GM_download({
                url: src,
                name: fileName,
                onerror: () => alert(`图片下载失败: ${src}`)
            });
        }

        downloadAll() {
            if (this.imgList.size === 0) {
                alert('没有找到可下载的图片。');
                return;
            }
            const zipFolder = this.zip.folder('Images');
            const downloadQueue = Array.from(this.imgList);
            const processNext = () => {
                if (downloadQueue.length === 0) {
                    this.zip.generateAsync({ type: 'blob' }).then(content => {
                        saveAs(content, `Images_${Date.now()}.zip`);
                        alert('所有图片已打包下载完成！');
                    });
                    return;
                }
                const src = downloadQueue.shift();
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: src,
                    responseType: 'blob',
                    onload: (response) => {
                        const fileName = `image_${Date.now()}.png`;
                        zipFolder.file(fileName, response.response);
                        processNext();
                    },
                    onerror: () => {
                        console.error(`无法下载图片: ${src}`);
                        processNext();
                    }
                });
            };
            processNext();
        }

        loadMoreImages() {
            this.collectImages(); // 重新扫描页面并追加新图片
        }
    }

    new ImageCollector();
})();
