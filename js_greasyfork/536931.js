// ==UserScript==
// @name         巴哈姆特Dx
// @namespace    https://forum.gamer.com.tw/
// @version      2025.1021
// @description  整合圖片懸浮顯示留言、展開留言功能
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @match        https://forum.gamer.com.tw/G2.php?*
// @require      https://unpkg.com/popper.js@1
// @require      https://unpkg.com/tippy.js@5
// @resource     TIPPY_LIGHT_THEME https://unpkg.com/tippy.js@6/themes/light.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// 1021應該只是修復留言懸浮顯示的bug其它沒有改變
// @downloadURL https://update.greasyfork.org/scripts/536931/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9Dx.user.js
// @updateURL https://update.greasyfork.org/scripts/536931/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9Dx.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let overlay, enlargedImg, activeImg, hoverTimeout, replyMap = new Map();
    const abortController = new AbortController();

    const tippyLightTheme = GM_getResourceText("TIPPY_LIGHT_THEME");
    if (tippyLightTheme) {
        GM_addStyle(tippyLightTheme);
    }
    GM_addStyle(`.c-post.c-section__main img { image-rendering: -webkit-optimize-contrast; }`);

    function createOverlay() {
        if (overlay) return; // 防止重复创建
        overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
            pointerEvents: 'none'
        });
        document.body.appendChild(overlay);

        enlargedImg = document.createElement('img');
        Object.assign(enlargedImg.style, {
            maxWidth: '99vw',
            maxHeight: '99vh',
            objectFit: 'contain',
            pointerEvents: 'none'
        });
        overlay.appendChild(enlargedImg);
    }

    function showEnlargedImage(img) {
        createOverlay(); // 确保覆盖层存在
        const rawSrc = img.src.split('?')[0];
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let displayWidth = img.naturalWidth;
        let displayHeight = img.naturalHeight;

        if (img.naturalWidth > viewportWidth || img.naturalHeight > viewportHeight) {
            const imgAspectRatio = img.naturalWidth / img.naturalHeight;
            if (imgAspectRatio > viewportWidth / viewportHeight) {
                displayWidth = viewportWidth * 0.99;
                displayHeight = displayWidth / imgAspectRatio;
            } else {
                displayHeight = viewportHeight * 0.99;
                displayWidth = displayHeight * imgAspectRatio;
            }
        }

        enlargedImg.src = rawSrc;
        enlargedImg.style.width = `${displayWidth}px`;
        enlargedImg.style.height = `${displayHeight}px`;
        overlay.style.display = 'flex';
    }

    function hideEnlargedImage() {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    function processImage(img) {
        if (img.dataset.processed) return;

        const excludePattern = /(editor\/emotion|avataruserpic)/;
        if (excludePattern.test(img.src)) return;

        img.dataset.processed = 'true'; // 使用字符串
        img.style.cursor = 'zoom-in';

        if (img.src.includes('?')) {
            const rawSrc = img.src.split('?')[0];
            img.dataset.originalSrc = img.src;
            img.src = rawSrc;
        }

        const handler = function (e) {
            clearTimeout(hoverTimeout);
            if (e.type === 'mouseenter') {
                activeImg = img;
                hoverTimeout = setTimeout(() => showEnlargedImage(img), 100);
            } else if (e.type === 'mouseleave') {
                if (activeImg === img) {
                    hoverTimeout = setTimeout(() => {
                        hideEnlargedImage();
                        activeImg = null;
                    }, 100);
                }
            }
        };

        img.addEventListener('mouseenter', handler);
        img.addEventListener('mouseleave', handler);
    }

    function checkForNewImages() {
        document.querySelectorAll('.c-post.c-section__main img:not([data-processed])').forEach(img => {
            if (img.complete && img.naturalHeight > 0) {
                processImage(img);
            } else {
                const loadHandler = () => {
                    processImage(img);
                    img.removeEventListener('load', loadHandler);
                };
                img.addEventListener('load', loadHandler);
            }
        });
    }

    function waitElement(selector) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function addReplyMouseoverListener(node) {
        const commentEles = new Set();
        node.querySelectorAll('.reply-content a[href^="javascript:Forum.C.openCommentDialog"]').forEach(replyEle => {
            const commentEle = replyEle.closest(".c-reply__item");
            if (commentEle && !commentEles.has(commentEle)) {
                commentEles.add(commentEle);
                addReplyTooltip(commentEle);
            }
        });
    }

    function addReplyTooltip(commentEle) {
        commentEle.querySelectorAll('a[href^="javascript:Forum.C.openCommentDialog"]').forEach(replyEle => {
            const matches = replyEle.getAttribute("href").match(/\d+/g);
            if (!matches || matches.length < 3) return; // 确保有足够的匹配项
            const [bsn, snB, snC] = matches;

            getReplyApiEle(bsn, snB, snC).then(replyApiEle => {
                if (!replyEle) return; // 确保元素仍然存在

                // 设置 tippy.js 配置
                replyEle.setAttribute('data-tippy-content', `<div class="dialogify" style="display: contents; text-align:left;"><div class="dialogify__body">${replyApiEle}</div></div>`);
                replyEle.setAttribute('data-tippy-theme', 'light'); // 默认主题
                replyEle.setAttribute('data-tippy-allowHTML', 'true');
                replyEle.setAttribute('data-tippy-interactive', 'true');
                replyEle.setAttribute('data-tippy-placement', 'top');

                const mouseHandler = () => {
                    if (!replyEle._tippyInstance) {
                        replyEle._tippyInstance = tippy(replyEle, {
                            maxWidth: 560,
                            interactive: true,
                            allowHTML: true,
                            appendTo: document.body,
                            theme: document.querySelector("html").dataset.theme === 'dark' ? 'dark' : 'light',
                            onShow(instance) {
                                // 在显示时可能需要再次格式化内容，如果Forum.C.commentFormatter依赖于弹出内容的DOM
                                // 但此脚本中 Forum.C.commentFormatter 可能无法在此处正确应用，因为内容已在tippy内部
                                // 原始代码试图在onShow中应用，但可能无效。这里保留逻辑，但可能需要调整。
                                const contentSpan = instance.popper.querySelector("span");
                                if (contentSpan && typeof Forum?.C?.commentFormatter === 'function') {
                                    Forum.C.commentFormatter(contentSpan);
                                }
                            },
                            onHidden(instance) {
                                // 不自动销毁实例，因为可能频繁悬停
                                // instance.destroy();
                            }
                        });
                    }
                    // 移除一次性事件监听器
                    replyEle.removeEventListener('mouseover', mouseHandler);
                };
                replyEle.addEventListener('mouseover', mouseHandler, { once: true });
            }).catch(error => {
                console.warn("Failed to fetch reply tooltip for snC:", snC, error);
            });
        });
    }

    function getReplyApiEle(bsn, snB, snC) {
        return new Promise((resolve, reject) => {
            if (replyMap.size > 50) replyMap.clear();
            if (replyMap.has(snC)) return resolve(replyMap.get(snC));

            fetch(`https://api.gamer.com.tw/forum/v1/comment_get.php?bsn=${bsn}&snB=${snB}&snC=${snC}&type=pc`, {
                credentials: "include",
                signal: abortController.signal
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(json => {
                if (json && json.data && json.data.comment && typeof json.data.comment.html === 'string') {
                    replyMap.set(snC, json.data.comment.html);
                    resolve(replyMap.get(snC));
                } else {
                    throw new Error("Invalid API response structure");
                }
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Fetch error in getReplyApiEle:", error);
                    reject(error); // 传递错误，以便调用者可以处理
                } else {
                    reject(error); // 即使是 AbortError 也传递，让调用者知道
                }
            });
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        checkForNewImages();
                        // 为新添加的节点也添加回复监听
                        addReplyMouseoverListener(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    checkForNewImages();

    const checkInterval = setInterval(checkForNewImages, 3000);

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        clearInterval(checkInterval);
        abortController.abort();
        // 恢复图片原始链接
        document.querySelectorAll('img[data-original-src]').forEach(img => {
            if (img.dataset.originalSrc) {
                img.src = img.dataset.originalSrc;
                delete img.dataset.originalSrc;
            }
            delete img.dataset.processed;
        });
        // 清理可能存在的 tippy 实例
        document.querySelectorAll('a[data-tippy-content]').forEach(el => {
            if (el._tippyInstance) {
                el._tippyInstance.destroy();
            }
        });
    });

    switch (window.location.host) {
        case "forum.gamer.com.tw":
            // 确保 DOM 加载完成后再执行
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    document.querySelectorAll("[id^=showoldCommend_]").forEach(el => el.click());
                    document.querySelectorAll("[id^=Commendlist]").forEach(commentList => {
                        const listObserver = new MutationObserver(mutations => {
                            mutations.forEach(mutation => {
                                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                    mutation.addedNodes.forEach(node => {
                                        if (node.nodeType === Node.ELEMENT_NODE) {
                                            addReplyMouseoverListener(node);
                                        }
                                    });
                                }
                            });
                        });
                        listObserver.observe(commentList, { childList: true });
                    });
                });
            } else {
                document.querySelectorAll("[id^=showoldCommend_]").forEach(el => el.click());
                document.querySelectorAll("[id^=Commendlist]").forEach(commentList => {
                    const listObserver = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        addReplyMouseoverListener(node);
                                    }
                                });
                            }
                        });
                    });
                    listObserver.observe(commentList, { childList: true });
                });
            }
            break;
        case "gnn.gamer.com.tw":
            waitElement('#comment a[href^="javascript:get_all_comment"]').then(e => {
                if (e && e.getAttribute('href')) {
                    const funcStr = e.getAttribute('href').split(':')[1];
                    if (funcStr) {
                        new Function(funcStr)();
                    }
                }
            }).catch(console.error); // 捕获 waitElement 的错误
            break;
    }

    addReplyMouseoverListener(document);

})();