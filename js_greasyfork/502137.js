// ==UserScript==
// @name         获取网站所有图片-zhangtia
// @namespace    https://www.adss.com
// @version      1.7
// @description  获取网站的所有图片，zhangtia。
// @author       Mr.Zhang
// @license      MIT
// @match        *://*/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/502137/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87-zhangtia.user.js
// @updateURL https://update.greasyfork.org/scripts/502137/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87-zhangtia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '获取所有链接和资源';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = 10000;
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        // 初始化分类对象
        const categorizedLinks = {
            images: [],
            videos: [],
            audios: [],
            html: [],
            js: [],
            css: [],
            other: []
        };

        // 提取所有图片链接
        function extractImages() {
            const imageLinks = [];
            const imageExtensions = /\.(jpeg|jpg|gif|png|svg|webp)$/i;

            // 从所有 img 标签中提取 src
            document.querySelectorAll('img[src]').forEach(img => {
                const src = img.src;
                if (imageExtensions.test(src)) {
                    imageLinks.push(src);
                }
            });
         const imgElements = Array.from(document.querySelectorAll('img'));
        	imgElements.forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && !categorizedLinks.images.includes(src)) {
                categorizedLinks.images.push(src);
            }
        });
            // 从背景图片中提取
            const elementsWithBackground = document.querySelectorAll('*');
            elementsWithBackground.forEach(el => {
                const bgImage = getComputedStyle(el).backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
                    if (urlMatch) {
                        const url = urlMatch[1];
                        if (imageExtensions.test(url)) {
                            imageLinks.push(new URL(url, document.baseURI).href);
                        }
                    }
                }
            });

            // 去重并分类
            imageLinks.forEach(link => {
                if (!categorizedLinks.images.includes(link)) {
                    categorizedLinks.images.push(link);
                }
            });
        }

        // 提取其他资源
        function extractOtherLinks() {
            const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
            links.forEach(link => {
                if (link.match(/\.(mp4|webm|ogv)$/i)) {
                    categorizedLinks.videos.push(link);
                } else if (link.match(/\.(mp3|ogg|wav)$/i)) {
                    categorizedLinks.audios.push(link);
                } else if (link.match(/\.html?$/i)) {
                    categorizedLinks.html.push(link);
                } else if (link.match(/\.js$/i)) {
                    categorizedLinks.js.push(link);
                } else if (link.match(/\.css$/i)) {
                    categorizedLinks.css.push(link);
                } else {
                    categorizedLinks.other.push(link);
                }
            });

            // 获取所有脚本和CSS文件链接
            const scripts = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
            scripts.forEach(src => {
                if (src.match(/\.js$/i)) {
                    categorizedLinks.js.push(src);
                } else {
                    categorizedLinks.other.push(src);
                }
            });

            const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
            styles.forEach(href => {
                if (href.match(/\.css$/i)) {
                    categorizedLinks.css.push(href);
                } else {
                    categorizedLinks.other.push(href);
                }
            });

            // 提取 CSS 中的 @import 资源
            function extractCssResources(cssText, baseUrl) {
                const urls = [];
                const importUrlPattern = /@import\s+url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/g;
                let match;

                while ((match = importUrlPattern.exec(cssText)) !== null) {
                    urls.push(new URL(match[1], baseUrl).href);
                }

                return urls;
            }

            function processCss(cssElement) {
                const baseUrl = (cssElement.ownerDocument || document).baseURI;
                if (cssElement instanceof HTMLStyleElement) {
                    const cssText = cssElement.textContent || '';
                    return extractCssResources(cssText, baseUrl);
                } else if (cssElement instanceof HTMLLinkElement && cssElement.href) {
                    return fetch(cssElement.href).then(response => response.text()).then(cssText => extractCssResources(cssText, cssElement.href));
                }
                return [];
            }

            // 处理 CSS 文件和内嵌样式
            const cssPromises = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(cssElement => processCss(cssElement));

            Promise.all(cssPromises).then(results => {
                results.flat().forEach(url => {
                    if (url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i)) {
                        if (!categorizedLinks.images.includes(url)) {
                            categorizedLinks.images.push(url);
                        }
                    } else if (url.match(/\.(mp4|webm|ogv)$/i)) {
                        if (!categorizedLinks.videos.includes(url)) {
                            categorizedLinks.videos.push(url);
                        }
                    } else if (url.match(/\.(mp3|ogg|wav)$/i)) {
                        if (!categorizedLinks.audios.includes(url)) {
                            categorizedLinks.audios.push(url);
                        }
                    } else if (url.match(/\.js$/i)) {
                        if (!categorizedLinks.js.includes(url)) {
                            categorizedLinks.js.push(url);
                        }
                    } else if (url.match(/\.css$/i)) {
                        if (!categorizedLinks.css.includes(url)) {
                            categorizedLinks.css.push(url);
                        }
                    } else {
                        if (!categorizedLinks.other.includes(url)) {
                            categorizedLinks.other.push(url);
                        }
                    }
                });

                // 创建并显示结果对话框
                const resultDiv = document.createElement('div');
                resultDiv.style.position = 'fixed';
                resultDiv.style.top = '10px';
                resultDiv.style.left = '10px';
                resultDiv.style.zIndex = 10000;
                resultDiv.style.backgroundColor = 'white';
                resultDiv.style.border = '1px solid #ccc';
                resultDiv.style.padding = '10px';
                resultDiv.style.maxHeight = '90vh';
                resultDiv.style.overflowY = 'auto';
                resultDiv.style.width = '400px';
                resultDiv.style.resize = 'both';
                resultDiv.style.overflow = 'auto';
                document.body.appendChild(resultDiv);

                const closeButton = document.createElement('button');
                closeButton.textContent = '关闭';
                closeButton.style.display = 'block';
                closeButton.style.margin = '10px 0';
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(resultDiv);
                });
                resultDiv.appendChild(closeButton);

                const fullscreenButton = document.createElement('button');
                fullscreenButton.textContent = '全屏';
                fullscreenButton.style.display = 'block';
                fullscreenButton.style.margin = '10px 0';
                fullscreenButton.addEventListener('click', () => {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                        fullscreenButton.textContent = '全屏';
                    } else {
                        resultDiv.requestFullscreen();
                        fullscreenButton.textContent = '退出全屏';
                    }
                });
                resultDiv.appendChild(fullscreenButton);

                const ul = document.createElement('ul');
                resultDiv.appendChild(ul);

                Object.keys(categorizedLinks).forEach(category => {
                    const li = document.createElement('li');
                    li.textContent = category.toUpperCase();
                    ul.appendChild(li);

                    const innerUl = document.createElement('ul');
                    categorizedLinks[category].forEach(link => {
                        const innerLi = document.createElement('li');
                        innerLi.textContent = link;
                        innerUl.appendChild(innerLi);
                    });
                    ul.appendChild(innerUl);
                });
            });
        }

        // 执行提取操作
        extractImages();
        extractOtherLinks();
    });
})();