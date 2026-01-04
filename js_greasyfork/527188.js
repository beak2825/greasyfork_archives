// ==UserScript==
// @name         ESJZone编辑器优化
// @namespace    http://tampermonkey.net/
// @description  该脚本用于优化ESJZone编辑器
// @version      1.10
// @author       PipeYume
// @license      MIT
// @match        https://www.esjzone.cc/my/post/*
// @match        https://www.esjzone.one/my/post/*
// @match        https://www.esjzone.cc/detail/*
// @match        https://www.esjzone.one/detail/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527188/ESJZone%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527188/ESJZone%E7%BC%96%E8%BE%91%E5%99%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    let currentLogLevel = LOG_LEVELS.DEBUG;
    
    const logger = {
        debug: (...args) => {
            if (currentLogLevel <= LOG_LEVELS.DEBUG) console.debug('[DEBUG]', ...args);
        },
        info: (...args) => {
            if (currentLogLevel <= LOG_LEVELS.INFO) console.info('[INFO]', ...args);
        },
        warn: (...args) => {
            if (currentLogLevel <= LOG_LEVELS.WARN) console.warn('[WARN]', ...args);
        },
        error: (...args) => {
            if (currentLogLevel <= LOG_LEVELS.ERROR) console.error('[ERROR]', ...args);
        },
    };

    if (window.location.href.includes('/my/post/')) {
        // 恢复帖子页的文章编辑区为原始HTML
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const rawContentDiv = doc.querySelector('#artEditor');

                if (rawContentDiv) {
                    logger.info('原始编辑区内容:\n', rawContentDiv);
                    window.addEventListener("load", (th, ev)=>{
                        const contentDiv = document.querySelector('div.fr-element.fr-view[contenteditable="true"]');
                        if (contentDiv) {
                            contentDiv.innerHTML = rawContentDiv.innerHTML;
                            logger.info("编辑区已替换为原始形式\n", contentDiv.innerHTML);
                        } else {
                            logger.warn("页面中未找到编辑器区域");
                        }
                    })
                } else {
                    logger.warn("原始请求中未找到编辑器区域\n", response.responseText);
                }
            },
            onerror: function(error) {
                logger.error("请求失败:", error);
            }
        });
    }else if(window.location.href.includes("/detail/")){
        // 恢复书籍页的简介编辑区为原始HTML
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('modify_detail.php') && method.toUpperCase() === 'POST') {
                this.addEventListener('load', () => {
                    try {
                      const { html } = JSON.parse(this.responseText);
                      if (html) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const rawContentDiv = doc.querySelector("#bookDesc");
                        logger.info('原始编辑区内容:\n', rawContentDiv);

                        const observer = new MutationObserver(() => {
                            let contentDiv = document.querySelector('#bookDesc div.fr-element.fr-view[contenteditable="true"]');
                            if (contentDiv) {
                                contentDiv.innerHTML = rawContentDiv.innerHTML;
                                logger.info("编辑区已替换为原始形式\n", contentDiv.innerHTML);
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                      }
                    } catch(e){
                        logger.warn("书籍页编辑区解析失败\n", e)
                    }
                  });
            }
            originalOpen.apply(this, arguments);
        };
    }
})();
